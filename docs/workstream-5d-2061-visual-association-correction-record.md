# Visual Association Correction Record — id 2061 (Batch 15A, Task 7)

**Scope: 2 `visual_assets` INSERTs + 1 `diagram_status` UPDATE only.** Kept
as its own write, separate from Task 6's content/status promotion, per this
batch's standing rule to never combine visual-association changes with
content/status corrections.

## Pre-conditions checked before writing

- `answer_status='verified'` and `status='verified'` (Task 6's promotion
  already committed and independently confirmed).
- Zero pre-existing `visual_assets` rows for question 2061.
- Both asset files exist on disk with the exact sha256 hashes documented in
  `docs/workstream-4l-2061-visual-provenance-and-qa.md` (re-verified fresh
  this session, not reused unchecked):
  - `extracted-diagrams/icse-chemistry-electrolysis-c018bc46-item3-leadbromideapparatus-CANDIDATE.png`
    → `3aad5cfc1732729dba99fbeded58ba2810939b99eb574c62644d2fc04b5a02ff`
  - `extracted-diagrams/icse-chemistry-electrolysis-c018bc46-item3-leadbromideapparatus-GENERATED.svg`
    → `a9f6ca7457b55ab7cf52cf525bc3a41a8797148e7653b85d55e9e1f58ed68e75`
- `source_file_id = 40` (`source_library/ICSE/Chemistry/competency.pdf`,
  confirmed via a fresh `source_files` lookup this session).

The visual itself (a circuit/apparatus redraw of the electrolysis of molten
lead bromide) was already built and browser-QA'd 8/8 in Batch 15 Task 11
(`docs/workstream-4l-2061-visual-provenance-and-qa.md`) — this task performs
no new drawing work, only the live association.

## Write plan

`scripts/apply-2061-visual-association.js`, modeled directly on
`apply-1594-visual-association.js`: guarded transaction verifying
`question_uid`, `diagram_status='needs_visual_review'`,
`answer_status='verified'`, `status='verified'`, zero pre-existing
`visual_assets` rows; inserts the `source_cropped` and `ai_generated` rows;
updates `diagram_status` to `adapted_verified`; re-verifies every other
`questions` column byte-identical and both inserted rows read back exactly
as expected.
