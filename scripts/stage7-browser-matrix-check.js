// Stage 7 (docs/phase-7-qa-plan.md, Section 2B) — extended cross-device /
// cross-browser QA. Builds on scripts/browser-smoke-check.js (Phase 5/6B:
// proven zero-CSP-violation walkthrough) by running it across a real
// device/network matrix instead of a single desktop-headless pass, and
// adding the behavioral flows the plan calls out that aren't
// viewport-specific: back-button behavior, session expiration, autosave/
// resume, and a deliberate error state.
//
// MATRIX (Section 2B): Desktop, Tablet (iPad Pro 11), Mobile (iPhone 13),
// and Mobile on a throttled "slow 3G"-equivalent network (via Chrome
// DevTools Protocol network emulation — Chromium-only, which is what this
// sandbox's pre-installed browser is). The core functional walkthrough
// (login/register, Practice with immediate feedback, Results, Board
// Simulation deferred feedback, logout/login) runs once per profile in
// that matrix. The four additional behavioral checks (back-button,
// session expiration, autosave/resume, a forced error state) are
// viewport-independent application logic, not rendering, so they run once
// against a Desktop context — flagged explicitly in this file's own
// summary output as executed on Desktop only, not claimed for every
// viewport, so a reader of the report knows exactly what was and wasn't
// covered.
//
// USAGE:
//   node scripts/stage7-browser-matrix-check.js http://localhost:4620
// (same "server must already be running against a disposable database"
// contract as scripts/browser-smoke-check.js — see that file's header.)

const { chromium, devices } = require('playwright');

const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:4620';

function log(label, extra) { console.log(`[${new Date().toISOString().slice(11, 19)}] ${label}${extra !== undefined ? ' ' + JSON.stringify(extra) : ''}`); }

// Roughly Chrome DevTools' "Slow 3G" preset.
const SLOW_3G = { offline: false, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8, latency: 400 };

const PROFILES = [
  { label: 'Desktop', contextOptions: { viewport: { width: 1440, height: 900 } }, network: null },
  { label: 'Tablet (iPad Pro 11)', contextOptions: { ...devices['iPad Pro 11'] }, network: null },
  { label: 'Mobile (iPhone 13)', contextOptions: { ...devices['iPhone 13'] }, network: null },
  { label: 'Mobile (iPhone 13, slow 3G)', contextOptions: { ...devices['iPhone 13'] }, network: SLOW_3G },
];

function attachDiagnostics(page, sink) {
  page.on('console', (msg) => {
    const entry = { type: msg.type(), text: msg.text() };
    sink.consoleMessages.push(entry);
    if (/content-security-policy|refused to/i.test(entry.text)) sink.cspViolations.push(entry);
  });
  page.on('pageerror', (err) => sink.pageErrors.push(String(err)));
  page.on('requestfailed', (req) => sink.failedRequests.push({ url: req.url(), failure: req.failure() && req.failure().errorText }));
  page.on('dialog', async (dialog) => { await dialog.accept(); });
}

