// CBSE Mathematics content-promotion campaign, Batch 3 (tail of Introduction
// to Trigonometry / Trigonometric Identities, ids 4356-4379). Every
// candidate below was independently re-derived from first principles per
// docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before being
// included here. id 4352 (already examined and classified C in Batch 2 --
// two options share the same value under commutativity) is unchanged and
// still excluded. Scope: `status` transcribed->verified only, via the
// shared guarded helper in scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-03-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4356, uid: 'cbse-mathematics-trigonometric-identities-05a51544', correct: 1, optionsJson: '["60°","30°","45°","15°"]' },
  { id: 4357, uid: 'cbse-mathematics-trigonometric-identities-7d510d67', correct: 2, optionsJson: '["1","3/4","1/2","1/4"]' },
  { id: 4358, uid: 'cbse-mathematics-trigonometric-identities-059ce1e5', correct: 1, optionsJson: '["±√(a²+b²+c²)","±√(a²+b²-c²)","±√(c²-a²-b²)","none of these"]' },
  { id: 4359, uid: 'cbse-mathematics-trigonometric-identities-9ab194ca', correct: 1, optionsJson: '["cosβ","cos2β","sinα","sin2α"]' },
  { id: 4360, uid: 'cbse-mathematics-trigonometric-identities-946eb74d', correct: 2, optionsJson: '["-1, 1","0, 1","1, 2","-1, -1"]' },
  { id: 4361, uid: 'cbse-mathematics-trigonometric-identities-33e88f5e', correct: 1, optionsJson: '["0","1","-1","2"]' },
  { id: 4362, uid: 'cbse-mathematics-trigonometric-identities-92d0139e', correct: 2, optionsJson: '["0","1","-1","none of these"]' },
  { id: 4363, uid: 'cbse-mathematics-trigonometric-identities-3634c240', correct: 2, optionsJson: '["7","12","25","none of these"]' },
  { id: 4364, uid: 'cbse-mathematics-trigonometric-identities-2a0bcec7', correct: 1, optionsJson: '["a²-b²","b²-a²","a²+b²","b-a"]' },
  { id: 4365, uid: 'cbse-mathematics-trigonometric-identities-b0b48e01', correct: 0, optionsJson: '["x²+y²+z²=r²","x²+y²-z²=r²","x²-y²+z²=r²","z²+y²-x²=r²"]' },
  { id: 4366, uid: 'cbse-mathematics-trigonometric-identities-e070db97', correct: 1, optionsJson: '["-1","1","0","none of these"]' },
  { id: 4367, uid: 'cbse-mathematics-trigonometric-identities-45a44753', correct: 3, optionsJson: '["m²-n²","m²n²","n²-m²","m²+n²"]' },
  { id: 4368, uid: 'cbse-mathematics-trigonometric-identities-e3a92414', correct: 2, optionsJson: '["-1","0","1","none of these"]' },
  { id: 4369, uid: 'cbse-mathematics-trigonometric-identities-db983b9e', correct: 2, optionsJson: '["1 - 1/m","m² - 1","1/m","-m"]' },
  { id: 4370, uid: 'cbse-mathematics-trigonometric-identities-fe8c7389', correct: 0, optionsJson: '["1/√2","1/2","0","√2"]' },
  { id: 4371, uid: 'cbse-mathematics-trigonometric-identities-2c0a8688', correct: 0, optionsJson: '["36","9","6","18"]' },
  { id: 4372, uid: 'cbse-mathematics-trigonometric-identities-5f203d1a', correct: 2, optionsJson: '["√3","1/√3","1","0"]' },
  { id: 4373, uid: 'cbse-mathematics-trigonometric-identities-fd52fd83', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4374, uid: 'cbse-mathematics-trigonometric-identities-61b4afc4', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4375, uid: 'cbse-mathematics-trigonometric-identities-f8112858', correct: 2, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4376, uid: 'cbse-mathematics-trigonometric-identities-e89497e8', correct: 2, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4377, uid: 'cbse-mathematics-trigonometric-identities-5004af87', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4378, uid: 'cbse-mathematics-trigonometric-identities-2284fde2', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4379, uid: 'cbse-mathematics-trigonometric-identities-7416c7ea', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 3, Introduction to Trigonometry tail). id 4352 remains excluded (classification C, from Batch 2).\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
