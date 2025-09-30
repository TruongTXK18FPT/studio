import { NextRequest } from "next/server";
import { redis, roomCodeKey, roomKey, publish } from "@/lib/db";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { roomCode } = await req.json();
    if (!roomCode) return Response.json({ error: 'MISSING_CODE' }, { status: 400 });

    const roomId = await redis.get<string>(roomCodeKey(roomCode));
    if (!roomId) return Response.json({ error: 'ROOM_NOT_FOUND' }, { status: 404 });

    const key = roomKey(roomId);
    const room = await redis.get<any>(key);
    if (!room) return Response.json({ error: 'ROOM_NOT_FOUND' }, { status: 404 });

    let questions = (await redis.get<any>("br:questions")) as any[] | null;
    if (!questions || questions.length === 0) {
      // fallback sample
      questions = [
        { id: 'sample-1', question: '2 + 2 = ?', answers: ['4', '3', '5', '22'] },
      ];
    }

    const idxKey = `br:room:${roomId}:qIndex`;
    const currentIndex = (await redis.get<number>(idxKey)) ?? 0;
    const nextIndex = currentIndex % questions.length;
    const q = questions[nextIndex];

    room.question = {
      currentQuestionId: q.id,
      startedAt: Date.now(),
      isLocked: false,
    };
    room.updatedAt = Date.now();

    await redis.set(key, room);
    await redis.set(idxKey, nextIndex + 1);

    await publish(roomId, { type: 'QUESTION_STARTED', payload: { roomId, questionId: q.id, question: { text: q.question, answers: q.answers } } });

    return Response.json({ ok: true, roomId, questionId: q.id });
  } catch (e: any) {
    return Response.json({ error: 'START_FAILED', message: e?.message ?? 'unknown' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomCode = searchParams.get('roomCode');
  if (!roomCode) return Response.json({ error: 'MISSING_CODE' }, { status: 400 });
  return POST(new NextRequest(req.url, { method: 'POST', body: JSON.stringify({ roomCode }) } as any));
}


