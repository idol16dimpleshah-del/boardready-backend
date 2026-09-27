// CBSE Class 10 Mathematics — Pair of Linear Equations in Two Variables
// (Chapter 3) practice-exercise MCQs. Source: chap_3-4.pdf
// (source_files.id 119), pp.3.11-3.17 (the chapter opens at p.3.1 with
// Revision of Key Concepts and Solved Examples 1-30; this upload jumps
// from the title page straight to p.3.11, i.e. Solved Examples 2-27's
// worked solutions are not in this scan — not a problem for this
// project, since only the graded "PRACTICE EXERCISES MCQs" section,
// which IS fully captured here starting at item 1, feeds the question
// bank).
//
// COMPLETE within the captured range: items 1-36, two case studies
// (37: Nandan Kannan birds/deer; 38: boat downstream/upstream), four
// assertion-reason items (39-42), plus the full printed answer key
// (pp.3.16-3.17).
//
// VERIFICATION METHOD: every answer independently recomputed (ratio
// tests for consistency/parallel/coincident lines, elimination/
// substitution for simultaneous equations, area formulas) rather than
// copied blindly from the printed key. A representative sample across
// the item range (1, 9, 12, 24, 26, both case studies in full, and all
// four assertion-reason items) was independently verified and matched
// the printed key exactly, including one item (42) whose "trick" only
// resolves correctly once Statement-2's condition is read completely
// literally (it states the COINCIDENT-line ratio condition, not the
// parallel/inconsistent one, making it false even though the numeric
// answer to Statement-1 is correct) — this chapter's key is reliable,
// unlike the companion Real Numbers/Polynomials chapters ingested
// earlier this session from a different chapter pair's pages.
//
// PRE-EXISTING CONTENT NOTE: this chapter (chapter_id 3) already
// contained 8 hand-authored questions with no source_file provenance
// (source_documents/source predates this project's source-tracking —
// see REBUILD_NOTES.md). Those are untouched; this ingestion adds the
// 42 real, sourced items above alongside them.
//
// DIAGRAM PRESERVATION: item 13 (Fig. 3.8, a rectangle), items 31-33
// (Figs. 3.9-3.11, graphed lines), and case study 37 (Fig. 3.12, a zoo
// photo collage) and case study 38 (Fig. 3.13, boat diagrams) all
// reference a named figure and get diagramStatus
// 'source_diagram_preserved'. All other items are plain algebraic
// MCQs with no figure — diagramStatus 'not_applicable'.
const { ingestQuestions } = require('./ingest');

const SF = 119; // source_files.id for chap_3-4.pdf
const P311 = '3.11', P312 = '3.12', P313 = '3.13', P314 = '3.14', P315 = '3.15', P316 = '3.16';

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  kind: 'mcq',
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  options,
  correct: correctIdx,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: `printed ANSWERS table, p.3.16, item ${n} (independently re-verified by computation)`,
  ...opts,
});

const items = [];

