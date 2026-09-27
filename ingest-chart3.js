// SECTION B / CHART 3 -- "Additional Critical Thinking Questions"
// (729003a2-chart_3_critical.pdf, 7pg) + its answers from
// e9f12d6f-chart_234_answer.pdf (the "CHART 3" block on its pages 1-2).
//
// Structure: ONE continuous numbering (1-192) across 8 sub-sections
// (Q.1 "Name or give an example of the product formed" 1-71, Q.2 "Give an
// example of" 72-85, Q.3 "Name - coloured compounds" 86-96, Q.4 "Name a gas
// which" 97-107, Q.5 "Name a metal which" 108-127, Q.6 "How are the
// following conversions...metallurgy" 128-140, Q.7(a) one-step conversions
// 141-157, Q.7(b) two-step conversions 158-174, Q.8 organic conversions
// 175-192).
//
// Answer availability: items 1-174 have an explicit, literal answer printed
// in chart_234_answer.pdf (short name/formula for 1-127, a full balanced
// equation "hint" for 128-174) -> answerStatus='source_provided'. Item set
// 175-192 (Q.8, organic conversions) is answered ONLY with a page-pointer
// ("Equations 175 to 192 - pages 249 to 252" of the original textbook, no
// literal equation given in this answer document) -> answerStatus =
// 'unavailable' (a confirmed, specific gap, not a guess).
//
// All items are short-answer / equation-completion in native shape (no
// options ever printed) -> kind='open'.

const { ingestQuestions } = require('./ingest');

const LABEL = 'chart_3_critical.pdf (Additional Critical Thinking Questions) + chart_234_answer.pdf (Chart 3 block)';
const SECTION = 'Chart 3';

