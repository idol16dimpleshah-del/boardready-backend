// Chapter 7 (Proportion) — full source ingestion. 10 source pages (7.2-7.11),
// all 73 real questions transcribed directly from page images (pdftotext
// confirmed unusable/garbled on this source, per project convention — every
// item below was read visually off rendered page PNGs). Structure actually
// found after reading the ENTIRE chapter page range (not just the first MCQ
// block, per the founder's standing instruction): plain MCQs (1)-(63), then
// an "Assertion and Reasoning" section (64)-(73) — no case-study passage in
// this chapter (confirmed by reading every page; none appears).
//
// Every answer cross-checked one-by-one against answer.pdf's chapter 7
// "PROPORTION" block (p.25.5-25.6). Six genuine discrepancies found between
// the printed answer key and independent re-derivation of the algebra —
// each is flagged needs_review below with the worked-out reasoning, per the
// founder's explicit standing instruction to flag rather than silently trust
// or silently override a key that doesn't check out:
//   (54) Dividendo applied to x = (√(2-x)+√(2+x))/√(2+x) gives
//        x-1 = [√(2-x)+√(2+x)-√(2+x)]/√(2+x) (subtracting the denominator,
//        which is √(2+x), from the numerator) — that's option D exactly.
//        The key marks B, whose numerator instead subtracts √(2-x), which is
//        not the dividendo step. Independent answer: D.
//   (55) (x²+3x)/(3x²+1) = 14/13 cross-multiplies to 29x²-39x+14=0, whose
//        discriminant is 1521-1624 = -103 < 0 — no real root exists, so NONE
//        of the printed options (2, -1, 4, 3) can satisfy the equation as
//        transcribed (checked all four directly too: none give 14/13). The
//        key marks A (x=2, which actually gives 10/13). Likely a printed
//        constant typo in the source itself; flagged rather than guessed.
//   (56) Componendo-dividendo on (a^5+b^5)/(a^5-b^5)=122/121 gives
//        a^5/b^5 = 243/1, so a/b = 3, i.e. b:a = 1:3 (option C). The key
//        marks B (3:1), which is a:b, not b:a as the question asks.
//   (57) a = 4xy/(x+y); (a+2x)/(a-2x) simplifies to (x+3y)/(y-x) =
//        (3y+x)/(y-x), which is option B verbatim. The key marks A
//        ((3x+y)/(y-x)), a transposed-coefficient distractor.
//   (58) (3x+√(9x²-5))/(3x-√(9x²-5))=5 solves to s=2x (s=√(9x²-5)), giving
//        5x²=5, x=1 (checked directly: (3+2)/(3-2)=5 ✓) — option A. The key
//        marks D (x=3), which fails the equation when substituted directly.
//   (62) ab=1, bc=1/2, cd=6, de=2, ef=1/2 solved through in terms of a gives
//        ad=12, be=1/6, cf=3/2, i.e. ad:be:cf = 72:1:9 (option D) — verified
//        independent of the free variable a. The key marks B (6:1:9).
// All ten Assertion-Reasoning items (64)-(73) were independently re-checked
// truth-value by truth-value and every one matches the key exactly — no
// issues there.
const { ingestQuestions } = require('./ingest');

function page(p) { return p; }

