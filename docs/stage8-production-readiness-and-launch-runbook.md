# Stage 8 — Production readiness checklist and launch runbook

**Date:** 2026-09-24
**Status:** Preparation document. Nothing in this file authorizes or performs a deployment — see "What this document is not" below. Workstream 2 of 4 in the "work ahead of Railway" plan.

## Relationship to the two older documents with adjacent names

This repository has two numbering tracks that happen to collide on "Phase 8" and "Phase 9":

- **The older UI/UX build track** (Phase 2 → Phase 9, dated up to 2026-09-23): `docs/phase-8-visual-polish-report.md` is the final CSS/typography/hover-state/accessibility polish pass on the student-facing app — spacing, card language, toast transitions, login-panel centering. It has nothing to do with production infrastructure. `docs/phase-9-production-readiness-audit.md` is a **read-only audit**, one single point-in-time snapshot from 2026-09-23, that opened a separate 8-step production-readiness sequence (audit → preservation → staging architecture → Postgres migration → security hardening → concurrent-user testing → deployment test → launch).
- **The current infrastructure/launch track** (Stage 6A → 6D → Stage 7 → **Stage 8**, all named `stage6*`/`stage7*`/`stage8*` from here on specifically to avoid a second collision): Stage 6A–6C already executed most of the phase-9 audit's own sequence — Postgres cutover, a formal regression gate, and staging-deployment engineering readiness. Stage 7 covers real staging QA (still gated on Railway). **This document is Stage 8** — the production-readiness checklist and launch runbook — and it is deliberately **not** named `phase-8-*` to avoid sitting next to the unrelated visual-polish report under a matching number.

Both older documents are preserved exactly as written and are not reinterpreted here — they're historical, dated records of what was true on 2026-09-23. Section 1 below reconciles every specific finding in `phase-9-production-readiness-audit.md` against the current state of the codebase, one line at a time, so this document builds on that audit instead of quietly repeating or contradicting it.

## What this document is not

It does not deploy anything. It does not touch Railway, GitHub, or any production credential. It does not modify `boardready.db`, `source_library/`, or any preserved backup. It does not change application code (the one exception — a new, offline, opt-in smoke-test script — is called out explicitly in section 6). Every checklist below is a plan to execute **after** Stage 6D and the real Stage 7 staging gate have passed, per the founder's own stated sequence: *GitHub + Railway → 6D → real staging → Stage 7 → production launch.* Nothing here shortcuts that.

---

## 1. Reconciliation: every phase-9 finding, resolved or still open

