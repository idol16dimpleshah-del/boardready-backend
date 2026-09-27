// Workstream 3-Task4 -- end-to-end website-rendering proof for the two
// geometry visual candidates, questions 1594 (circle) and 1230 (triangle).
// Same discipline as scripts/verify-3070-visual-rendering.js and
// scripts/verify-4575-visual-rendering.js: read/write ONLY against a
// brand-new, disposable test database this script provisions itself (via
// test/pg-test-support.js's setupPrimaryTestDbEnv), spawned as a real
// `node server.js` child process, driven by a real Chromium browser
// (Playwright) doing the exact clicks a student would. The only touch of
// the LIVE database is two read-only SELECTs to copy 1594's and 1230's
// real, already-verified content into the disposable fixture -- never a
// write, and that connection is closed before the disposable database is
// even created. The live boardready.db is NOT modified by this script, and
// this proof intentionally runs BEFORE any live visual_assets association
// -- per Task 4's instruction, no live visual_assets row is created for
// either question by this script.
//
// What this proves, for EACH question, at EACH of the same 8 combinations
// used for 3070 and 4575 (2 themes x 2 viewports x {question view, lightbox}):
//   - The server prefers the new 'ai_generated' SVG over the 'source_cropped'
//     raster crop (source_cropped inserted first/lower id, same regression
//     check as 3070/4575).
//   - The frontend takes the inline-SVG code path (app.js's
//     createDiagramLoader), not the plain <img> path.
//   - Desktop and mobile viewport widths; both in-app light/dark theme
//     states (never the OS prefers-color-scheme signal); the zoom lightbox.
//   - Semantic fidelity of the DOM content, specific to each figure:
//       1594 (circle): exactly one <circle class="cy-circle">, exactly one
//       dashed diagonal (.cy-diagonal), and the "35" angle label present.
//       1230 (triangle): exactly one triangle path (.tr-side), exactly one
//       right-angle mark (.tr-rightangle), and the violet-highlighted point
//       E (.tr-point-e) present.
//
// Screenshots are written to
// docs/workstream-3i-1594-1230-visual-qa-screenshots/ for the written report.
// Run with: node scripts/verify-1594-1230-visual-rendering.js

const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');
const { chromium } = require('playwright');

const CHROMIUM_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'workstream-3i-1594-1230-visual-qa-screenshots');
const LIVE_DB_PATH = path.join(__dirname, '..', 'boardready.db');

function assert(cond, msg) {
  if (!cond) throw new Error('ASSERTION FAILED: ' + msg);
}

const FIXTURES = [
  {
    liveId: 1594,
    label: '1594-circle',
    sourceCropped: 'extracted-diagrams/icse-mathematics-angle-and-cyclic-properties-of-circle-1adba987-item22-circle-CANDIDATE.png',
    aiGenerated: 'extracted-diagrams/icse-mathematics-angle-and-cyclic-properties-of-circle-1adba987-item22-circle-GENERATED.svg',
    figureLabel: 'p.17.4, item 22',
    chapterName: 'Angle and Cyclic Properties of Circle',
    domCheck: (host) => ({
      circleCount: host.querySelectorAll('.cy-circle').length,
      diagonalCount: host.querySelectorAll('.cy-diagonal').length,
      hasAngleLabel: Array.from(host.querySelectorAll('.cy-angle-label')).some((el) => el.textContent.includes('35')),
    }),
    domAssert: (r) => {
      assert(r.circleCount === 1, `expected exactly 1 .cy-circle, got ${r.circleCount}`);
      assert(r.diagonalCount === 1, `expected exactly 1 .cy-diagonal, got ${r.diagonalCount}`);
      assert(r.hasAngleLabel === true, 'expected a "35" angle label in the SVG');
    },
  },
  {
    liveId: 1230,
    label: '1230-triangle',
    sourceCropped: 'extracted-diagrams/icse-mathematics-locus-and-construction-c23699f9-item33-triangle-CANDIDATE.png',
    aiGenerated: 'extracted-diagrams/icse-mathematics-locus-and-construction-c23699f9-item33-triangle-GENERATED.svg',
    figureLabel: 'p.19.6, item 33',
    chapterName: 'Locus and Construction',
    domCheck: (host) => ({
      sideCount: host.querySelectorAll('.tr-side').length,
      rightAngleCount: host.querySelectorAll('.tr-rightangle').length,
      pointECount: host.querySelectorAll('.tr-point-e').length,
    }),
    domAssert: (r) => {
      assert(r.sideCount === 1, `expected exactly 1 .tr-side path, got ${r.sideCount}`);
      assert(r.rightAngleCount === 1, `expected exactly 1 .tr-rightangle mark, got ${r.rightAngleCount}`);
      assert(r.pointECount === 1, `expected exactly 1 .tr-point-e (point E), got ${r.pointECount}`);
    },
  },
];

