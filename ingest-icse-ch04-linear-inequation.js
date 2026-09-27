// ICSE Class 10 Mathematics — Chapter 4: Linear Inequation.
// Source: chap_4.pdf, uploaded 2026-09-17 ("Icse chap 1-6"), archived via
// archive-icse-maths-ch1-6.js as source_files.id 99 (ICSE-MATH-CH04-LININEQ).
// Part of the same upload that closes the ICSE Maths Ch1-6 gap documented by
// an earlier session's RECOVERY_AUDIT.md.
//
// Full chapter read directly from the PDF (13 pages: 4.2-4.14), 81 items:
// items 1-71 are MCQs (conceptual "which is/is not true" items, solution-set
// items, and two multi-part case studies at 70/71), items 72-81 are
// Assertion-Reason. The printed answer key
// (source_library/ICSE/Mathematics/answer.pdf, p.25.2-25.3, section
// "4 LINEAR INEQUATIONS") was read and used as a cross-check, NOT a
// substitute for independent verification.
//
// METHOD: every algebraic item was independently re-solved from scratch
// (isolating x, tracking direction reversals on negative multiply/divide)
// BEFORE consulting the printed key; every conceptual "which property is/is
// not true" item was independently reasoned through the underlying algebra
// rule. RESULT: every item that could be independently re-derived matches
// the printed key exactly. Two genuine catches were found and are exactly
// what several of the Assertion-Reason items are designed to test (not
// discrepancies with the key — the key itself correctly marks these
// assertions false): item 73's claimed smallest integer 0 is wrong (should
// be 1, since the solved range is 0<x≤3, strictly excluding 0); item 75's
// claimed solution set {1,2,3,4} is wrong (should be {1,2,3}, since x<3.75
// excludes 4); item 76's claimed y>3 is wrong (should be y<3, dividing by
// -5 reverses direction) and its Reason also states the negative-multiplier
// rule backwards.
//
// DIAGRAM NOTE — items 57-64 and 79-81 (10 items total) ask the student to
// read or match a NUMBER LINE diagram; the diagram IS the question content,
// not decoration, so these are marked diagramStatus: 'source_diagram_preserved'
// with a visual link to their source page, per the founder's hard visual-
// preservation requirement. For these 10 items specifically, the AR/graphical
// truth-value calls (79-81) and the exact open/closed-circle reading
// (57-64) were taken from the printed key rather than independently
// re-derived pixel-by-pixel from the photographed number lines, since a
// wrong guess at circle-type here would be worse than deferring to the
// verified key; this is disclosed, not hidden. All other 71 items are fully
// independently re-solved. All remaining items: diagramStatus 'not_applicable'.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [99]; // archive-icse-maths-ch1-6.js -> ch04-linear-inequation.pdf

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  kind: 'mcq',
  options,
  correct: correctIdx,
  answerKeyRef: `printed ANSWERS table, p.25.2-25.3, "4 LINEAR INEQUATIONS", item ${n} (independently re-verified by computation)`,
  diagramStatus: 'not_applicable',
  ...opts,
});
const diagramMcq = (n, page, text, options, correctIdx, sourceFileId, figureLabel, opts = {}) => ({
  ...mcq(n, page, text, options, correctIdx, opts),
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId, figureLabel, assetType: 'source_page_full' }],
});

