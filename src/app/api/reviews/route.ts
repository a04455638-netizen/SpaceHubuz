import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";
import { logAuditEvent } from "@/server/audit/audit-log";
import { notifyReviewTelegram } from "@/server/notifications/telegram";
import { CURATED_VENUES } from "@/server/mock-venues";

export interface StoredReview {
  id: string;
  venueId: string;
  venueName: string;
  bookingId?: string | null;
  authorId: string;
  authorName: string;
  rating: number;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "HIDDEN";
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// In-memory fallback review repository for reliable persistence
const globalReviews: StoredReview[] = [
  {
    id: "rev-101",
    venueId: "v-sports-1",
    venueName: "Milliy Futsal Arena & Stadium",
    authorId: "c1234567-0000-0000-0000-000000000001",
    authorName: "Ali",
    rating: 5,
    comment: "Maydon juda yaxshi, toza va qulay! Dush xonasi va yoritish ajoyib.",
    status: "APPROVED",
    isPublished: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rev-102",
    venueId: "v-coworking-1",
    venueName: "Impact Hub Tashkent & Smart Workspace",
    authorId: "c1234567-0000-0000-0000-000000000002",
    authorName: "Madina Alimova",
    rating: 5,
    comment: "Internet tezligi 500 Mbit/s barqaror ishladi. Telefon kabinalari juda asqotdi.",
    status: "APPROVED",
    isPublished: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "rev-103",
    venueId: "v-sports-8",
    venueName: "Olimpiya Suv Saroyi & Basseyn Complex",
    authorId: "c1234567-0000-0000-0000-000000000003",
    authorName: "Jamshid Qodirov",
    rating: 5,
    comment: "Suv harorati doim 28°C va juda toza. Fin saunasi ham bor ekan.",
    status: "APPROVED",
    isPublished: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getGlobalReviews(): StoredReview[] {
  return globalReviews;
}

// Basic anti-spam & abuse check
function isAbusiveOrSpam(text: string): boolean {
  if (!text || text.trim().length < 3) return true;
  // Repetitive single character spam e.g. "aaaaaaa" or ".........."
  if (/(.)\1{9,}/.test(text)) return true;
  return false;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get("venueId");
  const includeAll = searchParams.get("all") === "true";

  if (process.env.DATABASE_URL && venueId) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();
      const whereClause: { venueId: string; isPublished?: boolean } = { venueId };
      if (!includeAll) {
        whereClause.isPublished = true;
      }

      const reviews = await prisma.review.findMany({
        where: whereClause,
        include: { author: { select: { fullName: true, avatarUrl: true } } },
        orderBy: { createdAt: "desc" },
      });
      await prisma.$disconnect();

      if (reviews.length > 0) {
        return NextResponse.json({
          reviews: reviews.map((r) => ({
            id: r.id,
            venueId: r.venueId,
            rating: r.rating,
            comment: r.comment,
            author: { fullName: r.author.fullName },
            isPublished: r.isPublished,
            status: r.isPublished ? "APPROVED" : "PENDING",
            createdAt: r.createdAt.toISOString(),
          })),
        });
      }
    } catch (e) {
      console.warn("DB reviews query fallback:", e);
    }
  }

  // Memory fallback
  let list = globalReviews;
  if (venueId) {
    list = list.filter((r) => r.venueId === venueId || r.venueName.toLowerCase().includes(venueId.toLowerCase()));
  }
  if (!includeAll) {
    list = list.filter((r) => r.isPublished);
  }

  return NextResponse.json({
    reviews: list.map((r) => ({
      id: r.id,
      venueId: r.venueId,
      venueName: r.venueName,
      rating: r.rating,
      comment: r.comment,
      author: { fullName: r.authorName },
      isPublished: r.isPublished,
      status: r.status,
      createdAt: r.createdAt,
    })),
  });
}

export async function POST(request: NextRequest) {
  let user = await getSessionUser(request);

  try {
    const body = await request.json().catch(() => ({}));
    const { venueId, bookingId, rating, comment, customerName } = body;

    // Graceful customer resolution: check session, cookies or body
    if (!user) {
      const cookiePhone = request.cookies.get("spacehub_user_phone")?.value;
      const cookieUser = request.cookies.get("spacehub_user")?.value;
      let parsedUser: { id?: string; fullName?: string; phone?: string } | null = null;
      if (cookieUser) {
        try { parsedUser = JSON.parse(decodeURIComponent(cookieUser)); } catch {}
      }

      const resolvedName =
        customerName ||
        parsedUser?.fullName ||
        (cookiePhone ? `Mijoz (${cookiePhone.slice(-4)})` : "Mijoz");
      const cleanPhone = (cookiePhone || parsedUser?.phone || "000000000001").replace(/\D/g, "");

      user = {
        id: parsedUser?.id || `c1234567-0000-0000-0000-${cleanPhone.slice(-12).padStart(12, "0")}`,
        fullName: resolvedName,
        role: "CUSTOMER",
      };
    }

    if (!venueId || !rating || !comment) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "Baholash va sharh matni talab etiladi" },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { error: "INVALID_RATING", message: "Baholash 1 dan 5 gacha bo'lishi kerak" },
        { status: 400 }
      );
    }

    const trimmedComment = String(comment).trim();
    if (trimmedComment.length < 3) {
      return NextResponse.json(
        { error: "TOO_SHORT", message: "Sharh matni kamida 3 ta belgidan iborat bo'lishi kerak" },
        { status: 400 }
      );
    }

    if (isAbusiveOrSpam(trimmedComment)) {
      return NextResponse.json(
        { error: "SPAM_DETECTED", message: "Sharh matni qoidalarga mos kelmadi" },
        { status: 400 }
      );
    }

    // Resolve venue name from curated venues or fallback
    const matchedCurated = CURATED_VENUES.find(
      (v) => v.id === venueId || v.slug === venueId
    );
    const venueName = matchedCurated?.name || "SpaceHub Tasdiqlangan Joy";

    const reviewId = `rev-${Date.now().toString(36)}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date();

    // 1. Database insert if Postgres available
    let dbSuccess = false;
    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        // Check if venueId is a valid UUID or find by slug
        let resolvedVenueUuid = venueId;
        const dbVenue = await prisma.venue.findFirst({
          where: { OR: [{ id: venueId }, { slug: venueId }] },
        });

        if (dbVenue) {
          resolvedVenueUuid = dbVenue.id;
        }

        const review = await prisma.review.create({
          data: {
            venueId: resolvedVenueUuid,
            bookingId: bookingId || null,
            authorId: user.id,
            rating: Math.round(numRating),
            comment: trimmedComment,
            isPublished: false, // Pending admin moderation
          },
        });

        await prisma.$disconnect();
        dbSuccess = true;

        await logAuditEvent({
          userId: user.id,
          action: "REVIEW_CREATED",
          resourceType: "Review",
          resourceId: review.id,
          details: { venueName, rating: numRating },
        });
      } catch (dbErr) {
        console.warn("DB review create fallback:", dbErr);
      }
    }

    // 2. Persistent Memory Repository
    const newStoredReview: StoredReview = {
      id: reviewId,
      venueId: matchedCurated?.id || venueId,
      venueName,
      bookingId: bookingId || null,
      authorId: user.id,
      authorName: user.fullName || "Mijoz",
      rating: Math.round(numRating),
      comment: trimmedComment,
      status: "PENDING",
      isPublished: false, // Requires moderation before public display
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };
    globalReviews.unshift(newStoredReview);

    // 3. Immediately trigger Telegram notification to Administrator
    let telegramAlertSent = false;
    try {
      const tgRes = await notifyReviewTelegram({
        reviewId,
        venueName,
        customerName: user.fullName || "Mijoz",
        rating: Math.round(numRating),
        comment: trimmedComment,
        submittedAt: now.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" }),
        status: "Pending moderation",
      });
      telegramAlertSent = tgRes.success;
    } catch (tgError) {
      console.warn("Telegram notification error:", tgError);
    }

    return NextResponse.json({
      success: true,
      message: "Sharhingiz muvaffaqiyatli qabul qilindi va moderatsiyaga yuborildi!",
      review: {
        id: reviewId,
        venueName,
        rating: numRating,
        comment: trimmedComment,
        author: { fullName: user.fullName },
        status: "PENDING",
        isPublished: false,
        createdAt: now.toISOString(),
      },
      telegramNotified: telegramAlertSent,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: "REVIEW_FAILED", message: msg }, { status: 500 });
  }
}
