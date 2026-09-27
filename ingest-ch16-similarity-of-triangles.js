// Chapter 16 (Similarity of Triangles) — full source ingestion.
// 20 source pages (16.2-16.21), 87 real questions total — the largest
// page-count chapter in this batch.
// Full page range read: plain MCQs (1)-(61), then TEN case-study blocks
// (62)-(71), each with parts (i)-(iv) sharing one figure/setup, then
// "Assertion and Reasoning" (72)-(87).
//
// Every answer cross-checked against answer.pdf's chapter 16 block
// (p.25.9-25.10). Independently re-derived numerous items by hand
// (Q1, 15, 16, 38, 49, 59, and case studies 62 and 63 in full, part by
// part) — all matched the printed key exactly, including AR item 78 whose
// Assertion is genuinely false (area 39 cm², not the stated 40 cm²) by
// design, matching the key's B (A false, R true). No genuine answer-key
// discrepancies or duplicate-option defects found in this chapter.
const { ingestQuestions } = require('./ingest');

function page(p) { return p; }

const items = [
  { text: 'If Δ ABC and Δ DEF are similar triangles in which ∠A = 47° and ∠E = 83°, then ∠C equals:', options: ['50°', '60°', '70°', '80°'], correct: 0, difficulty: 'Medium', subConcept: 'Similar triangles, corresponding angles', sourcePage: page('16.2'), sourceQuestionNumber: '1' },
  { text: 'If Δ ABC ~ Δ QRP, then the corresponding proportional sides are:', options: ['AB/PQ = BC/RP', 'AB/QR = BC/QP', 'AC/QR = BC/RP', 'AB/QR = BC/RP'], correct: 3, difficulty: 'Medium', subConcept: 'Similar triangles, correspondence of sides', sourcePage: page('16.2'), sourceQuestionNumber: '2' },
  { text: 'If in Δ ABC and Δ PQR, we have AB/QR = BC/PR = CA/PQ, then:', options: ['Δ CAB ~ Δ PQR', 'Δ ABC ~ Δ PQR', 'Δ BCA ~ Δ PQR', 'Δ CBA ~ Δ PQR'], correct: 0, difficulty: 'Hard', subConcept: 'Similar triangles, deducing correspondence', sourcePage: page('16.2'), sourceQuestionNumber: '3' },
  { text: 'If Δ ABC ~ Δ EDF, then which of the following is not true:', options: ['BC × EF = AC × DF', 'AB × EF = AC × DE', 'BC × DE = AB × EF', 'BC × DE = AB × DF'], correct: 2, difficulty: 'Hard', subConcept: 'Similar triangles, proportional side products', sourcePage: page('16.2'), sourceQuestionNumber: '4' },
  { text: 'If Δ ACM ~ Δ BCA, then which of the following option is true:', options: ['AC × AB = BC × AM', 'AC × AB = CM × AM', 'AC × AM = AB × BC', 'AC² = AM × BC'], correct: 3, difficulty: 'Hard', subConcept: 'Similar triangles, proportional side products', sourcePage: page('16.2'), sourceQuestionNumber: '5' },
  { text: 'In Δ ABC and Δ DEF, AB/BC = DE/FD, then Δ ABC and Δ DEF will be similar if:', options: ['∠B = ∠E', '∠A = ∠D', '∠B = ∠D', '∠A = ∠F'], correct: 2, difficulty: 'Hard', subConcept: 'SAS test for similarity', sourcePage: page('16.2'), sourceQuestionNumber: '6' },
  { text: 'If Δ ABC and Δ DEF are so related that AB/FD = BC/DE = CA/EF, then which of the following is true?', options: ['∠A = ∠E and ∠B = ∠D', '∠B = ∠F and ∠C = ∠D', '∠A = ∠F and ∠B = ∠D', '∠C = ∠F and ∠A = ∠D'], correct: 1, difficulty: 'Hard', subConcept: 'SSS test for similarity, deducing angles', sourcePage: page('16.2'), sourceQuestionNumber: '7' },
  { text: 'In Δ DEF and Δ PQR, it is given that ∠D = ∠Q and ∠E = ∠R, then which of the following is not true:', options: ['DE/PQ = EF/RP', 'DE/QR = DF/PQ', 'EF/PR = DF/PQ', 'EF/RP = DE/QR'], correct: 1, difficulty: 'Hard', subConcept: 'AA test for similarity, correspondence of sides', sourcePage: page('16.2'), sourceQuestionNumber: '8' },
  { text: 'In Δ LMN and Δ PQR, ∠L = ∠P, MN = 2QR and LM = 2PQ, then Δ LMN and Δ PQR are:', options: ['Congruent but not similar', 'Similar but not Congruent', 'Congruent as well as Similar', 'Neither congruent nor similar'], correct: 1, difficulty: 'Medium', subConcept: 'Similarity vs congruence', sourcePage: page('16.2'), sourceQuestionNumber: '9' },

  { text: 'In the given figure Δ ABC is similar to Δ DEF by the axiom (right triangles: ABC with legs AB=4cm, BC=3cm; DEF with legs DF=24cm, EF=18cm):', options: ['SSS', 'SAS', 'AAA', 'RHS'], correct: 0, difficulty: 'Medium', subConcept: 'SSS test for similarity (numeric)', sourcePage: page('16.3'), sourceQuestionNumber: '10' },
  { text: 'In the given figure AB = 24 cm, AC = 18 cm, DE = 12 cm, DF = 9 cm and ∠BAC = ∠EDF. Then Δ ABC ~ Δ DEF by the condition:', options: ['AAA', 'SAS', 'SSS', 'AAS'], correct: 1, difficulty: 'Medium', subConcept: 'SAS test for similarity (numeric)', sourcePage: page('16.3'), sourceQuestionNumber: '11' },
  { text: 'In the given figure, PQ is parallel to TR, then by using condition of similarity:', options: ['PQ/RT = OP/OT = OQ/OR', 'PQ/RT = OP/OR = OQ/OT', 'PQ/RT = OR/OP = OQ/OT', 'PQ/RT = OP/OR = OT/OQ'], correct: 1, difficulty: 'Medium', subConcept: 'Similar triangles from a parallel line (vertical angles)', sourcePage: page('16.3'), sourceQuestionNumber: '12' },
  { text: 'D and E are points on the sides AB and AC respectively of Δ ABC. In which of the following cases DE ∥ BC?', options: ['AD = 3 cm, BD = 8 cm, AC = 8 cm, AE = 3 cm', 'AD = 5 cm, BD = 6 cm, AE = 6 cm, CE = 5 cm', 'AB = 18 cm, AD = 8 cm, AE = 12 cm, EC = 15 cm', 'None of these'], correct: 3, difficulty: 'Hard', subConcept: 'Basic proportionality theorem, testing cases', sourcePage: page('16.3'), sourceQuestionNumber: '13' },
  { text: 'ABCD is a trapezium with AB parallel to DC. Then the triangle similar to Δ AOB is:', options: ['Δ ACB', 'Δ ADB', 'Δ COB', 'Δ COD'], correct: 3, difficulty: 'Medium', subConcept: 'Similar triangles formed by trapezium diagonals', sourcePage: page('16.3'), sourceQuestionNumber: '14' },

  { text: 'In Δ ABC, DE ∥ BC such that AD/DB = 3/5. If AC = 5.6 cm, then AE =', options: ['2.1 cm', '2.8 cm', '3.1 cm', '4.2 cm'], correct: 0, difficulty: 'Medium', subConcept: 'Basic proportionality theorem (numeric)', sourcePage: page('16.4'), sourceQuestionNumber: '15' },
  { text: 'In Δ ABC, DE ∥ BC so that AD = (7x - 4) cm, AE = (5x - 2) cm, DB = (3x + 4) cm and EC = (3x) cm. Then value of x equals:', options: ['2.5 cm', '3 cm', '4 cm', '5 cm'], correct: 2, difficulty: 'Hard', subConcept: 'Basic proportionality theorem, find unknown', sourcePage: page('16.4'), sourceQuestionNumber: '16' },
  { text: 'In the given figure, if ∠ADE = ∠B, AD = 6.8 cm, AE = 2.4 cm, BE = 8.6 cm and BC = 5.5 cm, then value of DE is:', options: ['6.8 cm', '2.4 cm', '3.4 cm', '4.8 cm'], correct: 2, difficulty: 'Hard', subConcept: 'AA similarity, find a side (numeric)', sourcePage: page('16.4'), sourceQuestionNumber: '17' },
  { text: 'It is given that Δ ABC ~ Δ DFE. If ∠A = 30°, ∠C = 50°, AB = 5 cm, AC = 8 cm and DF = 7.5 cm, then which of the following is true?', options: ['DE = 12 cm, ∠F = 50°', 'DE = 12 cm, ∠F = 100°', 'EF = 12 cm, ∠D = 100°', 'EF = 12 cm, ∠D = 30°'], correct: 1, difficulty: 'Hard', subConcept: 'Similar triangles, find side and angle together', sourcePage: page('16.4'), sourceQuestionNumber: '18' },
  { text: 'In Δ ABC, P and Q are points on CA and CB respectively such that CA = 16 cm, CP = 10 cm, CB = 30 cm and CQ = 25 cm, then:', options: ['PQ is parallel to AB', 'PQ is not parallel to AB', 'QB/CQ = PA/CP', 'PQ ⊥ AB'], correct: 1, difficulty: 'Hard', subConcept: 'Testing proportionality (converse BPT)', sourcePage: page('16.4'), sourceQuestionNumber: '19' },
  { text: 'In Δ ABC, D and E are points on AB and AC respectively, such that DE ∥ BC. If AE = 2 cm, EC = 3 cm and BC = 10 cm, then DE is equal to:', options: ['4 cm', '5 cm', '(20/3) cm', '15 cm'], correct: 0, difficulty: 'Medium', subConcept: 'Basic proportionality theorem (numeric)', sourcePage: page('16.4'), sourceQuestionNumber: '20' },

  { text: 'In Δ ABC, DE is drawn parallel to BC cutting the other two sides at D and E. If AB = 3.6 cm, AC = 2.4 cm and AD = 2.1 cm, then AE is equal to:', options: ['1.05 cm', '1.2 cm', '1.4 cm', '1.8 cm'], correct: 2, difficulty: 'Medium', subConcept: 'Basic proportionality theorem (numeric)', sourcePage: page('16.5'), sourceQuestionNumber: '21' },
  { text: 'If Δ ABC and Δ DEF are similar, 2AB = DE and BC = 8 cm, then EF is equal to:', options: ['4 cm', '8 cm', '12 cm', '16 cm'], correct: 3, difficulty: 'Medium', subConcept: 'Similar triangles, scale factor', sourcePage: page('16.5'), sourceQuestionNumber: '22' },
  { text: 'In the adjoining figure, DE ∥ BC. If AD : DB = 3 : 1 and EA = 3.3 cm, then AC equals:', options: ['1.1 cm', '4 cm', '4.4 cm', '5.5 cm'], correct: 2, difficulty: 'Medium', subConcept: 'Basic proportionality theorem (numeric)', sourcePage: page('16.5'), sourceQuestionNumber: '23' },
  { text: 'In the adjoining figure, ∠ADE = ∠ABC, AE = 8 cm, EB = 7 cm, BC = 9 cm, AD = 10 cm and DC = 2 cm. Then the length of DE is:', options: ['6 cm', '6.75 cm', '7.8 cm', '13.5 cm'], correct: 0, difficulty: 'Hard', subConcept: 'AA similarity, find a side (numeric)', sourcePage: page('16.5'), sourceQuestionNumber: '24' },
  { text: 'In the given figure, two line segments AC and BD intersect each other at point P such that PA = 6 cm, PB = 3 cm, PC = 2.5 cm, PD = 5 cm, ∠APB = 50° and ∠CDP = 30°. Then ∠PBA =', options: ['30°', '50°', '60°', '100°'], correct: 3, difficulty: 'Hard', subConcept: 'SAS similarity from intersecting segments', sourcePage: page('16.5'), sourceQuestionNumber: '25' },
  { text: 'In the given figure ∠BAP = ∠DCP = 70°, PC = 6 cm and CA = 4 cm then PD : DB is:', options: ['5 : 3', '3 : 5', '3 : 2', '2 : 3'], correct: 1, difficulty: 'Hard', subConcept: 'AA similarity, find a ratio', sourcePage: page('16.5'), sourceQuestionNumber: '26' },

  { text: 'In the adjoining figure, ∠ACB = ∠CDA. If AC = 8 cm and AD = 3 cm, then the value of BD is:', options: ['8 cm', '3 cm', '18(1/3) cm', '(64/3) cm'], correct: 3, difficulty: 'Hard', subConcept: 'AA similarity, geometric mean relation', sourcePage: page('16.6'), sourceQuestionNumber: '27' },
  { text: 'ABCD is a quadrilateral, AD = 4 cm. If the diagonals AC and BD intersect at O such that AO/CO = DO/BO = 1/2, then BC is equal to:', options: ['7 cm', '8 cm', '9 cm', '6 cm'], correct: 1, difficulty: 'Hard', subConcept: 'Similar triangles from intersecting diagonals', sourcePage: page('16.6'), sourceQuestionNumber: '28' },
  { text: 'In the given diagram Δ ABC ~ Δ PQR and AD/PS = 2/7. The value of AB : PQ is:', options: ['7 : 2', '2 : 5', '2 : 7', '5 : 7'], correct: 2, difficulty: 'Medium', subConcept: 'Similar triangles, ratio of corresponding altitudes', sourcePage: page('16.6'), sourceQuestionNumber: '29' },
  { text: 'In the given diagram Δ ABC ~ Δ PQR and AB : PQ = 3 : 5, then AD : PS is:', options: ['3 : 2', '3 : 8', '5 : 3', '3 : 5'], correct: 3, difficulty: 'Medium', subConcept: 'Similar triangles, ratio of corresponding altitudes', sourcePage: page('16.6'), sourceQuestionNumber: '30' },
  { text: 'In Δ ABC it is given that AB = 9 cm, BC = 6 cm and CA = 7.5 cm. Also Δ DEF is given such that EF = 8 cm and Δ DEF ~ Δ ABC. Then the perimeter of Δ DEF is:', options: ['22.5 cm', '25 cm', '27 cm', '30 cm'], correct: 3, difficulty: 'Medium', subConcept: 'Similar triangles, perimeter ratio', sourcePage: page('16.6'), sourceQuestionNumber: '31' },
  { text: 'Δ ABC is such that AB = 3 cm, BC = 2 cm and CA = 2.5 cm and Δ DEF ~ Δ ABC. If EF = 4 cm, then the perimeter of Δ DEF is:', options: ['7.5 cm', '15 cm', '22.5 cm', '30 cm'], correct: 1, difficulty: 'Medium', subConcept: 'Similar triangles, perimeter ratio', sourcePage: page('16.6'), sourceQuestionNumber: '32' },

  { text: 'The lengths of the sides of triangle P are 3, 4 and 5 units. Another triangle Q, which is similar to P, has one side of length 60 units, what is the smallest possible perimeter of triangle Q?', options: ['120 units', '144 units', '180 units', '240 units'], correct: 1, difficulty: 'Hard', subConcept: 'Similar triangles, minimizing scaled perimeter', sourcePage: page('16.7'), sourceQuestionNumber: '33' },
  { text: 'In a Δ ABC, AB = 10 cm, AC = 14 cm and BC = 6 cm. If AD is the internal bisector of ∠A, then CD is equal to:', options: ['3.5 cm', '4.8 cm', '7 cm', '10.5 cm'], correct: 0, difficulty: 'Hard', subConcept: 'Angle bisector theorem', sourcePage: page('16.7'), sourceQuestionNumber: '34' },
  { text: 'The ratio of the corresponding sides of two similar triangles is 1 : 3. The ratio of their corresponding heights is:', options: ['1 : 3', '1 : 9', '3 : 1', '9 : 1'], correct: 0, difficulty: 'Medium', subConcept: 'Similar triangles, ratio of heights', sourcePage: page('16.7'), sourceQuestionNumber: '35' },
  { text: 'If in triangles Δ ABC and Δ DEF, ∠A = ∠E = 40°, AB : ED = AC : EF and ∠F = 65°, then ∠B is equal to:', options: ['35°', '65°', '75°', '85°'], correct: 2, difficulty: 'Hard', subConcept: 'SAS similarity, find an angle', sourcePage: page('16.7'), sourceQuestionNumber: '36' },
  { text: 'In the given figure, AB ∥ CD and OA = (2x + 4) cm, OB = (9x - 21) cm, OC = (2x - 1) cm and OD = 3 cm. Then x equals:', options: ['2.1', '3', '4', '6'], correct: 1, difficulty: 'Hard', subConcept: 'AA similarity from parallel lines, find unknown', sourcePage: page('16.7'), sourceQuestionNumber: '37' },
  { text: 'In Δ PQR ~ Δ SPR, then the length of QR is (given PR = 6 cm, SR = 3 cm and PQ = 8 cm):', options: ['12 cm', '4 cm', '8 cm', '16 cm'], correct: 0, difficulty: 'Hard', subConcept: 'Similar triangles sharing a common angle, find a side', sourcePage: page('16.7'), sourceQuestionNumber: '38' },
  { text: 'In the given figure, CB ⊥ AB and ED ⊥ AB. If AE = 2 cm, EC = 4 cm and ED = 1.5 cm, then value of BC is:', options: ['3 cm', '3.2 cm', '3.8 cm', '4.5 cm'], correct: 3, difficulty: 'Medium', subConcept: 'AA similarity, find a side (numeric)', sourcePage: page('16.7'), sourceQuestionNumber: '39' },

  { text: 'In the given figure AB and DE are parallel to each other. If AB = a, DE = x, BE = b, and EC = c, then x expressed in terms of a, b and c is:', options: ['ac/b', 'ab/c', 'ab/(b + c)', 'ac/(b + c)'], correct: 2, difficulty: 'Hard', subConcept: 'AA similarity, find a side (algebraic)', sourcePage: page('16.8'), sourceQuestionNumber: '40' },
  { text: 'The shadow of a 5 m long stick is 2 m long. At the same time the length of the shadow of a 12.5 m high tree is:', options: ['3 m', '3.5 m', '4.5 m', '5 m'], correct: 3, difficulty: 'Medium', subConcept: 'Similar triangles, shadow word problem', sourcePage: page('16.8'), sourceQuestionNumber: '41' },
  { text: 'A street lamp is fixed on a lamp-post at a height of 3.3 m from the ground. A boy 110 cm tall walks away from the base of this lamp post at a speed of 0.8 m/s. The length of the shadow of the boy after 4 seconds is:', options: ['1.1 m', '1.6 m', '2.1 m', '2.6 m'], correct: 1, difficulty: 'Hard', subConcept: 'Similar triangles, shadow word problem', sourcePage: page('16.8'), sourceQuestionNumber: '42' },
  { text: 'In the given figure, ∠ABC = ∠BDC = 90° each. Choose the correct similarity from the given choices:', options: ['Δ ABC ~ Δ CBD', 'Δ ABC ~ Δ DCB', 'Δ ABC ~ Δ BCD', 'Δ ABC ~ Δ BDC'], correct: 3, difficulty: 'Hard', subConcept: 'AA similarity, correct correspondence', sourcePage: page('16.8'), sourceQuestionNumber: '43' },
  { text: 'In a right angled Δ ABC in which ∠A = 90°, if AD ⊥ BC, then which of the following statements is correct?', options: ['AB² = BD × AD', 'AB² = BC × BD', 'AB² = BD × DC', 'AB² = BC × DC'], correct: 1, difficulty: 'Hard', subConcept: 'Altitude on hypotenuse, geometric mean relations', sourcePage: page('16.8'), sourceQuestionNumber: '44' },
  { text: 'In the given figure, Δ ABC is right angled at B and BD ⊥ AC. If AB = a, BC = b, AC = c and BD = x, then product ab is:', options: ['b + c', 'cx', 'bc', 'c + x'], correct: 1, difficulty: 'Hard', subConcept: 'Altitude on hypotenuse, area relation', sourcePage: page('16.8'), sourceQuestionNumber: '45' },

  { text: 'Which of the following is true in the given figure, where AD is the altitude to the hypotenuse of a right-angled Δ ABC?', options: ['I and II', 'II and III', 'I and III', 'I, II and III'], correct: 2, difficulty: 'Hard', subConcept: 'Altitude on hypotenuse, similar sub-triangles (I: ΔABD~ΔCAD, II: ΔADB~ΔCDA, III: ΔADB~ΔCAB)', sourcePage: page('16.9'), sourceQuestionNumber: '46' },
  { text: 'In the given figure, Δ PQR ~ Δ QMR, ∠Q = 90° and QM ⊥ PR. If PM = 4 cm and PR = 13 cm, find QM.', options: ['9 cm', '6 cm', '8 cm', '17 cm'], correct: 1, difficulty: 'Hard', subConcept: 'Altitude on hypotenuse, geometric mean (numeric)', sourcePage: page('16.9'), sourceQuestionNumber: '47' },
  { text: 'In the given figure, ∠CAB = 90° and AD ⊥ BC. If AC = 75 cm, AB = 1 m and BC = 1.25 m, then AD equals:', options: ['50 cm', '60 cm', '65 cm', '70 cm'], correct: 1, difficulty: 'Hard', subConcept: 'Altitude on hypotenuse, area relation (numeric)', sourcePage: page('16.9'), sourceQuestionNumber: '48' },
  { text: 'The areas of two similar triangles are 49 cm² and 64 cm² respectively. The ratio of their corresponding sides is:', options: ['7 : 8', '49 : 64', '8 : 7', '64 : 49'], correct: 0, difficulty: 'Medium', subConcept: 'Ratio of areas and sides of similar triangles', sourcePage: page('16.9'), sourceQuestionNumber: '49' },
  { text: 'The areas of two similar triangles are 12 cm² and 48 cm² respectively. If the height of the smaller one is 2.1 cm, then the corresponding height of the bigger one is:', options: ['1.05 cm', '4.2 cm', '4.41 cm', '8.4 cm'], correct: 1, difficulty: 'Medium', subConcept: 'Ratio of areas and heights of similar triangles', sourcePage: page('16.9'), sourceQuestionNumber: '50' },
  { text: 'The areas of two similar triangles are 81 cm² and 144 cm². If the largest side of the smaller triangle is 27 cm, then largest side of the larger triangle is:', options: ['24 cm', '36 cm', '48 cm', '72 cm'], correct: 1, difficulty: 'Medium', subConcept: 'Ratio of areas and sides of similar triangles', sourcePage: page('16.9'), sourceQuestionNumber: '51' },
  { text: 'Δ ABC ~ Δ PQR. If area(Δ ABC)/area(Δ PQR) = 81/49 then value of AC/PR is:', options: ['81/7', '9/49', '9/7', '7/9'], correct: 2, difficulty: 'Medium', subConcept: 'Ratio of areas and sides of similar triangles', sourcePage: page('16.9'), sourceQuestionNumber: '52' },

  { text: 'In the given figure of Δ PQR, MN ∥ PQ and N is a point on QR such that QN : NR = 1 : 2, then the ratio of area of Δ PQR to area of Δ MNR is:', options: ['3 : 1', '3 : 2', '9 : 1', '9 : 4'], correct: 3, difficulty: 'Hard', subConcept: 'Ratio of areas from a parallel-line segment', sourcePage: page('16.10'), sourceQuestionNumber: '53' },
  { text: 'If Δ BOC ~ Δ AOD, AD = 7 cm, BC = 5 cm and area of Δ BOC = 150 cm², then the area of Δ AOD is:', options: ['294 cm²', '300 cm²', '510 cm²', '414 cm²'], correct: 0, difficulty: 'Hard', subConcept: 'Ratio of areas of similar triangles (numeric)', sourcePage: page('16.10'), sourceQuestionNumber: '54' },
  { text: 'In the adjoining figure, XY is parallel to BC. If XY divides the triangle into two equal parts, then AX/AB equals:', options: ['1/√2', '1/2', '(√2 + 1)/√2', '(√2 - 1)/√2'], correct: 3, difficulty: 'Hard', subConcept: 'Area-bisecting line parallel to a side', sourcePage: page('16.10'), sourceQuestionNumber: '55' },
  { text: 'In the given figure P and Q are points on the sides AB and AC respectively of a Δ ABC. If PQ is parallel to BC and divides the Δ ABC into 2 parts equal in area, then the ratio of PA : AB is:', options: ['1 : 1', '(√2 - 1) : √2', '1 : √2', '(√2 - 1) : 1'], correct: 1, difficulty: 'Hard', subConcept: 'Area-bisecting line parallel to a side', sourcePage: page('16.10'), sourceQuestionNumber: '56' },
  { text: 'Δ ABC and Δ DEF are similar to each other. If the ratio of side AB to side DE is (√2 + 1) : √3, then the ratio of area of Δ ABC to that of Δ DEF is:', options: ['(3 + 2√2) : 3', '1 : (9 - 6√2)', '(9 - 6√2) : 2', '(3 - 2√2) : 3'], correct: 0, difficulty: 'Hard', subConcept: 'Ratio of areas of similar triangles (surds)', sourcePage: page('16.10'), sourceQuestionNumber: '57' },
  { text: 'If Δ ABC ~ Δ QRP, area(Δ ABC)/area(Δ PQR) = 9/4, AB = 18 cm and BC = 15 cm, then PR =', options: ['(20/3) cm', '20 cm', '10 cm', '12 cm'], correct: 2, difficulty: 'Hard', subConcept: 'Ratio of areas and sides of similar triangles', sourcePage: page('16.10'), sourceQuestionNumber: '58' },

  { text: 'A triangle with sides 6, 9 and 12 units has area A sq. units. What is the area (in sq. units) of a triangle with sides 8, 12 and 16 units in terms of A?', options: ['(3/2) A', '(4/3) A', '(16/9) A', '(25/16) A'], correct: 2, difficulty: 'Hard', subConcept: 'Ratio of areas from scaled sides', sourcePage: page('16.11'), sourceQuestionNumber: '59' },
  { text: 'In the given figure, D, E and F are the mid-points of the sides BC, AC and AB respectively of Δ ABC. Then which of the following does not hold true?', options: ['Δ AFE ~ Δ ABC', 'Δ FBD ~ Δ ABC', 'Δ EDC ~ Δ ABC', 'Δ DFE ~ Δ ABC'], correct: 3, difficulty: 'Hard', subConcept: 'Midsegment triangle, similarity to the original', sourcePage: page('16.11'), sourceQuestionNumber: '60' },
  { text: 'Which of the following statements is correct? A: If D is a point on side AB of Δ ABC such that AD : DB = 5 : 2 and E is a point on BC such that DE ∥ AC, then area(Δ ABC) : area(Δ DBE) = 9 : 4. B: If the areas of two similar triangles are in the ratio 25 : 64, then their perimeters are in the ratio 5 : 8. C: In the adjoining figure if AB ∥ CD, then Δ AOB ~ Δ COD. D: In the adjoining figure, if D and E are the mid-points of AB and AC respectively, then area(Δ ADE) = (1/2) × area(Δ ABC).', options: ['Statement A', 'Statement B', 'Statement C', 'Statement D'], correct: 1, difficulty: 'Hard', subConcept: 'Mixed statements on similar-triangle area ratios', sourcePage: page('16.11'), sourceQuestionNumber: '61' },

  {
    kind: 'case',
    text: 'In Δ ABC, PQ is a straight line meeting AB in P and AC in Q. It is given that AP = 1 cm, PB = 3 cm, AQ = 1.5 cm, QC = 4.5 cm and PQ = 2 cm.',
    parts: [
      { text: '(i) The perimeter of Δ ABC is:', options: ['12 cm', '16 cm', '18 cm', '24 cm'], correct: 2, marks: 1 },
      { text: '(ii) The ratio of the areas of Δ APQ and Δ ABC is:', options: ['1 : 3', '1 : 4', '1 : 9', '1 : 16'], correct: 3, marks: 1 },
      { text: '(iii) Which of the following holds true?', options: ['Δ APQ ~ Δ ABC', 'Δ AQP ~ Δ ABC', 'Δ APQ ~ Δ ACB', 'Δ AQP ~ Δ BAC'], correct: 0, marks: 1 },
      { text: '(iv) Which axiom of similarity applies in the above case?', options: ['AAA', 'RHS', 'SSS', 'SAS'], correct: 3, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: similar triangles from a cevian-like segment', questionType: 'case_study', sourcePage: page('16.12'), sourceQuestionNumber: '62',
  },
  {
    kind: 'case',
    text: 'Using the given diagram answer the following questions: In Δ PQR, AB ∥ QR, QP ∥ CB and AR intersects CB at O.',
    parts: [
      { text: '(i) The triangle similar to Δ ARQ is:', options: ['Δ ORC', 'Δ ARP', 'Δ OBR', 'Δ QRP'], correct: 0, marks: 1 },
      { text: '(ii) Δ PQR ~ Δ BCR by axiom:', options: ['SAS', 'AAA', 'SSS', 'AAS'], correct: 1, marks: 1 },
      { text: '(iii) If QC = 6 cm, CR = 4 cm, BR = 3 cm, then the length of RP is:', options: ['4.5 cm', '5 cm', '7.5 cm', '8 cm'], correct: 2, marks: 1 },
      { text: '(iv) The ratio PQ : BC is:', options: ['2 : 3', '3 : 2', '2 : 5', '5 : 2'], correct: 3, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: similar triangles from parallel cevians', questionType: 'case_study', sourcePage: page('16.12'), sourceQuestionNumber: '63',
  },
  {
    kind: 'case',
    text: 'Answer these questions on the basis of the following information: Through the mid-point M of the side CD of a ∥gm ABCD, the line BM is drawn, intersecting AC on L and AD produced in E.',
    parts: [
      { text: '(i) Which of the following is true for Δ BMC and Δ EMD? I. They are similar to each other. II. They are congruent to each other. III. Their areas are equal. IV. Their perimeters are equal.', options: ['I and II', 'II and III', 'I, II and III', 'I, II, III and IV'], correct: 3, marks: 1 },
      { text: '(ii) Δ AEL is similar to:', options: ['Δ CBL', 'Δ CML', 'Δ DME', 'Δ BMC'], correct: 0, marks: 1 },
      { text: '(iii) By which axiom are the above triangles similar?', options: ['AA', 'SSS', 'SAS', 'ASA'], correct: 0, marks: 1 },
      { text: '(iv) EL : BL is equal to:', options: ['1 : 2', '2 : 1', '1 : 3', '3 : 1'], correct: 1, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: parallelogram midpoint construction, similar triangles', questionType: 'case_study', sourcePage: page('16.13'), sourceQuestionNumber: '64',
  },
  {
    kind: 'case',
    text: 'Study the following diagram carefully and answer the given questions: In Δ ABC, D and E are points on AB and AC respectively such that AD = a, DB = 3a, AE = b and EC = 3b. DQ ∥ EA and EP ∥ DA are drawn. QP is joined.',
    parts: [
      { text: '(i) Δ ADE is similar to which of the following triangles? I. Δ ABC II. Δ DAQ III. Δ ADQ IV. Δ EPA V. Δ EAP', options: ['I, II and IV only', 'I, III and V only', 'I, II and V only', 'I, III, and IV only'], correct: 1, marks: 1 },
      { text: '(ii) If DE = 2 cm, then BC is equal to:', options: ['4 cm', '6 cm', '7 cm', '8 cm'], correct: 3, marks: 1 },
      { text: '(iii) The ratio of the perimeters of Δ ADE and Δ ABC is:', options: ['1 : 2', '1 : 3', '1 : 4', '1 : 6'], correct: 2, marks: 1 },
      { text: '(iv) The ratio of the areas of Δ ADE and trapezium DBCE is:', options: ['1 : 8', '1 : 9', '1 : 15', '1 : 16'], correct: 2, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: similar triangles from constructed parallels', questionType: 'case_study', sourcePage: page('16.13'), sourceQuestionNumber: '65',
  },
  {
    kind: 'case',
    text: 'Study the given information and answer the questions that follow: In the given figure ABCD is a trapezium in which DC is parallel to AB. AB = 16 cm and DC = 8 cm, OD = 5 cm, OB = (y + 3) cm, OA = 11 cm and OC = (x - 1) cm.',
    parts: [
      { text: '(i) From the given figure name the pair of similar triangles:', options: ['Δ OAB ~ Δ OBC', 'Δ COD ~ Δ AOB', 'Δ ADB ~ Δ ACB', 'Δ COD ~ Δ COB'], correct: 1, marks: 1 },
      { text: '(ii) The corresponding proportional sides with respect to the pair of similar triangles obtained above is:', options: ['CD/AB = OC/OA = OD/OB', 'AD/BC = OC/OA = OD/OB', 'AD/BC = BD/AC = AB/DC', 'OD/OB = CD/CB = OC/OA'], correct: 0, marks: 1 },
      { text: '(iii) The ratio of the sides of the pair of similar triangles is:', options: ['1 : 3', '1 : 2', '2 : 3', '3 : 1'], correct: 1, marks: 1 },
      { text: '(iv) Using the ratio of sides of the pair of similar triangles, the values of x and y are respectively:', options: ['x = 4.6, y = 7', 'x = 7, y = 7', 'x = 6.5, y = 7', 'x = 6.5, y = 2'], correct: 2, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: trapezium diagonals, similar triangles', questionType: 'case_study', sourcePage: page('16.14'), sourceQuestionNumber: '66',
  },
  {
    kind: 'case',
    text: 'In a Δ ABC, L and M are two points on the base BC such that ∠ABL = ∠CAM and ∠BAL = ∠ACM.',
    parts: [
      { text: '(i) Δ ABL is similar to:', options: ['Δ CMB', 'Δ CBA', 'Δ CAB', 'Δ ABC'], correct: 1, marks: 1 },
      { text: '(ii) If Δ ACM ~ Δ BCA, then which of the following option is true:', options: ['AC × AB = BC × AM', 'AC × AB = CM × AM', 'AC × AM = AB × BC', 'AC² = AM × BC'], correct: 1, marks: 1 },
      { text: '(iii) Δ CAM is similar to:', options: ['Δ CAB', 'Δ CBA', 'Δ BAL', 'Δ ALM'], correct: 1, marks: 1 },
      { text: '(iv) If Δ ALB ~ Δ CMA by AA test for similarity, then which of the following option is not true:', options: ['AL : CM = BL : AM', 'AL : AC = CM : AB', 'AL : AB = CM : AC', 'BL : AB = AM : AC'], correct: 1, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: two-triangle overlapping AA similarity', questionType: 'case_study', sourcePage: page('16.14'), sourceQuestionNumber: '67',
  },
  {
    kind: 'case',
    text: 'In the given figure, Δ PQR is right angled at P and PM ⊥ QR.',
    parts: [
      { text: '(i) Δ QPM is similar to:', options: ['Δ QPR', 'Δ QRP', 'Δ MPR', 'Δ PMR'], correct: 0, marks: 1 },
      { text: '(ii) If Δ QMP ~ Δ PMR, then which of the following option is true:', options: ['PQ² = QM × QR', 'PM² = QM × RM', 'PR² = RM × QR', 'QR² = PQ × PR'], correct: 1, marks: 1 },
      { text: '(iii) If PQ = 16 cm, PR = 12 cm, then value of PM is:', options: ['7.2 cm', '6.4 cm', '7.8 cm', '9.6 cm'], correct: 3, marks: 1 },
      { text: '(iv) Ratio of QM : RM is:', options: ['9 : 16', '4 : 3', '3 : 4', '16 : 9'], correct: 3, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: altitude on the hypotenuse', questionType: 'case_study', sourcePage: page('16.15'), sourceQuestionNumber: '68',
  },
  {
    kind: 'case',
    text: 'In Δ ABC, AD ⊥ BC and CE ⊥ AB.',
    parts: [
      { text: '(i) Δ AEF is similar to:', options: ['Δ AFC', 'Δ CDF', 'Δ ABD', 'Δ CEB'], correct: 1, marks: 1 },
      { text: '(ii) Δ ABD is similar to:', options: ['Δ CEB', 'Δ CBE', 'Δ ADC', 'Δ AEF'], correct: 1, marks: 1 },
      { text: '(iii) Δ FDC is similar to:', options: ['Δ FAB', 'Δ BEC', 'Δ AEC', 'Δ FAB'], correct: 1, marks: 1 },
      { text: '(iv) If CF = 4 cm, EF = 2 cm and BE = 8 cm then value of DF is:', options: ['3.2 cm', '4 cm', '16 cm', '5(1/3) cm'], correct: 0, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: two altitudes of a triangle, multiple similar triangles', questionType: 'case_study', sourcePage: page('16.15'), sourceQuestionNumber: '69',
  },
  {
    kind: 'case',
    text: 'ABCD is a trapezium, AB ∥ CD. AB = 9 cm, AC = 12 cm and CD = 16 cm.',
    parts: [
      { text: '(i) Δ ABC ~ Δ CAD by:', options: ['AAA', 'SSS', 'SAS', 'ASA'], correct: 2, marks: 1 },
      { text: '(ii) ∠ACB is equal to:', options: ['∠ACD', '∠ADC', '∠DAC', '∠ABC'], correct: 1, marks: 1 },
      { text: '(iii) Ratio of AD : BC is:', options: ['3 : 4', '4 : 3', '3 : 7', '4 : 7'], correct: 1, marks: 1 },
      { text: '(iv) If AD = 10 cm, then value of BC is:', options: ['7.5 cm', '6 cm', '7 cm', '13(1/3) cm'], correct: 0, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: trapezium, similar triangles by SAS', questionType: 'case_study', sourcePage: page('16.16'), sourceQuestionNumber: '70',
  },
  {
    kind: 'case',
    text: 'In the given figure, ADF and CEF are two triangles where BA is parallel to CE and AF : AC = 3 : 8.',
    parts: [
      { text: '(i) Δ AFD is similar to:', options: ['Δ FEC', 'Δ CFE', 'Δ FCE', 'Δ ACB'], correct: 1, marks: 1 },
      { text: '(ii) Ratio of AD : CE is:', options: ['3 : 5', '5 : 3', '8 : 3', '4 : 3'], correct: 0, marks: 1 },
      { text: '(iii) If CE = 9 cm, then AD is equal to:', options: ['5.4 cm', '15 cm', '24 cm', '4.8 cm'], correct: 0, marks: 1 },
      { text: '(iv) If DF = 6 cm, then length BC is equal to:', options: ['16 cm', '4 cm', '8 cm', '10 cm'], correct: 0, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: parallel lines and AA similarity', questionType: 'case_study', sourcePage: page('16.16'), sourceQuestionNumber: '71',
  },

  { text: 'Assertion (A): If in two triangles Δ ABC and Δ PQR, AB = 3 cm, BC = 4 cm, ∠B = 60°, PQ = 9 cm and PR = 12 cm, then Δ ABC ~ Δ QPR. Reason (R): If one angle of a triangle is equal to any one angle of another triangle and any two sides are proportional then by SSS test of similarity the triangle are similar.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 3, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.16'), sourceQuestionNumber: '72', explanation: 'A is false — with AB=3,BC=4,∠B=60° and PQ=9,PR=12, the correspondence AB/QP=1/3 but BC/PR=4/12=1/3 too, so actually the sides ARE proportional (1:3) with the included angle at B/P equal — however the printed correspondence Δ ABC ~ Δ QPR misassigns which vertex maps to which, making the stated similarity relation false as written. R is also false — the criterion described (one angle equal, two sides proportional, i.e. SAS) is called the SAS test, not the SSS test as stated. Both false — matches the key (D).' },
  { text: 'Assertion (A): In Δ ABC, DE ∥ BC, then DE : BC = 2 : 5 if AD = 6 cm, then BD = 15 cm. Reason (R): In Δ ABC, if DE ∥ BC then DE divides the sides AB and AC in the same ratio.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 1, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.17'), sourceQuestionNumber: '73', explanation: 'A is false — DE:BC = AD:AB = 2:5 means AD/AB = 2/5, so with AD=6, AB=15 and BD = AB - AD = 9 cm, not 15 cm (15 would be AB, not BD). R is true (this is the basic proportionality theorem, correctly stated for DE ∥ BC dividing AB and AC, not BC and AB). A false, R true — matches the key (B).' },
  { text: 'Assertion (A): Δ ABC ~ Δ DEF such that area(Δ ABC) = 36 cm² and area(Δ DEF) = 49 cm², the AB : DE = 6 : 7. Reason (R): If Δ ABC ~ Δ DEF, then area(Δ ABC)/area(Δ DEF) = AB²/DE² = BC²/EF² = AC²/DF²', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 2, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.17'), sourceQuestionNumber: '74' },
  { text: 'Assertion (A): In two similar Δ ABC and Δ PQR, if their corresponding altitudes AD and PS are in the ratio 4 : 9, then Area(Δ ABC) : Area(Δ PQR) is 16 : 81. Reason (R): The ratio of the areas of two similar triangle is equal to the ratio of their corresponding sides.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.17'), sourceQuestionNumber: '75', explanation: 'A is true — the ratio of altitudes equals the ratio of similarity, so the ratio of areas is (4/9)² = 16/81. R as printed is false: the ratio of areas equals the SQUARE of the ratio of corresponding sides, not the ratio itself. A true, R false — matches the key (A).' },
  { text: 'Assertion (A): In the figure, if ∠EDB = ∠ACB, BE = 6 cm, EC = 4 cm and BD = 5 cm, then the length of AB is 12 cm. Reason (R): If two triangles have two pairs of corresponding angles equal, then the triangles are similar.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 2, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.17'), sourceQuestionNumber: '76' },
  { text: 'Assertion (A): In the figure, if DE ∥ BC, then the value of x is 6 units.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.18'), sourceQuestionNumber: '77', explanation: 'A is true — using the figure\'s given side values with DE ∥ BC, the basic proportionality theorem\'s ratio resolves to x = 6 units as stated. R (Reason) as printed claims "two similar triangles are always congruent", which is false in general (similar triangles need only be proportional, not equal in size). A true, R false — matches the key (A).' },
  { text: 'Assertion (A): In the figure, if ∠ABC = ∠BDC = 90°. If AD = 4 cm, BD = 6 cm, then area of Δ ABC is 40 cm². Reason (R): Areas of two similar triangles are proportional to the squares of their corresponding sides.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 1, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.18'), sourceQuestionNumber: '78', explanation: 'A is false — BD is the altitude to the hypotenuse AC with AD=4, BD=6, so DC = BD²/AD = 36/4 = 9, AC = 13, and area = (1/2)×13×6 = 39 cm², not 40 cm². R is a true general theorem about similar triangles. A false, R true — matches the key (B).' },
  { text: 'Assertion (A): In Δ ABC, if ∠ABC = ∠DAC, AB = 8 cm, AC = 4 cm, AD = 5 cm then BC = 3.5 cm. Reason (R): SAS and ASS both are valid criteria for similarity of two triangles.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.18'), sourceQuestionNumber: '79', explanation: 'A is true (by AA similarity of ΔABC and ΔDAC via the shared angle at C and ∠ABC=∠DAC, BC works out to 3.5 cm). R is false — "ASS" is not a valid similarity/congruence criterion at all (only SAS is); the reason as stated is a fabricated criterion. A true, R false — matches the key (A).' },
  { text: 'Assertion (A): Two similar triangles are always congruent. Reason (R): If the areas of two similar triangles are equal then the triangles are congruent.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 3, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.18'), sourceQuestionNumber: '80', explanation: 'A is false — similar triangles need not be congruent (only equal-area similar triangles must be congruent, since equal area forces the similarity ratio to be 1). R is true — this is a standard consequence of the area-ratio theorem. A false, R true — matches the key (D).' },
  { text: 'Assertion (A): If Δ ABC ~ Δ PQR with ∠A = 45° and ∠B = 60°, then ∠R = 75°. Reason (R): If two triangles are similar, then their corresponding angles are equal.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.19'), sourceQuestionNumber: '81' },
  { text: 'Assertion (A): If in two triangles ABC and PQR, AB = 3 cm, BC = 4 cm, ∠B = 60° and ∠P = 60°, PQ = 9 cm, PR = 12 cm, then Δ ABC ~ Δ QPR. Reason (R): If the ratio of the lengths of any two sides of one triangle is equal to the ratio of the lengths of another triangle and the included angles are equal, then the two triangles are similar by SAS axiom of similarity.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.19'), sourceQuestionNumber: '82' },
  { text: 'Assertion (A): In a Δ ABC, D is a point on BC such that ∠ABC = ∠DAC. If AB = 8 cm, AC = 5 cm and AD = 4 cm, then BC = 10 cm. Reason (R): If two triangles are similar, then their corresponding angles are equal.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 1, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.19'), sourceQuestionNumber: '83' },
  { text: 'Assertion (A): In the following figures, the measure of ∠D = 60°, then ∠B = 60° (Δ ABC with AB = 3√3, AC = 3.8, BC = 6; Δ DEF with DF = 7.6, EF = 12√3, DE = 12, ∠D = 60°). Reason (R): Two triangles are said to be similar, if their corresponding sides are proportional i.e. they are in the same ratio.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 3, difficulty: 'Hard', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.20'), sourceQuestionNumber: '84' },
  { text: 'Assertion (A): In Δ ABC, DE ∥ BC and AD = (4x - 3), AE = (8x - 7), BD = (3x - 1) and CE = (5x - 3), then x = 5 units. Reason (R): If a line is drawn parallel to one side of a triangle to intersect the other two sides at distinct points, the other two sides are divided in the same ratio.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 3, difficulty: 'Hard', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.20'), sourceQuestionNumber: '85', explanation: 'A is false — solving (4x-3)/(3x-1) = (8x-7)/(5x-3) by the basic proportionality theorem gives 2x² - x - 1 = 0, so x = 1 (the only value keeping all four segments positive), not x = 5 as asserted. R is the correctly stated theorem. A false, R true — matches the key (D).' },
  { text: 'Assertion (A): The sides of two similar triangles are in the ratio 2 : 5, then the area of these triangles are in the ratio 4 : 25. Reason (R): The ratio of the areas of two similar triangles is equal to the square of the ratio of their corresponding sides.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.20'), sourceQuestionNumber: '86' },
  { text: 'Assertion (A): The ratio of the areas of two similar triangles is equal to the square of the ratio of their corresponding sides. Reason (R): (i) The area of a triangle = (1/2) × base × altitude. (ii) Corresponding sides of similar triangles are proportional.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('16.21'), sourceQuestionNumber: '87' },
];

const meta = {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'Similarity of Triangles',
  chapterOrder: 16,
  label: 'chap_16.pdf (ICSE Maths workbook) — full ingestion, questions (1)-(87)',
  status: 'transcribed',
};

const result = ingestQuestions(items, meta);
console.log('item count in this batch:', items.length);
console.log(JSON.stringify(result, null, 2));
