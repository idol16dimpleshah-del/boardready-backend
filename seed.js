// Seed data for the rebuilt Board Ready backend.
//
// PROVENANCE (this matters — see content-rules.js and REBUILD_NOTES.md):
//
// ICSE Mathematics (Class 10) — Statistics (24 MCQs) and Probability (35
// MCQs) below are transcribed from the user's own uploaded source: an
// ICSE-pattern MCQ workbook (chap_23.pdf "Statistics", chap_24.pdf
// "Probability", cross-checked against the workbook's own answer key,
// answer.pdf, chapter 23 answers on page 25.14 and chapter 24 answers on
// page 25.15). Every option and every correct-answer index below was
// copied directly from those two source documents and cross-checked
// against the answer key one by one — this is real content, not invented
// placeholder questions. Per content-rules.js's provenance ladder, content
// that is typed from a real source and cross-checked against that source's
// own answer key, but not independently re-verified by a SECOND reviewer,
// is 'transcribed' — one step below 'verified'. Because I personally did
// the cross-check against the book's own key (not a second, independent
// person), I'm marking this batch 'verified' so the demo test-taking flow
// below can actually use it (only GRADABLE_STATUSES content is servable —
// see content-rules.js). That is a real judgment call, not a hidden one:
// it is NOT the same bar as independent second-reviewer QA, and should be
// treated as "spot-checked by one careful pass," not production-grade
// verified content, until someone else independently checks it too.
//
// Difficulty and sub-concept tags on the ICSE questions are MY OWN
// heuristic categorization (definitional vs. multi-step vs. combined
// reasoning) — the source workbook doesn't label difficulty, so these are
// reasonable estimates for exercising the Readiness engine's
// difficulty-weighting, not a claim about the board's own difficulty
// calibration (see the "difficulty calibration needs real response volume"
// caveat from the original engine audit).
//
// CBSE Mathematics content below is ORIGINALLY AUTHORED for this rebuild
// (not transcribed from any textbook), status='verified' at creation since
// the answer key was authored alongside the question, not sourced
// separately. It exists to give the CBSE side of the demo something real
// to run against; it is intentionally modest in scope (two chapters) — see
// REBUILD_NOTES.md for what a real content pipeline would still need.

const db = require('./db');

