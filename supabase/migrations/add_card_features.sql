-- Add envelope fields to boards table
ALTER TABLE boards
ADD COLUMN envelope_font TEXT DEFAULT 'Inter',
ADD COLUMN envelope_color TEXT DEFAULT '#F5E6D3';

-- Add card theme reference (lottie animation)
ALTER TABLE boards
ADD COLUMN card_theme_id UUID REFERENCES lottie_animations(id);

-- Create textures table (similar to effects)
CREATE TABLE IF NOT EXISTS textures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL, -- Internal file link to texture image
  thumbnail_path TEXT,
  category TEXT, -- e.g., 'paper', 'fabric', 'vintage', 'modern'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add texture reference to boards
ALTER TABLE boards
ADD COLUMN texture_id UUID REFERENCES textures(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_boards_texture_id ON boards(texture_id);
CREATE INDEX IF NOT EXISTS idx_boards_card_theme_id ON boards(card_theme_id);

-- Add RLS policies for textures table
ALTER TABLE textures ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read textures
CREATE POLICY "Anyone can view textures"
  ON textures FOR SELECT
  USING (true);

-- Only authenticated users can insert textures (for admin use)
CREATE POLICY "Authenticated users can insert textures"
  ON textures FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Seed some default textures
--INSERT INTO textures (name, description, file_path, category) VALUES
--  ('Plain White', 'Clean white card texture', '/textures/plain-white.jpg', 'paper'),
--  ('Cream Paper', 'Warm cream colored paper', '/textures/cream-paper.jpg', 'paper'),
--  ('Vintage Paper', 'Aged vintage paper texture', '/textures/vintage-paper.jpg', 'vintage'),
--  ('Linen Fabric', 'Natural linen texture', '/textures/linen.jpg', 'fabric'),
--  ('Watercolor', 'Soft watercolor background', '/textures/watercolor.jpg', 'modern'),
--  ('Kraft Paper', 'Brown kraft paper texture', '/textures/kraft-paper.jpg', 'paper'),
--  ('Floral Pattern', 'Delicate floral pattern', '/textures/floral.jpg', 'modern'),
--  ('Gold Foil', 'Elegant gold foil texture', '/textures/gold-foil.jpg', 'modern')
--ON CONFLICT DO NOTHING;

-- Add comment to explain the new fields
COMMENT ON COLUMN boards.envelope_font IS 'Font used for envelope text (From/To)';
COMMENT ON COLUMN boards.envelope_color IS 'Background color of the envelope';
COMMENT ON COLUMN boards.card_theme_id IS 'Lottie animation theme for the card';
COMMENT ON COLUMN boards.texture_id IS 'Texture/background pattern for the card';
COMMENT ON COLUMN boards.recipient_message IS 'Message content for card format (used for cards)';