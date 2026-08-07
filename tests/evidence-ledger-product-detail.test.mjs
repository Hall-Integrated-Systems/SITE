import assert from "node:assert/strict";
import test from "node:test";
import { assertContainsInOrder, readText } from "./site-fixture.mjs";

const html = readText("products/his-ca-001a-cable-comb.html");

test("product page identifies the current revision and bounded status", () => {
  assert.match(html, /Current working revision:\s*REV-A/);
  assert.match(html, /August 3, 2026/);
  assert.match(html, /Commercial CAD access established/);
  assert.match(html, /not available for sale/i);
  assert.doesNotMatch(html, /proper commercial Autodesk Fusion access|CAD modeling pending/i);
});

test("product page shows all seven status gates in order", () => {
  const rail = html.match(/<ol class="development-rail"[^>]*>([\s\S]*?)<\/ol>/);
  assert.ok(rail, "Missing development status rail");

  const stages = [...rail[1].matchAll(
    /<li\b([^>]*)>[\s\S]*?<span class="stage-name">([^<]+)<\/span>\s*<\/li>/g
  )].map(([, attributes, name]) => ({ attributes, name }));

  assert.deepEqual(stages.map(({ name }) => name), [
    "Concept defined",
    "Design decision complete",
    "CAD in progress",
    "Prototype printed",
    "Fit evaluation complete",
    "Revision underway",
    "Small-batch preparation"
  ]);

  const currentStages = stages.filter(({ attributes }) =>
    /\baria-current="step"/.test(attributes)
  );
  assert.equal(currentStages.length, 1);
  assert.equal(currentStages[0].name, "CAD in progress");
});

test("product page separates verified and pending evidence", () => {
  assertContainsInOrder(html, [
    "Verified now",
    "Pending evidence",
    "Revision record",
    "Evidence ledger"
  ]);
  assert.match(html, /his-ca-001a-rev-a-cad-work-in-progress\.png/);
  assert.match(html, /Historical AI concept/);
  assert.match(html, /not current geometry/i);
});

test("product dimensions and validation remain explicitly unfrozen", () => {
  assert.match(html, /Dimensions:\s*Not frozen/);
  assert.match(html, /fit, vibration, pull, and serviceability/i);
  assert.doesNotMatch(html, /60 × 16 × 12 mm/);
});
