"use client";

import type { Card } from "@/types";

interface TocSidebarProps {
  cards: Card[];
  current: number;
  open: boolean;
  onClose: () => void;
  onJump: (index: number) => void;
}

export function TocSidebar({
  cards,
  current,
  open,
  onClose,
  onJump,
}: TocSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-border bg-[#0a0a0c] transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-zinc-300">
            Contents
          </span>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-zinc-800 hover:text-zinc-300"
            aria-label="Close table of contents"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {cards.map((card, i) => {
            const isCurrent = i === current;
            const isCompleted = i < current;

            return (
              <button
                key={i}
                onClick={() => {
                  onJump(i);
                  onClose();
                }}
                className={`flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                  isCurrent
                    ? "bg-[#8b5cf6]/10 text-[#8b5cf6]"
                    : isCompleted
                      ? "text-muted-foreground/50 hover:bg-zinc-800/50 hover:text-muted-foreground"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300"
                }`}
              >
                <span className="mt-px flex-shrink-0">
                  {card.emoji || "📄"}
                </span>
                <span className="line-clamp-2">
                  {card.title || `Card ${i + 1}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
