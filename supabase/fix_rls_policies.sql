-- ============================================
-- FIX RLS POLICIES FOR PUBLIC BOARD ACCESS
-- Allow contributors to view boards via short_id
-- ============================================

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Anyone can view published boards" ON boards;

-- Create new policy: Anyone can view non-deleted boards (for contributor access)
CREATE POLICY "Anyone can view non-deleted boards"
  ON boards FOR SELECT
  USING (status != 'DELETED');

-- ============================================
-- RECIPIENTS POLICIES - Allow public read
-- ============================================

-- Allow anyone to view recipients for non-deleted boards
CREATE POLICY "Anyone can view recipients for non-deleted boards"
  ON recipients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = recipients.board_id
      AND boards.status != 'DELETED'
    )
  );

-- ============================================
-- CONTRIBUTORS POLICIES
-- ============================================

-- Anyone can view contributors for non-deleted boards
CREATE POLICY "Anyone can view contributors"
  ON contributors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = contributors.board_id
      AND boards.status != 'DELETED'
    )
  );

-- Anyone can add themselves as a contributor (for posting messages)
CREATE POLICY "Anyone can create contributors"
  ON contributors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = contributors.board_id
      AND boards.status != 'DELETED'
      AND boards.status != 'DELIVERED'
    )
  );

-- ============================================
-- MESSAGES POLICIES
-- ============================================

-- Anyone can view messages for non-deleted boards
CREATE POLICY "Anyone can view messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = messages.board_id
      AND boards.status != 'DELETED'
    )
  );

-- Anyone can create messages for non-delivered boards
CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = messages.board_id
      AND boards.status != 'DELETED'
      AND boards.status != 'DELIVERED'
    )
  );

-- ============================================
-- MEDIA POLICIES
-- ============================================

-- Anyone can view media for non-deleted boards
CREATE POLICY "Anyone can view media"
  ON media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = media.board_id
      AND boards.status != 'DELETED'
    )
  );

-- Anyone can upload media for non-delivered boards
CREATE POLICY "Anyone can upload media"
  ON media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = media.board_id
      AND boards.status != 'DELETED'
      AND boards.status != 'DELIVERED'
    )
  );