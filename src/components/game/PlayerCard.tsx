import React from "react";

export function PlayerCard({ name, score }: { name: string; score: number }) {
  return (
    <div className="rounded border p-3 bg-white/60">
      <div className="font-semibold">{name}</div>
      <div className="text-sm text-neutral-600">Score: {score}</div>
    </div>
  );
}



