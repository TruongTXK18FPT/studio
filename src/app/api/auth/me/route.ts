import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({
      user: {
        id: session.sub,
        email: session.email,
        name: session.name,
        role: session.role || 'USER'
      }
    })
  } catch (error) {
    console.error('Get user session error:', error)
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
