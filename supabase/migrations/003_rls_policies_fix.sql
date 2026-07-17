-- =====================================================
-- JAKSELNEWS RLS POLICIES FIX v2.1
-- Fixes infinite recursion in RLS policies
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- =====================================================

-- Drop all existing policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

DROP POLICY IF EXISTS "reports_select_public" ON public.reports;
DROP POLICY IF EXISTS "reports_insert_public" ON public.reports;
DROP POLICY IF EXISTS "reports_update_own" ON public.reports;
DROP POLICY IF EXISTS "reports_delete_admin" ON public.reports;

DROP POLICY IF EXISTS "categories_select_public" ON public.categories;
DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;

DROP POLICY IF EXISTS "articles_select_public" ON public.articles;
DROP POLICY IF EXISTS "articles_select_admin" ON public.articles;
DROP POLICY IF EXISTS "articles_insert_service" ON public.articles;
DROP POLICY IF EXISTS "articles_update_admin" ON public.articles;

DROP POLICY IF EXISTS "alerts_select_public" ON public.alerts;
DROP POLICY IF EXISTS "alerts_insert_admin" ON public.alerts;
DROP POLICY IF EXISTS "alerts_update_admin" ON public.alerts;

DROP POLICY IF EXISTS "services_select_public" ON public.services;
DROP POLICY IF EXISTS "services_insert_admin" ON public.services;
DROP POLICY IF EXISTS "services_update_admin" ON public.services;

-- =====================================================
-- STEP 2: CREATE SECURITY DEFINER HELPER FUNCTION
-- This bypasses RLS to check admin role
-- =====================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user is admin or superadmin
  -- SECURITY DEFINER bypasses RLS, so no infinite recursion
  RETURN EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' IN ('admin', 'superadmin')
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- =====================================================
-- STEP 3: RE-CREATE POLICIES (no circular refs)
-- =====================================================

-- PROFILES POLICIES
-- Everyone can view profiles (needed for admin checks)
CREATE POLICY "profiles_select_all" ON public.profiles
FOR SELECT USING (true);

-- Users can update own profile
CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- REPORTS POLICIES
-- Anyone can view reports
CREATE POLICY "reports_select_public" ON public.reports
FOR SELECT USING (true);

-- Anyone can create reports (anonymous submission)
CREATE POLICY "reports_insert_public" ON public.reports
FOR INSERT WITH CHECK (true);

-- Users can update their own OR admin can update any
CREATE POLICY "reports_update_own_or_admin" ON public.reports
FOR UPDATE USING (
  auth.uid() = user_id
  OR public.is_admin()
);

-- Admin can delete reports
CREATE POLICY "reports_delete_admin" ON public.reports
FOR DELETE USING (public.is_admin());

-- CATEGORIES POLICIES
-- Anyone can view active categories
CREATE POLICY "categories_select_public" ON public.categories
FOR SELECT USING (is_active = true OR public.is_admin());

-- Admin can insert categories
CREATE POLICY "categories_insert_admin" ON public.categories
FOR INSERT WITH CHECK (public.is_admin());

-- Admin can update categories
CREATE POLICY "categories_update_admin" ON public.categories
FOR UPDATE USING (public.is_admin());

-- ARTICLES POLICIES
-- Anyone can view published articles
CREATE POLICY "articles_select_public" ON public.articles
FOR SELECT USING (is_published = true);

-- Admin can view all articles
CREATE POLICY "articles_select_admin" ON public.articles
FOR SELECT USING (public.is_admin());

-- Service/API can insert articles
CREATE POLICY "articles_insert_service" ON public.articles
FOR INSERT WITH CHECK (true);

-- Admin can update articles
CREATE POLICY "articles_update_admin" ON public.articles
FOR UPDATE USING (public.is_admin());

-- ALERTS POLICIES
-- Anyone can view active alerts
CREATE POLICY "alerts_select_public" ON public.alerts
FOR SELECT USING (true);

-- Admin can manage alerts
CREATE POLICY "alerts_insert_admin" ON public.alerts
FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "alerts_update_admin" ON public.alerts
FOR UPDATE USING (public.is_admin());

-- SERVICES POLICIES
-- Anyone can view services
CREATE POLICY "services_select_public" ON public.services
FOR SELECT USING (true);

-- Admin can manage services
CREATE POLICY "services_insert_admin" ON public.services
FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "services_update_admin" ON public.services
FOR UPDATE USING (public.is_admin());

-- =====================================================
-- STEP 4: VERIFY
-- =====================================================

SELECT
  'RLS Policies Fixed!' AS status,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'reports', 'categories', 'articles', 'alerts', 'services')
ORDER BY tablename;

SELECT
  'Functions created:' AS info,
  proname,
  pron args,
  prosecdef
FROM pg_proc
WHERE proname = 'is_admin';
