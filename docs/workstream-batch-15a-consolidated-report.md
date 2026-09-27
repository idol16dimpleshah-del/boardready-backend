# Batch 15A — Defect Resolution + Publication — Consolidated Report

All corrected-scope tasks are complete. **Before executing anything, this
batch's premise was checked against the actual live database and found to
be stale in several places** — that correction is documented first, since
it changed what the batch actually needed to do.

## Correcting the batch's starting assumptions

The proposed "Pending / proposed" and "Important newly discovered defects"
lists did not match the live database at the time this batch started (all
verified directly, not assumed):

- **1594/1230 publication promotion and visual association were already
  complete** — Batch 15 Tasks 1-4 had already promoted both to
  `verified`/`verified` and associated both visuals live
  (`diagram_status='adapted_verified'`). Nothing remained to do for either.
- **SVGs for 1508, 1231, 1727 (and also 4833 and 2061) were already built
  and browser-QA'd** (Batch 15 Tasks 8-12) — none needed generating.
- **2061's `correct` field was already numeric** (fixed in Batch 15 Task
  7) — nothing to convert.
- **5 of the "six confirmed answer-index defects" were already corrected
  and live** (Batch 15 Task 5: 4569, 4580 part iv, 4651, 4662, 4665); the
  6th (4648) had already been individually re-checked and found genuinely
  ambiguous, not a confirmable defect — re-running the audit could not
  change that, since the ambiguity is in the source material, not in
  tooling coverage.
- **4833 had already been fully investigated** (Batch 15 Tasks 6 and 10),
  with a materially more specific finding than "possible answer-index
  defect": 3 confirmed sub-defects, of which only one (part i) has a
  source-backed correction; the other two (parts iii, v) have no valid
  answer among their own stated options under any coordinate reading, and
  need a human reviewer with textbook/errata access, not more audit passes.

Given this, the batch was re-scoped to the real remaining work, keeping the
same intent (resolve defects, then publish, before expanding the visual
pipeline further) and the same discipline (every write individually
guarded, backed up, diffed, regression-tested, and documented).

## What this batch actually did

| # | Task | Result |
|---|---|---|
| 1 | Correct 4833 part (i) index (0→1) | **APPLIED**. Parts (iii)/(v) formally flagged NEEDS HUMAN REVIEW — not mechanically fixable, no live write possible for them. |
| 2-5 | Promote 4569, 4651, 4662, 4665 to `verified` | **APPLIED** (4 writes) |
| 6 | Promote 2061 to `verified`/`verified` | **APPLIED** — first independently verified the chemistry itself (electron-flow direction at the anode), since Task 7's fix was format-only |
| 7 | Associate 2061's visual live | **APPLIED** |
| 8 | Promote 1727 to `verified`/`verified` | **APPLIED** — content was already independently re-derived in Task 12 |
| 9 | Associate 1727's visual live | **APPLIED** |
| 10 | Re-run bank-wide answer-index audit + live serving-query check | **COMPLETED** (read-only) — 0 anomalies; real HTTP API confirmed correct serving for 2061/1727 |
| 11 | Audit all `adapted_verified` questions for actual gradability | **COMPLETED** (read-only) — found id 4575 is visual-complete but not currently servable (`status='transcribed'`); flagged, not corrected (outside this batch's scope) |
| 12 | Refreshed publication-readiness count + this report | **COMPLETED** |

(Tasks are numbered per this batch's own corrected list; the original
proposal's task numbering doesn't map 1:1 since several proposed items were
already done.)

## Live database writes — full accounting

**9 live writes**, each with its own correction record, byte-identical
backup, guarded transaction (exact-prior-state verification, `changes===1`
check, post-write byte-identical verification of every untouched column),
full-table diff, `content-qa-audit.js` re-run, 71/71×2 regression, and hash
check:

1. id 4833 — `parts_json[0].correct` 0→1
2. id 4569 — `status` transcribed→verified
3. id 4651 — `status` transcribed→verified
4. id 4662 — `status` transcribed→verified
5. id 4665 — `status` transcribed→verified
6. id 2061 — `status`/`answer_status` → verified/verified
7. id 2061 — 2 `visual_assets` rows inserted, `diagram_status`→adapted_verified
8. id 1727 — `status`/`answer_status` → verified/verified
9. id 1727 — 2 `visual_assets` rows inserted, `diagram_status`→adapted_verified

## Counts

- **Live writes:** 9
- **Questions with a content defect corrected:** 5 (4833 part i, 4569, 4651, 4662, 4665) — note 2061's defect was already corrected in the prior batch; this batch's work on 2061 was independent chemistry verification + promotion, not a new correction
- **Questions promoted to gradable this batch:** 6 (4569, 4651, 4662, 4665, 2061, 1727)
- **Visuals associated live this batch:** 2 (2061, 1727)
- **New content defects discovered, confirmed unfixable by this audit:** 2 (4833 parts iii and v — no valid option exists under any coordinate reading; needs human/textbook-errata review)
- **Bank-wide gradable count:** 1328 → 1334
- **`visual_assets` rows:** 169 → 173
- **Fully live+servable `adapted_verified` questions:** 5 of 6 (1230, 1594, 3070, 2061, 1727) — 4575 has a live visual but `status='transcribed'`, so it is not currently reachable by test generation; flagged as a 1-write follow-up, not fixed here (outside this batch's authorized scope)

## Regression and hash evidence

Every one of the 9 writes, and every read-only task, was followed by
`DB_ENGINE=sqlite npm test` (71/71) and `DB_ENGINE=postgres npm test`
(71/71), plus a `sha256sum boardready.db` check before and after. No
regression failure occurred anywhere in this batch. The live serving-query
check (Task 10) additionally drove the real HTTP API — register, create
attempt, fetch questions, check answer — against a disposable copy of the
live database, confirming `diagramUrl` resolution, byte-identical SVG
serving, and correct grading for 2061 and 1727 through the actual student-
facing endpoints, not just `scoring.js` unit calls.

**Final live database hash:**
`6a42c81c8f3ea3e390ff065dab1f91fdccfa34cd9ce73a40ca104d74103b5502`

## What's next

- **4575**: one `status` promotion write away from being the 6th fully-live
  `adapted_verified` question (found in Task 11 of this batch, not yet
  actioned).
- **4833 parts (iii) and (v)**: genuinely need a human reviewer with the
  original textbook or its errata — no further automated audit pass will
  resolve them.
- **id 4648**: remains genuinely ambiguous, correctly untouched.
- **1508 and 1231**: visuals already built and browser-QA'd (Batch 15 Tasks
  8-9); their content has not yet been independently verified
  (`answer_status='source_provided'`) — a content-QA pass on these two,
  independent of their already-finished visuals, is the natural next step
  before either can be promoted.
- **123-row `competency.pdf` ICSE Chemistry answer-index defect batch** and
  the **`needs_visual_review` triage backlog**: unchanged from Batch 15's
  Task 13/14 findings, still better suited to their own dedicated batches
  than to per-question inclusion here.
- **CBSE Mathematics/Circles cluster** (42 rows, content already verified,
  real whole-page photos on file): still the best-scoped candidate pool for
  the next visual-production batch, once this defect-resolution/publication
  batch's own follow-ups (4575, 4833 iii/v, 1508/1231 content review) are
  cleared.

`audit-publication-readiness-output.json` was not modified, run, or
committed at any point in this batch.
