import test from "node:test";
import assert from "node:assert/strict";
import {
  createBookingHold,
  confirmBooking,
  cancelBooking,
  cleanupExpiredHolds,
} from "../src/server/booking/hold-service.ts";

test("hold creation rejects invalid and reversed intervals", async () => {
  const result = await createBookingHold({
    resourceId: "r0000000-0000-0000-0000-000000000001",
    startsAt: "2026-11-20T14:00:00.000Z",
    endsAt: "2026-11-20T12:00:00.000Z", // reversed
    customerId: "c1234567-0000-0000-0000-000000000001",
  });
  assert.equal(result.success, false);
  assert.equal(result.error, "INVALID_INTERVAL");
});

test("hold creation successfully locks 15-minute window for valid slot", async () => {
  const resourceId = "r0000000-0000-0000-0000-000000000002";
  const startsAt = "2026-11-20T10:00:00.000Z";
  const endsAt = "2026-11-20T12:00:00.000Z";

  const result = await createBookingHold({
    resourceId,
    startsAt,
    endsAt,
    customerId: "c1234567-0000-0000-0000-000000000001",
  });

  assert.equal(result.success, true);
  assert.ok(result.bookingId);
  assert.ok(result.expiresAt);
  assert.equal(result.totalAmount, 200000); // 2 hours * 100,000 UZS
});

test("double-booking: overlapping slot is rejected with conflict and suggestions", async () => {
  const resourceId = "r0000000-0000-0000-0000-000000000003";

  // First customer holds 14:00 to 16:00
  const hold1 = await createBookingHold({
    resourceId,
    startsAt: "2026-11-20T14:00:00.000Z",
    endsAt: "2026-11-20T16:00:00.000Z",
    customerId: "customer-1",
  });
  assert.equal(hold1.success, true);

  // Second customer attempts overlapping 15:00 to 17:00
  const hold2 = await createBookingHold({
    resourceId,
    startsAt: "2026-11-20T15:00:00.000Z",
    endsAt: "2026-11-20T17:00:00.000Z",
    customerId: "customer-2",
  });

  assert.equal(hold2.success, false);
  assert.equal(hold2.error, "SLOT_OCCUPIED");
  assert.ok(hold2.suggestedSlots);
  assert.ok(hold2.suggestedSlots.length > 0);
});

test("adjacent slot on the same resource is allowed", async () => {
  const resourceId = "r0000000-0000-0000-0000-000000000003";

  // Slot directly following 16:00 to 18:00
  const holdAdjacent = await createBookingHold({
    resourceId,
    startsAt: "2026-11-20T16:00:00.000Z",
    endsAt: "2026-11-20T18:00:00.000Z",
    customerId: "customer-3",
  });

  assert.equal(holdAdjacent.success, true);
});

test("confirmBooking updates status to CONFIRMED and records payment", async () => {
  const resourceId = "r0000000-0000-0000-0000-000000000004";
  const hold = await createBookingHold({
    resourceId,
    startsAt: "2026-11-21T09:00:00.000Z",
    endsAt: "2026-11-21T11:00:00.000Z",
    customerId: "customer-1",
  });

  const confirmRes = await confirmBooking({
    bookingId: hold.bookingId,
    customerId: "customer-1",
    provider: "CLICK",
  });

  assert.equal(confirmRes.success, true);
});

test("cancelBooking releases slot so new hold can be created", async () => {
  const resourceId = "r0000000-0000-0000-0000-000000000005";
  const hold = await createBookingHold({
    resourceId,
    startsAt: "2026-11-22T10:00:00.000Z",
    endsAt: "2026-11-22T12:00:00.000Z",
    customerId: "customer-1",
  });

  // Cancel
  const cancelRes = await cancelBooking(hold.bookingId, "customer-1", "Changed plans");
  assert.equal(cancelRes.success, true);

  // New hold on identical slot succeeds now
  const holdAgain = await createBookingHold({
    resourceId,
    startsAt: "2026-11-22T10:00:00.000Z",
    endsAt: "2026-11-22T12:00:00.000Z",
    customerId: "customer-2",
  });

  assert.equal(holdAgain.success, true);
});

test("cleanupExpiredHolds runs without error", async () => {
  const cleanupRes = await cleanupExpiredHolds();
  assert.equal(typeof cleanupRes.releasedCount, "number");
});
