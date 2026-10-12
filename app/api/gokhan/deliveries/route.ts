import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import { formatOccasionLabel } from '@/lib/occasionLabels';
import { listAllUsers } from '@/lib/adminModeration';

const LOG_LIMIT = 100;
const WEEK = 7 * 24 * 60 * 60 * 1000;
const KINDS = ['delivery', 'delivered_notice', 'invite', 'test'];

interface ScheduledRow {
  id: string;
  title: string;
  short_id: string;
  format_type: 'board' | 'card';
  occasion_type: string;
  user_id: string | null;
  scheduled_delivery: string;
  notify_contributors: boolean;
  recipients: { name: string; email: string | null }[];
  messages: { count: number }[];
}

interface LogRow {
  id: string;
  board_id: string | null;
  kind: string;
  trigger: string;
  to_email: string;
  subject: string | null;
  status: 'sent' | 'failed';
  error: string | null;
  created_at: string;
  board: { title: string; short_id: string; format_type: 'board' | 'card' } | null;
}

// Postgres "relation does not exist": the add_email_log migration hasn't run.
const missingTable = (error: { code?: string } | null) => error?.code === '42P01' || error?.code === 'PGRST205';

// Scheduled deliveries (overdue first), the recent email log and the last
// cron runs.
export async function GET(request: NextRequest) {
  if (!(await getRequestAdmin(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const params = request.nextUrl.searchParams;
  const failedOnly = params.get('failed') === '1';
  const kind = params.get('kind');

  try {
    let logQuery = supabaseAdmin
      .from('email_log')
      .select('id, board_id, kind, trigger, to_email, subject, status, error, created_at, board:board_id(title, short_id, format_type)')
      .order('created_at', { ascending: false })
      .limit(LOG_LIMIT);
    if (failedOnly) logQuery = logQuery.eq('status', 'failed');
    if (kind && KINDS.includes(kind)) logQuery = logQuery.eq('kind', kind);

    const weekAgo = new Date(Date.now() - WEEK).toISOString();
    const [scheduled, log, weekLog, runs, users] = await Promise.all([
      supabaseAdmin
        .from('boards')
        .select('id, title, short_id, format_type, occasion_type, user_id, scheduled_delivery, notify_contributors, recipients(name, email), messages(count)')
        .eq('is_template', false)
        .eq('status', 'PUBLISHED')
        .eq('delivery_type', 'SCHEDULED')
        .not('scheduled_delivery', 'is', null)
        .order('scheduled_delivery', { ascending: true })
        .limit(200),
      logQuery,
      supabaseAdmin.from('email_log').select('status').gte('created_at', weekAgo).limit(5000),
      supabaseAdmin.from('cron_runs').select('started_at, finished_at, due, delivered, failed, error').order('started_at', { ascending: false }).limit(10),
      listAllUsers(),
    ]);
    if (scheduled.error) throw new Error(scheduled.error.message);
    const tablesReady = !missingTable(log.error) && !missingTable(runs.error);
    for (const res of [log, weekLog, runs]) {
      if (res.error && !missingTable(res.error)) throw new Error(res.error.message);
    }

    const emailById = new Map(users.map(u => [u.id, u.email ?? '']));
    const now = Date.now();

    return NextResponse.json({
      tablesReady,
      scheduled: ((scheduled.data ?? []) as unknown as ScheduledRow[]).map(b => {
        const withEmail = b.recipients.filter(r => r.email?.trim());
        return {
          id: b.id,
          title: b.title,
          shortId: b.short_id,
          format: b.format_type,
          occasion: formatOccasionLabel(b.occasion_type || 'other'),
          owner: (b.user_id && emailById.get(b.user_id)) || '',
          at: b.scheduled_delivery,
          overdue: new Date(b.scheduled_delivery).getTime() <= now,
          recipients: b.recipients.map(r => r.name),
          recipientEmails: withEmail.length,
          messages: b.messages[0]?.count ?? 0,
          notifyContributors: b.notify_contributors,
        };
      }),
      log: ((log.data ?? []) as unknown as LogRow[]).map(l => ({
        id: l.id,
        boardId: l.board_id,
        board: l.board ? { title: l.board.title, shortId: l.board.short_id, format: l.board.format_type } : null,
        kind: l.kind,
        trigger: l.trigger,
        to: l.to_email,
        subject: l.subject,
        status: l.status,
        error: l.error,
        at: l.created_at,
      })),
      week: {
        sent: (weekLog.data ?? []).filter(r => r.status === 'sent').length,
        failed: (weekLog.data ?? []).filter(r => r.status === 'failed').length,
      },
      runs: runs.data ?? [],
    });
  } catch (err) {
    console.error('Admin deliveries load failed:', err);
    return NextResponse.json({ error: 'Failed to load deliveries' }, { status: 500 });
  }
}
