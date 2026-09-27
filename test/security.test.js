// Phase 5 security hardening — regression tests (2026-09-24). See
// docs/phase-5-security-audit-report.md for the audit these fixes answer,
// and docs/phase-5-security-hardening-report.md for the summary of what
// changed. Covers: rate limiting actually tripping, malformed-login input
// validation, the generic-500 error boundary never leaking an internal
// error message, feedback_mode server-side enforcement on /check, cross-
// student attempt access rejection, the answer key staying absent before
// submission, the baseline security headers, and default-off CORS.
//
// ---------------------------------------------------------------------------
// TEST-DATABASE ISOLATION — same discipline as test/readiness.test.js (see
// docs/test-database-isolation-incident.md for why this exists and what it
// replaced). NODE_ENV/DB_PATH are set on process.env, to unique throwaway
// files, BEFORE this file requires anything from the backend (db.js and
// everything that transitively requires it resolve DB_PATH at require
// time). Every spawned server child process below is given its own
// explicit NODE_ENV/DB_PATH directly in its env object — never
// `...process.env` alone, which only carries forward whatever happened to
// already be set, not necessarily by this file. db.js's own fail-closed
// guard is the independent backstop underneath all of this: even if every
// line below were accidentally removed, db.js refuses outright to open the
// live database (or any known backup/preservation copy) in a detected test
// context with no explicit, verified-safe DB_PATH.
// ---------------------------------------------------------------------------
const path = require('node:path');

// Phase 6B (docs/phase-6-postgres-cutover-plan.md): setupPrimaryTestDbEnv /
// provisionIsolatedDb pick sqlite (a unique temp file, as before) or
// postgres (a fresh, disposable, schema-migrated database) based on
// DB_ENGINE, and set the right env var(s) before anything below requires
// db.js — same timing requirement the original inline DB_PATH assignment
// had. This file needs THREE independent databases (main suite, rate-limit
// suite, CORS suite — each on its own server so hammering one can never
// interfere with another, exactly as before); only the main suite's is
// "primary" (it's the one this parent process's own `require('../db')`
// opens, for the direct fixture inserts in its before() hook below) — the
// other two are "isolated" (only ever handed to their own spawned child's
// env, never touched by this parent process).
const { setupPrimaryTestDbEnv, provisionIsolatedDb } = require('./pg-test-support');
const dbCtx = setupPrimaryTestDbEnv('security_main');

