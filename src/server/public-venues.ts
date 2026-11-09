import { getDatabase } from "./db";

const publicVenue = () => ({
  publishedAt: { lte: new Date() },
  resources: { some: { active: true } },
});

export async function findPublicVenues(query: string, categoryId: string) {
  const db = getDatabase();
  if (!db) return null;

  const resourceFilter = {
    active: true,
    ...(categoryId ? { categoryId } : {}),
  };
  return db.venue.findMany({
    where: {
      ...publicVenue(),
      resources: { some: resourceFilter },
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { city: { contains: query, mode: "insensitive" } },
              { address: { contains: query, mode: "insensitive" } },
              {
                resources: {
                  some: {
                    ...resourceFilter,
                    name: { contains: query, mode: "insensitive" },
                  },
                },
              },
            ],
          }
        : {}),
    },
    select: { slug: true, name: true, city: true, address: true },
    orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
    take: 24,
  });
}

export async function findPublicVenue(slug: string) {
  const db = getDatabase();
  if (!db) return null;

  return db.venue.findFirst({
    where: { slug, ...publicVenue() },
    select: {
      name: true,
      address: true,
      city: true,
      timezone: true,
      resources: {
        where: { active: true },
        select: { id: true, name: true, categoryId: true },
        orderBy: [{ name: "asc" }, { id: "asc" }],
      },
    },
  });
}
