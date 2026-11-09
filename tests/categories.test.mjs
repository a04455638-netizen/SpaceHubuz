import assert from "node:assert/strict";
import test from "node:test";
import {
  categories,
  reservationModes,
  searchCategories,
} from "../src/catalog/categories.ts";

test("catalog IDs are unique and reservation modes are defined", () => {
  assert.equal(new Set(categories.map(({ id }) => id)).size, categories.length);
  assert.ok(
    categories.every(({ mode }) => Object.hasOwn(reservationModes, mode)),
  );
});

test("search handles Uzbek apostrophes and category filters", () => {
  assert.deepEqual(
    searchCategories("TO'YXONA", "").map(({ id }) => id),
    ["events"],
  );
  assert.deepEqual(
    searchCategories("tennis korti", "sports").map(({ id }) => id),
    ["sports"],
  );
  assert.deepEqual(searchCategories("tennis", "stays"), []);
  assert.equal(searchCategories("", "").length, categories.length);
});
