const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'CBSE', 'Mathematics', 'Statistics');

// Order matches the display order the founder sent them in.
const FILES = [
  { upload: 'ff6c37db-image.jpg', page: '14.22', stable: 'CBSE-MATH-STATS-P1422' },
  { upload: '368df28c-image.jpg', page: '14.21', stable: 'CBSE-MATH-STATS-P1421' },
  { upload: '22041c77-image.jpg', page: '14.20', stable: 'CBSE-MATH-STATS-P1420' },
  { upload: '6d352e3b-image.jpg', page: '14.19', stable: 'CBSE-MATH-STATS-P1419' },
  { upload: 'b4ad10aa-image.jpg', page: '14.18', stable: 'CBSE-MATH-STATS-P1418' },
  { upload: 'b1eb262a-image.jpg', page: '14.17', stable: 'CBSE-MATH-STATS-P1417' },
  { upload: 'a0fe3f46-image.jpg', page: '14.16', stable: 'CBSE-MATH-STATS-P1416' },
  { upload: 'b5b62277-image.jpg', page: '14.16-example28', stable: 'CBSE-MATH-STATS-P1416-EX' },
];

fs.mkdirSync(ARCHIVE_ROOT, { recursive: true });
const ids = [];
for (const f of FILES) {
  const srcPath = path.join(UPLOAD_DIR, f.upload);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(srcPath)).digest('hex');
  const size = fs.statSync(srcPath).size;
  const destName = `page_${f.page}.jpg`;
  const destPath = path.join(ARCHIVE_ROOT, destName);
  fs.copyFileSync(srcPath, destPath);
  const archivePathRel = path.relative(__dirname, destPath);
  const existing = db.prepare('SELECT id FROM source_files WHERE stable_id = ?').get(f.stable);
  let id;
  if (existing) {
    id = existing.id;
  } else {
    const info = db.prepare(`INSERT INTO source_files
      (stable_id, original_filename, upload_ref, board, subject_name, class, source_section, sha256, size_bytes, archive_path, uploaded_at)
      VALUES (?, ?, ?, 'CBSE', 'Mathematics', '10', ?, ?, ?, ?, ?)`)
      .run(f.stable, destName, f.upload, `Statistics practice-exercise MCQs, printed page ${f.page}`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16));
}
console.log('sourceFileIds:', JSON.stringify(ids));
