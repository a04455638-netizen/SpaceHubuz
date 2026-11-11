"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
  Star,
  Bot,
  Zap,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { CURATED_VENUES } from "@/server/mock-venues";
import { formatPrice } from "@/lib/format-price";

export default function Home() {
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const categories = [
    {
      id: "coworking",
      slug: "coworking",
      name: t.categories.work,
      desc: t.categories.workDesc,
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      count: "120+ spaces",
    },
    {
      id: "sports",
      slug: "sports",
      name: t.categories.sports,
      desc: t.categories.sportsDesc,
      image:
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
      count: "85+ arenas",
    },
    {
      id: "meetings",
      slug: "meetings",
      name: t.categories.meetings,
      desc: t.categories.meetingsDesc,
      image:
        "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
      count: "95+ halls",
    },
    {
      id: "events",
      slug: "events",
      name: t.categories.events,
      desc: t.categories.eventsDesc,
      image:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      count: "40+ venues",
    },
  ];

  const featuredVenues = CURATED_VENUES.slice(0, 4);

  const stats = [
    { value: "150+", label: t.hero.statsVenues },
    { value: "12 000+", label: t.hero.statsBookings },
    { value: "4.9★", label: t.hero.statsRating },
    { value: "5", label: t.hero.statsCities },
  ];

  return (
    <main className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28 text-white">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1920&q=80"
            alt="SpaceHub Modern Spaces"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-accent/40 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {t.hero.badge}
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl text-white leading-tight">
              {t.hero.title}
            </h1>
            <p className="mt-5 text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
              {t.hero.subtitle}
            </p>
          </motion.div>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-10 rounded-2xl bg-surface-card p-4 sm:p-5 shadow-2xl ring-1 ring-border text-ink"
          >
            <form
              action="/explore"
              method="GET"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  {t.hero.searchVenue}
                </label>
                <div className="relative mt-1.5">
                  <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
                  <input
                    type="search"
                    name="q"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.common.searchPlaceholder}
                    className="w-full rounded-xl border border-border bg-surface px-9 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  {t.explore.category}
                </label>
                <div className="relative mt-1.5">
                  <select
                    name="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition"
                  >
                    <option value="">{t.categories.all}</option>
                    <option value="coworking">{t.categories.work}</option>
                    <option value="sports">{t.categories.sports}</option>
                    <option value="meetings">{t.categories.meetings}</option>
                    <option value="events">{t.categories.events}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  {t.explore.city}
                </label>
                <div className="relative mt-1.5">
                  <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
                  <input
                    type="text"
                    name="city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    placeholder="Toshkent, Samarqand…"
                    className="w-full rounded-xl border border-border bg-surface px-9 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-accent-hover active:scale-[0.98]"
                >
                  <Search className="h-4 w-4" />
                  <span>{t.common.search}</span>
                </button>
              </div>
            </form>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 border-t border-white/10 pt-8"
          >
            {stats.map((s, idx) => (
              <div key={idx} className="text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
                  {s.value}
                </p>
                <p className="mt-1 text-xs text-emerald-100/70">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Primary Categories Grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {locale === "uz"
                ? "Asosiy toifalar"
                : locale === "ru"
                  ? "Основные категории"
                  : "Explore by Category"}
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              {locale === "uz"
                ? "Ehtiyojingizga mos joy toifasini tanlang va bo‘sh soatlarni ko‘ring"
                : locale === "ru"
                  ? "Выберите категорию и найдите свободные интервалы"
                  : "Find the perfect space tailored to your needs"}
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            {t.common.viewAll}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <Link
                href={`/explore/${cat.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-surface-muted">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <span className="absolute bottom-2.5 left-2.5 rounded-lg bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                    {cat.count}
                  </span>
                </div>
                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-ink group-hover:text-accent transition">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs text-ink-muted line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-accent">
                    <span>{t.common.viewDetails}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Venues Section */}
      <section className="bg-surface-subtle py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                {locale === "uz"
                  ? "Tavsiya etiladigan joylar"
                  : locale === "ru"
                    ? "Рекомендуемые пространства"
                    : "Featured Spaces"}
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                {locale === "uz"
                  ? "Ommabop va tasdiqlangan obyektlar"
                  : locale === "ru"
                    ? "Популярные проверенные объекты"
                    : "Popular Verified Venues"}
              </h2>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              {t.common.viewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredVenues.map((venue, idx) => (
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface-card transition duration-200 hover:shadow-lg hover:-translate-y-0.5"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
                    <Image
                      src={venue.featuredImage}
                      alt={venue.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {venue.categoryName[locale]}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="truncate">
                        {venue.city}, {venue.district}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-bold text-ink group-hover:text-accent transition line-clamp-1">
                      {venue.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1 text-xs text-amber-500 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{venue.rating.toFixed(1)}</span>
                      <span className="text-ink-subtle">
                        ({venue.reviewCount} {t.venueDetail.reviews.toLowerCase()})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border p-4 bg-surface-card">
                  <div>
                    <span className="text-xs text-ink-subtle">
                      {locale === "uz" ? "Narxi:" : locale === "ru" ? "Цена:" : "From:"}
                    </span>
                    <p className="text-sm font-extrabold text-ink">
                      {formatPrice(venue.pricePerHour)} {t.common.currency}
                      <span className="text-xs font-normal text-ink-muted">
                        {" "}/ {locale === "uz" ? "soat" : locale === "ru" ? "час" : "hour"}
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/venues/${venue.slug}`}
                    className="rounded-lg bg-accent px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-accent-hover shadow-sm"
                  >
                    {t.common.bookNow}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Teaser Banner */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <Bot className="h-4 w-4" />
              {locale === "uz" ? "Sun'iy Intellekt Maslahatchisi" : locale === "ru" ? "ИИ-Консьерж" : "AI Space Concierge"}
            </span>
            <h3 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight">
              {locale === "uz"
                ? "Kerakli joyni bir necha soniyada toping"
                : locale === "ru"
                  ? "Найдите идеальное место за считанные секунды"
                  : "Find your ideal space in seconds with AI"}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              {locale === "uz"
                ? "SpaceHub AI maslahatchisi sizning byudjetingiz, joylashuvingiz va talablaringizga mos joylarni tahlil qilib, eng maqbul variantlarni tavsiya qiladi."
                : locale === "ru"
                  ? "Наш умный помощник проанализирует ваши пожелания по бюджету, району и вместимости и мгновенно подберет лучшие свободные варианты."
                  : "Our intelligent assistant analyzes your budget, preferred district, and capacity to recommend the best available spaces instantly."}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/ai-assistant"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-800 shadow-md transition hover:bg-emerald-50"
              >
                <Zap className="h-4 w-4 text-amber-500 fill-current" />
                <span>{locale === "uz" ? "AI bilan maslahatlashish" : locale === "ru" ? "Спросить ИИ" : "Chat with AI"}</span>
              </Link>
              <Link
                href="/map"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition"
              >
                <MapPin className="h-4 w-4" />
                <span>{t.nav.map}</span>
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        </div>
      </section>

      {/* Trust & Guarantees */}
      <section className="mx-auto max-w-7xl px-5 py-12 pb-20 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-subtle text-accent">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">
              {locale === "uz"
                ? "Ikki tomonlama bandlikdan 100% himoya"
                : locale === "ru"
                  ? "100% защита от двойных бронирований"
                  : "100% Double-Booking Protection"}
            </h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              {locale === "uz"
                ? "PostgreSQL exclusion constraint texnologiyasi orqali bir xil vaqt oralig‘i ikki xaridorga aslo sotilmaydi."
                : locale === "ru"
                  ? "Специальные ограничения базы данных PostgreSQL гарантируют, что один и тот же интервал времени никогда не будет забронирован дважды."
                  : "Database-level exclusion constraints guarantee that overlapping time slots cannot be booked by multiple customers simultaneously."}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-subtle text-accent">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">
              {locale === "uz"
                ? "Onlayn Click & Payme to‘lov"
                : locale === "ru"
                  ? "Оплата через Click и Payme"
                  : "Click & Payme Online Payments"}
            </h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              {locale === "uz"
                ? "O‘zbekistondagi milliy to‘lov tizimlari orqali tezkor va xavfsiz to‘lang yoki joyida to‘lash imkoniyatidan foydalaning."
                : locale === "ru"
                  ? "Оплачивайте мгновенно и безопасно через национальные платежные системы или выберите оплату на месте."
                  : "Pay securely and instantly via Uzbekistan's leading payment systems, or choose pay on arrival."}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-subtle text-accent">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">
              {locale === "uz"
                ? "Telegram xabarnomalar va QR chipta"
                : locale === "ru"
                  ? "Уведомления в Telegram и QR-билет"
                  : "Telegram Alerts & QR Tickets"}
            </h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              {locale === "uz"
                ? "Har bir buyurtma darhol Telegram botingizga yuboriladi va shaxsiy kabinetingizda QR ruxsatnomasi saqlanadi."
                : locale === "ru"
                  ? "Каждый заказ сразу отправляется в ваш Telegram и сохраняется в личном кабинете с уникальным QR-кодом для входа."
                  : "Every booking is instantly routed to your Telegram bot and stored in your profile with a verifiable check-in QR code."}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