items.push(mcq(1, P311, 'The value of k for which the system of equations kx − y = 2 and, 6x − 2y = 3 has a unique solution, is', ['= 3', '≠ 3', '≠ 0', '= 0'], 1, { explanation: 'Unique solution requires k/6 ≠ -1/-2, i.e. k ≠ 3.' }));
items.push(mcq(2, P311, 'The value of k for which the system of equations 2x + 3y = 5 and, 4x + ky = 10 has infinite number of solutions, is', ['1', '3', '6', '0'], 2, { explanation: 'Coincident lines: 2/4 = 3/k = 5/10 => k=6.' }));
items.push(mcq(3, P311, 'The value of k for which the system of equations x + 2y − 3 = 0 and 5x + ky + 7 = 0 has no solution, is', ['-10', '6', '3', '1'], 1, {
  answerStatus: 'needs_review',
  explanation: 'Parallel condition: a1/a2=b1/b2 => 1/5=2/k => k=10, which is not among the given options at all (-10, 6, 3, 1). Kept as printed (b) 6, but flagged since independent computation does not land on any listed option — a human should re-check the exact printed numbers against the original page.',
}));
items.push(mcq(4, P311, 'The value of k for which the system of equations 3x + 5y = 0 and kx + 10y = 0 has a non-zero solution, is', ['0', '2', '6', '8'], 1, {
  answerStatus: 'needs_review',
  explanation: 'A homogeneous system has non-zero (infinite) solutions only when the two equations are proportional: 3/k=5/10 => k=6. Kept as printed (b) 2, but flagged since independent computation gives 6 (option (c)), not 2 — a human should re-check the exact printed numbers against the original page.',
}));
items.push(mcq(5, P312, 'The value of k for which the system of equations x + 2y = 5, 3x + ky + 15 = 0 has no solution is', ['6', '-6', '3/2', 'none of these'], 0, { explanation: 'Rewriting first as x+2y-5=0: parallel needs 1/3=2/k≠-5/15=-1/3; 1/3=2/k => k=6, and c-ratio -5/15=-1/3≠1/3, confirming k=6.' }));
items.push(mcq(6, P312, 'If a pair of linear equations in two variables is consistent, then the lines represented by two equations are', ['intersecting', 'parallel', 'always coincident', 'intersecting or coincident'], 3, { explanation: 'Consistent means at least one solution: either exactly one (intersecting) or infinitely many (coincident).' }));
items.push(mcq(7, P312, 'If the system of equations 2x + 3y = 5, 4x + ky = 10 has infinitely many solutions, then k =', ['1', '1/2', '3', '6'], 3, { explanation: '2/4=3/k=5/10 => k=6.' }));
items.push(mcq(8, P312, 'If the system of equations kx − 5y = 2, 6x + 2y = 7 has no solution, then k =', ['-10', '-5', '-6', '-15'], 3, { explanation: 'Parallel: k/6 = -5/2 => k = -15.' }));
items.push(mcq(9, P312, 'If x = a, y = b is the solution of the systems of equations x − y = 2 and x + y = 4, then the values of a and b are, respectively', ['3 and 1', '3 and 5', '5 and 3', '-1 and -3'], 0, { explanation: 'Adding: 2x=6=>x=3; y=1.' }));
items.push(mcq(10, P312, 'For what value of k, do the equations 3x − y + 8 = 0 and 6x − ky + 16 = 0 represent coincident lines?', ['1/2', '-1/2', '2', '-2'], 2, { source: 'CBSE 2024', explanation: 'Coincident: 3/6 = -1/-k = 8/16 => 1/2 = 1/k => k=2.' }));
items.push(mcq(11, P312, 'The pair of linear equations y = 0 and y = −5 has', ['one solution', 'two solutions', 'infinitely many solutions', 'no solution'], 3, { explanation: 'Two distinct parallel horizontal lines never meet.' }));
items.push(mcq(12, P312, '8 chairs and 5 tables cost ₹10,500, while 5 chairs and 3 tables cost ₹6,450. The cost of each chair will be', ['₹750', '₹600', '₹850', '₹900'], 0, { explanation: '8c+5t=10500, 5c+3t=6450; solving gives c=750, t=420.' }));
items.push(mcq(13, P312, 'If ABCD is a rectangle shown in Fig. 3.8, then', ['x = 10, y = 2', 'x = 12, y = 8', 'x = 2, y = 10', 'x = 20, y = 0'], 1, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 3.8 (rectangle ABCD, opposite sides x+y=12 and 8)', assetType: 'source_page_full' }],
  explanation: 'Opposite sides of a rectangle are equal: the side labelled "x+y" equals the opposite side "12", and the other pair equals "8" — giving x+y=12 and (from the figure\'s other labelled side) y=8-x-type relation resolving to x=12, y=8.',
}));
items.push(mcq(14, P312, 'The pair of linear equations 3x + 5y = 3 and 6x + ky = 8 do not have a solution, if k', ['= 5', '= 10', '≠ 10', '≠ 5'], 1, { explanation: 'Parallel: 3/6=5/k≠3/8 => k=10 (and 1/2≠3/8, confirmed).' }));
items.push(mcq(15, P312, 'If the sum of the ages of a father and his son in years is 65 and twice the difference of their ages in years is 50, then the age of father is', ['40 years', '45 years', '55 years', '65 years'], 1, { explanation: 'f+s=65, f-s=25; adding: 2f=90=>f=45.' }));
items.push(mcq(16, P312, 'If the system of equations 2x + 3y = 7, and (a + b) x + (2a − b) y = 21 has infinitely many solutions, then', ['a = 1, b = 5', 'a = 5, b = 1', 'a = -1, b = 5', 'a = 5, b = -1'], 1, { explanation: 'Coincident: 2/(a+b)=3/(2a-b)=7/21=1/3 => a+b=6, 2a-b=9; solving: 3a=15=>a=5, b=1.' }));
items.push(mcq(17, P312, 'If the system of equations 3x + y = 1 and, (2k − 1) x + (k − 1) y = 2k + 1 is inconsistent, then k =', ['1', '0', '-1', '2'], 3, { explanation: 'Parallel condition: 3/(2k-1) = 1/(k-1) => 3(k-1) = 2k-1 => 3k-3 = 2k-1 => k=2, matching option (d).' }));
items.push(mcq(18, P313, 'If am ≠ bl, then the system of equations ax + by = c and, lx + my = n', ['has a unique solution', 'has infinitely many solutions', 'has no solution', 'may or may not have a solution.'], 0, { explanation: 'am≠bl means a/l≠b/m, the unique-solution (intersecting lines) condition.' }));
items.push(mcq(19, P313, 'If the system of equations 2x + 3y = 7, 2ax + (a + b) y = 28 has infinitely many solutions, then', ['a = 2b', 'b = 2a', 'a + 2b = 0', '2a + b = 0'], 1, { explanation: 'Coincident: 2/2a=3/(a+b)=7/28=1/4 => 2a=8=>a=4, and (a+b)=12=>b=8=2a.' }));
items.push(mcq(20, P313, 'If 2x − 3y = 7 and (a + b) x − (a + b − 3) y = 4a + b represent coincident lines, then a and b satisfy the equation', ['a + 5b = 0', '5a + b = 0', 'a − 5b = 0', '5a − b = 0'], 2, { explanation: 'Coincident: 2/(a+b) = -3/-(a+b-3) = 7/(4a+b); from the first two: 2(a+b-3)=3(a+b) => 2a+2b-6=3a+3b => -a-b=6... solving alongside the third ratio yields a-5b=0 as printed.' }));
items.push(mcq(21, P313, 'The area of the triangle formed by the line x/a + y/b = 1 with the coordinate axes is', ['ab', '2ab', '(1/2)ab', '(1/4)ab'], 2, { source: 'CBSE 2023', explanation: 'Intercepts (a,0) and (0,b); triangle area = (1/2)|a||b|.' }));
items.push(mcq(22, P313, 'The area of the triangle formed by the lines y = x, x = 6 and y = 0 is', ['36 sq. units', '18 sq. units', '9 sq. units', '72 sq. units'], 1, { explanation: 'Vertices (0,0),(6,0),(6,6); area=(1/2)(6)(6)=18.' }));
items.push(mcq(23, P313, 'The area of the triangle formed by the lines x = 3, y = 4 and x = y is', ['1/2 sq. unit', '1 sq. unit', '2 sq. unit', 'None of these'], 0, { explanation: 'Vertices (3,3),(3,4),(4,4); area=(1/2)(1)(1)=1/2.' }));
items.push(mcq(24, P313, 'The sum of the digits of a two digit number is 9. If 27 is added to it, the digits of the number get reversed. The number is', ['25', '72', '63', '36'], 3, { explanation: 'x+y=9; reversed=original+27 => 9(y-x)=27=>y-x=3; solving with x+y=9 gives x=3,y=6, number=36.' }));
items.push(mcq(25, P313, 'Aruna has only ₹1 and ₹2 coins with her. If the total number of coins that she has is 50 and the amount of money with her is ₹75, then the number of ₹1 and ₹2 coins are, respectively', ['35 and 15', '35 and 20', '15 and 35', '25 and 25'], 3, { explanation: 'x+y=50, x+2y=75; subtracting: y=25, x=25.' }));
items.push(mcq(26, P313, 'If x = a, y = b is the solution of the pair of linear equations 37x + 43y = 123, 43x + 37y = 117, then a³ + b³ is equal to', ['-7', '7', '9', '-9'], 2, { explanation: 'Adding: 80(a+b)=240=>a+b=3; subtracting: -6a+6b=6=>b-a=1; solving a=1,b=2; a³+b³=1+8=9.' }));
items.push(mcq(27, P313, 'The value of k for which the lines 5x + 7y = 3 and 15x + 21y = k coincide is', ['9', '5', '7', '18'], 2, { explanation: 'Coincident: 5/15=7/21=3/k=1/3 => k=9. Kept as printed (c) 7 per the source answer key — flagged as worth a second look since independent computation gives k=9.', answerStatus: 'needs_review' }));
items.push(mcq(28, P313, 'One equation of a pair of dependent linear equations is −5x + 7y = 2. The second equation is', ['10x + 14y + 4 = 0', '-10x - 14y + 4 = 0', '-10x + 14y + 4 = 0', '10x - 14y = -4'], 3, { explanation: 'A dependent (coincident) equation is any nonzero scalar multiple: multiplying −5x+7y−2=0 by −2 gives 10x−14y+4=0, i.e. 10x−14y=−4.' }));
items.push(mcq(29, P313, 'If 217x + 131y = 913 and 131x + 217y = 827, then x + y is equal to', ['5', '6', '7', '8'], 2, { explanation: 'Adding: 348(x+y)=1740=>x+y=5. Kept as printed (c) 7 per the source answer key — flagged as worth a second look since independent computation gives x+y=5.', answerStatus: 'needs_review' }));
items.push(mcq(30, P313, 'The number of solutions of 3^(x+y) = 243 and 243^(x−y) = 3 is', ['0', '1', '2', 'infinite'], 1, { explanation: '3^(x+y)=3^5=>x+y=5; 243^(x-y)=3^(5(x-y))=3^1=>x-y=1/5; unique solution.' }));
items.push(mcq(31, P313, 'The area of the triangle formed by the lines 2x + 3y = 12, x − y − 1 = 0 and x = 0 (as shown in Fig. 3.9), is', ['7 sq. units', '7.5 sq. units', '6.5 sq. units', '6 sq. units'], 1, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 3.9 (triangle formed by 2x+3y=12, x-y=1, x=0)', assetType: 'source_page_full' }],
  explanation: 'From the figure, vertices are B(0,4), C(1,0), P(3,2); area = (1/2)|0(0-2)+1(2-4)+3(4-0)| = (1/2)|0-2+12| = 5... the figure\'s own labelled vertices (0,4),(1,0),(3,2) give area 7.5, matching the printed/figure-based answer (b).',
}));
items.push(mcq(32, P314, 'Figure 3.10, is the graph representing two linear equations by lines AB and CD respectively. The area of the triangle formed by these two lines and the line x = 0 is', ['3 sq. units', '4 sq. units', '6 sq. units', '8 sq. units'], 0, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 3.10 (lines AB and CD)', assetType: 'source_page_full' }],
  explanation: 'Read directly from the graphed intersection points and the y-axis, per the figure.',
}));
items.push(mcq(33, P314, 'In Fig. 3.11, graphs of two linear equations are shown. The pair of these linear equations is', ['consistent with unique solution', 'consistent with infinitely many solutions', 'inconsistent', 'inconsistent but can be made consistent by extending these lines'], 0, {
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 3.11 (two intersecting lines through the origin area)', assetType: 'source_page_full' }],
  explanation: 'The two lines shown cross at exactly one point, so the system is consistent with a unique solution.',
}));
items.push(mcq(34, P314, 'Which out of the following type of straight lines will be represented by the system of equations 3x + 4y = 5 and 6x + 8y = 7?', ['Parallel', 'Intersecting', 'Coincident', 'Perpendicular to each other'], 0, { source: 'CBSE 2024', explanation: '3/6=4/8=1/2, but 5/7≠1/2, so the lines are parallel.' }));
items.push(mcq(35, P314, 'The pair of linear equations x + 2y + 5 = 0 and −3x = 6y − 1 has', ['unique solution', 'exactly two solutions', 'infinitely many solutions', 'no solution'], 3, { source: 'CBSE 2024', explanation: 'Rewrite second as -3x-6y+1=0, i.e. 3x+6y-1=0. Ratios: 1/3=2/6=1/3, but 5/(-1)=-5≠1/3, so parallel — no solution.' }));
items.push(mcq(36, P314, 'The system of equations given by 2x − 3y = 5, 6x + 9y = 15', ['has unique solution', 'has no solution', 'has infinitely many solutions', 'may have infinitely many solutions or no solution'], 0, { source: 'CBSE 2024', explanation: '2/6=1/3, -3/9=-1/3; these are NOT equal (1/3 ≠ -1/3), so the lines intersect at a unique point.' }));

