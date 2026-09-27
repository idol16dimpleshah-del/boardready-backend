// SECTION B / CHART 1 -- "Additional Chapterwise Questions"
// (ede2c9ad-chart_1_additional_chapter_wise.pdf, 13pg): long-form
// descriptive/essay-type questions ("State...", "Explain...", "Give
// reasons...", "Name the following...") taken directly from the main
// reference textbook itself, organized by its own chapter/sub-chapter
// structure (Ch1, Ch2, Ch3A, Ch3B, Ch4, Ch5, Ch6, Ch7A-D, Ch8, Ch9).
//
// ANSWER MAPPING FINDING (documented, not a guess): the paired
// 53df3afd-chart_1_answer.pdf ("HINTS & SOLUTIONS...FROM PAGES 1 TO 113
// OBJECTIVE WORKBOOK WITH NEW COMPETENCY FOCUSED QUESTIONS & TEST PAPERS")
// explicitly identifies itself, on its own cover page, as the solutions to
// a DIFFERENT companion book (an "Objective Workbook") -- not to this
// "Additional Chapterwise Questions" essay set. Cross-checking several
// chapters confirms this structurally: chart_1_answer.pdf's answers are
// organized under lettered sub-topic headings (e.g. Ch1 "E&F: Periodic
// Properties", Ch4 "PART A: Gay Lussac's Law...", Ch6 "G: Alloys", Ch8
// "Organic Chemistry - General") with terse fill-in-the-blank/match/
// numerical answers and its OWN internal page citations (pg.1-121), which
// do not correspond to chart_1's own per-chapter question numbering
// (1,2,3...) or the essay/descriptive question shape actually printed
// here. A few answer entries happen to paraphrase content that also
// appears somewhere in a chart_1 essay question (e.g. Ch8's "General"
// block echoes ideas from chart_1 Ch8 Q9/Q19/Q20), but there is no
// reliable, systematic number-to-number key between the two documents --
// mapping any specific item would mean guessing which essay question a
// terse keyword-answer belongs to, which is exactly what the founder
// instructed against. All items are therefore captured in full native
// form (capture-first) with answerStatus='needs_review' at the batch
// level, for a human with the source book in hand to resolve.
//
// All items are long-form descriptive/definitional/derivation questions,
// several with lettered sub-parts printed as part of the same numbered
// question -> kind='open'. None are MCQ-shaped in this file (confirmed by
// reading all 13 pages) except chapter 9's uniform "Name the following:"
// list, itself still open/short-answer in native shape, not a choice set.

const { ingestQuestions } = require('./ingest');

const LABEL = 'chart_1_additional_chapter_wise.pdf (Additional Chapterwise Questions) [answer key chart_1_answer.pdf does not reliably map -- see header note]';
const SECTION = 'Chart 1';

function items(list, format) {
  return list.map(([n, text]) => ({
    sourceQuestionNumber: String(n), kind: 'open', questionFormat: format || 'descriptive',
    text, parts: [{ text }],
    answerStatus: 'needs_review',
    answerKeyRef: 'chart_1_answer.pdf does not number-match this document -- see ingest-chart1.js header note',
  }));
}

function ingest(chapterName, list, format) {
  return ingestQuestions(items(list, format), {
    board: 'ICSE', subjectName: 'Chemistry', chapterName, label: LABEL,
    status: 'transcribed', sourceSection: SECTION,
  });
}

const results = [];

results.push({ chapterName: 'Periodic Table', ...ingest('Periodic Table', [
  [1, 'State the salient features of the Modern Periodic Table, with special reference to the arrangement of periods and groups in the periodic table. State how separation and periodicity of elements forms a special feature of the Modern Periodic Table.'],
  [2, 'State what are a] Periods b] Groups c] Period number d] Group number in the Modern Periodic Table.'],
  [3, 'State the elements in correct order of increasing atomic numbers in periods 1, 2 and 3 of the Modern Periodic Table.'],
  [4, 'State the property trends of elements a] from left to right in a period b] on moving down a sub-group.'],
  [5, 'State the position of the following elements in the Modern Periodic Table: a] Normal or representative elements b] Bridge elements c] Transition and inner transition elements d] Alkali metals e] Halogens f] Noble or inert gases.'],
  [6, 'Compare the 1[IA] group elements with 17[VIIA] group elements.'],
  [7, 'State what is meant by the terms a] Periodicity in properties b] Periodic properties.'],
  [8, 'Explain the terms: a] Atomic radii b] Ionisation potential c] Electron affinity d] Electronegativity e] Metallic & non-metallic character of element with suitable examples.'],
  [9, 'With reference to the above periodic properties - a] to e] explain with reasons the trends in each of the periodic properties on moving i] across a period ii] down a sub-group. Tabulate the same in the form of a chart.'],
]) });

