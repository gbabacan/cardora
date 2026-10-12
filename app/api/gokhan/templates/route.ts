import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import { formatOccasionLabel } from '@/lib/occasionLabels';
import {
  cleanTemplateInput,
  cleanMessages,
  createMediaBackground,
  createColorBackground,
  setRecipient,
  syncMessages,
  InputError,
  type Format,
} from '@/lib/adminTemplates';

const PAGE = 1000;

const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });

interface TemplateRow {
  id: string;
  short_id: string;
  title: string;
  occasion_type: string;
  format_type: Format;
  template_order: number | null;
  template_hidden: boolean;
  title_font: string | null;
  title_font_color: string | null;
  envelope_color: string | null;
  effect_id: string | null;
  created_at: string;
  card_background: {
    type: string;
    lottie_animation: { id: string; name: string; file_path: string } | null;
    image: { id: string; name: string | null; file_path: string | null; source_type: string; remote_url: string | null } | null;
  } | null;
  page_background: { type: string; color: string | null } | null;
  recipients: { name: string }[];
  messages: { count: number }[];
}

// How many user boards were made from each template.
async function templateUses(): Promise<Map<string, number>> {
  const uses = new Map<string, number>();
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabaseAdmin
      .from('boards')
      .select('source_template_id')
      .not('source_template_id', 'is', null)
      .order('created_at')
      .range(from, from + PAGE - 1);
    if (error) throw new Error(error.message);
    for (const row of data ?? []) uses.set(row.source_template_id, (uses.get(row.source_template_id) ?? 0) + 1);
    if (!data || data.length < PAGE) return uses;
  }
}

export async function GET(request: NextRequest) {
  if (!(await getRequestAdmin(request))) return notFound();

  try {
    const [templatesRes, lottiesRes, imagesRes, effectsRes, occasionsRes, uses] = await Promise.all([
      supabaseAdmin
        .from('boards')
        .select(`
          id, short_id, title, occasion_type, format_type, template_order, template_hidden,
          title_font, title_font_color, envelope_color, effect_id, created_at,
          card_background:card_background_id(type,
            lottie_animation:lottie_animation_id(id, name, file_path),
            image:image_id(id, name, file_path, source_type, remote_url)),
          page_background:background_id(type, color),
          recipients(name),
          messages(count)
        `)
        .eq('is_template', true)
        .order('occasion_type')
        .order('template_order', { ascending: true, nullsFirst: false })
        .order('created_at'),
      supabaseAdmin.from('lottie_animations').select('id, name, occasion_type, file_path').eq('is_active', true).order('file_path'),
      supabaseAdmin
        .from('images')
        .select('id, name, occasion_type, file_path, source_type, remote_url')
        .eq('is_active', true)
        .order('file_path'),
      supabaseAdmin.from('effects').select('id, name, type').eq('is_active', true).order('name'),
      supabaseAdmin.from('occasions').select('short_id, name').order('order'),
      templateUses(),
    ]);
    for (const res of [templatesRes, lottiesRes, imagesRes, effectsRes, occasionsRes]) {
      if (res.error) throw new Error(res.error.message);
    }

    const rows = (templatesRes.data ?? []) as unknown as TemplateRow[];
    const templates = rows.map(t => {
      const bg = t.card_background;
      const media = bg?.lottie_animation
        ? { kind: 'lottie' as const, id: bg.lottie_animation.id, name: bg.lottie_animation.name, filePath: bg.lottie_animation.file_path }
        : bg?.image
          ? { kind: 'image' as const, id: bg.image.id, name: bg.image.name, image: bg.image }
          : null;
      return {
        id: t.id,
        shortId: t.short_id,
        title: t.title,
        occasion: t.occasion_type,
        occasionLabel: formatOccasionLabel(t.occasion_type),
        format: t.format_type,
        order: t.template_order,
        hidden: t.template_hidden,
        titleFont: t.title_font,
        titleColor: t.title_font_color,
        envelopeColor: t.envelope_color,
        pageColor: t.page_background?.type === 'SOLID' ? t.page_background.color : null,
        effectId: t.effect_id,
        media,
        recipient: t.recipients[0]?.name ?? '',
        messageCount: t.messages[0]?.count ?? 0,
        uses: uses.get(t.id) ?? 0,
        createdAt: t.created_at,
      };
    });

    // Occasion choices: every spelling templates already use, plus any
    // occasion from the occasions table whose label isn't covered yet.
    const occasionByLabel = new Map<string, string>();
    for (const t of templates) if (!occasionByLabel.has(t.occasionLabel)) occasionByLabel.set(t.occasionLabel, t.occasion);
    for (const o of occasionsRes.data ?? []) {
      const label = formatOccasionLabel(o.short_id);
      if (!occasionByLabel.has(label)) occasionByLabel.set(label, o.short_id);
    }

    return NextResponse.json({
      templates,
      occasions: [...occasionByLabel.entries()]
        .map(([label, value]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      lotties: lottiesRes.data ?? [],
      images: imagesRes.data ?? [],
      effects: (effectsRes.data ?? []).filter(e => e.type === 'board_overlay'),
    });
  } catch (err) {
    console.error('Admin templates list failed:', err);
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 });
  }
}

// Creates one template per requested format, sharing the same animation or
// image, recipient and messages. Cards show only the first message.
export async function POST(request: NextRequest) {
  if (!(await getRequestAdmin(request))) return notFound();

  try {
    const body = await request.json();
    const formats: Format[] = Array.isArray(body.formats)
      ? [...new Set(body.formats as unknown[])].filter((f): f is Format => f === 'board' || f === 'card')
      : [];
    if (formats.length === 0) throw new InputError('Choose board, card or both');

    const input = cleanTemplateInput({
      title: body.title,
      occasion_type: body.occasion_type,
      media: body.media,
      title_font: body.title_font ?? 'Inter',
      title_font_color: body.title_font_color ?? '#0B1F2A',
      envelope_color: body.envelope_color ?? null,
      page_color: body.page_color ?? null,
      effect_id: body.effect_id ?? null,
      recipient: body.recipient ?? '',
    });
    const messages = cleanMessages(body.messages ?? []);

    const mediaBackgroundId = await createMediaBackground(input.media!);
    const created: { id: string; format: Format }[] = [];

    for (const format of formats) {
      const pageBackgroundId = format === 'card' && input.page_color ? await createColorBackground(input.page_color) : null;
      const { data, error } = await supabaseAdmin
        .from('boards')
        .insert({
          title: input.title,
          occasion_type: input.occasion_type,
          format_type: format,
          status: 'CREATED',
          delivery_type: 'ON_DEMAND',
          notify_contributors: true,
          intro_animation: true,
          is_template: true,
          template_hidden: false,
          card_background_id: mediaBackgroundId,
          background_id: pageBackgroundId,
          title_font: input.title_font,
          title_font_color: input.title_font_color,
          envelope_color: format === 'card' ? input.envelope_color : null,
          effect_id: format === 'board' ? input.effect_id : null,
        })
        .select('id')
        .single();
      if (error) throw new Error(error.message);

      await setRecipient(data.id, input.recipient ?? '');
      await syncMessages(data.id, format === 'card' ? messages.slice(0, 1) : messages);
      created.push({ id: data.id, format });
    }

    return NextResponse.json({ created });
  } catch (err) {
    if (err instanceof InputError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error('Admin template create failed:', err);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
