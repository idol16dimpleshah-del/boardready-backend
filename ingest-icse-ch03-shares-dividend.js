// ICSE Class 10 Mathematics — Chapter 3: Shares and Dividend.
// Source: chap_3.pdf, uploaded 2026-09-17 ("Icse chap 1-6"), archived via
// archive-icse-maths-ch1-6.js as source_files.id 98 (ICSE-MATH-CH03-SHARES).
// Part of the same upload that closes the ICSE Maths Ch1-6 gap documented by
// an earlier session's RECOVERY_AUDIT.md.
//
// Full chapter read directly from the PDF (8 pages: 3.2-3.9), 48 items:
// items 1-38 are MCQs (several with (i)/(ii)/(iii)/(iv) sub-parts), items
// 39-48 are Assertion-Reason. The printed answer key
// (source_library/ICSE/Mathematics/answer.pdf, p.25.2, section
// "3 SHARES AND DIVIDEND") was read and used as a cross-check, NOT a
// substitute for independent verification.
//
// METHOD: every item's arithmetic (or, for AR items, both statements' truth
// values) was independently recomputed from the standard Shares & Dividend
// formulas (Investment = shares × MV; Nominal/Face value total = shares
// × FV; Dividend = shares × FV × rate/100; Rate of Return = Dividend/MV
// × 100) BEFORE consulting the printed key. RESULT: all 48 items match the
// printed key exactly on independent recomputation. Zero discrepancies.
// (Two items required careful re-derivation because of unusual numbers
// baked into the assertion itself: item 44's "₹12 shares" is not a typo —
// FV=₹12, premium ₹1, MV=₹13, and 400×13=₹5200 checks out exactly;
// item 38(iv)'s options A and C are both printed as "₹960" in the source
// itself, reproduced as printed since the computed value ₹960 is
// unambiguous regardless of which lettered slot is canonical.)
//
// AR items use TWO different printed option schemes, reproduced exactly:
// items 39-45 use the "simple" scheme (A true/R false, A false/R true, both
// true, both false); items 46-48 use the "full" scheme (both true+explains
// / both true+doesn't explain / A true R false / A false R true).
//
// No diagrams/figures anywhere in this chapter — diagramStatus:
// 'not_applicable' throughout.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [98]; // archive-icse-maths-ch1-6.js -> ch03-shares-and-dividend.pdf

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  kind: 'mcq',
  options,
  correct: correctIdx,
  answerKeyRef: `printed ANSWERS table, p.25.2, "3 SHARES AND DIVIDEND", item ${n} (independently re-verified by computation)`,
  diagramStatus: 'not_applicable',
  ...opts,
});

