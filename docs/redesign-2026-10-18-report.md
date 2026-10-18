# Board Ready 2026 UI redesign — engineering report (2026-10-18)

Branch: `redesign/board-ready-2026-ui`, cut from `claude/new-session-k86x3s` @ `cc4102d`
(the branch production deploys from). **Nothing committed or pushed.** Pushing to
`claude/new-session-k86x3s` would trigger a production deploy, so that is a founder decision.

## 1. What the original implementation was missing

- **Dashboard.** It was a stack of generic cards: activity counter, subject bars, and a chapter list.
  - There was no single next action.
  - The Readiness orb was flat and was not the dashboard's focal point.
  - There were no ranked "where you can gain marks" rows.
- **Test screen.** The question sat in a narrow centred card, with a dot-track navigator and no numbered grid, legend or counts. Most of the desktop viewport was empty.
  - Submit used `window.confirm`.
  - There was no exit or resume control.
- **Results.** There was no score hierarchy, no marks-lost figure, and no per-topic marks table.
  - Results could only be seen once, straight after submit. There was no way to reopen a past attempt.
  - The Results nav item did not exist.
- **Improve My Score.** It was a small card on the results page, not a screen. There was no topics-improved / still-requiring-practice split and no freshness disclosure.
- **Content availability.** Chapters with zero live questions were offered for practice and returned 422.
- **Backend gaps:**
  - `perQuestion` had no marks.
  - There was no results re-fetch endpoint.
  - Retests excluded only the source attempt's questions.
  - Nothing disclosed when a retest reused questions.
  - Resumed practice attempts could omit checked answers from the submit body, which skews diagnostics.

## 2. Agents used

| Agent | Delivered |
|---|---|
| Explore — API contract | Read-only map of every route, the Practice vs Board Simulation enforcement, readiness and diagnostics shapes, and backend gaps, with file:line references. |
| General-purpose — backend (owned `server.js`, `practice.js`, a new test file) | `marks`/`kind`/`questionType` on `perQuestion`; `GET /api/attempts/:id/result` via a shared builder; `improvesAttemptId` on `/attempts/me`; fresh-first retest selection plus `freshness`; 7 new tests. |
| Lead (this session) | Design system, all three frontend files, `gradableCount` on `/api/chapters` with a test, integration, browser QA, and this report. |

Frontend work was not split across agents. It lives in three tightly coupled files, so parallel edits would have collided.

## 3. UI and UX changes (`public/index.html`, `style.css`, `app.js`, all rewritten)

- **Design system.** Token-based dark graphite theme with a full light counterpart. Sora headings, Inter body, JetBrains Mono for the timer. One button, chip and pill system. Visible focus rings. Reduced-motion support.
- **Readiness Core.** Layered violet/cyan sphere with a lat/long grid, orbital rings and a progress arc. It shows a real value, a real before→after comparison, or an honest empty state.
- **App shell.** Brand, Dashboard / Practice / Results nav, CBSE/ICSE toggle, theme toggle, and an account menu.
- **Dashboard.**
  - "Your next move" with one Today's Mission, chosen from data: weakest attempted chapter, then last-practised chapter, then the first chapter with live questions.
  - The mission shows the real question count and time limit, `max(300 s, 90 s × n)`.
  - The Readiness Core is labelled "all subjects".
  - Compact ranked "where you can gain marks" rows. Too few answers is labelled "Too few answers", never shown as a poor score.
  - A resume strip for unfinished tests.
- **Practice.** A Practice Test vs Board Simulation explainer and per-subject chapter list showing live question counts. Empty chapters are disabled, and empty subjects are marked "coming soon" with simulation disabled.
- **Test.**
  - Header: subject • mode, scope, question count, mode badge, timer card, and Save & exit.
  - Chips: question number, type, marks, and difficulty when present.
  - Large touch-friendly options.
  - Practice feedback panel: correct/incorrect, your answer, correct answer, and the explanation or an honest "not recorded" fallback.
  - Numbered navigator with legend and counts. On mobile it becomes a bottom-sheet drawer with a fixed action bar.
  - Keyboard: ←/→ to move, A–D to answer.
  - An accessible submit dialog with answered/unanswered/flagged counts. Double submit is guarded on both client and server.
- **Results.**
  - Score as "N / M" with "Marks lost".
  - Metrics: attempted, correct, and time taken.
  - Readiness before→after only when both were genuinely computed (pre-test and post-test).
  - "Why you lost marks" table: marks lost, total, accuracy, and what happened (incorrect vs unanswered, difficulty of misses).
  - A next-best-move card: Improve My Score, Review mistakes, Practice this topic.
  - Review list and a recent-attempts history; any attempt can be reopened.
- **Improve My Score.**
  - The TEST → DIAGNOSE → PRACTICE → RETEST → IMPROVE loop, and a previous vs current comparison.
  - The change is in marks when both sets have the same total, otherwise in accuracy points, with a note saying why.
  - Freshness disclosure, plus Topics improved / Still requiring practice tables.
  - "Retake another targeted set", disabled with an explanation when nothing was lost.
  - When a chapter's live questions are all used up, Improve My Score is disabled up front with an explanation.
- **Login.** Brand, the "Don't prepare for easy" headline, three proof points, live bank counts, a Readiness Core, and tabbed login/create forms with inline validation and busy states. The demo option is clearly separated and creates a real, empty account.

## 4. Functional and backend changes (all additive, no schema change)

