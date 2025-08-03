-- Disable email confirmation for testing
-- Run this in Supabase SQL Editor

-- Correct approach for disabling email confirmation in Supabase

-- 1. Check existing users who need email confirmation
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email_confirmed_at IS NULL;

-- 2. Manually confirm specific users for testing
-- Replace with the actual email you're testing with
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'ag25615314@gmail.com' AND email_confirmed_at IS NULL;

-- 3. Disable RLS on profiles table for testing
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 4. Check if profiles table exists and its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- 5. Check foreign key constraints on profiles table
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'profiles';

-- 6. Test insert into profiles table (replace with actual UUID from auth.users)
-- First get a user ID:
-- SELECT id FROM auth.users LIMIT 1;
-- Then test insert:
-- INSERT INTO profiles (id, role) VALUES ('user-uuid-here', 'Admin Maker');