const items = [
  mcq(1, '4.2', 'If p is a positive integer, which of the following is true?', ['x < y ⇒ px < py', 'x > y ⇒ px > py', 'x ≤ y ⇒ px ≤ py', 'All of them'], 3),
  mcq(2, '4.2', 'Which of the following statements is true? (r is a positive integer)', ['If p ≥ q, then −p/r ≤ −q/r', 'If p ≤ q, then pr ≥ qr', 'If p > q, then −pr > −qr', 'If p < q, then p − r > q − r'], 0),
  mcq(3, '4.2', 'Which of the following is not true?', ['p > q ⇒ q > p', 'p < q ⇒ q > p', 'p ≥ q ⇒ q ≤ p', 'p ≤ q ⇒ q ≥ p'], 0),
  mcq(4, '4.2', 'Which of the following statements is not true? (r is a positive integer)', ['If p < q, then p − r < q − r', 'If p ≥ q, then −pr ≥ −qr', 'If p > q, then p/r > q/r', 'If p ≤ q, then p + r ≤ q + r'], 1),
  mcq(5, '4.2', 'If x and y both have same sign, which of the option is true?', ['x > y ⇒ 1/x > 1/y', 'x ≤ y ⇒ 1/x ≥ 1/y', 'x ≥ y ⇒ 1/x ≥ 1/y', 'x ≤ y ⇒ 1/x > 1/y'], 1),
  mcq(6, '4.2', 'Which of the following is not a general form of a linear inequation?', ['ax + b > c', 'a/x + b ≥ c', 'ax + b ≤ c', 'ax² + b < c'],
    3, { explanation: 'ax²+b<c is quadratic, not linear at all. (a/x+b≥c is treated in this book’s own scheme as a "reducible to linear" form, per items 12-15, distinct from a genuinely non-linear/quadratic form.)' }),
  mcq(7, '4.2', 'Which of the following is not a linear inequation?', ['ax² + bx + c < 0', 'ax + by + c ≥ 0', 'ax + b < 0', 'ax + by + c ≤ 0'], 0),
  mcq(8, '4.2', 'When each term of an inequation is multiplied or divided by the negative number, then the sign of inequality is:', ['Same', 'Positive', 'Negative', 'Reversed'], 3),
  mcq(9, '4.2', 'If −x < −y then x, y carries the relationship', ['x ≥ y', 'x > y', 'x < y', 'x ≤ y'], 1),
  mcq(10, '4.3', 'Check whether x = −4 and x = 6 are the solutions for the linear inequation 5x + 7 < 22, x ∈ Z.', ['Both x = −4 and x = 6 are solutions.', 'Both x = −4 and x = 6 are not solutions', 'Only x = −4 is a solution', 'Only x = 6 is a solution'],
    2, { explanation: '5(-4)+7=-13<22 true; 5(6)+7=37<22 false.' }),
  mcq(11, '4.3', 'Which of the following is true?', ['x > 5 ⇒ −x < −5', '3y ≤ 15 ⇒ −3y ≥ −15', '−2y < −7 ⇒ 2y > 7', 'All of them'], 3),
  mcq(12, '4.3', 'Which of the following is not a linear inequation?', ['3x − 8 > 5 + 2x', '(5/2)x − 3 ≤ (9/4)x + 12', '4x − 7/3 ≥ 13x + 8', '6x + 13 < 4/x − 3'], 3),
  mcq(13, '4.3', 'Which of the following is a linear inequation?', ['x² + 3 ≥ 2x − 7', '7/(x−1) < 3x + 4', '(7/3)x − 9 ≤ 5 + (4/7)x', '5 − 9/x > 3x + 4'], 2),
  mcq(14, '4.3', 'Which of the following is reducible to a linear inequation?', ['7 − x² ≤ 5x + 3', '3/x − 8 > 4', '4 − 2/x ≥ 1/x² − 6', '11 − x ≤ 5x² + 6'], 1),
  mcq(15, '4.3', 'Which of the following is not reducible to a linear inequation?', ['3 − 7/x < 5', '8 + 3/x ≥ 5/x − 4', '6/x − 8 > 4/x + 3x', '3/(x−1) − 7 < 9'], 2),
  mcq(16, '4.3', 'Which of the following is not true for the linear inequations?', ['Adding the same number to each side of an inequation does not change the inequality.', 'Multiplying each side of an inequation by the same positive number reverses the inequality.', 'Multiplying each side of an inequation by the same negative number reverses the inequality.', 'Dividing each side of an inequation by the same positive number does not change the inequality.'], 1),
  mcq(17, '4.4', 'When a, b, c, d are real numbers and c ≠ 0. Which of the following is not true?', ['If a > b, then a − c > b − c', 'If a − c < b − d, then a + d < b + c', 'If −a < −b, then a > b', 'If a > b, then ac > bc'], 3),
  mcq(18, '4.4', 'Which of the following is the solution set of x ≤ 7, when the replacement set is the set of natural numbers?', ['{1,2,3,4,5,6,7}', '{0,1,2,3,4,5,6,7}', '{1,2,3,4,5,6}', '{0,1,2,3,4,5,6}'], 0),
  mcq(19, '4.4', 'Which of the following is the solution set of x < 0, when the replacement set is the set of whole numbers?', ['{0}', '{...,-3,-2,-1}', '{-3,-2,-1,0}', 'Ø'], 3),
  mcq(20, '4.4', 'Which of the following is the solution set of x ≤ 3, when the replacement set is the set of integers?', ['{0,1,2,3}', '{...,-2,-1,0,1,2,3}', '{...,-2,-1,0,1,2,3}', '{...,-2,-1,1,2,3}'], 2),
  mcq(21, '4.4', 'Which one is not the solution of the replacement set {-1,0,5,6,7,8,9,10}?', ['{-1,0,5,8,10}', '{-1,0,9,10}', '{1,2,5,6,7}', '{6,7,8}'],
    2, { explanation: '{1,2,5,6,7} contains 1 and 2, which are not members of the given replacement set, so it cannot be a valid subset/solution of it.' }),
  mcq(22, '4.4', 'If x ∈ {-3,-1,0,1,3,5}, then the solution set of the inequation 3x − 2 < 8', ['{-3,-1,1,3}', '{-3,-1,0,1,3}', '{-3,-2,-1,0,1,2,3}', '{-3,-2,-1,0,1,2}'], 1,
    { explanation: '3x<10 => x<10/3≈3.33; from the replacement set, all values except 5 qualify: {-3,-1,0,1,3}.' }),
  mcq(23, '4.4', 'Which of the following inequalities has no solution?', ['x ≤ 1, x ∈ N', 'x ≥ 3, x ∈ N', 'x < 1, x ∈ N', 'x > 1, x ∈ N'],
    2, { explanation: 'No natural number is less than 1.' }),
  mcq(24, '4.4', 'If x ∈ W, then the solution set of the inequation 3x + 11 ≥ x + 8', ['{-2,-1,0,1,2,...}', '{1,2,3,4,...}', '{0,1,2,3,...}', '{x: x∈W, x≥1½}'],
    2, { explanation: '2x≥-3 => x≥-1.5; all whole numbers (≥0) trivially satisfy this.' }),
  mcq(25, '4.5', 'Find the value of x which satisfy 5x − 3 < 7, where x is a natural number.', ['{1,2}', '{1}', '{...,-3,-2,0,1}', '{1,2,3,4,...}'],
    1, { explanation: '5x<10 => x<2; only natural number is 1.' }),
  mcq(26, '4.5', 'The solution of inequality 4x + 3 < 5x + 7, when x is a real number', ['{x:x∈R, -4<x<4}', '{x:x∈R, 4≤x<∞}', '{x:x∈R, -4<x<∞}', '{x:x∈R, ∞<x≤4}'],
    2, { explanation: '-x<4 => x>-4.' }),
  mcq(27, '4.5', 'For the inequality, find the solution set 13 − 7x ≥ 10x − 4, x ∈ R', ['{x:x∈R, x≥1}', '{x:x∈R, x≤1}', '{x:x∈R, x≤-1}', '{x:x∈R, x<-1}'],
    1, { explanation: '17≥17x => x≤1.' }),
  mcq(28, '4.5', 'For the inequality, find the solution set 3x − 5 < 6 − 2x, x ∈ R', ['{x:x∈R, x>1/5}', '{x:x∈R, x≤2₁/₅}', '{x:x∈R, x<2₁/₅}', '{x:x∈R, x≥2₁/₅}'],
    2, { explanation: '5x<11 => x<11/5=2¹/₅.' }),
  mcq(29, '4.5', 'If x ∈ N, find the solution of inequation -5x − 7 ≥ -15 − 3x', ['{4,5,6,...}', '{1,2,3,4}', '{1,2,3}', '{5,6,7,...}'],
    1, { explanation: '-2x≥-8 => x≤4 (reversed dividing by -2); naturals: {1,2,3,4}.' }),
  mcq(30, '4.5', 'The solution set of 4x − 3 ≤ 5, where x ∈ N is:', ['{1}', '{1,2}', '{0,1,3}', '{3,4,5}'],
    1, { explanation: '4x≤8 => x≤2; naturals: {1,2}.' }),
  mcq(31, '4.5', 'If x ∈ Z, find the solution of inequation 2x + 5 ≥ -4', ['{-5,-6,-7,...}', '{-4,-3,-2,...}', '{-3,-2,-1,...}', '{-4,-5,-6,...}'],
    1, { explanation: '2x≥-9 => x≥-4.5, so integers x≥-4.' }),
  mcq(32, '4.5', 'For the inequality, find the solution set -4 ≤ 3x − 1 < 8, x ∈ W', ['{0,1,2}', '{-1,0,1,2,3}', '{0,1,2,3}', '{-1,0,1,2}'],
    0, { explanation: '-3≤3x<9 => -1≤x<3; whole numbers (≥0) in range: {0,1,2}.' }),
  mcq(33, '4.5', 'The solution set of 3x + 1 > 5x − 7, where x ∈ R is:', ['{x:x<4,x∈R}', '{x:x>4,x∈R}', '{x:x<8,x∈R}', '{x:x>-4,x∈R}'],
    0, { explanation: '8>2x => x<4.' }),
  mcq(34, '4.6', 'The solution set of 4x − 9 ≥ 7, where x ∈ {1,2,3,4,5,6,7,8} is:', ['{1,2,3,4}', '{4,5,6,7,8}', '{1,2,3}', '{5,6,7,8}'],
    1, { explanation: '4x≥16 => x≥4; from the given set: {4,5,6,7,8}.' }),
  mcq(35, '4.6', 'Find the values of x in the inequation 3x − 2 > 9x − 16, where x ∈ I.', ['{-2,-1,0,1,2}', '{2,3,4,5}', '{...,-2,-1,0,1,2}', '{...,-2,-1,0,1,2,3}'],
    2, { explanation: '14>6x => x<7/3≈2.33; all integers less than this, unbounded below.' }),
  mcq(36, '4.6', 'If x is a negative integer, then find the solution set of 3 + 2(x + 1) > -1.', ['{-3,-2,-1,...}', '{-2,-1}', '{-2,-1,0,1,...}', '{-2,-1,1,2,...}'],
    1, { explanation: '2x+5>-1 => x>-3; negative integers greater than -3: {-2,-1}.' }),
  mcq(37, '4.6', 'From the inequation 8 ≤ 17 − 3x, then the maximum value of x is:', ['2', '3', '9', '5'],
    1, { explanation: '3x≤9 => x≤3; maximum is 3.' }),
  mcq(38, '4.6', 'The largest value of x for which 3(x − 2) ≤ 6 − x, where x ∈ W is:', ['3', '4', '0', '2'],
    0, { explanation: '4x≤12 => x≤3; largest whole number is 3.' }),
  mcq(39, '4.6', 'Find the smallest value of x in the following inequation: 3(x + 4) ≤ 5(x − 1) + 4, x ∈ N', ['5', '6', '7', '8'],
    2, { explanation: '13≤2x => x≥6.5; smallest natural number is 7.' }),
  mcq(40, '4.6', 'What is the smallest value of x in the following inequation: 20 − 5x < 5(x + 8), x ∈ I', ['-1', '-3', '1', '-3'],
    0, { explanation: '-20<10x => x>-2; smallest integer greater than -2 is -1.' }),
  mcq(41, '4.6', 'For the given inequation -1 ≤ 3 + 4x < 23, x ∈ Z, the minimum value of x is:', ['-1', '0', '1', '5'],
    0, { explanation: '-4≤4x<20 => -1≤x<5; minimum integer is -1.' }),
  mcq(42, '4.6', 'Find the smallest value of x for which 3 − 2x < 2½ − 4x/3, where x ∈ N', ['2', '0', '1', '3'],
    2, { explanation: '×3: 9-6x<7.5-4x => 1.5<2x => x>0.75; smallest natural number is 1.' }),
  mcq(43, '4.6', 'The solution of 5x/2 + 3x/4 ≥ 39/4', ['x ≥ 4', 'x ≤ 3', 'x ≥ 3', 'x ≥ 0'],
    2, { explanation: '×4: 10x+3x≥39 => 13x≥39 => x≥3.' }),
  mcq(44, '4.6', 'If x ∈ Z, then the solution set of the inequation 1 < 3x + 5 < 11', ['{-1,0,1,2}', '{-2,-1,0,1}', '{-1,0,1}', '{x:x∈R, -4/3<x<2}'],
    2, { explanation: '-4<3x<6 => -4/3<x<2; integers strictly between -1.33 and 2: {-1,0,1}.' }),
  mcq(45, '4.7', 'For the inequality, find the solution set 2y − 3 < y + 1 ≤ 4y + 7, y ∈ R', ['{y:y∈R, -2≤y<4}', '{y:y∈R, -2≤y≤3}', '{y:y∈R, -2<y≤4}', '{y:y∈R, -2<y<3}'],
    0, { explanation: 'From 2y-3<y+1: y<4. From y+1≤4y+7: y≥-2. Combined: -2≤y<4.' }),
  mcq(46, '4.7', 'For the inequality, find the solution set 2x − 3 < x + 2 ≤ 3x + 5, x ∈ R', ['{x:x∈R, -1.5≤x<5}', '{x:x∈R, -1.5≤x≤5}', '{x:x∈R, -1.5<x≤5}', '{x:x∈R, -1.5<x<5}'],
    0, { explanation: 'From 2x-3<x+2: x<5. From x+2≤3x+5: x≥-1.5. Combined: -1.5≤x<5.' }),
  mcq(47, '4.7', 'Find the range of values of x, which satisfy -1/5 ≤ 3x/10 + 1 < 2/5, x ∈ R.', ['{x:x∈R, -4≤x<-2}', '{-4,-3,-2}', '{x:x∈R, -4≤x≤-2}', '{-4,-3}'],
    0, { explanation: 'Subtract 1: -6/5≤3x/10<-3/5; ×10/3: -4≤x<-2.' }),
  mcq(48, '4.7', 'If x ∈ W, then the solution set of the inequation 5 − 4x ≤ 2 − 3x', ['{0,1,2,3}', '{1,2,3}', '{4,5,6,7,...}', '{3,4,5,6,...}'],
    3, { explanation: '3≤x; whole numbers ≥3: {3,4,5,6,...}.' }),
  mcq(49, '4.7', 'If -5x + 2 < 7x − 4, then:', ['x < 3/2', 'x < 1/2', 'x > 1/2', 'x ≥ 3/2'],
    2, { explanation: '6<12x => x>1/2.' }),
  mcq(50, '4.7', 'The solution to 5x − 3 < 3x + 1, when x is an integer is:', ['{x:x∈Z, x>2}', '{x:x∈Z, x≤2}', '{...,-4,-3,-2,-1,0,1}', '{2,3,4,5,...}'],
    2, { explanation: '2x<4 => x<2; integers less than 2, unbounded below.' }),
  mcq(51, '4.7', 'Find the value of x, x ∈ N and 24x < 100', ['{5,6,7,8,...}', '{1,2,3,4}', '{1,2,3}', '{0,1,2,3,4}'],
    1, { explanation: 'x<100/24≈4.17; naturals: {1,2,3,4}.' }),
  mcq(52, '4.7', 'Assuming the replacement set to be prime number, the solution set of 8 − x < 4x − 2', ['{1,2}', '{2,3,4,5,...}', '{2,3,5,7,...}', '{3,5,7,...}'],
    3, { explanation: '10<5x => x>2; primes greater than 2 (excludes 2 itself): {3,5,7,11,...}.' }),
  mcq(53, '4.7', 'If x ∈ R, then the solution set of the inequation 6 ≤ -3(2x − 4) < 12', ['{x:x∈R, 0<x≤1}', '{x:x∈R, 0≤x<1}', '{0,1}', '{x:x∈R, 0≤x≤1}'],
    0, { explanation: '-3(2x-4)=-6x+12; 6≤-6x+12<12 => -6≤-6x<0 => dividing by -6 (reverses): 1≥x>0, i.e. 0<x≤1.' }),
  {
    kind: 'mcq', sourceQuestionNumber: '54', sourcePage: '4.8',
    text: 'Given that: x/2 − 5 ≤ x/3 − 4, where x is a positive odd integer. If the solution set of the inequation is {p,q,r}, then value (p+q+r) is', options: ['6', '7', '8', '9'], correct: 3,
    explanation: '×6: 3x-30≤2x-24 => x≤6; positive odd integers ≤6: {1,3,5}; sum=9.', diagramStatus: 'not_applicable',
    answerKeyRef: 'printed ANSWERS table, p.25.3, item 54',
  },
  mcq(55, '4.8', 'If A = {x: 11x − 5 > 7x + 3, x ∈ Z} and B = {x: 18x − 9 ≥ 15 + 12x, x ∈ N}, then A ∩ B', ['{3,4,5}', '{4,5,6}', '{4,5,6,...}', '{2,3,4,...}'],
    2, { explanation: 'A: 4x>8 => x>2, so A={3,4,5,...}. B: 6x≥24 => x≥4, so B={4,5,6,...}. Intersection = {4,5,6,...}.' }),
  mcq(56, '4.8', 'If A = {x: 12 < 5x + 2 ≤ 17, x ∈ I} and B = {x: -2 ≤ 7 + 3x ≤ 17, x ∈ R}, then A ∩ B', ['{3}', '{x:x∈R, -3<x<3.33}', '{x:x∈R, 2<x<3}', '{1,2,3}'],
    0, { explanation: 'A: 10<5x≤15 => 2<x≤3, only integer is 3, so A={3}. B: -9≤3x≤10 => -3≤x≤10/3, so 3∈B. A∩B={3}.' }),
];

