"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Wrench, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

export function MaintenanceGuard() {
  const [maintenance, setMaintenance] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only check outside admin routes
    if (pathname?.startsWith("/admin")) {
      return;
    }

    fetch("/api/admin/maintenance")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.enabled) {
          // Check if admin is signed in
          const role = localStorage.getItem("spacehub_user_role");
          if (role !== "ADMIN") {
            setMaintenance(true);
          }
        }
      })
      .catch(() => {});
  }, [pathname]);

  if (!maintenance || pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface p-4 text-center">
      <div className="max-w-md w-full rounded-3xl border border-border bg-surface-card p-8 shadow-2xl space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-status-warning-bg text-status-warning">
          <Wrench className="h-8 w-8 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="rounded-full bg-status-warning-bg px-3 py-1 text-xs font-bold text-status-warning">
            Texnik Profilaktika / Maintenance
          </span>
          <h2 className="text-2xl font-black text-ink">
            Tizimda yangilanish ishlari olib borilmoqda
          </h2>
          <p className="text-xs text-ink-muted leading-relaxed">
            Platforma imkoniyatlarini yanada yaxshilash va tezlashtirish maqsadida rejaviy texnik profilaktika o&apos;tkazilmoqda. Tez orada to&apos;liq quvvat bilan qaytamiz!
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 text-xs text-ink-muted space-y-1">
          <p className="font-semibold text-ink">Tezkor aloqa va qo&apos;llab-quvvatlash:</p>
          <p>Telefon: +998 71 200 45 45 &middot; Telegram: @SpaceHubUZ_Support</p>
        </div>

        <div className="pt-2">
          <Link
            href="/admin/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-accent transition"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Ma&apos;muriyat xodimlari uchun kirish</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
