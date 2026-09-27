// CBSE Mathematics content-promotion campaign, Batch 1 (Circles chapter,
// ids 4264-4328). Every candidate below was independently re-derived from
// first principles per docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md
// before being included here. Scope: `status` transcribed->verified only,
// via the shared guarded helper in scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-01-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4264, uid: 'cbse-mathematics-circles-4d22fd74', correct: 3, optionsJson: '["12 cm","13 cm","8.5 cm","√119 cm"]' },
  { id: 4265, uid: 'cbse-mathematics-circles-b0cbe1e2', correct: 0, optionsJson: '["7 cm","12 cm","15 cm","24.5 cm"]' },
  { id: 4266, uid: 'cbse-mathematics-circles-3140cf7f', correct: 2, optionsJson: '["√7 cm","7 cm","5 cm","25 cm"]' },
  { id: 4267, uid: 'cbse-mathematics-circles-754798ed', correct: 2, optionsJson: '["1","2","infinite","none of these"]' },
  { id: 4268, uid: 'cbse-mathematics-circles-d1c1d151', correct: 2, optionsJson: '["50°","60°","80°","90°"]' },
  { id: 4269, uid: 'cbse-mathematics-circles-d2ce112c', correct: 1, optionsJson: '["30°","45°","60°","90°"]' },
  { id: 4270, uid: 'cbse-mathematics-circles-cd8b800c', correct: 3, optionsJson: '["60°","45°","30°","90°"]' },
  { id: 4271, uid: 'cbse-mathematics-circles-d3e46ccf', correct: 1, optionsJson: '["1 cm","2 cm","3 cm","4 cm"]' },
  { id: 4272, uid: 'cbse-mathematics-circles-333bb605', correct: 2, optionsJson: '["60°","45°","30°","90°"]' },
  { id: 4273, uid: 'cbse-mathematics-circles-591bf494', correct: 1, optionsJson: '["AC + AD = BD + CD","AB + CD = BC + AD","AB + CD = AC + BC","AC + AD = BC + DB"]' },
  { id: 4274, uid: 'cbse-mathematics-circles-8a498cdd', correct: 1, optionsJson: '["√7 cm","2√7 cm","10 cm","5 cm"]' },
  { id: 4275, uid: 'cbse-mathematics-circles-0db7f925', correct: 2, optionsJson: '["4 cm","6 cm","8 cm","12 cm"]' },
  { id: 4276, uid: 'cbse-mathematics-circles-204b1b78', correct: 1, optionsJson: '["90°","50°","70°","40°"]' },
  { id: 4277, uid: 'cbse-mathematics-circles-2cd3337f', correct: 1, optionsJson: '["1","2","3","4"]' },
  { id: 4278, uid: 'cbse-mathematics-circles-d5d82a76', correct: 1, optionsJson: '["3 cm","4 cm","5 cm","6 cm"]' },
  { id: 4281, uid: 'cbse-mathematics-circles-5eb87290', correct: 0, optionsJson: '["25°","30°","40°","50°"]' },
  { id: 4302, uid: 'cbse-mathematics-circles-5b7847bd', correct: 2, optionsJson: '["4","3","2","1"]' },
  { id: 4303, uid: 'cbse-mathematics-circles-2c002cbc', correct: 3, optionsJson: '["30°","45°","60°","90°"]' },
  { id: 4311, uid: 'cbse-mathematics-circles-e376d5c8', correct: 2, optionsJson: '["12 cm","18 cm","24 cm","36 cm"]' },
  { id: 4312, uid: 'cbse-mathematics-circles-0435087f', correct: 3, optionsJson: '["5 cm","6 cm","7 cm","8 cm"]' },
  { id: 4313, uid: 'cbse-mathematics-circles-eed44fc6', correct: 2, optionsJson: '["30°","60°","90°","180°"]' },
  { id: 4318, uid: 'cbse-mathematics-circles-9134ee56', correct: 3, optionsJson: '["30°","45°","60°","90°"]' },
  { id: 4324, uid: 'cbse-mathematics-circles-55615aad', correct: 1, optionsJson: '["5√2 cm","10√2 cm","5/√2 cm","5 cm"]' },
  { id: 4325, uid: 'cbse-mathematics-circles-ca41f015', correct: 2, optionsJson: '["chord","tangent","secant","diameter"]' },
  { id: 4328, uid: 'cbse-mathematics-circles-20e545b0', correct: 3, optionsJson: '["(a)","(b)","(c)","(d)"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 1, Circles).\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
