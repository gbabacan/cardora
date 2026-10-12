// Server-only: sends board emails through Resend and records each one in
// email_log for the admin Deliveries tab.
import type { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/serverAuth';

export type EmailKind = 'delivery' | 'delivered_notice' | 'invite' | 'test';
export type EmailTrigger = 'owner' | 'contributor' | 'cron' | 'admin';

type SendPayload = Parameters<Resend['emails']['send']>[0] & { to: string; subject: string };

function describe(error: unknown): string {
  if (!error) return '';
  if (typeof error === 'string') return error;
  if (typeof error === 'object' && 'message' in error) return String((error as { message: unknown }).message);
  return JSON.stringify(error);
}

// Logging never blocks or fails a send; a missing table just means no history.
async function record(row: Record<string, unknown>) {
  try {
    const { error } = await supabaseAdmin.from('email_log').insert(row);
    if (error) console.error('email_log insert failed:', error.message);
  } catch (err) {
    console.error('email_log insert failed:', err);
  }
}

// Drop-in for resend.emails.send(): same arguments, same result (or
// rejection), so summarizeSendResults keeps working on what it returns.
export async function sendLogged(
  resend: Resend,
  payload: SendPayload,
  meta: { kind: EmailKind; trigger: EmailTrigger; boardId?: string | null }
) {
  const base = {
    board_id: meta.boardId ?? null,
    kind: meta.kind,
    trigger: meta.trigger,
    to_email: payload.to,
    subject: payload.subject,
  };
  try {
    const result = await resend.emails.send(payload);
    await record({
      ...base,
      status: result.error ? 'failed' : 'sent',
      provider_id: result.data?.id ?? null,
      error: result.error ? describe(result.error).slice(0, 1000) : null,
    });
    return result;
  } catch (err) {
    await record({ ...base, status: 'failed', error: describe(err).slice(0, 1000) });
    throw err;
  }
}
