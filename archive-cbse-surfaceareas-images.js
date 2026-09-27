const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'CBSE', 'Mathematics', 'SurfaceAreasAndVolumes');

const FILES = [
  { upload: 'f7056b9f-image.jpg', page: '13.15', stable: 'CBSE-MATH-SAV-P1315' },
  { upload: '246dea10-image.jpg', page: '13.16', stable: 'CBSE-MATH-SAV-P1316' },
  { upload: '334f3a51-image.jpg', page: '13.17', stable: 'CBSE-MATH-SAV-P1317' },
  { upload: 'ddef4ce0-image.jpg', page: '13.18', stable: 'CBSE-MATH-SAV-P1318' },
  { upload: '80230472-image.jpg', page: '13.19', stable: 'CBSE-MATH-SAV-P1319' },
  { upload: 'c5cd0a50-image.jpg', page: '13.20', stable: 'CBSE-MATH-SAV-P1320' },
  { upload: '56e010ca-image.jpg', page: '13.21', stable: 'CBSE-MATH-SAV-P1321' },
  { upload: '5819c46f-image.jpg', page: '13.22', stable: 'CBSE-MATH-SAV-P1322' },
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
      .run(f.stable, destName, f.upload, `Surface Areas and Volumes practice-exercise MCQs, printed page ${f.page}`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16));
}
console.log('sourceFileIds:', JSON.stringify(ids));
