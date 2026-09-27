// Board Ready — PostgreSQL adapter (Phase 6A). Selected via DB_ENGINE=postgres
// (see db.js, the engine dispatcher). Exposes the exact same shape
// db-sqlite.js does — db.prepare(sql).get/.all/.run(...), db.transaction(fn),
// db.ENGINE, db.NOW_SQL, db.DB_PATH, db.LIVE_DB_PATH, db.IS_TEST_MODE,
// db.ready() — so the app's 6 database-touching runtime files (server.js,
// practice.js, readiness.js, diagnostics.js, content-rules.js, and db.js
// itself) needed only a mechanical `await` added at each call site, never a
// per-engine branch. See docs/phase-6-postgres-cutover-plan.md section 3 for
// the full design and docs/phase-3-migration-design-report.md /
// docs/phase-4-migration-validation-report.md for the underlying schema
// mapping and cross-engine compatibility findings this file works around.
//
// SCHEMA IS NOT MANAGED HERE. Unlike db-sqlite.js (which creates and
// additively migrates its own schema on every load — a pattern that made
// sense for a single, always-local SQLite file), this file assumes the
// target Postgres database has already been provisioned by
// docs/phase-3-migration-artifacts/schema.sql, applied via
// docs/phase-3-migration-artifacts/migrate.js or an equivalent migration
// run. That mirrors how a real production Postgres deployment actually
// works — migrations are a deliberate, separate, reviewable step, never an
// implicit side effect of the app process starting up — and avoids the
// much harder problem of running async DDL from a module that (being
// CommonJS, not ESM) cannot use top-level await. If this module is ever
// pointed at a database whose schema hasn't been provisioned yet, the very
// first real query will fail with a clear Postgres "relation does not
// exist" error rather than silently doing nothing; db.ready() (below) is
// the deliberate hook for a caller to surface that even earlier and more
// clearly, before serving any real request.
//
// KNOWN, DELIBERATE PLACEHOLDER-TRANSLATION ASSUMPTION: translatePlaceholders
// below does a naive positional `?` -> `$1, $2, ...` replace. This is safe
// only because none of this project's own SQL text contains a literal '?'
// character inside a string literal — verified by direct inspection of
// every query in db.js/server.js/practice.js/readiness.js/diagnostics.js/
// content-rules.js as of this writing. A future query that genuinely needs
// a literal '?' in a string would need a smarter (quote-aware) translator;
// flagging this here rather than over-engineering a parser this codebase
// has never once needed.

const { Pool } = require('pg');

// Same fail-closed philosophy as db-sqlite.js's file-path-based guard,
// adapted to what a Postgres connection actually has to check by: not a
// path, but a DATABASE NAME. Denylists the literal names a real deployment
// of this project would plausibly use for its actual production/staging
// databases, so a test run can never be pointed at one of them even with an
// explicit-but-wrong DATABASE_URL — exactly the same "explicit but wrong is
// just as unsafe as implicit" reasoning db-sqlite.js's own guard comment
// gives for its own denylist.
const FORBIDDEN_TEST_DB_NAMES = new Set(['boardready', 'boardready_production', 'boardready_staging']);

