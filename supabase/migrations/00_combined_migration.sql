-- =====================================================
-- JAKSELNEWS COMBINED MIGRATION - Run this in ONE go
-- Supabase SQL Editor: https://supabase.com/dashboard
-- Project: eqoyvbeusopskzacoowz
-- =====================================================

-- =====================================================
-- STEP 0: CLEANUP OLD POLICIES (if any)
-- =====================================================

-- Drop policies that depend on is_admin() function first
DROP POLICY IF EXISTS "reports_update_own_or_admin" ON public.reports;
DROP POLICY IF EXISTS "reports_delete_admin" ON public.reports;
DROP POLICY IF EXISTS "categories_select_public" ON public.categories;
DROP POLICY IF EXISTS "categories_insert_admin" ON public.categories;
DROP POLICY IF EXISTS "categories_update_admin" ON public.categories;
DROP POLICY IF EXISTS "articles_select_admin" ON public.articles;
DROP POLICY IF EXISTS "articles_update_admin" ON public.articles;
DROP POLICY IF EXISTS "alerts_insert_admin" ON public.alerts;
DROP POLICY IF EXISTS "alerts_update_admin" ON public.alerts;
DROP POLICY IF EXISTS "services_insert_admin" ON public.services;
DROP POLICY IF EXISTS "services_update_admin" ON public.services;

-- Drop old functions (use CASCADE to drop dependent triggers)
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop old policies on profiles
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_admin" ON public.profiles;

-- Drop old policies on reports
DROP POLICY IF EXISTS "reports_select_public" ON public.reports;
DROP POLICY IF EXISTS "reports_insert_public" ON public.reports;

-- Drop old policies on categories
DROP POLICY IF EXISTS "categories_select_public" ON public.categories;

-- Drop old policies on articles
DROP POLICY IF EXISTS "articles_select_public" ON public.articles;
DROP POLICY IF EXISTS "articles_insert_service" ON public.articles;

-- Drop old policies on alerts
DROP POLICY IF EXISTS "alerts_select_public" ON public.alerts;

-- Drop old policies on services
DROP POLICY IF EXISTS "services_select_public" ON public.services;
DROP POLICY IF EXISTS "Services viewable by everyone" ON public.services;
DROP POLICY IF EXISTS "Active alerts viewable by everyone" ON public.alerts;
DROP POLICY IF EXISTS "Published articles viewable by everyone" ON public.articles;
DROP POLICY IF EXISTS "Active categories viewable by everyone" ON public.categories;
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Reports are insertable by everyone" ON public.reports;
DROP POLICY IF EXISTS "Reports viewable by everyone" ON public.reports;

-- =====================================================
-- STEP 1: SCHEMA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone TEXT,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
  email TEXT,
  fcm_token TEXT,
  fcm_platform TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  color TEXT DEFAULT '#6B7280',
  bg_color TEXT DEFAULT 'rgba(107, 114, 128, 0.15)',
  keywords TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_name TEXT,
  media_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'processing', 'resolved', 'rejected')),
  verified BOOLEAN DEFAULT FALSE,
  auto_category TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to TEXT,
  admin_notes TEXT,
  reporter_name TEXT,
  reporter_phone TEXT,
  reporter_email TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  wp_id INTEGER UNIQUE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  summary TEXT,
  image_url TEXT,
  category TEXT DEFAULT 'umum',
  location TEXT,
  views INTEGER DEFAULT 0,
  is_breaking_news BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  author_id TEXT,
  author_name TEXT,
  wp_categories JSONB DEFAULT '[]',
  wp_tags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'keamanan',
  icon TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  report_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  icon_color TEXT,
  url TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 2: INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_type ON public.reports(type);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_location ON public.reports(location_name);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON public.articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_breaking ON public.articles(is_breaking_news) WHERE is_breaking_news = TRUE;
CREATE INDEX IF NOT EXISTS idx_categories_sort ON public.categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON public.alerts(is_active) WHERE is_active = TRUE;

-- =====================================================
-- STEP 3: FUNCTIONS (must be before policies that reference them)
-- =====================================================

-- is_admin() helper function
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

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 4: TRIGGERS
-- =====================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_reports_updated_at ON public.reports;
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- STEP 5: ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

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

-- =====================================================
-- STEP 6: SEED DATA
-- =====================================================

