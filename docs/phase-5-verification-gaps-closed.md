# Phase 5 — Closing the Two Carried-Forward Verification Gaps

**Date:** 2026-09-24
**Context:** `docs/phase-5-security-hardening-report.md` closed Phase 5 with two disclosed, outstanding items rather than silently claiming full coverage: (1) the CSP had been verified by static source analysis and the API-level regression suite, but not by an actual browser render checking for console violations; (2) the CORS allowlist's configured-origin-accepted / disallowed-origin-rejected behavior had been verified manually but not as an automated regression test. Per the explicit instruction to close both now rather than carry them into staging, this document records how each was closed and what was found.

---

## 1. Real-browser CSP verification

**Method:** this environment ships a pre-installed headless Chromium with Playwright configured to find it (`PLAYWRIGHT_BROWSERS_PATH`) — no external browser connection was needed this time, unlike the earlier attempt via `claude-in-chrome`, which requires the user's own connected browser and was unavailable. A new script, `scripts/browser-smoke-check.js`, drives that real headless Chromium against the real frontend (`public/index.html` + `app.js`), served by a real running instance of `server.js`, pointed at a disposable copy of the database (never the live one, never opened for writing by the script itself — see the script's own header comment for the exact safety contract).

**What it walks through, against real DOM elements with real clicks — not the API directly:**
1. Landing screen → switch to the "Create account" tab → pick ICSE → submit a real registration through the real form.
2. Dashboard renders with real diagnostics/summary data for the new account.
3. Select ICSE Mathematics (a subject with real gradable content) → start a Practice (immediate-feedback) test → answer every question through the real option buttons.
4. Submit → Results screen renders a real score.
5. Since this attempt lost marks, click "Improve My Score" → complete that test too → confirm the before/after comparison card renders.
6. Return to the dashboard → start a Board Simulation (deferred-feedback) test → confirm the mode badge says so → answer a question → confirm none of the correct/wrong reveal classes ever appear (only the plain "selected" class) → submit → Results again.
7. Log out → log back in through the real login form with the credentials from step 1.

Throughout, every browser console message, uncaught page error, and failed network request was captured.

**Run log (against a disposable copy of the live database, port 4620, never `boardready.db` itself):**
```
CSP header on document response: present, exact value:
  default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com; img-src 'self'; connect-src 'self'; object-src 'none';
  base-uri 'self'; frame-ancestors 'none'

1. Registration (Create account UI) -> dashboard reached
2. ICSE Mathematics selected
3. Practice test started, mode badge: "Practice · Instant feedback"
4. 10 questions answered -- both .opt.correct-pick and .opt.wrong-pick classes observed (immediate
   feedback genuinely renders both outcomes, not just one)
5. Results: "4 / 10 correct · 0 unanswered"
6. "Improve My Score" card visible (this attempt lost marks) -- clicked
   -> improvement test mode badge: "Board Simulation · No feedback until submit" (a real, deliberate
      design choice already documented in practice.js -- improvement tests are deferred-feedback)
   -> submitted -> Results reached, before/after comparison card visible
7. Back to dashboard -> Board Simulation test started, mode badge: "Board Simulation · No feedback until submit"
   -> answered one question -> reveal-class count: 0 (correct-pick/wrong-pick/correct-reveal never
      appeared) -> only the plain "selected" class present, exactly as feedback_mode=deferred requires
   -> jumped to the last question, submitted (25 unanswered, confirmed via the native dialog) -> Results reached
8. Logged out -> login screen shown
9. Logged back in via the real login form with the step-1 credentials -> dashboard reached again

SUMMARY:
  Total console messages: 1
  CSP violations: 0
  Page errors (uncaught exceptions): 0
  Failed requests: 1
    - https://fonts.googleapis.com/css2?family=...  net::ERR_TUNNEL_CONNECTION_FAILED

RESULT: PASS -- zero CSP violations across the full walkthrough.
```

