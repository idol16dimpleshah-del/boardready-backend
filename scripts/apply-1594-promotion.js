// PROPOSED, NOT YET APPROVED OR RUN. Correction script drafted for
// Workstream 3G (Task 2 of the 5-workstream batch) — promotes question
// 1594's content status per
// docs/workstream-3g-1594-1230-promotion-proposal.md. This script is
// prepared for review only; it has NOT been executed against the live
// database. Do not run until the correction record's proposed field changes
// have been explicitly approved.
//
// Scope of this write, if approved: `answer_status` (source_provided ->
// verified), `status` (transcribed -> verified), and `answer_key_ref` (null
// -> a citation of the independent-derivation evidence trail, since neither
// source chapter has a printed answer key to cite — see the correction
// record for why this is not "inventing" a source). Explicitly NOT touched:
// `correct`, `options_json`, `text`, `explanation`, `diagram_status`, or any
// `visual_assets` row — visual work stays a separate, later, explicit step
// per your instruction to keep visual association separate from content
// promotion.
//
// Usage (once approved): node scripts/apply-1594-promotion.js /path/to/boardready.db

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const QUESTION_ID = 1594;
const EXPECTED_UID = 'icse-mathematics-angle-and-cyclic-properties-of-circle-1adba987';
const EXPECTED_STATUS_BEFORE = 'transcribed';
const EXPECTED_ANSWER_STATUS_BEFORE = 'source_provided';
const EXPECTED_ANSWER_KEY_REF_BEFORE = null;
const EXPECTED_DIAGRAM_STATUS = 'needs_visual_review';
const EXPECTED_CORRECT = 2;
const EXPECTED_OPTIONS_JSON = '["125°","35°","20°","55°"]';

const NEW_STATUS = 'verified';
const NEW_ANSWER_STATUS = 'verified';
const NEW_ANSWER_KEY_REF = 'No printed answer key exists in chap_17.pdf; independently verified by two cross-checking geometric derivations (transversal via AD, transversal via BC), both giving 20deg/index2, matching the stored value. See docs/workstream-3e-geometry-content-qa-1594-1230.md.';

// Every column that must be byte-identical before and after — everything
// except `status`, `answer_status`, and `answer_key_ref`, the three columns
// this script intentionally changes.
const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'marks',
  'text', 'normalized_text', 'options_json', 'parts_json', 'correct', 'explanation', 'source',
  'source_page', 'source_question_number', 'question_type', 'source_section',
  'question_format', 'created_at', 'source_document_id', 'diagram_status',
];

console.log(`[PROPOSAL ONLY -- confirm approval before running] Target database: ${DB_PATH}`);
console.log(`Would promote question ${QUESTION_ID}: status ${EXPECTED_STATUS_BEFORE} -> ${NEW_STATUS}, answer_status ${EXPECTED_ANSWER_STATUS_BEFORE} -> ${NEW_ANSWER_STATUS}, answer_key_ref null -> evidence-trail citation.\n`);

const db = new DatabaseSync(DB_PATH); // NOT readOnly -- this script performs a real write when run.

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
  if (beforeQ.status !== EXPECTED_STATUS_BEFORE) {
    throw new Error(`status has changed since this proposal was drafted (expected '${EXPECTED_STATUS_BEFORE}', found '${beforeQ.status}') — aborting.`);
  }
  if (beforeQ.answer_status !== EXPECTED_ANSWER_STATUS_BEFORE) {
    throw new Error(`answer_status has changed since this proposal was drafted (expected '${EXPECTED_ANSWER_STATUS_BEFORE}', found '${beforeQ.answer_status}') — aborting.`);
  }
  if (beforeQ.answer_key_ref !== EXPECTED_ANSWER_KEY_REF_BEFORE) {
    throw new Error(`answer_key_ref has changed since this proposal was drafted (expected null, found '${beforeQ.answer_key_ref}') — aborting.`);
  }
  if (beforeQ.diagram_status !== EXPECTED_DIAGRAM_STATUS) {
    throw new Error(`diagram_status has changed since this proposal was drafted (expected '${EXPECTED_DIAGRAM_STATUS}', found '${beforeQ.diagram_status}') — aborting.`);
  }
  if (Number(beforeQ.correct) !== EXPECTED_CORRECT) {
    throw new Error(`correct has changed since this proposal was drafted (expected ${EXPECTED_CORRECT}, found ${beforeQ.correct}) — aborting.`);
  }
  if (beforeQ.options_json !== EXPECTED_OPTIONS_JSON) {
    throw new Error(`options_json has changed since this proposal was drafted — aborting.`);
  }

  const updateStmt = db.prepare('UPDATE questions SET status = ?, answer_status = ?, answer_key_ref = ? WHERE id = ? AND status = ? AND answer_status = ?');
  const updateInfo = updateStmt.run(NEW_STATUS, NEW_ANSWER_STATUS, NEW_ANSWER_KEY_REF, QUESTION_ID, EXPECTED_STATUS_BEFORE, EXPECTED_ANSWER_STATUS_BEFORE);
  if (updateInfo.changes !== 1) {
    throw new Error(`expected exactly 1 row changed, got ${updateInfo.changes} — aborting, rolling back.`);
  }

  const afterQ = snapshotQuestion(QUESTION_ID);
  for (const col of QUESTION_COLUMNS) {
    if (String(beforeQ[col]) !== String(afterQ[col])) {
      throw new Error(`unexpected change in questions.${col} (before=${beforeQ[col]}, after=${afterQ[col]}) — aborting, rolling back.`);
    }
  }
  if (afterQ.status !== NEW_STATUS || afterQ.answer_status !== NEW_ANSWER_STATUS || afterQ.answer_key_ref !== NEW_ANSWER_KEY_REF) {
    throw new Error('post-write values do not match expected new values — aborting, rolling back.');
  }

  db.exec('COMMIT');
  console.log('COMMIT successful.\n');
  console.log('status:', beforeQ.status, '->', afterQ.status);
  console.log('answer_status:', beforeQ.answer_status, '->', afterQ.answer_status);
  console.log('answer_key_ref:', beforeQ.answer_key_ref, '->', afterQ.answer_key_ref);
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}

db.close();
