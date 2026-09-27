// CBSE Class 10 Mathematics — Statistics (Chapter 14) GAP-FILL.
// Source: ch14-15.pdf (source_files.id 124), pp.14.15-14.22 (the Statistics
// chapter occupies the first part of this PDF; the second part, pp.15.x,
// covers Probability, already fully sourced/ingested from an earlier
// batch — see PROJECT_PROGRESS.md).
//
// PRE-EXISTING CONTENT: chapter_id 34 already held 53 items (source_
// question_number 1,2,4-54, pages 14.15-14.21), ingested from an earlier
// photographed-page batch (source_documents id 102) whose own label
// explicitly recorded: "Item 3 and items 55-58 (Assertion-Reason)
// deliberately excluded this pass". Founder's target for this chapter is
// 58 (14th value in "69,62,42,57,68,83,47,70,37,46,31,68,55,58,61").
// 53+5=58, confirming this is a genuine, previously-disclosed gap, not a
// new discovery.
//
// This script fills EXACTLY that known gap: item 3 (a plain MCQ) and
// items 55-58 (the chapter's four assertion-reason items), transcribed
// from ch14-15.pdf pp.14.16 and 14.22.
//
// NUMBERING NOTE (disclosed, not a math defect): the exercise section of
// ch14-15.pdf prints the "100 m race" case study (already in the DB as
// item 54, matching the answer key's item 54 exactly — a 4-part case
// study (i)-(iv)) under the visible numeral "55." — an apparent printer
// duplication, since the very next section (Assertion-Reason) also opens
// with "55. Statement-1...". The answer key on p.14.22 is internally
// consistent and unambiguous: item 54 = the 4-part case study (already
// correctly ingested under source_question_number "54"), and items 55-58
// = the four assertion-reason items captured here. This script follows
// the answer key's numbering, not the exercise section's duplicated "55".
//
// VERIFICATION METHOD: every item independently re-derived/re-checked
// (arithmetic mean formula, AP mean formula, sum-of-deviations identity,
// graphical-determination facts, grouped-mean step-deviation formula)
// rather than copied blindly from the printed key. Zero defects found —
// all 5 items matched the printed key exactly on independent derivation.
const { ingestQuestions } = require('./ingest');

const SF = 124; // source_files.id for ch14-15.pdf
const P1416 = '14.16', P1422 = '14.22';

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.14.22, item ${n} (independently re-verified by computation)`,
  ...opts,
});

const items = [];

items.push(mcq(3, P1416, 'The arithmetic mean of 1, 2, 3, ..., n is', ['(n+1)/2', '(n-1)/2', 'n/2', 'n/2+1'], 0, { explanation: 'Mean = (sum)/n = [n(n+1)/2]/n = (n+1)/2.' }));

const AR_INSTRUCTIONS = 'Each of the following questions contains statement-1 (Assertion) and STATEMENT-2 (Reason) and has following four choices (a), (b), (c) and (d), only one of which is the correct answer. Mark the correct choice: (a) Statement-1 is true, Statement-2 is true; Statement-2 is a correct explanation for Statement-1. (b) Statement-1 is true, Statement-2 is true; Statement-2 is not a correct explanation for Statement-1. (c) Statement-1 is true, Statement-2 is false. (d) Statement-1 is false, Statement-2 is true.';

items.push(mcq(55, P1422, `${AR_INSTRUCTIONS} Statement-1 (A): For a moderately asymmetric distribution, Mode - Median = 2(Median - Mean). Statement-2 (R): For a symmetric distribution, Mean = Median = Mode.`, ['(a)', '(b)', '(c)', '(d)'], 1, { explanation: 'Statement-1 is the standard empirical relationship between mean, median and mode for a moderately asymmetric distribution — true. Statement-2 is also true (the defining property of a symmetric distribution), but it describes an unrelated, different case (symmetric, not moderately asymmetric) and does not explain or derive Statement-1\'s relationship — both true, not a correct explanation.' }));
items.push(mcq(56, P1422, `${AR_INSTRUCTIONS} Statement-1 (A): The algebraic sum of the deviations of a frequency distribution from its mean is zero. Statement-2 (R): Mode of a frequency distribution cannot be determined graphically.`, ['(a)', '(b)', '(c)', '(d)'], 2, { explanation: 'Statement-1 is a fundamental true property of the mean: Σfi(xi-x̄)=Σfixi-x̄Σfi=Nx̄-x̄N=0. Statement-2 is false — mode CAN be determined graphically, from a histogram (the tallest bar\'s class, refined by joining specific diagonal lines), as also tested elsewhere in this same chapter (item 7). So Statement-1 true, Statement-2 false.' }));
items.push(mcq(57, P1422, `${AR_INSTRUCTIONS} Statement-1 (A): The mean of 1, 4, 7, 10, ..., 301 is 151. Statement-2 (R): The mean of the series a, a+d, a+2d, ..., a+2nd, is a+nd.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: 'The AP 1,4,7,...,301 has a=1,d=3; number of terms: 301=1+(k-1)(3) ⇒ k=101=2n+1 with n=50. Mean of an AP=(first+last)/2=(1+301)/2=151 — Statement-1 true. Statement-2\'s general formula (mean of a 2n+1-term AP centred at a+nd) gives, for a=1,d=3,n=50: a+nd=1+150=151, exactly matching and correctly deriving Statement-1.' }));
items.push(mcq(58, P1422, `${AR_INSTRUCTIONS} Statement-1 (A): If a=55.5, N=100, h=20, Σfiui=60, then X̄=67.5. Statement-2 (R): Mean of a grouped data is given by X̄=a+h((1/N)Σfiui).`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: 'Using Statement-2\'s formula: X̄=55.5+20×(60/100)=55.5+20×0.6=55.5+12=67.5, exactly matching Statement-1 — Statement-2 correctly explains/derives Statement-1.' }));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Statistics',
  chapterOrder: 14,
  sourceFileIds: [SF],
  label: 'CBSE Maths Statistics Ch.14 GAP-FILL (ch14-15.pdf, pp.14.16 & 14.22, items 3, 55-58)',
});
console.log(JSON.stringify(result, null, 2));
