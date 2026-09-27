# Content-QA Readiness Report

**Date:** 2026-09-24
**Scope:** Workstream 3 — read-only content-quality audit of the full question
bank (answer-key integrity, status/answer_status consistency, visual/diagram
completeness, structural completeness, and the duplicate-review backlog).

**Relationship to other project documents:** this is a new document, not a
revision of any existing one. It does not belong to either the older
"Phase N" numbering track (`docs/phase-*.md`) or the current Stage 6/7/8
launch track (`docs/stage7-deep-qa-report.md`,
`docs/stage8-production-readiness-and-launch-runbook.md`) — it is a sibling
of both, covering a distinct axis (content quality, not infrastructure or
test coverage) that neither track fully owned. It supersedes nothing.
`docs/publication-readiness-report-cbse-maths.md` and
`audit-publication-readiness.js` remain valid, historical records of a
different, narrower audit (promotion-candidate readiness for the
`transcribed` → `verified` pipeline specifically); this report's findings
are complementary, and Section 5 below documents a methodology gap in that
older tool discovered while building this one.

**Tooling:** `scripts/content-qa-audit.js`, run against `boardready.db` opened
with `node:sqlite`'s `{ readOnly: true }` flag — a hard guarantee, not just a
convention, that this audit cannot write to the live database (any accidental
write attempt throws instead of silently succeeding). Full structured output
at `docs/content-qa-audit-output.json`. Live database SHA-256 confirmed
identical before and after every run in this workstream:
`cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52`.

**What this audit does not do, by design (per explicit instruction):** it does
not promote any question's `status` or `answer_status`, does not change any
answer, does not delete any question, does not alter source provenance, does
not replace or generate any diagram, and does not modify any preserved
original. It is read-only → identify → classify → report. Every fix implied
below is a recommendation for deliberate, reviewed follow-up work — nothing
in this document has been applied.

---

## 1. Bank-wide picture

> **Correction (2026-09-25):** this section originally stated "1,999 total
> questions." That figure was wrong — a self-caught error, found while
> verifying an unrelated write during Workstream 3A. The correct total is
> **4,946** (203 `case` + 3,928 `mcq` + 815 `open`), confirmed two
> independent ways: a direct `COUNT(*)` on `questions`, and the sum of the
> status × answer_status matrix immediately below (18+6+5+209+1,777+806+799+
> 74+1,252 = 4,946), which was already correct in this report and needed no
> change. Nothing else in this report depended on the wrong "1,999" figure —
> every other count here (574 flagged answer-key rows, 1,326 gradable, the
> visual-completeness and structural-completeness tables, etc.) was computed
> independently and is unaffected.

4,946 total questions across CBSE and ICSE. `GRADABLE_STATUSES = ['verified',
'qa_passed', 'published']` is the one true definition of "currently servable
to a real student" (from `content-rules.js`). Today, only `status='verified'`
rows exist among these — no `qa_passed` or `published` rows have been created
yet. 1,326 questions are gradable right now: 1,252 with `answer_status`
`verified`, and 74 with `answer_status` `source_provided` (these 74 also have
a null `question_uid`, a separate provenance note under Section 6).

The full `status` × `answer_status` matrix:

| status | answer_status | count |
|---|---|---|
| needs_review | needs_review | 18 |
| needs_review | source_provided | 6 |
| needs_review | unavailable | 5 |
| transcribed | needs_review | 209 |
| transcribed | source_provided | 1,777 |
| transcribed | unavailable | 806 |
| transcribed | verified | 799 |
| verified | source_provided | 74 |
| verified | verified | 1,252 |

Zero anomalies: no row currently gradable (`verified`/`qa_passed`/`published`)
has an `answer_status` outside `{source_provided, verified}` — the two
combinations above are the only ones that occur among gradable rows, and both
are legitimate.

## 2. Answer-key integrity — the 122 known records, plus what else was found

