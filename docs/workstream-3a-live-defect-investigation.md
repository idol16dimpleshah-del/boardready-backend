# Workstream 3A — Investigation of the 8 Currently-Gradable Content Defects

**Date:** 2026-09-24
**Scope:** per explicit instruction, a read-only, per-question investigation of
the 8 currently-gradable (`status='verified'`) content-quality defects
surfaced in `docs/content-qa-readiness-report.md` Section 4 — before any
correction of the 125 backlog answer-key defects, and before any change is
made to the live database. Each of the 8 was individually traced back to its
immutable original source page (rendered directly from the untouched PDF in
`source_library/`, never edited) and visually verified. **No question,
answer, status, or source file has been modified.** Live database SHA-256
confirmed unchanged before and after this investigation:
`cda008e972b4caf5453537cc33f52e473300ad225bf5d384aef3399009d18c52`.

## Method

For each question: pulled the full live row (`text`, `options_json`,
`correct`, `status`, `answer_status`, `source`, `source_page`,
`source_question_number`, `answer_key_ref`) with a read-only query, located
the exact source PDF and page named in `source_document_id`/`source_page`,
rendered that page directly from the untouched PDF file at high resolution
(`pymupdf`, read-only — the PDF itself was only opened for rendering, never
written to), and visually compared every option's text, letter-by-letter,
against what this audit script had flagged. This distinguishes two very
different situations that a "duplicate option text" flag conflates by itself:
a defect **already present in the original printed textbook** (safe to
leave as a faithful transcription, or a separate editorial decision), versus
a defect **introduced during our own transcription/ingestion** (a
straightforward, source-verified fix).

## Findings and proposed disposition

| id | Question (chapter) | Defect | Root cause | Grading-fairness impact | Proposed disposition |
|---|---|---|---|---|---|
| **2865** | "GST is:" (ICSE Maths, GST) | Flagged `text_missing_or_too_short` | **False positive of this audit's own heuristic.** The source's item (4) is verbatim "GST is:" followed by self-contained options — a legitimate, complete MCQ stem, not truncated content. | None — `correct=1` ("an indirect tax") is right. | **False positive.** No change to the question. Recommend the structural-completeness heuristic in `content-qa-audit.js` be refined later (e.g., only flag `text` under 8 chars when the question also lacks the kind of self-completing options this stem has) — a tooling improvement, not a content fix. |
| **2868** | "What does 'I' in IGST stands stand for?" (ICSE Maths, GST) | Options A and C both "Internal" | **Source-material defect.** Verified on the printed page (`ch01-gst.pdf`, p.1.3, item 7): the original book itself prints "(A) Internal (B) Integrated (C) Internal (D) Intra" — including the same "stands stand" grammar slip. Our transcription is a faithful copy of a flawed original. | None — `correct=1` ("Integrated") is unique; the duplicate is between two wrong options. | **Faithful transcription of a known source error — leave as-is.** Recommend logging it as a documented, source-attributed known issue rather than silently "fixing" a value that was never in the source (fabricating a 4th distinct wrong answer would no longer be a transcription of the textbook). |
| **2941** | "...Rahul opened a recurring deposit... total money deposited..." (ICSE Maths, Banking) | Options A and C both "₹10800"; **`correct=0`, i.e. the credited answer's own text is duplicated** | **Source-material defect.** Verified on the printed page (`ch02-banking.pdf`, p.2.3, item 14): the original prints "(A) ₹10800 (B) ₹10080 (C) ₹10800 (D) ₹11441.25" — the duplicate is in the textbook itself. | **Yes — this is the one real grading-fairness risk in the set.** A student who selects option C (visually identical to the credited option A) is marked wrong even though they chose the same value the answer key credits. | **Needs a deliberate human decision, not an automatic fix.** Three honest options, none of which this audit will pick on its own: (1) leave as a faithful-to-source transcription and accept the small fairness risk, documented; (2) a product-level fix — accept either A or C as correct for this specific question (an app-level exception, not a content edit); (3) replace one of the duplicate option's *text* with a different plausible wrong value not present in the source — this would deviate from the textbook and should only be done with explicit sign-off, since it is no longer a transcription. Recommending option (2) as the least invasive, but leaving the choice to you. |
| **3033** | "...solution set of x ≤ 3... set of integers?" (ICSE Maths, Linear Inequation) | Options B and C both "{......,−2,−1,0,1,2,3}"; `correct=2` | **Transcription error introduced during our own ingestion**, not a source defect. Verified on the printed page (`ch04-linear-inequation.pdf`, p.4.4, item 20): the source has 4 **distinct** options — (A) {0,1,2,3} (B) {......,−2,−1,0,1,**3**} *(no 2)* (C) {......,−2,−1,0,1,2,3} ✓ (D) {.....,−2,−1,1,2,3} *(no 0)*. Our stored option B was mis-copied to duplicate option C's text instead of the source's actual (also slightly-flawed-by-design, but distinct) option B. | None currently (the duplicate is between the correct answer and a wrong option, but a student would only be confused, not miscredited, since B and C would grade identically if a naive equality-of-text check were ever used — the app compares by index, so this is a content-quality issue, not a scoring bug). | **FIX — source-verified, straightforward correction.** Change stored option B (index 1) from `"{...,-2,-1,0,1,2,3}"` to `"{......, -2, -1, 0, 1, 3}"` to match the source exactly. `correct=2` is already right and needs no change. |
| **3053** | "...smallest value of x... 20 − 5x < 5(x + 8)..." (ICSE Maths, Linear Inequation) | Options B and D both "-3" | **Source-material defect.** Verified on the printed page (p.4.6, item 40): the original prints "(A) −1 (B) −3 (C) 1 (D) −3" — the duplicate is in the textbook itself. | None — `correct=0` ("-1") is unique; the duplicate is between two wrong options. | **Faithful transcription of a known source error — leave as-is.** Same reasoning as 2868. |
| **3070** | "Identify the correct solution set of the following number line..." (ICSE Maths, Linear Inequation) | Options C and D both "{x∈R, −4≤x≤5}"; `correct=1` | **Transcription error introduced during our own ingestion**, not a source defect. Verified on the printed page (p.4.8, item 57): the source has 4 **distinct** options — (A) {x∈Z,−4<x<5} (B) {x∈Z,−4<x≤5} ✓ (C) {x∈R,−4≤x≤5} (D) {x∈R,**−4≤x<5**}. Our stored option D was mis-copied to duplicate option C's text instead of the source's actual, distinct option D. | None — `correct=1` is unique either way. | **FIX — source-verified correction.** Change stored option D (index 3) from `"{x∈R, -4≤x≤5}"` to `"{x:x∈R, -4≤x<5}"` to match the source exactly. `correct=1` is already right. *Separately*, this question is also one of the 25 gradable rows in the visual-completeness report with a raw-PDF-reference defect — and the source page confirms the number line shown *is* a real, question-specific diagram (dotted markers −4 to 6, hollow circle at −4, filled circle at 5), not an ambiguous shared whole-page image, so it is a good, concrete candidate for the first manually-cropped diagram once Workstream 3B tooling exists. |
| **3595** | "The partition of Bengal was an attempt to prevent ___ & ___ from getting united." (ICSE History & Civics) | Options A and D both "Christians, Hindus" | **Source-material defect.** Verified on the printed page (`ch11-13-...pdf`, p.185, item 18): the original prints "(a) Christians, Hindus (b) Muslims, Hindus (c) Muslims, Christians (d) Christians, Hindus" — the duplicate is in the textbook itself. | None — `correct=1` ("Muslims, Hindus") is unique. | **Faithful transcription of a known source error — leave as-is.** |
| **3755** | "Who was the last Viceroy of India?" (ICSE History & Civics) | Options A and D both "Lord Ripon" | **Source-material defect.** Verified on the printed page (`ch14-17-...pdf`, p.215, item 16): the original prints "(a) Lord Ripon (b) Lord Curzon (c) Lord Mountbatten (d) Lord Ripon" — the duplicate is in the textbook itself. | None — `correct=2` ("Lord Mountbatten") is unique and historically correct. | **Faithful transcription of a known source error — leave as-is.** |

