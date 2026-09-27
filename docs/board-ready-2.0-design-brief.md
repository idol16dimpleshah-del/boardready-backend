# Board Ready 2.0 — visual redesign brief (living spec)

Status as of 2026-09-21: **prototype-only, not approved, not touching production.**
This file exists so the design direction survives context/session resets. If you are
picking this up fresh, read this whole file before changing the prototype.

Prototype file: `design/prototypes/board-ready-2-concept.html` — a standalone HTML
file (open directly in any browser, no server needed). It has a dev-only toolbar
(screen / device / theme switcher) that is hidden via a `.clean` body class and
`?clean=1` URL param — that toolbar must never be mistaken for real product chrome.

## Naming/lineage — read this first, it's a real source of confusion

**CORRECTION (2026-09-22):** an earlier version of this section stated that
"Revision 3" was a separate, backend-disconnected mockup, distinct from
`public/`. That was wrong, and was said to the founder in chat too — this is
the record of the correction, not a quiet edit. `git log --all --oneline`
shows the very first commit in this entire repo is titled `Board Ready:
backend + Revision 3 frontend, ICSE Maths/Chemistry question bank` — i.e.
**`public/` *is* "Revision 3," by the project's own naming, and has been
connected to the real backend since the project's inception**, not
"unverified" as previously claimed.

There are **three** different things that have all been called "Board Ready"
in this project, and only one pairing is real:

1. **The actual production frontend, a.k.a. "Revision 3"** — `public/`
   (`index.html`, `app.js`, `style.css`) in this repo. Light/lavender-dark
   theme-aware UI (not just "plain lavender" — it already has a working
   dark/light toggle, a "Readiness Core" dial, and a real, if incomplete,
   "Continue where you left off" feature) connected to the real backend and
   the real question DB since commit `32dbf20`, the first commit in this
   repo. This is what was tested end-to-end in the Phase B audit and, more
   deeply, the 2026-09-22 Phase 2 real-data-integration pass (see
   `docs/phase-2-real-data-integration-report.md`). **This is "the live
   app," and it is also "Revision 3."**
2. **"Board Ready 2.0"** (this document, `design/prototypes/board-ready-2-concept.html`)
   — a static visual-only prototype built in this session. Real terminology,
   illustrative/hardcoded numbers, no backend connection, no diagram-rendering
   system, only one basic MCQ layout.
3. **The dark/glassmorphism screenshots** the founder showed from a separate
   ChatGPT conversation, which the founder was also calling "Revision 3" in
   conversation. These are a *different, unrelated artifact* from #1 above —
   same name, different thing. Nothing in this project's history connects
   those specific screenshots to any code in this repo, and that part of the
   original caution still stands: treat them as a pure visual reference, not
   as a description of what `public/` currently looks like or does.

**Practical rule:** #2 and the screenshots in #3 are both design references
only, and neither replaces `public/`. The production frontend to build
toward is `public/` (already real, already wired to the backend), improved
in place — not rebuilt from either prototype — selectively adopting whichever
visual decisions survive review. This is exactly what the 2026-09-22 Phase 2
pass did: real autosave/resume, a real wrong-answer explanation experience,
and a real (if not-yet-content-populated) diagram rendering pipeline, all
added directly to `public/`/`server.js`, not to the prototype.

## The three separate tracks (keep these distinct when reporting status)

1. **Content** — 4,946 real questions, preserved and hash-verified. ✅
2. **Engine** — test generation / scoring / diagnostics / readiness / retest.
   Tested and largely working against real, currently-gradable content. ✅
