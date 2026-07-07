CREATE TABLE IF NOT EXISTS ai_agent_income_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL,
  status TEXT NOT NULL,
  price_id TEXT,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ai_agent_income_subscriptions_stripe_subscription_id_unique
  ON ai_agent_income_subscriptions (stripe_subscription_id);

CREATE INDEX IF NOT EXISTS ai_agent_income_subscriptions_customer_idx
  ON ai_agent_income_subscriptions (stripe_customer_id);

CREATE INDEX IF NOT EXISTS ai_agent_income_subscriptions_email_idx
  ON ai_agent_income_subscriptions (lower(email));

CREATE TABLE IF NOT EXISTS telegram_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS telegram_links_token_unique
  ON telegram_links (token);

CREATE UNIQUE INDEX IF NOT EXISTS telegram_links_stripe_customer_id_unique
  ON telegram_links (stripe_customer_id);

CREATE INDEX IF NOT EXISTS telegram_links_email_idx
  ON telegram_links (lower(email));

CREATE TABLE IF NOT EXISTS stripe_webhook_events (
  event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS stripe_webhook_events_source_status_idx
  ON stripe_webhook_events (source, status, created_at);

-- Telegram gate bot needs telegram_user_id to bind a checkout link to the
-- Telegram user that redeemed it (agents/ai-agent-income-telegram-gate/).
ALTER TABLE telegram_links
  ADD COLUMN IF NOT EXISTS telegram_user_id TEXT,
  ADD COLUMN IF NOT EXISTS invite_link TEXT;

CREATE INDEX IF NOT EXISTS telegram_links_telegram_user_id_idx
  ON telegram_links (telegram_user_id);

CREATE UNIQUE INDEX IF NOT EXISTS telegram_links_telegram_user_id_unique
  ON telegram_links (telegram_user_id)
  WHERE telegram_user_id IS NOT NULL;
