"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  ClipboardList,
  DollarSign,
  Settings,
  PlusCircle,
} from "lucide-react";

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/owner/dashboard",
      label: "Boshqaruv paneli",
      icon: LayoutDashboard,
    },
    { href: "/owner/venues", label: "Mening obyektlarim", icon: Building2 },
    {
      href: "/owner/venues/new",
      label: "Yangi joy qo‘shish",
      icon: PlusCircle,
    },
    {
      href: "/owner/calendar",
      label: "Bandlik taqvimi & Bloklar",
      icon: Calendar,
    },
    {
      href: "/owner/reservations",
      label: "Buyurtmalar & QR Chek-in",
      icon: ClipboardList,
    },
    { href: "/owner/earnings", label: "Moliya & Daromadlar", icon: DollarSign },
    { href: "/owner/settings", label: "Sozlamalar & Telegram", icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
            Joy Egalari Portali
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
            Tashkilot boshqaruvi
          </h1>
        </div>
        <Link
          href="/owner/venues/new"
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs font-bold text-white shadow transition hover:bg-accent-hover"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Yangi joy qo‘shish</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Owner Sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-surface-card p-4 shadow-sm">
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                      isActive
                        ? "bg-accent text-white"
                        : "text-ink hover:bg-surface-muted hover:text-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Owner Main View */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
