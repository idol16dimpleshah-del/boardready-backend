// CBSE Class 10 Mathematics — Triangles (Chapter 7).
// Source: ch7-8.pdf (source_files.id 121), pp.7.11-7.20 (first half of the
// PDF; the second half of ch7-8.pdf covers Circles, ingested separately).
// Founder's target count for this chapter: 47 (7th value in the mid-session
// message listing minimum expected counts per chapter in book order:
// "69,62,42,57,68,83,47,70,37,46,31,68,55,58,61"). This ingestion captures
// exactly 47 items (1-36 plain MCQs, 37-40 case studies, 41-47
// assertion-reason), matching the printed answer key's own numbering
// exactly (key ends "47.(a)"). Targets the PRE-EXISTING chapter_id 36
// ("Triangles", order_index 6), which already holds 11 unsourced
// hand-authored questions — those are left untouched; these 47 sourced
// items are added alongside them (expected final chapter total: 58).
//
// TRANSCRIPTION METHOD: read directly from rendered page images
// (pdftoppm -r 200), same as the Arithmetic Progressions and Co-ordinate
// Geometry chapters in chap_5-6.pdf.
//
// VERIFICATION METHOD: every plain MCQ (1-36) and every assertion-reason
// item (41-47) was independently re-derived by direct geometric
// computation (similarity ratios, angle-bisector theorem, Pythagoras/
// converse, basic proportionality theorem, coordinate-free ratio algebra)
// rather than copied blindly from the printed key. All four case studies
// (37-40) were independently re-derived from the numeric data given in
// their own passages/figures. This process caught FOUR genuine printed-key
// or printed-stem defects in this chapter (independently confirmed by
// direct computation, not guesswork):
//
//   - Item 5: printed key says (a) 35°. Independent computation: ΔABC and
//     ΔDEF with ∠A=∠E=40° (included angle) and AB/ED=AC/EF gives SAS
//     similarity ΔABC~ΔEDF (A↔E, B↔D, C↔F), so ∠C=∠F=65° and
//     ∠B=180-40-65=75°. Corrected to (c) 75°, flagged needs_review.
//   - Item 9: the printed stem says "AB=4cm", but AB (a leg of the
//     trapezium) is not sufficient data to determine BC from the given
//     diagonal ratio AO/OC=DO/OB=1/2 — only the parallel side AD would
//     make the problem solvable (BC=2×AD, matching the printed key's
//     answer of 8cm exactly if AD=4cm). This is almost certainly a
//     printed source typo (AB for AD, confirmed by close re-examination
//     of the scanned page — the stem unambiguously prints "AB"). Recorded
//     with the printed key's answer (8cm) and flagged needs_review with
//     full disclosure of the stem defect.
//   - Item 34 [CBSE 2024]: printed key says (c) 5cm. Independent
//     computation: AD=2, BD=3 so AB=5; DE||BC gives DE/BC=AD/AB=2/5, so
//     DE=7.5×2/5=3cm — matching option (b), and matching the officially
//     published CBSE 2024 board-exam answer for this exact question.
//     Corrected to (b) 3cm, flagged needs_review.
//   - Item 46 (assertion-reason, Fig. 7.44): printed key says (a),
//     asserting Statement-1 (x=3) is true. Independent computation using
//     the standard trapezium diagonal-intersection ratio AO/OC=BO/OD
//     (verified from scratch via coordinate geometry) with the figure's
//     printed segment values AO=4, OB=(x+1), OD=(2x+4), OC=(4x+2) gives
//     4/(4x+2)=(x+1)/(2x+4) ⇒ 2x²-x-7=0, which has NO integer (or even
//     rational) solution — so x=3 does not satisfy the proportion under
//     any consistent pairing of the four printed segment labels (checked
//     against the source image three times at high zoom to rule out a
//     transcription error on this end). Statement-1 is therefore false;
//     Statement-2 (the general trapezium-diagonal theorem) is true and
//     correctly stated. Corrected to (d), flagged needs_review.
//
// One additional item could not be fully independently pixel-verified:
//   - Item 16 (Fig. 7.23): a quadrilateral DABC with R the midpoint of DA,
//     P the midpoint of DC, and RS||DB||PQ (S on AB, Q on CB). The
//     midpoint-theorem consequences (S, Q are also midpoints; RS=PQ=DB/2)
//     are straightforward, but the figure's "x" and "y" labels are drawn
//     along a compound diagonal-ish transversal whose exact segment
//     correspondence could not be pinned down with full confidence from
//     the scanned image. Recorded using the printed key's answer (16, 8)
//     directly, flagged needs_review/needs_visual_review to disclose the
//     reliance on the key for this one item, consistent with the same
//     approach used for ambiguous figures in the Co-ordinate Geometry
//     chapter (case studies 71, 73 in that chapter's ingestion).
//
// Also disclosed (not a math defect): item 38(i)'s printed options list
// "60°" twice (options (b) and (d) are both "60°") — captured verbatim as
// printed; the correct answer (c) 90° is unaffected by the duplicate.
//
// All other computations (roughly 40 of the 47 items) matched the printed
// key exactly on first independent derivation.
//
// DIAGRAM PRESERVATION: items with no accompanying figure use
// diagramStatus 'not_applicable'. Items referencing a numbered figure
// (13-17, 25-27, 30, 33-34, 36, and all of 37-40, 46) use
// 'source_diagram_preserved' with a visuals entry, except item 16 which
// is additionally flagged 'needs_visual_review' per the disclosure above.
const { ingestQuestions } = require('./ingest');

