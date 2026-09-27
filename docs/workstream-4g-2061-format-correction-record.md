# Correction Record — id 2061 `correct` format defect (Batch 15, Task 7)

## The question

`icse-chemistry-electrolysis-c018bc46` (id 2061), ICSE Chemistry, Electrolysis,
`source_document_id=60` (`competency.pdf`, Competency Focused Questions),
`source_question_number='3'`, `status='transcribed'`,
`answer_status='source_provided'`, `diagram_status='needs_visual_review'`.

Text: "The diagram represents electrolysis of molten lead bromide. The
incorrect statement for the above electrolysis is:" — 4 options (electrode
process statements A–D).

Stored `correct = "(a)"` (a string, not a 0-based integer index).

## Source evidence (re-verified directly from the PDFs this session)

`source_library/ICSE/Chemistry/competency.pdf`, page index 8, "CHAPTER 5:
ELECTROLYSIS", item 3, options (a)–(d) transcribed directly from the PDF:

- (a) "At the oxidising electrode — the electrons enter the electrolyte & the
  process is called oxidation."
- (b) "The ions in solid PbBr₂ are held together by an electrostatic force of
  attraction & hence the crucible is heated from outside, resulting in ions
  of Pb²⁺ & Br¹⁻ being free."
- (c) "The electrode reaction at 'Y' is — Pb²⁺ + 2e⁻ → Pb."
- (d) "At 'X' — bromine ions, give up electrons resulting in formation of
  bromine atoms — which form a covalent bond between atoms, resulting in
  formation of a bromine molecule."

This order matches `options_json` in the database exactly, option-for-option
— transcription did not reorder the choices, so the source's (a)/(b)/(c)/(d)
labels map directly onto 0-based indices 0/1/2/3 with no remapping needed.

`source_library/ICSE/Chemistry/competency_answer.pdf`, page index 0,
"CHAPTER 5. - ELECTROLYSIS - ON PAGE 186", "MCQ's — 1. (c); 2. (c); **3.
(a)**; 4. (b); 5. (c); 6. (b); 7. (c); 8. (a); 9. (d); 10. (b)." — item 3's
printed answer is **(a)**, confirming the stored letter is content-correct.
This matches the prior batch's finding (re-confirmed independently this
session by reading both PDFs fresh, not reusing the earlier claim
unverified).

**Conclusion: the printed key says (a), option (a) is at 0-based index 0,
and the DB's options are in the same order as the source. The stored value
`correct = "(a)"` is content-correct but format-defective — it should be the
integer `0`.**

## Why this is a genuine defect and not merely a cosmetic string difference

`scoring.js`'s `gradeOneStep` computes correctness as
`Number(submitted.optionIndex) === Number(step.correct)`. `Number("(a)")` is
`NaN`, and `NaN === NaN` is `false` in JavaScript — so if this question were
ever served and graded as-is, **every submitted answer would be marked
incorrect, including the actually-correct one**. This is not just a display
inconsistency; it is a silent grading bug waiting to happen the moment this
question is promoted to a gradable status. (It is not a live risk *today*
only because `status='transcribed'` already excludes it from
`GRADABLE_STATUSES` — but that is a coincidence of promotion order, not a
safeguard against this specific defect, and the format is wrong regardless
of current promotion state.)

## Scope check — this is NOT an isolated defect (found before writing anything)

