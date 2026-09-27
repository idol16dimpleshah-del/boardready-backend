# Correction Record — Question 1594 Publication Promotion (Batch 15, Task 1)

**Status: PROPOSED, about to be applied under guard.** Written before the
live write, per the standing correction-record-first rule.

## What this changes

| column | current (live) | proposed |
|---|---|---|
| `status` | `transcribed` | `verified` |
| `answer_status` | `source_provided` | `verified` |

Nothing else. `correct`, `options_json`, `text`, `explanation`,
`answer_key_ref`, `source_page`, `source_question_number`,
`source_document_id`, `diagram_status`, and every other column stay
byte-identical — guarded and verified by the script itself.

## Two deliberate departures from the batch prompt's literal wording, both disclosed here rather than silently resolved

1. **The batch prompt says `status: transcribed → gradable`. There is no
   `'gradable'` value.** The live schema's CHECK constraint on
   `questions.status` is
   `CHECK(status IN ('draft','transcribed','needs_review','verified','qa_passed','published'))`
   — confirmed by reading `sqlite_master` directly this session. Writing the
   literal string `'gradable'` would violate that constraint and the write
   would simply fail. `content-rules.js`'s `GRADABLE_STATUSES` (the
   documented "one true definition" of servable-to-students) is
   `['verified', 'qa_passed', 'published']` — i.e. "gradable" is the
   *concept* this batch of statuses satisfies, not a literal value. This
   record treats the instruction as "promote into the gradable set" and uses
   `status = 'verified'`, consistent with `content-rules.js`, with the
   already-reviewed (never-applied) `scripts/apply-1594-promotion.js` from
   the prior batch, and with the same promotion already applied live to 4575.

2. **This task also says "do not modify ... provenance", and
   `answer_key_ref` is a provenance field.** The prior batch's
   `docs/workstream-3g-1594-1230-promotion-proposal.md` disclosed a genuine,
   unresolved discrepancy between two audit tools: the current
   `content-qa-audit.js` does not require `answer_key_ref` at all, while the
   older `audit-publication-readiness.js` flags its absence
   (`missing_answer_key_ref`) as the *only* issue blocking either question.
   That prior proposal offered to populate `answer_key_ref` with an honest
   evidence-trail citation (not a fabricated source page — neither
   `chap_17.pdf` nor `chap_19.pdf` has a printed answer key at all). This
   task's explicit "do not modify ... provenance" instruction resolves that
   discrepancy for me: `answer_key_ref` stays `NULL`, deferring to the newer,
   current tool. This is recorded as a decision, not an oversight, in case a
   later workstream wants to revisit it.

## Why promotion is justified (unchanged from Workstream 3G, re-confirmed here)

All seven publication-gate checks from `docs/workstream-3g-1594-1230-promotion-proposal.md`
were re-read this session and nothing has changed live since (DB hash
unchanged throughout). Specifically for 1594: answer independently derived
two ways (both giving 20°/index 2, matching stored `correct`), option
mapping re-verified against a fresh render of `chap_17.pdf` p.17.4 item (22),
no duplicate flags, no duplicate option text internally, source provenance
present (`source_page`, `source_question_number`, `source_document_id`), and
an authored `explanation` is confirmed NOT required for gradability by
direct inspection of `server.js` and `content-rules.js` (no blocker to
document). Visual requirement is explicitly out of scope for this task (Task
3 handles it, gated on this task's success).

## Verification plan

1. Fresh timestamped backup of `boardready.db`, SHA-256 recorded.
2. Guarded script (`scripts/apply-1594-status-promotion.js`): verifies exact
   expected prior state (`status='transcribed'`, `answer_status='source_provided'`,
   `answer_key_ref IS NULL`, `correct=2`, `options_json` unchanged,
   `diagram_status='needs_visual_review'`) before writing; aborts otherwise.
   Writes only `status` and `answer_status`; re-verifies every other column
   byte-identical after.
3. Full-table diff of `questions` (and every other table) against the
   pre-write backup — expect exactly one row (id 1594) changed, exactly the
   two listed columns.
4. `scripts/content-qa-audit.js` re-run against the live DB.
5. 71/71 regression suite, SQLite engine.
6. 71/71 regression suite, PostgreSQL engine.
7. Live grading behavior check for question 1594 specifically (submit the
   stored `correct` index through the real scoring path, confirm it scores
   correct).
8. Live DB hash recorded before and after.

Results appended below once complete.

## RESULT — applied 2026-09-26

All eight verification steps passed:

1. Backup: `backups/boardready.db.bak-before-1594-promotion-20260926-061754`,
   confirmed byte-identical to the live DB before the write (SHA-256
   `99aa70be67603cd97ad130dfabd923b81f9f69a2d2165fb777d299324c8e25e2`).
2. `scripts/apply-1594-status-promotion.js` ran clean: guard checks passed,
   exactly 1 row changed, COMMIT successful.
3. Full-table diff (Python, every table, row-by-row dict comparison) found
   exactly **one changed row** across the entire database: `questions` id
   1594, `status: 'transcribed' -> 'verified'`,
   `answer_status: 'source_provided' -> 'verified'`. Nothing else changed,
   anywhere.
4. `scripts/content-qa-audit.js`: "Anomalous GRADABLE rows with a non-ready
   answer_status (critical if > 0): 0". 1594 now appears only in the visual-
   completeness section (`missing_no_asset_row`, expected — Task 3's scope),
   with no structural or duplicate-answer-text flags.
5. 71/71 SQLite regression, live-DB-guard confirmed unchanged after.
6. 71/71 PostgreSQL regression, live-DB-guard confirmed unchanged after.
7. Live grading check via `scoring.js` directly against the live row:
   submitting `optionIndex: 2` (the stored `correct`) grades
   `{answered: true, correct: true}`; submitting `optionIndex: 0` grades
   `{answered: true, correct: false}` — scoring reads the DB-stored answer
   key correctly post-promotion.
8. Live DB hash after: `af9c24ba298f89be042c88540a88b732726ea09b5cb8d4f662c884ceb0ce4786`.

**Task 1: COMPLETED / APPLIED.**
