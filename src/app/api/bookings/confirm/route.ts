import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";
import { confirmBooking } from "@/server/booking/hold-service";

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Tizimga kirish talab etiladi" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { bookingId, provider, idempotencyKey } = body;

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
