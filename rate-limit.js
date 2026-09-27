// Simple in-memory sliding-window rate limiter (Phase 5 security hardening,
// 2026-09-24 — see docs/phase-5-security-audit-report.md, item 3).
//
// No external dependency, consistent with this project's zero-runtime-
// dependency design. In-memory is a real, documented limitation: it's
// correct and sufficient for a single-process deployment (today's reality —
// node:sqlite's DatabaseSync is itself single-connection, so this app
// already only runs as one process), but a multi-instance deployment behind
// a load balancer would need a shared store (e.g. Redis) since each
// instance would otherwise track its own separate counters. Out of scope
// until the app actually runs on more than one instance.

const buckets = new Map(); // key -> array of attempt timestamps (ms), ascending

const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const DEFAULT_MAX_ATTEMPTS = 10; // per key, per window

// Returns { allowed, retryAfterMs } and, if allowed, records this attempt.
// A rejected attempt is NOT recorded again (it doesn't extend the window),
// so a client that keeps hammering past the limit doesn't get an
// ever-receding retry time.
function checkAndRecord(key, { windowMs = DEFAULT_WINDOW_MS, maxAttempts = DEFAULT_MAX_ATTEMPTS } = {}) {
  const now = Date.now();
  const timestamps = (buckets.get(key) || []).filter((t) => now - t < windowMs);
  if (timestamps.length >= maxAttempts) {
    buckets.set(key, timestamps);
    return { allowed: false, retryAfterMs: Math.max(0, windowMs - (now - timestamps[0])) };
  }
  timestamps.push(now);
  buckets.set(key, timestamps);
  return { allowed: true };
}

// Prevents unbounded memory growth in a long-running process — drops keys
// with no timestamps left inside the window. Call periodically (see
// server.js), never from inside a request handler.
function cleanup({ windowMs = DEFAULT_WINDOW_MS } = {}) {
  const now = Date.now();
  for (const [key, timestamps] of buckets) {
    const fresh = timestamps.filter((t) => now - t < windowMs);
    if (fresh.length === 0) buckets.delete(key);
    else buckets.set(key, fresh);
  }
}

// Test-only: fully reset all rate-limit state. Never called from
// application code — only from test setup, so one test's hammering of an
// endpoint doesn't bleed into the next test's expectations.
function _resetForTests() { buckets.clear(); }

module.exports = { checkAndRecord, cleanup, _resetForTests };
