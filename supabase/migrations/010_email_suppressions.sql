-- 010_email_suppressions.sql
--
-- Global marketing-email suppression list backing RFC 8058 one-click
-- unsubscribe (src/app/api/unsubscribe/route.ts) and the fail-closed
-- isSuppressed() gate in src/lib/email-suppressions.ts.
--
-- One row per suppressed email. Presence in this table means: never send
-- this address another marketing email (lead magnets, the ask-an-ai-expert
-- welcome email, abandoned-checkout follow-ups, the subscribe/lead-magnet
-- signup flow). Transactional mail (seat-reserved confirmations, receipts,
-- sign-in links) is not gated by this table and must stay that way.

create table if not exists public.email_suppressions (
  email      text primary key,
  reason     text not null default 'unsubscribed',
  source     text,
  created_at timestamptz not null default now()
);

create index if not exists email_suppressions_created_at_idx
  on public.email_suppressions (created_at);

-- RLS on, no anon/authenticated policies. Reads/writes happen server-side
-- only through SUPABASE_SECRET_KEY, which bypasses RLS. The browser never
-- sees this table.
alter table public.email_suppressions enable row level security;
