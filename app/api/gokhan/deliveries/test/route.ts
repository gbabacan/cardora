import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import DeliveryEmail from '@/emails/DeliveryEmail';
import { EMAIL_FROM } from '@/lib/email';
import { sendLogged } from '@/lib/emailLog';
import { getRequestAdmin, getEmailBoard, recipientNamesOf, boardViewLink } from '@/lib/serverAuth';

// Sends the recipient delivery email to the signed-in admin only, either
// for a real board (to preview exactly what its recipients get) or with
// sample content. Nothing changes on the board.
export async function POST(request: NextRequest) {
  const admin = await getRequestAdmin(request);
  if (!admin?.email) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Email service is not configured' }, { status: 500 });
  }

  try {
    const { boardId } = await request.json().catch(() => ({}));
    const board = boardId ? await getEmailBoard(boardId) : null;
    if (boardId && !board) return NextResponse.json({ error: 'Board not found' }, { status: 404 });

    const html = await render(
      DeliveryEmail({
        recipientEmail: admin.email,
        boardTitle: board?.title ?? 'Happy Birthday, Sarah!',
        recipientNames: board ? recipientNamesOf(board) : ['Sarah Bennett'],
        boardLink: board ? boardViewLink(board) : 'cardora.cards/templates',
        deliveryMessage: board?.recipient_message ?? 'This is a test of the Cardora delivery email.',
        formatType: board?.format_type ?? 'board',
      })
    );
    const result = await sendLogged(
      new Resend(process.env.RESEND_API_KEY),
      { from: EMAIL_FROM, to: admin.email, subject: `[Test] You have a special gift waiting for you 💝`, html },
      { kind: 'test', trigger: 'admin', boardId: board?.id ?? null }
    );
    if (result.error) return NextResponse.json({ error: result.error.message }, { status: 502 });
    return NextResponse.json({ ok: true, to: admin.email });
  } catch (err) {
    console.error('Admin test email failed:', err);
    return NextResponse.json({ error: 'Failed to send test email' }, { status: 500 });
  }
}
