-- ============================================================
-- Run this in Supabase Dashboard > SQL Editor > New Query
-- ============================================================

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  author_name TEXT,
  author_phone TEXT,
  body TEXT NOT NULL CHECK (char_length(body) >= 1 AND char_length(body) <= 1000),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_report_id ON comments(report_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Public can insert comments" ON comments FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS comments_updated_at ON comments;
CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
