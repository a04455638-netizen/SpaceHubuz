import test from "node:test";
import assert from "node:assert/strict";
import { normalizeUzbekPhone, formatUzbekPhoneDisplay } from "../src/server/auth/phone-validation.ts";
import { sendOtpSms, verifyOtpCode } from "../src/server/auth/sms-adapter.ts";

test("phone validation normalizes valid Uzbekistan phone numbers", () => {
  assert.equal(normalizeUzbekPhone("+998901234567"), "+998901234567");
  assert.equal(normalizeUzbekPhone("998901234567"), "+998901234567");
  assert.equal(normalizeUzbekPhone("+998 90 123 45 67"), "+998901234567");
  assert.equal(normalizeUzbekPhone("+998 (97) 765-43-21"), "+998977654321");
  assert.equal(normalizeUzbekPhone("8901234567"), "+998901234567");
});

test("phone validation rejects invalid phone numbers", () => {
  assert.equal(normalizeUzbekPhone(""), null);
  assert.equal(normalizeUzbekPhone("+1234567890"), null);
  assert.equal(normalizeUzbekPhone("+9981234567"), null); // too short
  assert.equal(normalizeUzbekPhone("+998001234567"), null); // invalid operator code 00
  assert.equal(normalizeUzbekPhone("abc"), null);
});

test("phone display formatting produces clean masked string", () => {
  const formatted = formatUzbekPhoneDisplay("+998901234567");
  assert.equal(formatted, "+998 (90) 123-45-67");
});

test("SMS simulator delivers code in non-production and verifies correctly", async () => {
  const phone = "+998901234567";
  const code = "849201";

  const sendResult = await sendOtpSms(phone, code);
  assert.equal(sendResult.success, true);
  assert.equal(sendResult.simulated, true);

  // Wrong code fails
  assert.equal(verifyOtpCode(phone, "000000"), false);

  // Correct code succeeds
  assert.equal(verifyOtpCode(phone, code), true);

  // Replay code fails (consumed)
  assert.equal(verifyOtpCode(phone, code), false);
});

test("development environment accepts master test code 123456", () => {
  assert.equal(verifyOtpCode("+998909998877", "123456"), true);
});
