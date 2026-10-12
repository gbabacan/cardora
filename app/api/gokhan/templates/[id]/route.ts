import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import {
  cleanTemplateInput,
  cleanMessages,
  createMediaBackground,
  createColorBackground,
  setRecipient,
  syncMessages,
  htmlToText,
  isUuid,
  InputError,
} from '@/lib/adminTemplates';

type Params = { params: Promise<{ id: string }> };

const notFound = () => NextResponse.json({ error: 'Not found' }, { status: 404 });

async function findTemplate(id: string) {
  if (!isUuid(id)) return null;
  const { data, error } = await supabaseAdmin
    .from('boards')
    .select('id, format_type')
    .eq('id', id)
    .eq('is_template', true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as { id: string; format_type: 'board' | 'card' } | null;
}

// A template's messages as plain text, for the edit form.
export async function GET(request: NextRequest, { params }: Params) {
  if (!(await getRequestAdmin(request))) return notFound();
  const { id } = await params;

  try {
    if (!(await findTemplate(id))) return notFound();
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('id, content, contributor:contributor_id(name)')
      .eq('board_id', id)
      .order('created_at', { ascending: true });
    if (error) throw new Error(error.message);

    return NextResponse.json({
      messages: (data ?? []).map(m => {
        const { text, rich } = htmlToText(m.content);
        const author = (m.contributor as unknown as { name?: string } | null)?.name ?? '';
        return { id: m.id, author, text, rich };
      }),
    });
  } catch (err) {
    console.error('Admin template load failed:', err);
    return NextResponse.json({ error: 'Failed to load template' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  if (!(await getRequestAdmin(request))) return notFound();
  const { id } = await params;

  try {
    const template = await findTemplate(id);
    if (!template) return notFound();

    const body = await request.json();
    const input = cleanTemplateInput(body);
    const messages = 'messages' in body ? cleanMessages(body.messages) : null;

    const update: Record<string, unknown> = {};
    if (input.title !== undefined) update.title = input.title;
    if (input.occasion_type !== undefined) update.occasion_type = input.occasion_type;
    if (input.title_font !== undefined) update.title_font = input.title_font;
    if (input.title_font_color !== undefined) update.title_font_color = input.title_font_color;
    if (input.hidden !== undefined) update.template_hidden = input.hidden;
    if (input.envelope_color !== undefined && template.format_type === 'card') update.envelope_color = input.envelope_color;
    if (input.effect_id !== undefined && template.format_type === 'board') update.effect_id = input.effect_id;
    if (input.media) update.card_background_id = await createMediaBackground(input.media);
    if (input.page_color !== undefined && template.format_type === 'card') {
      update.background_id = input.page_color ? await createColorBackground(input.page_color) : null;
    }
    // Changing occasion moves it to the end of the new occasion's row.
    if (input.occasion_type !== undefined) update.template_order = null;

    if (Object.keys(update).length) {
      const { error } = await supabaseAdmin.from('boards').update(update).eq('id', id);
      if (error) throw new Error(error.message);
    }
    if (input.recipient !== undefined) await setRecipient(id, input.recipient);
    if (messages) await syncMessages(id, messages);

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof InputError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error('Admin template update failed:', err);
    return NextResponse.json({ error: 'Failed to save template' }, { status: 500 });
  }
}

// Deletes the template with its messages, contributors, media and
// recipients (all cascade). Boards made from it keep working; their
// source_template_id is cleared.
export async function DELETE(request: NextRequest, { params }: Params) {
  if (!(await getRequestAdmin(request))) return notFound();
  const { id } = await params;

  try {
    if (!(await findTemplate(id))) return notFound();
    const { error } = await supabaseAdmin.from('boards').delete().eq('id', id).eq('is_template', true);
    if (error) throw new Error(error.message);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin template delete failed:', err);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
