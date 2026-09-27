# Workstream 3B — Question 3070: Generated Visual, Provenance, and QA

**Date:** 2026-09-25
**Status:** ~~Both assets built and independently verified end-to-end
against a disposable test database and a real browser. No write has been
made to `boardready.db`.~~ **UPDATE (same day, after your sign-off): the
live association has now been applied.** Section 4 below is kept in its
original "proposed" form for the record, plus a result block showing exactly
what was applied and verified — see
`docs/workstream-3b-3070-live-association-correction-record.md` for the full
before/write/after account. Live database SHA-256 is now
`4014833a08c1350606eb4ec64f2ada674a11318ca3bc8aed95acbe340176efd4`
(was `ac204d4919aee876d9f0e706dbad628a1d8ba8d5737f5717d0698a699890cba3`
throughout everything described below this line, up to and including the
Playwright verification run).

This continues `docs/workstream-3b-visual-extraction-test-case-3070.md`
(the first pass: source PDF/page/question identification, and the raw
`source_cropped` PNG crop) with the pivot you asked for afterward: the
student-facing visual should be a clean, native Board Ready redraw, not a
visible textbook-page crop. That redraw, its provenance separation from the
original source, and its full QA are what this document covers.

---

## 1. Source page

`source_library/ICSE/Mathematics/ch04-linear-inequation.pdf`, page index 6
(printed page 4.8), item 57 — unchanged from the first pass. Untouched
throughout this workstream (confirmed via `git status` showing no diff
against the tracked copy; SHA-256 `1ad7050b4bb3a1e0809f2f8d1292aaf77754b9fb88aac6f09e0be2cf4ee3f5fb`,
matching `source_files.sha256` for `source_files.id = 99` exactly, read
read-only from the live database). See the first-pass doc for the page-level
render and the zoomed `-4`/`5` marker crops that established the diagram's
own internal convention (bare tick = open/excluded bound, filled dot =
closed/included bound).

## 2. Extracted figure(s) — now two, on purpose

| | asset_type | file | what it is |
|---|---|---|---|
| A | `source_cropped` | `extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-CANDIDATE.png` | Unmodified, un-reinterpreted crop of the original scanned figure. Provenance/reference only. Unchanged from the first pass (2220×210px, RGB). |
| B | `ai_generated` | `extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-GENERATED.svg` | New this pass. A clean, native SVG redraw of the same figure, built to be the actual student-facing visual. |

Asset B's geometry and every semantic mark were reproduced from the same
verified evidence as the first pass, not invented:

- **Filled dots at −3, −2, −1, 0, 1, 2, 3, 4, 5** (9 points) — the actual
  integer solution values.
- **One open (unfilled) circle at −4** — the excluded boundary. The source
  scan renders this as a bare tick (a plausible print/scan degradation of a
  small unfilled circle at this resolution); asset B draws it as an explicit
  hollow ring (`fill:none`, stroked), the same open-boundary convention used
  throughout the rest of the question bank's number-line items, rather than
  reproducing the scan's resolution artifact literally.
- **A plain, unmarked tick at 6** — not a boundary, just the unbounded axis
  extension past the solution set, matching the source exactly.
- Evenly spaced integer points on a straight axis with arrowheads at both
  ends, matching the source's construction.

This matches the question's own stored text ("dotted markers from -4 to 6,
hollow circle at -4, filled circle at 5") and the answer key (`correct=1`,
option B, "{x∈Z, -4<x≤5}") exactly — see Section 5 for the point-by-point
comparison.

## 3. Asset path / hash

| file | sha256 | size |
|---|---|---|
| `...CANDIDATE.png` | `eff45f7714fd908cab666a548090d01d03646f2062ebad08b25caf601feedaa9` | 205 KB |
| `...GENERATED.svg` | `b80c695b42e34a7c04ace19caf4ff7d0b802e40b27e860edff0c1ee50017f26d` | 4.9 KB |

Both committed to git under `extracted-diagrams/`. Neither has been written
into `visual_assets` yet — see Section 4.

## 4. Question association

**APPLIED as of 2026-09-25** — see the RESULT block in
`docs/workstream-3b-3070-live-association-correction-record.md` for the
verified before/after. Kept below exactly as originally proposed, for the
record:

