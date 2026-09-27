// Content-QA audit — Stage 8 workstream 3 (2026-09-24). READ-ONLY. Makes no
// changes to any table, ever: this script opens boardready.db with
// node:sqlite's own `{ readOnly: true }` flag (not db.js's normal read-write
// wrapper), so even a bug in this file that tried to write would fail with
// a real "attempt to write a readonly database" error rather than silently
// succeeding. Run: node scripts/content-qa-audit.js
//
// WHAT THIS IS: a comprehensive, evidence-based classification of the
// question bank's answer-key integrity, status/answer-status consistency,
// structural completeness, and visual/diagram completeness — surfaced for
// human review. It supersedes audit-publication-readiness.js for the
// specific checks below (see "Why a new tool" in the generated report) but
// does not replace it — that script's own promotion-candidate scope and
// output file are untouched.
//
// WHAT THIS IS NOT: this never promotes a question, never changes `status`
// or `answer_status`, never edits `correct`/`options_json`/`parts_json`,
// never deletes a row, never touches a source file, and never associates a
// visual with a question. Every finding below is a candidate for human
// review — "no bulk promotion or automatic correction until the evidence
// has been reviewed" is enforced by this script simply never calling
// anything but SELECT.
const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');
const db = new DatabaseSync(DB_PATH, { readOnly: true });

const GRADABLE_STATUSES = ['verified', 'qa_passed', 'published']; // mirrors content-rules.js exactly — this is the one true definition of "servable to a student"

function safeJsonParse(s) {
  if (s == null) return { ok: false, reason: 'null' };
  try { return { ok: true, value: JSON.parse(s) }; } catch { return { ok: false, reason: 'invalid_json' }; }
}

// ---------------------------------------------------------------------------
// A. Answer-key integrity — every row, every status, not just a promotion-
// candidate subset. This is the check audit-publication-readiness.js's own
// `correct_index_out_of_range` test cannot catch: `q.correct < 0` and
// `q.correct >= opts.length` both silently evaluate to `false` when
// `q.correct` is a non-numeric string (e.g. "(b)"), because JS's numeric
// comparison coerces it to NaN and every NaN comparison is false — so a
// non-numeric `correct` value sails through that check as if it were valid.
// This audit checks the SQLite-reported storage type directly (`typeof()`),
// which is the actual root cause the Phase 4 migration audit already named.
// ---------------------------------------------------------------------------
function auditAnswerKeys() {
  const mcqRows = db.prepare(`
    SELECT q.id, q.question_uid, q.status, q.answer_status, q.options_json, q.correct,
           typeof(q.correct) AS correctType, c.name AS chapter, s.board, s.name AS subject
    FROM questions q JOIN chapters c ON c.id = q.chapter_id JOIN subjects s ON s.id = c.subject_id
    WHERE q.kind = 'mcq'
  `).all();

  const findings = [];
  for (const q of mcqRows) {
    const opts = safeJsonParse(q.options_json);
    let problem = null;
    let severity = 'defect'; // vs. 'expected' — a null correct is NOT a defect when the content team has already, correctly, marked the answer as unavailable
    if (q.correctType === 'null') {
      if (q.answer_status === 'unavailable') { problem = 'correct_null_and_answer_marked_unavailable'; severity = 'expected'; }
      else problem = `correct_null_but_answer_status_claims_${q.answer_status}`; // a real inconsistency: the content team says an answer exists/was verified, but no value is stored
    } else if (q.correctType !== 'integer') {
      problem = `correct_is_non_integer_type(${q.correctType}, value=${JSON.stringify(q.correct)})`;
    } else if (!opts.ok) {
      problem = `options_json_${opts.reason}`;
    } else if (!Array.isArray(opts.value) || opts.value.length < 2) {
      problem = 'options_too_few_or_not_array';
    } else if (q.correct < 0 || q.correct >= opts.value.length) {
      problem = `correct_index_out_of_range(correct=${q.correct}, optionCount=${opts.value.length})`;
    }
    if (problem) {
      findings.push({ id: q.id, uid: q.question_uid, status: q.status, answerStatus: q.answer_status, board: q.board, subject: q.subject, chapter: q.chapter, problem, severity, gradable: GRADABLE_STATUSES.includes(q.status) });
    }
  }

  // Case-kind: each part's `correct` checked the same way, against its own parts_json.
  const caseRows = db.prepare(`
    SELECT q.id, q.question_uid, q.status, q.answer_status, q.parts_json, c.name AS chapter, s.board, s.name AS subject
    FROM questions q JOIN chapters c ON c.id = q.chapter_id JOIN subjects s ON s.id = c.subject_id
    WHERE q.kind = 'case'
  `).all();
  for (const q of caseRows) {
    const parts = safeJsonParse(q.parts_json);
    if (!parts.ok) {
      findings.push({ id: q.id, uid: q.question_uid, status: q.status, answerStatus: q.answer_status, board: q.board, subject: q.subject, chapter: q.chapter, problem: `parts_json_${parts.reason}`, severity: 'defect', gradable: GRADABLE_STATUSES.includes(q.status) });
      continue;
    }
    if (!Array.isArray(parts.value) || parts.value.length === 0) {
      findings.push({ id: q.id, uid: q.question_uid, status: q.status, answerStatus: q.answer_status, board: q.board, subject: q.subject, chapter: q.chapter, problem: 'parts_empty_or_not_array', severity: 'defect', gradable: GRADABLE_STATUSES.includes(q.status) });
      continue;
    }
    parts.value.forEach((p, i) => {
      if (p.correct == null) return; // open-style part within a case question — not every part is MCQ-graded
      if (!Array.isArray(p.options) || p.options.length < 2) {
        findings.push({ id: q.id, uid: q.question_uid, status: q.status, answerStatus: q.answer_status, board: q.board, subject: q.subject, chapter: q.chapter, problem: `part_${i}_correct_set_without_valid_options`, severity: 'defect', gradable: GRADABLE_STATUSES.includes(q.status) });
      } else if (typeof p.correct !== 'number' || !Number.isInteger(p.correct) || p.correct < 0 || p.correct >= p.options.length) {
        findings.push({ id: q.id, uid: q.question_uid, status: q.status, answerStatus: q.answer_status, board: q.board, subject: q.subject, chapter: q.chapter, problem: `part_${i}_correct_invalid(value=${JSON.stringify(p.correct)})`, severity: 'defect', gradable: GRADABLE_STATUSES.includes(q.status) });
      }
    });
  }
  return findings;
}

