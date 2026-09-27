// CBSE Mathematics content-promotion campaign, Batch 2 (Circles tail +
// Introduction to Trigonometry chapters, ids 4329-4355). Every candidate
// below was independently re-derived from first principles per
// docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before being
// included here. id 4352 is EXCLUDED (classification C: two options share
// the same mathematical value under commutativity of addition -- needs a
// content editor, not a status promotion). Scope: `status`
// transcribed->verified only, via the shared guarded helper in
// scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-02-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4329, uid: 'cbse-mathematics-circles-2494f5d6', correct: 1, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4331, uid: 'cbse-mathematics-circles-fa18281c', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4333, uid: 'cbse-mathematics-circles-197107ba', correct: 1, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4334, uid: 'cbse-mathematics-trigonometric-identities-4675dda6', correct: 0, optionsJson: '["3","2","1","1/2"]' },
  { id: 4335, uid: 'cbse-mathematics-trigonometric-identities-9f2614e7', correct: 1, optionsJson: '["0","2","2020","2²⁰²⁰"]' },
  { id: 4336, uid: 'cbse-mathematics-trigonometric-identities-a9f4b7f2', correct: 0, optionsJson: '["secθ + tanθ","secθ - tanθ","sec²θ + tan²θ","sec²θ - tan²θ"]' },
  { id: 4337, uid: 'cbse-mathematics-trigonometric-identities-9de0b8b7', correct: 1, optionsJson: '["cotθ - cosecθ","cosecθ + cotθ","cosec²θ + cot²θ","(cotθ + cosecθ)²"]' },
  { id: 4338, uid: 'cbse-mathematics-trigonometric-identities-80661275', correct: 2, optionsJson: '["(1+cosθ)/sinθ","(1-cosθ)/cosθ","(1-cosθ)/sinθ","(1-sinθ)/cosθ"]' },
  { id: 4339, uid: 'cbse-mathematics-trigonometric-identities-649b01d0', correct: 2, optionsJson: '["0","1","sinθ + cosθ","sinθ - cosθ"]' },
  { id: 4340, uid: 'cbse-mathematics-trigonometric-identities-c1be2436', correct: 2, optionsJson: '["2tanθ","2secθ","2cosecθ","2tanθsecθ"]' },
  { id: 4341, uid: 'cbse-mathematics-trigonometric-identities-1e1bbd33', correct: 0, optionsJson: '["a²b²","ab","a⁴b⁴","a²+b²"]' },
  { id: 4342, uid: 'cbse-mathematics-trigonometric-identities-54c39aa2', correct: 3, optionsJson: '["ab","a²-b²","a²+b²","a²b²"]' },
  { id: 4343, uid: 'cbse-mathematics-trigonometric-identities-7479bfe2', correct: 3, optionsJson: '["secA","sinA","cosecA","cosA"]' },
  { id: 4344, uid: 'cbse-mathematics-trigonometric-identities-203e5736', correct: 3, optionsJson: '["z²/c²","1 - z²/c²","z²/c² - 1","1 + z²/c²"]' },
  { id: 4345, uid: 'cbse-mathematics-trigonometric-identities-e5e5becb', correct: 1, optionsJson: '["1","9","8","0"]' },
  { id: 4346, uid: 'cbse-mathematics-trigonometric-identities-575a9a6a', correct: 3, optionsJson: '["secA","sinA","cosecA","cosA"]' },
  { id: 4347, uid: 'cbse-mathematics-trigonometric-identities-b23506ca', correct: 3, optionsJson: '["sec²A","-1","cot²A","tan²A"]' },
  { id: 4348, uid: 'cbse-mathematics-trigonometric-identities-ae40891f', correct: 1, optionsJson: '["0°","90°","45°","30°"]' },
  { id: 4349, uid: 'cbse-mathematics-trigonometric-identities-565d9a43', correct: 0, optionsJson: '["0","1","1/2","√3/2"]' },
  { id: 4350, uid: 'cbse-mathematics-trigonometric-identities-82ed8609', correct: 1, optionsJson: '["(x²+1)/x","(x²+1)/2x","(x²-1)/2x","(x²-1)/x"]' },
  { id: 4351, uid: 'cbse-mathematics-trigonometric-identities-8a41179e', correct: 3, optionsJson: '["(x²+1)/x","(x²-1)/x","(x²+1)/2x","(x²-1)/2x"]' },
  { id: 4353, uid: 'cbse-mathematics-trigonometric-identities-1165cfde', correct: 1, optionsJson: '["2cos²A + 1","2cos²A - 1","2sin²A - 1","2sin²A + 1"]' },
  { id: 4354, uid: 'cbse-mathematics-trigonometric-identities-507adaf3', correct: 1, optionsJson: '["1","2","4","0"]' },
  { id: 4355, uid: 'cbse-mathematics-trigonometric-identities-e6286937', correct: 1, optionsJson: '["0","1","-1","none of these"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 2, Circles tail + Trig Identities). id 4352 excluded (classification C).\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
