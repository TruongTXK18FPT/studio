import React from "react";

export function QuestionCard({ question, answers, onSelect }: { question: string; answers: string[]; onSelect?: (i: number) => void }) {
  return (
    <div className="rounded border p-4 bg-white">
      <div className="font-semibold mb-3">{question}</div>
      <div className="grid gap-2">
        {answers.map((a, i) => (
          <button key={i} className="px-3 py-2 rounded border hover:bg-neutral-50 text-left" onClick={() => onSelect?.(i)}>
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}



