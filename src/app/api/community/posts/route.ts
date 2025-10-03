import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import crypto from 'crypto'

const postSchema = z.object({
  title: z.string().min(10, 'Tiêu đề phải có ít nhất 10 ký tự').max(150, 'Tiêu đề không quá 150 ký tự'),
  content: z.string().min(50, 'Nội dung phải có ít nhất 50 ký tự').max(5000, 'Nội dung không quá 5000 ký tự'),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  sourceLink: z.string().url().optional().or(z.literal('')),
  imageBase64: z.string().optional(), // data URL or base64 string
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, tags, author, sourceLink, imageBase64 } = postSchema.parse(body)

    // Try to find or create an anonymous user
    let authorId: string
    
    try {
      let anonymousUser = await prisma.user.findUnique({
        where: { email: 'anonymous@hcm202.com' }
      })
      
      anonymousUser ??= await prisma.user.create({
        data: {
          email: 'anonymous@hcm202.com',
          name: 'Người dùng ẩn danh',
          passwordHash: 'anonymous' // This won't be used for login
        }
      })
      
      authorId = anonymousUser.id
    } catch (dbError) {
      console.error('Error with anonymous user:', dbError)
      // Fallback to a default UUID
      authorId = 'clm0000000000000000000000'
    }

    // Optional upload to Cloudinary if image provided
    let imageUrl: string | undefined
    if (imageBase64) {
      try {
        const CLOUD = {
          cloud_name: 'dbynhb8va',
          api_key: '656858295268228',
          api_secret: 'y1rUB4xxJ-9clwvxIjxmAZv0ULs'
        }
        const timestamp = Math.floor(Date.now() / 1000)
        const folder = 'community_posts'
        const toSign = `folder=${folder}&timestamp=${timestamp}${CLOUD.api_secret}`
        const signature = crypto.createHash('sha1').update(toSign).digest('hex')

        const form = new FormData()
        form.append('file', imageBase64)
        form.append('api_key', CLOUD.api_key)
        form.append('timestamp', String(timestamp))
        form.append('folder', folder)
        form.append('signature', signature)

        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD.cloud_name}/image/upload`, {
          method: 'POST',
          body: form as any
        })
        const json = await res.json()
        if (json.secure_url) imageUrl = json.secure_url as string
      } catch (e) {
        console.error('Cloudinary upload failed:', e)
      }
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        tags: tags || [],
        status: 'pending',
        authorId,
        imageUrl
      }
    })

    return NextResponse.json({
      message: 'Bài viết đã được gửi thành công và đang chờ duyệt',
      post: {
        id: post.id,
        title: post.title,
        status: post.status,
        createdAt: post.createdAt
      }
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

// Get approved posts for community page
export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'approved' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        createdAt: true,
        // metadata not selected to avoid schema mismatch
      }
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ posts: [] })
  }
}
