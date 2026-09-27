// CBSE Mathematics content-promotion campaign, Batch 11 (Polynomials
// tail + start of Pair of Linear Equations in Two Variables, ids
// 4588-4614). Every candidate below was independently re-derived from
// first principles per
// docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before
// being included here.
//
// id 4589 is DELIBERATELY EXCLUDED (C, likely answer-key defect):
// Statement-1 claims "if alpha, beta are zeroes of x^2+7x+12, then
// 12/alpha + 12/beta - 24*alpha*beta = 395". Independently substituting
// the actual roots (-3, -4): 12/alpha+12/beta = -7 (matches Vieta's:
// 12*(alpha+beta)/(alpha*beta) = 12*(-7)/12 = -7); 24*alpha*beta =
// 24*12 = 288; total = -7 - 288 = -295, not 395. The credited answer
// (b) requires Statement-1 to be TRUE, but the literal arithmetic gives
// -295 != 395 under every reasonable reading of the expression tried
// (24*(alpha*beta), 24/(alpha*beta), a sign-flipped constant term).
// Held pending confirmation against the source photograph/PDF -- this
// may be a printed-value transcription error (the 3-9-5 vs 2-9-5
// digits don't look like a simple OCR slip either, so the true intended
// expression/value is genuinely unclear without the source).
//
// id 4595 and id 4600 are a confirmed content duplicate (identical
// system of equations 2x+3y=5, 4x+ky=10, same "k for infinitely many
// solutions" question, reworded stem, different option ordering, both
// independently confirmed k=6). NOT caught by the automated
// duplicate_flags detector at all -- another false negative in the same
// vein as ids 4491/4496 (Batch 7) and 4595/4600 style near-verbatim
// numeric reuse. No grading-fairness issue (same credited value); both
// promoted per the standing "promote both, disclose" precedent.
//
// Scope: `status` transcribed->verified only, via the shared guarded
// helper in scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-11-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4588, uid: 'cbse-mathematics-polynomials-ec2b3790', correct: 1, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4590, uid: 'cbse-mathematics-polynomials-469a3495', correct: 1, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4591, uid: 'cbse-mathematics-polynomials-a456df66', correct: 3, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4592, uid: 'cbse-mathematics-polynomials-2d903505', correct: 3, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4593, uid: 'cbse-mathematics-polynomials-d4ec4484', correct: 1, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4594, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-999acd06', correct: 1, optionsJson: '["= 3","≠ 3","≠ 0","= 0"]' },
  { id: 4595, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-3cd8d85c', correct: 2, optionsJson: '["1","3","6","0"]' },
  { id: 4597, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-30ee0ae0', correct: 2, optionsJson: '["0","2","6","8"]' },
  { id: 4598, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-027e5991', correct: 0, optionsJson: '["6","-6","3/2","none of these"]' },
  { id: 4599, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-6fd153e1', correct: 3, optionsJson: '["intersecting","parallel","always coincident","intersecting or coincident"]' },
  { id: 4600, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-4c2bd5db', correct: 3, optionsJson: '["1","1/2","3","6"]' },
  { id: 4601, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-6bf4f955', correct: 3, optionsJson: '["-10","-5","-6","-15"]' },
  { id: 4602, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-ce8070ae', correct: 0, optionsJson: '["3 and 1","3 and 5","5 and 3","-1 and -3"]' },
  { id: 4603, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-208148d6', correct: 2, optionsJson: '["1/2","-1/2","2","-2"]' },
  { id: 4604, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-8280ab91', correct: 3, optionsJson: '["one solution","two solutions","infinitely many solutions","no solution"]' },
  { id: 4605, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-dd28b08e', correct: 0, optionsJson: '["₹750","₹600","₹850","₹900"]' },
  { id: 4607, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-34c3c01d', correct: 1, optionsJson: '["= 5","= 10","≠ 10","≠ 5"]' },
  { id: 4608, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-a5df8b12', correct: 1, optionsJson: '["40 years","45 years","55 years","65 years"]' },
  { id: 4609, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-481c4ddc', correct: 1, optionsJson: '["a = 1, b = 5","a = 5, b = 1","a = -1, b = 5","a = 5, b = -1"]' },
  { id: 4610, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-a989f1ed', correct: 3, optionsJson: '["1","0","-1","2"]' },
  { id: 4611, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-39da2d72', correct: 0, optionsJson: '["has a unique solution","has infinitely many solutions","has no solution","may or may not have a solution."]' },
  { id: 4612, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-0cd3406c', correct: 1, optionsJson: '["a = 2b","b = 2a","a + 2b = 0","2a + b = 0"]' },
  { id: 4613, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-00d457f8', correct: 2, optionsJson: '["a + 5b = 0","5a + b = 0","a − 5b = 0","5a − b = 0"]' },
  { id: 4614, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-87beaac3', correct: 2, optionsJson: '["ab","2ab","(1/2)ab","(1/4)ab"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 11, Polynomials tail + Pair of Linear Equations start). id 4589 excluded (C).\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
