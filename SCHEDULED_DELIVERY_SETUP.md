# Scheduled Delivery Setup Guide

This guide explains how the scheduled delivery system works and how to set it up.

## How It Works

When a user creates a board and selects "Schedule for later" in the Delivery section:

1. **User saves the board** with a specific date and time
2. **Board is saved** with:
   - `delivery_type: 'SCHEDULED'`
   - `scheduled_delivery: '2024-12-25T09:00:00'` (ISO timestamp)
   - `status: 'PUBLISHED'` (not delivered yet)

3. **Cron job runs every 5 minutes** to check for boards due for delivery
4. **When scheduled time arrives**, the system:
   - Sends delivery emails to all recipients
   - Sends notification emails to contributors (if enabled)
   - Updates board status to `DELIVERED`

---

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cron Job Secret (for security)
CRON_SECRET=your-random-secret-string

# Resend API Key (already configured)
RESEND_API_KEY=your-resend-api-key
```

### Where to Find These:

1. **SUPABASE_SERVICE_ROLE_KEY**:
   - Go to [Supabase Dashboard](https://app.supabase.com/)
   - Select your project
   - Go to **Settings** > **API**
   - Copy the **service_role** key (NOT the anon key)
   - ⚠️ **Important**: This key bypasses Row Level Security. Keep it secret and never expose it to the client.

2. **CRON_SECRET**:
   - Generate a random string (at least 32 characters)
   - Example using Node.js:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Or use any password generator

3. **RESEND_API_KEY**:
   - Already configured in your `.env.local`
   - Same key used for invite emails

---

## Vercel Deployment Setup

### Step 1: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Environment Variables**
3. Add the following variables:
   - `SUPABASE_SERVICE_ROLE_KEY` (from Supabase)
   - `CRON_SECRET` (your generated secret)
   - `RESEND_API_KEY` (your Resend API key)
   - `NEXT_PUBLIC_SUPABASE_URL` (already configured)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already configured)

### Step 2: Understand Vercel Cron Jobs

The `vercel.json` file configures the cron job:

```json
{
  "crons": [
    {
      "path": "/api/cron/deliver-scheduled",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

- **Schedule**: `*/5 * * * *` means "every 5 minutes"
- **Path**: The API endpoint that will be called
- Vercel automatically adds the `CRON_SECRET` to requests

### Step 3: Verify Cron Job is Active

After deploying to Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** > **Cron Jobs**
3. You should see the scheduled delivery cron job listed
4. Check the **Logs** to see execution history

---

## Cron Schedule Explanation

The schedule `*/5 * * * *` follows the cron syntax:

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Current configuration**: `*/5 * * * *`
- Runs every 5 minutes
- Checks for boards scheduled up to the current time
- Delivers any boards that are due

**Alternative schedules**:
- `* * * * *` - Every minute (more frequent, higher costs)
- `*/10 * * * *` - Every 10 minutes (less frequent)
- `0 * * * *` - Every hour at minute 0 (hourly)

### Choosing the Right Interval

**Considerations**:
- **Every 5 minutes** (current): Good balance between responsiveness and cost
- **Every minute**: Most responsive but increases Vercel function executions
- **Every 10-15 minutes**: Cost-effective but less precise delivery

For most use cases, **every 5 minutes is recommended**.

---

## Local Development Testing

Since Vercel cron jobs only work in production, you need to test locally using a different approach:

### Option 1: Manual API Call

Test the endpoint directly:

```bash
# Make sure your server is running
npm run dev

# In another terminal, call the endpoint
curl -X GET http://localhost:3000/api/cron/deliver-scheduled \
  -H "Authorization: Bearer your-cron-secret-from-env"
```

### Option 2: Create a Test Script

Create `scripts/test-cron.ts`:

```typescript
const CRON_SECRET = process.env.CRON_SECRET;

async function testCron() {
  const response = await fetch('http://localhost:3000/api/cron/deliver-scheduled', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${CRON_SECRET}`
    }
  });

  const result = await response.json();
  console.log('Cron job result:', result);
}

testCron();
```

Run it:
```bash
npx ts-node scripts/test-cron.ts
```

### Option 3: Use a Cron Simulator

Install `node-cron` for local testing:

```bash
npm install node-cron @types/node-cron --save-dev
```

Create `scripts/run-cron-locally.ts`:

```typescript
import cron from 'node-cron';

