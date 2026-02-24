"use client";

import type { Card } from "@/types";

interface CelebrationCardProps {
  card: Card;
  totalCards: number;
  quizCount: number;
}

export function CelebrationCard({
  card,
  totalCards,
  quizCount,
}: CelebrationCardProps) {
  return (
    <div className="py-5 text-center">
      <div className="mb-5 animate-celebration-bounce text-[64px]">
        {card.emoji || "\uD83C\uDF93"}
      </div>
      <h2 className="mb-3 text-[28px] font-bold">{card.title}</h2>
      {card.body && (
        <p
          className="mb-4 text-base leading-relaxed text-zinc-400 [&_strong]:text-zinc-100"
          dangerouslySetInnerHTML={{ __html: card.body }}
        />
      )}

      {card.stats && (
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <StatBox value={totalCards} label="Steps completed" color="text-green-500" />
          <StatBox
            value={quizCount}
            label={quizCount === 1 ? "Quiz passed" : "Quizzes passed"}
            color="text-[#8b5cf6]"
          />
        </div>
      )}
    </div>
  );
}

function StatBox({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-6 py-4 text-center">
      <div className={`text-[28px] font-bold ${color}`}>{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
