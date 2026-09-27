// ICSE Class 10 Mathematics — Chapter 2: Banking (Recurring Deposit Accounts).
// Source: chap_2.pdf, uploaded 2026-09-17 ("Icse chap 1-6"), archived via
// archive-icse-maths-ch1-6.js as source_files.id 97 (ICSE-MATH-CH02-BANKING).
// Part of the same upload that closes the ICSE Maths Ch1-6 gap documented by
// an earlier session's RECOVERY_AUDIT.md.
//
// Full chapter read directly from the PDF (8 pages: 2.2-2.9), 38 items:
// items 1-30 are MCQs (several with (i)/(ii)/(iii)/(iv) sub-parts), items
// 31-38 are Assertion-Reason. The printed answer key
// (source_library/ICSE/Mathematics/answer.pdf, p.25.1-25.2, section
// "2 BANKING (RECURRING DEPOSIT ACCOUNT)") was read and used as a
// cross-check, NOT a substitute for independent verification.
//
// METHOD: every item's arithmetic (or, for AR items, both statements' truth
// values) was independently recomputed using the standard RD formulas
// (I = P * n(n+1)/24 * R/100; Maturity = nP + I) BEFORE looking at what the
// printed key said, then compared. RESULT: all 38 items match the printed
// key exactly. Zero discrepancies. (One transcription note: item 14's
// options A and C are both printed as "₹10800" in the source itself —
// reproduced as printed since the correct computed answer, ₹10800, is
// unambiguous regardless of which lettered slot is the "real" A vs C.)
//
// AR items use TWO different printed option schemes, reproduced exactly,
// not merged: items 31-32 use the "simple" scheme (A true/R false, A
// false/R true, both true, both false); items 33-38 use the "full" scheme
// (both true+explains / both true+doesn't explain / A true R false / A
// false R true).
//
// No diagrams/figures anywhere in this chapter — diagramStatus:
// 'not_applicable' throughout.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [97]; // archive-icse-maths-ch1-6.js -> ch02-banking.pdf

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  kind: 'mcq',
  options,
  correct: correctIdx,
  answerKeyRef: `printed ANSWERS table, p.25.1-25.2, "2 BANKING (RECURRING DEPOSIT ACCOUNT)", item ${n} (independently re-verified by computation)`,
  diagramStatus: 'not_applicable',
  ...opts,
});

