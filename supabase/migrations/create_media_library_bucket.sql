-- ============================================
-- Storage bucket for animations and images uploaded from the admin
-- media library
-- Public, so the site can load files by URL like the ones in /public.
-- Uploads only happen through signed upload URLs that the admin API
-- issues, so no insert policy is needed.
--
-- Uploaded rows are stored as source_type 'remote', with the public URL
-- in both file_path and remote_url, because most views read file_path.
--
-- Safe to re-run.
-- ============================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media-library',
  'media-library',
  true,
  20971520, -- 20 MB
  ARRAY['application/json', 'application/zip', 'image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
