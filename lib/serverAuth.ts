// Server-only helpers for API routes. Uses the service-role key, so never
// import this from client components.
import { createClient, type User } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// The browser keeps the Supabase session in localStorage, so callers pass
// their access token as "Authorization: Bearer <token>"
export async function getRequestUser(request: NextRequest): Promise<User | null> {
  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export interface EmailBoard {
  id: string;
  user_id: string;
  short_id: string;
  title: string;
  format_type: 'board' | 'card' | null;
  status: string;
  recipient_message: string | null;
  recipients: { name: string; email: string | null }[];
  contributors: { email: string | null }[];
}

// Emails are built from the saved board rather than from request fields, so
// callers cannot choose arbitrary titles, links or recipients
export async function getEmailBoard(boardId: unknown): Promise<EmailBoard | null> {
  if (typeof boardId !== 'string' || !boardId) return null;

  const { data, error } = await supabaseAdmin
    .from('boards')
    .select('id, user_id, short_id, title, format_type, status, recipient_message, recipients(name, email), contributors(email)')
    .eq('id', boardId)
    .neq('status', 'DELETED')
    .maybeSingle();

  if (error || !data) return null;
  return data as EmailBoard;
}

export function boardViewLink(board: EmailBoard): string {
  return `cardora.cards/${board.format_type === 'card' ? 'cards' : 'boards'}/${board.short_id}/view`;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanEmailList(emails: unknown): string[] | null {
  if (!Array.isArray(emails)) return null;
  const cleaned = emails
    .filter((email): email is string => typeof email === 'string')
    .map(email => email.trim().toLowerCase())
    .filter(Boolean);
  if (cleaned.some(email => !EMAIL_REGEX.test(email))) return null;
  return [...new Set(cleaned)];
}

// For addresses already saved on the board: skip blanks and malformed ones
// rather than failing the whole send
export function savedEmailList(emails: (string | null)[]): string[] {
  const valid = emails
    .map(email => (email ?? '').trim().toLowerCase())
    .filter(email => EMAIL_REGEX.test(email));
  return [...new Set(valid)];
}

export function recipientNamesOf(board: EmailBoard): string[] {
  return board.recipients.map(r => r.name).filter(Boolean);
}
