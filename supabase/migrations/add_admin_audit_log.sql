-- ============================================
-- Record of every change made from the admin page (/gokhan): templates,
-- media, moderation and deliveries. Shown in its Audit log tab.
--
-- admin_email is stored as well as admin_id so entries stay readable if
-- the account is later deleted.
--
-- RLS is on with no policies: only the service-role key used by the admin
-- API routes can read or write it.
--
-- Run this BEFORE deploying the code that writes to it. (Writes are best
-- effort, so admin actions still work without it, but nothing would be
-- recorded.)
--
-- Safe to re-run.
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,          -- e.g. 'template.update', 'message.hide'
  target_type TEXT NOT NULL,     -- 'template' | 'media' | 'board' | 'message' | 'email'
  target_id TEXT,
  board_id UUID,                 -- the board or template involved, for linking and filtering
  summary TEXT NOT NULL,         -- one readable line
  details JSONB,                 -- before/after values and other context
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON public.admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_board_id ON public.admin_audit_log(board_id);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
