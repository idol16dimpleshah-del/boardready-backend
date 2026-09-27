# Geometry Visual Reconstruction — Questions 1594 and 1230 (Workstream 3I, Task 4 of batch)

**Status: read-only with respect to the live database. Two proposed
`ai_generated` SVGs built and end-to-end browser-tested against a disposable
database. No `visual_assets` row has been created for either question on the
live database, and neither question's `diagram_status` has changed.** This
follows the same discipline as Workstream 3D (4575): build and prove the
visual first, decide on live association later, as its own separate,
explicit step.

**Live database SHA-256 before and after this workstream (unchanged — every
step that touches a real database uses a disposable one; the only touch of
the live database is two read-only SELECTs to copy 1594's and 1230's content
into the disposable fixture):**
`99aa70be67603cd97ad130dfabd923b81f9f69a2d2165fb777d34c8e55fe24` — see the
verification script's own before/after hash print for the exact value
(`99aa70be67603cd97ad130dfabd923b81f9f69a2d2165fb777d299324c8e55fe24`,
unchanged from the end of Workstream 3F).

Why it is safe to build these now, even though neither question's `status`/
`answer_status` has been promoted (Workstream 3G's proposal is still
pending your approval): this mirrors the established 4575 precedent exactly
— 4575's visual was built, tested, and even given a live `visual_assets`
association while its `status` remained (and still remains) `transcribed`.
Visual work and content-promotion are independent axes; building a visual
does not require promotion, only that the answer has been independently
verified (both 1594 and 1230 were, in Workstream 3E).

## 1594 — circle diagram (`icse-mathematics-angle-and-cyclic-properties-of-circle-1adba987`)

### Source figure

`source_library/ICSE/Mathematics/chap_17.pdf`, printed page 17.4, item (22).
Re-inspected directly from the rendered source page this session (not
reused from memory) after first mistakenly cropping a neighboring, unrelated
circle problem (item 21, whose diagram also uses points A/B/C/D/O and a
dashed diagonal, but from D to B, not A to C) — caught and corrected before
use by re-cropping the correct region and re-confirming against the item's
own printed text.

Every mathematically meaningful element, confirmed directly against the
rendered page:
- AB is a diameter (A left, B right), with centre O marked on it by a dot.
- D and C lie on the arc above AB — D left of centre, C right of centre.
- Chords AD, DC, and CB are drawn (solid), forming cyclic quadrilateral
  ADCB, in addition to the circle itself.
- DC is parallel to AB, shown by a ">>" double-arrowhead tick mark on each
  segment (on AB, next to O; on DC, near its midpoint).
- A dashed diagonal joins A to C.
- The angle between ray AB and the dashed diagonal AC is marked 35° at
  vertex A. No other angle, length, or point is given in the source figure.

### What the redraw must reproduce exactly vs. where it may simplify

**Must preserve (semantic, load-bearing):** the diameter; D left of centre
and C right of centre on the upper arc; DC ∥ AB with the same tick-mark
convention; the dashed diagonal from A to C specifically (not D to B); the
35° angle at A between AB and AC; no other angle values invented or omitted.

