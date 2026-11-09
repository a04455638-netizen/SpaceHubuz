"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);

  const [paymentMethod, setPaymentMethod] = useState<
    "click" | "payme" | "on_arrival"
  >("click");
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState<{
    date: string;
    startHour: string;
    durationHours: number;
    total: number;
  }>({
    date: new Date().toISOString().split("T")[0],
    startHour: "10:00",
    durationHours: 1,
    total: 52500,
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const raw = sessionStorage.getItem(`booking_${bookingId}`);
      if (raw) {
        try {
          setBookingData(JSON.parse(raw));
        } catch {
          // use default
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [bookingId]);

  async function handleConfirmBooking() {
    if (!agreed || processing) return;
    setProcessing(true);

    try {
      // Store confirmed booking record in localStorage to ensure cross-reloads persistency
      const existing = JSON.parse(
        localStorage.getItem("spacehub_customer_bookings") || "[]",
      );
      const newBooking = {
        id: bookingId,
        venueName: "SpaceHub Premium Venue",
        address: "Toshkent shahri, Mirobod tumani, Nukus ko‘chasi, 29",
        date: bookingData.date,
        time: `${bookingData.startHour} (${bookingData.durationHours} soat)`,
        amount: bookingData.total,
        status: "CONFIRMED",
        paymentMethod: paymentMethod.toUpperCase(),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "spacehub_customer_bookings",
        JSON.stringify([newBooking, ...existing]),
      );

      // Simulate payment verification delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setConfirmed(true);
    } finally {
      setProcessing(false);
    }
  }

  if (confirmed) {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-status-success-bg text-status-success">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="mt-5 text-2xl font-extrabold text-ink sm:text-3xl">
          Buyurtmangiz muvaffaqiyatli tasdiqlandi!
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Buyurtma raqami: <strong className="text-ink">{bookingId}</strong>
        </p>
        <p className="mt-1 text-xs text-ink-subtle">
          Barcha tafsilotlar, manzil va QR ruxsatnoma shaxsiy kabinetingizda
          saqlandi.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/account/bookings"
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white transition hover:bg-accent-hover shadow"
          >
            Buyurtmalarimga o‘tish
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-border bg-surface-card px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-surface-muted"
          >
            Bosh sahifa
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Bronlashga qaytish
      </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
          To‘lov va Tasdiqlash
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Buyurtma kodi: <code className="font-mono text-xs">{bookingId}</code>
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left: Payment Method Selection */}
        <div className="space-y-6 md:col-span-2">
          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm">
            <h2 className="text-base font-bold text-ink">
              To‘lov usulini tanlang
            </h2>
            <div className="mt-4 space-y-3">
              {/* Click */}
              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  paymentMethod === "click"
                    ? "border-accent bg-accent-subtle/30"
                    : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="click"
                    checked={paymentMethod === "click"}
                    onChange={() => setPaymentMethod("click")}
                    className="accent-accent"
                  />
                  <div>
                    <p className="text-sm font-bold text-ink">Click Up</p>
                    <p className="text-xs text-ink-subtle">
                      Click ilovasi yoki karta orqali onlayn to‘lov
                    </p>
                  </div>
                </div>
                <span className="rounded bg-[#0073ff] px-2 py-0.5 text-xs font-bold text-white">
                  CLICK
                </span>
              </label>

              {/* Payme */}
              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  paymentMethod === "payme"
                    ? "border-accent bg-accent-subtle/30"
                    : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="payme"
                    checked={paymentMethod === "payme"}
                    onChange={() => setPaymentMethod("payme")}
                    className="accent-accent"
                  />
                  <div>
                    <p className="text-sm font-bold text-ink">Payme</p>
                    <p className="text-xs text-ink-subtle">
                      Humo / Uzcard kartalari orqali tezkor to‘lov
                    </p>
                  </div>
                </div>
                <span className="rounded bg-[#00cccc] px-2 py-0.5 text-xs font-bold text-white">
                  PAYME
                </span>
              </label>

              {/* On Arrival */}
              <label
                className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition ${
                  paymentMethod === "on_arrival"
                    ? "border-accent bg-accent-subtle/30"
                    : "border-border bg-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="on_arrival"
                    checked={paymentMethod === "on_arrival"}
                    onChange={() => setPaymentMethod("on_arrival")}
                    className="accent-accent"
                  />
                  <div>
                    <p className="text-sm font-bold text-ink">Joyida to‘lash</p>
                    <p className="text-xs text-ink-subtle">
                      Obyekt ma’muriyatiga naqd yoki terminalda to‘lash
                    </p>
                  </div>
                </div>
                <span className="rounded bg-surface-muted px-2 py-0.5 text-xs font-semibold text-ink-muted">
                  Joyida
                </span>
              </label>
            </div>
          </div>

          {/* Cancellation Policy & Agreement */}
          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm">
            <h3 className="text-sm font-bold text-ink">
              Bekor qilish va xavfsizlik siyosati
            </h3>
            <p className="mt-2 text-xs text-ink-muted leading-relaxed">
              Bron boshlanishidan kamida 24 soat oldin bekor qilinsa, to‘langan
              summa 100% qaytariladi. 24 soatdan kam vaqt qolganda bekor
              qilishda birinchi soat ijara haqi ushlab qolinadi.
            </p>

            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-accent"
              />
              <span className="text-xs text-ink">
                Foydalanish shartlari va bekor qilish siyosatiga roziman.
              </span>
            </label>
          </div>
        </div>

        {/* Right Summary */}
        <div className="h-fit rounded-2xl border border-border bg-surface-card p-5 shadow-sm">
          <h2 className="text-base font-bold text-ink">To‘lov xulosasi</h2>
          <div className="mt-4 space-y-2.5 text-xs text-ink-muted">
            <div className="flex justify-between">
              <span>Sana:</span>
              <span className="font-semibold text-ink">{bookingData.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Vaqt:</span>
              <span className="font-semibold text-ink">
                {bookingData.startHour} ({bookingData.durationHours} soat)
              </span>
            </div>
            <div className="flex justify-between">
              <span>To‘lov usuli:</span>
              <span className="font-semibold text-ink uppercase">
                {paymentMethod}
              </span>
            </div>

            <div className="my-2 border-t border-border pt-2 flex justify-between text-base font-extrabold text-ink">
              <span>Jami:</span>
              <span className="text-accent">
                {bookingData.total.toLocaleString("uz-UZ")} so‘m
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={!agreed || processing}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3 text-sm font-bold text-white shadow transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processing ? "To‘lov tekshirilmoqda…" : "To‘lash va Tasdiqlash"}
          </button>
        </div>
      </div>
    </main>
  );
}
