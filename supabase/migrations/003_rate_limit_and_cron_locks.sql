-- Sliding-window rate limit log
-- Rows are keyed by "endpoint:ip" and auto-cleaned per request.
CREATE TABLE IF NOT EXISTS rate_limit_log (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS rate_limit_log_key_created
  ON rate_limit_log (key, created_at);

-- Cron window locks
-- One row per (slug, window-label, date). Unique constraint ensures only
-- the first cron instance to insert wins; the second gets a conflict error
-- and skips processing. Resend idempotency keys are the email-level safety
-- net; this lock prevents redundant DB work.
CREATE TABLE IF NOT EXISTS cron_window_locks (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_key   TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
