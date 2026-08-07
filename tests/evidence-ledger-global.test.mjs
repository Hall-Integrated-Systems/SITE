import assert from "node:assert/strict";
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

const refreshedRoutes = routes.slice(0, 5);
const forbiddenTopics = [
  "smart home",
  "home networking",
  "small business IT",
  "general device setup",
  "home automation",
  "Wi-Fi/router troubleshooting",
  "home low-voltage",
  "computer support",
  "non-automotive technology offerings"
];
const navigationItems = [
  ["Home", "index.html"],
  ["Products & Prototypes", "products.html"],
  ["Design & Fabrication", "design-fabrication.html"],
  ["About", "about.html"],
  ["Contact", "contact.html"]
];

function extractElement(html, tagName, description) {
  const match = html.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)</${tagName}>`, "i"));
  assert.ok(match, `Missing ${description}`);
  return match[0];
}

function decodeText(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/gi, "&")
    .replace(/&#0*38;/gi, "&")
    .replace(/&#x0*26;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtmlEntities(text) {
  const namedEntities = new Map([
    ["amp", "&"],
    ["apos", "'"],
    ["emsp", " "],
    ["ensp", " "],
    ["gt", ">"],
    ["hairsp", " "],
    ["lt", "<"],
    ["nbsp", " "],
    ["newline", " "],
    ["quot", '"'],
    ["tab", " "],
    ["thinsp", " "]
  ]);

  return text.replace(/&(#x[\da-f]+|#\d+|[a-z][\da-z]+);/gi, (entity, token) => {
    if (token.startsWith("#")) {
      const hexadecimal = token[1]?.toLowerCase() === "x";
      const codePoint = Number.parseInt(token.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      const isValid = Number.isInteger(codePoint)
        && codePoint >= 0
        && codePoint <= 0x10ffff
        && !(codePoint >= 0xd800 && codePoint <= 0xdfff);
      return isValid ? String.fromCodePoint(codePoint) : entity;
    }

    return namedEntities.get(token.toLowerCase()) ?? entity;
  });
}

function renderedVisibleText(html) {
  const textOnly = html
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  return decodeHtmlEntities(textOnly).replace(/\s+/gu, " ").trim();
}

function assertAutomotiveScope(route, html) {
  const visibleText = renderedVisibleText(html).toLowerCase();
  for (const topic of forbiddenTopics) {
    assert.ok(!visibleText.includes(topic.toLowerCase()), `${route} contains forbidden topic: ${topic}`);
  }
}

function attributeValue(attributes, name) {
  return attributes.match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"))?.[2];
}

function linksIn(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((match) => {
    return {
      attributes: match[1],
      href: attributeValue(match[1], "href"),
      label: decodeText(match[2])
    };
  });
}

function expectedAssetPrefix(route) {
  return route.includes("/") ? "../" : "";
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertNavigationContract(route, html) {
  const header = extractElement(html, "header", `${route} site header`);
  const navigation = extractElement(header, "nav", `${route} primary navigation`);
  assert.match(navigation, /\baria-label\s*=\s*(["'])Main navigation\1/i, `${route} navigation lost its accessible label`);

  const links = linksIn(navigation);
  for (const [label, destination] of navigationItems) {
    const matchingLinks = links.filter((link) => link.label === label);
    assert.equal(matchingLinks.length, 1, `${route} must contain one "${label}" primary-navigation link`);
    assert.equal(
      matchingLinks[0].href,
      `${expectedAssetPrefix(route)}${destination}`,
      `${route} has the wrong primary-navigation destination for "${label}"`
    );
  }
}

function assertRefreshedShellContract(route, html) {
  const prefix = expectedAssetPrefix(route);
  const escapedPrefix = escapeRegExp(prefix);
  const header = extractElement(html, "header", `${route} site header`);
  const footer = extractElement(html, "footer", `${route} site footer`);
  assert.match(
    html,
    new RegExp(`<link\\b(?=[^>]*\\brel\\s*=\\s*(["'])stylesheet\\1)(?=[^>]*\\bhref\\s*=\\s*(["'])${escapedPrefix}style\\.css\\2)[^>]*>`, "i"),
    `${route} lost its route-relative stylesheet link`
  );
  assert.match(
    html,
    new RegExp(`<script\\b(?=[^>]*\\bsrc\\s*=\\s*(["'])${escapedPrefix}script\\.js\\1)[^>]*>\\s*</script>`, "i"),
    `${route} lost its route-relative script include`
  );
  assert.match(header, /<header\b[^>]*class\s*=\s*(["'])[^"']*\bsite-header\b[^"']*\1[^>]*>/i, `${route} lost its site header`);
  assert.match(footer, /<footer\b[^>]*class\s*=\s*(["'])[^"']*\bsite-footer\b[^"']*\1[^>]*>/i, `${route} lost its site footer`);

  const brandLinks = linksIn(header).filter((link) => {
    const classes = attributeValue(link.attributes, "class")?.split(/\s+/) ?? [];
    return classes.includes("brand");
  });
  assert.equal(brandLinks.length, 1, `${route} must contain one header brand link`);
  assert.equal(brandLinks[0].href, `${prefix}index.html`, `${route} has the wrong brand-home destination`);

  const footerLinks = linksIn(footer);
  for (const [label, destination] of [["Privacy", "privacy.html"], ["Sitemap", "sitemap.html"]]) {
    const matchingLinks = footerLinks.filter((link) => link.label === label);
    assert.equal(matchingLinks.length, 1, `${route} must contain one "${label}" footer link`);
    assert.equal(
      matchingLinks[0].href,
      `${prefix}${destination}`,
      `${route} has the wrong footer destination for "${label}"`
    );
  }

  assertNavigationContract(route, html);
}

test("all existing HTML routes preserve the public Clarity ID", () => {
  for (const route of routes) {
    const matches = readText(route).match(/xa3uw9a04d/g) ?? [];
    assert.equal(matches.length, 1, `${route} must contain the public Clarity ID exactly once`);
  }
});

test("refreshed routes contain no stale licensing blocker", () => {
  for (const route of refreshedRoutes) {
    const html = readText(route);
    assert.doesNotMatch(
      html,
      /licensing pending|proper commercial software licensing|proper commercial Autodesk Fusion access/i,
      `${route} contains stale licensing-blocker copy`
    );
  }
});

test("public routes stay within the complete automotive-only scope", () => {
  for (const route of routes) {
    assertAutomotiveScope(route, readText(route));
  }
});

test("automotive-scope checks reject encoded and markup-split visible phrases", () => {
  const mutations = [
    "<main>smart&#32;home</main>",
    "<main>smart&#x20;home</main>",
    "<main>smart&nbsp;home</main>",
    "<main>smart <span>home</span></main>"
  ];

  for (const mutation of mutations) {
    assert.throws(() => assertAutomotiveScope("in-memory.html", mutation), /smart home/);
  }
});

test("primary navigation labels preserve route-aware relationships", () => {
  for (const route of routes) {
    assertNavigationContract(route, readText(route));
  }
});

test("refreshed routes preserve the shared header, footer, stylesheet, and script shell", () => {
  for (const route of refreshedRoutes) {
    assertRefreshedShellContract(route, readText(route));
  }
});

test("shell checks reject in-memory nested-route relationship regressions", () => {
  const route = "products/his-ca-001a-cable-comb.html";
  const html = readText(route);
  const mutations = [
    [
      html.replace('class="brand" href="../index.html"', 'class="brand" href="index.html"'),
      /wrong brand-home destination/
    ],
    [
      html.replace('href="../contact.html">Contact', 'href="contact.html">Contact'),
      /wrong primary-navigation destination for "Contact"/
    ],
    [
      html.replace('href="../privacy.html">Privacy', 'href="privacy.html">Privacy'),
      /wrong footer destination for "Privacy"/
    ],
    [
      html.replace('href="../sitemap.html">Sitemap', 'href="sitemap.html">Sitemap'),
      /wrong footer destination for "Sitemap"/
    ]
  ];

  for (const [mutatedHtml, expectedError] of mutations) {
    assert.throws(() => assertRefreshedShellContract(route, mutatedHtml), expectedError);
  }
});

test("static hosting and contact files retain required signals", () => {
  assert.equal(readText("CNAME").trim(), "hallintegratedsystems.com");
  assert.match(readText("script.js"), /form-status/);
  assert.match(readText("script.js"), /contact_form_submit_success/);
  assert.match(readText("robots.txt"), /Sitemap:/);
  assert.match(readText("sitemap.xml"), /his-ca-001a-cable-comb/);
});
