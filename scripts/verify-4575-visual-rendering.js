// Workstream 3D — end-to-end website-rendering proof for question 4575
// (2026-09-25), the graph-reconstruction pilot chosen from the Workstream 3C
// shortlist. Same discipline as scripts/verify-3070-visual-rendering.js:
// read/write ONLY against a brand-new, disposable test database this script
// provisions itself (via test/pg-test-support.js's setupPrimaryTestDbEnv),
// spawned as a real `node server.js` child process, driven by a real
// Chromium browser (Playwright) doing the exact clicks a student would. The
// one touch of the LIVE database is a single read-only SELECT to copy
// question 4575's real, already-verified content into the disposable
// fixture — never a write, and that connection is closed before the
// disposable database is even created. The live boardready.db is NOT
// modified by this script, and this proof intentionally runs BEFORE any
// live association — per the instruction, the live DB stays untouched until
// this visual has independently passed.
//
// What this proves, item by item:
//   - The server prefers the new 'ai_generated' graph SVG over a
//     'source_cropped' raster crop when both visual_assets rows exist for
//     the same question (same priority-ORDER-BY regression check as 3070:
//     source_cropped is inserted FIRST/lower id deliberately).
//   - The frontend takes the inline-SVG code path (app.js's
//     createDiagramLoader), not the plain <img> path.
//   - Desktop and mobile viewport widths.
//   - Both of the app's own in-app light/dark theme states (never the OS
//     prefers-color-scheme signal).
//   - The zoom lightbox, at both theme states.
//   - Semantic fidelity of the DOM content: exactly one curve path
//     (.gr-curve), exactly one function label reading "y = p(x)"
//     (.gr-fn-label), and exactly two straight axis lines (line.gr-axis) —
//     i.e. the SVG that actually loaded is the graph redraw, not some other
//     asset or a broken/partial fetch.
//
// Screenshots are written to
// docs/workstream-3d-4575-visual-qa-screenshots/ for the written report.
// Run with: node scripts/verify-4575-visual-rendering.js

const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { chromium } = require('playwright');

const CHROMIUM_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'workstream-3d-4575-visual-qa-screenshots');
const LIVE_DB_PATH = path.join(__dirname, '..', 'boardready.db');

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERTION FAILED: ' + msg);
}

