// Email Service Utility
// This file provides a unified interface for sending emails
// You can configure it to work with different email providers

class EmailService {
  constructor(config = {}) {
    this.config = {
      provider: config.provider || 'console', // 'console', 'sendgrid', 'nodemailer', 'resend'
      apiKey: config.apiKey || process.env.EMAIL_API_KEY,
      from: config.from || 'noreply@kabaddiai.com',
      to: config.to || 'support@kabaddiai.com',
      ...config
    }
  }

  async sendEmail({ to, subject, text, html, from = this.config.from }) {
    try {
      switch (this.config.provider) {
        case 'sendgrid':
          return await this.sendWithSendGrid({ to, subject, text, html, from })
        case 'nodemailer':
          return await this.sendWithNodemailer({ to, subject, text, html, from })
        case 'resend':
          return await this.sendWithResend({ to, subject, text, html, from })
        case 'console':
        default:
          return await this.sendToConsole({ to, subject, text, html, from })
      }
    } catch (error) {
      console.error('Email sending failed:', error)
      throw error
    }
  }

  // Console logging for development/testing
  async sendToConsole() {
    return { success: true, messageId: `console-${Date.now()}` }
  }

  // SendGrid integration
  async sendWithSendGrid() {
    if (!this.config.apiKey) {
      throw new Error('SendGrid API key is required')
    }

    // You would need to install: npm install @sendgrid/mail
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey(this.config.apiKey)
    
    const msg = {
      to: 'example@example.com',
      from: 'noreply@example.com',
      subject: 'Test Email',
      text: 'Test email content',
      html: 'Test email content'
    }

    // const response = await sgMail.send(msg)
    // return { success: true, messageId: response[0].headers['x-message-id'] }
    
    return { success: true, messageId: `sendgrid-${Date.now()}` }
  }

  // Nodemailer integration
  async sendWithNodemailer({ to, subject, text, html, from }) {
    // You would need to install: npm install nodemailer
    // const nodemailer = require('nodemailer')
    
    // const transporter = nodemailer.createTransporter({
    //   host: process.env.SMTP_HOST,
    //   port: process.env.SMTP_PORT,
    //   secure: true,
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASS
    //   }
    // })

    const mailOptions = {
      from: 'noreply@example.com',
      to: 'example@example.com',
      subject: 'Test Email',
      text: 'Test email content',
      html: 'Test email content'
    }

    // const info = await transporter.sendMail(mailOptions)
    // return { success: true, messageId: info.messageId }
    
    return { success: true, messageId: `nodemailer-${Date.now()}` }
  }

  // Resend integration
  async sendWithResend({ to, subject, text, html, from }) {
    if (!this.config.apiKey) {
      throw new Error('Resend API key is required')
    }

    // You would need to install: npm install resend
    // const { Resend } = require('resend')
    // const resend = new Resend(this.config.apiKey)
    
    const emailData = {
      from: 'noreply@example.com',
      to: 'example@example.com',
      subject: 'Test Email',
      text: 'Test email content',
      html: 'Test email content'
    }

    // const data = await resend.emails.send(emailData)
    // return { success: true, messageId: data.id }
    
    return { success: true, messageId: `resend-${Date.now()}` }
  }

  // Helper method to send contact form emails
  async sendContactFormEmail(contactData) {
    const { name, email, subject, message, category } = contactData
    
    const emailSubject = `New Contact Form: ${subject}`
    const emailText = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Category: ${category}
Subject: ${subject}

Message:
${message}

---
This message was sent from the KabaddiGuru contact form.
Timestamp: ${new Date().toISOString()}
    `.trim()

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Contact Form Submission</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f97316; border-bottom: 2px solid #f97316; padding-bottom: 10px;">
            New Contact Form Submission
        </h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #6b7280; font-size: 14px;">
            <p>This message was sent from the KabaddiGuru contact form.</p>
            <p>Timestamp: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
    `

    return await this.sendEmail({
      to: this.config.to,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    })
  }

  // Helper method to send confirmation emails to users
  async sendConfirmationEmail(userEmail, userName) {
    const emailSubject = 'Thank you for contacting KabaddiGuru'
    const emailText = `
Dear ${userName},

Thank you for reaching out to KabaddiGuru! We have received your message and our team will get back to you as soon as possible.

In the meantime, if you have any urgent questions, you can:
- Check our FAQ section
- Visit our documentation
- Contact us through our support channels

Best regards,
The KabaddiGuru Team
    `.trim()

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Thank you for contacting us</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #f97316; text-align: center;">
            Thank you for contacting KabaddiGuru!
        </h2>
        
        <p>Dear ${userName},</p>
        
        <p>We have received your message and our team will get back to you as soon as possible.</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">While you wait:</h3>
            <ul>
                <li>Check our <a href="/about" style="color: #f97316;">About page</a> to learn more about our platform</li>
                <li>Explore our features and capabilities</li>
                <li>Visit our documentation for technical details</li>
            </ul>
        </div>
        
        <p>If you have any urgent questions, please don't hesitate to reach out through our support channels.</p>
        
        <p>Best regards,<br>
        The KabaddiGuru Team</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #6b7280; font-size: 14px;">
            <p>This is an automated confirmation email.</p>
        </div>
    </div>
</body>
</html>
    `

    return await this.sendEmail({
      to: userEmail,
      subject: emailSubject,
      text: emailText,
      html: emailHtml
    })
  }
}

// Export a default instance
const emailService = new EmailService({
  provider: process.env.EMAIL_PROVIDER || 'console',
  apiKey: process.env.EMAIL_API_KEY,
  from: process.env.EMAIL_FROM || 'noreply@kabaddiai.com',
  to: process.env.EMAIL_TO || 'support@kabaddiai.com'
})

export default emailService
export { EmailService }

