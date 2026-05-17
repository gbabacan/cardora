-- ============================================
-- MIGRATION: Create Backgrounds System
-- Creates patterns and backgrounds tables
-- Updates boards table to use new background system
-- ============================================

-- ============================================
-- 1. CREATE PATTERNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  thumbnail_url TEXT,
  category VARCHAR(100), -- e.g., 'geometric', 'nature', 'abstract'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for active patterns
CREATE INDEX idx_patterns_active ON patterns(is_active);
CREATE INDEX idx_patterns_category ON patterns(category);

-- ============================================
-- 2. CREATE BACKGROUNDS TABLE
-- ============================================
CREATE TYPE background_type AS ENUM ('SOLID', 'PATTERN', 'ANIMATION');

CREATE TABLE IF NOT EXISTS backgrounds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type background_type NOT NULL,

  -- For SOLID type
  color VARCHAR(7), -- e.g., '#ffffff'

  -- For PATTERN type
  pattern_id UUID REFERENCES patterns(id) ON DELETE SET NULL,

  -- For ANIMATION type
  lottie_animation_id UUID REFERENCES lottie_animations(id) ON DELETE SET NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Ensure only the correct field is populated based on type
  CONSTRAINT check_solid_has_color CHECK (
    type != 'SOLID' OR (color IS NOT NULL AND pattern_id IS NULL AND lottie_animation_id IS NULL)
  ),
  CONSTRAINT check_pattern_has_pattern_id CHECK (
    type != 'PATTERN' OR (pattern_id IS NOT NULL AND color IS NULL AND lottie_animation_id IS NULL)
  ),
  CONSTRAINT check_animation_has_lottie_id CHECK (
    type != 'ANIMATION' OR (lottie_animation_id IS NOT NULL AND color IS NULL AND pattern_id IS NULL)
  )
);

-- Add indexes for foreign keys
CREATE INDEX idx_backgrounds_pattern_id ON backgrounds(pattern_id);
CREATE INDEX idx_backgrounds_lottie_animation_id ON backgrounds(lottie_animation_id);
CREATE INDEX idx_backgrounds_type ON backgrounds(type);

-- ============================================
-- 3. ALTER BOARDS TABLE
-- ============================================

-- Add new background_id column
ALTER TABLE boards
ADD COLUMN IF NOT EXISTS background_id UUID REFERENCES backgrounds(id) ON DELETE SET NULL;

-- Add index for background_id
CREATE INDEX IF NOT EXISTS idx_boards_background_id ON boards(background_id);

-- Note: We'll keep the old 'background' column for now for backwards compatibility
-- You can drop it later after migrating all data:
-- ALTER TABLE boards DROP COLUMN IF EXISTS background;

-- ============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on new tables
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE backgrounds ENABLE ROW LEVEL SECURITY;

-- Patterns: Allow public to view active patterns
CREATE POLICY "Public can view active patterns"
  ON patterns FOR SELECT
  USING (is_active = true);

-- Patterns: Authenticated users can view all patterns
CREATE POLICY "Authenticated users can view all patterns"
  ON patterns FOR SELECT
  TO authenticated
  USING (true);

-- Backgrounds: Allow public to view backgrounds
CREATE POLICY "Public can view backgrounds"
  ON backgrounds FOR SELECT
  USING (true);

-- Backgrounds: Authenticated users can create backgrounds
CREATE POLICY "Authenticated users can create backgrounds"
  ON backgrounds FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Backgrounds: Users can update backgrounds they created
-- (We'll need to add user_id if we want per-user backgrounds)
CREATE POLICY "Authenticated users can update backgrounds"
  ON backgrounds FOR UPDATE
  TO authenticated
  USING (true);

-- ============================================
-- 5. CREATE UPDATED_AT TRIGGERS
-- ============================================

-- Trigger for patterns
CREATE OR REPLACE FUNCTION update_patterns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_patterns_updated_at
  BEFORE UPDATE ON patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_patterns_updated_at();

-- Trigger for backgrounds
CREATE OR REPLACE FUNCTION update_backgrounds_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_backgrounds_updated_at
  BEFORE UPDATE ON backgrounds
  FOR EACH ROW
  EXECUTE FUNCTION update_backgrounds_updated_at();

-- ============================================
-- NOTES:
-- ============================================
-- After running this migration:
-- 1. Seed the patterns table with pattern images
-- 2. Create default backgrounds (solid colors, patterns, animations)
-- 3. Migrate existing boards to use new background_id
-- 4. Eventually drop the old 'background' column from boards table
