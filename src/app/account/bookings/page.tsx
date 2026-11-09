"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  QrCode,
} from "lucide-react";

interface BookingItem {
  id: string;
  venueName: string;
  address: string;
  date: string;
  time: string;
  amount: number;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED" | "PENDING";
  paymentMethod: string;
}

export default function AccountBookingsPage() {
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [filter, setFilter] = useState<"ALL" | "CONFIRMED" | "CANCELLED">(
    "ALL",
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      // Read persistent customer bookings
      const saved = localStorage.getItem("spacehub_customer_bookings");
      if (saved) {
        try {
          setBookings(JSON.parse(saved));
        } catch {
          // empty
        }
      } else {
        // Default initial demo booking to demonstrate persistent UI
        const initialBookings: BookingItem[] = [
          {
            id: "bkg_tashkent_01",
            venueName: "C-Space Mirabad — Team Desk",
            address: "Toshkent shahri, Mirobod tumani, Nukus ko‘chasi, 29",
            date: "2026-11-10",
            time: "10:00 – 12:00 (2 soat)",
            amount: 90000,
            status: "CONFIRMED",
            paymentMethod: "CLICK",
          },
        ];
        setBookings(initialBookings);
        localStorage.setItem(
          "spacehub_customer_bookings",
          JSON.stringify(initialBookings),
        );
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const filtered = bookings.filter((b) =>
    filter === "ALL" ? true : b.status === filter,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
            Mening buyurtmalarim
          </h1>
          <p className="text-xs text-ink-muted">
            Barcha kelgusi va o‘tgan bronlaringiz ro‘yxati
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 rounded-xl border border-border bg-surface-card p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`rounded-lg px-3 py-1.5 transition ${
              filter === "ALL"
                ? "bg-accent text-white"
                : "text-ink hover:text-accent"
            }`}
          >
            Barchasi
          </button>
          <button
            type="button"
            onClick={() => setFilter("CONFIRMED")}
            className={`rounded-lg px-3 py-1.5 transition ${
              filter === "CONFIRMED"
                ? "bg-accent text-white"
                : "text-ink hover:text-accent"
            }`}
          >
            Faol bronlar
          </button>
          <button
            type="button"
            onClick={() => setFilter("CANCELLED")}
            className={`rounded-lg px-3 py-1.5 transition ${
              filter === "CANCELLED"
                ? "bg-accent text-white"
                : "text-ink hover:text-accent"
            }`}
          >
            Bekor qilingan
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface-card p-12 text-center">
          <div className="relative h-32 w-32">
            <Image
              src="/images/generated/empty-bookings.svg"
              alt="Hozircha buyurtma yo'q"
              fill
              className="object-contain"
            />
          </div>
          <h3 className="mt-4 text-base font-bold text-ink">
            Hozircha buyurtmalar yo‘q
          </h3>
          <p className="mt-1 max-w-sm text-xs text-ink-muted">
            Katalogdan kerakli joyni tanlang va qulay vaqtga bron qiling.
          </p>
          <Link
            href="/explore"
            className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-xs font-bold text-white transition hover:bg-accent-hover shadow"
          >
            Katalogga o‘tish
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border bg-surface-card p-5 transition hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        item.status === "CONFIRMED"
                          ? "bg-status-success-bg text-status-success"
                          : "bg-surface-muted text-ink-muted"
                      }`}
                    >
                      {item.status === "CONFIRMED" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {item.status}
                    </span>
                    <span className="text-xs text-ink-subtle">
                      ID: #{item.id}
                    </span>
                  </div>

                  <h3 className="mt-2 text-base font-bold text-ink">
                    {item.venueName}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      {item.address}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-accent" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-accent" />
                      {item.time}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-border">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-ink-subtle">To‘langan:</span>
                    <p className="text-sm font-extrabold text-accent">
                      {item.amount.toLocaleString("uz-UZ")} so‘m
                    </p>
                  </div>
                  <Link
                    href={`/account/bookings/${item.id}`}
                    className="mt-2 flex items-center gap-1 rounded-lg bg-surface-muted px-3 py-1.5 text-xs font-bold text-ink hover:bg-surface hover:text-accent transition border border-border"
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    <span>QR Chek-in</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
