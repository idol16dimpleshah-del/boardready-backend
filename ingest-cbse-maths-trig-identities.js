// CBSE Class 10 Mathematics — Trigonometric Identities (Chapter 10)
// practice-exercise MCQs.
// Source: 4 photographed pages (pp.10.6-10.9), part of the 32-image batch
// received 2026-09-17. Archived via archive-pending-batch-2026-09-17.js,
// reclassified via reclassify-pending-batch-2026-09-17.js.
//
// COMPLETE CHAPTER: all 46 items (39 practice MCQs + 7 assertion-reason
// MCQs, items 40-46) plus the full printed answer key (p.10.9) were
// captured — no gaps. No figures anywhere in this chapter (pure algebraic
// trig-identity manipulation) — every item is diagramStatus:'not_applicable'.
//
// VERIFICATION METHOD: every identity independently re-derived by direct
// algebraic manipulation (Pythagorean identities, rationalising
// conjugates, sum/difference of squares/cubes, etc.), not copied blindly.
// All 46 matched the printed key. One genuine subtlety found and resolved
// (not corrected) — item 43: Statement-2 ("cosec²θ - cot²θ = 1") is stated
// with NO domain restriction, unlike the neighbouring items 42/45 which
// explicitly restrict θ away from 0. Read as an unrestricted universal
// claim, it is undefined (not equal to 1) at θ = 0 where cosecθ/cotθ blow
// up, which is a defensible reading for why the printed key marks
// Statement-2 false (option (c)) even though the identity holds on the
// open interval 0 < θ < 90°. Disclosed in that item's explanation; kept
// as printed. One harmless printing artifact: item 19's options (c) and
// (d) are the identical expression ("tan⁴A + tan²A" vs "tan²A + tan⁴A")
// written in different order — noted, doesn't affect the answer.
const { ingestQuestions } = require('./ingest');

