# CBSE Mathematics Reconciliation Report

**Purpose (per explicit user request, delivered mid-Batch-16-execution):**
before continuing the CBSE Maths status-promotion campaign further, answer
"of all the CBSE Maths material given to Board Ready, exactly how much of
it is safely usable?" — reconciling uploaded source material against what
was ingested, what is currently in the live database, what is verified,
and what is actually gradable, and surfacing any duplication, exclusion,
or un-ingested backlog along the way. This is a read-only investigation —
no database writes were made while producing it.

## 1. The uploaded source material

`source_library/CBSE/Mathematics/` holds the archived originals: 7 PDFs
(`ch1-2.pdf` through `ch14-15.pdf`, each spanning 2-3 of the textbook's 15
numbered chapters) plus 27 individually-photographed page images for four
chapters (Triangles, Surface Areas and Volumes, Statistics, Probability).
A further 27 photographed-page images live in
`source_library/CBSE/_pending_classification_2026-09-17/` under hashed
filenames — a staging folder from a large 32-photo upload received
2026-09-17 (documented in `PROJECT_PROGRESS.md`, "Large new upload batch
received 2026-09-17").

**That staging folder is NOT a hidden backlog.** Cross-checking its 27
files against `source_files` shows all 27 already carry proper
chapter-specific `stable_id`s (e.g. `CBSE-MATH-CIRCLES-P8.13`) and 26 of
27 are linked to a completed `source_documents` ingestion batch (Circles,
Trigonometric Ratios, Trigonometric Identities, Heights and Distances,
Areas Related to Circles). The 27th (`CBSE-MATH-CIRCLES-P8.22-ANSWERS`) is
a photograph of the chapter's printed answer key, correctly never turned
into its own ingestion batch since it contains no question text of its
own. The folder's name is now stale — everything in it has been triaged —
but the physical files were never moved out of it, which is cosmetic, not
a data-completeness problem.

**Chapter coverage is complete.** The 7 source PDFs, by their own
filenames, span the textbook's chapters 1-15 (Real Numbers, Polynomials,
Pair of Linear Equations, Quadratic Equations, Arithmetic Progressions,
Co-ordinate Geometry, Triangles, Circles, Trigonometric Ratios,
Trigonometric Identities, Heights and Distances, Areas Related to Circles,
Surface Areas and Volumes, Statistics, Probability — 15 chapters). Every
one of these 15 has at least one completed `source_documents` ingestion
batch. Every previously-flagged partial ingestion was later closed by a
dedicated gap-fill batch:

| Chapter | Partial batch | Gap | Gap-fill batch | Closed? |
|---|---|---|---|---|
| Trigonometric Ratios | id 148, items 1-2 & 27-37 | items 3-26 missing | id 157, items 3-26 (24 items) | Yes, exact |
| Areas Related to Circles | id 149, items 1-37 | items 38+ missing | id 158, items 38-68 (31 items) | Yes, exact |
| Statistics | id 102, item 3 + 55-58 deliberately excluded | 5 items | id 159, items 3 & 55-58 (5 items) | Yes, exact |
| Triangles | id 104, tail only (items 37-47, pp.7.16-7.20) | items 1-36 | id 156, full chapter items 1-47 (47 items) | Yes — but see §3, this created a duplicate, not a clean gap-fill |

No chapter in the uploaded material is missing a follow-up ingestion pass.
This directly answers the "not yet ingested" half of the user's concern:
there is no evidence of unprocessed CBSE Maths source material sitting in
backlog.

## 2. Ingested → in-DB reconciliation

`source_documents` (the ingestion-tracking table) has 19 CBSE Mathematics
rows, `ingested_count` summing to **867**, `skipped_exact_duplicates`
summing to **0** (the ingestion-time exact-duplicate detector never fired
for CBSE Maths), `flagged_near_duplicates` summing to **60** (pending,
unresolved — see §4).