const items = [
  mcq(1, '3.2', 'The total amount of money needed to run a company is called:', ['Shares', 'Capital', 'Dividend', 'Principal'], 1),
  mcq(2, '3.2', 'The whole capital is divided into small units called:', ['Shares', 'Share holders', 'Face value', 'Dividend'], 0),
  mcq(3, '3.2', 'The annual profit distributed among share holders is called:', ['Nominal value', 'Market value', 'Dividend', 'Face value'], 2),
  mcq(4, '3.2', 'The value of a share printed on the share certificate is called its:', ['Nominal value', 'Market value', 'Discount', 'Dividend'], 0),
  mcq(5, '3.2', 'The shares of different companies can be bought or sold in the market through stock exchange. The price at which the share is sold or purchased is called its:', ['Face value', 'Market value', 'Par value', 'Nominal value'], 1),
  mcq(6, '3.2', 'If the market value of shares is the same as its face value, then share is said to be at:', ['Premium', 'Discount', 'Par', 'Nominal value'], 2),
  mcq(7, '3.3', 'A share is said to be at premium, if market value is _____ than its face value.', ['More', 'Less', 'Same', 'Equal'], 0),
  mcq(8, '3.3', 'If the market value of a share is less than its face value, then the share is said to be:', ['At par', 'Above par', 'Below par', 'Premium'], 2),
  mcq(9, '3.3', 'The face value of a share:', ['Changes every year', 'Changes from time to time', 'Always remains the same', 'Changes every 6 months'], 2),
  mcq(10, '3.3', 'Dividend is always paid on the _____ of a share.', ['Market value', 'Face value', 'Investment', 'Dividend'], 1),
  mcq(11, '3.3', 'The market value of a share:', ['Never changes', 'Changes from time to time', 'Changes every month', 'Only once a year'], 1),
  mcq(12, '3.3', 'Number of shares held by a person =', ['Total Income / Dividend per share', 'Total Market Value / Face Value of 1 Share', 'Total income / Market Value of 1 Share', '(Dividend / Total Investment) × 100'], 0),
  mcq(13, '3.3', 'Dividend =', ['Number of shares × Nominal value', 'Number of shares × Market value', 'Face value × Number of Shares × (Rate of Dividend/100)', 'Face value × Number of Shares'], 2),
  mcq(14, '3.3', 'Rate of Return on Investment =', ['Investment / Dividend', 'Dividend / Investment', '(Dividend / Investment) × 100', '(Investment / Dividend) × 100'], 2),
  mcq(15, '3.4', 'Investment (Sale proceeds) =', ['Number of shares × Market Value', 'Number of shares × Nominal Value', 'Face Value × Number of shares × Rate of Dividend', 'Dividend / Investment'], 0),
  mcq(16, '3.4', 'If a share of ₹100 is selling at ₹125, then it is said to be selling at a _____ of ₹25.', ['Discount', 'Premium', 'Par', 'Below Par'], 1),
  mcq(17, '3.4', 'If a share of ₹125 is selling at ₹96, then it is said to be selling at:', ['Below par', 'At par', 'Above par', 'Premium'], 0),
  mcq(18, '3.4', 'Annual Income =', ['Number of shares × Face value', 'Number of shares × Rate of Dividend × Face value of 1 Share', 'Number of shares × Market value × Face value', 'MV × NV × 100'], 1),
  mcq(19, '3.4', 'Which of the following statements are not true: 1. The price at which the share of a company is sold or purchased is called the Nominal Value of the share. 2. The dividend paid by the company to a share holder is also known as Annual Income. 3. The Market value of a share never changes.', ['only 1 and 2', 'only 1 and 3', 'only 2', 'All 1, 2 and 3'],
    1, { explanation: 'Statement 1 is false (that describes Market Value, not Nominal Value). Statement 2 is TRUE (dividend received is indeed the shareholder’s annual income). Statement 3 is false (market value changes constantly). So statements 1 and 3 are the not-true ones.' }),
  mcq(20, '3.4', 'If Kabir invests ₹10320 on ₹100 shares at a discount of ₹14, then the number of shares he buys is:', ['110', '120', '150', '100'],
    1, { explanation: 'MV = 100-14=86; shares = 10320/86 = 120.' }),
  mcq(21, '3.4', 'Shahrukh has some shares of ₹50 of a company paying 15 % dividend. If his annual income is ₹3000, then the number of shares he holds is:', ['400', '600', '800', '200'],
    0, { explanation: 'Dividend per share = 50×0.15=7.5; shares = 3000/7.5=400.' }),
  mcq(22, '3.4', 'If Kiran invests ₹19200 in ₹50 shares at a premium of 20 %, then the number of shares she buys is:', ['640', '160', '320', '240'],
    2, { explanation: 'MV = 50×1.20=60; shares = 19200/60=320.' }),
  mcq(23, '3.5', 'Varun possesses 600 shares of ₹25 of a company. If the company announces a dividend of 8 %, then his annual income is:', ['₹600', '₹1200', '₹480', '₹120'],
    1, { explanation: 'Annual income = 600×25×0.08=₹1200.' }),
  mcq(24, '3.5', 'A man invests ₹24000 in ₹60 shares at a discount of 20 %. If the dividend declared by the company is 10 %, then his annual income is:', ['₹2880', '₹1500', '₹3000', '₹2400'],
    2, { explanation: 'MV=60×0.8=48; shares=24000/48=500; income=500×6(=10% of 60)=₹3000.' }),
  mcq(25, '3.5', '₹25 shares of a company are selling at ₹20. If the company is paying a dividend of 12 %, then the rate of return is:', ['10 %', '15 %', '18 %', '12 %'],
    1, { explanation: 'Dividend per share = 25×0.12=3; rate of return = 3/20×100=15%.' }),
  mcq(26, '3.5', 'By purchasing ₹25 shares for ₹40 each, a man gets 4 % profit on his investment, then the rate of dividend is:', ['6.8 %', '4.6 %', '6.4 %', '4.8 %'],
    2, { explanation: 'Dividend per share = 4% of 40=1.6; rate of dividend on FV 25 = 1.6/25×100=6.4%.' }),
  mcq(27, '3.5', 'Kamal buys x number of shares at par of a certain company paying y % dividend. The rate of return will be:', ['Equal to y %', 'Lesser than y %', 'Greater than y %', 'Equal to xy %'],
    0, { explanation: 'At par, MV=FV, so rate of return = dividend%×FV/MV = y%×1 = y%.' }),
  mcq(28, '3.5', '₹40 shares of a company are selling at 25 % premium. If Mr. Wasim wants to buy 280 shares of the company, then the investment required by him is:', ['₹14000', '₹16800', '₹8400', '₹10000'],
    0, { explanation: 'MV=40×1.25=50; investment=280×50=₹14000.' }),
  mcq(29, '3.5', 'Mr. Subhash sells 150, ₹100 shares at a premium of ₹22. His sale proceeds are:', ['₹13800', '₹18300', '₹15000', '₹11700'],
    1, { explanation: 'MV=100+22=122; sale proceeds=150×122=₹18300.' }),
  mcq(30, '3.5', 'Mr. Rajesh holds 150 shares of face value ₹50 each. The company declares a dividend of 15 %, then his income is:', ['₹1125', '₹1250', '₹1100', '₹1800'],
    0, { explanation: 'Income = 150×50×0.15=₹1125.' }),
  mcq(31, '3.5', 'If half-yearly dividend is 4 % of the value of the share, then the dividend due at the end of a year on 250 shares of ₹50 each is:', ['₹1250', '₹1000', '₹1100', '₹1500'],
    1, { explanation: 'Annual dividend rate = 2×4%=8%; income=250×50×0.08=₹1000.' }),
  mcq(32, '3.5', 'A firm declares 6 % half yearly dividend. A person has 300 shares of ₹20 each. What will he receive as yearly dividend?', ['₹720', '₹820', '₹920', '₹1020'],
    0, { explanation: 'Annual rate = 2×6%=12%; income = 300×20×0.12=₹720.' }),
  mcq(33, '3.6', 'Mrs. Malik sells out a stock of shares of ₹8500, when the price stands at ₹83 which was bought at ₹100 per share, then amount received on selling is:', ['₹6000', '₹6500', '₹7200', '₹7055'],
    3, { explanation: 'Number of shares = 8500/100=85 (face value, bought at par); amount received = 85×83=₹7055.' }),
  mcq(34, '3.6', 'Rohit invested ₹7500 in a company paying 10 percent dividend, an income of ₹500 is received. What price did he pay for each ₹100 share?', ['₹50', '₹100', '₹125', '₹150'],
    3, { explanation: 'Total face value = income/rate = 500/0.10=5000 -> number of shares = 5000/100=50; price per share = 7500/50=₹150.' }),
  mcq(35, '3.6', 'Shares of company A, paying 12 %, ₹100 shares are at ₹80. Shares of company B, paying 12 %, ₹100 shares at ₹100. Shares of company C, paying 12 %, ₹100 shares are ₹120. Shares of which company are at premium?', ['Company A', 'Company B', 'Company C', 'Company A and C'],
    2, { explanation: 'Only C has MV(120) > FV(100); A is at discount (MV<FV), B is at par (MV=FV).' }),
  mcq(36, '3.6', 'Shares of company A paying 12 % ₹100 shares at ₹72. Shares of company B paying 13 % ₹100 shares at ₹80. Shares of company C paying 15 % ₹100 shares at ₹90. Which company gives the best return?', ['Company A', 'Company B', 'Company C', 'Company A and Company C'],
    3, { explanation: 'Rate of return: A=12×100/72=16.67%; B=13×100/80=16.25%; C=15×100/90=16.67%. A and C are exactly tied at the highest return (16.67%), both above B.' }),
  {
    kind: 'case', sourceQuestionNumber: '37', sourcePage: '3.6',
    text: 'Salman buys 50 shares of face value ₹100 available at ₹132.',
    parts: [
      { text: '(i) What is his investment?', options: ['₹6200', '₹6600', '₹6000', '₹6500'], correct: 1, marks: 1 },
      { text: '(ii) If the dividend is 7.5 %, what will be his annual income?', options: ['₹300', '₹360', '₹370', '₹375'], correct: 3, marks: 1 },
      { text: '(iii) If he wants to increase his annual income by ₹150, how many extra shares should he buy?', options: ['90 shares', '40 shares', '20 shares', '70 shares'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Shares: investment, dividend income, buying extra shares for a target income increase', questionType: 'case_study',
    explanation: '(i) Investment = 50×132=₹6600. (ii) Dividend/share=100×0.075=7.5; income=50×7.5=₹375. (iii) Extra shares = 150/7.5 = 20. All independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.2, item 37',
  },
  {
    kind: 'case', sourceQuestionNumber: '38', sourcePage: '3.7',
    text: 'Rohit invested ₹9600 on ₹100 shares at ₹20 premium paying 8 % dividend. He sold the shares when the price rose to ₹160. He invested the proceeds (excluding dividend) in 10 % ₹50 shares at ₹40 then:',
    parts: [
      { text: '(i) The number of shares bought is:', options: ['80', '90', '100', '110'], correct: 0, marks: 1 },
      { text: '(ii) The sale proceeds is:', options: ['₹13900', '₹14800', '₹15900', '₹12800'], correct: 3, marks: 1 },
      { text: '(iii) New number of shares is:', options: ['420', '320', '520', '620'], correct: 1, marks: 1 },
      { text: '(iv) Change in the two dividends is:', options: ['₹960', '₹840', '₹960', '₹700'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'Shares: buy-sell-reinvest chain across two different share classes', questionType: 'case_study',
    explanation: '(i) MV=100+20=120; shares=9600/120=80. (ii) Sale proceeds = 80×160=₹12800. (iii) New shares = 12800/40=320. (iv) Old dividend = 80×100×0.08=₹640; new dividend = 320×50×0.10=₹1600; change = 1600-640=₹960. All independently verified, matching printed key. (Note: options (iv) A and C are both printed as ₹960 in the source itself — reproduced as printed; the computed value is unambiguous.)',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.2, item 38',
  },
];

// AR items 39-45: source's "simple" 4-option scheme.
const AR_SIMPLE = [
  'A is true, R is false',
  'A is false, R is true',
  'Both A and R are true',
  'Both A and R are false.',
];
const arSimple = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '3.7', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_SIMPLE, correctIdx, { questionType: 'assertion_reasoning', ...opts });

// AR items 46-48: source's "full" 4-option scheme.
const AR_FULL = [
  'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
  'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).',
  'Assertion (A) is true and Reason (R) is false.',
  'Assertion (A) is false and Reason (R) is true.',
];
const arFull = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '3.8-3.9', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_FULL, correctIdx, { questionType: 'assertion_reasoning', ...opts });

items.push(
  arSimple(39,
    'Market value of a share always remains the same.',
    'The value of a share printed on the share certificate is called its market value.',
    3, { explanation: 'A is false: market value fluctuates with the stock market, it does not stay fixed. R is also false: the value printed on the certificate is the FACE (nominal) value, not the market value — both false, matches printed key.' }),
  arSimple(40,
    'Income of a shareholder is directly proportional to the number of shares he buys.',
    'Income of the shareholder = Face Value × (Number of shares × Rate of dividend)/100',
    2, { explanation: 'A is true: for fixed face value and dividend rate, income scales linearly with the number of shares. R is the correct formula and shows exactly why — both true, matches printed key (both true).' }),
  arSimple(41,
    'Mr. Gupta buys a certain number of shares of a company at a premium. The company declares a d % dividend, then yield is d %.',
    'Dividend % is calculated on the Face Value, whereas yield % is calculated on the total investment.',
    1, { explanation: 'A is false: bought at a premium (MV>FV), so yield% = d%×FV/MV is LESS than d%, not equal to it. R correctly states the reason yield differs from the dividend rate whenever MV≠FV — A false, R true, matches printed key.' }),
  arSimple(42,
    'Company always gives a dividend on the face value of the share irrespective of the market value of the share.',
    'Face value is known as nominal value.',
    2, { explanation: 'A is true (standard fact: dividend is always a percentage of face value). R is also true (correct synonym) though it is a separate fact rather than an explanation of A — both true, matches printed key (this simple scheme has no "explains" option).' }),
  arSimple(43,
    'Investing in 12 % of the ₹100 shares at ₹150 means an investment of ₹100 (of face value) gives an annual income of ₹12.',
    'Annual income of an investor depends upon the face value of the share.',
    2, { explanation: 'A is true: dividend income is tied to face value (₹100) at the 12% rate, i.e. ₹12 per ₹100 of face value, regardless of the ₹150 market price actually paid. R correctly states the underlying reason — both true, matches printed key.' }),
  arSimple(44,
    'Total investment to purchase 400 shares, ₹12 shares at a premium of ₹1 is ₹5200',
    'Sum Invested = Number of shares bought × NV of 1 share',
    0, { explanation: 'A is true: FV=₹12, premium ₹1 gives MV=₹13, and 400×13=₹5200 exactly. R is false: sum invested equals number of shares × MARKET value, not nominal (face) value — using NV would only be correct at par — A true, R false, matches printed key.' }),
  arSimple(45,
    'Rahul invests ₹4600 in ₹100 shares, paying 10 % dividend and quoted at 15 % premium. His annual dividend from these shares is ₹400.',
    'Number of shares held by a person = Total market value / NV of 1 share',
    0, { explanation: 'A is true: MV=100×1.15=115; shares=4600/115=40; dividend=40×10=₹400. R is false: the correct formula divides total market value by the MARKET value of 1 share (or equivalently uses total investment/MV), not by NV — A true, R false, matches printed key.' }),
);
items.push(
  arFull(46,
    'If a share of ₹25 of a company is sold at ₹29.50, then the cost of 50 such shares is ₹1475.',
    'Amount Invested = Number of shares × Face value',
    2, { explanation: 'A is true: 50×29.50=₹1475 (using the market/selling price ₹29.50). R is false as a general formula: amount invested/cost equals shares × MARKET value, not face value (A itself uses the market price, not the ₹25 face value) — A true, R false, matches printed key.' }),
  arFull(47,
    'The annual income of thirty-five, ₹100 shares paying 4.5 % is ₹157.50.',
    'Total annual income = Annual income per share × Number of shares',
    0, { explanation: 'A is true: 35×100×0.045=₹157.50. R is the correct general formula and directly explains A (157.50/35=₹4.50 per share × 35 shares) — both true, R correctly explains A, matches printed key.' }),
  arFull(48,
    'The nominal value of 550 shares of ₹10 quoted at ₹25 is ₹5000.',
    '₹8443.75 is required to purchase 175, ₹50 shares at ₹1.75 discount.',
    3, { explanation: 'A is false: nominal (face) value total = 550×10=₹5500, not ₹5000 (the quoted market price ₹25 is irrelevant to nominal value). R is true and independently verified: MV=50-1.75=48.25; 175×48.25=₹8443.75 exactly — A false, R true, matches printed key.' }),
);

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'Shares and Dividend',
  chapterOrder: 3,
  label: 'ICSE Class 10 Mathematics — Shares and Dividend: 48 items (38 MCQ/case-study MCQ, 10 Assertion-Reason), full chapter, from chap_3.pdf, every answer independently re-verified by computation against the printed key (zero discrepancies)',
  status: 'verified',
  answerStatus: 'verified',
  sourceSection: 'Multiple Choice Questions + Assertion and Reasoning (full chapter, pp.3.2-3.9)',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
