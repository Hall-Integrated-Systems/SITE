# Evidence Ledger Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Hall Integrated Systems public site around the approved Evidence Ledger direction so visitors can distinguish verified automotive product-development evidence from pending work.

**Architecture:** Preserve the existing static HTML/CSS/JavaScript site and its public routes. Add one source-preserving CAD web derivative, semantic status/evidence components in the existing stylesheet, and Node built-in regression tests that inspect public markup without introducing a build process or runtime dependency.

**Tech Stack:** Plain HTML5, CSS3, existing vanilla JavaScript, Node.js 24 built-in `node:test`, GitHub Pages, existing Azure Function/Microsoft Graph contact transport, and Microsoft Clarity.

## Global Constraints

- Work from `D:\DEV\SITE` on a dedicated `codex/` branch or isolated worktree.
- Use plain HTML, CSS, and JavaScript; do not add a frontend framework or build process.
- Use Arial, Helvetica, sans-serif only.
- Do not add external fonts, icon CDNs, inline SVG approximations, CSS illustrations, or new third-party frontend dependencies.
- Preserve public Clarity ID `xa3uw9a04d`.
- Preserve the existing contact endpoint and Azure Function/Microsoft Graph workflow.
- Preserve `CNAME`, public routes, navigation relationships, `robots.txt`, `sitemap.xml`, `sitemap.html`, and keyboard behavior.
- Keep the public site automotive-only and product-company focused.
- Do not claim products are printed, tested, certified, available, production-ready, sold, or shipped without matching evidence.
- Use “Commercial CAD access established” as the complete public licensing claim.
- Treat HIS-CA-001A as: concept defined complete; design decision complete; CAD in progress; prototype, fit evaluation, revision, and small-batch preparation pending.
- Treat the August 6 CAD PNG as evidence of modeling activity, not proof that the documented REV-A retention and mounting geometry is complete.
- Do not add private Word files, the Autodesk license file, high-resolution masters, source PSDs, STL files, or SharePoint records to Git.
- Do not stage existing unrelated untracked files.
- Do not deploy to Sites or GitHub Pages during implementation. Deployment requires a separate explicit approval.

---

## File map

### Files to create

- `assets/products/his-ca-001a/his-ca-001a-rev-a-cad-work-in-progress.png` — exact public copy of the approved 1280 × 720 CAD capture.
- `assets/products/his-ca-001a/ASSET_NOTES.md` — source path, hash, disclosure, and publishing limits for the CAD derivative.
- `tests/site-fixture.mjs` — shared file-reading, hashing, and order-assertion helpers.
- `tests/evidence-ledger-assets.test.mjs` — CAD derivative and disclosure regression tests.
- `tests/evidence-ledger-css.test.mjs` — shared Evidence Ledger selector and responsive-rule tests.
- `tests/evidence-ledger-home.test.mjs` — homepage hierarchy, truth, and evidence tests.
- `tests/evidence-ledger-products.test.mjs` — products-index status and non-fabrication tests.
- `tests/evidence-ledger-product-detail.test.mjs` — HIS-CA-001A dossier truth and status tests.
- `tests/evidence-ledger-supporting-pages.test.mjs` — Design & Fabrication and About truth tests.
- `tests/evidence-ledger-global.test.mjs` — cross-route analytics, navigation, forbidden-topic, and stale-copy tests.

### Files to modify

- `style.css` — append the Evidence Ledger component system and responsive behavior using existing color tokens.
- `index.html` — replace the broad brochure hierarchy with the evidence hero, status rail, featured dossier, journal, contextual photography, and inquiry band.
- `products.html` — convert the catalog-like page into an active-product evidence record plus a clearly pending development queue.
- `products/his-ca-001a-cable-comb.html` — rebuild as the public HIS-CA-001A evidence dossier.
- `design-fabrication.html` — replace decorative process art with the evidence-gate workflow and remove stale status wording.
- `about.html` — replace licensing-pending copy with the bounded current milestone.

### Files explicitly preserved

- `script.js`
- `contact.html`
- `privacy.html`
- `api/**`
- `CNAME`
- `robots.txt`
- `sitemap.html`
- `sitemap.xml`

No route is added or removed, so the sitemap files require no content change.

---

### Task 1: Intake the approved CAD work-in-progress derivative

**Files:**

- Create: `assets/products/his-ca-001a/his-ca-001a-rev-a-cad-work-in-progress.png`
- Create: `assets/products/his-ca-001a/ASSET_NOTES.md`
- Create: `tests/site-fixture.mjs`
- Create: `tests/evidence-ledger-assets.test.mjs`

**Interfaces:**

- Consumes: canonical SharePoint folder `Documents/Products/HIS-CA-001A Cable Comb/03 CAD` and synced local mirror `C:\Users\Tango\OneDrive - HALL INTEGRATED SYTEMS\Documents\SharePoint-Documents\Products\HIS-CA-001A Cable Comb\03 CAD`.
- Produces: `readText(relativePath)`, `readBytes(relativePath)`, `sha256(relativePath)`, and `assertContainsInOrder(text, values)` from `tests/site-fixture.mjs`; public CAD derivative with SHA-256 `2C2E81CAD64DF33C6DA0609426FE82A65D565AB8C86EB3990A09FBAFFEBB6A14`.

- [ ] **Step 1: Reconfirm the read-only SharePoint and local source**

Use the SharePoint connector to list:

```text
Site: https://hallintegratedsystems.sharepoint.com/sites/allcompany
Library: Documents
Folder: Products/HIS-CA-001A Cable Comb/03 CAD
```

Expected immediate children:

```text
HIS-CA-001A_REV-A_Master (~recovered).png       63,662 bytes
HIS-CA-001A_REV-A_Master (~recovered).png.png   97,161 bytes
HIS-CA-001A_REV-A_Master.png                    97,440 bytes
```

Then run:

```powershell
$source = 'C:\Users\Tango\OneDrive - HALL INTEGRATED SYTEMS\Documents\SharePoint-Documents\Products\HIS-CA-001A Cable Comb\03 CAD\HIS-CA-001A_REV-A_Master.png'
Get-Item -LiteralPath $source | Select-Object FullName, Length, LastWriteTime
Get-FileHash -LiteralPath $source -Algorithm SHA256
```

Expected: 97,440 bytes and SHA-256 `2C2E81CAD64DF33C6DA0609426FE82A65D565AB8C86EB3990A09FBAFFEBB6A14`. If either differs, stop this task and visually re-review the changed source before copying it.

- [ ] **Step 2: Create the shared test helper**

Create `tests/site-fixture.mjs`:

```js
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
```

- [ ] **Step 3: Write the failing asset test**

Create `tests/evidence-ledger-assets.test.mjs`:

```js
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
  assert.doesNotMatch(notes, /CAD complete|production-ready|validated/i);
});
```

- [ ] **Step 4: Run the asset test and verify the red state**

