import assert from "node:assert/strict";
import test from "node:test";
import { assertContainsInOrder, readText } from "./site-fixture.mjs";

const html = readText("products.html");

test("products page is a development queue", () => {
  assert.match(html, /Product development queue/);

  const queueRecords = html.slice(html.indexOf("Active product record"));
  assertContainsInOrder(queueRecords, [
    "Active product record",
    "HIS-CA-001A",
    "Planned product directions",
    "HIS-CA-002A",
    "HIS-CA-006A"
  ]);
});

test("only HIS-CA-001A is shown in CAD progress", () => {
  const activeRecord = html.match(/<section class="section evidence-section"[\s\S]*?<\/section>/)?.[0] ?? "";
  const plannedProducts = html.match(/<section class="section" aria-labelledby="planned-products-heading"[\s\S]*?<section class="section status-section"/)?.[0] ?? "";

  assert.match(activeRecord, /CAD in progress/);
  assert.doesNotMatch(plannedProducts, /CAD in progress/);
  assert.equal((plannedProducts.match(/Planned concept/g) || []).length, 5);
});

test("products page removes fabricated diagrams and current-proof misuse", () => {
  assert.doesNotMatch(html, /<svg\b/i);
  assert.doesNotMatch(html, /category-diagram|schematic-card/);
  assert.doesNotMatch(html, /UPSCALED_HIS-CA-001A_AIConcept_03_FinalDirection_ProductShot\.png/);
  assert.match(html, /his-ca-001a-rev-a-cad-work-in-progress\.png/);
});
