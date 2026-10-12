import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import { isUuid } from '@/lib/adminTemplates';
import { removeUploadedFiles } from '@/lib/adminModeration';

type Params = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });

async function findMessage(request: NextRequest, params: Params['params']) {
  if (!(await getRequestAdmin(request))) return null;
  const { id } = await params;
  if (!isUuid(id)) return null;
  const { data, error } = await supabaseAdmin.from('messages').select('id').eq('id', id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

// Hides or shows a message. Every view loads messages with
// is_approved = true, so a hidden message disappears everywhere.
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const message = await findMessage(request, params);
    if (!message) return notFound();
    const { approved } = await request.json();
    if (typeof approved !== 'boolean') {
      return NextResponse.json({ error: 'approved must be true or false' }, { status: 400 });
    }
    const { error } = await supabaseAdmin.from('messages').update({ is_approved: approved }).eq('id', message.id);
    if (error) throw new Error(error.message);
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
    const message = await findMessage(request, params);
    if (!message) return notFound();

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
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin message delete failed:', err);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
