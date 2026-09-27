# CBSE Maths Batch 14 — 20-Verifier / 4-Supervisor / 1-Head-Supervisor Dry Run

**Raw/full report, as requested.** This is not a PASS/FAIL recommendation —
it is the complete evidence from the read-only dry run, plus an independent
re-check I ran against the live pool data on the two findings that drove
the architecture's own self-reported verdict, so the gate-by-gate audit can
be done on solid ground rather than on a label.

**No database write occurred at any point in this dry run.** Every agent
operated only on a fixed, pre-fetched snapshot of the 243-row candidate
pool passed in as static input; no agent had filesystem, database, or
Node.js API access. Batch 14 sequential promotion remains paused. The
single guarded writer was not invoked.

- Workflow run ID: `wf_cc5b3022-ef1`, Task ID `wiuh5v78h`
- Launched: 2026-09-27T05:51:41Z · Completed: 2026-09-27T06:23:31Z
- Harness diagnostics: `agent_count:25, agents_done:25, agents_error:0, agents_skipped:0, agents_empty_result:0, subagent_tokens:1,316,826, tool_uses:40, duration_ms:1,907,524` (≈31.79 minutes)

---

## Headline correction before anything else

The architecture's own Head Supervisor synthesis (reproduced verbatim in
§7 below) returned `"dry_run_verdict": "FAIL"`. I re-derived the two
findings that FAIL rests on directly against the raw pool data before
writing this report, because forwarding a FAIL label without checking it
would be exactly the "accepting a PASS/FAIL label" the whole point of this
exercise was to avoid. Here is what I found:

1. **The "236 vs 243" scope-mismatch finding, raised independently by all
   four Supervisors and cited by the Head Supervisor as one of two
   disqualifying issues, is not a real data problem.** It's an artifact of
   my own prompt wording: the Supervisor briefing prompts I wrote carried
   forward the phrase "the remaining 236 CBSE Maths candidates" from the
   user's own original pause instruction (written before Batch 13 dropped
   the true count to 243), while the actual `args` data handed to every
   agent already contained the correct, freshly-queried 243 rows. Every
   Supervisor correctly noticed the number in its prompt text didn't match
   the row count it was handed — and correctly flagged that as suspicious
   — but none of them had the conversational context to know the "236"
   was already a known-stale figure from an earlier turn, not evidence of
   a duplicate, dropped, or late-inserted row. The deterministic,
   non-agent assignment-integrity check (243 in, 243 out, 243 unique, 0
   duplicates, 0 missing, 0 extra) is the authoritative number here, and
   it is clean. **This is a dry-run harness design flaw on my part (stale
   text baked into a prompt), not an architectural or data-integrity
   failure.**

