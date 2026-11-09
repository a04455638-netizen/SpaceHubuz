"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Users,
  CheckSquare,
  CalendarCheck,
  CreditCard,
  BarChart3,
  Tag,
  Headphones,
  Settings,
  Lock,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/dashboard", label: "Umumiy ko‘rinish", icon: ShieldCheck },
    { href: "/admin/users", label: "Foydalanuvchilar & Rollar", icon: Users },
    {
      href: "/admin/moderation",
      label: "Moderatsiya & Joylar",
      icon: CheckSquare,
    },
    {
      href: "/admin/bookings",
      label: "Barcha buyurtmalar",
      icon: CalendarCheck,
    },
    {
      href: "/admin/payments",
      label: "To‘lovlar & Qaytarishlar",
      icon: CreditCard,
    },
    { href: "/admin/analytics", label: "Tahlil & Hisobotlar", icon: BarChart3 },
    { href: "/admin/discounts", label: "Promo-kodlar & Aksiyalar", icon: Tag },
    {
      href: "/admin/support",
      label: "Shikoyatlar & Nizolar",
      icon: Headphones,
    },
    { href: "/admin/settings", label: "Tizim & Audit jurnali", icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Admin Protected Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-status-danger-bg px-2.5 py-0.5 text-xs font-bold text-status-danger">
              <Lock className="h-3 w-3" /> Himoyalangan Ma’muriyat Zonasi
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-ink sm:text-3xl">
            SpaceHub UZ — Boshqaruv Konsoli
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Admin Navigation Sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-surface-card p-4 shadow-sm">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                      isActive
                        ? "bg-ink text-white"
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

        {/* Admin Main View */}
        <div className="lg:col-span-3">{children}</div>
      </div>
    </div>
  );
}