// ---------------------------------------------------------------------------
// B. Status x answer_status matrix, plus anomalous combinations — a
// GRADABLE row (verified/qa_passed/published) whose answer_status is
// anything other than source_provided/verified would mean a question is
// being served to students with an answer key the content team itself
// marked as unavailable or needing review.
// ---------------------------------------------------------------------------
function auditStatusMatrix() {
  const matrix = db.prepare(`SELECT status, answer_status, COUNT(*) AS c FROM questions GROUP BY status, answer_status ORDER BY status, answer_status`).all();
  const anomalies = db.prepare(`
    SELECT id, question_uid, status, answer_status FROM questions
    WHERE status IN (${GRADABLE_STATUSES.map(() => '?').join(',')})
      AND answer_status NOT IN ('source_provided','verified')
  `).all(...GRADABLE_STATUSES);
  return { matrix, anomalies };
}

// ---------------------------------------------------------------------------
// C. Visual/diagram completeness — asset_type-AWARE, unlike
// audit-publication-readiness.js's classifyAsset(), which classifies any
// on-disk image file as a "real_extracted_image" regardless of whether it's
// asset_type='source_cropped' (a genuine per-question crop) or
// 'source_page_full' (a whole scanned page that may show several questions
// and is not safely servable as a single question's diagram). This is the
// exact gap docs/publication-readiness-report-cbse-maths.md's correction
// already named for CBSE Maths specifically; this audit checks it across
// the whole bank.
// ---------------------------------------------------------------------------
function auditVisualCompleteness() {
  // 'adapted_verified' (Workstream 3B, 2026-09-25) included here too — a
  // question in this state claims to be fully resolved (a real ai_generated
  // visual, QA-passed), and that claim should be checked by this same
  // classifier, not exempted from it. Leaving it out would make a wrongly-
  // promoted row (e.g. a future bug that sets the status without a real
  // asset row) silently invisible to this audit instead of showing up as
  // 'missing_no_asset_row' the way every other diagram_status value would.
  const needVisual = db.prepare(`
    SELECT q.id, q.question_uid, q.status, q.diagram_status, c.name AS chapter, s.board, s.name AS subject
    FROM questions q JOIN chapters c ON c.id = q.chapter_id JOIN subjects s ON s.id = c.subject_id
    WHERE q.diagram_status IN ('source_diagram_preserved','needs_visual_review','adapted_verified')
  `).all();
  const assetsByQ = {};
  for (const row of db.prepare('SELECT * FROM visual_assets').all()) {
    (assetsByQ[row.question_id] ||= []).push(row);
  }
  const backendRoot = path.join(__dirname, '..');
  const results = needVisual.map((q) => {
    const assets = assetsByQ[q.id] || [];
    if (assets.length === 0) return { ...q, visualClass: 'missing_no_asset_row' };
    const classified = assets.map((a) => {
      const full = path.join(backendRoot, a.asset_path);
      const exists = fs.existsSync(full);
      const isImage = /\.(jpe?g|png|svg|webp)$/i.test(a.asset_path);
      if (!exists) return 'missing_file';
      if (!isImage) return 'not_an_image';
      if (a.asset_type === 'source_cropped' || a.asset_type === 'ai_generated') return 'genuine_per_question_visual';
      return 'whole_page_photo_only'; // asset_type === 'source_page_full'
    });
    let visualClass;
    if (classified.some((c) => c === 'genuine_per_question_visual')) visualClass = 'genuinely_servable';
    else if (classified.some((c) => c === 'missing_file')) visualClass = 'file_missing_on_disk';
    else if (classified.every((c) => c === 'whole_page_photo_only')) visualClass = 'only_whole_page_photo_not_genuinely_servable';
    else visualClass = 'not_an_image_reference';
    return { ...q, visualClass, assetTypes: assets.map((a) => a.asset_type) };
  });
  const summary = {};
  for (const r of results) summary[r.visualClass] = (summary[r.visualClass] || 0) + 1;
  const gradableNeedingVisual = results.filter((r) => GRADABLE_STATUSES.includes(r.status));
  const gradableSummary = {};
  for (const r of gradableNeedingVisual) gradableSummary[r.visualClass] = (gradableSummary[r.visualClass] || 0) + 1;
  return { total: results.length, summary, gradableTotal: gradableNeedingVisual.length, gradableSummary, results };
}

