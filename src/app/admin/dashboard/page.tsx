import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Boshqaruv | SpaceHub UZ",
};

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "Platforma jami aylanmasi (GMV)",
      value: "148 500 000 so‘m",
      growth: "+24%",
      color: "text-status-success",
    },
    {
      label: "Platforma komissiyasi (10%)",
      value: "14 850 000 so‘m",
      growth: "+24%",
      color: "text-accent",
    },
    {
      label: "Jami muvaffaqiyatli bronlar",
      value: "682 ta",
      growth: "+14%",
      color: "text-info",
    },
    {
      label: "Faol joy egalari va Obyektlar",
      value: "54 ta tashkilot",
      growth: "+6 ta",
      color: "text-ink",
    },
  ];

  const pendingModeration = [
    {
      id: "ven_mod_01",
      name: "Samarkand Coworking Hub",
      owner: "Farrux Zokirov",
      city: "Samarqand",
      submittedAt: "Bugun, 10:20",
    },
    {
      id: "ven_mod_02",
      name: "Tashkent Padel Club",
      owner: "Padel Sport MCHJ",
      city: "Toshkent",
      submittedAt: "Kecha, 18:45",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Platform Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-surface-card p-5 shadow-sm"
          >
            <span className="text-xs text-ink-muted">{s.label}</span>
            <p className="mt-3 text-lg font-extrabold text-ink">{s.value}</p>
            <span className="mt-1 inline-block text-[11px] font-semibold text-status-success">
              {s.growth} o‘tgan oyga nisbatan
            </span>
          </div>
        ))}
      </div>

      {/* Moderation Queue Alert */}
      <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-ink">
              Moderatsiya kutayotgan obyektlar ({pendingModeration.length})
            </h2>
            <p className="text-xs text-ink-muted">
              E’lon qilinishdan oldin tekshirilishi shart bo‘lgan arizalar
            </p>
          </div>
          <Link
            href="/admin/moderation"
            className="flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            Moderatsiya sahifasi
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4 divide-y divide-border">
          {pendingModeration.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-xs font-bold text-ink">{m.name}</p>
                <p className="text-[11px] text-ink-muted">
                  Joy egasi: {m.owner} · {m.city} · Topshirilgan:{" "}
                  {m.submittedAt}
                </p>
              </div>
              <Link
                href="/admin/moderation"
                className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white transition hover:bg-accent-hover"
              >
                Ko‘rib chiqish
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
