// Phase 4 -- business-logic parity proof. Stronger than a row-count/content
// comparison: this runs the REAL, UNMODIFIED diagnostics.js/readiness.js/
// scoring.js pure functions (required directly from the application source,
// not copied or reimplemented) against data fetched from SQLite, and again
// against the identical data fetched from the migrated PostgreSQL test
// database via the compat shim, for every real student in the bank, and
// diffs every output.
//
// diagnostics.js's getStudentStepHistory() itself calls `require('./db')`
// internally (the live db, always SQLite) so it can't be pointed at
// Postgres directly without editing application code -- which this phase
// must not do. Instead, this script re-issues the EXACT SAME SQL (verbatim
// from diagnostics.js, placeholders translated ?-to-$n only) against
// Postgres, then feeds the resulting rows through the same
// grouping-and-flattening logic diagnostics.js itself uses (copied
// verbatim from getStudentStepHistory's body) before handing the resulting
// `steps` array to the REAL, application's own exported pure functions:
// scoring.flattenAll/keyFor, diagnostics.summarizeGroup/classifyStatus, and
// readiness's exported component functions.

const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const { PgCompat } = require('./pg-compat-shim');

// SAFETY (see docs/incident-2026-09-23-test-run-touched-live-db.md's "process
// fix going forward"): diagnostics.js/readiness.js both `require('./db')`
// internally as soon as they're required at all, and db.js opens whatever
// DB_PATH points to (the live database by default). Set DB_PATH to this
// phase's disposable SQLite copy BEFORE requiring anything from the backend,
// so that connection -- even though this script never calls any of
// diagnostics.js's own db-touching exports -- can never reach the live file.
process.env.DB_PATH = path.join(__dirname, 'sqlite-copy-for-migration-test.db');

const BACKEND = '/home/claude/backend';
const { flattenAll, keyFor } = require(path.join(BACKEND, 'scoring.js'));
const diagnostics = require(path.join(BACKEND, 'diagnostics.js')); // requires ./db (SQLite) internally -- only its PURE exports (summarizeGroup, classifyStatus) are used here, never its db-touching ones, against Postgres-sourced data
const readiness = require(path.join(BACKEND, 'readiness.js'));

const SQLITE_SQL = `
    SELECT a.id as attemptId, a.test_id as testId, a.submitted_at as submittedAt, a.answers_json as answersJson,
           t.subject_id as subjectId, s.name as subjectName,
           q.id as qid, q.chapter_id as chapterId, c.name as chapterName, q.sub_concept as subConcept,
           q.kind, q.difficulty, q.marks, q.options_json, q.correct, q.parts_json
    FROM attempts a
    JOIN tests t ON t.id = a.test_id
    JOIN subjects s ON s.id = t.subject_id
    JOIN test_questions tq ON tq.test_id = t.id
    JOIN questions q ON q.id = tq.question_id
    JOIN chapters c ON c.id = q.chapter_id
    WHERE a.student_id = ? AND a.submitted_at IS NOT NULL
    ORDER BY a.submitted_at ASC, a.id ASC, tq.order_index ASC`;

const PG_SQL = SQLITE_SQL.replace('?', '$1');

// Copied verbatim from diagnostics.js's getStudentStepHistory body (the
// part AFTER the SQL query runs) -- pure data transformation, no db calls,
// so reusing it here (rather than re-deriving it) is testing the real logic.
function rowsToSteps(rows) {
  const byAttempt = new Map();
  for (const r of rows) {
    if (!byAttempt.has(r.attemptId)) byAttempt.set(r.attemptId, { meta: r, questions: [] });
    byAttempt.get(r.attemptId).questions.push({
      id: r.qid, chapter_id: r.chapterId, chapter_name: r.chapterName, sub_concept: r.subConcept,
      kind: r.kind, difficulty: r.difficulty, marks: r.marks, options_json: r.optionsJson ?? r.options_json,
      correct: r.correct, parts_json: r.partsJson ?? r.parts_json,
    });
  }
  const steps = [];
  for (const { meta, questions } of byAttempt.values()) {
    const answers = meta.answersJson ? JSON.parse(meta.answersJson) : {};
    const flat = flattenAll(questions);
    for (const step of flat) {
      if (step.kind === 'open') continue;
      const submitted = answers[keyFor(step)];
      const answered = submitted != null && submitted.optionIndex != null;
      const correct = answered && Number(submitted.optionIndex) === Number(step.correct);
      steps.push({
        attemptId: meta.attemptId, testId: meta.testId, submittedAt: meta.submittedAt,
        subjectId: meta.subjectId, subjectName: meta.subjectName,
        chapterId: step.chapterId, chapterName: step.chapterName, subConcept: step.subConcept,
        questionId: step.questionId, kind: step.kind, difficulty: step.difficulty, marks: step.marks,
        correct, answered, key: keyFor(step),
      });
    }
  }
  return steps;
}

