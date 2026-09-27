# Task 14 — Bank-Wide `visual_assets` / `diagram_status` Reconciliation Audit

**Status: fully read-only.** No database write. This is a full bank-wide
reconciliation of `questions.diagram_status` against the actual
`visual_assets` rows and files on disk, re-running and then digging behind
`content-qa-audit.js`'s Section C, cross-checked directly against the live
database and source text this session.

## Headline structural findings (clean)

- **169 `visual_assets` rows total, covering 150 distinct questions.** No
  orphaned rows (every `question_id` resolves to a real question). No
  question has more than one `ai_generated` or more than one
  `source_cropped` row (`getServableDiagramUrls`'s first-wins tie-break has
  no live case to actually break). No row whose path claims to be an image
  file (`.jpg/.png/.svg/.webp`) is missing from disk bank-wide — every
  claimed image genuinely exists where it says it does.
- `diagram_status` distribution: `needs_visual_review` 2,679,
  `not_applicable` 2,119, `source_diagram_preserved` 144, `adapted_verified`
  4 (1230, 1594, 3070 — all `status='verified'` and genuinely servable,
  confirmed live and correct; plus 4575, whose visual is fully resolved and
  live but whose *content* `status` is still `transcribed`, correctly not
  yet gradable — the two gates are independent and both are behaving
  correctly here).
- Of the 4 `asset_type` values only 3 are in use (`ai_generated` 4,
  `source_cropped` 4, `source_page_full` 161) — matching exactly the 4
  fully-completed pipeline questions (1230, 1594, 3070, 4575) plus 161
  provenance-only whole-page references.

## The headline number ("2,827 rows need a visual") is a large overcount — and here is the evidence, not just an assertion

`content-qa-audit.js` counts a question as "needing a visual" whenever
`diagram_status IN ('source_diagram_preserved','needs_visual_review',
'adapted_verified')` — i.e., everything except the explicit
`not_applicable`. That is a reasonable, conservative default for a static
SQL check, but it means the 2,679-row `needs_visual_review` bucket is
exactly what it sounds like: the state assigned at ingestion, not a
deliberate "this one has a figure" determination. This was checked
directly against question text this session, not assumed:

- Of all 2,679 `needs_visual_review` questions, only **187 (7%)** contain
  even a loose figure-referencing keyword in their text (`figure`,
  `diagram`, `as shown`, `chart`, `histogram`, `ogive`, `picture`, a bare
  `graph` not followed by `-ically`, etc.) — and that is a generous upper
  bound, not a confirmed count, because of the next point.
