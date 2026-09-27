# Question 4833 — Confirmed Answer-Key Defects (Batch 15, Task 10 offshoot)

**Status: fully read-only. No database write.** This document amends and
**partially retracts** `docs/workstream-4f-4833-investigation.md`'s Task 6
conclusion that "the database is correct in full for this question." That
conclusion was reached by trusting the printed answer key at face value,
after the prior batch's own independent pixel reconstruction was (wrongly)
judged to be in error. This session, while building Task 10's visual for
Fig. 6.19, re-did that pixel reconstruction with a materially more rigorous
method and it does **not** agree with the printed key on three of the five
sub-parts. This is disclosed as prominently as the original claim was made,
per this batch's standing discipline that a retraction gets the same
visibility as the finding it corrects.

**No live write is made or proposed by this document.** Question 4833 is
already correctly held out of gradable status (`status='transcribed'`,
`answer_status='needs_review'`) — nothing here changes live grading
behavior. This is a content-QA finding to be individually reviewed and
resolved (likely requiring a fresh look at the original textbook or a
publisher errata, not just a re-transcription) before any promotion, and is
carried into Task 13 (bank-wide answer-index audit) and Task 15 (production
queue) as its own line item, distinct from the 6 already-confirmed defects
processed under Task 5.

## Why the prior conclusion is being revisited

`workstream-4f` located and transcribed the printed answer key (page 6.26,
item 73: `(i)(a) (ii)(c) (iii)(c) (iv)(b) (v)(a)`) and found it matched the
database's stored `parts_json.correct` on all 5 parts, concluding there was
no defect. That comparison (key vs. database) is still accurate — the two
agree. What was not re-checked at that time is whether the key **itself**
is right, i.e. whether it agrees with what Fig. 6.19 actually draws. This
session did that check, with a substantially more rigorous method than the
prior batch's own retracted attempt (which the current investigation
suspects made a real gridline off-by-one error, though that no longer
matters — what matters is the new method's result stands on its own
verification, detailed below).

## Rigorous coordinate re-verification method

Rendered `source_library/CBSE/Mathematics/ch5-6.pdf`, file page index 18
(prints as 6.23), at high zoom. Two independent, cross-checked techniques
were used, not one:

1. **Gridline peak-detection.** The dark-pixel density of every image row
   and column was computed; local maxima above 30% of the peak density mark
   the pixel position of each of the grid's 11 vertical lines (columns 0-10)
   and 11 horizontal lines (rows 0-10). This gives an exact pixel-to-integer
   mapping for the whole grid, not an eyeballed one.
2. **Dot-marker isolation.** The four small filled-circle point markers
   (distinct from the decorative face icons drawn at each point, and from
   the thin gridlines they sit on) were isolated by morphological erosion:
   eroding the dark-pixel mask with a disk large enough to delete thin
   gridlines but small enough to leave the solid dot markers intact. Each
   surviving blob's centroid was computed.

Matching each dot centroid against the gridline grid from step 1, all four
land on a gridline intersection to within 0.5-3 pixels out of a ~161px grid
spacing — effectively exact, not approximate:

| point | column | row | i.e. |
|---|---|---|---|
| A | 3 | 4 | (3, 4) |
| B | 6 | 7 | (6, 7) |
| C | 9 | 4 | (9, 4) |
| D | 7 | 2 | (7, 2) |

This was visually re-confirmed directly against a clean crop of the whole
figure (`extracted-diagrams/cbse-mathematics-co-ordinate-geometry-845687ea-item73-courtyardgrid-CANDIDATE.png`,
sha256 `ab1af38854f2c37fd7a8205059c65bc425fc60a77018181f21e6614df0d2a160`) —
each point's marker dot sits at the labeled cell corner exactly matching the
table above; there is no ambiguity in reading it directly off the image
either.

## Cross-checks against the question's own other parts (not just the key)

Rather than rely on the pixel measurement alone, the derived coordinates
were tested against what the question's *other* stored answers require to
be true — a check the prior investigation did not perform:

- **Part (iv) — Area of △ABC.** Using A(3,4), B(6,7), C(9,4), the shoelace
  formula gives area = 9 sq. units exactly, matching the stored/keyed answer
  ("(b) 9 sq. units"). (Note: this specific check does not by itself
  distinguish A=(3,4) from the key's claimed A=(4,3) — both happen to give
  area 9 for this particular triangle. It confirms B and C, not A.)
- **Part (ii) — "the figure ABCD is NOT a ___".** This check *does*
  distinguish the two readings of A. With A=(3,4): side AB has slope 1,
  side CD has slope 1 (parallel), while BC (slope −1) and DA (slope −0.5)
  are not parallel to each other — a genuine trapezium, making "not a
  parallelogram" a uniquely correct answer among the four options (it is
  also technically "not a rhombus" and "not a square", but the question's
  premise of a single correct answer is only satisfiable because it *is* a
  trapezium and only fails to be the other three). Substituting the key's
  claimed A=(4,3) instead (B, C, D unchanged) produces a quadrilateral with
  **no pair of parallel sides at all** — every one of rhombus/square/
  parallelogram/trapezium would then be a correct "NOT" answer, which is
  incompatible with this being a single-answer MCQ. This is independent
  mathematical evidence — not a second pixel reading — that (3,4) is the
  figure's real point, consistent with the direct measurement.