// The core functional walkthrough, extracted so it can run once per matrix
// profile. Deliberately a subset of browser-smoke-check.js's full 12-step
// walkthrough (that script remains the canonical single-pass CSP check) --
// this focuses on the flows that matter across DEVICES specifically:
// registration/login rendering correctly at each viewport, immediate
// feedback and deferred feedback both rendering correctly at each
// viewport, and results rendering correctly at each viewport.
async function runCoreWalkthrough(page, label, timeoutMs = 20_000) {
  const findings = [];
  const stamp = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  const email = `stage7-matrix-${stamp}@boardready.test`;
  const password = `Stage7Matrix-${stamp}`;

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#tabCreateBtn', { state: 'visible' });
  await page.click('#tabCreateBtn');
  await page.click('#createBoardPick .pick-card[data-board="ICSE"]');
  await page.fill('#createName', `Stage7 Matrix Student (${label})`);
  await page.fill('#createEmail', email);
  await page.fill('#createPassword', password);
  await Promise.all([
    page.waitForSelector('[data-screen="dash"]', { state: 'visible', timeout: timeoutMs }),
    page.click('#createForm button[type="submit"]'),
  ]);

  await page.waitForSelector('#subjectPicker button', { timeout: timeoutMs });
  const mathsBtn = page.locator('#subjectPicker button', { hasText: 'Mathematics' }).first();
  await mathsBtn.click();
  await page.waitForSelector('#chaptersList [data-act="practice"]', { timeout: timeoutMs });

  await Promise.all([
    page.waitForSelector('[data-screen="test"]', { state: 'visible', timeout: timeoutMs }),
    page.click('#chaptersList [data-act="practice"]'),
  ]);
  const practiceBadge = (await page.textContent('#modeBadge') || '').trim();
  if (!/practice/i.test(practiceBadge)) findings.push(`Expected a Practice mode badge, got: "${practiceBadge}"`);

  // NOTE: the immediate-feedback reveal classes (.opt.correct-pick /
  // .opt.wrong-pick) are added by app.js only after the async
  // POST /api/attempts/:id/check round-trip resolves -- checking for them
  // immediately after the click (with no wait) is a race, not a real
  // assertion, and is more likely to lose the race on a throttled or
  // simply slower-painting mobile viewport. Wait for that response first,
  // exactly as the proven scripts/browser-smoke-check.js does.
  let sawCorrectPick = false, sawWrongPick = false;
  const qCountText = await page.textContent('#testQCount');
  const totalQuestions = Number((qCountText.match(/of (\d+)/) || [])[1] || 0);
  for (let i = 0; i < totalQuestions; i++) {
    await page.waitForSelector('#qOptions .opt');
    const [checkResp] = await Promise.all([
      page.waitForResponse((r) => /\/api\/attempts\/\d+\/check$/.test(new URL(r.url()).pathname), { timeout: timeoutMs }).catch(() => null),
      page.click('#qOptions .opt >> nth=0'),
    ]);
    if (checkResp) {
      const body = await checkResp.json().catch(() => null);
      if (body) { if (body.correct) sawCorrectPick = true; else sawWrongPick = true; }
    }
    if (await page.locator('.opt.correct-pick').count()) sawCorrectPick = true;
    if (await page.locator('.opt.wrong-pick').count()) sawWrongPick = true;
    const isLast = i === totalQuestions - 1;
    await page.click('#nextBtn');
    if (!isLast) await page.waitForSelector('#qOptions .opt');
  }
  if (!sawCorrectPick && !sawWrongPick) findings.push('Never saw a correct-pick or wrong-pick class in Practice mode at this viewport.');
  await page.waitForSelector('[data-screen="results"]', { state: 'visible', timeout: timeoutMs });

  // ---- Board Simulation (deferred feedback) ----
  await page.click('#backToDashBtn');
  await page.waitForSelector('[data-screen="dash"]', { state: 'visible', timeout: timeoutMs });
  await mathsBtn.click();
  await page.waitForSelector('#fullTestBtn', { timeout: timeoutMs });
  await Promise.all([
    page.waitForSelector('[data-screen="test"]', { state: 'visible', timeout: timeoutMs }),
    page.click('#fullTestBtn'),
  ]);
  const simBadge = (await page.textContent('#modeBadge') || '').trim();
  if (!/board simulation/i.test(simBadge)) findings.push(`Expected a Board Simulation mode badge, got: "${simBadge}"`);
  await page.waitForSelector('#qOptions .opt', { timeout: timeoutMs });
  await page.click('#qOptions .opt >> nth=0');
  const revealCount = await page.locator('.opt.correct-pick, .opt.wrong-pick, .opt.correct-reveal').count();
  if (revealCount !== 0) findings.push('Board Simulation revealed a correct/wrong answer before submission at this viewport.');
  await page.click('#testTrack .tdot >> nth=-1');
  await page.waitForSelector('#qOptions .opt', { timeout: timeoutMs });
  await page.click('#nextBtn'); // submit (confirm dialog auto-accepted)
  await page.waitForSelector('[data-screen="results"]', { state: 'visible', timeout: timeoutMs });

  // ---- logout / login ----
  await page.click('#backToDashBtn');
  await page.waitForSelector('[data-screen="dash"]', { state: 'visible', timeout: timeoutMs });
  await page.click('#logoutBtn');
  await page.waitForSelector('[data-screen="login"]', { state: 'visible', timeout: timeoutMs });
  await page.click('#tabLoginBtn');
  await page.waitForSelector('#loginForm', { state: 'visible' });
  await page.fill('#loginEmail', email);
  await page.fill('#loginPassword', password);
  await Promise.all([
    page.waitForSelector('[data-screen="dash"]', { state: 'visible', timeout: timeoutMs }),
    page.click('#loginForm button[type="submit"]'),
  ]);

  return { practiceBadge, simBadge, sawCorrectPick, sawWrongPick, findings };
}

