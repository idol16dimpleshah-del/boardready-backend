// Readiness Score — a transparent, evidence-based composite, replacing the
// cosmetic "Readiness Core" number the Revision 3 design prototype invented
// with no API behind it (confirmed by direct audit: there was no
// "readiness" concept anywhere in this backend before this file). Built
// entirely on top of diagnostics.js's already-working, already-explainable
// step history and mastery classification — this module does not
// re-implement scoring, re-score attempts, or add a new table. It is a
// SYNTHESIS layer: it reads what diagnostics.js/retest.js already compute
// and blends it into one number, the same "DATA -> RULES -> DIAGNOSIS,
// no AI" philosophy diagnostics.js established.
//
// Every score this module returns carries a `components` breakdown (which
// factor contributed how much) and an `evidence` object (how much data
// backs this number, and in plain language why), directly answering the
// founder's own explicit bar: "why did we give you this score?" A
// component that genuinely can't be computed yet (e.g. no Hard-difficulty
// attempts at all) is reported as `null` with its own reason — never
// silently defaulted to 0 or to a fabricated number. See readiness-config.js
// for why every weight/threshold here is a labelled, unvalidated starting
// default, not a hard-coded truth.
//
// TWO DISPLAYED DIMENSIONS (founder's explicit ask — these are NOT the same
// thing): `knowledgeMasteryPct` is pure accuracy across attempted material
// (do you know it), taken directly from diagnostics.js's own summary.
// `examReadiness` is the full 7-factor composite (can you deliver it under
// real conditions — speed, consistency, coverage, harder questions
// included). A student can know the syllabus but still show a lower Exam
// Readiness than Knowledge Mastery if they're slow, inconsistent, or have
// never faced a Hard question — that gap is itself useful information, not
// a bug.

const db = require('./db');
const diagnostics = require('./diagnostics');
const diagConfig = require('./diagnostics-config');
const { GRADABLE_STATUSES } = require('./content-rules');
const CONFIG = require('./readiness-config');

function pct(n, d) { return d ? Math.round((100 * n) / d) : null; }

// ---------------------------------------------------------------------------
// COMPONENT 1 — Mastery (= diagnostics.js's own accuracy across every
// attempted step in scope). This is also, standalone, the displayed
// "Knowledge Mastery" figure.
// ---------------------------------------------------------------------------
function masteryComponent(overallSummary) {
  if (overallSummary.accuracyPct == null) return { value: null, reason: 'No questions attempted yet.' };
  return {
    value: overallSummary.accuracyPct,
    reason: `${overallSummary.accuracyPct}% accuracy across ${overallSummary.attempted} attempted questions.`,
  };
}

// ---------------------------------------------------------------------------
// COMPONENT 2 — Recent accuracy (diagnostics.js's own rolling-window trend
// signal, reused directly rather than a second recency computation).
// ---------------------------------------------------------------------------
function recentAccuracyComponent(overallSummary) {
  if (overallSummary.recentAccuracyPct == null) return { value: null, reason: 'Not enough recent attempts yet.' };
  return {
    value: overallSummary.recentAccuracyPct,
    reason: `${overallSummary.recentAccuracyPct}% accuracy on the most recent ${overallSummary.evidence.recentCount} questions.`,
  };
}

// ---------------------------------------------------------------------------
// COMPONENT 3 — Difficulty-adjusted performance. A Hard question answered
// correctly counts for more than an Easy one (DIFFICULTY_BAND_WEIGHTS), so
// this number cannot be inflated by only ever attempting Easy questions —
// see also the coverage component below, which independently penalizes
// never touching Hard/Medium at all.
// ---------------------------------------------------------------------------
function difficultyPerformanceComponent(steps, config = CONFIG) {
  const byDifficulty = {};
  for (const s of steps) {
    if (!s.difficulty) continue;
    if (!byDifficulty[s.difficulty]) byDifficulty[s.difficulty] = { correct: 0, n: 0 };
    byDifficulty[s.difficulty].n += 1;
    if (s.correct) byDifficulty[s.difficulty].correct += 1;
  }
  const bands = Object.entries(byDifficulty).filter(([, v]) => v.n >= config.MIN_EVIDENCE_PER_SLICE);
  if (!bands.length) return { value: null, reason: 'Not enough attempts in any single difficulty band yet.', byBand: byDifficulty };
  let weightedSum = 0;
  let weightTotal = 0;
  const byBand = {};
  for (const [difficulty, v] of bands) {
    const w = config.DIFFICULTY_BAND_WEIGHTS[difficulty] ?? 1;
    const acc = pct(v.correct, v.n);
    byBand[difficulty] = { accuracyPct: acc, attempted: v.n };
    weightedSum += acc * w;
    weightTotal += w;
  }
  return {
    value: Math.round(weightedSum / weightTotal),
    reason: `Weighted across ${bands.map(([d]) => d).join('/')} difficulty (Hard counts more than Easy).`,
    byBand,
  };
}

