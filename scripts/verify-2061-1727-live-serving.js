// Batch 15A, Task 10 (of the corrected batch) -- live serving-query check
// for questions 2061 and 1727 now that both are genuinely live
// (status/answer_status='verified', diagram_status='adapted_verified').
// Unlike the Batch 15 Task 11/12 browser-QA scripts (which built disposable
// fixtures because these rows weren't live yet), this script copies the
// REAL current live database and drives the REAL HTTP API end to end
// against that copy -- proving the actual promoted+associated rows serve
// correctly, not a synthesized stand-in. The live boardready.db itself is
// never written by this script (a plain file copy, then all API calls
// target the copy via DB_PATH).
//
// Checks:
//   - GET /api/attempts/:id/questions resolves diagram_url to the
//     ai_generated SVG (not the source_cropped PNG) for both questions.
//   - The SVG served at that diagram_url has the exact bytes of the
//     committed GENERATED.svg file on disk.
//   - POST /api/attempts/:id/check grades the correct option index as
//     correct for both questions, via the real endpoint (not a
//     scoring.js unit call).
//
// Usage: node scripts/verify-2061-1727-live-serving.js

const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const { spawn } = require('node:child_process');
const { DatabaseSync } = require('node:sqlite');

const BACKEND_ROOT = path.join(__dirname, '..');
const LIVE_DB_PATH = path.join(BACKEND_ROOT, 'boardready.db');
const COPY_DB_PATH = path.join(BACKEND_ROOT, 'backups', `serving-check-copy-${Date.now()}.db`);
const PORT = 4885;
const BASE = `http://127.0.0.1:${PORT}`;

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERTION FAILED: ' + msg);
}

async function api(method, urlPath, { token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${urlPath}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch { /* no body */ }
  return { status: res.status, body: json };
}

async function waitForHealth(maxMs) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) return true;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
}

