import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// DELETE /api/user/posts/[id] - Xóa bài viết của user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const postId = params.id

    // Kiểm tra xem bài viết có tồn tại và thuộc về user hiện tại không
    const post = await (prisma as any).post.findFirst({
      where: {
        id: postId,
        authorId: session.sub
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found or not authorized' },
        { status: 404 }
      )
    }

    // Xóa bài viết
    await (prisma as any).post.delete({
      where: { id: postId }
    })

    return NextResponse.json({ 
      message: 'Post deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/user/posts/[id] - Cập nhật bài viết của user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const postId = params.id
    const body = await request.json()
    const { title, content, tags } = body

    // Kiểm tra xem bài viết có tồn tại và thuộc về user hiện tại không
    const existingPost = await (prisma as any).post.findFirst({
      where: {
        id: postId,
        authorId: session.sub
      }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post not found or not authorized' },
        { status: 404 }
      )
    }

    // Cập nhật bài viết
    const updatedPost = await (prisma as any).post.update({
      where: { id: postId },
      data: {
        title,
        content,
        tags,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
