// Redesign API (2026-10-18, branch redesign/board-ready-2026-ui) — covers the
// additive API changes made for the Board Ready 2026 UI:
//   1. POST /api/attempts/:id/submit perQuestion gains marks/kind/questionType.
//   2. GET /api/attempts/:id/result — same shape as submit (shared builder),
//      plus submittedAt/startedAt/durationSeconds/timeTakenSeconds/test{...};
//      404 for another student, 409 before submit.
//   3. GET /api/attempts/me rows gain improvesAttemptId.
//   4. POST /api/tests/improve prefers questions the student has never seen
//      in ANY prior attempt, and reports truthful `freshness` counts.
//   5. improvementComparison.freshness on submit AND result.
//
// TEST-DATABASE ISOLATION — same discipline as every other file in this
// directory (see docs/test-database-isolation-incident.md): NODE_ENV=test and
// a disposable DB_PATH (or DATABASE_URL under DB_ENGINE=postgres) are set via
// pg-test-support.js BEFORE anything requires db.js, the spawned server gets
// that same explicit env, and the file refuses to run if db.js resolved to
// the live database. Nothing here ever opens or writes boardready.db.
const path = require('node:path');
const { setupPrimaryTestDbEnv } = require('./pg-test-support');
const dbCtx = setupPrimaryTestDbEnv('redesign_api_main');

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');

const db = require('../db');

if (db.DB_PATH === db.LIVE_DB_PATH) {
  throw new Error(`FATAL: test DB_PATH (${db.DB_PATH}) resolved to the same path as the live database (${db.LIVE_DB_PATH}). Refusing to run tests.`);
}
if (!db.IS_TEST_MODE) {
  throw new Error('FATAL: db.js did not recognize this as a test run (IS_TEST_MODE is false). Refusing to run tests.');
}
console.log(`[redesign-api.test.js] LIVE DATABASE: ${db.LIVE_DB_PATH}`);
console.log(`[redesign-api.test.js] TEST DATABASE: ${db.DB_PATH}`);

const BACKEND_ROOT = path.join(__dirname, '..');
const PORT = 4640;
const BASE = `http://localhost:${PORT}`;
const AUTH_SECRET = 'redesign-api-fixed-test-secret-do-not-reuse';

async function waitForServer(timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try { const res = await fetch(`${BASE}/api/subjects`); if (res.ok || res.status === 404) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`Server at ${BASE} did not become ready in time`);
}
async function api(method, urlPath, { token, body } = {}) {
  const res = await fetch(`${BASE}${urlPath}`, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  let json = null; try { json = await res.json(); } catch { /* no body */ }
  return { status: res.status, body: json };
}

const stamp = Date.now();
async function registerStudent(tag) {
  const r = await api('POST', '/api/auth/register', { body: { name: `Redesign ${tag}`, email: `redesign-${tag}-${stamp}@boardready.test`, password: 'testpass123', role: 'student' } });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  return { token: r.body.token, id: r.body.user.id };
}
async function insertSubject(name) {
  const r = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('CBSE', ?, '10') RETURNING id").run(name);
  return Number(r.lastInsertRowid);
}
async function insertChapter(subjectId, name) {
  const r = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, name);
  return Number(r.lastInsertRowid);
}
// Gradable MCQ, correct option is always index 0.
async function insertMcq(chapterId, text, subConcept = null, questionType = 'mcq', marks = 1) {
  const r = await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct, sub_concept, question_type)
    VALUES (?, 'mcq', 'verified', 'source_provided', ?, 'Easy', ?, '["A","B","C","D"]', 0, ?, ?) RETURNING id`).run(chapterId, marks, text, subConcept, questionType);
  return Number(r.lastInsertRowid);
}
// Hand-built test row (+ test_questions) so a scenario controls EXACTLY which
// questions a student has been served — then attempted through the real API.
async function insertTest(studentId, subjectId, questionIds, { chapterId = null, feedbackMode = 'immediate' } = {}) {
  const r = await db.prepare(`INSERT INTO tests (student_id, subject_id, kind, practice_chapter_id, practice_sub_concept, duration_seconds, feedback_mode) VALUES (?, ?, 'practice', ?, NULL, 600, ?) RETURNING id`)
    .run(studentId, subjectId, chapterId, feedbackMode);
  const testId = Number(r.lastInsertRowid);
  for (const [i, qid] of questionIds.entries()) {
    await db.prepare('INSERT INTO test_questions (test_id, question_id, order_index) VALUES (?, ?, ?)').run(testId, qid, i);
  }
  return testId;
}
async function startAndSubmit(token, testId, answerFor) {
  const started = await api('POST', '/api/attempts', { token, body: { test_id: testId } });
  assert.ok([200, 201].includes(started.status), JSON.stringify(started.body));
  const qs = await api('GET', `/api/attempts/${started.body.id}/questions`, { token });
  assert.equal(qs.status, 200);
  const answers = {};
  for (const s of qs.body.steps) answers[`${s.questionId}:${s.label || ''}`] = { optionIndex: answerFor(s) };
  const submit = await api('POST', `/api/attempts/${started.body.id}/submit`, { token, body: { answers } });
  assert.equal(submit.status, 200, JSON.stringify(submit.body));
  return { attemptId: started.body.id, submit: submit.body };
}
async function testQuestionIds(testId) {
  return (await db.prepare('SELECT question_id as qid FROM test_questions WHERE test_id = ?').all(testId)).map((r) => Number(r.qid));
}
// Every key the submit response carries must come back identically from
// GET /result (result adds extra keys on top; it never changes these).
function assertResultMatchesSubmit(submitBody, resultBody) {
  for (const key of Object.keys(submitBody)) {
    assert.deepEqual(resultBody[key], submitBody[key], `GET /result field "${key}" must equal the submit response's`);
  }
}

