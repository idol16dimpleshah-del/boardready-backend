// CBSE Class 10 Mathematics — Introduction to Trigonometry (Chapter 9,
// "Trigonometric Ratios" in the source book) — GAP-FILL ingestion.
// Source: ch9-11.pdf (source_files.id 122), pp.9.10-9.12, items 3-26.
//
// CONTEXT: this book's "Trigonometric Ratios" chapter (37 items total:
// 1-31 plain MCQs, 32-34 case studies, 35-37 assertion-reason) was
// PARTIALLY captured earlier this session from an older, separate
// "32-image batch" source — but that batch was itself missing a
// photographed page, so only items 1-2 and 27-37 made it in (see
// source_documents id 148, "PARTIAL ... p.9.12 items 3-26 missing").
// Items 1-2 and 27-37 already exist in chapter_id 78 and are NOT
// duplicated here. ch9-11.pdf contains the complete chapter (confirmed
// by reading its own page images and its own answer key, which ends at
// item 37, matching exactly), so it was used specifically to fill this
// known gap: items 3-26 (24 items), all plain MCQs, none referencing a
// named figure except items 25 and 26 (Figs. 9.17, 9.18).
//
// NOTE ON THE REST OF ch9-11.pdf: this same PDF's Trigonometric Ratios
// items 1-2/27-37 and its entire Trigonometric Identities chapter
// (pp.10.6-10.9, items 1-46) and Heights and Distances chapter
// (pp.11.10-11.14, items 1-31) were checked against the DB and found to
// be verbatim the SAME textbook content, at the SAME page numbers,
// already fully ingested from the older 32-image batch (source_documents
// ids 146, 147) with zero gaps — so nothing further was extracted from
// this PDF beyond this one gap-fill. See PROJECT_PROGRESS.md's founder
// target-counts section for the full reconciliation.
//
// VERIFICATION METHOD: every one of these 24 items was independently
// recomputed by direct trigonometric algebra/identity manipulation
// (dividing by cosθ, Pythagorean identities, double-angle formulas,
// or converting a given ratio into a right-triangle side ratio) rather
// than copied from the printed key. All 24 matched the printed key
// exactly (cross-checked against the OCR'd answer-key text extracted
// via pypdf, itself independently confirmed digit-by-digit against the
// two already-ingested boundary items 1-2 and 27-28, which matched
// perfectly). Items 25 and 26 (figure-based) required reconstructing
// the figures' geometry from the rendered page image:
//   - Item 25 (Fig. 9.17): two right triangles share vertex C, with
//     φ = angle DCE and θ = angle ACB on either side of a marked 90°
//     (angle DCA), so φ and θ are complementary. Triangle ABC (right
//     angle at B) gives tanθ=AB/CB=4/3, so cosφ=sinθ=4/5.
//   - Item 26 (Fig. 9.18): a small right triangle ABD (right angle at D,
//     legs AD=4, BD=3) gives AB=5 (3-4-5), which is then the leg of the
//     larger right triangle ACB (right angle at B, other leg CB=12),
//     giving cotθ=CB/AB=12/5 — a clean 5-12-13 construction.
const { ingestQuestions } = require('./ingest');

