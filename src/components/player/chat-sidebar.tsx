"use client";

import { useState, useRef, useEffect } from "react";
import type { Card } from "@/types";

interface ChatMessage {
  role: "user" | "bot";
  content: string;
}

interface ChatSidebarProps {
  card: Card;
  tutorialTitle: string;
  open: boolean;
  onClose: () => void;
}

export function ChatSidebar({
  card,
  tutorialTitle,
  open,
  onClose,
}: ChatSidebarProps) {
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

  // Focus input when sidebar opens
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
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-80 flex-col border-l border-border bg-[#0a0a0c] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-zinc-300">Ask</span>
          <button
            onClick={onClose}
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
    </>
  );
}
