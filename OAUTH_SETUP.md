# OAuth Authentication Setup Guide

This guide will help you set up Google, Facebook, and LinkedIn OAuth authentication for your Cardora application.

## Prerequisites

- Supabase project created
- Access to Supabase dashboard
- Developer accounts on Google, Facebook, and LinkedIn

---

## 1. Google OAuth Setup

### Step 1: Create Google OAuth Client

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** for user type
   - Fill in app name: "Cardora"
   - Add your email as support email
   - Add authorized domains (your domain)
   - Save and continue

### Step 2: Configure OAuth Client

1. Select **Web application** as application type
2. Name it "Cardora Web Client"
3. Add **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   https://your-domain.com
   ```
4. Add **Authorized redirect URIs**:
   ```
   https://mcphhtoacpkwtgmdycho.supabase.co/auth/v1/callback
   ```
   Replace `[YOUR-SUPABASE-PROJECT-REF]` with your actual Supabase project reference

5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

### Step 3: Configure in Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** and click to enable it
5. Paste your **Client ID** and **Client Secret**
6. Click **Save**

---

## 2. Facebook OAuth Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **My Apps** > **Create App**
3. Select **Consumer** as app type
4. Fill in app details:
   - App name: "Cardora"
   - Contact email: your email
5. Click **Create App**

### Step 2: Configure Facebook Login

1. In your app dashboard, click **Add Product**
2. Find **Facebook Login** and click **Set Up**
3. Choose **Web** as platform
4. Enter your site URL: `http://localhost:3000` (for development)
5. In the left sidebar, go to **Facebook Login** > **Settings**
6. Add **Valid OAuth Redirect URIs**:
   ```
   https://mcphhtoacpkwtgmdycho.supabase.co/auth/v1/callback
   ```

### Step 3: Get App Credentials

1. Go to **Settings** > **Basic** in the left sidebar
2. Copy your **App ID** and **App Secret**
3. Add your domain to **App Domains**
4. Fill in **Privacy Policy URL** and **Terms of Service URL** (required for production)

### Step 4: Configure in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Facebook** and enable it
4. Paste your **App ID** as Client ID
5. Paste your **App Secret** as Client Secret
6. Click **Save**

### Step 5: Make App Public (For Production)

1. In Facebook App Dashboard, go to **Settings** > **Basic**
2. Switch the app from **Development** to **Live** mode
3. This requires completing the App Review process

---

## 3. LinkedIn OAuth Setup

### Step 1: Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Click **Create app**
3. Fill in app details:
   - App name: "Cardora"
   - LinkedIn Page: Choose or create a company page
   - Privacy policy URL: Your privacy policy URL
   - App logo: Upload Cardora logo
4. Click **Create app**

### Step 2: Configure OAuth Settings

1. In your app dashboard, go to the **Auth** tab
2. Add **Redirect URLs**:
   ```
   https://mcphhtoacpkwtgmdycho.supabase.co/auth/v1/callback
   ```
3. In the **Products** tab, add **Sign In with LinkedIn using OpenID Connect**
4. Wait for approval (usually instant)

### Step 3: Get App Credentials

1. In the **Auth** tab, find your credentials:
   - **Client ID**
   - **Client Secret** (click to reveal)
2. Copy both values

### Step 4: Configure in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **LinkedIn (OIDC)** and enable it
4. Paste your **Client ID** and **Client Secret**
5. Click **Save**

---

## 4. Testing OAuth Login

### Development Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/login`

3. Click on any OAuth button (Google, Facebook, or LinkedIn)

4. Complete the OAuth flow with the provider

5. You should be redirected to `/dashboard` after successful authentication

### Production Checklist

Before deploying to production:

- [ ] Update all OAuth redirect URIs to use your production domain
- [ ] Update authorized origins/domains in all providers
- [ ] Make Facebook app public (switch from Development to Live)
- [ ] Verify all privacy policy and terms of service URLs are accessible
- [ ] Test OAuth flow on production domain
- [ ] Ensure your Supabase project is on a paid plan if needed for production usage

---

## 5. Common Issues & Troubleshooting

### "Redirect URI mismatch" error

- Ensure the redirect URI in your OAuth provider settings exactly matches:
  ```
  https://mcphhtoacpkwtgmdycho.supabase.co/auth/v1/callback
  ```
- No trailing slashes
- Use HTTPS, not HTTP (except localhost)

### Facebook login shows "App Not Setup"

- Your Facebook app is still in Development mode
- Add test users in Facebook App Dashboard > Roles > Test Users
- Or make the app public by switching to Live mode

### LinkedIn login not working

- Ensure "Sign In with LinkedIn using OpenID Connect" product is added and approved
- Verify redirect URL is correctly configured
- Check that Client ID and Secret are from the same app

### User data not showing up

- OAuth providers return different user metadata
- Check Supabase Auth logs: **Authentication** > **Logs**
- User metadata is stored in `user.user_metadata` object

---

## 6. Finding Your Supabase Project Reference

Your Supabase project reference is in your project URL:

```
https://abcdefghijklmnop.supabase.co
         ^^^^^^^^^^^^^^^^
         This is your project ref
```

You can also find it in:
- **Project Settings** > **General** > **Reference ID**
- Your `NEXT_PUBLIC_SUPABASE_URL` environment variable

---

## 7. Environment Variables

Make sure your `.env.local` file contains:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

These are already set up if you've configured Supabase earlier.

---

## 8. Security Best Practices

1. **Never commit OAuth secrets to version control**
   - All secrets are stored in Supabase dashboard
   - No need to add them to your `.env.local`

2. **Use HTTPS in production**
   - OAuth providers require HTTPS for security
   - Use Vercel/Netlify for automatic HTTPS

3. **Validate redirect URIs**
   - Only add trusted domains to redirect URI lists
   - Avoid using wildcards

4. **Review OAuth scopes**
   - Only request necessary user information
   - Default scopes (email, profile) are usually sufficient

---

## Need Help?

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)
- [LinkedIn OAuth Documentation](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2)