// ---------------------------------------------------------------------------
// D. Structural completeness (text/options/parts), split gradable vs not —
// gradable issues are the priority; backlog issues are lower-priority.
// ---------------------------------------------------------------------------
function auditStructuralCompleteness() {
  const rows = db.prepare(`
    SELECT q.id, q.question_uid, q.status, q.kind, q.text, q.options_json, q.parts_json
    FROM questions q
  `).all();
  const findings = [];
  for (const q of rows) {
    const issues = [];
    if (!q.text || q.text.trim().length < 8) issues.push('text_missing_or_too_short');
    if (q.kind === 'mcq') {
      const opts = safeJsonParse(q.options_json);
      if (opts.ok && Array.isArray(opts.value)) {
        if (opts.value.some((o) => o == null || String(o).trim() === '')) issues.push('options_has_empty_entry');
        const norm = opts.value.map((o) => String(o).trim().toLowerCase());
        if (new Set(norm).size !== norm.length) issues.push('options_has_duplicate_text');
      }
    }
    if (issues.length) findings.push({ id: q.id, uid: q.question_uid, status: q.status, gradable: GRADABLE_STATUSES.includes(q.status), issues });
  }
  return findings;
}

// ---------------------------------------------------------------------------
// E. Duplicate-flag backlog and null question_uid among gradable rows — both
// carried-forward, known items (not new discoveries), reported here so a
// single content-QA output has the full picture in one place.
// ---------------------------------------------------------------------------
function auditBacklogAndProvenance() {
  const dup = db.prepare(`SELECT status, COUNT(*) AS c FROM duplicate_flags GROUP BY status`).all();
  const nullUidGradable = db.prepare(`
    SELECT COUNT(*) AS c FROM questions WHERE question_uid IS NULL AND status IN (${GRADABLE_STATUSES.map(() => '?').join(',')})
  `).get(...GRADABLE_STATUSES).c;
  return { duplicateFlagsByStatus: dup, nullQuestionUidAmongGradable: nullUidGradable };
}

