// Board Ready — database engine dispatcher (Phase 6A,
// docs/phase-6-postgres-cutover-plan.md). Two engines, selected by
// DB_ENGINE=sqlite|postgres (defaults to "sqlite"):
//   sqlite   -> db-sqlite.js  (node:sqlite DatabaseSync; self-migrating
//               schema; unchanged behavior from every phase before this one)
//   postgres -> db-postgres.js (pg.Pool; schema managed externally via
//               docs/phase-3-migration-artifacts/schema.sql + migrate.js)
//
// Defaulting to sqlite means every existing deployment, one-off script
// (the ~90 archive-*/ingest-*/backfill-*/reclassify-*/fix-* scripts,
// seed.js, debug-dup.js, audit-publication-readiness.js — none of which
// this phase touches, per the "never re-ingest completed sources" rule),
// and pre-Phase-6 test keeps running exactly as it did before this file was
// split into a dispatcher — this is a genuinely additive change, not a
// replacement, and the whole point of keeping the SQLite path intact is a
// real, working rollback: setting DB_ENGINE back to sqlite (or just leaving
// it unset) always gets the exact pre-Phase-6 behavior back.
//
// Both engines expose the identical shape the rest of the app depends on:
//   db.prepare(sql).get(...args)   -- sqlite: sync, returns a value.
//                                      postgres: async, returns a Promise.
//   db.prepare(sql).all(...args)   -- same sync/async split as .get().
//   db.prepare(sql).run(...args)   -- same sync/async split; returns
//                                      { changes, lastInsertRowid } (the
//                                      latter only populated when the SQL
//                                      text itself includes RETURNING —
//                                      see the ~4 call sites that need a
//                                      generated id back).
//   db.transaction(async (txDb) => {...})
//                                   -- runs the callback against one
//                                      consistent connection inside a real
//                                      BEGIN/COMMIT/ROLLBACK; used by the
//                                      three read-then-write attempt
//                                      endpoints in server.js.
//   db.ENGINE                      -- 'sqlite' | 'postgres', for the rare
//                                      genuinely engine-specific SQL
//                                      fragment (e.g. `FOR UPDATE`, which
//                                      SQLite doesn't support at all).
//   db.NOW_SQL                     -- "datetime('now')" | 'now()' — the
//                                      one other genuinely engine-specific
//                                      fragment this codebase needed.
//   db.ready()                     -- async; resolves once the engine has
//                                      confirmed real connectivity (an
//                                      immediate no-op for sqlite, a real
//                                      round-trip query for postgres).
//   db.DB_PATH / db.LIVE_DB_PATH / db.IS_TEST_MODE
//                                   -- unchanged reporting fields, per the
//                                      test-database-isolation spec.
//
// Every call site in this app's 6 database-touching runtime files
// (server.js, practice.js, readiness.js, diagnostics.js, content-rules.js,
// and this dispatcher's own two engine modules internally) now says
// `await db.prepare(sql).get(...)` (etc). `await` on a plain synchronous
// value (what the sqlite engine still returns) simply resolves it on the
// next microtask, so the exact same call site is correct under EITHER
// engine with no per-file, per-call branching — this is the "mechanical
// await, no branching" design the Phase 6A plan committed to instead of
// reusing Phase 4's pg-compat-shim.js alias-map/camelize approach.

const RAW_DB_ENGINE = process.env.DB_ENGINE || 'sqlite';
const DB_ENGINE = RAW_DB_ENGINE.toLowerCase();
if (DB_ENGINE !== 'sqlite' && DB_ENGINE !== 'postgres') {
  throw new Error(`FATAL: unknown DB_ENGINE "${RAW_DB_ENGINE}" — must be "sqlite" or "postgres" (or unset, which defaults to "sqlite").`);
}

// Test-mode detection is engine-independent and computed once here so both
// engines' own isolation guards see the exact same verdict (each engine
// module also redundantly re-derives it from process.env directly as a
// second, independent layer — see db-sqlite.js's comment on why that
// redundancy is deliberate, not leftover duplication).
const LAUNCHED_WITH_NODE_TEST_FLAG = process.execArgv.some((a) => a === '--test' || a.startsWith('--test='))
  || process.argv.some((a) => a === '--test' || a.startsWith('--test='));
const IS_TEST_MODE = process.env.NODE_ENV === 'test' || Boolean(process.env.NODE_TEST_CONTEXT) || LAUNCHED_WITH_NODE_TEST_FLAG;
const TEST_MODE_DIAGNOSTICS = `NODE_ENV=${JSON.stringify(process.env.NODE_ENV)}, NODE_TEST_CONTEXT=${JSON.stringify(process.env.NODE_TEST_CONTEXT)}, --test flag: ${LAUNCHED_WITH_NODE_TEST_FLAG}`;

const db = DB_ENGINE === 'postgres'
  ? require('./db-postgres')(IS_TEST_MODE, TEST_MODE_DIAGNOSTICS)
  : require('./db-sqlite')(IS_TEST_MODE, TEST_MODE_DIAGNOSTICS);

module.exports = db;