3. **Production UI** — must be verified against the *real* backend and *real*
   content, not against how a static mockup looks. ⚠️ **This is the
   remaining open piece**, and visual prototypes (#2/#3 above) do not advance
   it by themselves.

Never conflate these three. A polished mockup screen is evidence about track
3's *visual direction*, not evidence that track 3 is done.

## What the production frontend actually needs (beyond the 4-screen concept)

The real product needs considerably more states than the 4 mockup screens,
roughly: account → onboarding → dashboard → subject → chapter/topic → test
configuration → instructions → test → question navigation → submit
confirmation → results → diagnostics → explanation → targeted practice →
retest → improvement history. The 4-screen prototype is a visual concept, not
the product's information architecture.

The test-taking renderer must be question-type-aware, not MCQ-only: the real
bank includes MCQ, assertion/reason, case-study, open/descriptive, and
grouped questions/parts, driven by each question's actual `question_format`/
`kind` fields — not a single hardcoded A/B/C/D layout like the prototype's.

**Diagrams must become first-class content** — currently the single biggest
gap in every prototype so far (none of them have any diagram-rendering
architecture at all). Shape to build toward:

```
Question
├── text
├── options / parts
├── answer
├── explanation
├── provenance
└── visual assets
       ├── original source image
       ├── source page
       ├── dimensions
       └── display metadata
```

Student-facing result should be the complete original diagram rendered
inline with the question — never "see diagram above" as text, and never a
missing image. This directly implements the standing rule: *"A question is
not complete if its associated diagram/visual is missing."*

## The real acceptance test (not "do the mockup screens look good")

- Can a real student enter Board Ready and complete the entire learning loop
  — dashboard → test → submit → score → diagnostics → weak spot → targeted
  retest — using real questions from the actual 4,946-question bank?
- For any question that has a visual: does the actual original diagram
  render correctly with it?

A beautiful static dashboard showing illustrative numbers ("82 Maths / 74
Science / 79 Social Science") or a hardcoded "40 questions · 60 minutes"
proves nothing about whether the real test engine generated 40 real
questions or whether those numbers came from the real DB. **Do not report
the production UI as ready on the strength of a mockup looking good** — the
acceptance test above is the only thing that counts.

## Why this exists

The real Board Ready product (this repo) works end-to-end already: content
pipeline, scoring, diagnostics, readiness score, retest loop. The founder asked for
a *visual* redesign exploration on top of that — currently dark/lavender-white,
functional but generic. This is purely a UI/visual-language exercise, explored as
static mockups before any implementation decision.

## Hard constraints (do not violate these while doing design work)

- **Do not change backend functionality, database structure, authentication,
  scoring, or existing product logic.** This is UI/visual only.
- **Do not modify the production/live UI.** This lives only in
  `design/prototypes/`, as a standalone file, until explicitly approved.
- Real Board Ready terminology/structure/chapter names should be used in mockups
  (not placeholder EdTech content), but stats can be illustrative, not live-DB,
  as long as they are not presented as real figures to anyone outside this
  design review.
- Keep the internal "prototype viewer" toolbar (screen/device/theme tabs)
  strictly isolated from anything that could ship — it's a review tool, not a
  product feature.

## Screens in scope (exactly 4)

1. Login / Landing
2. Student Dashboard
3. Test-taking
4. Results + Weak Spot

Both desktop and mobile widths required for each (Board Ready is a PWA).
Both dark mode and light mode required (founder's own preference is light;
belief is students may prefer dark — so both must exist, not dark-only).

## Visual direction (confirmed, keep)

- Dark cinematic foundation (for dark mode) with a **violet → cyan** accent
  gradient as the core brand color story. Gold/good/warn/bad used for
  status/semantic color (streaks, mastery, mistakes) — kept constant across
  both themes so a screen is recognizably Board Ready in either theme.
- Premium glass/layered surface treatment (not flat cards).
- Strong, confident display typography for headlines (currently "Unbounded" +
  "Manrope" + "JetBrains Mono" for numeric/mono stats).
- CBSE / ICSE / Class 10 identity should be prominent — Board Ready is not
  generic exam prep.
- Login copy direction: problem + action framing ("Stop guessing. Start
  scoring." style) beats generic reassurance copy ("Walk into your boards
  feeling ready.").

## The core design problem this brief is chasing

Early passes read as "dark futuristic SaaS + gradients" — glassmorphism, not a
genuinely distinctive product. The ask is to push from "nicer EdTech UI" to a
**recognizable Board Ready brand**: someone should be able to see one screen
without the logo and know it's Board Ready. Target feeling: *"If Duolingo were
redesigned specifically for Class 10 board exam performance, but with the
polish of a premium modern tech product."* The product's moat is the
diagnostic loop around verified board-pattern questions, not the UI — so the
visual identity should say **"this is where I train,"** not **"this is where
my school gives me homework."**

## Revision 2 requirements

1. **Real 3D / dimension, not just glow.** One or two *signature* dimensional
   visual elements, not generic floating 3D blobs. Needs to be
   product-specific and reusable across screens (login → dashboard → results)
   so it becomes a recognizable Board Ready visual metaphor tied to
   readiness/progress/improvement.
   - *Current implementation:* a "Readiness Core" — a tilted, layered 3D ring
     device (CSS 3D transforms, `perspective`/`rotateX`/`rotateY`) with a
     glowing center orb showing the readiness %. The three rings are colour-
     coded to the three subjects (violet = Maths, cyan = Science, gold =
     Social Science), so it encodes real subject-mastery data, not decoration.
     Used at 3 sizes: a small badge on login, the main readiness stat on the
     dashboard, and the big score reveal on results.
2. **Make the product feel alive.** Motion: score counters, progress-bar
   animation, XP increases, streak animation, weak-spot color states
   (red → amber → green), retest score animating old → new.
   - *Current implementation:* pulsing glow on active (red) weak-spot dots,
     a flickering streak-flame emoji, a shimmer sweep on "New personal best,"
     hover-lift on buttons/cards/chips. **Not yet implemented:** actual
     JS count-up animation for numbers/progress bars (flagged as a good next
     iteration, intentionally deferred to keep this pass low-risk).
3. **Weak spots as the hero feature**, not an afterthought — the product loop
   is Test → Diagnose → Explain → Practice → Retest → Improve, and the visual
   system should make that loop obvious, especially on Results.
4. **Dashboard anchored on Board Readiness Score** as the primary visual
   element, plus: improvement since first attempt, today's mission, weak
   spots, XP, streak, subject mastery. Avoid generic "analytics dashboard"
   layouts.
5. **Results tells a story:** Score → what went wrong → why → what to do →
   retest → improvement. "Weak Spot Found" should read as a major moment, not
   a line item.
6. **Gen-Z without childish.** No cartoon characters, no excessive emoji, no
   cheesy gaming graphics, no rainbow gradients. Premium gaming/productivity
   app register, not children's EdTech.
7. **Terminology:** avoid "Analytics / Performance / Statistics / Reports."
   Prefer: *Your Progress, Weak Spots, Today's Mission, Beat Your Score, Fix
   This, Retest, Personal Best, Board Readiness.* (Current prototype copy is
   already aligned with this — keep enforcing it in any future screens.)
8. **Board + goal selection should be prominent and early:** "Choose your
   board: CBSE / ICSE" → "Choose your goal: Improve my score / Fix my weak
   spots / Take a full test."
   - *Current implementation:* folded into the login screen as interactive
     chips, rather than a separate 5th onboarding screen, to keep scope to the
     agreed 4 screens. Open question for the founder: split this into its own
     onboarding step once the login screen has been reviewed.

## Judging criteria (from the founder, use these to self-check any revision)

- Does it feel exciting?
- Does it feel trustworthy (a parent should take it seriously)?
- Would a 15-year-old actually want to use it?
- Would a parent take it seriously?
- Is it different from every generic EdTech app?

## Explicit non-goals for this pass

- No navigation/IA redesign yet (deferred until the visual direction itself is
  approved).
- No implementation into the live app.
- No change to real data/backend — dashboard/test/results numbers in the
  mockup are illustrative, not pulled from the live DB.

## UX critique — top 10 problems, ranked by student impact (not visual coolness)

Written before Stage 2 implementation, per the founder's explicit instruction
to critique first and rank by impact rather than jumping straight to making
things prettier. Items 1–4 were addressed in Stage 2 (see below); 5–10 are
tracked as follow-on work.

1. **The dashboard led with information density, not action.** Readiness,
   XP, streak, weak spots, subjects, and mission all competed for attention
   with nothing telling the student what to do *right now*. Highest impact:
   this is the screen a returning student sees every single session.
2. **The test screen had no exam-interface trust signals.** No explicit
   exit/save affordance, no question navigator, no per-question flag — a
   student mid-timed-test had no way to check overall progress or safely
   step away and resume. This is the highest-stakes screen (real marks, real
   time pressure), so gaps here cost the most.
3. **No diagram/visual rendering path existed at all**, directly contradicting
   the standing rule that the complete original diagram must appear with a
   question. The prototype visually implied text-only content.
4. **The renderer implied every question is a 4-option MCQ.** The real bank
   includes assertion-reason, case-study, grouped/multi-part, and open
   questions, none of which had any visual treatment.
5. Weak spots were framed negatively ("here's what you're bad at") rather
   than as opportunity — a motivation/retention risk for the target age
   group, not merely a copy nit.
6. Results already had roughly the right order (score → mistakes → weak spot
   → improvement) but didn't label the story explicitly, so it read as more
   disconnected than it structurally was.
7. No returning-user quick path ("continue where you left off") — every
   visit implied reading the full dashboard from scratch, adding friction to
   the single most common use case (a daily-practice habit product).
8. Gamification (XP/streak) had equal visual weight to academic signals —
   risks the product reading as a game first, exam-prep second, which
   undercuts trust with the parent audience.
9. No autosave/confirmation affordance anywhere in the test flow — for a
   timed, high-stakes assessment this is a trust gap, not a polish gap.
10. No first-run onboarding path shown beyond the board/goal chips folded
    into login — a brand-new student's first few minutes were undefined.

## Stage 2 — implemented in the prototype (this pass)

Addressed items 1–4 above:

- **Dashboard rebuilt action-first**: a "Continue where you left off" quick-
  start strip, then a single prominent "Your next move" card (what to do +
  why + how long), then a compact (not competing) readiness strip, then
  "Where you can gain marks" — the old negatively-framed weak-spot list
  reframed as High/Medium/Low opportunity rows with a "Train this →"
  affordance — then XP/streak demoted under a small "Streak & XP" label
  below the academic content, then subjects.
- **Test screen rebuilt as an exam interface**: explicit "← Exit" (labelled
  "your progress saves automatically"), a tappable question-navigator
  trigger opening a grid showing answered/unanswered/flagged/current state,
  a per-question flag-for-review toggle, and an "✓ Answer saved" autosave
  indicator under every answer.
- **Question renderer now demonstrates 3 formats** via a dev-toolbar toggle
  (not yet wired to real `question_format`/`kind` data — still a prototype):
  MCQ, a geometry question with an inline, *geometrically accurate* SVG
  diagram (tangent genuinely drawn perpendicular to the radius — a wrong
  diagram would undercut the exact trust this feature exists to build) plus
  a "tap to enlarge" affordance, and an assertion-reason question with the
  standard 4-option format.
- Real count-up/fill-bar motion implemented (deferred from Stage 1),
  triggered only on live tab clicks — never on the `?clean=1` screenshot
  path, so automated renders stay deterministic.
- Results screen re-labelled to make the story explicit: "Where you lost
  marks" → "Your next best move" → "Your progress", CTA copy changed from
  "Fix my weak spot" to "Train this" for consistency with the dashboard.

## Open items / next steps (not yet done)

- Items 5, 7, 8, 10 from the critique above are still open: onboarding as
  its own short flow, a "continue where you left off" pattern is now on the
  dashboard but not yet on a dedicated quick-start screen, gamification
  hierarchy is improved (demoted below academic content) but not fully
  audited against every screen.
- Exit/resume *recovery* experience (what a student sees if they return
  after closing the browser mid-test) is not yet built — only the "saves
  automatically" exit copy exists so far.
- Explanation-after-wrong-answer UI (your answer / correct answer / why /
  likely misconception / practice-similar CTA) is not yet built — this was
  called out as a high-value, not-yet-addressed item.
- Loading-state design ("Building your test…" sequence) not yet built.
- Full accessibility pass (contrast, keyboard nav, focus states, semantic
  HTML, screen-reader labels, touch targets, reduced-motion — note a
  `prefers-reduced-motion` rule already exists globally) not yet audited
  screen by screen.

- Real count-up/number-animation JS (currently CSS-only motion).
- Decide whether board+goal selection becomes its own onboarding screen.
- Founder review + explicit approval before any of this touches
  navigation/IA or the live frontend.
- **The actual next milestone is track 3 above**: verify/build the production
  frontend (`public/`) against real backend data — full state machine,
  question-type-aware rendering, diagrams as first-class content — not
  further visual-prototype iteration. Visual decisions from this prototype
  (and from "Revision 3," once/if its actual code is available to inspect)
  get selectively folded in during that build, not the other way around.
- Still separately pending from earlier phases, unaffected by this design
  work: the Phase C publication-readiness report (CBSE Maths 882-question
  breakdown), selective promotion of any of the 2,569 candidates (blocked
  until that report exists), the 207-item independent answer-verification
  pass (203 of 207 remain), and Stage 2 persistent storage (GitHub/cloud —
  no remote configured on this repo yet).