const items = [
  { text: 'Which of the following represents xy = 64?', options: ['8 : x = 8 : y', 'x : 16 = y : 4', 'x : 8 = y : 8', '32 : x = y : 2'], correct: 3, difficulty: 'Medium', subConcept: 'Proportion basics', sourcePage: page('7.2'), sourceQuestionNumber: '1' },
  { text: 'If (x + 1) : 8 = 3¾ : 7, then the value of x is:', options: ['1 2/7', '2 2/7', '3 2/7', '4 2/7'], correct: 2, difficulty: 'Medium', subConcept: 'Proportion basics', sourcePage: page('7.2'), sourceQuestionNumber: '2' },
  { text: 'If √2 : (1 + √3) :: √6 : x, then x is equal to:', options: ['√3 + 3', '1 - √3', '√3 - 3', '1 + √3'], correct: 0, difficulty: 'Medium', subConcept: 'Proportion basics', sourcePage: page('7.2'), sourceQuestionNumber: '3' },
  { text: 'If a, b, c and d are in proportion, then the correct option is:', options: ['ab = cd', 'ac = bd', 'ad = cd', 'ad = bc'], correct: 3, difficulty: 'Easy', subConcept: 'Proportion basics', sourcePage: page('7.2'), sourceQuestionNumber: '4' },
  { text: 'If the numbers 3, x, 6, 10 are in proportion, then the value of x is:', options: ['4', '6', '3', '5'], correct: 3, difficulty: 'Easy', subConcept: 'Proportion basics', sourcePage: page('7.2'), sourceQuestionNumber: '5' },
  { text: 'The fourth proportional to 5, 8, 15 is:', options: ['18', '20', '21', '24'], correct: 3, difficulty: 'Easy', subConcept: 'Fourth proportional', sourcePage: page('7.2'), sourceQuestionNumber: '6' },
  { text: 'The third proportional to 38 and 15 is:', options: ['15/(38 × 38)', '(38 × 38)/15', '(15 × 15)/38', '(38 × 15)/2'], correct: 2, difficulty: 'Easy', subConcept: 'Third proportional', sourcePage: page('7.2'), sourceQuestionNumber: '7' },
  { text: 'The third proportion to 6¼ and 5 is:', options: ['12½', '4', '10', '25'], correct: 1, difficulty: 'Medium', subConcept: 'Third proportional', sourcePage: page('7.2'), sourceQuestionNumber: '8' },
  { text: 'The third proportional to (x² - y²) and (x - y) is:', options: ['(x - y)/(x + y)', '(x + y)/(x - y)', '(x + y)', '(x - y)'], correct: 0, difficulty: 'Medium', subConcept: 'Third proportional', sourcePage: page('7.2'), sourceQuestionNumber: '9' },
  { text: 'The third proportional to (a - b) and (a² - b²) is:', options: ['(a - b)²(a + b)', '(a + b)²(a - b)', '(a - b)(a + b)^(1/2)', '(a² - b²)(a - b)'], correct: 1, difficulty: 'Medium', subConcept: 'Third proportional', sourcePage: page('7.2'), sourceQuestionNumber: '10' },
  { text: 'The mean proportion between 1/2 and 128 is:', options: ['64', '32', '16', '8'], correct: 3, difficulty: 'Easy', subConcept: 'Mean proportion', sourcePage: page('7.2'), sourceQuestionNumber: '11' },

  { text: 'The mean proportion between 0.02 and 0.32 is:', options: ['0.08', '0.16', '0.3', '0.34'], correct: 0, difficulty: 'Easy', subConcept: 'Mean proportion', sourcePage: page('7.3'), sourceQuestionNumber: '12' },
  { text: 'The mean proportion between (3 + √2) and (12 - √32) is:', options: ['28', '2√7', '√7', '14'], correct: 1, difficulty: 'Hard', subConcept: 'Mean proportion', sourcePage: page('7.3'), sourceQuestionNumber: '13' },
  { text: 'If a, 12, 16 and b are in continued proportion, then a : b is:', options: ['27 : 64', '64 : 26', '64 : 3', '3 : 64'], correct: 0, difficulty: 'Medium', subConcept: 'Continued proportion', sourcePage: page('7.3'), sourceQuestionNumber: '14' },
  { text: 'If (x + 1) is the mean proportion between (x - 3) and (x + 7), then value of x is:', options: ['12', '11', '10', '8'], correct: 1, difficulty: 'Medium', subConcept: 'Mean proportion', sourcePage: page('7.3'), sourceQuestionNumber: '15' },
  { text: 'The mean proportion between x and y is 6. The third proportional to x and y is 48. Then x : y equals:', options: ['1 : 3', '1 : 4', '1 : 6', '1 : 9'], correct: 1, difficulty: 'Hard', subConcept: 'Mean and third proportional', sourcePage: page('7.3'), sourceQuestionNumber: '16' },
  { text: '28 is the mean proportion between two numbers p and q and 224 is the third proportion to p and q, then which of the following statement is false:', options: ['p/q = 28/224', 'p/28 = 28/q', 'p/q = q/224', 'p/q = 7/2p'], correct: 0, difficulty: 'Hard', subConcept: 'Mean and third proportional', sourcePage: page('7.3'), sourceQuestionNumber: '17' },
  { text: 'The ratio between the third proportional to 12 and 30 and mean proportion of 9 and 25 is:', options: ['2 : 1', '5 : 1', '7 : 15', '9 : 14'], correct: 1, difficulty: 'Medium', subConcept: 'Mean and third proportional', sourcePage: page('7.3'), sourceQuestionNumber: '18' },
  { text: 'Mean proportion between two numbers a and b is 12 and their third proportion is 96, then value of a + b is:', options: ['30', '24', '32', '18'], correct: 0, difficulty: 'Hard', subConcept: 'Mean and third proportional', sourcePage: page('7.3'), sourceQuestionNumber: '19' },
  { text: 'Sachin, Dhoni and Virat together scored 152 runs in a T20 match. Their scores are in continued proportion. Dhoni and Virat together scored 8 runs more than Sachin. Then the runs scored by Sachin is:', options: ['32', '48', '72', '24'], correct: 2, difficulty: 'Hard', subConcept: 'Continued proportion word problem', sourcePage: page('7.3'), sourceQuestionNumber: '20' },
  { text: 'What must be subtracted from each of 7, 9, 11 and 15 so that the resulting numbers are in proportion?', options: ['1', '2', '3', '5'], correct: 2, difficulty: 'Medium', subConcept: 'Proportion word problem', sourcePage: page('7.3'), sourceQuestionNumber: '21' },
  { text: 'What number must be added to each of the numbers 7, 11 and 19 so that the resulting numbers may be in continued proportion?', options: ['-4', '-3', '3', '4'], correct: 1, difficulty: 'Medium', subConcept: 'Continued proportion word problem', sourcePage: page('7.3'), sourceQuestionNumber: '22' },

  { text: 'The table shows the values of x and y, where x is proportional to y. [Table: x = 6, 12, N | y = M, 18, 6] What are the values of M and N?', options: ['M = 4, N = 9', 'M = 9, N = 3', 'M = 9, N = 4', 'M = 12, N = 0'], correct: 2, difficulty: 'Medium', subConcept: 'Direct proportion (table)', sourcePage: page('7.4'), sourceQuestionNumber: '23' },
  { text: 'The given table shows the distance covered and the time taken by a train moving at a uniform speed along a straight track. [Table: Distance (m) = 60, 90, y | Time (sec) = 2, x, 5] The values of x and y are:', options: ['x = 4, y = 150', 'x = 3, y = 100', 'x = 4, y = 100', 'x = 3, y = 150'], correct: 3, difficulty: 'Medium', subConcept: 'Direct proportion (table)', sourcePage: page('7.4'), sourceQuestionNumber: '24' },
  { text: 'If a/b = b/c = c/d, then (b³ + c³ + d³)/(a³ + b³ + c³) is equal to:', options: ['a/b', 'b/c', 'c/d', 'd/a'], correct: 3, difficulty: 'Hard', subConcept: 'Continued proportion (algebraic)', sourcePage: page('7.4'), sourceQuestionNumber: '25' },
  { text: 'If a, b, c and d are in proportion, then √((3a² + 5c²)/(3b² + 5d²)) =', options: ['a/b', '√(a/b)', 'c²/d²', 'd/c'], correct: 0, difficulty: 'Hard', subConcept: 'Proportion (algebraic identities)', sourcePage: page('7.4'), sourceQuestionNumber: '26' },
  { text: 'If a, b, c are in continued proportion, then ((ab + bc + ac)/(a + b + c))³ =', options: ['abc', '(abc)³', 'a³b³c³', 'a²b²c²'], correct: 0, difficulty: 'Hard', subConcept: 'Continued proportion (algebraic)', sourcePage: page('7.4'), sourceQuestionNumber: '27' },
  { text: 'If b is the mean proportion between a and c, then (a² - b² + c²)/(a⁻² - b⁻² + c⁻²) is equal to:', options: ['a⁴', 'b⁴', 'a²', 'b²'], correct: 1, difficulty: 'Hard', subConcept: 'Mean proportion (algebraic)', sourcePage: page('7.4'), sourceQuestionNumber: '28' },
  { text: 'If b is the mean proportion between a and c, then the mean proportion between (a² + b²) and (b² + c²) is:', options: ['a(b + c)', 'b(a + c)', 'c(a + b)', 'ac(a + c)'], correct: 1, difficulty: 'Hard', subConcept: 'Mean proportion (algebraic)', sourcePage: page('7.4'), sourceQuestionNumber: '29' },
  { text: 'If a : b = b : c then a⁴ : b⁴ would be equal to:', options: ['ac : b²', 'a² : c²', 'b² : ac', 'c² : a²'], correct: 1, difficulty: 'Medium', subConcept: 'Continued proportion (algebraic)', sourcePage: page('7.4'), sourceQuestionNumber: '30' },

  { text: 'x, y, z are in continued proportion then x/z =', options: ['y²/z²', 'y²/x²', 'x²y²', 'x/y²'], correct: 1, difficulty: 'Medium', subConcept: 'Continued proportion (algebraic)', sourcePage: page('7.5'), sourceQuestionNumber: '31' },
  { text: 'If x : y = 3 : 2, then the ratio (2x² + 3y²) : (3x² - 2y²) is equal to:', options: ['5 : 3', '6 : 5', '12 : 5', '30 : 19'], correct: 3, difficulty: 'Medium', subConcept: 'Ratio substitution', sourcePage: page('7.5'), sourceQuestionNumber: '32' },
  { text: 'If a : b = 5 : 3 then the value of (5a - 3b)/(5a + 3b) is:', options: ['9/15', '3/7', '8/17', '4/21'], correct: 2, difficulty: 'Medium', subConcept: 'Ratio substitution', sourcePage: page('7.5'), sourceQuestionNumber: '33' },
  { text: 'If a : b = c : d, then (ma + nc)/(mb + nd) is equal to:', options: ['m : n', 'dm : cn', 'an : mb', 'a : b'], correct: 3, difficulty: 'Medium', subConcept: 'Proportion (algebraic)', sourcePage: page('7.5'), sourceQuestionNumber: '34' },
  { text: 'If (5a + 3b) : (2a - 3b) = 23 : 5, then the value of a : b is:', options: ['1 : 2', '1 : 4', '2 : 1', '4 : 1'], correct: 3, difficulty: 'Medium', subConcept: 'Componendo-dividendo', sourcePage: page('7.5'), sourceQuestionNumber: '35' },
  { text: 'If (4x² - 3y²) : (2x² + 5y²) = 12 : 19, then x : y is:', options: ['2 : 3', '1 : 2', '2 : 1', '3 : 2'], correct: 3, difficulty: 'Hard', subConcept: 'Componendo-dividendo', sourcePage: page('7.5'), sourceQuestionNumber: '36' },
  { text: 'If (x + y) : (x - y) = 4 : 1, then (x² + y²) : (x² - y²) is:', options: ['8 : 17', '17 : 8', '16 : 1', '25 : 9'], correct: 1, difficulty: 'Medium', subConcept: 'Componendo-dividendo', sourcePage: page('7.5'), sourceQuestionNumber: '37' },
  { text: 'If x² + 4y² = 4xy, then x : y is:', options: ['1 : 1', '1 : 2', '1 : 4', '2 : 1'], correct: 3, difficulty: 'Medium', subConcept: 'Ratio from equation', sourcePage: page('7.5'), sourceQuestionNumber: '38' },
  { text: 'If (x² + y²) : 2xy = 5 : 3, then the possible values of x : y is:', options: ['1 : 1', '1 : 2', '3 : 1', '2 : 1'], correct: 2, difficulty: 'Hard', subConcept: 'Componendo-dividendo', sourcePage: page('7.5'), sourceQuestionNumber: '39' },
  { text: 'If (3x + 5y) : (3x - 5y) = 7 : 3, then x : y is:', options: ['25 : 6', '5 : 3', '6 : 25', '25 : 3'], correct: 0, difficulty: 'Medium', subConcept: 'Componendo-dividendo', sourcePage: page('7.5'), sourceQuestionNumber: '40' },
  { text: 'If x : y = 5 : 9, then the value of (y² - x²)/(y² + x²) is:', options: ['28/53', '53/28', '23/58', '82/35'], correct: 0, difficulty: 'Medium', subConcept: 'Ratio substitution', sourcePage: page('7.5'), sourceQuestionNumber: '41' },
  { text: 'If (9a - 5b)/(9c - 5d) = (9a + 5b)/(9c + 5d), then', options: ['a/d = c/b', 'c/a = d/b', 'c/b = b/d', 'a/d = b/c'], correct: 1, difficulty: 'Hard', subConcept: 'Proportion (algebraic)', sourcePage: page('7.5'), sourceQuestionNumber: '42' },

  { text: 'If 3x = 2y, then the value of (4x³ + y³)/(4x³ - y³) is:', options: ['59/5', '5/59', '9/59', '59/9'], correct: 0, difficulty: 'Hard', subConcept: 'Ratio substitution', sourcePage: page('7.6'), sourceQuestionNumber: '43' },
  { text: 'If (11a + 7b)/(11c + 7d) = (11a - 7b)/(11c - 7d), then', options: ['c/d = a/b', 'c/a = d/b', 'c/b = a/d', 'b/d = a/c'], correct: 0, difficulty: 'Hard', subConcept: 'Proportion (algebraic)', sourcePage: page('7.6'), sourceQuestionNumber: '44' },
  { text: 'If (a² + b²)/(a² - b²) = 37/12, then a : b is:', options: ['7 : 5', '5 : 7', '5 : 8', '8 : 3'], correct: 0, difficulty: 'Hard', subConcept: 'Componendo-dividendo', sourcePage: page('7.6'), sourceQuestionNumber: '45' },
  { text: 'If x/y = p/q then (x + y)/y = (p + q)/q is known as:', options: ['Alterendo', 'Componendo', 'Invertendo', 'Dividendo'], correct: 1, difficulty: 'Easy', subConcept: 'Properties of proportion (definitions)', sourcePage: page('7.6'), sourceQuestionNumber: '46' },
  { text: 'If p/q = r/s, then by applying Dividendo:', options: ['(p - q)/p = (r - s)/r', '(p - q)/q = (r - s)/s', '(q - p)/q = (s - r)/s', '(q - p)/p = (s - r)/r'], correct: 1, difficulty: 'Medium', subConcept: 'Properties of proportion (definitions)', sourcePage: page('7.6'), sourceQuestionNumber: '47' },
  { text: 'If p : q = r : s, then by applying Alternendo property:', options: ['s : p = r : q', 'p : s = r : q', 'p : r = q : s', 'q : s = p : r'], correct: 0, difficulty: 'Medium', subConcept: 'Properties of proportion (definitions)', sourcePage: page('7.6'), sourceQuestionNumber: '48' },
  { text: 'If 7a/2b = 5r/3s, then by applying Alternendo, the proportion becomes:', options: ['7a/5r = 2b/3s', '2b/3s = 5r/3a', '7a/2b = 3s/5r', '2b/7a = 3s/5r'], correct: 0, difficulty: 'Medium', subConcept: 'Properties of proportion (definitions)', sourcePage: page('7.6'), sourceQuestionNumber: '49' },
  { text: 'If 5a/8b = 3c/4d then by applying Invertendo, the proportion becomes:', options: ['5a/4d = 3c/8b', '5a/8b = 4d/3c', '5a/3c = 8b/4d', '8b/5a = 4d/3c'], correct: 3, difficulty: 'Medium', subConcept: 'Properties of proportion (definitions)', sourcePage: page('7.6'), sourceQuestionNumber: '50' },
  { text: 'If 3a/7b = 4c/5d, then by Componendo and Dividendo:', options: ['(3a - 7b)/(3a + 7b) = (4c + 5d)/(4c - 5d)', '(3a + 7b)/(3a - 7b) = (4c + 5d)/(4c - 5d)', '(3a + 7b)/(3a - 7b) = (4c - 5d)/(4c + 5d)', '(7b + 3a)/(7b - 3a) = (5d + 4c)/(5d - 4c)'], correct: 1, difficulty: 'Medium', subConcept: 'Componendo-dividendo', sourcePage: page('7.6'), sourceQuestionNumber: '51' },

  { text: 'If 7x/5y = 9/8, then by using Componendo and Dividendo:', options: ['(7x - 5y)/(7x + 5y) = 1/17', '(7x + 5y)/(7x - 5y) = 17', '(7x - 5y)/(7x + 5y) = 17', '(7x + 5y)/(7x - 5y) = 1/17'], correct: 1, difficulty: 'Medium', subConcept: 'Componendo-dividendo', sourcePage: page('7.7'), sourceQuestionNumber: '52' },
  {
    text: 'If x = (√(3a+b) + √(3a-b)) / (√(3a+b) - √(3a-b)), then applying Componendo and Dividendo we get:',
    options: [
      '(x+1)/(x-1) = [√(3a+b)+√(3a-b)+√(3a+b)-√(3a-b)] / [√(3a+b)-√(3a-b)-√(3a+b)+√(3a-b)]',
      '(x+1)/(x-1) = [√(3a+b)+√(3a-b)+√(3a+b)+√(3a-b)] / [√(3a+b)-√(3a-b)+√(3a+b)-√(3a-b)]',
      '(x+1)/(x-1) = [√(3a+b)+√(3a-b)+√(3a+b)-√(3a-b)] / [√(3a+b)+√(3a-b)-√(3a+b)+√(3a-b)]',
      '(x+1)/(x-1) = [√(3a+b)+√(3a-b)+√(3a-b)-√(3a+b)] / [√(3a+b)+√(3a-b)-√(3a-b)+√(3a+b)]',
    ],
    correct: 2, difficulty: 'Hard', subConcept: 'Componendo-dividendo (radicals)', sourcePage: page('7.7'), sourceQuestionNumber: '53',
  },
  {
    text: 'If x = (√(2-x) + √(2+x)) / √(2+x), then on applying Dividendo we get:',
    options: [
      'x = [√(2-x)+√(2+x)-√(2+x)] / √(2+x)',
      'x-1 = [√(2-x)+√(2+x)-√(2-x)] / √(2+x)',
      'x+1 = [√(2+x)-√(2-x)-√(2+x)] / √(2+x)',
      'x-1 = [√(2-x)+√(2+x)-√(2+x)] / √(2+x)',
    ],
    correct: 1, difficulty: 'Hard', subConcept: 'Dividendo (radicals)', sourcePage: page('7.7'), sourceQuestionNumber: '54',
    status: 'needs_review',
    explanation: 'Dividendo (subtract the common denominator from the numerator) on x = N/D with D=√(2+x) gives x-1 = (N-D)/D = [√(2-x)+√(2+x)-√(2+x)]/√(2+x) — exactly option D. The key marks option B, whose numerator instead subtracts √(2-x) (not the denominator D), which is not the dividendo step. Flagged rather than silently corrected.',
  },
  {
    text: 'If (x² + 3x)/(3x² + 1) = 14/13, then the value of x is:',
    options: ['2', '-1', '4', '3'], correct: 0, difficulty: 'Hard', subConcept: 'Proportion equations', sourcePage: page('7.7'), sourceQuestionNumber: '55',
    status: 'needs_review',
    explanation: 'Cross-multiplying gives 29x² - 39x + 14 = 0, discriminant 39² - 4(29)(14) = 1521 - 1624 = -103 < 0 — no real root exists, and none of the four printed options (2, -1, 4, 3) satisfies the equation as transcribed when substituted directly (x=2 gives 10/13, not 14/13). Likely a printed-constant typo in the source. Flagged rather than guessed.',
  },
  {
    text: 'If (a⁵ + b⁵)/(a⁵ - b⁵) = 122/121, using the properties of proportion, then the value of b : a is:',
    options: ['8 : 9', '3 : 1', '1 : 3', '8 : 27'], correct: 1, difficulty: 'Hard', subConcept: 'Componendo-dividendo', sourcePage: page('7.7'), sourceQuestionNumber: '56',
    status: 'needs_review',
    explanation: 'Componendo-dividendo gives a⁵/b⁵ = (122+121)/(122-121) = 243, so a/b = 3 and therefore b:a = 1:3 (option C). The key marks option B (3:1), which is the value of a:b rather than b:a as the question specifically asks.',
  },
  {
    text: 'If a = 4xy/(x + y), then the value of (a + 2x)/(a - 2x) equals:',
    options: ['(3x + y)/(y - x)', '(3y + x)/(y - x)', '(3x - y)/(x - y)', '(y - 3x)/(y - x)'], correct: 0, difficulty: 'Hard', subConcept: 'Ratio substitution', sourcePage: page('7.7'), sourceQuestionNumber: '57',
    status: 'needs_review',
    explanation: '(a+2x)/(a-2x) simplifies to (x+3y)/(y-x), i.e. (3y+x)/(y-x) — option B verbatim. The key marks option A ((3x+y)/(y-x)), a transposed-coefficient distractor.',
  },
  {
    text: 'If (3x + √(9x² - 5))/(3x - √(9x² - 5)) = 5, then the positive value of x is:',
    options: ['1', '5', '2', '3'], correct: 3, difficulty: 'Hard', subConcept: 'Componendo-dividendo (radicals)', sourcePage: page('7.7'), sourceQuestionNumber: '58',
    status: 'needs_review',
    explanation: 'Letting s = √(9x²-5): (3x+s)/(3x-s)=5 gives s=2x, so 9x²-5=4x² → x²=1 → x=1 (checked directly: (3+2)/(3-2)=5 ✓) — option A. The key marks option D (x=3), which does not satisfy the original equation when substituted (LHS ≈ 63.3, not 5).',
  },
  { text: 'If (√(1+x) + √(1-x)) / (√(1+x) - √(1-x)) = a/b, then (a+b)/(a-b) equals:', options: ['√((1-x)/(1+x))', '(1+x)/(1-x)', '(1-x)/(1+x)', '√((1+x)/(1-x))'], correct: 3, difficulty: 'Hard', subConcept: 'Componendo-dividendo (radicals)', sourcePage: page('7.7'), sourceQuestionNumber: '59' },

  { text: 'If x = (√(2a+1) + √(2a-1)) / (√(2a+1) - √(2a-1)), then which of the following is true?', options: ['x² + 2ax + 1 = 0', 'x² - 2ax + 1 = 0', 'x² + 4ax - 1 = 0', 'x² - 4ax + 1 = 0'], correct: 3, difficulty: 'Hard', subConcept: 'Componendo-dividendo (radicals)', sourcePage: page('7.8'), sourceQuestionNumber: '60' },
  { text: 'If a, 12, 16 and b are in continued proportion, then a : b is', options: ['27 : 64', '64 : 26', '64 : 3', '3 : 64'], correct: 0, difficulty: 'Medium', subConcept: 'Continued proportion', sourcePage: page('7.8'), sourceQuestionNumber: '61' },
  {
    text: 'Six numbers a, b, c, d, e, f are such that ab = 1, bc = 1/2, cd = 6, de = 2 and ef = 1/2. What is the value of (ad : be : cf)?',
    options: ['4 : 3 : 27', '6 : 1 : 9', '8 : 9 : 9', '72 : 1 : 9'], correct: 1, difficulty: 'Hard', subConcept: 'Chained ratios', sourcePage: page('7.8'), sourceQuestionNumber: '62',
    status: 'needs_review',
    explanation: 'Solving the chain in terms of a (b=1/a, c=a/2, d=12/a, e=a/6, f=3/a) gives ad=12, be=1/6, cf=3/2 — independent of a — i.e. ad:be:cf = 72:1:9 (option D). The key marks option B (6:1:9).',
  },
  { text: 'If a + c = 2b and 1/b + 1/d = 2/c, then:', options: ['a : d = c : b', 'a : b = c : d', 'a : c = d : b', 'b : a = c : d'], correct: 1, difficulty: 'Hard', subConcept: 'Proportion (algebraic)', sourcePage: page('7.8'), sourceQuestionNumber: '63' },

  { text: 'Assertion (A): The mean proportion between a²b and 1/b is a/b. Reason (R): The mean proportion between x and y is given by √(xy).', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 1, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('7.8'), sourceQuestionNumber: '64' },
  { text: 'Assertion (A): The mean proportion of (√3 - √2) and (√3 + √2) is 1. Reason (R): Mean proportion of x = (a - b) and y = (a + b) is (1/2)(x + y).', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('7.8'), sourceQuestionNumber: '65' },
  { text: 'Assertion (A): If x and y are positive and (2x² - 5y²) : xy = 1 : 3, then x : y = 3 : 5. Reason (R): If four quantities a, b, c and d form a proportion, then Componendo and Dividendo property states that (a + c) : (a - c) = (b - d) : (b + d)', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 3, difficulty: 'Hard', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('7.8'), sourceQuestionNumber: '66' },

  { text: 'Assertion (A): If 3, 5, 9 and 15 are in proportion. Reason (R): The number a, b, c and d are in proportion, then the product of extremes is equal to product of middle terms.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false', 'Assertion (A) is false and Reason (R) is true'], correct: 0, difficulty: 'Easy', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('7.9'), sourceQuestionNumber: '67' },
  { text: 'Assertion (A): If y is the mean proportion between x and z, then xyz(x + y + z)³ = (xy + yz + zx)³. Reason (R): If y is the mean proportion between x and z, then y = (x + z)/2.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 2, difficulty: 'Hard', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('7.9'), sourceQuestionNumber: '68', explanation: 'With the true mean proportion y=√(xz) the identity checks out numerically, so A is true. R states the wrong (arithmetic-mean) formula for mean proportion, so R is false — matches the key.' },
  { text: 'Assertion (A): If (4a + 5b)(4c - 5d) = (4a - 5b)(4c + 5d), then a, b, c, d are in proportion. Reason (R): If x/y = m/n, then x, y, m, n are in proportion.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Hard', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('7.9'), sourceQuestionNumber: '69' },

  { text: 'Assertion (A): If c is the mean proportion to a and b, then b is the third proportion between a and c. Reason (R): If x, y, z are in continued proportion, then x/y = y/z.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Hard', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('7.10'), sourceQuestionNumber: '70' },
  { text: 'Assertion (A): The third proportion to 9 and 15 is 25. Reason (R): If a, b and c are in continued proportion, then c is called the third proportion to a and b.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false', 'Assertion (A) is false and Reason (R) is true'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('7.10'), sourceQuestionNumber: '71' },
  { text: 'Assertion (A): If x, 3, 12, y are in continued proportion, then values of x and y are 3/5 and 48. Reason (R): If a, b, c and d are in continued proportion, then a/b = b/c = c/d.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 3, difficulty: 'Hard', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('7.10'), sourceQuestionNumber: '72', explanation: 'x:3=3:12=12:y gives x=3/4 (not 3/5) and y=48; since x is wrong, A is false overall, while R is a true general definition of continued proportion — matches the key.' },

  { text: 'Assertion (A): The mean proportion of 36.3 and 2.7 is 9.9. Reason (R): If y is the mean proportion between x and z, then y = (x + z)/2.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 2, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('7.11'), sourceQuestionNumber: '73' },
];

const meta = {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'Proportion',
  chapterOrder: 7,
  label: 'chap_7.pdf (ICSE Maths workbook) — full ingestion, questions (1)-(73)',
  status: 'transcribed',
};

const result = ingestQuestions(items, meta);
console.log('item count in this batch:', items.length);
console.log(JSON.stringify(result, null, 2));
