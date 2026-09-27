// SECTION B / CHART 2 -- "Equation Worksheet" (a1ee5276-chart_2_equation.pdf,
// 12pg): "Complete & Balance the following [equations]" -- a fill-in-the-
// blank reaction worksheet organized by chapter (3A, 3B, 5, 6, 7A, 7B, 7C,
// 7D, 8[Alkanes/Alkenes/Alkynes/Alcohols&CarboxylicAcids]), each row giving
// the reactants (and, often, the reaction condition/catalyst) and asking the
// student to fill in the missing product(s).
//
// ANSWER AVAILABILITY (confirmed, not a guess): e9f12d6f-chart_234_answer.pdf's
// own "CHART 2" section gives ONLY nine chapter-level page-pointers into the
// ORIGINAL TEXTBOOK (e.g. "1. Chapter 3A - Acids, Bases & Salts [pg.274]")
// -- no literal per-equation answer is printed anywhere for Chart 2. This
// means every Chart 2 item is genuinely answerStatus='unavailable' by
// construction of the source itself (not a mapping failure on this
// project's part, and not a blanket call made without checking -- the
// answer document was read in full).
//
// Native shape: fill-in-the-blank equation completion -> kind='open',
// questionFormat='equation'. Every row is kept EXACTLY as printed (reagents,
// conditions, and the reaction-type label); items are grouped by their
// printed sub-heading (e.g. "Dissociation of Acids & Bases") into one row
// per sub-heading, with each individual numbered/bulleted equation kept as
// its own entry in `parts` -- this preserves 100% of the printed content
// while keeping row-count sane for a worksheet whose printed items don't
// carry their own persistent single-topic number across the whole chapter
// (unlike Chart 1/3/4, which do).

const { ingestQuestions } = require('./ingest');

const LABEL = 'chart_2_equation.pdf (Equation Worksheet) [chart_234_answer.pdf gives page-pointers only, no literal answers]';
const SECTION = 'Chart 2';

function group(heading, rows) {
  return { text: heading, parts: rows.map((r) => ({ text: r })) };
}
function mk(groups) {
  return groups.map((g) => ({
    kind: 'open', questionFormat: 'equation', text: g.text, parts: g.parts,
    answerStatus: 'unavailable', answerKeyRef: 'chart_234_answer.pdf Chart 2 gives only a chapter/page pointer, no literal equation answer',
  }));
}
function ingest(chapterName, groups) {
  return ingestQuestions(mk(groups), { board: 'ICSE', subjectName: 'Chemistry', chapterName, label: LABEL, status: 'transcribed', sourceSection: SECTION });
}

const results = [];

