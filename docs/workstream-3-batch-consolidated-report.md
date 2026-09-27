# Consolidated Report — 5-Task Batch (Workstreams 3F–3J)

Live database SHA-256 confirmed unchanged except where Task 1 explicitly
wrote to it (before Task 1: `4b384b86abc24651f13dfbb8d5a171e8a11032f1cebe2e9cb6d155df3ebee612`;
after Task 1 and for the remainder of the batch:
`99aa70be67603cd97ad130dfabd923b81f9f69a2d2165fb777d299324c8e25e2`, verified
repeatedly through Tasks 2–5). All five commits are on `master`: `6c6d8d6`
(Task 1), `fb80339` (Task 2), `764d7d1` (Task 3), `48d0b99` (Task 4), `412fe3b`
(Task 5). `audit-publication-readiness-output.json` was never run or touched.

## Task 1 — Fix 4575 stale explanation: **COMPLETED**

The stale explanation (which still claimed the graph had zero real zeroes,
contradicting the already-corrected answer `c=2`) was corrected through the
full guarded-write discipline: correction record first
(`docs/workstream-3f-4575-explanation-correction-record.md`), then
`scripts/apply-4575-explanation-fix.js` (guarded on the exact prior text and
on `correct=2`/`status`/`answer_status`/`diagram_status`, touching only
`explanation`). Verified after the write: byte-identical backup, full-table
diff confirming isolation, content-QA audit, 71/71 SQLite + PostgreSQL
regression, live grading re-check, and the new live hash recorded in the
correction record. Committed as `6c6d8d6`.

## Task 2 — Publication-gate 1594/1230: **PROPOSED, needs your approval**

All seven named checks (answer derivation, option mapping, duplicate flags,
duplicate option text, source provenance, visual requirement, explanation
requirement) were completed and documented in
`docs/workstream-3g-1594-1230-promotion-proposal.md`. Both questions'
answers were independently re-verified from the source pages. A genuine,
disclosed discrepancy between the two audit tools in this codebase
(`scripts/content-qa-audit.js` vs. `audit-publication-readiness.js`) was
surfaced rather than resolved unilaterally. Two fully-specified guarded
scripts exist but were **not run**: `scripts/apply-1594-promotion.js` and
`scripts/apply-1230-promotion.js`, each proposing
`status: transcribed→verified`, `answer_status: source_provided→verified`,
and an honest `answer_key_ref` (not a fabricated source citation). Explicit
sign-off needed before either script is executed. Committed (proposal +
unexecuted scripts) as `fb80339`.

## Task 3 — Audit the verified answer-index convention: **COMPLETED (read-only); broader audit recommended**

A full-chapter cross-check (render printed answer key → transcribe → compare
against `questions.correct`) was run across 5 CBSE Mathematics source
documents (150–154, 293 rows total), documented in
`docs/workstream-3h-verified-answer-index-audit.md`. Found and
independently hand-verified **6 new confirmed answer-index defects** beyond
the already-known 4575 (ids 4569, 4580 part iv, 4651, 4662, 4665, 4648), plus
1 case where the *source textbook's own* printed key is wrong and the
database is actually correct (id 4742) — demonstrating the method
discriminates rather than blindly trusting either side. 8 further rows are
flagged for follow-up verification. Recommendation: yes, a broader audit is
warranted (~4.8% flag rate in the sampled chapters). **No DB writes were
made**; none of the 6 confirmed defects have been corrected — that requires
its own separate approval and guarded scripts, one per question, same as
4575's. Committed as `764d7d1`.

## Task 4 — Geometry visuals for 1594/1230: **COMPLETED (build + proof); live association still pending**

Two new `ai_generated` SVGs were built from careful re-inspection of the
exact source pages (catching and correcting a real diagram-misidentification
partway through), documented with full must-preserve/may-simplify reasoning
in `docs/workstream-3i-1594-1230-visual-reconstruction.md`. 1594's circle
uses the half-angle identity to make its redrawn 35° angle exact rather than
approximate, matching the source's given angle without changing any fact. A
combined Playwright proof harness
(`scripts/verify-1594-1230-visual-rendering.js`) ran all 16 checks (8 per
question: {dark,light}×{desktop,mobile}×{question,lightbox}) and all passed;
16 screenshots were generated and 5 were spot-checked visually. **No
`visual_assets` row was created and no `diagram_status` changed for either
question** — both remain proposed-only, exactly mirroring the
build-then-prove-then-associate-later pattern already used for 4575. The
next step, if wanted, is its own separate guarded `apply-*-visual-
association.js` script per question, run only on explicit approval.
Committed as `48d0b99`.

