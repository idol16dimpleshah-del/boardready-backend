// CBSE Mathematics content-promotion campaign, Batch 5 (Heights and
// Distances tail + Trigonometric Ratios + start of Areas Related to
// Circles, ids 4406-4436). Every candidate below was independently
// re-derived from first principles per
// docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before being
// included here. Scope: `status` transcribed->verified only, via the
// shared guarded helper in scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-05-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4406, uid: 'cbse-mathematics-heights-and-distances-c237a82f', correct: 2, optionsJson: '["2 m","2.25 m","2.5 m","3 m"]' },
  { id: 4407, uid: 'cbse-mathematics-heights-and-distances-a008ad84', correct: 3, optionsJson: '["10 m","20 m","10√3 m","30 m"]' },
  { id: 4411, uid: 'cbse-mathematics-trigonometric-ratios-0721e6cf', correct: 0, optionsJson: '["xy","x/y","y/x","1/xy"]' },
  { id: 4412, uid: 'cbse-mathematics-trigonometric-ratios-1a0bc94f', correct: 3, optionsJson: '["b/√(a² + b²)","b/√(b² - a²)","a/√(a² - b²)","a/√(b² - a²)"]' },
  { id: 4414, uid: 'cbse-mathematics-trigonometric-ratios-c2f1ccf8', correct: 2, optionsJson: '["1/√2","√2","1","0"]' },
  { id: 4415, uid: 'cbse-mathematics-trigonometric-ratios-39f0607e', correct: 0, optionsJson: '["1/(2√2)","1/√2","1/2","0"]' },
  { id: 4416, uid: 'cbse-mathematics-trigonometric-ratios-4a0f606b', correct: 1, optionsJson: '["5/12","12/13","5/13","12/5"]' },
  { id: 4417, uid: 'cbse-mathematics-trigonometric-ratios-10dfd323', correct: 1, optionsJson: '["4/3","4/5","3/5","5/4"]' },
  { id: 4421, uid: 'cbse-mathematics-trigonometric-ratios-6567c1ba', correct: 3, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4422, uid: 'cbse-mathematics-trigonometric-ratios-f56deac6', correct: 1, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4423, uid: 'cbse-mathematics-trigonometric-ratios-668c9309', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4424, uid: 'cbse-mathematics-areas-related-to-circles-052e5138', correct: 3, optionsJson: '["π/2","2π","2","4"]' },
  { id: 4425, uid: 'cbse-mathematics-areas-related-to-circles-457bb98a', correct: 1, optionsJson: '["154","44","14","7"]' },
  { id: 4426, uid: 'cbse-mathematics-areas-related-to-circles-2b1e0ea1', correct: 2, optionsJson: '["3520 cm²","6400 cm²","7744 cm²","8800 cm²"]' },
  { id: 4427, uid: 'cbse-mathematics-areas-related-to-circles-e48d6502', correct: 2, optionsJson: '["22 cm²","44 cm²","77 cm²","154 cm²"]' },
  { id: 4428, uid: 'cbse-mathematics-areas-related-to-circles-b1789f5f', correct: 1, optionsJson: '["20 m","21 m","22 m","24 m"]' },
  { id: 4429, uid: 'cbse-mathematics-areas-related-to-circles-68d2e1ce', correct: 3, optionsJson: '["2800","4000","5500","7000"]' },
  { id: 4430, uid: 'cbse-mathematics-areas-related-to-circles-9412e437', correct: 2, optionsJson: '["55 m","110 m","220 m","230 m"]' },
  { id: 4431, uid: 'cbse-mathematics-areas-related-to-circles-92233063', correct: 2, optionsJson: '["50√2 cm","100/π cm","50√2/π cm","100√2/π cm"]' },
  { id: 4432, uid: 'cbse-mathematics-areas-related-to-circles-b88b7907', correct: 2, optionsJson: '["22√3 cm²","231 cm²","462 cm²","924 cm²"]' },
  { id: 4433, uid: 'cbse-mathematics-areas-related-to-circles-883be829', correct: 3, optionsJson: '["71.5 cm","71.7 cm","72.3 cm","72.7 cm"]' },
  { id: 4434, uid: 'cbse-mathematics-areas-related-to-circles-9c96ed21', correct: 0, optionsJson: '["1:4","3:4","1:3","2:3"]' },
  { id: 4435, uid: 'cbse-mathematics-areas-related-to-circles-58c44466', correct: 2, optionsJson: '["70 cm²","140 cm²","660 cm²","420 cm²"]' },
  { id: 4436, uid: 'cbse-mathematics-areas-related-to-circles-e71442a9', correct: 2, optionsJson: '["49 cm²","70 cm²","140 cm²","150 cm²"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 5, Heights/Distances tail + Trig Ratios + Areas Related to Circles start).\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
