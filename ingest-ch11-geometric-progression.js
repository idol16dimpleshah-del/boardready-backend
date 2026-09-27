// Chapter 11 (Geometric Progression) — full source ingestion.
// 8 source pages (11.2-11.9), 56 real questions total.
// Full page range read: plain MCQs (1)-(44), then three case-study passages
// (45) bacteria doubling [parts i-v], (46) chain-letter mailing [parts i-v],
// (47) nursery pots [parts i-iv], then "Assertion and Reasoning" (48)-(56).
//
// Every answer cross-checked against answer.pdf's chapter 11 block (p.25.7-25.8).
// Spot-verified several derivations by hand (Q35 two-value first term, Q41/Q42
// "both correct" logic, and the case-study bacteria/letters/pots arithmetic in
// (45)-(47), all of which independently matched the printed key).
//
// One genuine source defect found: Q31 prints options B and D as identical
// values ("5" and "5") — a duplicate-option typo in the original workbook.
// The computed answer (n=5) is correct and matches the key's stated letter B,
// but because two different option letters carry the same value the item is
// flagged needs_review with an explanation (correct is left as the key's B).
const { ingestQuestions } = require('./ingest');

function page(p) { return p; }

const items = [
  { text: 'The nth term of a GP whose first term is a and common ratio is r is given by:', options: ['Tₙ = ar^(n+1)', 'Tₙ = ar^(1-n)', 'Tₙ = ar^(n-1)', 'Tₙ = a/r^(n-1)'], correct: 2, difficulty: 'Easy', subConcept: 'GP nth term formula', sourcePage: page('11.2'), sourceQuestionNumber: '1' },
  { text: 'If the first term, common ratio and the last term of a GP are a, r and l respectively, then the nth term from the end of the GP is given by:', options: ['l r^(n-1)', 'l r^(1-n)', 'l / r^(1-n)', 'l / r^(n-1)'], correct: 3, difficulty: 'Medium', subConcept: 'GP nth term from the end', sourcePage: page('11.2'), sourceQuestionNumber: '2' },
  { text: 'The sum of n terms of a GP with first term a and common ratio r, when r = 1 is given by:', options: ['Sₙ = a(1-rⁿ)/(1-r)', 'Sₙ = a(rⁿ-1)/(r-1)', 'n²a', 'na'], correct: 3, difficulty: 'Easy', subConcept: 'GP sum, special case r = 1', sourcePage: page('11.2'), sourceQuestionNumber: '3' },
  { text: 'The sum of n terms of a GP with first term a and common ratio r, when r > 1 is:', options: ['(arⁿ-1)/(r-1)', '(1-arⁿ)/(1-r)', 'a(rⁿ-1)/(r-1)', 'a(1-rⁿ)/(1-r)'], correct: 2, difficulty: 'Medium', subConcept: 'GP sum, r > 1', sourcePage: page('11.2'), sourceQuestionNumber: '4' },
  { text: 'The sum of n terms of a GP with first term a and common ratio r, when r is less than 1, is:', options: ['(arⁿ-1)/(r-1)', '(1-arⁿ)/(1-r)', 'a(rⁿ-1)/(r-1)', 'a(1-rⁿ)/(1-r)'], correct: 3, difficulty: 'Medium', subConcept: 'GP sum, r < 1', sourcePage: page('11.2'), sourceQuestionNumber: '5' },
  { text: 'If a and l are respectively the first and the last terms of a GP having common ratio r > 1, then the sum to n terms of the G.P. is given by:', options: ['l a r^(n-1)', 'a r^(ln)', '(lr-a)/(r-1)', '(lrⁿ-a)/(lr-1)'], correct: 2, difficulty: 'Medium', subConcept: 'GP sum using first and last term', sourcePage: page('11.2'), sourceQuestionNumber: '6' },
  { text: 'The product of n terms of a GP with first term a and common ratio r, when r = 1 is:', options: ['a(rⁿ-1)/(r-1)', 'na', 'arⁿ', 'aⁿ'], correct: 3, difficulty: 'Medium', subConcept: 'GP product of n terms', sourcePage: page('11.2'), sourceQuestionNumber: '7' },
  { text: 'The product of first five terms of a GP with first term a and common ratio r > 1 is equal to:', options: ['a(r⁵-1)/(r-1)', 'ar⁴', 'a⁵r¹⁰', 'a(r⁵-1)/r'], correct: 2, difficulty: 'Medium', subConcept: 'GP product of n terms', sourcePage: page('11.2'), sourceQuestionNumber: '8' },
  { text: 'nth term of the GP 1, √2, 2, ...... is:', options: ['(√2)ⁿ', '(√2)^(n+1)', '(√2)^(1-n)', '(√2)^(n-1)'], correct: 3, difficulty: 'Medium', subConcept: 'GP nth term (specific series)', sourcePage: page('11.2'), sourceQuestionNumber: '9' },

  { text: 'If third term of a GP is 3, then product of first five terms is:', options: ['81', '27', '243', '729'], correct: 2, difficulty: 'Medium', subConcept: 'GP product of n terms', sourcePage: page('11.3'), sourceQuestionNumber: '10' },
  { text: 'The general term of the GP 1/4, -1/2, 1, -2, 4, ...... is:', options: ['(-1)^(n-1) × (2)^(n-3)', '(-1)^(n-1) × (2)^(n-2)', '(-1)^(n-1) × (-2)^(n-1)', '(-1)^(n-1) × (-2)^(n-3)'], correct: 1, difficulty: 'Hard', subConcept: 'GP general term (negative ratio)', sourcePage: page('11.3'), sourceQuestionNumber: '11' },
  { text: 'What will be the nth term of a GP, whose first two terms are (-x) and x² respectively?', options: ['(-x)^(n+1)', '(-x)ⁿ', '(-x) × (-x)^(n-1)', '(x)^(n-1)'], correct: 2, difficulty: 'Medium', subConcept: 'GP nth term from first two terms', sourcePage: page('11.3'), sourceQuestionNumber: '12' },
  { text: 'The 12th term of the GP 2, 4, 8, 16, ...... is:', options: ['1024', '2048', '4096', '8192'], correct: 2, difficulty: 'Easy', subConcept: 'GP nth term (numeric)', sourcePage: page('11.3'), sourceQuestionNumber: '13' },
  { text: 'The 11th term of the GP 1/8, -1/4, 2, 1, ...... is:', options: ['64', '-64', '128', '-128'], correct: 2, difficulty: 'Medium', subConcept: 'GP nth term (numeric)', sourcePage: page('11.3'), sourceQuestionNumber: '14' },
  { text: 'Which term of the GP √3, 3√3, 9√3, ...... is 729√3 ?', options: ['7th', '6th', '9th', '8th'], correct: 0, difficulty: 'Medium', subConcept: 'GP find term number', sourcePage: page('11.3'), sourceQuestionNumber: '15' },
  { text: 'The common ratio of the GP -3/4, 1/2, -1/3, 2/9, ...... is:', options: ['-4/3', '-2/3', '2/3', '-3/2'], correct: 1, difficulty: 'Medium', subConcept: 'GP find common ratio', sourcePage: page('11.3'), sourceQuestionNumber: '16' },
  { text: 'The common ratio of the GP 1/(a³x³), ax, a⁵x⁵, ...... is:', options: ['1/(a²x²)', '1/(a⁴x⁴)', 'a²x²', 'a⁴x⁴'], correct: 2, difficulty: 'Medium', subConcept: 'GP find common ratio (algebraic)', sourcePage: page('11.3'), sourceQuestionNumber: '17' },
  { text: 'The common ratio of the GP 0.15, 0.015, 0.0015, ...... is:', options: ['0.1', '0.01', '1', '0.001'], correct: 0, difficulty: 'Easy', subConcept: 'GP find common ratio', sourcePage: page('11.3'), sourceQuestionNumber: '18' },
  { text: 'The 8th term of the GP 1, 3, 9, 27, ...... is:', options: ['729', '2187', '6561', '2087'], correct: 1, difficulty: 'Easy', subConcept: 'GP nth term (numeric)', sourcePage: page('11.3'), sourceQuestionNumber: '19' },
  { text: 'The nth term of the GP x³, x⁵, x⁷, ...... is:', options: ['x^(2n-1)', 'x^(2n+3)', 'x^(2n+1)', 'x^(3n+2)'], correct: 2, difficulty: 'Medium', subConcept: 'GP nth term (algebraic)', sourcePage: page('11.3'), sourceQuestionNumber: '20' },
  { text: 'The 10th term of the GP 1, -a, a², -a³ ...... is:', options: ['a⁹', '-a¹⁰', '-a¹¹', '-a⁹'], correct: 3, difficulty: 'Medium', subConcept: 'GP nth term (algebraic)', sourcePage: page('11.3'), sourceQuestionNumber: '21' },

  { text: 'The first term and the common ratio of the GP 3, 3/2, 3/4 ……, are respectively:', options: ['3 and 2', '3 and 1/2', '3 and 3/2', '3/2 and 1/2'], correct: 1, difficulty: 'Easy', subConcept: 'GP identify a and r', sourcePage: page('11.4'), sourceQuestionNumber: '22' },
  { text: 'If the 4th term of a GP is 2, then the product of its first seven terms is:', options: ['256', '64', '512', '128'], correct: 3, difficulty: 'Medium', subConcept: 'GP product of n terms', sourcePage: page('11.4'), sourceQuestionNumber: '23' },
  { text: 'The 6th term from the end of the GP 8, 4, 2, ......, 1/1024 is:', options: ['1/32', '1/16', '1/64', '1/128'], correct: 0, difficulty: 'Hard', subConcept: 'GP nth term from the end', sourcePage: page('11.4'), sourceQuestionNumber: '24' },
  { text: 'The 4th term from the end of the GP 2/27, 2/9, 2/3, ......, 162 is:', options: ['18', '2', '6', '2/3'], correct: 2, difficulty: 'Hard', subConcept: 'GP nth term from the end', sourcePage: page('11.4'), sourceQuestionNumber: '25' },
  { text: 'Consider the GP a, ar, ar², ......, l. The kth term from the end is:', options: ['l / r^(k-1)', 'l / k', 'al / r^k', 'l / (ar^(k-1))'], correct: 0, difficulty: 'Medium', subConcept: 'GP nth term from the end (algebraic)', sourcePage: page('11.4'), sourceQuestionNumber: '26' },
  { text: 'For what values of x are the numbers -3/5, x, -5/3 in GP ?', options: ['0, 1', '0, -1', '-1, 1', '-2, 2'], correct: 2, difficulty: 'Medium', subConcept: 'GP three terms condition', sourcePage: page('11.4'), sourceQuestionNumber: '27' },
  { text: 'The product of first three terms of a GP is -1 and the common ratio is -3/4. The sum of these three terms is:', options: ['12/13', '11/13', '11/12', '13/12'], correct: 3, difficulty: 'Hard', subConcept: 'GP word problem (product and sum)', sourcePage: page('11.4'), sourceQuestionNumber: '28' },
  { text: 'The sum of 7 terms of the GP 3, 6, 12, ...... is:', options: ['181', '241', '381', '384'], correct: 2, difficulty: 'Medium', subConcept: 'GP sum of n terms (numeric)', sourcePage: page('11.4'), sourceQuestionNumber: '29' },
  { text: 'The sum of first 8 terms of the series 1 + √3 + 3 + ......... is:', options: ['40(√3-1)', '80(√3-1)', '40(√3+1)', '80(√3+1)'], correct: 2, difficulty: 'Hard', subConcept: 'GP sum of n terms (surds)', sourcePage: page('11.4'), sourceQuestionNumber: '30' },
  { text: 'If the sum of the GP 1, 4, 16, ... is 341, then the number of terms in the GP:', options: ['10', '5', '6', '5'], correct: 1, difficulty: 'Medium', subConcept: 'GP find number of terms from sum', sourcePage: page('11.4'), sourceQuestionNumber: '31', answerStatus: 'needs_review', explanation: 'The printed source lists BOTH option B and option D as "5" (a duplicate-option typo in the original workbook — sum = a(rⁿ-1)/(r-1) = (4ⁿ-1)/3 = 341 gives 4ⁿ = 1024 = 4⁵, so n = 5 is unambiguously correct numerically, but two different option letters carry that same value, making the item defective as printed). The key states the answer letter is B, which is kept here as the recorded `correct`, but this needs human review/correction of the source options before being trusted as gradable at face value.' },
  { text: 'The sum of n numbers in the GP 5, 10, 20 ...... is 1275 then the value of n is:', options: ['6', '7', '8', '9'], correct: 1, difficulty: 'Medium', subConcept: 'GP find number of terms from sum', sourcePage: page('11.4'), sourceQuestionNumber: '32' },

  { text: 'If the 6th term of a Geometric Progression is 32 and its 8th term is 128, then the common ratio of the geometric progression is:', options: ['-1', '-4', '2', '4'], correct: 2, difficulty: 'Medium', subConcept: 'GP find common ratio from two terms', sourcePage: page('11.5'), sourceQuestionNumber: '33' },
  { text: 'The 4th term of a GP is equal to the square of its 2nd term and the first term is -2, then its 10th term is:', options: ['1020', '-1023', '1000', '1024'], correct: 1, difficulty: 'Hard', subConcept: 'GP word problem (relations between terms)', sourcePage: page('11.5'), sourceQuestionNumber: '34' },
  { text: 'The sum of the first two terms of a GP is -4 and the fifth term is 4 times the third term. Then, the first term of the GP is:', options: ['-3/4 or 4', '3/4 or 1/4', '4/3 or 1/4', '-4/3 or 4'], correct: 3, difficulty: 'Hard', subConcept: 'GP word problem (relations between terms)', sourcePage: page('11.5'), sourceQuestionNumber: '35' },
  { text: 'If x, y and z are in GP, then the relation between x, y and z can be:', options: ['x = √(yz)', 'y = xz', 'z = √(xy)', 'y = √(xz)'], correct: 3, difficulty: 'Easy', subConcept: 'GP three terms condition', sourcePage: page('11.5'), sourceQuestionNumber: '36' },
  { text: 'If 5th, 8th and 11th terms of a GP are x, y and z respectively, then which one of the following is correct?', options: ['y² = x²z²', 'z² = xy', 'y² = xz', 'x² = yz'], correct: 2, difficulty: 'Medium', subConcept: 'GP relation between non-adjacent terms', sourcePage: page('11.5'), sourceQuestionNumber: '37' },
  { text: 'The third, fourth and fifth term of GP are 28, -56 and 112 respectively. The second term of such GP is:', options: ['-14', '14', '56', '28'], correct: 0, difficulty: 'Medium', subConcept: 'GP find earlier term (negative ratio)', sourcePage: page('11.5'), sourceQuestionNumber: '38' },
  { text: 'If the 8th term of GP is 192 with a common ratio of 2, then the 12th term is:', options: ['1640', '2084', '3072', '31263'], correct: 2, difficulty: 'Medium', subConcept: 'GP find later term', sourcePage: page('11.5'), sourceQuestionNumber: '39' },
  { text: 'Which of the following is Geometric Progression?', options: ['1, 4, 7, 10, ......', '11, 14, 17, 20, ......', '-5, -2, 1, 4, ......', '2, 6, 18, 54, ......'], correct: 3, difficulty: 'Easy', subConcept: 'Identify a GP', sourcePage: page('11.5'), sourceQuestionNumber: '40' },
  { text: 'If -5, k, -5 are three consecutive terms of a GP, then the value of k is: (1) k = 5 (2) k = -5', options: ['Only (1) is correct', 'Only (2) is correct', 'Both are incorrect', 'Both are correct'], correct: 3, difficulty: 'Medium', subConcept: 'GP three terms condition (statement-based)', sourcePage: page('11.5'), sourceQuestionNumber: '41' },

  { text: 'A sequence is a, a, a, a, a ......: (1) It is an AP (2) It is a GP', options: ['Only (1) is correct', 'Only (2) is correct', 'Both are incorrect', 'Both are correct'], correct: 3, difficulty: 'Medium', subConcept: 'Constant sequence: AP vs GP', sourcePage: page('11.6'), sourceQuestionNumber: '42' },
  { text: 'If x, 2y, 3z are in AP, where the distinct numbers x, y, z are in GP, then the common ratio of the GP is:', options: ['3/1', '1/3', '2/3', '1/2'], correct: 1, difficulty: 'Hard', subConcept: 'AP and GP combined condition', sourcePage: page('11.6'), sourceQuestionNumber: '43' },
  { text: 'If 2nd, 3rd and 6th terms of an AP are the three consecutive terms of a GP, then the common ratio of the GP is:', options: ['2', '3', '1/2', '1/3'], correct: 1, difficulty: 'Hard', subConcept: 'AP and GP combined condition', sourcePage: page('11.6'), sourceQuestionNumber: '44' },

  {
    kind: 'case',
    text: 'The number of bacteria in a certain culture doubles every hour. If there were 30 bacteria present in the culture originally, then based on the above given information, answer the following questions:',
    parts: [
      { text: '(i) The number of bacteria that would be present at the end of 4th hour is:', options: ['240', '480', '960', '450'], correct: 0, marks: 1 },
      { text: '(ii) The number of bacteria that would be present at the end of 10th hour is:', options: ['30720', '15360', '61440', '27540'], correct: 1, marks: 1 },
      { text: '(iii) The number of bacteria that would be present at the end of nth hour is:', options: ['30 × 2^(n-1)', '30 × 2^(n+1)', '30 × 2ⁿ', '60 × 2^(n-1)'], correct: 0, marks: 1 },
      { text: '(iv) What would be the sum of the first 5 terms of the GP that is formed by the number of bacteria after the completion of each hour?', options: ['450', '930', '1890', '900'], correct: 1, marks: 1 },
      { text: '(v) What would be the sum of the first n terms of the GP that is formed by the number of bacteria after the completion of each hour?', options: ['30 × 2ⁿ - 1', '30 × (2^(n-1) - 1)', '30 × (2^(n+1) - 1)', '30 × 2ⁿ - 30'], correct: 3, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: GP applied to word problem (bacteria doubling)', questionType: 'case_study', sourcePage: page('11.6'), sourceQuestionNumber: '45',
  },
  {
    kind: 'case',
    text: 'A man writes a letter to four of his friends. He asks each one of them to copy the letter and mail to four different persons with the instruction that they move the chain similarly. Assume that the chain is not broken and it costs ₹4 to mail one letter. Based on this information, answer the following questions:',
    parts: [
      { text: '(i) The number of letters mailed in the 6th set of letters is:', options: ['2048', '8192', '4096', '1024'], correct: 2, marks: 1 },
      { text: '(ii) The amount spent on the postage of 6th set of letters is:', options: ['₹16384', '₹16834', '₹16348', '₹16843'], correct: 0, marks: 1 },
      { text: '(iii) The total number of letters mailed till the 5th set of letters is:', options: ['1024', '4092', '1236', '1364'], correct: 3, marks: 1 },
      { text: '(iv) The amount spent on the postage till the 5th set of letters is:', options: ['₹16368', '₹4096', '₹5456', '₹4944'], correct: 2, marks: 1 },
      { text: '(v) The amount spent on the postage till the nth set of letters is:', options: ['₹[4/3 (4ⁿ - 4)]', '₹[16/3 (4ⁿ - 1)]', '₹[2/3 (4ⁿ - 1)]', '₹[16(4ⁿ - 1)]'], correct: 1, marks: 1 },
    ],
    difficulty: 'Hard', subConcept: 'Case study: GP applied to word problem (chain letter)', questionType: 'case_study', sourcePage: page('11.7'), sourceQuestionNumber: '46',
  },
  {
    kind: 'case',
    text: 'A sequence of non-zero numbers is said to be a geometric progression, if the ratio of each term except the first one, by its preceding term is always constant. Rahul being a plant lover, decides to open a nursery and he bought a few plants and pots. He wants to place pots in such a way that the number of pots in the first row is 2, in second row is 4 and in the third row is 8 and so on......',
    parts: [
      { text: '(i) The constant multiple by which the number of pots is increasing in every row is:', options: ['2', '4', '8', '1'], correct: 0, marks: 1 },
      { text: '(ii) The number of pots in 8th row is:', options: ['128', '256', '512', '456'], correct: 1, marks: 1 },
      { text: '(iii) The difference in number of pots placed in 7th row and 5th row is:', options: ['86', '50', '90', '96'], correct: 3, marks: 1 },
      { text: '(iv) Total number of pots upto 10th row is:', options: ['1046', '2046', '1023', '1024'], correct: 1, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Case study: GP applied to word problem (nursery pots)', questionType: 'case_study', sourcePage: page('11.7'), sourceQuestionNumber: '47',
  },

  { text: 'Assertion (A): The nth term of a GP is given by Tₙ = ar^(n-1). Reason (R): A sequence a₁, a₂, a₃, a₄ …… is said to be in GP, if a₁/a₂ = a₂/a₃ = a₃/a₄ …… = Constant, which is known as the common ratio.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('11.8'), sourceQuestionNumber: '48' },
  { text: 'Assertion (A): The 5th term from the end of the GP 4, 6, 9, 27/2, ...... 6561/64 is 27/2. Reason (R): nth term from the end of a GP is given by l / r^(n-1)', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 1, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('11.8'), sourceQuestionNumber: '49' },
  { text: 'Assertion (A): The sum of the 10 terms of the GP 3, 6, 9, 12, ...... is 3096. Reason (R): The sum of first n terms of a GP is given by Sₙ = a(rⁿ+1)/(r+1)', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 3, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('11.8'), sourceQuestionNumber: '50', explanation: 'A is false — 3, 6, 9, 12 is an AP, not a GP, so "the sum of the GP" premise is invalid; R is also false as a general Sₙ formula (the correct GP-sum denominator is r-1, not r+1). Both false — matches the key (D).' },
  { text: 'Assertion (A): The first term of the GP is 1. If the sum of its third and fifth terms is 90, the common ratio of the GP is ±3. Reason (R): The constant is called common ratio of the GP and it is denoted by r = a_(k+1) / a_k', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 2, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('11.8'), sourceQuestionNumber: '51' },
  { text: 'Assertion (A): If 3, x, 12 are in GP, then the value of x = ±6. Reason (R): If a, G, b are in GP then G is the mean of a and b.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 2, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('11.8'), sourceQuestionNumber: '52' },
  { text: 'Assertion (A): 7, (-14), 28, (-56), 112 are in GP. Reason (R): The terms of a GP cannot have both positive and negative numbers.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('11.8'), sourceQuestionNumber: '53', explanation: 'A is true (ratio is consistently -2 throughout, so it is a valid GP); R is false as a general claim — a GP with a negative common ratio legitimately alternates sign. Matches the key (A).' },
  { text: 'Assertion (A): If the number -2/7, k, -7/2 is in GP, then k = ±1. Reason (R): If a₁, a₂, a₃ are in GP, then a₂/a₁ = a₃/a₂', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('11.9'), sourceQuestionNumber: '54' },
  { text: 'Assertion (A): The sum of the series of a GP 3/√5 + 4/√5 + √5 + …… + 25 terms is 75√5. Reason (R): If 27, n, 3 are in GP, then n = ±9', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 3, difficulty: 'Hard', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('11.9'), sourceQuestionNumber: '55' },
  { text: 'Assertion (A): If 5th and 8th term of a GP is 48 and 384 respectively, then the common ratio of a GP is 2. Reason (R): If 18, 54, x are in GP, then x = 162', options: ['Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).', 'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).', 'Assertion (A) is true and Reason (R) is false.', 'Assertion (A) is false and Reason (R) is true.'], correct: 1, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('11.9'), sourceQuestionNumber: '56' },
];

const meta = {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'Geometric Progression',
  chapterOrder: 11,
  label: 'chap_11.pdf (ICSE Maths workbook) — full ingestion, questions (1)-(56)',
  status: 'transcribed',
};

const result = ingestQuestions(items, meta);
console.log('item count in this batch:', items.length);
console.log(JSON.stringify(result, null, 2));
