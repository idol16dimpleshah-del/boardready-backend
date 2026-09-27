// Phase 4 -- database-layer concurrency test. Talks ONLY to the PostgreSQL
// test database via a connection pool -- never server.js, never node --test,
// never SQLite. Zero risk of touching the live database (see this session's
// two incident reports for why that risk is being explicitly designed out
// here rather than merely avoided by care).
//
// Scope, stated honestly: this proves the DATABASE LAYER can execute many
// requests truly concurrently under a pool, in contrast to node:sqlite's
// DatabaseSync (a single blocking connection, confirmed in the Phase 9
// audit). It does NOT stand up the live HTTP application under load --
// that requires the async/placeholder/RETURNING-id rewrite cataloged as
// Phase 6/7 work in the Phase 3 report, Section 9, and is explicitly out of
// scope until that rewrite exists. Per the user's own calendar, full
// HTTP-level concurrency testing is Phase 7, not Phase 4.

const { Pool } = require('pg');
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const POOL_CONFIG = { host: '127.0.0.1', port: 5432, user: 'boardready_migration', password: 'test_local_only', database: 'boardready_migration_test', max: 10 };

// The real query behind /api/attempts/:id/questions's feedback_mode lookup
// plus a representative join, run concurrently many times over.
const SAMPLE_SQL = `
  SELECT a.id, a.student_id, t.feedback_mode, t.duration_seconds
  FROM attempts a JOIN tests t ON t.id = a.test_id
  WHERE a.id = $1`;

async function concurrentPostgresRun(n) {
  const pool = new Pool(POOL_CONFIG);
  const attemptIds = (await pool.query('SELECT id FROM attempts ORDER BY id LIMIT $1', [n])).rows.map((r) => r.id);
  const start = process.hrtime.bigint();
  await Promise.all(attemptIds.map((id) => pool.query(SAMPLE_SQL, [id])));
  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
  await pool.end();
  return { n: attemptIds.length, elapsedMs, mode: 'postgres-pool-concurrent' };
}

async function sequentialSqliteRun(n) {
  const sqlite = new DatabaseSync(path.join(__dirname, 'sqlite-copy-for-migration-test.db'), { readOnly: true });
  const stmt = sqlite.prepare(`SELECT a.id, a.student_id, t.feedback_mode, t.duration_seconds FROM attempts a JOIN tests t ON t.id = a.test_id WHERE a.id = ?`);
  const attemptIds = sqlite.prepare('SELECT id FROM attempts ORDER BY id LIMIT ?').all(n).map((r) => r.id);
  const start = process.hrtime.bigint();
  // DatabaseSync is synchronous by construction -- there is no concurrent
  // form of this call to even attempt; this measures the honest baseline:
  // N requests against a single blocking connection, which is what every
  // concurrent HTTP request hits today, one at a time, regardless of how
  // many arrive at once.
  for (const id of attemptIds) stmt.get(id);
  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
  sqlite.close();
  return { n: attemptIds.length, elapsedMs, mode: 'sqlite-databasesync-sequential' };
}

// A concurrency-SAFETY check, not just a speed check: fire many simultaneous
// increments at the pool against ONE shared counter row (simulating several
// students hitting /api/attempts/:id/check for the same attempt at once) and
// confirm the final count is exactly right -- i.e. no lost updates -- using
// a real transaction with row locking, the pattern recommended in the Phase
// 3 report's concurrency design section.
async function concurrencySafetyCheck(concurrency) {
  const pool = new Pool(POOL_CONFIG);
  await pool.query('CREATE TABLE IF NOT EXISTS concurrency_probe (id INT PRIMARY KEY, counter INT NOT NULL)');
  await pool.query('DELETE FROM concurrency_probe');
  await pool.query('INSERT INTO concurrency_probe (id, counter) VALUES (1, 0)');

  async function safeIncrement() {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('SELECT counter FROM concurrency_probe WHERE id = 1 FOR UPDATE'); // row lock -- the fix the Phase 3 report recommends
      await client.query('UPDATE concurrency_probe SET counter = counter + 1 WHERE id = 1');
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
  async function unsafeIncrement() {
    // Deliberately reproduces the read-modify-write race the Phase 3 report
    // warned about (no lock, no transaction) -- to prove the risk is real,
    // not just theoretical, before recommending the fix above.
    const { rows } = await pool.query('SELECT counter FROM concurrency_probe WHERE id = 1');
    const current = rows[0].counter;
    await new Promise((r) => setTimeout(r, 1)); // exaggerate the race window, same technique used to reliably reproduce a lost-update bug in a test
    await pool.query('UPDATE concurrency_probe SET counter = $1 WHERE id = 1', [current + 1]);
  }

  await pool.query('UPDATE concurrency_probe SET counter = 0');
  await Promise.all(Array.from({ length: concurrency }, () => safeIncrement()));
  const safeResult = (await pool.query('SELECT counter FROM concurrency_probe WHERE id = 1')).rows[0].counter;

  await pool.query('UPDATE concurrency_probe SET counter = 0');
  await Promise.all(Array.from({ length: concurrency }, () => unsafeIncrement()));
  const unsafeResult = (await pool.query('SELECT counter FROM concurrency_probe WHERE id = 1')).rows[0].counter;

  await pool.query('DROP TABLE concurrency_probe');
  await pool.end();
  return { concurrency, expected: concurrency, safeResult, unsafeResult, safePathCorrect: safeResult === concurrency, unsafePathLostUpdates: unsafeResult !== concurrency };
}

async function main() {
  console.log('=== Throughput: N concurrent Postgres-pool queries vs N sequential SQLite (DatabaseSync) queries ===');
  const results = {};
  for (const n of [10, 50, 100]) {
    const pgResult = await concurrentPostgresRun(n);
    const sqliteResult = await sequentialSqliteRun(n);
    results[n] = { pgResult, sqliteResult, speedup: (sqliteResult.elapsedMs / pgResult.elapsedMs).toFixed(2) + 'x' };
    console.log(`n=${n}: Postgres (concurrent, pooled) ${pgResult.elapsedMs.toFixed(1)}ms | SQLite (sequential, DatabaseSync) ${sqliteResult.elapsedMs.toFixed(1)}ms | speedup ${results[n].speedup}`);
  }

  console.log('\n=== Concurrency SAFETY: 25 simultaneous increments on one shared row ===');
  const safety = await concurrencySafetyCheck(25);
  console.log(`Expected final count: ${safety.expected}`);
  console.log(`WITH row-locking transaction (recommended pattern): ${safety.safeResult} -- ${safety.safePathCorrect ? 'CORRECT, no lost updates' : 'WRONG -- investigate'}`);
  console.log(`WITHOUT locking (naive read-modify-write, the risk flagged in the Phase 3 report): ${safety.unsafeResult} -- ${safety.unsafePathLostUpdates ? 'LOST UPDATES REPRODUCED (confirms the real risk)' : 'no lost updates this run (race not always guaranteed to trigger, but the pattern is still unsafe)'}`);

  require('node:fs').writeFileSync(
    path.join(__dirname, 'concurrency-test-report.json'),
    JSON.stringify({ throughput: results, safety, generatedAt: new Date().toISOString() }, null, 2)
  );
}

main().catch((err) => { console.error('FAILED:', err); process.exit(1); });
