// Production/staging smoke test (Stage 8 launch prep, 2026-09-24 — see
// docs/stage8-production-readiness-and-launch-runbook.md, "Production
// smoke-test script"). Distinct from scripts/browser-smoke-check.js (a real-
// Chromium CSP walkthrough meant for a local/disposable database during
// development) — this one is meant to be run BY A HUMAN, by hand, straight
// after a real deploy goes live, against the real deployed URL, so it is
// deliberately dependency-free (plain `fetch`, no Playwright/Chromium) and
// deliberately conservative about what it's allowed to touch.
//
// SAFETY MODEL — read this before running it against anything real:
//   - Default mode (no flags) is 100% READ-ONLY. It never registers a user,
//     never writes a single row, never calls any POST/PATCH endpoint. It is
//     always safe to run against a live production URL.
//   - `--full` additionally exercises the real signup -> practice test ->
//     submit flow, which DOES create real rows in whatever database the
//     target server is using (one user, one test, one attempt). Every
//     record it creates is unambiguously labeled (see SMOKE_TEST_MARKER
//     below) so it can never be mistaken for real student data and can be
//     found and deleted later with a single, obvious WHERE clause. This
//     script never deletes anything itself — cleanup, if wanted, is a
//     separate, deliberate, human decision (see the runbook's "after a
//     --full smoke test" note), consistent with this project's standing
//     rule against this session ever touching a live database directly.
//   - There is no default BASE_URL pointing at localhost or anywhere else —
//     you must pass the target explicitly, so this can never be run by
//     accident against the wrong place.
//
// USAGE:
//   node scripts/production-smoke-test.js https://your-app.example.com
//   node scripts/production-smoke-test.js https://your-app.example.com --full
//
// EXIT CODE: 0 if every check passed, 1 if anything failed. Meant to be
// wired into a launch-day checklist step, not a CI gate (it hits a real
// deployed target on purpose).

const BASE = process.argv[2];
const FULL = process.argv.includes('--full');
const SMOKE_TEST_MARKER = 'SMOKE-TEST'; // present in every name/email this script creates in --full mode, so real data is never ambiguous with it

if (!BASE || !/^https?:\/\//.test(BASE)) {
  console.error('Usage: node scripts/production-smoke-test.js <https://your-deployed-url> [--full]');
  console.error('The target URL is required and must be explicit — there is no default, so this can never run against the wrong place by accident.');
  process.exit(2);
}

