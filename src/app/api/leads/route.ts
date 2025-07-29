import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for demo purposes
// In production, this would be a database
let submissions: any[] = []

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would:
    // 1. Check authentication/authorization
    // 2. Query the database
    // 3. Apply pagination and filtering
    
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    // Mock database query with pagination
    const paginatedSubmissions = submissions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(offset, offset + limit)
    
    return NextResponse.json({
      submissions: paginatedSubmissions,
      total: submissions.length,
      limit,
      offset
    })
    
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Export the submissions array so the submit-lead route can access it
export { submissions } 