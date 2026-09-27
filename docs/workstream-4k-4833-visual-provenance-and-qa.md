# Visual Reconstruction — Question 4833 (Batch 15, Task 10)

**Status: proposed. NOT live-associated.** Question 4833's content status
(`status='transcribed'`, `answer_status='needs_review'`) has not
independently cleared the publication gate — no `visual_assets` rows are
inserted into the live database and `diagram_status` remains untouched at
`needs_visual_review`. Separately and more importantly, this session found
genuine, confirmed defects in this question's own `parts_json` (see
`docs/workstream-4j-4833-answer-key-defects.md`) that are unrelated to the
visual and must be resolved by a content reviewer before any promotion —
this visual does not clear that gate and is not a substitute for it.

## Task 10's title/id mismatch — disclosed

Task 10's literal instruction named candidate id "1727" but described "a
CBSE coordinate-plane case-study visual... preserve axes, scale, labels,
plotted points/lines, annotations exactly." Id 1727 is actually a mensuration
(two-cylinders-from-one-rectangle) question — Task 12's own description
matches 1727, not Task 10's. Task 10's description instead matches question
4833 (the Fig. 6.19 courtyard coordinate-plane case study), which was
already under investigation from Task 6. This was disclosed before starting
the build (per the description-over-literal-id resolution already stated
mid-session) and is repeated here for the permanent record. Task 12 below
builds the actual id-1727 visual separately.

## The question

`cbse-mathematics-co-ordinate-geometry-845687ea` (id 4833), CBSE Mathematics,
Co-ordinate Geometry, `kind='case'` (5 parts), `source_document_id=155`
(`chap_5-6.pdf`), `source_page='6.23-6.24'`, `source_question_number='73'`.

Stem: "Fig. 6.19: Four persons John, Saurabh, Salim and Ratan are sitting in
a courtyard at points A, B, C and D respectively... Taking OX and OY as the
coordinate axes."

## Source evidence

`source_library/CBSE/Mathematics/ch5-6.pdf`, file page index 18 (prints as
page 6.23), Fig. 6.19 (source PDF sha256
`5227561e11950d5fc53a80babad23967180be0e7638111cceb6567b079ae1220`).

A clean crop of the whole figure, including its axis labels and the
"Fig. 6.19" caption, is saved as the immutable `source_cropped` reference:
`extracted-diagrams/cbse-mathematics-co-ordinate-geometry-845687ea-item73-courtyardgrid-CANDIDATE.png`
(sha256 `ab1af38854f2c37fd7a8205059c65bc425fc60a77018181f21e6614df0d2a160`).

The figure: a 10×10 grid with alternating light/dark checkerboard cell
shading and a small decorative "face" icon in most cells; Y-axis vertical
(labeled Y, with row numbers 1-10 to its left, axis label "Rows" rotated
alongside), X-axis horizontal (labeled X, with column numbers 1-10 below,
axis label "Column" beneath). Four points are marked with a small filled
dot at a precise grid intersection, each with a face icon in the adjoining
cell and a letter label: **A at (3,4)**, **B at (6,7)**, **C at (9,4)**,
**D at (7,2)** — see `docs/workstream-4j-4833-answer-key-defects.md` for the
full rigorous derivation of these coordinates (programmatic gridline
detection + dot-centroid isolation, cross-checked against the question's own
stored answers for parts ii and iv). No line segments connecting A, B, C, D
are drawn in the source — the quadrilateral is only implied by the question
text.

## The redraw

`extracted-diagrams/cbse-mathematics-co-ordinate-geometry-845687ea-item73-courtyardgrid-GENERATED.svg`.
Full source correspondence and every design decision is documented inline in
the SVG's own HTML comment; summarized here:

- Same grid extent (columns 0-10, rows 0-10), same axis labels (X, Y, O,
  "Column", "Rows") and the same integer tick labels on both axes, in the
  same relative positions as the source.
- Points A, B, C, D marked at their measured-exact grid positions — (3,4),
  (6,7), (9,4), (7,2) — with labels placed adjacent to each dot, matching
  the source's own label placement (e.g. "B" to the upper-left of its dot,
  "D" to the left of its dot).
