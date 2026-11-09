"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Send, Bot, User, ArrowRight } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  venues?: Array<{
    name: string;
    slug: string;
    city: string;
    address: string;
  }>;
}

export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Assalomu alaykum! Men SpaceHub UZ aqlli yordamchisiman. Sizga qanday joy kerak? Masalan, sport maydoni, sokin ish stoli yoki majlis xonasi qidiryapsizmi?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestedPrompts = [
    "Chilonzorda ertaga kechqurun bo‘sh futbol maydonlarini ko‘rsat",
    "20 kishilik konferensiya xonasi kerak",
    "2 ta coworking joyini narxi va imkoniyatlari bo‘yicha solishtir",
  ];

  async function handleSend(textToSend?: string) {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: query },
    ];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok) throw new Error("AI request failed");
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.message,
          venues: data.suggestedVenues,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Kechirasiz, vaqtinchalik javob olishda uzilish bo'ldi. Iltimos, katalog orqali to'g'ridan-to'g'ri qidirib ko'ring yoki qayta urinib ko'ring.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-sm">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
            SpaceHub AI Konsyerj
          </h1>
          <p className="text-xs text-ink-muted">
            Faqat tasdiqlangan bazadagi ma’lumotlar asosida aniq tavsiyalar
            beradi
          </p>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="mt-6 flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="rounded-full border border-border bg-surface-card px-3.5 py-1.5 text-xs font-semibold text-ink-muted transition hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="mt-6 min-h-[420px] rounded-2xl border border-border bg-surface-card p-4 sm:p-6 shadow-sm">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent text-white"
                    : "bg-surface-muted text-ink"
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {msg.venues && msg.venues.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-border pt-3">
                    <p className="text-xs font-bold text-accent">
                      Tavsiya etilgan joylar:
                    </p>
                    {msg.venues.map((v) => (
                      <Link
                        key={v.slug}
                        href={`/venues/${v.slug}`}
                        className="flex items-center justify-between rounded-lg bg-surface-card p-2 text-xs font-semibold text-ink transition hover:shadow"
                      >
                        <div>
                          <p className="font-bold">{v.name}</p>
                          <p className="text-ink-subtle">
                            {v.city} · {v.address}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-accent" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-ink text-white">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-ink-muted">
              <Bot className="h-4 w-4 animate-spin text-accent" />
              <span>SpaceHub AI javob tayyorlamoqda…</span>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Savolingizni yoki kerakli joy talablarini yozing…"
          disabled={loading}
          className="flex-1 rounded-xl border border-border bg-surface-card px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          <span>Yuborish</span>
        </button>
      </form>
    </main>
  );
}
