// Workstream 3B — end-to-end website-rendering proof for question 3070
// (2026-09-25). Read/write ONLY against a brand-new, disposable test
// database this script provisions itself (via test/pg-test-support.js's
// setupPrimaryTestDbEnv — the exact same helper the real test suite uses),
// spawned as a real `node server.js` child process, driven by a real
// Chromium browser (Playwright) doing the exact clicks a student would.
// The one touch of the LIVE database is a single read-only SELECT (a
// node:sqlite DatabaseSync opened with { readOnly: true }) to copy question
// 3070's real, already-verified content into the disposable fixture — never
// a write, and that connection is closed before the disposable database is
// even created.
//
// What this proves, item by item against the user's 3B checklist:
//   - "verify the website renders the correct visual for 3070" — a real
//     browser loads the real frontend, logs in, generates a real practice
//     test containing (a fixture equivalent of) question 3070, and opens it.
//   - The server really does prefer the new 'ai_generated' SVG over the
//     existing 'source_cropped' raster crop when both visual_assets rows
//     exist for the same question (this is what makes the priority ORDER BY
//     in server.js's getServableDiagramUrls something other than untested).
//   - The frontend really does take the inline-SVG code path (app.js's
//     createDiagramLoader) for that asset, not the plain <img> path — proven
//     by asserting a real <svg> element exists inside #qDiagramSvgHost, and
//     that #qDiagramImg is hidden, not just by asserting the URL looks right.
//   - Desktop and mobile viewport widths.
//   - Both the app's own in-app light/dark theme toggle states (not the OS
//     prefers-color-scheme signal) — proven by clicking the app's real
//     theme button and reading the resulting #app[data-theme] attribute,
//     the same mechanism a real student's toggle tap drives.
//   - The zoom lightbox, at both theme states.
//
// Screenshots are written to
// docs/workstream-3b-3070-visual-qa-screenshots/ for the written report.
// Nothing here writes to boardready.db. Run with: node scripts/verify-3070-visual-rendering.js

const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { chromium } = require('playwright');

const CHROMIUM_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'workstream-3b-3070-visual-qa-screenshots');
const LIVE_DB_PATH = path.join(__dirname, '..', 'boardready.db');

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERTION FAILED: ' + msg);
}

