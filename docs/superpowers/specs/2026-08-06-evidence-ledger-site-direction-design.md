# Hall Integrated Systems Evidence Ledger Site Direction

**Status:** Approved design direction; implementation not started

**Date:** August 6, 2026

**Selected direction:** Option 1 — Evidence Ledger

**Repository:** `Hall-Integrated-Systems/SITE`

**Source branch and baseline:** `main` at `f011e8d`

**Public site:** `https://hallintegratedsystems.com`

## 1. Decision

The Hall Integrated Systems public website will evolve from a startup-credibility brochure into a product-development evidence platform. The presentation will stay recognizably Hall Integrated Systems—aluminum gray, navy, cyan, cobalt, restrained violet, Arial typography, and the current static architecture—but the information hierarchy will prioritize verifiable progress over broad capability marketing.

The site must answer three questions quickly:

1. What automotive hardware problem is Hall Integrated Systems working on?
2. What evidence exists today?
3. What remains unverified or incomplete?

HIS-CA-001A will be the primary proof case. Its page will operate as a compact public product dossier, not as a sales page.

## 2. Goals

- Present Hall Integrated Systems as an original automotive physical-product company.
- Make current product status understandable without overstating readiness.
- Establish a repeatable seven-stage status system that can support future products.
- Prefer real photographs, current CAD evidence, dated decisions, and dimensional references over generic marketing imagery.
- Clearly distinguish photographed hardware, CAD evidence, dimensional references, AI-assisted concepts, and pending evidence.
- Keep inquiry paths available without implying unfinished products can be purchased.
- Preserve the working static site, public routes, contact transport, analytics, custom domain, and accessibility behavior.

## 3. Non-goals

- No store, checkout, pricing, inventory, preorder, availability, shipping, or production-readiness features.
- No claims of completed testing, certification, patents, partnerships, customer adoption, insurance, or public shop operation.
- No contract manufacturing, installation-shop, consulting, repair, IT, smart-home, or non-automotive positioning.
- No merger with Hall Product Studio.
- No framework migration, build system, external font, icon CDN, or new third-party frontend dependency.
- No publication of license files, license numbers, private records, high-resolution masters, internal documents, or sensitive source material.
- No Sites deployment unless the user separately requests a review share. Production remains GitHub Pages after approval.

## 4. Confirmed truth baseline

### Commercial CAD access

The supported public wording is:

> Commercial CAD access established.

The local Autodesk record identifies Fusion with an active subscription plan. It does not support publishing a term, price, account identifier, renewal date, certification, partnership, or broader company-license claim.

All current copy that says commercial licensing is pending, proper commercial licensing must still be secured, or CAD work is blocked by licensing is outdated and must be replaced.

### HIS-CA-001A current milestone

The public status at the design baseline is:

- **Concept defined:** complete.
- **Design decision complete:** complete; REV-A working direction documented August 3, 2026.
- **CAD in progress:** current stage.
- **Prototype printed:** pending.
- **Fit evaluation complete:** pending.
- **Revision underway:** pending.
- **Small-batch preparation:** pending.

The REV-A working direction is four open, top-loading U-channels; replaceable zip-tie retention through two body slots; and a top-to-bottom M4 × 18 countersunk mounting screw. Snap-throat retention is reserved for REV-B and a removable cap for REV-C. Dimensions remain subject to measurement and prototype validation.

A recovered STL and screenshot prove CAD activity, but the visible geometry does not match the documented REV-A decision because the zip-tie slots are absent. They therefore do not support “REV-A CAD complete” and must not be presented as the current design.

The product remains an unvalidated prototype concept until print, fit, vibration, pull, and serviceability evidence is documented.

## 5. Information architecture

The existing route structure remains intact:

- `/index.html` — concise company and evidence overview.
- `/products.html` — development queue and product-status index.
- `/products/his-ca-001a-cable-comb.html` — HIS-CA-001A evidence dossier.
- `/design-fabrication.html` — the company-owned development process and evidence standards.
- `/about.html` — founder and company context, edited only where status is outdated.
- `/contact.html` — general inquiry path using the existing contact workflow.
- `/privacy.html`, `/sitemap.html`, `/sitemap.xml`, and `/robots.txt` — preserved, with only necessary metadata or route-description updates.

Header and footer navigation relationships stay consistent across every page.

## 6. Homepage structure

The homepage will use the following order.

### 6.1 Evidence-led hero

- Eyebrow: automotive product development, not geographic or service-business positioning.
- Headline: a concise statement about original automotive installation hardware and cleaner integration.
- Supporting copy: one short paragraph describing the concept-to-CAD-to-prototype process.
- Primary action: view HIS-CA-001A development.
- Secondary action: see the development process.
- Visual: a real photographed hardware image or an approved composite dominated by real photography. Any AI-assisted image must be explicitly labeled in its caption.

