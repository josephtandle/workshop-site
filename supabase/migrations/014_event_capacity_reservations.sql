CREATE TABLE IF NOT EXISTS event_capacity_reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL,
  attendee_email text NOT NULL,
  status text NOT NULL CHECK (status IN ('held', 'confirmed', 'released')),
  checkout_session_id text,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  confirmed_at timestamptz,
  released_at timestamptz,
  CONSTRAINT event_capacity_reservations_held_expiry
    CHECK (status <> 'held' OR expires_at IS NOT NULL)
);

ALTER TABLE public.event_capacity_reservations ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.event_capacity_reservations FROM anon, authenticated;

ALTER TABLE public.event_registrations
  ADD COLUMN IF NOT EXISTS capacity_reservation_id uuid
  REFERENCES public.event_capacity_reservations(id);

CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_capacity_reservation_id
  ON public.event_registrations (capacity_reservation_id)
  WHERE capacity_reservation_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS event_capacity_reservations_active_email
  ON event_capacity_reservations (event_slug, lower(attendee_email))
  WHERE status IN ('held', 'confirmed');

CREATE UNIQUE INDEX IF NOT EXISTS event_capacity_reservations_checkout_session
  ON event_capacity_reservations (checkout_session_id)
  WHERE checkout_session_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS event_capacity_reservations_event_status
  ON event_capacity_reservations (event_slug, status, expires_at);

-- This event was added after the original dinner template. Preserve any
-- registrations created before this rollout so the capacity count remains
-- accurate if the migration is applied after a manual registration.
INSERT INTO event_capacity_reservations (
  event_slug,
  attendee_email,
  status,
  confirmed_at
)
SELECT
  event_slug,
  lower(attendee_email),
  'confirmed',
  COALESCE(registered_at, now())
FROM event_registrations
WHERE event_slug = 'joe-ches-connection-dinner-sunday-october-04-2026'
  AND status = 'confirmed'
ON CONFLICT (event_slug, lower(attendee_email)) WHERE status IN ('held', 'confirmed') DO NOTHING;

UPDATE event_registrations registrations
SET capacity_reservation_id = reservations.id
FROM event_capacity_reservations reservations
WHERE registrations.event_slug = reservations.event_slug
  AND lower(registrations.attendee_email) = lower(reservations.attendee_email)
  AND registrations.event_slug = 'joe-ches-connection-dinner-sunday-october-04-2026'
  AND registrations.status = 'confirmed'
  AND registrations.capacity_reservation_id IS NULL;

