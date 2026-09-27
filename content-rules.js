// The ONE definition of "which questions are safe to serve in a scored
// test/practice set" — shared by the test-assembly engine and the
// personalized-practice engine so this rule can never drift between the two.
//
// RESTORED VERBATIM after the workspace reset — this file's exact text was
// still present in this conversation's context (I had read it in full
// earlier in the session), so unlike most of the rest of this rebuild, this
// one is a true restore, not a reconstruction.
//
// Never 'draft' (not checked against a source) or 'transcribed' (no answer
// key exists at all for that content — scoring it would be meaningless).

const db = require('./db');

const GRADABLE_STATUSES = ['verified', 'qa_passed', 'published'];

// Phase 6A (docs/phase-6-postgres-cutover-plan.md): async + awaited so this
// works under both DB_ENGINE=sqlite (still a synchronous call under the
// hood — await on a plain value just resolves it) and DB_ENGINE=postgres
// (a real Promise). Every caller (practice.js) now awaits this.
async function resolveChapterIds(subjectId, requestedChapterIds) {
  if (Array.isArray(requestedChapterIds) && requestedChapterIds.length) return requestedChapterIds;
  const rows = await db.prepare('SELECT id FROM chapters WHERE subject_id = ?').all(subjectId);
  return rows.map((c) => c.id);
}

module.exports = { GRADABLE_STATUSES, resolveChapterIds };
