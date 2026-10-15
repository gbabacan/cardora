-- ============================================
-- SEED DATA - Father's Day Lottie Animations 2–5
-- All new files are .lottie binary format.
-- Existing: fathers1.json (already seeded)
-- ============================================

INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Father''s Day 2', 'fathers-day', 'local', '/lotties/fathersday/fathers2.lottie', '#1565C0', true),
('Father''s Day 3', 'fathers-day', 'local', '/lotties/fathersday/fathers3.lottie', '#0D47A1', true),
('Father''s Day 4', 'fathers-day', 'local', '/lotties/fathersday/fathers4.lottie', '#37474F', true),
('Father''s Day 5', 'fathers-day', 'local', '/lotties/fathersday/fathers5.lottie', '#4CAF50', true)

ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY
-- ============================================
-- SELECT name, file_path, helper_color, is_active
-- FROM lottie_animations
-- WHERE occasion_type = 'fathers-day'
-- ORDER BY name;
