"use client";

import { useState } from "react";

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([
    {
      id: "tkt_501",
      customer: "Farhod Ergashev",
      subject: "To‘lov yechildi, lekin bron holati kechikdi",
      priority: "YUQORI",
      status: "OCHIQ",
      date: "2026-11-09 11:15",
    },
    {
      id: "tkt_502",
      customer: "Nilufar Usmonova",
      subject: "Bron sanasini o‘zgartirish bo‘yicha iltimos",
      priority: "O‘RTA",
      status: "JARAYONDA",
      date: "2026-11-09 09:40",
    },
  ]);

  function resolveTicket(id: string) {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "HAL_QILINDI" } : t)),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          Mijozlar Murojaatlari va Nizolar ({tickets.length})
        </h1>
        <p className="text-xs text-ink-muted">
          Qo‘llab-quvvatlash xizmati murojaatlari va bekor qilingan buyurtmalar
          nazorati
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-muted text-ink-muted">
            <tr>
              <th className="p-4 font-bold">Murojaat ID</th>
              <th className="p-4 font-bold">Mijoz</th>
              <th className="p-4 font-bold">Mavzu</th>
              <th className="p-4 font-bold">Muhimlik</th>
              <th className="p-4 font-bold">Vaqt</th>
              <th className="p-4 font-bold">Holat</th>
              <th className="p-4 font-bold text-right">Amal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-surface-muted/50 transition">
                <td className="p-4 font-mono font-bold text-ink">#{t.id}</td>
                <td className="p-4 font-semibold text-ink">{t.customer}</td>
                <td className="p-4 text-ink">{t.subject}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      t.priority === "YUQORI"
                        ? "bg-status-danger-bg text-status-danger"
                        : "bg-surface-muted text-ink-muted"
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className="p-4 text-ink-muted">{t.date}</td>
                <td className="p-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 font-bold ${
                      t.status === "OCHIQ"
                        ? "bg-status-warning-bg text-status-warning"
                        : t.status === "HAL_QILINDI"
                          ? "bg-status-success-bg text-status-success"
                          : "bg-status-info-bg text-status-info"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {t.status !== "HAL_QILINDI" && (
                    <button
                      type="button"
                      onClick={() => resolveTicket(t.id)}
                      className="rounded bg-accent px-2.5 py-1 text-[11px] font-bold text-white hover:bg-accent-hover transition"
                    >
                      Hal qilish
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
