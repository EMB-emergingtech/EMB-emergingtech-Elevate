-- Check current structure of profiles table
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- Add referral_code column (snake_case)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Also add the camelCase version if needed for compatibility
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referralCode TEXT;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles';