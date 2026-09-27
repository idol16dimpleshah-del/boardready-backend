# Audit — the `answer_status='verified'` → correct `correct` index convention (Workstream 3H, Task 3 of batch)

**Status: read-only sample audit complete. No DB writes.** This follows from
4575's demonstrated failure mode: `answer_status='verified'` does not
guarantee `questions.correct` actually matches the source's own answer key.
This audit samples across subjects, boards, chapters, and source-ingestion
batches to estimate how widespread that failure mode is, and specifically
prioritizes recently-ingested content and `answer_status='verified'` rows, as
instructed.

**Live database SHA-256 before, during, and after this audit (unchanged —
every check is read-only; no table was written to):**
`99aa70be67603cd97ad130dfabd923b81f9f69a2d2165fb777d299324c8e25e2`

## Method

`answer_status='verified'` totals 2,051 rows across exactly 4 board/subject
combinations: CBSE Mathematics (667), ICSE History and Civics (667), ICSE
Mathematics (377), ICSE Geography (340), spread across 53 distinct
`source_documents`. Full coverage of all 2,051 rows by hand is not feasible
in one pass; this audit instead does a **full-chapter automated cross-check**
(every MCQ/case item in a chapter checked against its own chapter's rendered,
printed answer-key page — not spot-sampling within a chapter) for 5 CBSE
Mathematics source documents plus the 2 ICSE Mathematics geometry items
already fully hand-derived in Workstream 3E, then hand-independently
re-derives a subset of the resulting mismatches (not just trusting the
printed key blindly — see the ch154 finding below, where the printed key
itself turned out to be wrong) to calibrate confidence and correctly separate
**confirmed DB defect** from **source itself defective** from **needs further
verification** from **already self-flagged, not live**.

