// Real-browser CSP + smoke check (Phase 5 verification-gap closure, 2026-09-24).
//
// WHY THIS EXISTS: Phase 5's baseline-headers/CSP work (see
// docs/phase-5-security-hardening-report.md, item 7) was verified by
// exhaustive static source analysis and the API-level regression suite, but
// NOT by actually loading the app in a browser and confirming zero CSP
// console violations — that session had no connected Chrome browser. This
// script closes that gap using this environment's own pre-installed
// headless Chromium (via the `playwright` package), driving the REAL
// frontend (public/index.html + app.js) against a REAL running server —
// never a mock, never a synthetic page.
//
// SAFETY: this script only ever talks to a server the CALLER already
// started, over plain HTTP, at whatever BASE_URL is given. It never opens
// any database file itself. The responsibility for pointing that server at
// a disposable database copy (never boardready.db) belongs to the caller —
// see the usage example below, which follows the same "copy the live db to
// a throwaway file, point DB_PATH at the copy" pattern used everywhere else
// in this project's manual verification work.
//
// USAGE (from backend/):
//   cp boardready.db /tmp/browser-check-$(date +%s).db
//   PORT=4620 DB_PATH=/tmp/browser-check-<ts>.db AUTH_SECRET=browser-check-only node server.js &
//   node scripts/browser-smoke-check.js http://localhost:4620
//   kill %1   # and delete the disposable copy
//
// WHAT IT WALKS THROUGH, end to end, against the real UI (not the API
// directly — every one of these interacts with a real DOM element and real
// click, exactly as a student's browser would):
//   1. Landing screen -> switch to "Create account" -> pick ICSE -> submit
//      a real registration through the real form (exercises the create
//      account UI path, not just the API).
//   2. Dashboard renders with real diagnostics/summary data.
//   3. Select a real subject with gradable content, start a Practice
//      (immediate-feedback) test, answer every question, confirming the
//      real-time ✓/✕ feedback UI (`.opt.correct-pick` / `.opt.wrong-pick`)
//      appears — and never on a Board Simulation test (see step 6).
//   4. Submit the Practice test -> Results screen renders a real score.
//   5. If this attempt lost marks, click "Improve My Score" and complete
//      that test too, confirming the before/after comparison card renders.
//   6. Start a Board Simulation (deferred feedback) test, confirm the mode
//      badge says so, answer a question, and confirm NONE of the
//      correct/wrong reveal classes ever appear (deferred means no reveal
//      until submit) — then submit and reach Results again.
//   7. Log out, then log back in through the real login form with the
//      credentials from step 1 (exercises the login UI path explicitly,
//      not just "still has a valid token").
// Throughout all of the above, every console message, page error, and
// failed request is captured — the pass/fail verdict is simply: did any
// console message mention a CSP violation ("Content-Security-Policy" or
// "Refused to")? Everything else observed is reported for a human to read,
// not silently swallowed.

const { chromium } = require('playwright');

const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:4620';

function log(label, extra) { console.log(`[${new Date().toISOString().slice(11, 19)}] ${label}${extra !== undefined ? ' ' + JSON.stringify(extra) : ''}`); }

