# Correction Record — Question 4833, Part (i) Only (Batch 15A, Task 1)

**Scope of this write: exactly one field.** `parts_json[0].correct`
(case part "(i) The coordinates of point A are") changes from `0` to `1`.
No other part of 4833's `parts_json`, and no other column on the row, is
touched. `status` and `answer_status` are **not** promoted by this write —
they remain `transcribed`/`needs_review`, because two further defects in
this same question (parts iii and v) are not resolved by this correction
and are not mechanically resolvable at all (see below). This question does
not become gradable as a result of this write.

## Evidence (established in `docs/workstream-4j-4833-answer-key-defects.md`, re-verified against the live row before writing)

Live `parts_json[0]` before this write:
```
{ "text": "(i) The coordinates of point A are",
  "options": ["(4, 3)", "(3, 4)", "(3, 3)", "(4, 4)"],
  "correct": 0, "marks": 1 }
```
`correct: 0` → option "(4, 3)". Two independent lines of evidence, developed
in Task 10/workstream-4j, show the figure's actual point A is (3, 4) —
option index 1, not 0:

1. **Direct pixel measurement.** Gridline peak-detection (exact pixel
   position of all 11×11 gridlines from column/row dark-pixel density) plus
   morphological-erosion isolation of the four dot markers' centroids placed
   A at grid coordinate (3, 4), within 0.5–3px of the intersection out of
   ~161px spacing — not an eyeballed reading.
2. **Internal consistency with part (ii).** Part (ii)'s own stored/keyed
   answer says ABCD is "not a parallelogram" (and, by the single-answer
   premise of an MCQ, is also not a rhombus or square — only a trapezium
   reading is consistent). With A=(3,4), AB and CD are both slope 1
   (parallel) while BC and DA are not parallel to each other — a genuine
   trapezium, exactly matching part (ii). Substituting the key's claimed
   A=(4,3) instead produces a quadrilateral with **no parallel sides at
   all**, which would make every one of rhombus/square/parallelogram/
   trapezium a correct "NOT" answer — incompatible with part (ii) having a
   single correct answer. This is independent mathematical evidence, not a
   second pixel reading, and it agrees with the pixel measurement.

Both lines of evidence agree: the diagram's actual point A is (3, 4), option
index **1**. The printed source key and the stored database value both say
(4, 3) (index 0) — both are wrong, corroborated two independent ways.

## Why parts (iii) and (v) are NOT touched by this or any write

Both were re-checked using the confirmed correct coordinates A(3,4), B(6,7),
C(9,4), D(7,2):

- **Part (iii)** ("distance between the mid-points of AC and BD"): computed
  distance ≈ 0.707, which is not among the four given options (`2,3,0,1`) —
  no index value would make the stored `correct` field point at a right
  answer, because no right answer exists among the options as transcribed.
  Additionally, the key's actual claimed answer ("0") is self-contradictory
  with part (ii) on its own terms (distance 0 between diagonal midpoints is
  the definition of a parallelogram, which part (ii) says ABCD is not) —
  this contradiction holds regardless of which coordinate reading of A is
  used.
- **Part (v)** ("Perimeter of quadrilateral ABCD"): computed perimeter
  8√2 + 2√5 ≈ 15.78, not a match to any option (`4√13,3√13,2√13,13`, all
  multiples of √13 ≈ 3.606). Substituting the key's claimed A=(4,3) instead
  gives ≈14.71 — closer to 4√13≈14.42 but still not an exact match under
  either reading.

There is no `correct` index this audit can write for parts (iii) or (v)
that is actually supported by the question's own stated options — writing
one anyway would mean guessing, not correcting. **These two sub-defects are
recorded as NEEDS HUMAN REVIEW**: resolving them requires either the
original textbook's errata/second edition, or a content editor authorized
to rewrite the option text itself (a content change, not an index
correction) — both outside what source re-derivation alone can settle.
Question 4833 stays out of gradable status until a human reviewer resolves
both.

## Write plan

`scripts/apply-4833-part-i-correction.js`, modeled directly on the
established `apply-answer-index-defect-4580-part-iv.js` pattern used in
Task 5: `BEGIN IMMEDIATE`, verify `question_uid`/`status`/`answer_status`/
part-0's exact prior text+options+correct, guarded `UPDATE ... WHERE
parts_json = <exact prior JSON>` checked for `changes === 1`, re-verify
every other column and every other part byte-identical, re-verify the
written part's options/text/marks unchanged and only `correct` moved to 1,
`COMMIT`/`ROLLBACK` on any mismatch.
