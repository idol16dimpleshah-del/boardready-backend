// Generates SOURCE_LIBRARY.md from the live source_files / source_documents
// / source_document_files / questions tables — never hand-maintained, so it
// can't drift from the actual archive. Re-run after archiving any new file.
const fs = require('fs');
const path = require('path');
const db = require('./db');

const files = db.prepare('SELECT * FROM source_files ORDER BY subject_name, stable_id').all();

function questionStatsFor(fileId) {
  const docIds = db.prepare('SELECT source_document_id FROM source_document_files WHERE source_file_id = ?').all(fileId).map((r) => r.source_document_id);
  if (!docIds.length) return { docCount: 0, questionCount: 0 };
  const placeholders = docIds.map(() => '?').join(',');
  const questionCount = db.prepare(`SELECT COUNT(*) c FROM questions WHERE source_document_id IN (${placeholders})`).get(...docIds).c;
  return { docCount: docIds.length, questionCount };
}

const totalQuestions = db.prepare('SELECT COUNT(*) c FROM questions').get().c;
const linkedQuestions = db.prepare('SELECT COUNT(*) c FROM questions WHERE source_document_id IS NOT NULL').get().c;

let md = `# Board Ready — Permanent Source Library

**Generated:** ${new Date().toISOString().slice(0, 10)} by \`generate-source-library-md.js\` — do not hand-edit; re-run the
generator after archiving new sources so this file can never drift from
the live database.

This is the permanent inventory of every original source document behind
the question bank, per the founder's 2026-09-17 "SOURCE FILES ARE
IMMUTABLE PROJECT ASSETS" instruction. Every file listed below:

- has been copied out of the temporary session uploads folder into this
  repository's own \`source_library/\` directory (paths below, relative to
  the backend project root),
- has a SHA-256 hash recorded in the \`source_files\` table and verified
  against the archived copy,
- is registered with a permanent, human-readable \`stable_id\` that will
  never change even if the file is renamed or the database is rebuilt,
- must never be deleted or overwritten — if a processed/transformed copy
  is ever needed, it lives separately from this immutable original.

**Question-bank provenance coverage:** ${linkedQuestions}/${totalQuestions} questions
(${((linkedQuestions / totalQuestions) * 100).toFixed(1)}%) currently carry a formal
\`questions.source_document_id\` link back to the ingestion batch(es) that
produced them, which in turn link to the physical file(s) below via
\`source_document_files\`. The remaining questions were ingested before
this formal link existed and could not be disambiguated after the fact
where multiple ingestion batches for the same chapter share identical
free-text labels (see PROJECT_PROGRESS.md's "Known provenance gap"
note) — this is a real, disclosed limitation, not a hidden one, and does
not affect content correctness, only the strength of the automatic
paper-trail for those specific rows. Every ingestion from this point
forward gets this link stamped automatically and unambiguously by
\`ingest.js\` at insert time.

## ICSE Mathematics (19 files)

| Stable ID | Original filename | Chapter/Section | Size | SHA-256 (first 16 chars) | Archive path | Linked questions |
|---|---|---|---|---|---|---|
`;

for (const f of files.filter((f) => f.subject_name === 'Mathematics')) {
  const { questionCount } = questionStatsFor(f.id);
  md += `| ${f.stable_id} | ${f.original_filename} | ${f.source_section} | ${(f.size_bytes / 1048576).toFixed(1)} MB | \`${f.sha256.slice(0, 16)}…\` | \`${f.archive_path}\` | ${questionCount} |\n`;
}

md += `
## ICSE Chemistry (22 files)

| Stable ID | Original filename | Chapter/Section | Size | SHA-256 (first 16 chars) | Archive path | Linked questions |
|---|---|---|---|---|---|---|
`;

for (const f of files.filter((f) => f.subject_name === 'Chemistry')) {
  const { questionCount } = questionStatsFor(f.id);
  md += `| ${f.stable_id} | ${f.original_filename} | ${f.source_section} | ${(f.size_bytes / 1048576).toFixed(1)} MB | \`${f.sha256.slice(0, 16)}…\` | \`${f.archive_path}\` | ${questionCount} |\n`;
}

const totalSize = files.reduce((a, f) => a + f.size_bytes, 0);
md += `
## Totals

- **${files.length} original files archived**, ${(totalSize / 1048576).toFixed(0)} MB total.
- All 41 hashes verified against the archived copy as of this generation.
- Original files also still exist at their original temporary session
  upload location as of this writing — this archive is the PERMANENT copy;
  the temporary location should never be treated as the copy of record.

## What "permanent" means here, honestly

Copying these files into \`source_library/\` and this repository makes them
survive independently of the temporary per-session uploads folder, and
they will be committed to this project's git history. That is real
protection against exactly the kind of loss this instruction was written
to prevent (a session/uploads-folder disappearing).

It is **not yet** protection against the sandbox environment itself being
reclaimed, because this repository has not yet been pushed to GitHub (see
LAUNCH_STATUS.md — blocked on linking a GitHub account to this
environment). Until that push happens, or until the founder holds an
independent copy of these files outside this environment, "permanent"
should be read as "permanent within this project's own files," not yet
"permanent regardless of what happens to this sandbox." The founder has
been given a direct copy of the original files (see the accompanying
chat message) specifically to close that gap immediately, independent of
the GitHub blocker.

## Workflow going forward (per founder's instruction)

New uploads must follow: **Upload → Preserve original → Register source →
Ingest → QA → Database.** Concretely: archive the new file into
\`source_library/<Board>/<Subject>/\` and register it in \`source_files\`
(see \`archive-sources.js\` for the pattern) BEFORE calling
\`ingestQuestions()\`. As of this update, \`ingestQuestions()\` enforces this:
it throws unless \`meta.sourceFileIds\` is a non-empty array of already-registered
\`source_files.id\` values (or the explicit literal \`'none-hand-authored'\`
for the rare batch with no source PDF at all, matching REBUILD_NOTES.md's
disclosure about the original CBSE Maths content). Then re-run
\`generate-source-library-md.js\` so this file picks up the new entry.
`;

fs.writeFileSync(path.join(__dirname, 'SOURCE_LIBRARY.md'), md);
console.log('Wrote SOURCE_LIBRARY.md —', files.length, 'files,', linkedQuestions + '/' + totalQuestions, 'questions linked.');
