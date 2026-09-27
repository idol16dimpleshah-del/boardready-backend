// Retest / Improvement Loop — "did this student actually get better on THIS
// topic between attempts", compared against their first-ever attempt on it
// (not just the immediately previous one), so a dip-then-recover pattern
// still reads as real improvement over the baseline.
//
// REBUILT from scratch (see REBUILD_NOTES.md) to match the documented
// behavior: buildAttemptTimeline() groups steps by attempt chronologically,
// classifyVsOriginal() turns two accuracy numbers into a trend, and never
// fabricates a trend from fewer than 2 real attempts.

const CONFIG = require('./retest-config');

function buildAttemptTimeline(steps) {
  const byAttempt = new Map();
  for (const s of steps) {
    if (!byAttempt.has(s.attemptId)) byAttempt.set(s.attemptId, { attemptId: s.attemptId, submittedAt: s.submittedAt, steps: [] });
    byAttempt.get(s.attemptId).steps.push(s);
  }
  return [...byAttempt.values()]
    .map((g) => ({
      attemptId: g.attemptId,
      submittedAt: g.submittedAt,
      attempted: g.steps.length,
      correctCount: g.steps.filter((s) => s.correct).length,
      accuracyPct: Math.round((100 * g.steps.filter((s) => s.correct).length) / g.steps.length),
    }))
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt) || a.attemptId - b.attemptId);
}

function classifyVsOriginal(originalPct, latestPct) {
  if (originalPct == null || latestPct == null) {
    return { trend: 'not_enough_data', delta: null, reason: 'Not enough attempts on this topic yet to compare.' };
  }
  const delta = latestPct - originalPct;
  let trend;
  if (delta >= CONFIG.IMPROVING_DELTA_PCT) trend = 'improving';
  else if (delta <= -CONFIG.DECLINING_DELTA_PCT) trend = 'declining';
  else trend = 'plateaued';
  const reason = `${latestPct}% now vs ${originalPct}% on your first attempt (${delta >= 0 ? '+' : ''}${delta} points).`;
  return { trend, delta, reason };
}

// The specific (chapterId, subConcept) scope's full history -> "vs original" verdict.
function computeVsOriginal(steps) {
  const timeline = buildAttemptTimeline(steps);
  const attemptsCount = timeline.length;
  if (attemptsCount < 2) {
    return { ...classifyVsOriginal(null, null), attemptsCount, originalPct: timeline[0]?.accuracyPct ?? null, latestPct: timeline[0]?.accuracyPct ?? null };
  }
  const originalPct = timeline[0].accuracyPct;
  const latestPct = timeline[timeline.length - 1].accuracyPct;
  return { ...classifyVsOriginal(originalPct, latestPct), attemptsCount, originalPct, latestPct, timeline };
}

// Real, directly-linked before/after comparison for the "Improve My Score"
// loop (2026-09-22, Phase 4) — deliberately separate from computeVsOriginal
// above, which is scoped to one (chapterId, subConcept) pair. An improvement
// test can span several weak sub-concepts from one source attempt at once,
// so this compares TWO SPECIFIC attempts directly, per sub-concept, rather
// than a chapter's whole history. sourceSteps/newSteps are this student's
// real graded steps (from diagnostics.getStudentStepHistory), pre-filtered
// by the caller to each attempt's own attemptId — nothing here recomputes
// correctness; it only aggregates what scoring.js already decided.
function computeImprovementComparison({ sourceAttemptId, sourceSteps, newSteps, sourceScore, sourceMaxScore, newScore, newMaxScore }) {
  const sourceAccuracyPct = sourceMaxScore ? Math.round((100 * sourceScore) / sourceMaxScore) : null;
  const newAccuracyPct = newMaxScore ? Math.round((100 * newScore) / newMaxScore) : null;
  const deltaPct = sourceAccuracyPct != null && newAccuracyPct != null ? newAccuracyPct - sourceAccuracyPct : null;

  // Only sub-concepts that were actually WRONG in the source attempt — the
  // whole point of an improvement test — and that the student actually saw
  // again in the new attempt (never invents "improved" for something not
  // retested).
  const bySubSource = new Map();
  for (const s of sourceSteps) {
    const key = s.subConcept || s.chapterName || 'General';
    if (!bySubSource.has(key)) bySubSource.set(key, { chapterId: s.chapterId, chapterName: s.chapterName, wrong: 0, total: 0 });
    const g = bySubSource.get(key);
    g.total += 1; if (!s.correct) g.wrong += 1;
  }
  const bySubNew = new Map();
  for (const s of newSteps) {
    const key = s.subConcept || s.chapterName || 'General';
    if (!bySubNew.has(key)) bySubNew.set(key, { correct: 0, total: 0 });
    const g = bySubNew.get(key);
    g.total += 1; if (s.correct) g.correct += 1;
  }
  const bySubConcept = [];
  for (const [name, src] of bySubSource.entries()) {
    if (src.wrong === 0) continue; // wasn't a weak spot, nothing to report improvement on
    const now = bySubNew.get(name);
    if (!now) { bySubConcept.push({ name, status: 'not_retested', reason: 'Not covered in this improvement test.' }); continue; }
    const status = now.correct === now.total ? 'improved' : 'still_needs_practice';
    bySubConcept.push({ name, status, sourceWrong: src.wrong, sourceTotal: src.total, newCorrect: now.correct, newTotal: now.total });
  }

  return { sourceAttemptId, sourceScore, sourceMaxScore, sourceAccuracyPct, newScore, newMaxScore, newAccuracyPct, deltaPct, bySubConcept };
}

module.exports = { buildAttemptTimeline, classifyVsOriginal, computeVsOriginal, computeImprovementComparison };
