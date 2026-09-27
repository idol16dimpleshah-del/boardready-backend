# Correction Record — Publication Promotion for 2061 (Batch 15A, Task 6)

**Important correction to this batch's own working assumption, caught
before writing anything:** the Task 15 queue (`workstream-4p`) listed 2061
as ready for promotion on the strength of Task 7's format fix alone. Task
7's own record (`workstream-4g`) is explicit that it did **not** perform
content verification — it fixed `correct` from `"(a)"` to `0` and
deliberately left `status`/`answer_status` at `transcribed`/
`source_provided` because "this question genuinely has not yet been through
content verification." Promoting `answer_status` to `verified` on the
strength of a format fix alone would repeat exactly the mistake this
session's standing rules exist to prevent (never assume a stored answer is
correct without independently checking it). So before any write, the
content itself is checked here, for the first time.

## The question

`icse-chemistry-electrolysis-c018bc46` (id 2061). "The diagram represents
electrolysis of molten lead bromide. The incorrect statement for the above
electrolysis is:" — stored `correct = 0` → option (a).

## Independent content verification (chemistry, from first principles — not the printed key)

Per the circuit built for this question's visual (Task 11,
`workstream-4l`): electrode **Y** is on the ammeter/`−` branch (cathode),
electrode **X** is on the rheostat/`+` branch (anode). Standard
electrolysis of molten PbBr₂: cations migrate to the cathode and are
reduced; anions migrate to the anode and are oxidized.

- **(a)** "At the oxidising electrode — the electrons enter the electrolyte
  & the process is called oxidation." Oxidation is loss of electrons: at
  the anode (the oxidising electrode), the Br⁻ ion gives an electron *to*
  the electrode, i.e. electrons flow *out of* the electrolyte into the
  external circuit — the opposite direction to what this statement claims.
  **This statement is chemically wrong**, independent of the printed key.
- **(b)** "The ions in solid PbBr₂ are held together by an electrostatic
  force of attraction & hence the crucible is heated from outside,
  resulting in ions of Pb²⁺ & Br¹⁻ being free." Correct: PbBr₂ is an ionic
  solid held by electrostatic (ionic) bonding; melting frees the ions to
  conduct. **True.**
- **(c)** "The electrode reaction at 'Y' is — Pb²⁺ + 2e⁻ → Pb." Y is the
  cathode; Pb²⁺ gaining 2 electrons to deposit as Pb metal is exactly the
  reduction half-reaction at a cathode. **True.**
- **(d)** "At 'X' — bromine ions, give up electrons resulting in formation
  of bromine atoms — which form a covalent bond between atoms, resulting in
  formation of a bromine molecule." X is the anode; Br⁻ losing an electron
  to form Br atoms which then pair via a covalent bond into Br₂ is exactly
  the oxidation half-reaction at an anode. **True.**

Only (a) is false, and it is false for a first-principles chemistry reason
(the electron-flow direction is stated backwards), not merely because the
printed key says so. This independently confirms `correct = 0` on its own
merits, at the same evidentiary standard used elsewhere in this batch for
promotion (e.g. 4575's, 4569's independent re-derivation) — this is new
work, not a restatement of Task 7's format-only fix.

## Write plan

Two separate guarded writes, kept independent per this batch's standing
rule to never combine content/status corrections with visual-association
writes:

1. **This task**: `status`/`answer_status` → `verified`/`verified` only
   (`scripts/apply-2061-promotion.js`), modeled on
   `apply-1594-status-promotion.js`. `diagram_status` stays
   `needs_visual_review` after this write — visual association is Task 7 of
   this batch, applied separately.
2. **Task 7 of this batch** (separate record): associate 2061's
   already-built, browser-QA'd visual (Task 11) live.
