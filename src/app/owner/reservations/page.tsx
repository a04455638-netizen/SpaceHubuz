"use client";

import { useState } from "react";
import { Check, X, QrCode, CheckCircle2 } from "lucide-react";

export default function OwnerReservationsPage() {
  const [scanCode, setScanCode] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [reservations, setReservations] = useState([
    {
      id: "bkg_nov_101",
      customer: "Jamshid Aliyev",
      phone: "+998 90 123 45 67",
      resource: "Muzokaralar xonasi",
      date: "2026-11-10",
      time: "14:00 – 16:00",
      amount: "90 000 so‘m",
      status: "CONFIRMED",
    },
    {
      id: "bkg_nov_102",
      customer: "Sardor Rahimov",
      phone: "+998 97 765 43 21",
      resource: "Asosiy zal",
      date: "2026-11-10",
      time: "17:00 – 19:00",
      amount: "150 000 so‘m",
      status: "REQUESTED",
    },
  ]);

  function handleAction(id: string, newStatus: string) {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)),
    );
  }

  function handleVerifyQr(e: React.FormEvent) {
    e.preventDefault();
    if (!scanCode.trim()) return;

    setScanMessage(`Muvaffaqiyatli! Mijoz ro‘yxatdan o‘tkazildi (CHECKED_IN)`);
    setScanCode("");
    setTimeout(() => setScanMessage(""), 3000);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
            Buyurtmalar va QR Chek-in
          </h1>
          <p className="text-xs text-ink-muted">
            Mijozlar buyurtmalarini tasdiqlash, rad etish va joyda kutib olish
          </p>
        </div>
      </div>

      {/* QR Code Quick Check-in Box */}
      <div className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
          <QrCode className="h-4 w-4 text-accent" />
          Tezkor QR Kod yoki Ruxsatnoma tekshiruvi
        </h3>
        {scanMessage && (
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-status-success-bg p-3 text-xs font-bold text-status-success">
            <CheckCircle2 className="h-4 w-4" /> {scanMessage}
          </div>
        )}
        <form onSubmit={handleVerifyQr} className="mt-3 flex gap-2">
          <input
            type="text"
            placeholder="Mijoz QR kodi yoki Buyurtma ID raqami (masalan, SH-BKG_NOV_101)"
            value={scanCode}
            onChange={(e) => setScanCode(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-2 text-xs text-ink focus:border-accent focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-accent px-5 py-2 text-xs font-bold text-white transition hover:bg-accent-hover"
          >
            Tekshirish (Check-in)
          </button>
        </form>
      </div>

      {/* Reservations List */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-muted text-ink-muted">
            <tr>
              <th className="p-4 font-bold">Buyurtma ID</th>
              <th className="p-4 font-bold">Mijoz</th>
              <th className="p-4 font-bold">Resurs</th>
              <th className="p-4 font-bold">Sana va Vaqt</th>
              <th className="p-4 font-bold">Summa</th>
              <th className="p-4 font-bold">Holat</th>
              <th className="p-4 font-bold text-right">Amallar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-surface-muted/50 transition">
                <td className="p-4 font-mono font-bold text-ink">#{r.id}</td>
                <td className="p-4">
                  <p className="font-bold text-ink">{r.customer}</p>
                  <p className="text-ink-subtle">{r.phone}</p>
                </td>
                <td className="p-4 font-medium text-ink">{r.resource}</td>
                <td className="p-4 text-ink-muted">
                  {r.date} · {r.time}
                </td>
                <td className="p-4 font-bold text-accent">{r.amount}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 font-bold ${
                      r.status === "CONFIRMED"
                        ? "bg-status-success-bg text-status-success"
                        : r.status === "REQUESTED"
                          ? "bg-status-warning-bg text-status-warning"
                          : "bg-surface-muted text-ink-muted"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {r.status === "REQUESTED" ? (
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAction(r.id, "CONFIRMED")}
                        className="flex items-center gap-1 rounded bg-status-success px-2.5 py-1 text-[11px] font-bold text-white hover:opacity-90"
                      >
                        <Check className="h-3 w-3" /> Tasdiqlash
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(r.id, "CANCELLED")}
                        className="flex items-center gap-1 rounded bg-status-danger px-2.5 py-1 text-[11px] font-bold text-white hover:opacity-90"
                      >
                        <X className="h-3 w-3" /> Rad etish
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAction(r.id, "CHECKED_IN")}
                      className="rounded bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-ink hover:bg-surface hover:text-accent border border-border"
                    >
                      Chek-in qilish
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
