import React from "react";

export function TeamHPBar({ label, hp, max }: { label: string; hp: number; max: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((hp / Math.max(1, max)) * 100)));
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium">{label}</span>
        <span>{hp}/{max}</span>
      </div>
      <div className="w-full h-3 bg-neutral-200 rounded">
        <div className="h-3 bg-emerald-500 rounded" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}



