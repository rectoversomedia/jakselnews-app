-- =====================================================
-- JAKSELNEWS RLS FIX - SIMPLE VERSION
-- Run this step by step
-- =====================================================

-- STEP 1: Drop old policies one by one
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

DROP POLICY IF EXISTS "Reports are insertable by everyone" ON public.reports;
DROP POLICY IF EXISTS "Reports viewable by everyone" ON public.reports;
DROP POLICY IF EXISTS "reports_select_public" ON public.reports;
DROP POLICY IF EXISTS "reports_insert_public" ON public.reports;
DROP POLICY IF EXISTS "reports_update_own" ON public.reports;
DROP POLICY IF EXISTS "reports_update_own_or_admin" ON public.reports;
DROP POLICY IF EXISTS "reports_delete_admin" ON public.reports;

DROP POLICY IF EXISTS "Active categories viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "categories_select_public" ON public.categories;
DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;

DROP POLICY IF EXISTS "Published articles viewable by everyone" ON public.articles;
DROP POLICY IF EXISTS "articles_select_public" ON public.articles;
DROP POLICY IF EXISTS "articles_select_admin" ON public.articles;
DROP POLICY IF EXISTS "articles_insert_service" ON public.articles;
DROP POLICY IF EXISTS "articles_update_admin" ON public.articles;

DROP POLICY IF EXISTS "Active alerts viewable by everyone" ON public.alerts;
DROP POLICY IF EXISTS "alerts_select_public" ON public.alerts;
DROP POLICY IF EXISTS "alerts_insert_admin" ON public.alerts;
DROP POLICY IF EXISTS "alerts_update_admin" ON public.alerts;

DROP POLICY IF EXISTS "Services viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "services_select_public" ON public.services;
DROP POLICY IF EXISTS "services_insert_admin" ON public.services;
DROP POLICY IF EXISTS "services_update_admin" ON public.services;

-- STEP 2: Drop old function
DROP FUNCTION IF EXISTS public.is_admin();

-- STEP 3: Create admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
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

-- STEP 4: Create new policies
-- Profiles
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Reports
CREATE POLICY "reports_select_public" ON public.reports FOR SELECT USING (true);
CREATE POLICY "reports_insert_public" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "reports_update_own_or_admin" ON public.reports FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "reports_delete_admin" ON public.reports FOR DELETE USING (public.is_admin());

-- Categories
CREATE POLICY "categories_select_public" ON public.categories FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "categories_insert_admin" ON public.categories FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "categories_update_admin" ON public.categories FOR UPDATE USING (public.is_admin());

-- Articles
CREATE POLICY "articles_select_public" ON public.articles FOR SELECT USING (is_published = true);
CREATE POLICY "articles_select_admin" ON public.articles FOR SELECT USING (public.is_admin());
CREATE POLICY "articles_insert_service" ON public.articles FOR INSERT WITH CHECK (true);
CREATE POLICY "articles_update_admin" ON public.articles FOR UPDATE USING (public.is_admin());

-- Alerts
CREATE POLICY "alerts_select_public" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "alerts_insert_admin" ON public.alerts FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "alerts_update_admin" ON public.alerts FOR UPDATE USING (public.is_admin());

-- Services
CREATE POLICY "services_select_public" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_insert_admin" ON public.services FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "services_update_admin" ON public.services FOR UPDATE USING (public.is_admin());

-- STEP 5: Verify
SELECT 'Done!' AS status, count(*) AS total_policies FROM pg_policies WHERE schemaname = 'public';
