# Workstream 3B — First Visual-Extraction Test Case (Question id 3070)

**Date:** 2026-09-25
**Status:** read-only investigation + one candidate derived asset produced,
**not wired to any live question**. No `visual_assets` row was inserted or
changed, no `diagram_status` was changed, no source file was modified. Live
database SHA-256 unchanged throughout this workstream:
`ac204d4919aee876d9f0e706dbad628a1d8ba8d5737f5717d0698a699890cba3`.

## Why 3070

Per your guidance, don't build generic extraction tooling against synthetic
fixtures — prove the full pipeline on one real, already-confirmed case
first. Question id 3070 (`icse-mathematics-linear-inequation-ace0c077`,
ICSE Maths, Linear Inequation, item 57) was already established in
Workstream 3A as having a genuine, question-specific number-line diagram in
the source (not an ambiguous whole-page image shared across questions), and
its `visual_assets` row currently only references the raw, whole,
13-page source PDF (`ch04-linear-inequation.pdf`, `asset_type =
'source_page_full'`) — exactly the "not_an_image_reference" defect category
from `docs/content-qa-readiness-report.md` Section 5.

Also worth naming: **this database has zero existing `source_cropped`
assets.** Every one of the 161 `visual_assets` rows, across the whole bank,
is `asset_type = 'source_page_full'`. There is no precedent to follow or
regression to preserve — this is genuinely the first real per-question crop
this project would ever produce.

## The pipeline, walked through for this one question

**1. Source PDF** — `source_library/ICSE/Mathematics/ch04-linear-inequation.pdf`
(untouched; opened only for rendering, confirmed via `git status` showing no
diff against the tracked copy, and the file's SHA-256 recorded:
`1ad7050b4bb3a1e0809f2f8d1292aaf77754b9fb88aac6f09e0be2cf4ee3f5fb`).

**2. Exact page** — PDF page index 6 (0-based), printed page 4.8, confirmed
by both the page footer and by matching the item text/options exactly
against `questions.text`/`options_json` for id 3070.

**3. Exact question** — item (57), "Identify the correct solution set of the
following number line" — verified against the DB row's stored text and
options (already done in Workstream 3A), and against the printed answer key
(item 57, `correct=1` → "{x∈Z, -4<x≤5}", matching the diagram's hollow
circle at -4 / filled circle at 5 description).

**4. Extract the complete original figure** — rendered the page at high
resolution (6x zoom, ~600 DPI equivalent) and cropped tightly to just the
number-line diagram itself (the axis, arrowheads, tick marks, and point
markers from -4 to 6) — excluding the question's text stem and the A–D
options, since those already exist as accurate, separate text in the
database and don't need to be part of the image. The crop was iteratively
verified against the full page (three refinement passes) to confirm no
adjacent item's content (item 56 above, the options row below) bled into
the frame. Zoomed further into the -4 and 5 markers specifically to confirm
the diagram's own internal consistency: -4 renders as a bare tick (this
scan's convention for an open/excluded bound) and 5 renders as a solid
filled dot (a closed/included bound) — consistent with the question text's
own description and with `correct=1`.

**5. Preserve original asset** — the source PDF itself was never modified;
only a new, separate derived file was created.

**6. Result** — `extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-CANDIDATE.png`
(2220×210px, RGB, 205KB). The `-CANDIDATE` suffix is deliberate — same
convention `extracted-diagrams/README.md` already established with
`demo-fig-9-21.png` — signaling this is not yet wired to anything.

## What was deliberately NOT done

- **No `visual_assets` row was inserted or updated.** id 3070's existing row
  (id 23, `asset_type='source_page_full'`, still pointing at the whole PDF)
  is untouched.
- **No `diagram_status` was changed** on question 3070 — it remains
  `source_diagram_preserved`, exactly as before.
- **No code change** to `server.js`'s existing `extracted-diagrams/` static
  route (it already serves this directory; confirmed by reading it, not by
  testing a new deployment).
- **No association was made** between this candidate file and question_uid
  `icse-mathematics-linear-inequation-ace0c077` in any table.

This mirrors exactly how `demo-fig-9-21.png` was handled previously —
proving a real crop can be produced from real content, without that crop
becoming live data until a separate, explicit decision is made.

## Proposed provenance record (for review — not yet written anywhere)

If and when you approve wiring this in, the proposed `visual_assets` row
would be:

| Field | Proposed value |
|---|---|
| `question_id` | 3070 |
| `source_file_id` | 99 (unchanged — same source document) |
| `asset_type` | `source_cropped` (the actual value this asset type exists for, and has never been used yet) |
| `figure_label` | `Number line, item 57 (p.4.8)` (same label the existing whole-page row already carries) |
| `asset_path` | `extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline.png` (drop the `-CANDIDATE` suffix on promotion) |
| `notes` | e.g. "Cropped from source_library/ICSE/Mathematics/ch04-linear-inequation.pdf p.4.8 (PDF page index 6), 2026-09-25. Verified against printed answer key item 57 and against stored options_json." |

This would most naturally **replace** (not add alongside) the existing
`source_page_full` row for this question, since that row currently
represents the "not_an_image_reference" defect this crop fixes — but
whether to replace vs. keep both as a history trail is a product decision,
not a technical one, so no row has been touched either way.

## Verification performed

- Source PDF confirmed byte-identical before and after (via `git status`,
  since `source_library/` is git-tracked — zero diff).
- Live database hash confirmed unchanged before and after
  (`ac204d49...`, matching the post-Workstream-3A-corrections baseline).
- The crop was visually re-inspected at each refinement step against the
  full, unmodified source page to rule out cropping in adjacent questions'
  content.
- File saved only under `extracted-diagrams/`, the directory already
  designed and documented for exactly this purpose; nothing was written
  under `source_library/`.

## Recommended next step

Two decisions needed before any tooling is generalized beyond this one
question: (1) does this crop's quality/framing meet the bar for a real,
gradable question's diagram (readable at typical mobile widths — worth a
quick visual check on your end, or I can render it at a couple of target
widths to check), and (2) the `visual_assets` replace-vs-append question
above. Once both are settled on this one case, the same extraction method
(render page → identify figure region → crop → save as `-CANDIDATE` →
propose provenance → review → promote) can be turned into repeatable
tooling for the other 79 `not_an_image_reference` rows and, eventually, a
triage pass over the much larger 2,679 `missing_no_asset_row` backlog —
but not before this first case is explicitly signed off, per your
instruction.
