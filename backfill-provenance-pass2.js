// Second-pass provenance backfill: resolves the questions left unset by
// archive-sources.js's first pass (where multiple source_documents rows
// shared identical label text — e.g. every "competency.pdf..." batch row
// has the same label, one per chapter) by adding chapter_name + subject
// as a tie-breaker. Never guesses when still ambiguous after this —
// reports the honest remaining count instead.
const db = require('./db');

const rows = db.prepare(`
  SELECT q.id, q.source, q.chapter_id, c.name AS chapter_name, s.name AS subject_name
  FROM questions q
  JOIN chapters c ON c.id = q.chapter_id
  JOIN subjects s ON s.id = c.subject_id
  WHERE q.source_document_id IS NULL AND q.source IS NOT NULL
`).all();

const docs = db.prepare('SELECT id, label, subject_name, chapter_name FROM source_documents').all();
const setSourceDoc = db.prepare('UPDATE questions SET source_document_id = ? WHERE id = ?');

let resolved = 0;
let stillAmbiguous = 0;
let stillUnmatched = 0;
for (const q of rows) {
  const src = (q.source || '').trim();
  const byLabel = docs.filter((d) => d.label === src || d.label.startsWith(src) || src.startsWith(d.label.split(' ')[0]));
  const candidates = byLabel.length ? byLabel : docs;
  const narrowed = candidates.filter((d) => d.subject_name === q.subject_name && d.chapter_name === q.chapter_name);
  if (narrowed.length === 1) {
    setSourceDoc.run(narrowed[0].id, q.id);
    resolved++;
  } else if (narrowed.length > 1) {
    stillAmbiguous++;
  } else {
    stillUnmatched++;
  }
}

console.log(`Pass 2: resolved ${resolved} via chapter+subject tie-break, ${stillAmbiguous} still ambiguous, ${stillUnmatched} still unmatched.`);
const totalQ = db.prepare('SELECT COUNT(*) c FROM questions').get().c;
const linkedQ = db.prepare('SELECT COUNT(*) c FROM questions WHERE source_document_id IS NOT NULL').get().c;
console.log(`Final state: ${linkedQ}/${totalQ} questions have a formal source_document_id link (${totalQ - linkedQ} do not — listed below).`);

const remaining = db.prepare(`
  SELECT q.id, q.source, c.name AS chapter_name, s.name AS subject_name
  FROM questions q
  JOIN chapters c ON c.id = q.chapter_id
  JOIN subjects s ON s.id = c.subject_id
  WHERE q.source_document_id IS NULL
`).all();
const bySubject = {};
for (const r of remaining) {
  const key = `${r.subject_name} / ${r.chapter_name}`;
  bySubject[key] = (bySubject[key] || 0) + 1;
}
console.log('Unresolved, grouped by subject/chapter:', JSON.stringify(bySubject, null, 2));