| # | Phase-9 finding (2026-09-23) | Status today (2026-09-24) | Evidence |
|---|---|---|---|
| 1 | **Top priority:** no backup of `boardready.db`/`source_library/` exists outside this container | **RESOLVED** for database + source library | `docs/phase-2-preservation-report.md`: both independently transferred to the user's own machine and hash-verified byte-for-byte (commits `9067cc5`, `d240473`) |
| 2 | Application code/git history has no independent copy | **RESOLVED, but now 25 commits stale** | A git bundle (43 commits) was transferred off-container and hash-verified (`docs/phase-2-code-preservation-report.md`, commit `18d0430`). Current `HEAD` is `578a818`, **68 commits** — the bundle is missing everything from Phase 5 security hardening onward. See section 4 below; this is now a concrete pre-launch action, not a resolved item. |
| 3 | `AUTH_SECRET` hardcoded fallback (`'dev-only-secret-change-me'`) | **RESOLVED** | `config.js` now refuses to start in production with no `AUTH_SECRET` set at all (fail-closed); dev/test only gets a per-process random secret with a console warning. Regression-tested (`test/security.test.js`). |
| 4 | No rate limiting on `/api/auth/login`/`/register` | **RESOLVED** | `rate-limit.js`, wired into both endpoints (10 attempts/15 min, IP-keyed). Regression-tested (`test/security.test.js`, suite D). |
| 5 | No CORS headers at all | **RESOLVED as an explicit, off-by-default feature** | `security-headers.js`'s `applyCors` + `ALLOWED_ORIGINS` env var. Off (no CORS headers) unless explicitly configured — exactly today's behavior when unset. Regression-tested for both the unconfigured and configured cases (`test/security.test.js`, suites C/E). Needs a real value set at production launch time only if the frontend and API ever end up on different origins — see section 3's environment checklist. |
| 6 | Unhandled 500s return `err.message` to the client | **RESOLVED** | Every unexpected error now returns exactly `{"error":"Internal server error"}`; the real message is logged server-side only. Regression-tested with a genuinely broken row, not a synthetic throw (`test/security.test.js`). |
| 7 | Auth tokens stored in `localStorage`, not an `HttpOnly` cookie | **STILL OPEN — a deliberate product decision, not yet made** | Confirmed unchanged (`public/app.js`). Mitigated today by the CSP (`object-src 'none'`, no inline scripts) but not eliminated. Recommend a conscious go/no-go call before this handles real payment-linked accounts at scale — not a hard launch blocker on its own, since the phase-9 audit itself categorized it as a decision, not a bug. |
| 8 | No email verification, no password-strength requirement | **STILL OPEN — explicitly a product decision, not a bug**, per phase-9's own framing | Unchanged. Carried forward as-is; not treated as a blocker here either. |
| 9 | No `PRAGMA journal_mode=WAL` / `busy_timeout` on SQLite | **STILL OPEN, but now low-priority** | Confirmed unset (`db-sqlite.js`). This mattered when SQLite was a candidate for production; since the Stage 6A–6C Postgres cutover, SQLite is dev/test-only and production runs `DB_ENGINE=postgres` (real pooled connections, `FOR UPDATE` row locks — see `docs/phase-6-postgres-cutover-plan.md`). Recommend leaving as documented, accepted dev-only behavior rather than spending launch-prep time on it, unless a future decision reintroduces SQLite anywhere real. |
| 10 | SQLite single synchronous connection limits concurrent throughput | **RESOLVED at the architecture level** | Production is Postgres, not SQLite (Stage 6A–6C). Concurrency correctness (not just throughput) is now regression-tested at the HTTP level for the exact races that matter — simultaneous test generation, same-key `/check`, same-attempt `/answers`, duplicate `/submit` — under both engines (`test/postgres-regression.test.js`, `test/stage7-deep-qa.test.js`). |
| 11 | No git remote; no Railway/Vercel/hosting connector authorized; no payment provider integrated | **PARTIALLY RESOLVED / still blocked on founder action** | Engineering side prepared in Stage 6C (`railway.json`, `/api/health`, graceful shutdown, a deploy-ready checkout, `DEPLOYMENT.md`) — see section 4. Git push, Railway account/project, and Razorpay integration are still outstanding and are explicitly the founder's own next actions per the account/ownership split already agreed in Stage 6C. |

**Net effect:** every finding phase-9 flagged as "must resolve before any public launch" or "should resolve during security hardening" has been resolved in code and is regression-tested, except the two the founder always intended to be their own decision (token storage location, email/password policy) and one now-stale backup that needs a cheap refresh (item 2). Item 1 — the single most urgent finding in the whole audit — is done.

## 2. Current, authoritative test baseline (replaces phase-9's table, which listed scripts since consolidated into `test/`)

| Suite | Result (this session, both engines) |
|---|---|
| `test/readiness.test.js` | passing |
| `test/security.test.js` | passing |
| `test/postgres-regression.test.js` | passing |
| `test/stage7-deep-qa.test.js` (new — see `docs/stage7-deep-qa-report.md`) | passing |
| **Total** | **71/71**, under `DB_ENGINE=sqlite` (default) and `DB_ENGINE=postgres`, live-DB-guarded (`[test-guard] OK` — hash and all 14 table row counts unchanged) both times |

