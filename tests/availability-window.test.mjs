import assert from "node:assert/strict";
import test from "node:test";
import { parseAvailabilityWindow } from "../src/server/availability-window.ts";

test("availability windows accept UTC timestamps across midnight", () => {
  const result = parseAvailabilityWindow(
    "2026-11-09T23:30:00Z",
    "2026-11-10T00:30:00.000Z",
  );
  assert.equal(result.startsAt.toISOString(), "2026-11-09T23:30:00.000Z");
  assert.equal(result.endsAt.toISOString(), "2026-11-10T00:30:00.000Z");
});

test("availability windows reject invalid, reversed and oversized ranges", () => {
  const start = "2026-11-09T00:00:00Z";
  assert.equal(parseAvailabilityWindow(null, start), null);
  assert.equal(parseAvailabilityWindow("2026-02-30T00:00:00Z", start), null);
  assert.equal(parseAvailabilityWindow(start, start), null);
  assert.equal(parseAvailabilityWindow(start, "2026-11-08T00:00:00Z"), null);
  assert.equal(parseAvailabilityWindow(start, "2026-12-11T00:00:00Z"), null);
});
