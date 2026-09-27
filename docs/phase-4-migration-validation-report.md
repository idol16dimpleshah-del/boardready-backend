# Phase 4 — Migration Validation (Final): Classified Comparison, Compatibility Fixes, Business-Logic Parity, Concurrency

**Date:** 2026-09-24
**Status:** Final, authoritative Phase 4 result. Produced entirely through the corrected, isolated test harness described in `docs/test-database-isolation-incident.md` (status there: `TEST DATABASE ISOLATION: VERIFIED`). Supersedes `docs/phase-4-migration-validation-report-PRE-ISOLATION-FIX-2026-09-23.md`, which is retained only as a historical record and is explicitly marked as not the final result.

**Scope, as instructed:** SQLite preserved copy → full PostgreSQL migration → compare all 14 tables and every important field → classify every difference → fix genuine migration/compatibility issues → rerun from a fresh PostgreSQL database → run the application (business logic) against PostgreSQL → run all 12 tests → run API/regression tests → run concurrency tests only against isolated environments → verify original SQLite remains unchanged → this report.

**Hard rules honored throughout, verified at every step below:** never modify the live SQLite database; never promote the 122 known rows as part of migration; never silently transform data to make a comparison pass; every mismatch classified into one of the five categories below.

---

## 0. What's different from the pre-isolation-fix run

Nothing about the migration/comparison/compatibility/parity tooling itself changed — `migrate.js`, `compare-classified.js`, `pg-compat-shim.js`, `prove-compat-fix.js`, `prove-business-logic-parity.js`, and `concurrency-test.js` are unmodified from the prior run; they never touched `db.js` or the application's test harness, so they were never actually at risk. What changed is: (1) every step below was re-executed from scratch — a freshly re-copied, hash-verified SQLite source and a dropped-and-recreated PostgreSQL database, not a reuse of prior state — and (2) the regression-testing step (Section 6) now runs through `npm test`, which goes through `scripts/run-tests-with-live-db-guard.js` and the hardened `db.js`/`test/readiness.test.js` — the exact component that was compromised during the prior run (incident #2) — so that evidence is now trustworthy on its own terms, not merely "the tests happened to pass."

## 1. Fresh source, fresh target, full migration

- **Live baseline immediately before this run:** SHA-256 `cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52`; all 14 tables' row counts recorded (`users` 346, `subjects` 5, `chapters` 79, `questions` 4946, `source_documents` 152, `source_files` 124, `source_document_files` 289, `visual_assets` 161, `duplicate_flags` 409, `tests` 317, `test_questions` 3128, `attempts` 309, `subscriptions` 3, `audit_log` 237); `PRAGMA integrity_check` → `ok`.
- **Source:** a brand-new copy of the live database made at the start of this run, hash-verified identical to the live file at copy time (`cda008e9...`, matching the baseline above), opened by `migrate.js` exclusively with `{ readOnly: true }`.
- **Target:** `boardready_migration_test`, dropped and recreated from scratch, schema re-applied from `schema.sql`.
- **Migration run twice, independently, from two separate fresh databases** (dropped and recreated between runs) to prove determinism, not just a single clean pass: both runs produced byte-for-byte identical results — 4,824 of 4,946 questions migrated (122 excluded, see Section 3/C below), all 13 other tables migrated in full (100%), the circular `tests`↔`attempts` foreign key deferral succeeding both times.

## 2. Classified comparison — every mismatch labeled, none unexplained

`compare-classified.js` labels every discrepancy as exactly one of `schema`, `representation`, `migration_bug`, or `existing_content_issue`. Result, identical across both fresh-database runs:

| Classification | Count |
|---|---|
| `schema` | 2 |
| `representation` | 1 |
| `migration_bug` | **0** |
| `existing_content_issue` | 122 |

**Overall: `ALL_MISMATCHES_CLASSIFIED_NONE_UNEXPLAINED`.** All 14 tables report `MATCH`. Full detail in `docs/phase-4-migration-validation-artifacts/compare-classified-report.json`.

Per the user's explicit requirement, the findings are broken out below by exactly what they are — so that, for example, the 122 pre-existing transcription rows are never mistaken for a PostgreSQL problem.

---

### A. Migration bugs fixed

**None found or needed fixing in this run.** Both fresh-database migration/comparison cycles reported `migration_bug: 0` — a full row-for-row, column-for-column comparison across all 14 tables found zero unexplained missing rows, extra rows, or content differences among anything the migration claimed to move. There is nothing in this category to report beyond that the check was run, twice, deterministically, and came back clean both times.

### B. PostgreSQL representation differences

Two categories, both understood, both handled by normalization rather than data change:

1. **Timestamps (`representation`, 1 finding, 6 columns: `created_at`, `started_at`, `submitted_at`, `draft_saved_at`, `uploaded_at`, `archived_at`).** SQLite stores these as naive-UTC TEXT (`datetime('now')`'s format); PostgreSQL's mapped schema uses `TIMESTAMPTZ`. Both sides are normalized to a common ISO form purely for the *comparison script's* purposes — the normalization lives in `compare-classified.js`, is visible in its source, and never touches either database's actual stored data.
2. **The `diagram_status` CHECK constraint (`schema`, 1 of the 2 `schema` findings).** PostgreSQL enforces this as a real database-level `CHECK` constraint; SQLite's schema never had one (only `ingest.js`'s application code validated it). Verified safe: **0 live rows violate the constraint**, so this is a stricter destination schema, not a data problem.
3. **The circular foreign key (`schema`, the other of the 2 `schema` findings).** `tests.improves_attempt_id → attempts(id)` while `attempts.test_id → tests(id) NOT NULL`. Resolved via `DEFERRABLE INITIALLY DEFERRED` on both directions plus `SET CONSTRAINTS ALL DEFERRED` during bulk load — a schema/loading-order difference between the two engines, not a data issue, and re-proven working on both fresh-database runs in this final pass.

### C. Existing content anomalies (pre-existing in the source data, not caused by migration)

**122 rows in `questions.correct`** — 119 like `"(b)"`, 3 free-text like `"oxidising"` — all from the `competency.pdf + competency_answer.pdf` batch, all `status='transcribed'` (never gradable or servable to a student). The column is declared `INTEGER` in the mapped PostgreSQL schema; SQLite's dynamic typing silently permitted these non-integer values to be written; PostgreSQL's static typing correctly rejects them. **Nothing about these rows was touched, promoted, guessed at, or coerced** — they were excluded from migration by design, are logged individually (id/column/value) in `migrate-report.json`'s discrepancies array, and remain tracked as an open content-QA item in `PROJECT_PROGRESS.md`'s Section C addendum (unchanged by this rerun — this is a content question, independent of infrastructure, and this phase does not resolve it). This is exactly the category the user's instruction was concerned about being mislabeled: **this is not a PostgreSQL problem or a migration bug — it is a pre-existing defect in 122 rows of source-transcribed content**, and it is filed as `existing_content_issue`, not `migration_bug`, in both the classifier's output and here.

### D. Application query compatibility fixes

Two genuine bugs, both found in Phase 3, both re-confirmed fixed in this run via `pg-compat-shim.js` (a new, separate file — never a modification to `server.js`/`db.js`):

1. **Alias casing.** PostgreSQL folds unquoted SQL aliases to lowercase (`subjectCount` → `subjectcount`), which silently breaks application code reading `r.subjectCount`. Fixed by mapping known lowercase-folded aliases back to their camelCase application names.
2. **`COUNT()`/bigint returned as a string.** The `pg` driver returns aggregate counts as strings, not numbers, which silently breaks arithmetic (`acc.subjects + r.subjectCount` becomes string concatenation or `NaN`, and `JSON.stringify(NaN)` is `null` — a *total* silent failure, not a subtly wrong number).

