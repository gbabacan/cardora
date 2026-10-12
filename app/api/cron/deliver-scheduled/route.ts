import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/serverAuth';
import { deliverBoard, DELIVERY_SELECT, type DeliverableBoard } from '@/lib/delivery';

// Records each run in cron_runs so the admin page can see when cron-job.org
// last called. Best effort: a missing table never stops deliveries.
async function startRun(): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('cron_runs')
      .insert({ job: 'deliver-scheduled' })
      .select('id')
      .single();
    if (error) throw error;
    return data.id;
  } catch (err) {
    console.error('cron_runs insert failed:', err);
    return null;
  }
}

async function finishRun(id: string | null, result: { due?: number; delivered?: number; failed?: number; error?: string }) {
  if (!id) return;
  try {
    await supabaseAdmin
      .from('cron_runs')
      .update({ finished_at: new Date().toISOString(), ...result })
      .eq('id', id);
  } catch (err) {
    console.error('cron_runs update failed:', err);
  }
}

export async function GET(request: NextRequest) {
  // Called hourly by cron-job.org with the shared secret.
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const runId = await startRun();

  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      await finishRun(runId, { error: 'RESEND_API_KEY is not configured' });
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const now = new Date().toISOString();

    // Find all scheduled boards that are due for delivery
    const { data: scheduledBoards, error: fetchError } = await supabaseAdmin
      .from('boards')
      .select(DELIVERY_SELECT)
      .eq('status', 'PUBLISHED')
      .eq('delivery_type', 'SCHEDULED')
      .not('scheduled_delivery', 'is', null)
      .lte('scheduled_delivery', now);

    if (fetchError) {
      console.error('Error fetching scheduled boards:', fetchError);
      await finishRun(runId, { error: fetchError.message });
      return NextResponse.json(
        { error: 'Failed to fetch scheduled boards', details: fetchError.message, hint: fetchError.hint },
        { status: 500 }
      );
    }

    if (!scheduledBoards || scheduledBoards.length === 0) {
      await finishRun(runId, { due: 0, delivered: 0, failed: 0 });
      return NextResponse.json({
        success: true,
        message: 'No boards or cards due for delivery',
        delivered: 0
      });
    }

    console.log(`Found ${scheduledBoards.length} boards due for delivery`);

    const deliveryResults = [];
    for (const board of scheduledBoards as DeliverableBoard[]) {
      try {
        console.log(`Processing board: ${board.id} - ${board.title}`);
        const result = await deliverBoard(resend, board, 'cron');
        deliveryResults.push({ boardId: board.id, title: board.title, ...result });
      } catch (error) {
        console.error(`Error processing board ${board.id}:`, error);
        deliveryResults.push({
          boardId: board.id,
          title: board.title,
          success: false,
          error: (error as Error).message
        });
      }
    }

    const successCount = deliveryResults.filter(r => r.success).length;
    await finishRun(runId, {
      due: scheduledBoards.length,
      delivered: successCount,
      failed: scheduledBoards.length - successCount,
    });

    return NextResponse.json({
      success: true,
      message: `Delivered ${successCount} out of ${scheduledBoards.length} scheduled boards`,
      delivered: successCount,
      results: deliveryResults
    });

  } catch (error) {
    console.error('Error in scheduled delivery cron:', error);
    await finishRun(runId, { error: (error as Error).message });
    return NextResponse.json(
      { error: (error as Error).message || 'Failed to process scheduled deliveries' },
      { status: 500 }
    );
  }
}
