// Preserves the eleventh-through-thirteenth ICSE Class 10 History & Civics
// chapter PDF, uploaded 2026-09-17 ("chap 11-13.pdf" — a single 19-page
// physical file combining THREE logical textbook chapters: "The Partition
// of Bengal" (Ch11), "Formation and Objectives of the Muslim League"
// (Ch12), and "Mahatma Gandhi and Popular National Movement" (Ch13)).
//
// Unlike every prior chapter (one physical PDF = one chapter), this upload
// is one physical file spanning three chapters — the archive-before-ingest
// rule cares about the PHYSICAL uploaded file, so this registers ONE
// source_files row for the file as actually uploaded (never split into
// three synthetic files that wouldn't match what was actually received),
// and all three of this file's ingest scripts point at this same
// source_files.id.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'ICSE', 'History and Civics');

const FILES = [
  { upload: '17e97062-chap_11-13.pdf', chapter: 'Chapters 11-13: The Partition of Bengal / Formation and Objectives of the Muslim League / Mahatma Gandhi and Popular National Movement', stable: 'ICSE-HISTCIVICS-CH11-13-COMBINED', destName: 'ch11-13-partition-bengal-muslim-league-gandhi-popular-movement.pdf' },
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
      .run(f.stable, f.destName, f.upload, `${f.chapter} — combined 19-page practice-exercise PDF covering three chapters (MCQs, with printed explanations)`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16), f.chapter);
}
console.log('sourceFileIds:', JSON.stringify(ids));