// Run every minute for testing
cron.schedule('* * * * *', async () => {
  console.log('Running scheduled delivery check...');
  
  const response = await fetch('http://localhost:3000/api/cron/deliver-scheduled', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET}`
    }
  });

  const result = await response.json();
  console.log('Result:', result);
});

console.log('Cron job simulator running. Press Ctrl+C to stop.');
```

Run it while your dev server is running:
```bash
npx ts-node scripts/run-cron-locally.ts
```

---

## Testing Scheduled Delivery

### Step 1: Create a Test Board

1. Go to `/boards/create`
2. Create a new board with a recipient
3. Add recipient email
4. In the editor, go to the **Delivery** section
5. Set scheduled date to **2 minutes from now**
6. Click **Save Board**

### Step 2: Verify Database

Check that the board was saved correctly:

```sql
SELECT 
  id, 
  title, 
  status, 
  delivery_type, 
  scheduled_delivery 
FROM boards 
WHERE delivery_type = 'SCHEDULED' 
ORDER BY scheduled_delivery DESC;
```

You should see:
- `status: 'PUBLISHED'`
- `delivery_type: 'SCHEDULED'`
- `scheduled_delivery: '2024-01-15T14:30:00'` (your chosen time)

### Step 3: Wait for Delivery

- **In production**: Vercel cron will automatically deliver the board when the time comes
- **In local dev**: Manually trigger the cron endpoint using one of the methods above

### Step 4: Verify Delivery

After the scheduled time passes:

1. Check your email inbox (recipient email)
2. Check the database:
   ```sql
   SELECT id, title, status, delivery_type, scheduled_delivery 
   FROM boards 
   WHERE id = 'your-board-id';
   ```
3. Status should be changed to `'DELIVERED'`

---

## Monitoring & Logs

### Vercel Logs

1. Go to your Vercel project dashboard
2. Click on **Logs** or a specific deployment
3. Filter by **Cron Jobs** to see execution logs
4. Look for:
   - "Found X boards due for delivery"
   - "Sent X emails to recipients"
   - "Delivered X out of X scheduled boards"

### Error Handling

The cron job handles errors gracefully:
- If one board fails, others continue processing
- Errors are logged to Vercel logs
- Failed boards remain in `PUBLISHED` status and will be retried in the next run

### Common Issues

1. **No boards delivered**:
   - Check if scheduled_delivery time is in the past
   - Verify board status is 'PUBLISHED' not 'DELIVERED'
   - Check Vercel logs for errors

2. **Emails not sending**:
   - Verify RESEND_API_KEY is set in Vercel
   - Check recipient emails are valid
   - Review Resend dashboard for delivery status

3. **Unauthorized error**:
   - Ensure CRON_SECRET is set correctly in Vercel
   - Vercel automatically includes this in cron requests

---

## Production Checklist

Before going live:

- [ ] Set SUPABASE_SERVICE_ROLE_KEY in Vercel environment variables
- [ ] Set CRON_SECRET in Vercel environment variables
- [ ] Set RESEND_API_KEY in Vercel environment variables
- [ ] Verify vercel.json is committed to repository
- [ ] Deploy to Vercel
- [ ] Check Vercel Settings > Cron Jobs shows the scheduled job
- [ ] Test with a board scheduled 5-10 minutes in the future
- [ ] Monitor Vercel logs for successful execution
- [ ] Verify emails are received
- [ ] Verify board status changes to DELIVERED

---

## Security Notes

1. **Service Role Key**: 
   - Never expose this in client-side code
   - Only used in server-side API routes
   - Bypasses Row Level Security policies

2. **Cron Secret**:
   - Prevents unauthorized API calls
   - Changed if compromised
   - Vercel handles this automatically for cron jobs

3. **Rate Limiting**:
   - Consider adding rate limiting to the cron endpoint
   - Vercel cron jobs are already limited by schedule

---

## Cost Considerations

**Vercel Cron Jobs**:
- Included in Pro plan ($20/month)
- Hobby plan has limited executions
- Each cron run counts as a function invocation

**Frequency vs Cost**:
- Every 5 minutes = ~8,640 executions/month
- Every 10 minutes = ~4,320 executions/month
- Every 15 minutes = ~2,880 executions/month

**Optimization**:
- Current implementation only processes boards that are due
- No unnecessary database queries
- Efficient email sending with Promise.allSettled

---

## Alternative Approaches

If Vercel cron doesn't work for you:

1. **Supabase Edge Functions** with cron triggers
2. **GitHub Actions** with scheduled workflows
3. **External cron service** (cron-job.org, EasyCron)
4. **AWS EventBridge** or **Google Cloud Scheduler**

For most Next.js deployments on Vercel, the built-in cron feature is the simplest solution.