// [number, question text, answer-or-null]
const Q1 = [
  [1, 'A gas obtained as a common product both when concentrated sulphuric acid reacts with carbon and with sulphur.', 'Sulphur dioxide'],
  [2, 'An amphoteric oxide obtained on roasting zinc blende at elevated temperatures.', 'Zinc oxide'],
  [3, 'A black metallic oxide obtained when a green metallic carbonate is heated.', "Copper [II] oxide"],
  [4, 'A gas liberated when concentrated sulphuric acid reacts with oxalic acid, which is not liberated when concentrated sulphuric acid reacts with formic acid.', 'Carbon dioxide'],
  [5, 'An acidic gas obtained when a metal below hydrogen in the activity series reacts with concentrated sulphuric acid.', 'Sulphur dioxide'],
  [6, 'The oxide obtained when iron is exposed to the moist atmosphere.', 'Hydrated iron [III] oxide'],
  [7, 'The product obtained at the cathode on electrolysis of sodium silver cyanide solution.', 'Silver'],
  [8, 'A neutral gas other than oxygen and water vapour obtained on heating a particular nitrate.', 'Nitrous oxide'],
  [9, 'A decrepitating salt obtained on reacting nitric acid with an amphoteric oxide.', 'Lead nitrate'],
  [10, 'The vapour of a neutral liquid formed on heating ammonium nitrate.', 'Water vapour'],
  [11, 'A soluble chloride formed when hydrochloric acid reacts with an amphoteric hydroxide of a divalent metal.', 'Zinc chloride'],
  [12, 'A soluble salt formed when concentrated nitric acid reacts with acidified iron [II] sulphate solution.', 'Iron [III] sulphate'],
  [13, 'A chloride of a tetravalent metal obtained when aqua regia reacts with it.', 'Platinum (IV) chloride'],
  [14, 'A coloured basic oxide obtained as a residue on heating the corresponding nitrate.', 'Copper (II) oxide'],
  [15, 'An acidic gas obtained when zinc reacts with concentrated nitric acid.', 'Nitrogen dioxide'],
  [16, 'The non-gaseous product obtained when sulphur dioxide is bubbled through a solution of concentrated nitric acid.', 'Sulphuric acid'],
  [17, 'The oxide obtained when heated iron reacts with oxygen gas.', 'Triferric tetraoxide'],
  [18, 'The acid obtained on hydrolysis of ammonium chloride.', 'Hydrochloric acid'],
  [19, 'A soluble chloride obtained when silver chloride dissolves in excess of ammonium hydroxide.', 'Diamine silver chloride'],
  [20, 'A neutral gas obtained on passing ammonia gas over a heated yellow metallic amphoteric oxide.', 'Nitrogen'],
  [21, 'A non-metallic residue obtained on bubbling hydrogen sulphide gas through concentrated sulphuric acid.', 'Sulphur'],
  [22, 'A fertilizer obtained when ammonia reacts with a dibasic acid.', 'Ammonium sulphate'],
  [23, 'A neutral gas obtained when chlorine reacts with ammonia in excess.', 'Nitrogen'],
  [24, 'The normal salt formed when sodium chloride reacts with sodium bisulphate at elevated temperatures.', 'Sodium sulphate'],
  [25, 'A compound obtained when the neutral gas formed on reacting nitric acid with acidified iron [II] sulphate solution is further absorbed in iron [II] sulphate solution.', 'Nitroso ferrous sulphate'],
  [26, 'A white metallic amphoteric hydroxide soluble in excess of ammonium hydroxide obtained when the sulphate of the metal reacts with ammonium hydroxide.', 'Zinc hydroxide'],
  [27, 'The residual non-metal obtained on dehydration of cellulose with concentrated sulphuric acid.', 'Carbon'],
  [28, 'A white basic oxide obtained on heating a nitrate of the corresponding metal.', 'Calcium oxide'],
  [29, 'The metal obtained when aluminium is heated with iron [III] oxide.', 'Iron'],
  [30, 'A neutral gas obtained on decomposition of sulphur trioxide.', 'Oxygen'],
  [31, 'The acid obtained when concentrated nitric acid reacts with sulphur.', 'Sulphuric acid'],
  [32, 'A compound formed when ammonia reacts with a solid acidic oxide [acidic oxide also behaves as a drying agent].', 'Ammonium phosphate'],
  [33, 'A nitrate obtained when nitric acid reacts with iron [III] hydroxide.', 'Iron [III] nitrate'],
  [34, 'The black residue obtained when a foul smelling acidic gas is bubbled through lead acetate solution.', 'Lead sulphide'],
  [35, 'The mixed oxide formed as a product when steam is passed over red hot iron.', 'Triferric tetroxide'],
  [36, 'The product obtained at the anode on electrolysis of fused alumina during electrolytic reduction of it.', 'Oxygen'],
  [37, 'The salt obtained when zinc reacts with caustic soda solution.', 'Sodium zincate'],
  [38, 'The product obtained at the anode on electrolysis of acidified water.', 'Oxygen'],
  [39, 'The gas liberated when concentrated sulphuric acid reacts with ethyl alcohol.', 'Ethylene'],
  [40, 'A soluble chloride obtained when iron reacts with dilute hydrochloric acid.', 'Iron [II] chloride'],
  [41, 'A gas obtained by reacting warm water with a nitride of a trivalent metal.', 'Ammonia'],
  [42, 'An acid salt obtained on reacting sodium nitrate with a concentrated acid in the laboratory preparation of nitric acid.', 'Sodium bisulphate'],
  [43, 'A metallic nitrite obtained on heating the corresponding deliquescent nitrate.', 'Sodium nitrite'],
  [44, 'The normal salt obtained when dilute sulphuric acid reacts with caustic soda solution.', 'Sodium sulphate'],
  [45, 'A gas obtained on adding dilute sulphuric acid to iron (II) sulphide.', 'Hydrogen sulphide'],
  [46, 'An acidic gas obtained when concentrated nitric acid reacts with sulphur powder.', 'Nitrogen dioxide'],
  [47, 'The neutral gas obtained when ammonia burns in oxygen.', 'Nitrogen'],
  [48, 'An acid other than nitric acid obtained when nitrogen dioxide dissolves in water.', 'Nitrous acid'],
  [49, 'A soluble normal salt obtained when ammonium sulphate reacts with a soluble base.', 'Sodium sulphate'],
  [50, 'A neutral gas obtained when manganese reacts with very dilute nitric acid.', 'Hydrogen'],
  [51, 'An acidic salt formed as a common product both when concentrated sulphuric acid reacts with sodium chloride and with sodium nitrate.', 'Sodium bisulphate'],
  [52, 'A neutral gas obtained on thermal decomposition of a metallic carbonate.', 'Oxygen (carbon dioxide - see note)'],
  [53, 'A basic oxide obtained on thermal decomposition of the flux used in the metallurgy of iron from haematite.', 'Calcium oxide'],
  [54, 'The gas liberated when a strong caustic alkali solution reacts with aluminium.', 'Hydrogen'],
  [55, 'The product obtained at the anode on electrolysis of aqueous copper sulphate solution using platinum electrodes.', 'Oxygen'],
  [56, 'The salt obtained when hot caustic soda solution reacts with bauxite.', 'Sodium aluminate'],
  [57, 'A gas liberated when iron reacts with dilute sulphuric acid.', 'Hydrogen'],
  [58, 'A colourless gas obtained on decomposition of nitric acid.', 'Oxygen'],
  [59, 'The oxidised product of catalytic oxidation of ammonia.', 'Nitric oxide'],
  [60, 'The product obtained at the anode on electrolysis of molten sodium chloride.', 'Chlorine'],
  [61, 'The gas obtained on roasting zinc blende at elevated temperatures.', 'Sulphur dioxide'],
  [62, 'A dibasic acid obtained by reaction of sulphur dioxide with a neutral liquid.', 'Sulphurous acid'],
  [63, 'An explosive liquid obtained on reacting excess chlorine with ammonia.', 'Nitrogen trichloride'],
  [64, 'An insoluble chloride obtained when a metallic nitrate of a monovalent metal reacts with hydrochloric acid.', 'Silver chloride'],
  [65, 'A covalent compound obtained when ammonia is dissolved in a neutral liquid.', 'Ammonium hydroxide'],
  [66, 'An insoluble salt obtained on reacting dilute sulphuric acid with barium chloride.', 'Barium sulphate'],
  [67, 'The displaced product obtained when zinc reacts with an aqueous solution of copper sulphate.', 'Copper'],
  [68, 'A metallic chloride of a trivalent metal obtained when potassium dichromate oxidises concentrated hydrochloric acid.', 'Chromium (III) chloride'],
  [69, 'A metallic hydroxide insoluble in excess of ammonium hydroxide obtained when the nitrate of the metal reacts with ammonium hydroxide.', 'Lead hydroxide'],
  [70, 'The acid obtained on absorption of sulphur trioxide in concentrated sulphuric acid.', 'Oleum or pyrosulphuric acid'],
  [71, 'The gas obtained on reduction of iron (III) oxide with carbon.', 'Carbon monoxide'],
];
const Q2 = [
  [72, 'Two gases one of which is neutral which combines to give a] an acidic gas b] a basic gas c] a neutral gas.', 'a] Hydrogen and chlorine b] Nitrogen and hydrogen c] Nitrogen and oxygen'],
  [73, 'Two gases one of which is basic which combine to give a solid.', 'Ammonia and hydrogen chloride'],
  [74, 'Two gases one of which is neutral which combine to give another neutral gas as one of the two products obtained.', 'Ammonia and oxygen'],
  [75, 'Two gases one of which is basic which combine to give a neutral gas as one of the two products obtained.', 'Ammonia and chlorine'],
  [76, 'An acidic gas other than chlorine which combines with a neutral liquid to give two acids as the only products.', 'Nitrogen dioxide and water'],
  [77, 'Two neutral gases which combine to give a gas neither acidic nor neutral.', 'Nitrogen and hydrogen'],
  [78, 'Two neutral gases which combine to give a gas neither acidic nor basic.', 'Nitrogen and oxygen'],
  [79, 'Two neutral gases which combine to give a liquid.', 'Hydrogen and oxygen'],
  [80, 'An exothermic reaction between two gases one of which is hydrogen.', 'Nitrogen and hydrogen'],
  [81, 'An exothermic reaction between two gases one of which is ammonia.', 'Ammonia and oxygen'],
  [82, 'An a) exothermic b) endothermic reaction between two gases one of which is nitrogen.', 'a] Nitrogen and hydrogen b] Nitrogen and oxygen'],
  [83, 'Two gases one of which is neutral obtained on thermal dissociation of an acidic gas.', 'Hydrogen and chlorine'],
  [84, 'Two gases one of which is acidic obtained on thermal dissociation of a solid.', 'Ammonia and hydrogen chloride'],
  [85, 'A gas whose empirical formula and molecular formula are not the same.', 'Acetylene [C2H2]'],
];
const Q3 = [
  [86, 'A red mixed oxide, which oxidises concentrated hydrochloric acid to chlorine.', 'Trilead tetraoxide'],
  [87, 'A black metallic oxide which reacts with dilute hydrochloric acid to give a resultant blue solution.', 'Copper (II) oxide'],
  [88, 'A coloured gas obtained in its nascent form on reaction between two acids.', 'Chlorine'],
  [89, 'A yellow amphoteric oxide reduced by a basic gas to give nitrogen.', 'Lead monoxide'],
  [90, 'An orange compound which on heating leaves a green residue and evolves a neutral gas.', 'Ammonium dichromate'],
  [91, 'A coloured gas obtained from two colourless gases.', 'Nitrogen dioxide'],
  [92, 'A brown solution obtained when nitric oxide is absorbed by a coloured salt solution.', 'Nitroso ferrous sulphate'],
  [93, 'A white double salt used for quick sedimentation of muddy water.', 'Alum'],
  [94, 'A metallic oxide whose colour in the heated state differs from its colour at ordinary temperatures.', 'Zinc oxide'],
  [95, 'An orange substance which reacts with concentrated hydrochloric acid to give chlorine gas.', 'Potassium dichromate'],
  [96, 'A black substance which behaves both as an oxidising agent and a catalyst.', 'Manganese dioxide'],
];
const Q4 = [
  [97, 'Is coloured, fairly soluble in water, heavier than air and decomposes at high temperatures.', 'Nitrogen dioxide'],
  [98, 'Is not acidic and cannot be dried using concentrated sulphuric acid.', 'Ammonia'],
  [99, 'Is fairly soluble in water and used as an anesthetic.', 'Nitrous oxide'],
  [100, 'Contains a triple covalent bond in its molecule.', 'Nitrogen'],
  [101, 'Combines with an acidic gas to give a nitrogenous fertilizer.', 'Ammonia'],
  [102, 'In the liquid state has a high latent heat of vaporization and hence used as a refrigerant.', 'Ammonia'],
  [103, 'Relights a glowing splint, is neutral in nature and 1.5 times heavier than air.', 'Nitrous oxide'],
  [104, 'Forms a mixed acid anhydride, is heavier than air and decomposes at very high temperatures.', 'Nitrogen dioxide'],
  [105, 'Burns with a greenish yellow flame when ignited with oxygen.', 'Ammonia'],
  [106, 'Is neutral and behaves as an oxidising and a reducing agent.', 'Nitric oxide'],
  [107, 'Is highly soluble in water and reduces heated metallic oxides to metals.', 'Ammonia'],
];
const Q5 = [
  [108, 'Is monovalent & above sodium in the activity series of metal.', 'Potassium'],
  [109, 'Is liquid at room temperature & has a comparatively low m.p. & b.p.', 'Mercury'],
  [110, 'Is below sodium in the activity series & has a low density.', 'Calcium'],
  [111, 'Is trivalent & is a poor conductor of heat.', 'Aluminium'],
  [112, 'Forms a black basic oxide.', 'Copper'],
  [113, 'Forms a buff yellow amphoteric oxide which stains the glass.', 'Lead'],
  [114, 'Is below aluminium in the activity series & cannot be easily beaten into sheets.', 'Zinc'],
  [115, 'Is a light, highly electropositive metal in group 1-period 4, of the modern periodic table.', 'Potassium'],
  [116, 'Is a weak, electropositive metal in group 13 of the periodic table.', 'Aluminium'],
  [117, 'Is present in the ore - fluorspar.', 'Calcium'],
  [118, 'Is common to both the ores - bauxite & cryolite.', 'Aluminium'],
  [119, 'Is present in the ores - haematite but not in calamine.', 'Iron'],
  [120, 'Is present in the ore calamine, but not in corundum.', 'Zinc'],
  [121, 'Is present in the ore magnetite & its fused metallic salts can be reduced to metal by electrolysis.', 'Magnesium (per key: 121. Magnesium)'],
  [122, 'Is below mercury in the activity series of metal & its oxide can be reduced to the respective metal by action of heat on the metallic oxide.', 'Silver'],
  [123, 'Is monovalent & present in the salt formed when sodium hydroxide is added to impure bauxite in Baeyer\'s process.', 'Sodium'],
  [124, "Is formed at the cathode - during Hall Heroult's process during extraction of aluminium.", 'Aluminium'],
  [125, 'Is present in both the alloys - bronze & solder.', 'Tin'],
  [126, 'Is present in the alloy - duralumin but not in magnalium & is below lead in the activity series of metal.', 'Copper'],
  [127, 'Is added to sodium to form an alloy which is less reactive than sodium.', 'Mercury'],
];
// Q.6 -- metallurgy conversions (128-140): answer is the literal balanced
// equation/reagent hint printed opposite each conversion.
const Q6 = [
  [128, 'Zinc blende to zinc oxide.', 'ZnS --O2--> ZnO (+ SO2)'],
  [129, 'Calamine to zinc oxide.', 'ZnCO3 --heat--> ZnO (+ CO2)'],
  [130, 'Zinc oxide to zinc.', 'ZnO --C--> Zn (+ CO)'],
  [131, 'Iron pyrites to iron [III] oxide.', 'FeS2 --O2--> Fe2O3'],
  [132, 'An amphoteric oxide to lead.', 'PbO --C--> Pb'],
  [133, 'Spathic iron ore to iron [II] oxide.', 'FeCO3 --heat--> FeO (+ CO2)'],
  [134, 'Silver [I] oxide to silver.', 'Ag2O --heat--> Ag'],
  [135, 'Iron [III] oxide to iron using a neutral, poisonous gas.', 'Fe2O3 --CO--> Fe + CO2'],
  [136, 'Copper [II] oxide to copper using hydrogen.', 'CuO --H2--> Cu'],
  [137, "Caustic soda to sodium aluminate - [Baeyer's process].", 'Al2O3.2H2O --NaOH--> NaAlO2'],
  [138, "Sodium aluminate to a hydroxide of a trivalent metal - [Baeyer's process].", 'NaAlO2 --hydrolysis--> Al(OH)3'],
  [139, "A metallic hydroxide to aluminium oxide - [Baeyer's process].", 'Al(OH)3 --heat--> Al2O3'],
  [140, "Pure alumina to aluminium ions - [Hall Heroult's process].", 'Al2O3 --electrolysis--> Al3+'],
];
const Q7a = [
  [141, 'Ammonia to ammonium nitrate.', 'NH3 --dil. HNO3--> NH4NO3'],
  [142, 'Iron to iron [II] chloride.', 'Fe --dil. HCl--> FeCl2'],
  [143, 'Iron to iron [III] chloride.', 'Fe --Cl2--> FeCl3'],
  [144, 'Nitric acid to nitrosyl chloride.', 'HNO3 --3HCl conc.--> NOCl'],
  [145, 'Silver nitrate to nitric acid.', 'AgNO3 --dil. HCl--> HNO3'],
  [146, 'Nitric acid to iron [III] nitrate.', 'HNO3 --Fe2O3--> Fe(NO3)3'],
  [147, 'Potassium dichromate to potassium chloride.', 'K2Cr2O7 --conc. HCl--> KCl'],
  [148, 'Sodium chloride to sodium bisulphate.', 'NaCl --conc. H2SO4/MnO2--> NaHSO4'],
  [149, 'Nitric acid to sulphuric acid.', 'HNO3 --S--> H2SO4'],
  [150, 'Nitric acid to nitrogen dioxide.', 'HNO3 --Cu [conc. HNO3]--> NO2'],
  [151, 'Nitric acid to nitric oxide.', 'HNO3[dil.] --FeSO4/H2SO4--> NO'],
  [152, 'Sulphuric acid to sulphur dioxide.', 'H2SO4 --S--> SO2'],
  [153, 'Nitric acid to hydrogen.', 'HNO3 --Mg [very dil. HNO3]--> H2'],
  [154, 'Sulphuric acid to nitric acid.', 'H2SO4 --NaNO3--> HNO3 [conc. H2SO4]'],
  [155, 'Iron pyrites to iron [III] oxide.', 'FeS2 --O2--> Fe2O3'],
  [156, 'Copper oxide to copper.', 'CuO --NH3--> Cu'],
  [157, 'Magnesium nitride to magnesium hydroxide.', 'Mg3N2 --warm H2O--> Mg(OH)2'],
];
const Q7b = [
  [158, 'Sodium nitrate to nitrous oxide.', 'NaNO3 --NH4Cl--> NH4NO3 --Heat--> N2O'],
  [159, 'Zinc nitrate to zinc.', 'Zn(NO3)2 --Heat--> ZnO --C--> Zn'],
  [160, 'Ammonia to nitrogen dioxide.', 'NH3 --O2/Pt--> NO --O2--> NO2'],
  [161, 'Ammonium chloride to urea.', 'NH4Cl --NaOH--> NH3 --CO2--> NH2.CO.NH2'],
  [162, 'Lead nitrate to nitrogen.', 'Pb(NO3)2 --Heat--> PbO --NH3--> N2'],
  [163, 'Potassium nitrate to nitric oxide.', 'KNO3 --H2SO4--> HNO3 --FeSO4/conc. H2SO4--> NO'],
  [164, 'Iron [II] sulphate to nitroso ferrous sulphate.', 'FeSO4 --conc. H2SO4/HNO3--> NO --FeSO4--> FeSO4.NO'],
  [165, 'Zinc sulphide to zinc.', 'ZnS --O2--> ZnO --C--> Zn'],
  [166, 'Calcium nitrate to calcium carbide.', 'Ca(NO3)2 --Heat--> CaO --C--> CaC2'],
  [167, 'Sodium nitrate to ammonium nitrite.', 'NaNO3 --NH4Cl--> NH4NO3? [via NaNO2]--> NH4NO2 (NaNO3 -> NaNO2 -> NH4NO2)'],
  [168, 'Silver nitrate to diamine silver chloride.', 'AgNO3 --dil. HCl--> AgCl --NH4OH--> Ag(NH3)2Cl'],
  [169, 'Ammonium sulphate to urea.', '(NH4)2SO4 --Ca(OH)2--> NH3 --CO2--> (NH2)2.CO'],
  [170, 'Nitric oxide to nitric acid.', 'NO --O2--> NO2 --H2O/O2--> HNO3'],
  [171, 'Sulphur dioxide to pyrosulphuric acid.', 'SO2 --O2/Pt--> SO3 --H2SO4--> H2S2O7'],
  [172, 'Sodium aluminate to aluminium oxide.', 'NaAlO2 --H2O--> Al(OH)3 --Heat--> Al2O3'],
  [173, 'Calcium carbonate to calcium silicate.', 'CaCO3 --Heat--> CaO --SiO2--> CaSiO3'],
  [174, 'Sulphurdioxide to sulphuric & sulphurous acid in acid rain.', 'SO2 --H2O--> H2SO3; SO2 --O2--> SO3 --H2O--> H2SO4'],
];
// Q.8 -- organic conversions 175-192: answer key gives ONLY a page-pointer
// ("Equations 175 to 192 - pages 249 to 252") -- no literal equation.
const Q8 = [
  [175, 'Ethyne to ethanol.'], [176, 'Ethene to dichloroethane.'], [177, 'Ethyne to 1,2 dibromoethane.'],
  [178, 'Ethene to carbon dioxide.'], [179, 'Ethyne to monochloroethane.'], [180, 'Ethyne to ethylbromide.'],
  [181, 'Methane to chloroform.'], [182, 'Methane to 1,1,2,2-tetrachloroethane.'], [183, 'Ethane to 1,2-dibromoethane.'],
  [184, 'Ethyne to ethane.'], [185, 'Ethanol to ethylenedichloride.'], [186, 'Calcium carbide to 1,1-dibromoethane.'],
  [187, 'Sodium propionate to ethanal [acetaldehyde].'], [188, 'Ethanol to ethene.'],
  [189, 'Ethanoic acid to sodium acetate using i] a metallic bicarbonate ii] an alkali.'],
  [190, 'Ethene to ethanol to ethyl ethanoate.'], [191, '1,2-dibromoethane to ethyne to silver acetylide.'],
  [192, 'Bromoethane to ethane using Zn/Cu couple, and ethane to ethanal using MoO.'],
];

