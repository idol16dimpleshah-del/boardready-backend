# Correction Record — Question 1230 Publication Promotion (Batch 15, Task 2)

**Status: PROPOSED, about to be applied under guard, independently of Task 1.**

## What this changes

| column | current (live) | proposed |
|---|---|---|
| `status` | `transcribed` | `verified` |
| `answer_status` | `source_provided` | `verified` |

Nothing else — same scope and same two departures from the batch prompt's
literal wording as Task 1 (`docs/workstream-4a-1594-promotion-correction-record.md`):
`status` becomes `'verified'`, not the non-existent `'gradable'` value; and
`answer_key_ref` is left `NULL`, deferring to `content-qa-audit.js` over the
older tool's `missing_answer_key_ref` flag, per this task's "do not modify
... provenance" instruction. Applied here independently for consistency, not
re-derived from scratch — the reasoning is identical for both questions.

## Assertion/Reason answer mapping — re-verified before writing, as instructed

**Disambiguation checked first**, since 1230 and 1231 are adjacent items on
the same source page and are easy to cross up: 1230
(`icse-mathematics-locus-and-construction-c23699f9`) is source item **(33)**
— the perpendicular-bisector question, derived below. 1231
(`icse-mathematics-locus-and-construction-4078b869`) is source item **(34)**
— a different question (the angle-bisector construction), identified as a
fresh Task-5 visual candidate in the prior batch and out of scope for this
task.

1230's live `text`: "Assertion (A): In the figure, D is the mid-point of BC
and AD is perpendicular to BC. If E lies on AD, then BE = CE. ... Reason
(R): Every point on the perpendicular bisector of a line segment is
equidistant from its end points." `options_json`: `["A is true, R is
false","A is false, R is true","Both A and R are true","Both A and R are
false."]`, `correct = 2`.

Re-derived directly: since D is the midpoint of BC and AD ⊥ BC, line AD *is*
the perpendicular bisector of BC. E lies on AD, hence on that perpendicular
bisector, hence BE = CE by the stated theorem. Assertion true, Reason true
and a correct explanation of the assertion. "Both A and R are true" (index
2) is correct — matches the stored `correct` value and re-confirms the
derivation already on record in
`docs/workstream-3e-geometry-content-qa-1594-1230.md`.

## Why promotion is justified

All seven publication-gate checks from `docs/workstream-3g-1594-1230-promotion-proposal.md`
apply to 1230 exactly as they did in that document (re-read this session,
nothing has changed live since — DB hash confirmed). No duplicate flags, no
internal duplicate option text, source provenance present, explanation
confirmed not required for gradability (same code-level check as Task 1,
`content-rules.js`/`server.js` unchanged since). Visual association is out
of scope here (Task 4 handles it, gated on this task's success).

## Verification plan

Identical eight-step plan as Task 1, run as its own separate transaction
against a fresh backup, with its own full-table diff, its own regression
run, and its own live-grading check for 1230 specifically.

Results appended below once complete.

## RESULT — applied 2026-09-26

1. Backup: `backups/boardready.db.bak-before-1230-promotion-20260926-062030`,
   confirmed byte-identical before the write (SHA-256
   `af9c24ba298f89be042c88540a88b732726ea09b5cb8d4f662c884ceb0ce4786`).
2. `scripts/apply-1230-status-promotion.js` ran clean, exactly 1 row changed.
3. Full-table diff: exactly one changed row across the entire database —
   `questions` id 1230, `status` and `answer_status` only.
4. `content-qa-audit.js`: "Anomalous GRADABLE rows with a non-ready
   answer_status (critical if > 0): 0".
5. 71/71 SQLite regression, guard confirmed DB unchanged after.
6. 71/71 PostgreSQL regression, guard confirmed DB unchanged after.
7. Live grading check via `scoring.js`: submitting `optionIndex: 2` grades
   correct; `optionIndex: 1` grades incorrect — matches stored `correct=2`.
8. Live DB hash after: `e03344ac64defef91c2349995cc461b785f87663abf33e7a3d980ad81186fafb`.

**Task 2: COMPLETED / APPLIED.**
