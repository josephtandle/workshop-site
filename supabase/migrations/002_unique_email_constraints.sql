-- Prevent duplicate confirmed registrations for the same email + event.
-- Uses a partial index so cancelled rows don't block re-registration.
CREATE UNIQUE INDEX IF NOT EXISTS event_registrations_unique_confirmed_email
  ON event_registrations (event_slug, lower(attendee_email))
  WHERE status = 'confirmed';

-- Prevent duplicate active waitlist entries for the same email + event.
CREATE UNIQUE INDEX IF NOT EXISTS event_waitlist_unique_active_email
  ON event_waitlist (event_slug, lower(email))
  WHERE status = 'active';
