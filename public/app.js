// Board Ready — frontend logic (2026 redesign).
// Every number rendered here comes from this server's /api/* routes. Where
// the API has no data for something (no readiness yet, no topic evidence,
// a locked report), the UI says so instead of inventing a value.

(() => {
  'use strict';

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $all = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  function setPressed(el, on, cls) {
    el.classList.toggle(cls, on);
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
  }
  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  const pct = (num, den) => (den ? Math.round((100 * num) / den) : null);
  const plural = (n, one, many) => `${n} ${n === 1 ? one : (many || one + 's')}`;
  // Mirrors practice.js: durationSeconds = max(300, questionCount * 90).
  const durationMinutesFor = (count) => Math.round(Math.max(300, count * 90) / 60);

  // ---------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------
  const state = {
    token: null,
    user: null,
    theme: 'dark',
    landingBoard: 'CBSE',
    board: 'CBSE',
    subjects: [],
    subjectId: null,          // subject shown on the Practice screen
    chapters: [],             // chapters for state.subjectId
    chaptersBySubject: {},    // subjectId -> chapters
    diagBySubject: {},        // subjectId -> /api/diagnostics/me/subjects/:id
    readiness: null,
    summary: null,
    recentAttempts: [],
    createBoardPick: 'CBSE',

    // active test
    test: null,               // { id, subjectId, chapterId, subConcept, kind, subjectName, chapterName, feedbackMode, improvesAttemptId }
    attempt: null,
    steps: [],
    answers: {},
    checked: {},
    flagged: new Set(),
    idx: 0,
    deadline: 0,
    timerHandle: null,
    autoSubmitted: false,
    submitting: false,
    preTestReadiness: null,

    // results
    result: null,             // normalized result being shown
  };

  function saveSession() {
    try {
      localStorage.setItem('br_token', state.token || '');
      localStorage.setItem('br_user', JSON.stringify(state.user || null));
      localStorage.setItem('br_theme', state.theme);
      localStorage.setItem('br_board', state.board);
    } catch { /* storage blocked — session won't survive reload */ }
  }
  function loadSession() {
    try {
      const t = localStorage.getItem('br_token');
      const u = localStorage.getItem('br_user');
      const th = localStorage.getItem('br_theme');
      const b = localStorage.getItem('br_board');
      if (t) state.token = t;
      if (u) state.user = JSON.parse(u);
      if (th === 'light' || th === 'dark') state.theme = th;
      if (b === 'CBSE' || b === 'ICSE') { state.board = b; state.landingBoard = b; }
    } catch { /* ignore */ }
  }
  function clearSession() {
    state.token = null; state.user = null;
    state.diagBySubject = {}; state.result = null; state.recentAttempts = [];
    try { localStorage.removeItem('br_token'); localStorage.removeItem('br_user'); } catch { /* ignore */ }
  }

  // One place handles an expired session for every authenticated call.
  function handleSessionExpired() {
    clearSession();
    clearInterval(state.timerHandle);
    $('#loginForm').reset(); $('#createForm').reset();
    showScreen('login');
    toast('Your session has expired. Please log in again.', 4000);
  }

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
      if (res.status === 401 && authenticated) {
        err.sessionExpired = true;
        handleSessionExpired();
      }
      throw err;
    }
    return json;
  }

  function toast(msg, ms) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.classList.remove('show'); }, ms || 3600);
  }

  async function withBusy(btn, fn) {
    if (!btn || btn.classList.contains('is-busy')) return;
    btn.classList.add('is-busy'); btn.setAttribute('aria-busy', 'true');
    try { return await fn(); } finally { btn.classList.remove('is-busy'); btn.removeAttribute('aria-busy'); }
  }

  // ---------------------------------------------------------------------
  // SCREENS + HISTORY
  // ---------------------------------------------------------------------
  const SHELL_SCREENS = new Set(['dash', 'practice', 'results', 'improve']);
  const NAV_FOR = { dash: 'dash', practice: 'practice', improve: 'practice', results: 'results' };
  let historyInitialized = false;
  let currentScreen = null;

  function showScreen(name, opts) {
    opts = opts || {};
    currentScreen = name;
    $all('.screen').forEach((s) => { s.hidden = s.dataset.screen !== name; });
    $('#shell').hidden = !SHELL_SCREENS.has(name);
    $all('.nav-link').forEach((b) => {
      if (b.dataset.nav === NAV_FOR[name]) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    closeMenu();
    window.scrollTo(0, 0);
    if (SHELL_SCREENS.has(name) && opts.focus !== false) $('#main').focus({ preventScroll: true });
    if (opts.fromPopState) return;
    if (!historyInitialized) {
      historyInitialized = true;
      history.replaceState({ screen: name }, '', '');
      return;
    }
    if (!history.state || history.state.screen !== name) history.pushState({ screen: name }, '', '');
  }

  // Back/Forward: never drop a student out of a running test by accident.
  window.addEventListener('popstate', (e) => {
    if (currentScreen === 'test') {
      showScreen('test', { fromPopState: true });
      history.pushState({ screen: 'test' }, '', '');
      return;
    }
    if (!state.token) { showScreen('login', { fromPopState: true }); return; }
    const target = e.state && SHELL_SCREENS.has(e.state.screen) ? e.state.screen : 'dash';
    if (target === 'improve' && !(state.result && state.result.improvementComparison)) { showScreen('dash', { fromPopState: true }); return; }
    if (target === 'results') { openResultsScreen({ fromPopState: true }); return; }
    showScreen(target, { fromPopState: true });
  });

  $all('.nav-link').forEach((b) => b.addEventListener('click', () => {
    const t = b.dataset.nav;
    if (t === 'results') openResultsScreen();
    else showScreen(t);
  }));

  // ---------------------------------------------------------------------
  // THEME
  // ---------------------------------------------------------------------
  const SUN = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const MOON = '<svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  function applyTheme() {
    $('#app').setAttribute('data-theme', state.theme);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', state.theme === 'dark' ? '#08080D' : '#F6F6FA');
    $all('.theme-btn').forEach((b) => {
      b.innerHTML = state.theme === 'dark' ? SUN : MOON;
      b.setAttribute('aria-label', state.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }
  function toggleTheme() { state.theme = state.theme === 'dark' ? 'light' : 'dark'; applyTheme(); saveSession(); }
  $('#themeBtn').addEventListener('click', toggleTheme);
  $('#themeBtn2').addEventListener('click', toggleTheme);

  // ---------------------------------------------------------------------
  // READINESS CORE — renders a real value, a real comparison, or an honest empty state
  // ---------------------------------------------------------------------
  function setCore(coreEl, value, opts) {
    opts = opts || {};
    const numEl = coreEl.querySelector('.core-num');
    const arc = coreEl.querySelector('.arc-fill');
    const v = value == null ? null : Math.max(0, Math.min(100, Math.round(value)));
    coreEl.classList.toggle('core-empty', v == null);
    coreEl.style.setProperty('--p', String((v ?? 0) / 100));
    if (arc) arc.setAttribute('stroke-dasharray', `${v ?? 0} 100`);
    if (v == null) { numEl.textContent = opts.placeholder || '—'; numEl.dataset.lastVal = '0'; return; }
    if (opts.from != null) {
      numEl.innerHTML = `${Math.round(opts.from)}<span class="arrow" aria-hidden="true">→</span>${v}`;
      numEl.setAttribute('aria-label', `${Math.round(opts.from)} to ${v}`);
      return;
    }
    numEl.removeAttribute('aria-label');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { numEl.textContent = String(v); numEl.dataset.lastVal = String(v); return; }
    const from = Number(numEl.dataset.lastVal) || 0;
    const start = performance.now();
    const dur = 900;
    (function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      numEl.textContent = String(Math.round(from + (v - from) * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick); else numEl.dataset.lastVal = String(v);
    })(start);
  }
  function setBar(el, value) {
    requestAnimationFrame(() => requestAnimationFrame(() => { el.style.width = `${Math.max(0, Math.min(100, value || 0))}%`; }));
  }

  // ---------------------------------------------------------------------
  // LANDING / AUTH
  // ---------------------------------------------------------------------
  let contentSummary = null;
  async function loadLandingStats() {
    try { contentSummary = await api('GET', '/api/content/summary'); renderLandingStats(); } catch { /* decorative */ }
  }
  function renderLandingStats() {
    if (!contentSummary) return;
    const row = contentSummary.byBoard.find((r) => r.board === state.landingBoard);
    $('#statQuestions').textContent = row ? row.questionCount.toLocaleString('en-IN') : '0';
    $('#statChapters').textContent = row ? row.chapterCount : '0';
    $('#statSubjects').textContent = row ? row.subjectCount : '0';
  }
  $('#landingBoardChips').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-board]'); if (!btn) return;
    state.landingBoard = btn.dataset.board;
    $all('#landingBoardChips .seg').forEach((b) => setPressed(b, b === btn, 'active'));
    // keep the signup board pick consistent with the landing choice
    state.createBoardPick = state.landingBoard;
    $all('#createBoardPick .pick-card').forEach((b) => setPressed(b, b.dataset.board === state.createBoardPick, 'sel'));
    renderLandingStats();
  });

  function selectAuthTab(which) {
    const login = which === 'login';
    $('#tabLoginBtn').classList.toggle('on', login); $('#tabLoginBtn').setAttribute('aria-selected', String(login));
    $('#tabCreateBtn').classList.toggle('on', !login); $('#tabCreateBtn').setAttribute('aria-selected', String(!login));
    $('#loginForm').hidden = !login; $('#createForm').hidden = login;
  }
  $('#tabLoginBtn').addEventListener('click', () => selectAuthTab('login'));
  $('#tabCreateBtn').addEventListener('click', () => selectAuthTab('create'));
  $('#createBoardPick').addEventListener('click', (e) => {
    const btn = e.target.closest('.pick-card'); if (!btn) return;
    state.createBoardPick = btn.dataset.board;
    $all('#createBoardPick .pick-card').forEach((b) => setPressed(b, b === btn, 'sel'));
  });

  function showFormError(el, msg, field) {
    el.textContent = msg; el.hidden = false;
    $all('input', el.closest('form')).forEach((i) => i.removeAttribute('aria-invalid'));
    if (field) { field.setAttribute('aria-invalid', 'true'); field.focus(); }
  }
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  $('#loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorEl = $('#loginError'); errorEl.hidden = true;
    const email = $('#loginEmail').value.trim(); const password = $('#loginPassword').value;
    if (!validEmail(email)) return showFormError(errorEl, 'Enter a valid email address.', $('#loginEmail'));
    if (!password) return showFormError(errorEl, 'Enter your password.', $('#loginPassword'));
    withBusy($('#loginSubmit'), async () => {
      try {
        const resp = await api('POST', '/api/auth/login', { email, password });
        state.token = resp.token; state.user = resp.user; state.board = state.landingBoard; saveSession();
        await enterApp();
      } catch (err) { showFormError(errorEl, err.message); }
    });
  });

  $('#createForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const errorEl = $('#createError'); errorEl.hidden = true;
    const name = $('#createName').value.trim(); const email = $('#createEmail').value.trim(); const password = $('#createPassword').value;
    if (!name) return showFormError(errorEl, 'Enter your name.', $('#createName'));
    if (!validEmail(email)) return showFormError(errorEl, 'Enter a valid email address.', $('#createEmail'));
    if (password.length < 6) return showFormError(errorEl, 'Use at least 6 characters for your password.', $('#createPassword'));
    withBusy($('#createSubmit'), async () => {
      try {
        const resp = await api('POST', '/api/auth/register', { name, email, password, role: 'student' });
        state.token = resp.token; state.user = resp.user; state.board = state.createBoardPick; saveSession();
        await enterApp();
      } catch (err) { showFormError(errorEl, err.message); }
    });
  });

  $('#tryDemoBtn').addEventListener('click', () => withBusy($('#tryDemoBtn'), async () => {
    const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    try {
      const resp = await api('POST', '/api/auth/register', {
        name: 'Demo Student', email: `demo-${stamp}@boardready.local`, password: `demo-${stamp}-pw`, role: 'student',
      });
      state.token = resp.token; state.user = resp.user; state.board = state.landingBoard; saveSession();
      toast('Demo account created — a real, empty student account.');
      await enterApp();
    } catch (err) { toast('Could not create a demo account: ' + err.message); }
  }));

  // account menu
  function closeMenu() { $('#accountMenu').hidden = true; $('#avatarBtn').setAttribute('aria-expanded', 'false'); }
  $('#avatarBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    const open = $('#accountMenu').hidden;
    $('#accountMenu').hidden = !open; $('#avatarBtn').setAttribute('aria-expanded', String(open));
    if (open) $('#logoutBtn').focus();
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.menu-wrap')) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !$('#accountMenu').hidden) { closeMenu(); $('#avatarBtn').focus(); } });
  $('#logoutBtn').addEventListener('click', () => {
    clearSession();
    $('#loginForm').reset(); $('#createForm').reset();
    showScreen('login');
  });

  // ---------------------------------------------------------------------
  // ENTER APP / DASHBOARD DATA
  // ---------------------------------------------------------------------
  async function enterApp() {
    const name = (state.user.name || '').trim();
    const initials = name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    $('#avatarInitials').textContent = initials || '?';
    $('#menuName').textContent = name || 'Student';
    $('#menuEmail').textContent = state.user.email || '';
    syncBoardToggles();
    await refreshDashboard();
    if (!state.token) return;
    showScreen('dash');
  }

  function syncBoardToggles() {
    $all('#dashBoardChips .seg').forEach((b) => setPressed(b, b.dataset.board === state.board, 'active'));
    $('#dashEyebrow').textContent = `Class 10 · ${state.board}`;
  }

  $('#dashBoardChips').addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-board]'); if (!btn || btn.dataset.board === state.board) return;
    state.board = btn.dataset.board; saveSession();
    syncBoardToggles();
    state.subjectId = null;
    await refreshDashboard();
  });

  function chapterInfo(subjectId, chapterId) {
    return (state.chaptersBySubject[subjectId] || []).find((c) => c.id === chapterId) || null;
  }
  // How many questions a practice set will really contain (null if unknown).
  function setSizeFor(subjectId, chapterId, want) {
    const ch = chapterInfo(subjectId, chapterId);
    return ch && typeof ch.gradableCount === 'number' ? Math.min(want, ch.gradableCount) : null;
  }

  function liveCount(subjectId) {
    const chs = state.chaptersBySubject[subjectId];
    return chs ? chs.reduce((a, c) => a + (c.gradableCount || 0), 0) : null;
  }

  function boardSubjects() { return state.subjects.filter((s) => s.board === state.board); }
  function subjectById(id) { return state.subjects.find((s) => s.id === id) || null; }

  async function refreshDashboard() {
    $('#missionCard').hidden = true; $('#missionSkeleton').hidden = false;
    try {
      if (!state.subjects.length) state.subjects = (await api('GET', '/api/subjects')).subjects;
    } catch (e) { if (!e.sessionExpired) toast('Could not load subjects: ' + e.message); return; }

    const subs = boardSubjects();
    if (!subs.some((s) => s.id === state.subjectId)) state.subjectId = subs.length ? subs[0].id : null;

    await Promise.all([
      loadReadiness(),
      loadSummary(),
      loadRecentAttempts(),
      Promise.all(subs.map((s) => loadSubjectData(s.id))),
    ]);
    if (!state.token) return;
    // Prefer a subject that actually has live questions for the Practice screen.
    if (liveCount(state.subjectId) === 0) {
      const withContent = subs.find((s) => liveCount(s.id) > 0);
      if (withContent) state.subjectId = withContent.id;
    }
    state.chapters = state.chaptersBySubject[state.subjectId] || [];
    renderMission();
    renderGainRows();
    renderPracticeScreen();
    renderContinue();
    loadImprovement();
  }

  async function loadSubjectData(subjectId) {
    const [chapters, diag] = await Promise.all([
      api('GET', '/api/chapters?subject_id=' + subjectId).then((r) => r.chapters).catch((e) => { if (!e.sessionExpired) toast(e.message); return []; }),
      api('GET', '/api/diagnostics/me/subjects/' + subjectId).catch(() => null),
    ]);
    state.chaptersBySubject[subjectId] = chapters;
    state.diagBySubject[subjectId] = diag;
  }

  async function loadReadiness() {
    try { state.readiness = await api('GET', '/api/diagnostics/me/readiness'); } catch (e) { if (!e.sessionExpired) toast('Could not load readiness: ' + e.message); return; }
    const r = state.readiness;
    const core = $('#dashCore');
    if (!r.hasAnyData || !r.examReadiness) {
      setCore(core, null);
      $('#dashCoreLabel').textContent = 'Not yet calculated';
      const n = (r.evidence && r.evidence.attemptedCount) || 0;
      $('#readinessHeadline').textContent = n > 0 ? 'Almost there' : 'Readiness starts with your first test';
      $('#readinessNote').textContent = (r.evidence && r.evidence.reason) || 'Answer at least 3 questions to calculate it.';
      $('#readinessMastery').hidden = true;
      return;
    }
    setCore(core, r.examReadiness.score);
    $('#dashCoreLabel').textContent = 'out of 100';
    $('#readinessHeadline').textContent = `${r.examReadiness.label} · all subjects`;
    $('#readinessNote').textContent = r.evidence.reason;
    const m = $('#readinessMastery');
    m.hidden = r.knowledgeMasteryPct == null;
    if (r.knowledgeMasteryPct != null) m.textContent = `Knowledge mastery ${r.knowledgeMasteryPct}% · ${r.evidence.level} confidence`;
  }

  async function loadSummary() {
    try { state.summary = await api('GET', '/api/diagnostics/me/summary'); } catch (e) { if (!e.sessionExpired) toast('Could not load summary: ' + e.message); }
  }

  async function loadRecentAttempts() {
    try { state.recentAttempts = (await api('GET', '/api/attempts/me?limit=20')).attempts; } catch { state.recentAttempts = []; }
  }

  // ---------------------------------------------------------------------
  // DASHBOARD — TODAY'S MISSION
  // Picks one action from real data, in this order:
  //  1. weakest attempted chapter on this board (paid diagnosis)
  //  2. the chapter last practised on this board
  //  3. the first chapter of the first subject (no attempts yet)
  // ---------------------------------------------------------------------
  const STATUS_RANK = { needs_work: 0, developing: 1, insufficient_evidence: 2, strong: 3 };

  function rankedTopics() {
    const out = [];
    boardSubjects().forEach((s) => {
      const d = state.diagBySubject[s.id];
      if (!d || !d.unlocked) return;
      d.chapters.forEach((c) => {
        if (!c.summary.attempted) return;
        out.push({ subject: s, chapterId: c.chapterId, chapterName: c.chapterName, summary: c.summary, status: c.status });
      });
    });
    out.sort((a, b) => (STATUS_RANK[a.status] - STATUS_RANK[b.status])
      || ((a.summary.accuracyPct ?? 101) - (b.summary.accuracyPct ?? 101))
      || (b.summary.attempted - a.summary.attempted));
    return out;
  }

  function renderMission() {
    $('#missionSkeleton').hidden = true;
    const card = $('#missionCard');
    const subs = boardSubjects();
    if (!subs.length) { card.hidden = true; return; }

    const COUNT = 10;
    let pick = null;
    const topics = rankedTopics().filter((t) => t.status !== 'strong');
    if (topics.length) {
      const t = topics[0];
      const acc = t.summary.accuracyPct;
      pick = {
        title: 'Continue Practice', subjectId: t.subject.id, subjectName: t.subject.name, chapterId: t.chapterId, chapterName: t.chapterName,
        why: t.status === 'insufficient_evidence'
          ? `Only ${plural(t.summary.attempted, 'question')} answered here so far — a few more gives a reliable reading.`
          : `Your accuracy here is ${acc}% across ${plural(t.summary.attempted, 'question')} — your biggest opportunity right now.`,
      };
    } else {
      const last = state.recentAttempts.find((a) => a.submittedAt && a.board === state.board && a.chapterId);
      if (last) {
        pick = { title: 'Continue Practice', subjectId: last.subjectId, subjectName: last.subjectName, chapterId: last.chapterId, chapterName: last.chapterName,
          why: last.maxScore ? `Last time: ${last.score}/${last.maxScore}. Another set firms this chapter up.` : null };
      } else {
        for (const s of subs) {
          const ch = (state.chaptersBySubject[s.id] || []).find((c) => c.gradableCount > 0);
          if (ch) {
            pick = { title: 'Start your first test', subjectId: s.id, subjectName: s.name, chapterId: ch.id, chapterName: ch.name,
              why: 'Your Readiness score appears once you have answered 3 questions.' };
            break;
          }
        }
      }
    }
    if (!pick) { card.hidden = true; return; }

    card.hidden = false;
    $('#missionTitle').textContent = pick.title;
    $('#missionPath').innerHTML = `${escapeHtml(pick.subjectName)}<span class="crumb" aria-hidden="true">›</span><span class="sr-only">, </span>${escapeHtml(pick.chapterName)}`;
    const n = setSizeFor(pick.subjectId, pick.chapterId, COUNT);
    $('#missionMeta').innerHTML = n
      ? `<span>${plural(n, 'question')}</span><span>${durationMinutesFor(n)} min limit</span><span>Instant feedback</span>`
      : `<span>Up to ${COUNT} questions</span><span>Instant feedback</span>`;
    $('#missionWhy').hidden = !pick.why;
    $('#missionWhy').textContent = pick.why || '';
    $('#missionBtnText').textContent = pick.title === 'Start your first test' ? 'Start' : 'Continue';
    $('#missionBtn').onclick = () => withBusy($('#missionBtn'), () => startTestFlow({
      subjectId: pick.subjectId, chapterId: pick.chapterId, chapterName: pick.chapterName, subConcept: null, count: COUNT, kind: 'practice',
    }));
  }

  // ---------------------------------------------------------------------
  // DASHBOARD — WHERE YOU CAN GAIN MARKS
  // ---------------------------------------------------------------------
  function subjectIcon(name) {
    const n = (name || '').toLowerCase();
    if (n.includes('math')) return { cls: '', glyph: 'Σ' };
    if (n.includes('chem')) return { cls: 'ic-chem', glyph: 'Ch' };
    if (n.includes('phys')) return { cls: 'ic-phy', glyph: 'Ph' };
    if (n.includes('bio')) return { cls: 'ic-geo', glyph: 'Bi' };
    if (n.includes('hist') || n.includes('civic')) return { cls: 'ic-hist', glyph: 'Hi' };
    if (n.includes('geo')) return { cls: 'ic-geo', glyph: 'Ge' };
    return { cls: '', glyph: (name || '?').slice(0, 2) };
  }
  const STATUS_PILL = {
    needs_work: ['pill-bad', 'High priority'],
    developing: ['pill-warn', 'Needs practice'],
    insufficient_evidence: ['pill-quiet', 'Too few answers'],
    strong: ['pill-good', 'Strong'],
  };
  function barClass(status) { return status === 'needs_work' ? 'bar-bad' : status === 'developing' ? 'bar-warn' : status === 'strong' ? 'bar-good' : ''; }

  function renderGainRows() {
    const list = $('#gainList');
    const lockCard = $('#lockedCard');
    const subs = boardSubjects();
    const anyLocked = subs.some((s) => state.diagBySubject[s.id] && !state.diagBySubject[s.id].unlocked);
    const topics = rankedTopics();
    list.innerHTML = '';

    if (topics.length) {
      $('#gainSub').textContent = 'Ranked from your own answers — weakest first. Rows with too few answers are marked, not scored.';
      topics.slice(0, 6).forEach((t) => list.appendChild(topicRow({
        subjectName: t.subject.name, chapterName: t.chapterName, attempted: t.summary.attempted,
        accuracy: t.summary.accuracyPct, status: t.status,
        onPractice: (btn) => withBusy(btn, () => startTestFlow({ subjectId: t.subject.id, chapterId: t.chapterId, chapterName: t.chapterName, subConcept: null, count: 10, kind: 'practice' })),
      })));
    } else if (anyLocked && state.summary && state.summary.bySubject.some((b) => subjectById(b.subjectId) && subjectById(b.subjectId).board === state.board)) {
      // Locked report: show the free, subject-level accuracy honestly.
      $('#gainSub').textContent = 'Subject-level accuracy from your answers. Unlock the report to rank individual chapters.';
      state.summary.bySubject.filter((b) => { const s = subjectById(b.subjectId); return s && s.board === state.board; }).forEach((b) => {
        list.appendChild(topicRow({
          subjectName: b.name, chapterName: 'All chapters', attempted: b.summary.attempted, accuracy: b.summary.accuracyPct, status: b.status,
          onPractice: () => { state.subjectId = b.subjectId; renderPracticeScreen(); showScreen('practice'); }, practiceLabel: 'Choose chapter',
        }));
      });
    } else {
      $('#gainSub').textContent = 'Ranked from your own test performance.';
      list.innerHTML = `<div class="row-empty"><div><b>No topic data yet</b>Finish one practice test and your weakest topics will appear here, ranked by where you can gain the most.</div>
        <button class="btn btn-ghost btn-sm" type="button" id="gainEmptyBtn">Browse chapters</button></div>`;
      $('#gainEmptyBtn').addEventListener('click', () => showScreen('practice'));
    }

    lockCard.hidden = !anyLocked;
    if (anyLocked) {
      const d = subs.map((s) => state.diagBySubject[s.id]).find((x) => x && !x.unlocked);
      $('#lockedMsg').textContent = (d && d.upsell && d.upsell.message) || 'Chapter-by-chapter diagnosis is part of the Board Ready Report.';
    }
  }

  function topicRow({ subjectName, chapterName, attempted, accuracy, status, onPractice, practiceLabel }) {
    const row = document.createElement('div');
    row.className = 'row';
    const ic = subjectIcon(subjectName);
    const [pillCls, pillText] = STATUS_PILL[status] || ['pill-quiet', '—'];
    const accHtml = accuracy == null || status === 'insufficient_evidence'
      ? `<div class="bar"><i></i></div><span class="na">${accuracy == null ? '—' : accuracy + '%'}</span>`
      : `<div class="bar ${barClass(status)}"><i></i></div><b>${accuracy}%</b>`;
    row.innerHTML = `<span class="row-ic ${ic.cls}" aria-hidden="true">${escapeHtml(ic.glyph)}</span>
      <span class="row-sub">${escapeHtml(subjectName)}</span>
      <span class="row-ch">${escapeHtml(chapterName)}<small>${plural(attempted || 0, 'question')} answered</small></span>
      <span class="row-acc" aria-label="Accuracy ${accuracy == null ? 'not available' : accuracy + ' percent'}">${accHtml}</span>
      <span class="pill ${pillCls}">${pillText}</span>
      <button class="btn btn-ghost btn-sm" type="button">${escapeHtml(practiceLabel || 'Practice')} <span aria-hidden="true">→</span></button>`;
    if (accuracy != null && status !== 'insufficient_evidence') setBar(row.querySelector('.bar > i'), accuracy);
    const btn = row.querySelector('button');
    btn.setAttribute('aria-label', `${practiceLabel || 'Practice'} ${subjectName} — ${chapterName}`);
    btn.addEventListener('click', () => onPractice(btn));
    return row;
  }

  $('#unlockBtn').addEventListener('click', () => withBusy($('#unlockBtn'), async () => {
    try {
      await api('POST', '/api/subscriptions/activate', { plan: 'all-subject' });
      toast('Report unlocked (demo subscription — no payment taken).');
      state.diagBySubject = {};
      await refreshDashboard();
    } catch (e) { if (!e.sessionExpired) toast('Could not unlock: ' + e.message); }
  }));

  async function loadImprovement() {
    const card = $('#improvementCard');
    let imp = null;
    try { imp = await api('GET', '/api/diagnostics/me/improvement'); } catch { /* non-fatal */ }
    if (!imp || !imp.unlocked || !imp.topics || !imp.topics.length) { card.hidden = true; return; }
    const boardChapterIds = new Set(boardSubjects().flatMap((s) => (state.chaptersBySubject[s.id] || []).map((c) => c.id)));
    const topics = imp.topics.filter((t) => boardChapterIds.has(t.chapterId));
    if (!topics.length) { card.hidden = true; return; }
    card.hidden = false;
    const list = $('#improvementList');
    list.innerHTML = '';
    topics.forEach((t) => {
      const v = t.vsOriginal;
      const cls = v.trend === 'improving' ? 'trend-up' : v.trend === 'declining' ? 'trend-down' : 'trend-flat';
      const row = document.createElement('div');
      row.className = 'hist-row';
      row.innerHTML = `<span class="h-name">${escapeHtml(t.subConcept || t.chapterName)}${t.subConcept ? `<small>${escapeHtml(t.chapterName)}</small>` : ''}</span>
        <span class="pill pill-quiet">${v.originalPct ?? '—'}% → ${v.latestPct ?? '—'}%</span>
        <span class="h-score ${cls}">${v.delta == null ? '—' : (v.delta > 0 ? '+' : '') + v.delta + ' pts'}</span>
        <span class="hide-sm" style="color:var(--ink-3);font-size:13px">${escapeHtml(v.reason)}</span>`;
      list.appendChild(row);
    });
  }

  // "Continue where you left off" — an unfinished attempt on this board.
  function renderContinue() {
    const strip = $('#continueStrip');
    const unfinished = state.recentAttempts.find((a) => !a.submittedAt && a.board === state.board);
    if (!unfinished) { strip.hidden = true; return; }
    strip.hidden = false;
    $('#continueText').textContent = `Unfinished test: ${unfinished.subjectName} · ${unfinished.chapterName || (unfinished.improvesAttemptId ? 'Targeted retest' : 'Board Simulation')}`;
    $('#continueLink').textContent = 'Resume →';
    $('#continueLink').onclick = (e) => { e.preventDefault(); resumeAttempt(unfinished); };
  }

  // ---------------------------------------------------------------------
  // PRACTICE SCREEN
  // ---------------------------------------------------------------------
  function renderPracticeScreen() {
    const subs = boardSubjects();
    const picker = $('#subjectPicker');
    picker.innerHTML = '';
    $('#practiceEyebrow').textContent = `Practice · ${state.board}`;
    if (!subs.length) {
      picker.innerHTML = '<span class="block-sub">No subjects published for this board yet.</span>';
      $('#chaptersSubjectName').textContent = '—';
      $('#chaptersList').innerHTML = '';
      $('#fullTestBtn').disabled = true;
      return;
    }
    $('#fullTestBtn').disabled = false;
    subs.forEach((s) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'p-chip' + (s.id === state.subjectId ? ' active' : '');
      btn.setAttribute('aria-pressed', s.id === state.subjectId ? 'true' : 'false');
      const n = liveCount(s.id);
      btn.textContent = n === 0 ? `${s.name} · coming soon` : s.name;
      btn.addEventListener('click', () => { state.subjectId = s.id; state.chapters = state.chaptersBySubject[s.id] || []; renderPracticeScreen(); });
      picker.appendChild(btn);
    });
    const subj = subjectById(state.subjectId);
    const live = liveCount(state.subjectId);
    $('#fullTestBtn').disabled = live === 0;
    const simN = live == null ? 20 : Math.min(20, live);
    $('#simMeta').textContent = live === 0 ? 'Not available for this subject yet'
      : `${plural(simN, 'question')} · ${durationMinutesFor(simN)} min limit · results after submit`;
    $('#chaptersSubjectName').textContent = subj ? subj.name : '—';
    $('#challengeSub').textContent = live === 0
      ? `${subj ? subj.name : 'This subject'} has no live questions yet, so a simulation isn't available. Pick another subject.`
      : subj
      ? `Questions from across ${subj.name} (${state.board}). No feedback and no answers until you submit — a clean, independent score.`
      : 'Choose a subject first.';
    renderChapters();
  }

  function renderChapters() {
    const el = $('#chaptersList');
    const chapters = state.chaptersBySubject[state.subjectId] || [];
    state.chapters = chapters;
    el.innerHTML = '';
    if (!chapters.length) { el.innerHTML = '<div class="row-empty"><div><b>No chapters yet</b>No chapters are published for this subject.</div></div>'; return; }
    const diag = state.diagBySubject[state.subjectId];
    const byId = new Map();
    if (diag && diag.unlocked) diag.chapters.forEach((c) => byId.set(c.chapterId, c));
    chapters.forEach((ch) => {
      const row = document.createElement('div');
      row.className = 'chapter-row';
      const d = byId.get(ch.id);
      let status = 'Not attempted yet';
      let barHtml = '<span></span>';
      if (!diag || !diag.unlocked) status = 'Progress shown with the report';
      else if (d && d.summary.attempted) {
        status = `${plural(d.summary.attempted, 'question')} answered`;
        barHtml = d.status === 'insufficient_evidence'
          ? '<span class="pill pill-quiet">Too few answers</span>'
          : `<span class="row-acc"><span class="bar ${barClass(d.status)}"><i style="width:${d.summary.accuracyPct || 0}%"></i></span><b>${d.summary.accuracyPct}%</b></span>`;
      }
      const avail = typeof ch.gradableCount === 'number' ? ch.gradableCount : null;
      if (avail === 0) status = 'No live questions yet';
      else if (avail != null) status = `${plural(avail, 'live question')} · ${status}`;
      row.innerHTML = `<div class="info"><b>${escapeHtml(ch.name)}</b><span>${escapeHtml(status)}</span></div>${barHtml}
        <button class="btn btn-ghost btn-sm" type="button" data-act="practice"${avail === 0 ? ' disabled' : ''}>Practice <span aria-hidden="true">→</span></button>`;
      const btn = row.querySelector('[data-act="practice"]');
      btn.setAttribute('aria-label', `Practice ${ch.name}`);
      btn.addEventListener('click', () => withBusy(btn, () => startTestFlow({ subjectId: state.subjectId, chapterId: ch.id, chapterName: ch.name, subConcept: null, count: 10, kind: 'practice' })));
      el.appendChild(row);
    });
  }

  $('#fullTestBtn').addEventListener('click', () => {
    if (!state.subjectId) { toast('Pick a subject first.'); return; }
    withBusy($('#fullTestBtn'), () => startTestFlow({ subjectId: state.subjectId, chapterId: null, subConcept: null, count: 20, kind: 'full' }));
  });

  // ---------------------------------------------------------------------
  // START / RESUME A TEST
  // ---------------------------------------------------------------------
  async function capturePreReadiness() {
    try {
      const r0 = await api('GET', '/api/diagnostics/me/readiness');
      state.preTestReadiness = r0.examReadiness ? r0.examReadiness.score : null;
    } catch { state.preTestReadiness = null; }
  }

  async function startTestFlow({ subjectId, chapterId, chapterName, subConcept, count, kind }) {
    try {
      await capturePreReadiness();
      const genPath = kind === 'full' ? '/api/tests/generate' : '/api/practice/generate';
      const genBody = kind === 'full' ? { subjectId, count } : { subjectId, chapterId, subConcept, count };
      const test = await api('POST', genPath, genBody);
      const subj = subjectById(subjectId);
      const chName = chapterName || (chapterId ? ((state.chaptersBySubject[subjectId] || []).find((c) => c.id === chapterId) || {}).name : null);
      await beginAttemptForTest(test, {
        subjectId, chapterId: chapterId || null, subConcept: subConcept || null, kind,
        subjectName: subj ? subj.name : '', chapterName: chName || null, board: subj ? subj.board : state.board,
      });
    } catch (e) {
      if (!e.sessionExpired) toast('Could not start the test: ' + e.message, 4200);
    }
  }

  async function beginAttemptForTest(test, meta) {
    state.test = {
      id: test.id, subjectId: meta.subjectId, chapterId: meta.chapterId || null, subConcept: meta.subConcept || null, kind: meta.kind,
      subjectName: meta.subjectName || '', chapterName: meta.chapterName || null, board: meta.board || state.board,
      feedbackMode: test.feedbackMode || 'immediate', improvesAttemptId: test.improvesAttemptId || null,
      targeted: test.targetedSubConcepts || null,
    };
    const attempt = await api('POST', '/api/attempts', { test_id: test.id });
    state.attempt = attempt;
    const q = await api('GET', `/api/attempts/${attempt.id}/questions`);
    state.test.feedbackMode = q.feedbackMode || state.test.feedbackMode;
    beginTestSession(q.steps, q.draftAnswers, q.checkedAnswers);
    state.deadline = Date.now() + attempt.durationSeconds * 1000;
    startTimer();
  }

  // Improve My Score: a genuinely new targeted test built server-side from
  // this student's actual wrong answers on sourceAttemptId.
  async function startImprovementTest(sourceAttemptId, btn) {
    return withBusy(btn, async () => {
      try {
        await capturePreReadiness();
        const test = await api('POST', '/api/tests/improve', { sourceAttemptId });
        const subj = subjectById(test.subjectId);
        await beginAttemptForTest(test, {
          subjectId: test.subjectId, chapterId: null, subConcept: null, kind: 'improvement',
          subjectName: subj ? subj.name : '', chapterName: null, board: subj ? subj.board : state.board,
        });
        const f = test.freshness;
        if (f) {
          toast(f.reusedCount
            ? `${f.freshCount} of ${f.deliveredCount} questions are new to you. ${f.reusedCount} repeat earlier ones — the bank has no more unseen questions for these skills.`
            : `All ${f.deliveredCount} questions are new to you.`, 5200);
        }
      } catch (e) {
        if (!e.sessionExpired) toast(e.status === 422 ? 'No eligible questions are left for a targeted set on these topics.' : 'Could not start the targeted set: ' + e.message, 4600);
      }
    });
  }

  async function resumeAttempt(row) {
    try {
      const q = await api('GET', `/api/attempts/${row.id}/questions`);
      state.test = {
        id: row.testId, subjectId: row.subjectId, chapterId: row.chapterId, subConcept: row.subConcept,
        kind: row.improvesAttemptId ? 'improvement' : row.kind, subjectName: row.subjectName, chapterName: row.chapterName, board: row.board,
        feedbackMode: q.feedbackMode || row.feedbackMode || 'immediate', improvesAttemptId: row.improvesAttemptId || null,
      };
      state.attempt = { id: row.id, testId: row.testId, startedAt: row.startedAt, durationSeconds: row.durationSeconds };
      beginTestSession(q.steps, q.draftAnswers, q.checkedAnswers);
      const startedMs = new Date(String(row.startedAt).replace(' ', 'T') + (/[zZ]|[+-]\d\d:?\d\d$/.test(row.startedAt) ? '' : 'Z')).getTime();
      state.deadline = startedMs + row.durationSeconds * 1000;
      startTimer();
    } catch (e) { if (!e.sessionExpired) toast('Could not resume: ' + e.message); }
  }

  function modeName() {
    if (state.test.improvesAttemptId || state.test.kind === 'improvement') return 'Targeted Retest';
    return state.test.feedbackMode === 'deferred' ? 'Board Simulation' : 'Practice Test';
  }

  function beginTestSession(steps, savedAnswers, checkedAnswers) {
    state.steps = steps;
    state.answers = { ...(savedAnswers || {}) };
    state.checked = { ...(checkedAnswers || {}) };
    // Checked (locked) practice answers are not kept in the draft, but the
    // submit body must include them so diagnostics see the same answers
    // the score was computed from.
    Object.entries(state.checked).forEach(([k, v]) => { state.answers[k] = { optionIndex: v.optionIndex }; });
    state.flagged = new Set();
    state.idx = 0;
    state.autoSubmitted = false;
    state.submitting = false;
    $('#submitTestBtn').disabled = false; $('#nextBtn').disabled = false;
    $('#testSubjectName').textContent = state.test.subjectName || 'Test';
    $('#testModeName').textContent = modeName();
    $('#testChapterName').textContent = state.test.chapterName
      || (state.test.improvesAttemptId || state.test.kind === 'improvement' ? 'Your weak topics' : 'Full syllabus');
    $('#testCountLabel').textContent = plural(steps.length, 'question');
    renderModeBadge();
    showScreen('test');
    renderTrack();
    renderQuestion();
    const restored = new Set([...Object.keys(savedAnswers || {}), ...Object.keys(checkedAnswers || {})]).size;
    if (restored) toast(`Restored ${plural(restored, 'saved answer')}.`);
  }

  function renderModeBadge() {
    const badge = $('#modeBadge');
    badge.hidden = false;
    if (state.test.feedbackMode === 'deferred') {
      badge.className = 'mode-badge mode-assessment';
      badge.textContent = 'No feedback until submit';
    } else {
      badge.className = 'mode-badge mode-practice';
      badge.textContent = 'Instant feedback';
    }
  }

  // ---------------------------------------------------------------------
  // AUTOSAVE
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
    try { await api('PATCH', `/api/attempts/${state.attempt.id}/answers`, { answers: batch }); }
    catch (e) { if (!e.sessionExpired) toast('Could not save your answer — check your connection.', 2200); }
  }

  function stepKey(step) { return `${step.questionId}:${step.label || ''}`; }

  // ---------------------------------------------------------------------
  // DIAGRAMS (raster crop via <img>, native SVG inlined so it follows the theme)
  // ---------------------------------------------------------------------
  const svgTextCache = new Map();
  function createDiagramLoader() {
    let seq = 0;
    return async function loadDiagram(url, imgEl, svgHostEl, wrapEl) {
      const mySeq = ++seq;
      const isSvg = typeof url === 'string' && /\.svg(\?|$)/i.test(url);
      imgEl.classList.toggle('is-vector', isSvg);
      if (wrapEl) wrapEl.classList.toggle('is-vector', isSvg);
      if (!url) { imgEl.hidden = false; imgEl.src = ''; svgHostEl.hidden = true; svgHostEl.innerHTML = ''; return; }
      if (!isSvg) { svgHostEl.hidden = true; svgHostEl.innerHTML = ''; imgEl.hidden = false; imgEl.src = url; return; }
      imgEl.hidden = true; imgEl.src = '';
      try {
        let svgText = svgTextCache.get(url);
        if (svgText == null) {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`diagram fetch failed: HTTP ${res.status}`);
          svgText = await res.text();
          svgTextCache.set(url, svgText);
        }
        if (mySeq !== seq) return;
        svgHostEl.innerHTML = svgText;
        svgHostEl.hidden = false;
      } catch (err) {
        if (mySeq !== seq) return;
        console.error('Could not load diagram visual', url, err);
        svgHostEl.hidden = true; svgHostEl.innerHTML = '';
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
    $('#lightboxSvgHost').hidden = true; $('#lightboxSvgHost').innerHTML = '';
    document.removeEventListener('keydown', onDiagramLightboxKeydown);
    const t = diagramLightboxTrigger; diagramLightboxTrigger = null;
    if (t && typeof t.focus === 'function') t.focus();
  }
  function onDiagramLightboxKeydown(e) { if (e.key === 'Escape') closeDiagramLightbox(); }
  $('#lightboxCloseBtn').addEventListener('click', closeDiagramLightbox);
  $('#diagramLightbox').addEventListener('click', (e) => { if (e.target === $('#diagramLightbox')) closeDiagramLightbox(); });

  // ---------------------------------------------------------------------
  // QUESTION NAVIGATOR
  // ---------------------------------------------------------------------
  function isAnswered(step) { return state.answers[stepKey(step)] != null; }
  function counts() {
    const answered = state.steps.filter(isAnswered).length;
    return { answered, unanswered: state.steps.length - answered, flagged: state.flagged.size };
  }

  function renderTrack() {
    const grid = $('#testTrack');
    grid.innerHTML = '';
    state.steps.forEach((step, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      const answered = isAnswered(step);
      const flagged = state.flagged.has(stepKey(step));
      btn.className = 'tdot' + (answered ? ' answered' : '') + (i === state.idx ? ' current' : '') + (flagged ? ' flag' : '');
      btn.textContent = String(i + 1);
      const parts = [`Question ${i + 1}`, answered ? 'answered' : 'not answered'];
      if (flagged) parts.push('flagged for review');
      btn.setAttribute('aria-label', parts.join(', '));
      if (i === state.idx) btn.setAttribute('aria-current', 'true');
      btn.addEventListener('click', () => { goTo(i); closeNavDrawer(); });
      grid.appendChild(btn);
    });
    const c = counts();
    $('#cntAnswered').textContent = c.answered;
    $('#cntUnanswered').textContent = c.unanswered;
    $('#cntFlagged').textContent = c.flagged;
    $('#navToggleBtn').textContent = `Questions · ${c.answered}/${state.steps.length}`;
  }

  function goTo(i) {
    if (i < 0 || i >= state.steps.length) return;
    state.idx = i; renderQuestion(); renderTrack();
  }

  function openNavDrawer() {
    $('#testNav').classList.add('open'); $('#navScrim').hidden = false;
    $('#navToggleBtn').setAttribute('aria-expanded', 'true');
    $('#navCloseBtn').focus();
  }
  function closeNavDrawer() {
    if (!$('#testNav').classList.contains('open')) return;
    $('#testNav').classList.remove('open'); $('#navScrim').hidden = true;
    $('#navToggleBtn').setAttribute('aria-expanded', 'false');
  }
  $('#navToggleBtn').addEventListener('click', openNavDrawer);
  $('#navCloseBtn').addEventListener('click', () => { closeNavDrawer(); $('#navToggleBtn').focus(); });
  $('#navScrim').addEventListener('click', closeNavDrawer);

  // ---------------------------------------------------------------------
  // QUESTION RENDERING
  // ---------------------------------------------------------------------
  function splitAssertionReason(text) {
    const m = /assertion\s*\(a\)\s*:?\s*(.+?)\s*reason\s*\(r\)\s*:?\s*(.+)/is.exec(text || '');
    return m ? { assertion: m[1].trim(), reason: m[2].trim() } : null;
  }
  const ICON_CHECK = '<svg aria-hidden="true" class="p-icon checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';
  const ICON_X = '<svg aria-hidden="true" class="p-icon xmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function renderQuestion() {
    const step = state.steps[state.idx];
    if (!step) return;
    const isAR = step.questionType === 'assertion_reasoning';
    $('#testQCount').textContent = `Question ${state.idx + 1} of ${state.steps.length}`;
    $('#qType').textContent = step.kind === 'case' ? `Case study · part ${String(step.label || '').toUpperCase()}`
      : step.kind === 'open' ? 'Written answer · self-assessed'
      : isAR ? 'Assertion & Reason' : 'MCQ';
    $('#qMarks').textContent = step.kind === 'open' ? 'Not scored' : plural(step.marks, 'mark');
    const diff = $('#qDifficulty');
    diff.hidden = !step.difficulty;
    diff.textContent = step.difficulty || '';

    const ar = isAR ? splitAssertionReason(step.text) : null;
    if (ar) {
      $('#qText').innerHTML = `<div class="ar-block"><span class="ar-label">Assertion (A)</span><p class="ar-stmt">${escapeHtml(ar.assertion)}</p></div>`
        + `<div class="ar-block"><span class="ar-label">Reason (R)</span><p class="ar-stmt">${escapeHtml(ar.reason)}</p></div>`;
    } else {
      $('#qText').textContent = step.text;
    }

    const diagramWrap = $('#qDiagramWrap');
    if (step.diagramUrl) {
      diagramWrap.hidden = false;
      loadMainDiagram(step.diagramUrl, $('#qDiagramImg'), $('#qDiagramSvgHost'), diagramWrap);
      diagramWrap.onclick = () => openDiagramLightbox(step.diagramUrl, diagramWrap);
      diagramWrap.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDiagramLightbox(step.diagramUrl, diagramWrap); }
      };
    } else {
      diagramWrap.hidden = true; diagramWrap.onclick = null; diagramWrap.onkeydown = null;
      $('#qDiagramSvgHost').hidden = true; $('#qDiagramSvgHost').innerHTML = '';
    }

    const optsEl = $('#qOptions');
    optsEl.innerHTML = '';
    const key = stepKey(step);
    const feedback = $('#qFeedback');

    if (step.kind === 'open') {
      const savedText = state.answers[key] ? state.answers[key].text : '';
      optsEl.innerHTML = `<label class="open-answer-label" for="qOpenAnswer">Write your answer. Written answers are not auto-marked — compare with the reference after you submit.</label>
        <textarea id="qOpenAnswer" class="open-answer-input" rows="6" placeholder="Type your working and answer here…"></textarea>`;
      const ta = $('#qOpenAnswer');
      ta.value = savedText || '';
      ta.addEventListener('input', () => {
        if (ta.value.trim()) state.answers[key] = { text: ta.value }; else delete state.answers[key];
        scheduleAutosave(key, { text: ta.value });
        renderTrack();
      });
      feedback.hidden = true; feedback.innerHTML = '';
    } else {
      // Practice (immediate) checks each pick on the server and locks it.
      // Board Simulation (deferred) never calls /check — the server also
      // refuses it — so nothing about correctness is shown until submit.
      const immediate = state.test.feedbackMode !== 'deferred';
      const locked = immediate ? state.checked[key] : null;
      const selected = locked ? locked.optionIndex : (state.answers[key] ? state.answers[key].optionIndex : null);
      (step.options || []).forEach((optText, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        let cls = 'opt'; let icon = ''; let sr = '';
        if (locked) {
          const mine = i === locked.optionIndex; const right = i === locked.correctOptionIndex;
          if (mine && locked.correct) { cls += ' correct-pick'; icon = ICON_CHECK; sr = ' (your answer — correct)'; }
          else if (mine) { cls += ' wrong-pick'; icon = ICON_X; sr = ' (your answer — incorrect)'; }
          else if (right) { cls += ' correct-reveal'; icon = ICON_CHECK; sr = ' (correct answer)'; }
          btn.disabled = true;
        } else if (selected === i) { cls += ' sel'; icon = ICON_CHECK; sr = ' (selected)'; }
        btn.className = cls;
        btn.setAttribute('aria-pressed', selected === i ? 'true' : 'false');
        btn.innerHTML = `<span class="letter" aria-hidden="true">${String.fromCharCode(65 + i)}</span><span>${escapeHtml(optText)}</span>${icon}${sr ? `<span class="sr-only">${escapeHtml(sr)}</span>` : ''}`;
        if (!locked) btn.addEventListener('click', () => (immediate ? checkAnswer(step, key, i) : selectDeferredAnswer(key, i)));
        optsEl.appendChild(btn);
      });
      if (immediate) renderFeedback(step, key); else { feedback.hidden = true; feedback.innerHTML = ''; }
    }

    $('#prevBtn').disabled = state.idx === 0;
    const last = state.idx === state.steps.length - 1;
    $('#nextBtn').innerHTML = last ? 'Review &amp; submit <span aria-hidden="true">→</span>' : 'Next <span aria-hidden="true">→</span>';
    const flagged = state.flagged.has(key);
    setPressed($('#flagBtn'), flagged, 'on');
    $('#flagLabel').textContent = flagged ? 'Flagged for review' : 'Mark for review';
    $('#qLiveRegion').textContent = `Question ${state.idx + 1} of ${state.steps.length}${flagged ? ', flagged for review' : ''}`;
  }

  // Practice feedback — explanation text only ever comes from the server,
  // and only for a step already checked; an honest fallback otherwise.
  function renderFeedback(step, key) {
    const el = $('#qFeedback');
    const locked = state.checked[key];
    if (!locked) { el.hidden = true; el.innerHTML = ''; return; }
    const L = (i) => (i == null ? '—' : String.fromCharCode(65 + i));
    const opts = step.options || [];
    const short = (i) => { const t = opts[i]; return t == null ? '' : (t.length > 18 ? '' : ` (${escapeHtml(t)})`); };
    const why = locked.explanation
      ? `<p class="qf-why">${escapeHtml(locked.explanation)}</p>`
      : '<p class="qf-why missing">No worked explanation is recorded for this question yet.</p>';
    el.hidden = false;
    el.className = 'q-feedback ' + (locked.correct ? 'q-feedback-correct' : 'q-feedback-incorrect');
    el.innerHTML = `<span class="qf-icon" aria-hidden="true">${locked.correct ? '✓' : '✕'}</span>
      <div class="qf-body"><p class="qf-head">${locked.correct ? 'Correct!' : 'Not quite'}</p><p class="qf-why-label">Why</p>${why}</div>
      <div class="qf-answers">
        <div class="qf-ans ${locked.correct ? 'right' : 'wrong'}">Your answer<b>${L(locked.optionIndex)}${short(locked.optionIndex)}</b></div>
        <div class="qf-ans right">Correct answer<b>${L(locked.correctOptionIndex)}${short(locked.correctOptionIndex)}</b></div>
      </div>`;
  }

  async function checkAnswer(step, key, optionIndex) {
    state.answers[key] = { optionIndex };
    $all('#qOptions .opt').forEach((b) => { b.disabled = true; });
    try {
      const r = await api('POST', `/api/attempts/${state.attempt.id}/check`, { key, answer: { optionIndex } });
      state.checked[key] = { optionIndex: r.submittedOptionIndex, correct: r.correct, correctOptionIndex: r.correctOptionIndex, explanation: r.explanation };
      state.answers[key] = { optionIndex: r.submittedOptionIndex };
    } catch (e) {
      if (e.sessionExpired) return;
      scheduleAutosave(key, { optionIndex });
      toast('Could not check that answer — it is saved and will be marked when you submit.', 3000);
    }
    if (currentScreen === 'test') { renderQuestion(); renderTrack(); }
  }

  function selectDeferredAnswer(key, optionIndex) {
    state.answers[key] = { optionIndex };
    scheduleAutosave(key, { optionIndex });
    renderQuestion(); renderTrack();
  }

  $('#prevBtn').addEventListener('click', () => goTo(state.idx - 1));
  $('#nextBtn').addEventListener('click', () => {
    if (state.idx < state.steps.length - 1) goTo(state.idx + 1);
    else openSubmitDialog();
  });
  $('#submitTestBtn').addEventListener('click', () => { closeNavDrawer(); openSubmitDialog(); });
  $('#flagBtn').addEventListener('click', () => {
    const key = stepKey(state.steps[state.idx]);
    if (state.flagged.has(key)) state.flagged.delete(key); else state.flagged.add(key);
    renderQuestion(); renderTrack();
  });

  // Keyboard: ←/→ move, A–D pick (when focus isn't in a text field or dialog).
  document.addEventListener('keydown', (e) => {
    if (currentScreen !== 'test' || e.altKey || e.ctrlKey || e.metaKey) return;
    if (!$('#submitDialog').hidden || !$('#exitDialog').hidden || !$('#diagramLightbox').hidden) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'textarea' || tag === 'input') return;
    if (e.key === 'ArrowRight') { e.preventDefault(); if (state.idx < state.steps.length - 1) goTo(state.idx + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(state.idx - 1); }
    else if (/^[a-dA-D]$/.test(e.key)) {
      const btn = $all('#qOptions .opt')[e.key.toUpperCase().charCodeAt(0) - 65];
      if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
    }
  });

  // ---------------------------------------------------------------------
  // DIALOGS (submit / exit) — simple focus management + Escape
  // ---------------------------------------------------------------------
  let dialogReturnFocus = null;
  function openDialog(el, focusEl) {
    dialogReturnFocus = document.activeElement;
    el.hidden = false;
    (focusEl || el.querySelector('button')).focus();
  }
  function closeDialog(el) {
    el.hidden = true;
    if (dialogReturnFocus && document.contains(dialogReturnFocus)) dialogReturnFocus.focus();
    dialogReturnFocus = null;
  }
  function trapFocus(el, e) {
    if (e.key === 'Escape') { e.preventDefault(); closeDialog(el); return; }
    if (e.key !== 'Tab') return;
    const f = $all('button:not([disabled])', el);
    if (!f.length) return;
    const first = f[0]; const last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  ['#submitDialog', '#exitDialog'].forEach((id) => {
    const el = $(id);
    el.addEventListener('keydown', (e) => trapFocus(el, e));
    el.addEventListener('click', (e) => { if (e.target === el) closeDialog(el); });
  });

  function openSubmitDialog() {
    if (state.submitting) return;
    const c = counts();
    $('#sdAnswered').textContent = c.answered;
    $('#sdUnanswered').textContent = c.unanswered;
    $('#sdFlagged').textContent = c.flagged;
    $('#sdUnanswered').parentElement.classList.toggle('warn', c.unanswered > 0);
    $('#sdFlagged').parentElement.classList.toggle('warn', c.flagged > 0);
    $('#sdBody').textContent = c.unanswered > 0
      ? `${plural(c.unanswered, 'question is', 'questions are')} unanswered and will score zero. You can't change answers after submitting.`
      : 'Every question has an answer. You can\'t change answers after submitting.';
    openDialog($('#submitDialog'), $('#sdCancel'));
  }
  $('#sdCancel').addEventListener('click', () => closeDialog($('#submitDialog')));
  $('#sdConfirm').addEventListener('click', () => { $('#submitDialog').hidden = true; dialogReturnFocus = null; submitAttempt(false); });

  $('#exitTestBtn').addEventListener('click', () => openDialog($('#exitDialog'), $('#exCancel')));
  $('#exCancel').addEventListener('click', () => closeDialog($('#exitDialog')));
  $('#exConfirm').addEventListener('click', async () => {
    $('#exitDialog').hidden = true; dialogReturnFocus = null;
    clearTimeout(autosaveTimer);
    await flushAutosave();
    clearInterval(state.timerHandle);
    await refreshDashboard();
    showScreen('dash');
    toast('Saved. Resume from the dashboard — the timer keeps running.');
  });

  // ---------------------------------------------------------------------
  // TIMER
  // ---------------------------------------------------------------------
  function startTimer() {
    clearInterval(state.timerHandle);
    tickTimer();
    state.timerHandle = setInterval(tickTimer, 1000);
  }
  function tickTimer() {
    const remainingMs = state.deadline - Date.now();
    const timerEl = $('#testTimer');
    const valueEl = $('#testTimerValue');
    if (remainingMs <= 0) {
      valueEl.textContent = '00:00';
      timerEl.classList.add('low');
      if (!state.autoSubmitted && currentScreen === 'test') {
        state.autoSubmitted = true;
        $('#submitDialog').hidden = true; $('#exitDialog').hidden = true;
        submitAttempt(true);
      }
      return;
    }
    const totalSec = Math.ceil(remainingMs / 1000);
    valueEl.textContent = `${String(Math.floor(totalSec / 60)).padStart(2, '0')}:${String(totalSec % 60).padStart(2, '0')}`;
    timerEl.classList.toggle('low', totalSec <= 60);
  }

  // ---------------------------------------------------------------------
  // SUBMIT
  // ---------------------------------------------------------------------
  async function submitAttempt(auto) {
    if (state.submitting) return; // guards double-clicks and timer races; server also 409s a re-submit
    state.submitting = true;
    $('#submitTestBtn').disabled = true; $('#nextBtn').disabled = true; $('#sdConfirm').disabled = true;
    clearInterval(state.timerHandle);
    clearTimeout(autosaveTimer);
    await flushAutosave();
    let resp;
    try {
      resp = await api('POST', `/api/attempts/${state.attempt.id}/submit`, { answers: state.answers });
    } catch (e) {
      state.submitting = false;
      $('#submitTestBtn').disabled = false; $('#nextBtn').disabled = false; $('#sdConfirm').disabled = false;
      if (!e.sessionExpired) toast('Submit failed: ' + e.message, 4000);
      if (!auto && !e.sessionExpired) startTimer();
      return;
    }
    $('#sdConfirm').disabled = false;
    if (auto) toast('Time was up — your test was submitted automatically.', 4200);

    // canonical timing + metadata from the persisted attempt (non-fatal)
    let full = null;
    try { full = await api('GET', `/api/attempts/${state.attempt.id}/result`); } catch { /* fall back to submit response */ }

    let priorBest = null;
    if (state.test.chapterId) {
      try {
        const list = (await api('GET', '/api/attempts/me?limit=50')).attempts;
        const priors = list.filter((a) => a.chapterId === state.test.chapterId && a.submittedAt && a.id !== state.attempt.id && a.maxScore);
        if (priors.length) priorBest = Math.max(...priors.map((a) => pct(a.score, a.maxScore)));
      } catch { /* non-fatal */ }
    }
    let newReadiness = null;
    try { const r1 = await api('GET', '/api/diagnostics/me/readiness'); newReadiness = r1.examReadiness ? r1.examReadiness.score : null; } catch { /* non-fatal */ }

    const result = normalizeResult(full || resp, state.attempt.id, state.test);
    result.ctx = { priorBest, prevReadiness: state.preTestReadiness, newReadiness, fresh: true };
    state.result = result;
    renderResult(result);
    if (result.improvementComparison) { renderImprove(result); showScreen('improve'); }
    else showScreen('results');
    refreshDashboard();
  }

  // ---------------------------------------------------------------------
  // RESULTS
  // ---------------------------------------------------------------------
  function normalizeResult(resp, attemptId, testMeta) {
    const t = resp.test || {};
    const subj = subjectById(t.subjectId ?? (testMeta && testMeta.subjectId));
    return {
      ...resp,
      attemptId: resp.attemptId || attemptId,
      meta: {
        subjectId: t.subjectId ?? (testMeta && testMeta.subjectId),
        subjectName: t.subjectName || (testMeta && testMeta.subjectName) || (subj && subj.name) || '',
        board: t.board || (testMeta && testMeta.board) || (subj && subj.board) || state.board,
        chapterId: t.chapterId ?? (testMeta && testMeta.chapterId) ?? null,
        chapterName: t.chapterName || (testMeta && testMeta.chapterName) || null,
        subConcept: t.subConcept ?? (testMeta && testMeta.subConcept) ?? null,
        feedbackMode: t.feedbackMode || (testMeta && testMeta.feedbackMode) || 'immediate',
        improvesAttemptId: t.improvesAttemptId ?? (testMeta && testMeta.improvesAttemptId) ?? null,
        kind: t.kind || (testMeta && testMeta.kind) || 'practice',
      },
      ctx: {},
    };
  }

  function topicGroups(perQuestion) {
    const map = new Map();
    perQuestion.filter((p) => !p.ungraded).forEach((p) => {
      const name = p.subConcept || p.chapterName || 'General';
      if (!map.has(name)) map.set(name, { name, chapterId: p.chapterId, chapterName: p.chapterName, subConcept: p.subConcept, total: 0, correct: 0, marks: 0, lost: 0, wrongMarks: 0, blankMarks: 0, wrong: 0, blank: 0, missedDiff: {} });
      const g = map.get(name);
      const m = typeof p.marks === 'number' ? p.marks : 1;
      g.total += 1; g.marks += m;
      if (p.correct) g.correct += 1;
      else {
        g.lost += m;
        if (p.answered) { g.wrong += 1; g.wrongMarks += m; } else { g.blank += 1; g.blankMarks += m; }
        if (p.difficulty) g.missedDiff[p.difficulty] = (g.missedDiff[p.difficulty] || 0) + 1;
      }
    });
    return [...map.values()].map((g) => ({ ...g, acc: pct(g.correct, g.total) }));
  }

  function whyText(g) {
    const parts = [];
    if (g.wrong) parts.push(`${plural(g.wrong, 'incorrect answer')}`);
    if (g.blank) parts.push(`${g.blank} unanswered`);
    let s = parts.join(', ');
    const diffs = Object.entries(g.missedDiff).sort((a, b) => b[1] - a[1]);
    if (diffs.length) s += ` — missed ${diffs.map(([d, n]) => `${n} ${d.toLowerCase()}`).join(', ')}`;
    if (g.correct === 0 && g.total >= 2) s += '. No correct answers here yet — revisit the core idea first.';
    else if (g.blank && !g.wrong) s += '. Attempting these is the quickest gain.';
    return s;
  }

  function fmtDuration(sec) {
    if (sec == null) return null;
    const m = Math.floor(sec / 60); const s = sec % 60;
    return m ? `${m} min${s ? ` ${s}s` : ''}` : `${s}s`;
  }

  const ICONS = {
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  };

  function renderResult(r) {
    $('#resultView').hidden = false;
    const m = r.meta;
    const modeLabel = m.improvesAttemptId ? 'Targeted Retest' : m.feedbackMode === 'deferred' ? 'Board Simulation' : 'Practice Test';
    $('#resSubtitle').textContent = `${modeLabel} · ${m.subjectName}${m.chapterName ? ' · ' + m.chapterName : ''} · ${m.board}`;

    const score = r.score ?? 0; const max = r.maxScore ?? 0;
    $('#resScore').textContent = String(score);
    $('#resMax').textContent = String(max);
    setBar($('#resScoreBar'), pct(score, max) || 0);
    $('#resLost').textContent = String(Math.max(0, max - score));

    const graded = r.perQuestion.filter((p) => !p.ungraded);
    const correctCount = graded.filter((p) => p.correct).length;
    const answeredGraded = graded.filter((p) => p.answered).length;
    const time = fmtDuration(r.timeTakenSeconds);
    const metrics = [
      { icon: ICONS.list, v: `${r.answeredCount} / ${r.totalSteps}`, k: 'Questions attempted' },
      { icon: ICONS.target, v: `${correctCount} / ${graded.length}`, k: answeredGraded ? `Correct (${pct(correctCount, answeredGraded)}% of attempted)` : 'Correct' },
    ];
    if (time) metrics.push({ icon: ICONS.clock, v: time, k: 'Time taken' });
    $('#resCorrectLine').innerHTML = metrics.map((x) => `<div class="metric">${x.icon}<div><b>${escapeHtml(x.v)}</b><span>${escapeHtml(x.k)}</span></div></div>`).join('')
      + (r.ungradedCount ? `<div class="metric"><div><b>${r.ungradedCount}</b><span>Written · self-assessed, not scored</span></div></div>` : '');

    $('#pbBadge').hidden = !(r.ctx.priorBest != null && r.accuracyPct != null && r.accuracyPct > r.ctx.priorBest);
    const vs = r.practiceProgress && r.practiceProgress.vsOriginal;
    const deltaEl = $('#resDelta');
    if (vs && vs.delta != null && vs.attemptsCount >= 2) {
      deltaEl.hidden = false;
      deltaEl.className = 'delta-line ' + (vs.delta > 0 ? 'trend-up' : vs.delta < 0 ? 'trend-down' : 'trend-flat');
      deltaEl.textContent = `${vs.delta > 0 ? '↑ +' : vs.delta < 0 ? '↓ ' : '→ '}${vs.delta} accuracy points vs your first attempt on this topic (${vs.originalPct}% → ${vs.latestPct}%)`;
    } else deltaEl.hidden = true;

    // Readiness — before→after only when both values were genuinely computed.
    const core = $('#resCore');
    const cap = $('#coreEvolved');
    const { prevReadiness, newReadiness, fresh } = r.ctx;
    if (fresh && prevReadiness != null && newReadiness != null) {
      setCore(core, newReadiness, { from: prevReadiness });
      const d = newReadiness - prevReadiness;
      cap.textContent = `Overall readiness ${d > 0 ? `rose ${d} points` : d < 0 ? `fell ${-d} points` : 'held steady'} after this test.`;
    } else if (fresh && newReadiness != null) {
      setCore(core, newReadiness);
      cap.textContent = 'Your first readiness score — a before/after comparison starts from your next test.';
    } else if (!fresh && state.readiness && state.readiness.examReadiness) {
      setCore(core, state.readiness.examReadiness.score);
      cap.textContent = 'Your current overall readiness, across all subjects.';
    } else {
      setCore(core, null);
      cap.textContent = (!fresh && state.readiness && state.readiness.evidence && state.readiness.evidence.reason)
        || 'Readiness needs at least 3 answered questions across your tests.';
    }
    $('#resCoreSub').textContent = core.classList.contains('core-empty') ? 'Not yet calculated' : 'out of 100';

    // Why you lost marks
    const groups = topicGroups(r.perQuestion);
    const lostGroups = groups.filter((g) => g.lost > 0).sort((a, b) => b.lost - a.lost || a.acc - b.acc);
    const tbody = $('#mistakeRows');
    if (lostGroups.length) {
      $('#mistakeCard').hidden = false; $('#strengthsCard').hidden = true;
      tbody.innerHTML = lostGroups.map((g) => `<tr>
        <td class="topic">${escapeHtml(g.name)}${g.subConcept && g.chapterName ? `<small>${escapeHtml(g.chapterName)}</small>` : ''}</td>
        <td class="num lost">${g.lost}</td><td class="num">${g.marks}</td><td class="num">${g.acc}%</td>
        <td class="why">${escapeHtml(whyText(g))}</td></tr>`).join('');
    } else {
      $('#mistakeCard').hidden = true; $('#strengthsCard').hidden = false;
      $('#strengthsList').textContent = graded.length
        ? `Every scored question was correct across ${plural(groups.length, 'topic')}.`
        : 'This attempt had no auto-marked questions.';
    }

    // Next best move
    const lost = Math.max(0, max - score);
    const improveCard = $('#improveCard');
    const top = lostGroups[0];
    if (lost > 0 && top) {
      improveCard.hidden = false;
      $('#improveTitle').textContent = 'Improve My Score';
      // A targeted set can only use questions outside this attempt. If every
      // live question in the weak chapters was already in it, say so up front.
      const inAttempt = new Map();
      r.perQuestion.forEach((p) => {
        if (!inAttempt.has(p.chapterId)) inAttempt.set(p.chapterId, new Set());
        inAttempt.get(p.chapterId).add(p.questionId);
      });
      const weakChapters = [...new Set(lostGroups.map((g) => g.chapterId).filter(Boolean))];
      const known = weakChapters.map((id) => chapterInfo(m.subjectId, id)).filter((c) => c && typeof c.gradableCount === 'number');
      const exhausted = known.length === weakChapters.length && known.length > 0
        && known.every((c) => c.gradableCount <= (inAttempt.get(c.id) || new Set()).size);
      const ibtn = $('#improveScoreBtn');
      ibtn.disabled = exhausted;
      $('#improveMeta').textContent = exhausted
        ? `${plural(lost, 'mark')} lost. This test already used every live question in ${known.length === 1 ? 'this chapter' : 'these chapters'}, so a fresh targeted set isn't possible yet — review your mistakes, then retake the chapter.`
        : `${plural(lost, 'mark')} lost. A fresh targeted set focuses on ${lostGroups.slice(0, 2).map((g) => g.name).join(' and ')}${lostGroups.length > 2 ? ` and ${lostGroups.length - 2} more` : ''}.`;
      ibtn.onclick = () => startImprovementTest(r.attemptId, ibtn);
      $('#weakspotTrainBtn').hidden = !(top.chapterId || m.chapterId);
      $('#weakspotTrainBtn').textContent = `Practice ${top.name}`;
      $('#weakspotTrainBtn').onclick = () => withBusy($('#weakspotTrainBtn'), () => startTestFlow({
        subjectId: m.subjectId, chapterId: top.chapterId || m.chapterId, chapterName: top.chapterName, subConcept: top.subConcept || null, count: 8, kind: 'practice',
      }));
    } else {
      improveCard.hidden = true;
    }

    renderReview(r);

    $('#retakeBtn').hidden = !m.subjectId;
    $('#retakeBtn').textContent = m.chapterId ? 'Practice this chapter again' : 'New Board Simulation';
    $('#retakeBtn').onclick = () => withBusy($('#retakeBtn'), () => startTestFlow({
      subjectId: m.subjectId, chapterId: m.chapterId, chapterName: m.chapterName, subConcept: m.subConcept,
      count: m.chapterId ? 10 : 20, kind: m.chapterId ? 'practice' : 'full',
    }));
  }

  function renderReview(r) {
    const card = $('#explainCard');
    const misses = r.perQuestion.filter((p) => !p.ungraded && !p.correct);
    const self = r.perQuestion.filter((p) => p.ungraded);
    $('#reviewMistakesBtn').hidden = !misses.length && !self.length;
    if (!misses.length && !self.length) { card.hidden = true; return; }
    card.hidden = false;
    const L = (i) => (i == null ? null : String.fromCharCode(65 + i));
    const item = (p, inner) => `<article class="review-item panel">
      <div class="rv-top">${p.ungraded ? '<span class="chip">Written · self-assessed</span>' : `<span class="chip">${plural(typeof p.marks === 'number' ? p.marks : 1, 'mark')}</span>`}
      ${p.difficulty ? `<span class="chip chip-quiet">${escapeHtml(p.difficulty)}</span>` : ''}<span class="chip">${escapeHtml(p.subConcept || p.chapterName || '')}</span></div>
      <p class="rv-q">${escapeHtml(p.text || '')}</p>${inner}
      <div class="rv-foot"><button type="button" class="btn btn-quiet btn-sm eq-practice" data-chapter="${p.chapterId || ''}" data-chname="${escapeHtml(p.chapterName || '')}" data-sub="${escapeHtml(p.subConcept || '')}">Practice similar questions →</button></div></article>`;
    const missHtml = misses.map((p) => {
      const opts = Array.isArray(p.options) ? p.options : [];
      const yours = p.answered && p.submittedOptionIndex != null
        ? `<div class="rv-ans wrong"><small>Your answer</small><b>${L(p.submittedOptionIndex)}</b> ${escapeHtml(opts[p.submittedOptionIndex] ?? '')}</div>`
        : '<div class="rv-ans none"><small>Your answer</small>Not answered</div>';
      const right = `<div class="rv-ans right"><small>Correct answer</small><b>${L(p.correctOptionIndex) ?? '—'}</b> ${escapeHtml(opts[p.correctOptionIndex] ?? '')}</div>`;
      const why = p.explanation
        ? `<div class="rv-why"><b>Why</b>${escapeHtml(p.explanation)}</div>`
        : '<div class="rv-why missing">No worked explanation is recorded for this question yet.</div>';
      return item(p, `<div class="rv-answers">${yours}${right}</div>${why}`);
    }).join('');
    const selfHtml = self.map((p) => item(p,
      `${p.submittedText ? `<div class="rv-ans" style="margin-bottom:10px"><small>Your answer</small>${escapeHtml(p.submittedText)}</div>` : '<div class="rv-ans none" style="margin-bottom:10px">You left this blank.</div>'}
       ${p.explanation ? `<div class="rv-why"><b>Reference</b>${escapeHtml(p.explanation)}</div>` : '<div class="rv-why missing">No reference answer is recorded yet — check against your textbook.</div>'}`)).join('');
    $('#explainRows').innerHTML = missHtml + selfHtml;
    $all('.eq-practice', $('#explainRows')).forEach((btn) => btn.addEventListener('click', () => withBusy(btn, () => startTestFlow({
      subjectId: r.meta.subjectId, chapterId: Number(btn.dataset.chapter) || r.meta.chapterId, chapterName: btn.dataset.chname || null,
      subConcept: btn.dataset.sub || null, count: 8, kind: 'practice',
    }))));
  }
  $('#reviewMistakesBtn').addEventListener('click', () => {
    const c = $('#explainCard');
    c.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    c.focus({ preventScroll: true });
  });
  $('#backToDashBtn').addEventListener('click', () => showScreen('dash'));

  // Results nav: the result in hand, else the latest submitted attempt.
  async function openResultsScreen(opts) {
    opts = opts || {};
    showScreen('results', { fromPopState: opts.fromPopState });
    renderHistory();
    if (state.result) { $('#resultView').hidden = false; return; }
    $('#resultView').hidden = true;
    const latest = state.recentAttempts.find((a) => a.submittedAt);
    if (latest) await loadResult(latest.id, { stay: true });
  }

  async function loadResult(attemptId, opts) {
    opts = opts || {};
    try {
      const resp = await api('GET', `/api/attempts/${attemptId}/result`);
      const r = normalizeResult(resp, attemptId, null);
      r.ctx = { fresh: false };
      state.result = r;
      renderResult(r);
      if (!opts.stay && r.improvementComparison) { renderImprove(r); showScreen('improve'); return; }
      if (!opts.stay) showScreen('results');
      renderHistory();
    } catch (e) { if (!e.sessionExpired) toast('Could not open that attempt: ' + e.message); }
  }

  function renderHistory() {
    const list = $('#historyList');
    const done = state.recentAttempts.filter((a) => a.submittedAt);
    list.innerHTML = '';
    $('#historySub').textContent = done.length ? 'Open any submitted attempt to see its diagnosis.' : '';
    if (!done.length) {
      list.innerHTML = `<div class="row-empty"><div><b>No results yet</b>Submit a test and its score and diagnosis will appear here.</div>
        <button class="btn btn-primary btn-sm" type="button" id="histStartBtn">Start practising</button></div>`;
      $('#histStartBtn').addEventListener('click', () => showScreen('practice'));
      return;
    }
    done.slice(0, 10).forEach((a) => {
      const row = document.createElement('div');
      row.className = 'hist-row';
      const mode = a.improvesAttemptId ? 'Targeted retest' : a.feedbackMode === 'deferred' ? 'Board Simulation' : 'Practice';
      const when = new Date(String(a.submittedAt).replace(' ', 'T') + (/[zZ]|[+-]\d\d:?\d\d$/.test(a.submittedAt) ? '' : 'Z'));
      const isOpen = state.result && state.result.attemptId === a.id;
      row.innerHTML = `<span class="h-name">${escapeHtml(a.subjectName)} · ${escapeHtml(a.chapterName || (a.improvesAttemptId ? 'Weak topics' : 'Full syllabus'))}
          <small>${escapeHtml(a.board)} · ${isNaN(when) ? '' : when.toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</small></span>
        <span class="pill ${a.improvesAttemptId ? 'pill-info' : a.feedbackMode === 'deferred' ? 'pill-warn' : 'pill-quiet'}">${mode}</span>
        <span class="h-score">${a.maxScore ? `${a.score} / ${a.maxScore}` : '—'}</span>
        <button class="btn btn-ghost btn-sm" type="button"${isOpen ? ' aria-current="true"' : ''}>${isOpen ? 'Showing' : 'Open'}</button>`;
      const btn = row.querySelector('button');
      btn.setAttribute('aria-label', `Open results: ${a.subjectName} ${a.chapterName || ''} ${mode}`);
      btn.addEventListener('click', () => withBusy(btn, () => loadResult(a.id)));
      list.appendChild(row);
    });
  }

  // ---------------------------------------------------------------------
  // IMPROVE MY SCORE — comparison from the persisted attempts only
  // ---------------------------------------------------------------------
  function renderImprove(r) {
    const cmp = r.improvementComparison;
    $('#icFirstScore').textContent = `${cmp.sourceScore} / ${cmp.sourceMaxScore}`;
    $('#icNowScore').textContent = `${cmp.newScore} / ${cmp.newMaxScore}`;
    $('#icFirstPct').textContent = cmp.sourceAccuracyPct != null ? `${cmp.sourceAccuracyPct}% of marks` : '—';
    $('#icNowPct').textContent = cmp.newAccuracyPct != null ? `${cmp.newAccuracyPct}% of marks` : '—';
    setBar($('#icBarFirst'), cmp.sourceAccuracyPct || 0);
    setBar($('#icBarNow'), cmp.newAccuracyPct || 0);
    const wrap = $('#icDeltaWrap');
    const sameScale = cmp.sourceMaxScore === cmp.newMaxScore;
    if (cmp.deltaPct != null) {
      const d = sameScale ? cmp.newScore - cmp.sourceScore : cmp.deltaPct;
      $('#icDelta').textContent = `${d > 0 ? '+' : ''}${d}`;
      $('#icDeltaUnit').textContent = sameScale ? (Math.abs(d) === 1 ? 'mark' : 'marks') : 'accuracy points';
      wrap.className = 'cmp-delta' + (d < 0 ? ' down' : d === 0 ? ' flat' : '');
    } else {
      $('#icDelta').textContent = '—'; $('#icDeltaUnit').textContent = 'not comparable'; wrap.className = 'cmp-delta flat';
    }
    const notes = [];
    if (!sameScale) notes.push(`The two sets have different totals (${cmp.sourceMaxScore} vs ${cmp.newMaxScore} marks), so the change is shown as percentage of marks scored.`);
    const f = cmp.freshness;
    if (f) notes.push(f.reusedCount ? `${f.freshCount} of ${f.totalQuestions} questions were new to you; ${f.reusedCount} had appeared in an earlier test because the bank ran short for these skills.` : `All ${f.totalQuestions} questions were new to you.`);
    $('#icNote').textContent = notes.join(' ');

    const rows = (cmp.bySubConcept || []).map((s) => {
      const prev = s.sourceTotal ? pct(s.sourceTotal - s.sourceWrong, s.sourceTotal) : null;
      const now = s.newTotal ? pct(s.newCorrect, s.newTotal) : null;
      return { ...s, prev, now, change: prev != null && now != null ? now - prev : null };
    });
    const cell = (s) => {
      const ch = s.change == null ? '<td class="num flat">—</td>' : `<td class="num ${s.change > 0 ? 'up' : s.change < 0 ? 'down' : 'flat'}">${s.change > 0 ? '+' : ''}${s.change}%</td>`;
      return `<tr><td class="topic">${escapeHtml(s.name)}${s.status === 'not_retested' ? '<small>Not in this set</small>' : ''}</td>
        <td class="num">${s.prev == null ? '—' : s.prev + '%'}</td><td class="num">${s.now == null ? '—' : s.now + '%'}</td>${ch}</tr>`;
    };
    const improved = rows.filter((s) => s.status === 'improved');
    const still = rows.filter((s) => s.status !== 'improved');
    $('#icImproved').innerHTML = improved.length ? improved.map(cell).join('') : '<tr><td colspan="4" class="empty">No topic fully recovered yet — a topic counts as improved when every question on it is correct.</td></tr>';
    $('#icStill').innerHTML = still.length ? still.map(cell).join('') : '<tr><td colspan="4" class="empty">Nothing left here — every targeted topic was fully correct.</td></tr>';

    const lostNow = (cmp.newMaxScore || 0) - (cmp.newScore || 0);
    const retake = $('#retakeTargetedBtn');
    retake.disabled = lostNow <= 0;
    $('#retakeNote').hidden = lostNow > 0;
    $('#retakeNote').textContent = 'No marks lost in this set, so there is nothing new to target. Try a Board Simulation to test the whole syllabus.';
    retake.onclick = () => startImprovementTest(r.attemptId, retake);
  }
  $('#impReviewBtn').addEventListener('click', () => { if (state.result) { renderResult(state.result); showScreen('results'); renderHistory(); } });
  $('#impDashBtn').addEventListener('click', () => showScreen('dash'));

  // ---------------------------------------------------------------------
  // BOOT
  // ---------------------------------------------------------------------
  (async function boot() {
    loadSession();
    applyTheme();
    $all('#landingBoardChips .seg').forEach((b) => setPressed(b, b.dataset.board === state.landingBoard, 'active'));
    state.createBoardPick = state.landingBoard;
    $all('#createBoardPick .pick-card').forEach((b) => setPressed(b, b.dataset.board === state.createBoardPick, 'sel'));
    loadLandingStats();
    if (state.token && state.user) {
      try { await enterApp(); } catch { clearSession(); showScreen('login'); }
    } else {
      showScreen('login');
    }
  })();
})();