### 6.2 Company development rail

A seven-stage semantic ordered list establishes the common status vocabulary:

1. Concept defined
2. Design decision complete
3. CAD in progress
4. Prototype printed
5. Fit evaluation complete
6. Revision underway
7. Small-batch preparation

The homepage rail shows the company’s leading product state, with two complete stages, one current stage, and four pending stages at the baseline.

### 6.3 Featured product evidence card

HIS-CA-001A receives the dominant product block with:

- Product name, category, and current-stage badge.
- One-sentence problem statement.
- A compact “verified now” list.
- A compact “pending evidence” list.
- Link to the product dossier.
- No buy, reserve, pricing, or availability language.

If a current REV-A CAD export is unavailable, this block uses a status/evidence composition and real contextual photography. It must not substitute the historical AI cable-comb image as if it were the current part.

### 6.4 Development journal

A compact reverse-chronological strip contains only dated, source-backed milestones. Each entry includes:

- Date.
- Product or company scope.
- What changed.
- Evidence type.
- Current implication.

The initial verified product entry is the August 3, 2026 REV-A design decision. Additional entries appear only when a stable public source exists. The fictional 2024 dates shown in the selected visual concept are explicitly rejected.

### 6.5 Real hardware context

The current photographed amplifier/DSP drawer and rear-deck installation imagery remains useful as install-context evidence. It will be presented after the active product evidence, not before it, so it supports the product story without implying those assemblies are current retail products.

### 6.6 Inquiry band

The closing action invites questions about development status or product direction. It does not imply ordering, sales, contract design, or installation services.

## 7. Products and Prototypes page

The products index becomes a development queue rather than a catalog.

Each product record uses the same compact schema:

- Product code and name.
- Automotive problem addressed.
- Current stage.
- Evidence available.
- Next required proof.
- Detail-page link when available.

HIS-CA-001A is the only product allowed to show “CAD in progress” at the baseline. Other product directions remain “planned concept” unless their own evidence supports advancement. Planned categories must not look like finished inventory.

## 8. HIS-CA-001A product dossier

The detail page is the strongest expression of the Evidence Ledger direction.

### 8.1 Dossier header

- Product code, product name, category, and current-stage badge.
- Short product intent statement.
- Explicit “not available for sale” note while the product is unfinished.

### 8.2 Revision record

- Current working revision: REV-A.
- Decision date: August 3, 2026.
- Retained features, deferred features, and measurements still required.
- A plain-language note that decisions are working development evidence, not verified performance.

### 8.3 Product status rail

The same seven stages appear with programmatic state labels:

- `.is-complete` for evidence-backed completed stages.
- `.is-current` plus `aria-current="step"` for the present stage.
- `.is-pending` for incomplete stages.

Color cannot be the only state indicator; each stage also receives visible text or an accessible state label.

### 8.4 Evidence ledger

Evidence is grouped by type, with a visible label and caption:

- **Design decision** — dated REV-A working decisions.
- **CAD evidence** — only screenshots or renders that match the current documented revision.
- **Dimensional reference** — measurements or diagrams labeled as targets until verified.
- **Prototype photograph** — only a real printed part, once one exists.
- **Test evidence** — fit, vibration, pull, and serviceability records, once completed.
- **Historical AI concept** — optional, visually secondary, and never treated as current geometry.

If an evidence type has no approved artifact, the page states “pending” in text. It does not use an invented placeholder visual.

### 8.5 Verified and pending split

Two adjacent panels make the truth boundary explicit.

**Verified now**

- Product problem and concept defined.
- REV-A working design decision documented.
- Commercial CAD access established.
- CAD activity underway.

**Pending evidence**

- Measurements frozen.
- Current REV-A CAD model verified.
- Representative coupon printed.
- Complete prototype printed.
- Fit, vibration, pull, and serviceability checks completed.
- Revision outcome documented.
- Small-batch preparation begun.

### 8.6 Inquiry action

The page ends with a general development-status inquiry path. No commerce language is added.

## 9. Development process page

The Design & Fabrication page will explain the evidence gates behind the status system:

1. Define the installation problem.
2. Document a working design decision.
3. Build and inspect the CAD model.
4. Measure critical interfaces and print a representative coupon.
5. Print the complete prototype.
6. Evaluate fit, retention, vibration, pull, access, and serviceability as applicable.
7. Record revision decisions.
8. Prepare for a small batch only after the relevant evidence exists.

The page must describe Hall Integrated Systems’ own product pipeline, not outside design services or contract manufacturing.

