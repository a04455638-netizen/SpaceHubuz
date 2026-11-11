import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json({ favorites: [] });
  }

  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();
      const favorites = await prisma.favorite.findMany({
        where: { userId: user.id },
        include: { venue: true },
      });
      await prisma.$disconnect();
      return NextResponse.json({ favorites });
    } catch (e) {
      console.warn("Favorites query fallback:", e);
    }
  }

  return NextResponse.json({ favorites: [] });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Kirish talab etiladi" },
      { status: 401 }
    );
  }

  try {
    const { venueId } = await request.json();
    if (!venueId) {
      return NextResponse.json({ error: "venueId is required" }, { status: 400 });
    }

    if (process.env.DATABASE_URL) {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      // Check if existing
      const existing = await prisma.favorite.findUnique({
        where: { userId_venueId: { userId: user.id, venueId } },
      });

      if (existing) {
        await prisma.favorite.delete({
          where: { id: existing.id },
        });
        await prisma.$disconnect();
        return NextResponse.json({ favorited: false });
      }

      await prisma.favorite.create({
        data: {
          userId: user.id,
          venueId,
        },
      });
      await prisma.$disconnect();
      return NextResponse.json({ favorited: true });
    }

    return NextResponse.json({ favorited: true, simulated: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: "FAVORITE_FAILED", message }, { status: 500 });
  }
}
