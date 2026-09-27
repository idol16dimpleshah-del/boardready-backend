# Workstream 3C — Visual Candidate Qualification

**Status: read-only investigation, complete.** No write of any kind was made
to the live database, no source file was modified, and no question's
`status`, `answer_status`, or `diagram_status` was changed. No `visual_assets`
row was created or associated. This document is the qualification-only
deliverable requested before any cross-type visual pilot begins.

**Live database SHA-256 before this workstream:**
`4014833a08c1350606eb4ec64f2ada674a11318ca3bc8aed95acbe340176efd4`
**Live database SHA-256 after this workstream:**
`4014833a08c1350606eb4ec64f2ada674a11318ca3bc8aed95acbe340176efd4`
**Identical — confirmed via `sha256sum boardready.db`.** `git status --short
source_library/` is also clean (no diff) at both ends of this workstream.

All queries below were run through `node:sqlite`'s `DatabaseSync` opened with
`{ readOnly: true }`, and all PDF inspection used `pymupdf` opened read-only
against files under `source_library/` — never written to.

## 1. Methodology

Extending the Workstream 3A/3B source-tracing discipline: for every
candidate, (a) confirm its exact source PDF and page from
`source_documents`/`source_document_files`/`source_files`, (b) locate that
page by searching the PDF's extracted text for the question's exact wording
or item number, (c) render the page to an image and visually confirm a real
diagram/photograph exists there (not inferred from text alone), (d) classify
into exactly one of **redraw/adapt**, **source_preserve**, **not_applicable**,
or **needs_review**, and (e) for redraw/adapt candidates, record the precise
semantic elements a native recreation would have to preserve.

## 2. False positives separated from genuine visual requirements

Before qualifying real candidates, two chapters flagged `needs_visual_review`
were checked and found to be **false positives — no visual is actually
required**:

- **"Reflection" chapter (ICSE Mathematics), 60 items, all flagged
  `needs_visual_review`.** Full-text review of every item shows these are
  pure coordinate-geometry text questions ("Find the image of point
  (3, -4) under reflection in the x-axis", etc.) with zero diagram
  references. Classification: **not_applicable** — the flag should never
  have been set for this chapter. No diagram is needed for any item here.
- **"Locus and Construction" (ICSE Mathematics), items 1198–1229 (32 rows),
  flagged `needs_visual_review`.** These are pure definitional/procedural
  text items ("State the locus of a point equidistant from two fixed
  points", etc.) with no figure referenced. Classification:
  **not_applicable**. (Later items in the same chapter, from the Assertion &
  Reasoning section, are genuine — see id=1230 below — so the whole chapter
  should not be bulk-classified either way.)

This confirms the concern raised going into this workstream:
`needs_visual_review` has been acting as "this probably has a diagram" rather
than a verified flag, in both directions — it both over-flags (these 92 rows)
and, as Workstream 3B found for 3070, previously under-described what a
verified visual actually is.

## 3. Genuine candidates traced and classified

### 3.1 Number line — id 3070 (already proven, Workstream 3B)

Included here only for completeness of the shortlist format, since it is the
existing proof case, not new work in this workstream.

| | |
|---|---|
| Question | 3070 (`icse-mathematics-linear-inequation-ace0c077`) |
| Subject / type | ICSE Mathematics — Linear Inequation |
| Source / page | `chap_...` (Linear Inequation), source_page 4.8, item 57 |
| Visual actually exists? | Yes |
| Visual type | Number line |
| Recommended treatment | Adapted SVG (already built, QA'd, and live) |
| Content QA status | `verified`, `diagram_status = adapted_verified` |

### 3.2 Geometry (circle) — id 1594

- **Source:** `source_library/ICSE/Mathematics/chap_17.pdf`, page footer
  **17.4** (matches `questions.source_page = "17.4"`), item **(22)**, chapter
  "Angle and Cyclic Properties of Circle."
- **Located by:** searching the PDF's extracted text for `(22)` combined with
  the question's exact wording; found on page index 2 of the PDF, footer
  label "17.4" confirmed by rendering the page to `/tmp/3c-pages/chap17_page_idx2.png`
  (scratch image, not committed).
- **Visual confirmed:** Yes — a genuine circle diagram: circle with diameter
  AB, centre O marked, points D (upper-left) and C (upper-right) on the arc,
  DC drawn parallel to AB (both segments carry matching arrow "»" tick marks
  for the parallel relation), a dashed chord from A to C, and the angle
  ∠CAB = 35° marked at vertex A. This is the figure item (22) explicitly
  refers to ("In the diagram, AB is a diameter of the circle...").
- **Classification: redraw/adapt.** A clean vector circle diagram, exactly
  the same genre already proven servable for 3070.
- **What must be preserved in any recreation:** the circle and its diameter
  AB with centre O marked; points D and C positioned on the arc above AB
  (D left of centre, C right of centre); the segment DC drawn parallel to AB
  (shown via matching arrowhead tick marks on AB and DC, not just visually
  parallel); the dashed diagonal chord AC; the 35° angle marked at vertex A
  between AB and AC; no other angle values printed in the figure itself (the
  20° answer is derived, not labelled).
- **Content QA status:** `status = transcribed`, `answer_status =
  source_provided` — **not yet gradable**. This question has not been through
  a Workstream-3A-style content correctness pass; it qualifies only as a
  *visual* candidate. It should not be treated as ready for a visual pilot
  until (or unless) its content is separately verified.

### 3.3 Construction / figure — id 1230

- **Source:** `source_library/ICSE/Mathematics/chap_19.pdf`, page footer
  **19.6** (matches `questions.source_page = "19.6"`), item **(33)**, chapter
  "Locus and Construction," Assertion & Reasoning section.
- **Located by:** text search for `(33)`; found on page index 4, footer
  "19.6" confirmed by rendering to `/tmp/3c-pages/chap19_page_idx4.png`.
- **Visual confirmed:** Yes — a genuine triangle figure: triangle ABC (A at
  apex, B and C at the base), D marked as the midpoint of BC (equal tick
  marks on BD and DC), segment AD drawn with a right-angle mark at D (AD ⊥
  BC), and point E marked on AD between A and D. This matches the assertion
  text exactly ("D is the mid-point of BC and AD ⊥ BC. If E lies on AD...").
- **Classification: redraw/adapt.** A simple, precisely-specifiable
  construction/assertion figure.
- **What must be preserved in any recreation:** triangle ABC with D on BC
  marked as the midpoint via equal tick marks on BD and DC; segment AD drawn
  from apex A to D with an explicit right-angle mark at D; point E placed on
  segment AD strictly between A and D (its exact fractional position along
  AD is not asserted by the question and is not evaluated, so any reasonable
  placement between A and D is faithful).
- **Content QA status:** `status = transcribed`, `answer_status =
  source_provided` — **not yet gradable**, same caveat as 1594.

### 3.4 Graph — id 4575 (backups: 4531, 4583, 4584)

- **Source:** `source_library/CBSE/Mathematics/ch1-2.pdf`, page footer
  **2.22** (matches `questions.source_page = "2.22"`), item **45**, chapter
  "Polynomials."
- **Located by:** text search for `Fig.2.19` / "zeroes ... from the graph";
  found on page index 10, footer "2.22" confirmed by rendering to
  `/tmp/3c-pages/ch1-2_page_idx10.png`. (Note: PDF text order does not track
  1:1 with the printed page sequence in this file — page index 9 is printed
  page 2.21, index 10 is 2.22 — confirmed by rendering both, not assumed.)
- **Visual confirmed:** Yes — "Fig. 2.19": labelled coordinate axes (x, x′,
  y, y′), a downward-curving parabola crossing the x-axis at two distinct
  points on the positive side, labelled `y = p(x)`, caption "Fig. 2.19"
  beneath. This is exactly the graph item 45 refers to.
- **Classification: redraw/adapt.** A precise, mathematically-defined
  function graph — an ideal case for clean vector reconstruction (unlike a
  photograph, its "correct" shape is fully determined by the answer: the
  curve must cross the x-axis at exactly 2 points, per the answer key).
- **What must be preserved in any recreation:** coordinate axes labelled x,
  x′, y, y′; a single smooth curve, open (unbounded) at both ends, dipping
  from upper-left, crossing the x-axis, rising to a local maximum that stays
  below or at the x-axis region shown, then descending and crossing the
  x-axis a second time before continuing down at lower-right — i.e. exactly
  2 x-axis crossings, matching answer (c) 2; the curve labelled `y = p(x)`
  near its lower-right end; caption "Fig. 2.19" below the plot.
- **Content QA status:** `status = transcribed`, `answer_status = verified`,
  `diagram_status = source_diagram_preserved` (a whole-page-photo provenance
  row already exists, `visual_assets.id = 105`, but no cropped or generated
  asset). This is the **most QA-advanced of the new Math candidates** —
  its answer is already verified, only the visual is outstanding.
- **Backups in the same well-provenanced source, same genre** (graph /
  number-of-zeroes-from-graph questions), for use if 4575 turns out
  unsuitable during the pilot: ids **4531, 4583, 4584** — all `answer_status
  = verified`, `diagram_status = source_diagram_preserved`, same PDF.

### 3.5 Chemistry (apparatus diagram) — id 819 (backups: 807, 816, 833, 835, 843)

- **Source:** `source_library/ICSE/Chemistry/chap_7B.pdf`, page footer **72**
  (matches `questions.source_page = "72"`), item **3, part i)**, chapter
  "Study of Compounds."
- **Located by:** text search for "Haber"; found on page index 2, footer
  "72" confirmed by rendering to `/tmp/3c-pages/chap7B_page_idx2.png`.
- **Visual confirmed:** Yes — a complete, clearly labelled apparatus
  schematic titled "Manufacture of ammonia by Haber's process": compression
  pump with H₂ [3 vols.] and N₂ [1 vol.] inlets, an electrically heated
  catalyst chamber containing the iron catalyst, a heat exchanger, a
  recirculating compression pump, a cooling coil, a separation vessel
  labelled "Liquid ammonia [NH₃]" with an outlet, and a labelled recycle loop
  for uncombined N₂ and H₂ back into the heat exchanger. This is a
  standardised, widely-reproduced textbook diagram (same figure appears
  near-identically across ICSE chemistry textbooks), which makes it
  unusually well-suited to precise reconstruction — there is a canonical
  "correct" version to check against, unlike a novel or ambiguous figure.
- **Classification: redraw/adapt.** A schematic, not a photograph — nothing
  about it is evidentiary in the way a portrait or an actual lab photo would
  be; every element is a standardized symbol/label pair.
- **What must be preserved in any recreation:** the exact component set and
  their labels (Compression pump; H₂ [3 vols.] and N₂ [1 vol.] inlets; Iron
  catalyst; Electrically heated catalyst chamber; Heat exchanger;
  Recirculating compression pump; Cooling coil; Uncombined N₂ and H₂
  recycle path; Liquid ammonia [NH₃] vessel; Outlet); the gas-flow direction
  arrows exactly as shown (fresh feed in at bottom-left through the
  compression pump into the catalyst chamber; hot product gas out through
  the heat exchanger into the cooling coil; liquid ammonia drawn off at the
  bottom of the separator; uncombined gas recycled back through the heat
  exchanger to the recirculating pump and back into the feed stream); the
  overall left-to-right process flow layout.
- **Content QA status:** `status = transcribed`, `answer_status =
  unavailable` (this is a fill-in/completion item — "substitute the correct
  symbols for X and Y" — not a single-letter MCQ, so the existing
  answer-key pipeline records it as `unavailable` rather than
  incorrect/missing). **Not yet gradable** in the current answer-key
  pipeline sense; this is a content-QA question separate from the visual
  question, and should be resolved before this specific id is used in a
  pilot, though the diagram itself is fully confirmed and reconstructable
  independent of that.
- **Backups in the same source, same apparatus-diagram genre:** ids **807,
  816, 833, 835, 843** — all `Study of Compounds`, all currently
  `needs_visual_review` with no visual_assets row; not individually
  traced to a page in this pass, listed here only as same-chapter fallback
  candidates if 819's answer-key gap needs to be worked around first.

### 3.6 History — photograph, source_preserve example — id 3477 (and id 3502)

- **Source (3477):** `source_library/ICSE/History and Civics/ch07-first-war-of-independence-1857.pdf`,
  page footer **163** (matches `questions.source_page = "163"`), item **19**,
  chapter "First War of Independence: 1857."
- **Located by:** text search for "Identify the personality"; found on page
  index 3, footer "163" confirmed by rendering to
  `/tmp/3c-pages/ch07_page_idx3.png`.
- **Visual confirmed:** Yes — a genuine portrait (painting/engraving-style
  reproduction) of a named historical figure, captioned in the answer key as
  Lord Wellesley. This is a real depiction of a real person, not a diagram.
- **Classification: source_preserve.** Recreating a person's portrait as a
  "clean redraw" would change the evidentiary content itself (a stylised
  redraw of a real person's likeness is not the same evidence, and risks
  misrepresentation) — this is exactly the case the source_preserve category
  exists for. The correct treatment is to preserve and serve the original
  source crop, not to generate an alternate image.
- **What must be preserved:** the image itself, unmodified — provenance/
  crop only, no redraw.
- **Content QA status:** `status = verified`, `answer_status = verified`,
  `diagram_status = source_diagram_preserved` — **already fully gradable**,
  and the diagram_status already correctly reflects "original preserved for
  provenance" rather than falsely implying a generated visual exists.
- **Sibling example, same treatment:** id **3502** (A.O. Hume portrait,
  `ch08-rise-of-nationalism-and-establishment-of-inc.pdf`, page footer 168,
  item 15) — confirmed by exact text match to the same page/item; same
  `verified`/`source_diagram_preserved` status. Included to show the
  source_preserve treatment is not a one-off but a recurring, already-correct
  pattern in the History content.

## 4. Shortlist

| Question | Subject / type | Source / page | Visual actually exists? | Visual type | Recommended treatment | Content QA status |
|---|---|---|---|---|---|---|
| 3070 | ICSE Maths — Linear Inequation | chap (Linear Inequation), p.4.8, item 57 | Yes | Number line | Adapted SVG (done, live) | verified — `adapted_verified` |
| 1594 | ICSE Maths — Angle & Cyclic Properties of Circle | chap_17.pdf, p.17.4, item 22 | Yes | Circle/angle diagram | Adapted SVG (candidate) | **not yet gradable** — transcribed, answer source_provided |
| 1230 | ICSE Maths — Locus and Construction | chap_19.pdf, p.19.6, item 33 | Yes | Construction/assertion figure | Adapted SVG (candidate) | **not yet gradable** — transcribed, answer source_provided |
| 4575 | CBSE Maths — Polynomials | ch1-2.pdf, p.2.22, item 45 | Yes | Function graph | Adapted SVG (candidate) | answer **verified**; visual outstanding |
| 819 | ICSE Chemistry — Study of Compounds | chap_7B.pdf, p.72, item 3.i | Yes | Lab apparatus diagram | Adapted SVG (candidate) | transcribed; answer_status **unavailable** (fill-in item) |
| 3477 | ICSE History & Civics — First War of Independence: 1857 | ch07...1857.pdf, p.163, item 19 | Yes | Photograph (portrait) | Source-preserve (already correct) | **verified**, gradable |
| 3502 | ICSE History & Civics — Rise of Nationalism... | ch08...inc.pdf, p.168, item 15 | Yes | Photograph (portrait) | Source-preserve (already correct) | **verified**, gradable |

Backups on file for two categories, same source documents, not individually
page-traced in this pass: **Graph** — 4531, 4583, 4584 (all answer-verified);
**Chemistry apparatus** — 807, 816, 833, 835, 843 (same answer-key-gap
caveat as 819).

Also documented, explicitly separated out as **not genuine candidates**
(false `needs_visual_review` flags, `not_applicable`): the entire
"Reflection" chapter (60 items) and ICSE Locus and Construction ids
1198–1229 (32 items).

## 5. What this means for the next step

Of the five new candidates, **only id 4575 (Graph)** has a fully verified
answer key today — the others (1594, 1230, 819) are genuine, confirmed
visual candidates whose diagrams are ready to reconstruct, but whose
question content has not yet been through a Workstream-3A-style correctness
pass (1594, 1230) or has an answer-key format gap that needs a product
decision (819's fill-in-the-blank scoring). The two History photographs
(3477, 3502) are already fully gradable and already correctly flagged
`source_diagram_preserved` — they need no further QA to serve as the
source_preserve example in a pilot, only a decision on how photograph-type
visuals should actually render in the UI (not yet built).

This means a genuinely representative cross-type pilot, per your closing
instruction ("choose one candidate from each genuinely different visual
class and prove the reconstruction rules before scaling"), has two honest
paths: (a) pick 3070 + 4575 + one of {3477, 3502} as the pilot set, since
those three are the only ones with verified content today, accepting that it
skips Geometry/Construction/Chemistry for this first pilot round; or (b) run
the reconstruction-rules pilot on all five new candidates' *diagrams* purely
as a rendering/reconstruction exercise (never touching the live DB or
promoting any status), while content QA on 1594/1230/819 proceeds separately
and in parallel. Both paths are compatible with everything documented here;
which one to take is a product decision, not something this workstream
should decide unilaterally.

## 6. What was deliberately NOT done

- No live database write of any kind — not even a guarded one. Every check
  above used a read-only `DatabaseSync` connection.
- No source PDF was modified. `git status --short source_library/` is clean
  before and after.
- No `visual_assets` row was created or associated for any of the new
  candidates.
- No question's `status`, `answer_status`, or `diagram_status` was changed.
- No final/production student-facing visual (SVG or otherwise) was generated
  for any new candidate — only the existing source pages were rendered to
  disposable scratch images (`/tmp/3c-pages/`, not committed, not referenced
  by any code) purely to visually confirm each diagram's existence and
  content for this report.
- The content-correctness issues surfaced for 1594, 1230, and 819 (not yet
  gradable, or answer-key format gap) were **not corrected** — they are
  reported, not fixed, consistent with this workstream being qualification
  only.