results.push({ chapterName: 'Chemical Bonding', ...ingest('Chemical Bonding', [
  [1, 'State what is meant by the term - chemical bond. Give the reasons for chemical bonding between atoms and the methods for achieving the same.'],
  [2, 'Explain the formation of an electrovalent compound from a metallic atom & a non-metallic atom. Compare the terms a] atoms & ions b] oxidation & reduction with suitable examples.'],
  [3, 'Explain with a diagrammatic representation the electron dot structure of the electrovalent compounds - NaCl, MgCl2, CaO.'],
  [4, 'Explain the formation of a covalent compound from two non-metallic elements. Compare non-polar covalent and polar covalent compounds with examples.'],
  [5, 'Explain with a diagrammatic representation the electron dot structure of the covalent compounds - hydrogen, chlorine, oxygen, nitrogen, water, methane, carbon tetrachloride and ammonia.'],
  [6, 'State the lone pair effect of the oxygen atom of the water molecule and the nitrogen atom of the ammonia molecule to explain the formation of H3O+ and OH- ions from water and NH4+ ions from ammonia.'],
  [7, 'Compare the characteristic properties of electrovalent and covalent compounds with reasons with special reference to a] nature b] volatility c] melting and boiling point d] conduction of electricity e] solubility f] speed of reactions.'],
]) });

results.push({ chapterName: 'Acids, Bases and Salts', ...ingest('Acids, Bases and Salts', [
  [1, "Define [in terms of ionic theory] with suitable examples the following a] acid b] base c] alkali. Differentiate between i] an organic and an inorganic acid ii] a hydracid and an oxyacid. Give an example of two bases which are not alkalis."],
  [2, 'In terms of a] dissociation in aqueous solution b] concentration of hydrogen or hydroxyl ions formed - differentiate with examples i] a strong acid and weak acid ii] a strong alkali and a weak alkali iii] a strong acid and a concentrated acid.'],
  [3, "Define i] basicity of acids ii] acidity of bases with reference to formation of hydrogen and hydroxyl ions respectively. Give reasons for the following - a] acetic acid is termed a monobasic acid b] sulphuric acid a dibasic acid c] phosphoric acid a tribasic acid d] sodium hydroxide a monoacidic base. Aluminium hydroxide does not dissociate in aqueous solution, even then it is considered a triacidic base - give reasons."],
  [4, 'Give an example of the preparation of an acid by a] direct combination of hydrogen with a non-metal b] dissolution of an acidic oxide in water c] displacement of a volatile acid by a non-volatile acid. Give the preparation of a base by i] direct combination of a metal with oxygen b] dissolution of a basic oxide in water.'],
  [5, 'Give the reaction of: a] a base b] an active metal c] a chloride d] a nitrate e] a bicarbonate f] a carbonate - with suitable acids. State the products formed in each case. Give the action of an ammonium salt and a metallic salt on sodium hydroxide.'],
  [6, "Give a specific use of the following acids a] citric b] oxalic c] carbonic d] tartaric e] acetic acid. Name a base used in a] manufacture of soaps b] manufacture of bleaching powder c] as an antacid d] in removing grease stains from clothes. Define in terms of ionic theory the term 'neutralization'. Give a suitable example of the same."],
  [7, 'Explain the terms a] Indicators b] pH value. Draw the pH scale with reference to use of a common acid-base indicator and a universal indicator indicating the different pH values for acidic, neutral and alkali solutions. Two liquids have pH of 5 and 1 respectively, state which is the stronger acid and give the effect of litmus paper on the liquid having pH-5.'],
  [8, 'Differentiate between common acid-base indicators and universal indicators. State why universal indicators are preferred to the former. Give the colour changes of three common acid-base indicators in neutral, acidic and alkali mediums. Give the utility of pH value in the field of a] agriculture b] dairies.'],
  [9, "Define in terms of ionic theory and suitable examples a] a salt b] a normal salt c] an acid salt. Give a reason why i] nitric acid does not form an acid salt ii] aqueous sodium bicarbonate solution exhibits all properties of an acid while sodium carbonate does not."],
  [10, 'Give an example of each of the following types of salt and state what each contains - a] a basic salt b] a double salt c] a mixed salt d] a complex salt. Give an example of three i] insoluble metallic sulphates ii] insoluble metallic chlorides iii] insoluble metallic sulphides.'],
  [11, "Give the preparation of the following salts: a] copper [II] sulphate by action of dilute acid on an insoluble hydroxide b] sodium sulphate by action of dilute acid on a soluble hydroxide c] iron [II] sulphate by action of dilute acid on an active metal d] iron [III] chloride by direct combination of elements e] insoluble salts, lead chloride and calcium carbonate by precipitation by double decomposition of two salt solutions. Include a brief method stating the main steps involved in the preparations of each of the above salts. State giving reasons the salt prepared using titration procedure prior to preparation of the salt."],
  [12, 'Give a balanced equation for the preparation of the following salts - a] iron [III] chloride by direct combination method. b] iron [II] chloride by displacement method. c] lead sulphate from lead nitrate by precipitation [double decomposition]. d] lead sulphate from lead carbonate by precipitation [double decomposition]. e] lead chloride from lead carbonate by precipitation [double decomposition]. f] lead nitrate by neutralization of an insoluble base [insoluble oxide]. g] lead nitrate by neutralization of an insoluble base [insoluble hydroxide]. h] ammonium chloride by neutralization of an alkali [soluble base] [titration involved]. i] lead nitrate by the action of a dilute acid on an insoluble carbonate. j] sodium sulphate by the action of a dilute acid on a bicarbonate.'],
  [13, 'Give a balanced equation for the decomposition of - a] sodium hydrogen carbonate by dilute HCl. b] sodium carbonate by dilute HCl. c] sodium sulphite by dilute HCl. d] iron [II] sulphide by dilute H2SO4.'],
]) });

