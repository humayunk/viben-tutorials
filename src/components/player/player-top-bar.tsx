"use client";

import Link from "next/link";

interface PlayerTopBarProps {
  current: number;
  total: number;
  tutorialId: string;
}

export function PlayerTopBar({ current, total, tutorialId }: PlayerTopBarProps) {
  const pct = ((current + 1) / total) * 100;

  return (
    <div className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="text-sm font-semibold text-muted-foreground">
        <span className="bg-gradient-to-r from-[#8b5cf6] to-primary bg-clip-text text-transparent">
          viben
        </span>{" "}
        learn
      </div>
      <div className="mx-6 flex-1" style={{ maxWidth: 300 }}>
        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8b5cf6] to-primary transition-all duration-[400ms] ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 text-right text-xs text-muted-foreground">
          {current + 1} / {total}
        </div>
      </div>
      <Link
        href={`/tutorials/${tutorialId}`}
        className="text-[13px] text-muted-foreground hover:text-zinc-400"
      >
        Exit
      </Link>
    </div>
  );
}
