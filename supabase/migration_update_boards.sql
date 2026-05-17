-- ============================================
-- MIGRATION: Update boards table structure
-- Run this ONCE to update existing database
-- ============================================

-- Step 1: Add new columns to boards table
ALTER TABLE boards
  ADD COLUMN IF NOT EXISTS short_id VARCHAR(8) UNIQUE,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'DELETED', 'PUBLISHED', 'DELIVERED')),
  ADD COLUMN IF NOT EXISTS recipient_message TEXT,
  ADD COLUMN IF NOT EXISTS notify_contributors BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS delivery_type VARCHAR(20) CHECK (delivery_type IN ('ON_DEMAND', 'SCHEDULED')),
  ADD COLUMN IF NOT EXISTS background VARCHAR(500),
  ADD COLUMN IF NOT EXISTS header_color BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS title_font VARCHAR(100) DEFAULT 'Inter',
  ADD COLUMN IF NOT EXISTS body_font VARCHAR(100) DEFAULT 'Inter',
  ADD COLUMN IF NOT EXISTS intro_animation BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS effects VARCHAR(100);

-- Step 1.5: Make old columns nullable (for backward compatibility during transition)
ALTER TABLE boards ALTER COLUMN recipient_names DROP NOT NULL;
ALTER TABLE boards ALTER COLUMN is_published DROP NOT NULL;
ALTER TABLE boards ALTER COLUMN is_deleted DROP NOT NULL;

-- Step 2: Migrate old boolean fields to new status field
UPDATE boards SET status = 'PUBLISHED' WHERE is_published = true AND status IS NULL;
UPDATE boards SET status = 'DELETED' WHERE is_deleted = true AND status IS NULL;
UPDATE boards SET status = 'CREATED' WHERE status IS NULL;

-- Step 3: Generate short_id for existing boards
CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.short_id := LOWER(SUBSTRING(REPLACE(NEW.id::TEXT, '-', '') FROM 25 FOR 8));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update existing boards with short_id
UPDATE boards
SET short_id = LOWER(SUBSTRING(REPLACE(id::TEXT, '-', '') FROM 25 FOR 8))
WHERE short_id IS NULL;

-- Make short_id NOT NULL after populating
ALTER TABLE boards ALTER COLUMN short_id SET NOT NULL;

-- Step 4: Create trigger for new boards
DROP TRIGGER IF EXISTS set_board_short_id ON boards;
CREATE TRIGGER set_board_short_id
  BEFORE INSERT ON boards
  FOR EACH ROW
  EXECUTE FUNCTION generate_short_id();

-- Step 5: Create recipients table
CREATE TABLE IF NOT EXISTS recipients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 6: Migrate recipient_names array to recipients table
DO $$
DECLARE
  board_record RECORD;
  recipient_name TEXT;
BEGIN
  FOR board_record IN SELECT id, recipient_names FROM boards WHERE recipient_names IS NOT NULL
  LOOP
    FOREACH recipient_name IN ARRAY board_record.recipient_names
    LOOP
      INSERT INTO recipients (board_id, name)
      VALUES (board_record.id, recipient_name)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Step 7: Add indexes
CREATE INDEX IF NOT EXISTS idx_boards_short_id ON boards(short_id);
CREATE INDEX IF NOT EXISTS idx_boards_status ON boards(status);
CREATE INDEX IF NOT EXISTS idx_recipients_board_id ON recipients(board_id);

-- Step 8: Enable RLS on recipients
ALTER TABLE recipients ENABLE ROW LEVEL SECURITY;

-- Step 9: Drop old policies and create new ones for boards
DROP POLICY IF EXISTS "Anyone can view published boards" ON boards;
CREATE POLICY "Anyone can view published boards"
  ON boards FOR SELECT
  USING (status = 'PUBLISHED');

-- Step 9.5: Add policy for board owners to add contributors to their own boards
DROP POLICY IF EXISTS "Board owners can add contributors" ON contributors;
CREATE POLICY "Board owners can add contributors"
  ON contributors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = contributors.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Step 10: Create recipients policies
DROP POLICY IF EXISTS "Board owners can view their board recipients" ON recipients;
CREATE POLICY "Board owners can view their board recipients"
  ON recipients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = recipients.board_id
      AND boards.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Board owners can add recipients" ON recipients;
CREATE POLICY "Board owners can add recipients"
  ON recipients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = recipients.board_id
      AND boards.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Board owners can update recipients" ON recipients;
CREATE POLICY "Board owners can update recipients"
  ON recipients FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = recipients.board_id
      AND boards.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Board owners can delete recipients" ON recipients;
CREATE POLICY "Board owners can delete recipients"
  ON recipients FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = recipients.board_id
      AND boards.user_id = auth.uid()
    )
  );

-- Step 11: Update other table policies to use status instead of is_published
DROP POLICY IF EXISTS "Anyone can add contributor to published board" ON contributors;
CREATE POLICY "Anyone can add contributor to published board"
  ON contributors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = contributors.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

DROP POLICY IF EXISTS "Anyone can view contributors of published board" ON contributors;
CREATE POLICY "Anyone can view contributors of published board"
  ON contributors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = contributors.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

DROP POLICY IF EXISTS "Anyone can add message to published board" ON messages;
CREATE POLICY "Anyone can add message to published board"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = messages.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

DROP POLICY IF EXISTS "Anyone can view messages of published board" ON messages;
CREATE POLICY "Anyone can view messages of published board"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = messages.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

DROP POLICY IF EXISTS "Anyone can upload media to published board" ON media;
CREATE POLICY "Anyone can upload media to published board"
  ON media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = media.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

DROP POLICY IF EXISTS "Anyone can view media of published board" ON media;
CREATE POLICY "Anyone can view media of published board"
  ON media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = media.board_id
      AND boards.status = 'PUBLISHED'
    )
  );

-- Step 12: OPTIONAL - Remove old columns (only after verifying everything works!)
-- Uncomment these lines when you're ready:
-- ALTER TABLE boards DROP COLUMN IF EXISTS recipient_names;
-- ALTER TABLE boards DROP COLUMN IF EXISTS is_published;
-- ALTER TABLE boards DROP COLUMN IF EXISTS is_deleted;

-- ============================================
-- Migration complete!
-- ============================================