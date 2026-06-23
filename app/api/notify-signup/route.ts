import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const record = body?.record;
    const email = record?.email ?? 'unknown';
    const name = record?.raw_user_meta_data?.name ?? record?.raw_user_meta_data?.full_name ?? '';
    const signedUpAt = record?.created_at ?? new Date().toISOString();

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Cardora <onboarding@resend.dev>',
      to: 'gokhanbabacan@gmail.com',
      subject: `New signup: ${name || email}`,
      html: `
        <p><strong>New user signed up on Cardora</strong></p>
        <p><strong>Email:</strong> ${email}</p>
        ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
        <p><strong>Time:</strong> ${new Date(signedUpAt).toLocaleString('en-US', { timeZone: 'America/New_York' })}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error sending signup notification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}