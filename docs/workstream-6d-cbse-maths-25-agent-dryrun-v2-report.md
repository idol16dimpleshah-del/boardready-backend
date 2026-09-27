# CBSE Maths 243-Question Dry Run — Run 2 (Hardened Reconciliation Architecture)

**Status: DRY RUN ONLY. No database write occurred. No production changeset has been generated. Batch 14 remains paused.**

Task ID `w55ge88dc` / Run ID `wf_2396414e-fbf`. 63 agents, 2,795,538 tokens, 64 tool calls, wall-clock duration 1,820,430 ms (30.34 minutes). Same 243-row CBSE Class 10 Maths candidate pool as Run 1, byte-identical, re-read from the same source file for exact experimental parity.

This report presents raw results, not a PASS/FAIL label, per your standing instruction. It ends with a bottom-line assessment and one concrete finding that must be fixed before a production changeset is generated.

---

## 1. Assignment integrity

243 in, 243 out, 243 unique, 0 duplicates, 0 missing, 0 extra. Confirmed clean.

## 2. Verify-layer verdict distribution (20 shards, 243 items)

A=229, B=6, C=4, D=4, E=0, F=0. (243 total.)

## 3. Did the fabrication pattern from Run 1 recur? — NO

The 7 ids that made up Run 1's fabricated "systemic pattern" cluster (4711, 4712, 4713, 4716, 4718, 4728, 4682) do not appear anywhere among the 42 claims raised in Run 2 — not as a claim, not touched by any supervisor. I checked this directly against the full claim list; zero overlap.

