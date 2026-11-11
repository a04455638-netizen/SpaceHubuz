import { occupiesInventory, canTransition, type BookingStatusType } from "../../booking/state-machine.ts";
import { logAuditEvent } from "../audit/audit-log.ts";

export interface CreateHoldParams {
  resourceId: string;
  startsAt: string; // ISO string
  endsAt: string;   // ISO string
  customerId: string;
  guestCount?: number;
  specialRequests?: string;
}

export interface BookingHoldResult {
  success: boolean;
  bookingId?: string;
  bookingNumber?: string;
  expiresAt?: string;
  totalAmount?: number;
  error?: string;
  message?: string;
  suggestedSlots?: Array<{ startsAt: string; endsAt: string }>;
}

export interface ConfirmBookingParams {
  bookingId: string;
  customerId: string;
  provider: "CLICK" | "PAYME" | "CASH_AT_VENUE";
  idempotencyKey?: string;
  providerTransactionId?: string;
}

// In-memory fallback repository for offline/sandbox operation
interface SandboxBooking {
  id: string;
  bookingNumber: string;
  resourceId: string;
  customerId: string;
  status: "PENDING_PAYMENT" | "CONFIRMED" | "CANCELLED_CUSTOMER" | "EXPIRED";
  startsAt: string;
  endsAt: string;
  durationHours: number;
  totalAmount: number;
  guestCount: number;
  specialRequests?: string;
  expiresAt: string;
  qrCodeToken: string;
  createdAt: string;
}

const sandboxBookings = new Map<string, SandboxBooking>();

