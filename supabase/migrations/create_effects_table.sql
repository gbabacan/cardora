-- ============================================
-- EFFECTS TABLE
-- Stores board overlay effects (confetti, fireworks, etc.)
-- Similar to Kudoboard's overlay_animation system
-- ============================================
CREATE TABLE IF NOT EXISTS effects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL, -- Display name: 'Confetti', 'Fireworks', 'Falling Hearts'
  type VARCHAR(50) NOT NULL DEFAULT 'board_overlay', -- 'board_overlay', 'intro_animation'
  occasion_type VARCHAR(50) NOT NULL, -- 'birthday', 'celebration', 'farewell', 'thank_you', 'general'
  file_path TEXT NOT NULL, -- '/effects/confetti.json' - Lottie animation file
  file_type VARCHAR(20) NOT NULL DEFAULT 'lottie', -- 'lottie', 'video', 'gif'
  number_of_loops INTEGER DEFAULT 3 CHECK (number_of_loops >= 1 AND number_of_loops <= 10), -- How many times to play
  thumbnail_url TEXT, -- Preview image for selection UI
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_effects_occasion ON effects(occasion_type);
CREATE INDEX IF NOT EXISTS idx_effects_type ON effects(type);
CREATE INDEX IF NOT EXISTS idx_effects_active ON effects(is_active);

-- ============================================
-- UPDATE BOARDS TABLE
-- Add reference to effect
-- ============================================
ALTER TABLE boards ADD COLUMN IF NOT EXISTS effect_id UUID REFERENCES effects(id) ON DELETE SET NULL;

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_boards_effect ON boards(effect_id);

-- ============================================
-- TRIGGER: Auto-update updated_at timestamp
-- ============================================
CREATE TRIGGER update_effects_updated_at
  BEFORE UPDATE ON effects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS POLICIES FOR EFFECTS
-- ============================================
ALTER TABLE effects ENABLE ROW LEVEL SECURITY;

-- Anyone can view active effects
CREATE POLICY "Anyone can view active effects"
  ON effects FOR SELECT
  USING (is_active = true);

-- Only authenticated users can manage effects (for admin panel later)
CREATE POLICY "Authenticated users can manage effects"
  ON effects FOR ALL
  USING (auth.role() = 'authenticated');









-- ============================================
-- SEED DATA - Sample Effects
-- ============================================
INSERT INTO effects (name, type, occasion_type, file_path, file_type, number_of_loops, is_active) VALUES
-- Birthday effects
('Confetti Burst', 'board_overlay', 'birthday', '/effects/confetti.json', 'lottie', 5, true),
('Birthday Balloons Rising', 'board_overlay', 'birthday', '/effects/balloons-rising.json', 'lottie', 3, true),
('Celebration Fireworks', 'board_overlay', 'birthday', '/effects/fireworks.json', 'lottie', 3, true),

-- Celebration effects
('Party Poppers', 'board_overlay', 'celebration', '/effects/party-poppers.json', 'lottie', 4, true),
('Golden Confetti', 'board_overlay', 'celebration', '/effects/golden-confetti.json', 'lottie', 5, true),
('Sparkles', 'board_overlay', 'celebration', '/effects/sparkles.json', 'lottie', 3, true),

-- Thank You effects
('Floating Hearts', 'board_overlay', 'thank_you', '/effects/floating-hearts.json', 'lottie', 3, true),
('Thank You Stars', 'board_overlay', 'thank_you', '/effects/stars.json', 'lottie', 4, true),

-- Farewell effects
('Gentle Snow', 'board_overlay', 'farewell', '/effects/snow.json', 'lottie', 5, true),
('Floating Petals', 'board_overlay', 'farewell', '/effects/petals.json', 'lottie', 4, true),

-- General effects
('Subtle Sparkle', 'board_overlay', 'general', '/effects/subtle-sparkle.json', 'lottie', 2, true),
('Light Bubbles', 'board_overlay', 'general', '/effects/bubbles.json', 'lottie', 3, true)

ON CONFLICT DO NOTHING;

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================
COMMENT ON TABLE effects IS 'Stores overlay effects and animations that play on boards (confetti, fireworks, etc.)';
COMMENT ON COLUMN effects.name IS 'Display name shown to users in the editor';
COMMENT ON COLUMN effects.type IS 'Type of effect: board_overlay (plays on view) or intro_animation (plays on load)';
COMMENT ON COLUMN effects.occasion_type IS 'Which occasion this effect is best suited for';
COMMENT ON COLUMN effects.file_path IS 'Path to the Lottie JSON file';
COMMENT ON COLUMN effects.number_of_loops IS 'How many times the animation should loop (1-10)';
COMMENT ON COLUMN effects.thumbnail_url IS 'Preview image/GIF for selection UI';