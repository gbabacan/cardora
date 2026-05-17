# Scheduled Delivery Implementation Summary

## What Was Implemented

The scheduled delivery system allows users to schedule board deliveries for a future date and time. When the scheduled time arrives, the system automatically:

1. Sends delivery emails to all recipients
2. Sends notification emails to contributors (if enabled)
3. Updates the board status to DELIVERED

---

## Files Created/Modified

### New Files Created:

1. **`/app/api/cron/deliver-scheduled/route.ts`**
   - API endpoint that checks for and delivers scheduled boards
   - Called by Vercel cron job every 5 minutes
   - Processes all boards with `delivery_type='SCHEDULED'` that are past their scheduled time

2. **`vercel.json`**
   - Configures Vercel cron job
   - Runs every 5 minutes: `*/5 * * * *`
   - Automatically authenticated by Vercel

3. **`SCHEDULED_DELIVERY_SETUP.md`**
   - Complete setup guide for scheduled deliveries
   - Environment variables configuration
   - Testing instructions
   - Troubleshooting tips

4. **`SCHEDULED_DELIVERY_SUMMARY.md`** (this file)
   - Quick reference for the implementation

### Modified Files:

1. **`.env.example`**
   - Added `SUPABASE_SERVICE_ROLE_KEY` (required for admin operations)
   - Added `CRON_SECRET` (for securing the cron endpoint)
   - Cleaned up unused variables

---

## How It Works

### User Flow:

1. User creates a board and goes to the editor
2. In the Delivery section, user selects "Schedule for later"
3. User picks a date and time
4. User clicks "Save Board"
5. Board is saved with:
   - `status: 'PUBLISHED'`
   - `delivery_type: 'SCHEDULED'`
   - `scheduled_delivery: '2024-12-25T09:00:00'`

### Backend Flow:

1. **Every 5 minutes**, Vercel triggers `/api/cron/deliver-scheduled`
2. The endpoint:
   - Queries for boards where `delivery_type='SCHEDULED'` AND `scheduled_delivery <= NOW()`
   - For each board:
     - Sends delivery emails to recipients
     - Sends notification emails to contributors (if enabled)
     - Updates board status to `DELIVERED`
   - Returns a summary of delivered boards

---

## Environment Variables Required

Add these to your `.env.local` file:

```env
# Supabase Service Role Key (for admin operations that bypass RLS)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase

# Cron Job Secret (for securing the cron endpoint)
CRON_SECRET=your-random-secret-string

# Already configured
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_SUPABASE_URL=https://mcphhtoacpkwtgmdycho.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Where to Get These:

**SUPABASE_SERVICE_ROLE_KEY**:
- Go to [Supabase Dashboard](https://app.supabase.com/)
- Select your project
- **Settings** > **API**
- Copy the **service_role** key

**CRON_SECRET**:
- Generate a random string:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

---

## Deployment Steps

### 1. Add Environment Variables to Vercel

In your Vercel project dashboard:

1. Go to **Settings** > **Environment Variables**
2. Add:
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`
   - `RESEND_API_KEY` (if not already added)
   - `NEXT_PUBLIC_SUPABASE_URL` (if not already added)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if not already added)

### 2. Deploy to Vercel

```bash
git add .
git commit -m "Add scheduled delivery functionality"
git push
```

Vercel will automatically:
- Deploy your app
- Set up the cron job from `vercel.json`
- Start running it every 5 minutes

### 3. Verify Cron Job

After deployment:
1. Go to Vercel project dashboard
2. **Settings** > **Cron Jobs**
3. You should see: `/api/cron/deliver-scheduled` scheduled for `*/5 * * * *`

---

## Testing

### Quick Test (Production):

1. Create a board and add a recipient with email
2. In Delivery section, select "Schedule for later"
3. Set the date/time to **7 minutes from now**
4. Click "Save Board"
5. Wait for the scheduled time
6. Within 5 minutes after the scheduled time, emails should be sent
7. Check your email inbox
8. Verify board status changed to DELIVERED in database