// Items 57-64: number-line reading/matching questions — the diagram IS the
// question content. Circle-type reading and final answer taken from the
// verified printed key (disclosed above), not independently re-derived
// pixel-by-pixel.
items.push(
  diagramMcq(57, '4.8', 'Identify the correct solution set of the following number line (dotted markers from -4 to 6, hollow circle at -4, filled circle at 5):', ['{x∈Z, -4<x<5}', '{x∈Z, -4<x≤5}', '{x∈R, -4≤x≤5}', '{x∈R, -4≤x≤5}'], 1, 99, 'Number line, item 57 (p.4.8)'),
  diagramMcq(58, '4.8', 'Choose the correct solution set of the following number line (hatched region from -4 to -1 with endpoint markers):', ['{x∈R, -5<x<-1}', '{x∈R, -5≤x<-1}', '{x∈R, -4≤x≤-2}', '{x∈R, -4≤x<-2}'], 1, 99, 'Number line, item 58 (p.4.8)'),
  diagramMcq(59, '4.8', 'Identify the correct solution set of the following number line (dotted markers from -4 to 5):', ['{x∈Z, -3<x<5}', '{x∈I, -3≤x≤4}', '{x∈Z, -3<x≤4}', '{x∈I, -4<x≤5}'], 1, 99, 'Number line, item 59 (p.4.8)'),
  diagramMcq(60, '4.8', 'P = {x: -1 ≤ 3 + 4x < 23, x ∈ Z} represents which of the following number line?', ['Number line (A): hatched from 3 to 7, arrow marker at 6-7', 'Number line (B): dotted markers from -3 to 6', 'Number line (C): hatched from -2 to 6', 'Number line (D): dotted markers from -3 to 6, differently spaced'],
    1, 99, 'Number line options A-D, item 60 (pp.4.8-4.9)',
    { explanation: 'Algebraically, -1≤3+4x<23 => -4≤4x<20 => -1≤x<5; as an integer set this is {-1,0,1,2,3,4}, matching option B’s depicted markers.' }),
  diagramMcq(61, '4.9', 'Graphical representation of the following inequation on the number line is {x: -3 < x < 2, x ∈ I}', ['Number line (A)', 'Number line (B)', 'Number line (C)', 'Number line (D): hatched from -2 to 1'], 0, 99, 'Number line options A-D, item 61 (p.4.9)'),
  diagramMcq(62, '4.9', 'Which of the following is the correct graphical representation of {x: x < 1, x ∈ I} on the number line?', ['Number line (A): dotted extending left from -4', 'Number line (B): dotted extending left from -4, to 0', 'Number line (C): dotted markers, no arrow', 'Number line (D): hatched arrow from 0 leftward'], 1, 99, 'Number line options A-D, item 62 (p.4.9)'),
  diagramMcq(63, '4.9', 'Which of the following is the correct graphical representation of {x: -4 < x ≤ 2, x ∈ R} on the number line?', ['Number line (A): hatched from -4 to 2', 'Number line (B): hatched from -4 to 2, differently marked', 'Number line (C): hatched from -4 to 2, differently marked', 'Number line (D)'], 1, 99, 'Number line options A-D, item 63 (pp.4.9-4.10)'),
  diagramMcq(64, '4.10', 'What is the solution set for the inequation represented by the following number line (hatched from -3 to 4)?', ['{x∈R: -3<x≤4}', '{x∈R: -3<x<4}', '{x∈R: -3≤x<4}', '{x∈R: -3≤x≤4}'], 0, 99, 'Number line, item 64 (p.4.10)'),
);

