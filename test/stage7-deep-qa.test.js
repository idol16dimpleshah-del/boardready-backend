// Stage 7 deep QA (2026-09-24) — see docs/stage7-deep-qa-report.md. Written
// per the founder's explicit "work ahead while waiting for Railway"
// instruction, priority 1: "Phase 7 deeper automated QA and isolation
// tests." This file is additive to test/security.test.js and
// test/readiness.test.js — it does not repeat what those already cover
// (register/login validation, the generic-500 boundary, feedback_mode
// enforcement, the baseline cross-student 403 on GET /questions, CORS, the
// register/login rate limiter). It covers the specific gaps identified by a
// dedicated investigation of this codebase's existing test coverage:
//
//   A. Auth-token hardening: no token / malformed token / tampered token /
//      wrong-secret token / expired token, all against a real protected
//      route, plus the teacher/student role boundary (a teacher-role token
//      rejected from every student-only route — there is no teacher-only
//      route in this codebase to test the reverse direction, so this is the
//      one direction that actually exists to test).
//   B. Cross-student isolation beyond GET /questions: PATCH /answers,
//      POST /check, POST /submit, GET /attempts/me, and POST /tests/improve
//      (a sourceAttemptId belonging to a different student).
//   C. Concurrency races the code comments explicitly call out as the
//      reason the Stage 6A transaction+row-lock rewrite exists, but that
//      were, until now, only proven at the database layer (Phase 4's
//      concurrency-test.js) or for a subset of endpoints under Postgres
//      specifically (postgres-regression.test.js) — this exercises them at
//      the HTTP level against whichever engine `npm test` is already
//      configured for: simultaneous test generation, a same-key /check
//      race, a same-attempt /answers race across two different keys, and a
//      duplicate-submission race on /submit.
//   D. Malformed/oversized request handling beyond the login endpoint:
//      invalid JSON, missing required fields, non-numeric ids, a
//      non-object `answers` payload, and an oversized (>2MB) body — proving
//      the server responds cleanly (never crashes, never hangs) and stays
//      up for the next request.
//   E. /api/health — a real round-trip check, plus (Postgres only) a real
//      lost-connection scenario. Under the sqlite engine there is no live
//      connection to lose (db.ready() is a documented no-op — see
//      db-sqlite.js), so that half of this suite is a deliberately
//      lightweight, explicitly-labeled regression check rather than a
//      simulated failure — consistent with this project's standing decision
//      to document, not paper over, the SQLite-is-dev/test-only limitation.
//
// TEST-DATABASE ISOLATION — same discipline as every other file in this
// directory (see docs/test-database-isolation-incident.md): DB_PATH/
// DATABASE_URL are set via pg-test-support.js, per-suite, before anything
// requires db.js, and every spawned server child gets an explicit env
// object, never `...process.env` alone. Nothing here ever opens, migrates,
// or writes to boardready.db.
const path = require('node:path');
const crypto = require('node:crypto');
const { setupPrimaryTestDbEnv, provisionIsolatedDb, dropPostgresDbSync, currentEngine } = require('./pg-test-support');
const dbCtx = setupPrimaryTestDbEnv('stage7_deep_qa_main');

