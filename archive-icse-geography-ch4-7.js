// Preserves the FIRST ICSE Class 10 Geography chapter PDF uploaded to this
// project, 2026-09-17 ("chap 4-7.pdf" — a single 21-page physical file
// combining FOUR logical textbook chapters: "Climate of India" (Ch4),
// "Soil Resources" (Ch5), "Natural Vegetation of India" (Ch6), and "Water
// Resources" (Ch7)).
//
// This is a NEW SUBJECT for this project (ICSE Geography), started
// immediately after ICSE History & Civics was completed (see that
// subject's PROJECT_PROGRESS.md section — the founder's "icse history
// ends here" message). The founder's own message accompanying this
// upload: "icse geography chapter 4-7 starting three chapters are on
// topography which we willl do later" — meaning Chapters 1-3 of this
// Geography book (on Topography) are being deliberately deferred and will
// be uploaded in a future session; this upload starts directly at Chapter
// 4. The book's own page numbering (248 onward) confirms Chapters 1-3
// occupy pages 1-247 of this same book, not yet uploaded.
//
// Same archive-before-ingest pattern as every other multi-chapter combined
// upload in this project: one physical file spanning multiple chapters
// gets ONE source_files row, and all four of this file's ingest scripts
// point at this same source_files.id. The final scanned page (268) bleeds
// through with the start of the NEXT chapter, "Mineral Resources"
// (Chapter 8) — too little content to ingest now, noted for the next
// upload.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'ICSE', 'Geography');

const FILES = [
  { upload: '98cf11bf-chap_4-7.pdf', chapter: 'Chapters 4-7: Climate of India / Soil Resources / Natural Vegetation of India / Water Resources', stable: 'ICSE-GEOGRAPHY-CH4-7-COMBINED', destName: 'ch4-7-climate-soil-vegetation-water.pdf' },
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
      .run(f.stable, f.destName, f.upload, `${f.chapter} — combined 21-page practice-exercise PDF covering four chapters (MCQs, with printed explanations) — first upload for this subject`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16), f.chapter);
}
console.log('sourceFileIds:', JSON.stringify(ids));
