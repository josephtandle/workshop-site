-- Migration 011 created a FUNCTIONAL unique index on (event_slug, lower(attendee_email)).
-- The upsert in saveRegistrationIntake targets the literal columns
-- (event_slug, attendee_email), and Postgres cannot match a plain ON CONFLICT
-- column list against an expression index. Every intake write failed with
-- 42P10 "there is no unique or exclusion constraint matching the ON CONFLICT
-- specification" and the answers were lost.
--
-- A plain unique index is equivalent here because saveRegistrationIntake always
-- lowercases the email before writing, so the raw column is already normalised.

DROP INDEX IF EXISTS event_registration_intake_unique_email;

CREATE UNIQUE INDEX IF NOT EXISTS event_registration_intake_unique_email
  ON event_registration_intake (event_slug, attendee_email);
