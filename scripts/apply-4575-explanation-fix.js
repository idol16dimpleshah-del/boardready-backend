// One-time, reviewed correction script for Workstream 3F — fixes
// questions.id=4575's stale `explanation` text per
// docs/workstream-3f-4575-explanation-correction-record.md: the text still
// asserted the pre-correction (wrong) "zero real zeroes" rationale after
// Workstream 3E already fixed `correct` to 2 ("2 zeroes"). This script
// changes ONLY the `explanation` column on this one row — explicitly NOT
// `correct`, NOT `status`, NOT `answer_status`, NOT `diagram_status`, and no
// `visual_assets` row. Same guarded-transaction discipline as every other
// correction script in this project: the UPDATE is guarded by a WHERE
// clause matching the exact expected prior state, checked for
// info.changes === 1, and every untouched column is re-verified
// byte-identical afterward. NOT a general-purpose or reusable tool —
// hardcoded to this one approved change and should not be run again after
// use.
//
// Usage: node scripts/apply-4575-explanation-fix.js /path/to/boardready.db

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const QUESTION_ID = 4575;
const EXPECTED_UID = 'cbse-mathematics-polynomials-752a6e3e';
const EXPECTED_EXPLANATION_BEFORE = 'The graph never crosses or touches the x-axis, so p(x) has zero real zeroes.';
const NEW_EXPLANATION = "The graph crosses the x-axis exactly twice (both crossings at positive x-values), so p(x) has 2 real zeroes — matching the source's own printed answer key (ch1-2.pdf, p.2.28, item 45: option (c)).";
const EXPECTED_CORRECT = 2;
const EXPECTED_STATUS = 'transcribed';
const EXPECTED_ANSWER_STATUS = 'verified';
const EXPECTED_DIAGRAM_STATUS = 'adapted_verified';

// Every column that must be byte-identical before and after — everything
// except `explanation`, which is the one column this script intentionally
// changes.
const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'status', 'marks',
  'text', 'normalized_text', 'options_json', 'parts_json', 'correct', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id', 'diagram_status',
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Fixing question ${QUESTION_ID}'s stale explanation text. No other row or column will be touched.\n`);

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
  if (beforeQ.explanation !== EXPECTED_EXPLANATION_BEFORE) {
    throw new Error(`explanation has changed since the correction record was written (expected ${JSON.stringify(EXPECTED_EXPLANATION_BEFORE)}, found ${JSON.stringify(beforeQ.explanation)}) — aborting.`);
  }
  if (Number(beforeQ.correct) !== EXPECTED_CORRECT) {
    throw new Error(`correct has changed since the correction record was written (expected ${EXPECTED_CORRECT}, found ${beforeQ.correct}) — aborting.`);
  }
  if (beforeQ.status !== EXPECTED_STATUS) {
    throw new Error(`status has changed since the correction record was written (expected '${EXPECTED_STATUS}', found '${beforeQ.status}') — aborting.`);
  }
  if (beforeQ.answer_status !== EXPECTED_ANSWER_STATUS) {
    throw new Error(`answer_status has changed since the correction record was written (expected '${EXPECTED_ANSWER_STATUS}', found '${beforeQ.answer_status}') — aborting.`);
  }
  if (beforeQ.diagram_status !== EXPECTED_DIAGRAM_STATUS) {
    throw new Error(`diagram_status has changed since the correction record was written (expected '${EXPECTED_DIAGRAM_STATUS}', found '${beforeQ.diagram_status}') — aborting.`);
  }

  const updateStmt = db.prepare('UPDATE questions SET explanation = ? WHERE id = ? AND explanation = ?');
  const updateInfo = updateStmt.run(NEW_EXPLANATION, QUESTION_ID, EXPECTED_EXPLANATION_BEFORE);
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
  if (afterQ.explanation !== NEW_EXPLANATION) {
    throw new Error(`explanation after write does not match expected new value — aborting, rolling back.`);
  }

  db.exec('COMMIT');
  console.log('COMMIT successful.\n');
  console.log('explanation before:', beforeQ.explanation);
  console.log('explanation after: ', afterQ.explanation);
  console.log('\nConfirmed unchanged: correct =', afterQ.correct, '| status =', afterQ.status, '| answer_status =', afterQ.answer_status, '| diagram_status =', afterQ.diagram_status);
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}

db.close();
