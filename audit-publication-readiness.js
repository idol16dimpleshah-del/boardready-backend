// Publication-readiness audit — READ ONLY, makes no changes to any table.
// Run: node audit-publication-readiness.js
//
// Scope: every question with status='transcribed' AND answer_status IN
// ('verified','source_provided') — the 2,569 candidates previously proposed
// for promotion to status='verified' (gradable). This script does NOT
// promote anything; it only classifies each candidate against the
// publication-readiness criteria the founder specified:
//   - text/options/parts completeness
//   - source provenance completeness
//   - duplicate/review flags
//   - visual/diagram completeness (a question needing a diagram is not
//     "complete" unless a real, servable, uncropped image exists for it —
//     a DB row merely referencing the source PDF does not count)
const db = require('./db');
const fs = require('fs');
const path = require('path');

function safeJsonParse(s) {
  if (s == null) return null;
  try { return JSON.parse(s); } catch { return '__INVALID_JSON__'; }
}

const candidates = db.prepare(`
  SELECT q.*, c.name AS chapter_name, c.id AS chapter_id, s.board, s.name AS subject_name
  FROM questions q
  JOIN chapters c ON q.chapter_id = c.id
  JOIN subjects s ON c.subject_id = s.id
  WHERE q.status = 'transcribed' AND q.answer_status IN ('verified','source_provided')
`).all();

console.log(`Total candidates audited: ${candidates.length}\n`);

// Preload visual_assets and duplicate_flags for fast lookup.
const visualsByQ = {};
for (const row of db.prepare('SELECT * FROM visual_assets').all()) {
  (visualsByQ[row.question_id] ||= []).push(row);
}
const dupByUid = {};
for (const row of db.prepare(`SELECT * FROM duplicate_flags WHERE status='pending'`).all()) {
  (dupByUid[row.new_question_uid] ||= []).push(row);
}
const dupAsExisting = new Set(db.prepare(`SELECT DISTINCT existing_question_id FROM duplicate_flags WHERE status='pending'`).all().map(r => r.existing_question_id));

// Helper: is this asset_path a real, already-extracted, single-page/cropped
// image file (jpg/png/svg) that exists on disk — vs a reference to a whole
// multi-page source PDF (not servable as-is)?
function classifyAsset(asset) {
  const full = path.join(__dirname, asset.asset_path);
  const exists = fs.existsSync(full);
  const isImage = /\.(jpe?g|png|svg|webp)$/i.test(asset.asset_path);
  if (!exists) return 'missing_file';
  if (!isImage) return 'references_whole_source_pdf'; // e.g. points at ch7-8.pdf itself
  return 'real_extracted_image';
}

const findings = [];

for (const q of candidates) {
  const issues = [];
  let visualClass = 'not_needed';

  // 1. Text completeness
  if (!q.text || q.text.trim().length < 8) issues.push('text_missing_or_too_short');

  // 2. Options / parts completeness by kind
  if (q.kind === 'mcq') {
    const opts = safeJsonParse(q.options_json);
    if (opts === '__INVALID_JSON__' || !Array.isArray(opts)) issues.push('options_invalid_json');
    else {
      if (opts.length < 2) issues.push('options_too_few');
      if (opts.some((o) => o == null || String(o).trim() === '')) issues.push('options_has_empty_entry');
      if (q.correct == null || q.correct < 0 || q.correct >= opts.length) issues.push('correct_index_out_of_range');
    }
  } else if (q.kind === 'case') {
    const parts = safeJsonParse(q.parts_json);
    if (parts === '__INVALID_JSON__' || !Array.isArray(parts) || parts.length === 0) issues.push('parts_invalid_or_empty');
    else {
      parts.forEach((p, i) => {
        if (!p.text || String(p.text).trim().length < 4) issues.push(`part_${i}_text_missing`);
        if (Array.isArray(p.options)) {
          if (p.options.some((o) => o == null || String(o).trim() === '')) issues.push(`part_${i}_options_has_empty_entry`);
          if (p.correct == null || p.correct < 0 || p.correct >= p.options.length) issues.push(`part_${i}_correct_index_out_of_range`);
        } else if (p.correct != null) {
          issues.push(`part_${i}_correct_set_without_options`);
        }
      });
    }
  } else if (q.kind === 'open') {
    // Open items are not MCQ-gradable by design; flag separately, not as a defect.
    issues.push('kind_open_not_autogradable');
  }

  // 3. Source provenance completeness
  if (!q.source_page) issues.push('missing_source_page');
  if (!q.source_question_number) issues.push('missing_source_question_number');
  if (!q.source_document_id) issues.push('missing_source_document_id');
  if (!q.answer_key_ref) issues.push('missing_answer_key_ref');

  // 4. Duplicate / review flags
  const hasDupFlag = !!dupByUid[q.question_uid] || dupAsExisting.has(q.id);
  if (hasDupFlag) issues.push('has_pending_duplicate_flag');

  // 5. Visual/diagram completeness
  if (q.diagram_status === 'source_diagram_preserved' || q.diagram_status === 'needs_visual_review') {
    const assets = visualsByQ[q.id] || [];
    if (assets.length === 0) {
      visualClass = 'missing_no_asset_row';
      issues.push('visual_needed_but_no_asset_row');
    } else {
      const classes = assets.map(classifyAsset);
      if (classes.every((c) => c === 'real_extracted_image')) {
        visualClass = 'complete_extracted_image';
      } else if (classes.some((c) => c === 'missing_file')) {
        visualClass = 'incomplete_file_missing_on_disk';
        issues.push('visual_asset_file_missing_on_disk');
      } else {
        visualClass = 'incomplete_references_source_pdf_only';
        issues.push('visual_not_yet_extracted_into_servable_image');
      }
      if (q.diagram_status === 'needs_visual_review') issues.push('diagram_flagged_needs_visual_review');
    }
  } else if (q.diagram_status === 'ai_generated_pending') {
    visualClass = 'ai_generated_pending';
    issues.push('diagram_ai_generation_pending');
  } else if (q.diagram_status == null) {
    issues.push('diagram_status_not_set');
  }

  findings.push({
    id: q.id, uid: q.question_uid, board: q.board, subject: q.subject_name,
    chapter: q.chapter_name, chapterId: q.chapter_id, kind: q.kind,
    answerStatus: q.answer_status, diagramStatus: q.diagram_status,
    visualClass, issues,
  });
}

