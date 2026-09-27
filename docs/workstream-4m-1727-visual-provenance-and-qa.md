# Visual Reconstruction — Question 1727 (Batch 15, Task 12)

**Status: proposed. NOT live-associated.** Question 1727's `diagram_status`
remains `needs_visual_review` — no `visual_assets` rows are inserted into
the live database.

## The question

`icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6` (id 1727),
ICSE Mathematics, Volume and Surface Area of Solids, `sub_concept='Cylinder
CSA, rotating about each side'`, `source_document_id=52` (`chap_20.pdf`),
`source_page='20.5'`, `source_question_number='21'`.

Text: "A rectangular sheet of paper of size 11 cm × 7 cm is first rotated
about the side 11 cm and then about the side 7 cm to form a cylinder, as
shown in the diagram. The ratio of their curved surface areas is:" Options:
`1:1 / 7:11 / 11:7 / (11π/7):(7π/11)`, stored `correct = 0` (→ 1:1).

Content check (informational only — this task does not promote the
question): curved surface area = circumference × height in either
construction, so rotating about the 11 cm side gives CSA = 7 × 11 = 77, and
rotating about the 7 cm side gives CSA = 11 × 7 = 77 — always equal
regardless of which side is the axis. This is consistent with the stored
answer, independently confirmed this session by direct calculation, not
merely assumed. No answer-index concern found for this question.

## Source evidence

`source_library/ICSE/Mathematics/chap_20.pdf`, file page index 2 (prints as
page 20.5), item (21) (sha256 of the source PDF
`9d27e6bbb4bc6fda2c9ee3e06dba7822d747320271075aeebebf62a78fafcf48`). Rendered
at 10x zoom directly from the PDF this session.

The figure: three shapes left to right, connected by two rightward arrows —
a plain rectangle labelled 7 cm (left side) and 11 cm (bottom); a vertical,
upright cylinder (open top/bottom drawn as full ellipses joined by two
vertical side lines) labelled 7 cm along its height; and a horizontal
cylinder lying on its side (end ellipses joined by two horizontal side
lines, left end drawn as a double ellipse suggesting the rolled paper's
visible edge) labelled 11 cm along its length. Notably, the source presents
the two cylinders in the order 7cm-axis-then-11cm-axis, the reverse of the
question text's own stated order (11cm rotation described first) — a minor,
harmless presentation quirk since the question only asks for the *ratio*
of the two areas, not which one is shown first.

A clean crop of just this figure is saved as the immutable `source_cropped`
reference:
`extracted-diagrams/icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6-item21-tworectanglecylinders-CANDIDATE.png`.

## The redraw

`extracted-diagrams/icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6-item21-tworectanglecylinders-GENERATED.svg`.
Full source correspondence and every design decision is documented inline
in the SVG's own HTML comment; summarized here:

- Same three shapes, same order (7cm-axis cylinder before 11cm-axis
  cylinder, preserving the source's actual figure order rather than
  reordering to match the question text), same two connecting arrows, same
  labels in the same positions.
- **Disclosed decision on scale**: the source draws both cylinders as
  schematic, not-to-scale sketches (the vertical cylinder's drawn diameter
  is visibly larger relative to its height than the true 7-height/
  11-circumference proportions would produce). Unlike this batch's
  triangle/angle-bisector redraws (1508, 1231), where an exact stated ratio
  was used to place points precisely, there is no comparable "exact
  construction" fact to enforce here — this is a qualitative before/after
  illustration, not a figure a student measures. This redraw preserves the
  source's own schematic proportions rather than inventing a different,
  more "correct" scale.

## Browser QA — 8/8 combinations passed

`scripts/verify-1727-visual-rendering.js` (modeled on
`scripts/verify-1508-visual-rendering.js`): isolated, disposable test
database (never `boardready.db`), a real `node server.js`, a real Chromium
browser (Playwright) driven through the exact steps a student would take.

Verified:
- API level: `diagramUrl` resolves to the `ai_generated` SVG.
- Frontend takes the inline-SVG path (`#qDiagramImg` hidden with no `src`;
  `#qDiagramSvgHost` visible with a real `<svg>` inside).
- DOM semantic checks on every pass: exactly 1 `rect.rcy-shape` (the
  original rectangle), exactly 5 `<ellipse>` elements (2 vertical-cylinder
  rims + 2 horizontal-cylinder outer rims + 1 inner rim), exactly 1
  `.rcy-shape-thin` (the horizontal cylinder's inner rim), exactly 4
  `.rcy-arrow` paths (2 arrows × line+arrowhead), exactly 4 `.rcy-label`
  texts.
- All 8 combinations (dark/light theme × desktop/mobile viewport × question
  view/lightbox zoom) passed with no unexpected console/page errors (only
  the expected sandboxed Google-Fonts network block, ignored as in every
  prior run).
- Screenshots saved to `docs/workstream-4m-1727-visual-qa-screenshots/`
  (8 files). Spot-checked light-desktop-lightbox visually this session —
  renders cleanly and legibly at full size, matching the source figure's
  layout and order exactly.
- Live `boardready.db` hash confirmed unchanged before/after the script run
  (`c59d0173ca227dc01708abc13eef988db8ac98f88c2813d9013de94246c2e885` both
  times) — this script never touches the live database beyond the initial
  read-only SELECT.

**Task 12: COMPLETED / PROPOSED.** No live association performed — 1727's
`diagram_status` remains `needs_visual_review`; this visual is ready as a
candidate for a future association task once that gate clears.
