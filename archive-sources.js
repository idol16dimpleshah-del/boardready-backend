// One-off (idempotent) script: archive every currently-known original
// source PDF into the project's own persistent source_library/ directory,
// register it in source_files with a stable_id + sha256, link it to the
// source_documents ingestion-batch rows that used it, and best-effort
// backfill questions.source_document_id from the existing free-text
// questions.source column.
//
// Safe to re-run: uses INSERT OR IGNORE on stable_id and skips a file copy
// if the destination already exists with the same hash. Never deletes or
// modifies the original files at UPLOAD_DIR.
//
// Per the founder's 2026-09-17 instruction: this is the "Preserve
// original → Register source" half of the required
// upload → preserve → register → ingest → QA workflow, run retroactively
// for the 41 files already ingested this project.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library');

// Manually verified mapping (content-checked where filenames collided
// across subjects — see RECOVERY note in PROJECT_PROGRESS.md /
// SOURCE_LIBRARY.md for how chap_8.pdf / chap_9.pdf were disambiguated
// by pdftotext content, not filename, since both Maths and Chemistry have
// a chap_8.pdf and chap_9.pdf under different random upload hashes).
const FILES = [
  // --- ICSE Mathematics (19 files: Chapters 7-24 + the shared answer key) ---
  { upload: 'aa93dc72-chap_7.pdf', subject: 'Mathematics', chapter: 'Proportion', stable: 'ICSE-MATH-CH07' },
  { upload: 'e4485e44-chap_8.pdf', subject: 'Mathematics', chapter: 'Remainder and Factor Theorem', stable: 'ICSE-MATH-CH08' },
  { upload: '1bd7b2a9-chap_9.pdf', subject: 'Mathematics', chapter: 'Matrices', stable: 'ICSE-MATH-CH09' },
  { upload: 'fb4e296a-chap_10.pdf', subject: 'Mathematics', chapter: 'Arithmetic Progression', stable: 'ICSE-MATH-CH10' },
  { upload: '0a3c2267-chap_11.pdf', subject: 'Mathematics', chapter: 'Geometric Progression', stable: 'ICSE-MATH-CH11' },
  { upload: 'c41ba5c4-chap_12.pdf', subject: 'Mathematics', chapter: 'Reflection', stable: 'ICSE-MATH-CH12' },
  { upload: '0b54e788-chap_13.pdf', subject: 'Mathematics', chapter: 'Section and Midpoint Formula', stable: 'ICSE-MATH-CH13' },
  { upload: '31228a4e-chap_14.pdf', subject: 'Mathematics', chapter: 'Equation of Straight Line', stable: 'ICSE-MATH-CH14' },
  { upload: '809c6678-chap_15.pdf', subject: 'Mathematics', chapter: 'Similarity as a Size Transformation', stable: 'ICSE-MATH-CH15' },
  { upload: '1cf76259-chap_16.pdf', subject: 'Mathematics', chapter: 'Similarity of Triangles', stable: 'ICSE-MATH-CH16' },
  { upload: '1dee5a9e-chap_17.pdf', subject: 'Mathematics', chapter: 'Angle and Cyclic Properties of Circle', stable: 'ICSE-MATH-CH17' },
  { upload: 'ad797301-chap_18.pdf', subject: 'Mathematics', chapter: 'Tangent Properties of Circle', stable: 'ICSE-MATH-CH18' },
  { upload: '8c352f1c-chap_19.pdf', subject: 'Mathematics', chapter: 'Locus and Construction', stable: 'ICSE-MATH-CH19' },
  { upload: '72722bb0-chap_20.pdf', subject: 'Mathematics', chapter: 'Volume and Surface Area of Solid', stable: 'ICSE-MATH-CH20' },
  { upload: '980e60b0-chap_21.pdf', subject: 'Mathematics', chapter: 'Trigonometry', stable: 'ICSE-MATH-CH21' },
  { upload: '14093709-chap_22.pdf', subject: 'Mathematics', chapter: 'Heights and Distances', stable: 'ICSE-MATH-CH22' },
  { upload: 'b40c5f9b-chap_23.pdf', subject: 'Mathematics', chapter: 'Statistics', stable: 'ICSE-MATH-CH23' },
  { upload: '4cd9e3d6-chap_24.pdf', subject: 'Mathematics', chapter: 'Probability', stable: 'ICSE-MATH-CH24' },
  { upload: 'eb575cba-answer.pdf', subject: 'Mathematics', chapter: 'Statistics/Probability answer key', stable: 'ICSE-MATH-ANSWERKEY' },

  // --- ICSE Chemistry (22 files: Section A chapters 1-9 + Section B charts + Section C competency) ---
  { upload: 'ad78c86c-chap_1.pdf', subject: 'Chemistry', chapter: 'Periodic Table', stable: 'ICSE-CHEM-CH01' },
  { upload: '61837dcd-chap_2.pdf', subject: 'Chemistry', chapter: 'Chemical Bonding', stable: 'ICSE-CHEM-CH02' },
  { upload: '8831bcb4-chap_3A.pdf', subject: 'Chemistry', chapter: 'Acids, Bases and Salts (Part A)', stable: 'ICSE-CHEM-CH03A' },
  { upload: '30b2d052-chap_3B.pdf', subject: 'Chemistry', chapter: 'Acids, Bases and Salts (Part B)', stable: 'ICSE-CHEM-CH03B' },
  { upload: '355483c6-chap_4A.pdf', subject: 'Chemistry', chapter: 'Mole Concept & Stoichiometry (Part A)', stable: 'ICSE-CHEM-CH04A' },
  { upload: '90aa8143-chap_4B.pdf', subject: 'Chemistry', chapter: 'Mole Concept & Stoichiometry (Part B)', stable: 'ICSE-CHEM-CH04B' },
  { upload: '512c314f-chap_5.pdf', subject: 'Chemistry', chapter: 'Electrolysis', stable: 'ICSE-CHEM-CH05' },
  { upload: 'a1dda052-chap_6.pdf', subject: 'Chemistry', chapter: 'Metallurgy', stable: 'ICSE-CHEM-CH06' },
  { upload: '572327a7-chap_7A.pdf', subject: 'Chemistry', chapter: 'Study of Compounds (Part A)', stable: 'ICSE-CHEM-CH07A' },
  { upload: '716c6e27-chap_7B.pdf', subject: 'Chemistry', chapter: 'Study of Compounds (Part B)', stable: 'ICSE-CHEM-CH07B' },
  { upload: 'c883b8e8-chap_7C.pdf', subject: 'Chemistry', chapter: 'Study of Compounds (Part C)', stable: 'ICSE-CHEM-CH07C' },
  { upload: '51df2fd0-chap_7D.pdf', subject: 'Chemistry', chapter: 'Study of Compounds (Part D)', stable: 'ICSE-CHEM-CH07D' },
  { upload: 'abcbea5b-chap_8.pdf', subject: 'Chemistry', chapter: 'Organic Chemistry', stable: 'ICSE-CHEM-CH08' },
  { upload: 'ebec4a2b-chap_9.pdf', subject: 'Chemistry', chapter: 'Practical Chemistry', stable: 'ICSE-CHEM-CH09' },
  { upload: 'ede2c9ad-chart_1_additional_chapter_wise.pdf', subject: 'Chemistry', chapter: 'Section B — Chart 1 (Additional Chapterwise Questions)', stable: 'ICSE-CHEM-CHART1-Q' },
  { upload: '53df3afd-chart_1_answer.pdf', subject: 'Chemistry', chapter: 'Section B — Chart 1 answer key', stable: 'ICSE-CHEM-CHART1-A' },
  { upload: 'a1ee5276-chart_2_equation.pdf', subject: 'Chemistry', chapter: 'Section B — Chart 2 (Equation Worksheet)', stable: 'ICSE-CHEM-CHART2-Q' },
  { upload: '729003a2-chart_3_critical.pdf', subject: 'Chemistry', chapter: 'Section B — Chart 3 (Additional Critical Thinking Questions)', stable: 'ICSE-CHEM-CHART3-Q' },
  { upload: 'e9f12d6f-chart_234_answer.pdf', subject: 'Chemistry', chapter: 'Section B — Charts 2/3/4 answer key', stable: 'ICSE-CHEM-CHART234-A' },
  { upload: 'd64d30c3-chart_4.pdf', subject: 'Chemistry', chapter: 'Section B — Chart 4 (Board Type Critical Thinking Questions)', stable: 'ICSE-CHEM-CHART4-Q' },
  { upload: '2e64f5bd-competency.pdf', subject: 'Chemistry', chapter: 'Section C — Competency Focused Questions', stable: 'ICSE-CHEM-COMPETENCY-Q' },
  { upload: '1c4776c2-competency_answer.pdf', subject: 'Chemistry', chapter: 'Section C — Competency answer key', stable: 'ICSE-CHEM-COMPETENCY-A' },
];

