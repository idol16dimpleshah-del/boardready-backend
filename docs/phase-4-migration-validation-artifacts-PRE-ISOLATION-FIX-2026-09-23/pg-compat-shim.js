// Phase 4 — PostgreSQL compatibility shim. A NEW, SEPARATE file, not a
// modification of the live application's db.js/server.js. Its only purpose
// here is to prove the two Phase 3 query-compatibility findings are real,
// fixable, and fixed -- as a design artifact for the eventual Phase 6/7
// cutover, not as a change to the running app.
//
// Fixes proven:
//   1. Alias-casing: Postgres folds unquoted identifiers to lowercase. This
//      shim exposes a `camel(rows)` helper that converts every returned row's
//      lowercase-folded keys to camelCase using a supplied alias map, so
//      application code can keep reading r.subjectCount unchanged.
//   2. COUNT()/bigint-as-string: this shim's `query()` wrapper accepts a
//      `numericColumns` option naming which result columns to coerce with
//      Number(), so `acc.subjects + r.subjectCount` is real addition again,
//      not string concatenation.

const { Client } = require('pg');

function camelize(rows, aliasMap) {
  return rows.map((row) => {
    const out = {};
    for (const [lower, value] of Object.entries(row)) {
      out[aliasMap[lower] || lower] = value;
    }
    return out;
  });
}

function coerceNumeric(rows, numericColumns) {
  if (!numericColumns || !numericColumns.length) return rows;
  return rows.map((row) => {
    const out = { ...row };
    for (const c of numericColumns) if (out[c] != null) out[c] = Number(out[c]);
    return out;
  });
}

class PgCompat {
  constructor(config) { this.client = new Client(config); }
  async connect() { await this.client.connect(); }
  async end() { await this.client.end(); }

  // opts.aliasMap: { lowercasealias: 'camelCaseAlias', ... }
  // opts.numericColumns: ['camelCaseAlias', ...] (applied AFTER camelization)
  async query(sql, params, opts = {}) {
    const result = await this.client.query(sql, params);
    let rows = opts.aliasMap ? camelize(result.rows, opts.aliasMap) : result.rows;
    rows = coerceNumeric(rows, opts.numericColumns);
    return rows;
  }
}

module.exports = { PgCompat, camelize, coerceNumeric };
