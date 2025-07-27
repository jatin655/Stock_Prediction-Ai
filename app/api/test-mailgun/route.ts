import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log('=== SMTP Environment Check ===');
    console.log('MAILGUN_SMTP_USERNAME exists:', !!process.env.MAILGUN_SMTP_USERNAME);
    console.log('MAILGUN_SMTP_PASSWORD exists:', !!process.env.MAILGUN_SMTP_PASSWORD);
    
    if (process.env.MAILGUN_SMTP_USERNAME) {
      console.log('SMTP Username:', process.env.MAILGUN_SMTP_USERNAME);
    }

    // Test SMTP initialization
    if (!process.env.MAILGUN_SMTP_USERNAME || !process.env.MAILGUN_SMTP_PASSWORD) {
      return NextResponse.json({
        error: 'Missing SMTP environment variables',
        MAILGUN_SMTP_USERNAME: !!process.env.MAILGUN_SMTP_USERNAME,
        MAILGUN_SMTP_PASSWORD: !!process.env.MAILGUN_SMTP_PASSWORD,
        MAILGUN_SMTP_USERNAME_value: process.env.MAILGUN_SMTP_USERNAME || 'Not Set',
        MAILGUN_SMTP_PASSWORD_value: process.env.MAILGUN_SMTP_PASSWORD ? 'Set' : 'Not Set'
      }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILGUN_SMTP_USERNAME,
        pass: process.env.MAILGUN_SMTP_PASSWORD,
      },
    });

    // Test email sending
    const testEmailData = {
      from: `Test <${process.env.MAILGUN_SMTP_USERNAME}>`,
      to: 'sachdevajatin906@gmail.com', // Change this to your email for testing
      subject: 'SMTP Test Email - MERN Tutorial',
      text: 'This is a test email to verify SMTP configuration is working.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>SMTP Test Email</h2>
          <p>This is a test email to verify that SMTP is properly configured.</p>
          <p>If you receive this email, the email service is working correctly!</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        </div>
      `
    };

    console.log('Attempting to send test email via SMTP...');
    console.log('From:', testEmailData.from);
    console.log('To:', testEmailData.to);
    console.log('Subject:', testEmailData.subject);
    
    const result = await transporter.sendMail(testEmailData);

    console.log('Email sent successfully via SMTP!');
    console.log('Message ID:', result.messageId);

    return NextResponse.json({
      success: true,
      message: 'SMTP is properly configured and test email sent!',
      messageId: result.messageId,
      environment: {
        hasUsername: !!process.env.MAILGUN_SMTP_USERNAME,
        hasPassword: !!process.env.MAILGUN_SMTP_PASSWORD,
        username: process.env.MAILGUN_SMTP_USERNAME
      },
      emailDetails: {
        from: testEmailData.from,
        to: testEmailData.to,
        subject: testEmailData.subject
      }
    });

  } catch (error: any) {
    console.error('SMTP test error:', error);
    
    return NextResponse.json({
      error: 'SMTP test failed',
      details: error.message,
      errorType: error.name,
      environment: {
        hasUsername: !!process.env.MAILGUN_SMTP_USERNAME,
        hasPassword: !!process.env.MAILGUN_SMTP_PASSWORD,
        username: process.env.MAILGUN_SMTP_USERNAME
      }
    }, { status: 500 });
  }
} 