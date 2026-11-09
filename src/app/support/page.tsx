"use client";

import { useState } from "react";
import { HelpCircle, MessageSquare, Send, Check } from "lucide-react";

export default function SupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const faqs = [
    {
      q: "Qanday qilib joyni bron qilish mumkin?",
      a: "Katalogdan o‘zingizga mos joyni tanlang, sana va vaqt oralig‘ini belgilang hamda Click, Payme yoki joyida to‘lash orqali tasdiqlang.",
    },
    {
      q: "Bron qilingan vaqtni bekor qilsam pulim qaytariladimi?",
      a: "Ha, bron boshlanishiga 24 soatdan ortiq vaqt qolganda bekor qilinsa, to‘lov summasi 100% qaytariladi.",
    },
    {
      q: "Bitta vaqtni ikki kishi bron qilib qo‘yishi mumkinmi?",
      a: "Aslo yo‘q. SpaceHub UZ ma’lumotlar bazasi darajasida PostgreSQL GiST exclusion constraint orqali ikki tomonlama bandlikni to‘liq bloklaydi.",
    },
    {
      q: "Joy egalari qanday qilib o‘z obyektlarini joylashtirishi mumkin?",
      a: "Joy egalari portaliga o‘tib, tashkilot nomi va obyekt ma’lumotlarini kiritish orqali yangi joy arizasi yuborish mumkin.",
    },
  ];

  function handleSubmitTicket(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setSubject("");
    setMessage("");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-accent">
          Mijozlarni qo‘llab-quvvatlash
        </span>
        <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
          Qanday yordam bera olamiz?
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Tez-tez so‘raladigan savollarga javoblar yoki to‘g‘ridan-to‘g‘ri
          murojaat
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* FAQ Section */}
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <HelpCircle className="h-5 w-5 text-accent" />
            Ko‘p so‘raladigan savollar
          </h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm"
              >
                <h3 className="text-sm font-bold text-ink">{faq.q}</h3>
                <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Support Ticket Form */}
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <MessageSquare className="h-5 w-5 text-accent" />
            Yangi murojaat yo‘llash
          </h2>

          <div className="mt-4 rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
            {submitted ? (
              <div className="text-center py-8">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-status-success-bg text-status-success">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-base font-bold text-ink">
                  Murojaatingiz qabul qilindi!
                </h3>
                <p className="mt-1 text-xs text-ink-muted">
                  Mutaxassislarimiz 15 daqiqa ichida siz bilan bog‘lanadi.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 text-xs font-bold text-accent hover:underline"
                >
                  Yana boshqa savol yuborish
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Mavzu
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Masalan, to‘lov yoki bron sanasi bo‘yicha"
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                    Batafsil xabar
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Muammo yoki savolingizni batafsil yozing…"
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-bold text-white shadow transition hover:bg-accent-hover"
                >
                  <Send className="h-4 w-4" />
                  <span>Murojaatni yuborish</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
