// CONTINUOUS CONTENT INGESTION — the reusable pipeline for adding new
// source material (PDFs, question papers, guide books, ...) to the
// PERMANENT question bank, on top of whatever's already there. This is
// deliberately a separate module from practice.js (test ASSEMBLY) and
// scoring.js/diagnostics.js/readiness.js (test GRADING/DIAGNOSIS) — per
// the founder's own explicit split: "SOURCE QUESTIONS" (this file grows
// the inventory) vs. "GENERATED TESTS" (practice.js draws from whatever
// currently exists, live, every time it's called — it was ALREADY built
// that way from day one of this rebuild: it queries the questions table
// at call time with no snapshot, so a question added a second ago is
// immediately eligible). Nothing in this file changes scoring, diagnostics,
// retest, or readiness — it only ever inserts rows into `questions`.
//
// THE ACTUAL WORKFLOW THIS IMPLEMENTS:
//   ingestQuestions(items, meta) is called once per source document
//   (one PDF/paper/book chapter). It:
//     1. Resolves/creates the (board, subject, chapter) the batch belongs to.
//     2. For each item, normalizes its text and checks for an EXACT
//        duplicate already in the bank (same chapter, same normalized
//        text) — exact duplicates are skipped, never re-inserted.
//     3. Checks for a NEAR duplicate (high but not total token overlap,
//        same chapter) — near-duplicates ARE inserted (we don't want to
//        silently drop real content on a heuristic), but are recorded in
//        `duplicate_flags` for a human to review and decide keep-both /
//        merge / discard.
//     4. Everything else is inserted as a new row with its own
//        `question_uid`, its own `source`/`source_page`, and the batch's
//        `status` (see content-rules.js — only GRADABLE_STATUSES content
//        is ever servable, so a batch can be ingested as 'transcribed'
//        and only promoted to 'verified' once someone's actually checked it).
//   Existing questions are NEVER deleted or overwritten by a later
//   ingestion call — the bank only grows, exactly as the founder
//   specified. Re-running this on the same source is safe (idempotent):
//   the exact-duplicate check means nothing doubles up.
//
// DUPLICATE DETECTION METHOD (stated plainly — this is a heuristic, not a
// semantic/ML dedup engine, and shouldn't be oversold as one):
// normalized_text = lowercased, punctuation-stripped, whitespace-collapsed.
// Exact duplicate = identical normalized_text within the same chapter.
// Near duplicate = Jaccard similarity (word-set overlap) within
// [NEAR_DUP_THRESHOLD, 1.0) of an existing question in the same chapter —
// catches "same question, reworded slightly" far more often than it
// catches nothing, but it's a bag-of-words measure: two genuinely
// different questions that happen to share most of their vocabulary (e.g.
// two variations on the same word-problem template with different
// numbers) can still trip it. That's exactly why near-dupes are FLAGGED
// for a human, never silently merged or discarded automatically.

const crypto = require('node:crypto');
const db = require('./db');
const { GRADABLE_STATUSES } = require('./content-rules');

