// Preserves the 6 new ICSE Class 10 Mathematics chapter PDFs uploaded
// 2026-09-17 ("Icse chap 1-6") — GST, Banking, Shares and Dividend, Linear
// Inequation, Quadratic Equation, Problems on Quadratic Equations. These
// are exactly the ICSE Maths chapters RECOVERY_AUDIT.md (an earlier
// session) found "existence only, no recoverable content" for — this
// upload appears to be the founder re-supplying that missing material.
// Archived BEFORE any transcription/ingestion, per the standing rule.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'ICSE', 'Mathematics');

const FILES = [
  { upload: 'b3062b6f-chap_1.pdf', chapter: 'GST (Goods and Service Tax)', stable: 'ICSE-MATH-CH01-GST', destName: 'ch01-gst.pdf' },
  { upload: '426e719b-chap_2.pdf', chapter: 'Banking (Recurring Deposit Accounts)', stable: 'ICSE-MATH-CH02-BANKING', destName: 'ch02-banking.pdf' },
  { upload: '1f868462-chap_3.pdf', chapter: 'Shares and Dividend', stable: 'ICSE-MATH-CH03-SHARES', destName: 'ch03-shares-and-dividend.pdf' },
  { upload: '47e8dc03-chap_4.pdf', chapter: 'Linear Inequation', stable: 'ICSE-MATH-CH04-LININEQ', destName: 'ch04-linear-inequation.pdf' },
  { upload: 'dc19b0b8-chap_5.pdf', chapter: 'Quadratic Equation', stable: 'ICSE-MATH-CH05-QUADEQ', destName: 'ch05-quadratic-equation.pdf' },
  { upload: 'd4e5d08f-chap_6.pdf', chapter: 'Problems on Quadratic Equations', stable: 'ICSE-MATH-CH06-QUADPROB', destName: 'ch06-problems-on-quadratic-equations.pdf' },
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
      VALUES (?, ?, ?, 'ICSE', 'Mathematics', '10', ?, ?, ?, ?, ?)`)
      .run(f.stable, f.destName, f.upload, `${f.chapter} — full chapter practice-exercise PDF (MCQs + Assertion-Reason)`, hash, size, archivePathRel, null);
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(f.stable, '-> source_files.id', id, hash.slice(0, 16), f.chapter);
}
console.log('sourceFileIds:', JSON.stringify(ids));