const { test, describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const db = require('../db');

if (db.DB_PATH === db.LIVE_DB_PATH) {
  throw new Error(`FATAL: test DB_PATH (${db.DB_PATH}) resolved to the same path as the live database (${db.LIVE_DB_PATH}). Refusing to run tests.`);
}
if (!db.IS_TEST_MODE) {
  throw new Error('FATAL: db.js did not recognize this as a test run (IS_TEST_MODE is false). Refusing to run tests.');
}
console.log(`[stage7-deep-qa.test.js] LIVE DATABASE: ${db.LIVE_DB_PATH}`);
console.log(`[stage7-deep-qa.test.js] TEST DATABASE: ${db.DB_PATH}`);

const BACKEND_ROOT = path.join(__dirname, '..');
// A fixed, explicit AUTH_SECRET for every server this file spawns, so this
// test process can independently sign forged tokens (tampered/expired/
// wrong-secret) to send at those same servers. Never used outside this file,
// never close to a real deployment secret.
const AUTH_SECRET = 'stage7-deep-qa-fixed-test-secret-do-not-reuse';

async function waitForServer(base, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try { const res = await fetch(`${base}/api/subjects`); if (res.ok || res.status === 404) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Server at ${base} did not become ready in time`);
}
function makeApi(base) {
  return async function api(method, urlPath, { token, body, rawBody } = {}) {
    const res = await fetch(`${base}${urlPath}`, {
      method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: rawBody !== undefined ? rawBody : (body !== undefined ? JSON.stringify(body) : undefined),
    });
    let json = null; try { json = await res.json(); } catch { /* no body */ }
    return { status: res.status, headers: res.headers, body: json };
  };
}
function spawnServer(port, childEnv, label, extraEnv) {
  const serverProcess = spawn('node', ['server.js'], {
    cwd: BACKEND_ROOT,
    env: { ...process.env, PORT: String(port), AUTH_SECRET, ...childEnv, ...(extraEnv || {}) },
    stdio: 'pipe',
  });
  serverProcess.stderr.on('data', (d) => process.stderr.write(`[${label}] ${d}`));
  return serverProcess;
}
// Mirrors auth.js's sign()/verify() exactly (see auth.js) so this test file
// can forge tokens with an arbitrary payload/exp/secret — needed to prove
// the server-side verify() genuinely rejects each forged shape, not just
// "no token at all" (already covered elsewhere).
function forgeToken(payload, secret = AUTH_SECRET) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

// ---------------------------------------------------------------------------
// A. Auth-token hardening + role boundary (dedicated server/database).
// ---------------------------------------------------------------------------
describe('stage7-deep-qa: auth-token hardening and role boundary', () => {
  const PORT = 4620;
  const BASE = `http://localhost:${PORT}`;
  const api = makeApi(BASE);
  let serverProcess;
  let subjectId;
  let studentToken, teacherToken;
  const stamp = Date.now();

  before(async () => {
    // Spawned against the SAME primary db this file's own `db` handle
    // writes fixtures into below (dbCtx.childEnv, not a separate isolated
    // db) — otherwise the fixtures this before() hook inserts would land in
    // a file the spawned server never reads, exactly the mismatch that
    // originally made this suite's positive-control /chapters check
    // vacuously pass against an empty table. Safe to share sequentially:
    // every describe block in this file fully tears its own server down in
    // its own after() before the next one's before() spawns a new one — see
    // the file-level `after()` at the bottom for the one shared cleanup.
    serverProcess = spawnServer(PORT, dbCtx.childEnv, 'stage7-auth-server');
    await waitForServer(BASE);

    const s = await api('POST', '/api/auth/register', { body: { name: 'Deep QA Student', email: `dqa-student-${stamp}@boardready.test`, password: 'testpass123', role: 'student' } });
    assert.equal(s.status, 201);
    studentToken = s.body.token;
    const t = await api('POST', '/api/auth/register', { body: { name: 'Deep QA Teacher', email: `dqa-teacher-${stamp}@boardready.test`, password: 'testpass123', role: 'teacher' } });
    assert.equal(t.status, 201);
    teacherToken = t.body.token;

    const subj = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('CBSE', 'DeepQA Subject', '10') RETURNING id").run();
    subjectId = Number(subj.lastInsertRowid);
    const chap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, 'DeepQA Chapter');
    const chapterId = Number(chap.lastInsertRowid);
    for (let i = 0; i < 5; i++) {
      await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct)
                  VALUES (?, 'mcq', 'verified', 'source_provided', 1, 'Easy', ?, '["A","B","C","D"]', 0)`).run(chapterId, `DeepQA Q${i}`);
    }
  });
  after(() => { if (serverProcess) serverProcess.kill(); });

  it('a genuinely unauthenticated request (no Authorization header at all) is rejected with 401 on a representative protected route', async () => {
    const res = await api('GET', '/api/attempts/me');
    assert.equal(res.status, 401);
  });

  it('a malformed token (not even two base64url segments joined by a dot) is rejected with 401, not a 500', async () => {
    const res = await api('GET', '/api/attempts/me', { token: 'not-a-real-token-at-all' });
    assert.equal(res.status, 401);
  });

  it('a token with a well-formed shape but garbage segments is rejected with 401', async () => {
    const res = await api('GET', '/api/attempts/me', { token: 'Zm9v.YmFy' });
    assert.equal(res.status, 401);
  });

  it('a tampered token — a real, validly-signed token whose payload is edited after signing — is rejected with 401 (the signature no longer matches)', async () => {
    const [origBody] = studentToken.split('.');
    const payload = JSON.parse(Buffer.from(origBody, 'base64url').toString('utf8'));
    const tamperedBody = Buffer.from(JSON.stringify({ ...payload, role: 'teacher' })).toString('base64url');
    const [, origSig] = studentToken.split('.');
    const tampered = `${tamperedBody}.${origSig}`;
    const res = await api('GET', '/api/attempts/me', { token: tampered });
    assert.equal(res.status, 401, 'editing the payload must invalidate the original signature — a tampered token must never be silently accepted');
  });

  it('a token signed with the wrong secret is rejected with 401, even with an otherwise well-formed, unexpired payload', async () => {
    const forged = forgeToken({ userId: 999999, role: 'student', exp: Date.now() + 60_000 }, 'a-completely-different-secret');
    const res = await api('GET', '/api/attempts/me', { token: forged });
    assert.equal(res.status, 401);
  });

  it('an expired token (correctly signed, but exp already in the past) is rejected with 401', async () => {
    const forged = forgeToken({ userId: 999999, role: 'student', exp: Date.now() - 1000 });
    const res = await api('GET', '/api/attempts/me', { token: forged });
    assert.equal(res.status, 401);
  });

  it('a token with no exp field at all is rejected with 401 — verify() must not treat a missing expiry as "never expires"', async () => {
    const forged = forgeToken({ userId: 999999, role: 'student' });
    const res = await api('GET', '/api/attempts/me', { token: forged });
    assert.equal(res.status, 401);
  });

  // -------------------------------------------------------------------------
  // Role boundary: every student-only route rejects a real, validly-signed
  // teacher token with 403 — never 401 (the token IS valid; the role just
  // isn't allowed) and never 200/201. There is no teacher-only route in this
  // codebase (confirmed by inspection of server.js's requireAuth() call
  // sites) to test the reverse direction.
  // -------------------------------------------------------------------------
  it('POST /api/practice/generate rejects a teacher token with 403', async () => {
    const res = await api('POST', '/api/practice/generate', { token: teacherToken, body: { subjectId } });
    assert.equal(res.status, 403);
    assert.match(res.body.error, /Not authorized/);
  });

  it('POST /api/tests/generate rejects a teacher token with 403', async () => {
    const res = await api('POST', '/api/tests/generate', { token: teacherToken, body: { subjectId } });
    assert.equal(res.status, 403);
  });

  it('POST /api/tests/improve rejects a teacher token with 403', async () => {
    const res = await api('POST', '/api/tests/improve', { token: teacherToken, body: { sourceAttemptId: 1 } });
    assert.equal(res.status, 403);
  });

  it('POST /api/attempts rejects a teacher token with 403 (role check happens before the test_id is even looked up)', async () => {
    const res = await api('POST', '/api/attempts', { token: teacherToken, body: { test_id: 1 } });
    assert.equal(res.status, 403);
  });

  it('GET /api/attempts/:id/questions rejects a teacher token with 403', async () => {
    const res = await api('GET', '/api/attempts/1/questions', { token: teacherToken });
    assert.equal(res.status, 403);
  });

  it('GET /api/attempts/me rejects a teacher token with 403', async () => {
    const res = await api('GET', '/api/attempts/me', { token: teacherToken });
    assert.equal(res.status, 403);
  });

  it('GET /api/diagnostics/me/summary rejects a teacher token with 403', async () => {
    const res = await api('GET', '/api/diagnostics/me/summary', { token: teacherToken });
    assert.equal(res.status, 403);
  });

  it('POST /api/subscriptions/activate rejects a teacher token with 403', async () => {
    const res = await api('POST', '/api/subscriptions/activate', { token: teacherToken, body: { plan: 'all-subject' } });
    assert.equal(res.status, 403);
  });

  it('positive control: GET /api/chapters, which explicitly allows BOTH roles, accepts the same teacher token that every student-only route above correctly rejected', async () => {
    const res = await api('GET', `/api/chapters?subject_id=${subjectId}`, { token: teacherToken });
    assert.equal(res.status, 200, 'this proves the 403s above are a real per-route role check, not an accidentally-broken teacher token or a global teacher lockout');
    assert.ok(Array.isArray(res.body.chapters));
  });
});

// ---------------------------------------------------------------------------
// B. Cross-student isolation beyond GET /questions (dedicated server/db).
// ---------------------------------------------------------------------------
describe('stage7-deep-qa: cross-student isolation', () => {
  const PORT = 4621;
  const BASE = `http://localhost:${PORT}`;
  const api = makeApi(BASE);
  let serverProcess;
  let subjectId, aTestId, aAttemptId, aKey;
  let tokenA, tokenB;
  const stamp = Date.now();

  before(async () => {
    serverProcess = spawnServer(PORT, dbCtx.childEnv, 'stage7-iso-server'); // shared primary db — see suite A's comment
    await waitForServer(BASE);

    const a = await api('POST', '/api/auth/register', { body: { name: 'Iso Student A', email: `dqa-iso-a-${stamp}@boardready.test`, password: 'testpass123', role: 'student' } });
    tokenA = a.body.token;
    const b = await api('POST', '/api/auth/register', { body: { name: 'Iso Student B', email: `dqa-iso-b-${stamp}@boardready.test`, password: 'testpass123', role: 'student' } });
    tokenB = b.body.token;

    const subj = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('CBSE', 'Iso Subject', '10') RETURNING id").run();
    subjectId = Number(subj.lastInsertRowid);
    const chap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, 'Iso Chapter');
    const chapterId = Number(chap.lastInsertRowid);
    for (let i = 0; i < 4; i++) {
      await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct)
                  VALUES (?, 'mcq', 'verified', 'source_provided', 1, 'Easy', ?, '["A","B","C","D"]', 0)`).run(chapterId, `Iso Q${i}`);
    }

    // Student A's own practice test + attempt + first-question key, reused
    // by every "student B tries to act on student A's stuff" case below.
    const gen = await api('POST', '/api/practice/generate', { token: tokenA, body: { subjectId } });
    assert.equal(gen.status, 201);
    aTestId = gen.body.id;
    const attempt = await api('POST', '/api/attempts', { token: tokenA, body: { test_id: aTestId } });
    assert.equal(attempt.status, 201);
    aAttemptId = attempt.body.id;
    const qres = await api('GET', `/api/attempts/${aAttemptId}/questions`, { token: tokenA });
    const step = qres.body.steps[0];
    aKey = `${step.questionId}:${step.label || ''}`;
  });
  after(() => { if (serverProcess) serverProcess.kill(); });

  it('PATCH /api/attempts/:id/answers — student B cannot autosave onto student A\'s attempt (403, and A\'s draft is left untouched)', async () => {
    const res = await api('PATCH', `/api/attempts/${aAttemptId}/answers`, { token: tokenB, body: { answers: { [aKey]: { optionIndex: 3 } } } });
    assert.equal(res.status, 403);
    assert.match(res.body.error, /Not your attempt/);
    const check = await api('GET', `/api/attempts/${aAttemptId}/questions`, { token: tokenA });
    assert.deepEqual(check.body.draftAnswers, {}, 'student B\'s rejected autosave attempt must leave student A\'s draft exactly as it was');
  });

  it('POST /api/attempts/:id/check — student B cannot check an answer into student A\'s attempt (403, and it does not get locked)', async () => {
    const res = await api('POST', `/api/attempts/${aAttemptId}/check`, { token: tokenB, body: { key: aKey, answer: { optionIndex: 0 } } });
    assert.equal(res.status, 403);
    assert.match(res.body.error, /Not your attempt/);
    const check = await api('GET', `/api/attempts/${aAttemptId}/questions`, { token: tokenA });
    assert.deepEqual(check.body.checkedAnswers, {}, 'student B\'s rejected /check attempt must not have locked anything on student A\'s attempt');
  });

  it('POST /api/attempts/:id/submit — student B cannot submit student A\'s attempt (403, and it stays unsubmitted for A)', async () => {
    const res = await api('POST', `/api/attempts/${aAttemptId}/submit`, { token: tokenB, body: { answers: {} } });
    assert.equal(res.status, 403);
    assert.match(res.body.error, /Not your attempt/);
    const mine = await api('GET', '/api/attempts/me', { token: tokenA });
    const row = mine.body.attempts.find((a) => a.id === aAttemptId);
    assert.equal(row.submittedAt, null, 'student B\'s rejected submit attempt must not have submitted student A\'s attempt');
  });

  it('GET /api/attempts/me — student B\'s own (empty) attempt list never includes student A\'s attempt', async () => {
    const res = await api('GET', '/api/attempts/me', { token: tokenB });
    assert.equal(res.status, 200);
    assert.equal(res.body.attempts.find((a) => a.id === aAttemptId), undefined, 'GET /attempts/me must be scoped strictly to the authenticated caller, never another student\'s rows');
  });

  it('POST /api/tests/improve — a sourceAttemptId belonging to a different student is rejected with 404, never leaking that the attempt exists or its content', async () => {
    // Finish A's attempt first so it would otherwise be a legitimate
    // improvement source — the only reason this must still 404 for B is the
    // student_id mismatch, not "attempt not submitted yet".
    await api('POST', `/api/attempts/${aAttemptId}/submit`, { token: tokenA, body: { answers: {} } });
    const res = await api('POST', '/api/tests/improve', { token: tokenB, body: { sourceAttemptId: aAttemptId } });
    assert.equal(res.status, 404);
    assert.match(res.body.error, /not found/i);
  });
});

// ---------------------------------------------------------------------------
// C. Concurrency races — HTTP-level, proving the Stage 6A transaction+
// row-lock rewrite (server.js's /answers, /check, /submit; practice.js's
// generate()) holds under real simultaneous requests, against whichever
// engine this test run is already configured for (dedicated server/db).
// ---------------------------------------------------------------------------
describe('stage7-deep-qa: concurrency races', () => {
  const PORT = 4622;
  const BASE = `http://localhost:${PORT}`;
  const api = makeApi(BASE);
  let serverProcess;
  let subjectId, chapterId;
  let token;
  const stamp = Date.now();

  before(async () => {
    serverProcess = spawnServer(PORT, dbCtx.childEnv, 'stage7-race-server'); // shared primary db — see suite A's comment
    await waitForServer(BASE);

    const reg = await api('POST', '/api/auth/register', { body: { name: 'Race Student', email: `dqa-race-${stamp}@boardready.test`, password: 'testpass123', role: 'student' } });
    token = reg.body.token;

    const subj = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('CBSE', 'Race Subject', '10') RETURNING id").run();
    subjectId = Number(subj.lastInsertRowid);
    const chap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, 'Race Chapter');
    chapterId = Number(chap.lastInsertRowid);
    for (let i = 0; i < 8; i++) {
      await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct)
                  VALUES (?, 'mcq', 'verified', 'source_provided', 1, 'Easy', ?, '["A","B","C","D"]', 0)`).run(chapterId, `Race Q${i}`);
    }
  });
  after(() => { if (serverProcess) serverProcess.kill(); });

  it('5 simultaneous POST /api/tests/generate calls for the same student all succeed with distinct test ids, and every resulting test has a complete, uncorrupted question set', async () => {
    const results = await Promise.all(Array.from({ length: 5 }, () => api('POST', '/api/tests/generate', { token, body: { subjectId } })));
    for (const r of results) assert.equal(r.status, 201, 'every concurrent generate call must succeed — none should be lost or fail as a side effect of the others');
    const ids = results.map((r) => r.body.id);
    assert.equal(new Set(ids).size, 5, 'every concurrent call must produce its own distinct test id — no id collision or overwrite');
    for (const id of ids) {
      const rows = await db.prepare('SELECT COUNT(*) as c FROM test_questions WHERE test_id = ?').get(id);
      assert.equal(Number(rows.c), 8, `test ${id} must have its own full, uncorrupted set of questions (8, the full pool), not a partial or doubled-up write from an interleaved insert`);
    }
  });

  it('a same-key /check race — two simultaneous checks of the SAME question in the SAME attempt — locks exactly one verdict, and the loser sees that same verdict rather than its own differing pick', async () => {
    const gen = await api('POST', '/api/practice/generate', { token, body: { subjectId, count: 3 } });
    assert.equal(gen.status, 201);
    const attempt = await api('POST', '/api/attempts', { token, body: { test_id: gen.body.id } });
    const qres = await api('GET', `/api/attempts/${attempt.body.id}/questions`, { token });
    const step = qres.body.steps[0];
    const key = `${step.questionId}:${step.label || ''}`;

    // Deliberately different picks (0 and 1) so the test can prove the loser
    // truly reports the WINNER's optionIndex, not silently re-deriving its
    // own — an actual second write, not just "didn't crash".
    const [r1, r2] = await Promise.all([
      api('POST', `/api/attempts/${attempt.body.id}/check`, { token, body: { key, answer: { optionIndex: 0 } } }),
      api('POST', `/api/attempts/${attempt.body.id}/check`, { token, body: { key, answer: { optionIndex: 1 } } }),
    ]);
    assert.equal(r1.status, 200); assert.equal(r2.status, 200);
    const winner = !r1.body.alreadyChecked ? r1.body : r2.body;
    const loser = !r1.body.alreadyChecked ? r2.body : r1.body;
    assert.equal(winner.alreadyChecked, false, 'exactly one of the two concurrent requests must be the one that actually locks the answer');
    assert.equal(loser.alreadyChecked, true, 'the other must see it was already checked, never silently re-lock its own different pick');
    assert.equal(loser.submittedOptionIndex, winner.submittedOptionIndex, 'the loser must report the WINNER\'s locked optionIndex, proving the lock is real and shared, not per-request state');
  });

  it('a same-attempt, different-key /answers race — two simultaneous autosaves for two different questions — preserves BOTH, never a lost update', async () => {
    const gen = await api('POST', '/api/practice/generate', { token, body: { subjectId, count: 3 } });
    const attempt = await api('POST', '/api/attempts', { token, body: { test_id: gen.body.id } });
    const qres = await api('GET', `/api/attempts/${attempt.body.id}/questions`, { token });
    const [step0, step1] = qres.body.steps;
    const key0 = `${step0.questionId}:${step0.label || ''}`;
    const key1 = `${step1.questionId}:${step1.label || ''}`;

    await Promise.all([
      api('PATCH', `/api/attempts/${attempt.body.id}/answers`, { token, body: { answers: { [key0]: { optionIndex: 2 } } } }),
      api('PATCH', `/api/attempts/${attempt.body.id}/answers`, { token, body: { answers: { [key1]: { optionIndex: 3 } } } }),
    ]);
    const after = await api('GET', `/api/attempts/${attempt.body.id}/questions`, { token });
    assert.equal(after.body.draftAnswers[key0]?.optionIndex, 2, 'the first concurrent save must not be lost to the second\'s read-modify-write');
    assert.equal(after.body.draftAnswers[key1]?.optionIndex, 3, 'the second concurrent save must not be lost to the first\'s read-modify-write');
  });

  it('a duplicate-submission race — two simultaneous POST /submit for the same attempt — scores it exactly once (one 200, one 409), never double-scored', async () => {
    const gen = await api('POST', '/api/practice/generate', { token, body: { subjectId, count: 4 } });
    const attempt = await api('POST', '/api/attempts', { token, body: { test_id: gen.body.id } });
    const [r1, r2] = await Promise.all([
      api('POST', `/api/attempts/${attempt.body.id}/submit`, { token, body: { answers: {} } }),
      api('POST', `/api/attempts/${attempt.body.id}/submit`, { token, body: { answers: {} } }),
    ]);
    const statuses = [r1.status, r2.status].sort();
    assert.deepEqual(statuses, [200, 409], 'exactly one concurrent submit must win with 200 and the other must cleanly 409 — never two 200s (double-scored) and never two 409s (never actually submitted)');
    const row = await db.prepare('SELECT submitted_at, score, max_score FROM attempts WHERE id = ?').get(attempt.body.id);
    assert.ok(row.submitted_at, 'the attempt must end up submitted exactly once');
  });
});

// ---------------------------------------------------------------------------
// D. Malformed / oversized request handling (dedicated server/db).
// ---------------------------------------------------------------------------
describe('stage7-deep-qa: malformed and oversized requests', () => {
  const PORT = 4623;
  const BASE = `http://localhost:${PORT}`;
  const api = makeApi(BASE);
  let serverProcess;
  let subjectId;
  let token;
  const stamp = Date.now();

  before(async () => {
    serverProcess = spawnServer(PORT, dbCtx.childEnv, 'stage7-malformed-server'); // shared primary db — see suite A's comment
    await waitForServer(BASE);
    const reg = await api('POST', '/api/auth/register', { body: { name: 'Malformed Student', email: `dqa-malformed-${stamp}@boardready.test`, password: 'testpass123', role: 'student' } });
    token = reg.body.token;
    const subj = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('CBSE', 'Malformed Subject', '10') RETURNING id").run();
    subjectId = Number(subj.lastInsertRowid);
    const chap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, 'Malformed Chapter');
    await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct)
                VALUES (?, 'mcq', 'verified', 'source_provided', 1, 'Easy', 'Q', '["A","B","C","D"]', 0)`).run(Number(chap.lastInsertRowid));
  });
  after(() => { if (serverProcess) serverProcess.kill(); });

  it('invalid JSON body on an authenticated POST route (not just /login) gets a clean 400, never a 500', async () => {
    const res = await api('POST', '/api/practice/generate', { token, rawBody: '{not valid json' });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /Invalid JSON/);
  });

  it('POST /api/tests/generate with no subjectId at all returns a clean 400', async () => {
    const res = await api('POST', '/api/tests/generate', { token, body: {} });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /subjectId is required/);
  });

  it('POST /api/attempts with a non-numeric test_id returns a clean 400, never a NaN-fueled query or a 500', async () => {
    const res = await api('POST', '/api/attempts', { token, body: { test_id: 'not-a-number' } });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /positive integer/);
  });

  it('PATCH /api/attempts/:id/answers with a non-object `answers` field (a bare string) returns a clean 400', async () => {
    const gen = await api('POST', '/api/practice/generate', { token, body: { subjectId } });
    const attempt = await api('POST', '/api/attempts', { token, body: { test_id: gen.body.id } });
    const res = await api('PATCH', `/api/attempts/${attempt.body.id}/answers`, { token, body: { answers: 'not-an-object' } });
    assert.equal(res.status, 400);
    assert.match(res.body.error, /answers object is required/);
  });

  it('PATCH /api/attempts/:id/answers with `answers` entirely missing returns a clean 400', async () => {
    const gen = await api('POST', '/api/practice/generate', { token, body: { subjectId } });
    const attempt = await api('POST', '/api/attempts', { token, body: { test_id: gen.body.id } });
    const res = await api('PATCH', `/api/attempts/${attempt.body.id}/answers`, { token, body: {} });
    assert.equal(res.status, 400);
  });

  it('an oversized (>2MB) request body is rejected by destroying the connection rather than crashing or hanging the server, which stays up and serves the very next request normally', async () => {
    const hugeBody = JSON.stringify({ subjectId, padding: 'x'.repeat(2_100_000) });
    let networkErrorRaised = false;
    try {
      await fetch(`${BASE}/api/practice/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: hugeBody,
      });
    } catch {
      networkErrorRaised = true; // the server destroyed the socket mid-request — an abrupt disconnect, not a clean HTTP response, is the expected outcome for this deliberately oversized body
    }
    assert.equal(networkErrorRaised, true, 'an oversized body must never be accepted and parsed — it must abort the connection before readBody\'s JSON.parse is ever reached');
    // The important resilience assertion: the server process is still alive
    // and answers the very next, entirely normal request correctly — proving
    // the oversized-body handling in readBody() (req.destroy() on overflow)
    // never leaves the server in a broken or hung state for later clients.
    const sane = await api('GET', '/api/subjects');
    assert.equal(sane.status, 200, 'the server must still be fully responsive immediately after rejecting an oversized body from a different request');
  });
});

