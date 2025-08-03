-- Query to check the role of a specific user
-- Run this in Supabase SQL Editor

SELECT 
    p.id,
    p.role,
    p.referralCode,
    p.created_at,
    u.email
FROM profiles p
JOIN auth.users u ON p.id = u.id
WHERE u.email = 'ag25615314@gmail.com';

-- Alternative query if the above doesn't work (due to RLS policies)
SELECT 
    id,
    role,
    referralCode,
    created_at
FROM profiles
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'ag25615314@gmail.com'
);

-- Check if the user exists in auth.users table
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'ag25615314@gmail.com';

-- Check all profiles in the profiles table (to see what's there)
SELECT * FROM profiles;

-- Check if there are any orphaned profiles (profiles without corresponding auth.users)
SELECT p.*, 'ORPHANED' as status
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.id IS NULL;