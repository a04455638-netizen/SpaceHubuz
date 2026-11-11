import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/guards";
import { logAuditEvent } from "@/server/audit/audit-log";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const venues = await prisma.venue.findMany({
        include: { resources: true, organization: true },
        orderBy: { createdAt: "desc" },
      });

      await prisma.$disconnect();
      return NextResponse.json({ venues });
    } catch (e) {
      console.warn("DB admin moderation query fallback:", e);
    }
  }

  return NextResponse.json({
    venues: [
      {
        id: "v-demo-1",
        name: "Impact Coworking Hub",
        address: "Amir Temur shoh ko'chasi, 107B",
        city: "Toshkent",
        verifiedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      },
    ],
  });
}

export async function POST(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;
  const user = guard.user;

  try {
    const { venueId, action, reason } = await request.json();

    if (!venueId || !action) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "venueId va amal (action) talab etiladi" },
        { status: 400 }
      );
    }

    const now = new Date();

    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        const updated = await prisma.venue.update({
          where: { id: venueId },
          data: action === "APPROVE"
            ? { verifiedAt: now, publishedAt: now }
            : { verifiedAt: null, publishedAt: null },
        });

        await prisma.$disconnect();

        await logAuditEvent({
          userId: user.id,
          action: action === "APPROVE" ? "VENUE_MODERATION_APPROVED" : "VENUE_MODERATION_REJECTED",
          resourceType: "Venue",
          resourceId: venueId,
          details: { action, reason },
        });

        return NextResponse.json({ success: true, venue: updated });
      } catch (dbErr) {
        console.warn("DB moderation update fallback:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Joy moderatsiyadan o'tdi: ${action} (Simulator)`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: "MODERATION_FAILED", message: msg }, { status: 500 });
  }
}
