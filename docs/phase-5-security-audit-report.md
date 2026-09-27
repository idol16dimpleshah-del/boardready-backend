# Phase 5 — Security Hardening: Audit (Step 1, before any code changes)

**Date:** 2026-09-24
**Method:** direct inspection of the real, running codebase (`server.js`, `auth.js`, `db.js`, `practice.js`, `diagnostics.js`, `readiness.js`, `retest.js`, `scoring.js`, `public/*.js`) — every finding below is grounded in an actual file read or grep, not an assumption. No code was changed while producing this document. Structured against the 14 items requested, in the same order.

---

## 1. Remove the development fallback for `AUTH_SECRET`

**Confirmed issue.** `auth.js` line 8: `const SECRET = process.env.AUTH_SECRET || 'dev-only-secret-change-me';`. No `.env` file exists in this environment, so every token signed today uses the literal, publicly-visible-in-source default secret. Anyone who has read this repository (which is everyone, since it's the actual deployed source) can forge a valid auth token for any `userId`/`role` right now. This is the single highest-severity finding in this audit.

**Fix planned:** remove the string fallback; require a real `AUTH_SECRET` whenever the process would actually serve traffic, and fail closed (refuse to start) rather than silently using a known-weak default. Tied to item 13.

## 2. Establish proper environment configuration

**Confirmed gap.** There is no centralized config module and no startup validation anywhere — `server.js` reads `process.env.PORT` inline with a default, `auth.js` reads `process.env.AUTH_SECRET` inline with a fallback, and nothing validates either at process start. `.env.example` documents the intended variables but nothing loads or enforces them.

**Fix planned:** a small `config.js` that centralizes reading `PORT`, `AUTH_SECRET`, and `NODE_ENV`, and performs startup validation (item 13) — kept deliberately separate from `db.js`'s own environment handling (its test-isolation guard, built in Phase 4, is a different, already-hardened concern and should not be touched here).

## 3. Add login/register rate limiting

**Confirmed missing.** `POST /api/auth/login` and `POST /api/auth/register` have no throttling of any kind — grepped `server.js` in full, no rate-limit code exists anywhere. Combined with `scryptSync` being deliberately slow (already flagged in the Sep 23 production-readiness audit), this is both a brute-force vector and a CPU-exhaustion vector: a client can force the server to perform expensive password hashing an unlimited number of times per second.

**Fix planned:** a small in-memory, per-IP sliding-window limiter on `/api/auth/login` and `/api/auth/register` — no external dependency, consistent with this project's zero-runtime-dependency design. In-memory is an accepted, documented limitation for a single-process deployment (see item 4's note on statelessness); a multi-instance deployment would need a shared store, which is out of scope until the app actually runs on more than one instance.

## 4. Review authentication/session handling

**Reviewed — sound design, one documented tradeoff, no code change planned here.**
- Passwords: `scrypt` with a random 16-byte salt per user, 64-byte derived key, compared via `crypto.timingSafeEqual` — correct, real, not a placeholder.
- Tokens: HMAC-SHA256 signed, base64url payload `{userId, role, exp}`, signature checked with `timingSafeEqual` before the payload is even parsed, expiry checked (`payload.exp < Date.now()`) — a sound hand-rolled scheme for this project's stated "no external JWT library" position.
- **Statelessness / no revocation:** there is no server-side session store, so a token cannot be individually revoked before its 7-day expiry (e.g., after a password change or a suspected compromise) — logout (`public/app.js` line 76) only clears the client's own `localStorage`, it doesn't invalidate the token itself. This is a real, standard tradeoff of stateless bearer tokens, not an oversight, and fixing it properly (a server-side revocation list, or short-lived tokens + refresh tokens) is a bigger architectural change than "hardening" — flagged here for a conscious decision, not silently changed.

## 5. Stop returning raw `err.message` in production responses

**Confirmed issue.** `server.js`'s single error boundary (line 664): `sendJson(res, status, { error: err.message || 'Internal error' });` runs for every error, including genuine 500s. Every case actually observed in this codebase throws a deliberately safe message (e.g. "This attempt was already submitted"), so no concrete leak was found in this audit — but an unexpected error (a bug, a null-pointer, a library exception) would echo its raw internal message straight to the client the day it happens, and there is nothing today that would catch that before it goes out.

