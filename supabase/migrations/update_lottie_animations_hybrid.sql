-- ============================================
-- UPDATE LOTTIE ANIMATIONS TABLE
-- Add support for both local and remote Lottie files
-- ============================================

-- Add source_type column to distinguish between local and remote files
ALTER TABLE lottie_animations
ADD COLUMN IF NOT EXISTS source_type VARCHAR(10) NOT NULL DEFAULT 'local'
CHECK (source_type IN ('local', 'remote'));

-- Add remote_url column for LottieFiles CDN URLs
ALTER TABLE lottie_animations
ADD COLUMN IF NOT EXISTS remote_url TEXT;

-- Update the file_path column to be nullable (since remote files won't use it)
ALTER TABLE lottie_animations
ALTER COLUMN file_path DROP NOT NULL;

-- Add a constraint to ensure either file_path or remote_url is provided
ALTER TABLE lottie_animations
ADD CONSTRAINT check_animation_source
CHECK (
  (source_type = 'local' AND file_path IS NOT NULL) OR
  (source_type = 'remote' AND remote_url IS NOT NULL)
);

-- Add index for source_type for faster filtering
CREATE INDEX IF NOT EXISTS idx_lottie_source_type ON lottie_animations(source_type);

-- Add helpful comment to the table
COMMENT ON COLUMN lottie_animations.source_type IS 'Either ''local'' for files in /public/lotties/ or ''remote'' for LottieFiles CDN URLs';
COMMENT ON COLUMN lottie_animations.file_path IS 'Local file path (e.g., /lotties/birthday/birthday1.json) - used when source_type=local';
COMMENT ON COLUMN lottie_animations.remote_url IS 'Remote URL (e.g., https://lottie.host/xxxxx.json) - used when source_type=remote';