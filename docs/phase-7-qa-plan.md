# Stage 7 — Full Staging/Concurrency QA Plan

**Date:** 2026-09-24
**Status:** authoritative scope and pass/fail specification. Tooling (`scripts/stage7-load-test.js`, `scripts/stage7-browser-matrix-check.js`) is built and locally verified against this plan, not invented ad hoc. Execution against the real Railway staging environment is gated on Stage 6D passing first (this project's standing order of operations: engineering readiness → regression gate → real deployment → real-browser smoke test → this stage's deeper load/device QA).

This plan does not re-open, redesign, or re-scope anything already closed: no UI redesign, no new product features, no full re-verification of migration data integrity (Stage 6B already ran two independent migrations and compared all 14 tables — diminishing value in repeating that immediately; see "Explicit non-goals" below), no change to the preserved master workspace, the live SQLite database, or staging's migrated data.

---

## 1. Purpose

Stages 6A–6D prove the application is PostgreSQL-compatible and that a single real user's full journey works on the actual deployed staging environment. Stage 7 asks a different question: **does it hold up when many real users touch it at once, and on the actual range of devices real students will use?** This is the gate before Stage 8 (production).

## 2. Test categories

### A. Concurrency / load testing
Progressive ramp against the real HTTP endpoints that matter under concurrent load: `POST /api/practice/generate`, `POST /api/attempts`, `GET /api/attempts/:id/questions`, `POST /api/attempts/:id/check`, `PATCH /api/attempts/:id/answers`, `POST /api/attempts/:id/submit`. These are exactly the endpoints Stage 6A wrapped in `db.transaction()` + `SELECT ... FOR UPDATE`, and Stage 6B proved correct at small scale (2 and 10 concurrent requests). Stage 7 proves the same correctness properties hold at realistic scale, and additionally measures performance, not just correctness.

**Ramp tiers:** 10 → 25 → 50 → 100 → 200 concurrent simulated students, run **progressively, never jumping straight to the top tier**. Each tier must pass before the next tier runs. If a tier fails (breaches any threshold in Section 3), the ramp stops there and that becomes the reported capacity ceiling — it is not a license to keep pushing past a real failure to see what happens.

