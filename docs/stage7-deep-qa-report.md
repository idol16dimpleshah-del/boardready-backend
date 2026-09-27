# Stage 7 deep QA — automated isolation/authz/concurrency/resilience tests

**Date:** 2026-09-24
**Status:** Complete and passing locally (both SQLite and PostgreSQL engines). Runs entirely offline — no Railway/staging dependency. This is workstream 1 of the founder's "work ahead while waiting for Railway" instruction: *"Phase 7 deeper automated QA and isolation tests."*

## Why this file exists

A dedicated investigation of the existing test suite (`test/security.test.js`, `test/readiness.test.js`, `test/postgres-regression.test.js`) found real, specific gaps rather than vague under-testing:

- Token handling was only ever tested for "no token" (401) and "wrong student" (403) — never a malformed, tampered, wrong-secret, expired, or exp-less token.
- There is no teacher/student role-boundary test anywhere, even though `requireAuth(req, allowedRoles)` gates most of the API.
- Cross-student isolation was proven only for `GET /api/attempts/:id/questions`. `PATCH /answers`, `POST /check`, `POST /submit`, `GET /attempts/me`, and `POST /tests/improve` all have the same kind of ownership check in `server.js`, but none of them had a test proving it actually rejects a different student.
- The Stage 6A transaction + row-lock rewrite (`db.transaction(...)` with `FOR UPDATE` under Postgres) was proven at the database layer (Phase 4's `concurrency-test.js`) and, for a subset of endpoints, at the HTTP layer under Postgres specifically (`postgres-regression.test.js`). It had never been exercised at the HTTP layer for simultaneous test generation, a same-key `/check` race, a same-attempt `/answers` race across two keys, or a duplicate-submission race on `/submit`.
- `/api/health` (Stage 6C) had zero test coverage at all.
- No test exercised invalid JSON, missing fields, a non-numeric id, a non-object `answers` payload, or an oversized body on any route besides `/api/auth/login`.

`test/stage7-deep-qa.test.js` closes all of the above, in five independent suites, each on its own port, following this codebase's existing test-database-isolation discipline (`test/pg-test-support.js` — never `boardready.db`, always a disposable per-suite database, verified via `db.DB_PATH !== db.LIVE_DB_PATH` and `db.IS_TEST_MODE`).

## What each suite covers

**A. Auth-token hardening + role boundary.** No token, a garbage-string token, a well-formed-but-meaningless token, a tampered token (real signature, edited payload), a token signed with the wrong secret, an expired token, and a token with no `exp` field at all — all rejected with 401. Then the role boundary: a real, validly-signed **teacher** token is rejected with 403 (never 401 — the token is valid, the role just isn't allowed) from every student-only route: `/practice/generate`, `/tests/generate`, `/tests/improve`, `POST /attempts`, `GET /attempts/:id/questions`, `GET /attempts/me`, `GET /diagnostics/me/summary`, `POST /subscriptions/activate`. A positive control confirms the same teacher token *is* accepted on `GET /api/chapters` (the one route that explicitly allows both roles), proving the 403s above are a real per-route check, not a broken token or a global lockout. There is no teacher-only route in this codebase to test the reverse direction (confirmed by inspection of every `requireAuth()` call site in `server.js`).

**B. Cross-student isolation.** Student B is proven unable to autosave onto (`PATCH /answers`), check an answer into (`POST /check`), or submit (`POST /submit`) student A's attempt — each 403, and each test also confirms A's own data was left untouched by the rejected attempt (draft empty, nothing locked, still unsubmitted). `GET /attempts/me` is proven scoped strictly to the caller. `POST /tests/improve` with a `sourceAttemptId` belonging to a different, already-submitted student is proven to 404 rather than leak that the attempt exists.

**C. Concurrency races.** Five simultaneous `POST /tests/generate` calls for the same student produce five distinct, fully-formed tests (no lost writes, no corrupted question sets). A same-key `/check` race (two different answers submitted for the same question at the same time) locks exactly one verdict, and proves the loser reports the *winner's* locked answer, not its own — a real, shared lock, not just "didn't crash". A same-attempt, different-key `/answers` race proves both concurrent autosaves survive (no lost update). A duplicate-submission race on `/submit` proves exactly one request wins with 200 and the other cleanly 409s — never double-scored, never left unsubmitted.

**D. Malformed and oversized requests.** Invalid JSON on an authenticated route beyond `/login`, a missing required field, a non-numeric id, a non-object (and a missing) `answers` field — all clean 400s. An oversized (>2MB) body is proven to abort the connection (matching `readBody()`'s `req.destroy()` behavior) rather than being parsed, and — the important resilience assertion — the server is proven to still answer the very next, ordinary request correctly immediately afterward.

**E. `/api/health`.** A real round-trip check (200/ok, correct engine name, no leaked connection string). Engine-conditional beyond that: under `DB_ENGINE=postgres`, the suite drops the disposable database the running server is actually using — a genuine lost connection, not a simulated one — and proves `/api/health` reports 503 with the generic message only, never a raw driver error, connection string, or credential. Under the SQLite default (what a plain local run or `npm test` uses), `db.ready()` is a documented no-op (see `db-sqlite.js`) — there is no live connection to sever, so that half of the suite is a deliberately lightweight, explicitly-labeled regression check instead of a fabricated failure. This mirrors the project's existing, accepted decision to document rather than paper over the SQLite-is-dev/test-only gap (see `docs/phase-7-qa-plan.md` §5).

## What changed to support this

`test/pg-test-support.js` now also exports `dropPostgresDbSync` (previously module-private), so suite E can deliberately sever its own server's database mid-test. This is the one production-code-adjacent change in this workstream — it is test infrastructure, not application code, and it changes no behavior for any existing caller.

## Verification performed

- `node --test test/stage7-deep-qa.test.js` — 33/33 passing, both standalone and as part of the full suite.
- Full suite (`npm test`, the live-DB-guarded runner) — **71/71 passing** (the pre-existing 38 plus these 33), under both the default SQLite engine and `DB_ENGINE=postgres` (a local, disposable Postgres instance started only for this verification run and stopped again afterward — never pointed at anything staging/production).
- `[test-guard] OK — live database unchanged: hash and all 14 table row counts match the pre-run baseline` after every run, both engines.
- No file under `source_library/`, `boardready.db`, or the preservation/export archive was read or written by this work.

## Explicitly out of scope here (unchanged from the standing rules)

No production or staging infrastructure was touched. No question/answer content, `status`, or `answer_status` was read or modified — every fixture question this suite creates is a synthetic, throwaway row in a disposable test database, never the live bank. No UI change. No new product feature — this is test-only.
