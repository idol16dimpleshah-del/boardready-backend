// CBSE Mathematics content-promotion campaign, Batch 9 (Real Numbers tail
// + start of Polynomials, ids 4527-4553). Every candidate below was
// independently re-derived from first principles (Vieta's-formula
// sum/product-of-zeros identities, substitution, reciprocal-root and
// symmetric-function algebra) per
// docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before
// being included here. All 25 candidates in this range verified correct
// -- 0 new defects found this batch.
//
// id 4536 and id 4543 are a confirmed content duplicate (same cubic
// x^3+4x^2+x-6, same "product of the zeros" question, same options, same
// correct answer -- duplicate_flags row 379, similarity 0.89). No
// grading-fairness issue (both credit the same value), so both are
// promoted per the standing "promote both, disclose" precedent -- this
// is NOT the special 4442/4927 case, which was the one pair the user
// asked to "hold one back" for.
//
// duplicate_flags rows 380/381 (4538 vs 4551/4553) and 382/384 (not-yet-
// reached ids 4567/4577 vs 4551/4539) were individually checked and are
// false positives -- shared "zeros of the polynomial ... 1/alpha+1/beta"
// vocabulary but different polynomials/exponents/numeric answers.
//
// Scope: `status` transcribed->verified only, via the shared guarded
// helper in scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-09-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4527, uid: 'cbse-mathematics-real-numbers-5eb04715', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4528, uid: 'cbse-mathematics-real-numbers-f4350a8b', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4530, uid: 'cbse-mathematics-real-numbers-f6176620', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4532, uid: 'cbse-mathematics-polynomials-0f89abc4', correct: 0, optionsJson: '["has no linear term and constant term is negative","has no linear term and the constant term is positive","can have a linear term but constant term is negative","can have a linear term but constant term is positive"]' },
  { id: 4533, uid: 'cbse-mathematics-polynomials-b83cded3', correct: 1, optionsJson: '["10","-10","5","-5"]' },
  { id: 4534, uid: 'cbse-mathematics-polynomials-b181a63a', correct: 0, optionsJson: '["x² - 9","x² + 9","x² + 3","x² - 3"]' },
  { id: 4535, uid: 'cbse-mathematics-polynomials-6d651ad7', correct: 0, optionsJson: '["x² + 5x + 6","x² - 5x + 6","x² - 5x - 6","-x² + 5x + 6"]' },
  { id: 4536, uid: 'cbse-mathematics-polynomials-bd2f3c42', correct: 2, optionsJson: '["-4","4","6","-6"]' },
  { id: 4537, uid: 'cbse-mathematics-polynomials-b5d4ec5d', correct: 0, optionsJson: '["2","-2","1","-1"]' },
  { id: 4538, uid: 'cbse-mathematics-polynomials-e662dabc', correct: 0, optionsJson: '["1","-1","0","none of these"]' },
  { id: 4539, uid: 'cbse-mathematics-polynomials-cab0b5af', correct: 2, optionsJson: '["-3/7","3/5","3/7","-5/7"]' },
  { id: 4540, uid: 'cbse-mathematics-polynomials-0a1d886d', correct: 1, optionsJson: '["3/2","-3/2","9/2","-9/2"]' },
  { id: 4541, uid: 'cbse-mathematics-polynomials-e15a4700', correct: 1, optionsJson: '["0","5","1/6","6"]' },
  { id: 4542, uid: 'cbse-mathematics-polynomials-6d2c439d', correct: 1, optionsJson: '["1","-1","2","-2"]' },
  { id: 4543, uid: 'cbse-mathematics-polynomials-4c4038fa', correct: 2, optionsJson: '["-4","4","6","-6"]' },
  { id: 4544, uid: 'cbse-mathematics-polynomials-a21d5cb8', correct: 0, optionsJson: '["-1","1","-9","9"]' },
  { id: 4545, uid: 'cbse-mathematics-polynomials-f2bf7876', correct: 1, optionsJson: '["3","-3","5","-15"]' },
  { id: 4546, uid: 'cbse-mathematics-polynomials-a82917f8', correct: 1, optionsJson: '["2","4","-2","-4"]' },
  { id: 4547, uid: 'cbse-mathematics-polynomials-0d2c1e11', correct: 0, optionsJson: '["3/2","-3/2","2/3","-2/3"]' },
  { id: 4548, uid: 'cbse-mathematics-polynomials-2e6a815e', correct: 3, optionsJson: '["1","2","3","more than 3"]' },
  { id: 4549, uid: 'cbse-mathematics-polynomials-add5a8b3', correct: 0, optionsJson: '["4/3","-4/3","2/3","-2/3"]' },
  { id: 4550, uid: 'cbse-mathematics-polynomials-ad0226f8', correct: 1, optionsJson: '["both positive","both negative","both equal","one positive and one negative"]' },
  { id: 4551, uid: 'cbse-mathematics-polynomials-d3164b5d', correct: 1, optionsJson: '["(b² - 2ac)/a²","(b² - 2ac)/c²","(b² + 2ac)/a²","(b² + 2ac)/c²"]' },
  { id: 4552, uid: 'cbse-mathematics-polynomials-6c2e80c9', correct: 2, optionsJson: '["x² + qx + p","x² - px + q","qx² + px + 1","px² + qx + 1"]' },
  { id: 4553, uid: 'cbse-mathematics-polynomials-f670b75a', correct: 1, optionsJson: '["c - 1","1 - c","c","1 + c"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 9, Real Numbers tail + Polynomials start). No exclusions this batch.\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
