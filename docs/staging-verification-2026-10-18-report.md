# Board Ready redesign — staging-verification phase (2026-10-18)

## Branch state

- **Branch:** `redesign/board-ready-2026-ui`
- **Commits:** the original four are intact (`0fc0365`, `5d5d112`, `d09dc7f`, `1abec58`). This phase added three:
  - `7cc2ced` — honest over-time disclosure on results (display only)
  - `5bf7ce5` — automated accessibility check script
  - the commit containing this report, its logs and one screenshot
- **Untracked and preserved:** `run-qa.cmd` and `.claude/`.
- **Unchanged:** `package.json` and `package-lock.json` (Playwright and axe-core were installed with `--no-save`).
- **Not done:** no merge, no push, no Railway change or deploy, and no production data access or modification.

## 1. Railway configuration (read-only inspection)

| Item | Finding |
|---|---|
| Project | `board-ready` (1 project) |
| Environments | **`production` only. No staging environment exists.** |
| `backend` service | Deploys from GitHub `idol16dimpleshah-del/boardready-backend`, branch `claude/new-session-k86x3s`. Builder RAILPACK, 1 replica (sfo), public domain `backend-production-b46c.up.railway.app`. Variable *names*: `AUTH_SECRET`, `DATABASE_URL`, `DB_ENGINE`, `NODE_ENV`. Values were not read. |
| Live backend build | Last successful deployment `52723c5d…` (2026-09-29 10:25 UTC), matching commit `cc4102d` (15:55 IST). The redesign branch sits directly on top of what is live. |
| `Postgres` service | Image **`ghcr.io/railwayapp-templates/postgres-ssl:18`**, 500 MB volume `postgres-volume`. |
| Other services | `readonly-postgres-audit`, `stage7-content-diagnostic-readonly`, `content-migration-oneshot`: one-off Bun functions that earlier sessions used to query production by **redeploying edited code into production**. Not used here, because that is a production change. |
| Config drift to note | `railway.json` declares builder `NIXPACKS` and `healthcheckPath: /api/health`. The live service reports `RAILPACK`, and the read-only config shows no health check. Confirm in the dashboard before relying on health-checked rollouts. |

## 2. Production PostgreSQL version and schema (read-only evidence)

- **Version: PostgreSQL 18**, from the service image tag. The earlier local verification used 16, so this phase re-ran everything on a local **PostgreSQL 18.3** throwaway cluster (127.0.0.1:55434).
- **Schema evidence** comes from the existing read-only audit's logs (2026-10-18 08:28 UTC):
  - `source_documents`, `source_files`, `visual_assets` and `audit_log` columns and types match `docs/phase-3-migration-artifacts/schema.sql` (including the `timestamptz` conversions);
  - subject IDs are identical to the local copy.
- **No direct schema read of `tests`, `attempts`, `questions`, `chapters` or `test_questions`.** No authorized read-only path exists without changing production. Instead, this was proven indirectly:
  - every table and column the redesign's new SQL touches is already used by the live production code (`cc4102d`), for example `improves_attempt_id` 4×, `feedback_mode` 9×, `locked_answers_json` 10×, `test_questions` 4×;
  - production serves that code successfully, so those columns exist there.

## 3. Schema and content comparison

- **Migrations required:** none. The redesign adds no tables, columns or constraints, only read-time queries and response fields.
- **SQL differences:**
  - The new SQL uses `?` placeholders, quoted camelCase aliases, `COUNT` with `Number()` coercion, `DISTINCT` and self-joins: the patterns the codebase already uses on Postgres.
  - It passes on PG16 and PG18.
- **Data assumptions:**
  - Timestamps: `started_at` and `submitted_at` come back from Postgres as `timestamptz`. The frontend parses both SQLite and ISO formats, verified on PG18.
  - Counts: `gradableCount` uses the same `GRADABLE_STATUSES` filter as test generation.
  - Content: production has about 4,825 questions vs 4,824 in the local migrated snapshot. That changes counts only, not code paths.
