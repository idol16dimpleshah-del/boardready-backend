// Stage 6B (docs/phase-6-postgres-cutover-plan.md) — a genuinely repeatable
// "migrate a real copy of the live data into a fresh Postgres database"
// script, for the formal regression gate.
//
// This is a NEW script, not a modification of the Phase 3/4 migration
// artifacts under docs/phase-3-migration-artifacts/ and
// docs/phase-4-migration-validation-artifacts/ — those are preserved,
// already-validated deliverables from earlier phases (hardcoded to a
// specific one-off source copy, target database name, and role password
// from when they were written) and this project's standing rule is to
// never modify a completed phase's artifacts. Rather than edit migrate.js
// in place to make it reusable, this script re-implements its exact same
// proven per-table logic (load order, INTEGER-column validation before
// insert, TEXT-datetime -> TIMESTAMPTZ conversion, identity-sequence
// fast-forwarding, single all-or-nothing transaction) with the source path,
// target connection, and report path all parametrized — so Stage 6B can run
// it repeatedly against fresh, disposable targets without touching or
// depending on the Phase 3/4 artifacts' own hardcoded state.
//
// SAFETY: refuses to run if the source path resolves to the live
// boardready.db, and refuses if the target database name is
// boardready/boardready_production/boardready_staging — the same
// "explicit but wrong is just as unsafe as implicit" philosophy as every
// other isolation guard in this project (db.js, db-postgres.js,
// test/pg-test-support.js).
//
// Usage:
//   node scripts/stage6b-migrate.js --source <sqlite-copy-path> \
//     --target-url postgres://user:pass@host:port/dbname \
//     --report <output-report.json>
// All three flags are required — there is deliberately no default source or
// target, unlike migrate.js's original hardcoded one-off values, so this
// script can never be run "by habit" against something unintended.

const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { Client } = require('pg');

const LIVE_DB_PATH = path.join(__dirname, '..', 'boardready.db');
const FORBIDDEN_TARGET_DB_NAMES = new Set(['boardready', 'boardready_production', 'boardready_staging']);

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) { out[argv[i].slice(2)] = argv[i + 1]; i++; }
  }
  return out;
}

const TABLES_IN_LOAD_ORDER = [
  'users', 'subjects', 'chapters', 'source_files', 'source_documents',
  'source_document_files', 'questions', 'visual_assets', 'duplicate_flags',
  'tests', 'test_questions', 'attempts', 'subscriptions', 'audit_log',
];

const TIMESTAMP_COLUMNS = new Set([
  'created_at', 'started_at', 'submitted_at', 'draft_saved_at',
  'uploaded_at', 'archived_at',
]);

const INTEGER_COLUMNS = {
  chapters: ['subject_id', 'order_index'],
  source_files: ['size_bytes'],
  source_documents: ['ingested_count', 'skipped_exact_duplicates', 'flagged_near_duplicates'],
  source_document_files: ['source_document_id', 'source_file_id'],
  questions: ['chapter_id', 'marks', 'correct', 'source_document_id'],
  visual_assets: ['question_id', 'source_file_id'],
  duplicate_flags: ['existing_question_id'],
  tests: ['student_id', 'subject_id', 'practice_chapter_id', 'duration_seconds', 'improves_attempt_id'],
  test_questions: ['test_id', 'question_id', 'order_index'],
  attempts: ['test_id', 'student_id', 'time_exceeded_seconds'],
  subscriptions: ['student_id'],
  audit_log: ['entity_id', 'student_id'],
};

function isValidIntegerValue(v) {
  if (v == null) return true;
  if (typeof v === 'number') return Number.isInteger(v);
  if (typeof v === 'bigint') return true;
  if (typeof v === 'string') return /^-?\d+$/.test(v.trim());
  return false;
}

