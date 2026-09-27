// Batch 15A follow-up. Promotes question 4575's publication status per
// docs/workstream-6a-4575-promotion-correction-record.md. Scope of this
// write: `status` (transcribed -> verified) ONLY. answer_status is already
// 'verified' and diagram_status is already 'adapted_verified' -- neither is
// touched.
//
// Usage: node scripts/apply-4575-status-promotion.js /path/to/boardready.db

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const QUESTION_ID = 4575;
const EXPECTED_UID = 'cbse-mathematics-polynomials-752a6e3e';
const EXPECTED_STATUS_BEFORE = 'transcribed';
const EXPECTED_ANSWER_STATUS = 'verified';
const EXPECTED_DIAGRAM_STATUS = 'adapted_verified';
const EXPECTED_CORRECT = 2;
const EXPECTED_OPTIONS_JSON = '["3","1","2","0"]';

const NEW_STATUS = 'verified';

const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'marks',
  'text', 'normalized_text', 'options_json', 'parts_json', 'correct', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id', 'diagram_status',
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting question ${QUESTION_ID}: status ${EXPECTED_STATUS_BEFORE} -> ${NEW_STATUS} only.\n`);

const db = new DatabaseSync(DB_PATH);
function snapshotQuestion(id) { return db.prepare('SELECT * FROM questions WHERE id = ?').get(id); }

db.exec('BEGIN IMMEDIATE');
try {
  const beforeQ = snapshotQuestion(QUESTION_ID);
  if (!beforeQ) throw new Error(`question id ${QUESTION_ID} not found — aborting.`);
  if (beforeQ.question_uid !== EXPECTED_UID) throw new Error(`question_uid mismatch — aborting.`);
  if (beforeQ.status !== EXPECTED_STATUS_BEFORE) throw new Error(`status has changed (found '${beforeQ.status}') — aborting.`);
  if (beforeQ.answer_status !== EXPECTED_ANSWER_STATUS) throw new Error(`answer_status has changed (found '${beforeQ.answer_status}') — aborting.`);
  if (beforeQ.diagram_status !== EXPECTED_DIAGRAM_STATUS) throw new Error(`diagram_status has changed (found '${beforeQ.diagram_status}') — aborting.`);
  if (Number(beforeQ.correct) !== EXPECTED_CORRECT) throw new Error(`correct has changed (expected ${EXPECTED_CORRECT}, found ${beforeQ.correct}) — aborting.`);
  if (beforeQ.options_json !== EXPECTED_OPTIONS_JSON) throw new Error(`options_json has changed — aborting.`);

  const updateInfo = db.prepare('UPDATE questions SET status = ? WHERE id = ? AND status = ? AND answer_status = ?')
    .run(NEW_STATUS, QUESTION_ID, EXPECTED_STATUS_BEFORE, EXPECTED_ANSWER_STATUS);
  if (updateInfo.changes !== 1) throw new Error(`expected exactly 1 row changed, got ${updateInfo.changes} — aborting, rolling back.`);

  const afterQ = snapshotQuestion(QUESTION_ID);
  for (const col of QUESTION_COLUMNS) {
    if (col === 'status') continue;
    if (String(beforeQ[col]) !== String(afterQ[col])) throw new Error(`unexpected change in questions.${col} — aborting, rolling back.`);
  }
  if (afterQ.status !== NEW_STATUS) throw new Error('post-write status mismatch — aborting, rolling back.');

  db.exec('COMMIT');
  console.log('COMMIT successful.\n');
  console.log('status:', beforeQ.status, '->', afterQ.status);
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}

db.close();