// ---- Aggregate reporting ----
function groupCount(arr, keyFn) {
  const m = {};
  for (const x of arr) { const k = keyFn(x); m[k] = (m[k] || 0) + 1; }
  return m;
}

const withNoIssues = findings.filter((f) => f.issues.length === 0);
const withOnlyNonBlocking = findings.filter((f) => f.issues.length > 0 && f.issues.every((i) => i === 'kind_open_not_autogradable'));
const safeToPromote = findings.filter((f) => f.issues.length === 0);
const needsReview = findings.filter((f) => f.issues.length > 0 && !f.issues.every((i) => i === 'kind_open_not_autogradable'));

console.log('=== TOP-LINE ===');
console.log('Total audited:                        ', findings.length);
console.log('Zero issues found (safe to promote):  ', safeToPromote.length);
console.log('At least one issue (needs review):    ', needsReview.length);
console.log();

console.log('=== VISUAL CLASSIFICATION (across all candidates) ===');
console.log(groupCount(findings, (f) => f.visualClass));
console.log();

console.log('=== ISSUE FREQUENCY (a row can have multiple) ===');
const issueFreq = {};
findings.forEach((f) => f.issues.forEach((i) => { issueFreq[i] = (issueFreq[i] || 0) + 1; }));
console.log(issueFreq);
console.log();

console.log('=== BY BOARD/SUBJECT: total / safe / needsReview ===');
const bySubj = {};
findings.forEach((f) => {
  const k = `${f.board} | ${f.subject}`;
  bySubj[k] ||= { total: 0, safe: 0, needsReview: 0 };
  bySubj[k].total++;
  if (f.issues.length === 0) bySubj[k].safe++; else bySubj[k].needsReview++;
});
Object.entries(bySubj).forEach(([k, v]) => console.log(k, v));
console.log();

console.log('=== CBSE MATHEMATICS — full breakdown by chapter ===');
const cbseMaths = findings.filter((f) => f.board === 'CBSE' && f.subject === 'Mathematics');
const byChapter = {};
cbseMaths.forEach((f) => {
  byChapter[f.chapter] ||= { total: 0, safe: 0, needsReview: 0, hasVisualNeed: 0, visualComplete: 0, visualIncomplete: 0 };
  const b = byChapter[f.chapter];
  b.total++;
  if (f.issues.length === 0) b.safe++; else b.needsReview++;
  if (f.visualClass !== 'not_needed') {
    b.hasVisualNeed++;
    if (f.visualClass === 'complete_extracted_image') b.visualComplete++;
    else b.visualIncomplete++;
  }
});
Object.entries(byChapter).forEach(([k, v]) => console.log(k, v));
console.log();

console.log('=== CBSE MATHEMATICS — totals ===');
const cbseTotal = cbseMaths.length;
const cbseSafe = cbseMaths.filter((f) => f.issues.length === 0).length;
const cbseNeedsReview = cbseTotal - cbseSafe;
const cbseHasVisual = cbseMaths.filter((f) => f.visualClass !== 'not_needed').length;
const cbseVisualComplete = cbseMaths.filter((f) => f.visualClass === 'complete_extracted_image').length;
const cbseVisualIncomplete = cbseHasVisual - cbseVisualComplete;
console.log({ candidatesAudited: cbseTotal, safeToPromote: cbseSafe, needsReview: cbseNeedsReview, hasVisualNeed: cbseHasVisual, visualComplete: cbseVisualComplete, visualIncomplete: cbseVisualIncomplete });

fs.writeFileSync(path.join(__dirname, 'audit-publication-readiness-output.json'), JSON.stringify(findings, null, 2));
console.log('\nFull per-question findings written to audit-publication-readiness-output.json (not applied to DB).');