// ---- Behavioral checks (viewport-independent; run once, Desktop) ----

async function testBackButton(browser) {
  // Isolated context: each behavioral test registers its own user and must
  // start from a clean, logged-out localStorage, not whatever a previous
  // test in the same context/tab left behind.
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  page.on('dialog', async (d) => { await d.accept(); }); // Practice mode's last-question submit confirms via window.confirm()
  const findings = [];
  const stamp = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  const email = `stage7-backbtn-${stamp}@boardready.test`;
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.click('#tabCreateBtn');
    await page.click('#createBoardPick .pick-card[data-board="ICSE"]');
    await page.fill('#createName', 'Stage7 BackButton Student');
    await page.fill('#createEmail', email);
    await page.fill('#createPassword', `Stage7Back-${stamp}`);
    await Promise.all([page.waitForSelector('[data-screen="dash"]', { state: 'visible', timeout: 20_000 }), page.click('#createForm button[type="submit"]')]);

    // 2026-09-24 fix verification: public/app.js's showScreen() now keeps a
    // minimal history entry per major screen (login/dash/test/results) via
    // pushState/replaceState, and a popstate handler routes Back/Forward
    // between them instead of letting the tab navigate away from the app.
    // Two things to verify, matching the two real-world cases that matter:
    // (1) mid-test, back must NOT abandon the attempt (there is still no
    // "exit test" control in the UI, so a back-tap here is far more likely
    // accidental than deliberate); (2) after finishing a test, back from
    // Results should land somewhere real (the dashboard), never a blank or
    // external page.
    await page.waitForSelector('#subjectPicker button');
    await page.locator('#subjectPicker button', { hasText: 'Mathematics' }).first().click();
    await page.waitForSelector('#chaptersList [data-act="practice"]');
    await Promise.all([
      page.waitForSelector('[data-screen="test"]', { state: 'visible', timeout: 20_000 }),
      page.click('#chaptersList [data-act="practice"]'),
    ]);

    // --- (1) mid-test back-button must not abandon the attempt ---
    await page.goBack();
    await page.waitForTimeout(400);
    const stillOnTestScreen = await page.locator('[data-screen="test"]:not([hidden])').count();
    if (!stillOnTestScreen) {
      const currentUrl = page.url();
      let stillAuthenticated = null;
      try { stillAuthenticated = await page.evaluate(() => !!localStorage.getItem('br_token')); } catch (evalErr) {
        findings.push(`Mid-test browser back-button navigated away from the app entirely (to "${currentUrl}") instead of staying on the test -- ${evalErr.message}`);
      }
      if (stillAuthenticated === false) findings.push('Mid-test browser back-button cleared the session unexpectedly.');
      else if (stillAuthenticated === true) findings.push('Mid-test browser back-button left the test screen instead of staying put (still authenticated, but no longer on the test) -- an in-progress attempt should not be abandonable by an accidental back-tap with no "exit test" control in the UI.');
    }

    // --- (2) finish the test, then back from Results should reach dash ---
    const qCountText = await page.textContent('#testQCount');
    const totalQuestions = Number((qCountText.match(/of (\d+)/) || [])[1] || 0);
    for (let i = 0; i < totalQuestions; i++) {
      await page.waitForSelector('#qOptions .opt');
      await Promise.all([
        page.waitForResponse((r) => /\/api\/attempts\/\d+\/check$/.test(new URL(r.url()).pathname), { timeout: 20_000 }).catch(() => null),
        page.click('#qOptions .opt >> nth=0'),
      ]);
      const isLast = i === totalQuestions - 1;
      await page.click('#nextBtn');
      if (!isLast) await page.waitForSelector('#qOptions .opt');
    }
    await page.waitForSelector('[data-screen="results"]', { state: 'visible', timeout: 20_000 });

    await page.goBack();
    await page.waitForTimeout(400);
    const landedOnDash = await page.locator('[data-screen="dash"]:not([hidden])').count();
    if (!landedOnDash) {
      const currentUrl = page.url();
      let stillAuthenticated = null;
      try { stillAuthenticated = await page.evaluate(() => !!localStorage.getItem('br_token')); } catch (evalErr) {
        findings.push(`Post-results browser back-button navigated away from the app entirely (to "${currentUrl}") instead of reaching the dashboard -- ${evalErr.message}`);
      }
      if (stillAuthenticated !== null) findings.push('Post-results browser back-button did not land on the dashboard as expected.');
    }
  } catch (err) {
    findings.push(`Exception during back-button test: ${err.message}`);
  } finally {
    await context.close();
  }
  return { findings };
}

