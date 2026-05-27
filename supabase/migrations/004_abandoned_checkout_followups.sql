CREATE TABLE IF NOT EXISTS event_automation_controls (
  automation_key TEXT PRIMARY KEY,
  mode TEXT NOT NULL DEFAULT 'off',
  test_recipients JSONB NOT NULL DEFAULT '["newyork1@gmail.com","joe@mastermindshq.business"]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO event_automation_controls (automation_key, mode, test_recipients)
VALUES (
  'abandoned_checkout_day_1',
  'off',
  '["newyork1@gmail.com","joe@mastermindshq.business"]'::jsonb
)
ON CONFLICT (automation_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS event_checkout_followup_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  followup_type TEXT NOT NULL,
  event_slug TEXT NOT NULL,
  attendee_email TEXT NOT NULL,
  attendee_name TEXT,
  source_checkout_session_id TEXT,
  source_checkout_created_at TIMESTAMPTZ,
  live_sent_at TIMESTAMPTZ,
  last_test_sent_at TIMESTAMPTZ,
  last_test_source_checkout_session_id TEXT,
  suppressed_at TIMESTAMPTZ,
  suppression_reason TEXT,
  last_error_at TIMESTAMPTZ,
  last_error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS event_checkout_followup_state_unique
  ON event_checkout_followup_state (followup_type, event_slug, lower(attendee_email));

CREATE UNIQUE INDEX IF NOT EXISTS event_checkout_followup_state_upsert_unique
  ON event_checkout_followup_state (followup_type, event_slug, attendee_email);

CREATE TABLE IF NOT EXISTS event_checkout_followup_suppressions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug TEXT,
  email TEXT NOT NULL,
  reason TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS event_checkout_followup_suppressions_lookup
  ON event_checkout_followup_suppressions (lower(email), event_slug, active);
