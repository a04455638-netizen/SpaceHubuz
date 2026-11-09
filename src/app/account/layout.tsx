"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  Heart,
  User,
  CreditCard,
  Star,
  Bell,
  Shield,
} from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/account/bookings", label: "Buyurtmalarim", icon: Calendar },
    { href: "/account/favorites", label: "Sevimli joylar", icon: Heart },
    { href: "/account/profile", label: "Profil ma’lumotlari", icon: User },
    {
      href: "/account/payment-history",
      label: "To‘lovlar tarixi",
      icon: CreditCard,
    },
    { href: "/account/reviews", label: "Mening sharhlarim", icon: Star },
    { href: "/account/notifications", label: "Xabarnomalar", icon: Bell },
    { href: "/account/security", label: "Xavfsizlik", icon: Shield },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Account Sidebar Navigation */}
        <aside className="md:col-span-1">
          <div className="rounded-2xl border border-border bg-surface-card p-4 shadow-sm">
            <div className="border-b border-border pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white font-bold">
                  SH
                </div>
                <div>
                  <h2 className="text-sm font-bold text-ink">Mening Hisobim</h2>
                  <p className="text-xs text-ink-muted">+998 90 ••• •• 77</p>
                </div>
              </div>
            </div>

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

        {/* Content Area */}
        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  );
}
