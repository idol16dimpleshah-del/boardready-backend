# Board Ready — 18 October 2026 Launch Status

**LAST UPDATED:** 2026-09-17

Legend: 🔴 blocked · 🟡 in progress · 🟢 verified

This file is the launch-readiness checkpoint, separate from
`PROJECT_PROGRESS.md` (which tracks content-ingestion detail). Read both
before starting work. Update this file whenever a launch-critical item's
status changes — don't let it go stale.

## Launch checklist

| Area | Status | Notes |
|---|---|---|
| Question bank — ICSE Maths (Ch 7–24) | 🟢 | 1280 questions, all 18 chapters reconciled against source. See PROJECT_PROGRESS.md. |
| Question bank — ICSE Chemistry (Sections A/B/C) | 🟢 | 1382 questions across Ch1-9 + Charts 1-4 + Competency. Full reconciliation done. Some content genuinely `answer_status: unavailable` by source limitation (documented, not a bug). |
| Question bank — other subjects/boards | 🔴 | None uploaded yet. Not a launch blocker unless the launch scope requires them — confirm with founder. |
| Duplicate/near-duplicate system | 🟡 | Working, sampled and classified (0% genuine dup, mostly same-concept-different-question + some false positives from a known, documented detector blind spot). No threshold change made or requested yet. |
| Test generation (`/api/tests/generate`, `/api/practice/generate`) | 🟡 | Functional and covered by the 12 automated tests; NOT yet stress-tested against edge cases (insufficient questions in a chapter, multi-chapter requests, the new `kind:'open'`/ungradable content correctly excluded at scale). Recommend a dedicated audit pass before launch. |
| Scoring / diagnostics / readiness / retest | 🟢 (existing coverage) / 🟡 (not re-audited at new content scale) | Untouched all project — no bugs found in these files. Automated tests still 12/12. Given the content bank grew ~13x this project (218 → 2677), worth one targeted audit pass with the larger bank rather than assuming nothing changed. |
| Frontend (Revision 3, wired to real API) | 🟢 functionality / 🔴 accessibility | Verified end-to-end via curl (register → real test → real scoring → real diagnostics → real Readiness → real paywall). Not yet openable in an actual browser — see Infrastructure row. |
| Frontend polish (mobile, empty/error/loading states, accessibility) | 🔴 | Not yet audited. On the launch critical path per founder's Oct-18 plan. |
| GitHub repository | 🔴 | Blocked — this environment has no linked GitHub account (`GITHUB_TOKEN` present but unauthenticated: "No linked GitHub account. Connect your GitHub account and retry."). Needs founder action. See below. |
| Cloud deployment (Railway or equivalent) | 🔴 | Blocked — no Railway (or other host) connector authorized for this session. Needs founder action. See below. |
| Database persistence plan | 🔴 | Decision not yet made: SQLite-on-persistent-volume vs. migrate to Postgres. Cannot be finalized until a hosting target is chosen (Step above). |
| Payments (Razorpay or equivalent) | 🔴 | Not started. Nothing in the current codebase references any payment provider yet — `subscriptions` table/endpoint exists but is a manual/test activation, not a real payment integration. |
| Security pass (auth, student isolation, forged-request handling) | 🔴 | Not yet audited as its own pass. Auth uses HMAC-signed tokens with a documented dev-only fallback secret (see `.env.example`) — must have a real `AUTH_SECRET` before any public deployment. |
| Mobile/device QA | 🔴 | Not started — depends on the frontend actually being reachable in a browser first. |
| Automated tests | 🟢 | 12/12 passing, verified continuously throughout this project after every content batch. |

## The two concrete blockers standing between "verified working" and "a public URL"

1. **GitHub account linking.** This sandbox has a `GITHUB_TOKEN`/`GH_TOKEN`
   pre-provisioned for `git` operations, but calling the GitHub API with it
   returns "No linked GitHub account. Connect your GitHub account and
   retry." This is an account-level connection (separate from the MCP
   connector registry) — the founder needs to link a GitHub account to
   this Claude session/environment before any `git push` to a real GitHub
   repo can happen from here.
2. **Cloud host authorization.** A Railway MCP connector exists in the
   registry but is not installed/authorized for this session
   (`installState: not_installed`). The founder needs to connect it via
   claude.ai (or provide equivalent Railway credentials/CLI access another
   way) before a deployment can be triggered from here. Vercel is also
   available as a connector if preferred for the frontend specifically,
   though the backend (stateful SQLite/Postgres + long-running Node
   process) fits Railway's model better than a serverless host.

Everything that does NOT require those two external accounts has been
prepared already: `.gitignore` (excludes the DB file and any `.env`),
`.env.example` (documents `AUTH_SECRET`, `PORT`, and a placeholder
`DATABASE_URL` for a future Postgres migration), and `README.md`. No
secrets exist in the codebase to strip — `AUTH_SECRET` already reads from
`process.env` with an obviously-fake dev-only default, never a real value.

## On the proposed 13–17 agent launch structure

The founder proposed a large team of specialized parallel Claude agents
(content per-subject, test engine, learning experience, frontend, frontend
QA, infra, payments, security, launch war room, etc.). The ownership
boundaries in that plan are good and worth keeping — they're reflected in
this file's rows. But running that many heavy agents genuinely
concurrently isn't practical in this environment: two concurrent
content-ingestion agents alone hit a session-wide rate limit twice earlier
today. Spinning up 13–17 at once would fail immediately and burn quota
without finishing anything.

The practical adjustment: keep the same conceptual ownership split, but
run 1–3 focused agents at a time, sequenced by what's actually next on the
critical path (right now: infrastructure, since content ingestion for the
currently-uploaded material is done), coordinating through this file and
`PROJECT_PROGRESS.md` instead of a permanently-running swarm. This
preserves "content agents only touch content, frontend agent only touches
frontend, infra agent only touches deployment" without the coordination
overhead (and rate-limit risk) of running all of them simultaneously.

## Universal content pipeline (per founder's architecture note)

Agreed direction: `ingestQuestions()` in `ingest.js` is already
subject/board-agnostic (it takes `board`, `subjectName`, `chapterName` as
plain parameters, not a hardcoded enum) and the `kind`/`question_format`
two-axis model already generalizes to any question shape, not just
Chemistry's. No schema rework is needed to accept the next new
subject/board — a new source is just a new `ingestQuestions()` call with
its own `board`/`subjectName`/`chapterName`/`label`. This file and
`PROJECT_PROGRESS.md` should keep growing with each new source rather than
being replaced.
