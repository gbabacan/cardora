-- ============================================
-- ORDER AND RETITLE ALL HOLIDAYS TEMPLATES
-- Adds boards.template_order, which the templates page and dashboard
-- sort by within an occasion (lowest first, NULL last), and sets it for
-- the All Holidays Lottie templates in this order:
--   Easter, Thanksgiving, Ramadan, Eid, Diwali, Hanukkah.
--
-- Also gives each of those templates a title that matches its holiday;
-- the titles first seeded were generic ("Merry Everything").
--
-- Holiday per file, checked against each animation's content:
--   Easter        holidays4, 6, 7, 8, 9, 10, 11, 12
--   Thanksgiving  holidays5
--   Ramadan       holidays2, 14
--   Eid           holidays1, 13
--   Diwali        holidays16, 17, 18
--   Hanukkah      holidays3, 15
--
-- Board and card templates of a Lottie get the same title and order.
-- Run this BEFORE deploying the code that sorts by template_order, and
-- AFTER seed_all_lottie_templates.sql (or seed_holidays_lottie_templates.sql).
--
-- Safe to re-run.
-- ============================================

ALTER TABLE public.boards ADD COLUMN IF NOT EXISTS template_order integer;

WITH holiday (file_path, title, template_order) AS (
  VALUES
    -- Easter
    ('/lotties/holidays/holidays4.json',    'Happy Easter',          1),
    ('/lotties/holidays/holidays6.lottie',  'Hoppy Easter',          2),
    ('/lotties/holidays/holidays7.lottie',  'Egg-cellent Easter',    3),
    ('/lotties/holidays/holidays8.lottie',  'Easter Bunny Hugs',     4),
    ('/lotties/holidays/holidays9.lottie',  'Easter Joy',            5),
    ('/lotties/holidays/holidays10.lottie', 'Spring Into Easter',    6),
    ('/lotties/holidays/holidays11.lottie', 'Hatching Happiness',    7),
    ('/lotties/holidays/holidays12.json',   'Easter Blessings',      8),
    -- Thanksgiving
    ('/lotties/holidays/holidays5.json',    'Happy Thanksgiving',    9),
    -- Ramadan
    ('/lotties/holidays/holidays2.json',    'Ramadan Mubarak',      10),
    ('/lotties/holidays/holidays14.lottie', 'Ramadan Kareem',       11),
    -- Eid
    ('/lotties/holidays/holidays1.json',    'Eid Mubarak',          12),
    ('/lotties/holidays/holidays13.lottie', 'Eid Blessings',        13),
    -- Diwali
    ('/lotties/holidays/holidays16.lottie', 'Happy Diwali',         14),
    ('/lotties/holidays/holidays17.lottie', 'Festival of Lights',   15),
    ('/lotties/holidays/holidays18.lottie', 'Diwali Glow',          16),
    -- Hanukkah
    ('/lotties/holidays/holidays3.json',    'Hanukkah Lights',      17),
    ('/lotties/holidays/holidays15.json',   'Happy Hanukkah',       18)
)
UPDATE public.boards bo
SET title = h.title,
    template_order = h.template_order
FROM public.backgrounds b
JOIN public.lottie_animations la ON la.id = b.lottie_animation_id
JOIN holiday h ON h.file_path = la.file_path
WHERE bo.card_background_id = b.id
  AND bo.is_template = true
  AND bo.occasion_type = 'all-holidays';

-- Expected: 36 rows updated (18 boards + 18 cards).

-- Verify: All Holidays templates in display order.
-- ============================================
-- SELECT bo.format_type, bo.template_order, bo.title, la.file_path
-- FROM public.boards bo
-- JOIN public.backgrounds b ON b.id = bo.card_background_id
-- JOIN public.lottie_animations la ON la.id = b.lottie_animation_id
-- WHERE bo.is_template = true AND bo.occasion_type = 'all-holidays'
-- ORDER BY bo.format_type, bo.template_order NULLS LAST;