function canonicalize(x) {
  // submittedAt differs in representation (SQLite text vs Postgres TIMESTAMPTZ
  // Date-like string) by design -- normalize before comparing, same as compare-classified.js.
  return JSON.stringify(x, (k, v) => {
    if (k === 'submittedAt' && v != null) {
      const d = new Date(typeof v === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(v) ? v.replace(' ', 'T') + 'Z' : v);
      return d.toISOString();
    }
    return v;
  });
}

async function main() {
  const sqlite = new DatabaseSync(path.join(__dirname, 'sqlite-copy-for-migration-test.db'), { readOnly: true });
  const pg = new PgCompat({ host: '127.0.0.1', port: 5432, user: 'boardready_migration', password: 'test_local_only', database: 'boardready_migration_test' });
  await pg.connect();

  const studentIds = sqlite.prepare("SELECT DISTINCT student_id FROM attempts WHERE submitted_at IS NOT NULL ORDER BY student_id").all().map((r) => r.student_id);
  console.log(`Testing business-logic parity for ${studentIds.length} students with at least one submitted attempt...\n`);

  let studentsChecked = 0, stepsMismatches = 0, summaryMismatches = 0, componentMismatches = 0;
  const failures = [];

  for (const studentId of studentIds) {
    const sqliteRows = sqlite.prepare(SQLITE_SQL).all(studentId);
    const pgRowsRaw = await pg.query(PG_SQL, [studentId], {
      aliasMap: { attemptid: 'attemptId', testid: 'testId', submittedat: 'submittedAt', answersjson: 'answersJson', subjectid: 'subjectId', subjectname: 'subjectName', qid: 'qid', chapterid: 'chapterId', chaptername: 'chapterName', subconcept: 'subConcept', kind: 'kind', difficulty: 'difficulty', marks: 'marks', options_json: 'options_json', correct: 'correct', parts_json: 'parts_json' },
    });

    const sqliteSteps = rowsToSteps(sqliteRows);
    const pgSteps = rowsToSteps(pgRowsRaw);

    studentsChecked += 1;
    if (canonicalize(sqliteSteps) !== canonicalize(pgSteps)) {
      stepsMismatches += 1;
      failures.push({ studentId, kind: 'steps', sqliteCount: sqliteSteps.length, pgCount: pgSteps.length });
      continue; // no point comparing downstream summaries on already-divergent input
    }

    // Now run the REAL, unmodified pure functions on the (identical) steps.
    const sqliteSummary = diagnostics.summarizeGroup(sqliteSteps);
    const pgSummary = diagnostics.summarizeGroup(pgSteps);
    if (JSON.stringify(sqliteSummary) !== JSON.stringify(pgSummary)) {
      summaryMismatches += 1;
      failures.push({ studentId, kind: 'summarizeGroup', sqliteSummary, pgSummary });
    }

    const sqliteMastery = readiness.masteryComponent(sqliteSummary);
    const pgMastery = readiness.masteryComponent(pgSummary);
    const sqliteDifficulty = readiness.difficultyPerformanceComponent(sqliteSteps);
    const pgDifficulty = readiness.difficultyPerformanceComponent(pgSteps);
    const sqliteConsistency = readiness.consistencyComponent(sqliteSummary);
    const pgConsistency = readiness.consistencyComponent(pgSummary);
    const sqliteAdvanced = readiness.advancedQuestionPerformanceComponent(sqliteSteps);
    const pgAdvanced = readiness.advancedQuestionPerformanceComponent(pgSteps);
    if ([
      [sqliteMastery, pgMastery], [sqliteDifficulty, pgDifficulty],
      [sqliteConsistency, pgConsistency], [sqliteAdvanced, pgAdvanced],
    ].some(([a, b]) => JSON.stringify(a) !== JSON.stringify(b))) {
      componentMismatches += 1;
      failures.push({ studentId, kind: 'readiness-components', sqliteMastery, pgMastery, sqliteDifficulty, pgDifficulty, sqliteConsistency, pgConsistency, sqliteAdvanced, pgAdvanced });
    }
  }

  const result = {
    studentsChecked, stepsMismatches, summaryMismatches, componentMismatches,
    overall: (stepsMismatches + summaryMismatches + componentMismatches) === 0 ? 'ALL_STUDENTS_MATCH_EXACTLY' : 'MISMATCHES_FOUND',
    failures: failures.slice(0, 20),
    generatedAt: new Date().toISOString(),
  };
  require('node:fs').writeFileSync(path.join(__dirname, 'business-logic-parity-report.json'), JSON.stringify(result, null, 2));
  console.log(`Students checked: ${studentsChecked}`);
  console.log(`Steps mismatches: ${stepsMismatches} | summarizeGroup mismatches: ${summaryMismatches} | readiness-component mismatches: ${componentMismatches}`);
  console.log('Overall:', result.overall);

  sqlite.close();
  await pg.end();
  process.exit(result.overall === 'ALL_STUDENTS_MATCH_EXACTLY' ? 0 : 1);
}

main().catch((err) => { console.error('FAILED:', err); process.exit(1); });
