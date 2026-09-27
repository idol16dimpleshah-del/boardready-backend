# Test-database isolation incident — root cause, fix, and verification

**Date:** 2026-09-23
**Status at time of writing:** Phase 4 (SQLite → PostgreSQL migration) paused per an explicit user stop-work instruction, pending everything documented below.

This document exists because the user's instruction was explicit: *"Do not hide the incidents,"* and *"Do not report it as verified based only on successful tests."* It covers both incidents that led to the pause, the exact root cause, what was implemented, and the actual verification performed — not just that tests passed afterward.

For the original moment-by-moment incident narrative (exact timestamps, the specific orphan rows, the manual correction commands run at the time), see `docs/incident-2026-09-23-test-run-touched-live-db.md`, which was written immediately after each incident. This document restates the essential facts but focuses on the part that document explicitly flagged as unfinished: a structural fix, not a process reminder.

## Incident 1 — summary

While locating this project's existing regression scripts, `node --test` was run directly in `/home/claude/backend` as a blind discovery command. `test/readiness.test.js` spawns a real `node server.js` child process; with no `DB_PATH` set anywhere, `db.js`'s only fallback at the time — `process.env.DB_PATH || path.join(__dirname, 'boardready.db')` — opened the **live** database. Two real rows were inserted into the live `users` table (`id` 347 "Fresh Student", `id` 348 "No Sub Student") before the process was caught and killed.

**Affected data:** `users` only, 2 rows, zero cascading rows in any other table (verified by direct query at the time).
**Detected by:** noticing the server had started at all, immediately after running the command — not by any automated check at that point.
**Corrected by:** deleting exactly those two rows, then verifying `PRAGMA integrity_check` (`ok`), `PRAGMA foreign_key_check` (0 violations), and a full SHA-256 content-digest comparison of all 14 tables against the Phase 2 preserved backup (byte-identical).

## Incident 2 — summary

Roughly ten minutes later, in the same session, `DB_PATH` was correctly `export`-ed to point at a disposable copy in one shell command, and a server was started and tested safely against that copy. In a **separate, later** shell command, `node --test` was run again to exercise `test/readiness.test.js`. That file spawns its **own** internal `server.js` child process — it does not reuse whatever server is already running — and this sandbox's shell does not persist exported environment variables across separate tool invocations. The earlier `export DB_PATH=...` was gone by the time this later command ran, so the test's own spawned server fell back to the live database default again, registering two more rows (`id` 349, `id` 350, same names/pattern as incident 1).

**Affected data:** `users` only, 2 rows, zero cascading rows (same verification method as incident 1).
**Detected by:** routine post-run hash checking — a deliberate practice by this point, not luck, and specifically what caught it before this session went on to draw any conclusions from the (silently-corrupted) results.
**Corrected by:** the identical pattern — delete the two identified rows, `PRAGMA integrity_check` (`ok`), `PRAGMA foreign_key_check` (0 violations), full 14-table content-digest match against the Phase 2 baseline.

Both incidents' corrections were independently re-verified; live application data was never actually lost or left in a genuinely uncertain state. What was wrong was the *process*, not (after correction) the data — which is exactly why the user's stop-work instruction drew the line where it did: **"the data is back to identical" is not the same as "the process is safe."**

## Exact root cause (the execution path, traced and confirmed)

Both incidents are the same failure, occurring through the same two code paths, differing only in *which* ambient state was missing:

1. **`test/readiness.test.js` line ~22 (before this fix):** `const db = require('../db');` at module top level. This runs in the **main test-runner process** the instant the file is loaded — before any test body executes, before any `before()` hook runs — and unconditionally opens whatever `db.js` resolves `DB_PATH` to.
2. **`test/readiness.test.js`'s `before()` hook (before this fix):**
   ```js
   serverProcess = spawn('node', ['server.js'], {
     cwd: path.join(__dirname, '..'),
     env: { ...process.env, PORT: String(PORT) },
     stdio: 'pipe',
   });
   ```
   This spawns a **second, independent process** running the real `server.js`, which itself does `require('./db')`. Its environment is `{ ...process.env, PORT }` — everything ambient in the parent's environment, plus `PORT`. Nothing here ever set or required `DB_PATH`.
