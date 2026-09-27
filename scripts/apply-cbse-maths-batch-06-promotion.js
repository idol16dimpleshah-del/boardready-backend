// CBSE Mathematics content-promotion campaign, Batch 6 (rest of Areas
// Related to Circles doc-149 + start of Real Numbers, ids 4437-4467).
// Every candidate below was independently re-derived from first principles
// per docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before
// being included here.
//
// id 4442 is DELIBERATELY EXCLUDED per the user's explicit "hold one back"
// decision (made when the CBSE Maths reconciliation report identified it
// as a live duplicate of id 4927, both currently in the pool). Confirmed
// again here: duplicate_flags row 408 flags id 4442 against id 4927's
// question_uid at similarity 1.0 (exact match), corroborating the
// reconciliation's independent token-overlap finding. id 4927 stays at
// `transcribed` for now and will be promoted on its own when the campaign
// reaches Areas Related to Circles' second source batch (doc 158).
//
// Scope: `status` transcribed->verified only, via the shared guarded
// helper in scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-06-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4437, uid: 'cbse-mathematics-areas-related-to-circles-a74da141', correct: 3, optionsJson: '["halved","doubled","tripled","quadrupled"]' },
  { id: 4438, uid: 'cbse-mathematics-areas-related-to-circles-fad183c4', correct: 1, optionsJson: '["10%","19%","20%","36%"]' },
  { id: 4439, uid: 'cbse-mathematics-areas-related-to-circles-89e29ccb', correct: 1, optionsJson: '["π : √3","2 : √π","3 : π","π : √2"]' },
  { id: 4440, uid: 'cbse-mathematics-areas-related-to-circles-a00233d6', correct: 1, optionsJson: '["20 cm","10 cm","15 cm","12 cm"]' },
  { id: 4441, uid: 'cbse-mathematics-areas-related-to-circles-b9076e54', correct: 1, optionsJson: '["π : √2","π : √3","√3 : π","√2 : π"]' },
  { id: 4443, uid: 'cbse-mathematics-areas-related-to-circles-a3c9226e', correct: 2, optionsJson: '["10 cm","12 cm","14 cm","16 cm"]' },
  { id: 4445, uid: 'cbse-mathematics-areas-related-to-circles-4904d613', correct: 1, optionsJson: '["58 cm²","52 cm²","25 cm²","56 cm²"]' },
  { id: 4446, uid: 'cbse-mathematics-areas-related-to-circles-85fc0160', correct: 2, optionsJson: '["12 cm","16 cm","8 cm","10 cm"]' },
  { id: 4447, uid: 'cbse-mathematics-areas-related-to-circles-92b70ec3', correct: 3, optionsJson: '["40π cm²","30π cm²","100π cm²","25π cm²"]' },
  { id: 4448, uid: 'cbse-mathematics-areas-related-to-circles-f0d78630', correct: 0, optionsJson: '["154 cm²","160 cm²","200 cm²","150 cm²"]' },
  { id: 4449, uid: 'cbse-mathematics-areas-related-to-circles-98adaf2d', correct: 1, optionsJson: '["34","26","17","14"]' },
  { id: 4450, uid: 'cbse-mathematics-areas-related-to-circles-288bb703', correct: 3, optionsJson: '["36π cm²","18π cm²","12π cm²","9π cm²"]' },
  { id: 4451, uid: 'cbse-mathematics-areas-related-to-circles-1c1dcf17', correct: 0, optionsJson: '["10 m","15 m","20 m","24 m"]' },
  { id: 4452, uid: 'cbse-mathematics-areas-related-to-circles-6c619227', correct: 0, optionsJson: '["96%","40%","80%","48%"]' },
  { id: 4457, uid: 'cbse-mathematics-areas-related-to-circles-5b8b9e25', correct: 2, optionsJson: '["12 cm","16 cm","8 cm","10 cm"]' },
  { id: 4458, uid: 'cbse-mathematics-areas-related-to-circles-f1e75548', correct: 2, optionsJson: '["60°","90°","100°","120°"]' },
  { id: 4459, uid: 'cbse-mathematics-areas-related-to-circles-e0939c7e', correct: 3, optionsJson: '["110°","130°","100°","126°"]' },
  { id: 4461, uid: 'cbse-mathematics-real-numbers-9218b022', correct: 1, optionsJson: '["3","4","5","6"]' },
  { id: 4462, uid: 'cbse-mathematics-real-numbers-da0ce56a', correct: 1, optionsJson: '["600","500","400","200"]' },
  { id: 4463, uid: 'cbse-mathematics-real-numbers-4c942ade', correct: 1, optionsJson: '["2","3","4","7"]' },
  { id: 4464, uid: 'cbse-mathematics-real-numbers-58b598fa', correct: 2, optionsJson: '["1","2","4","6"]' },
  { id: 4465, uid: 'cbse-mathematics-real-numbers-90ee4e7c', correct: 1, optionsJson: '["xy","xy²","x³y³","x²y²"]' },
  { id: 4466, uid: 'cbse-mathematics-real-numbers-68ea6478', correct: 2, optionsJson: '["pq","p³q³","p³q²","p²q²"]' },
  { id: 4467, uid: 'cbse-mathematics-real-numbers-3e83dd7a', correct: 0, optionsJson: '["pq","p³q³","p³q²","p²q²"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 6, Areas Related to Circles tail + Real Numbers start). id 4442 excluded (hold-one-back decision, duplicate of id 4927).\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
