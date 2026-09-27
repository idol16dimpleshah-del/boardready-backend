// CBSE Mathematics content-promotion campaign, Batch 8 (Real Numbers,
// ids 4499-4526). Every candidate below was independently re-derived from
// first principles per
// docs/workstream-6b-cbse-maths-promotion-cumulative-audit.md before being
// included here.
//
// Three ids in this range are DELIBERATELY EXCLUDED:
// - id 4516 (D, source/structural defect): options_json has only 3 entries
//   (["1","99","300"]) instead of the bank's standard 4 -- the credited
//   answer ("99") is still uniquely correct among the 3, but this looks
//   like a dropped 4th option during transcription rather than a genuine
//   3-option source question. Held pending confirmation against source.
// - id 4517 (C, case question, two defective parts): part (ii) asks what
//   536 "can be arranged in groups of" among ["2's","3's","4's","5's"] --
//   536 = 2^3 x 67 is divisible by BOTH 2 and 4, so the credited answer
//   (2's) is correct but not uniquely so; part (iii) is worse -- 540 is
//   divisible by 2, 3, AND 4 (three of its four options), only 11 is
//   false. Both are genuine multiple-valid-answer defects, the same class
//   of "duplicate-value/ambiguous-option" issue as id 4352/4404, just
//   surfacing as multiple TRUE options rather than one value written
//   twice. Held for review.
// - id 4519 (C, case question, unverified sub-parts): the question's own
//   stored explanation admits parts (ii)-(v) were never independently
//   re-simulated step-by-step ("kept as printed, disclosed here rather
//   than silently presented as independently verified") -- meaning
//   answer_status was set to 'verified' without actually completing that
//   verification for 4 of 5 parts. This is exactly the gap this campaign
//   exists to catch, not from a computational error but from unfinished
//   verification. Held for a proper multi-turn simulation before
//   promotion.
//
// Scope: `status` transcribed->verified only, via the shared guarded
// helper in scripts/lib/promote-status-batch.js.
//
// Usage: node scripts/apply-cbse-maths-batch-08-promotion.js /path/to/boardready.db

const path = require('node:path');
const { promoteStatusBatch } = require('./lib/promote-status-batch');

const DB_PATH = process.argv[2] || path.join(__dirname, '..', 'boardready.db');

const CANDIDATES = [
  { id: 4499, uid: 'cbse-mathematics-real-numbers-1ea901a8', correct: 2, optionsJson: '["√27","3√3","√3","3"]' },
  { id: 4500, uid: 'cbse-mathematics-real-numbers-49469eef', correct: 2, optionsJson: '["6:07 AM","6:14 AM","6:28 AM","6:25 AM"]' },
  { id: 4501, uid: 'cbse-mathematics-real-numbers-ea9e24ea', correct: 2, optionsJson: '["5","13","both 5 and 13","none of these"]' },
  { id: 4502, uid: 'cbse-mathematics-real-numbers-e012085c', correct: 0, optionsJson: '["1","3","5","7"]' },
  { id: 4503, uid: 'cbse-mathematics-real-numbers-f800eff1', correct: 0, optionsJson: '["1","3","2","4"]' },
  { id: 4504, uid: 'cbse-mathematics-real-numbers-2c9bd444', correct: 2, optionsJson: '["m","m + 1","2m","2m + 1"]' },
  { id: 4505, uid: 'cbse-mathematics-real-numbers-ccab5997', correct: 3, optionsJson: '["q","q + 1","2q","2q + 1"]' },
  { id: 4506, uid: 'cbse-mathematics-real-numbers-7f133622', correct: 2, optionsJson: '["rational numbers","irrational numbers","real numbers","integers"]' },
  { id: 4507, uid: 'cbse-mathematics-real-numbers-af011108', correct: 1, optionsJson: '["any natural number","an even number","an odd number","none of these"]' },
  { id: 4508, uid: 'cbse-mathematics-real-numbers-042e0826', correct: 0, optionsJson: '["always irrational","always rational","rational or irrational","one"]' },
  { id: 4509, uid: 'cbse-mathematics-real-numbers-66a81585', correct: 2, optionsJson: '["16","34","both 16 and 34","none of these"]' },
  { id: 4510, uid: 'cbse-mathematics-real-numbers-1d5d450d', correct: 1, optionsJson: '["a multiple of their LCM","a factor of their LCM","divisible by their LCM","none of these"]' },
  { id: 4511, uid: 'cbse-mathematics-real-numbers-8b6f19ba', correct: 1, optionsJson: '["5","13","40","8"]' },
  { id: 4512, uid: 'cbse-mathematics-real-numbers-8f67eb7c', correct: 3, optionsJson: '["258","231","462","924"]' },
  { id: 4513, uid: 'cbse-mathematics-real-numbers-10a1b2d2', correct: 2, optionsJson: '["23","276","138","69"]' },
  { id: 4514, uid: 'cbse-mathematics-real-numbers-2ba77d66', correct: 2, optionsJson: '["(√16, √4)","(√5, √2)","(√3, √27)","(√36, √2)"]' },
  { id: 4515, uid: 'cbse-mathematics-real-numbers-71e42871', correct: 3, optionsJson: '["√20","√2","5","√5"]' },
  { id: 4518, uid: 'cbse-mathematics-real-numbers-c4d25b07', correct: null, optionsJson: null, partsJson: '[{"text":"(i) How many maximum guests can Mira invite?","options":["6","96","12","180"],"correct":2,"marks":1},{"text":"(ii) How many apples will each guest get?","options":["3","6","4","5"],"correct":0,"marks":1},{"text":"(iii) How many bananas will each guest get?","options":["3","6","4","5"],"correct":3,"marks":1},{"text":"(iv) If Mira also decides to distribute 42 mangoes, how many maximum guests can she invite?","options":["12","6","8","180"],"correct":1,"marks":1},{"text":"(v) How many total fruits will each guest get?","options":["23","25","17","18"],"correct":0,"marks":1}]' },
  { id: 4521, uid: 'cbse-mathematics-real-numbers-57460e5c', correct: 3, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4522, uid: 'cbse-mathematics-real-numbers-193ab8f2', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4523, uid: 'cbse-mathematics-real-numbers-df08d2a6', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4525, uid: 'cbse-mathematics-real-numbers-4ba1ebbc', correct: 0, optionsJson: '["(a)","(b)","(c)","(d)"]' },
  { id: 4526, uid: 'cbse-mathematics-real-numbers-3731ce3d', correct: 2, optionsJson: '["(a)","(b)","(c)","(d)"]' },
];

console.log(`Target database: ${DB_PATH}`);
console.log(`Promoting ${CANDIDATES.length} candidates (Batch 8, Real Numbers). ids 4516 (D), 4517 (C), 4519 (C) excluded.\n`);

const { promoted, failed } = promoteStatusBatch(DB_PATH, CANDIDATES);

console.log(`\nPromoted: ${promoted.length}/${CANDIDATES.length}`);
if (failed.length) {
  console.log('FAILURES:', JSON.stringify(failed, null, 1));
  process.exitCode = 1;
}
