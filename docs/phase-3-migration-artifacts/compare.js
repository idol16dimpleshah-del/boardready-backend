// Automated SQLite (copy) vs PostgreSQL (test db) comparison — the required
// step before any of this could be trusted enough to even consider a real
// cutover. Compares every table: row counts (with the known, reported
// exception below) and a full per-row, per-column content diff keyed by
// primary key, with timestamp columns normalized to a common form first
// (SQLite text vs Postgres TIMESTAMPTZ are stored differently by design —
// see schema.sql — so a byte-comparison would falsely flag every row).

const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { Client } = require('pg');

const SQLITE_PATH = path.join(__dirname, 'sqlite-copy-for-migration-test.db');
const migrateReport = JSON.parse(fs.readFileSync(path.join(__dirname, 'migrate-report.json'), 'utf8'));

const TABLES = [
  'users', 'subjects', 'chapters', 'source_files', 'source_documents',
  'source_document_files', 'questions', 'visual_assets', 'duplicate_flags',
  'tests', 'test_questions', 'attempts', 'subscriptions', 'audit_log',
];
const TIMESTAMP_COLUMNS = new Set(['created_at', 'started_at', 'submitted_at', 'draft_saved_at', 'uploaded_at', 'archived_at']);
const PK_COLUMNS = {
  source_document_files: ['source_document_id', 'source_file_id'],
  test_questions: ['test_id', 'question_id'],
};

function normalizeTimestamp(v) {
  if (v == null) return null;
  const d = new Date(typeof v === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(v) ? v.replace(' ', 'T') + 'Z' : v);
  return Number.isNaN(d.getTime()) ? String(v) : d.toISOString();
}
function normalizeRow(row, cols) {
  const out = {};
  for (const c of cols) out[c] = TIMESTAMP_COLUMNS.has(c) ? normalizeTimestamp(row[c]) : (row[c] == null ? null : String(row[c]));
  return out;
}
function keyFor(row, pkCols) {
  return pkCols.map((c) => row[c]).join('::');
}

async function main() {
  const sqlite = new DatabaseSync(SQLITE_PATH, { readOnly: true });
  const pg = new Client({ host: '127.0.0.1', port: 5432, user: 'boardready_migration', password: 'test_local_only', database: 'boardready_migration_test' });
  await pg.connect();

  const results = {};
  let anyMismatch = false;

  for (const table of TABLES) {
    const cols = sqlite.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
    const pkCols = PK_COLUMNS[table] || ['id'];
    const skippedIds = new Set(
      migrateReport.discrepancies.filter((d) => d.table === table).map((d) => d.id)
    );

    const sqliteRows = sqlite.prepare(`SELECT * FROM ${table}`).all()
      .filter((r) => !skippedIds.has(r.id)); // exclude rows we already know and reported as not migrated
    const pgRows = (await pg.query(`SELECT * FROM ${table}`)).rows;

    const sqliteByKey = new Map(sqliteRows.map((r) => [keyFor(r, pkCols), normalizeRow(r, cols)]));
    const pgByKey = new Map(pgRows.map((r) => [keyFor(r, pkCols), normalizeRow(r, cols)]));

    const missingInPg = [...sqliteByKey.keys()].filter((k) => !pgByKey.has(k));
    const extraInPg = [...pgByKey.keys()].filter((k) => !sqliteByKey.has(k));
    const contentMismatches = [];
    for (const [key, sRow] of sqliteByKey.entries()) {
      const pRow = pgByKey.get(key);
      if (!pRow) continue;
      for (const c of cols) {
        if (sRow[c] !== pRow[c]) {
          contentMismatches.push({ key, column: c, sqlite: sRow[c], postgres: pRow[c] });
        }
      }
    }

    const tableOk = missingInPg.length === 0 && extraInPg.length === 0 && contentMismatches.length === 0;
    if (!tableOk) anyMismatch = true;

    results[table] = {
      sqliteRowsCompared: sqliteRows.length,
      postgresRows: pgRows.length,
      knownExcludedRows: skippedIds.size,
      missingInPg: missingInPg.length,
      extraInPg: extraInPg.length,
      contentMismatches: contentMismatches.length,
      contentMismatchSample: contentMismatches.slice(0, 5),
      status: tableOk ? 'MATCH' : 'MISMATCH',
    };
    console.log(`${table.padEnd(28)} sqlite=${sqliteRows.length} pg=${pgRows.length} excluded=${skippedIds.size} missing=${missingInPg.length} extra=${extraInPg.length} contentDiffs=${contentMismatches.length} -> ${results[table].status}`);
  }

  fs.writeFileSync(path.join(__dirname, 'compare-report.json'), JSON.stringify({ results, overall: anyMismatch ? 'DISCREPANCIES_FOUND_OUTSIDE_KNOWN_SET' : 'ALL_MIGRATED_ROWS_MATCH', generatedAt: new Date().toISOString() }, null, 2));
  console.log('\nOverall:', anyMismatch ? 'DISCREPANCIES FOUND OUTSIDE THE KNOWN/REPORTED SET' : 'ALL MIGRATED ROWS MATCH EXACTLY (excluding the 122 known, reported, skipped questions rows)');

  sqlite.close();
  await pg.end();
}

main().catch((err) => { console.error('Comparison FAILED:', err); process.exit(1); });