function extractDatabaseName(connectionString) {
  if (!connectionString) return null;
  try {
    const u = new URL(connectionString);
    const name = (u.pathname || '').replace(/^\//, '');
    return name || null;
  } catch {
    return null;
  }
}

function translatePlaceholders(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}

module.exports = function createPostgresDb(isTestMode, testModeDiagnostics) {
  const connectionString = process.env.DATABASE_URL || null;

  if (isTestMode) {
    if (!connectionString || !connectionString.trim()) {
      throw new Error(
        'FATAL: Postgres test-database isolation guard tripped in db-postgres.js.\n' +
        `  Detected test context (${testModeDiagnostics}) but no DATABASE_URL was provided.\n` +
        '  Refusing to open any database. There is no default test database and this\n' +
        '  code will NEVER silently fall back to a real database. Set DATABASE_URL to an\n' +
        '  explicit, dedicated, disposable test database (e.g. postgres://.../boardready_test)\n' +
        '  before running tests against DB_ENGINE=postgres.'
      );
    }
    const dbName = extractDatabaseName(connectionString);
    if (dbName && FORBIDDEN_TEST_DB_NAMES.has(dbName.toLowerCase())) {
      throw new Error(
        'FATAL: Postgres test-database isolation guard tripped in db-postgres.js.\n' +
        `  DATABASE_URL points at a database named "${dbName}", a reserved production-\n` +
        '  or-staging-sounding name. Refusing to open it for a test run. A test run must\n' +
        '  use a dedicated, disposable database with its own distinct name (e.g.\n' +
        '  "boardready_test", or a per-run name like "boardready_test_<pid>").'
      );
    }
    process.stderr.write(`[db-postgres.js] TEST DATABASE: ${dbName || '(unnamed — check DATABASE_URL)'}\n`);
  }

  const pool = new Pool(connectionString ? { connectionString } : undefined);
  // An idle pooled client can emit a background 'error' event (e.g. the
  // server restarting the connection) — node's default behavior for an
  // unhandled 'error' event on a non-stream EventEmitter is to crash the
  // whole process, which would take down the API for a problem the pool
  // itself is designed to recover from on the next checkout. Log, don't die.
  pool.on('error', (err) => {
    console.error('[db-postgres.js] idle client error (pool will recover on next use):', err);
  });

  // Shared by both the plain pool (ordinary, non-transactional calls) and a
  // single checked-out client (inside db.transaction() below) — both expose
  // the same .query(text, params) shape, so this one function builds the
  // same db.prepare(sql).get/.all/.run() surface for either.
  function wrapQueryable(queryable, engineExtras) {
    return {
      prepare(sql) {
        const translated = translatePlaceholders(sql);
        const hasReturning = /\breturning\b/i.test(sql);
        return {
          async get(...params) {
            const res = await queryable.query(translated, params);
            return res.rows[0];
          },
          async all(...params) {
            const res = await queryable.query(translated, params);
            return res.rows;
          },
          async run(...params) {
            const res = await queryable.query(translated, params);
            return {
              changes: res.rowCount,
              lastInsertRowid: hasReturning && res.rows[0] ? res.rows[0].id : undefined,
              rows: res.rows,
            };
          },
        };
      },
      exec(sql) {
        // Only ever used for BEGIN/COMMIT/ROLLBACK-style statements today —
        // real schema DDL is deliberately out of scope for this engine (see
        // the file header). Fire-and-forget is fine for those; callers that
        // need the result use .query() via prepare() instead.
        return queryable.query(sql);
      },
      ENGINE: 'postgres',
      NOW_SQL: 'now()',
      ...engineExtras,
    };
  }

  const db = wrapQueryable(pool);

  // Transaction + row-locking support (Stage 6A) — the actual reason this
  // engine needs a transaction helper at all, unlike SQLite's: a pooled,
  // async connection genuinely allows two requests to interleave between a
  // read and its later write, which is exactly the lost-update race Phase
  // 4's concurrency-test.js proved happens without locking (25/25 correct
  // WITH a `SELECT ... FOR UPDATE` inside a transaction vs. 1/25 without).
  // server.js wraps POST /api/attempts/:id/check, PATCH
  // /api/attempts/:id/answers, and POST /api/attempts/:id/submit in this —
  // the three endpoints that read an attempt row, decide something from it,
  // and write it back, all inside one HTTP request.
  db.transaction = async function transaction(fn) {
    const client = await pool.connect();
    const txDb = wrapQueryable(client);
    try {
      await client.query('BEGIN');
      const result = await fn(txDb);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      try { await client.query('ROLLBACK'); } catch { /* connection likely already unusable */ }
      throw err;
    } finally {
      client.release();
    }
  };

  // Deliberately a callable (not a stored promise) — a stored promise
  // created at module-load time and never awaited by an out-of-scope
  // script would surface as an unhandled-rejection warning the moment the
  // pool can't connect, for a script that never asked to use this engine
  // in the first place. Callers that care (server.js at startup, the
  // Stage 6B test bootstrap) explicitly `await db.ready()` and get a clear,
  // immediate failure instead of the first real request hitting an opaque
  // connection error.
  db.ready = async function ready() {
    await pool.query('SELECT 1');
    return true;
  };

  // Stage 6C graceful-shutdown support (server.js's SIGTERM/SIGINT handler)
  // — a hosting platform (Railway et al) sends SIGTERM before killing an
  // instance on every deploy/restart; closing the pool cleanly here lets
  // in-flight queries finish and releases connections back to the managed
  // Postgres instance instead of leaving them to time out server-side.
  db.close = async function close() {
    await pool.end();
  };

  db.IS_TEST_MODE = isTestMode;
  const dbName = extractDatabaseName(connectionString);
  db.DB_PATH = `postgres:${dbName || '(PG* env vars)'}`;
  db.LIVE_DB_PATH = null; // no notion of "the live sqlite file" on this engine

  return db;
};
