-- ============================================
-- SEED DATA - Default Backgrounds
-- Creates starter backgrounds: solid colors, patterns, and animations
-- ============================================

-- ============================================
-- 1. SEED SOLID COLOR BACKGROUNDS
-- ============================================
INSERT INTO backgrounds (type, color) VALUES
-- Neutral Colors
('SOLID', '#FFFFFF'), -- White
('SOLID', '#F7FAFC'), -- Off-White
('SOLID', '#E5EAF0'), -- Light Gray

-- Teal/Turquoise (Brand Colors)
('SOLID', '#2CB1A6'), -- Primary Teal
('SOLID', '#A7E8E2'), -- Seafoam
('SOLID', '#E8F5F4'), -- Light Teal

-- Warm Colors
('SOLID', '#FFF5F5'), -- Light Pink
('SOLID', '#FFF7ED'), -- Light Orange
('SOLID', '#FFFBEB'), -- Light Yellow

-- Cool Colors
('SOLID', '#EFF6FF'), -- Light Blue
('SOLID', '#F5F3FF'), -- Light Purple
('SOLID', '#ECFDF5'), -- Light Green

-- Pastels
('SOLID', '#FCE7F3'), -- Pastel Pink
('SOLID', '#E0E7FF'), -- Pastel Indigo
('SOLID', '#FEF3C7')  -- Pastel Amber

ON CONFLICT DO NOTHING;

-- ============================================
-- 2. SEED PATTERN BACKGROUNDS (Placeholder)
-- ============================================
-- First, insert some pattern records
-- Note: You'll need to add actual pattern images to your public folder

INSERT INTO patterns (name, file_path, category, is_active) VALUES
('Dots Pattern', '/patterns/dots.svg', 'geometric', true),
('Stripes Pattern', '/patterns/stripes.svg', 'geometric', true),
('Confetti Pattern', '/patterns/confetti.svg', 'celebration', true),
('Hearts Pattern', '/patterns/hearts.svg', 'celebration', true),
('Stars Pattern', '/patterns/stars.svg', 'celebration', true),
('Floral Pattern', '/patterns/floral.svg', 'nature', true),
('Geometric Pattern', '/patterns/geometric.svg', 'geometric', true),
('Wave Pattern', '/patterns/waves.svg', 'abstract', true)

ON CONFLICT DO NOTHING;

-- Create background entries for patterns
INSERT INTO backgrounds (type, pattern_id)
SELECT 'PATTERN', id FROM patterns WHERE is_active = true
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. SEED ANIMATION BACKGROUNDS
-- ============================================
-- Create background entries for active lottie animations
INSERT INTO backgrounds (type, lottie_animation_id)
SELECT 'ANIMATION', id FROM lottie_animations WHERE is_active = true
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY DATA
-- ============================================
-- Uncomment to verify:
-- SELECT type, COUNT(*) as count FROM backgrounds GROUP BY type;
-- SELECT * FROM backgrounds WHERE type = 'SOLID' LIMIT 5;
-- SELECT * FROM backgrounds WHERE type = 'PATTERN' LIMIT 5;
-- SELECT * FROM backgrounds WHERE type = 'ANIMATION' LIMIT 5;
