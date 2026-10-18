// Automated accessibility check for the redesigned student UI (2026-10-18).
//
// Drives the REAL frontend against a server the caller already started (on a
// disposable database — never boardready.db), runs axe-core on every main
// screen state in both themes at desktop and phone widths, and runs a set of
// keyboard / focus checks that axe cannot do on its own.
//
// Usage (needs `playwright` and `axe-core`, e.g. `npm install --no-save
// playwright axe-core`; PW_CHANNEL=chrome uses an installed Chrome):
//   node scripts/a11y-axe-check.js http://localhost:4692
// Exit code 1 if any serious/critical axe violation or keyboard check fails.
//
// axe is injected with page.addScriptTag, which the app's CSP (script-src
// 'self') would block, so the test browser context sets bypassCSP. That only
// affects this test browser; the server's CSP is unchanged.

const fs = require('node:fs');
const { chromium } = require('playwright');

const BASE = process.argv[2] || process.env.BASE_URL || 'http://localhost:4692';
const AXE_PATH = require.resolve('axe-core/axe.min.js');
const LAUNCH_OPTS = { headless: true, args: ['--no-sandbox'], ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}) };
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const VIEWPORTS = [
  { label: 'desktop-1440', viewport: { width: 1440, height: 900 } },
  { label: 'mobile-390', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
];

function log(msg, extra) { console.log(`[a11y] ${msg}${extra !== undefined ? ' ' + JSON.stringify(extra) : ''}`); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const visibleScreen = (page) => page.evaluate(() => [...document.querySelectorAll('.screen')].filter((s) => !s.hidden).map((s) => s.dataset.screen)[0]);

async function axeScan(page, label, results) {
  await page.addScriptTag({ path: AXE_PATH });
  const r = await page.evaluate(async (tags) => {
    // eslint-disable-next-line no-undef
    const out = await axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] });
    return out.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, count: v.nodes.length, targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }));
  }, TAGS);
  results.push({ state: label, violations: r });
  log(`${label}: ${r.length ? r.map((v) => `${v.id}(${v.impact}) x${v.count}`).join(', ') : 'no violations'}`);
}

async function setTheme(page, theme) {
  await page.evaluate((t) => {
    const app = document.getElementById('app');
    if (app.getAttribute('data-theme') !== t) document.getElementById(document.querySelector('[data-screen="login"]:not([hidden])') ? 'themeBtn' : 'themeBtn2').click();
  }, theme);
  await sleep(150);
}

async function registerViaUi(page, board) {
  const stamp = `${Date.now()}_${Math.floor(Math.random() * 1e6)}`;
  await page.click('#tabCreateBtn');
  await page.click(`#createBoardPick .pick-card[data-board="${board}"]`);
  await page.fill('#createName', 'A11y Check Student');
  await page.fill('#createEmail', `a11y-${stamp}@boardready.test`);
  await page.fill('#createPassword', `A11yCheck-${stamp}`);
  await Promise.all([page.waitForSelector('[data-screen="dash"]', { state: 'visible', timeout: 20000 }), page.click('#createForm button[type="submit"]')]);
}

async function answerAll(page) {
  const n = await page.locator('#testTrack .tdot').count();
  for (let i = 0; i < n; i++) {
    if (await page.locator('#qOptions .opt:not([disabled])').count()) {
      await Promise.all([
        page.waitForResponse((r) => /\/check$/.test(new URL(r.url()).pathname), { timeout: 4000 }).catch(() => null),
        page.keyboard.press(['a', 'b', 'c', 'd'][i % 4]),
      ]);
    }
    if (i < n - 1) await page.keyboard.press('ArrowRight');
  }
}

