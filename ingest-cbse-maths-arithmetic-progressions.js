// CBSE Class 10 Mathematics — Arithmetic Progressions (Chapter 5).
// Source: chap_5-6.pdf (source_files.id 120), pp.5.11-5.21.
// Founder's target count for this chapter: 68 (from the mid-session
// message listing minimum expected counts per chapter in book order:
// "69,62,42,57,68,83,47,70,37,46,31,68,55,58,61"). This ingestion
// captures exactly 68 items (1-54 plain MCQs, 55-60 case studies,
// 61 an open/descriptive item, 62-68 assertion-reason), matching the
// printed answer key's own numbering exactly (key ends "68.(c)").
//
// TRANSCRIPTION METHOD: chap_5-6.pdf has a pypdf-extractable text
// layer, but it is OCR-garbled for anything with fractions/exponents/
// square roots (about half the items here). Every item's exact
// stem/options was instead read directly from rendered page images
// (pdftoppm -r 200) via the Read tool, not from the garbled text
// extraction — the text layer was only used for a first-pass skim to
// locate page boundaries.
//
// VERIFICATION METHOD: every one of the 54 plain MCQs and every case
// study/assertion-reason item was independently recomputed from AP
// formulas (an = a+(n-1)d, Sn = n/2[2a+(n-1)d], standard "replace n by
// 2n-1" trick for term-ratio-from-sum-ratio problems, and the classic
// Sp=q/Sq=p => S(p+q)=-(p+q) style identities) rather than copied
// blindly from the printed key. This chapter's key is reliable EXCEPT
// for one confirmed genuine defect:
//   - Item 50: "Which term of the A.P. -29,-26,-23,...,61 is 16?"
//     a=-29, d=3. Solving -29+3(n-1)=16 gives n=16, i.e. the 16th term
//     equals 16 — option (b). The printed key says (d) 31st, but the
//     31st term of this AP is 61 (the AP's own stated last term), not
//     16 — the key appears to have answered "which term equals 61"
//     instead of the question actually asked ("...is 16?"). Corrected
//     to (b) here and flagged needs_review with the discrepancy
//     disclosed in the explanation.
// All other 53 plain MCQs, both assertion-reason items requiring
// derivation (42, 43, 44 in particular — each independently re-derived
// algebraically, not just trusted), and all six case studies (55-60)
// matched the printed key exactly.
//
// GENUINE SOURCE GAP — case study 55 (lumber logs), sub-parts (iii)
// and (iv): the photographed page spread jumps from item 55's part
// (ii) (bottom of book p.5.16) straight to part (v) (top of book
// p.5.17) with parts (iii) and (iv) missing — a physical gap between
// the two photographed pages, not a mis-crop (confirmed by re-cropping
// both page edges at higher resolution: p.5.17 genuinely starts mid-
// case-study at "(v)"). Per this project's standing rule to never
// invent a stem/options the source didn't legibly provide, this case
// study is captured here with ONLY its three legible parts (i, ii, v)
// and the gap is disclosed in the explanation rather than guessed at.
// The printed answer key's own numbering confirms the two missing
// parts existed ("55. (i)(b) (ii)(c) (iii)(a) (iv)(d) (v)(b)") — flagged
// needs_visual_review + needs_review on this case item.
//
// DIAGRAM PRESERVATION: items 1-54 and 62-68 are plain algebraic/
// assertion-reason MCQs with no figure — diagramStatus 'not_applicable'.
// Case studies 55-60 and open item 61 all reference a named figure
// (Figs. 5.7-5.13) and get diagramStatus 'source_diagram_preserved'.
const { ingestQuestions } = require('./ingest');

