# Hall Integrated Systems Option 3 Site Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the selected Option 3 direction into a polished, responsive Hall Integrated Systems website that captures attention, invites product exploration, and preserves every existing evidence boundary.

**Architecture:** Keep the dependency-free static site: eight HTML routes share one CSS file and one JavaScript file, while the existing Azure contact endpoint and deployment workflow remain unchanged. Migrate the routes in layers—first shared contracts and tests, then the global visual system and homepage, then product and supporting pages—so each commit is independently reviewable.

**Tech Stack:** Semantic HTML5, CSS custom properties and responsive layout, browser-native JavaScript, Node's built-in test runner, local static HTTP server, Microsoft Clarity, Azure Static Web Apps.

**Spec:** `docs/superpowers/specs/2026-09-16-option-3-site-refresh-design.md`

## Global Constraints

- Preserve the automotive-only scope and all claim guardrails in `AGENTS.md`.
- Keep HIS-CA-001A at `CAD in progress`, stage 03 of 07, until new evidence exists.
- Never imply that the photographed amplifier/DSP reference is HIS-CA-001A.
- Label AI-assisted assets and planned directions visibly and accurately.
- Use only Arial, Helvetica, and system sans-serif fallbacks; add no frontend dependency, CDN, external font, or icon library.
- Preserve the existing route paths, contact form action, Clarity ID, `CNAME`, `robots.txt`, and Azure workflow.
- Keep one logical `h1` per page, semantic landmarks, useful alt text, visible focus, 44 px targets, narrow-screen reflow, and reduced-motion support.
- Update tests before the behavior or markup they protect, then run the focused test and confirm it fails for the expected reason.
- Commit after every task. Do not merge or deploy; `main` remains untouched until review.

---

## Task 1: Lock the approved content and shared-route contracts in tests

**Files:**
- Modify: `tests/evidence-ledger-global.test.mjs`
- Modify: `tests/evidence-ledger-home.test.mjs`
- Modify: `tests/evidence-ledger-supporting-pages.test.mjs`
- Create: `tests/site-integrity.test.mjs`

- [ ] **Step 1: Update the global navigation contract before editing HTML**

Change the expected primary navigation to the approved four-item model:

```js
const navigationItems = [
  ["Products", "products.html"],
  ["Development", "design-fabrication.html"],
  ["About", "about.html"],
  ["Contact", "contact.html"]
];
```

Expand the shared-shell assertion from the first five routes to all eight public HTML routes. Preserve the separate brand-home assertion so removing `Home` from the text navigation does not remove the homepage path.

- [ ] **Step 2: Add metadata contracts for every public HTML route**

Add assertions that each route contains:

```html
<link rel="canonical" href="https://hallintegratedsystems.com/...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta property="og:type" content="website">
<meta property="og:url" content="https://hallintegratedsystems.com/...">
<meta property="og:image" content="https://hallintegratedsystems.com/assets/his-product-lineup-banner_text_friendly.jpg">
```

Check that the canonical and `og:url` paths match the route, including `/products/his-ca-001a-cable-comb.html`.

- [ ] **Step 3: Replace the old homepage hierarchy contract with the approved Option 3 hierarchy**

Assert these sections appear in order:

```js
assertContainsInOrder(html, [
  '<section class="home-hero"',
  'aria-labelledby="products-taking-shape-heading"',
  'aria-labelledby="why-his-builds-heading"',
  'aria-labelledby="current-development-heading"',
  'aria-labelledby="founder-band-heading"',
  '<section class="cta-band"'
]);
```

Add exact assertions for:

- `ORIGINAL AUTOMOTIVE HARDWARE`
- `Solve the install. Build the part.`
- `Discover What We're Building`
- `Meet Hall Integrated Systems`
- `ACTIVE PRODUCT DEVELOPMENT`
- `HIS-CA-001A`
- `CAD IN PROGRESS`
- `STAGE 03 OF 07`
- exactly three product-direction articles
- one `Active development` label and two `Planned direction` labels
- a visible photographed-prototype/reference disclosure separate from the HIS-CA-001A status block

Keep the existing seven-stage status-rail and reviewed-CAD-derivative assertions.

