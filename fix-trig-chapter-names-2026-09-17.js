// Data correction, 2026-09-17: the founder clarified that this
// textbook's REAL chapter structure groups "Trigonometric Ratios" and
// "Trigonometric Identities" (ingested this session as two separate
// chapters, ids 78 and 76) under ONE chapter called "Introduction to
// Trigonometry", and that "Heights and Distances" (id 77) is actually
// titled "Application of Trigonometry" in this book. Founder's exact
// words: "trigno ratios and trig identites both are under same chapter
// in book said as introduction to trignometry, and heights and
// distances is application to trignometry in texbook".
//
// This script:
//   1. Renames chapter 78 ("Trigonometric Ratios") to "Introduction to
//      Trigonometry" — chosen as the surviving row since it's the
//      lower page-number-order chapter (p.9.x).
//   2. Re-points every question currently on chapter 76
//      ("Trigonometric Identities", p.10.x) to chapter 78, so all of
//      Introduction to Trigonometry's questions live under one chapter
//      id.
//   3. Deletes the now-empty chapter 76 row.
//   4. Renames chapter 77 ("Heights and Distances") to "Application of
//      Trigonometry".
// No question rows, visual_assets, or duplicate_flags are deleted or
// altered in content — only chapter_id linkage and chapter names/order.
const db = require('./db');

const CH_RATIOS = 78;   // "Trigonometric Ratios" -> renamed, kept
const CH_IDENTITIES = 76; // "Trigonometric Identities" -> merged into CH_RATIOS, then deleted
const CH_HEIGHTS = 77;  // "Heights and Distances" -> renamed

db.exec('BEGIN TRANSACTION;');
try {
  const before = db.prepare('SELECT id, name FROM chapters WHERE id IN (?,?,?)').all(CH_RATIOS, CH_IDENTITIES, CH_HEIGHTS);
  console.log('BEFORE:', before);

  const movedCount = db.prepare('SELECT COUNT(*) as n FROM questions WHERE chapter_id = ?').get(CH_IDENTITIES).n;

  db.prepare('UPDATE chapters SET name = ?, order_index = ? WHERE id = ?').run('Introduction to Trigonometry', 9, CH_RATIOS);
  db.prepare('UPDATE questions SET chapter_id = ? WHERE chapter_id = ?').run(CH_RATIOS, CH_IDENTITIES);
  const remaining = db.prepare('SELECT COUNT(*) as n FROM questions WHERE chapter_id = ?').get(CH_IDENTITIES).n;
  if (remaining !== 0) throw new Error(`Expected 0 questions left on chapter ${CH_IDENTITIES}, found ${remaining}`);
  db.prepare('DELETE FROM chapters WHERE id = ?').run(CH_IDENTITIES);

  db.prepare('UPDATE chapters SET name = ?, order_index = ? WHERE id = ?').run('Application of Trigonometry', 10, CH_HEIGHTS);

  db.exec('COMMIT;');
  console.log(`Moved ${movedCount} question(s) from chapter ${CH_IDENTITIES} to chapter ${CH_RATIOS}.`);
  const after = db.prepare('SELECT id, name, order_index FROM chapters WHERE id IN (?,?)').all(CH_RATIOS, CH_HEIGHTS);
  console.log('AFTER:', after);
  const totalNow = db.prepare('SELECT COUNT(*) as n FROM questions WHERE chapter_id = ?').get(CH_RATIOS).n;
  console.log(`Chapter ${CH_RATIOS} ("Introduction to Trigonometry") now has ${totalNow} questions total.`);
} catch (err) {
  db.exec('ROLLBACK;');
  throw err;
}
