# Phase 9 — Production-readiness audit (Step 1 of the production-readiness sequence)

**Date:** 2026-09-23
**Scope:** exactly what you specified for step 1 — a read-only audit, no code changes. This document is the deliverable; nothing in `server.js`, `db.js`, or any other runtime file was modified while producing it. It closes out the UI/UX build (Core UX → Feedback system → Practice/Simulation split → Improvement loop → Accessibility → Mobile QA → Visual polish, all ✅) and opens the separate production-readiness track: **audit → preservation/backup verification → staging architecture → Postgres migration test → security hardening → concurrent-user testing → deployment test → launch.**

## Method

Direct inspection of the real, running codebase — not a description of what should be true. Every finding below is grounded in an actual file read, grep, or command run against this repo in its current state, cited by file and line where relevant. No question data, source PDFs, database rows, or application code were touched.

---

## 1. The single most important finding: this project has already lost data to this exact risk once

`db.js`'s own header comment records that "the cloud sandbox that hosted the original working implementation was reclaimed (a documented possibility for long-idle sessions) and its filesystem wiped — including the database, the seed data, and every source file" except three files that survived only because their text happened to still be in a conversation transcript. `RECOVERY_AUDIT.md` (2026-09-17) documents a second, separate scare — a founder belief that a much larger CBSE Science/SST/Maths set had once existed — which turned out to be unrecoverable by any means available in this environment, likely because it lived in a different session or account entirely.

Neither of these is hypothetical risk. This is why your instinct to put **preservation/backup verification before any migration or infrastructure work** is exactly right, and it's the top priority coming out of this audit. Everything else below matters, but this is the one finding that should gate all the others.

## 2. Data integrity & preservation — what exists today

- **The "archive before ingestion" pattern is real and working.** Every `archive-*.js` script (e.g. `archive-cbse-maths-ch1-2.js`) copies an uploaded source PDF into `source_library/<board>/<subject>/` and records a SHA-256 hash, byte size, and metadata in a `source_files` DB table *before* any transcription happens — a genuine, hash-verified safeguard against losing an original mid-work. This is a good pattern already in place; nothing about it needs to change.
- **But it isn't redundant.** `source_library/` (703MB) and `boardready.db` (5.2MB) both live on this one container's disk. There is no evidence anywhere in the repo of a copy existing outside this environment — no cloud storage upload, no git-LFS, no export to a connected service. If this container were reclaimed today, the exact failure from `db.js`'s own history notes would repeat, this time also taking the 703MB of archived source PDFs with it.
- **DB backups exist but are manual and ad hoc, not scheduled.** `backups/` contains exactly two snapshots: `boardready-pre-publication-audit-20260918-053914.db` and `boardready.db.bak-before-phase2-20260922054849` — both one-off, taken before a specific risky operation, not on any recurring cadence. There's no automated daily/hourly backup job, and (per the point above) both snapshots are on the same disk as the thing they're backing up.
- **`.gitignore` correctly excludes `*.db*` and `.env`** — the database is never accidentally committed to git, and neither is a real secret. This is correct and doesn't need to change, but it does mean git itself provides zero disaster recovery for the database (it never has a copy).

**What "preservation/backup verification" (your step 2) should actually verify, when we get there:** that a copy of both `source_library/` and the current `boardready.db` exists somewhere that survives this container being reclaimed — not just that a `backups/` folder exists inside the same container.

## 3. Architecture — what's actually running

- Node.js (v22.22.2) with **zero third-party runtime dependencies** — `package.json` has no `dependencies` field at all; the entire backend (`server.js`, `db.js`, `auth.js`, `scoring.js`, `practice.js`, `readiness.js`, `retest.js`, `diagnostics.js`) is built on Node built-ins only (`node:http`, `node:sqlite`, `node:crypto`). This is a genuine, verified positive: there is no npm supply-chain surface to audit for the production server itself (confirmed — `npm audit` has nothing to check; there's no lockfile because there's nothing to lock).
- `server.js` is a hand-written router (677 lines) over `node:http` — no Express/Fastify/etc. Static files (`public/`) and extracted diagrams are served by custom functions, both with an explicit, correctly-implemented path-traversal guard (`filePath.startsWith(BASE_DIR)`) — checked directly, not assumed.
- Persistence is `node:sqlite`'s `DatabaseSync`, a single synchronous connection to one file (`boardready.db`), explicitly flagged in the codebase's own comments as an experimental Node API. `LAUNCH_STATUS.md` already correctly identifies the SQLite-vs-Postgres decision as unresolved and blocked on a hosting choice — this audit doesn't change that assessment, just confirms it's still accurate.

## 4. Security — what was actually checked, not assumed

**Solid, verified by direct inspection:**
- Every user-facing SQL query in `server.js`/`db.js` uses parameterized `?` placeholders — grepped across the entire runtime codebase, not sampled. No string-concatenated or template-interpolated user input in any WHERE clause found anywhere. No SQL injection surface identified.
- Passwords are hashed with `scrypt` (per-user random salt, 64-byte derived key) and compared with `crypto.timingSafeEqual` — a real, correct, timing-attack-resistant implementation (`auth.js`), not a placeholder.
- Auth tokens are HMAC-SHA256 signed with an expiry claim, verified with `timingSafeEqual` on the signature — well-built for a hand-rolled token scheme.
- Static/diagram file serving has real path-traversal guards, verified above.
- Request bodies are capped at 2MB with the connection destroyed past that limit — a basic but real DoS mitigation already in place.

