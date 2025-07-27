import nodemailer from 'nodemailer'

// Create SMTP transporter
let transporter: nodemailer.Transporter | null = null
if (process.env.SMTP_SERVER && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: 587, // or 465 for SSL
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  // Check if SMTP is configured
  if (!transporter) {
    console.log('SMTP not configured. In development, you can use this reset token:', resetToken)
    console.log('Reset URL:', `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`)
    return { id: 'dev-mode', message: 'Email would be sent in production' }
  }

  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`

  const mailOptions = {
    from: `CrystalStock AI <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Reset Your CrystalStock AI Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0ea5e9; margin: 0;">CrystalStock AI</h1>
          <p style="color: #64748b; margin: 10px 0;">Ethereal Market Intelligence</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 30px; border-radius: 12px; border: 1px solid #bae6fd;">
          <h2 style="color: #0f172a; margin: 0 0 20px 0;">Reset Your Password</h2>
          
          <p style="color: #334155; line-height: 1.6; margin-bottom: 25px;">
            You requested a password reset for your CrystalStock AI account. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: 600; 
                      display: inline-block;
                      box-shadow: 0 4px 14px 0 rgba(14, 165, 233, 0.3);">
              Reset Password
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 25px;">
            If you didn't request this password reset, you can safely ignore this email. 
            The link will expire in 1 hour for security reasons.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${resetUrl}" style="color: #0ea5e9; word-break: break-all;">${resetUrl}</a>
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            © 2024 CrystalStock AI. All rights reserved.
          </p>
        </div>
      </div>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Password reset email sent successfully:', info.messageId)
    return { id: info.messageId, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Error sending password reset email:', error)
    throw new Error('Failed to send password reset email')
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  // Check if SMTP is configured
  if (!transporter) {
    console.log('SMTP not configured. Welcome email would be sent in production.')
    return { id: 'dev-mode', message: 'Email would be sent in production' }
  }

  const mailOptions = {
    from: `CrystalStock AI <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Welcome to CrystalStock AI!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #0ea5e9; margin: 0;">CrystalStock AI</h1>
          <p style="color: #64748b; margin: 10px 0;">Ethereal Market Intelligence</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 30px; border-radius: 12px; border: 1px solid #bae6fd;">
          <h2 style="color: #0f172a; margin: 0 0 20px 0;">Welcome to CrystalStock AI!</h2>
          
          <p style="color: #334155; line-height: 1.6; margin-bottom: 25px;">
            Hello ${name},<br><br>
            Welcome to CrystalStock AI! Your account has been successfully created and you're now ready to experience ethereal market intelligence.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" 
               style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); 
                      color: white; 
                      padding: 12px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      font-weight: 600; 
                      display: inline-block;
                      box-shadow: 0 4px 14px 0 rgba(14, 165, 233, 0.3);">
              Go to Dashboard
            </a>
          </div>
          
          <p style="color: #64748b; line-height: 1.6;">
            Start exploring our advanced AI-powered stock prediction features and discover the power of crystalline market analysis.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            © 2024 CrystalStock AI. All rights reserved.
          </p>
        </div>
      </div>
    `
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Welcome email sent successfully:', info.messageId)
    return { id: info.messageId, message: 'Email sent successfully' }
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw new Error('Failed to send welcome email')
  }
} 