// ---- keyboard / focus checks (desktop, dark) ----
async function keyboardChecks(page, findings) {
  const check = (ok, msg) => { if (!ok) findings.push(msg); log(`${ok ? 'PASS' : 'FAIL'} keyboard: ${msg}`); };

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#loginForm');
  await page.keyboard.press('Tab');
  check(await page.evaluate(() => document.activeElement.classList.contains('skip-link')), 'first Tab reaches the skip link');
  const skipVisible = await page.evaluate(() => document.activeElement.getBoundingClientRect().top >= 0);
  check(skipVisible, 'skip link becomes visible when focused');
  let reachedEmail = false;
  for (let i = 0; i < 12 && !reachedEmail; i++) { await page.keyboard.press('Tab'); reachedEmail = await page.evaluate(() => document.activeElement.id === 'loginEmail'); }
  check(reachedEmail, 'login email field is reachable by Tab');
  const outline = await page.evaluate(() => { const s = getComputedStyle(document.activeElement); return s.outlineStyle !== 'none' || s.boxShadow !== 'none'; });
  check(outline, 'focused input shows a visible focus indicator');

  await registerViaUi(page, 'ICSE');
  // nav is keyboard operable
  await page.focus('.nav-link[data-nav="practice"]');
  await page.keyboard.press('Enter');
  check(await visibleScreen(page) === 'practice', 'Enter on the Practice nav link opens Practice');
  const navOutline = await page.evaluate(() => { const el = document.querySelector('.nav-link[data-nav="practice"]'); el.focus(); return getComputedStyle(el).outlineStyle !== 'none'; });
  check(navOutline, 'nav link shows a focus ring (:focus-visible)');

  // start a test with the keyboard
  await page.locator('#subjectPicker button', { hasText: 'Mathematics' }).first().focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('#chaptersList [data-act="practice"]:not([disabled])');
  await page.locator('#chaptersList [data-act="practice"]:not([disabled])').first().focus();
  await Promise.all([page.waitForSelector('[data-screen="test"]', { state: 'visible', timeout: 20000 }), page.keyboard.press('Enter')]);
  check(true, 'Practice test starts from the keyboard (Enter on chapter button)');

  await Promise.all([page.waitForResponse((r) => /\/check$/.test(new URL(r.url()).pathname), { timeout: 5000 }).catch(() => null), page.keyboard.press('b')]);
  check(await page.locator('.opt.correct-pick, .opt.wrong-pick').count() > 0, 'letter key B answers the question (Practice feedback shown)');
  await page.keyboard.press('ArrowRight');
  check((await page.textContent('#testQCount')).startsWith('Question 2'), 'ArrowRight moves to the next question');
  check(await page.evaluate(() => document.getElementById('qLiveRegion').textContent.startsWith('Question 2')), 'question change is announced in the live region');

  // submit dialog: focus moves in, Tab is trapped, Escape closes and returns focus
  await page.focus('#submitTestBtn');
  await page.keyboard.press('Enter');
  await page.waitForSelector('#submitDialog:not([hidden])');
  check(await page.evaluate(() => document.activeElement.id === 'sdCancel'), 'submit dialog moves focus to "Keep working"');
  for (let i = 0; i < 4; i++) await page.keyboard.press('Tab');
  check(await page.evaluate(() => !!document.activeElement.closest('#submitDialog')), 'Tab stays inside the submit dialog (focus trap)');
  await page.keyboard.press('Escape');
  check(await page.evaluate(() => document.getElementById('submitDialog').hidden), 'Escape closes the submit dialog');
  check(await page.evaluate(() => document.activeElement.id === 'submitTestBtn'), 'focus returns to the Submit button after closing');
  const optName = await page.evaluate(() => (document.querySelector('#qOptions .opt') || {}).getAttribute && document.querySelector('#qOptions .opt').getAttribute('aria-label'));
  check(Boolean(optName && /^Option A:/.test(optName)), 'answer options expose an accessible name ("Option A: …")');
}

