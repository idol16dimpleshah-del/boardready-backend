// Preserves the THIRD ICSE Class 10 Geography chapter PDF uploaded to
// this project, 2026-09-17 ("chap_10-13.pdf" — a single 26-page physical
// file combining FOUR logical textbook chapters: "Industries in India:
// Agro Based Industries" (Ch10), "Industries in India: Mineral based
// Industries" (Ch11), "Transport in India" (Ch12), and "Waste Generation
// and Management" (Ch13)).
//
// Continues directly on from chap_8-9.pdf (source_files.id 116), which
// covered Chapters 8-9 of this same Geography book; Chapters 1-3
// (Topography) remain deliberately deferred per the founder's earlier
// message. The founder's accompanying message, "here geography ends for
// now", signals this is the final Geography upload for the time being —
// documented in PROJECT_PROGRESS.md as a pause, not a subject completion,
// since Chapters 1-3 are still outstanding. Same archive-before-ingest
// pattern: one physical file spanning multiple chapters gets ONE
// source_files row, and all four of this file's ingest scripts point at
// this same source_files.id. The PDF ends cleanly at the close of Chapter
// 13 (book page 309, marked with the printed "end of chapter" glyph) —
// no further chapter content bleeds through.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'ICSE', 'Geography');

const FILES = [
  { upload: '3c4ce5f7-chap_10-13.pdf', chapter: 'Chapters 10-13: Agro Based Industries / Mineral based Industries / Transport in India / Waste Generation and Management', stable: 'ICSE-GEOGRAPHY-CH10-13-COMBINED', destName: 'ch10-13-industries-transport-waste.pdf' },
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
      .run(f.stable, f.destName, f.upload, `${f.chapter} — combined 26-page practice-exercise PDF covering four chapters (MCQs, with printed explanations) — third upload for this subject, final for now per founder's "here geography ends for now"`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16), f.chapter);
}
console.log('sourceFileIds:', JSON.stringify(ids));
