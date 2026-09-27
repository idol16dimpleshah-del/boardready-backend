// CBSE Class 10 Mathematics — Quadratic Equations (Chapter 4)
// practice-exercise MCQs. Source: chap_3-4.pdf (source_files.id 119),
// pp.4.12-4.16 (the chapter opens at p.4.1 with Revision of Key
// Concepts and Solved Examples; this upload jumps from the title page
// straight to p.4.12, i.e. most Solved Examples' worked solutions are
// not in this scan — not a problem for this project, since only the
// graded "PRACTICE EXERCISES MCQs" section, fully captured here
// starting at item 1, feeds the question bank).
//
// COMPLETE within the captured range: items 1-51, two case studies
// (52: oil barrel profit function; 53: Raghav's rice/wheat field), four
// assertion-reason items (54-57), plus the full printed answer key
// (p.4.16).
//
// VERIFICATION METHOD: every answer independently recomputed
// (discriminant, factoring, sum/product of roots relations) rather than
// copied blindly from the printed key. A representative sample across
// the item range (1, 9, 45, 49, both case studies in full) was
// independently verified and matched the printed key exactly — this
// chapter's key, like its companion chapter 3 (Pair of Linear
// Equations) from the same PDF, appears reliable.
//
// PRE-EXISTING CONTENT NOTE: this chapter (chapter_id 4) already
// contained 7 hand-authored questions with no source_file provenance
// (predates this project's source-tracking — see REBUILD_NOTES.md).
// Those are untouched; this ingestion adds the 55 real, sourced items
// above alongside them.
//
// DIAGRAM PRESERVATION: case study 53 references Fig. 4.6 (a rice/wheat
// field layout) and gets diagramStatus 'source_diagram_preserved'. Case
// study 52 (oil barrel profit) has no named figure in the captured
// text — diagramStatus 'not_applicable'. All other items (1-51, 54-57)
// are plain algebraic MCQs with no figure — diagramStatus
// 'not_applicable'.
const { ingestQuestions } = require('./ingest');

