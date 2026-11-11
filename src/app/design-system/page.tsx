"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  ShieldCheck,
  Star,
  Users,
  Search,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
} from "lucide-react";

export default function DesignSystemPage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/brand/icon.svg"
              alt="SpaceHub Logo Icon"
              width={36}
              height={36}
              className="h-9 w-9"
            />
            <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              SpaceHub UZ Design System
            </h1>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            Premium component library, design tokens, color palette, and micro-interactions.
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 self-start rounded-xl border border-border bg-surface-card px-4 py-2 text-xs font-bold text-ink shadow-sm transition hover:bg-surface-muted cursor-pointer"
        >
          {theme === "light" ? (
            <>
              <Moon className="h-4 w-4 text-accent" />
              <span>Qorong&apos;i mavzu (Dark)</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4 text-accent" />
              <span>Yorug&apos; mavzu (Light)</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-xl font-bold text-ink">1. Brand &amp; Semantic Color Palette</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          <div className="rounded-2xl border border-border p-4 bg-surface-card space-y-2">
            <div className="h-14 rounded-xl bg-accent shadow-inner" />
            <div className="text-xs font-bold text-ink">Primary Accent</div>
            <div className="text-[10px] text-ink-muted">#2563EB / #3B82F6</div>
          </div>

          <div className="rounded-2xl border border-border p-4 bg-surface-card space-y-2">
            <div className="h-14 rounded-xl bg-surface border border-border" />
            <div className="text-xs font-bold text-ink">Surface Background</div>
            <div className="text-[10px] text-ink-muted">#F8FAFC / #0B1220</div>
          </div>

          <div className="rounded-2xl border border-border p-4 bg-surface-card space-y-2">
            <div className="h-14 rounded-xl bg-surface-card border border-border shadow-sm" />
            <div className="text-xs font-bold text-ink">Card Surface</div>
            <div className="text-[10px] text-ink-muted">#FFFFFF / #111C33</div>
          </div>

          <div className="rounded-2xl border border-border p-4 bg-surface-card space-y-2">
            <div className="h-14 rounded-xl bg-ink" />
            <div className="text-xs font-bold text-ink">Text Primary</div>
            <div className="text-[10px] text-ink-muted">#0F172A / #F8FAFC</div>
          </div>

          <div className="rounded-2xl border border-border p-4 bg-surface-card space-y-2">
            <div className="h-14 rounded-xl bg-status-success" />
            <div className="text-xs font-bold text-ink">Success</div>
            <div className="text-[10px] text-ink-muted">#16A34A / #22C55E</div>
          </div>

          <div className="rounded-2xl border border-border p-4 bg-surface-card space-y-2">
            <div className="h-14 rounded-xl bg-status-danger" />
            <div className="text-xs font-bold text-ink">Danger</div>
            <div className="text-[10px] text-ink-muted">#DC2626 / #EF4444</div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Buttons */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-ink">2. Buttons &amp; Action Triggers</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <button className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-hover">
            <span>Asosiy Tugma (Primary)</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <button className="rounded-xl border border-border bg-surface-card px-5 py-2.5 text-sm font-semibold text-ink shadow-sm transition hover:bg-surface-muted">
            Ikkilamchi (Secondary)
          </button>

          <button className="rounded-xl bg-accent-subtle px-5 py-2.5 text-sm font-bold text-accent transition hover:opacity-90">
            Pastel Accent
          </button>

          <button
            disabled
            className="cursor-not-allowed rounded-xl bg-surface-muted px-5 py-2.5 text-sm font-medium text-ink-subtle"
          >
            Faol emas (Disabled)
          </button>
        </div>
      </section>

      {/* 3. Form Inputs & Selects */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-ink">3. Form Controls &amp; Input Fields</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Qidiruv maydoni
            </label>
            <div className="relative mt-1.5">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
              <input
                type="text"
                placeholder="Joy nomi yoki shahar..."
                className="w-full rounded-xl border border-border bg-surface pl-10 pr-4 py-2.5 text-sm font-medium text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Toifani tanlang
            </label>
            <select className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-medium text-ink focus:border-accent focus:outline-none">
              <option>Kovorking va o&apos;quv zallari</option>
              <option>Sport maydonlari</option>
              <option>Konferensiya zallari</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
              Holat / Status Badges
            </label>
            <div className="mt-2.5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-status-success-bg px-2.5 py-0.5 text-xs font-bold text-status-success">
                <ShieldCheck className="h-3 w-3" /> Tasdiqlangan
              </span>
              <span className="inline-flex items-center rounded-full bg-status-warning-bg px-2.5 py-0.5 text-xs font-bold text-status-warning">
                Kutilmoqda
              </span>
              <span className="inline-flex items-center rounded-full bg-status-info-bg px-2.5 py-0.5 text-xs font-bold text-status-info">
                Band qilingan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Representative Venue Listing Card */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-ink">4. Venue Card Component</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm transition hover:shadow-md">
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
              <Image
                src="/images/generated/demo-coworking-1.svg"
                alt="Impact Coworking Hub"
                fill
                className="object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-lg bg-white/90 px-2.5 py-1 text-xs font-bold text-ink backdrop-blur-md">
                <Star className="h-3.5 w-3.5 fill-status-warning text-status-warning" />
                4.9
              </span>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-ink-muted">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-ink-subtle" />
                  Yunusobod tumani, Toshkent
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-ink-subtle" />
                  45 o&apos;rin
                </span>
              </div>

              <h3 className="text-base font-bold text-ink group-hover:text-accent transition">
                Impact Coworking Hub &amp; Smart Office
              </h3>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <div>
                  <span className="text-lg font-extrabold text-ink">25,000 UZS</span>
                  <span className="text-xs text-ink-muted"> / soat</span>
                </div>
                <button className="rounded-xl bg-accent px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition hover:bg-accent-hover">
                  Bron qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Skeleton & Loading States */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-ink">5. Skeletons &amp; Empty State Patterns</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Skeleton Card */}
          <div className="rounded-2xl border border-border bg-surface-card p-5 space-y-4 animate-pulse">
            <div className="aspect-[16/9] rounded-xl bg-surface-muted" />
            <div className="h-4 w-3/4 rounded bg-surface-muted" />
            <div className="h-3 w-1/2 rounded bg-surface-muted" />
            <div className="flex justify-between pt-2">
              <div className="h-5 w-24 rounded bg-surface-muted" />
              <div className="h-8 w-20 rounded bg-surface-muted" />
            </div>
          </div>

          {/* Empty State Card */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface-card p-8 text-center">
            <Image
              src="/images/generated/empty-search.svg"
              alt="Empty Search"
              width={140}
              height={100}
              className="h-24 w-auto"
            />
            <h4 className="mt-4 text-sm font-bold text-ink">Natijalar topilmadi</h4>
            <p className="mt-1 text-xs text-ink-muted max-w-xs">
              Qidiruv so&apos;zlarini o&apos;zgartirib yoki toifalar bo&apos;yicha filtrlab ko&apos;ring.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
