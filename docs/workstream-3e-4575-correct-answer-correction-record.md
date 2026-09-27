# Correction Record — Question 4575's `correct` answer-key index (Workstream 3E)

**Date:** 2026-09-25
**Authorization:** explicit, per-item approval to apply this one correction,
following the discovery and evidence recorded in
`docs/workstream-3e-4575-answer-key-defect-found.md`. This record is
written **before** the row is modified, per the same discipline used for
the Workstream 3A correction record (3033, 3070) and the Workstream 3B/3D
live visual associations.

**Live database SHA-256 immediately before this write:**
`e2743e0d92c76ddd40cc9f4e371ccd61de6aab9100379d02b775cff4ae55fe24`
**Backup taken:** `backups/boardready.db.bak-before-4575-correct-fix-20260925-194926`
(verified byte-identical to the live file via `sha256sum` before proceeding).

## Question

**4575** (`cbse-mathematics-polynomials-752a6e3e`), CBSE Mathematics,
chapter "Polynomials."

**Field:** `correct`
**Before:** `3`
**After:** `2`

## Evidence

- **Source answer key:** `source_library/CBSE/Mathematics/ch1-2.pdf`,
  printed page **2.28** (PDF page index 16), the chapter's "ANSWERS" grid,
  item **45: "(c)"** — rendered and read directly from the page image (the
  page's raw OCR text layer is unreliable here; the rendered image is
  unambiguous).
- **Source question page:** same PDF, printed page 2.22 (PDF page index
  10), item 45: options printed in order (a) "3", (b) "1", (c) "2", (d) "0"
  — matching `options_json = ["3","1","2","0"]` index-for-index (index 0 =
  (a), 1 = (b), 2 = (c), 3 = (d)).
- **Convention confirmed independently:** `scoring.js` compares
  `Number(submitted.optionIndex) === Number(step.correct)` directly — `correct`
  is a plain 0-based index into `options_json`, with no relabeling or
  shuffling anywhere in the pipeline (confirmed by inspection, and
  cross-checked against question 3070's already-audited
  `correct = 1` → `"{x∈Z, -4<x≤5}"`, which is exactly right).
- **Semantic cross-check:** option (c) = "2" zeroes, matching the actual
  Fig. 2.19 graph (the same figure reconstructed as the live SVG in
  Workstream 3D), which crosses the x-axis exactly twice. Option (d) = "0"
  zeroes (the currently-stored, wrong answer) contradicts the graph the
  question itself displays.

Expected semantic effect of this correction: option (c), "2", becomes the
credited answer — matching both the source's own printed answer key and the
question's own displayed graph.

## What is NOT changing

`id`, `question_uid`, `chapter_id`, `kind`, `sub_concept`, `difficulty`,
`status`, `marks`, `text`, `normalized_text`, `options_json`, `parts_json`,
`explanation`, `source`, `source_page`, `source_question_number`,
`answer_key_ref`, `question_type`, `source_section`, `question_format`,
`answer_status`, `created_at`, `source_document_id`, `diagram_status`.

**Explicitly, per your instruction:** `answer_status` (`verified`) and
`status` (`transcribed`) are **not** touched by this write. The wrong
`correct` index and the question's publication/gradability status are
separate concerns — this correction fixes only the former. Nothing about
`diagram_status` (`adapted_verified`) or the `visual_assets` rows (164,
165, and the untouched 105) changes either; the visual pipeline work from
Workstream 3D is entirely independent of this fix.

## Verification plan (all executed by the guarded apply script)

1. Snapshot the full `questions` row for id 4575 immediately before the
   write.
2. Verify the pre-write snapshot matches `correct = 3` and every other
   column matches what is documented above (abort if not — never write
   against a stale assumption).
3. Apply `UPDATE questions SET correct = 2 WHERE id = 4575 AND correct = 3`
   inside a transaction (`BEGIN IMMEDIATE` / `COMMIT`), guarded so it can
   only ever apply on top of the exact expected prior value, checking
   `changes === 1`.
4. Re-read the row and verify `correct = 2` and every OTHER column
   (including `answer_status`, `status`, and `diagram_status`) is
   byte-identical to the pre-write snapshot.
5. Full-table diff against the backup: expect exactly one field changed in
   `questions.id=4575`, no other question changed, no `visual_assets`
   changes, no status changes, no provenance changes.
6. Record the new live database SHA-256.
7. Re-run `scripts/content-qa-audit.js` (read-only).
8. Re-run the full regression suite (`npm test`) on both SQLite and
   Postgres, confirming 71/71 and the test-guard's own live-DB-unchanged
   check.
9. Live grading verification: confirm selecting option index 2 ("2") is now
   graded correct, and option index 3 ("0") is graded incorrect, and that
   the ai_generated SVG visual and `adapted_verified` status are unaffected.

Nothing in this plan touches `source_library/`, any other question's row,
or any `visual_assets` row.

## RESULT — applied 2026-09-25, via `scripts/apply-4575-correct-answer-fix.js`

**All verification steps passed. Committed successfully.**

- **Backup:** `backups/boardready.db.bak-before-4575-correct-fix-20260925-194926`,
  verified byte-identical to the live file (`sha256sum`) before the write.
- **New live database SHA-256:**
  `4b384b86abc24651f13dfbb8d5a171e8a11032f1cebe2e9cb6d155df3ebee612`
  (previous: `e2743e0d92c76ddd40cc9f4e371ccd61de6aab9100379d02b775cff4ae55fe24`).
- **Full-table diff**, every table, every row, every column, backup vs.
  live: the **only** difference anywhere in the database is
  `questions.id=4575, correct: 3 -> 2`. All 13 other tables (`users`,
  `subjects`, `chapters`, `tests`, `test_questions`, `attempts`,
  `subscriptions`, `audit_log`, `source_documents`, `duplicate_flags`,
  `source_files`, `source_document_files`, `visual_assets`) are unchanged —
  same row counts, same content, byte for byte. `answer_status`
  (`verified`), `status` (`transcribed`), and `diagram_status`
  (`adapted_verified`) on the 4575 row itself are confirmed unchanged, per
  the instruction to keep this fix narrowly scoped.
- `scripts/content-qa-audit.js` (read-only) re-run: output is identical
  except for the `generatedAt` timestamp — confirming this fix has no
  effect on any content-QA classification (expected: the visual-
  completeness and structural checks don't depend on `correct`).
- Full regression suite: 71/71 passing on both SQLite and Postgres, each
  run's own test-guard confirming the live database was not further
  modified by running the tests.
- **Live grading verification** (`scoring.gradeOneStep`, the exact function
  `server.js` uses for both real-time "check" and final scoring, run
  directly against the live row): submitting option index 2 ("2") now
  grades `correct: true`; submitting option index 3 ("0") grades
  `correct: false`. This is the exact inverse of the pre-fix behavior.
- **Visual pipeline unaffected**, confirmed by re-reading `visual_assets`
  for question 4575 directly: `ai_generated` (the SVG) still resolves first
  in priority order, followed by `source_cropped`, then the untouched
  `source_page_full` row — identical to before this fix.

This closes the urgent grading defect. 4575's answer key now matches its
own source (`ch1-2.pdf` p.2.28, item 45, "(c)") and its own displayed graph
(2 x-axis crossings). Its `status` remains `transcribed` — this fix does
not make 4575 gradable-by-`GRADABLE_STATUSES`; that promotion, along with
1594/1230's, remains a separate, not-yet-made decision.
