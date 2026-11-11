import { NextRequest, NextResponse } from "next/server";
import { findPublicVenues } from "@/server/public-venues";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";

    const venues = await findPublicVenues(q, category);

    return NextResponse.json({
      success: true,
      count: venues.length,
      venues,
    });
  } catch (err: unknown) {
    console.error("GET /api/venues error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch venue listings",
      },
      { status: 500 }
    );
  }
}
