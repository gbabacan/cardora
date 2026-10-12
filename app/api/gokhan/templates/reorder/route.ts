import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import { isUuid } from '@/lib/adminTemplates';
import { logAdminAction } from '@/lib/auditLog';

// Sets template_order to 1..n in the given order. The client sends one
// occasion's templates of one format at a time.
export async function POST(request: NextRequest) {
  const admin = await getRequestAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 200 || !ids.every(isUuid)) {
      return NextResponse.json({ error: 'ids must be a list of template ids' }, { status: 400 });
    }

    const results = await Promise.all(
      ids.map((id: string, i: number) =>
        supabaseAdmin.from('boards').update({ template_order: i + 1 }).eq('id', id).eq('is_template', true)
      )
    );
    const failed = results.find(r => r.error);
    if (failed?.error) throw new Error(failed.error.message);

    await logAdminAction(admin, {
      action: 'template.reorder',
      targetType: 'template',
      summary: `Reordered ${ids.length} templates`,
      details: { ids },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Admin template reorder failed:', err);
    return NextResponse.json({ error: 'Failed to reorder templates' }, { status: 500 });
  }
}
