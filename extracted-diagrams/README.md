# extracted-diagrams/

Derived, per-question diagram assets — as opposed to `source_library/`, which
holds whole source pages/PDFs and must never be modified or treated as "the
diagram" for a question (see docs/publication-readiness-report-cbse-maths.md's
2026-09-22 correction: the old `visual_assets` rows are all whole-page photos,
not real crops).

Nothing in this folder is wired to a live question's `visual_assets` row yet —
every association below is a proposal awaiting explicit, independently-
verified sign-off before any write to `boardready.db`.

## Two kinds of file live here now (Workstream 3B, 2026-09-25 pivot)

The original plan was "crop the source page, serve the crop." The current one
(see docs/workstream-3b-3070-generated-visual-provenance-and-qa.md for the
full account) splits that into two distinct, separately-tracked assets per
question, matching the `visual_assets.asset_type` CHECK values:

- **`source_cropped`** — a raw, unmodified crop of the ORIGINAL source pixels
  for just this question's figure. This is provenance/reference material: proof
  of what the textbook actually printed, never redrawn or reinterpreted.
  Filename convention: `<question_uid>-item<N>-<figure>-CANDIDATE.<ext>` while
  unwired.
- **`ai_generated`** — a clean, professionally redrawn, native Board Ready
  visual (SVG where the figure is a diagram whose geometry can be exactly
  represented — a number line, a graph, a geometric construction — rather than
  a scanned illustration/photo). This is what actually gets served to
  students by default (see server.js's `getServableDiagramUrls`, which prefers
  `ai_generated` over `source_cropped` when both exist for a question) — the
  source crop stays in the database/asset store for audit, but a raw textbook-
  page crop is not the student-facing visual once a faithful redraw exists.
  Filename convention: `<question_uid>-item<N>-<figure>-GENERATED.svg`.

An `ai_generated` SVG must be built to inherit its colors from the live page's
own CSS custom properties (`var(--ink)`, `var(--violet)`, etc. — see
public/app.js's `createDiagramLoader`/`loadDiagram`) rather than hardcoding
colors or relying on `@media (prefers-color-scheme)`, since this app's
light/dark mode is an explicit in-app toggle, not the OS setting — a plain
`<img src="....svg">` cannot see that toggle's state. It is fetched and
inlined into the DOM instead of loaded via `<img src>` for exactly this
reason. Every numerical label, scale, endpoint, open/closed circle, arrow,
and boundary marking must be reproduced exactly from the verified source —
never invented, simplified, or reinterpreted — and documented with a visual-QA
comparison against the source before it is ever proposed for association.

`demo-fig-9-21.png` is an earlier, still-unwired `source_cropped`-style proof
crop (CBSE Class 10 Maths, Trigonometric Ratios chapter, Fig. 9.21 — question
id 4418's actual figure), made purely to prove the serve/render/zoom code path
end-to-end before any question association existed. Still intentionally not
linked to any question.

`icse-mathematics-linear-inequation-ace0c077-item57-numberline-CANDIDATE.png`
and `...-GENERATED.svg` are the first full pair (`source_cropped` +
`ai_generated`) for question 3070 — see the provenance/QA doc above for the
complete chain and sign-off status.
