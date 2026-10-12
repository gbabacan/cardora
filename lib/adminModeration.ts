// Server-only helpers for admin moderation. Uses the service-role client,
// so never import this from client components.
import type { User } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/serverAuth';

export const BOARD_STATUSES = ['CREATED', 'PUBLISHED', 'DELIVERED', 'DELETED'] as const;
export type BoardStatus = (typeof BOARD_STATUSES)[number];

const PAGE = 1000;

// Every auth user. Fine at the current size; past a few thousand users this
// should become an indexed lookup.
export async function listAllUsers(): Promise<User[]> {
  const users: User[] = [];
  for (let page = 1; ; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: PAGE });
    if (error) throw new Error(`users: ${error.message}`);
    users.push(...data.users);
    if (data.users.length < PAGE) return users;
  }
}

// Removes message photos uploaded to the board-media bucket. GIFs and
// Unsplash pictures are external URLs and are left alone. Matches
// deleteMessageMedia in lib/messages.ts.
export async function removeUploadedFiles(urls: string[]) {
  const paths = urls
    .filter(url => url.includes('board-media/'))
    .map(url => decodeURIComponent(url.split('board-media/')[1].split('?')[0]))
    .filter(Boolean);
  if (paths.length) await supabaseAdmin.storage.from('board-media').remove(paths);
}

// Escapes % and _ so search text is matched literally by ilike, and
// strips characters that would break PostgREST's or() filter syntax.
export function ilikePattern(text: string): string {
  return `%${text.replace(/[\\%_]/g, c => `\\${c}`).replace(/[,()"]/g, ' ')}%`;
}
