// SECTION B / CHART 4 -- "Board Type Critical Thinking Questions"
// (d64d30c3-chart_4.pdf, 7pg): a whole-syllabus board-revision worksheet
// (Q.1-Q.13, various native shapes: real 4-option MCQs, fill-in-blank with
// bracketed choices, word-bank short answer, match-the-following, "give
// reasons", "identify the gas", diagram-based questions, structural
// formulas, etc.) -- genuinely NOT organized by chapter (its own cover page
// says "Board Type - Critical Thinking Questions", mixing topics within a
// single numbered question by design, e.g. Q.1's ten MCQs span periodic
// table, bonding, salts, mole concept, electrolysis, metallurgy, acids,
// ammonia and organic chemistry).
//
// ANSWER AVAILABILITY (confirmed, not a guess): chart_234_answer.pdf's
// "CHART 4" block is ENTIRELY page-pointers into the original textbook
// (e.g. "Question 1 (i)[pg.9,10,12], (ii)[pg.28,34]...") -- there is no
// literal MCQ option letter, fill-in-blank word, or answer given anywhere
// for any Chart 4 item, despite Chart 4's own cover page saying "Answers -
// Page 177". Every item is therefore answerStatus='unavailable' by
// construction of the source, confirmed by reading the full answer block.
//
// CHAPTER MAPPING: because the source itself doesn't organize by chapter,
// each item (down to the (i)/(ii)/... sub-item level for the genuinely
// mixed-topic questions Q.1, Q.2, Q.4b, Q.6-Q.11) was individually read and
// filed under the existing DB chapter matching ITS OWN content -- not
// dumped into one bucket. This is more granular than Chart 3's per-Q-group
// filing because Chart 4 mixes topics inside single Q-groups, not just
// across them. No new chapter was created.
//
// Native shape preserved: Q.1 -> kind='mcq' (real 4-option MCQs). Q.2's
// bracketed-choice fill-blanks are also genuinely closed-choice -> kept as
// kind='mcq' with the bracket options, but with correct=null (unavailable).
// Everything else (word-bank short answer, match, give-reasons, diagrams,
// structural formulas) -> kind='open', since the source never presents a
// fixed option set for those.

const { ingestQuestions } = require('./ingest');

const LABEL = 'chart_4.pdf (Board Type Critical Thinking Questions) [chart_234_answer.pdf gives page-pointers only, no literal answers]';
const SECTION = 'Chart 4';

const bucket = {}; // chapterName -> items[]
function add(chapterName, item) {
  (bucket[chapterName] = bucket[chapterName] || []).push({
    answerStatus: 'unavailable',
    answerKeyRef: 'chart_234_answer.pdf Chart 4 gives only a page pointer per item, no literal answer',
    sourceSection: SECTION,
    ...item,
  });
}
function mcq(chapterName, n, text, options) {
  add(chapterName, { sourceQuestionNumber: n, kind: 'mcq', text, options, correct: null });
}
function open(chapterName, n, text, format) {
  add(chapterName, { sourceQuestionNumber: n, kind: 'open', questionFormat: format || 'short_answer', text, parts: [{ text }] });
}
function openGroup(chapterName, n, text, parts, format) {
  add(chapterName, { sourceQuestionNumber: n, kind: 'open', questionFormat: format || 'short_answer', text, parts });
}

// Q.1 -- MCQs (real 4-option choices), filed per item by its own topic.
mcq('Periodic Table', '1(i)', "An element 'X' in period-2 of the periodic table is to the left of element 'Y' in the same period. 'Y' will have -",
  ['Larger atomic size than X', 'Lower ionisation potential than X', 'Lower electronegativity than X', 'None of the options']);
mcq('Chemical Bonding', '1(ii)', 'The covalent compound soluble in water having shared pair of electrons unequally distributed between the two atoms and which cannot be electrolysed in normal state is -',
  ['Methane', 'Carbon tetrachloride', 'Ammonia', 'Ethane']);
mcq('Acids, Bases and Salts', '1(iii)', 'A water soluble salt prepared by decomposition of an insoluble carbonate by a dilute acid is -',
  ['Copper carbonate', 'Copper chloride', 'Ammonium sulphate', 'Zinc carbonate']);
mcq('Mole Concept & Stoichiometry', '1(iv)', "The number of atoms in 40 g. of a gas 'X' of period-2, group 0 of the periodic table are - [At. wt. of X = 20]",
  ['6.023x10^23 atoms', '2x6.023x10^23 atoms', '4x6.023x10^23 atoms', '3.012x10^23 atoms']);