export async function createBookingHold(params: CreateHoldParams): Promise<BookingHoldResult> {
  const start = new Date(params.startsAt);
  const end = new Date(params.endsAt);
  const now = new Date();

  // 1. Validation checks
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { success: false, error: "INVALID_DATES", message: "Boshlanish yoki tugash vaqti noto'g'ri" };
  }

  if (start >= end) {
    return { success: false, error: "INVALID_INTERVAL", message: "Tugash vaqti boshlanish vaqtidan keyin bo'lishi shart" };
  }

  if (start < new Date(now.getTime() - 60 * 1000)) {
    return { success: false, error: "PAST_DATE", message: "O'tib ketgan vaqtga bron qilib bo'lmaydi" };
  }

  const durationHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  if (durationHours > 24) {
    return { success: false, error: "EXCESSIVE_DURATION", message: "Bitta bron davomiyligi 24 soatdan oshmasligi kerak" };
  }

  const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15-minute hold
  const pricePerHour = 100000; // Base UZS rate
  const totalAmount = Math.round(durationHours * pricePerHour);
  const bookingNumber = `SH-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const qrCodeToken = `qr-${crypto.randomUUID()}`;

  // 2. Database path with PostgreSQL GiST exclusion constraint
  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const result = await prisma.$transaction(async (tx) => {
        // Check resource existence and price
        const resource = await tx.resource.findUnique({
          where: { id: params.resourceId },
        });

        const rate = resource?.pricePerHour || pricePerHour;
        const calculatedTotal = Math.round(durationHours * rate);

        // Check active overlapping occupancies
        const conflicts = await tx.occupancy.findMany({
          where: {
            resourceId: params.resourceId,
            status: { not: "RELEASED" },
            startsAt: { lt: end },
            endsAt: { gt: start },
          },
        });

        const activeConflicts = conflicts.filter((c) => {
          if (c.status === "HELD" && c.expiresAt && c.expiresAt < now) {
            return false; // Expired hold
          }
          return occupiesInventory(c.status as unknown as BookingStatusType);
        });

        if (activeConflicts.length > 0) {
          // Provide alternative slot 1 hour after the conflicting slot
          const nextStart = new Date(end.getTime() + 60 * 60 * 1000);
          const nextEnd = new Date(nextStart.getTime() + durationHours * 60 * 60 * 1000);

          return {
            conflict: true,
            suggestedSlots: [
              { startsAt: nextStart.toISOString(), endsAt: nextEnd.toISOString() },
            ],
          };
        }

        // Create occupancy record (enforced by DB GiST constraint)
        const occupancy = await tx.occupancy.create({
          data: {
            resourceId: params.resourceId,
            startsAt: start,
            endsAt: end,
            status: "HELD",
            expiresAt,
          },
        });

        // Create booking record
        const booking = await tx.booking.create({
          data: {
            bookingNumber,
            customerId: params.customerId,
            resourceId: params.resourceId,
            occupancyId: occupancy.id,
            status: "PENDING_PAYMENT",
            startsAt: start,
            endsAt: end,
            durationHours,
            totalAmount: calculatedTotal,
            guestCount: params.guestCount || 1,
            specialRequests: params.specialRequests || null,
            qrCodeToken,
          },
        });

        await tx.bookingEvent.create({
          data: {
            bookingId: booking.id,
            status: "PENDING_PAYMENT",
            reason: "Hold created with 15-minute lock",
            actorId: params.customerId,
          },
        });

        return { conflict: false, booking, occupancy };
      });

      await prisma.$disconnect();

      if (result.conflict) {
        return {
          success: false,
          error: "SLOT_OCCUPIED",
          message: "Tanlangan vaqt oralig'i allaqachon band qilingan",
          suggestedSlots: result.suggestedSlots,
        };
      }

      await logAuditEvent({
        userId: params.customerId,
        action: "BOOKING_HOLD_CREATED",
        resourceType: "Booking",
        resourceId: result.booking?.id,
        details: { startsAt: params.startsAt, endsAt: params.endsAt, totalAmount },
      });

      return {
        success: true,
        bookingId: result.booking?.id,
        bookingNumber,
        expiresAt: expiresAt.toISOString(),
        totalAmount,
      };
    } catch (dbErr: unknown) {
      const errMsg = dbErr instanceof Error ? dbErr.message : "Database error";
      console.warn("DB hold transaction fallback:", errMsg);
    }
  }

  // 3. Sandbox memory fallback
  // Check overlapping sandbox bookings
  for (const existing of sandboxBookings.values()) {
    if (
      existing.resourceId === params.resourceId &&
      existing.status !== "CANCELLED_CUSTOMER" &&
      existing.status !== "EXPIRED"
    ) {
      const exStart = new Date(existing.startsAt);
      const exEnd = new Date(existing.endsAt);
      const exExpires = new Date(existing.expiresAt);

      if (existing.status === "PENDING_PAYMENT" && exExpires < now) {
        existing.status = "EXPIRED";
        continue;
      }

      // Check interval overlap: max(start, exStart) < min(end, exEnd)
      if (start < exEnd && end > exStart) {
        const nextStart = new Date(end.getTime() + 60 * 60 * 1000);
        const nextEnd = new Date(nextStart.getTime() + durationHours * 60 * 60 * 1000);
        return {
          success: false,
          error: "SLOT_OCCUPIED",
          message: "Tanlangan vaqt oralig'i allaqachon band qilingan",
          suggestedSlots: [
            { startsAt: nextStart.toISOString(), endsAt: nextEnd.toISOString() },
          ],
        };
      }
    }
  }

  const sandboxId = `sbk-${crypto.randomUUID()}`;
  sandboxBookings.set(sandboxId, {
    id: sandboxId,
    bookingNumber,
    resourceId: params.resourceId,
    customerId: params.customerId,
    status: "PENDING_PAYMENT",
    startsAt: params.startsAt,
    endsAt: params.endsAt,
    durationHours,
    totalAmount,
    guestCount: params.guestCount || 1,
    specialRequests: params.specialRequests,
    expiresAt: expiresAt.toISOString(),
    qrCodeToken,
    createdAt: now.toISOString(),
  });

  return {
    success: true,
    bookingId: sandboxId,
    bookingNumber,
    expiresAt: expiresAt.toISOString(),
    totalAmount,
  };
}

export async function confirmBooking(params: ConfirmBookingParams): Promise<{ success: boolean; error?: string; message?: string }> {
  const now = new Date();

  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const booking = await prisma.booking.findUnique({
        where: { id: params.bookingId },
        include: { occupancy: true },
      });

      if (!booking) {
        await prisma.$disconnect();
        return { success: false, error: "NOT_FOUND", message: "Bron topilmadi" };
      }

      if (!canTransition(booking.status as unknown as BookingStatusType, "CONFIRMED")) {
        await prisma.$disconnect();
        return { success: false, error: "INVALID_TRANSITION", message: `Bron holati o'zgartirilmadi: ${booking.status}` };
      }

      // Check hold expiration
      if (booking.occupancy?.expiresAt && booking.occupancy.expiresAt < now) {
        await prisma.$disconnect();
        return { success: false, error: "HOLD_EXPIRED", message: "Bron qilish muddati o'tib ketgan. Qaytadan tanlang." };
      }

      await prisma.$transaction(async (tx) => {
        await tx.booking.update({
          where: { id: params.bookingId },
          data: { status: "CONFIRMED" },
        });

        if (booking.occupancyId) {
          await tx.occupancy.update({
            where: { id: booking.occupancyId },
            data: { status: "CONFIRMED", expiresAt: null },
          });
        }

        await tx.payment.create({
          data: {
            bookingId: params.bookingId,
            provider: params.provider,
            providerTransactionId: params.providerTransactionId || `tx-${Date.now()}`,
            status: "COMPLETED",
            amount: booking.totalAmount,
            currency: "UZS",
            idempotencyKey: params.idempotencyKey || `idem-${Date.now()}`,
            paidAt: now,
          },
        });

        await tx.bookingEvent.create({
          data: {
            bookingId: params.bookingId,
            status: "CONFIRMED",
            reason: `Payment confirmed via ${params.provider}`,
            actorId: params.customerId,
          },
        });
      });

      await prisma.$disconnect();

      await logAuditEvent({
        userId: params.customerId,
        action: "BOOKING_CONFIRMED",
        resourceType: "Booking",
        resourceId: params.bookingId,
        details: { provider: params.provider, amount: booking.totalAmount },
      });

      return { success: true, message: "Bron muvaffaqiyatli tasdiqlandi!" };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error";
      console.warn("DB confirm fallback:", msg);
    }
  }

  // Sandbox fallback
  const sb = sandboxBookings.get(params.bookingId);
  if (!sb) {
    return { success: false, error: "NOT_FOUND", message: "Bron topilmadi" };
  }

  if (new Date(sb.expiresAt) < now && sb.status === "PENDING_PAYMENT") {
    sb.status = "EXPIRED";
    return { success: false, error: "HOLD_EXPIRED", message: "Bron qilish muddati o'tib ketgan." };
  }

  sb.status = "CONFIRMED";
  return { success: true, message: "Bron muvaffaqiyatli tasdiqlandi!" };
}

