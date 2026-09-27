# Phase 2 — Real Data Integration + UX Validation: Final Report

Date: 2026-09-22. Scope: prove the redesigned/critiqued UX actually works
against the real backend and real ~4,946-question bank — not more prototype
polish. Everything in this report was built and tested directly in
`public/`, `server.js`, `scoring.js`, `db.js` (the real, live, git-tracked
frontend and backend) — nothing here touches
`design/prototypes/board-ready-2-concept.html`, which remains a visual
reference only, per your explicit instruction not to replace Revision 3 with
it.

Two corrections are recorded up top because they change what's safe to trust
from earlier in this project — full detail in
`docs/board-ready-2.0-design-brief.md` ("Naming/lineage") and
`docs/publication-readiness-report-cbse-maths.md` ("CORRECTION — 2026-09-22"):

1. **"Revision 3" is real.** It's `public/`, connected to the real backend
   since this repo's first commit. It was never a disconnected mockup.
2. **The publication-readiness report's "64 visually complete" diagram count
   was wrong**, due to a real bug in the audit's classifier (it treated "is
   an image file" as "is a cropped diagram"). The true count of genuinely
   servable, per-question diagram crops in the CBSE Maths bank today is 0.
   No question's status was changed based on the old numbers.

All work below respects the standing rules: no bulk promotion, no
re-ingestion, no source_library modification, no `status` changes to make
the UI look populated, and the pre-existing preservation export was not
touched.

---

## 1. Real test-generation → attempt → submission → grading → diagnostics flow

**PASS.** This was already substantially real before this pass (confirmed by
reading `server.js`/`app.js` and re-running the pre-existing `verify-flow.js`
end-to-end script, which still passes in full after all Phase 2 changes:
login/bad-password, real practice + full test generation, real attempt
creation with idempotent resume-if-unfinished, real submit with
server-recomputed scoring, real double-submit rejection (409), real
diagnostics/readiness/improvement endpoints, real auth/role gating, real
paywall gating). Nothing here was rebuilt this pass; it was re-verified after
every other change below, specifically to catch regressions.

## 2. Question renderer matrix (MCQ / Assertion-Reason / Case Study / Multi-part / Open-descriptive / Visual-diagram)

**PARTIAL.** Verified against real DB records (via the DB and a live
`practice.js`/`scoring.js` trace, not mockups):

- **MCQ** — PASS. Real rendering, real option selection, real grading.
- **Case study / multi-part** — PASS. `scoring.js`'s `flattenAll()` correctly
  expands `parts_json` into individually-labeled, individually-scored steps
  (confirmed both by code trace and by the Phase 2 backend test script,
  which submitted a real case-study question and got per-part results back).
  The frontend already labels these "Case study · part A/B/C..." and scores
  each part independently.
- **Assertion-Reason** — NOT YET IMPLEMENTED. No question in the live DB is
  tagged in a way that produces this format distinctly from a 4-option MCQ;
  `question_format`/`question_type` columns exist but the frontend doesn't
  branch on them. Not touched this pass — would need a real content sample
  to design against, and none was found tagged as assertion-reason in a
  quick scan.
- **Open-descriptive** — NOT YET IMPLEMENTED (by design, not oversight). The
  publication-readiness report already flags these as
  `kind_open_not_autogradable` (3 in the CBSE Maths candidate set) — the
  scoring engine has no mechanism to grade free text, and building one is a
  real product decision (rubric-based? AI-graded?) beyond this pass's scope.
- **Visual-diagram** — see section 3 below; this is the big one.

## 3. Visual/diagram requirement — the strict, real-source-only test

**PARTIAL, and this is the most important finding in this report.**

What I found first, before building anything: **zero questions in the CBSE
Maths bank — gradable or not — have a genuinely cropped, per-question
diagram image.** All 161 `visual_assets` rows point to 41 distinct whole-page
photos (see the publication-readiness report correction above for the full
evidence — shared files across multiple figures, 2MB+ file sizes, visible
book edges/hands in the photos). This is a content/extraction-pipeline gap,
not a code gap, and it predates this pass.

Given that, "test with an actual source visual from the Board Ready source
library" and "a manually created demo diagram does NOT satisfy this
requirement" together mean: I could not test the full real pipeline against
a live, gradable, database-linked diagram, because none exists. What I did
instead, to get as close to real as honestly possible without promoting
anything or fabricating content:

