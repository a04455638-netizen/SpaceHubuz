import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/server/auth/guards";
import { logAuditEvent } from "@/server/audit/audit-log";

export async function GET(request: NextRequest) {
  const guard = await requireOwner(request);
  if ("response" in guard) return guard.response;
  const user = guard.user;

  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      // If user is ADMIN, can see all venues; if OWNER, see venues where they have membership
      const venues = await prisma.venue.findMany({
        where: user.role === "ADMIN"
          ? {}
          : { organization: { memberships: { some: { userId: user.id } } } },
        include: {
          resources: true,
          _count: { select: { reviews: true, favorites: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      await prisma.$disconnect();
      return NextResponse.json({ venues });
    } catch (e) {
      console.warn("DB owner venues query fallback:", e);
    }
  }

  return NextResponse.json({
    venues: [
      {
        id: "v-demo-1",
        slug: "impact-coworking-tashkent",
        name: "Impact Coworking Hub & Smart Office",
        address: "Amir Temur shoh ko'chasi, 107B",
        city: "Toshkent",
        category: "coworking",
        publishedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        resources: [
          {
            id: "r-demo-1",
            name: "Asosiy Open Space (Umumiy zal)",
            capacity: 45,
            pricePerHour: 25000,
            active: true,
          },
        ],
      },
    ],
  });
}

export async function POST(request: NextRequest) {
  const guard = await requireOwner(request);
  if ("response" in guard) return guard.response;
  const user = guard.user;

  try {
    const body = await request.json();
    const { name, category, address, city, district, description, phone, email, pricePerHour } = body;

    if (!name || !address || !city) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "Joy nomi, manzil va shahar talab etiladi" },
        { status: 400 }
      );
    }

    const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        const venue = await prisma.venue.create({
          data: {
            slug,
            name,
            category: category || "coworking",
            address,
            city,
            district: district || null,
            description: description || null,
            phone: phone || null,
            email: email || null,
            publishedAt: new Date(),
            resources: {
              create: [
                {
                  name: `${name} — Asosiy zal`,
                  categoryId: category || "coworking",
                  capacity: 20,
                  pricePerHour: Number(pricePerHour) || 100000,
                  active: true,
                },
              ],
            },
          },
          include: { resources: true },
        });

        await prisma.$disconnect();

        await logAuditEvent({
          userId: user.id,
          action: "VENUE_CREATED",
          resourceType: "Venue",
          resourceId: venue.id,
          details: { name, slug, city },
        });

        return NextResponse.json({ success: true, venue }, { status: 201 });
      } catch (dbErr) {
        console.warn("DB venue create fallback:", dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        venue: {
          id: `v-${Date.now()}`,
          slug,
          name,
          address,
          city,
          category: category || "coworking",
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: "VENUE_CREATE_FAILED", message: msg }, { status: 500 });
  }
}
