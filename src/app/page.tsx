import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  ShieldCheck,
  Clock,
  ArrowRight,
  Sparkles,
  Award,
} from "lucide-react";

export default function Home() {
  const primaryCategories = [
    {
      id: "work",
      slug: "coworking",
      name: "Kovorking va o‘qish",
      desc: "Sokin ish stollari, shaxsiy ofislar va o‘quv xonalari",
      banner: "/images/generated/banner-coworking.svg",
      count: "120+ joy",
    },
    {
      id: "sports",
      slug: "sports",
      name: "Sport maydonlari",
      desc: "Futsal, tennis, padel kortlari va zamonaviy trenajyor zallari",
      banner: "/images/generated/banner-sports.svg",
      count: "85+ maydon",
    },
    {
      id: "meetings",
      slug: "meetings",
      name: "Majlis va konferensiya",
      desc: "Proyektor, audio tizim va tezkor internetli uchrashuv xonalari",
      banner: "/images/generated/banner-meetings.svg",
      count: "95+ xona",
    },
    {
      id: "events",
      slug: "events",
      name: "Tadbir va bayram zallari",
      desc: "Keng zallar, seminarlar va tantanalar uchun maxsus maydonlar",
      banner: "/images/generated/banner-events.svg",
      count: "40+ zal",
    },
  ];

  const featuredVenues = [
    {
      slug: "c-space-mirabad",
      name: "C-Space Mirabad Workspace",
      category: "Kovorking",
      city: "Toshkent",
      district: "Mirobod tumani",
      price: "45 000 so‘m",
      image: "/images/generated/demo-coworking-1.svg",
      rating: "4.9",
      reviews: 28,
    },
    {
      slug: "milliy-futsal-arena",
      name: "Milliy Futsal & Padel Arena",
      category: "Sport maydoni",
      city: "Toshkent",
      district: "Chilonzor tumani",
      price: "180 000 so‘m",
      image: "/images/generated/demo-sports-1.svg",
      rating: "4.8",
      reviews: 42,
    },
    {
      slug: "techpark-conference-hall",
      name: "TechPark Grand Conference Hall",
      category: "Konferensiya",
      city: "Toshkent",
      district: "Yashnobod tumani",
      price: "350 000 so‘m",
      image: "/images/generated/demo-meetings-1.svg",
      rating: "5.0",
      reviews: 19,
    },
    {
      slug: "registan-event-pavilion",
      name: "Registon Luxury Event Pavilion",
      category: "Tadbir zali",
      city: "Samarqand",
      district: "Markaz",
      price: "1 200 000 so‘m",
      image: "/images/generated/demo-events-1.svg",
      rating: "4.9",
      reviews: 35,
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-ink py-16 sm:py-24 text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <Image
            src="/images/generated/hero-banner.svg"
            alt="SpaceHub Architecture Background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-accent/40">
              <Sparkles className="h-3.5 w-3.5" />
              O‘zbekistonning #1 Joylar Agregatori
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-6xl text-white">
              Kerakli joyni toping va{" "}
              <span className="text-emerald-400">aniq vaqtga</span> band qiling.
            </h1>
            <p className="mt-5 text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
              Futsal maydoni, sokin ish joyi yoki 50 kishilik konferensiya zali.
              Oraliqlar real vaqtda bazadan tekshiriladi va ikki mijoz bir
              vaqtda band qila olmaydi.
            </p>
          </div>

          {/* Search Box */}
          <div className="mt-10 rounded-2xl bg-surface-card p-4 sm:p-5 shadow-2xl ring-1 ring-border text-ink">
            <form
              action="/explore"
              method="GET"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Joy yoki xizmat nomi
                </label>
                <div className="relative mt-1.5">
                  <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
                  <input
                    type="search"
                    name="q"
                    placeholder="Masalan, futsal yoki kovorking"
                    className="w-full rounded-xl border border-border bg-surface px-9 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Toifa
                </label>
                <div className="relative mt-1.5">
                  <select
                    name="category"
                    defaultValue=""
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="">Barcha toifalar</option>
                    <option value="work">Ish va o‘qish</option>
                    <option value="sports">Sport maydonlari</option>
                    <option value="meetings">Majlis va trening</option>
                    <option value="events">Tadbir joylari</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Shahar / Tuman
                </label>
                <div className="relative mt-1.5">
                  <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-ink-subtle" />
                  <input
                    type="text"
                    name="city"
                    placeholder="Toshkent, Samarqand…"
                    className="w-full rounded-xl border border-border bg-surface px-9 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-accent-hover"
                >
                  <Search className="h-4 w-4" />
                  <span>Qidirish</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Primary Categories Grid */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Asosiy toifalar
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Ehtiyojingizga mos joy toifasini tanlang va bo‘sh soatlarni
              ko‘ring
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            Barcha 22 toifani ko‘rish
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {primaryCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/explore/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-surface-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-muted">
                <Image
                  src={cat.banner}
                  alt={cat.name}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-ink group-hover:text-accent transition">
                    {cat.name}
                  </h3>
                  <span className="text-xs font-semibold text-accent">
                    {cat.count}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ink-muted line-clamp-2">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-surface-subtle py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Tavsiya etiladigan joylar
              </span>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Ommabop va tasdiqlangan obyektlar
              </h2>
            </div>
            <Link
              href="/explore"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
            >
              Katalogda ko‘rish
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredVenues.map((venue) => (
              <div
                key={venue.slug}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-surface-card transition duration-200 hover:shadow-lg"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-muted">
                    <Image
                      src={venue.image}
                      alt={venue.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                      {venue.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 text-xs text-ink-muted">
                      <MapPin className="h-3.5 w-3.5 text-accent" />
                      <span>
                        {venue.city}, {venue.district}
                      </span>
                    </div>
                    <h3 className="mt-2 text-base font-bold text-ink group-hover:text-accent transition line-clamp-1">
                      {venue.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-1 text-xs text-amber-500 font-semibold">
                      <span>★ {venue.rating}</span>
                      <span className="text-ink-subtle">
                        ({venue.reviews} sharh)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border p-4 bg-surface-card">
                  <div>
                    <span className="text-xs text-ink-subtle">
                      Boshlanish narxi:
                    </span>
                    <p className="text-sm font-extrabold text-ink">
                      {venue.price}{" "}
                      <span className="text-xs font-normal text-ink-muted">
                        / soat
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/venues/${venue.slug}`}
                    className="rounded-lg bg-accent px-3 py-1.5 text-xs font-bold text-white transition hover:bg-accent-hover"
                  >
                    Band qilish
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Guarantees */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-subtle text-accent">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">
              Ikki tomonlama bandlikdan 100% himoya
            </h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              PostgreSQL exclusion constraint texnologiyasi orqali bir xil vaqt
              oralig‘i ikki xaridorga aslo sotilmaydi.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-subtle text-accent">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">
              Onlayn Click &amp; Payme to‘lov
            </h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              O‘zbekistondagi milliy to‘lov tizimlari orqali tezkor va xavfsiz
              to‘lang yoki joyida to‘lash imkoniyatidan foydalaning.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-card p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-subtle text-accent">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-ink">
              Doimiy saqlanadigan buyurtmalar
            </h3>
            <p className="mt-2 text-sm text-ink-muted leading-relaxed">
              Saytdan chiqsangiz yoki boshqa qurilmadan kirsangiz ham barcha
              buyurtmalaringiz, cheklaringiz va QR ruxsatnomangiz saqlanadi.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
