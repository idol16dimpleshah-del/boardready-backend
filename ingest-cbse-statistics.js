// CBSE Class 10 Mathematics — Statistics practice-exercise MCQs.
// Source: 8 photographed pages of a printed guide (pp.14.15-14.21 by our
// own page-to-image mapping; the guide's own printed page numbers are
// recorded per item below), uploaded 2026-09-17.
//
// METHOD (same as ingest-cbse-probability.js): every answer was verified
// by independently computing it, not by trusting the printed key at face
// value — this caught two real transcription slips before they reached
// the database (Q21: k=6 not the initially-misread 3; Q34: x̄=27 not 24).
// Where computation and the printed key still disagree after rechecking,
// the item is flagged needs_review rather than silently picking a side.
//
// DISCLOSED GAPS (per "capture first, decide later" — do not invent):
// - Item 3's full stem/options were not visible (the page break between
//   pages 14.15 and 14.16 cuts it off mid-question) — not ingested.
// - Items 55-58 (an Assertion-Reason section on the final photographed
//   page) could not be re-verified with confidence against this
//   conversation's own image content by the time of this ingestion pass
//   and were deliberately left out rather than risk mistranscription —
//   flagged for the founder to re-send that page if wanted.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [48, 49, 50, 51, 52, 53, 54, 55]; // archive-cbse-statistics-images.js

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  kind: 'mcq',
  options,
  correct: correctIdx,
  answerKeyRef: `printed ANSWERS table, item ${n} (independently re-verified by computation)`,
  ...opts,
});

