# Phase 5 — Security Hardening: Implementation Report

**Date:** 2026-09-24
**Predecessor document:** `docs/phase-5-security-audit-report.md` (Step 1 — audit, no code changed). This report is Step 2: what was actually implemented against that audit's 14 items, with before/after evidence for each, what was deliberately deferred and why, and how everything was verified. Structured in the same item order as the audit, followed by a summary and an honest accounting of what's still outstanding.

**Discipline followed throughout, per the explicit instruction that opened this phase:** audit first (done, see the predecessor document), implement incrementally (five separate commits, one concern per commit), test each change (every commit's message states its own verification), never touch the known-good SQLite source. The live database, `boardready.db`, was never opened for writing at any point in this phase — every test run went through the Phase-4 test-database-isolation harness (`db.js`'s fail-closed guard + `test/*.test.js`'s self-configuring `NODE_ENV`/`DB_PATH` + `npm test`'s live-DB hash-and-row-count safety net), and every manual/curl-based verification ran against disposable copies of the database, never the original file. The live database's SHA-256 (`cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52`) was re-checked after every commit and is unchanged from the value recorded at the close of Phase 4.

---

## 1 & 2 & 13. `AUTH_SECRET` fallback, environment configuration, startup validation

**Implemented together** (commit `92ab2d3`), since 13 is what makes 1 a guarantee rather than a hope, and 2 is the natural home for both.

**Before:** `auth.js` — `const SECRET = process.env.AUTH_SECRET || 'dev-only-secret-change-me';`. No config module existed; nothing validated anything at startup.

**After:** a new `config.js` centralizes `NODE_ENV`, `PORT`, `AUTH_SECRET`, and `ALLOWED_ORIGINS`. In production (`NODE_ENV=production`) with no `AUTH_SECRET` set, `config.js` throws at require-time with a clear `FATAL:` message and the process refuses to start. In development/test with no `AUTH_SECRET`, it generates a random 32-byte secret for that process only (safe, since signing and verification happen in the same process during a dev/test run) and logs a warning that this is never acceptable in production. `auth.js` now imports `AUTH_SECRET` from `config.js` — the literal default string no longer exists anywhere in source.

**Verified:**
- `test/security.test.js` — `config.js: refuses to start in production with no AUTH_SECRET set` (spawns `node -e "require('./config')"` with `NODE_ENV=production, AUTH_SECRET=''`, asserts non-zero exit and the `FATAL:` message on stderr) and `config.js: starts cleanly in production once AUTH_SECRET is explicitly set` (same shape, real secret, asserts exit 0). Both pass.
- Manual runs during implementation: production + no secret → threw and refused to start; production + real secret → started normally; dev/test with no secret → warned and generated a random one, server ran normally.
- Full suite: 12/12 at the time of this commit; live database unchanged.

## 3. Login/register rate limiting

**Implemented** (commit `c9f0460`).

**Before:** no rate-limit code existed anywhere in `server.js` — grepped in full to confirm.

