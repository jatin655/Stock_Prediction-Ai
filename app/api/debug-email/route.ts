import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  try {
    console.log('=== COMPREHENSIVE EMAIL DEBUG ===');
    
    // Check environment variables
    const username = process.env.SMTP_USER;
    const password = process.env.SMTP_PASS;
    const server = process.env.SMTP_SERVER || 'smtp.mailgun.org';
    
    console.log('Environment Check:');
    console.log('- SMTP Server:', server);
    console.log('- Username exists:', !!username);
    console.log('- Password exists:', !!password);
    console.log('- Username value:', username);
    console.log('- Password length:', password?.length || 0);
    
    if (!username || !password) {
      return NextResponse.json({
        error: 'Missing credentials',
        server: server,
        username: !!username,
        password: !!password,
        username_value: username || 'Not Set',
        password_length: password?.length || 0
      }, { status: 400 });
    }

    // Test 1: Create transporter
    console.log('\n=== Test 1: Creating Transporter ===');
    let transporter: nodemailer.Transporter;
    try {
      transporter = nodemailer.createTransport({
        host: server,
        port: 587,
        secure: false,
        auth: {
          user: username,
          pass: password,
        },
        debug: true,
        logger: true,
      });
      console.log('✅ Transporter created successfully');
    } catch (error: any) {
      console.error('❌ Failed to create transporter:', error);
      return NextResponse.json({
        error: 'Failed to create transporter',
        details: error.message,
        step: 'transporter_creation'
      }, { status: 500 });
    }

    // Test 2: Verify connection
    console.log('\n=== Test 2: Verifying Connection ===');
    try {
      await transporter.verify();
      console.log('✅ SMTP connection verified');
    } catch (error: any) {
      console.error('❌ SMTP verification failed:', error);
      return NextResponse.json({
        error: 'SMTP verification failed',
        details: error.message,
        step: 'connection_verification'
      }, { status: 500 });
    }

    // Test 3: Send test email
    console.log('\n=== Test 3: Sending Test Email ===');
    const mailOptions = {
      from: 'sachdevajatin45@gmail.com',
      to: 'sachdevajatin45@gmail.com',
      subject: 'Email Debug Test - ' + new Date().toISOString(),
      text: 'This is a debug test email to verify SMTP functionality.',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Email Debug Test</h2>
          <p>This is a debug test email to verify SMTP functionality.</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>From:</strong> ${username}</p>
          <p><strong>To:</strong> sachdevajatin906@gmail.com</p>
        </div>
      `
    };

    console.log('Mail options:');
    console.log('- From:', mailOptions.from);
    console.log('- To:', mailOptions.to);
    console.log('- Subject:', mailOptions.subject);

    try {
      console.log('=== STARTING EMAIL TRANSMISSION ===');
      const result = await transporter.sendMail(mailOptions);
      
      console.log('=== MAILGUN SMTP RESPONSE DETAILS ===');
      console.log('✅ Email sent successfully!');
      console.log('- Message ID:', result.messageId);
      console.log('- Response:', result.response);
      console.log('- Accepted recipients:', result.accepted);
      console.log('- Rejected recipients:', result.rejected);
      console.log('- Pending recipients:', result.pending);
      console.log('- Envelope:', result.envelope);
      console.log('- Raw response:', result.raw);
      console.log('- Full response object:', JSON.stringify(result, null, 2));
      console.log('=== END MAILGUN RESPONSE ===');
      
      return NextResponse.json({
        success: true,
        message: 'Email debug test successful!',
        messageId: result.messageId,
        response: result.response,
        accepted: result.accepted,
        rejected: result.rejected,
        pending: result.pending,
        envelope: result.envelope,
        mailOptions: {
          from: mailOptions.from,
          to: mailOptions.to,
          subject: mailOptions.subject
        },
        environment: {
          server: server,
          username: username,
          password_length: password.length
        }
      });
    } catch (error: any) {
      console.error('=== EMAIL SENDING FAILED ===');
      console.error('❌ Email sending failed:', error);
      console.error('- Error type:', error.constructor.name);
      console.error('- Error message:', error.message);
      console.error('- Error code:', error.code);
      console.error('- Error command:', error.command);
      console.error('- Error responseCode:', error.responseCode);
      console.error('- Error responseLines:', error.responseLines);
      console.error('- Full error object:', JSON.stringify(error, null, 2));
      
      return NextResponse.json({
        error: 'Email sending failed',
        details: error.message,
        errorType: error.constructor.name,
        errorCode: error.code,
        errorCommand: error.command,
        errorResponseCode: error.responseCode,
        step: 'email_sending'
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('=== GENERAL DEBUG ERROR ===');
    console.error('Error:', error);
    
    return NextResponse.json({
      error: 'General debug error',
      details: error.message,
      errorType: error.constructor.name
    }, { status: 500 });
  }
} 