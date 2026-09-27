# Correction Record — IDs 3033 and 3070 (Workstream 3A)

**Date:** 2026-09-25
**Authorization:** explicit, per-item approval to apply exactly these two
corrections, per `docs/workstream-3a-live-defect-investigation.md`'s
disposition table. This record is written **before** either row is
modified, so the exact before/after values and their provenance are on the
record independent of the write itself.

**What is not changing:** `id`, `question_uid`, `chapter_id`, `kind`,
`status`, `marks`, `text`, `correct`, `explanation`, `source`,
`source_page`, `source_question_number`, `answer_key_ref`, `question_type`,
`source_section`, `question_format`, `answer_status`, `created_at`,
`source_document_id`, `diagram_status`. Only the `options_json` array's one
mis-transcribed entry changes in each row — the specific index that was
copied from a sibling option instead of the source's own distinct text.
`correct` needs no change in either row: the correct index already matches
the source in both cases (verified in the prior investigation).

---

## ID 3033 — `icse-mathematics-linear-inequation-02454b78`

Source: `source_library/ICSE/Mathematics/ch04-linear-inequation.pdf`, printed
page 4.4 (PDF page index 2), item (20). Rendered and visually verified
directly from the untouched source file (not modified).

Source text (verbatim from the printed page):
> (20) Which of the following is the solution set of x ≤ 3, when the
> replacement set is the set of integers?
> A {0,1,2,3}    B {......, −2,−1,0,1,3}
> C {......, −2,−1,0,1,2,3}    D {....., −2,−1,1,2,3}

| Index | Current DB value | Source value | Action |
|---|---|---|---|
| 0 (A) | `{0,1,2,3}` | `{0,1,2,3}` | unchanged |
| 1 (B) | `{...,-2,-1,0,1,2,3}` | `{......, −2,−1,0,1,3}` (no `2`) | **correct** — currently a mis-copy of index 2's text |
| 2 (C) | `{...,-2,-1,0,1,2,3}` | `{......, −2,−1,0,1,2,3}` | unchanged (this is `correct=2`, already right) |
| 3 (D) | `{...,-2,-1,1,2,3}` | `{....., −2,−1,1,2,3}` (no `0`) | unchanged |

**Replacement text for index 1**, written in this database's own established
transcription style for this question (ellipsis `...` + comma-separated, no
spaces — matching how index 3 is already stored) rather than the source's
literal typesetting (which uses `......`/`.....` with a leading space): 

```
"{...,-2,-1,0,1,3}"
```

This is the source's option B with the `2` correctly omitted, restoring it
as a distinct option from C.

**Before:**
```json
["{0,1,2,3}","{...,-2,-1,0,1,2,3}","{...,-2,-1,0,1,2,3}","{...,-2,-1,1,2,3}"]
```
**After:**
```json
["{0,1,2,3}","{...,-2,-1,0,1,3}","{...,-2,-1,0,1,2,3}","{...,-2,-1,1,2,3}"]
```

---

## ID 3070 — `icse-mathematics-linear-inequation-ace0c077`

Source: `source_library/ICSE/Mathematics/ch04-linear-inequation.pdf`, printed
page 4.8 (PDF page index 6), item (57). Rendered and visually verified
directly from the untouched source file (not modified).

Source text (verbatim from the printed page, including the number line
diagram — dotted markers −4 to 6, hollow circle at −4, filled circle at 5):
> (57) Identify the correct solution set of the following number line
> A {x : x∈Z, −4<x<5}    B {x : x∈Z, −4<x≤5}
> C {x : x∈R, −4≤x≤5}    D {x : x∈R, −4≤x<5}

| Index | Current DB value | Source value | Action |
|---|---|---|---|
| 0 (A) | `{x∈Z, -4<x<5}` | `{x:x∈Z, −4<x<5}` | unchanged |
| 1 (B) | `{x∈Z, -4≤x≤5}`... *(actually stored as* `{x∈Z, -4<x≤5}`*)* | `{x:x∈Z, −4≤x≤5}`... | unchanged (this is `correct=1`, already right — see note below) |
| 2 (C) | `{x∈R, -4≤x≤5}` | `{x:x∈R, −4≤x≤5}` | unchanged |
| 3 (D) | `{x∈R, -4≤x≤5}` | `{x:x∈R, −4≤x<5}` (strictly `<`, not `≤`) | **correct** — currently a mis-copy of index 2's text |

**Replacement text for index 3**, in this database's own established
transcription style for this question (drops the `x:` prefix, keeps the
`{x∈R, ...}` form already used for index 2 — matching, not the source's
literal `{x : x∈R, ...}` spacing):

```
"{x∈R, -4≤x<5}"
```

This is the source's option D with the correct strict inequality at the
upper bound, restoring it as distinct from C.

**Before:**
```json
["{x∈Z, -4<x<5}","{x∈Z, -4<x≤5}","{x∈R, -4≤x≤5}","{x∈R, -4≤x≤5}"]
```
**After:**
```json
["{x∈Z, -4<x<5}","{x∈Z, -4<x≤5}","{x∈R, -4≤x≤5}","{x∈R, -4≤x<5}"]
```

*(Note: index 1's DB value is `{x∈Z, -4<x≤5}`, which matches source option B
exactly — the "unchanged" row for index 1 above simply confirms it already
matches; no correction needed there.)*

---

## Verification plan for the write itself

1. Fresh timestamped backup of `boardready.db` before any write.
2. A single script issues two `UPDATE questions SET options_json = ?
   WHERE id = ? AND options_json = ?` statements — the `WHERE ... AND
   options_json = <expected current value>` guards against writing over a
   row that has changed since this record was written (the statement simply
   would not match/update if so); the script checks `changes === 1` for each
   statement to confirm exactly one row was touched.
3. `correct`, `status`, `answer_status`, and every other column are
   confirmed unchanged, per-row, before and after.
4. Full database SHA-256 recorded before and after (expected to change,
   since this is now an intentional, reviewed, two-row content write — the
   first of this workstream).
5. `scripts/content-qa-audit.js` re-run afterward to confirm both rows drop
   out of the structural-completeness findings and nothing else shifts.
6. Full 71/71 test suite re-run afterward (SQLite and Postgres) to confirm
   no regression.