async function testSessionExpiration(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const findings = [];
  const stamp = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  const email = `stage7-sessionexp-${stamp}@boardready.test`;
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.click('#tabCreateBtn');
    await page.click('#createBoardPick .pick-card[data-board="ICSE"]');
    await page.fill('#createName', 'Stage7 SessionExpiry Student');
    await page.fill('#createEmail', email);
    await page.fill('#createPassword', `Stage7Exp-${stamp}`);
    await Promise.all([page.waitForSelector('[data-screen="dash"]', { state: 'visible', timeout: 20_000 }), page.click('#createForm button[type="submit"]')]);
    // Simulate an expired/invalid token exactly as a real 7-day expiry
    // would leave it: syntactically token-shaped, but rejected by the
    // server (auth.verify() returns null on a garbage signature).
    await page.evaluate(() => { localStorage.setItem('br_token', 'ZXhwaXJlZC5wYXlsb2Fk.not-a-real-signature'); });
    await page.reload({ waitUntil: 'domcontentloaded' });
    const landedOnLogin = await page.waitForSelector('[data-screen="login"]', { state: 'visible', timeout: 10_000 }).then(() => true).catch(() => false);
    if (!landedOnLogin) findings.push('An expired/invalid token did not cleanly bounce the app back to the login screen (blank page, crash, or stuck dashboard instead).');
    const pageErrorsDuringExpiry = [];
    page.once('pageerror', (err) => pageErrorsDuringExpiry.push(String(err)));
    await page.waitForTimeout(300);
    if (pageErrorsDuringExpiry.length) findings.push(`Uncaught exception while handling an expired token: ${pageErrorsDuringExpiry[0]}`);
  } catch (err) {
    findings.push(`Exception during session-expiration test: ${err.message}`);
  } finally {
    await context.close();
  }
  return { findings };
}