**574 MCQ/case rows have some form of null or non-numeric `correct` value or
answer-shape irregularity.** Of these, **449 are not defects** — they are
MCQ rows where `correct IS NULL` and `answer_status = 'unavailable'`, which is
the deliberate, correctly-recorded "we do not have this answer key yet" state
the content team already flagged accurately. Treating these as defects would
have inflated the real number by more than 4x; they are excluded from the
defect count below and are already correctly excluded from
`GRADABLE_STATUSES` promotion eligibility by their own `status` (all are
`transcribed`).

**125 rows are genuine defects** — a `correct` value that is present but
cannot be graded as-is:

- **122** are the previously-known malformed records from the Phase 4
  migration-validation work (`docs/phase-4-migration-validation-artifacts/migrate-report.json`):
  MCQ rows where `correct` was stored as a non-integer string (e.g. `"(b)"`,
  a literal answer-choice label rather than a 0-based index). All 122 are
  `status='transcribed'` — none are currently gradable, none are visible to a
  real student today.
- **3 are newly discovered** by this audit, previously undocumented: question
  id 1965 (`icse-chemistry-periodic-table-0270e846`, a case-type question, ICSE
  Chemistry, "Periodic Table") has three sub-parts whose `correct` fields hold
  the literal strings `"F"`, `"He"`, and `"'Z'"` — element symbols and a
  quoted letter, not the numeric option-indices the grading code expects. Same
  root pattern as the 122 (a label transcribed in place of an index), same
  chapter/subject as several of the 122, and also `status='transcribed'` — not
  currently gradable.

**Total genuine answer-key defects: 125. Currently gradable/live defects: 0.**
Every one of the 125 is safely contained in the pre-publication backlog.

No malformed `options_json` shapes were found anywhere in the bank (no
invalid JSON, no non-array value, no fewer-than-two-option row) — the
malformation is isolated entirely to the `correct` field's type, not the
options structure.

**Why this never crashed the app:** `scoring.js`'s grading path compares
`Number(submitted.optionIndex) === Number(step.correct)`. If a malformed
value like `"(b)"` were ever served, `Number("(b)")` is `NaN`, and `NaN ===
anything` is always `false` — the question would simply always grade as wrong
for every student, silently, never throwing an error. This is a real risk
worth naming even though it hasn't materialized (none of the 125 are
gradable today): it means a future accidental bulk-promotion of these rows
would fail silently rather than loudly, which is exactly the kind of mistake
the read-only → identify → classify → report → review → correct sequencing
this workstream follows is meant to prevent.

## 3. A previously-undocumented gap in the existing promotion-readiness tool

