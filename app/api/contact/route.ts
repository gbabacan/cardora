import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

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
    const { name, email, type, message } = body;

    // Validate required fields
    if (!name || !email || !type || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Send email to admin
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #0B1F2A;
              background-color: #F7FAFC;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
            }
            .header {
              background-color: #2CB1A6;
              color: #ffffff;
              padding: 32px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: bold;
            }
            .content {
              padding: 32px;
            }
            .field {
              margin-bottom: 24px;
            }
            .field-label {
              font-weight: 600;
              color: #5B6B75;
              font-size: 14px;
              text-transform: uppercase;
              margin-bottom: 8px;
            }
            .field-value {
              color: #0B1F2A;
              font-size: 16px;
            }
            .message-box {
              background-color: #F7FAFC;
              border-left: 4px solid #2CB1A6;
              padding: 16px;
              margin-top: 8px;
              white-space: pre-wrap;
            }
            .footer {
              background-color: #F7FAFC;
              text-align: center;
              padding: 24px;
              border-top: 1px solid #E5EAF0;
            }
            .footer p {
              margin: 0;
              color: #5B6B75;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">From</div>
                <div class="field-value">${name}</div>
              </div>
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value">${email}</div>
              </div>
              <div class="field">
                <div class="field-label">Type</div>
                <div class="field-value">${type}</div>
              </div>
              <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">${message}</div>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 Cardora. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await resend.emails.send({
      from: 'Cardora Contact Form <onboarding@resend.dev>',
      to: 'gokhanbabacan@gmail.com',
      replyTo: email,
      subject: `[${type}] Contact Form - ${name}`,
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch (error: any) {
    console.error('Error sending contact email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send message' },
      { status: 500 }
    );
  }
}