- **Not compared:** current production *content* (anything promoted on or after Oct 15). There's no read-only access path to it.

## 4. End-to-end flows (local PG18 stand-in for staging, `NODE_ENV=production`)

Run against a real migrated copy of the snapshot on PostgreSQL 18:

| Check | Result |
|---|---|
| Login, registration, demo entry, logout/login | PASS (smoke script, matrix, a11y keyboard run) |
| Test start (Practice and Board Simulation), answering, submission, scoring | PASS |
| Saved-result reopening (`GET /api/attempts/:id/result`) | PASS (automated tests; UI reopen covered in the PG16 phase) |
| Improve My Score, retesting, freshness | PASS. Smoke: "All 12 questions were new to you" |
| Board Simulation: no reveal before submit | PASS (0 reveal classes, every profile) |
| Resume after the deadline | PASS. Auto-submits immediately; results show the over-time note ("Submitted 10 min 22s after the time limit…") |
| Device matrix (Desktop, iPad Pro 11, iPhone 13, iPhone 13 on slow 3G) plus back-button, session-expiry, autosave/resume and error-state checks | Final run PASS; 3 consecutive repeat runs PASS |

**Interim matrix runs, both kept in the logs:**

1. **Run 1 — iPhone 13 stalled for about 6 minutes**, then timed out on `#nextBtn`. It did not reproduce in the next 4 matrix runs on PG18 or the 2 earlier runs on PG16, so it is classed as an intermittent harness flake. The log is kept.
2. **Run 2 — failed with HTTP 429 from the register rate limiter** (10 registrations per 15 min per IP, in-memory). The limiter worked as designed. Fresh server processes were used for later runs; production is unaffected.

## 5. Accessibility (`scripts/a11y-axe-check.js`, axe-core 4.10.2, WCAG 2.0/2.1/2.2 A+AA)

- **31 screen states** were scanned, in dark and light themes at 1440 and 390 px:
  - Login and the create-account tab;
  - Dashboard and Practice;
  - the test with Practice feedback, the navigator drawer and the submit dialog;
  - Results, the targeted retest, and Improve My Score.
- **Violations: 0.** A canary check confirmed the scanner works by catching an injected `image-alt` (critical) and `color-contrast` (serious).
- **Keyboard and focus: 15 of 15 checks pass:**
  - skip link first, and visible on focus;
  - Tab reaches the form;
  - visible focus indicators on inputs and nav links;
  - Enter operates the nav and chapter buttons;
  - A–D answers and → moves between questions;
  - the live region announces question changes;
  - the dialog takes focus, traps Tab, closes on Escape, and returns focus;
  - options are named "Option A: …".
- **Contrast** is covered by axe's `color-contrast` rule in both themes; 0 failures.
- **Limits:** this is automated plus scripted. No manual screen-reader session (NVDA or VoiceOver) was performed.

## 6. Plan mismatch and time-limit enforcement (both pre-existing in production `cc4102d`)

**Subscription plans**

- **What's wrong:**
  - The upsell offers `single-subject`, but the access check only accepts `all-subject` or `subject-<id>`.
  - More serious: `POST /api/subscriptions/activate` accepts **any plan string with no payment**, so any signed-in student can unlock paid diagnostics.
  - The old UI already had the same "Unlock (demo)" button.
- **Impact on this release:** none new. The UI only sends `all-subject`, exactly as before.
- **Not fixed:** this is entitlement and payment logic needing a product decision. Changing it would alter production behaviour beyond a UI release.
- **Treat as a launch blocker for paid features**, not for this UI release.

**Time limit**

- **What's wrong:** the server accepts late submissions and only records `timeExceededSeconds`.
- **Client safeguards:** auto-submit at 00:00, and immediate auto-submit when a past-deadline attempt is resumed.
- **Impact:** a manipulated client could submit late, and Board Simulation scores would not be strictly timed.
- **This release adds an honest disclosure (`7cc2ced`, display only).** Enforcing it server-side (rejecting or ignoring late answers) changes scoring rules, which is protected, so it was left as a product decision.

