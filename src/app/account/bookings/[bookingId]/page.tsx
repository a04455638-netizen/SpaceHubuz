"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  QrCode,
  CheckCircle2,
  Navigation,
} from "lucide-react";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const [booking, setBooking] = useState<{
    id: string;
    venueName: string;
    address: string;
    date: string;
    time: string;
    amount: number;
    status: string;
    paymentMethod: string;
  }>({
    id: bookingId,
    venueName: "C-Space Mirabad — Team Desk",
    address: "Toshkent shahri, Mirobod tumani, Nukus ko‘chasi, 29",
    date: "2026-11-10",
    time: "10:00 – 12:00 (2 soat)",
    amount: 90000,
    status: "CONFIRMED",
    paymentMethod: "CLICK",
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const raw = localStorage.getItem("spacehub_customer_bookings");
      if (raw) {
        try {
          const list = JSON.parse(raw);
          const match = list.find((b: { id: string }) => b.id === bookingId);
          if (match) setBooking(match);
        } catch {
          // use default
        }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [bookingId]);

  function handleCancel() {
    if (!confirm("Haqiqatan ham bu buyurtmani bekor qilmoqchimisiz?")) return;
    setBooking((prev) => ({ ...prev, status: "CANCELLED" }));

    // Update in localStorage
    const raw = localStorage.getItem("spacehub_customer_bookings");
    if (raw) {
      try {
        const list = JSON.parse(raw);
        const updated = list.map((b: { id: string }) =>
          b.id === bookingId ? { ...b, status: "CANCELLED" } : b,
        );
        localStorage.setItem(
          "spacehub_customer_bookings",
          JSON.stringify(updated),
        );
      } catch {
        // ignore
      }
    }
  }

  return (
    <div className="space-y-6">
      <Link
        href="/account/bookings"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Barcha buyurtmalarga qaytish
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
              booking.status === "CONFIRMED"
                ? "bg-status-success-bg text-status-success"
                : "bg-surface-muted text-ink-muted"
            }`}
          >
            <CheckCircle2 className="h-3 w-3" />
            {booking.status}
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
            {booking.venueName}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
            <MapPin className="h-3.5 w-3.5 text-accent" />
            {booking.address}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs text-ink-subtle">To‘langan summa:</span>
          <p className="text-xl font-extrabold text-accent">
            {booking.amount.toLocaleString("uz-UZ")} so‘m
          </p>
          <span className="text-xs text-ink-subtle">
            Usul: {booking.paymentMethod}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* QR Check-in Pass Card */}
        <div className="rounded-2xl border border-border bg-surface-card p-6 text-center shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            Raqamli Ruxsatnoma
          </span>
          <h3 className="mt-1 text-base font-bold text-ink">QR Chek-in Kodi</h3>

          <div className="mx-auto mt-4 flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-dashed border-accent bg-surface p-4">
            <QrCode className="h-36 w-36 text-ink" />
          </div>

          <p className="mt-3 font-mono text-xs font-bold text-ink">
            CODE: SH-{booking.id.slice(0, 8).toUpperCase()}
          </p>
          <p className="mt-1 text-xs text-ink-muted leading-tight">
            Joyga yetib borganingizda ma’murga ushbu kodni ko‘rsating
          </p>
        </div>

        {/* Details & Policies */}
        <div className="space-y-6 md:col-span-2">
          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm">
            <h3 className="text-sm font-bold text-ink">Vaqt va Sanalar</h3>
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-border bg-surface p-3">
                <span className="text-ink-subtle">Sana:</span>
                <p className="mt-1 font-bold text-ink">{booking.date}</p>
              </div>
              <div className="rounded-xl border border-border bg-surface p-3">
                <span className="text-ink-subtle">Vaqt oralig‘i:</span>
                <p className="mt-1 font-bold text-ink">{booking.time}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-ink-muted">
              <span>Vaqt mintaqasi:</span>
              <span className="font-semibold text-ink">
                Asia/Tashkent (UTC+5)
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm">
            <h3 className="text-sm font-bold text-ink">
              Amallar va Bekor qilish
            </h3>
            <p className="mt-2 text-xs text-ink-muted leading-relaxed">
              24 soat oldin bekor qilingan taqdirda, to‘lov summasi to‘liq
              kartangizga qaytariladi.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={booking.status === "CANCELLED"}
                className="rounded-xl border border-status-danger bg-status-danger-bg px-4 py-2 text-xs font-bold text-status-danger transition hover:opacity-90 disabled:opacity-50"
              >
                {booking.status === "CANCELLED"
                  ? "Bekor qilingan"
                  : "Buyurtmani bekor qilish"}
              </button>

              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(booking.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-card px-4 py-2 text-xs font-bold text-ink hover:bg-surface-muted transition"
              >
                <Navigation className="h-3.5 w-3.5 text-accent" />
                <span>Xaritada yo‘nalish</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
