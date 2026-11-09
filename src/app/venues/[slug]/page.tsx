import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "../../../catalog/categories";
import { findPublicVenue } from "../../../server/public-venues";
import { CatalogHeader } from "../../catalog-controls";
import { OccupancyViewer } from "./occupancy-viewer";

export const dynamic = "force-dynamic";

export default async function VenuePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const venue = await findPublicVenue(slug);
  if (!venue) notFound();

  return (
    <>
      <CatalogHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <Link href="/explore" className="text-accent underline">
          Katalogga qaytish
        </Link>
        <h1 className="mt-5 text-4xl font-bold">{venue.name}</h1>
        <p className="mt-2">
          {venue.city} · {venue.address}
        </p>
        <h2 className="mb-4 mt-8 text-2xl font-bold">
          Resurslar va band vaqtlar
        </h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {venue.resources.map((resource) => (
            <li
              key={resource.id}
              className="rounded-2xl border border-ink/15 bg-white p-5"
            >
              <h3 className="text-lg font-bold">{resource.name}</h3>
              <p className="mb-4">
                {categories.find(({ id }) => id === resource.categoryId)
                  ?.name ?? "Resurs"}
              </p>
              <OccupancyViewer
                resourceId={resource.id}
                timezone={venue.timezone}
              />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
