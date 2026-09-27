# Publication-Gate Review — Questions 1594 and 1230 (Workstream 3E)

**Status: due-diligence review complete, read-only. No live database write has
been made for either question.** This applies the exact 6-point standard you
set before any promotion decision:

1. Read the exact source question and diagram.
2. Confirm the complete visual reconstruction specification.
3. Confirm the answer-key derivation is documented.
4. Check whether any other content issue prevents publication.
5. Only then decide whether `answer_status`/`status` should be promoted.
6. Keep visual association separate from content promotion.

Points 1–3 were already established in
`docs/workstream-3e-geometry-content-qa-1594-1230.md`; this document
consolidates them, completes point 4 (which had been interrupted by a
schema-lookup error), and — per your explicit instruction that verification
"isn't itself the promotion action" — stops at a **recommendation** for point
5 rather than applying anything. Point 6 is confirmed by construction: no
visual work has touched either question.

**Live database SHA-256 before and throughout this review (unchanged — every
check below is read-only):**
`4b384b86abc24651f13dfbb8d5a171e8a11032f1cebe2e9cb6d155df3ebee612`

## 1. Source question and diagram — confirmed

- **1594** — `icse-mathematics-angle-and-cyclic-properties-of-circle-1adba987`.
  Source: `chap_17.pdf`, p.17.4, item (22). Diagram: circle, diameter AB,
  centre O, points D/C on the arc, DC ∥ AB, dashed chord AC, ∠CAB = 35°
  marked at A. Already rendered and verified in Workstream 3C and re-confirmed
  in Workstream 3E.
- **1230** — `icse-mathematics-locus-and-construction-c23699f9`. Source:
  `chap_19.pdf`, p.19.6, item (33), an Assertion/Reason item. Diagram:
  triangle ABC, D = midpoint of BC (tick marks), AD ⊥ BC (right-angle mark at
  D), E on AD between A and D. Already rendered and verified in Workstream 3C
  and re-confirmed in Workstream 3E.

No new discrepancy found on this re-read; both match their source pages
exactly.

## 2. Visual reconstruction specification — confirmed complete

Both specifications are fully drafted in
`docs/workstream-3e-geometry-content-qa-1594-1230.md` (circle/chord/angle
layout for 1594; triangle/perpendicular-bisector layout for 1230), written to
the same level of geometric precision used for 3070 and 4575 before their SVGs
were built. **Neither has been acted on** — no SVG exists for either
question, consistent with keeping visual work strictly behind the promotion
decision (point 6).

## 3. Answer-key derivation — confirmed documented

Neither source chapter (`chap_17.pdf`, `chap_19.pdf`) contains a printed
answer key (confirmed by a full text scan of both for "ANSWER" — no match),
unlike 4575's chapter. So both were verified by from-scratch mathematical
derivation rather than by checking a printed key:

- **1594**: derived independently two ways (via side AD as transversal, and
  via side BC as transversal) — both give ∠DAC = 20°, matching the stored
  `correct = 2`.
- **1230**: derived via the perpendicular bisector theorem directly — A and R
  both true, R justifies A, matching the stored `correct = 2`.

Full derivations are in `docs/workstream-3e-geometry-content-qa-1594-1230.md`.
No defect found in either.

## 4. Other content issues — checked now, none found

This is the step that was interrupted last session by a wrong assumption
about the `duplicate_flags` table's column names. Corrected and completed:

**`duplicate_flags` real schema** (via `sqlite_master`, read-only):
`id, new_question_uid, existing_question_id, similarity, new_text,
existing_text, status, created_at`. Checked both directions for each
question — as an `existing_question_id` some other candidate was flagged
against, and as a `new_question_uid` this question itself was flagged as a
duplicate of something else:

| id | flagged as existing_question_id | flagged as new_question_uid |
|---|---|---|
| 1594 | none | none |
| 1230 | none | none |

**Internal option-text duplicates** (`options_json` self-comparison, the
check `structuralCompleteness` in `content-qa-audit.js` also runs):

- 1594: `["125°","35°","20°","55°"]` — all four distinct.
- 1230: `["A is true, R is false","A is false, R is true","Both A and R are
  true","Both A and R are false."]` — all four distinct.

