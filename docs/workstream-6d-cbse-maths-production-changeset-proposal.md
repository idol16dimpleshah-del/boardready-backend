# CBSE Maths Production Changeset — Proposal for Review

**Status: PROPOSAL ONLY. No database write has occurred or is authorized by this document. This is Step 3 of the agreed plan (generate the changeset for review); Step 4 (guarded write with backup/diff/regression/grading/hash verification) requires separate, explicit, item-by-item authorization.**

Source: Run 2 (`wf_2396414e-fbf`) + the narrow re-check (`wf_ea6c83ba-271`) that fixed and validated `resolveClaim()`'s handling of construction/structural claims. All 14 items below were originally quarantined during the 25-agent dry run and confirmed twice since: once by independent blind Head re-derivation (answer-key items) or deterministic/equivalence-agent check (construction/structural items), and once by my own hand-verification of the underlying mathematics.

This changeset has three tiers, because they are not the same kind of fix and should not be applied the same way:

- **Tier 1 — mechanical answer-key corrections (6 items).** A single-column change: `questions.correct` moves from one integer to another. This is what the guarded-writer pipeline (backup → guarded transaction → diff → regression → grading check → hash) was built for.
- **Tier 2 — content/construction corrections (5 items).** The stored answer key is correct and should NOT change. The defect is in the option set itself (too few options, a literal duplicate, or two independently valid answers). Fixing these means authoring or revising option text — an editorial decision, not an index flip. I've included a suggested remediation for each, but these need content-team sign-off on the actual replacement wording before any write, and the write itself touches `options_json`, not `correct` — a different, less mechanical risk profile than Tier 1.
- **Tier 3 — out of scope for this changeset (3 items).** Non-gradable stems with no options at all. These need content authoring/source re-extraction, not a database correction of any kind.

Six duplicate-content pairs were also found across the two runs. None of them belong in this changeset — per your explicit instruction, a duplicate is not a wrong answer, and turning one into a content correction would be a mistake. They're listed at the end for routing to the existing duplicate-management workflow.

---

## Tier 1 — Mechanical answer-key corrections (6 items)

