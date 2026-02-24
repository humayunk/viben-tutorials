"use client";

import { useState, useCallback } from "react";
import type { Tutorial } from "@/types";
import { PlayerTopBar } from "./player-top-bar";
import { CardRenderer } from "./card-renderer";
import { ModalityTabs } from "./modality-tabs";

interface TutorialPlayerProps {
  tutorial: Tutorial;
}

export function TutorialPlayer({ tutorial }: TutorialPlayerProps) {
  const [current, setCurrent] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<Record<number, number>>({});
  const [choicesMade, setChoicesMade] = useState<Record<string, string>>({});

  const card = tutorial.cards[current];

  const advance = useCallback(() => {
    if (current < tutorial.cards.length - 1) {
      setCurrent((c) => c + 1);
      window.scrollTo(0, 0);
    }
  }, [current, tutorial.cards.length]);

  const goBack = useCallback(() => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      window.scrollTo(0, 0);
    }
  }, [current]);

  const handleQuizAnswer = useCallback(
    (cardIndex: number, optionIndex: number) => {
      setQuizAnswered((prev) => ({ ...prev, [cardIndex]: optionIndex }));
    },
    []
  );

  const handleChoice = useCallback(
    (store: string, tag: string) => {
      setChoicesMade((prev) => ({ ...prev, [store]: tag }));
      // Auto-advance after brief visual feedback
      setTimeout(() => advance(), 400);
    },
    [advance]
  );

  return (
    <>
      <PlayerTopBar
        current={current}
        total={tutorial.cards.length}
        tutorialId={tutorial.id}
      />
      <div className="flex flex-1 items-center justify-center p-6">
        <div key={current} className="w-full max-w-[560px] animate-card-in">
          <CardRenderer
            card={card}
            cardIndex={current}
            totalCards={tutorial.cards.length}
            onContinue={advance}
            onBack={goBack}
            quizAnswered={quizAnswered}
            onQuizAnswer={handleQuizAnswer}
            choicesMade={choicesMade}
            onChoice={handleChoice}
          />
          {card.modalities && (
            <div className="mt-6">
              <ModalityTabs modalities={card.modalities} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
