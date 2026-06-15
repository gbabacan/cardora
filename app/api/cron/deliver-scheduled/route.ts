import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { render } from '@react-email/render';
import { Resend } from 'resend';
import DeliveryEmail from '@/emails/DeliveryEmail';
import ContributorNotificationEmail from '@/emails/ContributorNotificationEmail';

// Create Supabase admin client (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from a cron job (optional: add authentication)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Get current time
    const now = new Date().toISOString();

    // Find all scheduled boards that are due for delivery
    const { data: scheduledBoards, error: fetchError } = await supabaseAdmin
      .from('boards')
      .select('*, recipients(*), contributors(*)')
      .eq('status', 'PUBLISHED')
      .eq('delivery_type', 'SCHEDULED')
      .not('scheduled_delivery', 'is', null)
      .lte('scheduled_delivery', now);

    if (fetchError) {
      console.error('Error fetching scheduled boards:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch scheduled boards', details: fetchError.message, hint: fetchError.hint },
        { status: 500 }
      );
    }

    if (!scheduledBoards || scheduledBoards.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No boards or cards due for delivery',
        delivered: 0
      });
    }

    console.log(`Found ${scheduledBoards.length} boards due for delivery`);

    const deliveryResults = [];

    // Process each board
    for (const board of scheduledBoards) {
      try {
        console.log(`Processing board: ${board.id} - ${board.title}`);

        const recipientNames = board.recipients.map((r: any) => r.name);
        const formatType = board.format_type || 'board';
        const boardLink = `cardora.cards/${formatType === 'card' ? 'cards' : 'boards'}/${board.short_id}/view`;

        // Send emails to recipients
        const recipientEmails = board.recipients
          .map((r: any) => r.email)
          .filter((email: string) => email && email.trim());

        let recipientEmailsSent = 0;

        if (recipientEmails.length > 0) {
          const recipientEmailPromises = recipientEmails.map(async (email: string) => {
            const emailHtml = await render(
              DeliveryEmail({
                recipientEmail: email,
                boardTitle: board.title,
                recipientNames,
                boardLink,
                deliveryMessage: board.recipient_message,
              })
            );

            return resend.emails.send({
              from: 'Cardora <onboarding@resend.dev>',
              to: email,
              subject: `You have a special gift waiting for you 💝`,
              html: emailHtml,
            });
          });

          const recipientResults = await Promise.allSettled(recipientEmailPromises);
          recipientEmailsSent = recipientResults.filter(r => r.status === 'fulfilled').length;
          console.log(`Sent ${recipientEmailsSent} emails to recipients`);
        }

        // Send emails to contributors if enabled
        let contributorEmailsSent = 0;

        if (board.notify_contributors && board.contributors && board.contributors.length > 0) {
          const contributorEmails = board.contributors
            .map((c: any) => c.email)
            .filter((email: string) => email && email.trim());

          if (contributorEmails.length > 0) {
            const contributorEmailPromises = contributorEmails.map(async (email: string) => {
              const emailHtml = await render(
                ContributorNotificationEmail({
                  contributorEmail: email,
                  boardTitle: board.title,
                  recipientNames,
                  boardLink,
                })
              );

              return resend.emails.send({
                from: 'Cardora <onboarding@resend.dev>',
                to: email,
                subject: `Your contribution to "${board.title}" has been delivered!`,
                html: emailHtml,
              });
            });

            const contributorResults = await Promise.allSettled(contributorEmailPromises);
            contributorEmailsSent = contributorResults.filter(r => r.status === 'fulfilled').length;
            console.log(`Sent ${contributorEmailsSent} emails to contributors`);
          }
        }

        // Update board status to DELIVERED
        const { error: updateError } = await supabaseAdmin
          .from('boards')
          .update({ status: 'DELIVERED' })
          .eq('id', board.id);

        if (updateError) {
          console.error(`Error updating board ${board.id}:`, updateError);
          deliveryResults.push({
            boardId: board.id,
            title: board.title,
            success: false,
            error: updateError.message
          });
        } else {
          deliveryResults.push({
            boardId: board.id,
            title: board.title,
            success: true,
            recipientEmailsSent,
            contributorEmailsSent
          });
        }
      } catch (error: any) {
        console.error(`Error processing board ${board.id}:`, error);
        deliveryResults.push({
          boardId: board.id,
          title: board.title,
          success: false,
          error: error.message
        });
      }
    }

    const successCount = deliveryResults.filter(r => r.success).length;

    return NextResponse.json({
      success: true,
      message: `Delivered ${successCount} out of ${scheduledBoards.length} scheduled boards`,
      delivered: successCount,
      results: deliveryResults
    });

  } catch (error: any) {
    console.error('Error in scheduled delivery cron:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process scheduled deliveries' },
      { status: 500 }
    );
  }
}