### Local Testing:

Since Vercel cron only works in production, test locally by calling the endpoint manually:

```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Call the cron endpoint
curl -X GET http://localhost:3000/api/cron/deliver-scheduled \
  -H "Authorization: Bearer your-cron-secret"
```

---

## Database Schema

The scheduled delivery uses these fields in the `boards` table:

```sql
delivery_type VARCHAR(20) -- 'ON_DEMAND' or 'SCHEDULED'
scheduled_delivery TIMESTAMPTZ -- '2024-12-25T09:00:00Z'
status VARCHAR(20) -- 'CREATED', 'PUBLISHED', or 'DELIVERED'
```

**Query to check scheduled boards**:
```sql
SELECT 
  id, 
  title, 
  status, 
  delivery_type, 
  scheduled_delivery,
  created_at
FROM boards 
WHERE delivery_type = 'SCHEDULED' 
  AND status = 'PUBLISHED'
ORDER BY scheduled_delivery ASC;
```

---

## Monitoring

### Check Vercel Logs:

1. Go to Vercel project dashboard
2. Click **Logs**
3. Filter by "Cron Jobs"
4. Look for log messages:
   - "Found X boards due for delivery"
   - "Processing board: [id] - [title]"
   - "Sent X emails to recipients"
   - "Delivered X out of X scheduled boards"

### Check Resend Dashboard:

1. Go to [Resend Dashboard](https://resend.com/emails)
2. View sent emails
3. Check delivery status

---

## Cron Schedule Options

Current: **Every 5 minutes** (`*/5 * * * *`)

Alternative schedules:
- `* * * * *` - Every minute (more responsive, higher cost)
- `*/10 * * * *` - Every 10 minutes (good for most cases)
- `*/15 * * * *` - Every 15 minutes (cost-effective)
- `0 * * * *` - Every hour (less precise)

To change, update `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/deliver-scheduled",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

---

## Important Notes

1. **Service Role Key Security**:
   - Never commit to version control
   - Never expose in client-side code
   - Only use in server-side API routes
   - This key bypasses Row Level Security

2. **Delivery Precision**:
   - With 5-minute cron, delivery happens within 5 minutes of scheduled time
   - For example, if scheduled for 2:00 PM, it will deliver between 2:00 PM and 2:05 PM
   - More frequent cron = more precise delivery (but higher costs)

3. **Error Handling**:
   - If one board fails, others continue processing
   - Failed boards stay in PUBLISHED status and retry on next cron run
   - All errors are logged to Vercel logs

4. **Email Limits**:
   - Resend has rate limits (check your plan)
   - The system sends emails in parallel for efficiency
   - Monitor Resend usage to avoid hitting limits

---

## Troubleshooting

### Boards not being delivered?

1. Check board status in database (should be PUBLISHED, not DELIVERED)
2. Verify `scheduled_delivery` time is in the past
3. Check Vercel cron logs for errors
4. Verify environment variables are set in Vercel

### Emails not sending?

1. Check RESEND_API_KEY is set in Vercel
2. Verify recipient emails are valid
3. Check Resend dashboard for delivery failures
4. Review Vercel logs for email errors

### "Unauthorized" error in logs?

1. Ensure CRON_SECRET is set in Vercel environment variables
2. Vercel automatically authenticates cron jobs

---

## Future Enhancements

Potential improvements:
- Dashboard to view upcoming scheduled deliveries
- Ability to edit/cancel scheduled deliveries
- Time zone support for scheduling
- Reminder emails before delivery
- Delivery reports/analytics

---

## Questions?

Refer to:
- `SCHEDULED_DELIVERY_SETUP.md` for detailed setup instructions
- Vercel Cron documentation: https://vercel.com/docs/cron-jobs
- Supabase Admin API: https://supabase.com/docs/reference/javascript/admin-api