function build(list, groupNum) {
  return list.map(([n, text, answer]) => ({
    sourceQuestionNumber: String(n), kind: 'open', questionFormat: groupNum <= 5 ? 'name_the_following' : 'equation',
    text,
    parts: [{ text }],
    explanation: answer || null,
    answerStatus: answer ? 'source_provided' : 'unavailable',
    answerKeyRef: answer ? `chart_234_answer.pdf Chart 3 Q.${groupNum} item ${n}` : null,
  }));
}

// Chart 3's own printed structure does NOT organize by chapter (unlike
// Chart 1 / Competency, which print explicit "CHAPTER N" headers) -- it is
// a cross-topic "critical thinking" worksheet. Rather than dumping all 192
// items into one arbitrarily-chosen chapter, each Q-group is filed under
// the existing DB chapter that matches its own dominant subject matter
// (verified by reading every item's content, not guessed from position):
//   Q.1, Q.2, Q.4, Q.7(a), Q.7(b) -> Study of Compounds (ammonia/nitric
//     acid/sulphuric acid/HCl salts dominate; a handful of Q.1's 71 items
//     touch metallurgy/electrolysis by content, e.g. #29 "Iron from
//     Al+Fe2O3", #36/#38/#55/#60 electrolysis products -- kept with the
//     group rather than split item-by-item, noted here for transparency)
//   Q.3, Q.5, Q.6 -> Metallurgy (coloured metal compounds / metal
//     identification / explicit metallurgy conversions)
//   Q.8 -> Organic Chemistry (explicit organic conversions)
// No new chapter was created; every item maps to one of the 9 existing
// Chemistry chapters.
const batches = [
  { chapterName: 'Study of Compounds', items: [...build(Q1, 1), ...build(Q2, 2), ...build(Q4, 4), ...build(Q7a, 7), ...build(Q7b, 7)] },
  { chapterName: 'Metallurgy', items: [...build(Q3, 3), ...build(Q5, 5), ...build(Q6, 6)] },
  { chapterName: 'Organic Chemistry', items: build(Q8, 8) },
];

const results = batches.map((b) => {
  const r = ingestQuestions(b.items, {
    board: 'ICSE', subjectName: 'Chemistry', chapterName: b.chapterName,
    label: LABEL, status: 'transcribed', sourceSection: SECTION,
  });
  return { chapterName: b.chapterName, ...r };
});
console.log(JSON.stringify(results, null, 2));
const totals = results.reduce((a, r) => ({ inserted: a.inserted + r.inserted, skipped: a.skipped + r.skippedExactDuplicates, flagged: a.flagged + r.flaggedNearDuplicates }), { inserted: 0, skipped: 0, flagged: 0 });
console.log('TOTALS:', totals);
