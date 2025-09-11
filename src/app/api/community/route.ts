import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được trống'),
  content: z.string().min(1, 'Nội dung không được trống'),
  tags: z.array(z.string()).optional(),
  imageUrl: z.string().optional()
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập để đăng bài' },
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
        authorId: session.sub,
        status: 'pending' // Mặc định là pending, admin sẽ duyệt sau
      },
      include: {
        author: {
          select: {
            email: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      ok: true,
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        tags: post.tags,
        imageUrl: post.imageUrl,
        status: post.status,
        createdAt: post.createdAt,
        author: post.author
      }
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Community post error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra, vui lòng thử lại' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            email: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      posts: posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        tags: post.tags,
        imageUrl: post.imageUrl,
        status: post.status,
        createdAt: post.createdAt,
        author: post.author
      }))
    })
  } catch (error) {
    console.error('Get community posts error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi tải bài viết' },
      { status: 500 }
    )
  }
}