const results = [];
function record(name, pass, detail) {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} — ${name}${detail ? `  (${detail})` : ''}`);
}

async function main() {
  console.log(`Production smoke test against: ${BASE}`);
  console.log(`Mode: ${FULL ? 'FULL (will create labeled, real, throwaway rows)' : 'READ-ONLY (default — no writes at all)'}`);
  console.log('---');

  // 1. HTTPS in use at all (unless explicitly testing an http:// staging URL,
  // which is the caller's own explicit choice — this only warns, doesn't fail).
  if (BASE.startsWith('http://')) {
    console.log('NOTE: target URL is plain http:// — fine for a staging smoke test, but production must be https:// (see the runbook\'s HTTPS verification checklist). Not counted as a failure here since this script can\'t know your intent.');
  }

  // 2. /api/health — the real, load-bearing readiness signal (Stage 6C).
  let health;
  try {
    const res = await fetch(`${BASE}/api/health`);
    health = await res.json().catch(() => null);
    record('GET /api/health returns 200', res.status === 200, `status=${res.status}`);
    record('/api/health reports status=ok', health && health.status === 'ok', JSON.stringify(health));
    record('/api/health reports engine=postgres (expected in real production — see .env.example DB_ENGINE)', health && health.engine === 'postgres', `engine=${health && health.engine}`);
    const raw = JSON.stringify(health || {});
    record('/api/health response never leaks a connection string or credential', !/postgres:\/\/|password/i.test(raw), 'checked for postgres:// and "password" substrings');
  } catch (err) {
    record('GET /api/health reachable at all', false, err.message);
  }

  // 3. Baseline security headers (Phase 5 hardening) actually present on the
  // real deployed server, not just in the local test suite.
  try {
    const res = await fetch(`${BASE}/api/subjects`);
    const h = res.headers;
    record('X-Content-Type-Options: nosniff present', h.get('x-content-type-options') === 'nosniff');
    record('X-Frame-Options: DENY present', h.get('x-frame-options') === 'DENY');
    record('Referrer-Policy: no-referrer present', h.get('referrer-policy') === 'no-referrer');
    const csp = h.get('content-security-policy');
    record('Content-Security-Policy present with a real default-src', Boolean(csp && csp.includes("default-src 'self'")), csp || 'missing');
  } catch (err) {
    record('Security headers reachable at all', false, err.message);
  }

  // 4. The real static frontend actually loads from this same deployment
  // (catches "API is up but the frontend build/static serving is broken").
  try {
    const res = await fetch(BASE, { redirect: 'follow' });
    const text = await res.text();
    record('Root URL serves the real frontend (200, contains the app shell)', res.status === 200 && /id="app"|Board Ready/i.test(text), `status=${res.status}, length=${text.length}`);
  } catch (err) {
    record('Root URL reachable at all', false, err.message);
  }

  // 5. Public content endpoint returns real, non-empty data — catches an
  // empty/misconfigured production database (wrong DATABASE_URL, migration
  // never run, etc.) that /api/health alone can't detect (health only checks
  // connectivity, not that the expected content actually exists).
  try {
    const res = await fetch(`${BASE}/api/content/summary`);
    const body = await res.json().catch(() => null);
    const totalQuestions = body && body.totals && body.totals.questions;
    record('GET /api/content/summary returns 200 with a non-zero question count', res.status === 200 && Number(totalQuestions) > 0, `questions=${totalQuestions}`);
  } catch (err) {
    record('/api/content/summary reachable at all', false, err.message);
  }

  if (!FULL) {
    console.log('\n(Read-only mode — skipping the real signup/practice/submit flow. Re-run with --full to also exercise it.)');
  } else {
    // 6. FULL mode: a real, clearly-labeled account through the real signup
    // -> practice generate -> answer -> check -> submit flow, end to end,
    // against the real deployed API. This is the one part of this script
    // that writes anything, and every row it touches is unambiguously
    // labeled — see SMOKE_TEST_MARKER above.
    const stamp = Date.now();
    const email = `${SMOKE_TEST_MARKER.toLowerCase()}-${stamp}@boardready-smoketest.invalid`;
    const name = `${SMOKE_TEST_MARKER} ${stamp} (safe to delete)`;
    const password = `SmokeTest-${stamp}-${Math.random().toString(36).slice(2)}`;
    let token;
    try {
      const reg = await fetch(`${BASE}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'student' }),
      });
      const regBody = await reg.json().catch(() => null);
      record('POST /api/auth/register succeeds (201) with a clearly-labeled smoke-test account', reg.status === 201, `status=${reg.status}, email=${email}`);
      token = regBody && regBody.token;
    } catch (err) {
      record('Registration reachable at all', false, err.message);
    }

    if (token) {
      try {
        const subjRes = await fetch(`${BASE}/api/subjects`);
        const subjBody = await subjRes.json();
        const subject = (subjBody.subjects || [])[0];
        record('At least one real subject exists to build a smoke-test practice set from', Boolean(subject), subject ? `${subject.board} ${subject.name}` : 'none found');

        if (subject) {
          const gen = await fetch(`${BASE}/api/practice/generate`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ subjectId: subject.id, count: 1 }),
          });
          const genBody = await gen.json().catch(() => null);
          record('POST /api/practice/generate succeeds (201) against real production content', gen.status === 201, `status=${gen.status}`);

          if (gen.status === 201) {
            const attempt = await fetch(`${BASE}/api/attempts`, {
              method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ test_id: genBody.id }),
            });
            const attemptBody = await attempt.json().catch(() => null);
            record('POST /api/attempts succeeds (201)', attempt.status === 201, `status=${attempt.status}`);

            if (attempt.status === 201) {
              const qres = await fetch(`${BASE}/api/attempts/${attemptBody.id}/questions`, { headers: { Authorization: `Bearer ${token}` } });
              const qBody = await qres.json().catch(() => null);
              const step = qBody && qBody.steps && qBody.steps[0];
              record('GET /api/attempts/:id/questions returns at least one real question, with no answer key present', Boolean(step) && !('correct' in step), step ? 'ok' : 'no step returned');

              const submit = await fetch(`${BASE}/api/attempts/${attemptBody.id}/submit`, {
                method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ answers: {} }),
              });
              const submitBody = await submit.json().catch(() => null);
              record('POST /api/attempts/:id/submit succeeds (200) with a real, computed score', submit.status === 200 && typeof (submitBody && submitBody.score) === 'number', `status=${submit.status}`);
            }
          }
        }
      } catch (err) {
        record('Full end-to-end flow completed without throwing', false, err.message);
      }
    }

    console.log(`\nThis run created one real, clearly-labeled row set in the target database:`);
    console.log(`  email:  ${email}`);
    console.log(`  name:   ${name}`);
    console.log('Find and remove it later (or any prior smoke-test runs) with:');
    console.log(`  DELETE FROM users WHERE email LIKE '${SMOKE_TEST_MARKER.toLowerCase()}-%@boardready-smoketest.invalid';`);
    console.log('  -- (a real production database will cascade/orphan-clean tests/attempts tied to that user per its own FK rules; verify on a copy first if unsure — never run an ad hoc DELETE against production without a fresh backup in hand, per the runbook.)');
  }

  console.log('\n========== SUMMARY ==========');
  const failed = results.filter((r) => !r.pass);
  console.log(`${results.length - failed.length}/${results.length} checks passed.`);
  if (failed.length) {
    console.log('\nFAILED CHECKS:');
    failed.forEach((f) => console.log(` - ${f.name}${f.detail ? ` (${f.detail})` : ''}`));
    console.log('\nRESULT: FAIL — do not consider this deployment launch-ready until every check above passes.');
    process.exitCode = 1;
  } else {
    console.log('\nRESULT: PASS.');
  }
}

main().catch((err) => {
  console.error('\nRESULT: ERROR — the smoke test itself failed to complete:', err);
  process.exitCode = 1;
});
