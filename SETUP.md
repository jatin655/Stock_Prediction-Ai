# CrystalStock AI - Authentication Setup

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/crystalstock

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Mailgun)
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain

# Admin
ADMIN_ALERT_EMAIL=admin@crystalstock.ai
```

## Setup Instructions

### 1. MongoDB Setup
- Install MongoDB locally or use MongoDB Atlas
- Create a database named `crystalstock`
- The users collection will be created automatically

### 2. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client IDs
5. Set Application Type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the Client ID and Client Secret to your `.env.local`

### 3. Mailgun Setup
1. Sign up for a Mailgun account
2. Create a domain or use the sandbox domain
3. Get your API key from the Mailgun dashboard
4. Add your domain and API key to `.env.local`

### 4. NextAuth Secret
Generate a secure random string for NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Features Implemented

### ✅ Authentication System
- **User Registration**: Email/password and Google OAuth
- **User Login**: Email/password and Google OAuth
- **Password Reset**: Email-based password reset with Mailgun
- **Session Management**: NextAuth.js with JWT strategy
- **Database Integration**: MongoDB with user collection

### ✅ Security Features
- Password hashing with bcryptjs
- JWT token management
- Secure password reset tokens
- Input validation and sanitization
- CSRF protection via NextAuth

### ✅ Email Integration
- Beautiful HTML email templates
- Password reset emails via Mailgun
- Welcome emails for new users
- Professional CrystalStock AI branding

### ✅ UI/UX Features
- SplitText animations on all pages
- Responsive design for mobile/desktop
- Loading states and error handling
- Password strength indicators
- Social login buttons
- Progress indicators for multi-step processes

## API Endpoints

- `POST /api/register` - User registration
- `POST /api/forgot-password` - Send password reset email
- `POST /api/reset-password` - Reset password with token
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

## Database Schema

```typescript
interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  createdAt: Date
  resetToken?: string
  resetTokenExpiry?: Date
  googleId?: string
  image?: string
}
```

## Usage

1. Start the development server: `npm run dev`
2. Visit `http://localhost:3000`
3. Navigate to `/register` to create an account
4. Navigate to `/login` to sign in
5. Use `/reset-password` to reset your password

## Testing

You can test the authentication system with:
- Email/password registration and login
- Google OAuth sign-in
- Password reset functionality
- Session persistence across page refreshes

## Production Deployment

1. Set up MongoDB Atlas or self-hosted MongoDB
2. Configure Google OAuth for your domain
3. Set up Mailgun with your domain
4. Update environment variables for production
5. Deploy to your preferred hosting platform

## Security Notes

- All passwords are hashed using bcryptjs
- Reset tokens expire after 1 hour
- Email addresses are validated and normalized
- Session tokens are JWT-based with secure configuration
- CSRF protection is enabled via NextAuth 