const SF = 122; // source_files.id for ch9-11.pdf
const P910 = '9.10', P911 = '9.11', P912 = '9.12';

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.9.15, item ${n} (independently re-verified by computation)`,
  ...opts,
});

const items = [];

items.push(mcq(3, P911, 'If 4tanβ=3, then (4sinβ-3cosβ)/(4sinβ+3cosβ)=', ['0', '1/3', '2/3', '7/25'], 0, { explanation: 'Dividing num/denom by cosβ: (4tanβ-3)/(4tanβ+3)=(3-3)/(3+3)=0.' }));
items.push(mcq(4, P911, 'If ΔABC right angled at B. If tanA=√3, then cosA cosC - sinA sinC=', ['-1', '0', '1', '√3/2'], 1, { explanation: 'tanA=√3 ⇒ A=60°; angle sum ⇒ C=30°. cosAcosC-sinAsinC=cos(A+C)=cos90°=0.' }));
items.push(mcq(5, P911, 'If the angle of ΔABC are in the ratio 1:1:2 respectively (the largest angle being angle C), then the value of (secA/cosecB) - (tanA/cotB) is', ['0', '1/2', '1', '√3/2'], 0, { explanation: 'Ratio 1:1:2 with C largest ⇒ A=B=45°,C=90°. secA/cosecB=sec45/cosec45=1; tanA/cotB=tan45/cot45=1. Difference=0.' }));
items.push(mcq(6, P911, 'If θ is an acute angle such that cosθ=3/5, then (sinθ tanθ - 1)/(2tan²θ)=', ['16/625', '1/36', '3/160', '160/3'], 2, { explanation: 'cosθ=3/5 ⇒ sinθ=4/5, tanθ=4/3. sinθtanθ-1=16/15-1=1/15. 2tan²θ=32/9. Ratio=(1/15)×(9/32)=3/160.' }));
items.push(mcq(7, P911, 'If tanθ=a/b, then (a sinθ + b cosθ)/(a sinθ - b cosθ) is equal to', ['(a²+b²)/(a²-b²)', '(a²-b²)/(a²+b²)', '(a+b)/(a-b)', '(a-b)/(a+b)'], 0, { explanation: 'Dividing num/denom by cosθ: (a tanθ+b)/(a tanθ-b)=(a²/b+b)/(a²/b-b)=(a²+b²)/(a²-b²).' }));
items.push(mcq(8, P911, 'If 5tanθ-4=0, then the value of (5sinθ-4cosθ)/(5sinθ+4cosθ) is', ['5/3', '5/6', '0', '1/6'], 2, { explanation: 'tanθ=4/5. Dividing by cosθ: (5tanθ-4)/(5tanθ+4)=(4-4)/(4+4)=0.' }));
items.push(mcq(9, P911, 'If 16cotx=12, then (sinx-cosx)/(sinx+cosx) equals', ['1/7', '3/7', '2/7', '0'], 0, { explanation: 'cotx=3/4 ⇒ tanx=4/3. Dividing by cosx: (tanx-1)/(tanx+1)=(1/3)/(7/3)=1/7.' }));
items.push(mcq(10, P911, 'If 8tanx=15, then sinx-cosx is equal to', ['8/17', '17/7', '1/17', '7/17'], 3, { explanation: 'tanx=15/8 gives the 8-15-17 triple: sinx=15/17, cosx=8/17. Difference=7/17.' }));
items.push(mcq(11, P911, 'If tanθ=1/√7, then (cosec²θ-sec²θ)/(cosec²θ+sec²θ)=', ['5/7', '3/7', '1/12', '3/4'], 3, { explanation: 'cosec²θ=1+cot²θ=1+7=8. sec²θ=1+tan²θ=8/7. (8-8/7)/(8+8/7)=(48/7)/(64/7)=3/4.' }));
items.push(mcq(12, P911, 'If tanθ=3/4, then cos²θ-sin²θ=', ['7/25', '1', '-7/25', '4/25'], 0, { explanation: '3-4-5 triangle: sinθ=3/5, cosθ=4/5. cos²θ-sin²θ=16/25-9/25=7/25.' }));
items.push(mcq(13, P911, 'If θ is an acute angle such that tan²θ=8/7, then the value of (1+sinθ)(1-sinθ)/[(1+cosθ)(1-cosθ)] is', ['7/8', '8/7', '7/4', '64/49'], 0, { explanation: '(1-sin²θ)/(1-cos²θ)=cos²θ/sin²θ=cot²θ=1/tan²θ=7/8.' }));
items.push(mcq(14, P911, 'If 3cosθ=5sinθ, then the value of (5sinθ-2sec³θ+2cosθ)/(5sinθ+2sec³θ-2cosθ) is', ['271/979', '316/2937', '542/2937', 'none of these'], 0, { explanation: 'tanθ=3/5 gives a right triangle with legs 3,5 and hypotenuse √34. Direct substitution (sinθ=3/√34, cosθ=5/√34, secθ=√34/5) simplifies the ratio to 813/2937=271/979 after cancelling a common factor of 3.' }));
items.push(mcq(15, P911, 'If tan²45° - cos²30° = x sin45°cos45°, then x=', ['2', '-2', '-1/2', '1/2'], 3, { explanation: 'tan²45°=1, cos²30°=3/4, LHS=1/4. sin45°cos45°=1/2. x×1/2=1/4 ⇒ x=1/2.' }));
items.push(mcq(16, P912, 'If [x cosec²30° sec²45°] / [8cos²45° sin²60°] = tan²60° - tan²30°, then x=', ['1', '-1', '2', '0'], 0, { explanation: 'cosec²30=4, sec²45=2, cos²45=1/2, sin²60=3/4. LHS=8x/(8×3/8)=8x/3. RHS=3-1/3=8/3. So x=1.' }));
items.push(mcq(17, P912, 'If x tan45°cos60° = sin60°cot60°, then x is equal to', ['1', '√3', '1/3', '1/√2'], 0, { explanation: 'LHS=x×1×1/2=x/2. RHS=(√3/2)(1/√3)=1/2. So x=1.' }));
items.push(mcq(18, P912, 'If angles A, B, C of a ΔABC form an increasing AP, then sinB=', ['1/2', '√3/2', '1', '1/√2'], 1, { explanation: 'AP with B as middle term: 2B=A+C, and A+B+C=180° ⇒ 3B=180° ⇒ B=60°, sinB=√3/2.' }));
items.push(mcq(19, P912, 'If θ is an acute angle such that sec²θ=3, then the value of (tan²θ-cosec²θ)/(tan²θ+cosec²θ) is', ['4/7', '3/7', '2/7', '1/7'], 3, { explanation: 'tan²θ=2. sin²θ=1-1/3=2/3 ⇒ cosec²θ=3/2. (2-3/2)/(2+3/2)=(1/2)/(7/2)=1/7.' }));
items.push(mcq(20, P912, '2tan30°/(1+tan²30°) is equal to', ['sin60°', 'cos60°', 'tan60°', 'sin30°'], 0, { explanation: 'Double-angle identity 2tanθ/(1+tan²θ)=sin2θ, with θ=30° gives sin60°.' }));
items.push(mcq(21, P912, '(1-tan²45°)/(1+tan²45°) is equal to', ['tan90°', '1', 'sin45°', 'sin0°'], 3, { source: 'NCERT', explanation: 'Double-angle identity (1-tan²θ)/(1+tan²θ)=cos2θ, with θ=45° gives cos90°=0=sin0°.' }));
items.push(mcq(22, P912, 'sin2A=2sinA is true when A=', ['0°', '30°', '45°', '60°'], 0, { source: 'NCERT', explanation: 'sin2A=2sinAcosA=2sinA ⇒ sinA(cosA-1)=0 ⇒ sinA=0 or cosA=1, both giving A=0°.' }));
items.push(mcq(23, P912, '2tan30°/(1-tan²30°) is equal to', ['cos60°', 'sin60°', 'tan60°', 'sin30°'], 2, { source: 'NCERT', explanation: 'Double-angle identity 2tanθ/(1-tan²θ)=tan2θ, with θ=30° gives tan60°.' }));
items.push(mcq(24, P912, 'If cosθ=2/3, then 2sec²θ+2tan²θ-7 is equal to', ['1', '0', '3', '4'], 1, { explanation: 'sec²θ=9/4, tan²θ=sec²θ-1=5/4. 2×9/4+2×5/4-7=18/4+10/4-7=7-7=0.' }));
items.push(mcq(25, P912, 'In Fig. 9.17, the value of cosφ is', ['5/4', '5/3', '3/5', '4/5'], 3, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 9.17 (two right triangles sharing vertex C: DEC with φ, ACB with θ, and a marked 90° between them; DC=5, CB=3, AB=4)', assetType: 'source_page_full' }],
  explanation: 'φ (=∠DCE) and θ (=∠ACB) lie on either side of the marked 90° (∠DCA) along the straight line E-C-B, so φ+90°+θ=180°, i.e. φ and θ are complementary. In right ΔABC (right angle at B), tanθ=AB/CB=4/3, so sinθ=4/5. cosφ=sinθ=4/5.',
}));
items.push(mcq(26, P912, 'In Fig. 9.18, if AD=4 cm, BD=3 cm and CB=12 cm, then cotθ=', ['12/5', '5/12', '13/12', '12/13'], 0, {
  source: 'CBSE 2008',
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 9.18 (ΔACB right-angled at B with θ at C; auxiliary right triangle ABD, right-angled at D, hangs off vertex B with AD=4, BD=3)', assetType: 'source_page_full' }],
  explanation: 'Auxiliary right ΔABD (right angle at D, legs AD=4, BD=3) gives AB=5 (3-4-5 triple). In the main right ΔACB (right angle at B, legs AB=5, CB=12), cotθ=CB/AB=12/5 (a 5-12-13 triple, AC=13).',
}));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Introduction to Trigonometry',
  chapterOrder: 9,
  sourceFileIds: [SF],
  label: 'CBSE Maths Trigonometric Ratios Ch.9 GAP-FILL (ch9-11.pdf, pp.9.10-9.12, items 3-26)',
});
console.log(JSON.stringify(result, null, 2));
