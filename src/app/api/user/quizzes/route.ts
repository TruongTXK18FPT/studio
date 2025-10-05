import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

// GET /api/user/quizzes - Lấy quiz của user hiện tại
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Lấy quiz của user hiện tại
    const quizzes = await (prisma as any).quiz.findMany({
      where: {
        authorId: session.sub,
        isActive: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        questions: {
          include: {
            choices: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            results: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ quizzes });
  } catch (error) {
    console.error('Error fetching user quizzes:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách quiz của bạn' },
      { status: 500 }
    );
  }
}