2. **The "systemic pattern" of 7 supposedly-mis-verified `A` items
   (4711, 4712, 4713, 4716, 4718, 4728, 4682) and 3 of the 5 "duplicate
   cross-shard conflict" pairs (4776/4819, 4779/4783, 4683/4686) — the
   other disqualifying finding, and the more serious one — do not hold up
   against the raw data.** I pulled the actual stored text/options/
   `correct` index for all 13 of these ids plus every id involved in the
   Construction Supervisor's cross-references and independently
   recomputed each answer by hand. In **every single instance**, the
   value the Construction Supervisor described as "stored" does not match
   what is actually stored — and the value that actually is stored is
   already mathematically correct and already agrees with its "duplicate
   twin." For example:

   - **id 4711** ("Which term of the A.P. 21, 42, 63, 84,... is 210?",
     options `["9th","10th","11th","12th"]`). Solving gives n=10 → index
     1. The DB's `correct` field **is already index 1** ("10th"). The
     Supervisor's note claims "marked A/'9th'" — index 0 — which is
     simply not what's stored.
   - **id 4718** (9th term 449, 449th term 9, find the term equal to
     zero → n=458, index 2 of `["501th","502th","458th","none of these"]`).
     The DB's `correct` field **is already index 2** ("458th") — exactly
     what the Supervisor itself computed as correct — yet it was reported
     as a mismatch.
   - **id 4682** (`9x²−6x−2=0`, discriminant = 108 > 0 → 2 distinct real
     roots, index 2 of `["no real root","2 equal roots","2 distinct
     roots","more than 2 real roots"]`). The DB's `correct` field **is
     already index 2** — again, exactly the value the Supervisor itself
     derived as correct.
   - The same pattern holds for 4712, 4713, 4716, 4728 — in all four, the
     value the DB actually credits is the mathematically correct one, and
     matches what the Supervisor itself computed, despite the note
     claiming otherwise.
   - **The three "conflicting duplicate pairs":** 4776 (stored index 1 =
     "3, -9") and 4819 (stored index 0 = "3 or -9") are the same
     question, both correctly keyed to the same value — not a conflict.
     4779 (stored index 0 = "-63") and 4783 (stored index 2 = "-63") are
     likewise identical content, both correctly keyed — not a conflict.
     4683 (stored index 3 = "no real") and 4686 (stored index 1 = "no
     real roots") are likewise the same equation (x²+x+1=0, discriminant
     −3), both correctly keyed to "no real roots" — not a conflict. A
     fourth pair, 4725/4735 (the classic S_p=q, S_q=p AP identity), was
     also asserted to share "a systematic solving error" against a
     supposed shared wrong answer of "0" — but both are stored as
     `-(p+q)`, the mathematically correct value, so that claim is false
     too.

   The pattern across all 11 of these false claims is consistent: the
   Construction Supervisor appears to have assumed the *stored* answer sat
   at option index 0 (or otherwise mismatched option letters to indices —
   see the 4516 case in §7, where it also confused an MCQ option letter
   with this workflow's own A–F defect-verdict code) rather than reading
   the actual `correct` field for each row, then reported a mismatch that
   isn't there. **This is a real, reproducible defect in the Construction
   Supervisor's own reasoning — and, more importantly, the Head
   Supervisor's reconciliation stage did not catch it.** The Head
   Supervisor accepted the Construction Supervisor's fabricated cluster at
   face value, cross-referenced it against nothing, and used it as the
   primary basis for a FAIL verdict.

   The good news inside this: the two Supervisors did **not** agree with
   each other. The Answer-Math Supervisor spot-checked 46 of the 229 `A`
   verdicts (a different, overlapping sample) from first principles and
   reported 0 disagreements, HIGH confidence. That assessment is the one
   that survives independent re-checking — I re-verified 4711/4712/4713/
   4716/4718/4728/4682/4768/4775/4725/4735 by hand above and every one of
   the *actual* stored values is correct. So the 20-shard verification
   layer's underlying accuracy on these items is good; what failed is the
   reconciliation layer's ability to catch a subordinate supervisor
   hallucinating a defect rather than rubber-stamping it into a "FAIL."

**Net effect on the two blocking issues the architecture cited:** neither
survives independent re-verification. That does not make this dry run a
clean PASS — see §2 (Gate 2) for what remains genuinely unresolved
(reconciliation didn't verify a subordinate's claim before escalating it),
and the 14 real, confirmed defects below still need adjudication before
any promotion. But the specific two reasons the architecture gave for
FAILing itself are not supported by the data it was actually given.

---

## 1. Assignment integrity (Gate 1)

Deterministic, non-agent check comparing input candidate ids against the
union of all 20 shards' output ids:

```json
{
  "input_count": 243,
  "output_count": 243,
  "unique_output_count": 243,
  "duplicate_output_ids": [],
  "missing_ids": [],
  "extra_ids": [],
  "confirmed": true
}
```

Shard sizes (round-robin partition, 20 shards):
`13,13,13,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12,12` (sums to 243).

**Result: clean pass.** 243/243 covered, zero duplicates, zero omissions,
exactly one primary verifier per id. The "236 vs 243" language every
Supervisor raised against this is addressed in the headline correction
above — it is not a defect in this check.

## 2. Verification quality (Gate 2)

- All 4 Supervisors independently re-derived findings; the Answer-Math
  Supervisor's 60-item sample (100% of the 14 non-A verdicts + 46 of the
  229 A verdicts, spread across all 20 shards) found 0 disagreements and
  explicitly rated the verification layer's math accuracy HIGH.
- The Construction Supervisor's spot-check of *other* A-verdict items
  (the AP/Quadratic-Equations cluster) produced a HIGH-severity conflict
  claim that does **not** survive independent re-verification (§ headline
  correction). This is the one place the "no unexplained conflicts" bar
  was not met: the conflict existed, but on inspection it lives in the
  Construction Supervisor's own reasoning, not in the underlying data.
- **The reconciliation failure that matters:** the Head Supervisor's
  synthesis treated the Construction Supervisor's cluster as corroborated
  fact ("Two independent lines of evidence converge...") without
  independently re-deriving even one of the 7 items itself. A
  reconciliation stage whose job is specifically to arbitrate
  supervisor-vs-supervisor disagreement did not do that arbitration here —
  it deferred to the more alarming claim rather than checking either
  side against source data.

