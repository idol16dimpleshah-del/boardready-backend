// One-off guarded correction: retire legacy row id 68 (Quadratic
// Equations, "Which of the following is a quadratic equation?").
//
// See docs/correction-record-id68-legacy-quadratic-retirement.md for the
// full investigation, source verification, and the user's explicit
// decision (retire, not overwrite-to-match-source, not repoint-correct).
//
// This is NOT part of the CBSE Maths content-promotion campaign (id 68
// never matched that pool's filter) and does NOT use the campaign's
// shared promote-status-batch.js helper (that helper is scoped to
// transcribed->verified transitions only). This is its own dedicated,
// single-row, single-column guarded write: `status` changes from
// 'verified' to 'needs_review' (an existing, already-used non-gradable
// status) ONLY. Every other column is verified byte-identical before and
// after.
//
// Usage: node scripts/apply-id68-retirement.js /path/to/boardready.db

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const EXPECTED = {
  id: 68,
  status: 'verified',
  answer_status: 'source_provided',
  diagram_status: 'needs_visual_review',
  correct: 2,
  options_json: '["x^2 + 2x + 1 = (4-x)^2 + 3","x^3 - x^2 = (x-1)^3","2x - x^2 = x^2 + 5","x(x+1) + 8 = (x+2)(x-2)"]',
};

const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'marks',
  'text', 'normalized_text', 'options_json', 'parts_json', 'correct', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id', 'diagram_status',
];

console.log(`Target database: ${DB_PATH}`);
console.log('Retiring id 68 (status: verified -> needs_review). See docs/correction-record-id68-legacy-quadratic-retirement.md\n');

const db = new DatabaseSync(DB_PATH);

function snapshot(id) { return db.prepare('SELECT * FROM questions WHERE id = ?').get(id); }

db.exec('BEGIN IMMEDIATE');
try {
  const before = snapshot(EXPECTED.id);
  if (!before) throw new Error(`question id ${EXPECTED.id} not found`);
  if (before.status !== EXPECTED.status) throw new Error(`status has changed (expected '${EXPECTED.status}', found '${before.status}')`);
  if (before.answer_status !== EXPECTED.answer_status) throw new Error(`answer_status has changed (expected '${EXPECTED.answer_status}', found '${before.answer_status}')`);
  if (before.diagram_status !== EXPECTED.diagram_status) throw new Error(`diagram_status has changed (expected '${EXPECTED.diagram_status}', found '${before.diagram_status}')`);
  if (Number(before.correct) !== EXPECTED.correct) throw new Error(`correct has changed (expected ${EXPECTED.correct}, found ${before.correct})`);
  if (before.options_json !== EXPECTED.options_json) throw new Error(`options_json has changed (expected ${EXPECTED.options_json}, found ${before.options_json})`);

  const updateInfo = db.prepare('UPDATE questions SET status = ? WHERE id = ? AND status = ? AND answer_status = ? AND diagram_status = ? AND correct = ? AND options_json = ?')
    .run('needs_review', EXPECTED.id, EXPECTED.status, EXPECTED.answer_status, EXPECTED.diagram_status, EXPECTED.correct, EXPECTED.options_json);
  if (updateInfo.changes !== 1) throw new Error(`expected exactly 1 row changed, got ${updateInfo.changes}`);

  const after = snapshot(EXPECTED.id);
  if (after.status !== 'needs_review') throw new Error(`post-write status is '${after.status}', expected 'needs_review'`);
  for (const col of QUESTION_COLUMNS) {
    if (col === 'status') continue;
    if (String(before[col]) !== String(after[col])) throw new Error(`unexpected change in questions.${col}: before=${before[col]} after=${after[col]}`);
  }

  db.exec('COMMIT');
  console.log('id 68: status verified -> needs_review — COMMIT successful. All other columns confirmed byte-identical.');
} catch (err) {
  db.exec('ROLLBACK');
  console.log('FAILED, rolled back:', err.message);
  process.exitCode = 1;
}

db.close();
