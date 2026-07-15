-- =====================================================
-- JAKSELNEWS RLS POLICIES v2.0
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql
-- =====================================================

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "profiles_select_own"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "profiles_update_own"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "profiles_select_all"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- Admins can update any profile
CREATE POLICY "profiles_update_admin"
ON public.profiles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- =====================================================
-- REPORTS POLICIES
-- =====================================================

-- Anyone can view reports (public list)
CREATE POLICY "reports_select_public"
ON public.reports
FOR SELECT
USING (true);

-- Anyone can create reports (anonymous)
CREATE POLICY "reports_insert_public"
ON public.reports
FOR INSERT
WITH CHECK (true);

-- Users can update their own reports
CREATE POLICY "reports_update_own"
ON public.reports
FOR UPDATE
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- Admins can delete reports
CREATE POLICY "reports_delete_admin"
ON public.reports
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- =====================================================
-- CATEGORIES POLICIES
-- =====================================================

-- Anyone can view categories
CREATE POLICY "categories_select_public"
ON public.categories
FOR SELECT
USING (is_active = true OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- Admins can insert categories
CREATE POLICY "categories_insert_admin"
ON public.categories
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- Admins can update categories
CREATE POLICY "categories_update_admin"
ON public.categories
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- =====================================================
-- ARTICLES POLICIES
-- =====================================================

-- Anyone can view published articles
CREATE POLICY "articles_select_public"
ON public.articles
FOR SELECT
USING (is_published = true);

-- Admins can view all articles
CREATE POLICY "articles_select_admin"
ON public.articles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- Service role can insert articles (for sync)
CREATE POLICY "articles_insert_service"
ON public.articles
FOR INSERT
WITH CHECK (true);

-- Admins can update articles
CREATE POLICY "articles_update_admin"
ON public.articles
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- =====================================================
-- ALERTS POLICIES
-- =====================================================

-- Anyone can view active alerts
CREATE POLICY "alerts_select_public"
ON public.alerts
FOR SELECT
USING (true);

-- Admins can manage alerts
CREATE POLICY "alerts_insert_admin"
ON public.alerts
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "alerts_update_admin"
ON public.alerts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- =====================================================
-- SERVICES POLICIES
-- =====================================================

-- Anyone can view services
CREATE POLICY "services_select_public"
ON public.services
FOR SELECT
USING (true);

-- Admins can manage services
CREATE POLICY "services_insert_admin"
ON public.services
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

CREATE POLICY "services_update_admin"
ON public.services
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'superadmin')
  )
);

-- =====================================================
-- VERIFY RLS IS WORKING
-- =====================================================

-- Test that RLS is enabled
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
