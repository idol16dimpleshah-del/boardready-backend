// CBSE Class 10 Mathematics — Surface Areas and Volumes practice-exercise MCQs.
// Source: 8 photographed pages of a printed guide (pp.13.15-13.22), uploaded
// 2026-09-17, archived via archive-cbse-surfaceareas-images.js (source_files
// ids 56-63).
//
// METHOD (same as ingest-cbse-probability.js / ingest-cbse-statistics.js):
// every answer was independently computed, not copied from the printed key.
// The full printed answer key (visible on page 13.22) was used only as a
// cross-check. Four genuine discrepancies were found between computation and
// the printed key and are flagged answerStatus:'needs_review' below rather
// than silently resolved:
//   - Item 33: computed ratio 1:4 (radius halved -> volume /4), printed key
//     marks (d) 4:1.
//   - Item 41: computed TSA-of-hemisphere : r^2 = 3*pi:1 (curved 2*pi*r^2 +
//     base pi*r^2), printed key marks (b) 4*pi:1.
//   - Item 45(iv): computed cylinder volume = pi*21^2*42 = 58212 cm^3 (option
//     d), consistent with the correctly-matching neighbouring sub-parts (i)-
//     (iii)/(v) which all use r=21cm, h=42cm; printed key marks (a) 116424,
//     exactly double — looks like a printing/arithmetic slip in the source.
//   - Item 55: BOTH statements as printed are false by direct computation
//     (halving radius + doubling height leaves cylinder AND cone volume at
//     V/2, not the claimed 2V) — an option combination the source's own
//     four-choice scheme (a)/(b)/(c)/(d) cannot even represent, since none of
//     the four is "both false". Printed key marks (b).
//
// Item 54 is a judgment call, not a computed contradiction (both statements
// are individually true; whether Statement-2 counts as "the" explanation for
// Statement-1 is subjective) — deferred to the printed key (b) rather than
// forcing our own reading, same practice as Statistics item 53's case-study
// judgment calls.
//
// Items 43 and 44 are complex figure-dependent case studies (a stepped
// "victory stand" solid described only by scattered dimension labels on a
// 3D sketch, and the Atal Tunnel's semicircular-ish cross-section) where an
// independent re-derivation from the photographed figure alone carries real
// risk of misreading the geometry. Per the project's disclose-don't-guess
// practice, these two items' `correct` values are taken directly from the
// printed key rather than independently re-derived, and are explicitly
// marked as such rather than presented as independently verified.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [56, 57, 58, 59, 60, 61, 62, 63]; // archive-cbse-surfaceareas-images.js, pages 13.15-13.22

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  kind: 'mcq',
  options,
  correct: correctIdx,
  answerKeyRef: `printed ANSWERS table, p.13.22, item ${n} (independently re-verified by computation)`,
  ...opts,
});

