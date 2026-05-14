CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL,
  attendee_name text NOT NULL,
  attendee_email text NOT NULL,
  stripe_session_id text,
  amount_paid numeric(10,2) DEFAULT 0,
  cancel_token text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',  -- 'confirmed' | 'cancelled'
  registered_at timestamptz DEFAULT now(),
  cancelled_at timestamptz
);

CREATE TABLE IF NOT EXISTS event_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  remove_token text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active',  -- 'active' | 'removed' | 'converted'
  added_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS event_email_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_slug text NOT NULL,
  rule_name text NOT NULL,
  trigger_type text NOT NULL,  -- 'cancellation' | 'hours_before_event' | 'waitlist_join'
  lead_hours int,
  target_audience text NOT NULL,  -- 'waitlist' | 'registered'
  subject_template text NOT NULL,
  body_preview text,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
