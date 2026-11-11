import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/server/auth/guards";

export async function GET(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Kirish talab etiladi" },
      { status: 401 }
    );
  }

  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const bookings = await prisma.booking.findMany({
        where: { customerId: user.id },
        include: {
          resource: {
            include: { venue: true },
          },
          payments: true,
        },
        orderBy: { startsAt: "desc" },
      });

      await prisma.$disconnect();
      return NextResponse.json({ bookings });
    } catch (e) {
      console.warn("DB customer bookings query fallback:", e);
    }
  }

  // Fallback demo/sandbox bookings for customer view
  return NextResponse.json({
    bookings: [
      {
        id: "sbk-demo-01",
        bookingNumber: "SH-202611-9872",
        status: "CONFIRMED",
        startsAt: new Date(Date.now() + 86400000).toISOString(),
        endsAt: new Date(Date.now() + 93600000).toISOString(),
        durationHours: 2,
        totalAmount: 100000,
        guestCount: 2,
        qrCodeToken: "qr-demo-01",
        resource: {
          name: "Smart Coworking Joyi",
          venue: {
            name: "Impact Hub Tashkent",
            address: "Amir Temur shoh ko'chasi, 107B",
            city: "Toshkent",
          },
        },
      },
    ],
  });
}
