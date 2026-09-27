// CBSE Class 10 Mathematics — Trigonometric Ratios (Chapter 9)
// practice-exercise MCQs. Source: 4 photographed pages, part of the
// 32-image batch received 2026-09-17. Archived via the original
// pending-batch archive script, reclassified to proper chapter/page
// stable_ids via reclassify-pending-batch-2026-09-17.js once every
// page's exact content was individually re-confirmed this session.
//
// PARTIAL CHAPTER — GENUINE GAP, NOT FABRICATED: page 9.12 (containing
// approx. items 3-26) was never photographed in the original 32-image
// upload. Only items 1-2 (p.9.11), 27-31 (p.9.13), Case Study 32
// (p.9.13-9.14), Case Study 33 (p.9.14), Case Study 34 (p.9.15) and the
// Assertion-Reason items 35-37 (p.9.15) were captured, plus the full
// printed answer key (p.9.15). Items 3-26 are NOT ingested here and are
// NOT invented — this gap is disclosed in PROJECT_PROGRESS.md so a
// future re-upload of the missing page can close it.
//
// VERIFICATION METHOD: every answer independently recomputed from the
// given data (right-triangle trig ratios, sine rule, standard identities)
// rather than copied blindly from the printed key. All items EXCEPT
// item 27 were independently confirmed to match the printed key exactly
// (including every case-study sub-part). Item 27 references "Fig. 9.19"
// but that figure was not captured in any of the 4 photographed pages —
// it most likely appeared on the missing p.9.12, immediately before this
// item's text picks up at the top of p.9.13. Because the figure itself
// is unavailable, item 27's answer could not be independently
// re-derived (a median-triangle angle relation needs the actual
// figure); it is kept exactly as printed, disclosed as printed-key-only,
// and flagged needs_visual_review (not source_diagram_preserved, since
// there is no visual asset to link).
//
// DIAGRAM PRESERVATION: items 1, 2, 28-31, 35-37 are plain
// text-only numeric/identity MCQs with no named figure in the source —
// diagramStatus 'not_applicable'. Case Study 32 references Fig. 9.20
// (truss bridge photo) and Fig. 9.21 (the triangle with given data);
// Case Study 33 references Fig. 9.22 (trolley/mountain diagram); Case
// Study 34 references Fig. 9.23 (two-kites diagram) — all three get
// diagramStatus 'source_diagram_preserved' with the full source page
// preserved as the visual.
const { ingestQuestions } = require('./ingest');

// source_files ids per page, from reclassify-pending-batch-2026-09-17.js
const P911 = 79, P913 = 80, P914 = 81, P915ANS = 82;