**Cross-check against `docs/content-qa-audit-output.json`** (the current,
authoritative, whole-bank audit — re-searched the entire JSON tree for both
ids): the **only** section either id appears in is `visualCompleteness`, both
classified `missing_no_asset_row` (i.e. "flagged as needing a visual, no
asset row yet exists") — the same, already-known classification from
Workstream 3C, not a new content problem. Neither id appears in
`answerKeyIntegrity.findings`, `structuralCompleteness.findings`,
`statusMatrix.anomalies`, or `duplicateCorrectAnswerText.mcqFindings` — i.e.
no answer-key-integrity defect, no structural-completeness issue, and no
duplicate-correct-answer-text issue is flagged for either question under the
current audit methodology.

**Aside — a stale, superseded audit file found on disk:**
`audit-publication-readiness-output.json` (untracked, dated 2026-09-18) is
the output of `audit-publication-readiness.js`, a tool `content-qa-audit.js`'s
own header comment says it **supersedes** for these checks. That older file
flags both 1594 and 1230 with `missing_answer_key_ref`. This is expected and
not a defect: `answer_key_ref` is genuinely absent because, as established in
point 3, neither source chapter has a printed answer key to cite — there is
nothing to reference. `content-qa-audit.js` (the current tool) does not check
for this field at all, and a sample of 1,326 currently-gradable questions
shows `answer_key_ref` is null for only 15 of them (~1%) — consistent with it
being populated only when a source answer key exists, not a required field
for gradability. No action taken on this file; it is left exactly as found,
per the standing rule against touching existing audit/archive artifacts.

**`explanation` / `source_section` / `parts_json` being null:** checked
against the same 1,326-row gradable sample — `explanation` is null for 165
(12%), `source_section` for 838 (63%), `parts_json` for 1,229 (93%, and
expected here regardless since both questions are `kind='mcq'`, not `case`).
All three nulls are common/typical among already-gradable content, not
indicators of incompleteness specific to these two rows.

**Conclusion for point 4: no content issue was found that would prevent
publication of either 1594 or 1230.**

## Unrelated finding surfaced during this check (flagged, not fixed)

While re-reading 4575's row for the answer_key_ref baseline comparison above,
its `explanation` column reads: *"The graph never crosses or touches the
x-axis, so p(x) has zero real zeroes."* This is now **stale** — it reflects
the pre-correction (wrong) answer, not the corrected `correct = 2` ("2
zeroes") applied in the previous workstream. It directly contradicts both the
corrected grading key and the live SVG (which shows the curve crossing the
x-axis twice). This is a real, live content inconsistency a student would see
if they requested an explanation after answering — but it is **out of scope
for 1594/1230** and has **not been touched**: per the standing rule, any
correction needs its own explicit, guarded, single-purpose write, proposed
and approved separately (mirroring how the `visual_assets.id=105` figure-label
discrepancy was already flagged rather than folded into another commit). No
live database write has been made for this.

## 5. Promotion recommendation (not applied — awaiting your decision)

Both questions pass every check available under this content-QA standard: a
verified source diagram, an independently-derived and cross-checked correct
answer with no defect, and no duplicate/structural/answer-key-integrity issue
under either the current or superseded audit tooling. On that evidence:

- **`answer_status`**: promoting `source_provided → verified` for both would
  accurately reflect that this workstream is the first independent
  verification either question has received (matching the standard already
  applied when other questions moved to `verified`).
- **`status`**: promoting `transcribed →` a `GRADABLE_STATUSES` value
  (`verified`/`qa_passed`/`published`) is a separate decision — it is what
  actually makes a question servable to students, and unlike `answer_status`
  it does not follow automatically from "the answer is correct." Both
  questions still lack a populated `explanation` field, which ~88% of
  currently-gradable questions do have — not a hard blocker under current
  norms, but worth weighing before making either question live-servable.

**As instructed, this is a recommendation only.** No write has been made or
will be made without your separate, explicit approval — exactly the same
propose → approve → guarded-apply → verify sequence used for the 4575
correction.

## 6. Visual association — confirmed untouched

No SVG, no `visual_assets` row, no `diagram_status` change for either
question. Both remain `diagram_status = 'needs_visual_review'`, exactly as
before this review. Visual work for either — should promotion be approved —
remains its own later, separate, explicit step, not started here.

## What was deliberately NOT done

- No write to `questions.status`, `answer_status`, or `diagram_status` for
  1594 or 1230.
- No `visual_assets` row or SVG created for either.
- No correction applied to 4575's stale `explanation` text (flagged above,
  left for its own separate correction record).
- No action taken on the stale `audit-publication-readiness-output.json`
  file found on disk.
- Chemistry (819 and backups) remains untouched, per your instruction to
  address it separately.
