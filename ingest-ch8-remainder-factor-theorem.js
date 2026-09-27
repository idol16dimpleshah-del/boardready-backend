// Chapter 8 (Remainder and Factor Theorem) — full source ingestion. 10 source
// pages (8.2-8.11), all 68 real questions transcribed from page images
// (pdftotext confirmed unusable on this source; every item below read
// visually off rendered PNGs). Full page range read before concluding the
// chapter's structure (per standing instruction, not stopping at the first
// MCQ block): plain MCQs (1)-(50), then SIX grouped multi-part items
// (51)-(57) (kind='case' — each one stem with 2-4 lettered sub-parts, kept
// together as a single row per the project's case-study convention), then
// item (58) which is a genuine real-world case-study passage ("underground
// water sump", 5 sub-parts), then an "Assertion and Reasoning" section
// (59)-(68).
//
// Every answer cross-checked against answer.pdf's chapter 8 "REMAINDER AND
// FACTOR THEOREM" block (p.25.5-25.6). Spot-verified a sample of the
// harder items independently (remainder-theorem substitutions, factor
// checks) — all matched the printed key; no discrepancies found in this
// chapter (unlike chapter 7's Proportion, where several were found).
const { ingestQuestions } = require('./ingest');

function page(p) { return p; }

const items = [
  { text: 'What is the relationship between the Factor Theorem and the Remainder Theorem?', options: ['They are completely unrelated.', 'The Factor Theorem is a special case of the Remainder Theorem', 'The Remainder Theorem is a special case of the Factor Theorem.', 'They are essentially the same theorem.'], correct: 1, difficulty: 'Easy', subConcept: 'Remainder and factor theorem (concept)', sourcePage: page('8.2'), sourceQuestionNumber: '1' },
  { text: 'When a polynomial f(x) is divided by (x + α), then the remainder is:', options: ['αf(x)', '-α', 'f(α)', 'f(-α)'], correct: 3, difficulty: 'Easy', subConcept: 'Remainder theorem', sourcePage: page('8.2'), sourceQuestionNumber: '2' },
  { text: 'If p(x) = x + 4, then p(x) + p(-x) = ?', options: ['0', '2x', '8', '-8'], correct: 2, difficulty: 'Easy', subConcept: 'Polynomial evaluation', sourcePage: page('8.2'), sourceQuestionNumber: '3' },
  { text: 'If p(x) = x² - 2√2x + 1, p(2√2) = ?', options: ['0', '1', '-1', '-8'], correct: 1, difficulty: 'Medium', subConcept: 'Polynomial evaluation', sourcePage: page('8.2'), sourceQuestionNumber: '4' },
  { text: 'If f(x) = 3x - 5x² - 1, then f(-1) = ?', options: ['1', '-1', '7', '-9'], correct: 3, difficulty: 'Easy', subConcept: 'Polynomial evaluation', sourcePage: page('8.2'), sourceQuestionNumber: '5' },
  { text: 'If (x¹⁰¹ + 101) is divided by (x + 1), then the remainder is:', options: ['102', '100', '0', '-101'], correct: 1, difficulty: 'Medium', subConcept: 'Remainder theorem', sourcePage: page('8.2'), sourceQuestionNumber: '6' },
  { text: 'If (3x³ - 5x² + 3x - 7) is divided by (x - 2), then the remainder is:', options: ['-5', '6', '3', '-8'], correct: 2, difficulty: 'Medium', subConcept: 'Remainder theorem', sourcePage: page('8.2'), sourceQuestionNumber: '7' },
  { text: 'If f(x) = x⁴ - ax³ + x² - ax is divided by (x - a), then the remainder is:', options: ['0', 'a', '-a', '2a²'], correct: 0, difficulty: 'Medium', subConcept: 'Remainder theorem', sourcePage: page('8.2'), sourceQuestionNumber: '8' },
  { text: 'When f(x) = x³ + ax² + 2x + a is divided by (x + a), then the remainder is:', options: ['0', '-a', 'a', '3a'], correct: 1, difficulty: 'Medium', subConcept: 'Remainder theorem', sourcePage: page('8.2'), sourceQuestionNumber: '9' },
  { text: 'If (2x³ - 7x² + 4x - 7) is divided by x, then the remainder is:', options: ['0', '-1', '-2', '-7'], correct: 3, difficulty: 'Easy', subConcept: 'Remainder theorem', sourcePage: page('8.2'), sourceQuestionNumber: '10' },
  { text: 'If (x² - 7x + a) leaves a remainder 1 when divided by (x + 1), then the value of a is:', options: ['1', '-1', '-7', '-5'], correct: 2, difficulty: 'Medium', subConcept: 'Remainder theorem', sourcePage: page('8.2'), sourceQuestionNumber: '11' },

  { text: 'In the division of a cubic polynomial f(x) by a linear polynomial, the remainder is f(-2), then the divisor must be:', options: ['(x - 2)', '(x + 2)', '(2x + 1)', '(2x - 1)'], correct: 1, difficulty: 'Easy', subConcept: 'Remainder theorem (concept)', sourcePage: page('8.3'), sourceQuestionNumber: '12' },
  { text: 'If p(t) = t² - t - 2, then the value of p(-1/3) is:', options: ['-2', '-10/9', '-14/9', '0'], correct: 2, difficulty: 'Medium', subConcept: 'Polynomial evaluation', sourcePage: page('8.3'), sourceQuestionNumber: '13' },
  { text: 'If f(x) = 4x³ - 3x² + 5 is divided by (2x + 1), then the remainder is:', options: ['-15/4', '-9/4', '-5/4', '15/4'], correct: 3, difficulty: 'Medium', subConcept: 'Remainder theorem', sourcePage: page('8.3'), sourceQuestionNumber: '14' },
  { text: 'When 2x² - 3kx + k is divided by (x + 2), then the remainder obtained is 5. The value of k is:', options: ['-2/5', '-3/5', '-3/7', '-5/7'], correct: 2, difficulty: 'Medium', subConcept: 'Remainder theorem (find unknown)', sourcePage: page('8.3'), sourceQuestionNumber: '15' },
  { text: 'If the polynomial p(x) = x³ - 4kx + 3 is divided by (2x + 1), then the remainder obtained is -3. The value of k is:', options: ['-17/16', '-47/8', '-27/16', '-47/16'], correct: 3, difficulty: 'Hard', subConcept: 'Remainder theorem (find unknown)', sourcePage: page('8.3'), sourceQuestionNumber: '16' },
  { text: 'f(x) is a polynomial in x and a is a real number. If (x - a) is a factor of f(x), then f(a) must be:', options: ['Zero', 'a', 'Negative', 'Positive'], correct: 0, difficulty: 'Easy', subConcept: 'Factor theorem (concept)', sourcePage: page('8.3'), sourceQuestionNumber: '17' },
  { text: 'If (x + 5) is a factor of f(x) = x³ - 20x + 5k, then k = ?', options: ['-2', '-3', '5', '-5'], correct: 2, difficulty: 'Medium', subConcept: 'Factor theorem (find unknown)', sourcePage: page('8.3'), sourceQuestionNumber: '18' },
  { text: 'For what value of k is the polynomial f(x) = 2x³ - kx² + 3x + 10 exactly divisible by (x + 2)?', options: ['3', '-3', '-1/3', '-4'], correct: 1, difficulty: 'Medium', subConcept: 'Factor theorem (find unknown)', sourcePage: page('8.3'), sourceQuestionNumber: '19' },
  { text: 'If (x⁵⁰ + 2x⁴⁹ + k) is divisible by (x + 1), then the value of k is:', options: ['0', '-1', '1', '-2'], correct: 2, difficulty: 'Medium', subConcept: 'Factor theorem (find unknown)', sourcePage: page('8.3'), sourceQuestionNumber: '20' },
  { text: 'If (x - 1) is a factor of x³ - kx² + 11x - 6, then the value of k should be:', options: ['0', '3', '4', '6'], correct: 3, difficulty: 'Medium', subConcept: 'Factor theorem (find unknown)', sourcePage: page('8.3'), sourceQuestionNumber: '21' },
  { text: 'If a specific real number a is substituted for the variable x in a polynomial f(x) so that the value of the polynomial becomes zero, then x = a is said to be:', options: ['zero of the polynomial', 'zero coefficient', 'rational number', 'factor of f(x)'], correct: 0, difficulty: 'Easy', subConcept: 'Zero of a polynomial (concept)', sourcePage: page('8.3'), sourceQuestionNumber: '22' },

  { text: '(x + 1) is a factor of the polynomial:', options: ['x³ + x² - x + 1', 'x³ + 2x² - x - 2', 'x³ + 4x² - x + 2', 'x³ + x² + 1'], correct: 1, difficulty: 'Medium', subConcept: 'Factor theorem (identify factor)', sourcePage: page('8.4'), sourceQuestionNumber: '23' },
  { text: 'If x + 1 is a factor of ax⁴ + bx³ + cx² + dx + e then:', options: ['a + c + e = b + d', 'a + b + e = c + d', 'a + b + c = e + d', 'b + c + d = a + e'], correct: 0, difficulty: 'Hard', subConcept: 'Factor theorem (algebraic)', sourcePage: page('8.4'), sourceQuestionNumber: '24' },
  { text: 'If (x - p) is a factor of (x³ - px² + 2x + p - 1), then the value of p is:', options: ['1/2', '-1/2', '1/3', '-1/3'], correct: 2, difficulty: 'Hard', subConcept: 'Factor theorem (find unknown)', sourcePage: page('8.4'), sourceQuestionNumber: '25' },
  { text: 'What number should be subtracted from 2x³ - 5x² + 5x, so that the resulting polynomial has (2x - 3) as a factor?', options: ['2', '-2', '-3', '3'], correct: 3, difficulty: 'Hard', subConcept: 'Factor theorem (find unknown)', sourcePage: page('8.4'), sourceQuestionNumber: '26' },
  { text: 'If (x² + ax + b) is divided by (x + c), then the remainder is:', options: ['-c² + ac + b', 'c² + ac + b', 'c² - ac - b', 'c² - ac + b'], correct: 3, difficulty: 'Medium', subConcept: 'Remainder theorem (algebraic)', sourcePage: page('8.4'), sourceQuestionNumber: '27' },
  { text: 'If (x - a) is a factor of f(x) = ax² + bx + c, then which of the following is true?', options: ['f(a) = 2', 'f(-a) = 0', 'f(a) = a', 'f(a) = 0'], correct: 3, difficulty: 'Easy', subConcept: 'Factor theorem (concept)', sourcePage: page('8.4'), sourceQuestionNumber: '28' },
  { text: 'For two polynomials f(x) and g(x), (x - a) and (x - b) are their respective factors. Which of the following is true?', options: ['f(a) + g(b) = 1', 'f(a) + g(b) = a - b', 'f(a) + g(b) = 0', 'f(a) + g(b) = a + b'], correct: 2, difficulty: 'Medium', subConcept: 'Factor theorem (concept)', sourcePage: page('8.4'), sourceQuestionNumber: '29' },
  { text: 'If (x - 1) is a factor of the polynomial f(x) = kx - k, then the value of k is:', options: ['1', '2', '0', '-1'], correct: 2, difficulty: 'Medium', subConcept: 'Factor theorem (find unknown)', sourcePage: page('8.4'), sourceQuestionNumber: '30' },
  { text: 'If a polynomial f(x) is divided by a (qx - p), then the remainder is:', options: ['f(q/p)', 'f(p/q)', 'f(1/p)', 'f(1/q)'], correct: 1, difficulty: 'Medium', subConcept: 'Remainder theorem (concept)', sourcePage: page('8.4'), sourceQuestionNumber: '31' },
  { text: 'If the polynomial p(x) - p(-x) is divided by (x + a) and (x - a), then the sum of remainders is:', options: ['2p(a)', '0', '2p(-a)', '2[p(a) + p(-a)]'], correct: 1, difficulty: 'Hard', subConcept: 'Remainder theorem (algebraic)', sourcePage: page('8.4'), sourceQuestionNumber: '32' },

  { text: 'The polynomial p(x) and q(x) when divided by (x + 2) and (x - 3) leaves remainder 3 and 5 respectively, then which of the option is true:', options: ['p(-2) + q(3) = 8', 'p(-2) + q(3) = -8', 'q(3) - p(-2) = -2', 'p(-2) - q(3) = 2'], correct: 0, difficulty: 'Medium', subConcept: 'Remainder theorem (concept)', sourcePage: page('8.5'), sourceQuestionNumber: '33' },
  { text: 'For a polynomial f(x), f(-1) and f(2) are both equal to zero. Which of the following is a factor of f(x)?', options: ['x² + x - 2', 'x² - x - 2', 'x² + x + 2', 'x² - 2x + 1'], correct: 1, difficulty: 'Medium', subConcept: 'Factor theorem (concept)', sourcePage: page('8.5'), sourceQuestionNumber: '34' },
  { text: 'If on dividing 2x³ + 6x² - (2k - 7)x + 5 by (x + 3), the remainder is (k - 1), then the value of k is:', options: ['2', '-3', '3', '-2'], correct: 2, difficulty: 'Hard', subConcept: 'Remainder theorem (find unknown)', sourcePage: page('8.5'), sourceQuestionNumber: '35' },
  { text: 'Use remainder theorem to find which of the following is a factor of 2x³ + 3x² - 5x - 6.', options: ['(x - 1)', '(2x - 1)', '(2x + 3)', '(2x - 3)'], correct: 3, difficulty: 'Medium', subConcept: 'Factor theorem (identify factor)', sourcePage: page('8.5'), sourceQuestionNumber: '36' },
  { text: 'If the sum of the two remainders is 1, when x³ + (kx + 8)x + k is divided by (x + 1) and (x - 2), then the value of k is:', options: ['-2', '2', '0', '4'], correct: 0, difficulty: 'Hard', subConcept: 'Remainder theorem (find unknown)', sourcePage: page('8.5'), sourceQuestionNumber: '37' },
  { text: 'If x² - 4 is a factor of the polynomial x³ + x² - 4x - 4, then its other factor is:', options: ['(x - 1)', '(x + 1)', '(x - 2)', '(x + 2)'], correct: 1, difficulty: 'Medium', subConcept: 'Factorisation using factor theorem', sourcePage: page('8.5'), sourceQuestionNumber: '38' },
  { text: 'If (x - 2) is one of the factor of f(x) = 3x³ + 11x² - 14x - 40, then the remaining factors of f(x) are:', options: ['(x - 4)(3x + 5)', '(x - 4)(3x - 5)', '(x + 4)(3x + 5)', '(x + 4)(3x - 5)'], correct: 2, difficulty: 'Hard', subConcept: 'Factorisation using factor theorem', sourcePage: page('8.5'), sourceQuestionNumber: '39' },
  { text: 'If (x - 3) and (x - 2) are two factors of the polynomial x³ - 4x² + x + 6 then the third factor is:', options: ['(x + 3)', '(x + 2)', '(x - 1)', '(x + 1)'], correct: 3, difficulty: 'Hard', subConcept: 'Factorisation using factor theorem', sourcePage: page('8.5'), sourceQuestionNumber: '40' },
  { text: 'The polynomial p(x) = x³ + ax² - 2x - 4 is exactly divisible by (x + 1), then the remainder obtained when p(x) is divided by (x + 2)', options: ['4', '6', '3', '0'], correct: 0, difficulty: 'Hard', subConcept: 'Remainder theorem (multi-step)', sourcePage: page('8.5'), sourceQuestionNumber: '41' },
  { text: 'The polynomial x³ - 7x - 4 and 3x³ - 3x² + bx + 14 leaves same remainder when divided by (x - 3), then the value of b is:', options: ['-22', '-13', '13', '-20'], correct: 0, difficulty: 'Hard', subConcept: 'Remainder theorem (find unknown)', sourcePage: page('8.5'), sourceQuestionNumber: '42' },

  { text: 'The expression 4x³ - bx² + x - c leaves remainder 0 and 30, when divided by (x + 1) and (2x - 3) respectively, then the values of b and c will be:', options: ['b = 3 and c = -8', 'b = 3 and c = 8', 'b = -8 and c = 3', 'b = -3 and c = -8'], correct: 2, difficulty: 'Hard', subConcept: 'Remainder theorem (simultaneous unknowns)', sourcePage: page('8.6'), sourceQuestionNumber: '43' },
  { text: 'If (x + 1) and (x - 1) are the factors of ax³ + bx² + cx + d, then which of the following is true?', options: ['a + b = 0', 'b + c = 0', 'b - d = 0', 'a + c = 0'], correct: 1, difficulty: 'Hard', subConcept: 'Factor theorem (algebraic)', sourcePage: page('8.6'), sourceQuestionNumber: '44' },
  { text: 'The factors of x³ - 13x - 12 are:', options: ['(x + 1)(x - 4)(x + 3)', '(x - 1)(x - 4)(x - 3)', '(x + 1)(x + 4)(x - 3)', '(x - 1)(x + 4)(x + 3)'], correct: 0, difficulty: 'Medium', subConcept: 'Factorisation using factor theorem', sourcePage: page('8.6'), sourceQuestionNumber: '45' },
  { text: 'The expression 2x³ + 3x² - 5x + p when divided by (x + 2), leaves remainder 3p + 2, then value of p is:', options: ['-2', '1', '0', '2'], correct: 3, difficulty: 'Medium', subConcept: 'Remainder theorem (find unknown)', sourcePage: page('8.6'), sourceQuestionNumber: '46' },
  { text: 'If (x + 2) and (x - 3) are factors of x³ + ax + b, then values of a and b?', options: ['a = -7 and b = -6', 'a = 7 and b = 6', 'a = 7 and b = -6', 'a = -7 and b = 6'], correct: 0, difficulty: 'Hard', subConcept: 'Factor theorem (simultaneous unknowns)', sourcePage: page('8.6'), sourceQuestionNumber: '47' },
  { text: 'If (x - 2) is a factor of x² + ax + b and a + b = 1, then values of a and b is:', options: ['a = 5 and b = -6', 'a = 5 and b = 6', 'a = -5 and b = 6', 'a = -5 and b = -6'], correct: 0, difficulty: 'Hard', subConcept: 'Factor theorem (simultaneous unknowns)', sourcePage: page('8.6'), sourceQuestionNumber: '48' },
  { text: 'On dividing f(x) by (2x + 3), then remainder is:', options: ['0', 'f(2/3)', 'f(-3/2)', 'f(-2/3)'], correct: 2, difficulty: 'Easy', subConcept: 'Remainder theorem (concept)', sourcePage: page('8.6'), sourceQuestionNumber: '49' },
  { text: 'When f(x) = ax² + b is divided by x - 1, then the remainder is:', options: ['a + b', 'a - b', 'ab', 'a/b'], correct: 0, difficulty: 'Easy', subConcept: 'Remainder theorem', sourcePage: page('8.6'), sourceQuestionNumber: '50' },
  {
    kind: 'case',
    text: 'If (2x - 1) is a factor of f(x) = 2x² + px - 5, then',
    parts: [
      { text: '(i) the value of p is:', options: ['10', '9', '8', '5'], correct: 1, marks: 1 },
      { text: '(ii) f(x) can be factorised as:', options: ['(2x - 1)(x + 5)', '(2x - 1)(x + 2)', '(2x - 1)(x - 5)', '(2x - 1)(x + 10)'], correct: 0, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Factor theorem (multi-part)', sourcePage: page('8.6'), sourceQuestionNumber: '51',
  },

  {
    kind: 'case',
    text: 'If (x - 2) is a factor of f(x) = x³ + kx² - 5x - 6, then',
    parts: [
      { text: '(i) the value of f(2) is:', options: ['1', '0', '-1', '2'], correct: 1, marks: 1 },
      { text: '(ii) the value of k is:', options: ['2', '1', '-1', '-2'], correct: 0, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Factor theorem (multi-part)', sourcePage: page('8.7'), sourceQuestionNumber: '52',
  },
  {
    kind: 'case',
    text: 'If f(x) = px³ - 3x + q is divided by (x - 1) and (x + 2), then remainder in each case is 0',
    parts: [
      { text: '(i) The value of p is:', options: ['4', '-2', '-1', '1'], correct: 3, marks: 1 },
      { text: '(ii) The value of q is:', options: ['3', '2', '-2', '-1'], correct: 1, marks: 1 },
      { text: '(iii) For the above values of p and q, if f(x) is divided by (x + 1), then the remainder is:', options: ['4', '0', '-3', '-4'], correct: 0, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Factor theorem (multi-part, simultaneous)', sourcePage: page('8.7'), sourceQuestionNumber: '53',
  },
  {
    kind: 'case',
    text: '(x - 1)(x + 1)(x - 3) are factors of f(x) = x³ - ax² + bx + 3',
    parts: [
      { text: '(i) The value of f(-1) is:', options: ['1', '0', '-1', '8'], correct: 1, marks: 1 },
      { text: '(ii) The value of a is:', options: ['2', '-2', '-3', '3'], correct: 3, marks: 1 },
      { text: '(iii) The value of b is:', options: ['-1', '2', '-3', '3'], correct: 0, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Factor theorem (multi-part, simultaneous)', sourcePage: page('8.7'), sourceQuestionNumber: '54',
  },
  {
    kind: 'case',
    text: 'Given f(x) = (3k + 2)x³ + (k - 1)',
    parts: [
      { text: '(i) If f(x) is divided by (2x + 1), the remainder is:', options: ['f(1/2)', 'f(-1/2)', 'f(2)', 'f(-2)'], correct: 1, marks: 1 },
      { text: '(ii) If (2x + 1) is a factor of f(x), then the remainder is:', options: ['0', '1', '-1', '2'], correct: 0, marks: 1 },
      { text: '(iii) If (2x + 1) is a factor of f(x), then the value of k is:', options: ['0', '1', '2', '-2'], correct: 2, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Factor theorem (multi-part)', sourcePage: page('8.7'), sourceQuestionNumber: '55',
  },

  {
    kind: 'case',
    text: 'Given f(x) = x³ + (kx + 8)x + k',
    parts: [
      { text: '(i) If f(x) is divided by (x + 1), the remainder is:', options: ['2k - 9', '2k + 9', '2k', '0'], correct: 0, marks: 1 },
      { text: '(ii) If f(x) is divided by (x - 2), the remainder is:', options: ['5k - 20', '5k + 24', '5k', '0'], correct: 1, marks: 1 },
      { text: '(iii) If the sum of the two remainders obtained in (i) and (ii) above is 1, then the value of k is:', options: ['2', '1', '-2', '-1'], correct: 2, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Remainder theorem (multi-part)', sourcePage: page('8.8'), sourceQuestionNumber: '56',
  },
  {
    kind: 'case',
    text: 'For the polynomial p(x) = 2x³ + x² - 13x + 6',
    parts: [
      { text: '(i) The remainder when p(x) is divided by (x + 2) is:', options: ['20', '10', '30', '-20'], correct: 0, marks: 1 },
      { text: '(ii) What number should be subtracted from p(x) so that (x + 2) is a factor of p(x)?', options: ['10', '-10', '20', '30'], correct: 2, marks: 1 },
      { text: '(iii) The remainder when (x - 2) divides p(x) is:', options: ['2', '1', '3', '0'], correct: 3, marks: 1 },
      { text: '(iv) What number should be added to p(x) so that (x - 1) is a factor of p(x)?', options: ['4', '-4', '2', '-2'], correct: 0, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Remainder theorem (multi-part)', sourcePage: page('8.8'), sourceQuestionNumber: '57',
  },
  {
    kind: 'case',
    text: 'Underground water sump is popular in India. It is usually used for large water sump storage and can be built cheaply using cement-like materials. Underground water sumps are typically chosen by people who want to save space. The water in the underground sump is not affected by extreme weather conditions. A builder wants to build a sump to store water in an apartment. The volume of the rectangular sump will be modeled by the polynomial V(x) = x³ - 7x² + 14x - 8.',
    parts: [
      { text: '(i) If he planned in such a way that the sump is (x - 1) units deep. Then the base dimensions of the sump are:', options: ['(x + 2)(x + 4)', '(x + 2)(x - 4)', '(x - 2)(x + 4)', '(x - 2)(x - 4)'], correct: 3, marks: 1 },
      { text: '(ii) If x = 5 units, then the volume of the sump is:', options: ['12 cu. units', '14 cu. units', '16 cu. units', '18 cu. units'], correct: 0, marks: 1 },
      { text: '(iii) If x = 5 and the builder wants to paint the inner portion (excluding the roof), then what is the total area to be painted?', options: ['16 sq. units', '32 sq. units', '49 sq. units', '35 sq. units'], correct: 3, marks: 1 },
      { text: '(iv) What is the total cost of painting, if the rate is ₹14 per square unit?', options: ['₹160', '₹350', '₹490', '₹320'], correct: 2, marks: 1 },
      { text: '(v) The factors of the polynomial x² + 3x - 18 are:', options: ['(x + 3)(x + 6)', '(x - 3)(x + 6)', '(x - 3)(x - 6)', '(x + 3)(x - 6)'], correct: 1, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: factor/remainder theorem applications', questionType: 'case_study', sourcePage: page('8.9'), sourceQuestionNumber: '58',
  },

  { text: 'Assertion (A): When a polynomial f(x) is divided by (3x + 4), then the remainder is f(-3/4). Reason (R): Remainder Theorem states that when a polynomial f(x) is divided by (x - α), then the remainder is f(α).', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 1, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('8.9'), sourceQuestionNumber: '59' },
  { text: 'Assertion (A): If (2x - 1) is a factor of polynomial of f(x), then f(1/2) = 0. Reason (R): (ax + b) is a factor of polynomial of f(x) implies f(-b/a) = 0.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 2, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('8.9'), sourceQuestionNumber: '60' },
  { text: 'Assertion (A): If polynomial p(x) = x⁵¹ - 51 is divided by polynomial g(x) = x - 1, then remainder is 0. Reason (R): When a polynomial p(x) is divided by polynomial g(x - a), the remainder is p(a).', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 1, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('8.9'), sourceQuestionNumber: '61' },
  { text: 'Assertion (A): (x - 1) is a factor of x³ + 2x² - x - 2. Reason (R): If (x + α) is a factor of f(x), then f(α) = 0.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('8.9'), sourceQuestionNumber: '62' },

  { text: 'Assertion (A): The factors of the polynomial x² - 3x - m(m + 3) are (x + m) and {x - (m + 3)}. Reason (R): The factors of a polynomial x² - (a + b)x + ab are (x - a) and (x - b).', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Hard', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('8.10'), sourceQuestionNumber: '63' },
  { text: 'Assertion (A): 2x³ + 3x² - 4x + 2 is a polynomial of degree 2. Reason (R): The highest power of the variable x in a given polynomial is the degree of the polynomial.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 3, difficulty: 'Easy', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('8.10'), sourceQuestionNumber: '64' },
  { text: 'Assertion (A): The number of factors of the polynomial 3x³ - 5x² + 1 is 3. Reason (R): The number of factors of a polynomial is equal to the number of terms in the polynomial.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 2, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('8.10'), sourceQuestionNumber: '65' },
  { text: 'Assertion (A): If x = 2 and x = -3 satisfies the polynomial x² + (a + 1)x + b completely, then the values of a and b are 0 and -6, respectively. Reason (R): If x = a satisfies a polynomial f(x) completely, then f(a) = 0.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Hard', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('8.10'), sourceQuestionNumber: '66' },

  { text: 'Assertion (A): The Remainder obtained when the polynomial (x⁶⁴ + x²⁷ + 1) is divided by (x + 1) is 1. Reason (R): If f(x) is divided by (x - a) then the remainder is f(a).', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('8.11'), sourceQuestionNumber: '67' },
  { text: 'Assertion (A): If x⁶ + 1 is divided by x - 1, then the remainder is 2. Reason (R): p(x) = x⁶ + 1 when divided by x - 1, then remainder is p(1). ∴ p(1) = 1⁶ + 1 = 2.', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Easy', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('8.11'), sourceQuestionNumber: '68' },
];

const meta = {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'Remainder and Factor Theorem',
  chapterOrder: 8,
  label: 'chap_8.pdf (ICSE Maths workbook) — full ingestion, questions (1)-(68)',
  status: 'transcribed',
};

const result = ingestQuestions(items, meta);
console.log('item count in this batch:', items.length);
console.log(JSON.stringify(result, null, 2));
