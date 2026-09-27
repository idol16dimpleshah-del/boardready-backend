// CBSE Class 10 Mathematics — Heights and Distances (Chapter 11)
// practice-exercise MCQs. Source: 6 photographed pages (pp.11.10-11.15),
// part of the 32-image batch received 2026-09-17. Archived via the
// original pending-batch archive script, reclassified to proper
// chapter/page stable_ids via reclassify-pending-batch-2026-09-17.js once
// every page's exact content was individually re-confirmed this session.
//
// COMPLETE CHAPTER: all 31 numbered items (including 3 case studies:
// 29 sky tower, 30 helicopter/swimmer, 31 TV tower) plus the full printed
// answer key (p.11.15) were captured — no gaps.
//
// VERIFICATION METHOD: every plain MCQ answer independently recomputed
// from the given lengths/angles using standard trigonometric-ratio
// relations (tan(elevation) = opposite/adjacent, etc.), not copied
// blindly from the printed key. Case-study sub-parts were independently
// re-derived wherever the stem gave enough numeric detail to do so.
//
// TWO GENUINE SOURCE DEFECTS FOUND AND CORRECTED (disclosed here and in
// each item's explanation — not silently "fixed", flagged needs_review
// so a human can re-check):
//   Item 5: printed key says (c) 30°, but tan(theta) = 6/(2*sqrt(3)) =
//     sqrt(3) => theta = 60° = option (a). Recomputed twice; printed key
//     re-read from the source image a second time to rule out a
//     transcription error on our side. This is a real arithmetic error
//     in the source book.
//   Item 30(i) (case study, helicopter/swimmer): printed key says (a)
//     "the helicopter gets further from the island", but the figure and
//     stem fix the helicopter directly above the island at a constant
//     1000 ft altitude, with only the swimmer's position varying. Since
//     distance = 1000/tan(depression angle), increasing the depression
//     angle strictly DECREASES that distance — i.e. the swimmer gets
//     CLOSER to the island, option (c). The printed key was re-read a
//     second time from the source image and genuinely says (a); this is
//     treated as a second source defect, analogous to item 5, and
//     corrected to (c) with needs_review.
// Sub-parts 30(ii)/(iii)/(v) were independently re-derived and match the
// printed key exactly. Sub-part 30(iv) is kept as printed but NOT
// independently re-derived — the stem's "1019 ft" starting distance
// doesn't resolve cleanly against the other given values with the detail
// captured from the source photo, so rather than force a computation we
// don't trust, this sub-part is disclosed as printed-key-only.
//
// DIAGRAM PRESERVATION: per the founder's standing hard requirement,
// none of the 28 plain numeric MCQs (items 1-28) reference a named
// figure in the source text — this book presents height/distance word
// problems as pure text for the practice-exercise MCQs, with diagrams
// only accompanying the three case studies. Confirmed by direct
// page-by-page reading, not assumed. Items 29-31 (case studies) each
// reference an explicit "Fig. 11.2x" and get
// diagramStatus:'source_diagram_preserved' with the full source page
// preserved as the visual (this book's figures aren't safely croppable
// without risking losing adjacent content, consistent with project-wide
// policy).
const { ingestQuestions } = require('./ingest');

// source_files ids per page, from reclassify-pending-batch-2026-09-17.js
const P1110 = 87, P1111 = 88, P1112 = 89, P1113 = 90, P1114 = 91, P1115 = 92;

