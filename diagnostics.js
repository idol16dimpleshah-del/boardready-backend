// Core diagnostics engine — DATA -> RULES -> DIAGNOSIS, no AI. Every number
// here is derived deterministically from real attempt/question rows; the
// only thing this file does with an LLM is nothing at all.
//
// REBUILT from scratch (see REBUILD_NOTES.md) to match the documented
// interface the rest of the backend (retest.js, practice.js, readiness.js,
// server.js) already depends on: getStudentStepHistory() returning flat
// per-question "steps", summarizeGroup() turning any set of steps into an
// accuracy/recency/consistency summary, computeOverall()/
// computeSubjectDiagnostic() rolling those up per-student and per-subject.

const db = require('./db');
const CONFIG = require('./diagnostics-config');
const { flattenAll, keyFor } = require('./scoring');

// All SUBMITTED attempts for a student, optionally scoped to one subject
// (and, for chapter-level tools, one chapter). Correctness is recomputed
// from each step's own answer key against the stored raw submission — never
// read from attempts.score, which exists only as a display cache.
// Phase 6A (docs/phase-6-postgres-cutover-plan.md): async + awaited (see
// content-rules.js's resolveChapterIds comment for why this is safe under
// both engines). The SELECT's camelCase aliases (attemptId, testId,
// submittedAt, answersJson, subjectId, subjectName, chapterId, chapterName,
// subConcept) are now double-quoted — Postgres silently lowercase-folds an
// UNQUOTED mixed-case alias (so `q.chapter_id as chapterId` would come back
// as `chapterid`, breaking every `r.chapterId` read below), while SQLite
// has always preserved the alias exactly as written either way — so
// quoting is a no-op for SQLite and the actual fix for Postgres, with one
// shared SQL string for both engines.
async function getStudentStepHistory(studentId, { subjectId, chapterId } = {}) {
  let sql = `
    SELECT a.id as "attemptId", a.test_id as "testId", a.submitted_at as "submittedAt", a.answers_json as "answersJson",
           t.subject_id as "subjectId", s.name as "subjectName",
           q.id as qid, q.chapter_id as "chapterId", c.name as "chapterName", q.sub_concept as "subConcept",
           q.kind, q.difficulty, q.marks, q.options_json, q.correct, q.parts_json
    FROM attempts a
    JOIN tests t ON t.id = a.test_id
    JOIN subjects s ON s.id = t.subject_id
    JOIN test_questions tq ON tq.test_id = t.id
    JOIN questions q ON q.id = tq.question_id
    JOIN chapters c ON c.id = q.chapter_id
    WHERE a.student_id = ? AND a.submitted_at IS NOT NULL`;
  const args = [studentId];
  if (subjectId) { sql += ' AND t.subject_id = ?'; args.push(subjectId); }
  if (chapterId) { sql += ' AND q.chapter_id = ?'; args.push(chapterId); }
  sql += ' ORDER BY a.submitted_at ASC, a.id ASC, tq.order_index ASC';
  const rows = await db.prepare(sql).all(...args);

  // Group DB rows back into per-attempt question lists so flattenAll() can
  // expand case-study parts correctly, then re-flatten with the attempt's
  // real submission to compute correctness per step.
  const byAttempt = new Map();
  for (const r of rows) {
    if (!byAttempt.has(r.attemptId)) byAttempt.set(r.attemptId, { meta: r, questions: [] });
    byAttempt.get(r.attemptId).questions.push({
      id: r.qid, chapter_id: r.chapterId, chapter_name: r.chapterName, sub_concept: r.subConcept,
      kind: r.kind, difficulty: r.difficulty, marks: r.marks, options_json: r.options_json,
      correct: r.correct, parts_json: r.parts_json,
    });
  }

  const steps = [];
  for (const { meta, questions } of byAttempt.values()) {
    const answers = meta.answersJson ? JSON.parse(meta.answersJson) : {};
    const flat = flattenAll(questions);
    for (const step of flat) {
      // Open/descriptive steps (2026-09-22, Phase 3) are never auto-graded —
      // see scoring.js's gradeSubmission(). Excluding them here too, not
      // just there, matters because THIS function is the one that feeds
      // mastery/accuracy/readiness (computeOverall, retest.js's
      // vsOriginal, readiness.js): without this guard, an open-kind step
      // would silently count as "answered: false, correct: false" the
      // moment one is ever promoted to gradable, quietly dragging down a
      // student's real accuracy/readiness numbers for a question type nothing
      // in this codebase actually scores. Not live today (no open-kind
      // question is currently gradable-status) but a real latent bug closed
      // proactively while this exact area was being worked on.
      if (step.kind === 'open') continue;
      const submitted = answers[keyFor(step)];
      const answered = submitted != null && submitted.optionIndex != null;
      const correct = answered && Number(submitted.optionIndex) === Number(step.correct);
      steps.push({
        attemptId: meta.attemptId, testId: meta.testId, submittedAt: meta.submittedAt,
        subjectId: meta.subjectId, subjectName: meta.subjectName,
        chapterId: step.chapterId, chapterName: step.chapterName, subConcept: step.subConcept,
        questionId: step.questionId, kind: step.kind, difficulty: step.difficulty, marks: step.marks,
        correct, answered,
        key: keyFor(step),
      });
    }
  }
  return steps;
}