async function testAutosaveResume(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const findings = [];
  const stamp = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  const email = `stage7-resume-${stamp}@boardready.test`;
  const password = `Stage7Resume-${stamp}`;
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.click('#tabCreateBtn');
    await page.click('#createBoardPick .pick-card[data-board="ICSE"]');
    await page.fill('#createName', 'Stage7 Resume Student');
    await page.fill('#createEmail', email);
    await page.fill('#createPassword', password);
    await Promise.all([page.waitForSelector('[data-screen="dash"]', { state: 'visible', timeout: 20_000 }), page.click('#createForm button[type="submit"]')]);
    await page.waitForSelector('#subjectPicker button');
    await page.locator('#subjectPicker button', { hasText: 'Mathematics' }).first().click();
    // Deliberately Board Simulation, not Practice: reading public/app.js
    // shows Practice mode's immediate-feedback pick (checkAnswer()) calls
    // POST /check, which server.js mirrors into draft_answers_json inside
    // its own transaction -- it does NOT go through the debounced PATCH
    // /answers path at all except as a fallback when /check itself fails.
    // The code's own comment above scheduleAutosave() calls it "REAL
    // AUTOSAVE -- debounced PATCH to /api/attempts/:id/answers", and that
    // path is only exercised by Board Simulation / deferred mode's
    // selectDeferredAnswer(). Testing "autosave" against Practice mode was
    // testing the wrong mechanism -- both modes durably persist a resumable
    // draft, just via different endpoints, which is correct app design, not
    // a defect. This is the mode that actually matches what the plan means
    // by "autosave."
    await page.waitForSelector('#fullTestBtn');
    await Promise.all([page.waitForSelector('[data-screen="test"]', { state: 'visible', timeout: 20_000 }), page.click('#fullTestBtn')]);

    // Answer the first question only (triggers the real debounced PATCH
    // /answers autosave, ~500ms after the pick per app.js), then reload the
    // whole page mid-test -- exactly what happens if a student's mobile
    // browser is killed and reopened, or they accidentally refresh.
    await page.waitForSelector('#qOptions .opt');
    const [patchResp] = await Promise.all([
      page.waitForResponse((r) => /\/api\/attempts\/\d+\/answers$/.test(new URL(r.url()).pathname), { timeout: 5000 }).catch(() => null),
      page.click('#qOptions .opt >> nth=0'),
    ]);
    if (!patchResp) findings.push('No PATCH /answers autosave request observed after answering a question in Board Simulation mode.');
    await page.reload({ waitUntil: 'domcontentloaded' });

    const dashboardReached = await page.waitForSelector('[data-screen="dash"]', { state: 'visible', timeout: 10_000 }).then(() => true).catch(() => false);
    if (!dashboardReached) { findings.push('Reloading mid-test did not land back on the dashboard as expected.'); return { findings }; }

    const continueVisible = await page.locator('#continueStrip:not([hidden])').count();
    if (!continueVisible) { findings.push('Dashboard did not show a "Continue where you left off" prompt for the unfinished attempt after a mid-test reload.'); return { findings }; }
    const continueText = (await page.textContent('#continueLink') || '').trim();
    if (!/resume/i.test(continueText)) { findings.push(`Expected a "Resume" continue-link, got: "${continueText}"`); return { findings }; }

    await Promise.all([page.waitForSelector('[data-screen="test"]', { state: 'visible', timeout: 20_000 }), page.click('#continueLink')]);
    const selectedAfterResume = await page.locator('#qOptions .opt.sel').count();
    if (!selectedAfterResume) findings.push('Resumed attempt did not restore the previously-autosaved answer selection.');
  } catch (err) {
    findings.push(`Exception during autosave/resume test: ${err.message}`);
  } finally {
    await context.close();
  }
  return { findings };
}

async function testErrorState(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const findings = [];
  const stamp = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  const email = `stage7-errorstate-${stamp}@boardready.test`;
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.click('#tabCreateBtn');
    await page.click('#createBoardPick .pick-card[data-board="ICSE"]');
    await page.fill('#createName', 'Stage7 ErrorState Student');
    await page.fill('#createEmail', email);
    await page.fill('#createPassword', `Stage7Err-${stamp}`);
    await Promise.all([page.waitForSelector('[data-screen="dash"]', { state: 'visible', timeout: 20_000 }), page.click('#createForm button[type="submit"]')]);

    // Force the NEXT practice-generate call to fail server-side, exactly
    // as a real transient backend/network problem would -- a real user's
    // browser can't tell the difference between "the server 500'd" and
    // "my wifi dropped a packet", so the UI must handle both the same way:
    // a visible, non-crashing error, never a silent hang or a blank page.
    await page.route('**/api/practice/generate', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Internal server error' }) }), { times: 1 });
    await page.waitForSelector('#subjectPicker button');
    await page.locator('#subjectPicker button', { hasText: 'Mathematics' }).first().click();
    await page.waitForSelector('#chaptersList [data-act="practice"]');
    await page.click('#chaptersList [data-act="practice"]');
    await page.waitForTimeout(1000);

    const stillOnDashOrToast = await page.locator('[data-screen="dash"]:not([hidden])').count();
    const pageErrorsDuringForcedFailure = [];
    page.once('pageerror', (err) => pageErrorsDuringForcedFailure.push(String(err)));
    await page.waitForTimeout(300);
    if (!stillOnDashOrToast) findings.push('A forced 500 on practice-generate did not keep the user on a sane screen (dashboard) -- possible blank/crashed UI on a real backend error.');
    if (pageErrorsDuringForcedFailure.length) findings.push(`Uncaught exception while handling a forced 500: ${pageErrorsDuringForcedFailure[0]}`);
  } catch (err) {
    findings.push(`Exception during error-state test: ${err.message}`);
  } finally {
    await context.close();
  }
  return { findings };
}

