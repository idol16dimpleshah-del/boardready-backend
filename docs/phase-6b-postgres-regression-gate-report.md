# Phase 6B — PostgreSQL Regression Gate: Completion Report

**Date:** 2026-09-24
**Scope:** exactly Stage 6B from `docs/phase-6-postgres-cutover-plan.md`, per your explicit 10-point specification: prove the application built in Stage 6A is genuinely **PostgreSQL-compatible, not merely PostgreSQL-migrated**, before any real hosting account (Stage 6C) is created.

---

## The 10-point checklist, with evidence for each

**1. Fresh PostgreSQL database.** Two independent fresh databases were created and schema-migrated for this stage's work (`boardready_stage6b_migrate_run1`, `run2`), plus per-test-file disposable databases created and dropped automatically by every `node --test` run (via the new `test/pg-test-support.js` helper). All were dropped at the end of this stage — nothing was left behind (verified: `SELECT datname FROM pg_database WHERE datname LIKE 'boardready%'` shows only `boardready_migration_test`, the pre-existing Phase 3/4 artifact database, untouched by this stage).

**2. Full migration from the real SQLite copy.** A new script, `scripts/stage6b-migrate.js`, reuses Phase 3's exact proven per-table migration logic (load order, integer-column validation, timestamp conversion, deferred-constraint transaction, identity-sequence fast-forwarding) but with the source path, target connection, and report path all required CLI flags — no hardcoded defaults, unlike the original one-off `migrate.js`, which this deliberately does not modify (a preserved Phase 3 deliverable). Run against a hash-verified copy of the live database (`sha256` matched `boardready.db` exactly before migrating): **346 users, 5 subjects, 79 chapters, 124 source files, 152 source documents, 289 source-document-file links, 4,824 of 4,946 questions (122 skipped — see point 9), 161 visual assets, 409 duplicate flags, 317 tests, 3,128 test-questions, 309 attempts, 3 subscriptions, 237 audit-log rows** — all committed in one all-or-nothing transaction (`COMMITTED_WITH_DISCREPANCIES`, discrepancies being exactly the known, pre-existing 122-row issue below, not a new one).

**3. All existing tests against PostgreSQL.** `test/readiness.test.js` and `test/security.test.js` — the two files Stage 6A's own report flagged as having un-awaited direct `db.prepare()` calls in their setup code — were fixed with the same mechanical `await`/`RETURNING id` pattern already applied throughout the app, and rebuilt on a new shared helper (`test/pg-test-support.js`) that provisions either a disposable SQLite temp file or a disposable, schema-migrated Postgres database depending on `DB_ENGINE`, so both files now run against either engine with identical intent. Result: **38/38 tests passing under `DB_ENGINE=postgres`** (31 original + 7 new, see point 4), and **38/38 still passing under the default SQLite engine**, unchanged.