results.push({ chapterName: 'Acids, Bases and Salts', ...ingest('Acids, Bases and Salts', [
  [1, "What is meant by the term 'analytical chemistry'."],
  [2, 'State the general colour of the salts of normal elements and of transition elements of the modern periodic table. Name seven coloured cations and colourless cations and two coloured anions and colourless anions present in salts.'],
  [3, "State the - a] name of the precipitate formed b] colour of the precipitate formed c] solubility of the precipitate formed - in excess of sodium hydroxide and ammonium hydroxide respectively, when each is added separately to the following salt solutions. i] MgCl2 ii] FeSO4 iii] FeCl3 iv] CuSO4 v] ZnSO4 vi] Pb(NO3)2."],
  [4, 'Give balanced equations for the reaction of - a] Zinc b] Lead monoxide c] Aluminium hydroxide - with sodium hydroxide solution and potassium hydroxide solution respectively.'],
]) });

results.push({ chapterName: 'Mole Concept & Stoichiometry', ...ingest('Mole Concept & Stoichiometry', [
  [1, "State the following laws with illustrations - a] Gay Lussac's law b] Avogadro's law."],
  [2, "Define or explain the following terms with examples wherever required: a] Absolute zero b] Gas equation c] Relative atomic mass [At.Wt.] d] Relative molecular mass [Mol. Wt.] e] Gram atomic mass [gram atom] f] Gram molecular mass [gram mole] g] Mole h] Avogadro's number i] Vapour density j] Percentage composition k] Empirical formula l] Molecular formula."],
  [3, 'What is meant by the term s.t.p. State a reason why volumes of gases are converted to s.t.p. State i] the standard temperature in centigrade and Kelvin ii] the standard pressure in mm. Hg., cm. Hg., atm. pressure.'],
  [4, "Give reasons for the following - a] When stating the volume of a given mass of gas, its temperature and pressure are always stated. b] The term 'vapour density' is generally referred to as 'relative vapour density'. c] One mole of any gas occupies one gram molecular volume [molar volume] which is equal to 22.4 litres at s.t.p."],
]) });

results.push({ chapterName: 'Electrolysis', ...ingest('Electrolysis', [
  [1, 'Define or explain the following terms with suitable examples - a] Electrolysis b] Electrolytes and non-electrolytes c] Strong and weak electrolytes d] Electrolytic cell e] Electrodes f] Anode and cathode g] Ions h] Cations and anions i] Electrolytic dissociation and ionisation.'],
  [2, 'Give reasons for the following - a] Solid sodium chloride does not conduct an electric current but in the molten or aqueous solution state, conducts. b] Gaseous ammonia and hydrogen chloride do not conduct an electric current, but in aqueous solution state, conduct. c] Metallic conduction differs from electrolytic conduction.'],
  [3, 'How are acids, bases and salts classified as strong or weak electrolytes.'],
  [4, "Explain the terms a] 'Electrochemical series' b] 'Selective discharge of ions'. State the factors affecting selective discharge of ions with specific examples."],
  [5, 'During electrolysis of fused lead bromide - a] State - i] the ions present ii] the electrolytic reaction at the cathode and anode iii] the products formed at the cathode and anode respectively.'],
  [6, 'During electrolysis of fused lead bromide - Give reasons for the following - i] The electrolytic cell is made of silica ii] The electrolytic cell in which the above electrolysis is carried out is heated slowly from outside iii] Vapours of bromine are liberated at the anode iv] The electrodes are inert in nature and made of graphite and not platinum.'],
  [7, 'During electrolysis of acidified water or dilute sulphuric acid - a] State - i] the ions present ii] the electrolytic reaction at the cathode and anode iii] the volumes of the products formed at the cathode and anode respectively.'],
  [8, 'During electrolysis of acidified water or dilute sulphuric acid - Give reasons for the following - i] Electrolysis of water is carried out on acidified and not pure water ii] The acid preferred for acidification of water is dilute sulphuric and not dilute nitric acid. iii] The electric current during the above electrolysis is passed for a prolonged period of time before collection of the gases. iv] During the above electrolysis, the concentration of sulphuric acid increases slightly at the anode, decreases at the cathode, but the total concentration remains the same. The hydrogen and oxygen liberated at the cathode and anode are in the ratio 2:1 by volume respectively.'],
  [9, 'During electrolysis of aqueous copper sulphate using copper electrodes - a] State - i] the ions present ii] the electrolytic reaction at the cathode and anode iii] the products formed at the cathode and anode respectively.'],
  [10, 'During electrolysis of aqueous copper sulphate using copper electrodes - Give reasons for the following - i] The electrolyte aqueous copper sulphate is generally acidified before conduction of the above electrolysis. ii] The products at the anode differ when the above electrolysis is carried out using copper or platinum anodes respectively. iii] The blue colour of the aqueous copper sulphate remains unchanged during the electrolysis using copper electrodes but fades when platinum electrodes are used.'],
  [11, "State three important applications of electrolysis. Explain the term 'electroplating of metals' and state why an article is electroplated. Give reasons for the following - a] The article to be electroplated is always placed at the cathode b] The metal to be plated on the article is always made the anode c] The electrolyte must contain ions of the metal to be plated d] A direct low current is passed for a considerable period of time."],
  [12, "Draw a diagram for 'electroplating' an article with nickel or silver. During electroplating of an article with nickel or silver respectively, state in each case a] the cathode and anode used b] the electrolytic reaction at the cathode and anode respectively."],
  [13, "Explain the term 'electrorefining' or purification of metals electrolytically. Draw a diagram for electrorefining of copper. During electrorefining of impure copper state - a] the electrolyte, cathode and anode used b] the electrolytic reaction at the cathode and anode respectively. What is meant by the term 'anode mud'. Name three metals other than copper refined by electrolysis."],
  [14, "Explain the term 'electrometallurgy.' State the electrolytic reaction at the cathode during extraction of the following metals - a] Sodium from fused sodium chloride b] Aluminium from pure alumina. Give reasons why highly electropositive metals are generally extracted by electrolysis only, while metals below aluminium in the activity series are reduced by reduction using conventional reducing agents and not by electrolysis."],
]) });