## Confirmed defect 1 — Part (i): the printed key (and stored `correct`) is wrong

Stored `parts_json[0]`: options `["(4, 3)", "(3, 4)", "(3, 3)", "(4, 4)"]`,
`correct: 0` → `(4, 3)`. Printed key: `(a)` → also `(4, 3)`. The diagram
itself draws A at **(3, 4)** — option index **1**, not 0. This is now a
doubly-confirmed defect: the direct pixel measurement and the independent
part-(ii)-consistency check both point to (3,4), and neither the database
nor the printed source key has it right.

## Confirmed defect 2 — Part (iii): the key is self-contradictory with part (ii), independent of any measurement

Stored `parts_json[2]`: options `["2", "3", "0", "1"]`, `correct: 2` → `"0"`
(distance between the mid-points of diagonals AC and BD is 0). But a
distance of exactly 0 between the two diagonals' midpoints is precisely the
condition for a quadrilateral's diagonals to bisect each other — which by
definition makes it a **parallelogram**. Part (ii)'s own stored/keyed answer
says the figure is explicitly **NOT** a parallelogram. These two stored
answers cannot both be true of the same figure; the key contradicts itself
before any pixel measurement is even brought in.

Using the measured coordinates as a further check: midpoint of AC =
((3+9)/2, (4+4)/2) = (6, 4); midpoint of BD = ((6+7)/2, (7+2)/2) =
(6.5, 4.5); distance = √0.5 ≈ 0.707 — matching none of the four given
options (2, 3, 0, 1) either. Substituting the key's claimed A=(4,3) instead
gives distance = 1 (option index 3), which is a real option but still not
the key's own claimed index 2 ("0"). No reading of A reconciles part (iii)'s
stated answer with part (ii)'s.

## Confirmed defect 3 — Part (v): the claimed perimeter does not match either reading of the figure

Stored `parts_json[4]`: options `["4√13", "3√13", "2√13", "13"]`,
`correct: 0` → `4√13 ≈ 14.42`. Computed perimeter of ABCD using the measured
coordinates A(3,4), B(6,7), C(9,4), D(7,2):

- AB = √((6−3)²+(7−4)²) = √18 = 3√2
- BC = √((9−6)²+(4−7)²) = √18 = 3√2
- CD = √((7−9)²+(2−4)²) = √8 = 2√2
- DA = √((3−7)²+(4−2)²) = √20 = 2√5
- Perimeter = 8√2 + 2√5 ≈ 15.78

This is not a multiple of √13 and does not match any of the four given
options. Substituting the key's claimed A=(4,3) instead (recomputing AB and
DA only) gives perimeter = 2√5 + 3√2 + 2√2 + √10 ≈ 14.71 — closer to
4√13 ≈ 14.42 but still not an exact match. Neither reading of the figure
reproduces the keyed answer exactly.

## What is NOT claimed here

- This is not a claim that B, C, or D are wrong — both cross-checks above
  (area and the parallel-sides consistency of part ii) corroborate B, C,
  and D as measured, and the gridline-intersection match for all four
  points was equally tight (0.5-3px out of ~161px spacing).
  Part (v)'s mismatch is flagged as unresolved, not attributed to a specific
  wrong coordinate — it may be a genuine defect in the source book's own
  key/options (as parts i and iii demonstrably are), or it may indicate a
  more subtle transcription issue in this specific sub-part's options that
  would need the original textbook or a publisher errata sheet to resolve
  with full confidence. It is reported as **unresolved**, not silently
  assumed to be either "database wrong" or "acceptable as-is."
- No `parts_json.correct` value is changed by this document. Question
  4833's `status`/`answer_status` remain untouched (`transcribed` /
  `needs_review`) — exactly where they already were, correctly reflecting
  that this question is not yet fit for promotion.
- This is a single-question finding. It does not imply every case-study
  question sourced from `chap_5-6.pdf` has the same problem — no other item
  from this source document was re-examined at this level of rigor in this
  session (see Task 13/14 for the bank-wide, appropriately-scoped follow-up).

## Disposition

Recommended queue placement (see Task 15 for the full production queue):
**CONTENT QA FIRST** (not READY NOW, not simply BLOCKED-on-visual) — the
visual built for Task 10 (`docs/workstream-4k-4833-visual-provenance-and-qa.md`)
faithfully reproduces the diagram exactly as printed and is proposed
independently of this finding, but the question's own parts (i), (iii), and
(v) need a human content reviewer with access to the original textbook or
its errata before this question can be promoted to any gradable status.