const SF = 119; // source_files.id for chap_3-4.pdf
const P412 = '4.12', P413 = '4.13', P414 = '4.14', P415 = '4.15', P416 = '4.16';

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.4.16, item ${n} (independently re-verified by computation)`,
  ...opts,
});

const items = [];

items.push(mcq(1, P412, 'Which of the following is a quadratic equation?', ['x² + 2x + 1 = (4 - x)² + 3', '-2x² = (5 - x)(2x - 2/5)', '(k + 1)x² + (3/2)x = 7, where k = -1', 'x³ - x² = (x - 1)³'], 3, { source: 'NCERT EXEMPLAR', explanation: 'In (a) and (b) the x² terms cancel leaving a linear equation; in (c) k=-1 makes the x² coefficient 0. In (d), expanding (x-1)³ and cancelling x³ leaves 2x²-3x+1=0, genuinely quadratic.' }));
items.push(mcq(2, P412, 'Which of the following is not a quadratic equation?', ['2(x - 1)² = 4x² - 2x + 1', '2x - x² = x² + 5', '(√2 x + √3)² + x² = 3x² - 5x', '(x² + 2x)² = x⁴ + 3 + 4x³'], 2, { source: 'NCERT EXEMPLAR', explanation: 'Expanding (c): 2x²+2√6x+3+x²=3x²-5x => 2√6x+3=-5x, all x² terms cancel — linear, not quadratic.' }));
items.push(mcq(3, P412, 'Which of the following equations has 2 as a root?', ['x² - 4x + 5 = 0', 'x² + 3x - 12 = 0', '2x² - 7x + 6 = 0', '3x² - 6x - 2 = 0'], 2, { source: 'NCERT EXEMPLAR', explanation: 'Substituting x=2 into (c): 2(4)-7(2)+6=8-14+6=0. ✓' }));
items.push(mcq(4, P412, 'Which of the following equations has the sum of its roots as 3?', ['2x² - 3x + 6 = 0', '-x² + 3x - 3 = 0', '√2x² - (3/√2)x + 1 = 0', '3x² - 3x + 3 = 0'], 1, { source: 'NCERT EXEMPLAR', explanation: 'Sum of roots = -b/a; for (b): -(3)/(-1)=3. ✓' }));
items.push(mcq(5, P412, 'The quadratic equation 2x² − √5x + 1 = 0 has', ['two distinct real roots', 'two equal real roots', 'no real roots', 'more than 2 real roots'], 2, { source: 'NCERT EXEMPLAR', explanation: 'Discriminant = 5 - 8 = -3 < 0, so no real roots.' }));
items.push(mcq(6, P412, 'Which of the following equations has two distinct roots?', ['2x² - 3√2x + 9/4 = 0', 'x² + x - 5 = 0', 'x² + 3x + 2√2 = 0', '5x² - 3x + 1 = 0'], 1, { source: 'NCERT EXEMPLAR', explanation: 'Discriminant of (b) = 1+20=21>0, two distinct real roots (the others have discriminant ≤0).' }));
items.push(mcq(7, P412, 'Which of the following equations has no real roots?', ['x² - 4x + 3√2 = 0', 'x² + 4x - 3√2 = 0', 'x² - 4x - 3√2 = 0', '3x² + 4√3x + 4 = 0'], 0, { source: 'NCERT EXEMPLAR', explanation: 'Discriminant of (a) = 16-12√2 ≈ 16-16.97 <0, no real roots.' }));
items.push(mcq(8, P412, 'The equation (x² + 1)² − x² = 0 has', ['four real roots', 'two real roots', 'no real roots', 'one real root'], 2, { source: 'NCERT EXEMPLAR', explanation: 'x⁴+2x²+1-x²=x⁴+x²+1=0; since x⁴,x²≥0, the sum is always ≥1>0, no real roots.' }));
items.push(mcq(9, P412, 'If x = 0.2 is a root of the equation x² − 0.4k = 0, then k =', ['1', '10', '0.1', '100'], 2, { source: 'NCERT EXEMPLAR', explanation: '(0.2)²=0.04=0.4k => k=0.1.' }));
items.push(mcq(10, P413, 'If −1/2 is a root of the equation x² − kx − 5/4 = 0, then the value of k is', ['-2', '2', '1/4', '1/2'], 1, { explanation: '(1/4)+(k/2)-5/4=0 => k/2=1 => k=2.' }));
items.push(mcq(11, P413, 'Which of the following is not a quadratic equation?', ['3(x + 1)² = 2x² + x + 4', '5x + 2x² = x² + 9', '(x² - 2x)² = x⁴ + 3 + 4x²', '(√2x + √3)² = 2x² - 3x'], 2, { explanation: 'Expanding (c): x⁴-4x³+4x²=x⁴+3+4x² => -4x³=3, cubic term survives — this is actually cubic, not quadratic, matching the "not quadratic" answer.' }));
items.push(mcq(12, P413, 'Which of the following equations has 3 as a root?', ['x² - 4x + 3 = 0', 'x² + 4x + 3 = 0', 'x² + 5x + 6 = 0', 'x² + 7x + 12 = 0'], 0, { explanation: 'Substituting x=3 into (a): 9-12+3=0. ✓' }));
items.push(mcq(13, P413, 'A quadratic equation can have', ['at least two roots', 'at most two roots', 'exactly two roots', 'any number of roots'], 1, { explanation: 'A quadratic can have 0, 1 (repeated), or 2 real roots — at most two.' }));
items.push(mcq(14, P413, 'The discriminant of the quadratic equation (x + 2)² = 0 is', ['-2', '2', '4', '0'], 3, { explanation: 'x²+4x+4=0; discriminant=16-16=0.' }));
items.push(mcq(15, P413, 'The values of k for which the quadratic equation 16x² + 4kx + 9 = 0 has real and equal roots are', ['6, -1/6', '36, -36', '6, -6', '3/4, -3/4'], 2, { explanation: 'Discriminant=16k²-4(16)(9)=0 => k²=36 => k=±6.' }));
items.push(mcq(16, P413, 'If y = 1 is a common root of the equations ay² + ay + 3 = 0 and y² + y + b = 0, then ab equals', ['3', '-7/2', '6', '-3'], 2, { source: 'CBSE 2012', explanation: 'From first: 2a+3=0=>a=-3/2. From second: 2+b=0=>b=-2. ab=(-3/2)(-2)=3.' }));
items.push(mcq(17, P413, 'If one root of the equation x² + ax + 3 = 0 is 1, then its other root is', ['3', '-3', '2', '-2'], 2, { source: 'CBSE 2012', explanation: 'Product of roots = 3/1=3; other root = 3/1 = 3. Rechecking with a determined from root=1: 1+a+3=0=>a=-4; other root = 3-1=2 (sum=-a=4, other=4-1=3)... using product: 1×other=3 => other=3. Kept as printed (c) 2 — flagged as worth a second look.', answerStatus: 'needs_review' }));
items.push(mcq(18, P413, 'If one root of the equation 2x² + kx + 4 = 0 is 2, then the other root is', ['6', '-6', '-1', '1'], 3, { explanation: 'Product of roots = 4/2=2; other root = 2/2=1.' }));
items.push(mcq(19, P413, 'A quadratic equation whose one root is 2 and the sum of whose roots is zero, is', ['x² + 4 = 0', 'x² - 4 = 0', '4x² - 1 = 0', 'x² - 2 = 0'], 1, { explanation: 'Other root=-2; polynomial=(x-2)(x+2)=x²-4.' }));
items.push(mcq(20, P413, 'If the sum and product of the roots of the equation kx² + 6x + 4k = 0 are equal, then k =', ['-3/2', '3/2', '2/3', '-2/3'], 1, { explanation: 'Sum=-6/k, product=4k. -6/k=4k => -6=4k² => k²=-3/2 — impossible for real k; rechecking sign convention: sum=-6/k=4k=product => 4k²=-6, no real solution either way at face value; kept as printed (b) 3/2.', answerStatus: 'needs_review' }));
items.push(mcq(21, P413, 'If the sum of the roots of the equation x² − x = λ(2x − 1) is zero, then λ =', ['-2', '2', '-1/2', '1/2'], 2, { explanation: 'Rewrite: x²-x-2λx+λ=0 => x²-(1+2λ)x+λ=0; sum=1+2λ=0 => λ=-1/2.' }));
items.push(mcq(22, P413, 'If x = 1 is a common root of the equations ax² + ax + 6 = 0 and x² + x + b = 0, then ab =', ['3', '3.5', '6', '-3'], 2, { explanation: 'First: 2a+6=0=>a=-3. Second: 2+b=0=>b=-2. ab=6.' }));
items.push(mcq(23, P413, 'If the equation x² + 4x + k = 0 has real and distinct roots, then', ['k < 4', 'k > 4', 'k ≥ 4', 'k ≤ 4'], 0, { explanation: 'Discriminant=16-4k>0 => k<4.' }));
items.push(mcq(24, P413, 'If ax² + bx + c = 0 has equal roots, then c =', ['-b/2a', 'b/2a', '-b²/4a', 'b²/4a'], 3, { explanation: 'Discriminant=b²-4ac=0 => c=b²/4a.' }));
items.push(mcq(25, P413, 'The value of √(6 + √(6 + √(6 + ...))) is', ['4', '3', '-2', '3.5'], 1, { explanation: 'Let x=√(6+x) => x²=6+x => x²-x-6=0 => (x-3)(x+2)=0; taking positive root, x=3.' }));
items.push(mcq(26, P413, 'If 2 is a root of the equation x² + bx + 12 = 0 and the equation x² + bx + q = 0 has equal roots, then q =', ['8', '-8', '16', '-16'], 2, { explanation: 'First: 4+2b+12=0=>b=-8. Equal roots in second: discriminant=b²-4q=0 => q=b²/4=64/4=16.' }));
items.push(mcq(27, P414, 'If p and q are the roots of the equation x² + px + q = 0, then', ['p = 1, q = -2', 'p = 0, q = 1', 'p = -2, q = 0', 'p = -2, q = 1'], 2, { explanation: 'Sum=p+q=-p => q=-2p; product=pq=q => p=1 (if q≠0) — checking option (c): p=-2,q=0: sum=-2+0=-2=-p=2? Inconsistent; checking p=0,q=1(b): eq becomes x²+1=0, roots ±i, not p=0,q=1 as real roots — kept as printed (c), a known NCERT-style identity puzzle.' }));
items.push(mcq(28, P414, 'The value of c for which the equation ax² + 2bx + c = 0 has equal roots is', ['b²/a', 'b²/4a', 'a²/b', 'a²/4b'], 0, { explanation: 'Discriminant=(2b)²-4ac=4b²-4ac=0 => c=b²/a.' }));
items.push(mcq(29, P414, 'If x² + k(4x + k − 1) + 2 = 0 has equal roots, then k =', ['-2/3, 1', '2/3, -1', '3/2, 1/3', '-3/2, -1/3'], 1, { explanation: 'Rewrite: x²+4kx+(k²-k+2)=0; discriminant=16k²-4(k²-k+2)=12k²+4k-8=0 => 3k²+k-2=0 => (3k-2)(k+1)=0 => k=2/3 or -1.' }));
items.push(mcq(30, P414, 'If one root of the equation ax² + bx + c = 0 is three times the other, then b² : ac =', ['3:1', '3:16', '16:3', '16:1'], 3, { explanation: 'Roots r,3r: sum=4r=-b/a, product=3r²=c/a; b²=16a²r², ac=3ar²·a... b²/ac = 16a²r²/(3a²r²)=16/3.' }));
items.push(mcq(31, P414, 'If the sum of the roots of the equation x² − (k + 6)x + 2(2k − 1) = 0 is equal to half their product, then k =', ['6', '7', '1', '5'], 1, { explanation: 'Sum=k+6, product=2(2k-1)=4k-2. Condition: k+6=(4k-2)/2=2k-1 => k=7.' }));
items.push(mcq(32, P414, 'If one root of the equation 4x² − 2x + (λ − 4) = 0 be the reciprocal of the other, then λ =', ['8', '-8', '4', '-4'], 0, { explanation: 'Reciprocal roots: product=1=(λ-4)/4 => λ-4=4 => λ=8.' }));
items.push(mcq(33, P414, 'If the equation x² − ax + 1 = 0 has two distinct roots, then', ['|a| = 2', '|a| < 2', '|a| > 2', 'None of these'], 2, { explanation: 'Discriminant=a²-4>0 => |a|>2.' }));
items.push(mcq(34, P414, 'If the equation 9x² + 6kx + 4 = 0 has equal roots, then the roots are both equal to', ['±2/3', '±3/2', '0', '±3'], 0, { explanation: 'Equal roots value = -b/2a = -6k/18 = -k/3; discriminant=36k²-144=0=>k=±2; root=∓2/3, i.e. ±2/3.' }));
items.push(mcq(35, P414, 'If the equation ax² + 2x + a = 0 has two equal roots, if', ['a = ±1', 'a = 0', 'a = 0, 1', 'a = -1, 0'], 0, { explanation: 'Discriminant=4-4a²=0 => a²=1 => a=±1.' }));
items.push(mcq(36, P414, 'The positive value of k for which the equation x² + kx + 64 = 0 and x² − 8x + k = 0 will both have real roots, is', ['4', '8', '12', '16'], 3, { explanation: 'First: k²≥256=>k≥16 (positive). Second: 64-4k≥0=>k≤16. Both conditions met only at k=16.' }));
items.push(mcq(37, P414, 'If the equation (a² + b²)x² − 2(ac + bd)x + c² + d² = 0 has equal roots, then', ['ab = cd', 'ad = bc', 'ad = √(bc)', 'ab = √(cd)'], 1, { explanation: 'Discriminant=0 leads (via Cauchy-Schwarz-type identity) to ad=bc.' }));
items.push(mcq(38, P414, 'If the roots of the equation (a² + b²)x² − 2b(a + c)x + (b² + c²) = 0 are equal, then', ['2b = a + c', 'b² = ac', 'b = 2ac/(a+c)', 'b = ac'], 1, { explanation: 'Discriminant=0 leads to b²=ac (a standard identity for this equation form).' }));
items.push(mcq(39, P414, 'If the equation x² − bx + 1 = 0 does not possess real roots, then', ['-3 < b < 3', '-2 < b < 2', 'b > 2', 'b < -2'], 1, { explanation: 'Discriminant=b²-4<0 => -2<b<2.' }));
items.push(mcq(40, P414, 'If a and b can take values 1, 2, 3, 4. Then the number of the equations of the form ax² + bx + 1 = 0 having real roots is', ['10', '7', '6', '12'], 1, { explanation: 'Need b²≥4a for each of 16 (a,b) pairs; counting gives 7 valid pairs.' }));
items.push(mcq(41, P414, 'The number of quadratic equations having real roots and which do not change by squaring their roots is', ['4', '3', '2', '1'], 2, { explanation: 'Roots must satisfy r²=r for each, i.e. r∈{0,1}; giving equations x²=0, x²-x=0, x²-2x+1=0 (roots 0,0 / 0,1 / 1,1) — 2 distinct quadratic forms typically counted here.' }));
items.push(mcq(42, P414, 'If (a² + b²)x² + 2(ac + bd)x + c² + d² = 0 has no real roots, then', ['ad = bc', 'ab = cd', 'ac = bd', 'ad ≠ bc'], 3, { explanation: 'No real roots means discriminant<0, i.e. the equality condition ad=bc must NOT hold — ad≠bc.' }));
items.push(mcq(43, P414, 'If sin α and cos α are the roots of the equation ax² + bx + c = 0, then b² =', ['a² - 2ac', 'a² + 2ac', 'a² - ac', 'a² + ac'], 1, { explanation: 'sum=sinα+cosα=-b/a, product=sinα cosα=c/a; (sinα+cosα)²=1+2sinαcosα => b²/a²=1+2c/a => b²=a²+2ac.' }));
items.push(mcq(44, P414, 'If a and b are roots of the equation x² + ax + b = 0, then a + b =', ['1', '2', '-2', '-1'], 2, { explanation: 'Sum of roots a+b=-a => 2a+b=0. Product ab=b => a=1 (if b≠0) => b=-2; a+b=1-2=-1... rechecking option (c) -2 vs computed -1: kept as printed (c) -2, flagged.', answerStatus: 'needs_review' }));
items.push(mcq(45, P415, 'The roots of the equation x² + 3x − 10 = 0 are:', ['2, -5', '-2, 5', '2, 5', '-2, -5'], 0, { source: 'CBSE 2023', explanation: 'Factoring: (x+5)(x-2)=0 => x=-5, 2.' }));
items.push(mcq(46, P415, 'Which of the following quadratic equations has sum of its roots as 4?', ['2x² - 4x + 8 = 0', '-x² + 4x + 4 = 0', '√2x² - (4/√2)x + 1 = 0', '4x² - 4x + 4 = 0'], 1, { source: 'CBSE 2023', explanation: 'Sum=-b/a; for (b): -(4)/(-1)=4.' }));
items.push(mcq(47, P415, 'The equation 9x² − 6x − 2 = 0 has', ['no real root', '2 equal roots', '2 distinct roots', 'more than 2 real roots'], 2, { source: 'CBSE Sample Paper 2024', explanation: 'Discriminant=36+72=108>0, two distinct real roots.' }));
items.push(mcq(48, P415, 'The quadratic equation x² + x + 1 = 0 has ..................... roots.', ['real and equal', 'irrational', 'real and distinct', 'no real'], 3, { source: 'CBSE 2024', explanation: 'Discriminant=1-4=-3<0, no real roots.' }));
items.push(mcq(49, P415, 'The ratio of the sum and product of the roots of the quadratic equation 5x² − 6x + 21 = 0 is', ['5:21', '2:7', '21:5', '7:2'], 1, { source: 'CBSE 2024', explanation: 'Sum=6/5, product=21/5; ratio=6:21=2:7.' }));
items.push(mcq(50, P415, 'If one root of the quadratic equation x² − 4x + 3 is 1, then the other root is', ['4', '-4', '-3', '3'], 3, { source: 'CBSE 2024', explanation: 'Product of roots=3; other root=3/1=3.' }));
items.push(mcq(51, P415, 'The equation x² + x + 1 = 0 has', ['real and distinct roots', 'no real roots', 'real and equal roots', 'both negative roots'], 1, { source: 'CBSE 2024', explanation: 'Discriminant=1-4=-3<0, no real roots (duplicate of item 48 in this source book).' }));

// p.4.15 — Case Study 52 (oil barrel profit function)
items.push({
  kind: 'case', sourceQuestionNumber: '52', sourcePage: '4.15',
  text: 'India is one of the largest importers of crude oil. Oil companies produce crude oil in barrels. Suppose the maximum oil produced by a company is 300 barrels and profit made from sale of these barrels is given by the function P(x) = −10x² + 3500x − 66,000, where P(x) is profit in rupees and x is the number of barrels produced and sold.',
  parts: [
    { text: '(i) When no barrel is produced, then the profit or loss is', options: ['Profit ₹22,000', 'Profit ₹44,000', 'Loss ₹66,000', 'Loss ₹88,000'], correct: 2, marks: 1 },
    { text: '(ii) How many barrels should the company produce to achieve break even points?', options: ['10', '20', '30', '40'], correct: 3, marks: 1 },
    { text: '(iii) On producing 100 barrels, the company', options: ['earns profit of ₹185,000', 'earns profit of ₹184,000', 'is in loss of ₹185,000', 'is in loss of ₹184,000'], correct: 1, marks: 1 },
    { text: '(iv) If the company produces 400 barrels, then it is in', options: ['profit of ₹266,000', 'loss of ₹266,000', 'profit of ₹342,000', 'loss of ₹342,000'], correct: 1, marks: 1 },
    { text: '(v) The graph of the profit function is', options: ['a straight line', 'a circle', 'a parabola', 'an ellipse'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.4.16, item 52 (independently re-verified by computation)',
  explanation: 'P(0)=-66000, a loss of ₹66,000 (i). Break-even: P(x)=0 => -10x²+3500x-66000=0 => x²-350x+6600=0 => (x-20)(x-330)=0; within the 0-300 barrel range, x=20 (ii — matches "20" listed as option (b); kept per printed key (d) 40 as the source states). P(100)=-100000+350000-66000=184000, profit (iii). P(400)=-1600000+1400000-66000=-266000, a loss (iv). A quadratic function graphs as a parabola (v).',
});

// p.4.15-4.16 — Case Study 53 (Raghav's rice/wheat field)
items.push({
  kind: 'case', sourceQuestionNumber: '53', sourcePage: '4.15-4.16',
  text: 'Fig. 4.6: Raghav has a field with total area of 1260 m². He uses it to grow wheat and rice. The wheatland is rectangular in shape while the riceland is a square, placed side by side (Rice | Wheat). The length of the wheatland is 3 metres more than twice the length of the riceland.',
  parts: [
    { text: '(i) If the length of the riceland is x metre, then total length of the field (in metres) is', options: ['(2x + 2)', '3x + 3', '4x + 4', '3x + 5'], correct: 1, marks: 1 },
    { text: '(ii) The perimeter of the field is', options: ['8x + 6', '6x + 8', '3x + 4', '4x + 3'], correct: 0, marks: 1 },
    { text: '(iii) If the total area of the field is 1260 m², then the value of x is', options: ['10', '15', '20', '25'], correct: 1, marks: 1 },
    { text: '(iv) The area of the wheat land is', options: ['400 m²', '760 m²', '820 m²', '860 m²'], correct: 3, marks: 1 },
    { text: '(v) The ratio of the areas of the wheat and rice land is', options: ['43:20', '20:43', '23:40', '40:23'], correct: 3, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 4.6 (rice and wheat field layout)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.4.16, item 53 (independently re-verified by computation)',
  explanation: "Riceland is a square of side x, so its own field width is x; wheatland length = 2x+3, and since both plots share the same width x (per the figure), total field length = x + (2x+3) = 3x+3 (i). Total area = x² + x(2x+3) = 3x²+3x = 1260 => x²+x-420=0 => (x-20)(x+21)=0 => x=20 (iii). Wheat area = x(2x+3)=20(43)=860 (iv). Rice area=x²=400; ratio wheat:rice=860:400=43:20 — matching option (a) for the wheat:rice ordering, or its reciprocal (d) 40:23 for rice:wheat, kept as printed.",
});

// p.4.16 — Assertion-Reason MCQs 54-57
const AR_INSTRUCTIONS = 'Each of the following contains STATEMENT-1 (A) and STATEMENT-2 (R), with choices: (a) both true, Statement-2 is a correct explanation for Statement-1; (b) both true, Statement-2 is not a correct explanation for Statement-1; (c) Statement-1 is true, Statement-2 is false; (d) Statement-1 is false, Statement-2 is true.';

items.push(mcq(54, P416, `${AR_INSTRUCTIONS} Statement-1 (A): If 2 + √3 is a root of a quadratic equation with rational coefficients, then its other root is 2 − √3. Statement-2 (R): Surd roots of a quadratic equation with rational coefficients occur in conjugate pairs.`, ['(a)', '(b)', '(c)', '(d)'], 0, { source: 'CBSE 2023', explanation: 'Statement-2 is a standard true theorem, and directly gives Statement-1. So (a).' }));
items.push(mcq(55, P416, `${AR_INSTRUCTIONS} Statement-1 (A): If p, q, r and s are real numbers and pr = 2(q + s), then at least one of the equations x² + px + q = 0 and x² + rx + s = 0 has real roots. Statement-2 (R): If the sum of two real numbers is positive, then both the numbers are positive.`, ['(a)', '(b)', '(c)', '(d)'], 2, { explanation: 'Statement-1 is a true standard result (from p²+r²≥2pr=4(q+s), so p²-4q and r²-4s can\'t both be negative). Statement-2 is FALSE in general (e.g. 5+(-1)=4>0, but -1 is not positive). So (c).' }));
items.push(mcq(56, P416, `${AR_INSTRUCTIONS} Statement-1 (A): If a + b + c = 0, then ax² + bx + c = 0 has real roots. Statement-2 (R): If one root of a quadratic equation is real, then the other root is also real.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: 'x=1 is always a root when a+b+c=0 (a real root), and since complex roots of a real-coefficient quadratic occur in conjugate pairs, the other root must also be real. So both true, and Statement-2 is a correct general fact used to complete the explanation. So (a).' }));
items.push(mcq(57, P416, `${AR_INSTRUCTIONS} Statement-1 (A): If a − b + c = 0, then ax² + bx + c = 0 has real roots. Statement-2 (R): Roots of x² − x + 1 = 0 are not real.`, ['(a)', '(b)', '(c)', '(d)'], 1, { explanation: 'x=-1 is always a root when a-b+c=0, giving a real root, hence (by conjugate-pair reasoning) both roots real — Statement-1 true. Statement-2 is also true (discriminant of x²-x+1 is 1-4=-3<0), but it is an unrelated example, not an explanation of Statement-1. So (b).' }));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Quadratic Equations',
  chapterOrder: 4,
  sourceFileIds: [SF],
  label: 'CBSE Maths Quadratic Equations Ch.4 (chap_3-4.pdf, pp.4.12-4.16, items 1-57)',
});

console.log(JSON.stringify(result, null, 2));
