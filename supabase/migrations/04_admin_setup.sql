-- =====================================================
-- JAKSELNEWS - Create Admin User
-- Run this AFTER the main migration is complete
-- =====================================================
-- How to use:
-- 1. Go to https://eqoyvbeusopskzacoowz.supabase.co
-- 2. SQL Editor
-- 3. Run this script
-- 4. Replace 'YOUR_ADMIN_EMAIL@example.com' with your real email
-- =====================================================

-- Option A: If user already exists in auth.users
-- Just update their role to admin
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'YOUR_ADMIN_EMAIL@example.com';

-- Verify
SELECT id, email, name, role, created_at
FROM public.profiles
WHERE email = 'YOUR_ADMIN_EMAIL@example.com';

-- Option B: Check all users
SELECT email, name, role FROM public.profiles LIMIT 10;

-- =====================================================
-- To manually create an admin via Supabase Dashboard:
-- 1. Go to Authentication > Users
-- 2. Create new user or select existing
-- 3. Update their role manually via SQL above
-- =====================================================
