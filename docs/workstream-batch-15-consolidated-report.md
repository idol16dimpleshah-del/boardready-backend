# Batch 15 — Continue Production QA — Consolidated Report

All 15 tasks are complete. This report is the single final summary of the
whole batch: status per task, every live database write, and the
regression/hash evidence backing each one.

## Status per task

| # | Task | Status | Live write(s)? |
|---|---|---|---|
| 1 | Promote 1594 to `verified`/`verified` | **APPLIED** | 1 (status+answer_status) |
| 2 | Promote 1230 to `verified`/`verified` | **APPLIED** | 1 (status+answer_status) |
| 3 | Associate 1594's adapted visual live | **APPLIED** | 1 (`diagram_status`→`adapted_verified`) |
| 4 | Associate 1230's adapted visual live | **APPLIED** | 1 (`diagram_status`→`adapted_verified`) |
| 5 | Correct confirmed answer-index defects (6 candidates) | **APPLIED (5 of 6)** | 5 (4569, 4580 part iv, 4651, 4662, 4665) — id 4648 deliberately **NOT** applied, reclassified ambiguous |
| 6 | Investigate question 4833 | **COMPLETED** (read-only) | 0 |
| 7 | Fix 2061's `correct` field format | **APPLIED** | 1 |
| 8 | Build visual for 1508 (BPT triangle) | **PROPOSED** | 0 |
| 9 | Build visual for 1231 (angle bisector) | **PROPOSED** | 0 |
| 10 | Build 4833's courtyard-grid visual; re-verify its answer key | **PROPOSED visual / NEEDS APPROVAL on content** | 0 (3 confirmed defects documented, not yet corrected) |
| 11 | Build visual for 2061 (electrolysis apparatus) | **PROPOSED** | 0 |
| 12 | Build visual for 1727 (rectangle→cylinders) | **PROPOSED** | 0 |
| 13 | Expand answer-index audit (5 boards/subjects) | **COMPLETED** (read-only) | 0 |
| 14 | Bank-wide `visual_assets`/`diagram_status` reconciliation | **COMPLETED** (read-only) | 0 |
| 15 | Synthesize next-15-question production queue | **COMPLETED** (read-only) | 0 |

**BLOCKED (standing, not newly created this batch):** id 4648 — genuinely
ambiguous per Task 5's re-check, correctly left untouched rather than
guessed at.

**NEEDS APPROVAL (a person's call, not this audit's):** the 3 confirmed
content defects in 4833 (parts i/iii/v, Task 10) await individual gated
correction; the 5 visuals built as PROPOSED this batch (1508, 1231, 4833,
2061, 1727) await a live-association decision.

## Live database writes — full accounting

10 live writes total this batch, every one preceded by a correction record,
a byte-identical backup, executed as a guarded transaction verifying exact
prior state and `changes===1`, followed by a full-table diff, a fresh
`content-qa-audit.js` run, the full 71/71 SQLite + 71/71 PostgreSQL
regression suite, a live grading-behavior check via `scoring.js`, and a
before/after hash check:

1. id 1594 — `status`/`answer_status` → `verified`/`verified` (Task 1)
2. id 1230 — `status`/`answer_status` → `verified`/`verified` (Task 2)
3. id 1594 — `diagram_status` → `adapted_verified` + `visual_assets` row inserted (Task 3)
4. id 1230 — `diagram_status` → `adapted_verified` + `visual_assets` row inserted (Task 4)
5. id 4569 — `correct` 2→1 (Task 5)
6. id 4580 — `parts_json[3].correct` 2→1 (Task 5)
7. id 4651 — `correct` 2→0 (Task 5)
8. id 4662 — `correct` 2→0 (Task 5)
9. id 4665 — `correct` corrected per workstream-4e (Task 5)
10. id 2061 — `correct` letter-format → integer index (Task 7)

## Counts

- **Live writes:** 10
- **Questions corrected (content):** 6 — 4569, 4580, 4651, 4662, 4665, 2061
- **Questions promoted to gradable this batch:** 2 — 1594, 1230
- **New visuals generated (PROPOSED, not yet live):** 5 — 1508, 1231, 4833, 2061, 1727
- **Visuals associated live this batch:** 2 — 1594, 1230
- **Questions read-only investigated with zero defect found:** 1727 (content independently re-verified correct)
- **New content defects discovered and documented (not yet corrected):** 3 in question 4833 (parts i, iii, v) + 3 in question 1965 (case-part format mismatch, needs reclassification, Task 13)
- **Bank-wide defect class fully scoped this batch:** 124-row non-integer `correct` defect, 100% confined to the `competency.pdf` ICSE Chemistry ingestion (Task 13); 1 of these (2061) corrected under Task 7

## Bank-wide state at close of batch

- Total questions: 4,946. Currently gradable (`status` in verified/qa_passed/published): 1,328.
- `visual_assets`: 169 rows / 150 distinct questions, zero orphans, zero duplicate-type rows, zero missing files among claimed images (Task 14).
- `diagram_status='adapted_verified'` (fully live, servable visual): 1230, 1594, 3070, 4575 — 4 questions, all confirmed correct and live.
- 5 further visuals (1508, 1231, 4833, 2061, 1727) are built, browser-QA'd (8/8 combinations each), and PROPOSED — ready for a future association task once each question's own content gate is independently clear.

## Regression and hash evidence

Every one of the 10 live writes above, and every read-only task in this
batch, was followed by: `DB_ENGINE=sqlite npm test` → 71/71 passing,
`DB_ENGINE=postgres npm test` → 71/71 passing, and a `sha256sum
boardready.db` check before and after. No regression failure occurred at
any point in the batch. No read-only task (Tasks 6, 8–15, and the
verification passes on every write) ever altered the live database — this
was independently re-confirmed via hash comparison every time.

**Final live database hash:**
`c59d0173ca227dc01708abc13eef988db8ac98f88c2813d9013de94246c2e885`

This is the hash left by write #10 (Task 7); it has been independently
re-verified unchanged after every subsequent task in this batch (8 through
15), most recently immediately before this report was written.

## What's next

`docs/workstream-4p-task15-next-production-queue.md` is the actionable
carry-forward: 7 questions ready for a purely mechanical promotion/
association write, 6 with content already verified and a real figure
confirmed to exist (visual production is the only remaining gate), 1
blocked on a 3-part content correction (4833), and 1 blocked on a
classification decision (1965) rather than more investigation. Two larger
follow-on efforts were scoped but deliberately left out of that per-question
queue because they are batch/triage work: correcting the remaining 123-row
`competency.pdf` ICSE Chemistry answer-index defect, and triaging the
`needs_visual_review` backlog down from its current untriaged ~2,679 rows
(Task 14's evidence suggests the true missing-visual count is a small
fraction of that).

`audit-publication-readiness-output.json` was not modified, run, or
committed at any point in this batch, per standing instruction.
