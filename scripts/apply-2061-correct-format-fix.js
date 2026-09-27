// Batch 15, Task 7. Corrects question 2061's `correct` field format per
// docs/workstream-4g-2061-format-correction-record.md. Scope: `correct`
// only, string "(a)" -> integer 0. Does NOT touch status/answer_status/
// options_json/anything else. Deliberately scoped to id 2061 only -- the
// broader 122-row batch-format finding is documented but explicitly NOT
// bulk-applied here.
//
// Usage: node scripts/apply-2061-correct-format-fix.js /path/to/boardready.db

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');
const QUESTION_ID = 2061;
const EXPECTED_UID = 'icse-chemistry-electrolysis-c018bc46';
const EXPECTED_OPTIONS_JSON = '["At the oxidising electrode - the electrons enter the electrolyte & the process is called oxidation.","The ions in solid PbBr2 are held together by an electrostatic force of attraction & hence the crucible is heated from outside, resulting in ions of Pb2+ & Br1- being free.","The electrode reaction at \'Y\' is - Pb2+ + 2e- -> Pb.","At \'X\' - bromine ions, give up electrons resulting in formation of bromine atoms - which form a covalent bond between atoms, resulting in formation of a bromine molecule."]';
const EXPECTED_CORRECT_BEFORE = '(a)';
const NEW_CORRECT = 0;
const EXPECTED_STATUS = 'transcribed';
const EXPECTED_ANSWER_STATUS = 'source_provided';

const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'status', 'marks',
  'text', 'normalized_text', 'options_json', 'parts_json', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id', 'diagram_status',
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Correcting question ${QUESTION_ID}: correct "${EXPECTED_CORRECT_BEFORE}" -> ${NEW_CORRECT} (format fix, letter -> 0-based index)\n`);

const db = new DatabaseSync(DB_PATH);
function snapshotQuestion(id) { return db.prepare('SELECT * FROM questions WHERE id = ?').get(id); }

db.exec('BEGIN IMMEDIATE');
try {
  const beforeQ = snapshotQuestion(QUESTION_ID);
  if (!beforeQ) throw new Error(`question id ${QUESTION_ID} not found — aborting.`);
  if (beforeQ.question_uid !== EXPECTED_UID) throw new Error(`question_uid mismatch — aborting.`);
  if (beforeQ.options_json !== EXPECTED_OPTIONS_JSON) throw new Error(`options_json has changed — aborting. Found: ${beforeQ.options_json}`);
  if (String(beforeQ.correct) !== EXPECTED_CORRECT_BEFORE) throw new Error(`correct has changed (expected "${EXPECTED_CORRECT_BEFORE}", found ${JSON.stringify(beforeQ.correct)}) — aborting.`);
  if (beforeQ.status !== EXPECTED_STATUS || beforeQ.answer_status !== EXPECTED_ANSWER_STATUS) throw new Error(`status/answer_status has changed — aborting.`);

  const updateInfo = db.prepare('UPDATE questions SET correct = ? WHERE id = ? AND correct = ?').run(NEW_CORRECT, QUESTION_ID, EXPECTED_CORRECT_BEFORE);
  if (updateInfo.changes !== 1) throw new Error(`expected exactly 1 row changed, got ${updateInfo.changes} — aborting, rolling back.`);

  const afterQ = snapshotQuestion(QUESTION_ID);
  for (const col of QUESTION_COLUMNS) {
    if (String(beforeQ[col]) !== String(afterQ[col])) throw new Error(`unexpected change in questions.${col} — aborting, rolling back.`);
  }
  if (Number(afterQ.correct) !== NEW_CORRECT || typeof afterQ.correct !== 'number') {
    throw new Error(`post-write correct mismatch or not an integer (found ${JSON.stringify(afterQ.correct)}) — aborting, rolling back.`);
  }

  db.exec('COMMIT');
  console.log('COMMIT successful.\n');
  console.log('correct:', JSON.stringify(beforeQ.correct), '->', afterQ.correct);
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}
db.close();
