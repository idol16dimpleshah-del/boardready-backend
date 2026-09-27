// Batch 15, Task 5 (1 of 5). Corrects question 4569's answer-key index per
// docs/workstream-4e-answer-index-defects-batch.md. Scope: `correct` only
// (2 -> 1). status/answer_status untouched (already reviewed content with a
// wrong stored index, not unreviewed content).
//
// Usage: node scripts/apply-answer-index-defect-4569.js /path/to/boardready.db

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');
const QUESTION_ID = 4569;
const EXPECTED_UID = 'cbse-mathematics-polynomials-c8d33f9f';
const EXPECTED_OPTIONS_JSON = '["17/4","-17/4","-15/4","15/4"]';
const EXPECTED_CORRECT_BEFORE = 2;
const NEW_CORRECT = 1;
const EXPECTED_STATUS = 'transcribed';
const EXPECTED_ANSWER_STATUS = 'verified';

const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'status', 'marks',
  'text', 'normalized_text', 'options_json', 'parts_json', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id', 'diagram_status',
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Correcting question ${QUESTION_ID}: correct ${EXPECTED_CORRECT_BEFORE} -> ${NEW_CORRECT}\n`);

const db = new DatabaseSync(DB_PATH);

function snapshotQuestion(id) {
  return db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
}

db.exec('BEGIN IMMEDIATE');
try {
  const beforeQ = snapshotQuestion(QUESTION_ID);
  if (!beforeQ) throw new Error(`question id ${QUESTION_ID} not found — aborting.`);
  if (beforeQ.question_uid !== EXPECTED_UID) {
    throw new Error(`question_uid mismatch (expected ${EXPECTED_UID}, found ${beforeQ.question_uid}) — aborting.`);
  }
  if (beforeQ.options_json !== EXPECTED_OPTIONS_JSON) {
    throw new Error(`options_json has changed since this was drafted — aborting.`);
  }
  if (Number(beforeQ.correct) !== EXPECTED_CORRECT_BEFORE) {
    throw new Error(`correct has changed since this was drafted (expected ${EXPECTED_CORRECT_BEFORE}, found ${beforeQ.correct}) — aborting.`);
  }
  if (beforeQ.status !== EXPECTED_STATUS || beforeQ.answer_status !== EXPECTED_ANSWER_STATUS) {
    throw new Error(`status/answer_status has changed since this was drafted (found ${beforeQ.status}/${beforeQ.answer_status}) — aborting.`);
  }

  const updateStmt = db.prepare('UPDATE questions SET correct = ? WHERE id = ? AND correct = ?');
  const updateInfo = updateStmt.run(NEW_CORRECT, QUESTION_ID, EXPECTED_CORRECT_BEFORE);
  if (updateInfo.changes !== 1) {
    throw new Error(`expected exactly 1 row changed, got ${updateInfo.changes} — aborting, rolling back.`);
  }

  const afterQ = snapshotQuestion(QUESTION_ID);
  for (const col of QUESTION_COLUMNS) {
    if (String(beforeQ[col]) !== String(afterQ[col])) {
      throw new Error(`unexpected change in questions.${col} — aborting, rolling back.`);
    }
  }
  if (Number(afterQ.correct) !== NEW_CORRECT) {
    throw new Error('post-write correct does not match expected new value — aborting, rolling back.');
  }

  db.exec('COMMIT');
  console.log('COMMIT successful.\n');
  console.log('correct:', beforeQ.correct, '->', afterQ.correct);
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}

db.close();