const { test, describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');

const db = require('../db');
const rateLimit = require('../rate-limit');

if (db.DB_PATH === db.LIVE_DB_PATH) {
  throw new Error(`FATAL: test DB_PATH (${db.DB_PATH}) resolved to the same path as the live database (${db.LIVE_DB_PATH}). Refusing to run tests.`);
}
if (!db.IS_TEST_MODE) {
  throw new Error('FATAL: db.js did not recognize this as a test run (IS_TEST_MODE is false). Refusing to run tests.');
}
console.log(`[security.test.js] LIVE DATABASE: ${db.LIVE_DB_PATH}`);
console.log(`[security.test.js] TEST DATABASE: ${db.DB_PATH}`);

const BACKEND_ROOT = path.join(__dirname, '..');

async function waitForServer(base, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try { const res = await fetch(`${base}/api/subjects`); if (res.ok || res.status === 404) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Server at ${base} did not become ready in time`);
}
function makeApi(base) {
  return async function api(method, urlPath, { token, body } = {}) {
    const res = await fetch(`${base}${urlPath}`, {
      method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let json = null; try { json = await res.json(); } catch { /* no body */ }
    return { status: res.status, headers: res.headers, body: json };
  };
}
// ---------------------------------------------------------------------------
// (A) Unit tests — rate-limit.js's pure sliding-window logic, no server
// involved. Complements the HTTP-level rate-limit tests in (D) below, which
// prove the limiter is actually wired into the real endpoints.
// ---------------------------------------------------------------------------
test('unit: rate-limit checkAndRecord allows up to maxAttempts then rejects, and a rejected attempt does not itself extend the window', () => {
  rateLimit._resetForTests();
  const opts = { windowMs: 60_000, maxAttempts: 3 };
  assert.equal(rateLimit.checkAndRecord('k', opts).allowed, true);
  assert.equal(rateLimit.checkAndRecord('k', opts).allowed, true);
  assert.equal(rateLimit.checkAndRecord('k', opts).allowed, true);
  const fourth = rateLimit.checkAndRecord('k', opts);
  assert.equal(fourth.allowed, false);
  assert.ok(fourth.retryAfterMs > 0, 'a rejection must say how long to wait');
  const fifth = rateLimit.checkAndRecord('k', opts);
  assert.equal(fifth.allowed, false, 'a rejected attempt must not count as a fresh attempt that resets the window');
});

test('unit: rate-limit checkAndRecord keys are independent — hammering one key never blocks a different one', () => {
  rateLimit._resetForTests();
  const opts = { windowMs: 60_000, maxAttempts: 1 };
  assert.equal(rateLimit.checkAndRecord('a', opts).allowed, true);
  assert.equal(rateLimit.checkAndRecord('a', opts).allowed, false);
  assert.equal(rateLimit.checkAndRecord('b', opts).allowed, true, 'a different key must have its own independent bucket');
});
rateLimit._resetForTests(); // leave this process's own rate-limit module state clean; irrelevant to the spawned server child processes below, which each load their own separate instance of rate-limit.js.

// ---------------------------------------------------------------------------
// (B) config.js startup validation (items 1/2/13) — production must refuse
// to start with no explicit AUTH_SECRET rather than silently generating a
// guessable or per-process one. Run as a bare `node -e` child process so
// this can assert on real process exit behavior without requiring config.js
// (and its throw-at-require-time check) directly into this test process.
// ---------------------------------------------------------------------------
test('config.js: refuses to start in production with no AUTH_SECRET set', () => {
  const result = spawnSync('node', ['-e', "require('./config')"], {
    cwd: BACKEND_ROOT,
    env: { ...process.env, NODE_ENV: 'production', PORT: '0', AUTH_SECRET: '' },
  });
  assert.notEqual(result.status, 0, 'must exit non-zero when production has no AUTH_SECRET');
  assert.match(result.stderr.toString(), /FATAL: AUTH_SECRET is not set/);
});

test('config.js: starts cleanly in production once AUTH_SECRET is explicitly set', () => {
  const result = spawnSync('node', ['-e', "require('./config'); console.log('CONFIG_OK')"], {
    cwd: BACKEND_ROOT,
    env: { ...process.env, NODE_ENV: 'production', PORT: '0', AUTH_SECRET: 'a-real-explicit-production-secret' },
  });
  assert.equal(result.status, 0);
  assert.match(result.stdout.toString(), /CONFIG_OK/);
});

// ---------------------------------------------------------------------------
// (C) Main integration suite — one spawned server, one isolated test
// database, exercising: malformed-login validation, the generic-500
// boundary, feedback_mode enforcement, cross-student isolation, the
// pre-submission answer-key absence, baseline security headers, and
// default-off CORS.
// ---------------------------------------------------------------------------
describe('security: main integration suite', () => {
  const PORT = 4610;
  const BASE = `http://localhost:${PORT}`;
  const api = makeApi(BASE);
  let serverProcess;
  const stamp = Date.now();

  let subjectId, corruptTestId, studentAToken, studentBToken;

  before(async () => {
    // Phase 6B: every db.prepare(...) call below is now `await`ed (a
    // mechanical fix — see the header comment on setupPrimaryTestDbEnv), and
    // the 4 INSERTs that read back `.lastInsertRowid` now say `RETURNING id`
    // explicitly, exactly like the app's own 4 lastInsertRowid-dependent
    // inserts (server.js's register()/attempts insert, practice.js's two
    // test inserts) needed in Stage 6A. This one was a genuine gap Stage 6A
    // didn't catch, because it only inventoried the app's own runtime files,
    // not test fixture code — node:sqlite has always populated
    // lastInsertRowid on a plain INSERT with no RETURNING needed, but
    // db-postgres.js only knows to read a generated id back when the SQL
    // text itself asks for RETURNING (see db-postgres.js's run()) — without
    // it, `Number(subj.lastInsertRowid)` would have been `Number(undefined)`
    // = NaN under DB_ENGINE=postgres, silently corrupting every fixture id
    // used below. Exactly the kind of mechanical compatibility issue this
    // formal regression stage exists to catch.
    //
    // Ordinary subject/chapter/question: one gradable MCQ, used for the
    // feedback-mode and answer-key-absence checks.
    const subj = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('CBSE', 'Mathematics', '10') RETURNING id").run();
    subjectId = Number(subj.lastInsertRowid);
    const chap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, 'Algebra');
    const chapterId = Number(chap.lastInsertRowid);
    await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct)
                VALUES (?, 'mcq', 'verified', 'source_provided', 1, 'Easy', '2 + 2 = ?', '["3","4","5","6"]', 1)`).run(chapterId);

    // A DELIBERATELY BROKEN row: a case-kind question whose parts_json is
    // not valid JSON. This is exactly the kind of data problem
    // scoring.js's flattenAll() has never had defensive handling for (it
    // does `JSON.parse(q.parts_json)` with no try/catch) — a genuine,
    // pre-existing crash path, not something manufactured for this test.
    // It's isolated into its own subject/chapter so it can never be picked
    // up by practice.generate()'s random selection for any other test in
    // this file; the test/attempt below is built by hand (direct INSERTs +
    // POST /api/attempts) specifically to reach it via
    // GET /api/attempts/:id/questions -> loadQuestionsForTest ->
    // scoring.flattenAll(), so this is a REAL, real-server-boundary
    // reproduction of the generic-500 fix (item 5), not a synthetic
    // unit-level throw.
    const corruptSubj = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('CBSE', 'ZZ-Corrupt-Test-Subject', '10') RETURNING id").run();
    const corruptSubjectId = Number(corruptSubj.lastInsertRowid);
    const corruptChap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(corruptSubjectId, 'ZZ-Corrupt-Chapter');
    const corruptChapterId = Number(corruptChap.lastInsertRowid);
    const corruptQ = await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, parts_json)
                VALUES (?, 'case', 'verified', 'source_provided', 4, 'Medium', 'Case stem', 'NOT VALID JSON {{{') RETURNING id`).run(corruptChapterId);
    const corruptQuestionId = Number(corruptQ.lastInsertRowid);

    serverProcess = spawn('node', ['server.js'], {
      cwd: BACKEND_ROOT,
      env: { ...process.env, PORT: String(PORT), ...dbCtx.childEnv },
      stdio: 'pipe',
    });
    serverProcess.stderr.on('data', (d) => process.stderr.write(`[security-server] ${d}`));
    await waitForServer(BASE);

    // Register the test students via the real API (not direct INSERTs) so
    // password hashing/token issuance is exercised the same way a real
    // signup would. Two well under the 10/15min register rate limit.
    const a = await api('POST', '/api/auth/register', { body: { name: 'Student A', email: `sec-a-${stamp}@boardready.test`, password: 'testpass123', role: 'student' } });
    studentAToken = a.body.token;
    const b = await api('POST', '/api/auth/register', { body: { name: 'Student B', email: `sec-b-${stamp}@boardready.test`, password: 'testpass123', role: 'student' } });
    studentBToken = b.body.token;

    // The corrupt-question test/attempt is built by hand: student A owns
    // it, so the 500 test below is exercising the crash path itself, not
    // accidentally also exercising the 403 ownership check from (E).
    const testRow = await db.prepare(`INSERT INTO tests (student_id, subject_id, kind, duration_seconds, feedback_mode) VALUES (?, ?, 'practice', 300, 'immediate') RETURNING id`)
      .run(auth_userIdFromToken(studentAToken), corruptSubjectId);
    corruptTestId = Number(testRow.lastInsertRowid);
    await db.prepare('INSERT INTO test_questions (test_id, question_id, order_index) VALUES (?, ?, 0)').run(corruptTestId, corruptQuestionId);
  });

  after(() => {
    if (serverProcess) serverProcess.kill();
    dbCtx.cleanup();
  });

  // Decodes the unsigned payload of our own bearer token (base64url JSON
  // before the '.') purely to read back the userId we just registered, so
  // the fixture above can attribute the hand-built test row to the right
  // student without a second round of DB lookups. Never used for anything
  // security-relevant — the token's signature is never checked or trusted
  // here, only its already-known-good payload is read back.
  function auth_userIdFromToken(token) {
    const [body] = token.split('.');
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')).userId;
  }

  it('POST /api/auth/login — missing password returns a clean 400, never reaches password hashing (item 8, and the item-5 scenario this used to crash with)', async () => {
    const res = await api('POST', '/api/auth/login', { body: { email: 'someone@boardready.test' } });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /email and password are required/);
  });

  it('POST /api/auth/login — missing email returns the same clean 400', async () => {
    const res = await api('POST', '/api/auth/login', { body: { password: 'whatever123' } });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /email and password are required/);
  });

  it('GET /api/attempts/:id/questions — a genuinely broken row (corrupted parts_json) produces a generic 500, never the raw internal error message (item 5)', async () => {
    const attempt = await api('POST', '/api/attempts', { token: studentAToken, body: { test_id: corruptTestId } });
    assert.equal(attempt.status, 201);
    const res = await api('GET', `/api/attempts/${attempt.body.id}/questions`, { token: studentAToken });
    assert.equal(res.status, 500);
    assert.deepEqual(res.body, { error: 'Internal server error' }, 'the response must be exactly the generic message — no JSON.parse detail, no stack fragment, nothing else');
  });

  it('POST /api/attempts/:id/check — rejected with 403 on a Board Simulation (feedback_mode=deferred) test, even with an otherwise-valid key/answer (item 11)', async () => {
    const gen = await api('POST', '/api/tests/generate', { token: studentAToken, body: { subjectId } });
    assert.equal(gen.status, 201);
    assert.equal(gen.body.feedbackMode, 'deferred', 'sanity: /api/tests/generate must actually produce a deferred-feedback test for this to be a real test of the guard');
    const attempt = await api('POST', '/api/attempts', { token: studentAToken, body: { test_id: gen.body.id } });
    assert.equal(attempt.status, 201);
    const qres = await api('GET', `/api/attempts/${attempt.body.id}/questions`, { token: studentAToken });
    assert.equal(qres.status, 200);
    const step = qres.body.steps[0];
    const key = `${step.questionId}:${step.label || ''}`;
    const check = await api('POST', `/api/attempts/${attempt.body.id}/check`, { token: studentAToken, body: { key, answer: { optionIndex: 0 } } });
    assert.equal(check.status, 403);
    assert.match(check.body.error, /Board Simulation/);
  });

  it('POST /api/attempts/:id/check — the SAME question in an immediate-feedback (Practice) test is checkable normally, proving the 403 above is about feedback_mode, not the endpoint being broken', async () => {
    const gen = await api('POST', '/api/practice/generate', { token: studentAToken, body: { subjectId } });
    assert.equal(gen.status, 201);
    assert.equal(gen.body.feedbackMode, 'immediate');
    const attempt = await api('POST', '/api/attempts', { token: studentAToken, body: { test_id: gen.body.id } });
    const qres = await api('GET', `/api/attempts/${attempt.body.id}/questions`, { token: studentAToken });
    const step = qres.body.steps[0];
    const key = `${step.questionId}:${step.label || ''}`;
    const check = await api('POST', `/api/attempts/${attempt.body.id}/check`, { token: studentAToken, body: { key, answer: { optionIndex: 0 } } });
    assert.equal(check.status, 200);
    assert.equal(typeof check.body.correct, 'boolean');
  });

  it('GET /api/attempts/:id/questions — the answer key (correct) and explanation are absent from every step before submission (item 10)', async () => {
    const gen = await api('POST', '/api/practice/generate', { token: studentAToken, body: { subjectId } });
    const attempt = await api('POST', '/api/attempts', { token: studentAToken, body: { test_id: gen.body.id } });
    const qres = await api('GET', `/api/attempts/${attempt.body.id}/questions`, { token: studentAToken });
    assert.equal(qres.status, 200);
    for (const step of qres.body.steps) {
      assert.equal('correct' in step, false, 'a pre-submission step must never carry the correct-option index');
      assert.equal('explanation' in step, false, 'a pre-submission step must never carry the explanation, which can itself spell out the answer');
    }
  });

  it('GET /api/attempts/:id/questions — a different student is rejected with 403, never allowed to read another student\'s attempt (item 9)', async () => {
    const gen = await api('POST', '/api/practice/generate', { token: studentAToken, body: { subjectId } });
    const attempt = await api('POST', '/api/attempts', { token: studentAToken, body: { test_id: gen.body.id } });
    assert.equal(attempt.status, 201);
    const res = await api('GET', `/api/attempts/${attempt.body.id}/questions`, { token: studentBToken });
    assert.equal(res.status, 403);
    assert.match(res.body.error, /Not your attempt/);
  });

  it('GET /api/attempts/:id/questions — an unauthenticated request is rejected with 401, not a 500 or a leak', async () => {
    const res = await api('GET', '/api/attempts/1/questions');
    assert.equal(res.status, 401);
  });

  it('every API response carries the baseline security headers (item 6/7)', async () => {
    const res = await fetch(`${BASE}/api/subjects`);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-frame-options'), 'DENY');
    assert.equal(res.headers.get('referrer-policy'), 'no-referrer');
    const csp = res.headers.get('content-security-policy');
    assert.ok(csp && csp.includes("default-src 'self'"), 'CSP header must be present with a real default-src');
    assert.ok(csp.includes("object-src 'none'"), 'CSP must block plugin content');
  });

  it('CORS: with ALLOWED_ORIGINS unset (the default), no CORS headers are ever sent — identical to pre-Phase-5 behavior (item 6)', async () => {
    const res = await fetch(`${BASE}/api/subjects`, { headers: { Origin: 'https://anywhere.example.com' } });
    assert.equal(res.headers.get('access-control-allow-origin'), null);
  });
});