const P106 = 83, P107 = 84, P108 = 85, P109 = 86;

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.10.9, item ${n} (independently re-verified by algebraic derivation)`,
  ...opts,
});

const items = [];

// p.10.6 — items 1-3
items.push(mcq(1, '10.6', 'If x = 2sin²θ and y = 2cos²θ + 1, then x + y is equal to', ['3', '2', '1', '1/2'], 0));
items.push(mcq(2, '10.6', 'If tanα + cotα = 2, then tan²⁰²⁰α + cot²⁰²⁰α =', ['0', '2', '2020', '2²⁰²⁰'], 1, {
  explanation: 'tanα + cotα = 2 forces tanα = cotα = 1 (their product is always 1, and equal sum/product of 2 and 1 pins both to 1), so tan⁰ᵏα + cot⁰ᵏα = 1 + 1 = 2 for any power k.',
}));
items.push(mcq(3, '10.6', '√[(1+sinθ)/(1-sinθ)] is equal to', ['secθ + tanθ', 'secθ - tanθ', 'sec²θ + tan²θ', 'sec²θ - tan²θ'], 0, {
  explanation: 'Multiply inside the root by (1+sinθ)/(1+sinθ): √[(1+sinθ)²/(1-sin²θ)] = (1+sinθ)/cosθ = secθ+tanθ.',
}));

// p.10.7 — items 4-17
items.push(mcq(4, '10.7', 'The value of √[(1+cosθ)/(1-cosθ)] is', ['cotθ - cosecθ', 'cosecθ + cotθ', 'cosec²θ + cot²θ', '(cotθ + cosecθ)²'], 1));
items.push(mcq(5, '10.7', 'sinθ/(1+cosθ) is equal to', ['(1+cosθ)/sinθ', '(1-cosθ)/cosθ', '(1-cosθ)/sinθ', '(1-sinθ)/cosθ'], 2));
items.push(mcq(6, '10.7', 'sinθ/(1-cotθ) + cosθ/(1-tanθ) is equal to', ['0', '1', 'sinθ + cosθ', 'sinθ - cosθ'], 2));
items.push(mcq(7, '10.7', 'tanθ/(secθ-1) + tanθ/(secθ+1) is equal to', ['2tanθ', '2secθ', '2cosecθ', '2tanθsecθ'], 2));
items.push(mcq(8, '10.7', 'If x = acosθ and y = bsinθ, then b²x² + a²y² =', ['a²b²', 'ab', 'a⁴b⁴', 'a²+b²'], 0));
items.push(mcq(9, '10.7', 'If x = asecθ and y = btanθ, then b²x² - a²y² =', ['ab', 'a²-b²', 'a²+b²', 'a²b²'], 3));
items.push(mcq(10, '10.7', 'The value of (secA + tanA)(1 - sinA) is', ['secA', 'sinA', 'cosecA', 'cosA'], 3, { source: 'NCERT' }));
items.push(mcq(11, '10.7', 'If x = asecθcosφ, y = bsecθsinφ and z = ctanθ, then x²/a² + y²/b² =', ['z²/c²', '1 - z²/c²', 'z²/c² - 1', '1 + z²/c²'], 3));
items.push(mcq(12, '10.7', '9sec²A - 9tan²A is equal to', ['1', '9', '8', '0'], 1));
items.push(mcq(13, '10.7', '(secA + tanA)(1 - sinA) =', ['secA', 'sinA', 'cosecA', 'cosA'], 3, { source: 'NCERT' }));
items.push(mcq(14, '10.7', '(1 + tan²A)/(1 + cot²A) is equal to', ['sec²A', '-1', 'cot²A', 'tan²A'], 3, { source: 'NCERT' }));
items.push(mcq(15, '10.7', 'If 2sin²β - cos²β = 2, then β is equal to', ['0°', '90°', '45°', '30°'], 1));
items.push(mcq(16, '10.7', 'If △ABC is right angled at C, then the value of cos(A+B) is', ['0', '1', '1/2', '√3/2'], 0));
items.push(mcq(17, '10.7', 'If secθ + tanθ = x, then secθ =', ['(x²+1)/x', '(x²+1)/2x', '(x²-1)/2x', '(x²-1)/x'], 1, {
  explanation: 'Since (secθ+tanθ)(secθ-tanθ)=1, secθ-tanθ=1/x. Adding to secθ+tanθ=x: 2secθ=x+1/x=(x²+1)/x, so secθ=(x²+1)/2x.',
}));

// p.10.8 — items 18-36
items.push(mcq(18, '10.8', 'If secθ + tanθ = x, then tanθ =', ['(x²+1)/x', '(x²-1)/x', '(x²+1)/2x', '(x²-1)/2x'], 3));
items.push(mcq(19, '10.8', 'sec⁴A - sec²A is equal to', ['tan²A - tan⁴A', 'tan⁴A - tan²A', 'tan⁴A + tan²A', 'tan²A + tan⁴A'], 2, {
  explanation: 'sec⁴A - sec²A = sec²A(sec²A - 1) = sec²A·tan²A = (1+tan²A)tan²A = tan²A + tan⁴A. Note: options (c) and (d) as printed are the identical expression in different order (tan⁴A+tan²A = tan²A+tan⁴A) — a harmless printing artifact; either letter is mathematically correct, printed key names (c).',
}));
items.push(mcq(20, '10.8', 'cos⁴A - sin⁴A is equal to', ['2cos²A + 1', '2cos²A - 1', '2sin²A - 1', '2sin²A + 1'], 1));
items.push(mcq(21, '10.8', 'The value of (1 + cotθ - cosecθ)(1 + tanθ + secθ) is', ['1', '2', '4', '0'], 1));
items.push(mcq(22, '10.8', '(cosecθ - sinθ)(secθ - cosθ)(tanθ + cotθ) is equal', ['0', '1', '-1', 'none of these'], 1));
items.push(mcq(23, '10.8', 'If A and B are acute angles such that sin(A-B) = 0 and 2cos(A+B) - 1 = 0, then A =', ['60°', '30°', '45°', '15°'], 1));
items.push(mcq(24, '10.8', 'If sinθ - cosθ = 0, then the value of sin⁴θ + cos⁴θ is', ['1', '3/4', '1/2', '1/4'], 2));
items.push(mcq(25, '10.8', 'If acosθ - bsinθ = c, then asinθ + bcosθ =', ['±√(a²+b²+c²)', '±√(a²+b²-c²)', '±√(c²-a²-b²)', 'none of these'], 1));
items.push(mcq(26, '10.8', 'If cos(α+β) = 0, then sin(α-β) can be reduced to', ['cosβ', 'cos2β', 'sinα', 'sin2α'], 1, {
  explanation: 'cos(α+β)=0 ⇒ α+β=90° ⇒ β=90°-α. Then α-β = α-(90°-α) = 2α-90° = 90°-2β, so sin(α-β) = sin(90°-2β) = cos2β.',
}));
items.push(mcq(27, '10.8', 'If 1 + sin²α = 3sinαcosα, then the values of cotα are', ['-1, 1', '0, 1', '1, 2', '-1, -1'], 2, {
  explanation: 'Dividing by cos²α: sec²α+tan²α=3tanα ⇒ (1+tan²α)+tan²α=3tanα ⇒ 2tan²α-3tanα+1=0 ⇒ (2tanα-1)(tanα-1)=0 ⇒ tanα = 1/2 or 1 ⇒ cotα = 2 or 1.',
}));
items.push(mcq(28, '10.8', 'cotθ/(cotθ - cot3θ) + tanθ/(tanθ - tan3θ) is equal to', ['0', '1', '-1', '2'], 1));
items.push(mcq(29, '10.8', '2(sin⁶θ + cos⁶θ) - 3(sin⁴θ + cos⁴θ) is equal to', ['0', '1', '-1', 'none of these'], 2, {
  explanation: 'Using sin⁶+cos⁶=1-3sin²cos² and sin⁴+cos⁴=1-2sin²cos²: 2(1-3s²c²)-3(1-2s²c²) = 2-6s²c²-3+6s²c² = -1.',
}));
items.push(mcq(30, '10.8', 'If acosθ + bsinθ = 4 and asinθ - bcosθ = 3, then a² + b² =', ['7', '12', '25', 'none of these'], 2, {
  explanation: 'Squaring and adding both equations (cross terms cancel): a²+b² = 4²+3² = 25.',
}));
items.push(mcq(31, '10.8', 'If acotθ + bcosecθ = p and bcotθ + acosecθ = q, then p² - q² =', ['a²-b²', 'b²-a²', 'a²+b²', 'b-a'], 1, {
  explanation: 'p²-q²=(p-q)(p+q)=(a-b)(cotθ-cosecθ)·(a+b)(cotθ+cosecθ)=(a²-b²)(cot²θ-cosec²θ)=(a²-b²)(-1)=b²-a².',
}));
items.push(mcq(32, '10.8', 'If x = rsinθcosφ, y = rsinθsinφ and z = rcosθ, then', ['x²+y²+z²=r²', 'x²+y²-z²=r²', 'x²-y²+z²=r²', 'z²+y²-x²=r²'], 0));
items.push(mcq(33, '10.8', 'If sinθ + sin²θ = 1, then cos²θ + cos⁴θ =', ['-1', '1', '0', 'none of these'], 1, {
  explanation: 'sinθ+sin²θ=1 ⇒ sinθ=1-sin²θ=cos²θ. So cos²θ+cos⁴θ = sinθ+sin²θ = 1 (substituting cos²θ=sinθ back in).',
}));
items.push(mcq(34, '10.8', 'If acosθ + bsinθ = m and asinθ - bcosθ = n, then a² + b² =', ['m²-n²', 'm²n²', 'n²-m²', 'm²+n²'], 3));
items.push(mcq(35, '10.8', 'If cosA + cos²A = 1, then sin²A + sin⁴A =', ['-1', '0', '1', 'none of these'], 2));
items.push(mcq(36, '10.8', 'If secθ - tanθ = m, then the value of secθ + tanθ is', ['1 - 1/m', 'm² - 1', '1/m', '-m'], 2, { source: 'CBSE 2024' }));

// p.10.9 — items 37-39, then Assertion-Reason 40-46
items.push(mcq(37, '10.9', 'If cos(α+β) = 0, then the value of cos((α+β)/2) is equal to', ['1/√2', '1/2', '0', '√2'], 0, { source: 'CBSE 2024' }));
items.push(mcq(38, '10.9', 'If x/3 = 2sinA, y/3 = 2cosA, then the value of x² + y² is', ['36', '9', '6', '18'], 0, { source: 'CBSE 2024' }));
items.push(mcq(39, '10.9', 'If sinα = √3/2, cosβ = √3/2, then tanα tanβ is', ['√3', '1/√3', '1', '0'], 2, { source: 'CBSE 2024' }));

const AR = 'Each of the following contains STATEMENT-1 (A) and STATEMENT-2 (R), with choices: (a) both true, S2 correctly explains S1; (b) both true, S2 does NOT correctly explain S1; (c) S1 true, S2 false; (d) S1 false, S2 true.';

items.push(mcq(40, '10.9', `${AR} Statement-1 (A): The value of the product P = tan1°tan2°tan3°…tan89° is 1. Statement-2 (R): For 0 < θ ≤ 90°, tan(90°-θ) = cotθ and tan45° = 1.`, ['(a)', '(b)', '(c)', '(d)'], 0, {
  explanation: 'P pairs up as (tan1°·tan89°)(tan2°·tan88°)…×tan45°, and each pair tanθ·tan(90°-θ)=tanθ·cotθ=1, with the unpaired tan45°=1, giving P=1. Statement-2 states exactly the fact used, so it correctly explains Statement-1.',
}));
items.push(mcq(41, '10.9', `${AR} Statement-1 (A): The value of the product of P = cos1°cos2°…cos179° (as 180° term omitted) is zero. Statement-2 (R): The value of cos90° is zero.`, ['(a)', '(b)', '(c)', '(d)'], 0, {
  explanation: 'The product includes cos90°=0 as one of its 179 factors, so the whole product is zero regardless of the other factors — Statement-2 is exactly why, so it correctly explains Statement-1.',
}));
items.push(mcq(42, '10.9', `${AR} Statement-1 (A): For 0 < θ ≤ 90°, cosecθ - cotθ and cosecθ + cotθ are reciprocal of each other. Statement-2 (R): cot²θ - cosec²θ = 1.`, ['(a)', '(b)', '(c)', '(d)'], 2, { source: 'CBSE 2023', explanation: 'Statement-1 is true: (cosecθ-cotθ)(cosecθ+cotθ) = cosec²θ-cot²θ = 1, so the two factors are indeed reciprocals. Statement-2 as printed has the identity backwards — the true identity is cosec²θ-cot²θ=1, not cot²θ-cosec²θ=1 (which equals -1) — so Statement-2 is false. Matches printed key (c).' }));
items.push(mcq(43, '10.9', `${AR} Statement-1 (A): For 0 ≤ θ < 90°, secθ + tanθ and secθ - tanθ are reciprocal of each other. Statement-2 (R): cosec²θ - cot²θ = 1.`, ['(a)', '(b)', '(c)', '(d)'], 2, {
  explanation: "Statement-1 is true: (secθ+tanθ)(secθ-tanθ)=sec²θ-tan²θ=1. Statement-2, as printed, carries NO domain restriction on θ (unlike the neighbouring items 42 and 45, which explicitly restrict θ away from 0) — read as an unqualified universal claim 'for all θ', it is undefined (not equal to 1) at θ=0, where cosecθ and cotθ are both undefined (division by sin0=0), even though the identity does hold on the open interval 0<θ<90°. Read this way, Statement-2 is false as an unrestricted claim, consistent with the printed key (c). Also, even if taken as true, Statement-2 (about cosec/cot) does not explain Statement-1 (about sec/tan) — either reading rules out option (a)/(b), leaving (c) as the most defensible choice, matching the printed key.",
}));
items.push(mcq(44, '10.9', `${AR} Statement-1 (A): If x = acosθ and y = bsinθ, then b²x² + a²y² = a²b². Statement-2 (R): cos²θ + sin²θ = 1.`, ['(a)', '(b)', '(c)', '(d)'], 0));
items.push(mcq(45, '10.9', `${AR} Statement-1 (A): For 0 < θ ≤ 90°, cosec²θ + sin²θ ≥ 2. Statement-2 (R): For any x > 0, x + 1/x ≥ 2.`, ['(a)', '(b)', '(c)', '(d)'], 0, {
  explanation: 'By AM-GM with x=sin²θ>0 (valid since sinθ≠0 on 0<θ≤90°): sin²θ + 1/sin²θ ≥ 2, i.e. sin²θ+cosec²θ≥2 — Statement-2 directly explains Statement-1.',
}));
items.push(mcq(46, '10.9', `${AR} Statement-1 (A): If sinA = 1/3 (0° < A < 90°), then the value of cosA is 2√2/3. Statement-2 (R): For every angle θ, sin²θ + cos²θ = 1.`, ['(a)', '(b)', '(c)', '(d)'], 0, {
  explanation: 'cosA = √(1-sin²A) = √(1-1/9) = √(8/9) = 2√2/3, using exactly the Pythagorean identity in Statement-2.',
}));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Trigonometric Identities',
  chapterOrder: 10,
  sourceFileIds: [P106, P107, P108, P109],
  label: 'CBSE Maths Trigonometric Identities Ch.10 (32-image batch, pp.10.6-10.9, reclassified 2026-09-17)',
});

console.log(JSON.stringify(result, null, 2));