`verify-flow.js` (the one legacy ad hoc script still present in the repo root) still exists; the `phase2-e2e-test.mjs`/`phase3-backend-test.mjs`/etc. scripts phase-9's table referenced are no longer present in the repo — consolidated into the formal `test/*.test.js` suite above, which is the one authoritative baseline going forward.

## 3. Production environment variables checklist

Set on the Railway service (or equivalent) at production deploy time — this table extends `.env.example`, which already documents each of these; nothing here should diverge from it:

| Variable | Production value | Notes |
|---|---|---|
| `NODE_ENV` | `production` | Enables `config.js`'s fail-closed `AUTH_SECRET` check. |
| `DB_ENGINE` | `postgres` | Confirmed by `production-smoke-test.js` (section 6) — it fails the smoke test if `/api/health` ever reports `sqlite` in production. |
| `DATABASE_URL` | Railway's production Postgres plugin reference (`${{Postgres.DATABASE_URL}}`) | **A separate Postgres instance from staging** — never point production at the staging database or vice versa. Confirm this explicitly before first deploy; there's no code-level guard against pointing production at the wrong database, only operator discipline. |
| `AUTH_SECRET` | A fresh, real, random value (`openssl rand -hex 32`) | **Must be different from the staging `AUTH_SECRET`** — a shared secret would let a staging-issued token authenticate against production. Never reuse any value that appears anywhere in this repository's history (e.g. `test/pg-test-support.js`'s or `test/stage7-deep-qa.test.js`'s local test secrets — those only ever protect disposable throwaway databases). Store it in Railway's variable store and in the user's own password manager; never in a file this session writes. |
| `PORT` | *(leave unset)* | Railway injects it automatically. |
| `ALLOWED_ORIGINS` | *(leave unset unless the frontend is hosted on a different origin from the API)* | Same-origin deployment (the current plan, per Stage 6C) needs no CORS configuration at all. |

## 4. Production secrets checklist

