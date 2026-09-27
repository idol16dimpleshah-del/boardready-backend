// One-time, reviewed correction script for Workstream 3B — closes the
// question-3070 pilot per docs/workstream-3b-3070-live-association-
// correction-record.md: inserts the two visual_assets rows (source_cropped
// + ai_generated) documented there and updates questions.id=3070's
// diagram_status from 'source_diagram_preserved' to 'adapted_verified'.
// Nothing else is touched — the pre-existing source_page_full row
// (visual_assets.id=23) is read back and verified byte-identical, never
// modified. Same guarded-transaction discipline as
// scripts/apply-workstream3a-corrections.js: every write is guarded by a
// WHERE clause matching the exact expected prior state, checked for
// info.changes === 1, and every untouched column is re-verified byte-
// identical afterward. NOT a general-purpose or reusable tool — hardcoded
// to this one approved change and should not be run again after use.
//
// Usage: node scripts/apply-3070-visual-association.js /path/to/boardready.db

const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');
const BACKEND_ROOT = path.join(__dirname, '..');

const QUESTION_ID = 3070;
const EXPECTED_UID = 'icse-mathematics-linear-inequation-ace0c077';
const EXPECTED_DIAGRAM_STATUS_BEFORE = 'source_diagram_preserved';
const NEW_DIAGRAM_STATUS = 'adapted_verified';

const NEW_ASSETS = [
  {
    asset_type: 'source_cropped',
    asset_path: 'extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-CANDIDATE.png',
    figure_label: 'Number line, item 57 (p.4.8)',
    notes: "Unmodified crop of the original source figure. Provenance/reference only — not the default student-facing visual once an ai_generated row exists for this question.",
    expectedSha256: 'eff45f7714fd908cab666a548090d01d03646f2062ebad08b25caf601feedaa9',
  },
  {
    asset_type: 'ai_generated',
    asset_path: 'extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-GENERATED.svg',
    figure_label: 'Number line, item 57 (p.4.8)',
    notes: "Board Ready native redraw of the source_cropped figure for this question. Colors are read from the host page's own CSS custom properties at render time (see public/app.js's loadDiagram). Semantic content (9 filled solution points -3..5, one open boundary at -4, one unmarked axis tick at 6) verified against the source scan and the answer key — see docs/workstream-3b-3070-generated-visual-provenance-and-qa.md Section 5.",
    expectedSha256: 'b80c695b42e34a7c04ace19caf4ff7d0b802e40b27e860edff0c1ee50017f26d',
  },
];

const SOURCE_FILE_ID = 99;

const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'status', 'marks',
  'text', 'normalized_text', 'options_json', 'correct', 'parts_json', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id',
  // diagram_status deliberately excluded — it's the one column this script
  // intentionally changes; every other column above must be byte-identical.
];

