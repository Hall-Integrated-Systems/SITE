import assert from "node:assert/strict";
import test from "node:test";
import { readText } from "./site-fixture.mjs";

const design = readText("design-fabrication.html");
const about = readText("about.html");

function extractSectionByLabelledBy(html, id) {
  const pattern = new RegExp(
    `<section\\b[^>]*aria-labelledby="${id}"[^>]*>[\\s\\S]*?<\\/section>`
  );
  const match = html.match(pattern);
  assert.ok(match, `Missing section labelled by "${id}"`);
  return match[0];
}

function extractArticleByHeading(html, heading) {
  const articles = html.match(/<article\b[^>]*>[\s\S]*?<\/article>/g) ?? [];
  const article = articles.find((candidate) => candidate.includes(`<h2>${heading}</h2>`));
  assert.ok(article, `Missing article headed "${heading}"`);
  return article;
}

test("Design & Fabrication presents exactly eight ordered evidence gates", () => {
  const section = extractSectionByLabelledBy(design, "evidence-process-heading");
  const listMatch = section.match(/<ol\b[^>]*class="[^"]*\bevidence-process\b[^"]*"[^>]*>([\s\S]*?)<\/ol>/);
  assert.ok(listMatch, "Evidence-process section must contain an evidence-process ordered list");

  const items = [...listMatch[1].matchAll(/<li\b[^>]*>\s*<strong>([^<]+)<\/strong>/g)]
    .map((match) => match[1]);

  assert.deepEqual(items, [
    "Define the installation problem",
    "Document a working design decision",
    "Build and inspect the CAD model",
    "Measure critical interfaces and print a representative coupon",
    "Print the complete prototype",
    "Evaluate fit, retention, vibration, pull, access, and serviceability",
    "Record revision decisions",
    "Prepare for a small batch"
  ]);
  assert.equal((listMatch[1].match(/<li\b/g) ?? []).length, 8);
});

test("Design & Fabrication removes decorative process art and describes the company-owned pipeline", () => {
  assert.doesNotMatch(design, /process-visual-section|process-visual-grid|process-node|process-line/);

  const section = extractSectionByLabelledBy(design, "evidence-process-heading");
  assert.match(section, /Company-owned development process/);
  assert.match(section, /own automotive hardware pipeline/);
  assert.doesNotMatch(section, /contract manufacturing services|client CAD services/i);
});

test("Design & Fabrication states the bounded current development status", () => {
  const status = extractArticleByHeading(design, "From install problem to physical component");
  assert.match(status, /Commercial CAD access is established/);
  assert.match(status, /HIS-CA-001A modeling is in progress/);
  assert.match(status, /matching geometry, prototype printing, and physical validation remain pending/);
});

test("Design & Fabrication preserves photographed-prototype disclosures", () => {
  const section = extractSectionByLabelledBy(design, "fabrication-photo-heading");
  assert.match(section, /AI-assisted visualization based on the photographed electronics/);
  assert.match(section, /AI-assisted retouch of the photographed prototype/);
  assert.match(section, /Tiny printed labels are not specification references/);
});

test("About states the current licensing and product milestone", () => {
  const hero = about.match(/<section\b[^>]*class="[^"]*\bpage-hero\b[^"]*"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero, "Missing About page hero");
  assert.match(hero, /Commercial CAD access established/);
  assert.match(hero, /HIS-CA-001A CAD modeling is in progress/);
  assert.match(hero, /prototype print and validation remain pending/);

  const milestone = extractArticleByHeading(about, "Building Hall Integrated Systems");
  assert.match(milestone, /QIDI Plus4, on July 21, 2026/);
  assert.match(milestone, /Commercial CAD access established/);
  assert.match(milestone, /CAD modeling is in progress/);
  assert.match(milestone, /representative coupon, complete prototype print, dimensional review, fit evaluation, revision outcome, and small-batch preparation remain pending/);
  assert.doesNotMatch(milestone, /holding CAD|proper commercial software licensing is in place/i);
});
