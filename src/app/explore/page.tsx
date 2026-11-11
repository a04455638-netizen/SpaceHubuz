"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Search,
  MapPin,
  Star,
  Users,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CURATED_VENUES } from "../../server/mock-venues";
import { useI18n } from "../../lib/i18n";
import { formatPrice } from "@/lib/format-price";

function ExploreContent() {
  const { t, locale } = useI18n();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(() => searchParams.get("category") || "all");
  const [selectedCity, setSelectedCity] = useState<string>(() => searchParams.get("city") || "all");
  const [sortBy, setSortBy] = useState<"recommended" | "price_asc" | "price_desc" | "rating">("recommended");
  const [maxPrice] = useState<number>(1500000);

  // Sync state if URL query params change
  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      const qParam = searchParams.get("q");
      const catParam = searchParams.get("category");
      const cityParam = searchParams.get("city");
      if (qParam !== null) setQuery(qParam);
      if (catParam !== null) setSelectedCategory(catParam);
      if (cityParam !== null) setSelectedCity(cityParam);
    });
    return () => cancelAnimationFrame(handle);
  }, [searchParams]);

  const filteredVenues = useMemo(() => {
    return CURATED_VENUES.filter((venue) => {
      const matchCat = selectedCategory === "all" || venue.category === selectedCategory;
      const matchCity = selectedCity === "all" || venue.city.toLowerCase() === selectedCity.toLowerCase();
      const matchPrice = venue.pricePerHour <= maxPrice;
      const q = query.toLowerCase().trim();
      const matchQuery =
        q === "" ||
        venue.name.toLowerCase().includes(q) ||
        venue.district.toLowerCase().includes(q) ||
        venue.address.toLowerCase().includes(q) ||
        venue.description[locale]?.toLowerCase().includes(q);

      return matchCat && matchCity && matchPrice && matchQuery;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.pricePerHour - b.pricePerHour;
      if (sortBy === "price_desc") return b.pricePerHour - a.pricePerHour;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // recommended
    });
  }, [query, selectedCategory, selectedCity, maxPrice, sortBy, locale]);

  const categoryTabs = [
    { id: "all", name: t.categories.all },
    { id: "coworking", name: t.categories.work },
    { id: "sports", name: t.categories.sports },
    { id: "meetings", name: t.categories.meetings },
    { id: "events", name: t.categories.events },
    { id: "cinema", name: t.categories.cinema },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Title Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          {t.explore.title}
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          {t.explore.subtitle}
        </p>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categoryTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSelectedCategory(tab.id)}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCategory === tab.id
                ? "bg-accent text-white shadow-sm"
                : "border border-border bg-surface-card text-ink hover:bg-surface-muted"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl border border-border bg-surface-card p-4 shadow-sm">
        {/* Keyword Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.common.searchPlaceholder}
            className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-xs font-medium text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none"
          />
        </div>

        {/* City Filter */}
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-xs font-semibold text-ink focus:border-accent focus:outline-none cursor-pointer"
          >
            <option value="all">
              {locale === "uz"
                ? "Barcha shaharlar (Toshkent, Samarqand...)"
                : locale === "ru"
                  ? "Все города (Ташкент, Самарканд...)"
                  : "All cities (Tashkent, Samarkand...)"}
            </option>
            <option value="toshkent">Toshkent</option>
            <option value="samarqand">Samarqand</option>
            <option value="buxoro">Buxoro</option>
          </select>
        </div>

        {/* Sort Select */}
        <div className="relative">
          <SlidersHorizontal className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="w-full rounded-xl border border-border bg-surface pl-9 pr-3 py-2 text-xs font-semibold text-ink focus:border-accent focus:outline-none cursor-pointer"
          >
            <option value="recommended">{t.explore.sortRecommended}</option>
            <option value="price_asc">{t.explore.sortPriceLow}</option>
            <option value="price_desc">{t.explore.sortPriceHigh}</option>
            <option value="rating">{t.explore.sortRating}</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCategory("all");
              setSelectedCity("all");
              setSortBy("recommended");
            }}
            className="w-full rounded-xl border border-border bg-surface-muted py-2 text-xs font-bold text-ink transition hover:bg-border cursor-pointer text-center"
          >
            {t.explore.clearFilters}
          </button>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs font-semibold text-ink-muted">
        <span>
          {filteredVenues.length} {t.explore.showingResults}
        </span>
        <Link href="/map" className="text-accent hover:underline flex items-center gap-1 font-bold">
          <MapPin className="h-3.5 w-3.5" />
          <span>{locale === "uz" ? "Xaritada ko‘rish" : locale === "ru" ? "Показать на карте" : "View on Map"}</span>
        </Link>
      </div>

      {/* Venues Grid Display */}
      {filteredVenues.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-surface-card p-12 text-center space-y-3">
          <div className="h-12 w-12 mx-auto rounded-full bg-surface-muted flex items-center justify-center text-ink-muted">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-ink">{t.explore.noVenuesFound}</h3>
          <p className="text-xs text-ink-muted max-w-sm mx-auto">
            Qidiruv so‘rovingizni o‘zgartiring yoki filtrlarni tozalab qaytadan ko‘ring.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedCategory("all");
              setSelectedCity("all");
            }}
            className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-hover cursor-pointer"
          >
            {t.explore.clearFilters}
          </button>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence>
            {filteredVenues.map((venue) => {
              const mainResource = venue.resources[0];
              const description = venue.description[locale] || venue.description.uz;
              const categoryLabel =
                venue.category === "coworking"
                  ? t.categories.work
                  : venue.category === "sports"
                    ? t.categories.sports
                    : venue.category === "meetings"
                      ? t.categories.meetings
                      : venue.category === "events"
                        ? t.categories.events
                        : venue.category === "cinema"
                          ? t.categories.cinema
                          : venue.category;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  key={venue.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm transition hover:border-border-strong hover:shadow-md"
                >
                  {/* Photo Preview with Badges */}
                  <Link
                    href={`/venues/${venue.slug}`}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted block"
                  >
                    <Image
                      src={venue.featuredImage}
                      alt={venue.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                    {/* Rating Badge */}
                    <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-xl bg-white/95 dark:bg-slate-900/90 px-2.5 py-1 text-xs font-black text-ink shadow-sm backdrop-blur-md">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{venue.rating}</span>
                      <span className="text-[10px] font-normal text-ink-muted">({venue.reviewCount})</span>
                    </div>

                    {/* Category Tag */}
                    <div className="absolute right-3 top-3 rounded-xl bg-black/60 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                      {categoryLabel}
                    </div>

                    {/* Verified Guarantee */}
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-lg bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{t.common.verified}</span>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs text-ink-muted">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-accent" />
                          {venue.district}, {venue.city}
                        </span>
                        {mainResource && (
                          <span className="inline-flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-ink-subtle" />
                            {mainResource.capacity} {t.common.seats}
                          </span>
                        )}
                      </div>

                      <Link href={`/venues/${venue.slug}`}>
                        <h2 className="mt-2 text-base font-bold text-ink group-hover:text-accent transition line-clamp-1">
                          {venue.name}
                        </h2>
                      </Link>

                      <p className="mt-1 text-xs text-ink-muted line-clamp-2 leading-relaxed">
                        {description}
                      </p>

                      {/* Amenities Pills */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {venue.amenities.slice(0, 3).map((a, i) => (
                          <span
                            key={i}
                            className="rounded-lg bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-ink-muted"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <div>
                        <span className="text-base font-black text-ink">
                          {formatPrice(venue.pricePerHour)} UZS
                        </span>
                        <span className="text-[11px] text-ink-muted"> / {t.common.pricePerHour}</span>
                      </div>

                      <Link
                        href={`/venues/${venue.slug}`}
                        className="inline-flex items-center gap-1 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-accent-hover cursor-pointer"
                      >
                        <span>{t.common.bookNow}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12 text-center text-xs font-semibold text-ink-muted animate-pulse">
          Qidirilmoqda...
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