results.push({ chapterName: 'Metallurgy', ...ingest('Metallurgy', [
  [1, "Explain the term 'metal' with reference to its ionization."],
  [2, 'Give a reason why - a] metals tend to form cations on ionization b] the valency of aluminium is Al3+ i.e. tetravalent c] metals are good reducing agents d] formation of oxides - generally differentiates metals from non-metals.'],
  [3, 'Name a metal which forms a] a basic oxide b] an amphoteric oxide and - a non-metal which forms a neutral and an acidic oxide.'],
  [4, 'Name two metals which occur in the free or native state. Metals also occur in the combined state - give an example of a metal which occurs in the combined state as - a] a halide b] a sulphide c] an oxide.'],
  [5, "Give a reason why - there are a number of minerals in the earth's crust of which, only a few selected ones - are ores."],
  [6, 'Give the common name of the following ores whose formulas are - a] Na3AlF6 b] ZnCO3 c] Fe2O3 d] Al2O3.2H2O e] ZnO f] FeS2.'],
  [7, 'State the main stages involved during metallurgy - in extraction of pure metal from their impure ores.'],
  [8, 'State the principle involved in each of the following processes used in the dressing of the ore i.e. concentration of the ore or separation of the impurities from the ore. a] hydrolytic method [gravity separation] b] magnetic separation c] froth flotation method d] chemical method.'],
  [9, "Differentiate between the methods 'calcination' & 'roasting' used in the conversion of the concentrated ore to its oxide. Give a reason why - a] concentrated ores are converted to their oxides b] conversion of concentrated ore to its oxide, is not necessary in the metallurgy of aluminium. c] sulphide ores are generally roasted, while carbonate ores are calcined."],
  [10, 'State with examples the three main processes used - in the reduction of the metallic oxides to its metal. Give a reason why the reduction of metallic oxides to its metal is based on the activity series of metals.'],
  [11, 'Give balanced equations for the following conversions, based on the reduction of metallic oxides to its metal - a] Al2O3 to Al by electrolysis of the fused metallic salt. b] iron [III] oxide to iron by a gaseous reducing agent. c] copper [II] oxide to copper by use of a non-metal as a reducing agent. d] Mercury [II] oxide to mercury by action of heat.'],
  [12, "During the final stage of extraction of a metal by electrolytic refining, give a reason why during extraction of aluminium, magnesium or calcium, electrolytic refining is generally not required, but during extraction of zinc, copper or mercury from their respective salts or oxides, it is required."],
  [13, "Explain with equations the Baeyer's Process of purification of bauxite i.e. conversion of impure bauxite to pure alumina. The three main steps of conversion should include conversion of i] impure bauxite to sodium aluminate ii] sodium aluminate to aluminium hydroxide iii] aluminium hydroxide to pure alumina."],
  [14, "In the above Baeyer's Process give reasons for the following - a] Conc. solution of sodium hydroxide is added to impure bauxite in the first step of the conversion of impure bauxite to pure alumina b] A 'seed' crystal of aluminium hydroxide is added in the second step of conversion of impure bauxite to pure alumina."],
  [15, "In Hall Herault's Process of electrolytic reduction of fused pure alumina to aluminium - State a] The two substances added to the main electrolyte i.e. fused pure alumina b] The material of which the electrodes, cathode and anode are made of c] The electrolytic bath temperature. State the electrolytic reactions occurring at the cathode and anode during the above electrolytic reactions and name the products formed at the cathode and anode respectively."],
  [16, "In Hall Herault's Process for electrolytic reduction of fused alumina - Give reasons for the following - a] Fused alumina [Al2O3] is reduced to aluminium electrolytically only and not by reducing agents b] Electrolytic reduction of pure alumina is difficult to conduct at the fusion temperature of the electrolytic mixture i.e. 2050 C c] Fused cryolite [Na3AlF6] and fluorspar [CaF2] are added to the electrolytic mixture of pure alumina d] Extraction of aluminium was initially difficult over a hundred years ago but is comparatively simpler at present e] A thin layer of powder coke is generally sprinkled over the electrolytic mixture during electrolytic reduction f] The anodes of the electrolytic cell are periodically replaced during electrolysis of fused alumina g] The aluminium metal produced at the cathode is periodically removed from the base of the electrolytic cell h] Electrolytic reduction of alumina is a continuous process."],
  [17, 'Explain the terms - a] alloy b] amalgam. Give an example of - i] a liquid amalgam ii] an amalgam used in voltaic cells.'],
  [18, 'Give the - i] composition ii] property of each of the following alloys - a] brass b] bronze c] bell metal d] magnalium e] duralumin f] solder i] type metal j] stainless steel.'],
  [19, 'Give a reason why - a] zinc is added to copper in the alloy brass b] magnesium is added to aluminium in the alloy duralumin c] tin is added to lead in the alloy solder d] nickel and chromium are added to iron in the alloy stainless steel.'],
]) });

