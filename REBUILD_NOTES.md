# Board Ready backend — rebuild + verification report

## Why this exists

The cloud workspace hosting the original backend (the one from the earlier
Readiness Score work) was reclaimed during a long idle period and its
filesystem was wiped — database, seed data, and every source file gone.
Only three files survived, because their exact text was still present in
the conversation transcript: `content-rules.js`, `readiness.js`, and
`readiness-config.js` (plus `test/readiness.test.js`). Everything else in
this backend is a **fresh reconstruction**, written to match the documented
behavior, then independently verified against a real running server — not
a restore of the original bytes. That distinction matters and is called out
inline everywhere it applies.

## What's an exact restore vs. a reconstruction

| File | Status |
|---|---|
| `content-rules.js` | **Exact restore** — full text was in context |
| `readiness.js`, `readiness-config.js` | **Exact restore** — full text was in context |
| `test/readiness.test.js` | **Exact restore** |
| `db.js`, `scoring.js`, `diagnostics.js`, `diagnostics-config.js`, `retest.js`, `retest-config.js`, `practice.js`, `server.js`, `auth.js` | **Reconstructed from scratch**, matching the documented interfaces and behavior, then verified live |

## Step 1 — real end-to-end flow, verified live (not mocked)

Ran against the actual running server on `localhost:4000`, real HTTP calls,
real SQLite data, script is `verify-flow.js` (kept in the repo so it can be
re-run any time — `node server.js` then `node verify-flow.js`):

login (real credential check against a scrypt hash) → real practice-set
generation from actual seeded ICSE Statistics questions → real question
delivery with **no answer key sent to the client** → real submission →
server-recomputed score (7/10 on a deliberately-controlled submission,
matched exactly) → diagnostics summary reflecting real attempt history →
Readiness Score with all 7 components resolved and their real reasons →
a real retest on the same chapter → Readiness moving 61 → 79 as accuracy
and recency genuinely improved → improvement tracking correctly grouping
by (chapter, sub-concept) → a CBSE case-study question correctly expanding
into 3 graded parts (1+1+2 = 4 marks) → final per-subject Readiness
breakdown, high confidence, "Exam Ready."

## Step 2 — edge cases, and what they actually caught

This is the part worth reading closely — verifying against a fresh
implementation is only useful if it's allowed to fail, and it did, twice:

1. **Real bug found and fixed**: `scoring.js`'s grading function spread the
   original step object (which carries `correct` as the numeric
   answer-key index) and then also set a new `correct` key for the
   boolean "was this right" — same key name, silent collision. The
   numeric answer index was getting clobbered by the boolean before it
   ever reached the API response. Fixed by renaming the preserved index to
   `correctIndex`. Caught because the verification script checked the
   *actual* returned index against a known value instead of just checking
   the pass/fail boolean.
2. **Real bug found and fixed**: `GET /api/subjects` required
   authentication, which silently broke both the login screen's
   "show board chips before signing in" case and any unauthenticated
   health check. Made public.
3. Unanswered questions: counted correctly (`answeredCount` reflects only
   real submissions, blanks score as incorrect, never silently skipped).
4. Client-side score manipulation: a submission with forged `correct: true`
   and `score: 999` fields was completely ignored — the server recomputed
   from its own stored answer key regardless.
5. Double-submit: rejected with 409, no re-scoring.
6. CBSE vs ICSE: independent content pools, independent Readiness scoping
   (per-subject Readiness for ICSE correctly excluded the CBSE attempt).
7. Retest / improvement: a genuine decline (70% → 50% → 33%, deliberately
   induced) was correctly classified `declining`; a genuine improvement
   (0% → 100%) was correctly classified `improving`; a flat 100% → 100%
   was correctly `plateaued`, never fabricated.
8. Auth/session gating: no token → 401, garbage token → 401, wrong role
   (teacher hitting a student-only route) → 403.
9. All 12 of the restored automated `readiness.test.js` tests pass
   (`npm test`).

## Known gaps — reconstructed-but-simplified, stated plainly rather than hidden

- **Practice selection is uniform-random**, not misconception-biased or
  difficulty-mixed on purpose. The original design (per the earlier audit)
  deliberately biased toward known misconceptions — that logic wasn't
  recoverable in enough detail to reconstruct faithfully, so it was left
  honestly simple rather than faked.
- **No per-question timing**, only per-attempt (`attempts.time_exceeded_seconds`).
  A finer-grained speed signal isn't derivable from this schema yet.
- **No randomized "variants" of case-study question parts** — a single
  test fragment referenced this from the original, but there wasn't enough
  surviving detail to rebuild it. Each case question has one fixed version
  per part.
- Every numeric threshold in `diagnostics-config.js` and
  `retest-config.js` (evidence tiers, improving/declining deltas) is a
  reasonable, clearly-labeled default — not the original's exact tuned
  values, which weren't recoverable. `readiness-config.js`'s values ARE the
  originals (exact restore).

## Content status — please read this part

You uploaded the ICSE Class 10 Maths MCQ workbook in three batches this
session:
- **Chapters 23 (Statistics) and 24 (Probability)**: transcribed and
  seeded — 24 + 35 = **59 real questions**, cross-checked against the
  workbook's own answer key (`answer.pdf`, pages 25.14–25.15) one by one.
  Marked `status: 'verified'` — see the provenance note at the top of
  `seed.js` for exactly what that judgment call does and doesn't mean (I
  did the cross-check myself; that's not the same bar as an independent
  second reviewer, which is what your own `content-rules.js` convention
  reserves "verified" for).
- **Chapters 7 through 22 (16 files)**: received and safely stored in this
  session, but **not yet transcribed** — that's a much larger job (16
  chapters × up to 20 pages each) than today's engine-verification task
  called for, so I deliberately didn't start it mid-verification. Say the
  word and I'll work through them.
- **Chapters 1–6**: you mentioned uploading these earlier, but they aren't
  present in this session's files — they likely didn't survive the same
  reset that took the backend. You'll need to re-upload them when you're
  ready to include them.
- CBSE Mathematics content (Linear Equations, Quadratic Equations, one
  case-study question) is **originally authored for this rebuild**, not
  from any textbook — real, gradable, but modest in scope, purely so the
  CBSE side of the demo had something genuine to run against.

## Verdict

🟢 **The engine works, and — more usefully — the verification pass proved
it's actually being checked, not rubber-stamped**, by catching two real
bugs before either could reach a live student. Score computation, the
no-client-trust guarantee, diagnostics, retest classification, and the
Readiness composite all hold up under the specific adversarial cases you
asked for.

🟠 Before this goes anywhere near production, three things are worth your
explicit sign-off given they're reconstructions rather than restores:
practice-set selection is currently naive (uniform random, not
misconception-aware), the evidence/delta threshold numbers are reasonable
defaults rather than the original tuned values, and the "verified" status
on the ICSE content reflects a single careful pass, not independent
second-reviewer QA.

None of those three block wiring Revision 3 to real data for a demo — they
matter for a real launch decision, not for seeing whether the pretty UI can
finally show a real number instead of a hardcoded 78.
