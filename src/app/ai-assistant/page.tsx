"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  MapPin,
  Calendar,
  Star,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "../../lib/i18n";
import type { SuggestedVenueCard } from "../../server/ai/concierge";

interface Message {
  role: "user" | "assistant";
  content: string;
  venues?: SuggestedVenueCard[];
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
                    <div className="mt-4 space-y-3 border-t border-border pt-3">
                      <p className="text-xs font-black uppercase tracking-wider text-accent">
                        {locale === "ru"
                          ? "🎯 Рекомендуемые площадки:"
                          : locale === "en"
                          ? "🎯 Recommended venues:"
                          : "🎯 Tavsiya etilgan joylar:"}
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {msg.venues.map((v) => (
                          <div
                            key={v.slug}
                            className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm hover:border-accent/40 transition-all text-ink"
                          >
                            <div className="flex flex-col sm:flex-row">
                              {/* Venue Image */}
                              <div className="relative h-44 sm:h-auto sm:w-48 shrink-0 overflow-hidden bg-surface-muted">
                                {v.image ? (
                                  <img
                                    src={v.image}
                                    alt={v.name}
                                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center bg-accent-subtle text-accent text-xs font-bold">
                                    SpaceHub UZ
                                  </div>
                                )}
                                <span className="absolute left-2 top-2 rounded-lg bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white">
                                  {v.categoryLabel}
                                </span>
                              </div>

                              {/* Venue Details */}
                              <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                                <div>
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-sm font-black text-ink hover:text-accent">
                                      <Link href={`/venues/${v.slug}`}>{v.name}</Link>
                                    </h4>
                                    <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 shrink-0">
                                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                                      <span>{v.rating}</span>
                                      <span className="text-[10px] text-ink-muted">({v.reviewCount})</span>
                                    </div>
                                  </div>

                                  <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-muted">
                                    <MapPin className="h-3 w-3 text-accent shrink-0" />
                                    <span>{v.address}</span>
                                  </p>

                                  <p className="mt-2 text-xs text-ink-muted line-clamp-2 leading-relaxed">
                                    {v.description}
                                  </p>

                                  {/* Facilities */}
                                  {v.amenities && v.amenities.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      {v.amenities.map((am, i) => (
                                        <span
                                          key={i}
                                          className="inline-flex items-center gap-1 rounded-md bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-ink-subtle"
                                        >
                                          <CheckCircle className="h-2.5 w-2.5 text-status-success" />
                                          {am}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Price and Action Buttons */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-border pt-3">
                                  <div>
                                    <span className="text-base font-extrabold text-accent">
                                      {v.priceFormatted}
                                    </span>
                                    <span className="text-[11px] text-ink-muted">
                                      {" "}
                                      / {locale === "ru" ? "час" : locale === "en" ? "hour" : "soat"}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Link
                                      href={`/map?venue=${v.slug}`}
                                      className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[11px] font-bold text-ink hover:bg-surface-muted transition"
                                    >
                                      <MapPin className="h-3 w-3 text-accent" />
                                      <span>
                                        {locale === "ru"
                                          ? "На карте"
                                          : locale === "en"
                                          ? "Map"
                                          : "Xaritada"}
                                      </span>
                                    </Link>
                                    <Link
                                      href={`/venues/${v.slug}`}
                                      className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-3 py-1.5 text-[11px] font-bold text-ink hover:bg-surface-muted transition"
                                    >
                                      <span>
                                        {locale === "ru"
                                          ? "Детали"
                                          : locale === "en"
                                          ? "Details"
                                          : "Batafsil"}
                                      </span>
                                    </Link>
                                    <Link
                                      href={
                                        v.bookingResourceId
                                          ? `/booking/${v.bookingResourceId}`
                                          : `/venues/${v.slug}`
                                      }
                                      className="inline-flex items-center gap-1 rounded-xl bg-accent px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-accent-hover transition"
                                    >
                                      <Calendar className="h-3 w-3" />
                                      <span>
                                        {locale === "ru"
                                          ? "Забронировать"
                                          : locale === "en"
                                          ? "Book Now"
                                          : "Band qilish"}
                                      </span>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
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
