# Visual Reconstruction — Question 1508 (Batch 15, Task 8)

**Status: proposed. NOT live-associated.** Question 1508's content status
(`status='transcribed'`, `answer_status='source_provided'`) has not
independently cleared the publication gate — no `visual_assets` rows are
inserted into the live database and `diagram_status` remains untouched at
`needs_visual_review`. This document records the source evidence, the
redraw decisions, and the full browser-QA proof, exactly as required before
any future live association task considers this candidate.

## The question

`icse-mathematics-similarity-of-triangles-2169d114` (id 1508), ICSE
Mathematics, Similarity of Triangles, `sub_concept='Basic proportionality
theorem (numeric)'`, `source_document_id=49` (`chap_16.pdf`),
`source_page='16.5'`, `source_question_number='23'`.

Text: "In the adjoining figure, DE ∥ BC. If AD : DB = 3 : 1 and EA = 3.3 cm,
then AC equals:" Options: `1.1 cm / 4 cm / 4.4 cm / 5.5 cm`, stored
`correct = 2` (→ 4.4 cm).

Content check (informational only — this task does not promote the
question): by BPT, AD/DB = AE/EC ⇒ EC = EA/3 = 1.1, so AC = EA + EC =
3.3 + 1.1 = **4.4 cm**, matching the stored answer. This is consistent with
the stored value but is not a substitute for this question's own
independent content-gate review before any promotion.

## Source evidence

`source_library/ICSE/Mathematics/chap_16.pdf`, file page index 3 (prints as
page 16.5), item (23). Rendered at 9x zoom directly from the PDF this
session (`sha256` of the source PDF: `75ff1ece7982685d9e2ab71f8b5f98bae4746a611cd692c67ac823519df69d88`).

The figure: triangle ABC with A at the apex, B at bottom-left, C at
bottom-right; D on side AB, E on side AC; segment DE drawn between them,
horizontal; both DE and BC carry a single rightward chevron/arrow mark at
their midpoint — this source's own notation for "parallel" (not tick
marks). No numeric label appears inside the figure itself; the given values
(AD:DB=3:1, EA=3.3cm) and the derived AC=4.4cm live only in the question
text and answer options, exactly as transcribed into the database.

A clean crop of just this figure (`extracted-diagrams/icse-mathematics-
similarity-of-triangles-2169d114-item23-triangle-CANDIDATE.png`, sha256
`178481b20dd674be022222d92a2d247f11ead67db27d61732dab64cb686d7a8b`) is saved
as the immutable `source_cropped` reference evidence, following the same
crop-and-preserve convention as every prior candidate (3070, 4575, 1594,
1230).

## The redraw

`extracted-diagrams/icse-mathematics-similarity-of-triangles-2169d114-item23-triangle-GENERATED.svg`
(sha256 `460366cf56a962b38d0f2081035ac1b62ba0f612178a4632dd4966da1b2ddc43`).
Full source-correspondence and every design decision is documented inline
in the SVG's own HTML comment (read the file directly for the complete
record); summarized here:

- Same orientation as the source: A at the apex, B bottom-left, C
  bottom-right, D on AB, E on AC, DE horizontal between them.
- Same parallel notation as the source: a rightward chevron on DE and on
  BC (not tick marks — the source itself uses arrows, and substituting a
  different notation would be a reinterpretation, not a faithful redraw).
- No numeric label is drawn inside the figure, matching the source exactly
  (the numbers live in the question text/options only, in both the source
  and the database).
- **One disclosed, deliberate departure from the source sketch's exact
  pixel proportions**: measuring the source image directly, D sits at
  roughly 54% of the way from A to B — the source sketch, like most
  textbook figures, is not drawn to scale relative to the stated AD:DB=3:1.
  Rather than reproduce that imprecise freehand placement, D and E are
  positioned at the mathematically exact 3:1 point implied by the
  question's own given ratio (D = A + 0.75·(B−A), E = A + 0.75·(C−A)),
  mirroring the precedent already set for question 1230's redraw (docs/
  workstream-3i-1594-1230-visual-reconstruction.md), where D was placed at
  the source text's asserted exact midpoint of BC rather than copied from
  the sketch's own rough proportions. This changes only where the labeled
  points sit relative to each other, not what the diagram asserts (D on
  AB, E on AC, DE ∥ BC) — no content is added, removed, or contradicted.

## Browser QA — 8/8 combinations passed

`scripts/verify-1508-visual-rendering.js` (modeled directly on
`scripts/verify-1594-1230-visual-rendering.js`): spins up a fully isolated,
disposable test database (never `boardready.db`) seeded with a byte-for-byte
copy of 1508's real question content (read-only SELECT only) plus both the
`source_cropped` and `ai_generated` visual_assets rows, runs a real
`node server.js` against it, and drives a real Chromium browser
(Playwright) through the exact steps a student would take.

Verified:
- API level: `diagramUrl` resolves to the `ai_generated` SVG (preferred
  over `source_cropped`, matching `getServableDiagramUrls`'s ordering).
- Frontend takes the inline-SVG path (`#qDiagramImg` hidden with no `src`;
  `#qDiagramSvgHost` visible with a real `<svg>` inside).
- DOM semantic checks on every pass: exactly 1 `.bpt-side` path (the
  triangle), exactly 1 `.bpt-mid` line (DE), exactly 5 `.bpt-point` markers
  (A, B, C, D, E), exactly 2 `.bpt-arrow` chevrons (DE + BC).
- All 8 combinations (dark/light theme × desktop/mobile viewport ×
  question view/lightbox zoom) passed with no unexpected console/page
  errors (the only ignored console noise is the sandbox's expected
  Google-Fonts network block, same as every prior visual-QA run).
- Screenshots saved to `docs/workstream-4h-1508-visual-qa-screenshots/`
  (8 files). Spot-checked light-desktop and dark-mobile-lightbox visually
  this session — both render the triangle correctly, theme-aware ink color,
  legible labels, correct arrow marks.
- Live `boardready.db` hash confirmed unchanged before/after the script run
  (`c59d0173ca227dc01708abc13eef988db8ac98f88c2813d9013de94246c2e885` both
  times) — this script never touches the live database beyond the initial
  read-only SELECT.

**Task 8: COMPLETED / PROPOSED.** No live association performed — 1508's
content status has not independently cleared the publication gate. This
visual is ready as a candidate for a future task once that gate clears.
