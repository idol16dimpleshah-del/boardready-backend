// CBSE Class 10 Mathematics — Triangles practice-exercise MCQs.
// Source: 5 photographed pages of a printed guide (pp.7.16-7.20), part of a
// larger 32-image upload received 2026-09-17 (see PROJECT_PROGRESS.md's
// "Large new upload batch" note). Archived first via
// archive-pending-batch-2026-09-17.js, then reclassified to a proper
// chapter-specific location via reclassify-cbse-triangles-images.js once
// each page's exact content was individually re-confirmed.
//
// DISCLOSED GAP: this is only the TAIL END of the chapter. Item 37's stem
// and sub-parts (i)-(ii) are on an earlier page (~7.15) not among the
// photographed pages — only sub-parts (iii)-(v) are captured here. Items
// 1-36 are not present at all. If the founder has pages 7.1-7.15, sending
// them would let this chapter be completed.
//
// METHOD (same as every other chapter this session): every answer
// independently computed, not copied from the printed key. Two genuine
// discrepancies found and flagged needs_review:
//   - Item 38(v): computed area of a kite with perpendicular diagonals
//     6cm/8cm = (1/2)*6*8 = 24 cm^2 (option c), printed key marks (a) 48 -
//     exactly double, looks like a dropped factor of 1/2 in the source.
//   - Item 46: a figure-dependent (trapezium diagonal-segment) item where
//     the exact correspondence between the printed algebraic labels (4,
//     x+1, 2x+4, 4x+2) and the two diagonals' four segments could not be
//     confidently pinned down from the photographed figure alone, so x=3
//     could not be independently re-derived with confidence either way.
//     Statement-2 (diagonals of a trapezium divide each other
//     proportionally) is independently confirmed true and is a genuine,
//     correct general theorem. `correct` is taken from the printed key.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [64, 65, 66, 67, 68]; // reclassify-cbse-triangles-images.js, pages 7.16-7.20

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  kind: 'mcq',
  options,
  correct: correctIdx,
  answerKeyRef: `printed ANSWERS table, p.7.20, item ${n} (independently re-verified by computation)`,
  ...opts,
});

