-- Investors table
CREATE TABLE investors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  email text UNIQUE NOT NULL,
  phone text,
  dateJoined date,
  aum numeric,
  status text
);

-- Referrals table
CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partnerEmail text NOT NULL,
  investorEmail text NOT NULL,
  status text,
  investment numeric,
  commission numeric,
  created_at timestamptz DEFAULT now()
);

-- Investments table
CREATE TABLE investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor text NOT NULL,
  type text NOT NULL, -- ICD, Bond, REIT
  amount numeric NOT NULL,
  roi numeric, -- interest rate
  duration text, -- maturity date or period
  status text,
  created_at timestamptz DEFAULT now(),
  name text,
  interestRate numeric,
  interest_rate numeric,
  tenure integer,
  minInvestment numeric,
  min_investment numeric
);

-- Commission Reports table
CREATE TABLE commission_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month text NOT NULL,
  icdCommission numeric,
  bondCommission numeric,
  totalCommission numeric
);

-- Investor Performance table
CREATE TABLE investor_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  aum numeric,
  commission numeric,
  products text,
  performance text
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    role TEXT NOT NULL,
    referral_code TEXT,
    investor_code TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Drop the existing foreign key constraint if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'fk_profiles_user'
    ) THEN
        ALTER TABLE profiles DROP CONSTRAINT fk_profiles_user;
    END IF;
END $$;

-- Add the foreign key constraint to link profiles with auth.users
ALTER TABLE profiles
ADD CONSTRAINT fk_profiles_user
FOREIGN KEY (id) REFERENCES auth.users (id) ON DELETE CASCADE;

-- Ensure referralCode column exists in profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referralCode TEXT;

-- Add missing tables for admin dashboard functionality

-- KYC requests table
CREATE TABLE IF NOT EXISTS kyc_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  user_email text NOT NULL,
  status text DEFAULT 'pending',
  submitted_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  documents jsonb,
  notes text
);

-- Pending requests table for various admin approvals
CREATE TABLE IF NOT EXISTS pending_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  type text NOT NULL, -- 'ICD', 'Bond', 'REIT', 'KYC', etc.
  amount numeric DEFAULT 0,
  date timestamptz DEFAULT now(),
  details text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Investment requests table (for ICD, Bond, REIT requests)
CREATE TABLE IF NOT EXISTS investment_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  investor_name text NOT NULL,
  investment_type text NOT NULL, -- 'ICD', 'Bond', 'REIT'
  amount numeric NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  approved_at timestamptz,
  approved_by uuid REFERENCES auth.users(id),
  notes text
);

-- Update investments table to have proper structure for admin dashboard
ALTER TABLE investments 
ADD COLUMN IF NOT EXISTS name text,
ADD COLUMN IF NOT EXISTS interestRate numeric,
ADD COLUMN IF NOT EXISTS interest_rate numeric,
ADD COLUMN IF NOT EXISTS tenure integer,
ADD COLUMN IF NOT EXISTS minInvestment numeric,
ADD COLUMN IF NOT EXISTS min_investment numeric;

-- Bond requests table
CREATE TABLE IF NOT EXISTS bond_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bondId text NOT NULL,
  amount numeric NOT NULL,
  investorId uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

-- ICD requests table  
CREATE TABLE IF NOT EXISTS icd_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount numeric NOT NULL,
  tenure integer NOT NULL,
  investorId uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

-- REIT requests table
CREATE TABLE IF NOT EXISTS reit_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reitId text NOT NULL,
  amount numeric NOT NULL,
  investorId uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

-- Invites table for investor registration
CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  invite_code text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'Investor',
  created_at timestamptz DEFAULT now(),
  used boolean DEFAULT false,
  used_at timestamptz
);

-- Disable RLS on new tables for admin access
ALTER TABLE kyc_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE pending_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE investment_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE bond_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE icd_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE reit_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE invites DISABLE ROW LEVEL SECURITY;
