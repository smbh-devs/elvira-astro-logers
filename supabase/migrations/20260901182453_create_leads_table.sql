/*
# Create leads table for astrologer landing page

1. New Tables
- `leads`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — client's first name
  - `phone` (text, not null) — client's phone number
  - `birth_date` (date, nullable, optional) — client's date of birth if provided
  - `source` (text, nullable) — which section of the page the lead came from
  - `created_at` (timestamptz, default now()) — when the lead was submitted

2. Security
- Enable RLS on `leads`.
- INSERT policy for anon + authenticated: anyone visiting the landing page can submit a lead.
- No SELECT/UPDATE/DELETE policies: leads are only readable via the Supabase dashboard or service role, never from the frontend.
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  birth_date date,
  source text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);
