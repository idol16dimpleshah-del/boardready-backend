# Board Ready redesign — PostgreSQL and browser verification (2026-10-18)

## Commits and working tree

- **Commit under test:** `0fc0365` (the redesign), plus two separate fix commits on `redesign/board-ready-2026-ui`:
  - `5d5d112` — UI fixes for the issues this verification found
  - `d09dc7f` — updated browser scripts and a portable Postgres test helper
- **Final re-runs:** every check in the tables below was re-run on the final code at `d09dc7f` before this report was written.
- **Untracked, preserved as instructed:** `run-qa.cmd` and `.claude/` (QA launchers).
- **Unchanged:** `package.json` and `package-lock.json`. Playwright was installed with `--no-save`.
- **Not done:** no merge into `claude/new-session-k86x3s`, no push, no Railway deploy, and no production database access.

## Environment

- **Database:** an isolated, throwaway **PostgreSQL 16.14** cluster, created with `initdb` in `%TEMP%\br-pg-verify`, listening only on 127.0.0.1:55432 with trust auth.
  - It is separate from the two pre-existing local Postgres servers (16 on 5432, 18 on 5433), which were not touched.
  - PG16 matches the version the project's own Stage 6A/6B Postgres validation used. Production's exact Railway version was not queried.
- **Schema:** `docs/phase-3-migration-artifacts/schema.sql`.
- **Representative data:** a disposable copy of the Sept 23 snapshot, migrated with the repo's own `scripts/stage6b-migrate.js` into `boardready_verify_qa`.
  - Result: 4,824 questions migrated and 122 skipped by the script's integer-column validation. Production reportedly holds 4,825.
- **Browser:** installed Google Chrome, driven by Playwright 1.48.2 (`PW_CHANNEL=chrome`), plus the Claude built-in browser pane for hands-on QA.

## Test totals

| Suite | Engine | Result |
|---|---|---|
| `npm test` (live-DB guard) | SQLite | **79/79 pass**, 0 fail, 0 skipped, 0 cancelled; guard OK |
| `npm test` (live-DB guard) | **PostgreSQL 16** | **79/79 pass**, 0 fail, 0 skipped, 0 cancelled; guard OK; 17 disposable `boardready_test_*` databases |
| `scripts/browser-smoke-check.js` | PostgreSQL server | **PASS**: 0 CSP violations, 0 page errors, 0 failed requests, 0 console messages |
| `scripts/stage7-browser-matrix-check.js` | PostgreSQL server | **PASS**: Desktop, iPad Pro 11, iPhone 13, iPhone 13 on slow 3G; plus backButton, sessionExpiration, autosaveResume, errorState |

- This matches the previously reported 79 passing tests, now on both engines.
- **First Postgres run failed (environment, not app):** 7 pass, 12 fail, 60 cancelled, all "permission denied for table subjects". My portable mode had loaded the schema as the superuser while the app connected as `boardready_migration`. Fixed in `d09dc7f`: the schema is now loaded as the app role, as in a real deployment.
- **One smoke run errored (environment, not app):** registration timed out at the dashboard because the server's register rate limit (10 per 15 min per IP) had been used up by earlier runs. A probe minutes later returned 201, and the re-run passed.

## Backend and SQL verified on PostgreSQL

- **Saved-result reopening (`GET /api/attempts/:id/result`):**
  - Automated: equality with the submit response, 409 before submit, 404 for another student, 401 without a token.
  - In the UI after a page reload: the practice attempt reopened at 5/13 with 8 review items; the retest reopened on the Improve screen; time taken was computed from Postgres timestamps.
- **Chapter question counts (`gradableCount`):** the automated test passes; the UI shows live counts (for example GST 66, Quadratic Equation 101) and disables empty chapters.
- **Scoring:**
  - The UI score matched the API (5/13).
  - Marks lost (8) equalled both the topic-table sum and the per-question API sum.
  - A deliberate double-click on Submit produced exactly one `POST /submit`.
  - The Postgres regression suite's concurrent-submit and concurrent-`/check` tests pass.
- **Retest selection:** checked independently with SQL against Postgres for attempt 324 (source 323):
  - 12 questions, 0 previously seen, 0 overlapping the source attempt, all from the weak chapter;
  - this matches the UI's "All 12 questions were new to you".

## Hands-on UI QA (Postgres-backed server, real clicks, taps and keys)

- **Login:** board toggle (stats update), validation, demo account, logout and login.
- **Dashboard:**
  - honest empty state for a new student;
  - after unlocking the (demo) report: ranked rows, a mission backed by the student's own answers, and readiness equal to the API value.
