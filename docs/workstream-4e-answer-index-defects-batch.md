# Correction Records — 5 Confirmed Answer-Index Defects (Batch 15, Task 5)

**Important finding made before any write, disclosed here rather than
proceeding on the prior batch's wording at face value:** Workstream 3H's
audit report described its cross-check method as "printed key + from-scratch
math/logic" for these CBSE chapters. Re-checking this session:
`source_library/CBSE/Mathematics/ch3-4.pdf` (chapter 153, Quadratic
Equations) was read page-by-page this session (all 14 pages), and **no
printed MCQ answer-key page exists anywhere in that file** — it contains
only the worked "EXAMPLE" solutions (which do carry inline "Ans." lines) and
then the bare MCQ practice items 1–57 with no key at all, inline or
appended. The same is true of the chapter's other practice pages. There is
no separate CBSE Mathematics answer-key file in `source_library` the way
`source_library/ICSE/Mathematics/answer.pdf` exists for ICSE Math. So for
these 5 questions, "source evidence" is **not** a printed key — it is the
question's own self-contained algebraic content, and every one of the 5
corrections below is verified by independent, from-scratch derivation only,
the same evidentiary standard already used and accepted for 4575, 1594, and
1230 (none of which had a printed key either).

**id 4648 (the 6th item from Workstream 3H) is deliberately excluded from
this batch of writes** — see the dedicated section at the end explaining why
it is reclassified from "confirmed" to "ambiguous," per the explicit
instruction to never combine an ambiguous case with confirmed corrections.

All 5 corrections below: `status` and `answer_status` are **not** touched
(both already `transcribed`/`verified` respectively, and remain so — the
defect is in the answer-key index alone, not in whether the question has
been reviewed, so leaving these fields alone is independently justified:
these questions were already correctly marked as reviewed content that
happens to have a wrong stored index, not unreviewed content).

---

## 1. id 4569 — Polynomials, item 39 (ch.151)

**Text:** "If the polynomial f(x) = 2x³ − kx² + 5x + 9 is exactly divisible
by x + 2, then k ="
**Options:** `["17/4","-17/4","-15/4","15/4"]`

**Source evidence (self-contained, re-derived fresh this session):**
divisibility by (x+2) requires f(−2)=0 by the Factor Theorem:
f(−2) = 2(−2)³ − k(−2)² + 5(−2) + 9 = −16 − 4k − 10 + 9 = −17 − 4k = 0
⇒ k = **−17/4**, option index **1**.

**Stored `correct`: 2** (→ "−15/4") — wrong. **Corrected to: 1.**

---

## 2. id 4580, case part (iv) only — Polynomials, item 50 (ch.151)

**Part text:** "(iv) The representation of the Highway Underpass whose one
zero is 6 and the sum of the zeros is 0, is"
**Part options:** `["x² - 6x + 2","x² - 36","x² - 6","x² - 3"]`

**Source evidence:** sum of zeros = 0 and one zero = 6 ⇒ other zero = −6.
Polynomial with zeros 6, −6: x² − (sum)x + (product) = x² − (0)x + (6)(−6) =
**x² − 36**, option index **1**.

**Stored part `correct`: 2** (→ "x² - 6") — wrong. **Corrected to: 1.** This
is a write inside `parts_json` (a JSON array on this row), not a plain
`correct` column — the other 4 parts of this case question are independently
correct and are left untouched (re-verified: (i) 4,-2 for x²−2x−8 — roots
via factoring (x−4)(x+2), correct; (ii) intersects x-axis, correct
definition; (iii) parabola, correct; (v) f(x)=(x−2)²+4 has discriminant
(taking a=1,b=−4,c=8) = 16−32=−16<0, so 0 real zeros, correct).

---

## 3. id 4651 — Quadratic Equations, item 16 (ch.153)

**Text:** "If y = 1 is a common root of the equations ay² + ay + 3 = 0 and
y² + y + b = 0, then ab equals"
**Options:** `["3","-7/2","6","-3"]`

**Source evidence:** substitute y=1 into each equation. First: a+a+3=0 ⇒
2a=−3 ⇒ a=−3/2. Second: 1+1+b=0 ⇒ b=−2. ab = (−3/2)(−2) = **3**, option
index **0**.

**Stored `correct`: 2** (→ "6") — wrong. **Corrected to: 0.**

---

## 4. id 4662 — Quadratic Equations, item 27 (ch.153)

**Text:** "If p and q are the roots of the equation x² + px + q = 0, then"
**Options:** `["p = 1, q = -2","p = 0, q = 1","p = -2, q = 0","p = -2, q = 1"]`

**Source evidence:** sum of roots p+q = −(coefficient of x)/(leading) = −p ⇒
q = −2p. Product of roots pq = q/1 = q ⇒ q(p−1) = 0 ⇒ p=1 (the q=0 branch
gives p=0, which is not among the options, so it is not the intended
branch). With p=1: q = −2(1) = **−2**. So p=1, q=−2 — option index **0**.

**Stored `correct`: 2** (→ "p = -2, q = 0") — wrong. **Corrected to: 0.**

---

## 5. id 4665 — Quadratic Equations, item 30 (ch.153)

**Text:** "If one root of the equation ax² + bx + c = 0 is three times the
other, then b² : ac ="
**Options:** `["3:1","3:16","16:3","16:1"]`

**Source evidence:** roots r and 3r. Sum: 4r = −b/a ⇒ r = −b/(4a). Product:
3r² = c/a ⇒ 3·(b²/16a²) = c/a ⇒ 3b² = 16ac ⇒ **b² : ac = 16 : 3**, option
index **2**.

