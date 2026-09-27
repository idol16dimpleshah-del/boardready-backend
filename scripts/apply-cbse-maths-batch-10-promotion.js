// CBSE Mathematics content-promotion campaign, Batch 10 (Polynomials
// continuation, ids 4554-4587). Every candidate below was independently
// re-derived from first principles (Vieta's-formula sum/product-of-zeros
// identities, remainder/factor theorem, discriminant reasoning,
// arithmetic-progression-of-zeros constraints) per
// docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before
// being included here. All 25 candidates in this range verified correct
// -- 0 new defects found this batch (the second consecutive clean batch).
//
// duplicate_flags rows 382/384 (ids 4567/4577 vs 4551/4539, already
// disclosed as pending in the Batch 9 write-up) are now resolved: both
// independently re-derived here with distinct correct numeric answers
// from their flagged counterparts, confirming they are false positives.
// Row 383 (4574 vs 4570) is also a false positive -- a quadratic
// sum-of-zeros question vs an unrelated cubic AP-zeros question sharing
// only "zeroes ... value of" vocabulary.
//
// Row 385 flags id 4591 (NOT in this batch, x²+3x+3, discriminant<0)
// against id 4586 (IN this batch, x²-2x+2, discriminant<0) at similarity
// 0.85 -- both are the identical assertion-reason template ("has two
// real zeroes" / "can have at most two real zeroes") applied to a
// different specific polynomial, both with the same underlying fact
// (negative discriminant, no real zeros, credited answer (d)). This is a
// genuine content duplicate, no grading-fairness issue (same credited
// value). id 4591 will be verified and promoted on its own merits when
// the campaign reaches it (next batch); disclosed here now since it was
// found while checking 4586.
//
// Scope: `status` transcribed->verified only, via the shared guarded
// helper in scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-10-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4554, uid: 'cbse-mathematics-polynomials-ae240cea', correct: 2, optionsJson: '["-8","16","-16","8"]' },
  { id: 4555, uid: 'cbse-mathematics-polynomials-2ff08be5', correct: 1, optionsJson: '["1","2","4","5"]' },
  { id: 4556, uid: 'cbse-mathematics-polynomials-376d49b8', correct: 2, optionsJson: '["30","14","15","16"]' },
  { id: 4557, uid: 'cbse-mathematics-polynomials-e44ca55e', correct: 1, optionsJson: '["a = 1, b = 3","a = 3, b = 1","a = -1, b = 5","a = 5, b = -1"]' },
  { id: 4558, uid: 'cbse-mathematics-polynomials-9d00ff9a', correct: 2, optionsJson: '["x³ - 3x² + 3x - 5","-x³ - 3x² - 3x - 5","-x³ + 3x² - 3x + 5","x³ - 3x² - 3x + 5"]' },
  { id: 4559, uid: 'cbse-mathematics-polynomials-feca6a67', correct: 3, optionsJson: '["a = -7, b = -1","a = 5, b = -1","a = 2, b = -6","a = 0, b = -6"]' },
  { id: 4560, uid: 'cbse-mathematics-polynomials-45c6ee21', correct: 2, optionsJson: '["-d/a","c/a","-b/a","b/a"]' },
  { id: 4561, uid: 'cbse-mathematics-polynomials-5ca75ea6', correct: 3, optionsJson: '["a = 5, c = 1/2","a = 1, c = 5/2","a = 5/2, c = 1","a = 1/2, c = 5"]' },
  { id: 4562, uid: 'cbse-mathematics-polynomials-5ff91ae6', correct: 0, optionsJson: '["-2","2","18","-18"]' },
  { id: 4563, uid: 'cbse-mathematics-polynomials-26d3063c', correct: 1, optionsJson: '["7","-7","-14","14"]' },
  { id: 4564, uid: 'cbse-mathematics-polynomials-f2b357cf', correct: 0, optionsJson: '["2p³ = pq - r","2p³ = pq + r","p³ = pq - r","none of these"]' },
  { id: 4565, uid: 'cbse-mathematics-polynomials-d0b4be58', correct: 3, optionsJson: '["6","2","14","7"]' },
  { id: 4566, uid: 'cbse-mathematics-polynomials-76569bf9', correct: 3, optionsJson: '["44","48","-44","-48"]' },
  { id: 4567, uid: 'cbse-mathematics-polynomials-9b0072bd', correct: 2, optionsJson: '["-b/d","c/d","-c/d","-c/a"]' },
  { id: 4568, uid: 'cbse-mathematics-polynomials-60750e8c', correct: 1, optionsJson: '["q = 2r","r = 2q","q = r","r = 4q"]' },
  { id: 4570, uid: 'cbse-mathematics-polynomials-389601b2', correct: 3, optionsJson: '["√2 - 1","√2","-√2 - 1","1 ± √2"]' },
  { id: 4571, uid: 'cbse-mathematics-polynomials-6cd0dcbc', correct: 0, optionsJson: '["cannot both be positive","cannot both be negative","are always unequal","are always equal"]' },
  { id: 4572, uid: 'cbse-mathematics-polynomials-55c403d0', correct: 2, optionsJson: '["c and a have opposite signs","c and b have opposite signs","c and a have the same sign","c and b have the same sign"]' },
  { id: 4573, uid: 'cbse-mathematics-polynomials-eebeda84', correct: 1, optionsJson: '["p = r = 2","p = r = -2","p = 2, r = -2","p = -2, r = 2"]' },
  { id: 4574, uid: 'cbse-mathematics-polynomials-82343e57', correct: 3, optionsJson: '["2","1","-1","0"]' },
  { id: 4576, uid: 'cbse-mathematics-polynomials-07bb60be', correct: 3, optionsJson: '["4x² - 9","(4/9)(9x² + 4)","x² + 9/4","5(9x² - 4)"]' },
  { id: 4577, uid: 'cbse-mathematics-polynomials-11c56e9b', correct: 3, optionsJson: '["7/3","-7/3","3/7","-3/7"]' },
  { id: 4578, uid: 'cbse-mathematics-polynomials-ff085c0e', correct: 1, optionsJson: '["0","4","2","-4"]' },
  { id: 4586, uid: 'cbse-mathematics-polynomials-e62a2cc2', correct: 3, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4587, uid: 'cbse-mathematics-polynomials-2c005cba', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 10, Polynomials continuation). No exclusions this batch.\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
