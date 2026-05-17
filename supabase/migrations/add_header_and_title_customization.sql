-- ============================================
-- MIGRATION: Add Header and Title Customization
-- Adds header_color_code, title_font_size, and title_font_color to boards table
-- ============================================

-- Add new columns to boards table
ALTER TABLE boards
  ADD COLUMN header_color_code VARCHAR(7) DEFAULT NULL,
  ADD COLUMN title_font_size INTEGER DEFAULT 48,
  ADD COLUMN title_font_color VARCHAR(7) DEFAULT '#0B1F2A';

-- Add comments for documentation
COMMENT ON COLUMN boards.header_color_code IS 'Hex color code for header background (e.g., #ffffff)';
COMMENT ON COLUMN boards.title_font_size IS 'Font size for the board title in pixels (e.g., 12, 14, 16, 48)';
COMMENT ON COLUMN boards.title_font_color IS 'Hex color code for the title text (e.g., #0B1F2A)';

-- Add check constraints to ensure valid hex color format
ALTER TABLE boards
  ADD CONSTRAINT check_header_color_code_format CHECK (
    header_color_code IS NULL OR header_color_code ~* '^#[0-9A-F]{6}$'
  ),
  ADD CONSTRAINT check_title_font_color_format CHECK (
    title_font_color ~* '^#[0-9A-F]{6}$'
  ),
  ADD CONSTRAINT check_title_font_size_range CHECK (
    title_font_size >= 8 AND title_font_size <= 128
  );

-- Create index for potential queries filtering by header color
CREATE INDEX idx_boards_header_color_code ON boards(header_color_code) WHERE header_color_code IS NOT NULL;