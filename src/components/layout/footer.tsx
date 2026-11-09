import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-subtle transition-colors">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/brand/logo.svg"
                alt="SpaceHub UZ"
                width={160}
                height={38}
                className="h-8 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-ink-muted leading-relaxed">
              O‘zbekiston bo‘ylab kovorkinglar, zamonaviy sport maydonlari,
              konferensiya va tadbir joylarini tez, qulay va ishonchli bron
              qilish platformasi.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-ink-muted">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>100% rasmiy va kafolatlangan vaqt oraliqlari</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-ink tracking-wider uppercase">
              Toifalar
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/explore/coworking"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Kovorking va o‘qish
                </Link>
              </li>
              <li>
                <Link
                  href="/explore/sports"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Sport maydonlari
                </Link>
              </li>
              <li>
                <Link
                  href="/explore/meetings"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Majlis va trening xonalari
                </Link>
              </li>
              <li>
                <Link
                  href="/explore/events"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Tadbir va bayram zallari
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-ink tracking-wider uppercase">
              Xizmatlar
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/explore"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Katalog
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Xarita orqali qidirish
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Joy taqqoslash
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-assistant"
                  className="text-ink-muted hover:text-accent transition"
                >
                  AI Konsyerj yordamchi
                </Link>
              </li>
              <li>
                <Link
                  href="/owner/dashboard"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Joy egalari uchun portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h3 className="text-sm font-bold text-ink tracking-wider uppercase">
              Yordam va Aloqa
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/support"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Qo‘llab-quvvatlash / FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Maxfiylik siyosati
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-ink-muted hover:text-accent transition"
                >
                  Foydalanish shartlari
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-ink-muted">
            &copy; {new Date().getFullYear()} SpaceHub UZ. Barcha huquqlar
            himoyalangan.
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-ink-muted sm:mt-0">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-accent" /> Toshkent,
              O‘zbekiston
            </span>
            <span>·</span>
            <span>Asia/Tashkent (UTC+5)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