const NEAR_DUP_THRESHOLD = 0.75;
const NON_GRADABLE_ANSWER_STATUSES = ['unavailable', 'needs_review'];
// adapted_verified (Workstream 3B, 2026-09-25): added because none of the
// original four values could honestly mean "this question has a real,
// QA-passed, student-facing visual" — 'source_diagram_preserved' only means
// the ORIGINAL is linked for provenance (see visual_assets.asset_type
// 'source_cropped'/'source_page_full'), and 'ai_generated_pending' explicitly
// says *pending*, not done. A question only reaches 'adapted_verified' after
// its visual_assets rows include a real asset_type='ai_generated' row AND a
// documented visual-QA comparison against the source has been completed —
// never assigned just because a generated file exists on disk (see
// docs/workstream-3b-3070-generated-visual-provenance-and-qa.md Section 4 for
// the gap this closes, and Section 5 for what "QA comparison" means here).
const VALID_DIAGRAM_STATUSES = ['not_applicable', 'source_diagram_preserved', 'needs_visual_review', 'ai_generated_pending', 'adapted_verified'];

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}
function tokenSet(normalized) {
  return new Set(normalized.split(' ').filter(Boolean));
}
// EXACT-duplicate fingerprint: question STEM text alone is not enough — real
// textbooks genuinely reuse identical stem wording for two different
// questions that differ only in their options/answer (found live during the
// Statistics re-ingestion: source items (29) and (83) both read "The modal
// class of a given distribution always corresponds to the:" but have
// completely different option sets and different correct answers). Folding
// the options (or case-study parts) into the fingerprint fixes that: two
// rows only count as an exact duplicate if the stem AND the full answer
// shape match. Near-duplicate detection deliberately stays text-only (see
// jaccard() below) since a reworded-but-same-question item is exactly what
// that heuristic exists to catch.
function exactFingerprint(normalizedStem, kind, optionsOrParts) {
  let answerShape;
  if (kind === 'case') {
    answerShape = JSON.stringify((optionsOrParts || []).map((p) => ({ t: normalize(p.text || ''), o: p.options, c: p.correct })));
  } else if (kind === 'open') {
    // 'open' rows never have options/correct (never invent a choice set a
    // source didn't print) — fold in any grouped parts' text only, so a
    // multi-part "Give reasons (a)-(f)" group still fingerprints on its full
    // content, not just its shared stem.
    answerShape = JSON.stringify((optionsOrParts || []).map((p) => ({ t: normalize(p.text || '') })));
  } else {
    answerShape = JSON.stringify(optionsOrParts || null);
  }
  return `${normalizedStem}::${answerShape}`;
}
function jaccard(a, b) {
  const inter = [...a].filter((x) => b.has(x)).length;
  const union = new Set([...a, ...b]).size;
  return union ? inter / union : 0;
}
function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''); }
function shortHash(s) { return crypto.createHash('sha1').update(s).digest('hex').slice(0, 8); }

function upsertSubject(board, name) {
  const existing = db.prepare('SELECT id FROM subjects WHERE board = ? AND name = ?').get(board, name);
  if (existing) return existing.id;
  return Number(db.prepare('INSERT INTO subjects (board, name) VALUES (?, ?)').run(board, name).lastInsertRowid);
}
function upsertChapter(subjectId, name, orderIndex = 0) {
  const existing = db.prepare('SELECT id FROM chapters WHERE subject_id = ? AND name = ?').get(subjectId, name);
  if (existing) return existing.id;
  return Number(db.prepare('INSERT INTO chapters (subject_id, name, order_index) VALUES (?, ?, ?)').run(subjectId, name, orderIndex).lastInsertRowid);
}

