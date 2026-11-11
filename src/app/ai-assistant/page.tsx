"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Send, Bot, User, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "../../lib/i18n";

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
  const { locale, t } = useI18n();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const displayMessages: Message[] =
    messages.length > 0
      ? messages
      : [{ role: "assistant", content: t.ai.greeting }];

  const quickPrompts = [
    t.ai.quickPrompts.coworking,
    t.ai.quickPrompts.sports,
    t.ai.quickPrompts.meetings,
  ];

  async function handleSend(textToSend?: string) {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const baseList =
      messages.length > 0
        ? messages
        : [{ role: "assistant" as const, content: t.ai.greeting }];
    const newMessages: Message[] = [
      ...baseList,
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
          locale,
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
      const fallbackMsg =
        locale === "ru"
          ? "Извините, возникла задержка при соединении. Попробуйте еще раз или найдите нужное место через каталог."
          : locale === "en"
          ? "Sorry, there was a temporary issue fetching the response. Please try again or browse the catalog."
          : "Kechirasiz, vaqtinchalik javob olishda uzilish bo'ldi. Iltimos, katalog orqali qidirib ko'ring yoki qayta urinib ko'ring.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: fallbackMsg,
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
            {t.ai.title}
          </h1>
          <p className="text-xs text-ink-muted">
            {t.ai.subtitle}
          </p>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="mt-6 flex flex-wrap gap-2">
        {quickPrompts.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSend(prompt)}
            disabled={loading}
            className="rounded-full border border-border bg-surface-card px-3.5 py-1.5 text-xs font-semibold text-ink-muted transition hover:border-accent hover:text-accent disabled:opacity-60 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="mt-6 min-h-[420px] rounded-2xl border border-border bg-surface-card p-4 sm:p-6 shadow-sm">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {displayMessages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
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
                        {locale === "ru" ? "Рекомендуемые площадки:" : locale === "en" ? "Recommended venues:" : "Tavsiya etilgan joylar:"}
                      </p>
                      {msg.venues.map((v) => (
                        <Link
                          key={v.slug}
                          href={`/venues/${v.slug}`}
                          className="flex items-center justify-between rounded-lg bg-surface-card p-2 text-xs font-semibold text-ink transition hover:shadow border border-border"
                        >
                          <div>
                            <p className="font-bold">{v.name}</p>
                            <p className="text-ink-subtle">
                              {v.city} &middot; {v.address}
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
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-xs text-ink-muted"
            >
              <Bot className="h-4 w-4 animate-spin text-accent" />
              <span>{locale === "ru" ? "SpaceHub AI готовит ответ..." : locale === "en" ? "SpaceHub AI is thinking..." : "SpaceHub AI javob tayyorlamoqda..."}</span>
            </motion.div>
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
          placeholder={t.ai.placeholder}
          disabled={loading}
          className="flex-1 rounded-xl border border-border bg-surface-card px-4 py-3 text-sm text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="flex items-center gap-1.5 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
        >
          <Send className="h-4 w-4" />
          <span>{t.ai.send}</span>
        </button>
      </form>
      <p className="mt-2 text-center text-[11px] text-ink-subtle">{t.ai.disclaimer}</p>
    </main>
  );
}
