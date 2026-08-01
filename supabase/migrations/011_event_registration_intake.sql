-- Intake answers captured BEFORE checkout, so a paid registration never has to
-- round-trip long free-text through Stripe metadata (values there cap at 500
-- chars and would silently truncate a business description with links).
--
-- Writing this row before the Stripe redirect also means we keep the answers
-- from people who start checkout and never finish.

CREATE TABLE IF NOT EXISTS event_registration_intake (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL,
  attendee_name text NOT NULL,
  attendee_email text NOT NULL,
  whatsapp_number text,
  business_context text,
  acquisition_ref text NOT NULL DEFAULT 'joe-che',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- One intake row per person per event. Re-submitting (or retrying a failed
-- checkout) updates the existing row rather than piling up duplicates.
CREATE UNIQUE INDEX IF NOT EXISTS event_registration_intake_unique_email
  ON event_registration_intake (event_slug, lower(attendee_email));

CREATE INDEX IF NOT EXISTS event_registration_intake_event_slug_idx
  ON event_registration_intake (event_slug);

-- Mirrored onto the registration itself so attendee exports and the events
-- report do not need a join.
ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS whatsapp_number text;

ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS business_context text;