**Fix planned:** for a genuine 500 (unclassified error, not a deliberate `HttpError`/status-bearing error), send a fixed generic message to the client and keep the full detail server-side only (`console.error`, unchanged). Deliberate 4xx errors keep their existing, already-safe messages exactly as today — this changes nothing about any currently-passing test's expected error text.

## 6. Review CORS

**Reviewed — no CORS headers exist anywhere today.** Correct and safe for the current architecture: frontend (`public/`) and backend are served from the same origin/port. This becomes a real question the moment staging or production splits them across hosts (a separately-hosted API), which hasn't happened yet.

**Fix planned:** add a conservative, opt-in CORS layer gated by an `ALLOWED_ORIGINS` environment variable — a no-op (no CORS headers at all, current behavior preserved exactly) when unset, and an explicit allowlist (never a wildcard) when it is. This makes the split-host case something staging can turn on by setting one variable, without changing today's behavior or taking on any risk now.

## 7. Review secure cookies

**Reviewed — no cookies are used anywhere.** The auth token is returned in the JSON response body and stored client-side in `localStorage` (`public/app.js`, keys `br_token`/`br_user`), then sent back via `Authorization: Bearer`. This is the same tradeoff already named in the Sep 23 production-readiness audit: a successful XSS on this origin could exfiltrate a student's token, whereas an `HttpOnly` cookie would not be readable by injected JavaScript at all.