results.push({ chapterName: 'Study of Compounds', ...ingest('Study of Compounds', [
  [1, "Give the chemical name of 'muriatic acid.' How does hydrogen chloride occur in the free state."],
  [2, 'Give a balanced equation for the laboratory preparation of hydrogen chloride gas from sodium chloride.'],
  [3, 'In the above lab. preparation of HCl gas - give reasons for the following - a] Sodium chloride is preferred to other chlorides as a reactant. b] Conc. sulphuric acid is preferred to conc. nitric acid as the other reactant. c] The temperature in the above lab. preparation should be less than 200C d] Conc. sulphuric acid is preferred as a drying agent for drying hydrogen chloride gas while quicklime and phosphorus pentoxide are not preferred as drying agents. e] Hydrogen chloride gas is collected by the upward displacement of air and not over water.'],
  [4, 'State the nature, density and solubility of hydrogen chloride gas. How can the high solubility of HCl gas in water be demonstrated experimentally. Why does HCl gas fume in moist air.'],
  [5, 'How is HCl gas converted to a] ammonium chloride b] hydrogen. c] How is iron converted to iron [II] chloride using HCl gas.'],
  [6, "Starting from HCl gas explain the arrangement used to convert it to hydrochloric acid. What is a 'constant boiling mixture.' Explain the term with reference to hydrochloric acid."],
  [7, 'Give reasons why a] HCl is a monobasic acid. b] Dry HCl gas or a solution of HCl in toluene does not exhibit acidic properties nor is an electrolyte but an aq. soln. of HCl exhibits acidic nature and conducts electricity.'],
  [8, 'Using dil. HCl acid as one of the reactants how would you obtain a] Hydrogen b] Carbon dioxide c] Sulphur dioxide d] Hydrogen sulphide gas. Using conc. HCl how would you obtain chlorine using five different oxidising agents.'],
  [9, "What is 'aqua regia.' Give a balanced equation for formation of nascent chlorine from aqua regia. Why does aqua regia dissolve noble metals."],
  [10, 'Give two tests to identify hydrochloric acid. State the solubility of the precipitate silver chloride formed in one of the tests. Name a salt other than silver nitrate which gives a white precipitate with HCl acid.'],
  [11, 'State two industrial uses of hydrochloric acid. Give reasons why it is used in a] Pickling of metals b] Preparation of aqua regia.'],
]) });

results.push({ chapterName: 'Study of Compounds', ...ingest('Study of Compounds', [
  [1, 'How does ammonia occur in the free state and in the combined state. State two important sources of ammonia.'],
  [2, 'Give an equation for the laboratory preparation of ammonia from ammonium chloride. State another ammonium salt which reacts both with sodium and calcium hydroxides producing ammonia and give equations for the same.'],
  [3, 'In the above laboratory preparation of ammonia from ammonium chloride and calcium hydroxide - give reasons for the following - a] a higher ratio of slaked lime to ammonium chloride is used b] calcium hydroxide is preferred to other caustic alkalis c] the round bottom flask in which the reactants are heated is kept in an inclined position d] quick lime is used as a drying agent while sulphuric acid, phosphorus pentoxide and fused calcium chloride are not preferred e] ammonia is collected by the downward displacement of air and not over water.'],
  [4, 'Give a balanced equation for the conversion of magnesium nitride to ammonia. State why this method is not preferred as a laboratory method. Convert two other metallic nitrides similarly to ammonia.'],
  [5, "In the manufacture of ammonia by the Haber's process - Give a balanced equation for the reaction. State a] the nature of the reaction b] the ratio of the reactants c] the temperature, pressure, catalyst and promoter used d] two conditions which favour the forward reaction e] the sources of both the reactants nitrogen and hydrogen."],
  [6, "In the manufacture of ammonia by the Haber's process - Give reasons for the following - a] a higher ratio of hydrogen to nitrogen is preferred b] the reactants should be pure and free from impurities c] the reaction temperature should be around 450-500C d] the catalyst used does not effect the percentage yield of the ammonia formed e] ammonia can be separated and recovered from uncombined nitrogen and hydrogen by liquefaction or by dissolving in water."],
  [7, 'State the nature, density and solubility of ammonia. How is the high solubility of ammonia in water demonstrated.'],
  [8, 'Give a balanced equation for a] burning of ammonia in oxygen b] catalytic oxidation of ammonia. State the observations seen in each case. Why does the platinum catalyst continue to glow after heating is discontinued in reaction b].'],
  [9, 'How is ammonia converted to liquor ammonia. State why the prepared solution of liquor ammonia is - a] a weak base b] a weak electrolyte c] shows alkaline behaviour.'],
  [10, 'Convert ammonia to a] ammonium chloride b] ammonium nitrate c] ammonium sulphate.'],
  [11, 'State why ammonium hydroxide is used in qualitative analysis for identifying positive radicals or cations. Using ammonium hydroxide how would you distinguish between a] a ferrous and ferric salt b] a lead and a zinc salt. State your observations and give a balanced equation for reaction of copper sulphate with excess of ammonium hydroxide.'],
  [12, 'Give two reactions involving reduction of metallic oxides using ammonia as a reducing agent. How would you convert ammonia to a] nitrogen b] nitrogen trichloride using chlorine.'],
  [13, "Give three tests for ammonia gas. State the observation when ammonia is passed through Nesseler's reagent."],
  [14, 'Name the following a] an acid b] a fertilizer c] three important ammonium compounds prepared from ammonia. Explain with reasons one use of each of the following - a] liquor ammonia b] liquid ammonia c] ammonium carbonate d] ammonium chloride. Both liquid ammonia & chlorofluorocarbons are used in refrigeration gas. State why the latter are harmful to the environment.'],
]) });