const SF = 120; // source_files.id for chap_5-6.pdf
const P512 = '5.12', P513 = '5.13', P514 = '5.14', P515 = '5.15', P516 = '5.16',
  P517 = '5.17', P518 = '5.18', P519 = '5.19', P520 = '5.20', P521 = '5.21';

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.5.21, item ${n} (independently re-verified by computation)`,
  ...opts,
});

const items = [];

// p.5.12-5.13 — items 1-9
items.push(mcq(1, P512, 'The common difference of the A.P. 1/(2q), (1-2q)/(2q), (1-4q)/(2q), ... is', ['-1', '1', 'q', '2q'], 0, { source: 'CBSE 2013' }));
items.push(mcq(2, P512, 'The common difference of the A.P. 1/3, (1-3b)/3, (1-6b)/3, ... is', ['1/3', '-1/3', '-b', 'b'], 2, { source: 'CBSE 2013' }));
items.push(mcq(3, P513, 'The common difference of the A.P. 1/(2b), (1-6b)/(2b), (1-12b)/(2b), ... is', ['2b', '-2b', '3', '-3'], 3, { source: 'CBSE 2013' }));
items.push(mcq(4, P513, 'If k, 2k - 1 and 2k + 1 are three consecutive terms of an AP, the value of k is', ['-2', '3', '-3', '6'], 1, { source: 'CBSE 2014' }));
items.push(mcq(5, P513, 'The next term of the A.P. √7, √28, √63, ... is', ['√70', '√84', '√97', '√112'], 3, { source: 'CBSE 2014' }));
items.push(mcq(6, P513, 'The first three terms of an A.P. respectively are 3y - 1, 3y + 5 and 5y + 1. Then, y equals', ['-3', '4', '5', '2'], 2, { source: 'CBSE 2014' }));
items.push(mcq(7, P513, 'If 1/(x+2), 1/(x+3), 1/(x+5) are in A.P. Then, x =', ['5', '3', '1', '2']  , 2));
items.push(mcq(8, P513, "The n'th term of an A.P., the sum of whose n terms is Sn, is", ['Sn + S(n-1)', 'Sn - S(n-1)', 'Sn + S(n+1)', 'Sn - S(n+1)'], 1));
items.push(mcq(9, P513, 'The common difference of an A.P., the sum of whose n terms is Sn, is', ['Sn - 2S(n-1) + S(n-2)', 'Sn - 2S(n-1) - S(n-2)', 'Sn - S(n-2)', 'Sn - S(n-1)'], 0));
items.push(mcq(10, P513, 'The sum of first 20 odd natural numbers is', ['100', '210', '400', '420'], 2, { source: 'CBSE 2012' }));
items.push(mcq(11, P513, 'If 18, a, b, -3 are in A.P., the a + b =', ['19', '7', '11', '15'], 3));
items.push(mcq(12, P513, "The first term of an A.P. is p and the common difference is q, then its 10'th term is", ['q + 9p', 'p - 9q', 'p + 9q', '2p + 9q'], 2));
items.push(mcq(13, P513, 'The value of x for which 2x, x + 10 and 3x + 2 are the three consecutive terms of an A.P. is', ['-6', '18', '6', '-18'], 2, { source: 'CBSE 2020' }));
items.push(mcq(14, P513, 'If the sum of three consecutive terms of an increasing A.P. is 51 and the product of the first and third of these terms is 273, then the third term is', ['13', '9', '21', '17'], 2));
items.push(mcq(15, P513, '(3 - 1/n) + (3 - 2/n) + (3 - 3/n) + ... upto n terms is', ['(1/2)(3n - 1)', '(1/2)(3n + 1)', '(1/2)(5n - 1)', '(1/2)(5n + 1)'], 2));
items.push(mcq(16, P513, 'The sum of first 16 terms of the A.P.: 10, 6, 2, ..., is', ['-320', '320', '-352', '-400'], 0, { source: 'NCERT Exemplar' }));
items.push(mcq(17, P513, 'If the first term of an A.P. is -5 and the common difference is 2, then the sum of first 6 terms is', ['0', '5', '6', '15'], 0, { source: 'CBSE 2013, NCERT Exemplar' }));

// p.5.14 — items 18-33
items.push(mcq(18, P514, 'The 4th term from the end of the AP: -11, -8, -5, ..., 49 is', ['37', '40', '43', '58'], 1, { source: 'NCERT Exemplar' }));
items.push(mcq(19, P514, 'Which term of the A.P. 21, 42, 63, 84, ... is 210?', ['9th', '10th', '11th', '12th'], 1, { source: 'NCERT Exemplar' }));
items.push(mcq(20, P514, "If the 2nd term of an A.P. is 13 and 5th term is 25, what is its 7th term?", ['30', '33', '37', '38'], 1, { source: 'NCERT Exemplar' }));
items.push(mcq(21, P514, 'The first and last terms of an A.P. are 1 and 11. If the sum of its terms is 36, then the number of terms will be', ['5', '6', '7', '8'], 1, { source: 'NCERT Exemplar' }));
items.push(mcq(22, P514, 'If four numbers in A.P. are such that their sum is 50 and the greatest number is 4 times the least, then the numbers are', ['5, 10, 15, 20', '4, 10, 16, 22', '3, 7, 11, 15', 'none of these'], 0));
items.push(mcq(23, P514, 'If the first term of an A.P. is 2 and common difference is 4, then the sum of its 40 terms is', ['3200', '1600', '200', '2800'], 0));
items.push(mcq(24, P514, 'The number of terms of the A.P. 3, 7, 11, 15, ... to be taken so that the sum is 406 is', ['5', '10', '12', '14'], 3));
items.push(mcq(25, P514, 'Sum of n terms of the series √2 + √8 + √18 + √32 + ... is', ['n(n+1)/2', '2n(n+1)', 'n(n+1)/√2', '1'], 2));
items.push(mcq(26, P514, 'The 9th term of an A.P. is 449 and 449th term is 9. The term which is equal to zero is', ['501th', '502th', '458th', 'none of these'], 2));
items.push(mcq(27, P514, "If the first term of an A.P. is a and n'th term is b, then its common difference is", ['(b-a)/(n+1)', '(b-a)/(n-1)', '(b-a)/n', '(b+a)/(n-1)'], 1));
items.push(mcq(28, P514, 'If (5+9+13+... to n terms)/(7+9+11+... to (n+1) terms) = 17/16, then n =', ['8', '7', '10', '11'], 1));
items.push(mcq(29, P514, 'The sum of n terms of an A.P. is 3n^2 + 5n, then 164 is its', ['24th term', '27th term', '26th term', '25th term'], 1));
items.push(mcq(30, P514, "If the n'th term of an A.P. is 2n + 1, then the sum of first n terms of the A.P. is", ['n(n-2)', 'n(n+2)', 'n(n+1)', 'n(n-1)'], 1));
items.push(mcq(31, P514, 'The sum of first 24 terms of the sequence whose nth term is given by an = 3 + (2/3)n', ['270', '272', '382', '384'], 1));
items.push(mcq(32, P514, 'The sum of first five multiples of 3 is', ['45', '55', '65', '75'], 0, { source: 'NCERT Exemplar' }));
items.push(mcq(33, P514, 'If the sum of P terms of an A.P. is q and the sum of q terms is p, then the sum of p+q terms will be', ['0', 'p - q', 'p + q', '-(p+q)'], 3));

// p.5.15 — items 34-47
items.push(mcq(34, P515, 'If the sum of n terms of an A.P. be 3n^2 + n and its common difference is 6, then its first term is', ['2', '3', '1', '4'], 3, { source: 'CBSE 2023' }));
items.push(mcq(35, P515, "Two A.P.'s have the same common difference. The first term of one of these is 8 and that of the other is 3. The difference between their 30th terms is", ['11', '3', '8', '5'], 3, { source: 'CBSE Sample Paper 2024', explanation: 'Difference of 30th terms = (8+29d)-(3+29d) = 5, independent of d.' }));
items.push(mcq(36, P515, 'Let Sn denote the sum of n terms of an A.P. whose first term is a. If the common difference d is given by d = Sn - kS(n-1) + S(n-2), then k =', ['1', '2', '3', 'none of these'], 1));
items.push(mcq(37, P515, 'The first and last term of an A.P. are a and l respectively. If S is the sum of all the terms of the A.P. and the common difference is given by (l^2-a^2)/(k-(l+a)), then k =', ['S', '2S', '3S', 'none of these'], 1));
items.push(mcq(38, P515, 'If the sum of first n even natural numbers is equal to k times the sum of first n odd natural numbers, then k =', ['1/n', '(n-1)/n', '(n+1)/(2n)', '(n+1)/n'], 3));
items.push(mcq(39, P515, 'If the first, second and last term of an A.P. are a, b and 2a respectively, its sum is', ['ab/(2(b-a))', 'ab/(b-a)', '3ab/(2(b-a))', 'none of these'], 2));
items.push(mcq(40, P515, "If S1 is the sum of an arithmetic progression of 'n' odd number of terms and S2 the sum of the terms of the series in odd places, then S1/S2 =", ['2n/(n+1)', 'n/(n+1)', '(n+1)/(2n)', '(n+1)/n'], 0));
items.push(mcq(41, P515, "If in an A.P., Sn = n^2 p and Sm = m^2 p, where Sr denotes the sum of r terms of the A.P., then Sp is equal to", ['(1/2)p^3', 'mnp', 'p^3', '(m+n)p^2'], 2));
items.push(mcq(42, P515, 'If Sn denote the sum of the first n terms of an A.P. If S2n = 3Sn, then S3n:Sn is equal to', ['4', '6', '8', '10'], 1, { explanation: 'S2n=3Sn forces a=d(n+1)/2. Then 2a+(3n-1)d=4dn and 2a+(n-1)d=2dn, so S3n/Sn = 3*(4dn)/(2dn) = 6.' }));
items.push(mcq(43, P515, 'In an AP, Sp = q, Sq = p and Sr denotes the sum of first r terms. Then, S(p+q) is equal to', ['0', '-(p+q)', 'p+q', 'pq'], 1, { explanation: 'Standard identity: subtracting the two given sum formulas and simplifying gives 2a+d(p+q-1) = -2, so S(p+q) = (p+q)/2 * (-2) = -(p+q).' }));
items.push(mcq(44, P515, 'If Sr denotes the sum of the first r terms of an A.P. Then, S3n:(S2n - Sn) is', ['n', '3n', '3', 'none of these'], 2, { explanation: 'Writing Sn = An^2+Bn, S3n=9An^2+3Bn and S2n-Sn=3An^2+Bn, whose ratio is exactly 3 for any a, d.' }));
items.push(mcq(45, P515, "If the sums of n terms of two arithmetic progressions are in the ratio (3n+5)/(5n+7), then their n'th terms are in the ratio", ['(3n-1)/(5n-1)', '(3n+1)/(5n+1)', '(5n+1)/(3n+1)', '(5n-1)/(3n-1)'], 1, { explanation: "Standard trick: replace n by (2n-1) in the ratio of sums to get the ratio of n'th terms: (6n+2)/(10n+2) = (3n+1)/(5n+1)." }));
items.push(mcq(46, P515, 'If Sn denote sum of n terms of an A.P. with first term a and common difference d such that Sx/Skx is independent of x, then', ['d = a', 'd = 2a', 'a = 2d', 'd = -a'], 1, { explanation: 'Sx/Skx = [2a+(x-1)d] / [k(2a+(kx-1)d)]. For this ratio to not depend on x, the constant term 2a-d must vanish, i.e. d=2a.' }));
items.push(mcq(47, P515, "The sum of n terms of two A.P.'s are in the ratio 5n+9:9n+6. Then the ratio of their 18th term is", ['184/321', '178/321', '175/321', '176/321'], 0, { explanation: 'Replace n by 2n-1=35: (5*35+9)/(9*35+6) = 184/321.' }));

// p.5.16 — items 48-54
items.push(mcq(48, P516, 'The next term of the A.P. √6, √24, √54, .... is', ['√60', '√96', '√72', '√216'], 1, { source: 'CBSE 2023' }));
items.push(mcq(49, P516, 'The common difference of an A.P. in which a15 - a11 = 48, is', ['12', '16', '-12', '-16'], 0, { source: 'CBSE 2024' }));
items.push(mcq(50, P516, 'Which term of the A.P. -29, -26, -23, ..., 61 is 16?', ['11th', '16th', '10th', '31st'], 1, {
  source: 'CBSE 2024',
  answerStatus: 'needs_review',
  explanation: 'a=-29, d=3. Solving -29+3(n-1)=16 gives n-1=15, n=16 — the 16th term equals 16, option (b). The printed key gives (d) 31st, but the 31st term of this AP is 61 (the AP\'s own stated last value), which answers a different question ("which term is 61?") than the one actually asked ("...is 16?"). Treated as a genuine printed-key defect and corrected to (b) 16th.',
}));
items.push(mcq(51, P516, 'Three numbers in A.P. have the sum 30. What is the middle term?', ['4', '10', '16', '8'], 1, { source: 'CBSE 2024' }));
items.push(mcq(52, P516, 'The next (4th) term of the A.P. √18, √50, √98, .... is', ['√128', '√140', '√162', '√200'], 2, { source: 'CBSE 2022' }));
items.push(mcq(53, P516, 'The 14th term from the end of the A.P. -11, -8, -5, ..., 49 is', ['7', '10', '13', '28'], 1, { source: 'CBSE 2024' }));
items.push(mcq(54, P516, 'The common difference of the A.P. 1/(2x), (1-4x)/(2x), (1-8x)/(2x), ...., is', ['-2x', '-2', '2', '2x'], 1, { source: 'CBSE 2024' }));

// p.5.16-5.17 — Case Study 55 (lumber logs, Fig. 5.7)
items.push({
  kind: 'case', sourceQuestionNumber: '55', sourcePage: '5.16-5.17',
  text: 'Fig. 5.7: A lumber company stacks 200 logs in the following manner: 20 logs in the bottom row, 19 in the next row, 18 in the row next to it and so on.',
  parts: [
    { text: '(i) Number of logs in first row, second row, third row, ......', options: ['follow a pattern forming an A.P. with common difference 1.', 'follow a pattern forming an A.P. with common difference -1.', 'do not follow any specific pattern.', 'follow a pattern forming an A.P. with common difference 2.'], correct: 1, marks: 1 },
    { text: '(ii) The number of rows in which 200 logs are stacked is', options: ['25', '20', '16', '10'], correct: 2, marks: 1 },
    { text: '(v) The number of logs in the top two rows is', options: ['10', '11', '9', '12'], correct: 1, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 5.7 (stacked lumber logs)', assetType: 'source_page_full' }],
  answerStatus: 'needs_review',
  answerKeyRef: 'printed ANSWERS table, p.5.21, item 55: "(i)(b) (ii)(c) (iii)(a) (iv)(d) (v)(b)" (independently re-verified by computation for the parts captured here)',
  explanation: "a=20,d=-1: pattern is an AP with common difference -1 (i). Sn=200: n/2[40-(n-1)]=200 solves to n=16 or n=25; only n=16 keeps all row counts positive (ii). Top row (16th) = 20-15=5, second-from-top (15th)=6, so top two rows sum to 11 (v, matches key). GENUINE SOURCE GAP: sub-parts (iii) [top row count, key says (a)] and (iv) [middle rows, key says (d)] fall in a physical gap between the photographed pages (book p.5.16 ends right after part (ii); p.5.17 begins right at part (v)) — their exact stem/option text was never legibly captured in this scan, so per this project's rule against inventing question text, only the three legible parts (i, ii, v) are captured here. Flagged needs_review to record that this case study is incomplete relative to the printed original.",
});

// p.5.17-5.18 — Case Study 56 (terrace steps, Fig. 5.8)
items.push({
  kind: 'case', sourceQuestionNumber: '56', sourcePage: '5.17-5.18',
  text: 'Fig. 5.8: A small terrace at a football ground comprises of 15 steps each of which is 50 m long and built of solid concrete. Each step rises 1/4 m and has a tread of 1/2 m. Let V1, V2, V3, ..., V15 denote respectively the volumes of concrete required to build the first, second, third, ..., fifteenth step.',
  parts: [
    { text: '(i) Heights of first, second, third, ..., 15th steps form an A.P. with common difference', options: ['1/4 m', '1/2 m', '3/4 m', '-1/4 m'], correct: 0, marks: 1 },
    { text: '(ii) The value of V2 is', options: ['25 m³', '50 m³', '12.5 m³', '6.25 m³'], correct: 2, marks: 1 },
    { text: '(iii) The volume of concrete used in the middle step is', options: ['25 m³', '50 m³', '75 m³', '6.25 m³'], correct: 1, marks: 1 },
    { text: '(iv) The sum of the surface areas of 15 treads is', options: ['350 m²', '400 m²', '375 m²', '475 m²'], correct: 2, marks: 1 },
    { text: '(v) The total volume of the concrete required to build the terrace is', options: ['800 m³', '375 m³', '650 m³', '750 m³'], correct: 3, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 5.8 (terrace steps)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.5.21, item 56 (independently re-verified by computation)',
  explanation: 'nth step height = n/4 m, so Vn = (n/4)*(1/2)*50 = 6.25n m³. V2=12.5 (ii). Middle (8th) step: V8=50 (iii). Each tread area (constant) = 50*(1/2)=25 m²; 15 treads sum to 375 m² (iv). Total volume = 6.25*sum(1..15) = 6.25*120 = 750 m³ (v). All match printed key exactly.',
});

// p.5.18 — Case Study 57 (carpenter ladder, Fig. 5.9)
items.push({
  kind: 'case', sourceQuestionNumber: '57', sourcePage: '5.18',
  text: 'Fig. 5.9: A carpenter wants to manufacture a 3 metre ladder having rungs 25 cm apart. The rungs decrease uniformly in length from 45 cm at the bottom to 25 cm at the top, and the top and bottom rungs are 2.5 metres apart.',
  parts: [
    { text: '(i) Total number of rungs in the ladder is', options: ['10', '9', '11', '12'], correct: 2, marks: 1 },
    { text: '(ii) The lengths of rungs from bottom to top form an A.P. with first and last terms as 45 cm and 25 cm respectively. The common difference of the A.P. formed is', options: ['-2 cm', '-2.5 cm', '4.5 cm', '2 cm'], correct: 0, marks: 1 },
    { text: '(iii) The length of the middle rung is', options: ['33 cm', '35 cm', '37 cm', '35.5 cm'], correct: 1, marks: 1 },
    { text: '(iv) Length of the wood used for rungs is', options: ['3.75 metres', '2.85 metres', '3.85 metres', '4 metres'], correct: 2, marks: 1 },
    { text: '(v) Length of the wood required for the ladder', options: ['68.5 metres', '9.85 metres', '5.85 metres', '8.85 metres'], correct: 1, marks: 1 },
    { text: '(vi) If the wood costs ₹100 per metre, the cost of the ladder is', options: ['₹685', '₹585', '₹885', '₹985'], correct: 3, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 5.9 (carpenter ladder with rungs)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.5.21, item 57 (independently re-verified by computation)',
  explanation: 'Rungs 25cm apart over 2.5m span: 2.5/0.25+1=11 rungs (i). d=(25-45)/10=-2cm (ii). Middle (6th) rung: 45+5*(-2)=35cm (iii). Wood for rungs = 11/2*(45+25)=385cm=3.85m (iv). Wood for the two full-length (3m) side rails = 2*3=6m, so total = 3.85+6=9.85m (v). Cost = 9.85*100=₹985 (vi). All match printed key exactly.',
});

// p.5.18-5.19 — Case Study 58 (potato race, Fig. 5.10)
items.push({
  kind: 'case', sourceQuestionNumber: '58', sourcePage: '5.18-5.19',
  text: 'Fig. 5.10: In a potato race, a bucket is placed at the starting point, which is 5 m from the first potato, and the other potatoes are placed 3 m apart in a straight line. There are n potatoes in the line. Each competitor starts from the bucket, picks up the nearest potato, runs back with it, drops it in the bucket, runs back to pick up the next potato, and continues until all the potatoes are in the bucket.',
  parts: [
    { text: '(i) Distance run by the competitor to pick up and drop first potato in the bucket, is', options: ['5 cm', '8 m', '10 m', '7 m'], correct: 2, marks: 1 },
    { text: "(ii) Distance run by the competitor to pick up and drop nth potato in the bucket, is", options: ['(3n+2) m', '2(3n+2) m', '2(3n-1) m', '6(n-1) m'], correct: 1, marks: 1 },
    { text: '(iii) Total distance run by the competitor to pick up and drop first four potatoes is', options: ['36 metres', '40 metres', '86 metres', '76 metres'], correct: 3, marks: 1 },
    { text: '(iv) Total distance run by the competitor to pick up and drop n potatoes in the bucket is', options: ['n(3n+2) m', '2n(3n+2) m', 'n(3n+7) m', '(3n²+7) m'], correct: 2, marks: 1 },
    { text: '(v) If d1, d2, d3, ..., dn denote distances run by the competitor to pick up first, second, third, ..., nth potato respectively, then d1, d2, ..., dn form an A.P. with common difference', options: ['3', '6', '7', '5'], correct: 1, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 5.10 (potato race)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.5.21, item 58 (independently re-verified by computation)',
  explanation: 'Round trip for 1st potato = 2*5=10m (i). For nth: one-way=5+3(n-1)=3n+2, round trip=2(3n+2) (ii). First 4: sum of 2(3k+2) for k=1..4 = 76m (iii). For n: sum = n(3n+7) (iv). Successive round-trip distances increase by 2*3=6 (v). All match printed key exactly.',
});

// p.5.19 — Case Study 59 (lemon race, Fig. 5.11)
items.push({
  kind: 'case', sourceQuestionNumber: '59', sourcePage: '5.19',
  text: 'Fig. 5.11: In a lemon race, a bucket is placed at a starting point, which is 6 m away from the first lemon and other lemons are placed 4 m apart from each other in a straight line. There are 10 lemons in a line. Riya starts from the bucket, picks up the nearest lemon, runs back with it, drops it in the bucket, and continues until all the lemons are in the bucket.',
  parts: [
    { text: '(i) The lemons are placed in a straight line depicts which part of sequence?', options: ['Geometric', 'Arithmetic', 'Linear', 'Harmonic'], correct: 1, marks: 1 },
    { text: '(ii) The total distance covered by Riya is', options: ['370 m', '480 m', '460 m', '400 m'], correct: 1, marks: 1 },
    { text: "(iii) The formula to find nth term of the Arithmetic sequence (progression) is", options: ['an = a - (n-1)d', 'an = a(n-1)d', 'an = a + (n-1)d', 'Sn = (n/2)(2a+(n-1)d)'], correct: 2, marks: 1 },
    { text: '(iv) The difference between the terms of arithmetic sequence is called as', options: ['common ratio', 'common difference', 'common term', 'none of these'], correct: 1, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 5.11 (lemon race)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.5.21, item 59 (independently re-verified by computation)',
  explanation: 'Round trip for nth lemon = 2*[6+4(n-1)] = 8n+4. Total for 10 lemons = sum_{n=1}^{10}(8n+4) = 8*55+40 = 480m (ii). All parts match printed key exactly.',
});

// p.5.19 — Case Study 60 (playing cards, Fig. 5.12)
items.push({
  kind: 'case', sourceQuestionNumber: '60', sourcePage: '5.19',
  text: 'Fig. 5.12: Playing cards are stacked together: 56 cards are stacked in this manner. 14 cards are in the bottom row, 12 in the next row, 10 in the row next to it and so on.',
  parts: [
    { text: '(i) The total number of rows in which the cards are stacked is', options: ['7', '6', '8', '9'], correct: 0, marks: 1 },
    { text: '(ii) The number of cards in the top row is', options: ['4', '6', '1', '2'], correct: 3, marks: 1 },
    { text: '(iii) The mathematical concept applied in solving the above problem is', options: ['Linear equations', 'Probability', 'Arithmetic progression', 'Coordinate geometry'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 5.12 (stacked playing cards)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.5.21, item 60 (independently re-verified by computation)',
  explanation: 'a=14, d=-2. Sn=56 solves n^2-15n+56=0, giving n=7 or n=8; only n=7 keeps every row count positive (a7=2, a8 would be 0). Top row (7th) = 16-14=2. All parts match printed key exactly.',
});

// p.5.19-5.20 — item 61 (footmat stitches, Fig. 5.13) — open/descriptive, no MCQ options
items.push({
  kind: 'open',
  sourceQuestionNumber: '61',
  sourcePage: '5.19-5.20',
  text: 'Fig. 5.13: A footmat (rug) made out of old t-shirt yarn shows a number of stitches in circular rows making a pattern: 6, 12, 18, 24, ...',
  parts: [
    { text: '(i) Check whether the given pattern forms an AP. If yes, find the common difference and the next term of the AP.' },
    { text: '(ii) Write the nth term of the AP. Hence, find the number of stitches in the 10th circular row.' },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 5.13 (footmat with circular stitch pattern)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.5.21, item 61: "(i) 6, 30 (ii) 6n, 60" (independently re-verified by computation)',
  explanation: 'Yes, it is an AP: common difference 6, next term 30 (i). nth term = 6n; 10th term = 60 (ii). Matches printed key exactly.',
  source: 'CBSE 2022',
});

// p.5.20-5.21 — Assertion-Reason MCQs 62-68
const AR_INSTRUCTIONS = 'Each of the following contains STATEMENT-1 (A) and STATEMENT-2 (R), with choices: (a) both true, Statement-2 is a correct explanation for Statement-1; (b) both true, Statement-2 is not a correct explanation for Statement-1; (c) Statement-1 is true, Statement-2 is false; (d) Statement-1 is false, Statement-2 is true.';

items.push(mcq(62, P520, `${AR_INSTRUCTIONS} Statement-1 (A): The nth term an of an A.P., the sum of whose n terms is Sn, is given by an = Sn - S(n-1), n>1. Statement-2 (R): The common difference d of an A.P., the sum of whose n terms Sn is given by d = Sn - 2S(n-1) + S(n-2), n>2.`, ['(a)', '(b)', '(c)', '(d)'], 1, { explanation: 'Both formulas are individually true, but Statement-2 is a separate derived consequence rather than a direct explanation of Statement-1.' }));
items.push(mcq(63, P520, `${AR_INSTRUCTIONS} Statement-1 (A): The sum of n terms of the series √5+√20+√45+√80+... is (√5/2)n(n+1). Statement-2 (R): The sum of first n natural numbers is n(n+1)/2.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: 'The series is √5,2√5,3√5,4√5,... = √5*(1+2+...+n) = √5*n(n+1)/2, directly using Statement-2. Both true, and Statement-2 correctly explains Statement-1.' }));
items.push(mcq(64, P520, `${AR_INSTRUCTIONS} Statement-1 (A): The sum of n terms of an AP with first and last terms as a1 and an respectively, is Sn = (n/2)(a1+an). Statement-2 (R): The sum of the terms equidistant from the beginning and end in the A.P. a1,a2,a3,...,a(n-2),a(n-1),an is equal to a1+an.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: 'Both true; pairing equidistant terms (Statement-2) is exactly why summing all n terms gives n/2 pairs each equal to a1+an (Statement-1).' }));
items.push(mcq(65, P520, `${AR_INSTRUCTIONS} Statement-1 (A): The sum of first n even natural numbers is n(n+1). Statement-2 (R): The sum of first n odd natural numbers is n(n-1).`, ['(a)', '(b)', '(c)', '(d)'], 2, { explanation: 'Statement-1 is true (2+4+...+2n=n(n+1)). Statement-2 is false: the sum of the first n odd naturals is n², not n(n-1).' }));
items.push(mcq(66, P520, `${AR_INSTRUCTIONS} Statement-1 (A): If a1,a2,a3,...,an is an AP such that a1+a4+a7+...+a16=147, then a1+a6+a11+a16=98. Statement-2 (R): In an A.P., the sum of the terms equidistant from the beginning and the end is always same and is equal to the sum of first and last term.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: 'From a1+a4+...+a16=147 (6 terms, indices 1,4,...,16): 6a1+45d=147 => 2a1+15d=49. Then a1+a6+a11+a16 = 4a1+30d = 2*(2a1+15d) = 98. Both true, and the equidistant-terms symmetry (a6 pairs with a11, both equidistant from the ends) is what makes the derivation work.' }));
items.push(mcq(67, P520, `${AR_INSTRUCTIONS} Statement-1 (A): a, b, c are in A.P. iff 2b = a + c. Statement-2 (R): The sum of first n odd natural numbers is n².`, ['(a)', '(b)', '(c)', '(d)'], 1, { source: 'CBSE 2023', explanation: 'Both statements are true individually, but Statement-2 (about odd-number sums) is unrelated to and does not explain Statement-1 (the AP condition on a,b,c).' }));
items.push(mcq(68, P521, `${AR_INSTRUCTIONS} Statement-1 (A): -5, -5/2, 0, 5/2, ..... is an A.P. Statement-2 (R): The terms of an A.P. cannot have both positive and negative rational numbers.`, ['(a)', '(b)', '(c)', '(d)'], 2, { source: 'CBSE Sample Paper 2024', explanation: 'Statement-1 is true (common difference 5/2 throughout). Statement-2 is false — this very AP has both negative (-5,-5/2) and positive (5/2,...) terms.' }));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Arithmetic Progressions',
  chapterOrder: 5,
  sourceFileIds: [SF],
  label: 'CBSE Maths Arithmetic Progressions Ch.5 (chap_5-6.pdf, pp.5.11-5.21, items 1-68)',
});
console.log(JSON.stringify(result, null, 2));
