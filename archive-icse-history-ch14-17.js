// Preserves the fourteenth-through-seventeenth ICSE Class 10 History &
// Civics chapter PDF, uploaded 2026-09-17 ("chap 14-17.pdf" — a single
// 20-page physical file combining FOUR logical textbook chapters: "Events
// Leading to the Quit India Movement (1935-1943)" (Ch14), "Subhash Chandra
// Bose and the Indian National Army (INA)" (Ch15), "Towards Partition of
// India (1944-1947)" (Ch16), and "World War-I and Treaty of Versailles"
// (Ch17)).
//
// Like chap_11-13.pdf before it, this upload is one physical file spanning
// multiple chapters — the archive-before-ingest rule cares about the
// PHYSICAL uploaded file, so this registers ONE source_files row for the
// file as actually uploaded (never split into four synthetic files that
// wouldn't match what was actually received), and all four of this file's
// ingest scripts point at this same source_files.id.
//
// STRUCTURAL NOTE: Chapter 17 ("World War-I and Treaty of Versailles")
// marks this subject's first departure from India-focused history into
// World History — consistent with the ICSE Class 10 History & Civics
// syllabus's later chapters. The final scanned page (221) bleeds through
// with the faint start of the NEXT chapter, "Rise of Dictatorships" —
// that content belongs to a FUTURE upload and is not ingested here.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'ICSE', 'History and Civics');

const FILES = [
  { upload: '1e5e2685-chap_14-17.pdf', chapter: 'Chapters 14-17: Events Leading to the Quit India Movement (1935-1943) / Subhash Chandra Bose and the Indian National Army (INA) / Towards Partition of India (1944-1947) / World War-I and Treaty of Versailles', stable: 'ICSE-HISTCIVICS-CH14-17-COMBINED', destName: 'ch14-17-quit-india-ina-partition-wwi-versailles.pdf' },
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
      .run(f.stable, f.destName, f.upload, `${f.chapter} — combined 20-page practice-exercise PDF covering four chapters (MCQs, with printed explanations)`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16), f.chapter);
}
console.log('sourceFileIds:', JSON.stringify(ids));
