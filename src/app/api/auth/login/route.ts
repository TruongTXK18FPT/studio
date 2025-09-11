import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { signToken, getSessionCookieOptions } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = loginSchema.parse(body)

    // Tìm user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    // Kiểm tra mật khẩu
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    // Tạo JWT token
    const token = await signToken({
      sub: user.id,
      email: user.email,
      name: user.name || undefined
    })

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('session', token, getSessionCookieOptions())

    return NextResponse.json({
      ok: true,
      message: 'Đăng nhập thành công'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
