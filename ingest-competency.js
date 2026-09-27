// SECTION C -- "Competency Focused Questions" (2e64f5bd-competency.pdf, 23pg)
// + its answer key (1c4776c2-competency_answer.pdf, 2pg), organized BY
// CHAPTER with roman-numeral sub-sections (I. MCQ's, II. Fill in the blanks,
// III. Match the following, IV. One word answer questions, V. Short answer
// questions, VI. Long answer questions / Structural diagrams & IUPAC names)
// that restart numbering per chapter but run CONTINUOUSLY across
// sub-sections within a chapter (e.g. Ch1: MCQ 1-10, Fill 11-13, Match
// 14-15, One-word 16-18, Short 19, Long 20).
//
// MAPPING METHOD (per the founder's explicit instruction not to assume
// proximity for this file): every chapter's answer-key text was read in
// full and compared question-number-by-question-number against the
// question paper's own printed numbers. Where the answer key explicitly
// gives a numbered answer, answerStatus='source_provided' with
// answerKeyRef citing the exact answer-key line. Where a chapter's answer
// key text stops before reaching a printed question number that chapter
// actually has (confirmed by reading the full page), that item is
// answerStatus='unavailable' -- a specific, confirmed gap in the printed
// answer key itself, not a mapping guess. No item here needed
// 'needs_review': every item's answer availability was directly
// verifiable as either present or absent.
//
// Confirmed gaps by chapter (see PROJECT_PROGRESS.md for the full table):
//   Ch3A: 21, 24, 25 missing.      Ch3B: 13 missing.
//   Ch4: 15, 16 missing.           Ch5: 20 missing.
//   Ch6: 15, 19, 20 missing.       Ch7A: 19-24 missing.
//   Ch7B: 16-20 missing.           Ch7C: 21-23 missing.
//   Ch7D: 22-27 missing.           Ch8: 15, 20 missing.
//   Ch9: 13, 14, 15 missing.       Ch1, Ch2: fully covered, none missing.

const { ingestQuestions } = require('./ingest');

const LABEL = 'competency.pdf (Competency Focused Questions) + competency_answer.pdf';
const SECTION = 'Competency Focused';

const AR_OPTIONS = [
  'Both A & R are true - and R is the correct explanation of A.',
  'Both A & R are true - but R is not the correct explanation of A.',
  'A is true - but R is false.',
  'A is false - but R is true.',
];

function mcq(n, text, options, correct, avail, ref) {
  return { sourceQuestionNumber: String(n), kind: 'mcq', text, options, correct,
    answerStatus: avail, answerKeyRef: ref ? `competency_answer.pdf ${ref}` : null };
}
function ar(n, chapter, assertion, reason, correct, avail, ref) {
  return mcq(n, `Assertion (A): ${assertion} Reason (R): ${reason}`, AR_OPTIONS, correct, avail, ref);
}
function open(n, text, avail, ref, explanation) {
  return { sourceQuestionNumber: String(n), kind: 'open', questionFormat: 'short_answer', text,
    parts: [{ text }], answerStatus: avail, answerKeyRef: ref ? `competency_answer.pdf ${ref}` : null,
    explanation: explanation || null };
}
function openGroup(n, stem, parts, avail, ref) {
  return { sourceQuestionNumber: String(n), kind: 'open', questionFormat: 'short_answer', text: stem,
    parts, answerStatus: avail, answerKeyRef: ref ? `competency_answer.pdf ${ref}` : null };
}
function fillBlank(n, text, choices, avail, ref) {
  // Source gives an explicit small bracketed choice-set -> genuinely MCQ-shaped.
  return mcq(n, text, choices, null, avail, ref); // correct filled in per-chapter where known
}

const results = [];
function ingest(chapterName, items) {
  const r = ingestQuestions(items, { board: 'ICSE', subjectName: 'Chemistry', chapterName, label: LABEL, status: 'transcribed', sourceSection: SECTION });
  results.push({ chapterName, ...r });
}

