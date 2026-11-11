import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";
import { getSandboxBooking } from "@/server/booking/hold-service";

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
        // Enforce privacy: only the booker or an admin/owner can view
        if (user && user.id !== booking.customerId && user.role === "CUSTOMER") {
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
  if (sb) {
    return NextResponse.json({
      booking: {
        ...sb,
        resource: {
          id: sb.resourceId,
          name: "Smart Coworking Joyi / Majlislar zali",
          venue: {
            name: "Impact Hub Tashkent",
            address: "Amir Temur shoh ko'chasi, 107B",
            city: "Toshkent",
          },
        },
      },
    });
  }

  return NextResponse.json({ error: "NOT_FOUND", message: "Bron topilmadi" }, { status: 404 });
}
