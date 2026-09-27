// Stage 6B (docs/phase-6-postgres-cutover-plan.md) — shared helper that lets
// the EXISTING test files run, unmodified in intent, against either engine.
// Every test file that touches the database sets its own DB_PATH (sqlite) or
// DATABASE_URL (postgres) on process.env before requiring anything from the
// backend (db.js resolves its engine and connection at require time) — this
// module is just the part of that setup that's genuinely engine-specific,
// factored out so it isn't duplicated differently in every test file.
//
// Engine selection is read from DB_ENGINE, exactly like db.js itself reads
// it — set DB_ENGINE=postgres in the environment invoking `npm test` (or
// `node --test`) to run the whole suite against Postgres instead of the
// sqlite default. Nothing here ever touches the live database or a
// preserved/backup copy: like db-sqlite.js's file-path denylist and
// db-postgres.js's database-name denylist, a caller can never make this
// helper hand back a connection to `boardready`/`boardready_production`/
// `boardready_staging` — see FORBIDDEN_DB_NAMES below.
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

const SCHEMA_SQL_PATH = path.join(__dirname, '..', 'docs', 'phase-3-migration-artifacts', 'schema.sql');
const FORBIDDEN_DB_NAMES = new Set(['boardready', 'boardready_production', 'boardready_staging']);
// This role/password pair is the one Stage 6A created in this sandbox
// specifically for disposable local Postgres testing — never a real
// deployment credential. Overridable via env for a future environment where
// a different local superuser/role is available.
const PG_ADMIN_ROLE = process.env.PG_TEST_ADMIN_ROLE || 'boardready_migration';
const PG_ADMIN_PASSWORD = process.env.PG_TEST_ADMIN_PASSWORD || 'boardready_dev_pw';
const PG_CONN_BASE = process.env.PG_TEST_CONN_BASE || `postgres://${PG_ADMIN_ROLE}:${PG_ADMIN_PASSWORD}@127.0.0.1:5432`;

function currentEngine() {
  return (process.env.DB_ENGINE || 'sqlite').toLowerCase();
}

// Synchronous on purpose (execFileSync, not the pg client) — test files need
// this to run at module-load time, before any `require('../db')`, the same
// timing constraint that already governs DB_PATH assignment on the sqlite
// side. Runs schema.sql fresh into a brand-new database every time, exactly
// mirroring what a real Stage 6B migration run does at a larger scale (see
// the dedicated migration-from-a-real-SQLite-copy check, which is separate
// from this per-test-file fixture provisioning).
function createAndMigratePostgresDbSync(name) {
  if (FORBIDDEN_DB_NAMES.has(name)) {
    throw new Error(`FATAL: refusing to create a test database named "${name}" — reserved production/staging name.`);
  }
  execFileSync('sudo', ['-u', 'postgres', 'createdb', '-O', PG_ADMIN_ROLE, name], { stdio: 'pipe' });
  execFileSync('sudo', ['-u', 'postgres', 'psql', '-d', name, '-f', SCHEMA_SQL_PATH], { stdio: 'pipe' });
  return `${PG_CONN_BASE}/${name}`;
}

