import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { signToken, getSessionCookieOptions } from '@/lib/auth'

const adminSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

const ADMIN_CREDENTIALS = {
  email: 'admin@hcm.com',
  password: 'admin123'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = adminSchema.parse(body)

    // Check admin credentials
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    // Create JWT token using the auth lib
    const token = await signToken({ 
      sub: 'admin',
      email,
      role: 'admin'
    })

    const response = NextResponse.json({
      message: 'Đăng nhập admin thành công',
      user: { email, role: 'admin' }
    })

    // Set session cookie consistently
    response.cookies.set('session', token, getSessionCookieOptions())

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
