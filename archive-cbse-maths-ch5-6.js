// Preserves a newly-uploaded CBSE Class 10 Mathematics PDF, 2026-09-17
// ("chap_5-6.pdf" — founder's message: "chap 5-6 make sure you add names
// and than the question, coz in some books the chapters are shuffled so
// accordingly prepare ir properly"), arrived mid-turn while the pending
// 27-photo CBSE backlog was being transcribed.
// Per the standing "archive before ingestion" rule, this file is archived
// FIRST, immediately on receipt, before any transcription work starts on
// it, so the original can never be lost to a session interruption.
// The founder's added instruction — confirm each chapter's REAL name/
// topic before treating "chapter 5-6" as gospel, since different print
// editions shuffle chapter order/numbering — will be carried out when
// this file's actual pages are opened and read, not assumed from the
// filename. Recorded here as an explicit note so the requirement isn't
// lost if the session is interrupted before that read happens.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'CBSE', 'Mathematics');

const FILES = [
  { upload: '7a1dcf66-chap_5-6.pdf', chapter: 'Chapters 5-6 (CBSE Class 10 Mathematics, filename-labeled — real chapter identity/name NOT yet confirmed)', stable: 'CBSE-MATH-CH5-6-COMBINED', destName: 'ch5-6.pdf' },
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
      VALUES (?, ?, ?, 'CBSE', 'Mathematics', '10', ?, ?, ?, ?, ?)`)
      .run(f.stable, f.destName, f.upload, `${f.chapter} — UNCONFIRMED chapter identity/content pending page-by-page review (archived on receipt per standing rule, before transcription). Founder explicitly flagged 2026-09-17: some print editions shuffle chapter numbering, so the real chapter NAME/topic must be confirmed by reading the pages, not assumed from the "5-6" filename.`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16), f.chapter);
}
console.log('sourceFileIds:', JSON.stringify(ids));
