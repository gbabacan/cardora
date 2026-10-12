-- ============================================
-- Email and scheduled-delivery history for the admin Deliveries tab
--
-- email_log: one row per board email sent (or attempted) through Resend:
-- deliveries to recipients, "your message was delivered" notices to
-- contributors, invites, and admin test emails.
--
-- cron_runs: one row per call of /api/cron/deliver-scheduled (cron-job.org
-- calls it hourly), so the admin page can tell when it stops running.
--
-- RLS is on with no policies: only the service-role key used by the API
-- routes can read or write these tables.
--
-- Run this BEFORE deploying the code that writes to them. (Writes are
-- best effort, so emails still send without the tables, but nothing would
-- be recorded.)
--
-- Safe to re-run.
-- ============================================

CREATE TABLE IF NOT EXISTS public.email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID REFERENCES public.boards(id) ON DELETE SET NULL,
  kind TEXT NOT NULL CHECK (kind IN ('delivery', 'delivered_notice', 'invite', 'test')),
  trigger TEXT NOT NULL CHECK (trigger IN ('owner', 'contributor', 'cron', 'admin')),
  to_email TEXT NOT NULL,
  subject TEXT,
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  provider_id TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_log_created_at ON public.email_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_log_board_id ON public.email_log(board_id);
CREATE INDEX IF NOT EXISTS idx_email_log_failed ON public.email_log(created_at DESC) WHERE status = 'failed';

ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.cron_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  due INTEGER,
  delivered INTEGER,
  failed INTEGER,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_cron_runs_started_at ON public.cron_runs(started_at DESC);

ALTER TABLE public.cron_runs ENABLE ROW LEVEL SECURITY;