- **`AUTH_SECRET`** — see above. Generated by the founder on their own machine (never by this session — a secret this session generated and could recall would defeat the point).
- **`DATABASE_URL`** — a production credential; Railway manages it, never enters this session as a literal.
- **Razorpay production API key/secret** (once integrated — see section 8) — the same rule applies: generated and stored by the founder in Razorpay's dashboard and Railway's variable store, never typed into or generated by this session.
- **Independent, off-container copy of the application code is 25 commits stale** (`docs/phase-2-code-preservation-report.md` captured commit `18d0430`'s bundle; `HEAD` is now `578a818`). Two ways to close this, either is sufficient — no need to do both:
  1. **Refresh the git bundle** the same way (`git bundle create --all`, transfer, reassemble, hash-verify) before launch.
  2. **Push to GitHub** (the founder's own next step regardless) — once that happens, GitHub itself is the durable, independent, continuously-current copy, and the stale bundle becomes moot. This is the cheaper path since it's a step already on the critical path to Railway.
- **The Stage 6C deploy-ready checkout is also stale.** `/home/claude/boardready-staging-deploy` (referenced in `docs/phase-6c-staging-deployment-report.md`) is a single clean commit made before Phase 5 security hardening, the Stage 6A–6C Postgres cutover work, Stage 7's session-expiration/back-button fixes, and today's deep-QA suite — 25 commits behind the main workspace's current `578a818`. **Before pushing this checkout to GitHub, it needs to be regenerated from the current workspace state** (same exclusions as before: `source_library/`, `backups/`, `*.db*`, `node_modules/`), or the deployed staging/production app would be missing all of that work. This is flagged here as a concrete pre-push action, not performed by this document — regenerating and pushing a deployment checkout is exactly the kind of action that should happen once, deliberately, right before the founder actually pushes, not repeatedly during unrelated prep work.

## 5. Final backup procedure (run once, immediately before production migration)

This extends `docs/phase-2-preservation-report.md`'s method — same tools, same verification rigor, run again immediately before the production data migration so the backup is contemporaneous with the actual cutover, not two-plus days old:

1. **Database:** `node:sqlite`'s online `backup()` API (never a raw file copy) against the live `boardready.db`, producing a fresh timestamped file in `backups/`.
2. **Restore-test it** before trusting it: `PRAGMA integrity_check`, `PRAGMA foreign_key_check`, all 14 tables' row counts compared against the live database, and a full per-table content digest comparison (`questions`, `source_documents`, `source_files`, `visual_assets`, `attempts`, `tests`, `users`) — the exact method `phase-2-preservation-report.md` section F already used and documented.
3. **Transfer it off-container** — onto the founder's own machine (the same device-bridge/split-transfer method already proven in Phase 2 for files over the platform's size limits), or, if a cloud-storage connector is connected in Claude by then, directly to that.
4. **Only then** does the production data migration (section 6 of `DEPLOYMENT.md`'s pattern, using `scripts/stage6b-migrate.js` against this fresh backup copy — never the live file directly) proceed.
5. Record the new backup's SHA-256 and row counts in this file's own change log (append, don't overwrite section 1's evidence table) so there is always a dated, verifiable record of the most recent backup immediately preceding a real production cutover.

This procedure is **written, not run**, by this document — running it is a deliberate, scheduled action for whenever the founder is actually ready for the production migration step, not something to execute speculatively now.

## 6. Production smoke-test script

`scripts/production-smoke-test.js` (new, built and verified locally as part of this workstream) — a plain-`fetch`, dependency-free script meant to be run by hand, immediately after a real deploy goes live, against the real deployed URL.

- **Default mode is 100% read-only**: `/api/health` (status, engine, no leaked connection string), the baseline security headers, the real static frontend loading, and `/api/content/summary` reporting a non-zero question count (catches an empty/misconfigured production database that a bare connectivity check wouldn't). Always safe to run against production.
- **`--full` mode** additionally exercises a real signup → practice-generate → attempt → submit flow against the live API, using an unmistakably labeled synthetic account (`smoke-test-<timestamp>@boardready-smoketest.invalid`, name `"SMOKE-TEST <timestamp> (safe to delete)"`) so it can never be mistaken for real student data, and prints the exact `DELETE` statement to remove it afterward. This mode does write real rows and is opt-in for that reason.
- **Verified locally** (this workstream): both modes run cleanly against a disposable local server — read-only mode correctly reports 9/10 checks passing with the one expected, intentional failure (`engine=sqlite` instead of the production-required `postgres`, proving the script actually catches a misconfigured engine rather than rubber-stamping); `--full` mode correctly completes the entire signup-through-submit flow and prints the labeled cleanup statement. Never touched `boardready.db` — ran only against a throwaway temp database, confirmed unchanged by hash before/after.
- **Usage at launch:** `node scripts/production-smoke-test.js https://<production-url> --full`, as the first step of the launch-day runbook below, before declaring the deploy successful.

## 7. Deployment / rollback runbook

**Deployment** (production, once Stage 7 has passed): follows the same pattern `DEPLOYMENT.md` already documents for staging — Railway service, environment variables per section 3, `railway.json`'s existing `NIXPACKS` builder/`npm start`/`/api/health` health check/`ON_FAILURE` restart policy (already in place, no changes needed) — pointed at a **separate** production Postgres database and a **separate** `AUTH_SECRET` from staging.

**Rollback — two distinct scenarios, two distinct procedures:**

- **A bad deploy, database unaffected** (the common case — a code bug, not a data-corrupting one): Railway keeps prior deploy images; redeploy the last known-good commit/image from the Railway dashboard. No database action needed. Verify with `production-smoke-test.js` (read-only mode) immediately after.
- **A bad deploy that also wrote bad data** (rare — e.g. a migration ran wrong, or a code bug wrote malformed rows before being caught): (1) redeploy the last known-good code first, per above; (2) restore the production database from the most recent verified backup (section 5) using the same restore-test procedure — `integrity_check`, `foreign_key_check`, row-count and content-digest comparison — **before** pointing the live service back at it, never trusting an unverified restore under pressure; (3) run `production-smoke-test.js --full` to confirm both code and data are healthy together, not just each in isolation.

**Emergency rollback (abbreviated, for use live during a launch-day incident):**

1. Redeploy last known-good Railway deployment (dashboard → Deployments → ⋯ → Redeploy). ~1–2 minutes.
2. Run `node scripts/production-smoke-test.js https://<production-url>` (read-only). All checks must pass.
3. If checks still fail and a data issue is suspected, stop — do not attempt a live database fix under pressure. Restore from the most recent verified backup per the "bad deploy that also wrote bad data" procedure above, which itself insists on a restore-test before going live again.
4. Announce status (internally) at each of the three steps above — a rollback that's silently in progress is worse than a visible one.

## 8. DNS / domain checklist

Deferred to production per the founder's own Stage 6C decision (staging deliberately uses Railway's free `*.up.railway.app` subdomain). At production launch:

- [ ] Domain registered/owned by the founder (not this session — domain registration is a purchase, out of scope for this environment regardless).
- [ ] DNS `CNAME`/`A` record pointed at Railway's provided target, per Railway's own custom-domain instructions for the production service.
- [ ] DNS propagation confirmed (`dig`/`nslookup` from outside this environment, or Railway's own domain-status indicator) before announcing the production URL anywhere.

## 9. HTTPS verification checklist

- [ ] Railway's automatic TLS certificate provisioned for the custom domain (Railway handles this once the domain is attached — no manual certificate management needed on this stack).
- [ ] `https://` (not `http://`) is the URL used everywhere the production link is shared — `production-smoke-test.js` already warns (non-fatally) if pointed at a plain `http://` URL, specifically so this isn't missed.
- [ ] No mixed-content warnings in a real browser load of the production URL (the CSP's `default-src 'self'` already structurally prevents loading insecure sub-resources from other origins, but a manual look at the browser console on first real load is still worth the two minutes).

## 10. Payment / Razorpay production checklist

**Not yet built** — `POST /api/subscriptions/activate` is today a manual/demo activation (`server.js`), not a real payment flow, exactly as phase-9 found and as the founder has separately flagged as still-outstanding. This checklist is preparation for when that integration is built, not a description of work already done:

- [ ] Razorpay production account created and KYC-verified (founder-owned; a business/financial verification step no engineering session can do on their behalf).
- [ ] Razorpay production API key/secret generated and stored per section 4's secrets handling (Railway variable store + founder's password manager, never typed into this session).
- [ ] A distinct Razorpay **test-mode** key pair used throughout staging/Stage 7 QA — production keys are never exercised by an automated test.
- [ ] Webhook signature verification implemented and tested before trusting any payment-confirmation webhook (a payment feature's most common real vulnerability is trusting an unverified webhook body).
- [ ] A reconciliation check: does `subscriptions.status='active'` in the database actually correspond 1:1 with a captured, non-refunded Razorpay payment? Worth a manual audit before launch, and a periodic one afterward.

This entire section is intentionally a checklist for future work, not a status report — building the actual payment integration is separate engineering work, out of scope for this document, and not something to build silently as a side effect of writing a checklist.

## 11. Monitoring and logging

Nothing beyond `console.error`-to-stdout (captured by Railway's own log viewer) and `/api/health` exists today. Recommended, in priority order, none of it built by this document:

1. **Rely on Railway's built-in log retention and `/api/health`-driven restart policy first** — already configured (`railway.json`), genuinely functional, and sufficient for an initial launch at this product's likely scale. Don't add a third-party observability vendor before there's a real need for one.
2. **A cheap uptime check** (Railway itself, or an external free-tier service) polling `/api/health` from outside Railway's own network — catches a scenario where Railway's internal health check and the public internet path to the service disagree (e.g. a DNS or edge issue Railway's own health check can't see).
3. **Structured error logging** — today's `console.error(err)` in `server.js`'s catch-all (the generic-500 boundary) logs the full error server-side already; the only gap is that it's unstructured plain text. Worth revisiting only if/when log volume makes plain-text `grep`-ing through Railway's log viewer genuinely painful — not a launch blocker.
4. **A weekly reminder to actually look at the logs** is more valuable at this stage than any tool — most early-stage monitoring failures are "nobody looked," not "no tool existed."

## 12. Launch-day runbook

1. **Confirm Stage 7 has actually passed** against real Railway staging (not local tests) — this document does not and cannot satisfy that gate; see the founder's own explicit sequencing.
2. **Run the final backup procedure** (section 5) against the live database, immediately before migration.
3. **Set production environment variables** (section 3) on the production Railway service — double-check `DATABASE_URL` and `AUTH_SECRET` are the **production**, not staging, values.
4. **Refresh and push the deploy checkout** if not already done (section 4) — confirm the pushed commit matches the workspace's current `HEAD`.
5. **Migrate data** into the production database from the fresh backup (never the live file directly), per `DEPLOYMENT.md`'s pattern.
6. **Deploy.**
7. **Run `production-smoke-test.js --full`** against the real production URL. Every check must pass, including the `engine=postgres` check.
8. **Verify HTTPS + DNS** (sections 8–9) if a custom domain is attached at this launch.
9. **Announce the launch** only after steps 1–8 are all green.
10. **Immediately after launch:** re-run `production-smoke-test.js` (read-only) once more after a few minutes of real traffic, and clean up the `--full` run's labeled smoke-test account per the `DELETE` statement it printed.

## 13. Launch-blocker criteria (go/no-go)

**Must be true before launch (hard blockers):**

- [ ] Stage 6D has passed against real Railway staging.
- [ ] The real Stage 7 staging QA gate has passed (not local-only test results — see the founder's own explicit distinction between "Stage 7 preparation complete" and "Stage 7 itself").
- [ ] Production `AUTH_SECRET` and `DATABASE_URL` are set, real, and distinct from staging's.
- [ ] A fresh, restore-tested backup exists immediately before the production data migration (section 5).
- [ ] `production-smoke-test.js --full` passes against the real deployed production URL, including `engine=postgres`.
- [ ] The deploy checkout pushed to GitHub matches the current workspace `HEAD` (not the stale Stage 6C snapshot) — see section 4.

**Should be true, but a conscious founder decision can accept the risk (soft blockers):**

- [ ] A decision made (either way) on auth-token storage (`localStorage` vs. `HttpOnly` cookie).
- [ ] A decision made (either way) on email verification / password-strength requirements.
- [ ] A domain + HTTPS attached (acceptable to launch on the Railway subdomain first and add a custom domain shortly after, if that's the founder's preference).

**Explicitly not required to launch (by the founder's own prior product decisions, restated here so they aren't mistaken for oversights):**

- Razorpay production integration — the founder has already indicated this needs to be built; whether it blocks launch or ships as a fast-follow is a product call, not an engineering one.
- Third-party monitoring/observability tooling beyond what section 11 already recommends.

---

## Explicitly out of scope in this document

No production or staging infrastructure was touched while preparing this. No question/answer content, `status`, or `answer_status` was read or modified. No file under `source_library/` was touched. `boardready.db`'s hash was confirmed unchanged before and after this workstream's verification work (see `scripts/production-smoke-test.js`'s local test run, which used only a disposable temp database). No UI change. No payment integration was built — section 10 is a checklist for that future work, not an implementation. The one piece of new application-adjacent code this workstream added is `scripts/production-smoke-test.js` itself, which is inert until a human explicitly runs it against a URL they choose.