**After:** `rate-limit.js`, a small in-memory per-key sliding-window limiter (no external dependency), applied via `enforceRateLimit()` at the top of both `POST /api/auth/register` and `POST /api/auth/login` — 10 attempts / 15 minutes / client IP, returning `429` with a `Retry-After` header once tripped. A periodic cleanup (`rateLimit.cleanup()`, every 5 minutes, `unref()`'d so it never keeps the process alive on its own) prevents unbounded memory growth from stale keys. Documented, accepted limitation: in-memory state is single-process only — correct today since `node:sqlite`'s `DatabaseSync` already constrains this app to one process, but a future multi-instance deployment behind a load balancer would need a shared store (e.g. Redis).

**Before/after, reproduced directly (not just code-reviewed):**
```
# 12 rapid POST /api/auth/register calls against a disposable server, during implementation:
attempts 1-10  -> 201 Created
attempts 11-12 -> 429 Too Many Requests
```

**Verified:**
- `test/security.test.js` (dedicated server/port/db, isolated from the main suite's own auth calls) — `POST /api/auth/register — the 11th attempt ... is rejected with 429, with a Retry-After header` and `POST /api/auth/login — repeated failed attempts ... are rate-limited independently of the register limiter`, both passing, proving the two endpoints have independent limiter keys.
- Unit-level: `unit: rate-limit checkAndRecord allows up to maxAttempts then rejects, and a rejected attempt does not itself extend the window` and `unit: rate-limit checkAndRecord keys are independent`, both passing directly against `rate-limit.js`'s pure logic.

## 4. Authentication/session handling

**Reviewed — no code change; one tradeoff deliberately left for a separate decision (see "Deferred" below).** Password hashing (scrypt, random salt, `timingSafeEqual`) and token signing (HMAC-SHA256, `timingSafeEqual`-checked signature, checked expiry) were confirmed sound in the audit and are unchanged. The one real gap — no server-side token revocation, so a compromised or logged-out token stays valid until its 7-day expiry — is an architecture decision (a session store, or short-lived tokens + refresh tokens), not a hardening patch, and was explicitly flagged in the audit as **not** implemented in this phase.

## 5. Generic error responses (no raw `err.message` leaks)

**Implemented** (commit `c9f0460`).

**Before:** `server.js`'s error boundary — `sendJson(res, status, { error: err.message || 'Internal error' });` — ran unconditionally, including for genuine, unclassified 500s.

**After:** the boundary now branches on status. A deliberate error (any thrown `HttpError`, or a plain `Error` with a valid `.status` set — e.g. `practice.js`'s "no gradable questions available") still returns its own already-safe message exactly as before, unchanged. A genuine 500 (no valid status — a real bug, a thrown library exception, a null-pointer) is logged in full server-side via `console.error(err)` and the client receives a fixed `{"error":"Internal server error"}`, nothing else.

**Reproduced before and after, not just asserted:**
```
# BEFORE (against a disposable copy, prior to this fix):
POST /api/auth/login {"email":"real@user.com"}   # no password
-> 500 {"error":"The \"password\" argument must be of type string. Received undefined"}
   (a raw Node internal TypeError, verbatim, sent to the client)

# AFTER:
POST /api/auth/login {"email":"real@user.com"}   # no password
-> 500 {"error":"Internal server error"}
   (later made unreachable in the normal flow by item 8's input validation,
   which now catches this exact case earlier with a clean 400 instead —
   but the generic-500 boundary itself was verified independently, with
   item 8's validation temporarily bypassed, to confirm it closes the gap
   on its own merits, not only because a later fix happens to intercept it
   first)
```

**Verified:**
- `test/security.test.js` — `GET /api/attempts/:id/questions — a genuinely broken row (corrupted parts_json) produces a generic 500, never the raw internal error message`: seeds a case-kind question with deliberately invalid `parts_json` (`scoring.js`'s `flattenAll()` has no `try/catch` around that `JSON.parse` — a real, pre-existing crash path, not a synthetic throw), triggers it through the real server via `GET /api/attempts/:id/questions`, and asserts the response is *exactly* `{"error":"Internal server error"}`. The real `SyntaxError: Unexpected token 'N', "NOT VALID JSON {{{" is not valid JSON` is visible in the server's own stderr log (confirming the bug is genuinely reached and genuinely logged) but never reaches the HTTP response body. Passing.

## 6. CORS

**Implemented** (commit `b21240d`).

**Before:** no CORS headers anywhere — correct for same-origin-only, but with no path to a split-host deployment without a code change at that time.

**After:** `security-headers.js`'s `applyCors()`, gated by the `ALLOWED_ORIGINS` environment variable (comma-separated, never a wildcard). Unset (today's default): a no-op — no CORS headers are ever set, no `OPTIONS` preflight is ever intercepted, behavior is byte-for-byte identical to before this phase. Set: a request whose `Origin` matches the allowlist gets standard `Access-Control-Allow-*` headers (`Access-Control-Allow-Credentials: false`, since bearer tokens travel in a header, not a cookie — no credentialed CORS is needed), and a preflight `OPTIONS` request is answered directly with `204`.

**Reproduced directly, all three states:**
```
# ALLOWED_ORIGINS unset:
OPTIONS /api/auth/login  Origin: https://evil.example.com  -> 404 (falls through, no CORS headers at all)

# ALLOWED_ORIGINS=https://boardready.example.com:
OPTIONS /api/auth/login  Origin: https://boardready.example.com  -> 204, Access-Control-Allow-Origin: https://boardready.example.com
OPTIONS /api/auth/login  Origin: https://evil.example.com        -> 404 (falls through, no CORS headers — non-listed origin gets nothing)
GET     /                Origin: https://boardready.example.com  -> 200, Access-Control-Allow-Origin: https://boardready.example.com
```

**Verified:** `test/security.test.js` — `CORS: with ALLOWED_ORIGINS unset (the default), no CORS headers are ever sent — identical to pre-Phase-5 behavior`, passing.

**Update, 2026-09-24, same day — gap closed:** the original version of this report noted the configured-allowlist and rejected-origin cases were only verified manually, not as automated tests. A new dedicated-server `describe` block in `test/security.test.js` now covers all four cases from the original checklist: allowed configured origin → accepted (real CORS headers on both preflight and normal request, plus `Vary: Origin`), disallowed origin → rejected (no CORS headers, but still a real `200` — CORS gates browser readability, not server response), missing `Origin` → served normally with no CORS headers, and unconfigured (`ALLOWED_ORIGINS` unset entirely) → the pre-existing default-off test. `npm test`: 31/31 passing. See `docs/phase-5-verification-gaps-closed.md` for the full detail.

## 7. Secure cookies

**Reviewed — no code change to the core decision; a compensating control implemented instead.** No cookies are used; the auth token lives in `localStorage` and travels via `Authorization: Bearer`. Migrating to `HttpOnly` cookie-based sessions is a real frontend-and-backend architecture change (CSRF protection would become necessary, the SPA's `fetch` calls would need `credentials: 'include'`, cross-origin behavior changes) and was explicitly flagged in the audit as **not** implemented in this phase. What *is* implemented as a genuine, real-today mitigation of the risk this tradeoff creates (a successful XSS reading the token out of `localStorage`) is the Content-Security-Policy described under item 6/CSP work below — it makes injecting the script that would read `localStorage` meaningfully harder in the first place.

**The CSP itself** (commit `b21240d`), part of `applyBaselineHeaders()`:
```
default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; object-src 'none';
base-uri 'self'; frame-ancestors 'none'
```
Designed only after an exhaustive static scan of every resource-loading and dynamic-execution site in the real frontend (`public/index.html`, `public/app.js`, `public/style.css` — documented in full in `security-headers.js`'s header comment), not assumed safe: confirmed `script-src` can stay fully strict (one external same-origin script tag, zero inline scripts, zero inline event-handler attributes, zero `eval`/`Function`/`Worker` usage anywhere in `app.js`); confirmed `style-src` genuinely needs `'unsafe-inline'` for two existing inline `style="..."` attributes the app injects via `innerHTML`; traced the one JS-driven `<img src=...>` assignment (the diagram-crop feature) through to `server.js`'s `tryServeExtractedDiagram()` and confirmed it's served same-origin, so `img-src 'self'` is correct today and remains correct once that (currently-unpopulated) feature has real data; confirmed the single `fetch()` helper (`public/app.js`) only ever calls relative same-origin paths, so `connect-src 'self'` covers every network call the app makes.

**Update, 2026-09-24, same day — gap closed:** the original version of this report disclosed that the CSP had not been verified by an actual browser render (this session had no connected Chrome browser via `claude-in-chrome`). That gap has since been closed using this environment's own pre-installed headless Chromium via Playwright (`scripts/browser-smoke-check.js`) — a real browser, driving the real frontend, against a real running server on a disposable database copy, walking through registration, dashboard, a full Practice test with immediate feedback, Results, Improve My Score, a Board Simulation (deferred-feedback) test, logout, and login. **Zero CSP violations observed.** Full run log, methodology, and the one unrelated (non-CSP) finding are in `docs/phase-5-verification-gaps-closed.md`. The script is kept in the repo for re-use before staging/production rollout or any future frontend/CSP change.

## 8. Input validation

**Implemented** (commit `05b16a9`).

**Before:** `POST /api/auth/login` never checked that `email`/`password` were present or were strings before calling `auth.verifyPassword` (a missing/non-string password reached `crypto.scryptSync` directly and threw a raw internal `TypeError`, pre-item-5-fix). No maximum length was enforced on `name`/`email`/`password` at registration. Numeric route parameters (`subjectId`, `chapterId`, `count`, `test_id`, attempt `id`, etc.) were coerced with a bare `Number(x)`, silently producing `NaN` on bad input rather than a clean error.

**After:** two shared helpers — `isNonEmptyString(v, maxLength)` and `requirePositiveInt(value, label)` (throwing a `400 HttpError` naming the offending field). Login now validates `email`/`password` up front. Registration enforces explicit max lengths (`name` ≤200, `email` ≤320, `password` ≤256 — a real DoS mitigation, since `scryptSync`'s cost scales with input length, not a password-strength requirement, which remains an explicit non-goal per the audit). Every previously-bare `Number(x)` on a client-supplied id/count across `GET /api/chapters`, `POST /api/practice/generate`, `POST /api/tests/generate`, `POST /api/tests/improve`, `POST /api/attempts`, all four attempt-scoped routes (`:id/questions`, `/answers`, `/check`, `/submit`), and the three diagnostics routes now goes through `requirePositiveInt`.

**Before/after, reproduced directly:**
```
# BEFORE:
GET /api/chapters?subject_id=not-a-number  -> empty/undefined-shaped result, no error

# AFTER:
GET /api/chapters?subject_id=not-a-number  -> 400 {"error":"subject_id must be a positive integer"}
```

**Verified:** full suite 12/12 at the time of this commit; `verify-flow.js` (the existing end-to-end smoke script) still clean, proving valid real input is completely unaffected; live database unchanged. `test/security.test.js`'s login-validation tests (`missing password`, `missing email` → clean `400`) additionally cover this item directly.

## 9. Authorization / student-teacher isolation

**Reviewed — no issue found in the audit; now also regression-tested.** All four attempt-scoped routes were already independently confirmed to check `attempt.student_id !== user.id`. No code change was needed.

**Verified:** `test/security.test.js` — `GET /api/attempts/:id/questions — a different student is rejected with 403, never allowed to read another student's attempt`: student A creates a practice attempt, student B's token is used to request it, asserts `403` with the exact "Not your attempt" message. Passing. (There is still no teacher-facing data-access route in the codebase at all — that remains a real gap to audit *when* that feature is built, not something this pass could test today, exactly as the original audit noted.)

## 10. Answer-key leakage audit

**Reviewed — no leak found in the audit; now also regression-tested.** `publicStepView()` already stripped both `correct` and `explanation` from every pre-submission step. No code change was needed.

**Verified:** `test/security.test.js` — `GET /api/attempts/:id/questions — the answer key (correct) and explanation are absent from every step before submission`: asserts `'correct' in step === false` and `'explanation' in step === false` for every step in a freshly generated practice attempt. Passing.

## 11. `feedback_mode` server-side enforcement

**Reviewed — already genuinely enforced in the audit; now also regression-tested both ways.** `POST /api/attempts/:id/check` already loaded the test's `feedback_mode` and rejected with `403` when it wasn't `'immediate'`, before even looking at the submitted answer. No code change was needed.

**Verified:** `test/security.test.js` — two paired tests. `POST /api/attempts/:id/check — rejected with 403 on a Board Simulation (feedback_mode=deferred) test, even with an otherwise-valid key/answer` generates a real deferred test via `POST /api/tests/generate`, confirms `feedbackMode === 'deferred'` on the response (so the test is actually exercising a real deferred test, not assuming one), then confirms `/check` on it returns `403` mentioning "Board Simulation". Its pair, `... the SAME question in an immediate-feedback (Practice) test is checkable normally`, proves the `403` above is specifically about `feedback_mode` and not the endpoint being broken generally. Both passing.

## 12. Logging hygiene

**Reviewed — no issue found in the audit, no code change.** `logEvent()`'s two call sites write only non-sensitive derived fields; `console.error(err)` (item 5's genuine-500 path) logs the error object itself, never a raw request body, so a submitted password can't reach server logs through that path. Kept true by discipline (never log request bodies wholesale) going forward, not by a specific code guard, exactly as the audit noted.

## 14. Security regression test suite

**Implemented** (commit `51012af`) — `test/security.test.js`, 16 new tests across two `describe` groups (a main integration suite on one spawned server/database, and a dedicated rate-limiting suite on its own separate server/database/port so hammering the limiter there can never interfere with the main suite's own register/login calls), plus standalone unit tests for `rate-limit.js`'s pure logic and `config.js`'s startup behavior. Built through the exact same test-database-isolation harness `test/readiness.test.js` established in Phase 4 — `NODE_ENV`/`DB_PATH` set on `process.env` before requiring anything from the backend, `db.DB_PATH !== db.LIVE_DB_PATH` and `db.IS_TEST_MODE` asserted at require-time, every spawned server child process given its own explicit env rather than inherited — never the live database at any point.

**Full list of what it covers**, each corresponding to a specific item above: rate limiting trips at the configured threshold on both register and login, independently (3); `config.js` refuses to start in production with no `AUTH_SECRET`, and starts cleanly with one (1/2/13); a malformed login gets a clean `400` (8); a genuinely broken row produces exactly the generic `500` message, never the raw internal error (5); `feedback_mode='deferred'` really blocks `/check`, proven against a matching immediate-mode control case (11); cross-student attempt access is really rejected (9); the answer key is really absent pre-submission (10); baseline security headers are present on every response (6/7); CORS stays fully off by default (6).

**Verified:** `npm test` → **28/28 pass** (12 pre-existing + 16 new) at the time this file was first written; now **31/31** after the CORS-configured suite described below was added the same day. Live database hash and all 14 table row counts unchanged before and after every run.

---

## Summary — what changed, what's deferred, what's still outstanding

**Implemented and verified this phase:**
1. `AUTH_SECRET` fallback removed; production refuses to start without one (`config.js`, `auth.js`) — items 1, 2, 13.
2. Login/register rate limiting, 10/15min/IP, `429` + `Retry-After` (`rate-limit.js`) — item 3.
3. Generic `500` responses for genuinely unexpected errors; deliberate errors unchanged (`server.js`) — item 5.
4. Opt-in, off-by-default CORS allowlist (`security-headers.js`) — item 6.
5. Baseline security headers incl. CSP, as a compensating control for the `localStorage`-token tradeoff (`security-headers.js`) — items 6, 7.
6. Input validation: login presence checks, registration length caps, `requirePositiveInt` on every numeric route parameter (`server.js`) — item 8.
7. A security regression test suite, `test/security.test.js` — 16 tests at first commit, now 19 after the CORS-configured additions below — item 14.
8. **(Added same day, closing two carried-forward gaps)** A real-browser CSP verification (`scripts/browser-smoke-check.js`, headless Chromium via Playwright, zero violations across a full registration/dashboard/Practice/Board-Simulation/Improve-My-Score/logout/login walkthrough) and automated CORS tests for all four checklist cases (allowed/disallowed/missing-Origin/unconfigured). Full detail in `docs/phase-5-verification-gaps-closed.md`.

**Deliberately deferred, pending a separate explicit decision — not implemented in this phase:**
- Moving auth tokens from `localStorage`/bearer to `HttpOnly` cookies (item 7's core question) — a real frontend-and-backend architecture change (CSRF protection, `credentials: 'include'`, cross-origin behavior), not a hardening patch.
- Server-side token revocation / short-lived tokens + refresh tokens (item 4's core question) — same category: a real architecture change, not something to fold into this pass.
- Both of these are now the subject of an explicit pre-production authentication threat-model review requested separately — see that review for the concrete answers (where the token lives, how long it lives, whether it's exposed to JavaScript, what happens on logout, whether a stolen token can remain valid, how teacher/student permissions are enforced, and the overall threat model) and a recommendation on whether the current mechanism is acceptable for the chosen deployment model or needs to change before launch.

**Confirmed already sound in the audit, unchanged, now also regression-tested where practical:** password hashing and token signing (4); student-to-student attempt isolation (9); pre-submission answer-key protection (10); `feedback_mode` server enforcement (11); logging hygiene (12, by discipline rather than a specific guard).

**No outstanding verification gaps as of the same-day update below.** The two items originally disclosed here — the CSP not yet checked in a real browser, and the CORS allowlist's configured-behavior not yet automated — were both closed the same day; see item 7's and item 6's "Update, 2026-09-24" notes above and `docs/phase-5-verification-gaps-closed.md` for the full account.

**Still flagged, not a gap in this phase's own scope:** no teacher-facing data-access route exists yet in the codebase at all, so "teacher accessing student data" isolation (part of item 9's original scope) remains unauditable until that feature is built.

**Standing rule, honored throughout:** the live SQLite database (`boardready.db`) was not opened for writing at any point in this phase. Its SHA-256 (`cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52`) is unchanged from Phase 4's close and was re-verified after every commit in this phase, including the gap-closure work described above.
