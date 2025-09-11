import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Chưa đăng nhập' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      email: session.email,
      name: session.name
    })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
