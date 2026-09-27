const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'CBSE', 'Mathematics', 'Probability');

// Order matches the display order the founder sent them in.
const FILES = [
  { upload: 'fdc48260-image.jpg', page: '15.24', stable: 'CBSE-MATH-PROB-P1524' },
  { upload: '7c44f7bb-image.jpg', page: '15.23', stable: 'CBSE-MATH-PROB-P1523' },
  { upload: '0b0897f2-image.jpg', page: '15.20', stable: 'CBSE-MATH-PROB-P1520' },
  { upload: '62cf3edf-image.jpg', page: '15.21', stable: 'CBSE-MATH-PROB-P1521' },
  { upload: 'c96c3c2c-image.jpg', page: '15.22', stable: 'CBSE-MATH-PROB-P1522' },
  { upload: '94358276-image.jpg', page: '15.19', stable: 'CBSE-MATH-PROB-P1519' },
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
      .run(f.stable, destName, f.upload, `Probability practice-exercise MCQs, printed page ${f.page}`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16));
}
console.log('sourceFileIds:', JSON.stringify(ids));
