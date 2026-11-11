import assert from "node:assert/strict";
import test from "node:test";
import { CURATED_VENUES, searchCuratedVenues } from "../src/server/mock-venues.ts";
import { findPublicVenues } from "../src/server/public-venues.ts";

test("curated venues have valid GPS coordinates within Uzbekistan boundary", () => {
  assert.ok(CURATED_VENUES.length >= 4, "Must have at least 4 curated venues");

  for (const v of CURATED_VENUES) {
    assert.ok(v.latitude >= 37.0 && v.latitude <= 45.5, `Latitude ${v.latitude} out of UZ range`);
    assert.ok(v.longitude >= 56.0 && v.longitude <= 73.5, `Longitude ${v.longitude} out of UZ range`);
    assert.ok(v.pricePerHour > 0, `Price per hour must be positive for ${v.name}`);
    assert.ok(v.featuredImage.startsWith("http"), `Featured image must be a valid URL for ${v.name}`);
  }
});

test("searchCuratedVenues filters correctly by category and search keyword", () => {
  const coworkings = searchCuratedVenues("", "coworking");
  assert.ok(coworkings.length > 0);
  assert.ok(coworkings.every((v) => v.category === "coworking"));

  const sports = searchCuratedVenues("futsal", "sports");
  assert.ok(sports.length > 0);
  assert.ok(sports.some((v) => v.slug.includes("futsal")));

  const empty = searchCuratedVenues("nonexistent-random-keyword-xyz", "events");
  assert.equal(empty.length, 0);
});

test("findPublicVenues returns public listings with valid coordinates and resources", async () => {
  const results = await findPublicVenues("", "");
  assert.ok(results.length > 0);

  const sample = results[0];
  assert.ok(sample.id);
  assert.ok(sample.name);
  assert.ok(sample.latitude);
  assert.ok(sample.longitude);
  assert.ok(sample.pricePerHour > 0);
});