// ---------------------------------------------------------------------------
// COMPONENT 4 — Consistency (diagnostics.js's own stdev-based metric,
// reused directly).
// ---------------------------------------------------------------------------
function consistencyComponent(overallSummary) {
  if (overallSummary.consistencyPct == null) return { value: null, reason: 'Needs at least 2 separate attempts to measure consistency.' };
  return { value: overallSummary.consistencyPct, reason: `Based on the spread of accuracy across ${overallSummary.evidence.distinctAttempts} separate attempts.` };
}

// ---------------------------------------------------------------------------
// COMPONENT 5 — Speed / time efficiency. Only attempts with a real
// server-measured time_exceeded_seconds value contribute — attempts from
// before that field existed, or where it's simply null, are excluded rather
// than assumed to be "on time." Known limitation, stated plainly: this is a
// whole-ATTEMPT time signal (attempts.time_exceeded_seconds), not a
// per-question one — the schema has no per-question timing today, so a
// finer-grained speed signal isn't honestly derivable yet.
// ---------------------------------------------------------------------------
// Phase 6A: async + awaited, and the two camelCase aliases below are now
// double-quoted (see diagnostics.js's getStudentStepHistory comment for why
// — an unquoted `as timeExceededSeconds` would silently fold to
// `timeexceededseconds` under Postgres, breaking every `r.timeExceededSeconds`
// read here; quoting is a no-op under SQLite and the real fix for Postgres).
async function speedComponent(studentId, { subjectId } = {}) {
  const args = [studentId];
  let sql = `
    SELECT a.time_exceeded_seconds as "timeExceededSeconds", t.duration_seconds as "durationSeconds"
    FROM attempts a JOIN tests t ON t.id = a.test_id
    WHERE a.student_id = ? AND a.submitted_at IS NOT NULL AND a.time_exceeded_seconds IS NOT NULL`;
  if (subjectId) { sql += ' AND t.subject_id = ?'; args.push(subjectId); }
  const rows = await db.prepare(sql).all(...args);
  if (!rows.length) return { value: null, reason: 'No timed-attempt data recorded yet.' };
  const scores = rows.map((r) => {
    if (!r.timeExceededSeconds || r.timeExceededSeconds <= 0) return 100;
    const penaltyPct = Math.min(100, Math.round((100 * r.timeExceededSeconds) / Math.max(1, r.durationSeconds)));
    return 100 - penaltyPct;
  });
  const value = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  return { value, reason: `Based on ${rows.length} attempt(s) with recorded time data; ${rows.filter((r) => r.timeExceededSeconds > 0).length} went over the allotted time.` };
}

