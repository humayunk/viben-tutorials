"use client";

import type { Card } from "@/types";

interface QuizCardProps {
  card: Card;
  cardIndex: number;
  showBack: boolean;
  onContinue: () => void;
  onBack: () => void;
  answeredOption?: number;
  onAnswer: (cardIndex: number, optionIndex: number) => void;
}

export function QuizCard({
  card,
  cardIndex,
  showBack,
  onContinue,
  onBack,
  answeredOption,
  onAnswer,
}: QuizCardProps) {
  const answered = answeredOption !== undefined;
  const isCorrect =
    answered && card.options ? card.options[answeredOption].correct : false;

  function handleClick(optIndex: number) {
    if (answered) return;
    onAnswer(cardIndex, optIndex);
  }

  return (
    <div>
      {card.emoji && <div className="mb-5 text-5xl leading-none">{card.emoji}</div>}
      {card.title && (
        <h2 className="mb-3 text-[26px] font-bold leading-tight tracking-tight">
          {card.title}
        </h2>
      )}

      {card.question && (
        <p className="mb-3 font-semibold">{card.question}</p>
      )}

      {card.options && (
        <div className="my-4 flex flex-col gap-2">
          {card.options.map((opt, i) => {
            let classes =
              "rounded-[10px] border p-3.5 px-[18px] text-left text-sm transition-all";

            if (!answered) {
              classes +=
                " cursor-pointer border-border bg-card text-zinc-400 hover:border-[#8b5cf6]";
            } else if (opt.correct) {
              classes +=
                " border-green-500 bg-green-500/10 text-green-500";
            } else if (i === answeredOption && !opt.correct) {
              classes += " border-red-500 bg-red-500/[0.08] text-red-500";
            } else {
              classes +=
                " border-border bg-card text-zinc-400 opacity-50";
            }

            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                disabled={answered}
                className={classes}
              >
                {opt.text}
              </button>
            );
          })}
        </div>
      )}

      {/* Feedback */}
      {answered && isCorrect && card.correctFeedback && (
        <div className="mt-3 rounded-[10px] border border-green-500/15 bg-green-500/10 p-3 px-4 text-sm leading-relaxed text-[#4ade80]">
          {card.correctFeedback}
        </div>
      )}
      {answered && !isCorrect && card.wrongFeedback && (
        <div className="mt-3 rounded-[10px] border border-red-500/15 bg-red-500/[0.08] p-3 px-4 text-sm leading-relaxed text-[#f87171]">
          {card.wrongFeedback}
        </div>
      )}

      {/* Nav buttons handled by fixed bottom bar in tutorial-player */}
    </div>
  );
}
