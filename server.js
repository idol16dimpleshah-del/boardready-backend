// Board Ready API — REBUILT FROM SCRATCH after a workspace reset. See
// REBUILD_NOTES.md for the full account of what's an exact restore
// (content-rules.js, readiness.js/readiness-config.js) vs. a fresh
// reconstruction (everything else: db schema, diagnostics.js, retest.js,
// practice.js, this file). Deliberately dependency-free (Node's built-in
// http + node:sqlite only) so it runs anywhere without an npm install step.

const http = require('node:http');
const { URL } = require('node:url');
const fs = require('node:fs');
const path = require('node:path');
const config = require('./config');
const db = require('./db');
const auth = require('./auth');
const rateLimit = require('./rate-limit');
const { applyBaselineHeaders, applyCors } = require('./security-headers');
const scoring = require('./scoring');
const diagnostics = require('./diagnostics');
const diagConfig = require('./diagnostics-config');
const retest = require('./retest');
const practice = require('./practice');
const readiness = require('./readiness');
const { GRADABLE_STATUSES } = require('./content-rules');

const PORT = config.PORT;

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const PLAN_PRICES_PAISE = { 'all-subject': 99900, 'single-subject': 49900 };

// Phase 6A (docs/phase-6-postgres-cutover-plan.md): both async + awaited at
// every call site — see content-rules.js's resolveChapterIds comment for
// why this is safe and behavior-preserving under both DB_ENGINE=sqlite and
// DB_ENGINE=postgres.
async function hasActiveAccess(studentId, subjectId) {
  const row = await db.prepare(
    `SELECT 1 FROM subscriptions WHERE student_id = ? AND status = 'active' AND (plan = 'all-subject' OR plan = ?) LIMIT 1`
  ).get(studentId, `subject-${subjectId}`);
  return !!row;
}

async function logEvent(eventType, entityType, entityId, studentId, details) {
  await db.prepare('INSERT INTO audit_log (event_type, entity_type, entity_id, student_id, details_json) VALUES (?, ?, ?, ?, ?)')
    .run(eventType, entityType ?? null, entityId ?? null, studentId ?? null, details ? JSON.stringify(details) : null);
}

// Phase 6A: the manual `.replace(' ', 'T') + 'Z'` timestamp-parsing hack
// this file used to do inline (removed below, at its one call site in
// /api/attempts/:id/submit) only worked for SQLite's TEXT-formatted
// timestamps ("YYYY-MM-DD HH:MM:SS"). Under DB_ENGINE=postgres, a
// TIMESTAMPTZ column comes back from the `pg` driver as a real JS Date
// object already — this helper accepts either shape uniformly.
function parseDbTimestamp(value) {
  return value instanceof Date ? value : new Date(String(value).replace(' ', 'T') + 'Z');
}

// ---------------------------------------------------------------------------
// Tiny router — path params via ':name' segments, JSON body parsing, and a
// single error boundary that turns thrown HttpError (or any error) into a
// JSON response instead of a raw stack trace.
// ---------------------------------------------------------------------------
const routes = [];
function register(method, pattern, handler) {
  const paramNames = [];
  const regex = new RegExp('^' + pattern.replace(/:[a-zA-Z]+/g, (m) => { paramNames.push(m.slice(1)); return '([^/]+)'; }) + '$');
  routes.push({ method, regex, paramNames, handler });
}
const get = (pattern, handler) => register('GET', pattern, handler);
const post = (pattern, handler) => register('POST', pattern, handler);
const patch = (pattern, handler) => register('PATCH', pattern, handler);

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; if (raw.length > 2_000_000) req.destroy(); });
    req.on('end', () => {
      if (!raw) return resolve({});
      try { resolve(JSON.parse(raw)); } catch { reject(new HttpError(400, 'Invalid JSON body')); }
    });
    req.on('error', reject);
  });
}

// 2026-09-24 (Phase 5 security hardening — see
// docs/phase-5-security-audit-report.md, item 8): shared input-validation
// helpers. These fix two real gaps: (1) a missing/non-string password or
// email used to reach crypto.scryptSync directly and throw a raw Node
// internal TypeError (see the generic-500 fix above for what that looked
// like to a client before both fixes existed); (2) an absurdly long
// password is a real amplification of scryptSync's deliberate slowness —
// bounding length here is a genuine DoS mitigation, not a product opinion
// about password strength (this project explicitly does NOT add a minimum-
// strength requirement — that's flagged in the audit as a conscious product
// decision, not a security bug).
const MAX_LENGTHS = { name: 200, email: 320, password: 256 };

function isNonEmptyString(v, maxLength) {
  return typeof v === 'string' && v.length > 0 && (!maxLength || v.length <= maxLength);
}

// Validates a value that's expected to be (or coerce cleanly to) a positive
// integer — used for every numeric id/count param that used to be a bare
// `Number(x)` with no check, which silently produced NaN on bad input
// instead of a clean 400. Never changes behavior for actually-valid input.
function requirePositiveInt(value, label) {
  const n = Number(value);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n <= 0) {
    throw new HttpError(400, `${label} must be a positive integer`);
  }
  return n;
}

// Best-effort client identifier for rate limiting — the raw socket address.
// No X-Forwarded-For trust logic: this app isn't yet behind a proxy/load
// balancer, and trusting a client-supplied header for rate-limit keying
// would let an attacker simply rotate the header value to bypass the limit
// entirely. Revisit if/when a trusted reverse proxy is introduced.
function clientIp(req) {
  return req.socket && req.socket.remoteAddress || 'unknown';
}

// 2026-09-24 (Phase 5 security hardening — see
// docs/phase-5-security-audit-report.md, item 3): login/register have no
// throttling today, and scryptSync is deliberately slow, so this is both a
// brute-force vector and a CPU-exhaustion vector. Throws a safe 429 HttpError
// when a client (by IP) has exceeded the allowed attempts in the current
// window; callers just call this once at the top of the handler.
function enforceRateLimit(req, routeKey, opts) {
  const key = `${routeKey}:${clientIp(req)}`;
  const result = rateLimit.checkAndRecord(key, opts);
  if (!result.allowed) {
    const retryAfterSeconds = Math.ceil(result.retryAfterMs / 1000);
    const err = new HttpError(429, `Too many attempts. Try again in ${retryAfterSeconds} second(s).`);
    err.retryAfterSeconds = retryAfterSeconds;
    throw err;
  }
}

function requireAuth(req, allowedRoles) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  const payload = auth.verify(token);
  if (!payload) throw new HttpError(401, 'Not authenticated');
  if (allowedRoles && !allowedRoles.includes(payload.role)) throw new HttpError(403, 'Not authorized for this action');
  return { id: payload.userId, role: payload.role };
}

