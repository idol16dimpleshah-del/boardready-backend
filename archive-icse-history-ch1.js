// Preserves the first ICSE Class 10 History & Civics chapter PDF, uploaded
// 2026-09-17 ("chap 1.pdf" — "The Union Parliament"). The founder has said
// History chapters will keep coming one at a time; this script's pattern
// (and its ingest sibling ingest-icse-history-ch01-union-parliament.js) is
// the template to repeat for each subsequent upload, per the same
// archive-before-ingest discipline used for every other subject/board in
// this project.
//
// Source book: "ICSE Chapterwise MCQs & Objective Series — History & Civics
// - X" (Chapter 1, printed pages 118-124), 40 MCQ items each with a printed
// explanation, plus one Assertion-Reason item (#15) embedded in the same
// numbered sequence rather than a separate section.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'ICSE', 'History and Civics');

const FILES = [
  { upload: 'c381d8cc-chap_1.pdf', chapter: 'The Union Parliament', stable: 'ICSE-HISTCIVICS-CH01-UNIONPARL', destName: 'ch01-the-union-parliament.pdf' },
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
      .run(f.stable, f.destName, f.upload, `${f.chapter} — full chapter practice-exercise PDF (MCQs + 1 Assertion-Reason, with printed explanations)`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16), f.chapter);
}
console.log('sourceFileIds:', JSON.stringify(ids));
