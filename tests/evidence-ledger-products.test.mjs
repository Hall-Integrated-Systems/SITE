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

test("planned queue binds all five SKUs to ordered ledger cards", () => {
  const plannedProducts = html.match(/<section class="section" aria-labelledby="planned-products-heading"[\s\S]*?<section class="section status-section"/)?.[0] ?? "";
  const plannedCards = [...plannedProducts.matchAll(/<article class="ledger-card planned">([\s\S]*?)<\/article>/g)];
  const plannedSkus = plannedCards.map(([, card]) => card.match(/<h3>(HIS-CA-\d{3}A)<\/h3>/)?.[1]);

  assert.equal(plannedCards.length, 5);
  assert.deepEqual(plannedSkus, [
    "HIS-CA-002A",
    "HIS-CA-003A",
    "HIS-CA-004A",
    "HIS-CA-005A",
    "HIS-CA-006A"
  ]);
});

test("status rail marks CAD in progress as the current step", () => {
  const statusSection = html.match(/<section class="section status-section"[\s\S]*?<\/section>/)?.[0] ?? "";

  assert.match(
    statusSection,
    /<li class="is-current" aria-current="step"><span class="stage-state">Current<\/span><span class="stage-name">CAD in progress<\/span><\/li>/
  );
});

test("products page removes fabricated diagrams and current-proof misuse", () => {
  assert.doesNotMatch(html, /<svg\b/i);
  assert.doesNotMatch(html, /category-diagram|schematic-card/);
  assert.doesNotMatch(html, /UPSCALED_HIS-CA-001A_AIConcept_03_FinalDirection_ProductShot\.png/);
  assert.match(html, /his-ca-001a-rev-a-cad-work-in-progress\.png/);
});
