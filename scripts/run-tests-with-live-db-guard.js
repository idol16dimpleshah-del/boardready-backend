// Safety-net wrapper around `node --test` — added 2026-09-23 per the
// test-database-isolation-incident spec (see
// docs/test-database-isolation-incident.md for the full account of the two
// incidents that made this necessary).
//
// IMPORTANT — this file deliberately lives under scripts/, NOT under test/.
// Node's `--test` flag auto-discovers and runs every plain .js file directly
// inside a directory literally named "test" or "tests" (verified empirically
// in this environment — it is not limited to *.test.js), so a script like
// this one, which itself calls `spawnSync('node', ['--test'], ...)`, would
// be recursively picked up and re-run by the very test run it's supposed to
// be wrapping if it were placed inside test/. Keeping it in scripts/ avoids
// that entirely.
//
// What this is and is not: this is NOT the isolation mechanism. The real
// isolation is (a) db.js's fail-closed guard, which refuses to open the live
// database or any known backup/preservation copy whenever it detects a test
// context without an explicit, verified-safe DB_PATH, and (b) test files
// (see test/readiness.test.js) setting their own explicit NODE_ENV/DB_PATH
// before requiring anything from the backend, and passing the same
// explicitly to any child process they spawn.
//
// This script is the backstop for those: it hashes and row-counts the LIVE
// database before running the real test suite, runs the suite, then hashes
// and row-counts it again — and fails the WHOLE run, regardless of whether
// every individual test passed, if the live database changed at all. This
// is deliberately independent of whatever the tests themselves report:
// incident #2 involved a test run where all 12 tests passed while quietly
// writing to the live database, which is exactly the gap this closes.
//
// Run via `npm test` (see package.json). `npm run test:raw` bypasses this
// backstop (though not db.js's own guard, which still applies independently
// either way) — it exists only for debugging the test runner itself.

const path = require('node:path');
const crypto = require('node:crypto');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const { DatabaseSync } = require('node:sqlite');

const BACKEND_ROOT = path.join(__dirname, '..');
const LIVE_DB_PATH = path.join(BACKEND_ROOT, 'boardready.db');

// The complete, current set of tables in the live schema (see db.js) — kept
// as an explicit list, not derived from sqlite_master at runtime, so that a
// future schema change which silently dropped a table from this list would
// itself be a visible diff in code review, not something this script quietly
// stopped checking.
const ALL_TABLES = [
  'users', 'subjects', 'chapters', 'questions', 'source_documents',
  'source_files', 'source_document_files', 'visual_assets', 'duplicate_flags',
  'tests', 'test_questions', 'attempts', 'subscriptions', 'audit_log',
];

function snapshotLiveDb() {
  const hash = crypto.createHash('sha256').update(fs.readFileSync(LIVE_DB_PATH)).digest('hex');
  const db = new DatabaseSync(LIVE_DB_PATH, { readOnly: true });
  const rowCounts = {};
  try {
    for (const t of ALL_TABLES) {
      rowCounts[t] = db.prepare(`SELECT COUNT(*) as c FROM ${t}`).get().c;
    }
  } finally {
    db.close();
  }
  return { hash, rowCounts };
}

console.log('[test-guard] Capturing live database baseline before running tests...');
console.log(`[test-guard] LIVE DATABASE: ${LIVE_DB_PATH}`);
const baseline = snapshotLiveDb();
console.log(`[test-guard] Baseline SHA-256: ${baseline.hash}`);
console.log(`[test-guard] Baseline row counts: ${JSON.stringify(baseline.rowCounts)}`);
console.log('');

// Scoped explicitly to test/ — a bare `node --test` recursively scans the
// ENTIRE working directory for anything matching its default discovery
// patterns (verified empirically: it picked up
// docs/phase-4-migration-validation-artifacts/concurrency-test.js purely
// because its filename ends in "-test.js", and tried to run that standalone
// Postgres script as if it were a node:test file). Restricting discovery to
// test/ is what this project's actual test suite means.
const result = spawnSync('node', ['--test', 'test/*.test.js'], {
  cwd: BACKEND_ROOT,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'test' },
});

console.log('');
console.log('[test-guard] Re-checking live database after test run...');
const after = snapshotLiveDb();

const rowCountDiffs = ALL_TABLES
  .filter((t) => baseline.rowCounts[t] !== after.rowCounts[t])
  .map((t) => `${t}: ${baseline.rowCounts[t]} -> ${after.rowCounts[t]}`);
const liveDbChanged = baseline.hash !== after.hash || rowCountDiffs.length > 0;

if (liveDbChanged) {
  console.error('');
  console.error('================================================================');
  console.error('FATAL: LIVE DATABASE CHANGED DURING THE TEST RUN.');
  console.error(`  Hash before: ${baseline.hash}`);
  console.error(`  Hash after:  ${after.hash}`);
  if (rowCountDiffs.length) console.error(`  Row count changes: ${rowCountDiffs.join(', ')}`);
  console.error('  This is exactly the failure mode of incidents #1 and #2 — see');
  console.error('  docs/test-database-isolation-incident.md. Test isolation has been');
  console.error('  compromised somewhere in this run. Do NOT treat the individual test');
  console.error('  pass/fail results above as meaningful until this is investigated.');
  console.error('================================================================');
  process.exit(1);
}

console.log('[test-guard] OK — live database unchanged: hash and all 14 table row counts match the pre-run baseline.');
process.exit(result.status === null ? 1 : result.status);