/**
 * @param items [{ text, options, correct, difficulty, subConcept, kind, parts,
 *                 explanation, sourcePage, sourceQuestionNumber, answerKeyRef,
 *                 questionType, status, answerStatus, sourceSection }]
 *   sourceQuestionNumber: the number PRINTED in the source next to this
 *     question (e.g. "94"), not this table's own row id. For a case-study
 *     item this is the ONE number the whole passage+sub-parts group was
 *     printed under — the sub-parts stay together in `parts` as a single
 *     row/step-group, never split into unrelated rows.
 *   answerKeyRef: exactly where the answer was cross-checked, e.g.
 *     "answer.pdf p.25.15 item (94)".
 *   questionType: pedagogical type for test-mix purposes — 'mcq',
 *     'assertion_reasoning', 'case_study', etc. Distinct from `kind`, which
 *     only encodes grading shape (mcq = one step, case = many steps).
 *   answerStatus: 'source_provided' (default) | 'unavailable' | 'needs_review'
 *     | 'verified' — INDEPENDENT of `status`/`item.status`. This is what lets
 *     a question be perfectly extracted (status: 'transcribed'/'verified')
 *     while its answer is simply not in the source yet (answerStatus:
 *     'unavailable') — e.g. Chemistry Ch1-9 with no answer key. See the
 *     safety-invariant check below: a non-gradable answerStatus silently
 *     downgrades `status` if the caller tried to publish/verify anyway.
 *   sourceSection: which part of a multi-section source this came from
 *     (e.g. a Chemistry chapter vs. "Chart 1" vs. "Competency Focused"),
 *     for sources whose structure isn't just chapter-by-chapter.
 *   diagramStatus: 'not_applicable' | 'source_diagram_preserved' |
 *     'needs_visual_review' (default) | 'ai_generated_pending' |
 *     'adapted_verified' (a real, QA-passed ai_generated visual is linked —
 *     see VALID_DIAGRAM_STATUSES above; this is never the right value to
 *     pass at ingest time, since ingest happens long before any redraw/QA
 *     work exists — it's set later, by the same kind of guarded correction
 *     script this file's other callers use for post-ingest updates).
 *     Founder
 *     requirement 2026-09-17 ("PRESERVE EVERY SOURCE DIAGRAM"): a question
 *     is not completely captured if it needs a diagram/figure/graph/
 *     structure/circuit/map/table-image and doesn't have one linked. This
 *     is a THIRD independent axis from status/answerStatus — a question can
 *     be perfectly transcribed with a verified answer and STILL be
 *     incomplete for want of its figure. Pass 'not_applicable' only when
 *     you've actually looked at the source page and confirmed there is no
 *     visual for this question — never assume by default (the whole point
 *     of defaulting to 'needs_visual_review' is that omitting this field
 *     must never be silently read as "no diagram needed").
 *   visuals: [{ sourceFileId, figureLabel, assetType, assetPath, notes }] —
 *     required (non-empty) when diagramStatus is 'source_diagram_preserved'.
 *     sourceFileId must be an already-archived source_files.id (the full
 *     page image is always the safe default — see visual_assets table
 *     comment in db.js for why a full uncropped page beats a risky crop).
 *     assetType defaults to 'source_page_full'; assetPath defaults to that
 *     source_files row's own archive_path when omitted.
 * @param meta  { board, subjectName, chapterName, chapterOrder, label (source document name), status, answerStatus, sourceSection }
 */