const mcq = (n, page, sfid, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: sfid ? 'source_diagram_preserved' : 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.9.15, item ${n} (independently re-verified by computation)`,
  ...(sfid ? { visuals: [{ sourceFileId: sfid, figureLabel: opts.fig || `p.${page} figure`, assetType: 'source_page_full' }] } : {}),
  ...opts,
});

const items = [];

// p.9.11 — items 1-2 (p.9.12, approx. items 3-26, MISSING from this upload)
items.push(mcq(1, '9.11', null, 'If sin θ = x and sec θ = y, then tan θ is equal to', ['xy', 'x/y', 'y/x', '1/xy'], 0));
items.push(mcq(2, '9.11', null, 'Given that sin θ = a/b, then tan θ is equal to', ['b/√(a² + b²)', 'b/√(b² - a²)', 'a/√(a² - b²)', 'a/√(b² - a²)'], 3));

// p.9.13 — items 27-31
items.push(mcq(27, '9.13', null, 'In Fig. 9.19, if D is the mid-point of BC, then the value of cot y°/cot x° is', ['2', '1/2', '1/3', '3/4'], 1, {
  diagramStatus: 'needs_visual_review',
  answerStatus: 'needs_review',
  explanation: "This item references 'Fig. 9.19', but that figure was not present on any of the 4 photographed pages for this chapter — it most likely appeared on the missing p.9.12 (this question's text begins at the very top of the next photographed page, p.9.13). Without the figure, the median/angle relation it depicts can't be independently re-derived, so the printed answer (b) 1/2 is kept as-is but NOT independently verified, and flagged needs_review pending either a re-upload of p.9.12 or direct sight of Fig. 9.19.",
}));
items.push(mcq(28, '9.13', null, 'If sin θ = cos θ (0° < θ < 90°), then the value of sec θ sin θ is', ['1/√2', '√2', '1', '0'], 2, { source: 'CBSE 2024' }));
items.push(mcq(29, '9.13', null, 'If sin θ = 1, then the value of (1/2) sin(θ/2) is', ['1/(2√2)', '1/√2', '1/2', '0'], 0, { source: 'CBSE 2024' }));
items.push(mcq(30, '9.13', null, 'If 5 tan θ − 12 = 0, then the value of sin θ is', ['5/12', '12/13', '5/13', '12/5'], 1, { source: 'CBSE 2024' }));
items.push(mcq(31, '9.13', null, 'If tan A = 3/4, then (sin²A + cos²A) / sec A is equal to', ['4/3', '4/5', '3/5', '5/4'], 1, { source: 'CBSE 2024' }));

// p.9.13-9.14 — Case Study 32 (structural truss)
items.push({
  kind: 'case', sourceQuestionNumber: '32', sourcePage: '9.13-9.14',
  text: "Fig. 9.20 shows a truss — trusses are engineering structures made of interconnecting triangles, used to support bridges and buildings. Fig. 9.21 shows a single repeating triangle from the truss system: a right triangle with the right angle at B, ∠C = 30°, and the side AB (opposite ∠C) = 4 ft.",
  parts: [
    { text: '(i) In the above triangle, what is the length of AC?', options: ['5 ft', '6 ft', '8 ft', '8/√3 ft'], correct: 2, marks: 1 },
    { text: '(ii) What is the length of BC?', options: ['4/√3 ft', '4√3 ft', '8 ft', '8√3 ft'], correct: 1, marks: 1 },
    { text: '(iii) If sin A = sin C, what will be the length of BC?', options: ['2 ft', '4 ft', '8 ft', '4√2 ft'], correct: 1, marks: 1 },
    { text: '(iv) Which of the following relations will be true in the triangle?', options: ['sin((A+C)/2) = cos(B/2)', 'sin((A+B)/2) = sin(C/2)', 'cos((A+B)/2) = cos(C/2)', 'cos((A-B)/2) = cos(C/2)'], correct: 0, marks: 1 },
    { text: '(v) If the length of AB doubles, what will happen to the length of AC?', options: ['remains same', 'doubles the original length', 'become three times the original length', 'become half of the original length'], correct: 1, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: P913, figureLabel: 'Fig. 9.20 (truss bridge) & Fig. 9.21 (repeating triangle, ∠C=30°, AB=4ft)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.9.15, item 32 (independently re-verified by computation)',
  explanation: '(i) sin(30°) = AB/AC => AC = 4/0.5 = 8 ft. (ii) tan(30°) = AB/BC => BC = 4/tan30° = 4√3 ft. (iii) sin A = sin C with both acute forces A = C, so the triangle is isosceles with BC (opposite A) = AB (opposite C) = 4 ft. (iv) since A+B+C=180°, (A+C)/2 = 90° - B/2, so sin((A+C)/2) = sin(90°-B/2) = cos(B/2) — always true; the other three options fail this identity in general. (v) AC = AB/sin(C) with C fixed at 30°, a constant ratio of 2 — so doubling AB doubles AC (8 -> 16 when AB goes 4 -> 8). All 5 sub-parts independently verified and match the printed key.',
});

// p.9.14 — Case Study 33 (trolley / mountain chateau)
items.push({
  kind: 'case', sourceQuestionNumber: '33', sourcePage: '9.14',
  text: "Fig. 9.22: A trolley carries passengers from ground level at point A up to the top of a mountain chateau at point P. Point A is at a horizontal distance of 2000 m from point C, which is at the base of the mountain (directly below P). B is a point on the ground between A and C; the slant side of the mountain PB makes an angle β = 60° with the ground at B, and the cable AP makes an angle of elevation α = 30° with the ground at A.",
  parts: [
    { text: '(i) Assuming the cable is held tight, what will be the length of the cable (AP)?', options: ['2000 m', '2000√3 m', '4000√3 m', '4000/√3 m'], correct: 3, marks: 1 },
    { text: '(ii) What will be the height of the mountain (PC)?', options: ['1000 m', '2000/√3 m', '2000 m', '2000√3 m'], correct: 1, marks: 1 },
    { text: '(iii) What will be the slant height of the mountain (PB)?', options: ['4000 m', '4000/3 m', '4000√3 m', '4000/√3 m'], correct: 1, marks: 1 },
    { text: '(iv) What will be the length of BC?', options: ['1000 m', '2000/3 m', '1000√3 m', '1000/√3 m'], correct: 1, marks: 1 },
    { text: '(v) What will be the distance of point A to the foot of the mountain located at B?', options: ['4000√3 m', '4000√6 m', '4000/√3 m', '4000/3 m'], correct: 3, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: P914, figureLabel: 'Fig. 9.22 (trolley cable to mountain chateau P, points A, B, C)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.9.15, item 33 (independently re-verified by computation)',
  explanation: "Height PC = AC·tanα = 2000·tan30° = 2000/√3 m (ii). Cable AP = AC/cosα = 2000/cos30° = 4000/√3 m (i). In right triangle PCB (right angle at C), angle PBC = β = 60°: BC = PC/tanβ = (2000/√3)/√3 = 2000/3 m (iv), and slant PB = PC/sinβ = (2000/√3)/(√3/2) = 4000/3 m (iii). Distance AB = AC - BC = 2000 - 2000/3 = 4000/3 m (v). All 5 sub-parts independently re-derived and match the printed key exactly.",
});

// p.9.15 — Case Study 34 (kite festival, open/numeric, no MCQ options)
items.push({
  kind: 'open',
  sourceQuestionNumber: '34',
  sourcePage: '9.15',
  text: "Fig. 9.23: Kite festival — two kites A and B are flown from a man's hands at point C. AD = 50 m is the height of kite A (D directly below A on the ground) and BE = 60 m is the height of kite B (E directly below B). The angle of elevation of kite A from C is 30° and of kite B from C is 60°, with D, C, E colinear on the ground and a straight segment of length d joining A to B directly.",
  parts: [
    { text: '(i) Find the lengths of strings used (taking them straight) for kites A and B, as shown in the figure.' },
    { text: "(ii) Find the distance 'd' between these two kites." },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: P915ANS, figureLabel: 'Fig. 9.23 (two kites A and B flown from point C)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.9.15, item 34: "(i) 100 m, 40√3 m (ii) 121.65 m" [CBSE 2022] (independently re-verified by computation)',
  explanation: "(i) String for kite A: CA = AD/sin30° = 50/0.5 = 100 m. String for kite B: CB = BE/sin60° = 60/(√3/2) = 120/√3 = 40√3 m. Both match the printed key exactly. (ii) Horizontal distances: CD = AD/tan30° = 50√3 m; CE = BE/tan60° = 60/√3 = 20√3 m; so DE = CD + CE = 70√3 m ≈ 121.24 m. Since A and B are at different heights (50 m and 60 m), d = AB = √(DE² + (60−50)²) = √((70√3)² + 10²) = √(14700 + 100) = √14800 ≈ 121.65 m — matches the printed key exactly.",
  source: 'CBSE 2022',
});

// p.9.15 — Assertion-Reason MCQs 35-37
const AR_INSTRUCTIONS = 'Each of the following contains STATEMENT-1 (Assertion) and STATEMENT-2 (Reason), with choices: (a) both true, Statement-2 correctly explains Statement-1; (b) both true, Statement-2 does NOT correctly explain Statement-1; (c) Statement-1 true, Statement-2 false; (d) Statement-1 false, Statement-2 true.';

items.push(mcq(35, '9.15', null, `${AR_INSTRUCTIONS} Statement-1 (A): For any acute angle θ, the value of tan θ never exceeds √3. Statement-2 (R): For 0° ≤ θ < 90°, tan θ = sin θ / cos θ.`, ['(a)', '(b)', '(c)', '(d)'], 3, {
  explanation: 'Statement-1 is FALSE: tan θ is unbounded as θ → 90° (e.g. tan 80° ≈ 5.67 > √3). Statement-2 is a true general identity. So (d), matching the printed key.',
}));
items.push(mcq(36, '9.15', null, `${AR_INSTRUCTIONS} Statement-1 (A): For any acute angle θ (0° ≤ θ < 90°), sec θ ≥ 1. Statement-2 (R): For any acute angle θ (0° < θ ≤ 90°), cosec θ ≥ 1.`, ['(a)', '(b)', '(c)', '(d)'], 1, {
  explanation: 'Both statements are independently true (sec θ = 1/cos θ ≥ 1 since cos θ ≤ 1; cosec θ = 1/sin θ ≥ 1 since sin θ ≤ 1), but Statement-2 (about cosec) does not explain Statement-1 (about sec) — they concern different ratios. So (b), matching the printed key.',
}));
items.push(mcq(37, '9.15', null, `${AR_INSTRUCTIONS} Statement-1 (A): For 0° < θ ≤ 90°, sin θ + cosec θ ≥ 2. Statement-2 (R): x + 1/x ≥ 2 for all x > 0.`, ['(a)', '(b)', '(c)', '(d)'], 0, {
  explanation: 'Statement-2 is the standard AM-GM inequality, true for all x > 0. Applying it with x = sin θ (which is > 0 for 0° < θ ≤ 90°) gives sin θ + 1/sin θ ≥ 2, i.e. sin θ + cosec θ ≥ 2 — so Statement-1 is true and directly follows from Statement-2. So (a), matching the printed key.',
}));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Trigonometric Ratios',
  chapterOrder: 9,
  sourceFileIds: [P911, P913, P914, P915ANS],
  label: 'CBSE Maths Trigonometric Ratios Ch.9 PARTIAL (32-image batch, items 1-2 & 27-37, p.9.12 items 3-26 missing, reclassified 2026-09-17)',
});

console.log(JSON.stringify(result, null, 2));
