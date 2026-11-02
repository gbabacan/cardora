-- ============================================
-- Record where a board's creator first came from
-- The browser keeps the visitor's first-touch source (utm tags or referring
-- site, see lib/acquisition.ts) and saves it with each board they create, so
-- the admin analytics can show boards and board creators by source.
--
-- Shape: { "source": "linkedin", "medium": "social", "campaign": null,
--          "referrer": "www.linkedin.com", "landing": "/birthday-cards",
--          "first_seen": "2026-11-02T10:00:00.000Z" }
-- Boards created before this column existed stay NULL ("unknown").
--
-- The code retries without the column if it doesn't exist yet, so this can
-- run before or after deploying. Safe to re-run.
-- ============================================

ALTER TABLE public.boards
  ADD COLUMN IF NOT EXISTS acquisition JSONB;