function dropPostgresDbSync(name) {
  if (FORBIDDEN_DB_NAMES.has(name)) return; // never drop anything with a reserved name, even on cleanup
  try {
    // A test file's own `db` (a pg.Pool) is never explicitly closed before
    // its after() hook runs, and a just-`.kill()`ed spawned child server may
    // not have fully torn down its own pool's connections yet either — both
    // would otherwise make a plain DROP DATABASE fail with "database is
    // being accessed by other users". Force-terminate every other backend
    // connected to this specific disposable database first (never anything
    // outside it — `datname = $1` scopes this to exactly the one database
    // being torn down), then drop it. Best-effort throughout: a failure here
    // leaves an orphaned disposable test database behind, never touches the
    // live one, and never fails the test run itself.
    execFileSync('sudo', ['-u', 'postgres', 'psql', '-d', 'postgres', '-c',
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${name}' AND pid <> pg_backend_pid();`],
      { stdio: 'pipe' });
  } catch { /* fine — nothing to terminate, or the database never existed */ }
  try { execFileSync('sudo', ['-u', 'postgres', 'dropdb', '--if-exists', name], { stdio: 'pipe' }); } catch { /* best-effort cleanup, never fails the test run */ }
}

function safeLabel(label) {
  return String(label).replace(/[^a-z0-9]+/gi, '_').toLowerCase();
}

// The PRIMARY provisioning call for a test file — mutates process.env
// (NODE_ENV, plus DB_PATH or DATABASE_URL) exactly the way each test file
// used to do inline for sqlite, so it must be called before that file
// requires db.js or anything that transitively requires it. Returns the env
// object to hand to any spawned child `node server.js` process (a child
// does not inherit env changes made after it's spawned, so every spawn call
// still passes this explicitly rather than assuming `...process.env` alone
// carries it — same discipline the original sqlite-only code already used),
// plus a cleanup() to call in the file's own after() hook.
function setupPrimaryTestDbEnv(label) {
  const engine = currentEngine();
  process.env.NODE_ENV = 'test';
  if (engine === 'postgres') {
    const dbName = `boardready_test_${safeLabel(label)}_${process.pid}_${Date.now()}`;
    const url = createAndMigratePostgresDbSync(dbName);
    process.env.DB_ENGINE = 'postgres';
    process.env.DATABASE_URL = url;
    return {
      engine, dbName,
      childEnv: { DB_ENGINE: 'postgres', DATABASE_URL: url, NODE_ENV: 'test' },
      cleanup() { dropPostgresDbSync(dbName); },
    };
  }
  const dbPath = path.join(os.tmpdir(), `boardready-${safeLabel(label)}-${process.pid}-${Date.now()}.db`);
  process.env.DB_PATH = dbPath;
  return {
    engine, dbPath,
    childEnv: { DB_PATH: dbPath, NODE_ENV: 'test' },
    cleanup() {
      for (const suffix of ['', '-journal', '-wal', '-shm']) {
        try { fs.unlinkSync(dbPath + suffix); } catch { /* fine if it never existed */ }
      }
    },
  };
}

// For a SECONDARY, independently-isolated database within the same test
// file (e.g. security.test.js's separate rate-limit and CORS suites, each
// historically on their own sqlite file so hammering one never interferes
// with another) — does NOT touch process.env, since these are only ever
// handed to a spawned child's own env, never read by this parent process's
// own `require('../db')`.
function provisionIsolatedDb(label) {
  const engine = currentEngine();
  if (engine === 'postgres') {
    const dbName = `boardready_test_${safeLabel(label)}_${process.pid}_${Date.now()}`;
    const url = createAndMigratePostgresDbSync(dbName);
    return {
      engine, dbName,
      childEnv: { DB_ENGINE: 'postgres', DATABASE_URL: url, NODE_ENV: 'test' },
      cleanup() { dropPostgresDbSync(dbName); },
    };
  }
  const dbPath = path.join(os.tmpdir(), `boardready-${safeLabel(label)}-${process.pid}-${Date.now()}.db`);
  return {
    engine, dbPath,
    childEnv: { DB_PATH: dbPath, NODE_ENV: 'test' },
    cleanup() {
      for (const suffix of ['', '-journal', '-wal', '-shm']) {
        try { fs.unlinkSync(dbPath + suffix); } catch { /* fine if it never existed */ }
      }
    },
  };
}

// Exported (Stage 7 deep QA, docs/stage7-deep-qa-report.md) so a test file
// can deliberately sever a running server's OWN database mid-test — e.g. to
// prove /api/health reports 503 on a genuine lost connection rather than a
// simulated one — without duplicating this termination/drop logic. Never
// call this on anything but a database this same test run provisioned;
// FORBIDDEN_DB_NAMES above is the backstop either way.
module.exports = { setupPrimaryTestDbEnv, provisionIsolatedDb, dropPostgresDbSync, currentEngine, FORBIDDEN_DB_NAMES };
