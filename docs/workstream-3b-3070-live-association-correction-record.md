# Workstream 3B — Question 3070: Live Association Correction Record

**Written BEFORE the write below is applied**, per the same discipline used
for the Workstream 3A options_json corrections
(`docs/workstream-3a-correction-record-3033-3070.md`): exact before/after
state, source citations, and a verification plan, all recorded first.

**Live database SHA-256 immediately before this write:**
`ac204d4919aee876d9f0e706dbad628a1d8ba8d5737f5717d0698a699890cba3`
**Backup taken:** `backups/boardready.db.bak-before-3070-visual-association-20260925-064217`
(verified byte-identical to the live file via `sha256sum` before proceeding).

This is the sign-off write for
`docs/workstream-3b-3070-generated-visual-provenance-and-qa.md` Section 4,
following your explicit approval to close the 3070 case: add the
`adapted_verified` diagram_status value, then insert the 3070 generated SVG
and provenance metadata.

## What is changing

### 1. Two new `visual_assets` rows (INSERT only — nothing existing is deleted or modified)

| field | Row A (source_cropped) | Row B (ai_generated) |
|---|---|---|
| question_id | 3070 | 3070 |
| source_file_id | 99 | 99 |
| asset_type | `source_cropped` | `ai_generated` |
| asset_path | `extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-CANDIDATE.png` | `extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-GENERATED.svg` |
| figure_label | `Number line, item 57 (p.4.8)` | `Number line, item 57 (p.4.8)` |
| notes | `Unmodified crop of the original source figure. Provenance/reference only — not the default student-facing visual once an ai_generated row exists for this question.` | `Board Ready native redraw of the source_cropped figure for this question. Colors are read from the host page's own CSS custom properties at render time (see public/app.js's loadDiagram). Semantic content (9 filled solution points -3..5, one open boundary at -4, one unmarked axis tick at 6) verified against the source scan and the answer key — see docs/workstream-3b-3070-generated-visual-provenance-and-qa.md Section 5.` |

Both files already exist on disk (committed in `4802a45`), hashes unchanged
since that commit:
- CANDIDATE.png: `eff45f7714fd908cab666a548090d01d03646f2062ebad08b25caf601feedaa9`
- GENERATED.svg: `b80c695b42e34a7c04ace19caf4ff7d0b802e40b27e860edff0c1ee50017f26d`

The pre-existing row (`visual_assets.id = 23`, `asset_type = 'source_page_full'`,
pointing at the whole 13-page source PDF) is **left completely untouched**.

### 2. One column change on `questions.id = 3070`

| column | before | after |
|---|---|---|
| `diagram_status` | `source_diagram_preserved` | `adapted_verified` |

Every other column on this row (`text`, `options_json`, `correct`, `status`,
`answer_status`, `source_page`, `answer_key_ref`, etc. — the full snapshot
above) must be byte-identical before and after. This write touches only
`diagram_status`; the question's content and answer key are not part of this
change (those were already corrected in Workstream 3A and are not being
revisited here).

`adapted_verified` is a newly-added allowed value (this same commit adds it
to `ingest.js`'s `VALID_DIAGRAM_STATUSES`, `db-sqlite.js`'s column comment,
and `docs/phase-3-migration-artifacts/schema.sql`'s CHECK constraint — see
those files' diffs). It is the correct value here per its own definition:
question 3070 now has a real `ai_generated` `visual_assets` row (Row B above)
and a completed, documented visual-QA comparison against the source
(`docs/workstream-3b-3070-generated-visual-provenance-and-qa.md` Section 5).

## Verification plan (all executed by the guarded apply script)

1. Snapshot the full `questions` row for id 3070 and all `visual_assets` rows
   for `question_id = 3070` immediately before the write.
2. Verify the pre-write snapshot matches the "before" values documented
   above exactly (abort if not — never write against an assumption that
   turns out to be stale).
3. Apply both `visual_assets` INSERTs and the one `diagram_status` UPDATE
   inside a single transaction (`BEGIN IMMEDIATE` / `COMMIT`), with the
   UPDATE guarded by `WHERE id = 3070 AND diagram_status = 'source_diagram_preserved'`
   so it can only ever apply on top of the exact expected prior value, and
   checking `changes === 1`.
4. Re-read the row and both new rows back and verify every field matches the
   "after" values documented above exactly, and that every OTHER column on
   the `questions` row is byte-identical to the pre-write snapshot.
5. Re-read `visual_assets.id = 23` and verify it is byte-identical to its
   pre-write snapshot.
6. Record the new live database SHA-256.
7. Re-run `scripts/content-qa-audit.js` (read-only) and confirm question 3070
   now classifies as `genuinely_servable` under its new `adapted_verified`
   status (that script's visual-completeness query was extended in this same
   change to include `adapted_verified` rows, so a wrongly-promoted future
   row would still show up as a defect instead of becoming invisible).
8. Re-run the full regression suite (`npm test`) on both SQLite and Postgres,
   confirming 71/71 and the test-guard's own live-DB-unchanged check (which
   will now report the new, expected hash as its baseline going forward).
