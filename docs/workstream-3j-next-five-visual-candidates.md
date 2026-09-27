# Next Five Production-Ready Visual Candidates (Workstream 3J, Task 5 of batch)

**Status: fully read-only.** No database write, no `source_library/` modification,
no `visual_assets` change, no `diagram_status` change. This is a candidate
*identification* pass, not a build pass (contrast Task 4, which built and
browser-tested two proposed SVGs for 1594/1230).

## Method

`diagram_status='needs_visual_review'` is not trustworthy on its own (2,681
rows carry it, including chapters like Probability, Matrices, and Arithmetic
Progression that plainly don't need a picture — a pre-existing keyword-based
flag, not a content judgment). For each of the five target visual classes,
candidates were located by searching question text within relevant chapters
for figure-referencing language ("in the given/adjoining figure", "as shown
in Fig.", "diagram", "construct"), then every shortlisted candidate was
traced to its actual rendered source page and cross-checked against the
question's `source_document_id` before being accepted. Two candidates that
looked plausible from text alone were independently re-derived against the
source figure to confirm the recorded `correct` value; the other candidates
were spot-checked against the printed source only, per Task 5's read-only,
identification-stage scope (this is lighter-touch than Tasks 1–3's full
promotion-grade proofs, and is disclosed as such below).

## Candidate 1 — Geometry: Basic Proportionality Theorem triangle

- **Question UID:** `icse-mathematics-similarity-of-triangles-2169d114` (id 1508)
- **Subject/chapter:** ICSE Mathematics — Similarity of Triangles
- **Source document/page:** `source_library/ICSE/Mathematics/chap_16.pdf`, printed page 16.5, item (23) — confirmed by direct render.
- **Current `status` / `answer_status`:** `transcribed` / `source_provided`
- **Answer independently verified?** Yes, in this pass. "DE ∥ BC, AD:DB = 3:1, EA = 3.3 cm, find AC" — by the Basic Proportionality Theorem, AD/DB = AE/EC ⇒ EC = 3.3/3 = 1.1 cm ⇒ AC = AE + EC = 3.3 + 1.1 = **4.4 cm**, matching the DB's stored option index 2 ("4.4 cm") exactly.
- **Visual exists?** No (`diagram_status='needs_visual_review'`, no `visual_assets` row).
- **Visual type:** Triangle with D on AB, E on AC, DE ∥ BC (parallel tick marks), matching the exact figure in the source (confirmed by direct page render).
- **ADAPTED vs SOURCE-PRESERVE:** ADAPTED — a clean native-SVG redraw is straightforward and matches the established 1230-style pattern (simple triangle, tick marks, two labelled points on two sides).
- **Safe for production?** Yes, pending the same build → browser-test → separate-association discipline used for 1594/1230. No blocking issue found.

## Candidate 2 — Construction: angle bisector equidistance

- **Question UID:** `icse-mathematics-locus-and-construction-4078b869` (id 1231)
- **Subject/chapter:** ICSE Mathematics — Locus and Construction
- **Source document/page:** `source_library/ICSE/Mathematics/chap_19.pdf`, printed page 19.6, item (34) — the same page as 1230 (item 33), confirmed by direct render.
- **Current `status` / `answer_status`:** `transcribed` / `source_provided`
- **Answer independently verified?** Yes. Assertion: "∠ABD = ∠CBD (BD bisects ∠ABC); E on ray BA with ED⊥BA, F on ray BC with DF⊥BC; then DE=DF" — true, by AAS congruence of △BED and △BFD (BD common, ∠DBE=∠DBF given, ∠BED=∠BFD=90°). Reason: "every point on the angle bisector of two intersecting lines is equidistant from the lines" — the correct general theorem and a valid explanation of the assertion. So "Both A and R are true" is correct, matching the DB's stored option index 2.
- **Visual exists?** No.
- **Visual type:** Two rays from B (to A, to C) with the bisector ray BD between them, E the foot of the perpendicular from D onto ray BA, F the foot of the perpendicular from D onto ray BC, right-angle mark at F — confirmed against the source figure, which uses this exact layout (not the DE⊥BA/DF⊥BC-only description in the DB `text`, which paraphrases but doesn't contradict what's drawn).
- **ADAPTED vs SOURCE-PRESERVE:** ADAPTED. Distinct visual class from 1230's perpendicular-bisector-of-a-side figure (this one is a two-ray angle-bisector-with-perpendiculars construction), so building it does not duplicate 1230's diagram despite being the same chapter and source page.
- **Safe for production?** Yes. No blocking issue found.

## Candidate 3 — Graph/coordinate-plane: courtyard case study

- **Question UID:** `cbse-mathematics-co-ordinate-geometry-845687ea` (id 4833)
- **Subject/chapter:** CBSE Mathematics — Co-ordinate Geometry (case-study, 5 sub-parts)
- **Source document/page:** `source_library/CBSE/Mathematics/ch5-6.pdf`, printed page 6.23, item 73, Fig. 6.19 — confirmed by direct render and a pixel-level reconstruction of the grid (gridline spacing measured programmatically and cross-checked against three independent sub-answers).
- **Current `status` / `answer_status`:** `transcribed` / **`needs_review` — not yet verified.** This is the one candidate in this batch whose answer has explicitly not passed the project's verification step, and it should not be treated as safe for production language until that is resolved.
- **Visual exists? — important finding:** **Yes, partially**, and this exposes a metadata inconsistency worth fixing separately from any visual-build work: `visual_assets` id 130 already associates this question with `asset_type='source_page_full'` (the whole PDF page as one image), yet `questions.diagram_status` is still `needs_visual_review`, not `source_diagram_preserved`. The question is not actually visual-less; it is under-labelled. Flagging this rather than treating it as a from-scratch build.
- **Independent re-derivation of the plotted points (read-only, this pass):** rendered Fig. 6.19 at high resolution and located the four point-markers by pixel analysis of the grid lines (measured column/row spacing programmatically, then matched each marker's pixel position to the nearest gridline intersection): **A=(3,4), B=(6,7), C=(9,4), D=(7,2)**. This matches part (iv)'s stored answer (area of △ABC = 9 sq. units — recomputes exactly via the shoelace formula) and part (ii)'s ("ABCD is not a ___" → not a parallelogram, since AB∥CD by slope but |AB|≠|CD|, so it also can't be a rhombus/square — "parallelogram" is the most general correct choice, matching the DB).
- **Two things that do NOT check out, found in this pass — reported, not corrected (no DB write):**
  - Part (i) "coordinates of point A" — DB stores `correct: 0` → option "(4, 3)". My independently reconstructed point is **(3, 4)** → option index 1, not 0. This looks like a genuine defect in this specific sub-part's stored index, in the same family as the 4575/Task-3 findings (right general answer-key idea, wrong stored index), but on a still-unpromoted, `needs_review` row this time rather than a `verified` one.
  - Part (iii) "distance between the mid-points of AC and BD" — using the same reconstructed points, midpoint(AC)=(6,4), midpoint(BD)=(6.5,4.5), Euclidean distance = √0.5 ≈ 0.71, which does not cleanly match any of the given integer options ("2","3","0","1"; DB currently stores index 2 → "0"). This does not resolve under a plain reading and needs the actual official answer key (not available in `source_library` for this competency/case-study set) before anyone treats it as settled.
- **Visual type:** 10×10 coordinate grid with four labelled points and a shaded-square background pattern (decorative, not load-bearing).
- **ADAPTED vs SOURCE-PRESERVE:** Currently SOURCE-PRESERVE only (full page, unlabelled as such). An ADAPTED clean redraw (grid + 4 points, dropping the decorative face icons and the other sub-questions' text that the full-page crop currently drags along) would be a real quality improvement, but is optional, not urgent.
- **Safe for production?** **Not yet.** Blocking issues: (1) `answer_status='needs_review'`, i.e., not independently verified by this project; (2) a likely wrong stored index on part (i); (3) an unresolved part (iii); (4) the `diagram_status` metadata undercounts an asset that already exists. None of these were touched — reported only, per the task's explicit "no DB writes" instruction.

## Candidate 4 — Chemistry apparatus: electrolysis of molten lead bromide

- **Question UID:** `icse-chemistry-electrolysis-c018bc46` (id 2061)
- **Subject/chapter:** ICSE Chemistry — Electrolysis
- **Source document/page:** `source_library/ICSE/Chemistry/competency.pdf`, page index 8 (printed page 186), MCQ item 3 — confirmed by direct render; answer confirmed against `source_library/ICSE/Chemistry/competency_answer.pdf` page index 0 ("CHAPTER 5. - ELECTROLYSIS ... MCQ's — ... 3. (a) ...").
- **Current `status` / `answer_status`:** `transcribed` / `source_provided`
- **Answer independently verified?** Cross-checked against the printed answer key in this pass: the key gives "(a)" for item 3, matching the DB's stored `answer_key_ref` ("competency_answer.pdf Ch5 MCQ 3.(a)") and the DB's stored `correct` value. Plausibility check: option (a) claims oxidation at an electrode is characterised by electrons *entering* the electrolyte, which is backwards (oxidation is loss of electrons *to* the electrode) — consistent with (a) being the flagged "incorrect statement".
- **Structural defect found, unrelated to the visual, reported not fixed:** `questions.correct` is stored as the literal string `"(a)"`, not a 0-based integer index — inconsistent with the project's documented convention (`correct` is a plain 0-based array index, per `scoring.js`). If graded as-is, indexing `options_json` with the string `"(a)"` would not resolve to the first option the way an integer `0` would. This looks like an ingestion artifact specific to `source_document_id=60` ("competency.pdf") — worth a targeted structural-completeness check across that whole source document before anything from it is promoted, but that is outside this task's read-only scope and is only flagged here.
- **Visual exists?** No.
- **Visual type:** Electrolytic-cell apparatus diagram — battery, ammeter, two labelled graphite electrodes (X, Y) dipped into a crucible of molten lead bromide, heated from below. Necessary to answer the question: two of the four options refer to specific electrode labels "X" and "Y", which only the diagram defines.
- **ADAPTED vs SOURCE-PRESERVE:** ADAPTED is achievable (simple schematic: cell, two electrodes, crucible, heat source, standard circuit symbols) and would read far more cleanly than a scanned crop of this fairly small textbook figure.
- **Safe for production?** Answer content is safe (cross-verified against the printed key). The `correct` field's non-numeric format is a blocking issue for gradability that should be fixed by its own guarded correction record before this question is promoted or graded — not something to bundle into a visual-association change.

## Candidate 5 — Another visual class: mensuration / 3-D solid (two cylinders from one rectangle)

- **Question UID:** `icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6` (id 1727)
- **Subject/chapter:** ICSE Mathematics — Volume and Surface Area of Solid
- **Source document/page:** `source_library/ICSE/Mathematics/chap_20.pdf`, printed page 20.5, item (21) — confirmed by direct render.
- **Current `status` / `answer_status`:** `transcribed` / `source_provided`
- **Answer independently verified?** Yes. Rotating an 11×7 rectangle about its 11 cm side gives a cylinder with height 11, radius 7 → CSA = 2π(7)(11) = 154π. Rotating about the 7 cm side gives height 7, radius 11 → CSA = 2π(11)(7) = 154π. Ratio = **1:1**, matching the DB's stored option index 0 exactly.
- **Visual exists?** No.
- **Visual type:** A flat rectangle (11 cm × 7 cm) alongside two cylinders, one formed by rotation about each side — this is a genuinely different visual class from the rest of this batch (3-D solid/mensuration illustration rather than 2-D plane geometry or an apparatus schematic), matching the source figure's own three-panel layout (rectangle → cylinder → cylinder).
- **ADAPTED vs SOURCE-PRESERVE:** ADAPTED — three simple native-SVG shapes (a rectangle plus two cylinder outlines, labelled with the given dimensions) reproduce the source's meaning exactly without needing to preserve any hand-drawn imprecision.
- **Safe for production?** Yes. No blocking issue found.

## What was deliberately NOT done

- No `visual_assets` row was created or altered for any of the five candidates (including correcting candidate 3's `diagram_status`/label mismatch, which is flagged, not fixed).
- No `status`, `answer_status`, or `correct` value was changed for any candidate, including the two defects surfaced above (4833 part (i)'s index, and 2061's non-numeric `correct` format) — both are reported only, exactly as Task 3's methodology-audit findings were reported without correction.
- No SVGs were built for any of these five candidates. That is deliberately left for a future, explicitly-approved workstream mirroring Task 4's build → browser-test → propose-association pattern, most straightforwardly for candidates 1, 2, and 5, whose answers are independently verified and which carry no other blocking issue.
- `source_library/` was only read from, never modified.