CREATE OR REPLACE FUNCTION claim_event_capacity_seat(
  p_event_slug text,
  p_attendee_email text,
  p_capacity integer,
  p_hold_minutes integer
)
RETURNS TABLE (
  reservation_id uuid,
  status text,
  expires_at timestamptz,
  checkout_session_id text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  normalized_email text := lower(trim(p_attendee_email));
  existing event_capacity_reservations%ROWTYPE;
  reserved_count integer;
BEGIN
  IF p_capacity IS NULL OR p_capacity < 1 OR p_hold_minutes IS NULL OR p_hold_minutes < 1 THEN
    RAISE EXCEPTION 'capacity and hold duration must be positive';
  END IF;

  IF normalized_email = '' THEN
    RAISE EXCEPTION 'attendee email is required';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(p_event_slug, 0));

  UPDATE event_capacity_reservations AS reservations
  SET status = 'released', released_at = now()
  WHERE reservations.event_slug = p_event_slug
    AND reservations.status = 'held'
    AND reservations.checkout_session_id IS NULL
    AND reservations.expires_at <= now();

  SELECT * INTO existing
  FROM event_capacity_reservations AS reservations
  WHERE reservations.event_slug = p_event_slug
    AND lower(reservations.attendee_email) = normalized_email
    AND reservations.status IN ('held', 'confirmed')
  LIMIT 1;

  IF FOUND THEN
    RETURN QUERY
    SELECT existing.id, existing.status, existing.expires_at, existing.checkout_session_id;
    RETURN;
  END IF;

  SELECT count(*) INTO reserved_count
  FROM event_capacity_reservations AS reservations
  WHERE reservations.event_slug = p_event_slug
    AND (
      reservations.status = 'confirmed'
      OR (reservations.status = 'held' AND reservations.expires_at > now())
    );

  IF reserved_count >= p_capacity THEN
    RETURN;
  END IF;

  INSERT INTO event_capacity_reservations (
    event_slug,
    attendee_email,
    status,
    expires_at
  )
  VALUES (
    p_event_slug,
    normalized_email,
    'held',
    -- The Stripe Checkout session is limited to a 30-minute customer window.
    -- This minute is a settlement buffer: an attached session is never
    -- recycled by this RPC, and Stripe's expiry webhook releases abandoned
    -- checkouts by their immutable session ID.
    now() + make_interval(mins => p_hold_minutes + 1)
  )
  RETURNING id, event_capacity_reservations.status, event_capacity_reservations.expires_at,
    event_capacity_reservations.checkout_session_id
  INTO reservation_id, status, expires_at, checkout_session_id;

  RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION attach_event_capacity_checkout(
  p_reservation_id uuid,
  p_checkout_session_id text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  reservation event_capacity_reservations%ROWTYPE;
BEGIN
  SELECT * INTO reservation
  FROM event_capacity_reservations
  WHERE id = p_reservation_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(reservation.event_slug, 0));

  UPDATE event_capacity_reservations
  SET checkout_session_id = p_checkout_session_id
  WHERE id = p_reservation_id
    AND status = 'held'
    AND expires_at > now()
    AND checkout_session_id IS NULL;

  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION confirm_event_capacity_seat(
  p_reservation_id uuid,
  p_checkout_session_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  reservation event_capacity_reservations%ROWTYPE;
BEGIN
  SELECT * INTO reservation
  FROM event_capacity_reservations
  WHERE id = p_reservation_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(reservation.event_slug, 0));

  SELECT * INTO reservation
  FROM event_capacity_reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF reservation.status = 'confirmed' THEN
    RETURN p_checkout_session_id IS NULL OR reservation.checkout_session_id = p_checkout_session_id;
  END IF;

  IF reservation.status <> 'held' THEN
    RETURN false;
  END IF;

  IF p_checkout_session_id IS NOT NULL
    AND (reservation.checkout_session_id IS NULL OR reservation.checkout_session_id <> p_checkout_session_id) THEN
    RETURN false;
  END IF;

  IF p_checkout_session_id IS NULL AND reservation.expires_at <= now() THEN
    UPDATE event_capacity_reservations
    SET status = 'released', released_at = now()
    WHERE id = p_reservation_id;
    RETURN false;
  END IF;

  UPDATE event_capacity_reservations
  SET status = 'confirmed', confirmed_at = now(), expires_at = NULL
  WHERE id = p_reservation_id;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION release_event_capacity_seat(
  p_reservation_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  reservation_event_slug text;
BEGIN
  SELECT event_slug INTO reservation_event_slug
  FROM event_capacity_reservations
  WHERE id = p_reservation_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(reservation_event_slug, 0));

  UPDATE event_capacity_reservations
  SET status = 'released', released_at = now()
  WHERE id = p_reservation_id
    AND status IN ('held', 'confirmed');

  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION release_event_capacity_checkout(
  p_checkout_session_id text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  reservation_event_slug text;
BEGIN
  SELECT event_slug INTO reservation_event_slug
  FROM event_capacity_reservations
  WHERE checkout_session_id = p_checkout_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(reservation_event_slug, 0));

  UPDATE event_capacity_reservations
  SET status = 'released', released_at = now()
  WHERE checkout_session_id = p_checkout_session_id
    AND status = 'held';

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION claim_event_capacity_seat(text, text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION attach_event_capacity_checkout(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION confirm_event_capacity_seat(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION release_event_capacity_seat(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION release_event_capacity_checkout(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION claim_event_capacity_seat(text, text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION attach_event_capacity_checkout(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION confirm_event_capacity_seat(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION release_event_capacity_seat(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION release_event_capacity_checkout(text) TO service_role;