INSERT INTO public.categories (name, slug, icon, color, bg_color, keywords, sort_order) VALUES
  ('Keamanan', 'keamanan', 'shield-warning', '#EF4444', 'rgba(239, 68, 68, 0.15)', ARRAY['rampok','curat','curanmor','pencurian','perampokan','maling','kejadian','kriminal','polisi','tabligh','teror','begal','penyalahgunaan','preman','geng','tawuran','pencopet'], 1),
  ('Lalu Lintas', 'lalu-lintas', 'traffic-cone', '#F59E0B', 'rgba(245, 158, 11, 0.15)', ARRAY['macet','lalu lintas','kemacetan','laka','kecelakaan','tabrakan','arus balik','one way','lalin','parkir','lampu merah','tilang'], 2),
  ('Banjir', 'banjir', 'cloud-rain', '#3B82F6', 'rgba(59, 130, 246, 0.15)', ARRAY['banjir','genangan','air','tenggelam','kali meluap','drainase','luapan','posko','sungai','pompa'], 3),
  ('Kebakaran', 'kebakaran', 'flame', '#F97316', 'rgba(249, 115, 22, 0.15)', ARRAY['kebakaran','api','bakar','haus','asap','kobar','merembet'], 4),
  ('Penerangan', 'penerangan', 'lightbulb', '#EAB308', 'rgba(234, 179, 8, 0.15)', ARRAY['lampu jalan','penerangan','dlp','tiang listrik','pju','gelap'], 5),
  ('Lingkungan', 'lingkungan', 'tree', '#10B981', 'rgba(16, 185, 129, 0.15)', ARRAY['sampah','bau','limbah','illegal','felling','pohon tumbang','penebangan','tumpukan','bersih','hijau'], 6),
  ('Kemacetan', 'kemacetan', 'car', '#D97706', 'rgba(217, 119, 6, 0.15)', ARRAY['macet parah','lalin','pengalihan','demonstrasi','unras','demo'], 7),
  ('Jalan Rusak', 'jalan-rusak', 'road-horizon', '#CA8A04', 'rgba(202, 138, 4, 0.15)', ARRAY['jalan rusak','lubang','bolong','retak','kerusakan jalan','aspal'], 8),
  ('Kriminal', 'kriminal', 'user', '#DC2626', 'rgba(220, 38, 38, 0.15)', ARRAY['penyalahgunaan','narkoba','balap liar','geng','judi','prostitusi'], 9),
  ('Sampah', 'sampah', 'trash', '#059669', 'rgba(5, 150, 105, 0.15)', ARRAY['tumpukan sampah','tpa','buang sampah','bau sampah','dump'], 10),
  ('Fenomena', 'fenomena', 'eye', '#7C3AED', 'rgba(124, 58, 237, 0.15)', ARRAY['langka','unusual','aneh','viral','fenomena','luar biasa'], 11),
  ('Lainnya', 'lainnya', 'dots-three', '#6B7280', 'rgba(107, 114, 128, 0.15)', ARRAY['lain','other','umum','berbeda'], 12)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.services (name, slug, description, icon, icon_color, is_popular, order_index) VALUES
  ('Cek Bansos', 'cek-bansos', 'Cek penerima dan status bantuan sosial Jakarta', 'heart', '#10B981', true, 1),
  ('KJP Plus', 'kjp-plus', 'Cek status dan saldo KJP Plus', 'graduation', '#8B5CF6', true, 2),
  ('Cek ETLE', 'cek-etle', 'Cek tilang elektronik dan denda', 'camera', '#3B82F6', true, 3),
  ('Pajak Kendaraan', 'pajak-kendaraan', 'Cek dan bayar pajak kendaraan bermotor', 'car', '#F59E0B', true, 4),
  ('Info KRL', 'info-krl', 'Jadwal, rute dan info perjalanan KRL', 'train', '#3B82F6', false, 5),
  ('TransJakarta', 'transjakarta', 'Rute, halte terdekat dan info layanan', 'bus', '#EF4444', false, 6),
  ('Cuaca Jaksel', 'cuaca-jaksel', 'Informasi cuaca terkini di Jaksel', 'cloud', '#10B981', false, 7),
  ('Nomor Darurat', 'nomor-darurat', 'Akses cepat nomor darurat penting', 'phone', '#EF4444', false, 8),
  ('Administrasi Kependudukan', 'administrasi', 'KTP, KK, akta lahir dan dokumen lainnya', 'file', '#10B981', false, 9),
  ('PPDB Online', 'ppdb', 'Penerimaan peserta didik baru Jakarta', 'book', '#8B5CF6', false, 10),
  ('RT/RW Digital', 'rt-rw', 'Layanan pengurusan RT dan RW', 'home', '#F59E0B', false, 11),
  ('Izin Usaha', 'izin-usaha', 'OSS dan perizinan usaha lainnya', 'building', '#3B82F6', false, 12)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.alerts (title, description, category, icon, is_active) VALUES
  ('Waspada Penipuan Online via WhatsApp', 'Modus baru mengatasnamakan kurir paket, jangan berikan kode OTP.', 'keamanan', 'shield-warning', true),
  ('Potensi Banjir Sore Ini', 'Hujan lebat diprediksi terjadi pada pukul 15.00 - 18.00 WIB di sebagian wilayah Jaksel.', 'banjir', 'cloud-rain', true),
  ('Jalan Ditutup Sementara', 'Perbaikan jalan di Jl. TB Simatupang arah Cilandak hingga 25 Juli 2026.', 'lalu-lintas', 'alert-triangle', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- STEP 7: STORAGE BUCKET
-- =====================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('reports-media', 'reports-media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
FOR ALL USING (bucket_id = 'reports-media');

-- =====================================================
-- VERIFY
-- =====================================================

SELECT '✅ Jakselnews Database Migration Complete!' AS status;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
SELECT COUNT(*) AS total_policies FROM pg_policies WHERE schemaname = 'public';
SELECT COUNT(*) AS total_categories FROM public.categories;
SELECT COUNT(*) AS total_services FROM public.services;