results.push({ chapterName: 'Acids, Bases and Salts', ...ingest('Acids, Bases and Salts', [
  group('Dissociation of acids & bases (complete & balance)', [
    'HCl + H2O <=> ___ + ___ [dissociation of monobasic acid]',
    'HNO3 + H2O <=> ___ + ___ [dissociation of monobasic acid]',
    'H2SO4 + H2O <=> ___ + ___ [dissociation of dibasic acid]',
    'H3PO4 + H2O <=> ___ + ___ [dissociation of tribasic acid]',
    'NaOH[aq.] <=> ___ + ___ [dissociation of monoacidic base]',
    'Ca(OH)2[aq.] <=> ___ + ___ [dissociation of diacidic base]',
  ]),
  group('Preparation of acids & bases (complete & balance)', [
    'SO2 + H2O -> ___ [acids from acidic oxides]',
    'SO3 + H2O -> ___ [acids from acidic oxides]',
    'Na2O + H2O -> ___ [bases from basic oxides and metals]',
    'K + H2O -> ___ + ___ [bases from basic oxides and metals]',
  ]),
  group('Properties of acids (complete & balance)', [
    'NaOH + HCl -> ___ + ___ [base - salt and water]',
    'Zn + 2HCl -> ___ + ___ [active metal - liberates H2]',
    'NaCl + H2SO4 [<200C] -> ___ + ___ [chlorides - displaces HCl]',
    'NaNO3 + H2SO4 [<200C] -> ___ + ___ [nitrates - displaces HNO3]',
    'NaHCO3 + H2SO4 -> ___ + ___ + ___ [bicarbonates - displaces H2CO3]',
    'Na2CO3 + H2SO4 -> ___ + ___ + ___ [carbonates - displaces H2CO3]',
  ]),
  group('Properties of bases (complete & balance)', [
    'NH4Cl + NaOH -> ___ + ___ + ___ [ammonium salts - liberates NH3]',
    'CuCl2 + NaOH -> ___ + [ppt] [metallic salt - insoluble hydroxide]',
  ]),
  group('Preparation of salts (complete & balance)', [
    'Fe + Cl2 -> ___ [direct combination, soluble salt]',
    'Zn + S -> ___ [direct combination, insoluble salt]',
    'Fe + H2SO4[dil.] -> ___ + H2 [displacement]',
    'Zn + H2SO4[dil.] -> ___ + H2 [displacement]',
    'Pb(NO3)2 + NaCl -> ___ + [ppt] [precipitation - double decomposition]',
    'CaCl2 + Na2CO3 -> ___ + [ppt] [precipitation - double decomposition]',
    'CuO + H2SO4[dil.] -> ___ + H2O [neutralization - insoluble base + acid]',
    'Cu(OH)2 + H2SO4[dil.] -> ___ + H2O [neutralization - insoluble base + acid]',
    '2NaOH + H2SO4[dil.] -> ___ + H2O [neutralization - alkali + acid, titration]',
    'NH4OH + HCl[dil.] -> ___ + H2O [neutralization - alkali + acid, titration]',
    'Na2CO3 + H2SO4[dil.] -> ___ + H2O + CO2 [action of dilute acid on carbonate]',
    '2KHCO3 + H2SO4[dil.] -> ___ + H2O + CO2 [action of dilute acid on bicarbonate]',
    'NaOH + H2SO4[dil.] -> ___ + H2O [acid salt - from insufficient NaOH]',
    '2NaOH + H2SO4[dil.] -> ___ + H2O [normal salt - from excess NaOH]',
  ]),
  group('Chapter 3B - Analytical Chemistry: action of NaOH on salt solutions (complete precipitate + colour/solubility already given)', [
    'MgCl2 + NaOH -> ___ + [ppt] [Mg(OH)2 - dull white, insoluble]',
    'FeSO4 + NaOH -> ___ + [ppt] [Fe(OH)2 - dirty green, insoluble]',
    'FeCl3 + NaOH -> ___ + [ppt] [Fe(OH)3 - reddish brown, insoluble]',
    'CuSO4 + NaOH -> ___ + [ppt] [Cu(OH)2 - pale blue, insoluble]',
    'ZnSO4 + NaOH -> ___ + [ppt] [Zn(OH)2 - gelatinous white, soluble in excess]',
    '[Zn(OH)2 + NaOH -> ___ + ___] [Na2ZnO2 - colourless soln.]',
    'Pb(NO3)2 + NaOH -> ___ + [ppt] [Pb(OH)2 - chalky white, soluble in excess]',
    '[Pb(OH)2 + NaOH -> ___ + ___] [Na2PbO2 - colourless soln.]',
  ]),
  group('Chapter 3B - action of NH4OH on salt solutions', [
    'MgCl2 + NH4OH -> ___ + [ppt] [Mg(OH)2 - dull white, insoluble]',
    'FeSO4 + NH4OH -> ___ + [ppt] [Fe(OH)2 - dirty green, insoluble]',
    'FeCl3 + NH4OH -> ___ + [ppt] [Fe(OH)3 - reddish brown, insoluble]',
    'CuSO4 + NH4OH -> ___ + [ppt] [Cu(OH)2 - pale blue, soluble in excess]',
    '[Cu(OH)2 + (NH4)2SO4 + NH4OH -> ___ + ___] [[Cu(NH3)4]SO4 - deep blue soln.]',
    'ZnSO4 + NH4OH -> ___ + [ppt] [Zn(OH)2 - white gelatinous, soluble in excess]',
    '[Zn(OH)2 + (NH4)2SO4 + NH4OH -> ___] [[Zn(NH3)4]SO4 - colourless soln.]',
    'Pb(NO3)2 + NH4OH -> ___ + [ppt] [Pb(OH)2 - chalky white, insoluble]',
  ]),
  group('Chapter 3B - action of alkalis on certain metals & their oxides/hydroxides', [
    'Zn + NaOH -> ___ + hydrogen [sodium zincate]',
    'Pb + NaOH -> ___ + hydrogen [sodium plumbite]',
    '2Al + NaOH + H2O -> ___ + hydrogen [sodium aluminate]',
    'ZnO + NaOH -> ___ + water [sodium zincate]',
    'Zn(OH)2 + NaOH -> ___ + water [sodium zincate]',
    'PbO + NaOH -> ___ + water [sodium plumbite]',
    'Pb(OH)2 + NaOH -> ___ + water [sodium plumbite]',
    'Al2O3 + NaOH -> ___ + water [sodium aluminate]',
    'Al(OH)3 + NaOH -> ___ + water [sodium aluminate]',
  ]),
]) });

