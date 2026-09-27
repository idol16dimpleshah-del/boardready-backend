// Stage 6B (docs/phase-6-postgres-cutover-plan.md) — PostgreSQL-specific
// regression tests. This is checklist item 4 ("new PostgreSQL-specific
// regression tests") AND item 7 ("concurrency tests") from the user's
// explicit 10-point Stage 6B specification: proving the mechanical
// compatibility fixes made during Stage 6A actually hold under real,
// concurrent, HTTP-level load — not just the isolated database-layer proof
// Phase 4's concurrency-test.js gave (that file explicitly scoped itself to
// "the database layer can execute requests concurrently," and deferred full
// HTTP-level concurrency testing; this file is that deferred work, now that
// Stage 6A's async/transaction/locking rewrite exists to test).
//
// Four things are covered here, each corresponding to a real, specific bug
// class found (and fixed) during Stage 6A/6B:
//   A. The db-postgres.js test-database isolation guard actually refuses a
//      reserved/missing DATABASE_URL — tested by calling the engine module
//      directly, independent of DB_ENGINE, so this always runs regardless
//      of which engine the rest of this file's suite is exercising.
//   B. The camelCase-alias-quoting + COUNT()-as-bigint-string coercion fix
//      in GET /api/content/summary (server.js) — a real regression: before
//      the fix, Postgres silently lowercase-folded the unquoted aliases and
//      returned COUNT() as a string, which the totals reduce() would have
//      silently string-concatenated instead of summed.
//   C. The circular FK relationship between tests.improves_attempt_id and
//      attempts.test_id, exercised live via a real "Improve My Score" flow
//      (not just proven migratable via deferred constraints at migration
//      time, which stage6b-migrate.js already does).
//   D. Real concurrent HTTP requests against the three endpoints Stage 6A
//      wrapped in db.transaction()+FOR UPDATE (/check, /submit) — proving
//      the app-level fix holds under actual concurrent load, matching (and
//      going beyond) Phase 4's database-layer-only proof.
//
// Run with: node --test (same test-database-isolation convention as
// readiness.test.js and security.test.js — see pg-test-support.js).

const path = require('node:path');
const { setupPrimaryTestDbEnv } = require('./pg-test-support');
const dbCtx = setupPrimaryTestDbEnv('postgres_regression');

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const db = require('../db');

if (db.DB_PATH === db.LIVE_DB_PATH) {
  throw new Error(`FATAL: test DB_PATH (${db.DB_PATH}) resolved to the same path as the live database (${db.LIVE_DB_PATH}). Refusing to run tests.`);
}
if (!db.IS_TEST_MODE) {
  throw new Error('FATAL: db.js did not recognize this as a test run (IS_TEST_MODE is false). Refusing to run tests.');
}
console.log(`[postgres-regression.test.js] LIVE DATABASE: ${db.LIVE_DB_PATH}`);
console.log(`[postgres-regression.test.js] TEST DATABASE: ${db.DB_PATH}`);

// ---------------------------------------------------------------------------
// A. Isolation guard — calls db-postgres.js's factory DIRECTLY, bypassing
// db.js's own DB_ENGINE dispatch entirely, so these three checks always run
// no matter which engine `npm test`/`node --test` was invoked under. Each
// case deletes the require cache entry first since createPostgresDb() reads
// DATABASE_URL once, at call time, and a bare require() would otherwise
// return the very first call's already-decided result on every subsequent
// call in this same process.
// ---------------------------------------------------------------------------
describe('postgres regression: db-postgres.js test-isolation guard (engine-independent)', () => {
  function freshFactory() {
    delete require.cache[require.resolve('../db-postgres')];
    return require('../db-postgres');
  }

  test('refuses isTestMode with no DATABASE_URL at all', () => {
    const original = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    try {
      assert.throws(() => freshFactory()(true, 'unit-test: no DATABASE_URL'), /isolation guard tripped/);
    } finally {
      if (original !== undefined) process.env.DATABASE_URL = original; else delete process.env.DATABASE_URL;
    }
  });

  test('refuses a reserved production/staging-sounding database name', () => {
    const original = process.env.DATABASE_URL;
    process.env.DATABASE_URL = 'postgres://boardready_migration:boardready_dev_pw@127.0.0.1:5432/boardready';
    try {
      assert.throws(() => freshFactory()(true, 'unit-test: reserved name'), /isolation guard tripped/);
    } finally {
      if (original !== undefined) process.env.DATABASE_URL = original; else delete process.env.DATABASE_URL;
    }
  });

  test('allows a properly-named disposable test database', () => {
    const original = process.env.DATABASE_URL;
    process.env.DATABASE_URL = 'postgres://boardready_migration:boardready_dev_pw@127.0.0.1:5432/boardready_test_unit_guard_check';
    try {
      assert.doesNotThrow(() => freshFactory()(true, 'unit-test: disposable name'));
    } finally {
      if (original !== undefined) process.env.DATABASE_URL = original; else delete process.env.DATABASE_URL;
      delete require.cache[require.resolve('../db-postgres')];
    }
  });
});

