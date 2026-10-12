// Server-only helpers for the admin template manager. Uses the service-role
// client, so never import this from client components.
import { supabaseAdmin } from '@/lib/serverAuth';
import { FONTS } from '@/lib/fonts';

export type Format = 'board' | 'card';
export type MediaKind = 'lottie' | 'image';

export interface TemplateInput {
  title?: unknown;
  occasion_type?: unknown;
  media?: unknown;
  title_font?: unknown;
  title_font_color?: unknown;
  envelope_color?: unknown;
  page_color?: unknown;
  effect_id?: unknown;
  recipient?: unknown;
  hidden?: unknown;
}

export interface CleanTemplateInput {
  title?: string;
  occasion_type?: string;
  media?: { kind: MediaKind; id: string };
  title_font?: string;
  title_font_color?: string;
  envelope_color?: string | null;
  page_color?: string | null;
  effect_id?: string | null;
  recipient?: string;
  hidden?: boolean;
}

export interface MessageInput {
  id?: string;
  author: string;
  text: string;
}

const HEX = /^#[0-9a-f]{6}$/i;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const SLUG = /^[a-z0-9][a-z0-9-]{0,49}$/;
const FONT_NAMES = new Set(FONTS.map(f => f.name));

export const isUuid = (value: unknown): value is string => typeof value === 'string' && UUID.test(value);

export class InputError extends Error {}

function text(value: unknown, field: string, max: number, allowEmpty = false): string {
  if (typeof value !== 'string') throw new InputError(`${field} must be text`);
  const trimmed = value.trim();
  if (!trimmed && !allowEmpty) throw new InputError(`${field} is required`);
  if (trimmed.length > max) throw new InputError(`${field} is too long`);
  return trimmed;
}

function color(value: unknown, field: string, nullable: boolean): string | null {
  if (nullable && (value === null || value === '')) return null;
  if (typeof value !== 'string' || !HEX.test(value)) throw new InputError(`${field} must be a #RRGGBB colour`);
  return value;
}

// Only fields present in the input are returned, so the same check serves
// both create (everything) and update (a subset).
export function cleanTemplateInput(input: TemplateInput): CleanTemplateInput {
  const out: CleanTemplateInput = {};
  if ('title' in input) out.title = text(input.title, 'Title', 200);
  if ('occasion_type' in input) {
    if (typeof input.occasion_type !== 'string' || !SLUG.test(input.occasion_type)) {
      throw new InputError('Occasion must be a lowercase slug');
    }
    out.occasion_type = input.occasion_type;
  }
  if ('media' in input) {
    const media = input.media as { kind?: unknown; id?: unknown } | null;
    if (!media || (media.kind !== 'lottie' && media.kind !== 'image') || !isUuid(media.id)) {
      throw new InputError('Pick an animation or image');
    }
    out.media = { kind: media.kind, id: media.id };
  }
  if ('title_font' in input) {
    if (typeof input.title_font !== 'string' || !FONT_NAMES.has(input.title_font)) {
      throw new InputError('Unknown font');
    }
    out.title_font = input.title_font;
  }
  if ('title_font_color' in input) out.title_font_color = color(input.title_font_color, 'Title colour', false)!;
  if ('envelope_color' in input) out.envelope_color = color(input.envelope_color, 'Envelope colour', true);
  if ('page_color' in input) out.page_color = color(input.page_color, 'Page colour', true);
  if ('effect_id' in input) {
    if (input.effect_id !== null && input.effect_id !== '' && !isUuid(input.effect_id)) {
      throw new InputError('Unknown effect');
    }
    out.effect_id = input.effect_id || null;
  }
  if ('recipient' in input) out.recipient = text(input.recipient, 'Recipient', 100, true);
  if ('hidden' in input) {
    if (typeof input.hidden !== 'boolean') throw new InputError('Hidden must be true or false');
    out.hidden = input.hidden;
  }
  return out;
}

