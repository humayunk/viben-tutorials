"use client";

interface NavButtonsProps {
  showBack: boolean;
  onBack: () => void;
  onContinue: () => void;
  cta?: string;
}

export function NavButtons({
  showBack,
  onBack,
  onContinue,
  cta,
}: NavButtonsProps) {
  return (
    <div className="mt-7 flex gap-2.5">
      {showBack && (
        <button
          onClick={onBack}
          className="flex-shrink-0 rounded-xl border border-border px-5 py-3.5 text-[15px] font-semibold text-muted-foreground transition-all hover:border-zinc-600 hover:text-zinc-400"
        >
          &larr; Back
        </button>
      )}
      <button
        onClick={onContinue}
        className="w-full rounded-xl bg-[#8b5cf6] px-8 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#7c3aed]"
      >
        {cta || "Continue"}
      </button>
    </div>
  );
}
