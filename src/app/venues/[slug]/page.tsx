import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  MapPin,
  Star,
  ShieldCheck,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { findPublicVenue } from "../../../server/public-venues";
import { CURATED_VENUES } from "../../../server/mock-venues";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const venue = await findPublicVenue(slug);
  if (!venue) return { title: "Joy topilmadi | SpaceHub UZ" };
  return {
    title: `${venue.name} — SpaceHub UZ`,
    description: venue.description?.uz || venue.address,
  };
}

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = (await findPublicVenue(slug)) || CURATED_VENUES[0];
  if (!venue) notFound();

  const mainResource = venue.resources[0];
  const bookingResourceId = mainResource?.id || "r-demo-1";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Back button */}
      <Link
        href="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Barcha joylarga qaytish
      </Link>

      {/* Title & Location Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-accent-subtle px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
              {venue.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
              <Star className="h-3.5 w-3.5 fill-amber-500" /> {venue.rating} ({venue.reviewCount} ta sharh)
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-status-success">
              <ShieldCheck className="h-3.5 w-3.5" /> Tasdiqlangan
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-black text-ink sm:text-3xl lg:text-4xl">
            {venue.name}
          </h1>

          <p className="mt-1 flex items-center gap-1 text-sm text-ink-muted">
            <MapPin className="h-4 w-4 text-accent shrink-0" />
            <span>{venue.address}, {venue.district}, {venue.city}</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={`https://maps.google.com/?q=${venue.latitude},${venue.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-card px-3.5 py-2 text-xs font-bold text-ink shadow-sm hover:bg-surface-muted transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-accent" />
            <span>Google Maps</span>
          </a>
          <a
            href={`https://yandex.uz/maps/?pt=${venue.longitude},${venue.latitude}&z=16&l=map`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface-card px-3.5 py-2 text-xs font-bold text-ink shadow-sm hover:bg-surface-muted transition"
          >
            <ExternalLink className="h-3.5 w-3.5 text-amber-500" />
            <span>Yandex Maps</span>
          </a>
          <Link
            href={`/booking/${bookingResourceId}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-accent-hover"
          >
            <Calendar className="h-4 w-4" />
            <span>Bron qilish</span>
          </Link>
        </div>
      </div>

      {/* High-Resolution Photo Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 rounded-3xl overflow-hidden">
        <div className="relative md:col-span-2 aspect-[16/10] md:aspect-auto md:h-[420px] bg-surface-muted overflow-hidden">
          <Image
            src={venue.gallery[0] || venue.featuredImage}
            alt={venue.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-300 hover:scale-105"
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-3 h-[420px]">
          {venue.gallery.slice(1, 5).map((imgUrl, idx) => (
            <div key={idx} className="relative h-[202px] bg-surface-muted overflow-hidden rounded-xl">
              <Image
                src={imgUrl}
                alt={`${venue.name} photo ${idx + 2}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition duration-300 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Details and Booking Card Sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Details, Rooms, Amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-ink">Joy haqida</h2>
            <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-line">
              {venue.description?.uz || "Toshkent shahridagi qulay va zamonaviy joy."}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs">
                <Users className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-ink-muted">Sig&apos;imi</p>
                  <p className="font-bold text-ink">{mainResource?.capacity || 20} kishilik</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Clock className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-ink-muted">Ish tartibi</p>
                  <p className="font-bold text-ink">09:00 — 22:00 (Har kuni)</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <div>
                  <p className="text-ink-muted">Kafolat</p>
                  <p className="font-bold text-ink">Kafolatlangan vaqt</p>
                </div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-ink">Mavjud qulayliklar va jihozlar</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {venue.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-semibold text-ink p-2 rounded-xl bg-surface">
                  <CheckCircle className="h-4 w-4 text-status-success shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Available Rooms / Resources */}
          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-ink">Mavjud xonalar va maydonlar</h2>
            <div className="space-y-3">
              {venue.resources.map((res) => (
                <div
                  key={res.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-surface hover:border-accent transition gap-4"
                >
                  <div>
                    <h3 className="text-sm font-bold text-ink">{res.name}</h3>
                    <p className="text-xs text-ink-muted mt-0.5">
                      Sig&apos;imi: {res.capacity} kishi &middot; Min. bron: {res.minBookingDurationHours} soat
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <p className="text-sm font-black text-accent">{res.pricePerHour.toLocaleString()} UZS</p>
                      <p className="text-[10px] text-ink-muted">soatiga</p>
                    </div>
                    <Link
                      href={`/booking/${res.id}`}
                      className="rounded-xl bg-accent px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-accent-hover transition whitespace-nowrap"
                    >
                      Vaqtni tanlash
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map Preview */}
          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-ink">Manzil va Xarita</h2>
            <p className="text-xs text-ink-muted">{venue.address}, {venue.district}, {venue.city}</p>
            <div className="relative h-[250px] w-full rounded-xl overflow-hidden border border-border">
              <iframe
                title="Venue Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${venue.longitude - 0.01}%2C${venue.latitude - 0.008}%2C${venue.longitude + 0.01}%2C${venue.latitude + 0.008}&amp;layer=mapnik&amp;marker=${venue.latitude}%2C${venue.longitude}`}
              />
            </div>
          </div>
        </div>

        {/* Right Sticky Booking Box */}
        <div className="space-y-6">
          <div className="sticky top-20 rounded-2xl border border-border bg-surface-card p-6 shadow-sm space-y-5">
            <div>
              <span className="text-2xl font-black text-ink">
                {venue.pricePerHour.toLocaleString()} UZS
              </span>
              <span className="text-xs text-ink-muted"> / soatiga</span>
            </div>

            <div className="rounded-xl border border-border bg-surface p-4 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Reyting:</span>
                <span className="font-bold text-amber-500">★ {venue.rating} ({venue.reviewCount} sharh)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Kafolatlangan joy:</span>
                <span className="font-bold text-status-success">Ha (Real vaqt)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-muted">Bekor qilish:</span>
                <span className="font-semibold text-ink">24 soat oldin bepul</span>
              </div>
            </div>

            <Link
              href={`/booking/${bookingResourceId}`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-accent-hover text-center"
            >
              <Calendar className="h-4 w-4" />
              <span>Sana va vaqtni tanlash</span>
            </Link>

            <div className="pt-2 border-t border-border text-center space-y-2">
              <p className="text-[11px] text-ink-muted">
                15 daqiqalik vaqtinchalik bron (hold) yaratiladi
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-ink-muted">
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3 text-accent" /> {venue.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-accent" /> {venue.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
