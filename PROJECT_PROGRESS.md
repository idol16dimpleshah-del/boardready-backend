# Board Ready — Project Progress

**LAST UPDATED:** 2026-09-17 (session continuation — ICSE History & Civics
completed at 22/22 chapters; a brand-new subject, ICSE Geography, then
started with Chapters 4-7 (chap_4-7.pdf), continued with Chapters 8-9
(chap_8-9.pdf), and continued again with Chapters 10-13 (chap_10-13.pdf) —
Geography now at 10 chapters complete (4-13) and explicitly PAUSED per the
founder's own message "here geography ends for now" (Chapters 1-3, on
Topography, remain deliberately deferred, not yet scheduled). DB now at
4259 questions total.)

This file is the objective checkpoint for this project, per the founder's
standing instruction: a new session (or a new agent resuming after a rate
limit) must read this file AND independently verify it against the live
database before doing anything else — never assume something is done just
because it was discussed or inspected. If this file and the database ever
disagree, the database is ground truth; fix this file to match it.

Standing rule: **never re-ingest a chapter/source already marked COMPLETE
below unless a fresh audit finds a specific, named problem with it.**

## How to verify this file against reality (run before resuming any work)

```
cd /home/claude/backend && npm test   # must show 12/12
node -e "const db=require('./db'); console.log(db.prepare('SELECT COUNT(*) c FROM questions').get().c)"
```

Then re-run the per-chapter query in the Maths/Chemistry sections below if
you need to double check a specific chapter's count, needs_review count, or
duplicate-flag count before trusting this file's numbers.

## PERMANENT SOURCE INVENTORY (added 2026-09-17, per founder's "SOURCE FILES ARE IMMUTABLE PROJECT ASSETS" instruction)

Full detail lives in `SOURCE_LIBRARY.md` (auto-generated from the live DB
by `generate-source-library-md.js` — never hand-edit it, re-run the
generator instead). Summary:

- **All 41 currently-known source files (19 ICSE Maths, 22 ICSE Chemistry)
  are now archived** into this repository at `source_library/ICSE/<Subject>/`,
  each with a SHA-256 hash recorded and verified in the new `source_files`
  table, under a permanent human-readable `stable_id` (e.g.
  `ICSE-CHEM-CH08`) that survives any future rename or DB rebuild.
- New schema (additive, non-destructive, `npm test` 12/12 before and after):
  `source_files` (one row per physical original file — distinct from
  `source_documents`, which is one row per ingestion batch and can share a
  physical file across several batches), `source_document_files` (join
  table linking a batch to the file(s) it came from), and a new
  `questions.source_document_id` column (formal FK, replacing the old
  fragile free-text `questions.source` string as the provenance link).
- **Provenance backfill for existing content:** 2335/2677 questions
  (87.2%) now carry a formal `source_document_id` link, built in two
  passes (`archive-sources.js` then `backfill-provenance-pass2.js`) by
  matching the old free-text `source`/label fields, then narrowing by
  chapter+subject where the first pass was ambiguous.
- **Known provenance gap (disclosed, not hidden):** 342 questions
  (12.8%) — in Pair of Linear Equations, Quadratic Equations, Remainder
  and Factor Theorem, Geometric Progression, Acids/Bases/Salts, and Study
  of Compounds — could not be resolved to a single source_documents row
  because multiple ingestion batches for that exact chapter share
  identical free-text labels (e.g. every "competency.pdf..." batch row is
  labeled the same way, differing only by chapter, and a few chapters have
  more than one same-labeled batch). No content was touched or guessed to
  close this gap; it's recorded here for a future, more careful manual or
  semi-automated pass if exact per-question source-file attribution for
  these 342 becomes necessary.
- **Going forward, this is enforced in code, not just documented:**
  `ingest.js`'s `ingestQuestions()` now throws unless called with
  `meta.sourceFileIds` (an array of already-registered `source_files.id`
  values) or the explicit literal `'none-hand-authored'` for a batch with
  no source PDF (matching REBUILD_NOTES.md's disclosure about the
  original CBSE Maths content). This makes "archive before ingest"
  structurally required, not just a rule someone has to remember.
