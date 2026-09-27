# Correction Record — Publication Promotion for 4569, 4651, 4662, 4665 (Batch 15A, Tasks 2-5)

**Scope: `status` only, on 4 rows, one guarded write per row.** Each of
these 4 questions already has its content defect corrected and
independently re-verified (`answer_status='verified'`, `correct` field
holding the value established in `docs/workstream-4e-answer-index-defects-batch.md`,
Task 5). None of them needs a visual (`diagram_status='not_applicable'`).
The only remaining gate before each becomes gradable is `status`
(`transcribed` → `verified`) — the same administrative promotion already
applied to 1594/1230 in Batch 15 Tasks 1-2. `answer_status` and every other
column are left untouched.

| id | question_uid | `correct` (already fixed) | pre-write `status`/`answer_status` |
|---|---|---|---|
| 4569 | cbse-mathematics-polynomials-c8d33f9f | 1 (→"-17/4") | transcribed / verified |
| 4651 | cbse-mathematics-quadratic-equations-c4d82213 | 0 (→"3") | transcribed / verified |
| 4662 | cbse-mathematics-quadratic-equations-5d3d3ec3 | 0 (→"p = 1, q = -2") | transcribed / verified |
| 4665 | cbse-mathematics-quadratic-equations-a21efcaa | 2 (per workstream-4e) | transcribed / verified |

Each `correct` value and its options were re-read directly from the live
row immediately before writing (see the script's `EXPECTED_*` constants)
and matched exactly against workstream-4e's documented corrections — no new
content re-derivation is performed here; this is a pure publication-gate
promotion.

## Write plan

`scripts/apply-4569-4651-4662-4665-promotion.js`: four independent guarded
steps, each its own `BEGIN IMMEDIATE` transaction — verify `question_uid`,
exact prior `status`/`answer_status`/`correct`/`options_json`, guarded
`UPDATE ... SET status='verified' WHERE id=? AND status=? AND
answer_status=?` checked for `changes===1`, re-verify every other column
byte-identical, `COMMIT`; a failure on any one question rolls back only
that question's transaction and does not block the others. Followed by one
combined full-table diff, one `content-qa-audit.js` re-run, one 71/71×2
regression run, and one hash check covering all 4 writes together.
