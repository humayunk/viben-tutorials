"use client";

import { useState, useRef, useEffect } from "react";
import type { Card } from "@/types";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

interface ChatBubbleProps {
  card: Card;
  tutorialTitle: string;
  open: boolean;
  onToggle: () => void;
}

export function ChatBubble({
  card,
  tutorialTitle,
  open,
  onToggle,
}: ChatBubbleProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevCardTitleRef = useRef<string | undefined>(undefined);

  // Seed initial messages when card changes
  useEffect(() => {
    if (card.title !== prevCardTitleRef.current) {
      prevCardTitleRef.current = card.title;
      const initial = card.modalities?.ask?.initialMessages;
      if (initial?.length) {
        setMessages([...initial]);
      } else {
        setMessages([
          {
            role: "bot",
            content: `Ask me anything about this step — I'm here to help!`,
          },
        ]);
      }
    }
  }, [card]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated,
          cardContext: {
            type: card.type,
            title: card.title,
            body: card.body,
            tutorialTitle,
          },
        }),
      });

      if (!res.ok) throw new Error("Chat request failed");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <button
        onClick={onToggle}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-lg transition-all hover:bg-[#7c3aed] hover:scale-105 active:scale-95 sm:right-8"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? (
          <svg
            width="22"
            height="22"
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
        ) : (
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat popup panel */}
      {open && (
        <div
          className="fixed bottom-[5.5rem] right-5 z-50 flex w-[22rem] flex-col rounded-2xl border border-border bg-[#0a0a0c] shadow-2xl sm:right-8 sm:w-96"
          style={{
            height: "min(28rem, calc(100dvh - 12rem))",
            animation: "chat-panel-in 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between rounded-t-2xl border-b border-border px-4 py-3">
            <span className="text-sm font-semibold text-zinc-300">Ask</span>
            <button
              onClick={onToggle}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-zinc-800 hover:text-zinc-300"
              aria-label="Close chat"
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

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#8b5cf6]/20 text-zinc-200"
                        : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-xl bg-zinc-800 px-3.5 py-2.5 text-[13px] text-zinc-500">
                    <span className="inline-flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce [animation-delay:0.1s]">.</span>
                      <span className="animate-bounce [animation-delay:0.2s]">.</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={loading}
                className="flex-1 rounded-lg border border-border bg-zinc-900 px-3 py-2 text-sm text-zinc-200 placeholder:text-muted-foreground/50 focus:border-[#8b5cf6]/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                  loading || !input.trim()
                    ? "bg-[#8b5cf6]/30 text-zinc-500"
                    : "bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                }`}
                aria-label="Send message"
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
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
