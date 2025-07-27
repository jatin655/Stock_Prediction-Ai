import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log('=== Simple SMTP Test ===');
    
    // Check environment variables
    const username = process.env.MAILGUN_SMTP_USERNAME;
    const password = process.env.MAILGUN_SMTP_PASSWORD;
    
    console.log('Username exists:', !!username);
    console.log('Password exists:', !!password);
    console.log('Username:', username);
    
    if (!username || !password) {
      return NextResponse.json({
        error: 'Missing credentials',
        username: !!username,
        password: !!password
      }, { status: 400 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false,
      auth: {
        user: username,
        pass: password,
      },
    });

    // Verify connection
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified!');

    // Try to send a simple email
    const mailOptions = {
      from: `Test <${username}>`,
      to: 'sachdevajatin906@gmail.com',
      subject: 'Simple SMTP Test',
      text: 'This is a simple test email.',
    };

    console.log('Sending test email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
    console.log('Message ID:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'SMTP test successful!',
      messageId: result.messageId,
      from: mailOptions.from,
      to: mailOptions.to
    });

  } catch (error: any) {
    console.error('SMTP test error:', error);
    
    return NextResponse.json({
      error: 'SMTP test failed',
      details: error.message,
      errorType: error.name,
      code: error.code
    }, { status: 500 });
  }
} 