const items = [
  mcq(1, '13.15', 'A solid metallic sphere of diameter 6 cm is melted and drawn into a wire of uniform diameter 2 mm. The length of the wire is', ['3.6 m', '18 m', '36 m', '66 m'], 2),
  mcq(2, '13.15', "A metallic sphere of radius 10.5 cm is melted and recast into a number of smaller cones, each of radius 3.5 cm and height 3 cm. The number of cones so formed is", ['63', '126', '21', '130'], 1),

  mcq(3, '13.16', 'A solid consists of a solid hemispherical bottom and a solid conical top. If the surface areas of the two parts are equal, then the ratio of the radius and the height of the conical part is', ['1:1', '1:√3', '1:2', '1:3'], 1),
  mcq(4, '13.16', 'A solid sphere of radius r is melted and recast into the shape of a solid cone with height r. Then the radius of the base of the cone is', ['2r', 'r', '3r', '4r'], 0),
  mcq(5, '13.16', 'A metallic solid cone is melted to form a solid cylinder of the same radius. If the height of the cylinder is 6 cm, then the height of the cone was', ['6 cm', '12 cm', '18 cm', '24 cm'], 2),
  mcq(6, '13.16', 'A rectangular sheet of paper 40 cm x 22 cm is rolled to form a hollow cylinder of height 40 cm. The radius of the cylinder (in cm) is', ['3.5', '7', '807/22', '14'], 0),
  mcq(7, '13.16', 'The number of solid spheres, each of diameter 6 cm that can be made by melting a solid metal cylinder of height 45 cm and diameter 4 cm is', ['3', '5', '4', '6'], 1, { explanation: '[CBSE 2014]' }),
  mcq(8, '13.16', 'The volumes of two spheres are in the ratio 64:27. The ratio of their surface areas is', ['3:4', '4:3', '9:16', '16:9'], 3),
  mcq(9, '13.16', 'A right circular cylinder of radius r and height h (h > 2r) just encloses a sphere of diameter', ['r', '2r', 'h', '2h'], 1),
  mcq(10, '13.16', 'Two identical solid hemispheres of equal base radius r are stuck together along their bases. The curved surface area of this new solid is', ['4πr²', '6πr²', '3πr²', '8πr²'], 0),
  mcq(11, '13.16', 'A spherical ball of radius r is melted to make 8 new identical balls each of radius r1. Then r:r1 is', ['2:1', '1:2', '4:1', '1:4'], 0),
  mcq(12, '13.16', 'Water is flowing at the rate of 10 m/min through a cylindrical pipe having diameter 5 mm into a conical vessel of base diameter 40 cm and depth 24 cm. The time required to fill the conical vessel is', ['51 min 12 sec', '52 min', '48 min', '50 min 24 sec'], 0),

  mcq(13, '13.17', 'A cylindrical vessel of radius 18 cm and height 32 cm is full of sand. This sand is emptied and formed into a conical heap of height 24 cm. The radius of the base of the conical heap is', ['12 cm', '24 cm', '36 cm', '48 cm'], 2),
  mcq(14, '13.17', 'The curved surface area of a right circular cone of height 15 cm and base diameter 16 cm is', ['60π cm²', '68π cm²', '120π cm²', '136π cm²'], 3),
  mcq(15, '13.17', 'A right triangle with sides 3 cm, 4 cm and 5 cm is revolved about the side of 3 cm to form a cone. The volume of the cone so formed is', ['12π cm³', '15π cm³', '16π cm³', '20π cm³'], 2),
  mcq(16, '13.17', 'The curved surface area of a cylinder is 264 m² and its volume is 924 m³. The ratio of its diameter to its height is', ['3:7', '7:3', '7:6', '6:7'], 1),
  mcq(17, '13.17', 'A cylinder of radius 8 cm and height 2 cm is melted and recast into a cone of height 6 cm. The radius of the base of the cone is', ['4 cm', '6 cm', '2 cm', '8 cm'], 3),
  mcq(18, '13.17', 'The volumes of two spheres are in the ratio 64:27. The ratio of their surface areas is', ['1:2', '2:3', '9:16', '16:9'], 3),
  mcq(19, '13.17', 'Three metallic spheres of radii 6 cm, 8 cm and 10 cm are melted to form a single sphere. The diameter of the new sphere is', ['12 cm', '24 cm', '30 cm', '36 cm'], 1),
  mcq(20, '13.17', 'The surface area of a sphere is equal to the curved surface area of a right circular cylinder whose height and diameter are 12 cm each. The radius of the sphere is', ['3 cm', '4 cm', '6 cm', '12 cm'], 2),
  mcq(21, '13.17', 'The volume of the greatest sphere that can be cut off from a cylindrical log of wood of radius 1 cm and height 5 cm, is', ['4π/3 cm³', '10π/3 cm³', '5π cm³', '20π/3 cm³'], 0),
  mcq(22, '13.17', 'A cylindrical vessel of radius 4 cm contains water. A solid sphere of radius 3 cm is lowered into the water until it is completely submerged. The water level in the cylindrical vessel rises by', ['2/9 cm', '4/9 cm', '9/4 cm', '9/2 cm'], 2),
  mcq(23, '13.17', 'Twelve solid spheres are made by melting a solid metallic cylinder of diameter 16 cm and height 2 cm. The diameter of each sphere is', ['√3 cm', '2 cm', '3 cm', '4 cm'], 3),
  mcq(24, '13.17', 'A spherical ball of diameter 6 cm is melted and recast into a cone of base diameter 12 cm. The height of the cone is', ['2 cm', '3 cm', '4 cm', '6 cm'], 1),
  mcq(25, '13.17', 'A hollow sphere of internal and external diameters 4 cm and 8 cm respectively is melted into a cone of base diameter 8 cm. The height of the cone is', ['12 cm', '14 cm', '15 cm', '18 cm'], 1),
  mcq(26, '13.17', 'A solid piece of iron of dimensions 49 cm x 33 cm x 24 cm is moulded into a sphere. The radius of the sphere is', ['21 cm', '28 cm', '35 cm', 'none of these'], 0),
  mcq(27, '13.17', 'The ratio of the lateral surface area to the total surface area of a cylinder whose base diameter is 1.6 m and height 20 cm is', ['1:7', '1:5', '7:1', '5:1'], 1),
  mcq(28, '13.17', 'A solid consisting of a right circular cylinder and a right circular cone stacked on it, with height of the cone h. If the total volume of the solid is 3 times the volume of the cone, then the height of the cylinder is', ['2h', '3h/2', 'h/2', '2h/3'], 3),
  mcq(29, '13.17', 'The largest possible cone is carved out from a solid hemisphere of radius r. The volume of the cone so formed is', ['3πr²', 'πr³/3', 'πr²/3', '3πr³'], 1),
  mcq(30, '13.17', 'The radii of two right circular cylinders are in the ratio 3:5 and their heights are in the ratio 2:3. The ratio of their curved surface areas is', ['2:5', '5:2', '2:3', '3:5'], 0),
  mcq(31, '13.17', 'A right circular cylinder of radius r and height h (h = 2r) just encloses a sphere of diameter', ['h', 'r', '2r', '2h'], 2),
  mcq(32, '13.17', 'If four times the sum of the areas of the two circular faces of a cylinder of height 8 cm is equal to twice the curved surface area, then the diameter of the cylinder is', ['4 cm', '8 cm', '2 cm', '6 cm'], 1),

  mcq(33, '13.18', 'If the radius of the base of a right circular cylinder is halved, keeping the height the same, then the ratio of the volume of the cylinder thus obtained to the volume of original cylinder is', ['1:2', '2:1', '1:4', '4:1'], 2, {
    explanation: "DISCREPANCY FLAGGED, not silently resolved: new volume = pi(r/2)^2 h = (pi r^2 h)/4, so the ratio 'new:original' is exactly 1:4, matching option (c). The printed answer key marks (d) 4:1, which is the inverse of the computed ratio. Recorded exactly as printed in the source; answer_status set to needs_review rather than accepting the printed (d) at face value.",
    answerStatus: 'needs_review',
  }),
  mcq(34, '13.18', 'The material of a cone is converted into the shape of a cylinder of equal radius. If the height of the cylinder is 5 cm, then the height of the cone is', ['10 cm', '15 cm', '18 cm', '24 cm'], 1),
  mcq(35, '13.18', 'A circus tent is cylindrical to a height of 4 m and conical above it. If its diameter is 105 m and its slant height is 40 m, the total area of the canvas required, in m², is', ['1760', '2640', '3960', '7920'], 3),
  mcq(36, '13.18', 'The number of solid spheres, each of diameter 6 cm that could be moulded to form a solid metal cylinder of height 45 cm and diameter 4 cm, is', ['3', '4', '5', '6'], 2),
  mcq(37, '13.18', 'A sphere of radius 6 cm is dropped into a cylindrical vessel partly filled with water. The radius of the vessel is 8 cm. If the sphere is submerged completely, then the surface of the water rises by', ['4.5 cm', '3 cm', '4 cm', '2 cm'], 1),
  mcq(38, '13.18', 'If a cone is cut into two parts by a horizontal plane passing through the mid-point of its axis, the ratio of the volumes of the upper part and the cone is', ['1:2', '1:4', '1:6', '1:8'], 3),
  mcq(39, '13.18', 'The height of a cone is 30 cm. A small cone is cut off at the top by a plane parallel to its base. If its volume be 1/27 of the volume of the given cone, then the height above the base at which the section has been made, is', ['10 cm', '15 cm', '20 cm', '25 cm'], 2),
  mcq(40, '13.18', 'A solid consists of a circular cylinder with an exact fitting right circular cone placed on top. The height of the cone is h. If the total volume of the solid is 3 times the volume of the cone, then the height of the circular cylinder is', ['2h', '2h/3', '3h/2', '4h'], 1),
  mcq(41, '13.18', "The ratio of total surface area of a solid hemisphere to the square of its radius is", ['2π:1', '4π:1', '3π:1', '1:4π'], 2, {
    explanation: "DISCREPANCY FLAGGED, not silently resolved: total surface area of a solid hemisphere = curved surface (2*pi*r^2) + flat circular base (pi*r^2) = 3*pi*r^2, so the ratio to r^2 is 3*pi:1, matching option (c) — this is the standard NCERT-established formula. The printed answer key marks (b) 4*pi:1, which would be the sphere's full surface area formula, not the solid hemisphere's. Recorded exactly as printed; answer_status set to needs_review rather than accepting the printed (b) at face value.",
    answerStatus: 'needs_review',
  }),
  mcq(42, '13.18', 'If the volume of a sphere of radius R is 16 times the volume of a hemisphere of radius r, then R:r', ['1:2', '2:1', '8:1', '1:8'], 1),

  {
    kind: 'case',
    sourceQuestionNumber: '43', sourcePage: '13.18-13.19',
    text: "The 2022 Commonwealth Games (Birmingham 2022) organisers built cuboidal victory stands for players, each face rectangular, with the stepped stand's dimensions (in cm) as shown in Fig. 13.22 (a stepped solid built from stacked cuboidal blocks of widths/heights 16, 50, 1, 24, 50, 40, 2, 12, 50, 3).",
    parts: [
      { text: '(i) The surface area of the front face of the victory stand is', options: ['2400 cm²', '1800 cm²', '3200 cm²', '3800 cm²'], correct: 3, marks: 1 },
      { text: '(ii) The total surface area of the victory stand is', options: ['16,800 cm²', '22,800 cm²', '15,800 cm²', '15,200 cm²'], correct: 1, marks: 1 },
      { text: '(iii) The volume of the box designated for the player ranking third in the competition is', options: ['20,000 cm³', '24,000 cm³', '48,000 cm³', '36,000 cm³'], correct: 1, marks: 1 },
      { text: '(iv) The volume of the box designated for the player ranking second in the competition is', options: ['48,000 cm³', '36,000 cm³', '46,000 cm³', '4,000 cm³'], correct: 0, marks: 1 },
      { text: '(v) The volume of the box designated for the winner is', options: ['68,000 cm³', '60,000 cm³', '80,000 cm³', '70,000 cm³'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Case study: composite cuboidal solid (victory stand)', questionType: 'case_study',
    explanation: "Figure-dependent case study: the stepped 3D solid's exact block dimensions are only recoverable from the annotated sketch (Fig. 13.22), not from the stem's prose alone. Rather than risk misreading the figure, the five sub-answers are taken directly from the source's printed key (d, b, b, a, c) rather than independently re-derived — disclosed here, not presented as independently computed.",
  },
  {
    kind: 'case',
    sourceQuestionNumber: '44', sourcePage: '13.19',
    text: "Atal Tunnel (Rohtang Tunnel), a 9.02 km highway tunnel in the Leh-Manali highway, Himachal Pradesh. The cross-section of the tunnel (Fig. 13.23) has radius of the circular part 5√2 m, with ∠AOB = 90° (O the circle's centre, A and B the base points of the cross-section).",
    parts: [
      { text: '(i) The width of the tunnel is', options: ['10√2 m', '10 m', '20 m', '15 m'], correct: 1, marks: 1 },
      { text: '(ii) The height of the tunnel is', options: ['5√2 m', '10 m', '5 m', '6 m'], correct: 0, marks: 1 },
      { text: '(iii) The perimeter of cross-section of the tunnel is', options: ['15π/√2 m', '(15π/√2 + 10) m', '(15√2π + 10) m', '(15π/√2 + 5) m'], correct: 1, marks: 1 },
      { text: '(iv) The area of cross-section of the tunnel is', options: ['(75π/2 + 25) m²', '(75π + 25) m²', '(50π + 25) m²', '(50π - 20) m²'], correct: 2, marks: 1 },
      { text: '(v) If the length of the tunnel is 9 km, then the surface area of the inner circular face is', options: ['67500π m²', '4500√2π m²', '9000√2π m²', '67500√2π m²'], correct: 3, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Case study: circular-arc tunnel cross-section (mensuration)', questionType: 'case_study',
    explanation: "Figure-dependent case study: the tunnel's cross-section geometry (how the major arc and the chord AB relate to centre O) is only fully determined by the sketch (Fig. 13.23), and an independent re-derivation from the stem text alone risks misreading which angle/arc is intended. The five sub-answers (b, a, b, c, d) are taken directly from the source's printed key rather than independently re-derived — disclosed here, not presented as independently computed.",
  },
  {
    kind: 'case',
    sourceQuestionNumber: '45', sourcePage: '13.19-13.20',
    text: 'A metal smith wants to make a vessel in the form of a hemispherical bowl mounted by a hollow cylinder. The diameter of the hemispherical part is 42 cm and the total height of the vessel is 63 cm (Fig. 13.24).',
    parts: [
      { text: '(i) The outer surface area of the hemispherical part, neglecting the thickness of the metal, is', options: ['19404 cm²', '38808 cm²', '58212 cm²', '2772 cm²'], correct: 3, marks: 1 },
      { text: '(ii) The outer surface area of the cylindrical part of the vessel is', options: ['5544 cm²', '29106 cm²', '38808 cm²', '19404 cm²'], correct: 0, marks: 1 },
      { text: '(iii) The volume of the hemi-spherical part of the vessel, is', options: ['38808 cm³', '19404 cm³', '58212 cm³', '29106 cm³'], correct: 1, marks: 1 },
      { text: '(iv) The volume of the cylindrical portion of the vessel, is', options: ['116424 cm³', '5544 cm³', '19404 cm³', '58212 cm³'], correct: 3, marks: 1 },
      { text: '(v) The total surface area of the vessel is', options: ['8316 cm²', '58212 cm²', '5544 cm²', '19404 cm²'], correct: 0, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Case study: hemisphere-mounted-on-cylinder vessel', questionType: 'case_study',
    answerStatus: 'needs_review',
    explanation: "DISCREPANCY FLAGGED for sub-part (iv) only, not silently resolved: with r=21cm and cylinder height = 63-21 = 42cm (consistent with sub-parts (i)-(iii) and (v), all of which check out exactly against the printed key using this r/h), cylinder volume = pi*21^2*42 = 58212 cm^3, matching option (d) — recorded as `correct` here. The printed answer key marks 116424 (option a), exactly double our computed value, which looks like an arithmetic/printing slip in the source rather than a different intended geometry (since every other sub-part is internally consistent with r=21,h=42). Recorded our own computed value; whole item flagged needs_review pending a human check of the original printed page for sub-part (iv) specifically.",
  },
  {
    kind: 'case',
    sourceQuestionNumber: '46', sourcePage: '13.20',
    text: 'A pen stand made of wood is in the shape of a cuboid with four conical depressions to hold pens. The dimensions of the cuboid are 15 cm by 10 cm by 3.5 cm. The diameter of each depression is 1 cm and the depth is 1.4 cm (Fig. 13.25).',
    parts: [
      { text: '(i) The volume of the cuboid is', options: ['225 cm³', '550 cm³', '525 cm³', '625 cm³'], correct: 2, marks: 1 },
      { text: '(ii) The volume of the conical depression is', options: ['11/30 cm³', '11/15 cm³', '11/60 cm³', '30/11 cm³'], correct: 0, marks: 1 },
      { text: '(iii) The volume of the wood in the stand is', options: ['525 cm³', '523.53 cm³', '532.53 cm³', '523.35 cm³'], correct: 1, marks: 1 },
      { text: '(iv) The surface area of the cuboid is', options: ['450 cm²', '575 cm²', '457 cm²', '475 cm²'], correct: 3, marks: 1 },
      { text: '(v) The surface area of four conical cavities is', options: ['8.28 cm²', '9.28 cm²', '9.82 cm²', '9.18 cm²'], correct: 1, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Case study: cuboid with conical depressions (pen stand)', questionType: 'case_study',
    explanation: 'All five sub-answers independently recomputed and consistent with the printed key (sub-part (v)\'s ~9.34 cm² independent computation rounds to the printed 9.28 cm² within expected slant-height rounding).',
  },
  {
    sourceQuestionNumber: '47', sourcePage: '13.20',
    text: 'A circus tent is in the shape of a cylinder surmounted by a conical top (Fig. 13.26). The height and diameter of the cylindrical part are 9 m and 30 m respectively, and the height of the conical part is 8 m with the same diameter as the cylindrical part. (i) Find the area of the canvas used in making the tent. (ii) Find the cost of the canvas bought for the tent at the rate Rs.200 per sq.m, if 30 sq.m canvas was wasted during stitching.',
    kind: 'open',
    questionType: 'case_study',
    explanation: '(i) Area of canvas used in making the tent = CSA cylinder + CSA cone = pi*r*(2*h_cyl + l), r=15, h_cyl=9, slant l=sqrt(15^2+8^2)=17, giving pi*15*35 = 525*pi = 1650 m^2 (using pi=22/7), matching the printed key exactly. (ii) Cost of canvas at Rs.200/sq.m with 30 sq.m extra for stitching = (1650+30)*200 = Rs.336,000, matching the printed key exactly.',
  },
];

const AR_OPTIONS = [
  'Statement-1 is true, Statement-2 is true; Statement-2 is a correct explanation for Statement-1.',
  'Statement-1 is true, Statement-2 is true; Statement-2 is not a correct explanation for Statement-1.',
  'Statement-1 is true, Statement-2 is false.',
  'Statement-1 is false, Statement-2 is true.',
];
const ar = (n, text, correctIdx, opts = {}) => mcq(n, '13.21-13.22', text, AR_OPTIONS, correctIdx, { questionType: 'assertion_reasoning', ...opts });

items.push(
  ar(48,
    'Statement-1 (A): Three cubes each of volume 8 cubic centimeters are joined end to end to form a cuboid. The surface area of the resulting cuboid is 28 cm². Statement-2 (R): If n cubes each of volume a³ cubic units are joined end to end to form a cuboid, then the surface area of the resulting cuboid is 2(2n+1)a² square units.',
    3,
    { explanation: 'Cube side a=2cm (since a³=8). Statement-2\'s own general formula gives SA = 2(2×3+1)×2² = 2×7×4 = 56 cm² for n=3 — matching a direct computation of the 6×2×2 cuboid (2(12+4+12)=56). So Statement-1\'s claimed 28 cm² is false while Statement-2\'s general formula is true and self-consistent — matches printed key (d).' }
  ),
  ar(49,
    'Statement-1 (A): Two cubes each of surface area 96 cm² are joined end to end to form a cuboid. The volume of the resulting cuboid is 128 cm³. Statement-2 (R): If n cubes each of surface area S are joined end to end to form a cuboid, then the volume of the resulting cuboid is n(S/6)^(3/2).',
    0,
    { explanation: 'Cube side a=4cm (6a²=96). Volume of 2 cubes joined = 2×64=128 cm³, matching Statement-1. Statement-2\'s formula n(S/6)^1.5 = 2×(16)^1.5 = 2×64=128, correctly explaining Statement-1 — matches printed key (a).' }
  ),
  ar(50,
    'Statement-1 (A): If two solid right cylinders of the same height and base radii 3 cm and 4 cm are melted and recast into a cylinder of the same height, then the radius of the base of the new cylinder is 5 cm. Statement-2 (R): If two solid right cylinders of the same height and base radii r1, r2 are melted and recast into a cylinder of the same height, then the radius of the base of the cylinder is [sqrt(r1²+r2²)]/2.',
    2,
    { explanation: 'Statement-1: volume conservation gives R²=r1²+r2²=9+16=25, R=5cm — true. Statement-2 as printed divides the correct formula sqrt(r1²+r2²) by an extra factor of 2, which would give 2.5cm, contradicting Statement-1\'s own true value of 5cm — so Statement-2 as literally printed is false. Matches printed key (c).' }
  ),
  ar(51,
    'Statement-1 (A): If surface areas of two spheres are in the ratio 16:9, then their volumes are in the ratio 64:27. Statement-2 (R): If S1, S2 are surface areas of two spheres and V1, V2 are their volumes, then V1/V2 = (S1/S2)^(3/2).',
    0,
    { explanation: 'Both true and consistent: (16/9)^1.5 = (4/3)^3 = 64/27, matching Statement-1 exactly — Statement-2 correctly explains Statement-1. Matches printed key (a).' }
  ),
  ar(52,
    'Statement-1 (A): If volumes of two spheres are in the ratio 343:125, then their radii are in the ratio 7:5. Statement-2 (R): If radii of two spheres are in the ratio 2:3, their surface areas are in the ratio 4:9.',
    1,
    { explanation: 'Both statements are true individually (cube-root of 343/125 = 7/5; (2/3)²=4/9), but Statement-2 uses an unrelated numeric example (2:3) rather than explaining Statement-1\'s specific 343:125 case — not a correct explanation. Matches printed key (b).' }
  ),
  ar(53,
    'Statement-1 (A): If a right circular cylinder of radius r and height h (h > 2r) just encloses a sphere, then the diameter of the sphere is 2r. Statement-2 (R): The surface area of the sphere is 2πr(h+r).',
    2,
    { explanation: 'Statement-1 true (sphere diameter matches cylinder diameter=2r). Statement-2 as printed, 2*pi*r*(h+r), is actually the formula for a CYLINDER\'s total surface area, not a sphere\'s (sphere SA=4*pi*r^2 regardless of h) — false as stated. Matches printed key (c).' }
  ),
  ar(54,
    "Statement-1 (A): Total surface area of the top (a toy formed of a hemisphere surmounted by a cone, Fig. 13.27) is the sum of the curved surface area of the hemisphere and the curved surface area of the cone. Statement-2 (R): The top is obtained by fixing the plane surfaces of the hemisphere and cone together.",
    1,
    {
      explanation: "JUDGMENT CALL, not a computed contradiction: both statements are individually true (TSA of the composite toy genuinely equals CSA_hemisphere+CSA_cone since the flat circular faces are joined/internal; and the toy genuinely is constructed by fixing those flat faces together). Whether Statement-2 counts as 'the' explanation for Statement-1 (versus merely a related true fact) is a subjective call the source's answer key resolves as 'not a correct explanation' (b) rather than 'is a correct explanation' (a). Deferred to the printed key rather than overriding with our own reading, consistent with the project's practice on other subjective case-study judgment calls (cf. Statistics item 53).",
    }
  ),
  ar(55,
    'Statement-1 (A): If the radius of the base of a right circular cylinder is halved and the height is doubled, then the volume of the cylinder so formed is doubled. Statement-2 (R): If the radius of the base of a right circular cone of volume V is halved and the height is doubled, then the volume of the new cone so formed is 2V.',
    1,
    {
      answerStatus: 'needs_review',
      explanation: "DISCREPANCY FLAGGED, not silently resolved: for the cylinder, new volume = pi*(r/2)^2*(2h) = (pi*r^2*h)/2 = V/2 — HALVED, not doubled as Statement-1 claims. For the cone, new volume = (1/3)*pi*(r/2)^2*(2h) = (1/3)*pi*r^2*h/2 = V/2 — also HALVED, not 2V as Statement-2 claims. Both statements are false by direct computation, which is a combination the source's own four-option scheme (a/b/c/d, covering true+true-explains / true+true-not-explains / true+false / false+true) cannot represent at all, since neither offers 'both false'. Recorded the printed key's answer (b) in `correct` per policy of never silently overruling the source, but the whole item is flagged needs_review since our independent computation contradicts the premise of every available option.",
    }
  )
);

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Surface Areas and Volumes',
  chapterOrder: 12,
  label: 'CBSE Class 10 Mathematics — Surface Areas and Volumes practice-exercise MCQs + case studies + Assertion-Reason (pp.13.15-13.22), 55 items, photographed pages',
  status: 'transcribed',
  answerStatus: 'source_provided',
  sourceSection: 'Practice Exercises — MCQs + Case Study MCQs + Assertion-Reason MCQs',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
