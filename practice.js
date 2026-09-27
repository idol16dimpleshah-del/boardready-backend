// Personalized practice-set assembly — builds a scored test scoped to one
// chapter (optionally narrowed to one sub-concept), from GRADABLE content
// only (content-rules.js), and records that scope on the test row so
// retest.js/diagnostics.js can later recognize "this was a retest of the
// same topic" versus an unrelated practice set.
//
// REBUILT from scratch (see REBUILD_NOTES.md). One deliberate simplification
// versus the original design documented earlier in this conversation: the
// original apparently biased selection toward a student's known
// misconceptions and mixed difficulty bands deliberately. This rebuild
// selects uniformly at random from the eligible pool instead — a real,
// working, honestly-simpler version, not a fabricated "smart" selection
// that isn't actually implemented. That's flagged explicitly in
// REBUILD_NOTES.md as a gap to close before this replaces the original.

const db = require('./db');
const { GRADABLE_STATUSES, resolveChapterIds } = require('./content-rules');
const scoring = require('./scoring');

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// feedbackMode (2026-09-22, Phase 5: Practice vs Board Simulation):
//   'immediate' — Practice/Learning Test, Google-quiz-style ✓/✕ per question.
//   'deferred'  — Board Simulation/Assessment, no per-question feedback at
//                 all; real results only appear after final submit.
// Defaults to 'immediate' for a bare chapter-practice call (kind='practice')
// and 'deferred' for a full-subject call (kind='full') — callers (server.js)
// pass it explicitly rather than relying on this default, but the default
// keeps this function safe to call the old way.
// Phase 6A: async + awaited throughout (see content-rules.js's
// resolveChapterIds comment for why this is safe under both engines). The
// two INSERT INTO tests statements below now say `... RETURNING id`
// explicitly (rather than relying on node:sqlite's own lastInsertRowid,
// which the Postgres engine has no equivalent for) — db.js's wrapper on
// both engines reads the returned row's id back into `lastInsertRowid` so
// this function's own logic is otherwise unchanged.
async function generate({ studentId, subjectId, chapterId, subConcept, count = 10, kind = 'practice', feedbackMode }) {
  const resolvedFeedbackMode = feedbackMode || (kind === 'full' ? 'deferred' : 'immediate');
  const chapterIds = chapterId ? [chapterId] : await resolveChapterIds(subjectId, null);
  const placeholders = chapterIds.map(() => '?').join(',');
  const gradablePlaceholders = GRADABLE_STATUSES.map(() => '?').join(',');
  let sql = `SELECT id FROM questions WHERE chapter_id IN (${placeholders}) AND status IN (${gradablePlaceholders})`;
  const args = [...chapterIds, ...GRADABLE_STATUSES];
  if (subConcept) { sql += ' AND sub_concept = ?'; args.push(subConcept); }
  let pool = (await db.prepare(sql).all(...args)).map((r) => r.id);
  if (subConcept && pool.length < Math.min(3, count)) {
    // Not enough gradable content narrowly scoped to this sub-concept —
    // fall back to the whole chapter rather than returning an unusably tiny set.
    pool = (await db.prepare(`SELECT id FROM questions WHERE chapter_id IN (${placeholders}) AND status IN (${gradablePlaceholders})`).all(...chapterIds, ...GRADABLE_STATUSES)).map((r) => r.id);
  }
  if (!pool.length) {
    const err = new Error('No gradable questions available for this selection.');
    err.status = 422;
    throw err;
  }
  const chosen = shuffle(pool).slice(0, Math.min(count, pool.length));

  const insertTest = db.prepare(`INSERT INTO tests (student_id, subject_id, kind, practice_chapter_id, practice_sub_concept, duration_seconds, feedback_mode) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id`);
  const durationSeconds = Math.max(300, chosen.length * 90);
  const info = await insertTest.run(studentId, subjectId, kind, chapterId || null, subConcept || null, durationSeconds, resolvedFeedbackMode);
  const testId = Number(info.lastInsertRowid);
  const insertTQ = db.prepare('INSERT INTO test_questions (test_id, question_id, order_index) VALUES (?, ?, ?)');
  for (const [i, qid] of chosen.entries()) {
    await insertTQ.run(testId, qid, i);
  }

  return { id: testId, subjectId, chapterId: chapterId || null, subConcept: subConcept || null, questionCount: chosen.length, durationSeconds, feedbackMode: resolvedFeedbackMode };
}