async function main() {
  const browser = await chromium.launch(LAUNCH_OPTS);
  const results = [];
  const keyboardFindings = [];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: vp.viewport, isMobile: !!vp.isMobile, hasTouch: !!vp.hasTouch, bypassCSP: true, reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto(BASE, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#loginForm');
    for (const theme of ['dark', 'light']) { await setTheme(page, theme); await axeScan(page, `${vp.label}/${theme}/login`, results); }
    await setTheme(page, 'dark');
    await page.click('#tabCreateBtn');
    await axeScan(page, `${vp.label}/dark/login-create-tab`, results);
    await page.click('#tabLoginBtn');

    await registerViaUi(page, 'ICSE');
    await page.click('#unlockBtn').catch(() => {});
    await sleep(1500);
    for (const theme of ['dark', 'light']) { await setTheme(page, theme); await axeScan(page, `${vp.label}/${theme}/dashboard`, results); }
    await setTheme(page, 'dark');

    await page.click('.nav-link[data-nav="practice"]');
    await page.locator('#subjectPicker button', { hasText: 'Mathematics' }).first().click();
    await page.waitForSelector('#chaptersList [data-act="practice"]:not([disabled])');
    for (const theme of ['dark', 'light']) { await setTheme(page, theme); await axeScan(page, `${vp.label}/${theme}/practice`, results); }
    await setTheme(page, 'dark');

    await Promise.all([page.waitForSelector('[data-screen="test"]', { state: 'visible', timeout: 20000 }), page.locator('#chaptersList [data-act="practice"]:not([disabled])').first().click()]);
    await Promise.all([page.waitForResponse((r) => /\/check$/.test(new URL(r.url()).pathname), { timeout: 5000 }).catch(() => null), page.keyboard.press('a')]);
    for (const theme of ['dark', 'light']) { await setTheme(page, theme); await axeScan(page, `${vp.label}/${theme}/test-practice-feedback`, results); }
    await setTheme(page, 'dark');
    if (vp.isMobile) { await page.click('#navToggleBtn'); await sleep(300); await axeScan(page, `${vp.label}/dark/test-navigator-drawer`, results); await page.click('#navCloseBtn'); }
    await answerAll(page);
    await page.click('#submitTestBtn').catch(async () => { await page.click('#navToggleBtn'); await page.click('#submitTestBtn'); });
    await page.waitForSelector('#submitDialog:not([hidden])');
    await axeScan(page, `${vp.label}/dark/submit-dialog`, results);
    await Promise.all([page.waitForSelector('[data-screen="results"]', { state: 'visible', timeout: 20000 }), page.click('#sdConfirm')]);
    await sleep(800);
    for (const theme of ['dark', 'light']) { await setTheme(page, theme); await axeScan(page, `${vp.label}/${theme}/results`, results); }
    await setTheme(page, 'dark');

    if (!(await page.locator('#improveScoreBtn').isDisabled()) && await page.locator('#improveCard').isVisible()) {
      await Promise.all([page.waitForSelector('[data-screen="test"]', { state: 'visible', timeout: 20000 }), page.click('#improveScoreBtn')]);
      await page.keyboard.press('b');
      await axeScan(page, `${vp.label}/dark/test-targeted-retest`, results);
      await answerAll(page);
      await page.click('#submitTestBtn').catch(async () => { await page.click('#navToggleBtn'); await page.click('#submitTestBtn'); });
      await page.waitForSelector('#submitDialog:not([hidden])');
      await Promise.all([page.waitForSelector('[data-screen="improve"]', { state: 'visible', timeout: 20000 }), page.click('#sdConfirm')]);
      await sleep(800);
      for (const theme of ['dark', 'light']) { await setTheme(page, theme); await axeScan(page, `${vp.label}/${theme}/improve`, results); }
    } else {
      log(`${vp.label}: Improve My Score not available for this attempt — Improve screen not scanned in this pass`);
    }
    await context.close();
  }

  const kctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await keyboardChecks(await kctx.newPage(), keyboardFindings).catch((e) => keyboardFindings.push(`keyboard run aborted: ${e.message.split('\n')[0]}`));
  await kctx.close();
  await browser.close();

  // ---- summary ----
  const byRule = new Map();
  for (const s of results) for (const v of s.violations) {
    const k = `${v.id}|${v.impact}`;
    if (!byRule.has(k)) byRule.set(k, { id: v.id, impact: v.impact, help: v.help, states: [], nodes: 0, sample: v.targets });
    const e = byRule.get(k); e.states.push(s.state); e.nodes += v.count;
  }
  console.log('\n========== ACCESSIBILITY SUMMARY ==========');
  console.log(`States scanned: ${results.length} (axe-core ${require('axe-core/package.json').version}, tags: ${TAGS.join(', ')})`);
  if (!byRule.size) console.log('axe: no violations in any scanned state');
  for (const e of byRule.values()) console.log(`axe ${e.impact.toUpperCase()} ${e.id} — ${e.help} — ${e.nodes} node(s) in ${e.states.length} state(s), e.g. ${e.sample.join(' | ')}`);
  console.log(`Keyboard/focus checks: ${keyboardFindings.length ? keyboardFindings.length + ' FAILED' : 'all passed'}`);
  keyboardFindings.forEach((f) => console.log(`  - ${f}`));
  const blocking = [...byRule.values()].filter((e) => e.impact === 'serious' || e.impact === 'critical');
  const reportPath = process.env.REPORT_PATH || 'a11y-axe-report.json';
  fs.writeFileSync(reportPath, JSON.stringify({ base: BASE, at: new Date().toISOString(), results, keyboardFindings }, null, 2));
  console.log(`Full report: ${reportPath}`);
  const fail = blocking.length > 0 || keyboardFindings.length > 0;
  console.log(fail ? '\nRESULT: FAIL' : '\nRESULT: PASS — no serious/critical axe violations and all keyboard checks passed');
  process.exitCode = fail ? 1 : 0;
}

main().catch((err) => { console.error('RESULT: ERROR', err); process.exitCode = 1; });
