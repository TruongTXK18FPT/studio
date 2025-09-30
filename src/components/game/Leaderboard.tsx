import React from "react";

export function Leaderboard({ items }: { items: { name: string; score: number }[] }) {
  const sorted = [...items].sort((a, b) => b.score - a.score);
  return (
    <div className="rounded border p-3 bg-white/60">
      <div className="font-semibold mb-2">Leaderboard</div>
      <ol className="space-y-1">
        {sorted.map((it, idx) => (
          <li key={idx} className="flex justify-between text-sm">
            <span>{idx + 1}. {it.name}</span>
            <span className="font-medium">{it.score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}



