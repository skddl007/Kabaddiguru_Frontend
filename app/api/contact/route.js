import { NextResponse } from 'next/server'
import emailService from '@/lib/email-service'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, category } = body

    // Validate required fields
    if (!name || !email || !subject || !message || !category) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send email to support team
    const supportEmailResult = await emailService.sendContactFormEmail({
      name,
      email,
      subject,
      message,
      category
    })

    // Send confirmation email to user
    const confirmationEmailResult = await emailService.sendConfirmationEmail(email, name)


    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        timestamp: new Date().toISOString(),
        supportEmailId: supportEmailResult.messageId,
        confirmationEmailId: confirmationEmailResult.messageId
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to send message. Please try again later.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// Optional: Add GET method for testing
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Contact API endpoint is working',
      timestamp: new Date().toISOString()
    },
    { status: 200 }
  )
}
