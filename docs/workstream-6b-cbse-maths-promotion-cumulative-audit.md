# CBSE Mathematics Content-Promotion Campaign — Cumulative Audit (Batch 16)

**Candidate pool definition:** `status='transcribed' AND answer_status='verified'
AND diagram_status='not_applicable' AND board='CBSE' AND subject='Mathematics'`.
At the start of this campaign: **560 questions** (the earlier 692-row
bank-wide estimate included ICSE Geography; the ~660 CBSE-only estimate
included questions later found to need a visual — this session's own SQL
query against the live row set is the authoritative count: 560).

**Scope of the defect-rate figures in this document — read before citing
any percentage below.** Every "defect rate" in this document (2.0% at
the 300-question checkpoint, etc.) is `(substantive defects found) /
(candidates individually examined by this campaign so far)`. It
describes **only this campaign's own CBSE Maths candidate pool** — the
560 questions that were `status='transcribed'`, `answer_status='verified'`,
`diagram_status='not_applicable'` at campaign start. It is **not** an
estimate of the defect rate across the bank's full ~4,946 questions, most
of which (ICSE content, other CBSE subjects, rows still at `transcribed`/
un-examined, rows outside this specific filter, and pre-provenance legacy
rows such as id 68 — see the correction record below) have not been
individually re-verified by this process and are not represented by this
number. A defect rate computed here says something precise about the
questions this campaign has actually re-derived from first principles; it
says nothing about content this campaign has not touched.

**Method, per question, before any write:** read the exact question text and
options; independently re-derive the answer from first principles (formula
application / geometric theorem / direct computation — not the printed key
or the `answer_key_ref` note, though that note is compared against
afterward as a second check); map the result to the stored options in
0-based index order explicitly; cross-check against `questions.correct`;
check `duplicate_flags` and the duplicate-correct-answer-text audit for the
id; re-confirm `diagram_status='not_applicable'` is actually correct (the
question is genuinely self-contained, no figure needed) rather than assumed;
confirm `GRADABLE_STATUSES` would newly include this row once promoted.

**Classification:**
- **A** — verified + ready for promotion (status-only guarded write)
- **B** — answer-key defect (wrong index found)
- **C** — ambiguous / needs review (genuine, unresolved interpretive ambiguity)
- **D** — source defect (the source material itself is internally inconsistent)
- **E** — visual actually required (despite `diagram_status='not_applicable'`)
- **F** — other publication blocker

Promotion scope for every A: `status` transcribed→verified ONLY.
`answer_status`/`diagram_status`/`correct`/every other field untouched.

**Defect taxonomy (added after the 200-question checkpoint, requested by
the user so the non-A rows say what needs fixing upstream, not just a
single defect-rate percentage):**

- **Answer-key defect** — the stored `correct` index points to a value
  different from the independently-derived answer. Zero found so far.
- **MCQ construction defect** — more than one option is simultaneously a
  true/correct statement, independent of which one is credited (a
  question-design flaw, not a wrong-index flaw).
- **Duplicate-value/notation defect** — two options are the same
  mathematical value written in different notation (so the option set
  effectively has fewer distinct choices than it appears to).
- **Source defect** — the source material itself is internally
  inconsistent in a way that isn't a construction or notation issue (e.g.
  a genuine duplicate-ingestion clash between two source documents).
- **Structural/options defect** — the row's structure is malformed
  independent of content correctness (wrong option count, missing option
  array entries, malformed `parts_json`).
- **Incomplete-verification defect** — added as a 7th bucket, distinct
  from the user's original six: a row where a *prior* verification pass
  was recorded as complete (`answer_status='verified'`) but the row's own
  stored explanation admits the check was not actually carried out. This
  doesn't fit "source defect" or "MCQ construction defect" cleanly (the
  math itself may well be correct) — it's a defect in the verification
  record, which is exactly the failure mode this campaign exists to
  catch, so it gets tracked on its own rather than forced into one of the
  other buckets.
- **Policy hold** — not a defect: a row deliberately held back for
  duplicate-management reasons (the 4442/4927 "hold one back" decision).

Retroactive classification of every non-A row found in Batches 1-8 (the
200-question checkpoint), using this taxonomy:

| id | batch | bucket |
|---|---|---|
| 4352 | 2 | Duplicate-value/notation defect |
| 4404 | 4 | Duplicate-value/notation defect |
| 4442 | 6 | Policy hold |
| 4516 | 8 | Structural/options defect |
| 4517 | 8 | MCQ construction defect |
| 4519 | 8 | Incomplete-verification defect |

By this taxonomy, across the first 200 examined: 0 answer-key defects,
1 MCQ construction defect, 2 duplicate-value/notation defects, 0 source
defects, 1 structural/options defect, 1 incomplete-verification defect,
1 policy hold. Every batch's write-up from Batch 9 onward reports counts
in this breakdown alongside the existing A-F letter classification.

---

## Batch 1 (ids 4264–4328, chapter: Circles, n=25)

All 25 independently re-derived from first principles (tangent-radius
right-triangle relationships, tangent-length equality, Pitot's theorem,
angle-sum properties, chord-length formula) — full per-question derivation
kept in the batch script's commit message, not duplicated here.

| id | check | result |
|---|---|---|
| 4264 | PQ=√(OQ²−OP²)=√(144−25)=√119 | matches `correct=3` |
| 4265 | r=√(25²−24²)=7 | matches `correct=0` |
| 4266 | dist=√(3²+4²)=5 | matches `correct=2` |
| 4267 | conceptual; genuine textbook-phrasing ambiguity (already disclosed in `explanation`), "infinite" is the standard published answer for this exact common MCQ phrasing | **A**, ambiguity noted, not blocking |
| 4268 | 180−100=80° | matches `correct=2` |
| 4269 | isosceles right triangle at P ⇒ 45° | matches `correct=1` |
| 4270 | angle ACB=90° (Thales, common tangent at external contact point) | matches `correct=3` |
| 4271 | inradius=(8+6−10)/2=2 | matches `correct=1` |
| 4272 | angle POQ=180−120=60°, right triangle ⇒ angle OPQ=30° | matches `correct=2` |
| 4273 | Pitot: AB+CD=BC+AD | matches `correct=1` |
| 4274 | √(8²−6²)=2√7 | matches `correct=1` |
| 4275 | DA=DB=DC=4 ⇒ AB=8 | matches `correct=2` |
| 4276 | 180−130=50° | matches `correct=1` |
| 4277 | intersecting circles ⇒ max 2 common tangents | matches `correct=1` |
| 4278 | OAPB square, side=radius=4 | matches `correct=1` |
| 4281 | angle AOB=130°, isosceles ⇒ angle OAB=25° | matches `correct=0` |
| 4302 | inradius=(5+12−13)/2=2 | matches `correct=2` |
| 4303 | angle APB=90° (same theorem as 4270) | matches `correct=3` — **83% near-duplicate of 4318**, see below |
| 4311 | AP=AQ=√(15²−9²)=12 ⇒ sum=24 | matches `correct=2` |
| 4312 | chord at distance \|8−5\|=3 from center, half-chord=√(25−9)=4 ⇒ chord=8 | matches `correct=3` |
| 4313 | right triangle at T ⇒ angle OPT+angle POT=90° | matches `correct=2` |
| 4318 | angle APB=90° (same theorem as 4270/4303) | matches `correct=3` — flagged `duplicate_flags` id 360, `status='pending'`, 83% similarity to id 4303 (near-identical wording, same answer). Both independently correct; **A** for both, duplicate-content flag disclosed, not a grading defect |
| 4324 | chord=2r·sin(45°)=10√2 | matches `correct=1` |
| 4325 | line meeting circle at 2 points = secant (not chord, which is the segment) | matches `correct=2` |
| 4328 | tangent=√(13²−5²)=12≠10 ⇒ S1 false, S2 (tangent⊥radius) true ⇒ (d) | matches `correct=3` |

**Batch 1 result: examined 25 / ready(A) 25 / defects(B) 0 / ambiguous(C) 0 /
source-defect(D) 0 / visual-needed(E) 0 / other-blocker(F) 0 / promoted 25.**