Run:

```powershell
node --test tests/evidence-ledger-assets.test.mjs
```

Expected: FAIL because the public derivative and asset notes do not exist.

- [ ] **Step 5: Copy the exact reviewed binary**

Run:

```powershell
$source = 'C:\Users\Tango\OneDrive - HALL INTEGRATED SYTEMS\Documents\SharePoint-Documents\Products\HIS-CA-001A Cable Comb\03 CAD\HIS-CA-001A_REV-A_Master.png'
$destination = 'D:\DEV\SITE\assets\products\his-ca-001a\his-ca-001a-rev-a-cad-work-in-progress.png'
Copy-Item -LiteralPath $source -Destination $destination
Get-FileHash -LiteralPath $destination -Algorithm SHA256
```

Expected destination hash: `2C2E81CAD64DF33C6DA0609426FE82A65D565AB8C86EB3990A09FBAFFEBB6A14`.

- [ ] **Step 6: Add the exact public disclosure**

Create `assets/products/his-ca-001a/ASSET_NOTES.md`:

```markdown
# HIS-CA-001A Public Asset Notes

## his-ca-001a-rev-a-cad-work-in-progress.png

- Evidence label: CAD work in progress
- Source: Hall Integrated Systems SharePoint, `Documents/Products/HIS-CA-001A Cable Comb/03 CAD/HIS-CA-001A_REV-A_Master.png`
- Synced source reviewed: `C:\Users\Tango\OneDrive - HALL INTEGRATED SYTEMS\Documents\SharePoint-Documents\Products\HIS-CA-001A Cable Comb\03 CAD\HIS-CA-001A_REV-A_Master.png`
- Source and derivative SHA-256: `2C2E81CAD64DF33C6DA0609426FE82A65D565AB8C86EB3990A09FBAFFEBB6A14`
- Public caption: CAD work-in-progress capture recorded August 6, 2026. The visible model confirms CAD activity; it does not prove that the documented REV-A retention and mounting decisions are complete.
- Alt text: CAD work-in-progress view of a four-channel HIS-CA-001A cable-comb model with two countersunk face holes.
- Publishing limit: Do not label this image CAD complete, validated, printed, tested, available, or production-ready.
```

- [ ] **Step 7: Run the asset tests and commit**

Run:

```powershell
node --test tests/evidence-ledger-assets.test.mjs
git diff --check
git add -- tests/site-fixture.mjs tests/evidence-ledger-assets.test.mjs assets/products/his-ca-001a/ASSET_NOTES.md assets/products/his-ca-001a/his-ca-001a-rev-a-cad-work-in-progress.png
git diff --cached --name-status
git commit -m "assets: add bounded HIS-CA-001A CAD evidence"
```

Expected: 2 tests pass; staged list contains only the four intended Task 1 files.

---

### Task 2: Add the shared Evidence Ledger component system

**Files:**

- Create: `tests/evidence-ledger-css.test.mjs`
- Modify: `style.css:1707-end`

**Interfaces:**

- Consumes: existing CSS variables `--navy`, `--blue`, `--cyan`, `--charcoal`, `--silver`, `--silver-soft`, `--silver-panel`, `--white`, `--muted`, `--line`, `--shadow`, and `--radius`.
- Produces: `.evidence-hero`, `.development-rail`, `.evidence-label`, `.evidence-grid`, `.evidence-panel`, `.evidence-media`, `.journal-list`, `.product-ledger-grid`, `.dossier-grid`, `.truth-split`, and `.evidence-process` styles used by Tasks 3–6.

- [ ] **Step 1: Write the failing CSS contract test**

Create `tests/evidence-ledger-css.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the CSS test and verify the red state**

Run:

```powershell
node --test tests/evidence-ledger-css.test.mjs
```

Expected: FAIL with missing Evidence Ledger selectors.

- [ ] **Step 3: Append the shared component CSS**

Append this block to `style.css`:

```css
/* 2026 Evidence Ledger direction */
.evidence-hero {
  color: var(--white);
  background: var(--navy);
  border-bottom: 4px solid var(--cyan);
}

.evidence-hero-inner,
.evidence-feature,
.dossier-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  gap: clamp(32px, 6vw, 80px);
  align-items: center;
  width: min(1320px, calc(100% - 48px));
  margin: 0 auto;
}

.evidence-hero-inner {
  min-height: 620px;
  padding: 64px 0;
}

.evidence-hero-copy h1 {
  max-width: 720px;
}

.evidence-hero-copy > p:not(.eyebrow) {
  max-width: 690px;
  color: #dce8f8;
}

