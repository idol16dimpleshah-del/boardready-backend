// Stage 7 (docs/phase-7-qa-plan.md) — progressive concurrency/load-test
// harness. Built against that plan's Section 2A/3/4, not invented ad hoc.
//
// WHAT THIS DOES: ramps a configurable list of concurrency tiers (default
// 10,25,50,100,200) against a REAL running server's HTTP API — never a
// direct database benchmark, and never a mock. At each tier it:
//   1. Ensures enough disposable ZZ-prefixed test users exist (provisioned
//      directly into the target database by default -- see --provision --
//      and authenticated ONCE per user, tokens reused for the whole tier,
//      never re-authenticated per request; see the plan's Section 4 for
//      exactly why: the register/login rate limiter is IP-keyed and would
//      otherwise 429 after 10 attempts regardless of intended tier size).
//   2. Fires that many concurrent practice-generate -> start-attempt ->
//      fetch-questions sequences.
//   3. Fires a concurrent autosave burst per user (multiple PATCH /answers
//      calls per user, all users at once) and reads locked/draft answers
//      back directly from the database afterward to detect any lost write
//      -- the same technique proved at n=10 in Stage 6B's D2 test, now run
//      at real tier scale.
//   4. Fires a sampled concurrent double-submit sub-test (same attempt,
//      two simultaneous POST /submit) across a handful of this tier's
//      users -- the same technique proved in Stage 6B's D1 test, now
//      re-checked at scale rather than assumed to still hold.
//   5. Submits every remaining user's attempt once, measuring response
//      time distributions and error rates per endpoint.
//   6. Runs a direct-database cross-user-contamination check: every
//      attempt row this tier created must belong to the student who
//      created it, and no other.
// A tier that breaches a launch-blocker threshold (Section 3 of the plan)
// stops the ramp there rather than continuing to a larger, less
// informative tier.
//
// SAFETY: this tool provisions and heavily loads disposable ZZ-prefixed
// fixture users/content. It refuses to run against the live SQLite
// database (checked against db.LIVE_DB_PATH, exactly like every test file
// in this project) or against a Postgres database named
// boardready/boardready_production/boardready_staging (the same denylist
// used throughout this project's other tooling) -- this is a heavy-write,
// heavy-load tool and must only ever run against a disposable local or
// staging database, never anything preserved or live.
//
// USAGE:
//   node scripts/stage7-load-test.js --base-url http://localhost:4000 \
//     --db-engine postgres --database-url postgres://...@host/dbname \
//     --tiers 10,25,50,100,200 --report stage7-load-report.json
//
//   node scripts/stage7-load-test.js --base-url http://localhost:4000 \
//     --db-engine sqlite --db-path /tmp/some-disposable-copy.db \
//     --tiers 10,25 --report stage7-load-report.json

const path = require('node:path');
const fs = require('node:fs');

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) { out[key] = 'true'; }
      else { out[key] = next; i++; }
    }
  }
  return out;
}

