// Phase 3 migration-test script — TEST-ONLY, runs entirely against copies.
// Source: sqlite-copy-for-migration-test.db (a copy of the independently
//   preserved, hash-verified backup — never the live boardready.db).
// Target: boardready_migration_test, a local PostgreSQL database created
//   solely for this test (see schema.sql).
// Nothing in this script touches /home/claude/backend/boardready.db or any
// application code.

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { Client } = require('pg');

const SQLITE_PATH = path.join(__dirname, 'sqlite-copy-for-migration-test.db');

// Load order chosen so that, ignoring the deferred tests<->attempts cycle
// (handled by SET CONSTRAINTS ALL DEFERRED below), every other foreign key
// is satisfied by the time each table's rows are inserted.
const TABLES_IN_LOAD_ORDER = [
  'users', 'subjects', 'chapters', 'source_files', 'source_documents',
  'source_document_files', 'questions', 'visual_assets', 'duplicate_flags',
  'tests', 'test_questions', 'attempts', 'subscriptions', 'audit_log',
];

// SQLite TEXT datetime columns ("YYYY-MM-DD HH:MM:SS", naive UTC per
// datetime('now')'s documented behavior) -> Postgres TIMESTAMPTZ. Every
// column below is one of these in the live schema; anything not listed is
// copied through unchanged (including every *_json TEXT column, left as TEXT
// on both sides — see schema.sql's header comment).
const TIMESTAMP_COLUMNS = new Set([
  'created_at', 'started_at', 'submitted_at', 'draft_saved_at',
  'uploaded_at', 'archived_at',
]);

// Every column declared INTEGER in schema.sql, per table, EXCLUDING the
// identity `id` column itself (SQLite's own rowid guarantees that one is
// always a real integer). SQLite has no static column typing — a column
// declared INTEGER will still silently accept and store a TEXT value if one
// is ever written to it (its "type affinity" system only tries to coerce,
// it never rejects) — so this has to be checked explicitly before handing
// rows to Postgres, which enforces its column types strictly and will
// reject the whole statement otherwise. This is exactly the class of
// SQLite-vs-PostgreSQL validation check item 15 of the migration brief asks
// for, and finding real violations here is the point of testing against a
// full copy of the actual bank rather than a synthetic sample.
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
  if (v == null) return true; // nullability is a separate, already-enforced concern (NOT NULL in schema.sql)
  if (typeof v === 'number') return Number.isInteger(v);
  if (typeof v === 'bigint') return true;
  if (typeof v === 'string') return /^-?\d+$/.test(v.trim());
  return false;
}

function toTimestamptz(value) {
  if (value == null) return null;
  // SQLite's datetime('now') text has no 'T' or zone — treat as UTC, same
  // assumption server.js's own submit handler already makes today
  // (`new Date(attempt.started_at.replace(' ', 'T') + 'Z')`).
  const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(value)
    ? value.replace(' ', 'T') + 'Z'
    : value; // already ISO-ish (e.g. uploaded_at values captured elsewhere) — pass through
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) throw new Error(`Unparseable timestamp value: ${JSON.stringify(value)}`);
  return d.toISOString();
}

async function main() {
  const sqlite = new DatabaseSync(SQLITE_PATH, { readOnly: true });
  const pg = new Client({
    host: '127.0.0.1', port: 5432,
    user: 'boardready_migration', password: 'test_local_only',
    database: 'boardready_migration_test',
  });
  await pg.connect();

  const report = { tables: {}, discrepancies: [], startedAt: new Date().toISOString() };

  try {
    await pg.query('BEGIN');
    await pg.query('SET CONSTRAINTS ALL DEFERRED');

    for (const table of TABLES_IN_LOAD_ORDER) {
      const cols = sqlite.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
      const rows = sqlite.prepare(`SELECT * FROM ${table}`).all();
      const intCols = INTEGER_COLUMNS[table] || [];

      let inserted = 0, skipped = 0;
      for (const row of rows) {
        // Validate BEFORE attempting the insert — never let Postgres's own
        // strict typing be the mechanism that decides this, and never coerce
        // a bad value into something that merely stops the error (e.g.
        // guessing "(b)" -> 1): that would be inventing an answer-key
        // interpretation, a content decision, silently, which is exactly
        // what this project's standing rule (no auto-fixing a content-
        // integrity discrepancy) is there to prevent.
        const violations = intCols.filter((c) => !isValidIntegerValue(row[c]));
        if (violations.length) {
          skipped += 1;
          for (const c of violations) {
            report.discrepancies.push({
              table, column: c, id: row.id ?? null,
              value: row[c], sqliteType: typeof row[c],
              reason: `Column is INTEGER in the mapped PostgreSQL schema but this row's stored value cannot be losslessly represented as an integer (SQLite's dynamic typing allowed it to be written anyway).`,
            });
          }
          continue; // row excluded from this test load; see discrepancies report — not auto-fixed
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

    // Fast-forward every identity sequence past the highest migrated id, so
    // the live app (after cutover) can keep inserting with no PK collision —
    // GENERATED BY DEFAULT AS IDENTITY does not do this automatically when
    // rows are inserted with explicit ids, only when the column is left to
    // its own default.
    for (const table of TABLES_IN_LOAD_ORDER) {
      const hasIdColumn = sqlite.prepare(`PRAGMA table_info(${table})`).all().some((c) => c.name === 'id' && c.pk === 1);
      if (!hasIdColumn) continue; // join tables (source_document_files, test_questions) have composite PKs, no identity to fix up
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
    require('node:fs').writeFileSync(path.join(__dirname, 'migrate-report.json'), JSON.stringify(report, null, 2));
  }
}

main().then(() => {
  console.log('Migration test run complete.');
}).catch((err) => {
  console.error('Migration test run FAILED:', err.message);
  process.exit(1);
});