mcq('Electrolysis', '1(v)', 'During electroplating of an article with silver, the electrolyte used dissociates to give -',
  ['Na+, Ag+, CN- ions', 'Na+, H+, CN- ions', 'Na+, Ag+, CN-, H+, OH- ions', 'Na+, Ag+, CN-, H+, OH- ions (alt.)']);
mcq('Metallurgy', '1(vi)', 'The metal which does not liberate hydrogen with conc. HCl - but liberates sulphur dioxide with conc. sulphuric acid is -',
  ['Silver', 'Copper', 'Zinc', 'Aluminium']);
mcq('Acids, Bases and Salts', '1(vii)', 'The substance which reacts with dilute hydrochloric acid to liberate a gas which turns acidified KMnO4 from pink to clear colourless is -',
  ['Copper sulphide', 'Sodium carbonate', 'Sodium sulphite', 'Iron [II] sulphide']);
open('Study of Compounds', '1(viii)-mcq', 'The effect a neutral litmus has when dipped in an aqueous solution of ammonia is - [a] Blue turns red [b] Blue remains blue [c] Purple turns blue [d] No effect on neutral litmus', 'mcq_text');
mcq('Acids, Bases and Salts', '1(ix)', 'To distinguish dilute sulphuric acid from dilute hydrochloric acid, the substance used is -',
  ['Zinc nitrate', 'Lead sulphate', 'Lead nitrate', 'Barium sulphate']);
mcq('Organic Chemistry', '1(x)', 'Ethanol vapours react with alumina at 350C to give a compound having a general formula -',
  ['CnH2n+2', 'CnH2nO2', 'CnH2n', 'CnH2nO']);

// Q.2 -- fill in the blanks from bracketed choices (kept as mcq: genuinely
// closed-choice, but no answer letter given anywhere in the source).
mcq('Periodic Table', '2(i)', 'The ___ [lesser/greater] the value of electron affinity the more oxidising is the nature of the element.', ['lesser', 'greater']);
mcq('Chemical Bonding', '2(ii)', 'A polar covalent compound is ___ [soluble/insoluble] in a non-polar solvent.', ['soluble', 'insoluble']);
mcq('Acids, Bases and Salts', '2(iii)', 'The ___ [acidity/basicity] of a diacidic base is two.', ['acidity', 'basicity']);
mcq('Study of Compounds', '2(iv)', 'An example of a neutral oxide is ___.', ['P2O5', 'NO', 'NO2']);
mcq('Organic Chemistry', '2(v)', 'An example of a paraffin is ___.', ['C4H8', 'C4H6', 'C3H8']);
mcq('Study of Compounds', '2(vi)', 'The dissociation of nitric acid in aqueous soln. results in formation of ___.', ['H3O+ & NO3- ions', 'H+ & NO3- ions', 'H3O+ ions only']);
mcq('Organic Chemistry', '2(vii)', 'An example of a position isomer of but-2-ene is ___.', ['H3C-CH2-CH2-CH=CH2', 'H3C-CH2-CH=CH2', 'H3C-C(CH3)=CH2']);
mcq('Study of Compounds', '2(viii)', 'Dil. HNO3 reacts with acidified ferrous sulphate soln. to give as the oxidised product ___.', ['nitroso iron [II] sulphate', 'iron [III] sulphate', 'nitric oxide']);
mcq('Chemical Bonding', '2(ix)', 'A covalent compound which behaves like an ionic compound in aqueous solution is ___ gas.', ['methane', 'hydrogen chloride', 'nitrogen']);
mcq('Metallurgy', '2(x)', 'The chemical name of the main ore of iron is ___.', ['tri iron tetroxide', 'iron [III] oxide', 'iron disulphide']);

// Q.3 -- very short answer, select from a shared word bank (all electrolysis).
const Q3_BANK = 'SO4 2-, H+, K+, Cl-, Cu2+, OH-, Na+, Ag+, Zn2+';
openGroup('Electrolysis', '3', `Very short answer - select the correct answer from the choices given: [${Q3_BANK}]`, [
  { text: '(i) The cation - discharged at the electrode, with most difficulty.' },
  { text: '(ii) The anion - discharged at the electrode, most easily.' },
  { text: '(iii) The ion - discharged at the cathode during electrolysis of acidified water.' },
  { text: '(iv) The ion - discharged at the anode during electrolysis of aq. copper [II] sulphate using copper electrodes.' },
  { text: '(v) The ion - which has maximum tendency to get reduced at the cathode during electrolysis.' },
], 'select_from_word_bank');

