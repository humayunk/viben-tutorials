"use client";

import type { Card } from "@/types";
import { IntroCard } from "./cards/intro-card";
import { ConceptCard } from "./cards/concept-card";
import { ActionCard } from "./cards/action-card";
import { QuizCard } from "./cards/quiz-card";
import { MilestoneCard } from "./cards/milestone-card";
import { CelebrationCard } from "./cards/celebration-card";
import { ReadWatchToggle } from "./read-watch-toggle";
import { ReadContent, WatchContent } from "./modality-content";

interface CardRendererProps {
  card: Card;
  cardIndex: number;
  totalCards: number;
  onContinue: () => void;
  onBack: () => void;
  quizAnswered: Record<number, number>;
  onQuizAnswer: (cardIndex: number, optionIndex: number) => void;
  choicesMade: Record<string, string>;
  onChoice: (store: string, tag: string) => void;
  activeModality: "read" | "watch";
  onModalityChange: (mode: "read" | "watch") => void;
  onAsk: () => void;
}

export function CardRenderer({
  card,
  cardIndex,
  totalCards,
  onContinue,
  onBack,
  quizAnswered,
  onQuizAnswer,
  choicesMade,
  onChoice,
  activeModality,
  onModalityChange,
  onAsk,
}: CardRendererProps) {
  const showBack = cardIndex > 0;
  const isLastCard = cardIndex === totalCards - 1;
  const isCelebration = card.type === "celebration";
  const hasReadAndWatch = !!(card.modalities?.read && card.modalities?.watch);
  const hasAnyModality = !!(card.modalities?.read || card.modalities?.watch);

  return (
    <div>
      {/* Step label */}
      {!isCelebration && (
        <p className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-[#8b5cf6]">
          Step {cardIndex + 1} of {totalCards}
        </p>
      )}

      {/* Read/Watch toggle — above card content */}
      {hasAnyModality && (
        <ReadWatchToggle
          active={activeModality}
          onChange={onModalityChange}
          hasRead={!!card.modalities?.read}
          hasWatch={!!card.modalities?.watch}
          onAsk={onAsk}
        />
      )}

      {/* Card content — always visible in "read" mode, hidden in "watch" mode */}
      {activeModality === "read" && renderCard()}

      {/* Watch content replaces card when in watch mode */}
      {activeModality === "watch" && card.modalities?.watch && (
        <div className="rounded-[14px] border border-border bg-card p-5">
          <WatchContent data={card.modalities.watch} />
        </div>
      )}

      {/* Read modality content (supplemental text below card) */}
      {activeModality === "read" && card.modalities?.read && (
        <div className="mt-6 rounded-[14px] border border-border bg-card p-5">
          <ReadContent data={card.modalities.read} />
        </div>
      )}

      {/* Nav buttons handled by fixed bottom bar in tutorial-player */}
    </div>
  );

  function renderCard() {
    switch (card.type) {
      case "intro":
        return (
          <IntroCard
            card={card}
            showBack={showBack}
            onContinue={onContinue}
            onBack={onBack}
          />
        );
      case "concept":
        return (
          <ConceptCard
            card={card}
            showBack={showBack}
            onContinue={onContinue}
            onBack={onBack}
          />
        );
      case "action":
        return (
          <ActionCard
            card={card}
            showBack={showBack}
            onContinue={onContinue}
            onBack={onBack}
          />
        );
      case "quiz":
        return (
          <QuizCard
            card={card}
            cardIndex={cardIndex}
            showBack={showBack}
            onContinue={onContinue}
            onBack={onBack}
            answeredOption={quizAnswered[cardIndex]}
            onAnswer={onQuizAnswer}
          />
        );
      case "choice":
        return (
          <IntroCard
            card={card}
            showBack={showBack}
            onContinue={onContinue}
            onBack={onBack}
            choices={card.choices}
            store={card.store}
            choicesMade={choicesMade}
            onChoice={onChoice}
          />
        );
      case "milestone":
        return (
          <MilestoneCard
            card={card}
            showBack={showBack}
            onContinue={onContinue}
            onBack={onBack}
          />
        );
      case "celebration":
        return (
          <CelebrationCard
            card={card}
            totalCards={totalCards}
            quizCount={Object.keys(quizAnswered).length}
          />
        );
      default:
        return (
          <IntroCard
            card={card}
            showBack={showBack}
            onContinue={onContinue}
            onBack={onBack}
          />
        );
    }
  }
}
