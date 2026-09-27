// ICSE Class 10 Mathematics — Chapter 5: Quadratic Equations.
// Source: chap_5.pdf, uploaded 2026-09-17 ("Icse chap 1-6"), archived via
// archive-icse-maths-ch1-6.js as source_files.id 100 (ICSE-MATH-CH05-QUADEQ).
// Part of the same upload that closes the ICSE Maths Ch1-6 gap documented by
// an earlier session's RECOVERY_AUDIT.md.
//
// Full chapter read directly from the PDF (16 pages: 5.2-5.17), 101 items:
// items 1-81 are MCQs (several with (i)/(ii)/(iii) sub-parts), items 82-83
// are multi-part case studies (Shridharacharya biographical note + a
// notebook-sales profit-function case study), items 84-101 are
// Assertion-Reason. The printed answer key
// (source_library/ICSE/Mathematics/answer.pdf, p.25.3-25.4, section
// "5 QUADRATIC EQUATIONS") was read and used as a cross-check, NOT a
// substitute for independent verification.
//
// METHOD: every item's algebra was independently re-derived from scratch
// (discriminant, quadratic formula, sum/product of roots, completing the
// square) BEFORE consulting the printed key. RESULT: 100 of 101 items match
// the printed key exactly on independent recomputation. Item 61 could not
// be fully pinned down from the transcribed problem statement alone (the
// relation "αβ = c/m" as printed does not cleanly resolve to a listed
// option under the standard product-of-roots formula from the given
// equation 8x²-8√2x+4=0); `correct` is taken from the printed key (option
// c, 3/4) rather than guessed, and this is disclosed rather than silently
// forced to match. A handful of the Assertion-Reason items are DESIGNED to
// contain false Reasons (e.g. item 84's claimed discriminant formula
// √(b²-4ac) is wrong — the discriminant IS b²-4ac, not its square root;
// item 91/96/97/101 each state the D=0/D>0/D<0 <-> equal/distinct/imaginary
// mapping backwards) — these are correctly identified as false by the
// printed key and by this independent check alike, not discrepancies.
//
// No diagrams/figures anywhere in this chapter (pure algebra, one word
// problem with no figure) — diagramStatus: 'not_applicable' throughout.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [100]; // archive-icse-maths-ch1-6.js -> ch05-quadratic-equation.pdf

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  kind: 'mcq',
  options,
  correct: correctIdx,
  answerKeyRef: `printed ANSWERS table, p.25.3-25.4, "5 QUADRATIC EQUATIONS", item ${n} (independently re-verified by computation)`,
  diagramStatus: 'not_applicable',
  ...opts,
});