## Summary by disposition

- **False positive (1):** id 2865 — a tooling heuristic issue, not a content
  defect. No content change; a future refinement to the audit script's own
  length check is the only follow-up, and it doesn't touch any question data.
- **Faithful transcription of a pre-existing source-textbook error, no
  grading-fairness impact (5):** ids 2868, 3053, 3595, 3755, and the
  wrong-distractor half of the source-defect population. Recommend: leave
  untouched, but keep a documented record (this report) that these are
  known, source-attributed, low-severity issues rather than transcription
  bugs — useful context if a student or teacher ever reports "two answers
  look the same."
- **Faithful transcription of a pre-existing source-textbook error, WITH
  grading-fairness impact (1):** id 2941 — the one case where the *correct*
  answer's text is the duplicated one. This is the single item in this
  investigation that genuinely needs a human decision before Workstream 3
  moves on, since every option (leave as-is, add an app-level equivalence
  exception, or edit the option text away from the source) carries a
  trade-off explained above.
- **Genuine transcription errors, source-verified fix available (2):** ids
  3033 and 3070 — in both cases the source has four distinct options, our
  own ingestion introduced the duplicate by mis-copying one option's text
  from a neighboring option, and the source itself tells us exactly what the
  correct text should be. These are the two candidates ready for a
  straightforward, evidence-backed correction once you approve it — nothing
  has been changed in the database yet.

## What was not done

No `correct` value, `status`, `answer_status`, option text, or any other
field was written to the live database. No source PDF was modified — each
was opened only for rendering a page image to compare against, using the
same read-only pattern as the rest of this workstream. The 125 backlog
answer-key defects and the visual-completeness findings from
`docs/content-qa-readiness-report.md` were not touched or re-scored here;
they remain exactly as reported, still in the `transcribed`/backlog pool,
awaiting the separate Workstream 3C pass you outlined. No question was
promoted, unpublished, or deleted.

## Recommended next step

This report is the "propose correction table for review" you asked for.
Two items (3033, 3070) have a clear, source-verified fix ready for your
go-ahead. One item (2941) needs your decision on which of the three
disposition options above to take. The remaining five are recommended to be
left as-is with this document serving as their record. Once you confirm how
you'd like each handled, the actual write (a single, explicit, reviewed
update — never a bulk operation) can be made and re-verified against the
live database hash before and after, the same way every other step in this
project has been.