const mcq = (n, page, sfid, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: sfid ? 'source_diagram_preserved' : 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.11.15, item ${n} (independently re-verified by computation)`,
  ...(sfid ? { visuals: [{ sourceFileId: sfid, figureLabel: opts.fig || `p.${page} figure`, assetType: 'source_page_full' }] } : {}),
  ...opts,
});

const items = [];

// p.11.10 — item 1
items.push(mcq(1, '11.10', null, 'The length of shadow of a tower on the plane ground is √3 times the height of the tower. The angle of elevation of sun is', ['45°', '30°', '60°', '90°'], 1, { source: 'CBSE 2012, 2014, 2024' }));

// p.11.11 — items 2-13
items.push(mcq(2, '11.11', null, 'The angle of depression of a car parked on the road from the top of a 75 m high tower is 30°. The distance of the car from the tower is', ['25√3 m', '50√3 m', '75√3 m', '150 m'], 2));
items.push(mcq(3, '11.11', null, 'A ladder 15 m long makes an angle of 60° with the wall, then the height of the point where the ladder touches the wall is', ['15√3/2 m', '15/2 m', '15 m', '15√2 m'], 1));
items.push(mcq(4, '11.11', null, 'The angle of depression of a car, standing on the ground, from the top of a 150 m high tower, is 30°. The distance of the car from the base of the tower (in m) is', ['50√3', '150√3', '150√2', '75'], 1));
items.push(mcq(5, '11.11', null, "If a pole 6 m high casts a shadow 2√3 m long on the ground, then the sun's elevation is", ['60°', '45°', '30°', '90°'], 0, {
  answerStatus: 'needs_review',
  explanation: 'Printed answer key says (c) 30°. Independently recomputed: tan(theta) = height/shadow = 6/(2√3) = √3, so theta = 60° = option (a). Re-verified twice by direct computation and re-read the printed key from the source image a second time to rule out our own transcription error — this is a genuine arithmetic error in the source book. Corrected to (a) here; flagged needs_review for human confirmation.',
  source: 'CBSE 2023',
}));
items.push(mcq(6, '11.11', null, 'A tower stands vertically on the ground. From a point on the ground 50 m away from the foot of the tower, the angle of elevation of the top of the tower is 45°. The height of the tower is', ['50 m', '50√3 m', '50/√3 m', '25 m'], 0));
items.push(mcq(7, '11.11', null, 'A ladder makes an angle of 60° with the ground when placed against a wall. If the foot of the ladder is 2 m away from the wall, the length of the ladder is', ['1 m', '2 m', '2√3 m', '4 m'], 3));
items.push(mcq(8, '11.11', null, "If the ratio of the height of a tower and the length of its shadow is √3 : 1, what is the angle of elevation of the sun?", ['30°', '45°', '60°', '90°'], 2));
items.push(mcq(9, '11.11', null, 'The angle of elevation of the top of a tower from a point on the ground, which is 100 m away from the foot of the tower, is 60°. The height of the tower is', ['100√3 m', '100/√3 m', '100 m', '50√3 m'], 0));
items.push(mcq(10, '11.11', null, 'The altitude of the sun is 60°. The height of a tower which casts a shadow of length 30 m is', ['30√3 m', '30/√3 m', '30 m', '15√3 m'], 0));
items.push(mcq(11, '11.11', null, 'From two points A and B, at distances a and b respectively from the base and on the same straight line, the angles of elevation of the top of a tower are 30° and 60° respectively. The height of the tower is', ['a + b', '√(ab)', 'ab', '√(a/b)'], 1));
items.push(mcq(12, '11.11', null, 'From two points A and B, on the same side of the base and in the same straight line, the angles of elevation of the top of a tower are complementary. If the distances of the points from the foot of the tower are a and b, the height of the tower is', ['a - b', '√(ab)', 'a + b', 'ab'], 1));
items.push(mcq(13, '11.11', null, 'A man on the top of a lighthouse observes two ships on the opposite sides of the lighthouse with angles of depression 30° and 45° respectively. If the height of the lighthouse is h, the distance between the two ships is', ['(√3 + 1)h', '(√3 - 1)h', '√3 h', 'h/√3'], 0));

// p.11.12 — items 14-25
items.push(mcq(14, '11.12', null, "The angle of elevation of the top of a tower from a point on the ground is alpha. On walking a distance d towards the tower, the angle of elevation becomes beta. The height of the tower is", ['d / (cot alpha + cot beta)', 'd / (cot alpha - cot beta)', 'd (cot alpha - cot beta)', 'd (cot alpha + cot beta)'], 1));
items.push(mcq(15, '11.12', null, 'Two poles of height 20 m and 14 m stand vertically on a plane ground. If a wire connecting their tops makes an angle of 30° with the horizontal, the length of the wire is', ['6 m', '12 m', '10 m', '8 m'], 1));
items.push(mcq(16, '11.12', null, "A man standing at the top of a 25 m high cliff observes the angle of elevation of the top of a tower to be equal to the angle of depression of the foot of the tower. The height of the tower is", ['25 m', '50 m', '75 m', '100 m'], 1));
items.push(mcq(17, '11.12', null, 'A man on the top of a lighthouse observes two ships on the same side, 100 m apart, with angles of depression 45° and 30° respectively. The height of the lighthouse is', ['50(√3 - 1) m', '50(√3 + 1) m', '100(√3 + 1) m', '100(√3 - 1) m'], 1));
items.push(mcq(18, '11.12', null, 'A man on top of a tower observes a cloud at an angle of elevation of 30° whereas the reflection of the cloud in a lake, 200 m below the observer, is seen at an angle of depression of 60°. The height of the cloud is', ['100 m', '200 m', '300 m', '400 m'], 3));
items.push(mcq(19, '11.12', null, 'The shadow of a 100 m high tower decreases by x metres when the angle of elevation of the sun changes from 30° to 45°. The value of x is', ['100(√3 - 1) m', '100(√3 + 1) m', '100√3 m', '100/√3 m'], 0));
items.push(mcq(20, '11.12', null, 'Two persons are standing "a" metres apart from each other and the height of one is double that of the other. If from the midpoint of the line joining their feet, an observer finds the angles of elevation of their tops to be complementary, the height of the shorter person (in metres) is', ['a√2', 'a/√2', 'a/(2√2)', '2a√2'], 2));
items.push(mcq(21, '11.12', null, "If the angle of elevation of a cloud from a point h metres above a lake is theta, and the angle of depression of its reflection in the lake is 45°, then the height of the cloud is", ['h tan(45° + theta)', 'h tan(45° - theta)', 'h cot(45° + theta)', 'h cot(45° - theta)'], 0));
items.push(mcq(22, '11.12', null, 'A tower subtends an angle of 30° at a point on the same level as its foot. At a second point, h metres above the first, the angle of depression of the foot of the tower is 60°. The height of the tower is', ['h/2', 'h', 'h/3', '3h'], 2));
items.push(mcq(23, '11.12', null, 'On walking a distance x towards a chimney in a horizontal line through its base, the angle of elevation of its top changes from 30° to 60°. The height of the chimney is', ['x/√3', '(√3/2) x', 'x√3', '2x/√3'], 1));
items.push(mcq(24, '11.12', null, 'The shadow of a tower is found to be 2x metres longer when the elevation of the sun changes from 45° to 30°. The height of the tower is', ['(√3 + 1) x', '(√3 - 1) x', 'x√3', 'x'], 0));
items.push(mcq(25, '11.12', null, 'Two persons are standing "a" metres apart from each other, and the height of one is double that of the other. If from the midpoint of the line joining their feet, an observer finds the angles of elevation of their tops to be complementary, the height of the taller person (in metres) is', ['a√2', 'a/√2', 'a/(2√2)', '2 × a/(2√2)'], 3));

// p.11.13 — items 26-28 + Case Study 29
items.push(mcq(26, '11.13', null, 'Two poles of height 16 m and 10 m stand vertically on a plane ground. If a wire connecting their tops makes an angle of 30° with the horizontal, the length of the wire is', ['6 m', '10 m', '12 m', '16 m'], 2));
items.push(mcq(27, '11.13', null, "A girl of height 1.5 m is standing 3 m away from a lamppost. Her shadow, cast by the light from the lamppost, is 4.5 m long. The height of the lamppost is", ['2 m', '2.25 m', '2.5 m', '3 m'], 2));
items.push(mcq(28, '11.13', null, 'A 30 m tall building casts a shadow of a car standing at its base. As the car moves away from the tower, its angle of elevation of the top of the tower is found to be 60° when the car is 10√3 m away from the base. The height of the tower is', ['10 m', '20 m', '10√3 m', '30 m'], 3));

items.push({
  kind: 'case', sourceQuestionNumber: '29', sourcePage: '11.13',
  text: "Fig. 11.24: The Torre Latinoamericana in Mexico City is a well-known observation tower. Mr. Ramlal, whose eye level height is 2.3 m, stands on top of a building and observes the tower. The horizontal distance between the building and the tower is 120 m. From Mr. Ramlal's eye, the angle of elevation of the top of the tower is 60° and the angle of depression of the bottom of the tower is 30°.",
  parts: [
    { text: '(i) The height of the building (excluding Mr. Ramlal) is', options: ['69.28 m', '66.98 m', '60 m', '75 m'], correct: 1, marks: 1 },
    { text: '(ii) The height of the building including Mr. Ramlal is', options: ['69.28 m', '66.98 m', '40√3 m', '80√3 m'], correct: 2, marks: 1 },
    { text: '(iii) The length of the line of sight from Mr. Ramlal\'s eye to the base of the tower is', options: ['120 m', '80√3 m', '240 m', '60√3 m'], correct: 1, marks: 1 },
    { text: '(iv) The distance from Mr. Ramlal\'s eye to the top of the tower along the line of sight is', options: ['120 m', '160√3 m', '80√3 m', '240 m'], correct: 3, marks: 1 },
    { text: '(v) The height of the sky tower is', options: ['120√3 m', '40√3 m', '80√3 m', '160√3 m'], correct: 3, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: P1113, figureLabel: 'Fig. 11.24 (sky tower, Mexico City)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.11.15, item 29 (independently re-verified by computation)',
  explanation: "Building height (below eye level) = 120 tan30° = 120/√3 = 69.28 m; subtracting Mr. Ramlal's eye height 2.3 m gives 66.98 m for the building alone (i). Including Ramlal, building height = 69.28 m... expressed exactly as 40√3 m (ii, since 120/√3 = 40√3). Line of sight to base = 120/cos30° = 80√3 m (iii). Line of sight to tower top = 120/cos60° = 240 m (iv). Tower height above eye level = 120 tan60° = 120√3 m; total sky-tower height = 120√3 + 40√3 = 160√3 m (v). All 5 sub-parts independently verified and match the printed key.",
});

// p.11.14 — Case Study 30 + item 31 start
items.push({
  kind: 'case', sourceQuestionNumber: '30', sourcePage: '11.14',
  text: 'Fig. 11.25: A helicopter is flying at a constant altitude of 1000 ft directly above a small island, observing a swimmer in the sea via the angle of depression to the swimmer\'s position.',
  parts: [
    { text: '(i) As the angle of depression increases, what will be the effect?', options: ['The helicopter gets further from the island.', 'The helicopter gets closer to the island.', 'The swimmer gets closer to the island.', 'The swimmer gets further from the island.'], correct: 2, marks: 1 },
    { text: "(ii) If the angle of depression to the swimmer changes from 60° to 30°, the swimmer's distance from the point directly below the helicopter", options: ['decreases to less than a quarter', 'doubles', 'increases three times', 'is halved'], correct: 2, marks: 1 },
    { text: "(iii) At what angle of depression are the helicopter's altitude and the swimmer's horizontal distance equal?", options: ['30°', '45°', '60°', '90°'], correct: 1, marks: 1 },
    { text: "(iv) The swimmer starts 1019 ft away (line of sight) and swims to halve that distance; the new angle of depression is", options: ['nearly 30°', 'nearly 45°', 'nearly 60°', 'nearly 90°'], correct: 3, marks: 1 },
    { text: '(v) If the helicopter moves vertically upward, what is the effect on the angle of depression (for a swimmer at the same horizontal position)?', options: ["Doesn't change", 'Increases', 'Decreases', 'None of these'], correct: 1, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: P1114, figureLabel: 'Fig. 11.25 (helicopter above island, swimmer)', assetType: 'source_page_full' }],
  answerStatus: 'needs_review',
  answerKeyRef: 'printed ANSWERS table, p.11.15, item 30 (sub-part (i) independently re-derived and corrected — see note; (ii),(iii),(v) independently re-verified and match; (iv) kept as printed, not independently re-derived)',
  explanation: "(i) CORRECTED from the printed key. The helicopter is fixed at a constant 1000 ft directly above the island (per the figure); only the swimmer's position varies. Swimmer's horizontal distance from the island = 1000/tan(depression angle), which strictly DECREASES as the depression angle increases. So increasing the angle means the swimmer gets CLOSER to the island — option (c) — not option (a) 'the helicopter gets further from the island' as printed (the helicopter's position never changes in this scenario, so (a) cannot be correct under any reading). Re-verified this reasoning twice and re-read the printed key from the source image a second time to rule out a transcription error on our side; this is treated as a second genuine source defect (parallel to item 5) and corrected here, flagged needs_review for human confirmation. (ii) distance = 1000/tan(angle): at 60° distance=1000/√3, at 30° distance=1000√3, ratio = 3 — matches printed (c). (iii) helicopter altitude (1000) equals swimmer's horizontal distance when tan(angle)=1, i.e. 45° — matches printed (b). (iv) kept as printed (d) 'nearly 90°' — the exact geometric relationship implied by the '1019 ft' figure could not be independently confirmed from the source page's captured detail, so this sub-part is not independently re-derived, only carried from the printed key. (v) for a fixed swimmer position, increasing the helicopter's height increases tan(angle)=height/distance, so the angle of depression increases — matches printed (b).",
});

items.push({
  kind: 'open',
  sourceQuestionNumber: '31',
  sourcePage: '11.14',
  text: "Fig. 11.26: The TV Tower, Pitampura, Delhi (built 1988) stands vertically on the ground. From a point A on the ground, the angle of elevation of the top of the tower (point B) is 60°. Point C on the tower is 78 m (approx.) above the ground, and the angle of elevation of C from A is 30°.",
  parts: [
    { text: '(i) Draw a well-labelled figure representing the given situation (tower AB on ground, point C on the tower, angles of elevation 60° to B and 30° to C from point A).' },
    { text: '(ii) Find the height of the tower and the distance of the tower from point A.' },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: P1114, figureLabel: 'Fig. 11.26 (TV Tower, Pitampura, Delhi)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.11.15, item 31(ii): "234 m, 78√3 m" [CBSE 2022] (independently re-verified by computation)',
  explanation: "Let d = horizontal distance from A to the tower's foot, H = tower height. tan30° = 78/d => d = 78/tan30° = 78√3 m. tan60° = H/d => H = d·tan60° = 78√3 · √3 = 78·3 = 234 m. Matches the printed key exactly: height 234 m, distance 78√3 m. Sub-part (i) has no MCQ options (a construction/drawing instruction) and is captured here as a descriptive part rather than invented as a multiple-choice item.",
  source: 'CBSE 2022',
});

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Heights and Distances',
  chapterOrder: 11,
  sourceFileIds: [P1110, P1111, P1112, P1113, P1114, P1115],
  label: 'CBSE Maths Heights and Distances Ch.11 (32-image batch, pp.11.10-11.15, reclassified 2026-09-17)',
});

console.log(JSON.stringify(result, null, 2));
