# Email Setup Guide

This guide will help you set up email sending for Cardora using Resend.

## Prerequisites

- A Resend account (free tier available)
- A verified domain (or use Resend's test domain for development)

## Step 1: Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

## Step 2: Get Your API Key

1. Log in to your Resend dashboard
2. Go to **API Keys** in the sidebar
3. Click **Create API Key**
4. Give it a name (e.g., "Cardora Development")
5. Copy the API key (it starts with `re_`)

## Step 3: Add API Key to Environment Variables

1. Open your `.env.local` file
2. Find the line: `RESEND_API_KEY=""`
3. Paste your API key: `RESEND_API_KEY="re_your_api_key_here"`
4. Save the file

## Step 4: Update Email Sender (Production Only)

For **development**, you can use Resend's default sender:
- `onboarding@resend.dev` (already configured)

For **production**, you need to:

1. **Add and verify your domain** in Resend dashboard
2. **Update the sender email** in `/app/api/send-invite/route.ts`:
   ```typescript
   from: 'Cardora <invites@yourdomain.com>',
   ```

## Step 5: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Start it again
npm run dev
```

## Testing

1. Go to your board editor
2. Click "Invite Contributors"
3. Switch to "Email" tab
4. Enter test email addresses
5. Add a custom message
6. Click "Send Invites"

You should receive emails at the addresses you specified!

## Email Template Features

The invitation email includes:
- ✅ Cardora branding
- ✅ Board title and recipients
- ✅ Custom message from creator
- ✅ Direct link to contribute
- ✅ Mobile-friendly design
- ✅ Professional styling

## Rate Limits

Resend free tier includes:
- **3,000 emails/month**
- **100 emails/day**

For higher volume, upgrade to a paid plan.

## Troubleshooting

### "Missing RESEND_API_KEY" error
- Make sure you've added the API key to `.env.local`
- Restart your development server after adding it

### Emails not arriving
- Check spam/junk folder
- Verify email addresses are correct
- Check Resend dashboard for delivery logs

### "Domain not verified" error (production only)
- Add your domain in Resend dashboard
- Complete DNS verification
- Wait up to 48 hours for DNS propagation

## Support

- Resend Documentation: https://resend.com/docs
- Resend Status: https://status.resend.com