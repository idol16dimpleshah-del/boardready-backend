# Correction Record — Publication Promotion for 4575 (Batch 15A follow-up)

**Scope: `status` only, `transcribed` → `verified`.** Flagged in
`docs/workstream-5h-adapted-verified-gradability-audit.md` (Batch 15A Task
11): 4575's answer key was already corrected and independently verified
(`docs/workstream-3e-4575-correct-answer-correction-record.md`, prior
batch), and its visual is already fully built, browser-QA'd, and associated
live (`diagram_status='adapted_verified'`,
`docs/workstream-3d-4575-graph-visual-provenance-and-qa.md`). The one
remaining gate is `status`, still `transcribed` — `GRADABLE_STATUSES`
(`content-rules.js`) excludes `transcribed`, so despite a fully correct and
fully live visual, this question has not been reachable by any generated
test until this write. No new content or visual work is needed or
performed here; this is the same mechanical promotion already applied to
1594/1230/4569/4651/4662/4665/2061/1727 across Batch 15 and 15A.

Live row re-confirmed immediately before writing:
`answer_status='verified'`, `diagram_status='adapted_verified'`,
`correct=2` (→ "2"), `options_json=["3","1","2","0"]` — unchanged since the
prior batch's own verification, nothing has drifted.

## Write plan

`scripts/apply-4575-status-promotion.js`, modeled on
`apply-1594-status-promotion.js`: guarded transaction verifying
`question_uid`, exact prior `status='transcribed'`/`answer_status='verified'`/
`diagram_status='adapted_verified'`/`correct=2`/`options_json`, guarded
UPDATE checked for `changes===1`, re-verify every other column byte-identical.
