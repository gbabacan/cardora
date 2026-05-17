import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import InviteEmail from '@/emails/InviteEmail';

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
      customMessage,
      creatorName,
    } = body;

    // Validate required fields
    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json(
        { error: 'Email addresses are required' },
        { status: 400 }
      );
    }

    if (!boardTitle || !recipientNames || !boardLink || !creatorName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send emails to all contributors
    const emailPromises = emails.map(async (email: string) => {
      const emailHtml = await render(
        InviteEmail({
          contributorEmail: email,
          boardTitle,
          recipientNames,
          boardLink,
          customMessage,
          creatorName,
        })
      );

      return resend.emails.send({
        from: 'Cardora <onboarding@resend.dev>', // Update this to your verified domain
        to: email,
        subject: `You're invited to contribute to "${boardTitle}"`,
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
      message: `Successfully sent ${successes.length} out of ${emails.length} invites`,
    });
  } catch (error: any) {
    console.error('Error sending invites:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send invites' },
      { status: 500 }
    );
  }
}