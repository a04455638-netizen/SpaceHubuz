import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";
import { cancelBooking } from "@/server/booking/hold-service";

export async function POST(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Tizimga kirish talab etiladi" },
      { status: 401 }
    );
  }

  try {
    const { bookingId, reason } = await request.json();
    if (!bookingId) {
      return NextResponse.json({ error: "bookingId is required" }, { status: 400 });
    }

    const result = await cancelBooking(bookingId, user.id, reason);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: "CANCEL_FAILED", message: msg }, { status: 500 });
  }
}
