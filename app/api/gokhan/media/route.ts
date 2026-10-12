import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin, fetchAllRows } from '@/lib/serverAuth';
import { formatOccasionLabel } from '@/lib/occasionLabels';
import { InputError } from '@/lib/adminTemplates';
import { logAdminAction, quoted } from '@/lib/auditLog';
import {
  MEDIA_BUCKET,
  MEDIA_TABLE,
  UPLOAD_TYPES,
  cleanMediaFields,
  extensionOf,
  verifyUpload,
} from '@/lib/adminMedia';

const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });

interface MediaRow {
  id: string;
  name: string | null;
  occasion_type: string | null;
  file_path: string | null;
  remote_url: string | null;
  source_type: string;
  helper_color: string | null;
  is_active: boolean;
  created_at: string;
}

interface BoardRow {
  id: string;
  title: string;
  short_id: string;
  format_type: 'board' | 'card';
  status: string;
  is_template: boolean;
  template_hidden: boolean;
  card_background_id: string | null;
  background_id: string | null;
}

interface Usage {
  templates: { id: string; title: string; format: 'board' | 'card'; shortId: string; hidden: boolean }[];
  userBoards: number;
}

// Every animation and image, with the templates and user boards using it.
export async function GET(request: NextRequest) {
  if (!(await getRequestAdmin(request))) return notFound();

  try {
    const [lotties, images, backgrounds, boards, occasionsRes] = await Promise.all([
      fetchAllRows<MediaRow>(
        'lottie_animations',
        'id, name, occasion_type, file_path, remote_url, source_type, helper_color, is_active, created_at'
      ),
      fetchAllRows<MediaRow>(
        'images',
        'id, name, occasion_type, file_path, remote_url, source_type, helper_color, is_active, created_at'
      ),
      fetchAllRows<{ id: string; lottie_animation_id: string | null; image_id: string | null }>(
        'backgrounds',
        'id, lottie_animation_id, image_id'
      ),
      fetchAllRows<BoardRow>(
        'boards',
        'id, title, short_id, format_type, status, is_template, template_hidden, card_background_id, background_id'
      ),
      supabaseAdmin.from('occasions').select('short_id').order('order'),
    ]);
    if (occasionsRes.error) throw new Error(occasionsRes.error.message);

    // background id -> "lottie:<id>" or "image:<id>"
    const mediaOfBackground = new Map<string, string>();
    for (const bg of backgrounds) {
      if (bg.lottie_animation_id) mediaOfBackground.set(bg.id, `lottie:${bg.lottie_animation_id}`);
      else if (bg.image_id) mediaOfBackground.set(bg.id, `image:${bg.image_id}`);
    }

    const usage = new Map<string, Usage>();
    const usageOf = (key: string) => {
      if (!usage.has(key)) usage.set(key, { templates: [], userBoards: 0 });
      return usage.get(key)!;
    };
    for (const b of boards) {
      const keys = new Set(
        [b.card_background_id, b.background_id].map(id => (id ? mediaOfBackground.get(id) : undefined)).filter(Boolean)
      );
      for (const key of keys) {
        if (b.is_template) {
          usageOf(key!).templates.push({ id: b.id, title: b.title, format: b.format_type, shortId: b.short_id, hidden: b.template_hidden });
        } else if (b.status !== 'DELETED') {
          usageOf(key!).userBoards++;
        }
      }
    }

    const shape = (kind: 'lottie' | 'image') => (m: MediaRow) => {
      const u = usage.get(`${kind}:${m.id}`) ?? { templates: [], userBoards: 0 };
      const url = m.source_type === 'local' ? m.file_path : m.remote_url || m.file_path;
      return {
        kind,
        id: m.id,
        name: m.name ?? '',
        occasion: m.occasion_type ?? '',
        occasionLabel: formatOccasionLabel(m.occasion_type ?? 'other'),
        url: url ?? '',
        uploaded: m.source_type === 'remote',
        helperColor: m.helper_color,
        active: m.is_active,
        createdAt: m.created_at,
        templates: u.templates,
        userBoards: u.userBoards,
      };
    };

    // Occasion choices: every spelling media already uses plus the
    // occasions table, one per label.
    const occasionByLabel = new Map<string, string>();
    for (const value of [
      ...lotties.map(l => l.occasion_type),
      ...images.map(i => i.occasion_type),
      ...(occasionsRes.data ?? []).map(o => o.short_id),
    ]) {
      if (!value) continue;
      const label = formatOccasionLabel(value);
      if (!occasionByLabel.has(label)) occasionByLabel.set(label, value);
    }

    return NextResponse.json({
      media: [...lotties.map(shape('lottie')), ...images.map(shape('image'))],
      occasions: [...occasionByLabel.entries()]
        .map(([label, value]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    });
  } catch (err) {
    console.error('Admin media list failed:', err);
    return NextResponse.json({ error: 'Failed to load media' }, { status: 500 });
  }
}

// Registers a file the browser has just uploaded through a signed URL.
export async function POST(request: NextRequest) {
  const admin = await getRequestAdmin(request);
  if (!admin) return notFound();

  try {
    const body = await request.json();
    const path = typeof body.path === 'string' ? body.path : '';
    const type = UPLOAD_TYPES[extensionOf(path)];
    if (!type || !/^(lottie|image)s\/[\w./-]+$/.test(path) || path.includes('..')) {
      throw new InputError('Unknown upload');
    }

    const fields = cleanMediaFields({
      name: body.name,
      occasion_type: body.occasion_type,
      ...(body.helper_color || type.kind === 'lottie' ? { helper_color: body.helper_color ?? '#2CB1A6' } : {}),
    });
    await verifyUpload(path);

    const url = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
    const { data, error } = await supabaseAdmin
      .from(MEDIA_TABLE[type.kind])
      .insert({
        ...fields,
        source_type: 'remote',
        file_path: url,
        remote_url: url,
        is_active: true,
      })
      .select('id')
      .single();
    if (error) throw new Error(error.message);

    await logAdminAction(admin, {
      action: 'media.upload',
      targetType: 'media',
      targetId: data.id,
      summary: `Uploaded ${type.kind === 'lottie' ? 'animation' : 'image'} ${quoted(fields.name)}`,
      details: { kind: type.kind, occasion: fields.occasion_type, url },
    });

    return NextResponse.json({ id: data.id, kind: type.kind, url });
  } catch (err) {
    if (err instanceof InputError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error('Admin media create failed:', err);
    return NextResponse.json({ error: 'Failed to save upload' }, { status: 500 });
  }
}
