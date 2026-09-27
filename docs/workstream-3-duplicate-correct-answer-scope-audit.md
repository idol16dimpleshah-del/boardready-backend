# Duplicate-Correct-Answer-Text Scope Audit

**Date:** 2026-09-25
**Trigger:** id 2941 (Workstream 3A) surfaced a specific, narrow shape of
defect — the option text the answer key credits also appears, verbatim, at
another option index in the same question. Before considering any
general/global grading rule to handle this shape (e.g. "if two options have
identical text and one is marked correct, treat all identical-text options
as equivalent for grading"), this audit answers: **how often does this
actually happen across the whole bank, and where?** This is a read-only
report only — nothing has been changed, and no grading-rule change has been
implemented.

**Method:** added a new, permanent check (`auditDuplicateCorrectAnswerText`,
Section F) to `scripts/content-qa-audit.js` — still opened with
`{ readOnly: true }`, so it is bound by the same hard write-guarantee as
every other check in that tool. It differs from the existing "D. Structural
completeness → `options_has_duplicate_text`" check: that one flags *any*
duplicate pair among a question's options, regardless of which one is
correct; this new check only flags a question when the **credited** option's
text is the one duplicated elsewhere — the specific shape that creates real
grading-fairness exposure, since a student choosing the other, identically
worded option would be marked wrong.

## Result

**7 questions bank-wide** have this shape (5 MCQ + 2 case sub-parts).
**3 of the 7 are currently gradable** (`status='verified'`) — i.e., live and
student-facing today.

### Currently-gradable (3) — the ones with real, present exposure

| id | Kind | Chapter | Credited answer (duplicated) | Options |
|---|---|---|---|---|
| **2941** *(already known from Workstream 3A)* | mcq | ICSE Maths — Banking | `₹10800` (index 0, also at index 2) | `["₹10800","₹10080","₹10800","₹11441.25"]` |
| **3003** *(new)* | case, part 3 | ICSE Maths — Shares and Dividend | `₹960` (index 2, also at index 0) | `["₹960","₹840","₹960","₹700"]` |
| **3228** *(new)* | case, part 1 | ICSE Maths — Problems on Quadratic Equations | `(35-x)` (index 3, also at index 2) | `["(35+x)","(x-35)","(35-x)","(35-x)"]` |

Neither 3003 nor 3228 has been source-verified yet (i.e., it is not yet known
whether the duplicate is a pre-existing textbook error, as with 2941, or an
ingestion mis-transcription, as with 3033/3070) — that per-question
source-comparison was outside what this scope audit was asked to do. It is a
natural, small follow-up if/when you want it, using the same method as
Workstream 3A.

### Backlog / not currently gradable (4) — same shape, lower urgency

| id | Kind | Status | Chapter | Credited answer (duplicated) | Options |
|---|---|---|---|---|---|
| 1137 | mcq | transcribed | ICSE Maths — Arithmetic Progression | `(8n - 2)` | `["(6n - 2)","(8n - 2)","(6n + 2)","(8n - 2)"]` |
| 1322 | mcq | transcribed | ICSE Maths — Geometric Progression | `5` | `["10","5","6","5"]` |
| 1384 | mcq | transcribed | ICSE Maths — Section and Midpoint Formula | `(-4, -15)` | `["(4, 15)","(4, -15)","(-4, -15)","(-4, -15)"]` |
| 3632 | mcq | needs_review | ICSE History & Civics — Formation and Objectives of the Muslim League | `8 April, 1900` | `["11 April, 1900","8 April, 1900","8 April, 1900","30 April, 1900"]` |

## What this means for the proposed grading rule

The pattern is real but narrow: **7 questions out of 4,946** (0.14% of the
bank), concentrated in ICSE Mathematics numeric/algebraic-expression
answers and one History & Civics date question — not a systemic issue
across the bank, but not a one-off either. Before deciding whether "treat
identical-text options as equivalent when one is marked correct" should
become a standing grading rule, worth weighing:

- It would only ever *help* a student (never cost one credit they should
  get), since it only broadens what counts as correct, never narrows it —
  the risk is scope, not fairness in the rule itself.
- It changes `scoring.js`'s comparison from a pure index match to a
  text-aware fallback, so it touches the core grading path for every
  question, not just these 7 — worth deciding how much test coverage that
  deserves before shipping it, even though it's a small, well-contained
  change in principle.
- The alternative (source-verify and hand-correct each of the 7
  individually, as was done for 3033/3070) avoids touching `scoring.js` at
  all, at the cost of being a per-question, manual process — feasible at
  this scale (7 questions), less so if this shape turns out to be more
  common elsewhere in ways this specific check doesn't catch (e.g.
  near-duplicate but not exact-text-match wrong answers).

No action has been taken on any of these 7. This document, plus the new
Section F in `scripts/content-qa-audit.js` and its output in
`docs/content-qa-audit-output.json`, is the full record for the product
decision on 2941 (and, now, its 6 siblings) that Workstream 3A left open.

## Verification

Live database SHA-256 unchanged before and after this audit:
`ac204d4919aee876d9f0e706dbad628a1d8ba8d5737f5717d0698a699890cba3` (this is
the hash *after* the two approved 3033/3070 corrections in
`docs/workstream-3a-correction-record-3033-3070.md` — see that document and
the sibling report for the full before/after chain). No row was written by
this audit.
