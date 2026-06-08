-- ============================================
-- SEED OCCASIONS
-- Insert all 25 occasion types with their default settings
-- ============================================

INSERT INTO occasions (short_id, name, default_lottie, type, "order") VALUES
-- Row 1: Thank You - Farewell
('thank-you', 'Thank You',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/thankyou/thankYou5.json' LIMIT 1),
  'personal', 1),

('birthdays', 'Birthdays',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/birthday/birthday6.json' LIMIT 1),
  'personal', 2),

('new-baby', 'New Baby',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/newbaby/baby3.json' LIMIT 1),
  'personal', 3),

('weddings', 'Wedding',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/wedding/wedding2.json' LIMIT 1),
  'personal', 4),

('welcome', 'Welcome',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/welcome/welcome4.json' LIMIT 1),
  'personal', 5),

-- Row 2: Congratulations - Recruit & Onboard
('congratulations', 'Congratulations',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/congratulations/congratulations5.json' LIMIT 1),
  'personal', 6),

('farewell', 'Farewell',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/farewell/farewell4.json' LIMIT 1),
  'personal', 7),

('office-competition', 'Office Competition',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/competition/competition3.json' LIMIT 1),
  'corporate', 8),

('retirement', 'Retirement',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/farewell/farewell2.json' LIMIT 1),
  'corporate', 9),

('recruiting-onboarding', 'Recruit & Onboard',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/welcome/welcome3.json' LIMIT 1),
  'corporate', 10),

-- Row 3: Work Anniversary - Team Celebration
('work-anniversary', 'Work Anniversary',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/workanniversary/workAnniversary1.json' LIMIT 1),
  'corporate', 11),

('sympathy', 'Sympathy',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/sympathy/sympathy2.json' LIMIT 1),
  'personal', 12),

('get-well-soon', 'Get Well Soon',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/getwellsoon/getWell1.json' LIMIT 1),
  'personal', 13),

('employee-appreciation', 'Employee Appreciation',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/appreciation/appreciation1.json' LIMIT 1),
  'corporate', 14),

('team-celebration', 'Team Celebration',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/teamcelebration/teamCelebration1.json' LIMIT 1),
  'corporate', 15),

-- Row 4: Mother's Day - Apology
('mothers-day', 'Mother''s Day',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/mothersday/mothers1.json' LIMIT 1),
  'personal', 16),

('fathers-day', 'Father''s Day',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/fathersday/fathers1.json' LIMIT 1),
  'personal', 17),

('valentines-day', 'Valentine''s Day',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/love/love9.json' LIMIT 1),
  'personal', 18),

('graduation', 'Graduation',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/graduation/graduation1.json' LIMIT 1),
  'personal', 19),

('apology', 'Apology',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/apology/apology1.json' LIMIT 1),
  'personal', 20),

-- Row 5: House Warming - All Holidays
('housewarming', 'House Warming',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/housewarming/housewarming1.json' LIMIT 1),
  'personal', 21),

('promotion', 'Promotion',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/promotion/promotion2.json' LIMIT 1),
  'corporate', 22),

('christmas', 'Christmas',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/christmas/christmas1.json' LIMIT 1),
  'personal', 23),

('new-year', 'New Year',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/newyear/newYear1.json' LIMIT 1),
  'personal', 24),

('all-holidays', 'All Holidays',
  (SELECT id FROM lottie_animations WHERE file_path = '/lotties/holidays/holidays2.json' LIMIT 1),
  'personal', 25),

-- Special: Any Other (always last)
('any-other', 'Any Other',
  NULL, -- No default lottie for "Any Other"
  'personal', 99)

ON CONFLICT (short_id) DO NOTHING;

-- Print summary
DO $$
BEGIN
  RAISE NOTICE 'Successfully seeded % occasions', (SELECT COUNT(*) FROM occasions);
  RAISE NOTICE 'Personal occasions: %', (SELECT COUNT(*) FROM occasions WHERE type = 'personal');
  RAISE NOTICE 'Corporate occasions: %', (SELECT COUNT(*) FROM occasions WHERE type = 'corporate');
END $$;
