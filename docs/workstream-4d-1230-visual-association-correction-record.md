# Correction Record — 1230 Live Visual Association (Batch 15, Task 4)

**Gate check: Task 2 succeeded** (1230 is now `status='verified'`,
`answer_status='verified'`, confirmed live). Independent transaction from
Task 3.

## Diagram re-verified against the original source before writing, as instructed

Re-rendered `source_library/ICSE/Mathematics/chap_19.pdf` p.19.6 item (33)
this session (not reused from memory) to re-confirm the figure the SVG must
match: triangle ABC, D the midpoint of BC (two equal tick marks), segment AD
drawn from A to D with a right-angle mark at D, point E on AD strictly
between A and D. This matches
`extracted-diagrams/icse-mathematics-locus-and-construction-c23699f9-item33-triangle-GENERATED.svg`
exactly as built and documented in Workstream 3I — no drift found. File
hashes re-verified unchanged (below).

## What this changes

| asset_type | asset_path | source_file_id |
|---|---|---|
| `source_cropped` | `extracted-diagrams/icse-mathematics-locus-and-construction-c23699f9-item33-triangle-CANDIDATE.png` | 13 (`ICSE-MATH-CH19`, `chap_19.pdf`) |
| `ai_generated` | `extracted-diagrams/icse-mathematics-locus-and-construction-c23699f9-item33-triangle-GENERATED.svg` | 13 |

`questions.diagram_status`: `needs_visual_review` → `adapted_verified`. No
pre-existing `visual_assets` rows for this question (confirmed: 0).

`source_file_id=13` resolved via `source_document_files` (1230's
`source_document_id=41` → `source_file_id=13`, confirmed against
`source_files.original_filename='chap_19.pdf'`).
`source_library/ICSE/Mathematics/chap_19.pdf`'s live SHA-256
(`6dc719d496b7058dd546e83e8beb6468c27192c29319ea4e8d2e5eec70a27830`) matches
the value on record in `source_files` — untouched since ingestion.

Asset file hashes re-verified this session, unchanged from Workstream 3I:
- `CANDIDATE.png`: `d04bdca220e9eb60dbd44aff9d663ae8f12bacf19d531c7db1d63b71b684f193`
- `GENERATED.svg`: `7680a14c93fe1140d07354b0ce2d95ed0e627752e49dc77e2159af52ad69a8ff`

## Rendering already proven remains unchanged (per the task's instruction)

Both assets are exactly the files browser-tested in Workstream 3I's combined
16-check run (8 of the 16 checks are 1230's: {dark,light} × {desktop,mobile}
× {question,lightbox}), with SHA-256 confirmed identical to that run — no
rebuild was done, so the desktop/mobile/light/dark/lightbox proof from that
session applies unchanged to the exact bytes now being associated live. This
task's serving-query check (below) re-confirms the association resolves
correctly at the data layer, the one thing that could differ post-live-
association even with unchanged files.

## Verification plan

Same as Task 3: fresh backup + hash; guarded script with pre-flight asset
hash check, content-gate check, zero-pre-existing-rows check; full-table
diff; content-QA audit; 71/71 SQLite + 71/71 PostgreSQL; serving-query check
for both 1594 and 1230 together (confirming Task 3's association is still
correct and 1230's new association resolves to its own `ai_generated` SVG);
hash before/after.

Results appended below once complete.

## RESULT — applied 2026-09-26

1. Backup: `backups/boardready.db.bak-before-1230-visual-20260926-062428`,
   byte-identical before the write (SHA-256
   `ffbbd43b80eb129e060ba0311af6165b491d72dc43e1a06e182787a75da38607`).
2. `scripts/apply-1230-visual-association.js`: pre-flight hash check passed;
   guard checks passed; COMMIT successful. Inserted `visual_assets` id 168
   (`source_cropped`) and id 169 (`ai_generated`).
3. Full-table diff: exactly 3 changed/new rows — `questions` id 1230
   (`diagram_status` only) and the two new `visual_assets` rows (168, 169).
   Nothing else changed.
4. `content-qa-audit.js`: `genuinely_servable` moved from 3 to 4,
   `missing_no_asset_row` dropped from 2678 to 2677.
5. 71/71 SQLite regression, guard confirmed unchanged after.
6. 71/71 PostgreSQL regression, guard confirmed unchanged after.
7. Serving-query check (both questions together): 1594 resolves to its
   `ai_generated` SVG (Task 3's association still correct); 1230 now
   resolves to `/extracted-diagrams/.../item33-triangle-GENERATED.svg`.
8. Live DB hash after: `8117661be483e907c77eed29076264b07f23b94ffda1075e7c79681f3b710684`.

**Task 4: COMPLETED / APPLIED.**
