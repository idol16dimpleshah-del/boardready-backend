// Preserves the eighteenth-through-twenty-second (and FINAL) ICSE Class 10
// History & Civics chapter PDF, uploaded 2026-09-17 ("chap 18-22.pdf" — a
// single 26-page physical file combining FIVE logical textbook chapters:
// "Rise of Dictatorships" (Ch18), "The Second World War" (Ch19), "The
// United Nations (Origin and Purpose)" (Ch20), "The United Nations (Major
// Agencies and their Functions)" (Ch21), and "The Non-Aligned Movement"
// (Ch22)).
//
// The founder's own message accompanying this upload: "icse history ends
// here" — this is the LAST ICSE History & Civics chapter upload under the
// standing instruction ("now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system"). The source book's own content confirms this independently:
// the final scanned page (247) bleeds through with the start of a
// different SUBJECT entirely — "Geography" — not another History chapter.
//
// Same archive-before-ingest pattern as chap_11-13.pdf and chap_14-17.pdf
// before it: one physical file spanning multiple chapters gets ONE
// source_files row, and all five of this file's ingest scripts point at
// this same source_files.id.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'ICSE', 'History and Civics');

const FILES = [
  { upload: 'a9deb106-chap_18-22.pdf', chapter: 'Chapters 18-22 (FINAL): Rise of Dictatorships / The Second World War / The United Nations (Origin and Purpose) / The United Nations (Major Agencies and their Functions) / The Non-Aligned Movement', stable: 'ICSE-HISTCIVICS-CH18-22-COMBINED-FINAL', destName: 'ch18-22-dictatorships-wwii-un-nam-final.pdf' },
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
      .run(f.stable, f.destName, f.upload, `${f.chapter} — combined 26-page practice-exercise PDF covering five chapters (MCQs, with printed explanations) — the final upload for this subject`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16), f.chapter);
}
console.log('sourceFileIds:', JSON.stringify(ids));
