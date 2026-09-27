// Centralized environment configuration + startup validation (Phase 5
// security hardening, 2026-09-24 — see docs/phase-5-security-audit-report.md,
// items 1/2/13).
//
// Deliberately separate from db.js's own environment handling: db.js's
// test-database-isolation guard (see docs/test-database-isolation-incident.md)
// is a different, already-hardened concern specific to DB_PATH/NODE_TEST_CONTEXT
// and must not be touched or duplicated here. This file only concerns the
// application-level config auth.js/server.js need.

const crypto = require('node:crypto');

const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 4000;

// AUTH_SECRET must be a real, explicit, stable value in production — tokens
// have to remain valid across restarts and be identical across every
// instance behind a load balancer, so a per-process random value would
// silently invalidate every session on every deploy or fail to validate a
// token signed by a sibling instance. Refusing to start is the fail-closed
// choice: a production deployment that "works" on a guessable secret is
// worse than one that doesn't start at all.
//
// In development/test, an explicit AUTH_SECRET is still honored if given,
// but when none is set we generate a fresh random secret for THIS PROCESS
// ONLY, rather than falling back to a fixed literal committed to source
// (the old behavior — anyone who has read this repository, which is
// everyone, could forge a valid token for any user with the old default).
// A per-process random secret is safe here because signing and verification
// always happen within the same process during a dev/test run.
let AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) {
  if (IS_PRODUCTION) {
    throw new Error(
      'FATAL: AUTH_SECRET is not set. Refusing to start in production without ' +
      'a real, explicit AUTH_SECRET — signing tokens with a guessable or ' +
      'process-local secret is not safe for production traffic. Set ' +
      'AUTH_SECRET in the environment (see .env.example) before starting.'
    );
  }
  AUTH_SECRET = crypto.randomBytes(32).toString('hex');
  // eslint-disable-next-line no-console
  console.warn('[config] AUTH_SECRET not set — generated a random secret for this process only. Fine for development/test; NEVER acceptable for production (see startup check above).');
}

// Off by default (empty array = current behavior: no CORS headers at all,
// same-origin only). A comma-separated allowlist, never a wildcard — see
// docs/phase-5-security-audit-report.md, item 6.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

module.exports = { NODE_ENV, IS_PRODUCTION, PORT, AUTH_SECRET, ALLOWED_ORIGINS };