Each of these was independently re-derived blind (the Head model was shown only the question and options — never the stored value or the supervisor's claim) and disagreed with the current stored index while agreeing with a specific alternative. I re-verified the underlying math myself for each.

| ID | Chapter | Current `correct` | Current text | → | Corrected `correct` | Corrected text | Basis |
|---|---|---|---|---|---|---|---|
| 4589 | Polynomials | 1 | "(b)" | → | **3** | "(d)" | Assertion-reason: 12/α+12/β−24αβ = −295 ≠ 395, so Statement-1 is false; Statement-2 (Vieta's formulas) is true → answer is (d), not (b). |
| 4676 | Quadratic Equations | 2 | "2" | → | **1** | "3" | Exactly 3 quadratics (x²=0, x²−x=0, (x−1)²=0) have roots unchanged by squaring — not 2. |
| 4811 | Co-ordinate Geometry | 0 | "7 + √5" | → | **3** | "12" | Triangle (0,4)-(0,0)-(3,0) is a 3-4-5 right triangle; perimeter = 12. |
| 4816 | Co-ordinate Geometry | 0 | "7" | → | **2** | "6" | Square ABCD with A(5,p), B(1,5), C(2,1), D(6,2) requires p = 6, not 7. |
| 4820 | Co-ordinate Geometry | 0 | "a=8/3, b=2/3" | → | **1** | "a=7/3, b=0" | Trisection of (3,-4)-(1,2) gives a=7/3, b=0. |
| 4827 | Co-ordinate Geometry | 0 | "12, -18" | → | **1** | "-12, 18" | \|x−3\|=15 gives x=18 or x=−12, i.e. "-12, 18", not "12, -18". |

These 6 are ready for the guarded-writer pipeline as soon as you authorize Step 4: correction record per item → byte-identical backup → guarded transaction → full-table diff → `content-qa-audit.js` re-run → 71/71 SQLite + 71/71 PostgreSQL regression → live grading-behavior check via `scoring.js` → hash verification before/after → commit.

## Tier 2 — Content/construction corrections (5 items, answer key unchanged)

None of these should have their `correct` value touched. The stored answer is right; the option list is the problem.

| ID | Defect | Current options | Suggested remediation (needs content-team sign-off) |
|---|---|---|---|
| 4352 | Options 2 and 3 are the same value in different order: "tan⁴A + tan²A" = "tan²A + tan⁴A" | `["tan²A - tan⁴A","tan⁴A - tan²A","tan⁴A + tan²A","tan²A + tan⁴A"]`, correct stays at index 2 | Replace option 3 with a genuinely distinct, non-equivalent distractor (e.g. "sec²A·tan²A" or "2tan²A") |
| 4404 | Options 1 and 3 are the same value: "a/√2" = "2×a/(2√2)" | `["a√2","a/√2","a/(2√2)","2 × a/(2√2)"]`, correct stays at index 3 | Standardize the correct answer's notation (recommend simplifying to "a/√2") and replace the now-redundant unsimplified option with a distinct distractor |
| 4516 | Only 3 options instead of the standard 4 | `["1","99","300"]`, correct stays at index 1 | Author a 4th plausible distractor (e.g. "297" — a common miscalculation of 3×99) |
| 4646 | Options 2 and 3 are both independently non-quadratic (one cubic, one linear) — two valid answers to "which is NOT a quadratic equation" | `["3(x + 1)² = 2x² + x + 4","5x + 2x² = x² + 9","(x² - 2x)² = x⁴ + 3 + 4x²","(√2x + √3)² = 2x² - 3x"]`, correct stays at index 2 | Revise option 3 into an equation that genuinely reduces to a quadratic (removing the ambiguity), or revise the question stem to ask for "the equation of lowest degree" if both non-quadratic answers should count |
| 4780 | Options 1 and 3 are the literal identical string "2:3" | `["1:3","2:3","3:1","2:3"]`, correct stays at index 2 | Replace option 3 with a distinct ratio distractor not equal to 1:3, 2:3, or 3:1 (e.g. "1:2") |

These are proposals, not final wording — I generated plausible replacement distractors for illustration, but authoring the actual replacement text is an editorial call I don't think I should make unilaterally. Recommend a content reviewer confirms or replaces each suggested distractor before any write. Applying these also means writing to `options_json`, which the current guarded-writer pipeline was built and tested around `correct`-column changes — worth confirming the diff/regression tooling handles an `options_json` write with the same rigor before this tier is applied.

## Tier 3 — Out of scope for this changeset (3 items)

| ID | Issue |
|---|---|
| 4517 | Word-problem stem present, but `opts` and `correct` are both null — no MCQ options were ever attached |
| 4519 | Same — stem present, no options |
| 4687 | Case-study passage stem present, no options |

These aren't answer-key or construction defects — they're incomplete ingestions (the stem exists but its multiple-choice options were apparently never extracted, or the source material is a multi-part item that needs its sub-questions split out). No database correction applies here; this needs a content-authoring or re-extraction pass against the original source document, separate from this changeset entirely.

## Not part of this changeset: duplicate-content pairs (route to dedup workflow)

All six pairs below are individually and correctly keyed. Per your instruction, none of these should be turned into a content correction — they need the existing duplicate-management workflow to decide retain-one / retain-both / defer.

| Pair | Both correctly keyed as |
|---|---|
| 4768 / 4775 | p = ±4 |
| 4776 / 4819 | y = 3 or −9 |
| 4779 / 4783 | x = −63 |
| 4683 / 4686 | no real roots |
| 4725 / 4735 | −(p+q) |
| 4442 / 4927 | r₁²+r₂² = r² |

---

## Summary

- **6 items** ready for the mechanical guarded-write pipeline (Tier 1), pending your authorization.
- **5 items** need an editorial decision on replacement option text before any write (Tier 2) — I've proposed a starting point for each but would not apply these without content-team confirmation of the actual wording.
- **3 items** are out of scope for a database correction entirely (Tier 3) — need content authoring.
- **6 duplicate pairs** route to the existing dedup workflow, untouched here.

No write has been made. Nothing in Batch 14's sequential promotion has resumed. Waiting on your direction for which tier(s), if any, to move into Step 4.
