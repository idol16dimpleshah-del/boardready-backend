# Correction Record — Publication Promotion for 1727 (Batch 15A, Task 8)

**Scope: `status`/`answer_status` only, `verified`/`verified`.**
`diagram_status` is untouched here — visual association is a separate write
(Task 9 of this batch).

## Content already independently verified (Batch 15 Task 12, no new re-derivation needed)

`docs/workstream-4m-1727-visual-provenance-and-qa.md` already performed and
documented an independent, from-scratch re-derivation of this question's
answer, not merely a key cross-check: curved surface area = circumference ×
height in either construction (rotate an 11×7 cm rectangle about either
side), giving CSA = 7×11 = 77 in both orientations — always a 1:1 ratio,
regardless of which side is the axis. This matches stored `correct = 0`
(→ "1 : 1") exactly. No answer-index concern was found for this question at
that time, and nothing about the row has changed since (re-confirmed live
just now: `correct`/`options_json` identical to what Task 12 recorded).

This meets the same evidentiary bar used for every other promotion in this
batch (independent computation, not a printed-key restatement) — it was
simply not yet acted on with a `status` promotion, which this task supplies.

## Write plan

`scripts/apply-1727-promotion.js`, modeled on `apply-1594-status-promotion.js`
/ `apply-2061-promotion.js`: guarded transaction verifying `question_uid`,
exact prior `status='transcribed'`/`answer_status='source_provided'`/
`correct=0`/`options_json`, guarded UPDATE checked for `changes===1`,
re-verify every other column (including `diagram_status`, left untouched)
byte-identical.
