// Preserves the fourth ICSE Class 10 History & Civics chapter PDF, uploaded
// 2026-09-17 ("chap 4.pdf" — "The Union Judiciary (The Supreme Court)"). Same
// archive-before-ingest pattern as the ch1/ch2/ch3 sibling scripts — repeat
// for each subsequent chapter the founder uploads.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'ICSE', 'History and Civics');

const FILES = [
  { upload: '7d3c284a-chap_4.pdf', chapter: 'The Union Judiciary (The Supreme Court)', stable: 'ICSE-HISTCIVICS-CH04-JUDICIARY', destName: 'ch04-the-union-judiciary-the-supreme-court.pdf' },
];

fs.mkdirSync(ARCHIVE_ROOT, { recursive: true });
const ids = [];
for (const f of FILES) {
  const srcPath = path.join(UPLOAD_DIR, f.upload);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(srcPath)).digest('hex');
  const size = fs.statSync(srcPath).size;
  const destPath = path.join(ARCHIVE_ROOT, f.destName);
  fs.copyFileSync(srcPath, destPath);
  const archivePathRel = path.relative(__dirname, destPath);
  const existing = db.prepare('SELECT id FROM source_files WHERE stable_id = ?').get(f.stable);
  let id;
  if (existing) {
    id = existing.id;
  } else {
    const info = db.prepare(`INSERT INTO source_files
      (stable_id, original_filename, upload_ref, board, subject_name, class, source_section, sha256, size_bytes, archive_path, uploaded_at)
      VALUES (?, ?, ?, 'ICSE', 'History and Civics', '10', ?, ?, ?, ?, ?)`)
      .run(f.stable, f.destName, f.upload, `${f.chapter} — full chapter practice-exercise PDF (MCQs, with printed explanations)`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16), f.chapter);
}
console.log('sourceFileIds:', JSON.stringify(ids));
