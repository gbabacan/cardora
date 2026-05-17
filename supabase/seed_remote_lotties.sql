-- ============================================
-- SEED DATA - Remote Lottie Animations
-- Generated from lotties.MD file
-- All animations are from LottieFiles CDN (source_type='remote')
-- ============================================

-- NOTE: LottieFiles URLs need to be converted to the actual JSON CDN URLs
-- Format: https://lottiefiles.com/free-animation/NAME-ID
-- To get the actual JSON URL:
-- 1. Visit the animation page
-- 2. Click "Lottie Animation URL" or inspect the player
-- 3. Look for: https://lottie.host/[ID]/[NAME].json
--
-- For now, these are placeholders - you'll need to replace with actual CDN URLs

-- ============================================
-- THANK YOU (10 animations)
-- ============================================
INSERT INTO lottie_animations (name, occasion_type, source_type, remote_url, helper_color, is_active) VALUES
-- Replace 'PLACEHOLDER' with actual https://lottie.host/... URLs from each animation page
('Thank You with Confetti', 'thankyou', 'remote', 'https://lottie.host/PLACEHOLDER-pNRf1iVP7Y/animation.json', '#E74C3C', false),
('Thank You', 'thankyou', 'remote', 'https://lottie.host/PLACEHOLDER-hUky7L46YA/animation.json', '#E74C3C', false),
('Man Holding Thank You Banner', 'thankyou', 'remote', 'https://lottie.host/PLACEHOLDER-tPt5ycHQA7/animation.json', '#E74C3C', false),
('Thank You LottieFiles', 'thankyou', 'remote', 'https://lottie.host/PLACEHOLDER-SUGYQK6Ujf/animation.json', '#E74C3C', false),
('Thank You Animation', 'thankyou', 'remote', 'https://lottie.host/PLACEHOLDER-njm83n9yog/animation.json', '#E74C3C', false),
('Thank You Lottie', 'thankyou', 'remote', 'https://lottie.host/PLACEHOLDER-M5bu0lRpZL/animation.json', '#E74C3C', false),
('Thank You with Confetti Edited', 'thankyou', 'remote', 'https://lottie.host/PLACEHOLDER-VJN0cDU0Mr/animation.json', '#E74C3C', false),
('Thank You Text Animation', 'thankyou', 'remote', 'https://lottie.host/PLACEHOLDER-u6TCYmuohl/animation.json', '#E74C3C', false),
('Thank You Simple', 'thankyou', 'remote', 'https://lottie.host/PLACEHOLDER-CXMpfOySd2/animation.json', '#E74C3C', false),
('Thank You Celebration', 'thankyou', 'remote', 'https://lottie.host/PLACEHOLDER-4779dnZ81h/animation.json', '#E74C3C', false),

-- ============================================
-- APPRECIATION
-- ============================================
('Loyalty Appreciation', 'appreciation', 'remote', 'https://lottie.host/PLACEHOLDER-PlyJ0oAh7L/animation.json', '#F39C12', false),

-- ============================================
-- COMPANY CELEBRATION
-- ============================================
('Rewards Programme', 'companycelebration', 'remote', 'https://lottie.host/PLACEHOLDER-soZW195JXp/animation.json', '#3498DB', false),

-- ============================================
-- CONGRATULATIONS
-- ============================================
('Congratulations', 'congratulations', 'remote', 'https://lottie.host/PLACEHOLDER-GNE2y3XUYt/animation.json', '#FFD700', false),

-- ============================================
-- FAREWELL
-- ============================================
('Bye Animation Exit', 'farewell', 'remote', 'https://lottie.host/PLACEHOLDER-w1uscYcms1/animation.json', '#3498DB', false),

-- ============================================
-- FATHERS DAY
-- ============================================
('Fathers Love', 'fathersday', 'remote', 'https://lottie.host/PLACEHOLDER-8x0CzFPs4Y/animation.json', '#5D4E37', false),

-- ============================================
-- GET WELL SOON
-- ============================================
('Its Gonna Be Okay', 'getwellsoon', 'remote', 'https://lottie.host/PLACEHOLDER-CUqDobStxz/animation.json', '#2ECC71', false),

-- ============================================
-- HOLIDAY
-- ============================================
('Beach Holiday', 'holiday', 'remote', 'https://lottie.host/PLACEHOLDER-ToabN8RkYT/animation.json', '#00CED1', false),

