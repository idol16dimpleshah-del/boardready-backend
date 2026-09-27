# Live Serving-Query Check — 2061 and 1727 (Batch 15A, Task 10)

**Status: fully read-only against the live database.** This script copies
the live `boardready.db` to a disposable file and drives the real HTTP API
(register, create attempt, fetch questions, check answer) against that copy
— never against `boardready.db` itself. Unlike Batch 15 Tasks 11/12's
browser-QA scripts (which had to synthesize a fixture because 2061/1727
weren't live yet), this proves the actual now-live, now-associated rows
serve correctly end to end.

`scripts/verify-2061-1727-live-serving.js` — run and passed:

- `GET /api/attempts/:id/questions` resolves `diagramUrl` for both
  questions to their `ai_generated` SVG (not the `source_cropped` PNG),
  exactly matching the `visual_assets` rows inserted in Tasks 7/9.
- The SVG bytes actually served over HTTP at that URL are byte-identical to
  the committed `extracted-diagrams/*-GENERATED.svg` files on disk (8,921
  bytes for 2061, 6,414 bytes for 1727) — proving the static-file route
  serves the real, committed asset.
- `POST /api/attempts/:id/check` grades the live `correct` index (0 for
  both) as correct through the real endpoint — not a `scoring.js` unit call
  in isolation, but the actual HTTP path a student's browser uses.

Live `boardready.db` hash confirmed identical before and after
(`6a42c81c8f3ea3e390ff065dab1f91fdccfa34cd9ce73a40ca104d74103b5502`) — this
script never writes to the live file, only to its own disposable copy,
which is deleted at the end of the run.