**What's measured per tier**, matching your explicit list:
- Response time (p50 / p95 / p99, in ms) per endpoint.
- Error count and rate, broken down by HTTP status code (4xx vs 5xx are different findings — a 429 under rate limiting is expected behavior in some cases, a 500 is not).
- Timeouts (request exceeded a configured client-side timeout with no response at all).
- Failed submissions (a `/submit` call that should succeed but doesn't).
- Duplicate submissions (more than one `/submit` for the same attempt id ever being scored — this must be structurally impossible per Stage 6A's row-locking, so this count must always be zero; a nonzero count is a launch blocker, not a performance note).
- Lost autosaves (an autosave written via `PATCH /answers` that a subsequent read of the same attempt doesn't reflect — read back directly from the database after each burst, the same technique Stage 6B's D2 test used).
- Cross-user contamination (any response that contains another student's data — a wrong-user's attempt, question set, or score ever appearing in the wrong student's session).
- Database errors (connection refused, pool exhaustion, query timeout — surfaced distinctly from application-level 4xx/5xx).

### B. Extended cross-device / cross-browser QA
Broadens `scripts/browser-smoke-check.js` (already proven clean of CSP violations against both SQLite and a local Postgres-backed server, Stages 5 and 6B) into the fuller matrix you specified:

- **Viewports:** Desktop (1440×900), Tablet (iPad Pro 11, via Playwright's device descriptor), Mobile (iPhone 13, via Playwright's device descriptor).
- **Network:** normal, plus a throttled "slow 3G"-equivalent profile (via Chrome DevTools Protocol network emulation) to catch anything that silently breaks or times out under real mobile network conditions.
- **Flows:** login, logout, back-button behavior (browser back after navigating within the app must not corrupt in-app state or resurrect a stale session), session expiration (an invalid/expired token must cleanly bounce to the login screen, never a blank page or an unhandled error), Practice (immediate feedback), Board Simulation (deferred feedback), Improve My Score, Results, autosave/resume (reload mid-test, confirm the draft answers survive), and deliberate error states (a forced network failure via route interception, an invalid form submission).

### C. Authentication & authorization tests
Beyond the single-user checks Stage 6B's `verify-flow.js` and `test/security.test.js` already cover: token tampering, expired-token handling in the real browser (not just an API-level unit test), role-boundary checks (a teacher token against a student-only route, already covered at the API level — re-verified here against the real deployed environment), and the register/login rate limiter's real behavior under the load-test ramp (see Section 4's explicit note — this interacts directly with Category A).

### D. Payment / subscription boundary
`hasActiveAccess()` (server.js) gates the paid diagnostics-detail routes on an active subscription. Re-verified against real staging: an unpaid student is refused with a clear upsell response (never partial data, never a silent 200 with truncated content), and a paid student's access is exactly as broad as their plan (`all-subject` vs `subject-<id>`) and no broader.

### E. Answer-leakage tests
`publicStepView()` (server.js) strips `correct`/`explanation` from every pre-submission response. Re-verified at the real HTTP/network level against staging (inspecting actual response bodies, not just trusting the code path) that no answer key or explanation is ever observable before a question is answered and checked/submitted, across every question kind (mcq, case, open).

### F. Data-isolation requirements
Every one of the concurrency tests in Category A is also a data-isolation test: with N simulated students hitting the same endpoints simultaneously, no student's request may ever read or write another student's row. This is checked structurally (each virtual user's assertions only ever reference that user's own ids) and directly (a targeted query at the end of each tier confirming every attempt's `student_id` matches the user who created it, and no attempt has been mutated by a different student's session).

### G. Database integrity checks (targeted, not a full re-verification)
Per your explicit decision: **not** a repeat of Stage 6B's full 14-table SQLite-vs-Postgres comparison — that already ran twice, deterministically, and repeating it now has diminishing value. Stage 7's integrity checks are narrower and load-specific: after each concurrency tier, confirm row counts for `attempts`/`test_questions`/`tests` match what the successful HTTP responses claim (no silent partial writes), and confirm no orphaned or duplicate rows were created by the concurrent burst itself. If this surfaces a *specific* integrity concern the plan didn't anticipate, it gets added here — not treated as a reason to re-run the full Stage 6B comparison by default.

### H. Rollback criteria / launch blockers
A finding is a **launch blocker** (staging QA fails; do not proceed toward Stage 8) if any of the following occur at or below the 100-user tier:
- Any duplicate submission, lost autosave, or cross-user contamination event (these are correctness/security invariants, not performance targets — a single occurrence is disqualifying, not a statistic to average).
- Any answer-key leakage before the appropriate reveal point.
- Any authorization-boundary bypass (student reaching teacher-only data, unpaid student reaching paid content).
- A database error rate that suggests connection pool exhaustion under realistic load (see Section 3 thresholds).
- The live SQLite database or the preserved master workspace being touched in any way.

A finding at the 200-user tier that breaches a **performance** (not correctness/security) threshold is a **capacity finding**, not automatically a launch blocker — it tells us the realistic ceiling for the current staging plan/tier, which is useful input for the Stage 8 production sizing decision, not a defect to fix under this stage's scope.

## 3. Pass/fail and performance thresholds

| Metric | Threshold | Severity if breached |
|---|---|---|
| Duplicate submissions | 0 at every tier | Launch blocker |
| Lost autosaves | 0 at every tier | Launch blocker |
| Cross-user contamination | 0 at every tier | Launch blocker |
| Answer-key leakage | 0 at every tier | Launch blocker |
| Authorization bypass | 0 at every tier | Launch blocker |
| 5xx error rate | < 1% at ≤100 users; reported (not blocking) at 200 | Launch blocker at ≤100; capacity finding at 200 |
| 4xx error rate (excluding expected 429s — see Section 4) | < 1% at every tier | Investigate; blocker if traced to app logic rather than test-harness setup |
| p95 response time, `/check` and `PATCH /answers` | < 500ms at ≤50 users; < 1500ms at 100; reported at 200 | Capacity finding, not a blocker, unless it indicates the row-locking design itself doesn't scale (in which case: blocker, since that's a Stage 6A correctness-under-load claim being contradicted) |
| p95 response time, `/submit` | < 1000ms at ≤50 users; < 2500ms at 100; reported at 200 | Same as above |
| p95 response time, `/practice/generate` | < 800ms at ≤50 users; < 2000ms at 100; reported at 200 | Capacity finding |
| Database connection errors | 0 at ≤100 users | Launch blocker at ≤100; informs Stage 8 pool-sizing at 200 |
| CSP violations (Category B) | 0 at every viewport/network combination | Launch blocker |
| Console/page errors (Category B) | 0 uncaught exceptions | Launch blocker |

Thresholds above 100 concurrent users are treated as **capacity discovery**, not pass/fail gates — Railway's staging tier is unlikely to be sized for 200 concurrent users, and the point of the progressive ramp is to find the real ceiling honestly, not to force a number.

## 4. Decision: the login/register rate limiter is never weakened for testing

`server.js`'s `enforceRateLimit()` allows 10 attempts per 15 minutes, **keyed by client IP** (`rate-limit.js`), on `/api/auth/register` and `/api/auth/login` only — a deliberate Phase 5 anti-brute-force/CPU-exhaustion control. **Decision (2026-09-24, confirmed with you): this limiter is never disabled, raised, or bypassed to make a load test easier.** Authentication/rate-limit correctness and application concurrency are two different questions, tested two different ways, never conflated into one number:

**(A) Authentication test — does the rate limiter itself work?** Already built and already passing, no new tooling needed: `test/security.test.js`'s `"security: rate limiting (dedicated server)"` suite deliberately drives `/api/auth/register` and `/api/auth/login` past the threshold from a real HTTP client and asserts the 11th attempt in either case gets a real `429` with a `Retry-After` header, and that the two limiters are keyed independently. This is engine- and environment-agnostic (`rate-limit.js`'s sliding-window logic doesn't change between SQLite/Postgres or local/staging), so it isn't re-run against real staging as a separate step — it's already a permanent part of the regression suite that runs before every stage.

**(B) Application-load test — does the app hold up under concurrent traffic?** `scripts/stage7-load-test.js` authenticates its simulated users **once, up front, before each tier's timed burst**, never through the rate-limited endpoints at all, and reuses each token for every request in that tier. Its default `--provision db` mode inserts pre-hashed-password user rows directly into the target database (the same kind of fixture seeding `test/security.test.js` and `test/postgres-regression.test.js` already use) and mints each token the same way the server itself does (`auth.sign()`) — `/api/auth/login` is never called during provisioning, so the load ramp cannot trip the rate limiter no matter how many users or tiers are simulated. A `--provision http` mode also exists for a real register+login walk at a rate-limit-respecting pace, but it exists to double-check the real endpoint path works end-to-end at small scale, not as the way to reach 100–200 users.

**For the real Railway staging run**, `db`-mode provisioning needs direct access to staging's Postgres connection string and the same `AUTH_SECRET` value configured on that Railway service — both are credentials you already control and would share for the schema/migration step regardless (`DEPLOYMENT.md` step 7), not a new exposure this decision introduces. This resolves what was previously an open question in this section.

## 5. What Stage 7 does NOT cover (explicit non-goals)

- A full SQLite-vs-Postgres data-integrity re-comparison (Stage 6B already did this twice, deterministically; see `docs/phase-6b-postgres-regression-gate-report.md`, checklist item 9).
- **A fix for the SQLite-only lost-autosave finding** (Section 3's load-test results): `db-sqlite.js`'s `transaction()` has no serialization across concurrent requests sharing its one connection. **Decision (2026-09-24, confirmed with you): not fixed.** Production and staging both run PostgreSQL, which Stage 6B and this stage's own load test already prove handles the same concurrency correctly (zero errors/lost autosaves/contamination through 200 simulated users). SQLite remains exactly what it already was — the local development and test-suite fallback engine — documented as a known limitation there, not redesigned.
- Any UI redesign or new product feature. The one exception, addressed directly in this stage per your explicit follow-up instruction, was the two confirmed reliability bugs below — both fixed as small, contained corrections, not redesigns:
  - **Session-expiration handling** (`public/app.js`): an expired/invalid token used to leave the student on a broken, half-loaded dashboard. Fixed by centralizing 401 detection in the app's one API helper (`handleSessionExpired()`), which now clears the session and returns to login with a clear message the moment any authenticated request comes back unauthorized, and by no longer switching to the dashboard screen until its data has actually loaded successfully.
  - **Browser back-button behavior**: the SPA previously pushed no history state at all, so the browser's own Back button left the app entirely. Fixed with the minimal navigation model you asked for — a history entry per major screen (login/dash/test/results, the screens the app already has), with Back/Forward moving between them, and an explicit guard so an accidental back-tap can never abandon an in-progress test (there is still no "exit test" control in the UI, so back mid-test now safely stays on the test rather than leaving it). No new screens, flows, or UI were introduced.
- The 122 known malformed `questions.correct` rows — unchanged, out of scope, as in every prior stage.
- Modifying the preserved master workspace, `source_library/`, `backups/`, or the live SQLite database.
- Production-scale infrastructure decisions (autoscaling, CDN, multi-instance rate-limiter storage) — those are Stage 8 concerns; Stage 7 only measures and reports what the current single-instance staging setup can honestly handle.

## 6. Execution sequencing

1. **Now (this sandbox, no staging URL needed):** build both tools (`scripts/stage7-load-test.js`, `scripts/stage7-browser-matrix-check.js`) against this plan; verify each locally against a disposable local server (both `DB_ENGINE=sqlite` and `DB_ENGINE=postgres`) at the lower tiers (10/25, and 50 where the sandbox can sustain it) to prove the tooling itself is correct — this is a tooling dry run, not the Stage 7 gate itself.
2. **After Stage 6D passes** against the real Railway staging URL: re-run both tools pointed at that real URL, ramping the load test through the full tier list (stopping early if a tier fails per Section 3), and running the full device/network matrix against the real deployed frontend.
3. **Report**, in the same format as every prior stage: what was tested, what passed, what failed, what's a capacity finding vs a launch blocker, and (if applicable) what's needed from you before Stage 8.
