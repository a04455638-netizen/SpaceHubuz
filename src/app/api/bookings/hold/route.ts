import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";
import { createBookingHold } from "@/server/booking/hold-service";

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json(
      {
        error: "UNAUTHORIZED",
        message: "Bron qilish uchun tizimga kirish talab etiladi (Sign in required to book)",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
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
