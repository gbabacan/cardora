-- ============================================
-- SEED DATA - New Year Lottie Animations 4–8
-- All new files are .lottie binary format.
-- Existing: newYear1–3.json (already seeded)
-- ============================================

INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('New Year Magic 4', 'new_year', 'local', '/lotties/newyear/newYear4.lottie', '#FFD700', true),
('New Year Magic 5', 'new_year', 'local', '/lotties/newyear/newYear5.lottie', '#FFC107', true),
('New Year Magic 6', 'new_year', 'local', '/lotties/newyear/newYear6.lottie', '#FF6B00', true),
('New Year Magic 7', 'new_year', 'local', '/lotties/newyear/newYear7.lottie', '#C0392B', true),
('New Year Magic 8', 'new_year', 'local', '/lotties/newyear/newYear8.lottie', '#8E44AD', true)

ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY
-- ============================================
-- SELECT name, file_path, helper_color, is_active
-- FROM lottie_animations
-- WHERE occasion_type = 'new_year'
-- ORDER BY name;
