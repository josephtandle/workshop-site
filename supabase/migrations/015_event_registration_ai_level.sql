-- These columns are already applied in production. Safe to replay elsewhere.
-- The database permits 0..17; the public signup currently offers only 0..14.
ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS ai_level smallint CHECK (ai_level BETWEEN 0 AND 17),
  ADD COLUMN IF NOT EXISTS ai_level_source text CHECK (ai_level_source IN ('self', 'estimate')),
  ADD COLUMN IF NOT EXISTS ai_level_note text,
  ADD COLUMN IF NOT EXISTS ai_level_set_at timestamptz;

ALTER TABLE event_registration_intake
  ADD COLUMN IF NOT EXISTS ai_level smallint,
  ADD COLUMN IF NOT EXISTS ai_level_source text;
