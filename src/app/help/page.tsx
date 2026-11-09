import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, CreditCard, Shield, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Yordam markazi | SpaceHub UZ",
};

export default function HelpPage() {
  const guides = [
    {
      title: "Birinchi marta bron qilish bo‘yicha qo‘llanma",
      desc: "Joyni qidirish, sana tanlash va to‘lov qilish qadam-baqadam",
      icon: Calendar,
      href: "/explore",
    },
    {
      title: "To‘lov usullari va cheklar",
      desc: "Click, Payme va joyida to‘lash mexanizmlari",
      icon: CreditCard,
      href: "/support",
    },
    {
      title: "QR ruxsatnoma va chek-in jarayoni",
      desc: "Obyektga kirishda QR koddan qanday foydalanish kerak",
      icon: Shield,
      href: "/account/bookings",
    },
    {
      title: "Joy egalari uchun ko‘rsatmalar",
      desc: "Filial qo‘shish, narx belgilash va daromadlarni chiqarish",
      icon: User,
      href: "/owner/dashboard",
    },
  ];

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-ink sm:text-4xl">
          Yordam markazi va Foydali qo‘llanmalar
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Platformadan foydalanish bo‘yicha barcha yo‘riqnomalar
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {guides.map((g, idx) => {
          const Icon = g.icon;
          return (
            <Link
              key={idx}
              href={g.href}
              className="flex items-start gap-4 rounded-2xl border border-border bg-surface-card p-6 transition hover:border-accent hover:shadow-md"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">{g.title}</h3>
                <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                  {g.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
