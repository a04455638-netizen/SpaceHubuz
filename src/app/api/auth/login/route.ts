import { NextRequest, NextResponse } from "next/server";
import { normalizeUzbekPhone } from "@/server/auth/phone-validation";
import { logAuditEvent } from "@/server/audit/audit-log";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = body.phone as string | undefined;
    const fullName = (body.fullName as string | undefined)?.trim() || "Foydalanuvchi";

    if (!phone) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "Telefon raqamini kiriting" },
        { status: 400 }
      );
    }

    const normalized = normalizeUzbekPhone(phone);
    if (!normalized) {
      return NextResponse.json(
        { error: "INVALID_PHONE", message: "Telefon formati noto'g'ri. Masalan: +998 90 123 45 67" },
        { status: 400 }
      );
    }

    let user = {
      id: "c1234567-0000-0000-0000-" + normalized.slice(-12).padStart(12, "0"),
      phone: normalized,
      fullName: fullName,
      role: "CUSTOMER",
      preferredLanguage: "uz",
    };

    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();
        const existing = await prisma.userProfile.findUnique({
          where: { phone: normalized },
        });

        if (existing) {
          user = {
            id: existing.id,
            phone: existing.phone,
            fullName: existing.fullName || fullName,
            role: existing.role,
            preferredLanguage: existing.preferredLanguage,
          };
        } else {
          const created = await prisma.userProfile.create({
            data: {
              phone: normalized,
              fullName: fullName,
              role: "CUSTOMER",
              preferredLanguage: "uz",
            },
          });
          user = {
            id: created.id,
            phone: created.phone,
            fullName: created.fullName,
            role: created.role,
            preferredLanguage: created.preferredLanguage,
          };
        }
        await prisma.$disconnect();
      } catch (dbErr) {
        console.warn("DB login upsert fallback:", dbErr);
      }
    }

    await logAuditEvent({
      userId: user.id,
      action: "AUTH_LOGIN_SUCCESS",
      resourceType: "UserProfile",
      resourceId: user.id,
      details: { phone: normalized, method: "DIRECT_PHONE" },
    });

    const response = NextResponse.json({
      success: true,
      user,
      message: "Muvaffaqiyatli tizimga kirildi",
    });

    // Set cookie for session persistence (1 year)
    response.cookies.set("spacehub_user", JSON.stringify(user), {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 31536000,
    });

    return response;
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: "INTERNAL_ERROR", message: errMsg }, { status: 500 });
  }
}
