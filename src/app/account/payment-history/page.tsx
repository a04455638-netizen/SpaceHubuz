import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "To‘lovlar tarixi | SpaceHub UZ",
};

const payments = [
  {
    id: "tx_click_89210",
    date: "2026-11-09 14:30",
    venue: "C-Space Mirabad — Team Desk",
    amount: "90 000 so‘m",
    method: "Click Up",
    status: "To‘langan",
  },
  {
    id: "tx_payme_77192",
    date: "2026-11-05 18:00",
    venue: "Milliy Futsal Arena — B Maydon",
    amount: "180 000 so‘m",
    method: "Payme",
    status: "To‘langan",
  },
];

export default function PaymentHistoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          To‘lovlar tarixi va cheklar
        </h1>
        <p className="text-xs text-ink-muted">
          Barcha onlayn va naqd to‘lovlaringiz ro‘yxati
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-muted text-ink-muted">
            <tr>
              <th className="p-4 font-bold">Tranzaksiya ID</th>
              <th className="p-4 font-bold">Joy nomi</th>
              <th className="p-4 font-bold">Sana va vaqt</th>
              <th className="p-4 font-bold">Usul</th>
              <th className="p-4 font-bold">Summa</th>
              <th className="p-4 font-bold">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {payments.map((p) => (
              <tr key={p.id} className="hover:bg-surface-muted/50 transition">
                <td className="p-4 font-mono font-bold text-ink">{p.id}</td>
                <td className="p-4 font-semibold text-ink">{p.venue}</td>
                <td className="p-4 text-ink-muted">{p.date}</td>
                <td className="p-4 text-ink-muted">{p.method}</td>
                <td className="p-4 font-bold text-accent">{p.amount}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-success-bg px-2.5 py-0.5 font-bold text-status-success">
                    <CheckCircle2 className="h-3 w-3" />
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
