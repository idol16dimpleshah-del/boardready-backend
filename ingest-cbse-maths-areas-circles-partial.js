// CBSE Class 10 Mathematics — Areas Related to Circles (Chapter 12)
// practice-exercise MCQs. Source: 3 photographed pages (pp.12.13-12.15),
// part of the 32-image batch received 2026-09-17. Archived via the
// original pending-batch archive script, reclassified to proper
// chapter/page stable_ids via reclassify-pending-batch-2026-09-17.js once
// every page's exact content was individually re-confirmed this session.
//
// PARTIAL CHAPTER — GENUINE GAP, NOT FABRICATED: page 12.16 onward
// (item 37's referenced Fig. 12.23, any items beyond 37, and the
// chapter's entire printed answer key, if one exists at all) was never
// photographed in the original 32-image upload. This is disclosed here
// and in PROJECT_PROGRESS.md, not silently worked around.
//
// NO ANSWER KEY AVAILABLE FOR THIS CHAPTER (unlike every other chapter
// in this batch): every one of these 37 items' answers was
// INDEPENDENTLY SOLVED from first principles (standard circle-mensuration
// formulas: circumference/area of a circle, sector area = (theta/360)*pi*r^2,
// segment area = sector - triangle, etc.) — not verified against a
// printed key, because none was captured. This is disclosed per item via
// answerKeyRef: 'self-derived, no answer key available in source'.
//
// TWO ITEMS FLAGGED needs_review (disclosed, not silently guessed):
//   Item 30 (Fig. 12.19): the shaded region's exact boundary (one
//     segment vs. two symmetric segments) could not be pinned down with
//     certainty from the photographed figure alone. Computed the minor
//     segment for r=10, theta=90 deg exactly as 25(pi-2) cm^2 (an exact,
//     unambiguous match to option (b)); if the shading instead covers
//     two congruent segments (as the photo appears to show), the total
//     would be 50(pi-2) cm^2, matching option (a). (a) is used as the
//     primary answer but flagged for a human to confirm against the
//     original figure.
//   Item 37: references "Fig. 12.23", which is on the MISSING p.12.16
//     and was never photographed. The item's text and options are
//     transcribed faithfully (they appear on p.12.15, before the missing
//     page), but the figure's exact configuration (radius vs. triangle
//     side, which arcs are drawn) can't be confirmed, so no answer here
//     can be independently verified. Option (a) is kept as a provisional
//     placeholder, clearly flagged needs_review, pending either a
//     re-upload of p.12.16 or direct sight of Fig. 12.23.
//
// ONE CONFIRMED "TRICK" QUESTION (independently verified, not a defect):
//   Item 32 (Fig. 12.21, segment ACB, central angle 120 deg, radius r):
//     the true segment area works out to r^2*(pi/3 - sqrt(3)/4), which
//     does not match printed option (a) r^2*(pi/3 - sqrt(3)/2) or option
//     (b) r^2*(pi/3 + sqrt(3)/2) (both have sqrt(3)/2 instead of the
//     correct sqrt(3)/4) or option (c) (which computes to a negative,
//     impossible area). The correct choice is therefore (d) "none of
//     these" — a well-known NCERT Exemplar item deliberately testing
//     whether a student drops the 1/2 factor in the triangle-area
//     formula (1/2 * r^2 * sin(theta)).
//
// DIAGRAM PRESERVATION: items 1-20, 22-29, 34-36 are plain text-only
// numeric MCQs with no named figure — diagramStatus 'not_applicable'.
// Items 21 (Fig. 12.18), 30 (Fig. 12.19), 31 (Fig. 12.20), 32
// (Fig. 12.21) and 33 (Fig. 12.22) each reference a figure present on
// the photographed pages and get diagramStatus 'source_diagram_preserved'
// with the full source page preserved as the visual. Item 37 references
// a figure (Fig. 12.23) that is NOT present in this upload — flagged
// diagramStatus 'needs_visual_review' rather than falsely claimed as
// preserved.
const { ingestQuestions } = require('./ingest');

