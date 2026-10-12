import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import { htmlToText, isUuid } from '@/lib/adminTemplates';
import { logAdminAction, quoted } from '@/lib/auditLog';
import { removeUploadedFiles } from '@/lib/adminModeration';

type Params = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });

interface MessageRow {
  id: string;
  board_id: string;
  content: string;
  is_approved: boolean;
  contributor: { name: string | null } | null;
  board: { title: string | null } | null;
}

async function findMessage(request: NextRequest, params: Params['params']) {
  const admin = await getRequestAdmin(request);
  if (!admin) return null;
  const { id } = await params;
  if (!isUuid(id)) return null;
  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('id, board_id, content, is_approved, contributor:contributor_id(name), board:board_id(title)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? { admin, message: data as unknown as MessageRow } : null;
}

// Who wrote it, on which board, and the start of the text, so the log
// still says what a deleted message was.
const describe = (m: MessageRow) => ({
  author: m.contributor?.name ?? null,
  board: m.board?.title ?? null,
  excerpt: htmlToText(m.content).text.slice(0, 300),
});

// Hides or shows a message. Every view loads messages with
// is_approved = true, so a hidden message disappears everywhere.
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const found = await findMessage(request, params);
    if (!found) return notFound();
    const { admin, message } = found;
    const { approved } = await request.json();
    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'approved must be true or false' }, { status: 400 });
    }
    const { error } = await supabaseAdmin.from('messages').update({ is_approved: approved }).eq('id', message.id);
    if (error) throw new Error(error.message);
    if (approved !== message.is_approved) {
      await logAdminAction(admin, {
        action: approved ? 'message.show' : 'message.hide',
        targetType: 'message',
        targetId: message.id,
        boardId: message.board_id,
        summary: `${approved ? 'Showed' : 'Hid'} a message from ${message.contributor?.name || 'someone'} on ${quoted(message.board?.title)}`,
        details: describe(message),
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin message update failed:', err);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

// Deletes a message for good, with its photos: media rows cascade, and
// uploaded files are removed from storage so their URLs stop working.
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const found = await findMessage(request, params);
    if (!found) return notFound();
    const { admin, message } = found;

    const { data: media, error: mediaError } = await supabaseAdmin
      .from('media')
      .select('file_url, thumbnail_url')
      .eq('message_id', message.id);
    if (mediaError) throw new Error(mediaError.message);

    const { error } = await supabaseAdmin.from('messages').delete().eq('id', message.id);
    if (error) throw new Error(error.message);

    await removeUploadedFiles(
      (media ?? []).flatMap(m => [m.file_url, m.thumbnail_url]).filter((u): u is string => !!u)
    );
    await logAdminAction(admin, {
      action: 'message.delete',
      targetType: 'message',
      targetId: message.id,
      boardId: message.board_id,
      summary: `Deleted a message from ${message.contributor?.name || 'someone'} on ${quoted(message.board?.title)}`,
      details: { ...describe(message), media: (media ?? []).length },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin message delete failed:', err);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
