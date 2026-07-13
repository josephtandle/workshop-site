-- 008_leads_and_lead_magnet_signups.sql
--
-- Context: three live routes (/api/lead-magnet, /api/lead-magnets/claudemd,
-- /api/lead-magnets/passive-income-100) have been upserting into public.leads
-- with onConflict: 'email'. The table never existed. supabase-js returns errors
-- rather than throwing, and the calls are wrapped in a non-blocking try/catch,
-- so every write failed silently and no lead was ever stored.
--
-- This migration is additive. It creates the table those routes already expect,
-- so they start working with no code change.

-- One row per person. UNIQUE(email) is required: it is the conflict target the
-- three existing routes already pass as onConflict: 'email'.
create table if not exists public.leads (
  id          bigint generated always as identity primary key,
  email       text not null,
  first_name  text,
  last_name   text,
  lead_source text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint leads_email_key unique (email)
);

create index if not exists leads_email_idx on public.leads (lower(email));

-- One row per person per lead magnet. This is what makes the dedupe rule work:
--   same magnet twice   -> row already exists -> return success, do NOT email
--   a different magnet  -> new row           -> send that magnet's email
--
-- Kept separate from leads on purpose. Putting lead_magnet into a composite key
-- on leads would break the onConflict: 'email' in the three live routes.
create table if not exists public.lead_magnet_signups (
  id          bigint generated always as identity primary key,
  email       text not null,
  lead_magnet text not null,
  first_name  text,
  last_name   text,
  emailed_at  timestamptz,
  created_at  timestamptz not null default now(),
  constraint lead_magnet_signups_email_magnet_key unique (email, lead_magnet)
);

create index if not exists lead_magnet_signups_email_idx
  on public.lead_magnet_signups (lower(email));

-- Keep leads.updated_at honest on upsert.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- RLS on, with no policies for anon/authenticated. Writes happen server-side
-- only, through SUPABASE_SECRET_KEY, which bypasses RLS. The browser holds just
-- the publishable key, so it can neither read nor write these tables.
alter table public.leads enable row level security;
alter table public.lead_magnet_signups enable row level security;
