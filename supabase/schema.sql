-- ============================================
-- CARDORA DATABASE SCHEMA
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BOARDS TABLE
-- Stores the main boards/cards created by users
-- ============================================
CREATE TABLE IF NOT EXISTS boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_id VARCHAR(8) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  occasion_type TEXT NOT NULL, -- birthday, wedding, thank-you, etc.
  format_type TEXT NOT NULL CHECK (format_type IN ('board', 'card')), -- board or card
  status VARCHAR(20) DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'DELETED', 'PUBLISHED', 'DELIVERED')),
  recipient_message TEXT, -- Message to recipients
  notify_contributors BOOLEAN DEFAULT true, -- Notify contributors when delivered
  delivery_type VARCHAR(20) CHECK (delivery_type IN ('ON_DEMAND', 'SCHEDULED')),
  scheduled_delivery TIMESTAMPTZ, -- Optional scheduled delivery time
  background VARCHAR(500), -- Background image URL
  header_color BOOLEAN DEFAULT false,
  title_font VARCHAR(100) DEFAULT 'Inter',
  body_font VARCHAR(100) DEFAULT 'Inter',
  intro_animation BOOLEAN DEFAULT true,
  effects VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to generate short_id from UUID
CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.short_id := LOWER(SUBSTRING(REPLACE(NEW.id::TEXT, '-', '') FROM 25 FOR 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate short_id
CREATE TRIGGER set_board_short_id
  BEFORE INSERT ON boards
  FOR EACH ROW
  EXECUTE FUNCTION generate_short_id();

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_boards_user_id ON boards(user_id);
CREATE INDEX IF NOT EXISTS idx_boards_short_id ON boards(short_id);
CREATE INDEX IF NOT EXISTS idx_boards_occasion_type ON boards(occasion_type);
CREATE INDEX IF NOT EXISTS idx_boards_status ON boards(status);
CREATE INDEX IF NOT EXISTS idx_boards_created_at ON boards(created_at DESC);

-- ============================================
-- RECIPIENTS TABLE
-- Stores recipients for each board
-- ============================================
CREATE TABLE IF NOT EXISTS recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_recipients_board_id ON recipients(board_id);

-- ============================================
-- CONTRIBUTORS TABLE
-- Stores people who contribute to boards
-- ============================================
CREATE TABLE IF NOT EXISTS contributors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_contributors_board_id ON contributors(board_id);

-- ============================================
-- MESSAGES TABLE
-- Stores text messages/contributions on boards
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  contributor_id UUID REFERENCES contributors(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT true, -- For moderation if needed
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_board_id ON messages(board_id);
CREATE INDEX IF NOT EXISTS idx_messages_contributor_id ON messages(contributor_id);

-- ============================================
-- MEDIA TABLE
-- Stores uploaded images/GIFs/videos
-- ============================================
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE, -- Optional: media can be attached to a message
  contributor_id UUID REFERENCES contributors(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL, -- Supabase storage URL
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'gif', 'video')),
  file_size BIGINT, -- in bytes
  thumbnail_url TEXT, -- Optional thumbnail
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_media_board_id ON media(board_id);
CREATE INDEX IF NOT EXISTS idx_media_message_id ON media(message_id);

-- ============================================
-- BOARD_SETTINGS TABLE
-- Stores customization settings for each board
-- ============================================
CREATE TABLE IF NOT EXISTS board_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE UNIQUE,
  background_color TEXT DEFAULT '#FFFFFF',
  theme_id TEXT, -- Reference to predefined themes
  allow_anonymous_contributions BOOLEAN DEFAULT true,
  require_approval BOOLEAN DEFAULT false, -- Require admin approval for messages
  custom_message TEXT, -- Custom welcome message
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_board_settings_board_id ON board_settings(board_id);

-- ============================================
-- FUNCTION: Update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS: Auto-update updated_at
-- ============================================
CREATE TRIGGER update_boards_updated_at
  BEFORE UPDATE ON boards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_board_settings_updated_at
  BEFORE UPDATE ON board_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables
-- ============================================
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- BOARDS POLICIES
-- ============================================

-- Users can view their own boards
CREATE POLICY "Users can view their own boards"
  ON boards FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create boards
CREATE POLICY "Users can create boards"
  ON boards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own boards
CREATE POLICY "Users can update their own boards"
  ON boards FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own boards
CREATE POLICY "Users can delete their own boards"
  ON boards FOR DELETE
  USING (auth.uid() = user_id);

-- Anyone can view published boards (for sharing links)
CREATE POLICY "Anyone can view published boards"
  ON boards FOR SELECT
  USING (status = 'PUBLISHED');

-- ============================================
-- RECIPIENTS POLICIES
-- ============================================

-- Board owners can view their board recipients
CREATE POLICY "Board owners can view their board recipients"
  ON recipients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = recipients.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Board owners can add recipients
CREATE POLICY "Board owners can add recipients"
  ON recipients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = recipients.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Board owners can update recipients
CREATE POLICY "Board owners can update recipients"
  ON recipients FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = recipients.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Board owners can delete recipients
CREATE POLICY "Board owners can delete recipients"
  ON recipients FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = recipients.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- ============================================
-- CONTRIBUTORS POLICIES
-- ============================================

-- Board owners can add contributors to their own boards (for invites)
CREATE POLICY "Board owners can add contributors"
  ON contributors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = contributors.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Anyone can add a contributor to a published board
CREATE POLICY "Anyone can add contributor to published board"
  ON contributors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = contributors.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

-- Anyone can view contributors of a published board
CREATE POLICY "Anyone can view contributors of published board"
  ON contributors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = contributors.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

-- Board owners can view all contributors
CREATE POLICY "Board owners can view all contributors"
  ON contributors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = contributors.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- ============================================
-- MESSAGES POLICIES
-- ============================================

-- Anyone can add a message to a published board
CREATE POLICY "Anyone can add message to published board"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = messages.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

-- Anyone can view messages of a published board
CREATE POLICY "Anyone can view messages of published board"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = messages.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

-- Board owners can view all messages
CREATE POLICY "Board owners can view all messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = messages.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Board owners can update messages (for moderation)
CREATE POLICY "Board owners can update messages"
  ON messages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = messages.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Board owners can delete messages
CREATE POLICY "Board owners can delete messages"
  ON messages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = messages.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- ============================================
-- MEDIA POLICIES
-- ============================================

-- Anyone can upload media to a published board
CREATE POLICY "Anyone can upload media to published board"
  ON media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = media.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

-- Anyone can view media of a published board
CREATE POLICY "Anyone can view media of published board"
  ON media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = media.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

-- Board owners can view all media
CREATE POLICY "Board owners can view all media"
  ON media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = media.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Board owners can delete media
CREATE POLICY "Board owners can delete media"
  ON media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = media.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- ============================================
-- BOARD_SETTINGS POLICIES
-- ============================================

-- Board owners can view their board settings
CREATE POLICY "Board owners can view their board settings"
  ON board_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = board_settings.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Board owners can create board settings
CREATE POLICY "Board owners can create board settings"
  ON board_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = board_settings.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Board owners can update their board settings
CREATE POLICY "Board owners can update their board settings"
  ON board_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = board_settings.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- ============================================
-- STORAGE BUCKETS (for file uploads)
-- ============================================

-- Create a storage bucket for board media
INSERT INTO storage.buckets (id, name, public)
VALUES ('board-media', 'board-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can upload to published boards
CREATE POLICY "Anyone can upload to board-media"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'board-media');

-- Storage policy: Anyone can view board media
CREATE POLICY "Anyone can view board-media"
ON storage.objects FOR SELECT
USING (bucket_id = 'board-media');

-- Storage policy: Board owners can delete their board media
CREATE POLICY "Board owners can delete their board-media"
ON storage.objects FOR DELETE
USING (bucket_id = 'board-media');