// ---------------------------------------------------------------------------
// COMPONENT 6 — Syllabus coverage, ANTI-GAMING aware (founder's explicit
// ask: "95% on Easy questions != 95% exam readiness"). Blends chapter
// coverage with difficulty-BAND coverage, so a student who only ever farms
// Easy questions in one chapter scores low here even if their accuracy
// elsewhere looks strong.
// ---------------------------------------------------------------------------
// Phase 6A: async + awaited. Both COUNT(...) results below are explicitly
// coerced with Number(...) before use — Postgres's `pg` driver returns a
// bigint COUNT() as a JS STRING (to avoid silent precision loss beyond
// Number.MAX_SAFE_INTEGER), unlike SQLite/node:sqlite, which has always
// handed back a plain JS number here. Without the coercion, `totalChapters`
// would still print fine but silently break any arithmetic on it, and
// `totalBandsInBank`'s existing `... || 1` fallback below would NEVER fire
// once it's a string — Number("0") is falsy 0, but the string "0" itself is
// truthy — a subtler bug than a wrong type, caught during the Phase 6A
// codebase audit rather than left latent.
async function syllabusCoverageComponent(studentId, steps, subjectIds, config = CONFIG) {
  if (!subjectIds.length) return { value: null, reason: 'No unlocked subjects to measure coverage against.' };
  const placeholders = subjectIds.map(() => '?').join(',');
  const gradablePlaceholders = GRADABLE_STATUSES.map(() => '?').join(',');
  const totalChaptersRow = await db.prepare(
    `SELECT COUNT(DISTINCT c.id) as n FROM chapters c
     JOIN questions q ON q.chapter_id = c.id
     WHERE c.subject_id IN (${placeholders}) AND q.status IN (${gradablePlaceholders})`
  ).get(...subjectIds, ...GRADABLE_STATUSES);
  const totalChapters = Number(totalChaptersRow.n);
  if (!totalChapters) return { value: null, reason: 'No gradable content published yet in your unlocked subjects.' };

  const byChapter = {};
  const byDifficulty = {};
  for (const s of steps) {
    byChapter[s.chapterId] = (byChapter[s.chapterId] || 0) + 1;
    if (s.difficulty) byDifficulty[s.difficulty] = (byDifficulty[s.difficulty] || 0) + 1;
  }
  const chaptersTouched = Object.values(byChapter).filter((n) => n >= config.MIN_EVIDENCE_PER_SLICE).length;
  const chapterCoveragePct = pct(chaptersTouched, totalChapters);

  const totalBandsInBankRow = await db.prepare(
    `SELECT COUNT(DISTINCT q.difficulty) as n FROM questions q JOIN chapters c ON c.id = q.chapter_id
     WHERE c.subject_id IN (${placeholders}) AND q.status IN (${gradablePlaceholders})`
  ).get(...subjectIds, ...GRADABLE_STATUSES);
  const totalBandsInBank = Number(totalBandsInBankRow.n) || 1;
  const bandsTouched = Object.values(byDifficulty).filter((n) => n >= config.MIN_EVIDENCE_PER_SLICE).length;
  const difficultyBandCoveragePct = pct(Math.min(bandsTouched, totalBandsInBank), totalBandsInBank);

  const value = Math.round(chapterCoveragePct * config.COVERAGE_CHAPTER_WEIGHT + difficultyBandCoveragePct * config.COVERAGE_DIFFICULTY_BAND_WEIGHT);
  return {
    value,
    reason: `${chaptersTouched}/${totalChapters} chapters attempted with enough evidence; ${bandsTouched}/${totalBandsInBank} difficulty bands touched.`,
    chapterCoveragePct, difficultyBandCoveragePct,
  };
}

// ---------------------------------------------------------------------------
// COMPONENT 7 — Advanced-question performance (Hard-difficulty + case-study
// "higher-order" questions specifically).
// ---------------------------------------------------------------------------
function advancedQuestionPerformanceComponent(steps, config = CONFIG) {
  const advanced = steps.filter((s) => s.difficulty === 'Hard' || s.kind === 'case');
  if (advanced.length < config.MIN_EVIDENCE_PER_SLICE) {
    return { value: null, reason: `Only ${advanced.length} Hard/case-study question(s) attempted so far — not enough to measure.` };
  }
  const correct = advanced.filter((s) => s.correct).length;
  return { value: pct(correct, advanced.length), reason: `${pct(correct, advanced.length)}% accuracy across ${advanced.length} Hard/case-study questions.` };
}

// ---------------------------------------------------------------------------
// EVIDENCE / CONFIDENCE — never lets the composite pretend to know more
// than the data supports. Two inputs: raw sample size (reusing
// diagnostics-config.js's own evidence tiers, so "is this trustworthy"
// means the same thing everywhere in the app) and how many of the 7
// components actually resolved (a student can have 50 attempts all on Easy
// questions in one chapter — plenty of raw evidence, but several
// components still can't be measured).
// ---------------------------------------------------------------------------
function evidenceFor(totalAttempted, componentsResolvedWeight, config = CONFIG) {
  if (totalAttempted < diagConfig.MIN_EVIDENCE) {
    return { level: 'insufficient', attemptedCount: totalAttempted, reason: `Only ${totalAttempted} question(s) attempted — need at least ${diagConfig.MIN_EVIDENCE} before a Readiness score means anything.` };
  }
  const sampleTier = totalAttempted >= diagConfig.CONFIRMED_EVIDENCE ? 2 : totalAttempted >= diagConfig.LIKELY_EVIDENCE ? 1 : 0;
  const componentTier = componentsResolvedWeight >= config.COMPONENT_COVERAGE_HIGH_PCT ? 2 : componentsResolvedWeight >= config.COMPONENT_COVERAGE_MEDIUM_PCT ? 1 : 0;
  const combinedTier = Math.min(sampleTier, componentTier);
  const level = combinedTier === 2 ? 'high' : combinedTier === 1 ? 'medium' : 'low';
  return {
    level, attemptedCount: totalAttempted,
    componentsResolvedPct: Math.round(componentsResolvedWeight),
    reason: level === 'high'
      ? `High confidence — ${totalAttempted} questions attempted across most factors below.`
      : level === 'medium'
        ? `Medium confidence — ${totalAttempted} questions attempted, but some factors below (like difficulty spread or timing) are still thin.`
        : `Low confidence — only ${totalAttempted} questions attempted so far, and most of the factors below don't have enough evidence yet.`,
  };
}

