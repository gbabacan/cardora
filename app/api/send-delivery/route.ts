import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import DeliveryEmail from '@/emails/DeliveryEmail';
import { EMAIL_FROM, summarizeSendResults } from '@/lib/email';

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
    const {
      emails,
      boardTitle,
      recipientNames,
      boardLink,
      deliveryMessage,
      formatType,
      senderName,
    } = body;

    // Validate required fields
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Recipient email addresses are required' },
        { status: 400 }
      );
    }

    if (!boardTitle || !recipientNames || !boardLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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
          senderName,
        })
      );

      return resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: `You have a special gift waiting for you 💝`,
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