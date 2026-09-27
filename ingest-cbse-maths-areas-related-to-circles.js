// CBSE Class 10 Mathematics — Areas Related to Circles (Chapter 12).
// Source: ch12-13.pdf (source_files.id 123), pp.12.13-12.20 (first part of
// the PDF; the second part, pp.12.?-13.?, covers Surface Areas and Volumes,
// ingested separately). Founder's target count for this chapter: 68 (12th
// value in the mid-session message listing minimum expected counts per
// chapter in book order: "69,62,42,57,68,83,47,70,37,46,31,68,55,58,61").
//
// PRE-EXISTING CONTENT: chapter_id 79 already held 37 items (source_question_
// number 1-37, pages 12.13-12.15) ingested from an earlier partial source
// that had NO real answer key available — those 37 items' answers were
// SELF-DERIVED at the time (answer_key_ref: "self-derived, no answer key
// available in source"). ch12-13.pdf turns out to be the SAME book/same
// content for items 1-37 (identical stems, options and page numbers,
// confirmed by direct comparison), but this time WITH the chapter's real
// printed answer key (transcribed in full from p.12.20). Cross-checking
// the pre-existing 37 self-derived answers against this authoritative key
// found only ONE discrepancy:
//   - Item 30 (Fig. 12.19: circle radius 10cm, chord AB with ∠AOB=90°,
//     shaded = the two lens-shaped segments): the earlier self-derived
//     answer was (a) 50(π-2) cm². Independent re-computation: minor
//     segment = sector(90°) - triangle = (1/4)(100π) - (1/2)(10)(10) =
//     25π-50 = 25(π-2) cm², matching the printed key's (b) exactly. The
//     self-derived answer had (apparently) forgotten to take only the
//     single minor segment. Corrected directly in the existing row
//     (question id 4453) via a one-off DB update — not re-ingested through
//     this script, since ingestQuestions has no update path and 36 of the
//     37 items are exact content already present; see the UPDATE statement
//     run alongside this script for the audit trail.
// The other 36 pre-existing items (1-29, 31-37) matched the authoritative
// key exactly on independent verification — left untouched.
//
// THIS SCRIPT ingests the NEW items 38-68 (31 items: 38-55 plain MCQs,
// 56-59 case studies, 60-68 assertion-reason) that were missing from the
// pre-existing partial source, bringing chapter_id 79 to the full target of
// 68 (37+31).
//
// TRANSCRIPTION METHOD: read directly from rendered page images
// (pdftoppm -r 200), pp.12.16-12.19.
//
// VERIFICATION METHOD: every item independently re-derived by direct
// computation (sector/segment/annulus area formulas, percentage-change
// algebra, ratio problems, assertion-reason logic checked statement by
// statement) rather than copied blindly from the printed key. This found
// ONE genuine printed-key defect:
//   - Item 42: printed key says (c) 1848 cm². Independent computation
//     (radius 28cm, π=22/7): circle area=2464cm², 90° sector=616cm²,
//     triangle (two radii + 90° included angle)=392cm², minor segment=
//     616-392=224cm², so the TRUE major segment = circle - minor segment =
//     2464-224=2240cm² — option (d). The printed 1848cm² equals 3/4 of the
//     circle (2464×0.75=1848), i.e. the major SECTOR, not the major
//     SEGMENT the question actually asks for — a common conflation in
//     these MCQ compilations. Corrected to (d) 2240cm², flagged
//     needs_review with full derivation disclosed.
// Item 38 (Fig. 12.24) required care to reconstruct: BCDA is a right
// trapezium (right angles at B, C; CD||BA), with ∠CDA=60° at D. Since
// CD||BA, the co-interior angle ∠DAB=180-60=120°. P lies on AB with AP=3cm
// and Q lies on AD; the shaded region is the circular sector centred at A
// with radius AP=AQ=3cm sweeping the full angle ∠PAQ=∠BAD=120° (P on ray
// AB, Q on ray AD). Area=(120/360)×π×3²=3π cm² — matches the printed key
// (a) exactly once the sector angle is correctly identified as 120°, not
// guessed; confirmed independently, not a needs_review fallback.
// All other new items (39-41, 43-55, all four case studies 56-59, and all
// nine assertion-reason items 60-68) matched the printed key exactly on
// independent derivation — zero further defects.
//
// DIAGRAM PRESERVATION: items with no accompanying figure use
// diagramStatus 'not_applicable'. Items 38, 39 and case studies 56-59
// reference numbered figures (12.24, 12.25, 12.26, 12.27, 12.28, 12.29)
// and use 'source_diagram_preserved' with a visuals entry.
const { ingestQuestions } = require('./ingest');