**On the one failed request:** the Google Fonts stylesheet request failed with `ERR_TUNNEL_CONNECTION_FAILED` — this is this sandboxed session's own outbound-HTTPS egress policy blocking that destination (independently confirmed by the environment's own agent-proxy diagnostics logging the same rejection for `fonts.googleapis.com:443` at the same moment), not a CSP enforcement decision by the browser. A CSP violation and a network-level connection failure produce different, distinguishable signals: this run's console-message listener specifically watched for the former (`Content-Security-Policy` / `Refused to` text) and found zero; the fonts failure is a `requestfailed` network event with a `net::ERR_TUNNEL_CONNECTION_FAILED` reason, a different code path entirely. In a real staging/production environment with normal internet access this request would succeed exactly as the `style-src`/`font-src` directives already allow it to (confirmed separately in `security-headers.js`'s header comment and the original static scan). Noted here for completeness, not filed as a defect.

**A real, minor UI finding surfaced along the way (not a security issue):** after logout, the login/create-account tab toggle does not reset — if "Create account" was the last active tab before logout, the login screen re-shows with that tab still selected, so `#loginForm` stays hidden until the user (or, in the script, an explicit `#tabLoginBtn` click) switches back. Not a CSP, auth, or data-isolation issue — purely a small UX polish item, mentioned here since it was discovered during this exercise and shouldn't be lost.

**Verdict: zero CSP violations across the entire real-browser walkthrough.** This closes the gap — the CSP is now verified both by static source analysis (Phase 5's original work) and by an actual browser render exercising every major screen and mode. `scripts/browser-smoke-check.js` is kept in the repo (not run as part of `npm test` — it needs a real browser and a separately-started disposable server, exactly like the existing `verify-flow.js` pattern) so this same check can be re-run before staging/production rollout, or any time the CSP or frontend markup changes.

## 2. Automated CORS regression tests

**Before:** `test/security.test.js` had one CORS test — `ALLOWED_ORIGINS` unset (the default), confirming no CORS headers are ever sent. The allowlisted-and-configured behavior (an allowed origin accepted, a disallowed one rejected, a request with no `Origin` header at all) had only been verified manually via `curl` against disposable database copies during Phase 5's original implementation — never encoded as a test.

**After:** a new `describe` block, `security: CORS with ALLOWED_ORIGINS configured (dedicated server)`, spawns its own server with `ALLOWED_ORIGINS=https://boardready.example.com` actually set (on its own port and disposable database, isolated from every other suite in the file) and adds three tests:
- **allowed configured origin → accepted:** a matching `Origin` gets real `Access-Control-Allow-Origin`/`-Credentials`/`-Methods` headers on both a preflight `OPTIONS` and a normal `GET`, plus `Vary: Origin` (so a cache never serves one origin's CORS headers to another).
- **disallowed origin → rejected:** a non-listed `Origin` gets no CORS headers at all, on both a preflight and a normal request — and the normal request still gets its real `200` response, since CORS governs whether the *browser* lets the calling page read the response, never whether the server serves it in the first place.
- **missing Origin → appropriate behavior:** a request with no `Origin` header at all (same-origin, `curl`, server-to-server) is served normally, with no CORS headers and no error.

The fourth original checklist item, "unconfigured origin", is a different state — `ALLOWED_ORIGINS` unset entirely, not a particular Origin being disallowed by a configured list — and is exactly what the pre-existing default-off test already covers; it is referenced, not duplicated, in the new suite's comments.

**Verified:** `npm test` → **31/31 pass** (28 from the previous state + 3 new), live database hash and all 14 table row counts unchanged before and after.

---

## Closing status

Both gaps named in `docs/phase-5-security-hardening-report.md`'s "Outstanding" section are now closed:
- CSP: verified by an actual browser render, zero violations, reusable check committed as `scripts/browser-smoke-check.js`.
- CORS: all four checklist behaviors (allowed/disallowed/missing-Origin/unconfigured) now covered by automated tests in `test/security.test.js`, 31/31 passing.

The live database's SHA-256 (`cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52`) was re-verified unchanged after this work, exactly as after every other step in this project.

Phase 5 now has no outstanding verification gaps. The remaining deferred items — moving to `HttpOnly` cookies and adding token revocation — remain deliberately unimplemented pending the explicit authentication threat-model review requested before production (see the accompanying response for that review).
