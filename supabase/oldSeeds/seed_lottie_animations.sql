-- ============================================
-- SEED DATA - Lottie Animations (Hybrid: Local + Remote)
-- ============================================

-- Clean existing data (optional - comment out if you want to keep existing)
-- DELETE FROM lottie_animations;

-- ============================================
-- BIRTHDAY ANIMATIONS
-- ============================================

-- Local file (downloaded from LottieFiles)
INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Birthday Celebration', 'birthday', 'local', '/lotties/birthday/birthday1.json', '#FF6B9D', true);

-- Remote URL (from LottieFiles CDN)
-- Example format: https://lottie.host/[animation-id]/[filename].json
-- INSERT INTO lottie_animations (name, occasion_type, source_type, remote_url, helper_color, is_active) VALUES
-- ('Birthday Balloons', 'birthday', 'remote', 'https://lottie.host/abc123/balloons.json', '#FFD700', true);

-- ============================================
-- CELEBRATION ANIMATIONS
-- ============================================

-- Add your downloaded celebration Lotties
-- INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
-- ('Confetti Burst', 'celebration', 'local', '/lotties/celebration/confetti.json', '#FF4757', true);

-- Or use remote URLs for animations you haven't downloaded yet
-- INSERT INTO lottie_animations (name, occasion_type, source_type, remote_url, helper_color, is_active) VALUES
-- ('Party Poppers', 'celebration', 'remote', 'https://lottie.host/xyz789/party.json', '#FFD700', true);

-- ============================================
-- THANK YOU ANIMATIONS
-- ============================================

-- INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
-- ('Floating Hearts', 'thank_you', 'local', '/lotties/thank-you/hearts.json', '#E74C3C', true);

-- ============================================
-- FAREWELL ANIMATIONS
-- ============================================

-- INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
-- ('Gentle Waves', 'farewell', 'local', '/lotties/farewell/waves.json', '#3498DB', true);

-- ============================================
-- GENERAL / OTHER ANIMATIONS
-- ============================================

-- INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
-- ('Subtle Particles', 'general', 'local', '/lotties/general/particles.json', '#95A5A6', true);

-- ============================================
-- EXAMPLE: How to add a remote animation
-- ============================================
-- 1. Find an animation on LottieFiles.com
-- 2. Click "Lottie Animation URL" or "Copy Lottie URL"
-- 3. The URL will look like: https://lottie.host/[id]/[name].json
-- 4. Insert it as a remote animation:
--
-- INSERT INTO lottie_animations (name, occasion_type, source_type, remote_url, helper_color, is_active)
-- VALUES ('Animation Name', 'birthday', 'remote', 'https://lottie.host/12345678/animation.json', '#FF6B9D', true);

-- ============================================
-- VERIFY DATA
-- ============================================
-- SELECT
--   name,
--   occasion_type,
--   source_type,
--   COALESCE(file_path, remote_url) as animation_source,
--   helper_color,
--   is_active
-- FROM lottie_animations
-- ORDER BY occasion_type, name;