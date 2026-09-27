# Correction Record — Question 4575's stale `explanation` text (Workstream 3F)

**Date:** 2026-09-26
**Authorization:** explicit, as part of a 5-workstream batch instruction
("Task 1 — Fix 4575 stale explanation"), following the discovery reported at
the end of Workstream 3E's publication-gate review
(`docs/workstream-3e-1594-1230-publication-gate-review.md`, "Unrelated
finding surfaced during this check"). This record is written **before** the
row is modified, per the same discipline used for every prior correction in
this project.

**Live database SHA-256 immediately before this write:**
`4b384b86abc24651f13dfbb8d5a171e8a11032f1cebe2e9cb6d155df3ebee612`
(unchanged since the 4575 `correct` fix; verified via `sha256sum` immediately
before writing this record).

## What's wrong

`questions.id = 4575`'s `explanation` column currently reads:

> "The graph never crosses or touches the x-axis, so p(x) has zero real
> zeroes."

This was accurate under the **pre-correction** (wrong) stored answer
(`correct = 3`, "0 zeroes"). It is now stale: Workstream 3E corrected
`correct` to `2` ("2 zeroes"), matching both the source's own printed answer
key and the question's own displayed graph — but `explanation` was
deliberately left untouched by that correction (it was explicitly out of
scope, per the instruction "Nothing else should change"). The result is a
row that now grades correctly but explains itself incorrectly: a student who
answers correctly and requests an explanation would be told the opposite of
what they just got right.

## Re-verification of source graph and corrected answer (read-only, before any write)

Re-confirmed against the existing, already-established provenance rather than
re-deriving from scratch:

- **Source question page:** `source_library/CBSE/Mathematics/ch1-2.pdf`, p.2.22
  (PDF page index 10), item 45: "The graph of y = p(x) is given, for a
  polynomial p(x). The number of zeroes of p(x) from the graph is (a) 3 (b) 1
  (c) 2 (d) 0" — established in
  `docs/workstream-3e-4575-answer-key-defect-found.md`.
- **Source answer key:** same PDF, p.2.28 (PDF page index 16), "ANSWERS" grid,
  item 45: **"(c)"** — option (c) = "2" = index 2. Same source.
- **Corrected live value:** `questions.id=4575.correct = 2`, applied and
  fully verified in
  `docs/workstream-3e-4575-correct-answer-correction-record.md`
  (`RESULT — applied 2026-09-25`).
- **Graph semantics (Workstream 3D provenance,
  `docs/workstream-3d-4575-graph-visual-provenance-and-qa.md`):** "The curve
  crosses the x-axis exactly twice, and both crossings are on the positive
  side of the y-axis... At the y-axis (x = 0), the curve sits below the
  x-axis." This is the same live SVG (`visual_assets.id=165`) currently
  associated with this question.

All three sources — the printed answer key, the corrected `correct` value,
and the live graph's own documented geometry — agree: **p(x) has exactly 2
zeroes.** No new derivation was needed; this is a direct restatement of
already-verified facts.

## Field

**Column:** `explanation`
**Before:** `"The graph never crosses or touches the x-axis, so p(x) has zero real zeroes."`
**After:** `"The graph crosses the x-axis exactly twice (both crossings at positive x-values), so p(x) has 2 real zeroes — matching the source's own printed answer key (ch1-2.pdf, p.2.28, item 45: option (c))."`

Written in the same house style already used for other `explanation` values
in this table (see e.g. ids 114–118): a short, evidence-cited statement of
why the credited option is correct, no more.

## What is NOT changing

`id`, `question_uid`, `chapter_id`, `kind`, `sub_concept`, `difficulty`,
`status`, `marks`, `text`, `normalized_text`, `options_json`, `parts_json`,
`correct`, `source`, `source_page`, `source_question_number`,
`answer_key_ref`, `question_type`, `source_section`, `question_format`,
`answer_status`, `created_at`, `source_document_id`, `diagram_status`.

**Explicitly:** `correct` (`2`), `status` (`transcribed`), `answer_status`
(`verified`), and `diagram_status` (`adapted_verified`) are untouched by this
write — this is a one-column text correction, isolated from the grading key,
publication status, and visual pipeline, exactly like the discipline used for
every prior correction in this project. No `visual_assets` row is touched.

## Verification plan (all executed by the guarded apply script)

1. Fresh timestamped backup of `boardready.db`, verified byte-identical via
   `sha256sum` before proceeding.
2. Snapshot the full `questions` row for id 4575 immediately before the
   write; verify `explanation` matches the documented "before" value and
   `correct`/`status`/`answer_status`/`diagram_status` match the documented
   expected values (abort if any has drifted since this record was written).
3. Apply `UPDATE questions SET explanation = ? WHERE id = 4575 AND
   explanation = <expected old value>` inside a guarded transaction (`BEGIN
   IMMEDIATE` / `COMMIT`), checking `changes === 1`.
4. Re-read the row and verify `explanation` matches the new value and every
   OTHER column (including `correct`, `status`, `answer_status`,
   `diagram_status`) is byte-identical to the pre-write snapshot.
5. Full-table diff against the backup: expect exactly one field changed in
   `questions.id=4575` (`explanation`), no other question changed, no
   `visual_assets` changes, no status/answer_status/diagram_status/correct
   changes anywhere.
6. Record the new live database SHA-256.
7. Re-run `scripts/content-qa-audit.js` (read-only) — expected no change
   other than the `generatedAt` timestamp, since none of its checks read
   `explanation`.
8. Full regression suite (`npm test`) on both SQLite and Postgres — expect
   71/71 on each, with each run's own test-guard confirming the live database
   was not further modified by running the tests.
9. Live grading verification (`scoring.gradeOneStep`): confirm option index 2
   is still graded correct and index 3 still graded incorrect — i.e. this
   text-only change has no effect on grading behavior.

Nothing in this plan touches `source_library/`, any other question's row, or
any `visual_assets` row.

## RESULT — applied 2026-09-26, via `scripts/apply-4575-explanation-fix.js`

**All verification steps passed. Committed successfully.**

- **Backup:** `backups/boardready.db.bak-before-4575-explanation-fix-20260926-052105`,
  verified byte-identical to the live file (`sha256sum`) before the write.
- **New live database SHA-256:**
  `99aa70be67603cd97ad130dfabd923b81f9f69a2d2165fb777d299324c8e25e2`
  (previous: `4b384b86abc24651f13dfbb8d5a171e8a11032f1cebe2e9cb6d155df3ebee612`).
- **Full-table diff**, every table, every row, every column, backup vs. live:
  the **only** difference anywhere in the database is
  `questions.id=4575, explanation: "The graph never crosses or touches the
  x-axis, so p(x) has zero real zeroes." -> "The graph crosses the x-axis
  exactly twice (both crossings at positive x-values), so p(x) has 2 real
  zeroes — matching the source's own printed answer key (ch1-2.pdf, p.2.28,
  item 45: option (c))."`. All 13 other tables unchanged — same row counts,
  same content, byte for byte. `correct` (`2`), `status` (`transcribed`),
  `answer_status` (`verified`), and `diagram_status` (`adapted_verified`) on
  the 4575 row itself are confirmed unchanged.
- `scripts/content-qa-audit.js` (read-only) re-run: output identical to the
  pre-write snapshot except for the `generatedAt` timestamp — confirming this
  text-only fix has no effect on any content-QA classification (expected:
  none of the audit's checks read `explanation`).
- Full regression suite: 71/71 passing on both SQLite and Postgres, each
  run's own test-guard confirming the live database was not further modified
  by running the tests.
- **Live grading verification** (`scoring.gradeOneStep`, run directly against
  the live row): submitting option index 2 ("2") still grades `correct:
  true`; submitting option index 3 ("0") still grades `correct: false` —
  unchanged, as expected for a text-only fix.
- **Visual pipeline unaffected**, confirmed by re-reading `visual_assets` for
  question 4575 directly: all three rows (105 `source_page_full`, 164
  `source_cropped`, 165 `ai_generated`) are exactly as they were before this
  write.

This closes the stale-explanation defect found during Workstream 3E. 4575's
`explanation` now matches its own corrected answer key and its own live
graph. Its `status` remains `transcribed` — this fix, like the `correct` fix
before it, does not make 4575 gradable.