results.push({ chapterName: 'Electrolysis', ...ingest('Electrolysis', [
  group('Electrolytic reactions (dissociation + cathode/anode half-reactions + product)', [
    'Electrolysis of fused lead bromide [inert-graphite electrodes]: PbBr2 <=> ___+___; cathode Pb2+ + ___ -> ___ [product: lead metal]; anode Br- - ___ -> ___; Br + Br -> ___ [product: bromine vapours]',
    'Electrolysis of acidified water [inert-Pt electrodes]: H2SO4 <=> ___+___; H2O <=> H+ + OH-; cathode H+ + ___ -> ___; H+H -> ___ [product: hydrogen, 2 vols]; anode OH- - ___ -> ___; OH -> ___+___ [product: oxygen, 1 vol]',
    'Electrolysis of aq. CuSO4 [Cu-anode, active electrodes]: CuSO4 <=> ___+___; H2O <=> H+ + OH-; cathode Cu2+ + ___ -> ___ [product: copper metal]; anode Cu - ___ -> ___ [product: nil, Cu2+ ions]',
  ]),
  group('Applications of electrolysis - electroplating & electrorefining (cathode/anode half-reactions)', [
    'Electroplating an article with nickel: electrolysis of aq. NiSO4; cathode [clean article to be plated] Ni2+ + ___ -> ___ [Ni deposited on article]; anode [block of active Ni] Ni - ___ -> ___ [nil, Ni2+ ions]',
    'Electroplating an article with silver: electrolysis of aq. Na[Ag(CN)2]; cathode [clean article to be plated] Ag+ + ___ -> ___ [Ag deposited on article]; anode [block of active Ag] Ag - ___ -> ___ [nil, Ag+ ions]',
    'Electrorefining of copper: electrolysis of aq. CuSO4; cathode [pure thin sheet of Cu] Cu2+ + ___ -> ___ [pure Cu deposited on thin sheet]; anode [impure block of active Cu] Cu - ___ -> ___ [nil, Cu2+ ions]',
    'Electrometallurgy: electrolysis of fused CaCl2 [inert electrodes] Ca2+ + ___ -> ___ (cathode), 2Cl- - ___ -> ___ (anode); electrolysis of fused Al2O3 [inert electrodes] 2Al3+ + ___ -> ___ (cathode), 3O2- - ___ -> ___ (anode)',
  ]),
]) });

results.push({ chapterName: 'Metallurgy', ...ingest('Metallurgy', [
  group('Stages in extraction of metals - Step 2: roasting/calcination of concentrated ore', [
    'ZnS + O2 [800C] -> ___ + ___[g] [roasting of zinc blende]',
    'FeS2 + O2 -> ___ + ___[g] [roasting of iron pyrites]',
    'ZnCO3 [<400C] -> ___ + ___[g] [calcination of zinc carbonate]',
    'FeCO3 -> ___ + ___[g] [calcination of iron [II] carbonate]',
  ]),
  group('Stages in extraction of metals - Step 3: reduction of metallic oxide to metal', [
    'Al2O3 <=> ___ + ___ [electrolytic reduction of pure alumina]; 2Al3+ + 6e- -> ___ [at cathode]',
    'ZnO + C [heat] -> ___ + ___[g] [reduction of zinc oxide by coke]',
    'Fe2O3 + CO -> ___ + ___[g] [reduction of iron [III] oxide by CO]',
    'PbO + C [heat] -> ___ + ___[g] [reduction of lead [II] oxide by coke]',
    'CuO + C [heat] -> ___ + ___[g] [reduction of copper [II] oxide by coke]',
    'CuO + H2 [heat] -> ___ + ___ [reduction of copper [II] oxide by hydrogen]',
    'HgO [heat] -> ___ + ___[g] [thermal decomposition of mercury [II] oxide]',
    'Ag2O [heat] -> ___ + ___[g] [thermal decomposition of silver [I] oxide]',
  ]),
  group("Extraction of aluminium - Baeyer's process (Step 1: dressing) and Hall Heroult's process (Step 3: reduction by electrolysis)", [
    'Al2O3.2H2O + NaOH [150-200C] -> ___ + ___ [bauxite to sodium aluminate]',
    'NaAlO2 + H2O [50-60C] -> ___ + ___[ppt] [sodium aluminate to aluminium hydroxide]',
    'Al(OH)3 [1100C] -> ___ + ___ [aluminium hydroxide to pure alumina]',
    'Al2O3 <=> ___ + ___ [electrolytic reduction of pure alumina]; 2Al3+ + 6e- -> ___ [at cathode]; 3O2- - 6e- -> 3[___] -> 3O2 [at anode]',
  ]),
]) });

