# Workstream 3D — Question 4575: Graph Visual Reconstruction Proof

**Status: visual built, independently verified, and — as of the follow-up
sign-off recorded in
`docs/workstream-3d-4575-live-association-correction-record.md` —
APPLIED to the live database.** ~~Per the explicit instruction for this
workstream, this is the sign-off record for a proposed association — the
live database has not been touched, and no `visual_assets` row exists yet
for question 4575.~~ This mirrors the 3070 pattern from Workstream 3B:
candidate → proof → (separate, explicit) live association step, never
bundled together. See the correction record for the full before/after
diff, hashes, and the one open caveat (4575's `status` remains
`transcribed`, so it is not yet servable to real students regardless of the
visual being live — a separate content-QA decision, not a visual-pipeline
one).

**Live database SHA-256 before this workstream:**
`4014833a08c1350606eb4ec64f2ada674a11318ca3bc8aed95acbe340176efd4`
**Live database SHA-256 after this workstream:**
`4014833a08c1350606eb4ec64f2ada674a11318ca3bc8aed95acbe340176efd4`
**Identical.** `git status --short source_library/` is clean at both ends.
Every touch of the live database in this workstream was a single read-only
`SELECT` (question 4575's content and answer status), never a write.

## 1. Source page

- **Question:** 4575 (`cbse-mathematics-polynomials-752a6e3e`), CBSE
  Mathematics, chapter "Polynomials."
- **Source:** `source_library/CBSE/Mathematics/ch1-2.pdf`, page index 10 in
  the PDF, printed page footer **2.22**, item **45**, "Fig. 2.19" — all
  confirmed in Workstream 3C by rendering the page and reading the footer
  directly (not assumed from the stored `source_page` field alone).
- **Content QA status confirmed again here:** `status = transcribed`,
  **`answer_status = verified`**, `correct = 3` (1-indexed into
  `options_json = ["3","1","2","0"]`, i.e. option (c) "2" — matching the
  source's own printed answer key "(c) 2" exactly). This is the fact that
  made 4575 the recommended next candidate: its content is already QA'd,
  unlike 1594/1230 (not yet gradable) or 819 (answer-key format gap).

## 2. Source figure inspection

The figure was re-inspected at high resolution
(`pymupdf`, 6x render matrix, read-only) to measure the actual axis and
curve geometry, not just to confirm a diagram "exists" as Workstream 3C did.
Findings (all pixel coordinates below are in the tight crop described in
Section 3):

- Standard Cartesian axes, arrowheads at both ends of each axis, labeled
  **x′** (left), **x** (right), **y** (top), **y′** (bottom). No origin
  label. No scale numbers or tick marks anywhere on either axis — this is a
  qualitative sketch, not a scaled/gridded plot.
- A single smooth curve, arrow-terminated at both ends (indicating it
  continues beyond the drawn frame), shaped as one downward-opening hump.
- At the y-axis (x = 0), the curve sits **below** the x-axis (measured curve
  row ≈396 vs. axis row 286 — strictly below, i.e. a negative y-intercept).
- The curve **crosses the x-axis exactly twice**, and both crossings are on
  the **positive-x side** of the y-axis (measured crossing columns ≈420 and
  ≈462, both right of the y-axis at column 315), with a single peak above
  the x-axis between them.
- The peak's height above the axis is right at the scan's noise floor
  (≈1px) — visually the curve barely poking above the line rather than a
  clearly measurable height. There is no coordinate grid asserting a
  specific vertex height, so this is not a data point to preserve exactly;
  see Section 4 for how this was handled.
- This geometry is exactly what the question and its verified answer depend
  on: "the number of zeroes of p(x) from the graph" = the number of x-axis
  crossings = **2**, matching option (c).

## 3. Source-cropped asset (provenance, immutable)

- **File:** `extracted-diagrams/cbse-mathematics-polynomials-752a6e3e-item45-graph-CANDIDATE.png`
- **SHA-256:** `b697c60911d793ef0d9a74ac5e8ca1e6854a3fa38d7f87568c42ad09f3a08288`
- A tight, unmodified crop of the original scanned page — axes, curve, and
  the "Fig. 2.19" caption only, with the surrounding answer-option text
  excluded. This is the `source_cropped` asset: provenance/audit reference
  only, never served to students once an `ai_generated` row exists (same
  convention as 3070).
- The crop was produced by bounding-box detection on the rendered page
  (rows/columns containing ink, read-only `pymupdf` render → `PIL`/`numpy`),
  not by hand-guessed pixel coordinates — the detection script and its
  output are reproducible from the source PDF at any time.

## 4. Generated visual (adapted SVG)

- **File:** `extracted-diagrams/cbse-mathematics-polynomials-752a6e3e-item45-graph-GENERATED.svg`
- **SHA-256:** `83df5fc270f9db3ff76e17bf08460c81369b1599f147e6beb5fd9c36ac42c1d7`
- Built following the same conventions as 3070's number-line SVG: colors
  read from the host page's own `--ink`/`--violet` CSS custom properties via
  `var()`, no `@media (prefers-color-scheme)` fallback (this file is only
  ever fetched and inlined via `innerHTML`, never used as a standalone
  `<img src>` — see `public/app.js`'s `createDiagramLoader`), a `<title>`/
  `<desc>` pair for accessibility, and a provenance comment documenting
  exactly what was and was not preserved from the source.
- **Semantic content preserved exactly** (per Section 2's measurements):
  axes with arrowheads at both ends, labels x′/x/y/y′, no scale numbers, no
  origin label; a single arrow-terminated curve; curve below the x-axis at
  x = 0; curve crossing the x-axis exactly twice, both crossings right of
  the y-axis; a single peak above the axis between the two crossings; the
  "y = p(x)" label positioned near the curve's right-hand descending arrow,
  matching the source's placement.
- **Two deliberate legibility adjustments, both documented in the SVG's own
  comment** (neither changes the zero count, sign pattern, or shape the
  question depends on):
  1. The peak is drawn with a clearly visible height above the axis rather
     than reproducing the source's ~1px-at-scan-resolution hairline, which
     is scan noise, not an asserted data point.
  2. The gap between the two x-axis crossings is widened somewhat (the
     source's crossings are only ~42px apart against a ~280px-wide curve,
     hard to read as two distinct points at a glance); both crossings are
     still kept well inside the region the source shows them in — clearly
     right of the y-axis, well short of either arrow tip.
- These are the same category of change already accepted for 3070 (the
  number line's dots were redrawn as clean, evenly-spaced circles rather
  than reproducing the scan's uneven hand-marks) — a professional
  presentation of the same evidence, not a reinterpretation of it.
- The SVG was validated as well-formed XML and manually previewed against
  both the light and dark token sets before wiring it into any server-backed
  proof (see `/tmp/3d-preview/` scratch renders — not committed, not
  referenced by any code, purely an intermediate sanity check).

## 5. End-to-end rendering proof (disposable test DB, real browser)

Script: `scripts/verify-4575-visual-rendering.js` (committed), same
discipline as `scripts/verify-3070-visual-rendering.js`:

- Reads question 4575's real content from the **live** database with a
  single read-only `SELECT`, then closes that connection before anything
  else touches `process.env`/`db.js`.
- Provisions a brand-new, disposable SQLite test database via
  `test/pg-test-support.js`'s `setupPrimaryTestDbEnv` (never `boardready.db`),
  seeds a fixture CBSE Mathematics / Polynomials question with 4575's real
  text/options/answer, and seeds **two** `visual_assets` rows —
  `source_cropped` inserted first (lower id) and `ai_generated` inserted
  second — the same regression-check ordering used for 3070: if the server
  ever regressed to "first row by id" instead of the `asset_type` priority
  rule, this proof would visibly fail by serving the raster crop instead of
  the SVG.
- Spawns the real `node server.js` against the disposable database.
- Registers two real students via the real HTTP API and drives a real
  Chromium browser (Playwright) through actual clicks: login → CBSE →
  Practice on the fixture chapter → question screen.

**Results — all checks passed:**

- **API-level:** `diagramUrl` resolves to
  `/extracted-diagrams/cbse-mathematics-polynomials-752a6e3e-item45-graph-GENERATED.svg`
  — the `ai_generated` SVG, not the `source_cropped` raster crop — for both
  theme passes.
- **DOM-level** (both dark and light passes): raster `<img>` hidden with no
  `src`; the SVG host visible and containing a real inlined `<svg>`; exactly
  1 curve path (`.gr-curve`); exactly 2 straight axis lines
  (`line.gr-axis`); the function label reads exactly `"y = p(x)"`
  (`.gr-fn-label`) — i.e. the specific graph content loaded, not just "some
  SVG."
- **Theme:** dark pass used the app's own default (`state.theme` in
  `app.js`), no toggle click; light pass reached by clicking the app's real
  `#themeBtn2` once — never the OS `prefers-color-scheme` signal.
- **Desktop (1280×900) and mobile (390×844)** viewports, both themes: question
  card and zoom lightbox all screenshotted —
  `docs/workstream-3d-4575-visual-qa-screenshots/{question,lightbox}-{dark,light}-{desktop,mobile}.png`
  (8 files). Visual review of all 8: the curve renders cleanly and legibly
  in both themes, the axes and "y = p(x)" label are readable at both
  viewport widths, and the lightbox zoom (the `min(94vw, 1200px)` fix from
  Workstream 3B) gives a genuinely larger, more legible view on both
  desktop and mobile.
- **Regression suite:** `npm test` — **71/71 passing on both SQLite and
  Postgres** — run after this workstream's changes, each run's own
  test-guard confirming the live database was not further modified by
  running the tests. (Postgres required starting the sandbox's `postgresql`
  service, which was not running at the start of this session; this is a
  container/environment detail, not a code or data change.)
- Console/page-error check: no real errors in either pass (only the
  sandbox's pre-existing, unrelated Google Fonts network restriction, same
  filter used in the 3070 proof).

## 6. Limitations and open items

- **This visual is not yet live.** No `visual_assets` row exists for
  question 4575 in `boardready.db`, and `diagram_status` on the live row is
  unchanged. A live association would follow the same guarded-transaction,
  fully-verified pattern used for 3070
  (`scripts/apply-3070-visual-association.js` /
  `docs/workstream-3b-3070-live-association-correction-record.md`) — written
  and reviewed as its own explicit step, not part of this proof.
- **The peak-height and crossing-gap adjustments (Section 4) are legibility
  choices, not measurements.** They are documented in the SVG's own comment
  so a future reviewer can see exactly what was adjusted and why, the same
  transparency standard used for 3070's dot-spacing.
- **This proves the reconstruction pipeline generalizes to a second,
  substantially different visual class (a function graph vs. a number
  line).** It does not, by itself, say anything about Geometry (1594),
  Construction (1230), or Chemistry apparatus (819) diagrams — those still
  need their own content-QA or answer-key-format resolution before a
  similar pilot, per the Workstream 3C report and the instruction not to
  touch them in this workstream. None of them were touched here.
