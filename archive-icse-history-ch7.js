// Preserves the seventh ICSE Class 10 History & Civics chapter PDF, uploaded
// 2026-09-17 ("chap 7.pdf" — "First War of Independence: 1857"). Same
// archive-before-ingest pattern as the ch1-ch6 sibling scripts. This is the
// first chapter of the History (as opposed to Civics/polity) portion of the
// syllabus — Chapters 1-6 covered the Union Parliament, Executives, PM &
// Council of Ministers, Union Judiciary, State Judiciary (High Courts and
// Subordinate Courts); Chapter 7 onward covers 19th/20th-century Indian
// history.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'ICSE', 'History and Civics');

const FILES = [
  { upload: '90c32fd4-chap_7.pdf', chapter: 'First War of Independence: 1857', stable: 'ICSE-HISTCIVICS-CH07-1857', destName: 'ch07-first-war-of-independence-1857.pdf' },
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
