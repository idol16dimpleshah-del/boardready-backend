// Readiness Score tests.
//
// Same two-layer convention as test/retest.test.js:
//  (A) Whitebox unit tests directly against readiness.js's pure component
//      functions with synthetic step data (and diagnostics.js's own
//      summarizeGroup, reused rather than re-implemented here).
//  (B) Real HTTP integration tests against a spawned server — end-to-end
//      wiring, the evidence gate below MIN_EVIDENCE, and the paid gate on
//      the per-subject route.
//
// Run with: node --test
//
// ---------------------------------------------------------------------------
// TEST-DATABASE ISOLATION (added 2026-09-23 — see
// docs/test-database-isolation-incident.md for the full incident account).
// This file previously did `const db = require('../db');` with no test-mode
// configuration at all, and separately spawned a real `node server.js` child
// process with `env: { ...process.env, PORT }` — ambiently inheriting
// whatever DB_PATH the invoking shell happened (or didn't happen) to have.
// Both of this session's two live-database-write incidents trace directly to
// that pattern. Fixed here two ways, both required:
//   1. NODE_ENV and DB_PATH are set on process.env, to a uniquely-named
//      throwaway file, BEFORE this file requires ANYTHING from the backend
//      (readiness.js, diagnostics.js, and db.js itself all resolve their own
//      DB_PATH at require-time — so this must happen first, not "eventually").
//      This makes the file self-contained: it no longer matters whether it's
//      invoked via `npm test`, a bare `node --test`, or an IDE's run button,
//      or whether the invoking shell has DB_PATH set to anything at all.
//   2. The server.js child process spawned in before() below is given the
//      SAME explicit NODE_ENV/DB_PATH directly in its own env object,
//      instead of `...process.env` alone — a child process does not
//      automatically see variables set on this file's process.env after the
//      child is spawned via a different mechanism, so this is stated
//      explicitly rather than assumed inherited.
// db.js's own guard (see db.js) is a second, independent layer underneath
// both of these: even if this file's setup here were ever accidentally
// removed or bypassed, db.js refuses outright to open the live database (or
// any known backup/preservation copy) whenever it detects a test context
// with no explicit, verified-safe DB_PATH. This file's job is to make sure
// that verified-safe DB_PATH always exists and is always correct — not to be
// the only thing standing between the tests and the live data.
const path = require('node:path');

// Phase 6B (docs/phase-6-postgres-cutover-plan.md): setupPrimaryTestDbEnv
// picks sqlite (a unique temp file, as before) or postgres (a fresh,
// disposable, schema-migrated database) based on DB_ENGINE, and sets the
// right env var(s) before anything below requires db.js — same timing
// requirement the original inline DB_PATH assignment had, now shared with
// security.test.js rather than duplicated differently in each file.
const { setupPrimaryTestDbEnv } = require('./pg-test-support');
const dbCtx = setupPrimaryTestDbEnv('readiness');

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const readiness = require('../readiness');
const READY_CONFIG = require('../readiness-config');
const diagConfig = require('../diagnostics-config');
const diagnostics = require('../diagnostics');
const db = require('../db');

// db.js only creates the live-vs-test distinction — it doesn't independently
// confirm the two are actually different paths. Assert that here, at
// require-time, so a future change to db.js's defaults that quietly
// collapsed them back together would fail this suite immediately rather
// than silently reopening the exact hole these incidents came from.
if (db.DB_PATH === db.LIVE_DB_PATH) {
  throw new Error(`FATAL: test DB_PATH (${db.DB_PATH}) resolved to the same path as the live database (${db.LIVE_DB_PATH}). Refusing to run tests.`);
}
if (!db.IS_TEST_MODE) {
  throw new Error('FATAL: db.js did not recognize this as a test run (IS_TEST_MODE is false). Refusing to run tests.');
}
console.log(`[readiness.test.js] LIVE DATABASE: ${db.LIVE_DB_PATH}`);
console.log(`[readiness.test.js] TEST DATABASE: ${db.DB_PATH}`);

// ---------------------------------------------------------------------------
// (A) Unit tests — synthetic step data, direct calls into readiness.js
// ---------------------------------------------------------------------------

function makeStep({ attemptId, questionId = 1, submittedAt, correct, difficulty = 'Medium', kind = 'mcq' }) {
  return { attemptId, testId: attemptId, submittedAt, subjectId: 999, subjectName: 'Test Subject', chapterId: 999, chapterName: 'Test Chapter', subConcept: 'Test Concept', questionId, kind, difficulty, marks: 1, correct, key: `${questionId}:` };
}

test('readiness-config: weights sum to 1 (module already asserts this at require-time, re-checked here for clarity)', () => {
  const total = Object.values(READY_CONFIG.WEIGHTS).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(total - 1) < 0.001, `weights must sum to 1, got ${total}`);
});

