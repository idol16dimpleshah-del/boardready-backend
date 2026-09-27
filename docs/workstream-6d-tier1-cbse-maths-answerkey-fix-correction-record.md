# Tier 1 — CBSE Maths Mechanical Answer-Key Corrections — Correction Record

**Status: APPLIED AND VERIFIED.** Six `questions.correct` values corrected, guarded write, full verification. Tier 2 (4352, 4404, 4516, 4646, 4780), Tier 3 (4517, 4519, 4687), and the 6 duplicate-content pairs were explicitly NOT touched. Batch 14 remains paused. No PostgreSQL migration occurred.

Authorized by: explicit user message "AUTHORIZE STEP 4 — TIER 1 ONLY" (2026-09-27), following
`docs/workstream-6d-cbse-maths-production-changeset-proposal.md`'s Tier 1 table, itself sourced from
Run 2 (`wf_2396414e-fbf`) and the narrow re-check (`wf_ea6c83ba-271`).

Script: `scripts/apply-tier1-cbse-maths-answerkey-fix.js` (one-time, hardcoded to this changeset —
not a reusable tool). Dry-run validated first against a throwaway copy of the live database
(single-apply succeeds; re-running against an already-fixed copy correctly aborts/rolls back with
no change), then run once against the live database.

## Backup

- Path: `backups/boardready.db.bak-before-tier1-answerkey-fix-20260927-113423`
- SHA-256: `94630622baa7c751ccd7c17a50c2221287b584febb520466dcb0acd02a7a6386`
- Verified byte-identical to the live DB at backup time (same hash) and passed `PRAGMA integrity_check` = `ok` before any write.

## Database hashes

- Before write: `94630622baa7c751ccd7c17a50c2221287b584febb520466dcb0acd02a7a6386` (identical to backup)
- After write: `1c99c6e2ebeb4a2a8cd53a592fff7a4a0904ccf6b64e9d6f87e0e1cdfdea53eb`

## Six corrections applied (all in one guarded transaction)

| id | question_uid | correct before | correct after |
|---|---|---|---|
| 4589 | cbse-mathematics-polynomials-a6d26fd2 | 1 | 3 |
| 4676 | cbse-mathematics-quadratic-equations-cfbaaee5 | 2 | 1 |
| 4811 | cbse-mathematics-co-ordinate-geometry-774a9ea6 | 0 | 3 |
| 4816 | cbse-mathematics-co-ordinate-geometry-c8862b6d | 0 | 2 |
| 4820 | cbse-mathematics-co-ordinate-geometry-626fd04e | 0 | 1 |
| 4827 | cbse-mathematics-co-ordinate-geometry-ec5426fe | 0 | 1 |

Rows changed: 6. Unexpected changed rows: 0. Row count before/after: 4946/4946 (unchanged).
Every other column on these 6 rows (`options_json`, `text`, `explanation`, `source`, `source_page`,
`source_question_number`, `answer_key_ref`, `status`, `answer_status`, `diagram_status`, etc.)
verified byte-identical before/after inside the transaction.

## Verification performed

- `scripts/content-qa-audit.js` (read-only) re-run after the write: 0 currently-gradable defects
  (all 6 targets are `status='transcribed'`, not gradable); none of the 6 ids appear in any
  answer-key, structural, or duplicate-correct-answer finding.
- `npm test` (the live-DB-guarded `node --test 'test/*.test.js'` runner) — **71/71 passing** under
  `DB_ENGINE=sqlite`, and **71/71 passing** under `DB_ENGINE=postgres` (a local, disposable
  PostgreSQL 16 cluster on this sandbox — the pre-existing `boardready_migration` role — started
  only for this verification run and stopped again immediately afterward; never pointed at
  staging/production; no migration of the production database occurred).
- Both runs' `[test-guard]` backstop confirmed: "live database unchanged: hash and all 14 table
  row counts match the pre-run baseline" — the test run itself made zero changes to `boardready.db`.
- `PRAGMA integrity_check` = `ok` and `PRAGMA foreign_key_check` = 0 violations, post-write.
- Live grading-behavior check via `scoring.js`'s real `flattenAll()`/`gradeSubmission()`: for all
  6 rows, submitting the OLD (previously-credited) option index now grades `correct: false`, and
  submitting the NEW corrected index grades `correct: true` — confirming grading is recomputed
  live from the DB's stored answer key, not cached. A 5-row control sample of untouched, unrelated
  gradable MCQs graded exactly as before (no regression).

## Final status

**TIER 1 APPLIED AND VERIFIED**
