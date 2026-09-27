// One-time, reviewed, two-row correction script for Workstream 3A.
// Applies EXACTLY the two evidence-backed transcription corrections approved
// in docs/workstream-3a-correction-record-3033-3070.md — question ids 3033
// and 3070 — and nothing else. Each UPDATE is guarded by a WHERE clause that
// matches the exact current (mis-transcribed) value recorded in that
// document, so the statement simply fails to match (0 rows changed) if the
// live data has since diverged from what was reviewed, rather than
// silently overwriting something else. This is NOT a general-purpose or
// reusable audit-correction tool — it is intentionally hardcoded to this
// one approved change set and should not be run again after use.
//
// Usage: node scripts/apply-workstream3a-corrections.js /path/to/boardready.db

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CORRECTIONS = [
  {
    id: 3033,
    uid: 'icse-mathematics-linear-inequation-02454b78',
    before: '["{0,1,2,3}","{...,-2,-1,0,1,2,3}","{...,-2,-1,0,1,2,3}","{...,-2,-1,1,2,3}"]',
    after: '["{0,1,2,3}","{...,-2,-1,0,1,3}","{...,-2,-1,0,1,2,3}","{...,-2,-1,1,2,3}"]',
  },
  {
    id: 3070,
    uid: 'icse-mathematics-linear-inequation-ace0c077',
    before: '["{x∈Z, -4<x<5}","{x∈Z, -4<x≤5}","{x∈R, -4≤x≤5}","{x∈R, -4≤x≤5}"]',
    after: '["{x∈Z, -4<x<5}","{x∈Z, -4<x≤5}","{x∈R, -4≤x≤5}","{x∈R, -4≤x<5}"]',
  },
];

const db = new DatabaseSync(DB_PATH); // NOT readOnly — this is the one deliberate, reviewed write.

const COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'status', 'marks', 'text', 'correct',
  'explanation', 'source', 'source_page', 'source_question_number', 'answer_key_ref',
  'question_type', 'source_section', 'question_format', 'answer_status', 'created_at',
  'source_document_id', 'diagram_status',
];

function snapshot(id) {
  return db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
}

console.log(`Target database: ${DB_PATH}`);
console.log('Applying 2 approved corrections (ids 3033, 3070). No other row will be touched.\n');

const results = [];

const txn = db.prepare('SELECT 1'); // sqlite node binding: use explicit BEGIN/COMMIT below
db.exec('BEGIN IMMEDIATE');
try {
  for (const c of CORRECTIONS) {
    const before = snapshot(c.id);
    if (!before) throw new Error(`id ${c.id} not found — aborting, no changes committed.`);
    if (before.question_uid !== c.uid) {
      throw new Error(`id ${c.id} question_uid mismatch (expected ${c.uid}, found ${before.question_uid}) — aborting.`);
    }
    if (before.options_json !== c.before) {
      throw new Error(`id ${c.id} options_json has changed since the correction record was written (expected ${c.before}, found ${before.options_json}) — aborting, no changes committed.`);
    }

    const stmt = db.prepare('UPDATE questions SET options_json = ? WHERE id = ? AND options_json = ?');
    const info = stmt.run(c.after, c.id, c.before);
    if (info.changes !== 1) {
      throw new Error(`id ${c.id}: expected exactly 1 row changed, got ${info.changes} — aborting, rolling back.`);
    }

    const after = snapshot(c.id);
    // Verify every other column is byte-identical to before.
    for (const col of COLUMNS) {
      if (String(before[col]) !== String(after[col])) {
        throw new Error(`id ${c.id}: unexpected change in column '${col}' (before=${before[col]}, after=${after[col]}) — aborting, rolling back.`);
      }
    }
    if (after.options_json !== c.after) {
      throw new Error(`id ${c.id}: options_json after write does not match expected new value — aborting, rolling back.`);
    }

    results.push({ id: c.id, uid: c.uid, before: before.options_json, after: after.options_json, correct: after.correct, status: after.status });
    console.log(`OK — id ${c.id} (${c.uid})`);
    console.log(`  before: ${before.options_json}`);
    console.log(`  after:  ${after.options_json}`);
  }
  db.exec('COMMIT');
  console.log('\nCOMMIT successful. 2 rows changed, exactly the 2 approved corrections.');
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}

db.close();

if (!process.exitCode) {
  console.log('\nJSON summary:');
  console.log(JSON.stringify(results, null, 2));
}
