// Corrects the 27 PENDING-20260917-* source_files rows (ids 69-95) to
// proper, chapter/page-specific stable_ids and notes, now that every one
// of the 32-photo batch's images has been individually re-opened and its
// true chapter/page/item-range confirmed (the original stable_ids were
// explicitly UNCONFIRMED best-guesses formed while viewing the images
// inline in conversation, per PROJECT_PROGRESS.md's own instruction to
// correct them before ingesting).
//
// Findings (this session, 2026-09-17): the original guesses were
// significantly scrambled — several images guessed as one chapter turned
// out to be a different chapter entirely. Two genuine content gaps were
// found and are called out below; they are NOT fabricated or worked
// around, only documented.
const db = require('./db');

const CORRECTIONS = [
  // --- Circles (CBSE Ch.8) — COMPLETE, pages 8.13-8.22, items 1-70 + answer key ---
  { id: 69, stable: 'CBSE-MATH-CIRCLES-P8.13', section: 'Circles — Practice Exercises MCQs, p.8.13, items 1-11' },
  { id: 70, stable: 'CBSE-MATH-CIRCLES-P8.14', section: 'Circles — Practice Exercises MCQs, p.8.14, items 12-21' },
  { id: 71, stable: 'CBSE-MATH-CIRCLES-P8.15', section: 'Circles — Practice Exercises MCQs, p.8.15, items 22-29' },
  { id: 72, stable: 'CBSE-MATH-CIRCLES-P8.16', section: 'Circles — Practice Exercises MCQs, p.8.16, items 30-36' },
  { id: 73, stable: 'CBSE-MATH-CIRCLES-P8.17', section: 'Circles — Practice Exercises MCQs, p.8.17, items 37-43' },
  { id: 74, stable: 'CBSE-MATH-CIRCLES-P8.18', section: 'Circles — Practice Exercises MCQs, p.8.18, items 44-53 (item 53 fig. on next page)' },
  { id: 75, stable: 'CBSE-MATH-CIRCLES-P8.19', section: 'Circles — Practice Exercises MCQs, p.8.19, items 54-61 (incl. item 53 fig. carried over)' },
  { id: 76, stable: 'CBSE-MATH-CIRCLES-P8.20', section: 'Circles — Practice Exercises MCQs, p.8.20, item 62 + Case Study MCQs 63-64' },
  { id: 77, stable: 'CBSE-MATH-CIRCLES-P8.21', section: 'Circles — Case Study 64(v) + Assertion-Reason MCQs 65-70, p.8.21' },
  { id: 78, stable: 'CBSE-MATH-CIRCLES-P8.22-ANSWERS', section: 'Circles — full ANSWER KEY, items 1-70, p.8.22' },

  // --- Trigonometric Ratios (CBSE Ch.9) — PARTIAL, items 1-2 and 27-37 only ---
  // GAP: page 9.12 (approx. items 3-26) was never photographed in this
  // upload and is genuinely missing — not ingested, not fabricated.
  { id: 79, stable: 'CBSE-MATH-TRIGRATIOS-P9.11', section: 'Trigonometric Ratios — Practice Exercises MCQs, p.9.11, items 1-2 (p.9.12, approx. items 3-26, MISSING from this upload)' },
  { id: 80, stable: 'CBSE-MATH-TRIGRATIOS-P9.13', section: 'Trigonometric Ratios — Practice Exercises MCQs, p.9.13, items 27-31 + Case Study 32 (i)-(ii)' },
  { id: 81, stable: 'CBSE-MATH-TRIGRATIOS-P9.14', section: 'Trigonometric Ratios — Case Study 32 (iii)-(v), Case Study 33, Case Study 34 start, p.9.14' },
  { id: 82, stable: 'CBSE-MATH-TRIGRATIOS-P9.15-ANSWERS', section: 'Trigonometric Ratios — Case Study 34 (Fig.9.23) cont., Assertion-Reason 35-37, full ANSWER KEY, p.9.15' },

  // --- Trigonometric Identities (CBSE Ch.10) — COMPLETE, pages 10.6-10.9, items 1-46 + answer key ---
  { id: 83, stable: 'CBSE-MATH-TRIGID-P10.6', section: 'Trigonometric Identities — Practice Exercises MCQs, p.10.6, items 1-3' },
  { id: 84, stable: 'CBSE-MATH-TRIGID-P10.7', section: 'Trigonometric Identities — Practice Exercises MCQs, p.10.7, items 4-17' },
  { id: 85, stable: 'CBSE-MATH-TRIGID-P10.8', section: 'Trigonometric Identities — Practice Exercises MCQs, p.10.8, items 18-36' },
  { id: 86, stable: 'CBSE-MATH-TRIGID-P10.9-ANSWERS', section: 'Trigonometric Identities — Assertion-Reason MCQs 37-46 + full ANSWER KEY, p.10.9' },

  // --- Heights and Distances (CBSE Ch.11) — COMPLETE, pages 11.10-11.15, items 1-31 (+ case studies) + answer key ---
  { id: 87, stable: 'CBSE-MATH-HEIGHTSDIST-P11.10', section: 'Heights and Distances — Practice Exercises MCQs, p.11.10, item 1' },
  { id: 88, stable: 'CBSE-MATH-HEIGHTSDIST-P11.11', section: 'Heights and Distances — Practice Exercises MCQs, p.11.11, items 2-13' },
  { id: 89, stable: 'CBSE-MATH-HEIGHTSDIST-P11.12', section: 'Heights and Distances — Practice Exercises MCQs, p.11.12, items 14-25' },
  { id: 90, stable: 'CBSE-MATH-HEIGHTSDIST-P11.13', section: 'Heights and Distances — items 26-28 + Case Study 29 (Fig.11.24, sky tower), p.11.13' },
  { id: 91, stable: 'CBSE-MATH-HEIGHTSDIST-P11.14', section: 'Heights and Distances — Case Study 30 (Fig.11.25, helicopter/swimmer) + item 31 start (Fig.11.26, TV tower), p.11.14' },
  { id: 92, stable: 'CBSE-MATH-HEIGHTSDIST-P11.15-ANSWERS', section: 'Heights and Distances — item 31 cont. + full ANSWER KEY, p.11.15' },

  // --- Areas Related to Circles (CBSE Ch.12) — PARTIAL, items 1-37 only, NO answer key captured ---
  // GAP: page 12.16 onward (item 37's Fig.12.23, any further items, and the
  // entire printed answer key) was never photographed — genuinely missing.
  { id: 93, stable: 'CBSE-MATH-AREASCIRCLES-P12.13', section: 'Areas Related to Circles — Practice Exercises MCQs, p.12.13, items 1-8 (no answer key captured for this chapter — see p.12.16+ gap)' },
  { id: 94, stable: 'CBSE-MATH-AREASCIRCLES-P12.14', section: 'Areas Related to Circles — Practice Exercises MCQs, p.12.14, items 9-25' },
  { id: 95, stable: 'CBSE-MATH-AREASCIRCLES-P12.15', section: 'Areas Related to Circles — Practice Exercises MCQs, p.12.15, items 26-37 (item 37 Fig.12.23 and the chapter answer key are on p.12.16+, MISSING from this upload)' },
];

const update = db.prepare('UPDATE source_files SET stable_id = ?, source_section = ? WHERE id = ?');
for (const c of CORRECTIONS) {
  const info = update.run(c.stable, c.section, c.id);
  console.log(c.id, '->', c.stable, info.changes === 1 ? 'OK' : 'NO ROW CHANGED');
}
