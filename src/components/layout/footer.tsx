"use client";

import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, MapPin } from "lucide-react";
import { useI18n } from "../../lib/i18n";

export function Footer() {
  const { t } = useI18n();

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
                className="h-8 w-auto dark:hidden"
              />
              <Image
                src="/brand/logo-dark.svg"
                alt="SpaceHub UZ"
                width={160}
                height={38}
                className="h-8 w-auto hidden dark:block"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-ink-muted leading-relaxed">
              {t.footer.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-ink-muted">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>100% rasmiy va kafolatlangan vaqt oraliqlari</span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-bold text-ink tracking-wider uppercase">
              {t.explore.category}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/explore/coworking"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.categories.work}
                </Link>
              </li>
              <li>
                <Link
                  href="/explore/sports"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.categories.sports}
                </Link>
              </li>
              <li>
                <Link
                  href="/explore/meetings"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.categories.meetings}
                </Link>
              </li>
              <li>
                <Link
                  href="/explore/events"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.categories.events}
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-ink tracking-wider uppercase">
              {t.footer.forCustomers}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/explore"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.nav.explore}
                </Link>
              </li>
              <li>
                <Link
                  href="/map"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.nav.map}
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.nav.compare}
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-assistant"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.nav.aiAssistant}
                </Link>
              </li>
              <li>
                <Link
                  href="/owner/dashboard"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.footer.forOwners}
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Contact */}
          <div>
            <h3 className="text-sm font-bold text-ink tracking-wider uppercase">
              {t.footer.legal} &amp; {t.footer.support}
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/support"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.footer.support} / FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-ink-muted hover:text-accent transition"
                >
                  SpaceHub Haqida
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="text-ink-muted hover:text-accent transition"
                >
                  {t.footer.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-ink-muted">
            &copy; {new Date().getFullYear()} SpaceHub UZ. {t.footer.rights}
          </p>
          <div className="mt-3 flex items-center gap-4 text-xs text-ink-muted sm:mt-0">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-accent" /> Toshkent, O&apos;zbekiston
            </span>
            <span>&middot;</span>
            <span>Asia/Tashkent (UTC+5)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
