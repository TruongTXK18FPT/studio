import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      // Clear any invalid session cookie
      const cookieStore = await cookies()
      cookieStore.set('session', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 0
      })
      
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