-- ============================================
-- MOTHERS DAY
-- ============================================
('Mother and Son', 'mothersday', 'remote', 'https://lottie.host/PLACEHOLDER-z9d3EMTR3b/animation.json', '#FF69B4', false),

-- ============================================
-- NEW BABY
-- ============================================
('New Baby', 'newbaby', 'remote', 'https://lottie.host/PLACEHOLDER-50RWQ0sJYi/animation.json', '#87CEEB', false),

-- ============================================
-- OFFICE COMPETITION
-- ============================================
('Olympic Boxing', 'officecompetition', 'remote', 'https://lottie.host/PLACEHOLDER-48bXus0UyL/animation.json', '#FFD700', false),

-- ============================================
-- ONBOARDING
-- ============================================
('Hello Onboarding', 'onboarding', 'remote', 'https://lottie.host/PLACEHOLDER-zzjQ1VzxDn/animation.json', '#9370DB', false),

-- ============================================
-- OTHER
-- ============================================
('Celebrate', 'other', 'remote', 'https://lottie.host/PLACEHOLDER-XpL7sa6js7/animation.json', '#95A5A6', false),

-- ============================================
-- RETIREMENT
-- ============================================
('Enjoy Beach Vacation', 'retirement', 'remote', 'https://lottie.host/PLACEHOLDER-C5ax2MCG7i/animation.json', '#FF8C00', false),

-- ============================================
-- SYMPATHY
-- ============================================
('Sympathy Animation', 'sympathy', 'remote', 'https://lottie.host/PLACEHOLDER-3GEZHkqRig/animation.json', '#696969', false),

-- ============================================
-- TEAM CELEBRATION
-- ============================================
('Team Celebration', 'teamcelebration', 'remote', 'https://lottie.host/PLACEHOLDER-cwya1gTva1/animation.json', '#FF4757', false),

-- ============================================
-- VALENTINES DAY
-- ============================================
('Bird Pair Love', 'valentinesday', 'remote', 'https://lottie.host/PLACEHOLDER-4LHUsFSYhQ/animation.json', '#FF1493', false),

-- ============================================
-- WEDDING
-- ============================================
('Wedding Celebration', 'wedding', 'remote', 'https://lottie.host/PLACEHOLDER-NNrvNHnZPA/animation.json', '#FFE4E1', false),

-- ============================================
-- WORK ANNIVERSARY
-- ============================================
('Love Letter Anniversary', 'workanniversary', 'remote', 'https://lottie.host/PLACEHOLDER-JlZMgF8c9a/animation.json', '#DAA520', false)

ON CONFLICT DO NOTHING;

-- ============================================
-- IMPORTANT: HOW TO GET ACTUAL CDN URLs
-- ============================================
-- 1. Visit each animation page (from lotties.MD)
-- 2. Right-click on the animation player → Inspect Element
-- 3. Look for <lottie-player> tag with src="https://lottie.host/..."
-- 4. Copy that URL and replace the PLACEHOLDER URLs above
-- 5. OR use the LottieFiles API to fetch animation data programmatically

-- ============================================
-- HELPER COLOR PALETTE BY OCCASION
-- ============================================
-- thankyou: #E74C3C (Red)
-- appreciation: #F39C12 (Orange)
-- companycelebration: #3498DB (Blue)
-- congratulations: #FFD700 (Gold)
-- farewell: #3498DB (Blue)
-- fathersday: #5D4E37 (Brown)
-- getwellsoon: #2ECC71 (Green)
-- holiday: #00CED1 (Turquoise)
-- mothersday: #FF69B4 (Pink)
-- newbaby: #87CEEB (Sky Blue)
-- officecompetition: #FFD700 (Gold)
-- onboarding: #9370DB (Purple)
-- other: #95A5A6 (Gray)
-- retirement: #FF8C00 (Orange)
-- sympathy: #696969 (Dark Gray)
-- teamcelebration: #FF4757 (Red)
-- valentinesday: #FF1493 (Deep Pink)
-- wedding: #FFE4E1 (Misty Rose)
-- workanniversary: #DAA520 (Goldenrod)

-- ============================================
-- VERIFY DATA
-- ============================================
-- SELECT occasion_type, COUNT(*) as count
-- FROM lottie_animations
-- WHERE source_type = 'remote'
-- GROUP BY occasion_type
-- ORDER BY occasion_type;