// ---------------------------------------------------------------------------
// F. Duplicate-CORRECT-answer text — a stricter, distinct check from D's
// options_has_duplicate_text (which flags ANY duplicate pair regardless of
// which option is correct). This one only flags a question when the option
// TEXT AT THE CREDITED INDEX also appears, verbatim (trimmed/case-folded),
// at another index. That specific shape is a genuine grading-fairness risk:
// a student who selects the other, identically-worded option is marked
// wrong even though they chose the same value the answer key credits.
// Added 2026-09-25 after id 2941 (Workstream 3A) surfaced this exact shape;
// this check exists to answer "how often does this happen across the whole
// bank" before any general grading rule is considered. Read-only, like
// every other check in this file — it only reports, never corrects.
// ---------------------------------------------------------------------------
function auditDuplicateCorrectAnswerText() {
  const norm = (s) => String(s).trim().toLowerCase();

  const mcqRows = db.prepare(`
    SELECT q.id, q.question_uid, q.status, q.options_json, q.correct,
           c.name AS chapter, s.board, s.name AS subject
    FROM questions q JOIN chapters c ON c.id = q.chapter_id JOIN subjects s ON s.id = c.subject_id
    WHERE q.kind = 'mcq'
  `).all();
  const mcqFindings = [];
  for (const q of mcqRows) {
    const opts = safeJsonParse(q.options_json);
    if (!opts.ok || !Array.isArray(opts.value)) continue;
    if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= opts.value.length) continue;
    const correctText = norm(opts.value[q.correct]);
    const duplicateIndices = opts.value.map((_, i) => i).filter((i) => i !== q.correct && norm(opts.value[i]) === correctText);
    if (duplicateIndices.length > 0) {
      mcqFindings.push({
        id: q.id, uid: q.question_uid, status: q.status, gradable: GRADABLE_STATUSES.includes(q.status),
        board: q.board, subject: q.subject, chapter: q.chapter,
        correctIndex: q.correct, correctText: opts.value[q.correct], duplicateIndices, options: opts.value,
      });
    }
  }

  const caseRows = db.prepare(`
    SELECT q.id, q.question_uid, q.status, q.parts_json, c.name AS chapter, s.board, s.name AS subject
    FROM questions q JOIN chapters c ON c.id = q.chapter_id JOIN subjects s ON s.id = c.subject_id
    WHERE q.kind = 'case'
  `).all();
  const caseFindings = [];
  for (const q of caseRows) {
    const parts = safeJsonParse(q.parts_json);
    if (!parts.ok || !Array.isArray(parts.value)) continue;
    parts.value.forEach((p, partIndex) => {
      if (p.correct == null || !Array.isArray(p.options)) return;
      if (typeof p.correct !== 'number' || p.correct < 0 || p.correct >= p.options.length) return;
      const correctText = norm(p.options[p.correct]);
      const duplicateIndices = p.options.map((_, i) => i).filter((i) => i !== p.correct && norm(p.options[i]) === correctText);
      if (duplicateIndices.length > 0) {
        caseFindings.push({
          id: q.id, uid: q.question_uid, status: q.status, gradable: GRADABLE_STATUSES.includes(q.status),
          board: q.board, subject: q.subject, chapter: q.chapter,
          partIndex, correctIndex: p.correct, correctText: p.options[p.correct], duplicateIndices, options: p.options,
        });
      }
    });
  }

  const all = [...mcqFindings, ...caseFindings];
  return { total: all.length, gradableTotal: all.filter((f) => f.gradable).length, mcqFindings, caseFindings };
}