// source_files ids per page, from reclassify-pending-batch-2026-09-17.js
const P1213 = 93, P1214 = 94, P1215 = 95;

const mcq = (n, page, sfid, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: sfid ? 'source_diagram_preserved' : 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'self-derived, no answer key available in source (see file header note)',
  ...(sfid ? { visuals: [{ sourceFileId: sfid, figureLabel: opts.fig || `p.${page} figure`, assetType: 'source_page_full' }] } : {}),
  ...opts,
});

const items = [];

// p.12.13 — items 1-8
items.push(mcq(1, '12.13', null, 'If the circumference and the area of a circle are numerically equal, then diameter of the circle is', ['π/2', '2π', '2', '4'], 3, { explanation: '2πr = πr² => r = 2 => diameter = 4.' }));
items.push(mcq(2, '12.13', null, 'If the difference between the circumference and radius of a circle is 37 cm, then using π = 22/7, the circumference (in cm) of the circle is', ['154', '44', '14', '7'], 1, { source: 'CBSE 2013', explanation: '2πr - r = 37 => r(2π-1)=37 => r(37/7)=37 => r=7; circumference = 2π(7) = 44 cm.' }));
items.push(mcq(3, '12.13', null, 'A wire can be bent in the form of a circle of radius 56 cm. If it is bent in the form of a square, then its area will be', ['3520 cm²', '6400 cm²', '7744 cm²', '8800 cm²'], 2, { explanation: 'Wire length = circumference = 2π(56) = 352 cm = square perimeter => side = 88 cm => area = 88² = 7744 cm².' }));
items.push(mcq(4, '12.13', null, 'If a wire is bent into the shape of a square, then the area of the square is 81 cm². When the wire is bent into a semi-circular shape, then the area of the semi-circle will be', ['22 cm²', '44 cm²', '77 cm²', '154 cm²'], 2, { explanation: 'Square side=9, wire length=36=perimeter of semicircle=r(π+2) => r=36/(36/7)=7; area=(1/2)πr²=0.5×(22/7)×49=77 cm².' }));
items.push(mcq(5, '12.13', null, 'A circular park has a path of uniform width around it. The difference between the outer and inner circumferences of the circular path is 132 m. Its width is', ['20 m', '21 m', '22 m', '24 m'], 1, { explanation: '2π(R-r)=132 => R-r = 132/(2π) = 132×7/44 = 21 m.' }));
items.push(mcq(6, '12.13', null, 'The radius of a wheel is 0.25 m. The number of revolutions it will make to travel a distance of 11 km will be', ['2800', '4000', '5500', '7000'], 3, { explanation: 'Circumference = 2π(0.25) = 11/7 m; revolutions = 11000/(11/7) = 7000.' }));
items.push(mcq(7, '12.13', null, 'The ratio of the outer and inner perimeters of a circular path is 23 : 22. If the path is 5 metres wide, the diameter of the inner circle is', ['55 m', '110 m', '220 m', '230 m'], 2, { explanation: 'R/r=23/22 and R-r=5 => R=23k, r=22k, k=5 => r=110 => diameter=220 m.' }));
items.push(mcq(8, '12.13', null, 'The circumference of a circle is 100 cm. The side of a square inscribed in the circle is', ['50√2 cm', '100/π cm', '50√2/π cm', '100√2/π cm'], 2, { explanation: 'Diameter = 100/π = diagonal of square; side = diagonal/√2 = 100/(π√2) = 50√2/π cm.' }));

