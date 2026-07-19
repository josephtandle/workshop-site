ALTER TABLE event_registrations
  ADD COLUMN IF NOT EXISTS acquisition_ref text NOT NULL DEFAULT 'joe-che';
