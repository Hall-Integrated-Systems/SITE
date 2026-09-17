import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { readText } from "./site-fixture.mjs";

const routes = [
  "index.html",
  "products.html",
  "products/his-ca-001a-cable-comb.html",
  "design-fabrication.html",
  "about.html",
  "contact.html",
  "privacy.html",
  "sitemap.html"
];
const repoRoot = new URL("../", import.meta.url);

function attributeValue(attributes, name) {
  return attributes.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];
}

function localReferences(html) {
  const references = [];

  for (const match of html.matchAll(/<(a|img|script|link)\b([^>]*)>/gi)) {
    const attributes = match[2];
    for (const name of ["href", "src"]) {
      const value = attributeValue(attributes, name);
      if (value) {
        references.push(value);
      }
    }

    const srcset = attributeValue(attributes, "srcset");
    if (srcset) {
      references.push(...srcset.split(",").map((entry) => entry.trim().split(/\s+/)[0]));
    }
  }

  return references;
}

function isExternalOrNonFileReference(reference) {
  return /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(reference);
}

function resolvedLocalPath(route, reference) {
  const cleanReference = reference.split(/[?#]/, 1)[0];
  if (cleanReference.startsWith("/")) {
    return fileURLToPath(new URL(cleanReference.slice(1), repoRoot));
  }
  return fileURLToPath(new URL(cleanReference, new URL(route, repoRoot)));
}

test("every local page, image, stylesheet, and script reference resolves to a file", () => {
  for (const route of routes) {
    for (const reference of localReferences(readText(route))) {
      if (isExternalOrNonFileReference(reference)) {
        continue;
      }

      const target = resolvedLocalPath(route, reference);
      assert.ok(existsSync(target), `${route} references missing local target: ${reference}`);
    }
  }
});

test("every public route has one primary heading", () => {
  for (const route of routes) {
    const headings = readText(route).match(/<h1\b[^>]*>/gi) ?? [];
    assert.equal(headings.length, 1, `${route} must contain exactly one h1`);
  }
});

test("every content image has a non-empty text alternative", () => {
  for (const route of routes) {
    const images = [...readText(route).matchAll(/<img\b([^>]*)>/gi)];
    for (const [, attributes] of images) {
      const source = attributeValue(attributes, "src") ?? "unknown image";
      const alt = attributeValue(attributes, "alt");
      assert.notEqual(alt, undefined, `${route} image ${source} is missing alt text`);
      assert.notEqual(alt.trim(), "", `${route} image ${source} has empty alt text`);
    }
  }
});

test("Azure pull-request cleanup receives the deployment token", () => {
  const workflow = readText(".github/workflows/azure-static-web-apps-orange-smoke-082f2870f.yml");
  const closeJob = workflow.split("close_pull_request_job:")[1];

  assert.ok(closeJob, "Azure workflow must define the pull-request cleanup job");
  assert.match(
    closeJob,
    /azure_static_web_apps_api_token:\s*\$\{\{\s*secrets\.AZURE_STATIC_WEB_APPS_API_TOKEN_ORANGE_SMOKE_082F2870F\s*\}\}/,
    "Azure pull-request cleanup must receive the same deployment token as uploads"
  );
});
