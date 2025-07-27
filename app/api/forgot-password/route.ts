import { sendPasswordResetEmail } from '@/lib/email';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    // Check if user exists
    const user = await users.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json(
        { message: 'If an account with that email exists, a password reset link has been sent.' },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Store reset token in database
    await users.updateOne(
      { email },
      {
        $set: {
          resetToken,
          resetTokenExpiry,
        }
      }
    );

    // Send password reset email
    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json(
      { message: 'If an account with that email exists, a password reset link has been sent.' },
      { status: 200 }
    );
  } catch (error) {
    // Print the error to your terminal for debugging
    console.error('Error in forgot-password API:', error);

    // Return the error message to the frontend (for local debugging only)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 