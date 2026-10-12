// Server-only: records changes made from the admin page in admin_audit_log.
import type { User } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/serverAuth';

export type AuditAction =
  | 'template.create'
  | 'template.update'
  | 'template.hide'
  | 'template.show'
  | 'template.delete'
  | 'template.reorder'
  | 'media.upload'
  | 'media.update'
  | 'media.delete'
  | 'board.status'
  | 'board.owner'
  | 'message.hide'
  | 'message.show'
  | 'message.delete'
  | 'delivery.send'
  | 'delivery.reschedule'
  | 'delivery.cancel'
  | 'email.test';

export interface AuditEntry {
  action: AuditAction;
  targetType: 'template' | 'media' | 'board' | 'message' | 'email';
  targetId?: string | null;
  boardId?: string | null;
  summary: string;
  details?: Record<string, unknown>;
}

// Call after the change has succeeded. Never throws: a missing table or a
// failed insert is logged to the console and the admin action stands.
export async function logAdminAction(admin: User, entry: AuditEntry) {
  try {
    const { error } = await supabaseAdmin.from('admin_audit_log').insert({
      admin_id: admin.id,
      admin_email: admin.email ?? '',
      action: entry.action,
      target_type: entry.targetType,
      target_id: entry.targetId ?? null,
      board_id: entry.boardId ?? null,
      summary: entry.summary.slice(0, 500),
      details: entry.details ?? null,
    });
    if (error) console.error('admin_audit_log insert failed:', error.message);
  } catch (err) {
    console.error('admin_audit_log insert failed:', err);
  }
}

// Field-by-field before/after for the fields that actually changed.
export function changes(before: Record<string, unknown>, after: Record<string, unknown>) {
  const out: Record<string, { from: unknown; to: unknown }> = {};
  for (const [key, value] of Object.entries(after)) {
    if (JSON.stringify(before[key] ?? null) !== JSON.stringify(value ?? null)) {
      out[key] = { from: before[key] ?? null, to: value ?? null };
    }
  }
  return out;
}

export const quoted = (title: string | null | undefined) => `"${(title || 'Untitled').slice(0, 80)}"`;
