import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    // Return empty array if there's a database issue
    return NextResponse.json({ posts: [] })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { postId, status } = await request.json()

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { status },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    let message = 'Đã cập nhật trạng thái bài viết'
    if (status === 'approved') {
      message = 'Đã duyệt bài viết'
    } else if (status === 'rejected') {
      message = 'Đã từ chối bài viết'
    }

    return NextResponse.json({ 
      message,
      post: updatedPost 
    })
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Không thể cập nhật bài viết' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { postId } = await request.json()

    await prisma.post.delete({
      where: { id: postId }
    })

    return NextResponse.json({ 
      message: 'Đã xóa bài viết thành công'
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Không thể xóa bài viết' },
      { status: 500 }
    )
  }
}
