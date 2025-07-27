import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envVars = {
      SMTP_SERVER: process.env.SMTP_SERVER || 'Not Set',
      SMTP_USER: process.env.SMTP_USER || 'Not Set',
      SMTP_PASS: process.env.SMTP_PASS ? 'Set' : 'Not Set',
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'Not Set',
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not Set',
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
    };

    return NextResponse.json({
      message: 'Environment variables status',
      environment: process.env.NODE_ENV,
      variables: envVars
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to check environment variables',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 