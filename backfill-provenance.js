// One-off backfill: populate source_question_number / source_page /
// answer_key_ref / question_type on the 124 questions that were inserted
// BEFORE these columns existed. Nothing about text/options/correct/status
// changes here — this only fills in traceability metadata using the same
// source page images and answer-key pages already reviewed this session.
//
// source_page mapping below is a best-effort reconstruction from the page
// images already viewed (not a fresh re-scan pixel-by-pixel), so treat it as
// "which page this was substantively read from," accurate at the page
// level; a question's last option or two occasionally spills onto the next
// printed page in the source's own layout, which doesn't change the page
// it's attributed to here. Anything transcribed FRESH from now on (the
// Statistics work that follows) captures source_page directly at
// transcription time instead of being reconstructed after the fact.
const db = require('./db');

function pageFor(n, ranges) {
  for (const [lo, hi, page] of ranges) if (n >= lo && n <= hi) return page;
  return null;
}

// --- Statistics (chapter_id=1), original 24, ids in source order (1)-(24) ---
const statsRanges = [[1, 3, '23.3'], [4, 10, '23.4'], [11, 14, '23.5'], [15, 24, '23.6']];
const statsRows = db.prepare('SELECT id FROM questions WHERE chapter_id=1 ORDER BY id').all();
statsRows.forEach((row, i) => {
  const n = i + 1; // source item number
  db.prepare('UPDATE questions SET source_question_number=?, source_page=?, answer_key_ref=?, question_type=? WHERE id=?')
    .run(String(n), pageFor(n, statsRanges), `answer.pdf p.25.14 item (${n})`, 'mcq', row.id);
});

// --- Probability (chapter_id=2), 85 total: ids 1-35 = source (1)-(35) already
// verified; ids 36-85 in insertion order = source (36)-(85) from the batch-2
// re-ingestion (33 plain MCQ, 4 case-study, 13 assertion-reasoning) ---
const probRanges = [
  [1, 8, '24.2'], [9, 19, '24.3'], [20, 29, '24.4'], [30, 35, '24.5'],
  [36, 44, '24.6'], [45, 52, '24.7'], [53, 58, '24.8'], [59, 66, '24.9'],
  [67, 68, '24.10'], [69, 70, '24.10'], [71, 72, '24.11'],
  [73, 76, '24.12'], [77, 79, '24.13'], [80, 82, '24.14'], [83, 85, '24.15'],
];
const probRows = db.prepare('SELECT id, kind FROM questions WHERE chapter_id=2 ORDER BY id').all();
probRows.forEach((row, i) => {
  const n = i + 1;
  let questionType = 'mcq';
  if (n >= 69 && n <= 72) questionType = 'case_study';
  else if (n >= 73 && n <= 85) questionType = 'assertion_reasoning';
  db.prepare('UPDATE questions SET source_question_number=?, source_page=?, answer_key_ref=?, question_type=? WHERE id=?')
    .run(String(n), pageFor(n, probRanges), `answer.pdf p.25.15 item (${n})`, questionType, row.id);
});

// --- CBSE chapters (3, 4): originally authored for this rebuild, not
// transcribed from any PDF (already disclosed in REBUILD_NOTES.md) — no
// source_question_number/source_page/answer_key_ref applies; question_type
// still gets tagged so the future test-builder mix filter works for these too.
const cbseRows = db.prepare('SELECT id, kind FROM questions WHERE chapter_id IN (3,4)').all();
cbseRows.forEach((row) => {
  db.prepare("UPDATE questions SET question_type=? WHERE id=?").run(row.kind === 'case' ? 'case_study' : 'mcq', row.id);
});

console.log('Statistics backfilled:', statsRows.length);
console.log('Probability backfilled:', probRows.length);
console.log('CBSE tagged (question_type only, not source-PDF content):', cbseRows.length);

// Spot-check a handful
const sample = db.prepare('SELECT id, source_question_number, source_page, answer_key_ref, question_type FROM questions WHERE chapter_id IN (1,2) AND id IN (1, 24, 25, 59, 60, 108, 111, 117)').all();
console.log(JSON.stringify(sample, null, 1));
