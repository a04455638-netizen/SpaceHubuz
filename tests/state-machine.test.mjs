import assert from "node:assert/strict";
import test from "node:test";
import {
  BookingStatus,
  occupiesInventory,
  canTransition,
} from "../src/booking/state-machine.ts";

test("state machine verifies inventory-occupying statuses correctly", () => {
  assert.equal(occupiesInventory(BookingStatus.HELD), true);
  assert.equal(occupiesInventory(BookingStatus.CONFIRMED), true);
  assert.equal(occupiesInventory(BookingStatus.AWAITING_PAYMENT), true);
  assert.equal(occupiesInventory(BookingStatus.REQUESTED), true);
  assert.equal(occupiesInventory(BookingStatus.CHECKED_IN), true);

  assert.equal(occupiesInventory(BookingStatus.CANCELLED), false);
  assert.equal(occupiesInventory(BookingStatus.EXPIRED), false);
  assert.equal(occupiesInventory(BookingStatus.COMPLETED), false);
  assert.equal(occupiesInventory(BookingStatus.REFUNDED), false);
});

test("state machine validates lifecycle transitions", () => {
  // Successful happy path: HELD -> AWAITING_PAYMENT -> CONFIRMED -> CHECKED_IN -> COMPLETED
  assert.equal(
    canTransition(BookingStatus.HELD, BookingStatus.AWAITING_PAYMENT),
    true,
  );
  assert.equal(
    canTransition(BookingStatus.AWAITING_PAYMENT, BookingStatus.CONFIRMED),
    true,
  );
  assert.equal(
    canTransition(BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN),
    true,
  );
  assert.equal(
    canTransition(BookingStatus.CHECKED_IN, BookingStatus.COMPLETED),
    true,
  );

  // Cancellation and expiry paths
  assert.equal(canTransition(BookingStatus.HELD, BookingStatus.EXPIRED), true);
  assert.equal(
    canTransition(BookingStatus.CONFIRMED, BookingStatus.CANCELLED),
    true,
  );
  assert.equal(
    canTransition(BookingStatus.CANCELLED, BookingStatus.REFUND_PENDING),
    true,
  );

  // Disallowed invalid transitions
  assert.equal(
    canTransition(BookingStatus.EXPIRED, BookingStatus.CONFIRMED),
    false,
  );
  assert.equal(
    canTransition(BookingStatus.CANCELLED, BookingStatus.CHECKED_IN),
    false,
  );
  assert.equal(
    canTransition(BookingStatus.COMPLETED, BookingStatus.HELD),
    false,
  );
});
