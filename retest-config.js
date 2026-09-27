// Retest / Improvement Loop thresholds — a SEPARATE config from
// diagnostics-config.js on purpose (see readiness-config.js's header for the
// same reasoning restated): retest.js answers "did this student's accuracy
// on ONE topic move between attempts", a different question from
// diagnostics.js's "is this topic mastered", so tuning one must not
// silently move the other.
//
// REBUILT from scratch (see REBUILD_NOTES.md). The specific delta thresholds
// below are reasonable, clearly-labelled defaults — the exact original
// numbers were not recoverable, only the qualitative boundary behavior
// (">=, not >" at the improving threshold) which the restored test suite
// still checks.

function num(envVar, fallback) {
  const v = process.env[envVar];
  return v !== undefined && v !== '' ? Number(v) : fallback;
}

module.exports = {
  IMPROVING_DELTA_PCT: num('RETEST_IMPROVING_DELTA_PCT', 10),
  DECLINING_DELTA_PCT: num('RETEST_DECLINING_DELTA_PCT', 10),
};