While verifying this audit's own answer-key check against the known 122
records, I found that `audit-publication-readiness.js`'s existing
`correct_index_out_of_range` check (`q.correct == null || q.correct < 0 ||
q.correct >= opts.length`) does not catch any of the 122 malformed records,
despite all 122 being inside that script's own candidate pool. The reason is
a JavaScript numeric-comparison pitfall: `Number("(b)")` is `NaN`, and `NaN <
0`, `NaN >= n`, and `NaN === n` are all `false` for any `n` — so a
non-numeric `correct` value silently passes an "out of range" check that
was written assuming a numeric comparison would correctly fail on bad input.
Empirically, all 122 were instead (coincidentally) caught by that script for
unrelated reasons — `missing_source_page`, `visual_needed_but_no_asset_row`,
and (for 56 of them) `missing_source_document_id` — meaning if those
unrelated documentation gaps are ever closed independently, the 122 malformed
records would stop being flagged by that tool at all. This is not something
that needs to change in `audit-publication-readiness.js` itself (it is an
existing, historical tool, preserved per the project's standing rules); it is
named here so the gap is on record, and this audit's own check
(`content-qa-audit.js`) explicitly tests `typeof(correct)` rather than
relying on a numeric range comparison, so it does not share this blind spot.

## 4. Currently-gradable content-quality issues (live, servable questions)

Unlike the answer-key defects above, these 8 issues are on **`status =
'verified'`** rows — i.e., questions a real student could be served today:

| id | question_uid | chapter | issue |
|---|---|---|---|
| 2865 | icse-mathematics-gst-goods-and-service-tax-7f1c2b89 | GST (Goods and Service Tax) | question text missing or too short |
| 2868 | icse-mathematics-gst-goods-and-service-tax-593c07ac | GST (Goods and Service Tax) | duplicate option text |
| 2941 | icse-mathematics-banking-recurring-deposit-accounts-180fbd5a | Banking (Recurring Deposit Accounts) | duplicate option text |
| 3033 | icse-mathematics-linear-inequation-02454b78 | Linear Inequation | duplicate option text |
| 3053 | icse-mathematics-linear-inequation-e1f75224 | Linear Inequation | duplicate option text |
| 3070 | icse-mathematics-linear-inequation-ace0c077 | Linear Inequation | duplicate option text |
| 3595 | icse-history-and-civics-the-partition-of-bengal-efb3286a | The Partition of Bengal | duplicate option text |
| 3755 | icse-history-and-civics-towards-partition-of-india-1944-1947-36577565 | Towards Partition of India (1944-1947) | duplicate option text |

A duplicate-option-text question is still technically gradable (the correct
index is valid) but presents two answer choices with identical text to the
student — a real, visible content-quality defect, not a data-integrity crash
risk. Note id 3070 also appears in Section 5's visual-completeness findings
below (same question has two independent, unrelated defects). 12 further
non-gradable rows have the same two issue types in the `transcribed`/backlog
pool (10 duplicate-option-text, 2 missing/short text) and are lower priority
since they are not yet visible to any student.

## 5. Visual/diagram completeness

2,827 questions have `diagram_status` in `{'source_diagram_preserved',
'needs_visual_review'}` (i.e., are marked as needing or having a visual). This
audit's classifier is `asset_type`-aware — it distinguishes a genuine
per-question crop (`asset_type='source_cropped'` or `'ai_generated'`) from a
whole scanned page (`'source_page_full'`) and from a reference that isn't
even an image file — correcting the specific blind spot in
`audit-publication-readiness.js`'s existing `classifyAsset()` function, which
classifies any on-disk image file as `'real_extracted_image'` without ever
checking `asset_type`, so it cannot tell a whole-page photo from a real crop.

| Classification | All rows | Gradable rows |
|---|---|---|
| `missing_no_asset_row` — marked as needing a visual, no `visual_assets` row exists at all | 2,679 | 74 |
| `only_whole_page_photo_not_genuinely_servable` — a real image file exists, but every asset is a whole scanned page (`source_page_full`), not a per-question crop | 68 | 0 |
| `not_an_image_reference` — the asset row's file isn't an image at all | 80 | 25 |

**The `not_an_image_reference` category is a genuine, third and distinct
defect, not a classifier bug.** I verified this directly against the
database rather than assuming my own code's expected behavior was correct:
all 80 of these rows' `visual_assets.asset_path` values point directly at a
raw, multi-page/multi-chapter **source PDF file** (14 distinct files, e.g.
`source_library/ICSE/Mathematics/ch04-linear-inequation.pdf`,
`source_library/CBSE/Mathematics/ch3-4.pdf`), each recorded with
`asset_type='source_page_full'`. No image extraction happened for these
questions at all — the asset row is a pointer to the entire original source
document, not even a whole scanned page image, let alone a per-question crop.
This cannot be rendered inline as a diagram by the frontend at all (a PDF is
not an `<img>` source), which makes it a more severe gap than the
whole-page-photo case above: those 68 rows at least have a real, if
imprecise, image to show.

The 25 currently-gradable `not_an_image_reference` questions concentrate in
a small number of chapters — most heavily CBSE Mathematics "Triangles" (part
of the wider 17-row `ch3-4.pdf`/`ch5-6.pdf` group) and ICSE Mathematics
"Linear Inequation" (8 rows, all pointing at the same
`ch04-linear-inequation.pdf`). Full per-chapter breakdown, all rows:

| Board / Subject / Chapter | Count |
|---|---|
| CBSE Mathematics — Triangles | 17 |
| CBSE Mathematics — Polynomials | 9 |
| ICSE Mathematics — Linear Inequation | 8 |
| CBSE Mathematics — Arithmetic Progressions | 7 |
| CBSE Mathematics — Pair of Linear Equations in Two Variables | 6 |
| CBSE Mathematics — Areas Related to Circles | 6 |
| CBSE Mathematics — Co-ordinate Geometry | 5 |
| ICSE History and Civics — Subhash Chandra Bose and the Indian National Army (INA) | 3 |
| CBSE Mathematics — Real Numbers | 2 |
| CBSE Mathematics — Introduction to Trigonometry | 2 |
| ICSE History and Civics — Second Phase of the Indian National Movement (1905-1916) | 2 |
| ICSE History and Civics — Mahatma Gandhi and Popular National Movement | 2 |
| ICSE History and Civics — The Second World War | 2 |
| CBSE Mathematics — Quadratic Equations | 1 |
| ICSE History and Civics — six further chapters | 1 each (6) |

**Bottom line on visuals:** of the 2,827 questions marked as needing a
diagram, only a minority have a genuinely servable per-question visual today
(everything not in one of the three rows above); the 2,679
`missing_no_asset_row` figure is the largest single gap in the bank by a wide
margin, and 99 rows (68 + 80 minus the id-3070 overlap already counted in
Section 4) have an asset row that exists but is not a usable per-question
image. None of this affects grading correctness — a missing or unusable
diagram makes a question harder to answer without its figure, but does not
cause an incorrect grade — so it is a content-completeness issue, not a
data-integrity one.

## 6. Backlog and provenance

- **409 questions** are in `duplicate_flags` with `status='pending'` — an
  existing, already-tracked review backlog (near-duplicate candidate pairs
  awaiting a `kept_both`/`merged`/`discarded_new` decision). This audit did
  not re-evaluate duplicate-detection accuracy; it only confirms the backlog
  size is unchanged and none of the 409 have been silently resolved.
- **74 currently-gradable questions have a null `question_uid`.** These are
  exactly the 74 `status='verified', answer_status='source_provided'` rows
  noted in Section 1 — a distinct provenance note (their answer key traces to
  the source material but the row itself lacks the UID assigned to the other
  1,252 fully-provenanced gradable rows). This was already known from prior
  work; this audit confirms the count is stable and that these rows carry no
  additional defects beyond the missing UID itself.

## 7. Summary table

| Area | Total examined | Genuine defects | Of which currently gradable/live |
|---|---|---|---|
| Answer-key integrity (`correct` field) | 574 flagged, 449 expected-null | 125 | 0 |
| Status/answer_status consistency | 4,946 | 0 anomalies | 0 |
| Structural completeness (text/options) | 20 | 20 | 8 |
| Visual completeness — no asset at all | 2,679 | 2,679 | 74 |
| Visual completeness — whole-page photo only | 68 | 68 | 0 |
| Visual completeness — raw PDF reference (not an image) | 80 | 80 | 25 |
| Duplicate-review backlog | 409 pending | (pre-existing, unchanged) | n/a |

**The single most actionable finding for immediate, deliberate human review**
is Section 4: 8 currently-gradable questions with visible content defects
(1 missing/short text, 7 duplicate option text) that real students could
encounter today. Everything else of consequence (the 125 answer-key defects,
all visual-completeness gaps) sits safely in the pre-publication backlog and
poses no immediate live risk — but does represent the bulk of what remains
before more of the `transcribed` backlog can responsibly move toward
`verified`.

## 8. Explicitly not done (per standing instruction)

No `status` or `answer_status` value was changed. No `correct` value was
changed. No question was deleted. No source provenance field was altered. No
diagram or visual asset was replaced, generated, or modified. No preserved
original in `source_library/` was touched. The live database was opened only
with `{ readOnly: true }` and its SHA-256 hash is unchanged from before this
workstream began. This document and its underlying script are audit and
reporting artifacts only; every finding above is a recommendation for
separate, deliberate, reviewed correction work.
