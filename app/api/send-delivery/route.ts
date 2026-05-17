import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import DeliveryEmail from '@/emails/DeliveryEmail';

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
        })
      );

      return resend.emails.send({
        from: 'Cardora <onboarding@resend.dev>', // Update this to your verified domain
        to: email,
        subject: `You have a special gift waiting for you 💝`,
        html: emailHtml,
      });
    });

    const results = await Promise.allSettled(emailPromises);

    // Check for failures
    const failures = results.filter((result) => result.status === 'rejected');
    const successes = results.filter((result) => result.status === 'fulfilled');

    if (failures.length > 0) {
      console.error('Some emails failed to send:', failures);
    }

    return NextResponse.json({
      success: true,
      sent: successes.length,
      failed: failures.length,
      message: `Successfully delivered to ${successes.length} out of ${emails.length} recipients`,
    });
  } catch (error: any) {
    console.error('Error sending delivery emails:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send delivery emails' },
      { status: 500 }
    );
  }
}