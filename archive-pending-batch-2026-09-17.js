// PRESERVE-FIRST holding archive for the large new upload batch received
// 2026-09-17 (32 photographed pages, arriving in two 16-image messages while
// the Surface-Areas-and-Volumes ingestion was in progress). Per the
// project's standing rule ("every new upload must be archived BEFORE
// ingestion begins"), these files are copied into permanent, git-tracked
// storage and registered in source_files IMMEDIATELY, before their exact
// chapter/page content has been individually re-confirmed and before any
// ingestion happens. This guarantees the originals can never be lost to a
// session/container reset even if the detailed transcription work spans
// several more sessions.
//
// stable_id uses a PENDING-<uploadHashPrefix> scheme and source_section
// records the best page-number guess formed while first viewing the images
// inline in conversation. That guess is NOT authoritative — each file's
// source_files row (source_section, subject_name, notes) will be corrected
// to its confirmed chapter/page once this file has been individually
// re-opened and transcribed, exactly like the Statistics page-mislabeling
// correction earlier in this project. The sha256/archive_path/original
// bytes are permanent from this run regardless of any later relabeling.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const db = require('./db');

const UPLOAD_DIR = '/root/.claude/uploads/1d996bac-dc83-558e-969a-1f22b2890453';
const ARCHIVE_ROOT = path.join(__dirname, 'source_library', 'CBSE', '_pending_classification_2026-09-17');

// upload -> best current guess of page/chapter, formed while viewing inline.
// NOT yet individually re-verified file-by-file (see header comment).
const FILES = [
  { upload: '7eacf51e-image.jpg', guess: 'Triangles p.7.16' },
  { upload: '683372de-image.jpg', guess: 'Triangles p.7.17' },
  { upload: 'b4f8f97d-image.jpg', guess: 'Triangles p.7.18' },
  { upload: 'f7f82cb2-image.jpg', guess: 'Triangles p.7.19' },
  { upload: '9ea1b932-image.jpg', guess: 'Triangles p.7.20 (answers)' },
  { upload: 'cc49eea7-image.jpg', guess: 'Circles p.8.13' },
  { upload: '22d04f1c-image.jpg', guess: 'Circles p.8.14' },
  { upload: '3131b53a-image.jpg', guess: 'Circles p.8.15' },
  { upload: '05d9435b-image.jpg', guess: 'Circles p.8.16' },
  { upload: 'aee9a5cf-image.jpg', guess: 'Circles p.8.17' },
  { upload: 'aa8d9678-image.jpg', guess: 'Circles p.8.18' },
  { upload: '06cfacd8-image.jpg', guess: 'Circles p.8.19' },
  { upload: '538b8c3a-image.jpg', guess: 'Circles p.8.20' },
  { upload: '7bdb87fd-image.jpg', guess: 'Circles p.8.21' },
  { upload: '177f87ca-image.jpg', guess: 'Circles p.8.22 (answers)' },
  { upload: '1776004a-image.jpg', guess: 'Trigonometric Ratios p.9.11-ish' },
  { upload: '8bdeef95-image.jpg', guess: 'Areas Related to Circles p.12.14' },
  { upload: 'b1f2a1c9-image.jpg', guess: 'Areas Related to Circles p.12.15' },
  { upload: 'baeaf340-image.jpg', guess: 'Trigonometric Ratios p.9.13' },
  { upload: 'eb2d22e4-image.jpg', guess: 'Trigonometric Ratios p.9.14' },
  { upload: 'fd8c7297-image.jpg', guess: 'Trigonometric Ratios p.9.15 (answers)' },
  { upload: '7298749e-image.jpg', guess: 'Trigonometric Identities p.10.7' },
  { upload: '095a66c1-image.jpg', guess: 'Trigonometric Identities p.10.8' },
  { upload: '6eeb1507-image.jpg', guess: 'Trigonometric Identities p.10.9 (answers)' },
  { upload: '0c91ac62-image.jpg', guess: 'Heights and Distances p.11.10' },
  { upload: '451b9161-image.jpg', guess: 'Heights and Distances p.11.11' },
  { upload: '45b6bede-image.jpg', guess: 'Heights and Distances p.11.12' },
  { upload: 'fdbbdd2b-image.jpg', guess: 'Heights and Distances p.11.13' },
  { upload: 'e77ab69d-image.jpg', guess: 'Heights and Distances p.11.14' },
  { upload: 'a5e6c91f-image.jpg', guess: 'Heights and Distances p.11.15 (answers)' },
  { upload: 'd3dd4557-image.jpg', guess: 'Areas Related to Circles p.12.13' },
  { upload: '48009c8a-image.jpg', guess: 'Areas Related to Circles p.12.16-17' },
];

fs.mkdirSync(ARCHIVE_ROOT, { recursive: true });
const ids = [];
for (const f of FILES) {
  const srcPath = path.join(UPLOAD_DIR, f.upload);
  const hash = crypto.createHash('sha256').update(fs.readFileSync(srcPath)).digest('hex');
  const size = fs.statSync(srcPath).size;
  const stableId = `PENDING-20260917-${f.upload.slice(0, 8)}`;
  const destName = `${f.upload.slice(0, 8)}.jpg`;
  const destPath = path.join(ARCHIVE_ROOT, destName);
  fs.copyFileSync(srcPath, destPath);
  const archivePathRel = path.relative(__dirname, destPath);
  const existing = db.prepare('SELECT id FROM source_files WHERE stable_id = ?').get(stableId);
  let id;
  if (existing) {
    id = existing.id;
  } else {
    const info = db.prepare(`INSERT INTO source_files
      (stable_id, original_filename, upload_ref, board, subject_name, class, source_section, sha256, size_bytes, archive_path, uploaded_at, notes)
      VALUES (?, ?, ?, 'CBSE', 'Mathematics', '10', ?, ?, ?, ?, ?, ?)`)
      .run(stableId, destName, f.upload, `UNCONFIRMED guess: ${f.guess}`, hash, size, archivePathRel, null,
        'Preserved immediately on receipt (preserve-before-ingest rule), before individual page-by-page transcription/verification. source_section is a best guess formed while viewing inline in conversation, NOT yet confirmed by direct re-read of this specific file. Will be corrected and this file re-registered under its confirmed chapter-specific stable_id (e.g. CBSE-MATH-TRI-P716) once transcribed, matching the pattern used for Probability/Statistics/Surface-Areas-and-Volumes.');
    id = Number(info.lastInsertRowid);
  }
  ids.push(id);
  console.log(stableId, '-> source_files.id', id, hash.slice(0, 16), f.guess);
}
console.log('Preserved', ids.length, 'files. source_files ids:', JSON.stringify(ids));
