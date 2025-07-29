import { NextRequest, NextResponse } from 'next/server'
import { submissions } from '../leads/route'

interface LeadFormData {
  firstName: string
  lastName: string
  email: string
  linkedin: string
  country: string
  o1Visa: boolean
  eb1aVisa: boolean
  eb2NiwVisa: boolean
  dontKnowVisa: boolean
  openInput?: string
}

// Simple in-memory rate limiting (in production, use Redis or similar)
const submissionAttempts = new Map<string, { count: number; lastAttempt: number }>()

function isRateLimited(email: string): boolean {
  const now = Date.now()
  const attempts = submissionAttempts.get(email)
  
  if (!attempts) {
    submissionAttempts.set(email, { count: 1, lastAttempt: now })
    return false
  }

  // Reset counter if more than 1 hour has passed
  if (now - attempts.lastAttempt > 60 * 60 * 1000) {
    submissionAttempts.set(email, { count: 1, lastAttempt: now })
    return false
  }

  // Allow max 5 submissions per hour
  if (attempts.count >= 5) {
    return true
  }

  attempts.count++
  attempts.lastAttempt = now
  return false
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadFormData = await request.json()

    // Check rate limiting based on email
    if (isRateLimited(body.email)) {
      return NextResponse.json(
        { error: 'Too many submission attempts from this email. Please try again later.' },
        { status: 429 }
      )
    }

    // Sanitize and validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'linkedin', 'country']
    const missingFields = requiredFields.filter(field => !body[field as keyof LeadFormData])

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedData = {
      ...body,
      firstName: sanitizeInput(body.firstName),
      lastName: sanitizeInput(body.lastName),
      email: sanitizeInput(body.email).toLowerCase(),
      linkedin: sanitizeInput(body.linkedin),
      country: sanitizeInput(body.country),
      openInput: body.openInput ? sanitizeInput(body.openInput) : undefined
    }

    // Validate email format
    if (!validateEmail(sanitizedData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate LinkedIn URL format
    if (!validateUrl(sanitizedData.linkedin)) {
      return NextResponse.json(
        { error: 'Please provide a valid LinkedIn or website URL' },
        { status: 400 }
      )
    }

    // Validate that at least one visa category is selected
    const hasVisa = sanitizedData.o1Visa || sanitizedData.eb1aVisa || sanitizedData.eb2NiwVisa || sanitizedData.dontKnowVisa
    if (!hasVisa) {
      return NextResponse.json(
        { error: 'Please select at least one visa category' },
        { status: 400 }
      )
    }

    // Validate field lengths
    if (sanitizedData.firstName.length > 50) {
      return NextResponse.json(
        { error: 'First name is too long' },
        { status: 400 }
      )
    }

    if (sanitizedData.lastName.length > 50) {
      return NextResponse.json(
        { error: 'Last name is too long' },
        { status: 400 }
      )
    }

    if (sanitizedData.openInput && sanitizedData.openInput.length > 1000) {
      return NextResponse.json(
        { error: 'Additional information is too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock successful submission
    // In a real application, you would:
    // 1. Save to database (e.g., PostgreSQL, MongoDB)
    // 2. Send email notifications (e.g., SendGrid, Mailgun)
    // 3. Integrate with CRM (e.g., Salesforce, HubSpot)
    // 4. Log the submission for analytics
    // 5. Trigger webhooks for other systems

    const submissionData = {
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      data: sanitizedData,
      status: 'submitted'
    }

    console.log('Lead submission received:', submissionData)

    // Mock email sending
    console.log(`Sending confirmation email to: ${sanitizedData.email}`)
    console.log(`Email content: Thank you ${sanitizedData.firstName} ${sanitizedData.lastName} for your submission...`)
    
    // Mock CRM integration
    console.log(`Creating lead in CRM for: ${sanitizedData.firstName} ${sanitizedData.lastName}`)
    
    // Mock database save
    console.log(`Saving lead to database with ID: ${submissionData.id}`)
    
    // Store in memory for demo purposes
    submissions.push(submissionData)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Lead submitted successfully',
        submissionId: submissionData.id,
        timestamp: submissionData.timestamp
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing lead submission:', error)
    
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
} 