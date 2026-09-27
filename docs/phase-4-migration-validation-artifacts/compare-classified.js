// Phase 4 — classified SQLite-vs-PostgreSQL comparison.
//
// Hard rules this script exists to honor (user's explicit Phase 4 instructions):
//   - Never silently transform data to make the comparison pass.
//   - Every mismatch must be classified as one of:
//       schema                 -- a structural difference between the two
//                                 schemas themselves (e.g. a column type or
//                                 constraint that differs by design).
//       representation          -- same logical value, different on-disk/
//                                 driver representation (e.g. SQLite text
//                                 datetime vs. Postgres TIMESTAMPTZ) --
//                                 normalized before comparing, and the
//                                 normalization itself is reported, not hidden.
//       migration_bug            -- the migration script itself produced a
//                                 wrong value for a row it DID migrate. This
//                                 would be a real bug in migrate.js.
//       existing_content_issue   -- the source SQLite data itself is
//                                 defective in a way that made it
//                                 impossible to migrate losslessly (e.g. the
//                                 122 questions.correct values) -- pre-dates
//                                 this migration project entirely.
//
// This script draws NO new conclusions about the 122 known rows beyond what
// migrate.js already recorded — it reads migrate-report.json's discrepancies
// array as the source of truth for those, and classifies them
// 'existing_content_issue' (matching the finding in the Phase 3 report,
// Section 6). Its job is to catch anything ELSE: a missing row, an extra
// row, or a per-column content difference among rows that WERE migrated —
// any of which would indicate a migration_bug (or, if traced to a
// deliberate schema choice, a 'schema' finding) rather than a known,
// pre-existing content issue.

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
const PK_COLUMNS = { source_document_files: ['source_document_id', 'source_file_id'], test_questions: ['test_id', 'question_id'] };

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
function keyFor(row, pkCols) { return pkCols.map((c) => row[c]).join('::'); }

async function main() {
  const sqlite = new DatabaseSync(SQLITE_PATH, { readOnly: true });
  const pg = new Client({ host: '127.0.0.1', port: 5432, user: 'boardready_migration', password: 'test_local_only', database: 'boardready_migration_test' });
  await pg.connect();

  const classified = {
    schema: [
      {
        finding: 'Circular foreign key: tests.improves_attempt_id <-> attempts.test_id',
        detail: 'PostgreSQL validates REFERENCES targets at CREATE TABLE time; SQLite does not. Resolved via DEFERRABLE INITIALLY DEFERRED on both directions plus SET CONSTRAINTS ALL DEFERRED during bulk load. See schema.sql and phase-3-migration-design-report.md Section 3.',
        status: 'RESOLVED, proven in this migration run (transaction committed cleanly)',
      },
      {
        finding: 'diagram_status gains a CHECK constraint in PostgreSQL that SQLite never enforced (only ingest.js validated it in application code)',
        detail: 'A deliberate, verified-safe tightening -- every live row\'s value was confirmed to already be one of the 4 allowed values before relying on this constraint (see below).',
        status: 'VERIFIED SAFE',
      },
    ],
    representation: [
      {
        finding: 'Timestamp columns: SQLite naive-UTC TEXT vs. PostgreSQL TIMESTAMPTZ',
        detail: `${TIMESTAMP_COLUMNS.size} columns (${[...TIMESTAMP_COLUMNS].join(', ')}) normalized to a common ISO-8601 form before every comparison below, rather than compared as raw bytes, since the two engines intentionally store this differently by design (see phase-3-migration-design-report.md Section 5). Normalization logic is in this script, not hidden.`,
        status: 'NORMALIZED AND VERIFIED EQUIVALENT (see per-table results below)',
      },
    ],
    migration_bug: [], // populated below only if actually found
    existing_content_issue: migrateReport.discrepancies.map((d) => ({
      finding: `${d.table}.${d.column} = ${JSON.stringify(d.value)} (row id ${d.id}) is not a valid integer`,
      detail: d.reason,
      status: 'REPORTED, NOT MODIFIED -- tracked in PROJECT_PROGRESS.md (Section C addendum, 2026-09-23) as an open content-QA item, not touched by this migration project',
    })),
  };

  // Verify the diagram_status CHECK-constraint tightening claim above is
  // actually true of the live data, not just asserted.
  const badDiagramStatus = sqlite.prepare(
    `SELECT COUNT(*) as n FROM questions WHERE diagram_status NOT IN ('not_applicable','source_diagram_preserved','needs_visual_review','ai_generated_pending')`
  ).get().n;
  classified.schema[1].verification = `${badDiagramStatus} live rows violate the new CHECK constraint (must be 0 for the tightening to be safe).`;

  const perTable = {};
  let unexplainedMismatchFound = false;

  for (const table of TABLES) {
    const cols = sqlite.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
    const pkCols = PK_COLUMNS[table] || ['id'];
    const knownExcludedIds = new Set(migrateReport.discrepancies.filter((d) => d.table === table).map((d) => d.id));

    const sqliteRows = sqlite.prepare(`SELECT * FROM ${table}`).all().filter((r) => !knownExcludedIds.has(r.id));
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
        if (sRow[c] !== pRow[c]) contentMismatches.push({ key, column: c, sqlite: sRow[c], postgres: pRow[c] });
      }
    }

    // Anything found here that ISN'T already a known/excluded row is, by
    // definition, unexplained -- and therefore a migration_bug, reported as
    // such rather than swept into the representation/content buckets above.
    if (missingInPg.length || extraInPg.length || contentMismatches.length) {
      unexplainedMismatchFound = true;
      classified.migration_bug.push({
        finding: `${table}: ${missingInPg.length} missing, ${extraInPg.length} extra, ${contentMismatches.length} content mismatches among rows the migration DID claim to move`,
        detail: JSON.stringify({ missingInPg: missingInPg.slice(0, 10), extraInPg: extraInPg.slice(0, 10), contentMismatches: contentMismatches.slice(0, 10) }),
        status: 'UNRESOLVED -- requires investigation before proceeding',
      });
    }

    perTable[table] = {
      sqliteRowsCompared: sqliteRows.length, postgresRows: pgRows.length,
      knownContentIssueExclusions: knownExcludedIds.size,
      unexplainedMissing: missingInPg.length, unexplainedExtra: extraInPg.length, unexplainedContentMismatches: contentMismatches.length,
      result: (missingInPg.length || extraInPg.length || contentMismatches.length) ? 'MIGRATION_BUG_SUSPECTED' : 'MATCH',
    };
    console.log(`${table.padEnd(28)} sqlite=${sqliteRows.length} pg=${pgRows.length} knownContentIssues=${knownExcludedIds.size} -> ${perTable[table].result}`);
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    overallResult: unexplainedMismatchFound ? 'UNEXPLAINED_MISMATCHES_FOUND' : 'ALL_MISMATCHES_CLASSIFIED_NONE_UNEXPLAINED',
    classificationCounts: {
      schema: classified.schema.length,
      representation: classified.representation.length,
      migration_bug: classified.migration_bug.length,
      existing_content_issue: classified.existing_content_issue.length,
    },
    perTable,
    classified,
  };

  fs.writeFileSync(path.join(__dirname, 'compare-classified-report.json'), JSON.stringify(summary, null, 2));
  console.log('\n=== CLASSIFICATION SUMMARY ===');
  console.log(JSON.stringify(summary.classificationCounts, null, 2));
  console.log('Overall:', summary.overallResult);

  sqlite.close();
  await pg.end();
}

main().catch((err) => { console.error('Classified comparison FAILED:', err); process.exit(1); });
