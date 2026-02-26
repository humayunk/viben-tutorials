"use client";

interface ReadWatchToggleProps {
  active: "read" | "watch";
  onChange: (mode: "read" | "watch") => void;
  hasRead: boolean;
  hasWatch: boolean;
  onAsk: () => void;
}

export function ReadWatchToggle({
  active,
  onChange,
  hasRead,
  hasWatch,
  onAsk,
}: ReadWatchToggleProps) {
  return (
    <div className="mb-5 rounded-xl border border-border bg-zinc-900/60 px-5 py-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        Choose your tutorial vibe
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onChange("read")}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
            active === "read"
              ? "bg-[#8b5cf6] text-white"
              : "border border-border text-muted-foreground hover:text-zinc-300"
          }`}
        >
          Read
        </button>
        {hasWatch && (
          <button
            onClick={() => onChange("watch")}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
              active === "watch"
                ? "bg-[#8b5cf6] text-white"
                : "border border-border text-muted-foreground hover:text-zinc-300"
            }`}
          >
            Watch
          </button>
        )}
        <button
          onClick={onAsk}
          className="rounded-lg border border-border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:text-zinc-300"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
