import assert from "node:assert/strict";
import test from "node:test";
import { askConcierge } from "../src/server/ai/concierge.ts";

test("AI Concierge provides deterministic fallback responses when API key is unset", async () => {
  const result = await askConcierge([
    { role: "user", content: "Kovorking yoki o'quv xonasi bormi?" },
  ]);

  assert.equal(result.isFallback, true);
  assert.ok(result.message.length > 20);
  assert.ok(
    result.message.includes("Katalog") || result.message.includes("joylar"),
  );
});

test("AI Concierge handles general inquiry gracefully", async () => {
  const result = await askConcierge([
    { role: "user", content: "Assalomu alaykum, siz nima qilasiz?" },
  ]);

  assert.equal(result.isFallback, true);
  assert.ok(result.message.includes("SpaceHub"));
});
