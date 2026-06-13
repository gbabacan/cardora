-- ============================================
-- SEED DATA - Christmas Lottie Animations 6–14
-- Extends the existing 5 christmas entries.
-- Mix of .json and .lottie binary files.
-- ============================================

INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
-- .lottie binary files
('Christmas Magic 6',  'christmas', 'local', '/lotties/christmas/christmas6.lottie',  '#B71C1C', true),
('Christmas Magic 10', 'christmas', 'local', '/lotties/christmas/christmas10.lottie', '#4CAF50', true),
('Christmas Magic 11', 'christmas', 'local', '/lotties/christmas/christmas11.lottie', '#388E3C', true),
('Christmas Magic 13', 'christmas', 'local', '/lotties/christmas/christmas13.lottie', '#FFC107', true),
('Christmas Magic 14', 'christmas', 'local', '/lotties/christmas/christmas14.lottie', '#FFD54F', true),

-- .json files
('Christmas Magic 7',  'christmas', 'local', '/lotties/christmas/christmas7.json',  '#C62828', true),
('Christmas Magic 8',  'christmas', 'local', '/lotties/christmas/christmas8.json',  '#D32F2F', true),
('Christmas Magic 9',  'christmas', 'local', '/lotties/christmas/christmas9.json',  '#E53935', true),
('Christmas Magic 12', 'christmas', 'local', '/lotties/christmas/christmas12.json', '#2E7D32', true)

ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY
-- ============================================
-- SELECT name, file_path, helper_color, is_active
-- FROM lottie_animations
-- WHERE occasion_type = 'christmas'
-- ORDER BY name;
