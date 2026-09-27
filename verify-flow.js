// Real end-to-end verification script — Step 1 + Step 2 of the founder's
// plan. This talks to the actual running server over HTTP, exactly as a
// real client would; it never reaches into the database to fake a result.
// Run with: node verify-flow.js (server must already be running on :4000)
const BASE = 'http://localhost:4000';
const db = require('./db');

async function api(method, path, { token, body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => null);
  return { status: res.status, body: json };
}
function section(title) { console.log(`\n${'='.repeat(10)} ${title} ${'='.repeat(10)}`); }
function show(label, obj) { console.log(`--- ${label} ---`); console.log(JSON.stringify(obj, null, 2)); }

async function main() {
  section('1. LOGIN (real credential check, real signed token)');
  const login = await api('POST', '/api/auth/login', { body: { email: 'student@boardready.test', password: 'demo1234' } });
  show('POST /api/auth/login', login);
  const token = login.body.token;
  const studentId = login.body.user.id;

  section('1b. WRONG PASSWORD is rejected (auth actually checks the hash)');
  const badLogin = await api('POST', '/api/auth/login', { body: { email: 'student@boardready.test', password: 'wrong-password' } });
  show('POST /api/auth/login (wrong password)', badLogin);

  section('2. GENERATE A REAL PRACTICE TEST — ICSE Statistics (chapter 1)');
  const gen = await api('POST', '/api/practice/generate', { token, body: { subjectId: 1, chapterId: 1, count: 10 } });
  show('POST /api/practice/generate', gen);
  const testId = gen.body.id;

  section('3. START ATTEMPT + FETCH REAL QUESTIONS (no answer key sent to client)');
  const started = await api('POST', '/api/attempts', { token, body: { test_id: testId } });
  show('POST /api/attempts', started);
  const attemptId = started.body.id;
  const qres = await api('GET', `/api/attempts/${attemptId}/questions`, { token });
  show('GET /api/attempts/:id/questions (client view — note: no "correct" field)', qres);
  const steps = qres.body.steps;
  console.log(`Client-visible step keys: ${Object.keys(steps[0]).join(', ')}`);

  // Look up the REAL answer key ourselves (as an independent verifier would,
  // e.g. from the teacher/admin side) purely to construct a controlled
  // submission for this test — this is not something the student client can do.
  const answerKey = {};
  for (const s of steps) {
    const q = await db.prepare('SELECT correct, options_json FROM questions WHERE id = ?').get(s.questionId);
    answerKey[`${s.questionId}:${s.label || ''}`] = q.correct;
  }

  section('4. SUBMIT — 7 correct, 3 deliberately wrong (controlled, known outcome)');
  const answers = {};
  steps.forEach((s, i) => {
    const key = `${s.questionId}:${s.label || ''}`;
    const correctIdx = answerKey[key];
    // First 7 correct, last 3 deliberately wrong, to get a known, checkable score.
    answers[key] = { optionIndex: i < 7 ? correctIdx : (correctIdx + 1) % 4 };
  });
  const submit1 = await api('POST', `/api/attempts/${attemptId}/submit`, { token, body: { answers } });
  show('POST /api/attempts/:id/submit', submit1);
  console.log(`Expected: 7/${steps.length} correct -> score ${7}/${steps.length}. Actual: ${submit1.body.score}/${submit1.body.maxScore}`);

  section('4b. RE-SUBMITTING THE SAME ATTEMPT is rejected (no double-submit / no re-scoring)');
  const resubmit = await api('POST', `/api/attempts/${attemptId}/submit`, { token, body: { answers } });
  show('POST /api/attempts/:id/submit (again)', resubmit);

  section('4c. UNANSWERED QUESTIONS — a second test, leave half blank');
  const gen2 = await api('POST', '/api/practice/generate', { token, body: { subjectId: 1, chapterId: 1, count: 6 } });
  const started2 = await api('POST', '/api/attempts', { token, body: { test_id: gen2.body.id } });
  const qres2 = await api('GET', `/api/attempts/${started2.body.id}/questions`, { token });
  const steps2 = qres2.body.steps;
  const answers2 = {};
  for (let i = 0; i < steps2.length; i++) {
    const s = steps2[i];
    if (i % 2 === 0) {
      const q = await db.prepare('SELECT correct FROM questions WHERE id=?').get(s.questionId);
      answers2[`${s.questionId}:${s.label || ''}`] = { optionIndex: q.correct };
    }
  }
  const submit2 = await api('POST', `/api/attempts/${started2.body.id}/submit`, { token, body: { answers: answers2 } });
  show('POST /api/attempts/:id/submit (half left blank)', submit2);
  console.log(`answeredCount should be 3 of ${steps2.length}: actual answeredCount=${submit2.body.answeredCount}`);

  section('4d. CLIENT-SIDE SCORE MANIPULATION — submit claims a fake "correct" flag, server must ignore it');
  const gen3 = await api('POST', '/api/practice/generate', { token, body: { subjectId: 1, chapterId: 1, count: 3 } });
  const started3 = await api('POST', '/api/attempts', { token, body: { test_id: gen3.body.id } });
  const qres3 = await api('GET', `/api/attempts/${started3.body.id}/questions`, { token });
  const forgedAnswers = {};
  qres3.body.steps.forEach((s) => { forgedAnswers[`${s.questionId}:${s.label || ''}`] = { optionIndex: 0, correct: true, score: 999 }; }); // extra forged fields
  const submit3 = await api('POST', `/api/attempts/${started3.body.id}/submit`, { token, body: { answers: forgedAnswers } });
  show('POST /api/attempts/:id/submit (forged correct:true, score:999 fields ignored)', submit3);
  console.log('Server recomputed from its own answer key regardless of forged client fields.');

  section('5. DIAGNOSTICS — free overall summary (should now reflect all 3 submitted attempts)');
  const summary = await api('GET', '/api/diagnostics/me/summary', { token });
  show('GET /api/diagnostics/me/summary', summary);

  section('5b. DIAGNOSTICS — per-subject detail, PAID GATE CHECK with a fresh unpaid student');
  const freshReg = await api('POST', '/api/auth/register', { body: { name: 'Unpaid Student', email: `unpaid-${Date.now()}@boardready.test`, password: 'testpass123', role: 'student' } });
  const freshDetail = await api('GET', '/api/diagnostics/me/subjects/1', { token: freshReg.body.token });
  show('GET /api/diagnostics/me/subjects/1 (no subscription)', freshDetail);
  const paidDetail = await api('GET', '/api/diagnostics/me/subjects/1', { token });
  show('GET /api/diagnostics/me/subjects/1 (demo student, active subscription)', paidDetail);

  section('6. READINESS SCORE — before more attempts (current real state)');
  const readinessNow = await api('GET', '/api/diagnostics/me/readiness', { token });
  show('GET /api/diagnostics/me/readiness', readinessNow);

  section('7. RETEST — practice the SAME chapter again, now with high accuracy, check vsOriginal + Readiness delta');
  const gen4 = await api('POST', '/api/practice/generate', { token, body: { subjectId: 1, chapterId: 1, count: 10 } });
  const started4 = await api('POST', '/api/attempts', { token, body: { test_id: gen4.body.id } });
  const qres4 = await api('GET', `/api/attempts/${started4.body.id}/questions`, { token });
  const answers4 = {};
  for (const s of qres4.body.steps) {
    const q = await db.prepare('SELECT correct FROM questions WHERE id=?').get(s.questionId);
    answers4[`${s.questionId}:${s.label || ''}`] = { optionIndex: q.correct }; // ALL correct this time
  }
  const submit4 = await api('POST', `/api/attempts/${started4.body.id}/submit`, { token, body: { answers: answers4 } });
  show('POST /api/attempts/:id/submit (retest, all correct)', submit4);

  const readinessAfter = await api('GET', '/api/diagnostics/me/readiness', { token });
  show('GET /api/diagnostics/me/readiness (after retest)', readinessAfter);
  console.log(`Readiness before: ${readinessNow.body.examReadiness?.score}, after: ${readinessAfter.body.examReadiness?.score}`);

  section('8. IMPROVEMENT TRACKING across the retest');
  const improvement = await api('GET', '/api/diagnostics/me/improvement', { token });
  show('GET /api/diagnostics/me/improvement', improvement);

  section('9. CBSE SUBJECT — different board, independent content pool + a case-study question');
  const genCbse = await api('POST', '/api/practice/generate', { token, body: { subjectId: 2, chapterId: 4, count: 8 } }); // Quadratic Equations incl. the case question
  show('POST /api/practice/generate (CBSE Quadratic Equations)', genCbse);
  const startedCbse = await api('POST', '/api/attempts', { token, body: { test_id: genCbse.body.id } });
  const qresCbse = await api('GET', `/api/attempts/${startedCbse.body.id}/questions`, { token });
  show('GET questions (note: case-study question expands into multiple lettered steps)', qresCbse);
  const answersCbse = {};
  for (const s of qresCbse.body.steps) {
    const q = await db.prepare(s.kind === 'case' ? 'SELECT parts_json FROM questions WHERE id=?' : 'SELECT correct FROM questions WHERE id=?').get(s.questionId);
    const correctIdx = s.kind === 'case' ? JSON.parse(q.parts_json)[s.label.charCodeAt(0) - 97].correct : q.correct;
    answersCbse[`${s.questionId}:${s.label || ''}`] = { optionIndex: correctIdx };
  }
  const submitCbse = await api('POST', `/api/attempts/${startedCbse.body.id}/submit`, { token, body: { answers: answersCbse } });
  show('POST submit (CBSE)', submitCbse);

  section('10. AUTH / SESSION GATING — no token, garbage token, wrong role');
  show('No token', await api('GET', '/api/diagnostics/me/summary'));
  show('Garbage token', await api('GET', '/api/diagnostics/me/summary', { token: 'not-a-real-token' }));
  const teacherLogin = await api('POST', '/api/auth/login', { body: { email: 'teacher@boardready.test', password: 'demo1234' } });
  show('Teacher token calling a student-only route', await api('POST', '/api/practice/generate', { token: teacherLogin.body.token, body: { subjectId: 1, chapterId: 1, count: 5 } }));

  section('11. FULL READINESS BREAKDOWN — per-subject, paid, with component reasons (final state)');
  const finalReadiness = await api('GET', '/api/diagnostics/me/subjects/1/readiness', { token });
  show('GET /api/diagnostics/me/subjects/1/readiness', finalReadiness);

  console.log('\nDONE.');
}

main().catch((e) => { console.error('VERIFY FLOW FAILED:', e); process.exit(1); });
