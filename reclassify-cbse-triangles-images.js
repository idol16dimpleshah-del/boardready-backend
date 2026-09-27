// Reclassifies the 5 pending-placeholder Triangles pages (source_files ids
// 64-68, provisionally archived by archive-pending-batch-2026-09-17.js
// straight into source_library/CBSE/_pending_classification_2026-09-17/
// before any transcription happened) into a proper, permanent, chapter-
// specific location and stable_id — now that each file has been
// individually re-opened and confirmed. Moves the physical file (git mv
// semantics: copy to new home, remove old), matching the correction
// pattern used for the Statistics page-mislabeling earlier in this
// project. The row's `id` and its underlying sha256/size are unchanged —
// only stable_id, original_filename, source_section and archive_path are
// corrected.
const fs = require('fs');
const path = require('path');
const db = require('./db');

const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'CBSE', 'Mathematics', 'Triangles');
fs.mkdirSync(ARCHIVE_ROOT, { recursive: true });

const RENAMES = [
  { id: 64, page: '7.16', stable: 'CBSE-MATH-TRI-P716' },
  { id: 65, page: '7.17', stable: 'CBSE-MATH-TRI-P717' },
  { id: 66, page: '7.18', stable: 'CBSE-MATH-TRI-P718' },
  { id: 67, page: '7.19', stable: 'CBSE-MATH-TRI-P719' },
  { id: 68, page: '7.20', stable: 'CBSE-MATH-TRI-P720' },
];

for (const r of RENAMES) {
  const row = db.prepare('SELECT * FROM source_files WHERE id = ?').get(r.id);
  if (!row) { console.log('MISSING id', r.id); continue; }
  const oldAbs = path.join(__dirname, row.archive_path);
  const destName = `page_${r.page}.jpg`;
  const destAbs = path.join(ARCHIVE_ROOT, destName);
  fs.copyFileSync(oldAbs, destAbs);
  fs.unlinkSync(oldAbs);
  const newArchivePathRel = path.relative(__dirname, destAbs);
  db.prepare(`UPDATE source_files SET stable_id=?, original_filename=?, source_section=?, archive_path=?, notes=? WHERE id=?`)
    .run(
      r.stable,
      destName,
      `Triangles practice-exercise MCQs, printed page ${r.page}`,
      newArchivePathRel,
      'Reclassified from provisional PENDING-* placeholder after individual re-read confirmed exact page content (see PROJECT_PROGRESS.md 2026-09-17 pending-batch note).',
      r.id
    );
  console.log('id', r.id, '->', r.stable, newArchivePathRel);
}
