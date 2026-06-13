-- ============================================
-- SEED DATA - Mixed Occasion Lottie Animations
-- teamCelebration3–6, appreciation2–4,
-- houseWarming3, promotion3–5, welcome6
-- ============================================

-- Team Celebration (3–6) — .lottie
INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Team Celebration 3', 'team-celebration', 'local', '/lotties/teamcelebration/teamCelebration3.lottie', '#1E88E5', true),
('Team Celebration 4', 'team-celebration', 'local', '/lotties/teamcelebration/teamCelebration4.lottie', '#43A047', true),
('Team Celebration 5', 'team-celebration', 'local', '/lotties/teamcelebration/teamCelebration5.lottie', '#FFB300', true),
('Team Celebration 6', 'team-celebration', 'local', '/lotties/teamcelebration/teamCelebration6.lottie', '#E53935', true)
ON CONFLICT DO NOTHING;

-- Employee Appreciation (2–4) — .lottie
INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Employee Appreciation 2', 'employee-appreciation', 'local', '/lotties/appreciation/appreciation2.lottie', '#F57C00', true),
('Employee Appreciation 3', 'employee-appreciation', 'local', '/lotties/appreciation/appreciation3.lottie', '#FFA726', true),
('Employee Appreciation 4', 'employee-appreciation', 'local', '/lotties/appreciation/appreciation4.lottie', '#FFD54F', true)
ON CONFLICT DO NOTHING;

-- House Warming (3) — .lottie
INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('House Warming 3', 'housewarming', 'local', '/lotties/housewarming/houseWarming3.lottie', '#EF6C00', true)
ON CONFLICT DO NOTHING;

-- Promotion (3–5) — .json
INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Promotion 3', 'promotion', 'local', '/lotties/promotion/promotion3.json', '#7B1FA2', true),
('Promotion 4', 'promotion', 'local', '/lotties/promotion/promotion4.json', '#6A1B9A', true),
('Promotion 5', 'promotion', 'local', '/lotties/promotion/promotion5.json', '#4A148C', true)
ON CONFLICT DO NOTHING;

-- Welcome (6) — .json
INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Welcome Aboard 6', 'welcome', 'local', '/lotties/welcome/welcome6.json', '#00ACC1', true)
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY
-- ============================================
-- SELECT occasion_type, COUNT(*) as total
-- FROM lottie_animations
-- WHERE occasion_type IN ('team-celebration','employee-appreciation','housewarming','promotion','welcome')
-- GROUP BY occasion_type
-- ORDER BY occasion_type;
