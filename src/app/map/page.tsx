import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Navigation, Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Xarita orqali qidirish | SpaceHub UZ",
  description:
    "Toshkent va viloyatlardagi barcha joylarni xaritada ko‘ring va masofani hisoblang.",
};

const mapVenues = [
  {
    id: "1",
    name: "C-Space Mirabad",
    category: "Kovorking",
    address: "Toshkent sh., Mirobod t., Nukus ko‘chasi, 29",
    coords: "41.2985° N, 69.2735° E",
    price: "45 000 so‘m / soat",
    rating: "4.9",
    slug: "dev-sample-venue",
    image: "/images/generated/demo-coworking-1.svg",
  },
  {
    id: "2",
    name: "Milliy Futsal Arena",
    category: "Sport maydoni",
    address: "Toshkent sh., Chilonzor t., Qatortol ko‘chasi, 18",
    coords: "41.2789° N, 69.2155° E",
    price: "180 000 so‘m / soat",
    rating: "4.8",
    slug: "dev-sample-venue",
    image: "/images/generated/demo-sports-1.svg",
  },
  {
    id: "3",
    name: "TechPark Grand Conference",
    category: "Majlis xonasi",
    address: "Toshkent sh., Yashnobod t., Farg‘ona yo‘li, 102",
    coords: "41.2855° N, 69.3142° E",
    price: "350 000 so‘m / soat",
    rating: "5.0",
    slug: "dev-sample-venue",
    image: "/images/generated/demo-meetings-1.svg",
  },
];

export default function MapDiscoveryPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Xarita orqali joylarni topish
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Toshkent bo‘ylab barcha tasdiqlangan joylar va ularning joylashuvi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-card px-3 py-1.5 text-xs font-semibold text-ink">
            <Navigation className="h-3.5 w-3.5 text-accent" /> Toshkent markazi
            (UTC+5)
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Venue Listing Cards */}
        <div className="order-2 space-y-4 lg:order-1 lg:max-h-[650px] lg:overflow-y-auto lg:pr-2">
          <div className="rounded-xl border border-border bg-surface-card p-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-subtle" />
              <input
                type="search"
                placeholder="Xaritada qidirish…"
                className="w-full rounded-lg border border-border bg-surface pl-9 pr-3 py-1.5 text-sm text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {mapVenues.map((venue) => (
            <div
              key={venue.id}
              className="flex gap-4 rounded-xl border border-border bg-surface-card p-4 transition hover:border-accent hover:shadow-md"
            >
              <div className="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-surface-muted">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-accent">
                      {venue.category}
                    </span>
                    <span className="text-xs font-bold text-amber-500">
                      ★ {venue.rating}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-ink line-clamp-1">
                    {venue.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-subtle line-clamp-1">
                    {venue.address}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-ink">
                    {venue.price}
                  </span>
                  <Link
                    href={`/venues/${venue.slug}`}
                    className="rounded bg-accent px-2.5 py-1 text-xs font-semibold text-white transition hover:bg-accent-hover"
                  >
                    Ko‘rish
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Map Visual Presentation */}
        <div className="order-1 relative h-[380px] lg:order-2 lg:col-span-2 lg:h-[650px] overflow-hidden rounded-2xl border border-border bg-surface-muted shadow-inner">
          {/* Map Grid Pattern Graphic */}
          <div className="absolute inset-0 bg-[#e8eef3] [data-theme='dark']:bg-[#12232a] opacity-80" />
          <svg
            className="absolute inset-0 h-full w-full stroke-slate-300 [data-theme='dark']:stroke-slate-700 opacity-60"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid-pattern"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 60 0 L 0 0 0 60" fill="none" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            {/* Major Tashkent Roads Simulation */}
            <path
              d="M 50 150 Q 300 200 600 180 T 1000 350"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="8"
            />
            <path
              d="M 200 50 Q 250 350 450 600"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="6"
            />
          </svg>

          {/* Map Pins */}
          <div className="absolute left-[35%] top-[40%] -translate-x-1/2 -translate-y-1/2">
            <div className="group relative flex flex-col items-center">
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                C-Space · 45K
              </span>
              <div className="h-3 w-3 rotate-45 bg-accent -mt-1" />
            </div>
          </div>

          <div className="absolute left-[55%] top-[52%] -translate-x-1/2 -translate-y-1/2">
            <div className="group relative flex flex-col items-center">
              <span className="rounded-full bg-emerald-700 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                Futsal Arena · 180K
              </span>
              <div className="h-3 w-3 rotate-45 bg-emerald-700 -mt-1" />
            </div>
          </div>

          <div className="absolute left-[70%] top-[30%] -translate-x-1/2 -translate-y-1/2">
            <div className="group relative flex flex-col items-center">
              <span className="rounded-full bg-blue-700 px-2.5 py-1 text-xs font-bold text-white shadow-lg">
                TechPark · 350K
              </span>
              <div className="h-3 w-3 rotate-45 bg-blue-700 -mt-1" />
            </div>
          </div>

          {/* Map Floating Controls */}
          <div className="absolute bottom-5 right-5 flex flex-col gap-2 rounded-xl bg-surface-card p-2 shadow-lg border border-border">
            <button
              aria-label="Zoom in"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink font-bold hover:bg-surface-muted"
            >
              +
            </button>
            <div className="h-px bg-border" />
            <button
              aria-label="Zoom out"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-ink font-bold hover:bg-surface-muted"
            >
              −
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