- [ ] **Step 4: Update the About contract to remove equipment inventory from public copy**

Replace the test that requires `QIDI Plus4` and its purchase date with assertions that:

```js
assert.doesNotMatch(about, /QIDI Plus4|July 21, 2026/);
assert.match(milestone, /in-house prototyping capability/i);
assert.match(milestone, /Commercial CAD access established/);
assert.match(milestone, /CAD modeling is in progress/);
```

Keep the pending-evidence assertion unchanged.

- [ ] **Step 5: Add a static link and asset integrity test**

In `tests/site-integrity.test.mjs`, parse local `href`, `src`, and `srcset` references from every public HTML route. Ignore `http:`, `https:`, `mailto:`, `tel:`, fragment-only links, and form actions. Resolve route-relative references and assert each local target exists. Also assert every page contains exactly one `<h1>` and every non-empty `<img>` has non-empty `alt` text.

- [ ] **Step 6: Run the focused tests and confirm the expected red state**

Run:

```powershell
node --test tests/evidence-ledger-global.test.mjs tests/evidence-ledger-home.test.mjs tests/evidence-ledger-supporting-pages.test.mjs tests/site-integrity.test.mjs
```

Expected result: failures for the old navigation labels, missing Option 3 homepage structure, missing canonical/Open Graph metadata, and the old printer-model copy. The link-integrity portions should pass against the current routes.

- [ ] **Step 7: Commit the failing contracts**

```powershell
git add tests/evidence-ledger-global.test.mjs tests/evidence-ledger-home.test.mjs tests/evidence-ledger-supporting-pages.test.mjs tests/site-integrity.test.mjs
git commit -m "test: define option 3 site refresh contracts"
```

---

## Task 2: Build the shared visual system, header, footer, and metadata

**Files:**
- Modify: `style.css`
- Modify: `script.js`
- Modify: `index.html`
- Modify: `products.html`
- Modify: `products/his-ca-001a-cable-comb.html`
- Modify: `design-fabrication.html`
- Modify: `about.html`
- Modify: `contact.html`
- Modify: `privacy.html`
- Modify: `sitemap.html`

- [ ] **Step 1: Replace the accumulated stylesheet with one intentional system**

Define tokens at the top of `style.css` and rebuild the shared primitives around them:

```css
:root {
  --navy-950: #07111f;
  --navy-900: #0b1b30;
  --navy-800: #102744;
  --cobalt-600: #135dd8;
  --cobalt-500: #1f6ff2;
  --cyan-400: #41c7df;
  --silver-100: #f3f6f9;
  --silver-200: #e4eaf0;
  --slate-600: #536274;
  --ink-900: #111c29;
  --white: #ffffff;
  --content-width: 76.25rem;
  --radius: 0.5rem;
  --shadow-elevated: 0 1.5rem 4rem rgb(7 17 31 / 16%);
}
```

Use a small set of reusable structures: `.shell`, `.section`, `.section-heading`, `.eyebrow`, `.button`, `.button-primary`, `.button-secondary`, `.media-caption`, `.status-chip`, `.page-hero`, `.site-header`, `.site-footer`, and the evidence components retained by the existing product tests.

Preserve the selectors required by `tests/evidence-ledger-css.test.mjs`, but remove superseded duplicate rules once all routes use the new classes.

- [ ] **Step 2: Rebuild the shared header on every route**

Use the brand link as the homepage route and render only the four approved navigation labels. Apply `aria-current="page"` to the active text-navigation link. On the homepage, the brand carries `aria-current="page"` because `Home` is no longer a nav item.

Retain the button-based mobile toggle and its `aria-expanded`/`aria-controls` relationship. Make the open mobile panel a full-width dark surface below the sticky header.

- [ ] **Step 3: Rebuild the shared footer on every route**

Use a consistent company line, compact route links, and the required Privacy/Sitemap links. Keep the footer useful and restrained; avoid adding unsupported credibility claims.

- [ ] **Step 4: Add canonical and Open Graph metadata to every route**

