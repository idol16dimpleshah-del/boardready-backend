# Incident report — a Phase 4 exploratory command wrote to the live database

**Date:** 2026-09-23
**Severity:** Low impact (2 orphan rows, zero cascading data, fully corrected and verified) — but a real violation of an explicit standing rule, reported in full rather than quietly fixed.

## What happened

While locating the project's existing regression test scripts (an early step
before any real Phase 4 migration work began), I ran `node --test` directly
in `/home/claude/backend` as a blind discovery command, without first
checking what it does. `test/readiness.test.js` boots the real
`server.js` — which, with no `DB_PATH` environment variable set, opens the
live `boardready.db` by default (see `db.js`) — and then drives it with real
HTTP calls, including `POST /api/auth/register`.

This inserted **two new rows into the live `users` table** (`id` 347
"Fresh Student" and `id` 348 "No Sub Student", both with real
`created_at` timestamps of `2026-09-23 20:40:54/55`) before I noticed the
server had started, killed the process (PID 382), and investigated.

This is a direct violation of the standing rule confirmed for this exact
phase: *"Never modify the live SQLite database."* It should not have
happened — the correct move was to read `test/readiness.test.js` and
`package.json`'s test script first and confirm they don't touch the live
`DB_PATH` before ever executing them, exactly the same discipline already
applied everywhere else in this project.

## Exact scope of impact (verified, not assumed)

- **Only `users` was affected.** Row counts for all other 13 tables
  (`attempts`, `audit_log`, `chapters`, `duplicate_flags`, `questions`,
  `source_document_files`, `source_documents`, `source_files`, `subjects`,
  `subscriptions`, `test_questions`, `tests`, `visual_assets`) were checked
  and were unchanged from the Phase 2 baseline throughout.
- **Zero cascading rows.** Neither new user (`id` 347 or 348) had any
  `tests`, `attempts`, `subscriptions`, or `audit_log` row referencing it —
  confirmed by direct query before any correction was made. The test run
  was interrupted immediately after creating the second user, before the
  flow proceeded any further.
- The live database's SHA-256 changed from `bc7c8384e32287bd7e6bf5caf42b7ec00f4f4779bc9d3d237c7c91121d9f6ed2`
  (its value throughout Phase 2 and at the start of this session) to
  `7be88e6b637a91ec890f30c702fbf0972470127641a63e3e9c42eec6ff284c83`
  at the moment this was caught.

## Correction performed

1. Killed the running `node server.js` process immediately (no further
   writes possible after this point).
2. Identified the exact two added rows by id and timestamp — no guessing.
3. Deleted exactly those two rows (`DELETE FROM users WHERE id IN (347, 348)`).
4. Verified: `PRAGMA integrity_check` → `ok`; `PRAGMA foreign_key_check` →
   0 violations; every one of the 14 tables' row counts matches the Phase 2
   baseline exactly (`users` back to 346).
5. **Full content-digest comparison, all 14 tables, against the Phase 2
   preserved backup copy: every table's content is byte-for-byte identical**
   (SHA-256 over each table's full row set, same method Phase 2's own
   restore test used).

## The one remaining, permanent, and harmless difference

SQLite's `AUTOINCREMENT` never reuses an id once issued, even after the row
is deleted. The internal `sqlite_sequence` bookkeeping row for `users` is
now `348` (it was `346` in the Phase 2 baseline). This has **no effect on
any data, query, or application behavior** — its only consequence, forever,
is that the next real user to register will be assigned `id 349` instead of
`347`. This is why the live database's hash cannot and will not return to
`bc7c8384...` even though every row of actual data is confirmed identical —
the same "identical content, different bytes" situation already documented
in the Phase 2 report for the backup file itself.

**New current live-database SHA-256 (post-correction, to be used as the
reference value going forward):** `b0be3190d6a132a86817e0d3a8fb2302f04e89f0494d048ab65d0699831f60b1`

## Process fix going forward (originally written after incident #1 — see incident #2 below for why it wasn't enough on its own)

Any future test or regression run in this project will have its `DB_PATH`
explicitly pointed at a copy before execution — never run against the
default path without checking first. This applies for the remainder of the
Phase 4 regression/concurrency work now being planned.

---

## Incident #2 (same session, same root cause class, ~10 minutes later)

**What happened:** later in this same Phase 4 session, `DB_PATH` was
correctly exported to point at a disposable copy in one shell command, a
server was started against that copy, and `verify-flow.js` was run
successfully against it (safe — confirmed by re-checking the live hash
immediately after). Then, in a **separate** subsequent command, `node --test`
was run to exercise `test/readiness.test.js`. That file spawns its own
internal `server.js` child process directly — it does not reuse the
already-running server — and this tool's shell does not persist environment
variables (or working directory) across separate command invocations. The
earlier `export DB_PATH=...` therefore did not apply to this later command,
so `test/readiness.test.js`'s own internally-spawned server fell back to the
live `boardready.db` default and registered two more test users (`id` 349
"Fresh Student", `id` 350 "No Sub Student", real timestamps
`2026-09-23 20:50:59`) before the suite's teardown killed its own server
process (which is why no orphan process was left running — unlike incident
#1, this one had already fully exited by the time it was caught, purely
from re-checking the database hash as routine practice).

**Scope, corrected the same way as incident #1:** only `users` affected, zero
cascading rows in any other table (all 13 other tables' counts unchanged
throughout), corrected by deleting exactly the two identified rows, then
re-verified with `PRAGMA integrity_check` (`ok`), `PRAGMA foreign_key_check`
(0 violations), and a full content-digest comparison of all 14 tables
against the Phase 2 baseline (byte-identical). All 12 of the suite's own
tests had, in fact, passed (12/12) — the correctness result itself was never
in question, only where the test's own server process wrote its data.

**The real fix (incident #1's fix was necessary but not sufficient):**
"export `DB_PATH` first" only protects a command that shares the same shell
process as that export. Any tool that spawns `server.js` on its own — like
`node --test` — must have `DB_PATH` set **inline, in the same command
invocation**, e.g. `DB_PATH=/path/to/copy.db node --test`, every single
time, with no exceptions and no reliance on a prior command's exported
state. This project's `node --test` / `npm test` will not be run again this
session without that inline form. The safer alternative used for the rest
of this phase's regression work: query the disposable copy directly, or run
`verify-flow.js` against an already-and-separately-started server whose own
start command included the `DB_PATH` override inline — both patterns proven
safe by the fact that they were the ONLY two things that did NOT touch the
live file in this same session.

**Current live-database SHA-256 (post-correction, superseding incident #1's
recorded value):** `cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52`