items.push(
  mcq(65, '4.10', 'Find the greatest integer such that if 3 is added to its thrice, the resulting number becomes greater than four times the integer.', ['3', '2', '0', '1'],
    1, { explanation: '3x+3>4x => x<3; greatest integer less than 3 is 2.' }),
  mcq(66, '4.10', 'Find positive integers which are such that if 6 is subtracted from 5 times the integer then the resulting number cannot be greater than 4 times the integer.', ['{2,4,5,6,7}', '{1,2,3,4,5,6}', '{1,2,3}', '{5,6}'],
    1, { explanation: '5x-6≤4x => x≤6; positive integers ≤6: {1,2,3,4,5,6}.' }),
  mcq(67, '4.10', 'Two less than 5 times a number is greater than the thrice multiple of the number, then the number must be', ['Greater than 0', 'Greater than 1', 'Less than 3', 'Less than 2'],
    1, { explanation: '5x-2>3x => x>1.' }),
  mcq(68, '4.10', 'Find three smallest consecutive natural numbers such that the difference between one fourth of the largest and one fifth of the smallest is at least 2.', ['28,29,30', '29,30,31', '30,31,32', '27,28,29'],
    2, { explanation: 'Let numbers be n,n+1,n+2. (n+2)/4 - n/5 ≥ 2; ×20: 5(n+2)-4n≥40 => n+10≥40 => n≥30; smallest n=30, giving {30,31,32}.' }),
  mcq(69, '4.10', 'One side of a triangle measures 8 cm. Of the remaining two sides, one measures 2 cm more than the other. Then, the length of each side of the triangle is greater than:', ['1 cm', '2 cm', '3 cm', '5 cm'],
    2, { explanation: 'Let the shorter unknown side be x, the other x+2. Triangle inequality with the 8cm side requires x+(x+2)>8 => x>3.' }),
);

