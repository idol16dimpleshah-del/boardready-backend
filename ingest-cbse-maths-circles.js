// CBSE Class 10 Mathematics — Circles (Chapter 8) practice-exercise MCQs.
// Source: 10 photographed pages (pp.8.13-8.22), part of the 32-image
// batch received 2026-09-17 (see PROJECT_PROGRESS.md's "Large new upload
// batch" note). Archived via archive-pending-batch-2026-09-17.js,
// reclassified to proper chapter/page stable_ids via
// reclassify-pending-batch-2026-09-17.js once every page's exact content
// was individually re-confirmed this session (the original guesses were
// unconfirmed and, in several cases, wrong about which chapter a page
// belonged to).
//
// COMPLETE CHAPTER: all 70 items (pp.8.13-8.21) plus the full printed
// answer key (p.8.22) were captured — no gaps.
//
// VERIFICATION METHOD: every answer independently recomputed from the
// given lengths/angles using standard circle-geometry theorems (tangent
// length = sqrt(d^2-r^2), tangent perpendicular to radius, Pitot's
// theorem for tangential quadrilaterals, tangent-chord angle = angle in
// alternate segment, angle between two tangents = 180 - central angle,
// etc.), not copied blindly from the printed key. Every recomputed value
// matched the printed key exactly across all 70 items and all case-study
// sub-parts — a clean chapter, ZERO needs_review items. One deliberately
// "trick" assertion-reason item (65) has a factually WRONG Statement-1
// (asserts tangent length is 10cm when the correct computed value is
// 12cm for a 13cm/5cm right triangle) — this is intentional per the
// source's own answer key (option (d): Statement-1 false, Statement-2
// true), not a defect; independently confirmed.
//
// DIAGRAM PRESERVATION: per the founder's standing hard requirement,
// every item whose stem references a "Fig. 8.xx" gets
// diagramStatus:'source_diagram_preserved' with a visuals[] entry
// pointing at the full original photographed page (source_page_full) —
// this book crops multiple items' figures onto a shared page, so the
// full page (not a crop) is preserved to avoid losing any adjacent
// figure content, consistent with project-wide policy. Plain numeric/
// text-only items (no named figure) get diagramStatus:'not_applicable'.
const { ingestQuestions } = require('./ingest');

// source_files ids per page, from reclassify-pending-batch-2026-09-17.js
const P813 = 69, P814 = 70, P815 = 71, P816 = 72, P817 = 73, P818 = 74, P819 = 75, P820 = 76, P821 = 77;

