import { getDatabase } from "./db";
import { searchCuratedVenues, getVenueBySlug, type CuratedVenue } from "./mock-venues";

const publicVenue = () => ({
  publishedAt: { lte: new Date() },
  resources: { some: { active: true } },
});

export async function findPublicVenues(query: string, categoryId: string) {
  const db = getDatabase();

  if (db) {
    try {
      const resourceFilter = {
        active: true,
        ...(categoryId ? { categoryId } : {}),
      };
      const dbVenues = await db.venue.findMany({
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
        include: {
          resources: { where: { active: true } },
        },
        orderBy: [{ publishedAt: "desc" }, { id: "asc" }],
        take: 24,
      });

      if (dbVenues.length > 0) {
        return dbVenues.map((v) => ({
          id: v.id,
          slug: v.slug,
          name: v.name,
          category: (v.category as "coworking" | "sports" | "meetings" | "events") || "coworking",
          city: v.city,
          district: v.district || "Toshkent",
          address: v.address,
          latitude: v.latitude || 41.3111,
          longitude: v.longitude || 69.2797,
          phone: v.phone || "+998 71 200 00 00",
          rating: 4.9,
          reviewCount: 42,
          pricePerHour: v.resources[0]?.pricePerHour || 50000,
          featuredImage: v.images[0] || "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
          gallery: v.images.length > 0 ? v.images : [
            "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
          ],
          amenities: v.amenities.length > 0 ? v.amenities : ["Wi-Fi", "Konditsioner", "Avtoturargoh"],
          resources: v.resources.map((r) => ({
            id: r.id,
            name: r.name,
            categoryId: r.categoryId,
            capacity: r.capacity,
            pricePerHour: r.pricePerHour,
            minBookingDurationHours: r.minBookingDurationHours,
            amenities: r.amenities,
            images: r.images,
            active: r.active,
          })),
        }));
      }
    } catch (e) {
      console.warn("DB public venues lookup fallback to curated list:", e);
    }
  }

  // Fallback to high-quality curated venues
  return searchCuratedVenues(query, categoryId);
}

export async function findPublicVenue(slug: string): Promise<CuratedVenue | null> {
  const db = getDatabase();

  if (db) {
    try {
      const v = await db.venue.findFirst({
        where: { slug, ...publicVenue() },
        include: {
          resources: { where: { active: true } },
        },
      });

      if (v) {
        return {
          id: v.id,
          slug: v.slug,
          name: v.name,
          category: (v.category as "coworking" | "sports" | "meetings" | "events") || "coworking",
          categoryName: {
            uz: v.category === "coworking" ? "Kovorking" : v.category === "sports" ? "Sport" : v.category === "meetings" ? "Majlislar" : "Tadbirlar",
            ru: "Категория",
            en: "Category",
          },
          address: v.address,
          city: v.city,
          district: v.district || "Toshkent",
          latitude: v.latitude || 41.3111,
          longitude: v.longitude || 69.2797,
          phone: v.phone || "+998 71 200 00 00",
          email: v.email || "info@spacehub.uz",
          rating: 4.9,
          reviewCount: 42,
          pricePerHour: v.resources[0]?.pricePerHour || 50000,
          description: {
            uz: v.description || "Toshkentdagi qulay va zamonaviy joy.",
            ru: v.description || "Современное и удобное пространство в Ташкенте.",
            en: v.description || "Modern and comfortable space in Tashkent.",
          },
          amenities: v.amenities.length > 0 ? v.amenities : ["Wi-Fi", "Konditsioner", "Avtoturargoh"],
          featuredImage: v.images[0] || "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
          gallery: v.images.length > 0 ? v.images : [
            "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
          ],
          resources: v.resources.map((r) => ({
            id: r.id,
            name: r.name,
            categoryId: r.categoryId,
            capacity: r.capacity,
            pricePerHour: r.pricePerHour,
            minBookingDurationHours: r.minBookingDurationHours,
            amenities: r.amenities,
            images: r.images,
            active: r.active,
          })),
        };
      }
    } catch (e) {
      console.warn("DB find venue fallback:", e);
    }
  }

  const fallback = getVenueBySlug(slug);
  return fallback ?? null;
}
