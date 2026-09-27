// Board Ready — SQLite database (Node's built-in node:sqlite, same as the
// original implementation — still an experimental Node API as of this
// writing, hence the runtime warning on startup; that's expected, not a bug).
//
// ---------------------------------------------------------------------------
// REBUILD NOTICE (read this before trusting anything below as "the original
// schema"): this file, and every other file in this backend, was rewritten
// from scratch after the cloud sandbox that hosted the original working
// implementation was reclaimed (a documented possibility for long-idle
// sessions) and its filesystem wiped — including the database, the seed
// data, and every source file except readiness.js/readiness-config.js and
// content-rules.js, which survived verbatim because their full text was
// still present in this conversation's own context. Everything else
// (this schema, diagnostics.js, retest.js, practice.js, server.js) is a
// faithful RECONSTRUCTION from the detailed audit notes and API behavior
// documented earlier in the conversation, not a byte-for-byte restore.
// It is newly written and newly tested code — see REBUILD_NOTES.md for the
// full account of what's an exact restore vs. a reconstruction.
// ---------------------------------------------------------------------------

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

module.exports = function createSqliteDb(dispatcherIsTestMode, dispatcherDiagnostics) {
// ---------------------------------------------------------------------------
// Phase 6A note: this file is now required from db.js (the engine
// dispatcher) rather than directly by the rest of the app. Its own
// behavior — schema, migrations, the isolation guard below, the calling
// shape — is otherwise completely UNCHANGED from before Phase 6; this is
// the "preserve the SQLite code path for rollback" half of the dual-engine
// design (see docs/phase-6-postgres-cutover-plan.md). isTestMode/
// testModeDiagnostics are computed once in db.js and passed in so both
// engines' isolation guards agree on the exact same verdict; this file's
// own independent NODE_ENV/--test detection below is kept as a second,
// redundant layer (belt-and-braces, matching this guard's original
// "two independent detection methods on purpose" philosophy) rather than
// removed, since a module that can still detect test mode entirely on its
// own is strictly safer than one that trusts a caller completely.
// ---------------------------------------------------------------------------
// TEST-DATABASE ISOLATION GUARD (added 2026-09-23, after two incidents where
// running the test suite wrote real rows into the live database — see
// docs/test-database-isolation-incident.md for the full account). This is
// not a "please remember to set DB_PATH" reminder; it is a hard, structural
// check that runs every time this module is loaded, in every process that
// ever requires it (the main test-runner process AND any child process it
// spawns), and that FAILS CLOSED — refuses to open ANY database — whenever
// it detects a test context without an explicit, verified-safe DB_PATH.
//
// Detecting "is this a test run" two independent ways on purpose, because
// incident #1 and #2 both happened in a plain `node --test` invocation where
// nothing had set NODE_ENV at all:
//   (1) NODE_ENV === 'test' — the conventional signal, which test/*.test.js
//       files and package.json's "test" script now set explicitly (see
//       test/readiness.test.js and package.json).
//   (2) the process was actually launched with node's own `--test` flag —
//       true regardless of whether anything bothered to set NODE_ENV, so a
//       bare `node --test` still trips this even if every other layer of
//       defense were removed.
// A child process spawned BY a test (e.g. the real `node server.js` that
// test/readiness.test.js's before() hook starts) does not itself get the
// `--test` flag — it is an ordinary `node server.js`. That process is only
// protected by whatever env its parent explicitly gives it. This is a real,
// named residual gap, not a hidden one: it is why test/readiness.test.js now
// builds that child's env explicitly (never `...process.env` alone) and why
// the live-database-immutability test (test/db-isolation.test.js) exists as
// an independent backstop that does not depend on this guard at all.
const LIVE_DB_PATH = path.join(__dirname, 'boardready.db');

// Known preserved/backup copies of production data. A test run must never
// be pointed at any of these either — an explicit-but-wrong DB_PATH is just
// as unsafe as an implicit one. Directories are forbidden wholesale (every
// file under them), not just their currently-known contents, since more
// backup/preservation copies get added over time (see the Phase 2 and
// incident reports).
const FORBIDDEN_TEST_DB_PATHS = [
  LIVE_DB_PATH,
  path.join(__dirname, 'backups'),
  '/home/claude/preservation',
];

function resolvesUnderForbiddenPath(resolvedPath) {
  return FORBIDDEN_TEST_DB_PATHS.some((forbidden) => {
    const resolvedForbidden = path.resolve(forbidden);
    return resolvedPath === resolvedForbidden || resolvedPath.startsWith(resolvedForbidden + path.sep);
  });
}

// Empirically verified in this environment (Node v22.22.2, both
// `node --test <file>` and bare `node --test` auto-discovery): Node's own
// built-in test runner sets NODE_TEST_CONTEXT in every process it runs a
// test file in, with NO configuration required from this project at all —
// this is what actually caught the fact that `process.execArgv`/
// `process.argv` do NOT contain "--test" (node consumes that flag itself
// before argv is built, so an argv-based check silently never fires; keeping
// it below anyway as a harmless second layer in case a future Node version
// exposes it differently). This means a bare `node --test`, run by anyone,
// in any directory, with zero environment setup, is caught by this guard
// with no reliance on NODE_ENV or any other opt-in signal.
const LAUNCHED_WITH_NODE_TEST_FLAG = process.execArgv.some((a) => a === '--test' || a.startsWith('--test='))
  || process.argv.some((a) => a === '--test' || a.startsWith('--test='));
// dispatcherIsTestMode comes from db.js (see the Phase 6A note above this
// guard) — OR'd with this file's own independent detection rather than
// replacing it, so this file is never LESS strict than it was before the
// dispatcher existed.
const IS_TEST_MODE = Boolean(dispatcherIsTestMode) || process.env.NODE_ENV === 'test' || Boolean(process.env.NODE_TEST_CONTEXT) || LAUNCHED_WITH_NODE_TEST_FLAG;

let DB_PATH;
if (IS_TEST_MODE) {
  const rawTestPath = process.env.DB_PATH;
  if (!rawTestPath || !rawTestPath.trim()) {
    throw new Error(
      'FATAL: test-database isolation guard tripped in db.js.\n' +
      `  Detected test context (NODE_ENV=${JSON.stringify(process.env.NODE_ENV)}, ` +
      `NODE_TEST_CONTEXT=${JSON.stringify(process.env.NODE_TEST_CONTEXT)}, ` +
      `--test flag: ${LAUNCHED_WITH_NODE_TEST_FLAG}) but no DB_PATH was provided.\n` +
      '  Refusing to open any database. There is no default test database and this\n' +
      '  code will NEVER silently fall back to the live database. Set DB_PATH to an\n' +
      '  explicit, dedicated test-database file before running tests. See\n' +
      '  docs/test-database-isolation-incident.md for why this exists.'
    );
  }
  const resolvedTestPath = path.resolve(rawTestPath);
  if (resolvesUnderForbiddenPath(resolvedTestPath)) {
    throw new Error(
      'FATAL: test-database isolation guard tripped in db.js.\n' +
      `  DB_PATH ("${rawTestPath}" -> resolved "${resolvedTestPath}") points at the live\n` +
      '  database or a known preserved/backup copy of it. Refusing to open it. A test\n' +
      '  run must use a dedicated test database that is never the live file, never a\n' +
      '  backup under backups/, and never anything under /home/claude/preservation.'
    );
  }
  DB_PATH = resolvedTestPath;
  process.stderr.write(`[db.js] TEST DATABASE: ${DB_PATH}\n`);
} else {
  // Non-test operational behavior, unchanged from before this guard: an
  // explicit DB_PATH override is honored as-is (used deliberately throughout
  // Phases 2-4 to point disposable servers at copies), defaulting to the
  // live database when unset. IS_TEST_MODE being false here is exactly what
  // keeps this branch from ever being reached by a real test run.
  DB_PATH = process.env.DB_PATH ? path.resolve(process.env.DB_PATH) : LIVE_DB_PATH;
}

const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('student','teacher')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board TEXT NOT NULL CHECK(board IN ('CBSE','ICSE')),
  name TEXT NOT NULL,
  class TEXT NOT NULL DEFAULT '10',
  UNIQUE(board, name, class)
);