let serverProcess;
before(async () => {
  serverProcess = spawn('node', ['server.js'], {
    cwd: BACKEND_ROOT,
    env: { ...process.env, PORT: String(PORT), AUTH_SECRET, ...dbCtx.childEnv },
    stdio: 'pipe',
  });
  serverProcess.stderr.on('data', (d) => process.stderr.write(`[redesign-api-server] ${d}`));
  await waitForServer();
});
after(() => {
  if (serverProcess) serverProcess.kill();
  dbCtx.cleanup();
});

describe('redesign-api: submit perQuestion fields and GET /api/attempts/:id/result', () => {
  let student, other;
  let practiceSubjectId, practiceChapterId, mcqId, caseId, openId;
  let simSubjectId;

  before(async () => {
    student = await registerStudent('main');
    other = await registerStudent('other');

    practiceSubjectId = await insertSubject('Redesign Practice Subject');
    practiceChapterId = await insertChapter(practiceSubjectId, 'Redesign Mixed Chapter');
    mcqId = await insertMcq(practiceChapterId, 'Redesign MCQ', 'mixed', 'assertion_reasoning', 1);
    const c = await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, parts_json, sub_concept, question_type)
      VALUES (?, 'case', 'verified', 'source_provided', 5, 'Medium', 'Redesign case stem', ?, 'mixed', 'case_study') RETURNING id`)
      .run(practiceChapterId, JSON.stringify([
        { text: 'Part a', options: ['A', 'B'], correct: 0, marks: 2 },
        { text: 'Part b', options: ['A', 'B'], correct: 1, marks: 3 },
      ]));
    caseId = Number(c.lastInsertRowid);
    const o = await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, explanation, sub_concept, question_type)
      VALUES (?, 'open', 'verified', 'source_provided', 4, 'Hard', 'Redesign open question', 'Reference answer', 'mixed', NULL) RETURNING id`).run(practiceChapterId);
    openId = Number(o.lastInsertRowid);

    simSubjectId = await insertSubject('Redesign Simulation Subject');
    const simChapter = await insertChapter(simSubjectId, 'Redesign Sim Chapter');
    for (let i = 0; i < 4; i++) await insertMcq(simChapter, `Redesign Sim Q${i}`, 'sim', 'mcq', 1);
  });

  let practiceAttemptId, practiceSubmit;

  it('submit perQuestion entries carry marks (number), kind (mcq|case|open) and questionType (string|null), with existing fields unchanged; /check-locked answers win over the final submission', async () => {
    const gen = await api('POST', '/api/practice/generate', { token: student.token, body: { subjectId: practiceSubjectId, chapterId: practiceChapterId, count: 10 } });
    assert.equal(gen.status, 201, JSON.stringify(gen.body));
    assert.equal(gen.body.questionCount, 3);
    const started = await api('POST', '/api/attempts', { token: student.token, body: { test_id: gen.body.id } });
    practiceAttemptId = started.body.id;

    // Lock the MCQ as CORRECT via /check, then try to submit a WRONG answer for it.
    const check = await api('POST', `/api/attempts/${practiceAttemptId}/check`, { token: student.token, body: { key: `${mcqId}:`, answer: { optionIndex: 0 } } });
    assert.equal(check.status, 200);
    assert.equal(check.body.correct, true);

    const answers = {
      [`${mcqId}:`]: { optionIndex: 3 }, // ignored — locked answer (0, correct) wins
      [`${caseId}:a`]: { optionIndex: 0 }, // correct, 2 marks
      [`${caseId}:b`]: { optionIndex: 0 }, // wrong, 3 marks
      [`${openId}:`]: { text: 'my written answer' },
    };
    const submit = await api('POST', `/api/attempts/${practiceAttemptId}/submit`, { token: student.token, body: { answers } });
    assert.equal(submit.status, 200, JSON.stringify(submit.body));
    practiceSubmit = submit.body;

    assert.equal(practiceSubmit.score, 3, 'locked MCQ (1) + case part a (2)');
    assert.equal(practiceSubmit.maxScore, 6, 'MCQ 1 + case parts 2+3; open excluded');
    assert.equal(practiceSubmit.ungradedCount, 1);
    assert.equal(practiceSubmit.perQuestion.length, 4);
    const byKey = new Map(practiceSubmit.perQuestion.map((p) => [`${p.questionId}:${p.label}`, p]));

    const mcq = byKey.get(`${mcqId}:`);
    assert.equal(mcq.correct, true);
    assert.equal(mcq.submittedOptionIndex, 0);
    assert.equal(mcq.marks, 1); assert.equal(mcq.kind, 'mcq'); assert.equal(mcq.questionType, 'assertion_reasoning');

    const partA = byKey.get(`${caseId}:a`);
    const partB = byKey.get(`${caseId}:b`);
    assert.equal(partA.marks, 2); assert.equal(partA.kind, 'case'); assert.equal(partA.questionType, 'case_study'); assert.equal(partA.correct, true);
    assert.equal(partB.marks, 3); assert.equal(partB.kind, 'case'); assert.equal(partB.correct, false); assert.equal(partB.correctOptionIndex, 1);

    const open = byKey.get(`${openId}:`);
    assert.equal(open.marks, 4); assert.equal(open.kind, 'open'); assert.equal(open.questionType, null);
    assert.equal(open.ungraded, true); assert.equal(open.submittedText, 'my written answer');

    for (const p of practiceSubmit.perQuestion) {
      assert.equal(typeof p.marks, 'number');
      // Every pre-existing perQuestion key is still present, in its original order, before the new ones.
      assert.deepEqual(Object.keys(p), ['questionId', 'label', 'text', 'options', 'correct', 'ungraded', 'answered', 'submittedOptionIndex', 'submittedText', 'correctOptionIndex', 'explanation', 'difficulty', 'subConcept', 'chapterId', 'chapterName', 'marks', 'kind', 'questionType']);
    }
    assert.ok(practiceSubmit.practiceProgress, 'chapter practice still returns practiceProgress');
    assert.equal(practiceSubmit.improvementComparison, undefined);
  });

  it('GET /result for a practice attempt with /check-locked answers equals the submit response (score, maxScore, perQuestion correctness, practiceProgress) and adds timing + test metadata', async () => {
    const result = await api('GET', `/api/attempts/${practiceAttemptId}/result`, { token: student.token });
    assert.equal(result.status, 200, JSON.stringify(result.body));
    assertResultMatchesSubmit(practiceSubmit, result.body);

    const stored = await db.prepare('SELECT * FROM attempts WHERE id = ?').get(practiceAttemptId);
    assert.equal(result.body.score, Number(stored.score));
    assert.equal(result.body.maxScore, Number(stored.max_score));
    assert.ok(result.body.submittedAt);
    assert.ok(result.body.startedAt);
    assert.equal(result.body.durationSeconds, 300);
    assert.equal(typeof result.body.timeTakenSeconds, 'number');
    assert.ok(Number.isInteger(result.body.timeTakenSeconds) && result.body.timeTakenSeconds >= 0);
    assert.deepEqual(result.body.test, {
      id: (await db.prepare('SELECT test_id FROM attempts WHERE id = ?').get(practiceAttemptId)).test_id,
      kind: 'practice', feedbackMode: 'immediate',
      subjectId: practiceSubjectId, subjectName: 'Redesign Practice Subject', board: 'CBSE',
      chapterId: practiceChapterId, chapterName: 'Redesign Mixed Chapter',
      subConcept: null, improvesAttemptId: null,
    });
  });

  it('GET /result for a Board Simulation (deferred, full test) attempt equals the submit response', async () => {
    const gen = await api('POST', '/api/tests/generate', { token: student.token, body: { subjectId: simSubjectId, count: 4 } });
    assert.equal(gen.status, 201, JSON.stringify(gen.body));
    assert.equal(gen.body.feedbackMode, 'deferred');
    let n = 0;
    const { attemptId, submit } = await startAndSubmit(student.token, gen.body.id, () => (n++ % 2 === 0 ? 0 : 1));
    assert.equal(submit.score, 2);
    assert.equal(submit.maxScore, 4);
    assert.equal(submit.practiceProgress, undefined);

    const result = await api('GET', `/api/attempts/${attemptId}/result`, { token: student.token });
    assert.equal(result.status, 200, JSON.stringify(result.body));
    assertResultMatchesSubmit(submit, result.body);
    assert.equal(result.body.practiceProgress, undefined);
    assert.equal(result.body.test.kind, 'full');
    assert.equal(result.body.test.feedbackMode, 'deferred');
    assert.equal(result.body.test.chapterId, null);
    assert.equal(result.body.test.chapterName, null);
    assert.equal(result.body.test.subjectName, 'Redesign Simulation Subject');
  });

  it('GET /result returns 409 {error} before the attempt is submitted, 404 for another student, 404 for a nonexistent attempt, 401 without a token', async () => {
    const gen = await api('POST', '/api/tests/generate', { token: student.token, body: { subjectId: simSubjectId, count: 2 } });
    const started = await api('POST', '/api/attempts', { token: student.token, body: { test_id: gen.body.id } });
    const early = await api('GET', `/api/attempts/${started.body.id}/result`, { token: student.token });
    assert.equal(early.status, 409);
    assert.equal(typeof early.body.error, 'string');

    const cross = await api('GET', `/api/attempts/${practiceAttemptId}/result`, { token: other.token });
    assert.equal(cross.status, 404);
    assert.equal(typeof cross.body.error, 'string');
    assert.equal(cross.body.perQuestion, undefined, 'must never leak another student\'s results');

    const missing = await api('GET', '/api/attempts/99999999/result', { token: student.token });
    assert.equal(missing.status, 404);

    const anon = await api('GET', `/api/attempts/${practiceAttemptId}/result`);
    assert.equal(anon.status, 401);
  });

  it('GET /result reports answerKeyRevision (null normally; current re-graded score when an answer key was corrected after submission) and keeps the stored score', async () => {
    const s = await registerStudent('answer-key-revision');
    const subjectId = await insertSubject(`Answer key revision ${stamp}`);
    const chapterId = await insertChapter(subjectId, 'Revision chapter');
    const q1 = await insertMcq(chapterId, 'Revision Q1');
    const q2 = await insertMcq(chapterId, 'Revision Q2');
    const testId = await insertTest(s.id, subjectId, [q1, q2], { chapterId });
    // Answer 0 (correct) on both -> stored score 2/2.
    const { attemptId, submit } = await startAndSubmit(s.token, testId, () => 0);
    assert.equal(submit.score, 2);

    const before = await api('GET', `/api/attempts/${attemptId}/result`, { token: s.token });
    assert.equal(before.status, 200);
    assert.equal(before.body.answerKeyRevision, null);

    // Correct Q2's answer key after submission, the way the apply-*-fix scripts do.
    await db.prepare('UPDATE questions SET correct = ? WHERE id = ?').run(1, q2);
    const after = await api('GET', `/api/attempts/${attemptId}/result`, { token: s.token });
    assert.equal(after.status, 200);
    assert.equal(after.body.score, 2, 'the recorded score is unchanged');
    assert.equal(after.body.maxScore, 2);
    assert.deepEqual(after.body.answerKeyRevision, { currentScore: 1, currentMaxScore: 2 });
    assert.equal(after.body.perQuestion.filter((p) => p.correct).length, 1, 'per-question marking uses the corrected key');
  });
});

