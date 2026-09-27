# Phase 6 — PostgreSQL Application Cutover: Implementation Plan (read-only, before any code change)

**Date:** 2026-09-24
**Naming note:** this project has an older, unrelated documentation series that also used the "Phase 6" label (`docs/phase-6-accessibility-report.md`, a UI/UX polish phase from earlier work). This document is a **different** Phase 6 — the infrastructure-track phase now underway (Phase 0 Audit → ... → Phase 5 Security → **Phase 6 Staging**). No relation to the accessibility report; mentioned once here to prevent confusion, not referenced again below.

**Instruction this document answers:** *"Before implementation, list the SQLite-specific dependencies, affected modules, PostgreSQL approach, tests, rollback strategy and estimated work by stage. Then execute sequentially with verification gates."* Nothing in this document has been implemented yet — it is grounded entirely in (a) actually reading the current codebase today (not relying on Phase 3/4's catalog alone, since Phase 5 added new files since then), and (b) the migration design, schema, and proofs Phase 3/4 already built and validated (`docs/phase-3-migration-design-report.md`, `docs/phase-4-migration-validation-report.md`, and their artifact directories).

---

## 0. Sandbox capability check (why 6A/6B don't need to wait on anything)

Checked directly in this environment before writing this plan, not assumed:
- **PostgreSQL 16 server and client are already installed** (`postgresql-16`, `postgresql-client-16` — confirmed via `apt list --installed`), currently stopped (`pg_lsclusters` shows the `16/main` cluster `down`, startable with `service postgresql start`).
- **The `pg` npm package (v8.23.0) is reachable** from the npm registry this session's proxy allows (`npm view pg version` succeeded); it is not currently installed anywhere in this project (`node_modules` doesn't exist here yet, `pg` was previously used only as scratch tooling for Phase 3/4's proof scripts, never added to `package.json`).
- **This means Stage 6A (the code rewrite) and Stage 6B (the regression gate against an isolated PostgreSQL database) can both run entirely inside this sandbox, right now, with no external account of any kind.** Only Stage 6C (real staging deployment, reachable from the internet) needs anything from you.

---

## 1. Inventory of SQLite-specific dependencies (re-verified against the current codebase, 2026-09-24)

Phase 3's Section 9 catalog (2026-09-23) is still the right shape, but it predates Phase 5's new files (`config.js`, `rate-limit.js`, `security-headers.js`) and didn't enumerate every call site by file. Re-counted directly against the code as it stands today:

| File | `db.prepare()` call sites | Notes |
|---|---|---|
| `db.js` | 7 | schema creation, `PRAGMA` (10 uses), additive `ALTER TABLE` migrations (6 `BEGIN/COMMIT` transaction uses for the two CHECK-widening table-rebuilds), 12 `datetime('now')` defaults |
| `server.js` | 28 | every route handler; 2 `lastInsertRowid` reads (register, `/api/attempts`), 2 raw `datetime('now')` writes (autosave, check-lock timestamps) |
| `practice.js` | 11 | test/attempt generation; 2 `lastInsertRowid` reads (`generate`, `generateImprovementTest`) |
| `readiness.js` | 3 | see new finding below |
| `diagnostics.js` | 1 | one large query, many camelCase aliases (below) |
| `content-rules.js` | 1 | `resolveChapterIds` |
| **Total** | **51** | |

**Two concrete finding categories, re-confirmed and, in two cases, newly discovered beyond what Phase 3/4 tested:**

1. **Camel-case SQL aliases** (silently fold to lowercase under `pg`, breaking every `r.propertyName` read) — Phase 3/4 only actually *tested* one query (`/api/content/summary`'s `subjectCount`/`chapterCount`/`questionCount`). Re-scanning every runtime file directly surfaces **two more affected queries Phase 3/4 never ran a proof against**:
   - `server.js`'s `GET /api/attempts/me` query (~line 549–553): `id, testId, startedAt, submittedAt, score, maxScore, timeExceededSeconds, subjectId, subjectName, board, kind, chapterId, chapterName, subConcept, durationSeconds, feedbackMode` — 15 camelCase aliases in one query.
   - `readiness.js`'s `speedComponent` query (line ~120): `timeExceededSeconds, durationSeconds`.
   - `diagnostics.js`'s main query (~line 22–24): `attemptId, testId, submittedAt, answersJson, subjectId, subjectName, qid, chapterId, chapterName, subConcept`.
   All of these would silently return `undefined` for every one of those properties under an unmodified `pg` connection — not a hypothetical, the exact same mechanism Phase 3/4 already proved on the one query they tested.
2. **`COUNT(...)` returned as a string, not a number** — Phase 3/4 tested and fixed exactly one site (`/api/content/summary`). Re-scanning surfaces **two more, in `readiness.js`'s `syllabusCoverageComponent`** (`totalChapters`, `totalBandsInBank`), both fed into arithmetic and comparisons. One of these is worse than a silent wrong number: `totalBandsInBank` is computed as `... .n || 1` — intended as "default to 1 if the count is legitimately zero," but a `pg`-driver string `"0"` is *truthy* in JavaScript, so that fallback would **never fire**, silently changing real zero-count behavior, not just producing a wrong type. This is exactly the kind of thing that only surfaces by actually reading every call site, not by re-running the one query already tested.

**Other cataloged dependencies (unchanged from Phase 3's findings, re-confirmed present):**
- `lastInsertRowid` → needs `RETURNING id`: 4 sites total (`server.js` register + `/api/attempts`; `practice.js` `generate` + `generateImprovementTest`).
- Positional `?` placeholders throughout all 51 call sites → need `$1, $2, ...` for `pg`.
- Every currently-synchronous DB-touching function becomes `async`/`await`-based. Route handlers in `server.js` are already `async` (they already `await readBody(req)`), so callers mostly don't change shape — only their bodies gain `await` at each DB call.
- `db.js`'s own `PRAGMA table_info(...)`-driven additive-migration pattern (the two CHECK-widening table-rebuild blocks) has **no PostgreSQL equivalent to port** — Postgres can `ALTER TABLE ... DROP CONSTRAINT` / `ADD CONSTRAINT` directly, and `schema.sql` already bakes in the *final* shape of every column, so this entire pattern is retired, not translated.
- The circular foreign key (`tests.improves_attempt_id` ↔ `attempts.test_id`) — already solved and twice-proven in `schema.sql` via `DEFERRABLE INITIALLY DEFERRED` + `SET CONSTRAINTS ALL DEFERRED` during bulk load (Phase 3 §3, Phase 4 §2B.3). Reused as-is.
- Row-locking/concurrency — Phase 4's `concurrency-test.js` proved, at the database layer only, that `/api/attempts/:id/check` and `/api/attempts/:id/answers`'s read-modify-write of `locked_answers_json`/`draft_answers_json` needs `SELECT ... FOR UPDATE` inside a transaction (25/25 correct with it, 1/25 without). This has not yet been wired into the real `server.js` handlers — that's 6A/6B scope, not done yet.
- Timestamps: `TIMESTAMPTZ` columns come back from `pg` as real JS `Date` objects — the one manual `attempt.started_at.replace(' ', 'T') + 'Z'` workaround in `server.js` must be removed at cutover (leaving it in would double-convert a `Date` object and throw).

**Confirmed NOT a dependency (checked, not assumed):** `scoring.js`, `retest.js`, `retest-config.js`, `readiness-config.js`, `diagnostics-config.js`, `auth.js`, `config.js`, `security-headers.js`, and `rate-limit.js` do not touch the database at all (`retest.js`'s apparent `.get()` calls are plain JS `Map.get()`, not DB calls; `rate-limit.js`'s one mention of `node:sqlite` is a comment, not a `require`). None of these need any change for the cutover.

---

## 2. Affected modules

**In scope for the Stage 6A rewrite** (the 6 files above: `db.js`, `server.js`, `practice.js`, `readiness.js`, `diagnostics.js`, `content-rules.js`) — these are the entire set of files that ever touch the database in the live request-serving path.

**Explicitly out of scope, and why:**
- `scoring.js`, `retest*.js`, `readiness-config.js`, `diagnostics-config.js`, `auth.js`, `config.js`, `security-headers.js`, `rate-limit.js` — pure logic / no DB access, confirmed above.
- **Every `archive-*.js`, `ingest-*.js`, `backfill-*.js`, `reclassify-*.js`, and `fix-*.js` script at the repo root** (~90 files) — these are one-time content-ingestion/correction tools that already ran, once, against the live SQLite database in the past. Per this project's standing rule ("never re-ingest completed sources," "never re-run completed archival/ingestion work"), none of these will ever run again, against SQLite or PostgreSQL. Porting them is not part of this cutover and is not recommended — if future content ingestion is ever needed again, that's a separate, later decision about whether new ingestion targets PostgreSQL directly, made on its own terms, not assumed here.
- `seed.js` — an early bootstrap script (59 hand-typed questions) from before the real ~4,946-question bank existed via ingestion. **Not** the right tool to populate a staging database — the correct tool is Phase 3/4's already-built-and-twice-validated `migrate.js`, which moves the real preserved content (minus the 122 known-excluded rows, unchanged) into PostgreSQL deterministically. `seed.js` is superseded for this purpose, not ported.
- `verify-flow.js`, `audit-publication-readiness.js`, `generate-source-library-md.js`, `debug-dup.js` — manual developer-time tools, not part of the request-serving runtime. `verify-flow.js` specifically *will* be re-run (unmodified) against the PostgreSQL-backed server as part of Stage 6B's verification, exactly as it already is against SQLite — but the tool itself needs no code change, since it only talks to the server over HTTP.

---

## 3. PostgreSQL approach

**3.1 Dependency decision.** This project's zero-runtime-dependency stance has always been about not reaching for a library where Node's stdlib already does the job well (e.g., hand-rolled HMAC tokens instead of a JWT package). Speaking PostgreSQL's wire protocol is not that kind of case — there is no reasonable hand-rolled alternative. `pg` (the `node-postgres` project) becomes this application's first real runtime dependency, added explicitly and named here, not silently. It is already what Phase 3/4's own validated proof scripts used.

**3.2 Keep the call-site shape, swap what's underneath.** Rather than hand-rewriting all 51 call sites to a different calling convention, `db.js` is rebuilt to preserve the exact shape callers already use — `db.prepare(sql).get(...args)` / `.all(...args)` / `.run(...args)` — but backed by a `pg.Pool` and returning Promises. This keeps the diff at each of the 51 sites almost entirely mechanical (add `await`, since every caller is already inside an `async` function), instead of a second, riskier rewrite of call-site syntax everywhere. Concretely, the new `db.js` exports a `prepare(sql)` that:
   - translates `?` positional placeholders to `$1, $2, ...` once, internally (a single small function, not per-call-site logic);
   - runs the query via the pool;
   - `.get()` returns the first row or `undefined`; `.all()` returns all rows; `.run()` returns `{ lastInsertRowid, changes }` **by automatically appending `RETURNING id`** to any `INSERT` whose caller asks for `.lastInsertRowid` — preserving the existing 4 call sites unchanged rather than hunting down and hand-editing each one's SQL text.
   - **Every camelCase alias gets fixed at the SQL-text level** (`AS "subjectId"`, double-quoted, right in the query strings across the 3 affected files/4 queries cataloged in Section 1) rather than reused via Phase 4's `pg-compat-shim.js` alias-map approach — the shim was a fast way to *prove* the finding on one query; hand-maintaining an alias map for every one of ~30 aliases across 4 queries going forward is more error-prone than just quoting the identifiers so Postgres preserves the case natively. The 2+2 `COUNT(...)` sites get an explicit `::int` cast in the SQL (not a JS-side `Number()` shim), for the same reason — fixed at the source, not patched around.
   - Transactions (`db.js`'s own migration blocks; none needed post-cutover, see Section 1) and the two read-modify-write endpoints get real transaction support: `POST /api/attempts/:id/check` and `PATCH /api/attempts/:id/answers` wrap their read-then-write in a single client checked out from the pool, `BEGIN` → `SELECT ... FOR UPDATE` on the target `attempts` row → the existing logic unchanged → `UPDATE` → `COMMIT`, exactly matching the pattern Phase 4's `concurrency-test.js` already proved closes the lost-update race (25/25 vs. 1/25).

**3.3 A new test-database-isolation guard, for Postgres, built now — not assumed to carry over.** The existing SQLite guard (`db.js`'s fail-closed check, `docs/test-database-isolation-incident.md`) is entirely file-path-based (`DB_PATH`, `FORBIDDEN_TEST_DB_PATHS`). That mechanism does not apply to a network database identified by a connection string/database name, and this project has already had two real incidents from exactly this class of gap being assumed rather than built. The Postgres-mode `db.js` gets its own equivalent, same fail-closed philosophy: in a detected test context (`NODE_ENV=test` / `NODE_TEST_CONTEXT` / `--test` flag — same three-way detection already used), it requires an explicit `DATABASE_URL` whose parsed database name is not on a small denylist (initially just the literal names `boardready` / `boardready_production` / `boardready_staging` — extended the moment a real staging/production database name is chosen in Stage 6C) and refuses to connect otherwise. Built in Stage 6A, exercised for real in Stage 6B — not deferred.

**3.4 Rollback-friendly, not a one-way door.** `db.js` gains a `DB_ENGINE` switch (`sqlite` default-preserved for now during development of this change, `postgres` once cutover is decided) rather than deleting the SQLite code path outright. This directly implements the rollback strategy Phase 3 already designed (§10): reversing a PostgreSQL cutover is "point `db.js` back at `node:sqlite`," which only stays true if that code path still exists. Both engines expose the identical `prepare().get/.all/.run()` shape to callers, so no route-handler code needs to know or care which engine is live.

**3.5 Object storage.** Per your architecture diagram, out of scope for this document's code changes — today's `visual_assets`/`source_files` tables only store *paths* to files on disk (`archive_path`, `asset_path`); the actual bytes live under `source_library/`/`extracted-diagrams/`, untouched by this migration (Phase 3 §4 already confirmed this explicitly). Object storage only becomes a real, separate decision at Stage 6C, when "a real host" means those local paths need to resolve to something reachable from that host too — noted in Section 6 below as one of the account/service decisions for Stage 6C, not a 6A/6B code change.

---

## 4. Tests (Stage 6B — the regression gate)

Run entirely inside this sandbox, against an isolated local PostgreSQL database, never the live SQLite file:

1. **Reuse Phase 3/4's `migrate.js` unmodified** to populate a fresh, dedicated PostgreSQL test database from a hash-verified copy of the live SQLite data — real content (4,824 of 4,946 questions, the 122 known-excluded rows still excluded and still unchanged), not synthetic fixtures, so the regression gate exercises real-shaped data.
2. **The entire existing 31-test suite** (`test/readiness.test.js`, `test/security.test.js`) run unmodified against the PostgreSQL-backed server — the tests talk to the server over HTTP exactly as they do today; only the environment variables the spawned `server.js` child process receives change (`DB_ENGINE=postgres`, `DATABASE_URL=...` pointing at the isolated test database, instead of `DB_PATH`). If any of the 31 fail, that's a real cutover bug to fix before proceeding, not a test to relax.
3. **New PostgreSQL-specific tests**, added to `test/`:
   - The row-locking fix, proven at the **HTTP level** this time (Phase 4's `concurrency-test.js` proved it at the raw database-client layer only) — N concurrent `POST /api/attempts/:id/check` calls against the same attempt, asserting zero lost updates, mirroring the 25-simultaneous-request scenario.
   - Every camelCase-alias query from Section 1 (`GET /api/attempts/me`, the readiness `speedComponent`/`syllabusCoverageComponent` paths, the diagnostics summary) asserted to return real camelCase properties with correct JS types (`number`, not `string`) — regression coverage for the two newly-found gaps, not just the one Phase 3/4 already tested.
   - The circular-FK-dependent flow: creating an "Improve My Score" test (`tests.improves_attempt_id` pointing at a real `attempts` row) end-to-end through the real API, not just the raw migration/schema test Phase 3/4 already ran.
   - The Postgres test-isolation guard itself (Section 3.3) — a deliberately-wrong `DATABASE_URL` in a test context must refuse to connect, mirroring the existing SQLite guard's own test coverage.
4. **`verify-flow.js`**, unmodified, against the PostgreSQL-backed server (it already only talks over HTTP).
5. **`scripts/browser-smoke-check.js`**, unmodified, against the PostgreSQL-backed server — the same real-browser walkthrough (registration → Practice → Board Simulation → Improve My Score → logout/login) that already proved the CSP clean against SQLite, re-run to confirm the cutover changes nothing observable end-to-end.
6. Throughout all of the above: **the live SQLite database's SHA-256 checked before and after**, exactly as every phase before this one has done — this stage adds a *new* database engine to test against, it does not relax any existing guarantee about the old one.

---

## 5. Rollback strategy

- **Primary safety net, unchanged from Phase 3's design:** the live SQLite file remains untouched, byte-identical, for the entire duration of this phase — verified before and after every stage, exactly as every prior phase in this project has done. It is not archived, not deleted, not relied upon less because PostgreSQL now exists alongside it.
- **Code-level rollback:** the `DB_ENGINE` switch (Section 3.4) means reverting a bad cutover is a configuration change (`DB_ENGINE=sqlite`, restart), not a code revert — both engines' code stays present and working until a deliberate later decision to remove the SQLite path (not part of this plan; a future cleanup decision, made once PostgreSQL has run in production long enough to trust removing the fallback).
- **Staging-level rollback (Stage 6C):** staging runs on its own disposable PostgreSQL instance populated only from a migrated copy — nothing staging does can affect the live SQLite data or (once it exists) a separate production PostgreSQL database. Tearing down and recreating staging from scratch via `migrate.js` is always available and cheap.
- **Data rollback:** because `migrate.js` is deterministic (proven twice, byte-for-byte identical, Phase 4 §1) and id-preserving, any PostgreSQL environment (test, staging, eventually production) can always be recreated from a fresh SQLite snapshot on demand — there is no one-way data transformation anywhere in this design.

---

## 6. Inventory of external accounts/services (Stage 6C only — nothing above needs any of these)

Per your split: you handle account creation/billing/linking, I prepare everything so that handoff is short and well-defined. What Stage 6C will need from you, when we get there (not now):
1. **A hosting account** for the Node API + frontend (Railway, Render, Fly.io, or similar — your architecture diagram doesn't mandate a specific one; happy to prepare deployment config for whichever you prefer, or default to Railway since it was already mentioned in earlier launch-readiness discussion, pending your confirmation).
2. **A managed PostgreSQL instance** — either the same hosting platform's built-in Postgres add-on (simplest, one bill, one dashboard) or a separate managed provider (Neon, Supabase, RDS, etc.) if you prefer to decouple compute from data. No strong recommendation yet — this is a real product decision (cost, backup policy, region) more than a technical one.
3. **A GitHub repository** — you'll create it and share the URL (per your answer above); I'll make sure this repo is push-ready (clean history, nothing secret committed, a proper `.gitignore`) before that handoff.
4. **A domain or subdomain** — optional for a first staging pass; most hosting platforms issue a free `*.up.railway.app`/`*.onrender.com`-style subdomain that's sufficient for staging. A real domain only matters starting at production.
5. **Object storage**, only if Stage 6C's staging host can't simply serve `source_library/`/`extracted-diagrams/` from local disk the way this sandbox does today (likely: needs an S3-compatible bucket or the platform's own volume/storage product — decided once the hosting platform is picked, since the right answer depends on what that platform offers).

None of these block Stage 6A or 6B, which start now.

---

## 7. Estimated work by stage (not compressed into the original 3-day staging-infrastructure estimate, per your explicit instruction)

| Stage | What | Needs from you | Rough size |
|---|---|---|---|
| **6A** | PostgreSQL application adapter: new `db.js` (dual-engine), `pg` added as a dependency, all 51 call sites converted to `await`, ~4 camelCase-alias queries fixed at the SQL level, 4 `RETURNING id` sites, 2 `COUNT` casts, row-locking added to `/check`/`/answers`, Postgres test-isolation guard built | Nothing — runs entirely in this sandbox | Real, multi-day engineering (matches Phase 3's original estimate) — not a mechanical schema swap |
| **6B** | Regression gate: migrate real data into an isolated test Postgres, run all 31 existing tests + new Postgres-specific tests + `verify-flow.js` + the browser smoke check, all against Postgres; live SQLite hash re-verified throughout | Nothing — runs entirely in this sandbox | Follows immediately after 6A; mostly running and fixing what the gate surfaces |
| **6C** | Actual staging deployment: hosting account, managed Postgres, environment secrets, HTTPS, the existing CORS/health/logging/graceful-shutdown work (some of which — CORS, security headers — Phase 5 already built; a few pieces, like a dedicated health endpoint and graceful shutdown, are genuinely new and small) | Hosting account + managed Postgres + GitHub repo + (optional) domain — Section 6 | Short once 6A/6B pass and accounts exist — mostly configuration, not new engineering |
| **6D** | Real-browser staging smoke test against the actually-deployed staging URL (not localhost) — the same checklist already proven locally in 6B, re-run against the real deployment | Nothing beyond the account access already granted for 6C | Quick — reruns proven tooling against a new URL |

**Explicit acknowledgment, matching your instruction:** 6A alone is comparable in scope to what Phase 3 originally called "real, multi-day engineering... the reason this project's own 12–15 working day estimate treats [the cutover] as multi-day, not a single afternoon." This plan does not compress that into the original 3-day window.

---

## 8. Constraints honored (restated explicitly, checked against every section above)

No UI redesign, no new product features, no changes to `source_library/` or any preserved archive, no modification of the live SQLite database at any point in 6A/6B, no silent promotion or reclassification of the 122 known malformed `questions.correct` rows (they remain excluded from migration, exactly as Phase 3/4 left them — this phase does not revisit that content-QA decision). Staging (6C) will use only migrated/disposable data, never the live SQLite file directly.

---

## Immediate next step

Nothing is needed from you to begin. Stage 6A starts now, inside this sandbox, with the local PostgreSQL 16 instance already installed here. I'll report back — what was completed, what was verified, what remains, and (starting only at the 6C boundary) exactly what I need from you — at each stage gate, as instructed.
