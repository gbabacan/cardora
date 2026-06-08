-- ============================================
-- OCCASIONS TABLE
-- Stores all occasion types with their default settings
-- ============================================
CREATE TABLE IF NOT EXISTS occasions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_id VARCHAR(50) NOT NULL UNIQUE, -- 'housewarming', 'birthday', etc.
  name VARCHAR(100) NOT NULL, -- 'House Warming', 'Birthday', etc.
  default_lottie UUID REFERENCES lottie_animations(id) ON DELETE SET NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('personal', 'corporate')),
  "order" INTEGER NOT NULL UNIQUE, -- Display order
  default_background UUID REFERENCES card_backgrounds(id) ON DELETE SET NULL,
  default_effect UUID REFERENCES card_effects(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_occasions_short_id ON occasions(short_id);
CREATE INDEX IF NOT EXISTS idx_occasions_type ON occasions(type);
CREATE INDEX IF NOT EXISTS idx_occasions_order ON occasions("order");
CREATE INDEX IF NOT EXISTS idx_occasions_active ON occasions(is_active);

-- Trigger: Auto-update updated_at timestamp
CREATE TRIGGER update_occasions_updated_at
  BEFORE UPDATE ON occasions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICIES FOR OCCASIONS
-- ============================================
ALTER TABLE occasions ENABLE ROW LEVEL SECURITY;

-- Anyone can view active occasions
CREATE POLICY "Anyone can view active occasions"
  ON occasions FOR SELECT
  USING (is_active = true);

-- Only authenticated users can manage occasions (for admin panel later)
CREATE POLICY "Authenticated users can manage occasions"
  ON occasions FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE occasions IS 'Stores all occasion types with their default settings for cards and boards';
COMMENT ON COLUMN occasions.short_id IS 'URL-friendly identifier used in routes and folders';
COMMENT ON COLUMN occasions.name IS 'Human-friendly display name';
COMMENT ON COLUMN occasions.type IS 'Either ''personal'' (birthdays, weddings) or ''corporate'' (work anniversary, team celebration)';
COMMENT ON COLUMN occasions."order" IS 'Display order in UI - lower numbers appear first';
