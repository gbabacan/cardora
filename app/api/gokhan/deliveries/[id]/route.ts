import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getRequestAdmin, supabaseAdmin } from '@/lib/serverAuth';
import { isUuid } from '@/lib/adminTemplates';
import { deliverBoard, DELIVERY_SELECT, type DeliverableBoard } from '@/lib/delivery';
import { logAdminAction, quoted } from '@/lib/auditLog';

type Params = { params: Promise<{ id: string }> };

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

// Admin delivery actions on one board or card:
//   send       deliver now, exactly as the scheduled job would (also resends
//              a delivered one)
//   reschedule move a scheduled delivery to `at` (must be in the future)
//   cancel     drop the schedule; the owner can deliver it manually
export async function POST(request: NextRequest, { params }: Params) {
  const admin = await getRequestAdmin(request);
  if (!admin) return fail('Not found', 404);
  const { id } = await params;
  if (!isUuid(id)) return fail('Not found', 404);

  try {
    const { action, at } = await request.json();
    const { data: board, error } = await supabaseAdmin
      .from('boards')
      .select(`${DELIVERY_SELECT}, status, delivery_type, scheduled_delivery, is_template`)
      .eq('id', id)
      .eq('is_template', false)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!board) return fail('Not found', 404);

    if (action === 'send') {
      if (board.status !== 'PUBLISHED' && board.status !== 'DELIVERED') {
        return fail('Only published or delivered boards can be sent');
      }
      if (!process.env.RESEND_API_KEY) return fail('Email service is not configured', 500);
      const result = await deliverBoard(new Resend(process.env.RESEND_API_KEY), board as DeliverableBoard, 'admin');
      await logAdminAction(admin, {
        action: 'delivery.send',
        targetType: 'board',
        targetId: id,
        boardId: id,
        summary: result.success
          ? `${board.status === 'DELIVERED' ? 'Resent' : 'Sent'} ${quoted(board.title)} now: ${result.recipientEmailsSent} recipient and ${result.contributorEmailsSent} contributor emails`
          : `Tried to send ${quoted(board.title)} now; it failed: ${result.error}`,
        details: { previousStatus: board.status, ...result },
      });
      return result.success ? NextResponse.json(result) : fail(result.error, 502);
    }

    if (action === 'reschedule') {
      const when = typeof at === 'string' ? new Date(at) : null;
      if (!when || Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
        return fail('Pick a time in the future');
      }
      if (board.status !== 'PUBLISHED') return fail('Only published boards can be scheduled');
      const { error: updateError } = await supabaseAdmin
        .from('boards')
        .update({ delivery_type: 'SCHEDULED', scheduled_delivery: when.toISOString() })
        .eq('id', id);
      if (updateError) throw new Error(updateError.message);
      await logAdminAction(admin, {
        action: 'delivery.reschedule',
        targetType: 'board',
        targetId: id,
        boardId: id,
        summary: `Rescheduled ${quoted(board.title)}`,
        details: { scheduledDelivery: { from: board.scheduled_delivery, to: when.toISOString() } },
      });
      return NextResponse.json({ ok: true });
    }

    if (action === 'cancel') {
      const { error: updateError } = await supabaseAdmin
        .from('boards')
        .update({ delivery_type: 'ON_DEMAND', scheduled_delivery: null })
        .eq('id', id);
      if (updateError) throw new Error(updateError.message);
      await logAdminAction(admin, {
        action: 'delivery.cancel',
        targetType: 'board',
        targetId: id,
        boardId: id,
        summary: `Cancelled the scheduled delivery of ${quoted(board.title)}`,
        details: { scheduledDelivery: { from: board.scheduled_delivery, to: null } },
      });
      return NextResponse.json({ ok: true });
    }

    return fail('Unknown action');
  } catch (err) {
    console.error('Admin delivery action failed:', err);
    return fail('Delivery action failed', 500);
  }
}
