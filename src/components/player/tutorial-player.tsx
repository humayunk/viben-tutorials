"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import type { Tutorial } from "@/types";
import { PlayerTopBar } from "./player-top-bar";
import { CardRenderer } from "./card-renderer";
import { TocSidebar } from "./toc-sidebar";
import { ChatSidebar } from "./chat-sidebar";

interface TutorialPlayerProps {
  tutorial: Tutorial;
}

export function TutorialPlayer({ tutorial }: TutorialPlayerProps) {
  const [current, setCurrent] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<Record<number, number>>({});
  const [choicesMade, setChoicesMade] = useState<Record<string, string>>({});
  const [tocOpen, setTocOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [modality, setModality] = useState<"read" | "watch">("read");

  const card = tutorial.cards[current];
  const isFirst = current === 0;
  const isLast = current === tutorial.cards.length - 1;
  const isCelebration = card.type === "celebration";
  const isQuiz = card.type === "quiz";
  const quizNeedsAnswer = isQuiz && quizAnswered[current] === undefined;

  const advance = useCallback(() => {
    if (current < tutorial.cards.length - 1) {
      setCurrent((c) => c + 1);
      setModality("read");
      window.scrollTo(0, 0);
    }
  }, [current, tutorial.cards.length]);

  const goBack = useCallback(() => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setModality("read");
      window.scrollTo(0, 0);
    }
  }, [current]);

  const jumpTo = useCallback((index: number) => {
    setCurrent(index);
    setModality("read");
    window.scrollTo(0, 0);
  }, []);

  const handleQuizAnswer = useCallback(
    (cardIndex: number, optionIndex: number) => {
      setQuizAnswered((prev) => ({ ...prev, [cardIndex]: optionIndex }));
    },
    []
  );

  const handleChoice = useCallback(
    (store: string, tag: string) => {
      setChoicesMade((prev) => ({ ...prev, [store]: tag }));
      setTimeout(() => advance(), 400);
    },
    [advance]
  );

  return (
    <>
      <PlayerTopBar
        current={current}
        total={tutorial.cards.length}
        onToggleToc={() => setTocOpen((o) => !o)}
        onToggleChat={() => setChatOpen((o) => !o)}
      />

      {/* Scrollable content area — padded for fixed bottom bar */}
      <div className="flex flex-1 items-start justify-center p-6 pb-28">
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
            activeModality={modality}
            onModalityChange={setModality}
            onAsk={() => setChatOpen(true)}
          />
        </div>
      </div>

      {/* Fixed bottom nav bar */}
      {!isCelebration && (
        <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[560px] gap-2.5 px-6 py-4">
            {!isFirst && (
              <button
                onClick={goBack}
                className="flex-shrink-0 rounded-xl border border-border px-5 py-3.5 text-[15px] font-semibold text-muted-foreground transition-all hover:border-zinc-600 hover:text-zinc-400"
              >
                &larr; Back
              </button>
            )}
            {!isLast && (
              <button
                onClick={advance}
                disabled={quizNeedsAnswer}
                className={`w-full rounded-xl px-8 py-3.5 text-[15px] font-semibold transition-all ${
                  quizNeedsAnswer
                    ? "cursor-not-allowed bg-[#8b5cf6]/30 text-white/40"
                    : "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                }`}
              >
                {card.cta || "Continue"}
              </button>
            )}
            {isLast && (
              <Link
                href="/tutorials"
                className="w-full rounded-xl bg-[#8b5cf6] px-8 py-3.5 text-center text-[15px] font-semibold text-white transition-all hover:bg-[#7c3aed]"
              >
                Back to Tutorials
              </Link>
            )}
          </div>
        </div>
      )}

      <TocSidebar
        cards={tutorial.cards}
        current={current}
        open={tocOpen}
        onClose={() => setTocOpen(false)}
        onJump={jumpTo}
      />
      <ChatSidebar
        card={card}
        tutorialTitle={tutorial.title}
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
}