results.push({ chapterName: 'Study of Compounds', ...ingest('Study of Compounds', [
  [1, "Give the chemical name of 'aqua fortis.' How does the nitrogen in the atmosphere get converted to nitric acid in the free state."],
  [2, 'Give a balanced equation for the laboratory preparation of nitric acid from nitre and conc. sulphuric acid.'],
  [3, 'In the above laboratory preparation of nitric acid - give reasons for the following a] conc. sulphuric acid is preferred to conc. hydrochloric acid b] the complete apparatus is made of glass c] the reaction temperature should be less than or around 200C.'],
  [4, "'The nitric acid obtained in the laboratory is slightly yellowish brown in colour.' - Give a balanced equation for the decomposition of the acid resulting in formation of the above colour. Give reasons for the following - i] air or carbon dioxide is bubbled through the acid or ii] the acid maybe diluted with water to remove the yellowish brown tinge from the acid."],
  [5, "In the manufacture of nitric acid by Ostwald's Process - State a] i] the ratio of the reactants ii] the nature of the reactants iii] the catalyst and the temperature used in the catalytic oxidation of ammonia to nitric oxide in the catalytic chamber of the above process b] Give the reactions [with all conditions] occurring in the oxidation chamber and the absorption tower of the above process."],
  [6, "In the manufacture of nitric acid by Ostwald's Process - give reasons for the following a] a higher ratio of air to ammonia is used b] the catalyst in the catalytic chamber is only initially heated c] the temperature in the oxidation chamber is brought down to around 50C d] the absorption tower is packed with quartz which is placed in layers in the tower."],
  [7, 'State what happens when nitric acid falls on the skin. Give a reason why distillation or boiling cannot be used to concentrate nitric acid beyond a certain concentration. What is fuming nitric acid.'],
  [8, 'Give reasons why - a] nitric acid kept in plain glass bottle turns yellowish brown b] nitric acid is considered a monobasic acid.'],
  [9, 'Give a balanced equation for the reactions of dilute nitric acid with a] lead oxide b] sodium hydroxide.'],
  [10, 'Give a reason why nitric acid is considered a strong oxidising agent. Give the reaction of conc. nitric acid with a] carbon b] sulphur. State the oxidised product in each case.'],
  [11, 'Name two metals which react with cold, very dilute nitric acid to liberate hydrogen. Why is nitric acid generally not used in the preparation of hydrogen from metals. State why the above two metals on the other hand react with acid liberating hydrogen.'],
  [12, 'Give a balanced equation for the reaction of a] copper b] zinc with i] cold dilute nitric acid ii] conc. nitric acid.'],
  [13, 'What is passive iron. Name a metal other than iron rendered similarly passive.'],
  [14, "State the composition of 'aqua regia.' Give an equation for conversion of aqua regia to nascent chlorine and further conversion to two different soluble metallic chlorides."],
  [15, 'Convert hydrogen sulphide to sulphur using nitric acid. State the observations and name the products formed when conc. nitric acid is added to heated saw dust.'],
  [16, 'State how the action of copper on hot conc. nitric acid serves as a test for the latter.'],
  [17, 'Give a balanced equation for the action of nitric acid on acidified iron [II] sulphate. Give the name and formula of the brown ring formed in the brown ring test used for testing the nitrate radical or nitric acid.'],
  [18, 'In the brown ring test used for testing the nitrate radical - Give reasons for the following - a] a freshly prepared iron [II] sulphate solution is used b] the brown ring is formed at the junction of the two liquids c] the brown ring decomposes on disturbing the test tube d] ferrous sulphate is acidified with conc. sulphuric acid which is poured from the sides of the test tube and not directly.'],
  [19, 'Give three industrial uses of nitric acid. State the use of nitric acid in a] Etching designs on brassware b] purification of gold.'],
]) });

