import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";
import { logAuditEvent } from "@/server/audit/audit-log";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get("venueId");

  if (process.env.DATABASE_URL && venueId) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();
      const reviews = await prisma.review.findMany({
        where: { venueId, isPublished: true },
        include: { author: { select: { fullName: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
      });
      await prisma.$disconnect();
      return NextResponse.json({ reviews });
    } catch (e) {
      console.warn("DB reviews query fallback:", e);
    }
  }

  return NextResponse.json({
    reviews: [
      {
        id: "rev-demo-1",
        rating: 5,
        comment: "Ajoyib sharoitlar va tezkor internet. Tavsiya qilaman!",
        author: { fullName: "Sanjar Rustamov" },
        createdAt: new Date().toISOString(),
      },
    ],
  });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Sharh qoldirish uchun tizimga kiring" },
      { status: 401 }
    );
  }

  try {
    const { venueId, bookingId, rating, comment } = await request.json();

    if (!venueId || !rating || !comment) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "Baholash va sharh matni talab etiladi" },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { error: "INVALID_RATING", message: "Baholash 1 dan 5 gacha bo'lishi kerak" },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        // If bookingId provided, verify booking was for this customer
        if (bookingId) {
          const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
          });

          if (!booking || booking.customerId !== user.id) {
            await prisma.$disconnect();
            return NextResponse.json(
              { error: "UNAUTHORIZED_BOOKING", message: "Faqat o'zingizning haqiqiy broningizga sharh qoldira olasiz" },
              { status: 403 }
            );
          }
        }

        const review = await prisma.review.create({
          data: {
            venueId,
            bookingId: bookingId || null,
            authorId: user.id,
            rating: numRating,
            comment,
            isPublished: true,
          },
        });

        await prisma.$disconnect();

        await logAuditEvent({
          userId: user.id,
          action: "REVIEW_CREATED",
          resourceType: "Review",
          resourceId: review.id,
          details: { venueId, rating: numRating },
        });

        return NextResponse.json({ success: true, review });
      } catch (dbErr) {
        console.warn("DB review create fallback:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sharhingiz qabul qilindi (Simulator)",
      review: {
        id: `rev-${Date.now()}`,
        venueId,
        rating: numRating,
        comment,
        author: { fullName: user.fullName },
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: "REVIEW_FAILED", message: msg }, { status: 500 });
  }
}