- **Practice:** subject chips, the "coming soon" subject, live chapter counts, Board Simulation meta and disclosure.
- **Test:**
  - instant feedback showing the bank's explanation;
  - flagging, navigator jumps, keyboard shortcuts, two questions left unanswered;
  - submit dialog counts and focus, Save & exit, resume.
- **Board Simulation:** 0 reveal classes, the feedback panel stayed hidden, and the disclosure shows on results.
- **Results:** score, marks lost, metrics, topic diagnosis, review, history, readiness before→after (48→32 and 36→36).
- **Improve My Score:** comparison, freshness note, topic tables, an honest decline (−3 points).
- **Mobile (390 × 844):** dashboard, test, navigator drawer, results and Improve, all with real taps; the overflow check found no elements past the viewport.

## Defects found and fixed (`5d5d112`)

1. **Missing Board Simulation disclosure:** practical and internal-assessment marks were not stated as excluded. Disclosures were added to the Practice card and the results page.
2. **Readiness before→after overwritten:** a stale count-up animation replaced "48→32" with "48".
3. **Readiness and progress bars stuck at 0:** when animation frames are paused (hidden tab or embedded view), they never updated. Both now use a timer fallback.
4. **Resumed attempts claimed a "first readiness score":** the pre-test value was not captured on resume; it is now.
5. **Misleading copy:**
   - all-unanswered topics said "No correct answers here yet";
   - "N questions answered" counted blanks.
   Both corrected.
6. **Decline shown in green:** the current-attempt card used success colours even when the score fell.
7. **Missing accessible names:** answer options and the flag button had no explicit names; `aria-label`s were added.

## Board Simulation safeguards

- **No blueprint concept** exists anywhere in the codebase, and none was added or activated.
- **No scoring rules invented:**
  - `scoring.js`, `readiness*.js`, `diagnostics*.js`, `retest*.js`, `content-rules.js`, both database engines, `auth.js` and `security-headers.js` are all unchanged in every commit.
  - The UI displays only server values and plain arithmetic on them: marks lost = max − score, and per-topic sums of the server's `marks`.
- **Answers stay hidden until submit:** Board Simulation reveals nothing before submit. This is enforced server-side (`/check` returns 403) and was verified in the UI and by both scripts.
- **Scope disclosed:** a clear disclosure that the practical/internal portion is not simulated now appears on the Practice card and on Board Simulation results.

## Diff review (`cc4102d..d09dc7f`)

- **New route:** `GET /result` is student-only, owner-checked (404 for anyone else), and read-only. It reveals answers only for submitted attempts, the same as submit.
- **Writes:** no new write paths. The improve route inserts tests exactly as before.
- **No new HTML injection:** every dynamic string written into the page is escaped. The CSP is unchanged and recorded zero violations.
- **Compatibility:** response fields are only added, never removed or reordered; there is no schema change.
- **Data:** `boardready.db` and the original preservation backup both hash to `27514330…`, the value recorded in the Phase 2 report. All QA writes went to disposable copies and the throwaway cluster.

## Screenshots (`docs/verification-2026-10-18-screenshots/`)

- **Postgres, 1440 px:** login, dashboard, practice feedback, results with readiness before→after, Board Simulation results with disclosure, Improve (decline).
- **Postgres, 390 px:** dashboard, practice feedback, navigator drawer, Improve (decline).

## Remaining blockers and limitations

1. **Linked verification session never started:** it needs the repository trusted in Claude Desktop (see below). This session did the work directly instead.
2. **Production Postgres version not confirmed** (staging/production on Railway was deliberately not touched). Next step: read the version from Railway, or run this suite on a staging clone.
3. **Data snapshot is from Sept 23:** it is not the current production content, and Oct 15 promotions are absent.
4. **No automated axe accessibility scan.** Names, focus and dialogs were checked manually.
5. **Known, pre-existing issues, not changed:**
   - the `single-subject` plan key mismatch;
   - no server-side time-limit enforcement;
   - "Topics improved" requires 100% correct (backend rule).

## Recommendation

**GO for staging. NO-GO for production merge until a staging run passes.**

The code is verified on SQLite and on an isolated PostgreSQL 16 copy of real data. Every redesign and backend risk raised in this phase has been exercised, and the defects found are fixed in separate commits. Production approval should wait for one staging pass against current production content and the real Railway Postgres version. Merging into `claude/new-session-k86x3s` deploys automatically, so that merge needs explicit approval.
