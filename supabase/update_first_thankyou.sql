-- Activate the Thank You animation we confirmed working
UPDATE lottie_animations
SET
  remote_url = 'https://assets-v2.lottiefiles.com/a/6a0cd638-48b9-11ef-b744-db583b43c862/KzeQAnBTz3.json',
  is_active = true
WHERE
  occasion_type = 'thankyou'
  AND name = 'Thank You Celebration'
  AND source_type = 'remote';