async function main() {
  console.log(`Live DB hash before this script touches anything: ${crypto.createHash('sha256').update(fs.readFileSync(LIVE_DB_PATH)).digest('hex')}`);

  fs.copyFileSync(LIVE_DB_PATH, COPY_DB_PATH);
  console.log(`Copied live DB -> ${COPY_DB_PATH} (this script operates ONLY on the copy from here on).`);

  // Sanity: confirm the copy really has both questions live/associated,
  // and grab their exact diagram asset paths, before starting the server.
  const roDb = new DatabaseSync(COPY_DB_PATH, { readOnly: true });
  const expectedByQuestion = {};
  for (const id of [2061, 1727]) {
    const q = roDb.prepare('SELECT id, status, answer_status, diagram_status, correct FROM questions WHERE id = ?').get(id);
    assert(q.status === 'verified' && q.answer_status === 'verified' && q.diagram_status === 'adapted_verified',
      `id ${id} is not fully live in the copy: ${JSON.stringify(q)}`);
    const asset = roDb.prepare(`SELECT asset_path FROM visual_assets WHERE question_id = ? AND asset_type = 'ai_generated'`).get(id);
    assert(asset, `id ${id} has no ai_generated visual_assets row`);
    expectedByQuestion[id] = { correct: q.correct, expectedDiagramUrl: '/' + asset.asset_path };
  }
  roDb.close();
  console.log('Pre-flight OK on the copy:', JSON.stringify(expectedByQuestion));

  // subjectId only, set up before the server starts (no FK to a user).
  const rwDb0 = new DatabaseSync(COPY_DB_PATH);
  const subjectId = Number(rwDb0.prepare(`INSERT INTO subjects (board, name, class) VALUES ('ICSE', 'Serving-Check', 10)`).run().lastInsertRowid);
  rwDb0.close();

  const child = spawn(process.execPath, ['server.js'], {
    cwd: BACKEND_ROOT,
    env: { ...process.env, DB_PATH: COPY_DB_PATH, PORT: String(PORT), AUTH_SECRET: 'serving-check-secret-not-for-production' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let serverOutput = '';
  child.stdout.on('data', (d) => { serverOutput += d.toString(); });
  child.stderr.on('data', (d) => { serverOutput += d.toString(); });

  try {
    const up = await waitForHealth(10000);
    assert(up, `server did not become healthy in time. Output so far:\n${serverOutput}`);
    console.log('Server up on', BASE);

    const email = `serving-check-${Date.now()}@boardready.test`;
    const reg = await api('POST', '/api/auth/register', { body: { name: 'Serving Check', email, password: 'testpass123', role: 'student' } });
    assert(reg.status === 201, `registration failed: ${JSON.stringify(reg)}`);
    const token = reg.body.token;
    const studentId = reg.body.user.id;

    // Now that the student exists, create the test/test_questions fixture
    // pointing at these two REAL live questions, via a second write-capable
    // handle to the COPY (never the live file). The server holds its own
    // connection to the same file; this write happens synchronously before
    // any further API calls, so there is no concurrent-write race.
    const rwDb = new DatabaseSync(COPY_DB_PATH);
    const testId = Number(rwDb.prepare(`INSERT INTO tests (student_id, subject_id, kind, feedback_mode) VALUES (?, ?, 'practice', 'immediate')`).run(studentId, subjectId).lastInsertRowid);
    rwDb.prepare(`INSERT INTO test_questions (test_id, question_id, order_index) VALUES (?, ?, 0)`).run(testId, 2061);
    rwDb.prepare(`INSERT INTO test_questions (test_id, question_id, order_index) VALUES (?, ?, 1)`).run(testId, 1727);
    rwDb.close();
    console.log(`Fixture test id ${testId} created on the copy for student ${studentId}, containing questions 2061 and 1727.`);

    const attempt = await api('POST', '/api/attempts', { token, body: { test_id: testId } });
    assert(attempt.status === 201, `attempt creation failed: ${JSON.stringify(attempt)}`);

    const qres = await api('GET', `/api/attempts/${attempt.body.id}/questions`, { token });
    assert(qres.status === 200, `fetching questions failed: ${JSON.stringify(qres)}`);
    const steps = qres.body.steps;
    console.log('Questions endpoint returned', Array.isArray(steps) ? steps.length : 'non-array', 'steps.');

    for (const id of [2061, 1727]) {
      const step = (Array.isArray(steps) ? steps : []).find((s) => s.questionId === id || s.id === id);
      assert(step, `no step found for question ${id} in the response: ${JSON.stringify(qres.body)}`);
      const diagramUrl = step.diagramUrl ?? step.diagram_url;
      assert(diagramUrl === expectedByQuestion[id].expectedDiagramUrl,
        `id ${id}: expected diagramUrl ${expectedByQuestion[id].expectedDiagramUrl}, got ${diagramUrl}`);
      console.log(`id ${id}: diagramUrl correctly resolves to ${diagramUrl} (ai_generated, not source_cropped)`);

      // Fetch the actual SVG bytes served at that URL and compare to the
      // committed file on disk -- proves the static file route serves the
      // real, committed asset, not something stale or substituted.
      const svgRes = await fetch(`${BASE}${diagramUrl}`);
      assert(svgRes.status === 200, `serving diagramUrl for id ${id} failed with status ${svgRes.status}`);
      const servedBytes = Buffer.from(await svgRes.arrayBuffer());
      const onDiskBytes = fs.readFileSync(path.join(BACKEND_ROOT, diagramUrl.replace(/^\//, '')));
      assert(servedBytes.equals(onDiskBytes), `id ${id}: served SVG bytes do not match the on-disk committed file`);
      console.log(`id ${id}: served SVG bytes byte-identical to the committed extracted-diagrams file (${servedBytes.length} bytes).`);
    }

    // Grade both with their correct answer via the real check endpoint.
    for (const id of [2061, 1727]) {
      const step = (Array.isArray(steps) ? steps : []).find((s) => s.questionId === id || s.id === id);
      const key = step.key ?? `${id}:`;
      const check = await api('POST', `/api/attempts/${attempt.body.id}/check`, {
        token,
        body: { key, answer: { optionIndex: expectedByQuestion[id].correct } },
      });
      assert(check.status === 200, `check endpoint failed for id ${id}: ${JSON.stringify(check)}`);
      assert(check.body.correct === true, `id ${id}: submitting the correct index (${expectedByQuestion[id].correct}) did not grade correct: ${JSON.stringify(check.body)}`);
      console.log(`id ${id}: submitting the live correct index via POST /api/attempts/:id/check grades correct.`);
    }

    console.log('\nALL LIVE SERVING-QUERY CHECKS PASSED for 2061 and 1727.');
  } finally {
    child.kill();
    fs.rmSync(COPY_DB_PATH, { force: true });
    console.log(`Disposable copy removed: ${COPY_DB_PATH}`);
  }

  const hashAfter = crypto.createHash('sha256').update(fs.readFileSync(LIVE_DB_PATH)).digest('hex');
  console.log(`Live DB hash after this script: ${hashAfter} (must be unchanged).`);
}

main().catch((err) => {
  console.error('\nSCRIPT FAILED:', err.message);
  try { fs.rmSync(COPY_DB_PATH, { force: true }); } catch { /* best effort */ }
  process.exitCode = 1;
});
