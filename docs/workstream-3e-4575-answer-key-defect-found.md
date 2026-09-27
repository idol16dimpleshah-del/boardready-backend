# Defect Found — Question 4575's `correct` index does not match its own source answer key

**Status: FOUND, NOT YET CORRECTED.** This is a proposed correction record
only, written before any write, in the same style as
`docs/workstream-3a-correction-record-3033-3070.md`. **No live database
write has been made for this.** It surfaced as a side effect of Workstream
3E's geometry work (re-confirming the `correct`-index convention against a
question I already had open context on, before trusting the same convention
for 1594/1230) — not something I was specifically asked to look for, but it
is a real, currently-live defect and is reported immediately rather than
held for later.

**Live database SHA-256 at the time this was found (unchanged by this
discovery — read-only investigation only):**
`e2743e0d92c76ddd40cc9f4e371ccd61de6aab9100379d02b775cff4ae55fe24`

## What's wrong

`questions.id = 4575` (`cbse-mathematics-polynomials-752a6e3e`) has
`answer_status = 'verified'` and `correct = 3`. Under this codebase's
confirmed convention — `correct` is a plain 0-based index into
`options_json`, compared directly against the student's submitted option
index in `scoring.js` (`Number(submitted.optionIndex) === Number(step.correct)`,
no relabeling or shuffling anywhere in the pipeline) — index 3 is the
**4th** option.

`options_json = ["3","1","2","0"]`. Index 3 = `"0"`.

## What the source actually says

- **Question page:** `source_library/CBSE/Mathematics/ch1-2.pdf`, printed
  page 2.22 (PDF page index 10), item **45**:
  > 45. The graph of y = p(x) is given, for a polynomial p(x). The number
  > of zeroes of p(x) from the graph is
  > (a) 3   (b) 1   (c) 2   (d) 0

  Printed option order maps directly onto `options_json`'s stored order:
  index 0 = (a) "3", index 1 = (b) "1", index 2 = (c) "2", index 3 = (d)
  "0" — confirmed by rendering the page directly (not assumed).

- **Answer key page:** same PDF, printed page 2.28 (PDF page index 16), the
  chapter's own "ANSWERS" grid, item 45 row: **"45. (c)"** — rendered and
  read directly from the page image (the raw text layer for this page is
  badly garbled by OCR/scan artifacts and is not reliable on its own; the
  rendered page image is unambiguous).

Option (c) is index 2 (`"2"`), not index 3. **The source's own printed
answer key says the correct option is index 2, not the currently-stored
index 3.**

This is also confirmed independently by the question's own semantics: Fig.
2.19 is the same graph reconstructed for Workstream 3D, which crosses the
x-axis exactly twice — so "the number of zeroes of p(x) from the graph" is
2, i.e. option (c), i.e. index 2. Index 3 (the currently-stored "correct"
answer) is option (d) "0" zeroes, which contradicts the graph the question
itself displays.

## Why this matters right now

This is a live, currently-active grading-correctness defect, not a
theoretical one: with `correct = 3`, a student who correctly identifies 2
zeroes from the graph and selects index 2 (option "2") is marked **wrong**,
and a student who selects index 3 (option "0") is marked **correct** — the
exact inverse of the right outcome, on a question whose `diagram_status` is
now `adapted_verified` and whose visual is live (Workstream 3D).

It also means `answer_status = 'verified'` did not, in this case, guarantee
the stored `correct` index actually matches the source's own answer key —
only that *an* answer was recorded and presumably checked against
something at some point. Workstream 3C's reliance on `answer_status =
'verified'` as the signal that "4575's answer is already ready" was
reasonable given the information available at the time, but this finding
means that signal is not fully trustworthy on its own. I have not gone back
and re-audited other `verified` rows for the same failure mode — that would
be a separate, broader investigation, and is flagged here as a follow-up
worth considering, not undertaken unilaterally.

## What this does NOT affect

- The Workstream 3D **visual** itself (the SVG, its provenance, and the
  live association) remains correct and unaffected: it depicts a curve
  crossing the x-axis twice, which is the actual source figure's content
  and the actual correct semantic answer (2 zeroes). Nothing about the
  visual reconstruction needs to change.
- `diagram_status = 'adapted_verified'` is a statement about the visual
  pipeline, not the answer key, and remains accurate.

## Proposed correction (NOT applied)

| column | current (live) | proposed |
|---|---|---|
| `correct` | `3` | `2` |

Every other column (`options_json`, `text`, `status`, `answer_status`,
`diagram_status`, etc.) would remain byte-identical — this is a one-column,
one-row numeric fix, exactly like the Workstream 3A pattern.

**This has NOT been applied.** Per the standing rule that the live database
is only ever changed via an explicit, individually-approved, fully-verified
write, this is presented for your review and decision, not acted on
unilaterally. If approved, the same guarded-transaction script pattern used
throughout this project (`apply-workstream3a-corrections.js` /
`apply-3070-visual-association.js` / `apply-4575-visual-association.js`)
would be used: guarded by `WHERE id = 4575 AND correct = 3`, checked for
`changes === 1`, full before/after column diff, fresh timestamped backup
first, and a full 71/71 regression re-run afterward.