// ---------------------------------------------------------------------------
// E. /api/health — real round-trip, plus (Postgres only) a real lost-
// connection scenario. Under sqlite this is a deliberately lightweight,
// explicitly-labeled regression check (see the file header comment).
// ---------------------------------------------------------------------------
describe('stage7-deep-qa: /api/health', () => {
  const PORT = 4624;
  const BASE = `http://localhost:${PORT}`;
  const api = makeApi(BASE);
  const healthDbCtx = provisionIsolatedDb('stage7_deep_qa_health');
  let serverProcess;

  before(async () => {
    serverProcess = spawnServer(PORT, healthDbCtx.childEnv, 'stage7-health-server');
    await waitForServer(BASE);
  });
  after(() => { if (serverProcess) serverProcess.kill(); if (currentEngine() !== 'postgres') healthDbCtx.cleanup(); });

  it('GET /api/health reports 200/ok with the real configured engine, and never leaks a connection string or credential', async () => {
    const res = await api('GET', '/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.engine, currentEngine());
    assert.ok(res.body.timestamp);
    const raw = JSON.stringify(res.body);
    assert.doesNotMatch(raw, /postgres:\/\//, '/api/health must never echo back a connection string, even in a field this test does not otherwise expect');
  });

  if (currentEngine() === 'postgres') {
    it('[postgres-only] GET /api/health reports 503 with a generic error, never a raw driver error, once the underlying database is genuinely unreachable', async () => {
      // A real failure, not a simulated one: drop the disposable database
      // this exact server is pointed at, out from under it, while it's
      // still running. Safe — this is a database this test run created
      // moments ago (provisionIsolatedDb), never anything preserved or live
      // (see dropPostgresDbSync's own FORBIDDEN_DB_NAMES guard either way).
      dropPostgresDbSync(healthDbCtx.dbName);
      const res = await api('GET', '/api/health');
      assert.equal(res.status, 503);
      assert.equal(res.body.status, 'unavailable');
      assert.equal(res.body.error, 'Database connectivity check failed');
      const raw = JSON.stringify(res.body);
      assert.doesNotMatch(raw, /ECONNREFUSED|password|postgres:\/\//i, 'a real connectivity failure must still never leak driver internals or credentials to the client');
    });
  } else {
    it('[sqlite default — documented, not a real failure-mode test] db.ready() is a no-op under sqlite (see db-sqlite.js), so there is no live connection for this suite to sever; this check only confirms the endpoint itself keeps working under the engine local/CI runs actually use by default. A genuine lost-connection proof exists above under DB_ENGINE=postgres.', async () => {
      const res = await api('GET', '/api/health');
      assert.equal(res.status, 200);
      assert.equal(res.body.engine, 'sqlite');
    });
  }
});

// ---------------------------------------------------------------------------
// Shared primary-db cleanup — suites A-D above all deliberately share the one
// primary database this file's own `db` handle writes fixtures into (see
// suite A's comment), so it can only be torn down once, after every suite
// that might still be using it has finished; a top-level after() is the
// correct place for that, not any individual suite's own after().
// ---------------------------------------------------------------------------
after(() => { dbCtx.cleanup(); });