The live `questions` table has **882** CBSE Mathematics rows. The
difference: 867 rows carry a `source_document_id` linking them to one of
the 19 tracked ingestion batches; the remaining **15** rows (ids 60-74,
8 in Pair of Linear Equations, 7 in Quadratic Equations) have no
`source_document_id`, no `question_uid`, and `source` = null. These are
legacy pre-provenance rows predating the `source_documents`/`question_uid`
tracking system entirely — already `status='verified'` (gradable) with
`answer_status='source_provided'` and `diagram_status='needs_visual_review'`.
They are not part of the transcribed/verified candidate pool this campaign
touches, but they are a known, pre-existing gap in provenance that this
reconciliation surfaced rather than a new problem — flagged here for
visibility, not urgent.

**867 (linked) + 15 (legacy, unlinked) = 882 — fully reconciled, no
unexplained rows.**

## 3. Confirmed duplicate content (new findings this reconciliation)

Every CBSE Maths chapter with more than one `source_documents` ingestion
batch was cross-checked pairwise (token-overlap similarity across every
question pair between the two batches, then individually read to confirm
or reject). Three chapters had multiple batches: Statistics, Triangles,
Areas Related to Circles.

**Statistics (doc 102 vs doc 159): no real duplicates.** The handful of
token-overlap hits were all against the same single question (id 4946,
"the arithmetic mean of 1, 2, 3, ..., n is") matching several *unrelated*
mean-and-average questions on generic shared vocabulary — read
individually, none are the same question. False positives, consistent
with this session's established pattern for automated similarity flags.

