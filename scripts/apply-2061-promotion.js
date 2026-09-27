// Batch 15A, Task 6. Promotes question 2061's publication status per
// docs/workstream-5c-2061-promotion-correction-record.md. Scope of this
// write: `status` (transcribed -> verified) and `answer_status`
// (source_provided -> verified) ONLY. diagram_status is untouched here --
// visual association is a separate, later guarded write.
//
// Usage: node scripts/apply-2061-promotion.js /path/to/boardready.db

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const QUESTION_ID = 2061;
const EXPECTED_UID = 'icse-chemistry-electrolysis-c018bc46';
const EXPECTED_STATUS_BEFORE = 'transcribed';
const EXPECTED_ANSWER_STATUS_BEFORE = 'source_provided';
const EXPECTED_DIAGRAM_STATUS = 'needs_visual_review';
const EXPECTED_CORRECT = 0;
const EXPECTED_OPTIONS_JSON = JSON.stringify([
  "At the oxidising electrode - the electrons enter the electrolyte & the process is called oxidation.",
  "The ions in solid PbBr2 are held together by an electrostatic force of attraction & hence the crucible is heated from outside, resulting in ions of Pb2+ & Br1- being free.",
  "The electrode reaction at 'Y' is - Pb2+ + 2e- -> Pb.",
  "At 'X' - bromine ions, give up electrons resulting in formation of bromine atoms - which form a covalent bond between atoms, resulting in formation of a bromine molecule.",
]);

const NEW_STATUS = 'verified';
const NEW_ANSWER_STATUS = 'verified';

const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'marks',
  'text', 'normalized_text', 'options_json', 'parts_json', 'correct', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'created_at', 'source_document_id', 'diagram_status',
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting question ${QUESTION_ID}: status ${EXPECTED_STATUS_BEFORE} -> ${NEW_STATUS}, answer_status ${EXPECTED_ANSWER_STATUS_BEFORE} -> ${NEW_ANSWER_STATUS}.\n`);

const db = new DatabaseSync(DB_PATH);
function snapshotQuestion(id) { return db.prepare('SELECT * FROM questions WHERE id = ?').get(id); }

db.exec('BEGIN IMMEDIATE');
try {
  const beforeQ = snapshotQuestion(QUESTION_ID);
  if (!beforeQ) throw new Error(`question id ${QUESTION_ID} not found — aborting.`);
  if (beforeQ.question_uid !== EXPECTED_UID) throw new Error(`question_uid mismatch — aborting.`);
  if (beforeQ.status !== EXPECTED_STATUS_BEFORE) throw new Error(`status has changed (found '${beforeQ.status}') — aborting.`);
  if (beforeQ.answer_status !== EXPECTED_ANSWER_STATUS_BEFORE) throw new Error(`answer_status has changed (found '${beforeQ.answer_status}') — aborting.`);
  if (beforeQ.diagram_status !== EXPECTED_DIAGRAM_STATUS) throw new Error(`diagram_status has changed (found '${beforeQ.diagram_status}') — aborting.`);
  if (Number(beforeQ.correct) !== EXPECTED_CORRECT) throw new Error(`correct has changed (expected ${EXPECTED_CORRECT}, found ${beforeQ.correct}) — aborting.`);
  if (beforeQ.options_json !== EXPECTED_OPTIONS_JSON) throw new Error(`options_json has changed — aborting.`);

  const updateInfo = db.prepare('UPDATE questions SET status = ?, answer_status = ? WHERE id = ? AND status = ? AND answer_status = ?')
    .run(NEW_STATUS, NEW_ANSWER_STATUS, QUESTION_ID, EXPECTED_STATUS_BEFORE, EXPECTED_ANSWER_STATUS_BEFORE);
  if (updateInfo.changes !== 1) throw new Error(`expected exactly 1 row changed, got ${updateInfo.changes} — aborting, rolling back.`);

  const afterQ = snapshotQuestion(QUESTION_ID);
  for (const col of QUESTION_COLUMNS) {
    if (String(beforeQ[col]) !== String(afterQ[col])) throw new Error(`unexpected change in questions.${col} — aborting, rolling back.`);
  }
  if (afterQ.status !== NEW_STATUS || afterQ.answer_status !== NEW_ANSWER_STATUS) throw new Error('post-write values mismatch — aborting, rolling back.');

  db.exec('COMMIT');
  console.log('COMMIT successful.\n');
  console.log('status:', beforeQ.status, '->', afterQ.status);
  console.log('answer_status:', beforeQ.answer_status, '->', afterQ.answer_status);
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}

db.close();