// ---------------------------------------------------------------------------
// B, C, D — real HTTP integration tests against a spawned server, exactly
// the same spawn/isolation convention as readiness.test.js and
// security.test.js.
// ---------------------------------------------------------------------------
describe('postgres regression: HTTP-level (alias/type coercion, circular FK, concurrency)', () => {
  const PORT = 4613;
  const BASE = `http://localhost:${PORT}`;
  let serverProcess;
  let studentToken;
  let subjectId;
  let chapterId;
  const GRADABLE_QUESTION_COUNT = 24; // enough for a 10-question attempt plus a widened improve-my-score pool afterward
  const NON_GRADABLE_QUESTION_COUNT = 3; // must be excluded from /api/content/summary's questionCount

  async function waitForServer(timeoutMs = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try { const res = await fetch(`${BASE}/api/subjects`); if (res.ok || res.status === 404) return; } catch { /* not up yet */ }
      await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error('Server did not become ready in time');
  }
  async function api(method, urlPath, { token, body } = {}) {
    const res = await fetch(`${BASE}${urlPath}`, {
      method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    let json = null; try { json = await res.json(); } catch { /* no body */ }
    return { status: res.status, body: json };
  }

  before(async () => {
    // Fixture: one CBSE subject/chapter, GRADABLE_QUESTION_COUNT gradable
    // MCQs (status='verified', in GRADABLE_STATUSES) plus
    // NON_GRADABLE_QUESTION_COUNT draft (non-gradable) questions in the same
    // chapter — the draft ones exist specifically to prove the
    // content/summary query's `q.status IN (...)` filter (and therefore its
    // JOIN cardinality feeding COUNT()) is still correct under Postgres.
    const subj = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('CBSE', 'ZZ-Regression-Subject', '10') RETURNING id").run();
    subjectId = Number(subj.lastInsertRowid);
    const chap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, 'ZZ-Regression-Chapter');
    chapterId = Number(chap.lastInsertRowid);

    const insertQuestion = db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct, sub_concept)
      VALUES (?, 'mcq', ?, 'verified', 1, 'Medium', ?, ?, ?, ?)`);
    for (let i = 0; i < GRADABLE_QUESTION_COUNT; i++) {
      await insertQuestion.run(chapterId, 'verified', `ZZ regression question ${i}: 2 + 2 = ?`, JSON.stringify(['3', '4', '5', '6']), 1, 'zz_regression');
    }
    for (let i = 0; i < NON_GRADABLE_QUESTION_COUNT; i++) {
      await insertQuestion.run(chapterId, 'draft', `ZZ regression DRAFT (non-gradable) question ${i}`, JSON.stringify(['a', 'b', 'c', 'd']), 0, 'zz_regression');
    }

    // Authentication happens via the real HTTP register endpoint below, once
    // the server is up (matching every other integration test in this
    // project) — never a direct db insert, since that would bypass
    // auth.hashPassword's real hashing.
    serverProcess = spawn('node', ['server.js'], {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, PORT: String(PORT), ...dbCtx.childEnv },
      stdio: 'pipe',
    });
    serverProcess.stderr.on('data', (d) => process.stderr.write(`[server] ${d}`));
    await waitForServer();

    const registered = await api('POST', '/api/auth/register', {
      body: { name: 'ZZ Regression Student', email: `zz-regression-${Date.now()}@boardready.test`, password: 'testpass123', role: 'student' },
    });
    assert.equal(registered.status, 201, `registration must succeed: ${JSON.stringify(registered.body)}`);
    studentToken = registered.body.token;
  });

  after(async () => {
    if (serverProcess) serverProcess.kill();
    dbCtx.cleanup();
  });

  // -------------------------------------------------------------------------
  // B. camelCase alias quoting + COUNT()-as-bigint-string coercion
  // -------------------------------------------------------------------------
  test('B: GET /api/content/summary returns real numbers (not strings) and correct camelCase-keyed counts', async () => {
    const res = await api('GET', '/api/content/summary');
    assert.equal(res.status, 200);
    const cbseRow = res.body.byBoard.find((r) => r.board === 'CBSE');
    assert.ok(cbseRow, 'expected a CBSE row in byBoard');

    // The regression this guards against: before Stage 6A's fix, Postgres
    // lowercase-folded the unquoted aliases (breaking r.subjectCount et al
    // entirely) and returned COUNT() as a string (making the totals
    // reduce() silently string-concatenate). Assert the actual JS type, not
    // just the value — a passing `=== 24` assertion on a string "24" would
    // hide exactly this bug if `Number(...)` were ever accidentally removed.
    assert.equal(typeof cbseRow.subjectCount, 'number');
    assert.equal(typeof cbseRow.chapterCount, 'number');
    assert.equal(typeof cbseRow.questionCount, 'number');

    // Precise counts: this is a freshly-isolated test database, so the CBSE
    // board contains exactly what this file's before() seeded — 1 subject,
    // 1 chapter, and GRADABLE_QUESTION_COUNT gradable questions (the
    // NON_GRADABLE_QUESTION_COUNT draft ones must NOT be counted).
    assert.equal(cbseRow.subjectCount, 1);
    assert.equal(cbseRow.chapterCount, 1);
    assert.equal(cbseRow.questionCount, GRADABLE_QUESTION_COUNT);

    assert.equal(typeof res.body.totals.subjects, 'number');
    assert.equal(typeof res.body.totals.chapters, 'number');
    assert.equal(typeof res.body.totals.questions, 'number');
    assert.equal(res.body.totals.subjects, 1);
    assert.equal(res.body.totals.chapters, 1);
    assert.equal(res.body.totals.questions, GRADABLE_QUESTION_COUNT);
  });

  // -------------------------------------------------------------------------
  // C. Circular FK — tests.improves_attempt_id <-> attempts.test_id,
  // exercised live via a real Improve My Score flow, not just proven
  // migratable at migration time.
  // -------------------------------------------------------------------------
  test('C: circular FK (tests.improves_attempt_id <-> attempts.test_id) works end-to-end via a real Improve My Score flow', async () => {
    // 1. Generate and submit a source attempt, deliberately all wrong, so
    //    Improve My Score has real weak sub-concepts/chapters to target.
    const gen = await api('POST', '/api/practice/generate', { token: studentToken, body: { subjectId, chapterId, count: 10 } });
    assert.equal(gen.status, 201, JSON.stringify(gen.body));
    const started = await api('POST', '/api/attempts', { token: studentToken, body: { test_id: gen.body.id } });
    const qres = await api('GET', `/api/attempts/${started.body.id}/questions`, { token: studentToken });
    const wrongAnswers = {};
    for (const s of qres.body.steps) wrongAnswers[`${s.questionId}:${s.label || ''}`] = { optionIndex: 3 }; // every seeded question's correct index is 1 -> 3 is always wrong
    const submit1 = await api('POST', `/api/attempts/${started.body.id}/submit`, { token: studentToken, body: { answers: wrongAnswers } });
    assert.equal(submit1.status, 200);
    assert.equal(submit1.body.score, 0, 'sanity: source attempt must be a real, known 0-score run');
    const sourceAttemptId = submit1.body.attemptId;

    // 2. "Improve My Score" from that specific attempt — this is the write
    //    into tests.improves_attempt_id, a forward reference to a row in
    //    attempts (attempts.test_id itself references tests.id) -- the
    //    circular relationship between the two tables, now exercised as a
    //    live write+read, not just migrated.
    const improve = await api('POST', '/api/tests/improve', { token: studentToken, body: { sourceAttemptId, count: 12 } });
    assert.equal(improve.status, 201, JSON.stringify(improve.body));
    assert.equal(improve.body.improvesAttemptId, sourceAttemptId);

    // 3. Run and submit the improvement test, all correct this time, and
    //    confirm the server reads its own improves_attempt_id back out
    //    (server.js's `if (test.improves_attempt_id)` branch) and returns a
    //    real improvementComparison built from both attempts' real data.
    const started2 = await api('POST', '/api/attempts', { token: studentToken, body: { test_id: improve.body.id } });
    const qres2 = await api('GET', `/api/attempts/${started2.body.id}/questions`, { token: studentToken });
    const rightAnswers = {};
    for (const s of qres2.body.steps) rightAnswers[`${s.questionId}:${s.label || ''}`] = { optionIndex: 1 }; // every seeded question's correct index is 1
    const submit2 = await api('POST', `/api/attempts/${started2.body.id}/submit`, { token: studentToken, body: { answers: rightAnswers } });
    assert.equal(submit2.status, 200, JSON.stringify(submit2.body));
    assert.equal(submit2.body.score, submit2.body.maxScore, 'sanity: improvement attempt must be a real, known all-correct run');
    assert.ok(submit2.body.improvementComparison, 'expected a real improvementComparison, built by reading test.improves_attempt_id back from Postgres');
    assert.equal(submit2.body.improvementComparison.sourceAttemptId, sourceAttemptId);
  });

  // -------------------------------------------------------------------------
  // D. Real concurrent HTTP load against the three Stage 6A
  // transaction+FOR UPDATE endpoints — the deferred work Phase 4's
  // concurrency-test.js explicitly scoped itself out of.
  // -------------------------------------------------------------------------
  test('D1: two simultaneous POST /submit for the SAME attempt — exactly one succeeds, the other gets a clean 409 (never both 200, never a lost/duplicate score)', async () => {
    const gen = await api('POST', '/api/practice/generate', { token: studentToken, body: { subjectId, chapterId, count: 5 } });
    const started = await api('POST', '/api/attempts', { token: studentToken, body: { test_id: gen.body.id } });
    const qres = await api('GET', `/api/attempts/${started.body.id}/questions`, { token: studentToken });
    const answers = {};
    for (const s of qres.body.steps) answers[`${s.questionId}:${s.label || ''}`] = { optionIndex: 1 };

    // Fired genuinely concurrently (Promise.all, not awaited one after the
    // other) — this is exactly the double-click "Submit" race the Stage 6A
    // header comment on POST /:id/submit describes, and exactly what
    // db.transaction()+`SELECT ... FOR UPDATE` is there to serialize.
    const [r1, r2] = await Promise.all([
      api('POST', `/api/attempts/${started.body.id}/submit`, { token: studentToken, body: { answers } }),
      api('POST', `/api/attempts/${started.body.id}/submit`, { token: studentToken, body: { answers } }),
    ]);
    const statuses = [r1.status, r2.status].sort();
    assert.deepEqual(statuses, [200, 409], `expected exactly one 200 and one 409 under real concurrent load, got ${JSON.stringify(statuses)}`);

    // Confirm the database itself agrees there is exactly one, unambiguous
    // final state — never two interleaved partial writes.
    const row = await db.prepare('SELECT score, max_score, submitted_at FROM attempts WHERE id = ?').get(started.body.id);
    assert.ok(row.submitted_at, 'attempt must end up submitted exactly once');
    assert.equal(row.score, row.max_score, 'the one winning submit must have scored all-correct, exactly as answered');
  });

  test('D2: N simultaneous POST /check calls for N different keys on the SAME attempt — zero lost updates in locked_answers_json', async () => {
    const N = 10;
    const gen = await api('POST', '/api/practice/generate', { token: studentToken, body: { subjectId, chapterId, count: N } });
    const started = await api('POST', '/api/attempts', { token: studentToken, body: { test_id: gen.body.id } });
    const qres = await api('GET', `/api/attempts/${started.body.id}/questions`, { token: studentToken });
    assert.equal(qres.body.steps.length, N);

    // This is exactly the scenario Stage 6A's own comment on POST
    // /:id/check calls out: N /check calls for N different keys on the same
    // attempt, fired in quick succession, must not let one overwrite
    // another's freshly-locked answer via a lost read-modify-write. Fired
    // genuinely concurrently via Promise.all.
    const results = await Promise.all(qres.body.steps.map((s) =>
      api('POST', `/api/attempts/${started.body.id}/check`, { token: studentToken, body: { key: `${s.questionId}:${s.label || ''}`, answer: { optionIndex: 1 } } })
    ));
    for (const r of results) assert.equal(r.status, 200, JSON.stringify(r.body));

    // The sharpest possible check: read locked_answers_json directly out of
    // Postgres and confirm all N concurrent writes actually landed — a lost
    // update here would show up as fewer than N keys, even though every
    // individual HTTP call above returned 200.
    const row = await db.prepare('SELECT locked_answers_json FROM attempts WHERE id = ?').get(started.body.id);
    const locked = JSON.parse(row.locked_answers_json);
    assert.equal(Object.keys(locked).length, N, `expected all ${N} concurrent /check calls to be reflected in locked_answers_json with zero lost updates, got ${Object.keys(locked).length}`);

    // Finally submit and confirm the locked answers (not body.answers) are
    // what get scored — answeredCount must be exactly N.
    const submit = await api('POST', `/api/attempts/${started.body.id}/submit`, { token: studentToken, body: { answers: {} } });
    assert.equal(submit.status, 200, JSON.stringify(submit.body));
    assert.equal(submit.body.answeredCount, N);
    assert.equal(submit.body.score, submit.body.maxScore);
  });
});
