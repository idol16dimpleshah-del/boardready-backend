// Proves the pg-compat-shim actually fixes the two Phase 3 findings, by
// running server.js's REAL /api/content/summary query and reduce logic
// (copied verbatim from server.js's handler, not reinvented) three ways:
//   (a) against SQLite directly (the baseline, known-correct behavior)
//   (b) against Postgres RAW (no shim) -- reproduces the two bugs
//   (c) against Postgres THROUGH the shim -- must match (a) exactly

const { DatabaseSync } = require('node:sqlite');
const { Client } = require('pg');
const { PgCompat } = require('./pg-compat-shim');

const GRADABLE_STATUSES = ['verified', 'qa_passed', 'published'];

// This is server.js's actual /api/content/summary reduce logic, copied
// verbatim (see server.js lines ~140-154) -- not reimplemented.
function reduceTotals(rows) {
  return rows.reduce((acc, r) => ({
    subjects: acc.subjects + r.subjectCount, chapters: acc.chapters + r.chapterCount, questions: acc.questions + r.questionCount,
  }), { subjects: 0, chapters: 0, questions: 0 });
}

const SQLITE_SQL = `SELECT s.board as board, COUNT(DISTINCT s.id) as subjectCount, COUNT(DISTINCT c.id) as chapterCount, COUNT(q.id) as questionCount
    FROM subjects s LEFT JOIN chapters c ON c.subject_id = s.id LEFT JOIN questions q ON q.chapter_id = c.id AND q.status IN (?,?,?)
    GROUP BY s.board ORDER BY s.board`;

const PG_SQL = `SELECT s.board as board, COUNT(DISTINCT s.id) as subjectCount, COUNT(DISTINCT c.id) as chapterCount, COUNT(q.id) as questionCount
    FROM subjects s LEFT JOIN chapters c ON c.subject_id = s.id LEFT JOIN questions q ON q.chapter_id = c.id AND q.status IN ($1,$2,$3)
    GROUP BY s.board ORDER BY s.board`;

async function main() {
  const sqlite = new DatabaseSync(require('node:path').join(__dirname, 'sqlite-copy-for-migration-test.db'), { readOnly: true });
  const sqliteRows = sqlite.prepare(SQLITE_SQL).all(...GRADABLE_STATUSES);
  const sqliteTotals = reduceTotals(sqliteRows);
  console.log('(a) SQLite (baseline):        ', JSON.stringify(sqliteTotals), typeof sqliteRows[0].subjectCount);

  const rawPg = new Client({ host: '127.0.0.1', port: 5432, user: 'boardready_migration', password: 'test_local_only', database: 'boardready_migration_test' });
  await rawPg.connect();
  const rawRows = (await rawPg.query(PG_SQL, GRADABLE_STATUSES)).rows;
  let rawTotals, rawBroken = false;
  try {
    rawTotals = reduceTotals(rawRows); // will silently do string concatenation, or throw on r.subjectCount undefined
    rawBroken = typeof rawTotals.subjects !== 'number' || isNaN(rawTotals.subjects) || String(rawTotals.subjects).length > String(sqliteTotals.subjects).length;
  } catch (e) { rawTotals = `THREW: ${e.message}`; rawBroken = true; }
  console.log('(b) Postgres RAW (no shim):  ', JSON.stringify(rawTotals), '<- reproduces the bug:', rawBroken || JSON.stringify(rawTotals) !== JSON.stringify(sqliteTotals));
  await rawPg.end();

  const shim = new PgCompat({ host: '127.0.0.1', port: 5432, user: 'boardready_migration', password: 'test_local_only', database: 'boardready_migration_test' });
  await shim.connect();
  const shimRows = await shim.query(PG_SQL, GRADABLE_STATUSES, {
    aliasMap: { board: 'board', subjectcount: 'subjectCount', chaptercount: 'chapterCount', questioncount: 'questionCount' },
    numericColumns: ['subjectCount', 'chapterCount', 'questionCount'],
  });
  const shimTotals = reduceTotals(shimRows);
  const fixed = JSON.stringify(shimTotals) === JSON.stringify(sqliteTotals) && typeof shimRows[0].subjectCount === 'number';
  console.log('(c) Postgres THROUGH shim:   ', JSON.stringify(shimTotals), typeof shimRows[0].subjectCount, '<- matches SQLite exactly:', fixed);
  await shim.end();

  require('node:fs').writeFileSync(require('node:path').join(__dirname, 'compat-fix-proof.json'), JSON.stringify({
    sqliteBaseline: { totals: sqliteTotals, subjectCountType: typeof sqliteRows[0].subjectCount },
    postgresRawBroken: { totals: rawTotals, matchesBaseline: JSON.stringify(rawTotals) === JSON.stringify(sqliteTotals) },
    postgresThroughShim: { totals: shimTotals, subjectCountType: typeof shimRows[0].subjectCount, matchesBaseline: fixed },
    conclusion: fixed ? 'COMPATIBILITY SHIM PROVEN: identical output to SQLite, real numbers not strings' : 'SHIM DID NOT FIX THE ISSUE -- investigate',
  }, null, 2));

  sqlite.close();
  process.exit(fixed ? 0 : 1);
}

main().catch((err) => { console.error('FAILED:', err); process.exit(1); });