function sha256File(p) {
  return require('node:crypto').createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

console.log(`Target database: ${DB_PATH}`);
console.log(`Closing the 3070 visual pilot: 2 visual_assets INSERTs + 1 diagram_status UPDATE. No other row will be touched.\n`);

// Pre-flight: confirm both asset files exist on disk with the expected
// hashes BEFORE opening any transaction — a missing/changed file is a
// reason to abort outright, not something a DB rollback needs to handle.
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

const db = new DatabaseSync(DB_PATH); // NOT readOnly — this is the one deliberate, reviewed write.

function snapshotQuestion(id) {
  return db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
}
function snapshotVisualAssets(questionId) {
  return db.prepare('SELECT * FROM visual_assets WHERE question_id = ? ORDER BY id').all(questionId);
}

db.exec('BEGIN IMMEDIATE');
try {
  const beforeQ = snapshotQuestion(QUESTION_ID);
  if (!beforeQ) throw new Error(`question id ${QUESTION_ID} not found — aborting.`);
  if (beforeQ.question_uid !== EXPECTED_UID) {
    throw new Error(`question_uid mismatch (expected ${EXPECTED_UID}, found ${beforeQ.question_uid}) — aborting.`);
  }
  if (beforeQ.diagram_status !== EXPECTED_DIAGRAM_STATUS_BEFORE) {
    throw new Error(`diagram_status has changed since the correction record was written (expected '${EXPECTED_DIAGRAM_STATUS_BEFORE}', found '${beforeQ.diagram_status}') — aborting.`);
  }

  const beforeAssets = snapshotVisualAssets(QUESTION_ID);
  if (beforeAssets.length !== 1 || beforeAssets[0].asset_type !== 'source_page_full') {
    throw new Error(`unexpected pre-existing visual_assets state for question ${QUESTION_ID} (expected exactly 1 row, asset_type='source_page_full'; found ${JSON.stringify(beforeAssets)}) — aborting.`);
  }
  const preExistingRow = beforeAssets[0];
  // Reject outright if either new asset_path is already present for this
  // question — running this script twice must not create duplicate rows.
  for (const a of NEW_ASSETS) {
    if (beforeAssets.some((row) => row.asset_path === a.asset_path)) {
      throw new Error(`a visual_assets row for ${a.asset_path} already exists for question ${QUESTION_ID} — aborting (this script may have already been run).`);
    }
  }

  const insertStmt = db.prepare(`
    INSERT INTO visual_assets (question_id, source_file_id, asset_type, asset_path, figure_label, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  const insertedIds = [];
  for (const a of NEW_ASSETS) {
    const info = insertStmt.run(QUESTION_ID, SOURCE_FILE_ID, a.asset_type, a.asset_path, a.figure_label, a.notes);
    insertedIds.push(Number(info.lastInsertRowid));
  }

  const updateStmt = db.prepare(`UPDATE questions SET diagram_status = ? WHERE id = ? AND diagram_status = ?`);
  const updateInfo = updateStmt.run(NEW_DIAGRAM_STATUS, QUESTION_ID, EXPECTED_DIAGRAM_STATUS_BEFORE);
  if (updateInfo.changes !== 1) {
    throw new Error(`expected exactly 1 row changed by the diagram_status UPDATE, got ${updateInfo.changes} — aborting, rolling back.`);
  }

  // ---- Verification (still inside the transaction) ----
  const afterQ = snapshotQuestion(QUESTION_ID);
  for (const col of QUESTION_COLUMNS) {
    if (String(beforeQ[col]) !== String(afterQ[col])) {
      throw new Error(`unexpected change in questions.${col} (before=${beforeQ[col]}, after=${afterQ[col]}) — aborting, rolling back.`);
    }
  }
  if (afterQ.diagram_status !== NEW_DIAGRAM_STATUS) {
    throw new Error(`diagram_status after write does not match expected new value (expected ${NEW_DIAGRAM_STATUS}, got ${afterQ.diagram_status}) — aborting, rolling back.`);
  }

  const afterAssets = snapshotVisualAssets(QUESTION_ID);
  if (afterAssets.length !== 3) {
    throw new Error(`expected exactly 3 visual_assets rows for question ${QUESTION_ID} after write, found ${afterAssets.length} — aborting, rolling back.`);
  }
  const stillPreExisting = afterAssets.find((r) => r.id === preExistingRow.id);
  for (const col of Object.keys(preExistingRow)) {
    if (String(stillPreExisting[col]) !== String(preExistingRow[col])) {
      throw new Error(`pre-existing visual_assets row (id=${preExistingRow.id}) changed in column '${col}' — aborting, rolling back.`);
    }
  }
  for (const a of NEW_ASSETS) {
    const row = afterAssets.find((r) => r.asset_path === a.asset_path);
    if (!row) throw new Error(`inserted row for ${a.asset_path} not found on read-back — aborting, rolling back.`);
    if (row.question_id !== QUESTION_ID || row.source_file_id !== SOURCE_FILE_ID || row.asset_type !== a.asset_type || row.figure_label !== a.figure_label || row.notes !== a.notes) {
      throw new Error(`inserted row for ${a.asset_path} does not match expected values on read-back — aborting, rolling back. Got: ${JSON.stringify(row)}`);
    }
  }

  db.exec('COMMIT');
  console.log('COMMIT successful.\n');
  console.log('diagram_status:', beforeQ.diagram_status, '->', afterQ.diagram_status);
  console.log('\nNew visual_assets rows:');
  for (const a of NEW_ASSETS) {
    const row = afterAssets.find((r) => r.asset_path === a.asset_path);
    console.log(`  id=${row.id} asset_type=${row.asset_type} asset_path=${row.asset_path}`);
  }
  console.log(`\nPre-existing row (id=${preExistingRow.id}, asset_type=source_page_full) confirmed unchanged.`);
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}

db.close();