results.push({ chapterName: 'Study of Compounds', ...ingest('Study of Compounds', [
  group('Chapter 7A - Hydrogen Chloride: laboratory preparation', [
    'NaCl + H2SO4 [<200C] -> ___ + ___[g] [laboratory preparation]',
    '2NaCl + H2SO4 [>200C] -> ___ + ___[g] [laboratory preparation]',
  ]),
  group('Chapter 7A - properties of hydrogen chloride / hydrochloric acid', [
    'HCl[g] <=> ___ + ___ [>500C, thermal dissociation]',
    'NH3 + HCl[g] -> ___ [reaction with ammonia]',
    'Zn + HCl[g] -> ___ + ___ [active metal Zn - hydrogen]',
    'Fe + HCl[g] -> ___ + ___ [active metal Fe - hydrogen]',
    'Mg + HCl[dil.] -> ___ + ___ [active metal - hydrogen]',
    'CaO + HCl[dil.] -> ___ + ___ [base - salt and water]',
    'NH4OH + HCl[dil.] -> ___ + H2O [base - salt and water]',
    'Na2CO3 + HCl[dil.] -> ___ + H2O + ___ [carbonate - carbon dioxide]',
    'NaHCO3 + HCl[dil.] -> ___ + H2O + ___ [bicarbonate - carbon dioxide]',
    'Na2SO3 + HCl[dil.] -> ___ + H2O + ___ [sulphite - sulphur dioxide]',
    'NaHSO3 + HCl[dil.] -> ___ + H2O + ___ [bisulphite - sulphur dioxide]',
    'FeS + HCl[dil.] -> ___ + ___ [sulphide - hydrogen sulphide]',
    'AgNO3 + HCl[dil.] -> ___ + ___ [silver nitrate - AgCl ppt.]; [AgCl + NH4OH -> ___] [solubility of ppt. in NH4OH]',
    'Pb(NO3)2 + HCl[dil.] -> ___ + ___ [lead nitrate - PbCl2 ppt.]',
    'Na2S2O3 + 2HCl[dil.] -> ___ + ___ + ___ + H2O [sodium thiosulphate]',
  ]),
  group('Chapter 7A - conc. HCl as a reducing/oxidising-agent reaction (nascent chlorine liberation)', [
    'MnO2 + HCl[conc.] -> ___ + H2O + ___ [manganese [IV] oxide]',
    'PbO2 + HCl[conc.] -> ___ + H2O + ___ [lead [IV] oxide]',
    'Pb3O4 + HCl[conc.] -> ___ + H2O + ___ [trilead tetroxide]',
    '2KMnO4 + HCl[conc.] -> KCl + ___ + H2O + ___ [potassium permanganate]',
    'K2Cr2O7 + HCl[conc.] -> KCl + ___ + H2O + ___ [potassium dichromate]',
    'HNO3 + HCl[conc.] -> NOCl + H2O + ___ [conc. HNO3 - aqua regia]',
  ]),
  group('Chapter 7B - Ammonia: laboratory & general preparations', [
    'NH4Cl + Ca(OH)2 -> ___ + ___ + NH3 [laboratory preparation]',
    'NH4Cl + NaOH -> ___ + ___ + NH3 [laboratory preparation]',
    '(NH4)2SO4 + Ca(OH)2 -> ___ + ___ + NH3 [laboratory preparation]',
    '(NH4)2SO4 + NaOH -> ___ + ___ + NH3 [laboratory preparation]',
    'Mg3N2 + H2O[warm] -> ___ + NH3 [general preparation]',
    'Ca3N2 + H2O[warm] -> ___ + NH3 [general preparation]',
    'AlN + H2O[warm] -> ___ + NH3 [general preparation]',
    "N2 + H2 [450-500C, Fe] <=> ___ + heat [manufacture, Haber's process]",
  ]),
  group('Chapter 7B - properties of ammonia gas', [
    '4NH3 + O2 -> ___ + H2O [burning of ammonia]',
    '4NH3 + O2 [Pt, 800C] -> ___ + H2O + heat [catalytic oxidation]',
    'NH3 + H2O -> ___ [liquor ammonia]',
    'NH3 + HCl -> ___ [ammonium chloride]',
    'NH3 + HNO3 -> ___ [ammonium nitrate]',
    'NH3 + H2SO4 -> ___ [ammonium sulphate]',
    'NH4OH + HCl -> ___ + H2O [ammonium salts by neutralization]',
    'NH4OH + HNO3 -> ___ + H2O [ammonium salts by neutralization]',
    'NH4OH + H2SO4 -> ___ + H2O [ammonium salts by neutralization]',
    'NH3 + CuO -> ___ + ___ + N2 [reduction of copper oxide]',
    'NH3 + PbO -> ___ + ___ + N2 [reduction of lead oxide]',
    '8NH3 + Cl2 -> ___ + ___ [excess ammonia with Cl2]',
    'NH3 + 3Cl2 -> ___ + ___ [ammonia with excess Cl2]',
  ]),
  group('Chapter 7B - reactions of metallic salt solutions with ammonium hydroxide', [
    'FeSO4 + NH4OH -> ___ + [ppt, dirty green, insoluble]',
    'FeCl3 + NH4OH -> ___ + [ppt, red brown, insoluble]',
    'Pb(NO3)2 + NH4OH -> ___ + [ppt, white, insoluble]',
    'ZnSO4 + NH4OH -> ___ + [ppt, white]; [Zn(OH)2 + (NH4)2SO4 + 2NH4OH -> ___ + H2O] [soluble in excess NH4OH]',
    'CuSO4 + NH4OH -> ___ + [ppt, pale blue]; [Cu(OH)2 + (NH4)2SO4 + 2NH4OH -> ___ + H2O] [soluble in excess NH4OH]',
  ]),
  group('Chapter 7C - Nitric Acid: laboratory preparation & Ostwald\'s process', [
    'KNO3 + H2SO4[conc.] [<200C] -> ___ + ___ [laboratory preparation]',
    'NaNO3 + H2SO4[conc.] [<200C] -> ___ + ___ [laboratory preparation]',
    '4NH3 + O2 [Pt, 800C] -> ___ + H2O + heat [catalytic chamber]',
    'NO + O2 [50C] -> ___ [oxidation chamber]',
    'NO2 + H2O + O2 -> ___ [absorption tower]',
  ]),
  group('Chapter 7C - properties of nitric acid: decomposition, ionization, reactions with carbonates', [
    '4HNO3 -> ___ + ___ + O2 [thermal decomposition]',
    'HNO3 <=> H+ + NO3- [ionization]',
    'NaOH + HNO3[dil.] -> ___ + H2O [base - salt and water]',
    'CaCO3 + HNO3[dil.] -> ___ + H2O + ___ [carbonate - carbon dioxide]',
    'PbCO3 + HNO3[dil.] -> ___ + H2O + ___ [carbonate - carbon dioxide]',
    'Ca(HCO3)2 + HNO3[dil.] -> ___ + H2O + ___ [bicarbonate - carbon dioxide]',
    'Ca(HSO3)2 + HNO3[dil.] -> ___ + H2O + ___ [bisulphite - sulphur dioxide]',
  ]),
  group('Chapter 7C - oxidising nature of conc. and dilute nitric acid', [
    'C + HNO3[conc.] -> ___ + H2O + ___ [carbon oxidised to CO2]',
    'S + HNO3[conc.] -> ___ + H2O + ___ [sulphur oxidised to H2SO4]',
    'P + HNO3[conc.] -> ___ + H2O + ___ [phosphorus oxidised to H3PO4]',
    'Cu + HNO3[conc.] -> ___ + H2O + ___ [copper oxidised to Cu(NO3)2]',
    'Zn + HNO3[conc.] -> ___ + H2O + ___ [zinc oxidised to Zn(NO3)2]',
    '3HCl + HNO3[conc.] -> ___ + H2O + ___ [HCl oxidised to chlorine]',
    'Cu + HNO3[dil.] -> ___ + H2O + ___ [copper oxidised to Cu(NO3)2]',
    'Zn + HNO3[dil.] -> ___ + H2O + ___ [zinc oxidised to Zn(NO3)2]',
    'FeSO4 + H2SO4 + HNO3 -> ___ + H2O + ___ [iron [II] sulphate oxidised to iron [III] sulphate]; [FeSO4 + NO[very dil.] -> FeSO4.NO, brown ring test]',
    'Mg + HNO3[dil.] -> ___ + H2 [Mg oxidised to Mg(NO3)2]',
  ]),
  group('Chapter 7D - Sulphuric Acid: general preparation & Contact process', [
    'S + HNO3[conc.] -> ___ + ___ + H2SO4 [sulphur with conc. HNO3]',
    'S + O2 -> ___ [sulphur burners]',
    'FeS2 + O2 -> ___ + ___ [pyrite burners]',
    'SO2 + O2 [V2O5, 450-500C] <=> ___ + heat [contact tower]',
    'SO3 + H2SO4 -> ___ [absorption tower]',
    'H2S2O7 + H2O -> ___ [dilution tank]',
  ]),
  group('Chapter 7D - properties of sulphuric acid (acidic, dibasic, non-volatile, oxidising, dehydrating; tests)', [
    'Zn + H2SO4[dil.] -> ___ + H2 [active metal - hydrogen]',
    '2NaOH + H2SO4[dil.] -> ___ + H2O [base - salt and water]',
    'K2CO3 + H2SO4[dil.] -> ___ + H2O + ___ [carbonate - carbon dioxide]',
    'Na2SO3 + H2SO4[dil.] -> ___ + H2O + ___ [sulphite - sulphur dioxide]',
    'FeS + H2SO4[dil.] -> ___ + ___ [sulphide - hydrogen sulphide]',
    'H2SO4 <=> ___ + SO4 2- [dissociates - 2H+ ions]',
    'NaOH + H2SO4[dil.] -> ___ + H2O [acid salt formed]',
    '2NaOH + H2SO4[dil.] -> ___ + ___ [normal salt formed]',
    'NaCl + H2SO4[conc.] [<200C] -> ___ + HCl [displaces volatile HCl]',
    'NaNO3 + H2SO4[conc.] [<200C] -> ___ + HNO3 [displaces volatile HNO3]',
    'C + H2SO4[conc.] -> ___ + H2O + ___ [carbon - carbon dioxide]',
    'S + H2SO4[conc.] -> ___ + H2O [sulphur - sulphur dioxide]',
    'Cu + H2SO4[conc.] -> ___ + H2O [copper - copper sulphate]',
    'Zn + H2SO4[conc.] -> ___ + H2O + ___ [zinc - zinc sulphate]',
    '2HI + H2SO4[conc.] -> ___ + H2O + ___ [hydrogen iodide - iodine]',
    'H2S + H2SO4[conc.] -> ___ + H2O + ___ [hydrogen sulphide - sulphur]',
    'C6H12O6 [conc. H2SO4] -> ___ + H2O [glucose - carbon, dehydration]',
    'C12H22O11 [conc. H2SO4] -> ___ + H2O [sucrose/cane sugar - carbon, dehydration]',
    '[C6H10O5]n [conc. H2SO4] -> ___ + [H2O]n [cellulose - carbon, dehydration]',
    'HCOOH [conc. H2SO4] -> ___ + H2O [formic acid - carbon monoxide, dehydration]',
    'H2C2O4 [conc. H2SO4] -> ___ + ___ + H2O [oxalic acid - CO, CO2, dehydration]',
    'C2H5OH [conc. H2SO4] -> ___ + H2O [ethanol - ethene, dehydration]',
    'CuSO4.5H2O [conc. H2SO4] -> ___ + H2O [hydrated CuSO4 - anhydrous CuSO4, dehydration]',
    'Cu + H2SO4[conc.] -> ___ + H2O + ___ [test: addition of Cu - SO2 evolved]',
    'BaCl2 + H2SO4[dil.] -> HCl + ___[ppt] [test: BaSO4 white ppt.]',
    'Pb(NO3)2 + H2SO4[dil.] -> HNO3 + ___[ppt] [test: PbSO4 white ppt.]',
  ]),
]) });

