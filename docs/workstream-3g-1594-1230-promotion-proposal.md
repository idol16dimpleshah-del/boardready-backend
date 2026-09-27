# Promotion Proposal — Questions 1594 and 1230 (Workstream 3G, Task 2 of batch)

**Status: final publication-gate checks complete, read-only. Two guarded
correction scripts are prepared and reviewed on paper, but NOT run.** No live
database write has been made for either question. This is the "final
publication-readiness checks" requested as Task 2 of the 5-workstream batch,
building on `docs/workstream-3e-1594-1230-publication-gate-review.md`.

**Live database SHA-256 before and throughout this check (unchanged — every
check below is read-only):**
`99aa70be67603cd97ad130dfabd923b81f9f69a2d2165fb777d299324c8e25e2`

## The seven checks

**1. Answer derivation** — confirmed, no change since Workstream 3E. 1594:
20° derived two independent ways (transversal via AD, transversal via BC),
both matching stored `correct=2`. 1230: perpendicular-bisector theorem
applied directly, matching stored `correct=2`. Full derivations in
`docs/workstream-3e-geometry-content-qa-1594-1230.md`.

**2. Option mapping** — freshly re-verified this session by rendering both
source pages directly (not reusing the earlier read):

- 1594, `chap_17.pdf` p.17.4 item (22): printed "(A) 125° (B) 35° (C) 20°
  (D) 55°" maps index-for-index onto `options_json =
  ["125°","35°","20°","55°"]`. `correct=2` = option (C) = "20°". Confirmed
  exact match, no transcription drift.
- 1230, `chap_19.pdf` p.19.6 item (33): printed "(A) A is true, R is false
  (B) A is false, R is true (C) Both A and R are true (D) Both A and R are
  false." maps index-for-index onto the stored `options_json`. `correct=2` =
  option (C) = "Both A and R are true." Confirmed exact match.

**3. Duplicate flags** — none, either direction, for either question
(re-confirmed against the real `duplicate_flags` schema in Workstream 3E's
publication-gate review).

**4. Duplicate option text** — none internally in either question's
`options_json` (all 4 options distinct in both).

**5. Source provenance** — both have `source_page`, `source_question_number`,
and `source_document_id` populated and correct; both `text` fields are well
above the minimum-length bar. The only provenance field absent for either is
`answer_key_ref` (see check 7 below — this is a genuine, deliberate absence,
not an oversight).

**6. Visual requirement** — both still `diagram_status = 'needs_visual_review'`
with no `visual_assets` row. Per your explicit instruction and the
established 4575 precedent (its visual went live while `status` remained
`transcribed`), this is **not** treated as blocking content promotion — it is
a separate axis, picked up in Task 4 below.

**7. Any other current publication-gate rule** — this surfaced a real
discrepancy between the two audit tools in this codebase, which is reported
here rather than silently resolved one way:

- **`content-qa-audit.js`** (the current, more rigorous tool; its own header
  says it supersedes the older tool "for the specific checks below") does
  **not** check for `answer_key_ref` at all, and flags neither question with
  any issue beyond the already-known visual-completeness classification.
- **`audit-publication-readiness.js`** (the older, founder-specified tool;
  its own header states its criteria explicitly, including "source
  provenance completeness" with `answer_key_ref` as one of four required
  fields) defines "safe to promote" as `issues.length === 0`. Re-running its
  exact per-row logic fresh against the live database (not the stale Sep-18
  output file, which was left untouched) for these two ids gives **exactly
  one issue each: `missing_answer_key_ref`** — every other check in that
  tool (text completeness, options completeness, correct-index range, source
  page/question-number/document-id presence, duplicate flags) passes clean
  for both.

So under the newer tool, both are already clean; under the older,
founder-specified tool, both are one field short of "safe to promote." I'm
not resolving this by picking a side — it's presented for your decision. My
own read: `answer_key_ref` is absent because, as established in Workstream
3E, **neither source chapter contains a printed answer key at all** — there
is no page to cite, unlike 4575 (which did have one, and where the absence of
a correct `answer_key_ref` would have been a real gap). Populating the field
with a fabricated page citation would violate "do not invent unsupported
source material." The two proposed scripts below instead populate
`answer_key_ref` with an honest description of *why* no source citation
exists and a pointer to the independent-derivation evidence trail — this is
not inventing a source, it's documenting the true state of the source. If you
would rather leave `answer_key_ref` null and accept the older tool's gate as
not applicable to items with no printed key, that's a one-line change to drop
from each script below.

## Explanation requirement — determined, not required

Checked directly in the serving code rather than assumed: `server.js` reads
`explanation` in three places (`checkedAnswers[...]`, the mid-quiz check
endpoint, and the post-submit results payload) and in every case falls back
to `explanation ?? null` — a null explanation is handled gracefully, not an
error condition. `content-rules.js`'s `GRADABLE_STATUSES` gate (the "one true
definition" of servable, per its own comment) checks only `status`, nothing
about `explanation`. **Conclusion: an authored explanation is not required
for gradability under any current rule in this codebase.** I have not
authored one for either question in the proposed scripts below, since doing
so isn't required and I'd rather not add prose beyond what's already
evidence-backed unless you want it — if you do, the derivations in
`docs/workstream-3e-geometry-content-qa-1594-1230.md` are fully sourced and
could be condensed into `explanation` text in the same house style already
used elsewhere in this table (e.g. ids 114–118), with no invention needed.

## Proposed changes (NOT applied) — exact field list

Both scripts are written, guarded, and ready, but **not run**:
`scripts/apply-1594-promotion.js`, `scripts/apply-1230-promotion.js`.

### 1594 (`icse-mathematics-angle-and-cyclic-properties-of-circle-1adba987`)

| column | current (live) | proposed |
|---|---|---|
| `status` | `transcribed` | `verified` |
| `answer_status` | `source_provided` | `verified` |
| `answer_key_ref` | `NULL` | `"No printed answer key exists in chap_17.pdf; independently verified by two cross-checking geometric derivations (transversal via AD, transversal via BC), both giving 20°/index2, matching the stored value. See docs/workstream-3e-geometry-content-qa-1594-1230.md."` |

Every other column (`correct`, `options_json`, `text`, `explanation`,
`diagram_status`, etc.) stays byte-identical — guarded and verified by the
script itself if run.

### 1230 (`icse-mathematics-locus-and-construction-c23699f9`)

| column | current (live) | proposed |
|---|---|---|
| `status` | `transcribed` | `verified` |
| `answer_status` | `source_provided` | `verified` |
| `answer_key_ref` | `NULL` | `"No printed answer key exists in chap_19.pdf; independently verified via the perpendicular bisector theorem (D = midpoint of BC, AD ⊥ BC ⇒ AD is the perpendicular bisector of BC; E on AD ⇒ BE = CE), matching the stored value (\"Both A and R are true\"). See docs/workstream-3e-geometry-content-qa-1594-1230.md."` |

Every other column stays byte-identical, same guarantee.

**Neither `diagram_status` nor any `visual_assets` row is touched by either
script** — visual work remains entirely separate, per your instruction, and
is addressed (still read-only, no live association) in Task 4.

## What happens next, only on your explicit approval

If and when approved (either as written, or with `answer_key_ref` dropped
from scope, or with an authored `explanation` added), the standard sequence
applies to each question independently, in its own commit: fresh timestamped
backup → verify hash → run the guarded script → full-table diff against
backup (expect exactly the listed fields changed, nothing else, in exactly
one row) → re-run `content-qa-audit.js` → 71/71 SQLite + PostgreSQL → live
hash recorded → correction record's RESULT section appended → commit. This
document is not itself that approval — it is the proposal awaiting it.

## What was deliberately NOT done

- No write to `questions.status`, `answer_status`, or `answer_key_ref` for
  either question — the two scripts above exist on disk but have not been
  executed.
- No `visual_assets` row, `diagram_status` change, or SVG for either question.
- No `explanation` authored for either (not required; see above).
- `audit-publication-readiness-output.json` was not run or rewritten; its
  older logic was re-derived by hand against live data instead, so the file
  itself stays exactly as found.
