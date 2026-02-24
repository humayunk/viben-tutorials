"use client";

import type { Card } from "@/types";
import { IntroCard } from "./cards/intro-card";
import { ConceptCard } from "./cards/concept-card";
import { ActionCard } from "./cards/action-card";
import { QuizCard } from "./cards/quiz-card";
import { MilestoneCard } from "./cards/milestone-card";
import { CelebrationCard } from "./cards/celebration-card";

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
}: CardRendererProps) {
  const showBack = cardIndex > 0;
  const isLastCard = cardIndex === totalCards - 1;

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
