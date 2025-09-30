import React, { useState } from "react";

export function AttackSelector({ teams, onPick }: { teams: { id: string; name: string }[]; onPick: (targetId: string | null, isBuff: boolean) => void }) {
  const [mode, setMode] = useState<'attack' | 'buff'>('attack');
  return (
    <div className="rounded border p-3 bg-white/60 space-y-2">
      <div className="flex gap-2 text-sm">
        <button className={`px-2 py-1 rounded border ${mode==='attack'?'bg-black text-white':''}`} onClick={() => setMode('attack')}>Attack</button>
        <button className={`px-2 py-1 rounded border ${mode==='buff'?'bg-black text-white':''}`} onClick={() => setMode('buff')}>Buff</button>
      </div>
      {mode === 'attack' ? (
        <div className="grid gap-2">
          {teams.map(t => (
            <button key={t.id} className="px-3 py-2 rounded border hover:bg-neutral-50 text-left" onClick={() => onPick(t.id, false)}>
              Attack {t.name}
            </button>
          ))}
        </div>
      ) : (
        <button className="px-3 py-2 rounded border hover:bg-neutral-50" onClick={() => onPick(null, true)}>Buff my team</button>
      )}
    </div>
  );
}



