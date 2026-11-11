import assert from "node:assert/strict";
import test from "node:test";
import { notifyReviewTelegram } from "../src/server/notifications/telegram.ts";
import { isMaintenanceMode, setMaintenanceMode } from "../src/server/admin/maintenance.ts";

test("Telegram review notification sends formatted alert with venue, customer, and rating", async () => {
  const result = await notifyReviewTelegram({
    reviewId: "rev-test-001",
    venueName: "Bunyodkor Football Arena",
    customerName: "Ali",
    rating: 5,
    comment: "Maydon juda yaxshi, toza va qulay!",
    submittedAt: "18:30",
    status: "Pending moderation",
  });

  assert.equal(result.success, true);
  assert.equal(result.simulated, true);
});

test("Telegram review notification suppresses duplicate alerts for the same reviewId", async () => {
  const payload = {
    reviewId: "rev-dedup-123",
    venueName: "Olimpiya Suv Saroyi",
    customerName: "Vali",
    rating: 4,
    comment: "Suvi toza va iliq.",
  };

  const firstAttempt = await notifyReviewTelegram(payload);
  assert.equal(firstAttempt.success, true);

  // Second attempt with same ID must be suppressed as duplicate
  const secondAttempt = await notifyReviewTelegram(payload);
  assert.equal(secondAttempt.success, true);
  assert.equal(secondAttempt.error, "DUPLICATE_NOTIFICATION_SUPPRESSED");
});

test("Maintenance mode state can be toggled and queried safely", () => {
  setMaintenanceMode(false);
  assert.equal(isMaintenanceMode(), false);

  setMaintenanceMode(true);
  assert.equal(isMaintenanceMode(), true);

  // Reset back to false
  setMaintenanceMode(false);
  assert.equal(isMaintenanceMode(), false);
});
