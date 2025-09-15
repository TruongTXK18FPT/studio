import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

async function requireAdminAuth() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session
}

export async function GET(request: NextRequest) {
  try {
    await requireAdminAuth()
    
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
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập với quyền admin' },
        { status: 401 }
      )
    }
    
    console.error('Error fetching posts:', error)
    return NextResponse.json({ posts: [] })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAdminAuth()
    
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
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập với quyền admin' },
        { status: 401 }
      )
    }
    
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Không thể cập nhật bài viết' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdminAuth()
    
    const { postId } = await request.json()

    await prisma.post.delete({
      where: { id: postId }
    })

    return NextResponse.json({ 
      message: 'Đã xóa bài viết thành công'
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Vui lòng đăng nhập với quyền admin' },
        { status: 401 }
      )
    }
    
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Không thể xóa bài viết' },
      { status: 500 }
    )
  }
}
