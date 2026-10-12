import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import { formatOccasionLabel } from '@/lib/occasionLabels';
import { isUuid } from '@/lib/adminTemplates';
import { BOARD_STATUSES, ilikePattern, listAllUsers } from '@/lib/adminModeration';

const LIMIT = 50;
const COLUMNS = 'id, title, short_id, format_type, status, occasion_type, user_id, created_at';

interface BoardRow {
  id: string;
  title: string;
  short_id: string;
  format_type: 'board' | 'card';
  status: string;
  occasion_type: string;
  user_id: string | null;
  created_at: string;
}

// Finds user boards and cards (never templates) by short id, id, title,
// owner email, recipient or contributor. With no query, the newest ones.
export async function GET(request: NextRequest) {
  if (!(await getRequestAdmin(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const params = request.nextUrl.searchParams;
  const q = (params.get('q') ?? '').trim().slice(0, 100);
  const status = params.get('status');
  const format = params.get('format');

  try {
    const users = await listAllUsers();
    const emailById = new Map(users.map(u => [u.id, u.email ?? '']));

    const base = () => {
      let query = supabaseAdmin.from('boards').select(COLUMNS).eq('is_template', false);
      if (status && (BOARD_STATUSES as readonly string[]).includes(status)) query = query.eq('status', status);
      if (format === 'board' || format === 'card') query = query.eq('format_type', format);
      return query.order('created_at', { ascending: false }).limit(LIMIT);
    };

    let rows: BoardRow[] = [];
    if (!q) {
      const { data, error } = await base();
      if (error) throw new Error(error.message);
      rows = (data ?? []) as BoardRow[];
    } else {
      const pattern = ilikePattern(q);
      const lower = q.toLowerCase();
      const userIds = users.filter(u => u.email?.toLowerCase().includes(lower)).map(u => u.id).slice(0, 100);

      const [byText, byRecipient, byContributor] = await Promise.all([
        base().or(`title.ilike.${pattern},short_id.ilike.${pattern}${isUuid(q) ? `,id.eq.${q}` : ''}`),
        supabaseAdmin.from('recipients').select('board_id').or(`name.ilike.${pattern},email.ilike.${pattern}`).limit(200),
        supabaseAdmin.from('contributors').select('board_id').or(`name.ilike.${pattern},email.ilike.${pattern}`).limit(200),
      ]);
      for (const res of [byText, byRecipient, byContributor]) if (res.error) throw new Error(res.error.message);

      const relatedIds = [
        ...new Set([...(byRecipient.data ?? []), ...(byContributor.data ?? [])].map(r => r.board_id as string)),
      ].slice(0, 200);
      const [byRelated, byOwner] = await Promise.all([
        relatedIds.length ? base().in('id', relatedIds) : Promise.resolve({ data: [], error: null }),
        userIds.length ? base().in('user_id', userIds) : Promise.resolve({ data: [], error: null }),
      ]);
      for (const res of [byRelated, byOwner]) if (res.error) throw new Error(res.error.message);

      const merged = new Map<string, BoardRow>();
      for (const row of [...(byText.data ?? []), ...(byRelated.data ?? []), ...(byOwner.data ?? [])] as BoardRow[]) {
        merged.set(row.id, row);
      }
      rows = [...merged.values()].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, LIMIT);
    }

    // Message counts, split into shown and hidden.
    const counts = new Map<string, { shown: number; hidden: number }>();
    if (rows.length) {
      const { data, error } = await supabaseAdmin
        .from('messages')
        .select('board_id, is_approved')
        .in('board_id', rows.map(r => r.id));
      if (error) throw new Error(error.message);
      for (const m of data ?? []) {
        const c = counts.get(m.board_id) ?? { shown: 0, hidden: 0 };
        c[m.is_approved ? 'shown' : 'hidden']++;
        counts.set(m.board_id, c);
      }
    }

    return NextResponse.json({
      boards: rows.map(r => ({
        id: r.id,
        title: r.title,
        shortId: r.short_id,
        format: r.format_type,
        status: r.status,
        occasion: formatOccasionLabel(r.occasion_type || 'other'),
        owner: (r.user_id && emailById.get(r.user_id)) || '',
        messages: counts.get(r.id)?.shown ?? 0,
        hiddenMessages: counts.get(r.id)?.hidden ?? 0,
        createdAt: r.created_at,
      })),
      limited: rows.length === LIMIT,
    });
  } catch (err) {
    console.error('Admin board search failed:', err);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
