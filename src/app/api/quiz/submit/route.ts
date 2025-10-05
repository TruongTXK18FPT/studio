import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema validation cho Quiz Result
const submitQuizSchema = z.object({
  quizId: z.string().min(1),
  answers: z.array(z.object({
    questionId: z.string(),
    choiceIds: z.array(z.string()),
    timeSpent: z.number().default(0)
  })),
  totalTimeSpent: z.number().min(0),
  userId: z.string().optional()
});

// POST /api/quiz/submit - Submit kết quả quiz
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = submitQuizSchema.parse(body);

    // Lấy thông tin quiz và questions
    const quiz = await (prisma as any).quiz.findUnique({
      where: { id: validatedData.quizId },
      include: {
        questions: {
          include: {
            choices: true
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

    // Tính điểm
    let correctAnswers = 0;
    const totalQuestions = quiz.questions.length;

    for (const answer of validatedData.answers) {
      const question = quiz.questions.find((q: any) => q.id === answer.questionId);
      if (!question) continue;

      const correctChoiceIds = question.choices
        .filter((c: any) => c.isCorrect)
        .map((c: any) => c.id);

      // Kiểm tra xem user có chọn đúng tất cả các đáp án đúng không
      const isCorrect = correctChoiceIds.length === answer.choiceIds.length &&
        correctChoiceIds.every((id: any) => answer.choiceIds.includes(id));

      if (isCorrect) {
        correctAnswers++;
      }
    }

    const score = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Xác định grade
    let grade: string;
    if (score >= 90) grade = 'excellent';
    else if (score >= 70) grade = 'good';
    else if (score >= 50) grade = 'average';
    else grade = 'poor';

    // Lưu kết quả
    const result = await (prisma as any).quizResult.create({
      data: {
        quizId: validatedData.quizId,
        userId: validatedData.userId,
        score,
        totalQuestions,
        correctAnswers,
        timeSpent: validatedData.totalTimeSpent,
        grade,
        answers: validatedData.answers
      },
      include: {
        quiz: {
          select: {
            title: true,
            difficulty: true
          }
        }
      }
    });

    return NextResponse.json({
      result,
      summary: {
        score,
        correctAnswers,
        totalQuestions,
        grade,
        timeSpent: validatedData.totalTimeSpent
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dữ liệu không hợp lệ', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Không thể lưu kết quả quiz' },
      { status: 500 }
    );
  }
}
