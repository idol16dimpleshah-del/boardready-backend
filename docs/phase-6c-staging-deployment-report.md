# Phase 6C — Real Staging Infrastructure: Engineering Readiness Report

**Date:** 2026-09-24
**Scope:** exactly Stage 6C from `docs/phase-6-postgres-cutover-plan.md`, per the account/ownership split established there and reconfirmed by you: **you create/own every external account, billing relationship, and credential; I prepare the engineering and deployment configuration so that handoff is short.**

This is a readiness report, not a completion report — Stage 6C cannot fully complete without the account-creation steps that are explicitly yours to do. Everything that could be prepared without an external account has been prepared and verified below; what's left is listed explicitly under "What is needed from you."

---

## Decisions confirmed with you

- **Hosting platform:** Railway.
- **Managed PostgreSQL:** Railway's own built-in Postgres add-on (same project, one bill).
- **GitHub repository:** you don't have one yet — I've prepared a push-ready checkout (see below) for you to push to a new repo you create.
- **Domain:** Railway's free `*.up.railway.app` subdomain for this first staging pass; a real domain is deferred to production.

## What was built

**1. Two small, genuinely new pieces the cutover plan itself flagged as needed for this stage** (`docs/phase-6-postgres-cutover-plan.md`, Section 7's 6C row):

- **`GET /api/health`** (`server.js`) — a real database-connectivity check, not a static 200: it awaits `db.ready()` (a no-op resolve under SQLite, a genuine `SELECT 1` round-trip under Postgres) and returns `{status:'ok', engine, timestamp}` on success or a `503` on failure. Deliberately unauthenticated and outside the rate limiter (a hosting platform's health checker has no token). This is what `railway.json`'s `healthcheckPath` points at, so Railway can hold a bad deploy back or restart an instance whose database it can't reach, instead of reporting healthy while every real request 500s.
- **Graceful shutdown** (`server.js`) — `SIGTERM`/`SIGINT` handlers that stop accepting new connections, let in-flight requests finish, close the database connection (`pool.end()` under Postgres via a new `db.close()` added to both `db-postgres.js` and `db-sqlite.js`), then exit; a 10-second force-exit timer prevents a hung shutdown from blocking a deploy indefinitely, and a second signal forces an immediate exit. Railway (like every serious hosting platform) sends `SIGTERM` before replacing an instance on every deploy, restart, or scale event — without this, in-flight requests would be cut off mid-response and Postgres connections would be dropped rather than released cleanly.

Both verified directly: a fresh server boot answers `/api/health` correctly under both engines, and a `SIGTERM` produces a clean `shutdown complete` exit with no dangling process, under both engines.

**2. Railway-specific deployment configuration:**

- **`railway.json`** — explicit `NIXPACKS` builder, `npm start` as the start command, `/api/health` as the health-check path, and an `ON_FAILURE` restart policy — so no manual Railway dashboard configuration is needed for the build/deploy behavior itself.
- **`package.json`** — added an `engines.node: ">=22.0.0"` field so Railway's Nixpacks builder provisions the same Node major version this project has been built and tested against.
- **`.env.example`** — updated (it had gone stale: it referenced a hardcoded default secret `config.js` no longer has) and extended with `DB_ENGINE`, `DATABASE_URL`, and `NODE_ENV`, each documented with what Railway does and doesn't need set explicitly (e.g. `PORT` is injected automatically and should never be set manually; `DATABASE_URL` should reference Railway's own Postgres plugin via `${{Postgres.DATABASE_URL}}` rather than being copy-pasted).

**3. A push-ready deployment checkout**, since you don't have a GitHub repository yet: prepared at a separate location (`/home/claude/boardready-staging-deploy`, outside the main project workspace) as a **single clean initial commit** containing everything the running application needs — application code, both test suites, all migration tooling, and all project documentation — with two things deliberately left out:

- **`source_library/`** (~700MB of original source PDFs) — confirmed by reading `server.js`'s static-file-serving code that the running application never reads this directory at request time (it serves `public/` and `extracted-diagrams/` only); including it would make the repository enormous for zero runtime benefit. It has not been touched, moved, or deleted from the main project workspace — it simply isn't part of this *separate* deployment checkout.
- **`backups/`** and any `*.db*` file — local database snapshots and the live database itself, already covered by `.gitignore`, never committed anywhere.

This reduces the deployment checkout from the main workspace's ~1.4GB (mostly `source_library/` and `.git` history) to **5.1MB**. Verified standalone, with no dependency on the main workspace: `npm install` succeeds cleanly (14 packages), `npm test` passes **38/38** against the default SQLite engine in that exact checkout, and a fresh server boot (self-migrating schema) answers `/api/health` and shuts down cleanly on `SIGTERM`.

**4. `DEPLOYMENT.md`**, inside that checkout — the actual handoff runbook, written for you to follow: create the GitHub repo and push (step 1), create the Railway account and project (step 2, the one account/billing step only you can do), add the Postgres plugin (step 3), connect the GitHub repo as a service (step 4), set the four environment variables including a freshly-generated `AUTH_SECRET` (step 5), deploy (step 6), then apply `schema.sql` and run `scripts/stage6b-migrate.js` against the real staging database from a hash-verified copy of the live data (step 7 — explicitly never the live `boardready.db` file directly, matching the same rule enforced throughout Phases 3–6B), with an explicit offer that I can run step 7 myself once you share the staging connection string, since it's the exact same migration tooling already proven deterministic twice in Stage 6B, just pointed at a real remote database.

## What was explicitly NOT touched

Per your instruction to keep infrastructure frozen and not open content/product workstreams during this stage: the 122 known malformed `questions.correct` rows, the UI, and diagram extraction were not touched, discussed as in-scope, or silently addressed. The live SQLite database was not opened for writes at any point (hash `cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52`, unchanged). No account was created, no billing information was entered, and no GitHub repository was created on your behalf — all three are explicitly yours per the split, and I did not attempt to do them even partially.

## Verification performed

1. `node --check` on every changed file (`server.js`, `db-sqlite.js`, `db-postgres.js`) — clean.
2. Full test suite (`node --test test/*.test.js`) re-run after the health-check/graceful-shutdown changes: **38/38 passing under both `DB_ENGINE=sqlite` and `DB_ENGINE=postgres`** — no regression introduced.
3. Manual health-check + graceful-shutdown smoke test against a disposable SQLite file and a disposable local Postgres database: both returned `{"status":"ok",...}` and both shut down cleanly (`shutdown complete`, process exited, no orphan) on `SIGTERM`.
4. The prepared deployment checkout independently verified — `npm install`, `npm test` (38/38), and a live boot/health-check/shutdown cycle — entirely standalone, with zero files copied from or dependent on the main workspace beyond the one-time checkout.
5. Live SQLite hash re-confirmed unchanged after all of the above.

## What is needed from you

Nothing further can be prepared from this sandbox alone. Per the split, the next steps are yours:

1. Create a GitHub repository and push the prepared checkout (`/home/claude/boardready-staging-deploy`) to it — `DEPLOYMENT.md` inside it has the exact commands.
2. Create a Railway account and project.
3. Add Railway's Postgres plugin to that project.
4. Connect the GitHub repo as a service and set the four environment variables listed in `DEPLOYMENT.md` (including generating a real `AUTH_SECRET` — instructions included).
5. Once deployed, share the staging Postgres connection string here if you'd like me to run the schema-apply + data-migration step directly (or run the two documented commands yourself) — either way, this uses only a migrated/disposable copy of the data, never the live SQLite file.

Once staging is deployed and migrated, I'll proceed straight to Stage 6D (the real-browser smoke test against the actual deployed URL) — nothing further needed from you at that point beyond the account access already granted here.
