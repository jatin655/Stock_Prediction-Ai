import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection('users');

    // Find user with the reset token
    const user = await users.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password and clear reset token
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
        },
        $unset: {
          resetToken: "",
          resetTokenExpiry: ""
        }
      }
    );

    console.log('Password reset successful for user:', user.email);

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 