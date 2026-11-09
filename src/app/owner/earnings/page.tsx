import type { Metadata } from "next";
import { ArrowDownToLine } from "lucide-react";

export const metadata: Metadata = {
  title: "Moliya va Daromadlar | SpaceHub Owner",
};

export default function OwnerEarningsPage() {
  const stats = [
    { label: "Jami tushum (Gross)", value: "12 500 000 so‘m" },
    { label: "Platforma komissiyasi (10%)", value: "1 250 000 so‘m" },
    { label: "Toza daromad (Net)", value: "11 250 000 so‘m" },
    { label: "Yechib olishga tayyor", value: "3 400 000 so‘m" },
  ];

  const payouts = [
    {
      id: "po_9901",
      date: "2026-11-01",
      bank: "Kapitalbank (UZCARD **** 4812)",
      amount: "7 850 000 so‘m",
      status: "O‘tkazildi",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
            Moliya va Daromadlar hisoboti
          </h1>
          <p className="text-xs text-ink-muted">
            Obyektlaringizdan tushgan mablag‘lar va to‘lov o‘tkazmalari
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-accent-hover"
        >
          <ArrowDownToLine className="h-4 w-4" />
          <span>Mablag‘ni yechib olish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm"
          >
            <span className="text-xs text-ink-muted">{s.label}</span>
            <p className="mt-2 text-lg font-extrabold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
        <h3 className="text-sm font-bold text-ink">
          To‘lov o‘tkazmalari tarixi (Payouts)
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface-muted text-ink-muted">
              <tr>
                <th className="p-3 font-bold">O‘tkazma ID</th>
                <th className="p-3 font-bold">Sana</th>
                <th className="p-3 font-bold">Hisob raqam / Karta</th>
                <th className="p-3 font-bold">Summa</th>
                <th className="p-3 font-bold">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payouts.map((p) => (
                <tr key={p.id}>
                  <td className="p-3 font-mono font-bold text-ink">{p.id}</td>
                  <td className="p-3 text-ink-muted">{p.date}</td>
                  <td className="p-3 text-ink">{p.bank}</td>
                  <td className="p-3 font-bold text-accent">{p.amount}</td>
                  <td className="p-3">
                    <span className="rounded-full bg-status-success-bg px-2.5 py-0.5 font-bold text-status-success">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
