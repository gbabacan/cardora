import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import { InputError, isUuid } from '@/lib/adminTemplates';
import { MEDIA_BUCKET, MEDIA_TABLE, bucketPathOf, cleanMediaFields, isMediaKind } from '@/lib/adminMedia';
import { changes, logAdminAction, quoted } from '@/lib/auditLog';

type Params = { params: Promise<{ kind: string; id: string }> };

const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });

async function resolve(request: NextRequest, params: Params['params']) {
  const admin = await getRequestAdmin(request);
  if (!admin) return null;
  const { kind, id } = await params;
  if (!isMediaKind(kind) || !isUuid(id)) return null;
  const { data, error } = await supabaseAdmin
    .from(MEDIA_TABLE[kind])
    .select('id, name, occasion_type, helper_color, is_active, file_path, remote_url')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  type Row = { id: string; name: string | null; file_path: string | null; remote_url: string | null } & Record<string, unknown>;
  return data ? { admin, kind, row: data as Row } : null;
}

// Name, occasion, helper colour and active flag. Deactivating only hides
// the file from pickers; templates and boards already using it keep it.
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const found = await resolve(request, params);
    if (!found) return notFound();
    const fields = cleanMediaFields(await request.json());
    if (Object.keys(fields).length === 0) return NextResponse.json({ ok: true });

    const { error } = await supabaseAdmin.from(MEDIA_TABLE[found.kind]).update(fields).eq('id', found.row.id);
    if (error) throw new Error(error.message);

    const details = changes(found.row, { ...fields });
    await logAdminAction(found.admin, {
      action: 'media.update',
      targetType: 'media',
      targetId: found.row.id,
      summary: `Edited ${found.kind === 'lottie' ? 'animation' : 'image'} ${quoted(fields.name ?? found.row.name)}: ${Object.keys(details).join(', ') || 'no changes'}`,
      details: { kind: found.kind, ...details },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof InputError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error('Admin media update failed:', err);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

// Only for files nothing uses. Uploaded files are removed from storage too;
// files in /public stay in the repo and just lose their database row.
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const found = await resolve(request, params);
    if (!found) return notFound();

    const column = found.kind === 'lottie' ? 'lottie_animation_id' : 'image_id';
    const { count, error: countError } = await supabaseAdmin
      .from('backgrounds')
      .select('id', { count: 'exact', head: true })
      .eq(column, found.row.id);
    if (countError) throw new Error(countError.message);
    if (count) {
      return NextResponse.json(
        { error: 'This file is used by templates or boards. Deactivate it instead.' },
        { status: 409 }
      );
    }

    const { error } = await supabaseAdmin.from(MEDIA_TABLE[found.kind]).delete().eq('id', found.row.id);
    if (error) throw new Error(error.message);

    const path = bucketPathOf(found.row.remote_url) ?? bucketPathOf(found.row.file_path);
    if (path) await supabaseAdmin.storage.from(MEDIA_BUCKET).remove([path]);

    await logAdminAction(found.admin, {
      action: 'media.delete',
      targetType: 'media',
      targetId: found.row.id,
      summary: `Deleted ${found.kind === 'lottie' ? 'animation' : 'image'} ${quoted(found.row.name)}`,
      details: { kind: found.kind, occasion: found.row.occasion_type, url: found.row.remote_url ?? found.row.file_path, fileRemoved: !!path },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin media delete failed:', err);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
