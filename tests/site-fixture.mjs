import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const repoRoot = new URL("../", import.meta.url);

export function readText(relativePath) {
  return readFileSync(new URL(relativePath, repoRoot), "utf8");
}

export function readBytes(relativePath) {
  return readFileSync(new URL(relativePath, repoRoot));
}

export function sha256(relativePath) {
  return createHash("sha256").update(readBytes(relativePath)).digest("hex").toUpperCase();
}

export function assertContainsInOrder(text, values) {
  let previousIndex = -1;

  for (const value of values) {
    const index = text.indexOf(value);
    assert.notEqual(index, -1, `Missing expected text: ${value}`);
    assert.ok(index > previousIndex, `Expected "${value}" after the preceding value`);
    previousIndex = index;
  }
}