3. **`db.js`'s only fallback (before this fix):**
   ```js
   const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'boardready.db');
   ```
   The single point, reached by both (1) and (2) above, with zero awareness of "am I running inside a test." If `DB_PATH` was unset — for any reason, in either process — this line opened the live file, silently and by design (that's the correct behavior for the *default*, non-test case: starting the real app with no override).

Incident 1: nothing set `DB_PATH` anywhere in the shell → live default used in both the test-runner process and the spawned server.
Incident 2: `DB_PATH` **was** set correctly, but in a shell command that ended before the later, separate command that ran `node --test` began — this sandbox's tool-call boundaries do not preserve shell state (confirmed: `export` in one Bash tool call is gone in the next one, even though the working directory persists). The spawned server's `{ ...process.env, PORT }` therefore inherited an environment with no `DB_PATH` again, for a different underlying reason than incident 1, landing on the exact same fallback line.

**Grep-confirmed scope:** `test/readiness.test.js`'s single `spawn('node', ['server.js'], ...)` call was, at the time, the *only* real child-process spawn (`spawn(`/`exec(`/`fork(`) anywhere in the entire backend — every other match on those strings was `db.exec(...)` (SQLite statement execution) or `regex.exec(...)` (the router in `server.js`), confirmed line-by-line. There was exactly one door this could happen through, and it was found through both incidents independently landing on it.

## Why the existing test setup allowed this

There was no test-mode concept anywhere in the codebase. `db.js` had one fallback line that served both "a developer starting the real app with no special configuration" and "a test run" identically — there was no way for it to distinguish the two, and no way for it to refuse the second case while still allowing the first. The test file assumed its own spawned child process would inherit a safe environment without ever stating what "safe" meant or supplying it explicitly. Nothing failed loudly; the unsafe path was also the silent, "it just works" path, which is precisely backwards for a database write.

## Permanent prevention implemented

Three independent, structural layers — deliberately not "be careful," per the user's explicit requirement that "the system must make the unsafe operation difficult or impossible":

### 1. `db.js` — a fail-closed test-database guard (structural, not opt-in)

`db.js` now detects "is this a test context" two independent ways:
- `NODE_ENV === 'test'` (the conventional signal, now set explicitly by this project's test files and its `npm test` script), **or**
- `process.env.NODE_TEST_CONTEXT` is set — empirically confirmed in this environment (Node v22.22.2) to be set by Node's **own built-in test runner**, in every process it runs a test file in, with zero configuration required from this project. This is what makes the guard trip even for a bare `node --test` run by someone who set up nothing at all — it does not depend on this project's own test files remembering to do anything.
- (`process.argv`/`process.execArgv` containing `--test` is also checked, as a harmless third layer, though empirically Node consumes that flag before argv is built, so in practice `NODE_TEST_CONTEXT` is what actually fires.)

When a test context is detected:
- If `DB_PATH` is unset or empty → **throws immediately**, refusing to open any database at all. The error message states plainly that there is no default test database and none will ever be assumed.
- If `DB_PATH` is set but resolves (via `path.resolve`) to the live database path, to anything under `backend/backups/`, or to anything under `/home/claude/preservation/` → **throws immediately** with the same refusal. An explicit-but-wrong path is treated as unsafe as no path at all.
- Only a `DB_PATH` that is both present and resolves outside every forbidden path is opened.

Outside a test context, behavior is unchanged from before this fix: `DB_PATH` overrides the default when set (used deliberately throughout Phases 2–4 for disposable copies), defaulting to the live database otherwise — this is the correct, intended behavior for real application startup and is not touched by this fix.

`db.js` also now exposes `db.DB_PATH`, `db.LIVE_DB_PATH`, and `db.IS_TEST_MODE` on the exported database handle, so any test or script can assert or print which database is actually live, per the requirement that a run be able to show `LIVE DATABASE: <path>` / `TEST DATABASE: <path>`.

### 2. `test/readiness.test.js` — explicit, self-contained configuration (never inherited)

- At the very top of the file — before requiring `../readiness`, `../diagnostics`, or `../db` (all of which resolve `DB_PATH` the instant they're required) — the file now does:
  ```js
  const TEST_DB_PATH = path.join(os.tmpdir(), `boardready-readiness-test-${process.pid}-${Date.now()}.db`);
  process.env.NODE_ENV = 'test';
  process.env.DB_PATH = TEST_DB_PATH;
  ```
  This makes the file self-contained: it no longer matters whether it's invoked via `npm test`, a bare `node --test`, or anything else, or what the invoking shell's environment happens to contain.
- The file then asserts, at require time, that `db.DB_PATH !== db.LIVE_DB_PATH` and that `db.IS_TEST_MODE` is true — so a future change that accidentally collapsed the two back together fails this suite immediately and loudly, rather than silently reopening the hole.
- The spawned `server.js` child process's `env` now explicitly includes `NODE_ENV: 'test', DB_PATH: TEST_DB_PATH` — stated directly, not merely inherited via `...process.env`. This is the exact line responsible for both incidents; it is no longer possible for this spawn to omit `DB_PATH` regardless of what the parent's ambient environment looks like.
- `after()` now cleans up the throwaway test-database file (best-effort; never fatal, since it's a uniquely-named `/tmp` file, never the live database or anything preserved).
- A minor, unrelated side effect of true isolation surfaced here and was fixed honestly rather than worked around: one integration test looked up a CBSE "Mathematics" subject by name, which had always silently worked because the test, before this fix, was really running against the live database's real seeded data. Against a genuinely empty, isolated test database that lookup returned nothing. Fixed by seeding that one minimal fixture row directly via `db` in `before()` — not by reintroducing any dependency on shared or live data.

### 3. `scripts/run-tests-with-live-db-guard.js` — a live-database-immutability safety net (the backstop, not the mechanism)

Per the user's explicit framing — *"This is a safety net, not a substitute for isolation"* — `npm test` now runs through a wrapper that:
1. Hashes (SHA-256) the live database file and counts every row in all 14 tables, **before** running anything.
2. Runs the real suite (`node --test 'test/*.test.js'`, scoped explicitly to `test/` — see the note below on why).
3. Hashes and re-counts the live database **after**.
4. Fails the entire run — regardless of whether every individual test passed — if the hash or any row count differs at all.

This exists specifically because incident 2 involved a test run where **all 12 tests passed** while quietly writing to the live database; a green test suite was never proof that isolation held, and this wrapper checks the one fact that actually matters independent of what any test itself reports.

`package.json`'s `test` script now runs this wrapper (`node scripts/run-tests-with-live-db-guard.js`); a `test:raw` script remains for directly invoking the bare suite when debugging the runner itself, without the safety net.

**Also found and fixed while building this:** a bare `node --test` (no path argument) recursively scans the entire working directory for anything matching its default filename patterns — verified empirically that it picked up `docs/phase-4-migration-validation-artifacts/concurrency-test.js` purely because its filename ends in `-test.js`, and tried to execute that standalone Postgres script as if it were a `node:test` file. Both the wrapper script and `package.json`'s `test:raw` now scope discovery explicitly to `'test/*.test.js'`. Separately, the safety-net wrapper itself lives under `scripts/`, not `test/` — `node --test` was confirmed to auto-run **any** `.js` file directly inside a directory literally named `test`, regardless of filename pattern, which would have caused the wrapper (which itself spawns `node --test`) to recursively re-invoke itself if it had been placed there.

## Migration scripts (item 9 of the isolation spec)

Checked directly: `docs/phase-3-migration-artifacts/migrate.js` (the actual Phase 3/4 migration tooling) never reads `DB_PATH` or any other environment fallback at all — its SQLite source is a hardcoded, `__dirname`-relative path to a disposable copy file (`sqlite-copy-for-migration-test.db`). It has no code path that can resolve to the live database, by construction, because it was never given one. This already satisfies the spirit of "a migration command without an explicit source should fail" — there is no implicit-source code path to fail from in the first place.

## Verification actually performed (not just "tests passed")

Per the explicit instruction not to report this as verified based only on successful tests, every step below was run and its output independently re-checked, not assumed:

1. **Live baseline, freshly re-captured before any of this work:** SHA-256 `cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52`; all 14 tables' row counts recorded (`users` 346, `subjects` 5, `chapters` 79, `questions` 4946, `source_documents` 152, `source_files` 124, `source_document_files` 289, `visual_assets` 161, `duplicate_flags` 409, `tests` 317, `test_questions` 3128, `attempts` 309, `subscriptions` 3, `audit_log` 237).
2. **Negative test — test context, no `DB_PATH`:** `NODE_ENV=test node -e "require('./db')"` → threw immediately, refusing to open anything. Separately, a bare `node --test` (no `NODE_ENV` at all, relying solely on Node's own `NODE_TEST_CONTEXT` signal) against a throwaway probe file that just requires `db.js` → also threw immediately, and the whole test run reported failure (exit code 1).
3. **Negative test — test context, `DB_PATH` pointed at a forbidden path:** tried the live path, the `backups/` copy, and a file under `/home/claude/preservation/` — all three refused with an explicit error naming the resolved path.
4. **Positive test — test context, correct `DB_PATH`:** opened successfully, `db.IS_TEST_MODE` true, `db.DB_PATH` reported the isolated path.
5. **Full suite via `npm test`:** 12/12 tests pass.
6. **Live database re-verified immediately after that run — independently, not just via the wrapper's own self-report:** SHA-256 unchanged (`cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52`), all 14 row counts unchanged, `PRAGMA integrity_check` → `ok`.
7. **Test database actually receives real writes:** confirmed manually — inserting rows against an isolated `DB_PATH` created a genuine, separate SQLite file (hash-distinct from the live file), which was then discarded, with the live file's hash re-checked as unchanged afterward.

## Known, named residual gap (not hidden)

The spawned `server.js` child process is only protected by the environment `test/readiness.test.js` explicitly constructs for it (layer 2 above). If a future edit to that spawn call removed the explicit `NODE_ENV`/`DB_PATH` and reverted to `{ ...process.env, PORT }` alone, and that removal also somehow evaded `db.js`'s own `NODE_TEST_CONTEXT` detection (it would not — the child process's `db.js` load would still see `NODE_TEST_CONTEXT` if the test runner's own env var propagated to it via the spread, or would fail closed if it didn't propagate and no `DB_PATH` was set either way) — layer 1 alone is not proof against every conceivable future edit. This is exactly why layer 3, the live-database-immutability safety net, exists independently: it does not trust any of the above and checks the live file's actual bytes and row counts regardless of what any other layer claims.

## Checklist (per the stop-work spec, Section 15)

- [x] Live SQLite baseline verified
- [x] Root cause identified
- [x] Dedicated test database implemented
- [x] Test mode fails closed
- [x] Migration scripts fail closed (verified already true by construction — no implicit-source path exists in `migrate.js`)
- [x] Child processes use isolated DB
- [x] Deliberate unsafe-start test fails correctly
- [x] Full test suite passes against test DB
- [x] Live database hash unchanged after tests
- [x] Live database row counts unchanged
- [x] Incident documented (this file)
- [x] No production data modified (during any of this isolation work — the two 2026-09-23 incidents that motivated it are documented above and in `docs/incident-2026-09-23-test-run-touched-live-db.md`, both corrected and re-verified before this work began)

## Final status

**TEST DATABASE ISOLATION: VERIFIED**
