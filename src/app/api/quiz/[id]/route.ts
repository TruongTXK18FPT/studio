import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/quiz/[id] - Lấy quiz bằng ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quiz = await (prisma as any).quiz.findUnique({
      where: {
        id: params.id,
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
      }
    });

    if (!quiz) {
      return NextResponse.json(
        { error: 'Không tìm thấy quiz' },
        { status: 404 }
      );
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Không thể lấy thông tin quiz' },
      { status: 500 }
    );
  }
}

// PUT /api/quiz/[id] - Cập nhật quiz
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Kiểm tra quiz có tồn tại không
    const existingQuiz = await (prisma as any).quiz.findUnique({
      where: { id: params.id }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: 'Không tìm thấy quiz' },
        { status: 404 }
      );
    }

    // Cập nhật quiz
    const updatedQuiz = await (prisma as any).quiz.update({
      where: { id: params.id },
      data: {
        title: body.title,
        description: body.description,
        difficulty: body.difficulty,
        category: body.category,
        tags: body.tags,
        timeLimit: body.timeLimit,
        isPublic: body.isPublic,
        isActive: body.isActive
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
        }
      }
    });

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    return NextResponse.json(
      { error: 'Không thể cập nhật quiz' },
      { status: 500 }
    );
  }
}

// DELETE /api/quiz/[id] - Xóa quiz
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Kiểm tra quiz có tồn tại không
    const existingQuiz = await (prisma as any).quiz.findUnique({
      where: { id: params.id }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: 'Không tìm thấy quiz' },
        { status: 404 }
      );
    }

    // Soft delete - chỉ đánh dấu isActive = false
    await (prisma as any).quiz.update({
      where: { id: params.id },
      data: { isActive: false }
    });

    return NextResponse.json({ message: 'Quiz đã được xóa thành công' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return NextResponse.json(
      { error: 'Không thể xóa quiz' },
      { status: 500 }
    );
  }
}