CREATE TABLE IF NOT EXISTS chapters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- kind='mcq': options_json = JSON array of option strings, correct = 0-based index into it.
-- kind='case': parts_json = JSON array of {text, options:[...], correct, marks} — one scored
--   step per part, exactly the case-study "one question, multiple graded sub-parts" shape
--   scoring.js's flattenAll() expands.
-- kind='open': the SOURCE-INVENTORY shape for content that isn't MCQ/case in its native form —
--   "Name the following", "Give reasons", equation-writing, numerical/calculation problems,
--   structural/diagram-identification, short-answer, long-answer, competency-style prompts, etc.
--   options_json/correct are always NULL for 'open' (never invent a multiple-choice shape a
--   source didn't print). parts_json MAY hold an array of {text, marks} (no options/correct)
--   when several sub-items share one printed passage/stem (e.g. "Give reasons: (a)...(f)") —
--   grouped the same way a case-study's parts are, but never scored, since flattenAll()/scoring
--   only ever runs against rows already filtered to GRADABLE_STATUSES, and an 'open' row's
--   answer_status keeps it out of that set until a real answer/rubric exists. This is the
--   "capture first, decide later" architecture: the source bank is an inventory of the SOURCE
--   MATERIAL, not merely of the questions our current test engine already knows how to grade.
--   question_format (see column below) records which native shape this is, independent of kind.
-- status follows content-rules.js's provenance ladder: draft (not checked against a source) ->
-- transcribed (typed in from a real source, cross-checked against its own answer key, but not
-- independently re-verified by a second reviewer) -> verified -> qa_passed -> published. Only
-- GRADABLE_STATUSES (verified/qa_passed/published) are ever served in a scored test or practice
-- set — see content-rules.js. 'transcribed' content is intentionally excluded from that list.
-- 'needs_review' is the QA-gate escape hatch added for continuous ingestion (see ingest.js): when
-- extraction or answer verification for a specific item is genuinely uncertain — a scan too
-- degraded to read the printed answer, the source's own answer key contradicting an independent
-- re-derivation of the correct option, ambiguous question wording — that item lands here instead
-- of being silently guessed into a gradable status. It is deliberately excluded from
-- GRADABLE_STATUSES, same as 'draft'/'transcribed': a question stuck in 'needs_review' is stored,
-- attributed, and visible in review tooling, but never served to a student until a human resolves
-- the uncertainty and promotes it.
-- CONTINUOUS INGESTION support (added this pass, see ingest.js): every
-- question carries its own stable id (question_uid — survives re-exports
-- and cross-references from outside this DB), its own source document AND
-- page (source/source_page — "source" alone used to mean one whole-batch
-- string; a batch of 40 questions from one PDF now each get their own page
-- number too, so "where did question #6142 come from" answers down to the
-- page, not just the PDF), and normalized_text — a whitespace/case/punct-
-- collapsed version of the question text ingest.js hashes for exact-
-- duplicate detection and diffs for near-duplicate detection BEFORE a new
-- batch is inserted. None of this changes how a question is SERVED or
-- GRADED (scoring.js/diagnostics.js/readiness.js are untouched) — it is
-- purely provenance and dedup metadata on top of the same table.
CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_uid TEXT UNIQUE,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id),
  kind TEXT NOT NULL CHECK(kind IN ('mcq','case','open')) DEFAULT 'mcq',
  sub_concept TEXT,
  difficulty TEXT NOT NULL CHECK(difficulty IN ('Easy','Medium','Hard')) DEFAULT 'Medium',
  status TEXT NOT NULL CHECK(status IN ('draft','transcribed','needs_review','verified','qa_passed','published')) DEFAULT 'draft',
  marks INTEGER NOT NULL DEFAULT 1,
  text TEXT NOT NULL,
  normalized_text TEXT,
  options_json TEXT,
  correct INTEGER,
  parts_json TEXT,
  explanation TEXT,
  source TEXT,
  source_page TEXT,
  source_question_number TEXT,
  answer_key_ref TEXT,
  question_type TEXT,
  source_section TEXT,
  question_format TEXT,
  answer_status TEXT NOT NULL DEFAULT 'source_provided' CHECK(answer_status IN ('source_provided','unavailable','needs_review','verified')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- QUESTION status vs ANSWER status are deliberately two separate axes, not
-- one conflated field. 'status' (above) is the QUESTION's own extraction/QA
-- lifecycle: was the text/options/parts captured and structured correctly?
-- 'answer_status' is a completely independent question: is a trustworthy
-- answer attached? A question can be perfectly extracted and QA'd with NO
-- answer yet (source_provided material like the ICSE Chemistry chapters
-- 1-9, which come with questions but no answer key at all) — that is NOT
-- the same defect as a question whose own TEXT is illegible or ambiguous.
-- Before this field existed, "answer uncertain" and "extraction uncertain"
-- were both forced into the single status='needs_review' bucket, which
-- would have wrongly stigmatized a cleanly-extracted question just because
-- its source happens to omit an answer key. answer_status values:
--   source_provided = the source itself supplied this answer (the normal,
--                      overwhelmingly common case for the Maths content)
--   unavailable     = the source provides no answer for this question at
--                      all — nothing was invented; 'correct'/parts' correct
--                      fields stay null or best-effort-absent
--   needs_review    = an answer exists but something about it didn't check
--                      out (contradicts independent recalculation, printed
--                      answer illegible, question/answer sample-space
--                      mismatch, etc.)
--   verified        = the answer has been independently re-confirmed beyond
--                      just "the source said so"
-- SAFETY INVARIANT (enforced in ingest.js, not by a cross-column CHECK
-- constraint SQLite can't express here): a row must never be promoted into
-- a GRADABLE_STATUSES status while answer_status is 'unavailable' or
-- 'needs_review'. This is why Chemistry content without an answer key can
-- be safely ingested at all — it lands with a non-gradable 'status' by
-- construction, so content-rules.js's existing GRADABLE_STATUSES gate
-- (already used unchanged by practice.js/server.js/readiness.js) keeps it
-- out of student tests with no changes needed to any of those files.
-- Full provenance chain, added for continuous ingestion at scale (a founder
-- requirement: "Question ID -> Source document -> Page -> Original question
-- number -> Answer key reference" must be traceable for every row):
--   source              = which source document/batch this came from (see
--                          source_documents.label)
--   source_page         = the page within that source the question printed on
--   source_question_number = the number PRINTED next to the question in the
--                          source (e.g. "94", "(58)") — NOT this table's own
--                          'id' column. For a case-study question this is the single
--                          number the whole passage+sub-parts group was
--                          printed under (e.g. source item (94) with parts
--                          (i)-(iv) is ONE row here, one source_question_number
--                          "94", with all four sub-parts living together in
--                          parts_json/scored as steps 94:a/94:b/94:c/94:d via
--                          scoring.js's flattenAll() — never four unrelated rows).
--   answer_key_ref      = exactly where the answer was cross-checked, e.g.
--                          "answer.pdf p.25.15 item (94)"
--   question_type       = the pedagogical type for test-mix purposes (mcq,
--                          assertion_reasoning, case_study, ...) — distinct
--                          from the 'kind' column, which only encodes grading SHAPE
--                          (mcq = one gradable step, case = many). An
--                          assertion-reasoning question is graded as kind
--                          'mcq' (one 4-option answer) but tagged
--                          question_type 'assertion_reasoning' so a future
--                          test builder can request "4 assertion-reasoning,
--                          4 case-study, 10 plain mcq" the way a real teacher
--                          would compose a paper.
--   question_format     = the NATIVE shape of the source content, independent of both
--                          question_type and kind — e.g. 'mcq', 'name_the_following',
--                          'give_reasons', 'equation', 'numerical', 'structural',
--                          'short_answer', 'long_answer', 'competency', 'fill_blank'.
--                          Free text on purpose (not a CHECK-constrained enum): new source
--                          material keeps surfacing new native shapes, and the whole point
--                          of this column is to never block ingestion on the schema not
--                          having anticipated a shape yet. This is what lets an 'open'-kind
--                          row (see kind='open' comment above) say what it actually is.

-- Every batch ever ingested (one row per PDF/document processed), so "what
-- have we actually loaded, from where, how much of it is verified" is a
-- real query (see ingest.js's sourceLibrary()) instead of something
-- reconstructed from memory each time someone asks.
CREATE TABLE IF NOT EXISTS source_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  board TEXT,
  subject_name TEXT,
  chapter_name TEXT,
  ingested_count INTEGER NOT NULL DEFAULT 0,
  skipped_exact_duplicates INTEGER NOT NULL DEFAULT 0,
  flagged_near_duplicates INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'verified',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- source_documents (above) is one row per INGESTION BATCH (a file, or a
-- file+answer-key pair, run through ingestQuestions() for one
-- board/subject/chapter). source_files (below) is the different, lower
-- thing it was missing: one row per ORIGINAL UPLOADED FILE, permanent and
-- immutable, independent of how many times that file has been or will be
-- ingested. Per the founder's 2026-09-17 "SOURCE FILES ARE IMMUTABLE
-- PROJECT ASSETS" instruction: never delete the file at archive_path,
-- never overwrite it with a processed/transformed copy, and never assume
-- a source_documents row's existence proves the underlying file is safely
-- stored anywhere — check this table and the file at archive_path
-- directly. stable_id is a permanent human-readable identifier (e.g.
-- 'ICSE-CHEM-CH08') that survives even if the file is ever renamed,
-- re-archived, or the DB is rebuilt — always reference a source by
-- stable_id in documentation, never by this table's row id alone.
CREATE TABLE IF NOT EXISTS source_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stable_id TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  upload_ref TEXT,
  board TEXT,
  subject_name TEXT,
  class TEXT,
  source_section TEXT,
  sha256 TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  archive_path TEXT NOT NULL,
  uploaded_at TEXT,
  archived_at TEXT NOT NULL DEFAULT (datetime('now')),
  notes TEXT
);

-- Many-to-many: one ingestion batch can draw on more than one physical file
-- (a question file plus a separate answer-key file), and one physical file
-- can feed more than one ingestion batch (re-ingestion, a second pass, or a
-- chapter split across chapters at ingest time). This is the join that
-- lets "which original file(s) did this question ultimately come from"
-- be answered by a real query instead of matching free-text labels.
CREATE TABLE IF NOT EXISTS source_document_files (
  source_document_id INTEGER NOT NULL REFERENCES source_documents(id),
  source_file_id INTEGER NOT NULL REFERENCES source_files(id),
  PRIMARY KEY (source_document_id, source_file_id)
);

-- Founder requirement, 2026-09-17, "CRITICAL REQUIREMENT — PRESERVE EVERY
-- SOURCE DIAGRAM": a question is not completely captured if its source
-- diagram/figure/graph/structure/circuit/ray-diagram/map/table-image is
-- missing, even if the question TEXT is complete. This table is the
-- question_uid -> source_document -> source_page -> visual_asset chain the
-- founder asked for: one row per visual actually shown with a question.
-- asset_type distinguishes an untouched original source image
-- ('source_page_full' = the complete photographed/scanned page, safest
-- choice since it can never crop away something relevant;
-- 'source_cropped' = a tighter but still COMPLETE crop of just the
-- figure, only ever created when the crop has been visually re-checked to
-- include every point/label/arrow/axis) from a future AI-generated
-- illustration for an AI-authored question ('ai_generated') — the founder
-- was explicit these two must stay clearly distinguishable, never merged
-- or silently swapped. asset_path is a repo-relative path a future
-- frontend can serve directly; for 'source_page_full' it is normally the
-- same file as the linked source_files.archive_path.
CREATE TABLE IF NOT EXISTS visual_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL REFERENCES questions(id),
  source_file_id INTEGER REFERENCES source_files(id),
  asset_type TEXT NOT NULL DEFAULT 'source_page_full' CHECK(asset_type IN ('source_page_full','source_cropped','ai_generated')),
  figure_label TEXT,
  asset_path TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Near-duplicate flags raised during ingestion, held for human review —
-- see ingest.js. Never auto-resolved; a person (or a future explicit
-- "merge"/"keep both" action) clears these, ingestion never guesses.
CREATE TABLE IF NOT EXISTS duplicate_flags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  new_question_uid TEXT NOT NULL,
  existing_question_id INTEGER NOT NULL REFERENCES questions(id),
  similarity REAL NOT NULL,
  new_text TEXT NOT NULL,
  existing_text TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','kept_both','merged','discarded_new')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES users(id),
  subject_id INTEGER NOT NULL REFERENCES subjects(id),
  kind TEXT NOT NULL CHECK(kind IN ('practice','full','challenge')) DEFAULT 'practice',
  practice_chapter_id INTEGER REFERENCES chapters(id),
  practice_sub_concept TEXT,
  duration_seconds INTEGER NOT NULL DEFAULT 1200,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS test_questions (
  test_id INTEGER NOT NULL REFERENCES tests(id),
  question_id INTEGER NOT NULL REFERENCES questions(id),
  order_index INTEGER NOT NULL,
  PRIMARY KEY (test_id, question_id)
);

-- answers_json is the RAW client submission, kept only for audit/debugging.
-- It is NEVER read back to determine correctness or score — see scoring.js's
-- gradeSubmission(), which always recomputes correctness from questions.correct
-- / parts_json in the database. This is the "no client-side score
-- manipulation" guarantee the founder explicitly asked to have verified.
CREATE TABLE IF NOT EXISTS attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id INTEGER NOT NULL REFERENCES tests(id),
  student_id INTEGER NOT NULL REFERENCES users(id),
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  submitted_at TEXT,
  score REAL,
  max_score REAL,
  time_exceeded_seconds INTEGER,
  answers_json TEXT
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES users(id),
  plan TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('active','expired','cancelled')) DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Free-form details_json keeps this table stable — logging a new kind of
-- event only ever needs a new event_type string, never a schema change.
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id INTEGER,
  student_id INTEGER,
  details_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

// Additive migration for a DB file created before the continuous-ingestion
// columns existed — never drops or rewrites existing data, only adds
// columns that are missing. Safe to run on every startup.
const existingQuestionCols = new Set(db.prepare("PRAGMA table_info(questions)").all().map((c) => c.name));
for (const [col, ddl] of [
  ['question_uid', 'ALTER TABLE questions ADD COLUMN question_uid TEXT'],
  ['normalized_text', 'ALTER TABLE questions ADD COLUMN normalized_text TEXT'],
  ['explanation', 'ALTER TABLE questions ADD COLUMN explanation TEXT'],
  ['source_page', 'ALTER TABLE questions ADD COLUMN source_page TEXT'],
  ['source_question_number', 'ALTER TABLE questions ADD COLUMN source_question_number TEXT'],
  ['answer_key_ref', 'ALTER TABLE questions ADD COLUMN answer_key_ref TEXT'],
  ['question_type', 'ALTER TABLE questions ADD COLUMN question_type TEXT'],
  ['source_section', 'ALTER TABLE questions ADD COLUMN source_section TEXT'],
  ["answer_status", "ALTER TABLE questions ADD COLUMN answer_status TEXT NOT NULL DEFAULT 'source_provided'"],
  ['question_format', 'ALTER TABLE questions ADD COLUMN question_format TEXT'],
  ['source_document_id', 'ALTER TABLE questions ADD COLUMN source_document_id INTEGER REFERENCES source_documents(id)'],
  // Founder requirement 2026-09-17 (see visual_assets table comment above):
  // a THIRD independent axis alongside status/answer_status. Never defaults
  // to "clean" — 'needs_visual_review' is the default precisely so nothing
  // already in the bank is silently assumed diagram-complete just because
  // this column now exists. Allowed values (enforced in ingest.js, not a
  // CHECK constraint, so adding this column never needs a table rebuild):
  //   not_applicable            = independently confirmed the source
  //                               question has no diagram/figure/table-image
  //   source_diagram_preserved = it has one, and >=1 row in visual_assets
  //                               links this question to the actual
  //                               original source visual
  //   needs_visual_review       = not yet audited one way or the other
  //                               (the default for every pre-existing row)
  //   ai_generated_pending      = an AI-authored (not source-derived)
  //                               question that will need an
  //                               AI-constructed diagram, not yet made
  //   adapted_verified          = (Workstream 3B, 2026-09-25 — additive,
  //                               added to ingest.js's VALID_DIAGRAM_STATUSES
  //                               and schema.sql's CHECK; no ALTER needed
  //                               here since this column has never had a
  //                               CHECK constraint in SQLite) a real
  //                               asset_type='ai_generated' visual_assets row
  //                               is linked AND a documented visual-QA
  //                               comparison against the source has passed —
  //                               see docs/workstream-3b-3070-generated-
  //                               visual-provenance-and-qa.md. Deliberately
  //                               distinct from source_diagram_preserved
  //                               (which only says the ORIGINAL is linked
  //                               for provenance) and from ai_generated_
  //                               pending (which explicitly says *pending*).
  //                               Never set merely because a generated file
  //                               exists on disk.
  ['diagram_status', "ALTER TABLE questions ADD COLUMN diagram_status TEXT NOT NULL DEFAULT 'needs_visual_review'"],
]) {
  if (!existingQuestionCols.has(col)) db.exec(ddl);
}

// Additive migration (2026-09-22, Phase 2 real-data integration): a genuine
// per-answer autosave/resume mechanism. `answers_json` on this table is
// deliberately left untouched — it is documented above as the FINAL,
// audit-only submission written once at grading time, and scoring.js's
// gradeSubmission() never reads it back for correctness. `draft_answers_json`
// is a separate column for the IN-PROGRESS attempt: the frontend saves to it
// as the student answers each question, and it is read back on resume so a
// refresh or a real "Continue where you left off" doesn't lose selections.
// It carries no scoring authority whatsoever — submit still always recomputes
// from the client's in-memory answers at submit time, same as before this
// migration; this column only ever feeds the UI back its own draft.
const existingAttemptCols = new Set(db.prepare("PRAGMA table_info(attempts)").all().map((c) => c.name));
for (const [col, ddl] of [
  ['draft_answers_json', 'ALTER TABLE attempts ADD COLUMN draft_answers_json TEXT'],
  ['draft_saved_at', 'ALTER TABLE attempts ADD COLUMN draft_saved_at TEXT'],
  // Additive migration (2026-09-22, Phase 4: immediate answer feedback).
  // Separate from draft_answers_json on purpose: a draft is just a display
  // convenience the student can still change; a LOCKED answer has already
  // been graded and shown to the student via POST /api/attempts/:id/check,
  // so scoring.js's gradeSubmission() treats it as final for that question
  // and ignores whatever the client's final submit payload says for that
  // same key — see scoring.js's own comment on gradeSubmission for why.
  ['locked_answers_json', 'ALTER TABLE attempts ADD COLUMN locked_answers_json TEXT'],
]) {
  if (!existingAttemptCols.has(col)) db.exec(ddl);
}

// Additive migration (2026-09-22, Phase 4: improvement-test loop). Records
// that a test was generated as a targeted "Improve My Score" follow-up to a
// specific earlier attempt, so results can show a real, directly-linked
// before/after comparison instead of the more general chapter-history
// `vsOriginal` (retest.js), which stays exactly as it was for ordinary
// practice sets. No CHECK constraint change needed — `kind` stays
// 'practice' for these (see practice.js's generateImprovementTest), this is
// purely additive provenance.
const existingTestCols = new Set(db.prepare("PRAGMA table_info(tests)").all().map((c) => c.name));
if (!existingTestCols.has('improves_attempt_id')) {
  db.exec('ALTER TABLE tests ADD COLUMN improves_attempt_id INTEGER REFERENCES attempts(id)');
}

// Additive migration (2026-09-22, Phase 5: Practice vs Board Simulation).
// Deliberately a NEW, separate column rather than overloading `kind` —
// `kind` already means "how were these questions selected" (practice =
// chapter/sub-concept scoped, full = whole-subject, and generateImprovementTest
// reuses 'practice' for its DB row even though it is not the same experience
// as a chapter practice set). `feedback_mode` instead answers a completely
// different, product-level question: "does this test reveal correctness
// per-question as the student goes, or only at the end?" Values:
//   'immediate' — Practice/Learning Test. Google-quiz-style ✓/✕ + explanation
//                 per question, via POST /api/attempts/:id/check.
//   'deferred'  — Board Simulation / Assessment. No per-question feedback at
//                 all; every answer is a plain draft until final submit, at
//                 which point (and only then) the real results/explanation
//                 experience appears — same as it always has.
// Default 'immediate' preserves the exact behavior every existing test row
// already had before this migration (Phase 4 shipped immediate feedback as
// the only mode) — this migration changes no scoring, no existing data, and
// no existing row's behavior; it only lets NEW tests opt into 'deferred'.
if (!existingTestCols.has('feedback_mode')) {
  db.exec("ALTER TABLE tests ADD COLUMN feedback_mode TEXT NOT NULL DEFAULT 'immediate'");
}

// SQLite can't ALTER a CHECK constraint in place, so a DB file created before
// 'needs_review' existed still has the old constraint baked into the table's
// stored schema even after the CREATE TABLE IF NOT EXISTS above (which only
// runs for a brand-new file). Detect that case by looking at the table's own
// stored SQL, and if it's missing 'needs_review', rebuild the table with the
// new constraint via the standard SQLite pattern: create the new shape,
// copy every row across unchanged (ids preserved, so test_questions/
// duplicate_flags foreign keys stay valid), drop the old table, rename the
// new one into place. Every existing row's data and id survive untouched —
// this only widens what a FUTURE row's status is allowed to be.
const questionsTableSql = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='questions'").get();
if (questionsTableSql && !questionsTableSql.sql.includes('needs_review')) {
  db.exec('PRAGMA foreign_keys = OFF;');
  db.exec('BEGIN TRANSACTION;');
  try {
    db.exec(`
      CREATE TABLE questions_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_uid TEXT UNIQUE,
        chapter_id INTEGER NOT NULL REFERENCES chapters(id),
        kind TEXT NOT NULL CHECK(kind IN ('mcq','case')) DEFAULT 'mcq',
        sub_concept TEXT,
        difficulty TEXT NOT NULL CHECK(difficulty IN ('Easy','Medium','Hard')) DEFAULT 'Medium',
        status TEXT NOT NULL CHECK(status IN ('draft','transcribed','needs_review','verified','qa_passed','published')) DEFAULT 'draft',
        marks INTEGER NOT NULL DEFAULT 1,
        text TEXT NOT NULL,
        normalized_text TEXT,
        options_json TEXT,
        correct INTEGER,
        parts_json TEXT,
        explanation TEXT,
        source TEXT,
        source_page TEXT,
        source_question_number TEXT,
        answer_key_ref TEXT,
        question_type TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
    // Only copy columns that actually exist on the OLD table at rebuild time
    // (this block can in principle run on a DB that predates the provenance
    // columns too) — never assume every column below is already present.
    const oldCols = new Set(db.prepare("PRAGMA table_info(questions)").all().map((c) => c.name));
    const copyCols = ['id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'status', 'marks', 'text', 'normalized_text', 'options_json', 'correct', 'parts_json', 'explanation', 'source', 'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'created_at'].filter((c) => oldCols.has(c));
    db.exec(`INSERT INTO questions_new (${copyCols.join(', ')}) SELECT ${copyCols.join(', ')} FROM questions;`);
    db.exec('DROP TABLE questions;');
    db.exec('ALTER TABLE questions_new RENAME TO questions;');
    db.exec('COMMIT;');
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  } finally {
    db.exec('PRAGMA foreign_keys = ON;');
  }
}

// Second CHECK-constraint widening, same reasoning and same table-rebuild
// pattern as the 'needs_review' migration above (SQLite still can't ALTER a
// CHECK in place): this DB's 'kind' column was created before 'open' existed
// as a value, so a fresh 'open' row would be rejected by the OLD stored
// constraint even though the CREATE TABLE IF NOT EXISTS above (which only
// applies to a brand-new file) already allows it. Rebuild carries forward
// every column that exists on the table right now — including source_section,
// answer_status, and question_format, all added by the additive ALTERs above,
// which by this point in the file are guaranteed to already exist.
const questionsTableSql2 = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='questions'").get();
if (questionsTableSql2 && !questionsTableSql2.sql.includes("'open'")) {
  db.exec('PRAGMA foreign_keys = OFF;');
  db.exec('BEGIN TRANSACTION;');
  try {
    db.exec(`
      CREATE TABLE questions_new2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_uid TEXT UNIQUE,
        chapter_id INTEGER NOT NULL REFERENCES chapters(id),
        kind TEXT NOT NULL CHECK(kind IN ('mcq','case','open')) DEFAULT 'mcq',
        sub_concept TEXT,
        difficulty TEXT NOT NULL CHECK(difficulty IN ('Easy','Medium','Hard')) DEFAULT 'Medium',
        status TEXT NOT NULL CHECK(status IN ('draft','transcribed','needs_review','verified','qa_passed','published')) DEFAULT 'draft',
        marks INTEGER NOT NULL DEFAULT 1,
        text TEXT NOT NULL,
        normalized_text TEXT,
        options_json TEXT,
        correct INTEGER,
        parts_json TEXT,
        explanation TEXT,
        source TEXT,
        source_page TEXT,
        source_question_number TEXT,
        answer_key_ref TEXT,
        question_type TEXT,
        source_section TEXT,
        question_format TEXT,
        answer_status TEXT NOT NULL DEFAULT 'source_provided' CHECK(answer_status IN ('source_provided','unavailable','needs_review','verified')),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `);
    const oldCols2 = new Set(db.prepare("PRAGMA table_info(questions)").all().map((c) => c.name));
    const copyCols2 = ['id', 'question_uid', 'chapter_id', 'kind', 'sub_concept', 'difficulty', 'status', 'marks', 'text', 'normalized_text', 'options_json', 'correct', 'parts_json', 'explanation', 'source', 'source_page', 'source_question_number', 'answer_key_ref', 'question_type', 'source_section', 'question_format', 'answer_status', 'created_at'].filter((c) => oldCols2.has(c));
    db.exec(`INSERT INTO questions_new2 (${copyCols2.join(', ')}) SELECT ${copyCols2.join(', ')} FROM questions;`);
    db.exec('DROP TABLE questions;');
    db.exec('ALTER TABLE questions_new2 RENAME TO questions;');
    db.exec('COMMIT;');
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  } finally {
    db.exec('PRAGMA foreign_keys = ON;');
  }
}

// ---------------------------------------------------------------------------
// Phase 6A dual-engine wrapper. Everything above this point is completely
// unchanged from before Phase 6 — `db` above is still the raw, synchronous
// node:sqlite DatabaseSync instance, and every one-off script under this
// backend that does `const db = require('./db'); db.prepare(sql).get(x)`
// with no `await` (the ~90 archive-*/ingest-*/backfill-*/reclassify-*/fix-*
// scripts, seed.js, debug-dup.js, audit-publication-readiness.js — none of
// which this Phase touches, per the "never re-ingest completed sources"
// rule) keeps working byte-for-byte as before, because DB_ENGINE defaults
// to sqlite and this wrapper's get/all/run are still plain synchronous
// functions returning real values, not Promises.
//
// The only NEW thing here is that the app's 6 database-touching runtime
// files (db.js's own dispatcher aside: server.js, practice.js, readiness.js,
// diagnostics.js, content-rules.js) now write `await db.prepare(sql).get(x)`
// at every call site, to also work under the Postgres engine (db-postgres.js)
// whose get/all/run are real async functions. `await` on a plain
// synchronous value (what this file still returns) simply resolves it on
// the next microtask — so the exact same call site is correct un either
// engine, with no per-engine branching needed in the 6 runtime files
// themselves. See docs/phase-6-postgres-cutover-plan.md section 3.
// ---------------------------------------------------------------------------
function wrapStatement(rawStmt, sql) {
  const hasReturning = /\breturning\b/i.test(sql);
  return {
    get(...args) { return rawStmt.get(...args); },
    all(...args) { return rawStmt.all(...args); },
    run(...args) {
      // Mirrors db-postgres.js's run() shape: when the SQL text explicitly
      // includes RETURNING (added deliberately at the ~4 call sites that
      // need a generated id back — see server.js's register()/attempts
      // insert and practice.js's two test inserts), read the returned row
      // instead of node:sqlite's own .run() (which doesn't execute a
      // RETURNING clause's result set at all). Every other call site is
      // completely unaffected — same .run() behavior as always.
      if (hasReturning) {
        const row = rawStmt.get(...args);
        return { changes: row ? 1 : 0, lastInsertRowid: row ? row.id : undefined, rows: row ? [row] : [] };
      }
      const info = rawStmt.run(...args);
      return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
    },
  };
}

const dbApi = {
  prepare(sql) { return wrapStatement(db.prepare(sql), sql); },
  exec(sql) { return db.exec(sql); },
  // Transaction + row-locking support (Stage 6A, needed for POST
  // /api/attempts/:id/check and PATCH /api/attempts/:id/answers — see
  // server.js). node:sqlite's DatabaseSync is a single synchronous
  // connection with no real concurrent interleaving possible within one
  // process, so unlike the Postgres path there is no lost-update race to
  // actually guard against here (Phase 4's concurrency-test.js proved the
  // race is real for a POOLED, ASYNC connection — not for this engine) —
  // this still wraps the callback in a real BEGIN/COMMIT/ROLLBACK so a
  // thrown error mid-callback can't leave a half-written update, and so
  // callers can write one engine-agnostic code path instead of branching.
  async transaction(fn) {
    db.exec('BEGIN');
    try {
      const result = await fn(dbApi);
      db.exec('COMMIT');
      return result;
    } catch (err) {
      try { db.exec('ROLLBACK'); } catch { /* nothing to roll back */ }
      throw err;
    }
  },
  // Symmetric with db-postgres.js's async db.ready() (there, a real
  // connectivity check) — this engine has nothing to wait for since the
  // DatabaseSync handle above is already open synchronously by the time
  // this module finishes loading, so it resolves immediately.
  async ready() { return true; },
  // Stage 6C graceful-shutdown support (server.js's SIGTERM/SIGINT handler)
  // — symmetric with db-postgres.js's close() (there, a real pool.end()).
  // node:sqlite's DatabaseSync.close() flushes and closes the file handle
  // cleanly; harmless to skip in the rare case a process is killed hard
  // (SIGKILL), which no close() handler can ever intercept anyway.
  async close() { db.close(); },
  ENGINE: 'sqlite',
  // SQLite-specific SQL fragment for "the current timestamp" — used at the
  // 3 call sites in server.js that used to hardcode `datetime('now')`
  // directly in their SQL text (draft/lock saves, submit), so that SQL can
  // stay identical for both engines by asking db.NOW_SQL instead of
  // hardcoding either engine's syntax.
  NOW_SQL: "datetime('now')",
  // Exposed (not for scoring/diagnostics/readiness logic to ever branch on
  // -- they must stay identical regardless of which DB is behind them)
  // purely so tests and operational scripts can report/assert which
  // database is live, per the test-database-isolation spec's requirement
  // that a test run be able to print and verify "LIVE DATABASE: <path>" /
  // "TEST DATABASE: <path>".
  DB_PATH,
  LIVE_DB_PATH,
  IS_TEST_MODE,
};

return dbApi;
};