9. Re-run a read-only replica of `server.js`'s `getServableDiagramUrls` query
   directly against the now-updated live database for `question_id = 3070`,
   confirming it resolves to the `ai_generated` SVG path — closing the loop
   from the live data through the exact code path already proven generically
   against the disposable test database.

Nothing in this plan touches `source_library/`, any other question's row, or
any other `visual_assets` row.

## RESULT — applied 2026-09-25, via `scripts/apply-3070-visual-association.js`

**All verification steps passed. Committed successfully.**

- New live database SHA-256: `4014833a08c1350606eb4ec64f2ada674a11318ca3bc8aed95acbe340176efd4`
  (previous: `ac204d4919aee876d9f0e706dbad628a1d8ba8d5737f5717d0698a699890cba3`).
- `visual_assets` row count: 161 → 163 (exactly the 2 new rows: id 162
  `source_cropped`, id 163 `ai_generated`).
- Full column-level diff of the `questions` table (every row, every column,
  compared programmatically against the pre-write backup) shows exactly one
  change in the entire table: `id=3070, diagram_status: 'source_diagram_preserved' -> 'adapted_verified'`.
- Full row-level diff of `visual_assets` shows the pre-existing row (id=23,
  `source_page_full`) byte-identical to its pre-write snapshot, plus exactly
  the 2 new rows with exactly the field values documented above.
- Every other table in the database (`users`, `subjects`, `chapters`,
  `tests`, `test_questions`, `attempts`, `subscriptions`, `audit_log`,
  `source_documents`, `duplicate_flags`, `source_files`,
  `source_document_files`) confirmed byte-identical, full-content comparison
  (not just row counts). `sqlite_sequence` changed only as the normal,
  expected side effect of the 2 `visual_assets` INSERTs (its own AUTOINCREMENT
  bookkeeping row for that table), not a separate/unexpected change.
- `scripts/content-qa-audit.js` (read-only) re-run: question 3070 is now the
  **first `genuinely_servable` row in the entire bank** under Section C
  (Visual/Diagram Completeness) — `{ missing_no_asset_row: 2679, only_whole_page_photo_not_genuinely_servable: 68, genuinely_servable: 1, not_an_image_reference: 79 }`.
- Full regression suite: 71/71 passing on both SQLite and Postgres, both runs'
  own test-guard confirming the live database was not further modified by
  running the tests.
- Read-only replica of `server.js`'s exact `getServableDiagramUrls` query, run
  directly against the now-updated live database for `question_id = 3070`,
  resolves to `/extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-GENERATED.svg`
  — confirming the live data is wired correctly through the same code path
  already proven generically against the disposable test database in
  `docs/workstream-3b-3070-generated-visual-provenance-and-qa.md` Section 6.

This closes the full chain end to end on real, live data:
`question_uid (icse-mathematics-linear-inequation-ace0c077)` → `source_document (id 108)`
→ `source_page (4.8, source_files.id 99)` → `original evidence (visual_assets.id 23, source_page_full — untouched; and the new id 162, source_cropped)`
→ `adapted SVG (visual_assets.id 163, ai_generated)` → `visual QA (docs/workstream-3b-3070-generated-visual-provenance-and-qa.md Section 5)`
→ `website rendering (getServableDiagramUrls resolves to the SVG; the generic pipeline proof in Section 6 of that same doc already exercised this exact code path end-to-end in a real browser)`.
