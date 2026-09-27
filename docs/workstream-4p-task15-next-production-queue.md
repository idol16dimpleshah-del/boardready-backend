# Task 15 — Next-15-Question Production Queue (Batch 15)

**Status: fully read-only.** No database write. This synthesizes Tasks 1–14
into a concrete, next-in-line queue of 15 individual questions, each
assigned to exactly one of four objective buckets. No bulk action is
proposed — every promotion, correction, or association still requires its
own gated write, backup, diff, and regression run when it is actually
carried out.

## Selection criteria (applied mechanically, not by feel)

- **READY NOW** — the answer content has already been independently
  verified (this batch or an earlier one) *and* either no visual is needed
  (`diagram_status='not_applicable'`) or a visual has already been built and
  browser-QA'd and is waiting only to be associated. Nothing about the
  question is still under investigation; what remains is a mechanical,
  individually-gated promotion/association write.
- **VISUAL QA FIRST** — the answer content is already trustworthy
  (`answer_status='verified'`), but a real figure is confirmed to exist and
  is not yet servable (`diagram_status` is `source_diagram_preserved` or the
  question is backed only by a whole-page photo, per Task 14). Content work
  is done; visual production is the remaining gate.
- **CONTENT QA FIRST** — a specific, confirmed defect exists in the stored
  answer key (wrong index, mis-shaped `correct` value) that must be
  corrected before promotion, regardless of visual state.
- **BLOCKED** — resolving the question requires a decision this audit
  cannot make from source material alone (a genuine coin-flip ambiguity, or
  a structural/classification change), not just more transcription effort.

## The queue

### READY NOW (7) — content done, visual done or not needed; only a gated promotion/association write remains

| id | question_uid | what's already done | remaining write(s) |
|---|---|---|---|
| 4575 | cbse-mathematics-polynomials-752a6e3e | answer corrected+verified (3e/3f), visual live (`adapted_verified`) | promote `status` transcribed→verified |
| 1727 | icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6 | answer independently re-confirmed correct (Task 12), visual built+QA'd (Task 12) | promote `answer_status`/`status`, associate visual |
| 2061 | icse-chemistry-electrolysis-c018bc46 | format defect corrected (Task 7), visual built+QA'd (Task 11) | promote `answer_status`/`status`, associate visual |
| 4569 | cbse-mathematics-polynomials-c8d33f9f | answer corrected+verified (Task 5), no diagram needed | promote `status` transcribed→verified |
| 4651 | cbse-mathematics-quadratic-equations-c4d82213 | answer corrected+verified (Task 5), no diagram needed | promote `status` |
| 4662 | cbse-mathematics-quadratic-equations-5d3d3ec3 | answer corrected+verified (Task 5), no diagram needed | promote `status` |
| 4665 | cbse-mathematics-quadratic-equations-a21efcaa | answer corrected+verified (Task 5), no diagram needed | promote `status` |

None of these require new investigation. Each still needs its own
correction-record-style gated write (or, for the 4 pure `status` promotions,
the same guarded-`UPDATE`-with-verification pattern used for 1230/1594's
promotion) plus a post-write diff, regression run, and hash check — batching
them into one blind write is exactly what this session's standing rules
prohibit.

### VISUAL QA FIRST (6) — content already verified; a real figure is confirmed to exist and needs building/cropping

| id | question_uid | evidence a real figure exists | what's needed |
|---|---|---|---|
| 4580 (part iv) | cbse-mathematics-polynomials-03cd6312 | `diagram_status='source_diagram_preserved'`, content already corrected+verified (Task 5) | build/associate the preserved diagram, then promote `status` |
| 4279 | cbse-mathematics-circles (Fig. 8.42) | `answer_status='verified'` already; whole-page photo on file (`22d04f1c.jpg`) | crop/redraw the figure, associate, promote `status` |
| 4280 | cbse-mathematics-circles (p.8.14 figure) | same page photo, content verified | crop/redraw, associate, promote |
| 4282 | cbse-mathematics-circles (Fig. 8.43) | same page photo, content verified | crop/redraw, associate, promote |
| 4283 | cbse-mathematics-circles (Fig. 8.44, incircle) | same page photo, content verified | crop/redraw, associate, promote |
| 4284 | cbse-mathematics-circles (Fig. 8.45) | same page photo, content verified | crop/redraw, associate, promote |

These 5 CBSE Circles items are drawn from the 42-row cluster Task 14
identified as the best concrete next visual-production pool: every one
already has `answer_status='verified'` and a real rendered whole-page photo
on disk (not a raw PDF), so there is zero risk of building a visual for a
question that turns out not to need one, or of an on-disk file turning out
missing. The other 37 rows in that cluster are the natural continuation of
this same queue once these 5 are done.

### CONTENT QA FIRST (1) — visual work would be wasted until the answer key itself is fixed

| id | question_uid | defect |
|---|---|---|
| 4833 | cbse-mathematics-co-ordinate-geometry-845687ea | three separate confirmed defects in parts (i)/(iii)/(v) (Task 10); a courtyard-grid visual is already built and QA'd (Task 10) and can be associated independently, but the question itself cannot be promoted until all three parts are corrected |

### BLOCKED (1) — needs a classification/format decision, not just re-derivation

| id | question_uid | why blocked |
|---|---|---|
| 1965 | icse-chemistry-periodic-table-0270e846 | its three case-parts' `correct` values are element symbols (`"F"`,`"He"`,`"'Z'"`), not option indices — this is a `kind`/`question_format` mismatch (free-text items mis-ingested as scored `parts_json`), not a wrong-index defect; fixing it means deciding how to represent a free-text sub-part in this schema, a decision beyond what source re-derivation alone can settle |

## Flagged but deliberately left out of this 15-item queue

- **id 4648** — Task 5 found the originally-flagged defect here to be
  genuinely ambiguous (not confirmable either way from source) and
  correctly left it untouched rather than guessing. It stays exactly as
  workstream-4e left it: `answer_status='verified'` (unchanged, not
  re-affirmed), a standing open question rather than a queued action.
- **ids 2941, 3003, 3228** — the 3 currently-*gradable* duplicate-correct-
  answer-text findings (Section F, re-confirmed unchanged in Task 13). These
  are already live and already correct in their credited answer — the
  defect is a repeated-text distractor, a fairness/quality issue, not a
  wrong-answer risk — so they are not blocking anything today. They belong
  in a distractor-rewrite pass, not this promotion-focused queue.
- **The remaining 123-row `competency.pdf` Chemistry defect batch** (Task
  13) and the **~67-question-and-growing `needs_visual_review`→
  `not_applicable` reclassification backlog** (Task 14) are real, scoped
  follow-on work, but they are batch/triage tasks, not individual next
  questions — each is a strong candidate for its *own* future batch
  instruction (e.g. "review and fix the competency.pdf Chemistry answer
  keys, chapter by chapter") rather than a slot in a 15-question queue built
  from individual question IDs.

## What this queue is not

This is a prioritized worklist, not a promise that all 15 are equally easy
or equally low-risk. The 7 READY NOW items are administratively simple but
still require the full gated-write discipline per item. The 6 VISUAL QA
FIRST items require real drawing work (the same SVG-redraw process used for
1508/1231/4833/2061/1727 this batch). The 1 CONTENT QA FIRST item is a
3-part correction requiring the same rigor Task 10 used. The 1 BLOCKED item
needs a schema/format decision made by whoever owns that call, not more
investigation from this audit.
