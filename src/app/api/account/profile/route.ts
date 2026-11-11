import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";
import { logAuditEvent } from "@/server/audit/audit-log";

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Kirish talab etiladi" },
      { status: 401 }
    );
  }

  // If DB available, query fresh userProfile
  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();
      const profile = await prisma.userProfile.findUnique({
        where: { id: user.id },
        include: {
          _count: {
            select: {
              bookings: true,
              reviews: true,
              favorites: true,
            },
          },
        },
      });
      await prisma.$disconnect();

      if (profile) {
        return NextResponse.json({
          profile: {
            id: profile.id,
            fullName: profile.fullName,
            phone: profile.phone,
            email: profile.email || "",
            role: profile.role,
            avatarUrl: profile.avatarUrl,
            preferredLanguage: profile.preferredLanguage,
            stats: profile._count,
          },
        });
      }
    } catch (e) {
      console.warn("DB profile lookup fallback:", e);
    }
  }

  // Fallback memory profile
  return NextResponse.json({
    profile: {
      id: user.id,
      fullName: user.fullName,
      phone: user.phone || "+998901234567",
      email: user.email || "",
      role: user.role,
      avatarUrl: null,
      preferredLanguage: "uz",
      stats: { bookings: 0, reviews: 0, favorites: 0 },
    },
  });
}

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Kirish talab etiladi" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { fullName, email, preferredLanguage } = body;

    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();
        const updated = await prisma.userProfile.update({
          where: { id: user.id },
          data: {
            ...(fullName && { fullName }),
            ...(email !== undefined && { email }),
            ...(preferredLanguage && { preferredLanguage }),
          },
        });
        await prisma.$disconnect();

        await logAuditEvent({
          userId: user.id,
          action: "PROFILE_UPDATE",
          resourceType: "UserProfile",
          resourceId: user.id,
          details: { fullName, email, preferredLanguage },
        });

        return NextResponse.json({
          success: true,
          profile: updated,
        });
      } catch (e) {
        console.warn("DB profile update fallback:", e);
      }
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        fullName: fullName || user.fullName,
        phone: user.phone || "+998901234567",
        email: email ?? user.email ?? "",
        preferredLanguage: preferredLanguage || "uz",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: "UPDATE_FAILED", message }, { status: 500 });
  }
}