// Q.4[a] organic reaction terms; Q.4[b] general terms (split by topic).
openGroup('Organic Chemistry', '4a', 'One word/phrase/suitable chemical term for the following organic reactions:', [
  { text: '(i) A reaction which involves elimination of hydrogen halide.' },
  { text: '(ii) A reaction which involves formation of a saturated addition product formed, due to addition of hydrogen at the double bond.' },
  { text: '(iii) A reaction which involves condensation of an alkali with an acid.' },
  { text: '(iv) A reaction which involves elimination of elements of water from an alcohol, in the presence of alumina at elevated temperatures.' },
  { text: '(v) A reaction which involves ethyl hydrogen sulphate reacting with steam to give ethanol.' },
  { text: '(vi) A reaction which involves elimination of a molecule of carbon dioxide from a carboxylic acid.' },
]);
open('Acids, Bases and Salts', '4b-i', 'The type of salt which on formation, contains a replaceable hydrogen atom in its molecule.');
open('Periodic Table', '4b-ii', 'The positive charge on the nucleus of an atom, equivalent to the atomic number of the element.');
open('Chemical Bonding', '4b-iii', 'Electrically charged particles which exist independently in solution and have complete duplet or octet in their outermost shell.');
open('Electrolysis', '4b-iv', 'A reaction which involves both oxidation & reduction; electrolysis being an example of such a reaction.');
open('Metallurgy', '4b-v', 'An alloy in which the base metal is mercury.');
open('Study of Compounds', '4b-vi', 'A mixture which boils without change in composition, e.g. an aqueous solution of sulphuric acid.');

// Q.5 match the following.
openGroup('Organic Chemistry', '5a', 'Match the following - Column A with Column B: A) n-propyl alcohol B) methyl orange - turns yellow C) neo-pentane D) methyl orange - turns pink E) acetone -- with 1) 2,2-dimethylpropane 2) Acidic solution 3) Propanone 4) 1-propanol 5) Basic solution',
  ['A', 'B', 'C', 'D', 'E'].map((l) => ({ text: `Match ${l}` })));
openGroup('Chemical Bonding', '5b', 'Match the following - Column A with Column B: A) Hydronium ion B) Sodium sulphate C) Calcium sulphate D) Ammonia molecule E) Oxygen molecule -- with 1) Double covalent bond 2) Polar covalent compound 3) Coordinate bond 4) Insoluble salt 5) Normal salt',
  ['A', 'B', 'C', 'D', 'E'].map((l) => ({ text: `Match ${l}` })));

// Q.6 chemical tests to distinguish pairs.
openGroup('Acids, Bases and Salts', '6-i-iv', 'Short answers - give a chemical test to distinguish between the following pairs of compounds, using the test given within the bracket:', [
  { text: '(i) Ammonium chloride & sodium chloride [using an alkali]' },
  { text: '(ii) Calcium nitrate & potassium nitrate [using a flame test]' },
  { text: '(iii) Sodium sulphite & sodium sulphate [using barium nitrate & a dilute acid]' },
  { text: '(iv) Potassium carbonate & ammonium nitrate [using a dilute acid]' },
], 'chemical_test');
openGroup('Organic Chemistry', '6-v-vi', 'Short answers - give a chemical test to distinguish between the following pairs of compounds, using the test given within the bracket:', [
  { text: '(v) Propane & propene [using alkaline dilute KMnO4]' },
  { text: '(vi) Ethylene & acetylene [using silver acetylide]' },
], 'chemical_test');

// Q.7 balanced equations.
openGroup('Study of Compounds', '7-inorganic', 'Short answers - write balanced equations for the following reactions:', [
  { text: '(i) Action of caustic potash on lead hydroxide.' },
  { text: '(ii) Formation of nitrogen trichloride from ammonia.' },
  { text: '(iv) Formation of diamine silver chloride from a silver salt.' },
  { text: '(v) Formation of aluminium hydroxide from the product of burning aluminium with nitrogen.' },
  { text: '(vi) Conversion of nitric acid to sulphuric acid, using a non-metal.' },
  { text: '(vii) Formation of sulphur dioxide from sulphur using a concentrated acid.' },
], 'equation');
openGroup('Organic Chemistry', '7-organic', 'Short answers - write balanced equations for the following reactions:', [
  { text: '(iii) Preparation of ethene from the product of reaction of ethyl hydrogen sulphate with steam.' },
  { text: '(viii) Formation of a saturated aliphatic hydrocarbon from the product obtained on reacting ethene with hydrogen bromide.' },
  { text: '(ix) Catalytic hydrogenation of C2H2.' },
  { text: '(x) Formation of an ester, from the product of complete oxidation of ethanol with acidified K2Cr2O7.' },
], 'equation');