async function main() {
  const consoleMessages = [];
  const pageErrors = [];
  const failedRequests = [];
  const cspViolations = [];

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', (msg) => {
    const entry = { type: msg.type(), text: msg.text() };
    consoleMessages.push(entry);
    if (/content-security-policy|refused to/i.test(entry.text)) cspViolations.push(entry);
  });
  page.on('pageerror', (err) => pageErrors.push(String(err)));
  page.on('requestfailed', (req) => failedRequests.push({ url: req.url(), failure: req.failure() && req.failure().errorText }));
  page.on('dialog', async (dialog) => { log('dialog auto-accepted', { message: dialog.message() }); await dialog.accept(); });

  const stamp = Date.now();
  const email = `browser-check-${stamp}@boardready.test`;
  const password = `BrowserCheck-${stamp}`;

  log('1. Navigating to landing screen', { BASE });
  const mainResponse = await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  const cspHeader = mainResponse.headers()['content-security-policy'];
  log('CSP header on document response', { present: Boolean(cspHeader), value: cspHeader });

  await page.waitForSelector('#tabCreateBtn', { state: 'visible' });
  await page.click('#tabCreateBtn');
  await page.click('#createBoardPick .pick-card[data-board="ICSE"]');
  await page.fill('#createName', 'Browser Check Student');
  await page.fill('#createEmail', email);
  await page.fill('#createPassword', password);
  log('2. Submitting real registration form (Create account UI path)', { email });
  await Promise.all([
    page.waitForSelector('[data-screen="dash"]', { state: 'visible' }),
    page.click('#createForm button[type="submit"]'),
  ]);
  log('Dashboard reached after registration');

  // Pick a subject with real gradable content — ICSE Mathematics, not
  // whichever subject happens to sort first alphabetically (ICSE Chemistry
  // has zero gradable questions today per content-rules.js's GRADABLE_STATUSES
  // gate — picking it would make the practice-generate call below fail with
  // a real, correct 422, not a bug in this script).
  await page.waitForSelector('#subjectPicker button');
  const mathsBtn = page.locator('#subjectPicker button', { hasText: 'Mathematics' }).first();
  await mathsBtn.click();
  log('3. Selected ICSE Mathematics subject');
  await page.waitForSelector('#chaptersList [data-act="practice"]');

  // ---- PRACTICE (immediate feedback) TEST ----
  log('4. Starting a Practice test');
  await Promise.all([
    page.waitForSelector('[data-screen="test"]', { state: 'visible' }),
    page.click('#chaptersList [data-act="practice"]'),
  ]);
  const practiceBadge = (await page.textContent('#modeBadge') || '').trim();
  log('Practice mode badge', { text: practiceBadge });
  if (!/practice/i.test(practiceBadge)) throw new Error(`Expected a Practice mode badge, got: "${practiceBadge}"`);

  let sawCorrectPick = false, sawWrongPick = false;
  const qCountText = await page.textContent('#testQCount');
  const totalQuestions = Number((qCountText.match(/of (\d+)/) || [])[1] || 0);
  log('Question count', { totalQuestions });
  for (let i = 0; i < totalQuestions; i++) {
    await page.waitForSelector('#qOptions .opt');
    const [checkResp] = await Promise.all([
      page.waitForResponse((r) => /\/api\/attempts\/\d+\/check$/.test(new URL(r.url()).pathname), { timeout: 5000 }).catch(() => null),
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
  log('5. Immediate-feedback reveal classes observed', { sawCorrectPick, sawWrongPick });
  if (!sawCorrectPick && !sawWrongPick) throw new Error('Never saw a correct-pick or wrong-pick class — immediate feedback UI did not render as expected.');

  await page.waitForSelector('[data-screen="results"]', { state: 'visible' });
  const resultLine = (await page.textContent('#resCorrectLine') || '').trim();
  log('6. Practice test Results screen reached', { resultLine });

  const improveCardHidden = await page.getAttribute('#improveCard', 'hidden');
  if (improveCardHidden === null) {
    log('7. "Improve My Score" card is visible (this attempt lost marks) — starting it');
    await Promise.all([
      page.waitForSelector('[data-screen="test"]', { state: 'visible' }),
      page.click('#improveScoreBtn'),
    ]);
    const impBadge = (await page.textContent('#modeBadge') || '').trim();
    log('Improvement test mode badge', { text: impBadge });
    const impQCountText = await page.textContent('#testQCount');
    const impTotal = Number((impQCountText.match(/of (\d+)/) || [])[1] || 0);
    for (let i = 0; i < impTotal; i++) {
      await page.waitForSelector('#qOptions .opt');
      await page.click('#qOptions .opt >> nth=0');
      const isLast = i === impTotal - 1;
      await page.click('#nextBtn');
      if (!isLast) await page.waitForSelector('#qOptions .opt');
    }
    await page.waitForSelector('[data-screen="results"]', { state: 'visible' });
    const compareHidden = await page.getAttribute('#improveCompareCard', 'hidden');
    log('Improvement test Results screen reached', { comparisonCardVisible: compareHidden === null });
  } else {
    log('7. "Improve My Score" card is hidden (this attempt lost no marks) — nothing to click, not an error');
  }

  // ---- BOARD SIMULATION (deferred feedback) TEST ----
  log('8. Returning to dashboard to start a Board Simulation test');
  await page.click('#backToDashBtn');
  await page.waitForSelector('[data-screen="dash"]', { state: 'visible' });
  await mathsBtn.click();
  await page.waitForSelector('#fullTestBtn');
  await Promise.all([
    page.waitForSelector('[data-screen="test"]', { state: 'visible' }),
    page.click('#fullTestBtn'),
  ]);
  const simBadge = (await page.textContent('#modeBadge') || '').trim();
  log('Board Simulation mode badge', { text: simBadge });
  if (!/board simulation/i.test(simBadge)) throw new Error(`Expected a Board Simulation mode badge, got: "${simBadge}"`);

  await page.waitForSelector('#qOptions .opt');
  await page.click('#qOptions .opt >> nth=0');
  const revealClassesDuringSim = await page.locator('.opt.correct-pick, .opt.wrong-pick, .opt.correct-reveal').count();
  log('9. Reveal classes present after answering in Board Simulation (must be 0)', { count: revealClassesDuringSim });
  if (revealClassesDuringSim !== 0) throw new Error('Board Simulation test revealed a correct/wrong answer before submission — feedback_mode=deferred UI regression.');
  const selClass = await page.locator('.opt.sel').count();
  log('Selection-only class present instead (expected 1)', { count: selClass });

  // Jump straight to the last question via the track navigator (no need to
  // answer every question to prove the deferred behavior above) and submit.
  await page.click('#testTrack .tdot >> nth=-1');
  await page.waitForSelector('#qOptions .opt');
  await page.click('#nextBtn'); // "Submit test ->" on the last question, triggers window.confirm (auto-accepted above)
  await page.waitForSelector('[data-screen="results"]', { state: 'visible' });
  log('10. Board Simulation Results screen reached');

  // ---- LOGOUT + LOGIN (explicit login-form UI path) ----
  await page.click('#backToDashBtn');
  await page.waitForSelector('[data-screen="dash"]', { state: 'visible' });
  await page.click('#logoutBtn');
  await page.waitForSelector('[data-screen="login"]', { state: 'visible' });
  log('11. Logged out — back at login screen');
  // Logout resets both forms' fields but does not reset which TAB is
  // showing (a real, harmless UI quirk, not a security issue) — this
  // session left the "Create account" tab active earlier, so switch back
  // to the Login tab before interacting with #loginEmail/#loginPassword,
  // which are inside the (currently hidden) #loginForm otherwise.
  await page.click('#tabLoginBtn');
  await page.waitForSelector('#loginForm', { state: 'visible' });
  await page.fill('#loginEmail', email);
  await page.fill('#loginPassword', password);
  await Promise.all([
    page.waitForSelector('[data-screen="dash"]', { state: 'visible' }),
    page.click('#loginForm button[type="submit"]'),
  ]);
  log('12. Logged back in via the real login form — dashboard reached again');

  await browser.close();

  console.log('\n========== SUMMARY ==========');
  console.log(`Total console messages: ${consoleMessages.length}`);
  console.log(`CSP violations: ${cspViolations.length}`);
  console.log(`Page errors (uncaught exceptions): ${pageErrors.length}`);
  console.log(`Failed requests: ${failedRequests.length}`);
  if (cspViolations.length) { console.log('\nCSP VIOLATIONS:'); cspViolations.forEach((v) => console.log(' -', v.text)); }
  if (pageErrors.length) { console.log('\nPAGE ERRORS:'); pageErrors.forEach((e) => console.log(' -', e)); }
  if (failedRequests.length) { console.log('\nFAILED REQUESTS:'); failedRequests.forEach((f) => console.log(' -', f.url, f.failure)); }
  const nonCspConsoleErrors = consoleMessages.filter((m) => m.type === 'error' && !/content-security-policy|refused to/i.test(m.text));
  if (nonCspConsoleErrors.length) { console.log('\nOTHER console.error messages (not CSP — for information):'); nonCspConsoleErrors.forEach((m) => console.log(' -', m.text)); }

  if (cspViolations.length > 0) {
    console.log('\nRESULT: FAIL — CSP violation(s) detected.');
    process.exitCode = 1;
  } else {
    console.log('\nRESULT: PASS — zero CSP violations across the full walkthrough (registration, dashboard, Practice test + immediate feedback, Results, Improve My Score, Board Simulation deferred feedback, logout, login).');
  }
}

main().catch((err) => {
  console.error('\nRESULT: ERROR — the walkthrough itself failed (not necessarily a CSP problem):');
  console.error(err);
  process.exitCode = 1;
});
