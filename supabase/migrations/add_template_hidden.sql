-- ============================================
-- Hide a template without deleting it
-- The admin template manager toggles this; the templates page and the
-- dashboard skip hidden templates. Only meaningful when is_template is
-- true.
--
-- Run this BEFORE deploying the code that filters on template_hidden;
-- until then those template queries would fail on the unknown column.
--
-- Safe to re-run.
-- ============================================

ALTER TABLE public.boards
  ADD COLUMN IF NOT EXISTS template_hidden BOOLEAN NOT NULL DEFAULT false;