- Built the actual serving + rendering + zoom code in the real app
  (`server.js`'s new `/extracted-diagrams/*` static route — deliberately
  separate from `source_library/`, which never gets served directly to
  avoid ever leaking a whole page's other answers; `public/app.js`'s
  `renderQuestion()` now renders `step.diagramUrl` with a tap-to-zoom
  lightbox when a step has one; `public/index.html`/`style.css` have the new
  markup/styles). This is real, shipped code, not a demo-only branch — it
  activates automatically the day a real question gets a real `diagramUrl`.
- Made one real crop from real source material to prove it end-to-end: Fig.
  9.21 (a labeled right triangle, 30°/4ft, from the CBSE Trigonometric
  Ratios chapter, question id 4418's actual figure), cropped by hand from
  the real photographed source page down to just the diagram — saved to
  `extracted-diagrams/demo-fig-9-21.png`, **not linked to question 4418 or
  any DB row**, with a README explaining exactly that.
- Tested the real code path with it: a Playwright browser test
  (`/tmp/.../phase2-diagram-test.cjs`, not committed — scratch) logs in as
  the real seeded student, starts a real test, and — only at the network
  interception layer, never touching the database — attaches that one real
  crop's URL to one real step, to prove the rendering code, not to claim the
  DB has this data. Confirmed at 390px mobile width: the diagram renders
  inline with a "Tap to zoom" affordance, tapping opens a full-bleed
  lightbox with the same real image, closing works, and a different question
  in the same test correctly shows no diagram (proving it's conditional, not
  always-on). Screenshots: `diagram-01-question-with-diagram-mobile.png`,
  `diagram-02-zoomed-mobile.png`.

**What's still not done, honestly:** no live, gradable question actually has
a `diagramUrl` today, because no real extraction pipeline exists yet to
produce one from `source_library/`'s whole-page photos. Building that
extraction tool (crop-detection or manual-crop-plus-review workflow) and
then deciding whether/how to promote any resulting content is real,
separate, larger work — a founder decision, not something to do unilaterally
under "don't bulk-promote, don't change status to populate the UI."

## 4. Wrong-answer explanation experience

**PASS**, honestly scoped. Real changes:

- `scoring.js`'s `flattenAll()` now carries the question's real `explanation`
  column through every step (previously dropped entirely).
- `server.js`'s pre-submit `/api/attempts/:id/questions` explicitly **strips**
  both `correct` and `explanation` (a real leak I caught before shipping —
  several explanations in this bank spell out the correct option directly,
  e.g. "Source answer key states option B..."; sending that pre-test would
  have been the same leak as sending the answer key itself).
- The post-submit `/api/attempts/:id/submit` response now includes real
  `text`, `options`, and `explanation` per question.
- `public/app.js`/`index.html`/`style.css` add a real "Your answer, the
  correct answer, and why" section on the results screen: for every
  incorrect or unanswered question, shows the real question text, your
  answer vs. the correct answer (by letter and text), the real explanation
  when the bank has one, and — when it doesn't (most of the bank doesn't
  yet) — an honest "No worked explanation is recorded for this question yet"
  instead of inventing one. Each item has a real "Practice similar →" button
  wired to the existing `startTestFlow(..., kind:'practice')`.
- Tested end-to-end in the real browser against the real backend — see
  `real-06-results-mobile.png`/`real-07-explanations-mobile.png` and the
  cropped detail in this conversation. Board Ready doesn't have a
  misconception-detection model; it only ever shows what's actually in the
  database, and now it actually shows that.

## 5. Results → action loop

**PASS** (was already substantially real; re-verified, not rebuilt). Weak-spot
grouping by sub-concept, strengths list, "Train this" CTA into a real
practice generation call, personal-best detection against real prior
attempts, and real pre/post Readiness-score comparison were all already
wired to real data (confirmed by code trace and by the live browser test).
The new per-question explanation section (section 4) is additive to this,
not a replacement.

## 6. Resume / recovery