Use absolute production URLs and the approved existing lineup image. Write route-specific titles and descriptions that accurately describe company, product, development, About, Contact, Privacy, and Sitemap content. Preserve the favicon, Apple touch icon, viewport, stylesheet, Clarity script, and route-relative script paths.

- [ ] **Step 5: Improve global navigation behavior without changing contact transport**

In `script.js`:

- close the mobile navigation on link activation, Escape, and viewport transition back to desktop;
- restore focus to the toggle after Escape;
- keep the current Clarity page events and contact form submission logic;
- do not call the contact API during local verification.

- [ ] **Step 6: Run global, CSS, and link-integrity tests**

```powershell
node --test tests/evidence-ledger-global.test.mjs tests/evidence-ledger-css.test.mjs tests/site-integrity.test.mjs
```

Expected result: global navigation, metadata, shell, asset paths, headings, and CSS contracts pass. Homepage content tests remain red until Task 3.

- [ ] **Step 7: Commit the shared system**

```powershell
git add style.css script.js index.html products.html products/his-ca-001a-cable-comb.html design-fabrication.html about.html contact.html privacy.html sitemap.html
git commit -m "feat: establish option 3 visual system"
```

---

## Task 3: Rebuild the homepage around product discovery

**Files:**
- Modify: `index.html`
- Modify: `style.css`
- Modify: `script.js`
- Modify: `tests/evidence-ledger-home.test.mjs`

- [ ] **Step 1: Implement the dark editorial hero**

Create `<section class="home-hero">` with a two-column layout. The DOM order must be copy, actions, development signal, and photographed reference so the mobile reading order remains logical.

Use the approved exact copy and links from the specification. Use:

```html
<img src="assets/products/website-photo-edits/his-amplifier-drawer-primary-retouched-v2.jpg"
     alt="Photographed amplifier and electronics mounting prototype in an automotive installation">
```

Place `Photographed installation prototype/reference; shown as development context, not HIS-CA-001A.` directly with the media. Keep the HIS-CA-001A status in a separate semantic block and represent stage 03 of 07 in visible text as well as the progress treatment.

- [ ] **Step 2: Add the light “Products taking shape” section**

Build three exploration articles:

1. HIS-CA-001A with the reviewed CAD derivative, `Active development`, and dossier link.
2. Speaker fitment hardware with `his-product-lineup-banner_text_friendly.jpg`, `Planned direction`, and a visible concept-visualization disclosure.
3. Mounting and routing hardware with authentic installation imagery, `Planned direction`, and a photographed-reference label.

Link the planned items to stable anchors on `products.html`, and add `View all product directions` after the three items.

- [ ] **Step 3: Add “Why HIS builds”**

Use a two-column story with authentic installation context and the sequence:

```text
Observe the constraint → define the part → model it → print it → evaluate it → revise it.
```

Link `See the development process` to `design-fabrication.html`.

- [ ] **Step 4: Reframe the seven-stage status rail as compact current development**

Retain all seven existing stage names and exactly one `aria-current="step"` on `CAD in progress`. Keep the reviewed CAD image and the existing bounded statements about verified and pending evidence. Link to the HIS-CA-001A dossier.

- [ ] **Step 5: Add the founder/company band and closing action**

Introduce Tyler Hall and the aviation-informed approach in a short band using `assets/founder/tyler-hall-founder.jpg`. Link to About. Finish with a CTA that links to Products and Contact without implying ordering, pricing, or availability.

- [ ] **Step 6: Add distinct Clarity event hooks**

Use stable `data-clarity-event` attributes on the hero product action, product-direction links, and founder/company link. Add one delegated handler in `script.js` that passes only allow-listed event names to `trackClarityEvent`:

```js
var allowedEvents = [
  "hero_products_click",
  "product_direction_click",
  "founder_about_click"
];
```

- [ ] **Step 7: Run homepage and global tests**

```powershell
node --test tests/evidence-ledger-home.test.mjs tests/evidence-ledger-global.test.mjs tests/site-integrity.test.mjs
```

Expected result: the selected hierarchy, exact hero content, disclosures, product states, evidence rail, analytics hooks, and all local references pass.

- [ ] **Step 8: Commit the homepage**