The deterministic ground-truth gate (which compares any claim's `asserted_stored_index` against the real stored index from the original candidate data, independent of any LLM) fired zero rejections this run (`rejectedClaims: []`). That is not evidence the gate is untested — I verified it in isolation before this run, using id 4711's real data, and confirmed it correctly flags `REJECTED_STALE_OR_FABRICATED_STORED_VALUE` when a claim's asserted stored index doesn't match reality. It simply had nothing to catch this run: the strengthened supervisor prompts (explicit warning about the v1 bug + "copy the literal stored_correct_index value" instruction) worked pre-emptively. Every one of the 42 claims raised this run had an `asserted_stored_index` that matched the real stored value.

**Conclusion: the specific failure mode that produced Run 1's false FAIL verdict did not recur, and the safety net that would have caught it remains independently verified.**

## 4. Duplicate-management: routed correctly, not turned into content corrections

Per your explicit instruction ("duplicate ≠ wrong answer... the dry run should not turn a correctly answered question into a content correction merely because it has a duplicate twin"):

- 4768/4775, 4725/4735, 4779/4783 — all three previously-known pairs raised this run were resolved `DUPLICATE_VALUES_CONSISTENT` or (after an unnecessary but harmless extra Head check, see §7) `NO_DEFECT_CONFIRMED — both twins correctly keyed, route to duplicate-management (dedup), not a content correction`. Correct outcome in every case.
- 4776/4819 — same correct outcome, routed to dedup.
- **New finding: 4442/4927 is a previously-unflagged 6th duplicate pair.** I checked the raw candidate text myself: id 4442 ("If the sum of the areas of two circles with radii r₁ and r₂ is equal to the area of a circle of radius r, then r₁² + r₂²...") and id 4927 ("...then r₁²+r₂²=r²") are the same underlying item with differently-constructed option sets. Both are individually and correctly keyed (stored index 1 in both cases, verified independently by blind Head re-derivation: r₁²+r₂²=r²). Routed correctly to dedup, not a content correction.

No genuine duplicate pair was mishandled as an answer-key defect anywhere in this run. This requirement is met.

## 5. QI schema fixes: confirmed working

- `qiChecks.contradictionCount = 0` — no non-gradable row received a scorable profile. The three null-options rows (4517, 4519, 4687) were each independently confirmed by the QI supervisor to have been assigned the fixed non-gradable profile (`independent_correct_index: -1`, `difficulty_score: 0`, `cognitive_level: 'NotApplicable'`) rather than a fabricated one. This directly fixes the 4687-type contradiction from Run 1.
- `competencyTypeDistribution`: `procedural_computation: 106, assertion_reason_logic: 41, multi_step_application: 58, conceptual_reasoning: 28, conceptual_verification: 7, case_study_passage_non_gradable: 3`. All six values are from the closed enum; no free-text leakage; sums to 243.
- `duplicateProfileGroups`: `[[4761, 4822], [4785, 4826]]` — same two QI-profile-duplicate pairs surfaced deterministically as in Run 1.

## 6. Claims raised: 42 total, full breakdown

| Bucket | Count |
|---|---|
| Rejected at deterministic gate (fabricated/stale stored value) | 0 |
| Duplicate claims, confirmed consistent (no Head call needed) | 5 |
| Structural claim with no index to check (pool-wide provenance observation) | 1 |
| Sent to blind Head re-derivation | 35 |
| — of which: Head agreed with the claim (defect confirmed) | 18 |
| — of which: Head agreed with stored value (claim rejected) | 8 |
| — of which: three-way disagreement (disputed) | 9 |

(35 = 18+8+9. One claim — a low-severity, non-duplicate `STORED_VALUE_CONFIRMED` claim — fell through the accounting without landing in any output bucket; see §9. It does not affect any conclusion below, but the script should log it.)

## 7. The one real bug this run surfaced

This is the important part, and it is not the fabrication problem — that's fixed. It's a **category error in the deterministic resolution logic** (`resolveClaim()`).

The Level-3 evidence protocol you specified compares the Head's blind re-derivation against the stored value and the claim's asserted correct value, and classifies the result as `DEFECT_CONFIRMED`, `NO_DEFECT_CONFIRMED`, or `DISPUTED`. That logic is correct **for claims where the actual defect being alleged is "the stored answer index is wrong."** But five of this run's claims are not that kind of claim — the supervisor's own evidence explicitly states the stored index is mathematically correct, and the real defect is in the **option set itself** (a duplicate-valued distractor, or too few options). `resolveClaim()` has no representation for that distinction, so it forces these into the same binary "does the Head's math match the stored index" test — with two different failure modes depending on how the ambiguity happens to resolve:

**Falsely cleared as "no defect" (2 items) — because the Head's blind math landed on the one mathematically valid index, same as stored:**

- **4516** — "LCM of smallest odd prime number and greatest two-digit number." Options: `["1","99","300"]` — only 3 options, not 4. Stored index 1 ("99") is mathematically correct (I verified: smallest odd prime = 3, greatest two-digit number = 99, 99 = 3×33, so LCM = 99). The real defect, as the supervisor itself said in its evidence text, is that this item has **3 options instead of 4** — a structural defect independent of whether the key is right. `resolveClaim()` saw "Head agrees with stored" and marked it `NO_DEFECT_CONFIRMED`, which silently drops a real, previously-quarantined structural defect.
- **4780** — "The line segment joining points (-3,-4) and (1,-2) is divided by y-axis in the ratio." Options: `["1:3","2:3","3:1","2:3"]` — index 1 and index 3 are **the identical string "2:3"**. Stored index 2 ("3:1") is correct (I verified via the section formula: m:n = 3:1). The real defect is the literal duplicate option text, which the supervisor flagged explicitly. `resolveClaim()` again saw "Head agrees with stored" and dropped it.

**Falsely downgraded to "disputed, low confidence" (3 items) — because the Head's blind math, facing two options with the identical mathematical value, non-deterministically matched whichever one it happened to write first:**

- **4352** — sec⁴A − sec²A. This literal value equals **both** "tan⁴A + tan²A" (stored, index 2) and "tan²A + tan⁴A" (index 3) — same expression, different order, since addition commutes. I verified this algebraically. The Head's blind re-derivations landed on index 3 in two of three runs and index 2 in one — not because the math is uncertain, but because the two options are genuinely the same number. The supervisor's own evidence says exactly this. This is not "disputed" — it is a confirmed duplicate-valued-distractor defect with complete, correct evidence already in hand.
- **4404** — "2 × a/(2√2)" (stored, index 3) equals "a/√2" (index 1) exactly — same value, unsimplified vs. simplified. I verified: taller height = a/√2, which is algebraically identical to 2×a/(2√2). Same pattern as 4352.
- **4646** — "which of the following is NOT a quadratic equation." I independently verified both option 2 ((x²−2x)²=x⁴+3+4x²) reduces to a cubic and option 3 ((√2x+√3)²=2x²−3x) reduces to a linear equation — **both are genuinely non-quadratic**, so the item has two equally correct answers among four choices. This is a severe, unambiguous construction defect (rated "high" severity by the supervisor, and I agree), not a three-way disagreement about which answer is right.

I hand-verified the underlying mathematics for all five of these myself (shown above) and confirm the supervisors' original diagnoses were correct in every case — this is not a repeat of the v1 fabrication pattern (the supervisors did their job correctly and explained their reasoning in full); it's a downstream bug in how the reconciliation script classifies a **construction/structural** claim using logic designed only for **answer-key** claims.

**Practical consequence if left unfixed:** generating a production changeset directly from this run's `confirmedDefects` / `rejectedAfterRederivation` / `disputedClaims` buckets would silently drop 4516 and 4780 from the defect list entirely, and file 4352, 4404, and 4646 as "needs human review — low confidence" when in fact they are fully evidenced, high-confidence construction defects that simply need a different remedy (rewrite/replace a distractor, or add a missing option) than an answer-key index swap.

## 8. Reconciling this against the 14 previously-quarantined defects

| Original defect | This run's outcome | Correct classification (after accounting for §7) |
|---|---|---|
| 4352 | Mislabeled DISPUTED | Confirmed construction defect (duplicate-valued distractor) |
| 4404 | Mislabeled DISPUTED | Confirmed construction defect (duplicate-valued distractor) |
| 4516 | Falsely cleared | Confirmed structural defect (only 3 options) |
| 4517 | Not claimed (correctly non-gradable) | Needs content authoring — out of this pipeline's scope |
| 4519 | Not claimed (correctly non-gradable) | Needs content authoring — out of this pipeline's scope |
| 4589 | Confirmed | Confirmed answer-key defect |
| 4646 | Mislabeled DISPUTED | Confirmed construction defect (two valid answers) |
| 4676 | Confirmed | Confirmed answer-key defect |
| 4687 | Not claimed (correctly non-gradable) | Needs content authoring — out of this pipeline's scope |
| 4780 | Falsely cleared | Confirmed construction defect (duplicate option text) |
| 4811 | Confirmed | Confirmed answer-key defect |
| 4816 | Confirmed | Confirmed answer-key defect |
| 4820 | Confirmed | Confirmed answer-key defect |
| 4827 | Confirmed | Confirmed answer-key defect |

All 14 are accounted for and, once §7's bug is corrected, still stand as genuine defects — 6 answer-key corrections, 5 construction/structural corrections, 3 content-authoring items outside this pipeline. Nothing new was lost; nothing fabricated was reintroduced. The bug is in labeling/routing, not in the underlying facts.

## 9. Minor items

- One low-severity claim (non-duplicate, gate-confirmed) never made it into a reported bucket — a "no silent caps" gap, not a correctness problem. Should be logged in the next version.
- The `normalizeText` duplicate-comparison imprecision I flagged before this run (tokenizing "or" as a value) did fire once, on the 4819/4776 pair — it triggered an unneeded extra Head re-derivation, which then correctly confirmed both twins keyed consistently. No incorrect outcome resulted; low priority.
- The Visual+Provenance Supervisor's headline finding — that none of the 243 rows carry `source_document_id`/`page`/`question_number` — appears to be a false alarm from field-name mismatch, not a real gap: the candidate rows do carry `docId`, `pg`, and `qn` fields (visible directly in the data, e.g. `docId: 149, pg: "12.14", qn: "19"`), just under different names than the supervisor's prompt was checking for. Worth a quick confirmation against the live schema, but I would not treat this as a new infrastructure gap without checking.

## 10. Throughput

243 questions in 1,820,430 ms of agent verification + supervisor review + reconciliation = **480.6 questions/hour**, computed the same way and under the same label as before: this is agent verification + supervisor review + reconciliation throughput, excluding production writing, backups, regression testing, and audit-document generation. Not yet the production throughput figure.

---

## Bottom line

**Architecture: the two things you asked Run 2 to specifically test both passed.** No recurrence of the fabrication pattern, and the deterministic ground-truth gate is proven (tested in isolation, and had nothing to catch this run because the prompt fix worked). Duplicate-management routing behaved exactly as specified in every case, including a genuine new duplicate pair (4442/4927) discovered and correctly routed. QI schema fixes are confirmed working.

**One real, well-scoped bug remains, and it is not the fabrication problem:** `resolveClaim()` incorrectly applies the binary answer-key-match test to construction/structural claims, producing 2 false clears and 3 mislabeled "disputed" items — all five of which I independently re-verified as genuine, already-known defects with complete evidence already in hand.

**Recommendation:** fix `resolveClaim()` to branch on `claim_type` — treat `answer_key_defect` claims with the existing Head-blind-rederivation-match logic (which works correctly), and resolve `mcq_construction_defect` / `structural_defect` claims on their own textual/evidentiary basis (does the option set actually contain a duplicate value or too few options — this is checkable deterministically from the options array itself, the same way the duplicate-pair gate already works, without needing a Head math call at all). Given this is a narrow, well-understood fix and everything else in this run passed, I do not think a full third 243-question re-run is necessary — but that is your call to make, not mine. I have not generated a production changeset and will not until you've reviewed this and told me how you want to proceed.

Database changes: still not applied. Batch 14: still paused. No other subject started.