**Real gaps, not yet addressed (expected at this stage, listed for the hardening phase):**
- **`AUTH_SECRET` has no real value set.** No `.env` file exists in this environment; `auth.js` falls back to the literal string `'dev-only-secret-change-me'`. `.env.example` and `LAUNCH_STATUS.md` both already flag this correctly — it is a hard blocker for any public deployment, not a new finding, but worth restating as the single most load-bearing item in the security-hardening phase.
- **No rate limiting anywhere** — `/api/auth/login` and `/api/auth/register` can be called an unlimited number of times per second with no throttling. Given `scryptSync` is deliberately slow, this is also a CPU-exhaustion vector, not just a brute-force one.
- **No CORS headers are set at all.** Fine today because frontend and backend are served from the same origin; will need explicit attention the moment staging/production splits them across different hosts (e.g. a Vercel frontend + a separately-hosted API).
- **Auth tokens are stored in `localStorage`** (`app.js`), not an `HttpOnly` cookie — a standard SPA tradeoff, but it means any successful XSS on this origin can exfiltrate a student's session. Worth a deliberate decision (keep it and lean on CSP, or move to cookie-based auth) rather than an oversight, before this handles real student accounts at scale.
- **No email verification and no password-strength check** on registration — any string is accepted as a password, any string as an email. Reasonable for the current demo/instant-onboarding product decision; worth a conscious call before public launch.
- **Unhandled (500-level) errors return `err.message` to the client**, not a generic message (`server.js`'s central catch block). Every case actually observed in this codebase throws deliberate, safe messages (e.g. "This attempt was already submitted"), so no real leak was found — but this is a design pattern that will leak internals the day a genuinely unexpected error occurs unless it's tightened.

## 5. Concurrency — what the current model can and can't do

- `node:sqlite`'s `DatabaseSync` is exactly what the name says: synchronous. A DB call blocks Node's single event loop for its duration — under real concurrent load, requests queue rather than crash, but throughput will degrade well before it would with an async driver or a real client-server database.
- No `PRAGMA journal_mode=WAL` and no `busy_timeout` are set — both are cheap, safe, no-schema-change wins that meaningfully help concurrent-read/single-writer behavior, worth doing early in the hardening phase (before, not during, concurrent-user testing, so the test measures the improved baseline).
- The one place a multi-row write matters most — `/api/attempts/:id/submit` — was traced end-to-end: it's a single `UPDATE` statement per submission, not several writes that could be left half-done by a crash. No transactional-integrity bug found there. The two places `BEGIN TRANSACTION`/`COMMIT` do appear in `db.js` are one-time schema-migration blocks that run at process startup, not per-request code.

## 6. Test coverage — the known-good baseline you referenced

This is the one area that's unambiguously in strong shape, and it's real, re-run, and current as of this audit (not carried over from memory):

| Suite | Result just now |
|---|---|
| `verify-flow.js` | exit 0, no unexpected errors |
| `phase2-e2e-test.mjs` | ALL PHASE 2 BACKEND CHECKS PASSED |
| `phase3-backend-test.mjs` | ALL PHASE 3 BACKEND CHECKS PASSED |
| `phase4-backend-test.mjs` | ALL PHASE 4 BACKEND CHECKS PASSED |
| `phase5-backend-test.mjs` | ALL PHASE 5 BACKEND CHECKS PASSED |
| `phase6-keyboard-test.cjs` | 8/8 keyboard-accessibility checks passed |
| `phase6-axe-test.cjs` (light) | 0 WCAG A/AA violations, 6 screens |
| `phase6-axe-dark-test.cjs` (dark) | 0 WCAG A/AA violations, 6 screens |

This is exactly the baseline you described wanting: from here, any regression surfaced by the Postgres migration test, concurrent-user testing, or deployment test can be judged against this known state, rather than argued about.

## 7. Deployment — status unchanged from `LAUNCH_STATUS.md`, re-confirmed

- No git remote is configured (`git remote -v` returns nothing) — this repo has never been pushed anywhere.
- `GITHUB_TOKEN`/`GH_TOKEN` are present in the environment but (per `LAUNCH_STATUS.md`, and unchanged today) not linked to an authenticated GitHub account from this session.
- No Railway/Vercel/Render or other hosting connector is authorized in this session.
- No payment provider (Razorpay or otherwise) is integrated — the `subscriptions` mechanism referenced in the product is a manual/demo activation, not a real payment flow.

None of this needs founder action *right now* — it's simply what remains blocked until later steps in your own 8-step sequence (staging architecture, deployment test).

## Severity summary

**Must resolve before any public launch:** real `AUTH_SECRET`; a preservation/backup story that survives this container being reclaimed (this is step 2, not this step, but it's the most urgent item in the whole audit).

**Should resolve during security hardening (step 5):** rate limiting on auth endpoints; `PRAGMA journal_mode=WAL` + `busy_timeout`; generic 500-error messages to clients; a deliberate decision on token storage (localStorage vs. cookie); CORS policy once frontend/backend may split hosts.

**Worth a conscious product decision, not a bug:** no email verification; no password-strength requirement.

**Confirmed solid, no action needed:** parameterized queries everywhere (no SQL injection surface found); scrypt password hashing with timing-safe comparison; path-traversal guards on both file-serving functions; zero third-party runtime dependencies (no npm supply-chain surface); the archive-before-ingestion content-safety pattern; the full regression/accessibility test baseline, all currently green.

## Explicitly not done in this step

No code was changed. No backup was created, moved, or verified as sufficient — that's step 2. No migration, staging, or deployment work was started. No `.env` file was created (that requires a real `AUTH_SECRET` value, which should come from you, not be generated and stored by this session unreviewed).

## Recommended next step

Step 2 — preservation/backup verification — should focus first on getting a copy of `source_library/` and `boardready.db` somewhere outside this container, since that's the one gap this audit found that mirrors a failure this exact project has already suffered.
