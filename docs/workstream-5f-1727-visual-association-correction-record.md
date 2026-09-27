# Visual Association Correction Record — id 1727 (Batch 15A, Task 9)

**Scope: 2 `visual_assets` INSERTs + 1 `diagram_status` UPDATE only.** Kept
as its own write, separate from Task 8's content/status promotion.

## Pre-conditions checked before writing

- `answer_status='verified'` and `status='verified'` (Task 8's promotion
  already committed and independently confirmed).
- Zero pre-existing `visual_assets` rows for question 1727.
- Both asset files exist on disk, hashes computed fresh this session:
  - `extracted-diagrams/icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6-item21-tworectanglecylinders-CANDIDATE.png`
    → `6dfa675d3e8a8805ab8d03cced33e66bd9ec408f9c9c2e40abb6ab80e5ca5581`
    (matches the value recorded when this file was created in Batch 15 Task 12).
  - `extracted-diagrams/icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6-item21-tworectanglecylinders-GENERATED.svg`
    → `56adf5e3f5627bd82e20015eea40c44f27662b73ba09c3dd342ce9d96939e59c`
- `source_file_id = 14` (`source_library/ICSE/Mathematics/chap_20.pdf`,
  confirmed via a fresh `source_files` lookup this session).

The visual itself (rectangle → two cylinders redraw) was already built and
browser-QA'd 8/8 in Batch 15 Task 12
(`docs/workstream-4m-1727-visual-provenance-and-qa.md`) — this task performs
no new drawing work, only the live association.

## Write plan

`scripts/apply-1727-visual-association.js`, modeled directly on
`apply-2061-visual-association.js`: guarded transaction verifying
`question_uid`, `diagram_status='needs_visual_review'`,
`answer_status='verified'`, `status='verified'`, zero pre-existing
`visual_assets` rows; inserts the `source_cropped` and `ai_generated` rows;
updates `diagram_status` to `adapted_verified`; re-verifies every other
`questions` column byte-identical and both inserted rows read back exactly
as expected.
