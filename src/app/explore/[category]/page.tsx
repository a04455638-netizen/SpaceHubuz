import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, ArrowLeft, Star, ArrowRight } from "lucide-react";
import { CURATED_VENUES } from "@/server/mock-venues";
import { formatPrice } from "@/lib/format-price";

const categoryMap: Record<
  string,
  {
    id: string;
    title: string;
    description: string;
    banner: string;
  }
> = {
  coworking: {
    id: "coworking",
    title: "Kovorking va O‘qish joylari",
    description:
      "Toshkent va viloyatlar bo‘ylab qulay, sokin ish stollari, tezkor optik Wi-Fi va audio-izolyatsiyalangan kabinalar.",
    banner:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  },
  sports: {
    id: "sports",
    title: "Sport maydonlari va Zallar",
    description:
      "FIFA standartidagi futsal maydonlari, professional tennis va padel kortlari hamda zamonaviy trenajyor zallari.",
    banner:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80",
  },
  meetings: {
    id: "meetings",
    title: "Majlis va Konferensiya xonalari",
    description:
      "Kichik jamoaviy uchrashuvlardan tortib, 120 kishilik xalqaro anjumanlar uchun to‘liq jihozlangan multimedia zallari.",
    banner:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80",
  },
  events: {
    id: "events",
    title: "Tadbir va Bayram zallari",
    description:
      "Korporativ kechalar, tantanalar, seminarlar va ko‘rgazmalar uchun moslashuvchan maydonlar.",
    banner:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const config = categoryMap[category];
  if (!config) return { title: "Toifa topilmadi | SpaceHub UZ" };
  return {
    title: `${config.title} | SpaceHub UZ`,
    description: config.description,
  };
}

export default async function CategoryExplorePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const config = categoryMap[category];
  if (!config) notFound();

  // Filter curated venues matching this category
  const venues = CURATED_VENUES.filter((v) => v.category === category);

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Barcha joylarni ko‘rish
        </Link>

        {/* Category Header Banner */}
        <div className="relative mt-6 overflow-hidden rounded-3xl bg-slate-950 p-8 sm:p-12 text-white shadow-xl">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <Image
              src={config.banner}
              alt={config.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
          </div>
          <div className="relative z-10 max-w-xl">
            <span className="inline-block rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/40">
              Katalog toifasi
            </span>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              {config.title}
            </h1>
            <p className="mt-3 text-sm text-emerald-100/90 leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>

        {/* Venues Grid */}
        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-ink">
              Mavjud tasdiqlangan obyektlar ({venues.length})
            </h2>
            <Link
              href="/map"
              className="text-xs font-semibold text-accent hover:underline"
            >
              Xaritada ko‘rish →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface-card transition duration-200 hover:shadow-xl hover:-translate-y-0.5"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
                    <Image
                      src={venue.featuredImage}
                      alt={venue.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-slate-900/90 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {venue.categoryName.uz}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-ink-muted">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span className="truncate">
                          {venue.city}, {venue.district}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{venue.rating.toFixed(1)}</span>
                        <span className="text-ink-subtle">
                          ({venue.reviewCount})
                        </span>
                      </div>
                    </div>

                    <h3 className="mt-2.5 text-lg font-bold text-ink group-hover:text-accent transition line-clamp-1">
                      {venue.name}
                    </h3>
                    <p className="mt-1 text-xs text-ink-subtle truncate">
                      {venue.address}
                    </p>

                    <p className="mt-3 text-xs text-ink-muted line-clamp-2 leading-relaxed">
                      {venue.description.uz}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {venue.amenities.slice(0, 4).map((a) => (
                        <span
                          key={a}
                          className="rounded-md bg-surface-muted px-2 py-0.5 text-xs text-ink-muted border border-border/50"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border p-4 bg-surface-card">
                  <div>
                    <span className="text-xs text-ink-subtle">Narxi:</span>
                    <p className="text-sm font-extrabold text-ink">
                      {formatPrice(venue.pricePerHour)} UZS{" "}
                      <span className="text-xs font-normal text-ink-muted">
                        / soat
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/venues/${venue.slug}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-hover shadow-sm"
                  >
                    <span>Band qilish</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
