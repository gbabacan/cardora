# Supabase Authentication Setup

To enable authentication, follow these steps in your Supabase Dashboard:

## 1. Enable Email Authentication

1. Go to https://supabase.com/dashboard
2. Select your project (mcphhtoacpkwtgmdycho)
3. In the left sidebar, click on "Authentication" > "Providers"
4. Make sure "Email" provider is enabled (it should be by default)
5. Under "Email" settings:
   - ✅ Enable Email provider
   - ✅ Confirm email: ON (users need to verify their email)
   - You can optionally turn OFF email confirmation for development

## 2. Configure Email Templates (Optional)

1. In "Authentication" > "Email Templates"
2. Customize the confirmation email, magic link, etc. if desired

## 3. Configure Site URL

1. Go to "Authentication" > "URL Configuration"
2. Set Site URL to: `http://localhost:3000`
3. Add Redirect URLs:
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/reset-password`

## 4. Test Authentication

1. Start your dev server: `npm run dev`
2. Go to http://localhost:3000/login
3. Click "SIGN UP" and create an account
4. Check your email for verification (if email confirmation is enabled)
5. After verification (or if disabled), you should be able to sign in

## 5. Disable Email Confirmation for Development (Optional)

If you want to test without email verification during development:

1. Go to "Authentication" > "Providers" > "Email"
2. Toggle OFF "Confirm email"
3. Now users can sign in immediately after signup

## Notes

- In production, always enable email confirmation
- You can add OAuth providers (Google, Facebook, etc.) later in the same "Providers" section
- The `auth.users` table is automatically created by Supabase
