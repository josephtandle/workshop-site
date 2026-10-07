-- Server-only intake: deny direct public API roles; retain service_role access.
-- Target: vthjaejffmicevfrickp, public.event_registration_intake.
-- No public policies: registration uses the server secret client.
-- Revoke grants as well as enabling RLS because TRUNCATE bypasses row policies.
BEGIN;
SET LOCAL lock_timeout = '3s';
SET LOCAL statement_timeout = '10s';
ALTER TABLE public.event_registration_intake ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.event_registration_intake
  FROM anon, authenticated, PUBLIC;
COMMIT;
