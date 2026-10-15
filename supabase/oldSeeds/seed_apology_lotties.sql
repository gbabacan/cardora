-- ============================================
-- SEED DATA - Apology Lottie Animations 2–6
-- All new files are .lottie binary format.
-- Existing: apology1.json (already seeded)
-- ============================================

INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Apology 2', 'apology', 'local', '/lotties/apology/apology2.lottie', '#7B8FA1', true),
('Apology 3', 'apology', 'local', '/lotties/apology/apology3.lottie', '#90A4AE', true),
('Apology 4', 'apology', 'local', '/lotties/apology/apology4.lottie', '#78909C', true),
('Apology 5', 'apology', 'local', '/lotties/apology/apology5.lottie', '#B0BEC5', true),
('Apology 6', 'apology', 'local', '/lotties/apology/apology6.lottie', '#9575CD', true)

ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY
-- ============================================
-- SELECT name, file_path, helper_color, is_active
-- FROM lottie_animations
-- WHERE occasion_type = 'apology'
-- ORDER BY name;
