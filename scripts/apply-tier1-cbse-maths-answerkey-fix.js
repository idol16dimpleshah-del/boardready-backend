// One-time, reviewed correction script — Tier 1 of the CBSE Maths
// production-changeset proposal (docs/workstream-6d-cbse-maths-production-changeset-proposal.md).
// Fixes the `questions.correct` answer-key index on exactly 6 rows, each
// independently re-derived blind by the Head model (shown only the question
// and options, never the stored value) during Run 2
// (wf_2396414e-fbf) and re-confirmed in the narrow re-check
// (wf_ea6c83ba-271), then hand-verified again against the underlying math.
//
// Explicitly authorized: "AUTHORIZE STEP 4 — TIER 1 ONLY" (user message,
// 2026-09-27). Scope is deliberately narrow — 6 rows, 1 column each,
// `correct` only:
//   4589: 1 -> 3
//   4676: 2 -> 1
//   4811: 0 -> 3
//   4816: 0 -> 2
//   4820: 0 -> 1
//   4827: 0 -> 1
//
// Does NOT touch: options_json, text, explanation, source/provenance
// fields, status, answer_status, diagram_status, or any other column, on
// these rows or any other row. Does NOT touch Tier 2 (4352, 4404, 4516,
// 4646, 4780), Tier 3 (4517, 4519, 4687), or any of the 6 duplicate pairs.
//
// Same guarded-transaction discipline as every prior correction script in
// this project (see scripts/apply-4575-correct-answer-fix.js): every row's
// exact expected prior state is checked before any write; the UPDATE
// itself is guarded by a WHERE clause requiring that exact prior value;
// info.changes === 1 is required per row; every untouched column is
// re-verified byte-identical after, for all 6 rows AND for a broader
// unexpected-changed-row check across the whole table. All 6 changes are
// applied inside ONE transaction — either all 6 land or none do.
//
// NOT a general-purpose or reusable tool — hardcoded to this one approved
// changeset and should not be run again after use.
//
// Usage: node scripts/apply-tier1-cbse-maths-answerkey-fix.js /path/to/boardready.db

const path = require('node:path');
const crypto = require('node:crypto');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

// Every column that must be byte-identical before and after, for each of
// the 6 target rows — everything except `correct`, the one column this
// script intentionally changes.
const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'status', 'marks',
  'text', 'normalized_text', 'options_json', 'parts_json', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id', 'diagram_status',
];

const TARGETS = [
  { id: 4589, expectedUid: 'cbse-mathematics-polynomials-a6d26fd2', before: 1, after: 3 },
  { id: 4676, expectedUid: 'cbse-mathematics-quadratic-equations-cfbaaee5', before: 2, after: 1 },
  { id: 4811, expectedUid: 'cbse-mathematics-co-ordinate-geometry-774a9ea6', before: 0, after: 3 },
  { id: 4816, expectedUid: 'cbse-mathematics-co-ordinate-geometry-c8862b6d', before: 0, after: 2 },
  { id: 4820, expectedUid: 'cbse-mathematics-co-ordinate-geometry-626fd04e', before: 0, after: 1 },
  { id: 4827, expectedUid: 'cbse-mathematics-co-ordinate-geometry-ec5426fe', before: 0, after: 1 },
];
const EXPECTED_STATUS = 'transcribed';
const EXPECTED_ANSWER_STATUS = 'verified';

function sha256File(p) {
  return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
}

console.log(`Target database: ${DB_PATH}`);
console.log(`SHA-256 before: ${sha256File(DB_PATH)}`);
console.log(`Applying 6 mechanical answer-key corrections (Tier 1 only). No other row or column will be touched.\n`);

const db = new DatabaseSync(DB_PATH); // NOT readOnly — this is the one deliberate, reviewed write.

function snapshotQuestion(id) {
  return db.prepare('SELECT * FROM questions WHERE id = ?').get(id);
}
function snapshotAllIds() {
  return db.prepare('SELECT id FROM questions ORDER BY id').all().map((r) => r.id);
}
function rowHash(row) {
  // Order-independent-enough for our purposes: stable column list, joined.
  return QUESTION_COLUMNS.concat(['correct']).map((c) => `${c}=${String(row[c])}`).join('|');
}

const beforeSnapshots = {};
const afterSnapshots = {};
const beforeAllIds = snapshotAllIds();
const beforeAllRowHashes = {};
for (const id of beforeAllIds) beforeAllRowHashes[id] = rowHash(snapshotQuestion(id));

const diffs = [];

