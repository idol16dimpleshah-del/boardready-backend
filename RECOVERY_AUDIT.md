# Board Ready — Historical Recovery Audit (CBSE Maths/Science/SST)

**Date:** 2026-09-17
**Requested by:** founder, in response to the claim that CBSE Science, CBSE
Social Science, and a much larger CBSE Maths set were uploaded and
processed at some earlier point ("Version 1"), and that a real "mixed SST"
demo test was once taken.

**Scope constraint honored:** this was a **read-only** investigation. No
ingestion, deletion, overwrite, or modification of any kind was performed
against the database or project files during this audit.

**Method, in order (per founder's checklist):** searched for a surviving
"Version 1" session/transcript; inspected `REBUILD_NOTES.md` for its own
contemporaneous historical account; opened the earliest surviving database
backup read-only; queried the live `tests`/`attempts`/`users` tables
exhaustively; searched this session's own raw transcript for the relevant
keywords; read all three Board Ready design artifacts (Revision 3,
Revision 2, "Board Ready 2.0") in full for any real embedded data.

---

## Recovery table

| Material | Evidence found | Original source/file | Approx question count | Data recoverable? | Current DB? |
|---|---|---|---|---|---|
| **CBSE Maths (1000+ claim)** | No evidence of a 1000+-question set at any point. `REBUILD_NOTES.md` states existing CBSE Maths content was "originally authored for this rebuild, not from any textbook" — i.e. it documents its own content as newly written, not recovered from a prior upload. The earliest surviving DB backup (`boardready.db.bak-preopenkind`, 2026-09-16) shows only 3 subjects total (ICSE Maths, CBSE Maths, ICSE Chemistry), 648 questions combined — not 1000+ in CBSE Maths alone. | None found | 0 confirmed beyond what's in the current live DB | **No** — no source file, extracted-question record, or backup shows this ever existed | Current CBSE Maths count is what's in the live DB today (pre-dates this audit; unrelated to Science/SST) |
| **CBSE Science** | No mention anywhere: not in `REBUILD_NOTES.md` (which does discuss what existed pre-reset and post-reset in detail), not in the earliest DB backup's subject list, not in `tests`/`attempts` (all 7 real tests ever recorded reference only ICSE or CBSE Mathematics subject IDs), not in this session's transcript except as a decorative hardcoded percentage number inside the Revision 3 / Revision 2 / "Board Ready 2.0" design mockups — each of which is explicitly labeled `"Design prototype · not wired to the live app"` and declares no runtime data capability. | None found | 0 | **No** | Not present |
| **CBSE Social Science / SST** | Same as CBSE Science: no mention in `REBUILD_NOTES.md`, absent from the earliest DB backup's subject list, absent from every real `tests`/`attempts` row, and the only place "Social Science"/"SST" appears anywhere in recoverable material is as a decorative hardcoded percentage in the three static design mockups (never real fetched data). The "mixed SST demo test" described could not be located as a real `tests` table row — all 7 real test rows reference only Mathematics subjects. | None found | 0 | **No** | Not present |
| **Other CBSE (any additional subject/board material)** | No additional CBSE subjects found anywhere in the backup, live DB, or transcript beyond CBSE Mathematics. | None found | 0 | **No** | Not present |
| **Other ICSE (any additional subject beyond Maths/Chemistry)** | No additional ICSE subjects found. `REBUILD_NOTES.md` separately notes ICSE Maths Chapters 1–6 were "mentioned uploaded earlier" but were **not present** after the infrastructure reset — this is evidence that *something* existed before the reset (a chapter range, not a subject), but no question content, file, or count for it survives anywhere inspected. | Chapters 1–6 of ICSE Maths are referenced by name only in `REBUILD_NOTES.md`, with no accompanying question data | Unknown — no count recorded anywhere | **No question data recoverable; the fact of prior existence for Ch 1–6 specifically is the one exception documented below** | Not present (current ICSE Maths coverage is Chapters 7–24 only) |

---

## The one partial exception, called out separately as requested

`REBUILD_NOTES.md` (written at the time of the actual infrastructure reset,
not written now in hindsight) states that ICSE Mathematics Chapters 1–6
were **"mentioned uploaded earlier"** before the reset that wiped "Version
1." This is evidence that *something* existed — but it is evidence of
existence only, not recoverable content: no question text, file name,
count, or extracted data for those chapters survives in `REBUILD_NOTES.md`,
the earliest DB backup, or anywhere else inspected. This is the only item
in the entire audit with any documented trace of something beyond what's
in the current database. It does not extend to Science, Social Science, or
a large CBSE Maths set — those have zero documented trace, not even an
"existence only" mention.

## Why the search was structured this way (per the founder's instruction not to rely on the uploads folder alone)

- **A prior "Version 1" transcript**, if one survived, would be the
  strongest possible evidence. It does not exist: this session's own raw
  transcript file begins with a `compact_boundary` record — the point
  where an earlier automatic compaction discarded everything before it.
  Nothing before that boundary is recoverable from disk by any means
  available in this environment. This is a hard technical limit, not a
  conclusion drawn from absence of effort.
- **REBUILD_NOTES.md** is the one surviving document written *at the time*
  of the "Version 1" reset, specifically to record what did and didn't
  survive. It is detailed and specific about ICSE Maths Ch 1–6 and about
  CBSE Maths being newly authored — it does not read like a document that
  would have omitted CBSE Science/SST if they had existed at that point.
- **The earliest surviving `.db` backup** (`boardready.db.bak-preopenkind`,
  timestamped 2026-09-16, opened read-only for this audit) is the earliest
  point in this project we can inspect directly. It shows exactly 3
  subjects and 648 questions — well before Chemistry or the Maths Ch 7–24
  expansion, i.e. close to this project's own starting point. No
  Science/SST subject row exists in it.
- **`tests`/`attempts`/`users` tables** were queried in full (all 7 tests,
  all 7 attempts, all 117 user rows). Every test references only an ICSE
  or CBSE Mathematics subject ID. The `users` table is almost entirely
  automated test fixtures from the project's own test suite, plus a small
  number of seed/demo accounts — there is no additional real student
  account that could have taken an undiscovered SST test.
- **The three design-prototype artifacts** (Revision 3, Revision 2, "Board
  Ready 2.0") were read in full, not just their visible screens. All three
  declare themselves explicitly as static mockups not wired to the live
  app, and their Science/Social Science percentages are hardcoded
  decorative numbers with no underlying data array or fetch call — the
  same pattern in all three independently authored mockups.

## Conclusion

After performing the full read-only historical recovery investigation
requested — not inferring from the current uploads folder or the current
database alone — **no evidence was found that CBSE Science, CBSE Social
Science, or a 1000+-question CBSE Maths set were ever uploaded, extracted,
or ingested into Board Ready, at any point recoverable by this
environment.** The one exception is ICSE Maths Chapters 1–6, which
`REBUILD_NOTES.md` documents as having existed before the "Version 1"
reset — existence only, no recoverable content.

This is stated only after completing the investigation, per the founder's
explicit instruction, and it does not contradict the founder's own memory
of the work — it's possible that upload/work happened in a different tool,
session, or account than the one this backend project has any surviving
trace of. If the founder has access to that other session, an export from
it, or the original files themselves (even outside this environment), those
would be the fastest path to real recovery. Short of that, the only way
forward for this content is a fresh upload — which the founder asked to
hold off on until this audit was delivered.

No files were re-uploaded, and no ingestion was triggered, during this
audit.