- **No connecting lines drawn between A, B, C, D**, matching the source
  exactly — the source figure itself does not draw the quadrilateral, only
  the question text describes joining the points, so adding lines would add
  information the source diagram does not contain.
- **Disclosed omissions (page styling, not mathematical content)**: the
  source's alternating checkerboard cell shading and its four decorative
  face-icon avatars (illustrating "people sitting" for the case-study
  framing) are dropped in favor of a plain grid with simple labeled point
  dots — the same "preserve mathematical content, drop page decoration"
  principle already applied to every other clean redraw in this pipeline
  (1508, 1231, 1594, 1230). The source's many repeated small tick-mark
  arrowheads along both axes (suggesting the axes extend indefinitely) are
  consolidated into one arrowhead per axis, carrying the same meaning
  without reproducing each decorative repetition individually.
- This redraw's coordinate placements are not a "corrected" interpretation
  layered on top of the source — they are the same coordinates the source
  diagram itself draws, per the rigorous re-measurement in
  `docs/workstream-4j-4833-answer-key-defects.md`. This is a faithful
  reproduction of the figure, independent of whether the question's text/
  options/`correct` values (a separate, already-flagged defect) get
  corrected later.

## Browser QA — 8/8 combinations passed

`scripts/verify-4833-visual-rendering.js` (modeled on
`scripts/verify-1231-visual-rendering.js`, adapted for `kind='case'` — this
question has 5 scored parts via `parts_json` rather than a single
`options_json`/`correct` pair, the first case-kind question visual-QA'd in
this batch): isolated, disposable test database (never `boardready.db`)
seeded with a byte-for-byte copy of 4833's real `parts_json` content
(read-only SELECT only) plus both the `source_cropped` and `ai_generated`
visual_assets rows, a real `node server.js`, a real Chromium browser
(Playwright) driven through the exact steps a student would take.

Verified:
- API level: `diagramUrl` resolves to the `ai_generated` SVG for part (a) of
  the case question (confirmed the same mechanism serves the diagram
  identically to every one of the question's 5 parts, since `scoring.js`
  attaches the same `diagramUrl` to every part-step of a case question).
- Frontend takes the inline-SVG path (`#qDiagramImg` hidden with no `src`;
  `#qDiagramSvgHost` visible with a real `<svg>` inside).
- DOM semantic checks on every pass: exactly 4 `.cy-point` markers (A, B, C,
  D), exactly 4 `.cy-pointlabel` texts, exactly 2 `line.cy-axis` elements (X
  and Y), exactly 22 grid lines (11 columns + 11 rows) inside `.cy-grid`.
- All 8 combinations (dark/light theme × desktop/mobile viewport × question
  view/lightbox zoom) passed with no unexpected console/page errors (only
  the expected sandboxed Google-Fonts network block, ignored as in every
  prior run).
- Screenshots saved to `docs/workstream-4j-4833-visual-qa-screenshots/`
  (8 files). Spot-checked light-desktop-lightbox and dark-mobile visually
  this session — both render cleanly: legible axis/tick/point labels in both
  themes, correct point positions, theme-aware ink color. The dark-mobile
  screenshot incidentally makes the part-(i) defect visible at a glance: the
  diagram plainly places A at column 3, row 4 (option B, "(3, 4)"), while
  the question's own option A, "(4, 3)", is what's currently marked correct
  in `parts_json` — exactly the confirmed defect from workstream-4j,
  visible directly on the rendered card a student would see.
- Live `boardready.db` hash confirmed unchanged before/after the script run
  (`c59d0173ca227dc01708abc13eef988db8ac98f88c2813d9013de94246c2e885` both
  times) — this script never touches the live database beyond the initial
  read-only SELECT.

**Task 10: COMPLETED / PROPOSED**, with a load-bearing caveat: the visual
itself is ready as a faithful, browser-QA'd candidate, but this question
must NOT be promoted or live-associated until the content defects in
`docs/workstream-4j-4833-answer-key-defects.md` (parts i, iii, v) are
reviewed and resolved by someone with the authority to correct or confirm
the source's own answer key — this is a **CONTENT QA FIRST** item for
Task 15's queue, not a READY NOW one.