db.exec('BEGIN IMMEDIATE');
try {
  // ---- Pre-write guard: every target row must exactly match the proposal ----
  for (const t of TARGETS) {
    const beforeQ = snapshotQuestion(t.id);
    if (!beforeQ) throw new Error(`question id ${t.id} not found — aborting.`);
    if (beforeQ.question_uid !== t.expectedUid) {
      throw new Error(`id ${t.id}: question_uid mismatch (expected ${t.expectedUid}, found ${beforeQ.question_uid}) — aborting.`);
    }
    if (Number(beforeQ.correct) !== t.before) {
      throw new Error(`id ${t.id}: correct has changed since the changeset was written (expected ${t.before}, found ${beforeQ.correct}) — aborting.`);
    }
    if (beforeQ.status !== EXPECTED_STATUS) {
      throw new Error(`id ${t.id}: status has changed (expected '${EXPECTED_STATUS}', found '${beforeQ.status}') — aborting.`);
    }
    if (beforeQ.answer_status !== EXPECTED_ANSWER_STATUS) {
      throw new Error(`id ${t.id}: answer_status has changed (expected '${EXPECTED_ANSWER_STATUS}', found '${beforeQ.answer_status}') — aborting.`);
    }
    beforeSnapshots[t.id] = beforeQ;
  }

  // ---- Guarded writes, one per row, all inside this single transaction ----
  for (const t of TARGETS) {
    const updateInfo = db.prepare('UPDATE questions SET correct = ? WHERE id = ? AND correct = ?')
      .run(t.after, t.id, t.before);
    if (updateInfo.changes !== 1) {
      throw new Error(`id ${t.id}: expected exactly 1 row changed, got ${updateInfo.changes} — aborting, rolling back.`);
    }
  }

  // ---- Per-row verification: every non-`correct` column byte-identical, correct matches new value ----
  for (const t of TARGETS) {
    const afterQ = snapshotQuestion(t.id);
    const beforeQ = beforeSnapshots[t.id];
    for (const col of QUESTION_COLUMNS) {
      if (String(beforeQ[col]) !== String(afterQ[col])) {
        throw new Error(`id ${t.id}: unexpected change in questions.${col} (before=${beforeQ[col]}, after=${afterQ[col]}) — aborting, rolling back.`);
      }
    }
    if (Number(afterQ.correct) !== t.after) {
      throw new Error(`id ${t.id}: correct after write does not match expected new value (expected ${t.after}, got ${afterQ.correct}) — aborting, rolling back.`);
    }
    afterSnapshots[t.id] = afterQ;
    diffs.push({ id: t.id, uid: t.expectedUid, correctBefore: beforeQ.correct, correctAfter: afterQ.correct });
  }

  // ---- Table-wide verification: no row other than the 6 targets changed ----
  const afterAllIds = snapshotAllIds();
  if (afterAllIds.length !== beforeAllIds.length || afterAllIds.some((id, i) => id !== beforeAllIds[i])) {
    throw new Error('row set (ids) in questions table changed — no row should have been inserted or deleted — aborting, rolling back.');
  }
  const targetIdSet = new Set(TARGETS.map((t) => t.id));
  let unexpectedChangedCount = 0;
  const unexpectedChangedIds = [];
  for (const id of afterAllIds) {
    const afterHash = rowHash(snapshotQuestion(id));
    const beforeHash = beforeAllRowHashes[id];
    const changed = afterHash !== beforeHash;
    if (changed && !targetIdSet.has(id)) {
      unexpectedChangedCount += 1;
      unexpectedChangedIds.push(id);
    }
    if (!changed && targetIdSet.has(id)) {
      throw new Error(`id ${id}: expected to have changed (it is a Tier 1 target) but row hash is identical before/after — aborting, rolling back.`);
    }
  }
  if (unexpectedChangedCount !== 0) {
    throw new Error(`${unexpectedChangedCount} row(s) other than the 6 Tier 1 targets changed (ids: ${unexpectedChangedIds.join(', ')}) — aborting, rolling back.`);
  }

  db.exec('COMMIT');
  console.log('COMMIT successful.\n');
  console.log('=== Before/after diff (all 6 rows) ===');
  for (const d of diffs) console.log(`  id ${d.id} (${d.uid}): correct ${d.correctBefore} -> ${d.correctAfter}`);
  console.log(`\nRows changed: ${diffs.length}`);
  console.log(`Unexpected changed rows: ${unexpectedChangedCount}`);
  console.log(`Total row count before: ${beforeAllIds.length}, after: ${afterAllIds.length} (unchanged: ${beforeAllIds.length === afterAllIds.length})`);

  fs.writeFileSync(
    path.join(__dirname, '..', 'docs', 'tier1-cbse-maths-answerkey-fix-result.json'),
    JSON.stringify({ appliedAt: new Date().toISOString(), diffs, unexpectedChangedCount, unexpectedChangedIds: [] }, null, 2)
  );
} catch (err) {
  db.exec('ROLLBACK');
  console.error('\nERROR — rolled back, no changes committed:', err.message);
  process.exitCode = 1;
}

db.close();
console.log(`\nSHA-256 after: ${sha256File(DB_PATH)}`);