Before touching id 2061, I queried the whole `questions` table for any
non-null, non-integer `correct` value, to know whether this instruction
("investigate 2061's defect... do not silently convert arbitrary textual
answers across the bank") was pointing at a one-off or a batch-wide issue.

**122 rows** have a non-null, non-integer `correct` value. All 122 are
`kind='mcq'`, `status='transcribed'`, `answer_status='source_provided'` —
i.e., none have passed the content-verification gate yet. All 122 belong to
the same ICSE Chemistry `competency.pdf` source family (chapters: Periodic
Table, Chemical Bonding, Acids/Bases/Salts, Mole Concept/Stoichiometry,
Electrolysis, Metallurgy, Study of Compounds, Organic Chemistry, Practical
Chemistry — ids in the 1966–2219 range). Of these:

- **119 rows** hold a letter-format string exactly like `"(a)"`/`"(b)"`/
  `"(c)"`/`"(d)"` — the same defect class as 2061, evidently a whole-batch
  ingestion artifact where this source's answer key format (`"(a)"` etc.)
  was copied verbatim into `correct` instead of being converted to a
  0-based index during ingestion.
- **3 rows** (ids 1975, 1976, 1977) hold free-text fill-in-the-blank style
  answers ("decreases / nuclear charge", "oxidising", "non-metals / high")
  despite `kind='mcq'` — these are almost certainly not multiple-choice
  questions at all but "Fill in the blanks" items mis-tagged as `kind='mcq'`
  during ingestion (matching `competency_answer.pdf`'s own "II. Fill in the
  blanks" answer-key section for Chapter 1). **These 3 are a different,
  more structural defect (wrong `kind`, not just a format issue in
  `correct`) and are explicitly out of scope for this correction** — they
  need their own investigation (likely re-classifying `kind` and possibly
  moving `options_json` to null / adding an `expected_text` style field, not
  something this schema currently supports cleanly) before any write. This
  is flagged here for a future task, not touched now.

**Per the explicit instruction not to silently convert arbitrary textual
answers across the bank, this task applies the guarded correction to id
2061 only** — the specific question named in Task 7 — after independently
re-deriving its source evidence exactly as documented above. The other 118
letter-format rows are a real, now-documented finding (each would need its
own independent letter→index mapping check against its own question's
option order — the general pattern in id 2061 will very likely generalize,
since these questions weren't reordered during transcription, but "very
likely" is not "individually confirmed," and each one must still get its
own check before being written). This is handed off as a candidate for a
dedicated future batch of guarded, per-question or scripted-but-individually-
verified corrections — not something to bulk-convert in this task. It is
also fed into Task 13's broader answer-index audit for visibility.

## Correction applied

Guarded single-field UPDATE: `questions.correct` for id=2061 changed from
the string `"(a)"` to the integer `0` only. No other column touched.
`status` and `answer_status` are **not** modified — the defect is in the
answer-key format alone, not in review state, and per this batch's Task 5
precedent, leaving review-state fields alone when only the index/format is
wrong is independently justified (this question genuinely has not yet been
through content verification, so `transcribed`/`source_provided` remain
accurate).

## Verification plan

1. Fresh timestamped backup + hash before.
2. Guarded script verifying `question_uid`, `options_json`, `correct`
   (before, exact string `"(a)"`), `status`, `answer_status` before writing;
   writes only `correct`; re-verifies every other column byte-identical
   after.
3. Full-table diff against the backup — expect exactly 1 changed row, 1
   changed field.
4. `content-qa-audit.js` re-run.
5. 71/71 SQLite regression.
6. 71/71 PostgreSQL regression.
7. Live grading check via `scoring.js`: submitting `optionIndex: 0` now
   grades correct (it did not before — `Number("(a)")` made every
   submission grade incorrect); submitting any other index now grades
   incorrect as expected.
8. Live DB hash recorded before/after.

Results appended below once complete.

## RESULTS — applied 2026-09-26

| step | result |
|---|---|
| Backup | `backups/boardready.db.20260926-064155.pre-2061-format-fix` |
| Hash before | `937407302f0f465c631903bfe1a54645ad5233d0f08e4dfd4e44ac099ad690fe` |
| Guarded write | `scripts/apply-2061-correct-format-fix.js` — COMMIT successful, `correct: "(a)" -> 0` |
| Full-table diff | exactly 1 changed row (id 2061), exactly 1 changed field (`correct`) |
| `content-qa-audit.js` | clean — "Anomalous GRADABLE rows with a non-ready answer_status: 0" |
| 71/71 SQLite regression | pass; test-guard confirmed live DB unchanged by the test run |
| 71/71 PostgreSQL regression | pass; test-guard confirmed live DB unchanged by the test run |
| Live grading check (`scoring.js` `gradeOneStep`) | AFTER fix: `optionIndex:0` → `{answered:true, correct:true}`; `optionIndex:1/2/3` → `correct:false`. BEFORE-fix simulation (`correct:"(a)"`) confirmed the bug directly: `optionIndex:0` (the content-correct answer) graded `correct:false` because `Number("(a)")` is `NaN` and `NaN === NaN` is `false` — every submission would have graded wrong regardless of what the student picked. |
| Hash after | `c59d0173ca227dc01708abc13eef988db8ac98f88c2813d9013de94246c2e885` |

**Task 7: COMPLETED / APPLIED (1 of 1 — id 2061 only).** The broader
122-row batch-format finding (119 letter-format + 3 mis-`kind`-tagged
free-text rows) is documented above as a scope note, explicitly not bulk
converted, and carried forward into Task 13's audit and the Task 15 queue.