**May simplify (disclosed, does not affect the answer):** exact pixel
proportions. The source sketch is not drawn to scale — by eye its angle at A
looks larger than 35°, an ordinary textbook-sketch imprecision (the same
"no scale" allowance already used for 4575's graph). The redraw instead
places C at exactly 70° around the circle from the positive x-axis (measured
from the centre) and D as its mirror image across the vertical through the
centre — for a diameter AB and a point C on the circle at angle θ from the
centre, angle CAB = θ/2 exactly (a standard half-angle identity), so this
placement makes the *drawn* angle at A exactly 35°, and D's mirror-image
placement is not a simplification at all but a mathematical necessity (any
chord parallel to a horizontal diameter must be symmetric about the vertical
through the centre). The redraw is therefore slightly more geometrically
precise than the source sketch while changing no given fact.

### Generated asset

`extracted-diagrams/icse-mathematics-angle-and-cyclic-properties-of-circle-1adba987-item22-circle-GENERATED.svg`
SHA-256: `009a48f1fea89d837a78508b470a0fabca18d37c2bf071d7953a3c2eb26f744c`

Source-cropped reference (asset_type `source_cropped`, if approved):
`extracted-diagrams/icse-mathematics-angle-and-cyclic-properties-of-circle-1adba987-item22-circle-CANDIDATE.png`
SHA-256: `875ba6e349531788af9f54732f125fba588d65d79623a679a88dbc6544ba95c2`

XML-validated (`xml.etree.ElementTree.parse`): OK.

## 1230 — triangle diagram (`icse-mathematics-locus-and-construction-c23699f9`)

### Source figure

`source_library/ICSE/Mathematics/chap_19.pdf`, printed page 19.6, item (33),
an Assertion & Reasoning item. Re-inspected directly from the rendered
source page this session.

Every mathematically meaningful element, confirmed directly against the
rendered page:
- Triangle ABC: A at the apex, B bottom-left, C bottom-right.
- D lies on BC, marked as its midpoint by two equal tick marks (one on BD,
  one on DC) — matching the assertion's own text.
- Segment AD is drawn from A straight down to D, with an explicit
  right-angle (small square) mark at D.
- A point E is marked on AD, strictly between A and D.
- No other point, angle value, or length is given.

### What the redraw must reproduce exactly vs. where it may simplify

**Must preserve:** D as the midpoint of BC (equal tick marks); AD ⊥ BC
(right-angle mark at D); E on segment AD, strictly between A and D.

**May simplify (disclosed, does not affect the answer):** the exact
fractional position of E along AD — the source doesn't assert one, only
"E lies on AD," so any position strictly between A and D is faithful; the
redraw places it roughly a third of the way down from A, matching the
source's own rough proportions closely enough to be recognizable without
claiming a precision the source itself doesn't assert. The triangle's exact
base/height proportions are similarly illustrative, not given facts. One
additional deliberate legibility choice: point E is rendered in the violet
accent color (rather than the same ink color as A/B/C/D) purely to help a
student's eye find the specific point the assertion is about — a visual
emphasis choice, not a claim about E's mathematical status.

### Generated asset

`extracted-diagrams/icse-mathematics-locus-and-construction-c23699f9-item33-triangle-GENERATED.svg`
SHA-256: `7680a14c93fe1140d07354b0ce2d95ed0e627752e49dc77e2159af52ad69a8ff`

Source-cropped reference (asset_type `source_cropped`, if approved):
`extracted-diagrams/icse-mathematics-locus-and-construction-c23699f9-item33-triangle-CANDIDATE.png`
SHA-256: `d04bdca220e9eb60dbd44aff9d663ae8f12bacf19d531c7db1d63b71b684f193`

XML-validated: OK.

## End-to-end browser proof

`scripts/verify-1594-1230-visual-rendering.js` — same discipline as
`verify-3070-visual-rendering.js`/`verify-4575-visual-rendering.js`: reads
each question's real content from the live database read-only, provisions a
brand-new disposable database via `setupPrimaryTestDbEnv`, seeds one ICSE
Mathematics subject with one fixture chapter per question (faithful copies
of the live rows) plus `source_cropped` (inserted first, lower id) and
`ai_generated` `visual_assets` rows for each, spawns the real server, and
drives a real Chromium browser through the exact 8 combinations used for
3070 and 4575, per question (16 checks total): `{dark, light}` theme ×
`{desktop, mobile}` viewport × `{question view, lightbox}`.

**Result: all 16 checks passed on the first run.** For each: the raster
`<img>` stayed hidden with no `src`, the SVG host was visible and contained
a real inlined `<svg>`, the API's `diagramUrl` resolved to the `ai_generated`
SVG (not the `source_cropped` PNG) confirming the server's priority-order
rule, and figure-specific DOM assertions passed — 1594: exactly one
`.cy-circle`, exactly one `.cy-diagonal`, and a "35" angle label present;
1230: exactly one `.tr-side` triangle path, exactly one `.tr-rightangle`
mark, and exactly one `.tr-point-e` (point E). No browser console/page
errors beyond the sandbox's own Google-Fonts network block (the same
unrelated, pre-existing noise filtered in every prior proof script).

Screenshots (16 total, all visually reviewed and confirmed legible and
correct) are in
`docs/workstream-3i-1594-1230-visual-qa-screenshots/{1594-circle,1230-triangle}-{question,lightbox}-{dark,light}-{desktop,mobile}.png`.
Spot-checked highlights: the circle's dashed violet diagonal and ">>" tick
marks on AB/DC are clearly visible and correctly colored in both themes; the
triangle's right-angle mark, equal-segment ticks, and violet point E are
legible on mobile at 390px width in both themes; the lightbox zoom renders
both figures correctly enlarged with no clipping.

**Live database SHA-256 confirmed unchanged before and after this script
run** (printed by the script itself in its `finally` block, matching the
value recorded at the top of this document).

## What was deliberately NOT done

- No `visual_assets` row was inserted into the live database for either
  question.
- No `diagram_status` change for either question — both remain
  `needs_visual_review`, confirmed by an assertion inside the verification
  script itself (it aborts if either question's live `diagram_status` has
  drifted from that expected value).
- No live association decision was made. Per the same pattern used for
  4575 (build → prove → then a separate, later, explicit guarded-association
  step), the next step for either or both of these — if and when you want
  it — is its own guarded `apply-*-visual-association.js` script, mirroring
  `apply-4575-visual-association.js`, run only on explicit approval.
- Neither question's `status`/`answer_status` was touched by this workstream
  (that remains Workstream 3G's pending, separate decision).