## 7. Regression totals (final code)

| Suite | Result |
|---|---|
| `npm test`, SQLite | 79/79 pass, 0 skipped, 0 cancelled; live-DB guard OK |
| `npm test`, PostgreSQL 16.14 | 79/79 pass, 0 skipped, 0 cancelled; guard OK |
| `npm test`, **PostgreSQL 18.3** | 79/79 pass, 0 skipped, 0 cancelled; guard OK |
| Browser smoke (PG18) | PASS: 0 CSP violations, 0 page errors, 0 failed requests |
| Device and behaviour matrix (PG18) | PASS (final run plus 3 repeats) |
| Accessibility (PG18) | PASS: 31 states, 0 violations, 15/15 keyboard checks |

- **Data integrity:** `boardready.db` and the original preservation backup still hash to `27514330…`.
- **Evidence:** logs in `docs/staging-verification-2026-10-18-logs/` (credential-scanned, none found); screenshots in `docs/verification-2026-10-18-screenshots/`.

## 8. Go / no-go checklist

| Area | Status | Notes |
|---|---|---|
| Functional correctness | ✅ | All critical flows pass on SQLite, PG16 and PG18; 7 earlier defects fixed; over-time disclosure added |
| PostgreSQL compatibility | ✅ local PG18 · ⚠️ staging | Production major version (18) verified locally; not yet run against a Railway-hosted database |
| Schema / migrations | ✅ | No migrations; every column used is already used by live code |
| Security | ✅ release · ⚠️ pre-existing | New endpoint is owner-only and read-only; CSP unchanged with 0 violations; no new write paths. Pre-existing: free plan activation; in-memory rate limit (per process, resets on deploy) |
| Accessibility | ✅ | 0 axe violations across 31 states; keyboard and focus checks pass; no manual screen-reader test |
| Deployment configuration | ⚠️ | No staging environment. Production auto-deploys on push to `claude/new-session-k86x3s`. Builder and health-check drift between `railway.json` and live config to confirm |
| Rollback readiness | ✅ | Code-only change with additive fields, so the previous frontend works with the new API and vice versa. Railway can redeploy the previous deployment (`52723c5d…`, commit `cc4102d`) via the dashboard or a redeploy of that ID. No data migration to undo |
| Content currency | ⚠️ | Verified on the Sept 23 snapshot; production content (Oct 15+) not compared |
| Outstanding risks | ⚠️ | Free plan activation; late-submission enforcement; one intermittent mobile harness stall (not reproduced) |

**Recommendation: GO to create staging and deploy the branch there.** It remains **NO-GO for production** until the same scripts pass against a Railway staging environment running PostgreSQL 18 with current content.

## Blocker and minimum action needed

Staging on Railway does not exist, and creating or deploying it was outside this phase's approval. To finish step 4 for real, these actions are needed, each requiring your explicit approval:

1. **Create a Railway `staging` environment**, or a separate project, with its **own** Postgres 18 service and volume, not attached to production's.
2. **Push `redesign/board-ready-2026-ui` to GitHub** and point the staging `backend` service at that branch. Pushing a new branch does not deploy production, because production only tracks `claude/new-session-k86x3s`. Check that Railway PR or preview environments are off, or accept that they would deploy only to staging.
3. **Choose the staging data source:**
   - (a) migrate the Sept 23 snapshot with `scripts/stage6b-migrate.js`, which needs no production access; or
   - (b) a read-only `pg_dump` of production restored into staging. That requires you to supply or approve production database access, and the dump contains real student accounts.
4. **Set staging variables:** a new random `AUTH_SECRET` (never production's), `DB_ENGINE=postgres`, `DATABASE_URL` referencing the **staging** Postgres, and `NODE_ENV=production`.

After that, re-run against the staging URL: `scripts/browser-smoke-check.js`, `scripts/stage7-browser-matrix-check.js` and `scripts/a11y-axe-check.js`.
