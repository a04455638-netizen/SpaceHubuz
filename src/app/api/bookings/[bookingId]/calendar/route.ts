import { NextRequest } from "next/server";
import { getSandboxBooking } from "@/server/booking/hold-service";

function formatIcsDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  const { bookingId } = await params;

  let title = "SpaceHub UZ — Rezervatsiya";
  let address = "Toshkent shahri";
  let startsAt = new Date().toISOString();
  let endsAt = new Date(Date.now() + 3600000).toISOString();
  let description = "SpaceHub UZ orqali band qilingan joy.";

  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { resource: { include: { venue: true } } },
      });
      await prisma.$disconnect();

      if (booking) {
        title = `${booking.resource.name} (${booking.resource.venue.name})`;
        address = `${booking.resource.venue.address}, ${booking.resource.venue.city}`;
        startsAt = booking.startsAt.toISOString();
        endsAt = booking.endsAt.toISOString();
        description = `Bron raqami: ${booking.bookingNumber}. Summa: ${booking.totalAmount.toLocaleString()} UZS.`;
      }
    } catch (e) {
      console.warn("DB calendar fallback:", e);
    }
  } else {
    const sb = getSandboxBooking(bookingId);
    if (sb) {
      startsAt = sb.startsAt;
      endsAt = sb.endsAt;
      description = `Bron raqami: ${sb.bookingNumber}. Summa: ${sb.totalAmount.toLocaleString()} UZS.`;
    }
  }

  const dtStamp = formatIcsDate(new Date().toISOString());
  const dtStart = formatIcsDate(startsAt);
  const dtEnd = formatIcsDate(endsAt);

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SpaceHub UZ//Booking System//UZ",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:spacehub-${bookingId}@spacehub.uz`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${address}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return new Response(icsLines.join("\r\n"), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="spacehub-${bookingId}.ics"`,
    },
  });
}