results.push({ chapterName: 'Organic Chemistry', ...ingest('Organic Chemistry', [
  group('Chapter 8 - Alkanes: laboratory preparations', [
    'CH3-COONa [sodium ethanoate] + NaOH [sodalime, CaO, heat] -> ___ + ___',
    'C2H5-COONa [sodium propanoate] + NaOH [sodalime, CaO, heat] -> ___ + ___',
    'CH3-I [iodomethane] + 2[H] [nascent, Zn/Cu couple, alcohol] -> ___ + ___',
    'C2H5-Br [bromoethane] + 2[H] [nascent, Zn/Cu couple, alcohol] -> ___ + ___',
  ]),
  group('Chapter 8 - Alkanes: substitution reactions (successive chlorination of methane and ethane)', [
    'CH4 + Cl2 [diff. sunlight/uv, heat] -> ___ + HCl (name the product)',
    '___ + Cl2 -> ___ + HCl (2nd substitution on methane)',
    '___ + Cl2 -> ___ + HCl (3rd substitution on methane)',
    '___ + Cl2 -> ___ + HCl (4th substitution on methane, CCl4)',
    'C2H6 + Cl2 [diff. sunlight/uv, heat] -> ___ + HCl (name the product)',
    '___ + Cl2 -> ___ + HCl (2nd substitution on ethane)',
    '___ + Cl2 -> ___ + HCl (3rd)',
    '___ + Cl2 -> ___ + HCl (4th)',
    '___ + Cl2 -> ___ + HCl (5th)',
    '___ + Cl2 -> ___ + HCl (6th, hexachloroethane)',
  ]),
  group('Chapter 8 - Alkanes: complete/incomplete combustion, catalytic oxidation, controlled oxidation, pyrolysis', [
    'CH4 + O2[excess] -> ___ + ___ [complete combustion]',
    '2C2H6 + O2[excess] -> ___ + ___ [complete combustion]',
    'CH4 + O2[limited] -> ___ + ___ [incomplete combustion]',
    'C2H6 + O2[limited] -> ___ + ___ [incomplete combustion]',
    'CH4 + O2 [Cu tube, 200C] -> ___ [catalytic oxidation]',
    'C2H6 + O2 [Cu tube, 200C] -> ___ [catalytic oxidation]',
    'CH4 + O2 [MoO, 350-500C] -> ___ + ___ [catalytic oxidation]',
    'C2H6 + O2 [MoO, 350-500C] -> ___ + ___ [catalytic oxidation]',
    'CH4 [O, K2Cr2O7] -> alcohol [O] -> aldehyde [O] -> acid [controlled oxidation, name each product]',
    'C2H6 [O, K2Cr2O7] -> alcohol [O] -> aldehyde [O] -> acid [controlled oxidation, name each product]',
    'CH3OH + [O] [K2Cr2O7/dil. H2SO4] -> ___ + ___',
    'C2H5OH + 2[O] [K2Cr2O7/dil. H2SO4] -> ___ + ___',
    '2CH4 [1500C, pyrolysis] -> ___ + ___',
    'C2H6 [500C, Al2O3, pyrolysis] -> ___ + ___',
  ]),
  group('Chapter 8 - Alkenes (Ethene): laboratory preparation and addition reactions', [
    'C2H5-OH [ethanol] [conc. H2SO4 at 170C, or Al2O3 at 350C] -> ___ + ___',
    'C2H5-Br [bromoethane] + KOH[alcoholic] [boil] -> ___ + ___ + ___',
    'H2C=CH2 + H2 [Nickel, 300C] -> ___ [catalytic hydrogenation]',
    'H2C=CH2 + Cl2 [CCl4] -> ___ [chlorination]',
    'H2C=CH2 + Br2[brown] [CCl4] -> ___ [bromination]; [C2H4 + I2 -> ___, 1,2-diiodoethane]',
    'H2C=CH2 + HBr [room temp.] -> ___; [C2H4 + HCl -> ___, chloroethane]',
    'H2C=CH2 + H2SO4[conc.] -> ___ [addition of sulphuric acid]',
    'H2C=CH2 + O3 [ether] -> ___ [addition of ozone]',
    'H2C=CH2 + HOH + [O] [cold dil. alkaline KMnO4, purple] -> ___; [C2H4 + O2 -> ___ + ___, combustion]',
    'n H2C=CH2 [high temp./pressure, catalyst] -> [H2C-CH2]n [polymerization]',
  ]),
  group('Chapter 8 - Alkynes (Ethyne): laboratory preparation and addition reactions', [
    'CaC2 [calcium carbide] + 2H2O[cold water] -> ___ + ___',
    'CH2Br-CH2Br [1,2-dibromoethane] + 2KOH[alcoholic] [boil] -> ___ + ___ + ___',
    'HC#CH + H2 [Nickel, 300C] -> ___ [1st stage] -> [Nickel, 300C] ___ [2nd stage, catalytic hydrogenation]',
    'HC#CH + Cl2 [CCl4] -> ___ [1st stage] -> [CCl4] ___ [2nd stage, chlorination]',
    'HC#CH + Br2 [CCl4] -> ___ [1st stage] -> [CCl4] ___ [2nd stage, bromination]; [C2H2 + I2 -> ___, 1,2-diiodoethene]',
    'HC#CH + HBr -> ___ [1st stage] -> ___ [2nd stage]; [similar reaction with HCl]',
    'HC#CH + H2SO4[conc.] -> ___ [addition of sulphuric acid]',
    'HC#CH + O3 -> ___ [addition of ozone]',
    'HC#CH + 4[O] [cold dil. alkaline KMnO4] -> ___; [C2H2 + O2 -> ___ + ___, combustion]',
    'HC#CH + 2CuCl + 2NH4OH -> ___ + ___ + ___ [red ppt., copper acetylide]',
    'HC#CH + 2AgNO3 + 2NH4OH -> ___ + ___ + ___ [white ppt., silver acetylide]',
  ]),
  group('Chapter 8 - Alcohols (Ethanol): preparation and properties', [
    'C2H5-Br [bromoethane] + KOH[aq.] [boil] -> ___ + ___ [hydrolysis of alkyl halide]',
    'C2H4 [ethene] + H2SO4[conc.] [80C, 30 atmos.] -> ___; C2H5-HSO4 [ethyl hydrogen sulphate] + H2O[steam] -> ___ [hydration of ethene]',
    'C2H5OH + 3O2 -> ___ + ___ [combustion of ethanol]',
    'C2H5OH [O, K2Cr2O7/dil. H2SO4] -> CH3-CHO [ethanal] [O, K2Cr2O7/dil. H2SO4] -> ___ [oxidation of ethanol]',
    '2C2H5OH + 2Na -> ___ + ___ [reaction with sodium]',
    'C2H5OH + CH3COOH [conc. H2SO4 or dry HCl gas] <=> ___ + ___ [esterification reaction]',
    'C2H5OH [conc. H2SO4 excess, 170C] -> ___ + ___ [dehydration of ethanol]',
    '2C2H5OH[excess] [conc. H2SO4, 140C] -> ___ + ___ [dehydration, ether formation]',
  ]),
  group('Chapter 8 - Carboxylic Acids (Acetic acid / Ethanoic acid): properties', [
    'CH3COOH + NaOH [or Ca(OH)2 / NH4OH] -> ___ + H2O [reaction with alkalies]',
    'CH3COOH + C2H5OH [conc. H2SO4 or dry HCl gas] <=> ___ + H2O [esterification reaction]',
    'CH3COOH + NaHCO3 [carbonate/bicarbonate] -> CH3COONa + H2O + ___',
    '2CH3COOH + 2Na [active metals - Na, Mg, Zn] -> 2CH3COONa + ___',
  ]),
]) });

console.log(JSON.stringify(results.map(r => ({ chapterName: r.chapterName, inserted: r.inserted, skipped: r.skippedExactDuplicates, flagged: r.flaggedNearDuplicates })), null, 2));
const totals = results.reduce((a, r) => ({ inserted: a.inserted + r.inserted, skipped: a.skipped + r.skippedExactDuplicates, flagged: a.flagged + r.flaggedNearDuplicates }), { inserted: 0, skipped: 0, flagged: 0 });
console.log('TOTALS:', totals);
