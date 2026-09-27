# Workstream 3E — Content QA: Geometry Candidates 1594 and 1230

**Status: independent verification complete, read-only. No live database
write has been made.** This follows the Workstream 3A methodology exactly:
source question → independent answer verification → diagram verification →
(only if it becomes gradable) visual reconstruction specification. Per your
instruction, only a question that becomes legitimately gradable should have
its adapted visual enter the production association pipeline — neither
question below is being promoted to gradable by this document; that is a
separate, explicit content-QA governance decision, not made here.

**Live database SHA-256 before and after this workstream (unchanged — every
check below was read-only):**
`e2743e0d92c76ddd40cc9f4e371ccd61de6aab9100379d02b775cff4ae55fe24`

A related, more urgent finding surfaced while re-confirming the
`correct`-index convention this workstream depends on — see
`docs/workstream-3e-4575-answer-key-defect-found.md` (a real answer-key
defect on the already-live 4575, unrelated to geometry, reported
separately).

## Method

Both 1594 and 1230's source chapters (`chap_17.pdf`, `chap_19.pdf`) were
checked for an answer-key section (as `ch1-2.pdf` has for 4575) —
**neither chapter contains one** (confirmed by scanning every page's
extracted text for "ANSWER" — no match in either 14-page or 5-page
document). So unlike 4575, there is no external printed answer to check
the stored `correct` value against. The verification here is therefore a
from-scratch mathematical derivation from the diagram and given facts,
exactly as Workstream 3A did for the two number-line/linear-inequation
corrections when no cleaner source signal was available, cross-checked by
deriving each result two independent ways where possible.

## 1594 — Angle and Cyclic Properties of Circle

- **Source:** `chap_17.pdf`, printed page 17.4, item (22). Diagram (already
  rendered and confirmed in Workstream 3C): circle with diameter AB, centre
  O; points D (upper-left) and C (upper-right) on the arc; DC drawn
  parallel to AB (matching arrow tick-marks on both); a dashed chord AC;
  ∠CAB = 35° marked at A.
- **Given:** AB is a diameter; ∠CAB = 35°; AB ∥ DC.
- **Find:** ∠DAC.
- **Stored in DB:** `options_json = ["125°","35°","20°","55°"]`,
  `correct = 2` → "20°".

**Independent derivation (two ways):**

*Way 1 — via side AD as transversal.* AB is a diameter, so any inscribed
angle subtending it is 90°: ∠ACB = 90°. In triangle ABC: ∠BAC = 35°,
∠ACB = 90°, so ∠ABC = 180 − 35 − 90 = 55°. AB ∥ DC with AD as transversal:
∠DAB and ∠ADC are co-interior (same-side interior) angles, so ∠DAB + ∠ADC
= 180°. ABCD is a cyclic quadrilateral (all four points on the circle, in
that cyclic order), so opposite angles ∠ABC and ∠ADC sum to 180°: ∠ADC =
180 − 55 = 125°. Substituting back: ∠DAB = 180 − 125 = 55°. Since C lies
between rays AD and AB as drawn, ∠DAB = ∠DAC + ∠CAB, so ∠DAC = 55 − 35 =
**20°**.

*Way 2 — via side BC as transversal (independent cross-check).* Same
∠ABC = 55° as above. AB ∥ DC with BC as transversal: ∠ABC and ∠BCD are
co-interior, so ∠BCD = 180 − 55 = 125°. Cyclic quadrilateral: opposite
angles ∠DAB and ∠BCD sum to 180°, so ∠DAB = 180 − 125 = 55°. Same result:
∠DAC = 55 − 35 = **20°**.

Both derivations agree: **20°, option (c), index 2** — matching the
currently-stored `correct = 2` exactly. **No defect found.** The diagram
and given facts fully determine the answer, and the figure Workstream 3C
already confirmed exists is sufficient and unambiguous — no missing
information, no alternative reading that changes the result.

**Diagram verification:** unchanged from Workstream 3C — a genuine,
precisely-specifiable circle diagram exists at the cited page, matching the
question's own text exactly.

