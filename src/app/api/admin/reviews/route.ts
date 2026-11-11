import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/guards";
import { logAuditEvent } from "@/server/audit/audit-log";
import { getGlobalReviews, type StoredReview } from "@/app/api/reviews/route";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status"); // ALL, PENDING, APPROVED, REJECTED, HIDDEN
  const venueFilter = searchParams.get("venue");
  const searchQuery = searchParams.get("q")?.toLowerCase().trim();
  const sortBy = searchParams.get("sort"); // rating_desc, rating_asc, date_desc

  let reviews: StoredReview[] = [...getGlobalReviews()];

  // Calculate statistics across all reviews
  const totalReviews = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === "PENDING").length;
  const approvedCount = reviews.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = reviews.filter((r) => r.status === "REJECTED" || r.status === "HIDDEN").length;
  const sumRating = reviews.reduce((acc, r) => acc + r.rating, 0);
  const averageRating = totalReviews > 0 ? (sumRating / totalReviews).toFixed(1) : "5.0";

  // Filtering
  if (statusFilter && statusFilter !== "ALL") {
    reviews = reviews.filter((r) => r.status === statusFilter);
  }
  if (venueFilter && venueFilter !== "ALL") {
    reviews = reviews.filter(
      (r) =>
        r.venueId === venueFilter ||
        r.venueName.toLowerCase().includes(venueFilter.toLowerCase())
    );
  }
  if (searchQuery) {
    reviews = reviews.filter(
      (r) =>
        r.authorName.toLowerCase().includes(searchQuery) ||
        r.comment.toLowerCase().includes(searchQuery) ||
        r.venueName.toLowerCase().includes(searchQuery)
    );
  }

  // Sorting
  if (sortBy === "rating_desc") {
    reviews.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === "rating_asc") {
    reviews.sort((a, b) => a.rating - b.rating);
  } else {
    // Default newest first
    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return NextResponse.json({
    reviews,
    stats: {
      totalReviews,
      pendingCount,
      approvedCount,
      rejectedCount,
      averageRating,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const guard = await requireAdmin(request);
  if ("response" in guard) return guard.response;
  const user = guard.user;

  try {
    const { reviewId, action, reason } = await request.json();

    if (!reviewId || !action) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "reviewId va amal (action) talab etiladi" },
        { status: 400 }
      );
    }

    const reviews = getGlobalReviews();
    const review = reviews.find((r) => r.id === reviewId);

    if (!review) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Sharh topilmadi" },
        { status: 404 }
      );
    }

    const now = new Date();

    if (action === "APPROVE") {
      review.status = "APPROVED";
      review.isPublished = true;
    } else if (action === "REJECT") {
      review.status = "REJECTED";
      review.isPublished = false;
    } else if (action === "HIDE") {
      review.status = "HIDDEN";
      review.isPublished = false;
    }
    review.updatedAt = now.toISOString();

    // If DB is configured, sync to Postgres
    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();
        await prisma.review.updateMany({
          where: { id: reviewId },
          data: {
            isPublished: action === "APPROVE",
          },
        });
        await prisma.$disconnect();
      } catch (e) {
        console.warn("DB review update fallback:", e);
      }
    }

    await logAuditEvent({
      userId: user.id,
      action: `REVIEW_MODERATION_${action}`,
      resourceType: "Review",
      resourceId: reviewId,
      details: { action, reason, venueName: review.venueName },
    });

    return NextResponse.json({
      success: true,
      message: `Sharh holati yangilandi: ${review.status}`,
      review,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: "MODERATION_FAILED", message: msg }, { status: 500 });
  }
}
