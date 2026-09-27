// CBSE Mathematics content-promotion campaign, Batch 4 (Application of
// Trigonometry / Heights and Distances, ids 4380-4405). Every candidate
// below was independently re-derived from first principles per
// docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before being
// included here. id 4404 is EXCLUDED and classified C: its options include
// both "a/√2" (index 1) and "2 × a/(2√2)" (index 3, the credited answer) --
// the same value written two different ways (2×a/(2√2) simplifies to
// a/√2), the same "duplicate value under different notation" defect found
// at id 4352 in Batch 2. A student computing a/√2 directly and picking the
// option that reads exactly "a/√2" would be marked wrong. Needs a content
// editor to replace/remove the duplicate-value option. Scope for the A's:
// `status` transcribed->verified only, via the shared guarded helper in
// scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-04-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4380, uid: 'cbse-mathematics-heights-and-distances-5a905674', correct: 1, optionsJson: '["45°","30°","60°","90°"]' },
  { id: 4381, uid: 'cbse-mathematics-heights-and-distances-fe33f75d', correct: 2, optionsJson: '["25√3 m","50√3 m","75√3 m","150 m"]' },
  { id: 4382, uid: 'cbse-mathematics-heights-and-distances-f7147bec', correct: 1, optionsJson: '["15√3/2 m","15/2 m","15 m","15√2 m"]' },
  { id: 4383, uid: 'cbse-mathematics-heights-and-distances-4bc87aa2', correct: 1, optionsJson: '["50√3","150√3","150√2","75"]' },
  { id: 4384, uid: 'cbse-mathematics-heights-and-distances-db77d3da', correct: 0, optionsJson: '["60°","45°","30°","90°"]' },
  { id: 4385, uid: 'cbse-mathematics-heights-and-distances-9eba3e31', correct: 0, optionsJson: '["50 m","50√3 m","50/√3 m","25 m"]' },
  { id: 4386, uid: 'cbse-mathematics-heights-and-distances-a8f9735a', correct: 3, optionsJson: '["1 m","2 m","2√3 m","4 m"]' },
  { id: 4387, uid: 'cbse-mathematics-heights-and-distances-9f686d9a', correct: 2, optionsJson: '["30°","45°","60°","90°"]' },
  { id: 4388, uid: 'cbse-mathematics-heights-and-distances-8c97dd91', correct: 0, optionsJson: '["100√3 m","100/√3 m","100 m","50√3 m"]' },
  { id: 4389, uid: 'cbse-mathematics-heights-and-distances-07f53e64', correct: 0, optionsJson: '["30√3 m","30/√3 m","30 m","15√3 m"]' },
  { id: 4390, uid: 'cbse-mathematics-heights-and-distances-6ccb2392', correct: 1, optionsJson: '["a + b","√(ab)","ab","√(a/b)"]' },
  { id: 4391, uid: 'cbse-mathematics-heights-and-distances-7145ccbf', correct: 1, optionsJson: '["a - b","√(ab)","a + b","ab"]' },
  { id: 4392, uid: 'cbse-mathematics-heights-and-distances-a5b29f35', correct: 0, optionsJson: '["(√3 + 1)h","(√3 - 1)h","√3 h","h/√3"]' },
  { id: 4393, uid: 'cbse-mathematics-heights-and-distances-44f0b5af', correct: 1, optionsJson: '["d / (cot alpha + cot beta)","d / (cot alpha - cot beta)","d (cot alpha - cot beta)","d (cot alpha + cot beta)"]' },
  { id: 4394, uid: 'cbse-mathematics-heights-and-distances-11accf45', correct: 1, optionsJson: '["6 m","12 m","10 m","8 m"]' },
  { id: 4395, uid: 'cbse-mathematics-heights-and-distances-841e595d', correct: 1, optionsJson: '["25 m","50 m","75 m","100 m"]' },
  { id: 4396, uid: 'cbse-mathematics-heights-and-distances-63506b09', correct: 1, optionsJson: '["50(√3 - 1) m","50(√3 + 1) m","100(√3 + 1) m","100(√3 - 1) m"]' },
  { id: 4397, uid: 'cbse-mathematics-heights-and-distances-388a0b53', correct: 3, optionsJson: '["100 m","200 m","300 m","400 m"]' },
  { id: 4398, uid: 'cbse-mathematics-heights-and-distances-abf803fa', correct: 0, optionsJson: '["100(√3 - 1) m","100(√3 + 1) m","100√3 m","100/√3 m"]' },
  { id: 4399, uid: 'cbse-mathematics-heights-and-distances-279ac0e6', correct: 2, optionsJson: '["a√2","a/√2","a/(2√2)","2a√2"]' },
  { id: 4400, uid: 'cbse-mathematics-heights-and-distances-5b5a4abb', correct: 0, optionsJson: '["h tan(45° + theta)","h tan(45° - theta)","h cot(45° + theta)","h cot(45° - theta)"]' },
  { id: 4401, uid: 'cbse-mathematics-heights-and-distances-c8ee4aee', correct: 2, optionsJson: '["h/2","h","h/3","3h"]' },
  { id: 4402, uid: 'cbse-mathematics-heights-and-distances-28ac45f0', correct: 1, optionsJson: '["x/√3","(√3/2) x","x√3","2x/√3"]' },
  { id: 4403, uid: 'cbse-mathematics-heights-and-distances-614e83f7', correct: 0, optionsJson: '["(√3 + 1) x","(√3 - 1) x","x√3","x"]' },
  { id: 4405, uid: 'cbse-mathematics-heights-and-distances-c49e5552', correct: 2, optionsJson: '["6 m","10 m","12 m","16 m"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 4, Application of Trigonometry / Heights and Distances). id 4404 excluded (classification C).\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
