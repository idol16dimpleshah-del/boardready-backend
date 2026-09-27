// Minimal self-contained auth: scrypt password hashing + a signed,
// expiring bearer token. No external JWT library — this is a small enough
// surface that a dependency would add more risk (supply chain, API churn)
// than it removes. REBUILT from scratch (see REBUILD_NOTES.md).

const crypto = require('node:crypto');
const { AUTH_SECRET } = require('./config');

// 2026-09-24 (Phase 5 security hardening): SECRET now comes from config.js,
// which requires a real value in production and refuses to start without
// one — see docs/phase-5-security-audit-report.md, item 1. It no longer
// falls back to a literal committed to source here.
const SECRET = AUTH_SECRET;
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const check = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(check, 'hex'));
}

function sign(payload) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + TOKEN_TTL_MS })).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return `${body}.${sig}`;
}

function verify(token) {
  if (!token) return null;
  const [body, sig] = String(token).split('.');
  if (!body || !sig) return null;
  const expectedSig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  if (sig.length !== expectedSig.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
  let payload;
  try { payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')); } catch { return null; }
  if (!payload.exp || payload.exp < Date.now()) return null;
  return payload;
}

module.exports = { hashPassword, verifyPassword, sign, verify };