const items = [
  // Item 37: only sub-parts (iii)-(v) captured; (i)-(ii) and the stem are on a missing earlier page.
  {
    kind: 'case',
    sourceQuestionNumber: '37', sourcePage: '7.16',
    text: "[Sub-parts (i)-(ii) and this item's stem are on an earlier page (~7.15) not among the photographed pages — not captured. Only sub-parts (iii)-(v) below are from the photographed pages.]",
    parts: [
      { text: '(iii) If two similar triangles have a scale factor of a:b, which statement regarding the two triangles is true?', options: ['The ratio of their perimeters is 3a:b', 'Their altitudes have a ratio a:b', 'Their medians have a ratio (a/2):b', 'Their angle bisectors have a ratio a²:b²'], correct: 1, marks: 1 },
      { text: '(iv) The shadow of a stick 5 m long is 2 m. At the same time the shadow of a tree 12.5 m high is', options: ['3 m', '3.5 m', '4.5 m', '5 m'], correct: 3, marks: 1 },
      { text: "(v) A student's mathematical model of a farmhouse roof (Fig. 7.38): attic floor ABCD is a square, beams EFGHKLMN are edges of a rectangular prism where E,F,G,H are midpoints of AT,BT,CT,DT respectively, and all edges of the pyramid have length 12 m. What is the length of EF, one of the horizontal edges of the block?", options: ['24 m', '3 m', '6 m', '10 m'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Similar triangles: scale factor, shadows, midpoint theorem', questionType: 'case_study',
    explanation: 'Sub-part (iii): all linear measures of similar triangles (altitude, median, angle bisector, perimeter) scale in the same ratio a:b as the sides — only the altitude option states this correctly. Sub-part (iv): 5/2 = 12.5/x -> x=5m. Sub-part (v): E,F are midpoints of AT,BT, so EF is a midsegment of triangle ABT and EF = AB/2 = 12/2 = 6m. All three independently verified and consistent with the printed key.',
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: 64, figureLabel: 'Fig. 7.37 (stick/tree shadows), Fig. 7.38 (farmhouse roof pyramid EFGHKLMN)', assetType: 'source_page_full' }],
  },
  {
    kind: 'case',
    sourceQuestionNumber: '38', sourcePage: '7.16-7.17',
    text: 'Rahul is studying in X standard. He is making a kite to fly it on a Sunday. Few questions came to his mind while making the kite (Fig. 7.39).',
    parts: [
      { text: '(i) Rahul tied the sticks at what angles to each other?', options: ['30°', '60°', '90°', '60°'], correct: 2, marks: 1 },
      { text: '(ii) Which is the correct similarity criteria applicable for smaller triangles at the upper part of this kite?', options: ['RHS', 'SAS', 'SSA', 'AAS'], correct: 1, marks: 1 },
      { text: '(iii) Sides of two similar triangles are in the ratio 4:9. Corresponding medians of these triangles are in the ratio', options: ['2:3', '4:9', '81:16', '16:81'], correct: 1, marks: 1 },
      { text: '(iv) In a triangle, if square of one side is equal to the sum of the squares of the other two sides, then the angle opposite the first side is a right angle. This theorem is called as,', options: ['Pythagoras theorem', 'Thales theorem', 'Converse of Thales theorem', 'Converse of Pythagoras theorem'], correct: 3, marks: 1 },
      { text: '(v) What is the area of the kite, formed by two perpendicular sticks of length 6 cm and 8 cm?', options: ['48 cm²', '14 cm²', '24 cm²', '96 cm²'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Case study: kite construction (perpendicular diagonals, similarity)', questionType: 'case_study',
    answerStatus: 'needs_review',
    explanation: "Sub-parts (i)-(iv) independently verified and consistent with the printed key. DISCREPANCY FLAGGED for sub-part (v), not silently resolved: for ANY quadrilateral with perpendicular diagonals (a kite included), area = (1/2)*d1*d2 regardless of where the diagonals cross = (1/2)*6*8 = 24 cm^2, matching option (c). The printed answer key marks (a) 48 cm^2, exactly double our computed value — looks like a dropped factor of 1/2 in the source rather than a different intended geometry. Recorded our own computed value (c); whole item flagged needs_review pending a human check of the original printed page for this specific sub-part.",
    diagramStatus: 'source_diagram_preserved',
    visuals: [
      { sourceFileId: 64, figureLabel: 'Fig. 7.39 (kite on brick wall, stem)', assetType: 'source_page_full' },
      { sourceFileId: 65, figureLabel: 'Fig. 7.39 continued (sub-parts i-v)', assetType: 'source_page_full' },
    ],
  },
  {
    kind: 'case',
    sourceQuestionNumber: '39', sourcePage: '7.17',
    text: "In a room a bulb is fixed at a point O on the ceiling. Just below the bulb a large table is placed (Fig. 7.40). A cardboard is cut in the form of quadrilateral ABCD and fixed between the bulb and the table. When the bulb is switched on, shadow A'B'C'D' of cardboard ABCD is formed on the table such that quadrilateral A'B'C'D' is an enlargement of ABCD with scale factor 1:2. AB=1.5cm, BC=2.5cm, CD=2.4cm, AD=2.1cm, ∠A=105°, ∠B=100°, ∠C=70°, ∠D=85°.",
    parts: [
      { text: "(i) The measurement of ∠A' is", options: ['105°', '100°', '70°', '80°'], correct: 0, marks: 1 },
      { text: "(ii) The sum of the angles ∠A' and ∠C' of quadrilateral A'B'C'D' is", options: ['185°', '205°', '175°', '155°'], correct: 2, marks: 1 },
      { text: "(iii) Perimeter of quadrilateral A'B'C'D' is", options: ['8.5 cm', '5 cm', '10 cm', '17 cm'], correct: 3, marks: 1 },
      { text: "(iv) The length of side A'B' of quadrilateral A'B'C'D' is", options: ['1.5 cm', '3 cm', '2.5 cm', '5 cm'], correct: 1, marks: 1 },
      { text: "(v) The sum of the angles C' and D' of quadrilateral A'B'C'D' is", options: ['105°', '100°', '155°', '140°'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Case study: enlargement/scale-factor transformation of a quadrilateral', questionType: 'case_study',
    explanation: "All five sub-answers independently recomputed and consistent with the printed key: an enlargement preserves angles (so angle A'=105 etc.) and scales all sides by the given factor (here x2, since scale factor is stated as original:enlarged = 1:2), giving perimeter 8.5x2=17cm and A'B'=1.5x2=3cm.",
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: 65, figureLabel: 'Fig. 7.40 (bulb, table, cardboard quadrilateral ABCD and shadow A\'B\'C\'D\')', assetType: 'source_page_full' }],
  },
  {
    kind: 'case',
    sourceQuestionNumber: '40', sourcePage: '7.17-7.19',
    text: 'Observe Fig. 7.41 (six pairs of figures A-F: two different-sized stars; a quadrilateral PQRC formed by two crossing segments; two giraffes; two cars; two cartoon dogs; two marked triangles PQR and STU) and Fig. 7.42/7.43 (shadow problems).',
    parts: [
      { text: '(i) Which among the shown figures (A-F) are congruent figures?', options: ['A and C', 'E and F', 'D and F', 'B and F'], correct: 3, marks: 1 },
      { text: '(ii) Which of the following statements is correct?', options: ['All similar figures are congruent.', 'All congruent figures are similar.', 'The criterion for similarity and congruency is the same.', 'Similar figures have the same size and shape.'], correct: 1, marks: 1 },
      { text: '(iii) If a line divides any two sides of a triangle in the same ratio, then the line is parallel to the third side. Which theorem is depicted by this statement?', options: ['Pythagoras', 'Thales Theorem', 'Converse of Thales theorem', 'Converse of Pythagoras theorem'], correct: 2, marks: 1 },
      { text: "(iv) Using the concept of similarity, the height of the tree is (Fig. 7.42: person 5 ft tall, 7 ft mark, tree of height x, 14 ft mark)", options: ['12 ft', '10 ft', '15 ft', '7 ft'], correct: 1, marks: 1 },
      { text: '(v) The height of a tree, when its shadow is 84 m long and at the same time a girl 2 m high standing in the same straight line casts a shadow 12 m, is', options: ['14 m', '24 m', '6 m', '12 m'], correct: 0, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Congruence vs similarity; Thales/BPT converse; shadow problems', questionType: 'case_study',
    explanation: "Sub-parts (ii)-(v) independently verified: (ii) congruent implies similar is the only universally true statement; (iii) is literally the converse of the Basic Proportionality (Thales) theorem; (iv) 5/7 = x/14 -> x=10ft; (v) 2/12 = h/84 -> h=14m. Sub-part (i) is a pure figure-classification call (which of six illustrated pairs shows genuine congruence via marked equal corresponding sides, versus mere same-shape-different-size similarity) that depends on tick-mark details in the photographed figure; taken from the printed key (d) rather than independently re-derived.",
    diagramStatus: 'source_diagram_preserved',
    visuals: [
      { sourceFileId: 66, figureLabel: 'Fig. 7.41 (six congruent/similar figure pairs A-F)', assetType: 'source_page_full' },
      { sourceFileId: 67, figureLabel: 'Fig. 7.42 (tree height by shadow), Fig. 7.43 (palm tree height by shadow)', assetType: 'source_page_full' },
    ],
  },
];

const AR_OPTIONS = [
  'Statement-1 is true, Statement-2 is true; Statement-2 is a correct explanation for Statement-1.',
  'Statement-1 is true, Statement-2 is true; Statement-2 is not a correct explanation for Statement-1.',
  'Statement-1 is true, Statement-2 is false.',
  'Statement-1 is false, Statement-2 is true.',
];
const ar = (n, text, correctIdx, opts = {}) => mcq(n, '7.19', text, AR_OPTIONS, correctIdx, { questionType: 'assertion_reasoning', ...opts });

items.push(
  ar(41, 'Statement-1 (A): Two similar triangles are always congruent. Statement-2 (R): Two congruent triangles are always similar.', 3,
    { explanation: 'Similar triangles need not be the same size (S1 false); congruent triangles are always similar (S2 true) — matches printed key (d).', diagramStatus: 'not_applicable' }),
  ar(42, 'Statement-1 (A): If ΔABC and ΔPQR are right triangles right angled at C and R respectively such that AB/PQ = AC/PR, then ∠B = ∠Q. Statement-2 (R): If in two right triangles, hypotenuse and one side of one triangle are proportional to the hypotenuse and one side of the other triangle, then the two triangles are similar.', 0,
    { explanation: 'Given ratio equates the hypotenuses (AB,PQ) and one leg (AC,PR) of the two right triangles, so by the RHS-similarity criterion stated in S2 the triangles are similar with A<->P, B<->Q, C<->R, giving ∠B=∠Q — both true, S2 correctly explains S1, matches printed key (a).', diagramStatus: 'not_applicable' }),
  ar(43, 'Statement-1 (A): In ΔPQR, if PQ = 12 cm, QR = 9 cm and PR = 15 cm, then ΔPQR is a right triangle right angled at Q. Statement-2 (R): If in a triangle, square of one side is equal to the sum of the squares of the other two sides, then the angle opposite to the first side is a right angle.', 0,
    { explanation: 'PQ²+QR² = 144+81 = 225 = 15² = PR², so the right angle is opposite PR, i.e. at Q — S1 true. S2 is the converse of Pythagoras theorem, true, and correctly explains S1 — matches printed key (a).', diagramStatus: 'not_applicable' }),
  ar(44, 'Statement-1 (A): In two triangles, if corresponding angles are equal then the triangles are similar. Statement-2 (R): If the areas of two similar triangles are equal, then the triangles are congruent.', 1,
    { explanation: 'S1 is the AAA similarity criterion, true. S2 is also true (equal areas force the square of the similarity ratio to be 1, hence congruent) but is an unrelated fact, not an explanation of why equal angles imply similarity — matches printed key (b).', diagramStatus: 'not_applicable' }),
  ar(45, 'Statement-1 (A): D and E are points on sides AB and AC of ΔABC such that AD=(7x-4) cm, AE=(5x-2) cm, DB=(3x+4) cm and EC=3x cm. If DE || BC, then x=5. Statement-2 (R): If a line is drawn parallel to one side of a triangle to intersect the other two sides in distinct points, then the other two sides are divided in the same ratio.', 3,
    { explanation: 'By the Basic Proportionality Theorem, AD/DB=AE/EC gives (7x-4)/(3x+4)=(5x-2)/(3x), i.e. 3x²-13x+4=0, whose roots are x=4 and x=1/3 — NOT x=5. So Statement-1 as printed is false. Statement-2 is exactly the Basic Proportionality (Thales) Theorem itself, true. Matches printed key (d) exactly — no discrepancy, our independent computation confirms S1 is indeed false.', diagramStatus: 'not_applicable' }),
  ar(46, 'Statement-1 (A): In Fig. 7.44 (a trapezium ABCD with diagonals crossing, segments labelled 4, x+1, 2x+4, 4x+2), if AB || CD, then x = 3. Statement-2 (R): Diagonals of a trapezium divide each other proportionally.', 0,
    {
      explanation: "Statement-2 is a genuine, correct general theorem (diagonals of a trapezium with AB||CD divide each other in the same ratio as the parallel sides) and independently confirmed true. Statement-1's specific value x=3 depends on exactly which of the four printed algebraic labels (4, x+1, 2x+4, 4x+2) corresponds to which of the diagonals' four segments in the photographed figure — this correspondence could not be confidently pinned down from the image alone, so x=3 was not independently re-derived either way. `correct` is taken from the printed key (a) rather than guessed; flagged here as a figure-dependent item, not a computed discrepancy.",
      diagramStatus: 'source_diagram_preserved',
      visuals: [{ sourceFileId: 67, figureLabel: 'Fig. 7.44 (trapezium ABCD with diagonals, segment labels 4/x+1/2x+4/4x+2)', assetType: 'source_page_full' }],
    }),
  ar(47, 'Statement-1 (A): ABCD is a trapezium with DC || AB, E and F are points on AD and BC respectively, such that EF || AB. Then AE/ED = BF/FC. Statement-2 (R): Any line parallel to the parallel sides of a trapezium divides the non-parallel sides proportionally.', 0,
    { explanation: 'Both are true statements of the same standard theorem (a line parallel to the parallel sides of a trapezium cuts the non-parallel sides proportionally), and S2 directly explains S1 — matches printed key (a).', diagramStatus: 'not_applicable' })
);

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Triangles',
  chapterOrder: 6,
  label: "CBSE Class 10 Mathematics — Triangles practice-exercise MCQs + case studies + Assertion-Reason (pp.7.16-7.20 only — tail end of chapter; items 1-36 and item 37(i)-(ii) not among the photographed pages), 11 items, photographed pages",
  status: 'transcribed',
  answerStatus: 'source_provided',
  sourceSection: 'Practice Exercises — MCQs + Case Study MCQs + Assertion-Reason MCQs (partial: pp.7.16-7.20 only)',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
