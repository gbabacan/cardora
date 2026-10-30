import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import DeliveryEmail from '@/emails/DeliveryEmail';
import { EMAIL_FROM, summarizeSendResults } from '@/lib/email';
import { sendLogged } from '@/lib/emailLog';
import { getRequestUser, getEmailBoard, savedEmailList, recipientNamesOf, boardViewLink, supabaseAdmin } from '@/lib/serverAuth';

const errorText = (error: unknown) =>
  error && typeof error === 'object' && 'message' in error ? String((error as { message: unknown }).message) : String(error);

// Sends a board's or card's delivery email to its saved recipients and, once
// at least one has gone out, marks it DELIVERED. The editor saves recipients
// first and only locks the board after this succeeds, so a failed send leaves
// it editable and the owner can try again.
export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured. Please add RESEND_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const user = await getRequestUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Please log in to deliver' }, { status: 401 });
    }

    const body = await request.json();
    const { boardId, senderName } = body;

    // Only the board's owner can send its delivery emails
    const board = await getEmailBoard(boardId);
    if (!board || board.user_id !== user.id) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }
    if (board.status === 'DELIVERED') {
      return NextResponse.json(
        { error: `This ${board.format_type === 'card' ? 'card' : 'board'} has already been delivered` },
        { status: 409 }
      );
    }

    const emails = savedEmailList(board.recipients.map(r => r.email));
    if (emails.length === 0) {
      return NextResponse.json(
        { error: 'Recipient email addresses are required' },
        { status: 400 }
      );
    }

    const boardTitle = board.title;
    const recipientNames = recipientNamesOf(board);
    const boardLink = boardViewLink(board);
    const deliveryMessage = board.recipient_message || undefined;
    const formatType = board.format_type || 'board';

    // Send emails to all recipients
    const emailPromises = emails.map(async (email: string) => {
      const emailHtml = await render(
        DeliveryEmail({
          recipientEmail: email,
          boardTitle,
          recipientNames,
          boardLink,
          deliveryMessage,
          formatType,
          senderName: typeof senderName === 'string' ? senderName.slice(0, 100) : undefined,
        })
      );

      return sendLogged(resend, {
        from: EMAIL_FROM,
        to: email,
        subject: `You have a special gift waiting for you 💝`,
        html: emailHtml,
      }, { kind: 'delivery', trigger: 'owner', boardId: board.id });
    });

    const results = await Promise.allSettled(emailPromises);

    const { sent, failed, errors } = summarizeSendResults(results);
    const failedEmails = emails.filter((_, index) => {
      const result = results[index];
      return result.status === 'rejected' || !!result.value.error;
    });

    if (failed > 0) {
      console.error('Some emails failed to send:', errors);
    }

    if (sent === 0) {
      return NextResponse.json(
        { error: `The email could not be sent: ${errorText(errors[0])}`, sent, failed, failedEmails },
        { status: 502 }
      );
    }

    const { error: statusError } = await supabaseAdmin
      .from('boards')
      .update({ status: 'DELIVERED', delivery_type: 'ON_DEMAND', scheduled_delivery: null })
      .eq('id', board.id);
    if (statusError) {
      // The emails are out, so report success; the board just isn't locked yet.
      console.error(`Delivered board ${board.id} but could not mark it DELIVERED:`, statusError);
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      failedEmails,
      message: `Successfully delivered to ${sent} out of ${emails.length} recipients`,
    });
  } catch (error: any) {
    console.error('Error sending delivery emails:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send delivery emails' },
      { status: 500 }
    );
  }
}