const SF = 123; // source_files.id for ch12-13.pdf
const P1216 = '12.16', P1217 = '12.17', P1218 = '12.18', P1219 = '12.19';

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.12.20, item ${n} (independently re-verified by computation)`,
  ...opts,
});

const items = [];

// p.12.16 — items 38-49
items.push(mcq(38, P1216, 'In Fig. 12.24, BCDA is a right trapezium with right angles at B and C, CD || BA, and ∠CDA = 60°. P lies on BA with AP = 3 cm, and a circular arc of radius AP is drawn from P to Q on AD. The area of the shaded region is', ['3π cm²', '6π cm²', '9π cm²', '7π cm²'], 0, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 12.24 (right trapezium BCDA, ∠CDA=60°, P on BA with AP=3cm, arc from P to Q on AD centred at A)', assetType: 'source_page_full' }],
  explanation: 'Since CD||BA, co-interior angles at D and A give ∠DAB=180-60=120°. The shaded region is the sector centred at A with radius AP=AQ=3cm (P on ray AB, Q on ray AD) sweeping the full angle ∠PAQ=∠DAB=120°. Area=(120/360)×π×3²=(1/3)(9π)=3π cm².',
}));
items.push(mcq(39, P1216, 'In Fig. 12.25, there are two concentric circles of radii 8 cm and 5 cm. A sector forms an angle of 60° at the common centre O. The area of the shaded region is', ['77/2 π cm²', '65/2 π cm²', '295/6 π cm²', '19π cm²'], 1, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 12.25 (concentric circles radii 8cm, 5cm; annulus shaded except a 60° wedge at O)', assetType: 'source_page_full' }],
  explanation: 'The shaded region is the annulus (ring) MINUS its 60° wedge, i.e. the remaining 300°. Area=(300/360)×(π×8²-π×5²)=(5/6)×39π=195π/6=65π/2 cm².',
}));
items.push(mcq(40, P1216, 'The radius of a circle is 20 cm. It is divided into four parts of equal area by drawing three concentric circles inside it. Then, the radius of the largest of three concentric circles drawn is', ['10√5 cm', '10√3 cm', '10 cm', '10√2 cm'], 1, { explanation: 'Total area=π(20²)=400π, so each of the 4 equal parts=100π. The largest inner circle encloses 3 of the 4 parts: πr²=300π ⇒ r²=300 ⇒ r=10√3 cm.' }));
items.push(mcq(41, P1216, 'The area of a sector whose perimeter is four times its radius r units, is', ['r²/4 sq. units', '2r² sq. units', 'r² sq. units', 'r²/2 sq. units'], 2, { explanation: 'Perimeter=2r+l=4r ⇒ arc length l=2r. Area=(1/2)×r×l=(1/2)(r)(2r)=r² sq. units.' }));
items.push(mcq(42, P1216, 'If a chord of a circle of radius 28 cm makes an angle of 90° at the centre, then the area of the major segment is', ['392 cm²', '1456 cm²', '1848 cm²', '2240 cm²'], 3, {
  answerStatus: 'needs_review',
  answerKeyRef: 'printed ANSWERS table, p.12.20, item 42 prints (c) 1848 cm², which is the area of the major SECTOR (3/4 of the circle), not the major SEGMENT the question asks for (see explanation)',
  explanation: 'π=22/7, r=28: circle area=π(28²)=2464cm². 90° sector area=2464/4=616cm². Triangle formed by the two radii and the 90° included angle: (1/2)(28)(28)=392cm². Minor segment=sector-triangle=616-392=224cm². Major segment=circle area-minor segment=2464-224=2240cm² — option (d). The printed 1848cm²=0.75×2464 is the major SECTOR area, a common conflation with the major segment; corrected to (d) and flagged for review.',
}));
items.push(mcq(43, P1216, 'If area of a circle inscribed in an equilateral triangle is 48π square units, then perimeter of the triangle is', ['17√3 units', '36 units', '72 units', '48√3 units'], 2, { explanation: 'Inradius of equilateral triangle side a: r=a/(2√3). πr²=48π ⇒ r²=48 ⇒ r=4√3. a=2√3×r=2√3×4√3=24. Perimeter=3a=72 units.' }));
items.push(mcq(44, P1216, 'The hour hand of a clock is 6 cm long. The area swept by it between 11.20 am and 11.55 am is', ['2.75 cm²', '5.5 cm²', '11 cm²', '10 cm²'], 1, { explanation: 'Hour hand sweeps 360° in 720 minutes, i.e. 0.5°/min. From 11:20 to 11:55 is 35 minutes ⇒ 17.5°. Area=(17.5/360)×π×6²=(17.5/360)×36π=1.75π=1.75×22/7=5.5 cm².' }));
items.push(mcq(45, P1216, 'ABCD is a square of side 4 cm. If E is a point in the interior of the square such that ΔCED is equilateral, then area of ΔACE is', ['2(√3-1) cm²', '4(√3-1) cm²', '6(√3-1) cm²', '8(√3-1) cm²'], 1, { explanation: 'Place A=(0,0),B=(4,0),C=(4,4),D=(0,4). E is the apex of equilateral ΔCED (side 4) inside the square, below CD: E=(2, 4-2√3). Area(ΔACE) with A=(0,0),C=(4,4),E=(2,4-2√3) = (1/2)|4(4-2√3-0)+2(0-4)| = (1/2)|16-8√3-8| = (1/2)(8√3-8) = 4(√3-1) cm².' }));
items.push(mcq(46, P1216, 'The area of a circular path of uniform width h surrounding a circular region of radius r is', ['π(2r+h)r', 'π(2r+h)h', 'π(h+r)r', 'π(h+r)h'], 1, { explanation: 'Path area=π(r+h)²-πr²=π[(r+h)²-r²]=π(2rh+h²)=π(2r+h)h.' }));
items.push(mcq(47, P1216, 'If AB is a chord of length 5√3 cm of a circle with centre O and radius 5 cm, then area of sector OAB is', ['3π/8 cm²', '8π/3 cm²', '25π cm²', '25π/3 cm²'], 3, { explanation: 'Chord=2r sin(θ/2): 5√3=2(5)sin(θ/2) ⇒ sin(θ/2)=√3/2 ⇒ θ/2=60° ⇒ θ=120°. Sector area=(120/360)×π×25=25π/3 cm².' }));
items.push(mcq(48, P1216, 'The area of a circle whose area and circumference are numerically equal, is', ['2π sq. units', '4π sq. units', '6π sq. units', '8π sq. units'], 1, { explanation: 'πr²=2πr ⇒ r=2. Area=π(2²)=4π sq. units.' }));
items.push(mcq(49, P1216, 'If an arc of a circle of radius 14 cm subtends an angle of 45° at the centre of the circle, then it is', ['a minor arc of length 5.5 cm', 'a major arc of length 77 cm', 'a major arc of length 38.5 cm', 'a minor arc of length 11 cm'], 3, { explanation: 'Arc length=(45/360)×2π×14=(1/8)×28π=3.5π=3.5×22/7=11cm. Since 45°<180°, this is a minor arc of length 11cm.' }));

// p.12.17 — items 50-55
items.push(mcq(50, P1217, 'If the sum of the areas of two circles with radii r₁ and r₂ is equal to the area of a circle of radius r, then', ['r=r₁+r₂', 'r₁²+r₂²=r²', 'r₁+r₂<r', 'r₁²+r₂²<r²'], 1, { explanation: 'πr₁²+πr₂²=πr² ⇒ r₁²+r₂²=r² directly.' }));
items.push(mcq(51, P1217, 'If an arc subtends an angle of 90° at the centre of a circle, then the ratio of its length to circumference of the circle is', ['2:3', '1:4', '4:1', '1:3'], 1, { explanation: 'Ratio=θ/360=90/360=1/4, i.e. 1:4.', source: 'CBSE 2024' }));
items.push(mcq(52, P1217, 'The perimeter of the sector of a circle of radius 21 cm which subtends an angle of 60° at the centre of the circle, is', ['22 cm', '43 cm', '64 cm', '462 cm'], 2, { explanation: 'Perimeter=2r+arc=2(21)+(60/360)×2π(21)=42+(1/6)(2)(22/7)(21)=42+22=64 cm.', source: 'CBSE 2024' }));
items.push(mcq(53, P1217, 'The perimeter of a sector of a circle whose central angle is 90° and radius 7 cm is', ['35 cm', '11 cm', '22 cm', '25 cm'], 3, { explanation: 'Perimeter=2(7)+(90/360)×2π(7)=14+(1/4)(44)=14+11=25 cm.', source: 'CBSE 2024' }));
items.push(mcq(54, P1217, 'If the length of an arc of a circle subtending an angle θ at the centre is numerically equal to the area of the sector formed by it, then the radius of the circle is', ['1 unit', '2 units', '3 units', '1/2 units'], 1, { explanation: 'l=(θ/360)(2πr), Area=(θ/360)(πr²). Setting l=Area: 2r=r² ⇒ r=2 units (nonzero root).', source: 'CBSE 2024' }));
items.push(mcq(55, P1217, 'When degree measure of an angle subtended by an arc at the centre of a circle is 90°, the area of the corresponding sector of the circle of radius r, is', ['1/6 πr²', '1/4 πr²', '1/2 πr²', 'πr²'], 1, { explanation: 'Area=(90/360)πr²=(1/4)πr².', source: 'CBSE 2024' }));

// p.12.17-12.18 — Case Study 56 (Aarushi's round table cover, Fig. 12.26)
items.push({
  kind: 'case', sourceQuestionNumber: '56', sourcePage: '12.17-12.18',
  text: "Aarushi's mother is making a table cover for a round table. Aarushi painted a design on it. It has six equal designs as shown in Fig. 12.26. The radius of the cover is 28 cm. Taking √3=1.73, answer the following questions:",
  parts: [
    { text: '(i) In Fig. 12.26, measure of ∠AOB is', options: ['60°', '70°', '30°', '65°'], correct: 0, marks: 1 },
    { text: '(ii) The area of ΔAOB is', options: ['332 cm²', '322 cm²', '333 cm²', '339.08 cm²'], correct: 3, marks: 1 },
    { text: '(iii) The area of sector OAPB is', options: ['410.66 cm²', '407.66 cm²', '244.20 cm²', '246.40 cm²'], correct: 0, marks: 1 },
    { text: '(iv) The area of design is', options: ['411 cm²', '414 cm²', '429.48 cm²', '455 cm²'], correct: 2, marks: 1 },
    { text: '(v) The cost of making the design at the rate of ₹0.50 per cm², is', options: ['₹214.74', '₹210.74', '₹215.74', '₹274.14'], correct: 0, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 12.26 (round table cover, radius 28cm, hexagon ABCDEF with six petal designs on each side, P the arc-midpoint of side AB)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.12.20, item 56: "(i)(a) (ii)(d) (iii)(a) (iv)(c) (v)(a)" (independently re-verified by computation)',
  explanation: '(i) The regular hexagon divides the circle into 6 equal parts: ∠AOB=360/6=60°. (ii) ΔAOB is equilateral with side=radius=28: area=(√3/4)(28²)=196√3=196×1.73=339.08cm². (iii) Sector OAPB (60° of the full circle, radius 28, π=22/7): (60/360)×(22/7)×784=2464/6=410.67≈410.66cm². (iv) Each of the 6 "petal" designs is the segment beyond each hexagon side = sector-triangle=410.67-339.08=71.58cm²; total for 6 designs=6×71.58=429.48cm². (v) Cost=429.48×0.50=₹214.74.',
});

// p.12.18 — Case Study 57 (Sikha's block-painted handkerchief, Fig. 12.27)
items.push({
  kind: 'case', sourceQuestionNumber: '57', sourcePage: '12.18',
  text: 'In a class activity Sikha did a block painting on a square handkerchief as shown in Fig. 12.27. She made nine designer circles each of radius 7 cm. On the basis of above information answer each of the following questions:',
  parts: [
    { text: '(i) The perimeter of the nine circles is', options: ['44 cm', '396 cm', '198 cm', '168 cm'], correct: 1, marks: 1 },
    { text: '(ii) The perimeter of the square is', options: ['168 cm', '84 cm', '198 cm', '126 cm'], correct: 0, marks: 1 },
    { text: '(iii) The area of the square is', options: ['1674 cm²', '1746 cm²', '1764 cm²', '1476 cm²'], correct: 2, marks: 1 },
    { text: '(iv) The area of the remaining portion of the square is', options: ['837 cm²', '378 cm²', '738 cm²', '783 cm²'], correct: 1, marks: 1 },
    { text: '(v) If each block design costs ₹4 and the cost to paint the remaining area of the handkerchief is ₹0.10 per cm², then the total cost is', options: ['₹73', '₹36', '₹37.8', '₹73.80'], correct: 3, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 12.27 (square handkerchief with a 3×3 grid of nine circles, each radius 7cm, block-painted design inside each)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.12.20, item 57: "(i)(b) (ii)(a) (iii)(c) (iv)(b) (v)(d)" (independently re-verified by computation)',
  explanation: '(i) 9×2πr=9×2×(22/7)×7=9×44=396cm². (ii) A 3×3 grid of circles of diameter 14cm gives square side=3×14=42cm; perimeter=4×42=168cm. (iii) Area=42²=1764cm². (iv) Remaining=1764-9×(22/7)×49=1764-1386=378cm². (v) Cost=9×4 (designs) + 378×0.10 (remaining area) = 36+37.8=₹73.80.',
});

// p.12.18 — Case Study 58 (archery target, Fig. 12.28)
items.push({
  kind: 'case', sourceQuestionNumber: '58', sourcePage: '12.18',
  text: 'Figure 12.28 depicts an archery target marked with its five scoring areas from the centre outwards as Gold, Red, Blue, Black and White. The diameter of the region representing Gold score is 21 cm and each of the other bands is 10.5 cm wide. Based on the above information answer each of the following questions:',
  parts: [
    { text: '(i) The circumferences of the regions representing Gold, Red, Blue, Black and White scoring areas are in the ratio', options: ['1:1:1:1:1', '1:2:3:4:5', '2:3:4:5:6', '1:3:5:7:9'], correct: 1, marks: 1 },
    { text: '(ii) If the area of the region representing Gold scoring area is A, then the area of the region representing Red scoring area is', options: ['2A', 'A', '3A', '4A'], correct: 2, marks: 1 },
    { text: '(iii) If the area of the region representing Gold scoring area is A, then the area of the region representing Blue score area is', options: ['2A', '3A', '4A', '5A'], correct: 3, marks: 1 },
    { text: '(iv) If the area of the region representing Gold scoring area is A, then the area of the region representing Black score area is', options: ['8A', '7A', '6A', '5A'], correct: 1, marks: 1 },
    { text: '(v) If the area of the region representing Red scoring area is A, then the area of the region representing Blue scoring area is', options: ['5/3 A', '3/5 A', '2A', '7/3 A'], correct: 0, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 12.28 (archery target, 5 concentric scoring bands: Gold, Red, Blue, Black, White)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.12.20, item 58: "(i)(b) (ii)(c) (iii)(d) (iv)(b) (v)(a)" (independently re-verified by computation)',
  explanation: 'Radii: Gold=10.5, Red(outer)=21, Blue(outer)=31.5, Black(outer)=42, White(outer)=52.5 — i.e. multiples 1,2,3,4,5 of 10.5. (i) Circumferences scale with radius: 1:2:3:4:5. Let A=Gold area=π(10.5)². (ii) Area up to Red=π(21)²=4A; Red band=4A-A=3A. (iii) Area up to Blue=π(31.5)²=9A; Blue band=9A-4A=5A. (iv) Area up to Black=π(42)²=16A; Black band=16A-9A=7A. (v) Red band=3A (from ii); Blue band=5A (from iii); ratio Blue/Red=5/3, so if Red=A(new), Blue=(5/3)A.',
});

// p.12.18 — Case Study 59 (silver-wire brooch, Fig. 12.29)
items.push({
  kind: 'case', sourceQuestionNumber: '59', sourcePage: '12.18',
  text: 'A brooch is made with silver wire in the form of a circle with diameter 35 mm. The wire is also used in making 5 diameters which divide the circle into 10 equal sectors as shown in Fig. 12.29. Using the above information answer the following questions:',
  parts: [
    { text: '(i) The circumference of the brooch is', options: ['100 mm', '120 mm', '110 mm', '95 mm'], correct: 2, marks: 1 },
    { text: '(ii) The area of the brooch is', options: ['962.5 mm²', '926.5 mm²', '960.5 mm²', '956.5 mm²'], correct: 0, marks: 1 },
    { text: '(iii) The total length of silver wire used in making the brooch is', options: ['258 mm', '285 mm', '185 mm', '385 mm'], correct: 1, marks: 1 },
    { text: '(iv) The area of each sector of the brooch is', options: ['69.25 mm²', '92.65 mm²', '86.25 mm²', '96.25 mm²'], correct: 3, marks: 1 },
    { text: '(v) The sector angle of each sector of the brooch is', options: ['60°', '18°', '36°', '30°'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 12.29 (circular brooch, diameter 35mm, 5 diameters dividing it into 10 equal sectors)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.12.20, item 59: "(i)(c) (ii)(a) (iii)(b) (iv)(d) (v)(c)" (independently re-verified by computation)',
  explanation: '(i) Circumference=πd=(22/7)(35)=110mm. (ii) Area=πr²=(22/7)(17.5²)=(22/7)(306.25)=962.5mm². (iii) Wire=circumference+5 diameters=110+5(35)=110+175=285mm. (iv) Each sector=962.5/10=96.25mm². (v) Sector angle=360/10=36°.',
});

// p.12.19 — Assertion-Reason MCQs 60-68
const AR_INSTRUCTIONS = 'Each of the following contains STATEMENT-1 (A) and STATEMENT-2 (R), with choices: (a) both true, Statement-2 is a correct explanation for Statement-1; (b) both true, Statement-2 is not a correct explanation for Statement-1; (c) Statement-1 is true, Statement-2 is false; (d) Statement-1 is false, Statement-2 is true.';

items.push(mcq(60, P1219, `${AR_INSTRUCTIONS} Statement-1 (A): If the areas of two circles are in the ratio 9:16, then their circumferences are in the ratio 3:4. Statement-2 (R): If the areas of two circles are in the ratio A₁:A₂, then their circumferences are in the ratio √A₁:√A₂.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: 'Area ratio 9:16 ⇒ radius ratio √9:√16=3:4=circumference ratio, matching Statement-1. Statement-2 is the correct general formula (circumference ∝ radius ∝ √area) and directly derives Statement-1 — correct explanation.' }));
items.push(mcq(61, P1219, `${AR_INSTRUCTIONS} Statement-1 (A): If areas of two circles are in the ratio 9:25, then their radii are in the ratio 3:5. Statement-2 (R): If A₁,A₂ are the areas of two circles, then their radii are in the ratio √A₁:√A₂.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: '√9:√25=3:5, matching Statement-1 exactly via the general formula in Statement-2 — correct explanation.' }));
items.push(mcq(62, P1219, `${AR_INSTRUCTIONS} Statement-1 (A): A track is in the form of a circular ring. If the inner and outer circumferences of the track are 352 m and 396 m respectively, then the width of the track is 14 metres. Statement-2 (R): If the inner and outer circumferences of a circular annulus are C₁ and C₂ respectively, then the width of the annulus is (C₂-C₁)/(2π).`, ['(a)', '(b)', '(c)', '(d)'], 3, { explanation: 'Using Statement-2\'s (correct) formula: width=(396-352)/(2×22/7)=44/(44/7)=7 metres, not 14 metres as Statement-1 claims — Statement-1 is false. Statement-2 is the correct general formula, true.' }));
items.push(mcq(63, P1219, `${AR_INSTRUCTIONS} Statement-1 (A): A circle circumscribes a square of side 'a', then the area of the region outside the square and enclosed by the circle is (π/2-1)a² sq. units. Statement-2 (R): A circle is inscribed in a square of side 2a units. If the circle touches all the sides of the square, then the area of the region outside the circle and inside the square is (4-π)a² sq. units.`, ['(a)', '(b)', '(c)', '(d)'], 1, { explanation: 'Statement-1: circumscribing circle has radius=a√2/2, area=πa²/2; region outside square=πa²/2-a²=(π/2-1)a² — true. Statement-2: circle inscribed in square of side 2a has radius a, area πa²; region outside circle=4a²-πa²=(4-π)a² — also true, but it describes a different, unrelated configuration (inscribed vs circumscribed) and does not explain Statement-1.' }));
items.push(mcq(64, P1219, `${AR_INSTRUCTIONS} Statement-1 (A): If the length of the minute hand of a clock is 7 cm, then the area swept by it in 5 minutes is 77/6 cm². Statement-2 (R): The length of an arc of a sector of angle θ and radius r is given by l=(θ/360)×2πr.`, ['(a)', '(b)', '(c)', '(d)'], 1, { explanation: 'In 5 minutes the minute hand sweeps (5/60)×360=30°; area=(30/360)×π×7²=(1/12)×(22/7)×49=154/12=77/6cm² — Statement-1 true. Statement-2 is a true general formula, but it is the ARC LENGTH formula, not the area formula used to verify Statement-1, so it does not correctly explain it.' }));
items.push(mcq(65, P1219, `${AR_INSTRUCTIONS} Statement-1 (A): The area of the minor segment of a circle is always less than the area of the corresponding sector of the circle. Statement-2 (R): The area of the major segment of a circle is always less than the area of the corresponding sector of the circle.`, ['(a)', '(b)', '(c)', '(d)'], 2, { explanation: 'Minor segment=sector-triangle < sector (triangle area>0) — Statement-1 true. Major segment=circle-minor segment=major sector+triangle > major sector — so the major segment is actually GREATER than its corresponding sector, making Statement-2 false.' }));
items.push(mcq(66, P1219, `${AR_INSTRUCTIONS} Statement-1 (A): If three sectors whose sector angles are 35°, 65° and 80° are cut from a circle, then the sum of their sector areas is half of the area of the circle. Statement-2 (R): If 3 sectors of sector angles θ₁°, θ₂° and θ₃° are cut from a circle of radius r, then the sum of the areas of these sectors is (π/360)(θ₁+θ₂+θ₃)r².`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: '35+65+80=180°. Statement-2\'s general formula gives sum=(π/360)(180)r²=πr²/2, exactly half the circle\'s area — confirms Statement-1 and correctly explains it.' }));
items.push(mcq(67, P1219, `${AR_INSTRUCTIONS} Statement-1 (A): If a motorcycle wheel covers 22 km distance in 5000 revolutions, then the radius of the wheel is 70 cm. Statement-2 (R): If a chord of a circle of radius r subtends a right angle at the centre of the circle, then area of the corresponding segment is (1/4)(π-2)r² sq. units.`, ['(a)', '(b)', '(c)', '(d)'], 1, { explanation: 'Distance per revolution=2200000cm/5000=440cm=2πr ⇒ r=440/(2×22/7)=440×7/44=70cm — Statement-1 true. Statement-2 (a 90° segment area=(1/4)(π-2)r², verified directly: sector/4-triangle/2=(π/4-1/2)r²=(π-2)r²/4) is also true, but concerns an unrelated chord/segment scenario, not the wheel problem — does not explain Statement-1.' }));
items.push(mcq(68, P1219, `${AR_INSTRUCTIONS} Statement-1 (A): If the circumference of a circle is 176 cm, then its radius is 28 cm. Statement-2 (R): Circumference = 2π × Radius of a circle.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: 'r=176/(2×22/7)=176×7/44=28cm, matching Statement-1 directly via the formula in Statement-2 — correct explanation.', source: 'CBSE 2024' }));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Areas Related to Circles',
  chapterOrder: 12,
  sourceFileIds: [SF],
  label: 'CBSE Maths Areas Related to Circles Ch.12 (ch12-13.pdf, pp.12.16-12.20, items 38-68)',
});
console.log(JSON.stringify(result, null, 2));
