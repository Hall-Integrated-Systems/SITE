import assert from "node:assert/strict";
import test from "node:test";
import { readText, sha256 } from "./site-fixture.mjs";

const assetPath = "assets/products/his-ca-001a/his-ca-001a-rev-a-cad-work-in-progress.png";
const expectedHash = "2C2E81CAD64DF33C6DA0609426FE82A65D565AB8C86EB3990A09FBAFFEBB6A14";

test("CAD web derivative is the reviewed source-preserving capture", () => {
  assert.equal(sha256(assetPath), expectedHash);
});

test("CAD derivative notes preserve the evidence boundary", () => {
  const notes = readText("assets/products/his-ca-001a/ASSET_NOTES.md");
  assert.match(notes, /CAD work in progress/);
  assert.match(notes, /does not prove/i);
  assert.match(notes, new RegExp(expectedHash));
  assert.match(
    notes,
    /Publishing limit: Do not label this image CAD complete, validated, printed, tested, available, or production-ready\./
  );
  assert.doesNotMatch(
    notes,
    /\b(?:is|status:)\s+(?:CAD complete|validated|production-ready)\b/i
  );
});
