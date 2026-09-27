// Turns raw question rows into scored "steps" (one per gradable unit — an
// MCQ is one step, a case-study question expands into one step per part)
// and grades a real submission against them.
//
// REBUILT from scratch (see REBUILD_NOTES.md) — the original scoring.js is
// gone; this is a fresh implementation matching the same documented
// interface (flattenAll() producing steps with questionId/kind/label/
// correct/marks/difficulty/chapterId/subConcept, keyed as
// `${questionId}:${label}`) that diagnostics.js, retest.js and practice.js
// all depend on. One simplification versus the original, stated plainly
// rather than silently: the original apparently supported randomized
// "variants" of a case-question part (multiple equivalent versions of the
// same sub-question, each with its own answer key, to blunt memorization) —
// a single fragment of an old test file referenced `step.variants[0]`. There
// wasn't enough surviving detail to reconstruct that mechanism faithfully,
// so this rebuild uses a single fixed version per part instead. That does
// not affect the correctness of scoring, diagnostics, or the Readiness
// engine for anything tested in this rebuild — it only means "give this
// exact case question to the same student twice and expect a different
// numeric variant" isn't a capability yet.
//
// THE CORE GUARANTEE this file exists to protect (explicitly requested):
// correctness and score are ALWAYS recomputed here, from the question's
// stored answer key in the database, at grading time. A client's raw
// submission (answers_json) is stored for audit only and never trusted as
// the source of truth for whether an answer was right.

function flattenAll(questionRows) {
  const steps = [];
  for (const q of questionRows) {
    const chapterId = q.chapter_id ?? q.chapterId;
    const chapterName = q.chapter_name ?? q.chapterName ?? null;
    const subConcept = q.sub_concept ?? q.subConcept ?? null;
    const difficulty = q.difficulty;
    // question_type (2026-09-22, Phase 3): a real, already-populated column
    // ('assertion_reasoning', 'case_study', 'mcq', 'true_false',
    // 'open_response', ...) that the frontend can use to pick a renderer,
    // distinct from `kind` (the scoring-shape column: mcq/case/open) which
    // drives THIS file's own branching below. Passed through as data, not
    // acted on here — this file only cares about how to grade a step.
    const questionType = q.question_type ?? null;
    // diagramUrl (Workstream 3B, 2026-09-25): passed straight through from
    // whatever server.js's loadQuestionsForTest already computed and
    // attached as `diagram_url` (server.js is where the actual
    // visual_assets lookup and safety filtering happens — see
    // getServableDiagramUrls there). This file only relays it, the same
    // way it relays chapterName/subConcept, so every step kind (case/open/
    // mcq) gets it via one shared code path instead of three separate ones.
    const diagramUrl = q.diagram_url ?? null;
    if (q.kind === 'case') {
      const parts = typeof q.parts_json === 'string' ? JSON.parse(q.parts_json) : (q.parts_json || []);
      parts.forEach((part, i) => {
        steps.push({
          questionId: q.id,
          kind: 'case',
          questionType,
          label: String.fromCharCode(97 + i), // 'a', 'b', 'c', ...
          text: part.text,
          options: part.options,
          correct: part.correct,
          marks: part.marks || 1,
          difficulty,
          chapterId, chapterName, subConcept,
          diagramUrl,
          // Case questions don't have a per-part explanation in the source
          // data today — only a question-level `explanation` column exists,
          // which for most case rows is null. Carried through anyway (rather
          // than hardcoded null) so a future per-part explanation column
          // needs no change here.
          explanation: q.explanation ?? null,
        });
      });
    } else if (q.kind === 'open') {
      // Real, honest handling (2026-09-22, Phase 3) of the 815 real
      // open/descriptive questions in the bank (question_format: descriptive
      // / short_answer / give_reasons / name_the_following / structural /
      // etc). None are auto-gradable — there's no mechanism in this codebase
      // to score free text, and inventing one wasn't asked for. Before this
      // change, a kind='open' question reaching this branch's `else` fell
      // through the MCQ path and produced a broken step (no real options,
      // `correct` almost always null) — not exercised by any LIVE question
      // today because none are currently gradable-status, but a latent bug
      // waiting for the first one to be promoted. Now it's a real, distinct,
      // ungraded step: no options, no correct/incorrect verdict, excluded
      // from maxScore/score entirely (see gradeSubmission below) — the
      // student writes their own answer and self-checks it against the
      // question's `explanation`/reference text when one exists.
      steps.push({
        questionId: q.id,
        kind: 'open',
        questionType,
        label: '',
        text: q.text,
        options: null,
        correct: null,
        marks: q.marks || 1,
        difficulty,
        chapterId, chapterName, subConcept,
        diagramUrl,
        explanation: q.explanation ?? null,
      });
    } else {
      const options = typeof q.options_json === 'string' ? JSON.parse(q.options_json) : q.options_json;
      steps.push({
        questionId: q.id,
        kind: 'mcq',
        questionType,
        label: '',
        text: q.text,
        options,
        correct: q.correct,
        marks: q.marks || 1,
        difficulty,
        chapterId, chapterName, subConcept,
        diagramUrl,
        explanation: q.explanation ?? null,
      });
    }
  }
  return steps;
}

