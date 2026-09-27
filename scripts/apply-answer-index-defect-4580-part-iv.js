// Batch 15, Task 5 (5 of 5). Corrects question 4580's case part (iv) only
// per docs/workstream-4e-answer-index-defects-batch.md. Scope: parts_json[3]
// ("iv")'s `correct` field (2 -> 1) ONLY. Parts (i), (ii), (iii), (v) are
// independently re-verified correct and must remain byte-identical.
//
// Usage: node scripts/apply-answer-index-defect-4580-part-iv.js /path/to/boardready.db

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');
const QUESTION_ID = 4580;
const EXPECTED_UID = 'cbse-mathematics-polynomials-03cd6312';
const PART_INDEX = 3; // 0-based: (i)=0,(ii)=1,(iii)=2,(iv)=3,(v)=4
const EXPECTED_PART_TEXT_PREFIX = '(iv) The representation of the Highway Underpass';
const EXPECTED_PART_OPTIONS_JSON = ["x² - 6x + 2","x² - 36","x² - 6","x² - 3"];
const EXPECTED_PART_CORRECT_BEFORE = 2;
const NEW_PART_CORRECT = 1;
const EXPECTED_STATUS = 'transcribed';
const EXPECTED_ANSWER_STATUS = 'verified';

const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'status', 'marks',
  'text', 'normalized_text', 'options_json', 'correct', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id', 'diagram_status',
  // parts_json deliberately excluded -- the one column this script changes,
  // and only one element within it.
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Correcting question ${QUESTION_ID} case part index ${PART_INDEX} ("iv"): correct ${EXPECTED_PART_CORRECT_BEFORE} -> ${NEW_PART_CORRECT}\n`);

const db = new DatabaseSync(DB_PATH);
function snapshotQuestion(id) { return db.prepare('SELECT * FROM questions WHERE id = ?').get(id); }

db.exec('BEGIN IMMEDIATE');
try {
  const beforeQ = snapshotQuestion(QUESTION_ID);
  if (!beforeQ) throw new Error(`question id ${QUESTION_ID} not found — aborting.`);
  if (beforeQ.question_uid !== EXPECTED_UID) throw new Error(`question_uid mismatch — aborting.`);
  if (beforeQ.status !== EXPECTED_STATUS || beforeQ.answer_status !== EXPECTED_ANSWER_STATUS) throw new Error(`status/answer_status has changed — aborting.`);

  const partsBefore = JSON.parse(beforeQ.parts_json);
  if (!Array.isArray(partsBefore) || partsBefore.length !== 5) {
    throw new Error(`expected exactly 5 parts, found ${partsBefore && partsBefore.length} — aborting.`);
  }
  const targetPart = partsBefore[PART_INDEX];
  if (!targetPart.text.startsWith(EXPECTED_PART_TEXT_PREFIX)) {
    throw new Error(`part ${PART_INDEX}'s text does not match expected prefix — aborting. Found: ${targetPart.text}`);
  }
  if (JSON.stringify(targetPart.options) !== JSON.stringify(EXPECTED_PART_OPTIONS_JSON)) {
    throw new Error(`part ${PART_INDEX}'s options have changed — aborting.`);
  }
  if (Number(targetPart.correct) !== EXPECTED_PART_CORRECT_BEFORE) {
    throw new Error(`part ${PART_INDEX}'s correct has changed (expected ${EXPECTED_PART_CORRECT_BEFORE}, found ${targetPart.correct}) — aborting.`);
  }

  // Build the new parts array: every part byte-for-byte identical except
  // part[PART_INDEX].correct.
  const partsAfter = partsBefore.map((p, i) => (i === PART_INDEX ? { ...p, correct: NEW_PART_CORRECT } : p));
  const newPartsJson = JSON.stringify(partsAfter);

  const updateInfo = db.prepare('UPDATE questions SET parts_json = ? WHERE id = ? AND parts_json = ?').run(newPartsJson, QUESTION_ID, beforeQ.parts_json);
  if (updateInfo.changes !== 1) throw new Error(`expected exactly 1 row changed, got ${updateInfo.changes} — aborting, rolling back.`);

  const afterQ = snapshotQuestion(QUESTION_ID);
  for (const col of QUESTION_COLUMNS) {
    if (String(beforeQ[col]) !== String(afterQ[col])) throw new Error(`unexpected change in questions.${col} — aborting, rolling back.`);
  }
  const partsAfterReadback = JSON.parse(afterQ.parts_json);
  for (let i = 0; i < 5; i++) {
    if (i === PART_INDEX) continue;
    if (JSON.stringify(partsAfterReadback[i]) !== JSON.stringify(partsBefore[i])) {
      throw new Error(`part ${i} unexpectedly changed — aborting, rolling back.`);
    }
  }
  if (Number(partsAfterReadback[PART_INDEX].correct) !== NEW_PART_CORRECT) {
    throw new Error('post-write part correct mismatch — aborting, rolling back.');
  }
  if (JSON.stringify(partsAfterReadback[PART_INDEX].options) !== JSON.stringify(EXPECTED_PART_OPTIONS_JSON) ||
      partsAfterReadback[PART_INDEX].text !== targetPart.text ||
      partsAfterReadback[PART_INDEX].marks !== targetPart.marks) {
    throw new Error('post-write part fields other than correct unexpectedly changed — aborting, rolling back.');
  }

  db.exec('COMMIT');
  console.log('COMMIT successful.\n');
  console.log(`part[${PART_INDEX}].correct:`, EXPECTED_PART_CORRECT_BEFORE, '->', NEW_PART_CORRECT);
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}
db.close();