// p.12.14 — items 9-25
items.push(mcq(9, '12.14', null, 'The area of the incircle of an equilateral triangle of side 42 cm is', ['22√3 cm²', '231 cm²', '462 cm²', '924 cm²'], 2, { explanation: 'Inradius = side/(2√3) = 42/(2√3) = 7√3; area = π(7√3)² = 147π = 147×22/7 = 462 cm².' }));
items.push(mcq(10, '12.14', null, 'The area of incircle of an equilateral triangle is 154 cm². The perimeter of the triangle is', ['71.5 cm', '71.7 cm', '72.3 cm', '72.7 cm'], 3, { explanation: 'r² = 154/π = 49 => r=7; side = 2√3 r = 14√3; perimeter = 42√3 ≈ 72.7 cm.' }));
items.push(mcq(11, '12.14', null, 'If an arc of a circle forms 90° at the centre of the circle, then the ratio of its length to the circumference of the circle is', ['1:4', '3:4', '1:3', '2:3'], 0, { explanation: '90/360 = 1/4.' }));
items.push(mcq(12, '12.14', null, 'The perimeter of a triangle is 30π cm and the circumference of its incircle is 88 cm. The area of the triangle is', ['70 cm²', '140 cm²', '660 cm²', '420 cm²'], 2, { explanation: 'r = 88/(2π) = 14 (using π=22/7); semi-perimeter s = 15π; area = r×s = 14×15π = 210π = 210×22/7 = 660 cm².' }));
items.push(mcq(13, '12.14', null, 'The area of a circle is 220 cm². The area of a square inscribed in it is', ['49 cm²', '70 cm²', '140 cm²', '150 cm²'], 2, { explanation: 'r² = 220/π = 70; square inscribed in circle has area 2r² = 140 cm².' }));
items.push(mcq(14, '12.14', null, 'If the circumference of a circle increases from 4π to 8π, then its area is', ['halved', 'doubled', 'tripled', 'quadrupled'], 3, { explanation: 'Circumference doubling means radius doubles; area scales as r², so area quadruples.' }));
items.push(mcq(15, '12.14', null, 'If the radius of a circle is diminished by 10%, then its area is diminished by', ['10%', '19%', '20%', '36%'], 1, { explanation: 'New area = (0.9)²=0.81 of original, i.e. a 19% decrease.' }));
items.push(mcq(16, '12.14', null, 'If the area of a square is the same as the area of a circle, then the ratio of their perimeters, in terms of π, is', ['π : √3', '2 : √π', '3 : π', 'π : √2'], 1, { explanation: 's²=πr² => s=r√π; perimeter ratio = 4s : 2πr = 4r√π : 2πr = 2√π : π = 2 : √π.' }));
items.push(mcq(17, '12.14', null, 'An arc of length 15.7 cm subtends a right angle at the centre of the circle. The radius of the circle is (use π = 22/7)', ['20 cm', '10 cm', '15 cm', '12 cm'], 1, { explanation: 'L = rθ(radians) = r(π/2) = 15.7 => r = 31.4/π ≈ 10 cm.' }));
items.push(mcq(18, '12.14', null, 'The ratio of the areas of a circle and an equilateral triangle whose diameter and a side are respectively equal, is', ['π : √2', 'π : √3', '√3 : π', '√2 : π'], 1, { explanation: 'Circle area = π(a/2)² = πa²/4; triangle area = (√3/4)a²; ratio = π : √3.' }));
items.push(mcq(19, '12.14', null, 'If the sum of the areas of two circles with radii r₁ and r₂ is equal to the area of a circle of radius r, then r₁² + r₂²', ['> r²', '= r²', '< r²', 'none of these'], 1, { explanation: 'πr₁² + πr₂² = πr² directly gives r₁² + r₂² = r².' }));
items.push(mcq(20, '12.14', null, 'If the perimeter of a semi-circular protractor is 36 cm, then its diameter is', ['10 cm', '12 cm', '14 cm', '16 cm'], 2, { explanation: 'Perimeter = πr + 2r = r(π+2) = 36 => r(36/7)=36 => r=7 => diameter=14 cm.' }));
items.push(mcq(21, '12.14', P1214, 'The perimeter of the sector OAB shown in Fig. 12.18, is', ['64/3 cm', '26 cm', '64/5 cm', '19 cm'], 0, { fig: 'Fig. 12.18 (sector OAB, radius 7 cm, angle 60°)', explanation: 'Arc = (60/360)×2π(7) = 22/3 cm; perimeter = 2(7) + 22/3 = 14 + 22/3 = 64/3 cm.' }));
items.push(mcq(22, '12.14', null, 'If the perimeter of a sector of a circle of radius 6.5 cm is 29 cm, then its area is', ['58 cm²', '52 cm²', '25 cm²', '56 cm²'], 1, { explanation: 'Arc = 29 - 2(6.5) = 16 cm; sector area = (1/2)×r×arc = 0.5×6.5×16 = 52 cm².' }));
items.push(mcq(23, '12.14', null, 'If the area of a sector of a circle bounded by an arc of length 5π cm is equal to 20π cm², then its radius is', ['12 cm', '16 cm', '8 cm', '10 cm'], 2, { explanation: 'Sector area = (1/2)×r×arc => 20π = (1/2)×r×5π => r=8 cm.' }));
items.push(mcq(24, '12.14', null, 'The area of the circle that can be inscribed in a square of side 10 cm is', ['40π cm²', '30π cm²', '100π cm²', '25π cm²'], 3, { explanation: 'Diameter=10, r=5, area=π(5)²=25π cm².' }));
items.push(mcq(25, '12.14', null, 'If the difference between the circumference and radius of a circle is 37 cm, then its area is', ['154 cm²', '160 cm²', '200 cm²', '150 cm²'], 0, { explanation: '2πr-r=37 => r=7 (as in item 2); area=πr²=(22/7)(49)=154 cm².' }));

