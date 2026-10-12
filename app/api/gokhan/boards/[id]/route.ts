import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import { formatOccasionLabel } from '@/lib/occasionLabels';
import { htmlToText, isUuid } from '@/lib/adminTemplates';
import { BOARD_STATUSES, listAllUsers, type BoardStatus } from '@/lib/adminModeration';
import { logAdminAction, quoted } from '@/lib/auditLog';

type Params = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });

interface MessageRow {
  id: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  contributor: { name: string | null; email: string | null; is_anonymous: boolean | null } | null;
  media: { id: string; file_url: string; file_type: string; thumbnail_url: string | null }[];
}

async function findBoard(id: string) {
  if (!isUuid(id)) return null;
  const { data, error } = await supabaseAdmin
    .from('boards')
    .select('id, title, short_id, format_type, status, occasion_type, user_id, delivery_type, scheduled_delivery, created_at, updated_at, is_template')
    .eq('id', id)
    .eq('is_template', false)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

// A board or card with its owner, recipients and every message, including
// hidden ones, as plain text.
export async function GET(request: NextRequest, { params }: Params) {
  if (!(await getRequestAdmin(request))) return notFound();
  const { id } = await params;

  try {
    const board = await findBoard(id);
    if (!board) return notFound();

    const [owner, recipients, contributors, messages] = await Promise.all([
      board.user_id ? supabaseAdmin.auth.admin.getUserById(board.user_id) : Promise.resolve(null),
      supabaseAdmin.from('recipients').select('name, email').eq('board_id', id),
      supabaseAdmin.from('contributors').select('id', { count: 'exact', head: true }).eq('board_id', id),
      supabaseAdmin
        .from('messages')
        .select('id, content, is_approved, created_at, contributor:contributor_id(name, email, is_anonymous), media(id, file_url, file_type, thumbnail_url)')
        .eq('board_id', id)
        .order('created_at', { ascending: true }),
    ]);
    for (const res of [recipients, contributors, messages]) if (res.error) throw new Error(res.error.message);

    return NextResponse.json({
      board: {
        id: board.id,
        title: board.title,
        shortId: board.short_id,
        format: board.format_type,
        status: board.status,
        occasion: formatOccasionLabel(board.occasion_type || 'other'),
        deliveryType: board.delivery_type,
        scheduledDelivery: board.scheduled_delivery,
        createdAt: board.created_at,
        updatedAt: board.updated_at,
        owner: owner?.data.user ? { id: owner.data.user.id, email: owner.data.user.email ?? '' } : null,
        recipients: recipients.data ?? [],
        contributorCount: contributors.count ?? 0,
      },
      messages: ((messages.data ?? []) as unknown as MessageRow[]).map(m => ({
        id: m.id,
        text: htmlToText(m.content).text,
        approved: m.is_approved,
        createdAt: m.created_at,
        author: m.contributor?.name ?? '',
        authorEmail: m.contributor?.email ?? '',
        anonymous: !!m.contributor?.is_anonymous,
        media: m.media.map(md => ({ id: md.id, url: md.file_url, type: md.file_type, thumbnail: md.thumbnail_url })),
      })),
    });
  } catch (err) {
    console.error('Admin board load failed:', err);
    return NextResponse.json({ error: 'Failed to load board' }, { status: 500 });
  }
}

// Sets the status (DELETED to remove from the owner's dashboard, anything
// else to restore) and/or moves the board to another user by email.
export async function PATCH(request: NextRequest, { params }: Params) {
  const admin = await getRequestAdmin(request);
  if (!admin) return notFound();
  const { id } = await params;

  try {
    const board = await findBoard(id);
    if (!board) return notFound();

    const body = await request.json();
    const update: { status?: BoardStatus; user_id?: string } = {};

    if ('status' in body) {
      if (!(BOARD_STATUSES as readonly unknown[]).includes(body.status)) {
        return NextResponse.json({ error: 'Unknown status' }, { status: 400 });
      }
      update.status = body.status;
    }

    let previousOwner = '';
    let newOwner = '';
    if ('owner_email' in body) {
      const email = typeof body.owner_email === 'string' ? body.owner_email.trim().toLowerCase() : '';
      const users = email ? await listAllUsers() : [];
      const user = users.find(u => u.email?.toLowerCase() === email);
      if (!user) {
        return NextResponse.json({ error: 'No Cardora account uses that email' }, { status: 400 });
      }
      update.user_id = user.id;
      newOwner = user.email ?? email;
      previousOwner = users.find(u => u.id === board.user_id)?.email ?? board.user_id ?? '';
    }

    if (Object.keys(update).length) {
      const { error } = await supabaseAdmin.from('boards').update(update).eq('id', id).eq('is_template', false);
      if (error) throw new Error(error.message);
    }

    const what = board.format_type === 'card' ? 'card' : 'board';
    if (update.status && update.status !== board.status) {
      await logAdminAction(admin, {
        action: 'board.status',
        targetType: 'board',
        targetId: id,
        boardId: id,
        summary:
          update.status === 'DELETED'
            ? `Deleted ${what} ${quoted(board.title)} for its owner`
            : `Set ${what} ${quoted(board.title)} to ${update.status.toLowerCase()}`,
        details: { status: { from: board.status, to: update.status } },
      });
    }
    if (update.user_id && update.user_id !== board.user_id) {
      await logAdminAction(admin, {
        action: 'board.owner',
        targetType: 'board',
        targetId: id,
        boardId: id,
        summary: `Moved ${what} ${quoted(board.title)} from ${previousOwner || 'no owner'} to ${newOwner}`,
        details: { owner: { from: previousOwner || null, to: newOwner } },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin board update failed:', err);
    return NextResponse.json({ error: 'Failed to update board' }, { status: 500 });
  }
}
