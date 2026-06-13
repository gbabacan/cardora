-- ============================================
-- SEED DATA - Mother's Day Lottie Animations 3–5
-- All new files are .lottie binary format.
-- Existing: mothers1.json, mothers2.json (already seeded)
-- ============================================

INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Mother''s Day 3', 'mothers-day', 'local', '/lotties/mothersday/mothers3.lottie', '#E91E63', true),
('Mother''s Day 4', 'mothers-day', 'local', '/lotties/mothersday/mothers4.lottie', '#F06292', true),
('Mother''s Day 5', 'mothers-day', 'local', '/lotties/mothersday/mothers5.lottie', '#CE93D8', true)

ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY
-- ============================================
-- SELECT name, file_path, helper_color, is_active
-- FROM lottie_animations
-- WHERE occasion_type = 'mothers-day'
-- ORDER BY name;