function toTimestamptz(value) {
  if (value == null) return null;
  const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(value)
    ? value.replace(' ', 'T') + 'Z'
    : value;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new Error(`Unparseable timestamp value: ${JSON.stringify(value)}`);
  return d.toISOString();
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { source, 'target-url': targetUrl, report: reportPath } = args;
  if (!source || !targetUrl || !reportPath) {
    console.error('Usage: node scripts/stage6b-migrate.js --source <sqlite-copy-path> --target-url <postgres-url> --report <output.json>');
    process.exit(2);
  }

  const resolvedSource = path.resolve(source);
  if (resolvedSource === path.resolve(LIVE_DB_PATH)) {
    throw new Error('FATAL: --source resolves to the live boardready.db. This script only ever reads from an explicit COPY, never the live file. Refusing to run.');
  }
  const targetDbName = new URL(targetUrl).pathname.replace(/^\//, '');
  if (FORBIDDEN_TARGET_DB_NAMES.has(targetDbName.toLowerCase())) {
    throw new Error(`FATAL: --target-url names a reserved database ("${targetDbName}"). Refusing to migrate into it.`);
  }

  console.log(`[stage6b-migrate] source (copy):   ${resolvedSource}`);
  console.log(`[stage6b-migrate] target database: ${targetDbName}`);

  const sqlite = new DatabaseSync(resolvedSource, { readOnly: true });
  const pg = new Client({ connectionString: targetUrl });
  await pg.connect();

  const report = { source: resolvedSource, targetDatabase: targetDbName, tables: {}, discrepancies: [], startedAt: new Date().toISOString() };

  try {
    await pg.query('BEGIN');
    await pg.query('SET CONSTRAINTS ALL DEFERRED');

    for (const table of TABLES_IN_LOAD_ORDER) {
      const cols = sqlite.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
      const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();
      const intCols = INTEGER_COLUMNS[table] || [];

      let inserted = 0, skipped = 0;
      for (const row of rows) {
        const violations = intCols.filter((c) => !isValidIntegerValue(row[c]));
        if (violations.length) {
          skipped += 1;
          for (const c of violations) {
            report.discrepancies.push({
              table, column: c, id: row.id ?? null,
              value: row[c], sqliteType: typeof row[c],
              reason: 'Column is INTEGER in the mapped PostgreSQL schema but this row\'s stored value cannot be losslessly represented as an integer (SQLite\'s dynamic typing allowed it to be written anyway).',
            });
          }
          continue;
        }
        const values = cols.map((c) => {
          const v = row[c];
          return TIMESTAMP_COLUMNS.has(c) ? toTimestamptz(v) : v;
        });
        const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');
        const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`;
        await pg.query(sql, values);
        inserted += 1;
      }
      report.tables[table] = { sourceRows: rows.length, insertedRows: inserted, skippedRows: skipped };
      console.log(`${table.padEnd(28)} ${inserted} rows migrated${skipped ? `  (${skipped} SKIPPED — see discrepancies report)` : ''}`);
    }

    for (const table of TABLES_IN_LOAD_ORDER) {
      const hasIdColumn = sqlite.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === 'id' && c.pk === 1);
      if (!hasIdColumn) continue;
      await pg.query(
        `SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1), (SELECT MAX(id) FROM ${table}) IS NOT NULL)`,
        [table]
      );
    }

    await pg.query('COMMIT');
    report.status = report.discrepancies.length ? 'COMMITTED_WITH_DISCREPANCIES' : 'COMMITTED_CLEAN';
  } catch (err) {
    await pg.query('ROLLBACK');
    report.status = 'ROLLED_BACK';
    report.error = { message: err.message, stack: err.stack };
    throw err;
  } finally {
    sqlite.close();
    await pg.end();
    report.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.resolve(reportPath), JSON.stringify(report, null, 2));
  }
}

main().then(() => {
  console.log('[stage6b-migrate] Migration run complete.');
}).catch((err) => {
  console.error('[stage6b-migrate] Migration run FAILED:', err.message);
  process.exit(1);
});