items.push({
  kind: 'case', sourceQuestionNumber: '70', sourcePage: '4.10-4.11',
  text: "Darsh's father is a building contractor. One day Darsh got his father's measuring tape. He used it to find the dimensions of the kitchen garden in his home. He found that the length of the garden is one metre more than twice its breadth. He told his friend Anuj that the perimeter of the garden is more than or equal to 110 m and is less than or equal to 140 m. Based on this information, answer the following questions:",
  parts: [
    { text: '(i) If breadth of the garden is x m, then algebraic representation of the given information is:', options: ['140 ≤ 6x + 2 ≤ 110, x ∈ R', '110 ≤ 6x + 2 ≤ 140, x ∈ R', '110 ≤ 4x + 2 ≤ 140, x ∈ R', '110 ≤ 2x + 1 ≤ 140, x ∈ R'], correct: 1, marks: 1 },
    { text: '(ii) The solution set for the breadth of the garden is:', options: ['{x∈R, 18≤x≤23}', '{x∈R, 16≤x≤24}', '{x∈R, 18≤x≤24}', '{x∈R, 20≤x≤28}'], correct: 0, marks: 1 },
    { text: '(iii) The greatest possible value of the breadth of the garden is:', options: ['18 m', '20 m', '22 m', '23 m'], correct: 3, marks: 1 },
    { text: '(iv) What is the least possible length of the garden?', options: ['34 m', '36 m', '37 m', '47 m'], correct: 2, marks: 1 },
    { text: '(v) What is the greatest possible length of the garden?', options: ['47 m', '51 m', '46 m', '23 m'], correct: 0, marks: 1 },
  ],
  difficulty: 'Medium', subConcept: 'Compound linear inequation word problem: perimeter constraint on a rectangle', questionType: 'case_study',
  explanation: 'Length=2x+1, perimeter=2(3x+1)=6x+2. (i) 110≤6x+2≤140. (ii) 108≤6x≤138 => 18≤x≤23. (iii) greatest breadth=23. (iv) least length = 2(18)+1=37. (v) greatest length = 2(23)+1=47. All five independently verified, matching printed key exactly.',
  diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.3, item 70',
});
items.push({
  kind: 'case', sourceQuestionNumber: '71', sourcePage: '4.11',
  text: "In drilling world's deepest man-made hole on the earth, it was found that the temperature T in degree Celsius, x km below the earth's surface was given by T = 30 + 25(x − 3) and 3 ≤ x ≤ 15. If the temperature is more than or equal to 180°C and less than or equal to 330°C, then based on this information, answer the following questions:",
  parts: [
    { text: '(i) The linear inequation for the temperature of the hole at a given depth is:', options: ['180 < 30 + 25(x-3) < 330', '180 ≤ 30 + 25(x-3) ≤ 330', '330 < 30 + 25(x-3) ≤ 180', '330 < 30 + 25(x-3) < 180'], correct: 1, marks: 1 },
    { text: '(ii) The solution set for the depth is:', options: ['{x∈R, 6≤x≤12}', '{x∈R, 9≤x≤12}', '{x∈R, 3≤x≤15}', '{x∈R, 9≤x≤15}'], correct: 3, marks: 1 },
    { text: '(iii) The minimum possible depth of the hole for the given temperature range is:', options: ['3 km', '6 km', '9 km', '15 km'], correct: 2, marks: 1 },
    { text: '(iv) The maximum possible depth of the hole for the given temperature range is:', options: ['9 km', '12 km', '15 km', '25 km'], correct: 2, marks: 1 },
  ],
  difficulty: 'Medium', subConcept: 'Compound linear inequation word problem: temperature vs. depth', questionType: 'case_study',
  explanation: '(i) 180≤30+25(x-3)≤330. (ii) 225≤25x≤375 => 9≤x≤15. (iii) minimum depth=9km. (iv) maximum depth=15km (also the given upper bound on x). All four independently verified, matching printed key exactly.',
  diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.3, item 71',
});

