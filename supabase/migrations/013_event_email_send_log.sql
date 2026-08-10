-- 013_event_email_send_log.sql
--
-- This is the Vercel/Supabase counterpart of the sqlite email_send_log
-- ledger in agents/mastermind-participants/lib/email-ledger.js: same
-- UNIQUE(recipient_email, slug) discipline, same claim-before-send ordering,
-- different runtime because Vercel cannot reach the sqlite file.

create table if not exists public.event_email_send_log (
  id              uuid        primary key default gen_random_uuid(),
  recipient_email text        not null,
  slug            text        not null,
  subject         text,
  provider_id     text,
  source          text,
  status          text        not null default 'claimed',
  claimed_at      timestamptz not null default now(),
  sent_at         timestamptz,
  error           text,
  unique (recipient_email, slug)
);

create index if not exists event_email_send_log_slug_idx
  on public.event_email_send_log (slug);

create index if not exists event_email_send_log_status_idx
  on public.event_email_send_log (status);

-- RLS on, no anon/authenticated policies. Reads and writes happen server-side
-- only through SUPABASE_SECRET_KEY, which bypasses RLS. The browser never
-- sees this table.
alter table public.event_email_send_log enable row level security;
