import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, fetchAllRows } from '@/lib/serverAuth';
import { formatOccasionLabel } from '@/lib/occasionLabels';
import { listAllUsers } from '@/lib/adminModeration';

const RANGES = [7, 30, 90, 365];
const DAY = 24 * 60 * 60 * 1000;

interface BoardRow {
  id: string;
  user_id: string | null;
  title: string;
  short_id: string;
  format_type: 'board' | 'card';
  occasion_type: string;
  status: string;
  delivery_type: string | null;
  scheduled_delivery: string | null;
  is_template: boolean;
  source_template_id: string | null;
  created_at: string;
}

interface MessageRow {
  board_id: string;
  created_at: string;
}

// Buckets are UTC days, or UTC weeks starting Monday for the year view.
function bucketStart(time: number, bucket: 'day' | 'week'): number {
  const d = new Date(time);
  d.setUTCHours(0, 0, 0, 0);
  if (bucket === 'week') d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.getTime();
}

const inRange = (iso: string | null | undefined, start: number, end: number) => {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return t >= start && t < end;
};

const countBy = <T,>(items: T[], key: (item: T) => string) => {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  return counts;
};

export async function GET(request: NextRequest) {
  const admin = await getRequestAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const requested = Number(request.nextUrl.searchParams.get('days'));
  const days = RANGES.includes(requested) ? requested : 30;
  const bucket: 'day' | 'week' = days > 90 ? 'week' : 'day';
  const now = Date.now();
  const start = bucketStart(now - (days - 1) * DAY, 'day');
  const prevStart = start - days * DAY;

  try {
    const [users, allBoards, messages, contributors] = await Promise.all([
      listAllUsers(),
      fetchAllRows<BoardRow>(
        'boards',
        'id, user_id, title, short_id, format_type, occasion_type, status, delivery_type, scheduled_delivery, is_template, source_template_id, created_at'
      ),
      fetchAllRows<MessageRow>('messages', 'board_id, created_at'),
      fetchAllRows<{ board_id: string; created_at: string }>('contributors', 'board_id, created_at'),
    ]);

    const templates = new Map(allBoards.filter(b => b.is_template).map(b => [b.id, b]));
    // Everything below counts real user boards only, never templates.
    const boards = allBoards.filter(b => !b.is_template);
    const userBoardIds = new Set(boards.map(b => b.id));
    const userMessages = messages.filter(m => userBoardIds.has(m.board_id));
    const userContributors = contributors.filter(c => userBoardIds.has(c.board_id));
    const emailById = new Map(users.map(u => [u.id, u.email ?? '']));

    const periodBoards = boards.filter(b => inRange(b.created_at, start, now + 1));
    const prevBoards = boards.filter(b => inRange(b.created_at, prevStart, start));
    const periodMessages = userMessages.filter(m => inRange(m.created_at, start, now + 1));
    const live = (b: BoardRow) => b.status !== 'DELETED';
    const sent = (b: BoardRow) => b.status === 'PUBLISHED' || b.status === 'DELIVERED';

    // Daily (or weekly) series for the charts.
    const series = new Map<number, { signups: number; boards: number; cards: number; messages: number }>();
    for (let t = bucketStart(start, bucket); t <= now; t += (bucket === 'week' ? 7 : 1) * DAY) {
      series.set(t, { signups: 0, boards: 0, cards: 0, messages: 0 });
    }
    const add = (iso: string, field: 'signups' | 'boards' | 'cards' | 'messages') => {
      const t = new Date(iso).getTime();
      if (t < start) return;
      const row = series.get(bucketStart(t, bucket));
      if (row) row[field]++;
    };
    users.forEach(u => add(u.created_at, 'signups'));
    periodBoards.forEach(b => add(b.created_at, b.format_type === 'card' ? 'cards' : 'boards'));
    periodMessages.forEach(m => add(m.created_at, 'messages'));

    const messagesPerBoard = countBy(userMessages, m => m.board_id);
    const boardsPerUser = countBy(boards.filter(b => b.user_id), b => b.user_id!);

    const occasionCounts = new Map<string, { boards: number; cards: number }>();
    for (const b of periodBoards) {
      const label = formatOccasionLabel(b.occasion_type || 'other');
      const row = occasionCounts.get(label) ?? { boards: 0, cards: 0 };
      row[b.format_type === 'card' ? 'cards' : 'boards']++;
      occasionCounts.set(label, row);
    }

    const templateUses = countBy(periodBoards.filter(b => b.source_template_id), b => b.source_template_id!);

    const sentBoards = boards.filter(sent);

    return NextResponse.json({
      range: { days, bucket, start: new Date(start).toISOString() },
      totals: {
        users: users.length,
        boards: boards.filter(b => b.format_type !== 'card').length,
        cards: boards.filter(b => b.format_type === 'card').length,
        deleted: boards.filter(b => !live(b)).length,
        messages: userMessages.length,
        contributors: userContributors.length,
        sent: sentBoards.length,
        delivered: boards.filter(b => b.status === 'DELIVERED').length,
        avgMessagesPerSent: sentBoards.length
          ? Math.round((sentBoards.reduce((sum, b) => sum + (messagesPerBoard.get(b.id) ?? 0), 0) / sentBoards.length) * 10) / 10
          : 0,
        scheduledUpcoming: boards.filter(
          b => live(b) && b.status !== 'DELIVERED' && b.delivery_type === 'SCHEDULED' &&
            b.scheduled_delivery && new Date(b.scheduled_delivery).getTime() > now
        ).length,
      },
      period: {
        signups: users.filter(u => inRange(u.created_at, start, now + 1)).length,
        prevSignups: users.filter(u => inRange(u.created_at, prevStart, start)).length,
        activeUsers: users.filter(u => inRange(u.last_sign_in_at, start, now + 1)).length,
        creators: new Set(periodBoards.map(b => b.user_id).filter(Boolean)).size,
        boards: periodBoards.filter(b => b.format_type !== 'card').length,
        cards: periodBoards.filter(b => b.format_type === 'card').length,
        prevBoards: prevBoards.filter(b => b.format_type !== 'card').length,
        prevCards: prevBoards.filter(b => b.format_type === 'card').length,
        messages: periodMessages.length,
        prevMessages: userMessages.filter(m => inRange(m.created_at, prevStart, start)).length,
        // Funnel for boards and cards created in the period, by current status.
        funnel: {
          created: periodBoards.length,
          withMessages: periodBoards.filter(b => messagesPerBoard.has(b.id)).length,
          sent: periodBoards.filter(sent).length,
          delivered: periodBoards.filter(b => b.status === 'DELIVERED').length,
          deleted: periodBoards.filter(b => !live(b)).length,
        },
      },
      series: [...series.entries()].map(([t, row]) => ({ date: new Date(t).toISOString().slice(0, 10), ...row })),
      occasions: [...occasionCounts.entries()]
        .map(([label, row]) => ({ label, ...row, total: row.boards + row.cards }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 10),
      templates: [...templateUses.entries()]
        .map(([id, uses]) => {
          const t = templates.get(id);
          return {
            id,
            uses,
            title: t?.title ?? 'Deleted template',
            format: t?.format_type ?? null,
            occasion: t ? formatOccasionLabel(t.occasion_type) : null,
            shortId: t?.short_id ?? null,
          };
        })
        .sort((a, b) => b.uses - a.uses)
        .slice(0, 10),
      recentSignups: [...users]
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, 15)
        .map(u => ({
          email: u.email ?? '',
          provider: (u.app_metadata?.provider as string | undefined) ?? 'email',
          createdAt: u.created_at,
          lastSignInAt: u.last_sign_in_at ?? null,
          confirmed: !!(u.email_confirmed_at || u.confirmed_at),
          boards: boardsPerUser.get(u.id) ?? 0,
        })),
      recentBoards: [...boards]
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .slice(0, 15)
        .map(b => ({
          title: b.title,
          shortId: b.short_id,
          format: b.format_type,
          occasion: formatOccasionLabel(b.occasion_type || 'other'),
          status: b.status,
          owner: (b.user_id && emailById.get(b.user_id)) || '',
          messages: messagesPerBoard.get(b.id) ?? 0,
          fromTemplate: !!b.source_template_id,
          createdAt: b.created_at,
        })),
    });
  } catch (err) {
    console.error('Admin analytics failed:', err);
    return NextResponse.json({ error: 'Failed to load analytics' }, { status: 500 });
  }
}