function sha256(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buf).digest('hex');
}

const results = [];
for (const f of FILES) {
  const srcPath = path.join(UPLOAD_DIR, f.upload);
  if (!fs.existsSync(srcPath)) {
    results.push({ ...f, status: 'MISSING_AT_SOURCE' });
    continue;
  }
  const hash = sha256(srcPath);
  const size = fs.statSync(srcPath).size;
  // strip the random 8-hex-char upload prefix for a human-readable archived name
  const cleanName = f.upload.replace(/^[0-9a-f]{8}-/, '');
  const destDir = path.join(ARCHIVE_ROOT, 'ICSE', f.subject);
  fs.mkdirSync(destDir, { recursive: true });
  const destPath = path.join(destDir, cleanName);
  const archivePathRel = path.relative(__dirname, destPath);

  if (!fs.existsSync(destPath)) {
    fs.copyFileSync(srcPath, destPath);
  } else {
    const existingHash = sha256(destPath);
    if (existingHash !== hash) {
      results.push({ ...f, status: 'HASH_MISMATCH_ON_REARCHIVE — did not overwrite' });
      continue;
    }
  }

  const existing = db.prepare('SELECT id, sha256 FROM source_files WHERE stable_id = ?').get(f.stable);
  let sourceFileId;
  if (existing) {
    sourceFileId = existing.id;
    if (existing.sha256 !== hash) {
      results.push({ ...f, status: 'HASH_MISMATCH_VS_DB_RECORD — investigate before proceeding' });
      continue;
    }
  } else {
    const info = db.prepare(`
      INSERT INTO source_files
        (stable_id, original_filename, upload_ref, board, subject_name, class, source_section, sha256, size_bytes, archive_path, uploaded_at)
      VALUES (?, ?, ?, 'ICSE', ?, '10', ?, ?, ?, ?, ?)
    `).run(f.stable, f.upload.replace(/^[0-9a-f]{8}-/, ''), f.upload, f.subject, f.chapter, hash, size, archivePathRel, null);
    sourceFileId = Number(info.lastInsertRowid);
  }

  results.push({ ...f, status: 'ARCHIVED', sha256: hash, size, archivePathRel, sourceFileId });
}

