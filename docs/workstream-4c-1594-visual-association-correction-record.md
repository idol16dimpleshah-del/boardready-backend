# Correction Record — 1594 Live Visual Association (Batch 15, Task 3)

**Gate check: Task 1 succeeded** (1594 is now `status='verified'`,
`answer_status='verified'`, confirmed live). Per the task's explicit "only
apply if the content gate from Task 1 succeeded" instruction, this proceeds.

## What this changes

Two `visual_assets` INSERTs (no pre-existing rows for this question — unlike
4575, which already had a `source_page_full` row; 1594 currently has zero)
plus one `questions.diagram_status` UPDATE. Nothing else.

| asset_type | asset_path | source_file_id |
|---|---|---|
| `source_cropped` | `extracted-diagrams/icse-mathematics-angle-and-cyclic-properties-of-circle-1adba987-item22-circle-CANDIDATE.png` | 11 (`ICSE-MATH-CH17`, `chap_17.pdf`) |
| `ai_generated` | `extracted-diagrams/icse-mathematics-angle-and-cyclic-properties-of-circle-1adba987-item22-circle-GENERATED.svg` | 11 |

`questions.diagram_status`: `needs_visual_review` → `adapted_verified`.

`source_file_id=11` resolved via `source_document_files` (1594's
`source_document_id=50` → `source_file_id=11`, confirmed against
`source_files.original_filename='chap_17.pdf'`). `source_library/ICSE/Mathematics/chap_17.pdf`'s
live SHA-256 (`9ab52736f86065d21a237fa0f253835c85d2f773b439cbc8799e64fbb7363855`)
matches the value already on record in `source_files`, confirming the source
PDF has not been touched since ingestion.

## Provenance preserved (per the task's explicit list)

- **Original source evidence**: `source_library/ICSE/Mathematics/chap_17.pdf`
  itself — read-only, untouched, hash-verified above.
- **Source-cropped provenance asset**: the `CANDIDATE.png`, an unmodified
  crop of the source figure, built and hash-recorded in Workstream 3I
  (`docs/workstream-3i-1594-1230-visual-reconstruction.md`). Re-verified this
  session: SHA-256 `875ba6e349531788af9f54732f125fba588d65d79623a679a88dbc6544ba95c2`,
  unchanged since that record.
- **Adapted SVG**: the `GENERATED.svg`, browser-tested 8/8 combinations in
  Workstream 3I (part of the combined 16/16 run covering both 1594 and
  1230). Re-verified this session: SHA-256
  `009a48f1fea89d837a78508b470a0fabca18d37c2bf071d7953a3c2eb26f744c`,
  unchanged.

Both files' hashes match Workstream 3I's record exactly — nothing has drifted
since they were built and proven.

## Verification plan

1. Fresh backup + hash before.
2. Guarded script (`scripts/apply-1594-visual-association.js`): pre-flight
   checks both asset files exist on disk with the expected hashes before
   opening any transaction; inside the transaction, verifies
   `diagram_status='needs_visual_review'`, `answer_status='verified'`
   (content gate), and zero pre-existing `visual_assets` rows for this
   question; inserts both rows; updates `diagram_status`; re-verifies every
   other `questions` column byte-identical and both new rows read back
   exactly as inserted.
3. Full-table diff against backup — expect exactly 2 new `visual_assets`
   rows and exactly 1 changed `questions` column (`diagram_status`), nothing
   else, in the entire database.
4. `content-qa-audit.js` re-run — 1594 should now classify as
   `genuinely_servable` (or move out of the visual-completeness backlog
   entirely) rather than `missing_no_asset_row`.
5. 71/71 SQLite + 71/71 PostgreSQL regression.
6. **Serving-query verification**: query the server's actual
   `getServableDiagramUrls` logic (or an equivalent direct check) for
   question 1594 and confirm it resolves to the `ai_generated` SVG, not the
   `source_cropped` PNG — the same priority-order rule already tested for
   3070/4575 in Workstream 3I's browser proof, re-confirmed here at the data
   layer for the newly-live rows.
7. Live DB hash before/after.

Results appended below once complete.

## RESULT — applied 2026-09-26

1. Backup: `backups/boardready.db.bak-before-1594-visual-20260926-062247`,
   byte-identical before the write (SHA-256
   `e03344ac64defef91c2349995cc461b785f87663abf33e7a3d980ad81186fafb`).
2. `scripts/apply-1594-visual-association.js`: pre-flight hash check passed
   for both asset files; guard checks (content gate, zero pre-existing rows)
   passed; COMMIT successful. Inserted `visual_assets` id 166
   (`source_cropped`) and id 167 (`ai_generated`).
3. Full-table diff: exactly 3 changed/new rows across the entire database —
   `questions` id 1594 (`diagram_status` only), and the two new
   `visual_assets` rows (166, 167), matching the correction record exactly.
   Nothing else changed.
4. `content-qa-audit.js`: `genuinely_servable` count moved from 2 to 3
   (1594 now included), `missing_no_asset_row` dropped from 2679 to 2678.
5. 71/71 SQLite regression, guard confirmed DB unchanged after.
6. 71/71 PostgreSQL regression, guard confirmed DB unchanged after.
7. Serving-query check: called `getServableDiagramUrls([1594, 1230], db)`
   directly (the real function from `server.js`) — resolves 1594 to
   `/extracted-diagrams/.../item22-circle-GENERATED.svg` (the `ai_generated`
   row, correctly preferred over `source_cropped`), and 1230 to `undefined`
   (no association yet — that's Task 4).
8. Live DB hash after: `ffbbd43b80eb129e060ba0311af6165b491d72dc43e1a06e182787a75da38607`.

**Task 3: COMPLETED / APPLIED.**
