import { User } from '@/lib/models/User';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection<User>('users');

    // Check if email already exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser: User = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date(),
    };

    await users.insertOne(newUser);

    return NextResponse.json({ 
      message: 'User registered successfully',
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Internal server error. Please try again.' 
    }, { status: 500 });
  }
} 