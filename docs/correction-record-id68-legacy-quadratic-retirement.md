# Correction Record — id 68 (legacy row, Quadratic Equations)

**Status:** APPLIED. `status` changed from `'verified'` to `'needs_review'` via `scripts/apply-id68-retirement.js`.

## Finding

id 68 is a pre-existing, already-`status='verified'` (live/gradable) row —
one of 15 legacy pre-provenance rows (ids 60-74, `question_uid=NULL`,
`source_document_id=NULL`, all created at the identical timestamp
`2026-09-16 15:40:07`, predating the current provenance-tracked ingestion
pipeline). It is **not** part of the CBSE Maths content-promotion
campaign's candidate pool (its `answer_status='source_provided'` and
`diagram_status='needs_visual_review'` never matched the pool filter),
and was surfaced only as a side effect of checking `duplicate_flags` row
386 while verifying Batch 12 candidate id 4636.

id 68's stored content:

```
text: "Which of the following is a quadratic equation?"
options_json: ["x^2 + 2x + 1 = (4-x)^2 + 3", "x^3 - x^2 = (x-1)^3",
                "2x - x^2 = x^2 + 5", "x(x+1) + 8 = (x+2)(x-2)"]
correct: 2   (credits "2x - x^2 = x^2 + 5")
```

Independent verification of all four options by reducing each to
standard form:
- index 0: `x^2+2x+1=(4-x)^2+3` -> cancels to a linear equation (not quadratic)
- index 1: `x^3-x^2=(x-1)^3` -> reduces to `2x^2-3x+1=0` (**genuinely quadratic**)
- index 2 (credited): `2x-x^2=x^2+5` -> reduces to `-2x^2+2x-5=0` (**also genuinely quadratic**)
- index 3: `x(x+1)+8=(x+2)(x-2)` -> cancels to a linear equation (not quadratic)

**Two of the four options are both valid quadratic equations, not just
the credited one.** A student who selects index 1 has given a
mathematically correct answer but would be marked wrong. This is a live
MCQ construction defect. `content-qa-audit.js`'s automated checks do not
catch it (its "GENUINE DEFECTS... CURRENTLY GRADABLE" count is 0 both
before and after this finding) because the defect is semantic (multiple
valid answers), not structural.

## Source investigation

`source_library/CBSE/Mathematics/ch3-4.pdf` (the same PDF ingested as
`source_documents.id=153`, which is where id 4636 — a properly-sourced
row already promoted in Batch 12 — comes from) was read directly. Page
"4.12" (the first Quadratic Equations practice page) has, as its
Question 1, verbatim from the scan:

> Which of the following is a quadratic equation?
> (a) x² + 2x + 1 = (4-x)² + 3  (b) -2x² = (5-x)(2x - 2/5)
> (c) (k+1)x² + (3/2)x = 7, where k = -1  (d) x³ - x² = (x-1)³
> [NCERT EXEMPLAR]

The printed answer key on page 4.16 gives **"1. (d)"**. This exactly
matches id 4636 (`source_document_id=153`, `source_page="4.12"`,
`source_question_number="1"`, `correct=3` -> "(d)"), already
independently re-derived and verified correct in the Batch 12 write-up.

**Conclusion: the real source page is clean and correct.** id 68 is not
a faithful transcription of it. id 68 shares exactly one option verbatim
with the real Q1 ("x²+2x+1=(4-x)²+3") but its other three options do not
appear on that page or in its answer key at all — two of the real
source's four options ((b) and (c)) are simply absent from id 68,
replaced by two unrelated equations (one of which happens to also be a
valid quadratic, creating the ambiguity). Combined with the complete
absence of any `source_document_id`/`source_page`/`source_question_number`
pointer on id 68 itself, this indicates id 68 originated from whatever
process produced the 15 legacy rows before the provenance pipeline
existed — not a transcription error against a specific photographed
page, but a fabricated/corrupted composite with no recoverable original
4-option source to restore.

## Decision

Presented to the user as three options: (a) retire id 68 out of the
gradable status set; (b) overwrite its options/correct to match the real
source page 4.12 exactly (which would create an exact content duplicate
of already-promoted id 4636); (c) repoint `correct` to index 1 alone
(cheaper, but leaves the second valid quadratic live and doesn't resolve
the underlying ambiguity).

**User selected (a): retire.** Rationale — there is no source-backed
replacement option set specific to id 68 to restore; the concept it
tests is already correctly and verifiably covered by id 4636; retiring
avoids creating a new duplicate and avoids authoring new distractor
content under this row's identity.

## Planned change

`questions.id = 68`: `status` changes from `'verified'` to
`'needs_review'` — an existing status value already used by 29 other
rows in the bank for exactly this purpose (removed from the
`GRADABLE_STATUSES = ['verified', 'qa_passed', 'published']` set used
throughout `server.js`, `practice.js`, `ingest.js`, etc., so the row
stops being served/gradable everywhere consistently). No other field on
this row is touched — `options_json`, `correct`, `text`, `answer_status`,
`diagram_status`, `chapter_id`, and everything else remain byte-identical,
preserving the row for audit history rather than deleting it.

This is a single-row, single-column, out-of-campaign-scope correction,
independent from the CBSE Maths content-promotion campaign's own
guarded-promotion helper (`scripts/lib/promote-status-batch.js`, which is
scoped to `transcribed -> verified` transitions only and does not apply
here). Applied via its own dedicated script (`scripts/apply-id68-retirement.js`)
following the same verification discipline: byte-identical backup ->
guarded write -> full-table diff -> `content-qa-audit.js` -> 71/71
SQLite + PostgreSQL regression -> live grading-behavior check -> hash
confirmation -> commit.

## Applied — verification results

- Pre-write hash: `bff83831eab99ad447a9f4e49b99df128eb756e0fe5112bfa2b514868dbd4cc9`.
  Backup `backups/boardready.db.bak-before-id68-retirement-20260927-051959`
  confirmed byte-identical before the write.
- `scripts/apply-id68-retirement.js` ran successfully: exact prior-state
  guard (status/answer_status/diagram_status/correct/options_json all
  matched expected values) passed, `UPDATE ... SET status = 'needs_review'`
  changed exactly 1 row, every other column on id 68 re-verified
  byte-identical after the write, transaction committed.
- Full-table diff against the pre-write backup: **exactly 1 changed row**
  across all 14 tables — id 68, `status` only. `duplicate_flags`,
  `source_documents`, and every other table byte-identical.
- `content-qa-audit.js` re-run: unchanged at 124 genuine defects / 0
  currently-gradable (the audit's structural checks never flagged id 68
  in the first place, since the defect is semantic, not structural — this
  is expected, not a red flag).
- `DB_ENGINE=sqlite npm test`: 71/71 passed, live DB confirmed unchanged
  by the test-guard.
- PostgreSQL had dropped (`pg_isready` -> no response) — recovered via
  `service postgresql start`. `DB_ENGINE=postgres npm test`: 71/71
  passed, live DB confirmed unchanged by the test-guard.
- Live-serving check: a direct query mirroring `practice.js`'s pool
  selection (`WHERE chapter_id = 4 AND status IN (GRADABLE_STATUSES)`)
  confirms id 68 now returns **zero** rows — it is excluded from every
  serving path that filters on `GRADABLE_STATUSES`
  (`server.js`, `practice.js`, `ingest.js`, etc.), consistently, without
  needing a special case anywhere.
- Post-write hash: `dec29f93fc4dbe88111adde92b8006a3b81bac193afed0154e75a25a024b52bc`.