**Stored `correct`: 3** (→ "16:1") — wrong. **Corrected to: 2.**

---

## Excluded — id 4648, reclassified from "confirmed" to "ambiguous"

**Text:** "A quadratic equation can have" **Options:** `["at least two
roots","at most two roots","exactly two roots","any number of roots"]`
**Stored `correct`: 1** (→ "at most two roots").

Workstream 3H flagged this as a confirmed defect (expected "exactly two
roots", index 2) on curricular-convention grounds, with explicitly lower
confidence than the other 5. Re-examining it now, before writing anything:

There is genuinely no printed answer key available anywhere in
`source_library` for this chapter to settle it (confirmed this session — see
above), so this cannot be checked against the actual source's own intended
answer at all, only against general convention — and general convention
itself is not settled either way. At the CBSE Class-10 level (no complex
numbers introduced), a real quadratic equation can have 2 distinct real
roots, 1 repeated real root, or 0 real roots, depending on the discriminant.
Under a convention that counts a repeated root once, "at most two roots" (the
currently stored answer) is arguably the *more* standard NCERT-style
phrasing, precisely to cover the 0-or-1-or-2-real-roots cases without
invoking complex numbers — which would make the stored value correct, not
defective. Under a convention that always counts a repeated root as two
equal roots (and allows complex roots), "exactly two roots" is defensible
instead. Both conventions appear in different textbooks' phrasing.

This is a genuine content-ambiguity, not a computational error like the
other 5 (which are all pinned down by an unambiguous algebraic result).
**No correction is applied for id 4648 in this task.** It is reclassified as
AMBIGUOUS and left exactly as-is (`correct=1`, `status=transcribed`,
`answer_status=verified`, unchanged), pending either locating an actual
printed key for this specific textbook or a deliberate policy decision on
which convention this content bank should follow consistently.

## Verification plan, run identically per corrected question (5×)

1. Fresh timestamped backup + hash before.
2. A dedicated guarded script per question, verifying the exact expected
   prior value of the relevant field (`correct` or the specific `parts_json`
   sub-part) before writing, writing only that one field, and re-verifying
   every other column (and every other case part, for 4580) byte-identical
   after.
3. Full-table diff against that question's own backup — expect exactly 1
   changed row, exactly 1 changed field.
4. `content-qa-audit.js` re-run.
5. 71/71 SQLite regression.
6. 71/71 PostgreSQL regression.
7. Live grading check via `scoring.js` for the specific corrected step,
   confirming the new stored index now grades as correct and the old
   (wrong) index now grades as incorrect.
8. Live DB hash recorded before/after.

Results for each appended below once complete.

## RESULTS — applied 2026-09-26, all 5 independently

Each correction ran as its own transaction against its own fresh backup, in
this order, with the live hash confirmed to chain correctly from one to the
next (each step's "before" hash matches the previous step's "after" hash):

| # | id | backup timestamp | before hash | after hash | before→after `correct` |
|---|----|--------|-------------|------------|--------------------------|
| 1 | 4569 | `20260926-062936` | `8117661be483e907c77eed29076264b07f23b94ffda1075e7c79681f3b710684` | `b9387063471a07f0043b1a881c17b78fa25bf2e4102efb21616665fdf0573729` | 2 → 1 |
| 2 | 4651 | `20260926-063104` | `b9387063471a07f0043b1a881c17b78fa25bf2e4102efb21616665fdf0573729` | `841e9565e649f064bc48d0808aca095fbbb6afef0349f714b8ab575e54430451` | 2 → 0 |
| 3 | 4662 | `20260926-063128` | `841e9565e649f064bc48d0808aca095fbbb6afef0349f714b8ab575e54430451` | `6994fa6dbaceb0130df8bd72430c116c1771bc5250168fe2ac84d81f8b81559a` | 2 → 0 |
| 4 | 4665 | `20260926-063151` | `6994fa6dbaceb0130df8bd72430c116c1771bc5250168fe2ac84d81f8b81559a` | `e738f63be0bfac50fd499b7f9402e85d4a5fe5211f1e5af29730d37932a39647` | 3 → 2 |
| 5 | 4580 (part iv) | `20260926-063212` | `e738f63be0bfac50fd499b7f9402e85d4a5fe5211f1e5af29730d37932a39647` | `937407302f0f465c631903bfe1a54645ad5233d0f08e4dfd4e44ac099ad690fe` | part[3].correct: 2 → 1 |

For every one of the 5: full-table diff confirmed exactly one changed row
with exactly one changed field (or, for 4580, exactly one changed element
inside `parts_json`, with the other 4 case parts re-verified byte-identical);
`content-qa-audit.js`'s "Anomalous GRADABLE rows with a non-ready
answer_status" stayed at 0 throughout; 71/71 SQLite and 71/71 PostgreSQL
passed after each individual write, with the test-guard confirming the live
DB was unchanged by the test run itself each time; and a direct
`scoring.js` grading check confirmed the new stored index now grades
correct and the old (wrong) index now grades incorrect, for every one of the
5 (including the case-question part, checked via its own step label `d`).

Final live DB hash after all 5: `937407302f0f465c631903bfe1a54645ad5233d0f08e4dfd4e44ac099ad690fe`.

**Task 5: COMPLETED / APPLIED (5 of 6). id 4648 deliberately NOT applied —
reclassified ambiguous, see above.**