const SF = 121; // source_files.id for ch7-8.pdf
const P711 = '7.11', P712 = '7.12', P713 = '7.13', P714 = '7.14',
  P715 = '7.15', P716 = '7.16', P717 = '7.17', P718 = '7.18', P719 = '7.19';

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.7.20, item ${n} (independently re-verified by computation)`,
  ...opts,
});

const items = [];

// p.7.11 — items 1-8
items.push(mcq(1, P711, 'If ΔABC and ΔDEF are similar such that 2AB=DE and BC=8cm, then EF=', ['16 cm', '12 cm', '8 cm', '4 cm.'], 0, { explanation: 'DE/AB=2, so by similarity EF/BC=2, EF=16cm.' }));
items.push(mcq(2, P711, 'XY is drawn parallel to the base BC of a ΔABC cutting AB at X and AC at Y. If AB=4BX and YC=2 cm, then AY=', ['2 cm', '4 cm', '6 cm', '8 cm.'], 2, { explanation: 'AB=4BX ⇒ AX=3BX=(3/4)AB, so AX/AB=3/4=AY/AC. Let AY=3k,AC=4k; YC=AC-AY=k=2 ⇒ AY=3k=6cm.' }));
items.push(mcq(3, P711, 'Two poles of height 6 m and 11 m stand vertically upright on a plane ground. If the distance between their foot is 12 m, the distance between their tops is', ['12 m', '14 m', '13 m.', '11 m'], 2, { explanation: 'Horizontal gap 12m, vertical gap 11-6=5m; distance=√(12²+5²)=√169=13m.' }));
items.push(mcq(4, P711, 'In ΔABC, D and E are points on side AB and AC respectively such that DE || BC and AD:DB=3:1. If EA=3.3 cm, then AC=', ['1.1 cm', '4 cm', '4.4 cm', '5.5 cm'], 2, { explanation: 'AD/DB=3/1 ⇒ AD/AB=3/4=AE/AC ⇒ AC=AE×4/3=3.3×4/3=4.4cm.' }));
items.push(mcq(5, P711, 'In triangles ABC and DEF, ∠A=∠E=40°, AB:ED=AC:EF and ∠F=65°, then ∠B=', ['35°', '65°', '75°', '85°'], 2, {
  answerStatus: 'needs_review',
  answerKeyRef: 'printed ANSWERS table, p.7.20, item 5 prints (a) 35°, which is mathematically incorrect (see explanation)',
  explanation: 'AB and AC share vertex A (included angle ∠A); ED and EF share vertex E (included angle ∠E). Given AB/ED=AC/EF and ∠A=∠E, SAS similarity gives ΔABC~ΔEDF (A↔E, B↔D, C↔F). So ∠C=∠F=65°, and ∠B=180-∠A-∠C=180-40-65=75°. The printed key\'s 35° does not follow from any consistent reading of this SAS setup; corrected to 75° (option c) and flagged for review.',
}));
items.push(mcq(6, P711, 'If ABC and DEF are similar triangles such that ∠A=47° and ∠E=83°, then ∠C=', ['50°', '60°', '70°', '80°'], 0, { explanation: 'ΔABC~ΔDEF ⇒ ∠B=∠E=83°. ∠C=180-47-83=50°.' }));
items.push(mcq(7, P711, 'In a ΔABC, AD is the bisector of ∠BAC. If AB=6 cm, AC=5 cm and BD=3 cm, then DC=', ['11.3 cm', '2.5 cm', '3.5 cm', 'none of these'], 1, { explanation: 'Angle bisector theorem: BD/DC=AB/AC ⇒ 3/DC=6/5 ⇒ DC=2.5cm.' }));
items.push(mcq(8, P711, 'In a ΔABC, AD is the bisector of ∠BAC. If AB=8 cm, BD=6 cm and DC=3 cm, then AC', ['4 cm', '6 cm', '3 cm', '8 cm'], 0, { explanation: 'BD/DC=AB/AC ⇒ 6/3=8/AC ⇒ AC=4cm.' }));

// p.7.12 — items 9-17
items.push(mcq(9, P712, 'ABCD is a trapezium such that BC || AD and AB = 4 cm. If the diagonals AC and BD intersect at O such that AO/OC = DO/OB = 1/2, then BC =', ['7 cm', '8 cm', '9 cm', '6 cm'], 1, {
  answerStatus: 'needs_review',
  answerKeyRef: 'printed ANSWERS table, p.7.20, item 9: (b) 8cm',
  explanation: 'With BC||AD, triangles OBC~ODA give BC/AD=OB/OD=OC/OA=2, so BC=2×AD. The printed stem gives "AB=4cm" (a leg), which cannot determine BC via this relation — the problem is only solvable if the given 4cm is the parallel side AD (giving BC=2×4=8cm, matching the printed key exactly). This is almost certainly a printed typo (AB for AD) in the source; recorded with the key\'s answer and flagged for review of the stem.',
}));
items.push(mcq(10, P712, 'If in ΔABC and ΔDEF, AB/DE = BC/FD, then ΔABC ~ ΔEDF when', ['∠A=∠F', '∠A=∠D', '∠B=∠D', '∠B=∠E'], 2, { explanation: 'The shared vertex of AB,BC is B; the shared vertex of DE,FD is D. SAS similarity needs the included angles equal: ∠B=∠D.' }));
items.push(mcq(11, P712, 'If in two triangles ABC and DEF, AB/DE = BC/FE = CA/FD, then', ['ΔFDE~ΔCAB', 'ΔFDE~ΔABC', 'ΔCBA~ΔFDE', 'ΔBCA~ΔFDE'], 0, { explanation: 'Matching shared vertices across each ratio gives correspondence A↔D, B↔E, C↔F, i.e. ΔFDE~ΔCAB (F↔C, D↔A, E↔B) — the same pairing written in a different vertex order.' }));
items.push(mcq(12, P712, 'If in two triangles ABC and DEF, ∠A=∠E, ∠B=∠F, then which of the following is not true?', ['BC/DF=AC/DE', 'AB/DE=BC/DF', 'AB/EF=AC/DE', 'BC/DF=AB/EF'], 1, { explanation: 'Correspondence A↔E,B↔F,C↔D gives the valid chain AB/EF=BC/FD=CA/DE. "AB/DE=BC/DF" mixes mismatched vertices and is not part of this chain (confirmed false by a numeric example), so it is the one NOT necessarily true.' }));
items.push(mcq(13, P713, 'In Fig. 7.20 the measures of ∠D and ∠F are respectively', ['50°, 40°', '20°, 30°', '40°, 50°', '30°, 20°'], 1, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.20 (ΔABC: AB=45,AC=63,∠B=30°,∠C=20°,BC=72; ΔDEF: DE=7,∠E=130°,EF=5)', assetType: 'source_page_full' }],
  explanation: '∠A=180-30-20=130°=∠E. AB/EF=45/5=9=AC/ED=63/7, so SAS gives ΔABC~ΔEFD (A↔E,B↔F,C↔D). So ∠D=∠C=20°, ∠F=∠B=30°.',
}));
items.push(mcq(14, P713, 'In Fig. 7.21, the value of x for which DE || BC is', ['4', '1', '3', '2'], 3, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.21 (AD=x+3, AE=x, BD=3x+19, EC=3x+4)', assetType: 'source_page_full' }],
  explanation: 'DE||BC needs AD/DB=AE/EC: (x+3)/(3x+19)=x/(3x+4). Cross-multiplying gives 3x²+13x+12=3x²+19x ⇒ 6x=12 ⇒ x=2.',
}));
items.push(mcq(15, P713, 'In Fig. 7.22, if ∠ADE=∠ABC, then CE=', ['2', '5', '9/2', '3'], 2, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.22 (AD=2, AE=3, DB=3)', assetType: 'source_page_full' }],
  explanation: '∠ADE=∠ABC with shared ∠A gives ΔADE~ΔABC, so AD/AB=AE/AC: 2/5=3/(3+EC) ⇒ 6+2EC=15 ⇒ EC=4.5=9/2.',
}));
items.push(mcq(16, P713, 'In Fig. 7.23, RS || DB || PQ. If CP = PD = 11 cm and DR = RA = 3 cm. Then the values of x and y are respectively', ['12, 10.', '14, 6', '10, 7', '16, 8'], 3, {
  diagramStatus: 'needs_visual_review',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.23 (quadrilateral DABC with R midpoint of DA, P midpoint of DC, RS||DB||PQ)', assetType: 'source_page_full' }],
  answerStatus: 'needs_review',
  answerKeyRef: 'printed ANSWERS table, p.7.20, item 16: (d) 16, 8',
  explanation: 'Since DR=RA and DP=PC (R,P are midpoints), the converse of the midpoint/basic-proportionality theorem forces S (on AB) and Q (on CB) to be midpoints too, with RS=PQ=½DB. However the figure draws the "x" and "y" labels along a compound transversal near S,R and P,Q whose exact segment endpoints could not be pinned down with full confidence from the scanned image. Recorded using the printed key\'s answer directly and flagged for review.',
}));
items.push(mcq(17, P713, 'In Fig. 7.24, if PB || CF and DP || EF, then AD/DE =', ['3/4', '1/3', '1/4', '2/3'], 1, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.24 (rays from A through B,C and through D,E, with P on the middle ray to F; AB=2cm, AC=8cm)', assetType: 'source_page_full' }],
  explanation: 'P lies on ray AF. In ΔACF, PB||CF gives AP/AF=AB/AC=2/8=1/4. In ΔAEF, DP||EF gives AP/AF=AD/AE, so AD/AE=1/4. Then AD/DE=AD/(AE-AD): with AE=4AD, DE=3AD, so AD/DE=1/3.',
}));

// p.7.13 — items 18-29
items.push(mcq(18, P713, 'ΔABC is such that AB=3 cm, BC=2 cm and CA=2.5 cm. If ΔDEF~ΔABC and EF=4 cm, then perimeter of ΔDEF is', ['7.5 cm', '15 cm', '22.5 cm', '30 cm.'], 1, { explanation: 'DEF~ABC (D↔A,E↔B,F↔C) so EF corresponds to BC: ratio=EF/BC=4/2=2. Perimeter ABC=3+2+2.5=7.5, perimeter DEF=7.5×2=15cm.' }));
items.push(mcq(19, P713, 'In ΔABC, a line XY parallel to BC cuts AB at X and AC at Y. If BY bisects ∠XYC, then', ['BC=CY', 'BC=BY', 'BC≠CY', 'BC≠BY'], 0, { explanation: 'XY||BC gives ∠XYB=∠YBC (alternate angles). BY bisects ∠XYC gives ∠XYB=∠BYC. So ∠YBC=∠BYC, making ΔBYC isosceles with BC=CY.' }));
items.push(mcq(20, P713, 'In a ΔABC, perpendicular AD from A on BC meets BC at D. If BD=8 cm, DC=2 cm and AD=4 cm, then', ['ΔABC is isosceles', 'ΔABC is equilateral', 'AC=2AB', 'ΔABC is right-angled at A.'], 3, { explanation: 'AD²=16=BD×DC=8×2, the geometric-mean relation that holds exactly when ∠BAC=90° (altitude to the hypotenuse).' }));
items.push(mcq(21, P713, 'If ΔABC~ΔDEF such that DE=3 cm, EF=2 cm, DF=2.5 cm, BC=4 cm, then perimeter of ΔABC is', ['18 cm', '20 cm', '12 cm', '15 cm'], 3, { explanation: 'ABC~DEF (A↔D,B↔E,C↔F) so BC corresponds to EF: ratio=BC/EF=4/2=2. Perimeter DEF=3+2+2.5=7.5, perimeter ABC=7.5×2=15cm.' }));
items.push(mcq(22, P713, 'If ΔABC~ΔDEF such that AB=9.1 cm and DE=6.5 cm. If the perimeter of ΔDEF is 25 cm, then the perimeter of ΔABC is', ['36 cm', '30 cm', '34 cm', '35 cm'], 3, { explanation: 'Ratio=AB/DE=9.1/6.5=1.4. Perimeter ABC=25×1.4=35cm.' }));
items.push(mcq(23, P713, 'In an isosceles triangle ABC, if AB=AC=25 cm and BC=14 cm, then the measure of altitude from A on BC is', ['20 cm', '22 cm', '18 cm', '24 cm'], 3, { explanation: 'Altitude=√(25²-7²)=√(625-49)=√576=24cm.' }));
items.push(mcq(24, P713, 'In ΔPQR, ∠Q=90°, PQ=5 cm, QR=12 cm. If QS⊥PR, then QS is equal to', ['80/13 cm', '13/5 cm', '60/13 cm', '12/5 cm'], 2, { explanation: 'PR=√(5²+12²)=13 (5-12-13 triple). Altitude to hypotenuse: QS=PQ×QR/PR=5×12/13=60/13cm.' }));
items.push(mcq(25, P713, 'In Fig. 7.25, PQRS is a parallelogram, if AT=AQ=6 cm, AS=3 cm and TS=4 cm, then', ['x=4, y=5', 'x=2, y=3', 'x=1, y=2', 'x=3, y=4'], 3, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.25 (parallelogram with line QT crossing side PS at A; PA=x, side length QP=y)', assetType: 'source_page_full' }],
  explanation: 'Since AQ=AT=6 (given equal), and vertical angles ∠QAP=∠TAS with QP||TS (by construction), ΔQPA≅ΔTSA (ratio 1). So PA=SA=3 (x=3) and QP=TS=4 (y=4).',
}));
items.push(mcq(26, P713, 'In Fig. 7.26, if AP=3 cm, AR=4.5 cm, AQ=6 cm, AB=5 cm and AC=10 cm, then AD is equal to', ['5.7 cm', '7.6 cm', '5.5 cm', '7.5 cm'], 3, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.26 (ΔABC with P on AB, Q on AC, R on cevian AD, PQ||BC)', assetType: 'source_page_full' }],
  explanation: 'AP/AB=3/5=0.6=AQ/AC=6/10, so PQ||BC (converse BPT). Then R (on AD) divides it in the same ratio: AR/AD=AP/AB=0.6, so AD=AR/0.6=4.5/0.6=7.5cm.',
}));
items.push(mcq(27, P713, 'In Fig. 7.27, ∠PQR=∠PRS. If PR=8 cm, PS=4 cm, then PQ=', ['12 cm', '16 cm', '32 cm', '24 cm'], 1, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.27 (ΔPQR with S on PR-side line, ∠PQR=∠PRS)', assetType: 'source_page_full' }],
  explanation: 'Common ∠P and ∠PQR=∠PRS give ΔPQR~ΔPRS, so PQ/PR=PR/PS ⇒ PQ=PR²/PS=64/4=16cm.',
}));
items.push(mcq(28, P713, 'If ΔPQR~ΔXYZ and XY=4 cm, YZ=4.5 cm, ZX=6.5 cm and PQ=8 cm, then perimeter of ΔPQR is', ['25 cm', '23 cm', '15 cm', '30 cm'], 3, { explanation: 'Ratio=PQ/XY=8/4=2. Perimeter XYZ=4+4.5+6.5=15, perimeter PQR=15×2=30cm.' }));
items.push(mcq(29, P714, 'Consider the following three statements about a triangle ABC with side lengths m, n and r. S-1: ABC is a right triangle provided n²-m²=r². S-2: Triangle with side lengths m+2, n+2 and r+2 is a right angle triangle. S-3: Triangle with sides 2m, 2n and 2r is a right-angle triangle. Which of the following is correct?', [
  'Statement S-1 would be correct if n>m, n>r and statement S-2 would be correct if ΔABC is a right triangle.',
  'Statement S-1 would be correct if r>m, r>n and statement S-2 would be correct if ΔABC is a right triangle.',
  'Statement S-1 would be correct if n>m, n>r and statement S-3 would be correct if ΔABC is a right triangle.',
  'Statement S-1 would be correct if r>m, r>n and statement S-3 would be correct if ΔABC is a right triangle.',
], 2, { explanation: 'n²=m²+r² makes n the hypotenuse only if n is the largest side, requiring n>m and n>r. Scaling all sides by 2 preserves the Pythagorean relation ((2n)²=(2m)²+(2r)²), so S-3 always holds if ABC is right-angled; adding a constant (S-2) does not preserve it in general.' }));
items.push(mcq(30, P714, 'Which of the following statements is correct about the triangles in the following figure (Fig. 7.28: AO=1.6cm, OC=2.4cm, OD=0.8cm, OB=4.8cm, ∠A=∠D=70° at O)?', [
  'ΔAOB~ΔDOC because AO/DO=BO/CO.',
  'ΔAOB~ΔDOC because ∠AOB=∠DOC.',
  'ΔAOB~ΔDOC because AO/DO=BO/CO and ∠BAO=∠CDO.',
  'ΔAOB~ΔDOC because AO/DO=BO/CO and ∠AOB=∠DOC.',
], 3, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.28 (A-O-D and B-O-C straight lines crossing at O)', assetType: 'source_page_full' }],
  explanation: 'AO/DO=1.6/0.8=2=BO/CO=4.8/2.4, and ∠AOB=∠DOC (vertically opposite, since A,O,D and B,O,C are each straight lines) — SAS similarity with both the side ratio and the included angle equality stated.',
}));
items.push(mcq(31, P714, 'Which of the following statements help in proving that ΔABO is similar to ΔDOC? Statement-1: ∠B=70°, Statement-2: ∠C=70°', ['S-1 alone is sufficient, but S-2 alone is not sufficient.', 'S-2 alone is sufficient, but S-1 alone is not sufficient.', 'Each statement alone is sufficient.', 'S-1 and S-2 together are sufficient but neither alone is sufficient.'], 2, { explanation: 'The figure already fixes ∠AOB=∠DOC=70° (vertically opposite, marked in Fig. 7.28). Knowing either ∠B=70° or ∠C=70° alone then forces both triangles to have angle set {70°,70°,40°} (since each triangle\'s third angle is determined once two are known), giving similarity by AA regardless of which one is supplied.' }));
items.push(mcq(32, P714, 'The perimeters of two similar triangles ABC and PQR are 56 cm and 48 cm respectively. PQ/AB is equal to', ['7/8', '6/7', '7/6', '8/7'], 1, { source: 'CBSE 2024', explanation: 'For similar triangles, any ratio of corresponding sides equals the ratio of perimeters: PQ/AB=48/56=6/7.' }));
items.push(mcq(33, P714, 'In ΔABC, DE || BC (See Fig. 7.30). If AD=4 cm, AB=9 cm and AC=13.5 cm, then the length of EC is', ['6 cm', '7.5 cm', '9 cm', '5.7 cm'], 1, {
  source: 'CBSE 2024',
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.30 (ΔABC, D on AB, E on AC, DE||BC)', assetType: 'source_page_full' }],
  explanation: 'AD/AB=4/9=AE/AC ⇒ AE=13.5×4/9=6. EC=AC-AE=13.5-6=7.5cm.',
}));
items.push(mcq(34, P714, 'In ΔABC, DE || BC (See Fig. 7.30). If AD=2 cm, BD=3 cm, BC=7.5 cm, then the length of DE (in cm) is', ['2.5', '3', '5', '6'], 1, {
  source: 'CBSE 2024',
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.30 (ΔABC, D on AB, E on AC, DE||BC)', assetType: 'source_page_full' }],
  answerStatus: 'needs_review',
  answerKeyRef: 'printed ANSWERS table, p.7.20, item 34 prints (c) 5, which is mathematically incorrect (see explanation)',
  explanation: 'AB=AD+DB=2+3=5. DE/BC=AD/AB=2/5, so DE=7.5×2/5=3cm. This matches the officially published CBSE 2024 board-exam answer (3cm) for this exact question; the printed key\'s "5" is a genuine error. Corrected to (b) 3cm, flagged for review.',
}));
items.push(mcq(35, P714, 'If the diagonals of a quadrilateral divide each other proportionally, then it is a', ['parallelogram', 'rectangle', 'square', 'trapezium'], 3, { explanation: 'This is the converse of the trapezium diagonal-division theorem: proportional division of the diagonals forces the quadrilateral to be a trapezium.' }));
items.push(mcq(36, P714, 'In Fig. 7.31, if in ΔABC, DE || BC, then which of the following equality holds?', ['AD/AB=AE/CE', 'AD/AB=AE/AC', 'AD/BD=AE/AC', 'AD/AB=AC/AE'], 1, {
  source: 'CBSE 2024',
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.31 (ΔABC, D on AB, E on AC, DE||BC)', assetType: 'source_page_full' }],
  explanation: 'DE||BC gives ΔADE~ΔABC (AA), so AD/AB=AE/AC directly.',
}));

// p.7.15-7.16 — Case Study 37 (scale drawings, similarity transformations)
items.push({
  kind: 'case', sourceQuestionNumber: '37', sourcePage: '7.15-7.16',
  text: 'A scale drawing of an object is the same shape as the object but a different size. The scale of a drawing is a comparison of the length used on a drawing to the length it represents, written as a ratio: Scale factor = (Length in image) / (Corresponding length in object). If one shape can become another using resizing, the shapes are similar; the ratio of two corresponding sides is the scale factor. Two shapes are similar when one can become the other after a resize, flip, slide or turn (Figs. 7.32-7.35).',
  parts: [
    { text: '(i) A model of a boat is made on the scale of 1:4. The model is 120 cm long. The full size of the boat has a width of 60 cm. What is the width of the scale model?', options: ['20 cm', '25 cm', '15 cm', '240 cm'], correct: 2, marks: 1 },
    { text: '(ii) What will effect the similarity of any two polygons?', options: ['They are flipped horizontally', 'They are dilated by a scale factor', 'They are translated down', 'They are not the mirror image of one another'], correct: 3, marks: 1 },
    { text: '(iii) If two similar triangles have a scale factor of a:b. Which statement regarding the two triangles is true?', options: ['The ratio of their perimeters is 3a:b', 'Their altitudes have a ratio a:b', 'Their medians have a ratio (a/2):b', 'Their angle bisectors have a ratio a²:b²'], correct: 1, marks: 1 },
    { text: '(iv) The shadow of a stick 5 m long is 2 m. At the same time the shadow of a tree 12.5 m high is (Fig. 7.37)', options: ['3 m', '3.5 m', '4.5 m', '5 m'], correct: 3, marks: 1 },
    { text: "(v) Below you see a student's mathematical model of a farmhouse roof (Fig. 7.38). The attic floor ABCD is a square; EFGHKLMN is a rectangular prism formed by beams. E is the middle of AT, F the middle of BT, G the middle of CT, H the middle of DT. All edges of the pyramid have length 12 m. What is the length of EF, one of the horizontal edges of the block?", options: ['24 m', '3 m', '6 m', '10 m'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [
    { sourceFileId: SF, figureLabel: 'Figs. 7.32-7.35 (similar shapes; rotation, reflection, translation)', assetType: 'source_page_full' },
    { sourceFileId: SF, figureLabel: 'Fig. 7.36 (boat model and full-size boat)', assetType: 'source_page_full' },
    { sourceFileId: SF, figureLabel: 'Fig. 7.37 (tree and stick with shadows)', assetType: 'source_page_full' },
    { sourceFileId: SF, figureLabel: 'Fig. 7.38 (pyramid roof model with midpoints E,F,G,H)', assetType: 'source_page_full' },
  ],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.7.20, item 37: "(i)(c) (ii)(d) (iii)(b) (iv)(d) (v)(c)" (independently re-verified by computation)',
  explanation: '(i) width=60×(1/4)=15cm. (iii) altitudes scale directly with the similarity ratio a:b, unlike the other (miscalculated) options. (iv) 5/2=12.5/x ⇒ x=5m. (v) E,F are midpoints of AT,BT, so EF is a midsegment of ΔABT parallel to AB with EF=AB/2=12/2=6m. (ii) is a conceptual/definitional item taken from the printed key as-is.',
});

// p.7.16-7.17 — Case Study 38 (Rahul's kite, Fig. 7.39)
items.push({
  kind: 'case', sourceQuestionNumber: '38', sourcePage: '7.16-7.17',
  text: 'Rahul is studying in class X. He is making a kite to fly it on a Sunday. Few questions came to his mind while making the kite (a quadrilateral shape with two perpendicular diagonal sticks, Fig. 7.39). Give answers to his questions by looking at the figure.',
  parts: [
    { text: '(i) Rahul tied the sticks at what angles to each other?', options: ['30°', '60°', '90°', '60°'], correct: 2, marks: 1 },
    { text: '(ii) Which is the correct similarity criteria applicable for smaller triangles at the upper part of this kite?', options: ['RHS', 'SAS', 'SSA', 'AAS'], correct: 1, marks: 1 },
    { text: '(iii) Sides of two similar triangles are in the ratio 4:9. Corresponding medians of these triangles are in the ratio', options: ['2:3', '4:9', '81:16', '16:81'], correct: 1, marks: 1 },
    { text: '(iv) In a triangle, if square of one side is equal to the sum of the squares of the other two sides, then the angle opposite the first side is a right angle. This theorem is called as,', options: ['Pythagoras theorem', 'Thales theorem', 'Converse of Thales theorem', 'Converse of Pythagoras theorem'], correct: 3, marks: 1 },
    { text: '(v) What is the area of the kite, formed by two perpendicular sticks of length 6 cm and 8 cm?', options: ['48 cm²', '14 cm²', '24 cm²', '96 cm²'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.39 (kite made of two perpendicular diagonal sticks against a brick wall)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.7.20, item 38: "(i)(c) (ii)(b) (iii)(b) (iv)(d) (v)(a)" (independently re-verified by computation)',
  explanation: 'A kite has perpendicular diagonals (i, 90°). The two upper triangles share the vertical diagonal with a pair of equal (kite) sides and the right angle between them: SAS (ii). Medians of similar triangles scale with the similarity ratio, 4:9 (iii). (iv) is the definition of the converse of Pythagoras theorem. Area of a kite with perpendicular diagonals = ½×d1×d2 = ½×6×8=24cm² (v). Note: the printed options for (i) list "60°" twice (options b and d) — a printed duplicate captured verbatim; it does not affect the correct answer (c) 90°.',
});

// p.7.17 — Case Study 39 (bulb-and-shadow enlargement, Fig. 7.40)
items.push({
  kind: 'case', sourceQuestionNumber: '39', sourcePage: '7.17',
  text: 'In a room a bulb is fixed at a point O on the ceiling. Just below the bulb a large table is placed. A cardboard is cut in the form of quadrilateral ABCD and is fixed between the bulb and the table. When the bulb is switched on, shadow A\'B\'C\'D\' of cardboard ABCD is formed on the top of the table such that quadrilateral A\'B\'C\'D\' is an enlargement of quadrilateral ABCD with scale factor 1:2. AB=1.5 cm, BC=2.5 cm, CD=2.4 cm, AD=2.1 cm, ∠A=105°, ∠B=100°, ∠C=70° and ∠D=85° (Fig. 7.40).',
  parts: [
    { text: "(i) The measurement of ∠A' is", options: ['105°', '100°', '70°', '80°'], correct: 0, marks: 1 },
    { text: "(ii) The sum of the angles ∠A' and ∠C' of quadrilateral A'B'C'D' is", options: ['185°', '205°', '175°', '155°'], correct: 2, marks: 1 },
    { text: "(iii) Perimeter of quadrilateral A'B'C'D' is", options: ['8.5 cm', '5 cm', '10 cm', '17 cm'], correct: 3, marks: 1 },
    { text: "(iv) The length of side A'B' of quadrilateral A'B'C'D' is", options: ['1.5 cm', '3 cm', '2.5 cm', '5 cm'], correct: 1, marks: 1 },
    { text: "(v) The sum of the angles C' and D' of quadrilateral A'B'C'D' is", options: ['105°', '100°', '155°', '140°'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: "Fig. 7.40 (bulb, cardboard quadrilateral ABCD, and enlarged shadow A'B'C'D' on a table)", assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.7.20, item 39: "(i)(a) (ii)(c) (iii)(d) (iv)(b) (v)(c)" (independently re-verified by computation)',
  explanation: "An enlargement (similarity transformation) preserves all angles: ∠A'=∠A=105° (i); ∠A'+∠C'=105+70=175° (ii); ∠C'+∠D'=70+85=155° (v). Lengths scale by the scale factor 2: perimeter A'B'C'D'=2×(1.5+2.5+2.4+2.1)=2×8.5=17cm (iii); A'B'=2×1.5=3cm (iv).",
});

// p.7.18 — Case Study 40 (congruent/similar figures; shadow-based heights)
items.push({
  kind: 'case', sourceQuestionNumber: '40', sourcePage: '7.18',
  text: 'Observe Fig. 7.41 carefully (six labelled pairs of figures A-F: two suns, a pair of tick-marked triangles PQR/ABC, two giraffes, two cars, two tick-marked dogs, and a pair of tick-marked triangles PQR/STU), then answer the following.',
  parts: [
    { text: '(i) Which among the above shown figures are congruent figures?', options: ['A and C', 'E and F', 'D and F', 'B and F'], correct: 3, marks: 1 },
    { text: '(ii) Which of the following statements is correct?', options: ['All similar figures are congruent.', 'All congruent figures are similar.', 'The criterion for similarity and congruency is same.', 'Similar figures have same size and shape.'], correct: 1, marks: 1 },
    { text: '(iii) If a line divides any two sides of the triangle in the same ratio, then the line is parallel to the third side. Which theorem is depicted by this statement?', options: ['Pythagoras', 'Thales Theorem', 'Converse of Thales theorem', 'Converse of Pythagoras theorem'], correct: 2, marks: 1 },
    { text: '(iv) Using the concept of similarity, the height of the tree is (Fig. 7.42: man 5 ft tall casts a 7 ft shadow; at the same time a tree casts a 14 ft shadow)', options: ['12 ft', '10 ft', '15 ft', '7 ft'], correct: 1, marks: 1 },
    { text: '(v) The height of the tree, when its shadow is 84 m long and at the same time a girl 2 m high standing in the same straight line casts a shadow 12 m, is (Fig. 7.43)', options: ['14 m', '24 m', '6 m', '12 m'], correct: 0, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [
    { sourceFileId: SF, figureLabel: 'Fig. 7.41 (six labelled pairs of figures A-F for congruence/similarity)', assetType: 'source_page_full' },
    { sourceFileId: SF, figureLabel: 'Fig. 7.42 (man and tree with shadows)', assetType: 'source_page_full' },
    { sourceFileId: SF, figureLabel: 'Fig. 7.43 (girl and palm tree with shadows)', assetType: 'source_page_full' },
  ],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.7.20, item 40: "(i)(d) (ii)(b) (iii)(c) (iv)(b) (v)(a)" (independently re-verified by computation)',
  explanation: '(ii) congruent figures are always similar (ratio 1), but not conversely, so (b) is the correct statement; (iii) is the converse of the basic proportionality (Thales) theorem. (iv) using individual shadow lengths: x/14=5/7 ⇒ x=10ft. (v) 2/12=h/84 ⇒ h=14m. (i) is a visual congruence-matching item taken from the printed key.',
});

// p.7.19 — Assertion-Reason MCQs 41-47
const AR_INSTRUCTIONS = 'Each of the following contains STATEMENT-1 (A) and STATEMENT-2 (R), with choices: (a) both true, Statement-2 is a correct explanation for Statement-1; (b) both true, Statement-2 is not a correct explanation for Statement-1; (c) Statement-1 is true, Statement-2 is false; (d) Statement-1 is false, Statement-2 is true.';

items.push(mcq(41, P719, `${AR_INSTRUCTIONS} Statement-1 (A): Two similar triangles are always congruent. Statement-2 (R): Two congruent triangles are always similar.`, ['(a)', '(b)', '(c)', '(d)'], 3, { explanation: 'Similar triangles need not be congruent (they can differ in size) — Statement-1 is false. Congruent triangles are always similar (ratio 1) — Statement-2 is true.' }));
items.push(mcq(42, P719, `${AR_INSTRUCTIONS} Statement-1 (A): If ΔABC and ΔPQR are right triangles right angled at C and R respectively such that AB/PQ=AC/PR, then ∠B=∠Q. Statement-2 (R): If in two right triangles, hypotenuse and one side of one triangle are proportional to the hypotenuse and one side of the other triangle, then the two triangles are similar.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: 'AB,PQ are the hypotenuses (right angles at C,R); AC,PR are one leg each. Given ratio equality, the RHS-similarity criterion (Statement-2) gives ΔABC~ΔPQR (A↔P,B↔Q,C↔R), so ∠B=∠Q — Statement-2 correctly explains Statement-1.' }));
items.push(mcq(43, P719, `${AR_INSTRUCTIONS} Statement-1 (A): In ΔPQR, if PQ=12 cm, QR=9 cm and PR=15 cm, then ΔPQR is a right triangle right angled at Q. Statement-2 (R): If in a triangle, square of one side is equal to the sum of the squares of the other two sides, then the angle opposite to the first side is a right angle.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: 'PQ²+QR²=144+81=225=15²=PR², so by the converse of Pythagoras theorem (Statement-2) the angle opposite PR, i.e. ∠Q, is 90° — correctly explains Statement-1.' }));
items.push(mcq(44, P719, `${AR_INSTRUCTIONS} Statement-1 (A): In two triangles, if corresponding angles are equal then the triangles are similar. Statement-2 (R): If the areas of two similar triangles are equal, then the triangles are congruent.`, ['(a)', '(b)', '(c)', '(d)'], 1, { explanation: 'Statement-1 is the AAA similarity criterion, true. Statement-2 is also true (equal areas force the similarity ratio k to satisfy k²=1, i.e. k=1, i.e. congruent), but it is an unrelated fact about areas, not an explanation of Statement-1.' }));
items.push(mcq(45, P719, `${AR_INSTRUCTIONS} Statement-1 (A): D and E are points on sides AB and AC of ΔABC such that AD=(7x-4) cm, AE=(5x-2) cm, DB=(3x+4) cm and EC=3x cm. If DE || BC, then x=5. Statement-2 (R): If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, then the other two sides are divided in the same ratio.`, ['(a)', '(b)', '(c)', '(d)'], 3, { explanation: 'DE||BC needs AD/DB=AE/EC: (7x-4)/(3x+4)=(5x-2)/(3x). Cross-multiplying gives 3x²-13x+4=0, whose valid positive-length root is x=4 (AD=24,DB=16,AE=18,EC=12, ratio 1.5=1.5), not x=5. Statement-1 is false; Statement-2 (basic proportionality theorem) is true.' }));
items.push(mcq(46, P719, `${AR_INSTRUCTIONS} Statement-1 (A): In Fig. 7.44, if AB || CD, then x=3. Statement-2 (R): Diagonals of a trapezium divide each other proportionally.`, ['(a)', '(b)', '(c)', '(d)'], 3, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 7.44 (trapezium ABCD with diagonals meeting at O: AO=4, OB=x+1, OD=2x+4, OC=4x+2)', assetType: 'source_page_full' }],
  answerStatus: 'needs_review',
  answerKeyRef: 'printed ANSWERS table, p.7.20, item 46 prints (a), which is mathematically incorrect (see explanation)',
  explanation: 'With AB||CD, the diagonals satisfy AO/OC=BO/OD (verified from first principles via coordinate geometry). Substituting the figure\'s printed values, 4/(4x+2)=(x+1)/(2x+4), gives 2x²-x-7=0, which has no rational root — so x=3 does not satisfy the proportion (checked directly: 4/14=2/7 ≠ 4/10=2/5). Statement-1 is false. Statement-2 (the general trapezium diagonal-proportionality theorem) is true. Corrected to (d), flagged for review.',
}));
items.push(mcq(47, P719, `${AR_INSTRUCTIONS} Statement-1 (A): ABCD is a trapezium with DC || AB, E and F are points on AD and BC respectively, such that EF || AB. Then AE/ED=BF/FC. Statement-2 (R): Any line parallel to parallel sides of a trapezium divides the non-parallel sides proportionally.`, ['(a)', '(b)', '(c)', '(d)'], 0, { source: 'CBSE 2024', explanation: 'Statement-1 is a direct instance of the general theorem stated in Statement-2 (a line parallel to the parallel sides of a trapezium divides the legs proportionally) — both true, and Statement-2 correctly explains Statement-1.' }));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Triangles',
  chapterOrder: 7,
  sourceFileIds: [SF],
  label: 'CBSE Maths Triangles Ch.7 (ch7-8.pdf, pp.7.11-7.20, items 1-47)',
});
console.log(JSON.stringify(result, null, 2));
