// CBSE Mathematics content-promotion campaign, Batch 12 (Pair of Linear
// Equations in Two Variables tail + start of Quadratic Equations, ids
// 4615-4644). Every candidate below was independently re-derived from
// first principles (ratio-consistency conditions for linear-equation
// systems, direct elimination, discriminant reasoning, root
// substitution) per
// docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before
// being included here. All 25 candidates in this range verified correct
// -- 0 new defects among THIS batch's own candidates.
//
// IMPORTANT SIDE FINDING (not part of this batch's promotion scope):
// duplicate_flags row 386 flags id 4636 (in this batch) against id 68 --
// a LEGACY pre-provenance row (question_uid=NULL, source_document_id=
// NULL, one of the 15 rows ids 60-74 identified in the CBSE Maths
// reconciliation report) at similarity 1.0. id 68 is NOT part of this
// campaign's candidate pool (status is already 'verified' i.e. already
// gradable; answer_status='source_provided', diagram_status=
// 'needs_visual_review' -- it never matched the pool filter). Comparing
// id 68's own four options independently: option index 1
// ("x^3 - x^2 = (x-1)^3") reduces to 2x^2-3x+1=0 (genuinely quadratic)
// AND option index 2 ("2x - x^2 = x^2 + 5", the CREDITED answer) reduces
// to -2x^2+2x-5=0 (also genuinely quadratic) -- id 68 has TWO valid
// answers among its four options, not one. This is a live MCQ
// construction defect in an already-`verified`/gradable row, found only
// as a side effect of checking a duplicate_flags hit against a new
// candidate. id 68 is explicitly OUT OF SCOPE for this campaign (it is
// not in the transcribed/verified/not_applicable pool and modifying an
// already-live legacy row requires its own separate authorization) --
// NOT touched here. Disclosed prominently in the cumulative audit and
// flagged to the user directly; id 4636 itself was independently
// checked against ITS OWN four options and has exactly one valid
// quadratic (option index 3), so it is safe to promote on its own
// merits regardless of id 68's separate defect.
//
// Scope: `status` transcribed->verified only, via the shared guarded
// helper in scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-12-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4615, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-f4f31673', correct: 1, optionsJson: '["36 sq. units","18 sq. units","9 sq. units","72 sq. units"]' },
  { id: 4616, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-e0f0fc4f', correct: 0, optionsJson: '["1/2 sq. unit","1 sq. unit","2 sq. unit","None of these"]' },
  { id: 4617, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-fb04e4ed', correct: 3, optionsJson: '["25","72","63","36"]' },
  { id: 4618, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-a30f6450', correct: 3, optionsJson: '["35 and 15","35 and 20","15 and 35","25 and 25"]' },
  { id: 4619, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-02e39ba5', correct: 2, optionsJson: '["-7","7","9","-9"]' },
  { id: 4620, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-2690170f', correct: 0, optionsJson: '["9","5","7","18"]' },
  { id: 4621, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-bccddce7', correct: 3, optionsJson: '["10x + 14y + 4 = 0","-10x - 14y + 4 = 0","-10x + 14y + 4 = 0","10x - 14y = -4"]' },
  { id: 4622, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-d6e4bbd5', correct: 0, optionsJson: '["5","6","7","8"]' },
  { id: 4623, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-27518641', correct: 1, optionsJson: '["0","1","2","infinite"]' },
  { id: 4627, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-fb65158f', correct: 0, optionsJson: '["Parallel","Intersecting","Coincident","Perpendicular to each other"]' },
  { id: 4628, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-d128a68e', correct: 3, optionsJson: '["unique solution","exactly two solutions","infinitely many solutions","no solution"]' },
  { id: 4629, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-ae214062', correct: 0, optionsJson: '["has unique solution","has no solution","has infinitely many solutions","may have infinitely many solutions or no solution"]' },
  { id: 4632, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-2800f728', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4633, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-db57629f', correct: 3, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4634, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-80b6db23', correct: 3, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4635, uid: 'cbse-mathematics-pair-of-linear-equations-in-two-variables-660bf010', correct: 2, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4636, uid: 'cbse-mathematics-quadratic-equations-b79c96b3', correct: 3, optionsJson: '["x² + 2x + 1 = (4 - x)² + 3","-2x² = (5 - x)(2x - 2/5)","(k + 1)x² + (3/2)x = 7, where k = -1","x³ - x² = (x - 1)³"]' },
  { id: 4637, uid: 'cbse-mathematics-quadratic-equations-70bb3478', correct: 2, optionsJson: '["2(x - 1)² = 4x² - 2x + 1","2x - x² = x² + 5","(√2 x + √3)² + x² = 3x² - 5x","(x² + 2x)² = x⁴ + 3 + 4x³"]' },
  { id: 4638, uid: 'cbse-mathematics-quadratic-equations-9ce90cd3', correct: 2, optionsJson: '["x² - 4x + 5 = 0","x² + 3x - 12 = 0","2x² - 7x + 6 = 0","3x² - 6x - 2 = 0"]' },
  { id: 4639, uid: 'cbse-mathematics-quadratic-equations-37bd5d9b', correct: 1, optionsJson: '["2x² - 3x + 6 = 0","-x² + 3x - 3 = 0","√2x² - (3/√2)x + 1 = 0","3x² - 3x + 3 = 0"]' },
  { id: 4640, uid: 'cbse-mathematics-quadratic-equations-0ee587d1', correct: 2, optionsJson: '["two distinct real roots","two equal real roots","no real roots","more than 2 real roots"]' },
  { id: 4641, uid: 'cbse-mathematics-quadratic-equations-9b9def28', correct: 1, optionsJson: '["2x² - 3√2x + 9/4 = 0","x² + x - 5 = 0","x² + 3x + 2√2 = 0","5x² - 3x + 1 = 0"]' },
  { id: 4642, uid: 'cbse-mathematics-quadratic-equations-1ad0c18c', correct: 0, optionsJson: '["x² - 4x + 3√2 = 0","x² + 4x - 3√2 = 0","x² - 4x - 3√2 = 0","3x² + 4√3x + 4 = 0"]' },
  { id: 4643, uid: 'cbse-mathematics-quadratic-equations-7bb831f9', correct: 2, optionsJson: '["four real roots","two real roots","no real roots","one real root"]' },
  { id: 4644, uid: 'cbse-mathematics-quadratic-equations-5bd2f073', correct: 2, optionsJson: '["1","10","0.1","100"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 12, Pair of Linear Equations tail + Quadratic Equations start). No exclusions this batch (id 68's defect is a separate, out-of-scope legacy row).\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
