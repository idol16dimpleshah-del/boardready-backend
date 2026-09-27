# Board Ready — Backend + Frontend

CBSE/ICSE Class 10 exam-prep platform. Node.js (built-in `node:sqlite`, no
framework) API plus a static frontend served from `/public`.

See `PROJECT_PROGRESS.md` for the full, continuously-updated project
checkpoint (content ingestion status, chapter-by-chapter reconciliation,
frontend status, known issues), `LAUNCH_STATUS.md` for the 18 October
launch checklist, and `SOURCE_LIBRARY.md` for the permanent inventory of
every original source PDF behind the question bank. **Read all three
before starting any new work on this repo — they are the source of truth
for what's already done.**

## Original source files — read before uploading anything new

Every original source document (PDF, question paper, answer key) is a
permanent, immutable project asset — see `SOURCE_LIBRARY.md` and
`archive-sources.js`. The required workflow for any new upload is:
**Upload → Preserve original (archive it into `source_library/` and
register it in `source_files`) → Register source → Ingest → QA →
Database.** `ingest.js`'s `ingestQuestions()` enforces the "preserve
before ingest" half of this: it will not run without a `sourceFileIds`
array pointing at already-archived files. Never delete an original after
ingestion, and never overwrite one with a processed/transformed copy —
keep any transformed copy separate.

**Every source diagram/figure/graph/structure/circuit/table-image must
also be preserved and linked to its question — this is a hard requirement,
not optional.** A question with a needed diagram missing is not considered
completely captured, even if its text and answer are perfect. Set
`diagramStatus` (`'not_applicable'` | `'source_diagram_preserved'` +
`visuals: [{sourceFileId, figureLabel}]` | `'needs_visual_review'`) on
every item passed to `ingestQuestions()` — see `ingest-cbse-triangles.js`
for the pattern and PROJECT_PROGRESS.md's "visual/diagram preservation"
section for the full requirement and the current audit of older content.

## Running locally

```bash
npm install       # no external deps currently, but run it anyway
cp .env.example .env   # fill in AUTH_SECRET for anything beyond local dev
npm test          # must show 12/12 passing before you change anything
npm start         # serves the API + static frontend on http://localhost:4000
```

Open `http://localhost:4000` for the student frontend once the server is running.

## Seeding demo content (optional, CBSE-only)

```bash
npm run seed
```

The real question bank (ICSE Maths chapters 7–24, ICSE Chemistry) is
populated via the `ingest-*.js` scripts in this directory, each of which
calls `ingestQuestions()` in `ingest.js` — see `PROJECT_PROGRESS.md` for
which sources are already ingested.

## Architecture, in one paragraph

`db.js` owns the schema (SQLite, additive migrations only — see its
comments for the pattern used when a `CHECK` constraint needs to change).
`ingest.js` is the only path for adding new questions to the bank
(handles exact/near-duplicate detection, provenance, and the
`status`/`answer_status` two-axis model — a question can be perfectly
extracted with no answer yet, or vice versa). `content-rules.js` defines
which statuses are ever servable to a student (`GRADABLE_STATUSES`).
`practice.js`/`server.js`'s test-generation routes only ever draw from
that gradable set. `scoring.js`, `diagnostics.js`, `readiness.js`,
`retest.js` implement grading, weak-topic diagnosis, the Readiness Score,
and the retest/improvement loop — these are considered stable/protected;
changes to them should be rare, explicit, and named, not incidental.

## Database persistence — read before deploying

This currently runs on a local SQLite file (`boardready.db`, gitignored —
**never commit it**). Before any production deployment, confirm how the
target host persists this file (a mounted volume that survives
restarts/redeploys) or complete the planned migration to PostgreSQL — see
`PROJECT_PROGRESS.md`'s Infrastructure section for the current decision
and status. Do not deploy against ephemeral/container-local storage; the
question bank and user data would be lost on the first redeploy or
restart.

## Environment variables

See `.env.example`. `AUTH_SECRET` in particular must be set to a real
random value outside local development.
