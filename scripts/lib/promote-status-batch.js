// Shared guarded-promotion helper for the CBSE Maths content-promotion
// campaign (Batch 16). Each candidate has already been independently
// re-verified (its own math re-derived from scratch, not just trusting
// answer_status='verified') before being passed in here — this module only
// performs the mechanical, individually-guarded `status` promotion, exactly
// mirroring the pattern established in
// scripts/apply-4569-4651-4662-4665-promotion.js.
//
// Scope per row: `status` transcribed -> verified ONLY. answer_status stays
// 'verified' (already was) and diagram_status stays 'not_applicable'
// (already was) -- neither is touched. Every row is checked against its
// exact expected prior state (question_uid, correct, options_json/parts_json,
// status, answer_status, diagram_status) before writing, and every other
// column is re-verified byte-identical after.
//
// candidates: [{ id, uid, correct, optionsJson (string, JSON-encoded, or
//   null for case-kind rows), partsJson (string or null) }]
// Returns { promoted: [...ids], failed: [{id, error}] }

const { DatabaseSync } = require('node:sqlite');

const QUESTION_COLUMNS = [
  'id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'marks',
  'text', 'normalized_text', 'options_json', 'parts_json', 'correct', 'explanation', 'source',
  'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section',
  'question_format', 'answer_status', 'created_at', 'source_document_id', 'diagram_status',
];

function promoteStatusBatch(dbPath, candidates) {
  const db = new DatabaseSync(dbPath);
  function snapshotQuestion(id) { return db.prepare('SELECT * FROM questions WHERE id = ?').get(id); }

  const promoted = [];
  const failed = [];

  for (const c of candidates) {
    console.log(`--- id ${c.id} (${c.uid}) ---`);
    db.exec('BEGIN IMMEDIATE');
    try {
      const beforeQ = snapshotQuestion(c.id);
      if (!beforeQ) throw new Error(`question id ${c.id} not found`);
      if (beforeQ.question_uid !== c.uid) throw new Error(`question_uid mismatch (expected ${c.uid}, found ${beforeQ.question_uid})`);
      if (beforeQ.status !== 'transcribed') throw new Error(`status has changed (found '${beforeQ.status}')`);
      if (beforeQ.answer_status !== 'verified') throw new Error(`answer_status has changed (found '${beforeQ.answer_status}')`);
      if (beforeQ.diagram_status !== 'not_applicable') throw new Error(`diagram_status has changed (found '${beforeQ.diagram_status}')`);
      if (c.optionsJson != null) {
        if (Number(beforeQ.correct) !== c.correct) throw new Error(`correct has changed (expected ${c.correct}, found ${beforeQ.correct})`);
        if (beforeQ.options_json !== c.optionsJson) throw new Error(`options_json has changed`);
      } else if (c.partsJson != null) {
        if (beforeQ.parts_json !== c.partsJson) throw new Error(`parts_json has changed`);
      }

      const updateInfo = db.prepare('UPDATE questions SET status = ? WHERE id = ? AND status = ? AND answer_status = ? AND diagram_status = ?')
        .run('verified', c.id, 'transcribed', 'verified', 'not_applicable');
      if (updateInfo.changes !== 1) throw new Error(`expected exactly 1 row changed, got ${updateInfo.changes}`);

      const afterQ = snapshotQuestion(c.id);
      for (const col of QUESTION_COLUMNS) {
        if (col === 'status') continue;
        if (String(beforeQ[col]) !== String(afterQ[col])) throw new Error(`unexpected change in questions.${col}`);
      }
      if (afterQ.status !== 'verified') throw new Error('post-write status mismatch');

      db.exec('COMMIT');
      console.log(`status: transcribed -> verified — COMMIT successful.`);
      promoted.push(c.id);
    } catch (err) {
      db.exec('ROLLBACK');
      console.error(`ERROR on id ${c.id} — rolled back:`, err.message);
      failed.push({ id: c.id, error: err.message });
    }
  }

  db.close();
  return { promoted, failed };
}

module.exports = { promoteStatusBatch };