// Q.8 state the conditions.
openGroup('Study of Compounds', '8-inorganic', 'Short answers - state the conditions for the following reactions:', [
  { text: '(i) Formation of sodium sulphate from sodium chloride using a concentrated acid.' },
  { text: '(iv) Formation of nascent chlorine from concentrated hydrochloric acid.' },
  { text: '(v) Preparation of nitrogen from ammonium nitrite.' },
  { text: '(vi) Conversion of nitrogen dioxide to nitric acid in Ostwald\'s process.' },
]);
openGroup('Metallurgy', '8-metallurgy', 'Short answers - state the conditions for the following reactions:', [
  { text: '(ii) Formation of a salt containing two metallic radicals from impure bauxite.' },
  { text: '(iii) Formation of aluminium hydroxide by hydrolysis of sodium aluminate.' },
]);
openGroup('Organic Chemistry', '8-organic', 'Short answers - state the conditions for the following reactions:', [
  { text: '(vii) Preparation of ethane from ethyl bromide.' },
  { text: '(viii) Conversion of ethane to ethanol.' },
  { text: '(ix) Formation of ethyne by a dehydrohalogenation reaction.' },
  { text: '(x) Conversion of ethanol to ethanoic acid.' },
]);

// Q.9 identify the gas evolved.
openGroup('Metallurgy', '9-metallurgy', 'Short answers - identify the gas evolved for each of the following:', [
  { text: '(i) Reduction of iron [III] oxide using carbon monoxide.' },
  { text: '(ii) Thermal decomposition of silver [I] oxide during reduction of the metallic oxide.' },
  { text: '(iv) Calcination of iron [II] carbonate during conversion of concentrated ore to its oxide.' },
]);
openGroup('Study of Compounds', '9-inorganic', 'Short answers - identify the gas evolved for each of the following:', [
  { text: '(iii) Addition of dilute nitric acid to acidified iron [II] sulphate solution.' },
  { text: '(v) Reaction of excess ammonia with chlorine.' },
  { text: '(x) Reaction of dilute nitric acid with copper.' },
]);
openGroup('Organic Chemistry', '9-organic', 'Short answers - identify the gas evolved for each of the following:', [
  { text: '(vi) During dehydration of ethanol with concentrated sulphuric acid at elevated temperatures.' },
  { text: '(vii) Reaction of sodium, with the product formed on boiling bromoethane with aqueous alkali solutions.' },
  { text: '(viii) Reaction of methyl iodide with Zn/Cu couple in alcohol.' },
  { text: '(ix) Burning of ethanol in air.' },
]);

// Q.10 state one observation.
open('Acids, Bases and Salts', '10-i', 'A neutral litmus is dipped in a solution formed on hydrolysis of potassium bicarbonate.', 'observation');
openGroup('Study of Compounds', '10-inorganic', 'Short answers - state one observation for each of the following:', [
  { text: '(ii) Ammonium sulphate is heated with caustic soda and the gas evolved burnt in an atmosphere of oxygen.' },
  { text: '(iii) Hydrogen sulphide is reacted with conc. sulphuric acid and the gas evolved bubbled through acidified potassium dichromate solution.' },
  { text: '(v) Sulphur is heated with hot concentrated nitric acid and the gas evolved is bubbled through potassium iodide solution.' },
  { text: '(vii) Nitric oxide combines with oxygen at low temperatures.' },
  { text: '(viii) Rock salt is heated with concentrated sulphuric acid and the gas evolved bubbled through silver nitrate solution acidified with dilute nitric acid.' },
], 'observation');
openGroup('Organic Chemistry', '10-organic', 'Short answers - state one observation for each of the following:', [
  { text: '(iv) Ethanol and concentrated sulphuric acid in excess is heated at high temperatures and the gas evolved bubbled through a solution of bromine in an inert solvent.' },
  { text: '(vi) Vapours of ethene mixed with hydrogen are passed over palladium at high temperatures and the product formed passed through cold dilute alkaline KMnO4 solution.' },
  { text: '(ix) A blue litmus is dipped in the final product formed on oxidation of ethanol with acidified K2Cr2O7 solution.' },
  { text: '(x) The gaseous product formed on dehydrohalogenation of bromoethane is passed through cold dil. KMnO4 solution at room temperature.' },
], 'observation');

