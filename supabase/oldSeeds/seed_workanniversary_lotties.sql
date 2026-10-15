-- ============================================
-- SEED DATA - Work Anniversary Lottie Animations 2–3
-- All new files are .lottie binary format.
-- Existing: workAnniversary1.json (already seeded)
-- ============================================

INSERT INTO lottie_animations (name, occasion_type, source_type, file_path, helper_color, is_active) VALUES
('Work Anniversary 2', 'work_anniversary', 'local', '/lotties/workanniversary/workAnniversary2.lottie', '#1565C0', true),
('Work Anniversary 3', 'work_anniversary', 'local', '/lotties/workanniversary/workAnniversary3.lottie', '#FFD700', true)

ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFY
-- ============================================
-- SELECT name, file_path, helper_color, is_active
-- FROM lottie_animations
-- WHERE occasion_type = 'work_anniversary'
-- ORDER BY name;
