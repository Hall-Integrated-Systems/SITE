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

  const stageItems = [...rail[1].matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/g)]
    .map(([, attributes, content]) => ({ attributes, content }));
  assert.equal(stageItems.length, 7);

  const stages = stageItems.map(({ attributes, content }, index) => {
    const names = [...content.matchAll(
      /<span class="stage-name">([^<]+)<\/span>/g
    )];
    assert.equal(names.length, 1, `Stage ${index + 1} must have exactly one name`);
    return { attributes, name: names[0][1] };
  });

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
  const truthSplit = html.match(/<div class="truth-split">([\s\S]*?)<\/div>/);
  assert.ok(truthSplit, "Missing verified and pending evidence split");

  const panels = [...truthSplit[1].matchAll(
    /<article\b([^>]*)>([\s\S]*?)<\/article>/g
  )].map(([, attributes, content]) => ({ attributes, content }));
  assert.equal(panels.length, 2);

  const panelClasses = panels.map(({ attributes }, index) => {
    const classAttribute = attributes.match(/\bclass="([^"]*)"/);
    assert.ok(classAttribute, `Evidence panel ${index + 1} must have classes`);
    return classAttribute[1].split(/\s+/);
  });

  assert.ok(panelClasses[0].includes("evidence-panel"));
  assert.ok(!panelClasses[0].includes("pending"));
  assert.deepEqual(
    [...panels[0].content.matchAll(/<h3>([^<]+)<\/h3>/g)]
      .map(([, heading]) => heading),
    ["Verified now"]
  );
  assertContainsInOrder(panels[0].content, [
    "Automotive wire-routing problem and four-channel concept defined",
    "REV-A working decision documented",
    "Commercial CAD access established",
    "CAD work-in-progress capture archived"
  ]);

  assert.ok(panelClasses[1].includes("evidence-panel"));
  assert.ok(panelClasses[1].includes("pending"));
  assert.deepEqual(
    [...panels[1].content.matchAll(/<h3>([^<]+)<\/h3>/g)]
      .map(([, heading]) => heading),
    ["Pending evidence"]
  );
  assertContainsInOrder(panels[1].content, [
    "Critical cable, zip-tie, screw-head, mounting-depth, and access measurements frozen",
    "Current REV-A geometry confirmed",
    "Representative coupon and complete prototype printed",
    "Fit, vibration, pull, and serviceability checks completed"
  ]);

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