**Triangles (doc 104 vs doc 156): CONFIRMED duplicate ingestion, 10
questions.** doc 104 was the original tail-only ingestion (pp.7.16-7.20,
11 items, explicitly noted at the time as covering only the chapter's
tail because items 1-36 weren't among the photographed pages). doc 156 was
a later, independent ingestion of the *complete* chapter straight from
`ch7-8.pdf` (items 1-47) — which necessarily re-captured the same
pp.7.16-7.20 content doc 104 already had. Reading the two sets side by
side confirms items 38-47 in doc 104 (ids 2852-2861) are the same
underlying questions as items 38-47 in doc 156 (ids 4881-4890),
independently transcribed twice with wording/OCR variance (e.g. id 2853
"In a room a bulb is fixed..." = id 4882, same question, 89% token
overlap). Neither ingestion pass's duplicate detector caught this
(`skipped_exact_duplicates=0` both times) — expected, since the two
transcriptions aren't byte-identical text, only the same underlying
question.

One further item, doc 104's id 2851 (item 37), is **not a real question**
at all — its `text` field is an ingestion-time annotation ("Sub-parts
(i)-(ii) and this item's stem are on an earlier page... not captured")
that was stored as if it were question content, with `options_json=null`.
This is a data-quality defect distinct from duplication, unrelated to
answer-key correctness.

**Practical impact — currently zero.** All 11 doc-104 rows are still at
`answer_status='source_provided'`, one pipeline stage before this
campaign's `transcribed→verified` promotion touches anything (the
campaign only promotes rows already at `answer_status='verified'`). None
of doc 104's rows are in the current candidate pool, so nothing has been
or will imminently be double-promoted. This is a **future cleanup item**
(retire or merge the 10 duplicate rows and fix/retire the id-2851 stub
before doc 104 ever reaches independent verification), not a blocker to
the live campaign.

**Areas Related to Circles (doc 149 vs doc 158): CONFIRMED duplicate,
1 pair — live risk.** Unlike Triangles, doc 149 (items 1-37) and doc 158
(items 38-68) were designed as non-overlapping continuations, and the
majority of the pairwise token-overlap hits between them are shared
geometry vocabulary (r₁, r₂, sector, segment, area) across genuinely
different questions — false positives, same as Statistics. **One pair is
a real, exact duplicate**: id 4442 (doc 149, item 19) and id 4927 (doc
158, item 50) are the same classic "sum of two circles' areas equals a
third circle's area, so r₁²+r₂² ___ r²" question, transcribed with two
different option sets (id 4442: comparison options ">, =, <, none"; id
4927: equation options "r=r₁+r₂ / r₁²+r₂²=r² / ..."), both correctly
keyed to the same underlying fact. **Both are currently live candidates
in the transcribed+verified+not_applicable pool** (unlike the Triangles
pair) — this one needs a decision before the campaign reaches Areas
Related to Circles: promote both and disclose (this session's precedent
for 4303/4318 and 4343/4346), or hold one back. See "Open questions" below.

## 4. `duplicate_flags` (automated near-duplicate detector)

60 pending flags exist across the 19 CBSE Maths ingestion batches
(bank-wide: 409 pending, all subjects/boards). Consistent with this
session's established finding (Batches 1 and 2 of this same campaign, and
earlier work this session), these flags require individual confirmation
in both directions — several checked so far have been false positives,
and at least one real duplicate (Triangles doc104/doc156, id 4343/4346 in
Trig Identities) was NOT caught by this detector at all. The per-question
verification checklist already in use for this campaign (step 5: "check
`duplicate_flags` for the id") continues to catch these one at a time as
each batch is processed; no separate blocking pass is needed for this.

## 5. The requested stage table

| Stage | CBSE Maths questions |
|---|---|
| Chapters in uploaded source material | 15 of 15 (complete — see §1) |
| Successfully ingested (`source_documents.ingested_count` sum) | 867 |
| Exact duplicates skipped at ingestion time | 0 |
| Near-duplicates flagged (pending, unresolved) | 60 |
| Additional duplicates found by this reconciliation (not caught above) | 11 confirmed (10 Triangles + 1 Areas Related to Circles), 1 non-question stub |
| Currently in DB (867 linked + 15 legacy unlinked) | 882 |
| `answer_status = 'verified'` | 667 |
| `answer_status = 'verified'` AND `diagram_status = 'not_applicable'` (no visual needed) | 564 |
| — already gradable within that set (pre- + during-campaign) | 53 (49 promoted in this campaign's Batches 1-2; 4 were already gradable before the campaign started) |
| — remaining in the active candidate pool | 511 |
| `answer_status = 'verified'` but a visual is still required | 103 |
| `answer_status = 'source_provided'` (not yet independently re-verified — includes the Triangles doc-104 duplicate set) | 188 |
| `answer_status = 'needs_review'` (flagged answer-key defects, pre-existing) | 27 |
| Currently gradable overall, any pipeline path | 69 |

## 6. Bottom line

Within these 15 chapters, there is no meaningful hidden backlog of
never-ingested CBSE Maths source material — every chapter was ingested,
every previously-known gap was closed by a follow-up batch, and the
`_pending_classification` staging folder is fully accounted for. The gap
between the user's recollection of "1,000+ uploaded questions" and the
867 actually extracted is most plausibly explained by upload volume being
an upfront estimate of the full textbook rather than a literal count, not
by lost or unprocessed material — nothing found here contradicts 867
being close to the true total obtainable from these particular source
files. What reconciliation DID surface, beyond the already-known 511-item
candidate pool: 11 confirmed duplicate questions (10 low-priority/dormant
in Triangles, 1 live/actionable in Areas Related to Circles), 1 broken
non-question stub row, and 15 long-standing legacy rows with no
provenance link. None of these are large in count, but all three are
concrete, evidence-based, and exactly the kind of defect class individual
re-verification (rather than trusting `answer_status='verified'`) is
designed to catch.

## Open questions for the next decision point

1. **Areas Related to Circles duplicate (id 4442 / id 4927):** promote
   both when the campaign reaches this chapter and disclose the
   duplication (consistent with how 4303/4318 and 4343/4346 were handled
   in Batches 1-2), or hold one back pending a content-curation decision?
2. **Triangles doc-104 cluster (10 duplicate + 1 stub rows, ids
   2851-2861):** these aren't blocking the current campaign (still at
   `answer_status='source_provided'`), but should they be retired/merged
   now, or left for a dedicated cleanup pass after the CBSE Maths
   promotion campaign completes?
3. **Resume the promotion campaign:** with this reconciliation complete
   and no evidence of a larger un-ingested backlog, is it correct to
   resume Batch 16 at Batch 3 (continuing through the 511-question
   candidate pool in ~20-25-question chunks, per the standing
   instruction), applying the Areas Related to Circles decision from (1)
   when that chapter is reached?
