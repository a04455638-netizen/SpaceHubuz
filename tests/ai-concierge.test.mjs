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
    result.message.includes("Katalog") || result.message.includes("joylar")
  );
  assert.ok(result.suggestedVenues && result.suggestedVenues.length > 0);
  assert.equal(result.suggestedVenues[0].category, "coworking");
});

test("AI Concierge handles general inquiry gracefully without forcing venues", async () => {
  const result = await askConcierge([
    { role: "user", content: "Assalomu alaykum, siz nima qilasiz?" },
  ]);

  assert.equal(result.isFallback, true);
  assert.ok(result.message.includes("SpaceHub"));
  assert.equal(result.suggestedVenues, undefined);
});

test("AI Concierge politely rejects Uzbek query when active site language is English", async () => {
  const result = await askConcierge(
    [{ role: "user", content: "Menga yaxshi futsal maydon kerak" }],
    { locale: "en" }
  );

  assert.equal(result.isFallback, true);
  assert.ok(result.message.includes("English"));
});

test("Football search returns football fields, NOT coworking", async () => {
  const result = await askConcierge([
    { role: "user", content: "Menga futbol maydoni topib ber" },
  ]);

  assert.ok(result.suggestedVenues && result.suggestedVenues.length > 0);
  // Verify every recommended venue is related to football/sports, not coworking
  for (const v of result.suggestedVenues) {
    assert.notEqual(v.category, "coworking");
    assert.equal(v.category, "sports");
    assert.ok(
      v.slug.includes("futsal") ||
        v.slug.includes("football") ||
        v.name.toLowerCase().includes("futsal") ||
        v.name.toLowerCase().includes("football")
    );
  }
});

test("Basketball search returns basketball facilities", async () => {
  const result = await askConcierge([
    { role: "user", content: "Menga basketbol maydoni kerak" },
  ]);

  assert.ok(result.suggestedVenues && result.suggestedVenues.length > 0);
  assert.equal(result.suggestedVenues[0].category, "sports");
  assert.ok(result.suggestedVenues[0].slug.includes("basket"));
});

test("Swimming pool search returns swimming pools", async () => {
  const result = await askConcierge([
    { role: "user", content: "Basseyn topib ber" },
  ]);

  assert.ok(result.suggestedVenues && result.suggestedVenues.length > 0);
  assert.equal(result.suggestedVenues[0].category, "sports");
  assert.ok(
    result.suggestedVenues[0].slug.includes("pool") ||
      result.suggestedVenues[0].name.toLowerCase().includes("basseyn")
  );
});

test("5-person restaurant search matches restaurant category and capacity", async () => {
  const result = await askConcierge([
    { role: "user", content: "Menga 5 kishilik restoran kerak" },
  ]);

  assert.ok(result.suggestedVenues && result.suggestedVenues.length > 0);
  assert.equal(result.suggestedVenues[0].category, "restaurant");
});

test("Cheap tennis court search returns tennis courts sorted by price", async () => {
  const result = await askConcierge([
    { role: "user", content: "Menga arzon tennis korti kerak" },
  ]);

  assert.ok(result.suggestedVenues && result.suggestedVenues.length > 0);
  assert.equal(result.suggestedVenues[0].category, "sports");
  assert.ok(
    result.suggestedVenues[0].slug.includes("tennis") ||
      result.suggestedVenues[0].slug.includes("padel")
  );
  if (result.suggestedVenues.length > 1) {
    assert.ok(
      result.suggestedVenues[0].pricePerHour <= result.suggestedVenues[1].pricePerHour
    );
  }
});

test("Birthday query recommends event halls and restaurants", async () => {
  const result = await askConcierge([
    { role: "user", content: "Tug‘ilgan kunim uchun joy kerak" },
  ]);

  assert.ok(result.suggestedVenues && result.suggestedVenues.length > 0);
  const cat = result.suggestedVenues[0].category;
  assert.ok(["restaurant", "events", "cinema"].includes(cat));
});

test("Russian and English queries work properly with respective categories", async () => {
  const ruRes = await askConcierge(
    [{ role: "user", content: "Найди мне футбольное поле" }],
    { locale: "ru" }
  );
  assert.ok(ruRes.suggestedVenues && ruRes.suggestedVenues.length > 0);
  assert.equal(ruRes.suggestedVenues[0].category, "sports");
  assert.ok(ruRes.message.includes("футбол"));

  const enRes = await askConcierge(
    [{ role: "user", content: "Find me a football pitch in Tashkent" }],
    { locale: "en" }
  );
  assert.ok(enRes.suggestedVenues && enRes.suggestedVenues.length > 0);
  assert.equal(enRes.suggestedVenues[0].category, "sports");
  assert.ok(enRes.message.includes("football"));
});
