# Workstream 3D — Question 4575: Live Association Correction Record

**Written BEFORE the write below is applied**, per the same discipline used
for the Workstream 3B 3070 live association
(`docs/workstream-3b-3070-live-association-correction-record.md`): exact
before/after state, source citations, and a verification plan, all recorded
first.

**Live database SHA-256 immediately before this write:**
`4014833a08c1350606eb4ec64f2ada674a11318ca3bc8aed95acbe340176efd4`
**Backup taken:** `backups/boardready.db.bak-before-4575-visual-association-<timestamp>`
(verified byte-identical to the live file via `sha256sum` before proceeding;
exact filename recorded in the RESULT section below once taken).

This is the sign-off write for
`docs/workstream-3d-4575-graph-visual-provenance-and-qa.md`, following the
independently-verified proof recorded there (disposable-DB + real-browser
rendering proof, 71/71 on both engines, live DB untouched throughout that
workstream).

## What is changing

### 1. Two new `visual_assets` rows (INSERT only — nothing existing is deleted or modified)

| field | Row A (source_cropped) | Row B (ai_generated) |
|---|---|---|
| question_id | 4575 | 4575 |
| source_file_id | 118 | 118 |
| asset_type | `source_cropped` | `ai_generated` |
| asset_path | `extracted-diagrams/cbse-mathematics-polynomials-752a6e3e-item45-graph-CANDIDATE.png` | `extracted-diagrams/cbse-mathematics-polynomials-752a6e3e-item45-graph-GENERATED.svg` |
| figure_label | `Fig. 2.19, item 45 (p.2.22)` | `Fig. 2.19, item 45 (p.2.22)` |
| notes | `Unmodified crop of the original source figure (axes, curve, and caption only). Provenance/reference only — not the default student-facing visual once an ai_generated row exists for this question.` | `Board Ready native redraw of the source_cropped figure for this question. Colors are read from the host page's own CSS custom properties at render time (see public/app.js's loadDiagram). Semantic content verified against the source scan and the verified answer key (2 zeroes): curve below the x-axis at x=0, exactly two x-axis crossings both right of the y-axis, single peak between them — see docs/workstream-3d-4575-graph-visual-provenance-and-qa.md Sections 2 and 4.` |

Both files already exist on disk (committed in `e3dde1e`), hashes unchanged
since that commit:
- CANDIDATE.png: `b697c60911d793ef0d9a74ac5e8ca1e6854a3fa38d7f87568c42ad09f3a08288`
- GENERATED.svg: `83df5fc270f9db3ff76e17bf08460c81369b1599f147e6beb5fd9c36ac42c1d7`

The pre-existing row (`visual_assets.id = 105`, `asset_type =
'source_page_full'`, pointing at the whole 17-page source PDF) is **left
completely untouched** by this write.

**Discrepancy noted, not corrected here:** that pre-existing row's
`figure_label` currently reads "Fig. 2.19 (graph of y=p(x), a downward
parabola not touching the x-axis)". Section 2 of the provenance/QA doc
establishes the figure actually shows a parabola crossing the x-axis
**twice** (matching the verified answer, option (c) "2" zeroes) — "not
touching the x-axis" would describe a 0-zero case, which is not this
question's answer. This looks like a stale/incorrect placeholder written
without actually inspecting the image (the same class of issue Workstream
3C flagged for `needs_visual_review`). It is flagged here for visibility but
**deliberately not corrected** in this write, since editing an existing
row's content is out of scope for a change that is otherwise INSERT-only —
correcting that label, if wanted, should be its own small, separately
reviewed change.

### 2. One column change on `questions.id = 4575`

| column | before | after |
|---|---|---|
| `diagram_status` | `source_diagram_preserved` | `adapted_verified` |

Every other column on this row must be byte-identical before and after.
This write touches only `diagram_status`; `status` remains `transcribed` and
`answer_status` remains `verified` (already correct per Workstream 3C —
this workstream does not touch content QA, only the visual).

## Verification plan (all executed by the guarded apply script)

1. Snapshot the full `questions` row for id 4575 and all `visual_assets`
   rows for `question_id = 4575` immediately before the write.
2. Verify the pre-write snapshot matches the "before" values documented
   above exactly (abort if not).
3. Apply both `visual_assets` INSERTs and the one `diagram_status` UPDATE
   inside a single transaction (`BEGIN IMMEDIATE` / `COMMIT`), with the
   UPDATE guarded by `WHERE id = 4575 AND diagram_status =
   'source_diagram_preserved'` so it can only ever apply on top of the exact
   expected prior value, and checking `changes === 1`.
4. Re-read the row and both new rows back and verify every field matches the
   "after" values documented above exactly, and that every OTHER column on
   the `questions` row is byte-identical to the pre-write snapshot.
5. Re-read `visual_assets.id = 105` and verify it is byte-identical to its
   pre-write snapshot (including its inaccurate `figure_label` — left alone
   deliberately, see above).