async function main() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  // ---------------------------------------------------------------------
  // 0. Read-only copy of question 3070's real content from the LIVE db.
  //    Opened and closed before anything else touches process.env/db.js.
  // ---------------------------------------------------------------------
  const liveHashBefore = require('node:crypto').createHash('sha256').update(fs.readFileSync(LIVE_DB_PATH)).digest('hex');
  const liveDb = new DatabaseSync(LIVE_DB_PATH, { readOnly: true });
  const q3070 = liveDb.prepare('SELECT text, options_json, correct, marks, difficulty, kind, question_type, sub_concept FROM questions WHERE id = 3070').get();
  liveDb.close();
  assert(q3070 && q3070.kind === 'mcq', 'expected to read a real mcq row for live question 3070');
  console.log('[0] Read-only copy of live question 3070 content OK. options:', q3070.options_json);

  // ---------------------------------------------------------------------
  // 1. Provision an isolated, disposable test database (never boardready.db)
  //    and require db.js against it — mirrors test/readiness.test.js exactly.
  // ---------------------------------------------------------------------
  const { setupPrimaryTestDbEnv } = require('../test/pg-test-support');
  const dbCtx = setupPrimaryTestDbEnv('visual3070_proof');
  const db = require('../db');
  if (db.DB_PATH === db.LIVE_DB_PATH) throw new Error('FATAL: resolved to the live DB path — refusing to continue.');
  if (!db.IS_TEST_MODE) throw new Error('FATAL: db.js did not recognize this as a test run.');
  console.log('[1] Isolated test database:', db.DB_PATH || dbCtx.dbName);

  const PORT = 4877;
  const BASE = `http://localhost:${PORT}`;
  const { spawn } = require('node:child_process');
  let serverProcess;
  let browser;
  const failures = [];

  try {
    // -------------------------------------------------------------------
    // 2. Seed fixture: an ICSE Mathematics subject/chapter, one question
    //    whose content is a faithful copy of the live 3070 row, and TWO
    //    visual_assets rows (source_cropped + ai_generated) for it — so
    //    this proves the priority rule, not just "a diagram shows up".
    // -------------------------------------------------------------------
    const subj = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('ICSE', 'Mathematics', '10') RETURNING id").run();
    const subjectId = Number(subj.lastInsertRowid);
    const chap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, 'Linear Inequation');
    const chapterId = Number(chap.lastInsertRowid);
    const qIns = await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct, question_type, sub_concept)
                VALUES (?, 'mcq', 'verified', 'verified', ?, ?, ?, ?, ?, ?, ?) RETURNING id`)
      .run(chapterId, q3070.marks, q3070.difficulty, q3070.text, q3070.options_json, q3070.correct, q3070.question_type, q3070.sub_concept);
    const questionId = Number(qIns.lastInsertRowid);
    console.log('[2] Fixture question id (isolated DB):', questionId);

    const sourceCroppedPath = 'extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-CANDIDATE.png';
    const aiGeneratedPath = 'extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-GENERATED.svg';
    assert(fs.existsSync(path.join(__dirname, '..', sourceCroppedPath)), 'source_cropped asset file must exist on disk');
    assert(fs.existsSync(path.join(__dirname, '..', aiGeneratedPath)), 'ai_generated asset file must exist on disk');
    // Inserted in this order deliberately (source_cropped first, by lower id)
    // so that IF the server still preferred "first row by id" (the old,
    // pre-pivot behavior) this proof would visibly fail by showing the
    // raster crop instead of the SVG — a real regression check, not just a
    // happy-path insert order that could never have caught the bug.
    await db.prepare(`INSERT INTO visual_assets (question_id, asset_type, asset_path, figure_label, notes) VALUES (?, 'source_cropped', ?, 'Fig. item 57 number line', 'immutable original-pixels reference crop')`).run(questionId, sourceCroppedPath);
    await db.prepare(`INSERT INTO visual_assets (question_id, asset_type, asset_path, figure_label, notes) VALUES (?, 'ai_generated', ?, 'Fig. item 57 number line', 'Board Ready native redraw')`).run(questionId, aiGeneratedPath);
    console.log('[2] Seeded source_cropped (id-lower, inserted first) and ai_generated visual_assets rows.');

    // -------------------------------------------------------------------
    // 3. Spawn the real server against the isolated DB.
    // -------------------------------------------------------------------
    serverProcess = spawn('node', ['server.js'], {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, PORT: String(PORT), ...dbCtx.childEnv },
      stdio: 'pipe',
    });
    serverProcess.stderr.on('data', (d) => process.stderr.write(`[server] ${d}`));
    const waitStart = Date.now();
    while (Date.now() - waitStart < 15000) {
      try { const r = await fetch(`${BASE}/api/subjects`); if (r.ok || r.status === 404) break; } catch { /* not up yet */ }
      await new Promise((r) => setTimeout(r, 200));
    }
    console.log('[3] Server up at', BASE);

    // -------------------------------------------------------------------
    // 4. Register a real student via the real HTTP API (same as the actual
    //    sign-up flow), then confirm the API-level diagram_url resolution
    //    directly before ever touching a browser — isolates "does the
    //    backend pick the right asset" from "does the frontend render it".
    // -------------------------------------------------------------------
    const email = `visual3070-${Date.now()}@boardready.test`;
    const password = 'testpass123';
    const reg = await fetch(`${BASE}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Visual QA Student', email, password, role: 'student' }) }).then((r) => r.json());
    assert(reg.token, 'registration must return a token');
    const gen = await fetch(`${BASE}/api/practice/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` }, body: JSON.stringify({ subjectId, chapterId, count: 1 }) }).then((r) => r.json());
    const attempt = await fetch(`${BASE}/api/attempts`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` }, body: JSON.stringify({ test_id: gen.id }) }).then((r) => r.json());
    const qres = await fetch(`${BASE}/api/attempts/${attempt.id}/questions`, { headers: { Authorization: `Bearer ${reg.token}` } }).then((r) => r.json());
    const step = qres.steps.find((s) => s.questionId === questionId);
    assert(step, 'the generated test must include the fixture question');
    assert(step.diagramUrl === '/' + aiGeneratedPath, `expected diagramUrl to be the ai_generated SVG (${'/' + aiGeneratedPath}), got ${step.diagramUrl}`);
    console.log('[4] API-level check PASSED: diagram_url resolves to the ai_generated SVG, not the source_cropped raster crop:', step.diagramUrl);

    // -------------------------------------------------------------------
    // 5. Real browser, real UI clicks: login -> ICSE -> Practice on the
    //    fixture chapter -> question screen. Runs the light-theme pass,
    //    then a fresh student + a real theme-button click for the dark pass.
    // -------------------------------------------------------------------
    browser = await chromium.launch({ executablePath: CHROMIUM_PATH });

    async function runThemePass(themeName, userEmail, clickThemeToggle) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      page.on('pageerror', (err) => consoleErrors.push(String(err)));

      await page.goto(BASE + '/');
      await page.fill('#loginEmail', userEmail);
      await page.fill('#loginPassword', password);
      await page.click('#loginForm button[type="submit"], #loginForm button:not([type])');
      await page.waitForSelector('[data-screen="dash"]:not([hidden])', { timeout: 10000 });

      // The app's own default (state.theme in app.js) is 'dark' — confirmed
      // by reading app.js rather than assumed. A pass that wants 'light'
      // must click the real in-app toggle once; a pass that wants the
      // default 'dark' must NOT click it (clicking twice would land back on
      // light). Either way this is the app's own theme mechanism, never the
      // OS-level prefers-color-scheme signal.
      if (clickThemeToggle) await page.click('#themeBtn2');
      const themeNow = await page.getAttribute('#app', 'data-theme');
      assert(themeNow === themeName, `expected theme "${themeName}" going into the test screen, got "${themeNow}"`);

      await page.click('#dashBoardChips button[data-board="ICSE"]');
      await page.waitForSelector('#chaptersList [data-act="practice"]', { timeout: 10000 });
      await page.click('#chaptersList [data-act="practice"]');
      await page.waitForSelector('[data-screen="test"]:not([hidden])', { timeout: 10000 });
      await page.waitForSelector('#qDiagramWrap:not([hidden])', { timeout: 10000 });
      await page.waitForFunction(() => {
        const host = document.querySelector('#qDiagramSvgHost');
        return host && !host.hidden && host.querySelector('svg');
      }, { timeout: 10000 });

      // DOM-level proof the inline-SVG path actually ran, not the <img> path.
      const domCheck = await page.evaluate(() => {
        const img = document.querySelector('#qDiagramImg');
        const host = document.querySelector('#qDiagramSvgHost');
        return {
          imgHidden: img.hidden,
          imgSrc: img.getAttribute('src'),
          hostHidden: host.hidden,
          hasSvg: Boolean(host.querySelector('svg')),
          svgHasFilledDots: host.querySelectorAll('.nl-dot-filled').length,
          svgHasOpenDot: host.querySelectorAll('.nl-dot-open').length,
        };
      });
      assert(domCheck.imgHidden === true, 'raster <img> must be hidden when an SVG asset is served');
      assert(!domCheck.imgSrc, 'raster <img> must have no src when an SVG asset is served');
      assert(domCheck.hostHidden === false, 'the SVG host must be visible');
      assert(domCheck.hasSvg === true, 'the SVG host must contain a real inlined <svg> element');
      assert(domCheck.svgHasFilledDots === 9, `expected 9 filled dots (-3..5), got ${domCheck.svgHasFilledDots}`);
      assert(domCheck.svgHasOpenDot === 1, `expected exactly 1 open dot (-4), got ${domCheck.svgHasOpenDot}`);
      console.log(`[5:${themeName}] DOM-level checks PASSED:`, domCheck);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `question-${themeName}-desktop.png`) });

      // Lightbox (desktop)
      await page.click('#qDiagramWrap');
      await page.waitForSelector('#diagramLightbox:not([hidden])', { timeout: 5000 });
      await page.waitForFunction(() => {
        const host = document.querySelector('#lightboxSvgHost');
        return host && !host.hidden && host.querySelector('svg');
      }, { timeout: 5000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `lightbox-${themeName}-desktop.png`) });
      await page.keyboard.press('Escape');
      await page.waitForSelector('#diagramLightbox', { state: 'hidden', timeout: 5000 });

      // Mobile viewport
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `question-${themeName}-mobile.png`) });
      await page.click('#qDiagramWrap');
      await page.waitForSelector('#diagramLightbox:not([hidden])', { timeout: 5000 });
      await page.waitForFunction(() => {
        const host = document.querySelector('#lightboxSvgHost');
        return host && !host.hidden && host.querySelector('svg');
      }, { timeout: 5000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `lightbox-${themeName}-mobile.png`) });
      await page.keyboard.press('Escape');

      // Filters out this sandbox's own outbound-network restriction on the
      // page's (pre-existing, unrelated-to-this-workstream) Google Fonts
      // request — every real page load here hits it once regardless of the
      // diagram feature, since https://fonts.googleapis.com isn't reachable
      // from this container's browser network policy. Not a regression: the
      // page already declares real fallback font stacks for exactly this
      // case, and a real deployment/dev environment with normal internet
      // access loads the font fine. Any OTHER console/page error still fails
      // this proof.
      const realErrors = consoleErrors.filter((e) => !/fonts\.googleapis\.com/i.test(e) && !/ERR_TUNNEL_CONNECTION_FAILED/i.test(e));
      if (realErrors.length) {
        failures.push(`[${themeName}] browser console/page errors: ${JSON.stringify(realErrors)}`);
      } else if (consoleErrors.length) {
        console.log(`[5:${themeName}] (ignored, unrelated to this workstream: sandbox network policy blocked the page's Google Fonts request)`);
      }
      await context.close();
    }

    // Two independent students (one per theme pass) so each pass starts from
    // a clean login rather than reusing a session/localStorage state.
    // Pass 1: the app's own actual default — 'dark' — with no toggle click.
    await runThemePass('dark', email, false);

    // Pass 2: 'light', reached by clicking the app's real in-app theme
    // toggle exactly once (never by simulating prefers-color-scheme).
    const email2 = `visual3070-light-${Date.now()}@boardready.test`;
    const reg2 = await fetch(`${BASE}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Visual QA Student Light', email: email2, password, role: 'student' }) }).then((r) => r.json());
    assert(reg2.token, 'second registration must return a token');
    await runThemePass('light', email2, true);

    console.log('\n=== RESULT ===');
    if (failures.length) {
      console.log('FAILURES:', failures);
      process.exitCode = 1;
    } else {
      console.log('ALL CHECKS PASSED. Screenshots written to', SCREENSHOT_DIR);
    }
  } finally {
    if (browser) await browser.close();
    if (serverProcess) serverProcess.kill();
    dbCtx.cleanup();
    const liveHashAfter = require('node:crypto').createHash('sha256').update(fs.readFileSync(LIVE_DB_PATH)).digest('hex');
    console.log('\nLive DB hash before:', liveHashBefore);
    console.log('Live DB hash after: ', liveHashAfter);
    if (liveHashBefore !== liveHashAfter) {
      console.error('FATAL: LIVE DATABASE HASH CHANGED DURING THIS SCRIPT RUN.');
      process.exitCode = 1;
    }
  }
}

main().catch((err) => { console.error(err); process.exitCode = 1; });
