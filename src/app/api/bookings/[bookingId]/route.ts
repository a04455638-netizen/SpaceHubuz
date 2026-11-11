import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";
import { getSandboxBooking } from "@/server/booking/hold-service";
import { CURATED_VENUES } from "@/server/mock-venues";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params;
  const user = await getSessionUser(request);

  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          resource: {
            include: { venue: true },
          },
          payments: true,
          events: true,
        },
      });

      await prisma.$disconnect();

      if (booking) {
        // Allow viewing pending bookings during checkout; enforce privacy for finalized bookings
        if (
          booking.status !== "PENDING_PAYMENT" &&
          user &&
          user.id !== booking.customerId &&
          user.role === "CUSTOMER"
        ) {
          return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
        }

        return NextResponse.json({ booking });
      }
    } catch (e) {
      console.warn("DB booking fetch fallback:", e);
    }
  }

  // Sandbox fallback
  const sb = getSandboxBooking(bookingId);

  // Look up matching venue from CURATED_VENUES
  let venueName = "SpaceHub Tasdiqlangan Joy";
  let resourceName = "Asosiy zal / Maydon";
  let address = "Amir Temur shoh ko'chasi, Toshkent";
  let city = "Toshkent";

  const resId = sb?.resourceId || bookingId;
  for (const v of CURATED_VENUES) {
    const r = v.resources.find((item) => item.id === resId);
    if (r) {
      venueName = v.name;
      resourceName = r.name;
      address = v.address;
      city = v.city;
      break;
    }
    if (v.id === resId || v.slug === resId) {
      venueName = v.name;
      resourceName = v.name;
      address = v.address;
      city = v.city;
      break;
    }
  }

  const resolvedBooking = {
    id: bookingId,
    bookingNumber: sb?.bookingNumber || `SH-${bookingId.slice(-8).toUpperCase()}`,
    status: sb?.status || "PENDING_PAYMENT",
    totalAmount: sb?.totalAmount || 100000,
    startsAt: sb?.startsAt || new Date().toISOString(),
    endsAt: sb?.endsAt || new Date(Date.now() + 7200000).toISOString(),
    durationHours: sb?.durationHours || 2,
    expiresAt: sb?.expiresAt || new Date(Date.now() + 900000).toISOString(),
    resource: {
      id: resId,
      name: resourceName,
      venue: {
        name: venueName,
        address,
        city,
      },
    },
  };

  return NextResponse.json({ booking: resolvedBooking });
}
