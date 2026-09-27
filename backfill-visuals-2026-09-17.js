// Backfills diagram_status/visual_assets for the three chapters ingested
// EARLIER in this same session (Probability, Statistics, Surface Areas and
// Volumes), before the visual-preservation pipeline (visual_assets table,
// ingest.js's diagramStatus/visuals support) existed. Founder requirement
// 2026-09-17: "a question is NOT considered completely captured if its
// associated diagram/visual is missing" — this closes that gap for these
// three chapters using the same source pages already permanently archived,
// re-checked against the actual transcription work done for each chapter.
//
// Default for every row in these three chapters: 'not_applicable' (plain
// text MCQs/AR items with no figure — Probability has none at all;
// Statistics/Surface-Areas plain numeric MCQs have none). Then the specific
// case-study/figure items are individually corrected to
// 'source_diagram_preserved' with their real source page(s) linked.
const db = require('./db');

db.exec('BEGIN TRANSACTION;');
try {
  const defaulted = db.prepare(`UPDATE questions SET diagram_status = 'not_applicable' WHERE chapter_id IN (33,34,35) AND diagram_status = 'needs_visual_review'`).run();
  console.log('Defaulted to not_applicable:', defaulted.changes, 'rows (chapters 33/34/35)');

  const insertVisual = db.prepare(`INSERT INTO visual_assets (question_id, source_file_id, asset_type, figure_label, asset_path, notes) VALUES (?, ?, 'source_page_full', ?, (SELECT archive_path FROM source_files WHERE id = ?), ?)`);
  const markPreserved = db.prepare(`UPDATE questions SET diagram_status = 'source_diagram_preserved' WHERE id = ?`);

  const NOTE = 'Backfilled 2026-09-17 after the visual-preservation pipeline was built, following the founder\'s "preserve every source diagram" requirement — the figure was already in the permanently archived full source page, just not yet formally linked to this specific question row.';

  // Statistics (chapter_id 34) — case-study items with a source-printed Fig./table-image.
  const statsFigures = [
    { qNum: '51', figureLabel: 'Fig. 14.6 (100m race time-interval frequency table)', sourceFileIds: [51, 50] }, // pages 14.19, 14.20
    { qNum: '52', figureLabel: 'Fig. 14.7 (wrestling championship weight frequency table)', sourceFileIds: [50] }, // page 14.20
    { qNum: '53', figureLabel: 'Fig. 14.8 (medical checkup "less than" cumulative frequency table)', sourceFileIds: [50, 49] }, // pages 14.20-14.21
    { qNum: '54', figureLabel: 'Fig. 14.9 (100m race time-interval frequency table)', sourceFileIds: [49] }, // page 14.21
  ];
  for (const f of statsFigures) {
    const q = db.prepare(`SELECT id FROM questions WHERE chapter_id = 34 AND source_question_number = ?`).get(f.qNum);
    if (!q) { console.log('MISSING Statistics item', f.qNum); continue; }
    for (const sfId of f.sourceFileIds) insertVisual.run(q.id, sfId, f.figureLabel, sfId, NOTE);
    markPreserved.run(q.id);
    console.log('Statistics item', f.qNum, '-> question', q.id, 'linked to source_files', f.sourceFileIds);
  }

  // Surface Areas and Volumes (chapter_id 35) — case studies + the Fig.13.27 AR item.
  const savFigures = [
    { qNum: '43', figureLabel: 'Fig. 13.22 (stepped victory stand solid)', sourceFileIds: [59, 60] }, // pages 13.18-13.19
    { qNum: '44', figureLabel: 'Fig. 13.23 (Atal Tunnel circular cross-section)', sourceFileIds: [60] }, // page 13.19
    { qNum: '45', figureLabel: 'Fig. 13.24 (hemispherical-bowl-on-cylinder vessel)', sourceFileIds: [60, 61] }, // pages 13.19-13.20
    { qNum: '46', figureLabel: 'Fig. 13.25 (cuboid pen stand with conical depressions)', sourceFileIds: [61] }, // page 13.20
    { qNum: '47', figureLabel: 'Fig. 13.26 (circus tent, cylinder + cone)', sourceFileIds: [61] }, // page 13.20
    { qNum: '54', figureLabel: 'Fig. 13.27 (toy: hemisphere surmounted by cone)', sourceFileIds: [62, 63] }, // pages 13.21-13.22
  ];
  for (const f of savFigures) {
    const q = db.prepare(`SELECT id FROM questions WHERE chapter_id = 35 AND source_question_number = ? AND kind != 'mcq'`).get(f.qNum);
    // item 54 is an AR (kind='mcq'), items 43/44/45/46/47 are case studies (kind='case'/'open') — handle both.
    const qRow = q || db.prepare(`SELECT id FROM questions WHERE chapter_id = 35 AND source_question_number = ?`).get(f.qNum);
    if (!qRow) { console.log('MISSING Surface Areas item', f.qNum); continue; }
    for (const sfId of f.sourceFileIds) insertVisual.run(qRow.id, sfId, f.figureLabel, sfId, NOTE);
    markPreserved.run(qRow.id);
    console.log('Surface Areas item', f.qNum, '-> question', qRow.id, 'linked to source_files', f.sourceFileIds);
  }

  db.exec('COMMIT;');
} catch (err) {
  db.exec('ROLLBACK;');
  throw err;
}

const summary = db.prepare(`SELECT chapter_id, diagram_status, COUNT(*) n FROM questions WHERE chapter_id IN (33,34,35) GROUP BY chapter_id, diagram_status ORDER BY chapter_id`).all();
console.log('Final diagram_status breakdown:', summary);
