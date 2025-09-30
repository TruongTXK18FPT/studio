import { NextRequest } from "next/server";
import { redis, roomKey, roomCodeKey } from "@/lib/db";
import { CreateRoomRequest, RoomState } from "@/lib/types";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateRoomRequest;
    const id = randomUUID();
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();

    const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
    const numTeams = clamp(body.numTeams, 2, 6);
    const maxHpPerTeam = clamp(body.maxHpPerTeam, 100, 300);
    const timePerQuestionMs = clamp(body.timePerQuestionMs, 15000, 30000);
    const playersPerTeamMax = clamp(body.playersPerTeamMax ?? 6, 2, 12);
    const baseScore = clamp(body.baseScore ?? 1000, 800, 1200);
    const speedBonusMax = clamp(body.speedBonusMax ?? 500, 300, 800);
    const attackDamagePercent = clamp(body.attackDamagePercent ?? 10, 5, 15);
    const buffHealPercent = clamp(body.buffHealPercent ?? 5, 3, 8);
    const maxDamagePerTurnPercent = clamp(body.maxDamagePerTurnPercent ?? 30, 20, 40);
    const eliminationConfetti = body.eliminationConfetti ?? true;

    const teams = Array.from({ length: numTeams }).map((_, idx) => ({
      id: String.fromCharCode(65 + idx),
      name: `Team ${String.fromCharCode(65 + idx)}`,
      hp: maxHpPerTeam,
    }));

    const now = Date.now();
    const room: RoomState = {
      id,
      code,
      config: {
        numTeams,
        maxHpPerTeam,
        timePerQuestionMs,
        playersPerTeamMax,
        baseScore,
        speedBonusMax,
        attackDamagePercent,
        buffHealPercent,
        maxDamagePerTurnPercent,
        eliminationConfetti,
      },
      teams,
      players: {},
      question: {},
      submissions: [],
      scoreboard: [],
      createdAt: now,
      updatedAt: now,
    };

    await redis.set(roomKey(id), room);
    await redis.set(roomCodeKey(code), id);

    return Response.json({ id, code, config: room.config });
  } catch (err: any) {
    console.error('POST /api/rooms error:', err?.message || err);
    const message = typeof err?.message === 'string' ? err.message : 'Unknown error';
    const hint = !process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN
      ? 'Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN'
      : undefined;
    return Response.json({ error: 'ROOM_CREATE_FAILED', message, hint }, { status: 500 });
  }
}


