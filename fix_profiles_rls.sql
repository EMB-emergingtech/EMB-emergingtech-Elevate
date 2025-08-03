-- Check and fix RLS policies for profiles table
-- Run this in Supabase SQL Editor

-- Check if RLS is enabled on profiles table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- Check existing RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Temporarily disable RLS on profiles table for testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Alternative: Create a policy that allows all operations for authenticated users
-- (Use this instead of disabling RLS if you prefer)
/*
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for authenticated users" ON profiles
FOR ALL USING (auth.uid() IS NOT NULL);
*/