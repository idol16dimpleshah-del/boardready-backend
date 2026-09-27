// Board Ready — real frontend logic. Every number rendered on screen comes
// from a fetch() to this same server's /api/* routes (see server.js). There
// is no hardcoded score, mastery %, streak, XP, or weak-spot narrative here —
// where the Revision 3 design mock implied one that the API doesn't provide,
// that section is either wired to a real (composed, not fabricated) value or
// left out. Search this file for "GAP:" to find every place that was cut or
// changed for lack of backend support.

(() => {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $all = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  // Toggle-button helper (2026-09-22, accessibility pass): every "chip" or
  // "pick-card" group in this app is really a single-select toggle group
  // (board = CBSE or ICSE), but the selected state was only ever conveyed
  // visually via a CSS class — a screen reader had no way to know which
  // option was selected. This keeps the existing class-based styling and
  // adds the real aria-pressed a toggle button needs, in one place.
  function setPressed(el, on, cls) {
    el.classList.toggle(cls, on);
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  // ---------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------
  const state = {
    token: null,
    user: null,
    theme: 'dark',
    landingBoard: 'CBSE',
    board: 'CBSE',
    subjects: [],            // all subjects from /api/subjects
    subjectId: null,
    chapters: [],            // chapters for state.subjectId
    subjectDiag: null,       // /api/diagnostics/me/subjects/:id response
    readiness: null,         // /api/diagnostics/me/readiness response
    summary: null,           // /api/diagnostics/me/summary response
    createBoardPick: 'CBSE',

    // active test-taking session
    test: null,              // { id, subjectId, chapterId, subConcept, kind, subjectName, chapterName }
    attempt: null,           // { id, testId, startedAt, durationSeconds }
    steps: [],
    answers: {},             // key -> { optionIndex } | { text }
    checked: {},             // key -> { optionIndex, correct, correctOptionIndex, explanation } — real, server-graded (2026-09-22, Phase 4)
    flagged: new Set(),
    idx: 0,
    deadline: 0,
    timerHandle: null,
    autoSubmitted: false,
    preTestReadiness: null,  // examReadiness.score captured before this attempt
  };

  function saveSession() {
    try {
      localStorage.setItem('br_token', state.token || '');
      localStorage.setItem('br_user', JSON.stringify(state.user || null));
      localStorage.setItem('br_theme', state.theme);
    } catch { /* private mode / blocked storage — session just won't survive reload */ }
  }
  function loadSession() {
    try {
      const t = localStorage.getItem('br_token');
      const u = localStorage.getItem('br_user');
      const th = localStorage.getItem('br_theme');
      if (t) state.token = t;
      if (u) state.user = JSON.parse(u);
      if (th) state.theme = th;
    } catch { /* ignore */ }
  }
  function clearSession() {
    state.token = null; state.user = null;
    try { localStorage.removeItem('br_token'); localStorage.removeItem('br_user'); } catch { /* ignore */ }
  }

  // Stage 7 QA finding (2026-09-24) fix: an expired/invalid token used to
  // leave the student on a broken, mostly-empty dashboard -- enterApp()
  // switched to the dashboard screen before its data finished loading, and
  // every one of refreshDashboard()'s sub-fetches caught its own failure
  // and just showed a toast, never clearing the session or redirecting.
  // This is now handled in ONE place (api(), below) the moment ANY
  // authenticated request comes back 401, regardless of which call site
  // triggered it or whether that call site's own catch block would have
  // swallowed the error. Idempotent by design (clearSession/showScreen are
  // both safe to call repeatedly), since several of a dashboard load's
  // parallel requests can all 401 at once.
  function handleSessionExpired() {
    clearSession();
    $('#loginForm').reset(); $('#createForm').reset();
    showScreen('login');
    toast('Your session has expired. Please log in again.', 4000);
  }

  // ---------------------------------------------------------------------
  // API HELPER
  // ---------------------------------------------------------------------
  async function api(method, urlPath, body) {
    const headers = { 'Content-Type': 'application/json' };
    const authenticated = Boolean(state.token);
    if (authenticated) headers.Authorization = `Bearer ${state.token}`;
    const res = await fetch(urlPath, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined });
    let json = null;
    try { json = await res.json(); } catch { /* no body */ }
    if (!res.ok) {
      const err = new Error((json && json.error) || `Request failed (${res.status})`);
      err.status = res.status; err.body = json;
      // Only an ALREADY-authenticated request's 401 means "your session is
      // no longer valid" -- requireAuth() (server.js) is the only source of
      // a 401 here. A bare login attempt with the wrong password is also a
      // 401, but never carries an Authorization header (there's no session
      // yet to expire), so it can't collide with this check; that case is
      // handled entirely by the login form's own inline error message.
      if (res.status === 401 && authenticated) {
        err.sessionExpired = true;
        handleSessionExpired();
      }
      throw err;
    }
    return json;
  }

  function toast(msg, ms) {
    // Class-based show/hide (2026-09-23, visual polish pass) instead of
    // the `hidden` attribute, so style.css can fade it in/out instead of
    // an instant display cut — see .toast/.toast.show there.
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.classList.remove('show'); }, ms || 3200);
  }

  // Stage 7 QA finding (2026-09-24): the browser's own Back button used to
  // leave the app entirely -- this SPA never called history.pushState for
  // its own screen switches, so there was only ever one real history entry
  // (the initial page load) and "back" from it went to whatever preceded
  // that in the tab's real history. This gives showScreen() a minimal,
  // predictable history entry per major screen (login/dash/test/results —
  // the same screens the app already has; nothing new is introduced), so
  // Back/Forward move between them like any other page instead of exiting.
  // `fromPopState: true` is passed when a popstate handler is only
  // reflecting a navigation the browser already made, so it must not also
  // push a new entry (that would fight the user's own back/forward taps).
  let historyInitialized = false;
  function showScreen(name, opts) {
    opts = opts || {};
    $all('.screen').forEach((s) => { s.hidden = s.dataset.screen !== name; });
    window.scrollTo(0, 0);
    if (opts.fromPopState) return;
    if (!historyInitialized) {
      historyInitialized = true;
      history.replaceState({ screen: name }, '', '');
      return;
    }
    if (!history.state || history.state.screen !== name) {
      history.pushState({ screen: name }, '', '');
    }
  }

  // Handles the browser's actual Back/Forward buttons. Deliberately does
  // NOT try to reconstruct exactly what the popped history entry recorded
  // (e.g. re-fetching a specific past attempt) -- that would mean guessing
  // at stale state instead of showing something real. Instead it routes to
  // whichever of the app's existing screens is genuinely valid right now:
  // - Mid-test (the test screen is the one currently showing, for an
  //   attempt that hasn't been submitted): there is no "exit test" control
  //   in the UI today, so a back-button tap here is far more likely to be
  //   an accidental swipe/gesture than a deliberate "abandon this attempt"
  //   choice. Answers are already autosaved either way, but silently
  //   dropping the student out of an in-progress test would be a worse
  //   outcome than just staying put — so this re-asserts the test screen
  //   rather than leaving it.
  // - Anywhere else: the dashboard if still logged in, the login screen if
  //   not — both real, already-rendered screens, never a blank page.
  window.addEventListener('popstate', () => {
    const wasOnTestScreen = Boolean($('[data-screen="test"]:not([hidden])'));
    if (wasOnTestScreen) {
      showScreen('test', { fromPopState: true });
      history.pushState({ screen: 'test' }, '', '');
      return;
    }
    showScreen(state.token ? 'dash' : 'login', { fromPopState: true });
  });

  // ---------------------------------------------------------------------
  // THEME
  // ---------------------------------------------------------------------
  function applyTheme() {
    $('#app').setAttribute('data-theme', state.theme);
    $all('.theme-btn').forEach((b) => { b.textContent = state.theme === 'dark' ? '☀' : '☾'; });
  }
  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(); saveSession();
  }

  // ---------------------------------------------------------------------
  // CORE (Readiness dial) rendering helper — animates the number and the
  // orbit ring to a real percentage (0 when there is no data yet).
  // ---------------------------------------------------------------------
  function setCore(wrapEl, pct, opts) {
    opts = opts || {};
    const p = pct == null ? null : Math.max(0, Math.min(100, Math.round(pct)));
    wrapEl.style.setProperty('--pctn', String((p ?? 0) / 100));
    const numEl = wrapEl.querySelector('.core-num');
    const circle = wrapEl.querySelector('.core-orbit circle');
    if (circle) circle.setAttribute('stroke-dasharray', `${Math.round(((p ?? 0) / 100) * 449)} 449`);
    if (p == null) {
      numEl.textContent = opts.placeholder || '—';
      return;
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const suffix = opts.suffix || '';
    if (reduceMotion) { numEl.textContent = p + suffix; return; }
    const from = Number(numEl.dataset.lastVal) || 0;
    const dur = 900; const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      numEl.textContent = Math.round(from + (p - from) * eased) + suffix;
      if (t < 1) requestAnimationFrame(tick);
      else numEl.dataset.lastVal = String(p);
    }
    requestAnimationFrame(tick);
  }
  function animateBar(el, pct) {
    el.dataset.fill = String(pct);
    el.style.width = '0%';
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = pct + '%'; }));
  }

  // ---------------------------------------------------------------------
  // LANDING SCREEN
  // ---------------------------------------------------------------------
  let contentSummary = null;
  async function loadLandingStats() {
    try {
      contentSummary = await api('GET', '/api/content/summary');
      renderLandingStats();
    } catch (e) { /* landing stats are decorative — fail silently */ }
  }
  function renderLandingStats() {
    if (!contentSummary) return;
    const row = contentSummary.byBoard.find((r) => r.board === state.landingBoard);
    $('#statQuestions').textContent = row ? row.questionCount : '0';
    $('#statChapters').textContent = row ? row.chapterCount : '0';
    $('#statSubjects').textContent = row ? row.subjectCount : '0';
  }

  $('#landingBoardChips').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-board]'); if (!btn) return;
    state.landingBoard = btn.dataset.board;
    $all('#landingBoardChips .p-chip[data-board]').forEach((b) => setPressed(b, b === btn, 'active'));
    renderLandingStats();
  });

  // tab switching
  $('#tabLoginBtn').addEventListener('click', () => {
    $('#tabLoginBtn').classList.add('on'); $('#tabCreateBtn').classList.remove('on');
    $('#loginForm').hidden = false; $('#createForm').hidden = true; $('#loginFoot').hidden = false;
  });
  $('#tabCreateBtn').addEventListener('click', () => {
    $('#tabCreateBtn').classList.add('on'); $('#tabLoginBtn').classList.remove('on');
    $('#loginForm').hidden = true; $('#createForm').hidden = false; $('#loginFoot').hidden = true;
  });
  $('#switchToCreate').addEventListener('click', (e) => { e.preventDefault(); $('#tabCreateBtn').click(); });

  $('#createBoardPick').addEventListener('click', (e) => {
    const btn = e.target.closest('.pick-card'); if (!btn) return;
    state.createBoardPick = btn.dataset.board;
    $all('#createBoardPick .pick-card').forEach((b) => setPressed(b, b === btn, 'sel'));
  });

  $('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = $('#loginError'); errorEl.hidden = true;
    try {
      const resp = await api('POST', '/api/auth/login', {
        email: $('#loginEmail').value.trim(), password: $('#loginPassword').value,
      });
      state.token = resp.token; state.user = resp.user; saveSession();
      await enterApp();
    } catch (err) {
      errorEl.textContent = err.message; errorEl.hidden = false;
    }
  });

  $('#createForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = $('#createError'); errorEl.hidden = true;
    try {
      const resp = await api('POST', '/api/auth/register', {
        name: $('#createName').value.trim(), email: $('#createEmail').value.trim(),
        password: $('#createPassword').value, role: 'student',
      });
      state.token = resp.token; state.user = resp.user; state.board = state.createBoardPick; saveSession();
      await enterApp();
    } catch (err) {
      errorEl.textContent = err.message; errorEl.hidden = false;
    }
  });

  $('#tryDemoBtn').addEventListener('click', async () => {
    const stamp = Date.now().toString(36);
    try {
      const resp = await api('POST', '/api/auth/register', {
        name: 'Demo Student', email: `demo-${stamp}@boardready.local`, password: `demo-${stamp}-pw`, role: 'student',
      });
      state.token = resp.token; state.user = resp.user; state.board = state.landingBoard; saveSession();
      toast('Created a fresh real demo account — this is a genuine registered user, not mock data.');
      await enterApp();
    } catch (err) { toast('Could not create a demo account: ' + err.message); }
  });

  // ---------------------------------------------------------------------
  // ENTER APP / DASHBOARD
  // ---------------------------------------------------------------------
  async function enterApp() {
    state.board = state.board || 'CBSE';
    const initials = (state.user.name || '?').trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    $('#avatarInitials').textContent = initials || '?';
    $('#greetName').textContent = `Hi, ${state.user.name.split(/\s+/)[0]}`;
    $('#greetSub').textContent = `${state.user.email} · Class 10`;
    $all('#dashBoardChips .p-chip').forEach((b) => setPressed(b, b.dataset.board === state.board, 'active'));
    // Stage 7 QA finding fix: load the dashboard's data BEFORE switching to
    // the dashboard screen, instead of after -- showing 'dash' first meant
    // a student with an expired/invalid token briefly saw (and, before the
    // api()-level fix above, could get stuck on) an authenticated-looking
    // screen with nothing real on it. refreshDashboard() itself never
    // throws (each of its sub-fetches catches its own failure so one
    // failing widget doesn't block the rest of the dashboard), so the
    // guard below checks whether handleSessionExpired() already fired and
    // cleared state.token during that call -- if so, the login screen it
    // switched to must not be clobbered back to 'dash' here.
    await refreshDashboard();
    if (!state.token) return;
    showScreen('dash');
  }

  $('#logoutBtn').addEventListener('click', () => {
    clearSession();
    $('#loginForm').reset(); $('#createForm').reset();
    showScreen('login');
  });

  $('#dashBoardChips').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-board]'); if (!btn) return;
    state.board = btn.dataset.board;
    $all('#dashBoardChips .p-chip').forEach((b) => setPressed(b, b === btn, 'active'));
    state.subjectId = null;
    await refreshDashboard();
  });

  async function refreshDashboard() {
    try {
      if (!state.subjects.length) state.subjects = (await api('GET', '/api/subjects')).subjects;
    } catch (e) { if (!e.sessionExpired) toast('Could not load subjects: ' + e.message); return; }

    const boardSubjects = state.subjects.filter((s) => s.board === state.board);
    if (!boardSubjects.some((s) => s.id === state.subjectId)) {
      state.subjectId = boardSubjects.length ? boardSubjects[0].id : null;
    }
    renderSubjectPicker(boardSubjects);

    const jobs = [loadReadiness(), loadSummary(), loadRecentAttempts()];
    if (state.subjectId) jobs.push(loadSubjectSection());
    await Promise.all(jobs);
  }

  function renderSubjectPicker(boardSubjects) {
    const el = $('#subjectPicker');
    el.innerHTML = '';
    if (!boardSubjects.length) {
      el.innerHTML = '<div class="empty-note">No subjects published for this board yet.</div>';
      $('#chaptersSubjectName').textContent = '—';
      $('#chaptersList').innerHTML = '';
      return;
    }
    boardSubjects.forEach((s) => {
      const btn = document.createElement('button');
      const isActive = s.id === state.subjectId;
      btn.className = 'p-chip' + (isActive ? ' active' : '');
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      btn.type = 'button'; btn.textContent = s.name;
      btn.addEventListener('click', async () => { state.subjectId = s.id; await loadSubjectSection(); renderSubjectPicker(boardSubjects); });
      el.appendChild(btn);
    });
  }

  function currentSubject() { return state.subjects.find((s) => s.id === state.subjectId) || null; }

  // ---- Readiness (free, overall) ----
  async function loadReadiness() {
    try {
      state.readiness = await api('GET', '/api/diagnostics/me/readiness');
    } catch (e) { if (!e.sessionExpired) toast('Could not load readiness: ' + e.message); return; }
    const r = state.readiness;
    const core = $('#dashCore');
    if (!r.hasAnyData || !r.examReadiness) {
      setCore(core, null);
      $('#readinessHeadline').textContent = r.evidence && r.evidence.attemptedCount > 0
        ? 'Not enough attempts yet for a Readiness Score'
        : 'Take a test to get your first Readiness Score';
      $('#readinessMastery').hidden = true;
      $('#readinessNote').textContent = (r.evidence && r.evidence.reason) || 'Attempt at least a few questions to unlock this.';
      return;
    }
    setCore(core, r.examReadiness.score, { suffix: '' });
    $('#readinessHeadline').textContent = `${r.examReadiness.label} — Exam Readiness ${r.examReadiness.score}/100`;
    if (r.knowledgeMasteryPct != null) {
      $('#readinessMastery').hidden = false;
      $('#readinessMastery').textContent = `Knowledge Mastery: ${r.knowledgeMasteryPct}%`;
    } else {
      $('#readinessMastery').hidden = true;
    }
    $('#readinessNote').textContent = r.evidence.reason;
  }

  // ---- Summary (free, per-subject accuracy) — also feeds "activity" ----
  async function loadSummary() {
    try {
      state.summary = await api('GET', '/api/diagnostics/me/summary');
    } catch (e) { if (!e.sessionExpired) toast('Could not load summary: ' + e.message); return; }
    const s = state.summary;
    const attempted = s.summary.attempted || 0;
    const distinct = (s.summary.evidence && s.summary.evidence.distinctAttempts) || 0;
    $('#activityAttempted').textContent = String(attempted);
    $('#activityAttempts').textContent = `${distinct} attempt${distinct === 1 ? '' : 's'} submitted`;
    animateBar($('#activityBar'), s.summary.accuracyPct == null ? 0 : s.summary.accuracyPct);
    $('#activityEvidence').textContent = attempted
      ? `${s.summary.accuracyPct}% overall accuracy across every subject.`
      : 'No attempts yet — start a chapter below.';

    const list = $('#subjectsList');
    list.innerHTML = '';
    const colors = ['var(--violet-2)', 'var(--cyan)', 'var(--subject3)'];
    if (!s.bySubject.length) {
      list.innerHTML = '<div class="empty-note">Take a test to see per-subject accuracy here.</div>';
    } else {
      s.bySubject.forEach((sub, i) => {
        const row = document.createElement('div');
        row.className = 'subj-row';
        const pct = sub.summary.accuracyPct;
        row.innerHTML = `<span class="dot" style="background:${colors[i % colors.length]}"></span>
          <span class="label">${escapeHtml(sub.name)}</span>
          <div class="p-bar-track"><div class="p-bar-fill"></div></div>
          <span class="pct">${pct == null ? '—' : pct + '%'}</span>`;
        list.appendChild(row);
        animateBar(row.querySelector('.p-bar-fill'), pct || 0);
      });
    }
  }

  // ---- Paid subject diagnostics + mission + improvement + chapters ----
  async function loadSubjectSection() {
    const subj = currentSubject();
    $('#chaptersSubjectName').textContent = subj ? subj.name : '—';
    $('#challengeSub').textContent = subj ? `20 questions from across ${subj.name} (${state.board})` : '—';

    let chapters = [];
    try { chapters = (await api('GET', '/api/chapters?subject_id=' + state.subjectId)).chapters; } catch (e) { if (!e.sessionExpired) toast(e.message); }
    state.chapters = chapters;

    let diag = null;
    try { diag = await api('GET', '/api/diagnostics/me/subjects/' + state.subjectId); } catch (e) { if (!e.sessionExpired) toast(e.message); }
    state.subjectDiag = diag;

    let improvement = null;
    try { improvement = await api('GET', '/api/diagnostics/me/improvement'); } catch (e) { /* non-fatal */ }

    renderMissionAndLock(diag);
    renderChapters(chapters, diag);
    renderImprovement(improvement);
    renderContinue();
  }

  function renderMissionAndLock(diag) {
    const missionCard = $('#missionCard');
    const lockedCard = $('#lockedCard');
    if (!diag) { missionCard.hidden = true; lockedCard.hidden = true; return; }
    if (!diag.unlocked) {
      missionCard.hidden = true;
      lockedCard.hidden = false;
      $('#lockedMsg').textContent = (diag.upsell && diag.upsell.message) || 'Unlock your Board Ready Report to see chapter-by-chapter diagnostics.';
      return;
    }
    lockedCard.hidden = true;
    const weakest = diag.chapters && diag.chapters.length ? diag.chapters[0] : null; // API returns weakest-first
    if (!weakest || weakest.status === 'strong' || weakest.summary.attempted === 0) {
      missionCard.hidden = true;
      return;
    }
    missionCard.hidden = false;
    const acc = weakest.summary.accuracyPct == null ? '—' : weakest.summary.accuracyPct + '%';
    $('#missionTitle').textContent = weakest.chapterName;
    $('#missionMeta').textContent = `Accuracy ${acc} · ${weakest.summary.attempted} attempted so far · target 80%`;
    $('#missionBtn').onclick = () => startTestFlow({ subjectId: state.subjectId, chapterId: weakest.chapterId, subConcept: null, count: 8, kind: 'practice' });
  }

  $('#unlockBtn').addEventListener('click', async () => {
    try {
      await api('POST', '/api/subscriptions/activate', { plan: 'all-subject' });
      toast('Unlocked (demo subscription activated via the real /api/subscriptions/activate endpoint).');
      await loadSubjectSection();
    } catch (e) { if (!e.sessionExpired) toast('Could not unlock: ' + e.message); }
  });

  function renderChapters(chapters, diag) {
    const el = $('#chaptersList');
    el.innerHTML = '';
    if (!chapters.length) { el.innerHTML = '<div class="empty-note">No chapters published for this subject yet.</div>'; return; }
    const byId = new Map();
    if (diag && diag.unlocked) diag.chapters.forEach((c) => byId.set(c.chapterId, c));
    chapters.forEach((ch) => {
      const row = document.createElement('div');
      row.className = 'chapter-row';
      const d = byId.get(ch.id);
      const statusText = d ? (d.summary.attempted ? `${d.summary.accuracyPct}% accuracy · ${d.summary.attempted} attempted` : 'Not attempted yet') : 'Unlock report to see progress';
      row.innerHTML = `<div class="info"><b>${escapeHtml(ch.name)}</b><span>${escapeHtml(statusText)}</span></div>
        <div class="actions">
          <button class="p-btn p-btn-ghost p-btn-sm" data-act="practice" title="Practice mode: instant ✓/✕ feedback per question">Practice (10 Q)</button>
        </div>`;
      row.querySelector('[data-act="practice"]').addEventListener('click', () =>
        startTestFlow({ subjectId: state.subjectId, chapterId: ch.id, subConcept: null, count: 10, kind: 'practice' }));
      el.appendChild(row);
    });
  }

  $('#fullTestBtn').addEventListener('click', () => {
    if (!state.subjectId) { toast('Pick a subject first.'); return; }
    startTestFlow({ subjectId: state.subjectId, chapterId: null, subConcept: null, count: 20, kind: 'full' });
  });

  function renderImprovement(improvement) {
    const card = $('#improvementCard');
    if (!improvement || !improvement.unlocked || !improvement.topics || !improvement.topics.length) { card.hidden = true; return; }
    card.hidden = false;
    const list = $('#improvementList');
    list.innerHTML = '';
    improvement.topics.forEach((t) => {
      const v = t.vsOriginal;
      const cls = v.trend === 'improving' ? 'up' : v.trend === 'declining' ? 'down' : 'flat';
      const arrow = v.trend === 'improving' ? '↑' : v.trend === 'declining' ? '↓' : '→';
      const row = document.createElement('div');
      row.className = 'improvement-row';
      row.innerHTML = `<span>${escapeHtml(t.chapterName)}${t.subConcept ? ' · ' + escapeHtml(t.subConcept) : ''}</span><b class="${cls}">${arrow} ${v.reason}</b>`;
      list.appendChild(row);
    });
  }

  // ---- "Continue where you left off" — from the new GET /api/attempts/me ----
  let recentAttempts = [];
  async function loadRecentAttempts() {
    try { recentAttempts = (await api('GET', '/api/attempts/me?limit=20')).attempts; } catch (e) { recentAttempts = []; }
    renderContinue();
  }
  function renderContinue() {
    const strip = $('#continueStrip');
    const unfinished = recentAttempts.find((a) => !a.submittedAt);
    if (unfinished) {
      strip.hidden = false;
      $('#continueText').textContent = `You have an unfinished attempt: ${unfinished.subjectName} · ${unfinished.chapterName || 'Board Simulation'} (${unfinished.board})`;
      $('#continueLink').textContent = 'Resume →';
      $('#continueLink').onclick = (e) => { e.preventDefault(); resumeAttempt(unfinished); };
      return;
    }
    const lastDone = recentAttempts.find((a) => a.submittedAt);
    if (lastDone) {
      strip.hidden = false;
      const pct = lastDone.maxScore ? Math.round((100 * lastDone.score) / lastDone.maxScore) : null;
      $('#continueText').textContent = `Last practiced: ${lastDone.subjectName} · ${lastDone.chapterName || 'Board Simulation'} — ${pct == null ? '—' : pct + '%'}`;
      $('#continueLink').textContent = 'Practice again →';
      $('#continueLink').onclick = (e) => {
        e.preventDefault();
        startTestFlow({ subjectId: lastDone.subjectId, chapterId: lastDone.chapterId || null, subConcept: lastDone.subConcept || null, count: lastDone.chapterId ? 10 : 20, kind: lastDone.chapterId ? 'practice' : 'full' });
      };
      return;
    }
    strip.hidden = true;
  }

  async function resumeAttempt(row) {
    try {
      const q = await api('GET', `/api/attempts/${row.id}/questions`);
      // feedbackMode (2026-09-22, Phase 5): prefer the fresh value from the
      // real questions fetch (q.feedbackMode) — row.feedbackMode (from the
      // dashboard's attempt listing) is the same underlying column, but the
      // GET here is the authoritative, just-fetched read.
      state.test = { id: row.testId, subjectId: row.subjectId, chapterId: row.chapterId, subConcept: row.subConcept, kind: row.kind, subjectName: row.subjectName, chapterName: row.chapterName, feedbackMode: q.feedbackMode || row.feedbackMode || 'immediate' };
      state.attempt = { id: row.id, testId: row.testId, startedAt: row.startedAt, durationSeconds: row.durationSeconds };
      beginTestSession(q.steps, q.draftAnswers, q.checkedAnswers);
      const startedMs = new Date(row.startedAt.replace(' ', 'T') + 'Z').getTime();
      state.deadline = startedMs + row.durationSeconds * 1000;
      startTimer();
    } catch (e) { if (!e.sessionExpired) toast('Could not resume: ' + e.message); }
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ---------------------------------------------------------------------
  // START A TEST (practice or full)
  // ---------------------------------------------------------------------
  async function startTestFlow({ subjectId, chapterId, subConcept, count, kind }) {
    try {
      // Capture the pre-attempt Readiness score for the "evolved" comparison shown on Results.
      try {
        const r0 = await api('GET', '/api/diagnostics/me/readiness');
        state.preTestReadiness = r0.examReadiness ? r0.examReadiness.score : null;
      } catch { state.preTestReadiness = null; }

      const genPath = kind === 'full' ? '/api/tests/generate' : '/api/practice/generate';
      const genBody = kind === 'full' ? { subjectId, count } : { subjectId, chapterId, subConcept, count };
      const test = await api('POST', genPath, genBody);
      const subj = state.subjects.find((s) => s.id === subjectId);
      const chapterName = chapterId ? (state.chapters.find((c) => c.id === chapterId) || {}).name : null;
      await beginAttemptForTest(test, {
        subjectId, chapterId: chapterId || null, subConcept: subConcept || null, kind,
        subjectName: subj ? subj.name : '', chapterName: chapterName || null,
      });
    } catch (e) {
      if (!e.sessionExpired) toast('Could not start test: ' + e.message);
    }
  }

  // ---------------------------------------------------------------------
  // Shared tail for "we already have a real test row in the DB, now start a
  // real attempt against it" — factored out of startTestFlow so the
  // Improve-My-Score flow (which generates its test via a different
  // endpoint, /api/tests/improve, but otherwise needs the exact same
  // attempt/questions/timer bootstrapping) can reuse it instead of
  // duplicating the sequence or calling practice.generate() a second time.
  // ---------------------------------------------------------------------
  async function beginAttemptForTest(test, { subjectId, chapterId, subConcept, kind, subjectName, chapterName }) {
    // feedbackMode (2026-09-22, Phase 5): the just-created test's real
    // feedback_mode, as returned by whichever generator made it
    // (practice.generate / /api/tests/generate / /api/tests/improve) —
    // never guessed client-side. Re-confirmed from the questions fetch
    // below, which reads the same column straight from the test row.
    state.test = { id: test.id, subjectId, chapterId: chapterId || null, subConcept: subConcept || null, kind, subjectName: subjectName || '', chapterName: chapterName || null, feedbackMode: test.feedbackMode || 'immediate' };
    const attempt = await api('POST', '/api/attempts', { test_id: test.id });
    state.attempt = attempt;
    const q = await api('GET', `/api/attempts/${attempt.id}/questions`);
    state.test.feedbackMode = q.feedbackMode || state.test.feedbackMode;
    beginTestSession(q.steps, q.draftAnswers, q.checkedAnswers);
    state.deadline = Date.now() + attempt.durationSeconds * 1000;
    startTimer();
  }

  // ---------------------------------------------------------------------
  // IMPROVE MY SCORE (real, 2026-09-22) — NOT "try a similar question".
  // Asks the server for a genuinely new, targeted test built from this
  // student's actual wrong answers on sourceAttemptId (see
  // practice.generateImprovementTest on the backend), then starts a real
  // attempt against it exactly like any other test. The comparison shown
  // afterwards (see renderResults) comes back attached to THAT attempt's
  // /submit response, keyed by the same sourceAttemptId — never invented
  // client-side.
  // ---------------------------------------------------------------------
  async function startImprovementTest(sourceAttemptId) {
    try {
      try {
        const r0 = await api('GET', '/api/diagnostics/me/readiness');
        state.preTestReadiness = r0.examReadiness ? r0.examReadiness.score : null;
      } catch { state.preTestReadiness = null; }

      const test = await api('POST', '/api/tests/improve', { sourceAttemptId });
      const subj = state.subjects.find((s) => s.id === test.subjectId);
      await beginAttemptForTest(test, {
        subjectId: test.subjectId, chapterId: test.chapterId || null, subConcept: test.subConcept || null,
        kind: 'improvement',
        subjectName: subj ? subj.name : (state.test ? state.test.subjectName : ''),
        chapterName: 'Improvement test',
      });
    } catch (e) {
      if (!e.sessionExpired) toast('Could not start improvement test: ' + e.message);
    }
  }

  // savedAnswers: the draft this same attempt already had saved server-side
  // (from GET /api/attempts/:id/questions -> draftAnswers). Real for both a
  // freshly-started attempt (always {}) and a resumed one (whatever the
  // student had answered before they left/refreshed) — restoring it here,
  // instead of always resetting to {}, is what makes "Continue where you
  // left off" actually continue the answers, not just the question set/timer.
  function beginTestSession(steps, savedAnswers, checkedAnswers) {
    state.steps = steps;
    state.answers = { ...(savedAnswers || {}) };
    state.checked = { ...(checkedAnswers || {}) };
    state.flagged = new Set();
    state.idx = 0;
    state.autoSubmitted = false;
    $('#testSubjectName').textContent = `${state.test.subjectName || ''}${state.test.subjectName ? ' · ' : ''}${state.board || ''}`;
    $('#testChapterName').textContent = state.test.chapterName || 'Board Simulation';
    renderModeBadge();
    showScreen('test');
    renderTrack();
    renderQuestion();
    if (state.answers && Object.keys(state.answers).length) {
      toast(`Restored ${Object.keys(state.answers).length} previously saved answer(s).`);
    }
  }

  // ---------------------------------------------------------------------
  // PRACTICE vs BOARD SIMULATION badge (real, 2026-09-22, Phase 5) — makes
  // the mode visually unmistakable on the test screen itself, not just on
  // the dashboard buttons that started it. Driven entirely by
  // state.test.feedbackMode, which always comes from the server (the test
  // row's real feedback_mode column) — never guessed or defaulted per kind
  // client-side.
  // ---------------------------------------------------------------------
  function renderModeBadge() {
    const badge = $('#modeBadge');
    if (state.test.feedbackMode === 'deferred') {
      badge.hidden = false;
      badge.className = 'mode-badge mode-assessment';
      badge.textContent = 'Board Simulation · No feedback until submit';
    } else {
      badge.hidden = false;
      badge.className = 'mode-badge mode-practice';
      badge.textContent = 'Practice · Instant feedback';
    }
  }

  // ---------------------------------------------------------------------
  // REAL AUTOSAVE — debounced PATCH to /api/attempts/:id/answers. Saves the
  // single answer just picked (server merges it into whatever's already
  // saved, so a slow/failed save for one question never wipes another).
  // Failure is non-fatal and silent-ish (one toast, not a blocking error) —
  // the in-memory state.answers the student sees is unaffected either way;
  // only cross-session/refresh resume depends on this succeeding.
  // ---------------------------------------------------------------------
  let autosaveTimer = null;
  let autosavePending = {};
  function scheduleAutosave(key, value) {
    autosavePending[key] = value;
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(flushAutosave, 500);
  }
  async function flushAutosave() {
    if (!state.attempt || !Object.keys(autosavePending).length) return;
    const batch = autosavePending;
    autosavePending = {};
    try {
      await api('PATCH', `/api/attempts/${state.attempt.id}/answers`, { answers: batch });
    } catch (e) {
      // Non-fatal: keep answers in-memory regardless; surface once so a
      // persistent connectivity problem isn't totally invisible. Skip the
      // toast on a session expiry -- handleSessionExpired() (inside api())
      // has already redirected to login with its own message; a "could not
      // save" toast right after that would be confusing, not helpful.
      if (!e.sessionExpired) toast('Could not save your answer — check your connection.', 2000);
    }
  }

  function stepKey(step) { return `${step.questionId}:${step.label || ''}`; }

  // Focus management + Escape handling (2026-09-22, accessibility pass) —
  // the lightbox previously had no role, never moved focus in, and never
  // gave it back: a keyboard/screen-reader user who opened it had no way
  // to know it was a modal, no way to close it without a mouse, and lost
  // their place in the question when they did close it.
  // loadDiagram (Workstream 3B, 2026-09-25): shared by the inline question
  // card and the zoom lightbox. A raster crop (asset_type='source_cropped')
  // is shown the old way, as a plain <img src>. A native redrawn visual
  // (asset_type='ai_generated', served as .svg) is instead fetched as text
  // and inlined via innerHTML into a sibling host element, so its <path>/
  // <circle>/<text> fills can reference this page's own --ink/--violet/etc.
  // custom properties directly and inherit the real #app[data-theme]
  // cascade — an <img src="....svg"> only ever sees the OS-level
  // prefers-color-scheme media feature, which is a *different* signal from
  // this app's own in-app theme toggle (state.theme / data-theme, set from
  // the theme button + localStorage, independent of the OS setting) and can
  // land the wrong palette against the app's actual active background.
  //
  // createDiagramLoader() returns an independent loader function per call
  // site (one for the inline card, one for the lightbox) so that switching
  // questions quickly, or opening the lightbox right after a question loads,
  // can't let a slow, stale fetch for a previous diagram clobber a newer one
  // that resolves first — each loader tracks its own request sequence
  // number and drops any response that isn't the latest one it issued.
  const svgTextCache = new Map();
  function createDiagramLoader() {
    let seq = 0;
    return async function loadDiagram(url, imgEl, svgHostEl, wrapEl) {
      const mySeq = ++seq;
      const isSvg = typeof url === 'string' && /\.svg(\?|$)/i.test(url);
      imgEl.classList.toggle('is-vector', isSvg);
      if (wrapEl) wrapEl.classList.toggle('is-vector', isSvg);
      if (!url) {
        imgEl.hidden = false;
        imgEl.src = '';
        svgHostEl.hidden = true;
        svgHostEl.innerHTML = '';
        return;
      }
      if (!isSvg) {
        svgHostEl.hidden = true;
        svgHostEl.innerHTML = '';
        imgEl.hidden = false;
        imgEl.src = url;
        return;
      }
      // SVG path.
      imgEl.hidden = true;
      imgEl.src = '';
      try {
        let svgText = svgTextCache.get(url);
        if (svgText == null) {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`diagram fetch failed: HTTP ${res.status}`);
          svgText = await res.text();
          svgTextCache.set(url, svgText);
        }
        if (mySeq !== seq) return; // a newer load for this same host has since started
        svgHostEl.innerHTML = svgText;
        svgHostEl.hidden = false;
      } catch (err) {
        if (mySeq !== seq) return;
        console.error('Could not load diagram visual', url, err);
        svgHostEl.hidden = true;
        svgHostEl.innerHTML = '';
      }
    };
  }
  const loadMainDiagram = createDiagramLoader();
  const loadLightboxDiagram = createDiagramLoader();

  let diagramLightboxTrigger = null;
  function openDiagramLightbox(url, triggerEl) {
    diagramLightboxTrigger = triggerEl || document.activeElement;
    loadLightboxDiagram(url, $('#lightboxImg'), $('#lightboxSvgHost'), null);
    $('#diagramLightbox').hidden = false;
    $('#lightboxCloseBtn').focus();
    document.addEventListener('keydown', onDiagramLightboxKeydown);
  }
  function closeDiagramLightbox() {
    $('#diagramLightbox').hidden = true;
    $('#lightboxImg').src = '';
    $('#lightboxSvgHost').hidden = true;
    $('#lightboxSvgHost').innerHTML = '';
    document.removeEventListener('keydown', onDiagramLightboxKeydown);
    const trigger = diagramLightboxTrigger;
    diagramLightboxTrigger = null;
    if (trigger && typeof trigger.focus === 'function') trigger.focus();
  }
  function onDiagramLightboxKeydown(e) {
    if (e.key === 'Escape') closeDiagramLightbox();
  }
  $('#lightboxCloseBtn').addEventListener('click', closeDiagramLightbox);
  $('#diagramLightbox').addEventListener('click', (e) => { if (e.target === $('#diagramLightbox')) closeDiagramLightbox(); });

  function renderTrack() {
    const track = $('#testTrack');
    track.innerHTML = '';
    state.steps.forEach((step, i) => {
      if (i > 0) {
        const seg = document.createElement('div');
        seg.className = 'seg' + (i <= state.idx ? ' done' : '');
        track.appendChild(seg);
      }
      // Real <button> (2026-09-22, accessibility pass) — this was a plain
      // <div> with only a click handler, which meant a keyboard-only
      // student could not reach the question navigator at all (divs aren't
      // focusable or Enter/Space-operable without extra work a div never
      // got here). aria-label carries the same answered/flagged state that
      // was previously color-only, and aria-current marks the question
      // currently being viewed.
      const dot = document.createElement('button');
      dot.type = 'button';
      const answered = state.answers[stepKey(step)] != null;
      const flagged = state.flagged.has(stepKey(step));
      dot.className = 'tdot' + (answered ? ' answered' : '') + (i === state.idx ? ' current' : '') + (flagged ? ' flag' : '');
      const parts = [`Question ${i + 1}`, answered ? 'answered' : 'not answered'];
      if (flagged) parts.push('flagged for review');
      dot.setAttribute('aria-label', parts.join(', '));
      if (i === state.idx) dot.setAttribute('aria-current', 'true');
      dot.addEventListener('click', () => { state.idx = i; renderQuestion(); renderTrack(); });
      track.appendChild(dot);
    });
  }

  // Assertion (A): ... Reason (R): ... — real question_type='assertion_reasoning'
  // content (266 in the bank, 62 already live/gradable today) is transcribed
  // as one plain-text blob. Split it into the two labeled statements so it
  // reads the way it's meant to, instead of one run-on paragraph. Returns
  // null if the text doesn't actually match the expected shape (defensive —
  // falls back to plain rendering rather than mangling something unexpected).
  function splitAssertionReason(text) {
    const m = /assertion\s*\(a\)\s*:?\s*(.+?)\s*reason\s*\(r\)\s*:?\s*(.+)/is.exec(text || '');
    if (!m) return null;
    return { assertion: m[1].trim(), reason: m[2].trim() };
  }

  function renderQuestion() {
    const step = state.steps[state.idx];
    $('#testQCount').textContent = `Question ${state.idx + 1} of ${state.steps.length}`;
    const isAssertionReason = step.questionType === 'assertion_reasoning';
    const kindLabel = step.kind === 'case' ? `Case study · part ${step.label.toUpperCase()}`
      : step.kind === 'open' ? 'Self-assessed · not scored'
      : isAssertionReason ? 'Assertion & Reason'
      : 'MCQ';
    $('#qEyebrow').textContent = `${kindLabel} · ${step.marks} mark${step.marks === 1 ? '' : 's'}`;
    const dotsOn = step.difficulty === 'Hard' ? 3 : step.difficulty === 'Medium' ? 2 : 1;
    $('#qDifficulty').innerHTML = `${escapeHtml(step.difficulty || '—')} <span class="lv">${[1, 2, 3].map((n) => `<i class="${n <= dotsOn ? 'on' : ''}"></i>`).join('')}</span>`;

    const ar = isAssertionReason ? splitAssertionReason(step.text) : null;
    if (ar) {
      $('#qText').innerHTML = `<div class="ar-block"><span class="ar-label">Assertion (A)</span><p class="ar-stmt">${escapeHtml(ar.assertion)}</p></div>` +
        `<div class="ar-block"><span class="ar-label">Reason (R)</span><p class="ar-stmt">${escapeHtml(ar.reason)}</p></div>`;
    } else {
      $('#qText').textContent = step.text;
    }

    // Diagram-as-first-class-content (2026-09-22): renders a real, cropped
    // per-question image when the step carries one — `step.diagramUrl` is
    // not produced by any live question today (see the Phase 2 report: the
    // content bank has zero genuinely-extracted diagram crops yet, only
    // whole-page photos, which are deliberately never served here). This
    // code path exists and is tested against a real cropped source image;
    // it lights up automatically the day a real extraction pipeline starts
    // populating `diagramUrl` for a gradable question — no frontend change
    // needed then.
    const diagramWrap = $('#qDiagramWrap');
    if (step.diagramUrl) {
      diagramWrap.hidden = false;
      // loadMainDiagram (Workstream 3B, 2026-09-25) picks the right display
      // path per asset kind: a raster crop of an actual scanned source page
      // (asset_type='source_cropped') stays a plain <img> — it really is a
      // photo of white paper and keeps its white backing regardless of
      // theme — while a native, redrawn Board Ready visual
      // (asset_type='ai_generated', served as .svg) is fetched and inlined
      // as real markup into #qDiagramSvgHost so it reads --ink/--violet/etc.
      // straight from this page and tracks the app's in-app theme toggle
      // exactly (see the function's own comment for why an <img src=...svg>
      // can't do that). This does not change which asset gets served —
      // that's server.js's job.
      loadMainDiagram(step.diagramUrl, $('#qDiagramImg'), $('#qDiagramSvgHost'), diagramWrap);
      diagramWrap.onclick = () => openDiagramLightbox(step.diagramUrl, diagramWrap);
      // Keyboard-operable (2026-09-22, accessibility pass) — diagramWrap
      // carries role="button" tabindex="0" in the markup now, but a
      // native <div> never fires a click from Enter/Space the way a real
      // <button> does, so that has to be wired by hand here.
      diagramWrap.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          openDiagramLightbox(step.diagramUrl, diagramWrap);
        }
      };
    } else {
      diagramWrap.hidden = true;
      diagramWrap.onclick = null;
      diagramWrap.onkeydown = null;
      $('#qDiagramSvgHost').hidden = true;
      $('#qDiagramSvgHost').innerHTML = '';
    }

    const optsEl = $('#qOptions');
    optsEl.innerHTML = '';
    const key = stepKey(step);

    if (step.kind === 'open') {
      // Real, honest self-assessment mode (2026-09-22, Phase 3) for the
      // 815 real open/descriptive questions in the bank: no auto-grader
      // exists for free text, so this never claims to score it. The
      // student writes their own answer (autosaved like any other), and
      // on the results screen it's shown alongside the question's real
      // `explanation`/reference when one exists — never counted toward
      // score/maxScore (see scoring.js's gradeSubmission).
      const savedText = state.answers[key] ? state.answers[key].text : '';
      optsEl.innerHTML = `<div class="open-answer-wrap">
        <label class="open-answer-label" for="qOpenAnswer">Write your own answer (self-assessed, not auto-scored)</label>
        <textarea id="qOpenAnswer" class="open-answer-input" rows="5" placeholder="Type your working/answer here..."></textarea>
      </div>`;
      const textarea = $('#qOpenAnswer');
      textarea.value = savedText || '';
      // scheduleAutosave() already debounces (500ms since the last call) and
      // coalesces into one PATCH — no need for a second debounce layer here,
      // that was just doubling the delay before a reload would actually see
      // the save (a real bug this test caught: a 700ms wait wasn't enough
      // for the old 500ms-then-500ms chain).
      textarea.addEventListener('input', () => {
        if (textarea.value.trim()) state.answers[key] = { text: textarea.value };
        else delete state.answers[key];
        scheduleAutosave(key, { text: textarea.value });
        renderTrack();
      });
    } else {
      // Practice vs Board Simulation (2026-09-22, Phase 5): whether options
      // ever lock/reveal via POST /api/attempts/:id/check at all is gated on
      // the real test.feedback_mode (state.test.feedbackMode), server-set at
      // test creation — never a client-side guess. In a deferred
      // (Assessment) test, `immediate` is false: options stay plain and
      // clickable all the way through, exactly like the app worked before
      // Phase 4's immediate-feedback UI existed, and no /check call is ever
      // made (the endpoint also rejects it server-side — see server.js).
      //
      // In an immediate (Practice) test, once a step has been "checked"
      // (state.checked, populated live on click below and restored from the
      // real GET /questions response's `checkedAnswers` on resume), its
      // options render as a LOCKED, already-graded state: no more click
      // handlers, the student's own pick and the real correct option both
      // marked, plus a compact correct/incorrect banner and explanation.
      const immediate = state.test.feedbackMode !== 'deferred';
      const locked = immediate ? state.checked[key] : null;
      const selected = locked ? locked.optionIndex : (state.answers[key] ? state.answers[key].optionIndex : null);
      (step.options || []).forEach((optText, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        let cls = 'opt';
        if (locked) {
          if (i === locked.optionIndex && locked.correct) cls += ' correct-pick';
          else if (i === locked.optionIndex && !locked.correct) cls += ' wrong-pick';
          else if (i === locked.correctOptionIndex) cls += ' correct-reveal';
          btn.disabled = true;
        } else if (selected === i) {
          cls += ' sel';
        }
        btn.className = cls;
        btn.setAttribute('aria-pressed', selected === i ? 'true' : 'false');
        // Screen-reader state text (2026-09-22, accessibility pass): the
        // locked/correct/incorrect state was previously conveyed ONLY by
        // color and an icon — invisible to a screen reader, which would
        // just hear the option text with no indication of which one was
        // picked or right. sr-only text makes the real graded state
        // available without changing how it looks for sighted students.
        // The icon itself is marked aria-hidden since this text now covers
        // its meaning.
        let icon = '';
        let srState = '';
        if (locked) {
          const isMyPick = i === locked.optionIndex;
          const isCorrectAnswer = i === locked.correctOptionIndex;
          if (isMyPick && locked.correct) { icon = '<svg aria-hidden="true" class="p-icon checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>'; srState = ' (your answer — correct)'; }
          else if (isMyPick && !locked.correct) { icon = '<svg aria-hidden="true" class="p-icon xmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>'; srState = ' (your answer — incorrect)'; }
          else if (isCorrectAnswer) { icon = '<svg aria-hidden="true" class="p-icon checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>'; srState = ' (correct answer)'; }
        } else if (selected === i) {
          icon = '<svg aria-hidden="true" class="p-icon checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';
          srState = ' (selected)';
        }
        btn.innerHTML = `<span class="letter" aria-hidden="true">${String.fromCharCode(65 + i)}</span> <span>${escapeHtml(optText)}</span>${icon}${srState ? `<span class="sr-only">${escapeHtml(srState)}</span>` : ''}`;
        if (!locked) {
          btn.addEventListener('click', () => (immediate ? checkAnswer(step, key, i) : selectDeferredAnswer(step, key, i)));
        }
        optsEl.appendChild(btn);
      });

      if (immediate) renderFeedbackBanner(step, key);
      else { const banner = $('#qFeedback'); if (banner) { banner.hidden = true; banner.innerHTML = ''; } }
    }

    $('#prevBtn').disabled = state.idx === 0;
    $('#nextBtn').textContent = state.idx === state.steps.length - 1 ? 'Submit test →' : 'Next →';
    setPressed($('#flagBtn'), state.flagged.has(key), 'on');
    announceQuestionChange();
  }

  // Announces the question change to screen readers (2026-09-22,
  // accessibility pass). Previously, clicking Next/Previous or a track dot
  // silently swapped the visible question text with no signal to a screen
  // reader that anything happened — sighted students see the new question
  // immediately, but a screen-reader user would hear nothing until they
  // manually re-explored the page. This live region speaks a short summary
  // (position + flagged state) whenever renderQuestion() runs; the question
  // text itself is already a real heading (#qText, role="heading") a screen
  // reader can navigate to for the full content.
  function announceQuestionChange() {
    const region = $('#qLiveRegion');
    if (!region) return;
    const key = stepKey(state.steps[state.idx]);
    const flaggedNote = state.flagged.has(key) ? ', flagged for review' : '';
    region.textContent = `Question ${state.idx + 1} of ${state.steps.length}${flaggedNote}`;
  }

  // Renders the compact "✓ Correct" / "✕ Not quite" banner + a short "why"
  // block right below the options — real data only: `explanation` comes
  // from the question's actual `explanation` column (server-side, only ever
  // sent for a step that's already been checked, same leak-prevention rule
  // as the results-screen explanation experience), and an honest fallback
  // when the bank has none. No misconception is invented — see server.js's
  // /check endpoint and scoring.js's gradeOneStep, which this only displays.
  function renderFeedbackBanner(step, key) {
    let banner = $('#qFeedback');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'qFeedback';
      $('.qcard').appendChild(banner);
    }
    const locked = state.checked[key];
    if (!locked) { banner.hidden = true; banner.innerHTML = ''; return; }
    banner.hidden = false;
    if (locked.correct) {
      banner.className = 'q-feedback q-feedback-correct';
      banner.innerHTML = `<div class="qf-head">✓ Correct</div>`;
    } else {
      const opts = step.options || [];
      const why = locked.explanation
        ? escapeHtml(locked.explanation)
        : 'An explanation for this question has not been recorded yet.';
      banner.className = 'q-feedback q-feedback-incorrect';
      banner.innerHTML = `<div class="qf-head">✕ Not quite</div>
        <div class="qf-why-label">Why this answer is wrong</div>
        <p class="qf-why">${why}</p>`;
    }
  }

  // Sends the pick to the real, server-authoritative check endpoint. The
  // click is optimistic only in that the button disables immediately
  // (prevents a double-submit race); the actual correct/incorrect verdict
  // and explanation always come back from the server, never guessed
  // client-side — this file has no copy of any answer key.
  async function checkAnswer(step, key, optionIndex) {
    state.answers[key] = { optionIndex };
    $all('#qOptions .opt').forEach((b) => { b.disabled = true; });
    try {
      const result = await api('POST', `/api/attempts/${state.attempt.id}/check`, { key, answer: { optionIndex } });
      state.checked[key] = { optionIndex: result.submittedOptionIndex, correct: result.correct, correctOptionIndex: result.correctOptionIndex, explanation: result.explanation };
    } catch (e) {
      // Non-fatal: still record the pick locally/via autosave so the test
      // isn't blocked by a network hiccup — the student just doesn't get
      // the immediate-feedback UI for this one question, and it will still
      // be graded normally (unlocked) at final submit. A session-expiry is
      // the one exception -- scheduleAutosave()'s own PATCH will also 401
      // and go nowhere, and handleSessionExpired() has already redirected
      // to login, so there's nothing useful left to autosave or toast here.
      if (e.sessionExpired) { renderQuestion(); renderTrack(); return; }
      scheduleAutosave(key, { optionIndex });
      toast('Could not check that answer — continuing without instant feedback.', 2200);
    }
    renderQuestion();
    renderTrack();
  }

  // Board Simulation / Assessment (2026-09-22, Phase 5): the plain,
  // no-feedback pick — just records the selection (draft, autosaved) and
  // moves on, exactly like a real exam. No server round-trip beyond the
  // ordinary debounced autosave, no lock, no reveal; the real answer key
  // and explanations only ever appear after this attempt is submitted.
  function selectDeferredAnswer(step, key, optionIndex) {
    state.answers[key] = { optionIndex };
    scheduleAutosave(key, { optionIndex });
    renderQuestion();
    renderTrack();
  }

  $('#prevBtn').addEventListener('click', () => { if (state.idx > 0) { state.idx--; renderQuestion(); renderTrack(); } });
  $('#nextBtn').addEventListener('click', () => {
    if (state.idx < state.steps.length - 1) { state.idx++; renderQuestion(); renderTrack(); }
    else confirmSubmit();
  });
  $('#flagBtn').addEventListener('click', () => {
    const key = stepKey(state.steps[state.idx]);
    if (state.flagged.has(key)) state.flagged.delete(key); else state.flagged.add(key);
    renderQuestion(); renderTrack();
  });

  function confirmSubmit() {
    const unanswered = state.steps.length - Object.keys(state.answers).length;
    const msg = unanswered > 0
      ? `${unanswered} question(s) are unanswered. Submit anyway?`
      : 'Submit this test?';
    if (window.confirm(msg)) submitAttempt(false);
  }

  function startTimer() {
    clearInterval(state.timerHandle);
    tickTimer();
    state.timerHandle = setInterval(tickTimer, 1000);
  }
  function tickTimer() {
    const remainingMs = state.deadline - Date.now();
    const timerEl = $('#testTimer');
    // Value goes in its own inner span (#testTimerValue), separate from the
    // sr-only "Time remaining:" label that stays in the DOM (2026-09-22,
    // accessibility pass) — updating textContent on the whole #testTimer
    // used to silently delete that label every second. No aria-live here on
    // purpose: a screen-reader user can tab to/query the timer for the
    // current value, but an announcement every second would be unusable
    // noise, so this is a plain (not live) accessible name/value pair.
    const valueEl = $('#testTimerValue');
    if (remainingMs <= 0) {
      valueEl.textContent = '00:00';
      timerEl.classList.add('low');
      if (!state.autoSubmitted) { state.autoSubmitted = true; submitAttempt(true); }
      return;
    }
    const totalSec = Math.ceil(remainingMs / 1000);
    const m = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    valueEl.textContent = `${m}:${s}`;
    timerEl.classList.toggle('low', totalSec <= 60);
  }

  // ---------------------------------------------------------------------
  // SUBMIT + RESULTS
  // ---------------------------------------------------------------------
  async function submitAttempt(auto) {
    clearInterval(state.timerHandle);
    clearTimeout(autosaveTimer);
    await flushAutosave(); // don't lose a just-picked answer sitting in the debounce window
    let resp;
    try {
      resp = await api('POST', `/api/attempts/${state.attempt.id}/submit`, { answers: state.answers });
    } catch (e) {
      if (!e.sessionExpired) toast('Submit failed: ' + e.message);
      return;
    }
    if (auto) toast('Time was up — this attempt was submitted automatically.');

    // Prior best on this exact chapter (real comparison against /api/attempts/me), only
    // shown when there IS a prior submitted attempt on the same chapter to beat.
    let priorBestAccuracy = null;
    if (state.test.chapterId) {
      try {
        const list = (await api('GET', '/api/attempts/me?limit=50')).attempts;
        const priors = list.filter((a) => a.chapterId === state.test.chapterId && a.submittedAt && a.id !== state.attempt.id && a.maxScore);
        if (priors.length) priorBestAccuracy = Math.max(...priors.map((a) => Math.round((100 * a.score) / a.maxScore)));
      } catch { /* non-fatal */ }
    }

    let newReadinessScore = null;
    try {
      const r1 = await api('GET', '/api/diagnostics/me/readiness');
      newReadinessScore = r1.examReadiness ? r1.examReadiness.score : null;
    } catch { /* non-fatal */ }

    renderResults(resp, { priorBestAccuracy, prevReadiness: state.preTestReadiness, newReadiness: newReadinessScore });
    showScreen('results');
    // Refresh dashboard data in the background so it's current when the student goes back.
    refreshDashboard();
  }

  function renderResults(resp, ctx) {
    $('#resSubtitle').textContent = state.test.chapterName
      ? `${state.test.chapterName} · ${state.test.subjectName} (${state.board})`
      : `Full test · ${state.test.subjectName} (${state.board})`;

    const correctCount = resp.perQuestion.filter((p) => p.correct).length;
    const ungradedCount = resp.ungradedCount || 0;
    const gradedTotal = resp.totalSteps - ungradedCount;
    setCore($('#resCore'), resp.accuracyPct ?? 0);
    // ungradedCount (2026-09-22, Phase 3): real open/descriptive steps never
    // count toward the score/percentage (see scoring.js) — the "X / Y
    // correct" fraction is out of the GRADABLE total, not every step in the
    // attempt, and self-assessed items get their own honest callout instead
    // of silently vanishing from the count.
    $('#resCorrectLine').innerHTML = `<b>${correctCount} / ${gradedTotal} correct</b> · ${resp.totalSteps - resp.answeredCount} unanswered` +
      (ungradedCount ? ` · ${ungradedCount} self-assessed (not scored)` : '');

    const hero = $('#resHero');
    hero.classList.remove('play'); void hero.offsetWidth; hero.classList.add('play');

    const pbBadge = $('#pbBadge');
    pbBadge.hidden = !(ctx.priorBestAccuracy != null && resp.accuracyPct != null && resp.accuracyPct > ctx.priorBestAccuracy);

    const deltaEl = $('#resDelta');
    const vsOriginal = resp.practiceProgress && resp.practiceProgress.vsOriginal;
    if (vsOriginal && vsOriginal.delta != null) {
      deltaEl.hidden = false;
      deltaEl.classList.toggle('down', vsOriginal.delta < 0);
      const arrow = vsOriginal.delta > 0 ? '↑' : vsOriginal.delta < 0 ? '↓' : '→';
      deltaEl.textContent = `${arrow} ${vsOriginal.delta >= 0 ? '+' : ''}${vsOriginal.delta} points vs your first attempt on this topic`;
    } else {
      deltaEl.hidden = true;
    }

    const evolvedEl = $('#coreEvolved');
    if (ctx.prevReadiness != null && ctx.newReadiness != null) {
      evolvedEl.hidden = false;
      $('#evolveFrom').textContent = ctx.prevReadiness;
      $('#evolveTo').textContent = ctx.newReadiness;
      $('#evolveTo').style.color = ctx.newReadiness > ctx.prevReadiness ? 'var(--success)' : ctx.newReadiness < ctx.prevReadiness ? 'var(--critical)' : 'var(--ink)';
    } else {
      evolvedEl.hidden = true;
    }

    // Group this attempt's steps by sub-concept for weak-spot / strengths / mistakes.
    // Ungraded (open/descriptive) steps are excluded — they have no
    // correct/incorrect verdict at all, so folding them in here would count
    // every one as "wrong" (see scoring.js's gradeSubmission) and silently
    // corrupt weak-spot detection with a question type nothing scores.
    const bySub = new Map();
    resp.perQuestion.filter((p) => !p.ungraded).forEach((p) => {
      const key = p.subConcept || p.chapterName || 'General';
      if (!bySub.has(key)) bySub.set(key, { chapterId: p.chapterId, chapterName: p.chapterName, subConcept: p.subConcept, correct: 0, total: 0 });
      const g = bySub.get(key);
      g.total += 1; if (p.correct) g.correct += 1;
    });
    const groups = [...bySub.entries()].map(([name, g]) => ({ name, ...g, wrong: g.total - g.correct, acc: Math.round((100 * g.correct) / g.total) }));
    const weakGroups = groups.filter((g) => g.wrong > 0).sort((a, b) => b.wrong - a.wrong);
    const strongGroups = groups.filter((g) => g.correct === g.total);

    const weakHero = $('#weakspotHero');
    if (weakGroups.length) {
      weakHero.hidden = false;
      const top = weakGroups[0];
      $('#weakspotTitle').textContent = top.name;
      $('#weakspotAcc').textContent = top.acc + '%';
      $('#weakspotBody').textContent = `You missed ${top.wrong} of ${top.total} question(s) tagged "${top.name}" in this attempt.`;
      $('#weakspotTrainBtn').onclick = () => startTestFlow({ subjectId: state.test.subjectId, chapterId: top.chapterId || state.test.chapterId, subConcept: top.subConcept || null, count: 8, kind: 'practice' });
    } else {
      weakHero.hidden = true;
    }

    const strengthsCard = $('#strengthsCard');
    if (strongGroups.length) {
      strengthsCard.hidden = false;
      $('#strengthsList').innerHTML = strongGroups.slice(0, 4).map((g) =>
        `<div class="item"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M5 13l4 4L19 7"/></svg> ${escapeHtml(g.name)}</div>`
      ).join('');
    } else {
      strengthsCard.hidden = true;
    }

    const mistakeCard = $('#mistakeCard');
    if (weakGroups.length) {
      mistakeCard.hidden = false;
      $('#mistakeRows').innerHTML = weakGroups.map((g) =>
        `<div class="mrow"><b>${g.wrong} wrong</b> — ${escapeHtml(g.name)}</div>`).join('');
    } else {
      mistakeCard.hidden = true;
    }

    renderExplanations(resp);

    const batStrip = $('#batStrip');
    if (vsOriginal && vsOriginal.attemptsCount >= 2) {
      batStrip.hidden = false;
      $('#batFirst').textContent = vsOriginal.originalPct + '%';
      $('#batNow').textContent = vsOriginal.latestPct + '%';
    } else {
      batStrip.hidden = true;
    }

    $('#retakeBtn').onclick = () => startTestFlow({
      subjectId: state.test.subjectId, chapterId: state.test.chapterId, subConcept: state.test.subConcept,
      count: state.test.chapterId ? 10 : 20, kind: state.test.kind,
    });

    renderImproveCard(resp, weakGroups);
  }

  // ---------------------------------------------------------------------
  // "Improve My Score" CTA + the after-the-fact comparison block, both
  // real (2026-09-22). Two independent, real-data-driven pieces:
  //  1. improveCard — shown on THIS results screen whenever this attempt
  //     actually lost marks (weakGroups.length > 0), i.e. there is
  //     something real to target. Clicking it starts a genuinely new test
  //     (see startImprovementTest) — never the same questions again.
  //  2. improveCompareCard — shown only when THIS submit response carries
  //     a real resp.improvementComparison block, which the backend only
  //     attaches when the just-submitted attempt was itself generated via
  //     /api/tests/improve (tests.improves_attempt_id set). That means
  //     this card renders on the RESULTS OF THE IMPROVEMENT TEST, not on
  //     the original attempt's results — showing the actual before/after.
  // ---------------------------------------------------------------------
  function renderImproveCard(resp, weakGroups) {
    const improveCard = $('#improveCard');
    if (weakGroups.length && !resp.improvementComparison) {
      improveCard.hidden = false;
      // Real-numbers CTA copy (2026-09-22, Phase 5, revised same day per
      // feedback): states what happened as a fact ("N marks were lost"),
      // not a promise that Improve My Score will get them back — Board
      // Ready offers an opportunity to improve, not a guarantee of specific
      // marks recovered. "marks lost" is just maxScore - score, both
      // already real fields on this same submit response — never a
      // separately invented figure.
      const marksLost = (resp.maxScore != null && resp.score != null) ? (resp.maxScore - resp.score) : null;
      const topicWord = weakGroups.length === 1 ? 'area' : 'areas';
      $('#improveTitle').textContent = marksLost != null && marksLost > 0
        ? `${marksLost} mark${marksLost === 1 ? '' : 's'} lost in this attempt`
        : 'Areas to improve';
      $('#improveMeta').textContent = `Your improvement test targets these ${topicWord}: ${weakGroups.slice(0, 2).map((g) => g.name).join(', ')}${weakGroups.length > 2 ? ', and more' : ''}.`;
      const finishedAttemptId = state.attempt.id;
      $('#improveScoreBtn').onclick = () => startImprovementTest(finishedAttemptId);
    } else {
      improveCard.hidden = true;
    }

    const compareCard = $('#improveCompareCard');
    const cmp = resp.improvementComparison;
    if (!cmp) { compareCard.hidden = true; return; }
    compareCard.hidden = false;
    $('#icFirstPct').textContent = cmp.sourceAccuracyPct != null ? cmp.sourceAccuracyPct + '%' : '—';
    $('#icNowPct').textContent = cmp.newAccuracyPct != null ? cmp.newAccuracyPct + '%' : '—';
    // Real bar-width visual (2026-09-22, Phase 5) — a straight percentage
    // width from the same two real numbers already shown as text above;
    // no separate computation, so it can never disagree with the numbers.
    $('#icBarFirst').style.width = (cmp.sourceAccuracyPct ?? 0) + '%';
    $('#icBarNow').style.width = (cmp.newAccuracyPct ?? 0) + '%';
    const deltaEl = $('#icDelta');
    if (cmp.deltaPct != null) {
      const arrow = cmp.deltaPct > 0 ? '↑' : cmp.deltaPct < 0 ? '↓' : '→';
      deltaEl.textContent = `${arrow} ${cmp.deltaPct >= 0 ? '+' : ''}${cmp.deltaPct} points vs your first attempt`;
      deltaEl.style.color = cmp.deltaPct > 0 ? 'var(--success)' : cmp.deltaPct < 0 ? 'var(--critical)' : 'var(--ink-faint)';
    } else {
      deltaEl.textContent = 'Comparison unavailable for this attempt.';
      deltaEl.style.color = 'var(--ink-faint)';
    }
    const badgeClass = { improved: 'improved', still_needs_practice: 'still', not_retested: 'not_retested' };
    const badgeLabel = { improved: 'Improved ✓', still_needs_practice: 'Still needs practice', not_retested: 'Not retested' };
    $('#icSubRows').innerHTML = (cmp.bySubConcept || []).map((s) => {
      const cls = badgeClass[s.status] || 'not_retested';
      const label = badgeLabel[s.status] || s.status;
      return `<div class="ic-sub-row"><span>${escapeHtml(s.name)}</span><span class="badge ${cls}">${escapeHtml(label)}</span></div>`;
    }).join('');
  }

  // ---------------------------------------------------------------------
  // WRONG-ANSWER EXPLANATION EXPERIENCE (real, 2026-09-22): for every step
  // that was answered wrong or left unanswered, shows the actual question
  // text, the option the student picked vs. the actual correct option (both
  // now sent by /submit — see server.js's perQuestion mapping), and the
  // question's real `explanation` column when the bank has one for it. When
  // it doesn't (most of the bank doesn't yet), this says so honestly instead
  // of inventing a "why" — Board Ready doesn't have a misconception-detection
  // model; it only ever shows what's actually in the database.
  // ---------------------------------------------------------------------
  function renderExplanations(resp) {
    const card = $('#explainCard');
    // ungraded (open/descriptive) steps are never "wrong" — they have no
    // correct/correctOptionIndex at all (see scoring.js) — so they get their
    // own self-assessment section below, never mixed into "wrong answers".
    const misses = resp.perQuestion.filter((p) => !p.ungraded && !p.correct);
    const selfAssessed = resp.perQuestion.filter((p) => p.ungraded);
    if (!misses.length && !selfAssessed.length) { card.hidden = true; return; }
    card.hidden = false;
    const letter = (i) => (i == null ? null : String.fromCharCode(65 + i));
    const missHtml = misses.map((p) => {
      const opts = Array.isArray(p.options) ? p.options : [];
      const yourL = letter(p.submittedOptionIndex);
      const rightL = letter(p.correctOptionIndex);
      const yourText = yourL != null ? escapeHtml(opts[p.submittedOptionIndex] ?? '') : null;
      const rightText = escapeHtml(opts[p.correctOptionIndex] ?? '');
      const answerLine = p.answered
        ? `<span>Your answer: <b class="wrong">${yourL}</b> ${yourText}</span><span>Correct answer: <b class="right">${rightL}</b> ${rightText}</span>`
        : `<span class="eq-unanswered">Not answered</span><span>Correct answer: <b class="right">${rightL}</b> ${rightText}</span>`;
      const why = p.explanation
        ? `<div class="eq-why">${escapeHtml(p.explanation)}</div>`
        : `<div class="eq-why eq-why-missing">No worked explanation is recorded for this question yet.</div>`;
      return `<div class="explain-item">
        <p class="eq-text">${escapeHtml(p.text || '')}</p>
        <div class="eq-answers">${answerLine}</div>
        ${why}
        <button type="button" class="eq-practice" data-chapter="${p.chapterId}" data-sub="${escapeAttr(p.subConcept || '')}">Practice similar →</button>
      </div>`;
    }).join('');
    // Self-assessed (open/descriptive): shows the student's own written
    // answer plus the real reference/explanation when the bank has one —
    // never a computed verdict, since none exists for free text.
    const selfHtml = selfAssessed.map((p) => {
      const yourText = p.submittedText ? escapeHtml(p.submittedText) : null;
      const refText = p.explanation
        ? `<div class="eq-why">${escapeHtml(p.explanation)}</div>`
        : `<div class="eq-why eq-why-missing">No reference answer is recorded for this question yet — self-check against your notes/textbook.</div>`;
      return `<div class="explain-item explain-item-open">
        <p class="eq-text">${escapeHtml(p.text || '')}</p>
        <div class="eq-answers"><span class="eq-self-tag">Self-assessed · not scored</span></div>
        ${yourText ? `<div class="eq-your-text">${yourText}</div>` : '<p class="eq-unanswered" style="margin:0 0 8px;">You left this blank.</p>'}
        ${refText}
        <button type="button" class="eq-practice" data-chapter="${p.chapterId}" data-sub="${escapeAttr(p.subConcept || '')}">Practice similar →</button>
      </div>`;
    }).join('');
    $('#explainRows').innerHTML = missHtml + selfHtml;
    $all('.eq-practice', $('#explainRows')).forEach((btn) => {
      btn.addEventListener('click', () => {
        startTestFlow({ subjectId: state.test.subjectId, chapterId: Number(btn.dataset.chapter) || state.test.chapterId, subConcept: btn.dataset.sub || null, count: 8, kind: 'practice' });
      });
    });
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/"/g, '&quot;'); }

  $('#resultsBackBtn').addEventListener('click', () => showScreen('dash'));
  $('#backToDashBtn').addEventListener('click', () => showScreen('dash'));

  // ---------------------------------------------------------------------
  // BOOT
  // ---------------------------------------------------------------------
  $('#themeBtn').addEventListener('click', toggleTheme);
  $('#themeBtn2').addEventListener('click', toggleTheme);

  (async function boot() {
    loadSession();
    applyTheme();
    loadLandingStats();
    if (state.token && state.user) {
      try { await enterApp(); } catch { clearSession(); showScreen('login'); }
    } else {
      showScreen('login');
    }
  })();
})();