// SQLite-specific resilience note: node:sqlite's DatabaseSync has no
// built-in busy-timeout retry, so this harness's OWN direct-database
// bookkeeping reads (never the timed HTTP requests being measured -- those
// must reflect real, unretried behavior) can transiently hit "database is
// locked" purely because this script runs as a SEPARATE OS process from
// the server under test, both holding an open handle on the same SQLite
// file at once. This is a real, SQLite-specific, cross-process contention
// artifact of local dry-run testing against the default engine -- it is
// not expected against the real Postgres-backed staging target (a
// connection-pooled, true multi-client database with no single-file lock
// to contend over), and it is not a defect in the application under test.
// Retrying only the harness's own bookkeeping reads (with a short backoff)
// keeps the load test's own infrastructure from producing false journey
// failures, without ever masking a REAL application error.
async function withRetry(fn, { attempts = 8, delayMs = 25 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); } catch (err) {
      lastErr = err;
      if (!/locked|busy/i.test(String(err.message))) throw err;
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

function percentile(sortedMs, p) {
  if (!sortedMs.length) return null;
  const idx = Math.min(sortedMs.length - 1, Math.ceil((p / 100) * sortedMs.length) - 1);
  return sortedMs[Math.max(0, idx)];
}

function summarizeTimings(samples) {
  const ms = samples.map((s) => s.ms).sort((a, b) => a - b);
  return {
    count: samples.length,
    p50: percentile(ms, 50),
    p95: percentile(ms, 95),
    p99: percentile(ms, 99),
    max: ms.length ? ms[ms.length - 1] : null,
  };
}

async function timedFetch(method, url, { token, body, timeoutMs = 10_000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = process.hrtime.bigint();
  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    let json = null;
    try { json = await res.json(); } catch { /* no/invalid body */ }
    return { ok: true, status: res.status, ms, body: json, timedOut: false };
  } catch (err) {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    const timedOut = err.name === 'AbortError';
    return { ok: false, status: 0, ms, body: null, timedOut, error: err.message };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const baseUrl = args['base-url'];
  if (!baseUrl) {
    console.error('Usage: node scripts/stage7-load-test.js --base-url <url> [--db-engine sqlite|postgres] [--database-url <url>] [--db-path <path>] [--tiers 10,25,50,100,200] [--report <path>] [--provision db|http] [--stop-error-rate <pct>] [--cleanup true|false]');
    process.exit(2);
  }
  const tiers = (args.tiers || '10,25,50,100,200').split(',').map((s) => Number(s.trim())).filter((n) => n > 0);
  const reportPath = path.resolve(args.report || 'stage7-load-report.json');
  const provisionMode = args.provision || 'db';
  const stopErrorRatePct = Number(args['stop-error-rate'] || 5);
  const doCleanup = args.cleanup !== 'false';

  if (args['db-engine']) process.env.DB_ENGINE = args['db-engine'];
  if (args['database-url']) process.env.DATABASE_URL = args['database-url'];
  if (args['db-path']) process.env.DB_PATH = args['db-path'];

  // Loaded AFTER env vars above are set, exactly like every test file in
  // this project resolves its own DB_PATH/DATABASE_URL before requiring
  // db.js -- see test/pg-test-support.js's header comment for why this
  // ordering matters.
  const db = require('../db');
  const auth = require('../auth');

  // --- Safety guard, independent of db.js's own IS_TEST_MODE guard (this
  // tool is not run under `node --test`, so that guard doesn't fire on its
  // own -- this is a deliberate, second, explicit check because this tool
  // is a heavy-write, heavy-load tool and must never be pointed at
  // anything live or preserved, regardless of how it's invoked). ---
  if (db.ENGINE === 'sqlite') {
    if (db.DB_PATH === db.LIVE_DB_PATH) {
      throw new Error(`FATAL: refusing to run a load test against the live database (${db.LIVE_DB_PATH}). Set --db-path to an explicit disposable copy.`);
    }
  } else {
    const FORBIDDEN = new Set(['boardready', 'boardready_production', 'boardready_staging']);
    let dbName = null;
    try { dbName = new URL(process.env.DATABASE_URL || '').pathname.replace(/^\//, '').toLowerCase(); } catch { /* ignore */ }
    if (dbName && FORBIDDEN.has(dbName)) {
      throw new Error(`FATAL: refusing to run a load test against a reserved database name ("${dbName}").`);
    }
  }

  console.log(`[stage7-load-test] target server: ${baseUrl}`);
  console.log(`[stage7-load-test] target database: ${db.ENGINE} (${db.DB_PATH})`);
  console.log(`[stage7-load-test] tiers: ${tiers.join(' -> ')}`);

  const runId = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

  // -------------------------------------------------------------------
  // Fixture content: a disposable ZZ-prefixed subject/chapter with a real
  // gradable question bank, so the ramp exercises real practice-generation
  // / scoring logic rather than depending on whatever content already
  // exists in the target database (staging's real migrated content, or a
  // freshly-created empty schema).
  // -------------------------------------------------------------------
  async function seedFixtureContent() {
    const subj = await db.prepare(`INSERT INTO subjects (board, name, class) VALUES ('CBSE', 'ZZ-Stage7-LoadTest-${runId}', '10') RETURNING id`).run();
    const subjectId = Number(subj.lastInsertRowid);
    const chap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, `ZZ-Stage7-Chapter-${runId}`);
    const chapterId = Number(chap.lastInsertRowid);
    const insertQ = db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct, sub_concept)
      VALUES (?, 'mcq', 'verified', 'verified', 1, 'Medium', ?, ?, 1, 'zz_stage7_loadtest')`);
    // 30 questions: enough for a 10-question attempt with plenty of pool
    // depth left over, so many concurrent /practice/generate calls don't
    // all collide on an unrealistically tiny pool.
    for (let i = 0; i < 30; i++) {
      await insertQ.run(chapterId, `ZZ Stage7 load-test question ${i}: 2 + 2 = ?`, JSON.stringify(['3', '4', '5', '6']));
    }
    return { subjectId, chapterId };
  }

  async function dropFixtureContent(subjectId, chapterId) {
    // Best-effort, in dependency order; never touches anything outside
    // this run's own ZZ-prefixed rows.
    try { await db.prepare('DELETE FROM test_questions WHERE question_id IN (SELECT id FROM questions WHERE chapter_id = ?)').run(chapterId); } catch { /* ignore */ }
    try { await db.prepare('DELETE FROM questions WHERE chapter_id = ?').run(chapterId); } catch { /* ignore */ }
    try { await db.prepare('DELETE FROM chapters WHERE id = ?').run(chapterId); } catch { /* ignore */ }
    try { await db.prepare('DELETE FROM subjects WHERE id = ?').run(subjectId); } catch { /* ignore */ }
  }

  // -------------------------------------------------------------------
  // User provisioning. `db` mode (default): direct fixture inserts, the
  // same kind of test-fixture seeding already used throughout this
  // project's test suite -- fast, and the ONLY practical way to reach
  // tiers above ~10 without spanning multiple 15-minute rate-limit
  // windows (see the plan's Section 4). `http` mode: real
  // register+login calls, spaced to respect the real rate limit --
  // realistic, but slow (about 10 users per 15 minutes from one IP), and
  // primarily useful for confirming the rate limiter itself behaves
  // correctly against a real deployment, not for reaching large tiers.
  // -------------------------------------------------------------------
  async function provisionUsersDb(n) {
    const users = [];
    for (let i = 0; i < n; i++) {
      const email = `zz-stage7-loadtest-${runId}-${i}@boardready.test`;
      const passwordHash = auth.hashPassword('stage7-load-test-not-a-real-password');
      const info = await db.prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'student') RETURNING id")
        .run(`ZZ Stage7 LoadTest User ${i}`, email, passwordHash);
      const userId = Number(info.lastInsertRowid);
      // Token minted the same way the app itself does (auth.sign), using
      // the SAME AUTH_SECRET the target server is running with (this
      // process must be given the identical AUTH_SECRET env var the
      // server was started with for local verification; for a real
      // remote staging run, use --provision http instead, since minting
      // a token this way requires knowing the server's real secret,
      // which this tool must never be handed for a real deployment).
      const token = auth.sign({ userId, role: 'student' });
      users.push({ userId, email, token });
    }
    return users;
  }

  async function provisionUsersHttp(n) {
    const users = [];
    console.log(`[stage7-load-test] provisioning ${n} users via real HTTP register+login (rate-limit-aware: ~10 per 15 minutes per IP) -- this will be slow for n > 10.`);
    for (let i = 0; i < n; i++) {
      const email = `zz-stage7-loadtest-${runId}-${i}@boardready.test`;
      const reg = await timedFetch('POST', `${baseUrl}/api/auth/register`, { body: { name: `ZZ Stage7 LoadTest User ${i}`, email, password: 'stage7-load-test-not-a-real-password', role: 'student' } });
      if (reg.status === 429) {
        const retryAfterMs = 15 * 60 * 1000;
        console.log(`[stage7-load-test] hit the register rate limit at user ${i} -- waiting ${Math.round(retryAfterMs / 1000)}s for the window to clear (see the plan's Section 4). Consider --provision db for larger tiers.`);
        await new Promise((r) => setTimeout(r, retryAfterMs));
      }
      if (reg.status === 201 && reg.body && reg.body.token) {
        users.push({ userId: reg.body.user.id, email, token: reg.body.token });
      } else {
        console.warn(`[stage7-load-test] provisioning user ${i} failed (status ${reg.status}): ${JSON.stringify(reg.body)}`);
      }
    }
    return users;
  }

  async function crossUserContaminationCheck(attemptRecords) {
    // attemptRecords: [{ attemptId, expectedStudentId }]
    if (!attemptRecords.length) return { checked: 0, violations: [] };
    const ids = attemptRecords.map((r) => r.attemptId);
    const placeholders = ids.map(() => '?').join(',');
    const rows = await withRetry(() => db.prepare(`SELECT id, student_id FROM attempts WHERE id IN (${placeholders})`).all(...ids));
    const byId = new Map(rows.map((r) => [Number(r.id), Number(r.student_id)]));
    const violations = [];
    for (const rec of attemptRecords) {
      const actualStudentId = byId.get(rec.attemptId);
      if (actualStudentId !== rec.expectedStudentId) {
        violations.push({ attemptId: rec.attemptId, expectedStudentId: rec.expectedStudentId, actualStudentId });
      }
    }
    return { checked: attemptRecords.length, violations };
  }

  async function runTier(tierSize, users, subjectId, chapterId) {
    console.log(`\n=== Tier: ${tierSize} concurrent users ===`);
    const tierUsers = users.slice(0, tierSize);
    const timings = { generate: [], startAttempt: [], fetchQuestions: [], patchAnswers: [], submit: [] };
    const errors = { generate: 0, startAttempt: 0, fetchQuestions: 0, patchAnswers: 0, submit: 0 };
    const timeouts = { generate: 0, startAttempt: 0, fetchQuestions: 0, patchAnswers: 0, submit: 0 };
    const attemptRecords = [];
    let lostAutosaveCount = 0;
    let failedSubmissions = 0;
    const exceptions = [];

    async function oneUserJourney(user) {
      const gen = await timedFetch('POST', `${baseUrl}/api/practice/generate`, { token: user.token, body: { subjectId, chapterId, count: 8 } });
      timings.generate.push({ ms: gen.ms });
      if (gen.timedOut) timeouts.generate++;
      if (!gen.ok || gen.status >= 400) { errors.generate++; return null; }

      const started = await timedFetch('POST', `${baseUrl}/api/attempts`, { token: user.token, body: { test_id: gen.body.id } });
      timings.startAttempt.push({ ms: started.ms });
      if (started.timedOut) timeouts.startAttempt++;
      if (!started.ok || started.status >= 400) { errors.startAttempt++; return null; }
      const attemptId = started.body.id;

      const qres = await timedFetch('GET', `${baseUrl}/api/attempts/${attemptId}/questions`, { token: user.token });
      timings.fetchQuestions.push({ ms: qres.ms });
      if (qres.timedOut) timeouts.fetchQuestions++;
      if (!qres.ok || qres.status >= 400) { errors.fetchQuestions++; return null; }
      const steps = qres.body.steps;

      // Concurrent autosave burst: fire all of this user's answers as
      // SEPARATE, SIMULTANEOUS PATCH /answers calls (never sequential),
      // reproducing the exact "answering two questions in quick
      // succession" race server.js's own comment on this endpoint
      // describes -- then read back directly from the database to
      // confirm none were lost to the concurrent read-modify-write.
      await Promise.all(steps.map((s) => {
        const key = `${s.questionId}:${s.label || ''}`;
        const t0 = process.hrtime.bigint();
        return timedFetch('PATCH', `${baseUrl}/api/attempts/${attemptId}/answers`, { token: user.token, body: { answers: { [key]: { optionIndex: 1 } } } })
          .then((r) => { timings.patchAnswers.push({ ms: Number(process.hrtime.bigint() - t0) / 1e6 }); if (r.timedOut) timeouts.patchAnswers++; if (!r.ok || r.status >= 400) errors.patchAnswers++; });
      }));
      const row = await withRetry(() => db.prepare('SELECT draft_answers_json FROM attempts WHERE id = ?').get(attemptId));
      let draft = {};
      try { draft = JSON.parse(row.draft_answers_json || '{}'); } catch { draft = {}; }
      const expectedKeys = steps.length;
      const actualKeys = Object.keys(draft).length;
      if (actualKeys < expectedKeys) lostAutosaveCount += (expectedKeys - actualKeys);

      attemptRecords.push({ attemptId, expectedStudentId: user.userId });
      return { user, attemptId, steps };
    }

    const settled = await Promise.allSettled(tierUsers.map(oneUserJourney));
    for (const r of settled) {
      if (r.status === 'rejected') exceptions.push(String(r.reason && r.reason.message || r.reason));
    }
    const journeys = settled.map((r) => (r.status === 'fulfilled' ? r.value : null)).filter(Boolean);
    if (exceptions.length) {
      console.log(`  ${exceptions.length} journey(s) threw an unhandled exception (not a clean HTTP error) -- sample: ${exceptions.slice(0, 3).join(' | ')}`);
    }

    // Sampled concurrent double-submit sub-test (Stage 6B's D1 test, now
    // at tier scale): up to 5 users from this tier each get TWO
    // simultaneous submit calls for their own attempt.
    const sampleSize = Math.min(5, journeys.length);
    const doubleSubmitAnomalies = [];
    for (let i = 0; i < sampleSize; i++) {
      const j = journeys[i];
      const answers = {};
      for (const s of j.steps) answers[`${s.questionId}:${s.label || ''}`] = { optionIndex: 1 };
      const [r1, r2] = await Promise.all([
        timedFetch('POST', `${baseUrl}/api/attempts/${j.attemptId}/submit`, { token: j.user.token, body: { answers } }),
        timedFetch('POST', `${baseUrl}/api/attempts/${j.attemptId}/submit`, { token: j.user.token, body: { answers } }),
      ]);
      const statuses = [r1.status, r2.status].sort();
      if (JSON.stringify(statuses) !== JSON.stringify([200, 409])) {
        doubleSubmitAnomalies.push({ attemptId: j.attemptId, statuses });
      }
      timings.submit.push({ ms: r1.ms }, { ms: r2.ms });
    }

    // Everyone else: a single, ordinary submit.
    const remaining = journeys.slice(sampleSize);
    await Promise.all(remaining.map(async (j) => {
      const answers = {};
      for (const s of j.steps) answers[`${s.questionId}:${s.label || ''}`] = { optionIndex: 1 };
      const r = await timedFetch('POST', `${baseUrl}/api/attempts/${j.attemptId}/submit`, { token: j.user.token, body: { answers } });
      timings.submit.push({ ms: r.ms });
      if (r.timedOut) timeouts.submit++;
      if (!r.ok || r.status >= 400) { errors.submit++; failedSubmissions++; }
    }));

    const contamination = await crossUserContaminationCheck(attemptRecords);

    const totalRequests = Object.values(timings).reduce((a, t) => a + t.length, 0);
    const totalErrors = Object.values(errors).reduce((a, b) => a + b, 0);
    const errorRatePct = totalRequests ? (totalErrors / totalRequests) * 100 : 0;

    const result = {
      tier: tierSize,
      journeysCompleted: journeys.length,
      journeysAttempted: tierUsers.length,
      journeyExceptions: exceptions,
      timings: Object.fromEntries(Object.entries(timings).map(([k, v]) => [k, summarizeTimings(v)])),
      errors,
      timeouts,
      errorRatePct: Number(errorRatePct.toFixed(2)),
      failedSubmissions,
      lostAutosaveCount,
      doubleSubmitAnomalies,
      crossUserContamination: contamination,
    };

    const blockerFindings = [];
    if (result.lostAutosaveCount > 0) blockerFindings.push(`${result.lostAutosaveCount} lost autosave(s)`);
    if (result.doubleSubmitAnomalies.length > 0) blockerFindings.push(`${result.doubleSubmitAnomalies.length} double-submit anomaly(ies) (expected exactly one 200 + one 409 every time)`);
    if (result.crossUserContamination.violations.length > 0) blockerFindings.push(`${result.crossUserContamination.violations.length} cross-user contamination violation(s)`);
    result.blockerFindings = blockerFindings;

    console.log(`  journeys: ${result.journeysCompleted}/${result.journeysAttempted} completed`);
    console.log(`  error rate: ${result.errorRatePct}% (${totalErrors}/${totalRequests} requests)`);
    console.log(`  submit p95: ${result.timings.submit.p95 ?? 'n/a'}ms | check/patch p95: ${result.timings.patchAnswers.p95 ?? 'n/a'}ms | generate p95: ${result.timings.generate.p95 ?? 'n/a'}ms`);
    console.log(`  lost autosaves: ${result.lostAutosaveCount} | double-submit anomalies: ${result.doubleSubmitAnomalies.length} | cross-user contamination: ${result.crossUserContamination.violations.length}`);
    if (blockerFindings.length) console.log(`  *** LAUNCH BLOCKER(S) at this tier: ${blockerFindings.join('; ')} ***`);

    return result;
  }

  const { subjectId, chapterId } = await seedFixtureContent();
  console.log(`[stage7-load-test] seeded fixture content: subjectId=${subjectId}, chapterId=${chapterId}`);

  const maxTier = Math.max(...tiers);
  const provision = provisionMode === 'http' ? provisionUsersHttp : provisionUsersDb;
  console.log(`[stage7-load-test] provisioning ${maxTier} users (mode: ${provisionMode})...`);
  const allUsers = await provision(maxTier);
  console.log(`[stage7-load-test] provisioned ${allUsers.length} users.`);

  const report = { baseUrl, engine: db.ENGINE, tiersRequested: tiers, startedAt: new Date().toISOString(), tierResults: [], stoppedEarly: false };

  for (const tier of tiers) {
    if (allUsers.length < tier) {
      console.log(`[stage7-load-test] only ${allUsers.length} users provisioned -- skipping tier ${tier}.`);
      continue;
    }
    const result = await runTier(tier, allUsers, subjectId, chapterId);
    report.tierResults.push(result);
    if (result.blockerFindings.length > 0 || result.errorRatePct > stopErrorRatePct) {
      console.log(`[stage7-load-test] stopping ramp at tier ${tier} (blocker findings and/or error rate ${result.errorRatePct}% > threshold ${stopErrorRatePct}%).`);
      report.stoppedEarly = true;
      break;
    }
  }

  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n[stage7-load-test] report written to ${reportPath}`);

  if (doCleanup && allUsers.length) {
    console.log('[stage7-load-test] cleaning up fixture users/content...');
    const userIds = allUsers.map((u) => u.userId);
    const placeholders = userIds.map(() => '?').join(',');
    try {
      // Dependency order: test_questions -> attempts -> tests -> users ->
      // questions -> chapter -> subject. Every row touched here belongs
      // either to a ZZ-prefixed fixture user or the ZZ-prefixed fixture
      // chapter created above -- never anything pre-existing.
      const testRows = await db.prepare(`SELECT id FROM tests WHERE student_id IN (${placeholders})`).all(...userIds);
      const testIds = testRows.map((r) => Number(r.id));
      if (testIds.length) {
        const testPlaceholders = testIds.map(() => '?').join(',');
        await db.prepare(`DELETE FROM test_questions WHERE test_id IN (${testPlaceholders})`).run(...testIds);
      }
      await db.prepare(`DELETE FROM attempts WHERE student_id IN (${placeholders})`).run(...userIds);
      if (testIds.length) {
        const testPlaceholders = testIds.map(() => '?').join(',');
        await db.prepare(`DELETE FROM tests WHERE id IN (${testPlaceholders})`).run(...testIds);
      }
      await db.prepare(`DELETE FROM users WHERE id IN (${placeholders})`).run(...userIds);
    } catch (err) {
      console.warn('[stage7-load-test] cleanup of fixture users/tests/attempts hit an error (best-effort, non-fatal):', err.message);
    }
    await dropFixtureContent(subjectId, chapterId);
    console.log('[stage7-load-test] cleanup complete.');
  } else if (!doCleanup) {
    console.log('[stage7-load-test] --cleanup=false: fixture users/content left in place for inspection.');
  }
}

main().catch((err) => {
  console.error('[stage7-load-test] FAILED:', err);
  process.exit(1);
});