- **Honest limitation:** the archive above protects against the temporary
  per-session uploads folder disappearing (the concrete risk that
  triggered this instruction). It does NOT yet protect against this whole
  sandbox environment being reclaimed, since the repository still isn't
  pushed to GitHub (see LAUNCH_STATUS.md's GitHub-linking blocker). The
  founder was given a direct copy of the 41 original files via the chat
  session itself, independent of both blockers, specifically to close
  that gap immediately.

## HISTORY & CIVICS — ICSE Class 10 (new subject, 2026-09-17 — STANDING chapter-by-chapter upload)

**Founder's standing instruction (2026-09-17):** "now on till i dont change
it will be icse 10 history chapter wise i will be uploading, make sure you
feed in the system." This means: **every subsequent chap_N.pdf upload from
the founder, without further instruction, should be archived + transcribed
+ verified + ingested following the exact pattern below** — the same
archive-before-ingest / independent-verification / diagramStatus-per-item
discipline used everywhere else in this project, applied to a brand-new
subject (`board: 'ICSE'`, `subjectName: 'History and Civics'`, `class:
'10'` — subjectId 6, auto-created by `ingestQuestions()`, no schema change
needed). This instruction stays in force until the founder says otherwise.

Source book: "ICSE Chapterwise MCQs & Objective Series — History & Civics -
X" — chapter PDFs are cut by page range and each one's last scanned page
typically bleeds into the START of the next chapter (visible as mirrored/
faint text in the background of the final page's scan); that bled-through
content belongs to a FUTURE upload and must NOT be ingested with the
current chapter.

**Verification method for this subject** (different in kind from Maths,
since there's no computable arithmetic to re-derive): every printed answer
is checked against actual Indian Constitution / parliamentary-procedure
facts (not just copied from the book's own "Ans."/"Explanation" — those are
transcribed as supporting text, but the correctness itself is independently
confirmed against real constitutional articles, e.g. Article 54/61/66/85/
123/312 etc.). A printed answer that's still correct gets `answerStatus:
'verified'`; a wording imprecision that doesn't actually change which
option is correct gets disclosed in that item's `explanation` field rather
than silently passed over or used to override the source's chosen answer.

**Status: 22 CHAPTERS COMPLETE — SUBJECT FINISHED per the founder's own
"icse history ends here" message (accompanying the chap_18-22.pdf
upload).** 656 questions total, verified by direct DB query. **Chapter 7
marks the shift from Civics (polity/judiciary, Chapters 1-6) to History
proper (19th/20th-century Indian history, Chapter 7 onward)** — the
verification method shifts accordingly, from constitutional-article
cross-checks to documented-history fact-checking (see below). **Chapter 17
marks a further shift, from India-focused history into World History**
(WWI, the Treaty of Versailles, the League of Nations), continuing through
Chapters 18-22 (dictatorships, WWII, the UN, the Non-Aligned Movement) —
see those chapters' sections below. Per the founder's standing instruction
("now on till i dont change it will be icse 10 history chapter wise i will
be uploading, make sure you feed in the system"), this instruction is now
considered fulfilled for this subject — the founder's own book-content
evidence agrees: the final scanned page of chap_18-22.pdf bleeds through
into a different subject entirely, "Geography," not another History
chapter. No further ICSE History & Civics chapters are expected unless the
founder resumes uploading.

**Chapters 11-13 arrived as a single combined upload** (`chap_11-13.pdf`,
19 pages) — the FIRST upload in this subject where one physical PDF spans
multiple logical textbook chapters. Archived as ONE `source_files` row
(id 112, since archive-before-ingest tracks the physical uploaded file, not
logical chapters), with all three chapters' `ingestQuestions()` calls
referencing that same `sourceFileIds: [112]`. See the Chapter 11-13 section
below for full detail.

**Chapters 14-17 arrived the same way** (`chap_14-17.pdf`, 20 pages,
source_files.id 113) — this time spanning FOUR logical chapters in one
physical file. Same archive-before-ingest pattern, same per-chapter
`ingestQuestions()` calls all referencing `sourceFileIds: [113]`. See the
Chapter 14-17 section below for full detail.

**Chapters 18-22 arrived the same way, and are FINAL** (`chap_18-22.pdf`,
26 pages, source_files.id 114) — spanning FIVE logical chapters in one
physical file, accompanied by the founder's explicit message "icse history
ends here." Same archive-before-ingest pattern, same per-chapter
`ingestQuestions()` calls all referencing `sourceFileIds: [114]`. See the
Chapter 18-22 section below for full detail.

| Ch | Chapter | Source count | DB count | Needs review | Dup flags | Status |
|---|---|---|---|---|---|---|
| 1 | The Union Parliament | 40 | 40 | 0 | 1 (item 3 vs. 36 — book asks "who is ex-officio chairman of Rajya Sabha" twice, genuine source repeat) | COMPLETE |
| 2 | The Executives (President and Vice-President) | 39 | 39 | 0 | 1 (item 16 vs. 27 — both share the generic stem "Which of the following statement(s) is /are correct?", a known short-generic-stem detector blind spot; options/answers differ, not a real duplicate) | COMPLETE |
| 3 | The Prime Minister and The Council of Ministers | 32 | 32 | 0 | 0 | COMPLETE |
| 4 | The Union Judiciary (The Supreme Court) | 36 | 36 | 1 | 1 (item 19 vs. 20 — both share the generic stem "Which of the following is not correct about the writ of X", same known blind spot; different writs (Mandamus/Certiorari), not a real duplicate) | COMPLETE |
| 5 | The State Judiciary (The High Courts) | 37 | 37 | 2 (items 27 & 32 — genuine same-stem/same-options source duplicate with conflicting printed answers, see below) | 2 (item 27 vs. 32 — the disclosed needs_review pair itself, similarity 1.0; item 3 vs. 4 — similarly-worded "who is consulted... appointing the [CJ/judges]..." stems, genuinely different questions) | COMPLETE |
| 6 | The State Judiciary (The Subordinate Courts) | 34 | 34 | 0 | 8 (all benign — repeated generic stems: "advantage of the Lok Adalat" ×4 (items 4-7), "which statement is correct [about Lok Adalat/state judiciary]" ×3 (items 1/3/8), "highest criminal/civil court of the district" phrasing overlap (items 11/21), plus item 21 vs. 30 — a genuine verbatim source repeat, similarity 1.0) | COMPLETE |
| 7 | First War of Independence: 1857 | 28 (numbered 1-27, plus a printed numbering quirk producing two "29"s — see below) | 28 | 0 | 0 | COMPLETE |
| 8 | Rise of Nationalism and Establishment of the Indian National Congress | 31 | 31 | 0 | 0 | COMPLETE |
| 9 | First Phase of the Indian National Movement (1885-1907) | 26 | 26 | 1 (item 5 — printed question stem doesn't match its own explanation, a source typesetting defect; see below) | 0 | COMPLETE |
| 10 | Second Phase of the Indian National Movement (1905-1916) | 33 | 33 | 0 | 1 (items 17 vs. 19 — both share the generic stem "Study the picture... identify the personality," different portraits/answers (Tilak vs. Lajpat Rai), not a real duplicate) | COMPLETE |
| 11 | The Partition of Bengal | 37 | 37 | 0 | 0 | COMPLETE |
| 12 | Formation and Objectives of the Muslim League | 35 | 35 | 1 (item 18 — duplicate printed options, see below) | 0 | COMPLETE |
| 13 | Mahatma Gandhi and Popular National Movement | 36 | 36 | 2 (items 17 & 36 — see below) | 0 | COMPLETE |
| 14 | Events Leading to the Quit India Movement (1935-1943) | 27 | 27 | 2 (items 17 & 26 — see below) | 0 | COMPLETE |
| 15 | Subhash Chandra Bose and the Indian National Army (INA) | 27 | 27 | 0 | 0 | COMPLETE |
| 16 | Towards Partition of India (1944-1947) | 20 | 20 | 0 | 0 | COMPLETE |
| 17 | World War-I and Treaty of Versailles | 27 | 27 | 0 | 0 | COMPLETE |
| 18 | Rise of Dictatorships | 28 | 28 | 0 | 0 | COMPLETE |
| 19 | The Second World War | 26 | 26 | 1 (item 15 — Nazi-propaganda option, see below) | 0 | COMPLETE |
| 20 | The United Nations (Origin and Purpose) | 28 | 28 | 0 | 0 | COMPLETE |
| 21 | The United Nations (Major Agencies and their Functions) | 26 | 26 | 1 (item 4 — see below) | 0 | COMPLETE |
| 22 | The Non-Aligned Movement | 26 | 26 | 1 (item 2 — see below) | 0 | COMPLETE (FINAL — "icse history ends here") |

Disclosed wording caveats (none change the printed/marked answer, all
independently confirmed correct in substance — flagged for transparency,
not treated as errors):
- Ch1 items 12 & 19: max Lok Sabha strength given as 552 (530 elected +
  20 UT + 2 nominated Anglo-Indian). Correct for decades, but the 104th
  Amendment Act (2019, effective Jan 2020) abolished the 2 Anglo-Indian
  seats — current constitutional max is 550. Kept as printed (still likely
  this edition's/syllabus's expected answer) with the amendment noted.
- Ch1 item 24: two of four options are both factually true statements
  about ordinances; the book's chosen answer isn't wrong, just one
  defensible reading among two.
- Ch2 item 22: source states VP removal requires "violation of the
  Constitution or incapacity" — Article 67(b) actually specifies NO
  grounds at all, just a Rajya-Sabha-then-Lok-Sabha resolution. Common
  textbook simplification, not overridden.
- Ch2 item 39: option (a) says VP must be a "natural-born citizen" — India
  has no such category (unlike the US presidency); Article 66 just requires
  "a citizen of India." Doesn't change the correct "(d) all of the above"
  answer since the other two components are accurate.
- Ch3 item 13: "20 Cabinet Ministers" presented as if fixed — it's a
  customary/practical figure, not a constitutional rule (only the total
  Council of Ministers size is capped, at 15% of Lok Sabha strength, per
  the 91st Amendment — see item 27, which correctly states that rule).
- Ch3 item 15: the two "principles" offered for "collective responsibility"
  (ministerial appointment mechanics; tenure at the PM's pleasure) are both
  independently true facts but don't actually define the concept — that's
  correctly defined in item 16 (joint, unanimous Cabinet accountability).
  The source conflates two provisions with a third's definition; disclosed
  since no better option exists among the four offered.
- Ch3 item 19: "Planning Commission" objective reflects the pre-2015
  institutional setup (replaced by NITI Aayog in 2015) — accurate to the
  historical Five-Year-Plan framing this syllabus still teaches.
- Ch4 item 2: source explanation states the Supreme Court "consists of the
  Chief Justice of India and not more than 30 other judges" — a stale
  statutory figure. Current sanctioned strength (Supreme Court (Number of
  Judges) Amendment Act, 2019) is 33 other judges + CJI = 34 total, matching
  item 1's printed answer. The printed answer to item 2 itself (Parliament
  decides the number, per Article 124(1)) is correct and unaffected.
- **Ch4 item 10 — genuine needs_review, not just a wording caveat:** the
  printed key marks (a) "change the decision" as the sole correct answer for
  what the Supreme Court can do in its appellate jurisdiction, but the
  source's own printed explanation for the same item states the Court "can
  change the decision OR reduce the sentence passed by the lower courts" —
  describing both actions, which would make (c) "both (a) and (b)" the
  internally consistent answer. Transcribed with the printed key's answer
  (a) unchanged, per this project's policy of never silently overriding a
  marked answer; `answerStatus: 'needs_review'`, discrepancy fully disclosed
  in the item's own explanation field. Analogous in kind to Maths Ch6 item
  26's shifted-key discrepancy.
- Ch4 item 30: "Judicial Review... falls under [this] jurisdiction" is
  framed narrowly as reviewing "laws passed by Union Legislature." Judicial
  Review's full constitutional scope also covers State legislation and
  executive/administrative action, not only Union laws — the item states one
  true instance of the power, not its complete scope; doesn't change the
  correct answer (Judicial Review).
- Ch5 item 5's explanation (and item 30's) list "distinguished jurist" as
  one qualifying route to a High Court judgeship. Article 217(2) does not
  actually include this route for High Court judges — it is exclusively a
  Supreme Court criterion (Article 124(3)(c)). Doesn't change either item's
  correct answer (neither depended on that route being valid).
- Ch5 item 19: "principal civil court of original jurisdiction in a state"
  is answered as the High Court. Under the Code of Civil Procedure that
  exact phrase is a term of art for the District Court, though some High
  Courts (Bombay, Calcutta, Madras, Delhi) do exercise ordinary original
  civil jurisdiction — a looser use of the term, not a change to the answer.
- **Ch5 item 21 — genuine needs_review:** printed answer is "The Parliament"
  for who can increase/decrease the number of High Court judges. That is
  the rule for the Supreme Court (Article 124(1)); for High Courts, Article
  216 gives this power to the President, consistent with this same
  chapter's item 1 (number of HC judges "is not fixed," determined case by
  case). Printed answer kept unchanged and disclosed.
- **Ch5 items 27 & 32 — genuine needs_review, a real source duplicate with
  conflicting answers:** both items print the identical stem "When a case
  comes from a Subordinate Court, the High Court deals with it under
  ___" with identical options, but item 27's key marks (a) Revisory
  Jurisdiction while item 32's key marks (d) Appellate Jurisdiction. Both
  transcribed with their own printed answers, cross-referencing each other,
  neither silently resolved. (Technical note: item 32 had to be encoded as
  a single-part `kind: 'case'` item rather than a plain `mcq`, because this
  project's exact-duplicate detector fingerprints plain mcq items on
  stem+options only — not the correct index — so a second plain-mcq item
  with item 27's identical stem/options would have been silently skipped as
  an exact duplicate, losing the very discrepancy being disclosed. This is
  a real, narrow gap in `ingest.js`'s `exactFingerprint()` for the plain-mcq
  branch, worth a future look, but was not touched here since it's shared
  logic used across the whole 3,400+ question bank — a single item's `case`
  encoding as a workaround was the minimal, source-faithful fix.)

- Ch6 item 13: printed answer says a District Judge exercises
  administrative powers "as a District Collector." Under the current
  constitutional framework (Article 50 DPSP; post-1973 CrPC separation of
  judiciary and executive), the District Judge (judicial, Article 233) and
  the District Collector/District Magistrate (executive/IAS) are distinct
  offices not combined in one person today — this reads as a colonial-era/
  historical note rather than current practice. Kept as printed since no
  other option is more defensible; disclosed as a caveat, not needs_review
  (no internal source contradiction, just a dated framing).
- Ch6 item 15's explanation carries the source's own illustrative pecuniary
  limits for Small Cause Courts (₹1,000 in Delhi, ₹10,000 in Mumbai) —
  these are State-High-Court-set limits that are periodically revised, not
  independently re-verified as current here since they don't affect the
  item's own answer (District/Additional District Judges can hear cases of
  "any value," which is the graded point).

**First diagram encountered in this subject:** Ch6 item 28 uses a small
line illustration (two pairs of stick figures shaking hands) to visually
cue "spirit of compromise" as a Lok Adalat advantage. Marked
`diagramStatus: 'source_diagram_preserved'` with a visual link to the
source page (source_files.id 107) — the first `not_applicable` exception
across all six History & Civics chapters, all of whose other items are
plain-text MCQs/data tables with no diagrams.

### Chapter 7: First War of Independence: 1857 (first History-proper chapter)

**Verification method for History-proper chapters** (distinct from the
Civics chapters' constitutional-article cross-checks): every printed
answer is checked against documented history of the 1857 revolt's causes
and course — Subsidiary Alliance, Doctrine of Lapse, the General Service
Enlistment Act 1856, the Enfield-rifle cartridge controversy, and the key
figures/dates involved. The two chronological-ordering items (16, 17) were
independently re-verified against each event's actual historical date
(not just trusted from the printed key) — both matched the printed answer.

Disclosed items (neither changes a printed answer):
- **Source numbering quirk:** the book's own question numbering skips "28"
  entirely and prints "29" twice, for two unrelated questions (one on the
  General Service Enlistment Act, one on the revolt's first martyr). Both
  transcribed with `sourceQuestionNumber: '29'` exactly as printed, rather
  than silently renumbered — flagged in each item's `answerKeyRef`.
- Item 17's option (a), "IV, II, I, II", repeats "II" twice as printed —
  almost certainly a printing typo for "IV, II, I, III" — noted in the
  explanation; doesn't affect the correct answer, which is option (c).

**First genuine photographic/portrait image in this subject:** item 19
("study the picture and identify the personality") requires the image
itself to answer — marked `diagramStatus: 'source_diagram_preserved'`
with a visual link to the source page (source_files.id 108), distinct
from Ch6 item 28's illustrative line-drawing (which was answerable from
text alone). Item 18's Column I/Column II table is plain text, no image —
`diagramStatus: 'not_applicable'`, per this project's established
table-handling convention.

### Chapter 8: Rise of Nationalism and Establishment of the Indian National Congress

31 questions covering Raja Rammohan Roy and the Brahmo Samaj, Jyotiba Phule
and the Satya Shodhak Samaj, the Vernacular Press Act (1878), the Ilbert
Bill (1883), and the founding of the INC (1885). Both chronological-
ordering items (13, 14) independently re-verified against each newspaper's/
event's actual historical date — both matched the printed key. No
needs_review items. Item 14's option (a), "I, IV, III, IV", repeats "IV"
twice as printed — almost certainly a typo for "I, IV, III, II" — noted in
the explanation; doesn't affect the correct answer (option (c)).

**Second genuine photographic portrait in this subject:** item 15 asks "why
is HE considered the Father of Indian National Congress" — the pronoun
only resolves via the pictured portrait (A.O. Hume) — marked
`diagramStatus: 'source_diagram_preserved'` with a visual link, matching
the Ch7 item 19 precedent.

### Chapter 9: First Phase of the Indian National Movement (1885-1907)

26 questions covering the early "Moderate" phase of the Congress —
Surendranath Banerjee, Gopal Krishna Gokhale, Dadabhai Naoroji, the Indian
Association, the Servants of India Society. The chronological-ordering
item (14) was independently re-verified against each event's actual date
(1878 age-limit reduction, 1883 Indian National Conference, 1902 Gokhale's
Imperial Legislative Council membership, 1905 Servants of India Society)
and matched the printed key.

**One genuine needs_review — item 5:** the printed question stem ("In the
1906 Congress passed some special resolutions on swaraj, swadeshi, boycott
and national education.") does not logically connect to its own printed
explanation, which is actually about Dadabhai Naoroji's view that "justice"
was the real basis of political power. This reads as a genuine typesetting
defect in the source (most likely two questions merged/truncated during
layout) rather than a factual error — the printed answer (d) Justice is
itself historically accurate for the implied "real basis of political
power" question, just mismatched to the printed stem. Transcribed verbatim
with the printed answer kept, flagged and disclosed rather than silently
rewritten into a "corrected" question the source never actually printed.

No diagrams this chapter — all items are plain-text MCQs, AR items, and one
chronological-ordering item — `diagramStatus: 'not_applicable'` throughout.

Ingestion scripts: `archive-icse-history-ch1.js` /
`ingest-icse-history-ch01-union-parliament.js`,
`archive-icse-history-ch2.js` / `ingest-icse-history-ch02-executives.js`,
`archive-icse-history-ch3.js` /
`ingest-icse-history-ch03-pm-council-of-ministers.js`,
`archive-icse-history-ch4.js` /
`ingest-icse-history-ch04-union-judiciary-supreme-court.js`,
`archive-icse-history-ch5.js` /
`ingest-icse-history-ch05-state-judiciary-high-courts.js`,
`archive-icse-history-ch6.js` /
`ingest-icse-history-ch06-subordinate-courts.js`,
`archive-icse-history-ch7.js` /
`ingest-icse-history-ch07-first-war-of-independence-1857.js`,
`archive-icse-history-ch8.js` /
`ingest-icse-history-ch08-rise-of-nationalism-inc.js`,
`archive-icse-history-ch9.js` /
`ingest-icse-history-ch09-first-phase-national-movement.js`,
`archive-icse-history-ch10.js` /
`ingest-icse-history-ch10-second-phase-national-movement.js`.

### Chapter 10: Second Phase of the Indian National Movement (1905-1916)

33 questions covering the Extremist/"Assertive Nationalist" phase —
Partition of Bengal (1905), Tilak, Lala Lajpat Rai, Bipin Chandra Pal, the
Muslim League's founding (Dacca 1906) and constitution (Karachi 1907), the
Home Rule League movement, the Surat Split (1907), the Lucknow Pact (1916).

**Disclosed caveat (items 26 & 28):** "Purna Swaraj" as a specific term/
formal resolution is most precisely tied to the 1929 Lahore Congress
Session (Nehru), roughly two decades after this chapter's 1905-1919 period
— Tilak's own actual slogan (item 3) was "Swaraj is my birthright," not
"Purna Swaraj." Item 26 is an actual ICSE [Board Question], and many
board-level materials use the term loosely as shorthand for "complete
self-rule." Both items kept as printed (the real board-tested answers),
with the anachronism disclosed.

**Two further genuine photographic portraits:** items 17 (Tilak) and 19
(Lajpat Rai) each require the pictured image to answer — both marked
`diagramStatus: 'source_diagram_preserved'`, continuing the Ch7/Ch8
precedent. The two items share an identical generic "study the picture"
stem (flagged as a benign near-duplicate, similarity 1.0, since options/
answers differ).

Next chapter's bleed-through (last page of Chapter 10) was too faint/
fragmentary to confidently identify — the next `chap_N.pdf` upload will
reveal it.

### Chapters 11-13: The Partition of Bengal / Formation and Objectives of the Muslim League / Mahatma Gandhi and Popular National Movement (combined upload)

**Structural first for this subject:** `chap_11-13.pdf` (19 pages) is one
physical file spanning THREE logical textbook chapters — every prior
chapter upload was one physical PDF per chapter. Archived as a single
`source_files` row (`archive-icse-history-ch11-13.js`, stable_id
`ICSE-HISTCIVICS-CH11-13-COMBINED` → source_files.id 112), since
archive-before-ingest tracks the physical file as actually received, never
split into synthetic per-chapter files that wouldn't match what was
uploaded. All three chapters' `ingestQuestions()` calls reference this same
`sourceFileIds: [112]`, distinguished only by `chapterName`/`chapterOrder`/
`label` (each label notes "(Chapter N portion)").

**Chapter 11 — The Partition of Bengal (37 items, clean).** Covers the 1905
Partition of Bengal, the Swadeshi Movement, Tilak/Bipin Chandra Pal/Lajpat
Rai, and the Shivaji/Ganapati festivals. No needs_review items. One
deliberately-tricky (not defective) Assertion-Reason item: item 5's Reason
statement prints the year "1906" for the Calcutta Town Hall Boycott
Resolution, which the item's own explanation correctly identifies as wrong
(true date 1905) — R is correctly marked false, a genuinely well-designed
trick item, not a source error. Disclosed minor caveat, item 9: the
Shivaji festival revival year (1894 as printed) has genuine minor variance
across sources (some cite 1895); consistent with this project's Ch10
dating of the related Ganapati festival to 1893. **Diagram item 32:** an
actual map+statistics-table graphic ("Bengal 1905-1911," with per-half
Area/Population/Muslim-population data) — marked `diagramStatus:
'source_diagram_preserved'`, the map/table is the content being tested,
not decoration.

**Chapter 12 — Formation and Objectives of the Muslim League (35 items).**
Covers the Aligarh Movement, Sir Syed Ahmad Khan, the AIML's Dhaka founding
(30 Dec 1906), the Morley-Minto Reforms (1909), and the Lucknow Pact
(1916). Disclosed caveats (neither changes the printed answer): item 10's
matching question pairs the "Mohmmedan Anglo-Oriental Defence Association"
with 1906, though most historical accounts date that Association's
founding to 1893 (1906 is more usually tied to the League's own founding)
— 1893 isn't offered among the given options, so the printed pairing is
kept, disclosed. Item 20 marks statement (i) as true even though it
loosely calls the 1916 Congress "headed by ... Tilak" (the actual Lucknow
session president was Ambika Charan Majumdar, per item 14) — doesn't
change which statement the key marks wrong (iii). **Genuine defect,
needs_review — item 18:** the printed options contain an exact duplicate
— both (b) and (c) read "8 April, 1900" verbatim in the source; (c) was
almost certainly meant to read "18 April, 1900" (a typesetting slip), since
the real, well-documented date of the Nagari Resolution is 18 April 1900,
not 8 April. Transcribed with the duplicate intact and the printed answer
(b) kept, since no unambiguous corrected option exists among the four
given; discrepancy fully disclosed. No diagrams this chapter.

**Chapter 13 — Mahatma Gandhi and Popular National Movement (36 items).**
Covers Champaran, Kheda, the Khilafat/Non-Cooperation Movement, Chauri
Chaura, the Salt Satyagraha/Dandi March, the Gandhi-Irwin Pact, and the
Civil Disobedience Movement. Both chronological-sequence items (10, 11)
and the four-way match (item 15: Gokhale/Tagore/Bose/British Government ↔
political-guru/Mahatma-title/Father-of-the-Nation-title/Kaiser-i-Hind)
independently re-verified against real event dates and attributions — item
11 and item 15 matched the printed key exactly; item 10 has a disclosed
minor caveat (the Champaran Satyagraha and the Sabarmati Ashram's founding
are both 1917, close enough in time that their relative order in the key
is a minor, largely academic distinction — the later two events, 1922 and
1930, are correctly sequenced last). **Genuine defect, needs_review — item
17:** the printed key implies statement II ("Gandhiji was arrested in
Motihari in connection with Champaran Satyagraha") is false by excluding it
from the "correct" set — but that arrest is well-documented history,
corroborated by this same chapter's own item 13. The more historically
accurate answer would be "(c) All except IV are correct" rather than the
printed "(d) I and III are correct." Kept the printed answer for
board-key fidelity, discrepancy disclosed. **Genuine defect, needs_review
and CORRECTED — item 36:** the printed key reads "Ans. (c) 12 March,
1930," but option (c) as printed is actually "18 September, 1932" — the
text "12 March, 1930" belongs to option (a), and the item's own
explanation confirms that date. This is a letter/text mismatch rather than
a factual dispute; corrected to `correct: 0` (option a), matching both the
historical record and the source's own explanation, with the defect fully
disclosed. **Two diagram items:** item 20 (a statue depicting the Dandi
March) and item 21 (a photograph of the Second Round Table Conference),
each explicitly referenced by its question ("Look at the picture
carefully...") — both marked `diagramStatus: 'source_diagram_preserved'`.

Zero duplicate_flags rows across all three chapters (confirmed by direct
query against `duplicate_flags` filtered to this upload's question uids).

Ingestion scripts (chapters 11-13): `archive-icse-history-ch11-13.js`
(single archive for the combined file) /
`ingest-icse-history-ch11-partition-of-bengal.js`,
`ingest-icse-history-ch12-muslim-league.js`,
`ingest-icse-history-ch13-gandhi-popular-movement.js`.

### Chapters 14-17: Events Leading to the Quit India Movement / Subhash Chandra Bose and the INA / Towards Partition of India / World War-I and Treaty of Versailles (combined upload)

**Second combined-file upload for this subject** — `chap_14-17.pdf` (20
pages), this time spanning FOUR logical chapters in one physical file.
Archived as a single `source_files` row (`archive-icse-history-ch14-17.js`,
stable_id `ICSE-HISTCIVICS-CH14-17-COMBINED` → source_files.id 113), same
rationale as the Ch11-13 upload: archive-before-ingest tracks the physical
file as received. All four chapters' `ingestQuestions()` calls reference
this same `sourceFileIds: [113]`.

**Chapter 14 — Events Leading to the Quit India Movement, 1935-1943 (27
items).** Covers the 1939 Congress ministries' resignation, the August
Offer (1940), Individual Satyagraha, the Cripps Mission (1942), and the
Quit India Resolution. The chronological-sequence item (14) was
independently re-verified against real dates and matched the printed key
(disclosed minor caveat: the item's own explanation dates the Cripps
Mission to "July 1942" rather than its actual March-April 1942 timeframe —
doesn't affect the correct ordering). **Genuine defect, needs_review and
CORRECTED — item 17:** a four-way match pairs "August Offer" with "Indian
National Army" and "Subhash Chandra Bose" with "Lord Linlithgow" per the
printed key (code a) — neither pairing is historically coherent (the
August Offer was Linlithgow's; Bose founded the INA). The historically
correct combination is offered verbatim as code (b) among the same four
options; corrected to (b), discrepancy disclosed. **Genuine defect,
needs_review — item 26:** the printed key answers "The Congress turned
into a Socialist Party" as the significant outcome of the Quit India
Movement — not documented history, and not even supported by the item's
own printed explanation (which describes broad cross-community
participation, not any shift to socialism). Kept the printed answer per
source since no better-supported option exists among the four given;
disclosed. No diagrams this chapter.

**Chapter 15 — Subhash Chandra Bose and the Indian National Army (INA), 27
items.** Covers the INA's formation (Mohan Singh, 1942; Rash Behari Bose's
Indian Independence League), Bose's later leadership from 1943, the Azad
Hind Provisional Government (Singapore, 1943), the Rani of Jhansi Regiment,
and Bose's death (Taipei air crash, August 1945). Item 15's four-statement
true/false set was independently fact-checked against real events —
statements I, II and IV are false (INA was founded by Rash Behari Bose, not
Bose; the Malay Peninsula was taken by the Imperial Japanese Army, not the
INA; Bose died en route to Tokyo, not Korea) and only III is true,
consistent with the printed key. Disclosed minor caveat, item 24: the
printed key names the INA's three guiding principles as "Unity, Faith,
Justice," while the movement's more widely documented motto is "Unity,
Faith, Sacrifice" (and this same chapter's own item 22 pairs "Unity, faith
and sacrifice" together as an INA objective) — "Equality" remains clearly
the correct "odd one out" regardless, so the printed answer is kept.
**Three diagram items:** items 16-17 (a photograph of Bose inspecting the
Rani of Jhansi Regiment, with Captain Lakshmi Swaminathan) and item 20 (a
group photograph of INA officers/soldiers) — all marked `diagramStatus:
'source_diagram_preserved'`.

**Chapter 16 — Towards Partition of India, 1944-1947 (20 items).** Covers
the Cabinet Mission Plan (1946), the Interim Government, the Mountbatten
Plan (3 June 1947), the Radcliffe Award, and the Indian Independence Act
1947. Disclosed minor caveat, item 1: statement 3 of a features-of-the-
Cabinet-Plan question uses the source's own simplified framing ("India's
right to Secede from the Commonwealth") for what the actual Plan more
precisely offered (a province's right to seek reconsideration of the
constitutional arrangement after ten years) — doesn't change which
statement combination the key marks correct. Item 16 (last Viceroy of
India) prints "Lord Ripon" as both option (a) and option (d), an exact
duplicate reproduced verbatim — harmless, since it doesn't affect the
unambiguous correct answer, Lord Mountbatten. **One diagram item:** item
13, a photograph of overcrowded refugee trains illustrating Partition-era
mass migration, marked `diagramStatus: 'source_diagram_preserved'`.

**Chapter 17 — World War-I and Treaty of Versailles (27 items).**
**Structural first for this subject: this chapter marks the syllabus's
shift away from India-focused history into World History** — causes of
WWI, the Sarajevo assassination (28 June 1914), the Paris Peace Conference,
the Treaty of Versailles (28 June 1919), and the League of Nations. Every
one of the 27 printed answers was checked against well-documented,
largely uncontroversial world-history facts and found correct — a clean
chapter, zero needs_review items, zero disclosed caveats. **One diagram
item:** item 22, a reproduction of a period newspaper front page reporting
the Sarajevo assassination, marked `diagramStatus: 'source_diagram_preserved'`.
The chapter's final scanned page (221) bleeds through with the faint start
of the NEXT chapter, "Rise of Dictatorships" — too content to ingest now,
noted for the next upload.

Zero duplicate_flags rows and zero exact-duplicate skips across all four
chapters (confirmed by direct query against `duplicate_flags` and
`questions.answer_status` filtered to chapters 14-17's question uids).

Ingestion scripts (chapters 14-17): `archive-icse-history-ch14-17.js`
(single archive for the combined file) /
`ingest-icse-history-ch14-quit-india.js`,
`ingest-icse-history-ch15-bose-ina.js`,
`ingest-icse-history-ch16-partition-of-india.js`,
`ingest-icse-history-ch17-wwi-versailles.js`.

### Chapters 18-22 (FINAL): Rise of Dictatorships / The Second World War / The United Nations (Origin and Purpose) / The United Nations (Major Agencies and their Functions) / The Non-Aligned Movement (combined upload)

**Third and FINAL combined-file upload for this subject** — `chap_18-22.pdf`
(26 pages), spanning FIVE logical chapters in one physical file, uploaded
with the founder's own explicit message: **"icse history ends here."**
Archived as a single `source_files` row
(`archive-icse-history-ch18-22.js`, stable_id
`ICSE-HISTCIVICS-CH18-22-COMBINED-FINAL` → source_files.id 114), same
archive-before-ingest rationale as the two prior combined uploads. All five
chapters' `ingestQuestions()` calls reference this same
`sourceFileIds: [114]`. The book's own content independently corroborates
that this is the end of the subject: the final scanned page (247) bleeds
through with the start of a *different subject entirely*, "Geography" — not
another History chapter.

**Chapter 18 — Rise of Dictatorships (28 items).** Covers Italian Fascism
(Mussolini's March on Rome 1922, the Lateran Treaty 1929) and German Nazism
(Hitler's rise, the Enabling Act 1933, the Anschluss 1938, Nuremberg-era
persecution of Jews). Every one of the 28 printed answers was independently
checked against documented history and found correct — a clean chapter,
zero needs_review items, zero disclosed caveats (one non-flagged
simplification noted only in the ingest script's header comment: item 16's
framing of the Saar plebiscite). No diagrams.

**Chapter 19 — The Second World War (26 items).** Covers the war's causes,
course and end (Poland 1939, key campaigns, the atomic bombings, the
Nuremberg-era aftermath). Disclosed minor caveat, item 7: the printed "All
of these" (Britain, France, USA together forced Germany to sign the Treaty
of Versailles) glosses over the fact that the USA never actually ratified
or became bound by the Treaty of Versailles — the US Senate rejected it,
and the US made a separate 1921 Treaty of Berlin with Germany instead — a
fact this same subject's own Chapter 17 (item 27) correctly states. Doesn't
change the correct answer, since the treaty-signing itself did include all
three powers. **Genuine needs_review — item 15, handled with particular
care:** one option in a four-statement "which combination is true" item
reproduces a Nazi-era propaganda claim ("Due to isolation, the Germans
living in East Prussia were being slaughtered by the Polish Jews") as if it
were documented history. Per this project's policy of never silently
rewriting source text, this option was transcribed verbatim, but the
item's `explanation` field carries an extensive, explicit factual
correction clearly labelling this claim as a fabricated antisemitic
pretext — not history — referencing the real pattern of staged German
provocations (e.g. the Gleiwitz incident) used to manufacture a pretext for
invading Poland. The printed "All of the above" answer was kept
(`needs_review`) since the option set's other two sub-claims are genuinely
accurate and no better-supported combination exists among the four
choices, but the explanation makes unmistakably clear that option's
propaganda content must never be read as legitimate history. **Three
diagram items:** item 19 (photographs of the Hiroshima/Nagasaki atomic-bomb
mushroom clouds) and item 21 (a political cartoon by Milton Rowson
Halladay) — marked `diagramStatus: 'source_diagram_preserved'`.

**Chapter 20 — The United Nations (Origin and Purpose) (28 items).** Covers
the UN's 1945 founding (the San Francisco Charter, signed 26 June 1945),
its principal organs (General Assembly, Security Council and its five
permanent members' veto power, the Secretariat, the International Court of
Justice), and UN symbols/history (flag adopted 1947, South Sudan as the
193rd member). Every one of the 28 printed answers was checked against the
UN Charter's actual structure and documented UN history and found correct
— a clean chapter, zero needs_review items, zero disclosed caveats. No
diagrams.

**Chapter 21 — The United Nations (Major Agencies and their Functions) (26
items).** Covers UNICEF, WHO, UNESCO and their headquarters/functions.
**Genuine defect, needs_review and CORRECTED — item 4:** the printed key
answers "(d) Neither (a) nor (b)" for what UNICEF encourages children to
do (make/sell greeting cards), but the item's own printed explanation
directly states "UNICEF has encouraged youngsters to produce and sell
greeting cards..." — flatly contradicting the printed letter. Corrected to
"(c) Both (a) and (b)," which is offered verbatim among the same four
choices and matches the source's own explanation; discrepancy disclosed,
following the same corrected-from-own-explanation precedent as Ch13 item
36 and Ch14 item 17. All other 25 items independently verified clean
against documented UNICEF/WHO/UNESCO history and functions. No diagrams.

**Chapter 22 — The Non-Aligned Movement (26 items, FINAL chapter of this
subject).** Covers NAM's ideological origins, Panchsheel (1954), the 1961
Belgrade founding summit, and NAM's recognised architects (Nehru, Nasser,
Tito, Sukarno). **Genuine needs_review — item 2, cross-referenced against
item 24:** the printed key answers "(c) 1955" for when NAM "was
established," but this same chapter's item 24 correctly states the first
Non-Aligned Summit was held in 1961 in Belgrade — NAM's actual founding as
a formal organisation. 1955 is the date of the Bandung (Asian-African)
Conference, a well-documented ideological precursor to NAM, not the
founding of NAM itself — a common textbook conflation. Kept as printed
(1955, clearly the intended answer given the item's own explanation
wording) with the discrepancy against item 24's 1961 Belgrade date
disclosed. Disclosed (non-needs_review) caveat, item 11: the item lumps the
Berlin Blockade (actually 1948-49) and the Congo Civil War/Congo Crisis
(actually 1960-65) together as tensions "of the 1950s" — a loose framing,
but since all four options are combinations of the same three events, no
alternative answer corrects it, so it's disclosed rather than flagged, per
the Ch15-item-24 precedent for a non-decisive imprecision. All other 24
items independently verified clean against documented NAM history. No
diagrams.

Zero duplicate_flags rows and zero exact-duplicate skips across all five
chapters (confirmed by direct query: `inserted`/`skippedExactDuplicates`/
`flaggedNearDuplicates` from each `ingestQuestions()` call, plus a direct
`needs_review` count per chapter_id against the live DB — Ch18: 0, Ch19: 1
(item 15), Ch20: 0, Ch21: 1 (item 4), Ch22: 1 (item 2), matching every
figure predicted above exactly).

**This closes out ICSE History & Civics under the founder's standing
instruction.** The founder's own "icse history ends here" message, plus
the source book's own content (final page bleeding into a "Geography"
chapter heading), are treated as sufficient, independently-corroborating
evidence that no further History & Civics chapters are expected. If the
founder resumes uploading additional History & Civics chapters later, this
status line should simply be updated rather than treated as contradicting
this note.

Ingestion scripts (chapters 18-22): `archive-icse-history-ch18-22.js`
(single archive for the combined file) /
`ingest-icse-history-ch18-rise-of-dictatorships.js`,
`ingest-icse-history-ch19-second-world-war.js`,
`ingest-icse-history-ch20-united-nations-origin.js`,
`ingest-icse-history-ch21-united-nations-agencies.js`,
`ingest-icse-history-ch22-non-aligned-movement.js`.

## GEOGRAPHY — ICSE Class 10 (new subject, 2026-09-17)

**A brand-new subject for this project**, started immediately after ICSE
History & Civics was completed. The founder's message accompanying the
first upload (`chap_4-7.pdf`): "icse geography chapter 4-7 starting three
chapters are on topography which we willl do later" — i.e. Chapters 1-3 of
this Geography book (on Topography) are being **deliberately deferred**
and are expected in a future upload; this upload starts directly at
Chapter 4. The book's own page numbering (this upload's content runs pages
248-268) confirms Chapters 1-3 occupy pages 1-247 of this same book, not
yet uploaded — nothing to recover or flag as missing, simply not yet sent.

**Verification method**, same rigor as every other subject in this
project: every printed answer is checked against documented Indian
physical geography (monsoon climatology, pedology/soil science, forest
classification, irrigation/water-resource engineering) — not just copied
from the book's own "Ans."/"Explanation," which are transcribed as
supporting text but independently fact-checked.

**Status: PAUSED FOR NOW — 10 CHAPTERS COMPLETE** (Chapters 4-13; Chapters
1-3 still deliberately deferred, no further founder instruction yet on
when they'll arrive). 343 questions total, verified by direct DB query.
This is a **pause, not a subject completion** (unlike ICSE History &
Civics, which the founder explicitly closed out) — Chapters 1-3
(Topography) remain outstanding and this section should simply be extended
whenever they (or any further Geography chapters) are uploaded.

**Chapters 8-9 arrived as a second combined upload** (`chap_8-9.pdf`, 15
pages, source_files.id 116), continuing directly on from Chapter 7 with no
further instruction from the founder. **Chapters 10-13 then arrived as a
third combined upload** (`chap_10-13.pdf`, 26 pages, source_files.id 117)
with the founder's message "here geography ends for now" — explicitly
signalling this is the final Geography upload for the time being. Both
uploads were processed under the same autonomous, chapter-by-chapter
ingestion pattern used throughout this project. See the per-upload
sections below for full detail.

| Ch | Chapter | Source count | DB count | Needs review | Dup flags | Status |
|---|---|---|---|---|---|---|
| 4 | Climate of India | 30 | 30 | 0 | 0 | COMPLETE |
| 5 | Soil Resources | 28 | 28 | 0 | 1 (item 9 vs. 1 — both share the generic stem "suitable for growing on ___ soil," different soil types (laterite vs. black)/options/answers, not a real duplicate) | COMPLETE |
| 6 | Natural Vegetation of India | 32 | 32 | 1 (item 7 — see below) | 0 | COMPLETE |
| 7 | Water Resources | 30 | 30 | 1 (item 23 — see below) | 0 | COMPLETE |
| 8 | Mineral and Energy Resources | 48 | 48 | 1 (item 42 — see below) | 1 (item 16 vs. 15 — both share the generic stem "___ variety of coal is found in," different coal types/answers, not a real duplicate) | COMPLETE |
| 9 | Agriculture in India | 43 | 43 | 0 | 1 (item 2 vs. 3 — a genuine verbatim source repeat, identical stem "Which of the following statement(s) is/are not correct in support of agriculture in India?", similarity 1.0, but different options/answers, so both transcribed as printed) | COMPLETE |
| 10 | Industries in India: Agro Based Industries | 34 | 34 | 0 | 4 (benign — shared-family stems like "these industries are owned/managed by..." across items 4-7, and sugar-centre items, each with distinct options/answers) | COMPLETE |
| 11 | Industries in India: Mineral based Industries | 34 | 34 | 0 | 0 | COMPLETE |
| 12 | Transport in India | 37 | 37 | 0 | 2 (benign — see below) | COMPLETE |
| 13 | Waste Generation and Management | 27 | 27 | 0 | 3 (benign — shared "all of the above"-style civic-duty stems, distinct options/answers) | COMPLETE |

### Chapters 4-7: Climate of India / Soil Resources / Natural Vegetation of India / Water Resources (combined upload — first for this subject)

**First combined-file upload for this subject** — `chap_4-7.pdf` (21
pages), spanning FOUR logical chapters in one physical file. Archived as a
single `source_files` row (`archive-icse-geography-ch4-7.js`, stable_id
`ICSE-GEOGRAPHY-CH4-7-COMBINED` → source_files.id 115), same
archive-before-ingest pattern used throughout this project for combined
uploads. All four chapters' `ingestQuestions()` calls reference this same
`sourceFileIds: [115]`.

**Chapter 4 — Climate of India (30 items).** Covers monsoon mechanics
(onset/burst/withdrawal), regional rainfall patterns, western
disturbances, and climate extremes/records. Every one of the 30 printed
answers was checked against documented Indian climatology and found
correct — a clean chapter, zero needs_review items. Two minor notes (not
flagged): item 6 is a specific-station data-recall question drawn from a
data table in the main textbook (not reproduced in this MCQ book),
accepted as printed since it can't be independently re-derived; item 16
("driest place in India" = Jaisalmer) reflects this curriculum's standard
framing, though some sources instead cite Leh's cold desert as receiving
even less rainfall (Leh is conventionally treated as a separate cold-desert
climate outside the monsoon-region comparisons this chapter teaches). No
diagrams.

**Chapter 5 — Soil Resources (28 items).** Covers India's major soil
types (alluvial, black/regur, red, laterite), their formation, crop
suitability, and erosion/conservation concepts. Items 11 and 12 (each a
`case`-kind four-statement true/false set) were independently
re-verified against real soil science: item 11 confirms alluvial soil is
genuinely rich in potash but poor in phosphorus (the reverse of how
statement III is worded, correctly excluded from the key); item 12
confirms red soil genuinely has low water retention and low nitrogen
content (correctly identified as the "not true" characteristics,
statements III and IV). All 28 answers verified correct — zero
needs_review items. One disclosed (non-needs_review) note, item 24: the
"silica + clay + chalk" soil-composition claim is a simplified,
book-specific framing of soil's inorganic mineral content only (a fuller
description would also include organic matter/humus, water and air) —
kept as printed since it matches this chapter's own definition and no
better-supported option exists among the four given. No diagrams.

**Chapter 6 — Natural Vegetation of India (32 items).** Covers India's
forest classification (tropical evergreen, moist/dry deciduous,
littoral/mangrove, thorn, mountain forests), characteristic tree species,
and forest-conservation terminology. **Genuine defect, needs_review and
CORRECTED — item 7:** a three-pair matching item asks which
vegetation-belt/tree pairings are correct: (1) Moist Deciduous:Sandalwood,
(2) Dry Deciduous:Sal, (3) Thorn Forest:Shisham. The printed key marks
"(b) 1 and 2" — but this directly contradicts THIS SAME CHAPTER's own item
2 explanation, which states "Moist deciduous forest vegetation includes
teak, sal, myrobalan, sandalwood, semul, mahua, shisham etc." (i.e. Sal,
Sandalwood AND Shisham are all Moist Deciduous species by the book's own
classification, matching standard curricula such as NCERT). By that
classification only pair 1 is correctly matched; pairs 2 and 3 are both
wrong. Corrected to "(a) Only 1," offered verbatim among the same four
options; discrepancy disclosed, cross-referenced against item 2. Item 20's
four-way table-matching item was independently re-checked against items 2
and 24's own species lists and confirmed correct as printed (only "Q:
Tropical deciduous—Teak" holds up; the other three pairings are each
wrong). All other 30 items verified clean. No diagrams.

**Chapter 7 — Water Resources (30 items).** Covers irrigation methods
(wells, canals, tube wells, tank, sprinkler, drip), rainwater harvesting
techniques, and groundwater concepts. **Genuine defect, needs_review and
CORRECTED — item 23:** a letter/text mismatch (same defect pattern as
ICSE History Ch13 item 36) — the printed key reads "Ans. (b) Irrigation,"
but option (b) is actually "Eutrophication," not "Irrigation" (which is
option (d), and is unambiguously the term being defined, matching the
item's own explanation). Corrected to (d); mismatch disclosed. Disclosed
(non-needs_review) caveat, item 29: the claim that sprinkler irrigation
involves "no loss of water by seepage or evaporation... as water is
supplied through pipes and not exposed to the sun" overstates the case —
sprinklers spray water through the air as droplets, which is genuinely
subject to evaporation loss (part of why item 24 of this same chapter
identifies drip, not sprinkler, as the most water-efficient method). Kept
as printed since it remains the best-supported option among the four
given; overstatement disclosed. All other 28 items verified clean. This
chapter's final scanned page (268) bleeds through with the start of the
NEXT chapter, "Mineral Resources" (Chapter 8) — too little content to
ingest now, noted for the next upload. No diagrams.

Zero exact-duplicate skips across all four chapters; one benign
near-duplicate flag (Ch5 item 9 vs. item 1, both a generic "suitable for
growing on ___ soil" stem with different soil types/answers — a known
short-generic-stem detector blind spot documented elsewhere in this
project, not a real duplicate).

**Chapters 1-3 of this Geography book (Topography) are expected in a
future upload** — the founder explicitly deferred them ("...we willl do
later"). No action needed until that upload arrives; this status line
should simply be updated when it does, rather than treated as a gap to
chase down.

Ingestion scripts (chapters 4-7): `archive-icse-geography-ch4-7.js`
(single archive for the combined file) /
`ingest-icse-geography-ch4-climate-of-india.js`,
`ingest-icse-geography-ch5-soil-resources.js`,
`ingest-icse-geography-ch6-natural-vegetation.js`,
`ingest-icse-geography-ch7-water-resources.js`.

### Chapters 8-9: Mineral and Energy Resources / Agriculture in India (second combined upload)

**Second combined-file upload for this subject** — `chap_8-9.pdf` (15
pages), spanning TWO logical chapters in one physical file. Archived as a
single `source_files` row (`archive-icse-geography-ch8-9.js`, stable_id
`ICSE-GEOGRAPHY-CH8-9-COMBINED` → source_files.id 116), same
archive-before-ingest pattern. Both chapters' `ingestQuestions()` calls
reference this same `sourceFileIds: [116]`.

**Chapter 8 — Mineral and Energy Resources (48 items).** Covers
metallic-mineral geography (iron, copper, manganese, bauxite), coal grades
and coalfields, oil fields/refineries, and conventional vs. non-conventional
energy sources. **Genuine defect, needs_review and CORRECTED — item 42:**
a letter/text mismatch (same defect pattern as ICSE History Ch13 item 36
and this subject's own Ch7 item 23) — the printed key reads "Ans. (a)
Haematite" for "the best quality of iron ore," but its own explanation
states "Magnetite is the best quality of iron ore, containing 72% pure
iron" (option (c), not (a)) — also consistent with real mineralogy
(Magnetite, ~72% Fe, edges out Haematite, ~70% Fe, in iron content, even
though Haematite is India's more abundant, economically dominant ore).
Corrected to (c); mismatch disclosed. Two disclosed (non-needs_review)
caveats: item 3's "leading producer of coal" answer (Jharkhand) is the
long-standing, still-commonly-taught answer and matches this chapter's own
item 45 on coal RESERVES, but several recent years of official
coal-production statistics show Chhattisgarh having overtaken Jharkhand by
annual output — kept as printed, not contradicted within this chapter;
item 25 conflates refinery-operating companies (HPCL, IOCL) with refinery
locations (Mumbai, Kochi) to conclude neither HPCL nor IOCL runs a
"coastal" refinery, but HPCL itself operates a refinery in Mumbai (coastal)
and IOCL operates the coastal Paradip Refinery (Odisha) — kept as printed
since it tests recall of this book's own simplified classification, with
no better-supported option among the four given under that same premise.
All other 44 items verified clean. No diagrams.

**Chapter 9 — Agriculture in India (43 items).** Covers agriculture's
economic role, farming types (subsistence/shifting/plantation/commercial/
mixed), Green Revolution history and agricultural-policy terminology, and
crop-specific facts (rice, wheat, cotton, sugarcane, pulses). Two disclosed
(non-needs_review) internal-consistency notes rather than clear factual
errors: item 10 states agriculture is "14.7%" of export earnings, while
item 1 (by marking only its own statement (a) false) implicitly endorses
"about 12% share of exports" as accurate — two different specific
percentages for what appears to be the same statistic; both are plausible
depending on exact year/methodology, so neither is clearly wrong, but the
discrepancy is disclosed. Item 14 (cross-ref. items 12 and 15) uses
"New/National Agricultural Policy" to refer to a 1960s-era Green-Revolution
policy package — internally consistent across all three items, but this
name is more properly associated with India's actual, later, formally-
titled "National Agricultural Policy, 2000"; kept as printed since the book
is self-consistent, disclosed to avoid confusion with the real 2000
document. Item 23's shifting-cultivation regional-names matching was
independently re-verified (Jhum-Assam, Poonam-Kerala, Podu/Koman-Odisha,
Khil-Himalayan region, Kuruwa-Jharkhand, Bewar/Masha/Penda/Hera-Madhya
Pradesh), confirming "Poonam-Chhattisgarh" as printed is indeed the
mismatch. All other 41 items verified clean. This chapter's final scanned
page (283) bleeds through with the start of the next chapter, "Agro Based
Industries" (Chapter 10) — too little content to ingest now, noted for the
next upload. No diagrams.

Zero exact-duplicate skips across both chapters; two benign near-duplicate
flags (Ch8 item 16 vs. 15, generic "___ variety of coal is found in" stem;
Ch9 item 2 vs. 3, a genuine verbatim source repeat with different
options/answers — both transcribed as printed, consistent with this
project's precedent for source-level repeats).

Ingestion scripts (chapters 8-9): `archive-icse-geography-ch8-9.js`
(single archive for the combined file) /
`ingest-icse-geography-ch8-mineral-energy-resources.js`,
`ingest-icse-geography-ch9-agriculture-in-india.js`.

### Chapters 10-13: Agro Based Industries / Mineral based Industries / Transport in India / Waste Generation and Management (third combined upload — Geography PAUSED here per founder's own message)

**Third combined-file upload for this subject** — `chap_10-13.pdf` (26
pages), spanning FOUR logical chapters in one physical file, accompanied by
the founder's message **"here geography ends for now"** — read as an
explicit signal that this is the final Geography upload for the time
being (distinct from ICSE History & Civics's full-subject completion,
since Chapters 1-3 of this Geography book remain outstanding). Archived as
a single `source_files` row (`archive-icse-geography-ch10-13.js`,
stable_id `ICSE-GEOGRAPHY-CH10-13-COMBINED` → source_files.id 117), same
archive-before-ingest pattern used throughout this project. All four
chapters' `ingestQuestions()` calls reference this same
`sourceFileIds: [117]`. The PDF ends cleanly at the close of Chapter 13
(book page 309, marked with the source's own printed end-of-chapter
glyph) — no further chapter content bleeds through, confirming this is a
genuine stopping point in the source book, not a mid-chapter cutoff.

**Chapter 10 — Industries in India: Agro Based Industries (34 items).**
Covers agro-based vs. mineral-based vs. heavy-industry classification,
ownership types (public/private/joint/cooperative sector), the sugar
industry (production leaders, by-products, southward migration, problems),
the cotton textile industry (powerloom/handloom sectors, nicknames), and
handloom/khadi/silk/man-made-fibre industries. Zero needs_review items —
every printed answer independently checked against documented industrial
geography. One suspected contradiction resolved on close re-reading rather
than confirmed as a defect: item 11 ("sugarcane is not used to produce:
... Molasses") initially looked inconsistent with items 12/34 (which
correctly list Molasses as a BY-PRODUCT of sugar), but the two questions
test different things — item 11 asks what sugarcane is deliberately
processed to PRODUCE (Sugar, Gur, Khandsari), while items 12/34 ask about
BY-PRODUCTS of that processing (Molasses, Bagasse, Pressmud); no
contradiction, kept as printed. Two disclosed (non-needs_review) notes:
item 13 (Maharashtra as India's largest sugar producer, ahead of UP) is
the standard convention in ICSE textbooks of this vintage, though
year-to-year cane-area statistics have sometimes shown Uttar Pradesh ahead
by raw cultivated area — kept as printed, book's own reasoning is
internally consistent; item 26 (Mulberry silk correctly identified as the
world's leading commercial silk) carries a printed explanation that is a
copy-paste error unrelated to the question (it describes carpet-making
centres, Agra and Srinagar, instead of silk) — the answer itself is
independently verified correct, and the ingested explanation replaces the
erroneous printed text with a correct one, disclosing the source defect.
No diagrams.

**Chapter 11 — Industries in India: Mineral based Industries (34 items).**
Covers the iron/steel-making process sequence, mini steel plants,
iron-steel industry advantages/disadvantages, the Rourkela/Durgapur/Bhilai/
Bokaro/Vishakhapatnam steel plants (raw materials, foreign collaborations),
the first modern steel industry (1870, Kulti), the Mumbai-Pune industrial
region, electronics industry history (1965 origin, 1984-1990 "golden
period"), space technology/ISRO, BHEL's six units, software parks, and the
petrochemical industry. Zero needs_review items — all independently
verified, including the 1870/Kulti first-modern-steel-industry claim
(confirmed against documented industrial history: the Bengal Iron Works
Company's Kulti Iron Works, 1870) and the Rourkela/German-collaboration and
Durgapur/British-collaboration attributions (both consistent with
documented history). Item 31 ("NOT a centre for iron and steel industry" —
Bengaluru) is a verbatim repeat of Chapter 12's item 29 (identical stem,
options, and answer) — a genuine repeat in the source book itself, noted
for the record; this project's exact-duplicate detector is scoped
per-chapter, so both copies ingested normally without needing any special
handling. No diagrams.

**Chapter 12 — Transport in India (37 items).** Covers the importance of
transportation, road types and policy (BOT, national/state/rural highways,
North-South and East-West Corridors), railways (1853 origin, gauges,
diesel/rolling-stock centres, Himalayan low density), air transport
(Pawan Hans, north-eastern preference), waterways (National Waterways 1/2/3
with exact river stretches and declaration years), and ports (iron-
exporting ports, Visakhapatnam as the deepest land-locked/protected port,
IWAI, Mumbai as the busiest artificial port). Zero needs_review items, but
two disclosed (non-needs_review) caveats reflecting genuine imprecision in
the source: item 13 (diesel-engine production centres: Varanasi, "Uttar
Pradesh", Chittaranjan, all of these) — real-world railway geography
associates Chittaranjan Locomotive Works chiefly with electric (formerly
steam) locomotives rather than diesel, and "Uttar Pradesh" is a state name
rather than a distinct centre, redundant with Varanasi (itself in UP); no
printed explanation was given to check against, and no single alternative
option is unambiguously superior, so the printed "All of these" is kept
with this caveat disclosed. Item 28 ("busiest artificial port of India" =
Mumbai) — the printed explanation conflates the historic Mumbai (Bombay)
Port with the separate Jawaharlal Nehru Port (JNPT) at Nhava Sheva; JNPT,
not the old Mumbai Port, is generally cited as India's busiest container
port, and Mumbai's harbour is usually described as natural rather than
artificial (Chennai's is the commonly-cited artificial harbour at this
curriculum level) — this Mumbai/JNPT simplification is common in
secondary-level textbooks and is kept as printed, disclosed rather than
corrected since no single alternative is cleanly superior. No diagrams.

**Chapter 13 — Waste Generation and Management (27 items).** The final
chapter of this upload (and, per the founder's message, the final Geography
chapter for now) — covers waste's environmental/health impacts, waste
management/segregation/dumping/composting, the phases of waste
decomposition, the 3 R's, environmental-protection institutions (Ministry
of Environment and Forests, NEERI, CPCB), the Environment Protection Act
1986, eutrophication, and municipal-waste sources. Zero needs_review items;
every printed answer checked against standard environmental science and
found correct, aside from two disclosed (non-needs_review) soft internal
inconsistencies: item 2 (collection/transport/disposal of waste known as
"Both (a) Waste Accumulation and (b) Waste Management") — the source's own
explanation only substantiates "Waste Management" as the correct term and
gives no reasoning for "Waste Accumulation" also being correct; kept as
printed. Item 4 (identifying which statement about dumping is NOT correct,
printed answer (c) "dumping is costly") — correctly contradicts the
source's own explanation that dumping is actually the cheapest method, but
statement (a) ("dumping is the step prior to segregation") also appears
inconsistent with that same explanation, which states dumping comes AFTER
segregation; no combined option was offered among the choices, so the
single-letter printed answer is kept with this second inconsistency
disclosed. One minor print-defect note: item 17's option (c) reads "Steer
sweeping" in the source, transcribed here as "Street sweeping" per the
item's own explanation (answer unaffected either way). No diagrams.

Zero exact-duplicate skips across all four chapters. Benign near-duplicate
flags only: Ch10 (4 flags — shared-family ownership-type stems, items 4-7,
and sugar-centre items, each with distinct options/answers), Ch12 (2 flags,
generic "all of the above"-style civic/transport stems), Ch13 (3 flags,
similarly generic civic-duty stems) — none are real duplicates, consistent
with this project's precedent and the documented short-generic-stem
detector blind spot.

**Chapters 1-3 of this Geography book (Topography) remain deliberately
deferred, and no further founder instruction on Geography has arrived
since "here geography ends for now."** Geography is PAUSED here, not
closed — this status line and table should simply be extended whenever
Chapters 1-3, or any further chapters, are uploaded next.

Ingestion scripts (chapters 10-13): `archive-icse-geography-ch10-13.js`
(single archive for the combined file) /
`ingest-icse-geography-ch10-agro-based-industries.js`,
`ingest-icse-geography-ch11-mineral-based-industries.js`,
`ingest-icse-geography-ch12-transport-in-india.js`,
`ingest-icse-geography-ch13-waste-generation-and-management.js`.

## MATHS — ICSE Class 10, Chapters 1–6 (2026-09-17 upload — closes the RECOVERY_AUDIT.md gap)

**Status: ALL 6 CHAPTERS COMPLETE.** 379 questions total, verified by direct
DB query. This closes the exact gap an earlier session's RECOVERY_AUDIT.md
identified as "existence only, no recoverable content" for ICSE Maths
Chapters 1-6 — the founder re-uploaded the six original PDFs (`chap_1.pdf`
through `chap_6.pdf`, captioned "Icse chap 1-6"), which were archived
first (`archive-icse-maths-ch1-6.js`, source_files.id 96-101, under
`source_library/ICSE/Mathematics/`) and then fully transcribed, verified,
and ingested — the same archive-before-ingest discipline used everywhere
else in this project.

| Ch | Chapter | Source count | DB count | Needs review | Dup flags | Status |
|---|---|---|---|---|---|---|
| 1 | GST (Goods and Service Tax) | 66 | 66 | 0 | 0 | COMPLETE |
| 2 | Banking (Recurring Deposit Accounts) | 38 | 38 | 0 | 0 | COMPLETE |
| 3 | Shares and Dividend | 48 | 48 | 0 | 0 | COMPLETE |
| 4 | Linear Inequation | 81 | 81 | 0 | 0 | COMPLETE |
| 5 | Quadratic Equation | 102 | 102 | 0 | 0 | COMPLETE |
| 6 | Problems on Quadratic Equations | 44 | 44 | 1 | 0 | COMPLETE |

**Verification method:** every computable answer was independently
re-derived from scratch (forming the equation from the stated relationship
or standard formula, then solving via discriminant/quadratic formula/sum
and product of roots) BEFORE consulting the printed key
(`source_library/ICSE/Mathematics/answer.pdf`, which — a discovery made
mid-session — actually covers all 24 chapters, not just 7-24 as first
assumed). 421 of 424 numbered source items across the six chapters matched
the printed key exactly on independent recomputation; three disclosed
exceptions, all correctly routed to `needs_review`/explanation rather than
silently forced to match:

- **Chapter 4 (Linear Inequation), 10 number-line-diagram items** (57-64,
  79-81): the correct option required reading an exact open/closed circle
  position from a number-line figure preserved as a source diagram — taken
  from the printed key rather than pixel-guessed, and disclosed.
- **Chapter 5 (Quadratic Equation), item 61**: the transcribed problem
  statement ("αβ = c/m") did not cleanly resolve to a listed option under
  the standard product-of-roots formula; `correct` taken from the printed
  key (option C) rather than guessed, and disclosed.
- **Chapter 6 (Problems on Quadratic Equations), item 26** (motorboat
  upstream/downstream, 5 sub-parts): independent computation for parts
  (ii)-(iv) is internally consistent with parts (i) and (v) (which DO
  match the printed key exactly), but the printed key's own (ii)-(iv)
  answers are inconsistent with each other and with x=8 — the pattern
  suggests the key's three answers are column-shifted by one. Flagged
  `needs_review`; the item stores the independently-verified values, with
  the discrepancy disclosed in its `explanation` and `answerKeyRef` fields
  rather than silently matched to the key.

No diagrams/figures appear anywhere in Chapters 1, 2, 3, 5, or 6 (pure
algebra and word problems) — `diagramStatus: 'not_applicable'` throughout.
Chapter 4 has 10 number-line figures, correctly preserved as
`source_diagram_preserved` with `visuals` entries pointing at the already-
archived source PDF (source_files.id 99), per the founder's diagram-
preservation hard requirement.

Ingestion scripts: `ingest-icse-ch01-gst.js` through
`ingest-icse-ch06-problems-on-quadratic-equations.js`, each with a header
comment documenting its own verification method and any disclosed
exceptions in full.

## MATHS — ICSE Class 10, Chapters 7–24

**Status: ALL 18 CHAPTERS COMPLETE.** 1280 questions total, verified by
direct DB query, source-question counts as reconciled from the answer key.

| Ch | Chapter | Source count | DB count | Needs review | Dup flags | Status |
|---|---|---|---|---|---|---|
| 7 | Proportion | 72 | 72 | 6 | 2 | COMPLETE |
| 8 | Remainder and Factor Theorem | 68 | 68 | 0 | 3 | COMPLETE |
| 9 | Matrices | 65 | 65 | 1 | 8 | COMPLETE |
| 10 | Arithmetic Progression | 84 | 84 | 0 | 2 | COMPLETE |
| 11 | Geometric Progression | 56 | 56 | 0 | 4 | COMPLETE |
| 12 | Reflection | 60 | 60 | 0 | 7 | COMPLETE |
| 13 | Section and Midpoint Formula | 55 | 55 | 0 | 4 | COMPLETE |
| 14 | Equation of Straight Line | 82 | 82 | 0 | 5 | COMPLETE |
| 15 | Similarity as a Size Transformation | 21 | 21 | 0 | 0 | COMPLETE |
| 16 | Similarity of Triangles | 87 | 87 | 0 | 1 | COMPLETE |
| 17 | Angle and Cyclic Properties of Circle | 74 | 74 | 0 | 6 | COMPLETE |
| 18 | Tangent Properties of Circle | 60 | 60 | 0 | 0 | COMPLETE |
| 19 | Locus and Construction | 35 | 35 | 0 | 2 | COMPLETE |
| 20 | Volume and Surface Area of Solid (Mensuration) | 105 | 105 | 0 | 3 | COMPLETE |
| 21 | Trigonometry | 95 | 95 | 0 | 45 (dense algebra-identity chapter — many structurally similar stems) | COMPLETE |
| 22 | Heights and Distances | 58 | 58 | 0 | 1 | COMPLETE |
| 23 | Statistics | 118 | 118 | 0 | 1 | COMPLETE (done earlier this project) |
| 24 | Probability | 85 | 85 | 0 | 1 | COMPLETE (done earlier this project) |

Note: Chapter 7's needs_review=6 was under-reported as 0 in the ingesting
agent's own summary — caught by independent DB verification, corrected
here. The 6 items (source #54,55,56,57,58,62) are genuinely uncertain
algebra derivations, not answer-availability issues.

Known flagged discrepancies worth a human look (not blocking, all correctly
routed to `needs_review`/`answer_status`, never silently guessed):
- Trigonometry Q87 (Assertion-Reasoning): independent derivation says the
  Assertion is mathematically true; printed key implies otherwise.
- Heights & Distances Q8: printed key's answer matches measuring the angle
  from the ground, not from the wall as literally stated — flagged, not
  silently corrected.
- Similar single-item flags exist in Matrices, Geometric Progression,
  Section/Midpoint, Mensuration, Statistics, Probability (4 items) — see
  each row's `answer_status` in the DB for specifics.

**Remaining Maths work:** none identified. If more ICSE/CBSE Maths source
PDFs are uploaded later, they are NEW source documents, not a reason to
revisit chapters marked COMPLETE above.

## CHEMISTRY — ICSE Class 10

### Section A — Chapters 1–9 (no answer key in source)

**Status: COMPLETE.** 667 questions, all `answer_status: 'unavailable'`
(never gradable by construction — this is correct, not a defect). Captured
in native format per the founder's "capture first, decide later" rule:
`kind` is `'mcq'`, `'case'`, or `'open'` (open = Name-the-following,
Give-reasons, equations, numerical, structural/diagram, etc. — a
`question_format` column records the specific native shape).

| Chapter | Total captured | Needs review | Dup flags |
|---|---|---|---|
| 1. Periodic Table | 119 | 0 | 16 |
| 2. Chemical Bonding | 58 | 1 | 19 |
| 3. Acids, Bases and Salts | 80 | 1 | 31 |
| 4. Mole Concept & Stoichiometry | 23 | 0 | 1 |
| 5. Electrolysis | 44 | 0 | 18 |
| 6. Metallurgy | 75 | 0 | 30 |
| 7. Study of Compounds (A–D) | 80 | 0 | 26 |
| 8. Organic Chemistry | 167 | 2 (incl. 1 grouped row of 14 structural/isomer items needing chemist review) | 60 |
| 9. Practical Chemistry | 21 | 0 | 0 |
| **Total** | **667** | **4 rows** (Ch8's grouped structural row covers 14 sub-items) | **~201 Chemistry-only** |

Duplicate-flag sample (40 of Section A's flags, classified by hand):
genuine duplicate 0%, same-concept-different-question 80%, false positive
20% (all traced to one cause: grouped rows sharing an identical printed
instructional stem like "Name the following:" — the Jaccard check compares
`text`, not `parts`, so it over-flags these; not a threshold problem).
**`NEAR_DUP_THRESHOLD` has not been changed** — founder said not to until
this was measured, and it has been, but no change has been requested yet.

Known data-quality note: Chapter 1's open-content rows initially had some
synthetic instructional phrasing incorrectly prepended during transcription;
this was caught and fixed (ids 651,652,666–702 corrected to verbatim source
text) via direct SQL correction. Two lower-severity, still-unfixed
inconsistencies remain (Ch1 "arrange the following" items read as narrative
paraphrase rather than verbatim; Ch2 element-lettering rows repeat shared
context per-row instead of using the `parts` grouping) — flagged for a
future cleanup pass, not blocking.

### Section B — Charts 1–4 (has answers) — COMPLETE

**Status: COMPLETE.** All four files fully read page-by-page (all 39 pages
across chart_1/chart_1_answer/chart_2/chart_3/chart_234_answer/chart_4) and
ingested via `ingest-chart1.js`, `ingest-chart2.js`, `ingest-chart3.js`,
`ingest-chart4.js`. Every chapter mapping used one of the 9 existing
Chemistry chapters — **no new chapter was created** for any Chart.

Key finding, per file (full reasoning in each ingest script's header
comment):
- **Chart 1** (`chart_1_additional_chapter_wise.pdf`, 13pg, 172 long-form
  essay/descriptive questions, native `kind:'open'`): its paired
  `chart_1_answer.pdf` (19pg) does **NOT** reliably map to it. That answer
  file's own cover page identifies itself as solutions to a *different*
  companion book ("Objective Workbook with New Competency Focused
  Questions & Test Papers"), and cross-checking several chapters confirms
  a structural mismatch — different question numbering, different
  question types (fill-blank/match/numerical vs. this file's descriptive
  essay questions), and a different internal page-citation scheme. All 172
  items were captured in full native form with `answer_status:
  'needs_review'` at the batch level (a specific, evidenced finding, not a
  blanket call).
- **Chart 2** (`chart_2_equation.pdf`, 12pg, "Equation Worksheet — Complete
  & Balance"): captured as 12 grouped `kind:'open'`, `question_format:
  'equation'` rows (31 DB rows total, one per printed sub-heading, each
  with every individual equation preserved in its `parts` array — 0
  equations dropped). Its answer file (`chart_234_answer.pdf`'s "CHART 2"
  block) gives only **9 chapter/page pointers into the original textbook**
  — no literal per-equation answer anywhere — so all items are
  `answer_status: 'unavailable'` (confirmed limitation of the source
  itself, not a mapping failure).
- **Chart 3** (`chart_3_critical.pdf`, 7pg, "Additional Critical Thinking
  Questions", 192 items continuously numbered 1–192 across 8 sub-sections):
  its answer file gives a **literal answer for every item 1–174**
  (short name/formula for 1–127, a full balanced-equation hint for
  128–174) → `source_provided`. Items 175–192 (Q.8, organic conversions)
  get only a page-pointer ("pages 249 to 252") → `unavailable`. Chart 3's
  own numbering does not follow chapter boundaries, so each Q-group was
  filed under the DB chapter matching its dominant subject matter (Q.1/
  Q.2/Q.4/Q.7 → Study of Compounds; Q.3/Q.5/Q.6 → Metallurgy; Q.8 →
  Organic Chemistry) — documented in `ingest-chart3.js`.
- **Chart 4** (`chart_4.pdf`, 7pg, "Board Type Critical Thinking
  Questions", Q.1–Q.13, genuinely mixed MCQ/fill-blank/match/short-answer/
  diagram shapes): its answer block is **entirely page-pointers** ("Question
  1 (i)[pg.9,10,12]...") — no literal answer anywhere, despite the file's
  own cover claiming "Answers - Page 177". All 57 DB rows are
  `answer_status: 'unavailable'`. Chart 4 mixes topics **within** single
  numbered questions (e.g. Q.1's ten MCQs span 8 different chapters), so
  mapping was done at the individual (i)/(ii)/... sub-item level, each
  filed under the chapter its own content actually belongs to — see
  `ingest-chart4.js` for the full per-item map.

| Source file | Total questions found | Captured | Answer available (mapped) | Answer unavailable | Needs review | Duplicates flagged |
|---|---|---|---|---|---|---|
| chart_1_additional_chapter_wise.pdf | 172 | 172 | 0 | 0 | 172 (whole batch — see finding above) | 1 |
| chart_2_equation.pdf | 31 grouped rows (244 individual equations preserved in `parts`) | 31 | 0 | 31 | 0 | 0 |
| chart_3_critical.pdf | 192 | 192 | 174 | 18 | 0 | 8 |
| chart_4.pdf | 57 | 57 | 0 | 57 | 0 | 3 |
| **Chart subtotal** | **452** (+244 sub-items inside Chart 2's grouped rows) | **452** | **174** | **106** | **172** | **12** |

### Section C — Competency Focused Questions (has solutions) — COMPLETE

**Status: COMPLETE.** `competency.pdf` (23pg, 263 items across all 9
chapters) fully read page-by-page and cross-checked item-by-item against
`competency_answer.pdf` (2pg, organized by chapter with continuous
numbering across its own roman-numeral sub-sections — I. MCQ's, II. Fill
in the blanks, III. Match the following, IV. One word, V. Short answer,
VI. Long answer / Structural diagrams). Confirmed (not assumed): the
"answers on page 201" reference on competency.pdf's own page 1 refers to
the *original printed book's* page 201, and the real answer source is
`competency_answer.pdf`.

Mapping method, per the founder's explicit "don't assume proximity"
instruction for this file: every chapter's answer-key text was read in
full and compared question-number-by-question-number against the
question paper's own printed numbers. Where the answer key explicitly
gives a numbered answer → `source_provided`. Where a chapter's answer-key
text stops short of a number the question paper actually has (confirmed
by reading the full page, not inferred) → `unavailable`. No item needed
`needs_review` — every item's answer availability was directly verifiable
as either present or absent, never ambiguous.

Confirmed gaps (chapter → missing item numbers, i.e. the printed answer
key itself never reaches these): Ch3A: 21, 24, 25 · Ch3B: 13 · Ch4: 15, 16
· Ch5: 20 · Ch6: 15, 19, 20 · Ch7A: 19–24 · Ch7B: 16–20 · Ch7C: 21–23 ·
Ch7D: 22–27 · Ch8: 15, 20 · Ch9: 13, 14, 15. Ch1 and Ch2 are fully covered
(no gaps).

| Source file | Total questions found | Captured | Answer available (mapped) | Answer unavailable | Needs review | Duplicates flagged |
|---|---|---|---|---|---|---|
| competency.pdf + competency_answer.pdf | 263 | 263 | 226 | 37 | 0 | 0 |

**ADDENDUM (2026-09-23) — a real transcription defect found in this batch,
disclosed per this file's own rule that a fresh audit finding a specific,
named problem is exactly when this file should be updated:** while testing
the SQLite → PostgreSQL migration on a copy (Phase 3, infrastructure
project — see `docs/phase-3-migration-design-report.md`, Section 6), 122 of
this batch's 226 "answer available (mapped)" rows were found to have their
`correct` field stored as literal text — 119 as a printed option letter
(e.g. `"(b)"`) instead of this project's normal 0-based numeric option
index, and 3 as a free-text answer fragment (e.g. `"oxidising"`) that isn't
a multiple-choice index at all and looks like it was mis-tagged `kind:
'mcq'` instead of `kind: 'open'`. SQLite's dynamic typing silently accepted
these values, so `npm test` and every prior audit passed without ever
surfacing this — it only became visible when PostgreSQL's static column
typing rejected the values outright during the migration test.

**This is a genuinely open content-QA item, not a closed one, despite the
"COMPLETE / 0 needs_review" status recorded above at ingestion time.**
Per this project's rules: none of these 122 rows have been modified,
promoted, or guessed at — they remain exactly as originally transcribed,
`status: 'transcribed'`, not currently servable to any student
(`GRADABLE_STATUSES` excludes `'transcribed'`), so there is no live-scoring
risk. The full list of affected rows (id, printed value) is in
`docs/phase-3-migration-artifacts/migrate-report.json`'s `discrepancies`
array. **Resolving this (converting each printed letter to its correct
0-based index against `competency_answer.pdf`, and re-classifying the 3
free-text rows to `kind: 'open'` if that's what they are) is flagged here as
a future, deliberate content-QA pass — the same kind of manual/semi-automated
follow-up already on record above for the 342-question provenance gap —
not something to be resolved as a side effect of the infrastructure
migration project.**

## SECTION B + C GRAND TOTAL

| Source file | Total questions found | Captured | Answer available (mapped) | Answer unavailable | Needs review | Duplicates flagged |
|---|---|---|---|---|---|---|
| chart_1_additional_chapter_wise.pdf | 172 | 172 | 0 | 0 | 172 | 1 |
| chart_2_equation.pdf | 31 (244 sub-equations) | 31 | 0 | 31 | 0 | 0 |
| chart_3_critical.pdf | 192 | 192 | 174 | 18 | 0 | 8 |
| chart_4.pdf | 57 | 57 | 0 | 57 | 0 | 3 |
| competency.pdf | 263 | 263 | 226 | 37 | 0 | 0 |
| **GRAND TOTAL** | **715** | **715** | **400** | **143** | **172** | **12** |

New DB total after this batch: **2677 questions** (was 1962 before this
session), verified by direct query, `npm test` 12/12 passing throughout
and after every ingest script. Ingest scripts:
`/home/claude/backend/ingest-chart1.js`, `ingest-chart2.js`,
`ingest-chart3.js`, `ingest-chart4.js`, `ingest-competency.js`.

No new Chemistry chapters were created — every item mapped to one of the
existing 9 (Periodic Table, Chemical Bonding, Acids/Bases and Salts, Mole
Concept & Stoichiometry, Electrolysis, Metallurgy, Study of Compounds,
Organic Chemistry, Practical Chemistry). `source_section` on every row in
this batch is one of 'Chart 1' / 'Chart 2' / 'Chart 3' / 'Chart 4' /
'Competency Focused' so it stays distinguishable from Section A content
even where it shares a chapter.

**Honest limitation to flag for a future session:** Chart 1's 172 items
are captured but their answers are genuinely unresolved (the paired
answer PDF doesn't match this question set) — if the founder has another
source for Chart 1's actual answers, or confirms these should just stay
`needs_review` permanently as descriptive/ungraded content (like Section
A), that's a decision for a human, not something this pass could resolve
by guessing.

## FRONTEND — Board Ready (name unchanged, do not rename)

Revision 3's design (pulled from the actual saved Artifact, not
redesigned) is wired to the real backend API — verified end-to-end via
curl/fetch (register → real questions → real independent server-side
grading → real Readiness Score → real paywall). Files: `/home/claude/backend/public/{index.html,style.css,app.js}`, served
by `server.js` as static assets, additively (existing API routes
untouched).

**Blocked on:** no linked user device (the remote-devices bridge has been
intermittently connecting/disconnecting this session — check its current
state before assuming either way) and no public URL for this sandbox.
Once a device is linked, the plan is: run the server on the founder's own
machine, open `http://localhost:<port>` in their real Chrome via the
claude-in-chrome tools, and let them take a real test.

**Do not touch:** scoring.js, diagnostics.js, readiness.js, retest.js,
auth.js — unchanged this entire project except where explicitly noted as a
genuine, named, reported bug fix (none have been needed in these files so far).

## TESTS

`npm test` in `/home/claude/backend`: **12/12 passing**, verified after
every ingestion batch throughout this project.

## Standing rule: never infer content inventory from /uploads alone

The uploads folder only shows what's attached to THIS session. It is not
evidence of what has or hasn't been ingested historically — a prior
session's backend/database can persist (or, per REBUILD_NOTES.md, can be
wiped by an infrastructure reset) independent of what's currently attached.
**Before ever telling the founder "that content doesn't exist" or asking
for a re-upload, audit in this order: (1) the live database — subjects,
chapters, question counts, `source_documents`, `tests`/`attempts` records;
(2) REBUILD_NOTES.md and this file for documented history; (3) any
surviving `.bak-*` database snapshots; (4) only then conclude something
was never ingested.** A 2026-09-17 audit did exactly this for a founder
claim about CBSE Science/Social Science content (see that day's
conversation) and conclusively found no trace in the live DB, the earliest
surviving backup (`boardready.db.bak-preopenkind`, 648 questions), or
REBUILD_NOTES.md's own account of what existed even before the
infrastructure reset that predates this project — the only place those
subject names ever appeared was as decorative, hardcoded percentages in
the Revision 3/2 design prototype (explicitly labeled "not wired to the
live app"), never real ingested content. That conclusion was reached by
audit, not by assumption from an empty uploads folder — the standard this
rule requires going forward.

## Standing rule: never drop a question from the bank to make test-building easier (2026-09-17)

Founder instruction, verbatim: "Just keep all the questions in the
question bank don't miss out on those how to make test i will say." This
confirms the existing architecture is exactly right and must not be
weakened later for convenience: **every captured question stays in the
`questions` table permanently**, regardless of `status` or
`answer_status` — a hard-to-grade or unverified item is never deleted or
excluded from the bank itself, only excluded from what `practice.js`/test
generation is allowed to SERVE (via `GRADABLE_STATUSES` in
`content-rules.js`). As of this note: 2677/2677 questions present, none
ever deleted, including 810 with `answer_status='unavailable'` and 183
`needs_review` — all still in the bank, all correctly withheld from
gradable tests, none silently dropped.

The founder will separately specify HOW tests should be assembled (mix
rules, chapter coverage, difficulty balance, etc.) — do not build or
change test-generation logic (`practice.js`, `/api/tests/generate`,
`/api/practice/generate`) ahead of that instruction. This note is only
about never shrinking the bank, not about designing the test builder.

## New CBSE Mathematics chapters ingested 2026-09-17 (Probability, Statistics, Surface Areas & Volumes)

Three new chapters, each from photographed printed-guide pages, archived
BEFORE ingestion per the standing rule and independently re-verified by
computation (not by trusting the printed key at face value):

| Chapter | source_files ids | Items ingested | Disclosed gaps | Flagged needs_review |
|---|---|---|---|---|
| Probability (chapterOrder 14) | 42-47 (pp.15.19-15.24) | 61/61 | none | 1 (item 61: printed key claims P=4/5 from 9/45 balls, but 9/45=1/5 exactly) |
| Statistics (chapterOrder 13) | 48-55 (pp.14.15-14.22) | 53/58 | Q3 (stem cut off across a page break), Q55-58 (AR section, withheld rather than risk cross-contamination with Surface Areas' similarly-shaped AR section) | 1 (item 53 case study: median/modal class both compute to 46-48, making sub-part (iv)'s printed options unreachable) |
| Surface Areas and Volumes (chapterOrder 12) | 56-63 (pp.13.15-13.22) | 55/55 | none | 4 (item 33: computed 1:4, key says 4:1; item 41: computed 3π:1, key says 4π:1; item 45(iv): computed 58212, key says 116424 — exactly double, looks like a key typo; item 55: BOTH statements computed false, an option combination the source's own 4-choice scheme can't represent) |

Total questions 2677 → 2846 (+169). `npm test` 12/12 after each ingestion.
Every flagged item keeps the source's own printed answer recorded in
`correct`/the case study's option list — never silently overruled — with
`answer_status:'needs_review'` and a full explanation of the discrepancy,
per the project's established practice (same pattern as Trigonometry Q87
and Heights & Distances Q8 from earlier in the project).

Two case-study items in Surface Areas (43: a stepped "victory stand"
figure; 44: the Atal Tunnel cross-section) rely on the printed key's sub-
answers directly rather than independent re-derivation, because the exact
geometry is only recoverable from an annotated 3D sketch, not the stem
text — disclosed in-code and here rather than presented as independently
verified.

## Large new upload batch received 2026-09-17 — PRESERVED, transcription in progress

While the Surface-Areas-and-Volumes ingestion above was underway, the
founder sent two further messages of 16 photographed pages each (32 pages
total), spanning what looks like six more chapters: Triangles (partial —
only the tail end, pp.7.16-7.20, appears to be included; items ~1-36 are
not among these pages), Circles (pp.8.13-8.22, appears to be the complete
practice-exercise section), Trigonometric Ratios (pp.9.11/9.13-9.15),
Trigonometric Identities (pp.10.7-10.9), Heights and Distances
(pp.11.10-11.15), and Areas Related to Circles (pp.12.13-12.17).

Per the standing "archive before ingestion" rule, all 32 original photos
were preserved IMMEDIATELY on receipt — copied into
`source_library/CBSE/_pending_classification_2026-09-17/`, SHA-256 hashed,
and registered as `source_files` rows 64-95 (stable IDs
`PENDING-20260917-<hash8>`) — via `archive-pending-batch-2026-09-17.js`,
BEFORE any transcription or ingestion work started on them. This guarantees
the originals cannot be lost to a session interruption even though the
detailed page-by-page transcription (the same independently-verify-every-
answer process used above) had not yet been completed as of this note.

Each of these 32 `source_files` rows currently carries only an UNCONFIRMED
best-guess `source_section` (formed while viewing the images inline in
conversation, not yet individually re-confirmed) and a note flagging it as
provisional. **Before ingesting any of these six chapters, re-open each
relevant file individually, confirm its exact page/content, and correct
its `source_files` row to a proper chapter-specific `stable_id`** (e.g.
`CBSE-MATH-TRI-P716`), exactly like the Statistics page-mislabeling
correction earlier in this project — do not ingest against the placeholder
`PENDING-*` ids. Next session/turn should continue with this chapter list,
one at a time, same rigorous process, reconciliation report after each.

## Triangles chapter ingested 2026-09-17 (partial — tail end only)

11 items from pp.7.16-7.20 (part of the large 32-image batch above), same
independently-verify-every-answer method as the other new chapters. This is
only the TAIL of the chapter — items 1-36 and item 37's sub-parts (i)-(ii)
are on earlier pages (~7.1-7.15) not among the photographed pages; send
those if the chapter should be completed. 2 items flagged/disclosed:
item 38(v) (computed kite area 24cm², printed key says 48cm² — exactly
double, likely a dropped ½ factor) and item 46 (a figure-dependent
trapezium-diagonal item where the printed key's x=3 was taken as-is since
the figure's four algebraic labels couldn't be confidently matched to the
diagonals' four segments from the photo alone). Total questions 2846→2857.

## CRITICAL — visual/diagram preservation is now a hard requirement (2026-09-17)

Founder instruction, verbatim: *"For every source question across all
boards, subjects, chapters and future uploads, inspect the original source
page for visual material. If a question contains any diagram, figure,
graph, chart, geometry construction, chemical structure, structural
formula, circuit, ray diagram, coordinate figure, map, illustration,
labelled figure, table-as-image, or other visual component, the complete
original visual must be preserved and made available to the Board Ready
website. ... A question is NOT considered completely captured if its
associated diagram/visual is missing."* Required chain:
`question_uid -> source_document -> source_page -> visual_asset`. Original
source diagrams must never be replaced by a text description, a crop that
risks losing content, or (for SOURCE questions) an AI-redrawn substitute —
AI-generated diagrams are for future AI-AUTHORED questions only, and the
two must stay clearly, permanently distinguishable.

**What was built this session**, directly in response to that instruction:

- `visual_assets` table (db.js): one row per visual actually linked to a
  question — `question_id`, `source_file_id` (FK into the existing,
  permanent `source_files` archive), `asset_type`
  ('source_page_full' | 'source_cropped' | 'ai_generated'), `figure_label`,
  `asset_path`, `notes`. `source_page_full` (the complete, uncropped
  original page) is the default and by far the most-used type this
  session, specifically because it can never crop away something relevant
  — exactly the founder's "do NOT crop away relevant portions" rule.
- `questions.diagram_status` column, a THIRD independent axis alongside
  `status`/`answer_status`: `not_applicable` | `source_diagram_preserved` |
  `needs_visual_review` (the default — deliberately, so nothing is ever
  silently assumed diagram-complete) | `ai_generated_pending`.
- `ingest.js`'s `ingestQuestions()` now accepts per-item `diagramStatus`
  and `visuals: [{sourceFileId, figureLabel, assetType, notes}]`, validates
  them (a `source_diagram_preserved` claim with no visuals is a thrown
  error, same enforcement style as the existing `sourceFileIds` rule), and
  inserts the `visual_assets` rows atomically with the question. **Every
  ingestion script from now on must set `diagramStatus` per item** — see
  `ingest-cbse-triangles.js` for the pattern (case-study/AR items with a
  named Fig. get `source_diagram_preserved` + a `visuals` entry pointing at
  the already-archived full source page; plain items with no figure get
  `not_applicable`).
- Applied immediately to the Triangles ingestion above, and backfilled
  (via `backfill-visuals-2026-09-17.js`) onto the three chapters ingested
  earlier THIS session (Probability, Statistics, Surface Areas & Volumes) —
  10 figure-bearing case-study/AR items linked to their real source pages
  (Statistics items 51-54: Fig.14.6-14.9; Surface Areas items 43-47 and 54:
  Fig.13.22-13.27), the remaining 159 plain-text items in those three
  chapters marked `not_applicable`.

**Honest audit of everything ingested BEFORE this requirement existed**
(2677 questions — every chapter from prior sessions, ICSE Maths/Chemistry
included): all defaulted to `needs_visual_review` (never silently marked
clean). A heuristic text-scan (looking for "fig.", "diagram", "shown
below/above", "graph", "chart", "adjoining", "table below", etc. in the
question/parts text — a real check, but not a substitute for actually
opening each source page) flags **175 of the 2677** as likely referencing
a visual, concentrated in:

| Subject — Chapter | needs_visual_review | heuristically likely to need a visual |
|---|---|---|
| Mathematics — Angle and Cyclic Properties of Circle | 74 | 47 |
| Mathematics — Similarity of Triangles | 87 | 32 |
| Mathematics — Tangent Properties of Circle | 60 | 25 |
| Chemistry — Chemical Bonding | 92 | 14 |
| Chemistry — Electrolysis | 84 | 11 |
| Chemistry — Organic Chemistry | 248 | 10 |
| Chemistry — Study of Compounds | 380 | 8 |
| Mathematics — Similarity as a Size Transformation | 21 | 7 |
| Mathematics — Heights and Distances | 58 | 6 |
| (10 more chapters, 1-3 each) | — | ~13 |

**This audit is NOT complete** — it only says which questions look like
they need a visual by their own wording; it does NOT yet confirm whether
each one's original source page/PDF is still findable and whether a real
diagram was actually printed there (some of these 41 original source
files were only ever ingested as text, per REBUILD_NOTES.md, before this
project had any image-preservation capability at all — for those, the
underlying page image may simply not exist to link). **Next session must,
per chapter, in priority order (worst-first, from the table above):** open
the real original source (the archived PDF in `source_library/` for the
41 original ICSE files, or ask the founder to re-send the page if the
original PDF's images aren't extractable) for each `needs_visual_review`
row flagged likely, confirm whether it has a diagram, and either link the
real visual (`source_diagram_preserved`) or record `not_applicable` with
a one-line reason. Do not mark a chapter's diagram audit "done" without
having actually looked at each flagged row's real source page — the same
"don't assume, verify against the source" standard as everywhere else in
this file.

## CBSE Maths 32-image backlog COMPLETED, chapter-naming fix, and 4 more PDFs archived (2026-09-17, continuation session)

This session picked up the "Large new upload batch" note above and finished
every chapter from that 32-image batch:

- **Circles (Ch.8)** — 70 items, pp.8.13-8.22, COMPLETE, zero needs_review
  (see `ingest-cbse-maths-circles.js`).
- **Trigonometric Ratios** — 13 items (items 1-2, 27-37 incl. 3 case
  studies), pp.9.11/9.13-9.15, PARTIAL: **page 9.12 (approx. items 3-26)
  was never photographed and is genuinely missing** — disclosed, not
  fabricated (see `ingest-cbse-maths-trig-ratios-partial.js`). One item
  (27) references a figure ("Fig. 9.19") that also isn't in this upload —
  flagged needs_review.
- **Trigonometric Identities** — 46 items, pp.10.6-10.9, COMPLETE, zero
  needs_review (see `ingest-cbse-maths-trig-identities.js`).
- **Heights and Distances** — 31 items (28 plain MCQs + 3 case studies:
  sky tower, helicopter/swimmer, TV tower), pp.11.10-11.15, COMPLETE. TWO
  confirmed genuine printed-key defects, corrected and flagged
  needs_review: item 5 (printed 30°, correct 60° — tan(θ)=6/(2√3)=√3) and
  case-study item 30(i) (printed "helicopter gets further from island",
  but the helicopter's altitude is fixed above the island per the figure,
  so only the swimmer's distance changes — corrected to "swimmer gets
  closer to the island"). See `ingest-cbse-maths-heights-distances.js`.
- **Areas Related to Circles** — DONE, 68/68 items (chapterId 79), see the
  founder target-counts table (chapter 12) above for the full account.
  Originally 37 items, pp.12.13-12.15, self-derived answers (no key ever
  captured in that partial source — see `ingest-cbse-maths-areas-circles-
  partial.js` for that original methodology note). ch12-13.pdf later
  supplied the complete 68-item chapter WITH its real printed answer key:
  cross-checking found and fixed one wrong self-derived answer (item 30)
  and resolved one previously-uncertain figure-dependent item (item 37,
  Fig. 12.23, whose page had been missing from the original partial
  source). Items 38-68 (31 items) were freshly transcribed, independently
  verified, and ingested — see `ingest-cbse-maths-areas-related-to-
  circles.js` for the full defect log (one genuine printed-key error,
  item 42, corrected). One confirmed "trick" item remains from the
  original 37 (item 32: segment ACB, correct answer is "none of these" —
  a well-known NCERT Exemplar item).

**Chapter-naming correction (founder-directed, important):** the founder
clarified this textbook's real chapter structure — "Trigonometric Ratios"
and "Trigonometric Identities" are BOTH part of one chapter, "Introduction
to Trigonometry", and "Heights and Distances" is titled "Application of
Trigonometry" in this book. Ran `fix-trig-chapter-names-2026-09-17.js`:
merged the 46 "Trigonometric Identities" questions into the (renamed)
"Introduction to Trigonometry" chapter (id 78, now 59 questions total:
13+46), and renamed "Heights and Distances" (id 77) to "Application of
Trigonometry" (31 questions, content unchanged). **If any further chapter
name looks off, ask/confirm rather than assume — this book's chapter
grouping does not always match the practice-exercise section headers.**

**New chapters ingested from chap_1-2.pdf** (source_files.id 118, archived
via `archive-cbse-maths-ch1-2.js`):
- **Real Numbers (Ch.1)** — 70 items + 4 case studies + 10
  assertion-reason, pp.1.10-1.16 (scan begins mid-chapter; anything before
  p.1.10 is not in this upload). COMPLETE within the captured range. **This
  chapter's printed answer key is noticeably less reliable than every
  other chapter processed this project** — SIX confirmed/flagged
  discrepancies (items 15, 16, 21, 23, 30 are clear arithmetic errors in
  the printed key, all corrected with disclosed reasoning; item 64 is a
  closer explanatory-logic call; item 32's independently-computed count
  doesn't match any of the four printed options at all and is flagged
  unresolved). See the file header of `ingest-cbse-maths-real-numbers.js`
  for the full disclosure — a human should spot check these against the
  original photographed pages.
- **Polynomials (Ch.2)** — 63 items + 7 case studies (all graph/figure
  based) + 8 assertion-reason, pp.2.19-2.28. COMPLETE within the captured
  range. This chapter's key looked reliable on spot-check (items 1-13
  independently re-derived and matched exactly), so the remaining items
  were transcribed against the printed key with spot-verification rather
  than a full from-scratch re-derivation of all 63 — see
  `ingest-cbse-maths-polynomials.js` for a couple of items (38, 47, 59, 60)
  where the arithmetic is flagged as worth a second look.

**Bank total after this session's ingestion: 4589 questions** (was 4259 at
the start of this continuation), needs_review = 29.

**UPDATE 2026-09-17 (later in session):** ch3-4.pdf has since been fully
transcribed (Pair of Linear Equations + Quadratic Equations, see the
target-counts section above). A 6th PDF, chap_14-15.pdf, also arrived.
Current backlog state:

| source_files.id | stable_id | Pages | Status |
|---|---|---|---|
| 119 | CBSE-MATH-CH3-4-COMBINED | 14 | DONE — Pair of Linear Equations + Quadratic Equations transcribed |
| 120 | CBSE-MATH-CH5-6-COMBINED | 22 | DONE — Arithmetic Progressions (68) + Co-ordinate Geometry (83) transcribed and ingested |
| 121 | CBSE-MATH-CH7-8-COMBINED | 22 | Triangles DONE (47 sourced from this file, pp.7.11-7.20). Circles half (pp.8.1-8.22) confirmed via direct page render to be the SAME textbook/same page numbering as the already-ingested 32-image-batch Circles content (chapterId 75, 70/70 items, zero defects, source_documents id 145) — re-transcribing this file's Circles pages would only reproduce content already fully captured, so no further ingestion needed for Circles; the founder's target (70) is already met. |
| 122 | CBSE-MATH-CH9-11-COMBINED | 19 | Real chapters CONFIRMED: Trig Ratios/Identities (merged) + Heights and Distances. Text extracted to scratchpad, not yet ingested. |
| 123 | CBSE-MATH-CH12-13-COMBINED | 18 | Archived only — content not yet read at all |
| 124 | CBSE-MATH-CH14-15-COMBINED | 16 | Archived only — content not yet read at all |

That's 97 pages across the 4 files not yet transcribed at all (120-124
have text extracted for 120/121/122 but not yet ingested; 123/124 not
even extracted yet). **Before transcribing any of them, open the pages
and confirm the REAL chapter
name(s) first** (per the founder's explicit reminder this session: "in
some books the chapters are shuffled so accordingly prepare it properly")
— do not trust the "chapter N-M" filename labels. Given this book already
turned out to group Trig Ratios+Identities as one chapter and rename
Heights & Distances, expect chap_9-11.pdf in particular to need the same
care (founder's own hint: it likely continues Introduction to Trigonometry
material and/or Application of Trigonometry, not literally "chapters
9, 10, 11").

## Founder-provided target question counts per chapter (2026-09-17)

The founder sent this message mid-session: **"these chap has this many
question 69,62,42,57,68,83,47,70,37,46,31,68,55,58,61 respectively maybe
more but not less so make sure you add all of the. i have also uploaded
the answer at the end of each chapter."** These are MINIMUMS from the
printed book's own answer-key numbering, in real book chapter order
(confirmed by directly reading each PDF's page headers rather than
trusting filenames or assuming NCERT order).

**RESOLVED (2026-09-18, per founder correction "there is nothing called
as construction in 10th cbse syllabus"):** this book has only 14 real
named chapters, not 15 — the founder's 15 target VALUES map to those 14
chapters with positions 9-11 all falling inside ONE real chapter,
"Introduction to Trigonometry" (which this book further splits into a
Trigonometric Ratios exercise set and a Trigonometric Identities exercise
set) plus "Application of Trigonometry" (Heights & Distances) immediately
after it. So: position 9 (37) = Trig Ratios, position 10 (46) = Trig
Identities (both sub-parts of chapterId 78, already 83/83 = 37+46 total),
and position 11 (31) = Heights & Distances (chapterId 77, already
31/31). There never was a "Constructions" chapter to find — that was
this session's own incorrect guess (based on an old pre-2023 NCERT
chapter order) about what a generic "position 11" ought to be called,
before the founder clarified the actual syllabus. All three of these
target values are now confirmed exactly met, with no remaining gap
anywhere in the founder's target list.

**Confirmed real chapter order for this book** (by reading page headers,
not by guessing from "chap_X-Y" filenames — those numbers DO happen to
match here, unlike the trig chapters' internal naming):

| # | Chapter (book's real name) | Target (min) | Source file | Status |
|---|---|---|---|---|
| 1 | Real Numbers | 69 | chap_1-2.pdf | DONE — 70 sourced (exceeds) |
| 2 | Polynomials | 62 | chap_1-2.pdf | DONE — 63 sourced (exceeds) |
| 3 | Pair of Linear Equations in Two Variables | 42 | chap_3-4.pdf | DONE — 42 sourced + 8 pre-existing = 50 (exceeds) |
| 4 | Quadratic Equations | 57 | chap_3-4.pdf | DONE — 57 sourced + 7 pre-existing = 64 (exceeds) |
| 5 | Arithmetic Progressions | 68 | chap_5-6.pdf (pp.5.11-5.21, confirmed via page headers, answer key ends at item 68 exactly) | DONE — 68 sourced (exact match), 1 printed-key defect corrected (item 50), 1 source-scan gap disclosed (case 55) |
| 6 | Co-ordinate Geometry | 83 | chap_5-6.pdf (pp.6.17-6.26, answer key ends at item 83 exactly) | DONE — 83 sourced (exact match), 2 figures (case studies 71, 73) fell back to printed key with disclosure (unreadable/unreliable grid coordinates) |
| 7 | Triangles | 47 | chap_7-8.pdf (pp.7.11-7.20, confirmed via page header "TRIANGLES") | DONE — 47 sourced (exact match) + 11 pre-existing = 58 total. 4 genuine printed-key/stem defects independently found and corrected (items 5, 9, 34, 46 — see ingest-cbse-maths-triangles.js header comment for full derivations); 1 figure (item 16) fell back to printed key with disclosure |
| 8 | Circles | 70 | chap_7-8.pdf pp.8.1-8.22 (confirmed via page header "CIRCLES") — but SAME content already ingested from the older 32-image batch (pp.8.13-8.22) | DONE (via prior source) — chapterId 75 has 70/70 sourced, verified, zero-defect items (source_documents id 145). Confirmed by rendering chap_7-8.pdf p.8.1 directly: identical book/page-numbering scheme, so this PDF's Circles half is a duplicate of already-ingested content — not re-transcribed to avoid pure duplicate effort |
| 9 | Introduction to Trigonometry — Trigonometric Ratios sub-part | 37 | ch9-11.pdf pp.9.10-9.15 | **DONE — 37/37 exact match** (13 pre-existing + 24 gap-filled via ingest-cbse-maths-trig-ratios-gap.js, zero defects). Part of chapterId 78 (this book merges Ratios+Identities into one named chapter; the founder's list counts them as two separate target values, both satisfied — see the RESOLVED note below the table). |
| 10 | Introduction to Trigonometry — Trigonometric Identities sub-part | 46 | ch9-11.pdf pp.10.6-10.9 | **DONE — 46/46 exact match**, already fully sourced/verified from an older batch (source_documents id 146); ch9-11.pdf confirmed as a verbatim duplicate, not re-ingested. Also part of chapterId 78 (83 total = 37+46). |
| 11 | Some Applications of Trigonometry (Heights and Distances) | 31 | ch9-11.pdf pp.11.10-11.14 ("HEIGHTS AND DISTANCES" header) | **DONE — 31/31 exact match.** chapterId 77 has all 31; this book's own printed answer key for this chapter ends at item 31, and that's exactly what the founder's list asks for at this position — see RESOLVED note below. |
| 12 | Areas Related to Circles | 68 | chap_12-13.pdf pp.12.13-12.20 (confirmed via page header "AREAS RELATED TO CIRCLES") | **DONE — chapterId 79 has 68/68 (exact match).** The pre-existing 37 self-derived-answer items (pp.12.13-12.15) turned out to be the SAME content as ch12-13.pdf's own opening, now cross-checked against this PDF's real printed answer key (p.12.20): 36 of 37 matched exactly; 1 defect found and corrected directly in the DB (item 30, Fig.12.19 — self-derived answer had doubled the true minor-segment area; corrected 50(π-2)→25(π-2)). A second previously-uncertain item (37, Fig.12.23, previously needs_review/needs_visual_review due to a missing page in the old partial source) was also resolved and upgraded to verified now that the figure is available. The new items 38-68 (31 items: plain MCQs 38-55, case studies 56-59, assertion-reason 60-68) were transcribed and ingested fresh — see ingest-cbse-maths-areas-related-to-circles.js. One genuine printed-key defect found and corrected: item 42 (major segment of a 90°-chord circle) — printed key gives the major SECTOR (1848cm², 3/4 of the circle) instead of the true major SEGMENT (2240cm²); corrected to 2240cm², flagged needs_review. All other 30 new items (case studies and assertion-reason included) matched the printed key exactly on independent computation. |
| 13 | Surface Areas and Volumes | 55 | Already fully sourced from an older photographed-page batch (source_documents id 103, pp.13.15-13.22, real printed answer key, independently verified) — NOT chap_12-13.pdf | **CONFIRMED DONE — chapterId 35 has 55/55 (exact match), already fully sourced and verified.** Per standing rule #3 (never re-ingest a COMPLETE chapter without a specific found problem), left untouched — re-transcribing from chap_12-13.pdf would only duplicate already-good content. |
| 14 | Statistics | 58 | ch14-15.pdf pp.14.15-14.22 (confirmed via page header "STATISTICS") | **DONE — chapterId 34 has 58/58 (exact match).** The pre-existing 53 items (source_documents id 102) were already fully sourced/verified from an earlier photographed-page batch whose own label had explicitly disclosed a known 5-item gap: "Item 3 and items 55-58 (Assertion-Reason) deliberately excluded this pass". ch14-15.pdf supplied exactly those 5 missing items (1 plain MCQ + 4 assertion-reason), independently verified with zero defects — see ingest-cbse-maths-statistics-gap.js. Note: the exercise section of ch14-15.pdf has an apparent printer duplication (both the "100m race" case study AND the first assertion-reason item are numbered "55."); the answer key's own numbering (used here) is unambiguous and was followed. |
| 15 | Probability | 61 | Already fully sourced from an older photographed-page batch (source_documents id 101, pp.15.19-15.24, real printed answer key, independently verified) | **CONFIRMED DONE — chapterId 33 has 61/61 (exact match), already fully sourced and verified.** Per standing rule #3, left untouched — no re-ingestion needed. |

**Important discovery from opening chap_7-8.pdf and chap_9-11.pdf's page
headers just now (text-layer extraction via pypdf, not manual image
reading — this book's PDFs have a text layer, which is much faster than
reading page images one at a time, though the extracted text is messy/
reordered in places and every number must still be independently
re-verified before trusting it):**
- chap_5-6.pdf = Arithmetic Progressions (ch.5) + Co-ordinate Geometry (ch.6) — filenames were NOT shuffled for this file, chapters 5 and 6 really are AP and Coordinate Geometry in that order.
- chap_7-8.pdf = Triangles (ch.7) + Circles (ch.8).
- chap_9-11.pdf = Trigonometric Ratios/Identities practice (one merged chapter per founder's correction) + Heights and Distances. Only 2 real output chapters despite the "9-11" filename span.
- chap_12-13.pdf and chap_14-15.pdf: NOT YET opened at all. Given the pattern so far (each file = exactly 2 real chapters, except ch9-11 which is anomalous), these two files likely cover the remaining 4 chapters: Constructions, Areas Related to Circles (tail), Surface Areas and Volumes, Statistics, Probability — but this must be CONFIRMED by reading actual page headers, not assumed.

**Extraction method note for future sessions:** these combined chapter
PDFs (chap_1-2.pdf through chap_14-15.pdf) have a real text layer —
`pypdf.PdfReader(...).pages[i].extract_text()` returns usable (if messy —
words run together, minor OCR-like artifacts, column order sometimes
scrambled) text for every page almost instantly, unlike the earlier
32-image batch which required reading page images one at a time via the
Read tool. This is much faster for a first pass, but every single
question's text/options/answer must still be independently verified
against the answer key and by direct computation before ingesting —
never trust the extracted text blindly, since it does contain OCR-style
corruptions (e.g. "isthe" run together, garbled fraction/exponent
formatting, occasional digit swaps).

## Standing rules for any future session/agent on this project

1. This is a continuing project. A session/usage limit interruption is not
   a stopping point — resume from verified DB state, don't restart.
2. Before claiming anything is done, query the live DB directly. Don't
   trust a sub-agent's own summary numbers without spot-checking — this
   file's Chapter 7 needs_review correction (agent said 0, DB said 6) is a
   real example of why.
3. Never re-ingest a chapter/source marked COMPLETE unless a fresh audit
   finds and names a specific problem.
4. Duplicate/near-duplicate flags are about QUESTIONS, not source files.
   The founder has not uploaded the same PDF twice — a duplicate flag means
   two questions look similar (genuinely, or as a detector false positive),
   never that a file was uploaded twice. Never delete or overwrite content
   based solely on a duplicate flag; always preserve provenance for both.
5. Capture first, decide later — for any subject, preserve every source
   question in its native format (extending `kind`/`question_format`
   further if a genuinely new shape appears), never force non-MCQ content
   into an MCQ shape, never invent an answer or option the source didn't
   provide. `answer_status` and `status` are independent axes.
6. Keep updating this file as chapters/sections move to COMPLETE.
7. Diagram/visual preservation is a hard requirement, not optional polish
   (see "CRITICAL — visual/diagram preservation" section above). Every new
   ingestion script must set `diagramStatus` (+ `visuals` when the source
   has a figure) per item — never leave it to default silently. A question
   with a needed diagram missing is NOT complete, even if its text and
   answer are perfect.
