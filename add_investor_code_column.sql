-- Add investor_code column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS investor_code TEXT;