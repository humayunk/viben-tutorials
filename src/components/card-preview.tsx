"use client";

import type { Card } from "@/types";
import { Badge } from "@/components/ui/badge";
import { AccordionItem } from "@/components/ui/accordion";

function CardShell({
  card,
  index,
  children,
}: {
  card: Card;
  index: number;
  children?: React.ReactNode;
}) {
  const typeColors: Record<string, string> = {
    intro: "bg-blue-500/10 border-blue-500/30",
    concept: "bg-purple-500/10 border-purple-500/30",
    action: "bg-green-500/10 border-green-500/30",
    quiz: "bg-yellow-500/10 border-yellow-500/30",
    choice: "bg-orange-500/10 border-orange-500/30",
    milestone: "bg-pink-500/10 border-pink-500/30",
    celebration: "bg-amber-500/10 border-amber-500/30",
  };

  return (
    <div
      className={`rounded-xl border p-4 ${typeColors[card.type] || "border-border"}`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg">{card.emoji}</span>
        <Badge variant="outline" className="text-xs uppercase">
          {card.type}
        </Badge>
        <span className="text-xs text-muted-foreground">#{index + 1}</span>
      </div>
      {card.title && <h4 className="mb-2 font-semibold">{card.title}</h4>}
      {card.body && (
        <div
          className="text-sm text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: card.body }}
        />
      )}
      {children}
      {card.cta && (
        <div className="mt-3">
          <span className="inline-block rounded-md bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
            {card.cta}
          </span>
        </div>
      )}
    </div>
  );
}

function ConceptExtras({ card }: { card: Card }) {
  return (
    <>
      {card.analogy && (
        <div className="mt-3 flex gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
          <span className="text-lg">{card.analogy.icon}</span>
          <div dangerouslySetInnerHTML={{ __html: card.analogy.text }} />
        </div>
      )}
      {card.diagram && (
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
          {card.diagram.nodes.map((node, i) => (
            <span
              key={i}
              className={
                card.diagram?.highlight?.includes(i)
                  ? "font-bold text-primary"
                  : ""
              }
            >
              {node}
            </span>
          ))}
          {card.diagram.caption && (
            <p className="mt-1 w-full text-xs text-muted-foreground">
              {card.diagram.caption}
            </p>
          )}
        </div>
      )}
      {card.bullets && (
        <ul className="mt-3 space-y-1 text-sm">
          {card.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted-foreground">-</span>
              <span dangerouslySetInnerHTML={{ __html: b }} />
            </li>
          ))}
        </ul>
      )}
      {card.warn && (
        <div className="mt-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm">
          <span dangerouslySetInnerHTML={{ __html: card.warn }} />
        </div>
      )}
      {card.safe && (
        <div className="mt-3 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm">
          <span dangerouslySetInnerHTML={{ __html: card.safe }} />
        </div>
      )}
    </>
  );
}

function ActionExtras({ card }: { card: Card }) {
  return (
    <>
      {card.code && (
        <div className="mt-3">
          {card.codeLabel && (
            <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
              {card.codeLabel}
            </p>
          )}
          <pre className="overflow-x-auto rounded-lg bg-zinc-900 p-3 text-sm text-green-400">
            <code>{card.code}</code>
          </pre>
          {card.codeCaption && (
            <p className="mt-1 text-xs text-muted-foreground">
              {card.codeCaption}
            </p>
          )}
        </div>
      )}
      {card.link && (
        <p className="mt-2 text-sm">
          <a
            href={card.link.url}
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {card.link.text}
          </a>
        </p>
      )}
      {card.helpItems && card.helpItems.length > 0 && (
        <div className="mt-3">
          {card.helpItems.map((item, i) => (
            <AccordionItem key={i} title={item.q}>
              <div dangerouslySetInnerHTML={{ __html: item.a }} />
            </AccordionItem>
          ))}
        </div>
      )}
      {card.troubleshoot && card.troubleshoot.length > 0 && (
        <div className="mt-3">
          {card.troubleshoot.map((item, i) => (
            <AccordionItem key={i} title={item.label}>
              {item.error && (
                <pre className="mb-2 rounded bg-zinc-900 p-2 text-xs text-red-400">
                  {item.error}
                </pre>
              )}
              <div dangerouslySetInnerHTML={{ __html: item.fix }} />
            </AccordionItem>
          ))}
        </div>
      )}
    </>
  );
}

function QuizPreview({ card }: { card: Card }) {
  return (
    <>
      {card.question && (
        <p className="mt-2 font-medium">{card.question}</p>
      )}
      {card.options && (
        <div className="mt-2 space-y-2">
          {card.options.map((opt, i) => (
            <div
              key={i}
              className={`rounded-lg border p-2 text-sm ${
                opt.correct
                  ? "border-green-500/50 bg-green-500/10"
                  : "border-border"
              }`}
            >
              {opt.text}
              {opt.correct && (
                <span className="ml-2 text-xs text-green-400">correct</span>
              )}
            </div>
          ))}
        </div>
      )}
      {card.correctFeedback && (
        <p className="mt-2 text-xs text-green-400">
          {card.correctFeedback}
        </p>
      )}
    </>
  );
}

function ModalitiesPreview({ card }: { card: Card }) {
  if (!card.modalities) return null;
  const modes = Object.keys(card.modalities) as Array<
    keyof typeof card.modalities
  >;
  return (
    <div className="mt-3 rounded-lg border border-border bg-secondary/30 p-3">
      <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
        Modalities: {modes.join(", ")}
      </p>
      {card.modalities.watch && (
        <p className="text-xs text-muted-foreground">
          Video: {card.modalities.watch.source?.author} (
          {card.modalities.watch.startTime}
          {card.modalities.watch.endTime
            ? ` - ${card.modalities.watch.endTime}`
            : ""}
          )
        </p>
      )}
    </div>
  );
}

export function CardPreview({ cards }: { cards: Card[] }) {
  return (
    <div className="space-y-3">
      {cards.map((card, i) => (
        <CardShell key={i} card={card} index={i}>
          {card.type === "concept" && <ConceptExtras card={card} />}
          {card.type === "action" && <ActionExtras card={card} />}
          {card.type === "quiz" && <QuizPreview card={card} />}
          {card.modalities && <ModalitiesPreview card={card} />}
        </CardShell>
      ))}
    </div>
  );
}