test('unit: masteryComponent mirrors diagnostics.summarizeGroup accuracy exactly, never a second computation', () => {
  const steps = [
    makeStep({ attemptId: 1, questionId: 1, submittedAt: '2026-08-01 10:00:00', correct: true }),
    makeStep({ attemptId: 1, questionId: 2, submittedAt: '2026-08-01 10:00:00', correct: false }),
    makeStep({ attemptId: 1, questionId: 3, submittedAt: '2026-08-01 10:00:00', correct: true }),
    makeStep({ attemptId: 1, questionId: 4, submittedAt: '2026-08-01 10:00:00', correct: true }),
  ];
  const summary = diagnostics.summarizeGroup(steps);
  const m = readiness.masteryComponent(summary);
  assert.equal(m.value, 75);
  assert.match(m.reason, /75%.*4/);
});

test('unit: masteryComponent with zero steps reports null, never a fabricated 0 or 100', () => {
  const summary = diagnostics.summarizeGroup([]);
  const m = readiness.masteryComponent(summary);
  assert.equal(m.value, null);
});

test('unit: difficultyPerformanceComponent weights Hard above Easy, so an Easy-only 100% run scores lower than a mixed run with the same raw accuracy', () => {
  const easyOnlySteps = Array.from({ length: 6 }, (_, i) => makeStep({ attemptId: 1, questionId: i, submittedAt: '2026-08-01', correct: true, difficulty: 'Easy' }));
  const easyOnly = readiness.difficultyPerformanceComponent(easyOnlySteps);
  assert.equal(easyOnly.value, 100, 'sanity: 100% on the only band present is still 100 (this component alone cannot detect farming — that is syllabusCoverage\'s job)');

  const mixedSteps = [
    ...Array.from({ length: 3 }, (_, i) => makeStep({ attemptId: 1, questionId: `e${i}`, submittedAt: '2026-08-01', correct: true, difficulty: 'Easy' })),
    ...Array.from({ length: 3 }, (_, i) => makeStep({ attemptId: 1, questionId: `h${i}`, submittedAt: '2026-08-01', correct: false, difficulty: 'Hard' })),
  ];
  const mixed = readiness.difficultyPerformanceComponent(mixedSteps);
  // 3 Easy correct (weight 1) + 3 Hard wrong (weight 2): weighted = (100*1*3 + 0*2*3) / (1*3 + 2*3) = 300/9 = 33
  assert.equal(mixed.value, 33);
});

test('unit: difficultyPerformanceComponent returns null (not 0) when no band has enough evidence yet', () => {
  const oneStep = [makeStep({ attemptId: 1, questionId: 1, submittedAt: '2026-08-01', correct: true, difficulty: 'Hard' })];
  const result = readiness.difficultyPerformanceComponent(oneStep, READY_CONFIG);
  assert.equal(result.value, null, `1 attempt is below MIN_EVIDENCE_PER_SLICE (${READY_CONFIG.MIN_EVIDENCE_PER_SLICE}) so this must stay null, not a shaky 100`);
});

test('unit: advancedQuestionPerformanceComponent only counts Hard difficulty or case-study kind questions', () => {
  const steps = [
    makeStep({ attemptId: 1, questionId: 1, submittedAt: '2026-08-01', correct: true, difficulty: 'Easy' }),
    makeStep({ attemptId: 1, questionId: 2, submittedAt: '2026-08-01', correct: true, difficulty: 'Hard' }),
    makeStep({ attemptId: 1, questionId: 3, submittedAt: '2026-08-01', correct: false, difficulty: 'Hard' }),
    makeStep({ attemptId: 1, questionId: 4, submittedAt: '2026-08-01', correct: true, difficulty: 'Medium', kind: 'case' }),
  ];
  const result = readiness.advancedQuestionPerformanceComponent(steps, READY_CONFIG);
  // 3 advanced steps (2 Hard + 1 case), 2 correct -> 67%
  assert.equal(result.value, 67);
});

test('unit: consistencyComponent needs 2+ distinct attempts, mirroring diagnostics.js exactly (reused, not reimplemented)', () => {
  const oneAttempt = [makeStep({ attemptId: 1, questionId: 1, submittedAt: '2026-08-01', correct: true })];
  assert.equal(readiness.consistencyComponent(diagnostics.summarizeGroup(oneAttempt)).value, null);

  const twoAttempts = [
    makeStep({ attemptId: 1, questionId: 1, submittedAt: '2026-08-01', correct: true }),
    makeStep({ attemptId: 2, questionId: 2, submittedAt: '2026-08-02', correct: true }),
  ];
  assert.equal(readiness.consistencyComponent(diagnostics.summarizeGroup(twoAttempts)).value, 100, 'identical 100% accuracy on both attempts means zero spread, so consistency = 100');
});

test('unit: evidenceFor gates on BOTH raw sample size and how many components resolved — high sample with thin component coverage is medium/low, never high', () => {
  const highSampleLowComponents = readiness.evidenceFor(diagConfig.CONFIRMED_EVIDENCE + 50, 20);
  assert.notEqual(highSampleLowComponents.level, 'high', 'lots of raw attempts alone must not be enough for "high" if most components could not be computed');

  const belowMinEvidence = readiness.evidenceFor(diagConfig.MIN_EVIDENCE - 1, 100);
  assert.equal(belowMinEvidence.level, 'insufficient');

  const both = readiness.evidenceFor(diagConfig.CONFIRMED_EVIDENCE + 1, 90);
  assert.equal(both.level, 'high');
});

