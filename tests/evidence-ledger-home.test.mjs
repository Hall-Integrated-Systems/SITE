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

test("homepage sections follow the approved Option 3 discovery hierarchy", () => {
  assertContainsInOrder(html, [
    '<section class="home-hero"',
    'aria-labelledby="products-taking-shape-heading"',
    'aria-labelledby="why-his-builds-heading"',
    'aria-labelledby="current-development-heading"',
    'aria-labelledby="founder-band-heading"',
    '<section class="cta-band"'
  ]);

  const hero = getSection('<section class="home-hero"');
  assertContainsInOrder(hero, [
    "ORIGINAL AUTOMOTIVE HARDWARE",
    "Solve the install. Build the part.",
    "Discover What We're Building",
    "Meet Hall Integrated Systems"
  ]);

  const products = getSection('aria-labelledby="products-taking-shape-heading"');
  assert.match(products, /Products taking shape/);
  assert.equal((products.match(/<article\b[^>]*class="[^"]*\bproduct-direction\b[^"]*"/g) ?? []).length, 3);
  assert.equal((products.match(/Active development/g) ?? []).length, 1);
  assert.equal((products.match(/Planned direction/g) ?? []).length, 2);
});

test("homepage separates the photographed reference from the active-product status", () => {
  const hero = getSection('<section class="home-hero"');
  const status = hero.match(/<div\b[^>]*class="[^"]*\bhero-status\b[^"]*"[^>]*>[\s\S]*?<\/div>/)?.[0] ?? "";
  const media = hero.match(/<figure\b[^>]*class="[^"]*\bhero-media\b[^"]*"[^>]*>[\s\S]*?<\/figure>/)?.[0] ?? "";

  assert.match(status, /ACTIVE PRODUCT DEVELOPMENT/);
  assert.match(status, /HIS-CA-001A/);
  assert.match(status, /CAD IN PROGRESS/);
  assert.match(status, /STAGE 03 OF 07/);
  assert.doesNotMatch(status, /prototype\/reference/i);

  assert.match(media, /Photographed installation prototype\/reference/i);
  assert.match(media, /not HIS-CA-001A/i);
  assert.doesNotMatch(media, /CAD IN PROGRESS/);
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

test("homepage uses bounded CAD evidence copy", () => {
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
