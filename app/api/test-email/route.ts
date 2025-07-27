import { sendPasswordResetEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Send a test email
    const testUrl = 'https://your-app.vercel.app/test-reset';
    await sendPasswordResetEmail(email, testUrl);

    return NextResponse.json({ 
      message: 'Test email sent successfully',
      email: email,
      note: 'Check your inbox and spam folder'
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 