function keyFor(step) {
  return `${step.questionId}:${step.label || ''}`;
}

// Grades exactly one non-open step against a single submitted answer —
// shared by gradeSubmission below and by server.js's real-time "check"
// endpoint (2026-09-22, Phase 4 — immediate answer feedback), so the two
// never compute correctness two different ways.
function gradeOneStep(step, submitted) {
  const answered = submitted != null && submitted.optionIndex != null;
  const correct = answered && Number(submitted.optionIndex) === Number(step.correct);
  return { answered, correct, submittedOptionIndex: answered ? Number(submitted.optionIndex) : null };
}

// answers: { [key]: { optionIndex } | { text } } — a raw client submission.
// lockedAnswers: { [key]: { optionIndex } } — answers already graded and
// shown to the student via POST /api/attempts/:id/check (immediate
// feedback). THE GUARANTEE this file exists to protect gets a new edge case
// here: once a step has been checked mid-test, that grading is final — a
// locked step's verdict comes from `lockedAnswers`, and whatever is in
// `answers` for that same key at final submit time is ignored. Without this,
// a student could pick a wrong answer, see the correct one revealed by the
// check endpoint, then silently switch their final submission to it before
// submitting, turning "immediate feedback" into a way to inflate the score.
// A step never checked (e.g. time ran out and the attempt auto-submitted)
// falls back to the original behavior unchanged — always recomputed from
// `answers`, exactly as before this feature existed.
// Returns { gradedSteps, score, maxScore, answeredCount, ungradedCount }
// where gradedSteps carries `answered` and `correct` computed ONLY from the
// DB-sourced `step.correct`, never from anything the client asserted about
// itself.
function gradeSubmission(steps, answers, lockedAnswers) {
  let score = 0, maxScore = 0, answeredCount = 0, ungradedCount = 0;
  const gradedSteps = steps.map((step) => {
    const locked = lockedAnswers && lockedAnswers[keyFor(step)];
    const submitted = step.kind !== 'open' && locked != null ? locked : (answers && answers[keyFor(step)]);

    // Open/descriptive steps (2026-09-22, Phase 3): genuinely not
    // auto-gradable, so they never touch score/maxScore at all — a student
    // can't raise or lower their percentage by how they answer one, which
    // would be a worse guarantee violation than not grading it. "Answered"
    // just means they wrote something to self-check against the reference.
    if (step.kind === 'open') {
      const answered = submitted != null && typeof submitted.text === 'string' && submitted.text.trim().length > 0;
      if (answered) answeredCount += 1;
      ungradedCount += 1;
      const { correct: _drop, ...stepWithoutCorrect } = step;
      return { ...stepWithoutCorrect, correctIndex: null, answered, correct: null, ungraded: true, submittedText: answered ? submitted.text : null, submittedOptionIndex: null };
    }

    maxScore += step.marks;
    const answered = submitted != null && submitted.optionIndex != null;
    if (answered) answeredCount += 1;
    const correct = answered && Number(submitted.optionIndex) === Number(step.correct);
    if (correct) score += step.marks;
    // IMPORTANT: step.correct is the numeric answer-key index from the DB.
    // Do not spread `...step` after also setting a boolean `correct` key —
    // they'd collide (a real bug caught during the rebuild's own edge-case
    // verification pass, see REBUILD_NOTES.md). correctIndex preserves the
    // original numeric answer key under its own name so callers can show
    // "the right answer was C" without losing whether THIS submission was right.
    const { correct: correctIndex, ...stepWithoutCorrect } = step;
    return { ...stepWithoutCorrect, correctIndex, answered, correct, ungraded: false, submittedOptionIndex: answered ? Number(submitted.optionIndex) : null };
  });
  return { gradedSteps, score, maxScore, answeredCount, ungradedCount };
}

module.exports = { flattenAll, keyFor, gradeSubmission, gradeOneStep };