test('unit: labelFor maps scores into the configured qualitative bands, boundary-inclusive', () => {
  assert.equal(readiness.labelFor(0), 'Building');
  assert.equal(readiness.labelFor(49), 'Building');
  assert.equal(readiness.labelFor(50), 'Developing');
  assert.equal(readiness.labelFor(84), 'Exam Ready');
  assert.equal(readiness.labelFor(85), 'High Confidence');
  assert.equal(readiness.labelFor(100), 'High Confidence');
  assert.equal(readiness.labelFor(null), null, 'no score should never get a fabricated label');
});

// ---------------------------------------------------------------------------
// (B) Integration tests — real HTTP calls against a spawned server
// ---------------------------------------------------------------------------

const PORT = 4509;
const BASE = `http://localhost:${PORT}`;
let serverProcess;

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
  // Minimal fixture data, inserted directly into the isolated test database
  // via the already-required `db` (see require('../db') above — it opened
  // dbCtx's own isolated database, never the live one). A brand-new,
  // freshly-created test database has zero rows in every table by design
  // (that IS the isolation this file now has); one of the tests below has
  // always assumed a CBSE "Mathematics" subject exists to look up by name.
  // Before this fix, that assumption was silently satisfied by falling
  // through to the LIVE database's real seeded data — exactly the coupling
  // that made this file's isolation bug invisible for as long as it was.
  // Made explicit here rather than reintroducing any dependency on a shared
  // or live database.
  //
  // Phase 6B: now `await`ed — a mechanical fix, not a behavior change.
  // Under the sqlite engine (still the default) this call was always
  // synchronous and `await` on its plain return value just resolves it
  // immediately; under DB_ENGINE=postgres it's a real Promise, and this is
  // exactly the "un-awaited direct db.prepare() call in test setup" gap
  // flagged when Stage 6A closed — caught and cleaned up here, in the
  // formal regression stage, as intended.
  await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('CBSE', 'Mathematics', '10')").run();

  // Explicitly stated, not inherited: this child process gets dbCtx's own
  // childEnv directly, so its own independent load of db.js opens the exact
  // same isolated test database as this parent process — never a chance to
  // fall through to db.js's live-default branch. This is the exact line
  // that both incidents trace back to (see the header comment above) —
  // `...process.env` alone was never enough, because it only carries
  // forward whatever was ambient in the invoking shell, not necessarily
  // what this file just set on its own process.env.
  serverProcess = spawn('node', ['server.js'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: String(PORT), ...dbCtx.childEnv },
    stdio: 'pipe',
  });
  serverProcess.stderr.on('data', (d) => process.stderr.write(`[server] ${d}`));
  await waitForServer();
});
after(async () => {
  if (serverProcess) serverProcess.kill();
  // Best-effort cleanup of the throwaway test database — never fatal if
  // this fails. sqlite: a /tmp file (and any sidecar files) with a unique
  // per-run name; postgres: DROP DATABASE on a database this same process
  // created moments ago. Never the live database or anything preserved —
  // dbCtx.cleanup() has its own denylist as a second guard against dropping
  // anything named boardready/boardready_production/boardready_staging.
  dbCtx.cleanup();
});

const stamp = Date.now();

test('GET /api/diagnostics/me/readiness — brand-new student with zero attempts gets a clean insufficient-evidence response, never a fabricated score', async () => {
  const s = await api('POST', '/api/auth/register', { body: { name: 'Fresh Student', email: `readiness-fresh-${stamp}@boardready.test`, password: 'testpass123', role: 'student' } });
  const res = await api('GET', '/api/diagnostics/me/readiness', { token: s.body.token });
  assert.equal(res.status, 200);
  assert.equal(res.body.knowledgeMasteryPct, null);
  assert.equal(res.body.examReadiness, null);
  assert.equal(res.body.evidence.level, 'insufficient');
  assert.equal(res.body.hasAnyData, false);
});

test('GET /api/diagnostics/me/subjects/:subjectId/readiness — no active subscription returns unlocked:false with an upsell, no numbers leaked', async () => {
  const s = await api('POST', '/api/auth/register', { body: { name: 'No Sub Student', email: `readiness-nosub-${stamp}@boardready.test`, password: 'testpass123', role: 'student' } });
  const subjects = await api('GET', '/api/subjects?board=CBSE');
  const mathsSubjectId = subjects.body.subjects.find((x) => x.name === 'Mathematics').id;
  const res = await api('GET', `/api/diagnostics/me/subjects/${mathsSubjectId}/readiness`, { token: s.body.token });
  assert.equal(res.status, 200);
  assert.equal(res.body.unlocked, false);
  assert.ok(res.body.upsell, 'a locked response must still explain how to unlock, not just go blank');
  assert.equal(res.body.knowledgeMasteryPct, undefined, 'no readiness numbers may leak past the paid gate');
});

test('GET /api/diagnostics/me/subjects/:subjectId/readiness — unauthenticated request is rejected', async () => {
  const res = await api('GET', '/api/diagnostics/me/subjects/1/readiness');
  assert.equal(res.status, 401);
});
