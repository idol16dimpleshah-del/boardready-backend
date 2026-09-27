// CBSE Mathematics content-promotion campaign, Batch 13 (Quadratic
// Equations, ids 4645-4674). Every candidate below was independently
// re-derived from first principles per
// docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before
// being included here.
//
// id 4646 is DELIBERATELY EXCLUDED (C, MCQ-construction defect,
// SOURCE-CONFIRMED): "Which of the following is not a quadratic
// equation?" (page 4.13, Q11). Independently reducing all four options:
//   (a) 3(x+1)^2 = 2x^2+x+4      -> x^2+5x-1=0            (quadratic)
//   (b) 5x+2x^2 = x^2+9          -> x^2+5x-9=0            (quadratic)
//   (c) (x^2-2x)^2 = x^4+3+4x^2  -> -4x^3-3=0             (CUBIC)
//   (d) (root2 x + root3)^2 = 2x^2-3x -> (2*root6+3)x+3=0 (LINEAR)
// The credited answer is (c) ("not quadratic"), which is true -- but (d)
// is ALSO not quadratic. Two of the four options answer "not a quadratic
// equation" correctly, so a student selecting (d) has given a
// mathematically valid answer and would be marked wrong. Verified
// directly against the physical scanned source
// (source_library/CBSE/Mathematics/ch3-4.pdf, page 4.13, item 11): the
// DB's stored text/options/printed-answer-key match the scan exactly, so
// this defect is IN THE SOURCE ITSELF, not introduced during
// transcription -- the first defect this campaign has traced all the way
// to the printed textbook rather than to transcription or an ambiguous
// OCR read. Held pending the same kind of resolution given to legacy id
// 68 (this is NOT that row; id 68 was a separate, out-of-provenance
// legacy row already handled in
// docs/correction-record-id68-legacy-quadratic-retirement.md). id 4646
// stays at status='transcribed' and is not touched by this script.
//
// Also disclosed (NOT defects, found while cross-checking the batch
// against the physical source page 4.13, and NOT altering promotion
// scope):
//   - The source's OWN PRINTED answer key is itself wrong at Q12 (source
//     prints "(b)" but only option (a), "x^2-4x+3=0", actually has 3 as
//     a root -- verified by direct substitution). id 4647's DB-stored
//     `correct=0` (option (a)) is already independently correct, so it
//     promotes normally; this is a disclosure about the print, not a
//     defect in this row.
//   - The source's own printed answer key is also wrong at Q13 (source
//     prints "(c)" / "exactly two roots", but a quadratic can have 0, 1,
//     or 2 real roots, so the mathematically correct answer is "(b)" /
//     "at most two roots" -- consistent with the source's own stated
//     revision-notes framework on page 4.1). id 4648's DB-stored
//     `correct=1` (option (b)) is already independently correct, so it
//     promotes normally; again a disclosure about the print, not a
//     defect in this row.
//   These two findings reinforce the campaign's standing "trust neither
//   the print nor the stored value blindly" methodology: in both cases
//   the DB is right and the textbook's own answer key is wrong.
//   - duplicate_flags row 388 flags id 4646 (excluded above on its own
//     merits) against already-promoted id 4637 at similarity 1.0 -- both
//     share the recurring stem "Which of the following is not a
//     quadratic equation?" but have entirely different option sets
//     (id 4637 = page 4.12 Q2, id 4646 = page 4.13 Q11). Same
//     template/different-content false-positive pattern seen throughout
//     this campaign; moot for this batch since id 4646 is held anyway.
//   - duplicate_flags row 389 flags id 4647 ("has 3 as a root") against
//     already-promoted id 4638 ("has 2 as a root") at similarity 0.82 --
//     same archetype, different specific root value, different options,
//     different answer index. Confirmed false positive; id 4647 promotes
//     normally.
//
// Scope: `status` transcribed->verified only, via the shared guarded
// helper in scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-13-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4645, uid: 'cbse-mathematics-quadratic-equations-6f6b37b3', correct: 1, optionsJson: '["-2","2","1/4","1/2"]' },
  { id: 4647, uid: 'cbse-mathematics-quadratic-equations-2d7d0d03', correct: 0, optionsJson: '["x² - 4x + 3 = 0","x² + 4x + 3 = 0","x² + 5x + 6 = 0","x² + 7x + 12 = 0"]' },
  { id: 4648, uid: 'cbse-mathematics-quadratic-equations-f9b120ae', correct: 1, optionsJson: '["at least two roots","at most two roots","exactly two roots","any number of roots"]' },
  { id: 4649, uid: 'cbse-mathematics-quadratic-equations-702f6d57', correct: 3, optionsJson: '["-2","2","4","0"]' },
  { id: 4650, uid: 'cbse-mathematics-quadratic-equations-dcfb35ec', correct: 2, optionsJson: '["6, -1/6","36, -36","6, -6","3/4, -3/4"]' },
  { id: 4653, uid: 'cbse-mathematics-quadratic-equations-0ba2a97f', correct: 3, optionsJson: '["6","-6","-1","1"]' },
  { id: 4654, uid: 'cbse-mathematics-quadratic-equations-315bcd52', correct: 1, optionsJson: '["x² + 4 = 0","x² - 4 = 0","4x² - 1 = 0","x² - 2 = 0"]' },
  { id: 4656, uid: 'cbse-mathematics-quadratic-equations-483c3ce1', correct: 2, optionsJson: '["-2","2","-1/2","1/2"]' },
  { id: 4657, uid: 'cbse-mathematics-quadratic-equations-07e7bd00', correct: 2, optionsJson: '["3","3.5","6","-3"]' },
  { id: 4658, uid: 'cbse-mathematics-quadratic-equations-253f211c', correct: 0, optionsJson: '["k < 4","k > 4","k ≥ 4","k ≤ 4"]' },
  { id: 4659, uid: 'cbse-mathematics-quadratic-equations-d52306e7', correct: 3, optionsJson: '["-b/2a","b/2a","-b²/4a","b²/4a"]' },
  { id: 4660, uid: 'cbse-mathematics-quadratic-equations-7bb284ec', correct: 1, optionsJson: '["4","3","-2","3.5"]' },
  { id: 4661, uid: 'cbse-mathematics-quadratic-equations-b99ecca6', correct: 2, optionsJson: '["8","-8","16","-16"]' },
  { id: 4663, uid: 'cbse-mathematics-quadratic-equations-0b1dd543', correct: 0, optionsJson: '["b²/a","b²/4a","a²/b","a²/4b"]' },
  { id: 4664, uid: 'cbse-mathematics-quadratic-equations-0419057b', correct: 1, optionsJson: '["-2/3, 1","2/3, -1","3/2, 1/3","-3/2, -1/3"]' },
  { id: 4666, uid: 'cbse-mathematics-quadratic-equations-4d7d346a', correct: 1, optionsJson: '["6","7","1","5"]' },
  { id: 4667, uid: 'cbse-mathematics-quadratic-equations-9ecfb9a0', correct: 0, optionsJson: '["8","-8","4","-4"]' },
  { id: 4668, uid: 'cbse-mathematics-quadratic-equations-be57e58f', correct: 2, optionsJson: '["|a| = 2","|a| < 2","|a| > 2","None of these"]' },
  { id: 4669, uid: 'cbse-mathematics-quadratic-equations-fce84b85', correct: 0, optionsJson: '["±2/3","±3/2","0","±3"]' },
  { id: 4670, uid: 'cbse-mathematics-quadratic-equations-0821b529', correct: 0, optionsJson: '["a = ±1","a = 0","a = 0, 1","a = -1, 0"]' },
  { id: 4671, uid: 'cbse-mathematics-quadratic-equations-2355c5b4', correct: 3, optionsJson: '["4","8","12","16"]' },
  { id: 4672, uid: 'cbse-mathematics-quadratic-equations-9763a61e', correct: 1, optionsJson: '["ab = cd","ad = bc","ad = √(bc)","ab = √(cd)"]' },
  { id: 4673, uid: 'cbse-mathematics-quadratic-equations-e03f0ebd', correct: 1, optionsJson: '["2b = a + c","b² = ac","b = 2ac/(a+c)","b = ac"]' },
  { id: 4674, uid: 'cbse-mathematics-quadratic-equations-d8da4395', correct: 1, optionsJson: '["-3 < b < 3","-2 < b < 2","b > 2","b < -2"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 13, Quadratic Equations). id 4646 excluded (C, source-confirmed MCQ-construction defect).\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
