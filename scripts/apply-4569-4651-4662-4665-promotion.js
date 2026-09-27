// Batch 15A, Tasks 2-5. Promotes 4 questions' `status` only per
// docs/workstream-5b-promotion-correction-record.md. Each question's
// content defect was already corrected and independently re-verified
// (answer_status='verified') under Batch 15 Task 5. Scope: status
// transcribed -> verified. answer_status and every other column untouched.
// Each question is its own independent guarded transaction.
//
// Usage: node scripts/apply-4569-4651-4662-4665-promotion.js /path/to/boardready.db

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const TARGETS = [
  {
    id: 4569,
    uid: 'cbse-mathematics-polynomials-c8d33f9f',
    correct: 1,
    optionsJson: '["17/4","-17/4","-15/4","15/4"]',
  },
  {
    id: 4651,
    uid: 'cbse-mathematics-quadratic-equations-c4d82213',
    correct: 0,
    optionsJson: '["3","-7/2","6","-3"]',
  },
  {
    id: 4662,
    uid: 'cbse-mathematics-quadratic-equations-5d3d3ec3',
    correct: 0,
    optionsJson: '["p = 1, q = -2","p = 0, q = 1","p = -2, q = 0","p = -2, q = 1"]',
  },
  {
    id: 4665,
    uid: 'cbse-mathematics-quadratic-equations-a21efcaa',
    correct: 2,
    optionsJson: '["3:1","3:16","16:3","16:1"]',
  },
];

const EXPECTED_STATUS_BEFORE = 'transcribed';
const EXPECTED_ANSWER_STATUS_BEFORE = 'verified';
const EXPECTED_DIAGRAM_STATUS = 'not_applicable';
const NEW_STATUS = 'verified';

const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'marks',
  'text', 'normalized_text', 'options_json', 'parts_json', 'correct', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id', 'diagram_status',
];

const db = new DatabaseSync(DB_PATH);
function snapshotQuestion(id) { return db.prepare('SELECT * FROM questions WHERE id = ?').get(id); }

console.log(`Target database: ${DB_PATH}\n`);

let anyFailure = false;
for (const t of TARGETS) {
  console.log(`--- id ${t.id} (${t.uid}) ---`);
  db.exec('BEGIN IMMEDIATE');
  try {
    const beforeQ = snapshotQuestion(t.id);
    if (!beforeQ) throw new Error(`question id ${t.id} not found — aborting.`);
    if (beforeQ.question_uid !== t.uid) throw new Error(`question_uid mismatch — aborting.`);
    if (beforeQ.status !== EXPECTED_STATUS_BEFORE) throw new Error(`status has changed (found '${beforeQ.status}') — aborting.`);
    if (beforeQ.answer_status !== EXPECTED_ANSWER_STATUS_BEFORE) throw new Error(`answer_status has changed (found '${beforeQ.answer_status}') — aborting.`);
    if (beforeQ.diagram_status !== EXPECTED_DIAGRAM_STATUS) throw new Error(`diagram_status has changed (found '${beforeQ.diagram_status}') — aborting.`);
    if (Number(beforeQ.correct) !== t.correct) throw new Error(`correct has changed (expected ${t.correct}, found ${beforeQ.correct}) — aborting.`);
    if (beforeQ.options_json !== t.optionsJson) throw new Error(`options_json has changed — aborting.`);

    const updateInfo = db.prepare('UPDATE questions SET status = ? WHERE id = ? AND status = ? AND answer_status = ?')
      .run(NEW_STATUS, t.id, EXPECTED_STATUS_BEFORE, EXPECTED_ANSWER_STATUS_BEFORE);
    if (updateInfo.changes !== 1) throw new Error(`expected exactly 1 row changed, got ${updateInfo.changes} — aborting, rolling back.`);

    const afterQ = snapshotQuestion(t.id);
    for (const col of QUESTION_COLUMNS) {
      if (col === 'status') continue;
      if (String(beforeQ[col]) !== String(afterQ[col])) throw new Error(`unexpected change in questions.${col} — aborting, rolling back.`);
    }
    if (afterQ.status !== NEW_STATUS) throw new Error('post-write status mismatch — aborting, rolling back.');

    db.exec('COMMIT');
    console.log(`status: ${beforeQ.status} -> ${afterQ.status} — COMMIT successful.\n`);
  } catch (err) {
    db.exec('ROLLBACK');
    console.error(`ERROR on id ${t.id} — rolled back, no changes committed:`, err.message, '\n');
    anyFailure = true;
  }
}

db.close();
if (anyFailure) process.exitCode = 1;