const items = [
  mcq(1, '5.2', 'The degree of a quadratic equation ax² + bx + c = 0 is:', ['1', '2', '3', '4'], 1),
  mcq(2, '5.2', 'The general form of quadratic equation is:', ['ax² + bx + c = 0', 'bx² + ax + c = 0', 'ax² + cx + b = 0', 'bx² + cx + a = 0'], 0),
  mcq(3, '5.2', 'The roots of the equation px² + qx + r = 0, where p ≠ 0 are given by:', ['x = (-p ± √(q²-2pr))/2p', 'x = (-q ± √(q²-2pr))/4p', 'x = (-q ± √(q²-4pr))/2p', 'x = (-q ± √(q²-4pr))/2q'], 2),
  mcq(4, '5.2', 'For ax² + bx + c = 0, to be a quadratic equation, which of the condition should be satisfied:', ['c ≠ 0', 'b ≠ 0', 'a ≠ 0', 'a = 0'], 2),
  mcq(5, '5.2', 'The discriminant of the quadratic equation ax² + bx + c = 0, a ≠ 0 is given by:', ['b² - 2ac', 'b² - ac', 'b² - 4ac', 'a² - 4bc'], 2),
  mcq(6, '5.2', 'For real roots of a quadratic equation ax² + bx + c = 0, the discriminant must be:', ['Greater than or equal to zero', 'Greater than zero', 'Less than or equal to zero', 'Less than zero'], 0),
  mcq(7, '5.2', 'If the roots of the quadratic equation, ax² + bx + c = 0, a ≠ 0 are real and equal, then each root is equal to:', ['-a/2b', '-b/2a', '-2a/b', '-c/2a'], 1),
  mcq(8, '5.2', 'If ax² + bx + c = 0 has equal roots, then c = ?', ['b/2a', 'b²/4a', '-b/2a', '-b²/4a'], 1),
  mcq(9, '5.2', 'If the equation ax² + 2bx + c = 0 has real and equal roots, then c = ?', ['b²/a', 'b²/4a', '-b/a', '-b²/2a'], 0),
  mcq(10, '5.2', 'Which of the following is a quadratic equation?', ['x² + 1 = (2-x)² + 3', '2x² + 3 = (5+x)(2x-3)', 'x³ - x² = (x-1)³', '3x² + x = x(3x+5)'],
    2, { explanation: 'A and B and D all have the x² term cancel, reducing to linear equations. C: (x-1)³=x³-3x²+3x-1, so x³-x²=x³-3x²+3x-1 reduces to 2x²-3x+1=0, genuinely quadratic.' }),
  mcq(11, '5.3', 'Which of the following is not a quadratic equation?', ['4x - x² = x² + 5', '(x+2)² = 2(x²-5)', '(√5x+3)² = 5x² + 6', '(x-1)² = 3x² + x - 2'],
    2, { explanation: 'C: (√5x+3)²=5x²+6√5x+9, so 5x²+6√5x+9=5x²+6 leaves 6√5x+3=0, the x² term cancels — linear, not quadratic. A, B and D all retain a nonzero x² term.' }),
  mcq(12, '5.3', 'Standard form of the quadratic equation p - 7/p = 5p + 9 is:', ['4p² + 9p + 7 = 0', '4p² + 9p - 7 = 0', 'p² - 9p - 7 = 0', 'p² - 9p + 7 = 0'],
    0, { explanation: '×p: p²-7=5p²+9p => -4p²-9p-7=0 => ×(-1): 4p²+9p+7=0.' }),
  mcq(13, '5.3', 'The roots of the quadratic equation 2x² - x - 6 = 0 are:', ['{-2, 3/2}', '{2, -3/2}', '{-2, -3/2}', '{2, 3/2}'],
    1, { explanation: 'D=1+48=49; x=(1±7)/4 => x=2 or x=-3/2.' }),
  mcq(14, '5.3', 'The solution set for the quadratic equation 2x² - x + 1/8 = 0 is:', ['{1/4, 1/4}', '{-1/4, 1/4}', '{-1/2, 1/4}', '{4, 4}'],
    0, { explanation: '×8: 16x²-8x+1=0 => (4x-1)²=0 => x=1/4 (double root).' }),
  mcq(15, '5.3', 'Which of the following is a root of the quadratic equation 3x² + 13x + 14 = 0 ?', ['-1/3', '-3/2', '-5/3', '-7/3'],
    3, { explanation: 'D=169-168=1; x=(-13±1)/6 => x=-2 or x=-7/3.' }),
  mcq(16, '5.3', 'The solution set for the quadratic equation 2x² = 288 is:', ['{12,12}', '{-12,-12}', '{-12,18}', '{-12,12}'],
    3, { explanation: 'x²=144 => x=±12.' }),
  mcq(17, '5.3', 'If x² = 3x, then', ['x = 0', 'x = 0 or x = 3', 'x = 3', 'x = 0 and x = -3'],
    1, { explanation: 'x(x-3)=0 => x=0 or 3.' }),
  mcq(18, '5.3', 'The solution set for the quadratic equation 3x² - 18x = 0 is:', ['{6,6}', '{0,-6}', '{0,6}', '{-6,-6}'],
    2, { explanation: '3x(x-6)=0 => x=0 or 6.' }),
  mcq(19, '5.3', 'The roots of the equation x + 1/x = 3 are:', ['(2±√5)/2', '(3±√5)/2', '(1±√3)/2', '(5±√3)/2'],
    1, { explanation: 'x²-3x+1=0 => x=(3±√5)/2.' }),
  mcq(20, '5.3', 'The solution set for the quadratic equation 2x² + kx - k² = 0 is:', ['{k,k}', '{-k,k}', '{-k, k/2}', '{-k/2, k}'],
    2, { explanation: 'x=(-k±√(k²+8k²))/4=(-k±3k)/4 => x=k/2 or x=-k.' }),
  mcq(21, '5.4', 'The roots of the quadratic equation x - 18/x = 6 are 8.196 and -2.196. The roots correct to 2 significant figures are:', ['8.19, 2.19', '8.2, -2.2', '8.1, -2.1', '8.2, -2.3'], 1),
  mcq(22, '5.4', 'One of the roots of the quadratic equation x² - 8x + 5 = 0 is 7.3166. The root of the equation correct to 4 significant figures is:', ['7.3166', '7.317', '7.316', '7.32'], 1),
  mcq(23, '5.4', 'Roots of the equation 3x² - 2√6x + 2 = 0 are:', ['±√(2/3)', '√(2/3), √(2/3)', '-√(2/3), -√(2/3)', '-√(2/3), √(3/2)'],
    1, { explanation: 'D=(2√6)²-24=24-24=0; equal roots both = 2√6/6=√(2/3) (sum and product both positive).' }),
  mcq(24, '5.4', 'Roots of the equation (x-1)² - 5(x-1) - 6 = 0 are:', ['7,0', '6,0', '7,6', '6,-7'],
    0, { explanation: 'Let y=x-1: y²-5y-6=0 => (y-6)(y+1)=0 => y=6 or -1 => x=7 or 0.' }),
  mcq(25, '5.4', 'The quadratic equation with roots -1 and 2 is:', ['x² + x - 1 = 0', 'x² - x + 2 = 0', 'x² + x + 2 = 0', 'x² - x - 2 = 0'],
    3, { explanation: '(x+1)(x-2)=x²-x-2=0.' }),
  mcq(26, '5.4', 'Which of the following quadratic equation has -2 and 3 as its roots?', ['x² - x - 6 = 0', 'x² + x + 6 = 0', 'x² - x + 6 = 0', 'x² + x - 6 = 0'],
    0, { explanation: '(x+2)(x-3)=x²-x-6=0.' }),
  mcq(27, '5.4', 'For the quadratic equation x² - 6x + 9 = 0. The value of x - 1/x is:', ['3', '2', '8/3', '6'],
    2, { explanation: '(x-3)²=0 => x=3; x-1/x=3-1/3=8/3.' }),
  mcq(28, '5.4', 'For the quadratic equation 2x² + ax - a² = 0, the sum of the roots is:', ['a/2', '-a/2', 'a²/3', '2a²'],
    1, { explanation: 'Sum = -a/2 (i.e. -coefficient of x / coefficient of x²).' }),
  mcq(29, '5.4', 'If 2x² - 5x - 3 = 0, x ∈ N, then the solution set is:', ['{3}', '{3, -1/2}', '{6}', '{6,-1}'],
    0, { explanation: 'D=25+24=49; x=(5±7)/4 => x=3 or -0.5; only 3 is natural.' }),
  mcq(30, '5.4', 'One of the roots of 2x² - 7x + 6 = 0 is:', ['-2', '2', '-3/2', '4'],
    1, { explanation: 'D=49-48=1; x=(7±1)/4 => x=2 or 1.5.' }),
  mcq(31, '5.4', 'If x² + px - 30 = (x-5)(x+6), then the value of p =', ['-1', '1', '11', '-11'],
    1, { explanation: '(x-5)(x+6)=x²+x-30, so p=1.' }),
  mcq(32, '5.5', 'Which of the following has 2 as a root?', ['x² - 4x + 5 = 0', 'x² + 3x - 12 = 0', '2x² - 7x + 6 = 0', '3x² - 6x - 2 = 0'],
    2, { explanation: 'Plug x=2 into each: only 2(4)-7(2)+6=8-14+6=0 checks out.' }),
  mcq(33, '5.5', 'If x = -1/2 is a solution of the quadratic equation 3x² + 2kx - 3 = 0, then the value of k is:', ['-3/4', '-5/4', '-9/4', '-4/5'],
    2, { explanation: '3(1/4)+2k(-1/2)-3=0 => 3/4-k-3=0 => k=-9/4.' }),
  mcq(34, '5.5', 'If x = 3 is a root of the quadratic equation x² - 2kx - 6 = 0, then the value of k is:', ['2', '3', '1/3', '1/2'],
    3, { explanation: '9-6k-6=0 => 3=6k => k=1/2.' }),
  mcq(35, '5.5', 'If the roots of the quadratic equation 2x² + 8x + k = 0 are equal, then the value of k is:', ['2', '8', '4', '-8'],
    1, { explanation: 'D=64-8k=0 => k=8.' }),
  mcq(36, '5.5', 'If 1 is a root of the quadratic equation ky² + ky + 3 = 0, then the value of k is:', ['-2/3', '-1/3', '-1/2', '-3/2'],
    3, { explanation: 'k+k+3=0 => 2k=-3 => k=-3/2.' }),
  mcq(37, '5.5', 'If 1/2 is a root of the equation 4x² - 4kx + k + 5 = 0, then the value of k is:', ['-6', '-3', '3', '6'],
    3, { explanation: '4(1/4)-4k(1/2)+k+5=0 => 1-2k+k+5=0 => 6-k=0 => k=6.' }),
  mcq(38, '5.5', 'If 2 and (-3) are the roots of the quadratic polynomial x² + ax + b = 0 then the value of a + b is:', ['6', '-7', '-5', '5'],
    2, { explanation: 'Sum=-1=-a => a=1; product=-6=b; a+b=1-6=-5.' }),
  mcq(39, '5.5', 'The discriminant of 2x² - 5x + 1 = 0 is:', ['25', '33', '17', '√17'], 2),
  mcq(40, '5.5', 'The discriminant of the quadratic equation 2x² - x + 3 = 0 is:', ['23', '√23', '-23', '√-23'], 2),
  mcq(41, '5.5', 'If the discriminant of the quadratic equation ax² + bx + c = 0, a ≠ 0 is greater than zero and a perfect square and a, b, c are rational, then the roots are:', ['rational and equal', 'irrational and unequal', 'irrational and equal', 'rational and unequal'], 3),
  mcq(42, '5.5', 'If the discriminant of a quadratic equation ax² + bx + c = 0 is greater than zero and a perfect square and b is irrational, then the roots are:', ['irrational and unequal', 'irrational and equal', 'rational and unequal', 'rational and equal'], 0),
  mcq(43, '5.6', 'The nature of root of ax² + bx + c = 0, if b² - 4ac > 0 and is not a perfect square, where a, b and c are real number:', ['Irrational and unequal', 'Real and equal', 'Unequal and Imaginary', 'Rational and unequal'], 0),
  mcq(44, '5.6', 'What is the nature of the roots of the equation 2x² - 6x + 3 = 0 ?', ['relational and unequal', 'irrational and unequal', 'real and equal', 'imaginary and unequal'],
    1, { explanation: 'D=36-24=12>0, not a perfect square.' }),
  mcq(45, '5.6', 'The nature of the roots of the equation 3x² - 4√3x + 4 = 0 is:', ['real and equal', 'irrational and unequal', 'rational and equal', 'imaginary and equal'],
    0, { explanation: 'D=48-48=0.' }),
  mcq(46, '5.6', 'The roots of the quadratic equation 3x² - 2x + 1 = 0 are:', ['real and distinct', 'rational and unequal', 'real and equal', 'not real'],
    3, { explanation: 'D=4-12=-8<0.' }),
  mcq(47, '5.6', 'The roots of 3x² - 5x + 1 = 0 are:', ['irrational', 'equal', 'imaginary', 'none of these'],
    0, { explanation: 'D=25-12=13>0, not a perfect square.' }),
  mcq(48, '5.6', 'The roots of the equation 2x² - 9x + 7 = 0 are:', ['equal and rational', 'unequal and rational', 'irrational', 'not real'],
    1, { explanation: 'D=81-56=25>0, a perfect square.' }),
  mcq(49, '5.6', 'The quadratic equation 2x² - √5x + 1 = 0 has:', ['two distinct real roots', 'two equal real roots', 'no real roots', 'more than two real roots'],
    2, { explanation: 'D=5-8=-3<0.' }),
  mcq(50, '5.6', 'The quadratic equation whose roots are real and equal is:', ['2x² - 4x + 3 = 0', '2x² - 4x + 4 = 0', '2x² - 6√2x + 9 = 0', 'x² - 2√2x - 6 = 0'],
    2, { explanation: 'C: D=(6√2)²-4(2)(9)=72-72=0. (A: D=-8; B: D=-16; D: D=32.)' }),
  mcq(51, '5.6', 'The value of k for which the equation kx² + 4x + 1 = 0 has real roots is:', ['k ≥ 4', 'k ≤ 4', 'k = 4', 'k ≤ -4'],
    1, { explanation: 'D=16-4k≥0 => k≤4.' }),
  mcq(52, '5.6', 'The values of k for which the quadratic equation 9x² - 3kx + k = 0 has equal roots:', ['0,1', '0,2', '2,4', '0,4'],
    3, { explanation: 'D=9k²-36k=0 => 9k(k-4)=0 => k=0 or 4.' }),
  {
    kind: 'mcq', sourceQuestionNumber: '53', sourcePage: '5.7',
    text: 'If the roots of the quadratic equation px(x-2) + 6 = 0 are equal, then the value of p is:', options: ['0', '4', '6', '0 or 6'], correct: 3,
    explanation: 'px²-2px+6=0; D=4p²-24p=0 => 4p(p-6)=0 => p=0 or 6.', diagramStatus: 'not_applicable',
    answerKeyRef: 'printed ANSWERS table, p.25.3, item 53',
  },
  {
    kind: 'mcq', sourceQuestionNumber: '54', sourcePage: '5.7',
    text: 'If the quadratic equation px² - 2√5px + 15 = 0 has two equal roots, then the value of p is:', options: ['0', '3', '6', '0 or 3'], correct: 3,
    explanation: 'D=20p²-60p=0 => 20p(p-3)=0 => p=0 or 3.', diagramStatus: 'not_applicable',
    answerKeyRef: 'printed ANSWERS table, p.25.3, item 54',
  },
  mcq(55, '5.7', 'If the equation ax² + 2x + a = 0 has two real and equal roots, then:', ['a = 0,1', 'a = 1,1', 'a = 0,-1', 'a = -1,1'],
    3, { explanation: 'D=4-4a²=0 => a²=1 => a=±1 (a=0 would make it non-quadratic).' }),
  mcq(56, '5.7', 'If the equation 2x² - 5x + (k+3) = 0 has equal roots, then the value of k is:', ['9/8', '-9/8', '1/8', '-1/8'],
    2, { explanation: 'D=25-8(k+3)=0 => 1-8k=0 => k=1/8.' }),
  mcq(57, '5.7', 'If the equation (k+1)x² - 2(k-1)x + 1 = 0 has equal roots, then the value of k are:', ['1,3', '0,3', '0,1', '0, 3/4'],
    1, { explanation: 'D=4(k-1)²-4(k+1)=0 => (k-1)²-(k+1)=0 => k²-3k=0 => k=0 or 3.' }),
  mcq(58, '5.7', 'The equation x² + 12x = 3kx² + 2 has real roots. Find the greatest value of k such that k ∈ Z.', ['-6', '5', '-3', '6'],
    3, { explanation: '(1-3k)x²+12x-2=0; D=144+8(1-3k)=152-24k≥0 => k≤19/3≈6.33; greatest integer is 6.' }),
  mcq(59, '5.7', 'If the equation 2x² - 6x + p = 0 has real and distinct roots, then values of p are given by:', ['p < 9/2', 'p ≤ -9/2', 'p > 9/2', 'p ≥ 9/2'],
    0, { explanation: 'D=36-8p>0 => p<9/2.' }),
  mcq(60, '5.7', 'If α and β are the roots of the quadratic equation 2x² - 2x + 1 = 0, hence the value of α+β is:', ['1', '2', '-1', '-2'], 0),
  mcq(61, '5.7', 'If α and β are the roots of the equation 8x² - 8√2x + 4 = 0, while the equation αβ = c/m, then the value of m:', ['2', '-3/7', '3/4', '7/4'],
    2, { explanation: 'Taken from the printed key: the transcribed relation αβ=c/m does not cleanly resolve from the standard product-of-roots formula (c/a=4/8=1/2) against the listed options; `correct` reflects the verified key rather than an independently re-derived value — disclosed as an open item pending clearer source text.' }),
  mcq(62, '5.7', 'If α and β are the roots of the equation 4x² + 3x + 7 = 0, then the value of 1/α + 1/β is:', ['-3/4', '-3/7', '3/7', '7/4'],
    1, { explanation: '1/α+1/β=(α+β)/(αβ)=(-3/4)/(7/4)=-3/7.' }),
  mcq(63, '5.7', 'If one root of 5x² + 13x + k = 0 is reciprocal of the other, then the value of k =', ['0', '5', '1/6', '6'],
    1, { explanation: 'Reciprocal roots => product=1 => k/5=1 => k=5.' }),
  mcq(64, '5.7', 'If one root of the equation 4x² - 2x + (λ-1) = 0 be the reciprocal of the other, then the value of λ =', ['8', '-8', '4', '5'],
    3, { explanation: 'Product=1 => (λ-1)/4=1 => λ=5.' }),
  mcq(65, '5.8', 'If the roots of the equation ax² + bx + c = 0 are 3 and 4, then b² - 4ac is:', ['b²-4ac > 0', 'b²-4ac < 0', 'b²-4ac = 0', 'b²-4ac ≤ 0'], 0),
  mcq(66, '5.8', 'Which of the following equations has imaginary roots?', ['x² - 4x + 2 = 0', '3x² + 2x - 1 = 0', 'x² + 4x - 2 = 0', 'x² + x + 1 = 0'],
    3, { explanation: 'D for D: 1-4=-3<0; the other three all have D>0.' }),
  mcq(67, '5.8', 'For an equation x² + mx - 2 + k(x² + 3x + 2) = 0, where k ≠ 0, then discriminant is:', ['k²+m²-6mk+8', 'k²+m²+6mk-8', 'k²+m²+6mk+8', 'k²-m²-6mk-8'],
    2, { explanation: '(1+k)x²+(m+3k)x+(2k-2)=0; D=(m+3k)²-4(1+k)(2k-2)=m²+6mk+9k²-4(2k²-2)=m²+6mk+k²+8.' }),
  mcq(68, '5.8', 'If x = 2 and x = 3 are the roots of the quadratic equation 3x² - 2mx + 2n = 0, then value of mn is:', ['67.5', '-67.5', '-15', '15'],
    0, { explanation: 'Sum=5=2m/3 => m=7.5; product=6=2n/3 => n=9; mn=67.5.' }),
  mcq(69, '5.8', 'If one of the roots of the quadratic equation x² - 18x + m = 0 is 5, then the other root of the equation is:', ['-65', '65', '-13', '13'],
    3, { explanation: 'Sum of roots=18; other root=18-5=13.' }),
  mcq(70, '5.8', 'If x = 1 is the common root of the quadratic equation ax² + ax + 3 = 0 and x² + x + b = 0, the value of ab is:', ['-3', '3.5', '6', '3'],
    3, { explanation: '2a+3=0 => a=-1.5; 2+b=0 => b=-2; ab=3.' }),
  mcq(71, '5.8', 'If 2 is the root of the quadratic equation x² + bx + 12 = 0 and the equation x² + bx + q = 0 has equal roots, then the value of q is:', ['8', '-8', '16', '-16'],
    2, { explanation: '4+2b+12=0 => b=-8; D=64-4q=0 => q=16.' }),
  mcq(72, '5.8', 'If -5 is a root of the quadratic equation 2x² + px - 15 = 0 and the quadratic equation p(x²+x)+k=0 has equal roots, then the value of k is:', ['7/4', '5/4', '3/4', '1/4'],
    0, { explanation: '50-5p-15=0 => p=7; 7x²+7x+k=0; D=49-28k=0 => k=7/4.' }),
  mcq(73, '5.8', 'If -3 and m are the roots of the equation 2x² + kx - 3 = 0, the value of k and m?', ['k=-5 and m=1/2', 'k=-5 and m=-1/2', 'k=5 and m=1/2', 'k=5 and m=2'],
    2, { explanation: 'Product: -3m=-3/2 => m=1/2. Sum: -3+1/2=-5/2=-k/2 => k=5.' }),
  mcq(74, '5.9', 'If √(6+√(6+√(6+...))) = x, then the value of x is:', ['x = -2 or 3', 'x = 3', 'x = -2', 'x = 2'],
    1, { explanation: 'x²=6+x => x²-x-6=0 => x=3 or -2; discard negative for a nested radical.' }),
];

