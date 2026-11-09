import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "To‘lovlar va Qaytarishlar | SpaceHub Admin",
};

const transactions = [
  {
    id: "tx_clk_001",
    bookingId: "bkg_nov_101",
    provider: "Click Up",
    amount: "90 000 so‘m",
    fee: "9 000 so‘m",
    status: "Muvaffaqiyatli",
    date: "2026-11-09 14:31",
  },
  {
    id: "tx_pay_002",
    bookingId: "bkg_nov_102",
    provider: "Payme",
    amount: "180 000 so‘m",
    fee: "18 000 so‘m",
    status: "Muvaffaqiyatli",
    date: "2026-11-09 16:15",
  },
];

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-ink sm:text-2xl">
          To‘lovlar, Komissiyalar va Qaytarishlar (Reconciliation)
        </h1>
        <p className="text-xs text-ink-muted">
          Click va Payme shlyuzlari orqali amalga oshirilgan tranzaksiyalar
          yarashuvi
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-surface-muted text-ink-muted">
            <tr>
              <th className="p-4 font-bold">Tranzaksiya ID</th>
              <th className="p-4 font-bold">Buyurtma</th>
              <th className="p-4 font-bold">Shlyuz</th>
              <th className="p-4 font-bold">Summa</th>
              <th className="p-4 font-bold">Komissiya (10%)</th>
              <th className="p-4 font-bold">Sana</th>
              <th className="p-4 font-bold">Holat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-surface-muted/50 transition">
                <td className="p-4 font-mono font-bold text-ink">{tx.id}</td>
                <td className="p-4 font-mono text-accent">#{tx.bookingId}</td>
                <td className="p-4 font-semibold text-ink">{tx.provider}</td>
                <td className="p-4 font-bold text-ink">{tx.amount}</td>
                <td className="p-4 font-bold text-status-success">{tx.fee}</td>
                <td className="p-4 text-ink-muted">{tx.date}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-status-success-bg px-2.5 py-0.5 font-bold text-status-success">
                    <CheckCircle2 className="h-3 w-3" />
                    {tx.status}
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