```sql
-- A: source_cropped (provenance/reference — unchanged from the first pass' proposal)
INSERT INTO visual_assets (question_id, source_file_id, asset_type, asset_path, figure_label, notes)
VALUES (3070, 99, 'source_cropped',
        'extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-CANDIDATE.png',
        'Number line, item 57 (p.4.8)',
        'Unmodified crop of the original source figure. Provenance/reference only — not the default student-facing visual once B exists.');

-- B: ai_generated (new this pass — the actual student-facing visual)
INSERT INTO visual_assets (question_id, source_file_id, asset_type, asset_path, figure_label, notes)
VALUES (3070, 99, 'ai_generated',
        'extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-GENERATED.svg',
        'Number line, item 57 (p.4.8)',
        'Board Ready native redraw of the source_cropped figure above. Colors read from the host page''s CSS custom properties at render time (see public/app.js loadDiagram); semantic content (solution-set points, open boundary at -4, unmarked tick at 6) verified against the source and the answer key — see docs/workstream-3b-3070-generated-visual-provenance-and-qa.md Section 5.');
```

The existing `visual_assets` row for question 3070 (`id = 23`,
`asset_type = 'source_page_full'`, pointing at the whole 13-page PDF) is left
untouched by this proposal either way — inserting A and B alongside it does
not require deleting or modifying it, and `getServableDiagramUrls` already
ignores `source_page_full` rows entirely.

**A genuine gap surfaced while drafting this proposal, worth deciding before
scaling:** `questions.diagram_status` has no CHECK value that means "a
verified, servable visual exists." The schema
(`docs/phase-3-migration-artifacts/schema.sql`) only allows
`'not_applicable'`, `'source_diagram_preserved'`, `'needs_visual_review'`, and
`'ai_generated_pending'` — even the best-named of these, `ai_generated_pending`,
says *pending*, not *done*. So there is currently no way to move a question's
`diagram_status` to a value that honestly means "this visual is verified and
complete" without either (a) reusing `ai_generated_pending` to mean something
it doesn't say, or (b) adding a new enum value via the same additive-
migration pattern `db-sqlite.js` already uses for other columns.

**RESOLVED, same day:** per your instruction, added `'adapted_verified'` as
a new allowed value — `ingest.js`'s `VALID_DIAGRAM_STATUSES`,
`db-sqlite.js`'s column comment, and `schema.sql`'s CHECK constraint were all
updated together (no live-DB schema migration was needed: the live SQLite
table has never had a CHECK constraint on this column, only the app-level
allowlist in `ingest.js` — confirmed by reading the table's actual
`CREATE TABLE` SQL before making this change). `scripts/content-qa-audit.js`'s
visual-completeness query was also extended to include `adapted_verified`
rows, so a future row wrongly promoted to this status without a real
`ai_generated` asset would still show up as a defect instead of becoming
invisible to that audit. Question 3070's `diagram_status` is now
`adapted_verified` — see Section 4's applied-result note above.

## 5. Visual QA — recreated visual vs. source

| Mark | Source (verified reading) | Generated SVG | Match |
|---|---|---|---|
| Left/right arrows | Both ends, unbounded | Both ends, unbounded | ✅ |
| Tick positions | Evenly spaced integers −4..6 | Evenly spaced integers −4..6 | ✅ |
| Filled points | −3,−2,−1,0,1,2,3,4,5 (9 points, zoomed source confirms −3 and 4/5 all solid) | Same 9 points | ✅ |
| Open/excluded boundary | −4, rendered as bare tick in scan (resolution artifact of a small unfilled circle) | −4, explicit hollow ring | ✅ (semantically faithful; see note above) |
| Non-boundary extension | 6, plain tick, no marker | 6, plain tick, no marker | ✅ |
| Consistency with stored question text | "dotted markers from -4 to 6, hollow circle at -4, filled circle at 5" | Matches | ✅ |
| Consistency with answer key | `correct=1` → {x∈Z, −4<x≤5} | Diagram encodes exactly this set | ✅ |

No numerical label, scale, endpoint, or boundary marking was invented,
simplified, or reinterpreted beyond the one documented resolution-artifact
judgment call (bare tick → explicit hollow circle) already established and
disclosed in the first-pass document.

DOM-level rendering QA (see Section 6) additionally asserts, in a real
browser against the real generated markup, that the SVG contains exactly 9
`.nl-dot-filled` elements and exactly 1 `.nl-dot-open` element — a
mechanical re-check of the same claim, not just a visual read.

