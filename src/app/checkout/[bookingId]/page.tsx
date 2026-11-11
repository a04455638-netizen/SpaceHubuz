"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { formatPrice } from "@/lib/format-price";

interface BookingDetail {
  id: string;
  bookingNumber: string;
  totalAmount: number;
  startsAt: string;
  endsAt: string;
  durationHours: number;
  expiresAt?: string;
  status: string;
  resource?: {
    name: string;
    venue?: {
      name: string;
      address: string;
      city: string;
    };
  };
}

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);

  const [paymentMethod, setPaymentMethod] = useState<"click" | "payme" | "cash">("click");
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState("");
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins in seconds

  useEffect(() => {
    // 1. Fetch booking info from API
    fetch(`/api/bookings/${bookingId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.booking) {
          setBooking(data.booking);
          if (data.booking.status === "CONFIRMED") {
            setConfirmed(true);
          }
        }
      })
      .catch(() => {});

    // 2. Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [bookingId]);

  async function handleConfirmBooking() {
    if (!agreed || processing) return;
    setProcessing(true);
    setError("");

    const providerMap = {
      click: "CLICK",
      payme: "PAYME",
      cash: "CASH_AT_VENUE",
    } as const;

    try {
      const res = await fetch("/api/bookings/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          provider: providerMap[paymentMethod],
          idempotencyKey: `idem-${bookingId}-${Date.now()}`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "To'lovni tasdiqlashda xatolik yuz berdi");
        setProcessing(false);
        return;
      }

      // Persist to user's bookings list
      try {
        const raw = localStorage.getItem("spacehub_customer_bookings");
        const list = raw ? JSON.parse(raw) : [];
        const newBooking = {
          id: bookingId,
          venueName:
            booking?.resource?.venue?.name ||
            booking?.resource?.name ||
            "SpaceHub Workspace",
          address: booking?.resource?.venue?.address || "Toshkent shahri",
          date: booking?.startsAt
            ? booking.startsAt.split("T")[0]
            : new Date().toISOString().split("T")[0],
          time: booking?.startsAt
            ? `${booking.startsAt.slice(11, 16)} – ${booking.endsAt.slice(11, 16)}`
            : "10:00 – 12:00",
          amount: booking?.totalAmount || 50000,
          status: "CONFIRMED",
          paymentMethod: providerMap[paymentMethod],
        };
        const updated = [
          newBooking,
          ...list.filter((b: { id: string }) => b.id !== bookingId),
        ];
        localStorage.setItem(
          "spacehub_customer_bookings",
          JSON.stringify(updated)
        );
      } catch {
        // ignore
      }

      setConfirmed(true);
    } catch {
      setError("Tarmoq xatosi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setProcessing(false);
    }
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  if (confirmed) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="rounded-3xl border border-border bg-surface-card p-8 sm:p-10 shadow-sm space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-status-success-bg text-status-success">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-status-success-bg px-3 py-1 text-xs font-bold text-status-success">
              <ShieldCheck className="h-3.5 w-3.5" /> To&apos;lov tasdiqlandi
            </span>
            <h1 className="text-2xl font-black text-ink">
              Bron muvaffaqiyatli amalga oshirildi!
            </h1>
            <p className="text-xs text-ink-muted">
              Bron raqami:{" "}
              <span className="font-mono font-bold text-ink">
                {booking?.bookingNumber || bookingId}
              </span>
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-4 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-ink-muted">Joy / Zal:</span>
              <span className="font-bold text-ink">{booking?.resource?.name || "Smart Coworking Joyi"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Manzil:</span>
              <span className="font-semibold text-ink">{booking?.resource?.venue?.address || "Amir Temur shoh ko'chasi, Toshkent"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">To&apos;langan summa:</span>
              <span className="font-bold text-accent">{formatPrice(booking?.totalAmount || 52500)} UZS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Holat:</span>
              <span className="font-bold text-status-success">CONFIRMED (Faol)</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/account/bookings/${bookingId}`}
              className="flex-1 rounded-xl bg-accent py-3 text-xs font-bold text-white shadow-sm transition hover:bg-accent-hover text-center"
            >
              QR kod va Chiptani ko&apos;rish
            </Link>
            <Link
              href="/account/bookings"
              className="flex-1 rounded-xl border border-border bg-surface-card py-3 text-xs font-bold text-ink shadow-sm transition hover:bg-surface-muted text-center"
            >
              Barcha bronlarim
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <Link
        href="/explore"
        className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Bosh sahifaga qaytish
      </Link>

      <div className="rounded-2xl border border-border bg-surface-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6 gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
              Buyurtmani tasdiqlash va To&apos;lov
            </h1>
            <p className="mt-1 text-xs text-ink-muted">
              Xavfsiz milliy to&apos;lov tizimlari orqali to&apos;lovni yakunlang
            </p>
          </div>

          {/* Countdown timer */}
          <div className="inline-flex items-center gap-2 rounded-xl bg-status-warning-bg px-3.5 py-1.5 text-xs font-bold text-status-warning self-start">
            <Clock className="h-4 w-4" />
            <span>Qolgan vaqt: {formattedTime}</span>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-status-danger-bg p-3.5 text-xs font-semibold text-status-danger">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Details */}
        <div className="rounded-xl border border-border bg-surface p-4 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-ink-muted">Bron raqami:</span>
            <span className="font-mono font-bold text-ink">{booking?.bookingNumber || bookingId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Joy / Resurs:</span>
            <span className="font-bold text-ink">{booking?.resource?.name || "Smart Coworking Joyi"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Umumiy to&apos;lov:</span>
            <span className="font-extrabold text-accent text-sm">
              {formatPrice(booking?.totalAmount || 52500)} UZS
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
            To&apos;lov usulini tanlang
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { id: "click", name: "Click.uz", desc: "Uzcard & Humo" },
              { id: "payme", name: "Payme", desc: "Uzcard & Humo" },
              { id: "cash", name: "Joyida to'lash", desc: "Naqd yoki karta" },
            ].map((method) => {
              const selected = paymentMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as "click" | "payme" | "cash")}
                  className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                    selected
                      ? "border-accent bg-accent-subtle/30 shadow-sm"
                      : "border-border hover:bg-surface-muted"
                  }`}
                >
                  <p className="text-sm font-bold text-ink">{method.name}</p>
                  <p className="text-[10px] text-ink-muted">{method.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="border-t border-border pt-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-xs text-ink-muted">
              Men{" "}
              <Link href="/legal/terms" className="text-accent underline font-semibold">
                Foydalanish shartlari
              </Link>{" "}
              va bekor qilish qoidalariga roziman.
            </span>
          </label>
        </div>

        <button
          onClick={handleConfirmBooking}
          disabled={!agreed || processing || timeLeft === 0}
          className="flex w-full items-center justify-center rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {processing ? "To'lov amalga oshirilmoqda..." : "To'lovni tasdiqlash"}
        </button>
      </div>
    </div>
  );
}
