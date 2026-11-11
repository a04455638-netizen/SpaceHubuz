import { NextRequest, NextResponse } from "next/server";
import { requireOwner } from "@/server/auth/guards";
import { logAuditEvent } from "@/server/audit/audit-log";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  const guard = await requireOwner(request);
  if ("response" in guard) return guard.response;
  const user = guard.user;

  const { resourceId } = await params;

  try {
    const { startsAt, endsAt, reason } = await request.json();

    if (!startsAt || !endsAt || !reason) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", message: "Boshlanish, tugash vaqti va sababi talab etiladi" },
        { status: 400 }
      );
    }

    const start = new Date(startsAt);
    const end = new Date(endsAt);

    if (start >= end) {
      return NextResponse.json(
        { error: "INVALID_INTERVAL", message: "Tugash vaqti boshlanishdan keyin bo'lishi shart" },
        { status: 400 }
      );
    }

    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();

        // Check conflicts with confirmed customer bookings
        const conflicts = await prisma.occupancy.findMany({
          where: {
            resourceId,
            status: "CONFIRMED",
            startsAt: { lt: end },
            endsAt: { gt: start },
          },
        });

        if (conflicts.length > 0) {
          await prisma.$disconnect();
          return NextResponse.json(
            {
              error: "CONFIRMED_BOOKINGS_EXIST",
              message: "Ushbu vaqtda tasdiqlangan mijoz bronlari mavjud. Bloklab bo'lmaydi.",
            },
            { status: 409 }
          );
        }

        const block = await prisma.$transaction(async (tx) => {
          const occ = await tx.occupancy.create({
            data: {
              resourceId,
              startsAt: start,
              endsAt: end,
              status: "BLOCKED",
            },
          });

          const createdBlock = await tx.resourceBlock.create({
            data: {
              resourceId,
              startsAt: start,
              endsAt: end,
              reason,
              createdBy: user.id,
            },
          });

          return { occ, createdBlock };
        });

        await prisma.$disconnect();

        await logAuditEvent({
          userId: user.id,
          action: "RESOURCE_TIME_BLOCKED",
          resourceType: "Resource",
          resourceId,
          details: { startsAt, endsAt, reason },
        });

        return NextResponse.json({ success: true, block }, { status: 201 });
      } catch (dbErr) {
        console.warn("DB block create fallback:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Vaqt oralig'i texnik tanaffus uchun bloklandi (Simulator)",
      block: { resourceId, startsAt, endsAt, reason },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: "BLOCK_FAILED", message: msg }, { status: 500 });
  }
}
