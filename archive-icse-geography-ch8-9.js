// Preserves the SECOND ICSE Class 10 Geography chapter PDF uploaded to
// this project, 2026-09-17 ("chap 8-9.pdf" — a single 15-page physical
// file combining TWO logical textbook chapters: "Mineral and Energy
// Resources" (Ch8) and "Agriculture in India" (Ch9)).
//
// Continues directly on from chap_4-7.pdf (source_files.id 115), which
// covered Chapters 4-7 of this same Geography book; Chapters 1-3
// (Topography) remain deliberately deferred per the founder's earlier
// message. Same archive-before-ingest pattern: one physical file spanning
// multiple chapters gets ONE source_files row, and both of this file's
// ingest scripts point at this same source_files.id. The final scanned
// page (283) bleeds through with the start of the next chapter,
// "Agro Based Industries" (Chapter 10) — too little content to ingest
// now, noted for the next upload.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'ICSE', 'Geography');

const FILES = [
  { upload: '6c153b19-chap_8-9.pdf', chapter: 'Chapters 8-9: Mineral and Energy Resources / Agriculture in India', stable: 'ICSE-GEOGRAPHY-CH8-9-COMBINED', destName: 'ch8-9-mineral-energy-agriculture.pdf' },
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
      VALUES (?, ?, ?, 'ICSE', 'Geography', '10', ?, ?, ?, ?, ?)`)
      .run(f.stable, f.destName, f.upload, `${f.chapter} — combined 15-page practice-exercise PDF covering two chapters (MCQs, with printed explanations) — second upload for this subject`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16), f.chapter);
}
console.log('sourceFileIds:', JSON.stringify(ids));