function stdev(nums) {
  if (nums.length < 2) return null;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length;
  return Math.sqrt(variance);
}

// Turns any set of steps (whole history, one subject, one chapter, one
// sub-concept) into the standard summary shape every other module builds on.
function summarizeGroup(steps) {
  const attempted = steps.length;
  if (attempted === 0) {
    return { attempted: 0, correctCount: 0, accuracyPct: null, recentAccuracyPct: null, consistencyPct: null, evidence: { recentCount: 0, distinctAttempts: 0 } };
  }
  const correctCount = steps.filter((s) => s.correct).length;
  const accuracyPct = Math.round((100 * correctCount) / attempted);

  const recentN = Math.min(CONFIG.RECENT_WINDOW_COUNT, attempted);
  const recentSteps = steps.slice(-recentN); // steps are chronological ascending
  const recentAccuracyPct = Math.round((100 * recentSteps.filter((s) => s.correct).length) / recentN);

  const byAttempt = new Map();
  for (const s of steps) {
    if (!byAttempt.has(s.attemptId)) byAttempt.set(s.attemptId, []);
    byAttempt.get(s.attemptId).push(s);
  }
  const distinctAttempts = byAttempt.size;
  let consistencyPct = null;
  if (distinctAttempts >= 2) {
    const perAttemptAcc = [...byAttempt.values()].map((arr) => (100 * arr.filter((s) => s.correct).length) / arr.length);
    const sd = stdev(perAttemptAcc);
    consistencyPct = Math.max(0, Math.min(100, Math.round(100 - sd)));
  }

  return { attempted, correctCount, accuracyPct, recentAccuracyPct, consistencyPct, evidence: { recentCount: recentN, distinctAttempts } };
}

function classifyStatus(summary) {
  if (summary.attempted < CONFIG.MIN_EVIDENCE) return 'insufficient_evidence';
  if (summary.accuracyPct >= CONFIG.STRONG_PCT) return 'strong';
  if (summary.accuracyPct >= CONFIG.DEVELOPING_PCT) return 'developing';
  return 'needs_work';
}

async function computeOverall(studentId) {
  const steps = await getStudentStepHistory(studentId);
  const summary = summarizeGroup(steps);
  const bySubjectMap = new Map();
  for (const s of steps) {
    if (!bySubjectMap.has(s.subjectId)) bySubjectMap.set(s.subjectId, { key: s.subjectId, name: s.subjectName, steps: [] });
    bySubjectMap.get(s.subjectId).steps.push(s);
  }
  const bySubject = [...bySubjectMap.values()].map((g) => ({ key: g.key, name: g.name, summary: summarizeGroup(g.steps), status: classifyStatus(summarizeGroup(g.steps)) }));
  return { summary, bySubject };
}

async function computeSubjectDiagnostic(studentId, subjectId) {
  const steps = await getStudentStepHistory(studentId, { subjectId });
  const overall = summarizeGroup(steps);
  const byChapterMap = new Map();
  for (const s of steps) {
    if (!byChapterMap.has(s.chapterId)) byChapterMap.set(s.chapterId, { chapterId: s.chapterId, chapterName: s.chapterName, steps: [] });
    byChapterMap.get(s.chapterId).steps.push(s);
  }
  const chapters = [...byChapterMap.values()].map((g) => {
    const summary = summarizeGroup(g.steps);
    return { chapterId: g.chapterId, chapterName: g.chapterName, summary, status: classifyStatus(summary) };
  }).sort((a, b) => (a.summary.accuracyPct ?? 100) - (b.summary.accuracyPct ?? 100)); // weakest first
  return { subjectId, overall, status: classifyStatus(overall), chapters };
}

module.exports = {
  getStudentStepHistory, summarizeGroup, classifyStatus, computeOverall, computeSubjectDiagnostic,
};
