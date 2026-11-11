import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { verifyClickSignature, handleClickWebhook } from "../src/server/payments/click-provider.ts";
import { verifyPaymeAuth, handlePaymeRpc } from "../src/server/payments/payme-provider.ts";
import { sendTelegramAlert } from "../src/server/notifications/telegram.ts";
import { createBookingHold } from "../src/server/booking/hold-service.ts";

test("click signature verification passes with correct md5 hash", () => {
  const secretKey = "TEST_CLICK_SECRET";
  const req = {
    click_trans_id: "12345",
    service_id: "6789",
    click_paydoc_id: "999",
    merchant_trans_id: "book-1",
    amount: "150000",
    action: "0",
    error: "0",
    error_note: "Success",
    sign_time: "2026-11-20 12:00:00",
    sign_string: "",
  };

  const expectedHash = crypto
    .createHash("md5")
    .update(`${req.click_trans_id}${req.service_id}${secretKey}${req.merchant_trans_id}${req.amount}${req.action}${req.sign_time}`)
    .digest("hex");

  req.sign_string = expectedHash;
  assert.equal(verifyClickSignature(req, secretKey), true);

  // Altering sign_string fails
  req.sign_string = "invalid_hash_value";
  assert.equal(verifyClickSignature(req, secretKey), false);
});

test("click webhook handles prepare and complete actions", async () => {
  const secretKey = "TEST_CLICK_SECRET";
  const hold = await createBookingHold({
    resourceId: "r-pay-1",
    startsAt: "2026-11-25T10:00:00.000Z",
    endsAt: "2026-11-25T11:00:00.000Z",
    customerId: "c-pay-1",
  });

  const prepareReq = {
    click_trans_id: "1001",
    service_id: "555",
    click_paydoc_id: "777",
    merchant_trans_id: hold.bookingId,
    amount: "100000",
    action: "0",
    error: "0",
    error_note: "Success",
    sign_time: "2026-11-25 10:00:00",
    sign_string: "",
  };

  prepareReq.sign_string = crypto
    .createHash("md5")
    .update(`${prepareReq.click_trans_id}${prepareReq.service_id}${secretKey}${prepareReq.merchant_trans_id}${prepareReq.amount}${prepareReq.action}${prepareReq.sign_time}`)
    .digest("hex");

  const prepRes = await handleClickWebhook(prepareReq);
  assert.equal(prepRes.error, 0);

  // Complete action
  const completeReq = {
    ...prepareReq,
    action: "1",
  };
  completeReq.sign_string = crypto
    .createHash("md5")
    .update(`${completeReq.click_trans_id}${completeReq.service_id}${secretKey}${completeReq.merchant_trans_id}${completeReq.amount}${completeReq.action}${completeReq.sign_time}`)
    .digest("hex");

  const compRes = await handleClickWebhook(completeReq);
  assert.equal(compRes.error, 0);
  assert.ok(compRes.merchant_confirm_id);
});

test("payme basic auth verifies valid credentials and rejects bad passwords", () => {
  const validHeader = "Basic " + Buffer.from("Paycom:TEST_PAYME_SECRET").toString("base64");
  assert.equal(verifyPaymeAuth(validHeader), true);

  const invalidHeader = "Basic " + Buffer.from("Paycom:WRONG_PASSWORD").toString("base64");
  assert.equal(verifyPaymeAuth(invalidHeader), false);

  assert.equal(verifyPaymeAuth(null), false);
});

test("payme rpc handles CheckPerformTransaction and PerformTransaction", async () => {
  const validHeader = "Basic " + Buffer.from("Paycom:TEST_PAYME_SECRET").toString("base64");

  const checkReq = {
    method: "CheckPerformTransaction",
    params: {
      account: { booking_id: "book-sample-123" },
      amount: 15000000, // in tiyin
    },
    id: 101,
  };

  const checkRes = await handlePaymeRpc(checkReq, validHeader);
  assert.equal(checkRes.id, 101);
  assert.equal(checkRes.result?.allow, true);

  const performReq = {
    method: "PerformTransaction",
    params: {
      id: "payme-tx-999",
      account: { booking_id: "book-sample-123" },
      amount: 15000000,
    },
    id: 102,
  };

  const perfRes = await handlePaymeRpc(performReq, validHeader);
  assert.equal(perfRes.id, 102);
  assert.equal(perfRes.result?.state, 2);
});

test("telegram alert simulator logs message safely without throwing", async () => {
  const result = await sendTelegramAlert("New Booking #SH-12345 received!");
  assert.equal(result.success, true);
  assert.equal(result.simulated, true);
});
