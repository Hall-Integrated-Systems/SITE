import assert from "node:assert/strict";
import test from "node:test";
import { assertContainsInOrder, readText } from "./site-fixture.mjs";

const html = readText("index.html");

test("homepage leads with the approved evidence hierarchy", () => {
  assertContainsInOrder(html, [
    "Automotive product development",
    "Automotive hardware, documented as it develops.",
    "Current development status",
    "HIS-CA-001A",
    "Development journal",
    "Installation context"
  ]);
});

test("homepage shows the seven stages with CAD as current", () => {
  assertContainsInOrder(html, [
    "Concept defined",
    "Design decision complete",
    "CAD in progress",
    "Prototype printed",
    "Fit evaluation complete",
    "Revision underway",
    "Small-batch preparation"
  ]);
  assert.match(html, /class="is-current" aria-current="step"[\s\S]*CAD in progress/);
});

test("homepage uses bounded CAD and licensing copy", () => {
  assert.match(html, /Commercial CAD access established/);
  assert.match(html, /CAD work-in-progress capture recorded August 6, 2026/);
  assert.match(html, /REV-A working design decision documented/);
  assert.doesNotMatch(html, /licensing pending|proper commercial software licensing|CAD model complete/i);
});

test("homepage uses the reviewed CAD derivative without the old cable-comb concept image", () => {
  assert.match(html, /his-ca-001a-rev-a-cad-work-in-progress\.png/);
  assert.match(html, /CAD work in progress/);
  assert.doesNotMatch(html, /UPSCALED_HIS-CA-001A_AIConcept_03_FinalDirection_ProductShot\.png/);
});