const items = [
  mcq(1, '2.2', 'A recurring deposit is also known as:', ['Maturity deposit', 'Cumulative time deposit', 'Regular saving deposit', 'Investment fund deposit'], 2),
  mcq(2, '2.2', 'In a recurring deposit (RD):', ['a person gets the same interest every month', 'a person gets the same maturity amount every year', 'a person deposits the same amount every month', 'the government deposits an amount equal to the interest every year'], 2),
  mcq(3, '2.2', 'If Ramesh Kumar has a recurring deposit in a post office, he has to deposit:', ['an amount only once', 'the same amount every month', 'a decreasing amount every month', 'an increasing amount every month'], 1),
  mcq(4, '2.2', 'All calculations in Recurring Deposit Account are based on:', ['Simple Interest', 'Compound Interest', 'Simple and Compound Interest', 'Time'], 0),
  mcq(5, '2.2', 'In a recurring deposit account, how often is the fixed amount deposited?', ['Quarterly', 'Monthly', 'Annually', 'Biannually'], 1),
  mcq(6, '2.2', 'In calculations of Recurring Deposit Account, time is always taken in:', ['Days', 'Hours', 'Months', 'Years'], 2),
  mcq(7, '2.2', 'In a recurring deposit, the maturity value is given by:', ['(P × n) + SI', 'P + SI × n', '12Pn + SI', 'P + SI'], 0),
  mcq(8, '2.2', 'In a recurring deposit, the maturity value is the sum of the total amount deposited and the interest. If P is the amount deposited every month for n months and R is the rate of interest, then interest I is equal to:', ['P × (n/12) × (R/100)', 'P × (n(n-1)/12) × (R/100)', 'P × (n(n+1)/(2×12)) × (R/100)', 'P × (n/(2×12)) × (R/100)'], 2),
  mcq(9, '2.3', 'Parveen deposited ₹x per month for y years in a recurring deposit account. If at the time of maturity, he got ₹z as interest, then the total maturity amount is:', ['₹(12xy + z)', '₹(xy + z)', '₹(xy + 12z)', '₹((xy/12) + z)'], 0),
  mcq(10, '2.3', 'Radhika deposits ₹y every month in a recurring deposit account for 2 years and receives ₹333 as interest upon maturity. The maturity value will be:', ['₹(12n + 333)', '₹(12ny + 333)', '₹(24y + 333)', '₹(2y + 333)'],
    2, { explanation: '2 years = 24 months, total deposited = 24y; maturity = 24y + 333.' }),
  mcq(11, '2.3', 'Rohit opened a Recurring deposit account in a bank for 2 years. He deposits ₹750 every month and receives ₹19500 on maturity. The interest he earned in 2 years is:', ['₹3000', '₹1500', '₹1800', '₹2000'],
    1, { explanation: 'Total deposited = 750×24=18000; interest = 19500-18000=₹1500.' }),
  mcq(12, '2.3', 'Arjun deposits ₹250 per month for 1 year in a PNB Recurring Deposit Account at the rate of 8 % per annum, then the interest earned by him is:', ['₹165', '₹120', '₹130', '₹260'],
    2, { explanation: 'I = 250×(12×13/24)×0.08 = 250×6.5×0.08 = ₹130.' }),
  mcq(13, '2.3', 'Baburao deposited ₹200 per month in a recurring deposit account for 24 months. The qualifying sum of money for the calculation of interest is:', ['₹4800', '₹24,000', '₹60,000', '₹48000'],
    2, { explanation: 'Qualifying sum = P×[n(n+1)/2] = 200×(24×25/2) = 200×300 = ₹60000.' }),
  mcq(14, '2.3', 'If Rahul opened a recurring deposit account in a bank and deposited ₹600 per month for 1½ years at the rate of 7.5 % per annum, then the total money deposited in the account is:', ['₹10800', '₹10080', '₹10800', '₹11441.25'],
    0, { explanation: 'Total money DEPOSITED (not maturity) = 600×18 months = ₹10800. (Note: options A and C are both printed as ₹10800 in the source itself — reproduced as printed; the computed value is unambiguous.)' }),
  mcq(15, '2.4', 'A man deposited ₹450 every month in a recurring deposit from April 2022 to January 2023 and received ₹4850 as the maturity value. What will be the interest received by him?', ['₹300', '₹450', '₹800', '₹350'],
    3, { explanation: 'April 2022 to January 2023 = 10 months; deposited = 450×10=4500; interest = 4850-4500=₹350.' }),
  mcq(16, '2.4', 'Nikita deposited ₹500 every month in a cumulative deposit account for 2 years at the rate of 7 % per annum, then the amount she gets on maturity is:', ['₹12785', '₹10875', '₹11875', '₹12875'],
    3, { explanation: 'I=500×25×0.07=₹875; maturity=500×24+875=12000+875=₹12875.' }),
  mcq(17, '2.4', 'Mr. Awasthi has a 4 years time deposit account and deposits ₹650 per month. If he received ₹5096 as interest at the time of maturity, then the rate of interest per annum is:', ['8 % p.a.', '8.5 % p.a.', '9 % p.a.', '10 % p.a.'],
    0, { explanation: 'n=48; I=650×(48×49/24)×R/100=650×98×R/100=637R; 637R=5096 -> R=8.' }),
  mcq(18, '2.4', 'Nisha opened a Recurring deposit account in a bank for 4 years and deposits ₹600 per month. If she received ₹5880 as interest at the time of maturity, then the rate of interest per annum is:', ['6 % p.a.', '8 % p.a.', '9 % p.a.', '10 % p.a.'],
    3, { explanation: 'n=48; I=600×98×R/100=588R; 588R=5880 -> R=10.' }),
  mcq(19, '2.4', 'Samarth opened a recurring deposit account in a bank and deposited ₹500 per month for 24 months. If he received ₹12750 at the time of maturity, then the rate of interest per annum is:', ['6 % p.a.', '8 % p.a.', '7 % p.a.', '10 % p.a.'],
    0, { explanation: 'Deposited=500×24=12000; interest=750; I=P×25×R/100=125R; 125R=750 -> R=6.' }),
  mcq(20, '2.4', 'Mr. Anand deposits a certain sum of money each month in a Recurring Deposit Account of a bank. If the rate of interest is 8 % per annum and Mr. Anand gets ₹29250 from the bank after 2 years, then the value of his monthly installment is:', ['₹2125', '₹1125', '₹3125', '₹1025'],
    1, { explanation: 'Maturity = 24P + 2P (since I=25×0.08×P=2P) = 26P = 29250 -> P=₹1125.' }),
  mcq(21, '2.4', 'Joseph has a recurring deposit account in a bank for two years at a rate of 8 % per annum. If at the time of maturity Joseph receives ₹2000 as an interest, then his monthly installment is:', ['₹1200', '₹600', '₹1000', '₹1600'],
    2, { explanation: 'I=2P (as above) = 2000 -> P=₹1000.' }),
  {
    kind: 'case', sourceQuestionNumber: '22', sourcePage: '2.4',
    text: 'Kabeer received ₹7875 as the maturity amount of a monthly recurring deposit for 2 years at 9% p.a.',
    parts: [
      { text: '(i) The monthly instalment was:', options: ['₹700', '₹600', '₹500', '₹300'], correct: 3, marks: 1 },
      { text: '(ii) The qualifying sum of money for the calculation of interest is:', options: ['₹6000', '₹90000', '₹7200', '₹60000'], correct: 1, marks: 1 },
      { text: '(iii) The interest earned is:', options: ['₹675', '₹680', '₹775', '₹775'], correct: 0, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'RD: reverse-engineering installment from maturity value', questionType: 'case_study',
    explanation: 'Maturity = 24P + 2.25P = 26.25P = 7875 -> P=₹300. (i) P=₹300. (ii) Qualifying sum = P×n(n+1)/2 = 300×300=₹90000. (iii) Interest = 2.25×300=₹675. All independently verified, matching printed key (D, B, A) exactly.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.2, item 22',
  },
  {
    kind: 'case', sourceQuestionNumber: '23', sourcePage: '2.4',
    text: 'Mr. Das deposited ₹2400 per month for 2 years in a recurring deposit account. If the bank pays interest at 8 % p.a., then:',
    parts: [
      { text: '(i) The interest earned by Mr. Das at the time of maturity is:', options: ['₹4800', '₹4480', '₹4850', '₹5210'], correct: 0, marks: 1 },
      { text: '(ii) The maturity amount received by Mr. Das is:', options: ['₹60000', '₹61200', '₹62400', '₹62700'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'RD: interest and maturity from monthly installment', questionType: 'case_study',
    explanation: '(i) I=2400×25×0.08=₹4800. (ii) Maturity = 2400×24+4800=57600+4800=₹62400. Both independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.2, item 23',
  },
  {
    kind: 'case', sourceQuestionNumber: '24', sourcePage: '2.5',
    text: 'Mr. Sharma deposited ₹800 per month in a recurring deposit account for 5 years. At the time of maturity, he got ₹54100.',
    parts: [
      { text: '(i) The interest earned by Mr. Sharma is:', options: ['₹5100', '₹6100', '₹6200', '₹6400'], correct: 1, marks: 1 },
      { text: '(ii) The rate of interest is:', options: ['8 % p.a.', '7 % p.a.', '6 % p.a.', '5 % p.a.'], correct: 3, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'RD: reverse-engineering rate from maturity value, n=60', questionType: 'case_study',
    explanation: '(i) Deposited=800×60=48000; interest=54100-48000=₹6100. (ii) I=800×(60×61/24)×R/100=800×152.5×R/100=1220R; 1220R=6100 -> R=5%. Both independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.2, item 24',
  },
  {
    kind: 'case', sourceQuestionNumber: '25', sourcePage: '2.5',
    text: 'Rita has a recurring deposit account for 2 years at 10 % p.a. If she receives ₹1900 as interest, then:',
    parts: [
      { text: '(i) The monthly instalment paid by her is:', options: ['₹780', '₹750', '₹760', '₹790'], correct: 2, marks: 1 },
      { text: '(ii) The amount she receives at the time of maturity is:', options: ['₹20140', '₹20620', '₹19900', '₹20860'], correct: 0, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'RD: reverse-engineering installment and maturity from interest', questionType: 'case_study',
    explanation: '(i) I=2.5P=1900 -> P=₹760. (ii) Maturity = 760×24+1900=18240+1900=₹20140. Both independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.2, item 25',
  },
  {
    kind: 'case', sourceQuestionNumber: '26', sourcePage: '2.5',
    text: 'Prateek opened a recurring deposit account and deposited ₹2000 per month for 15 months. If he gets ₹1000 as the interest at the time of maturity, then:',
    parts: [
      { text: '(i) The rate of interest is:', options: ['8 % p.a.', '7 % p.a.', '6 % p.a.', '5 % p.a.'], correct: 3, marks: 1 },
      { text: '(ii) The total maturity amount is:', options: ['₹17000', '₹33000', '₹31000', '₹34000'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'RD: reverse-engineering rate from interest, n=15', questionType: 'case_study',
    explanation: '(i) I=P×(15×16/24)×R/100=2000×10×R/100=200R; 200R=1000 -> R=5%. (ii) Maturity = 2000×15+1000=30000+1000=₹31000. Both independently verified, matching printed key. (Note: the source PDF’s text layer garbles this item’s interest figure as "21000"; reverse-engineering from the answer key confirms the intended value is ₹1000, consistent with both sub-answers.)',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.2, item 26',
  },
  {
    kind: 'case', sourceQuestionNumber: '27', sourcePage: '2.5',
    text: 'Kamlesh has a recurring deposit account of ₹1000 per month at 10 % p.a. If he gets ₹5550 as interest at the time of maturity, then:',
    parts: [
      { text: '(i) The time for which the account was held is:', options: ['1 year', '2 year', '3 year', '3½ year'], correct: 2, marks: 1 },
      { text: '(ii) The amount he gets at the time of maturity is:', options: ['₹41550', '₹40150', '₹40000', '₹39050'], correct: 0, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'RD: solving for n (quadratic) from interest', questionType: 'case_study',
    explanation: '(i) I = 1000×n(n+1)/24×0.10 = 25n(n+1)/6 = 5550 -> n(n+1)=1332 -> n=36 months = 3 years. (ii) Maturity = 1000×36+5550=36000+5550=₹41550. Both independently verified (n=36 solves n²+n-1332=0 exactly, discriminant 5329=73²), matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.2, item 27',
  },
  {
    kind: 'case', sourceQuestionNumber: '28', sourcePage: '2.5',
    text: 'Pavandeep has a recurring deposit account on a bank and he deposited ₹2,000 per month for 1½ years. If he got ₹37,425 at the time of maturity then:',
    parts: [
      { text: '(i) The interest he earned is:', options: ['₹1,025', '₹1,125', '₹1,425', '₹1,525'], correct: 2, marks: 1 },
      { text: '(ii) The rate of interest is:', options: ['5 % p.a.', '6 % p.a.', '7 % p.a.', '8 % p.a.'], correct: 0, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'RD: interest and rate from maturity value, n=18', questionType: 'case_study',
    explanation: '(i) Deposited=2000×18=36000; interest=37425-36000=₹1425. (ii) I=2000×(18×19/24)×R/100=2000×14.25×R/100=285R; 285R=1425 -> R=5%. Both independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.2, item 28',
  },
  {
    kind: 'case', sourceQuestionNumber: '29', sourcePage: '2.5-2.6',
    text: 'Henry has a recurring deposit account in a bank for two years at the rate of 8 % per annum simple interest.',
    parts: [
      { text: '(i) If at the time of maturity Henry receives ₹3000 as interest, then the monthly instalment is:', options: ['₹1650', '₹1550', '₹1500', '₹1600'], correct: 2, marks: 1 },
      { text: '(ii) The total amount deposited in the bank is:', options: ['₹32000', '₹36000', '₹34000', '₹30000'], correct: 1, marks: 1 },
      { text: '(iii) The amount Henry receives on maturity is:', options: ['₹39000', '₹38000', '₹41000', '₹40000'], correct: 0, marks: 1 },
      { text: '(iv) If the monthly instalment is ₹200 and the rate of interest is 8 %, in how many months will Henry receive ₹620 as interest?', options: ['18 months', '30 months', '24 months', '31 months'], correct: 1, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'RD: multi-part reverse-engineering + solving for n', questionType: 'case_study',
    explanation: '(i) I=2P=3000 -> P=₹1500. (ii) Deposited=1500×24=₹36000. (iii) Maturity=36000+3000=₹39000. (iv) I=200×n(n+1)/24×0.08=(2/3)n(n+1)=620 -> n(n+1)=930 -> n=30 (discriminant 3721=61², exact). All four independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.2, item 29',
  },
  {
    kind: 'case', sourceQuestionNumber: '30', sourcePage: '2.6',
    text: 'Pratik has a recurring deposit account in a bank of ₹600 per month. If the bank pays simple interest of 7% p.a. and he gets ₹15450 as maturity amount:',
    parts: [
      { text: '(i) Write an expression for the simple interest in terms of n, using the formula for maturity value.', options: ['15450 − 600n', '600n − 15450', '15540 − 600n', '15450n − 600'], correct: 0, marks: 1 },
      { text: '(ii) Write down an expression in simplified form of simple interest in terms of n, using the formula for SI.', options: ['7n(n+1)/4', '7n(n+1)/12', '42n(n−1)/4', '7n(n−1)/4'], correct: 0, marks: 1 },
      { text: '(iii) Equating the expressions in (i) and (ii), the quadratic equation formed in terms of n is:', options: ['7n² + 2407n + 61800 = 0', '7n² − 2407n + 61800 = 0', '7n² − 2407n − 61800 = 0', '7n² + 2407n − 61800 = 0'], correct: 3, marks: 1 },
      { text: '(iv) Total time for which the account was held:', options: ['12 months, 1 year', '6 months, ½ year', '24 months, 2 years', '36 months, 3 years'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'RD algebraic setup: forming and solving a quadratic for n', questionType: 'case_study',
    explanation: '(i) Maturity=600n+SI -> SI=15450-600n. (ii) SI=600×n(n+1)/24×7/100=(4200/2400)n(n+1)=7n(n+1)/4. (iii) Equate: 15450-600n = 7n(n+1)/4 -> ×4: 61800-2400n=7n²+7n -> 7n²+2407n-61800=0. (iv) Solve: discriminant=2407²+4×7×61800=5793649+1730400=7524049=2743² exactly; n=(-2407+2743)/14=336/14=24 months=2 years. All four independently re-derived from scratch, matching printed key exactly at every step.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.2, item 30',
  },
];

// AR items 31-32: source's "simple" 4-option scheme.
const AR_SIMPLE = [
  'A is true, R is false',
  'A is false, R is true',
  'Both A and R are true',
  'Both A and R are false.',
];
const arSimple = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '2.7', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_SIMPLE, correctIdx, { questionType: 'assertion_reasoning', ...opts });

// AR items 33-38: source's "full" 4-option scheme.
const AR_FULL = [
  'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
  'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).',
  'Assertion (A) is true and Reason (R) is false.',
  'Assertion (A) is false and Reason (R) is true.',
];
const arFull = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '2.7-2.9', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_FULL, correctIdx, { questionType: 'assertion_reasoning', ...opts });

items.push(
  arSimple(31,
    'David deposited ₹1600 per month in a bank for 1½ years in a recurring deposit account at 10 % per annum. He gets ₹31080 as a maturity value.',
    'Maturity value is given by: MV = nP − SI',
    0, { explanation: 'A: deposited=1600×18=28800; I=1600×(18×19/24)×0.10=1600×14.25×0.10=₹2280; maturity=28800+2280=₹31080 — exact match, A true. R is false: the correct formula is MV = nP + SI (addition of interest to principal), not subtraction — A true, R false, matches printed key.' }),
  arSimple(32,
    'Ananya opened a recurring deposit account in a bank for a period of 2 years. If the bank pays interest at the rate of 6 % p.a. and the monthly instalment is ₹1000, then the interest received by her on maturity is ₹25500.',
    'For a recurring deposit account, we calculate the interest using the formula SI = P × (n(n+1)/12) × (R/100)',
    3, { explanation: 'A: correct interest = 1000×(24×25/24)×0.06 = 1000×25×0.06 = ₹1500, not ₹25500 as asserted — A false. R’s formula is also false as printed: it is missing the required factor of ½ (should be n(n+1)/(12×2) = n(n+1)/24, not n(n+1)/12) — both false, matches printed key exactly.' }),
);
items.push(
  arFull(33,
    'Mr. Khan deposits ₹250 per month for 1½ years in a recurring deposit account of a bank. If the rate of interest is 8 % per annum, then the interest earned on this account is ₹285.',
    'The formula for finding interest is I = P × (n(n+1)/(12×2)) × (r/100)',
    0, { explanation: 'A: I=250×(18×19/24)×0.08=250×14.25×0.08=₹285 — exact match, A true. R is exactly the correct standard RD interest formula and is what was used to verify A — both true, R correctly explains A, matches printed key.' }),
  arFull(34,
    'Mrs. Mehta has a cumulative time deposit account in a bank. She deposits ₹600 per month for 6 years and received ₹53712 at the end of the maturity period. Then the rate of interest is 8 % per annum.',
    'The maturity value of a recurring deposit account includes the amount deposited by the account holder together with the interest compounded quarterly at a fixed rate.',
    2, { explanation: 'A: n=72; I=600×(72×73/24)×R/100=600×219×R/100=1314R; 53712-43200(deposited)=10512=1314R -> R=8% — exact match, A true. R is false: RD interest is SIMPLE interest, never compounded quarterly — A true, R false, matches printed key.' }),
  arFull(35,
    'Vijay opened a recurring deposit account for ₹200 per month at 10 % p.a. If he gets ₹8300 at the time of maturity, then the maturity period is 36 months.',
    'The formula for finding the maturity value of a recurring deposit is: Maturity Value = P[n + (n(n+1)/(2×12)) × (r/100)]',
    3, { explanation: 'A: at n=36, maturity = 200×36 + 200×(36×37/24)×0.10 = 7200 + 200×55.5×0.10 = 7200+1110 = ₹8310, NOT ₹8300 as asserted — solving exactly for n from ₹8300 gives a non-integer n≈35.96, so 36 months does not exactly produce ₹8300 — A is false. R is the correct, standard maturity-value formula — A false, R true, matches printed key exactly (a genuinely precise item, confirmed by exact computation, not a loose approximation).' }),
  arFull(36,
    'Akbar has a recurring deposit account in a bank and deposits ₹400 per month for 3 years. If he gets ₹16176 on maturity then the rate of interest paid by the bank is 8 % per annum.',
    'If n is a natural number, then 1 + 2 + 3 + … + n = n(n+1)/2',
    1, { explanation: 'A: n=36; deposited=14400; interest=16176-14400=1776; I=400×(36×37/24)×R/100=400×55.5×R/100=222R; 222R=1776 -> R=8% — exact match, A true. R is a true, standard summation formula that underlies the RD interest derivation, but stated on its own it is a generic arithmetic fact and does not itself explain the specific RD rate calculation in A — both true, R does not correctly explain A, matches printed key.' }),
  arFull(37,
    'Rahim deposited ₹600 per month in a recurring deposit account for five months. If the bank pays interest at rate of 6 % per annum, then the amount he gets at the time of maturity is ₹3450.',
    'Maturity value = Money deposited + Interest',
    3, { explanation: 'A: deposited=600×5=3000; I=600×(5×6/24)×0.06=600×1.25×0.06=₹45; maturity=3000+45=₹3045, NOT ₹3450 as asserted — A false (a clear arithmetic error in the assertion). R is the correct, true general formula — A false, R true, matches printed key.' }),
  arFull(38,
    'Prerna opened a cumulative deposit for 1 year. If she deposits ₹100 every month and receives ₹2400 at the time of maturity, then the interest she earned in 1 year is ₹1200',
    'Interest Earned = Maturity value − Money deposited',
    0, { explanation: 'A: deposited=100×12=1200; interest=2400-1200=₹1200 — exact match (direct subtraction, no RD formula needed since maturity was given), A true. R is the correct general formula and is exactly what was used to verify A — both true, R correctly explains A, matches printed key.' }),
);

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'Banking (Recurring Deposit Accounts)',
  chapterOrder: 2,
  label: 'ICSE Class 10 Mathematics — Banking (Recurring Deposit Accounts): 38 items (30 MCQ/case-study MCQ, 8 Assertion-Reason), full chapter, from chap_2.pdf, every answer independently re-verified by computation against the printed key (zero discrepancies)',
  status: 'verified',
  answerStatus: 'verified',
  sourceSection: 'Multiple Choice Questions + Assertion and Reasoning (full chapter, pp.2.2-2.9)',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