// ---------------------------------------------------------------------------
// (D) Rate limiting — HTTP-level, on its own dedicated server/database/port
// so hammering the limiter here can never interfere with (or be interfered
// with by) the main suite's own register/login calls above (item 3).
// ---------------------------------------------------------------------------
describe('security: rate limiting (dedicated server)', () => {
  const PORT = 4611;
  const BASE = `http://localhost:${PORT}`;
  const rlDbCtx = provisionIsolatedDb('security_ratelimit');
  let serverProcess;

  before(async () => {
    serverProcess = spawn('node', ['server.js'], {
      cwd: BACKEND_ROOT,
      env: { ...process.env, PORT: String(PORT), ...rlDbCtx.childEnv },
      stdio: 'pipe',
    });
    serverProcess.stderr.on('data', (d) => process.stderr.write(`[ratelimit-server] ${d}`));
    await waitForServer(BASE);
  });
  after(() => {
    if (serverProcess) serverProcess.kill();
    rlDbCtx.cleanup();
  });

  it('POST /api/auth/register — the 11th attempt from the same client within the window is rejected with 429, with a Retry-After header', async () => {
    const stamp = Date.now();
    for (let i = 0; i < 10; i++) {
      const res = await fetch(`${BASE}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'RL Test', email: `rl-register-${stamp}-${i}@boardready.test`, password: 'testpass123', role: 'student' }),
      });
      assert.equal(res.status, 201, `attempt ${i + 1} of 10 should succeed (still under the limit)`);
    }
    const eleventh = await fetch(`${BASE}/api/auth/register`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'RL Test', email: `rl-register-${stamp}-eleventh@boardready.test`, password: 'testpass123', role: 'student' }),
    });
    assert.equal(eleventh.status, 429);
    assert.ok(eleventh.headers.get('retry-after'), 'a 429 must tell the client when it can try again');
  });

  it('POST /api/auth/login — repeated failed attempts from the same client are rate-limited independently of the register limiter', async () => {
    // The register limiter above is already tripped for this server/client,
    // but login uses its own separate rate-limit key (see server.js's
    // enforceRateLimit calls), so it must still allow its own fresh 10.
    let last;
    for (let i = 0; i < 10; i++) {
      last = await fetch(`${BASE}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'nobody@boardready.test', password: 'wrongpassword' }),
      });
      assert.equal(last.status, 401, `attempt ${i + 1} of 10 should be an ordinary invalid-credentials rejection, not yet rate-limited`);
    }
    const eleventh = await fetch(`${BASE}/api/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'nobody@boardready.test', password: 'wrongpassword' }),
    });
    assert.equal(eleventh.status, 429);
  });
});

// ---------------------------------------------------------------------------
// (E) CORS with ALLOWED_ORIGINS actually configured (dedicated server) —
// closes the verification gap named in
// docs/phase-5-security-hardening-report.md item 6: the main integration
// suite above (C) only ever exercises the default, unconfigured behavior
// (no CORS headers at all). This suite spawns its own server WITH
// ALLOWED_ORIGINS set, so it can exercise the allowlist itself: an allowed
// origin is accepted, a disallowed one is rejected, and a request with no
// Origin header at all behaves like an ordinary same-origin/non-browser
// request (no CORS headers, no error) — never touching the main suite's
// database or the unconfigured-default server above.
// ---------------------------------------------------------------------------
describe('security: CORS with ALLOWED_ORIGINS configured (dedicated server)', () => {
  const PORT = 4612;
  const BASE = `http://localhost:${PORT}`;
  const ALLOWED_ORIGIN = 'https://boardready.example.com';
  const DISALLOWED_ORIGIN = 'https://evil.example.com';
  const corsDbCtx = provisionIsolatedDb('security_cors');
  let serverProcess;

  before(async () => {
    serverProcess = spawn('node', ['server.js'], {
      cwd: BACKEND_ROOT,
      env: { ...process.env, PORT: String(PORT), ...corsDbCtx.childEnv, ALLOWED_ORIGINS: ALLOWED_ORIGIN },
      stdio: 'pipe',
    });
    serverProcess.stderr.on('data', (d) => process.stderr.write(`[cors-server] ${d}`));
    await waitForServer(BASE);
  });
  after(() => {
    if (serverProcess) serverProcess.kill();
    corsDbCtx.cleanup();
  });

  it('allowed configured origin -> accepted: a matching Origin gets real CORS headers on both a preflight and a normal request', async () => {
    const preflight = await fetch(`${BASE}/api/auth/login`, {
      method: 'OPTIONS',
      headers: { Origin: ALLOWED_ORIGIN, 'Access-Control-Request-Method': 'POST' },
    });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('access-control-allow-origin'), ALLOWED_ORIGIN);
    assert.equal(preflight.headers.get('access-control-allow-credentials'), 'false');
    assert.ok(preflight.headers.get('access-control-allow-methods'));

    const normal = await fetch(`${BASE}/api/subjects`, { headers: { Origin: ALLOWED_ORIGIN } });
    assert.equal(normal.status, 200);
    assert.equal(normal.headers.get('access-control-allow-origin'), ALLOWED_ORIGIN);
    assert.equal(normal.headers.get('vary'), 'Origin', 'must vary on Origin so a cache never serves one origin\'s CORS headers to another');
  });

  it('disallowed origin -> rejected: a non-listed Origin gets no CORS headers at all, on both a preflight and a normal request', async () => {
    const preflight = await fetch(`${BASE}/api/auth/login`, {
      method: 'OPTIONS',
      headers: { Origin: DISALLOWED_ORIGIN, 'Access-Control-Request-Method': 'POST' },
    });
    // Not accepted as a CORS preflight -> falls through to ordinary routing,
    // which has no OPTIONS route registered, so it 404s exactly like any
    // other unmatched route. The important assertion is what it must NOT
    // have: no Access-Control-Allow-Origin naming the disallowed origin (or
    // anything else).
    assert.equal(preflight.headers.get('access-control-allow-origin'), null);

    const normal = await fetch(`${BASE}/api/subjects`, { headers: { Origin: DISALLOWED_ORIGIN } });
    assert.equal(normal.status, 200, 'a disallowed Origin still gets the real response -- CORS only controls whether the BROWSER lets the calling page read it, never whether the server serves it');
    assert.equal(normal.headers.get('access-control-allow-origin'), null);
  });

  it('missing Origin -> appropriate behavior: a request with no Origin header at all (same-origin, curl, server-to-server) is served normally with no CORS headers and no error', async () => {
    const res = await fetch(`${BASE}/api/subjects`); // fetch() sends no Origin header for a plain same-process request
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('access-control-allow-origin'), null);
  });

  // The fourth case in the original checklist -- "unconfigured origin" -- is
  // the ALLOWED_ORIGINS env var itself being unset entirely (the feature
  // off by default), which is a DIFFERENT state from "disallowed" above
  // (env var set, but this particular Origin isn't in it) and must not be
  // conflated with it: only one of the two is a security allow/deny
  // decision. That unconfigured-by-default state is exactly what suite
  // (C)'s "CORS: with ALLOWED_ORIGINS unset (the default), no CORS headers
  // are ever sent" test already covers, against a separate server that
  // never sets ALLOWED_ORIGINS at all -- not duplicated here.
});
