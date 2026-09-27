const db = require('./db');

// Capture the items array from the batch file without inserting anything.
const fake = { ingestQuestions: (items) => { global.__items = items; return { inserted: 0, skippedExactDuplicates: 0, flaggedNearDuplicates: 0, insertedIds: [] }; } };
require.cache[require.resolve('./ingest')] = { exports: fake };
require('./ingest-statistics-batch2.js');
const items = global.__items;

// Now load the REAL ingest module for its normalize/exactFingerprint-equivalent logic.
delete require.cache[require.resolve('./ingest')];
const real = require('./ingest');

const chapterId = 1;
const existing = db.prepare('SELECT id, normalized_text, text, kind, options_json, parts_json FROM questions WHERE chapter_id = ?').all(chapterId)
  .map((r) => {
    const normalizedStem = r.normalized_text || real.normalize(r.text);
    const optionsOrParts = r.kind === 'case' ? (r.parts_json ? JSON.parse(r.parts_json) : []) : (r.options_json ? JSON.parse(r.options_json) : null);
    const answerShape = r.kind === 'case'
      ? JSON.stringify(optionsOrParts.map((p) => ({ t: real.normalize(p.text || ''), o: p.options, c: p.correct })))
      : JSON.stringify(optionsOrParts);
    return { id: r.id, fingerprint: `${normalizedStem}::${answerShape}` };
  });
const existingByFp = new Map(existing.map((e) => [e.fingerprint, e.id]));

for (const item of items) {
  const normalized = real.normalize(item.text);
  const kind = item.kind || 'mcq';
  const optionsOrParts = kind === 'case' ? item.parts : item.options;
  const answerShape = kind === 'case'
    ? JSON.stringify((optionsOrParts || []).map((p) => ({ t: real.normalize(p.text || ''), o: p.options, c: p.correct })))
    : JSON.stringify(optionsOrParts || null);
  const fp = `${normalized}::${answerShape}`;
  if (existingByFp.has(fp)) {
    console.log('WOULD MATCH existing id=' + existingByFp.get(fp), '-- item sqn=' + item.sourceQuestionNumber, item.text.slice(0, 60));
  }
}
console.log('done checking', items.length, 'items against', existing.length, 'existing rows');