**Result: partial.** Underlying verification accuracy checks out under
independent re-verification. Reconciliation-stage diligence does not —
this is a genuine architectural gap to fix before trusting this pipeline
unattended, separate from the content of Batch 14 itself.

## 3. Defect detection (Gate 3) — held ids stayed held; new defects isolated, not promoted

Of the 8 ids already known-held from the manual Batch 1–13 campaign and
still present in this 243-row pool, **7 of 8 were independently
reconfirmed** with matching defect classes:

| id | Prior campaign classification | This dry run's verdict | Match? |
|---|---|---|---|
| 4352 | MCQ construction defect | C — duplicate-value/notation | ✓ |
| 4404 | duplicate-value/notation defect | C — duplicate-value/notation | ✓ |
| 4516 | structural defect | D — structural/options | ✓ |
| 4517 | incomplete-verification defect | D — structural/options (null options) | ✓ |
| 4519 | (not previously classified; new to this list per cumulative doc's 236-candidate framing) | D — structural/options (null options) | ✓ |
| 4589 | B (held) | B — answer-key defect | ✓ |
| 4646 | MCQ construction defect (source-confirmed) | C — MCQ construction defect | ✓ |
| 4442 | duplicate-management hold | not present in this pool's 14 flagged ids | n/a — 4442's hold is a `duplicate_flags`-table condition, outside what a per-question content re-derivation checks; this dry run did not run a duplicate_flags cross-check as a distinct step |

**7 new, independently-confirmed defects** not on the prior held list, all
of which I re-derived by hand against the raw stored text/options/
`correct` values and confirmed genuine:

| id | Stored (wrong) | Correct | Defect class |
|---|---|---|---|
| 4820 | a=8/3, b=0 | a=7/3, b=0 | B — answer-key |
| 4676 | 2 | 3 | B — answer-key |
| 4827 | 12, −18 | −12, 18 | B — answer-key |
| 4811 | 7+√5 | 12 | B — answer-key |
| 4816 | 7 | 6 | B — answer-key |
| 4780 | 3:1 (correct value, but options[1]==options[3]=="2:3") | — | D — structural (duplicate option string) |
| 4687 | scored profile assigned to a null-options case-study stem | — | D — structural (non-gradable row) |

No held or newly-flagged defect was promoted, corrected, or otherwise
written to the database — the dry run had no write path available to it.

**Result: pass**, with the one caveat that "new defects" here means
per-question math/construction defects only; the architecture did not
independently attempt a `duplicate_flags`-table reconciliation the way
the manual campaign's guarded-write step does.

## 4. Question Intelligence quality (Gate 4)

All 243 rows got a complete profile (`difficulty_score`, `cognitive_level`,
`competency_type`, `question_archetype`, `distractor_pattern`,
`estimated_time_seconds`, `concept_tags`) — no missing/empty required
fields, no out-of-range `difficulty_score`, no unrecognized
`cognitive_level`, no empty `concept_tags`. Difficulty distribution
1:25, 2:91, 3:78, 4:43, 5:6. 201 distinct `question_archetype` values
across 243 rows (organically varied, not templated). Cognitive-level skew
toward "Apply" (143/243) is expected for a procedural MCQ bank.

Four real problems, none blocking on their own:

1. **id 4687 carries a scorable difficulty/cognitive-level profile despite
   having `options: null`** — a non-gradable case-study stem dressed up
   with a full QI profile as if it were answerable. Would corrupt
   downstream difficulty/time-on-task analytics if shipped as-is.
2. **`competency_type` is uncontrolled free text, not an enum** — 22
   distinct values across 243 rows, 17 of them singletons, including
   three different labels for the exact same "non-gradable passage"
   situation (4517, 4519, 4687). Not aggregable as-is.
3. **The `difficulty_reason` field the QA spec expected does not exist in
   the schema actually produced** (only a bare `difficulty_score`
   integer) — this was a real gap in how I specified the QI schema for
   the dry run, not a data defect; the "check for repeated
   difficulty_reason text" gate literally could not run.
4. Two pairs of rows (4761/4822, 4785/4826) have byte-identical QI
   profiles — plausible for genuinely recurring textbook templates, but
   worth a spot-check to rule out lazy stamping.

**Result: mostly pass, with defined fixes needed** — schema/taxonomy
issues on my end (items 2–3) and one contradictory row (item 1), none of
which required a database write to discover or would block re-running the
gate after a schema fix.

## 5. Operational throughput (Gate 5)

- **Verified → supervisor-reviewed → reconciled, full pipeline: 243
  questions in 1,907,524 ms (31.79 minutes) = ≈458.6 questions/hour.**
  This is the number the user specifically asked to be the one that
  matters — the fully reconciled production-ready rate, not raw
  single-stage verifier throughput.
- 25/25 agents completed with 0 errors, 0 skipped, 0 empty results — no
  worker failures or retries occurred in this run, so there's no retry
  behavior to characterize from this data point.
- 40 total tool calls across 25 agents, 1,316,826 subagent tokens.
- **Honest caveat on the "vs. Batch 1–13 baseline" comparison the user
  asked for:** the sequential manual campaign's per-batch pace is not
  recorded as clean wall-clock-per-question data — each batch also
  included cross-referencing the physical source PDF, writing the
  cumulative audit document, running the guarded promotion script, and a
  full backup/diff/regression/hash cycle, none of which this dry run did
  (it wrote nothing). Batch 13 alone (25 questions, with PDF
  cross-verification) took a full multi-tool-call conversational turn on
  the order of many minutes of wall clock for 25 questions — call it a
  rough single-digit questions/minute at most once you include the
  guarded-write and audit-doc overhead, versus this run's 243 questions
  in ~32 minutes for verification + reconciliation alone (excluding any
  write). **These are not apples-to-apples numbers** — the 458.6/hour
  figure covers verification and reconciliation only, with zero writes,
  zero backups, zero regression suite, and zero audit-doc authoring; the
  manual pace includes all of that. A fair comparison would need the
  guarded-write/backup/regression/audit step timed separately and added
  to whichever pipeline is doing it.
- **Estimated throughput for future 1,000+ question uploads:** at the
  observed 458.6/hr rate for the verify+reconcile stage alone, 1,000
  questions would take ≈2.2 hours of agent wall-clock for that stage. The
  concurrency cap (min(16, cpus−2) per workflow) means this scales
  roughly linearly with more shards up to that cap, then flattens; a
  1,000-question run would need proportionally more shards (~80 at the
  same ~12-13/shard size) but the same 4-supervisor/1-head structure,
  which is unlikely to be the bottleneck at this scale. This estimate
  does **not** include the separate, always-required guarded-write step
  for whatever subset is actually promoted, which remains sequential and
  individually gated by design.

**Result: pass on the number itself; the comparison the user asked for
needs a like-for-like timing of the write/audit stage before it's
meaningful**, which this dry run intentionally did not exercise.

---

## 6. The 12 requested report items

1. **Total questions processed:** 243.
2. **Assignment coverage and overlaps/gaps:** 243 in, 243 out, 0
   duplicates, 0 gaps (see §1). The "236" language in Supervisor notes is
   a stale-prompt artifact, not a coverage gap (see headline correction).
3. **A/B/C/D/E/F verdict counts:** A 229, B 6, C 3, D 5, E 0, F 0.
4. **Newly discovered defects:** 7, independently confirmed (§3 table).
5. **Existing held questions confirmed:** 7 of 8 (4442 out of scope for a
   per-question re-derivation; see §3).
6. **Supervisor disagreements and resolutions:** One material
   disagreement — Construction Supervisor's 7-item "systemic A-verdict
   blind spot" + 3 "duplicate conflict" claims vs. Answer-Math
   Supervisor's clean 46-item A-verdict spot-check — resolved *not* by
   the Head Supervisor (who sided with the unverified claim) but by my
   own independent re-derivation against the raw pool data, which
   confirms the Answer-Math Supervisor's side (see headline correction).
7. **QI completeness:** structurally complete on all hard gates; 4 open
   issues, none requiring a database write to fix (§4).
8. **Visual/provenance findings:** provenance hygiene clean (0/243 rows
   missing `source_document_id`/`source_page`/`source_question_number`);
   3 null-options rows correctly flagged as passage stems, not provenance
   defects; the `docId 146` vs `157` dual "Introduction to Trigonometry"
   chapter-numbering is worth a one-time confirmation but not blocking
   (full text in §7).
9. **Failed/retried agents:** 0. All 25 agents completed on the first
   attempt (`agents_error:0, agents_skipped:0, agents_empty_result:0`).
10. **Verified→supervisor-reviewed→reconciled questions/hour:** ≈458.6
    (§5).
11. **Estimated throughput for 1,000+ question uploads:** ≈2.2 hours of
    agent wall-clock for the verify+reconcile stage at the observed rate,
    scaling near-linearly with shard count up to the concurrency cap;
    excludes the separate, still-sequential guarded-write step (§5).
12. **Final proposed changeset — built by me from the raw evidence, not
    applied:** see §8 below.

---

## 7. Full raw output (verbatim)

### 7a. Non-A verify results (all 14; the 229 A-verdict rows are omitted
here for length — full JSON is in the workflow's persisted output file if
needed)

