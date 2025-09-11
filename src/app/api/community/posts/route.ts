import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { verifyToken } from '@/lib/auth'

const postSchema = z.object({
  title: z.string().min(10, 'Tiêu đề phải có ít nhất 10 ký tự').max(150, 'Tiêu đề không quá 150 ký tự'),
  content: z.string().min(50, 'Nội dung phải có ít nhất 50 ký tự').max(5000, 'Nội dung không quá 5000 ký tự'),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().url().optional()
})

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập để đóng góp bài viết' },
        { status: 401 }
      )
    }

    const user = await verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Phiên đăng nhập không hợp lệ' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, content, tags, imageUrl } = postSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        title,
        content,
        tags: tags || [],
        imageUrl,
        status: 'pending',
        authorId: user.sub
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Bài viết đã được gửi thành công và đang chờ duyệt',
      post
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}
