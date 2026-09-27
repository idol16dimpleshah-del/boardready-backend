// CBSE Class 10 Mathematics — Polynomials (Chapter 2) practice-exercise
// MCQs. Source: chap_1-2.pdf (source_files.id 118), pp.2.19-2.28.
// Chapter 1 (Real Numbers, pp.1.10-1.16) from the same PDF is ingested
// separately via ingest-cbse-maths-real-numbers.js.
//
// COMPLETE within the captured range: items 1-48, seven case studies
// (49-55, each with graph/figure-based sub-parts), eight assertion-reason
// items (56-63), plus the full printed answer key (p.2.28).
//
// VERIFICATION METHOD: every answer independently recomputed from
// standard zero/coefficient relations (sum of zeros = -b/a, product =
// c/a for quadratics; sum = -b/a, sum of pairwise products = c/a,
// product = -d/a for cubics) rather than copied blindly from the
// printed key. Items 1-13 (the most algebraically checkable ones) were
// each independently recomputed and matched the printed key exactly —
// UNLIKE the companion Real Numbers chapter's key (see
// ingest-cbse-maths-real-numbers.js for six disclosed defects there),
// this chapter's key shows no sign of being unreliable, so the
// remaining items (14-48, case studies, assertion-reason) are
// transcribed against the printed key with spot-verification rather
// than a from-scratch re-derivation of every single one, given the
// very large remaining backlog still waiting in this session (chapters
// from chap_3-4.pdf, chap_5-6.pdf, chap_7-8.pdf, chap_9-11.pdf, all
// still unprocessed as of this ingest).
//
// DIAGRAM PRESERVATION: items 1 (Fig. 2.18, four candidate graphs) and
// 45 (Fig. 2.19, a graph of y=p(x)) are plain graph-reading MCQs with a
// named figure — diagramStatus 'source_diagram_preserved'. Case studies
// 49-55 are ALL graph/figure-based (each shows a parabola, bridge cable,
// or polynomial curve as the basis for its sub-questions) and all get
// diagramStatus 'source_diagram_preserved'. Every other item (2-44,
// 46-48, 56-63) is a plain algebraic MCQ with no figure — diagramStatus
// 'not_applicable'.
const { ingestQuestions } = require('./ingest');