<details>
<summary>Click to expand all 14 non-A shard verdicts, verbatim</summary>

```json
[
  {"id": 4352, "independent_correct_index": 2, "matches_stored": true, "verdict": "C", "defect_taxonomy": "duplicate-value/notation defect"},
  {"id": 4404, "independent_correct_index": 3, "matches_stored": true, "verdict": "C", "defect_taxonomy": "duplicate-value/notation defect"},
  {"id": 4516, "independent_correct_index": 1, "matches_stored": true, "verdict": "D", "defect_taxonomy": "structural/options defect"},
  {"id": 4820, "independent_correct_index": 1, "matches_stored": false, "verdict": "B", "defect_taxonomy": "answer-key defect"},
  {"id": 4517, "independent_correct_index": -1, "matches_stored": false, "verdict": "D", "defect_taxonomy": "structural/options defect"},
  {"id": 4780, "independent_correct_index": 2, "matches_stored": true, "verdict": "D", "defect_taxonomy": "duplicate-value/notation defect"},
  {"id": 4519, "independent_correct_index": -1, "matches_stored": false, "verdict": "D", "defect_taxonomy": "structural/options defect"},
  {"id": 4589, "independent_correct_index": 3, "matches_stored": false, "verdict": "B", "defect_taxonomy": "answer-key defect"},
  {"id": 4646, "independent_correct_index": -1, "matches_stored": false, "verdict": "C", "defect_taxonomy": "MCQ construction defect"},
  {"id": 4676, "independent_correct_index": 1, "matches_stored": false, "verdict": "B", "defect_taxonomy": "answer-key defect"},
  {"id": 4827, "independent_correct_index": 1, "matches_stored": false, "verdict": "B", "defect_taxonomy": "answer-key defect"},
  {"id": 4811, "independent_correct_index": 3, "matches_stored": false, "verdict": "B", "defect_taxonomy": "answer-key defect"},
  {"id": 4687, "independent_correct_index": -1, "matches_stored": false, "verdict": "D", "defect_taxonomy": "structural/options defect"},
  {"id": 4816, "independent_correct_index": 2, "matches_stored": false, "verdict": "B", "defect_taxonomy": "answer-key defect"}
]
```

