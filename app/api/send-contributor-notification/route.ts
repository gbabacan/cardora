import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import ContributorNotificationEmail from '@/emails/ContributorNotificationEmail';
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
    } = body;

    // Validate required fields
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Contributor email addresses are required' },
        { status: 400 }
      );
    }

    if (!boardTitle || !recipientNames || !boardLink) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send emails to all contributors
    const emailPromises = emails.map(async (email: string) => {
      const emailHtml = await render(
        ContributorNotificationEmail({
          contributorEmail: email,
          boardTitle,
          recipientNames,
          boardLink,
        })
      );

      return resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: `Your contribution to "${boardTitle}" has been delivered!`,
        html: emailHtml,
      });
    });

    const results = await Promise.allSettled(emailPromises);

    const { sent, failed, errors } = summarizeSendResults(results);

    if (failed > 0) {
      console.error('Some contributor notification emails failed to send:', errors);
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      message: `Successfully notified ${sent} out of ${emails.length} contributors`,
    });
  } catch (error: any) {
    console.error('Error sending contributor notifications:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send contributor notifications' },
      { status: 500 }
    );
  }
}