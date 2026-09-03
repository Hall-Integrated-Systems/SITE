import assert from "node:assert/strict";
import test from "node:test";
import { assertContainsInOrder, readText } from "./site-fixture.mjs";

const html = readText("index.html");

function getSection(marker) {
  const markerIndex = html.indexOf(marker);
  assert.notEqual(markerIndex, -1, `Missing section marker: ${marker}`);

  const sectionStart = html.lastIndexOf("<section", markerIndex);
  const sectionEnd = html.indexOf("</section>", markerIndex);
  assert.notEqual(sectionStart, -1, `Missing opening section for: ${marker}`);
  assert.notEqual(sectionEnd, -1, `Missing closing section for: ${marker}`);

  return html.slice(sectionStart, sectionEnd + "</section>".length);
}

test("homepage sections follow the approved evidence hierarchy", () => {
  assertContainsInOrder(html, [
    '<section class="evidence-hero">',
    '<section class="section status-section"',
    '<section class="evidence-section"',
    '<section class="section journal-section"',
    'aria-labelledby="installation-context-heading"',
    '<section class="cta-band">'
  ]);

  const hero = getSection('<section class="evidence-hero">');
  assertContainsInOrder(hero, [
    "Automotive product development",
    "Automotive hardware, documented as it develops.",
    "Review HIS-CA-001A evidence"
  ]);

  assert.match(getSection('<section class="section status-section"'), /Current development status/);
  assert.match(getSection('<section class="evidence-section"'), /HIS-CA-001A 4-Wire Speaker Cable Comb/);
  assert.match(getSection('<section class="section journal-section"'), /Development journal/);
  assert.match(getSection('aria-labelledby="installation-context-heading"'), /Installation context/);
});

test("homepage shows the seven stages with CAD as current", () => {
  const railMatch = html.match(/<ol class="development-rail"[^>]*>[\s\S]*?<\/ol>/);
  assert.ok(railMatch, "Missing development rail");
  const rail = railMatch[0];
  const stageItems = rail.match(/<li\b[\s\S]*?<\/li>/g) ?? [];
  const currentItems = stageItems.filter((item) => item.includes('aria-current="step"'));

  assert.equal(stageItems.length, 7, "Development rail must contain exactly seven stages");
  assert.equal(
    (html.match(/aria-current="step"/g) ?? []).length,
    1,
    'Homepage must contain exactly one aria-current="step" marker'
  );
  assert.equal(currentItems.length, 1, "Exactly one development stage must be current");
  assert.match(
    currentItems[0],
    /^<li class="is-current" aria-current="step">[\s\S]*?<span class="stage-name">CAD in progress<\/span><\/li>$/
  );

  assertContainsInOrder(rail, [
    "Concept defined",
    "Design decision complete",
    "CAD in progress",
    "Prototype printed",
    "Fit evaluation complete",
    "Revision underway",
    "Small-batch preparation"
  ]);
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
