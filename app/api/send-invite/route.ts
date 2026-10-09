import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import InviteEmail from '@/emails/InviteEmail';
import { EMAIL_FROM, summarizeSendResults } from '@/lib/email';
import { getRequestUser, getEmailBoard, cleanEmailList, recipientNamesOf, boardViewLink } from '@/lib/serverAuth';

const MAX_OWNER_INVITES = 50;
const MAX_CONTRIBUTOR_INVITES = 10;

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

    const body = await request.json();
    const { boardId, customMessage, creatorName: requestedCreatorName } = body;

    const board = await getEmailBoard(boardId);
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    // Contributors (often logged out) may invite others too, but only with
    // the standard invite built from the board's saved data. A custom
    // message and sender name are reserved for the owner, so the endpoint
    // can't be used to send arbitrary text from our domain.
    const user = await getRequestUser(request);
    const isOwner = !!user && user.id === board.user_id;

    if (!isOwner && (board.format_type === 'card' || board.status === 'DELIVERED')) {
      return NextResponse.json(
        { error: 'This board is no longer accepting contributors' },
        { status: 403 }
      );
    }

    const emails = cleanEmailList(body.emails);
    if (!emails || emails.length === 0) {
      return NextResponse.json(
        { error: 'Valid email addresses are required' },
        { status: 400 }
      );
    }

    const maxInvites = isOwner ? MAX_OWNER_INVITES : MAX_CONTRIBUTOR_INVITES;
    if (emails.length > maxInvites) {
      return NextResponse.json(
        { error: `You can invite up to ${maxInvites} people at a time` },
        { status: 400 }
      );
    }

    const boardTitle = board.title;
    const recipientNames = recipientNamesOf(board);
    const boardLink = board.format_type === 'card'
      ? boardViewLink(board)
      : `cardora.cards/boards/${board.short_id}`;
    const ownerCustomMessage = isOwner && typeof customMessage === 'string' && customMessage.trim()
      ? customMessage.slice(0, 1000)
      : undefined;
    const creatorName = isOwner
      ? (typeof requestedCreatorName === 'string' && requestedCreatorName.trim()
          ? requestedCreatorName.slice(0, 100)
          : user.user_metadata?.name || 'Someone')
      : 'A contributor';

    // Send emails to all contributors
    const emailPromises = emails.map(async (email: string) => {
      const emailHtml = await render(
        InviteEmail({
          contributorEmail: email,
          boardTitle,
          recipientNames,
          boardLink,
          customMessage: ownerCustomMessage,
          creatorName,
        })
      );

      return resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: `You're invited to contribute to "${boardTitle}"`,
        html: emailHtml,
      });
    });

    const results = await Promise.allSettled(emailPromises);

    const { sent, failed, errors } = summarizeSendResults(results);

    if (failed > 0) {
      console.error('Some emails failed to send:', errors);
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      message: `Successfully sent ${sent} out of ${emails.length} invites`,
    });
  } catch (error: any) {
    console.error('Error sending invites:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send invites' },
      { status: 500 }
    );
  }
}