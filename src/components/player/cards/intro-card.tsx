"use client";

import { useState } from "react";
import type { Card } from "@/types";
import { NavButtons } from "../nav-buttons";

interface IntroCardProps {
  card: Card;
  showBack: boolean;
  onContinue: () => void;
  onBack: () => void;
  choices?: Card["choices"];
  store?: string;
  choicesMade?: Record<string, string>;
  onChoice?: (store: string, tag: string) => void;
}

export function IntroCard({
  card,
  showBack,
  onContinue,
  onBack,
  choices,
  store,
  choicesMade,
  onChoice,
}: IntroCardProps) {
  const [selected, setSelected] = useState<number | null>(null);

  function handleChoiceClick(index: number, tag: string) {
    if (selected !== null) return;
    setSelected(index);
    if (store && onChoice) {
      onChoice(store, tag);
    }
  }

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

      {choices && choices.length > 0 && (
        <div className="mt-6 flex flex-col gap-2.5">
          {choices.map((ch, i) => (
            <button
              key={i}
              onClick={() => handleChoiceClick(i, ch.tag)}
              disabled={selected !== null}
              className={`flex items-start gap-3.5 rounded-xl border p-4 text-left transition-all ${
                selected === i
                  ? "border-[#8b5cf6] bg-[rgba(139,92,246,0.15)]"
                  : "border-border bg-card hover:border-[#8b5cf6] hover:bg-[rgba(139,92,246,0.15)]"
              } ${selected !== null && selected !== i ? "opacity-50" : ""}`}
            >
              {ch.icon && (
                <span className="mt-0.5 flex-shrink-0 text-xl">{ch.icon}</span>
              )}
              <div className="flex-1">
                <span className="block font-semibold">{ch.label}</span>
                {ch.desc && (
                  <span className="text-[13px] text-muted-foreground">
                    {ch.desc}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {!choices && (
        <NavButtons
          showBack={showBack}
          onBack={onBack}
          onContinue={onContinue}
          cta={card.cta}
        />
      )}

      {choices && showBack && (
        <div className="mt-7">
          <button
            onClick={onBack}
            className="rounded-xl border border-border px-5 py-3.5 text-[15px] font-semibold text-muted-foreground transition-all hover:border-zinc-600 hover:text-zinc-400"
          >
            &larr; Back
          </button>
        </div>
      )}
    </div>
  );
}
