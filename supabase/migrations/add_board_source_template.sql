-- ============================================
-- Record which template a board or card was created from
-- Set by "Use This Template" on the board and card view pages, so the
-- admin analytics can rank templates by use. Boards created before this
-- column existed stay NULL.
--
-- Run this BEFORE deploying the code that writes source_template_id;
-- until then those inserts would fail on the unknown column.
--
-- Safe to re-run.
-- ============================================

ALTER TABLE public.boards
  ADD COLUMN IF NOT EXISTS source_template_id UUID
  REFERENCES public.boards(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_boards_source_template_id
  ON public.boards(source_template_id);
