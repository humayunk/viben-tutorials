"use client";

import type { Card } from "@/types";
import { NavButtons } from "../nav-buttons";

interface ConceptCardProps {
  card: Card;
  showBack: boolean;
  onContinue: () => void;
  onBack: () => void;
}

export function ConceptCard({
  card,
  showBack,
  onContinue,
  onBack,
}: ConceptCardProps) {
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

      {/* Concept box */}
      {card.concept && (
        <div className="my-5 rounded-[14px] border border-border bg-card p-6">
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-[#8b5cf6]">
            {card.concept.label}
          </div>
          <h3 className="mb-2 text-lg font-bold">{card.concept.title}</h3>
          <p className="text-sm text-zinc-400">{card.concept.desc}</p>
        </div>
      )}

      {/* Analogy */}
      {card.analogy && (
        <div className="my-5 flex items-center gap-4 rounded-[14px] border border-border bg-card p-5">
          <div className="flex-shrink-0 text-4xl">{card.analogy.icon}</div>
          <div
            className="text-[15px] leading-relaxed text-zinc-400 [&_strong]:text-zinc-100"
            dangerouslySetInnerHTML={{ __html: card.analogy.text }}
          />
        </div>
      )}

      {/* Diagram */}
      {card.diagram && (
        <div className="my-5 rounded-[14px] border border-border bg-card px-6 py-7 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {card.diagram.nodes.map((node, i) =>
              node === "\u2192" ? (
                <div key={i} className="text-lg text-muted-foreground">
                  &rarr;
                </div>
              ) : (
                <div
                  key={i}
                  className={`rounded-[10px] border px-4 py-2.5 text-[13px] font-semibold ${
                    card.diagram?.highlight?.includes(i)
                      ? "border-[#8b5cf6] bg-[rgba(139,92,246,0.15)] text-[#8b5cf6]"
                      : "border-border bg-background"
                  }`}
                >
                  {node}
                </div>
              )
            )}
          </div>
          {card.diagram.caption && (
            <div className="mt-3.5 text-[13px] text-muted-foreground">
              {card.diagram.caption}
            </div>
          )}
        </div>
      )}

      {/* Bullets */}
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

      {card.body2 && (
        <p
          className="mb-4 text-base leading-relaxed text-zinc-400 [&_strong]:text-zinc-100"
          dangerouslySetInnerHTML={{ __html: card.body2 }}
        />
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

      <NavButtons
        showBack={showBack}
        onBack={onBack}
        onContinue={onContinue}
        cta={card.cta}
      />
    </div>
  );
}
