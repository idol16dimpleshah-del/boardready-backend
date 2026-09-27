// Readiness Score — configurable weights and thresholds. Same pattern as
// diagnostics-config.js/retest-config.js: nothing in readiness.js hard-codes
// a magic number, everything here is env-var overridable, and every value is
// a conservative starting default, NOT scientifically validated — a config
// change, not a code change, once there's real outcome data to calibrate
// against (per the founder's own explicit "eventually the weights should be
// data-driven, not hard-coded" instruction).
//
// Deliberately a SEPARATE config from diagnostics-config.js, same reasoning
// retest-config.js already established: Readiness answers a different
// question (a single composite "are you ready" number) than diagnostics.js's
// per-topic mastery classification, so tuning one must not silently move the
// other. Where a Readiness component reuses a diagnostics.js CONCEPT (e.g.
// "recent window," "evidence tiers"), it reuses diagnostics-config.js's own
// values directly (imported, not duplicated) rather than re-defining a
// second, potentially-drifting copy of the same threshold.

function num(envVar, fallback) {
  const v = process.env[envVar];
  return v !== undefined && v !== '' ? Number(v) : fallback;
}

const CONFIG = {
  // Composite weights — must sum to 1 (checked at the bottom of this file).
  // Starting point is the founder's own example weighting, verbatim.
  WEIGHTS: {
    mastery: num('READY_W_MASTERY', 0.30),
    recentAccuracy: num('READY_W_RECENT_ACCURACY', 0.20),
    difficultyPerformance: num('READY_W_DIFFICULTY_PERFORMANCE', 0.15),
    consistency: num('READY_W_CONSISTENCY', 0.10),
    speed: num('READY_W_SPEED', 0.10),
    syllabusCoverage: num('READY_W_SYLLABUS_COVERAGE', 0.10),
    advancedQuestionPerformance: num('READY_W_ADVANCED_QUESTION_PERFORMANCE', 0.05),
  },

  // Difficulty-band weighting inside the "difficulty performance" component —
  // a Hard question answered correctly counts for more than an Easy one, so
  // a student can't inflate this component by only ever attempting Easy
  // questions (see ANTI_GAMING notes below).
  DIFFICULTY_BAND_WEIGHTS: { Easy: 1, Medium: 1.5, Hard: 2 },

  // Anti-gaming (founder's explicit ask: "95% on Easy questions != 95% exam
  // readiness"): the syllabus-coverage component blends chapter coverage
  // with DIFFICULTY-BAND coverage, so a student who only ever farms Easy
  // questions scores low on this component even with every chapter touched.
  COVERAGE_CHAPTER_WEIGHT: num('READY_COVERAGE_CHAPTER_WEIGHT', 0.7),
  COVERAGE_DIFFICULTY_BAND_WEIGHT: num('READY_COVERAGE_DIFFICULTY_BAND_WEIGHT', 0.3),

  // Minimum attempted questions in a difficulty band, or in the
  // "advanced" (Hard + case-study) slice, before that band/slice counts as
  // meaningfully "covered" or "measurable" — below this, treat as no
  // evidence for that component rather than a shaky number. Deliberately a
  // lower bar than diagnostics.js's own MIN_EVIDENCE (3): these are narrower
  // slices of a student's overall activity, so demanding the full bar would
  // make the advanced/coverage components almost never resolve at pilot
  // scale.
  MIN_EVIDENCE_PER_SLICE: num('READY_MIN_EVIDENCE_PER_SLICE', 2),

  // Overall Readiness evidence tiers (total attempted questions in scope).
  // Mirrors diagnostics-config.js's own MIN/LIKELY/CONFIRMED_EVIDENCE
  // tiers directly (same numbers, imported at call time in readiness.js —
  // not redefined here) so "is this student's overall picture trustworthy"
  // answers the same way across the whole app. What IS specific to
  // Readiness is how many of the 7 components could actually be computed —
  // see COMPONENT_COVERAGE_* below.
  COMPONENT_COVERAGE_HIGH_PCT: num('READY_COMPONENT_COVERAGE_HIGH_PCT', 85), // fraction of the 7 components with real data, weighted
  COMPONENT_COVERAGE_MEDIUM_PCT: num('READY_COMPONENT_COVERAGE_MEDIUM_PCT', 50),

  // Qualitative labels on the final 0-100 Exam Readiness score. Explicitly
  // NOT meant to be permanent, arbitrary bands — the founder's own
  // instruction is that these should eventually be calibrated against real
  // exam outcomes, not just picked to look nice. Treat as a v0 placeholder,
  // config-changeable the moment there's real outcome data.
  LABEL_BANDS: [
    { max: 49, label: 'Building' },
    { max: 69, label: 'Developing' },
    { max: 84, label: 'Exam Ready' },
    { max: 100, label: 'High Confidence' },
  ],
};

const weightSum = Object.values(CONFIG.WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(weightSum - 1) > 0.001) {
  // Fail loudly at startup rather than silently normalizing — a weight
  // typo that changes what Readiness means should never pass silently.
  throw new Error(`readiness-config.js: WEIGHTS must sum to 1, got ${weightSum}. Check env var overrides.`);
}

module.exports = CONFIG;