## 10. Evidence taxonomy and publishing rules

Every product visual receives one of these labels:

| Label | Meaning | Publishing rule |
| --- | --- | --- |
| Photographed prototype | Real physical company hardware | Caption any retouching; retain the original as the dimensional reference |
| Installed reference | Real installation context | Do not imply the pictured assembly is a retail product |
| CAD evidence | Export from the current documented model | Must match the named revision and hide private workspace information |
| Dimensional reference | Diagram or measurement aid | Mark planning targets as unverified until measured |
| AI-assisted concept | Generated or materially synthesized direction | Label visibly; never present as physical proof |
| Historical concept | Superseded design direction | Use only when it clarifies iteration; keep visually secondary |
| Pending evidence | Required proof not yet available | Render as text/status, not a fabricated image |

Source responsibilities remain:

- SharePoint holds untouched originals, CAD documentation, product records, approved masters, and recovery material.
- The canonical SharePoint CAD path for HIS-CA-001A is `Documents/Products/HIS-CA-001A Cable Comb/03 CAD` on the `Hall Integrated Systems` site (`/sites/allcompany`).
- The synced read-only local mirror is `C:\Users\Tango\OneDrive - HALL INTEGRATED SYTEMS\Documents\SharePoint-Documents\Products\HIS-CA-001A Cable Comb\03 CAD`.
- Adobe handles authentic photographic correction and optimized export.
- Creative Production supports visual concept development and review.
- GitHub contains only approved public web derivatives.
- The website contains no private source documents, sensitive licensing records, or high-resolution masters.

## 11. Approved asset direction

### Publishable at baseline

- `assets/products/website-photo-edits/his-amplifier-drawer-primary-retouched-v2.jpg`
- `assets/products/website-photo-edits/his-amplifier-drawer-angle-retouched-v2.jpg`
- `assets/products/website-photo-edits/his-rear-deck-subwoofer-installed-retouched.jpg`
- `assets/products/website-photo-edits/his-rear-deck-enclosure-prototype-concept-ai-v2.jpg`, only with its AI-assisted concept disclosure

The disclosures and source-preservation notes in `assets/products/website-photo-edits/ASSET_NOTES.md` remain authoritative for these derivatives.

### Conditional

- New HIS-CA-001A CAD screenshots or renders, after confirming they match the documented REV-A geometry and are safe for public export.
- `HIS-CA-001A_REV-A_Master.png` from the canonical CAD folder may be used as a source-preserving public derivative labeled “CAD work in progress.” Its visible geometry supports CAD activity but does not prove that the documented REV-A retention and mounting decisions are complete.
- New prototype photographs, after a physical part is printed and the photographs are approved.

### Excluded from current-proof placement

- `assets/products/his-ca-001a/UPSCALED_HIS-CA-001A_AIConcept_03_FinalDirection_ProductShot.png` as current REV-A evidence. It may appear only in a clearly labeled historical concept context.
- The recovered SharePoint STL screenshot as current REV-A evidence because its visible geometry does not match the documented decision.
- High-resolution masters, internal Word documents, the Autodesk license file, and private SharePoint records.

## 12. Visual system

The approved mock’s evidence-first composition is adopted, while its fictional dates and generated evidence copy are not.

### Color and typography

Retain the current 2026 tokens as the base:

- Navy: `#071a3d`
- Cobalt: `#1478ff`
- Cyan: `#16d9ff`
- Charcoal: `#14233a`
- Aluminum gray: `#d1d1d1`
- Light silver: `#e7e7e7`
- Panel silver: `#f4f4f4`
- White: `#ffffff`
- Restrained violet: `#8b5cf6`, reserved for limited secondary emphasis
- Typeface: Arial, Helvetica, sans-serif only

The appearance should feel engineered, precise, and readable rather than futuristic or ornamental. Cyan identifies active progress and focus states. Navy carries primary structure. Gray separates evidence surfaces.

### Layout and components

- Content width continues to align with the current approximately 1320-pixel desktop system.
- Cards use restrained radii and borders; avoid soft consumer-app styling.
- Evidence labels are compact, high-contrast, and repeated consistently.
- Photography keeps natural material texture and a slight personal/workbench quality.
- Technical metadata uses aligned labels and values rather than decorative diagrams.
- No ASCII art, CSS illustrations, invented icons, or placeholder graphics.

## 13. Responsive behavior

- Desktop: status rails display horizontally when labels remain readable; evidence and verified/pending panels may use two columns.
- Tablet: rails may wrap into a structured grid; primary evidence remains before supporting context.
- Mobile: status rails become a vertical ordered sequence, evidence panels stack, captions remain attached to their media, and primary actions remain easy to reach.
- No horizontal page scrolling is permitted at 320 CSS pixels or wider.
- Navigation retains its existing accessible toggle behavior.

