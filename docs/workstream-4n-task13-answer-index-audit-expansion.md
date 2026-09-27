# Task 13 — Expanded Answer-Index Integrity Audit (Batch 15)

**Status: fully read-only.** No database write. This expands the answer-
index audit across CBSE Mathematics, ICSE Mathematics, ICSE Chemistry,
ICSE History and Civics, and ICSE Geography — every board/subject
combination currently in the bank — and across different ingestion
batches within each. No bulk-fixing is proposed or performed; per-question
correction remains individual and gated, per this batch's standing rules.

## Method

Two complementary passes, because they catch different defect shapes:

1. **`scripts/content-qa-audit.js`, re-run fresh this session** — a
   static, structural check: is `correct` (or each case-part's `correct`)
   a valid, in-range integer index? This catches format defects (a letter
   like `"(a)"`, a free-text answer, an out-of-range value) but **cannot**
   catch a `correct` value that is a syntactically valid integer index
   pointing at the *wrong* option — that shape of defect is invisible to
   static analysis and can only be found by independently re-deriving the
   right answer from the source material, exactly as was done by hand for
   4575 (prior batch), 1594/1230 (prior batch), and 4833 (this batch,
   Task 10).
2. **A small, disclosed-as-non-exhaustive manual spot-check** of currently
   `verified` (live, gradable) MCQs outside Chemistry, to get some direct
   evidence on whether the second, tooling-invisible defect shape (found at
   4833) is a one-off or a wider pattern.

## Pass 1 result — the non-integer/malformed `correct` defect is 100% confined to one ingestion source

Board/subject coverage in the live bank (for scale):

| board | subject | question count |
|---|---|---|
| CBSE | Mathematics | 882 |
| ICSE | Mathematics | 1659 |
| ICSE | Chemistry | 1382 |
| ICSE | History and Civics | 680 |
| ICSE | Geography | 343 |

`content-qa-audit.js`'s answer-key-integrity check found **124 genuine
defects bank-wide** (this run; Task 7 corrected 1 of a previously-counted
122, so the count includes 3 further part-level defects on top of the
121 remaining letter-format rows). Every single one of the 124 —
**zero exceptions** — is an ICSE Chemistry question, and every one of
those traces to `source = "competency.pdf (Competency Focused Questions) +
competency_answer.pdf"`, spanning 7 distinct `source_document_id` values
(55, 56, 59, 60, 61, 66, 67 — one per chapter of that ingestion) plus 56
rows with a null `source_document_id`, ids ranging 1965–2219:

| chapter (ICSE Chemistry) | defect count |
|---|---|
| Study of Compounds | 40 |
| Acids, Bases and Salts | 16 |
| Periodic Table | 15 |
| Chemical Bonding | 10 |
| Metallurgy | 10 |
| Organic Chemistry | 10 |
| Electrolysis | 9 (includes id 2061, already fixed under Task 7) |
| Mole Concept & Stoichiometry | 7 |
| Practical Chemistry | 7 |

Breakdown by defect shape:

- 118 rows: `correct` is a letter string (`"(a)"`/`"(b)"`/`"(c)"`/`"(d)"`)
  instead of an integer index — the exact same format defect Task 7 fixed
  for id 2061, confirmed genuinely bank-wide across this whole ingestion
  batch, not just its Electrolysis chapter.
- 3 rows: `correct` is free text (`"decreases / nuclear charge"`,
  `"oxidising"`, `"non-metals / high"`) — fill-in-the-blank items
  mis-tagged `kind='mcq'`, consistent with the 3 rows workstream-4g already
  flagged (ids 1975–1977) as a distinct sub-shape needing reclassification,
  not a format fix.
- 3 rows (all on the same question, id 1965, a case-kind Periodic Table
  item): `parts_json[0..2].correct` are element symbols (`"F"`, `"He"`,
  `"'Z'"`) rather than integer indices — the same free-text-mis-tagged-as-
  scored-option shape, at the case-sub-part level.

**None of this defect class — zero rows — appears in CBSE Mathematics,
ICSE Mathematics, ICSE History and Civics, or ICSE Geography** (3,564
questions combined). This is a materially stronger and more precise
statement than workstream-4g's original finding, which only established
the scope within the Electrolysis chapter; this pass confirms it against
the *entire* bank across *every other* chapter and subject.

**Disposition (feeds Task 15):** this remains exactly what workstream-4g
already recommended — a `competency.pdf`-batch-wide re-review, not a
mechanical bulk-conversion. The 118 letter-format rows are almost
certainly a mechanical fix once someone verifies option order wasn't
altered during transcription (as was individually confirmed for 2061), but
that verification has to happen per-row or per-batch-with-spot-checks, not
assumed. The 6 free-text-mis-tagged rows (3 mcq + 3 case-parts on id 1965)
need reclassification (`question_format`/`kind`), not a format fix — a
different kind of correction. **None of these 124 rows are currently
gradable** (`gradable: false` on every one, confirmed in the audit output),
so there is no live grading exposure today regardless of when this gets
addressed.

## Pass 2 result — a small spot-check outside Chemistry found no second instance of 4833's defect shape

Task 10 found that question 4833 (CBSE Maths) has a `correct` value that
is a syntactically valid integer but points at the wrong option — a defect
shape no static check can find. To get some evidence on whether this is
common, 8 `status='verified'` (live, gradable) MCQs were sampled outside
Chemistry and independently re-solved by hand this session:

| id | board/subject | chapter | check | result |
|---|---|---|---|---|
| 63 | CBSE Mathematics | Pair of Linear Equations | unique-solution condition k≠6 for kx+2y=5, 3x+y=1 | **matches stored `correct`** |
| 3130 | ICSE Mathematics | Quadratic Equation | root x=1 in ky²+ky+3=0 ⟹ k=-3/2 | **matches** |
| 3036 | ICSE Mathematics | Linear Inequation | which inequation has no solution over ℕ | **matches** |
| 3042 | ICSE Mathematics | Linear Inequation | solve -5x-7≥-15-3x over ℕ ⟹ {1,2,3,4} | **matches** |
| 2886, 2898 | ICSE Mathematics | GST | (not independently recomputed — multi-step tax arithmetic, time-boxed out) | not checked |
| 3861, 3655 | ICSE History and Civics | UN / Non-Cooperation Movement | factual recall, not independently re-sourced this session | not checked |

**This is a sample of 4, not a proof.** It found no second instance of
4833's defect shape, which is mildly reassuring but does **not** establish
that 4833 is the only one — a bank-wide re-derivation of every stored
answer against its source is the only thing that could establish that, and
that is not a tractable read-only task for one session across ~5,000
questions. This is disclosed as a genuine open gap for Task 15's queue,
not papered over: **the only reliable way this defect shape gets caught is
the same way 4575, 1594/1230, and 4833 were caught — independent,
per-question re-verification, most naturally done as part of whatever
review happens immediately before a question is promoted to `verified`.**

## Cross-reference: the duplicate-correct-answer-text finding already covers this batch's other requested subjects

`content-qa-audit.js` section F (duplicate-correct-answer text — a
different fairness risk: the credited option's text is repeated at another
index) already found instances in **ICSE Mathematics** (ids 1137, 1322,
1384, 2941, 3003, 3228) and **ICSE History and Civics** (id 3632) — see
`docs/workstream-3-duplicate-correct-answer-scope-audit.md` for the
original per-row detail. Re-confirmed unchanged this session (same 7
findings, same 3 currently-gradable: 2941, 3003, 3228). No CBSE Mathematics
or ICSE Geography instances exist. This is a distinct defect shape from
this document's main subject (a valid answer can still have a duplicate-
text distractor) and is not re-litigated here beyond confirming it's
unchanged and was already scoped across the subjects this task asked
about.

## Summary for Task 15

- **Confirmed, scoped, already-actioned-in-part:** 124-row non-integer/
  malformed `correct` defect, 100% confined to the `competency.pdf` ICSE
  Chemistry ingestion (ids 1965–2219). 1 of these (2061) individually
  fixed under Task 7. 123 remain, none currently gradable. **CONTENT QA
  FIRST**, batch-reviewable but not bulk-fixable without per-row (or at
  minimum per-source-document) spot verification.
- **Confirmed, isolated so far:** 4833's wrong-but-valid-index defect
  (Task 10) — no second instance found in a small spot-check, but the
  check was not exhaustive. **CONTENT QA FIRST** for 4833 specifically;
  flagged as an open bank-wide risk in general, mitigated only by
  continuing to independently re-verify each question before promotion.
- **Confirmed, unchanged, already known:** 7-row duplicate-correct-answer-
  text finding spanning ICSE Mathematics and ICSE History and Civics, 3
  currently gradable (2941, 3003, 3228) — carried forward from
  `workstream-3-duplicate-correct-answer-scope-audit.md`, not new.
- **Zero findings** (of the non-integer/malformed-`correct` type) in CBSE
  Mathematics, ICSE Mathematics, ICSE History and Civics, ICSE Geography.