// ---------------------------------------------------------------------------
// Run everything, print a summary, write the full JSON for review.
// ---------------------------------------------------------------------------
const answerKeyFindings = auditAnswerKeys();
const statusMatrix = auditStatusMatrix();
const visualAudit = auditVisualCompleteness();
const structuralFindings = auditStructuralCompleteness();
const backlog = auditBacklogAndProvenance();
const duplicateCorrectAnswer = auditDuplicateCorrectAnswerText();

const gradableAnswerKeyFindings = answerKeyFindings.filter((f) => f.gradable);
const gradableStructuralFindings = structuralFindings.filter((f) => f.gradable);
const defectAnswerKeyFindings = answerKeyFindings.filter((f) => f.severity === 'defect');
const expectedAnswerKeyFindings = answerKeyFindings.filter((f) => f.severity === 'expected');

console.log('=== A. ANSWER-KEY INTEGRITY ===');
console.log('Expected/deliberate (correct=NULL, answer_status=unavailable — not a defect):', expectedAnswerKeyFindings.length);
console.log('GENUINE DEFECTS (all statuses):', defectAnswerKeyFindings.length);
console.log('Of those genuine defects, CURRENTLY GRADABLE/SERVABLE (critical if > 0):', gradableAnswerKeyFindings.filter((f) => f.severity === 'defect').length);
const problemFreq = {};
defectAnswerKeyFindings.forEach((f) => { const key = f.problem.split('(')[0]; problemFreq[key] = (problemFreq[key] || 0) + 1; });
console.log('Defect-type frequency:', problemFreq);
console.log();

console.log('=== B. STATUS x ANSWER_STATUS MATRIX ===');
statusMatrix.matrix.forEach((r) => console.log(` ${r.status} / ${r.answer_status}: ${r.c}`));
console.log('Anomalous GRADABLE rows with a non-ready answer_status (critical if > 0):', statusMatrix.anomalies.length);
console.log();

console.log('=== C. VISUAL/DIAGRAM COMPLETENESS (asset_type-aware) ===');
console.log('Total rows needing a visual:', visualAudit.total);
console.log('Classification (all):', visualAudit.summary);
console.log('Of those, CURRENTLY GRADABLE — classification:', visualAudit.gradableSummary);
console.log();

console.log('=== D. STRUCTURAL COMPLETENESS ===');
console.log('Total rows with a structural issue (all statuses):', structuralFindings.length);
console.log('Of those, CURRENTLY GRADABLE:', gradableStructuralFindings.length);
console.log();

console.log('=== E. BACKLOG & PROVENANCE ===');
console.log('duplicate_flags by status:', backlog.duplicateFlagsByStatus);
console.log('NULL question_uid among currently-gradable rows:', backlog.nullQuestionUidAmongGradable);
console.log();

console.log('=== F. DUPLICATE-CORRECT-ANSWER TEXT (grading-fairness scope check) ===');
console.log('Total questions where the CREDITED option\'s text also appears at another index:', duplicateCorrectAnswer.total, `(mcq: ${duplicateCorrectAnswer.mcqFindings.length}, case sub-parts: ${duplicateCorrectAnswer.caseFindings.length})`);
console.log('Of those, CURRENTLY GRADABLE (real grading-fairness exposure):', duplicateCorrectAnswer.gradableTotal);
console.log();

const output = {
  generatedAt: new Date().toISOString(),
  dbPath: DB_PATH,
  gradableStatuses: GRADABLE_STATUSES,
  answerKeyIntegrity: {
    total: answerKeyFindings.length,
    expectedCount: expectedAnswerKeyFindings.length,
    defectCount: defectAnswerKeyFindings.length,
    gradableDefectCount: gradableAnswerKeyFindings.filter((f) => f.severity === 'defect').length,
    findings: answerKeyFindings,
  },
  statusMatrix,
  visualCompleteness: visualAudit,
  structuralCompleteness: { total: structuralFindings.length, gradableCount: gradableStructuralFindings.length, findings: structuralFindings },
  backlogAndProvenance: backlog,
  duplicateCorrectAnswerText: duplicateCorrectAnswer,
};
const outPath = path.join(__dirname, '..', 'docs', 'content-qa-audit-output.json');
fs.writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Full findings written to ${path.relative(process.cwd(), outPath)} (read-only audit — no table was modified).`);
