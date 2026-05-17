-- ============================================
-- MIGRATION: Add Audio File Type Support
-- Adds 'audio' as a valid file_type for media table
-- ============================================

-- Drop the existing constraint
ALTER TABLE media DROP CONSTRAINT IF EXISTS media_file_type_check;

-- Add new constraint that includes 'audio'
ALTER TABLE media
  ADD CONSTRAINT media_file_type_check
  CHECK (file_type IN ('image', 'gif', 'video', 'audio'));

-- Add comment for documentation
COMMENT ON CONSTRAINT media_file_type_check ON media IS 'Valid file types: image, gif, video, audio';