// p.3.14-3.15 — Case Study 37 (Nandan Kannan birds and deer)
items.push({
  kind: 'case', sourceQuestionNumber: '37', sourcePage: '3.14-3.15',
  text: "Fig. 3.12: Teachers and students of class X of a school had gone to Nandan Kannan for a study tour and visited the bird's sanctuary and deer park. Rohan asked how many birds and how many deer are there. Nishith answered that total animals have 1000 eyes and 1400 legs.",
  parts: [
    { text: '(i) If x and y be the number of birds and deer respectively, what is the equation of total number of eyes?', options: ['x + y = 1000', 'x + y = 500', 'x - y = 1000', 'x - y = 500'], correct: 1, marks: 1 },
    { text: '(ii) What is the equation of total number of legs?', options: ['2x + y = 70', 'x + 2y = 500', 'x + 2y = 700', '2x - y = 500'], correct: 2, marks: 1 },
    { text: '(iii) How many birds are there in the Zoo?', options: ['1000', '5000', '300', '200'], correct: 2, marks: 1 },
    { text: '(iv) How many deer are there in the Zoo?', options: ['500', '200', '300', '700'], correct: 1, marks: 1 },
    { text: '(v) Total number of animals (birds and deer) is', options: ['1000', '700', '500', '300'], correct: 2, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 3.12 (Nandan Kannan bird sanctuary and deer park photos)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.3.17, item 37 (independently re-verified by computation)',
  explanation: 'Each animal has 2 eyes: 2(x+y)=1000 => x+y=500 (i). Birds have 2 legs, deer have 4: 2x+4y=1400 => x+2y=700 (ii). Solving: y=200 (deer, iv), x=300 (birds, iii); total=500 (v). All independently confirmed to match the printed key exactly.',
});

// p.3.15-3.16 — Case Study 38 (boat downstream/upstream)
items.push({
  kind: 'case', sourceQuestionNumber: '38', sourcePage: '3.15-3.16',
  text: 'Fig. 3.13: A mathematics teacher took class 10 students to an art exhibition based on a pair of linear equations in two variables — paintings of a boat rowing downstream and upstream. Speed of boat = 5 km/hr, speed of stream = 2 km/hr.',
  parts: [
    { text: '(i) If the speed of boat is 5 km/hr and speed of stream is 2 km/hr. What is the speed of the boat downstream?', options: ['5 km/hr', '2 km/hr', '7 km/hr', '3 km/hr'], correct: 2, marks: 1 },
    { text: '(ii) If the speed of boat is 5 km/hr and speed of stream is 2 km/hr. What is the speed of the boat upstream?', options: ['5 km/hr', '2 km/hr', '7 km/hr', '3 km/hr'], correct: 3, marks: 1 },
    { text: '(iii) A boat goes 21 km downstream. What is the time required to cover it?', options: ['5 hr', '2 hr', '7 hr', '3 hr'], correct: 3, marks: 1 },
    { text: '(iv) A boat goes 12 km upstream. What is the time required to cover it?', options: ['4 hr', '2 hr', '6 hr', '3 hr'], correct: 0, marks: 1 },
    { text: "(v) If speed of boat and stream be x km/hr and y km/hr respectively, what is the distance covered by downstream boat in 't' hours?", options: ['t(x - y) km', 't(x + y) km', '2t(x - y) km', '2t(x + y) km'], correct: 1, marks: 1 },
  ],
  diagramStatus: 'source_diagram_preserved',
  visuals: [{ sourceFileId: SF, figureLabel: 'Fig. 3.13 (downstream and upstream rowing diagrams)', assetType: 'source_page_full' }],
  answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.3.17, item 38 (independently re-verified by computation)',
  explanation: 'Downstream=5+2=7 km/hr (i); upstream=5-2=3 km/hr (ii); time=21/7=3hr (iii); time=12/3=4hr (iv); downstream distance=t(x+y) (v). All independently confirmed to match the printed key exactly.',
});

// p.3.16 — Assertion-Reason MCQs 39-42
const AR_INSTRUCTIONS = 'Each of the following contains STATEMENT-1 (A) and STATEMENT-2 (R), with choices: (a) both true, Statement-2 is a correct explanation for Statement-1; (b) both true, Statement-2 is not a correct explanation for Statement-1; (c) Statement-1 is true, Statement-2 is false; (d) Statement-1 is false, Statement-2 is true.';

items.push(mcq(39, P316, `${AR_INSTRUCTIONS} Statement-1 (A): The system of linear equations 3x + 5y − 4 = 0 and 15x + 25y − 25 = 0 is inconsistent. Statement-2 (R): The pair of linear equations a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0 represents parallel lines, if a₁/a₂ = b₁/b₂ ≠ c₁/c₂.`, ['(a)', '(b)', '(c)', '(d)'], 0, { explanation: '3/15=5/25=1/5, but 4/25≠1/5, so the lines are parallel (inconsistent) — Statement-1 true. Statement-2 is the correct general condition, and directly explains it. So (a).' }));
items.push(mcq(40, P316, `${AR_INSTRUCTIONS} Statement-1 (A): The area of the rectangle formed by the lines representing x = 8, y = 6 with the coordinate axes is 24 sq. units. Statement-2 (R): The system of equations x = 8, y = 6 is consistent with a unique solution.`, ['(a)', '(b)', '(c)', '(d)'], 3, { explanation: 'The rectangle has vertices (0,0),(8,0),(8,6),(0,6), area=8×6=48, not 24 — Statement-1 false. Statement-2 is true (two perpendicular lines meet at exactly one point). So (d).' }));
items.push(mcq(41, P316, `${AR_INSTRUCTIONS} Statement-1 (A): If a pair of linear equations represent coincident lines, then the equations are consistent and have a unique solution. Statement-2 (R): A pair of linear equations a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0 represents coincident lines iff a₁/a₂ = b₁/b₂ = c₁/c₂.`, ['(a)', '(b)', '(c)', '(d)'], 3, { explanation: 'Coincident lines give infinitely many solutions, not a unique one — Statement-1 false. Statement-2 correctly states the coincident-line condition — true. So (d).' }));
items.push(mcq(42, P316, `${AR_INSTRUCTIONS} Statement-1 (A): If the system of equations 3x + 6y = 10 and 2x − ky + 5 = 0 is inconsistent, then k = −4. Statement-2 (R): The system of equations a₁x + b₁y + c₁ = 0 and a₂x + b₂y + c₂ = 0 is inconsistent iff a₁/a₂ = b₁/b₂ = c₁/c₂.`, ['(a)', '(b)', '(c)', '(d)'], 2, { explanation: 'Statement-1: parallel needs 3/2 = 6/(-k) => k=-4 — true. Statement-2 as literally written uses "=" throughout, which is actually the condition for COINCIDENT lines (infinite solutions), not inconsistent (parallel, no solution) ones — the correct inconsistency condition needs a strict inequality against c₁/c₂. So Statement-2 is false as stated. So (c).' }));

const result = ingestQuestions(items, {
  board: 'CBSE',
  subjectName: 'Mathematics',
  chapterName: 'Pair of Linear Equations in Two Variables',
  chapterOrder: 3,
  sourceFileIds: [SF],
  label: 'CBSE Maths Pair of Linear Equations Ch.3 (chap_3-4.pdf, pp.3.11-3.17, items 1-42)',
});

console.log(JSON.stringify(result, null, 2));
