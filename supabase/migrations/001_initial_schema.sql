-- =====================================================
-- JAKSELNEWS DATABASE SCHEMA v2.0
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  phone TEXT,
  name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'superadmin')),
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories (for reports)
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

-- Reports
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

-- Articles (synced from WordPress)
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

-- Alerts
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

-- Services
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
-- INDEXES
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
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories - everyone can read active
CREATE POLICY "Active categories viewable by everyone" ON public.categories FOR SELECT USING (is_active = true);

-- Reports
CREATE POLICY "Reports are insertable by everyone" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Reports viewable by everyone" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Admins can update reports" ON public.reports FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'superadmin'))
);

-- Articles - everyone can read published
CREATE POLICY "Published articles viewable by everyone" ON public.articles FOR SELECT USING (is_published = true);

-- Alerts - everyone can read active
CREATE POLICY "Active alerts viewable by everyone" ON public.alerts FOR SELECT USING (is_active = true);

-- Services - everyone can read
CREATE POLICY "Services viewable by everyone" ON public.services FOR SELECT USING (true);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_reports_updated_at ON public.reports;
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- SEED DATA: Categories
-- =====================================================

INSERT INTO public.categories (name, slug, icon, color, bg_color, keywords, sort_order) VALUES
  ('Keamanan', 'keamanan', 'shield-warning', '#EF4444', 'rgba(239, 68, 68, 0.15)', ARRAY[
    'rampok', 'curat', 'curanmor', 'pencurian', 'perampokan', 'maling',
    'kejadian', 'kriminal', 'polisi', 'tabligh', 'teror', 'begal',
    'penyalahgunaan', 'preman', 'geng', 'tawuran', 'pencopet'
  ], 1),
  ('Lalu Lintas', 'lalu-lintas', 'traffic-cone', '#F59E0B', 'rgba(245, 158, 11, 0.15)', ARRAY[
    'macet', 'lalu lintas', 'kemacetan', 'laka', 'kecelakaan', 'tabrakan',
    'arus balik', 'one way', 'lalin', 'parkir', 'lampu merah', 'tilang'
  ], 2),
  ('Banjir', 'banjir', 'cloud-rain', '#3B82F6', 'rgba(59, 130, 246, 0.15)', ARRAY[
    'banjir', 'genangan', 'air', 'tenggelam', 'kali meluap', 'drainase',
    'luapan', 'posko', 'sungai', 'pompa'
  ], 3),
  ('Kebakaran', 'kebakaran', 'flame', '#F97316', 'rgba(249, 115, 22, 0.15)', ARRAY[
    'kebakaran', 'api', 'bakar', 'haus', 'asap', 'kobar', 'merembet'
  ], 4),
  ('Penerangan', 'penerangan', 'lightbulb', '#EAB308', 'rgba(234, 179, 8, 0.15)', ARRAY[
    'lampu jalan', 'penerangan', 'dlp', 'tiang listrik', 'pju', 'gelap'
  ], 5),
  ('Lingkungan', 'lingkungan', 'tree', '#10B981', 'rgba(16, 185, 129, 0.15)', ARRAY[
    'sampah', 'bau', 'limbah', 'illegal', 'felling', 'pohon tumbang',
    'penebangan', 'tumpukan', 'bersih', 'hijau'
  ], 6),
  ('Kemacetan', 'kemacetan', 'car', '#D97706', 'rgba(217, 119, 6, 0.15)', ARRAY[
    'macet parah', 'lalin', 'pengalihan', 'demonstrasi', 'unras', 'demo'
  ], 7),
  ('Jalan Rusak', 'jalan-rusak', 'road-horizon', '#CA8A04', 'rgba(202, 138, 4, 0.15)', ARRAY[
    'jalan rusak', 'lubang', 'bolong', 'retak', 'kerusakan jalan', 'aspal'
  ], 8),
  ('Kriminal', 'kriminal', 'user', '#DC2626', 'rgba(220, 38, 38, 0.15)', ARRAY[
    'penyalahgunaan', 'narkoba', 'balap liar', 'geng', 'judi', 'prostitusi'
  ], 9),
  ('Sampah', 'sampah', 'trash', '#059669', 'rgba(5, 150, 105, 0.15)', ARRAY[
    'tumpukan sampah', 'tpa', 'buang sampah', 'bau sampah', 'dump'
  ], 10),
  ('Fenomena', 'fenomena', 'eye', '#7C3AED', 'rgba(124, 58, 237, 0.15)', ARRAY[
    'langka', 'unusual', 'aneh', 'viral', 'fenomena', 'luar biasa'
  ], 11),
  ('Lainnya', 'lainnya', 'dots-three', '#6B7280', 'rgba(107, 114, 128, 0.15)', ARRAY[
    'lain', 'other', 'umum', 'berbeda'
  ], 12)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- SEED DATA: Services
-- =====================================================

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

-- =====================================================
-- SEED DATA: Sample Alerts
-- =====================================================

INSERT INTO public.alerts (title, description, category, icon, is_active) VALUES
  ('Waspada Penipuan Online via WhatsApp', 'Modus baru mengatasnamakan kurir paket, jangan berikan kode OTP.', 'keamanan', 'shield-warning', true),
  ('Potensi Banjir Sore Ini', 'Hujan lebat diprediksi terjadi pada pukul 15.00 - 18.00 WIB di sebagian wilayah Jaksel.', 'banjir', 'cloud-rain', true),
  ('Jalan Ditutup Sementara', 'Perbaikan jalan di Jl. TB Simatupang arah Cilandak hingga 25 Juli 2026.', 'lalu-lintas', 'alert-triangle', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- Done!
-- =====================================================

SELECT 'Jakselnews Database Schema v2.0 - Migration Complete!' AS status;