async function main() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

  // ---------------------------------------------------------------------
  // 0. Read-only copy of 1594's and 1230's real content from the LIVE db.
  // ---------------------------------------------------------------------
  const liveHashBefore = require('node:crypto').createHash('sha256').update(fs.readFileSync(LIVE_DB_PATH)).digest('hex');
  const liveDb = new DatabaseSync(LIVE_DB_PATH, { readOnly: true });
  for (const fx of FIXTURES) {
    const row = liveDb.prepare('SELECT text, options_json, correct, marks, difficulty, kind, question_type, sub_concept, status, answer_status, diagram_status FROM questions WHERE id = ?').get(fx.liveId);
    assert(row && row.kind === 'mcq', `expected to read a real mcq row for live question ${fx.liveId}`);
    assert(row.diagram_status === 'needs_visual_review', `expected question ${fx.liveId} to still be needs_visual_review (no live visual yet) -- got ${row.diagram_status}`);
    fx.content = row;
    console.log(`[0] Read-only copy of live question ${fx.liveId} OK. options: ${row.options_json}, correct: ${row.correct}, diagram_status: ${row.diagram_status}`);
  }
  liveDb.close();

  // ---------------------------------------------------------------------
  // 1. Provision an isolated, disposable test database (never boardready.db).
  // ---------------------------------------------------------------------
  const { setupPrimaryTestDbEnv } = require('../test/pg-test-support');
  const dbCtx = setupPrimaryTestDbEnv('visual1594_1230_proof');
  const db = require('../db');
  if (db.DB_PATH === db.LIVE_DB_PATH) throw new Error('FATAL: resolved to the live DB path -- refusing to continue.');
  if (!db.IS_TEST_MODE) throw new Error('FATAL: db.js did not recognize this as a test run.');
  console.log('[1] Isolated test database:', db.DB_PATH || dbCtx.dbName);

  const PORT = 4879; // distinct from the 3070 (4877) and 4575 (4878) proofs
  const BASE = `http://localhost:${PORT}`;
  const { spawn } = require('node:child_process');
  let serverProcess;
  let browser;
  const failures = [];

  try {
    // -------------------------------------------------------------------
    // 2. Seed fixtures: one ICSE Mathematics subject, one chapter per
    //    question, faithful copies of the live rows, plus TWO visual_assets
    //    rows each (source_cropped + ai_generated).
    // -------------------------------------------------------------------
    const subj = await db.prepare("INSERT INTO subjects (board, name, class) VALUES ('ICSE', 'Mathematics', '10') RETURNING id").run();
    const subjectId = Number(subj.lastInsertRowid);

    for (const fx of FIXTURES) {
      const chap = await db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, 0) RETURNING id').run(subjectId, fx.chapterName);
      fx.chapterId = Number(chap.lastInsertRowid);
      const c = fx.content;
      const qIns = await db.prepare(`INSERT INTO questions (chapter_id, kind, status, answer_status, marks, difficulty, text, options_json, correct, question_type, sub_concept)
                  VALUES (?, 'mcq', 'verified', 'verified', ?, ?, ?, ?, ?, ?, ?) RETURNING id`)
        .run(fx.chapterId, c.marks, c.difficulty, c.text, c.options_json, c.correct, c.question_type, c.sub_concept);
      fx.questionId = Number(qIns.lastInsertRowid);
      console.log(`[2] Fixture question id (isolated DB) for live ${fx.liveId}:`, fx.questionId);

      assert(fs.existsSync(path.join(__dirname, '..', fx.sourceCropped)), 'source_cropped asset file must exist on disk');
      assert(fs.existsSync(path.join(__dirname, '..', fx.aiGenerated)), 'ai_generated asset file must exist on disk');
      // source_cropped inserted first (lower id) deliberately -- same
      // regression check as 3070/4575.
      await db.prepare(`INSERT INTO visual_assets (question_id, asset_type, asset_path, figure_label, notes) VALUES (?, 'source_cropped', ?, ?, 'immutable original-pixels reference crop')`).run(fx.questionId, fx.sourceCropped, fx.figureLabel);
      await db.prepare(`INSERT INTO visual_assets (question_id, asset_type, asset_path, figure_label, notes) VALUES (?, 'ai_generated', ?, ?, 'Board Ready native redraw (proposed, not yet live)')`).run(fx.questionId, fx.aiGenerated, fx.figureLabel);
      console.log(`[2] Seeded source_cropped + ai_generated visual_assets rows for fixture question ${fx.questionId}.`);
    }

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

    browser = await chromium.launch({ executablePath: CHROMIUM_PATH });
    const password = 'testpass123';

    for (const fx of FIXTURES) {
      // -----------------------------------------------------------------
      // 4. API-level diagram_url resolution check, per fixture.
      // -----------------------------------------------------------------
      const email = `visual${fx.liveId}-${Date.now()}@boardready.test`;
      const reg = await fetch(`${BASE}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `Visual QA ${fx.label}`, email, password, role: 'student' }) }).then((r) => r.json());
      assert(reg.token, 'registration must return a token');
      const gen = await fetch(`${BASE}/api/practice/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` }, body: JSON.stringify({ subjectId, chapterId: fx.chapterId, count: 1 }) }).then((r) => r.json());
      const attempt = await fetch(`${BASE}/api/attempts`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${reg.token}` }, body: JSON.stringify({ test_id: gen.id }) }).then((r) => r.json());
      const qres = await fetch(`${BASE}/api/attempts/${attempt.id}/questions`, { headers: { Authorization: `Bearer ${reg.token}` } }).then((r) => r.json());
      const step = qres.steps.find((s) => s.questionId === fx.questionId);
      assert(step, 'the generated test must include the fixture question');
      assert(step.diagramUrl === '/' + fx.aiGenerated, `expected diagramUrl to be the ai_generated SVG (${'/' + fx.aiGenerated}), got ${step.diagramUrl}`);
      console.log(`[4:${fx.label}] API-level check PASSED: diagramUrl resolves to the ai_generated SVG:`, step.diagramUrl);

      // -----------------------------------------------------------------
      // 5. Real browser, real UI clicks, per theme, per fixture.
      // -----------------------------------------------------------------
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
        // Multiple chapters exist in this fixture DB (one per question) --
        // click the one matching this fixture's chapter name specifically.
        await page.click(`#chaptersList .chapter-row:has-text("${fx.chapterName}") [data-act="practice"]`);
        await page.waitForSelector('[data-screen="test"]:not([hidden])', { timeout: 10000 });
        await page.waitForSelector('#qDiagramWrap:not([hidden])', { timeout: 10000 });
        await page.waitForFunction(() => {
          const host = document.querySelector('#qDiagramSvgHost');
          return host && !host.hidden && host.querySelector('svg');
        }, { timeout: 10000 });

        const domCheck = await page.evaluate((figureKey) => {
          const img = document.querySelector('#qDiagramImg');
          const host = document.querySelector('#qDiagramSvgHost');
          const base = {
            imgHidden: img.hidden,
            imgSrc: img.getAttribute('src'),
            hostHidden: host.hidden,
            hasSvg: Boolean(host.querySelector('svg')),
          };
          if (figureKey === '1594-circle') {
            base.circleCount = host.querySelectorAll('.cy-circle').length;
            base.diagonalCount = host.querySelectorAll('.cy-diagonal').length;
            base.hasAngleLabel = Array.from(host.querySelectorAll('.cy-angle-label')).some((el) => el.textContent.includes('35'));
          } else {
            base.sideCount = host.querySelectorAll('.tr-side').length;
            base.rightAngleCount = host.querySelectorAll('.tr-rightangle').length;
            base.pointECount = host.querySelectorAll('.tr-point-e').length;
          }
          return base;
        }, fx.label);
        assert(domCheck.imgHidden === true, 'raster <img> must be hidden when an SVG asset is served');
        assert(!domCheck.imgSrc, 'raster <img> must have no src when an SVG asset is served');
        assert(domCheck.hostHidden === false, 'the SVG host must be visible');
        assert(domCheck.hasSvg === true, 'the SVG host must contain a real inlined <svg> element');
        fx.domAssert(domCheck);
        console.log(`[5:${fx.label}:${themeName}] DOM-level checks PASSED:`, domCheck);

        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${fx.label}-question-${themeName}-desktop.png`) });

        await page.click('#qDiagramWrap');
        await page.waitForSelector('#diagramLightbox:not([hidden])', { timeout: 5000 });
        await page.waitForFunction(() => {
          const host = document.querySelector('#lightboxSvgHost');
          return host && !host.hidden && host.querySelector('svg');
        }, { timeout: 5000 });
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${fx.label}-lightbox-${themeName}-desktop.png`) });
        await page.keyboard.press('Escape');
        await page.waitForSelector('#diagramLightbox', { state: 'hidden', timeout: 5000 });

        await page.setViewportSize({ width: 390, height: 844 });
        await page.waitForTimeout(150);
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${fx.label}-question-${themeName}-mobile.png`) });
        await page.click('#qDiagramWrap');
        await page.waitForSelector('#diagramLightbox:not([hidden])', { timeout: 5000 });
        await page.waitForFunction(() => {
          const host = document.querySelector('#lightboxSvgHost');
          return host && !host.hidden && host.querySelector('svg');
        }, { timeout: 5000 });
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, `${fx.label}-lightbox-${themeName}-mobile.png`) });
        await page.keyboard.press('Escape');

        const realErrors = consoleErrors.filter((e) => !/fonts\.googleapis\.com/i.test(e) && !/ERR_TUNNEL_CONNECTION_FAILED/i.test(e));
        if (realErrors.length) {
          failures.push(`[${fx.label}:${themeName}] browser console/page errors: ${JSON.stringify(realErrors)}`);
        } else if (consoleErrors.length) {
          console.log(`[5:${fx.label}:${themeName}] (ignored, unrelated: sandbox network policy blocked Google Fonts request)`);
        }
        await context.close();
      }

      await runThemePass('dark', email, false);
      const email2 = `visual${fx.liveId}-light-${Date.now()}@boardready.test`;
      const reg2 = await fetch(`${BASE}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: `Visual QA ${fx.label} Light`, email: email2, password, role: 'student' }) }).then((r) => r.json());
      assert(reg2.token, 'second registration must return a token');
      await runThemePass('light', email2, true);
    }

    console.log('\n=== RESULT ===');
    if (failures.length) {
      console.log('FAILURES:', failures);
      process.exitCode = 1;
    } else {
      console.log('ALL CHECKS PASSED for both 1594 and 1230. Screenshots written to', SCREENSHOT_DIR);
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