results.push({ chapterName: 'Study of Compounds', ...ingest('Study of Compounds', [
  [1, "Give the chemical name of 'oil of vitriol.' State the occurrence of sulphuric acid in a] the free state b] the combined state."],
  [2, 'In the Contact Process for manufacture of sulphuric acid - give balanced equations for the reactions occurring in i] Sulphur or pyrite burners ii] Contact tower iii] Absorption tower and dilution tank. State the catalyst, temperature and pressure in the catalytic oxidation of sulphur dioxide to sulphur trioxide which takes place in the contact tower.'],
  [3, 'In the Contact Process for manufacture of sulphuric acid - name the following a] two impurities present in the gaseous mixture of sulphur dioxide and oxygen b] the substance placed in the arsenic purifier which removes the above impurity.'],
  [4, 'In the Contact Process for manufacture of sulphuric acid - give reasons for the following a] burning of sulphur or iron pyrites in oxygen is preferred to burning in purified air b] impurities must be removed from the gaseous mixture of sulphur dioxide and oxygen by passage through a purification unit c] excess oxygen is used in the catalytic oxidation of sulphur dioxide to sulphur trioxide d] vanadium pentoxide is preferred to platinized asbestos in the catalytic oxidation of sulphur dioxide e] the catalyst-mass is only initially heated in the contact tower and is porous in nature f] the optimum temperature preferred in the contact tower is around 450-500 C g] sulphur trioxide vapours in the absorption tower are absorbed in conc. sulphuric acid and not directly in water to give sulphuric acid.'],
  [5, 'State the nature and solubility of sulphuric acid. Give reasons for the following a] a beaker of conc. sulphuric acid filled to the brim will overflow on prolonged exposure to the air b] dilution of conc. sulphuric acid is carried out by addition of acid to water and not water to acid c] distillation or boiling cannot be used to conc. sulphuric acid beyond a certain concentration.'],
  [6, 'Give two reactions in each case to illustrate the following properties of sulphuric acid a] as an acid b] as a dibasic acid c] as a non-volatile acid d] as an oxidising agent e] as a dehydrating agent.'],
  [7, 'Give balanced equations for the conversion of a] dilute sulphuric acid to - i] hydrogen ii] carbon dioxide iii] sulphur dioxide iv] hydrogen sulphide b] conc. sulphuric acid to - i] an acid and a normal salt of sodium ii] a volatile acid iii] sulphur dioxide using a non-metal iv] iodine using hydrogen iodide v] carbon using sucrose or cane sugar vi] carbon monoxide using oxalic acid.'],
  [8, 'Give reasons for the following - a] dilute sulphuric acid exhibits acidic nature. b] conc. sulphuric acid is - i] a dibasic acid ii] a non-volatile acid iii] a strong oxidising agent iv] a strong dehydrating agent.'],
  [9, 'Give two tests each for a] conc. sulphuric acid b] dil. sulphuric acid. Using copper turnings how would you distinguish between conc. sulphuric acid and conc. nitric acid. Name two insoluble sulphates obtained from dilute sulphuric acid by reaction with the specific salts.'],
  [10, 'Give two industrial and three general uses of sulphuric acid. Name a] a fertilizer b] an explosive c] two different acids obtained from sulphuric acid. State the property of sulphuric acid involved in the preparation of i] iodine from hydrogen iodide ii] carbon monoxide from formic acid iii] hydrogen from an active metal.'],
]) });

results.push({ chapterName: 'Organic Chemistry', ...ingest('Organic Chemistry', [
  [1, "What is meant by the term 'Organic Chemistry'. Give a reason for i] study of organic compounds in a separate group ii] existence of a large number of organic compounds."],
  [2, 'Compare the general characteristics of organic and inorganic compounds.'],
  [3, 'Give the basic classification of organic compounds into two main groups with suitable examples.'],
  [4, 'What are homologous series. State the general characteristics of members of homologous series. Name the first four members of the homologous series of alkanes, alkenes and alkynes.'],
  [5, 'With reference to structure of organic compounds, state the meaning of the terms a] molecular formula b] structural formula with examples of three different alkanes, alkenes and alkynes respectively. What are alkyl and functional groups.'],
  [6, "Explain the term 'isomerism'. State the main characteristics of isomers. Draw the isomers of a] butane b] pentane c] butene d] butyne."],
  [7, "What is meant by the term 'nomenclature'. State the main systems of nomenclature. State the basic rules of nomenclature by each of the main systems. Give an example of two hydrocarbons having a] the same I.U.P.A.C. and common name b] having different I.U.P.A.C. and common names."],
  [8, 'What are hydrocarbons. Give their general molecular formula. How are they classified. Differentiate between alkanes, alkenes and alkynes with respect to a] number of covalent bonds in their molecule b] general formula of each of them. State the molecular formula and structural formula of i] alkane - ethane ii] alkene - ethene iii] alkyne - ethyne.'],
  [9, 'Differentiate between saturated and unsaturated organic compounds. Give reasons why saturated organic compounds - a] are less reactive than unsaturated organic compounds b] undergo substitution reactions while unsaturated undergo addition reactions.'],
  [10, 'What are alkanes. Why are they known as paraffins. Give the general formula and a natural source of alkanes. State the common name, molecular formula and structural formula of the first two members of the alkane series.'],
  [11, 'Give the laboratory preparation of methane from sodium acetate. State how an alkylhalide can be reduced to methane. Convert sodium propionate to ethane.'],
  [12, 'What are substitution reactions. Give equations for the formation of four different substitution products formed by chlorination of methane. State the products of complete and incomplete oxidation of methane and ethane respectively. Starting from methane and ethane how is methanoic and ethanoic acid obtained using - a] copper tube at 200C b] an oxidising agent. State the products of pyrolysis of methane.'],
  [13, 'Give two general uses of methane. Name four important chemicals manufactured from methane and state a specific use of each chemical.'],
  [14, 'What are alkenes. Why are they known as olefins. Give the general formula and a natural source of alkenes. Give the common name, I.U.P.A.C. name and structural formula of the first member of the alkene series.'],
  [15, 'Give the laboratory preparation of ethene [ethylene] from ethyl alcohol. State how the evolved ethene is purified and collected. Give the conversion of an alkane to ethene by thermal decomposition of the former.'],
  [16, 'What are addition reactions. Give the name and formula of the addition products formed when ethene reacts with the following. a] hydrogen b] chlorine c] bromine d] hydrogen bromide e] conc. sulphuric acid f] ozone. State the condition and/or reactant used for the conversion of ethene to polyethylene. State two general uses of ethene. Name two synthetic chemicals and two polymers manufactured from ethene.'],
  [17, "What are alkynes. Give the general formula of alkynes. Why is the alkyne series also referred to as the 'acetylene series.' Give the common name, I.U.P.A.C. name and structural formula of the first member of the alkyne series."],
  [18, 'Give the laboratory preparation of ethyne [acetylene] from calcium carbide. State the method of purification and collection of the evolved acetylene. Give the conversion of i] ethylene dibromide ii] an alkane - to ethyne [acetylene].'],
  [19, 'Give the catalytic hydrogenation of acetylene to an alkene and an alkane respectively. State the addition products of acetylene on reaction with i] chlorine ii] bromine iii] hydrogen bromide iv] ozone. Give the formation of i] copper ii] silver acetylide from ethyne [acetylene]. Give two general uses of acetylene. Name three organic compounds manufactured from acetylene and give one use of each.'],
  [20, 'What are alcohols. State the two main ways of naming alcohols with suitable examples.'],
  [21, 'Give the preparation of - Ethanol by a] hydrolysis of bromoethane b] hydration of ethene.'],
  [22, "How would you convert - Ethanol to a] acetic acid b] sodium ethoxide c] ethyl ethanoate d] ethene. What is spurious alcohol and denatured alcohol."],
  [23, 'How would you obtain ethanoic acid i.e acetic acid, from an alcohol by oxidation using acidified potassium dichromate solution. Starting from acetic acid how would you obtain a] sodium acetate using an alkali b] calcium acetate using an alkali c] ethyl ethanoate d] a neutral gas which burns in air with a pale blue flame. Give the tests and uses of acetic acid.'],
]) });