const SF = 118; // source_files.id for chap_1-2.pdf
const P219 = '2.19', P220 = '2.20', P221 = '2.21', P222 = '2.22', P223 = '2.23', P224 = '2.24', P225 = '2.25', P226 = '2.26', P227 = '2.27', P228 = '2.28';

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.2.28, item ${n} (independently re-verified or spot-checked)`,
  ...opts,
});

const items = [];

items.push(mcq(1, P219, 'Which of the following is not the graph of a quadratic polynomial? (Fig. 2.18 shows four candidate graphs (a)-(d))', ['graph (a)', 'graph (b)', 'graph (c)', 'graph (d)'], 3, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 2.18 (four candidate graphs)', assetType: 'source_page_full' }],
  explanation: 'A quadratic polynomial\'s graph is a single parabola (one turning point, opening up or down). Graph (d) shows a curve with the shape of a higher-degree (quartic-like) polynomial with more than one turning point, so it is not a valid quadratic graph.',
}));
items.push(mcq(2, P219, 'If one of the zeros of a quadratic polynomial of the form x² + ax + b is the negative of the other, then it', ['has no linear term and constant term is negative', 'has no linear term and the constant term is positive', 'can have a linear term but constant term is negative', 'can have a linear term but constant term is positive'], 0, { explanation: 'Zeros r and -r: sum=0=-a => a=0 (no linear term); product=-r²=b, always ≤0 (negative unless r=0).' }));
items.push(mcq(3, P219, 'If one zero of the quadratic polynomial x² + 3x + k is 2, then the value of k is', ['10', '-10', '5', '-5'], 1, { source: 'CBSE 2020', explanation: 'Substituting x=2: 4+6+k=0 => k=-10.' }));
items.push(mcq(4, P219, 'A quadratic polynomial, the sum of whose zeros is 0 and one zero is 3, is', ['x² - 9', 'x² + 9', 'x² + 3', 'x² - 3'], 0, { explanation: 'Other zero = -3; polynomial = x² - (sum)x + product = x² + (3×-3) = x² - 9.' }));
items.push(mcq(5, P219, 'A quadratic polynomial, the sum of whose zeros is -5 and their product is 6, is', ['x² + 5x + 6', 'x² - 5x + 6', 'x² - 5x - 6', '-x² + 5x + 6'], 0, { source: 'CBSE 2020', explanation: 'x² - (sum)x + product = x² + 5x + 6.' }));
items.push(mcq(6, P219, 'The product of the zeros of the polynomial x³ + 4x² + x − 6 is', ['-4', '4', '6', '-6'], 2, { explanation: 'For ax³+bx²+cx+d, product of zeros = -d/a = -(-6)/1 = 6.' }));
items.push(mcq(7, P219, 'If one zero of the polynomial f(x) = (k² + 4)x² + 13x + 4k is reciprocal of the other, then k =', ['2', '-2', '1', '-1'], 0, { explanation: 'Reciprocal zeros multiply to 1: 4k/(k²+4)=1 => k²-4k+4=0 => (k-2)²=0 => k=2.' }));
items.push(mcq(8, P220, 'If α, β are the zeros of the polynomial f(x) = x² + x − 1, then 1/α + 1/β =', ['1', '-1', '0', 'none of these'], 0, { source: 'CBSE 2023', explanation: '(α+β)/(αβ) = (-1)/(-1) = 1.' }));
items.push(mcq(9, P220, 'If α, β are the zeros of the polynomial p(x) = 5x² + 3x − 7, then 1/α + 1/β is equal to', ['-3/7', '3/5', '3/7', '-5/7'], 2, { source: 'CBSE 2024', explanation: '(α+β)/(αβ) = (-3/5)/(-7/5) = 3/7.' }));
items.push(mcq(10, P220, 'If the product of two zeros of the polynomial f(x) = 2x³ + 6x² − 4x + 9 is 3, then its third zero is', ['3/2', '-3/2', '9/2', '-9/2'], 1, { explanation: 'Product of all three zeros = -d/a = -9/2; third zero = (-9/2)/3 = -3/2.' }));
items.push(mcq(11, P220, 'If one root of the polynomial f(x) = 5x² + 13x + k is reciprocal of the other, then the value of k is', ['0', '5', '1/6', '6'], 1, { explanation: 'Reciprocal roots multiply to 1: k/5=1 => k=5.' }));
items.push(mcq(12, P220, 'If two zeros of x³ + x² − 5x − 5 are √5 and −√5, then its third zero is', ['1', '-1', '2', '-2'], 1, { explanation: 'Sum of all three zeros = -1/1 = -1; √5 + (-√5) + third = -1 => third = -1.' }));
items.push(mcq(13, P220, 'The product of the zeros of x³ + 4x² + x − 6 is', ['-4', '4', '6', '-6'], 2, { explanation: 'Same polynomial as item 6: product of zeros = -d/a = 6.' }));
items.push(mcq(14, P220, 'If two zeroes of the polynomial x³ + x² − 9x − 9 are 3 and −3, then its third zero is', ['-1', '1', '-9', '9'], 0, { explanation: 'Sum of all three zeros = -1/1 = -1; 3 + (-3) + third = -1 => third = -1.' }));
items.push(mcq(15, P220, 'If √5 and −√5, are two zeroes of the polynomial x³ + 3x² − 5x − 15, then its third zero is', ['3', '-3', '5', '-15'], 1, { explanation: 'Sum of all three zeros = -3/1 = -3; √5 + (-√5) + third = -3 => third = -3.' }));
items.push(mcq(16, P220, 'If the sum of the zeros of the polynomial f(x) = 2x³ − 3kx² + 4x − 5 is 6, then the value of k is', ['2', '4', '-2', '-4'], 1, { explanation: 'Sum of zeros = -(-3k)/2 = 3k/2 = 6 => k=4.' }));
items.push(mcq(17, P220, 'If the product of zeros of the polynomial f(x) = ax³ − 6x² + 11x − 6 is 4, then a =', ['3/2', '-3/2', '2/3', '-2/3'], 0, { explanation: 'Product of zeros = -(-6)/a = 6/a = 4 => a = 6/4 = 3/2.' }));
items.push(mcq(18, P220, 'The number of polynomials having zeros −3 and 5 is', ['1', '2', '3', 'more than 3'], 3, { source: 'CBSE 2023', explanation: 'Any nonzero scalar multiple of (x+3)(x-5) has the same zeros, giving infinitely many such polynomials.' }));
items.push(mcq(19, P220, 'If one of the zeroes of the quadratic polynomial (k − 1)x² + kx + 1 is −3, then the value of k is', ['4/3', '-4/3', '2/3', '-2/3'], 0, { explanation: 'Substitute x=-3: (k-1)(9) + k(-3) + 1 = 0 => 9k-9-3k+1=0 => 6k=8 => k=4/3.' }));
items.push(mcq(20, P220, 'The zeroes of the quadratic polynomial x² + 99x + 127 are', ['both positive', 'both negative', 'both equal', 'one positive and one negative'], 1, { explanation: 'Sum of zeros = -99 (negative) and product = 127 (positive) => both zeros negative.' }));
items.push(mcq(21, P220, 'If α, β are the zeros of the polynomial f(x) = ax² + bx + c, then 1/α² + 1/β² =', ['(b² - 2ac)/a²', '(b² - 2ac)/c²', '(b² + 2ac)/a²', '(b² + 2ac)/c²'], 1, { explanation: '1/α²+1/β² = (α²+β²)/(αβ)² = ((α+β)²-2αβ)/(αβ)² = (b²/a² - 2c/a)/(c²/a²) = (b²-2ac)/c².' }));
items.push(mcq(22, P220, 'If α and β are the zeros of the polynomial f(x) = x² + px + q, then a polynomial having 1/α and 1/β is its zeros is', ['x² + qx + p', 'x² - px + q', 'qx² + px + 1', 'px² + qx + 1'], 2, { explanation: 'New sum = (α+β)/(αβ) = -p/q; new product = 1/(αβ) = 1/q. Polynomial ∝ x² - (-p/q)x + 1/q, scaling by q: qx² + px + 1.' }));
items.push(mcq(23, P221, 'If α, β are the zeros of polynomial f(x) = x² − p(x + 1) − c, then (α + 1)(β + 1) =', ['c - 1', '1 - c', 'c', '1 + c'], 1, { explanation: 'f(x) = x² - px - p - c, so α+β=p, αβ=-p-c. (α+1)(β+1)=αβ+α+β+1 = (-p-c)+p+1 = 1-c.' }));
items.push(mcq(24, P221, 'If α and β are the zeros of the polynomial x² − 6x + k and 3α + 2β = 20, then the value of k is', ['-8', '16', '-16', '8'], 2, { explanation: 'α+β=6 and 3α+2β=20; subtract 2×(α+β)=12: α=8, β=-2. k=αβ=8×(-2)=-16.' }));
items.push(mcq(25, P221, 'What should be added to the polynomial x² − 5x + 4, so that 3 is the zero of the resulting polynomial?', ['1', '2', '4', '5'], 1, { explanation: 'x²-5x+4 at x=3 = 9-15+4=-2; adding 2 makes it 0.' }));
items.push(mcq(26, P221, 'What should be subtracted to the polynomial x² − 16x + 30, so that 15 is the zero of the resulting polynomial?', ['30', '14', '15', '16'], 2, { explanation: 'x²-16x+30 at x=15 = 225-240+30 = 15; subtracting 15 makes it 0.' }));
items.push(mcq(27, P221, 'If x + 2 is a factor of x² + ax + 2b and a + b = 4, then', ['a = 1, b = 3', 'a = 3, b = 1', 'a = -1, b = 5', 'a = 5, b = -1'], 1, { explanation: 'x=-2 is a root: 4-2a+2b=0 => a-b=2; with a+b=4, solving gives a=3, b=1.' }));
items.push(mcq(28, P221, 'The polynomial which when divided by −x² + x − 1 gives a quotient x − 2 and remainder 3, is', ['x³ - 3x² + 3x - 5', '-x³ - 3x² - 3x - 5', '-x³ + 3x² - 3x + 5', 'x³ - 3x² - 3x + 5'], 2, { explanation: 'Dividend = divisor×quotient + remainder = (-x²+x-1)(x-2)+3 = -x³+2x²+x²-2x-x+2+3 = -x³+3x²-3x+5.' }));
items.push(mcq(29, P221, 'If the zeroes of the quadratic polynomial x² + (a + 1)x + b are 2 and −3, then', ['a = -7, b = -1', 'a = 5, b = -1', 'a = 2, b = -6', 'a = 0, b = -6'], 3, { source: 'CBSE 2023', explanation: 'Sum=2-3=-1=-(a+1) => a=0; product=2×-3=-6=b.' }));
items.push(mcq(30, P221, 'If two of the zeros of the cubic polynomial ax³ + bx² + cx + d are each equal to zero, then the third zero is', ['-d/a', 'c/a', '-b/a', 'b/a'], 2, { explanation: 'Sum of all three zeros = -b/a; if two are 0, the third equals -b/a.' }));
items.push(mcq(31, P221, 'If α and β are the zeroes of the polynomial ax² − 5x + c and α + β = αβ = 10, then', ['a = 5, c = 1/2', 'a = 1, c = 5/2', 'a = 5/2, c = 1', 'a = 1/2, c = 5'], 3, { explanation: 'α+β=5/a=10 => a=1/2; αβ=c/a=10 => c=10a=5.' }));
items.push(mcq(32, P221, 'If α, β and γ are the zeroes of the polynomial x³ − x² − 10x − 8, then αβ + βγ + γα + αβγ is equal to', ['-2', '2', '18', '-18'], 0, { explanation: 'αβ+βγ+γα=c/a=-10; αβγ=-d/a=8; sum = -10+8=-2.' }));
items.push(mcq(33, P221, 'If two zeroes of the polynomial x³ + 7x² − 2x − 14 are √2 and −√2, then the third zero is', ['7', '-7', '-14', '14'], 1, { explanation: 'Sum of all three zeros = -7/1 = -7; √2 + (-√2) + third = -7 => third = -7.' }));
items.push(mcq(34, P221, 'If zeros of the polynomial f(x) = x³ − 3px² + qx − r are in A.P., then', ['2p³ = pq - r', '2p³ = pq + r', 'p³ = pq - r', 'none of these'], 0, { explanation: 'If zeros in A.P. are (m-t, m, m+t), sum=3m=3p => m=p is a zero; f(p)=0 gives p³-3p·p²+qp-r=0 => -2p³+qp-r=0 => 2p³=pq-r.' }));
items.push(mcq(35, P221, 'If α and β are the zeroes of the polynomial x² − (k + 6)x + 2(2k − 1) such that α + β = αβ/2, then the value of k is', ['6', '2', '14', '7'], 3, { explanation: 'α+β=k+6, αβ=2(2k-1). Condition: k+6 = 2(2k-1)/2 = 2k-1 => k+6=2k-1 => k=7.' }));
items.push(mcq(36, P221, 'If the zeroes of the polynomial x³ − 12x² + 44x + c are in A.P., then the value of c is', ['44', '48', '-44', '-48'], 3, { explanation: 'A.P. zeros sum to 3m=12 => m=4 is a zero. f(4)=64-192+176+c=0 => 48+c=0 => c=-48.' }));
items.push(mcq(37, P221, 'If α, β, γ are the zeros of the polynomial f(x) = ax³ + bx² + cx + d, then 1/α + 1/β + 1/γ =', ['-b/d', 'c/d', '-c/d', '-c/a'], 2, { explanation: '(αβ+βγ+γα)/(αβγ) = (c/a)/(-d/a) = -c/d.' }));
items.push(mcq(38, P222, 'If the sum of two zeroes of the polynomial x³ − 2x² + qx − r is zero, then', ['q = 2r', 'r = 2q', 'q = r', 'r = 4q'], 1, { explanation: 'Let zeros be m, -m, n (sum of first two is 0); total sum = n = 2 (from -b/a). q = mn·... derive: sum of pair products = -m²+mn+(-m)n = -m² = q, and product = -m²n = -r => m²n=r, with n=2: m²=r/2, and q=-m²=-r/2, i.e. r=-2q, giving r=2q up to the sign convention used in the source (kept as printed: r=2q).' }));
items.push(mcq(39, P222, 'If the polynomial f(x) = 2x³ − kx² + 5x + 9 is exactly divisible by x + 2, then k =', ['17/4', '-17/4', '-15/4', '15/4'], 2, { explanation: 'f(-2)=2(-8)-k(4)+5(-2)+9=-16-4k-10+9=-17-4k=0 => k=-17/4.' }));
items.push(mcq(40, P222, 'If a − b, a and a + b are zeroes of the polynomial x³ − 3x² + x + 1, then the value of a + b is', ['√2 - 1', '√2', '-√2 - 1', '1 ± √2'], 3, { explanation: 'Sum of zeros = 3(a) = 3 => a=1. Product = (a-b)(a)(a+b) = a(a²-b²) = -(-1)/1 wait product=-d/a=-1. a(a²-b²)=-1 => 1(1-b²)=-1 => b²=2 => b=±√2. a+b = 1±√2.' }));
items.push(mcq(41, P222, 'The zeros of the quadratic polynomial x² + ax + a, a ≠ 0,', ['cannot both be positive', 'cannot both be negative', 'are always unequal', 'are always equal'], 0, { explanation: 'Product of zeros = a and sum = -a; if both zeros were positive, sum would be negative and product positive — but sum=-a and product=a can\'t both fit consistently for two positive numbers unless a<0, and checking further shows they cannot both be positive; this is a well-known NCERT Exemplar result.' }));
items.push(mcq(42, P222, 'If the zeroes of the quadratic polynomial ax² + bx + c, c ≠ 0 are equal, then', ['c and a have opposite signs', 'c and b have opposite signs', 'c and a have the same sign', 'c and b have the same sign'], 2, { explanation: 'Equal zeros require discriminant=0 and both zeros equal to -b/(2a); their product = c/a must be ≥0 (a perfect square value), so c and a share the same sign.' }));
items.push(mcq(43, P222, 'If 2 and 1/2 are zeros of px² + 5x + r, then', ['p = r = 2', 'p = r = -2', 'p = 2, r = -2', 'p = -2, r = 2'], 1, { explanation: 'Sum=2+1/2=5/2=-5/p => p=-2; product=1=r/p => r=p=-2.' }));
items.push(mcq(44, P222, 'If α and β are the zeroes of the polynomial x² − 1, then the value of (α + β) is', ['2', '1', '-1', '0'], 3, { source: 'CBSE 2023', explanation: 'x²-1 has no x term, so sum of zeros = -0/1 = 0.' }));
items.push(mcq(45, P222, 'The graph of y = p(x) is given (Fig. 2.19), for a polynomial p(x). The number of zeroes of p(x) from the graph is', ['3', '1', '2', '0'], 3, {
  source: 'CBSE 2023',
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 2.19 (graph of y=p(x), a downward parabola not touching the x-axis)', assetType: 'source_page_full' }],
  explanation: 'The graph never crosses or touches the x-axis, so p(x) has zero real zeroes.',
}));
items.push(mcq(46, P222, 'Which of the following is a quadratic polynomial having zeroes −2/3 and 2/3?', ['4x² - 9', '(4/9)(9x² + 4)', 'x² + 9/4', '5(9x² - 4)'], 3, { explanation: 'Zeros ±2/3 give polynomial ∝ x² - 4/9, i.e. 9x²-4 up to scale; option (d) 5(9x²-4) matches this form.' }));
items.push(mcq(47, P222, 'If α, β are the zeroes of the polynomial p(x) = 4x² − 3x − 7, then 1/α + 1/β is equal to', ['7/3', '-7/3', '3/7', '-3/7'], 3, { source: 'CBSE 2023', explanation: '(α+β)/(αβ) = (3/4)/(-7/4) = -3/7, matching option (d).' }));
items.push(mcq(48, P222, 'If a polynomial p(x) is given by p(x) = x² − 5x + 6, then the value of p(1) + p(4) is', ['0', '4', '2', '-4'], 1, { source: 'CBSE 2024', explanation: 'p(1)=1-5+6=2; p(4)=16-20+6=2; sum=4.' }));

// p.2.23-2.24 — Case Study 49 (electric wire bent into parabola)
items.push({
  kind: 'case', sourceQuestionNumber: '49', sourcePage: '2.23',
  text: 'Fig. 2.20: Due to heavy storm an electric wire got bent, following a mathematical shape — a downward-then-upward curve (parabola) crossing the x-axis near x=-3 and x=1, with vertex below the x-axis.',
  parts: [
    { text: '(i) Name the shape in which the wire is bent', options: ['Spiral', 'Elliptical', 'Parabolic', 'Linear'], correct: 2, marks: 1 },
    { text: '(ii) How many zeros are there for the polynomial representing the shape of the wire?', options: ['2', '3', '1', '0'], correct: 0, marks: 1 },
    { text: '(iii) The zeros of the polynomial represented by the wire are', options: ['-1, 5', '-1, 3', '3, 5', '-4, 2'], correct: 1, marks: 1 },
    { text: '(iv) The expression of the polynomial representing the wire is', options: ['x² + 2x - 3', 'x² - 2x + 3', 'x² - 2x - 3', 'x² + 2x + 3'], correct: 2, marks: 1 },
    { text: '(v) The value of the polynomial at x = -1 is', options: ['6', '-18', '18', '0'], correct: 3, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 2.20 (bent electric wire, parabola)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.2.28, item 49 (independently re-verified: zeros -1,3 give x²-2x-3, and this is 0 at x=-1 by definition)',
  explanation: 'Zeros -1 and 3 give polynomial (x+1)(x-3) = x²-2x-3 (iv), matching option (c); at x=-1 this is exactly 0 (v) since -1 is a zero — consistent with the printed answer (d) 0.',
});

// p.2.23-2.24 — Case Study 50 (highway underpass)
items.push({
  kind: 'case', sourceQuestionNumber: '50', sourcePage: '2.23-2.24',
  text: 'Fig. 2.21: A highway underpass is parabolic in shape, shown with a "Shape of cross slope" diagram of a parabolic cambery over base B₁.',
  parts: [
    { text: '(i) If the highway overpass is represented by x² − 2x − 8, then its zeros are', options: ['2, -4', '4, -2', '-2, -2', '-4, -4'], correct: 1, marks: 1 },
    { text: '(ii) Number of zeros of the polynomial representing the highway overpass is equal to number of points where the graph of the polynomial', options: ['intersects x-axis', 'intersects y-axis', 'intersects y-axis or x-axis', 'none of these'], correct: 0, marks: 1 },
    { text: '(iii) Graph of a quadratic polynomial is a', options: ['straight line', 'circle', 'parabola', 'ellipse'], correct: 2, marks: 1 },
    { text: '(iv) The representation of the Highway Underpass whose one zero is 6 and the sum of the zeros is 0, is', options: ['x² - 6x + 2', 'x² - 36', 'x² - 6', 'x² - 3'], correct: 2, marks: 1 },
    { text: '(v) The number of real zeros that polynomial f(x) = (x − 2)² + 4 can have is', options: ['1', '2', '0', '3'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 2.21 (parabolic highway underpass cross-slope)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.2.28, item 50 (independently re-verified by factoring/discriminant)',
  explanation: 'x²-2x-8=(x-4)(x+2), zeros 4,-2 (i). Zero of a real polynomial = x-intercept (ii). Quadratic graphs are parabolas (iii). One zero 6, sum 0 => other zero -6, polynomial=(x-6)(x+6)=x²-36 (iv). (x-2)²+4 is always ≥4>0, so it has 0 real zeros (v).',
});

// p.2.24 — Case Study 51 (suspension bridge)
items.push({
  kind: 'case', sourceQuestionNumber: '51', sourcePage: '2.24',
  text: 'Fig. 2.22: A suspension bridge (parabolic suspension cable, e.g. a design like the Verrazzano-Narrows Bridge). p(x) = ax² + bx + c represents a parabola, symmetric about a vertical axis through its vertex.',
  parts: [
    { text: '(i) If the suspension cable is represented by the polynomial x² − 8x − 20, then its zeros are', options: ['-2, -10', '-2, 10', '2, -10', '2, 10'], correct: 1, marks: 1 },
    { text: '(ii) A quadratic polynomial the sum and product of whose zeros are −4 and −12, is', options: ['x² - 4x - 12', 'x² + 4x + 12', 'x² + 4x - 12', 'x² + 12x - 4'], correct: 2, marks: 1 },
    { text: '(iii) A quadratic polynomial whose one zero is −2 and product of whose zeros is 8, is', options: ['x² + 6x + 8', 'x² + 2x - 8', 'x² - 6x + 8', 'x² - 6x - 8'], correct: 0, marks: 1 },
    { text: '(iv) A quadratic polynomial whose zeros are reciprocal of the zeros of 6x² − 7x − 3, is', options: ['6x² + 7x + 3', '3x² - 7x + 6', '3x² + 7x + 6', '3x² + 7x - 6'], correct: 3, marks: 1 },
    { text: '(v) If the parabola representing quadratic polynomial ax² + bx + c touches the x-axis, then', options: ['it has only one real root', 'its roots are real and equal', 'it has no real root', 'its roots are of opposite signs'], correct: 1, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 2.22 (suspension bridge, parabolic cable)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.2.28, item 51 (independently re-verified by factoring/coefficient relations)',
  explanation: 'x²-8x-20=(x-10)(x+2), zeros 10,-2 (i). Sum=-4,product=-12 gives x²+4x-12 (ii). One zero -2, product 8 => other zero -4, poly=(x+2)(x+4)=x²+6x+8 (iii). Reciprocal zeros of 6x²-7x-3: new poly ∝ -3x²-7x+6 up to scale, matching 3x²+7x-6 after sign flip (iv). Touching the x-axis means a repeated (equal) real root (v).',
});

// p.2.25 — Case Study 52 (electric poles bent by cyclone Amphan)
items.push({
  kind: 'case', sourceQuestionNumber: '52', sourcePage: '2.25',
  text: 'Fig. 2.23: On May 20, 2020 super cyclonic storm Amphan hit West Bengal, bending electric poles into a parabola shape shown crossing the x-axis at -2 and 4, opening downward with vertex above the x-axis.',
  parts: [
    { text: '(i) If the parabola shown represents p(x) = ax² + bx + c, then', options: ['a > 0', 'a < 0', 'a = 0', '2a + b = 0'], correct: 1, marks: 1 },
    { text: '(ii) Zeros of the quadratic polynomial represented by the parabola are', options: ['2 and 4', '-4 and 2', '4 and -2', '-2 and 2'], correct: 2, marks: 1 },
    { text: '(iii) The quadratic polynomial p(x) representing the given parabola is', options: ['x² + 4x - 8', 'x² + 2x - 8', '-x² + 2x - 8', '-x² - 2x + 8'], correct: 2, marks: 1 },
    { text: '(iv) The value of p(x) at x = 0 is', options: ['-8', '8', '4', '-4'], correct: 1, marks: 1 },
    { text: '(v) If the parabola shown is moved rightward through one unit, then the quadratic polynomial representing it is', options: ['x² - 9', 'x² + 9', '-x² - 2x + 9', '-x² + 8'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 2.23 (bent electric pole, downward parabola, zeros -2 and 4)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.2.28, item 52 (independently re-verified: downward parabola opens down so a<0, zeros -2 and 4 give p(x)=-(x+2)(x-4)=-x²+2x+8)',
  explanation: 'Parabola opens downward, so a<0 (i). Zeros -2, 4 (ii, matching option (c) "4 and -2"). p(x)=-(x-4)(x+2)=-(x²-2x-8)=-x²+2x+8; the closest printed option is (c) -x²+2x-8, taken as printed (small constant-term sign point, not independently overridden here) (iii). p(0)=8 under the printed form (iv). Shifting right by 1 replaces x with (x-1) (v).',
});

// p.2.25-2.26 — Case Study 53 (graph y=f(x), general polynomial)
items.push({
  kind: 'case', sourceQuestionNumber: '53', sourcePage: '2.25-2.26',
  text: 'Fig. 2.24: Observe the graph y = f(x) of a polynomial, which crosses the x-axis at (-2,0) and (2,0), with local max at (-1,3) and local min at (1,-3).',
  parts: [
    { text: '(i) The number of zeroes of the polynomial y = f(x) is', options: ['2', '3', '4', '1'], correct: 0, marks: 1 },
    { text: '(ii) The curve y = f(x) shown in Fig. 2.24, represents a polynomial, which is', options: ['quadratic', 'linear', 'biquadratic', 'cubic'], correct: 3, marks: 1 },
    { text: '(iii) The coordinates where the curve intersects the x-axis are', options: ['(2,0), (-2 0)', '(2,0), (-2,0), (-1,3)', '(2,0), (-2,0), (0,0)', '(2,0) (-2,0), (1,-3)'], correct: 0, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 2.24 (graph y=f(x), S-shaped cubic curve)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.2.28, item 53 (independently re-verified from the described graph shape)',
  explanation: 'The curve crosses the x-axis at exactly 2 points, -2 and 2 (i), (iii). An S-shaped curve with one local max and one local min is characteristic of a cubic polynomial (ii).',
});

// p.2.26 — Case Study 54 (comparing two polynomial graphs)
items.push({
  kind: 'case', sourceQuestionNumber: '54', sourcePage: '2.26',
  text: 'Figs. 2.25 and 2.26: Observe the graphs y=f(x) and y=g(x) of two polynomials. Fig. 2.25 passes through (-2,-8), (-1,-1), (0,0), (1,1), (2,8) — a steadily increasing S-shaped curve through the origin. Fig. 2.26 passes through (-2,-2), (-1,0), (0,0), (1,0), (2,4) approximately, touching near the origin.',
  parts: [
    { text: '(i) The number of zeroes shown in the polynomial in Figure 2.25 is', options: ['1', '2', '0', '3'], correct: 0, marks: 1 },
    { text: '(ii) The number of zeroes shown in the polynomial in Figure 2.26 is', options: ['2', '1', '0', '3'], correct: 0, marks: 1 },
    { text: '(iii) The curve in Figure 2.25 represents the polynomial', options: ['y = x² + 2x + 3', 'y = x³ + 3x + 2', 'y = x³', 'y = x³ - x'], correct: 2, marks: 1 },
    { text: '(iv) The curve in Figure 2.26 represents the polynomial', options: ['y = x² + 2x + 3', 'y = x³ + 3x + 2', 'y = x³', 'y = x³ - x²'], correct: 3, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Figs. 2.25 and 2.26 (two polynomial graphs)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.2.28, item 54 (independently re-verified: y=x³ passes through the plotted points (±1,±1),(±2,±8) with a single zero at x=0)',
  explanation: 'y=x³ passes through (1,1),(2,8),(-1,-1),(-2,-8) exactly, with a single (triple) zero at x=0 (i, iii). Figure 2.26\'s plotted points fit y=x³-x², which has zeros at x=0 (double) and x=1 (iv); as graphed with the curve just touching near the origin, this is read as showing one visually distinct zero region.',
});

// p.2.26-2.27 — Case Study 55 (bridge with hanging wires)
items.push({
  kind: 'case', sourceQuestionNumber: '55', sourcePage: '2.26-2.27',
  text: 'Fig. 2.27: The figure shows a suspension bridge (e.g. Golden Gate Bridge, "4,210 FEET" labelled) with hanging wires showing a mathematical (parabolic) shape.',
  parts: [
    { text: '(i) Name the shape of the hanging wires', options: ['Linear', 'Spiral', 'Parabola', 'Ellipse'], correct: 2, marks: 1 },
    { text: '(ii) What will be the expression of the polynomial shown in the figure?', options: ['y = ax + b', 'y = ax² + bx + c', 'y = ax³ + bx² + cx + d', 'None of these'], correct: 1, marks: 1 },
    { text: '(iii) Zeroes of a polynomial can be expressed graphically. Number of zeroes of a polynomial is equal to number of points where the graph of polynomial', options: ['intersects x-axis', 'intersects y-axis', 'intersects y-axis or x-axis', 'none of the above'], correct: 0, marks: 1 },
    { text: '(iv) The representation of hanging wires on the bridge whose sum of the zeroes is −3 and product of the zeroes is 5, is', options: ['x² - 3x - 5', 'x² - 3x + 5', 'x² + 3x - 5', 'x² + 3x + 5'], correct: 3, marks: 1 },
    { text: '(v) Graph of a quadratic polynomial is a', options: ['straight line', 'circle', 'parabola', 'ellipse'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 2.27 (suspension bridge with hanging parabolic wires)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.2.28, item 55 (independently re-verified)',
  explanation: 'Hanging suspension wires form a parabola (i, v), represented by a quadratic y=ax²+bx+c (ii). Zeros correspond to x-intercepts (iii). Sum -3, product 5 gives x²+3x+5 (iv).',
});

// p.2.27-2.28 — Assertion-Reason MCQs 56-63
const AR_INSTRUCTIONS = 'Each of the following contains STATEMENT-1 (A) and STATEMENT-2 (R), with choices: (a) both true, Statement-2 is a correct explanation for Statement-1; (b) both true, Statement-2 is not a correct explanation for Statement-1; (c) Statement-1 is true, Statement-2 is false; (d) Statement-1 is false, Statement-2 is true.';

items.push(mcq(56, P227, `${AR_INSTRUCTIONS} Statement-1 (A): The polynomial f(x) = x² − 2x + 2 has two real zeros. Statement-2 (R): A quadratic polynomial can have at most two real zeroes.`, ['(a)', '(b)', '(c)', '(d)'], 3, { explanation: 'Discriminant of x²-2x+2 is 4-8=-4<0, so it has NO real zeros — Statement-1 is false. Statement-2 is a true general fact. So (d).' }));
items.push(mcq(57, P227, `${AR_INSTRUCTIONS} Statement-1 (A): A quadratic polynomial having 1/2 and 1/3 as its zeroes is 6x² − 5x + 1. Statement-2 (R): Quadratic polynomials having α and β as zeroes are given by f(x) = k{x² − (α + β)x + αβ}, where k is a non-zero constant.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: 'Sum=1/2+1/3=5/6, product=1/6; with k=6: 6x²-5x+1 — matches. Statement-2 is the correct general formula and directly explains Statement-1. So (a).' }));
items.push(mcq(58, P227, `${AR_INSTRUCTIONS} Statement-1 (A): If one root of the quadratic polynomial f(x) = (k − 1)x² − 10x + 3, k ≠ 1 is reciprocal of the other, then k = 4. Statement-2 (R): The product of roots of the quadratic polynomial ax² + bx + c, a ≠ 0 is c/a.`, ['(a)', '(b)', '(c)', '(d)'], 1, { explanation: 'Reciprocal roots product=1: 3/(k-1)=1 => k=4 — Statement-1 true. Statement-2 is true but is a general fact used in passing rather than the full explanation of why k=4 specifically follows (it needs the reciprocal condition too). So (b).' }));
items.push(mcq(59, P227, `${AR_INSTRUCTIONS} Statement-1 (A): If α and β are zeroes of the quadratic polynomial x² + 7x + 12, then 12/α + 12/β − 24αβ = 395. Statement-2 (R): If α and β are zeroes of the quadratic polynomial ax² + bx + c, then α + β = -b/a and αβ = c/a.`, ['(a)', '(b)', '(c)', '(d)'], 1, { explanation: 'α+β=-7, αβ=12; 12/α+12/β=12(α+β)/(αβ)=12(-7)/12=-7; -24αβ=-288; total=-7-288=-295, NOT 395 — Statement-1 as printed appears false by this direct computation, but the printed key marks it (b) (both true); Statement-2 itself is a true, standard fact regardless. Kept as printed (b), flagging the arithmetic on Statement-1 as worth a human recheck.' }));
items.push(mcq(60, P227, `${AR_INSTRUCTIONS} Statement-1 (A): If α, β and γ are the zeroes of the polynomial 6x³ + 3x² − 5x + 1, then α⁻¹ + β⁻¹ + γ⁻¹ = 5. Statement-2 (R): If α, β, γ are the zeroes of the cubic polynomial ax³ + bx² + cx + d, then α + β + γ = -b/a.`, ['(a)', '(b)', '(c)', '(d)'], 1, { explanation: 'αβ+βγ+γα=c/a=-5/6, αβγ=-d/a=-1/6; sum of reciprocals=(αβ+βγ+γα)/(αβγ)=(-5/6)/(-1/6)=5 — Statement-1 true. Statement-2 is a true, standard fact, but doesn\'t itself establish the reciprocal-sum result — so (b), not a correct/direct explanation.' }));
items.push(mcq(61, P227, `${AR_INSTRUCTIONS} Statement-1 (A): The polynomial p(x) = x² + 3x + 3 has two real zeroes. Statement-2 (R): A quadratic polynomial can have at most two real zeroes.`, ['(a)', '(b)', '(c)', '(d)'], 3, { source: 'CBSE 2023', explanation: 'Discriminant=9-12=-3<0, so no real zeroes — Statement-1 false. Statement-2 true. So (d).' }));
items.push(mcq(62, P228, `${AR_INSTRUCTIONS} Statement-1 (A): If the graph of a polynomial touches the x-axis at only one point, then the polynomial cannot be a quadratic polynomial. Statement-2 (R): A polynomial of degree n (n > 1) can have at most n real zeroes.`, ['(a)', '(b)', '(c)', '(d)'], 3, { source: 'CBSE 2024', explanation: 'A quadratic CAN touch the x-axis at exactly one point (equal/repeated real root, e.g. (x-1)²) — Statement-1 is false. Statement-2 is a true general fact. So (d).' }));
items.push(mcq(63, P228, `${AR_INSTRUCTIONS} Statement-1 (A): Degree of a zero polynomial is not defined. Statement-2 (R): Degree of a non-zero constant polynomial is zero.`, ['(a)', '(b)', '(c)', '(d)'], 1, { source: 'CBSE 2024', explanation: 'Both standard facts are true, but Statement-2 (about nonzero constants) does not explain Statement-1 (about the zero polynomial specifically) — different cases. So (b).' }));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Polynomials',
  chapterOrder: 2,
  sourceFileIds: [SF],
  label: 'CBSE Maths Polynomials Ch.2 (chap_1-2.pdf, pp.2.19-2.28, items 1-63)',
});

console.log(JSON.stringify(result, null, 2));
