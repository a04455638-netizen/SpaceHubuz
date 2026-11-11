import { NextResponse } from "next/server";
import { cleanupExpiredHolds } from "@/server/booking/hold-service";

export async function POST() {
  try {
    const result = await cleanupExpiredHolds();
    return NextResponse.json({
      success: true,
      releasedCount: result.releasedCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error";
    return NextResponse.json({ error: "CLEANUP_FAILED", message: msg }, { status: 500 });
  }
}
