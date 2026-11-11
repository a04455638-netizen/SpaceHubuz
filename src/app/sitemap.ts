import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://spacehub.uz";
  const now = new Date();

  const publicRoutes = [
    "",
    "/explore",
    "/explore/coworking",
    "/explore/sports",
    "/explore/meetings",
    "/explore/events",
    "/map",
    "/compare",
    "/ai-assistant",
    "/design-system",
    "/about",
    "/help",
    "/support",
    "/legal/terms",
    "/legal/privacy",
    "/auth/login",
  ];

  return publicRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route.startsWith("/explore") ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route.startsWith("/explore") ? 0.8 : 0.5,
  }));
}
