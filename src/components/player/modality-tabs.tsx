"use client";

import { useState } from "react";
import type { Modalities } from "@/types";

interface ModalityTabsProps {
  modalities: Modalities;
}

const TAB_LABELS: Record<keyof Modalities, string> = {
  read: "Read",
  watch: "Watch",
  try: "Try",
  ask: "Ask",
};

export function ModalityTabs({ modalities }: ModalityTabsProps) {
  const modes = Object.keys(modalities) as (keyof Modalities)[];
  const [active, setActive] = useState<keyof Modalities>(modes[0]);

  if (modes.length === 0) return null;

  return (
    <div className="rounded-[14px] border border-border bg-card">
      {/* Tab bar */}
      <div className="flex border-b border-border">
        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => setActive(mode)}
            className={`flex-1 px-4 py-3 text-center text-sm font-medium transition-colors ${
              active === mode
                ? "border-b-2 border-[#8b5cf6] text-[#8b5cf6]"
                : "text-muted-foreground hover:text-zinc-400"
            }`}
          >
            {TAB_LABELS[mode]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {active === "read" && modalities.read && (
          <ReadContent data={modalities.read} />
        )}
        {active === "watch" && modalities.watch && (
          <WatchContent data={modalities.watch} />
        )}
        {active === "try" && modalities.try && (
          <TryContent data={modalities.try} />
        )}
        {active === "ask" && modalities.ask && (
          <AskContent data={modalities.ask} />
        )}
      </div>
    </div>
  );
}

function ReadContent({ data }: { data: NonNullable<Modalities["read"]> }) {
  return (
    <div>
      <div
        className="text-sm leading-relaxed text-zinc-400 [&_strong]:text-zinc-100"
        dangerouslySetInnerHTML={{ __html: data.body }}
      />
      {data.codeBlocks?.map((block, i) => (
        <div key={i} className="mt-3">
          <pre className="overflow-x-auto rounded-[10px] border border-border bg-[#1a1a1e] px-[18px] py-4 font-mono text-[13.5px] leading-[1.8] text-green-400">
            {block.code}
          </pre>
          {block.caption && (
            <p className="mt-1 text-xs text-muted-foreground">{block.caption}</p>
          )}
        </div>
      ))}
      {data.callouts?.map((callout, i) => {
        const styles: Record<string, string> = {
          warn: "border-yellow-500/15 bg-yellow-500/10 text-[#d4a406]",
          safe: "border-green-500/15 bg-green-500/10 text-[#4ade80]",
          tip: "border-[#8b5cf6]/15 bg-[#8b5cf6]/10 text-[#a78bfa]",
          info: "border-blue-500/15 bg-blue-500/10 text-blue-400",
        };
        return (
          <div
            key={i}
            className={`mt-3 rounded-xl border px-[18px] py-4 text-sm leading-relaxed ${styles[callout.type] || styles.info}`}
            dangerouslySetInnerHTML={{ __html: callout.text }}
          />
        );
      })}
    </div>
  );
}

function WatchContent({ data }: { data: NonNullable<Modalities["watch"]> }) {
  // Convert YouTube URLs to embed format
  let embedUrl = data.videoUrl;
  if (embedUrl.includes("youtube.com/watch")) {
    const url = new URL(embedUrl);
    const videoId = url.searchParams.get("v");
    if (videoId) {
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // Add start/end time params
  const params = new URLSearchParams();
  if (data.startTime) {
    params.set("start", timeToSeconds(data.startTime).toString());
  }
  if (data.endTime) {
    params.set("end", timeToSeconds(data.endTime).toString());
  }
  const paramStr = params.toString();
  if (paramStr) {
    embedUrl += (embedUrl.includes("?") ? "&" : "?") + paramStr;
  }

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-lg">
        <iframe
          src={embedUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {data.source && (
        <div className="mt-3 text-xs text-muted-foreground">
          {data.source.author}
          {data.source.description && ` — ${data.source.description}`}
          {data.startTime && ` (${data.startTime}`}
          {data.endTime && ` - ${data.endTime}`}
          {data.startTime && ")"}
        </div>
      )}
    </div>
  );
}

function TryContent({ data }: { data: NonNullable<Modalities["try"]> }) {
  return (
    <div>
      <p className="mb-3 text-sm text-zinc-400">{data.prompt}</p>
      <div className="overflow-hidden rounded-[10px] border border-border bg-[#0a0a0c]">
        {data.commands.map((cmd, i) => (
          <div key={i} className="border-b border-border p-3 last:border-b-0">
            <div className="font-mono text-[13px] text-green-400">
              <span className="text-muted-foreground">$ </span>
              {cmd.input}
            </div>
            <div className="mt-1 font-mono text-[13px] text-zinc-400">
              {cmd.output}
            </div>
            {cmd.hint && (
              <div className="mt-1 text-xs italic text-muted-foreground">
                {cmd.hint}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AskContent({ data }: { data: NonNullable<Modalities["ask"]> }) {
  return (
    <div className="space-y-3">
      {data.initialMessages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-[#8b5cf6]/20 text-zinc-200"
                : "bg-zinc-800 text-zinc-400"
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
    </div>
  );
}

function timeToSeconds(time: string): number {
  const parts = time.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}
