# Fix RLS Policies for Public Board Access

## The Problem
Row Level Security (RLS) policies are blocking public access to boards. Contributors can't view boards even with the link.

## The Solution
Run this SQL in Supabase SQL Editor to allow public read access to non-deleted boards.

## Steps:

1. Go to: https://supabase.com/dashboard/project/mcphhtoacpkwtgmdycho/sql/new

2. Copy and paste this SQL:

```sql
-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Anyone can view published boards" ON boards;

-- Allow anyone to view non-deleted boards
CREATE POLICY "Anyone can view non-deleted boards"
  ON boards FOR SELECT
  USING (status != 'DELETED');

-- Allow anyone to view recipients
DROP POLICY IF EXISTS "Anyone can view recipients for non-deleted boards" ON recipients;
CREATE POLICY "Anyone can view recipients for non-deleted boards"
  ON recipients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = recipients.board_id
      AND boards.status != 'DELETED'
    )
  );

-- Allow anyone to view contributors
DROP POLICY IF EXISTS "Anyone can view contributors" ON contributors;
CREATE POLICY "Anyone can view contributors"
  ON contributors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = contributors.board_id
      AND boards.status != 'DELETED'
    )
  );

-- Allow anyone to add contributors
DROP POLICY IF EXISTS "Anyone can create contributors" ON contributors;
CREATE POLICY "Anyone can create contributors"
  ON contributors FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = contributors.board_id
      AND boards.status NOT IN ('DELETED', 'DELIVERED')
    )
  );

-- Allow anyone to view messages
DROP POLICY IF EXISTS "Anyone can view messages" ON messages;
CREATE POLICY "Anyone can view messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = messages.board_id
      AND boards.status != 'DELETED'
    )
  );

-- Allow anyone to create messages (but not on delivered boards)
DROP POLICY IF EXISTS "Anyone can create messages" ON messages;
CREATE POLICY "Anyone can create messages"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = messages.board_id
      AND boards.status NOT IN ('DELETED', 'DELIVERED')
    )
  );

-- Allow anyone to view media
DROP POLICY IF EXISTS "Anyone can view media" ON media;
CREATE POLICY "Anyone can view media"
  ON media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = media.board_id
      AND boards.status != 'DELETED'
    )
  );

-- Allow anyone to upload media
DROP POLICY IF EXISTS "Anyone can upload media" ON media;
CREATE POLICY "Anyone can upload media"
  ON media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards
      WHERE boards.id = media.board_id
      AND boards.status NOT IN ('DELETED', 'DELIVERED')
    )
  );
```

3. Click "Run" (or press Cmd/Ctrl + Enter)

4. You should see "Success. No rows returned"

5. Test by visiting: http://localhost:3000/boards/342fe73e

## Available Test Boards:

After running the SQL, these boards should be accessible:

- http://localhost:3000/boards/342fe73e (Happy Birthday Sarah! 🎂)
- http://localhost:3000/boards/2a4a53de (Congrats Lan)
- http://localhost:3000/boards/a406070d (bbb)
- http://localhost:3000/boards/a7006fec (Congrats on your wedding)
- http://localhost:3000/boards/a1549d0d (hey baby)
- http://localhost:3000/boards/87d44920 (we love you)

