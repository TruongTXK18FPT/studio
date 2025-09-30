import { NextRequest } from "next/server";
import { redis, roomKey } from "@/lib/db";
import { SubmitAnswerRequest, Scoring } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SubmitAnswerRequest;
    const room = await redis.get<any>(roomKey(body.roomId));
    if (!room) return new Response("Room not found", { status: 404 });

    const question = room.question || {};
    const timeLimit = room.config?.timePerQuestionMs ?? 20000;
    const startedAt = question.startedAt ?? Date.now();
    const elapsed = Math.max(0, body.timeMs ?? (Date.now() - startedAt));
    const timeLeft = Math.max(0, timeLimit - elapsed);

    // Minimal correctness stub: treat answerIndex === 0 as correct in skeleton
    const isCorrect = body.answerIndex === 0;
    const score = Scoring.calculate(isCorrect, timeLeft, timeLimit);

    room.submissions.push({
      playerId: body.playerId,
      questionId: body.questionId,
      answerIndex: body.answerIndex,
      timeMs: elapsed,
      isCorrect,
      score,
    });

    // Update scoreboard simple sum per player
    const existing = room.scoreboard.find((s: any) => s.playerId === body.playerId);
    if (existing) existing.score += score; else {
      const name = room.players?.[body.playerId]?.name ?? "Player";
      room.scoreboard.push({ playerId: body.playerId, name, score });
    }

    room.updatedAt = Date.now();
    await redis.set(roomKey(body.roomId), room);

    return Response.json({ score, isCorrect });
  } catch (err) {
    return new Response("Bad Request", { status: 400 });
  }
}