export async function cancelBooking(bookingId: string, actorId: string, reason?: string): Promise<{ success: boolean; message: string }> {
  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (booking) {
        await prisma.$transaction(async (tx) => {
          await tx.booking.update({
            where: { id: bookingId },
            data: { status: "CANCELLED_CUSTOMER" },
          });

          if (booking.occupancyId) {
            await tx.occupancy.update({
              where: { id: booking.occupancyId },
              data: { status: "RELEASED" },
            });
          }

          await tx.bookingEvent.create({
            data: {
              bookingId,
              status: "CANCELLED_CUSTOMER",
              reason: reason || "Customer cancelled",
              actorId,
            },
          });
        });
      }

      await prisma.$disconnect();
    } catch (e) {
      console.warn("Cancel DB fallback:", e);
    }
  }

  const sb = sandboxBookings.get(bookingId);
  if (sb) {
    sb.status = "CANCELLED_CUSTOMER";
  }

  await logAuditEvent({
    userId: actorId,
    action: "BOOKING_CANCELLED",
    resourceType: "Booking",
    resourceId: bookingId,
    details: { reason },
  });

  return { success: true, message: "Bron bekor qilindi va joy bo'shatildi" };
}

export async function cleanupExpiredHolds(): Promise<{ releasedCount: number }> {
  const now = new Date();
  let count = 0;

  if (process.env.DATABASE_URL) {
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const expiredOccupancies = await prisma.occupancy.findMany({
        where: {
          status: "HELD",
          expiresAt: { lt: now },
        },
      });

      for (const occ of expiredOccupancies) {
        await prisma.occupancy.update({
          where: { id: occ.id },
          data: { status: "RELEASED" },
        });

        await prisma.booking.updateMany({
          where: { occupancyId: occ.id, status: "PENDING_PAYMENT" },
          data: { status: "EXPIRED" },
        });

        count++;
      }

      await prisma.$disconnect();
    } catch (e) {
      console.warn("Cleanup DB fallback:", e);
    }
  }

  for (const b of sandboxBookings.values()) {
    if (b.status === "PENDING_PAYMENT" && new Date(b.expiresAt) < now) {
      b.status = "EXPIRED";
      count++;
    }
  }

  return { releasedCount: count };
}

export function getSandboxBooking(id: string): SandboxBooking | undefined {
  return sandboxBookings.get(id);
}