console.log('=== Archive results ===');
for (const r of results) {
  console.log(`${r.stable.padEnd(24)} ${r.status}`);
}
const missing = results.filter((r) => r.status !== 'ARCHIVED');
console.log(`\n${results.length - missing.length}/${results.length} archived successfully.`);
if (missing.length) {
  console.log('PROBLEMS:', JSON.stringify(missing, null, 2));
}

// --- Link source_files to the source_documents ingestion-batch rows that
// used them, by matching each batch's free-text label against this file's
// original filename (best-effort — this is exactly the fragile text-match
// the founder's instruction wants replaced with a real link going forward;
// this pass builds that link retroactively for existing rows). ---
const allDocs = db.prepare('SELECT id, label FROM source_documents').all();
const allFiles = db.prepare('SELECT id, stable_id, original_filename FROM source_files').all();
let linked = 0;
const linkInsert = db.prepare('INSERT OR IGNORE INTO source_document_files (source_document_id, source_file_id) VALUES (?, ?)');
for (const doc of allDocs) {
  for (const file of allFiles) {
    if (doc.label.includes(file.original_filename)) {
      linkInsert.run(doc.id, file.id);
      linked++;
    }
  }
}
console.log(`\nLinked ${linked} source_document <-> source_file relationships across ${allDocs.length} ingestion-batch rows.`);

// --- Best-effort backfill of questions.source_document_id from the
// existing free-text questions.source column matched against
// source_documents.label. Reports coverage rather than silently assuming
// 100%. ---
const questions = db.prepare('SELECT id, source FROM questions WHERE source IS NOT NULL AND source_document_id IS NULL').all();
const docsForMatch = db.prepare('SELECT id, label FROM source_documents').all();
let backfilled = 0;
let ambiguous = 0;
let unmatched = 0;
const setSourceDoc = db.prepare('UPDATE questions SET source_document_id = ? WHERE id = ?');
for (const q of questions) {
  const src = (q.source || '').trim();
  if (!src) continue;
  // exact label match first, then "label starts with source text" fallback
  const exact = docsForMatch.filter((d) => d.label === src);
  const candidates = exact.length ? exact : docsForMatch.filter((d) => d.label.startsWith(src) || src.startsWith(d.label.split(' ')[0]));
  if (exact.length === 1) {
    setSourceDoc.run(exact[0].id, q.id);
    backfilled++;
  } else if (exact.length > 1) {
    ambiguous++;
  } else {
    unmatched++;
  }
}
console.log(`\nQuestion provenance backfill: ${backfilled} linked by exact label match, ${ambiguous} ambiguous (multiple docs share the same label — left unset), ${unmatched} unmatched (left unset, no data changed/guessed).`);

const totalQ = db.prepare('SELECT COUNT(*) c FROM questions').get().c;
const linkedQ = db.prepare('SELECT COUNT(*) c FROM questions WHERE source_document_id IS NOT NULL').get().c;
console.log(`\nCurrent state: ${linkedQ}/${totalQ} questions now have a formal source_document_id link.`);