// "Improve My Score" (2026-09-22, Phase 4) — a real, separate test targeting
// the actual sub-concepts/chapters the student got wrong in one specific
// finished attempt, built from their real recorded answers, never a
// hardcoded or repeated set. Explicitly NOT a "try a similar question after
// every wrong answer" drill (that's the immediate-feedback feature in
// server.js's /check endpoint, which never injects extra questions into the
// running test) — this only ever runs after a full attempt is submitted, as
// its own new, separate test/attempt, exactly like a real retest, with real
// question exclusion so it isn't just the same test again.
async function generateImprovementTest({ studentId, sourceAttemptId, count = 12 }) {
  const attempt = await db.prepare('SELECT * FROM attempts WHERE id = ? AND student_id = ?').get(sourceAttemptId, studentId);
  if (!attempt) { const err = new Error('Source attempt not found.'); err.status = 404; throw err; }
  if (!attempt.submitted_at) { const err = new Error('Source attempt is not finished yet.'); err.status = 422; throw err; }
  const test = await db.prepare('SELECT * FROM tests WHERE id = ?').get(attempt.test_id);

  const questions = await db.prepare(`
    SELECT q.*, c.name as chapter_name FROM test_questions tq
    JOIN questions q ON q.id = tq.question_id
    JOIN chapters c ON c.id = q.chapter_id
    WHERE tq.test_id = ? ORDER BY tq.order_index`).all(attempt.test_id);
  const steps = scoring.flattenAll(questions);
  const answers = attempt.answers_json ? JSON.parse(attempt.answers_json) : {};
  const { gradedSteps } = scoring.gradeSubmission(steps, answers, {});

  const seenQuestionIds = new Set(questions.map((q) => q.id));
  // Real wrong sub-concepts from the real recorded answers — never a
  // fabricated "weak area." Open/ungraded steps can't be "wrong" (no
  // correct/incorrect verdict exists for them), so they never drive this.
  const weakSubConcepts = new Set();
  const weakChapterIds = new Set();
  for (const s of gradedSteps) {
    if (s.ungraded) continue;
    if (!s.correct) {
      if (s.subConcept) weakSubConcepts.add(s.subConcept);
      if (s.chapterId) weakChapterIds.add(s.chapterId);
    }
  }
  if (!weakChapterIds.size) {
    const err = new Error('No incorrect answers to target — nothing to improve on from this attempt.');
    err.status = 422;
    throw err;
  }

  const gradablePlaceholders = GRADABLE_STATUSES.map(() => '?').join(',');
  const chapterPlaceholders = [...weakChapterIds].map(() => '?').join(',');

  // Pass 1: gradable questions in the exact weak sub-concepts, in the weak
  // chapters, excluding every question already seen in the source attempt.
  let pool = [];
  if (weakSubConcepts.size) {
    const subPlaceholders = [...weakSubConcepts].map(() => '?').join(',');
    const rows = await db.prepare(`SELECT id FROM questions WHERE chapter_id IN (${chapterPlaceholders}) AND status IN (${gradablePlaceholders}) AND sub_concept IN (${subPlaceholders})`)
      .all(...weakChapterIds, ...GRADABLE_STATUSES, ...weakSubConcepts);
    pool = rows.map((r) => r.id).filter((id) => !seenQuestionIds.has(id));
  }
  // Pass 2: not enough narrowly-scoped content — widen to the whole weak
  // chapter(s), still excluding already-seen questions. Mirrors generate()'s
  // own fallback pattern above.
  if (pool.length < Math.min(4, count)) {
    const widenedRows = await db.prepare(`SELECT id FROM questions WHERE chapter_id IN (${chapterPlaceholders}) AND status IN (${gradablePlaceholders})`)
      .all(...weakChapterIds, ...GRADABLE_STATUSES);
    const widened = widenedRows.map((r) => r.id).filter((id) => !seenQuestionIds.has(id));
    pool = [...new Set([...pool, ...widened])];
  }
  if (!pool.length) {
    const err = new Error('No new gradable questions are available yet for the areas you missed — the pool of unseen content on this topic is exhausted.');
    err.status = 422;
    throw err;
  }

  const chosen = shuffle(pool).slice(0, Math.min(count, pool.length));
  const durationSeconds = Math.max(300, chosen.length * 90);
  // feedback_mode = 'deferred' (2026-09-22, Phase 5) — deliberately NOT
  // 'immediate', even though this test's DB `kind` is 'practice'. The whole
  // point of Improve My Score is to MEASURE whether the student can now get
  // these right independently (see retest.computeImprovementComparison) —
  // the same "a student could get immediate confirmation on every question
  // and the resulting score wouldn't represent their independent
  // performance" concern applies just as much to this retest as it does to
  // the original assessment. Feedback (what was wrong, why, the real
  // before/after numbers) still appears in full on this test's own results
  // screen once it's submitted — nothing here is ever hidden permanently.
  const info = await db.prepare(`INSERT INTO tests (student_id, subject_id, kind, practice_chapter_id, practice_sub_concept, duration_seconds, improves_attempt_id, feedback_mode) VALUES (?, ?, 'practice', NULL, NULL, ?, ?, 'deferred') RETURNING id`)
    .run(studentId, test.subject_id, durationSeconds, sourceAttemptId);
  const testId = Number(info.lastInsertRowid);
  const insertTQ = db.prepare('INSERT INTO test_questions (test_id, question_id, order_index) VALUES (?, ?, ?)');
  for (const [i, qid] of chosen.entries()) {
    await insertTQ.run(testId, qid, i);
  }

  return { id: testId, subjectId: test.subject_id, chapterId: null, subConcept: null, questionCount: chosen.length, durationSeconds, improvesAttemptId: sourceAttemptId, targetedSubConcepts: [...weakSubConcepts], feedbackMode: 'deferred' };
}

module.exports = { generate, generateImprovementTest };
