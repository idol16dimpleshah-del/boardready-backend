# Audit — `adapted_verified` Questions: Actual Gradability (Batch 15A, Task 11)

**Status: fully read-only.** Checks all 6 `diagram_status='adapted_verified'`
questions end-to-end (not resting on prior claims), plus a bank-wide
structural sanity sweep of `visual_assets` after this batch's 2 new
insertions.

## The 6 `adapted_verified` questions

| id | status | answer_status | content independently verified when? | actually selectable by test generation today? |
|---|---|---|---|---|
| 1230 | verified | verified | prior batch (workstream-3i reconstruction) | **yes** |
| 1594 | verified | verified | prior batch (workstream-3i reconstruction) | **yes** |
| 3070 | verified | verified | prior batch (workstream-3a/3b) | **yes** |
| 4575 | **transcribed** | verified | prior batch (workstream-3e) | **no** |
| 2061 | verified | verified | this batch, Task 6 (first-principles electrochemistry) | **yes** |
| 1727 | verified | verified | Batch 15 Task 12 (independent CSA computation) | **yes** |

Structural check on all 6, not assumed: exactly 1 `ai_generated` and exactly
1 `source_cropped` row each, all 6 asset files exist on disk. A live
`scoring.js gradeSubmission` run against all 6 (using each row's own
`correct` value) confirms every one grades as correct — no internal
inconsistency in any of the 6 stored answer keys.

## The one real finding: `adapted_verified` ≠ "currently being served"

`server.js` gates which questions test-generation can actually pick with
`GRADABLE_STATUSES = ['verified','qa_passed','published']`
(`content-rules.js`) — a check on `status`, not on `diagram_status`. 5 of the
6 `adapted_verified` questions have `status='verified'` and are genuinely
selectable today. **id 4575 does not** — `status` is still `transcribed`,
so despite having a fully resolved, live, correctly-associated visual, this
question is currently excluded from every generated test. This was
independently confirmed by checking `GRADABLE_STATUSES.includes(row.status)`
against the live row, not inferred from the diagram_status label.

This is not a bug — it is the two-gate design (content review and visual
review are independent) working exactly as documented in Batch 15's Task 14
finding for this same question — but it is worth restating plainly here so
a reader of `diagram_status='adapted_verified'` doesn't assume it means
"fully live." **4575 needs only a `status` promotion** (the same mechanical
write already applied to 1594/1230/4569/4651/4662/4665/2061/1727 across
this batch and its predecessor) to become the 6th fully-live question —
it was not in this batch's authorized scope and is flagged here as a
one-write follow-up, not corrected in this pass.

## Bank-wide `visual_assets` structural sanity sweep (post this batch's 2 new insertions)

- Orphaned rows (`question_id` resolves to no question): **0**
- Questions with more than 1 `ai_generated` row: **0**
- Questions with more than 1 `source_cropped` row: **0**
- Image-typed rows (`.png`/`.jpg`/`.svg`/`.webp`) missing from disk: **0** of 88 checked
- Total `visual_assets` rows: **173** (169 at the start of this batch + 2
  inserted for 2061 + 2 inserted for 1727)

No structural regression introduced by this batch's writes.
