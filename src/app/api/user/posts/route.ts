import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await (prisma as any).user.findUnique({
      where: { id: session.sub }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get user's posts
    const posts = await (prisma as any).post.findMany({
      where: { authorId: session.sub },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        content: true,
        status: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        // metadata omitted for compatibility
      }
    })

    // Get user's activity stats
    const stats = {
      totalPosts: posts.length,
      approvedPosts: posts.filter(p => p.status === 'approved').length,
      pendingPosts: posts.filter(p => p.status === 'pending').length,
      rejectedPosts: posts.filter(p => p.status === 'rejected').length
    }

    return NextResponse.json({ 
      posts,
      stats,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Error fetching user posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}