Each of these 14 carries a full free-text `notes` field with the shard
agent's derivation; those are reproduced in §3's table sources and were
independently re-derived by hand against the raw stored text/options
during this report's preparation — all 14 check out as genuine defects.

</details>

### 7b. Answer-Math Supervisor — full report

> **Domain:** CBSE Class 10 Maths — Answer-Math QA audit of 20-agent shard
> verification layer. **Reviewed:** 60 (all 14 non-A + 46 of 229 A,
> spread across all 20 shards). **Findings:** none (0 disagreements).
>
> Cross-references confirmed: 4352/4404 (both genuine duplicate-value
> defects), 4517/4519 (both genuinely truncated passage stems, correctly
> excluded from an index verdict), 4516/4780 (both structural defects
> independent of answer correctness).
>
> **Recommendation (verbatim):** "60/60 spot-checked items confirmed — 0
> disagreements. This sample deliberately covered every non-'A' shard
> verdict (all 6 B's, all 3 C's, all 5 D's = 14/14) plus 46 of the 229
> A-marked items (~1-in-5, spread across all 20 shards per the sampling
> design), and I re-derived each one from first principles rather than
> trusting the shard's stated verdict... Overall confidence in the
> 20-agent verification layer's math accuracy: HIGH. 60/60 confirmed, 0
> disagreements, and the sample happens to include 100% of the
> flagged-error population (all non-A verdicts), which is the
> highest-risk subset for a promotion decision... One item outside the
> math-audit scope but relevant to the reconciliation proof the head QA
> is being asked to demonstrate: the shard summary totals 243 verdicts
> ... while the orchestration task frames this as covering 'the remaining
> 236 CBSE Maths candidates.' That 243-vs-236 discrepancy (7 extra) is a
> supervisor/head-level bookkeeping question, not a per-question math
> defect, and should be resolved explicitly by the reconciliation step
> before this counts as a clean dry run... Recommendation: the
> math-verification layer itself has passed this audit cleanly."

### 7c. Question Construction Supervisor — full report

> **Domain:** CBSE Class 10 Mathematics MCQ Bank — Question Construction
> QA. **Reviewed:** 243 (C/D-verdict audit + cross-shard duplicate scan).
>
> Confirmed all 8 shard-flagged C/D items as genuine defects, with more
> precise sub-classification (duplicate/ambiguous distractors: 4352, 4780,
> 4404; out-of-range verdict / missing option: 4516; non-gradable passage
> stems scored as if answerable: 4517, 4519, 4687; genuinely ambiguous
> two-valid-answer key: 4646).
>
> Cross-shard duplicate scan found 5 genuine content duplicates (4768/
> 4775, 4776/4819, 4779/4783, 4683/4686, 4725/4735) and correctly rejected
> several large recurring-template families as false positives (AP
> common-difference phrasing, distance-formula-application, the
> Assertion-Reason rubric used across nearly every chapter).
>
> **The unverified claim (see headline correction — does not survive
> independent re-check):** "spot-checking non-flagged verdict='A'
> Arithmetic-Progression/Quadratic-Equation items shows the marked letter
> frequently does not match the mathematically correct option (e.g. 4711
> marked A/'9th' but correct is B/'10th'; ... )" and the "conflict"
> framing on 4776/4819, 4779/4783, 4683/4686, 4725/4735 — all refuted
> against the actual stored `correct` index in §"Headline correction."
>
> **Recommendation (verbatim, unedited — includes the unverified claim as
> originally written):** "Read-only content review only... (1) C/D-verdict
> audit (8 items): all 8 are confirmed genuine MCQ construction defects...
> (2) Cross-shard duplicate scan: 5 genuine content duplicates were found
> needing dedup... Three of these (4776/4819, 4779/4783, 4683/4686) are
> especially important for this dry run because the two shards that
> produced each pair actively DISAGREE with each other on identical
> underlying content... (3) Unplanned but material finding: spot-checks of
> items NOT flagged as C/D... show a high rate of the marked verdict not
> matching the mathematically correct option... This indicates the shard
> Verification Agents' answer-key computation... has a reliability gap
> materially larger than the 8-question defect set... Recommendation: keep
> Batch 14 sequential promotion paused."

### 7d. Visual + Provenance Supervisor — full report

> **Domain:** provenance/source-metadata hygiene QA. **Reviewed:** 243.
>
> Finding 1 (high, refuted — see headline correction): "236 vs 243" scope
> mismatch. Finding 2 (info): 3 null-options rows (4517, 4519, 4687) are
> case-setup passages, expected. Finding 3 (info): 0/243 rows missing
> `source_document_id`/`source_page`/`source_question_number`; per-doc
> chapter/page/question-number ordering fully consistent. Finding 4
> (medium): "Introduction to Trigonometry" is split across `docId 146`
> (1 row, page-prefix "10") and `docId 157` (22 rows, page-prefix "9") —
> each internally consistent, likely two different reference books with
> different chapter numbering, worth a one-time confirmation, not
> blocking.
>
> **Recommendation (verbatim):** "Provenance hygiene for this specific
> 243-row table is strong... there is no evidence of corrupted or
> cross-wired provenance in the rows themselves. Do not, however, treat
> this table as ready to unblock the... dry run's reconciliation and
> assignment-integrity checks until two things are resolved: (1)
> reconcile the 236-candidate figure... (2) confirm the Question
> Intelligence extraction stage's option-parsing logic explicitly
> special-cases the 3 null-options rows... The docId 146/157... dual
> numbering... is worth a quick manual confirmation but is not blocking."

### 7e. Question Intelligence Supervisor — full report

> **Domain:** QI dataset QA. **Reviewed:** 243.
>
> Findings: id 4687's scorable profile contradicts its own
> "no gradable options" classification (high); `competency_type` has no
> controlled vocabulary — the same non-gradable-passage situation gets 3
> different labels across 4517/4519/4687 (medium); `competency_type` is
> effectively free text overall (22 values, 17 singletons) (medium); the
> QA spec's `difficulty_reason` repetition check couldn't run because that
> field doesn't exist in the schema (medium); two pairs of rows
> (4761/4822, 4785/4826) have byte-identical QI profiles, plausible but
> worth a spot-check (low); the 236-vs-243 scope note (medium, refuted).
>
> **Recommendation (verbatim):** "No missing/empty required fields, no
> out-of-range difficulty_score, no unrecognized cognitive_level, and no
> empty concept_tags array were found across any of the 243 rows... the
> dataset is structurally complete on those four hard gates... That said,
> this is NOT yet publication-ready as a whole... Recommend a
> provisional/conditional pass: fix items (1)-(4) above, re-run the QA
> gate, and only then let the single guarded writer resume production
> promotion — this review itself is read-only and does not constitute
> that approval."

### 7f. Head Supervisor synthesis — full report (verbatim, unedited)

> **`dry_run_verdict`: "FAIL"**
>
> "Assignment integrity (the deterministic, code-computed check) is clean
> on its own terms: 243 in, 243 out, 243 unique, zero duplicates, zero
> missing, zero extra ids — confirmed:true. However, that check was run
> against 243 candidates while the promotion-pause instruction framed this
> run as covering 'the remaining 236 CBSE Maths candidates.' All four
> Supervisors independently flagged this same 7-item discrepancy and none
> of them (nor the head-level data supplied) offers an explanation (stale
> filter, late inserts, miscount, or genuinely out-of-scope items). Until
> that gap is explained, the assignment-integrity proof cannot be
> certified against the live DB's true candidate set...
>
> More importantly, the reconciliation step surfaced unresolved
> HIGH-severity conflicts, which alone is disqualifying per the pass
> criteria. Two independent lines of evidence converge on the same
> conclusion — the 20-shard Verification layer has a materially higher
> false-negative rate on answer-key correctness than the 14 items... it
> flagged itself: 1. A 'systemic pattern' cluster of at least 7 items
> (4711, 4712, 4713, 4716, 4718, 4728, 4682)... 2. The cross-shard
> duplicate scan found at least two duplicate-content pairs (4776/4819,
> 4779/4783) where one twin was verified 'A' with a wrong stored answer...
> plus one pair (4683/4686) where BOTH twins were verified 'A' with two
> different, mutually contradictory, and both wrong answers...
>
> By contrast, the 8 items the pipeline itself flagged as C/D (4352, 4404,
> 4516, 4517, 4519, 4646, 4780, 4687) were all independently confirmed as
> genuine defects... the verification layer's positive C/D detections are
> trustworthy; its problem is false negatives hiding inside the 'A'
> bucket, not false positives.
>
> Verdict: FAIL. Assignment integrity's 236-vs-243 scope mismatch is
> unresolved, and there are multiple unresolved high-severity conflicts...
> Batch 14 sequential promotion should remain paused and the single
> guarded writer should not resume until: (1) the 236/243 scope gap is
> explained and closed, (2) a full (non-sampled) answer-key
> re-verification is run across all 243 items rather than trusting
> existing 'A' verdicts, (3) the 5 confirmed duplicate-content pairs are
> adjudicated/deduped..., (4) the 8 confirmed C/D structural/key defects
> are corrected or excluded, and (5) the Question-Intelligence
> `competency_type` taxonomy and the 4687 non-gradable-item contradiction
> are fixed. No file or database write occurred during this dry run."

**As shown in the headline correction above, points (1) and (2) of the
Head Supervisor's own stated blocking conditions do not survive
independent re-verification against the raw pool data.** Points (3), (4),
and (5) are real and are carried into the proposed changeset below.

---

## 8. Proposed changeset (constructed by me from the raw evidence — NOT applied)

No write of any kind has been made. This is a review artifact only, in
the same format as `docs/correction-record-id68-legacy-quadratic-retirement.md`.

| id | Current status filter | Proposed action | Defect class | One-line justification |
|---|---|---|---|---|
| 4352 | transcribed/verified/not_applicable | Hold — do not promote as-is | C, duplicate-value | Options 2 and 3 are the identical value reordered; collapse before promoting. |
| 4404 | transcribed/verified/not_applicable | Hold — do not promote as-is | C, duplicate-value | Options 1 and 3 both equal a/√2; credited answer is numerically right but options need collapsing. |
| 4516 | transcribed/verified/not_applicable | Hold — do not promote as-is | D, structural | Only 3 options present; missing a 4th distractor. Credited value (99) is correct. |
| 4517 | transcribed/verified/not_applicable | Hold — needs merge with sub-question | D, structural | `options`/`correct` both null; this is a case-study passage stem with no attached gradable question. |
| 4519 | transcribed/verified/not_applicable | Hold — needs merge with sub-question | D, structural | Same defect class as 4517 (stairs-climbing case-study passage). |
| 4589 | transcribed/verified/not_applicable | Hold — correct answer key | B, answer-key | Statement-1 evaluates to −295, not 395; correct choice is (d)/index 3, not stored index 1. |
| 4646 | transcribed/verified/not_applicable | Hold — genuinely ambiguous (already known, source-confirmed) | C, MCQ construction | Options C and D both reduce to non-quadratic equations; two valid answers. |
| 4676 | transcribed/verified/not_applicable | Hold — correct answer key | B, answer-key | Correct count of qualifying quadratics is 3 (index 1), not stored index 2 ("2"). |
| 4780 | transcribed/verified/not_applicable | Hold — do not promote as-is | D, structural | Options 1 and 3 are both "2:3", a literal duplicate string; credited value (3:1) is correct. |
| 4687 | transcribed/verified/not_applicable | Hold — needs merge with sub-question | D, structural | `options`/`correct` both null; oil-profit case-study passage stem with no attached gradable question. |
| 4811 | transcribed/verified/not_applicable | Hold — correct answer key | B, answer-key | Triangle perimeter is 12 (3-4-5 right triangle), not stored "7+√5". |
| 4816 | transcribed/verified/not_applicable | Hold — correct answer key | B, answer-key | Square-vertex condition gives p=6, not stored p=7 (p=7 satisfies neither side-length equation). |
| 4820 | transcribed/verified/not_applicable | Hold — correct answer key | B, answer-key | Correct trisection values are a=7/3, b=0; stored a=8/3, b=2/3 does not satisfy the given constraints. |
| 4827 | transcribed/verified/not_applicable | Hold — correct answer key | B, answer-key | Correct solution set is {−12, 18}; stored {12, −18} does not satisfy \|x−3\|=15. |

Separately, for content-management (not correctness) attention — same-
question duplicates identified by the Construction Supervisor's scan,
recommended for a `duplicate_flags`-style dedup review rather than a
content correction:

- 4768 / 4775 (distance-formula "p" value; both already correctly keyed)
- 4776 / 4819 (line-segment ordinate; both already correctly keyed)
- 4779 / 4783 (collinearity x-value; both already correctly keyed)
- 4683 / 4686 (nature of roots, x²+x+1=0; both already correctly keyed)
- 4725 / 4735 (classic AP S_p=q/S_q=p identity; both already correctly keyed)

None of these 5 pairs need an answer-key correction — both twins in every
pair are already correct and already agree with each other. This
directly contradicts the Head Supervisor's characterization of 3 of these
pairs as "conflicting" (see headline correction).

**All 229 A-verdict ids not listed above** remain proposed-eligible for
the existing sequential Batch 14 promotion process, subject to the
existing guarded-write methodology — this dry run's findings do not
identify any additional A-verdict id as defective beyond what's in this
table, once the fabricated cluster is set aside.

---

## What this means for resuming production promotion

This is the user's call, per their own framing ("I can then audit whether
the architecture has actually earned the right to move from dry-run →
controlled production writer, rather than just accepting a 'PASS' label").
What the evidence shows, without a label attached:

- The core verification layer (20 shards) and the deterministic
  assignment-integrity check performed well and check out under
  independent re-verification.
- The Question Construction Supervisor found genuinely valuable things
  (all 8 shard-flagged C/D defects confirmed with better sub-
  classification; a real 5-pair duplicate-content scan a sequential
  single-pass process would likely have missed) — but also fabricated an
  11-claim cluster of false defects/conflicts, apparently from misreading
  which option index was actually stored.
- The Head Supervisor's reconciliation stage — the layer whose entire job
  is to arbitrate exactly this kind of supervisor disagreement — did not
  do so. It escalated the unverified claim into a FAIL rather than
  checking it, which is the most consequential finding of this dry run:
  the architecture's top-level check does not yet re-verify a
  subordinate's claims before acting on them.
- 14 real defects (7 previously known, 7 newly confirmed) are ready for
  the existing guarded-write correction process, exactly as Batches 1–13
  have handled prior finds.
- No data was written; no promotion occurred; Batch 14 sequential
  promotion remains paused pending this audit.
