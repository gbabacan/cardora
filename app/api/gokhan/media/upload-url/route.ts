import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import { MEDIA_BUCKET, MAX_UPLOAD_BYTES, UPLOAD_TYPES, extensionOf } from '@/lib/adminMedia';

// Hands the browser a one-time URL to upload straight to Supabase Storage,
// so large files don't pass through (and get cut off by) this server.
export async function POST(request: NextRequest) {
  if (!(await getRequestAdmin(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { filename, size } = await request.json().catch(() => ({}));
  const ext = typeof filename === 'string' ? extensionOf(filename) : '';
  const type = UPLOAD_TYPES[ext];
  if (!type) {
    return NextResponse.json({ error: 'Upload a .json or .lottie animation, or a .png, .jpg or .webp image' }, { status: 400 });
  }
  if (typeof size !== 'number' || size <= 0 || size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'Files must be under 20 MB' }, { status: 400 });
  }

  const base = (filename as string)
    .slice(0, -(ext.length + 1))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'file';
  const path = `${type.kind}s/${new Date().toISOString().slice(0, 7)}/${crypto.randomUUID().slice(0, 8)}-${base}.${ext}`;

  const { data, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
  if (error || !data) {
    console.error('Signed upload URL failed:', error);
    return NextResponse.json(
      { error: 'Could not start the upload. Has the media-library bucket migration been run?' },
      { status: 500 }
    );
  }

  return NextResponse.json({ path: data.path, token: data.token, contentType: type.contentType, kind: type.kind });
}