**Visual reconstruction specification** (prepared for reference; not acted
on, since this question is not yet gradable — see disposition below): a
native SVG redraw would need to preserve exactly what Workstream 3C
documented — circle with diameter AB and centre O; D and C on the arc above
AB (D left of centre, C right); DC parallel to AB (shown via matching
arrowhead tick marks, not merely visual parallelism); dashed diagonal chord
AC; the 35° angle marked at vertex A between AB and AC; no other angle
values printed in the figure.

## 1230 — Locus and Construction (Assertion & Reasoning)

- **Source:** `chap_19.pdf`, printed page 19.6, item (33). Diagram (already
  confirmed in Workstream 3C): triangle ABC, D the midpoint of BC (equal
  tick marks on BD/DC), AD ⊥ BC (right-angle mark at D), point E on segment
  AD between A and D.
- **Assertion (A):** D is the midpoint of BC and AD ⊥ BC. If E lies on AD,
  then BE = CE.
- **Reason (R):** Every point on the perpendicular bisector of a line
  segment is equidistant from its end points.
- **Options:** (a) A true, R false (b) A false, R true (c) Both true
  (d) Both false.
- **Stored in DB:** `correct = 2` → "Both A and R are true."

**Independent derivation:** D is the midpoint of BC and AD ⊥ BC, which is
exactly the definition of AD being the perpendicular bisector of segment
BC. E is given to lie on AD, i.e. on that perpendicular bisector. By the
perpendicular bisector theorem — which is Reason R, stated correctly and in
full generality — every point on the perpendicular bisector of a segment is
equidistant from the segment's endpoints. Applying it directly to E gives
BE = CE, which is exactly Assertion A. So **A is true, R is true, and R is
the direct justification for A** — under this option set (which, unlike
some other assertion/reason items in the same chapter, does not ask whether
R is "the correct explanation," only whether each is true), the answer is
**(c) Both A and R are true, index 2** — matching the currently-stored
`correct = 2` exactly. **No defect found.**

**Diagram verification:** unchanged from Workstream 3C — the figure exists
and matches the assertion's own description exactly (D midpoint of BC, AD
⊥ BC, E on AD).

**Visual reconstruction specification** (prepared for reference only, not
acted on): triangle ABC (A apex, B/C at the base); D on BC marked as
midpoint via equal tick marks on BD and DC; segment AD from A to D with an
explicit right-angle mark at D; point E placed on AD strictly between A and
D (its exact fractional position is not asserted by the question, so any
reasonable placement is faithful).

## Disposition — neither question is promoted here

Both 1594 and 1230's stored `correct` values check out under independent,
source-backed mathematical verification, with no defect found in either.
**This does not change either question's `status` or `answer_status`** —
per the standing rule against bulk-promoting content, and consistent with
your instruction that only a question that becomes *legitimately gradable
through the existing content-QA promotion process* should proceed to visual
association. This document is that verification's evidence trail, not a
promotion action. Whether to formally promote `answer_status` (and/or
`status`) for these two, given the verification above, is a decision for
you — if approved, it would be its own small, explicit, guarded write
(mirroring the 3033/3070 pattern), separate from any visual work.

Neither question's diagram_status, visual_assets, or any other row was
touched. No visual (SVG or otherwise) was generated for either candidate in
this workstream, consistent with "only after a question becomes legitimately
gradable should its adapted visual enter the production association
pipeline."

## Next: Chemistry, kept separate

Per your instruction, Chemistry (819 and its backups) is deliberately not
addressed in this document — chemistry diagrams/structures carry different
fidelity considerations than mathematical geometry diagrams (a labelled
apparatus schematic vs. a proof-derived angle diagram) and, per Workstream
3C, 819 additionally has an answer-key **format** gap (a fill-in item,
`answer_status = unavailable`, not a wrong-index defect like 4575) rather
than a wrong-value defect — a different kind of problem needing its own
resolution path. It is intentionally queued as its own separate piece of
work, not started here.