One non-blocking finding carried forward, not corrected here (out of this
campaign's scope — a content-variety issue, not a correctness defect): ids
4303 and 4318 are near-duplicate questions (pending `duplicate_flags` row
360, 83% similarity), both independently verified correct and both
promoted. Whether the bank should keep, merge, or retire one of the pair is
a separate content-curation decision.

---

## Batch 2 (ids 4329–4355, chapters: Circles tail + Introduction to Trigonometry, n=25)

All independently re-derived algebraically (Pythagorean trig identities,
factor/difference-of-squares manipulation, cyclic-quadrilateral angle
properties for the assertion-reason Circles items).

| id | check | result |
|---|---|---|
| 4329 | tangent⊥radius (T) + equal tangent lengths (T), unrelated facts ⇒ (b) | matches `correct=1` |
| 4331 | AOBP cyclic since ∠OAP+∠OBP=180° (T); S2's supplementary-angle fact is the same cyclic property ⇒ correctly explains ⇒ (a) | matches `correct=0` |
| 4333 | tangents at diameter ends parallel (T, both ⊥ same line) + diameter=longest chord (T, unrelated) ⇒ (b) | matches `correct=1` |
| 4334 | x+y=2sin²θ+2cos²θ+1=3 | matches `correct=0` |
| 4335 | tanα+cotα=2 ⇒ tanα=1 (forced) ⇒ tan²⁰²⁰+cot²⁰²⁰=2 | matches `correct=1` |
| 4336 | √[(1+sinθ)/(1-sinθ)]=(1+sinθ)/cosθ=secθ+tanθ | matches `correct=0` |
| 4337 | √[(1+cosθ)/(1-cosθ)]=(1+cosθ)/sinθ=cosecθ+cotθ | matches `correct=1` |
| 4338 | sinθ/(1+cosθ)=(1-cosθ)/sinθ | matches `correct=2` |
| 4339 | sin²θ/(sinθ-cosθ) − cos²θ/(sinθ-cosθ) = sinθ+cosθ | matches `correct=2` |
| 4340 | 2secθtanθ/tan²θ = 2secθ/tanθ = 2cosecθ | matches `correct=2` |
| 4341 | b²x²+a²y²=a²b²(cos²+sin²)=a²b² | matches `correct=0` |
| 4342 | b²x²-a²y²=a²b²(sec²-tan²)=a²b² | matches `correct=3` |
| 4343 | (secA+tanA)(1-sinA)=(1-sin²A)/cosA=cosA | matches `correct=3` — exact duplicate of 4346, see below |
| 4344 | x²/a²+y²/b²=sec²θ=1+tan²θ=1+z²/c² | matches `correct=3` |
| 4345 | 9(sec²A-tan²A)=9 | matches `correct=1` |
| 4346 | same computation as 4343 | matches `correct=3` — **exact duplicate of 4343** (identical text/options/answer), not caught by the automated `duplicate_flags` detector; disclosed here, both independently correct |
| 4347 | (1+tan²A)/(1+cot²A)=sec²A/cosec²A=tan²A | matches `correct=3` |
| 4348 | 2sin²β-cos²β=2 ⇒ 3sin²β=3 ⇒ β=90° | matches `correct=1` |
| 4349 | right angle at C ⇒ A+B=90° ⇒ cos(90°)=0 | matches `correct=0` |
| 4350 | secθ-tanθ=1/x ⇒ secθ=(x²+1)/2x | matches `correct=1` |
| 4351 | 2tanθ=x-1/x ⇒ tanθ=(x²-1)/2x | matches `correct=3` |
| 4352 | sec⁴A-sec²A=tan⁴A+tan²A — **but options (c) "tan⁴A + tan²A" and (d) "tan²A + tan⁴A" are the same value under commutativity of addition**, only reordered | **C — NOT promoted.** The credited index (2, "tan⁴A + tan²A") is a mathematically valid value, but option (d) is the identical value in different order — a student who picks (d) has the mathematically correct answer yet would be graded wrong. This is a genuine option-set defect (two options share one value), not merely a phrasing quirk; needs a content editor to replace/remove the duplicate-value option before this question can be safely promoted. |
| 4353 | cos⁴A-sin⁴A=(cos²-sin²)(cos²+sin²)=2cos²A-1 | matches `correct=1` |
| 4354 | (1+cotθ-cosecθ)(1+tanθ+secθ)=[(s+c)²-1]/(sc)=2 | matches `correct=1` |
| 4355 | (cosecθ-sinθ)(secθ-cosθ)(tanθ+cotθ)=(c²/s)(s²/c)(1/sc)=1 | matches `correct=1` |

`duplicate_flags` on this chunk: 3 pending rows (362: 4336 vs new item,
0.83 similarity; 363: 4338 vs new item, 0.75; 364: 4350 vs 4351, 1.00) — all
3 checked and are **false positives of the similarity heuristic**: each
pair is a genuinely distinct trigonometric identity (4350 asks for secθ,
4351 for tanθ, from the same setup — related but different questions, not
duplicates). No action needed; consistent with Task 14's earlier finding
that automated flags need individual confirmation, not blind trust either
way.

**Batch 2 result: examined 25 / ready(A) 24 / defects(B) 0 / ambiguous(C) 1
(id 4352) / source-defect(D) 0 / visual-needed(E) 0 / other-blocker(F) 0 /
promoted 24.**

## Reconciliation checkpoint (between Batch 2 and Batch 3)

Per explicit user request, a full CBSE Maths reconciliation was run before
continuing further batches — see
`docs/workstream-6c-cbse-maths-reconciliation-report.md` for the complete
write-up. Summary of what changed as a result: no evidence of an
un-ingested backlog (all 15 textbook chapters have a completed ingestion
batch, every previously-known partial-ingestion gap was closed by a
follow-up batch); one *new*, currently-live duplicate finding in Areas
Related to Circles (id 4442 ~ id 4927, same question transcribed with two
option sets) — user decision: **hold one back** when that chapter is
reached (promote only one of the pair, leave the other at `transcribed`);
a dormant duplicate cluster in Triangles (doc 104 vs doc 156, 10 questions
+ 1 non-question stub) — user decision: **defer cleanup** to a later pass,
since none of doc 104's rows are in the current candidate pool yet
(`answer_status='source_provided'`, one stage earlier than this campaign
touches). User decision: **resume the campaign at Batch 3.**

## Batch 3 (ids 4356-4379, chapter: Introduction to Trigonometry tail, n=24)

All 24 independently re-derived algebraically (Pythagorean/compound-angle
trig identities, sum/difference-of-squares elimination for the
`acosθ+bsinθ=m, asinθ-bcosθ=n ⇒ a²+b²=m²+n²` family, AM-GM for the
`cosec²θ+sin²θ≥2` assertion-reason item, and direct substitution for the
`sinθ+sin²θ=1 ⇒ cos²θ+cos⁴θ=1` family). id 4352 (already classified C in
Batch 2 — two options share the same value under commutativity of
addition) reappeared in this id range but is unchanged and still excluded.

| id | check | result |
|---|---|---|
| 4356 | sin(A-B)=0⇒A=B; cos(A+B)=1/2⇒A+B=60°⇒A=30° | matches `correct=1` |
| 4357 | sinθ=cosθ⇒θ=45°; sin⁴+cos⁴=2·(√2/2)⁴=1/2 | matches `correct=2` |
| 4358 | (acosθ-bsinθ)²+(asinθ+bcosθ)²=a²+b² ⇒ x=±√(a²+b²-c²) | matches `correct=1` |
| 4359 | cos(α+β)=0⇒β=90°-α; sin(α-β)=sin(90°-2β)=cos2β | matches `correct=1` |
| 4360 | ÷cos²α: 2tan²α-3tanα+1=0⇒tanα=1,½⇒cotα=1,2 | matches `correct=2` |
| 4361 | numeric check θ=20°: 1.266+(-0.266)=1 | matches `correct=1` |
| 4362 | 2(1-3s²c²)-3(1-2s²c²)=-1 | matches `correct=2` |
| 4363 | square+add: a²+b²=4²+3²=25 | matches `correct=2` |
| 4364 | p²-q²=(a²-b²)(cot²θ-cosec²θ)=(a²-b²)(-1)=b²-a² | matches `correct=1` |
| 4365 | x²+y²+z²=r²sin²θ+r²cos²θ=r² (spherical coords) | matches `correct=0` |
| 4366 | sinθ=cos²θ; cos²θ+cos⁴θ=sinθ+sin²θ=1 | matches `correct=1` |
| 4367 | square+add: a²+b²=m²+n² | matches `correct=3` |
| 4368 | cosA=sin²A (symmetric to 4366); sin²A+sin⁴A=cosA+cos²A=1 | matches `correct=2` |
| 4369 | (secθ-tanθ)(secθ+tanθ)=1⇒secθ+tanθ=1/m | matches `correct=2` |
| 4370 | α+β=90°⇒(α+β)/2=45°⇒cos45°=1/√2 | matches `correct=0` |
| 4371 | x=6sinA,y=6cosA⇒x²+y²=36 | matches `correct=0` |
| 4372 | sinα=√3/2⇒α=60°⇒tanα=√3; cosβ=√3/2⇒β=30°⇒tanβ=1/√3; product=1 | matches `correct=2` |
| 4373 | A-R: tan1°…tan89°=1 via reciprocal pairs+tan45°=1; S2 explains S1 ⇒ (a) | matches `correct=0` |
| 4374 | A-R: product includes cos90°=0⇒whole product=0; S2 explains ⇒ (a) | matches `correct=0` |
| 4375 | A-R: S1 true (product=cosec²-cot²=1); S2 as printed has sign backwards (false) ⇒ (c) | matches `correct=2` |
| 4376 | A-R: S1 true; S2 (cosec/cot identity) doesn't explain S1 (sec/tan) either way ⇒ (c) | matches `correct=2` |
| 4377 | A-R: b²x²+a²y²=a²b² via cos²+sin²=1; S2 explains ⇒ (a) | matches `correct=0` |
| 4378 | A-R: AM-GM on x=sin²θ>0 gives sin²θ+cosec²θ≥2; S2 explains ⇒ (a) | matches `correct=0` |
| 4379 | A-R: cosA=√(1-1/9)=2√2/3 via sin²+cos²=1; S2 explains ⇒ (a) | matches `correct=0` |

`duplicate_flags` on this chunk: 2 pending rows (365: id 4376 vs existing
4375, 0.94 similarity; 366: id 4378 vs existing 4375, 0.81 similarity) —
both checked and are **false positives**: all assertion-reason items in
this chapter share an identical boilerplate preamble ("Each of the
following contains STATEMENT-1..."), which drives up textual similarity
regardless of the actual mathematical content — 4375, 4376, and 4378 test
three different identities. No duplicate option text found within any of
the 24 questions.

**Batch 3 result: examined 24 / ready(A) 24 / defects(B) 0 / ambiguous(C) 0
/ source-defect(D) 0 / visual-needed(E) 0 / other-blocker(F) 0 /
promoted 24.**

## Batch 4 (ids 4380-4405, chapter: Application of Trigonometry / Heights and Distances, n=26)

All independently re-derived via right-triangle trigonometry (angle of
elevation/depression, tan/sin ratios) or algebraic elimination for the
two-observation-point family. id 4384 carries a pre-existing correction
from an earlier (pre-campaign) workstream: the printed source key said 30°
but was independently recomputed as 60° and flagged `needs_review` for
human confirmation at the time — that confirmation has since happened
(`answer_status` is now `'verified'`). This batch's own from-scratch
recomputation (tanθ=6/(2√3)=√3⇒θ=60°) independently reproduces the same
corrected answer, cross-validating the earlier fix rather than requiring a
new one.

| id | check | result |
|---|---|---|
| 4380 | tanθ=shadow/height ratio inverse=1/√3⇒θ=30° | matches `correct=1` |
| 4381 | tan30°=75/d⇒d=75√3 | matches `correct=2` |
| 4382 | angle WITH WALL=60°⇒height=15cos60°=15/2 | matches `correct=1` |
| 4383 | tan30°=150/d⇒d=150√3 | matches `correct=1` |
| 4384 | tanθ=6/(2√3)=√3⇒θ=60° (independently reproduces the earlier pre-campaign correction) | matches `correct=0` |
| 4385 | height=50·tan45°=50 | matches `correct=0` |
| 4386 | cos60°=2/ladder⇒ladder=4 | matches `correct=3` |
| 4387 | tanθ=√3⇒θ=60° | matches `correct=2` |
| 4388 | height=100·tan60°=100√3 | matches `correct=0` |
| 4389 | height=30·tan60°=30√3 | matches `correct=0` |
| 4390 | h=√(a·tan30°·b·tan60°)=√(ab) | matches `correct=1` |
| 4391 | complementary angles⇒h²=ab⇒h=√(ab) | matches `correct=1` |
| 4392 | d=h/tan30°+h/tan45°=h√3+h=(√3+1)h | matches `correct=0` |
| 4393 | h=d/(cotα−cotβ), standard two-point elevation result | matches `correct=1` |
| 4394 | wire=Δheight/sin30°=6/0.5=12 | matches `correct=1` |
| 4395 | equal elevation/depression angles⇒tower=2×cliff=50 | matches `correct=1` |
| 4396 | h=100/(√3−1)=50(√3+1) | matches `correct=1` |
| 4397 | classic cloud-reflection: 3(H−200)=200+H⇒H=400 | matches `correct=3` |
| 4398 | 100√3−100=100(√3−1) | matches `correct=0` |
| 4399 | complementary angles, height ratio 2:1⇒h=a/(2√2) | matches `correct=2` |
| 4400 | H=h·(1+tanθ)/(1−tanθ)=h·tan(45°+θ) (tangent addition identity) | matches `correct=0` |
| 4401 | d=h/tan60°=h/√3; H=d·tan30°=h/3 | matches `correct=2` |
| 4402 | x=Hc(√3−1/√3)⇒Hc=(√3/2)x | matches `correct=1` |
| 4403 | H(√3−1)=2x⇒H=(√3+1)x | matches `correct=0` |
| 4404 | taller-person companion to 4399: options include both "a/√2" (index 1) and the credited "2 × a/(2√2)" (index 3) — algebraically the same value (2×a/(2√2)=a/√2) | **C — NOT promoted.** Same "duplicate value under different notation" defect as id 4352 (Batch 2): a student computing a/√2 directly and matching it to the option that reads exactly "a/√2" would be marked wrong against the credited, differently-written option. Needs a content editor to simplify/replace the duplicate option. |
| 4405 | Δheight=6m; wire=6/sin30°=12 | matches `correct=2` |

`duplicate_flags` on this chunk: 2 pending rows, both resolved by direct
comparison rather than dismissal — row 367 (id 4399 vs id 4404, 0.95
similarity) and row 368 (id 4394 vs id 4405, 0.87 similarity) are each a
genuine **companion-question pair** (same setup, different specific
numbers or asking for the complementary quantity), not duplicates — but
checking the flagged pair is exactly what surfaced 4404's real defect
above. This is the value of individually confirming flags in both
directions: most (2/2 here on inspection of the *underlying* questions)
are legitimately distinct, but reading them side by side is what caught
4404, a defect the flag itself didn't name.

**Batch 4 result: examined 26 / ready(A) 25 / defects(B) 0 / ambiguous(C) 1
(id 4404) / source-defect(D) 0 / visual-needed(E) 0 / other-blocker(F) 0 /
promoted 25.**

## Cumulative totals (after Batch 4)

| metric | count |
|---|---|
| Pool size at campaign start | 560 |
| Examined so far | 100 |
| A — promoted | 98 |
| B — answer-key defects found | 0 |
| C — ambiguous/needs review | 2 (ids 4352, 4404) |
| D — source defects | 0 |
| E — visual actually required | 0 |
| F — other blocker | 0 |
| Remaining in pool | 462 |

**Checkpoint: 100 CBSE Maths questions now individually re-verified in
this campaign (Batches 1-4).** Measured defect rate so far: 0 answer-key
defects (B), 2 ambiguous option-set defects (C) out of 100 examined — a
2% rate, both of the same "duplicate value under different notation"
class, neither an answer-key error. Per the user's stated plan, this is
the natural point to note the observed rate; continuing through the pool
in the same batches of ~20-25 per the standing instruction.

### Pool-arithmetic reconciliation (requested before Batch 5)

The "Remaining in pool: 462" figure reported above and the "460" the user
expected from 560−100 are **both correct — they answer two different
questions**, reconciled here explicitly per the user's request:

The **held/excluded (C) rows keep `status='transcribed'` on purpose** —
this campaign only ever changes `status` for confirmed A's, never for a C,
so a held row still satisfies the pool's own SQL definition
(`status='transcribed' AND answer_status='verified' AND
diagram_status='not_applicable'`) even though it has already been
individually examined and will not be promoted again without a separate
content fix.

| Quantity | Count | How it's counted |
|---|---|---|
| Starting pool (SQL-defined) | 560 | baseline, campaign start |
| Examined so far (A + C) | 100 | 98 promoted + 2 held |
| — Promoted (A, `status` changed to `verified`) | 98 | leaves the pool query |
| — Held/excluded (C, `status` left as `transcribed`) | 2 (ids 4352, 4404) | **still matches** the pool query |
| Not-yet-examined | 460 | 560 − 100 |
| **Rows still matching the pool's SQL filter right now** | **462** | 460 not-yet-examined + 2 held (verified live: both 4352 and 4404 confirmed still `transcribed`/`verified`/`not_applicable`) |

Arithmetic check: 98 (promoted) + 2 (held) + 460 (not-yet-examined) = 560
✓. Going forward, both figures will be reported at each checkpoint to
avoid this ambiguity: **"not-yet-examined"** (460) is the real remaining
workload, while **"still matches pool filter"** (462) is what a raw SQL
count returns right now and will keep including any future held/excluded
rows until they're separately fixed or formally retired from the pool
definition.

## Batch 5 (ids 4406-4436, chapters: Heights and Distances tail + Trigonometric Ratios + Areas Related to Circles start, n=24)

All independently re-derived: similar-triangles shadow problems, direct
ratio identities (`sinθ=a/b ⇒ tanθ=a/√(b²-a²)`), Pythagorean-triple
shortcuts (`tanA=3/4` ⇒ 3-4-5 triangle), AM-GM/domain reasoning for the
assertion-reason trio, and mensuration formulas (circumference/area
relationships, inradius of an equilateral triangle, arc-length ratios,
inscribed-square-in-circle area) using π=22/7 throughout to match the
source's own convention.

| id | check | result |
|---|---|---|
| 4406 | similar triangles: 1.5/4.5 = H/7.5 ⇒ H=2.5 | matches `correct=2` |
| 4407 | H=10√3·tan60°=10√3·√3=30 (self-consistent with the stem's own "30 m tall") | matches `correct=3` |
| 4411 | sinθ=x,secθ=y⇒cosθ=1/y; tanθ=x/(1/y)=xy | matches `correct=0` |
| 4412 | sinθ=a/b⇒cosθ=√(b²-a²)/b; tanθ=a/√(b²-a²) | matches `correct=3` |
| 4414 | sinθ=cosθ⇒θ=45°; secθ·sinθ=√2·(1/√2)=1 | matches `correct=2` |
| 4415 | sinθ=1⇒θ=90°; ½sin45°=½·(√2/2)=1/(2√2) | matches `correct=0` |
| 4416 | tanθ=12/5⇒3-4-5-style triple(5,12,13)⇒sinθ=12/13 | matches `correct=1` |
| 4417 | tanA=3/4⇒3-4-5 triangle⇒cosA=4/5; (sin²+cos²)/secA=cosA=4/5 | matches `correct=1` |
| 4421 | A-R: tanθ unbounded near 90° (S1 false); S2 (tan=sin/cos) true ⇒ (d) | matches `correct=3` |
| 4422 | A-R: both secθ≥1,cosecθ≥1 true but unrelated ⇒ (b) | matches `correct=1` |
| 4423 | A-R: AM-GM with x=sinθ⇒S1 true, directly from S2 ⇒ (a) | matches `correct=0` |
| 4424 | 2πr=πr²⇒r=2⇒diameter=4 | matches `correct=3` |
| 4425 | r(2π-1)=37⇒r=7 (π=22/7)⇒circumference=44 | matches `correct=1` |
| 4426 | wire=2π(56)=352=square perimeter⇒side=88⇒area=7744 | matches `correct=2` |
| 4427 | side=9⇒wire=36=semicircle perimeter r(π+2)⇒r=7⇒area=77 | matches `correct=2` |
| 4428 | 2π(R-r)=132⇒R-r=21 (π=22/7) | matches `correct=1` |
| 4429 | circumference=11/7 m; revolutions=11000÷(11/7)=7000 | matches `correct=3` |
| 4430 | R/r=23/22, R-r=5⇒r=110⇒diameter=220 | matches `correct=2` |
| 4431 | diameter=100/π=diagonal; side=diagonal/√2=50√2/π | matches `correct=2` |
| 4432 | inradius=42/(2√3)=7√3; area=π(7√3)²=147π=462 | matches `correct=2` |
| 4433 | r²=154/π=49⇒r=7; side=14√3; perimeter=42√3≈72.7 | matches `correct=3` |
| 4434 | 90°/360°=1:4 | matches `correct=0` — **duplicate content, see below** |
| 4435 | r=88/(2π)=14; s=15π; area=r·s=210π=660 | matches `correct=2` |
| 4436 | r²=220/π=70; inscribed square area=2r²=140 | matches `correct=2` |

`duplicate_flags` on this chunk: 3 pending rows. Rows 369 (id 4422 vs
existing 4421) and 370 (id 4423 vs existing 4422) are the same false-
positive pattern as Batch 3 — shared assertion-reason boilerplate
inflating similarity between genuinely distinct identities, both
confirmed independently correct above. **Row 409 is a genuine content
duplicate**: id 4434 ("If an arc of a circle forms 90°... ratio of its
length to circumference") and id 4928 (not yet reached by this campaign;
"If an arc subtends an angle of 90°... ratio of its length to
circumference of the circle") are the same fact reworded, with
differently-ordered options both correctly keyed to "1:4". Consistent with
this campaign's established precedent for ordinary content duplicates
(4303/4318 in Batch 1, 4343/4346 in Batch 2 — promote both, disclose,
treat as a content-curation question rather than a correctness defect,
reserving "hold one back" for the one case the user specifically decided
on, id 4442/4927), id 4434 is promoted here and id 4928 will be promoted
on its own merits when the campaign reaches it later — flagged now so
that re-check isn't a surprise.

No duplicate option text found in any of the 24 questions.

**Batch 5 result: examined 24 / ready(A) 24 / defects(B) 0 / ambiguous(C) 0
/ source-defect(D) 0 / visual-needed(E) 0 / other-blocker(F) 0 /
promoted 24.**

## Cumulative totals (after Batch 5)

| metric | count |
|---|---|
| Pool size at campaign start | 560 |
| Examined so far | 124 |
| A — promoted | 122 |
| B — answer-key defects found | 0 |
| C — ambiguous/needs review | 2 (ids 4352, 4404) |
| D — source defects | 0 |
| E — visual actually required | 0 |
| F — other blocker | 0 |
| Not-yet-examined | 436 (560 − 124) |
| Still matches pool SQL filter (incl. 2 held) | 438 |
| Confirmed content duplicates disclosed (not defects) | 4303/4318, 4343/4346, 4434/4928 (4928 pending its own batch) |
| Live duplicate awaiting the "hold one back" decision | 4442/4927 (Areas Related to Circles, not yet reached) |

## Batch 6 (ids 4437-4467, chapters: Areas Related to Circles tail + Real Numbers start, n=25 examined, 24 promoted, 1 held)

All independently re-derived via mensuration scaling laws (area ∝ radius²
or diameter², percentage-change composition), sector-area/perimeter
formulas, and prime-factorisation rules (HCF/LCM via min/max exponents,
trailing-zero counting).

**id 4442 deliberately excluded — the "hold one back" decision from the
reconciliation checkpoint, now confirmed independently a second way.** The
reconciliation report found id 4442 ~ id 4927 as a live duplicate via
token-overlap similarity; this batch's own `duplicate_flags` check turned
up row 408 flagging id 4442 against id 4927's `question_uid` at
**similarity 1.0 (exact match)** — the bank's own automated detector
agrees. Per the user's decision, id 4442 is held at `transcribed`; id 4927
will be evaluated and promoted on its own merits when the campaign reaches
Areas Related to Circles' second source batch (doc 158, ids ~4917+).

| id | check | result |
|---|---|---|
| 4437 | circumference doubles⇒radius doubles⇒area(∝r²) quadruples | matches `correct=3` |
| 4438 | new area=(0.9)²=0.81⇒19% decrease | matches `correct=1` |
| 4439 | s²=πr²⇒perimeter ratio 4s:2πr=2:√π | matches `correct=1` |
| 4440 | L=r(π/2)=15.7⇒r=10 | matches `correct=1` |
| 4441 | circle area=πa²/4, triangle area=(√3/4)a²⇒ratio π:√3 | matches `correct=1` |
| 4442 | r₁²+r₂²=r² (correct) — **HELD, duplicate of 4927 per decision** | not promoted this batch |
| 4443 | r(π+2)=36⇒r=7⇒diameter=14 | matches `correct=2` |
| 4445 | arc=29-13=16; area=½×6.5×16=52 | matches `correct=1` |
| 4446 | 20π=½r(5π)⇒r=8 | matches `correct=2` |
| 4447 | diameter=10⇒r=5⇒area=25π | matches `correct=3` |
| 4448 | r=7 (as in id4425)⇒area=πr²=154 | matches `correct=0` |
| 4449 | r²=5²+12²=169⇒r=13⇒diameter=26 | matches `correct=1` |
| 4450 | diameter=6⇒r=3⇒area=9π | matches `correct=3` |
| 4451 | r²=8²+6²=100⇒r=10 | matches `correct=0` |
| 4452 | diameter×1.4⇒area×1.96⇒+96% | matches `correct=0` |
| 4457 | identical setup to 4446⇒r=8 — **verbatim duplicate of 4446, see below** | matches `correct=2` |
| 4458 | angle/360=5/18⇒angle=100° | matches `correct=2` |
| 4459 | angle/360=7/20⇒angle=126° | matches `correct=3` |
| 4461 | 3750=2×3×5⁴⇒exponent of 5 is 4 | matches `correct=1` |
| 4462 | HCF must divide LCM(1200); 1200/500=2.4 not integer⇒500 cannot be HCF | matches `correct=1` |
| 4463 | trailing zeros=min(pow2,pow5)=min(3,4)=3 | matches `correct=1` |
| 4464 | 196=2²×7²⇒sum of exponents=4 | matches `correct=2` |
| 4465 | ab/LCM=HCF(x³y²,xy³)=x¹y²=xy² | matches `correct=1` |
| 4466 | LCM(pq²,p³q)=p³q² (max exponents) | matches `correct=2` |
| 4467 | HCF(pq²,p³q)=pq (min exponents) | matches `correct=0` |

`duplicate_flags` on this chunk: 4 pending rows. Row 408 (id 4442 vs id
4927, similarity 1.0) is the confirmed live duplicate discussed above.
**Row 372 (id 4446 vs id 4457, similarity 0.95) is a second confirmed
exact duplicate** — id 4457's own stored `explanation` already
self-discloses "this item is a verbatim repeat of item 23... the ingest
pipeline's per-chapter exact-duplicate check will handle it
automatically," but `source_documents` shows `skipped_exact_duplicates=0`
for this ingestion batch (id 149), meaning that automatic check did not
actually run/catch it as expected. Per this campaign's established
precedent (promote both, disclose — same as 4303/4318, 4343/4346,
4434/4928), both 4446 and 4457 are promoted here; unlike 4442/4927 this
pair is not a "hold back" case since both are independently correct and
neither creates a grading-fairness problem, only a content-variety one.
Rows 371 (4447 vs 4450) and 373 (4458 vs 4459) are false positives —
companion questions with different specific numbers (square side 10 vs 6;
sector fraction 5/18 vs 7/20), already independently confirmed to have
different, correctly-derived answers above. No duplicate option text
found.

**Batch 6 result: examined 25 / ready(A) 24 / defects(B) 0 / ambiguous(C) 0
/ source-defect(D) 0 / visual-needed(E) 0 / other-blocker(F) 0 / held for
duplicate-management 1 (id 4442) / promoted 24.**

## Cumulative totals (after Batch 6)

| metric | count |
|---|---|
| Pool size at campaign start | 560 |
| Examined so far | 149 |
| A — promoted | 146 |
| B — answer-key defects found | 0 |
| C — ambiguous/needs review | 2 (ids 4352, 4404) |
| Held for duplicate-management (not a defect) | 1 (id 4442) |
| D — source defects | 0 |
| E — visual actually required | 0 |
| F — other blocker | 0 |
| Not-yet-examined | 411 (560 − 149) |
| Still matches pool SQL filter (incl. 3 held/excluded) | 414 |
| Confirmed content duplicates disclosed (both promoted, not defects) | 4303/4318, 4343/4346, 4434/4928 (4928 pending), 4446/4457 |
| Live duplicate held per decision | 4442 (id 4927 still pending its own batch) |

## Batch 7 (ids 4468-4498, chapter: Real Numbers, n=25)

All independently re-derived via prime-factorisation and number-theory
first principles: HCF/LCM via min/max exponents, HCF×LCM=product identity,
rational/irrational closure theorems, and a couple of classic olympiad-
style facts (three numbers spaced by 2 always include a multiple of 3;
the least prime factor of a sum of two odd numbers is 2).

| id | check | result |
|---|---|---|
| 4468 | HCF(pq³,p³q²)=p^min(1,3)q^min(3,2)=pq² | matches `correct=1` |
| 4469 | 95=5×19, 152=2³×19⇒HCF=19 | matches `correct=2` |
| 4470 | LCM=(26×169)/13=338 | matches `correct=2` |
| 4471 | π irrational⇒non-terminating non-repeating | matches `correct=1` |
| 4472 | √18=3√2; ×√2=6 (rational) | matches `correct=2` |
| 4473 | irrational+irrational+rational stays irrational | matches `correct=3` |
| 4474 | LCM(2³3²,2²3³)=2³3³ (max exponents) | matches `correct=2` |
| 4477 | prime has exactly 2 factors (1, itself) | matches `correct=2` |
| 4478 | HCF(12,21,15)=3; LCM=2²·3·5·7=420 | matches `correct=2` |
| 4479 | nonzero rational × irrational = always irrational | matches `correct=1` — **duplicate content, see below** |
| 4480 | HCF(x³y²,xy³)=xy² (same math as 4465) | matches `correct=1` |
| 4482 | divides 65 & 117 exactly⇒gcd(65,117)=13 | matches `correct=0` |
| 4484 | 119²-11²=108×130=14040, even⇒composite | matches `correct=1` |
| 4485 | repeating decimal ⇒ rational | matches `correct=1` |
| 4486 | LCM=HCF for two numbers forces them equal | matches `correct=3` |
| 4487 | LCM+HCF=1260, LCM-HCF=900⇒LCM=1080,HCF=180; product=194400 | matches `correct=1` |
| 4488 | LCM(4,2)=4, HCF(4,2)=2⇒ratio 2:1 | matches `correct=1` |
| 4489 | terminating decimal⇒denominator's prime factors ⊆{2,5} | matches `correct=2` |
| 4491 | x×18=36×2=72⇒x=4 | matches `correct=2` — **duplicate content, see below** |
| 4493 | LCM of two primes=product=221=13×17; p>q⇒3p-q=51-13=38 | matches `correct=2` |
| 4494 | 10n+1 for n=1..9: primes among {11,21,...,91} are 11,31,41,61,71 = 5 | matches `correct=0` |
| 4495 | a,a+2,a+4 cover all residues mod 3⇒exactly one divisible by 3 | matches `correct=1` |
| 4496 | a×18=36×2=72⇒a=4 (same computation as 4491) | matches `correct=2` — **duplicate of 4491, see below** |
| 4497 | squares of coprime numbers remain coprime | matches `correct=0` |
| 4498 | least prime factor 3 and 7⇒both odd⇒sum even⇒least prime factor 2 | matches `correct=0` |

Two duplicate-content findings this batch, both disclosed per the
established precedent (promote all, no grading-fairness issue):

- **id 4479 and id 4508** (not yet reached by this campaign): character-
  for-character identical question stem ("The product of a non-zero
  rational number and an irrational number is"), options reordered
  (4479: `["always rational","always irrational",...]` correct=1; 4508:
  `["always irrational","always rational",...]` correct=0 — same credited
  value "always irrational" either way). Flagged by `duplicate_flags` row
  375 at similarity 1.0. id 4479 is promoted now; id 4508 will be
  evaluated on its own merits when the campaign reaches it.
- **id 4491 and id 4496**: same LCM/HCF-product computation
  (`x×18=36×2=72⇒x=4`), different variable name and phrasing, options
  reordered — this pair was **not** caught by the automated
  `duplicate_flags` detector at all (no pending row references either id),
  found only by this batch's own individual verification. Both are in
  this batch and both independently correct; both promoted.

Rows 374 (id 4472 vs id 4499, "√27" instead of "√18") and 376 (id 4472 vs
id 4515, "√20" instead of "√18") are false positives — companion
questions with a different radicand, already independently confirmed with
different, correctly-derived answers (√3 and √5 respectively) when
checked. No duplicate option text found.

**Batch 7 result: examined 25 / ready(A) 25 / defects(B) 0 / ambiguous(C) 0
/ source-defect(D) 0 / visual-needed(E) 0 / other-blocker(F) 0 /
promoted 25.**

## Cumulative totals (after Batch 7)

| metric | count |
|---|---|
| Pool size at campaign start | 560 |
| Examined so far | 174 |
| A — promoted | 171 |
| B — answer-key defects found | 0 |
| C — ambiguous/needs review | 2 (ids 4352, 4404) |
| Held for duplicate-management (not a defect) | 1 (id 4442) |
| D — source defects | 0 |
| E — visual actually required | 0 |
| F — other blocker | 0 |
| Not-yet-examined | 386 (560 − 174) |
| Still matches pool SQL filter (incl. 3 held/excluded) | 389 |
| Confirmed content duplicates disclosed (both promoted or pending) | 4303/4318, 4343/4346, 4434/4928, 4446/4457, 4479/4508, 4491/4496 |
| Live duplicate held per decision | 4442 (id 4927 still pending its own batch) |

## Batch 8 (ids 4499-4526, chapter: Real Numbers, n=26 examined)

23 of 26 candidates independently re-derived and promoted; 3 excluded
(one D, two C). All computations re-derived from prime-factorisation,
HCF/LCM identities, modular-arithmetic (units-digit and divisibility)
arguments, and direct number-theory facts.

| id | check | result |
|---|---|---|
| 4499 | "smallest number to multiply √27 by for a rational product": √27=3√3; ×√3=9 (rational), and √3 < 3√3, 3 — smallest | matches `correct=2` ("√3") |
| 4500 | LCM(4,7,14)=28 min → next together at 6:00+28min | matches `correct=2` ("6:28 AM") |
| 4501 | 9²ⁿ−4²ⁿ=81ⁿ−16ⁿ, divisible by 81−16=65=5×13 → both | matches `correct=2` |
| 4502 | 6ⁿ−5ⁿ: units digit always 6−5=1 (6,36,216… end 6; 5,25,125… end 5) | matches `correct=0` |
| 4503 | prime p>3 is 6k±1 ⇒ p²=36k²±12k+1 ≡1 (mod 6) | matches `correct=0` |
| 4504 | even integers are exactly {2m : m∈ℤ} by definition | matches `correct=2` |
| 4505 | odd integers are exactly {2q+1 : q∈ℤ} by definition | matches `correct=3` |
| 4506 | decimal expansions cover both rational and irrational numbers ⇒ real numbers is the only universal category | matches `correct=2` |
| 4507 | (a×5)ⁿ ends in 0 for every n ⇒ n=1 case (5a) must end in 0 ⇒ a even | matches `correct=1` |
| 4508 | nonzero rational × irrational is always irrational (standard closure theorem) — **duplicate content, see below** | matches `correct=0` |
| 4509 | 25²ⁿ−9²ⁿ=625ⁿ−81ⁿ, divisible by 625−81=544=16×34 → both | matches `correct=2` |
| 4510 | LCM(a,b)=HCF(a,b)×(product of leftover coprime factors) ⇒ HCF is always a factor of LCM | matches `correct=1` |
| 4511 | HCF×LCM=product: 13×40x=65×104=6760 ⇒ x=13 | matches `correct=1` |
| 4512 | LCM(28,44,132): 28=2²·7, 44=2²·11, 132=2²·3·11 ⇒ LCM=2²·3·7·11=924 | matches `correct=3` |
| 4513 | divides (281−5)=276 and (1249−7)=1242 exactly ⇒ HCF(276,1242)=138 | matches `correct=2` |
| 4514 | (√3,√27): √3×√27=√81=9 (rational), both factors irrational; other pairs fail (rational factors or irrational product) | matches `correct=2` |
| 4515 | √20=2√5; smallest irrational multiplier giving a rational product is √5 (2√5×√5=10), smaller than √20 or √2×√20(irrational) | matches `correct=3` |
| 4521 | HCF=25 ∤ 815 (815/25=32.6) ⇒ Statement-1 false; "LCM always divisible by HCF" is a true general theorem ⇒ Statement-2 true | matches `correct=3` ("(d)") |
| 4522 | 47 is prime, 47∤234 ⇒ HCF(234,47)=1, Statement-1 true; Statement-2 ("HCF of coprimes is 1") is true and is exactly why Statement-1 holds | matches `correct=0` ("(a)") |
| 4523 | 11 is prime ⇒ √11 irrational, Statement-1 true; Statement-2 is the general theorem that directly implies it | matches `correct=0` ("(a)") |
| 4525 | n³−n=(n−1)n(n+1), product of 3 consecutive integers, always divisible by 6; Statement-2 is exactly that fact and explains Statement-1 | matches `correct=0` ("(a)") |
| 4526 | HCF×LCM=ab ⇒ LCM=38784/4=9696, Statement-1 true; but Statement-2 states LCM=HCF×ab (wrong formula, would give 155136) ⇒ Statement-2 false | matches `correct=2` ("(c)") |
| 4518 (case, 5 parts) | (i) HCF(60,36)=12 max guests; (ii) 36/12=3 apples/guest; (iii) 60/12=5 bananas/guest; (iv) HCF(60,36,42)=6 max guests with mangoes added; (v) (60+36+42)/6=23 total fruits/guest | all 5 parts match stored `correct` |

Three ids in this range were independently found defective and excluded:

- **id 4516 (D — structural/source defect)**: "LCM of smallest odd prime (3)
  and greatest two-digit number (99)" → LCM(3,99)=99, correctly credited.
  But `options_json` has only **3** entries (`["1","99","300"]`) instead
  of the bank's standard 4 — the answer is still uniquely identifiable,
  but this looks like a dropped 4th distractor during transcription
  rather than a genuine 3-option source question. `content-qa-audit.js`'s
  existing structural checks (array length ≥ 2, index in bounds) do not
  flag this, since 3 options with a valid in-range index passes both.
  Held pending confirmation against the source photograph/PDF.
- **id 4517 (C — case question, two defective sub-parts)**: a 5-part
  "chairs at a banquet" case question. Parts (i), (iv), (v) independently
  verified correct and unambiguous (539 chairs; remainder 1 when 540 is
  divided into 11's; remainder 8 when 539 is divided into 9's). But part
  (ii) asks what groups 536 (=539−3) chairs into, crediting "2's" — 536 =
  2³×67 is divisible by BOTH 2 and 4, so "4's" (also an option) is
  simultaneously true. Part (iii) is worse: it asks what groups 540
  (=539+1) chairs into, crediting "2's" — 540 = 2²×3³×5 is divisible by
  2, 3, AND 4 (three of the four options are simultaneously true
  statements; only "11's" is false). Same defect class as id 4352/4404
  (a value appearing twice under different notation) and id 4517's own
  siblings — here manifesting as multiple simultaneously-correct options
  rather than one value written twice. The whole case question is held
  as a single row since two of its five parts are compromised.
- **id 4519 (C — case question, disclosed incomplete verification)**: a
  5-part "climbing stairs" case question whose own stored `explanation`
  states that parts (ii)-(v) were never independently re-simulated
  step-by-step, and were "kept as printed, disclosed here rather than
  silently presented as independently verified" — despite
  `answer_status='verified'`. This is exactly the risk this campaign
  exists to catch: not a computational error, but an unfinished prior
  verification masquerading as a completed one. Held for a proper
  multi-turn simulation before promotion.

One duplicate-content finding this batch, disclosed per the established
precedent (promote now, evaluate the counterpart on its own merits when
reached — no grading-fairness issue since both credit the same value):

- **id 4508** is a reordered restatement of **id 4479** (already promoted
  in Batch 7): identical stem ("The product of a non-zero rational number
  and an irrational number is"), options reordered so the credited value
  ("always irrational") sits at a different index in each. Already
  disclosed in the Batch 7 write-up; repeated here because id 4508 itself
  is promoted in this batch.

`duplicate_flags` rows checked this batch: 374 and 376 (both already-
known false positives from Batch 7, id 4472 vs different-radicand
companions) reconfirmed; two new rows, 377 and 378, flag ids 4524 and
4528 (both not yet reached by the campaign) against 4522 and 4523
respectively at similarity 0.82/0.84 — both are false positives, sharing
only the identical assertion-reason boilerplate preamble while testing
distinct facts (4524: HCF of consecutive naturals vs 4522: HCF(234,47)
coprimality; 4528: irrationality of √2+√3 vs 4523: irrationality of √11).
No action needed now; both will be verified individually on their own
merits when the campaign reaches them.

**Batch 8 result: examined 26 / ready(A) 23 / defects(B) 0 / ambiguous(C) 2
(ids 4517, 4519) / source-defect(D) 1 (id 4516) / visual-needed(E) 0 /
other-blocker(F) 0 / promoted 23.**

Live grading check (via `scoring.js`): the 23 promoted rows expand to 27
gradable steps (22 MCQ + case id 4518's 5 sub-parts). Submitting each
step's stored `correct` index grades all 27 `correct:true`,
score=27/27=maxScore; submitting a deliberately wrong index on every step
grades all 27 `correct:false`, score=0/27. Full-table diff against the
pre-batch backup confirmed exactly the 23 expected ids changed (`status`
only), with ids 4516/4517/4519 confirmed still `status='transcribed'`
and every other table byte-identical. `content-qa-audit.js` re-run:
unchanged at 124 genuine defects / 0 gradable. `DB_ENGINE=sqlite npm test`
and `DB_ENGINE=postgres npm test`: 71/71 passed on both engines, live DB
confirmed unchanged by the test-guard both times.

## Cumulative totals (after Batch 8)

| metric | count |
|---|---|
| Pool size at campaign start | 560 |
| Examined so far | 200 |
| A — promoted | 194 |
| B — answer-key defects found | 0 |
| C — ambiguous/needs review | 4 (ids 4352, 4404, 4517, 4519) |
| Held for duplicate-management (not a defect) | 1 (id 4442) |
| D — source defects | 1 (id 4516) |
| E — visual actually required | 0 |
| F — other blocker | 0 |
| Not-yet-examined | 360 (560 − 200) |
| Still matches pool SQL filter (incl. 6 held/excluded) | 366 (560 − 194) |
| Confirmed content duplicates disclosed (both promoted or pending) | 4303/4318, 4343/4346, 4434/4928, 4446/4457, 4479/4508, 4491/4496 |
| Live duplicate held per decision | 4442 (id 4927 still pending its own batch) |

**This batch crosses the user's explicitly requested ~200-individually-
verified-question checkpoint** ("I'd let Claude run through roughly 200
individually verified questions before reconsidering the process").
Across the first 200 examined CBSE Maths candidates: 0 pure answer-key
(wrong stored index) defects found; 6 non-promoted rows total — 2
duplicate-value/option-ambiguity defects (4352, 4404), 2 case-question
sub-part ambiguity defects (4517, 4519 — the latter an unfinished-prior-
verification gap, not a computational error), 1 structural options-count
anomaly (4516), and 1 duplicate held per the explicit "hold one back"
decision (4442, not a defect). Defect rate so far: 5/200 = 2.5% (excluding
the deliberate duplicate-hold, which is a policy choice, not a defect).
No chapter has shown a materially different defect rate; defects have
appeared in Circles, Trigonometry, and Real Numbers alike, each roughly
once per 40-50 questions. Per the user's explicit instruction, the
process is not being accelerated — Batch 9 continues at the same 20-25-
question pace with full individual verification.

## Batch 9 (ids 4527-4553, chapters: Real Numbers tail + Polynomials start, n=25)

All 25 candidates independently re-derived and promoted — 0 exclusions
this batch. Real Numbers tail (3 assertion-reason items) verified via the
same rational/irrational closure theorems as prior batches; Polynomials
start (22 items) verified via Vieta's-formula sum/product-of-zeros
identities, substitution, reciprocal-root algebra, and symmetric-function
manipulation.

| id | check | result |
|---|---|---|
| 4527 | 997 prime (no divisor ≤√997≈31.6), 998/999 composite ⇒ largest 3-digit prime; Statement-2 is the trial-division primality test used to confirm it | matches `correct=0` ("(a)") |
| 4528 | 2,3 prime ⇒ Statement-2 (√p+√q irrational for primes p,q) directly gives Statement-1 (√2+√3 irrational) | matches `correct=0` ("(a)") |
| 4530 | 2 nonzero rational, √2 irrational ⇒ Statement-2 (rational+irrational=irrational) directly gives Statement-1 (2+√2 irrational) | matches `correct=0` ("(a)") |
| 4532 | zeros r,−r of x²+ax+b: sum=0=−a⇒a=0 (no linear term); product=−r²≤0 (negative for r≠0) | matches `correct=0` |
| 4533 | x=2 root of x²+3x+k: 4+6+k=0⇒k=−10 | matches `correct=1` |
| 4534 | sum=0, one zero=3⇒other=−3; poly=x²−(sum)x+product=x²−9 | matches `correct=0` |
| 4535 | sum=−5, product=6; poly=x²−(sum)x+product=x²+5x+6 | matches `correct=0` |
| 4536 | product of zeros of x³+4x²+x−6 = −d/a = 6 — **duplicate content, see below** | matches `correct=2` |
| 4537 | reciprocal zeros of (k²+4)x²+13x+4k: product=1⇒4k/(k²+4)=1⇒(k−2)²=0⇒k=2 | matches `correct=0` |
| 4538 | x²+x−1: α+β=−1,αβ=−1; 1/α+1/β=(α+β)/(αβ)=1 | matches `correct=0` |
| 4539 | 5x²+3x−7: α+β=−3/5,αβ=−7/5; 1/α+1/β=3/7 | matches `correct=2` |
| 4540 | 2x³+6x²−4x+9: product of all 3 zeros=−9/2; two multiply to 3⇒third=−3/2 | matches `correct=1` |
| 4541 | 5x²+13x+k, reciprocal roots: product=1⇒k/5=1⇒k=5 | matches `correct=1` |
| 4542 | x³+x²−5x−5: sum of 3 zeros=−1; √5+(−√5)+third=−1⇒third=−1 | matches `correct=1` |
| 4543 | product of zeros of x³+4x²+x−6 = 6 (same cubic as 4536) — **duplicate content, see below** | matches `correct=2` |
| 4544 | x³+x²−9x−9: sum of 3 zeros=−1; 3+(−3)+third=−1⇒third=−1 | matches `correct=0` |
| 4545 | x³+3x²−5x−15: sum of 3 zeros=−3; √5+(−√5)+third=−3⇒third=−3 | matches `correct=1` |
| 4546 | 2x³−3kx²+4x−5: sum of zeros=3k/2=6⇒k=4 | matches `correct=1` |
| 4547 | ax³−6x²+11x−6: product of zeros=6/a=4⇒a=3/2 | matches `correct=0` |
| 4548 | any nonzero scalar multiple of (x+3)(x−5) shares the same zeros ⇒ infinitely many | matches `correct=3` ("more than 3") |
| 4549 | x=−3 root of (k−1)x²+kx+1: 9(k−1)−3k+1=0⇒6k=8⇒k=4/3 | matches `correct=0` |
| 4550 | x²+99x+127: sum=−99 (neg), product=127 (pos) ⇒ same sign and negative ⇒ both negative | matches `correct=1` |
| 4551 | ax²+bx+c: 1/α²+1/β²=((α+β)²−2αβ)/(αβ)²=(b²−2ac)/c² | matches `correct=1` |
| 4552 | x²+px+q, reciprocal-zero poly: new sum=−p/q, new product=1/q ⇒ scale by q ⇒ qx²+px+1 | matches `correct=2` |
| 4553 | f(x)=x²−p(x+1)−c ⇒ α+β=p, αβ=−p−c; (α+1)(β+1)=αβ+(α+β)+1=1−c | matches `correct=1` |

One duplicate-content finding this batch, disclosed per the established
"promote both" precedent (no grading-fairness issue, both credit the same
value):

- **id 4536 and id 4543** are the same cubic (x³+4x²+x−6), same "product
  of the zeros" question (near-identical wording: "of the polynomial
  x³+4x²+x−6" vs "of x³+4x²+x−6"), same options, same credited answer
  ("6"). Flagged by `duplicate_flags` row 379 at similarity 0.89. Both
  independently re-derived and confirmed correct; both promoted.

`duplicate_flags` rows checked this batch: 380 (4551 vs 4538) and 381
(4553 vs 4538) are false positives — different polynomials/exponents
sharing only "zeros of the polynomial ... 1/α(+1/β)" vocabulary. Rows 382
and 384 flag not-yet-reached ids 4567 and 4577 against 4551 and 4539
respectively — both individually checked now and confirmed false
positives (4567 is a general cubic 1/α+1/β+1/γ formula, distinct from
4551's quadratic 1/α²+1/β² formula; 4577 is a different quadratic
(4x²−3x−7) with a different, opposite-sign numeric answer from 4539's).
No action needed now; both will be verified on their own merits when the
campaign reaches them.

**Batch 9 result: examined 25 / ready(A) 25 / defects(B) 0 / ambiguous(C) 0
/ source-defect(D) 0 / visual-needed(E) 0 / other-blocker(F) 0 /
promoted 25.** Defect-taxonomy breakdown: 0 answer-key, 0 MCQ
construction, 0 duplicate-value/notation, 0 source, 0 structural, 0
incomplete-verification, 0 policy hold — the first fully clean batch
since Batch 3.

Live grading check (via `scoring.js`): the 25 promoted rows expand to 25
gradable steps (all MCQ, no case questions this batch). Submitting each
step's stored `correct` index grades all 25 `correct:true`,
score=25/25=maxScore; submitting a deliberately wrong index on every step
grades all 25 `correct:false`, score=0/25. Full-table diff against the
pre-batch backup confirmed exactly the 25 expected ids changed (`status`
only), every other table byte-identical. `content-qa-audit.js` re-run:
unchanged at 124 genuine defects / 0 gradable. PostgreSQL had dropped
again (`pg_isready` → no response) — recovered via
`service postgresql start` before the Postgres regression pass.
`DB_ENGINE=sqlite npm test` and `DB_ENGINE=postgres npm test`: 71/71
passed on both engines, live DB confirmed unchanged by the test-guard
both times.

## Cumulative totals (after Batch 9)

| metric | count |
|---|---|
| Pool size at campaign start | 560 |
| Examined so far | 225 |
| A — promoted | 219 |
| B — answer-key defects found | 0 |
| C — ambiguous/needs review | 4 (ids 4352, 4404, 4517, 4519) |
| Held for duplicate-management (not a defect) | 1 (id 4442) |
| D — source defects | 1 (id 4516) |
| E — visual actually required | 0 |
| F — other blocker | 0 |
| Not-yet-examined | 335 (560 − 225) |
| Still matches pool SQL filter (incl. 6 held/excluded) | 341 (560 − 219) |

**Defect-taxonomy breakdown (cumulative, first 225 examined):**

| bucket | count | ids |
|---|---|---|
| Answer-key defect | 0 | — |
| MCQ construction defect | 1 | 4517 |
| Duplicate-value/notation defect | 2 | 4352, 4404 |
| Source defect | 0 | — |
| Structural/options defect | 1 | 4516 |
| Incomplete-verification defect | 1 | 4519 |
| Policy hold (not a defect) | 1 | 4442 |
| **Total not promoted** | **6** | |

Defect rate (excluding the policy hold): 5/225 = 2.2%. Confirmed content
duplicates disclosed (both promoted or pending): 4303/4318, 4343/4346,
4434/4928, 4446/4457, 4479/4508, 4491/4496, 4536/4543. Live duplicate
held per decision: 4442 (id 4927 still pending its own batch).

## Batch 10 (ids 4554-4587, chapter: Polynomials, n=25)

All 25 candidates independently re-derived and promoted — 0 exclusions
this batch, the second consecutive clean batch. Verified via Vieta's-
formula sum/product-of-zeros identities, the remainder/factor theorem,
discriminant reasoning, and arithmetic-progression-of-zeros constraints
(expressing the AP's middle term as the mean zero and substituting it
back into the polynomial).

| id | check | result |
|---|---|---|
| 4554 | x²−6x+k: α+β=6, 3α+2β=20 ⇒ α=8,β=−2 ⇒ k=αβ=−16 | matches `correct=2` |
| 4555 | p(3)=9−15+4=−2 for x²−5x+4 ⇒ add 2 to zero it out | matches `correct=1` |
| 4556 | p(15)=225−240+30=15 for x²−16x+30 ⇒ subtract 15 to zero it out | matches `correct=2` |
| 4557 | x=−2 root of x²+ax+2b: 4−2a+2b=0⇒b=a−2; with a+b=4 ⇒ a=3,b=1 | matches `correct=1` |
| 4558 | dividend=(−x²+x−1)(x−2)+3 = −x³+3x²−3x+2+3 = −x³+3x²−3x+5 | matches `correct=2` |
| 4559 | zeros 2,−3: sum=−1=−(a+1)⇒a=0; product=−6=b | matches `correct=3` |
| 4560 | cubic with two zeros=0: sum of 3 zeros=−b/a ⇒ third=−b/a | matches `correct=2` |
| 4561 | ax²−5x+c: α+β=5/a=10⇒a=1/2; αβ=c/a=10⇒c=5 | matches `correct=3` |
| 4562 | x³−x²−10x−8: αβ+βγ+γα=c/a=−10; αβγ=−d/a=8; sum=−2 | matches `correct=0` |
| 4563 | x³+7x²−2x−14: sum of 3 zeros=−7; √2−√2+third=−7⇒third=−7 | matches `correct=1` |
| 4564 | zeros in AP ⇒ middle zero=p (since sum=3p); f(p)=−2p³+qp−r=0⇒2p³=pq−r | matches `correct=0` |
| 4565 | x²−(k+6)x+2(2k−1): α+β=k+6, αβ=4k−2; α+β=αβ/2 ⇒ k+6=2k−1⇒k=7 | matches `correct=3` |
| 4566 | x³−12x²+44x+c, zeros in AP ⇒ middle=4 is a root: f(4)=48+c=0⇒c=−48 | matches `correct=3` |
| 4567 | ax³+bx²+cx+d: 1/α+1/β+1/γ=(αβ+βγ+γα)/(αβγ)=(c/a)/(−d/a)=−c/d — **pending duplicate check resolved, see below** | matches `correct=2` |
| 4568 | x³−2x²+qx−r, α+β=0 ⇒ γ=2 (full sum); f(2)=2q−r=0⇒r=2q | matches `correct=1` |
| 4570 | a−b,a,a+b zeros of x³−3x²+x+1: sum=3a=3⇒a=1 (confirmed root); pairwise-product sum=3a²−b²=1⇒b²=2⇒b=±√2 ⇒ a+b=1±√2 | matches `correct=3` |
| 4571 | x²+ax+a: both positive needs −a>0 and a>0 (contradiction) ⇒ cannot both be positive | matches `correct=0` |
| 4572 | ax²+bx+c equal zeros ⇒ b²=4ac≥0 ⇒ ac≥0; c≠0 rules out ac=0 ⇒ a,c same sign | matches `correct=2` |
| 4573 | 2, 1/2 zeros of px²+5x+r: sum=5/2=−5/p⇒p=−2; product=1=r/p⇒r=−2 | matches `correct=1` |
| 4574 | x²−1 (no x term, b=0): sum=−b/a=0 | matches `correct=3` |
| 4576 | zeros ±2/3 ⇒ 45x²−20=5(9x²−4) has roots x²=4/9=(±2/3)²; other options give no real or wrong-magnitude roots | matches `correct=3` |
| 4577 | 4x²−3x−7: α+β=3/4, αβ=−7/4; 1/α+1/β=−3/7 — **pending duplicate check resolved, see below** | matches `correct=3` |
| 4578 | p(1)=1−5+6=2, p(4)=16−20+6=2 ⇒ sum=4 | matches `correct=1` |
| 4586 | x²−2x+2: discriminant=4−8=−4<0 ⇒ NO real zeros ⇒ Statement-1 false; Statement-2 (general cap of 2) is true | matches `correct=3` ("(d)") — **duplicate content, see below** |
| 4587 | zeros 1/2,1/3: sum=5/6,product=1/6 ⇒ 6(x²−5/6x+1/6)=6x²−5x+1, exactly Statement-1's claim; Statement-2 is the general formula that produces it | matches `correct=0` ("(a)") |

Two duplicate-related findings this batch:

- **id 4567 and id 4577**, flagged as pending in the Batch 9 write-up
  (`duplicate_flags` rows 382/384 against 4551/4539), are now resolved as
  confirmed **false positives**: 4567 is a general-cubic 1/α+1/β+1/γ
  formula question distinct from 4551's quadratic 1/α²+1/β² formula, and
  4577 is a different quadratic (4x²−3x−7) with a different, opposite-
  sign numeric answer from 4539's (5x²+3x−7 ⇒ 3/7). Row 383 (4574 vs
  4570) is also a false positive — an unrelated quadratic sum-of-zeros
  question vs a cubic AP-zeros question sharing only "zeroes ... value
  of" vocabulary.
- **id 4586 and id 4591** (4591 not yet reached by the campaign): the
  identical assertion-reason template ("the polynomial ___ has two real
  zeroes" / "a quadratic polynomial can have at most two real zeroes")
  applied to two different specific quadratics, both with negative
  discriminant (4586: x²−2x+2, disc=−4; 4591: x²+3x+3, disc=−3) and both
  crediting the same answer, (d). Flagged by `duplicate_flags` row 385 at
  similarity 0.85. No grading-fairness issue. id 4586 is promoted now;
  id 4591 will be verified and promoted on its own merits when the
  campaign reaches it next batch.

**Batch 10 result: examined 25 / ready(A) 25 / defects(B) 0 / ambiguous(C) 0
/ source-defect(D) 0 / visual-needed(E) 0 / other-blocker(F) 0 /
promoted 25.** Defect-taxonomy breakdown: 0 answer-key, 0 MCQ
construction, 0 duplicate-value/notation, 0 source, 0 structural, 0
incomplete-verification, 0 policy hold — second consecutive fully clean
batch.

Live grading check (via `scoring.js`): the 25 promoted rows expand to 25
gradable steps (all MCQ). Submitting each step's stored `correct` index
grades all 25 `correct:true`, score=25/25=maxScore; submitting a
deliberately wrong index on every step grades all 25 `correct:false`,
score=0/25. Full-table diff against the pre-batch backup confirmed
exactly the 25 expected ids changed (`status` only), every other table
byte-identical. `content-qa-audit.js` re-run: unchanged at 124 genuine
defects / 0 gradable. `DB_ENGINE=sqlite npm test` and
`DB_ENGINE=postgres npm test`: 71/71 passed on both engines (PostgreSQL
was already up from Batch 9's restart, no restart needed this time),
live DB confirmed unchanged by the test-guard both times.

## Cumulative totals (after Batch 10)

| metric | count |
|---|---|
| Pool size at campaign start | 560 |
| Examined so far | 250 |
| A — promoted | 244 |
| B — answer-key defects found | 0 |
| C — ambiguous/needs review | 4 (ids 4352, 4404, 4517, 4519) |
| Held for duplicate-management (not a defect) | 1 (id 4442) |
| D — source defects | 1 (id 4516) |
| E — visual actually required | 0 |
| F — other blocker | 0 |
| Not-yet-examined | 310 (560 − 250) |
| Still matches pool SQL filter (incl. 6 held/excluded) | 316 (560 − 244) |

**Defect-taxonomy breakdown (cumulative, first 250 examined):**

| bucket | count | ids |
|---|---|---|
| Answer-key defect | 0 | — |
| MCQ construction defect | 1 | 4517 |
| Duplicate-value/notation defect | 2 | 4352, 4404 |
| Source defect | 0 | — |
| Structural/options defect | 1 | 4516 |
| Incomplete-verification defect | 1 | 4519 |
| Policy hold (not a defect) | 1 | 4442 |
| **Total not promoted** | **6** | |

Defect rate (excluding the policy hold): 5/250 = 2.0% — trending down
slightly as two consecutive clean 25-question batches (9 and 10) landed
with zero new defects. Confirmed content duplicates disclosed (both
promoted or pending): 4303/4318, 4343/4346, 4434/4928, 4446/4457,
4479/4508, 4491/4496, 4536/4543, 4586/4591 (4591 pending). Live duplicate
held per decision: 4442 (id 4927 still pending its own batch).

## Batch 11 (ids 4588-4614, chapters: Polynomials tail + Pair of Linear Equations in Two Variables start, n=25)

24 of 25 candidates independently re-derived and promoted; 1 excluded
(a likely answer-key defect). Polynomials tail (assertion-reason items)
verified via Vieta's formulas, with the recurring nuance of distinguishing
"both statements true, R explains A" from "both true, R does not explain
A" by checking whether Statement-2's stated formula alone is sufficient
to derive Statement-1, or whether an additional unstated fact is needed.
Pair of Linear Equations start verified via the standard a1/a2, b1/b2,
c1/c2 ratio-consistency conditions for unique/infinite/no-solution cases,
plus direct elimination for the two word problems.

| id | check | result |
|---|---|---|
| 4588 | (k−1)x²−10x+3, reciprocal roots ⇒ product=1: 3/(k−1)=1⇒k=4 (matches Statement-1); but Statement-2 (product=c/a) alone doesn't state the "reciprocal roots multiply to 1" criterion needed to connect it to Statement-1 ⇒ both true, R doesn't explain A | matches `correct=1` ("(b)") |
| 4589 | x²+7x+12, α=−3,β=−4: 12/α+12/β=−7 (matches Vieta's 12(α+β)/(αβ)); 24αβ=288; total=−7−288=**−295**, not the claimed **395** — **defect, see below, excluded** | does NOT match `correct=1` ("(b)") under independent recomputation |
| 4590 | 6x³+3x²−5x+1: α⁻¹+β⁻¹+γ⁻¹=(αβ+βγ+γα)/(αβγ)=(−5/6)/(−1/6)=5 (matches Statement-1); Statement-2 only gives the sum formula (−b/a), a different, unused identity ⇒ true but doesn't explain A | matches `correct=1` ("(b)") |
| 4591 | x²+3x+3: discriminant=9−12=−3<0 ⇒ NO real zeros ⇒ Statement-1 false; Statement-2 (general cap of 2) true | matches `correct=3` ("(d)") — **duplicate of 4586, resolved, see below** |
| 4592 | a quadratic (degree 2) CAN touch the x-axis at exactly one point (repeated root) ⇒ Statement-1 (claims it cannot be quadratic) is false; Statement-2 (max n real zeros) is true | matches `correct=3` ("(d)") |
| 4593 | degree of zero polynomial undefined (true) and degree of nonzero constant is 0 (true), but the two facts are about different objects — R doesn't explain A | matches `correct=1` ("(b)") |
| 4594 | kx−y=2, 6x−2y=3: unique solution ⇒ k/6 ≠ (−1)/(−2) ⇒ k≠3 | matches `correct=1` |
| 4595 | 2x+3y=5, 4x+ky=10: infinite solutions ⇒ 2/4=3/k=5/10 ⇒ k=6 — **duplicate content, see below** | matches `correct=2` |
| 4597 | 3x+5y=0, kx+10y=0 (homogeneous): non-zero solution ⇒ lines coincide ⇒ 3/k=5/10 ⇒ k=6 | matches `correct=2` |
| 4598 | x+2y=5, 3x+ky=−15: no solution ⇒ 1/3=2/k ⇒ k=6; check c-ratio 5/−15=−1/3 ≠ 1/3 ✓ | matches `correct=0` |
| 4599 | consistent ⇒ at least one solution ⇒ intersecting (unique) or coincident (infinite) | matches `correct=3` |
| 4600 | same equations as 4595 (2x+3y=5, 4x+ky=10), same computation ⇒ k=6 — **duplicate content, see below** | matches `correct=3` |
| 4601 | kx−5y=2, 6x+2y=7: no solution ⇒ k/6=−5/2 ⇒ k=−15; c-ratio differs ✓ | matches `correct=3` |
| 4602 | x−y=2, x+y=4: adding ⇒ 2x=6⇒x=3, y=1 | matches `correct=0` |
| 4603 | 3x−y+8=0, 6x−ky+16=0 coincident ⇒ 3/6=−1/−k=8/16 ⇒ k=2 | matches `correct=2` |
| 4604 | y=0, y=−5: parallel distinct horizontal lines ⇒ no solution | matches `correct=3` |
| 4605 | 8c+5t=10500, 5c+3t=6450 ⇒ (×3,×5, subtract) ⇒ c=750; verified t=900 satisfies both equations | matches `correct=0` |
| 4607 | 3x+5y=3, 6x+ky=8: no solution ⇒ 3/6=5/k ⇒ k=10; c-ratio 3/8≠1/2 ✓ | matches `correct=1` |
| 4608 | father+son=65, 2(father−son)=50⇒diff=25; adding sum+diff ⇒ 2×father=90⇒father=45 | matches `correct=1` |
| 4609 | 2x+3y=7, (a+b)x+(2a−b)y=21: infinite ⇒ 2/(a+b)=3/(2a−b)=1/3 ⇒ a+b=6, 2a−b=9 ⇒ a=5,b=1 | matches `correct=1` |
| 4610 | 3x+y=1, (2k−1)x+(k−1)y=2k+1: inconsistent ⇒ 3/(2k−1)=1/(k−1) ⇒ k=2; c-ratio 1/5 ≠ a/b-ratio 1 ✓ | matches `correct=3` |
| 4611 | am≠bl is exactly the nonzero-determinant condition for ax+by=c, lx+my=n ⇒ unique solution | matches `correct=0` |
| 4612 | 2x+3y=7, 2ax+(a+b)y=28: infinite ⇒ 2/(2a)=3/(a+b)=1/4 ⇒ a=4, a+b=12⇒b=8; check b=2a: 8=2×4 ✓ | matches `correct=1` |
| 4613 | 2x−3y=7, (a+b)x−(a+b−3)y=4a+b coincident ⇒ solving the ratio system gives a=−5,b=−1; check a−5b=−5−(−5)=0 ✓ | matches `correct=2` |
| 4614 | x/a+y/b=1: intercepts (a,0),(0,b) ⇒ right-triangle area=(1/2)\|ab\| | matches `correct=2` |

**id 4589 excluded (likely answer-key defect, held for review):** Statement-1
claims "12/α + 12/β − 24αβ = 395" for the zeros of x²+7x+12. Direct
substitution of the actual roots (α=−3, β=−4, from (x+3)(x+4)) gives
12/α+12/β = 12(α+β)/(αβ) = 12(−7)/12 = −7, and 24αβ = 24×12 = 288, so
the expression evaluates to −7−288 = **−295**, not the printed **395**.
Several alternative readings of the expression (24/(αβ) instead of
24×αβ; a sign-flipped constant term in the polynomial) were tried and
none reproduce 395 either. The credited answer, (b) — both statements
true, R not a correct explanation — requires Statement-1 to be true,
which this independent recomputation does not support. Held pending
confirmation against the source photograph/PDF; this may be a printed-
value transcription error rather than a wrong index, but either way it
is not safe to promote as-is.

Two duplicate-related findings this batch:

- **id 4591** (examined here) and **id 4586** (promoted in Batch 10) are
  now confirmed as the disclosed duplicate pair from the Batch 10
  write-up (`duplicate_flags` row 385) — same assertion-reason template,
  different specific quadratic, same credited answer (d). id 4591
  independently verified correct and promoted now.
- **id 4595 and id 4600** are a confirmed content duplicate: identical
  system of equations (2x+3y=5, 4x+ky=10), same "k for infinitely many
  solutions" question reworded, different option ordering, both
  independently confirmed k=6. **Not caught by the automated
  `duplicate_flags` detector at all** — another false negative, in the
  same vein as ids 4491/4496 (Batch 7). No grading-fairness issue; both
  promoted per the standing "promote both, disclose" precedent.

**Batch 11 result: examined 25 / ready(A) 24 / defects(B) 1 (id 4589) /
ambiguous(C) 0 / source-defect(D) 0 / visual-needed(E) 0 /
other-blocker(F) 0 / promoted 24.** Defect-taxonomy breakdown: 1
answer-key defect (4589), 0 MCQ construction, 0 duplicate-value/notation,
0 source, 0 structural, 0 incomplete-verification, 0 policy hold — the
**first answer-key defect found in the entire campaign** (250+ questions
examined before this batch with zero).

Live grading check (via `scoring.js`): the 24 promoted rows expand to 24
gradable steps (all MCQ). Submitting each step's stored `correct` index
grades all 24 `correct:true`, score=24/24=maxScore; submitting a
deliberately wrong index on every step grades all 24 `correct:false`,
score=0/24. Full-table diff against the pre-batch backup confirmed
exactly the 24 expected ids changed (`status` only), with id 4589
confirmed still `status='transcribed'` and every other table byte-
identical. `content-qa-audit.js` re-run: unchanged at 124 genuine
defects / 0 gradable. PostgreSQL had dropped again — recovered via
`service postgresql start` before the Postgres regression pass.
`DB_ENGINE=sqlite npm test` and `DB_ENGINE=postgres npm test`: 71/71
passed on both engines, live DB confirmed unchanged by the test-guard
both times.

## Cumulative totals (after Batch 11)

| metric | count |
|---|---|
| Pool size at campaign start | 560 |
| Examined so far | 275 |
| A — promoted | 268 |
| B — answer-key defects found | 1 (id 4589) |
| C — ambiguous/needs review | 4 (ids 4352, 4404, 4517, 4519) |
| Held for duplicate-management (not a defect) | 1 (id 4442) |
| D — source defects | 1 (id 4516) |
| E — visual actually required | 0 |
| F — other blocker | 0 |
| Not-yet-examined | 285 (560 − 275) |
| Still matches pool SQL filter (incl. 7 held/excluded) | 292 (560 − 268) |

**Defect-taxonomy breakdown (cumulative, first 275 examined):**

| bucket | count | ids |
|---|---|---|
| Answer-key defect | 1 | 4589 |
| MCQ construction defect | 1 | 4517 |
| Duplicate-value/notation defect | 2 | 4352, 4404 |
| Source defect | 0 | — |
| Structural/options defect | 1 | 4516 |
| Incomplete-verification defect | 1 | 4519 |
| Policy hold (not a defect) | 1 | 4442 |
| **Total not promoted** | **7** | |

Defect rate (excluding the policy hold): 6/275 = 2.2% — the first
answer-key defect in the campaign nudges the rate back up slightly after
two clean batches, but the underlying pattern is unchanged: every defect
found so far, including this one, came from a row already carrying
`answer_status='verified'`. Confirmed content duplicates disclosed (both
promoted): 4303/4318, 4343/4346, 4434/4928, 4446/4457, 4479/4508,
4491/4496, 4536/4543, 4586/4591, 4595/4600. Live duplicate held per
decision: 4442 (id 4927 still pending its own batch).

## Batch 12 (ids 4615-4644, chapters: Pair of Linear Equations tail + Quadratic Equations start, n=25)

All 25 of this batch's own candidates independently re-derived and
promoted — 0 exclusions among them. Pair of Linear Equations tail
verified via the standard ratio-consistency conditions, direct
elimination for two word problems, and the recurring (a)-vs-(b)-vs-(c)
distinction for assertion-reason items (whether Statement-2's stated
condition is the one that actually derives Statement-1, or a different/
wrong condition). Quadratic Equations start verified by reducing each
candidate equation to standard form and checking degree, discriminant,
and root substitution directly.

| id | check | result |
|---|---|---|
| 4615 | lines y=x, x=6, y=0 meet at (0,0),(6,0),(6,6): right triangle, area=(1/2)(6)(6)=18 | matches `correct=1` |
| 4616 | lines x=3, y=4, x=y meet at (3,3),(3,4),(4,4): right triangle, legs=1,1, area=1/2 | matches `correct=0` |
| 4617 | digits sum 9, +27 reverses ⇒ a−b=−3 with a+b=9 ⇒ a=3,b=6 ⇒ 36; check 36+27=63=reverse ✓ | matches `correct=3` |
| 4618 | x+y=50, x+2y=75 (₹1,₹2 coins) ⇒ y=25, x=25 | matches `correct=3` |
| 4619 | 37x+43y=123, 43x+37y=117: adding⇒x+y=3; subtracting⇒x−y=−1 ⇒ x=1,y=2 ⇒ a³+b³=1+8=9 | matches `correct=2` |
| 4620 | 5x+7y=3, 15x+21y=k coincide ⇒ 5/15=7/21=3/k ⇒ k=9 | matches `correct=0` |
| 4621 | dependent pair with −5x+7y=2: scale by −2 ⇒ 10x−14y=−4, matches option verbatim; other options fail the proportionality check | matches `correct=3` |
| 4622 | 217x+131y=913, 131x+217y=827: adding ⇒ 348(x+y)=1740 ⇒ x+y=5 | matches `correct=0` |
| 4623 | 3^(x+y)=3^5⇒x+y=5; 243^(x−y)=3^1⇒5(x−y)=1⇒x−y=1/5 ⇒ exactly one (x,y) pair | matches `correct=1` |
| 4627 | 3x+4y=5, 6x+8y=7: a1/a2=b1/b2=1/2 ≠ c1/c2=5/7 ⇒ parallel | matches `correct=0` |
| 4628 | x+2y+5=0, 3x+6y−1=0 (rearranged): a1/a2=b1/b2=1/3 ≠ c1/c2=−5 ⇒ no solution | matches `correct=3` |
| 4629 | 2x−3y=5, 6x+9y=15: a1/a2=1/3 ≠ b1/b2=−1/3 ⇒ unique solution regardless of c; direct solve confirms (2.5, 0) | matches `correct=0` |
| 4632 | 3x+5y−4=0, 15x+25y−25=0: a/b ratio=1/5 ≠ c ratio=4/25=0.16 ⇒ parallel/inconsistent (Statement-1 true); Statement-2 states exactly this parallel-line condition and derives it | matches `correct=0` ("(a)") |
| 4633 | rectangle from x=8,y=6 with axes has area 8×6=**48**, not the claimed 24 ⇒ Statement-1 false; Statement-2 (unique-solution consistency) is true | matches `correct=3` ("(d)") |
| 4634 | coincident lines give infinitely many solutions, NOT a unique one ⇒ Statement-1 (claims unique) is false; Statement-2 (coincident-line definition) is true | matches `correct=3` ("(d)") |
| 4635 | 3x+6y=10, 2x−ky=−5 inconsistent (parallel) at k=−4 (Statement-1 true, independently re-derived); but Statement-2 states the a1/a2=b1/b2=c1/c2 condition, which is the CONDITION FOR COINCIDENT lines, not inconsistent ones ⇒ Statement-2 is false | matches `correct=2` ("(c)") |
| 4636 | of the 4 rewritten equations, only "x³−x²=(x−1)³" reduces to a genuine quadratic (2x²−3x+1=0); the other 3 cancel to linear/degenerate — **side finding re: legacy id 68, see below** | matches `correct=3` |
| 4637 | "(√2x+√3)²+x²=3x²−5x" is the one that cancels to linear (2√6x+5x+3=0); the other 3 remain genuinely quadratic after simplification | matches `correct=2` |
| 4638 | testing x=2 in each: only 2x²−7x+6=0 gives 8−14+6=0 | matches `correct=2` |
| 4639 | sum of roots −b/a for each: only −x²+3x−3=0 gives sum=3 | matches `correct=1` |
| 4640 | 2x²−√5x+1=0: discriminant=5−8=−3<0 ⇒ no real roots | matches `correct=2` |
| 4641 | discriminants: only x²+x−5=0 gives disc=21>0 (others are 0 or negative) | matches `correct=1` |
| 4642 | discriminants: only x²−4x+3√2=0 gives disc=16−12√2≈−0.97<0 | matches `correct=0` |
| 4643 | (x²+1)²−x²=0 expands to x⁴+x²+1=0, always ≥1>0 for real x (also factors into two negative-discriminant quadratics) ⇒ no real roots | matches `correct=2` |
| 4644 | x=0.2 root of x²−0.4k=0: 0.04=0.4k ⇒ k=0.1 | matches `correct=2` |

**Side finding — a defect in a pre-existing legacy row, NOT part of this
campaign's pool (disclosed prominently, no action taken):** while
checking `duplicate_flags` row 386 (id 4636 vs id 68 at similarity 1.0),
id 68 turned out to be one of the 15 legacy pre-provenance rows
(`question_uid=NULL`, `source_document_id=NULL`, ids 60-74) identified in
the CBSE Maths reconciliation report. It is **not** in this campaign's
candidate pool — its `status` is already `'verified'` (already
gradable/live), with `answer_status='source_provided'` and
`diagram_status='needs_visual_review'`, so it never matched the pool
filter and was never going to be examined by this campaign at all.
Because the duplicate-flag hit surfaced it, its own four options were
checked independently: option index 1 ("x³−x²=(x−1)³") reduces to
2x²−3x+1=0 (genuinely quadratic) **and** option index 2 ("2x−x²=x²+5",
the credited answer) reduces to −2x²+2x−5=0 (also genuinely quadratic).
**Two of id 68's four options are both valid quadratic equations, not
just the credited one** — an MCQ construction defect in a row that is
already live and gradable to students today. `content-qa-audit.js`'s own
automated checks do not catch this (its "GENUINE DEFECTS... CURRENTLY
GRADABLE" count stayed at 0 before and after this batch) because the
defect is semantic (multiple valid answers), not structural. id 68 was
NOT modified — it is out of scope for this campaign and any correction
requires its own separate authorization — but this is flagged directly
to the user as a live-content finding.

**Batch 12 result: examined 25 / ready(A) 25 / defects(B) 0 / ambiguous(C) 0
/ source-defect(D) 0 / visual-needed(E) 0 / other-blocker(F) 0 /
promoted 25** (all counts are for this campaign's own pool; the id 68
finding above is separate and not counted in any of these totals).
Defect-taxonomy breakdown (this batch's own pool): 0 answer-key, 0 MCQ
construction, 0 duplicate-value/notation, 0 source, 0 structural, 0
incomplete-verification, 0 policy hold.

Live grading check (via `scoring.js`): the 25 promoted rows expand to 25
gradable steps (all MCQ). Submitting each step's stored `correct` index
grades all 25 `correct:true`, score=25/25=maxScore; submitting a
deliberately wrong index on every step grades all 25 `correct:false`,
score=0/25. Full-table diff against the pre-batch backup confirmed
exactly the 25 expected ids changed (`status` only) — id 68 confirmed
untouched — every other table byte-identical. `content-qa-audit.js`
re-run: unchanged at 124 genuine defects / 0 gradable.
`DB_ENGINE=sqlite npm test` and `DB_ENGINE=postgres npm test`: 71/71
passed on both engines (PostgreSQL already up, no restart needed), live
DB confirmed unchanged by the test-guard both times.

## Cumulative totals (after Batch 12) — 300-QUESTION CHECKPOINT

| metric | count |
|---|---|
| Pool size at campaign start | 560 |
| Examined so far | 300 |
| A — promoted | 293 |
| B — answer-key defects found | 1 (id 4589) |
| C — ambiguous/needs review | 4 (ids 4352, 4404, 4517, 4519) |
| Held for duplicate-management (not a defect) | 1 (id 4442) |
| D — source defects | 1 (id 4516) |
| E — visual actually required | 0 |
| F — other blocker | 0 |
| Not-yet-examined | 260 (560 − 300) |
| Still matches pool SQL filter (incl. 7 held/excluded) | 267 (560 − 293) |

**Defect-taxonomy breakdown (cumulative, first 300 examined):**

| bucket | count | ids |
|---|---|---|
| Answer-key defect | 1 | 4589 |
| MCQ construction defect | 1 | 4517 |
| Duplicate-value/notation defect | 2 | 4352, 4404 |
| Source defect | 0 | — |
| Structural/options defect | 1 | 4516 |
| Incomplete-verification defect | 1 | 4519 |
| Policy hold (not a defect) | 1 | 4442 |
| **Total not promoted** | **7** | |

Defect rate (excluding the policy hold): 6/300 = 2.0%. A full 300-question
checkpoint report (defect rate by chapter, by source document, new
defect classes, remaining pool, whether any previously-promoted question
has been found problematic, and exact pool-arithmetic reconciliation) was
requested by the user and delivered separately.

## Out-of-campaign correction: id 68 retired (resolved before Batch 13)

Per the user's explicit instruction, the id 68 legacy-row finding
(disclosed in the Batch 12 write-up above) was investigated and resolved
**before** resuming the campaign at Batch 13. Full investigation, source
verification, and applied-write results are in
`docs/correction-record-id68-legacy-quadratic-retirement.md`. Summary:
the actual source page (4.12 of `ch3-4.pdf`, the same document behind
already-promoted id 4636) was located and read directly; its real
Question 1 is clean and matches id 4636 exactly, confirming the defect
did not originate in the source. id 68 itself has no
`source_document_id`/`source_page` pointer at all and shares only one of
its four options with the real source question — it is a fabricated/
corrupted composite from the pre-provenance legacy batch, not a
transcription error against a specific page. With no source-backed
replacement option set recoverable, the user chose to retire the row
(`status`: `verified` -> `needs_review`, an existing non-gradable status)
rather than overwrite it (which would have created an exact duplicate of
id 4636) or merely repoint `correct` (which would have left the
underlying two-valid-answers ambiguity live). Guarded write completed
with the full verification cycle: byte-identical backup, full-table diff
(exactly 1 row changed, `status` only), `content-qa-audit.js` unchanged,
71/71 SQLite + PostgreSQL, and a direct query confirming id 68 no longer
appears in any `GRADABLE_STATUSES`-filtered serving path. This
correction is entirely separate from the CBSE Maths candidate pool and
its counts (300 examined / 293 promoted / 7 held) are unaffected by it.

## Batch 13 (Quadratic Equations, ids 4645-4674)

25 candidates individually re-verified from first principles (root
substitution, discriminant conditions, Vieta's-type sum/product
relations, and one nested-radical identity). Additionally, prompted
directly by the id 68 investigation, this batch was cross-checked
against the actual physical scanned source
(`source_library/CBSE/Mathematics/ch3-4.pdf`, pages 4.13-4.14, and the
printed answer key on page 4.16) rather than relying on independent
re-derivation alone — the first time in this campaign the source
photograph itself, not just the DB's transcription, was read as a
routine part of verification for an entire batch.

| id | question (short) | stored correct | independent re-derivation | verdict |
|---|---|---|---|---|
| 4645 | root -1/2 of x²-kx-5/4=0, find k | 2 | k/2-1=0 → k=2 | A |
| 4646 | which is NOT a quadratic (4 options) | (c) | (c) → -4x³-3=0 (cubic); **(d) → (2√6+3)x+3=0 (also non-quadratic)** | **C — MCQ construction defect, source-confirmed** |
| 4647 | which has 3 as a root | (a) | x=3 into (a): 9-12+3=0 ✓; others ≠0 | A |
| 4648 | quadratic can have... | at most two | 0, 1, or 2 real roots possible | A |
| 4649 | discriminant of (x+2)²=0 | 0 | x²+4x+4=0, disc=16-16=0 | A |
| 4650 | 16x²+4kx+9=0 equal roots | 6,-6 | disc=16k²-576=0 → k=±6 | A |
| 4653 | one root of 2x²+kx+4=0 is 2, other root | 1 | product=4/2=2, other=2/2=1 | A |
| 4654 | root 2, sum of roots 0 | x²-4=0 | other root -2, (x-2)(x+2) | A |
| 4656 | sum of roots of x²-x=λ(2x-1) is 0 | -1/2 | 1+2λ=0 | A |
| 4657 | x=1 common root, ab | 6 | a=-3, b=-2, ab=6 | A |
| 4658 | x²+4x+k=0 real distinct roots | k<4 | disc=16-4k>0 | A |
| 4659 | ax²+bx+c=0 equal roots, c | b²/4a | disc=b²-4ac=0 | A |
| 4660 | √(6+√(6+...)) | 3 | x²-x-6=0, positive root 3 | A |
| 4661 | 2 root of x²+bx+12=0, then x²+bx+q=0 equal roots, q | 16 | b=-8, q=b²/4=16 | A |
| 4663 | ax²+2bx+c=0 equal roots, c | b²/a | disc=4b²-4ac=0 | A |
| 4664 | x²+k(4x+k-1)+2=0 equal roots, k | 2/3,-1 | 3k²+k-2=0 → (3k-2)(k+1) | A |
| 4666 | sum=half product, k | 7 | k+6=(4k-2)/2 → k=7 | A |
| 4667 | reciprocal roots of 4x²-2x+(λ-4)=0, λ | 8 | product=1=(λ-4)/4 | A |
| 4668 | x²-ax+1=0 two distinct roots | \|a\|>2 | disc=a²-4>0 | A |
| 4669 | 9x²+6kx+4=0 equal roots, root value | ±2/3 | k=±2, root=-k/3=∓2/3 | A |
| 4670 | ax²+2x+a=0 equal roots | a=±1 | disc=4-4a²=0 | A |
| 4671 | positive k, both quadratics real roots | 16 | k≥16 and k≤16 → k=16 | A |
| 4672 | (a²+b²)x²-2(ac+bd)x+(c²+d²)=0 equal roots | ad=bc | disc=0 → (ad-bc)²=0 | A |
| 4673 | (a²+b²)x²-2b(a+c)x+(b²+c²)=0 equal roots | b²=ac | disc=0 → (ac-b²)²=0 | A |
| 4674 | x²-bx+1=0 no real roots | -2<b<2 | disc=b²-4<0 | A |

**id 4646 excluded (C, MCQ-construction defect, source-confirmed):**
"Which of the following is not a quadratic equation?" (page 4.13, Q11).
Reducing all four options: (a) and (b) are genuinely quadratic; (c)
(the credited "not quadratic" answer) reduces to `-4x³-3=0`, a cubic;
**but (d) reduces to `(2√6+3)x+3=0`, a linear equation** — also not
quadratic. Two of the four options correctly answer "not a quadratic
equation," so a student selecting (d) gives a mathematically valid
answer and would be marked wrong on this credited-(c) question. Verified
directly against the physical scanned source page: the DB's stored
text, options, and the printed answer key all match the scan exactly —
**this is the first defect in the campaign traced all the way into the
printed source itself**, not introduced during transcription or by an
ambiguous OCR read (contrast with id 68, which had no recoverable source
at all, and with id 4589, where the source page itself was not directly
inspected). Held at `status='transcribed'`, not touched by this batch's
promotion script or by any other guarded write.

**Two source-answer-key-is-wrong disclosures (not defects in the DB, no
action needed):** while cross-checking this batch against page 4.13's
printed answer key, two mismatches between the print and independent
computation were found — in both cases the DB's own stored `correct`
value is already right and the *textbook's* printed key is wrong:
- id 4647 (Q12): the print's answer key says "(b)", but substituting
  x=3 shows only option (a), `x²-4x+3=0`, actually has 3 as a root.
  DB's `correct=0` (option a) is independently correct; promotes
  normally.
- id 4648 (Q13): the print's answer key says "(c)" / "exactly two
  roots", but a quadratic can have 0, 1, or 2 real roots, so "at most
  two roots" (option b) is the mathematically correct answer —
  consistent with the source's own stated revision-notes framework
  (page 4.1). DB's `correct=1` (option b) is independently correct;
  promotes normally.

These two disclosures reinforce, rather than undermine, the campaign's
standing "trust neither the print nor the stored value blindly"
methodology: reading the actual source surfaced two of the source's own
answer-key errors, and in both cases the database had already gotten it
right.

**`duplicate_flags` disclosures (both false positives, standard
same-template/different-content pattern, neither affects promotion
scope):**
- Row 388: id 4646 (excluded above on its own merits) vs already-promoted
  id 4637 at similarity 1.0 — both share the recurring stem "Which of
  the following is not a quadratic equation?" but have entirely
  different option sets (id 4637 = page 4.12 Q2, id 4646 = page 4.13
  Q11). Moot for this batch since id 4646 is held regardless.
- Row 389: id 4647 ("has 3 as a root") vs already-promoted id 4638 ("has
  2 as a root") at similarity 0.82 — same archetype, different specific
  root value, different options, different answer index. Confirmed
  false positive; id 4647 promotes normally.

**Batch classification totals:** A 24 / B 0 / C 1 (id 4646,
MCQ-construction, source-confirmed) / duplicate-management-hold 0 /
D 0 / E 0 / F 0 / promoted **24**.
Defect-taxonomy breakdown (this batch's own pool): 0 answer-key, 1 MCQ
construction (source-confirmed), 0 duplicate-value/notation, 0 source,
0 structural, 0 incomplete-verification, 0 policy hold.

Live grading check (via `scoring.js`): the 24 promoted rows expand to 24
gradable steps (all MCQ). Submitting each step's stored `correct` index
grades all 24 `correct:true`, score=24/24=maxScore; submitting a
deliberately wrong index on every step grades all 24 `correct:false`,
score=0/24. Full-table diff against the pre-batch backup confirmed
exactly the 24 expected ids changed (`status` only) — id 4646 confirmed
untouched, id 68 confirmed untouched — every other table byte-identical.
`content-qa-audit.js` re-run: unchanged at 124 genuine defects / 0
gradable. `DB_ENGINE=sqlite npm test` and `DB_ENGINE=postgres npm test`:
71/71 passed on both engines, live DB confirmed unchanged by the
test-guard both times. Pre-write hash
`dec29f93fc4dbe88111adde92b8006a3b81bac193afed0154e75a25a024b52bc` (the
hash left by the id 68 retirement); post-write hash
`94630622baa7c751ccd7c17a50c2221287b584febb520466dcb0acd02a7a6386`.

## Cumulative totals (after Batch 13)

| metric | count |
|---|---|
| Pool size at campaign start | 560 |
| Examined so far | 324 |
| A — promoted | 317 |
| B — answer-key defects found | 1 (id 4589) |
| C — ambiguous/needs review | 5 (ids 4352, 4404, 4517, 4519, 4646) |
| Held for duplicate-management (not a defect) | 1 (id 4442) |
| D — source defects | 1 (id 4516) |
| E — visual actually required | 0 |
| F — other blocker | 0 |
| Not-yet-examined | 236 (560 − 324) |
| Still matches pool SQL filter (incl. 8 held/excluded) | 243 (560 − 317) |

**Defect-taxonomy breakdown (cumulative, first 324 examined):**

| bucket | count | ids |
|---|---|---|
| Answer-key defect | 1 | 4589 |
| MCQ construction defect | 2 | 4517, 4646 |
| Duplicate-value/notation defect | 2 | 4352, 4404 |
| Source defect | 0 | — |
| Structural/options defect | 1 | 4516 |
| Incomplete-verification defect | 1 | 4519 |
| Policy hold (not a defect) | 1 | 4442 |
| **Total not promoted** | **8** | |

Defect rate (excluding the policy hold): 7/324 ≈ 2.2%. This figure
describes only the 324 CBSE Maths candidates individually audited so
far in this campaign's own pool, not the full ~4,946-question bank (see
"Scope of the defect-rate figures in this document" at the top of this
file). id 4646 is the first defect in the campaign confirmed to
originate in the printed source itself rather than in transcription or
an ambiguous digitization — a new sub-class worth tracking separately
if it recurs, though it is filed under the existing "MCQ construction
defect" bucket rather than a new bucket, since the taxonomy classifies
*what* is wrong with the question, not *where* the error was
introduced.