- Even within a keyword match, many are false positives. Spot-checked
  directly: 7 of the 74 currently-*gradable* `needs_visual_review`
  questions with zero `visual_assets` row at all matched a figure keyword —
  and every one of those 7 (ids 19–24, 62) turned out to be a purely
  conceptual/definitional question ("The graphical representation of
  cumulative frequency distribution is called:", "Graphically, the pair of
  equations ... represents two lines which are:") that is fully
  self-contained in its text and options — **no image is needed to answer
  any of them.** The remaining 67 of those 74 contain no figure-referencing
  language at all (they are things like "The class interval of a given
  observation is 10 to 15, then the class mark ... will be:" — plain
  arithmetic, no diagram conceivably needed).
- **Net result: of the 74 currently-gradable questions this audit's own
  numbers describe as "needing a visual with none on file," a session-time
  spot-check found zero that actually need one.** This is not proof that
  *all* 2,679 are false positives — it is a targeted check of the
  highest-priority (gradable) subset, and it came back clean. It strongly
  suggests the true bank-wide count of genuinely-missing visuals is a small
  fraction of 2,679, likely well under 187, but establishing the exact
  number for the full 2,679 would need the same one-by-one text review,
  which is out of scope for a single read-only audit pass.
- As a sanity check in the other direction: 25 of the 2,119
  `not_applicable` questions also match a loose figure keyword, and all 10
  spot-checked were also false-positive matches ("significant figures", a
  question that embeds its own data as a literal text table rather than an
  image, "an important figure of the Social Reform Movement"). This is
  reassuring evidence that `not_applicable` was a genuinely deliberate,
  reviewed classification (not just "whatever's left over"), unlike
  `needs_visual_review`'s ingestion-default character.

**Practical implication for Task 15:** treating "2,679 (or even 2,827)
missing visuals" as the size of the remaining visual-production backlog
would be a significant overstatement. The real backlog is this: (a) a
genuinely small number of questions with an actual missing figure — this
session's evidence points to well under 200 bank-wide, concentrated nowhere
in particular yet identified beyond the CBSE Circles cluster below — and
(b) a much larger, separate, one-time *triage* task (re-classify the
un-reviewed bulk of `needs_visual_review` down to `not_applicable` where no
figure is actually needed) that has nothing to do with building visuals at
all. Conflating the two would send future work chasing thousands of
non-existent diagrams.

## The two "row exists but isn't servable" classes — confirmed harmless to students today

- **`not_an_image_reference` (78 rows total, 24 gradable)**: every row
  inspected this session (ids 3071 and six ICSE History and Civics rows
  spot-checked directly) has exactly the same shape as 4833's already-
  documented defect (`docs/workstream-4j-4833-answer-key-defects.md`): a
  lone `source_page_full` row whose `asset_path` points at an entire raw,
  un-rendered, multi-page source PDF rather than a rendered page image.
  `getServableDiagramUrls` never serves `source_page_full` under any
  circumstances, so **none of these 78 rows (gradable or not) reach a
  student today** — they are inert provenance placeholders, not live
  broken images. They are still a genuine data-quality defect worth fixing
  (each should eventually get a real rendered/cropped image alongside the
  raw-PDF provenance row, the same fix already proposed for 4833 in
  workstream-4f), just not an active risk.
- **`only_whole_page_photo_not_genuinely_servable` (68 rows, 0 gradable)**:
  these already have a real rendered whole-page JPG (not a raw PDF) on
  file, correctly not yet cropped to a single question's figure. Zero of
  these are currently gradable, so there's no live exposure. Concentrated
  heavily in one place: **CBSE Mathematics / Circles (42 of 68)**, with the
  rest spread across CBSE Statistics, Surface Areas and Volumes, Triangles,
  Trigonometry, and Areas Related to Circles. This is a good, concrete,
  low-risk-of-wasted-effort candidate pool for a future visual-building
  task — unlike the `needs_visual_review` bulk above, these rows are
  already confirmed (by the presence of the whole-page JPG itself) to have
  a real figure worth cropping/redrawing.

## What is NOT claimed here

- This is not a claim that 74, or 101, or any other specific number of
  gradable questions are "fine as-is forever" — only that the *specific*
  ones checked this session don't need a diagram. The 67-of-74 without any
  keyword match were not read individually beyond the keyword filter (only
  the 4 shown inline plus a handful more were read in full); it remains
  possible, though it would be surprising given the pattern, that one of
  them turns out to need a figure the keyword search missed (e.g., a bare
  "Consider the following:" with an implied but untranscribed table).
- This does not re-litigate or duplicate Task 6/10's already-documented
  `source_page_full`-pointing-at-raw-PDF defect for id 4833 specifically —
  it confirms the same defect shape recurs 77 more times elsewhere in the
  bank, which is new information Task 6 did not have.
- No `visual_assets` row was modified, inserted, or deleted by this
  document. No `diagram_status` value was changed.

## Summary for Task 15

- **Structural integrity:** clean — no orphans, no duplicates, no missing
  files among claimed images. No action needed.
- **`needs_visual_review` triage backlog** (not a visual-production task):
  a one-time reclassification pass is warranted, almost certainly
  shrinking the apparent 2,679/2,827 "missing visual" count by an order of
  magnitude once done. **CONTENT QA FIRST**, and cheap relative to its
  payoff — most of it is "read the question, if no figure is described,
  flip `diagram_status` to `not_applicable`," not visual production.
- **`not_an_image_reference` (78 rows, 24 gradable):** confirmed harmless
  to students today (never served), but a real defect worth batch-fixing
  the same way workstream-4f proposed for 4833 — render the actual page
  and repoint each row, rather than leaving raw-PDF provenance rows in
  place indefinitely. **CONTENT QA FIRST / low urgency**, not blocking any
  student-facing behavior.
- **CBSE Mathematics / Circles (42 rows) — best next visual-production
  candidate pool:** already has a real rendered whole-page photo per row
  (not raw PDF), none currently gradable, so there's room to build these
  out without any live-serving risk. **VISUAL QA FIRST** candidate cluster
  for whichever future task takes on new visual builds.
