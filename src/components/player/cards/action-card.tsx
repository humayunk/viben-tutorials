"use client";

import { useState } from "react";
import type { Card } from "@/types";
import { NavButtons } from "../nav-buttons";

interface ActionCardProps {
  card: Card;
  showBack: boolean;
  onContinue: () => void;
  onBack: () => void;
}

export function ActionCard({
  card,
  showBack,
  onContinue,
  onBack,
}: ActionCardProps) {
  return (
    <div>
      {card.emoji && <div className="mb-5 text-5xl leading-none">{card.emoji}</div>}
      {card.title && (
        <h2 className="mb-3 text-[26px] font-bold leading-tight tracking-tight">
          {card.title}
        </h2>
      )}
      {card.body && (
        <p
          className="mb-4 text-base leading-relaxed text-zinc-400 [&_strong]:text-zinc-100 [&_em]:italic"
          dangerouslySetInnerHTML={{ __html: card.body }}
        />
      )}

      {/* Bullets (some action cards have them) */}
      {card.bullets && card.bullets.length > 0 && (
        <div className="my-4">
          <ul className="list-none p-0">
            {card.bullets.map((b, i) => (
              <li
                key={i}
                className="border-b border-border py-2 text-sm leading-relaxed text-zinc-400 last:border-b-0 [&_strong]:text-zinc-100"
                dangerouslySetInnerHTML={{ __html: b }}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Code block */}
      {card.code && (
        <>
          {card.codeLabel && (
            <div className="mb-1.5 mt-4 text-[11px] font-semibold uppercase tracking-widest text-[#8b5cf6]">
              {card.codeLabel}
            </div>
          )}
          <CodeBlock code={card.code} />
        </>
      )}
      {card.codeCaption && (
        <p
          className="mt-1 text-sm text-zinc-400 [&_strong]:text-zinc-100"
          dangerouslySetInnerHTML={{ __html: card.codeCaption }}
        />
      )}

      {card.body2 && (
        <p
          className="mb-4 mt-4 text-base leading-relaxed text-zinc-400 [&_strong]:text-zinc-100"
          dangerouslySetInnerHTML={{ __html: card.body2 }}
        />
      )}

      {/* Link */}
      {card.link && (
        <a
          href={card.link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="my-2 inline-block text-sm font-semibold text-[#8b5cf6] no-underline"
        >
          {card.link.text} &nearr;
        </a>
      )}

      {/* Warning box */}
      {card.warn && (
        <div
          className="my-4 rounded-xl border border-yellow-500/15 bg-yellow-500/10 px-[18px] py-4 text-sm leading-relaxed text-[#d4a406] [&_strong]:text-yellow-500"
          dangerouslySetInnerHTML={{ __html: card.warn }}
        />
      )}

      {/* Safe box */}
      {card.safe && (
        <div
          className="my-4 rounded-xl border border-green-500/15 bg-green-500/10 px-[18px] py-4 text-sm leading-relaxed text-[#4ade80] [&_strong]:text-green-500"
          dangerouslySetInnerHTML={{ __html: card.safe }}
        />
      )}

      {/* Help items accordion */}
      {card.helpItems && card.helpItems.length > 0 && (
        <HelpAccordion items={card.helpItems} />
      )}

      {/* Troubleshoot accordion */}
      {card.troubleshoot && card.troubleshoot.length > 0 && (
        <TroubleshootAccordion items={card.troubleshoot} />
      )}

      <NavButtons
        showBack={showBack}
        onBack={onBack}
        onContinue={onContinue}
        cta={card.cta}
      />
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative my-4 overflow-x-auto rounded-[10px] border border-border bg-[#1a1a1e] px-[18px] py-4 font-mono text-[13.5px] leading-[1.8] text-green-400">
      <button
        onClick={handleCopy}
        className="absolute right-2.5 top-2.5 rounded-md border border-border bg-[#1a1a1e] px-2 py-0.5 font-sans text-[11px] text-muted-foreground hover:text-zinc-300"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      {code}
    </div>
  );
}

function HelpAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(false);
  const [openQ, setOpenQ] = useState<number | null>(null);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`mt-5 flex w-full items-center gap-2 rounded-[10px] border p-3 px-4 text-left text-[13px] transition-all ${
          open
            ? "rounded-b-none border-b-0 border-[#8b5cf6] text-[#8b5cf6]"
            : "border-border text-muted-foreground hover:border-zinc-600 hover:text-zinc-400"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="flex-shrink-0"
        >
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M6.5 6.5a1.5 1.5 0 1 1 1.5 1.5v1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
        </svg>
        Have a question about this step?
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`ml-auto flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="mb-2 overflow-hidden rounded-b-[10px] border border-t-0 border-[#8b5cf6]">
          {items.map((item, i) => (
            <div key={i}>
              <div
                onClick={() => setOpenQ(openQ === i ? null : i)}
                className="flex cursor-pointer items-start gap-2.5 border-b border-border p-3 px-4 transition-colors last:border-b-0 hover:bg-[#1a1a1e]"
              >
                <span className="mt-0.5 flex-shrink-0 text-sm text-[#8b5cf6]">
                  ?
                </span>
                <span className="text-[13px] font-medium leading-snug text-zinc-400">
                  {item.q}
                </span>
              </div>
              {openQ === i && (
                <div
                  className="border-b border-border bg-[rgba(139,92,246,0.03)] py-3 pl-10 pr-4 text-[13px] leading-relaxed text-muted-foreground [&_code]:rounded [&_code]:border [&_code]:border-border [&_code]:bg-[#1a1a1e] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.88em] [&_code]:text-[#8b5cf6] [&_strong]:text-zinc-400"
                  dangerouslySetInnerHTML={{ __html: item.a }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function TroubleshootAccordion({
  items,
}: {
  items: { label: string; error?: string; fix: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [openItem, setOpenItem] = useState<number | null>(null);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`mt-3 flex w-full items-center gap-2 rounded-[10px] border p-3 px-4 text-left text-[13px] transition-all ${
          open
            ? "rounded-b-none border-b-0 border-red-500 text-red-400"
            : "border-red-500/20 text-muted-foreground hover:border-red-500/40 hover:text-zinc-400"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="flex-shrink-0"
        >
          <path
            d="M8 1L1 14h14L8 1z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M8 6v4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="8" cy="12" r="0.75" fill="currentColor" />
        </svg>
        Got an error? Let&apos;s fix it
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`ml-auto flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="mb-2 overflow-hidden rounded-b-[10px] border border-t-0 border-red-500">
          {items.map((item, i) => (
            <div key={i}>
              <div
                onClick={() => setOpenItem(openItem === i ? null : i)}
                className="cursor-pointer border-b border-border transition-colors last:border-b-0 hover:bg-[#1a1a1e]"
              >
                <div className="flex items-start gap-2.5 p-3 px-4">
                  <span className="mt-px flex-shrink-0 text-sm text-red-500">
                    !
                  </span>
                  <div>
                    <span className="text-[13px] font-medium leading-snug text-zinc-400">
                      {item.label}
                    </span>
                    {item.error && (
                      <div className="mt-1 inline-block rounded bg-red-500/5 px-1.5 py-0.5 font-mono text-[11px] text-red-400">
                        {item.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {openItem === i && (
                <div
                  className="border-b border-border bg-red-500/[0.02] py-3 pl-10 pr-4 text-[13px] leading-relaxed text-muted-foreground [&_a]:text-[#8b5cf6] [&_code]:rounded [&_code]:border [&_code]:border-border [&_code]:bg-[#1a1a1e] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.88em] [&_code]:text-green-400 [&_strong]:text-zinc-400"
                  dangerouslySetInnerHTML={{ __html: item.fix }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
