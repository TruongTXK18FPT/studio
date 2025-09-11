import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  name: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = registerSchema.parse(body)

    // Kiểm tra email đã tồn tại
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 409 }
      )
    }

    // Hash mật khẩu
    const passwordHash = await bcrypt.hash(password, 12)

    // Tạo user mới
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name
      }
    })

    return NextResponse.json(
      { ok: true, message: 'Đăng ký thành công' },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Register error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
