# Visual Reconstruction — Question 2061 (Batch 15, Task 11)

**Status: proposed. NOT live-associated.** Question 2061's `diagram_status`
remains `needs_visual_review` — no `visual_assets` rows are inserted into
the live database. This is a separate concern from Task 7's already-applied
fix to this same question's `correct` field format
(`docs/workstream-4g-2061-format-correction-record.md`, commit `d14722f`) —
that correction is already live; this document only concerns the diagram.

## The question

`icse-chemistry-electrolysis-c018bc46` (id 2061), ICSE Chemistry,
Electrolysis, `source_document_id=60` (`competency.pdf`), `source_section=
'Competency Focused'`, `source_question_number='3'`.

Text: "The diagram represents electrolysis of molten lead bromide. The
incorrect statement for the above electrolysis is:" with 4 options
referencing electrodes 'X' and 'Y' by name (option (c): "The electrode
reaction at 'Y' is – Pb2+ + 2e- → Pb"; option (d): "At 'X' – bromine ions,
give up electrons..."). The question is unanswerable without the diagram —
the electrode labels X and Y have no meaning without it.

## Source evidence

`source_library/ICSE/Chemistry/competency.pdf`, file page index 8 (Chapter
5: Electrolysis, MCQ item 3), sha256
`e595a5875e64ecbbbf35edb8a2549f5ab4ab6836725b1fb45608c38be9708d6e`. Rendered
at high zoom directly from the PDF this session.

The figure: a circuit loop with a "+"-labelled wire through an open-switch
symbol to a 2-cell battery (four bars, alternating long/short), then a
"−"-labelled wire continuing around. From the "+" side, the wire descends
through a rheostat (zigzag) and across to the left graphite electrode,
labelled "Graphite [X]" via a leader/arrow. From the "−" side, the wire
descends through an ammeter (circle marked "A") and across to the right
graphite electrode, labelled "Graphite [Y]" via a leader/arrow. Both
electrodes dip into a crucible labelled "Molten lead bromide" (leader
pointing into the liquid). The crucible sits on a stand, heated from below
by a Bunsen burner with a visible flame — directly illustrating option
(b)'s text ("the crucible is heated from outside").

A clean crop of the figure (some unavoidable bleed of adjacent option text
at the edges — the diagram is embedded inline within wrapped body text in
this scan, with no separate image bbox to crop against precisely) is saved
as the immutable `source_cropped` reference:
`extracted-diagrams/icse-chemistry-electrolysis-c018bc46-item3-leadbromideapparatus-CANDIDATE.png`.

## The redraw

`extracted-diagrams/icse-chemistry-electrolysis-c018bc46-item3-leadbromideapparatus-GENERATED.svg`.
Full source correspondence and every design decision is documented inline
in the SVG's own HTML comment; summarized here:

- Same circuit topology as the source: "+" → switch → battery → "−" →
  ammeter → electrode Y; "+" corner → rheostat → electrode X — reproduced
  exactly, not simplified or rewired.
- Same two labelled electrodes (Graphite [X] left, Graphite [Y] right),
  same crucible/molten-lead-bromide labelling, same stand-and-burner
  heating arrangement.
- **Disclosed simplifications (rendering style, not content)**: the
  source's photographically-shaded crucible and burner are redrawn as flat,
  theme-aware shapes (the same "clean redraw, not a photo trace" approach
  used throughout this pipeline) — same silhouette, same two electrodes
  visibly piercing the liquid, same stand-and-flame arrangement, just
  without the source's 3D photographic shading. No electrical component,
  connection, or label is added, removed, or relocated relative to the
  source.

## Browser QA — 8/8 combinations passed

`scripts/verify-2061-visual-rendering.js` (modeled on
`scripts/verify-1508-visual-rendering.js`): isolated, disposable test
database (never `boardready.db`) seeded with a byte-for-byte copy of 2061's
real content (read-only SELECT only, confirming `correct` is already the
numeric `0` from Task 7's fix) plus both the `source_cropped` and
`ai_generated` visual_assets rows, a real `node server.js`, a real Chromium
browser (Playwright) driven through the exact steps a student would take.

Verified:
- API level: `diagramUrl` resolves to the `ai_generated` SVG.
- Frontend takes the inline-SVG path (`#qDiagramImg` hidden with no `src`;
  `#qDiagramSvgHost` visible with a real `<svg>` inside).
- DOM semantic checks on every pass: exactly 2 `.eb-elec` electrodes,
  exactly 1 `.eb-amm` ammeter circle, exactly 2 `.eb-celllong` + 2
  `.eb-cellshort` battery bars, exactly 1 `.eb-crucible` bowl, exactly 1
  `.eb-flame`.
- All 8 combinations (dark/light theme × desktop/mobile viewport × question
  view/lightbox zoom) passed with no unexpected console/page errors (only
  the expected sandboxed Google-Fonts network block, ignored as in every
  prior run).
- Screenshots saved to `docs/workstream-4l-2061-visual-qa-screenshots/`
  (8 files). Spot-checked light-desktop-lightbox and dark-mobile visually
  this session — both render cleanly: legible labels and correct ink color
  in both themes, circuit topology matches the source exactly.
- Live `boardready.db` hash confirmed unchanged before/after the script run
  (`c59d0173ca227dc01708abc13eef988db8ac98f88c2813d9013de94246c2e885` both
  times) — this script never touches the live database beyond the initial
  read-only SELECT.

**Task 11: COMPLETED / PROPOSED.** No live association performed — 2061's
`diagram_status` remains `needs_visual_review`; this visual is ready as a
candidate for a future association task once that gate clears (separately
from the content-status question of whether 2061 itself, and the other 121
same-batch rows flagged in workstream-4g, are fit for promotion).