// ---------------------------------------------------------------------------
// HEALTH CHECK (Stage 6C, docs/phase-6-postgres-cutover-plan.md — flagged
// there as one of the few genuinely new, small pieces this stage needs).
// Deliberately unauthenticated and rate-limit-exempt (a hosting platform's
// health checker has no token and may poll frequently) and deliberately a
// REAL check, not a static 200 — it round-trips the actual configured
// database engine via db.ready() (a no-op resolve under SQLite, a real
// `SELECT 1` under Postgres), so a genuinely unreachable database fails the
// health check and the platform can act on that (e.g. hold a deploy back,
// restart the instance) instead of reporting healthy while every real
// request 500s. Never exposes connection strings/credentials — only the
// engine name and a boolean.
// ---------------------------------------------------------------------------
get('/api/health', async (req, res) => {
  try {
    await db.ready();
    sendJson(res, 200, { status: 'ok', engine: db.ENGINE, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[health] database check failed:', err);
    sendJson(res, 503, { status: 'unavailable', engine: db.ENGINE, error: 'Database connectivity check failed' });
  }
});

// ---------------------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------------------
post('/api/auth/register', async (req, res) => {
  enforceRateLimit(req, 'register', { windowMs: 15 * 60 * 1000, maxAttempts: 10 });
  const body = await readBody(req);
  const { name, email, password, role } = body;
  if (!isNonEmptyString(name, MAX_LENGTHS.name) || !isNonEmptyString(email, MAX_LENGTHS.email)
    || !isNonEmptyString(password, MAX_LENGTHS.password) || !['student', 'teacher'].includes(role)) {
    throw new HttpError(400, `name (<=${MAX_LENGTHS.name} chars), email (<=${MAX_LENGTHS.email} chars), password (<=${MAX_LENGTHS.password} chars) and role (student|teacher) are required`);
  }
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) throw new HttpError(409, 'An account with this email already exists');
  const passwordHash = auth.hashPassword(password);
  const info = await db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?) RETURNING id').run(name, email, passwordHash, role);
  const userId = Number(info.lastInsertRowid);
  const token = auth.sign({ userId, role });
  sendJson(res, 201, { token, user: { id: userId, name, email, role } });
});

