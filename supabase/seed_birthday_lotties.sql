-- ============================================
-- SEED DATA - Birthday Lottie Animations
-- Insert all 10 birthday Lottie files from /public/lotties/birthday/
-- ============================================

INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Birthday Animation 1', 'birthday', 'local', '/lotties/birthday/birthday1.json', '#FF6B9D', true),
('Birthday Animation 2', 'birthday', 'local', '/lotties/birthday/birthday2.json', '#FFD700', true),
('Birthday Animation 3', 'birthday', 'local', '/lotties/birthday/birthday3.json', '#FF1493', true),
('Birthday Animation 4', 'birthday', 'local', '/lotties/birthday/birthday4.json', '#FF69B4', true),
('Birthday Animation 5', 'birthday', 'local', '/lotties/birthday/birthday5.json', '#FFA500', true),
('Birthday Animation 6', 'birthday', 'local', '/lotties/birthday/birthday6.json', '#FF4500', true),
('Birthday Animation 7', 'birthday', 'local', '/lotties/birthday/birthday7.json', '#FF8C00', true),
('Birthday Animation 8', 'birthday', 'local', '/lotties/birthday/birthday8.json', '#DA70D6', true),
('Birthday Animation 9', 'birthday', 'local', '/lotties/birthday/birthday9.json', '#FF00FF', true),
('Birthday Animation 10', 'birthday', 'local', '/lotties/birthday/birthday10.json', '#9370DB', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY THE INSERTED DATA
-- ============================================
-- Run this to see all birthday animations:
-- SELECT name, file_path, helper_color, is_active FROM lottie_animations WHERE occasion_type = 'birthday' ORDER BY name;

-- ============================================
-- HELPER COLOR PALETTE USED
-- ============================================
-- #FF6B9D - Hot Pink
-- #FFD700 - Gold
-- #FF1493 - Deep Pink
-- #FF69B4 - Hot Pink (lighter)
-- #FFA500 - Orange
-- #FF4500 - Orange Red
-- #FF8C00 - Dark Orange
-- #DA70D6 - Orchid
-- #FF00FF - Magenta
-- #9370DB - Medium Purple