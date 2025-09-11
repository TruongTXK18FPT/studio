import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    
    // Xóa session cookie
    cookieStore.set('session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    })

    return NextResponse.json({
      ok: true,
      message: 'Đăng xuất thành công'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đăng xuất' },
      { status: 500 }
    )
  }
}