**Proof, rerun against the fresh migration** (`prove-compat-fix.js`, using `server.js`'s real, unmodified `/api/content/summary` reduce logic):

| Path | Result | Type of `subjectCount` |
|---|---|---|
| (a) SQLite (baseline) | `{"subjects":5,"chapters":79,"questions":1326}` | `number` |
| (b) PostgreSQL, raw, no shim | `{"subjects":null,"chapters":null,"questions":null}` | — |
| (c) PostgreSQL, through the shim | `{"subjects":5,"chapters":79,"questions":1326}` | `number` |

Identical to the pre-isolation-fix run's result — confirms the fix is stable, not a one-off.

### E. Anything still unresolved

- **The 122-row content anomaly (see C above)** remains genuinely unresolved by design — this phase's job was to validate migration, not to re-adjudicate 122 years-old-source-transcription questions. Tracked in `PROJECT_PROGRESS.md`, on its own timeline.
- **The async/placeholder/`RETURNING id` rewrite** needed for the application to actually run against PostgreSQL over HTTP (not just have its pure business logic proven equivalent) is real, multi-day engineering, already cataloged in the Phase 3 report (Section 9), and is Phase 6/7 scope per the user's own calendar — not started, not claimed as done here.
- **Full HTTP-level concurrency/load testing** against a live PostgreSQL-backed application is also Phase 7 scope (Section 8 below is deliberately narrower: a database-layer proof, not an HTTP-level one).
- No new unresolved items surfaced in this rerun beyond what Phase 3 already identified.

---

## 3. Business-logic parity — "the application" proven against PostgreSQL at the logic layer

The strongest evidence available at this phase (the actual HTTP application running against PostgreSQL is Phase 6/7 scope, per Section E above): `scoring.js`, `diagnostics.js`, and `readiness.js` required **directly, unmodified**, and run against data fetched from SQLite, and again against the same data fetched from the freshly migrated PostgreSQL database through the compat shim, for **all 68 real students** with at least one submitted attempt.

**Result: 68/68 students match exactly. Zero mismatches** in the flattened per-question `steps`, `diagnostics.summarizeGroup`'s summary, or any of the four compared `readiness.js` scoring components. (`docs/phase-4-migration-validation-artifacts/business-logic-parity-report.json`)

## 4. Regression testing — now through the corrected, isolated harness

This is the section that carried the compromised evidence in the prior report. Rerun cleanly this time:

- **`npm test`** (routes through `scripts/run-tests-with-live-db-guard.js` → the hardened `db.js` and `test/readiness.test.js`, which now set their own explicit `NODE_ENV`/`DB_PATH` before touching anything) — **12/12 tests passed.** The wrapper independently hashed and row-counted the live database before and after: **unchanged, both times.**
- **`verify-flow.js`** (the project's real end-to-end HTTP flow check) — run against a disposable, hash-verified copy of the live database (server started with `DB_PATH` set inline in the same command, never via a prior `export`) — completed to `DONE.`, no errors.
- Live database re-verified immediately after both: SHA-256 unchanged, all 14 row counts unchanged, `PRAGMA integrity_check` → `ok`, `PRAGMA foreign_key_check` → 0 violations.

## 5. Concurrency — database-layer only, isolated PostgreSQL environment exclusively

Rerun of `concurrency-test.js`, which talks **only** to the PostgreSQL test database via a connection pool — never `server.js`, never `node --test`, never SQLite in any writable capacity.

**Throughput (honest result):** for a trivial single-row lookup, sequential `node:sqlite` `DatabaseSync` calls (0.1–0.6ms for 10–100 calls) were faster than the same count of queries issued concurrently through a pooled PostgreSQL connection over TCP (30–48ms). Expected and not a PostgreSQL problem — an embedded, in-process database will always win a raw-latency micro-benchmark against a networked one; it is not the concurrency property worth testing.

**Concurrency safety (the load-bearing result, reproduced identically to the prior run):** 25 simultaneous "increment the same row" operations, modeling several students hitting `/api/attempts/:id/check` on the same attempt at once:

- **With the recommended pattern** (transaction + `SELECT ... FOR UPDATE` row lock): **25/25 — correct, zero lost updates.**
- **Without it** (naive read-modify-write, what today's code does, currently masked by `DatabaseSync`'s accidental single-connection serialization): **1/25 — 24 updates silently lost.**

A real, reproduced correctness bug, confirming both the risk and that the recommended fix closes it.

---

## Status summary

**MIGRATION: REPEATED TWICE FROM FRESH DATABASES, IDENTICAL BOTH TIMES** — zero drift.

**COMPARISON: FULLY CLASSIFIED** — A: 0 migration bugs. B: 2 schema differences + 1 representation difference, all understood and verified safe. C: 122 pre-existing content anomalies (unchanged, untouched, tracked separately). D: 2 application query-compatibility bugs, both fixed and proven. E: nothing new unresolved beyond already-scoped Phase 6/7 work.

**BUSINESS-LOGIC PARITY: 68/68 STUDENTS MATCH EXACTLY.**

**REGRESSION: 12/12 tests pass, `verify-flow.js` clean — both run through the corrected, isolated test harness this time, not the compromised one.**

**CONCURRENCY: safety pattern proven (25/25 with locking vs. 1/25 without); full HTTP-level load testing remains Phase 6/7 scope.**

**LIVE DATABASE: verified unchanged before, during (implicitly, via the isolated harness), and after this entire phase** — SHA-256 `cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52` throughout, all 14 row counts unchanged, integrity check `ok`, 0 foreign-key violations.

**APPLICATION CODE: untouched** — every compatibility fix and test-harness change is either a new, separate file or a change already committed and documented in `docs/test-database-isolation-incident.md`; nothing in `practice.js`, `diagnostics.js`, `readiness.js`, or `scoring.js` was modified for this phase.

**RECOMMENDATION:** the milestone — *"PostgreSQL contains the same BoardReady data as SQLite, with every difference accounted for, and the application's real logic passes against PostgreSQL"* — is met at the database and business-logic layer, now on a validated, trustworthy test harness. What remains before the actual HTTP application can run against PostgreSQL is the code-level work already cataloged in the Phase 3 report, Section 9 (async rewrite, placeholder translation, `RETURNING id`) — real engineering, Phase 6/7 scope — plus the still-open 122-row content-QA item, on its own timeline, independent of infrastructure.
