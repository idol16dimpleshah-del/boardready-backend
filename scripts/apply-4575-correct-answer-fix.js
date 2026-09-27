// One-time, reviewed correction script for Workstream 3E — fixes
// questions.id=4575's `correct` answer-key index per
// docs/workstream-3e-4575-correct-answer-correction-record.md: the source's
// own printed answer key (ch1-2.pdf p.2.28, item 45: "(c)") says the answer
// is option (c) = index 2, but the live database had `correct = 3`
// (index 3 = option (d) "0"), a real grading defect. This script changes
// ONLY the `correct` column on this one row — explicitly NOT
// `answer_status`, NOT `status`, NOT `diagram_status`, and no
// `visual_assets` row — those are separate concerns per the correction
// record. Same guarded-transaction discipline as every other correction
// script in this project: the UPDATE is guarded by a WHERE clause matching
// the exact expected prior state, checked for info.changes === 1, and every
// untouched column is re-verified byte-identical afterward. NOT a
// general-purpose or reusable tool — hardcoded to this one approved change
// and should not be run again after use.
//
// Usage: node scripts/apply-4575-correct-answer-fix.js /path/to/boardready.db

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const QUESTION_ID = 4575;
const EXPECTED_UID = 'cbse-mathematics-polynomials-752a6e3e';
const EXPECTED_CORRECT_BEFORE = 3;
const NEW_CORRECT = 2;
const EXPECTED_OPTIONS_JSON = '["3","1","2","0"]';

// Every column that must be byte-identical before and after — everything
// except `correct`, which is the one column this script intentionally
// changes. answer_status, status, and diagram_status are listed explicitly
// so any accidental change to them fails loudly.
const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'status', 'marks',
  'text', 'normalized_text', 'options_json', 'parts_json', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id', 'diagram_status',
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Fixing question ${QUESTION_ID}'s correct answer index: ${EXPECTED_CORRECT_BEFORE} -> ${NEW_CORRECT}. No other row or column will be touched.\n`);

const db = new DatabaseSync(DB_PATH); // NOT readOnly — this is the one deliberate, reviewed write.

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
  if (Number(beforeQ.correct) !== EXPECTED_CORRECT_BEFORE) {
    throw new Error(`correct has changed since the correction record was written (expected ${EXPECTED_CORRECT_BEFORE}, found ${beforeQ.correct}) — aborting.`);
  }
  if (beforeQ.options_json !== EXPECTED_OPTIONS_JSON) {
    throw new Error(`options_json has changed since the correction record was written (expected ${EXPECTED_OPTIONS_JSON}, found ${beforeQ.options_json}) — aborting.`);
  }
  if (beforeQ.answer_status !== 'verified') {
    throw new Error(`answer_status has changed since the correction record was written (expected 'verified', found '${beforeQ.answer_status}') — aborting.`);
  }
  if (beforeQ.diagram_status !== 'adapted_verified') {
    throw new Error(`diagram_status has changed since the correction record was written (expected 'adapted_verified', found '${beforeQ.diagram_status}') — aborting.`);
  }

  const updateStmt = db.prepare('UPDATE questions SET correct = ? WHERE id = ? AND correct = ?');
  const updateInfo = updateStmt.run(NEW_CORRECT, QUESTION_ID, EXPECTED_CORRECT_BEFORE);
  if (updateInfo.changes !== 1) {
    throw new Error(`expected exactly 1 row changed, got ${updateInfo.changes} — aborting, rolling back.`);
  }

  // ---- Verification (still inside the transaction) ----
  const afterQ = snapshotQuestion(QUESTION_ID);
  for (const col of QUESTION_COLUMNS) {
    if (String(beforeQ[col]) !== String(afterQ[col])) {
      throw new Error(`unexpected change in questions.${col} (before=${beforeQ[col]}, after=${afterQ[col]}) — aborting, rolling back.`);
    }
  }
  if (Number(afterQ.correct) !== NEW_CORRECT) {
    throw new Error(`correct after write does not match expected new value (expected ${NEW_CORRECT}, got ${afterQ.correct}) — aborting, rolling back.`);
  }

  db.exec('COMMIT');
  console.log('COMMIT successful.\n');
  console.log('correct:', beforeQ.correct, '->', afterQ.correct);
  console.log('Confirmed unchanged: answer_status =', afterQ.answer_status, '| status =', afterQ.status, '| diagram_status =', afterQ.diagram_status);
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}

db.close();
