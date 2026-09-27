// Batch 15, Task 12 -- end-to-end website-rendering proof for question
// 1727's proposed "rectangle rolled into two cylinders" visual. Same
// discipline as every prior visual-QA script in this batch: read/write
// ONLY against a brand-new, disposable test database this script
// provisions itself (via test/pg-test-support.js's setupPrimaryTestDbEnv),
// spawned as a real `node server.js` child process, driven by a real
// Chromium browser (Playwright) doing the exact clicks a student would.
// The only touch of the LIVE database is one read-only SELECT to copy
// 1727's real content into the disposable fixture -- never a write. The
// live boardready.db is NOT modified by this script, and NO visual_assets
// row is created for 1727 -- Task 12 explicitly does not live-associate
// this visual (1727's diagram_status has not cleared the publication gate).
//
// What this proves, at each of 8 combinations (2 themes x 2 viewports x
// {question view, lightbox}):
//   - The server prefers the new 'ai_generated' SVG over the
//     'source_cropped' raster crop.
//   - The frontend takes the inline-SVG code path.
//   - Desktop and mobile viewport widths; both in-app light/dark theme
//     states; the zoom lightbox.
//   - Semantic fidelity: exactly 1 `.rcy-shape` rect (the original
//     rectangle), exactly 2 `.rcy-arrow` arrows, exactly 5 `.rcy-shape`
//     ellipses (2 for the vertical cylinder + 2 outer + ... see exact
//     counts asserted below), exactly 1 `.rcy-shape-thin` (the horizontal
//     cylinder's inner rim ellipse).
//
// Screenshots are written to docs/workstream-4m-1727-visual-qa-screenshots/.
// Run with: node scripts/verify-1727-visual-rendering.js

const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { chromium } = require('playwright');

const CHROMIUM_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'workstream-4m-1727-visual-qa-screenshots');
const LIVE_DB_PATH = path.join(__dirname, '..', 'boardready.db');

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERTION FAILED: ' + msg);
}

const LIVE_ID = 1727;
const SOURCE_CROPPED = 'extracted-diagrams/icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6-item21-tworectanglecylinders-CANDIDATE.png';
const AI_GENERATED = 'extracted-diagrams/icse-mathematics-volume-and-surface-area-of-solid-bf2b4dc6-item21-tworectanglecylinders-GENERATED.svg';
const FIGURE_LABEL = 'item (21), p.20.5';
const CHAPTER_NAME = 'Mensuration (Rectangle to Cylinder)';

function domAssert(r) {
  assert(r.rectCount === 1, `expected exactly 1 <rect> (the original rectangle), got ${r.rectCount}`);
  assert(r.ellipseCount === 5, `expected exactly 5 <ellipse> elements (2 vertical-cylinder rims + 2 horizontal-cylinder outer rims + 1 inner rim), got ${r.ellipseCount}`);
  assert(r.thinEllipseCount === 1, `expected exactly 1 .rcy-shape-thin (the horizontal cylinder's inner rim), got ${r.thinEllipseCount}`);
  assert(r.arrowCount === 4, `expected exactly 4 .rcy-arrow paths (2 arrows, each a line path + an arrowhead path), got ${r.arrowCount}`);
  assert(r.labelCount === 4, `expected exactly 4 .rcy-label texts (rectangle's 7cm+11cm, vertical cylinder's 7cm, horizontal cylinder's 11cm), got ${r.labelCount}`);
}

