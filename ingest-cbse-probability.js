// CBSE Class 10 Mathematics — Probability practice-exercise MCQs.
// Source: 6 photographed pages (15.19-15.24) of a printed guide, uploaded
// 2026-09-17. Every option/answer below was transcribed from the images
// and cross-checked by independently computing the probability — where
// the computed value disagrees with the source's own printed answer key,
// the item is flagged answerStatus:'needs_review' rather than silently
// picking a side (see item 61). This is a NEW chapter under the existing
// CBSE Mathematics subject, distinct from the ICSE Mathematics
// "Probability" chapter already in the bank (different board/curriculum).
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [42, 43, 44, 45, 46, 47]; // pages 15.24,15.23,15.20,15.21,15.22,15.19 (archive-cbse-probability-images.js)

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  kind: 'mcq',
  options,
  correct: correctIdx,
  answerKeyRef: `printed ANSWERS table, p.15.24, item ${n}`,
  ...opts,
});

const items = [
  mcq(1, '15.19', 'If a digit is chosen at random from the digits 1, 2, 3, 4, 5, 6, 7, 8, 9, then the probability that it is odd, is', ['4/9', '5/9', '1/9', '2/3'], 1),
  mcq(2, '15.19', 'In Q. No. 1, the probability that the digit is even, is', ['4/9', '5/9', '1/9', '2/3'], 0),
  mcq(3, '15.19', 'In Q. No. 1, the probability that the digit is a multiple of 3 is', ['1/3', '2/3', '1/9', '2/9'], 0),
  mcq(4, '15.19', 'If three coins are tossed simultaneously, then the probability of getting at least two heads, is', ['1/4', '3/8', '1/2', '1/4'], 2, { explanation: 'Source prints two distractors as "1/4" (options a and d) — preserved verbatim from the printed page; does not affect the correct answer (c).' }),
  mcq(5, '15.19', 'In a single throw of a die, the probability of getting a multiple of 3 is', ['1/2', '1/3', '1/6', '2/3'], 1),
  mcq(6, '15.19', 'The probability of guessing the correct answer to a certain test question is x/12. If the probability of not guessing the correct answer to this question is 2/3, then x =', ['2', '3', '4', '6'], 2),
  mcq(7, '15.19', 'A bag contains three green marbles, four blue marbles, and two orange marbles. If a marble is picked at random, then the probability that it is not an orange marble is', ['1/4', '1/3', '4/9', '7/9'], 3),
  mcq(8, '15.19', 'A number is selected at random from the numbers 3, 5, 5, 7, 7, 7, 9, 9, 9, 9. The probability that the selected number is their average is', ['1/10', '3/10', '7/10', '9/10'], 1),
  mcq(9, '15.19', 'The probability of throwing a number greater than 2 with a fair dice is', ['3/5', '2/5', '2/3', '1/3'], 2),
  mcq(10, '15.19', 'A card is accidently dropped from a pack of 52 playing cards. The probability that it is an ace is', ['1/4', '1/13', '1/52', '12/13'], 1),
  mcq(11, '15.19', 'A number is selected from numbers 1 to 25. The probability that it is prime is', ['2/3', '1/6', '9/25', '5/6'], 2),
  mcq(12, '15.19', 'Which of the following cannot be the probability of an event?', ['2/3', '-1.5', '15%', '0.7'], 1),

  mcq(13, '15.20', 'If P(E) = 0.05, then P(not E) =', ['-0.05', '0.5', '0.9', '0.95'], 3),
  mcq(14, '15.20', 'Which of the following cannot be the probability of occurrence of an event?', ['0.2', '0.4', '0.8', '1.6'], 3),
  mcq(15, '15.20', 'The probability of a certain event is', ['0', '1', '1/2', 'no existent'], 1),
  mcq(16, '15.20', 'The probability of an impossible event is', ['0', '1', '1/2', 'non-existent'], 0),
  mcq(17, '15.20', 'Aarushi sold 100 lottery tickets in which 5 tickets carry prizes. If Priya purchased a ticket, what is the probability of Priya winning a prize?', ['19/20', '1/25', '1/20', '17/20'], 2),
  mcq(18, '15.20', 'A number is selected from first 50 natural numbers. What is the probability that it is a multiple of 3 or 5?', ['13/25', '21/50', '12/25', '23/50'], 3),
  mcq(19, '15.20', 'A month is selected at random in a year. The probability that it is March or October, is', ['1/12', '1/6', '3/4', 'none of these'], 1),
  mcq(20, '15.20', 'From the letters of the word "MOBILE", a letter is selected. The probability that the letter is a vowel, is', ['1/3', '3/7', '1/6', '1/2'], 3),
  mcq(21, '15.20', 'A die is thrown once. The probability of getting a prime number is', ['2/3', '1/3', '1/2', '1/6'], 2, { explanation: '[CBSE 2013]' }),
  mcq(22, '15.20', 'The probability of getting an even number, when a die is thrown once is', ['1/2', '1/3', '1/6', '5/6'], 0, { explanation: '[CBSE 2013]' }),
  mcq(23, '15.20', 'A box contains 90 discs, numbered from 1 to 90. If one disc is drawn at random from the box, the probability that it bears a prime number less than 23, is', ['7/90', '10/90', '4/45', '9/89'], 2, { explanation: '[CBSE 2013]' }),
  mcq(24, '15.20', 'The probability that a number selected at random from the numbers 1, 2, 3,...,15 is a multiple of 4, is', ['4/15', '2/15', '1/5', '1/3'], 2, { explanation: '[CBSE 2014]' }),
  mcq(25, '15.20', 'Two different coins are tossed simultaneously. The probability of getting at least one head is', ['1/4', '1/8', '3/4', '7/8'], 2, { explanation: '[CBSE 2014]' }),

  mcq(26, '15.21', 'If two different dice are rolled together, the probability of getting an even number on both dice, is', ['1/36', '1/2', '1/6', '1/4'], 3, { explanation: '[CBSE 2014]' }),
  mcq(27, '15.21', 'A number is selected at random from the numbers 1 to 30. The probability that it is a prime number is', ['2/3', '1/6', '1/3', '11/30'], 2, { explanation: '[CBSE 2014]' }),
  mcq(28, '15.21', 'A card is drawn at random from a pack of 52 cards. The probability that the drawn card is not an ace is', ['1/13', '9/13', '4/13', '12/13'], 3, { explanation: '[CBSE 2014]' }),
  mcq(29, '15.21', 'Two dice are thrown together. The probability of getting the same number on both dice is', ['1/2', '1/3', '1/6', '1/12'], 2, { explanation: '[CBSE 2012]' }),
  mcq(30, '15.21', 'In a family of 3 children, the probability of having at least one boy is', ['7/8', '1/8', '5/8', '3/4'], 0, { explanation: '[CBSE 2014]' }),
  mcq(31, '15.21', 'A bag contains cards numbered from 1 to 25. A card is drawn at random from the bag. The probability that the number on this card is divisible by both 2 and 3 is', ['1/5', '3/25', '4/25', '2/25'], 2, { explanation: '[CBSE 2014]' }),
  mcq(32, '15.21', 'A number x is chosen at random from the numbers -3, -2, -1, 0, 1, 2, 3. The probability that |x| < 2 is', ['5/7', '2/7', '3/7', '1/7'], 2),
  mcq(33, '15.21', 'If a number x is chosen from the numbers 1, 2, 3, and a number y is selected from the numbers 1, 4, 9. Then, P(xy < 9)', ['7/9', '5/9', '2/3', '1/9'], 1),
  mcq(34, '15.21', 'The probability that a non-leap year has 53 Sundays, is', ['2/7', '5/7', '6/7', '1/7'], 3),
  mcq(35, '15.21', 'In a single throw of a pair of dice, the probability of getting the sum a perfect square is', ['1/18', '7/36', '1/6', '2/9'], 1),
  mcq(36, '15.21', 'What is the probability that a non-leap year has 53 Sundays?', ['6/7', '1/7', '5/7', 'none of these'], 1),

  mcq(37, '15.22', "Two numbers 'a' and 'b' are selected successively without replacement in that order from the integers 1 to 10. The probability that a/b is an integer, is", ['17/45', '1/5', '17/90', '8/45'], 2),
  mcq(38, '15.22', 'Two dice are rolled simultaneously. The probability that they show different faces is', ['2/3', '1/6', '1/3', '5/6'], 3),
  mcq(39, '15.22', 'What is the probability that a leap year has 53 Mondays?', ['2/7', '4/7', '5/7', '6/7'], 0, { explanation: '[CBSE 2024]' }),
  mcq(40, '15.22', 'If a two digit number is chosen at random, then the probability that the number chosen is a multiple of 3, is', ['3/10', '29/100', '1/3', '7/25'], 2),
  mcq(41, '15.22', 'Two coins are tossed together. The probability of getting at least one tail is', ['1/4', '1/2', '3/4', '1'], 2, { explanation: '[CBSE 2023]' }),
  mcq(42, '15.22', 'Which of the following numbers cannot be the probability of happening of an event?', ['0', '7/0.01', '0.07', '0.07/3'], 1, { explanation: '[CBSE 2023]' }),
  mcq(43, '15.22', 'The probability of happening of an event is denoted by p and the probability of non-happening of the event is denoted by q. Relation between p and q is', ['p+q=1', 'p=1,q=1', 'p=q-1', 'p+q+1=0'], 0, { explanation: '[CBSE 2023]' }),
  mcq(44, '15.22', 'In a group of 20 people, 5 cannot swim. If one person is selected at random, then the probability that he/she can swim, is', ['3/4', '1/3', '1', '1/4'], 0, { explanation: '[CBSE 2023]' }),
  mcq(45, '15.22', 'A bag contains 100 cards numbered 1 to 100. A card is drawn at random from the bag. What is the probability that the number on the card is a perfect cube?', ['1/20', '3/50', '1/25', '7/100'], 2, { explanation: '[CBSE 2023]' }),
  mcq(46, '15.22', 'Three coins are tossed simultaneously, what is the probability of getting at most one tail?', ['3/8', '4/8', '5/8', '7/8'], 1, { explanation: '[CBSE 2023]' }),

  mcq(47, '15.23', 'A bag contains 5 pink, 8 blue and 7 yellow balls. One ball is drawn at random from the bag. What is the probability of getting neither a blue nor a pink ball?', ['1/4', '2/5', '7/20', '13/20'], 2, { explanation: '[CBSE 2023]' }),
  mcq(48, '15.23', 'A card is drawn at random from a well shuffled pack of 52 playing cards. The probability of getting a face card is', ['1/2', '3/13', '4/13', '1/13'], 1, { explanation: '[CBSE 2023]' }),
  mcq(49, '15.23', 'Two dice are rolled together. The probability of getting the sum of two numbers to be more than 10, is', ['1/9', '1/6', '7/12', '1/12'], 3, { explanation: '[CBSE 2024]' }),
  mcq(50, '15.23', 'A box contains cards numbered 6 to 55. A card is drawn at random from the box. The probability that the drawn card has a number which is a perfect square, is', ['7/50', '7/55', '1/10', '5/49'], 2, { explanation: '[CBSE 2024]' }),
  mcq(51, '15.23', 'Two dice are tossed simultaneuously. The probability of getting odd numbers on both the dice is', ['6/36', '3/36', '12/36', '9/36'], 3, { explanation: '[CBSE 2024]' }),
  mcq(52, '15.23', 'For an event E, if P(E) + P(Ē) = q, then the value of q² - 4 is', ['-3', '3', '5', '-5'], 0, { explanation: '[CBSE 2024]' }),
  mcq(53, '15.23', 'The probability of getting a bad egg in a lot of 400 eggs is 0.045. The number of good eggs in the lot is', ['18', '180', '382', '220'], 2, { explanation: '[CBSE 2024]' }),
  mcq(54, '15.23', 'Cards numbered 7 to 40 were put in a box. A card is selected at random from the box. The probability that the selected card has a number, which is a multiple of 7, is', ['7/34', '7/35', '6/35', '5/34'], 3, { explanation: '[CBSE 2024]' }),
];