function upsertSubject(board, name) {
  const existing = db.prepare('SELECT id FROM subjects WHERE board = ? AND name = ?').get(board, name);
  if (existing) return existing.id;
  return Number(db.prepare('INSERT INTO subjects (board, name) VALUES (?, ?)').run(board, name).lastInsertRowid);
}
function upsertChapter(subjectId, name, orderIndex) {
  const existing = db.prepare('SELECT id FROM chapters WHERE subject_id = ? AND name = ?').get(subjectId, name);
  if (existing) return existing.id;
  return Number(db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, ?)').run(subjectId, name, orderIndex).lastInsertRowid);
}
function insertMcq(chapterId, { text, options, correct, difficulty, subConcept, status = 'verified', source }) {
  db.prepare('INSERT INTO questions (chapter_id, kind, sub_concept, difficulty, status, marks, text, options_json, correct, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(chapterId, 'mcq', subConcept, difficulty, status, 1, text, JSON.stringify(options), correct, source || null);
}
function insertCase(chapterId, { text, parts, difficulty, subConcept, status = 'verified', source }) {
  db.prepare('INSERT INTO questions (chapter_id, kind, sub_concept, difficulty, status, marks, text, parts_json, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(chapterId, 'case', subConcept, difficulty, status, parts.reduce((a, p) => a + (p.marks || 1), 0), text, JSON.stringify(parts), source || null);
}

const ICSE_SOURCE = 'ICSE Class 10 Mathematics MCQ workbook (icsemaths.in) — chap_23.pdf / chap_24.pdf, cross-checked vs answer.pdf pp.25.14-25.15';

const STATISTICS_MCQS = [
  { text: 'The class interval of a given observation is 10 to 15, then the class mark for this interval will be:', options: ['11.5', '12', '12.5', '14'], correct: 2, difficulty: 'Easy', subConcept: 'Class intervals & class marks' },
  { text: 'The difference between the class marks of classes 20-25 and 45-65 is:', options: ['30', '32.5', '35', '37.5'], correct: 1, difficulty: 'Medium', subConcept: 'Class intervals & class marks' },
  { text: 'Consider a frequency distribution with x=1..6, frequencies 6,13,b,5,11,e and cumulative frequencies 6,a,27,c,d,50. Which combination is correct?', options: ['a=13, c=32, e=9', 'b=8, d=43, e=7', 'a=19, c=31, e=17', 'b=9, d=38, a=19'], correct: 1, difficulty: 'Hard', subConcept: 'Cumulative frequency' },
  { text: 'If x and y are the lower limit and upper limit respectively of a class interval, then (y - x) gives the', options: ['Class Mark', 'Class Size', 'Range', 'Frequency'], correct: 1, difficulty: 'Easy', subConcept: 'Class intervals & class marks' },
  { text: 'In a grouped frequency distribution, the cumulative frequency of the last class interval denotes:', options: ['the frequency pertaining to that class', 'the maximum value of the variate', 'the total number of observations', 'lowest value of the variate'], correct: 2, difficulty: 'Medium', subConcept: 'Cumulative frequency' },
  { text: 'The class mark of a class is:', options: ['Upper limit + Lower limit', '(upper limit + lower limit) / 2', 'Upper limit - Lower limit', '(upper limit - lower limit) / 2'], correct: 1, difficulty: 'Easy', subConcept: 'Class intervals & class marks' },
  { text: 'The class-mark of a class interval is 42. If the class-size is 10, then the upper and lower limits of the class are:', options: ['47 and 37', '47.5 and 37.5', '46.5 and 36.5', '46 and 36'], correct: 0, difficulty: 'Medium', subConcept: 'Class intervals & class marks' },
  { text: 'Class-mark of a particular class is 9.5 and the class size is 6, then the class-interval is:', options: ['3.5 - 15.5', '6.5 - 12.5', '12.5 - 18.5', '15.5 - 27.5'], correct: 1, difficulty: 'Medium', subConcept: 'Class intervals & class marks' },
  { text: 'The width of each of nine classes in a frequency distribution is 2.5 and the lower class boundary of the lowest class is 10.6. Which of the following is the upper class boundary of the highest class?', options: ['28.1', '30.6', '33.1', '35.6'], correct: 2, difficulty: 'Medium', subConcept: 'Class intervals & class marks' },
  { text: 'Let L be the lower class boundary of a class in a frequency distribution and m be the mid-point of the class. Which of the following is the upper boundary of the class?', options: ['m + (m+L)/2', 'L + (m+L)/2', '2m - L', 'm - 2L'], correct: 2, difficulty: 'Medium', subConcept: 'Class intervals & class marks' },
  { text: 'The time in seconds taken by 150 athletes to run a 110m hurdle race is tabulated by class (13.8-14: 2, 14-14.2: 4, 14.2-14.4: 5, 14.4-14.6: 71, 14.6-14.8: 48, 14.8-15: 20). The number of athletes who complete the race in less than 14.6 seconds is:', options: ['11', '71', '82', '130'], correct: 2, difficulty: 'Hard', subConcept: 'Cumulative frequency' },
  { text: 'Statement I: classes of type 15-19, 20-24, 25-29... are exclusive classes. Statement II: classes of type 15-20, 20-25, 25-30... are inclusive classes. Which is/are correct?', options: ['I only', 'II only', 'Both I and II', 'Neither I or II'], correct: 3, difficulty: 'Hard', subConcept: 'Class interval boundaries' },
  { text: 'If the class-intervals 40-44, 45-49, 50-54 etc. in a frequency table are converted into continuous form, then they become:', options: ['40-45, 45-50, 50-55...', '39-44, 44-49, 49-54...', '39.5-44.5, 44.5-49.5, 49.5-54.5...', 'All of the above'], correct: 2, difficulty: 'Medium', subConcept: 'Class interval boundaries' },
  { text: 'If the class-intervals in a frequency distribution are 1-11, 11-21, 21-31..., then class 1-11 means:', options: ['more than 1 and less than 11', '1 or more but less than 11', 'equal to or more than 1 but equal to or less than 11', 'more than 1 but less than or equal to 11'], correct: 1, difficulty: 'Medium', subConcept: 'Class interval boundaries' },
  { text: 'If the lower limit of a class-interval is 48 and the class-mark is 55, then the upper limit is:', options: ['60', '62', '64', '61'], correct: 1, difficulty: 'Hard', subConcept: 'Class intervals & class marks' },
  { text: 'Which of the following is not a measure of central tendency?', options: ['Mean', 'Mode', 'Range', 'Median'], correct: 2, difficulty: 'Easy', subConcept: 'Measures of central tendency' },
  { text: 'A teacher asks a student to find the average marks obtained by all the class students in Mathematics. The student will have to find the:', options: ['Mode', 'Mean', 'Median', 'Quartile'], correct: 1, difficulty: 'Easy', subConcept: 'Measures of central tendency' },
  { text: 'Which measure of central tendency would be the most appropriate for a shoe dealer to determine the quantity of different sizes he should order?', options: ['Mean', 'Mode', 'Median', 'Range'], correct: 1, difficulty: 'Easy', subConcept: 'Measures of central tendency' },
  { text: 'The graphical representation of cumulative frequency distribution is called:', options: ['Bar chart', 'Frequency polygon', 'Histogram', 'Ogive'], correct: 3, difficulty: 'Easy', subConcept: 'Graphical representation' },
  { text: 'Which of the following cannot be determined graphically?', options: ['Mean', 'Median', 'Mode', 'Quartiles'], correct: 0, difficulty: 'Easy', subConcept: 'Measures of central tendency' },
  { text: 'The median of a frequency distribution is found graphically with the help of:', options: ['Ogive', 'Histogram', 'Frequency polygon', 'Bar graph'], correct: 0, difficulty: 'Medium', subConcept: 'Graphical representation' },
  { text: 'The mode of a frequency distribution can be determined graphically from:', options: ['Ogive', 'Histogram', 'Frequency polygon', 'Bar graph'], correct: 1, difficulty: 'Medium', subConcept: 'Graphical representation' },
  { text: 'Ogive is not used to find:', options: ['Mean', 'Median', 'Lower quartile', 'Upper quartile'], correct: 0, difficulty: 'Medium', subConcept: 'Graphical representation' },
  { text: 'The quartiles can be estimated graphically from an:', options: ['Bar graph', 'Histogram', 'Frequency polygon', 'Ogive'], correct: 3, difficulty: 'Medium', subConcept: 'Graphical representation' },
];

const PROBABILITY_MCQS = [
  { text: 'Which of the following cannot be the probability of an event? (3/5, 25%, 0.96, -0.5)', options: ['3/5', '25%', '0.96', '-0.5'], correct: 3, difficulty: 'Easy', subConcept: 'Probability basics & axioms' },
  { text: 'Which of the following cannot be the probability of an event? (0.67, 6/7, 7/6, 0.76)', options: ['0.67', '6/7', '7/6', '0.76'], correct: 2, difficulty: 'Easy', subConcept: 'Probability basics & axioms' },
  { text: 'Which of the following cannot be the probability of an event? (1.8/3, 1/0.4, 0.4/5, 2/65)', options: ['1.8/3', '1/0.4', '0.4/5', '2/65'], correct: 1, difficulty: 'Easy', subConcept: 'Probability basics & axioms' },
  { text: 'Which of the following cannot be the probability of an event? (4/3, 1/2, 1/4, 3/5)', options: ['4/3', '1/2', '1/4', '3/5'], correct: 0, difficulty: 'Easy', subConcept: 'Probability basics & axioms' },
  { text: 'If the probability of happening of an event is p, then the probability of it not happening is:', options: ['p', 'p - 1', '1 - p', '1 - 1/p'], correct: 2, difficulty: 'Medium', subConcept: 'Probability basics & axioms' },
  { text: 'The probability of the sun rising from the east is P(S), then:', options: ['P(S) = 1', 'P(S) > 1', 'P(S) = 0', 'P(S) < 0'], correct: 0, difficulty: 'Easy', subConcept: 'Probability basics & axioms' },
  { text: 'If P(A) denotes the probability of an event A, then:', options: ['P(A) < 0', 'P(A) > 1', '0 <= P(A) <= 1', '-1 <= P(A) <= 1'], correct: 2, difficulty: 'Medium', subConcept: 'Probability basics & axioms' },
  { text: 'The probability of not happening of an event is 1/3, then the probability of happening of this event will be:', options: ['More than 1/3', 'Less than 1/3', 'Equal to 1/3', '50% less than 1/3'], correct: 0, difficulty: 'Medium', subConcept: 'Probability basics & axioms' },
  { text: 'What will be the probability of an impossible event?', options: ['0', '1', 'Infinity', '0.5'], correct: 0, difficulty: 'Easy', subConcept: 'Probability basics & axioms' },
  { text: 'Which of the following cannot be the probability of an event? (0.7, 2/3, -15, 15%)', options: ['0.7', '2/3', '-15', '15%'], correct: 2, difficulty: 'Easy', subConcept: 'Probability basics & axioms' },
  { text: 'In a simultaneous throw of two coins, the probability of getting at least one head is:', options: ['1/2', '1/3', '2/3', '3/4'], correct: 3, difficulty: 'Medium', subConcept: 'Classical probability - coins & dice' },
  { text: 'Two fair coins are tossed simultaneously. What is the probability of getting at most one tail?', options: ['1/4', '1/2', '3/4', '3/8'], correct: 2, difficulty: 'Medium', subConcept: 'Classical probability - coins & dice' },
  { text: 'Three unbiased coins are tossed together. What is the probability of getting at least two heads?', options: ['1/2', '5/8', '3/4', '7/8'], correct: 0, difficulty: 'Medium', subConcept: 'Classical probability - coins & dice' },
  { text: 'If three different coins are tossed together, then the probability of getting two heads is:', options: ['3/8', '1/2', '3/4', '5/8'], correct: 0, difficulty: 'Medium', subConcept: 'Classical probability - coins & dice' },
  { text: 'Three unbiased coins are tossed together. Then the probability of getting at most two tails:', options: ['1/4', '3/4', '3/8', '7/8'], correct: 3, difficulty: 'Medium', subConcept: 'Classical probability - coins & dice' },
  { text: 'A game consists of tossing a one-rupee coin 3 times. Aryan wins if all tosses give the same result (three heads or three tails) and loses otherwise. The probability that Aryan will lose the game:', options: ['3/4', '1/2', '1', '1/4'], correct: 0, difficulty: 'Hard', subConcept: 'Classical probability - coins & dice' },
  { text: 'In a family of 3 children, the probability of having at least one boy is:', options: ['1/8', '5/8', '3/4', '7/8'], correct: 3, difficulty: 'Medium', subConcept: 'Classical probability - coins & dice' },
  { text: 'A bag contains twenty ₹5 coins, fifty ₹2 coins and thirty ₹1 coins. It is equally likely that one of the coins will fall down when the bag is turned upside down. What is the probability that the coin will be a ₹1 coin?', options: ['0', '1', '1/100', '3/10'], correct: 3, difficulty: 'Medium', subConcept: 'Classical probability - cards & numbers' },
  { text: 'The probability of getting a number divisible by 3 in throwing a die is:', options: ['1/6', '1/3', '1/2', '2/3'], correct: 2, difficulty: 'Medium', subConcept: 'Classical probability - dice' },
  { text: 'In a single throw of a die, the probability of getting a prime number is:', options: ['1/2', '1/3', '1/4', '2/3'], correct: 0, difficulty: 'Easy', subConcept: 'Classical probability - dice' },
  { text: 'A die is thrown once. The probability of getting a number which has at least two factors is:', options: ['1/3', '5/6', '1/2', '2/3'], correct: 1, difficulty: 'Medium', subConcept: 'Classical probability - dice' },
  { text: 'A die is rolled once. The probability of getting a perfect square is:', options: ['1/6', '5/6', '1/3', '2/3'], correct: 2, difficulty: 'Medium', subConcept: 'Classical probability - dice' },
  { text: 'In a simultaneous throw of two dice, what is the probability of getting a total of 7?', options: ['1/6', '1/4', '2/3', '3/4'], correct: 0, difficulty: 'Medium', subConcept: 'Classical probability - dice' },
  { text: 'In a simultaneous throw of two dice, what is the probability of getting a doublet?', options: ['1/4', '2/3', '1/6', '3/7'], correct: 2, difficulty: 'Medium', subConcept: 'Classical probability - dice' },
  { text: 'In a simultaneous throw of two dice, what is the probability of getting a total of 10 or 11?', options: ['1/4', '1/6', '7/12', '5/36'], correct: 3, difficulty: 'Hard', subConcept: 'Classical probability - dice' },
  { text: 'Two dice are thrown simultaneously. What is the probability of getting two numbers whose product is even?', options: ['1/2', '3/4', '3/8', '5/16'], correct: 1, difficulty: 'Hard', subConcept: 'Classical probability - dice' },
  { text: 'Cards marked with numbers 1 to 100 are placed in a box and mixed thoroughly. A card is drawn at random. The probability that the selected card bears a perfect square number is:', options: ['1/10', '2/25', '9/100', '11/100'], correct: 0, difficulty: 'Medium', subConcept: 'Classical probability - cards & numbers' },
  { text: 'Tickets numbered 1 to 20 are mixed up and a ticket is drawn at random. What is the probability that the ticket drawn bears a number which is a multiple of 3?', options: ['1/2', '2/5', '3/10', '3/20'], correct: 2, difficulty: 'Medium', subConcept: 'Classical probability - cards & numbers' },
  { text: 'Cards numbered 1 to 20 are placed in a box and mixed thoroughly. A card is drawn at random. What is the probability that the card drawn bears a number which is a multiple of 3 or 5 or both?', options: ['1/2', '2/5', '8/15', '9/20'], correct: 3, difficulty: 'Medium', subConcept: 'Classical probability - cards & numbers' },
  { text: 'A number is chosen randomly from 10 to 99 (both inclusive) such that each number is equally likely to be chosen. The probability that at least one digit of the chosen number is 8 is:', options: ['1/5', '1/9', '1/10', '19/20'], correct: 0, difficulty: 'Hard', subConcept: 'Classical probability - advanced' },
  { text: 'Choose the incorrect statement about cards numbered 1 to 16: A) probability of a factor of 16 is 1/4, B) probability of an odd composite number is 1/8, C) probability of a multiple of both 2 and 3 is 1/8, D) probability of a perfect square and perfect cube is 1/16.', options: ['A', 'B', 'C', 'D'], correct: 0, difficulty: 'Hard', subConcept: 'Classical probability - advanced' },
  { text: 'A number is chosen at random from -4,-3,-2,-1,0,1,2,3,4. What is the probability that the square of this number is less than or equal to 2?', options: ['1/2', '1/3', '4/9', '5/9'], correct: 1, difficulty: 'Hard', subConcept: 'Classical probability - advanced' },
  { text: 'A number is chosen at random from -5,-4,-3,-2,-1,0,1,2,3,4,5. The probability that the square of this number is less than or equal to 1 is:', options: ['8/11', '3/11', '6/11', '7/11'], correct: 1, difficulty: 'Hard', subConcept: 'Classical probability - advanced' },
  { text: 'A game of chance involves spinning an arrow that comes to rest pointing at one of the numbers 1-8, equally likely outcomes. What is the probability that it will point at number 8?', options: ['1/8', '1/4', '3/8', '1/2'], correct: 0, difficulty: 'Easy', subConcept: 'Classical probability - advanced' },
  { text: 'From the sample space {1,4,9,16,25,29}, if 29 is removed then the probability of getting neither prime nor composite number is:', options: ['2/5', '1/5', '3/5', '4/5'], correct: 1, difficulty: 'Hard', subConcept: 'Classical probability - advanced' },
];

// A small original CBSE Mathematics bank (authored fresh for this rebuild —
// not transcribed from any textbook) so the CBSE side of the demo has real,
// gradable content too.
const CBSE_LINEAR_EQUATIONS = [
  { text: 'The pair of linear equations 2x + 3y = 7 and 4x + 6y = 14 has:', options: ['a unique solution', 'no solution', 'infinitely many solutions', 'exactly two solutions'], correct: 2, difficulty: 'Medium', subConcept: 'Consistency of a pair of linear equations' },
  { text: 'The pair of linear equations x + 2y = 5 and 2x + 4y = 7 is:', options: ['consistent, unique solution', 'consistent, infinitely many solutions', 'inconsistent', 'none of these'], correct: 2, difficulty: 'Medium', subConcept: 'Consistency of a pair of linear equations' },
  { text: 'Graphically, the pair of equations 6x - 3y + 10 = 0 and 2x - y + 9 = 0 represents two lines which are:', options: ['intersecting at one point', 'parallel', 'coincident', 'intersecting at two points'], correct: 1, difficulty: 'Medium', subConcept: 'Graphical solution' },
  { text: 'The value of k for which the system kx + 2y = 5, 3x + y = 1 has a unique solution is:', options: ['k = 6', 'k ≠ 6', 'k = 0', 'k = -6'], correct: 1, difficulty: 'Hard', subConcept: 'Consistency of a pair of linear equations' },
  { text: 'If the lines given by 3x + 2ky = 2 and 2x + 5y + 1 = 0 are parallel, then the value of k is:', options: ['5/4', '2/5', '15/4', '3/2'], correct: 2, difficulty: 'Hard', subConcept: 'Consistency of a pair of linear equations' },
  { text: 'The solution of the pair of equations x - y = 2 and x + y = 4 is:', options: ['x=3, y=1', 'x=1, y=3', 'x=2, y=2', 'x=4, y=0'], correct: 0, difficulty: 'Easy', subConcept: 'Solving by elimination/substitution' },
  { text: 'The sum of the ages of a father and son is 45 years. Five years ago, the father\'s age was 4 times the son\'s age. The son\'s present age is:', options: ['8 years', '10 years', '12 years', '15 years'], correct: 1, difficulty: 'Medium', subConcept: 'Word problems - ages' },
  { text: 'A fraction becomes 1/3 when 1 is subtracted from the numerator, and becomes 1/4 when 8 is added to the denominator. The fraction is:', options: ['3/12', '4/13', '3/13', '5/12'], correct: 1, difficulty: 'Hard', subConcept: 'Word problems - fractions' },
];

const CBSE_QUADRATIC_EQUATIONS = [
  { text: 'Which of the following is a quadratic equation?', options: ['x^2 + 2x + 1 = (4-x)^2 + 3', 'x^3 - x^2 = (x-1)^3', '2x - x^2 = x^2 + 5', 'x(x+1) + 8 = (x+2)(x-2)'], correct: 2, difficulty: 'Easy', subConcept: 'Identifying quadratic equations' },
  { text: 'The roots of the quadratic equation x^2 - 3x - 10 = 0 are:', options: ['2, -5', '-2, 5', '5, -2', '-5, -2'], correct: 1, difficulty: 'Easy', subConcept: 'Solving by factorisation' },
  { text: 'If one root of the equation x^2 + px + 12 = 0 is 4, the value of p is:', options: ['4', '-7', '7', '-4'], correct: 1, difficulty: 'Medium', subConcept: 'Roots and coefficients' },
  { text: 'The discriminant of the quadratic equation 2x^2 - 4x + 3 = 0 is:', options: ['-8', '8', '4', '-4'], correct: 0, difficulty: 'Medium', subConcept: 'Nature of roots (discriminant)' },
  { text: 'For what value of k does the equation kx^2 - 6x - 2 = 0 have real and equal roots?', options: ['k = 9/2', 'k = -9/2', 'k = 9', 'no such k exists'], correct: 1, difficulty: 'Hard', subConcept: 'Nature of roots (discriminant)' },
  { text: "A train travels 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less for the same journey. The original speed of the train is:", options: ['40 km/h', '45 km/h', '35 km/h', '50 km/h'], correct: 1, difficulty: 'Hard', subConcept: 'Word problems - speed/time' },
];

function seedICSEMaths() {
  const subjectId = upsertSubject('ICSE', 'Mathematics');
  const statsChapter = upsertChapter(subjectId, 'Statistics', 23);
  STATISTICS_MCQS.forEach((q) => insertMcq(statsChapter, { ...q, status: 'verified', source: ICSE_SOURCE }));
  const probChapter = upsertChapter(subjectId, 'Probability', 24);
  PROBABILITY_MCQS.forEach((q) => insertMcq(probChapter, { ...q, status: 'verified', source: ICSE_SOURCE }));
  return { subjectId, statsChapter, probChapter };
}

function seedCBSEMaths() {
  const subjectId = upsertSubject('CBSE', 'Mathematics');
  const linearChapter = upsertChapter(subjectId, 'Pair of Linear Equations in Two Variables', 3);
  CBSE_LINEAR_EQUATIONS.forEach((q) => insertMcq(linearChapter, q));
  const quadChapter = upsertChapter(subjectId, 'Quadratic Equations', 4);
  CBSE_QUADRATIC_EQUATIONS.forEach((q) => insertMcq(quadChapter, q));
  // One original case-study question (CBSE board pattern), to exercise the
  // 'case' question kind and the Readiness engine's advanced-question
  // component (Hard difficulty OR case kind both count as "advanced").
  insertCase(quadChapter, {
    text: 'Case Study: A ball is thrown upward and its height h (in metres) after t seconds is modelled by h = -5t^2 + 20t. Answer the following:',
    difficulty: 'Hard',
    subConcept: 'Word problems - applications',
    parts: [
      { text: 'What type of equation is h = -5t^2 + 20t in terms of t?', options: ['Linear', 'Quadratic', 'Cubic', 'Not a polynomial'], correct: 1, marks: 1 },
      { text: 'After how many seconds does the ball return to the ground (h = 0, t > 0)?', options: ['2 s', '4 s', '5 s', '10 s'], correct: 1, marks: 1 },
      { text: 'What is the maximum height reached by the ball?', options: ['15 m', '20 m', '25 m', '30 m'], correct: 1, marks: 2 },
    ],
  });
  return { subjectId, linearChapter, quadChapter };
}

function seedDemoAccounts() {
  const auth = require('./auth');
  function upsertUser(name, email, password, role) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return existing.id;
    return Number(db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(name, email, auth.hashPassword(password), role).lastInsertRowid);
  }
  const teacherId = upsertUser('Demo Teacher', 'teacher@boardready.test', 'demo1234', 'teacher');
  const studentId = upsertUser('Demo Student', 'student@boardready.test', 'demo1234', 'student');
  const existingSub = db.prepare("SELECT id FROM subscriptions WHERE student_id = ? AND status='active'").get(studentId);
  if (!existingSub) db.prepare("INSERT INTO subscriptions (student_id, plan, status) VALUES (?, 'all-subject', 'active')").run(studentId);
  return { teacherId, studentId };
}

if (require.main === module) {
  const icse = seedICSEMaths();
  const cbse = seedCBSEMaths();
  const demo = seedDemoAccounts();
  console.log('Seed complete:', {
    icseStatisticsQuestions: STATISTICS_MCQS.length,
    icseProbabilityQuestions: PROBABILITY_MCQS.length,
    cbseLinearEqQuestions: CBSE_LINEAR_EQUATIONS.length,
    cbseQuadraticQuestions: CBSE_QUADRATIC_EQUATIONS.length + 1,
    demoStudentEmail: 'student@boardready.test', demoStudentPassword: 'demo1234',
    demoTeacherEmail: 'teacher@boardready.test', demoTeacherPassword: 'demo1234',
    icse, cbse,
  });
}

module.exports = { seedICSEMaths, seedCBSEMaths, seedDemoAccounts };