**Why CBSE Mathematics was prioritized:** it is where the one already-known
defect (4575) was found, and its `source_documents.label` values (written at
ingestion time) do **not** claim a printed-key cross-check the way ICSE
Mathematics and ICSE History & Civics labels explicitly do (e.g. chapter
110's label states "100/101 matched exactly," chapter 105's states "zero
discrepancies," chapter 112's states "every answer independently checked...
all 40 correct"). Several CBSE Mathematics chapter labels instead say
"self-derived answers" or nothing about verification at all (e.g. chapter
149, Areas Related to Circles PARTIAL — explicitly "p.12.16+ missing incl.
answer key, self-derived answers"). This asymmetry in disclosed rigor made
CBSE Mathematics the highest-priority area to sample fresh, rather than trust
the `answer_status='verified'` label at face value across the board.

**A secondary, near-free check:** several ICSE Mathematics and ICSE History &
Civics `source_documents.label` values name *specific* disclosed exceptions
(e.g. "item 61... ambiguous source wording," "item 26 flagged needs_review,"
two Lok Sabha items with a disclosed 552-vs-550 caveat). These were
cross-referenced directly against the live rows: in every case checked, the
disclosed exception is correctly reflected in the database (e.g. item 26 of
chapter 111 is indeed `status='needs_review'`/`correct=null`, not silently
served as verified). No inconsistency found between what these labels
disclose and what the live rows actually contain.

## Per-chapter results (full-chapter cross-check against rendered printed key)

| source_document | chapter | rows checked | matched | mismatched | of which already self-flagged (not live) | of which `answer_status='verified'` (live label, though `status` still `transcribed`) |
|---|---|---|---|---|---|---|
| 150 | CBSE Maths — Real Numbers | 70 | 68 | 2 | 2 | 0 |
| 151 | CBSE Maths — Polynomials | 63 | 56 | 7 | 0 | 7 |
| 152 | CBSE Maths — Pair of Linear Equations | 36 of 42 (items 37–42 not covered by the rendered key page) | 35 | 1 | 0 | 1 |
| 153 | CBSE Maths — Quadratic Equations | 57 | 48 | 9 | 3 | 6 |
| 154 | CBSE Maths — Arithmetic Progressions | 67 of 68 (1 `open`-kind item not MCQ-checkable) | 65 | 2 | 1 | 1 (see finding below — this one is a source-key error, not a DB defect) |
| 151/1594 geometry (ICSE Maths, Workstream 3E) | Angle & Cyclic Properties, Locus & Construction | 2 | 2 | 0 | — | — |

None of chapters 150–154's mismatches were previously known except 4575
itself (a different chapter, already corrected). Every "already self-flagged"
mismatch above has `answer_status` of `needs_review` (not `verified`) and
`correct=null` where applicable — i.e. these are not live defects, the
content pipeline had already caught them.

## Confirmed genuine defects (independently re-derived from scratch, matching the printed key, contradicting the stored value)

These 6 are **CONFIRMED DEFECT** — verified two ways (printed key + from-scratch
math/logic), not merely a printed-key lookup:

1. **id 4569** (ch.151, Polynomials, item 39): "If f(x) = 2x³ − kx² + 5x + 9
   is exactly divisible by x + 2, then k =". Divisibility by (x+2) requires
   f(−2)=0: 2(−8) − k(4) − 10 + 9 = −17 − 4k = 0 ⇒ **k = −17/4** (option b,
   index 1). Stored `correct = 2` (index 2, "−15/4") is wrong.
2. **id 4580**, part (iv) only (ch.151, item 50, case question): "one zero is
   6, sum of zeros is 0" ⇒ other zero = −6 ⇒ polynomial = x² − (sum)x +
   (product) = x² + 0x + (6)(−6) = **x² − 36** (option b, index 1). Stored
   `correct: 2` for this part ("x² − 6") is wrong. The other 4 parts of this
   same case question are correct.
3. **id 4651** (ch.153, Quadratic Equations, item 16): y=1 common root of
   ay²+ay+3=0 and y²+y+b=0. First equation: 2a+3=0 ⇒ a=−3/2. Second: 2+b=0 ⇒
   b=−2. ab = 3 (option a, index 0). Stored `correct = 2` (index 2, "6") is
   wrong.
4. **id 4662** (ch.153, item 27): p,q roots of x²+px+q=0 ⇒ sum p+q=−p ⇒
   q=−2p; product pq=q ⇒ q(p−1)=0 ⇒ p=1 (q=0 case isn't among the options) ⇒
   q=−2. **p=1, q=−2** (option a, index 0). Stored `correct = 2` (index 2,
   "p=−2, q=0") is wrong.
5. **id 4665** (ch.153, item 30): one root 3× the other ⇒ roots r, 3r ⇒ sum
   4r=−b/a, product 3r²=c/a ⇒ 3(b²/16a²)=c/a ⇒ **b²:ac = 16:3** (option c,
   index 2). Stored `correct = 3` (index 3, "16:1") is wrong.
6. **id 4648** (ch.153, item 13): "A quadratic equation can have..." — under
   the CBSE-curriculum convention (a real quadratic always has exactly two
   roots, counting a repeated real root or a complex-conjugate pair), the
   textbook-standard answer is "exactly two roots" (option c, index 2).
   Stored `correct = 1` (index 1, "at most two roots") does not match this
   convention or the printed key. Flagged with slightly lower confidence than
   1–5 above since it turns on curricular phrasing rather than pure algebra,
   but both the printed key and standard convention agree against the stored
   value.

All 6 have `answer_status = 'verified'`, `status = 'transcribed'` — i.e. not
currently gradable/servable (the same "verified but not yet promoted to
gradable" state 4575 was in before its own fix), so **no student has been
served a wrong grade from these** under the current status. But if `status`
were ever promoted on these rows without re-checking `correct` first, the
same live-grading defect 4575 had would recur.

## Source itself defective (the audit correctly did NOT treat this as a DB defect)

**id 4742** (ch.154, Arithmetic Progressions, item 50): "Which term of the
A.P. −29, −26, −23, ..., 61 is 16?" — confirmed via direct page rendering
that the DB's question text is a faithful, un-garbled transcription of the
source. Solving a_n = −29 + (n−1)(3) = 16 ⇒ n = 16 ⇒ **the 16th term**
(option b, index 1) — this **matches the stored `correct = 1` exactly**. The
printed answer key says "(d) 31st," which is the term whose *value* is 61,
not 16 — i.e. **the textbook's own printed key is wrong** (apparently solved
for the wrong target value, a common transposition error given "16" and "61"
differ by digit swap). The database is correct here; no action needed. This
is flagged specifically because it demonstrates why this audit independently
re-derives rather than trusting a printed key at face value — a raw
key-mismatch signal alone would have wrongly flagged the database.

## Flagged for further verification (printed-key cross-check only; not yet independently hand-derived)

These have `answer_status='verified'` and a printed-key mismatch, but were
**not** re-derived from scratch this session (case questions with multiple
sub-parts, or diagram-dependent items, take longer per item than the
remaining time budget allowed for this pass). They carry the same evidence
tier the pre-correction 4575 had — real enough to warrant the same
derive-then-decide treatment before any correction, but not yet at the
"independently confirmed" bar:

- ch.151 (Polynomials): id 4582 (item 52, case, parts ii/iii/v), id 4583
  (item 53, case, parts i/iii), id 4584 (item 54, case, part i), id 4588
  (item 58, Statement-1/2 assertion-reason), id 4589 (item 59, same format).
  Items 58/59 share the same "options are literally `[(a),(b),(c),(d)]`"
  transcription pattern already seen — and already correctly excluded via
  `needs_review` — in ch.150's item 64; here they are **not** excluded
  despite the same pattern, which is itself an inconsistency worth resolving
  (either both chapters' instances of this pattern should be flagged, or
  neither).
- ch.152 (Pair of Linear Equations): id 4606 (item 13) — depends on Fig. 3.8,
  not rendered this pass.
- ch.153 (Quadratic Equations): id 4687 (item 52, case, parts ii/iii), id
  4688 (item 53, case, parts iii/v).

## Recommendation: is a broader audit warranted?

**Yes.** Of the 5 CBSE Mathematics chapters fully cross-checked this session
(293 MCQ/case rows), 6 rows are confirmed genuine `correct`-index defects
and 8 more carry the same mismatch signal pending independent derivation —
14 total flagged rows out of 293, a **~4.8% flag rate**, concentrated
specifically in chapters whose ingestion labels did not claim a printed-key
verification pass (151, 153; contrast with 150 and 154, whose only
mismatches were either already self-flagged or turned out to be a source-key
error, not a DB defect — both effectively clean). This strongly suggests the
CBSE Mathematics batch was ingested with less rigor than the ICSE Mathematics
and ICSE History & Civics batches, whose disclosed labels claim (and, on the
specific items cross-referenced this session, appear to have actually
received) a real per-item printed-key check.

Concretely, I'd recommend, in priority order: (1) finish the same
full-chapter cross-check for the remaining CBSE Mathematics chapters not yet
covered this session (145–149, 155–159 — Circles, Trigonometric
Identities/Ratios, Heights and Distances, Areas Related to Circles ×2,
Triangles, Coordinate Geometry, Introduction to Trigonometry, Statistics —
several of which, per their own labels, are "32-image batch, reclassified"
or explicitly "self-derived answers" with no printed key at all, which would
need a different verification method entirely); (2) independently re-derive
the 8 "flagged, not yet confirmed" rows above; (3) only then decide
correction scope and apply guarded, per-row fixes mirroring 4575's pattern —
never bulk. ICSE Mathematics, ICSE History & Civics, and ICSE Geography were
not freshly sampled this session beyond the disclosed-exception
cross-reference (which found no inconsistency); given their labels claim (and
partial spot-checks elsewhere in this project, e.g. Workstream 3A's 3033/3070
findings in the ICSE Maths Linear Inequation chapter, found real — if
different-in-kind — defects even in a chapter whose label claimed "zero
discrepancies") a real per-item check, they are lower priority than the rest
of CBSE Mathematics but not zero-risk, and I'd still recommend at least a
sampling pass on the higher-volume ICSE History & Civics chapters (all 667
verified rows there) before treating that subject as fully clean.

## What was deliberately NOT done

- No `correct`, `status`, `answer_status`, or any other column was written
  anywhere. Every check in this document is a read plus an independent,
  by-hand derivation recorded here — nothing was applied.
- No bulk classification or promotion of any kind.
- The remaining ~10 CBSE Mathematics source documents, and all of ICSE
  Mathematics/History & Civics/Geography beyond the disclosed-exception
  spot-check, were not freshly audited this session — flagged above as the
  natural next scope for a broader pass, not silently skipped.