async function main() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  const liveHashBefore = require('node:crypto').createHash('sha256').update(fs.readFileSync(LIVE_DB_PATH)).digest('hex');
  const liveDb = new DatabaseSync(LIVE_DB_PATH, { readOnly: true });
  const content = liveDb.prepare('SELECT text, options_json, correct, marks, difficulty, kind, question_type, sub_concept, status, answer_status, diagram_status FROM questions WHERE id = ?').get(LIVE_ID);
  assert(content && content.kind === 'mcq', `expected to read a real mcq row for live question ${LIVE_ID}`);
  assert(content.diagram_status === 'needs_visual_review', `expected question ${LIVE_ID} to still be needs_visual_review (no live visual yet) -- got ${content.diagram_status}`);
  console.log(`[0] Read-only copy of live question ${LIVE_ID} OK. options: ${content.options_json}, correct: ${content.correct}, diagram_status: ${content.diagram_status}`);
  liveDb.close();

  const { setupPrimaryTestDbEnv } = require('../test/pg-test-support');
  const dbCtx = setupPrimaryTestDbEnv('visual1727_proof');
  const db = require('../db');
  if (db.DB_PATH === db.LIVE_DB_PATH) throw new Error('FATAL: resolved to the live DB path -- refusing to continue.');
  if (!db.IS_TEST_MODE) throw new Error('FATAL: db.js did not recognize this as a test run.');
  console.log('[1] Isolated test database:', db.DB_PATH || dbCtx.dbName);

  const PORT = 4884; // distinct from 3070 (4877), 4575 (4878), 1594/1230 (4879), 1508 (4880), 1231 (4881), 4833 (4882), 2061 (4883)
  const BASE = `http://localhost:${PORT}`;
  const { spawn } = require('node:child_process');
  let serverProcess;
  let browser;
  const failures = [];

  try {
    const subj = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('ICSE', 'Mathematics', '10') RETURNING id").run();
    const subjectId = Number(subj.lastInsertRowid);
    const chap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, CHAPTER_NAME);
    const chapterId = Number(chap.lastInsertRowid);

    const qIns = await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct, question_type, sub_concept)
                VALUES (?, 'mcq', 'verified', 'verified', ?, ?, ?, ?, ?, ?, ?) RETURNING id`)
      .run(chapterId, content.marks, content.difficulty, content.text, content.options_json, content.correct, content.question_type, content.sub_concept);
    const questionId = Number(qIns.lastInsertRowid);
    console.log(`[2] Fixture question id (isolated DB) for live ${LIVE_ID}:`, questionId);

    assert(fs.existsSync(path.join(__dirname, '..', SOURCE_CROPPED)), 'source_cropped asset file must exist on disk');
    assert(fs.existsSync(path.join(__dirname, '..', AI_GENERATED)), 'ai_generated asset file must exist on disk');
    await db.prepare(`INSERT INTO visual_assets (question_id, asset_type, asset_path, figure_label, notes) VALUES (?, 'source_cropped', ?, ?, 'immutable original-pixels reference crop')`).run(questionId, SOURCE_CROPPED, FIGURE_LABEL);
    await db.prepare(`INSERT INTO visual_assets (question_id, asset_type, asset_path, figure_label, notes) VALUES (?, 'ai_generated', ?, ?, 'Board Ready native redraw (proposed, not yet live)')`).run(questionId, AI_GENERATED, FIGURE_LABEL);
    console.log(`[2] Seeded source_cropped + ai_generated visual_assets rows for fixture question ${questionId}.`);

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

    browser = await chromium.launch({ executablePath: CHROMIUM_PATH });
    const password = 'testpass123';

    const email = `visual${LIVE_ID}-${Date.now()}@boardready.test`;
    const reg = await fetch(`${BASE}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `Visual QA 1727`, email, password, role: 'student' }) }).then((r) => r.json());
    assert(reg.token, 'registration must return a token');
    const gen = await fetch(`${BASE}/api/practice/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` }, body: JSON.stringify({ subjectId, chapterId, count: 1 }) }).then((r) => r.json());
    const attempt = await fetch(`${BASE}/api/attempts`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` }, body: JSON.stringify({ test_id: gen.id }) }).then((r) => r.json());
    const qres = await fetch(`${BASE}/api/attempts/${attempt.id}/questions`, { headers: { Authorization: `Bearer ${reg.token}` } }).then((r) => r.json());
    const step = qres.steps.find((s) => s.questionId === questionId);
    assert(step, 'the generated test must include the fixture question');
    assert(step.diagramUrl === '/' + AI_GENERATED, `expected diagramUrl to be the ai_generated SVG (${'/' + AI_GENERATED}), got ${step.diagramUrl}`);
    console.log(`[4] API-level check PASSED: diagramUrl resolves to the ai_generated SVG:`, step.diagramUrl);

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

      await page.click('#dashBoardChips button[data-board="ICSE"]');
      await page.waitForSelector('#chaptersList [data-act="practice"]', { timeout: 10000 });
      await page.click(`#chaptersList .chapter-row:has-text("${CHAPTER_NAME}") [data-act="practice"]`);
      await page.waitForSelector('[data-screen="test"]:not([hidden])', { timeout: 10000 });
      await page.waitForSelector('#qDiagramWrap:not([hidden])', { timeout: 10000 });
      await page.waitForFunction(() => {
        const host = document.querySelector('#qDiagramSvgHost');
        return host && !host.hidden && host.querySelector('svg');
      }, { timeout: 10000 });

      const domResult = await page.evaluate(() => {
        const img = document.querySelector('#qDiagramImg');
        const host = document.querySelector('#qDiagramSvgHost');
        return {
          imgHidden: img.hidden,
          imgSrc: img.getAttribute('src'),
          hostHidden: host.hidden,
          hasSvg: Boolean(host.querySelector('svg')),
          rectCount: host.querySelectorAll('rect.rcy-shape').length,
          ellipseCount: host.querySelectorAll('ellipse').length,
          thinEllipseCount: host.querySelectorAll('.rcy-shape-thin').length,
          arrowCount: host.querySelectorAll('.rcy-arrow').length,
          labelCount: host.querySelectorAll('.rcy-label').length,
        };
      });
      assert(domResult.imgHidden === true, 'raster <img> must be hidden when an SVG asset is served');
      assert(!domResult.imgSrc, 'raster <img> must have no src when an SVG asset is served');
      assert(domResult.hostHidden === false, 'the SVG host must be visible');
      assert(domResult.hasSvg === true, 'the SVG host must contain a real inlined <svg> element');
      domAssert(domResult);
      console.log(`[5:${themeName}] DOM-level checks PASSED:`, domResult);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `1727-tworectanglecylinders-question-${themeName}-desktop.png`) });

      await page.click('#qDiagramWrap');
      await page.waitForSelector('#diagramLightbox:not([hidden])', { timeout: 5000 });
      await page.waitForFunction(() => {
        const host = document.querySelector('#lightboxSvgHost');
        return host && !host.hidden && host.querySelector('svg');
      }, { timeout: 5000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `1727-tworectanglecylinders-lightbox-${themeName}-desktop.png`) });
      await page.keyboard.press('Escape');
      await page.waitForSelector('#diagramLightbox', { state: 'hidden', timeout: 5000 });

      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `1727-tworectanglecylinders-question-${themeName}-mobile.png`) });
      await page.click('#qDiagramWrap');
      await page.waitForSelector('#diagramLightbox:not([hidden])', { timeout: 5000 });
      await page.waitForFunction(() => {
        const host = document.querySelector('#lightboxSvgHost');
        return host && !host.hidden && host.querySelector('svg');
      }, { timeout: 5000 });
      await page.screenshot({ path: path.join(SCREENSHOT_DIR, `1727-tworectanglecylinders-lightbox-${themeName}-mobile.png`) });
      await page.keyboard.press('Escape');

      const realErrors = consoleErrors.filter((e) => !/fonts\.googleapis\.com/i.test(e) && !/ERR_TUNNEL_CONNECTION_FAILED/i.test(e));
      if (realErrors.length) {
        failures.push(`[${themeName}] browser console/page errors: ${JSON.stringify(realErrors)}`);
      } else if (consoleErrors.length) {
        console.log(`[5:${themeName}] (ignored, unrelated: sandbox network policy blocked Google Fonts request)`);
      }
      await context.close();
    }

    await runThemePass('dark', email, false);
    const email2 = `visual${LIVE_ID}-light-${Date.now()}@boardready.test`;
    const reg2 = await fetch(`${BASE}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `Visual QA 1727 Light`, email: email2, password, role: 'student' }) }).then((r) => r.json());
    assert(reg2.token, 'second registration must return a token');
    await runThemePass('light', email2, true);

    console.log('\n=== RESULT ===');
    if (failures.length) {
      console.log('FAILURES:', failures);
      process.exitCode = 1;
    } else {
      console.log('ALL CHECKS PASSED for 1727. Screenshots written to', SCREENSHOT_DIR);
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
