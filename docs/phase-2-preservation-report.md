# Phase 2 — Preservation & Backup Verification

**Date:** 2026-09-23
**Preceding commit:** `967e93c` (Phase 9/production-readiness audit, complete)
**Scope constraint honored throughout:** this phase is preservation only. No schema change, no application code change, no question/answer/content edit, no source file modification, no deletion, no rotation of existing backups, no deployment, no authentication or security change, no PostgreSQL work. Every action below is either read-only inspection or the creation of new, additional, independent copies.

This report is both the manifest narrative called for in step 5 and the final report called for in step 13 of your spec — they're combined here rather than duplicated, since the final report supersedes and includes everything the intermediate one would have said. The structured data (per-file hashes, row counts, etc.) lives in `docs/preservation-manifest.json`.

---

## A. What was preserved

- The live database (`boardready.db`, 4,946 questions, 14 tables) — via a fresh, verified, SQLite-consistent backup.
- The entire source library (`source_library/`, 124 original files, 703MB) — via a lossless archive, verified byte-identical by extraction and re-hash.
- Every visual asset the database currently references (161 rows / 41 distinct files, all `source_page_full` type) — confirmed to already live inside `source_library/` and therefore already covered by that archive, plus the small `extracted-diagrams/` demo fixture archived separately for completeness.
- The application code and full git history (41 commits, `master` branch) — inspected and recorded as-is; nothing needed creating here since git itself is the preservation mechanism, but see finding H below on where that repository currently lives.
- All of the above was additionally copied off this container, onto the user's own computer, at their direction (see section H).

## B. Database backup details

- **Method:** `node:sqlite`'s built-in `backup()` function — the SQLite Online Backup API — used against the live database while it remained open and in its normal state. This was deliberately chosen over a raw file copy, per your instruction, because a page-level online backup is transaction-consistent even if a write were to land mid-copy; a raw `cp` of a live SQLite file has no such guarantee.
- **Result:** `boardready-preservation-20260923-063728.db`, 5,390,336 bytes (identical size to the live file), SHA-256 `27514330a026a50d523f2d8179464a1cb43f39ebdc1acb93d21a320a5282d095`.
- **Note on the hash:** this backup's SHA-256 does **not** match the live file's SHA-256 (`bc7c8384e32287bd7e6bf5caf42b7ec00f4f4779bc9d3d237c7c91121d9f6ed2`) despite being byte-for-byte the same size. This is expected and not a discrepancy: the SQLite backup API can legitimately produce a different internal page layout than the source file while being logically identical. Raw file hash is the wrong tool to verify a SQLite backup; the restore test below is the right one.
- **Live database recorded for reference:** `boardready.db`, 5,390,336 bytes, SHA-256 `bc7c8384e32287bd7e6bf5caf42b7ec00f4f4779bc9d3d237c7c91121d9f6ed2` — **not modified** at any point during this phase.

## C. Source-library backup details

