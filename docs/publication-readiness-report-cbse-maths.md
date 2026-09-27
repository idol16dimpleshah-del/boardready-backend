# Publication-Readiness Report — CBSE Class 10 Mathematics

Read-only report. **No question's `status` field has been changed by this
report.** Source data: `audit-publication-readiness-output.json` (generated
2026-09-18 by `audit-publication-readiness.js`, a read-only classifier) joined
against a fresh live-DB query run 2026-09-22. This closes out the Phase C
publication-readiness deliverable that had been pending.

## Where the 882 CBSE Maths questions currently stand

| Bucket | Count | Meaning |
|---|---:|---|
| Already gradable (`status = verified`) | 15 | Live for students today |
| Excluded — answer not yet independently trustworthy (`answer_status = needs_review`) | 31 | Not evaluated for promotion until the answer-verification pass clears them |
| Stale vs. this audit — fixed since 2026-09-18 | 3 | The 3 "Pair of Linear Equations" items corrected during the independent answer-verification pass (see below) |
| **Evaluated as promotion candidates in this report** | **833** | The subject of the breakdown below |
| **Total CBSE Maths bank** | **882** | Matches the founder's target count exactly |

The 3 "stale" items (ids 4597, 4620, 4622) were `needs_review` when this
audit ran and so were correctly excluded from it; they were independently
re-derived from the source page images during the answer-verification pass
and are now `answer_status = verified`, `status` still `transcribed` — i.e.
they've *become* eligible for promotion since the audit ran, but aren't
reflected in the counts below yet. A 4th item from that same chapter (id
4596) has a genuine unresolved defect in the source book itself and remains
`needs_review` on purpose (documented in that chapter's fix script).

## The hard rule this report enforces

**A question is not complete if its associated diagram/visual is missing.**
So every one of the 833 candidates is classified first by whether it needs a
visual and, if so, whether a complete, real, extracted image exists for it —
not just whether a visual_assets row exists that merely points at an entire
un-cropped source PDF.

- `visual_not_needed` — no diagram required. Text-only question.
- `visual_complete_extracted` — a real, cropped, servable image exists.
- `visual_missing_no_asset` — needs a diagram; **no asset row exists at all.**
- `visual_incomplete_source_pdf_only` — a `visual_assets` row exists but only
  references the whole source PDF, not an extracted image — **not
  servable to a student as "the diagram" and does not satisfy the rule.**

Only the first two count as visually complete.

## Per-chapter breakdown (833 candidates)

| Chapter | Total | No visual needed | Visual complete | Visual missing (no asset) | Visual incomplete (PDF only) | **Ready now** | Ready but flagged | **Blocked — visual** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Application of Trigonometry | 29 | 27 | 2 | 0 | 0 | 24 | 5 | 0 |
| Areas Related to Circles | 67 | 55 | 5 | 1 | 6 | 48 | 12 | 7 |
| Arithmetic Progressions | 66 | 60 | 0 | 0 | 6 | 54 | 6 | 6 |
| Circles | 70 | 28 | 42 | 0 | 0 | 66 | 4 | 0 |
| Co-ordinate Geometry | 81 | 78 | 0 | 0 | 3 | 72 | 6 | 3 |
| Introduction to Trigonometry | 82 | 77 | 3 | 0 | 2 | 66 | 14 | 2 |
| Pair of Linear Equations in Two Variables | 38 | 32 | 0 | 0 | 6 | 32 | 0 | 6 |
| Polynomials | 63 | 54 | 0 | 0 | 9 | 42 | 12 | 9 |
| Probability | 60 | 60 | 0 | 0 | 0 | 52 | 8 | 0 |
| Quadratic Equations | 54 | 53 | 0 | 0 | 1 | 40 | 13 | 1 |
| Real Numbers | 63 | 61 | 0 | 0 | 2 | 53 | 8 | 2 |
| Statistics | 57 | 54 | 3 | 0 | 0 | 49 | 8 | 0 |
| Surface Areas and Volumes | 51 | 46 | 5 | 0 | 0 | 43 | 8 | 0 |
| Triangles | 52 | 34 | 4 | 0 | 14 | 27 | 11 | 14 |
| **TOTAL** | **833** | **719** | **64** | **1** | **49** | **668** | **115** | **50** |

- **Ready now (668)** — visually complete (or no visual needed) and no other
  completeness issue. These could be promoted (`status → verified` or
  `qa_passed`) without violating the diagram rule or any other completeness
  bar.
- **Ready but flagged (115)** — visually complete, but has a secondary issue
  that should be resolved first (see breakdown below) — mostly duplicate
  flags awaiting human resolution, not visual problems.
- **Blocked — visual (50)** — must **not** be promoted until a real,
  extracted diagram exists: 1 has no visual asset row at all, 49 only
  reference the whole, un-cropped source PDF.

## What's inside the "ready but flagged" bucket (115)

| Secondary issue | Count | What it means |
|---|---:|---|
| `has_pending_duplicate_flag` | 103 | Flagged by the ingestion pipeline as a possible duplicate of another question — needs a human duplicate-resolution pass, not a diagram fix |
| `missing_answer_key_ref` | 10 | Provenance metadata gap (no recorded page/citation for the answer key) — doesn't affect what the student sees, but worth backfilling |
| `kind_open_not_autogradable` | 3 | Open/descriptive questions the current auto-grader can't score — a scoring-engine question, not a content question |
| `text_missing_or_too_short` | 1 | Question id 2749 (Statistics) — text appears truncated or empty; needs a manual re-check against the source PDF before promotion |

None of these 115 involve a missing diagram, but none should be bulk-promoted
either — the duplicate flags in particular need a real decision (which of two
near-identical questions is canonical) before either copy goes live.

## What's inside the "blocked — visual" bucket (50)

By question kind: 26 case-study, 23 MCQ, 1 open. By chapter, the two biggest
concentrations are **Triangles (14)** and **Polynomials (9)**, followed by
Areas Related to Circles (7), Arithmetic Progressions (6), and Pair of Linear
Equations (6) — these five chapters account for 42 of the 50 blocked
questions and would be the highest-leverage place to focus diagram-extraction
work next. Case-study questions often share one diagram across several
grouped sub-questions, so extracting the source image for a case-study group
may unblock more than one question at a time — worth checking grouping before
treating this as 50 separate extraction jobs.

## Recommendation (no action taken — awaiting your decision)

1. **Do not bulk-promote.** Consistent with your standing instruction, this
   report classifies but does not change any `status` value.
2. Of the 833 candidates, **668 are genuinely complete** (text, options/parts,
   a source-backed answer, and — where needed — a real extracted diagram) and
   would be safe to promote selectively, chapter by chapter, whenever you're
   ready to do that pass.
3. The **115 flagged** items need a human duplicate/metadata pass first — a
   different kind of review than diagram QA.
4. The **50 blocked** items must wait for real diagram extraction — this is
   the same underlying work (finding the figure on the source PDF page and
   cropping/saving it as a servable image) already done for the 64 chapters'
   worth of `visual_complete_extracted` questions, just not yet done for
   these 50.

Full per-question detail (id, chapter, kind, bucket, specific issue) is in
`docs/cbse-maths-candidates.csv` alongside this report, for use when doing
the actual chapter-by-chapter promotion or diagram-extraction pass.

## CORRECTION — 2026-09-22: the "visual complete" numbers above are wrong

Found during the Phase 2 real-data-integration audit, before any of the 668
"ready now" questions were promoted — **do not promote based on the visual
completeness numbers in this report as originally written.**

`audit-publication-readiness.js`'s `classifyAsset()` function labels a
`visual_assets` row `real_extracted_image` (feeding into `visual_complete_extracted`
above) whenever its `asset_path` exists on disk and has an image extension
(`.jpg/.png/.svg/.webp`) — **it never checks whether the image is actually
cropped to the single diagram, versus a whole photographed textbook page.**

I checked the underlying files directly. All 161 `visual_assets` rows in the
live DB currently point to just 41 distinct physical files, every one of
them a 1.9MB+ whole-page photo — the smallest is 1.9MB, consistent with a
full-page phone photo, not a cropped figure (a real crop of one diagram is
typically tens to a few hundred KB). I opened several: one file
(`22d04f1c.jpg`, Circles chapter) is literally shared across at least 5
different questions with 5 different figure labels (Fig. 8.42 through 8.45,
plus one more), because it's one whole page containing all of them, hand-held
phone edge visible in the shot. Another (`8bdeef95.jpg`, Trigonometry) is a
full page of five unrelated MCQs (27–32) plus a large unrelated bridge photo,
with the actual figure for the question in question a small diagram in one
corner. Every asset_type in the live DB is `source_page_full` — the
classifier's file-extension check was simply the wrong test for "is this
extracted," and this bank has never had automated diagram cropping run on it.

**Corrected reality: the true count of genuinely servable, per-question
cropped diagrams in the CBSE Maths bank right now is 0** (not 64), and the
"Ready now" counts above that include chapters with any claimed
`visual_complete_extracted` questions (Application of Trigonometry,
Areas Related to Circles, Circles, Introduction to Trigonometry, Statistics,
Surface Areas and Volumes) are **overstated by that same margin** — those
specific "visually complete" questions are, on inspection, exactly as
incomplete as the ones already correctly bucketed as "blocked — visual."
Chapters with `visual_complete_extracted = 0` in the table above (Arithmetic
Progressions, Co-ordinate Geometry, Pair of Linear Equations, Polynomials,
Probability, Quadratic Equations, Real Numbers, Triangles) are unaffected by
this specific bug.

This does not change the "no visual needed" (719) bucket, which doesn't
depend on `classifyAsset()` at all, and it does not mean any of the 15 already
`verified` (gradable) questions are affected retroactively — none of those
15 were promoted based on this report; this report only ever classified the
833 *candidates*. No question's `status` has been changed as a result of
this correction, consistent with the standing "no bulk promotion" rule — this
section exists so nobody promotes from the old numbers. A corrected
`classifyAsset()` (checking file size/dimensions or, better, requiring a
distinct `asset_type` value your extraction tooling sets deliberately, rather
than inferring completeness from a file extension) and a re-run of this audit
is real, useful follow-up work, not yet done.
