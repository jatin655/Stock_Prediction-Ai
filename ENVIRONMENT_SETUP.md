# Environment Variables Setup

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Mailgun Email Service
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Mailgun Setup Instructions

### 1. Create Mailgun Account
- Go to [mailgun.com](https://mailgun.com)
- Sign up for a free account
- Verify your email

### 2. Get Your API Key
- Go to Mailgun Dashboard
- Navigate to Settings → API Keys
- Copy your Private API Key

### 3. Get Your Domain
- In Mailgun Dashboard, go to Sending → Domains
- You'll see a sandbox domain (e.g., `sandbox123456789.mailgun.org`)
- Or add your own domain if you have one

### 4. Set Environment Variables
- `MAILGUN_API_KEY`: Your private API key from step 2
- `MAILGUN_DOMAIN`: Your domain from step 3

## Vercel Deployment

Add these environment variables in your Vercel dashboard:
1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add each variable from above
4. Redeploy your application

## Testing Email

After setup, test the password reset functionality:
1. Register a user with any email
2. Try the "Forgot Password" feature
3. Check your email (and spam folder)
4. Check Vercel logs for any errors 