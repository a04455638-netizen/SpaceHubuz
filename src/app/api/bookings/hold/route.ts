import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";
import { createBookingHold } from "@/server/booking/hold-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let user = await getSessionUser(request);

    // Fallback: Support booking with customer phone/name from client profile or body
    const customerPhone = body.customerPhone || body.phone;
    const customerName = body.customerName || body.name || body.fullName || "Mijoz";

    if (!user && customerPhone) {
      const cleanPhone = String(customerPhone).replace(/\D/g, "");
      user = {
        id: "c1234567-0000-0000-0000-" + cleanPhone.slice(-12).padStart(12, "0"),
        phone: customerPhone,
        fullName: customerName,
        role: "CUSTOMER",
      };
    }

    if (!user) {
      return NextResponse.json(
        {
          error: "UNAUTHORIZED",
          message: "Bron qilish uchun tizimga kirish yoki telefon raqamingizni kiritish talab etiladi",
        },
        { status: 401 }
      );
    }

    const { resourceId, startsAt, endsAt, guestCount, specialRequests } = body;

    if (!resourceId || !startsAt || !endsAt) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "Joy, boshlanish va tugash vaqti talab etiladi" },
        { status: 400 }
      );
    }

    const result = await createBookingHold({
      resourceId,
      startsAt,
      endsAt,
      customerId: user.id,
      guestCount: Number(guestCount) || 1,
      specialRequests,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || "HOLD_FAILED",
          message: result.message,
          suggestedSlots: result.suggestedSlots,
        },
        { status: result.error === "SLOT_OCCUPIED" ? 409 : 400 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: "SERVER_ERROR", message: errMsg }, { status: 500 });
  }
}