```powershell
git add index.html style.css script.js tests/evidence-ledger-home.test.mjs
git commit -m "feat: rebuild homepage for product discovery"
```

---

## Task 4: Refresh Products and the HIS-CA-001A dossier

**Files:**
- Modify: `products.html`
- Modify: `products/his-ca-001a-cable-comb.html`
- Modify: `style.css`
- Modify: `tests/evidence-ledger-products.test.mjs`
- Modify: `tests/evidence-ledger-product-detail.test.mjs`

- [ ] **Step 1: Add product-page contracts for the new hierarchy**

Before editing the pages, extend the tests to require:

- the Products page leads with HIS-CA-001A as `Active development`;
- the five planned SKUs remain in order and use `Planned direction` or `Planned concept`, never `CAD in progress`;
- stable anchors exist for speaker-fitment and mounting-routing links from the homepage;
- the dossier keeps `Not available for sale` adjacent to its current status;
- verified evidence, pending evidence, revision record, and evidence ledger remain in that order.

Run the two focused tests and confirm only the new hierarchy/anchor expectations fail.

- [ ] **Step 2: Rebuild the Products lead around the active record**

Use a compact dark page hero, then a large light active-product feature using the reviewed CAD derivative. Show the SKU, `Active development`, current revision, `CAD in progress`, stage 03 of 07, a concise proof summary, and the dossier link.

- [ ] **Step 3: Reorganize the planned queue into two discoverable groups**

Group the existing five planned SKUs under stable anchors:

```html
<section id="speaker-fitment" ...>
<section id="mounting-routing" ...>
```

Keep each SKU and its current descriptive boundaries. Use one explanation near the top that planned records are directions, then concise status labels and next-proof notes on each record.

- [ ] **Step 4: Restyle the HIS-CA-001A dossier without changing its truth state**

Use a focused dossier header, prominent status/revision strip, preserved seven-stage rail, two-column verified/pending split, revision record, and evidence ledger. Keep both the reviewed CAD work-in-progress image and the historical AI concept disclosure; label the latter as historical and not current geometry.

- [ ] **Step 5: Verify product contracts**

```powershell
node --test tests/evidence-ledger-products.test.mjs tests/evidence-ledger-product-detail.test.mjs tests/evidence-ledger-assets.test.mjs tests/site-integrity.test.mjs
```

Expected result: all product, evidence, asset-hash, link, heading, and image-alt contracts pass.

- [ ] **Step 6: Commit the product pages**

```powershell
git add products.html products/his-ca-001a-cable-comb.html style.css tests/evidence-ledger-products.test.mjs tests/evidence-ledger-product-detail.test.mjs
git commit -m "feat: clarify product pipeline and dossier"
```

---

## Task 5: Refresh Development, About, Contact, Privacy, and Sitemap

**Files:**
- Modify: `design-fabrication.html`
- Modify: `about.html`
- Modify: `contact.html`
- Modify: `privacy.html`
- Modify: `sitemap.html`
- Modify: `style.css`
- Modify: `tests/evidence-ledger-supporting-pages.test.mjs`
- Modify: `tests/evidence-ledger-global.test.mjs`

- [ ] **Step 1: Refresh Development around the eight-step company-owned process**

Use a compact dark hero, authentic supporting imagery, and the existing eight ordered evidence gates. Preserve their exact headings and the company-owned-pipeline boundary. Retain every photographed or AI-assisted disclosure and the bounded status for HIS-CA-001A.

- [ ] **Step 2: Refocus About on founder, company purpose, and capability**

Lead with Tyler Hall, the aviation-informed problem-solving approach, and the reason the company builds installation hardware. Keep the personal story and founder photo. Replace the dated equipment-inventory sentence with accurate capability copy such as:

```text
In-house prototyping capability and commercial CAD access now support the company-owned development workflow.
```

Retain the HIS-CA-001A current and pending milestones without naming a printer model or purchase date.

- [ ] **Step 3: Improve Contact inquiry guidance and accessibility**

Use a compact hero and explain that useful inquiries include product-development questions, prototype feedback, and company information. Preserve the form action, method, honeypot, fields, public email, submit behavior, and status region.

Add `aria-describedby` to every field:

```html
<input ... aria-describedby="name-error">
```

Repeat for email, subject, and message. Keep errors empty until validation and preserve `aria-invalid` updates in `script.js`.

- [ ] **Step 4: Apply the shared editorial shell to Privacy and Sitemap**

Keep their content concise. Update Sitemap labels to `Development` where the shared navigation language applies, without changing the route URL.

- [ ] **Step 5: Run supporting-page and contact-related tests**

Extend the global/static assertions to require every contact field's error relationship and the unchanged form endpoint. Then run:

```powershell
node --test tests/evidence-ledger-supporting-pages.test.mjs tests/evidence-ledger-global.test.mjs tests/site-integrity.test.mjs
```

Expected result: all process, founder, form, shell, metadata, link, and asset assertions pass.

- [ ] **Step 6: Commit the supporting pages**

```powershell
git add design-fabrication.html about.html contact.html privacy.html sitemap.html style.css tests/evidence-ledger-supporting-pages.test.mjs tests/evidence-ledger-global.test.mjs
git commit -m "feat: refresh company and inquiry pages"
```

---

## Task 6: Complete responsive, accessibility, regression, and visual verification

**Files:**
- Modify if defects are found: `style.css`
- Modify if defects are found: `script.js`
- Modify if defects are found: affected HTML route(s)
- Modify if a durable regression needs coverage: relevant `tests/*.test.mjs`

- [ ] **Step 1: Run the full automated test suite**

```powershell
node --test tests/*.test.mjs
```

Expected result: every test passes with zero failures, skips, or cancellations.

- [ ] **Step 2: Run static hygiene checks**

```powershell
git diff --check
Select-String -Path *.html,products/*.html,style.css,script.js -Pattern 'TODO|TBD|placeholder|lorem ipsum' -CaseSensitive:$false
```

Expected result: `git diff --check` is clean and the placeholder scan finds no unfinished production copy.

- [ ] **Step 3: Start a local static server**

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/index.html` in the in-app browser. Keep the server running only for local review.

- [ ] **Step 4: Review every public route at desktop and mobile widths**

Inspect all eight HTML routes at approximately 1440×1000 and 390×844. Also inspect the homepage and Contact at an intermediate tablet width around 768 px.

Verify:

- no horizontal page scroll;
- the hero photograph remains recognizable and uncropped captions remain attached;
- product images show complete compositions;
- navigation opens, closes, and reports state correctly;
- the status rail remains readable at narrow widths;
- current-page states and focus outlines are visible on light and dark surfaces;
- Contact labels, errors, and submit button remain usable;
- no console errors occur.

- [ ] **Step 5: Test keyboard and reduced-motion behavior**

Use keyboard-only navigation through the header, hero actions, product cards, dossier links, footer, and Contact form. Verify Escape closes the mobile menu and restores focus. Enable reduced motion and confirm no required content depends on animation.

- [ ] **Step 6: Test contact validation without sending a live inquiry**

Submit the empty form and an invalid email locally. Confirm inline messages, `aria-invalid`, `aria-describedby`, and the status region update. Do not submit a valid payload to the live Azure endpoint.

- [ ] **Step 7: Compare the homepage to the selected Option 3 reference**

Compare the rendered homepage with `docs/superpowers/specs/assets/2026-09-16-option-3-homepage-reference.png`. Confirm the implementation carries over the dark high-impact hero, strong split composition, restrained technical accents, light product-discovery section, and professional spacing without copying unsupported mockup content.

- [ ] **Step 8: Fix only verified defects and rerun affected checks**

For each defect, add a focused regression assertion when practical, demonstrate the failure, apply the smallest fix, and rerun the focused test. After the last fix, rerun the full suite and `git diff --check` once.

- [ ] **Step 9: Commit final polish**

```powershell
git add -A
git commit -m "fix: complete responsive and accessibility polish"
```

If no defects required changes, do not create an empty commit.

- [ ] **Step 10: Prepare the review handoff**

Record the final test count, reviewed viewport sizes, contact-validation result, any remaining evidence limitations, and the exact branch name. Keep production merge/deployment as a separate user-reviewed action.
