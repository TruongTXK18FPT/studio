import { NextRequest } from "next/server";
import { redis, roomCodeKey, roomKey } from "@/lib/db";
import { JoinRoomRequest, Player } from "@/lib/types";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as JoinRoomRequest;
    const roomId = await redis.get<string>(roomCodeKey(body.roomCode));
    if (!roomId) return new Response("Room not found", { status: 404 });

    const room = await redis.get<any>(roomKey(roomId));
    if (!room) return new Response("Room not found", { status: 404 });

    const player: Player = {
      id: randomUUID(),
      name: body.name,
      teamId: body.teamId,
      joinedAt: Date.now(),
    };

    room.players[player.id] = player;
    room.updatedAt = Date.now();

    await redis.set(roomKey(roomId), room);

    return Response.json({ roomId, playerId: player.id });
  } catch (err) {
    return new Response("Bad Request", { status: 400 });
  }
}