**PASS.** This was the single most important gap called out in your brief
("needs to work with real backend state," "Test: select answer → save →
refresh → answer remains") and it's now real, not just the question-set/timer
resume that existed before:

- New `attempts.draft_answers_json` / `draft_saved_at` columns (additive
  migration, `db.js`, following the same guarded
  `ALTER TABLE ... ADD COLUMN` pattern already used for `questions`).
- New `PATCH /api/attempts/:id/answers` — merges the student's in-progress
  answers into that draft column, rejects with 409 once the attempt is
  submitted, never touched by `gradeSubmission()` (the scoring guarantee is
  unchanged: correctness is still always recomputed at submit time from the
  question's real answer key, never from anything saved here).
- `GET /api/attempts/:id/questions` now also returns `draftAnswers`, read
  back by `beginTestSession()` instead of always resetting to `{}`.
- **Tested for real in a real browser, against the real backend, exactly as
  you specified:** logged in as the real seeded student, started a real
  full test, answered question 1, **reloaded the page completely** (not a
  soft in-app navigation), and the student's answer was still there —
  screenshot `real-05-resumed-answer-restored-mobile.png` shows option A
  selected with a "Restored 1 previously saved answer(s)" toast, timer
  correctly continuing from the original start time. A second, independent
  backend-only test additionally confirmed the merge behavior (saving answer
  2 doesn't clobber saved answer 1) and that a submitted attempt correctly
  rejects further saves.

## 7. Autosave

**PASS**, and it's the same mechanism as section 6, not a separate one — a
500ms-debounced `PATCH` fires after every option click, flushed immediately
before submit so a just-picked answer inside the debounce window is never
lost. Failure is non-fatal (a toast, not a blocking error) since the
in-memory answers the student sees are unaffected either way; only
cross-session resume depends on the save succeeding.

## 8. Mobile testing

**PASS** for everything built/touched this pass, at real 390×844 (iPhone-class
narrow width), against the real running server, via Playwright (not the
Chrome-headless-CLI + iframe workaround used earlier for the prototype,
which is no longer needed for testing against the real app). Covered:
dashboard, test screen with and without a diagram, answer selection,
reload-and-resume, full submission flow, results screen including the new
explanation section, and the diagram zoom lightbox. Not covered: a broad
sweep of every existing screen/state at multiple breakpoints — that's a
larger, separate QA pass this report doesn't claim to have done.

## 9. Accessibility

**NOT YET IMPLEMENTED as a real pass.** What's true today, incidentally:
options and buttons are real `<button>` elements (keyboard-focusable,
already true before this pass), the new diagram image has real `alt` text,
and the new zoom-close control is a real labeled `<button>`. What's not
done: no screen-reader testing, no focus-trap in the new lightbox (it can be
closed by click but keyboard/Escape isn't wired up), no color-contrast audit
of the theme tokens, no `prefers-reduced-motion` check on the existing
count-up animations. Flagging honestly rather than claiming a pass.

## 10. Overall acceptance test

**Your question:** "Can a real student use Board Ready from login all the way
through a real test, diagnosis, targeted practice and retest — without
encountering anything that feels like a prototype?"

**Answer: yes, for the flow that exists — with the diagram gap as the one
honest exception.** Login → real dashboard → real full test with real
questions → answer with real autosave → (proven) survive a real page reload
mid-test with answers intact → real submit → real server-recomputed score →
real weak-spot diagnosis → real per-question "your answer/correct
answer/why" → real "Train this" into a real targeted practice set → real
readiness-score evolution shown → all confirmed against the real backend in
a real browser at real mobile width, and the pre-existing `verify-flow.js`
suite still passes in full, so nothing in the diagnostics/readiness/paywall
engine regressed.

The one place a student could still hit something that isn't real: any
question tagged as needing a diagram would, today, render with no diagram at
all (the code will show one the moment real `diagramUrl` data exists, but no
gradable question has one yet) — and Assertion-Reason/open-descriptive
formats aren't rendered distinctly yet either, though none of those are
mixed into a real generated test today in a way this pass's testing surfaced
as broken.

### What I did not do, and why

- Did not promote any question's `status`, including the one real diagram
  crop made for testing (kept explicitly unlinked from any DB row).
- Did not re-run or extend the diagram-completeness audit's classifier fix —
  flagged the bug, corrected the report's conclusions, didn't rebuild the
  tool in this pass.
- Did not touch `design/prototypes/board-ready-2-concept.html` — all of this
  work lives in the real `public/`/`server.js`/`scoring.js`/`db.js`.
- Did not do a full accessibility or cross-device QA sweep (section 9).

### Files changed

`db.js` (additive migration), `scoring.js` (explanation passthrough),
`server.js` (autosave endpoint, draft-answers on fetch, explanation in
submit response, answer-key/explanation leak fix, extracted-diagrams static
route), `public/app.js`/`index.html`/`style.css` (autosave wiring, resume
restore, explanation experience UI, diagram render + zoom), new
`extracted-diagrams/` folder (one real, unlinked demo crop + README).
