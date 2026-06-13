-- ============================================
-- SEED DATA - Mixed Occasion Lottie Animations 2
-- teamCelebration7–8, appreciation5–6,
-- farewell6, holidays6–18
-- ============================================

-- Team Celebration (7–8) — .json
INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Team Celebration 7', 'team-celebration', 'local', '/lotties/teamcelebration/teamCelebration7.json', '#5E35B1', true),
('Team Celebration 8', 'team-celebration', 'local', '/lotties/teamcelebration/teamCelebration8.json', '#00897B', true)
ON CONFLICT DO NOTHING;

-- Employee Appreciation (5–6) — .json
INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Employee Appreciation 5', 'employee-appreciation', 'local', '/lotties/appreciation/appreciation5.json', '#FB8C00', true),
('Employee Appreciation 6', 'employee-appreciation', 'local', '/lotties/appreciation/appreciation6.json', '#F4511E', true)
ON CONFLICT DO NOTHING;

-- Farewell (6) — .json
INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Farewell Wishes 6', 'farewell', 'local', '/lotties/farewell/farewell6.json', '#1565C0', true)
ON CONFLICT DO NOTHING;

-- All Holidays (6–18) — mixed .lottie and .json
INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Holidays 6',  'all-holidays', 'local', '/lotties/holidays/holidays6.lottie',  '#E53935', true),
('Holidays 7',  'all-holidays', 'local', '/lotties/holidays/holidays7.lottie',  '#D81B60', true),
('Holidays 8',  'all-holidays', 'local', '/lotties/holidays/holidays8.lottie',  '#8E24AA', true),
('Holidays 9',  'all-holidays', 'local', '/lotties/holidays/holidays9.lottie',  '#3949AB', true),
('Holidays 10', 'all-holidays', 'local', '/lotties/holidays/holidays10.lottie', '#039BE5', true),
('Holidays 11', 'all-holidays', 'local', '/lotties/holidays/holidays11.lottie', '#00897B', true),
('Holidays 12', 'all-holidays', 'local', '/lotties/holidays/holidays12.json',   '#43A047', true),
('Holidays 13', 'all-holidays', 'local', '/lotties/holidays/holidays13.lottie', '#FFB300', true),
('Holidays 14', 'all-holidays', 'local', '/lotties/holidays/holidays14.lottie', '#F4511E', true),
('Holidays 15', 'all-holidays', 'local', '/lotties/holidays/holidays15.json',   '#6D4C41', true),
('Holidays 16', 'all-holidays', 'local', '/lotties/holidays/holidays16.lottie', '#546E7A', true),
('Holidays 17', 'all-holidays', 'local', '/lotties/holidays/holidays17.lottie', '#C62828', true),
('Holidays 18', 'all-holidays', 'local', '/lotties/holidays/holidays18.lottie', '#1B5E20', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY
-- ============================================
-- SELECT occasion_type, COUNT(*) as total
-- FROM lottie_animations
-- WHERE occasion_type IN ('team-celebration','employee-appreciation','farewell','all-holidays')
-- GROUP BY occasion_type
-- ORDER BY occasion_type;