## 6. Website rendering result

Verified end-to-end with a new, permanent proof script,
`scripts/verify-3070-visual-rendering.js`, run against a brand-new disposable
test database (via `test/pg-test-support.js`'s `setupPrimaryTestDbEnv` — the
same helper the real test suite uses), a real spawned `node server.js`, and a
real headless Chromium browser (Playwright) doing the actual clicks a student
would. The live database is touched only by one read-only `SELECT` (to copy
question 3070's real, already-verified text/options into the disposable
fixture) — never a write.

What it proved, this run:

1. **Priority rule, at the API level.** The fixture question was seeded with
   *both* a `source_cropped` row (inserted first, lower id — deliberately, so
   the old "first row wins" behavior would have visibly failed this check)
   and an `ai_generated` row. `GET /api/attempts/:id/questions` returned
   `diagramUrl: "/extracted-diagrams/...GENERATED.svg"` — the generated SVG,
   not the raster crop. This is the real regression check for the
   `ORDER BY CASE asset_type WHEN 'ai_generated' THEN 0 ...` change in
   `server.js`.
2. **Real browser, real login, real clicks.** Registered a real student via
   `/api/auth/register`, logged in through the actual login form, picked
   ICSE, clicked "Practice" on the fixture chapter, and landed on the real
   question screen — the exact path a student takes, not a synthetic DOM
   injection.
3. **DOM-level proof the inline-SVG path actually ran**, not just that the
   URL looked right: `#qDiagramImg` is `hidden` with an empty `src`, and
   `#qDiagramSvgHost` is visible and contains a real `<svg>` element with the
   expected 9 filled dots and 1 open dot.
4. **Both of the app's own theme states** — its real in-app toggle
   (`#themeBtn2`, driving `#app[data-theme]`), not the OS-level
   `prefers-color-scheme` an `<img src="...svg">` would have been limited to.
   The app's actual default is `dark` (confirmed by reading `state.theme` in
   `app.js`, not assumed) — both the default-dark pass and a light pass
   reached by one real click of the toggle were run and screenshotted.
5. **Both desktop (1280×900) and mobile (390×844) viewports**, for the
   inline card and the zoom lightbox, in both themes — 8 screenshots total,
   saved under `docs/workstream-3b-3070-visual-qa-screenshots/`.