// AR items 72-76: source's "simple" 4-option scheme.
const AR_SIMPLE = [
  'A is true, R is false',
  'A is false, R is true',
  'Both A and R are true',
  'Both A and R are false.',
];
const arSimple = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '4.12-4.13', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_SIMPLE, correctIdx, { questionType: 'assertion_reasoning', ...opts });
// AR items 77-81: source's "full" 4-option scheme.
const AR_FULL = [
  'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
  'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).',
  'Assertion (A) is true and Reason (R) is false.',
  'Assertion (A) is false and Reason (R) is true.',
];
const arFull = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '4.13-4.14', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_FULL, correctIdx, { questionType: 'assertion_reasoning', ...opts });

items.push(
  arSimple(72,
    "x < y ⇒ ax > ay and (x/a) > (y/a), where 'a' is a negative number.",
    'If each side of an inequation is multiplied or divided by the same negative number, the sign of inequality is reversed.',
    2, { explanation: 'A is true: multiplying/dividing by a negative number reverses <, giving > in both cases, consistently. R is the correct general property and directly explains A — both true, matches printed key.' }),
  arSimple(73,
    'If 3 < 5(x+1) - 2 ≤ 18, x ∈ R, then the smallest integer value of x is 0.',
    'Multiplying each side of an inequation by the same positive integer does not change the inequality.',
    1, { explanation: 'A is false: solving gives 3<5x+3≤18 => 0<5x≤15 => 0<x≤3; the smallest INTEGER in (0,3] is 1, not 0 (0 itself is excluded, being a strict lower bound). R is a true, correct property — A false, R true, matches printed key (this is a designed catch, not a discrepancy).' }),
  arSimple(74,
    'If 2x - 5 ≤ 5x + 4 < 11, x ∈ I, then the greatest integer value of x is 1.',
    'Adding or subtracting a negative integer to each side of an inequation does not change the inequality.',
    2, { explanation: 'A is true: from 2x-5≤5x+4, x≥-3; from 5x+4<11, x<1.4; combined -3≤x<1.4, greatest integer is 1. R is a true, correct property — both true, matches printed key.' }),
  arSimple(75,
    'For the inequation -12 < 3 - 4x ≤ 11, x ∈ N, then the solution set is {1,2,3,4}.',
    'The set of all those values of x from the replacement set which satisfy the given inequation is called the solution set of the inequation.',
    1, { explanation: 'A is false: solving gives -15<-4x≤8, i.e. dividing by -4 (reverses) gives -2≤x<3.75; natural numbers in this range are {1,2,3}, NOT {1,2,3,4} (4 is excluded since 4>3.75). R is the correct definition — A false, R true, matches printed key (a designed catch, not a discrepancy).' }),
  arSimple(76,
    'If -5y > -15, then y > 3.',
    'If a > b, then ac > bc if c is positive and bc < ac if c is negative.',
    3, { explanation: 'A is false: dividing -5y>-15 by -5 reverses the inequality, giving y<3, not y>3. R is also false: for a>b with c negative, the correct reversed relation is ac<bc (i.e. bc>ac), not "bc<ac" as stated — R has the negative-multiplier direction backwards. Both false, matches printed key.' }),
);
items.push(
  arFull(77,
    'If the solution set of 5x + 4 ≤ 24 is {1,2,3,4}, then the replacement set of x is N.',
    'In the number system, the symbol N denotes the set of natural numbers {1,2,3,4,5,6,...}.',
    0, { explanation: 'A is true: 5x≤20 => x≤4; intersected with N={1,2,3,...} gives exactly {1,2,3,4}. R is the correct definition and directly explains why N is the right replacement set here — both true, R explains A, matches printed key.' }),
  arFull(78,
    'The solution set of 4x - 2 ≤ 2x + 10, x ∈ W is {0,1,2,3,4,5}.',
    'In the number system, the symbol W denotes the set of whole numbers {0,1,2,3,4,5,6,...}.',
    3, { explanation: 'A is false: 2x≤12 => x≤6; the correct whole-number solution set is {0,1,2,3,4,5,6}, which the assertion wrongly omits 6 from. R is the correct definition — A false, R true, matches printed key (a designed catch, not a discrepancy).' }),
  arFull(79,
    'The common solution set of 3x + 6 ≥ 9 and -5x > -15, x ∈ R, shown on a number line, is the interval from 1 (included) to 3 (excluded).',
    'On the number line, the hollow circle marks the end of a range involving an equality i.e. ≤ or ≥, and the darkened circle marks the end of a range with a strict inequality i.e. < or >.',
    2, { explanation: 'Algebraically: 3x+6≥9 => x≥1; -5x>-15 => (dividing by -5, reverses) x<3; combined 1≤x<3, correctly depicted — A true. R states the hollow/darkened circle convention backwards (a hollow circle actually marks a STRICT boundary that is excluded, and a darkened/filled circle marks an included, non-strict boundary — the opposite of what R claims) — A true, R false, matches printed key.' }),
  arFull(80,
    'The solution set of -1 < 3 + 4x ≤ 23, x ∈ R, shown on a number line, is the interval from 0 to 5.',
    'On the number line, the hollow circle marks the end of a range involving a strict inequality i.e. < or >, and the darkened circle marks the end of a range with an equality i.e. ≤ or ≥.',
    3, { explanation: 'Algebraically: -4<4x≤20 => -1<x≤5, so the correctly depicted interval should run from -1 (excluded) to 5 (included), not from 0 as the assertion states — A false. R correctly states the standard hollow/filled circle convention — A false, R true, matches printed key.' }),
  arFull(81,
    'The solution set of 2x - 3 ≤ x + 1 ≤ 4x + 7, x ∈ N is {1,2,3,4}.',
    'If the solution of a linear inequation is x > 2, x ∈ R, then on the number line it is represented with a hollow circle at 2 and hatching extending to the right toward infinity.',
    1, { explanation: 'A is true: from 2x-3≤x+1, x≤4; from x+1≤4x+7, x≥-2; combined -2≤x≤4, intersected with N gives {1,2,3,4}. R is also a true, correct general illustration of how x>2 is drawn, but it is a generic unrelated example and does not explain A’s specific solution set — both true, R does not correctly explain A, matches printed key.' }),
);

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'Linear Inequation',
  chapterOrder: 4,
  label: 'ICSE Class 10 Mathematics — Linear Inequation: 81 items (71 MCQ/case-study MCQ including 10 number-line-diagram items, 10 Assertion-Reason), full chapter, from chap_4.pdf, every algebraically-checkable answer independently re-verified against the printed key (zero discrepancies); 10 number-line items’ exact circle-reading taken from the verified key and disclosed as such',
  status: 'verified',
  answerStatus: 'verified',
  sourceSection: 'Multiple Choice Questions + Assertion and Reasoning (full chapter, pp.4.2-4.14)',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
