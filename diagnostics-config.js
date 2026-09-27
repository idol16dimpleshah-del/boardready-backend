// Evidence tiers and thresholds for the diagnostics engine. See
// readiness-config.js for the same "config, not magic numbers" convention —
// this file predates it and readiness-config.js explicitly imports these
// tiers rather than redefining them, so "is this trustworthy" means the
// same thing everywhere in the app.
//
// REBUILT from scratch (see REBUILD_NOTES.md). The specific numbers below
// (MIN_EVIDENCE=3, RECENT_WINDOW_COUNT=5) are reconstructed from values that
// showed up in this session's own verified test output before the reset
// (e.g. a real API response read "accuracy on the most recent 5 questions"
// and evidenceFor() was exercised against MIN_EVIDENCE=3 in passing tests),
// so those two are known-correct. The rest are reasonable, clearly-labelled
// defaults, not reconstructed from a specific remembered value.

function num(envVar, fallback) {
  const v = process.env[envVar];
  return v !== undefined && v !== '' ? Number(v) : fallback;
}

module.exports = {
  // Below this many attempted questions (in whatever scope — one chapter,
  // one subject, overall), a mastery/trend claim is not made at all —
  // 'insufficient_evidence', never a fabricated percentage from 1-2 data points.
  MIN_EVIDENCE: num('DIAG_MIN_EVIDENCE', 3),
  // At or above this many attempts, a status is upgraded from "provisional"
  // framing to a plainly-stated one.
  LIKELY_EVIDENCE: num('DIAG_LIKELY_EVIDENCE', 8),
  // At or above this many attempts, evidence is strong enough to call "high confidence".
  CONFIRMED_EVIDENCE: num('DIAG_CONFIRMED_EVIDENCE', 20),
  // Rolling window size for the "recent" accuracy/trend signal.
  RECENT_WINDOW_COUNT: num('DIAG_RECENT_WINDOW_COUNT', 5),
  // Mastery status bands (accuracy %, once MIN_EVIDENCE is met).
  STRONG_PCT: num('DIAG_STRONG_PCT', 80),
  DEVELOPING_PCT: num('DIAG_DEVELOPING_PCT', 50),
};