// Q.11 give reasons.
openGroup('Periodic Table', '11-periodic', 'Give reasons for the following:', [
  { text: '(i) Electron affinity increases across a period in a periodic table.' },
  { text: '(ii) Atomic size of the element in period-3, group-17 is more than the atomic size of the element in period-2, group-17.' },
]);
open('Chemical Bonding', '11-iii', 'Hydronium ion [H3O+] has one lone pair of electrons.');
openGroup('Acids, Bases and Salts', '11-abs', 'Give reasons for the following:', [
  { text: '(iv) Preparation of lead chloride from lead carbonate involves the use of dilute nitric acid and not dilute sulphuric acid.' },
  { text: '(v) Addition of zinc nitrate to dil. H2SO4 does not serve as a test for dil. H2SO4 but addition of lead nitrate to the same does.' },
  { text: '(ix) Normal salts do not contain a replaceable hydrogen atom in their molecule.' },
]);
openGroup('Study of Compounds', '11-soc', 'Give reasons for the following:', [
  { text: "(vi) Heat on ammonium chloride is termed as 'thermal dissociation' but heat on ammonium nitrite is termed as 'thermal decomposition'." },
  { text: '(vii) Zinc reacts with dilute sulphuric acid to yield hydrogen gas.' },
]);
open('Electrolysis', '11-viii', 'Electrolysis of water is not carried out on water acidified with dilute nitric acid.');
open('Organic Chemistry', '11-x', 'Alumina is used in the laboratory preparation of ethene from ethanol.');

// Q.12 diagram-based.
openGroup('Organic Chemistry', '12a', "Study the figure given (sodium ethanoate + soda lime heated -> gaseous hydrocarbon collected over water) and answer the questions that follow:", [
  { text: "(i) Give a reason why the reaction for the preparation of the gaseous hydrocarbon is termed as 'decarboxylation'." },
  { text: '(ii) State the vapour density of the gaseous hydrocarbon formed.' },
  { text: '(iii) State why soda lime is preferred to caustic soda in the given preparation.' },
  { text: '(iv) Is the gaseous hydrocarbon prepared, soluble or insoluble in an organic solvent e.g. acetone.' },
  { text: "(v) Give a reason why the thermal decomposition in absence of air - of the gaseous product formed in the above preparation, is considered a 'dehydrogenation reaction'." },
], 'diagram');
openGroup('Study of Compounds', '12b', 'Study the figure given (Sal Ammoniac + Alkali [Ca(OH)2] heated, gas formed passed through a drying agent [CaO]) and answer the questions that follow:', [
  { text: '(i) Give a reason why the gas obtained in the above laboratory preparation, is passed through a tower containing calcium oxide and not phosphorus pentoxide.' },
  { text: '(ii) State why the round bottom flask in the above preparation, is kept in an inclined position.' },
  { text: '(iii) State why the gaseous product obtained in the above preparation, reacts with acids to form ammonium salts.' },
  { text: '(iv) State what you would observe if a neutral litmus paper is held near the mouth of the jar used for collecting the gas, after the completion of the reaction.' },
  { text: '(v) If the gaseous product obtained in the above preparation, passed over heated copper oxide - is the gas obtained, acidic or neutral in nature.' },
], 'diagram');

// Q.13 recurring board topics.
openGroup('Metallurgy', '13a', 'Alloys - state the use of: (i) Zinc in the alloy bronze (ii) Tin in the alloy solder (iii) Carbon in the alloy stainless steel (iv) Magnesium in the alloy duralumin (v) Antimony in the alloy, type metal. Name the metal generally present in: (i) Bronze but not in brass (ii) Duralumin but not in magnalium (iii) Typemetal but not in solder (iv) German silver but not in brass (v) Stainless steel and in german silver',
  ['use(i)', 'use(ii)', 'use(iii)', 'use(iv)', 'use(v)', 'metal(i)', 'metal(ii)', 'metal(iii)', 'metal(iv)', 'metal(v)'].map((t) => ({ text: t })));