.evidence-media {
  margin: 0;
  overflow: hidden;
  background: var(--silver-panel);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.evidence-media img {
  display: block;
  width: 100%;
  height: auto;
}

.evidence-media figcaption {
  padding: 14px 16px;
  color: var(--charcoal);
  background: var(--white);
  font-size: 0.92rem;
  line-height: 1.55;
}

.evidence-label {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 6px 10px;
  color: var(--navy);
  background: #dff8ff;
  border: 1px solid rgba(20, 120, 255, 0.3);
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1;
  text-transform: uppercase;
}

.status-section,
.journal-section,
.evidence-section {
  background: var(--silver-panel);
}

.development-rail {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 10px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.development-rail li {
  min-height: 118px;
  padding: 18px 14px;
  background: var(--white);
  border: 1px solid var(--silver-line);
  border-top: 5px solid var(--silver-line);
  border-radius: 8px;
}

.development-rail .stage-state {
  display: block;
  margin-bottom: 10px;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.development-rail .stage-name {
  display: block;
  color: var(--charcoal);
  font-weight: 800;
  line-height: 1.3;
}

.development-rail .is-complete {
  border-top-color: var(--blue);
}

.development-rail .is-complete .stage-state {
  color: var(--accent-text);
}

.development-rail .is-current {
  background: var(--navy);
  border-color: var(--cyan);
  border-top-color: var(--cyan);
}

.development-rail .is-current .stage-state {
  color: var(--cyan);
}

.development-rail .is-current .stage-name {
  color: var(--white);
}

.development-rail .is-pending {
  border-top-color: var(--silver-line);
}

.evidence-feature {
  padding: 88px 0;
}

.evidence-grid,
.truth-split,
.product-ledger-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.evidence-panel,
.ledger-card,
.journal-list li,
.evidence-process li {
  padding: 24px;
  background: var(--white);
  border: 1px solid var(--silver-line);
  border-radius: var(--radius);
}

.evidence-panel h3,
.ledger-card h3,
.journal-list h3 {
  margin-top: 12px;
  color: var(--navy);
}

.evidence-panel ul,
.ledger-card ul {
  margin-bottom: 0;
}

.evidence-panel.pending {
  background: #eef1f4;
}

.journal-list,
.evidence-process {
  display: grid;
  gap: 16px;
  margin: 28px 0 0;
  padding: 0;
  list-style: none;
}

.journal-list time {
  display: block;
  color: var(--accent-text);
  font-weight: 800;
}

.journal-meta {
  color: var(--muted);
  font-size: 0.9rem;
}

.product-ledger-grid {
  margin-top: 32px;
}

.ledger-card.active {
  border-top: 5px solid var(--cyan);
}

.ledger-card.planned {
  background: #eef1f4;
}

.dossier-grid {
  align-items: start;
  padding: 88px 0;
}

.dossier-stack {
  display: grid;
  gap: 24px;
}

.decision-list {
  display: grid;
  gap: 12px;
  padding-left: 20px;
}

.availability-note {
  padding: 14px 16px;
  color: var(--navy);
  background: #dff8ff;
  border-left: 4px solid var(--cyan);
  font-weight: 700;
}

.evidence-process {
  grid-template-columns: repeat(4, minmax(0, 1fr));
  counter-reset: evidence-step;
}

.evidence-process li {
  counter-increment: evidence-step;
}

.evidence-process li::before {
  content: counter(evidence-step, decimal-leading-zero);
  display: block;
  margin-bottom: 12px;
  color: var(--accent-text);
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

/* Evidence Ledger responsive */
@media (max-width: 900px) {
  .evidence-hero-inner,
  .evidence-feature,
  .dossier-grid,
  .truth-split,
  .product-ledger-grid {
    grid-template-columns: 1fr;
  }

  .evidence-hero-inner {
    padding: 72px 0;
  }

  .development-rail {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .evidence-process {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .evidence-hero-inner,
  .evidence-feature,
  .dossier-grid {
    width: min(100% - 32px, 1320px);
  }

  .development-rail,
  .evidence-grid,
  .truth-split,
  .product-ledger-grid,
  .evidence-process {
    grid-template-columns: 1fr;
  }

  .development-rail li {
    min-height: 0;
  }
}
```

- [ ] **Step 4: Run the CSS test and check the stylesheet**

Run:

```powershell
node --test tests/evidence-ledger-css.test.mjs
git diff --check -- style.css tests/evidence-ledger-css.test.mjs
```

Expected: 2 tests pass and no whitespace errors.

- [ ] **Step 5: Commit the shared component system**

Run:

```powershell
git add -- style.css tests/evidence-ledger-css.test.mjs
git diff --cached --name-status
git commit -m "style: add evidence-ledger component system"
```

Expected staged list: only `style.css` and `tests/evidence-ledger-css.test.mjs`.

---

### Task 3: Rebuild the homepage around current evidence

**Files:**

- Create: `tests/evidence-ledger-home.test.mjs`
- Modify: `index.html:5-183`

**Interfaces:**

- Consumes: shared Evidence Ledger CSS and `assets/products/his-ca-001a/his-ca-001a-rev-a-cad-work-in-progress.png`.
- Produces: homepage implementation of the seven-stage rail, featured evidence card, dated journal, and evidence-label language reused conceptually by later pages.

- [ ] **Step 1: Write the failing homepage truth test**

Create `tests/evidence-ledger-home.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the homepage test and verify the red state**

Run:

```powershell
node --test tests/evidence-ledger-home.test.mjs
```

Expected: FAIL on the new evidence hierarchy and current-stage assertions.

- [ ] **Step 3: Update the homepage metadata and hero**

Set the `<title>` and description to:

```html
<title>Hall Integrated Systems | Automotive Product Development Evidence</title>
<meta name="description" content="Follow Hall Integrated Systems automotive hardware development through documented design decisions, CAD work, prototype printing, fit evaluation, and revision.">
```

Replace the current hero with:

```html
<section class="evidence-hero">
  <div class="evidence-hero-inner">
    <div class="evidence-hero-copy">
      <p class="eyebrow">Automotive product development</p>
      <h1>Automotive hardware, documented as it develops.</h1>
      <p>Hall Integrated Systems develops original car-audio and 12V installation hardware, showing what is verified now and what still requires CAD, printing, fit review, and revision.</p>
      <div class="button-row">
        <a class="button button-primary" href="products/his-ca-001a-cable-comb.html">Review HIS-CA-001A evidence</a>
        <a class="button button-secondary" href="design-fabrication.html">See the development process</a>
      </div>
    </div>
    <figure class="evidence-media">
      <img src="assets/products/website-photo-edits/his-amplifier-drawer-primary-retouched-v2.jpg" width="1672" height="939" alt="Top view of a photographed amplifier and DSP mounting prototype on an aluminum panel.">
      <figcaption><span class="evidence-label">Photographed prototype</span> AI-assisted retouch of a real mounting prototype. The original photograph remains the dimensional reference.</figcaption>
    </figure>
  </div>
</section>
```

- [ ] **Step 4: Add the seven-stage current-status section**

Insert immediately after the hero:

```html
<section class="section status-section" aria-labelledby="current-status-heading">
  <div class="section-heading align-left">
    <p class="eyebrow">Current development status</p>
    <h2 id="current-status-heading">HIS-CA-001A is in CAD development.</h2>
    <p>Commercial CAD access is established and the REV-A working decisions are documented. A complete matching model, prototype print, and validation evidence remain pending.</p>
  </div>
  <ol class="development-rail" aria-label="HIS-CA-001A development stages">
    <li class="is-complete"><span class="stage-state">Complete</span><span class="stage-name">Concept defined</span></li>
    <li class="is-complete"><span class="stage-state">Complete</span><span class="stage-name">Design decision complete</span></li>
    <li class="is-current" aria-current="step"><span class="stage-state">Current</span><span class="stage-name">CAD in progress</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Prototype printed</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Fit evaluation complete</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Revision underway</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Small-batch preparation</span></li>
  </ol>
</section>
```

- [ ] **Step 5: Add the featured evidence record**

Insert after the status section:

```html
<section class="evidence-section" aria-labelledby="featured-evidence-heading">
  <div class="evidence-feature">
    <div>
      <p class="eyebrow">Featured product evidence</p>
      <h2 id="featured-evidence-heading">HIS-CA-001A 4-Wire Speaker Cable Comb</h2>
      <p>A working product direction for organized speaker-wire routing on automotive amplifier racks and installation panels.</p>
      <p><span class="evidence-label">CAD in progress</span></p>
      <div class="truth-split">
        <article class="evidence-panel">
          <h3>Verified now</h3>
          <ul>
            <li>Concept and automotive use case defined</li>
            <li>REV-A working decision documented August 3, 2026</li>
            <li>Commercial CAD access established</li>
            <li>CAD modeling activity documented</li>
          </ul>
        </article>
        <article class="evidence-panel pending">
          <h3>Pending evidence</h3>
          <ul>
            <li>Current REV-A geometry confirmed</li>
            <li>Representative coupon and complete prototype printed</li>
            <li>Fit, vibration, pull, and serviceability checks completed</li>
            <li>Revision outcome and small-batch preparation documented</li>
          </ul>
        </article>
      </div>
      <p><a class="text-link" href="products/his-ca-001a-cable-comb.html">Open the HIS-CA-001A evidence dossier</a></p>
    </div>
    <figure class="evidence-media">
      <img src="assets/products/his-ca-001a/his-ca-001a-rev-a-cad-work-in-progress.png" width="1280" height="720" loading="lazy" decoding="async" alt="CAD work-in-progress view of a four-channel HIS-CA-001A cable-comb model with two countersunk face holes.">
      <figcaption><span class="evidence-label">CAD work in progress</span> The visible model confirms CAD activity; it does not prove that the documented REV-A retention and mounting decisions are complete.</figcaption>
    </figure>
  </div>
</section>
```

- [ ] **Step 6: Add the dated journal and installation context**

Insert after the featured evidence record:

```html
<section class="section journal-section" aria-labelledby="journal-heading">
  <div class="section-heading align-left">
    <p class="eyebrow">Development journal</p>
    <h2 id="journal-heading">Dated evidence, not projected milestones.</h2>
  </div>
  <ol class="journal-list">
    <li>
      <time datetime="2026-08-06">August 6, 2026</time>
      <h3>CAD work-in-progress capture archived</h3>
      <p>CAD work-in-progress capture recorded August 6, 2026. The image documents modeling activity while the documented retention and mounting decisions remain under review.</p>
      <p class="journal-meta">Evidence type: CAD capture</p>
    </li>
    <li>
      <time datetime="2026-08-03">August 3, 2026</time>
      <h3>REV-A working design decision documented</h3>
      <p>The working direction retained four open top-loading channels, replaceable zip-tie retention, and a countersunk M4 mounting direction. Dimensions and physical validation remain pending.</p>
      <p class="journal-meta">Evidence type: design decision</p>
    </li>
  </ol>
</section>

<section class="section" aria-labelledby="installation-context-heading">
  <div class="section-heading align-left">
    <p class="eyebrow">Installation context</p>
    <h2 id="installation-context-heading">Real hardware informs the product work.</h2>
    <p>Photographed automotive audio work documents the packaging, routing, access, and mounting constraints behind Hall Integrated Systems product concepts.</p>
  </div>
  <div class="evidence-grid">
    <figure class="evidence-media">
      <img src="assets/products/website-photo-edits/his-amplifier-drawer-angle-retouched-v2.jpg" width="900" height="1599" loading="lazy" decoding="async" alt="Three-quarter view of a photographed amplifier and DSP mounting prototype on a workbench.">
      <figcaption><span class="evidence-label">Photographed prototype</span> AI-assisted retouch of a real mounting prototype from a supporting workbench angle.</figcaption>
    </figure>
    <figure class="evidence-media">
      <img src="assets/products/website-photo-edits/his-rear-deck-subwoofer-installed-retouched.jpg" width="1672" height="941" loading="lazy" decoding="async" alt="Close view of a subwoofer prototype installed beneath a vehicle rear deck.">
      <figcaption><span class="evidence-label">Installed reference</span> Retouched photograph documenting packaging, access, and mounting constraints.</figcaption>
    </figure>
  </div>
</section>
```

- [ ] **Step 7: Replace the closing call to action**

Use:

```html
<section class="cta-band">
  <div>
    <p class="eyebrow">Development inquiry</p>
    <h2>Questions about the evidence or product direction?</h2>
    <p>Use the general contact form to ask about documented status, pending validation, or Hall Integrated Systems automotive hardware development.</p>
  </div>
  <a class="button button-primary" href="contact.html">Contact Hall Integrated Systems</a>
</section>
```

- [ ] **Step 8: Run the homepage tests and commit**

Run:

```powershell
node --test tests/evidence-ledger-home.test.mjs tests/evidence-ledger-css.test.mjs tests/evidence-ledger-assets.test.mjs
git diff --check -- index.html tests/evidence-ledger-home.test.mjs
git add -- index.html tests/evidence-ledger-home.test.mjs
git diff --cached --name-status
git commit -m "feat: make homepage evidence-led"
```

Expected: 8 tests pass; staged list contains only the homepage and its test.

---

### Task 4: Convert Products & Prototypes into a development queue

**Files:**

- Create: `tests/evidence-ledger-products.test.mjs`
- Modify: `products.html:5-258`

**Interfaces:**

- Consumes: shared status, evidence, and ledger classes.
- Produces: one active HIS-CA-001A record and five explicitly planned product records without fabricated diagrams or finished-inventory presentation.

- [ ] **Step 1: Write the failing products-index test**

Create `tests/evidence-ledger-products.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { assertContainsInOrder, readText } from "./site-fixture.mjs";

const html = readText("products.html");

test("products page is a development queue", () => {
  assertContainsInOrder(html, [
    "Product development queue",
    "Active product record",
    "HIS-CA-001A",
    "Planned product directions",
    "HIS-CA-002A",
    "HIS-CA-006A"
  ]);
});

test("only HIS-CA-001A is shown in CAD progress", () => {
  assert.equal((html.match(/CAD in progress/g) || []).length, 1);
  assert.equal((html.match(/Planned concept/g) || []).length, 5);
});

test("products page removes fabricated diagrams and current-proof misuse", () => {
  assert.doesNotMatch(html, /<svg\b/i);
  assert.doesNotMatch(html, /category-diagram|schematic-card/);
  assert.doesNotMatch(html, /UPSCALED_HIS-CA-001A_AIConcept_03_FinalDirection_ProductShot\.png/);
  assert.match(html, /his-ca-001a-rev-a-cad-work-in-progress\.png/);
});
```

- [ ] **Step 2: Run the products test and verify the red state**

Run:

```powershell
node --test tests/evidence-ledger-products.test.mjs
```

Expected: FAIL because the page is still catalog-like and contains inline SVG diagrams.

- [ ] **Step 3: Replace the page hero and development-truth introduction**

Set the metadata to:

```html
<title>Products &amp; Prototypes | Hall Integrated Systems Development Queue</title>
<meta name="description" content="Review the Hall Integrated Systems automotive hardware development queue, current HIS-CA-001A evidence, and the proof still required for planned product concepts.">
```

Use this page hero and introduction:

```html
<section class="page-hero">
  <p class="eyebrow">Product development queue</p>
  <h1>Automotive hardware organized by evidence stage.</h1>
  <p>Hall Integrated Systems is developing company-owned car-audio and 12V installation hardware. Every record below separates current evidence from the proof still required.</p>
</section>

<section class="section two-column">
  <article>
    <p class="eyebrow">How to read this page</p>
    <h2>Progress is attached to evidence.</h2>
    <p>A product advances only when the corresponding design, CAD, print, fit, revision, or preparation record exists.</p>
  </article>
  <article class="technical-card">
    <h2>Current boundary</h2>
    <p>Commercial CAD access is established. HIS-CA-001A is in CAD development; no listed product is presented as printed, validated, available, or production-ready.</p>
  </article>
</section>
```

- [ ] **Step 4: Replace the featured product with the active evidence record**

Use:

```html
<section class="section evidence-section" aria-labelledby="active-product-heading">
  <div class="section-heading align-left">
    <p class="eyebrow">Active product record</p>
    <h2 id="active-product-heading">HIS-CA-001A 4-Wire Speaker Cable Comb</h2>
  </div>
  <article class="evidence-feature">
    <div>
      <p><span class="evidence-label">CAD in progress</span></p>
      <p>Working automotive speaker-wire routing concept with a documented REV-A decision and CAD activity. A matching completed model and physical validation remain pending.</p>
      <div class="evidence-grid">
        <article class="evidence-panel">
          <h3>Evidence available</h3>
          <ul>
            <li>Concept and use case defined</li>
            <li>REV-A working decision dated August 3, 2026</li>
            <li>CAD work-in-progress capture dated August 6, 2026</li>
          </ul>
        </article>
        <article class="evidence-panel pending">
          <h3>Next required proof</h3>
          <ul>
            <li>Current REV-A geometry confirmed</li>
            <li>Coupon and complete prototype printed</li>
            <li>Fit and retention checks documented</li>
          </ul>
        </article>
      </div>
      <p><a class="button button-primary" href="products/his-ca-001a-cable-comb.html">Review product evidence</a></p>
    </div>
    <figure class="evidence-media">
      <img src="assets/products/his-ca-001a/his-ca-001a-rev-a-cad-work-in-progress.png" width="1280" height="720" loading="lazy" decoding="async" alt="CAD work-in-progress view of a four-channel HIS-CA-001A cable-comb model with two countersunk face holes.">
      <figcaption><span class="evidence-label">CAD work in progress</span> Modeling activity only; documented retention and mounting decisions are not yet proven complete.</figcaption>
    </figure>
  </article>
</section>
```

- [ ] **Step 5: Replace visual category diagrams with the text-led planned queue**

Use:

```html
<section class="section" aria-labelledby="planned-products-heading">
  <div class="section-heading align-left">
    <p class="eyebrow">Planned product directions</p>
    <h2 id="planned-products-heading">Queued concepts, not finished inventory.</h2>
    <p>These records identify intended automotive hardware directions. They do not claim completed CAD, prototype prints, testing, or availability.</p>
  </div>
  <div class="product-ledger-grid">
    <article class="ledger-card planned">
      <span class="evidence-label">Planned concept</span>
      <h3>HIS-CA-002A</h3>
      <p>Universal Wire Routing Clip</p>
      <p><strong>Next required proof:</strong> concept decision and dimensional inputs.</p>
    </article>
    <article class="ledger-card planned">
      <span class="evidence-label">Planned concept</span>
      <h3>HIS-CA-003A</h3>
      <p>6.5-Inch Speaker Spacer Ring</p>
      <p><strong>Next required proof:</strong> vehicle and speaker fitment references.</p>
    </article>
    <article class="ledger-card planned">
      <span class="evidence-label">Planned concept</span>
      <h3>HIS-CA-004A</h3>
      <p>Fuse Holder Mount Base</p>
      <p><strong>Next required proof:</strong> component envelope and mounting decision.</p>
    </article>
    <article class="ledger-card planned">
      <span class="evidence-label">Planned concept</span>
      <h3>HIS-CA-005A</h3>
      <p>Universal DSP Mount Platform</p>
      <p><strong>Next required proof:</strong> supported-device and access constraints.</p>
    </article>
    <article class="ledger-card planned">
      <span class="evidence-label">Planned concept</span>
      <h3>HIS-CA-006A</h3>
      <p>Amplifier Standoff Kit</p>
      <p><strong>Next required proof:</strong> load, hardware, and installation-clearance inputs.</p>
    </article>
  </div>
</section>
```

- [ ] **Step 6: Add the shared seven-stage vocabulary and inquiry band**

Insert:

```html
<section class="section status-section" aria-labelledby="queue-status-heading">
  <div class="section-heading align-left">
    <p class="eyebrow">Active-product stages</p>
    <h2 id="queue-status-heading">HIS-CA-001A is the only active CAD record.</h2>
  </div>
  <ol class="development-rail" aria-label="HIS-CA-001A development stages">
    <li class="is-complete"><span class="stage-state">Complete</span><span class="stage-name">Concept defined</span></li>
    <li class="is-complete"><span class="stage-state">Complete</span><span class="stage-name">Design decision complete</span></li>
    <li class="is-current" aria-current="step"><span class="stage-state">Current</span><span class="stage-name">CAD in progress</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Prototype printed</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Fit evaluation complete</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Revision underway</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Small-batch preparation</span></li>
  </ol>
</section>

<section class="cta-band">
  <div>
    <p class="eyebrow">Product information</p>
    <h2>Questions about a development record?</h2>
    <p>Contact Hall Integrated Systems for general information about documented status or planned automotive hardware directions.</p>
  </div>
  <a class="button button-primary" href="contact.html">Contact Hall Integrated Systems</a>
</section>
```

- [ ] **Step 7: Run the products tests and commit**

Run:

```powershell
node --test tests/evidence-ledger-products.test.mjs
git diff --check -- products.html tests/evidence-ledger-products.test.mjs
git add -- products.html tests/evidence-ledger-products.test.mjs
git diff --cached --name-status
git commit -m "feat: turn products page into evidence queue"
```

Expected: 3 tests pass; no `<svg>` remains in `products.html`.

---

### Task 5: Rebuild HIS-CA-001A as an evidence dossier

**Files:**

- Create: `tests/evidence-ledger-product-detail.test.mjs`
- Modify: `products/his-ca-001a-cable-comb.html:5-124`

**Interfaces:**

- Consumes: public CAD derivative, status rail, evidence panels, and journal/evidence label styles.
- Produces: the authoritative public product status record for HIS-CA-001A.

- [ ] **Step 1: Write the failing dossier test**

Create `tests/evidence-ledger-product-detail.test.mjs`:

```js
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

test("product page separates verified and pending evidence", () => {
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
```

- [ ] **Step 2: Run the dossier test and verify the red state**

Run:

```powershell
node --test tests/evidence-ledger-product-detail.test.mjs
```

Expected: FAIL on current revision, licensing, status rail, and evidence separation.

- [ ] **Step 3: Replace the page hero and dossier summary**

Set the metadata to:

```html
<title>HIS-CA-001A Evidence Dossier | Hall Integrated Systems</title>
<meta name="description" content="Review documented HIS-CA-001A design decisions, CAD work-in-progress evidence, current development status, and pending prototype validation gates.">
```

Use this page hero and dossier summary:

```html
<section class="page-hero">
  <p class="eyebrow">HIS-CA-001A · Product evidence dossier</p>
  <h1>4-Wire Speaker Cable Comb</h1>
  <p>A working automotive cable-management product direction for organized 14–16 AWG speaker-wire routing on amplifier racks and installation panels.</p>
</section>

<section class="section evidence-section">
  <div class="dossier-grid">
    <article class="dossier-stack">
      <div>
        <span class="evidence-label">CAD in progress</span>
        <h2>Current product record</h2>
        <p><strong>Current working revision: REV-A.</strong> The working design decision was documented August 3, 2026. Commercial CAD access is established and modeling activity is documented.</p>
        <p class="availability-note">This in-development product is not available for sale.</p>
      </div>
      <div class="truth-split">
        <article class="evidence-panel">
          <h3>Verified now</h3>
          <ul>
            <li>Automotive wire-routing problem and four-channel concept defined</li>
            <li>REV-A working decision documented</li>
            <li>Commercial CAD access established</li>
            <li>CAD work-in-progress capture archived</li>
          </ul>
        </article>
        <article class="evidence-panel pending">
          <h3>Pending evidence</h3>
          <ul>
            <li>Critical cable, zip-tie, screw-head, mounting-depth, and access measurements frozen</li>
            <li>Current REV-A geometry confirmed</li>
            <li>Representative coupon and complete prototype printed</li>
            <li>Fit, vibration, pull, and serviceability checks completed</li>
          </ul>
        </article>
      </div>
    </article>
    <figure class="evidence-media">
      <img src="../assets/products/his-ca-001a/his-ca-001a-rev-a-cad-work-in-progress.png" width="1280" height="720" alt="CAD work-in-progress view of a four-channel HIS-CA-001A cable-comb model with two countersunk face holes.">
      <figcaption><span class="evidence-label">CAD work in progress</span> The visible model confirms CAD activity; it does not prove that the documented REV-A retention and mounting decisions are complete.</figcaption>
    </figure>
  </div>
</section>
```

- [ ] **Step 4: Add the seven-stage dossier status rail**

Use:

```html
<section class="section status-section" aria-labelledby="dossier-status-heading">
  <div class="section-heading align-left">
    <p class="eyebrow">Development gates</p>
    <h2 id="dossier-status-heading">Current stage: CAD in progress.</h2>
  </div>
  <ol class="development-rail" aria-label="HIS-CA-001A development stages">
    <li class="is-complete"><span class="stage-state">Complete</span><span class="stage-name">Concept defined</span></li>
    <li class="is-complete"><span class="stage-state">Complete</span><span class="stage-name">Design decision complete</span></li>
    <li class="is-current" aria-current="step"><span class="stage-state">Current</span><span class="stage-name">CAD in progress</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Prototype printed</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Fit evaluation complete</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Revision underway</span></li>
    <li class="is-pending"><span class="stage-state">Pending</span><span class="stage-name">Small-batch preparation</span></li>
  </ol>
</section>
```

- [ ] **Step 5: Add the revision record**

Use:

```html
<section class="section" aria-labelledby="revision-record-heading">
  <div class="section-heading align-left">
    <p class="eyebrow">Revision record</p>
    <h2 id="revision-record-heading">REV-A working decision · August 3, 2026</h2>
    <p>This record documents the intended direction. It is not verified performance evidence.</p>
  </div>
  <div class="evidence-grid">
    <article class="evidence-panel">
      <h3>Retained for REV-A</h3>
      <ul class="decision-list">
        <li>Four open, top-loading U-channels</li>
        <li>Replaceable zip-tie retention through two body slots</li>
        <li>Top-to-bottom M4 × 18 countersunk mounting screw direction</li>
        <li>PETG as the prototype material direction</li>
      </ul>
    </article>
    <article class="evidence-panel pending">
      <h3>Deferred or not frozen</h3>
      <ul class="decision-list">
        <li>Snap-throat retention reserved for REV-B</li>
        <li>Removable cap reserved for REV-C</li>
        <li>Dimensions: Not frozen</li>
        <li>Physical performance and serviceability: not validated</li>
      </ul>
    </article>
  </div>
</section>
```

- [ ] **Step 6: Add the evidence ledger**

Use:

```html
<section class="section journal-section" aria-labelledby="evidence-ledger-heading">
  <div class="section-heading align-left">
    <p class="eyebrow">Evidence ledger</p>
    <h2 id="evidence-ledger-heading">What each artifact can prove.</h2>
  </div>
  <div class="evidence-grid">
    <article class="evidence-panel">
      <span class="evidence-label">Design decision</span>
      <h3>REV-A direction</h3>
      <p>Proves the working feature decision and deferred concepts. It does not prove dimensions, fit, retention, or serviceability.</p>
    </article>
    <article class="evidence-panel">
      <span class="evidence-label">CAD evidence</span>
      <h3>Modeling activity</h3>
      <p>The August 6 capture proves CAD activity. Its visible geometry does not yet prove completion of the documented REV-A decisions.</p>
    </article>
    <article class="evidence-panel pending">
      <span class="evidence-label">Pending evidence</span>
      <h3>Prototype and tests</h3>
      <p>No physical prototype photograph or completed fit, vibration, pull, and serviceability record is available at this stage.</p>
    </article>
    <article class="evidence-panel">
      <span class="evidence-label">Historical AI concept</span>
      <h3>Earlier visual direction</h3>
      <figure class="evidence-media">
        <img src="../assets/products/his-ca-001a/UPSCALED_HIS-CA-001A_AIConcept_03_FinalDirection_ProductShot.png" loading="lazy" decoding="async" alt="Historical AI-assisted cable-comb concept shown only as an earlier visual direction.">
        <figcaption>AI-assisted historical concept. This image is not current geometry, a CAD record, or a photograph of a manufactured part.</figcaption>
      </figure>
    </article>
  </div>
</section>
```

- [ ] **Step 7: Add the inquiry band**

Use:

```html
<section class="cta-band">
  <div>
    <p class="eyebrow">Development inquiry</p>
    <h2>Questions about HIS-CA-001A evidence?</h2>
    <p>Use the general contact form to ask about documented progress or pending validation. The product is not available for sale.</p>
  </div>
  <a class="button button-primary" href="../contact.html">Contact Hall Integrated Systems</a>
</section>
```

- [ ] **Step 8: Run the dossier tests and commit**

Run:

```powershell
node --test tests/evidence-ledger-product-detail.test.mjs
git diff --check -- products/his-ca-001a-cable-comb.html tests/evidence-ledger-product-detail.test.mjs
git add -- products/his-ca-001a-cable-comb.html tests/evidence-ledger-product-detail.test.mjs
git diff --cached --name-status
git commit -m "feat: build HIS-CA-001A evidence dossier"
```

Expected: 4 tests pass; staged list contains only the product page and its test.

---

### Task 6: Align Design & Fabrication and About with the evidence model

**Files:**

- Create: `tests/evidence-ledger-supporting-pages.test.mjs`
- Modify: `design-fabrication.html:37-165`
- Modify: `about.html:37-81`

**Interfaces:**

- Consumes: `.evidence-process`, evidence labels, bounded commercial-CAD wording, and the seven development gates.
- Produces: a semantic eight-step product-development process and current About milestone without decorative process art.

- [ ] **Step 1: Write the failing supporting-page test**

Create `tests/evidence-ledger-supporting-pages.test.mjs`:

```js
import assert from "node:assert/strict";
import test from "node:test";
import { assertContainsInOrder, readText } from "./site-fixture.mjs";

const design = readText("design-fabrication.html");
const about = readText("about.html");

test("Design & Fabrication presents the eight evidence gates", () => {
  assertContainsInOrder(design, [
    "Define the installation problem",
    "Document a working design decision",
    "Build and inspect the CAD model",
    "Measure critical interfaces and print a representative coupon",
    "Print the complete prototype",
    "Evaluate fit, retention, vibration, pull, access, and serviceability",
    "Record revision decisions",
    "Prepare for a small batch"
  ]);
});

test("Design & Fabrication removes decorative process art and outside-service positioning", () => {
  assert.doesNotMatch(design, /process-visual-grid|process-node|process-line/);
  assert.match(design, /own product pipeline/i);
  assert.doesNotMatch(design, /contract manufacturing services|client CAD services/i);
});

test("About states the current licensing and product milestone", () => {
  assert.match(about, /Commercial CAD access established/);
  assert.match(about, /CAD modeling is in progress/);
  assert.match(about, /prototype print and validation remain pending/);
  assert.doesNotMatch(about, /holding CAD|proper commercial software licensing is in place/i);
});
```

- [ ] **Step 2: Run the supporting-page test and verify the red state**

Run:

```powershell
node --test tests/evidence-ledger-supporting-pages.test.mjs
```

Expected: FAIL on the eight gates, process-art removal, and current licensing milestone.

- [ ] **Step 3: Replace the decorative process visual with semantic evidence gates**

Remove the existing `.process-visual-section` block from `design-fabrication.html`. Insert:

```html
<section class="section" aria-labelledby="evidence-process-heading">
  <div class="section-heading align-left">
    <p class="eyebrow">Company-owned development process</p>
    <h2 id="evidence-process-heading">A product advances when the next proof exists.</h2>
    <p>Hall Integrated Systems uses this workflow for its own automotive hardware pipeline. Each gate records what changed and what remains unverified.</p>
  </div>
  <ol class="evidence-process">
    <li><strong>Define the installation problem</strong><p>Record the automotive packaging, routing, access, or mounting constraint.</p></li>
    <li><strong>Document a working design decision</strong><p>Choose the current direction and state what has been deferred.</p></li>
    <li><strong>Build and inspect the CAD model</strong><p>Compare visible geometry with the documented decision before calling the model complete.</p></li>
    <li><strong>Measure critical interfaces and print a representative coupon</strong><p>Check cable, fastener, mounting-depth, clearance, and access inputs before the complete part.</p></li>
    <li><strong>Print the complete prototype</strong><p>Document the actual material, print orientation, and resulting physical part.</p></li>
    <li><strong>Evaluate fit, retention, vibration, pull, access, and serviceability</strong><p>Record only the checks that are actually performed and the conditions used.</p></li>
    <li><strong>Record revision decisions</strong><p>Connect observed results to retained, changed, or deferred features.</p></li>
    <li><strong>Prepare for a small batch</strong><p>Begin preparation only after the relevant design and validation evidence exists.</p></li>
  </ol>
</section>
```

- [ ] **Step 4: Update Design & Fabrication status copy**

Replace statements that globally say CAD models and prototype prints are pending with:

```html
<p>Commercial CAD access is established and HIS-CA-001A modeling is in progress. Current matching geometry, prototype printing, and physical validation remain pending.</p>
```

Keep the photographed-prototype sections and their current AI-retouch disclosures. Keep the page focused on the company’s own product pipeline.

- [ ] **Step 5: Update the About hero note and printer-moment milestone**

Replace the hero note with:

```html
<p class="hero-visual-note">Commercial CAD access established; HIS-CA-001A CAD modeling is in progress; prototype print and validation remain pending.</p>
```

Replace the licensing-pending paragraph with:

```html
<p>I acquired the company’s first 3D printer, a QIDI Plus4, on July 21, 2026. Commercial CAD access established the next part of the company-owned development workflow. HIS-CA-001A’s REV-A working decision is documented and CAD modeling is in progress; the representative coupon, complete prototype print, dimensional review, fit evaluation, revision outcome, and small-batch preparation remain pending.</p>
```

- [ ] **Step 6: Run supporting-page tests and commit**

Run:

```powershell
node --test tests/evidence-ledger-supporting-pages.test.mjs
git diff --check -- design-fabrication.html about.html tests/evidence-ledger-supporting-pages.test.mjs
git add -- design-fabrication.html about.html tests/evidence-ledger-supporting-pages.test.mjs
git diff --cached --name-status
git commit -m "feat: align development story with evidence gates"
```

Expected: 3 tests pass; staged list contains only the two pages and their test.

---

### Task 7: Add cross-route truth and preservation tests

**Files:**

- Create: `tests/evidence-ledger-global.test.mjs`
- Modify only if a test exposes a real issue: `index.html`, `products.html`, `products/his-ca-001a-cable-comb.html`, `design-fabrication.html`, or `about.html`

**Interfaces:**

- Consumes: all public HTML routes and the approved truth vocabulary.
- Produces: one regression suite that protects analytics, navigation, automotive scope, stale-copy removal, and preserved static infrastructure.

- [ ] **Step 1: Write the global regression test**

Create `tests/evidence-ledger-global.test.mjs`:

```js
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
  "Wi-Fi/router troubleshooting",
  "computer support"
];

test("all existing HTML routes preserve the public Clarity ID", () => {
  for (const route of routes) {
    assert.match(readText(route), /xa3uw9a04d/, `${route} lost the Clarity ID`);
  }
});

test("refreshed routes contain no stale licensing blocker", () => {
  for (const route of refreshedRoutes) {
    const html = readText(route);
    assert.doesNotMatch(html, /licensing pending|proper commercial software licensing|proper commercial Autodesk Fusion access/i, route);
  }
});

test("public routes stay within automotive scope", () => {
  for (const route of routes) {
    const html = readText(route);
    for (const topic of forbiddenTopics) {
      assert.ok(!html.toLowerCase().includes(topic.toLowerCase()), `${route} contains forbidden topic: ${topic}`);
    }
  }
});

test("primary navigation relationships remain present", () => {
  const expectedLabels = [
    "Home",
    "Products &amp; Prototypes",
    "Design &amp; Fabrication",
    "About",
    "Contact"
  ];

  for (const route of routes) {
    const html = readText(route);
    for (const label of expectedLabels) {
      assert.ok(html.includes(label), `${route} is missing navigation label: ${label}`);
    }
  }
});

test("static hosting and contact files remain present", () => {
  assert.equal(readText("CNAME").trim(), "hallintegratedsystems.com");
  assert.match(readText("script.js"), /form-status/);
  assert.match(readText("script.js"), /contact_form_submit_success/);
  assert.match(readText("robots.txt"), /Sitemap:/);
  assert.match(readText("sitemap.xml"), /his-ca-001a-cable-comb/);
});
```

- [ ] **Step 2: Run the full Node test suite**

Run:

```powershell
node --test tests/*.test.mjs
```

Expected: all asset, CSS, homepage, products, dossier, supporting-page, and global tests pass.

- [ ] **Step 3: Confirm preserved files have no implementation diff**

Run:

```powershell
git diff 159a544 -- script.js contact.html privacy.html api CNAME robots.txt sitemap.html sitemap.xml
```

Expected: no output.

If a global test fails because an intended page lost a preserved value, correct only the page that failed and rerun the complete suite.

- [ ] **Step 4: Run syntax, whitespace, and staged-scope checks**

Run:

```powershell
node --check script.js
git diff --check
git status --short
```

Expected: JavaScript syntax exits 0, no whitespace errors, and only intentional implementation files plus the pre-existing unrelated untracked files appear.

- [ ] **Step 5: Commit the global regression suite**

Run:

```powershell
git add -- tests/evidence-ledger-global.test.mjs
git diff --cached --name-status
git commit -m "test: protect evidence-ledger truth boundaries"
```

Expected staged list: only `tests/evidence-ledger-global.test.mjs`, unless Step 3 required one narrowly scoped page correction.

---

### Task 8: Perform browser, responsive, accessibility, and route verification

**Files:**

- Modify only if verification exposes a defect: the exact HTML or CSS file responsible.
- Do not commit screenshots, temporary server files, or browser artifacts.

**Interfaces:**

- Consumes: completed static implementation, approved Evidence Ledger mock, and the in-app Browser.
- Produces: verified desktop/mobile presentation and an evidence-backed handoff; no deployment.

- [ ] **Step 1: Start a bounded hidden local server**

Run:

```powershell
$listener = Get-NetTCPConnection -LocalPort 8123 -State Listen -ErrorAction SilentlyContinue
if ($listener) { throw 'Port 8123 is already in use. Inspect the existing listener; do not stop an unknown process.' }
$siteServer = Start-Process -FilePath 'python' -ArgumentList '-m','http.server','8123','--directory','D:\DEV\SITE' -WindowStyle Hidden -PassThru
Set-Content -LiteralPath 'D:\DEV\SITE\tmp\evidence-ledger-server.pid' -Value $siteServer.Id
Get-Content -LiteralPath 'D:\DEV\SITE\tmp\evidence-ledger-server.pid'
```

The PID file is temporary and must not be staged.

- [ ] **Step 2: Verify every public route in the in-app Browser**

Open each route through the local server and confirm HTTP 200:

```text
/
/products.html
/products/his-ca-001a-cable-comb.html
/design-fabrication.html
/about.html
/contact.html
/privacy.html
/sitemap.html
/sitemap.xml
/robots.txt
```

Do not use Playwright CLI unless the user separately approves it. Use the in-app Browser chosen for this Product Design workflow.

- [ ] **Step 3: Compare the homepage to the approved visual**

Use the approved Option 1 reference:

```text
C:\Users\Tango\.codex\generated_images\019fd914-dfc1-77b2-8058-cdab089a6a21\call_9HoHB656uDZBFW2MEIcw6ifO.png
```

At a 1440-pixel desktop viewport, compare the reference and implementation together. Check:

```text
Evidence-first hierarchy
Navy/cyan/aluminum visual balance
Readable seven-stage rail
Dominant HIS-CA-001A evidence record
Compact journal
No fictional 2024 dates
No invented test, availability, or production claims
```

Fix visible spacing, crop, alignment, caption, contrast, or overflow defects in the responsible HTML/CSS file, then repeat the comparison.

- [ ] **Step 4: Verify mobile behavior**

At 390 × 844 and 320 × 800:

```text
No horizontal page scrolling
Navigation opens, closes, and updates aria-expanded
Status stages form one readable vertical sequence at 620 pixels and below
Evidence and truth panels stack in source order
Images preserve aspect ratio
Captions remain attached to their figures
Buttons remain visible and easy to activate
Focus indicators remain visible
```

Fix and recheck any defect.

- [ ] **Step 5: Verify keyboard and semantic behavior**

Using the Browser:

```text
Tab through header navigation and every primary action
Open and close the mobile navigation with the keyboard
Confirm aria-current="page" remains correct in navigation
Confirm aria-current="step" appears only on CAD in progress
Confirm each page has one descriptive h1
Confirm heading order does not skip levels
Confirm evidence state is readable without relying on color
Confirm all informative images have descriptive alt text and captions
```

- [ ] **Step 6: Verify contact behavior without sending**

On `contact.html`:

```text
Submit an empty form
Confirm browser-side validation identifies required fields
Confirm form-status announces the correction message
Do not submit a completed inquiry
```

Confirm the contact endpoint and `script.js` remain unchanged.

- [ ] **Step 7: Run the final automated verification**

Run fresh:

```powershell
node --test tests/*.test.mjs
node --check script.js
git diff --check
git diff 159a544 -- script.js contact.html privacy.html api CNAME robots.txt sitemap.html sitemap.xml
git status --short
```

Expected:

```text
All Node tests pass
script.js syntax check exits 0
No whitespace errors
No diff for preserved infrastructure files
Only intended implementation files and pre-existing unrelated untracked files are present
```

- [ ] **Step 8: Commit any verification fixes**

If Steps 3–6 required changes, stage only the exact corrected files and run:

```powershell
git diff --cached --check
git diff --cached --name-status
git commit -m "fix: resolve evidence-ledger visual QA findings"
```

If no fixes were required, do not create an empty commit.

- [ ] **Step 9: Stop only the recorded local server**

Run:

```powershell
$siteServerPid = [int](Get-Content -LiteralPath 'D:\DEV\SITE\tmp\evidence-ledger-server.pid')
Stop-Process -Id $siteServerPid
Remove-Item -LiteralPath 'D:\DEV\SITE\tmp\evidence-ledger-server.pid'
```

Confirm the process with that PID is no longer running.

- [ ] **Step 10: Prepare the local handoff**

Report:

```text
Local preview URL
Branch name
Commit list
Automated test count and result
Desktop and mobile viewports checked
Public routes checked
CAD derivative source and SHA-256
Preserved files confirmed unchanged
Known pending product evidence
Deployment status: not deployed
```

Do not push, open a pull request, deploy to Sites, or publish through GitHub Pages without a separate explicit user request.
