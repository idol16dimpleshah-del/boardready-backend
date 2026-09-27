# Phase 7 — Full 4-breakpoint mobile QA

**Date:** 2026-09-23
**Scope:** the second item in your confirmed next-phase order (accessibility ↓ **mobile QA** ↓ diagram extraction ↓ final polish). A real sweep of the entire student flow — not just the two screens Phase 4's earlier mobile pass covered — at the four breakpoints already established in this project: small phone (360×780), large phone (428×926), tablet (834×1194), desktop (1440×900).

## Method

An independent audit first (real Playwright screenshots of every screen at all 4 breakpoints, reviewed image-by-image, no fixes made yet), then root-cause diagnosis, then targeted CSS fixes, then two rounds of re-verification: a scripted `document.documentElement.scrollWidth` check (an objective, non-visual way to catch horizontal overflow that a screenshot alone can miss) and fresh screenshots, plus a full re-run of every existing regression and accessibility script to make sure nothing already working got broken.

## What was found and fixed

**Critical — the entire question-answering screen overflowed the viewport on real phones.** On both Practice and Board Simulation, at both 360px and 428px, the page rendered up to 210px wider than the screen — meaning a real student would see the layout pushed partly off-screen with an unwanted horizontal scroll on the single most important screen in the product. Root cause, confirmed by direct measurement rather than guesswork: a CSS flexbox behavior where a flex item's automatic minimum width defaults to its content's width when that content can't wrap (here, `.mode-badge`'s `white-space: nowrap` — needed so the badge text itself never breaks mid-word). That silently forced `.test-top` and the question-navigator strip (`.track`) wider than the screen instead of wrapping or scrolling as intended. The deepest part of the problem: the longer badge copy, "Board Simulation · No feedback until submit," measures roughly 355px wide at its own font size — wider than the entire 360px small-phone viewport by itself, so no amount of shrinking neighboring elements could ever have fixed it alone.

Fixed in three layers, each addressing a distinct part of the same root cause:
- `min-width: 0` added to the flex items in this chain (`.test-top .chapter`, the new `.chapter-info` wrapper, and `.track`) so they can actually shrink instead of forcing their ancestors wider — this alone fixed the question-navigator dot strip, restoring its intended horizontally-scrollable behavior.
- `.test-top` gains `flex-wrap: wrap` below 760px, so the question counter and timer move to their own line when the header needs more vertical room, rather than being forced to share one line no matter what.
- Below 760px, `.mode-badge` switches from a single-line pill (`white-space: nowrap`) to a normal wrapping block (`display: block; white-space: normal`) — the same real copy, now flowing onto two lines like ordinary text instead of requiring 355px on one line. This is a breakpoint-specific style change, not new content and not a redesign: at tablet and desktop widths the badge is untouched and still renders as a single-line pill.

Verified via a scripted overflow check across all 4 breakpoints × 6 real screens (login, create-account, dashboard initial, dashboard with chapters, Board Simulation question, Practice question): **overflow before the fix: up to 210px on 8 of 24 checks (both phone widths, both test modes); after: 0px on all 24.**

**Real bug — the mode badge touched the adjacent "ICSE" text at tablet and desktop widths.** When the badge fit on the same line as the subject text ("Mathematics · ICSE"), it had no gap — the badge's border was visibly touching the last letter. Fixed with `margin-left: 8px` on `.mode-badge`. Confirmed by screenshot: a clean gap now separates them at both breakpoints where they share a line.

**Real bug — the chapter list's row layout was inconsistent specifically around 428px.** `.chapter-row` had no defined breakpoint behavior for whether its "Practice (10 Q)" button sat next to the chapter title or wrapped below it — it came down to that individual chapter's title length versus the exact available width. The result was a visibly jumpy list where some rows were inline and others stacked, for no reason a student would understand, only in this narrow band (360px already stacked everything by accident; 834px+ already fit everything inline). Fixed by forcing every chapter row to stack consistently below 760px (`.chapter-row{ flex-direction:column; }`, `.chapter-row .actions{ width:100% }`), matching the behavior narrower phones already fell into. Confirmed by screenshot: at 428px every chapter row — regardless of title length — now stacks the same way.

**Minor, not independently re-touched — question-navigator dot touch targets.** Already partially addressed in Phase 6 (grown from 11px toward the 24px WCAG minimum via a button-box/visual-dot pattern, documented then as a deliberate partial fix given the "no redesign" constraint). The practical un-reachability the audit initially flagged here was actually a symptom of the overflow bug above — once the strip is properly confined and horizontally scrollable again, the dots are reachable via scroll/swipe as designed. No further sizing change made this pass.

## What was already fine (confirmed, not just assumed)

Login screen (both tabs), the dashboard topbar and readiness/locked/activity cards, MCQ options and the immediate-feedback banner, the results-screen hero and score, the full answer-review list (including a 360px-wide column holding algebraic expressions and worked explanations without truncation), the Improve My Score CTA, and the first-vs-now comparison card — all reflow cleanly at every breakpoint with no overlap, cut-off text, or overflow.

## Verified

- Scripted overflow check (`document.documentElement.scrollWidth` vs. viewport width) across all 4 breakpoints on login, create-account, dashboard (initial + populated), Board Simulation question, and Practice question: 0px overflow everywhere after the fix, down from up to 210px before.
- Fresh screenshots confirming: no overflow on the Board Simulation question at small-phone (badge now wraps to two lines, question navigator properly confined to its own scrollable strip); the badge/"ICSE" gap at tablet; every chapter row at 428px stacking consistently regardless of title length; the Practice question and full Results screen at small-phone unaffected and rendering cleanly.
- `node --check public/app.js` — clean (this pass touched CSS/HTML only, no JS logic changes).
- Full existing backend regression suite re-run and still passing: `verify-flow.js`, `phase2-e2e-test.mjs`, `phase3-backend-test.mjs`, `phase4-backend-test.mjs`, `phase5-backend-test.mjs`.
- Phase 6's accessibility verification re-run to confirm this pass introduced no regressions: the real keyboard-only walkthrough (8/8 checks) and the axe-core WCAG A/AA scan across all 6 live screens — still 0 violations.

## Still outstanding (per your stated ordering)

Real diagram extraction + association (kept as its own separate content-verification project, exactly as you specified — the synthetic test fixture from the accessibility pass was never treated as product content), and final visual polish — both deliberately not started.
