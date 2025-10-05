import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema validation cho Quiz
const createQuizSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  description: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'expert']).default('medium'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  timeLimit: z.number().min(1).max(180).optional(),
  isPublic: z.boolean().default(true),
  questions: z.array(z.object({
    question: z.string().min(1, 'Câu hỏi không được để trống'),
    type: z.enum(['single', 'multiple', 'true_false']).default('single'),
    difficulty: z.enum(['easy', 'medium', 'hard', 'expert']).default('medium'),
    explanation: z.string().optional(),
    topic: z.string().optional(),
    order: z.number().default(0),
    choices: z.array(z.object({
      text: z.string().min(1, 'Lựa chọn không được để trống'),
      isCorrect: z.boolean().default(false),
      order: z.number().default(0)
    })).min(2, 'Phải có ít nhất 2 lựa chọn')
  })).min(1, 'Phải có ít nhất 1 câu hỏi')
});

// GET /api/quiz - Lấy danh sách quiz
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const isPublic = searchParams.get('isPublic');
    const authorId = searchParams.get('authorId');

    const skip = (page - 1) * limit;

    const where: any = {};
    
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (isPublic !== null) where.isPublic = isPublic === 'true';
    if (authorId === 'current') {
      // Note: Cần implement authentication để lấy user ID từ session
    } else if (authorId) {
      where.authorId = authorId;
    }
    where.isActive = true;

    const [quizzes, total] = await Promise.all([
      (prisma as any).quiz.findMany({
        where,
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
        },
        skip,
        take: limit
      }),
      (prisma as any).quiz.count({ where })
    ]);

    return NextResponse.json({
      quizzes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Không thể lấy danh sách quiz' },
      { status: 500 }
    );
  }
}

// POST /api/quiz - Tạo quiz mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createQuizSchema.parse(body);

    // Đảm bảo user system tồn tại
    let systemUser = await (prisma as any).user.findUnique({
      where: { email: 'system@example.com' }
    });

    if (!systemUser) {
      // Tạo user system nếu chưa có
      systemUser = await (prisma as any).user.create({
        data: {
          email: 'system@example.com',
          name: 'System Admin',
          passwordHash: 'system', // Temporary
          role: 'ADMIN'
        }
      });
    }

    // Tạo quiz với questions và choices
    const quiz = await (prisma as any).quiz.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        difficulty: validatedData.difficulty,
        category: validatedData.category,
        tags: validatedData.tags,
        timeLimit: validatedData.timeLimit,
        isPublic: validatedData.isPublic,
        authorId: systemUser.id,
        questions: {
          create: validatedData.questions.map(q => ({
            question: q.question,
            type: q.type,
            difficulty: q.difficulty,
            explanation: q.explanation,
            topic: q.topic,
            order: q.order,
            choices: {
              create: q.choices.map(c => ({
                text: c.text,
                isCorrect: c.isCorrect,
                order: c.order
              }))
            }
          }))
        }
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

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating quiz:', error);
    return NextResponse.json(
      { error: 'Không thể tạo quiz', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
