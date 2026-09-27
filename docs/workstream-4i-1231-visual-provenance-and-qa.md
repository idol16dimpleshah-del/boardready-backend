# Visual Reconstruction — Question 1231 (Batch 15, Task 9)

**Status: proposed. NOT live-associated.** Question 1231's content status
(`status='transcribed'`, `answer_status='source_provided'`) has not
independently cleared the publication gate — no `visual_assets` rows are
inserted into the live database and `diagram_status` remains untouched at
`needs_visual_review`.

## The question

`icse-mathematics-locus-and-construction-4078b869` (id 1231), ICSE
Mathematics, Locus and Construction, `sub_concept='Assertion and
reasoning'`, `source_document_id=41` (`chap_19.pdf` — the same source
document as question 1230, one item later), `source_page='19.6'`,
`source_question_number='34'`.

Assertion (A): "In the figure, rays BA and BC are drawn from B with angle
ABD = angle CBD (BD bisects angle ABC), E is a point on ray BA, D and F lie
such that ED is perpendicular to BA and DF is perpendicular to BC. Then DE
= DF." Reason (R): "Every point on the angle bisector of two intersecting
lines is equidistant from the lines." Options: the 4 standard
assertion/reason combinations, stored `correct = 2` (→ "Both A and R are
true").

## Source evidence

`source_library/ICSE/Mathematics/chap_19.pdf`, file page index 4 (prints as
page 19.6), item (34) — immediately below item (33), which is question
1230's own figure on the same page (`sha256` of the source PDF:
`6dc719d496b7058dd546e83e8beb6468c27192c29319ea4e8d2e5eec70a27830`).

The figure, read directly from the PDF at 9–20x zoom this session: vertex B
with two open rays drawn from it — ray BA (steeper) ending in an arrowhead
labeled A, and ray BC (shallower, roughly horizontal) ending in an
arrowhead labeled C — plus a third, unlabeled ray from B lying between them
(the bisector), also ending in its own open arrowhead. Point D is marked on
this bisector ray. Point E is marked on ray BA, with segment ED drawn to D.
Point F is marked on ray BC, with segment DF drawn to D. **Zoomed
separately into both E and F at 20x zoom: the source draws no explicit
right-angle (small square) mark at either point**, despite the assertion's
text asserting both perpendicularity conditions — confirmed directly from
the scan, not assumed.

A clean crop of just this figure
(`extracted-diagrams/icse-mathematics-locus-and-construction-4078b869-item34-anglebisector-CANDIDATE.png`,
sha256 `7da5a6f2a77304b06557a5838dcb914ae53bc1e8f0c33e01dfa70e3efa095bed`) is
saved as the immutable `source_cropped` reference evidence.

## The redraw

`extracted-diagrams/icse-mathematics-locus-and-construction-4078b869-item34-anglebisector-GENERATED.svg`
(sha256 recorded in the file's own history; see git). Full source
correspondence and every design decision is documented inline in the SVG's
own HTML comment; summarized here:

- Same structure as the source: three rays from B (BA, BC, and an
  unlabeled bisector ray), each ending in an open arrowhead; D on the
  bisector ray; E on ray BA with segment ED to D; F on ray BC with segment
  DF to D.
- **No right-angle marks added at E or F** — the source itself omits them,
  and adding marks the source doesn't have would be adding information,
  not faithfully reproducing it. This mirrors the same "preserve the
  source's own notation" principle already applied to question 1508's
  redraw (kept the source's arrow-based parallel notation rather than
  substituting tick marks).
- **Disclosed geometric construction**: E and F are computed analytically
  as the exact feet of the perpendiculars dropped from D onto ray BA and
  ray BC respectively (not eyeballed from the source sketch), which
  guarantees DE and DF are drawn at exactly equal length in this redraw
  (both computed at 126.05 SVG units — verified programmatically before
  drawing, shown in the calculation below). This is exactly what the
  Reason (R) asserts follows from D lying on the bisector, and mirrors the
  same disclosed scale-correction already used for 1230 (D placed at BC's
  exact midpoint) and 1508 (D, E placed at the exact 3:1 point) rather than
  reproducing a sketch's own imprecision. No content is added, removed, or
  contradicted — the redraw only makes the drawn lengths consistent with
  what the text already asserts.

Verification of the construction (computed directly, not asserted):
with B=(90,430), ray BA at 58° above horizontal, ray BC at 0°, bisector at
29° (half of 58°, matching "BD bisects angle ABC"), D placed 260 units from
B along the bisector — E (foot of perpendicular from D onto BA) and F (foot
of perpendicular from D onto BC) both come out to distance **126.05** from
D, confirmed by direct computation before the SVG was drawn.

## Browser QA — 8/8 combinations passed

`scripts/verify-1231-visual-rendering.js` (modeled directly on
`scripts/verify-1508-visual-rendering.js`): isolated, disposable test
database (never `boardready.db`), a real `node server.js`, a real Chromium
browser (Playwright) driven exactly as a student would use the app.

Verified:
- API level: `diagramUrl` resolves to the `ai_generated` SVG.
- Frontend takes the inline-SVG path (`#qDiagramImg` hidden with no `src`;
  `#qDiagramSvgHost` visible with a real `<svg>` inside).
- DOM semantic checks on every pass: exactly 3 `.ab-ray` lines (BA, BC,
  bisector), exactly 2 `.ab-seg` lines (ED, DF), exactly 4 `.ab-point`
  markers (B, D, E, F), exactly 3 `.ab-arrow` arrowheads.
- All 8 combinations (dark/light × desktop/mobile × question view/lightbox)
  passed with no unexpected console/page errors (only the expected
  sandboxed Google-Fonts network block, ignored as in every prior run).
- Screenshots saved to `docs/workstream-4i-1231-visual-qa-screenshots/`
  (8 files). Spot-checked light-desktop visually this session — renders
  correctly, labels legible, geometry matches the source figure's layout.
- Live `boardready.db` hash confirmed unchanged before/after the script run
  (`c59d0173ca227dc01708abc13eef988db8ac98f88c2813d9013de94246c2e885` both
  times).

**Task 9: COMPLETED / PROPOSED.** No live association performed — 1231's
content status has not independently cleared the publication gate.
