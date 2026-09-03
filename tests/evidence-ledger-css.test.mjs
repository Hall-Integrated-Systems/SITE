import assert from "node:assert/strict";
import test from "node:test";
import { readText } from "./site-fixture.mjs";

test("Evidence Ledger component selectors exist", () => {
  const css = readText("style.css");
  const selectors = [
    ".evidence-hero",
    ".development-rail",
    ".development-rail .is-complete",
    ".development-rail .is-current",
    ".development-rail .is-pending",
    ".evidence-label",
    ".evidence-grid",
    ".evidence-panel",
    ".evidence-media",
    ".journal-list",
    ".product-ledger-grid",
    ".dossier-grid",
    ".truth-split",
    ".evidence-process"
  ];

  for (const selector of selectors) {
    assert.ok(css.includes(selector), `Missing CSS selector: ${selector}`);
  }
});

test("Evidence Ledger components have mobile rules", () => {
  const css = readText("style.css");
  const mobileBlock = css.slice(css.indexOf("/* Evidence Ledger responsive */"));
  assert.match(mobileBlock, /@media \(max-width: 900px\)/);
  assert.match(mobileBlock, /grid-template-columns:\s*1fr/);
  assert.match(mobileBlock, /@media \(max-width: 620px\)/);
});