- `POST /api/attempts/:id/submit`: `perQuestion[]` gains `marks`, `kind` and `questionType`.
- **New** `GET /api/attempts/:id/result`:
  - Same payload as submit, plus `submittedAt`, `startedAt`, `durationSeconds`, `timeTakenSeconds` and `test{…}`.
  - Owner-only (404 for anyone else); 409 before submit.
- `GET /api/attempts/me`: rows gain `improvesAttemptId`.
- `POST /api/tests/improve`:
  - Prefers questions the student has never seen; previously seen ones are used only to fill a shortfall; the source attempt's own questions are never used.
  - Returns `freshness {requestedCount, deliveredCount, freshCount, reusedCount, widenedToChapter}`.
- `improvementComparison.freshness {totalQuestions, freshCount, reusedCount}` on submit and result.
- `GET /api/chapters`: each chapter gains `gradableCount`, using the same status filter as test generation.
- **Frontend fix:** resumed attempts merge checked (locked) answers into the submit body, so diagnostics see the same answers the score used.

Untouched: scoring, readiness, diagnostics and retest logic; auth; entitlements; ingestion; the question bank; and migrations.

## 5. Tests and checks run

| Command | Result |
|---|---|
| `npm test` (live-DB guard wrapper), baseline before any change | **71/71 pass**; guard: live DB unchanged |
| `npm test` after all changes | **79/79 pass** (71 existing + 7 from the backend agent + 1 for `gradableCount`); guard: live DB unchanged |
| `node --check` on `public/app.js` and `server.js` | pass |
| Lint, type check, production build | **Not available.** The repo has no lint or type tooling and no build step (static files plus plain Node). |
| Postgres engine (`DB_ENGINE=postgres`) | **Not run.** There is no `DATABASE_URL` locally. The new SQL follows the engine-neutral patterns already used in the codebase. |
| `scripts/browser-smoke-check.js` and `scripts/stage7-browser-matrix-check.js` | **Not run.** Playwright is not installed. They also need selector updates (see §7). |
| Automated axe scan | **Not run** (no axe tooling). Keyboard, labels and focus were checked manually. |

Manual browser QA was run against the real UI and API on a disposable copy of the Sept 23 snapshot DB. Each flow was driven through the UI, with DOM and network assertions:

- **Auth:** demo entry; login validation and wrong-password error; account creation; logout.
- **Boards:** CBSE/ICSE switching.
- **Practice:** instant correct/incorrect feedback.
- **Board Simulation:** zero `/check` calls, no feedback, no answer reveal.
- **Navigation and submit:** answers persist across navigation; flagging; submit dialog counts; submit; results.
- **Results reopen:** results reopened after a reload via the new GET endpoint.
- **Retest:** a targeted retest with 12 of 12 fresh questions, and the Improve comparison.
- **Resume:** Save & exit then resume, with the checked answer restored.
- **Overflow:** a script reported no element extending past the viewport at 390 px on Dashboard, Practice, Results and Improve. The 375 px test screen had no horizontal overflow.
- **Console:** the only console errors were the expected 401 and 422.

## 6. Screenshots (`docs/redesign-2026-10-18-screenshots/`)

- **1440 × 900:** login, dashboard, practice feedback (correct and incorrect), Board Simulation, submit dialog, results, review, Improve My Score, light-theme dashboard.
- **375 × 812 / 390 × 844:** test screen, navigator drawer, results with real readiness 53 → 42, Improve.

## 7. Remaining defects, limitations and blockers

1. **Not deployed or committed.** The founder must decide when this merges to `claude/new-session-k86x3s`, since that branch auto-deploys.
2. **QA data is the Sept 23 SQLite snapshot** (4,946 questions; 15 gradable CBSE). Production Postgres was not used, and visuals were not checked against production content.
3. **Legacy Playwright scripts need updates:** chapters moved to the Practice tab (click `.nav-link[data-nav="practice"]` first), and submit now uses `#submitDialog` / `#sdConfirm` instead of `window.confirm`.
4. **Before→after readiness** appears only on a freshly submitted result. It is captured client-side immediately before and after, and not persisted, so a reopened attempt shows current readiness instead.
5. **"Topics improved"** uses the existing backend rule, which requires 100% correct on that topic. Partial gains show under "Still requiring practice" with their real change.
6. **Paywall:** chapter-level ranking needs the (demo) report unlock, as before. Locked students see free, subject-level accuracy plus the unlock row.
7. **Pre-existing issues, not changed:**
   - The upsell plan key `single-subject` doesn't match the `subject-<id>` access check.
   - The time limit is not enforced server-side (late submits are only recorded).
   - The dashboard makes about 2 requests per subject on load.

## 8. Files changed

- `public/index.html`, `public/style.css`, `public/app.js` — rewritten
- `server.js` — result endpoint, shared payload builder, `perQuestion` fields, `improvesAttemptId`, `gradableCount`
- `practice.js` — fresh-first retest selection plus `freshness`
- `test/redesign-api.test.js` — new, 8 tests
- `docs/redesign-2026-10-18-report.md` and `docs/redesign-2026-10-18-screenshots/` — new

No database or migration implications: every change is a read-time addition, with no new columns or tables.

## 9. Next highest-priority improvements

1. Run the suite with `DB_ENGINE=postgres` against a staging copy, then deploy to staging and QA against the real 4,825-question bank.
2. Update and run the two Playwright scripts, and add an axe pass.
3. Persist a readiness snapshot at submit so before→after survives reopening.
4. Consider a partial-improvement status in `retest.js` (founder/product decision).
5. Fix the `single-subject` plan-key mismatch before real payments.