function labelFor(score, config = CONFIG) {
  if (score == null) return null;
  const band = config.LABEL_BANDS.find((b) => score <= b.max);
  return band ? band.label : config.LABEL_BANDS[config.LABEL_BANDS.length - 1].label;
}

// ---------------------------------------------------------------------------
// MAIN ENTRY POINT
// ---------------------------------------------------------------------------
async function computeReadiness(studentId, { subjectId, unlockedSubjectIds } = {}, config = CONFIG) {
  const steps = await diagnostics.getStudentStepHistory(studentId, subjectId ? { subjectId } : {});
  const overallSummary = diagnostics.summarizeGroup(steps);
  const subjectIds = subjectId ? [subjectId] : (unlockedSubjectIds || []);

  if (overallSummary.attempted < diagConfig.MIN_EVIDENCE) {
    return {
      knowledgeMasteryPct: null,
      examReadiness: null,
      evidence: evidenceFor(overallSummary.attempted, 0),
      components: [],
      hasAnyData: overallSummary.attempted > 0,
    };
  }

  const mastery = masteryComponent(overallSummary);
  const recentAccuracy = recentAccuracyComponent(overallSummary);
  const difficultyPerformance = difficultyPerformanceComponent(steps, config);
  const consistency = consistencyComponent(overallSummary);
  // The two db-backed components are independent of each other and of the
  // four pure ones above — fetched concurrently rather than sequentially,
  // a real (if modest) latency win under the Postgres engine where each
  // query is a real network round-trip, at zero behavior change for either
  // engine (fine to fire both statements from the same pool at once).
  const [speed, syllabusCoverage] = await Promise.all([
    speedComponent(studentId, { subjectId }),
    syllabusCoverageComponent(studentId, steps, subjectIds, config),
  ]);
  const advancedQuestionPerformance = advancedQuestionPerformanceComponent(steps, config);

  const raw = {
    mastery, recentAccuracy, difficultyPerformance, consistency, speed, syllabusCoverage, advancedQuestionPerformance,
  };

  let weightedSum = 0;
  let weightUsed = 0;
  const components = [];
  for (const [key, weight] of Object.entries(config.WEIGHTS)) {
    const c = raw[key];
    const resolved = c.value != null;
    if (resolved) { weightedSum += c.value * weight; weightUsed += weight; }
    components.push({ factor: key, value: c.value, weight, reason: c.reason, resolved });
  }

  const examReadinessScore = weightUsed > 0 ? Math.round(weightedSum / weightUsed) : null;
  const componentsResolvedWeight = Math.round(weightUsed * 100); // weightUsed is already a 0..1 fraction of total weight

  return {
    knowledgeMasteryPct: mastery.value,
    examReadiness: examReadinessScore == null ? null : {
      score: examReadinessScore,
      label: labelFor(examReadinessScore, config),
    },
    evidence: evidenceFor(overallSummary.attempted, componentsResolvedWeight, config),
    components,
    hasAnyData: true,
  };
}

module.exports = {
  computeReadiness,
  // exported individually for the expected-marks / retest-schedule follow-up
  // work and for tests — not re-implemented a second time elsewhere.
  masteryComponent, recentAccuracyComponent, difficultyPerformanceComponent,
  consistencyComponent, speedComponent, syllabusCoverageComponent, advancedQuestionPerformanceComponent,
  evidenceFor, labelFor,
};
