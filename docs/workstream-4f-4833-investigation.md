# Investigation — Question 4833 (Batch 15, Task 6)

> **AMENDED — 2026-09-26, during Task 10.** This document's headline
> conclusion below ("All five parts match the printed source key exactly.
> The database is correct in full for this question.") **does not hold** for
> parts (i), (iii), and (v). While building Task 10's visual for this
> question, a materially more rigorous re-measurement of Fig. 6.19's plotted
> points (programmatic gridline detection + dot-centroid isolation, plus
> cross-checks against the question's own other stored answers, not just a
> second look at the same image) found the diagram itself draws point A at
> (3,4), not the (4,3) that both the printed key and the database agree on;
> that part (iii)'s keyed answer is mathematically incompatible with part
> (ii)'s own keyed answer regardless of any pixel reading; and that part
> (v)'s keyed perimeter does not match the figure under either reading of A.
> Full detail, method, and the specific numbers are in
> `docs/workstream-4j-4833-answer-key-defects.md`, which supersedes the
> "Answer key" and "Summary answers" sections below on this point. Nothing
> below was altered in place — this notice is prepended instead, per this
> batch's practice of disclosing a retraction as visibly as the finding it
> corrects, exactly as this document's own "Retraction of the prior batch's
> flagged concerns" section (below) already did to *its* predecessor.
> **No database write follows from this** — 4833 was already correctly held
> out of gradable status and remains so.

**Status: fully read-only. No database write.** This investigation locates
and reads the actual printed answer key for this chapter for the first
time — it was not consulted in the prior batch's Task 5 candidate report
(`docs/workstream-3j-next-five-visual-candidates.md`), which instead relied
on an independent pixel-level reconstruction of the figure. That
reconstruction is now shown to have been in error. This record corrects it.

## The question

`cbse-mathematics-co-ordinate-geometry-845687ea` (id 4833), CBSE Mathematics,
Co-ordinate Geometry, a 5-part case-study question (`kind='case'`),
`source_document_id=155` (`chap_5-6.pdf`, pp.6.17–6.26, items 1–83),
`source_page='6.23-6.24'`, `source_question_number='73'`.

Stem: "Fig. 6.19: Four persons John, Saurabh, Salim and Ratan are sitting in
a courtyard at points A, B, C and D respectively. The courtyard has been
divided into small squares by equally spaced horizontal and vertical lines.
Taking OX and OY as the coordinate axes."

## All 5 sub-parts and their stored answers (unchanged, confirmed live)

| part | text | options | stored `correct` (index) |
|---|---|---|---|
| (i) | coordinates of A | `(4,3)` / `(3,4)` / `(3,3)` / `(4,4)` | 0 → `(4,3)` |
| (ii) | ABCD joined is NOT a ___ | rhombus / square / parallelogram / trapezium | 2 → parallelogram |
| (iii) | distance between mid-points of AC and BD | 2 / 3 / 0 / 1 | 2 → `0` |
| (iv) | area of △ABC | 18 / 9 / 12 / 16 sq. units | 1 → `9 sq. units` |
| (v) | perimeter of ABCD | 4√13 / 3√13 / 2√13 / 13 | 0 → `4√13` |

## The answer key — located this session, page 6.26 (file page index 21)

`chap_5-6.pdf` runs to 22 pages, not the ~14–20 typically seen elsewhere in
this bank — long enough to include a genuine combined MCQ answer-key section
at the very end (items 1–83 for both bundled chapters), which was **not**
checked in the prior batch. Rendered and read directly this session, row for
item 73: **"73. (i) (a)  (ii) (c)  (iii) (c)  (iv) (b)  (v) (a)"**.

Mapped to the stored options:

| part | printed key | index | matches stored `correct`? |
|---|---|---|---|
| (i) | (a) | 0 | **YES** |
| (ii) | (c) | 2 | **YES** |
| (iii) | (c) | 2 | **YES** |
| (iv) | (b) | 1 | **YES** |
| (v) | (a) | 0 | **YES** |

**All five parts match the printed source key exactly. The database is
correct in full for this question.**

## Retraction of the prior batch's flagged concerns

`docs/workstream-3j-next-five-visual-candidates.md` (candidate 3) reported,
based on an independent pixel-level reconstruction of Fig. 6.19's grid from
a rendered image (measuring gridline spacing and dot positions
programmatically), that point A appeared to be at (3,4) rather than the
stored (4,3), and that part (iii)'s stored answer ("0") did not reconcile
with a Euclidean-distance computation using that reconstruction. Both
concerns are now retracted: the reconstruction itself was wrong — almost
certainly an off-by-one error in mapping the detected gridline pixel
positions to logical grid coordinates (the column/row origin was likely
taken one gridline too far from the axis). The printed key is the authoritative
evidence and was simply not located in the prior pass; it settles the
question completely and matches the database as-is. **No answer-index
correction is needed or proposed for 4833.**

This is disclosed prominently, not quietly dropped, because the prior report
was itself committed to the repo (`412fe3b`) and stated the concern as a
finding — it is only fair to state just as clearly that the finding does not
survive further scrutiny.

## The genuine issue: `diagram_status` / `visual_assets` state

This part of the prior finding **does** hold up, and is more clearly
characterized now:

- `questions.diagram_status = 'needs_visual_review'` (live, confirmed).
- `visual_assets` id 130 exists for this question: `asset_type =
  'source_page_full'`, `asset_path = 'source_library/CBSE/Mathematics/ch5-6.pdf'`
  — **the raw, whole, 22-page PDF file**, not a rendered single-page image.
- Every other `source_page_full` row in the table (checked this session,
  e.g. ids 1–5, question 2851–2854) points to a specific rendered page
  image (`.../Triangles/page_7.16.jpg`, etc.), never a bare multi-page PDF.
  Row 130 is the outlier.
- `content-qa-audit.js` already classifies this row as
  **`not_an_image_reference`** (re-confirmed live this session) — the audit
  tool does not even count it as a genuine visual, for exactly this reason:
  a path ending in `.pdf` with no page/crop information isn't something the
  frontend can render as an image at all.
- Separately, `getServableDiagramUrls` (`server.js`) only ever selects
  `asset_type IN ('source_cropped', 'ai_generated')` — a `source_page_full`
  row is **never** served as a student-facing `diagramUrl` regardless of its
  path, by design (it's a provenance/reference row, not a servable one). So
  this row was never going to reach a student either way; the malformed path
  is a data-quality defect in the reference itself, not a live-serving risk.

**Is the visual asset association "wrong"?** Yes, in the sense that the row
does not do what a `source_page_full` row is supposed to do (point to a
specific rendered page). It is not "wrong" in the sense of pointing to the
wrong question's figure, or of being live-servable-but-incorrect — it was
never servable to begin with.

## Correction plan (proposed, NOT applied — Task 6 is read-only)

1. Render page index 18 of `source_library/CBSE/Mathematics/ch5-6.pdf`
   (confirmed this session to be the correct page: it contains both Fig.
   6.18 and Fig. 6.19, this question's figure) to a single-page image file
   under `extracted-diagrams/`, following the same naming and crop
   conventions already used for every other `source_page_full` row.
2. Guarded UPDATE of `visual_assets.id=130`'s `asset_path` (only) to point
   to that new image file, OR guarded DELETE of the malformed row plus a
   fresh guarded INSERT of a correctly-pathed replacement — either is
   viable; the simpler UPDATE is preferred, guarded on `id=130` and the
   exact current (malformed) `asset_path` value, to avoid any chance of
   touching a different row.
3. `questions.diagram_status` should then be updated from
   `needs_visual_review` to `source_diagram_preserved` (matching the
   convention for a corrected, genuinely-servable-as-reference
   `source_page_full` row — this alone does not make it `ai_generated`/
   `adapted_verified`; an actual clean redraw of the grid, per Task 10 in
   this batch, is the path to that tier).
4. Standard verification: backup, full-table diff (expect exactly the one
   `asset_path` change, or the one delete+insert pair, and the one
   `diagram_status` change), content-QA audit (expect `not_an_image_reference`
   to no longer include this row), 71/71 SQLite + PostgreSQL, hash
   before/after.

This plan is **not executed in this task** — Task 6 is explicitly read-only.
It is handed off as a candidate for its own future guarded correction
script, separate from Task 10's `ai_generated` visual build (which does not
depend on this fix — Task 10 builds a fresh SVG from the source figure
directly and doesn't read from `visual_assets` id 130 at all).

## Summary answers to the task's checklist

- **Source question, all sub-parts:** documented above, unchanged from live.
- **Answer key:** now located (page 6.26, item 73) and fully transcribed.
- **Stored `correct`:** matches the key on all 5 parts — verified correct,
  not a defect.
- **`diagram_status`:** `needs_visual_review`, live-confirmed.
- **`visual_assets`:** 1 row, `source_page_full`, malformed `asset_path`
  (points to the raw PDF, not a page image) — confirmed defective by
  comparison against every other row of the same `asset_type`.
- **`source_page`:** `6.23-6.24`; the actual figure was located on file page
  index 18, which prints as page 6.23 in the book, confirmed by direct
  render.
- **Is the apparent answer-index issue genuine?** **No** — retracted, see
  above. The database is correct.
- **Is the visual asset association wrong?** **Yes** — the `source_page_full`
  row's `asset_path` is malformed relative to every comparable row in the
  table, and is already flagged by the existing audit tooling as
  `not_an_image_reference`. A correction plan is proposed above, not applied.