results.push({ chapterName: 'Practical Chemistry', ...ingest('Practical Chemistry', [
  [1, 'The neutral gas which turns anhydrous copper sulphate white to blue.'],
  [2, 'An acid which turns hydrous copper sulphate from blue to white.'],
  [3, 'A neutral gas which extinguishes a glowing splint.'],
  [4, 'An acidic gas which turns a filtered solution of slaked lime milky, but does not reduce potassium permanganate solution.'],
  [5, 'The type of reaction involved when acidified potassium dichromate solution turns from orange to green.'],
  [6, 'A colourless gas and a coloured gas which bleach moist blue litmus.'],
  [7, 'The substance formed responsible for the dense white fumes produced when a glass rod dipped in ammonia is brought near vapours of hydrochloric acid.'],
  [8, 'The substance formed when silver chloride dissolves in excess ammonium hydroxide.'],
  [9, 'The substance responsible for the silvery black colour obtained when hydrogen sulphide gas reacts with lead acetate paper.'],
  [10, 'Two gases other than hydrogen chloride which are highly soluble in water.'],
  [11, 'The gas evolved in each case, when sodium carbonate, sodium sulphite and sodium sulphide are heated individually with dilute sulphuric acid.'],
  [12, 'The black residue obtained - which is common to both, thermal decomposition of copper [II] carbonate & copper [II] nitrate.'],
  [13, 'A colourless gas obtained on thermal decomposition of copper [II] nitrate which is not obtained on thermal decomposition of copper [II] carbonate.'],
  [14, 'The anion present in a metallic salt which when heated with conc. sulphuric acid evolves hydrogen chloride gas.'],
  [15, 'A soluble salt which reacts with both sodium and ammonium hydroxide solutions to give a precipitate with similar colour and similar solubility in excess of the respective alkali.'],
  [16, 'A metallic hydroxide insoluble in ammonium hydroxide but soluble in sodium hydroxide.'],
  [17, 'A metallic hydroxide soluble in both ammonium and sodium hydroxide.'],
  [18, 'A metallic hydroxide insoluble in excess of sodium hydroxide but soluble in excess of ammonium hydroxide.'],
  [19, 'A metal below zinc in the activity series which reacts with a dilute mineral acid liberating hydrogen.'],
  [20, 'A salt which reacts with a base on heating liberating a gas which turns moist red litmus blue.'],
  [21, 'A black oxide which oxidises concentrated hydrochloric acid to chlorine gas.'],
  [22, 'A substance which reacts with dilute hydrochloric acid and decomposes forming - a] unstable carbonic acid b] a gas which turns acidified potassium permanganate solution from pink to clear colourless.'],
  [23, 'The salt formed when zinc oxide reacts with caustic soda solution.'],
  [24, 'The salt formed when aluminium reacts with boiling concentrated caustic potash soln.'],
  [25, 'The metal other than iron which is rendered passive on reaction with hot concentrated nitric acid.'],
], 'name_the_following') });

console.log(JSON.stringify(results.map(r => ({ chapterName: r.chapterName, inserted: r.inserted, skipped: r.skippedExactDuplicates, flagged: r.flaggedNearDuplicates })), null, 2));
const totals = results.reduce((a, r) => ({ inserted: a.inserted + r.inserted, skipped: a.skipped + r.skippedExactDuplicates, flagged: a.flagged + r.flaggedNearDuplicates }), { inserted: 0, skipped: 0, flagged: 0 });
console.log('TOTALS:', totals);
module.exports = { results, ingest, LABEL, SECTION };
