"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Compass,
  MapPin,
  GitCompare,
  Sparkles,
  Calendar,
  Heart,
  User,
  Sun,
  Moon,
  Globe,
} from "lucide-react";
import { getTranslation, type Locale } from "../../lib/i18n";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [locale, setLocale] = useState<Locale>("uz");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
      const savedTheme =
        (localStorage.getItem("spacehub_theme") as "light" | "dark") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light");
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);

      const savedLocale =
        (localStorage.getItem("spacehub_locale") as Locale) || "uz";
      setLocale(savedLocale);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("spacehub_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    localStorage.setItem("spacehub_locale", nextLocale);
  }

  const t = getTranslation(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          {mounted && theme === "dark" ? (
            <Image
              src="/brand/logo-dark.svg"
              alt="SpaceHub UZ"
              width={160}
              height={38}
              priority
              className="h-9 w-auto"
            />
          ) : (
            <Image
              src="/brand/logo.svg"
              alt="SpaceHub UZ"
              width={160}
              height={38}
              priority
              className="h-9 w-auto"
            />
          )}
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Navigation"
          className="hidden items-center gap-1 md:flex lg:gap-2"
        >
          <Link
            href="/explore"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-surface-muted hover:text-accent"
          >
            <Compass className="h-4 w-4 text-accent" />
            {t.nav.explore}
          </Link>
          <Link
            href="/map"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-surface-muted hover:text-accent"
          >
            <MapPin className="h-4 w-4 text-accent" />
            {t.nav.map}
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink transition hover:bg-surface-muted hover:text-accent"
          >
            <GitCompare className="h-4 w-4 text-accent" />
            {t.nav.compare}
          </Link>
          <Link
            href="/ai-assistant"
            className="flex items-center gap-1.5 rounded-lg bg-accent-subtle px-3 py-2 text-sm font-semibold text-accent transition hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            {t.nav.aiAssistant}
          </Link>
        </nav>

        {/* Action Controls (Theme, Locale, Account) */}
        <div className="hidden items-center gap-2 sm:flex">
          {/* Locale Picker */}
          <div className="relative flex items-center rounded-lg border border-border bg-surface-card px-2 py-1 text-xs font-semibold text-ink">
            <Globe className="mr-1 h-3.5 w-3.5 text-ink-muted" />
            <select
              value={locale}
              onChange={(e) => changeLocale(e.target.value as Locale)}
              aria-label="Select language"
              className="cursor-pointer bg-transparent outline-none"
            >
              <option value="uz">UZ</option>
              <option value="ru">RU</option>
              <option value="en">EN</option>
            </select>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-card text-ink transition hover:bg-surface-muted"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-warning" />
            ) : (
              <Moon className="h-4 w-4 text-ink-muted" />
            )}
          </button>

          {/* Customer Bookings Shortcut */}
          <Link
            href="/account/bookings"
            aria-label={t.nav.myBookings}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-card text-ink transition hover:bg-surface-muted"
          >
            <Calendar className="h-4 w-4 text-ink-muted" />
          </Link>

          {/* Account Profile / Login Button */}
          <Link
            href="/account/profile"
            className="flex items-center gap-2 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-ink-inverse shadow-sm transition hover:bg-accent-hover"
          >
            <User className="h-4 w-4" />
            <span>{t.nav.profile}</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-card"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-warning" />
            ) : (
              <Moon className="h-4 w-4 text-ink-muted" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface-card text-ink"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="border-b border-border bg-surface px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="/explore"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-muted"
            >
              <Compass className="h-4 w-4 text-accent" />
              {t.nav.explore}
            </Link>
            <Link
              href="/map"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-muted"
            >
              <MapPin className="h-4 w-4 text-accent" />
              {t.nav.map}
            </Link>
            <Link
              href="/compare"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-muted"
            >
              <GitCompare className="h-4 w-4 text-accent" />
              {t.nav.compare}
            </Link>
            <Link
              href="/ai-assistant"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg bg-accent-subtle px-3 py-2 text-sm font-semibold text-accent"
            >
              <Sparkles className="h-4 w-4" />
              {t.nav.aiAssistant}
            </Link>
            <div className="my-2 border-t border-border" />
            <Link
              href="/account/bookings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-muted"
            >
              <Calendar className="h-4 w-4 text-accent" />
              {t.nav.myBookings}
            </Link>
            <Link
              href="/account/favorites"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-muted"
            >
              <Heart className="h-4 w-4 text-accent" />
              {t.nav.favorites}
            </Link>
            <Link
              href="/account/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-surface-muted"
            >
              <User className="h-4 w-4 text-accent" />
              {t.nav.profile}
            </Link>
            <div className="mt-3 flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-ink-muted">
                {t.common.language}:
              </span>
              <div className="flex gap-2">
                {(["uz", "ru", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => changeLocale(lang)}
                    className={`rounded px-2.5 py-1 text-xs font-bold ${
                      locale === lang
                        ? "bg-accent text-white"
                        : "border border-border text-ink"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
