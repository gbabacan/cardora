-- ============================================
-- LOTTIE ANIMATIONS TABLE
-- Stores available Lottie animation backgrounds
-- ============================================
CREATE TABLE IF NOT EXISTS lottie_animations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL, -- Display name: 'Birthday Balloons', 'Confetti Burst'
  occasion_type VARCHAR(50) NOT NULL, -- 'birthday', 'celebration', 'farewell', 'thank_you', 'general'
  file_path TEXT NOT NULL, -- '/lotties/birthday-balloons.json'
  helper_color VARCHAR(7) NOT NULL, -- '#FF6B9D' - complementary color for UI elements
  thumbnail_url TEXT, -- Optional preview image for selection UI
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries by occasion type
CREATE INDEX IF NOT EXISTS idx_lottie_occasion ON lottie_animations(occasion_type);
CREATE INDEX IF NOT EXISTS idx_lottie_active ON lottie_animations(is_active);

-- ============================================
-- UPDATE BOARDS TABLE
-- Add reference to lottie animation
-- ============================================
ALTER TABLE boards ADD COLUMN IF NOT EXISTS lottie_animation_id UUID REFERENCES lottie_animations(id) ON DELETE SET NULL;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_boards_lottie ON boards(lottie_animation_id);

-- ============================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================
CREATE TRIGGER update_lottie_animations_updated_at
  BEFORE UPDATE ON lottie_animations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICIES FOR LOTTIE ANIMATIONS
-- ============================================
ALTER TABLE lottie_animations ENABLE ROW LEVEL SECURITY;

-- Anyone can view active lottie animations
CREATE POLICY "Anyone can view active lottie animations"
  ON lottie_animations FOR SELECT
  USING (is_active = true);

-- Only authenticated users can manage lottie animations (for admin panel later)
CREATE POLICY "Authenticated users can manage lottie animations"
  ON lottie_animations FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA - Sample Lottie Animations
-- ============================================
INSERT INTO lottie_animations (name, occasion_type, file_path, helper_color, is_active) VALUES
-- Birthday
('Birthday Celebration', 'birthday', '/lotties/birthday1.json', '#FF6B9D', true),

-- Celebration
('Confetti Burst', 'celebration', '/lotties/confetti.json', '#FF4757', false),
('Party Poppers', 'celebration', '/lotties/party.json', '#FFD700', false),

-- Thank You
('Floating Hearts', 'thank_you', '/lotties/hearts.json', '#E74C3C', false),
('Gratitude Stars', 'thank_you', '/lotties/stars.json', '#F39C12', false),

-- Farewell
('Gentle Waves', 'farewell', '/lotties/waves.json', '#3498DB', false),
('Flying Birds', 'farewell', '/lotties/birds.json', '#2ECC71', false),

-- General
('Subtle Particles', 'general', '/lotties/particles.json', '#95A5A6', false),
('Minimal Dots', 'general', '/lotties/dots.json', '#7F8C8D', false)
ON CONFLICT DO NOTHING;