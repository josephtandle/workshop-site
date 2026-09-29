-- Already applied in production 2026-09-29 via the Management API. Safe to replay.
-- 016: two permanent AI capability fields + live-event attendance (Joe 2026-09-29).
-- "Self-graded" = what the person says about themselves (sign-up step 2, or a
-- live-class chat answer); the most recent one wins, with its source and date.
-- "Our grade" = our assessment (hourly estimator, or a manual grade with evidence).
-- The legacy ai_level / ai_level_source columns stay as they are for old readers.
ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS ai_self_level smallint CHECK (ai_self_level BETWEEN 0 AND 17),
  ADD COLUMN IF NOT EXISTS ai_self_level_source text,
  ADD COLUMN IF NOT EXISTS ai_self_level_note text,
  ADD COLUMN IF NOT EXISTS ai_self_level_at timestamptz,
  ADD COLUMN IF NOT EXISTS ai_our_grade smallint CHECK (ai_our_grade BETWEEN 0 AND 17),
  ADD COLUMN IF NOT EXISTS ai_our_grade_source text CHECK (ai_our_grade_source IN ('estimate', 'manual')),
  ADD COLUMN IF NOT EXISTS ai_our_grade_note text,
  ADD COLUMN IF NOT EXISTS ai_our_grade_at timestamptz,
  ADD COLUMN IF NOT EXISTS attended boolean,
  ADD COLUMN IF NOT EXISTS attended_minutes integer CHECK (attended_minutes >= 0),
  ADD COLUMN IF NOT EXISTS attendance_note text,
  ADD COLUMN IF NOT EXISTS attendance_marked_at timestamptz;

-- Mirror writes to the legacy column into the two permanent fields, so the
-- live sign-up API and older scripts keep both fields current without a deploy.
-- A self report always refreshes self-graded. An estimate only fills our grade
-- when nothing is there yet, so a manual grade is never overwritten.
CREATE OR REPLACE FUNCTION event_registrations_mirror_ai_level() RETURNS trigger AS $$
BEGIN
  IF NEW.ai_level IS NOT NULL AND NEW.ai_level_source = 'self'
     AND (TG_OP = 'INSERT' OR OLD.ai_level IS DISTINCT FROM NEW.ai_level OR OLD.ai_level_source IS DISTINCT FROM NEW.ai_level_source) THEN
    NEW.ai_self_level := NEW.ai_level;
    NEW.ai_self_level_source := 'signup';
    NEW.ai_self_level_at := COALESCE(NEW.ai_level_set_at, now());
  END IF;
  IF NEW.ai_level IS NOT NULL AND NEW.ai_level_source = 'estimate' AND NEW.ai_our_grade IS NULL THEN
    NEW.ai_our_grade := NEW.ai_level;
    NEW.ai_our_grade_source := 'estimate';
    NEW.ai_our_grade_note := NEW.ai_level_note;
    NEW.ai_our_grade_at := COALESCE(NEW.ai_level_set_at, now());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS event_registrations_mirror_ai_level ON event_registrations;
CREATE TRIGGER event_registrations_mirror_ai_level
  BEFORE INSERT OR UPDATE ON event_registrations
  FOR EACH ROW EXECUTE FUNCTION event_registrations_mirror_ai_level();

-- Backfill: sign-up self reports become self-graded; estimates become our grade.
UPDATE event_registrations
   SET ai_self_level = ai_level, ai_self_level_source = 'signup', ai_self_level_at = COALESCE(ai_level_set_at, registered_at)
 WHERE ai_level IS NOT NULL AND ai_level_source = 'self' AND ai_self_level IS NULL;

UPDATE event_registrations
   SET ai_our_grade = ai_level, ai_our_grade_source = 'estimate', ai_our_grade_note = ai_level_note, ai_our_grade_at = COALESCE(ai_level_set_at, registered_at)
 WHERE ai_level IS NOT NULL AND ai_level_source = 'estimate' AND ai_our_grade IS NULL;