6. Record the new live database SHA-256.
7. Re-run `scripts/content-qa-audit.js` (read-only) and confirm question
   4575 now classifies as `genuinely_servable`.
8. Re-run the full regression suite (`npm test`) on both SQLite and
   Postgres, confirming 71/71 and the test-guard's own live-DB-unchanged
   check.
9. Re-run a read-only replica of `server.js`'s `getServableDiagramUrls`
   query directly against the now-updated live database for `question_id =
   4575`, confirming it resolves to the `ai_generated` SVG path.

Nothing in this plan touches `source_library/`, any other question's row,
or any other `visual_assets` row.

## RESULT — applied 2026-09-25, via `scripts/apply-4575-visual-association.js`

**All verification steps passed. Committed successfully.**

- **Backup:** `backups/boardready.db.bak-before-4575-visual-association-20260925-102233`,
  verified byte-identical to the live file (`sha256sum`) before the write.
- **New live database SHA-256:**
  `e2743e0d92c76ddd40cc9f4e371ccd61de6aab9100379d02b775cff4ae55fe24`
  (previous: `4014833a08c1350606eb4ec64f2ada674a11318ca3bc8aed95acbe340176efd4`).
- `visual_assets` row count: 163 → 165 (exactly the 2 new rows: id 164
  `source_cropped`, id 165 `ai_generated`).
- **Full-table diff**, every table, every row, every column, backup vs.
  live (programmatic comparison, not spot-checked): the **only** difference
  anywhere in the database is `questions.id=4575, diagram_status:
  'source_diagram_preserved' -> 'adapted_verified'`, plus the 2 new
  `visual_assets` rows (164, 165). `visual_assets.id=105` (the pre-existing
  `source_page_full` row, including its inaccurate `figure_label` — see
  "Discrepancy noted, not corrected here" above) is byte-identical to its
  pre-write snapshot. All 12 other tables (`users`, `subjects`, `chapters`,
  `tests`, `test_questions`, `attempts`, `subscriptions`, `audit_log`,
  `source_documents`, `duplicate_flags`, `source_files`,
  `source_document_files`) are unchanged, same row counts, same content.
- `scripts/content-qa-audit.js` (read-only) re-run: Section C
  (Visual/Diagram Completeness) now shows `genuinely_servable: 2` (up from
  1) — 3070 and 4575 are the only two `genuinely_servable` rows in the
  entire bank.
- **Important caveat surfaced by this re-run, not a defect in this write:**
  the audit's "CURRENTLY GRADABLE" subset still shows only 1
  `genuinely_servable` row, not 2. That subset is filtered by
  `GRADABLE_STATUSES = ['verified', 'qa_passed', 'published']`
  (`content-rules.js`) against the question's **`status`** column — and
  4575's `status` is `transcribed`, not `verified`, even though its
  **`answer_status`** is `verified` (these are two different fields;
  Workstream 3C's "answer already verified" finding for 4575 was about
  `answer_status`, not `status`). `server.js`'s practice-generation query
  (`WHERE q.status IN (...)`) uses the same `GRADABLE_STATUSES` gate, so
  **question 4575 is not currently servable to real students at all** —
  its visual is fully live and correct, but the question itself remains
  behind the same content-promotion gate as the rest of the `transcribed`
  backlog. Promoting `status` is a separate, deliberate content-QA action
  outside this workstream's scope (per the standing rule against
  bulk-promoting question status), so it was **not** done here. This is
  analogous to 3070, whose `status` was already `verified` before Workstream
  3B started (via Workstream 3A), which is why 3070 shows as gradable and
  4575 — correctly — does not yet.
- Full regression suite: 71/71 passing on both SQLite and Postgres, each
  run's own test-guard confirming the live database was not further
  modified by running the tests.
- Read-only replica of `server.js`'s exact `getServableDiagramUrls` query,
  run directly against the now-updated live database for `question_id =
  4575`, resolves to
  `/extracted-diagrams/cbse-mathematics-polynomials-752a6e3e-item45-graph-GENERATED.svg`
  — confirming the generated SVG wins over the source crop on live data,
  independent of the `status`-gating caveat above (this function resolves
  purely from `visual_assets`, not from `status`).

This closes the visual chain end to end on real, live data:
`question_uid (cbse-mathematics-polynomials-752a6e3e)` → `source_document (id 151)`
→ `source_page (2.22, source_files.id 118)` → `original evidence (visual_assets.id 105, source_page_full — untouched; and the new id 164, source_cropped)`
→ `adapted SVG (visual_assets.id 165, ai_generated)` → `visual QA (docs/workstream-3d-4575-graph-visual-provenance-and-qa.md)`
→ `website rendering (getServableDiagramUrls resolves to the SVG; the generic pipeline proof already exercised this exact code path end-to-end in a real browser)`.

What this does **not** yet close: the `status`-gating caveat above means
4575 will not appear in any real student's practice test until a separate,
explicitly-approved content-status promotion happens — that is a content-QA
decision, not a visual-pipeline one, and is intentionally left untouched by
this workstream.
