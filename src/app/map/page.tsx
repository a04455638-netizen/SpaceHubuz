"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Navigation,
  Search,
  Star,
  ExternalLink,
  ArrowRight,
  Database,
  RefreshCw,
} from "lucide-react";
import { CURATED_VENUES, type CuratedVenue } from "@/server/mock-venues";
import { MapWrapper } from "@/components/map/map-wrapper";
import { useI18n } from "@/lib/i18n";
import { formatPrice } from "@/lib/format-price";

export default function MapDiscoveryPage() {
  const { t, locale } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [venues, setVenues] = useState<CuratedVenue[]>(CURATED_VENUES);
  const [isLiveDatabase, setIsLiveDatabase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<CuratedVenue | null>(
    CURATED_VENUES[0] || null
  );

  // Fetch real-time venue locations from Supabase via /api/venues
  useEffect(() => {
    let cancelled = false;

    async function loadVenues() {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "all") {
          params.set("category", selectedCategory);
        }
        if (searchQuery.trim()) {
          params.set("q", searchQuery.trim());
        }

        const res = await fetch(`/api/venues?${params.toString()}`);
        if (!res.ok) throw new Error("API response error");

        const data = await res.json();
        if (!cancelled && data.venues && Array.isArray(data.venues)) {
          if (data.venues.length > 0) {
            setVenues(data.venues);
            setIsLiveDatabase(true);
            setSelectedVenue((prev) => {
              if (prev && data.venues.some((v: CuratedVenue) => v.id === prev.id)) {
                return prev;
              }
              return data.venues[0] || null;
            });
          }
        }
      } catch {
        // Gracefully stay on curated venues
        if (!cancelled) {
          setIsLiveDatabase(false);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timer = setTimeout(loadVenues, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery]);

  // Client-side instant filter over active venues
  const filteredVenues = venues.filter((venue) => {
    const matchesCategory =
      selectedCategory === "all" || venue.category === selectedCategory;
    const matchesQuery =
      searchQuery.trim() === "" ||
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
              {t.map.title}
            </h1>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                isLiveDatabase
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                  : "bg-surface-muted text-ink-muted border border-border"
              }`}
              title={
                isLiveDatabase
                  ? "Supabase PostgreSQL real-time database connected"
                  : "Curated high-precision verified coordinates"
              }
            >
              <Database className="h-3 w-3" />
              <span>
                {isLiveDatabase
                  ? locale === "uz"
                    ? "Supabase Jonli"
                    : locale === "ru"
                      ? "Supabase Онлайн"
                      : "Supabase Live"
                  : locale === "uz"
                    ? "Tasdiqlangan GPS"
                    : locale === "ru"
                      ? "Проверенный GPS"
                      : "Verified GPS"}
              </span>
            </span>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            {t.map.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-xl border border-border bg-surface-card px-3 py-1.5 text-xs font-semibold text-ink shadow-sm">
            <Navigation className="h-3.5 w-3.5 text-accent" />{" "}
            {locale === "uz"
              ? "Toshkent markazi"
              : locale === "ru"
                ? "Центр Ташкента"
                : "Tashkent City Center"}{" "}
            (41.3111&deg; N, 69.2797&deg; E)
          </span>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {[
          { id: "all", name: t.categories.all },
          { id: "coworking", name: t.categories.work },
          { id: "sports", name: t.categories.sports },
          { id: "meetings", name: t.categories.meetings },
          { id: "events", name: t.categories.events },
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-accent text-white shadow-sm"
                : "border border-border bg-surface-card text-ink hover:bg-surface-muted"
            }`}
          >
            {cat.name}
          </button>
        ))}

        {loading && (
          <span className="flex items-center gap-1 text-xs text-ink-muted ml-2">
            <RefreshCw className="h-3 w-3 animate-spin text-accent" />
            <span>
              {locale === "uz"
                ? "Yangilanmoqda..."
                : locale === "ru"
                  ? "Обновление..."
                  : "Updating..."}
            </span>
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Venue Listing Cards with Search */}
        <div className="order-2 space-y-4 lg:order-1 lg:max-h-[650px] lg:overflow-y-auto lg:pr-2">
          <div className="rounded-xl border border-border bg-surface-card p-3 shadow-sm">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.map.searchPlaceholder}
                className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {filteredVenues.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface-card p-8 text-center text-xs text-ink-muted">
              {t.explore.noVenuesFound}
            </div>
          ) : (
            filteredVenues.map((venue) => {
              const isSelected = selectedVenue?.id === venue.id;
              return (
                <div
                  key={venue.id}
                  onClick={() => setSelectedVenue(venue)}
                  className={`flex gap-4 rounded-2xl border p-3.5 transition cursor-pointer ${
                    isSelected
                      ? "border-accent bg-accent-subtle/30 shadow-md ring-1 ring-accent"
                      : "border-border bg-surface-card hover:border-border-strong hover:shadow-sm"
                  }`}
                >
                  <div className="relative h-24 w-28 flex-shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                    <Image
                      src={venue.featuredImage}
                      alt={venue.name}
                      fill
                      className="object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
                          {venue.category === "coworking"
                            ? t.categories.work
                            : venue.category === "sports"
                              ? t.categories.sports
                              : venue.category === "meetings"
                                ? t.categories.meetings
                                : venue.category === "events"
                                  ? t.categories.events
                                  : venue.category}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                          <Star className="h-3 w-3 fill-amber-500" /> {venue.rating.toFixed(1)}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-ink line-clamp-1 mt-0.5">
                        {venue.name}
                      </h3>
                      <p className="text-[11px] text-ink-muted line-clamp-1 mt-0.5">
                        📍 {venue.district}, {venue.city}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                      <span className="text-xs font-extrabold text-ink">
                        {formatPrice(venue.pricePerHour)} UZS
                        <span className="text-[10px] font-normal text-ink-muted">
                          {" "}
                          / {locale === "uz" ? "soat" : locale === "ru" ? "час" : "hour"}
                        </span>
                      </span>
                      <Link
                        href={`/venues/${venue.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 rounded-lg bg-accent px-2.5 py-1 text-xs font-bold text-white shadow-sm transition hover:bg-accent-hover"
                      >
                        <span>{t.common.viewDetails}</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Interactive Leaflet Map */}
        <div className="order-1 lg:order-2 lg:col-span-2 overflow-hidden rounded-2xl border border-border bg-surface-card shadow-sm flex flex-col">
          <div className="relative flex-1">
            <MapWrapper
              venues={filteredVenues}
              selectedVenueId={selectedVenue?.id}
              onSelectVenue={(v) => setSelectedVenue(v)}
              locale={locale}
              className="h-[420px] lg:h-[580px] w-full"
            />
          </div>

          {/* Bottom Selected Venue Bar */}
          {selectedVenue && (
            <div className="border-t border-border p-4 bg-surface flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-ink">{selectedVenue.name}</h4>
                <p className="text-xs text-ink-muted">
                  📍 {selectedVenue.address} ({selectedVenue.latitude.toFixed(4)}, {selectedVenue.longitude.toFixed(4)})
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedVenue.latitude},${selectedVenue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition"
                  title="Open navigation directions in Google Maps"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>{t.map.openDirections}</span>
                </a>
                <a
                  href={`https://yandex.uz/maps/?rtext=~${selectedVenue.latitude},${selectedVenue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface-card px-3 py-1.5 text-xs font-bold text-ink hover:bg-surface-muted transition"
                  title="Open in Yandex Navigator"
                >
                  <ExternalLink className="h-3.5 w-3.5 text-amber-500" />
                  <span>Yandex Navigator</span>
                </a>
                <Link
                  href={`/venues/${selectedVenue.slug}`}
                  className="inline-flex items-center gap-1 rounded-xl border border-border bg-surface px-4 py-1.5 text-xs font-bold text-ink hover:bg-surface-muted transition shadow-sm"
                >
                  <span>{t.common.viewDetails}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