post('/api/auth/login', async (req, res) => {
  enforceRateLimit(req, 'login', { windowMs: 15 * 60 * 1000, maxAttempts: 10 });
  const body = await readBody(req);
  const { email, password } = body;
  if (!isNonEmptyString(email, MAX_LENGTHS.email) || !isNonEmptyString(password, MAX_LENGTHS.password)) {
    throw new HttpError(400, 'email and password are required');
  }
  const user = await db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !auth.verifyPassword(password, user.password_hash)) throw new HttpError(401, 'Invalid email or password');
  const token = auth.sign({ userId: user.id, role: user.role });
  sendJson(res, 200, { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// ---------------------------------------------------------------------------
// CONTENT (subjects / chapters)
// ---------------------------------------------------------------------------
// Public — the login/landing screen shows board chips (CBSE/ICSE) before
// anyone has signed in, and this also doubles as the cheapest possible
// health-check endpoint (no token needed to confirm the API is up).
get('/api/subjects', async (req, res, params, query) => {
  const rows = query.board
    ? await db.prepare('SELECT * FROM subjects WHERE board = ? ORDER BY name').all(query.board)
    : await db.prepare('SELECT * FROM subjects ORDER BY board, name').all();
  sendJson(res, 200, { subjects: rows });
});

get('/api/chapters', async (req, res, params, query) => {
  requireAuth(req, ['student', 'teacher']);
  if (!query.subject_id) throw new HttpError(400, 'subject_id is required');
  const rows = await db.prepare('SELECT * FROM chapters WHERE subject_id = ? ORDER BY order_index, name').all(requirePositiveInt(query.subject_id, 'subject_id'));
  sendJson(res, 200, { chapters: rows });
});

// ---------------------------------------------------------------------------
// FRONTEND-ADDITIVE ENDPOINT (Agent B / frontend track — flagged explicitly
// per the founder's rule that any new endpoint must be called out, not
// silently added): a pure, read-only aggregate COUNT over subjects/chapters/
// questions already governed by GRADABLE_STATUSES (content-rules.js). Public,
// like /api/subjects, so the logged-out landing screen can show real bank
// size numbers instead of the design mock's hardcoded "1,839 Questions".
// Does not touch, duplicate, or re-implement any scoring/diagnostics logic.
// ---------------------------------------------------------------------------
get('/api/content/summary', async (req, res) => {
  const gradablePlaceholders = GRADABLE_STATUSES.map(() => '?').join(',');
  // Phase 6A: camelCase aliases double-quoted (Postgres would otherwise
  // lowercase-fold them, breaking every r.subjectCount/etc read below —
  // see diagnostics.js's getStudentStepHistory comment); each COUNT(...) is
  // also explicitly coerced with Number(...) right after the query, since
  // Postgres's `pg` driver returns a bigint COUNT() as a JS string, and
  // `acc.subjects + r.subjectCount` would silently string-concatenate
  // instead of add the first time a string ever appeared in that reduce.
  const rawRows = await db.prepare(`
    SELECT s.board as board, COUNT(DISTINCT s.id) as "subjectCount", COUNT(DISTINCT c.id) as "chapterCount",
           COUNT(q.id) as "questionCount"
    FROM subjects s
    LEFT JOIN chapters c ON c.subject_id = s.id
    LEFT JOIN questions q ON q.chapter_id = c.id AND q.status IN (${gradablePlaceholders})
    GROUP BY s.board
    ORDER BY s.board`).all(...GRADABLE_STATUSES);
  const rows = rawRows.map((r) => ({
    board: r.board, subjectCount: Number(r.subjectCount), chapterCount: Number(r.chapterCount), questionCount: Number(r.questionCount),
  }));
  const totals = rows.reduce((acc, r) => ({
    subjects: acc.subjects + r.subjectCount, chapters: acc.chapters + r.chapterCount, questions: acc.questions + r.questionCount,
  }), { subjects: 0, chapters: 0, questions: 0 });
  sendJson(res, 200, { byBoard: rows, totals });
});

// ---------------------------------------------------------------------------
// TEST ASSEMBLY — practice sets and full tests. Only ever built from
// GRADABLE_STATUSES content (content-rules.js) so a 'transcribed', not yet
// verified batch (like a newly-ingested chapter) can sit in the bank without
// being served to a real student before it's checked.
// ---------------------------------------------------------------------------
post('/api/practice/generate', async (req, res) => {
  const user = requireAuth(req, ['student']);
  const body = await readBody(req);
  const { subjectId, chapterId, subConcept, count } = body;
  if (!subjectId) throw new HttpError(400, 'subjectId is required');
  const result = await practice.generate({ studentId: user.id, subjectId: requirePositiveInt(subjectId, 'subjectId'), chapterId: chapterId ? requirePositiveInt(chapterId, 'chapterId') : null, subConcept: subConcept || null, count: count ? requirePositiveInt(count, 'count') : 10, kind: 'practice', feedbackMode: 'immediate' });
  sendJson(res, 201, result);
});

post('/api/tests/generate', async (req, res) => {
  const user = requireAuth(req, ['student']);
  const body = await readBody(req);
  const { subjectId, count } = body;
  if (!subjectId) throw new HttpError(400, 'subjectId is required');
  // feedbackMode: 'deferred' (2026-09-22, Phase 5) — a full-subject test is
  // the Board Simulation / Assessment experience: no per-question ✓/✕, a
  // genuine independent score, full explanations only after final submit.
  const result = await practice.generate({ studentId: user.id, subjectId: requirePositiveInt(subjectId, 'subjectId'), chapterId: null, subConcept: null, count: count ? requirePositiveInt(count, 'count') : 20, kind: 'full', feedbackMode: 'deferred' });
  sendJson(res, 201, result);
});

// "Improve My Score" (2026-09-22, Phase 4) — generates a real, separate
// targeted test from one specific finished attempt's actual wrong answers.
// See practice.js's generateImprovementTest for the real selection logic
// (weak sub-concepts -> weak chapters -> excludes every question already
// seen in the source attempt). This never touches the source attempt itself.
post('/api/tests/improve', async (req, res) => {
  const user = requireAuth(req, ['student']);
  const body = await readBody(req);
  const { sourceAttemptId, count } = body;
  if (!sourceAttemptId) throw new HttpError(400, 'sourceAttemptId is required');
  const result = await practice.generateImprovementTest({ studentId: user.id, sourceAttemptId: requirePositiveInt(sourceAttemptId, 'sourceAttemptId'), count: count ? requirePositiveInt(count, 'count') : 12 });
  sendJson(res, 201, result);
});

function publicStepView(step, index) {
  // Never send the answer key to the client before it's submitted. Also
  // strips `explanation` (added to steps 2026-09-22 for the post-submit
  // results screen) — several explanations in this bank spell out the
  // correct option directly (e.g. "Source answer key states option B...");
  // sending that pre-test would be the same leak as sending `correct`
  // itself. It's re-attached explicitly, and only, in the /submit response.
  const { correct, explanation, ...rest } = step;
  return { ...rest, index };
}

post('/api/attempts', async (req, res) => {
  const user = requireAuth(req, ['student']);
  const body = await readBody(req);
  const { test_id } = body;
  const test = await db.prepare('SELECT * FROM tests WHERE id = ?').get(requirePositiveInt(test_id, 'test_id'));
  if (!test) throw new HttpError(404, 'Test not found');
  if (test.student_id !== user.id) throw new HttpError(403, 'This test does not belong to you');
  const already = await db.prepare('SELECT * FROM attempts WHERE test_id = ? AND submitted_at IS NULL').get(test.id);
  if (already) {
    return sendJson(res, 200, { id: already.id, testId: test.id, startedAt: already.started_at, durationSeconds: test.duration_seconds });
  }
  const info = await db.prepare('INSERT INTO attempts (test_id, student_id) VALUES (?, ?) RETURNING id').run(test.id, user.id);
  const attemptId = Number(info.lastInsertRowid);
  const started = (await db.prepare('SELECT started_at FROM attempts WHERE id = ?').get(attemptId)).started_at;
  sendJson(res, 201, { id: attemptId, testId: test.id, startedAt: started, durationSeconds: test.duration_seconds });
});

// Diagram wiring (Workstream 3B, 2026-09-25): attaches a servable diagram
// URL to each question row, when one genuinely exists. Deliberately
// conservative in two independent ways, either of which alone would be
// enough to prevent the exact defect docs/content-qa-readiness-report.md
// documented (a whole, un-cropped source page served as if it were a
// single question's diagram):
//   1. asset_type must be 'source_cropped' or 'ai_generated' — never
//      'source_page_full', which is what every visual_assets row in this
//      database is today (see docs/workstream-3b-visual-extraction-test-
//      case-3070.md — zero source_cropped rows exist yet, so this function
//      returns nothing extra for any question until one is deliberately
//      created and associated).
//   2. asset_path must start with 'extracted-diagrams/' — the one
//      directory server.js already serves per-question crops from (see
//      tryServeExtractedDiagram below); a row whose path points anywhere
//      else (e.g. still at a raw source_library/ PDF) is never turned into
//      a URL, regardless of what asset_type claims.
//   3. When a question has both kinds of row, 'ai_generated' — the clean,
//      professionally redrawn Board Ready visual — wins over
//      'source_cropped' — the immutable original-pixels reference crop
//      (Workstream 3B pivot, 2026-09-25: students should default to seeing
//      a purpose-built diagram, not a raw textbook-page crop; the source
//      crop still exists in the DB/asset store for provenance and audit,
//      it's just not what gets served here when a generated alternative is
//      available). The ORDER BY below puts ai_generated rows first so the
//      "first wins" logic in the loop picks one over a source_cropped row
//      for the same question; ties within a type still fall back to id ASC.
// Read-only (SELECT only) against whichever database connection is passed
// in — the live boardready.db when the real server runs, or an isolated
// test/staging database when a test provisions one.
async function getServableDiagramUrls(questionIds, database) {
  const map = new Map();
  if (!questionIds.length) return map;
  const placeholders = questionIds.map(() => '?').join(',');
  const assets = await database.prepare(`
    SELECT question_id, asset_path FROM visual_assets
    WHERE question_id IN (${placeholders}) AND asset_type IN ('source_cropped', 'ai_generated')
    ORDER BY CASE asset_type WHEN 'ai_generated' THEN 0 WHEN 'source_cropped' THEN 1 ELSE 2 END ASC, id ASC
  `).all(...questionIds);
  for (const a of assets) {
    if (map.has(a.question_id)) continue; // first row wins per question — ai_generated first per the ORDER BY above, so it's preferred over source_cropped when both exist
    if (typeof a.asset_path !== 'string' || !a.asset_path.startsWith('extracted-diagrams/')) continue;
    map.set(a.question_id, '/' + a.asset_path);
  }
  return map;
}

async function loadQuestionsForTest(testId, database = db) {
  const rows = await database.prepare(`
    SELECT q.*, c.name as chapter_name FROM test_questions tq
    JOIN questions q ON q.id = tq.question_id
    JOIN chapters c ON c.id = q.chapter_id
    WHERE tq.test_id = ? ORDER BY tq.order_index`).all(testId);
  const diagramUrls = await getServableDiagramUrls(rows.map((r) => r.id), database);
  return rows.map((r) => ({ ...r, diagram_url: diagramUrls.get(r.id) ?? null }));
}

get('/api/attempts/:id/questions', async (req, res, params) => {
  const user = requireAuth(req, ['student']);
  const attempt = await db.prepare('SELECT * FROM attempts WHERE id = ?').get(requirePositiveInt(params.id, 'id'));
  if (!attempt) throw new HttpError(404, 'Attempt not found');
  if (attempt.student_id !== user.id) throw new HttpError(403, 'Not your attempt');
  // feedbackMode (2026-09-22, Phase 5) tells the frontend whether this is a
  // Practice/Learning Test (immediate ✓/✕ per question) or a Board
  // Simulation/Assessment (no per-question feedback at all) — read from the
  // test row so it's correct on both a fresh start AND a resumed attempt.
  const test = await db.prepare('SELECT feedback_mode FROM tests WHERE id = ?').get(attempt.test_id);
  const feedbackMode = test ? test.feedback_mode : 'immediate';
  const questions = await loadQuestionsForTest(attempt.test_id);
  const steps = scoring.flattenAll(questions);
  // Real per-answer resume (2026-09-22): hand back whatever draft the
  // student had saved for this attempt (empty object for a fresh attempt,
  // or one that predates this feature) so the frontend can restore exactly
  // what was selected before a refresh or a "Continue where you left off",
  // instead of always starting from a blank answer set.
  let draftAnswers = {};
  if (attempt.draft_answers_json) {
    try { draftAnswers = JSON.parse(attempt.draft_answers_json); } catch { draftAnswers = {}; }
  }
  // checkedAnswers (2026-09-22, Phase 4): full reveal — optionIndex,
  // correct, correctOptionIndex, explanation — for every step already
  // locked via POST /api/attempts/:id/check. Safe to send in full despite
  // this being the same pre-submit endpoint that deliberately withholds the
  // answer key elsewhere (publicStepView strips correct/explanation from
  // `steps`): a locked step's answer was already shown to THIS student live,
  // the moment they answered it — resume/refresh restoring that same
  // already-seen feedback isn't a new leak, it's just not re-hiding
  // something real. Only ever includes keys the student has personally
  // locked in this attempt.
  let lockedAnswers = {};
  if (attempt.locked_answers_json) {
    try { lockedAnswers = JSON.parse(attempt.locked_answers_json); } catch { lockedAnswers = {}; }
  }
  const stepsByKey = new Map(steps.map((s) => [scoring.keyFor(s), s]));
  const checkedAnswers = {};
  for (const [key, lock] of Object.entries(lockedAnswers)) {
    const step = stepsByKey.get(key);
    if (!step) continue;
    checkedAnswers[key] = { optionIndex: lock.optionIndex, correct: Number(lock.optionIndex) === Number(step.correct), correctOptionIndex: step.correct, explanation: step.explanation ?? null };
  }
  sendJson(res, 200, { attemptId: attempt.id, steps: steps.map(publicStepView), draftAnswers, checkedAnswers, feedbackMode });
});

// ---------------------------------------------------------------------------
// REAL AUTOSAVE (2026-09-22, Phase 2 real-data integration): persists the
// student's in-progress answer selections so they survive a refresh or a
// resumed session. This does NOT change the scoring guarantee in scoring.js
// — draft_answers_json is never read by gradeSubmission(); it exists only to
// be read back by THIS SAME student, via the /questions endpoint above, to
// repaint the test screen. Merges (doesn't replace) so a partial/late save
// can't clobber earlier answers saved from a different question on the page.
// ---------------------------------------------------------------------------
patch('/api/attempts/:id/answers', async (req, res, params) => {
  const user = requireAuth(req, ['student']);
  const body = await readBody(req);
  const attemptId = requirePositiveInt(params.id, 'id');
  if (!body.answers || typeof body.answers !== 'object') throw new HttpError(400, 'answers object is required');

  // Phase 6A: wrapped in a transaction with a row lock on this attempt
  // (SELECT ... FOR UPDATE under Postgres; SQLite has no real interleaving
  // to guard against — see db-sqlite.js's transaction() comment). Without
  // this, two concurrent autosave calls for the same attempt (e.g. a
  // student answering two questions in quick succession, each firing its
  // own PATCH) could both read the same `existing` draft, merge their own
  // answer in, and write back — the second write racing the first would
  // silently drop whichever answer's merge lost the race, exactly the
  // class of lost-update bug Phase 4's concurrency-test.js proved matters
  // once requests can genuinely interleave (a real risk under a pooled,
  // async Postgres connection; not one node:sqlite's single synchronous
  // connection could ever exhibit).
  const merged = await db.transaction(async (txDb) => {
    const attempt = await txDb.prepare(`SELECT * FROM attempts WHERE id = ?${txDb.ENGINE === 'postgres' ? ' FOR UPDATE' : ''}`).get(attemptId);
    if (!attempt) throw new HttpError(404, 'Attempt not found');
    if (attempt.student_id !== user.id) throw new HttpError(403, 'Not your attempt');
    if (attempt.submitted_at) throw new HttpError(409, 'This attempt was already submitted');

    let existing = {};
    if (attempt.draft_answers_json) {
      try { existing = JSON.parse(attempt.draft_answers_json); } catch { existing = {}; }
    }
    // Once a key is locked (checked — see POST /:id/check below) it's no
    // longer editable via plain autosave; drop it from this write rather
    // than letting a stray save silently change what's displayed for an
    // already-graded-and-shown question. Defense in depth — the frontend
    // disables the input for a checked question, so this shouldn't
    // normally be reachable, but the server doesn't rely on the client to
    // enforce it.
    let locked = {};
    if (attempt.locked_answers_json) {
      try { locked = JSON.parse(attempt.locked_answers_json); } catch { locked = {}; }
    }
    const incoming = { ...body.answers };
    for (const key of Object.keys(locked)) delete incoming[key];
    const mergedAnswers = { ...existing, ...incoming };
    await txDb.prepare(`UPDATE attempts SET draft_answers_json = ?, draft_saved_at = ${txDb.NOW_SQL} WHERE id = ?`)
      .run(JSON.stringify(mergedAnswers), attempt.id);
    return mergedAnswers;
  });
  sendJson(res, 200, { savedCount: Object.keys(merged).length, savedAt: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// REAL-TIME ANSWER CHECK (2026-09-22, Phase 4: immediate answer feedback).
// Grades ONE step immediately — never the whole test's answer key — and
// LOCKS that answer as final for scoring (see scoring.js's gradeSubmission
// comment on `lockedAnswers` for exactly why: without this, a student could
// see the correct answer here, then quietly submit a different, "corrected"
// answer at the end). Idempotent: re-checking an already-locked key just
// returns the original verdict rather than re-grading a new pick, so a
// double-click or a resumed session can't relock a different answer.
// ---------------------------------------------------------------------------
post('/api/attempts/:id/check', async (req, res, params) => {
  const user = requireAuth(req, ['student']);
  const body = await readBody(req);
  const attemptId = requirePositiveInt(params.id, 'id');
  const { key, answer } = body;
  if (!key || !answer || answer.optionIndex == null) throw new HttpError(400, 'key and answer.optionIndex are required');

  // Phase 6A: transaction + row lock (SELECT ... FOR UPDATE under Postgres)
  // around the whole read-decide-write sequence — this is the exact
  // scenario Phase 4's concurrency-test.js was built to prove matters (two
  // /check calls for two different questions in the same attempt, fired in
  // quick succession, must not let one overwrite the other's freshly-locked
  // answer in locked_answers_json). See the /answers handler above for the
  // fuller explanation of why SQLite never needed this but Postgres does.
  const result = await db.transaction(async (txDb) => {
    const attempt = await txDb.prepare(`SELECT * FROM attempts WHERE id = ?${txDb.ENGINE === 'postgres' ? ' FOR UPDATE' : ''}`).get(attemptId);
    if (!attempt) throw new HttpError(404, 'Attempt not found');
    if (attempt.student_id !== user.id) throw new HttpError(403, 'Not your attempt');
    if (attempt.submitted_at) throw new HttpError(409, 'This attempt was already submitted');
    // Server-side enforcement of Practice vs Board Simulation (2026-09-22,
    // Phase 5) — never rely on the frontend simply not calling this
    // endpoint. A Board Simulation/Assessment test (feedback_mode='deferred')
    // must produce a genuine, independent score; a savvy client calling
    // /check directly on one would be exactly the "immediate confirmation
    // on every question" problem this whole mode split exists to prevent.
    const test = await txDb.prepare('SELECT feedback_mode FROM tests WHERE id = ?').get(attempt.test_id);
    if (!test || test.feedback_mode !== 'immediate') {
      throw new HttpError(403, 'Immediate feedback is not available in a Board Simulation / Assessment test — results appear after you submit.');
    }

    const questions = await loadQuestionsForTest(attempt.test_id, txDb);
    const steps = scoring.flattenAll(questions);
    const step = steps.find((s) => scoring.keyFor(s) === key);
    if (!step) throw new HttpError(404, 'No such question in this attempt');
    if (step.kind === 'open') throw new HttpError(400, 'Open/descriptive questions are self-assessed, not immediately checkable');

    let locked = {};
    if (attempt.locked_answers_json) {
      try { locked = JSON.parse(attempt.locked_answers_json); } catch { locked = {}; }
    }
    if (locked[key]) {
      // Already checked — return the ORIGINAL verdict, never re-grade a new pick.
      const existing = locked[key];
      return { key, correct: Number(existing.optionIndex) === Number(step.correct), correctOptionIndex: step.correct, submittedOptionIndex: Number(existing.optionIndex), explanation: step.explanation ?? null, alreadyChecked: true };
    }

    const { correct, submittedOptionIndex } = scoring.gradeOneStep(step, answer);
    locked[key] = { optionIndex: submittedOptionIndex, checkedAt: new Date().toISOString() };

    // Also mirror into draft_answers_json so the plain "what did they pick"
    // resume view stays consistent even before final submit.
    let draft = {};
    if (attempt.draft_answers_json) {
      try { draft = JSON.parse(attempt.draft_answers_json); } catch { draft = {}; }
    }
    draft[key] = { optionIndex: submittedOptionIndex };

    await txDb.prepare(`UPDATE attempts SET locked_answers_json = ?, draft_answers_json = ?, draft_saved_at = ${txDb.NOW_SQL} WHERE id = ?`)
      .run(JSON.stringify(locked), JSON.stringify(draft), attempt.id);

    return { key, correct, correctOptionIndex: step.correct, submittedOptionIndex, explanation: step.explanation ?? null, alreadyChecked: false };
  });

  sendJson(res, 200, result);
});

post('/api/attempts/:id/submit', async (req, res, params) => {
  const user = requireAuth(req, ['student']);
  const body = await readBody(req);
  const attemptId = requirePositiveInt(params.id, 'id');

  // Phase 6A: transaction + row lock (SELECT ... FOR UPDATE under Postgres)
  // around the read-grade-write sequence, same reasoning as /check and
  // /answers above — this specific endpoint is also exactly what a
  // double-click "Submit" (two near-simultaneous POSTs for the same
  // attempt) could otherwise race: both could pass the `submitted_at IS
  // NULL` check before either write lands, and interleave their score
  // writes. Locking the attempt row for the duration makes the second
  // request's read see the first request's already-committed
  // `submitted_at`, so it cleanly 409s instead of double-scoring.
  const { test, steps, gradedSteps, score, maxScore, answeredCount, ungradedCount, timeExceededSeconds } = await db.transaction(async (txDb) => {
    const attempt = await txDb.prepare(`SELECT * FROM attempts WHERE id = ?${txDb.ENGINE === 'postgres' ? ' FOR UPDATE' : ''}`).get(attemptId);
    if (!attempt) throw new HttpError(404, 'Attempt not found');
    if (attempt.student_id !== user.id) throw new HttpError(403, 'Not your attempt');
    if (attempt.submitted_at) throw new HttpError(409, 'This attempt was already submitted');

    const test = await txDb.prepare('SELECT * FROM tests WHERE id = ?').get(attempt.test_id);
    const questions = await loadQuestionsForTest(test.id, txDb);
    const steps = scoring.flattenAll(questions);
    // THE GUARANTEE: grading is computed here, from `steps` (sourced from
    // the database's own questions.correct/parts_json), against the raw
    // client submission — the client's `answers` payload is never trusted
    // for correctness, only for "which option did they pick". lockedAnswers
    // (2026-09-22, Phase 4) take priority over `body.answers` per-key — see
    // scoring.js's gradeSubmission comment for why a checked answer can't
    // be silently swapped for a different one at final submit.
    let lockedAnswers = {};
    if (attempt.locked_answers_json) {
      try { lockedAnswers = JSON.parse(attempt.locked_answers_json); } catch { lockedAnswers = {}; }
    }
    const { gradedSteps, score, maxScore, answeredCount, ungradedCount } = scoring.gradeSubmission(steps, body.answers || {}, lockedAnswers);

    const submittedAt = new Date();
    const startedAt = parseDbTimestamp(attempt.started_at);
    const elapsedSeconds = Math.max(0, Math.round((submittedAt - startedAt) / 1000));
    const timeExceededSeconds = Math.max(0, elapsedSeconds - test.duration_seconds);

    await txDb.prepare(`UPDATE attempts SET submitted_at = ${txDb.NOW_SQL}, score = ?, max_score = ?, time_exceeded_seconds = ?, answers_json = ? WHERE id = ?`)
      .run(score, maxScore, timeExceededSeconds, JSON.stringify(body.answers || {}), attempt.id);

    return { test, steps, gradedSteps, score, maxScore, answeredCount, ungradedCount, timeExceededSeconds };
  });
  // `attempt` isn't in scope out here (it was read inside the transaction,
  // before the update it triggered) — every later reference below uses
  // `attemptId` instead, which is identical to `attempt.id` throughout.

  await logEvent('attempt_submitted', 'test', test.id, user.id, { attemptId, score, maxScore, answeredCount, totalSteps: steps.length });

  const responsePayload = {
    attemptId,
    score, maxScore,
    accuracyPct: maxScore ? Math.round((100 * score) / maxScore) : null,
    answeredCount, totalSteps: steps.length,
    // ungradedCount added 2026-09-22 (Phase 3): open/descriptive steps in
    // this same attempt that were never part of score/maxScore at all (see
    // scoring.js's gradeSubmission) — surfaced so the UI can say "3 of 20
    // were self-assessed, not scored" instead of silently implying every
    // question counted toward the percentage shown.
    ungradedCount,
    // text/options/explanation added 2026-09-22 so the results screen can show
    // a real "your answer vs. correct answer, and why" for each missed
    // question, instead of only chapter/sub-concept-level aggregates. This is
    // the answer key text (needed to render "the right answer was..."), sent
    // only AFTER the attempt is submitted and graded — never before, so a
    // student can't inspect it mid-test. ungraded/submittedText added for
    // open-kind steps (never have correct/correctOptionIndex).
    perQuestion: gradedSteps.map((s) => ({ questionId: s.questionId, label: s.label, text: s.text, options: s.options, correct: s.correct, ungraded: !!s.ungraded, answered: s.answered, submittedOptionIndex: s.submittedOptionIndex, submittedText: s.submittedText ?? null, correctOptionIndex: s.correctIndex, explanation: s.explanation ?? null, difficulty: s.difficulty, subConcept: s.subConcept, chapterId: s.chapterId, chapterName: s.chapterName })),
    timeExceededSeconds,
  };

  if (test.kind === 'practice' && test.practice_chapter_id) {
    const scopedStepsAll = await diagnostics.getStudentStepHistory(user.id, { chapterId: test.practice_chapter_id });
    const scopedSteps = scopedStepsAll.filter((s) => (test.practice_sub_concept ? s.subConcept === test.practice_sub_concept : true));
    const vsOriginal = retest.computeVsOriginal(scopedSteps);
    responsePayload.practiceProgress = { vsOriginal, chapterId: test.practice_chapter_id, subConcept: test.practice_sub_concept };
  }

  // Real, directly-linked improvement comparison (2026-09-22, Phase 4) — only
  // when THIS test was generated by "Improve My Score" against a specific
  // earlier attempt (test.improves_attempt_id). Separate from the generic
  // chapter-history `vsOriginal` above, which stays unchanged for ordinary
  // practice sets. Both attempts' real graded steps come from
  // diagnostics.getStudentStepHistory (the same source of truth readiness/
  // diagnostics already use) — nothing here is recomputed differently.
  if (test.improves_attempt_id) {
    const sourceAttempt = await db.prepare('SELECT * FROM attempts WHERE id = ?').get(test.improves_attempt_id);
    if (sourceAttempt && sourceAttempt.student_id === user.id) {
      const allSteps = await diagnostics.getStudentStepHistory(user.id, { subjectId: test.subject_id });
      const sourceSteps = allSteps.filter((s) => s.attemptId === sourceAttempt.id);
      const newSteps = allSteps.filter((s) => s.attemptId === attemptId);
      responsePayload.improvementComparison = retest.computeImprovementComparison({
        sourceAttemptId: sourceAttempt.id,
        sourceSteps, newSteps,
        sourceScore: sourceAttempt.score, sourceMaxScore: sourceAttempt.max_score,
        newScore: score, newMaxScore: maxScore,
      });
    }
  }

  sendJson(res, 200, responsePayload);
});

// ---------------------------------------------------------------------------
// FRONTEND-ADDITIVE ENDPOINT (flagged, see note above /api/content/summary):
// a plain read of the student's OWN attempts, joined against tests/subjects/
// chapters for display labels. Every numeric field (score, maxScore,
// timeExceededSeconds) is read back verbatim from columns scoring.js already
// computed and server.js already wrote at submit time — nothing here
// recomputes correctness, mastery, or readiness. This exists only because
// the original API surface had no way to answer "what did I attempt before,
// and is there an unfinished attempt to resume" for the dashboard/"continue
// where you left off" screen, which the Revision 3 design assumes exists.
// ---------------------------------------------------------------------------
get('/api/attempts/me', async (req, res, params, query) => {
  const user = requireAuth(req, ['student']);
  const limit = Math.max(1, Math.min(50, Number(query.limit) || 20));
  // Phase 6A: every camelCase alias below is now double-quoted — Postgres
  // silently lowercase-folds an unquoted mixed-case alias (e.g. `as testId`
  // -> `testid`), which would break every `r.testId`/etc read on the
  // frontend side of this response; quoting is a no-op under SQLite and the
  // real fix for Postgres (see diagnostics.js's getStudentStepHistory
  // comment for the fuller explanation — this query has the most aliases
  // of any in the app, 15 of them, found in the Phase 6A codebase audit).
  const rows = await db.prepare(`
    SELECT a.id as id, a.test_id as "testId", a.started_at as "startedAt", a.submitted_at as "submittedAt",
           a.score as score, a.max_score as "maxScore", a.time_exceeded_seconds as "timeExceededSeconds",
           t.subject_id as "subjectId", s.name as "subjectName", s.board as board, t.kind as kind,
           t.practice_chapter_id as "chapterId", c.name as "chapterName", t.practice_sub_concept as "subConcept",
           t.duration_seconds as "durationSeconds", t.feedback_mode as "feedbackMode"
    FROM attempts a
    JOIN tests t ON t.id = a.test_id
    JOIN subjects s ON s.id = t.subject_id
    LEFT JOIN chapters c ON c.id = t.practice_chapter_id
    WHERE a.student_id = ?
    ORDER BY a.started_at DESC
    LIMIT ?`).all(user.id, limit);
  sendJson(res, 200, { attempts: rows });
});

// ---------------------------------------------------------------------------
// DIAGNOSTICS — free overall summary, paid per-subject/per-chapter detail.
// ---------------------------------------------------------------------------
get('/api/diagnostics/me/summary', async (req, res) => {
  const user = requireAuth(req, ['student']);
  const { summary, bySubject } = await diagnostics.computeOverall(user.id);
  sendJson(res, 200, { summary, bySubject: bySubject.map((s) => ({ subjectId: s.key, name: s.name, summary: s.summary, status: s.status })) });
});

get('/api/diagnostics/me/subjects/:subjectId', async (req, res, params) => {
  const user = requireAuth(req, ['student']);
  const subjectId = requirePositiveInt(params.subjectId, 'subjectId');
  if (!(await hasActiveAccess(user.id, subjectId))) {
    return sendJson(res, 200, { unlocked: false, upsell: { message: 'Unlock your Board Ready Report to see chapter-by-chapter diagnostics.', plans: PLAN_PRICES_PAISE } });
  }
  const data = await diagnostics.computeSubjectDiagnostic(user.id, subjectId);
  sendJson(res, 200, { unlocked: true, ...data });
});

get('/api/diagnostics/me/topics/:chapterId/timeline', async (req, res, params) => {
  const user = requireAuth(req, ['student']);
  const chapterId = requirePositiveInt(params.chapterId, 'chapterId');
  const chapter = await db.prepare('SELECT * FROM chapters WHERE id = ?').get(chapterId);
  if (!chapter) throw new HttpError(404, 'Chapter not found');
  if (!(await hasActiveAccess(user.id, chapter.subject_id))) {
    return sendJson(res, 200, { unlocked: false, upsell: { message: 'Unlock your Board Ready Report to see this topic\'s full attempt timeline.', plans: PLAN_PRICES_PAISE } });
  }
  const steps = await diagnostics.getStudentStepHistory(user.id, { chapterId });
  const timeline = retest.buildAttemptTimeline(steps);
  sendJson(res, 200, { unlocked: true, chapterId, chapterName: chapter.name, timeline });
});

get('/api/diagnostics/me/improvement', async (req, res) => {
  const user = requireAuth(req, ['student']);
  const { bySubject } = await diagnostics.computeOverall(user.id);
  // Phase 6A: was `bySubject.some((s) => hasActiveAccess(user.id, s.key))` —
  // .some()'s predicate can't be awaited, so this is rewritten as an
  // explicit loop that still short-circuits on the first unlocked subject,
  // preserving .some()'s exact semantics (and its early-exit efficiency)
  // now that hasActiveAccess is async.
  let anyUnlocked = false;
  for (const s of bySubject) {
    if (await hasActiveAccess(user.id, s.key)) { anyUnlocked = true; break; }
  }
  if (!anyUnlocked) {
    return sendJson(res, 200, { unlocked: false, topics: [], upsell: { message: 'Unlock your Board Ready Report to track improvement across retests.', plans: PLAN_PRICES_PAISE } });
  }
  const allSteps = await diagnostics.getStudentStepHistory(user.id);
  const byTopic = new Map();
  for (const s of allSteps) {
    if (!(await hasActiveAccess(user.id, s.subjectId))) continue;
    const key = `${s.chapterId}::${s.subConcept || ''}`;
    if (!byTopic.has(key)) byTopic.set(key, { chapterId: s.chapterId, chapterName: s.chapterName, subConcept: s.subConcept, steps: [] });
    byTopic.get(key).steps.push(s);
  }
  const topics = [...byTopic.values()]
    .map((t) => ({ chapterId: t.chapterId, chapterName: t.chapterName, subConcept: t.subConcept, vsOriginal: retest.computeVsOriginal(t.steps) }))
    .filter((t) => t.vsOriginal.attemptsCount >= 2); // a single attempt has no "improvement" to show
  sendJson(res, 200, { unlocked: true, topics });
});

// ---------------------------------------------------------------------------
// READINESS SCORE — see readiness.js. Overall (cross-subject) is free, same
// precedent as /api/diagnostics/me/summary; per-subject detail is paid.
// ---------------------------------------------------------------------------
get('/api/diagnostics/me/readiness', async (req, res) => {
  const user = requireAuth(req, ['student']);
  const { bySubject } = await diagnostics.computeOverall(user.id);
  const unlockedSubjectIds = bySubject.map((s) => s.key);
  const data = await readiness.computeReadiness(user.id, { unlockedSubjectIds });
  sendJson(res, 200, data);
});

get('/api/diagnostics/me/subjects/:subjectId/readiness', async (req, res, params) => {
  const user = requireAuth(req, ['student']);
  const subjectId = requirePositiveInt(params.subjectId, 'subjectId');
  if (!(await hasActiveAccess(user.id, subjectId))) {
    return sendJson(res, 200, { unlocked: false, upsell: { message: 'Unlock your Board Ready Report to see your full Readiness breakdown for this subject.', plans: PLAN_PRICES_PAISE } });
  }
  const data = await readiness.computeReadiness(user.id, { subjectId });
  await logEvent('readiness_viewed', 'subject', subjectId, user.id, { examReadinessScore: data.examReadiness?.score ?? null, evidenceLevel: data.evidence?.level });
  sendJson(res, 200, { unlocked: true, ...data });
});

// ---------------------------------------------------------------------------
// SUBSCRIPTIONS (test/demo helper — a real payment flow is out of scope here)
// ---------------------------------------------------------------------------
post('/api/subscriptions/activate', async (req, res) => {
  const user = requireAuth(req, ['student']);
  const body = await readBody(req);
  const plan = body.plan || 'all-subject';
  await db.prepare("INSERT INTO subscriptions (student_id, plan, status) VALUES (?, ?, 'active')").run(user.id, plan);
  sendJson(res, 201, { plan, status: 'active' });
});

// ---------------------------------------------------------------------------
// STATIC FRONTEND (additive — Agent B's track). Serves the built static
// frontend from ./public on this SAME server/port, purely as a fallback for
// GET/HEAD requests that don't match any /api/* route above. This is added
// after, and does not change, any existing API route's matching or
// behavior — an /api/* path that isn't found still 404s as JSON exactly as
// before (see the `pathname.startsWith('/api/')` guard below), it never
// falls through to index.html. Plain Node fs, no new dependency.
// ---------------------------------------------------------------------------
const PUBLIC_DIR = path.join(__dirname, 'public');
const STATIC_MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon',
};
// Serves real, per-question CROPPED diagram images from extracted-diagrams/
// — deliberately a SEPARATE static root from source_library/ (whole PDFs and
// whole-page photos), so this route can never accidentally hand a student a
// full page that shows other questions' text/options. See
// extracted-diagrams/README.md for why this exists and what's really wired
// up vs. proof-of-concept (2026-09-22 Phase 2 diagram-pipeline work).
const EXTRACTED_DIAGRAMS_DIR = path.join(__dirname, 'extracted-diagrams');
function tryServeExtractedDiagram(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  if (!pathname.startsWith('/extracted-diagrams/')) return false;
  const relPath = pathname.replace(/^\/extracted-diagrams\//, '');
  const filePath = path.normalize(path.join(EXTRACTED_DIAGRAMS_DIR, relPath));
  if (!filePath.startsWith(EXTRACTED_DIAGRAMS_DIR)) return false; // path traversal guard
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return false;
  const data = fs.readFileSync(filePath);
  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': STATIC_MIME[ext] || 'application/octet-stream', 'Content-Length': data.length });
  res.end(req.method === 'HEAD' ? undefined : data);
  return true;
}

function tryServeStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return false;
  if (!fs.existsSync(PUBLIC_DIR)) return false;
  const relPath = (pathname === '/' ? '/index.html' : pathname).replace(/^\/+/, '');
  const filePath = path.normalize(path.join(PUBLIC_DIR, relPath));
  if (!filePath.startsWith(PUBLIC_DIR)) return false; // path traversal guard
  const exists = fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  const finalPath = exists ? filePath : (pathname.startsWith('/api/') ? null : path.join(PUBLIC_DIR, 'index.html'));
  if (!finalPath || !fs.existsSync(finalPath)) return false;
  const data = fs.readFileSync(finalPath);
  const ext = path.extname(finalPath);
  res.writeHead(200, { 'Content-Type': STATIC_MIME[ext] || 'application/octet-stream', 'Content-Length': data.length });
  res.end(req.method === 'HEAD' ? undefined : data);
  return true;
}

// ---------------------------------------------------------------------------
// SERVER
// ---------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  applyBaselineHeaders(res);
  // Off by default (see security-headers.js) — a no-op, identical to
  // today's behavior, unless ALLOWED_ORIGINS is explicitly configured. When
  // it is, and this is a CORS preflight, applyCors fully answers it itself.
  if (applyCors(req, res, config.ALLOWED_ORIGINS)) return;
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const query = Object.fromEntries(url.searchParams.entries());
  for (const route of routes) {
    if (route.method !== req.method) continue;
    const match = route.regex.exec(url.pathname);
    if (!match) continue;
    const params = {};
    route.paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
    try {
      await route.handler(req, res, params, query);
    } catch (err) {
      // 2026-09-22 fix: this used to check `instanceof HttpError` only, so a
      // plain Error with a real `.status` set on it (practice.js's
      // generate()/generateImprovementTest() both do this for real 4xx
      // conditions like "no gradable questions available") was silently
      // turned into a generic 500 instead of the intended 4xx — a real,
      // pre-existing bug, not something this fix introduces. Any thrown
      // error with a valid HTTP status number now gets it; everything else
      // still defaults to 500 exactly as before.
      const status = (typeof err.status === 'number' && err.status >= 400 && err.status < 600) ? err.status : 500;
      if (typeof err.retryAfterSeconds === 'number') res.setHeader('Retry-After', String(err.retryAfterSeconds));
      if (status === 500) {
        // 2026-09-24 (Phase 5 security hardening — see
        // docs/phase-5-security-audit-report.md, item 5): every deliberate
        // error in this codebase throws a real HttpError (or a plain Error
        // with a valid `.status` set, per the 2026-09-22 fix above) with a
        // message that's already safe to show a client. Only a genuinely
        // UNEXPECTED error — a bug, a null-pointer, a thrown library
        // exception — lands here with no valid status, and its raw message
        // could contain anything (a file path, a driver-internal detail, a
        // stack fragment). Log the full error server-side; never forward its
        // message to the client.
        console.error(err);
        sendJson(res, 500, { error: 'Internal server error' });
      } else {
        sendJson(res, status, { error: err.message || 'Request failed' });
      }
    }
    return;
  }
  if (tryServeExtractedDiagram(req, res, url.pathname)) return;
  if (tryServeStatic(req, res, url.pathname)) return;
  sendJson(res, 404, { error: 'Not found' });
});

if (require.main === module) {
  // Phase 6A: db.ready() is a no-op resolve under the sqlite engine (the
  // DatabaseSync handle is already open synchronously by the time this
  // line runs) and a real connectivity round-trip under postgres — failing
  // fast here with a clear message beats the first real request hitting an
  // opaque pool-connection error.
  db.ready().then(() => {
    server.listen(PORT, () => console.log(`Board Ready API (${db.ENGINE} engine) listening on http://localhost:${PORT}`));
  }).catch((err) => {
    console.error(`FATAL: could not connect to the ${db.ENGINE} database at startup:`, err);
    process.exit(1);
  });
  // Periodic rate-limiter cleanup — only when actually serving traffic
  // (never during `require('./server')` in a test file), so tests never
  // pick up a dangling interval that would keep the process alive past its
  // own natural end.
  const cleanupInterval = setInterval(() => rateLimit.cleanup(), 5 * 60 * 1000);
  cleanupInterval.unref(); // never itself keep the process alive

  // ---------------------------------------------------------------------------
  // GRACEFUL SHUTDOWN (Stage 6C, docs/phase-6-postgres-cutover-plan.md — the
  // other genuinely new, small piece flagged for this stage). A hosting
  // platform sends SIGTERM before stopping/replacing an instance on every
  // deploy, restart, or scale-down; without this, in-flight requests would
  // be cut off mid-response and (under Postgres) pool connections would be
  // dropped rather than released. Stop accepting NEW connections first,
  // let already-in-flight requests finish, then close the database
  // connection, then exit. A second signal (or a timeout) forces an exit
  // rather than hanging a deploy indefinitely if something never resolves.
  // ---------------------------------------------------------------------------
  let shuttingDown = false;
  function shutdown(signal) {
    if (shuttingDown) { process.exit(1); return; } // second signal — force it
    shuttingDown = true;
    console.log(`[server] ${signal} received — shutting down gracefully (finishing in-flight requests)...`);
    const forceExitTimer = setTimeout(() => {
      console.error('[server] graceful shutdown timed out after 10s — forcing exit.');
      process.exit(1);
    }, 10_000);
    forceExitTimer.unref();
    server.close(async (err) => {
      if (err) console.error('[server] error while closing the HTTP server:', err);
      try {
        await db.close();
      } catch (closeErr) {
        console.error('[server] error while closing the database connection:', closeErr);
      }
      clearTimeout(forceExitTimer);
      console.log('[server] shutdown complete.');
      process.exit(0);
    });
  }
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

module.exports = server;