const mcq = (n, page, sfid, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: sfid ? 'source_diagram_preserved' : 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.8.22, item ${n} (independently re-verified by computation)`,
  ...(sfid ? { visuals: [{ sourceFileId: sfid, figureLabel: opts.fig || `p.${page} figure`, assetType: 'source_page_full' }] } : {}),
  ...opts,
});

const items = [];

// p.8.13 — items 1-11, no named figures (all computable from given lengths)
items.push(mcq(1, '8.13', null, 'A tangent PQ at a point P of a circle of radius 5 cm meets a line through the centre O at a point Q such that OQ = 12 cm. Length PQ is', ['12 cm', '13 cm', '8.5 cm', '√119 cm'], 3));
items.push(mcq(2, '8.13', null, 'From a point Q, the length of the tangent to a circle is 24 cm and the distance of Q from the centre is 25 cm. The radius of the circle is', ['7 cm', '12 cm', '15 cm', '24.5 cm'], 0));
items.push(mcq(3, '8.13', null, 'The length of the tangent from a point A at a circle, of radius 3 cm, is 4 cm. The distance of A from the centre of the circle is', ['√7 cm', '7 cm', '5 cm', '25 cm'], 2));
items.push(mcq(4, '8.13', null, 'How many parallel tangents can a circle have?', ['1', '2', 'infinite', 'none of these'], 2, {
  explanation: "Printed answer: infinite. Caveat disclosed: in many CBSE textbooks this exact question is instead posed as 'the maximum number of parallel tangents in a given direction' with accepted answer 2 (only two tangents can be mutually parallel to each other in any one direction). This book's phrasing ('how many parallel tangents CAN a circle have', unrestricted to one direction) is read as counting the family of all mutually-parallel tangent pairs across every direction, which is unbounded/infinite — a defensible reading, kept as printed.",
}));
items.push(mcq(5, '8.13', null, 'If the angle between the radii of a circle is 100°, then the angle between the tangents at the end of these two radii is', ['50°', '60°', '80°', '90°'], 2));
items.push(mcq(6, '8.13', null, 'PQ is a tangent to a circle with centre O at the point P. If △OPQ is an isosceles triangle, then ∠OQP is equal to', ['30°', '45°', '60°', '90°'], 1));
items.push(mcq(7, '8.13', null, 'Two equal circles touch each other externally at C and AB is a common tangent to the circles. Then, ∠ACB =', ['60°', '45°', '30°', '90°'], 3));
items.push(mcq(8, '8.13', null, 'ABC is a right angled triangle, right angled at B such that BC = 6 cm and AB = 8 cm. A circle with centre O is inscribed in △ABC. The radius of the circle is', ['1 cm', '2 cm', '3 cm', '4 cm'], 1));
items.push(mcq(9, '8.13', null, 'PQ is a tangent drawn from a point P to a circle with centre O and QOR is a diameter of the circle such that ∠POR = 120°, then ∠OPQ is', ['60°', '45°', '30°', '90°'], 2));
items.push(mcq(10, '8.13', null, 'If four sides of a quadrilateral ABCD are tangential to a circle, then', ['AC + AD = BD + CD', 'AB + CD = BC + AD', 'AB + CD = AC + BC', 'AC + AD = BC + DB'], 1));
items.push(mcq(11, '8.13', null, 'The length of the tangent drawn from a point 8 cm away from the centre of a circle of radius 6 cm is', ['√7 cm', '2√7 cm', '10 cm', '5 cm'], 1));

// p.8.14 — items 12-21
items.push(mcq(12, '8.14', null, 'AB and CD are two common tangents to circles which touch each other at C. If D lies on AB such that CD = 4 cm, then AB is equal to', ['4 cm', '6 cm', '8 cm', '12 cm'], 2));
items.push(mcq(13, '8.14', null, 'If the angle between two radii of a circle is 130°, the angle between the tangents at the ends of the radii is', ['90°', '50°', '70°', '40°'], 1, { source: 'NCERT EXEMPLAR' }));
items.push(mcq(14, '8.14', null, 'The maximum number of common tangents that can be drawn to two circles intersecting at two distinct points is', ['1', '2', '3', '4'], 1, { source: 'CBSE 2024' }));
items.push(mcq(15, '8.14', null, 'If two perpendicular tangents PA and PB are drawn from an external point to a circle of radius 4 cm, then the length of each tangent is', ['3 cm', '4 cm', '5 cm', '6 cm'], 1));
items.push(mcq(16, '8.14', P814, "In Fig. 8.42, equal circles with centres O and O' touch each other at P. OO' is produced to meet circle C(O', r) at A. AT is a tangent to the circle C(O, r). If O'Q is perpendicular to AT, then AQ/AT =", ['2/3', '1/2', '1/4', '1/3'], 3, { fig: 'Fig. 8.42' }));
items.push(mcq(17, '8.14', P814, 'If from a point A which is at a distance of 13 cm from the centre O of a circle of radius 5 cm, the pair of tangents AB and AC to the circle are drawn, then the area of quadrilateral ABOC is', ['60 cm²', '120 cm²', '50 cm²', '80 cm²'], 0, { source: 'NCERT EXEMPLAR' }));
items.push(mcq(18, '8.14', null, 'If PA and PB are tangents to the circle with centre O such that ∠APB = 50°, then ∠OAB is equal to', ['25°', '30°', '40°', '50°'], 0));
items.push(mcq(19, '8.14', P814, 'In Fig. 8.43, AB is a diameter and AC is a chord of a circle such that ∠BAC = 30°. If DC is a tangent, then △BCD is', ['equilateral', 'right angled', 'isosceles', 'acute angled'], 2, { source: 'NCERT EXEMPLAR', fig: 'Fig. 8.43' }));
items.push(mcq(20, '8.14', P814, 'In Fig. 8.44, if AB = 12 cm, BC = 8 cm and AC = 10 cm, then AD =', ['5 cm', '4 cm', '6 cm', '7 cm'], 3, { fig: 'Fig. 8.44 (incircle of triangle ABC touching at D, E, F)' }));
items.push(mcq(21, '8.14', P814, 'In Fig. 8.45, if AP = PB, then', ['AC = AB', 'AC = BC', 'AQ = QC', 'AB = BC'], 1, { fig: 'Fig. 8.45' }));

// p.8.15 — items 22-29
items.push(mcq(22, '8.15', P815, 'In Fig. 8.46, if AP = 10 cm, then BP =', ['√91 cm', '√127 cm', '√119 cm', '√109 cm'], 1, { fig: 'Fig. 8.46' }));
items.push(mcq(23, '8.15', P815, 'In Fig. 8.47, if PR is tangent to the circle at P and Q is the centre of the circle, then ∠POQ =', ['110°', '100°', '120°', '90°'], 2, { fig: 'Fig. 8.47' }));
items.push(mcq(24, '8.15', P815, 'In Fig. 8.48, if quadrilateral PQRS circumscribes a circle, then PD + QB =', ['PQ', 'QR', 'PR', 'PS'], 0, { fig: 'Fig. 8.48' }));
items.push(mcq(25, '8.15', P815, 'In Fig. 8.49, two equal circles touch each other at T. If QP = 4.5 cm, then QR =', ['9 cm', '18 cm', '15 cm', '13.5 cm'], 0, { fig: 'Fig. 8.49' }));
items.push(mcq(26, '8.15', P815, 'In Fig. 8.50, APB is a tangent to a circle with centre O at point P. If ∠QPB = 50°, then the measure of ∠POQ is', ['100°', '120°', '140°', '150°'], 0, { source: 'CBSE Sample Paper 2024', fig: 'Fig. 8.50' }));
items.push(mcq(27, '8.15', P815, 'In Fig. 8.51, if a circle touches all four sides of a quadrilateral PQRS, whose sides are PQ = 6.5 cm, QR = 7.3 cm and PS = 4.2 cm. Then RS =', ['4.7 cm', '5.3 cm', '5 cm', '7.3 cm'], 2, { fig: 'Fig. 8.51' }));
items.push(mcq(28, '8.15', P815, 'In Fig. 8.52, PR =', ['20 cm', '26 cm', '24 cm', '28 cm'], 1, { fig: 'Fig. 8.52' }));
items.push(mcq(29, '8.15', P815, "Two circles of same radii r and centres O and O' touch each other at P as shown in Fig. 8.53. If OO' is produced to meet the circle C(O', r) at A and AT is a tangent to the circle C(O, r) such that O'Q ⊥ AT. Then AO : AO' =", ['3/2', '2', '3', '1/4'], 2, { fig: 'Fig. 8.53' }));

// p.8.16 — items 30-36
items.push(mcq(30, '8.16', P816, 'In Fig. 8.54, two concentric circles of radii 3 cm and 5 cm are given. Then length of chord BC which touches the inner circle at P is equal to', ['4 cm', '6 cm', '8 cm', '10 cm'], 2, { source: 'CBSE 2014', fig: 'Fig. 8.54' }));
items.push(mcq(31, '8.16', P816, 'In Fig. 8.55, there are two concentric circles with centre O. PR and PQS are tangents to the inner circle from point lying on the outer circle. If PR = 7.5 cm, then PS is equal to', ['10 cm', '12 cm', '15 cm', '18 cm'], 2, { fig: 'Fig. 8.55' }));
items.push(mcq(32, '8.16', P816, 'In Fig. 8.56, if AB = 8 cm and PE = 3 cm, then AE =', ['11 cm', '7 cm', '5 cm', '3 cm'], 2, { fig: 'Fig. 8.56' }));
items.push(mcq(33, '8.16', P816, 'In Fig. 8.57, PQ and PR are tangents drawn from P to a circle with centre O. If ∠OPQ = 35°, then', ['a = 30°, b = 60°', 'a = 35°, b = 55°', 'a = 40°, b = 50°', 'a = 45°, b = 45°'], 1, { fig: 'Fig. 8.57' }));
items.push(mcq(34, '8.16', P816, 'In Fig. 8.58, if TP and TQ are tangents drawn from an external point T to a circle with centre O such that ∠TQP = 60°, then ∠OPQ =', ['25°', '30°', '40°', '60°'], 1, { fig: 'Fig. 8.58' }));
items.push(mcq(35, '8.16', P816, 'In Fig. 8.59, the sides AB, BC and CA of triangle ABC, touch a circle at P, Q and R respectively. If PA = 4 cm, BP = 3 cm and AC = 11 cm then length of BC is', ['11 cm', '10 cm', '14 cm', '15 cm'], 1, { source: 'CBSE 2012', fig: 'Fig. 8.59' }));
items.push(mcq(36, '8.16', P816, 'In Fig. 8.60, a circle touches the side DF of △EDF at H and touches ED and EF produced at K and M respectively. If EK = 9 cm, then the perimeter of △EDF is', ['18 cm', '13.5 cm', '12 cm', '9 cm'], 0, { source: 'CBSE 2012', fig: 'Fig. 8.60' }));

// p.8.17 — items 37-43
items.push(mcq(37, '8.17', P817, 'In Fig. 8.61, DE and DF are tangents from an external point D to a circle with centre A. If DE = 5 cm and DE ⊥ DF, then the radius of the circle is', ['3 cm', '5 cm', '4 cm', '6 cm'], 1, { source: 'CBSE 2013', fig: 'Fig. 8.61' }));
items.push(mcq(38, '8.17', P817, 'In Fig. 8.62, a circle with centre O is inscribed in a quadrilateral ABCD such that it touches sides BC, AB, AD and CD at points P, Q, R and S respectively. If AB = 29 cm, AD = 23 cm, ∠B = 90° and DS = 5 cm, then the radius of the circle (in cm) is', ['11', '18', '6', '15'], 0, { source: 'CBSE 2013', fig: 'Fig. 8.62' }));
items.push(mcq(39, '8.17', null, 'In a right triangle ABC, right angled at B, BC = 12 cm and AB = 5 cm. The radius of the circle inscribed in the triangle (in cm) is', ['4', '3', '2', '1'], 2, { source: 'CBSE 2014' }));
items.push(mcq(40, '8.17', null, 'Two circles touch each other externally at P. AB is a common tangent to the circle touching them at A and B. The value of ∠APB is', ['30°', '45°', '60°', '90°'], 3, { source: 'CBSE 2014' }));
items.push(mcq(41, '8.17', P817, 'In Fig. 8.63, PQ and PR are two tangents to a circle with centre O. If ∠QPR = 46°, then ∠QOR equals', ['67°', '134°', '44°', '46°'], 1, { source: 'CBSE 2014', fig: 'Fig. 8.63' }));
items.push(mcq(42, '8.17', P817, 'In Fig. 8.64, QR is a common tangent to the given circles touching externally at the point T. The tangent at T meets QR at P. If PT = 3.8 cm, then the length of QR (in cm) is', ['3.8', '7.6', '5.7', '1.9'], 1, { source: 'CBSE 2014, 2024', fig: 'Fig. 8.64' }));
items.push(mcq(43, '8.17', P817, 'In Fig. 8.65, a quadrilateral ABCD is drawn to circumscribe a circle such that its sides AB, BC, CD and AD touch the circle at P, Q, R and S respectively. If AB = x cm, BC = 7 cm, CR = 3 cm and AS = 5 cm, then x =', ['10', '9', '8', '7'], 1, { source: 'CBSE 2014', fig: 'Fig. 8.65' }));

// p.8.18 — items 44-53 (item 53's figure is on p.8.19)
items.push(mcq(44, '8.18', P817, 'In Fig. 8.66, if AD, AE and BC are tangents to the circle at D, E and F respectively. Then,', ['AD = AB + BC + CA', '2AD = AB + BC + CA', '3AD = AB + BC + CA', '4AD = AB + BC + CA'], 1, { fig: 'Fig. 8.66 (bottom of p.8.17, belongs to this item)' }));
items.push(mcq(45, '8.18', P818, 'In Fig. 8.67, RQ is a tangent to the circle with centre O. If SQ = 6 cm and QR = 4 cm, then OR =', ['8 cm', '3 cm', '2.5 cm', '5 cm'], 3, { fig: 'Fig. 8.67' }));
items.push(mcq(46, '8.18', P818, 'In Fig. 8.68, the perimeter of △ABC is', ['30 cm', '60 cm', '45 cm', '15 cm'], 0, { fig: 'Fig. 8.68' }));
items.push(mcq(47, '8.18', P818, "In Fig. 8.69, AP is a tangent to the circle with centre O such that OP = 4 cm and ∠OPA = 30°. Then, AP =", ['2√2 cm', '2 cm', '2√3 cm', '3√2 cm'], 2, { source: 'NCERT EXEMPLAR', fig: 'Fig. 8.69' }));
items.push(mcq(48, '8.18', null, 'AP and AQ are tangents drawn from a point A to a circle with centre O and radius 9 cm. If OA = 15 cm, then AP + AQ =', ['12 cm', '18 cm', '24 cm', '36 cm'], 2));
items.push(mcq(49, '8.18', null, 'At one end of a diameter PQ of a circle of radius 5 cm, tangent XPY is drawn to the circle. The length of chord AB parallel to XY and at a distance of 8 cm from P is', ['5 cm', '6 cm', '7 cm', '8 cm'], 3));
items.push(mcq(50, '8.18', null, 'If PT is a tangent drawn from a point P to a circle touching it at T and O is the centre of the circle, then ∠OPT + ∠POT =', ['30°', '60°', '90°', '180°'], 2));
items.push(mcq(51, '8.18', P818, 'In Fig. 8.70, if quadrilateral PQRS circumscribes a circle, then', ['x = 95°, y = 95°', 'x = 100°, y = 90°', 'x = 100°, y = 85°', 'x = 85°, y = 90°'], 2, { fig: 'Fig. 8.70' }));
items.push(mcq(52, '8.18', P818, 'In Fig. 8.71, perimeter of quadrilateral ABCD is', ['28 cm', '34 cm', '48 cm', '36 cm'], 1, { fig: 'Fig. 8.71' }));
items.push(mcq(53, '8.18', P819, 'In Fig. 8.72, if AQ = 4 cm, QR = 7 cm, DS = 3 cm, then x =', ['6 cm', '8 cm', '11 cm', '10 cm'], 0, { fig: 'Fig. 8.72 (shown at top of p.8.19)' }));

// p.8.19 — items 54-61
items.push(mcq(54, '8.19', P819, 'In Fig. 8.73, quadrilateral ABCD is circumscribed, touching the circle at P, Q, R and S such that ∠DAB = 90°. If CR = 23 cm, CB = 39 cm and the radius of the circle is 14 cm, then AB =', ['16 cm', '39 cm', '37 cm', '30 cm'], 3, { fig: 'Fig. 8.73' }));
items.push(mcq(55, '8.19', null, 'Two circles touch each other externally at P. AB is a common tangent to the circles touching them at A and B. Then, ∠APB =', ['30°', '45°', '60°', '90°'], 3));
items.push(mcq(56, '8.19', P819, 'In Fig. 8.74, if OC = 9 cm and OB = 15 cm, then BC + BD =', ['18 cm', '12 cm', '24 cm', '36 cm'], 2, { fig: 'Fig. 8.74' }));
items.push(mcq(57, '8.19', P819, 'In Fig. 8.75, AB and CD are two chords of a circle intersecting at P. Choose the correct statement from the following:', ['△ADP ~ △CBA', '△ADP ~ △BPC', '△ADP ~ △BCP', '△ADP ~ △CBP'], 3, { source: 'CBSE 2024', fig: 'Fig. 8.75' }));
items.push(mcq(58, '8.19', P819, 'In Fig. 8.76, tangents PA and PB to the circle centred at O, from point P, are perpendicular to each other. If PA = 5 cm, then the length of AB is equal to', ['5 cm', '5√2 cm', '2√5 cm', '10 cm'], 1, { source: 'CBSE 2024', fig: 'Fig. 8.76' }));
items.push(mcq(59, '8.19', P819, 'In Fig. 8.77, AT is tangent to a circle centred at O. If ∠CAT = 40°, then ∠CBA is equal to', ['70°', '50°', '65°', '40°'], 3, { source: 'CBSE 2024', fig: 'Fig. 8.77' }));
items.push(mcq(60, '8.19', P819, 'In Fig. 8.78, AB and AC are tangents to the circle. If ∠ABC = 42°, then the measure of ∠BAC is', ['96°', '42°', '106°', '86°'], 0, { source: 'CBSE 2024', fig: 'Fig. 8.78' }));
items.push(mcq(61, '8.19', null, 'A chord of a circle of radius 10 cm subtends a right angle at its centre. The length of the chord is', ['5√2 cm', '10√2 cm', '5/√2 cm', '5 cm'], 1, { source: 'CBSE 2024' }));

// p.8.20 — item 62 + Case Study MCQs 63, 64
items.push(mcq(62, '8.20', null, 'A line which intersects a circle in two distinct points is called a', ['chord', 'tangent', 'secant', 'diameter'], 2, { source: 'CBSE 2024' }));

items.push({
  kind: 'case', sourceQuestionNumber: '63', sourcePage: '8.20',
  text: 'A solar eclipse occurs when the Moon passes between the Earth and the Sun. Fig. 8.79 represents the total and partial eclipse: circle with centre O and points P, Q on it (Sun), Moon at A/B/C, Earth beyond, umbra (total eclipse) and penumbra (partial eclipse) regions shown.',
  parts: [
    { text: '(i) The tangents to the Moon surface from the point A are', options: ['AB and AC', 'AP and AQ', 'AP and AB', 'AQ and AC'], correct: 0, marks: 1 },
    { text: '(ii) If ∠PAQ = 40°, then the measure of ∠POQ is', options: ['70°', '40°', '50°', '140°'], correct: 3, marks: 1 },
    { text: '(iii) If ∠POQ = 110°, then ∠QAO =', options: ['55°', '35°', '70°', '110°'], correct: 1, marks: 1 },
    { text: '(iv) If ∠POQ = 130°, then ∠OPQ =', options: ['130°', '50°', '65°', '25°'], correct: 3, marks: 1 },
    { text: '(v) If OP = 9 units and O is at a distance of 41 units from the point A, then the lengths of tangents AP and AQ are', options: ['40 cm and 20 cm', '20 cm and 40 cm', '40 cm each', '40 cm and 80 cm'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: P820, figureLabel: 'Fig. 8.79 (solar eclipse diagram)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.8.22, item 63 (independently re-verified: (ii) quadrilateral APOQ angle sum; (iii)-(iv) isosceles triangle OPQ; (v) Pythagoras 41-9-40)',
  explanation: '(i) AB, AC are the two tangent lines from A. (ii) In quadrilateral APOQ, ∠P=∠Q=90°(tangent⊥radius), so ∠POQ=360-90-90-40=140°. (iii) △OPQ is isosceles (OP=OQ=radius); ∠OPQ=∠OQP=(180-110)/2=35°, and by symmetry OA bisects ∠POQ so ∠AOQ=55°, giving ∠QAO=90-55=35°. (iv) similarly ∠OPQ=(180-130)/2=25°. (v) AP=√(41²-9²)=√1600=40, and AP=AQ (equal tangents).',
});

items.push({
  kind: 'case', sourceQuestionNumber: '64', sourcePage: '8.20',
  text: 'The chain and gears of bicycles or motorcycles, or a belt around pulleys, are real-life illustrations of tangents to circles (Fig. 8.80: triangle-like tangent diagram with points P, I, X, Z, A, O; a chain-and-gear diagram; a belt-and-pulley diagram).',
  parts: [
    { text: '(i) PI and PA are tangents to the circle from point P. If arc IZA subtends an angle of 240° at the centre of the circle, then ∠IPA =', options: ['120°', '90°', '60°', '30°'], correct: 2, marks: 1 },
    { text: '(ii) If IP = 15 cm, then AI =', options: ['7.5 cm', '15 cm', '30 cm', '18 cm'], correct: 1, marks: 1 },
    { text: '(iii) If IP = 21 cm and measure of AP is x² + 5, then x =', options: ['4', '16', '√26', '√30'], correct: 0, marks: 1 },
    { text: '(iv) ∠OIP + ∠APO =', options: ['90°', '60°', '120°', '150°'], correct: 2, marks: 1 },
    { text: '(v) Measures of arcs ẐIZA and ẐIXA are in the ratio', options: ['4 : 1', '3 : 1', '2 : 1', '1 : 1'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [
    { sourceFileId: P820, figureLabel: 'Fig. 8.80 (tangent diagram, bicycle chain/gears, belt/pulleys)', assetType: 'source_page_full' },
    { sourceFileId: P821, figureLabel: 'Fig. 8.80 continued (item 64(v))', assetType: 'source_page_full' },
  ],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.8.22, item 64 (independently re-verified: (i) tangent-tangent angle = 180 - minor arc; (iii) PI=PA equal tangents; (v) 240:120 = 2:1)',
  explanation: '(i) Minor arc IA = 360-240=120°, so ∠IPA = 180-120=60°. (iii) PI and PA are tangents from the same external point P, so PI=PA ⇒ x²+5=21 ⇒ x²=16 ⇒ x=4. (v) Arc IZA=240°, arc IXA=360-240=120°, ratio 240:120=2:1.',
});

// p.8.21 — Case Study 64(v) already above; Assertion-Reason MCQs 65-70
const AR_INSTRUCTIONS = 'Each of the following contains STATEMENT-1 (Assertion) and STATEMENT-2 (Reason), with choices: (a) both true, Statement-2 correctly explains Statement-1; (b) both true, Statement-2 does NOT correctly explain Statement-1; (c) Statement-1 true, Statement-2 false; (d) Statement-1 false, Statement-2 true.';

items.push(mcq(65, '8.21', null, `${AR_INSTRUCTIONS} Statement-1 (A): The length of the tangent drawn from a point at a distance of 13 cm from the centre of a circle of radius 5 cm is 10 cm. Statement-2 (R): A tangent to a circle is perpendicular to the radius through the point of contact.`, ['(a)', '(b)', '(c)', '(d)'], 3, {
  explanation: 'Statement-1 is actually FALSE by direct computation: tangent length = √(13²-5²) = √144 = 12 cm, not 10 cm. Statement-2 is a true general theorem. So Statement-1 is false, Statement-2 is true — option (d), matching the printed key. This is a deliberately "trick" assertion (the source intends the wrong number in Statement-1), not a defect.',
}));
items.push(mcq(66, '8.21', null, `${AR_INSTRUCTIONS} Statement-1 (A): A tangent to a circle is perpendicular to the radius through the point of contact. Statement-2 (R): The lengths of tangents drawn from an external point to a circle are equal.`, ['(a)', '(b)', '(c)', '(d)'], 1, { source: 'CBSE 2023' }));
items.push(mcq(67, '8.21', P821, `${AR_INSTRUCTIONS} Statement-1 (A): In Fig. 8.81, PA and PB are tangents drawn from an external point P to a circle with centre O. If ∠APB = 80°, then ∠AOB = 100°. Statement-2 (R): The angle between two tangents drawn from an external point to a circle is supplementary to the angle subtended by the line segments joining the points of contact at the centre.`, ['(a)', '(b)', '(c)', '(d)'], 0, { fig: 'Fig. 8.81' }));
items.push(mcq(68, '8.21', null, `${AR_INSTRUCTIONS} Statement-1 (A): If PA and PB are tangents drawn from an external point P to a circle with centre O, then the quadrilateral AOBP is cyclic. Statement-2 (R): The angle between two tangents drawn from an external point to a circle is supplementary to the angle subtended by the line segments joining the points of contact at the centre.`, ['(a)', '(b)', '(c)', '(d)'], 0));
items.push(mcq(69, '8.21', P821, `${AR_INSTRUCTIONS} Statement-1 (A): In Fig. 8.82, PA and PB are tangents drawn from an external point P to a circle with centre O such that ∠APB = 40°. If C is a point on the circle, then ∠ACB = 70°. Statement-2 (R): The tangents drawn at the end points of a diameter of a circle are parallel.`, ['(a)', '(b)', '(c)', '(d)'], 1, { source: 'CBSE 2024', fig: 'Fig. 8.82' }));
items.push(mcq(70, '8.21', null, `${AR_INSTRUCTIONS} Statement-1 (A): The tangents drawn at the end points of a diameter of a circle are parallel. Statement-2 (R): Diameter of a circle is the longest chord.`, ['(a)', '(b)', '(c)', '(d)'], 1));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Circles',
  chapterOrder: 8,
  sourceFileIds: [P813, P814, P815, P816, P817, P818, P819, P820, P821],
  label: 'CBSE Maths Circles Ch.8 (32-image batch, pp.8.13-8.21, reclassified 2026-09-17)',
});

console.log(JSON.stringify(result, null, 2));
