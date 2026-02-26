"use client";

import Link from "next/link";

interface PlayerTopBarProps {
  current: number;
  total: number;
  onToggleToc: () => void;
  onToggleChat: () => void;
}

export function PlayerTopBar({
  current,
  total,
  onToggleToc,
  onToggleChat,
}: PlayerTopBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-border px-4 py-3">
      {/* Left: Hamburger + Close */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleToc}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          aria-label="Table of contents"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link
          href="/tutorials"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-zinc-800 hover:text-zinc-300"
          aria-label="Exit tutorial"
        >
          <svg
            width="18"
            height="18"
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
        </Link>
      </div>

      {/* Center: Dot pager */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const isCurrent = i === current;
          const isCompleted = i < current;

          return (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                isCurrent
                  ? "w-6 bg-[#8b5cf6]"
                  : isCompleted
                    ? "w-2 bg-[#8b5cf6]/50"
                    : "w-2 bg-zinc-700"
              }`}
            />
          );
        })}
      </div>

      {/* Right: Chat icon */}
      <button
        onClick={onToggleChat}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-zinc-800 hover:text-zinc-300"
        aria-label="Chat"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  );
}
