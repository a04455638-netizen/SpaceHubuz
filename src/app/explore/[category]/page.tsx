import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, ArrowLeft } from "lucide-react";

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
    id: "work",
    title: "Kovorking va O‘qish joylari",
    description:
      "Toshkent va viloyatlar bo‘ylab qulay, sokin ish stollari, tezkor Wi-Fi va muzokaralar xonalari.",
    banner: "/images/generated/banner-coworking.svg",
  },
  sports: {
    id: "sports",
    title: "Sport maydonlari va Zallar",
    description:
      "Futsal, mini-futbol, tennis kortlari, padel va zamonaviy trenajyor zallari.",
    banner: "/images/generated/banner-sports.svg",
  },
  meetings: {
    id: "meetings",
    title: "Majlis va Konferensiya xonalari",
    description:
      "Kichik jamoaviy uchrashuvlardan tortib, 100 kishilik xalqaro anjumanlar uchun jihozlangan zallar.",
    banner: "/images/generated/banner-meetings.svg",
  },
  events: {
    id: "events",
    title: "Tadbir va Bayram zallari",
    description:
      "Korporativ bayramlar, seminarlar, taqdimotlar va tantanalar uchun moslashuvchan maydonlar.",
    banner: "/images/generated/banner-events.svg",
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

  // Curated demo venues corresponding to this category
  const mockVenues = [
    {
      slug: `${category}-premier-spot-1`,
      name: `${config.title} — Markaziy Filial`,
      city: "Toshkent",
      district: "Yunusobod tumani",
      address: "Amir Temur shoh ko‘chasi, 45",
      price: "60 000 so‘m",
      rating: "4.9",
      reviews: 34,
      image: `/images/generated/demo-${category === "coworking" ? "coworking" : category === "sports" ? "sports" : category === "meetings" ? "meetings" : "events"}-1.svg`,
      amenities: ["Wi-Fi", "Konditsioner", "Avtoturargoh", "Kofe zona"],
    },
    {
      slug: `${category}-premier-spot-2`,
      name: `${config.title} — Yangi Hayot Suite`,
      city: "Toshkent",
      district: "Yakkasaroy tumani",
      address: "Bobur ko‘chasi, 12",
      price: "85 000 so‘m",
      rating: "4.8",
      reviews: 21,
      image: `/images/generated/demo-${category === "coworking" ? "coworking" : category === "sports" ? "sports" : category === "meetings" ? "meetings" : "events"}-1.svg`,
      amenities: ["Audio tizim", "Xavfsizlik 24/7", "Dush", "VIP zona"],
    },
  ];

  return (
    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Barcha toifalarga qaytish
      </Link>

      <div className="relative mt-6 overflow-hidden rounded-2xl bg-ink p-8 text-white">
        <div className="absolute right-0 top-0 h-full w-1/2 opacity-25 pointer-events-none hidden md:block">
          <Image
            src={config.banner}
            alt={config.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
            Katalog bo‘limi
          </span>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            {config.title}
          </h1>
          <p className="mt-3 text-sm text-emerald-100 leading-relaxed">
            {config.description}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-ink">
          Mavjud takliflar ({mockVenues.length})
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockVenues.map((v) => (
            <div
              key={v.slug}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface-card transition hover:shadow-lg"
            >
              <div>
                <div className="relative aspect-[16/10] w-full bg-surface-muted">
                  <Image
                    src={v.image}
                    alt={v.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-1 text-xs text-ink-muted">
                    <MapPin className="h-3.5 w-3.5 text-accent" />
                    <span>
                      {v.city}, {v.district}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-ink">
                    {v.name}
                  </h3>
                  <p className="mt-1 text-xs text-ink-subtle">{v.address}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {v.amenities.map((a) => (
                      <span
                        key={a}
                        className="rounded-md bg-surface-muted px-2 py-0.5 text-xs text-ink-muted"
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
                    {v.price}{" "}
                    <span className="text-xs font-normal">/ soat</span>
                  </p>
                </div>
                <Link
                  href={`/explore`}
                  className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-hover"
                >
                  Bo‘sh vaqtlar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