Migrating to cookie-based sessions is a real frontend-and-backend architecture change (CSRF protection would then be needed, cross-origin behavior changes, the SPA's fetch calls would need `credentials: 'include'`, etc.) — **not** something to fold into a hardening pass without a deliberate decision, so it is not implemented here. What *is* in scope and genuinely reduces this exact risk: a Content-Security-Policy header restricting script sources, which makes the XSS this tradeoff depends on meaningfully harder to pull off in the first place. Implemented under item 6's header work (see below) as a compensating control, not a replacement for the underlying decision.

## 8. Review input validation

**Confirmed gaps**, none of them currently exploitable beyond an ugly error, but worth closing:
- `POST /api/auth/login` never checks that `email`/`password` are present or are strings before calling `auth.verifyPassword` — a missing or non-string `password` reaches `crypto.scryptSync(password, ...)`, which throws a raw Node internal-API TypeError that (per item 5, before that fix) would currently be echoed straight to the client as a 500.
- No maximum length is enforced on `password` (or `name`/`email`) at registration — since `scryptSync`'s cost scales with input, an absurdly long password is a real (if bounded by the existing 2MB body cap) amplification of the CPU-exhaustion concern in item 3.
- Numeric query/body parameters (`subjectId`, `chapterId`, `count`, etc.) are coerced with a bare `Number(...)` with no `isFinite`/range check; a non-numeric value silently becomes `NaN`, which then either matches nothing (safe, if unhelpful — returns an empty result rather than an error) or, for `count`, could produce a nonsensical `Math.min(NaN, pool.length)`. No security impact found (nothing bypasses gradability or ownership checks this way), but it produces confusing, undefined behavior for malformed input where a clean `400` would be correct.

**Fix planned:** explicit presence/type checks on login (mirroring what register already does), a sane max length on `password` (and `name`/`email`), and `Number.isFinite` validation on the numeric params above, returning `400` instead of silently proceeding with `NaN`.

## 9. Review authorization/student-teacher isolation

**Reviewed — no issue found.** Every attempt-scoped route (`/api/attempts/:id/questions`, `/answers`, `/check`, `/submit`) explicitly checks `attempt.student_id !== user.id` and returns `403` otherwise — verified by reading all four handlers directly, not assumed from one. None of the diagnostics/readiness routes accept a client-supplied student id at all; they always derive the subject from `requireAuth`'s token payload (`user.id`), so there is no ID-substitution path to another student's diagnostics or readiness data. There is currently no teacher-facing data-access route at all (the admin/teacher Content Review tool is still on the project's open task list, unbuilt) — so "teacher accessing student data" isn't yet a real code path to audit; when that tool is built, it needs its own authorization audit at that time, separate from this one.

## 10. Audit API responses for accidental answer-key leakage

**Reviewed — no leak found**, and the existing design is already deliberate about this: `publicStepView` (server.js) strips both `correct` and `explanation` from every step sent before an attempt is submitted, with an explicit comment about why `explanation` specifically has to be stripped too (some explanations spell out the answer in text). `POST /api/attempts/:id/check` only reveals the answer for the one step just answered, and only when `feedback_mode === 'immediate'` (see item 11). `POST /api/attempts/:id/submit` sends the full answer key only after grading is complete. `diagnostics.js`/`readiness.js`/`retest.js` only ever expose derived booleans/percentages computed from a student's own already-submitted attempts — never the raw answer-key value of a question. No fix needed; a regression test will be added (item 14) to keep this true going forward, not just true today.

## 11. Verify Practice/Board Simulation `feedback_mode` server enforcement

**Reviewed — genuinely enforced server-side**, not just by the frontend not calling the endpoint: `POST /api/attempts/:id/check` (server.js line ~342) loads the test's `feedback_mode` from the database itself and throws `403` if it isn't `'immediate'`, before it ever looks at the submitted answer. A regression test will exercise this directly (item 14): generate a deferred/Board-Simulation test, call `/check` on it, assert `403`.

## 12. Review logging for secrets/sensitive data

**Reviewed — no issue found today.** `logEvent()` writes exactly four fields to `audit_log.details_json` across its two call sites (`attempt_submitted`: attemptId/score/maxScore/answeredCount/totalSteps; `readiness_viewed`: examReadinessScore/evidenceLevel) — nothing sensitive. `console.error(err)` fires only for genuine 500s and logs the error object itself, never a raw request body, so a submitted password never reaches server logs through that path either. No fix strictly required; keeping this true going forward is a matter of discipline (never log `req` bodies wholesale) rather than a code change, noted here so it isn't lost.

## 13. Add startup validation for required production secrets/configuration

**Confirmed missing**, and this is the piece that actually makes item 1 a *guarantee* rather than a hope: today, if `AUTH_SECRET` is unset, the app starts up fine and quietly signs every token with the known default forever. **Fix planned:** at real server startup only (never during `require('./server')` for tests, and never inside `db.js`'s already-separate test-isolation guard), validate that `AUTH_SECRET` is set to something other than the historical dev default whenever `NODE_ENV === 'production'`; refuse to start otherwise, with a clear error naming exactly what's missing.

## 14. Add security-focused regression tests

**Planned**, run through the same isolated test harness built and verified in Phase 4 (`db.js`'s fail-closed guard, `test/readiness.test.js`'s pattern of self-configuring `NODE_ENV`/`DB_PATH`, `npm test`'s live-DB hash safety net) — a new `test/security.test.js`, never touching the live database, covering: rate limiting trips after N attempts; a malformed login request gets a clean `400`, not a raw 500; a genuine 500 never echoes an internal error message; `feedback_mode='deferred'` really blocks `/check`; cross-student attempt access is really rejected; the answer key is really absent from pre-submission responses.

---

## Summary — what changes, what doesn't

**Will implement** (uncontroversial, no architecture change, each independently testable): remove the `AUTH_SECRET` fallback + startup validation (1, 2, 13); rate limiting on auth endpoints (3); generic 500 messages (5); an opt-in, off-by-default CORS allowlist (6); baseline security response headers including CSP as a compensating control for item 7 (7); input validation on login + numeric params + length caps (8); a new security regression test file (14).

**Will NOT implement without a separate, explicit decision** (real architecture changes, not "hardening"): moving auth tokens from `localStorage`/bearer to `HttpOnly` cookies (7); adding token revocation / short-lived + refresh tokens (4). Both are documented above with the tradeoff spelled out.

**Confirmed already sound, no change needed:** password hashing and token signing (4); student-to-student data isolation (9); pre-submission answer-key protection (10); `feedback_mode` server-side enforcement (11); logging hygiene (12).

Per the standing rule for this whole project: the live SQLite database (`boardready.db`) is not touched by this audit and will not be touched by the implementation work that follows — every change here is to application code and new test files, verified against the isolated test database exactly as Phase 4 established.
