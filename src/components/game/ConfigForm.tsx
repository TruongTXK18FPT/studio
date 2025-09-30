"use client";
import React, { useState } from "react";

type Config = {
  numTeams: number;
  playersPerTeamMax: number;
  maxHpPerTeam: number;
  timePerQuestionMs: number;
  baseScore: number;
  speedBonusMax: number;
  attackDamagePercent: number;
  buffHealPercent: number;
  maxDamagePerTurnPercent: number;
  eliminationConfetti: boolean;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const PRESETS: Record<string, Partial<Config>> = {
  "Small Class (15–20)": {
    numTeams: 3,
    playersPerTeamMax: 6,
    maxHpPerTeam: 120,
    timePerQuestionMs: 18000,
    baseScore: 900,
    speedBonusMax: 400,
    attackDamagePercent: 8,
    buffHealPercent: 4,
    maxDamagePerTurnPercent: 25,
    eliminationConfetti: true,
  },
  "Standard (30–40)": {
    numTeams: 4,
    playersPerTeamMax: 10,
    maxHpPerTeam: 150,
    timePerQuestionMs: 20000,
    baseScore: 1000,
    speedBonusMax: 500,
    attackDamagePercent: 10,
    buffHealPercent: 5,
    maxDamagePerTurnPercent: 30,
    eliminationConfetti: true,
  },
  "Big Hall (60+)": {
    numTeams: 6,
    playersPerTeamMax: 12,
    maxHpPerTeam: 200,
    timePerQuestionMs: 25000,
    baseScore: 1100,
    speedBonusMax: 700,
    attackDamagePercent: 12,
    buffHealPercent: 6,
    maxDamagePerTurnPercent: 35,
    eliminationConfetti: true,
  },
};

const DESCRIPTIONS: Record<keyof Config, string> = {
  numTeams: "Số đội (2–6). Ảnh hưởng mật độ người chơi và số mục tiêu.",
  playersPerTeamMax: "Số người tối đa mỗi đội. Giúp MC cân đối sĩ số.",
  maxHpPerTeam: "HP khởi đầu mỗi đội (100–300). Ảnh hưởng độ dài trận.",
  timePerQuestionMs: "Thời gian trả lời mỗi câu (15k–30k ms). Ảnh hưởng nhịp trận.",
  baseScore: "Điểm nền khi trả lời đúng (800–1200).",
  speedBonusMax: "Thưởng tốc độ tối đa (300–800). Thưởng theo phần trăm thời gian còn lại.",
  attackDamagePercent: "% sát thương khi attack (5–15% trên HP tối đa).",
  buffHealPercent: "% hồi HP khi buff (3–8% trên HP tối đa, không vượt trần).",
  maxDamagePerTurnPercent: "Trần sát thương mỗi lượt trên 1 đội (20–40%).",
  eliminationConfetti: "Bắn pháo giấy khi đội bị loại.",
};

export function ConfigForm({ onCreate }: { onCreate: (cfg: Config) => void }) {
  const [cfg, setCfg] = useState<Config>({
    numTeams: 4,
    playersPerTeamMax: 10,
    maxHpPerTeam: 150,
    timePerQuestionMs: 20000,
    baseScore: 1000,
    speedBonusMax: 500,
    attackDamagePercent: 10,
    buffHealPercent: 5,
    maxDamagePerTurnPercent: 30,
    eliminationConfetti: true,
  });

  function applyPreset(name: string) {
    const p = PRESETS[name];
    setCfg((prev) => ({ ...prev, ...p } as Config));
  }

  async function submit() {
    const body = {
      numTeams: clamp(cfg.numTeams, 2, 6),
      maxHpPerTeam: clamp(cfg.maxHpPerTeam, 100, 300),
      timePerQuestionMs: clamp(cfg.timePerQuestionMs, 15000, 30000),
      playersPerTeamMax: clamp(cfg.playersPerTeamMax, 2, 12),
      baseScore: clamp(cfg.baseScore, 800, 1200),
      speedBonusMax: clamp(cfg.speedBonusMax, 300, 800),
      attackDamagePercent: clamp(cfg.attackDamagePercent, 5, 15),
      buffHealPercent: clamp(cfg.buffHealPercent, 3, 8),
      maxDamagePerTurnPercent: clamp(cfg.maxDamagePerTurnPercent, 20, 40),
      eliminationConfetti: cfg.eliminationConfetti,
    };
    const res = await fetch('/api/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) {
      const data = await res.json();
      onCreate({ ...cfg });
      alert(`Room created: ${data.code}`);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {Object.keys(PRESETS).map((k) => (
          <button key={k} className="px-3 py-2 rounded border" onClick={() => applyPreset(k)}>{k}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {Object.entries(cfg).map(([k, v]) => (
          <label key={k} className="flex flex-col gap-1">
            <span className="text-sm font-medium">{k}</span>
            {typeof v === 'boolean' ? (
              <input type="checkbox" checked={v} onChange={e => setCfg({ ...cfg, [k]: e.target.checked } as any)} />
            ) : (
              <input className="border rounded px-3 py-2" type="number" value={v as number} onChange={e => setCfg({ ...cfg, [k]: Number(e.target.value) } as any)} />
            )}
            <span className="text-xs text-neutral-600">{DESCRIPTIONS[k as keyof Config]}</span>
          </label>
        ))}
      </div>

      <button className="px-4 py-2 rounded bg-black text-white" onClick={submit}>Create Room</button>
    </div>
  );
}



