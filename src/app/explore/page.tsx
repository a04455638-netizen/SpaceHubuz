import type { Metadata } from "next";
import Link from "next/link";
import { findPublicVenues } from "../../server/public-venues";
import { categories, searchCategories } from "../../catalog/categories";
import {
  CatalogHeader,
  CatalogSearch,
  CategoryGrid,
} from "../catalog-controls";

export const metadata: Metadata = { title: "Katalog | SpaceHub UZ" };

export const dynamic = "force-dynamic";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function Explore({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, category } = await searchParams;
  const query = typeof q === "string" ? q.slice(0, 120).trim() : "";
  const selected =
    typeof category === "string"
      ? categories.find((item) => item.id === category)
      : undefined;
  const results = searchCategories(query, selected?.id ?? "");
  const venues = await findPublicVenues(query, selected?.id ?? "");

  return (
    <>
      <CatalogHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <h1 className="mb-5 text-4xl font-bold">
          {selected?.name ?? "Bron katalogi"}
        </h1>
        <CatalogSearch query={query} categoryId={selected?.id} />
        <section aria-labelledby="results" className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="results" className="text-xl font-bold">
              {results.length} ta toifa topildi
            </h2>
            {(query || selected) && (
              <Link href="/explore" className="text-accent underline">
                Filtrlarni tozalash
              </Link>
            )}
          </div>
          {results.length > 0 ? (
            <CategoryGrid items={results} />
          ) : (
            <p>Boshqa so‘z yoki toifa bilan qidirib ko‘ring.</p>
          )}
        </section>
        <section
          aria-labelledby="listings"
          className="mt-8 rounded-2xl border border-ink/15 p-5"
        >
          <h2 id="listings" className="text-lg font-bold">
            Bron qilinadigan takliflar
          </h2>
          {venues?.length ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {venues.map((venue) => (
                <li key={venue.slug} className="rounded-lg bg-white p-4">
                  <Link
                    href={`/venues/${encodeURIComponent(venue.slug)}`}
                    className="font-semibold text-accent underline"
                  >
                    {venue.name}
                  </Link>
                  <p className="mt-1 text-sm">
                    {venue.city} · {venue.address}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2">
              {venues === null
                ? "Joylar katalogi uchun ma’lumotlar bazasi ulanmagan."
                : "Mos e’lon topilmadi."}
            </p>
          )}
          {venues?.length === 24 && (
            <p className="mt-3 text-sm">
              Qidiruvda 24 tagacha joy ko‘rsatiladi.
            </p>
          )}
        </section>
      </main>
    </>
  );
}
