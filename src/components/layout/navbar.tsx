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
import { motion, AnimatePresence } from "framer-motion";
import { useI18n, type Locale } from "../../lib/i18n";

export function Navbar() {
  const { locale, setLocale, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
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
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("spacehub_theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
  }

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
              onChange={(e) => setLocale(e.target.value as Locale)}
              aria-label="Select language"
              className="cursor-pointer bg-transparent outline-none text-ink"
            >
              <option value="uz" className="bg-surface-card text-ink">O‘zbekcha</option>
              <option value="ru" className="bg-surface-card text-ink">Русский</option>
              <option value="en" className="bg-surface-card text-ink">English</option>
            </select>
          </div>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-card text-ink transition hover:bg-surface-muted cursor-pointer"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 text-ink-muted" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>

          {/* User Profile / Login Link */}
          <Link
            href="/account/bookings"
            className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-card px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-accent hover:text-accent"
          >
            <Calendar className="h-3.5 w-3.5 text-accent" />
            <span className="hidden lg:inline">{t.nav.myBookings}</span>
          </Link>

          <Link
            href="/account/profile"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-white shadow-sm transition hover:bg-accent-hover"
            aria-label="Account Profile"
          >
            <User className="h-4 w-4" />
          </Link>
        </div>

        {/* Mobile Menu Hamburger Trigger */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-card text-ink"
          >
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Open mobile navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-card text-ink"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border bg-surface px-4 py-4 sm:hidden space-y-3"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="text-xs font-bold text-ink-muted">{t.common.language}</span>
              <div className="flex gap-1.5">
                {(["uz", "ru", "en"] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLocale(l)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      locale === l
                        ? "bg-accent text-white"
                        : "bg-surface-card border border-border text-ink"
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <nav className="flex flex-col space-y-2 pt-1">
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
                className="flex items-center gap-2 rounded-lg bg-accent-subtle px-3 py-2 text-sm font-bold text-accent"
              >
                <Sparkles className="h-4 w-4" />
                {t.nav.aiAssistant}
              </Link>
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
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