export function cleanMessages(value: unknown): MessageInput[] {
  if (!Array.isArray(value)) throw new InputError('Messages must be a list');
  if (value.length > 30) throw new InputError('Too many messages');
  return value.map((m, i) => {
    const message = m as { id?: unknown; author?: unknown; text?: unknown };
    if (message.id !== undefined && !isUuid(message.id)) throw new InputError(`Message ${i + 1} has a bad id`);
    return {
      id: message.id as string | undefined,
      author: text(message.author, `Message ${i + 1} author`, 100),
      text: text(message.text, `Message ${i + 1}`, 5000),
    };
  });
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Plain text to the HTML the message editor saves: a <p> per paragraph,
// <br> for single line breaks.
export function textToHtml(value: string): string {
  return value
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${escapeHtml(p).replace(/\n/g, '<br>')}</p>`)
    .join('');
}

// The reverse, for editing. `rich` flags formatting that plain text loses,
// so the form can warn before it is overwritten.
export function htmlToText(html: string): { text: string; rich: boolean } {
  const rich = /<(?!\/?(p|br)\b)[a-z]/i.test(html) || /\sstyle=/i.test(html);
  const value = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .trim();
  return { text: value, rich };
}

function check(error: { message: string } | null, what: string) {
  if (error) throw new Error(`${what}: ${error.message}`);
}

// A fresh backgrounds row per change: rows are shared between a board and
// its card twin, so editing one in place would change the other.
export async function createMediaBackground(media: { kind: MediaKind; id: string }): Promise<string> {
  const table = media.kind === 'lottie' ? 'lottie_animations' : 'images';
  const { data: found, error: findError } = await supabaseAdmin.from(table).select('id').eq('id', media.id).maybeSingle();
  check(findError, 'media lookup');
  if (!found) throw new InputError('That animation or image no longer exists');

  const { data, error } = await supabaseAdmin
    .from('backgrounds')
    .insert(
      media.kind === 'lottie'
        ? { type: 'ANIMATION', lottie_animation_id: media.id }
        : { type: 'IMAGE', image_id: media.id }
    )
    .select('id')
    .single();
  check(error, 'background insert');
  return data!.id;
}

export async function createColorBackground(color: string): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('backgrounds')
    .insert({ type: 'SOLID', color })
    .select('id')
    .single();
  check(error, 'background insert');
  return data!.id;
}

export async function setRecipient(boardId: string, name: string) {
  const { error: deleteError } = await supabaseAdmin.from('recipients').delete().eq('board_id', boardId);
  check(deleteError, 'recipient delete');
  if (!name) return;
  const { error } = await supabaseAdmin.from('recipients').insert({ board_id: boardId, name });
  check(error, 'recipient insert');
}

// Brings a template's messages in line with `messages`: existing ids are
// updated, new ones added after the current last message, and any message
// not listed is deleted. Messages display oldest first, so created_at keeps
// new ones in list order.
export async function syncMessages(boardId: string, messages: MessageInput[]) {
  const { data: existing, error } = await supabaseAdmin
    .from('messages')
    .select('id, content, contributor_id, created_at, contributor:contributor_id(name)')
    .eq('board_id', boardId)
    .order('created_at', { ascending: true });
  check(error, 'messages lookup');

  const current = new Map((existing ?? []).map(m => [m.id, m]));
  const keep = new Set(messages.filter(m => m.id).map(m => m.id!));
  for (const id of keep) {
    if (!current.has(id)) throw new InputError('A message was changed elsewhere; reload and try again');
  }

  const removed = (existing ?? []).filter(m => !keep.has(m.id));
  if (removed.length) {
    const { error: msgError } = await supabaseAdmin.from('messages').delete().in('id', removed.map(m => m.id));
    check(msgError, 'message delete');
    const contributorIds = removed.map(m => m.contributor_id).filter(Boolean);
    if (contributorIds.length) {
      const { error: cError } = await supabaseAdmin.from('contributors').delete().in('id', contributorIds);
      check(cError, 'contributor delete');
    }
  }

  const last = existing?.length ? new Date(existing[existing.length - 1].created_at).getTime() : Date.now();
  let added = 0;
  for (const message of messages) {
    const html = textToHtml(message.text);
    if (message.id) {
      const old = current.get(message.id)!;
      const oldAuthor = (old.contributor as unknown as { name?: string } | null)?.name ?? '';
      if (htmlToText(old.content).text !== message.text.trim()) {
        const { error: uError } = await supabaseAdmin.from('messages').update({ content: html }).eq('id', message.id);
        check(uError, 'message update');
      }
      if (oldAuthor !== message.author && old.contributor_id) {
        const { error: cError } = await supabaseAdmin
          .from('contributors')
          .update({ name: message.author })
          .eq('id', old.contributor_id);
        check(cError, 'contributor update');
      }
      continue;
    }
    added++;
    const { data: contributor, error: cError } = await supabaseAdmin
      .from('contributors')
      .insert({ board_id: boardId, name: message.author, is_anonymous: false })
      .select('id')
      .single();
    check(cError, 'contributor insert');
    const at = new Date(Math.max(last, Date.now()) + added * 1000).toISOString();
    const { error: mError } = await supabaseAdmin.from('messages').insert({
      board_id: boardId,
      contributor_id: contributor!.id,
      content: html,
      is_approved: true,
      created_at: at,
      updated_at: at,
    });
    check(mError, 'message insert');
  }
}
