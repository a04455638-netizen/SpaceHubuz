import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";
import { confirmBooking } from "@/server/booking/hold-service";

export async function POST(request: NextRequest) {
  let user = await getSessionUser(request);

  try {
    const body = await request.json().catch(() => ({}));
    const { bookingId, provider, idempotencyKey, customerPhone, customerName } = body;

    if (!user) {
      // Fallback: check cookie spacehub_user_phone, spacehub_user, or body customerPhone
      const cookiePhone = request.cookies.get("spacehub_user_phone")?.value;
      const cookieUser = request.cookies.get("spacehub_user")?.value;
      let parsedUser: { id?: string; phone?: string; fullName?: string } | null = null;
      if (cookieUser) {
        try {
          parsedUser = JSON.parse(decodeURIComponent(cookieUser));
        } catch {
          // ignore
        }
      }

      const resolvedPhone =
        customerPhone || cookiePhone || parsedUser?.phone || "+998 90 123 45 67";
      const resolvedName =
        customerName || parsedUser?.fullName || "SpaceHub Foydalanuvchi";
      const cleanDigits = resolvedPhone.replace(/\D/g, "").slice(-12).padStart(12, "0");

      user = {
        id: parsedUser?.id || `c1234567-0000-0000-0000-${cleanDigits || "000000000001"}`,
        phone: resolvedPhone,
        fullName: resolvedName,
        role: "CUSTOMER",
      };
    }

    if (!bookingId || !provider) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "bookingId va to'lov usuli talab etiladi" },
        { status: 400 }
      );
    }

    const result = await confirmBooking({
      bookingId,
      customerId: user.id,
      provider: provider as "CLICK" | "PAYME" | "CASH_AT_VENUE",
      idempotencyKey,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "CONFIRM_FAILED", message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: "SERVER_ERROR", message: errMsg }, { status: 500 });
  }
}