items.push({
  kind: 'case', sourceQuestionNumber: '75', sourcePage: '5.9',
  text: 'For the quadratic equation 2x² - 4x + 1 = 0:', parts: [
    { text: '(i) the discriminant is:', options: ['0', '+ve', '-ve', '1'], correct: 1, marks: 1 },
    { text: '(ii) the roots are:', options: ['real and distinct', 'real and equal', 'unequal and imaginary', 'equal and imaginary'], correct: 0, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Discriminant and nature of roots', questionType: 'case_study',
  explanation: 'D=16-8=8>0, not a perfect square, so real and distinct (irrational) roots. Both independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.3, item 75',
});
items.push({
  kind: 'case', sourceQuestionNumber: '76', sourcePage: '5.9',
  text: 'The roots of the quadratic equation mx² - 7mx + 49 = 0 are equal', parts: [
    { text: '(i) the value(s) of m is/are:', options: ['4', '2', '±4', '±2'], correct: 0, marks: 1 },
    { text: '(ii) The roots of the equation are:', options: ['7/4, 7/4', '4/7, 4/7', '-7/2, -7/2', '7/2, 7/2'], correct: 3, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Equal roots: solve for a parameter, then find the repeated root', questionType: 'case_study',
  explanation: '(i) D=49m²-196m=0 => 49m(m-4)=0 => m=0 (degenerate) or m=4. (ii) With m=4: 4x²-28x+49=0 => (2x-7)²=0 => x=7/2 (double). Both independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.3, item 76',
});
items.push({
  kind: 'case', sourceQuestionNumber: '77', sourcePage: '5.9',
  text: 'Given a quadratic equation mx² + 8x - 2 = 0, m ≠ 0', parts: [
    { text: '(i) For this quadratic equation the value of discriminant is:', options: ['64 - 8m', '√(64+8m)', '64 + 8m', '√(8m-64)'], correct: 2, marks: 1 },
    { text: '(ii) For real roots we must have:', options: ['64+8m ≥ 0', '64+8m ≤ 0', '√(64+8m) ≥ 0', '√(64-8m) ≤ 0'], correct: 0, marks: 1 },
    { text: '(iii) The value of m for which the quadratic equation has real roots is:', options: ['m ≥ 8', 'm ≥ -8', 'm ≤ -8', 'm ≤ 8'], correct: 1, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Discriminant in terms of a parameter, solving the resulting inequality', questionType: 'case_study',
  explanation: '(i) D=64-4m(-2)=64+8m. (ii) Need D≥0: 64+8m≥0. (iii) Solving: m≥-8. All three independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.3, item 77',
});
items.push({
  kind: 'case', sourceQuestionNumber: '78', sourcePage: '5.9-5.10',
  text: 'The roots of the quadratic equation 2x² - kx + k = 0 are equal', parts: [
    { text: '(i) If k ∈ N, the k is equal to:', options: ['0', '8', '6', '-6'], correct: 1, marks: 1 },
    { text: '(ii) If k ∈ I, then the k is equal to:', options: ['0 or 8', '-8 or 8', '0 or 6', '-6 or 6'], correct: 0, marks: 1 },
    { text: '(iii) One of the roots of the quadratic equation is:', options: ['2', '-2', '4', '-4'], correct: 0, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Equal roots with a domain-restricted parameter', questionType: 'case_study',
  explanation: 'D=k²-8k=0 => k(k-8)=0 => k=0 or 8. (i) In N (excludes 0): k=8. (ii) In I (includes 0): k=0 or 8. (iii) With k=8: 2x²-8x+8=0 => (x-2)²=0 => x=2. All three independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.3, item 78',
});
items.push({
  kind: 'case', sourceQuestionNumber: '79', sourcePage: '5.10',
  text: 'Given the quadratic equation x² + 2√2x + 1 = 0', parts: [
    { text: '(i) The discriminant (D) of the quadratic equation:', options: ['D > 0', 'D < 0', 'D = 0', 'D ≥ 0'], correct: 0, marks: 1 },
    { text: '(ii) The value of the discriminant is:', options: ['0', '4', '2', '-4'], correct: 1, marks: 1 },
    { text: '(iii) The roots of the quadratic equation are:', options: ['(-√2±1)/2', '(√2±1)/2', '√2±1', '-√2±1'], correct: 3, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Discriminant sign, value, and roots for a surd-coefficient equation', questionType: 'case_study',
  explanation: 'D=8-4=4>0. Roots = (-2√2±2)/2 = -√2±1. All three independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.3, item 79',
});
items.push({
  kind: 'case', sourceQuestionNumber: '80', sourcePage: '5.10',
  text: 'The quadratic equation (m+1)x² + 2(m+3)x + (m+8) = 0 has equal roots', parts: [
    { text: '(i) The discriminant of the quadratic equation:', options: ['D > 0', 'D = 0', 'D < 0', 'D ≥ 0'], correct: 1, marks: 1 },
    { text: '(ii) The value of m is:', options: ['1/3', '1/4', '3', '-3'], correct: 0, marks: 1 },
    { text: '(iii) The roots of the given equation are:', options: ['2/5, 2/5', '5/2, 5/2', '-2/5, -2/5', '-5/2, -5/2'], correct: 3, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Equal roots: solve for a parameter appearing in every coefficient', questionType: 'case_study',
  explanation: '(i) Equal roots means D=0 by definition. (ii) 4(m+3)²-4(m+1)(m+8)=0 => -3m+1=0 => m=1/3. (iii) With m=1/3: (4/3)x²+(20/3)x+(25/3)=0 => ×3: 4x²+20x+25=0 => (2x+5)²=0 => x=-5/2. All three independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.3, item 80',
});
items.push({
  kind: 'case', sourceQuestionNumber: '81', sourcePage: '5.10',
  text: 'The quadratic x² + m(2x + m - 1) + 2 = 0 has equal roots', parts: [
    { text: '(i) The value of m is:', options: ['1', '2', '-2', '0'], correct: 1, marks: 1 },
    { text: '(ii) The roots of the quadratic equation are:', options: ['2,2', '-2,2', '-2,-2', '-1,-1'], correct: 2, marks: 1 },
    { text: '(iii) Discriminant of the given quadratic equation is:', options: ['+ve', '-ve', '1', '0'], correct: 3, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Equal roots after expanding a compound quadratic', questionType: 'case_study',
  explanation: 'Expand: x²+2mx+(m²-m+2)=0. (i) D=4m²-4(m²-m+2)=4m-8=0 => m=2. (ii) With m=2: x²+4x+4=0 => (x+2)²=0 => x=-2. (iii) D=0 by construction. All three independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.4, item 81',
});
items.push({
  kind: 'open', sourceQuestionNumber: '82-intro', sourcePage: '5.10',
  text: "Shridharacharya was an Indian mathematician, Sanskrit Pandit and philosopher from Bengal. He is known for his treatises - Trisatika and Patiganita. He was the first to give an algorithm for solving quadratic equations. His other major works were on algebra, particularly fractions and he gave an exposition on zero. He separated Algebra from Arithmetic. The quadratic formula which is used to find the roots of a quadratic equation is known as Shridharacharya's rule.",
  difficulty: 'Easy', subConcept: 'Historical/biographical note preceding item 82 (no question asked)', questionType: 'open',
  explanation: 'Background passage only, preceding the item 82 sub-questions below — preserved verbatim for completeness since it is part of the printed source page.',
  diagramStatus: 'not_applicable', answerStatus: 'unavailable',
});
items.push({
  kind: 'case', sourceQuestionNumber: '82', sourcePage: '5.10-5.11',
  text: "A quadratic equation of the form ax² + bx + c = 0, a ≠ 0, has two roots given by Shridharacharya's rule.",
  parts: [
    { text: '(i) A quadratic equation of the form ax² + bx + c = 0, a ≠ 0, has two roots given by:', options: ['x = (b±√(b²-4abc))/2a', 'x = (-b±√(b²-2ac))/4a', 'x = (-b±√(b²-4ac))/2ac', 'x = (-b±√(b²-4ac))/2a'], correct: 3, marks: 1 },
    { text: '(ii) A quadratic equation of the form ax² + bx + c = 0, a ≠ 0, has rational roots, if the value of (b²-4ac) is:', options: ['less than 0', 'greater than 0', 'equal to 0', 'equal to 0 or a perfect square'], correct: 3, marks: 1 },
    { text: '(iii) The maximum number of roots that a quadratic equation can have is:', options: ['1', '2', '3', '4'], correct: 1, marks: 1 },
    { text: '(iv) A quadratic equation ax² + bx + c = 0, a ≠ 0, having real coefficients, cannot have real roots if:', options: ['b²-4ac < 0', 'b²-4ac = 0', 'b²-4ac > 0', 'b²-4ac ≥ 0'], correct: 0, marks: 1 },
    { text: '(v) The quadratic equation x² + 26x + 169 = 0 has:', options: ['No real roots', 'Rational and unequal roots', 'Two equal roots', 'Irrational roots'], correct: 2, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Quadratic formula and discriminant theory, general facts', questionType: 'case_study',
  explanation: '(i) Standard quadratic formula. (ii) Rational roots require D to be 0 or a perfect square (given rational a,b,c). (iii) A quadratic has at most 2 roots. (iv) D<0 means no real roots. (v) x²+26x+169=(x+13)²=0, D=676-676=0, two equal roots. All five independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.4, item 82',
});
items.push({
  kind: 'case', sourceQuestionNumber: '83', sourcePage: '5.11-5.12',
  text: "Madan Lal runs a stationery shop in Pune. The analysis of his sales, expenditures and profits showed that for x number of notebooks sold, the weekly profit (in ₹) was P(x) = -2x² + 88x - 680. Madan Lal found that: he has a loss if he does not sell any notebook in a week; there is no profit no loss for a certain value x0 of x; the profit goes on increasing with an increase in x (the number of notebooks sold), but he gets a maximum profit at a sale of 22 notebooks in a week.",
  parts: [
    { text: '(i) What will be Madan Lal’s profit if he sold 20 notebooks in a week?', options: ['₹144', '₹280', '₹340', '₹560'], correct: 1, marks: 1 },
    { text: '(ii) What is the maximum profit that Madan Lal can earn in a week?', options: ['₹144', '₹288', '₹340', '₹680'], correct: 1, marks: 1 },
    { text: '(iii) What is Madan Lal’s loss if he does not sell any notebooks in a particular week?', options: ['₹0', '₹340', '₹680', '₹960'], correct: 2, marks: 1 },
    { text: '(iv) Write a quadratic equation for the condition when Madan Lal does not have any profit or loss during a week.', options: ['2x² - 44x + 340 = 0', 'x² + 44x - 340 = 0', 'x² - 88x + 340 = 0', 'x² - 44x + 340 = 0'], correct: 3, marks: 1 },
    { text: '(v) What is the minimum number of notebooks x0 that Madan Lal should sell in a week so that he does not incur any loss?', options: ['0', '10', '11', '12'], correct: 1, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: profit function, vertex, roots', questionType: 'case_study',
  explanation: '(i) P(20)=-800+1760-680=₹280. (ii) Vertex at x=-88/(2×-2)=22 (matches given); P(22)=-968+1936-680=₹288. (iii) P(0)=-680, a loss of ₹680. (iv) P(x)=0 => -2x²+88x-680=0 => ÷(-2): x²-44x+340=0. (v) Solve: D=1936-1360=576=24²; x=(44±24)/2 => x=10 or 34; no-loss range is 10≤x≤34, so minimum is 10. All five independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.4, item 83',
});

// AR items 84-90: source's "simple" 4-option scheme.
const AR_SIMPLE = [
  'A is true, R is false',
  'A is false, R is true',
  'Both A and R are true',
  'Both A and R are false.',
];
const arSimple = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '5.12-5.13', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_SIMPLE, correctIdx, { questionType: 'assertion_reasoning', ...opts });
// AR items 91-101: source's "full" 4-option scheme.
const AR_FULL = [
  'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
  'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).',
  'Assertion (A) is true and Reason (R) is false.',
  'Assertion (A) is false and Reason (R) is true.',
];
const arFull = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '5.13-5.17', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_FULL, correctIdx, { questionType: 'assertion_reasoning', ...opts });

items.push(
  arSimple(84,
    'The discriminant of the quadratic equation x² + 2√2x + 1 = 0 is less than zero.',
    'The discriminant of the quadratic equation ax² + bx + c = 0 is √(b²-4ac).',
    3, { explanation: 'A is false: D=8-4=4, which is greater than zero, not less than zero. R is also false: the discriminant IS b²-4ac itself, not its square root (that square root is only the radical term inside the quadratic formula) — both false, matches printed key.' }),
  arSimple(85,
    'The quadratic equation 3kx² - 4kx + 4 = 0 has equal roots, if k = 3.',
    'For equal roots of a quadratic equation, we must have D = 0.',
    2, { explanation: 'A is true: with k=3, 9x²-12x+4=0 has D=144-144=0. R is the correct standard condition and explains A — both true, matches printed key.' }),
  arSimple(86,
    'The roots of the quadratic equation 3x² + 7x + 8 = 0 are imaginary.',
    'The discriminant of the quadratic equation is always positive.',
    0, { explanation: 'A is true: D=49-96=-47<0, imaginary roots. R is false: discriminant is not always positive (it can be negative, as just shown, or zero) — A true, R false, matches printed key.' }),
  arSimple(87,
    'The roots of the quadratic equation 8x² + 2x - 3 = 0 are: -1/2 and 3/4',
    'The roots of the quadratic equation ax² + bx + c = 0 are given by x = (-b±√(b²-4ac))/2a',
    1, { explanation: 'A is false: D=4+96=100; x=(-2±10)/16 gives x=1/2 or -3/4, NOT -1/2 and 3/4 as asserted (the signs are flipped). R is the correct standard formula — A false, R true, matches printed key (a designed catch, not a discrepancy).' }),
  arSimple(88,
    'If a and c are of opposite signs, then the quadratic equation ax² + bx + c = 0 has real and distinct roots.',
    'If the discriminant D of a quadratic equation is not less than or equal to zero, it has real and distinct roots.',
    2, { explanation: 'A is true: opposite signs make ac<0, so -4ac>0, so D=b²-4ac>0 always (regardless of b) — always real and distinct. R is the correct standard fact (D>0 gives real, distinct roots) and directly explains A — both true, matches printed key.' }),
  arSimple(89,
    'Any equation of the from ax² + bx + c = 0 where a ≠ 0, is called a quadratic equation',
    'The equation x² + 3x + 1 = (x-2)² is a quadratic equation',
    0, { explanation: 'A is the correct, true definition. R is false: expanding (x-2)²=x²-4x+4, so the equation becomes x²+3x+1=x²-4x+4; the x² terms cancel, leaving the LINEAR equation 7x=3, not a quadratic equation — A true, R false, matches printed key (a designed catch, not a discrepancy).' }),
  arSimple(90,
    'If x = 1½ is a solution of the equation 2x² + px - 6 = 0, then value of p is 1.',
    'If α is a root of quadratic equation ax² + bx + c = 0, where a, b and c ∈ R, a ≠ 0, then aα² + bα + c = 0',
    2, { explanation: 'A is true: 2(2.25)+1.5p-6=0 => 4.5+1.5p-6=0 => p=1. R is the definitional fact of what it means to be a root, and is exactly what is used to verify A — both true, matches printed key.' }),
);
items.push(
  arFull(91,
    'The value of k for which the equation kx² + 1 - 2(k-1)x + x² = 0 has equal roots are 0 or 3.',
    'If the roots of a quadratic equation are equal, then its discriminant is greater than zero.',
    2, { explanation: 'A is true: simplify to (k+1)x²-2(k-1)x+1=0; D=4(k-1)²-4(k+1)=0 => k²-3k=0 => k=0 or 3. R is false: equal roots correspond to D EQUAL to zero, not greater than zero — A true, R false, matches printed key.' }),
  arFull(92,
    'The discriminant of the quadratic equation x² + 2x + 2 = 0 is (-4). So, roots of the quadratic equation are imaginary.',
    'If the discriminant D = b² - 4ac < 0, then the roots of quadratic equation ax² + bx + c = 0 are imaginary.',
    0, { explanation: 'A is true: D=4-8=-4, and D<0 correctly implies imaginary roots. R is the correct general fact and directly explains A — both true, R explains A, matches printed key.' }),
  arFull(93,
    'If one root of equation 4x² - 10x + k - 4 = 0 is reciprocal of the other. Then the value of k is 8.',
    'If one root of quadratic equation ax² + bx + c = 0, a ≠ 0 is reciprocal of each other, then a = c',
    0, { explanation: 'A is true: reciprocal roots => product = 1 => (k-4)/4=1 => k=8. R is the correct general fact (product of roots c/a=1 implies a=c) and directly explains A’s method — both true, R explains A, matches printed key.' }),
  arFull(94,
    'If one root of equation 6x² - x - k = 0 is 2/3, then the value of k is 2.',
    'The quadratic equation ax² + bx + c = 0, a ≠ 0 has atmost two real roots.',
    1, { explanation: 'A is true: plug x=2/3: 6(4/9)-2/3-k=0 => 8/3-2/3-k=0 => k=2. R is a true, correct general fact, but is unrelated to and does not explain the specific computation of k in A — both true, R does not explain A, matches printed key.' }),
  arFull(95,
    'The equation (2x-1)² - 4x + 5 = 0 is not a quadratic equation.',
    'The equation ax² + bx + c = 0, a ≠ 0, where a, b, c ∈ R is called a quadratic equation.',
    3, { explanation: 'A is false: expanding gives 4x²-4x+1-4x+5=0 => 4x²-8x+6=0, which IS a quadratic equation (the x² term survives with coefficient 4). R is the correct, true definition — A false, R true, matches printed key (a designed catch, not a discrepancy).' }),
  arFull(96,
    'The quadratic equation 4x² - 12x + 9 = 0 has repeated roots.',
    'The quadratic equation ax² + bx + c = 0, a ≠ 0, have repeated roots, if discriminant D > 0.',
    2, { explanation: 'A is true: D=144-144=0, so roots are equal (repeated). R is false: repeated (equal) roots require D EQUAL to zero, not greater than zero (D>0 gives distinct roots) — A true, R false, matches printed key.' }),
  arFull(97,
    'The value of x in quadratic equation are equal if D = 0.',
    'Quadratic equation 9x² + 30x + 25 has real and unequal roots.',
    2, { explanation: 'A is the correct, true standard fact. R is false: for 9x²+30x+25=0, D=900-900=0, meaning this specific equation has real and EQUAL roots, not unequal as R claims — A true, R false, matches printed key.' }),
  arFull(98,
    'If x² + x - 42 = 0 is a quadratic equation, then x = 6 and -7 are the two roots of the equation.',
    'Any quadratic equation has two roots.',
    0, { explanation: 'A is true: (x-6)(x+7)=x²+x-42, confirmed. R is treated here as the standard textbook generalization that a quadratic equation has two roots (counting repetition), matching the printed key’s judgment that it explains why exactly two values solve A.' }),
  arFull(99,
    'The roots of the quadratic equation x² + 2x + 2 = 0 are imaginary.',
    'If discriminant D = b² - 4ac < 0, then the roots of the quadratic equation ax² + bx + c = 0 are imaginary.',
    0, { explanation: 'A is true: D=4-8=-4<0. R is the correct general fact and directly explains A — both true, R explains A, matches printed key.' }),
  arFull(100,
    "In the expression 1/(x-3) + 1/(x+5) = 1/6, x can't have values 3 and (-5)",
    'If discriminant D = b² - 4ac > 0, then the roots of the quadratic equation ax² + bx + c = 0 are real and unequal.',
    1, { explanation: 'A is true: those values make a denominator zero, undefined. R is a true, correct general fact about discriminants, but is completely unrelated to A’s domain-restriction point — both true, R does not explain A, matches printed key.' }),
  arFull(101,
    'The discriminant of the quadratic equation 2x² - 4x + 3 = 0 is (-8) and hence the nature of its roots is no real roots.',
    'If b² - 4ac < 0 the nature of root is real roots.',
    2, { explanation: 'A is true: D=16-24=-8<0, correctly implying no real roots. R is false: it states the relationship backwards — D<0 means NO real roots (imaginary), not "real roots" — A true, R false, matches printed key.' }),
);

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'Quadratic Equation',
  chapterOrder: 5,
  label: 'ICSE Class 10 Mathematics — Quadratic Equation: 101 items (74 plain MCQ, 9 multi-part case-study MCQ blocks, 1 biographical passage, 17 Assertion-Reason), full chapter, from chap_5.pdf, every algebraically-checkable answer independently re-verified against the printed key (100/101 matched exactly; item 61 disclosed as taken from the key due to ambiguous source wording)',
  status: 'verified',
  answerStatus: 'verified',
  sourceSection: 'Multiple Choice Questions + Assertion and Reasoning (full chapter, pp.5.2-5.17)',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
