# Source Verification — All 7 Duplicate-Correct-Answer-Text Questions

**Date:** 2026-09-25
**Trigger:** per instruction, before considering any grading-equivalence rule
for the shape id 2941 first surfaced (the credited answer's own text
duplicated elsewhere in its options), every one of the 7 bank-wide instances
found in `docs/workstream-3-duplicate-correct-answer-scope-audit.md` was
traced to its exact source PDF page and visually verified — the same method
used for the original 8 live defects in Workstream 3A. **Read-only. No
question, answer, or source file was modified.** Live database SHA-256
unchanged throughout: `ac204d4919aee876d9f0e706dbad628a1d8ba8d5737f5717d0698a699890cba3`.

## Result: this reclassifies the finding

Of the 7, only **1 (id 2941) is a genuine source-textbook error with live
grading-fairness exposure** — the case this workstream was worried about.
**2 more (ids 3003, 3228) turn out to be the same kind of transcription
error as 3033/3070**, not ambiguous or source-attributed at all — clean,
source-verified fixes exist for both. The remaining **4 (1137, 1322, 1384,
3632) are pre-existing textbook errors**, faithfully transcribed, none of
which are currently gradable.

| id | Kind | Status | Verdict | Source evidence |
|---|---|---|---|---|
| **2941** | mcq | verified (gradable) | **Source-material defect — real grading-fairness exposure** | `ch02-banking.pdf` p.2.3 item 14: printed "(A) ₹10800 (B) ₹10080 (C) ₹10800 (D) ₹11441.25" — duplicate is in the book itself. *(Already established in Workstream 3A.)* |
| **3003** | case, part (iv) | verified (gradable) | **Transcription error — fixable** | `ch03-shares-and-dividend.pdf` p.3.7 item 38(iv): printed "(A) ₹560 (B) ₹840 (C) ₹960 (D) ₹700" — 4 distinct values. Our stored option index 0 was mis-copied to duplicate index 2's text (`₹960`) instead of the source's actual `₹560`. `correct=2` (₹960) is already right. |
| **3228** | case, part (ii) | verified (gradable) | **Transcription error — fixable** | `ch06-problems-on-quadratic-equations.pdf` p.6.9 item 32(ii): printed "(A) (35+x) (B) (x-35) (C) (x+5) (D) (35-x)" — 4 distinct values. Our stored option index 2 was mis-copied to duplicate index 3's text (`(35-x)`) instead of the source's actual `(x+5)`. `correct=3` (35-x) is already right. |
| 1137 | mcq | transcribed (backlog) | Source-material defect | `chap_10.pdf` p.10.5 item 45: printed "(A) (6n-2) (B) (8n-2) (C) (6n+2) (D) (8n-2)" — duplicate is in the book itself. |
| 1322 | mcq | transcribed (backlog) | Source-material defect | `chap_11.pdf` p.11.4 item 31: printed "(A) 10 (B) 5 (C) 6 (D) 5" — duplicate is in the book itself. |
| 1384 | mcq | transcribed (backlog) | Source-material defect | `chap_13.pdf` p.13.6 item 36: printed "(A) (4,15) (B) (4,-15) (C) (-4,-15) (D) (-4,-15)" — duplicate is in the book itself. |
| 3632 | mcq | needs_review (backlog) | Source-material defect | `ch11-13-...pdf` p.192 item 18: printed "(a) 11 April, 1900 (b) 8 April, 1900 (c) 8 April, 1900 (d) 30 April, 1900" — duplicate is in the book itself. |

## What this means for the grading-equivalence question

The scope just got smaller, not bigger. Once 3003 and 3228 are corrected the
same way 3033 and 3070 were — a straightforward, source-verified options-text
fix, no scoring-path change needed — **id 2941 is the only remaining
instance, bank-wide, of a currently-gradable question where the credited
answer's own text is genuinely duplicated in the source material.** A single
known instance does not, on its own, justify a change to `scoring.js`'s
shared comparison logic; it's a strong argument for handling 2941 the same
deliberate, individual way as the other source-attributed errors (2868,
3053, 3595, 3755, and now 1137/1322/1384/3632): documented, left faithful to
the source, no code change. The three options laid out for 2941 in
`docs/workstream-3a-live-defect-investigation.md` still stand; this document
just confirms there is no wider pattern requiring a systemic fix.

## Proposed next step (pending your approval — nothing has been changed)

Extend the same correction-record-then-apply process already used for
3033/3070 to **3003** and **3228**: a new correction record documenting the
exact before/after option text and source citation for each, then — only on
approval — the same guarded, transaction-based, backed-up write, followed by
the same re-verification (content-QA audit re-run, full 71/71 suite on both
engines, full-table diff against a fresh backup, hash recorded before and
after).