const AR_OPTIONS = [
  'Statement-1 is true, Statement-2 is true; Statement-2 is a correct explanation for Statement-1.',
  'Statement-1 is true, Statement-2 is true; Statement-2 is not a correct explanation for Statement-1.',
  'Statement-1 is true, Statement-2 is false.',
  'Statement-1 is false, Statement-2 is true.',
];
const ar = (n, text, correctIdx, opts = {}) => mcq(n, '15.24', text, AR_OPTIONS, correctIdx, { questionType: 'assertion_reasoning', ...opts });

items.push(
  ar(55, 'Statement-1 (A): The probability that a leap year has 53 Sundays is 2/7. Statement-2 (R): The probability that a non-leap year has 53 Sundays is 1/7.', 1),
  ar(56, 'Statement-1 (A): When a die is rolled, the probability of getting a number which is a multiple of 3 and 5 both is zero. Statement-2 (R): The probability of an impossible event is zero.', 0),
  ar(57, 'Statement-1 (A): A cubical die is rolled. The probability of getting a composite number is 1/3. Statement-2 (R): In a throw of a cubical die, the probability of getting a prime number is 2/3.', 2, { explanation: 'S2 as printed is mathematically wrong (actual P(prime)=1/2, not 2/3) — that is exactly why the source marks the pair (c) Statement-2 false, consistent with our own computation.' }),
  ar(58, 'Statement-1 (A): A number is selected from the numbers 1, 2, 3, ..., 10. The probability that it is a root of the equation x²-2x+1=0 is 1/5. Statement-2 (R): The equation x²-2x+1=0 has two roots.', 3, { explanation: 'x²-2x+1=(x-1)² has one repeated root x=1, so the true probability is 1/10, not 1/5 — S1 as printed is false, matching the source answer (d).' }),
  ar(59, 'Statement-1 (A): A four digit number is formed using the digits 1, 2, 5, 6 and 8 without repetition. The probability that it is an even number is 3/5. Statement-2 (R): The units digit of even number is also an even number.', 1),
  ar(60, 'Statement-1 (A): Avni and Manvi were born in the year 2000. The probability that they have the same birthday is 1/366. Statement-2 (R): Leap year has 366 days.', 0),
  ar(61,
    'Statement-1 (A): In a cricket match, a batsman hits a boundary 9 times out of 45 balls he plays. The probability that in a given ball, he does hit the boundary is 4/5. Statement-2 (R): P(E) + P(not E) = 1.',
    0,
    {
      answerStatus: 'needs_review',
      explanation: "DISCREPANCY FLAGGED, not silently resolved: 9/45 = 1/5, so P(hits boundary) = 1/5, not 4/5 as Statement-1 claims (4/5 is actually P(does NOT hit), i.e. 36/45). The printed answer key marks this (a) — both statements true, S2 correctly explains S1 — but that is inconsistent with the arithmetic unless Statement-1 has a transcription/printing error in the source itself (e.g. it may have meant 'does not hit the boundary'). Recorded exactly as printed; answer_status set to needs_review rather than accepting the printed (a) at face value.",
    }
  )
);

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Probability',
  chapterOrder: 14,
  label: 'CBSE Class 10 Mathematics — Probability practice-exercise MCQs (pp.15.19-15.24), 61 items incl. 7 Assertion-Reason, photographed pages',
  status: 'transcribed',
  answerStatus: 'source_provided',
  sourceSection: 'Practice Exercises — MCQs + Assertion-Reason MCQs',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