describe('redesign-api: Improve My Score freshness, improvementComparison.freshness, /attempts/me improvesAttemptId', () => {
  it('improve prefers never-seen questions, fills with previously-seen only when short, never uses the source attempt\'s questions, and reports truthful freshness; improvementComparison.freshness matches on submit and result; /attempts/me exposes improvesAttemptId', async () => {
    const s = await registerStudent('fresh');
    const subjectId = await insertSubject('Redesign Fresh Subject');
    const chapterId = await insertChapter(subjectId, 'Redesign Fresh Chapter');
    const W = [];
    for (let i = 1; i <= 8; i++) W.push(await insertMcq(chapterId, `Fresh W${i}`, 'weak'));
    const O = [await insertMcq(chapterId, 'Fresh O1', 'other'), await insertMcq(chapterId, 'Fresh O2', 'other')];

    // Source attempt: W1, W2, both answered wrong -> weak sub-concept 'weak'.
    const sourceTest = await insertTest(s.id, subjectId, [W[0], W[1]], { chapterId });
    const { attemptId: sourceAttemptId } = await startAndSubmit(s.token, sourceTest, () => 1);
    // Prior attempt on a different test: W3, W4 — now "previously seen".
    const priorTest = await insertTest(s.id, subjectId, [W[2], W[3]], { chapterId });
    await startAndSubmit(s.token, priorTest, () => 0);

    // count 4: W5..W8 are the only fresh weak-sub-concept questions -> exactly those, no widening.
    const imp4 = await api('POST', '/api/tests/improve', { token: s.token, body: { sourceAttemptId, count: 4 } });
    assert.equal(imp4.status, 201, JSON.stringify(imp4.body));
    assert.deepEqual(imp4.body.freshness, { requestedCount: 4, deliveredCount: 4, freshCount: 4, reusedCount: 0, widenedToChapter: false });
    assert.deepEqual((await testQuestionIds(imp4.body.id)).sort((a, b) => a - b), [W[4], W[5], W[6], W[7]].sort((a, b) => a - b));

    // count 6: 4 fresh + filled with the 2 previously-seen (W3, W4); never W1/W2 (source) or O (not widened).
    const imp6 = await api('POST', '/api/tests/improve', { token: s.token, body: { sourceAttemptId, count: 6 } });
    assert.equal(imp6.status, 201, JSON.stringify(imp6.body));
    assert.deepEqual(imp6.body.freshness, { requestedCount: 6, deliveredCount: 6, freshCount: 4, reusedCount: 2, widenedToChapter: false });
    const imp6Ids = await testQuestionIds(imp6.body.id);
    assert.deepEqual([...imp6Ids].sort((a, b) => a - b), [W[2], W[3], W[4], W[5], W[6], W[7]].sort((a, b) => a - b));
    for (const id of [W[0], W[1], ...O]) assert.ok(!imp6Ids.includes(id));

    // Take the count-6 improvement test: improvementComparison.freshness must say 4 fresh / 2 reused.
    const { attemptId: improveAttemptId, submit } = await startAndSubmit(s.token, imp6.body.id, () => 0);
    assert.ok(submit.improvementComparison, JSON.stringify(submit));
    assert.equal(submit.improvementComparison.sourceAttemptId, sourceAttemptId);
    assert.deepEqual(submit.improvementComparison.freshness, { totalQuestions: 6, freshCount: 4, reusedCount: 2 });

    const result = await api('GET', `/api/attempts/${improveAttemptId}/result`, { token: s.token });
    assert.equal(result.status, 200, JSON.stringify(result.body));
    assertResultMatchesSubmit(submit, result.body);
    assert.deepEqual(result.body.improvementComparison.freshness, { totalQuestions: 6, freshCount: 4, reusedCount: 2 });
    assert.equal(result.body.test.improvesAttemptId, sourceAttemptId);
    assert.equal(result.body.test.feedbackMode, 'deferred');

    const me = await api('GET', '/api/attempts/me', { token: s.token });
    assert.equal(me.status, 200);
    const improveRow = me.body.attempts.find((a) => a.id === improveAttemptId);
    const sourceRow = me.body.attempts.find((a) => a.id === sourceAttemptId);
    assert.equal(improveRow.improvesAttemptId, sourceAttemptId);
    assert.equal(sourceRow.improvesAttemptId, null);
    for (const row of me.body.attempts) assert.ok('improvesAttemptId' in row);
  });

  it('when the weak sub-concept has no fresh questions, improve widens to the chapter and takes fresh chapter questions before reused sub-concept ones (widenedToChapter: true)', async () => {
    const s = await registerStudent('widen');
    const subjectId = await insertSubject('Redesign Widen Subject');
    const chapterId = await insertChapter(subjectId, 'Redesign Widen Chapter');
    const X = [await insertMcq(chapterId, 'Widen X1', 'weak4'), await insertMcq(chapterId, 'Widen X2', 'weak4'), await insertMcq(chapterId, 'Widen X3', 'weak4')];
    const Y = [await insertMcq(chapterId, 'Widen Y1', 'other4'), await insertMcq(chapterId, 'Widen Y2', 'other4')];

    const sourceTest = await insertTest(s.id, subjectId, [X[0]], { chapterId });
    const { attemptId: sourceAttemptId } = await startAndSubmit(s.token, sourceTest, () => 1);
    const priorTest = await insertTest(s.id, subjectId, [X[1], X[2]], { chapterId });
    await startAndSubmit(s.token, priorTest, () => 0);

    const imp = await api('POST', '/api/tests/improve', { token: s.token, body: { sourceAttemptId, count: 3 } });
    assert.equal(imp.status, 201, JSON.stringify(imp.body));
    assert.deepEqual(imp.body.freshness, { requestedCount: 3, deliveredCount: 3, freshCount: 2, reusedCount: 1, widenedToChapter: true });
    const ids = await testQuestionIds(imp.body.id);
    assert.ok(ids.includes(Y[0]) && ids.includes(Y[1]), 'both fresh chapter questions must be chosen first');
    assert.ok(!ids.includes(X[0]), 'never the source attempt\'s own question');
    assert.equal(ids.filter((id) => id === X[1] || id === X[2]).length, 1, 'exactly one reused question fills the shortfall');

    // The comparison's freshness is computed at read time from the attempts table.
    const { submit } = await startAndSubmit(s.token, imp.body.id, () => 0);
    assert.deepEqual(submit.improvementComparison.freshness, { totalQuestions: 3, freshCount: 2, reusedCount: 1 });
  });

  it('improve still returns 422 when nothing at all is eligible (only the source attempt\'s own questions exist)', async () => {
    const s = await registerStudent('empty');
    const subjectId = await insertSubject('Redesign Empty Subject');
    const chapterId = await insertChapter(subjectId, 'Redesign Empty Chapter');
    const z = await insertMcq(chapterId, 'Empty Z1', 'only');
    const sourceTest = await insertTest(s.id, subjectId, [z], { chapterId });
    const { attemptId: sourceAttemptId } = await startAndSubmit(s.token, sourceTest, () => 1);
    const imp = await api('POST', '/api/tests/improve', { token: s.token, body: { sourceAttemptId, count: 5 } });
    assert.equal(imp.status, 422);
    assert.equal(typeof imp.body.error, 'string');
  });

  it('GET /api/chapters adds gradableCount (only servable statuses), leaving existing chapter fields unchanged', async () => {
    const s = await registerStudent('chapters');
    const subjectId = await insertSubject('Redesign Count Subject');
    const full = await insertChapter(subjectId, 'Redesign Count Full');
    const empty = await insertChapter(subjectId, 'Redesign Count Empty');
    await insertMcq(full, 'Count Q1');
    await insertMcq(full, 'Count Q2');
    await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct)
      VALUES (?, 'mcq', 'transcribed', 'source_provided', 1, 'Easy', 'Count not servable', '["A","B"]', 0)`).run(full);
    const r = await api('GET', `/api/chapters?subject_id=${subjectId}`, { token: s.token });
    assert.equal(r.status, 200);
    const byId = new Map(r.body.chapters.map((c) => [c.id, c]));
    assert.equal(byId.get(full).gradableCount, 2);
    assert.equal(byId.get(empty).gradableCount, 0);
    for (const c of r.body.chapters) {
      assert.equal(c.subject_id, subjectId);
      assert.equal(typeof c.name, 'string');
      assert.ok('order_index' in c);
    }
  });
});