async function main() {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const report = { baseUrl: BASE, startedAt: new Date().toISOString(), profiles: [], behavioral: {} };

  for (const profile of PROFILES) {
    log(`Running core walkthrough on profile: ${profile.label}`);
    const sink = { consoleMessages: [], cspViolations: [], pageErrors: [], failedRequests: [] };
    const context = await browser.newContext(profile.contextOptions);
    const page = await context.newPage();
    attachDiagnostics(page, sink);
    if (profile.network) {
      const client = await context.newCDPSession(page);
      await client.send('Network.emulateNetworkConditions', profile.network);
    }
    // Slow 3G is a genuine network condition, not a bug surface: every
    // round trip really does take longer, so it earns a longer screen-wait
    // timeout instead of being flagged as broken for taking realistically
    // long. 20s stays the bar for every other profile.
    const timeoutMs = profile.network ? 45_000 : 20_000;
    let walkthroughResult;
    try {
      walkthroughResult = await runCoreWalkthrough(page, profile.label, timeoutMs);
    } catch (err) {
      walkthroughResult = { findings: [`Exception during walkthrough: ${err.message}`] };
    }
    await context.close();
    report.profiles.push({ label: profile.label, ...walkthroughResult, ...sink });
    log(`Profile "${profile.label}" done`, { findings: walkthroughResult.findings.length, cspViolations: sink.cspViolations.length, pageErrors: sink.pageErrors.length });
  }

  // Each behavioral check gets its OWN isolated browser context (created
  // inside each test function), not a shared one -- a shared context means
  // shared localStorage, so the second test would find itself already
  // logged in as the first test's freshly-registered user and every
  // "#tabCreateBtn" wait would hang forever against a login screen that
  // the app correctly never shows to an already-authenticated session.
  log('Running behavioral checks (Desktop viewport, each in its own isolated browser context)');
  report.behavioral.backButton = await testBackButton(browser);
  report.behavioral.sessionExpiration = await testSessionExpiration(browser);
  report.behavioral.autosaveResume = await testAutosaveResume(browser);
  report.behavioral.errorState = await testErrorState(browser);

  await browser.close();
  report.finishedAt = new Date().toISOString();

  console.log('\n========== STAGE 7 BROWSER/DEVICE MATRIX SUMMARY ==========');
  let anyBlocker = false;
  for (const p of report.profiles) {
    const blocker = p.findings.length > 0 || p.cspViolations.length > 0 || p.pageErrors.length > 0;
    anyBlocker = anyBlocker || blocker;
    console.log(`${blocker ? 'FAIL' : 'PASS'} — ${p.label}: findings=${p.findings.length}, CSP violations=${p.cspViolations.length}, page errors=${p.pageErrors.length}, failed requests=${p.failedRequests.length}`);
    p.findings.forEach((f) => console.log(`   - ${f}`));
  }
  console.log('\nBehavioral checks (Desktop only):');
  for (const [name, result] of Object.entries(report.behavioral)) {
    const blocker = result.findings.length > 0;
    anyBlocker = anyBlocker || blocker;
    console.log(`${blocker ? 'FAIL' : 'PASS'} — ${name}`);
    result.findings.forEach((f) => console.log(`   - ${f}`));
  }

  const fs = require('node:fs');
  const reportPath = process.env.REPORT_PATH || 'stage7-browser-matrix-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nFull report written to ${reportPath}`);

  console.log(anyBlocker ? '\nRESULT: FAIL — see findings above.' : '\nRESULT: PASS — zero findings across the full device/network matrix and all behavioral checks.');
  process.exitCode = anyBlocker ? 1 : 0;
}

main().catch((err) => {
  console.error('\nRESULT: ERROR — the matrix run itself failed:', err);
  process.exitCode = 1;
});
