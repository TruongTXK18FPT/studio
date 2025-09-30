import { Redis } from "@upstash/redis";

type KV = {
  get<T = any>(key: string): Promise<T | null>;
  set(key: string, value: any): Promise<void>;
  publish(channel: string, message: string): Promise<void>;
};

function createMemoryKV(): KV {
  const store = new Map<string, any>();
  return {
    async get<T = any>(key: string) { return (store.has(key) ? (store.get(key) as T) : null); },
    async set(key: string, value: any) { store.set(key, value); },
    async publish() { /* no-op in memory */ },
  };
}

export const redis: KV = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? (Redis.fromEnv() as unknown as KV)
  : createMemoryKV();

export function roomKey(roomId: string) {
  return `br:room:${roomId}`;
}

export function roomCodeKey(roomCode: string) {
  return `br:roomCode:${roomCode}`;
}

export function questionKey(roomId: string) {
  return `br:room:${roomId}:question`;
}

export function wsRoomChannel(roomId: string) {
  return `br:ws:${roomId}`;
}

export async function publish(roomId: string, event: unknown) {
  try {
    await redis.publish(wsRoomChannel(roomId), JSON.stringify(event));
  } catch (err) {
    console.error("Publish failed", err);
  }
}



