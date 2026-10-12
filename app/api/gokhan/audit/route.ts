import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import { isUuid } from '@/lib/adminTemplates';
import { ilikePattern } from '@/lib/adminModeration';

const PAGE = 50;
const AREAS = ['template', 'media', 'board', 'message', 'delivery', 'email'];

interface EntryRow {
  id: string;
  admin_email: string;
  action: string;
  target_type: string;
  target_id: string | null;
  board_id: string | null;
  summary: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

// Admin actions, newest first, 50 at a time. Filters: area (the part of
// the action before the dot), q (searches the summary), board, and
// `before` (a created_at cursor for the next page).
export async function GET(request: NextRequest) {
  if (!(await getRequestAdmin(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const params = request.nextUrl.searchParams;
  const area = params.get('area');
  const q = (params.get('q') ?? '').trim().slice(0, 100);
  const boardId = params.get('board');
  const before = params.get('before');

  try {
    let query = supabaseAdmin
      .from('admin_audit_log')
      .select('id, admin_email, action, target_type, target_id, board_id, summary, details, created_at')
      .order('created_at', { ascending: false })
      .limit(PAGE + 1);
    if (area && AREAS.includes(area)) query = query.like('action', `${area}.%`);
    if (q) query = query.ilike('summary', ilikePattern(q));
    if (boardId && isUuid(boardId)) query = query.eq('board_id', boardId);
    if (before && !Number.isNaN(Date.parse(before))) query = query.lt('created_at', before);

    const { data, error } = await query;
    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205') {
        return NextResponse.json({ tableReady: false, entries: [], nextCursor: null });
      }
      throw new Error(error.message);
    }

    const rows = (data ?? []) as EntryRow[];
    const page = rows.slice(0, PAGE);

    // Link entries to their board, card or template when it still exists.
    const boardIds = [...new Set(page.map(r => r.board_id).filter((id): id is string => !!id))];
    const boards = new Map<string, { title: string; shortId: string; format: 'board' | 'card'; isTemplate: boolean }>();
    if (boardIds.length) {
      const { data: found, error: boardError } = await supabaseAdmin
        .from('boards')
        .select('id, title, short_id, format_type, is_template')
        .in('id', boardIds);
      if (boardError) throw new Error(boardError.message);
      for (const b of found ?? []) {
        boards.set(b.id, { title: b.title, shortId: b.short_id, format: b.format_type, isTemplate: b.is_template });
      }
    }

    return NextResponse.json({
      tableReady: true,
      entries: page.map(r => ({
        id: r.id,
        admin: r.admin_email,
        action: r.action,
        targetType: r.target_type,
        targetId: r.target_id,
        board: r.board_id ? boards.get(r.board_id) ?? null : null,
        boardId: r.board_id,
        summary: r.summary,
        details: r.details,
        at: r.created_at,
      })),
      nextCursor: rows.length > PAGE ? page[page.length - 1].created_at : null,
    });
  } catch (err) {
    console.error('Admin audit log load failed:', err);
    return NextResponse.json({ error: 'Failed to load the audit log' }, { status: 500 });
  }
}