**4. New PostgreSQL-specific regression tests.** A new file, `test/postgres-regression.test.js`, adds 7 tests targeting the specific bug classes Stage 6A's own report flagged as risks:
   - The `db-postgres.js` test-isolation guard genuinely refuses a missing `DATABASE_URL` and a reserved `boardready`/`_production`/`_staging` database name, and genuinely allows a properly-named disposable one — called directly against the engine module, independent of which engine the rest of the suite runs under.
   - `GET /api/content/summary`'s camelCase-alias-quoting and `COUNT()`-bigint-string-coercion fix, asserting the actual JS **type** (`number`, not `"24"`) of every returned count, plus exact values against seeded fixture data — a test that would have caught both original bugs.
   - The circular FK relationship between `tests.improves_attempt_id` and `attempts.test_id`, exercised live via a real "Improve My Score" HTTP flow (submit a deliberately all-wrong attempt → generate an improvement test from it → submit it all-correct → confirm the server reads its own `improves_attempt_id` back out of Postgres and returns a real `improvementComparison`) — not just proven migratable at migration time (point 9's deferred-constraints handling), but proven correct in live use.

**5. Full `verify-flow.js`.** `verify-flow.js` itself had the same un-awaited-`db.prepare()`-in-`.forEach()` bug (4 call sites, lines ~49/75/110/129) as the two test files — found by running it against real migrated Postgres data and hitting a real failure at Section 9 (`JSON.parse(undefined)`, because an un-awaited call returned a Promise instead of a row). Fixed with the same `for...of` + `await` conversion. Re-run end-to-end against a freshly re-migrated Postgres database: **all 11 sections passed** (login, wrong-password rejection, practice generation, attempt/questions, submit with a known score, double-submit correctly rejected, unanswered-questions handling, forged-field submission ignored, diagnostics summary, paid-gate check, readiness before/after a retest, improvement tracking, the CBSE case-study section that originally failed — now scoring a verified 10/10 — and full auth/session gating), against **real migrated production-shaped data**, not synthetic fixtures. Exit code 0, `DONE.` reached, only the script's own deliberate negative-test error responses appear in the log.

**6. Browser smoke test against PostgreSQL.** `scripts/browser-smoke-check.js` (built in Phase 5 for CSP verification) was run against a real Chromium instance driving the real frontend (`public/`) against a Postgres-backed server on a fresh migrated database. Full walkthrough: registration through the real form → dashboard → select ICSE Mathematics → Practice test with real-time ✓/✕ immediate feedback → Results (5/13) → Improve My Score (comparison card rendered) → Board Simulation (deferred feedback, zero reveal classes before submit, confirmed) → logout → real login form. **Result: PASS, zero CSP violations, zero page errors.** The one failed request logged (Google Fonts CDN, `ERR_TUNNEL_CONNECTION_FAILED`) is this sandbox's own external-network restriction, unrelated to Postgres or this application — the app's own CSP and functionality were unaffected.

**7. Concurrency tests.** Phase 4's `concurrency-test.js` explicitly scoped itself to the database layer only ("does NOT stand up the live HTTP application under load... explicitly out of scope") and deferred HTTP-level concurrency proof to later. That deferred work is what tests D1/D2 in `test/postgres-regression.test.js` do, against the real running server with Stage 6A's `db.transaction()`+`FOR UPDATE` fix in place:
   - **D1:** two genuinely simultaneous (`Promise.all`, not sequential) `POST /submit` calls for the *same* attempt — result: **exactly one 200, one clean 409**, never both, and the database itself confirms a single unambiguous final state.
   - **D2:** 10 genuinely simultaneous `POST /check` calls for 10 different question keys on the *same* attempt — result: **zero lost updates** (`locked_answers_json` read directly out of Postgres afterward contains all 10 keys), then a final submit confirms all 10 are correctly scored.
   Both passed under `DB_ENGINE=postgres`; both also pass under SQLite (a single synchronous connection has no real interleaving to lose, so this is the expected baseline).

**8. Live SQLite remains untouched.** The live database's hash (`cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52`) was re-verified identical after every phase of this stage's work — the migration source, the test suite runs, `verify-flow.js`, the browser smoke test, and the rollback demonstration below. It was never opened in write mode by anything in this stage; every operation used an explicit, disposable copy.

**9. Migration is repeatable.** The same hash-verified source copy was migrated into two independent fresh target databases (`run1`, `run2`, plus a third re-migration of `run1` for the browser check). All three runs produced **identical per-table row counts and an identical set of 122 skipped-row discrepancies** (compared programmatically, not by eye) — the same pre-existing content-QA issue already documented in earlier phases (`questions.correct` stored as non-integer strings like `"(a)"`/`"(b)"` in a handful of legacy rows, which SQLite's dynamic typing allowed but a strict Postgres `INTEGER` column correctly rejects). This is flagged, again, as the same known issue — not a new one, and not silently "fixed" by this stage.

**10. Rollback/recovery procedure.** Demonstrated concretely, not just asserted: a disposable copy of the live SQLite database was hash-verified, then the real server was started against it with `DB_ENGINE` and `DATABASE_URL` **both deliberately unset** (the exact pre-Phase-6 default) — no migration step, no configuration beyond pointing `DB_PATH` at the file. `verify-flow.js` was run against it end-to-end: **all 11 sections passed**, identical in kind to a pre-Phase-6 run. This is the entire rollback procedure: if a real Postgres cutover ever needed to be reversed, setting `DB_ENGINE=sqlite` (or removing the variable entirely) and pointing `DB_PATH` at the untouched live file restores full, immediate functionality with zero data loss and zero migration — because the SQLite path was never modified or made dependent on anything Postgres-related, only extended alongside it.

## Files changed

- `test/pg-test-support.js` (new) — shared engine-aware test-database provisioning helper (sqlite temp file or disposable schema-migrated Postgres database), including `pg_terminate_backend`-before-`dropdb` cleanup (a real resource-leak bug found and fixed during this stage — see below).
- `test/readiness.test.js`, `test/security.test.js` — rebuilt on `pg-test-support.js`; added the mechanical `await`/`RETURNING id` fixes flagged in the Stage 6A report.
- `test/postgres-regression.test.js` (new) — 7 tests covering the isolation guard, alias/type-coercion regression, circular-FK live flow, and 2 real HTTP-level concurrency tests.
- `verify-flow.js` — fixed 4 un-awaited `db.prepare(...).get(...)` calls inside `.forEach()` callbacks (converted to `for...of` + `await`), the same bug class as the two test files.
- `scripts/stage6b-migrate.js` (new) — parametrized, safety-guarded migration script for repeatable Stage 6B runs, reusing Phase 3's proven logic without modifying the preserved Phase 3 artifact.

## A real bug found and fixed during this stage (as intended — this is what a regression gate is for)

Disposable Postgres test databases created by `test/pg-test-support.js` were silently failing to drop in `after()` hooks (caught by a try/catch), because `dropdb` was racing either the parent process's own un-closed `pg.Pool` or a just-killed spawned child server's not-yet-torn-down connections. Fixed by running `pg_terminate_backend` (scoped to exactly that one disposable database's connections, never anything else) before `dropdb`. Verified: repeated full-suite runs now leave zero `boardready_test_%` databases behind, confirmed by direct query after each run.

## What was explicitly NOT changed

- The live SQLite database (`boardready.db`) — never opened for writes; hash re-verified unchanged after every step above.
- `source_library/`, any question's `status`/`answer_status`, or the 122 known malformed `correct` records — untouched, and re-confirmed as the same pre-existing, already-documented set across both migration runs.
- The preserved Phase 3/4 migration artifacts (`docs/phase-3-migration-artifacts/migrate.js`, `docs/phase-4-migration-validation-artifacts/concurrency-test.js`) — read for reference, never modified; `stage6b-migrate.js` is a new, separate script rather than an edit to `migrate.js`, specifically to avoid touching an already-validated deliverable from an earlier phase.
- No UI changes, no new product features, no new endpoints.

## Verification summary

| # | Checklist item | Result |
|---|---|---|
| 1 | Fresh PostgreSQL database | ✅ 2 independent fresh databases, both dropped after use |
| 2 | Full migration from real SQLite copy | ✅ hash-verified source, all 14 tables migrated |
| 3 | All existing tests against PostgreSQL | ✅ 38/38 (31 original + 7 new) |
| 4 | New PostgreSQL-specific regression tests | ✅ 7 new tests, all passing |
| 5 | Full verify-flow.js | ✅ all 11 sections, real migrated data |
| 6 | Browser smoke test against PostgreSQL | ✅ zero CSP violations, full UI walkthrough |
| 7 | Concurrency tests | ✅ 2 real HTTP-level concurrent-load tests, zero lost updates |
| 8 | Live SQLite remains untouched | ✅ hash unchanged throughout |
| 9 | Migration is repeatable | ✅ 3 independent runs, identical results |
| 10 | Rollback/recovery procedure | ✅ demonstrated, zero-migration, zero data loss |

## What remains

- **Stage 6C — real hosting accounts.** Per your own framing, this only happens now that Stage 6B has passed in full. It requires credentials/account creation from you — nothing further can be prepared in this sandbox alone.
- **Stage 6D — real-browser staging smoke test** against the actual deployed staging URL (distinct from this stage's local-sandbox browser check, which used a disposable local Postgres instance).
- The 122-row content-QA issue (non-integer `questions.correct` values) remains open and unchanged — it is a content-classification issue, not a migration or compatibility defect, and this stage did not touch it, per the standing rule against bulk-modifying question content.

## What is needed from you

Stage 6C is the next step you described, and it needs real hosting/database credentials from you before any further work can proceed — nothing else is required to unblock it from this sandbox's side.