## 14. Accessibility

- Maintain semantic landmarks, one descriptive `h1` per page, and logical heading order.
- Use `ol` for development stages and `aria-current="step"` for the current stage.
- Do not communicate evidence state by color alone.
- Every informative image receives descriptive alt text; captions identify evidence type and disclosure.
- Decorative imagery uses empty alt text only when it contributes no information.
- Preserve visible keyboard focus, sufficient contrast, touch-target size, and keyboard-operable navigation.
- Status updates and form feedback remain understandable to assistive technology.
- Respect reduced-motion preferences; the redesign does not require motion to communicate meaning.

## 15. Interaction and data behavior

The first implementation remains mostly static and does not introduce a content-management system.

- Status and journal data are authored in semantic HTML.
- The mobile navigation continues to use the existing `script.js` behavior.
- The contact form continues to use the existing Azure Function and Microsoft Graph workflow.
- No client-side filter, carousel, modal, or animation is required for the core experience.
- If a later iteration introduces product filtering, it must retain a useful no-JavaScript baseline.

## 16. Analytics, SEO, and privacy

- Preserve Microsoft Clarity ID `xa3uw9a04d` on every existing public HTML route.
- Preserve current contact and navigation event tracking unless a separately approved analytics change is made.
- Update page titles and descriptions to reflect the evidence-led product-development positioning.
- Preserve `CNAME`, canonical public routes, crawler sitemap, human sitemap, and `robots.txt` behavior.
- Do not add a new tracker, cookie dependency, external font, or social embed.

## 17. Implementation scope

Expected implementation files:

- `index.html`
- `products.html`
- `products/his-ca-001a-cable-comb.html`
- `design-fabrication.html`
- `about.html`, only for outdated status copy
- `style.css`
- `sitemap.html` and `sitemap.xml`, only if descriptions or public routes require updates
- Approved, web-sized product derivatives under `assets/`, only when a source and disclosure are verified

`script.js`, the Azure contact API, `contact.html`, `privacy.html`, `CNAME`, and deployment configuration remain unchanged unless implementation verification identifies a necessary compatibility correction. Any such correction requires explicit scope review before editing.

Untracked master images, internal documents, license files, debug artifacts, and unrelated working files must not be staged.

## 18. Verification plan

Before implementation is called complete:

1. Compare the rendered homepage and HIS-CA-001A page to the approved Evidence Ledger visual at matching desktop and mobile viewports.
2. Review all public copy against the truth baseline in this specification.
3. Confirm all seven status labels and states are consistent across pages.
4. Confirm every visual has the correct evidence label, disclosure, alt text, and caption.
5. Verify every public route locally, then verify production only after deployment approval.
6. Test at desktop, tablet, and 320-pixel mobile widths for overflow, legibility, and content order.
7. Test navigation and primary actions by keyboard.
8. Confirm focus visibility and text/background contrast.
9. Confirm image paths, intrinsic dimensions, lazy loading where appropriate, and no unintended high-resolution master publication.
10. Run JavaScript syntax checks and inspect the browser console for errors.
11. Exercise contact-form validation without sending a test inquiry unless explicitly authorized; preserve the current endpoint and failure fallback.
12. Confirm Clarity ID `xa3uw9a04d`, sitemap coverage, `robots.txt`, `CNAME`, and navigation consistency.
13. Review the exact staged file list before committing so no untracked private or unrelated file is included.

## 19. Delivery sequence

1. Create a dedicated `codex/` branch from the verified baseline.
2. Build the approved direction in the existing plain HTML/CSS/JavaScript architecture.
3. Preview and verify locally.
4. Review the implementation and evidence wording with the user.
5. Optionally create a separate Sites review deployment only if the user asks for one.
6. Publish through GitHub Pages only after explicit deployment approval.
7. Re-check every production route, analytics marker, contact behavior, and source/production parity after deployment.

## 20. Acceptance criteria

The design is implemented successfully when:

- A visitor can identify HIS-CA-001A’s current stage and pending proof within the first homepage screen and featured-product section.
- No outdated licensing-pending statement remains.
- No page presents the product as CAD-complete, printed, tested, available, or production-ready without new evidence.
- The site consistently separates real photography, current CAD, dimensional references, AI-assisted concepts, historical concepts, and pending evidence.
- The website remains responsive, keyboard accessible, locally runnable without a build process, and operational on its existing routes and contact workflow.
- Only approved public derivatives and intended code/content files are committed.
- No production deployment occurs without a separate explicit approval.
