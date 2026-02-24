"use client";

import type { Card } from "@/types";
import { NavButtons } from "../nav-buttons";

interface MilestoneCardProps {
  card: Card;
  showBack: boolean;
  onContinue: () => void;
  onBack: () => void;
}

export function MilestoneCard({
  card,
  showBack,
  onContinue,
  onBack,
}: MilestoneCardProps) {
  return (
    <div>
      {card.emoji && <div className="mb-5 text-5xl leading-none">{card.emoji}</div>}
      {card.title && (
        <h2 className="mb-3 text-[26px] font-bold leading-tight tracking-tight">
          {card.title}
        </h2>
      )}
      {card.body && (
        <p
          className="mb-4 text-base leading-relaxed text-zinc-400 [&_strong]:text-zinc-100 [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: card.body }}
        />
      )}
      {card.body2 && (
        <p
          className="mb-4 text-base leading-relaxed text-zinc-400 [&_strong]:text-zinc-100"
          dangerouslySetInnerHTML={{ __html: card.body2 }}
        />
      )}
      <NavButtons
        showBack={showBack}
        onBack={onBack}
        onContinue={onContinue}
        cta={card.cta}
      />
    </div>
  );
}
