// CBSE Mathematics content-promotion campaign, Batch 7 (Real Numbers,
// ids 4468-4498). Every candidate below was independently re-derived from
// first principles (prime factorisation, HCF/LCM identities, rational/
// irrational number theorems) per
// docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before being
// included here. Scope: `status` transcribed->verified only, via the
// shared guarded helper in scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-07-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4468, uid: 'cbse-mathematics-real-numbers-a5cae7d8', correct: 1, optionsJson: '["pq","pq²","p³q³","p²q³"]' },
  { id: 4469, uid: 'cbse-mathematics-real-numbers-b935a4ca', correct: 2, optionsJson: '["57","1","19","38"]' },
  { id: 4470, uid: 'cbse-mathematics-real-numbers-86840735', correct: 2, optionsJson: '["26","52","338","13"]' },
  { id: 4471, uid: 'cbse-mathematics-real-numbers-8ec6f284', correct: 1, optionsJson: '["terminating","non-terminating non-repeating","non-terminating","doesnot exist"]' },
  { id: 4472, uid: 'cbse-mathematics-real-numbers-185428b5', correct: 2, optionsJson: '["√18","2√2","√2","2"]' },
  { id: 4473, uid: 'cbse-mathematics-real-numbers-dffaebd6', correct: 3, optionsJson: '["a natural number","an integer","a rational number","an irrational number"]' },
  { id: 4474, uid: 'cbse-mathematics-real-numbers-17dcbf35', correct: 2, optionsJson: '["2³","3³","2³ × 3³","2² × 3²"]' },
  { id: 4477, uid: 'cbse-mathematics-real-numbers-d0d5db94', correct: 2, optionsJson: '["1","0","2","3"]' },
  { id: 4478, uid: 'cbse-mathematics-real-numbers-afe289bd', correct: 2, optionsJson: '["3, 140","12, 420","3, 420","420, 3"]' },
  { id: 4479, uid: 'cbse-mathematics-real-numbers-e5ce35a4', correct: 1, optionsJson: '["always rational","always irrational","rational or irrational","none of these"]' },
  { id: 4480, uid: 'cbse-mathematics-real-numbers-0d28b7f0', correct: 1, optionsJson: '["xy","xy²","x³y³","x²y²"]' },
  { id: 4482, uid: 'cbse-mathematics-real-numbers-b84157a4', correct: 0, optionsJson: '["13","65","875","1750"]' },
  { id: 4484, uid: 'cbse-mathematics-real-numbers-ca1f796a', correct: 1, optionsJson: '["prime number","composite number","an odd prime number","an odd composite number"]' },
  { id: 4485, uid: 'cbse-mathematics-real-numbers-55ab5194', correct: 1, optionsJson: '["an integer","a rational number","a natural number","an irrational number"]' },
  { id: 4486, uid: 'cbse-mathematics-real-numbers-db39aac7', correct: 3, optionsJson: '["prime","co-prime","composite","equal"]' },
  { id: 4487, uid: 'cbse-mathematics-real-numbers-a9ad07dd', correct: 1, optionsJson: '["203400","194400","198400","205400"]' },
  { id: 4488, uid: 'cbse-mathematics-real-numbers-8bfb9eab', correct: 1, optionsJson: '["1:2","2:1","1:1","1:3"]' },
  { id: 4489, uid: 'cbse-mathematics-real-numbers-31e6f5be', correct: 2, optionsJson: '["2, 3","2, 3, 5","2, 5","3, 5"]' },
  { id: 4491, uid: 'cbse-mathematics-real-numbers-e5453f3f', correct: 2, optionsJson: '["2","3","4","5"]' },
  { id: 4493, uid: 'cbse-mathematics-real-numbers-af71b030', correct: 2, optionsJson: '["4","28","38","48"]' },
  { id: 4494, uid: 'cbse-mathematics-real-numbers-8eca60ca', correct: 0, optionsJson: '["5","6","4","3"]' },
  { id: 4495, uid: 'cbse-mathematics-real-numbers-450181ec', correct: 1, optionsJson: '["2","3","5","7"]' },
  { id: 4496, uid: 'cbse-mathematics-real-numbers-f4820ddd', correct: 2, optionsJson: '["2","3","4","1"]' },
  { id: 4497, uid: 'cbse-mathematics-real-numbers-8de7971d', correct: 0, optionsJson: '["coprime","not coprime","even","odd"]' },
  { id: 4498, uid: 'cbse-mathematics-real-numbers-bd9abc51', correct: 0, optionsJson: '["2","3","5","10"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 7, Real Numbers).\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
