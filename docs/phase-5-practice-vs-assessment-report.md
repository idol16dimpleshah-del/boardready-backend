# Phase 5 — Practice vs Board Simulation

**Date:** 2026-09-22
**Commit:** `37162ea`
**Scope:** the product distinction requested after Phase 4 — immediate answer feedback must not be the only test experience, because a student who gets confirmation on every question doesn't produce a genuine, independent score. This makes that distinction real, not just a label, and applies it to the loop already built (Practice → Assessment → Diagnosis → Improvement → Measurement → Readiness).

## What exists now

Every test carries a real, server-set `feedback_mode`:

- **Practice / Learning Test** (`immediate`) — chapter-scoped practice sets (`Practice (10 Q)` on the dashboard). Answering a question calls the real `/check` endpoint, shows ✓ Correct / ✕ Not quite plus the real explanation (or an honest "not recorded yet"), and locks that answer in — exactly the Phase 4 behavior, untouched.
- **Board Simulation / Assessment** (`deferred`) — the full-subject test (relabeled "Start Board Simulation →" on the dashboard, with a subtitle: "20 timed questions, no feedback until you submit — a genuine, independent score"). Selecting an option just records the draft and moves on. No `/check` call is made, no banner ever appears, and no option ever locks — all the way to submission. Real explanations and the real answer key still appear in full, but only after Submit, exactly as they always have.
- **Improve My Score retest** — also `deferred`, deliberately. The retest exists to measure whether the student can now get these right independently; giving it live feedback would undermine the exact "independent performance" comparison it's meant to produce. This wasn't explicitly specified but follows directly from the stated concern about immediate confirmation distorting a genuine score.

The mode is never a client-side guess: it's read from the `tests.feedback_mode` column at test creation, returned on `GET .../questions` and `GET /api/attempts/me` so a resumed attempt renders correctly, and — the part that actually matters — **enforced server-side**. `POST /api/attempts/:id/check` now checks the real test row and returns 403 on a deferred test, so a direct API call (bypassing the UI entirely) cannot get immediate confirmation during an assessment either. Verified directly, not just assumed.

A visible badge on the test screen makes the mode unmistakable at a glance: "PRACTICE · INSTANT FEEDBACK" (cyan) or "BOARD SIMULATION · NO FEEDBACK UNTIL SUBMIT" (amber).

## Polish also done this pass

- **Stronger CTA:** the "Improve My Score" card now reads real numbers — "You can win back 11 marks" (computed as `maxScore - score`, both already-real fields on the same submit response) — and names the actual weak topics, instead of generic copy.
- **Comparison visual:** the improvement-comparison card gained a simple first-vs-now bar pair under the two percentages — the same two real numbers already shown as text, rendered as width, not a separate computation.

No visual redesign was done — per your explicit note, this was scoped to the mode split plus targeted, restrained polish on the two screens you called out.

## Verified

- New `phase5-backend-test.mjs`: chapter practice → `immediate`; full test → `deferred`; Improve My Score → `deferred`; `/check` succeeds on an immediate attempt and is rejected with a real 403 on a deferred one; the rejected call leaves no lock behind; a deferred test still grades correctly and reveals full explanations after submit.
- New `phase5-ui-test.cjs`, real browser clicks: both badges render with the correct text/class; Practice still shows live ✓/✕ feedback unchanged from Phase 4; across an entire real Board Simulation run, no feedback banner and no locked option ever appeared, and the full results screen still appeared correctly after submit.
- All previous regression suites (`phase2-e2e-test.mjs`, `phase3-backend-test.mjs`, `phase4-backend-test.mjs`, `verify-flow.js`) re-run and still pass — no regression to the existing loop.
- Real screenshots taken: the two mode badges, the strengthened CTA with real marks-lost copy, and the comparison card's new bar visual with real percentages.

## Still outstanding (unchanged from the Phase 4 report)

Accessibility pass, the full 4-breakpoint mobile QA sweep of the entire flow, and the real diagram-extraction/association audit — all separately pending, per your stated ordering (polish first, then accessibility/mobile, then diagrams).