openGroup('Organic Chemistry', '13b', 'Give the structural formula of the following: (i) The two chain isomers of pentane (ii) The position isomer of 1-butene (iii) Pent-2-yne (iv) 4-methyl pentan-2-ol (v) Propanone (vi) Diethyl ether (vii) Trichloroethane (viii) Dimethyl acetylene (ix) 3-methyl but-1-ene (x) 2,3-Dimethyl butane',
  ['(i)', '(ii)', '(iii)', '(iv)', '(v)', '(vi)', '(vii)', '(viii)', '(ix)', '(x)'].map((t) => ({ text: t })));
openGroup('Periodic Table', '13c', "Periodic table - answer using correct symbols (table: Period1 group1=A group18=B; Period2 group1=C group14=E group16=F group17=G group18=L; Period3 group1=D group13=H group15=I group17=J group18=K): (i) element with least ionisation potential (ii) element with highest electronegativity from F,J,G,L (iii) element from group-1 with largest atomic size (iv) electronic configuration of I (v) element with least electron-affinity from C,D,G,L,K (vi) element from J and K with higher atomic size, with reason (vii) most reactive element from A,C,D,H (viii) element with highest nuclear charge from period-2 (ix) valency of element F",
  ['(i)', '(ii)', '(iii)', '(iv)', '(v)', '(vi)', '(vii)', '(viii)', '(ix)'].map((t) => ({ text: t })));
openGroup('Acids, Bases and Salts', '13d', 'Salts - choosing only from: Lead, dil. H2SO4, dil. HCl, Sulphur, Zinc, Lead nitrate, dil. HNO3, Sodium carbonate, Lead hydroxide, Lead chloride, Zinc chloride, Copper carbonate -- give a balanced equation for the preparation of: (i) Lead carbonate (ii) Lead sulphide (iii) Lead nitrate (iv) Copper sulphate (v) Zinc nitrate (vi) Zinc carbonate (vii) Zinc sulphate (viii) Zinc chloride (ix) Zinc sulphide',
  ['(i)', '(ii)', '(iii)', '(iv)', '(v)', '(vi)', '(vii)', '(viii)', '(ix)'].map((t) => ({ text: t })), 'equation');
openGroup('Chemical Bonding', '13e', 'Particles in a substance - name the kind of particles present in the following solutions: (i) Glucose (ii) Zinc chloride (iii) Potassium bicarbonate (iv) Copper sulphate (v) Ethanoic acid (vi) Ethane (vii) Caustic soda (viii) Citric acid (ix) Lithium hydroxide',
  ['(i)', '(ii)', '(iii)', '(iv)', '(v)', '(vi)', '(vii)', '(viii)', '(ix)'].map((t) => ({ text: t })));
openGroup('Practical Chemistry', '13f', "Practical chemistry - identify the gases A to D: (i) 'A' on passage through lime water turns it milky and acidified K2Cr2O7 solution from orange to clear green. (ii) 'B' liberates violet vapours from potassium iodide solution. (iii) 'C' if bubbled through acidified K2Cr2O7 solution produces a green soln. with yellow particles. (iv) 'D' if bubbled through an alkaline soln. of potassium mercuric iodide gives a reddish brown precipitate. Identify the cation X and anion Y: (v) XSO4 if bubbled through an aqueous solution of ammonia gives a reddish brown precipitate, insoluble in excess. (vi) XCl on heating with NaOH solution evolves a gas which turns a solution of methyl orange yellow. (vii) KY reacts with concentrated sulphuric acid and copper on heating to give a gas which turns KI paper brown. (viii) Na2Y on heating with dil. H2SO4 evolves a gas which turns lead acetate paper silvery black.",
  ['(i)', '(ii)', '(iii)', '(iv)', '(v)', '(vi)', '(vii)', '(viii)'].map((t) => ({ text: t })));

const results = Object.entries(bucket).map(([chapterName, items]) => {
  const r = ingestQuestions(items, { board: 'ICSE', subjectName: 'Chemistry', chapterName, label: LABEL, status: 'transcribed', sourceSection: SECTION });
  return { chapterName, ...r };
});
console.log(JSON.stringify(results.map((r) => ({ chapterName: r.chapterName, inserted: r.inserted, skipped: r.skippedExactDuplicates, flagged: r.flaggedNearDuplicates })), null, 2));
const totals = results.reduce((a, r) => ({ inserted: a.inserted + r.inserted, skipped: a.skipped + r.skippedExactDuplicates, flagged: a.flagged + r.flaggedNearDuplicates }), { inserted: 0, skipped: 0, flagged: 0 });
console.log('TOTALS:', totals);
