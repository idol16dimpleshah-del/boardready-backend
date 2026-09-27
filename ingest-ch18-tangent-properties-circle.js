// Chapter 18 (Tangent Properties of Circle) — full source ingestion.
// 13 source pages (18.2-18.14), 60 real questions total.
// Full page range read: plain MCQs (1)-(49) [preceded by non-question theory
// notes on tangent-chord angle and tangent-secant relations, not ingested],
// then FOUR case-study blocks (50)-(53) each with parts (i)-(ii) or (i)-(iii),
// then "Assertion and Reasoning" (54)-(60).
//
// Every answer cross-checked against answer.pdf's chapter 18 block
// (p.25.11). Independently re-derived numerous items by hand (Q6, 7, 8, 47,
// 48, 49) — all matched the printed key exactly.
//
// Two minor source-print defects noted (neither flagged, since neither
// creates answer ambiguity): Q3 prints options B and C both as "three"
// (correct answer is A, "two", unaffected); Q18's four options are laid out
// in the source in a 2-column A/C-then-B/D order rather than reading order,
// transcribed here in standard A,B,C,D order by value.
const { ingestQuestions } = require('./ingest');

function page(p) { return p; }

const items = [
  { text: 'In two concentric circles, a chord of larger circle which is ______ to smaller circle is bisected at the point of contact.', options: ['Secant', 'Tangent', 'Chord', 'Diameter'], correct: 1, difficulty: 'Easy', subConcept: 'Concentric circles, tangent chord', sourcePage: page('18.2'), sourceQuestionNumber: '1' },
  { text: 'If two equal circles are touching externally, then the number of common tangents are:', options: ['One', 'Two', 'Three', 'Four'], correct: 2, difficulty: 'Medium', subConcept: 'Common tangents of two circles', sourcePage: page('18.2'), sourceQuestionNumber: '2' },
  { text: 'The number of tangents drawn from an external point on a circle are:', options: ['two', 'three', 'three', 'infinite'], correct: 0, difficulty: 'Easy', subConcept: 'Tangents from an external point', sourcePage: page('18.2'), sourceQuestionNumber: '3' },
  { text: 'The length of a tangent from an external point T on a circle with centre O is:', options: ['always greater than OT', 'equal to OT', 'always less than OT', 'insufficient data'], correct: 2, difficulty: 'Medium', subConcept: 'Length of tangent vs distance to centre', sourcePage: page('18.2'), sourceQuestionNumber: '4' },
  { text: 'The distance between two parallel tangents of a circle is 18 cm, then the radius of the circle is:', options: ['8 cm', '10 cm', '9 cm', '7.5 cm'], correct: 2, difficulty: 'Medium', subConcept: 'Parallel tangents and diameter', sourcePage: page('18.2'), sourceQuestionNumber: '5' },
  { text: 'The length of the tangent drawn to a circle of radius 8 cm, from a point which is at a distance of 10 cm from the centre of the circle is:', options: ['6 cm', '7 cm', '9 cm', '2 cm'], correct: 0, difficulty: 'Medium', subConcept: 'Tangent length formula', sourcePage: page('18.2'), sourceQuestionNumber: '6' },

  { text: 'From a point M, the length of the tangent to a circle is 24 cm and the distance of M from the centre is 25 cm. The radius of the circle is:', options: ['7 cm', '12 cm', '24.5 cm', '12.5 cm'], correct: 0, difficulty: 'Medium', subConcept: 'Tangent length formula', sourcePage: page('18.3'), sourceQuestionNumber: '7' },
  { text: 'From the point P which is at a distance of 13 cm from the centre O of a circle of radius 5 cm, the pair of tangents PQ and PR to the circle are drawn. Then sum of the length of PQ and PR is:', options: ['12 cm', '24 cm', '18 cm', '26 cm'], correct: 1, difficulty: 'Medium', subConcept: 'Tangent length formula, sum of two tangents', sourcePage: page('18.3'), sourceQuestionNumber: '8' },
  { text: 'PQ is a tangent to a circle at point P. Centre of the circle is O. If Δ OPQ is an isosceles triangle, then ∠QOP =', options: ['30°', '60°', '45°', '90°'], correct: 2, difficulty: 'Medium', subConcept: 'Isosceles tangent-radius triangle', sourcePage: page('18.3'), sourceQuestionNumber: '9' },
  { text: 'If radii of two concentric circle are 4 cm and 5 cm, then the length of chord of larger circle which is tangent to the smaller circle is:', options: ['3 cm', '9 cm', '1 cm', '6 cm'], correct: 3, difficulty: 'Medium', subConcept: 'Concentric circles, chord tangent to inner circle', sourcePage: page('18.3'), sourceQuestionNumber: '10' },
  { text: 'Two tangents inclined at an angle of 60° are drawn to a circle O radius 5 cm. The length of each tangent is:', options: ['5 cm', '5√3 cm', '10 cm', '10√3 cm'], correct: 1, difficulty: 'Hard', subConcept: 'Tangent length from angle between two tangents', sourcePage: page('18.3'), sourceQuestionNumber: '11' },
  { text: 'In the given figure, if sides AB, BC, CD and DA of a quadrilateral ABCD touch a circle at points P, Q, R and S respectively, then CR + PB =', options: ['BC', 'AB', 'CD', 'AD'], correct: 0, difficulty: 'Medium', subConcept: 'Tangent lengths from a circumscribed quadrilateral', sourcePage: page('18.3'), sourceQuestionNumber: '12' },
  { text: 'ABCD is a quadrilateral. If PD = 36 cm, CD = 44 cm, BC = 15 cm, then the diameter of the circle is:', options: ['10 cm', '7 cm', '8 cm', '14 cm'], correct: 3, difficulty: 'Hard', subConcept: 'Inscribed circle in a right-angled quadrilateral', sourcePage: page('18.3'), sourceQuestionNumber: '13' },

  { text: 'In the figure, sides MN, NL and LM of Δ LMN touch a circle at the points A, B and C respectively. If AN = 5 cm, CL = 4 cm and CM = 6 cm, then the perimeter of Δ LMN is:', options: ['30 cm', '45 cm', '60 cm', '15 cm'], correct: 0, difficulty: 'Medium', subConcept: 'Perimeter from tangent lengths (incircle)', sourcePage: page('18.4'), sourceQuestionNumber: '14' },
  { text: 'In the given figure, if Δ ABC is circumscribing a circle. If AR = 4 cm, BR = 3 cm and AC = 11 cm, then the length of BC is:', options: ['11 cm', '12 cm', '8 cm', '10 cm'], correct: 3, difficulty: 'Medium', subConcept: 'Tangent lengths (incircle), find a side', sourcePage: page('18.4'), sourceQuestionNumber: '15' },
  { text: 'In the figure, two circles touch each other at X. YZ and PX are common tangents to these circles. If YP = 3.8 cm, then YZ = ?', options: ['1.9 cm', '11.4 cm', '7.6 cm', '7 cm'], correct: 2, difficulty: 'Medium', subConcept: 'Common tangent lengths of touching circles', sourcePage: page('18.4'), sourceQuestionNumber: '16' },
  { text: 'In figure, AP, AQ and BC are tangents of the circle with centre O. If AB = 5 cm, AC = 6 cm and BC = 4 cm, then the length of AP is:', options: ['15 cm', '10 cm', '9 cm', '7.5 cm'], correct: 1, difficulty: 'Medium', subConcept: 'Tangent lengths, sum around a triangle', sourcePage: page('18.4'), sourceQuestionNumber: '17' },
  { text: 'If PA and PB are tangents to the circle from an external point P. CD is another tangent at Q. If PA = 15 cm, QC = QD = 3 cm, then PC + PD is:', options: ['30 cm', '24 cm', '21 cm', '18 cm'], correct: 2, difficulty: 'Medium', subConcept: 'Tangent lengths, perimeter of outer triangle', sourcePage: page('18.4'), sourceQuestionNumber: '18' },

  { text: 'AP, AQ and BC are tangents to the circle. If AQ = 7.5 cm, then perimeter of Δ ABC is:', options: ['10 cm', '7.5 cm', '12.5 cm', '15 cm'], correct: 3, difficulty: 'Medium', subConcept: 'Perimeter from two equal tangents', sourcePage: page('18.5'), sourceQuestionNumber: '19' },
  { text: 'CP and CQ are tangents to a circle with centre O. ARB is another tangent touching the circle at R. If CP = 11 cm and BC = 6 cm then the length of BR is:', options: ['6 cm', '5 cm', '4 cm', '3 cm'], correct: 1, difficulty: 'Medium', subConcept: 'Tangent lengths, subtracting segments', sourcePage: page('18.5'), sourceQuestionNumber: '20' },
  { text: 'In the given figure, AB is a chord of the circle such that ∠AXB = 50°. If AP is tangent to the circle at point A, then ∠BAP =', options: ['65°', '50°', '40°', '100°'], correct: 0, difficulty: 'Hard', subConcept: 'Tangent-chord angle (alternate segment theorem)', sourcePage: page('18.5'), sourceQuestionNumber: '21' },
  { text: 'In the given figure, O is the centre of the circle and AB is a chord. If the tangent AM at A makes an angle of 50° with AB, then ∠AOB =', options: ['100°', '75°', '80°', '150°'], correct: 0, difficulty: 'Hard', subConcept: 'Tangent-chord angle and central angle', sourcePage: page('18.5'), sourceQuestionNumber: '22' },
  { text: 'In the given figure, AB is a chord of a circle with centre O and AT is a tangent to the circle at A. If ∠AOB = 110°, then ∠BAT =', options: ['90°', '45°', '55°', '110°'], correct: 2, difficulty: 'Hard', subConcept: 'Tangent-chord angle and central angle', sourcePage: page('18.5'), sourceQuestionNumber: '23' },

  { text: 'In the given figure, XY is a tangent at X to the circle with centre O. If ∠XYO = 25°, then x° =', options: ['25°', '115°', '65°', '60°'], correct: 2, difficulty: 'Hard', subConcept: 'Tangent-radius right angle combined with a triangle', sourcePage: page('18.6'), sourceQuestionNumber: '24' },
  { text: 'In the given figure, XQY is a tangent at Q to a circle. If PM is a chord parallel to XY and ∠MQY = 65°, then ∠PQM = ?', options: ['20°', '35°', '50°', '65°'], correct: 3, difficulty: 'Hard', subConcept: 'Tangent-chord angle and alternate angles', sourcePage: page('18.6'), sourceQuestionNumber: '25' },
  { text: 'In the given figure, if PQR is the tangent to a circle at Q whose centre is O, AB is parallel to PR and ∠BQR = 70°, then ∠AOB is equal to', options: ['70°', '20°', '40°', '80°'], correct: 3, difficulty: 'Hard', subConcept: 'Tangent-chord angle combined with central angle', sourcePage: page('18.6'), sourceQuestionNumber: '26' },
  { text: 'RO and SO are the radii of circle with centre O. PR and PS are two tangents from an external point P, if ∠RPS = 25°, the value of ∠ROS is:', options: ['135°', '145°', '165°', '155°'], correct: 1, difficulty: 'Medium', subConcept: 'Quadrilateral of two tangents and two radii', sourcePage: page('18.6'), sourceQuestionNumber: '27' },
  { text: 'In the given figure, XY and XZ are tangents at points Y and Z respectively to a circle with centre O. If C is a point on the circle and ∠ZXY = 40°, then ∠ZCY = ?', options: ['80°', '70°', '140°', '40°'], correct: 1, difficulty: 'Hard', subConcept: 'Tangent angle combined with inscribed angle', sourcePage: page('18.6'), sourceQuestionNumber: '28' },

  { text: 'In the adjoining figure, if AB and AC are two tangents to a circle at B and C respectively such that ∠BOC = 115°. O is the centre of the circle, then the value of ∠BAC is:', options: ['32.5°', '65°', '57.5°', '115°'], correct: 2, difficulty: 'Medium', subConcept: 'Quadrilateral of two tangents and two radii', sourcePage: page('18.7'), sourceQuestionNumber: '29' },
  { text: 'If PA and PB are two tangents to a circle with centre O, such that ∠APB = 80°, then ∠BOP =', options: ['50°', '100°', '60°', '160°'], correct: 0, difficulty: 'Medium', subConcept: 'Tangent-radius right triangle', sourcePage: page('18.7'), sourceQuestionNumber: '30' },
  { text: 'In the given circle with centre O, PA and PB are tangents to the circle. Chord AB makes an angle of 30° with the radius at the point of contact A. If AB = 8 cm, then the length of PA is:', options: ['4 cm', '8 cm', '16 cm', '20 cm'], correct: 1, difficulty: 'Hard', subConcept: 'Tangent-chord angle combined with an isosceles triangle', sourcePage: page('18.7'), sourceQuestionNumber: '31' },
  { text: 'In the given figure, O is the centre of the circle and BCD is a tangent at C. Then ∠BAC + ∠ACD =', options: ['180°', '120°', '135°', '90°'], correct: 3, difficulty: 'Hard', subConcept: 'Angle in a semicircle combined with tangent-chord angle', sourcePage: page('18.7'), sourceQuestionNumber: '32' },
  { text: 'The points A, B and T lie on a circle and CTS is a tangent to the circle at T. ABC is a straight line and AB = BT. ∠ATS = 98°, then the size of ∠ACT is:', options: ['49°', '82°', '98°', '57°'], correct: 0, difficulty: 'Hard', subConcept: 'Tangent-chord angle combined with an isosceles triangle', sourcePage: page('18.7'), sourceQuestionNumber: '33' },

  { text: 'AB is a chord of the circle and AC is its diameter such that ∠BAT = 50°. If AT is the tangent to the circle at the point A, then ∠ADB is equal to:', options: ['145°', '125°', '130°', '50°'], correct: 1, difficulty: 'Hard', subConcept: 'Tangent-chord angle combined with a cyclic quadrilateral', sourcePage: page('18.8'), sourceQuestionNumber: '34' },
  { text: 'AB is the diameter of a circle with centre O and AT is a tangent. If ∠AOQ = 60°, then ∠ATQ is equal to:', options: ['60°', '50.5°', '49°', '30°'], correct: 3, difficulty: 'Hard', subConcept: 'Tangent-radius right angle combined with central angle', sourcePage: page('18.8'), sourceQuestionNumber: '35' },
  { text: 'CE is a tangent to the circle at point C. If ∠ABC = 93° and ∠DCE = 35°, then the value of ∠ACD is:', options: ['93°', '58°', '35°', '55°'], correct: 1, difficulty: 'Hard', subConcept: 'Tangent-chord angle combined with cyclic quadrilateral', sourcePage: page('18.8'), sourceQuestionNumber: '36' },
  { text: 'In a circle with diameter PQ, SPT is a tangent to the circle at P. If ∠RPQ = 17° and ∠TPU = 58°, then the value of y is:', options: ['75°', '58°', '116°', '34°'], correct: 0, difficulty: 'Hard', subConcept: 'Tangent-chord angle, angle in semicircle', sourcePage: page('18.8'), sourceQuestionNumber: '37' },
  { text: 'A, B and C are points on the circumference of a circle, centre O. Tangent DE touches the circle at C. If ∠BCE = 53° and ∠ACO = 20°, then the value of x is:', options: ['53°', '20°', '147°', '33°'], correct: 3, difficulty: 'Hard', subConcept: 'Tangent-chord angle combined with isosceles radius triangle', sourcePage: page('18.8'), sourceQuestionNumber: '38' },

  { text: 'Two chords AB and CD of a circle intersect at a point P. If PA = 6 cm, PC = 3 cm, PD = 4 cm, then the length of AB is:', options: ['8 cm', '2 cm', '6 cm', '9 cm'], correct: 0, difficulty: 'Medium', subConcept: 'Intersecting chords theorem', sourcePage: page('18.9'), sourceQuestionNumber: '39' },
  { text: 'Two chords AB and CD of a circle intersect at a point P, such that AB bisects CD as given in the figure. If PA = 8 cm, PB = 1 cm and PD = x cm, then the length of CD is:', options: ['2√2 cm', '4√2 cm', '3 cm', '9 cm'], correct: 1, difficulty: 'Hard', subConcept: 'Intersecting chords theorem, bisected chord', sourcePage: page('18.9'), sourceQuestionNumber: '40' },
  { text: 'AC is the diameter of a circle, BC cuts circle at a point D. If BD = 9 cm and DC = 7 cm, calculate the length of AB.', options: ['4 cm', '21 cm', '12 cm', '5 cm'], correct: 2, difficulty: 'Hard', subConcept: 'Angle in a semicircle combined with intersecting secants', sourcePage: page('18.9'), sourceQuestionNumber: '41' },
  { text: 'In the given figure, if AT = 16 cm and AB = 12 cm, then value of PT is:', options: ['8 cm', '6 cm', '28 cm', '4 cm'], correct: 1, difficulty: 'Hard', subConcept: 'Tangent-secant length relation', sourcePage: page('18.9'), sourceQuestionNumber: '42' },
  { text: 'In the given figure, tangent PT = 12 cm and PA = 10 cm, then the value of AB is:', options: ['14.4 cm', '4.4 cm', '2.4 cm', '6.4 cm'], correct: 2, difficulty: 'Hard', subConcept: 'Tangent-secant length relation', sourcePage: page('18.9'), sourceQuestionNumber: '43' },

  { text: 'In the figure given alongside, chord AB and diameter CD of a circle meet at P. If AB = 8 cm, BP = 6 cm and PD = 4 cm, then the radius of the circle is:', options: ['7.5 cm', '8 cm', '8.5 cm', '17 cm'], correct: 0, difficulty: 'Hard', subConcept: 'Intersecting chords theorem, find radius', sourcePage: page('18.10'), sourceQuestionNumber: '44' },
  { text: 'AB and CD are two chords meeting at point P outside the circle. If PB = 4 cm, PD = 5 cm, CD = 11 cm, then the length of AB is:', options: ['20 cm', '12 cm', '15 cm', '16 cm'], correct: 3, difficulty: 'Hard', subConcept: 'Intersecting secants theorem (external point)', sourcePage: page('18.10'), sourceQuestionNumber: '45' },
  { text: 'Two circles of radii 8 cm and 3 cm have their centre 13 cm apart, then the length of a direct common tangent MN to the two circles is:', options: ['12 cm', '8 cm', '16 cm', '11 cm'], correct: 0, difficulty: 'Hard', subConcept: 'Direct common tangent length between two circles', sourcePage: page('18.10'), sourceQuestionNumber: '46' },
  { text: 'In Δ PQR, it is given that PQ = 7 cm, QR = 24 cm and ∠PQR = 90°. Then the radius of the inscribed circle is:', options: ['6 cm', '3 cm', '8 cm', '4 cm'], correct: 1, difficulty: 'Hard', subConcept: 'Inradius of a right triangle', sourcePage: page('18.10'), sourceQuestionNumber: '47' },
  { text: 'ABC is a triangle with AB = 10 cm, BC = 8 cm and AC = 6 cm. Three circles are drawn touching each other with vertices as their centres. Then sum of the radii of the three circles is:', options: ['24 cm', '12 cm', '36 cm', '18 cm'], correct: 1, difficulty: 'Hard', subConcept: 'Mutually tangent circles at triangle vertices', sourcePage: page('18.10'), sourceQuestionNumber: '48' },

  { text: 'In the given figure, PA and PB are the tangents from an external point P to the circle with centre O. If the radius of the circle is 5 cm and PA ⊥ PB, then the length OP is equal to:', options: ['5 cm', '10 cm', '7.5 cm', '5√2 cm'], correct: 3, difficulty: 'Hard', subConcept: 'Perpendicular tangents forming a square with radii', sourcePage: page('18.11'), sourceQuestionNumber: '49' },

  {
    kind: 'case',
    text: 'In the given figure PQ = RQ, ∠RQP = 72° and PC, QC are tangents to the circle with centre O.',
    parts: [
      { text: '(i) The angle subtended by the chord PQ at the centre is:', options: ['54°', '72°', '108°', '36°'], correct: 2, marks: 1 },
      { text: '(ii) The value of ∠PCQ is:', options: ['60°', '72°', '108°', '120°'], correct: 1, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: isosceles chord triangle with two tangents', questionType: 'case_study', sourcePage: page('18.11'), sourceQuestionNumber: '50',
  },
  {
    kind: 'case',
    text: 'In the adjoining figure, PT touches the circle whose centre is O at R. Diameter SQ produced meets PT at P. If ∠QRP = 35°',
    parts: [
      { text: '(i) The value of ∠QSR is:', options: ['20°', '90°', '35°', '70°'], correct: 2, marks: 1 },
      { text: '(ii) The value of ∠QOR is:', options: ['20°', '90°', '35°', '70°'], correct: 3, marks: 1 },
      { text: '(iii) The value of ∠QPR is:', options: ['20°', '90°', '35°', '70°'], correct: 0, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: tangent at a diameter’s extension', questionType: 'case_study', sourcePage: page('18.11'), sourceQuestionNumber: '51',
  },
  {
    kind: 'case',
    text: 'In the given figure, ABCD is a cyclic quadrilateral. The tangent to the circle at B meets DC produced at F. ∠EAB = 80° and ∠BFC = 57°.',
    parts: [
      { text: '(i) The value of ∠CAB is:', options: ['77°', '57°', '23°', '80°'], correct: 2, marks: 1 },
      { text: '(ii) The value of ∠CAD is:', options: ['77°', '57°', '23°', '80°'], correct: 0, marks: 1 },
      { text: '(iii) The value of ∠BCF is:', options: ['90°', '77°', '80°', '100°'], correct: 3, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: cyclic quadrilateral with an external tangent', questionType: 'case_study', sourcePage: page('18.12'), sourceQuestionNumber: '52',
  },
  {
    kind: 'case',
    text: 'In the given figure, XY is a diameter of the circle, PQ is tangent to the circle at Y. Given that ∠AXB = 50° and ∠ABX = 70°.',
    parts: [
      { text: '(i) The value of ∠ABY is:', options: ['10°', '20°', '30°', '60°'], correct: 1, marks: 1 },
      { text: '(ii) The value of ∠BAY is:', options: ['10°', '20°', '30°', '60°'], correct: 2, marks: 1 },
      { text: '(iii) The value of ∠APY is:', options: ['10°', '20°', '30°', '60°'], correct: 0, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: diameter with an angle-in-semicircle tangent setup', questionType: 'case_study', sourcePage: page('18.12'), sourceQuestionNumber: '53',
  },

  { text: 'Assertion (A): From a point P, 10 cm away from the centre of a circle, a tangent PT of length 8 cm is drawn, then the radius of the circle is 5 cm. Reason (R): In a circle, radius through the point of contact is perpendicular to the tangent.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 1, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('18.12'), sourceQuestionNumber: '54', explanation: 'A is false — with PT=8 and OP=10, using OT²=OP²-PT² gives OT=√(100-64)=√36=6 cm, not 5 cm. R is a true general theorem. A false, R true — matches the key (B).' },
  { text: 'Assertion (A): In the figure, AB, AC and DE are tangent to the circle. If AC = 7 cm, then perimeter of Δ ADE is 14 cm. Reason (R): The length of tangents to a circle from an external point is equal.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 2, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('18.13'), sourceQuestionNumber: '55', explanation: 'A is true — since AB=AC=7 (equal tangents from A) and DE is a third tangent formed by the two other equal-tangent pairs from D and E, the perimeter of Δ ADE collapses to AB+AC = 7+7 = 14 cm, a standard result for this configuration. R is the correctly stated general theorem it relies on. Both true — matches the key (C).' },
  { text: 'Assertion (A): If two circles touch each other, then the point of contact lies on the straight line joining their centres. Reason (R): Radius through point of contact is perpendicular to the common tangent at that point.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 2, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('18.13'), sourceQuestionNumber: '56' },
  { text: 'Assertion (A): In two concentric circle, the chord of the larger circle, which touches the smaller circle, is bisected at the point of contact. Reason (R): A line joining centre to any point of a chord of a circle bisects the chord.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('18.13'), sourceQuestionNumber: '57', explanation: 'A is true (a standard concentric-circles theorem: the point of tangency is the midpoint of the chord). R as printed is false as a general statement — a line from the centre bisects a chord only when it is perpendicular to that chord, not for any arbitrary point on it. A true, R false — matches the key (A).' },
  { text: 'Assertion (A): The length of a tangent from a point A at a distance 5 cm from the centre of the circle is 4 cm. The radius of the circle is 3 cm. Reason (R): In Δ OBA, OA² = AB² + BO².', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('18.13'), sourceQuestionNumber: '58', explanation: 'A is true — radius = √(OA²-AB²) = √(25-16) = 3 cm. R is the correct Pythagorean relation for the tangent-radius right triangle, and it is exactly the relation used to derive A. Both true, R explains A — matches the key (A).' },
  { text: 'Assertion (A): If the angle between two radii of a circle is 110°, then the angle between the tangents at the ends of the radii is 50°. Reason (R): A circle has infinitely many tangents.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 3, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('18.14'), sourceQuestionNumber: '59', explanation: 'A is false — the tangent-radius quadrilateral gives the angle between the tangents as 180-110 = 70°, not 50°. R is a true general fact (a circle has infinitely many tangent lines, one at every point), though it does not bear on A. A false, R true — matches the key (D).' },
  { text: 'Assertion (A): In the figure, CD = 7.8 cm, PD = 5 cm, PB = 4 cm, then PT = 8 cm. Reason (R): If two chords of a circle intersect internally or externally, then the product of the lengths of their segment is equal.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Hard', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('18.14'), sourceQuestionNumber: '60', explanation: 'A is true — using the figure\'s secant/tangent segment values (CD=7.8, PD=5, PB=4) with the tangent-secant-segment relation, PT works out to 8 cm as stated. R is the correctly stated general theorem it relies on. Both true, R explains A — matches the key (A).' },
];

const meta = {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'Tangent Properties of Circle',
  chapterOrder: 18,
  label: 'chap_18.pdf (ICSE Maths workbook) — full ingestion, questions (1)-(60)',
  status: 'transcribed',
};

const result = ingestQuestions(items, meta);
console.log('item count in this batch:', items.length);
console.log(JSON.stringify(result, null, 2));