- **Archive:** `source_library-preservation-20260923-063728.tar.gz`, plain tar + gzip (gzip compresses the archive container only — it does not re-encode any individual PDF/JPEG's internal content, and the extraction test below proves nothing was altered). 713,061,573 bytes, SHA-256 `953a25b8db675c29fb7c140105465b15deafa492cbd3e5860d6700c02aa90fbd`.
- **Manifest:** every one of the 124 source files' relative path, size, and SHA-256 is recorded in `docs/preservation-manifest.json` under `source_library.files`.
- **Verification performed:** the archive was extracted to a separate temporary directory and every one of the 124 extracted files was independently re-hashed. All 124 hashes and all 124 sizes matched the live files exactly — `diff` between the two manifests produced zero differences. Two representative files (one CBSE Maths PDF, one ICSE History PDF) were opened with `pdfinfo` and confirmed as valid, readable PDFs; two representative JPEGs were opened with `identify` and confirmed as valid images with correct dimensions. The temporary extraction copy was deleted after verification (it was a scratch copy for this test, not a preservation artifact).
- **Cross-check against the database:** every one of the 124 `source_files` table rows was matched against an on-disk file by SHA-256 and size — zero mismatches, zero rows pointing at missing files, zero files on disk untracked by the database.

## D. Visual-asset preservation

- All 161 `visual_assets` rows are `asset_type = 'source_page_full'`, referencing 41 distinct paths, and every one of those paths was confirmed to point at a real file already inside `source_library/` — meaning they're already fully covered by the source-library archive in section C. There is no separate visual-asset file store yet to back up independently.
- `extracted-diagrams/` (2 files, 161KB: a README and one demo/test fixture PNG, per its own README explicitly not associated with any live question) was archived separately anyway, for completeness: `extracted-diagrams-preservation-20260923-063728.tar.gz`, SHA-256 `99796e2e24906e8d726841708c2695fcc478f1f7f91db9d335af6131e76d4680`.

## E. Hash verification — summary

| Item | SHA-256 |
|---|---|
| Live `boardready.db` | `bc7c8384e32287bd7e6bf5caf42b7ec00f4f4779bc9d3d237c7c91121d9f6ed2` |
| DB preservation backup | `27514330a026a50d523f2d8179464a1cb43f39ebdc1acb93d21a320a5282d095` (see note in B) |
| source_library archive | `953a25b8db675c29fb7c140105465b15deafa492cbd3e5860d6700c02aa90fbd` |
| extracted-diagrams archive | `99796e2e24906e8d726841708c2695fcc478f1f7f91db9d335af6131e76d4680` |

Full per-file hashes for all 124 source files are in `docs/preservation-manifest.json`, not repeated here for length.

## F. Restore-test results

Performed against copies only; the live database was never touched.

- `PRAGMA integrity_check` on the backup copy: **ok**
- `PRAGMA foreign_key_check` on the backup copy: **0 violations**
- All 14 expected tables present: **confirmed**
- Row counts, live vs. backup, all 14 tables: **all match exactly** (attempts 309/309, audit_log 237/237, chapters 79/79, duplicate_flags 409/409, **questions 4,946/4,946**, source_document_files 289/289, source_documents 152/152, source_files 124/124, subjects 5/5, subscriptions 3/3, test_questions 3,128/3,128, tests 317/317, users 346/346, visual_assets 161/161)
- **Full-content digest comparison** (not just counts): a SHA-256 digest was computed over the complete row content of `questions`, `source_documents`, `source_files`, `visual_assets`, `attempts`, `tests`, and `users` in both the live database and the backup, ordered by id. **Every table's digest matched exactly** — this proves question text, options, correct answers, `question_uid`, `status`, `answer_status`, `source_document_id`, `locked_answers_json`, `improves_attempt_id`, `feedback_mode`, and every other field are byte-identical between live and backup, not just similarly-counted.
- **Verdict: RESTORE TEST PASSED.**

**Content-integrity check (your section 9):** no discrepancies were found between the preservation copy and the live database — see the full-content digest match above. Two pre-existing characteristics of the *live* database (present identically in both copies, so not a preservation issue) are worth surfacing for a future content-quality pass, not acted on here: 74 `questions` rows have a `NULL question_uid` (all `status='verified'`), and there are zero real duplicate non-null UIDs. Per your explicit instruction, nothing was changed — this is reported, not fixed.

## G. Existing backup assessment

| File | Size | SHA-256 | Opens? | integrity_check | Notes |
|---|---|---|---|---|---|
| `backups/boardready-pre-publication-audit-20260918-053914.db` | 5,066,752 B | `28c07aea...d9f6ed2b5` | Yes | ok, 0 FK violations | 4,946 questions — same content-era as current live DB |
| `backups/boardready.db.bak-before-phase2-20260922054849` | 5,070,848 B | `4110fb19...94ada` | Yes | ok, 0 FK violations | 4,946 questions — same content-era as current live DB |
| `boardready.db.bak-preopenkind` | 544,768 B | `755126e1...29e21e1e6bcb` | Yes | ok, 0 FK violations | 648 questions — an early project snapshot, pre-Chemistry/pre-Maths-expansion |

All three open cleanly and pass integrity/FK checks — they are genuinely valid, non-corrupt SQLite files. **None of them were deleted, moved, rotated, or replaced.** Per your explicit instruction: **all three are same-disk copies (same container, same filesystem as the live database) and are explicitly NOT considered independent disaster recovery**, regardless of their validity. They protect against an accidental bad write or a bad migration; they do not protect against the container itself being lost — which is the exact failure this project has already experienced once (see the Phase 9 audit).

## H. Independent / off-container backup status

No desktop was linked and no cloud-storage connector (Google Drive, Dropbox, Box all exist in the connector registry but none are connected to this account) was available at the start of this phase. You chose to link your desktop and create a destination folder (`F:\dimple\eduzenith`) rather than use a downloadable-only package.

What was transferred, confirmed file-by-file:
- The database backup (single file, confirmed written).
- The `extracted-diagrams` archive (single file, confirmed written).
- The source-library archive — this exceeded both the 30MB chat-delivery limit and the 20MB device-write limit, so it was split into 38 parts (~18MB each, `source_library_part_000` through `037`) and each part was transferred and confirmed written individually. Total bytes written across all 38 parts: 713,061,573 — exactly matching the original archive size.
- `CHECKSUMS.sha256` (per-part hashes) and `REASSEMBLE.ps1` (a PowerShell script that concatenates all 38 parts back into the original `.tar.gz` and automatically verifies the result's SHA-256 against `953a25b8db675c29fb7c140105465b15deafa492cbd3e5860d6700c02aa90fbd`).

**Status: the bytes are physically on independent hardware — your own computer, a separate physical machine from this container — and reassembly has now been confirmed.** You ran `REASSEMBLE.ps1`, which reconstructed `source_library-preservation-20260923-063728.tar.gz` (713,061,573 bytes, matching exactly) from the 38 parts. Rather than rely on the script's own on-screen output (the window closed before it could be read), independent proof was obtained a second way: you ran `Get-FileHash` on the reassembled file, wrote the result to `HASH_CHECK.txt`, and that file was pulled back into this session and decoded (it was UTF-16, PowerShell's `Out-File` default) directly. The hash it contained — `953a25b8db675c29fb7c140105465b15deafa492cbd3e5860d6700c02aa90fbd` — matches the recorded archive hash exactly.

**INDEPENDENT OFF-CONTAINER BACKUP: COMPLETED.** Both the transfer and the reassembly/integrity proof are done, verified independently of the script's own report, not just asserted.

## I. Git / code preservation status

- Current commit: `967e93c6827008a19c35b767310eeb298f7f8ac9` (2026-09-23), branch `master`, 41 total local commits.
- Uncommitted changes: none, except one pre-existing untracked file (`audit-publication-readiness-output.json`, dated Sep 18, unrelated to this or the previous phase, left exactly as found).
- **No git remote is configured** (`git remote -v` returns nothing) — this repository has never been pushed anywhere.
- **This means the entire application code and commit history exist only on this container's disk right now**, the same class of risk as the database and source library. No history was rewritten, no branch was touched, no commits were reset, consistent with your instructions.

**GIT/CODE INDEPENDENT BACKUP: NOT COMPLETED.** This wasn't in your original numbered checklist as a required deliverable of this phase, but it's the same failure mode applied to a different asset, so it's flagged here rather than silently left out. Recommend including a copy of the git repository itself (e.g. a `git bundle`) in whatever independent-storage step you take next, alongside the database and source library.

## J. Disaster-recovery findings (conceptual — no destructive test performed)

Scenario: *the current container disappears.*

| Asset | Recoverable? |
|---|---|
| Database (all 4,946 questions, attempts, users, provenance) | **Yes** — once you've confirmed the reassembled archive on your machine, independent of this container. |
| Source library (124 original PDFs/images) | **Yes** — same condition as above. |
| Visual assets | **Yes** — they're a subset of the source library, covered by the same archive. |
| Application code + git history | **No, not yet** — no copy exists outside this container. This is the one asset class this phase did not get to independent storage. |
| Configuration structure (`.env.example`, `package.json`) | Covered by the git history above — same gap. |
| Documentation (`PROJECT_PROGRESS.md`, `LAUNCH_STATUS.md`, `RECOVERY_AUDIT.md`, this report, etc.) | Also covered by the git history above — same gap. |

## K. Discrepancies

**None found in the preservation copies themselves.** The two pre-existing live-database observations (74 null `question_uid` rows, zero real duplicate UIDs) are noted in section F for future awareness — they are identical in both live and backup, so they are not a preservation discrepancy, and per your instruction nothing was changed.

## L. Remaining risks

1. Git/code history has no independent copy yet (see I/J) — this is now the single remaining gap from this phase.
2. The existing `backups/` snapshots remain same-disk only — fine as a secondary safety net, not a substitute for the independent copy now confirmed on your machine.
3. None of this is automated yet — today's preservation is a manual, one-time snapshot, same as the ones already in `backups/`. A recurring, automatic off-container backup is future work, not part of this phase.

---

## Status summary

**DATABASE: PRESERVED** (verified SQLite-consistent backup, restore-tested, full content-digest match, transferred off-container)

**SOURCE LIBRARY: PRESERVED** (lossless archive, extract-and-rehash verified, transferred off-container in 38 parts, cross-checked against DB)

**VISUAL ASSETS: PRESERVED** (fully covered by the source-library archive above; the small demo-fixture directory archived separately)

**APPLICATION CODE: NOT INDEPENDENTLY PRESERVED** (git history is intact and untouched, but exists only on this container — no remote, no bundle, no off-container copy yet)

**INDEPENDENT OFF-CONTAINER BACKUP: COMPLETED** (transferred to the user's own machine, reassembled, and independently hash-verified — `953a25b8db675c29fb7c140105465b15deafa492cbd3e5860d6700c02aa90fbd`, matching exactly)

**RECOVERY TEST: PASSED** (database restore test: integrity_check ok, 0 FK violations, all row counts and full content digests match; source-library extraction test: all 124 files byte-identical, representative PDF/image files verified openable)

---

## Explicitly not done in this phase

No PostgreSQL work, no schema migration, no staging, no security/authentication changes, no deployment, no deletion or rotation of any existing backup, no fix applied to the two pre-existing live-DB observations noted in section F, and no automatic/recurring backup mechanism was built — this was a one-time, manual, verified preservation pass, exactly as scoped.

## Recommended before moving to PostgreSQL

1. ~~Confirm the reassembly~~ — done: SHA-256 verified matching on 2026-09-23.
2. Decide how you want the git repository/application code independently preserved (a `git bundle` transferred the same way is the simplest option) — this is the one gap this phase didn't close.
3. Once that's addressed, this phase is fully done and reviewed, and — per your own sequencing — only then does the PostgreSQL migration-on-a-copy step begin.