// p.12.15 — items 26-37 (item 37's Fig. 12.23 and the chapter answer key,
// if any, are on p.12.16+, MISSING from this upload)
items.push(mcq(26, '12.15', null, 'If the area of a circle is equal to the sum of the areas of two circles of diameters 10 cm and 24 cm, then diameter of the larger circle (in cm) is', ['34', '26', '17', '14'], 1, { source: 'CBSE 2012', explanation: 'r² = 5² + 12² = 169 => r = 13 => diameter = 26 cm.' }));
items.push(mcq(27, '12.15', null, 'The area of the circle that can be inscribed in a square of side 6 cm is', ['36π cm²', '18π cm²', '12π cm²', '9π cm²'], 3, { source: 'NCERT EXEMPLAR', explanation: 'Diameter=6, r=3, area=9π cm².' }));
items.push(mcq(28, '12.15', null, 'It is proposed to build a single circular park equal in area to the sum of areas of two circular parks of diameters 16 m and 12 m in a locality. The radius of the new park would be', ['10 m', '15 m', '20 m', '24 m'], 0, { source: 'NCERT EXEMPLAR, CBSE Sample Paper 2024', explanation: 'r² = 8² + 6² = 100 => r = 10 m.' }));
items.push(mcq(29, '12.15', null, 'If diameter of a circle is increased by 40%, then its area increases by', ['96%', '40%', '80%', '48%'], 0, { explanation: 'Area scales as diameter²; (1.4)² = 1.96, i.e. a 96% increase.' }));
items.push(mcq(30, '12.15', P1215, 'In Fig. 12.19, the shaded area is', ['50(π − 2) cm²', '25(π − 2) cm²', '25(π + 2) cm²', '5(π − 2) cm²'], 0, {
  fig: 'Fig. 12.19 (circle, OA = OB = 10 cm, ∠AOB = 90°)',
  answerStatus: 'needs_review',
  explanation: "For r=10, θ=90°: sector OAB area = 25π cm², triangle OAB area = 50 cm², so ONE minor segment = 25π−50 = 25(π−2) cm² — an exact match to option (b). The photographed figure appears to shade two congruent symmetric segments rather than one, which would double this to 50(π−2) cm² (option (a)), used here as the primary answer. Flagged needs_review since the exact shaded boundary couldn't be pinned down with full certainty from the photo alone — a human should confirm against the original figure.",
}));
items.push(mcq(31, '12.15', P1215, 'In Fig. 12.20, the area of the segment PAQ is', ['(a²/4)(π + 2)', '(a²/4)(π − 2)', '(a²/4)(π − 1)', '(a²/4)(π + 1)'], 1, {
  fig: 'Fig. 12.20 (quadrant OPQ of radius a, right angle at O, A on the arc)',
  explanation: 'Quadrant area = πa²/4; triangle OPQ area = a²/2; segment PAQ = πa²/4 − a²/2 = (a²/4)(π−2).',
}));
items.push(mcq(32, '12.15', P1215, 'In Fig. 12.21, the area of segment ACB is', ['(π/3 − √3/2) r²', '(π/3 + √3/2) r²', '(π/3 − 2/√3) r²', 'none of these'], 3, {
  fig: 'Fig. 12.21 (circle, OA = OB = r, ∠AOB = 120°, C on the major arc)',
  source: 'NCERT EXEMPLAR',
  explanation: 'True segment area = (120/360)πr² − (1/2)r²sin120° = (π/3)r² − (√3/4)r². This matches NEITHER (a) nor (b) (both have √3/2, not √3/4), and (c) evaluates to a negative, impossible area. Correct answer is (d) none of these — a well-known "trick" item testing whether the 1/2 factor in the triangle-area formula is dropped.',
}));
items.push(mcq(33, '12.15', P1215, 'In Fig. 12.22, the ratio of the areas of two sectors S₁ and S₂ is', ['5 : 2', '3 : 5', '5 : 3', '4 : 5'], 3, {
  fig: 'Fig. 12.22 (circle, sector S₁ central angle 120°, sector S₂ central angle 150°)',
  explanation: 'Same radius, so area ratio = angle ratio = 120 : 150 = 4 : 5.',
}));
items.push(mcq(34, '12.15', null, 'If the area of a sector of a circle bounded by an arc of length 5π cm is equal to 20π cm², then the radius of the circle is', ['12 cm', '16 cm', '8 cm', '10 cm'], 2, { explanation: 'Identical to item 23 above: sector area = (1/2)×r×arc => 20π=(1/2)r(5π) => r=8 cm. (This item is a verbatim repeat of item 23 within the source book; the ingest pipeline\'s per-chapter exact-duplicate check will handle it automatically.)' }));
items.push(mcq(35, '12.15', null, 'If the area of a sector of a circle is 5/18 of the area of the circle, then the sector angle is equal to', ['60°', '90°', '100°', '120°'], 2, { explanation: 'angle/360 = 5/18 => angle = 100°.' }));
items.push(mcq(36, '12.15', null, 'If the area of a sector of a circle is 7/20 of the area of the circle, then the sector angle is equal to', ['110°', '130°', '100°', '126°'], 3, { explanation: 'angle/360 = 7/20 => angle = 126°.' }));
items.push(mcq(37, '12.15', null, 'In Fig. 12.23, if ABC is an equilateral triangle, then shaded area is equal to', ['(π/3 − √3/4) r²', '(π/3 − √3/2) r²', '(π/3 + √3/4) r²', '(π/3 + √3) r²'], 0, {
  diagramStatus: 'needs_visual_review',
  answerStatus: 'needs_review',
  explanation: "Fig. 12.23 is referenced by this item but was NOT captured in this upload — it falls on p.12.16, which is genuinely missing (confirmed gap, see file header). The item's text and options are transcribed faithfully from p.12.15 (they appear before the page break), but without the figure, the exact configuration (which arcs/sectors are drawn, and at what radius relative to the triangle's side) can't be confirmed, so no answer here is independently verified. Option (a) is kept only as a provisional placeholder pending a re-upload of p.12.16 or direct sight of Fig. 12.23 — flagged needs_review, not to be treated as confirmed.",
}));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Areas Related to Circles',
  chapterOrder: 12,
  sourceFileIds: [P1213, P1214, P1215],
  label: 'CBSE Maths Areas Related to Circles Ch.12 PARTIAL (32-image batch, items 1-37, p.12.16+ missing incl. answer key, self-derived answers, reclassified 2026-09-17)',
});

console.log(JSON.stringify(result, null, 2));