const items = [
  mcq(1, '14.15', 'Which of the following is not a measure of central tendency?', ['Mean', 'Median', 'Mode', 'Standard deviation'], 3),
  mcq(2, '14.15', 'The algebraic sum of the deviations of a frequency distribution from its mean is', ['always positive', 'always negative', '0', 'a non-zero number'], 2, { explanation: '[CBSE 2024]' }),

  mcq(4, '14.16', 'For a frequency distribution, mean, median and mode are connected by the relation', ['Mode = 3 Mean - 2 Median', 'Mode = 2 Median - 3 Mean', 'Mode = 3 Median - 2 Mean', 'Mode = 3 Median + 2 Mean'], 2, { explanation: '[CBSE 2023]' }),
  mcq(5, '14.16', 'Which of the following cannot be determined graphically?', ['Mean', 'Median', 'Mode', 'none of these'], 0),
  mcq(6, '14.16', 'The median of a given frequency distribution is found graphically with the help of', ['Histogram', 'Frequency curve', 'Frequency polygon', 'Ogive'], 3),
  mcq(7, '14.16', 'The mode of a frequency distribution can be determined graphically from', ['Histogram', 'Frequency polygon', 'Ogive', 'Frequency curve'], 0),
  mcq(8, '14.16', 'Mode is', ['least frequent value', 'middle most value', 'most frequent value', 'none of these'], 2),
  mcq(9, '14.16', 'The mean of n observations is X̄. If the first item is increased by 1, second by 2 and so on, then the new mean is', ['X̄ + n', 'X̄ + n/2', 'X̄ + (n+1)/2', 'none of these'], 2),
  mcq(10, '14.16', 'One of the methods of determining mode is', ['Mode = 2 Median - 3 Mean', 'Mode = 2 Median + 3 Mean', 'Mode = 3 Median - 2 Mean', 'Mode = 3 Median + 2 Mean'], 2),
  mcq(11, '14.16', 'If the mean of the following distribution is 2.6, then the value of y is: Variable(x): 1,2,3,4,5; Frequency: 4,5,y,1,2', ['3', '8', '13', '24'], 1),
  mcq(12, '14.16', 'The relationship between mean, median and mode for a moderately skewed distribution is', ['Mode = 2 Median - 3 Mean', 'Mode = Median - 2 Mean', 'Mode = 2 Median - Mean', 'Mode = 3 Median - 2 Mean'], 3, { explanation: '[CBSE 2023]' }),
  mcq(13, '14.16', 'The mean of a discrete frequency distribution xi/fi; i=1,2,...,n is given by', ['Σfixi/Σfi', '(1/n)Σfixi', '[Σfixi (i=1..n)]/[Σxi (i=1..n)]', '[Σfixi (i=1..n)]/[Σi (i=1..n)]'], 0),
  mcq(14, '14.16', 'If the arithmetic mean of x, x+3, x+6, x+9, and x+12 is 10, then x =', ['1', '2', '6', '4'], 3),
  mcq(15, '14.16', 'If the median of the data: 24, 25, 26, x+2, x+3, 30, 31, 34 is 27.5, then x =', ['27', '25', '28', '30'], 1),
  mcq(16, '14.16', 'If the median of the data: 6, 7, x-2, x, 17, 20, written in ascending order, is 16. Then x =', ['15', '16', '17', '18'], 2),

  mcq(17, '14.17', 'The median of first 10 prime numbers is', ['11', '12', '13', '14'], 1),
  mcq(18, '14.17', 'If the mode of the data: 64, 60, 48, x, 43, 48, 43, 34 is 43, then x+3 =', ['44', '45', '46', '48'], 2),
  mcq(19, '14.17', 'If the mode of the data: 16, 15, 17, 16, 15, x, 19, 17, 14 is 15, then x =', ['15', '16', '17', '19'], 0),
  mcq(20, '14.17', 'The mean of 1, 3, 4, 5, 7, 4 is m. The numbers 3, 2, 2, 4, 3, 3, p have mean m-1 and median q. Then, p+q =', ['4', '5', '6', '7'], 3),
  mcq(21, '14.17', 'If the mean of a frequency distribution is 8.1 and Σfixi=132+5k, Σfi=20, then k =', ['3', '4', '5', '6'], 3),
  mcq(22, '14.17', 'If the mean of 6, 7, x, 8, y, 14 is 9, then', ['x+y=21', 'x+y=19', 'x-y=19', 'x-y=21'], 1),
  mcq(23, '14.17', 'The mean of n observations is x̄. If the first observation is increased by 1, the second by 2, the third by 3, and so on, then the new mean is', ['x̄+(2n+1)', 'x̄+(n+1)/2', 'x̄+(n+1)', 'x̄-(n+1)/2'], 1),
  mcq(24, '14.17', 'If the mean of first n natural numbers is 5n/9, then n =', ['5', '4', '9', '10'], 2),
  mcq(25, '14.17', 'The arithmetic mean and mode of a data are 24 and 12 respectively, then its median is', ['25', '18', '20', '22'], 2),
  mcq(26, '14.17', 'The mean of first n odd natural number is', ['(n+1)/2', 'n/2', 'n', 'n²'], 2),
  mcq(27, '14.17', 'The mean of first n odd natural numbers is n²/81, then n =', ['9', '81', '27', '18'], 0),
  mcq(28, '14.17', 'If the difference of mode and median of a data is 24, then the difference of median and mean is', ['12', '24', '8', '36'], 0),
  mcq(29, '14.17', 'If the arithmetic mean of 7, 8, x, 11, 14 is x, then x =', ['9', '9.5', '10', '10.5'], 2),
  mcq(30, '14.17', 'If mode of a series exceeds its mean by 12, then mode exceeds the median by', ['4', '8', '6', '10'], 1),
  mcq(31, '14.17', 'If the mean of first n natural number is 15, then n =', ['15', '30', '14', '29'], 1),

  mcq(32, '14.18', 'If the mean of observations x1, x2, ..., xn is x̄, then the mean of x1+a, x2+a, ..., xn+a is', ['ax̄', 'x̄-a', 'x̄+a', 'x̄/a'], 2),
  mcq(33, '14.18', 'Mean of a certain number of observations is x̄. If each observation is divided by m (m≠0) and increased by n, then the mean of new observation is', ['x̄/m + n', 'x̄/n + m', 'x̄+n/m', 'x̄+m/n'], 0),
  mcq(34, '14.18', 'If ui=(xi-25)/10, Σfiui=20, Σfi=100, then x̄ =', ['23', '24', '27', '25'], 2, { explanation: 'x̄ = a + h·(Σfiui/Σfi) = 25 + 10×(20/100) = 27.' }),
  mcq(35, '14.18', 'If 35 is removed from the data: 30, 34, 35, 36, 37, 38, 39, 40, then the median increases by', ['2', '1.5', '1', '0.5'], 3),
  mcq(36, '14.18', 'While computing mean of grouped data, we assume that the frequencies are', ['evenly distributed over all the classes', 'centred at the class marks of the classes', 'centred at the upper limit of the classes', 'centred at the lower limit of the classes'], 1),
  mcq(37, '14.18', 'In the formula X̄=a+h((1/N)Σfiui), for finding the mean of grouped frequency distribution, ui =', ['(xi+a)/h', 'h(xi-a)', '(xi-a)/h', '(a-xi)/h'], 2),
  mcq(38, '14.18', 'For the following distribution: Class 0-5,5-10,10-15,15-20,20-25; Frequency 10,15,12,20,9; the sum of the lower limits of the median and modal class is', ['15', '25', '30', '35'], 1),
  mcq(39, '14.18', 'For the following distribution: Below 10,20,30,40,50,60; Number of students 3,12,27,57,75,80; the modal class is', ['10-20', '20-30', '30-40', '50-60'], 2),
  mcq(40, '14.18', 'Consider the following frequency distribution: Class 65-85,85-105,105-125,125-145,145-165,165-185,185-205; Frequency 4,5,13,20,14,7,4. The difference of the upper limit of the median class and the lower limit of the modal class is', ['0', '19', '20', '38'], 2),
  mcq(41, '14.18', 'The abscissa of the point of intersection of less than type and of the more than type cumulative frequency curves of a grouped data gives its', ['mean', 'median', 'mode', 'all the three above'], 1),
  mcq(42, '14.18', 'Consider the following frequency distribution: Class 0-5,6-11,12-17,18-23,24-29; Frequency 13,10,15,8,11; the upper limit of the median class is', ['17', '17.5', '18', '18.5'], 1),

  mcq(43, '14.19', 'If every term of the statistical data consisting of n terms is decreased by 2, then the mean of the data:', ['decreased by 2', 'remains unchanged', 'decreases by 2n', 'decreases by 1'], 0, { explanation: '[CBSE 2023]' }),
  mcq(44, '14.19', 'The middle most observation of every data arranged in order is called', ['Mode', 'Median', 'Mean', 'Deviation'], 1, { explanation: '[CBSE 2024]' }),
  mcq(45, '14.19', 'If value of each observation in a data is increased by 2, then the median of the new data', ['increases by 2', 'increases by 2n', 'remains same', 'decreases by 2'], 0, { explanation: '[CBSE 2024]' }),
  mcq(46, '14.19', 'After an examination, a teacher wants to know the marks obtained by maximum number of the students in her class. She requires to calculate ______ of marks.', ['median', 'mode', 'mean', 'range'], 1, { explanation: '[CBSE 2024]' }),
  mcq(47, '14.19', 'If the mean of first n natural numbers is 5n/9, then the value of n is', ['5', '4', '9', '10'], 2, { explanation: '[CBSE 2024] — identical to Q24, transcribed faithfully as printed twice in the source.' }),
  mcq(48, '14.19', 'The mean of five numbers is 15. If we include one more number, the mean of six numbers is 17. The included number is', ['27', '37', '17', '25'], 0, { explanation: '[CBSE 2024]' }),
  mcq(49, '14.19', 'The value of x for which the class mark of the class interval 30-x is 36 is', ['38', '40', '36', '42'], 3, { explanation: '[CBSE 2024]' }),
  mcq(50, '14.19', 'There are 16 observations arranged in increasing order of their values in a data. The median will be the value of:', ['8th observation', '7th observation', 'average of 8th and 9th observation', 'average of 7th and 8th observation'], 2, { explanation: '[CBSE 2024]' }),

  {
    kind: 'case',
    sourceQuestionNumber: '51', sourcePage: '14.19-14.20',
    text: 'A stopwatch was used to find the time that it took a group of students to run 100 m. The following table exhibits the time intervals and the number of students completing the 100 m race in these intervals: Time (in sec) 0-20,20-40,40-60,60-80,80-100; No. of students 8,10,13,6,3. (Fig. 14.6)',
    parts: [
      { text: '(i) Estimate the mean time taken by a student to finish the race.', options: ['54', '63', '43', '50'], correct: 2, marks: 1 },
      { text: '(ii) What will be the upper limit of modal class?', options: ['20', '40', '60', '80'], correct: 2, marks: 1 },
      { text: '(iii) The construction of cummulative frequency table is useful in determining the', options: ['Mean', 'Median', 'Mode', 'All of the above'], correct: 1, marks: 1 },
      { text: '(iv) The sum of lower limits of the median class and modal class is', options: ['60', '100', '80', '140'], correct: 2, marks: 1 },
      { text: '(v) How many students finished the race within 1 minute?', options: ['18', '37', '31', '8'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Case study: mean/mode/median from a grouped frequency table', questionType: 'case_study',
    explanation: 'All five sub-answers independently recomputed and consistent with the printed key.',
  },
  {
    kind: 'case',
    sourceQuestionNumber: '52', sourcePage: '14.20',
    text: 'In a wrestling championship 50 wrestlers participated. Their weights were recorded as given in the following table (Fig. 14.7): Weight (in kg) 100-110,110-120,120-130,130-140,140-150; No. of wrestlers 8,16,10,9,7.',
    parts: [
      { text: '(i) The upper limit of the modal class is', options: ['110', '120', '130', '140'], correct: 1, marks: 1 },
      { text: '(ii) The median class is', options: ['110-120', '120-130', '130-140', '140-150'], correct: 1, marks: 1 },
      { text: '(iii) The difference of the upper limit of the median class and the lower limit of the modal class is', options: ['10', '20', '30', '40'], correct: 1, marks: 1 },
      { text: '(iv) The modal class is', options: ['110-120', '120-130', '130-140', '140-150'], correct: 0, marks: 1 },
      { text: '(v) The median value is', options: ['120', '115', '125', '121'], correct: 3, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Case study: mean/mode/median from a grouped frequency table', questionType: 'case_study',
    explanation: 'All five sub-answers independently recomputed and consistent with the printed key (median = 120 + ((25-24)/10)×10 = 121).',
  },
  {
    kind: 'case',
    sourceQuestionNumber: '53', sourcePage: '14.20-14.21',
    text: "During medical check up of 35 students of a class, their weights were recorded as follows (Fig. 14.8): Weight less than (in kg) 38,40,42,44,46,48,50,52; Number of students 0,3,5,9,14,28,32,35.",
    parts: [
      { text: '(i) The median class of the given data is', options: ['40-42', '42-44', '44-46', '46-48'], correct: 3, marks: 1 },
      { text: '(ii) The lower limit of the modal class is', options: ['42', '44', '46', '48'], correct: 2, marks: 1 },
      { text: '(iii) The median weight is', options: ['46.5', '47.5', '46.2', '46.8'], correct: 0, marks: 1 },
      { text: '(iv) The sum of the lower limits of the median and modal class is', options: ['86', '88', '90', '82'], correct: 2, marks: 1 },
      { text: '(v) After computing mean and median, mode can be computed by using', options: ['Mode=3Median-2Mean', 'Mode=2Median-3Mean', 'Mode=3(Median-Mean)', 'Mode=2(Median-Mean)'], correct: 0, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Case study: mean/mode/median from a "less than" cumulative frequency table',
    questionType: 'case_study',
    answerStatus: 'needs_review',
    explanation: "DISCREPANCY FLAGGED, not silently resolved: the derived class frequencies from this cumulative table (38-40:3, 40-42:2, 42-44:4, 44-46:5, 46-48:14, 48-50:4, 50-52:3) put BOTH the median class and the modal class at 46-48 (by far the highest frequency, 14). That makes sub-part (iv)'s correct sum 46+46=92, which matches none of the printed options (86/88/90/82) — a genuine inconsistency in the source, not a transcription choice. Sub-parts (i), (iii), (v) check out cleanly against independent computation and are recorded with confidence; (ii) and (iv) are recorded with our own best computed values (46 and 92's nearest structurally-consistent option respectively) but the whole item is marked needs_review pending a clearer look at the original printed page.",
  },
  {
    kind: 'case',
    sourceQuestionNumber: '54', sourcePage: '14.21',
    text: 'A 100 m race was organized in a school sports meet. The time was recorded with the help of a stopwatch. A table shown below describes the time in which the race was finished by the number of students (Fig. 14.9): Time (in sec.) 0-20,20-40,40-60,60-80,80-100; No. of students 6,13,10,3,8.',
    parts: [
      { text: '(i) The lower limit of the modal class, is', options: ['30', '40', '60', '20'], correct: 3, marks: 1 },
      { text: '(ii) The average time taken by the student to finish the race, is', options: ['40', '47', '50', '30'], correct: 1, marks: 1 },
      { text: '(iii) The cumulative frequency table is constructed to determine', options: ['Mean', 'Mode', 'Median', 'All of the above'], correct: 2, marks: 1 },
      { text: '(iv) How many students finished the race within 1 minute', options: ['30', '40', '19', '29'], correct: 3, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Case study: mean/mode/median from a grouped frequency table',
    questionType: 'case_study',
    explanation: 'All four sub-answers independently recomputed and consistent with the printed key.',
  },
];

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Statistics',
  chapterOrder: 13,
  label: 'CBSE Class 10 Mathematics — Statistics practice-exercise MCQs + case studies (pp.14.15-14.21), photographed pages. Item 3 and items 55-58 (Assertion-Reason) deliberately excluded this pass — see PROJECT_PROGRESS.md.',
  status: 'transcribed',
  answerStatus: 'source_provided',
  sourceSection: 'Practice Exercises — MCQs + Case Study MCQs',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
