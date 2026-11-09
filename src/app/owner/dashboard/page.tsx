import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  Calendar,
  Users,
  Building,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Boshqaruv paneli | SpaceHub Owner",
};

export default function OwnerDashboardPage() {
  const kpis = [
    {
      label: "Oylik jami daromad",
      value: "8 450 000 so‘m",
      change: "+18%",
      icon: TrendingUp,
      color: "text-status-success",
    },
    {
      label: "Bronlar soni (Noyabr)",
      value: "42 ta",
      change: "+8 ta",
      icon: Calendar,
      color: "text-accent",
    },
    {
      label: "Bandlik darajasi",
      value: "74%",
      change: "+5%",
      icon: Users,
      color: "text-info",
    },
    {
      label: "Faol resurslar",
      value: "6 ta",
      change: "2 ta filial",
      icon: Building,
      color: "text-ink",
    },
  ];

  const recentReservations = [
    {
      id: "bkg_nov_101",
      customer: "Jamshid Aliyev",
      phone: "+998 90 ••• •• 12",
      venue: "C-Space Mirabad — Team Desk #2",
      date: "2026-11-10",
      time: "14:00 – 16:00",
      amount: "90 000 so‘m",
      status: "CONFIRMED",
    },
    {
      id: "bkg_nov_102",
      customer: "Sardor Rahimov",
      phone: "+998 97 ••• •• 88",
      venue: "C-Space Mirabad — Muzokaralar xonasi",
      date: "2026-11-10",
      time: "17:00 – 19:00",
      amount: "150 000 so‘m",
      status: "REQUESTED",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm"
            >
              <div className="flex items-center justify-between text-xs text-ink-muted">
                <span>{kpi.label}</span>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <p className="mt-3 text-xl font-extrabold text-ink">
                {kpi.value}
              </p>
              <span className="mt-1 inline-block text-[11px] font-semibold text-status-success">
                {kpi.change} o‘tgan oyga nisbatan
              </span>
            </div>
          );
        })}
      </div>

      {/* Recent Reservations Table */}
      <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-ink">Yangi buyurtmalar</h2>
            <p className="text-xs text-ink-muted">
              So‘nggi kelib tushgan bandlovlar va tasdiqlash so‘rovlari
            </p>
          </div>
          <Link
            href="/owner/reservations"
            className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            Barchasini ko‘rish
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface-muted text-ink-muted">
              <tr>
                <th className="p-3 font-bold">Mijoz</th>
                <th className="p-3 font-bold">Resurs</th>
                <th className="p-3 font-bold">Vaqt</th>
                <th className="p-3 font-bold">Summa</th>
                <th className="p-3 font-bold">Holat</th>
                <th className="p-3 font-bold text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentReservations.map((r) => (
                <tr key={r.id} className="hover:bg-surface-muted/50 transition">
                  <td className="p-3">
                    <p className="font-bold text-ink">{r.customer}</p>
                    <p className="text-ink-subtle">{r.phone}</p>
                  </td>
                  <td className="p-3 font-medium text-ink">{r.venue}</td>
                  <td className="p-3 text-ink-muted">
                    {r.date} · {r.time}
                  </td>
                  <td className="p-3 font-bold text-accent">{r.amount}</td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-bold ${
                        r.status === "CONFIRMED"
                          ? "bg-status-success-bg text-status-success"
                          : "bg-status-warning-bg text-status-warning"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href="/owner/reservations"
                      className="rounded bg-accent px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-accent-hover"
                    >
                      Boshqarish
                    </Link>
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
