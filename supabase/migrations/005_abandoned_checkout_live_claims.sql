ALTER TABLE event_checkout_followup_state
  ADD COLUMN IF NOT EXISTS live_send_claimed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS live_send_claim_token TEXT;

CREATE INDEX IF NOT EXISTS event_checkout_followup_live_claim_lookup
  ON event_checkout_followup_state (followup_type, event_slug, attendee_email, live_send_claim_token);

CREATE OR REPLACE FUNCTION claim_event_checkout_followup_live_send(
  p_followup_type TEXT,
  p_event_slug TEXT,
  p_attendee_email TEXT,
  p_attendee_name TEXT,
  p_source_checkout_session_id TEXT,
  p_source_checkout_created_at TIMESTAMPTZ,
  p_claim_token TEXT,
  p_now TIMESTAMPTZ DEFAULT NOW(),
  p_stale_after INTERVAL DEFAULT INTERVAL '30 minutes'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  v_row_count INTEGER := 0;
BEGIN
  INSERT INTO event_checkout_followup_state (
    followup_type,
    event_slug,
    attendee_email,
    attendee_name,
    source_checkout_session_id,
    source_checkout_created_at,
    created_at,
    updated_at
  )
  VALUES (
    p_followup_type,
    p_event_slug,
    lower(trim(p_attendee_email)),
    NULLIF(trim(p_attendee_name), ''),
    p_source_checkout_session_id,
    p_source_checkout_created_at,
    p_now,
    p_now
  )
  ON CONFLICT (followup_type, event_slug, attendee_email) DO NOTHING;

  UPDATE event_checkout_followup_state
  SET
    attendee_name = COALESCE(NULLIF(trim(p_attendee_name), ''), attendee_name),
    source_checkout_session_id = p_source_checkout_session_id,
    source_checkout_created_at = p_source_checkout_created_at,
    live_send_claimed_at = p_now,
    live_send_claim_token = p_claim_token,
    updated_at = p_now
  WHERE followup_type = p_followup_type
    AND event_slug = p_event_slug
    AND attendee_email = lower(trim(p_attendee_email))
    AND live_sent_at IS NULL
    AND (
      live_send_claimed_at IS NULL
      OR live_send_claimed_at <= (p_now - p_stale_after)
      OR live_send_claim_token = p_claim_token
    );

  GET DIAGNOSTICS v_row_count = ROW_COUNT;
  RETURN v_row_count > 0;
END;
$$;
