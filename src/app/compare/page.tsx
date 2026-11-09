import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Check, X, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Joylarni solishtirish | SpaceHub UZ",
  description:
    "3 tagacha joyni narxi, imkoniyatlari va qulayliklari bo‘yicha yonma-yon solishtiring.",
};

const compareVenues = [
  {
    name: "C-Space Mirabad",
    category: "Kovorking",
    pricePerHour: "45 000 so‘m",
    capacity: "35 kishi",
    district: "Mirobod tumani",
    rating: "4.9 (28 sharh)",
    image: "/images/generated/demo-coworking-1.svg",
    slug: "dev-sample-venue",
    features: {
      wifi: true,
      parking: true,
      coffee: true,
      ac: true,
      projector: false,
      shower: false,
      cancellation: "24 soat oldin bepul",
    },
  },
  {
    name: "Milliy Futsal Arena",
    category: "Sport maydoni",
    pricePerHour: "180 000 so‘m",
    capacity: "14 o‘yinchi",
    district: "Chilonzor tumani",
    rating: "4.8 (42 sharh)",
    image: "/images/generated/demo-sports-1.svg",
    slug: "dev-sample-venue",
    features: {
      wifi: true,
      parking: true,
      coffee: false,
      ac: false,
      projector: false,
      shower: true,
      cancellation: "12 soat oldin bepul",
    },
  },
  {
    name: "TechPark Grand Conference",
    category: "Majlis xonasi",
    pricePerHour: "350 000 so‘m",
    capacity: "60 kishi",
    district: "Yashnobod tumani",
    rating: "5.0 (19 sharh)",
    image: "/images/generated/demo-meetings-1.svg",
    slug: "dev-sample-venue",
    features: {
      wifi: true,
      parking: true,
      coffee: true,
      ac: true,
      projector: true,
      shower: false,
      cancellation: "48 soat oldin bepul",
    },
  },
];

export default function ComparePage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Katalogga qaytish
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Joylarni yonma-yon solishtirish
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Tanlangan joylarning narxi, sig‘imi va jihozlarini taqqoslang
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[700px] border-collapse text-left text-sm">
          <thead>
            <tr>
              <th className="w-1/4 p-4 font-bold text-ink">Xususiyat</th>
              {compareVenues.map((v) => (
                <th key={v.name} className="w-1/4 p-4 text-center">
                  <div className="relative mx-auto aspect-[16/10] w-full max-w-[200px] overflow-hidden rounded-xl bg-surface-muted">
                    <Image
                      src={v.image}
                      alt={v.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-ink">{v.name}</h3>
                  <span className="text-xs text-accent font-semibold">
                    {v.category}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="bg-surface-card">
              <td className="p-4 font-semibold text-ink">Soatlik narxi</td>
              {compareVenues.map((v) => (
                <td
                  key={v.name}
                  className="p-4 text-center font-extrabold text-accent"
                >
                  {v.pricePerHour}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-ink">Sig‘imi</td>
              {compareVenues.map((v) => (
                <td key={v.name} className="p-4 text-center text-ink-muted">
                  {v.capacity}
                </td>
              ))}
            </tr>
            <tr className="bg-surface-card">
              <td className="p-4 font-semibold text-ink">Joylashuv (Tuman)</td>
              {compareVenues.map((v) => (
                <td key={v.name} className="p-4 text-center text-ink-muted">
                  {v.district}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-ink">Reyting</td>
              {compareVenues.map((v) => (
                <td
                  key={v.name}
                  className="p-4 text-center text-amber-500 font-semibold"
                >
                  ★ {v.rating}
                </td>
              ))}
            </tr>
            <tr className="bg-surface-card">
              <td className="p-4 font-semibold text-ink">Tezkor Wi-Fi</td>
              {compareVenues.map((v) => (
                <td key={v.name} className="p-4 text-center">
                  {v.features.wifi ? (
                    <Check className="mx-auto h-5 w-5 text-status-success" />
                  ) : (
                    <X className="mx-auto h-5 w-5 text-ink-subtle" />
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-ink">Avtoturargoh</td>
              {compareVenues.map((v) => (
                <td key={v.name} className="p-4 text-center">
                  {v.features.parking ? (
                    <Check className="mx-auto h-5 w-5 text-status-success" />
                  ) : (
                    <X className="mx-auto h-5 w-5 text-ink-subtle" />
                  )}
                </td>
              ))}
            </tr>
            <tr className="bg-surface-card">
              <td className="p-4 font-semibold text-ink">Konditsioner</td>
              {compareVenues.map((v) => (
                <td key={v.name} className="p-4 text-center">
                  {v.features.ac ? (
                    <Check className="mx-auto h-5 w-5 text-status-success" />
                  ) : (
                    <X className="mx-auto h-5 w-5 text-ink-subtle" />
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-ink">Proyektor / Ekran</td>
              {compareVenues.map((v) => (
                <td key={v.name} className="p-4 text-center">
                  {v.features.projector ? (
                    <Check className="mx-auto h-5 w-5 text-status-success" />
                  ) : (
                    <X className="mx-auto h-5 w-5 text-ink-subtle" />
                  )}
                </td>
              ))}
            </tr>
            <tr className="bg-surface-card">
              <td className="p-4 font-semibold text-ink">
                Bekor qilish siyosati
              </td>
              {compareVenues.map((v) => (
                <td
                  key={v.name}
                  className="p-4 text-center text-xs text-ink-muted"
                >
                  {v.features.cancellation}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 font-semibold text-ink">Amal</td>
              {compareVenues.map((v) => (
                <td key={v.name} className="p-4 text-center">
                  <Link
                    href={`/venues/${v.slug}`}
                    className="inline-block rounded-lg bg-accent px-4 py-2 text-xs font-bold text-white transition hover:bg-accent-hover"
                  >
                    Tanlash
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