function ingestQuestions(items, meta) {
  const { board, subjectName, chapterName, label, status = 'transcribed', answerStatus: batchAnswerStatus = 'source_provided', sourceSection: batchSourceSection = null, sourceFileIds = null } = meta;
  if (!board || !subjectName || !chapterName || !label) {
    throw new Error('ingestQuestions requires board, subjectName, chapterName, and a label for the source document');
  }
  // ARCHIVE-BEFORE-INGEST (founder's 2026-09-17 "SOURCE FILES ARE IMMUTABLE
  // PROJECT ASSETS" rule): every new upload must be archived into
  // source_files (see archive-sources.js for the pattern — copy the
  // original into source_library/, hash it, register it) BEFORE this
  // function is called. Passing meta.sourceFileIds (an array of
  // source_files.id, one per physical file this batch was drawn from) is
  // how the caller proves that happened. This is enforced here, not just
  // documented, because a documented-only rule is exactly what let 41
  // files sit in a temporary uploads folder with no permanent registry
  // entry until a founder audit caught it. A caller that genuinely has no
  // source file to register (e.g. a hand-authored/no-PDF batch, as
  // REBUILD_NOTES.md documents for the original CBSE Maths content) must
  // pass sourceFileIds: 'none-hand-authored' explicitly, so the omission
  // is a recorded decision, not a silent gap.
  if (sourceFileIds !== 'none-hand-authored') {
    if (!Array.isArray(sourceFileIds) || sourceFileIds.length === 0) {
      throw new Error(
        "ingestQuestions requires meta.sourceFileIds: an array of source_files.id for the original file(s) this batch was ingested from (archive the file with archive-sources.js's pattern first, then pass its id here), or the literal string 'none-hand-authored' if this batch has no source PDF at all."
      );
    }
    const placeholders = sourceFileIds.map(() => '?').join(',');
    const found = db.prepare(`SELECT id FROM source_files WHERE id IN (${placeholders})`).all(...sourceFileIds);
    if (found.length !== sourceFileIds.length) {
      throw new Error(`ingestQuestions: sourceFileIds contains id(s) not present in source_files — archive the file(s) first. Got [${sourceFileIds.join(',')}], found [${found.map((f) => f.id).join(',')}].`);
    }
  }

  // Source-document dedup guard: a label that's already registered gets a
  // warning on the returned result instead of silently spawning a second,
  // indistinguishable source_documents row. This is NOT full versioning yet
  // (that needs a deliberate "this is a revised edition" signal from the
  // caller) — it just stops the same exact label from being blindly
  // reprocessed and re-recorded as if it were a brand-new source.
  const priorBatchesForLabel = db.prepare('SELECT COUNT(*) as n FROM source_documents WHERE label = ?').get(label).n;
  const isReingestOfKnownLabel = priorBatchesForLabel > 0;

  const subjectId = upsertSubject(board, subjectName);
  const chapterId = upsertChapter(subjectId, chapterName, meta.chapterOrder || 0);

  const existing = db.prepare('SELECT id, normalized_text, text, kind, options_json, parts_json FROM questions WHERE chapter_id = ?').all(chapterId)
    .map((r) => {
      const normalizedStem = r.normalized_text || normalize(r.text);
      const optionsOrParts = (r.kind === 'case' || r.kind === 'open')
        ? (r.parts_json ? JSON.parse(r.parts_json) : [])
        : (r.options_json ? JSON.parse(r.options_json) : null);
      return { ...r, tokens: tokenSet(normalizedStem), fingerprint: exactFingerprint(normalizedStem, r.kind, optionsOrParts) };
    });

  let inserted = 0, skippedExactDuplicates = 0, flaggedNearDuplicates = 0, sourceDocumentId = null;
  const insertedIds = [];

  // Whole batch in one transaction: a mid-batch failure (a bad item, a
  // constraint violation) rolls back cleanly instead of leaving the bank
  // with half a batch inserted and no record of what happened — a real
  // failure mode hit once during development (a uid-collision bug) where an
  // un-transacted loop had already inserted several rows before erroring.
  db.exec('BEGIN TRANSACTION;');
  try {
  for (const item of items) {
    const normalized = normalize(item.text);
    const tokens = tokenSet(normalized);
    const kind = item.kind || 'mcq';
    const itemFingerprint = exactFingerprint(normalized, kind, (kind === 'case' || kind === 'open') ? (item.parts || []) : item.options);

    // Exact duplicate requires the stem AND the full answer shape to match —
    // see exactFingerprint()'s comment for why stem-only matching is unsafe.
    const exact = existing.find((e) => e.fingerprint === itemFingerprint);
    if (exact) { skippedExactDuplicates += 1; continue; }

    let nearMatch = null, nearScore = 0;
    for (const e of existing) {
      const sim = jaccard(tokens, e.tokens);
      if (sim >= NEAR_DUP_THRESHOLD && sim > nearScore) { nearMatch = e; nearScore = sim; }
    }

    // Hash the FULL fingerprint (stem + answer shape), not just the stem —
    // otherwise two genuinely different questions that happen to share a
    // stem (see the exactFingerprint() comment above) would collide on
    // question_uid even after being correctly told apart as distinct rows.
    const uid = `${slug(board)}-${slug(subjectName)}-${slug(chapterName)}-${shortHash(itemFingerprint)}`;
    const marks = (kind === 'case' || kind === 'open') ? (item.parts || []).reduce((a, p) => a + (p.marks || 1), 0) || 1 : 1;

    // Per-item status override: an item flagged uncertain during extraction
    // (illegible source, an answer-key contradiction, ambiguous wording) is
    // routed to 'needs_review' regardless of the batch's overall status —
    // one shaky item in an otherwise-clean batch must not drag the whole
    // batch down, and a clean batch must not silently launder one bad item.
    let itemStatus = item.status || status;
    const itemAnswerStatus = item.answerStatus || batchAnswerStatus;
    const itemSourceSection = item.sourceSection || batchSourceSection;

    // SAFETY INVARIANT (this is the enforcement point — SQLite can't express
    // a cross-column CHECK here): a row must never be inserted into a
    // GRADABLE_STATUSES status while its answer isn't trustworthy yet. This
    // is a silent, deliberate DOWNGRADE rather than a thrown error, because
    // the common real case is a whole batch (e.g. Chemistry Ch1-9) legitimately
    // extracted to 'verified'-quality text with NO answer key at all — that's
    // not a bug in the caller, it's exactly the two-axis case the schema
    // exists for. The question stays servable for review/browsing; it just
    // can't be graded until answer_status clears.
    if (GRADABLE_STATUSES.includes(itemStatus) && NON_GRADABLE_ANSWER_STATUSES.includes(itemAnswerStatus)) {
      itemStatus = 'needs_review';
    }

    // question_format captures the NATIVE shape of the source content
    // (independent of `kind`, which only encodes grading shape) — e.g.
    // 'name_the_following', 'give_reasons', 'equation', 'numerical',
    // 'structural', 'short_answer'. Defaults sensibly by kind when the
    // caller doesn't specify one, but 'open' items should almost always
    // pass an explicit item.questionFormat since "open" alone doesn't say
    // what native shape it is.
    const itemQuestionFormat = item.questionFormat || (kind === 'case' ? 'case_study' : kind === 'open' ? 'open' : 'mcq');

    // Diagram/visual completeness (founder requirement 2026-09-17) — see
    // this function's doc comment and the visual_assets table comment in
    // db.js. Validated here, not left to silently default to "fine".
    const itemDiagramStatus = item.diagramStatus || 'needs_visual_review';
    if (!VALID_DIAGRAM_STATUSES.includes(itemDiagramStatus)) {
      throw new Error(`ingestQuestions: item.diagramStatus "${itemDiagramStatus}" is not one of ${VALID_DIAGRAM_STATUSES.join(', ')} (source_question_number ${item.sourceQuestionNumber || '?'})`);
    }
    if (itemDiagramStatus === 'source_diagram_preserved' && (!Array.isArray(item.visuals) || item.visuals.length === 0)) {
      throw new Error(`ingestQuestions: item.diagramStatus is 'source_diagram_preserved' but item.visuals is empty (source_question_number ${item.sourceQuestionNumber || '?'}) — link at least one visual_assets row, or use 'needs_visual_review' if the asset isn't ready yet.`);
    }
    if (Array.isArray(item.visuals)) {
      for (const v of item.visuals) {
        if (v.sourceFileId != null) {
          const sf = db.prepare('SELECT id FROM source_files WHERE id = ?').get(v.sourceFileId);
          if (!sf) throw new Error(`ingestQuestions: visuals references source_files.id ${v.sourceFileId}, which does not exist (source_question_number ${item.sourceQuestionNumber || '?'})`);
        } else if (!v.assetPath) {
          throw new Error(`ingestQuestions: a visuals entry needs either sourceFileId or an explicit assetPath (source_question_number ${item.sourceQuestionNumber || '?'})`);
        }
      }
    }

    const info = db.prepare(`INSERT INTO questions
      (question_uid, chapter_id, kind, sub_concept, difficulty, status, marks, text, normalized_text, options_json, correct, parts_json, explanation, source, source_page, source_question_number, answer_key_ref, question_type, answer_status, source_section, question_format, diagram_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(uid, chapterId, kind, item.subConcept || null, item.difficulty || 'Medium', itemStatus, marks,
        item.text, normalized,
        kind === 'mcq' ? JSON.stringify(item.options) : null, kind === 'mcq' ? item.correct : null,
        (kind === 'case' || kind === 'open') ? (item.parts ? JSON.stringify(item.parts) : null) : null,
        item.explanation || null, label, item.sourcePage || null,
        item.sourceQuestionNumber || null, item.answerKeyRef || null, item.questionType || (kind === 'case' ? 'case_study' : 'mcq'),
        itemAnswerStatus, itemSourceSection, itemQuestionFormat, itemDiagramStatus);

    const newId = Number(info.lastInsertRowid);
    insertedIds.push(newId);
    inserted += 1;
    existing.push({ id: newId, normalized_text: normalized, text: item.text, tokens, fingerprint: itemFingerprint });

    if (Array.isArray(item.visuals) && item.visuals.length) {
      const insertVisual = db.prepare(`INSERT INTO visual_assets (question_id, source_file_id, asset_type, figure_label, asset_path, notes) VALUES (?, ?, ?, ?, ?, ?)`);
      for (const v of item.visuals) {
        let assetPath = v.assetPath || null;
        if (!assetPath && v.sourceFileId != null) {
          assetPath = db.prepare('SELECT archive_path FROM source_files WHERE id = ?').get(v.sourceFileId).archive_path;
        }
        insertVisual.run(newId, v.sourceFileId || null, v.assetType || 'source_page_full', v.figureLabel || null, assetPath, v.notes || null);
      }
    }

    if (nearMatch) {
      flaggedNearDuplicates += 1;
      db.prepare(`INSERT INTO duplicate_flags (new_question_uid, existing_question_id, similarity, new_text, existing_text) VALUES (?, ?, ?, ?, ?)`)
        .run(uid, nearMatch.id, Math.round(nearScore * 100) / 100, item.text, nearMatch.text);
    }
  }

  const sourceDocInfo = db.prepare(`INSERT INTO source_documents (label, board, subject_name, chapter_name, ingested_count, skipped_exact_duplicates, flagged_near_duplicates, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(label, board, subjectName, chapterName, inserted, skippedExactDuplicates, flaggedNearDuplicates, status);
  sourceDocumentId = Number(sourceDocInfo.lastInsertRowid);

  // Link this ingestion batch to the physical file(s) it came from, and
  // stamp every question inserted THIS call with a real source_document_id
  // — a formal FK, not the fragile free-text label matching that older
  // rows (ingested before this existed) still rely on. See
  // backfill-provenance-pass2.js for how those older rows were
  // retroactively linked, and PROJECT_PROGRESS.md/SOURCE_LIBRARY.md for
  // the ones that couldn't be resolved unambiguously.
  if (Array.isArray(sourceFileIds)) {
    const linkFile = db.prepare('INSERT OR IGNORE INTO source_document_files (source_document_id, source_file_id) VALUES (?, ?)');
    for (const sfId of sourceFileIds) linkFile.run(sourceDocumentId, sfId);
  }
  if (insertedIds.length) {
    const stampProvenance = db.prepare('UPDATE questions SET source_document_id = ? WHERE id = ?');
    for (const qId of insertedIds) stampProvenance.run(sourceDocumentId, qId);
  }

  db.exec('COMMIT;');
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }

  return {
    subjectId, chapterId, sourceDocumentId, inserted, skippedExactDuplicates, flaggedNearDuplicates, insertedIds,
    reingestOfKnownLabel: isReingestOfKnownLabel
      ? `Warning: label "${label}" was already ingested ${priorBatchesForLabel} time(s) before. This call still ran (exact-duplicate detection protects the bank either way), but if this was meant to be the SAME source re-uploaded by mistake, no new source_documents row should have been needed; if it's a revised/expanded batch from the same document, consider giving it a distinct label (e.g. append a version marker) so the source library can tell the two apart.`
      : null,
  };
}

// The founder's requested "Source Library" report: every batch ever
// ingested, plus a LIVE re-count of how many of its questions are still in
// the bank at each status right now (a question can be promoted from
// 'transcribed' to 'verified' after ingestion — this reflects that, rather
// than freezing the status at ingestion time).
function sourceLibrary() {
  const batches = db.prepare('SELECT * FROM source_documents ORDER BY id').all();
  return batches.map((b) => {
    const liveCounts = db.prepare(`SELECT status, COUNT(*) as n FROM questions WHERE source = ? GROUP BY status`).all(b.label);
    return { ...b, liveStatusBreakdown: Object.fromEntries(liveCounts.map((r) => [r.status, r.n])) };
  });
}

function pendingDuplicateFlags() {
  return db.prepare(`SELECT df.*, q.text as existing_text_current, q.status as existing_status
    FROM duplicate_flags df JOIN questions q ON q.id = df.existing_question_id
    WHERE df.status = 'pending' ORDER BY df.id`).all();
}

function bankSummary() {
  return db.prepare(`
    SELECT s.board, s.name as subject, c.name as chapter, q.status, COUNT(*) as n
    FROM questions q JOIN chapters c ON c.id = q.chapter_id JOIN subjects s ON s.id = c.subject_id
    GROUP BY s.board, s.name, c.name, q.status ORDER BY s.board, s.name, c.name, q.status`).all();
}

module.exports = { ingestQuestions, sourceLibrary, pendingDuplicateFlags, bankSummary, normalize, jaccard, tokenSet, NEAR_DUP_THRESHOLD };