## Task 5 — Next 5 visual candidates: **COMPLETED (read-only identification)**

Documented in `docs/workstream-3j-next-five-visual-candidates.md`. Five
candidates were identified, one per required visual class, each traced to
its actual rendered source page (not trusted from `diagram_status` alone):

| # | Class | Question | Answer verified? | Safe for production? |
|---|-------|----------|-------------------|----------------------|
| 1 | Geometry | id 1508, Similarity of Triangles (BPT) | Yes (4.4 cm, re-derived) | Yes — no blocker |
| 2 | Construction | id 1231, Locus and Construction (angle bisector) | Yes (both A & R true, re-derived) | Yes — no blocker |
| 3 | Graph/coordinate | id 4833, CBSE Co-ordinate Geometry case study | **No — `needs_review`** | **No** — 3 blockers (see below) |
| 4 | Chemistry apparatus | id 2061, Electrolysis of molten PbBr₂ | Yes (cross-checked vs. printed key) | Answer safe; `correct` field format is a blocker |
| 5 | Mensuration/3-D solid | id 1727, two cylinders from one rectangle | Yes (1:1, re-derived) | Yes — no blocker |

Two new defects were found and flagged (not corrected, no DB write) while
tracing candidate 3 and candidate 4:
- **id 4833**: `diagram_status='needs_visual_review'` even though a
  `visual_assets` row (id 130, `source_page_full`) already exists for it —
  a metadata inconsistency, not a missing asset. Independently
  reconstructing its grid figure (pixel-level gridline analysis) confirms
  points A=(3,4), B=(6,7), C=(9,4), D=(7,2), which matches parts (ii) and
  (iv)'s stored answers but appears to contradict part (i)'s stored index
  (DB says "(4,3)"; reconstruction says "(3,4)"), and leaves part (iii)
  unresolved against the given integer options.
- **id 2061**: `questions.correct` is stored as the literal string `"(a)"`
  rather than a 0-based integer index, inconsistent with the project's
  documented indexing convention — a gradability defect independent of the
  (verified-correct) answer content, possibly affecting other rows from the
  same `source_document_id=60` ("competency.pdf").

No DB write, no `source_library/` change, no `visual_assets`/`diagram_status`
change for any of the five. Committed as `412fe3b`.

## Consolidated status

**Completed, no further action needed:** Task 1 (4575 explanation fix,
live); Task 3 (audit report, findings documented); Task 4 (visuals built
and proven, not yet live); Task 5 (candidates identified, findings
documented).

**Proposed — needs your explicit approval before any live write:**
- Task 2: promote 1594 and 1230 (`status`/`answer_status`/`answer_key_ref`) — scripts ready, unexecuted.
- Task 4 follow-on: associate the two built SVGs live (`visual_assets` insert + `diagram_status` update) for 1594 and 1230 — not yet scripted, by design (separate step).
- Task 5 follow-on: build and browser-test SVGs for candidates 1, 2, and 5 (ids 1508, 1231, 1727), which carry no blocking issue — not yet started, by design.

**Blocked — needs a decision or more evidence before it can even be proposed:**
- Task 3's 6 confirmed answer-index defects (ids 4569, 4580, 4651, 4662, 4665, 4648) — each needs its own correction record and guarded script, same pattern as 4575, but none drafted yet; also the 8 further flagged rows and the remaining CBSE Mathematics chapters (145–149, 155–159) not yet sampled.
- Task 5 candidate 3 (id 4833) — cannot be promoted or usefully re-associated until: (a) its answer_status is independently verified, (b) part (i)'s index discrepancy is resolved against the actual official answer key (not available in `source_library` for this case-study set), and (c) part (iii) is resolved the same way.
- Task 5 candidate 4 (id 2061) — the non-numeric `correct` field needs a structural fix (and a check of whether the same defect recurs across the rest of `source_document_id=60`) before this question can be safely graded, independent of its visual work.

**Explicitly not touched, unchanged from before this batch:** the stale
`visual_assets.id=105` figure-label discrepancy on 4575; Chemistry as a
whole beyond the single Electrolysis candidate identified in Task 5.