6. **A real defect, found and fixed by this same proof.** The first version
   of `.lightbox-svg-host` capped the zoomed card at `min(92vw, 640px)`,
   which measured out (by locating the diagram's own pixel extent in the
   actual screenshots, not by eye) to only 541px → 571px — a 6% size increase
   for a "tap to zoom" action. Fixed to `min(94vw, 1200px)` (matching what
   the pre-existing raster-crop lightbox path already achieves via
   `max-width:100%`/`max-height:100%` on a real `<img>`, which a plain `<div>`
   host can't do without an explicit width) plus `touch-action: pinch-zoom`
   for further magnification on small screens. Re-measured after the fix:
   541px → 1239px, a real **~2.3× zoom** on desktop. On the 390px mobile
   viewport the on-screen width gain is inherently small (the viewport itself
   is the ceiling), which is an honest constraint rather than a bug — the
   pre-existing raster-crop lightbox has the exact same ceiling, and
   `pinch-zoom` is the same mitigation it already relies on.

All checks (console/page-error monitoring, DOM assertions, the priority
assertion) passed on both the dark and light runs; the one console message
seen (`ERR_TUNNEL_CONNECTION_FAILED` fetching Google Fonts) is this sandbox's
own outbound-network policy blocking a pre-existing, unrelated font request
present on every page load regardless of this feature — the page already
declares real fallback font stacks for exactly this case, and it is excluded
from the proof script's pass/fail decision with that reasoning recorded
inline in the script.

Live database SHA-256 confirmed unchanged before and after this script's
entire run (provisioning, seeding the isolated database, spawning the
server, and closing everything down):
`ac204d4919aee876d9f0e706dbad628a1d8ba8d5737f5717d0698a699890cba3`.

Screenshots (all in `docs/workstream-3b-3070-visual-qa-screenshots/`):
`question-{dark,light}-{desktop,mobile}.png`,
`lightbox-{dark,light}-{desktop,mobile}.png`.

## 7. Tooling created this pass

- `extracted-diagrams/icse-mathematics-linear-inequation-ace0c077-item57-numberline-GENERATED.svg`
  — the new `ai_generated` asset itself.
- `server.js`: `getServableDiagramUrls` now prefers `ai_generated` over
  `source_cropped` when a question has both (previously "first row by id"
  regardless of type — untested and, as this pass found, wrong for the new
  two-tier model).
- `scoring.js`: `flattenAll` passes `diagram_url` through to every step kind
  (mcq/case/open) as `diagramUrl` — this was already done in the prior pass
  within this same turn; re-verified here (71/71 on both SQLite and
  Postgres, live DB hash unchanged both times).
- `public/index.html` / `public/app.js` / `public/style.css`: the inline-SVG
  rendering path — `#qDiagramSvgHost` / `#lightboxSvgHost` host elements, and
  `createDiagramLoader`/`loadDiagram` in `app.js`, which fetches and inlines
  an `.svg` `diagramUrl` (so it can read `var(--ink)`/`var(--violet)` and
  track the app's real theme toggle) while leaving the existing `<img>` path
  completely unchanged for a raster `source_cropped` asset. Includes
  request-sequence tracking so a fast question-to-question navigation can't
  let a slow, stale fetch clobber a newer one.
- `scripts/verify-3070-visual-rendering.js` — the disposable-database,
  real-browser, real-login end-to-end proof described in Section 6. Intended
  to be reusable: it seeds a fresh fixture and asserts on real HTTP/DOM
  behavior rather than hardcoding anything specific to this one run, so the
  same pattern (fixture question + two visual_assets rows + browser proof)
  should generalize to future questions with only the fixture content
  changing.
- `extracted-diagrams/README.md` — updated to document the `source_cropped`
  vs `ai_generated` two-tier convention and naming pattern going forward.

## 8. Is this safe to scale to the rest of the visual backlog?

**The code path: yes, with one caveat.** The server-side priority rule, the
frontend inline-SVG rendering, and the theme-correctness fix are all generic
— they don't contain anything specific to question 3070 — and are now
proven end-to-end by a real browser test, not just unit-level. The one
caveat is the schema gap in Section 4 (no `diagram_status` value that means
"verified complete"): that should be resolved (either a new enum value or an
explicit decision to reuse `ai_generated_pending`) before a batch of
questions gets associated, so the bank doesn't end up with rows implying more
confidence than the schema itself can express.

**The redraw step: no, not yet, and this is the part that should stay
manual/single-question for now.** Every semantic judgment call in Section 2
and Section 5 — reading a bare tick as an intentionally-open boundary rather
than a printing defect, deciding which points are "the solution set" versus
"just axis extension," picking exactly which pixels of a scanned page belong
to one question's figure versus its neighbors — was made by direct
cross-reference against this specific question's own stored text and answer
key, verified point-by-point. Nothing here is a generic "crop this region and
vectorize it" operation; it is closer to "read the mathematical meaning
correctly enough to redraw it, for content where getting it wrong would
mean silently teaching a student the wrong solution set." Scaling this to the
2,679 `missing_no_asset_row` + 79 other backlog rows means doing this same
verification work per figure (and per figure *type* — a number line is one
of the simpler cases named in your original message; geometry constructions,
graphs, chemistry structures, and ray diagrams each have their own set of
"what actually has to be preserved exactly" rules that haven't been
established yet). I have not built, and would not build without your sign-off
first, any tooling that generates or associates these at batch scale — this
pass proves the pipeline shape on one question, per your instruction, and
nothing beyond that.

## What was deliberately NOT done (originally — see the applied-result
## notes above for what has since happened, same day, after your sign-off)

- ~~No write to `boardready.db`~~ — **now applied**, after your sign-off
  message, via the guarded script and verification described in
  `docs/workstream-3b-3070-live-association-correction-record.md`.
- No change to the shared scoring engine or the 7 duplicate-correct-answer
  questions (2941 still pending your product decision, 3003/3228 fixes still
  proposed-not-applied) — untouched, as instructed.
- No bulk processing of the remaining visual backlog.
- No modification of any source PDF or original asset — `source_library/`
  and the existing `source_cropped` PNG from the first pass are both
  untouched (git shows no diff; SHA-256s re-confirmed above).