async function main() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  // ---------------------------------------------------------------------
  // 0. Read-only copy of question 4575's real content from the LIVE db.
  //    Opened and closed before anything else touches process.env/db.js.
  // ---------------------------------------------------------------------
  const liveHashBefore = require('node:crypto').createHash('sha256').update(fs.readFileSync(LIVE_DB_PATH)).digest('hex');
  const liveDb = new DatabaseSync(LIVE_DB_PATH, { readOnly: true });
  const q4575 = liveDb.prepare('SELECT text, options_json, correct, marks, difficulty, kind, question_type, sub_concept, status, answer_status FROM questions WHERE id = 4575').get();
  liveDb.close();
  assert(q4575 && q4575.kind === 'mcq', 'expected to read a real mcq row for live question 4575');
  assert(q4575.answer_status === 'verified', 'expected question 4575 to have a verified answer_status (Workstream 3C finding) before using it as a visual pilot');
  console.log('[0] Read-only copy of live question 4575 content OK. options:', q4575.options_json, 'correct:', q4575.correct, 'answer_status:', q4575.answer_status);

  // ---------------------------------------------------------------------
  // 1. Provision an isolated, disposable test database (never boardready.db)
  //    and require db.js against it.
  // ---------------------------------------------------------------------
  const { setupPrimaryTestDbEnv } = require('../test/pg-test-support');
  const dbCtx = setupPrimaryTestDbEnv('visual4575_proof');
  const db = require('../db');
  if (db.DB_PATH === db.LIVE_DB_PATH) throw new Error('FATAL: resolved to the live DB path — refusing to continue.');
  if (!db.IS_TEST_MODE) throw new Error('FATAL: db.js did not recognize this as a test run.');
  console.log('[1] Isolated test database:', db.DB_PATH || dbCtx.dbName);

  const PORT = 4878; // distinct from the 3070 proof's port (4877), in case both are ever run back-to-back
  const BASE = `http://localhost:${PORT}`;
  const { spawn } = require('node:child_process');
  let serverProcess;
  let browser;
  const failures = [];

  try {
    // -------------------------------------------------------------------
    // 2. Seed fixture: a CBSE Mathematics subject/chapter, one question
    //    whose content is a faithful copy of the live 4575 row, and TWO
    //    visual_assets rows (source_cropped + ai_generated) for it.
    // -------------------------------------------------------------------
    const subj = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('CBSE', 'Mathematics', '10') RETURNING id").run();
    const subjectId = Number(subj.lastInsertRowid);
    const chap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, 'Polynomials');
    const chapterId = Number(chap.lastInsertRowid);
    const qIns = await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct, question_type, sub_concept)
                VALUES (?, 'mcq', 'verified', 'verified', ?, ?, ?, ?, ?, ?, ?) RETURNING id`)
      .run(chapterId, q4575.marks, q4575.difficulty, q4575.text, q4575.options_json, q4575.correct, q4575.question_type, q4575.sub_concept);
    const questionId = Number(qIns.lastInsertRowid);
    console.log('[2] Fixture question id (isolated DB):', questionId);

    const sourceCroppedPath = 'extracted-diagrams/cbse-mathematics-polynomials-752a6e3e-item45-graph-CANDIDATE.png';
    const aiGeneratedPath = 'extracted-diagrams/cbse-mathematics-polynomials-752a6e3e-item45-graph-GENERATED.svg';
    assert(fs.existsSync(path.join(__dirname, '..', sourceCroppedPath)), 'source_cropped asset file must exist on disk');
    assert(fs.existsSync(path.join(__dirname, '..', aiGeneratedPath)), 'ai_generated asset file must exist on disk');
    // Inserted in this order deliberately (source_cropped first, by lower id)
    // — the same regression check used for 3070: if the server ever
    // regressed to "first row by id" instead of the asset_type priority
    // rule, this proof would visibly fail by serving the raster crop.
    await db.prepare(`INSERT INTO visual_assets (question_id, asset_type, asset_path, figure_label, notes) VALUES (?, 'source_cropped', ?, 'Fig. 2.19, item 45', 'immutable original-pixels reference crop')`).run(questionId, sourceCroppedPath);
    await db.prepare(`INSERT INTO visual_assets (question_id, asset_type, asset_path, figure_label, notes) VALUES (?, 'ai_generated', ?, 'Fig. 2.19, item 45', 'Board Ready native redraw')`).run(questionId, aiGeneratedPath);
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
    // 4. Register a real student via the real HTTP API, then confirm the
    //    API-level diagram_url resolution directly before touching a browser.
    // -------------------------------------------------------------------
    const email = `visual4575-${Date.now()}@boardready.test`;
    const password = 'testpass123';
    const reg = await fetch(`${BASE}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Visual QA Student', email, password, role: 'student' }) }).then((r) => r.json());
    assert(reg.token, 'registration must return a token');
    const gen = await fetch(`${BASE}/api/practice/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` }, body: JSON.stringify({ subjectId, chapterId, count: 1 }) }).then((r) => r.json());
    const attempt = await fetch(`${BASE}/api/attempts`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` }, body: JSON.stringify({ test_id: gen.id }) }).then((r) => r.json());
    const qres = await fetch(`${BASE}/api/attempts/${attempt.id}/questions`, { headers: { Authorization: `Bearer ${reg.token}` } }).then((r) => r.json());
    const step = qres.steps.find((s) => s.questionId === questionId);
    assert(step, 'the generated test must include the fixture question');
    assert(step.diagramUrl === '/' + aiGeneratedPath, `expected diagramUrl to be the ai_generated SVG (${'/' + aiGeneratedPath}), got ${step.diagramUrl}`);
    console.log('[4] API-level check PASSED: diagram_url resolves to the ai_generated graph SVG, not the source_cropped raster crop:', step.diagramUrl);

    // -------------------------------------------------------------------
    // 5. Real browser, real UI clicks: login -> CBSE -> Practice on the
    //    fixture chapter -> question screen. Dark pass first (app default),
    //    then a fresh student + a real theme-button click for light.
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

      if (clickThemeToggle) await page.click('#themeBtn2');
      const themeNow = await page.getAttribute('#app', 'data-theme');
      assert(themeNow === themeName, `expected theme "${themeName}" going into the test screen, got "${themeNow}"`);

      await page.click('#dashBoardChips button[data-board="CBSE"]');
      await page.waitForSelector('#chaptersList [data-act="practice"]', { timeout: 10000 });
      await page.click('#chaptersList [data-act="practice"]');
      await page.waitForSelector('[data-screen="test"]:not([hidden])', { timeout: 10000 });
      await page.waitForSelector('#qDiagramWrap:not([hidden])', { timeout: 10000 });
      await page.waitForFunction(() => {
        const host = document.querySelector('#qDiagramSvgHost');
        return host && !host.hidden && host.querySelector('svg');
      }, { timeout: 10000 });

      // DOM-level proof the inline-SVG path actually ran, AND that the
      // specific graph content loaded (not some other SVG or a partial fetch).
      const domCheck = await page.evaluate(() => {
        const img = document.querySelector('#qDiagramImg');
        const host = document.querySelector('#qDiagramSvgHost');
        const fnLabel = host.querySelector('.gr-fn-label');
        return {
          imgHidden: img.hidden,
          imgSrc: img.getAttribute('src'),
          hostHidden: host.hidden,
          hasSvg: Boolean(host.querySelector('svg')),
          curveCount: host.querySelectorAll('.gr-curve').length,
          axisLineCount: host.querySelectorAll('line.gr-axis').length,
          fnLabelText: fnLabel ? fnLabel.textContent.trim() : null,
        };
      });
      assert(domCheck.imgHidden === true, 'raster <img> must be hidden when an SVG asset is served');
      assert(!domCheck.imgSrc, 'raster <img> must have no src when an SVG asset is served');
      assert(domCheck.hostHidden === false, 'the SVG host must be visible');
      assert(domCheck.hasSvg === true, 'the SVG host must contain a real inlined <svg> element');
      assert(domCheck.curveCount === 1, `expected exactly 1 curve path (.gr-curve), got ${domCheck.curveCount}`);
      assert(domCheck.axisLineCount === 2, `expected exactly 2 axis lines (line.gr-axis), got ${domCheck.axisLineCount}`);
      assert(domCheck.fnLabelText === 'y = p(x)', `expected the function label text to read "y = p(x)", got ${JSON.stringify(domCheck.fnLabelText)}`);
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

      // Same sandbox-only Google Fonts / tunnel-connection noise filter used
      // in the 3070 proof — unrelated to this workstream, not a regression.
      const realErrors = consoleErrors.filter((e) => !/fonts\.googleapis\.com/i.test(e) && !/ERR_TUNNEL_CONNECTION_FAILED/i.test(e));
      if (realErrors.length) {
        failures.push(`[${themeName}] browser console/page errors: ${JSON.stringify(realErrors)}`);
      } else if (consoleErrors.length) {
        console.log(`[5:${themeName}] (ignored, unrelated to this workstream: sandbox network policy blocked the page's Google Fonts request)`);
      }
      await context.close();
    }

    await runThemePass('dark', email, false);

    const email2 = `visual4575-light-${Date.now()}@boardready.test`;
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
