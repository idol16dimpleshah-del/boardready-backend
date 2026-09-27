// Batch 15A, Task 9. Associates 1727's already-built, browser-QA'd visual
// (Batch 15 Task 12) per
// docs/workstream-5f-1727-visual-association-correction-record.md: inserts
// two visual_assets rows (source_cropped + ai_generated) and updates
// questions.id=1727's diagram_status from 'needs_visual_review' to
// 'adapted_verified'. Gated on the content-promotion (Task 8) having
// already succeeded.
//
// Usage: node scripts/apply-1727-visual-association.js /path/to/boardready.db

const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');
const BACKEND_ROOT = path.join(__dirname, '..');

const QUESTION_ID = 1727;
const EXPECTED_UID = 'icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6';
const EXPECTED_DIAGRAM_STATUS_BEFORE = 'needs_visual_review';
const NEW_DIAGRAM_STATUS = 'adapted_verified';
const SOURCE_FILE_ID = 14; // ICSE Mathematics, chap_20.pdf

const NEW_ASSETS = [
  {
    asset_type: 'source_cropped',
    asset_path: 'extracted-diagrams/icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6-item21-tworectanglecylinders-CANDIDATE.png',
    figure_label: 'item (21), chap_20.pdf p.20.5',
    notes: 'Unmodified crop of the original source figure. Provenance/reference only -- not the default student-facing visual once an ai_generated row exists for this question.',
    expectedSha256: '6dfa675d3e8a8805ab8d03cced33e66bd9ec408f9c9c2e40abb6ab80e5ca5581',
  },
  {
    asset_type: 'ai_generated',
    asset_path: 'extracted-diagrams/icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6-item21-tworectanglecylinders-GENERATED.svg',
    figure_label: 'item (21), chap_20.pdf p.20.5',
    notes: 'Board Ready native redraw. Browser-tested 8/8 combinations in Batch 15 Task 12 -- see docs/workstream-4m-1727-visual-provenance-and-qa.md.',
    expectedSha256: '56adf5e3f5627bd82e20015eea40c44f27662b73ba09c3dd342ce9d96939e59c',
  },
];

const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'status', 'marks',
  'text', 'normalized_text', 'options_json', 'correct', 'parts_json', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id',
  // diagram_status deliberately excluded -- the one column this script changes.
];

function sha256File(p) {
  return require('node:crypto').createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

console.log(`Target database: ${DB_PATH}`);
console.log('Associating 1727\'s visual: 2 visual_assets INSERTs + 1 diagram_status UPDATE.\n');

for (const a of NEW_ASSETS) {
  const full = path.join(BACKEND_ROOT, a.asset_path);
  if (!fs.existsSync(full)) {
    console.error(`ABORT — asset file does not exist on disk: ${a.asset_path}`);
    process.exit(1);
  }
  const actual = sha256File(full);
  if (actual !== a.expectedSha256) {
    console.error(`ABORT — asset file hash mismatch for ${a.asset_path}\n  expected: ${a.expectedSha256}\n  actual:   ${actual}`);
    process.exit(1);
  }
}
console.log('Pre-flight OK: both asset files exist on disk with the expected hashes.\n');

const db = new DatabaseSync(DB_PATH);

function snapshotQuestion(id) { return db.prepare('SELECT * FROM questions WHERE id = ?').get(id); }
function snapshotVisualAssets(questionId) { return db.prepare('SELECT * FROM visual_assets WHERE question_id = ? ORDER BY id').all(questionId); }

db.exec('BEGIN IMMEDIATE');
try {
  const beforeQ = snapshotQuestion(QUESTION_ID);
  if (!beforeQ) throw new Error(`question id ${QUESTION_ID} not found — aborting.`);
  if (beforeQ.question_uid !== EXPECTED_UID) throw new Error(`question_uid mismatch — aborting.`);
  if (beforeQ.diagram_status !== EXPECTED_DIAGRAM_STATUS_BEFORE) throw new Error(`diagram_status has changed (found '${beforeQ.diagram_status}') — aborting.`);
  if (beforeQ.answer_status !== 'verified') throw new Error(`answer_status is not 'verified' (found '${beforeQ.answer_status}') — content gate not satisfied; aborting.`);
  if (beforeQ.status !== 'verified') throw new Error(`status is not 'verified' (found '${beforeQ.status}') — content gate not satisfied; aborting.`);

  const beforeAssets = snapshotVisualAssets(QUESTION_ID);
  if (beforeAssets.length !== 0) throw new Error(`expected zero pre-existing visual_assets rows, found ${beforeAssets.length} — aborting.`);

  const insertStmt = db.prepare(`
    INSERT INTO visual_assets (question_id, source_file_id, asset_type, asset_path, figure_label, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  for (const a of NEW_ASSETS) {
    insertStmt.run(QUESTION_ID, SOURCE_FILE_ID, a.asset_type, a.asset_path, a.figure_label, a.notes);
  }

  const updateInfo = db.prepare(`UPDATE questions SET diagram_status = ? WHERE id = ? AND diagram_status = ?`)
    .run(NEW_DIAGRAM_STATUS, QUESTION_ID, EXPECTED_DIAGRAM_STATUS_BEFORE);
  if (updateInfo.changes !== 1) throw new Error(`expected exactly 1 row changed by diagram_status UPDATE, got ${updateInfo.changes} — aborting, rolling back.`);

  const afterQ = snapshotQuestion(QUESTION_ID);
  for (const col of QUESTION_COLUMNS) {
    if (String(beforeQ[col]) !== String(afterQ[col])) throw new Error(`unexpected change in questions.${col} — aborting, rolling back.`);
  }
  if (afterQ.diagram_status !== NEW_DIAGRAM_STATUS) throw new Error('diagram_status after write mismatch — aborting, rolling back.');

  const afterAssets = snapshotVisualAssets(QUESTION_ID);
  if (afterAssets.length !== 2) throw new Error(`expected exactly 2 visual_assets rows after write, found ${afterAssets.length} — aborting, rolling back.`);
  for (const a of NEW_ASSETS) {
    const row = afterAssets.find((r) => r.asset_path === a.asset_path);
    if (!row) throw new Error(`inserted row for ${a.asset_path} not found on read-back — aborting, rolling back.`);
    if (row.question_id !== QUESTION_ID || row.source_file_id !== SOURCE_FILE_ID || row.asset_type !== a.asset_type || row.figure_label !== a.figure_label || row.notes !== a.notes) {
      throw new Error(`inserted row for ${a.asset_path} does not match expected values — aborting, rolling back. Got: ${JSON.stringify(row)}`);
    }
  }

  db.exec('COMMIT');
  console.log('COMMIT successful.\n');
  console.log('diagram_status:', beforeQ.diagram_status, '->', afterQ.diagram_status);
  for (const a of NEW_ASSETS) {
    const row = afterAssets.find((r) => r.asset_path === a.asset_path);
    console.log(`  inserted id=${row.id} asset_type=${row.asset_type}`);
  }
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}

db.close();
