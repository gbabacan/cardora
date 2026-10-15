-- ============================================
-- SEED DATA - Graduation Lottie Animations 2–5
-- All new files are .lottie binary format.
-- Existing: graduation1.json (already seeded)
-- ============================================

INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Graduation Celebration 2', 'graduation', 'local', '/lotties/graduation/graduation2.lottie', '#1565C0', true),
('Graduation Celebration 3', 'graduation', 'local', '/lotties/graduation/graduation3.lottie', '#0288D1', true),
('Graduation Celebration 4', 'graduation', 'local', '/lotties/graduation/graduation4.lottie', '#FFD700', true),
('Graduation Celebration 5', 'graduation', 'local', '/lotties/graduation/graduation5.lottie', '#4CAF50', true)

ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY
-- ============================================
-- SELECT name, file_path, helper_color, is_active
-- FROM lottie_animations
-- WHERE occasion_type = 'graduation'
-- ORDER BY name;