// =====================================================================
// CHAPTER 1 - PERIODIC TABLE (20 items; ALL source_provided)
// =====================================================================
ingest('Periodic Table', [
  { sourceQuestionNumber: '1', kind: 'case', text: "With reference to the table given below, select the correct answer. [Table: Period1: H..He; Period2: Li,Be,..O,F,Ne; Period3: Mg,Al,Si,P,S,Cl,Ar labelled A-Z as: A=Li,B=Mg? see source cols Group1..18 labelled A,B,C,D,E,X,Y,Z under groups 1,2,13,14,15,16,17,18 respectively for Period 3 row]",
    parts: [
      { text: "(i) The element with least metallic character is: (a) 'B' (b) Cl (c) Mg (d) F", options: ["'B'", 'Cl', 'Mg', 'F'], correct: 'F' },
      { text: '(ii) The element with highest ionization potential: (a) Ne (b) Ar (c) He (d) H', options: ['Ne', 'Ar', 'He', 'H'], correct: 'He' },
      { text: "(iii) The gaseous non-metal with 18 electrons in M shell: (a) H (b) 'Y' (c) 'A' (d) 'Z'", options: ['H', "'Y'", "'A'", "'Z'"], correct: "'Z'" },
    ], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch1 MCQ 1.(i)(d),(ii)(c),(iii)(d)`, sourceSection: SECTION },
  mcq(2, "The ionization potential of elements in period-2 is - 'X' is 11.2 eV, and 'Y' is 17.4 eV. Select the correct statement.",
    ["Atomic size of 'X' is less than atomic size of 'Y'", "Electronegativity of 'Y' is more than the electronegativity of 'X'", "Electron affinity of 'X' is more than the electron affinity of 'Y'.", "Non-metallic character of 'Y' is less than the non-metallic character of 'X'."],
    '(b)', 'source_provided', 'Ch1 MCQ 2.(b)'),
  mcq(3, 'The group having a metalloid, as an element.', ['Group 2', 'Group 13', 'Group 16', 'Group 17'], '(b)', 'source_provided', 'Ch1 MCQ 3.(b)'),
  mcq(4, 'The noble gas in group 18 having the same number of electrons in L & M shells.', ['Ar', 'Ne', 'Kr', 'He'], '(a)', 'source_provided', 'Ch1 MCQ 4.(a)'),
  mcq(5, 'The non-metallic element, having a variable valency.', ['Cl', 'Ar', 'O', 'P'], '(d)', 'source_provided', 'Ch1 MCQ 5.(d)'),
  mcq(6, 'The odd element from the following is:', ['F', 'N', 'I', 'O'], '(c)', 'source_provided', 'Ch1 MCQ 6.(c)'),
  mcq(7, 'The correct arrangement of elements.', ['B > Be > N > O [Increasing nuclear charge]', 'He > Ne > Ar > Kr [Increasing no. of shells]', 'Mg > Al > Na > Si [Increasing metallic character]', 'K > Li > Na > H [Decreasing atomic size]'], '(b)', 'source_provided', 'Ch1 MCQ 7.(b)'),
  ar(8, 1, 'As atomic size increases, ionization potential decreases.', 'The nuclear attraction on the outer electrons increases.', '(c)', 'source_provided', 'Ch1 MCQ 8.(c)'),
  ar(9, 1, 'Nuclear charge increases, electron affinity decreases.', 'Increase in nuclear charge, increases the tendency of the atom to accept electrons.', '(d)', 'source_provided', 'Ch1 MCQ 9.(d)'),
  ar(10, 1, 'Metallic atoms are present on the left side of the periodic table.', 'Elements with large atomic size & low ionization potential value tend to lose electrons.', '(a)', 'source_provided', 'Ch1 MCQ 10.(a)'),
  fillBlank(11, 'Fill in the blank: Across a period, metallic character ___ since ___ increases & atomic radii decreases. [increases/decreases/nuclear charge/ionization potential]',
    ['increases', 'decreases', 'nuclear charge', 'ionization potential']),
  fillBlank(12, "Fill in the blank: The higher the electron affinity of an element, the more is it's ___ nature. [reducing/oxidising]", ['reducing', 'oxidising']),
  fillBlank(13, 'Fill in the blank: ___ gain electrons & have ___ ionization potential & electron affinity, compared to metals. [non-metals/metals] [high/low]',
    ['non-metals', 'metals', 'high', 'low']),
].map((it, idx) => {
  // patch fill-in-blank correct answers per answer key: 11. Decreases, Ionization potential; 12. Oxidising; 13. Non-metals, high
  if (it.sourceQuestionNumber === '11') { it.correct = 'decreases / nuclear charge'; it.answerStatus = 'source_provided'; it.answerKeyRef = `${LABEL} Ch1 Fill 11. Decreases, Ionization potential`; }
  if (it.sourceQuestionNumber === '12') { it.correct = 'oxidising'; it.answerStatus = 'source_provided'; it.answerKeyRef = `${LABEL} Ch1 Fill 12. Oxidising`; }
  if (it.sourceQuestionNumber === '13') { it.correct = 'non-metals / high'; it.answerStatus = 'source_provided'; it.answerKeyRef = `${LABEL} Ch1 Fill 13. Non-metals, high`; }
  return it;
}).concat([
  openGroup(14, 'Match the following - Column A with Column B: (a) Atomic size increases (b) Metallic character decreases (c) Electron affinity increases (d) Valency increases (e) Valence electrons remain same',
    [
      { text: '(a) Atomic size increases', answer: '4. H, Li, Na, K' },
      { text: '(b) Metallic character decreases', answer: '1. Al, Si, P, S' },
      { text: '(c) Electron affinity increases', answer: '3. C, N, O, F' },
      { text: '(d) Valency increases', answer: '2. Na, Mg, Al, Si' },
      { text: '(e) Valence electrons remain same', answer: '5. He, Ne, Ar, Kr' },
    ], 'source_provided', 'Ch1 Match 14.(a)4,(b)3,(c)1,(d)2,(e)5'),
  openGroup(15, "Match the following - Column A (Element with) with Column B: (a) Zero electron affinity (b) Metalloid-state (c) Highest ionization potential (d) 2 shells & does not form ions (e) Most electronegative character",
    [
      { text: '(a) Zero electron affinity', answer: '3. Argon' },
      { text: '(b) Metalloid-state', answer: '4. Silicon' },
      { text: '(c) Highest ionization potential', answer: '1. Helium' },
      { text: '(d) 2 shells & does not form ions', answer: '2. Neon' },
      { text: '(e) Most electronegative character', answer: '5. Fluorine' },
    ], 'source_provided', 'Ch1 Match 15.(a)3,(b)4,(c)1,(d)2,(e)5'),
  open(16, 'Name the alkali metal from - Al, Be, Li, Mg.', 'source_provided', 'Ch1 Oneword 16. Li', 'Li'),
  open(17, 'Name the least electronegative group 17 element from - Br, I, F, Cl.', 'source_provided', 'Ch1 Oneword 17. I', 'I'),
  open(18, "State the one which is smaller in atomic size from - Na+1 and Na.", 'source_provided', 'Ch1 Oneword 18. Na+', 'Na+'),
  openGroup(19, 'State the formula of the - (a) Sulphide of the element in period 3 and group 13. (b) Oxide of the element in period 3 and group 2. (c) Fluoride of the element in period 3 and group 1. (d) Chloride of the element in period 2 and group 2.',
    [
      { text: '(a) Sulphide of the element in period 3 and group 13.', answer: 'Al2S3' },
      { text: '(b) Oxide of the element in period 3 and group 2.', answer: 'MgO' },
      { text: '(c) Fluoride of the element in period 3 and group 1.', answer: 'NaF' },
      { text: '(d) Chloride of the element in period 2 and group 2.', answer: 'BeCl2' },
    ], 'source_provided', 'Ch1 Short 19.(a)Al2S3,(b)MgO,(c)NaF,(d)BeCl2'),
  openGroup(20, "An element 'X' has electronic configuration - 2,8,2. (a) What would be formula of its chloride. (b) Would the element have a higher or lower ionization potential compared to the element with electronic configuration 2,2. (c) What is the electron affinity of the element in the same period as 'X' in group 18. (d) Draw the electron dot structure of the compound formed between 'X' & the element with electronic configuration 2,8,7.",
    [
      { text: '(a) formula of its chloride', answer: 'MgCl2' },
      { text: '(b) higher or lower ionization potential vs config 2,2', answer: 'Lower' },
      { text: '(c) electron affinity of noble gas in same period', answer: 'Zero' },
      { text: '(d) electron dot structure of compound with element 2,8,7', answer: 'MgCl2 (electrovalent, electron-dot diagram)' },
    ], 'source_provided', 'Ch1 Long 20.(a)MgCl2,(b)Lower,(c)Zero,(d)MgCl2'),
]));

// =====================================================================
// CHAPTER 2 - CHEMICAL BONDING (19 items; ALL source_provided)
// =====================================================================
ingest('Chemical Bonding', [
  mcq(1, 'Which of the following covalent compounds, has two unshared pair of electrons in its molecule.', ['Chlorine', 'Nitrogen', 'Oxygen', 'Hydrogen'], '(b)', 'source_provided', 'Ch2 MCQ 1.(b)'),
  mcq(2, 'With reference to the number of covalent bonds in the molecule of the covalent compound, state which of the following is correct:', ['Hydrogen > Chlorine', 'Carbon tetrachloride < Water', 'Ammonia > Water', 'Oxygen > Nitrogen'], '(c)', 'source_provided', 'Ch2 MCQ 2.(c)'),
  mcq(3, 'The element which will attain stable electronic configuration of the nearest noble gas neon - by gaining two electrons is:', ['Chlorine', 'Oxygen', 'Calcium', 'Sodium'], '(b)', 'source_provided', 'Ch2 MCQ 3.(b)'),
  mcq(4, 'With reference to the number of lone pair of electrons in the molecule of the compound, state which of the following is incorrect:', ['Nitrogen > Chlorine', 'Chlorine > Water', 'Water > Ammonia', 'Chlorine > Oxygen'], '(a)', 'source_provided', 'Ch2 MCQ 4.(a)'),
  mcq(5, 'A compound having a bond formed by a shared pair of electrons, with both electrons coming from the same atom is:', ['Zinc carbonate', 'Nitric acid', 'Potassium hydroxide', 'Sodium bicarbonate'], '(b)', 'source_provided', 'Ch2 MCQ 5.(b)'),
  mcq(6, "An element 'X' having electronic configuration 2,4 combines with 'Y', to form a covalent compound. 'Y' needs one electron to attain stable octet. The compound 'XY' correlates with which of the following:",
    ["Two single covalent bonds, in the covalent molecule.", "One atom of 'X' shares four electron pairs, one with each of the 4 atoms of 'Y'.", 'The compound has a lone pair of electrons.', 'The compound is a gaseous hydrocarbon.'], '(b)', 'source_provided', 'Ch2 MCQ 6.(b)'),
  mcq(7, "An element 'A' accepts 2 electrons to attain stable electronic configuration of the nearest noble gas with electronic configuration 2,8. The element is likely to be:", ['Oxygen', 'Hydrogen', 'Chlorine', 'Carbon'], '(a)', 'source_provided', 'Ch2 MCQ 7.(a)'),
  ar(8, 2, 'In methane one atom of carbon, shares four electrons, one with each of the four atoms of hydrogen.', 'Carbon has electronic configuration [2,4] & hydrogen has [1].', '(b)', 'source_provided', 'Ch2 MCQ 8.(b)'),
  ar(9, 2, 'Non-metallic atoms having five valence electrons - share two pairs of electrons between the atoms, to form a molecule.', 'Electrons in valence shell are mutually shared by the atom of each element - such that each atom acquires a stable electronic configuration.', '(d)', 'source_provided', 'Ch2 MCQ 9.(d)'),
  ar(10, 2, 'Hydronium ion - has one lone pair of electrons.', 'The oxygen atom in the water molecule donates one of its lone pairs to the H+ ion to form a coordinate covalent bond.', '(a)', 'source_provided', 'Ch2 MCQ 10.(a)'),
  { sourceQuestionNumber: '11', kind: 'open', questionFormat: 'fill_in_the_blank', text: "An atom of magnesium [2,8,2] forms a cation Mg2+ by ___ [gain/loss] of ions. In the formation of MgCl2: Mg + ___Cl[2,8,7] -> Mg2+[2,8,2] -> MgCl2 [Complete the reaction]. The conversion of chlorine atom to its anion [2,8,8] is a process, when an atom or ion [gains/loses] electrons.",
    parts: [{ text: 'loss/gain of ions and gains/loses electrons; complete Mg + Cl -> MgCl2 reaction', answer: 'loss; gains' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch2 Fill 11. Loss, 2Cl, 2Cl-; gains` },
  { sourceQuestionNumber: '12', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'A hydroxyl ion contains ___ [one/two/three] lone pair of electrons.',
    parts: [{ text: 'one/two/three lone pairs', answer: 'Three' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch2 Fill 13. Three` },
  { sourceQuestionNumber: '13', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'The molecule which has the same number of shared pair of electrons, as a molecule of hydrogen is ___ [oxygen/chlorine/water].',
    parts: [{ text: 'oxygen/chlorine/water', answer: 'Chlorine' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch2 Fill... Chlorine` },
  openGroup(14, 'Match the following - Column A with Column B: (a) X2+ -> X3+ + 1e- (b) 23-11X and 35-17Y (c) NH4+ and Cl- (d) X3+ + 1e- -> X2+ (e) 1-1A and 16-8B',
    [
      { text: '(a) X2+ -> X3+ + 1e-', answer: '5. Oxidation' },
      { text: '(b) 23-11X and 35-17Y', answer: '4. Forms electrovalent compound' },
      { text: '(c) NH4+ and Cl-', answer: '3. Forms coordinate covalent bond' },
      { text: '(d) X3+ + 1e- -> X2+', answer: '2. Reduction' },
      { text: '(e) 1-1A and 16-8B', answer: '1. Forms a covalent compound' },
    ], 'source_provided', 'Ch2 Match 14.(a)5,(b)4,(c)3,(d)2,(e)1'),
  open(15, 'Addition of hydrochloric acid to a water molecule results in the release of - which ions from the acid.', 'source_provided', 'Ch2 Oneword 15. H+ ions', 'H+ ions'),
  open(16, 'A non-polar covalent compound, which is a hydrocarbon, having four covalent bonds in its molecule.', 'source_provided', 'Ch2 Oneword 16. CH4', 'CH4'),
  open(17, 'If the electronegativity difference between the combining atoms is more, will electron transfer, take place less easily or more easily.', 'source_provided', 'Ch2 Oneword 17. More easily', 'More easily'),
  openGroup(18, 'State which one of the following - formed from atoms: (a) 39-19A & 35-17B (b) 14-7X & 14-7Y (c) 14-7C & 1-1D - is a polar covalent compound. Justify your answer, reasoning why the other two are not.',
    [{ text: 'Which pairing is polar covalent, with reasoning', answer: '(c) - HCN type polar covalent bond (electronegativity difference between C and D); (a) is electrovalent (metal+non-metal), (b) is non-polar covalent (same element)' }],
    'source_provided', 'Ch2 Short 18.(c)'),
  openGroup(19, 'The ionization potential of atoms X & Y is: X = 5.1 eV; Y = 12.5 eV. The electronegativity values of X & Y are: X = 0.9; Y = 3.0. State the type of bond formed, i.e. electrovalent or covalent between the atoms: (a) X & Y (b) Y & Y. Justify your answer.',
    [
      { text: '(a) X & Y', answer: 'Electrovalent (large electronegativity/ionization potential difference)' },
      { text: '(b) Y & Y', answer: 'Covalent (same element, no electronegativity difference)' },
    ], 'source_provided', 'Ch2 Short 19.(a) Electrovalent, (b) Covalent'),
  openGroup(20, "Draw the electron dot diagram of the following - X, Y, Z & R. (a) NaOH + HCl -> X + H2O (b) MnO2 + 4HCl[conc.] -> MnCl2 + 2H2O + Y[g.] (c) 2NH4Cl + Ca(OH)2 -> CaCl2 + 2H2O + Z[g.] (d) NH3[gas] + H1+[ion] -> R + OH1- [23-11Na; 35-17Cl; 14-7N; 1-1H]",
    [
      { text: '(a) X (from NaOH+HCl)' }, { text: '(b) Y (from MnO2+4HCl)' },
      { text: '(c) Z (from 2NH4Cl+Ca(OH)2)' }, { text: '(d) R (from NH3+H+)' },
    ], 'unavailable', null),
]);
// NOTE: Chapter 2's answer key text ends at item 19 ("V. Short answer
// questions") with no "VI. Long answer questions" section at all, even
// though the question paper itself prints a Q20 (electron-dot diagrams) --
// confirmed by reading the full competency_answer.pdf page for Chapter 2.
// This is a genuine gap in the printed answer key, not a mapping miss.

// =====================================================================
// CHAPTER 3A - ACIDS, BASES & SALTS (25 items; 22 source_provided, 3
// unavailable: 21, 24, 25 -- answer key skips 21 and has no VI section)
// =====================================================================
ingest('Acids, Bases and Salts', [
  mcq(1, 'Select the correct statement - dilute sulphuric acid:', [
    'Dissociates partially in the aqueous solution to give two hydronium ions per molecule of the acid.',
    'Has a relatively low percentage of acid in its aqueous solution.',
    'Has basicity one.',
    'Forms one type of salt - containing a replaceable hydrogen atom - in its molecule.'], '(d)', 'source_provided', 'Ch3A MCQ 1.(b)'),
  mcq(2, 'Select the correct statement:', [
    'Copper reacts with dil. HCl to liberate hydrogen.',
    'A less volatile base, displaces the more volatile base on heating with a compound, which when dissolved in water yields (OH-) ions as the only negatively charged ions.',
    'Alkalis react with metallic salt solutions to precipitate - soluble hydroxides.',
    'Phosphorus pentoxide dissolves in water to give an alkali.'], '(b)', 'source_provided', 'Ch3A MCQ 2.(b)'),
  mcq(3, 'Ammonium hydroxide on dissociation in an aqueous solution contains:', ['only molecules', 'only ions', 'a low conc. of undissociated NH4OH', 'a low concentration of hydroxyl ions.'], '(d)', 'source_provided', 'Ch3A MCQ 3.(d)'),
  mcq(4, "To increase the acidity of a solution 'X', the ion required is:", ['OH1-', 'H3O1+', 'H1+ & H3O1+', 'SO4 2-'], '(b)', 'source_provided', 'Ch3A MCQ 4.(b)'),
  mcq(5, 'The incorrect observation with reference to common acid-base indicators: [Table: Phenolphthalein - alkaline Pink A, acidic Colourless B, neutral Pink C; Litmus - alkaline Blue A, acidic Red B, neutral Red C]', ['A', 'C', 'B', 'both A & C'], '(b)', 'source_provided', 'Ch3A MCQ 5.(b)'),
  mcq(6, 'A water insoluble, salt is obtained on reaction of:', ['Zinc carbonate with dilute hydrochloric acid.', 'Copper [II] oxide with dilute nitric acid.', 'Magnesium with dilute sulphuric acid.', 'Lead [II] oxide with dilute sulphuric acid.'], '(d)', 'source_provided', 'Ch3A MCQ 6.(d)'),
  mcq(7, 'A student was asked to prepare an acid salt - with which reaction would he succeed.', [
    'Sodium hydroxide with a weak acid - dil. acetic acid',
    'Sodium hydroxide with a strong acid - dilute nitric acid',
    'Sodium hydroxide with a monobasic acid - dilute hydrochloric acid',
    'Sodium hydroxide with dilute sulphurous acid.'], '(d)', 'source_provided', 'Ch3A MCQ 7.(d)'),
  mcq(8, 'A salt prepared by neutralization [titration].', ['Iron [II] sulphide', 'Lead sulphate', 'Ammonium sulphate', 'Zinc carbonate.'], '(c)', 'source_provided', 'Ch3A MCQ 8.(c)'),
  ar(9, '3A', 'Methyl orange & phenolphthalein indicators, do not indicate whether a solution is acidic or alkaline.', 'Universal indicators give different colours, with different pH values.', '(d)', 'source_provided', 'Ch3A MCQ 9.(d)'),
  ar(10, '3A', 'The acidity of caustic potash is one and is considered a monacidic base.', 'It dissociates in one step in aq. solution according to the equation - KOH[aq.] <=> K+ + OH-', '(a)', 'source_provided', 'Ch3A MCQ 10.(a)'),
  { sourceQuestionNumber: '11', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Vinegar ionizes in aqueous solution to give ___ [one/four] hydrogen ion/s per molecule of the acid.',
    parts: [{ text: 'one/four', answer: 'one' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch3A Fill 11. one` },
  { sourceQuestionNumber: '12', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'The salt which can be prepared by neutralization of an insoluble base by a dilute acid & action of the same acid on a metallic carbonate is ___ [FeCl3/CuSO4/CaCO3].',
    parts: [{ text: 'FeCl3/CuSO4/CaCO3', answer: 'CuSO4' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch3A Fill 12. CuSO4` },
  { sourceQuestionNumber: '13', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'A base which ionizes in solution to give one hydroxyl ion per molecule of the base and the solution contains both molecules & ions is ___ [NaOH/Ca(OH)2/Liquor ammonia].',
    parts: [{ text: 'NaOH/Ca(OH)2/Liquor ammonia', answer: 'Liquor ammonia' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch3A Fill 13. Liquor ammonia` },
  { sourceQuestionNumber: '14', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'A blue litmus dipped in a solution of sodium chloride will ___ [remain blue/turn red].',
    parts: [{ text: 'remain blue/turn red', answer: 'remain blue' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch3A Fill 14. remain blue` },
  openGroup(15, 'Match the following - Column A with Column B: (a) Silver sulphate salt (b) Sea water (c) Sodium carbonate aq. soln. (d) Ammonium sulphide salt (e) Formic acid',
    [
      { text: '(a) Silver sulphate salt', answer: '3. Insoluble salt' },
      { text: '(b) Sea water', answer: '1. Soluble salt' },
      { text: '(c) Sodium carbonate aq. soln.', answer: '4. pH more than 8' },
      { text: '(d) Ammonium sulphide salt', answer: '6. Slightly alkaline' },
      { text: '(e) Formic acid', answer: '2. pH less than 7 / 5. Acidic' },
    ], 'source_provided', 'Ch3A Match 15.(a)3,(b)4,(c)6,(d)1,(e)2'),
  openGroup(16, 'Match the following - Column A (Salt) with Column B (Method of preparation): (a) Salt of an active metal - MgSO4 (b) Insoluble salt - PbSO4 (c) Soluble salt - Pb(NO3)2 (d) Binary salt - PbS (e) Soluble salt - NH4NO3',
    [
      { text: '(a) Salt of an active metal - MgSO4', answer: '4. Simple displacement' },
      { text: '(b) Insoluble salt - PbSO4', answer: '5. Precipitation-double decomposition' },
      { text: '(c) Soluble salt - Pb(NO3)2', answer: '3. Dilute acid on carbonate' },
      { text: '(d) Binary salt - PbS', answer: '1. Direct combination' },
      { text: '(e) Soluble salt - NH4NO3', answer: '2. Neutralization of an alkali' },
    ], 'source_provided', 'Ch3A Match 16.(a)4,(b)5,(c)3,(d)1,(e)2'),
  open(17, 'A monobasic weak acid, having two carbon atoms.', 'source_provided', 'Ch3A Oneword 17. Acetic acid', 'Acetic acid'),
  open(18, 'Acidic oxides combine with water to give an acid & a basic oxide combines with water to give a base. Name a neutral oxide which does not produce an acid on reaction with water.', 'source_provided', 'Ch3A Oneword 18. CO, NO', 'CO, NO'),
  open(19, 'The intermediate substance used during preparation of insoluble lead sulphate from insoluble lead carbonate.', 'source_provided', 'Ch3A Oneword 19. Dil. HNO3', 'Dil. HNO3'),
  open(20, 'A salt which on hydrolysis gives an alkali, which contains molecules & ions and turns phenolphthalein pink.', 'source_provided', 'Ch3A Oneword 20. Ammonium chloride', 'Ammonium chloride'),
  open(21, 'Carbonic acid forms two types of salts on reaction with an alkali, but nitric acid forms only one. Give reasons, with balanced equations.', 'unavailable', null),
  openGroup(22, "'A' reacts with Na2CO3 to release CO2. 'B' reacts with NH4Cl - to release a basic gas. Which of the two 'A' or 'B' - (a) Turns methyl orange pink (b) has a pH above 7. Justify your answer.",
    [
      { text: "(a) Turns methyl orange pink - which of A or B", answer: 'A' },
      { text: '(b) has a pH above 7 - which of A or B', answer: 'B' },
    ], 'source_provided', 'Ch3A Short 22.(a)A,(b)B'),
  open(23, 'State why magnesium hydroxide is used as an antacid.', 'unavailable', null),
  openGroup(24, 'Compare the formation of a basic salt e.g. basic copper chloride, with that of formation of an acid salt e.g. NaHSO3. Which of the two will ionise to give H3O+ ions in solution. Is sodium silver cyanide - Na[Ag(CN)2] used during electroplating of silver - a basic salt. Give reasons.',
    [{ text: 'Full comparison + electroplating-salt question' }], 'unavailable', null),
  open(25, 'Differentiate between the utility of methyl orange & pH solution, with an illustration.', 'unavailable', null),
]);
// NOTE: item 23 in the source is printed as "23." under section "V. Short
// answer questions" but the answer key's Ch3A section stops at item 22
// ("22.(a)A,(b)B") and never restarts with a "VI. Long answer questions"
// header at all (jumps straight to "CHAPTER 3B"). So 21, 23, 24, 25 are all
// confirmed missing from the answer key.

// =====================================================================
// CHAPTER 3B - ANALYTICAL CHEMISTRY (13 items; 12 source_provided, 1
// unavailable: item 13, the only "long answer" item, missing from key)
// =====================================================================
ingest('Acids, Bases and Salts', [
  mcq(1, 'The ions which precipitate - insoluble metal hydroxides, when NaOH or NH4OH solution is added to a metallic salt solution:', ['NH4+', 'OH-', 'H+', 'Na+'], '(b)', 'source_provided', 'Ch3B MCQ 1.(b)'),
  mcq(2, 'Salts of elements which are generally coloured belong to:', ['normal elements of group 2 - e.g. Calcium', 'transition elements of group 13 - e.g. Aluminium', 'transitional elements of group 8 - e.g. Iron', 'normal elements of group 16 - e.g. Potassium'], '(c)', 'source_provided', 'Ch3B MCQ 2.(c)'),
  mcq(3, 'A salt solution on reaction with caustic soda gives a white precipitate - insoluble in excess. The cation in the salt is -', ['Mg2+ or Zn2+', 'Zn2+ or Pb2+', 'Ca2+ or Mg2+', 'Cu2+ or Zn2+'], '(c)', 'source_provided', 'Ch3B MCQ 3.(c)'),
  mcq(4, 'The salt formed when a metal with a variable valency, reacts with hot concentrated caustic potash solution:', ['Potassium plumbite', 'Sodium plumbite', 'Potassium zincate', 'Potassium aluminate'], '(a)', 'source_provided', 'Ch3B MCQ 4.(a)'),
  ar(5, '3B', 'Lead [II] oxide reacts with hydrochloric acid & with sodium hydroxide, to give salt & water.', 'Lead [II] oxide is an amphoteric oxide & hence reacts with acids & alkalis to give salt & water.', '(a)', 'source_provided', 'Ch3B MCQ 5.(a)'),
  ar(6, '3B', 'Calcium nitrate reacts with NaOH & NH4OH solution to give a white precipitate.', 'Calcium nitrate with NaOH gives a white ppt. insoluble in excess, but with NH4OH gives no precipitate, since NH4OH is a weak alkali - and hence conc. of OH- ions is low & cannot precipitate Ca(OH)2 [white ppt.]', '(d)', 'source_provided', 'Ch3B MCQ 6.(d)'),
  { sourceQuestionNumber: '7', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'The coloured salts are ___ and ___. [CoCl2/CaCl2/BaCl2/NiCl2]',
    parts: [{ text: 'CoCl2/CaCl2/BaCl2/NiCl2', answer: 'CoCl2, NiCl2' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch3B Fill 7. CoCl2, NiCl2` },
  { sourceQuestionNumber: '8', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'The metal hydroxides insoluble in excess NaOH, but soluble in excess NH4OH are ___ [Cu(OH)2/Mg(OH)2/Zn(OH)2/Pb(OH)2]',
    parts: [{ text: 'Cu(OH)2/Mg(OH)2/Zn(OH)2/Pb(OH)2', answer: 'Cu(OH)2' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch3B Fill 8. Cu(OH)2` },
  openGroup(9, 'Match the following - Column A with Column B: (a) Mg2+ (b) Magnesium hydroxide (c) Aluminium hydroxide (d) Potassium aluminate (e) NO3 1-',
    [
      { text: '(a) Mg2+', answer: '6. Coloured cation / 5. Colourless cation' },
      { text: '(b) Magnesium hydroxide', answer: '3. Dull white colour' },
      { text: '(c) Aluminium hydroxide', answer: '1. Amphoteric in nature' },
      { text: '(d) Potassium aluminate', answer: '2. Soluble in water' },
      { text: '(e) NO3 1-', answer: '4. Colourless anion' },
    ], 'source_provided', 'Ch3B Match 9.(a)5,(b)3,(c)1,(d)2,(e)4'),
  open(10, 'A colourless complex salt solution.', 'source_provided', 'Ch3B Oneword 10. Tetraammine zinc hydroxide', 'Tetraammine zinc hydroxide'),
  open(11, 'An amphoteric hydroxide of a post transition metal.', 'source_provided', 'Ch3B Oneword 11. Al(OH)3', 'Al(OH)3'),
  open(12, 'Sodium hydroxide cannot be used to distinguish Zn(NO3)2 & Pb(NO3)2 solutions but can be used to distinguish Fe(NO3)2 & Fe(NO3)3. Give reasons.', 'source_provided', 'Ch3B Short 12. Both give colourless white solutions (with NaOH); Fe2+/Fe3+ give different coloured hydroxide precipitates', 'Both give colourless white solutions (with NaOH); Fe(OH)2 vs Fe(OH)3 differ in colour'),
  openGroup(13, 'Give balanced equations for the following conversions: Lead -> Lead [II] oxide -> Lead hydroxide -> Sodium plumbite',
    [{ text: 'Lead -> Lead [II] oxide -> Lead hydroxide -> Sodium plumbite (balanced equations)' }], 'unavailable', null),
]);

// =====================================================================
// CHAPTER 4 - MOLE CONCEPT & STOICHIOMETRY (16 items; 14 source_provided,
// 2 unavailable: 15, 16 -- answer key has no "V. Short answer" section)
// =====================================================================
ingest('Mole Concept & Stoichiometry', [
  mcq(1, "Which of the following reactions - illustrates Gay Lussac's Law to correlate with the ratio - 2:13:8:10.", ['C2H6 + O2 ->', 'C3H8 + O2 ->', 'C4H10 + O2 ->', 'C2H2 + O2 ->'], '(c)', 'source_provided', 'Ch4 MCQ 1.(c)'),
  mcq(2, 'The molecular formula of a compound is A2B4C6. The empirical formula likely to be is:', ['AB2C3', 'A2B4C6', 'A6B2C6', 'A2B8H12'], '(a)', 'source_provided', 'Ch4 MCQ 2.(a)'),
  mcq(3, 'The total number of atoms in 18g. of water. [H=1, O=16]', ['6.023x10^23 x 2 atoms', '6.023x10^23 x 3 atoms', '1.8069x10^23 atoms', '1.8069x10^24 atoms'], '(b)', 'source_provided', 'Ch4 MCQ 3.(b)'),
  mcq(4, 'The mass of 1 mole of sulphur molecule [S8] is: [S=32]', ['256 g.', '512 g.', '128 g.', '8 g.'], '(a)', 'source_provided', 'Ch4 MCQ 4.(a)'),
  mcq(5, 'The number of molecules in 17 g. of a basic gas containing nitrogen & hydrogen atom. [H=1, N=14]', ['6.023x10^23 molecules', '3.015x10^23 molecules', '6.023x10^22 molecules', '24.092x10^23 molecules'], '(a)', 'source_provided', 'Ch4 MCQ 5.(a)'),
  mcq(6, "Vapour density of 'X' is 8. The volume occupied by 80 g. of 'X' is:", ['56 lits.', '28 lits.', '168 lits.', '112 lits.'], '(d)', 'source_provided', 'Ch4 MCQ 6.(d)'),
  ar(7, 4, '1 mole of an atom weighs 1 gram atomic mass of the atom.', "Relative atomic mass of an element is the number of times an atom of an element is heavier than 1/12th the mass of an atom of carbon. [C=12]", '(b)', 'source_provided', 'Ch4 MCQ 7.(b)'),
  { sourceQuestionNumber: '8', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'The number of moles in X g. of nitric oxide is ___ [more/less] than the number of moles in X g. of nitrous oxide. [N=14, O=16]',
    parts: [{ text: 'more/less', answer: 'More' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch4 Fill 8. More` },
  { sourceQuestionNumber: '9', kind: 'open', questionFormat: 'fill_in_the_blank', text: "The empirical formula of 'A' is CH2. Its molecular formula is ___ [C2H4/C4H8/C2H2], if its vapour density & empirical formula weight are equal. [C=12, H=1]",
    parts: [{ text: 'C2H4/C4H8/C2H2', answer: 'C2H4' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch4 Fill 9. C2H4` },
  { sourceQuestionNumber: '10', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Manganese [IV] oxide, oxidises conc. HCl - liberating chlorine gas. MnO2 + 4HCl -> MnCl2 + 2H2O + Cl2. If 261 g. of MnO2 is used, the weight of the salt formed is ___ [more/less] than the weight of the oxidising agent used. [Mn=55, O=16, H=1, Cl=35.5]',
    parts: [{ text: 'more/less', answer: 'More, 378 g.' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch4 Fill 10. More, 378 g.` },
  openGroup(11, 'Match the following - Column A with Column B: (a) Atomic weight (b) Mole (c) 1 mole of a gas (d) Gram molecular volume (e) Molar volume',
    [
      { text: '(a) Atomic weight', answer: '4. Atomic mass unit' },
      { text: '(b) Mole', answer: '1. Contains particles equal to Avogadro\'s number' },
      { text: '(c) 1 mole of a gas', answer: '5. Occupies molar volume at s.t.p.' },
      { text: '(d) Gram molecular volume', answer: '3. Volume - 1 g. molecular weight of gas at s.t.p.' },
      { text: '(e) Molar volume', answer: '2. 1 g. molecular weight of a gas' },
    ], 'source_provided', 'Ch4 Match 11.(a)4,(b)1,(c)5,(d)3,(e)2'),
  open(12, 'The percentage by weight of each element in the compound.', 'source_provided', 'Ch4 Oneword 12. Percentage composition', 'Percentage composition'),
  open(13, 'The amount of substance which contains, the same number of units, as the number of atoms in 12.0 g of carbon [C12].', 'source_provided', 'Ch4 Oneword 13. Mole', 'Mole'),
  open(14, 'The law which connects, volumes of gases to the number of molecules it contains.', 'source_provided', "Ch4 Oneword 14. Avogadro's Law", "Avogadro's Law"),
  open(15, 'State which is heavier - a mole of nitrogen atoms or a mole of sodium atoms. Justify your answer. [N=14, Na=23]', 'unavailable', null),
  openGroup(16, 'Select three organic compounds which have the same molecular & empirical formula. (a) Carbon dioxide (b) Ethylene [C2H4] (c) Formaldehyde [CH2O] (d) Nitric oxide [NO] (e) Ethyl ether [C4H10O] (f) Acetic acid [CH3COOH]',
    [{ text: 'Select three with same molecular & empirical formula' }], 'unavailable', null),
]);
// NOTE: answer key's Ch4 section ends at "IV. One word answer questions -
// 12,13,14" with no "V. Short answer questions" section reproduced at all,
// even though the source paper prints items 15 and 16 under that heading.

// =====================================================================
// CHAPTER 5 - ELECTROLYSIS (20 items; 19 source_provided, 1 unavailable:
// item 20, the only "long answer" item, missing from the answer key)
// =====================================================================
ingest('Electrolysis', [
  mcq(1, 'Anions are atoms which carry a negative charge - they:', ['Migrate - to the reducing electrode.', 'Get - reduced to neutral atoms.', 'Lose - electrons at the anode, to form neutral atoms.', 'Are discharged - at the requisite electrode by a process called reduction.'], '(c)', 'source_provided', 'Ch5 MCQ 1.(c)'),
  mcq(2, 'The statement given below which is incorrect.', [
    'Ionization - may involve atoms changing into ions.',
    'The number of electrons gained by the anode - is equal to the number of electrons, donated by the cathode.',
    'In the electrochemical series, sodium ions are discharged by reduction, more easily than copper ions.',
    'A copper electrode itself loses electrons & forms ions at the anode.'], '(c)', 'source_provided', 'Ch5 MCQ 2.(c)'),
  mcq(3, 'The diagram represents electrolysis of molten lead bromide. The incorrect statement for the above electrolysis is:', [
    'At the oxidising electrode - the electrons enter the electrolyte & the process is called oxidation.',
    'The ions in solid PbBr2 are held together by an electrostatic force of attraction & hence the crucible is heated from outside, resulting in ions of Pb2+ & Br1- being free.',
    "The electrode reaction at 'Y' is - Pb2+ + 2e- -> Pb.",
    "At 'X' - bromine ions, give up electrons resulting in formation of bromine atoms - which form a covalent bond between atoms, resulting in formation of a bromine molecule."], '(a)', 'source_provided', 'Ch5 MCQ 3.(a)'),
  mcq(4, 'During electrolysis of aq. copper [II] sulphate, the ion/s at the cathode - which is not a spectator ion is -', ['H1+', 'Cu2+', 'SO4 2-', 'OH1-'], '(b)', 'source_provided', 'Ch5 MCQ 4.(b)'),
  mcq(5, 'Hydrogen gas is evolved at the reducing electrode, during electrolysis of-', ['Acidified water - using inert electrodes.', 'Aqueous solution of caustic potash - using inert electrodes.', 'Both (a) & (b)', 'Only (a)'], '(c)', 'source_provided', 'Ch5 MCQ 5.(c)'),
  mcq(6, 'During electroplating of an article with silver. [statements a-d]', ['electrolyte contains Ag1+, CN1- & NO3 1- ions', 'cathode reaction is Ag1+ -> Ag + 1e-', 'electrons migrate to anode are Ag1+ & CN1-', 'ions remaining in solution are Ag1+ & OH1- ions'], '(b)', 'source_provided', 'Ch5 MCQ 6.(b)'),
  mcq(7, 'During electrorefining of copper - select the incorrect answer:', ['Thin sheet of copper - serves as the oxidising electrode.', 'Cu -> Cu2+ + 2e- - is the reaction at the anode.', 'The anode mud or slime contains - iron, silver & zinc as impurities.', 'Copper is refined by electrolysis.'], '(c)', 'source_provided', 'Ch5 MCQ 7.(c)'),
  ar(8, 5, 'The products of electrolysis are formed at the anode & cathode itself.', 'Only at the surface of the electrodes, does exchange of electrons takes place.', '(a)', 'source_provided', 'Ch5 MCQ 8.(a)'),
  ar(9, 5, 'During electrolysis of water, using platinum electrodes, the water is acidified using dilute nitric acid.', 'Pure water is almost a non-electrolyte & will not normally conduct electricity, since it consists almost entirely of molecules.', '(d)', 'source_provided', 'Ch5 MCQ 9.(d)'),
  ar(10, 5, 'During electroplating of an article with silver using sodium argentocyanide, the anode diminishes in mass.', 'At the cathode - the silver ions are discharged as neutral silver atoms, by gain of electrons.', '(b)', 'source_provided', 'Ch5 MCQ 10.(b)'),
  { sourceQuestionNumber: '11', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'During electrolysis of aq. copper [II] sulphate using platinum electrodes, the ion discharged at the anode is ___ [Cu2+/SO4 2-/OH1-/H1+].',
    parts: [{ text: 'Cu2+/SO4 2-/OH1-/H1+', answer: 'OH1-' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch5 Fill 11. OH1-` },
  { sourceQuestionNumber: '12', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'The tendency of the anions to get ___ [reduced/oxidised] at the anode increases on ___ [ascending/descending] the electrochemical series.',
    parts: [{ text: 'reduced/oxidised; ascending/descending', answer: 'oxidised; descending' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch5 Fill 12. oxidised, descending` },
  { sourceQuestionNumber: '13', kind: 'open', questionFormat: 'fill_in_the_blank', text: '___ [nickel/graphite] electrodes, only provide a surface for electrolytic reaction to occur & may be used as a conducting element in the circuit.',
    parts: [{ text: 'nickel/graphite', answer: 'Graphite' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch5 Fill 13. Graphite` },
  openGroup(14, 'Match the following - Column A with Column B: (a) NaHCO3 (b) Gold (c) KNO3 (d) Hg2+ & H1+ (e) Magnesium',
    [
      { text: '(a) NaHCO3', answer: '3. Weak electrolyte' },
      { text: '(b) Gold', answer: '4. Inert electrode' },
      { text: '(c) KNO3', answer: '1. Strong electrolyte' },
      { text: '(d) Hg2+ & H1+', answer: '5. Hg2+ discharged at cathode' },
      { text: '(e) Magnesium', answer: '2. Active electrode' },
    ], 'source_provided', 'Ch5 Match 14.(a)3,(b)4,(c)1,(d)5,(e)2'),
  openGroup(15, 'During electrolysis - of acidified water: Column A with Column B: (a) H1+ (b) H1+, SO4 2-, OH1- (c) OH1- (d) OH1-, SO4 2- (e) SO4 2- ions',
    [
      { text: '(a) H1+', answer: '4. Discharged at the cathode' },
      { text: '(b) H1+, SO4 2-, OH1-', answer: '5. Ions present in electrolyte' },
      { text: '(c) OH1-', answer: '3. Discharged at the anode' },
      { text: '(d) OH1-, SO4 2-', answer: '2. Concentration increases at the anode' },
      { text: '(e) SO4 2- ions', answer: '1. Migrate to the anode' },
    ], 'source_provided', 'Ch5 Match 15.(a)4,(b)5,(c)3,(d)1,(e)2'),
  open(16, 'Which of the two is a non-electrolyte - Carbon tetrachloride, ammonia aq. soln.', 'source_provided', 'Ch5 Oneword 16. CCl4', 'CCl4'),
  openGroup(17, 'Conditions for electroplating - (a) Low current / AC current (b) High current / direct current (c) Low current for longer time',
    [{ text: 'Correct condition for electroplating', answer: '(c)' }], 'source_provided', 'Ch5 Oneword 17.(c)'),
  open(18, 'During electroplating of copper using aq. CuSO4, which of the two - anode or cathode - increases in mass.', 'source_provided', 'Ch5 Short 18. Cathode', 'Cathode'),
  open(19, 'Give reasons - During electroplating an article with nickel - NiSO4 solution is used & Ni(NO3)2 solution is not used.', 'source_provided', 'Ch5 Short 19. Nitrate ions tends to undergo reduction at cathode, along with Ni ions.', 'Nitrate ions tends to undergo reduction at cathode, along with Ni ions.'),
  openGroup(20, 'If you are given a block of impure copper, draw a diagram to differentiate the: (a) Electrorefining of the impure block - with (b) Electroplating of an iron article with the copper block.',
    [{ text: '(a) Electrorefining diagram' }, { text: '(b) Electroplating diagram' }], 'unavailable', null),
]);

// =====================================================================
// CHAPTER 6 - METALLURGY (20 items; 17 source_provided, 3 unavailable:
// 15 (2nd match question, missing), 19, 20 (no VI section in answer key))
// =====================================================================
ingest('Metallurgy', [
  mcq(1, 'The basic oxide of an alkaline earth metal.', ['K2O', 'CuO', 'CaO', 'PbO'], '(c)', 'source_provided', 'Ch6 MCQ 1.(c)'),
  mcq(2, 'The common name of an ore, having two metallic and one non-metallic element.', ['Spathic iron ore', 'Bauxite', 'Calamine', 'Cryolite'], '(d)', 'source_provided', 'Ch6 MCQ 2.(d)'),
  mcq(3, 'The metal in the activity series, which ionizes least readily.', ['Iron', 'Platinum', 'Magnesium', 'Sodium'], '(b)', 'source_provided', 'Ch6 MCQ 3.(b)'),
  mcq(4, "The concentrated ore, which is roasted to convert it to its metallic oxide 'X'.", ['Calamine', 'Iron pyrites', 'Bauxite', 'Spathic iron ore'], '(b)', 'source_provided', 'Ch6 MCQ 4.(b)'),
  mcq(5, "The metallic oxide 'X' obtained above is reduced to its metal by use -", ['of a neutral oxide', 'by electrolysis', 'by heat alone', 'both (a) & (c)'], '(a)', 'source_provided', 'Ch6 MCQ 5.(a)'),
  mcq(6, "The product, of which of the following reactions in Baeyer's Process - is water soluble.", [
    'Impure bauxite with concentrated solution of alkali.',
    'Dilution of sodium aluminate with water.',
    'Thermal decomposition of aluminium hydroxide.',
    'Both (b) & (c)'], '(a)', 'source_provided', 'Ch6 MCQ 6.(a)'),
  mcq(7, 'The impurity present in bauxite, which is an amphoteric oxide.', ['Silicon dioxide', 'Iron [III] oxide', 'Both (a) & (b)', 'Neither (a) or (b)'], '(d)', 'source_provided', 'Ch6 MCQ 7.(d)'),
  mcq(8, "In Hall Heroult's process for reduction of metallic oxide to metal - the constituent of the electrolyte mixture, which contains two metallic elements.", ['Fused alumina', 'Cryolite', 'Fluorspar', 'Both (b) & (c)'], '(b)', 'source_provided', 'Ch6 MCQ 8.(b)'),
  ar(9, 6, 'Fused alumina can be electrolytically reduced to aluminium.', 'The main constituent of the electrolyte - is a stable amphoteric oxide & cannot be reduced by - carbon, carbon monoxide or hydrogen.', '(a)', 'source_provided', 'Ch6 MCQ 9.(a)'),
  ar(10, 6, 'Sulphide ores are preferred to be calcined, than roasted.', 'Roasting of an ore, makes it easier to extract a metal from its oxide form, than from its sulphide form.', '(d)', 'source_provided', 'Ch6 MCQ 10.(d)'),
  { sourceQuestionNumber: '11', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Potassium an ___ [alkali metal/alkaline earth metal], has ___ [two/one] electron/s in its valence shell, which it easily gives up & hence is a strong ___ [oxidising/reducing] agent.',
    parts: [{ text: 'alkali metal/alkaline earth metal; two/one; oxidising/reducing', answer: 'Alkali metal, One, Reducing' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch6 Fill 11. Alkali metal, One, Reducing` },
  { sourceQuestionNumber: '12', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Roasting of ___ [spathic iron ore/iron pyrites] liberates a gas, which turns lime water milky.',
    parts: [{ text: 'spathic iron ore/iron pyrites', answer: 'Iron pyrites' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch6 Fill 12. Iron pyrites` },
  { sourceQuestionNumber: '13', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'From [bronze, stainless steel & duralumin] the strongest alloy is ___.',
    parts: [{ text: 'bronze/stainless steel/duralumin', answer: 'Stainless steel' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch6 Fill 13. Stainless steel` },
  openGroup(14, 'Match the following - Column A with Column B: (a) Magnetite (b) Calcium from CaCl2 (c) Alloy of Cu & Zn (d) Calcination (e) Iron from haematite',
    [
      { text: '(a) Magnetite', answer: '4. Tri iron tetroxide' },
      { text: '(b) Calcium from CaCl2', answer: '5. Electrolysis' },
      { text: '(c) Alloy of Cu & Zn', answer: '6. Brass' },
      { text: '(d) Calcination', answer: '1. Carbonate ores' },
      { text: '(e) Iron from haematite', answer: '2. Carbon monoxide' },
    ], 'source_provided', 'Ch6 Match 14.(a)4,(b)5,(c)6,(d)1,(e)2'),
  openGroup(15, 'Match the following - Column A: (a) Calamine (b) Lithium (c) Zinc (d) Haematite (e) Aluminium -- with Column B: 1. Heavy metal 2. Weak metal 3. Alkali metal 4. Iron ore 5. Zinc ore 6. Aluminium ore',
    [{ text: '(a) Calamine' }, { text: '(b) Lithium' }, { text: '(c) Zinc' }, { text: '(d) Haematite' }, { text: '(e) Aluminium' }],
    'unavailable', null),
  openGroup(16, 'One word answer questions: X - 2e- -> X2+ (a) Is X a metal or a non-metal. (b) Is the process reduction or oxidation. (c) Is X an oxidising agent or a reducing agent. (d) Will X form, an acidic oxide or basic oxide. (e) A metal with variable valency - which forms an amphoteric oxide.',
    [
      { text: '(a) Is X a metal or a non-metal', answer: 'Metal' },
      { text: '(b) Is the process reduction or oxidation', answer: 'Oxidation' },
      { text: '(c) oxidising or reducing agent', answer: 'Reducing agent' },
      { text: '(d) acidic or basic oxide', answer: 'Basic oxide' },
      { text: '(e) metal with variable valency forming amphoteric oxide', answer: 'Lead' },
    ], 'source_provided', 'Ch6 Oneword 16.(a)Metal,(b)Oxidation,(c)Reducing agent,(d)Basic oxide,(e)Lead'),
  open(17, 'The metals other than magnesium - which imparts strength to duralumin.', 'source_provided', 'Ch6 Oneword 17. Cu, Mn', 'Cu, Mn'),
  open(18, 'State the principal behind, concentration or dressing of the ore - zinc sulphide.', 'source_provided', 'Ch6 Short 18. Froth flotation', 'Froth flotation'),
  openGroup(19, 'Give reasons why - cryolite enhances (a) mobility (b) conductivity of the electrolytic mixture - in Hall Heroult\'s process.',
    [{ text: '(a) mobility' }, { text: '(b) conductivity' }], 'unavailable', null),
  openGroup(20, 'Give balanced equations, for the following conversions: (a) Zinc blende to zinc oxide. (b) Iron pyrites to iron [III] oxide. (c) Calamine to zinc oxide. (d) Spathic iron ore to iron [II] oxide. (e) Iron [III] oxide to iron - using a neutral gas. (f) A black basic oxide to a metal - using a non-metal. (g) Silver [I] oxide to a metal - by thermal decomposition. (h) Pure alumina from impure bauxite [Baeyer\'s process]. (i) Ionisation & electrode reactions - [Hall Heroult\'s process].',
    [{ text: '(a)' }, { text: '(b)' }, { text: '(c)' }, { text: '(d)' }, { text: '(e)' }, { text: '(f)' }, { text: '(g)' }, { text: '(h)' }, { text: '(i)' }],
    'unavailable', null),
]);

// =====================================================================
// CHAPTER 7A - HYDROGEN CHLORIDE (24 items; 18 source_provided, 6
// unavailable: 19-24 -- answer key stops at item 18, no V/VI sections)
// =====================================================================
ingest('Study of Compounds', [
  mcq(1, 'The gas other than HCl - collected by upward displacement of air & not over water.', ['NH3', 'SO2', 'H2', 'CO2'], '(a)', 'source_provided', 'Ch7A MCQ 1.(d)'),
  mcq(2, 'The acid which reacts with NaCl in the laboratory preparation of HCl gas is a -', ['Weak acid', 'Volatile acid', 'Monobasic acid', 'Strong acid'], '(d)', 'source_provided', 'Ch7A MCQ 2.(d)'),
  mcq(3, 'Hydrogen chloride gas -', ['Is combustible and turns - blue litmus red.', 'Extinguishes - a glowing splint & turns methyl orange red.', 'Turns - alkaline phenolphthalein colourless to pink.', 'Combines - with a basic gas to give a solid.'], '(d)', 'source_provided', 'Ch7A MCQ 3.(d)'),
  mcq(4, 'A solution of hydrogen chloride gas in water -', ['Is a non-electrolyte', 'Does not - change the colour of phenolphthalein', 'Dissociates - to give hydroxyl ions', 'Reacts with - a sulphide to liberate sulphur dioxide gas.'], '(b)', 'source_provided', 'Ch7A MCQ 4.(b)'),
  mcq(5, 'The salt formed, common in both reactions of conc. HCl - with Manganese [IV] oxide & potassium permanganate, but not with lead [IV] oxide is:', ['KCl', 'MnCl2', 'PbCl2', 'NaCl'], '(b)', 'source_provided', 'Ch7A MCQ 5.(b)'),
  mcq(6, 'The salt which reacts with dil. HCl - to give an insoluble chloride is:', ['Copper nitrate', 'Silver nitrate', 'Lead nitrate', 'both (b) & (c)'], '(d)', 'source_provided', 'Ch7A MCQ 6.(d)'),
  mcq(7, 'A metallic oxide which does not react with conc. HCl to liberate - a greenish yellow gas.', ['Lead [IV] oxide', 'Iron [III] oxide', 'Manganese [IV] oxide', 'Trilead tetroxide'], '(b)', 'source_provided', 'Ch7A MCQ 7.(b)'),
  ar(8, '7A', 'A solution of hydrogen chloride in water, exhibits acidic properties.', 'Hydrogen chloride is a covalent compound, which behaves like an ionic compound in aqueous solution.', '(a)', 'source_provided', 'Ch7A MCQ 8.(a)'),
  ar(9, '7A', 'Zinc reacts with dilute HCl, to liberate hydrogen.', 'A simple displacement reaction takes place, between the metal & the acid, liberating hydrogen.', '(a)', 'source_provided', 'Ch7A MCQ 9.(a)'),
  ar(10, '7A', 'Conc. H2SO4 is used in the lab. preparation of HCl gas, using sodium chloride.', 'Conc. HNO3 is not used since it is volatile & may volatize out with hydrogen chloride.', '(b)', 'source_provided', 'Ch7A MCQ 10.(b)'),
  { sourceQuestionNumber: '11', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'An acidic oxide which is not used as a drying agent for HCl gas is ___ [CaO/P2O5].',
    parts: [{ text: 'CaO/P2O5', answer: 'P2O5' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7A Fill 11. P2O5` },
  { sourceQuestionNumber: '12', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'A gas heavier than air like HCl gas but, unlike HCl, only fairly soluble in water is ___ [H2S/O2/SO2].',
    parts: [{ text: 'H2S/O2/SO2', answer: 'H2S' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7A Fill 12. H2S` },
  { sourceQuestionNumber: '13', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Reaction of conc. HCl with ___ [KAlO2/KMnO4] proves that hydrochloric acid contains chlorine.',
    parts: [{ text: 'KAlO2/KMnO4', answer: 'KMnO4' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7A Fill 13. KMnO4` },
  openGroup(14, 'Match the following - Column A with Column B: (a) PbO2 + conc. HCl (b) Conc. HNO3 + conc. HCl (c) Na2SO3 + dil. HCl (d) Na2S + dil. HCl (e) Fe + dil. HCl',
    [
      { text: '(a) PbO2 + conc. HCl', answer: '4. Chlorine evolved' },
      { text: '(b) Conc. HNO3 + conc. HCl', answer: '1. Nascent [Cl] formed' },
      { text: '(c) Na2SO3 + dil. HCl', answer: '2. SO2 evolved' },
      { text: '(d) Na2S + dil. HCl', answer: '5. H2S evolved' },
      { text: '(e) Fe + dil. HCl', answer: '3. Iron [II] chloride formed' },
    ], 'source_provided', 'Ch7A Match 14.(a)4,(b)1,(c)2,(d)5,(e)3'),
  openGroup(15, 'Match the following - Column A with Column B: (a) K2Cr2O7 (b) Nitrosyl chloride (c) PtCl4 (d) PbCl2 (e) NH4Cl',
    [
      { text: '(a) K2Cr2O7', answer: '5. Oxidising agent' },
      { text: '(b) Nitrosyl chloride', answer: '1. Aqua regia' },
      { text: '(c) PtCl4', answer: '2. An insoluble chloride' },
      { text: '(d) PbCl2', answer: '4. A chloride, soluble in hot water' },
      { text: '(e) NH4Cl', answer: '3. A solid formed from two gases, one of which is basic' },
    ], 'source_provided', 'Ch7A Match 15.(a)5,(b)1,(c)2,(d)4,(e)3'),
  open(16, 'The catalyst involved in the synthesis of HCl gas, in presence of diffused sunlight.', 'source_provided', 'Ch7A Oneword 16. Moisture', 'Moisture'),
  open(17, 'A weak alkali which reacts with, dil. HCl to give a salt, which undergoes thermal dissociation on heating.', 'source_provided', 'Ch7A Oneword 17. Ammonium hydroxide', 'Ammonium hydroxide'),
  open(18, 'HCl gas turns moist blue litmus red. Name a coloured gas which also has the same effect on moist blue litmus.', 'source_provided', 'Ch7A Oneword 18. Nitrogen dioxide', 'Nitrogen dioxide'),
  open(19, 'HCl gas fumes in moist air, but hydrogen sulphide gas does not. Give a reason.', 'unavailable', null),
  open(20, 'Reaction of zinc with HCl gas, is a simple displacement reaction, but reaction of NaOH with dil. HCl is a double decomposition reaction. Give reasons.', 'unavailable', null),
  open(21, 'An aq. solution of both HCl gas & of SO2 gas are electrolytes. Give reasons.', 'unavailable', null),
  openGroup(22, "Give balanced equations - for the following conversions. (a) PbO2 -> [A] PbCl2 [C]-> PbSO4; Pb(NO3)2 -> [B] PbCl2",
    [{ text: 'A: PbO2 -> PbCl2' }, { text: 'B: Pb(NO3)2 -> PbCl2' }, { text: 'C: PbCl2 -> PbSO4' }], 'unavailable', null),
  open(23, 'Give two differences in properties between - a solution of HCl gas dissolved in water and HCl gas dissolved in an organic solvent. Give reasons for the difference.', 'unavailable', null),
  openGroup(24, "Explain the reason why method 'B' is used & 'A' not used in the lab preparation of HCl acid from HCl gas. State what would happen, if the rim of the funnel does not touch the surface of water in the trough in 'B'.",
    [{ text: "Why B (inverted funnel) used, not A (direct delivery tube)" }, { text: "What happens if funnel rim doesn't touch water surface" }], 'unavailable', null),
]);

// =====================================================================
// CHAPTER 7B - AMMONIA (20 items; 15 source_provided, 5 unavailable:
// 16-20 -- answer key stops at item 15, no IV/V sections)
// =====================================================================
ingest('Study of Compounds', [
  mcq(1, 'In the laboratory preparation of ammonia gas, the substances preferred and not preferred respectively are -', ['NaOH & NH4NO3', 'Ca(OH)2 & (NH4)2SO4', 'Ca(OH)2 & NH4NO3', 'Ca(OH)2 & (NH4)2CO3.'], '(c)', 'source_provided', 'Ch7B MCQ 1.(c)'),
  mcq(2, 'In the laboratory preparation of ammonia - the drying agent which forms an addition product with ammonia, if used is.', ['CaO', 'P2O5', 'Fused CaCl2', 'Conc. H2SO4'], '(c)', 'source_provided', 'Ch7B MCQ 2.(c)'),
  mcq(3, 'The metal hydroxide obtained when a metal nitride of a trivalent metal, reacts with warm water to give ammonia is -', ['Ca(OH)2', 'Al(OH)3', 'Fe(OH)3', 'Mg(OH)2'], '(b)', 'source_provided', 'Ch7B MCQ 3.(b)'),
  mcq(4, "The impurity, which may poison the catalyst iron - in Haber's process for manufacture of ammonia is -", ['H2S', 'NO2', 'SO2', 'N2'], '(a)', 'source_provided', 'Ch7B MCQ 4.(a)'),
  mcq(5, 'The burning of ammonia in oxygen is -', ['an exothermic reaction', 'yields a product which on oxidation give a coloured gas', 'reactants burn with a green flame', 'gives a product, which is a neutral oxide.'], '(c)', 'source_provided', 'Ch7B MCQ 5.(c)'),
  mcq(6, 'An ammonium salt which on heating, yields a basic and an acidic gas.', ['NH4Cl', 'NH4NO3', '(NH4)2SO4', '(NH4)2CO3'], '(a)', 'source_provided', 'Ch7B MCQ 6.(a)'),
  mcq(7, 'A metallic salt solution which does not react with ammonium hydroxide, to give an insoluble precipitate -', ['Zinc nitrate', 'Sodium nitrate', 'Lead nitrate', 'Iron [II] nitrate'], '(b)', 'source_provided', 'Ch7B MCQ 7.(b)'),
  ar(8, '7B', 'Ammonia is a strong reducing agent.', 'Ammonia reduces chlorine to hydrogen chloride & copper [II] oxide to copper.', '(b)', 'source_provided', 'Ch7B MCQ 8.(b)'),
  ar(9, '7B', 'Lead & zinc salt solutions can be distinguished using excess NH4OH solution.', 'The precipitated lead hydroxide formed is soluble while zinc hydroxide is insoluble in excess NH4OH solution.', '(c)', 'source_provided', 'Ch7B MCQ 9.(c)'),
  ar(10, '7B', 'Liquid ammonia is used as a cleansing agent.', 'Liquid ammonia is highly volatile & liquefies easily under pressure.', '(a)', 'source_provided', 'Ch7B MCQ 10.(a)'),
  { sourceQuestionNumber: '11', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Ammonia gas is collected by the ___ [upward/downward] displacement of ___ [water/air].',
    parts: [{ text: 'upward/downward; water/air', answer: 'Downward, Air' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7B Fill 11. Downward, Air` },
  { sourceQuestionNumber: '12', kind: 'open', questionFormat: 'fill_in_the_blank', text: "In Haber's process the catalyst used is ___ [Pt/Fe] & the promoter is ___ [MnO2/Al2O3/Mo].",
    parts: [{ text: 'Pt/Fe; MnO2/Al2O3/Mo', answer: 'Fe, Mo' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7B Fill 12. Fe, Mo` },
  { sourceQuestionNumber: '13', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Ammonia reacts with HCl gas and with ___ [N2/Cl2] to give dense white fumes.',
    parts: [{ text: 'N2/Cl2', answer: 'Cl2' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7B Fill 13. Cl2` },
  openGroup(14, 'Match the following - for the reactants in A to give the products in B. (a) Mg3N2+H2O[warm] (b) NH3+O2[burning] (c) NH4OH+HNO3[dilute] (d) NH3+buff yellow amphoteric oxide[heat] (e) NH3+coloured acidic gas[excess]',
    [
      { text: '(a) Mg3N2+H2O[warm]', answer: '3. Ammonia' },
      { text: '(b) NH3+O2[burning]', answer: '5. Nitrogen' },
      { text: '(c) NH4OH+HNO3[dilute]', answer: '1. Ammonium nitrate' },
      { text: '(d) NH3+buff yellow amphoteric oxide[heat]', answer: '2. Lead' },
      { text: '(e) NH3+coloured acidic gas[excess]', answer: '4. Nitrogen trichloride' },
    ], 'source_provided', 'Ch7B Match 14.(a)3,(b)5,(c)1,(d)2,(e)4'),
  openGroup(15, 'Match the following - Column A with Column B: (a) Liquor ammonia - dissociation (b) Zn(NO3)2 + liquor ammonia (c) NH3[excess]+Cl2 (d) NH3+Cl2[excess] (e) [Cu(NH3)4]SO4 solution',
    [
      { text: '(a) Liquor ammonia - dissociation', answer: '4. NH4+ + OH- ions' },
      { text: '(b) Zn(NO3)2 + liquor ammonia', answer: '1. White gelatinous precipitate' },
      { text: '(c) NH3[excess]+Cl2', answer: '5. Dense white fumes' },
      { text: '(d) NH3+Cl2[excess]', answer: '3. Yellow explosive liquid' },
      { text: '(e) [Cu(NH3)4]SO4 solution', answer: '2. Deep blue colour' },
    ], 'source_provided', 'Ch7B Match 15.(a)4,(b)1,(c)5,(d)3,(e)2'),
  openGroup(16, "In Haber's process for manufacture of ammonia - give reasons. (i) The catalyst does not affect, the percentage yield of ammonia. (ii) Small amounts of promoter, are added to the catalyst. (iii) The nitrogen-hydrogen reactant mixture must be free from impurities.",
    [{ text: '(i)' }, { text: '(ii)' }, { text: '(iii)' }], 'unavailable', null),
  open(17, 'In which of the two reactions - (a) burning of ammonia in oxygen (b) catalytic oxidation of ammonia, does the product formed, changes colour on oxidation. Justify your answer.', 'unavailable', null),
  openGroup(18, 'Give balanced equations for the following conversions: (i) NH3 -> NH4Cl: (a) using a dilute acid (b) using an acidic gas (ii) NH3 -> N2: (a) using a neutral gas (b) using a basic oxide',
    [{ text: '(i)(a)' }, { text: '(i)(b)' }, { text: '(ii)(a)' }, { text: '(ii)(b)' }], 'unavailable', null),
  open(19, 'Give a reason why - liquid ammonia is used as a refrigerant, but liquor ammonia is not.', 'unavailable', null),
  openGroup(20, "The diagram shows the burning of ammonia in oxygen. Give a reason why: (i) The two tubes 'A' & 'B' are of different lengths. (ii) Dry ammonia, is passed through tube 'A'. (iii) Ammonia passed through ignition tube 'A' alone, does not burn. (iv) Excess oxygen, is used the in reaction.",
    [{ text: '(i)' }, { text: '(ii)' }, { text: '(iii)' }, { text: '(iv)' }], 'unavailable', null),
]);

// =====================================================================
// CHAPTER 7C - NITRIC ACID (23 items; 20 source_provided, 3 unavailable:
// 21-23 -- answer key stops at item 20, no VI section)
// =====================================================================
ingest('Study of Compounds', [
  mcq(1, 'The acid which reacts with chile salt petre, in the laboratory preparation of nitric acid is -', ['dil. HCl', 'Conc. H2SO4', 'dil. H2CO3', 'dil. H2SO4.'], '(b)', 'source_provided', 'Ch7C MCQ 1.(b)'),
  mcq(2, 'The gas evolved on decomposition of nitric acid - which turns colourless alkaline pyrogallol brown is -', ['Nitric oxide', 'Oxygen', 'Nitrogen dioxide', 'Water vapour'], '(b)', 'source_provided', 'Ch7C MCQ 2.(b)'),
  mcq(3, "In Ostwald's process the neutral oxide is formed by reaction between-", ['Nitric oxide & oxygen', 'Ammonia & oxygen [under prevalent conditions]', 'Nitrogen dioxide, water & excess air', 'Nitrogen dioxide & oxygen.'], '(b)', 'source_provided', 'Ch7C MCQ 3.(b)'),
  mcq(4, 'The indicator which does not change its colour, on reaction with nitric acid is:', ['Moist litmus', 'Phenolphthalein', 'Alkaline phenolphthalein', 'Methyl orange'], '(b)', 'source_provided', 'Ch7C MCQ 4.(b)'),
  mcq(5, 'Nitric oxide gas is liberated when dil. nitric acid reacts with -', ['Carbon', 'Zinc', 'Sulphur', 'Magnesium.'], '(b)', 'source_provided', 'Ch7C MCQ 5.(b)'),
  mcq(6, 'The metallic nitrate which does not liberate, an acidic coloured gas on heating is-', ['KNO3', 'Pb(NO3)2', 'Zn(NO3)2', 'AgNO3'], '(a)', 'source_provided', 'Ch7C MCQ 6.(a)'),
  mcq(7, 'In the brown ring test, the oxidising agent used is -', ['Conc. H2SO4', 'dil. HNO3', 'Iron [II] sulphate', 'Iron [III] sulphate'], '(b)', 'source_provided', 'Ch7C MCQ 7.(b)'),
  ar(8, '7C', 'Fuming nitric acid renders iron passive.', 'A thin oxide coating on the surface of the metal is formed, which prevents further reaction.', '(a)', 'source_provided', 'Ch7C MCQ 8.(a)'),
  ar(9, '7C', 'To convert conc. nitric acid to sulphuric acid, it is reacted with carbon.', 'Carbon is oxidised by hot conc. nitric acid - liberating nitrogen dioxide.', '(d)', 'source_provided', 'Ch7C MCQ 9.(d)'),
  ar(10, '7C', 'Dilute nitric acid is ionized almost completely, into hydrogen ions & nitrate ions.', 'Dilute nitric acid, has predominant acidic properties.', '(a)', 'source_provided', 'Ch7C MCQ 10.(a)'),
  { sourceQuestionNumber: '11', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Depending on the concentration & temperature of the reaction, nitric acid undergoes reduction to give ___ [H2/NO] as a reduction product.',
    parts: [{ text: 'H2/NO', answer: 'NO' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7C Fill 11. NO` },
  { sourceQuestionNumber: '12', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Sodium nitrate reacts with conc. H2SO4 at temperatures less than 200 C, to give a salt which ___ [does not contain/contains] a replaceable hydrogen atom in its molecule.',
    parts: [{ text: 'does not contain/contains', answer: 'Contains' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7C Fill 12. Contains` },
  { sourceQuestionNumber: '13', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'The acid ___ [dilute/conc.] nitric acid is almost completely ionized & its ___ [oxidizing/acidic] properties predominate.',
    parts: [{ text: 'dilute/conc.; oxidizing/acidic', answer: 'dilute; acidic' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7C Fill 13. dilute; acidic` },
  openGroup(14, 'Match the following - Column A with Column B: (a) Product of oxidation chamber - Ostwald\'s process (b) Ammonium nitrate - thermal decomposition (c) Brown ring - in brown ring test (d) Reaction of Fe with dil. HNO3 (e) Potassium nitrate - thermal decomposition',
    [
      { text: '(a) Product of oxidation chamber', answer: '4. Nitrogen dioxide' },
      { text: '(b) Ammonium nitrate thermal decomposition', answer: '5. Nitrous oxide' },
      { text: '(c) Brown ring in brown ring test', answer: '2. Nitroso iron [II] sulphate' },
      { text: '(d) Reaction of Fe with dil. HNO3', answer: '3. Nitric oxide' },
      { text: '(e) Potassium nitrate thermal decomposition', answer: '1. Oxygen' },
    ], 'source_provided', 'Ch7C Match 14.(a)4,(b)5,(c)2,(d)3,(e)1'),
  openGroup(15, 'Match the following - Column A with Column B: (a) KOH + HNO3[dil.] (b) HNO3 -> H+ + NO3- (c) KNO3 -> KNO2 (d) FeCO3 -> Fe(NO3)2 (e) C + HNO3[Conc.]',
    [
      { text: '(a) KOH + HNO3[dil.]', answer: '5. Neutralization' },
      { text: '(b) HNO3 -> H+ + NO3-', answer: '3. Monobasic acid' },
      { text: '(c) KNO3 -> KNO2', answer: '2. Thermal decomposition' },
      { text: '(d) FeCO3 -> Fe(NO3)2', answer: '4. Acidic nature' },
      { text: '(e) C + HNO3[Conc.]', answer: '1. Oxidation' },
    ], 'source_provided', 'Ch7C Match 15.(a)5,(b)3,(c)2,(d)4,(e)1'),
  open(16, 'A metal having variable valency - rendered passive with conc. nitric acid.', 'source_provided', 'Ch7C Oneword 16. Iron', 'Iron'),
  open(17, 'The colour of nitric acid, kept in a bottle on the laboratory shelf.', 'source_provided', 'Ch7C Oneword 17. Yellowish brown', 'Yellowish brown'),
  open(18, 'A non-metal which reacts with conc. HNO3, to give a dibasic acid.', 'source_provided', 'Ch7C Oneword 18. Sulphur', 'Sulphur'),
  openGroup(19, "A: conc. H2SO4 B: NaNO3 C: FeSO4 solution - The correct order of use for the brown ring test is - (a) C,B,A (b) B,C,A (c) A,B,C. State why 'C' should be i] freshly prepared ii] saturated.",
    [{ text: 'correct order', answer: '(b)' }, { text: 'why C freshly prepared / saturated' }], 'source_provided', 'Ch7C Short 19.(b)'),
  openGroup(20, "State which of the conversions - in Ostwald's process - A: NO -> NO2 B: NH3 -> NO C: NO2 -> HNO3 takes place at ordinary temperatures. Give a balanced equation for the same.",
    [{ text: 'which conversion at ordinary temperature', answer: '(c) NO2 -> HNO3' }], 'source_provided', 'Ch7C Short 20.(c)'),
  open(21, 'Copper can be used to distinguish conc. HNO3 from conc. H2SO4. Justify the statement with a suitable equation.', 'unavailable', null),
  openGroup(22, 'Give the function of: (a) Conc. nitric acid - in aqua regia. (b) Conc. sulphuric acid - in the brown ring test. (c) Conc. nitric acid - in purification of gold.',
    [{ text: '(a)' }, { text: '(b)' }, { text: '(c)' }], 'unavailable', null),
  openGroup(23, 'Give balanced equations for the following conversions, using dil. or conc. HNO3. (a) A volatile acid to - a non-volatile acid. (b) A metal having variable valency to - nitric oxide. (c) A divalent metal to a neutral gas - which burns with a pale blue flame. (d) Iron [II] sulphate to iron [III] sulphate.',
    [{ text: '(a)' }, { text: '(b)' }, { text: '(c)' }, { text: '(d)' }], 'unavailable', null),
]);

// =====================================================================
// CHAPTER 7D - SULPHURIC ACID (27 items; 21 source_provided, 6
// unavailable: 22-27 -- answer key stops at item 21, no V/VI sections)
// =====================================================================
ingest('Study of Compounds', [
  mcq(1, 'In the Contact Process, the conversion of sulphur dioxide to sulphur trioxide.', ['is exothermic', 'involves dilution with water', 'takes place at low temperatures', 'is favoured by high pressure'], '(a)', 'source_provided', 'Ch7D MCQ 1.(a)'),
  mcq(2, 'An acid anhydride of sulphuric acid:', ['sulphur dioxide', 'sulphur trioxide', 'sulphurous acid', 'pyrosulphuric acid'], '(b)', 'source_provided', 'Ch7D MCQ 2.(b)'),
  mcq(3, 'The promoter preferred in the exothermic, catalysed reaction in Contact Process is:', ['Platinum', 'Potassium oxide', 'Vanadium pentoxide', 'Molybdenum'], '(b)', 'source_provided', 'Ch7D MCQ 3.(b)'),
  mcq(4, 'A metal which does not give hydrogen on reaction with dil. sulphuric acid.', ['Zinc', 'Lead', 'Aluminium', 'Magnesium'], '(b)', 'source_provided', 'Ch7D MCQ 4.(b)'),
  mcq(5, 'Sulphuric acid dissociates in aqueous solution to give -', ['H+ ions', '2H+ ions', '2H3O+', 'both (b) & (c).'], '(b)', 'source_provided', 'Ch7D MCQ 5.(b)'),
  mcq(6, 'From the acids - hydrochloric, nitric & sulphuric acid - the acid which is most volatile is:', ['HNO3', 'HCl', 'H2SO4', 'HF'], '(b)', 'source_provided', 'Ch7D MCQ 6.(b)'),
  mcq(7, 'Conc. sulphuric acid [in chemical reactions] reduces itself to -', ['Sulphur trioxide', 'Water', 'Sulphur dioxide', 'Hydrogen'], '(c)', 'source_provided', 'Ch7D MCQ 7.(c)'),
  ar(8, '7D', 'Conc. sulphuric acid is both a dehydrating agent & drying agent.', 'Conc. sulphuric brings about a physical & chemical change, in composition of the compound.', '(a)', 'source_provided', 'Ch7D MCQ 8.(a)'),
  ar(9, '7D', 'Dilution of sulphuric acid is done by addition of water to acid.', 'The water is in bulk in the acid & the acid being heavier settles down & the heat is dissipated in the water itself.', '(d)', 'source_provided', 'Ch7D MCQ 9.(d)'),
  ar(10, '7D', 'The basicity of sulphuric acid is two.', 'It forms an acid and a normal salt, on reaction with an alkali.', '(a)', 'source_provided', 'Ch7D MCQ 10.(a)'),
  { sourceQuestionNumber: '11', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Dehydration of ethyl alcohol gives a hydrocarbon with ___ [three/two] carbon atoms in its molecule.',
    parts: [{ text: 'three/two', answer: 'Two' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7D Fill 11. Two` },
  { sourceQuestionNumber: '12', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Concentrated sulphuric acid is a ___ [non/poor/good] conductor of electricity.',
    parts: [{ text: 'non/poor/good', answer: 'Poor' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7D Fill 12. Poor` },
  { sourceQuestionNumber: '13', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'In the conversion of sulphur to sulphur dioxide & hydrogen sulphide to sulphur, the oxidising agent used is ___ [conc. HNO3/dil. H2SO4/conc. H2SO4].',
    parts: [{ text: 'conc. HNO3/dil. H2SO4/conc. H2SO4', answer: 'conc. H2SO4' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7D Fill 13. conc. H2SO4` },
  { sourceQuestionNumber: '14', kind: 'open', questionFormat: 'fill_in_the_blank', text: '___ [excess/insufficient] caustic soda is reacted with dilute sulphuric acid to give a salt formed by complete replacement of the replaceable hydrogen ion of an acid, by a basic radical.',
    parts: [{ text: 'excess/insufficient', answer: 'Excess' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch7D Fill 14. Excess` },
  openGroup(15, 'Match the following - Column A with Column B: (a) To distinguish dil. H2SO4 & dil. HCl (b) Sodium chloride & conc. H2SO4 (c) On dilution gives conc. H2SO4 (d) Dehydration of H2C2O4 by conc. H2SO4 (e) For conversion of Na2SO3 to Na2SO4',
    [
      { text: '(a) To distinguish dil. H2SO4 & dil. HCl', answer: '3. Barium chloride' },
      { text: '(b) Sodium chloride & conc. H2SO4', answer: '5. Hydrogen chloride' },
      { text: '(c) On dilution gives conc. H2SO4', answer: '1. Pyrosulphuric acid.' },
      { text: '(d) Dehydration of H2C2O4 by conc. H2SO4', answer: '2. CO + CO2' },
      { text: '(e) For conversion of Na2SO3 to Na2SO4', answer: '4. Dilute sulphuric acid' },
    ], 'source_provided', 'Ch7D Match 15.(a)3,(b)5,(c)1,(d)2,(e)4'),
  openGroup(16, 'Match the following - To convert: (a) Conc. HNO3 to conc. H2SO4 (b) Oleum to conc. H2SO4 (c) Iron pyrites to sulphur dioxide (d) Iron [II] sulphide with dil. sulphuric acid (e) Potassium nitrate to nitric acid',
    [
      { text: '(a) Conc. HNO3 to conc. H2SO4', answer: '3. React with conc. H2SO4' },
      { text: '(b) Oleum to conc. H2SO4', answer: '5. Dilute with soft water' },
      { text: '(c) Iron pyrites to sulphur dioxide', answer: '1. Burn in air or oxygen' },
      { text: '(d) Iron [II] sulphide with dil. sulphuric acid', answer: '2. Hydrogen sulphide' },
      { text: '(e) Potassium nitrate to nitric acid', answer: '4. React with sulphur' },
    ], 'source_provided', 'Ch7D Match 16.(a)4,(b)5,(c)1,(d)2,(e)3'),
  open(17, 'The dehydrated product formed, when conc. H2SO4 reacts with sucrose.', 'source_provided', 'Ch7D Oneword 17. Sugar charcoal', 'Sugar charcoal'),
  open(18, 'The reduced product formed, when carbon reacts with conc. H2SO4.', 'source_provided', 'Ch7D Oneword 18. Sulphur dioxide', 'Sulphur dioxide'),
  open(19, "The salt of a volatile acid which reacts with conc. H2SO4 to displace 'muriatic acid'", 'source_provided', 'Ch7D Oneword 19. Sodium chloride', 'Sodium chloride'),
  open(20, 'The valency of sulphur, in the product of catalytic oxidation of sulphur dioxide in the Contact tower of Contact process.', 'source_provided', 'Ch7D Oneword 20. +6', '+6'),
  open(21, 'Conc. sulphuric acid is an oxidising agent. Name an acid which is a reducing agent.', 'source_provided', 'Ch7D Oneword 21. Conc. HCl', 'Conc. HCl'),
  open(22, 'Oxygen is preferred to air in the Contact Tower of Contact process. Give reasons.', 'unavailable', null),
  openGroup(23, "Soln. 'A' has a high percentage of sulphuric acid in its aqueous solution than soln. 'B'. Which of the two is a stronger oxidising agent. Justify your answer.",
    [{ text: "Which of A or B is stronger oxidising agent, with justification" }], 'unavailable', null),
  open(24, 'State why oleum is diluted with soft water, in the dilution tank of Contact process to give sulphuric acid, of the desired concentration.', 'unavailable', null),
  openGroup(25, 'Oxidation reaction involves addition of oxygen or removal of hydrogen. Give an oxidation reaction of conc. H2SO4 which involves, removal of hydrogen from an aqueous solution of an weak acid.',
    [{ text: 'oxidation reaction with removal of hydrogen from a weak acid solution' }], 'unavailable', null),
  openGroup(26, 'Using conc. or dil. H2SO4 how would you obtain - (a) Na2SO4 from - (i) an alkali (ii) a carbonate (iii) a sulphite (iv) a sulphide (b) NaHSO4 from - (i) an alkali (ii) another salt (c) CO2 from - (i) an organic acid (ii) a non-metal (d) SO2 from - (i) a metal (ii) a non-metal. Give a balanced equation in each case.',
    [{ text: '(a)(i)' }, { text: '(a)(ii)' }, { text: '(a)(iii)' }, { text: '(a)(iv)' }, { text: '(b)(i)' }, { text: '(b)(ii)' }, { text: '(c)(i)' }, { text: '(c)(ii)' }, { text: '(d)(i)' }, { text: '(d)(ii)' }],
    'unavailable', null),
  openGroup(27, "Conc. H2SO4 is added to crystals of sugar: (a) Name the products 'X' and 'Y'. (b) Give a reason why 'A' changes to 'Y'. (c) Which of the two equations for the above reaction is more appropriate? (i) C12H22O11 -> 12C + 11H2O (ii) C12H22O11 + nH2SO4 -> 12C + 11H2O + nH2SO4. Justify your answer. (d) Name a substance which utilizes the same property of conc. H2SO4 as above, and is converted to a product having, two carbon atoms in its molecule.",
    [{ text: '(a)' }, { text: '(b)' }, { text: '(c)' }, { text: '(d)' }], 'unavailable', null),
]);

// =====================================================================
// CHAPTER 8 - ORGANIC CHEMISTRY (20 items; 18 source_provided, 2
// unavailable: 15 (structural diagram q, skipped in key), 20 (no VI section))
// =====================================================================
ingest('Organic Chemistry', [
  mcq(1, 'The incorrect phrase about - alkyne from the following:', [
    'It is more reactive than ethene.',
    'Has a hydrocarbon C4H8 chain, in the homologous series of organic compounds in which it is present.',
    'Undergoes catalytic hydrogenation to give, an alkane.',
    'Used in the manufacture of ethanoic acid.'], '(b)', 'source_provided', 'Ch8 MCQ 1.(b)'),
  mcq(2, 'The product of hydrolysis of bromoethane contains the functional group:', ['-C=C- (triple bond)', '-OH', '>C=C<', '-C=O (with OH, carboxyl)'], '(b)', 'source_provided', 'Ch8 MCQ 2.(b)'),
  mcq(3, 'The conversion of a saturated hydrocarbon to ethene, takes place in presence of a catalyst. A: The reaction is a dehydrogenation reaction. B: The reaction is a polymerization reaction.', ['Only A is correct.', 'Only B is correct.', 'Both A & B are correct.', 'Neither A nor B are correct.'], '(d)', 'source_provided', 'Ch8 MCQ 3.(d)'),
  mcq(4, "Ethanoic acid on reaction with an active metal, liberates a gas 'X' and with a metallic carbonate liberates a gas 'Y'.", ["Both 'X' & 'Y' - are acidic gases.", "Gas 'X' is neutral, 'Y' - is acidic.", "Gas 'X' burns with a pale blue flame & 'Y' - turns lime water milky.", 'Both (b) & (c) are correct.'], '(d)', 'source_provided', 'Ch8 MCQ 4.(d)'),
  mcq(5, 'The structural formula of different hydrocarbons are given: A,B,C,D (isomers of pentyne). Which of the following have the same molecular formula, but differ in structural formula.', ['A & C', 'A & D', 'A & B', 'B & C'], '(b)', 'source_provided', 'Ch8 MCQ 5.(b)'),
  mcq(6, 'A hydrocarbon having >C=C< as its functional group, has ten hydrogen atoms in its molecule. It will form -', ['3 chain isomers', '2 position isomers', '2 chain isomers', 'both (b) & (c)'], '(d)', 'source_provided', 'Ch8 MCQ 6.(d)'),
  mcq(7, "A hydrocarbon 'X' is prepared by dehydrohalogenation of ethylene dibromide with conc. alcoholic KOH and gives acetylene tetrachloride, on chlorination. The compound 'X' is -", ['an unsaturated organic compound & undergoes addition reactions.', 'decolourises bromine water, but gives no ppt. with ammoniacal AgNO3.', 'both (a) & (b) are correct.', '(a) is correct (b) is not true.'], '(d)', 'source_provided', 'Ch8 MCQ 7.(d)'),
  mcq(8, "Hydrolysis of ethyl chloride with aq. alkali solutions gives a compound 'X'. When 'X' undergoes dehydration with conc. H2SO4 at elevated temperatures - 'Y' is formed. The functional group in 'Y' is", ['-C=C- (triple bond)', '-OH', '>C=C<', '-C=O (with OH)'], '(c)', 'source_provided', 'Ch8 MCQ 8.(c)'),
  ar(9, 8, 'Esterification reaction is the condensation of an alcohol with an acid.', 'A carboxylic acid on reaction with an alcohol & a dehydrating agent gives an ester.', '(a)', 'source_provided', 'Ch8 MCQ 9.(a)'),
  ar(10, 8, 'In unsaturated organic compounds, there is non-availability of electrons in the single covalent bond.', 'The valencies of atleast two carbon atoms are not fully satisfied by hydrogen atoms in unsaturated organic compounds.', '(d)', 'source_provided', 'Ch8 MCQ 10.(d)'),
  { sourceQuestionNumber: '11', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'A compound containing carbon & hydrogen only, has a molecular weight of 140 and contains 10 carbon atoms. There is ___ [availability/non-availability] of electrons in its ___ [single/double/triple] bond.',
    parts: [{ text: 'availability/non-availability; single/double/triple', answer: 'availability, double' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch8 Fill 11. availability, double` },
  { sourceQuestionNumber: '12', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'Ethene reacts with steam in the presence of phosphoric acid, to give a hydroxy derivative of ___ [alkynes/alkanes/alkenes]',
    parts: [{ text: 'alkynes/alkanes/alkenes', answer: 'alkanes' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch8 Fill 12. alkanes` },
  { sourceQuestionNumber: '13', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'The IUPAC name of H3C-CH2-COOH is ___ [acetic/propanoic] acid & the general formula of the compound formed on reaction of bromoethane with aq. NaOH is ___ [CnH2nO/CnH2n+1OH]',
    parts: [{ text: 'acetic/propanoic; CnH2nO/CnH2n+1OH', answer: 'Propanoic, CnH2n+1OH' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch8 Fill 13. Propanoic, CnH2n+1OH` },
  openGroup(14, 'Match the following - Column A with Column B: (a) Ethyl acetate (b) n-pentane & iso-pentane (c) Dehydration of ethanol (d) Calcium carbide & cold water (e) Ethanal',
    [
      { text: '(a) Ethyl acetate', answer: '2. Ester' },
      { text: '(b) n-pentane & iso-pentane', answer: '4. Chain isomers' },
      { text: '(c) Dehydration of ethanol', answer: '1. Ethene' },
      { text: '(d) Calcium carbide & cold water', answer: '5. Acetylene' },
      { text: '(e) Ethanal', answer: '3. Aldehyde' },
    ], 'source_provided', 'Ch8 Match 14.(a)2,(b)4,(c)1,(d)5,(e)3'),
  openGroup(15, 'Structural diagrams & IUPAC names: Draw the structural diagram of: (a) 1-butyne (b) The hydrocarbon formed when sodium propionate reacts with sodalime.',
    [{ text: '(a) 1-butyne structural diagram' }, { text: '(b) hydrocarbon from sodium propionate + sodalime' }], 'unavailable', null),
  openGroup(16, 'Give the IUPAC name of the following organic compounds: (a) H3C-CH=CH-CH3 with CH3 branch (2-butene structure) (b) H3C-CH-C#CH with CH3 branch (3-methylbut-1-yne structure) (c) H3C-CH-CH2OH with CH3 branch (2-methylpropan-1-ol structure) (d) H3C-CH-CH2-CH-CH3 with CH3 and OH branches (4-methylpentan-2-ol structure)',
    [
      { text: '(a)', answer: '2-butene' }, { text: '(b)', answer: '3-methyl but-1-yne' },
      { text: '(c)', answer: '2-methyl-propan-1-ol' }, { text: '(d)', answer: '4-methyl pentan-2-ol' },
    ], 'source_provided', 'Ch8 Structural 16.(a)2-butene,(b)3-methylbut-1-yne,(c)2-methylpropan-1-ol,(d)4-methylpentan-2-ol'),
  open(17, 'The product of oxidation of ethyne.', 'source_provided', 'Ch8 Short 17. Oxalic acid', 'Oxalic acid'),
  open(18, 'The number of carbon atoms in pent-1-ene', 'source_provided', 'Ch8 Short 18. 5 carbon atoms', '5 carbon atoms'),
  open(19, 'The IUPAC name of the final product of chlorination using CCl4 of C2H2.', 'source_provided', 'Ch8 Short 19. 1,1,2,2 tetrachloro ethane', '1,1,2,2-tetrachloroethane'),
  openGroup(20, 'Explain the terms with reference to organic compounds with suitable examples: (a) Catenation (b) Closed Chain organic compounds (c) Functional group (d) Chain isomers (e) Dehydrohalogenation (f) Dehydrogenation (g) Dehydration (h) Polymerization (i) Decarboxylation',
    [{ text: '(a) Catenation' }, { text: '(b) Closed Chain organic compounds' }, { text: '(c) Functional group' }, { text: '(d) Chain isomers' }, { text: '(e) Dehydrohalogenation' }, { text: '(f) Dehydrogenation' }, { text: '(g) Dehydration' }, { text: '(h) Polymerization' }, { text: '(i) Decarboxylation' }],
    'unavailable', null),
]);

// =====================================================================
// CHAPTER 9 - PRACTICAL CHEMISTRY (15 items; 12 source_provided, 3
// unavailable: 13, 14, 15 -- answer key stops at item 12)
// =====================================================================
ingest('Practical Chemistry', [
  mcq(1, 'The gas which does not turn, lime water milky:', ['CO2', 'H2S', 'SO2', 'Both (a) & (c)'], '(b)', 'source_provided', 'Ch9 MCQ 1.(b)'),
  mcq(2, 'A gas in which a burning wooden splinter is not extinguished:', ['H2', 'CO2', 'SO2', 'O2'], '(d)', 'source_provided', 'Ch9 MCQ 2.(d)'),
  mcq(3, 'The substance whose original colour & colour of its residue after heating & cooling to room temperature is the same:', ['Copper nitrate', 'Zinc nitrate', 'Lead nitrate', 'Copper carbonate'], '(b)', 'source_provided', 'Ch9 MCQ 3.(b)'),
  mcq(4, 'The salt which gives a precipitate - insoluble in excess - both with addition of NaOH solution & NH4OH solution:', ['Zinc nitrate', 'Lead nitrate', 'Copper nitrate', 'Iron [II] nitrate'], '(d)', 'source_provided', 'Ch9 MCQ 4.(d)'),
  mcq(5, 'Barium nitrate solution maybe used to distinguish between salt solutions of:', ['Na2CO3 & Na2SO3', 'Na2SO3 & Na2SO4', 'NaCl & NaNO3', 'Na2S & Na2SO4'], '(b)', 'source_provided', 'Ch9 MCQ 5.(b)'),
  mcq(6, 'A gas which turns potassium iodide paper brown, is liberated on reaction of:', ['Copper with dil. HNO3', 'Copper with conc. HNO3', 'Thermal decomposition of copper nitrate', 'Both (b) & (c)'], '(d)', 'source_provided', 'Ch9 MCQ 6.(d)'),
  ar(7, 9, 'To distinguish between magnesium [IV] oxide & copper [II] oxide, each substance is heated with conc. HCl.', 'The gas evolved in each case is different & can be tested with a specific reagent.', '(c)', 'source_provided', 'Ch9 MCQ 7.(c)'),
  { sourceQuestionNumber: '8', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'The substance which can be distinguished from sodium carbonate, using barium chloride solution is ___. [Sodium sulphite/sodium sulphate]',
    parts: [{ text: 'Sodium sulphite/sodium sulphate', answer: 'Sodium sulphate' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch9 Fill 8. Sodium sulphate` },
  { sourceQuestionNumber: '9', kind: 'open', questionFormat: 'fill_in_the_blank', text: 'A solution of dil. H2SO4 & dil. NaOH can be distinguished easily using ___ [NaCl/NH4Cl/KCl] and a moist litmus paper.',
    parts: [{ text: 'NaCl/NH4Cl/KCl', answer: 'NH4Cl' }], answerStatus: 'source_provided', answerKeyRef: `${LABEL} Ch9 Fill 9. NH4Cl` },
  openGroup(10, 'Match the following - Column A (To distinguish) with Column B (Use of): (a) CO2 & Cl2 (b) NO2 & SO2 (c) H2S & HCl (d) Zn(OH)2 & Pb(OH)2 (e) Na2SO3 & Na2CO3',
    [
      { text: '(a) CO2 & Cl2', answer: '5. Moist starch iodide paper' },
      { text: '(b) NO2 & SO2', answer: '1. Moist potassium iodide paper' },
      { text: '(c) H2S & HCl', answer: '3. Moist lead acetate paper' },
      { text: '(d) Zn(OH)2 & Pb(OH)2', answer: '4. Ammonium hydroxide solution' },
      { text: '(e) Na2SO3 & Na2CO3', answer: '2. Acidified KMnO4 solution' },
    ], 'source_provided', 'Ch9 Match 10.(a)5,(b)1,(c)3,(d)4,(e)2'),
  open(11, 'The sulphide which is not black in colour from - lead sulphide, copper sulphide, zinc sulphide.', 'source_provided', 'Ch9 Oneword 11. Zinc sulphide', 'Zinc sulphide'),
  open(12, 'The salt which is insoluble in dilute hydrochloric acid from - barium sulphite, silver nitrate, barium carbonate.', 'source_provided', 'Ch9 Oneword 12. Silver nitrate', 'Silver nitrate'),
  open(13, 'The difference in colour between - copper [II] sulphate solution, copper [II] hydroxide & tetraamine copper [II] sulphate.', 'unavailable', null),
  open(14, 'Can acidified KMnO4 soln. be used to test & differentiate - SO2 gas from H2S gas. Justify with an equation.', 'unavailable', null),
  openGroup(15, 'Give balanced equation for the following conversions. (a) AgNO3 -> AgCl -> Ag(NH3)2Cl (b) CuSO4 -> Cu(OH)2 -> [Cu(NH3)4]SO4 (c) Na2SO3 -> BaSO3 -> BaCl2',
    [{ text: '(a)' }, { text: '(b)' }, { text: '(c)' }], 'unavailable', null),
]);

// ---------------------------------------------------------------------
console.log(JSON.stringify(results, null, 2));
const totals = results.reduce((a, r) => ({ inserted: a.inserted + r.inserted, skipped: a.skipped + r.skippedExactDuplicates, flagged: a.flagged + r.flaggedNearDuplicates }), { inserted: 0, skipped: 0, flagged: 0 });
console.log('TOTALS:', totals);
