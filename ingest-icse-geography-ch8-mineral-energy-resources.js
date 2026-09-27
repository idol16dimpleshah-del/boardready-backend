// ICSE Class 10 Geography — Chapter 8: "Mineral and Energy Resources".
// Uploaded 2026-09-17 as part of the combined chap_8-9.pdf, archived via
// archive-icse-geography-ch8-9.js -> source_files.id 116 (this one
// physical file covers Chapters 8 and 9 — the second Geography upload,
// continuing directly from chap_4-7.pdf's Chapters 4-7).
//
// Verification method: every printed answer checked against documented
// Indian mineral/energy geography — iron/copper/manganese/bauxite/coal
// distribution and grades, oil fields and refineries, and conventional vs.
// non-conventional energy sources.
//
// Genuine defect, needs_review and CORRECTED — item 42: a letter/text
// mismatch (same defect pattern seen elsewhere in this project, e.g. ICSE
// History Ch13 item 36, ICSE Geography Ch7 item 23). The item asks for the
// best quality of iron ore, with options (a) Haematite (b) Limonite (c)
// Magnetite (d) Manganese. The printed key reads "Ans. (a) Haematite" —
// but its own explanation states "Magnetite is the best quality of iron
// ore, containing 72% pure iron," which is option (c), not (a). This also
// matches real mineralogy (Magnetite, ~72% Fe, has a marginally higher
// iron content than Haematite, ~70% Fe, even though Haematite is India's
// more abundant, economically dominant ore). Corrected to (c); the
// letter/text mismatch is disclosed.
//
// Two disclosed (non-needs_review) caveats:
// - Item 3: the printed "leading producer of coal" answer, Jharkhand, is
//   the long-standing conventional answer (and matches item 45's correct
//   claim that Jharkhand holds India's largest coal RESERVES), but several
//   more recent years of official coal-production statistics show
//   Chhattisgarh having overtaken Jharkhand as the top producing STATE by
//   annual output. Kept as printed since it remains a standard, widely
//   taught answer and is not internally contradicted by this chapter.
// - Item 25: the item's own framing conflates refinery operating
//   companies (HPCL, IOCL) with refinery locations (Mumbai, Kochi),
//   concluding neither HPCL nor IOCL runs a "coastal" refinery — but HPCL
//   itself operates a refinery in Mumbai (a coastal city), and IOCL
//   operates the coastal Paradip Refinery in Odisha, both of which
//   complicate the blanket "HPCL/IOCL = inland" claim. Kept as printed
//   since the item is testing recall of this book's own simplified
//   classification and no clearly better-supported option exists among
//   the four given under that same premise.
//
// All other 44 items independently verified clean against documented
// mineral and energy geography.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 116;

function mcq(n, page, text, options, correctIdx, opts = {}) {
  return {
    kind: 'mcq',
    sourceQuestionNumber: String(n),
    sourcePage: page,
    text,
    options,
    correct: correctIdx,
    diagramStatus: 'not_applicable',
    answerStatus: 'verified',
    answerKeyRef: `printed Ans., p.${page}, item ${n}`,
    ...opts,
  };
}

const items = [];

items.push(mcq(1, '269', 'Which of the following is not correctly matched? (Mineral : Location)',
  ['Iron: Assam', 'Manganese: Maharashtra', 'Copper: Madhya Pradesh', 'Coal: Jammu and Kashmir'], 0,
  { explanation: 'Assam is known for petroleum deposits, not for iron ore. Manganese is found in Maharashtra, Madhya Pradesh, Odisha, Karnataka, and Andhra Pradesh. Rajasthan, Madhya Pradesh, and Jharkhand are known for copper, while Jammu and Kashmir, Bihar, West Bengal, etc. are known for coal.' }));

items.push(mcq(2, '269', 'Iron from India is not exported to:',
  ['Japan', 'Korea', 'Gulf countries', 'Nepal'], 3,
  { explanation: 'In India, iron is exported to Japan, Korea, European countries and Gulf countries.' }));

items.push(mcq(3, '269', 'The leading producer of coal in India is:',
  ['Maharashtra', 'Karnataka', 'Jharkhand', 'Uttar Pradesh'], 2,
  { explanation: 'DISCLOSED NOTE: Jharkhand is the conventional, widely-taught answer for coal production, and this chapter’s own item 45 correctly notes Jharkhand holds India’s largest coal RESERVES (33.53%), with important coal mines in Jharia and Bokaro. Note that several more recent years of official annual coal-production statistics show Chhattisgarh having overtaken Jharkhand as the top-producing state by output, even though Jharkhand retains the largest reserves. Kept as printed since it remains the standard curriculum answer and is not contradicted within this chapter.' }));

items.push(mcq(4, '269', 'Bailadila iron ore mine is located in ______.',
  ['Odisha', 'Chhattisgarh', 'Jharkhand', 'None of these'], 1,
  { explanation: 'Bailadila iron ore mine is located in the Dantewada district of Chhattisgarh.' }));

items.push(mcq(5, '269', 'The industry which uses manganese is ______.',
  ['Iron and steel industry', 'Chemical industry', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'Manganese helps in removing oxygen and sulphur when iron ore is converted into iron. Thus, it is used in the iron and steel industry. On the other hand, in the chemical industry manganese is used as a catalyst or as an additive in fertilisers.' }));

items.push(mcq(6, '269', 'The leading producer of copper is ______.',
  ['Rajasthan', 'Madhya Pradesh', 'Both (a) and (b)', 'Neither (a) nor (b)'], 1,
  { explanation: 'Madhya Pradesh and Rajasthan are the leading producers of copper. Madhya Pradesh accounts for 53% of production and Rajasthan accounts for 43% of copper production.' }));

items.push(mcq(7, '270', 'Singhbhum and Hazaribagh are two copper mines in ______.',
  ['Rajasthan', 'Madhya Pradesh', 'Jharkhand', 'Karnataka'], 2,
  { explanation: 'Jharkhand is the third largest producer of copper after Madhya Pradesh and Rajasthan. Singhbhum, Hazaribagh and Palamu have large deposits of copper in Jharkhand.' }));

items.push(mcq(8, '270', 'Which kind of iron ore is mostly mined in India?',
  ['Magnetite', 'Haematite', 'Anthracite', 'None of these'], 1,
  { explanation: 'In India, haematite kind of iron ore is mined mostly. It is found in Bihar, Odisha and Jharkhand. Karnataka and Goa are leading producers of iron ore. Also note, that Anthracite is a type of coal not iron.' }));

items.push(mcq(9, '270', 'Which of the following metallic minerals is used in paint pigments?',
  ['Copper', 'Manganese', 'Iron', 'Aluminium'], 2,
  { explanation: 'Iron is used in paint pigments because iron oxide pigments are low-cost pigments which can resist colour change when there is sunlight exposure, it can also stay stable under normal conditions.' }));

items.push(mcq(10, '270', 'Odisha-Jharkhand belt is known for the production of which of the following metallic minerals?',
  ['Copper', 'Iron', 'Manganese', 'Aluminium'], 1,
  { explanation: 'Odisha-Jharkhand belt is the leading producer of iron ore in India. In Odisha, high grade haematite is found in Badampahar mines in the Mayurbhanj and Kendujhar districts. Palamu and Singhbhum districts of Jharkhand are the important producers of haematite.' }));

items.push(mcq(11, '270', 'The Kudremukh mines are located in:',
  ['Karnataka', 'Tamil Nadu', 'Kerala', 'Andhra Pradesh'], 0,
  { explanation: 'The Kudremukh mines are located in the Western Ghats of Karnataka. This is the region where the Bellary-Chitradurga-Chikmagalur-Tumkur belt is located. It has large reserves of iron ore. Kudremukh deposits are known to be one of the largest in the world.' }));

items.push(mcq(12, '270', 'Chikmagalur iron ore producing region is located in:',
  ['Odisha', 'Jharkhand', 'Chhattisgarh', 'Karnataka'], 3,
  { explanation: 'Important iron ore producing states of India have been mentioned below: Odisha: Sundargarh, Keonjhar, Mayurbhanj and Bonaigarh. Jharkhand: Paschim and Purbi Singhbhum and Palamu. Chhattisgarh: Durg, Bastar and Dantewada. Karnataka: Chikmagalur and Bellary.' }));

items.push(mcq(13, '271', 'Manganese is used:',
  ['for making iron and steel.', 'to increase the strength of steel.', 'for making paints.', 'all of these'], 3,
  { explanation: 'Manganese is used for making iron and steel and to increase the strength of steel alloys; manganese compounds (e.g. manganese dioxide) are also used in some paint pigments.' }));

items.push(mcq(14, '271', 'Coal plays an important role in industrialisation process because:',
  ['It is the main source of energy.', 'More than 60% of commercial energy is obtained from coal.', 'It is used as basic raw material in iron and steel industry.', 'All of the above'], 3,
  { explanation: 'Coal is the main source of commercial energy in India, historically supplying more than half of it, and coking coal is a basic raw material in the iron and steel industry.' }));

items.push(mcq(15, '271', 'Anthracite variety of coal is found in:',
  ['Jammu and Kashmir', 'Maharashtra', 'Jharkhand', 'West Bengal'], 0,
  { explanation: 'Anthracite is the best variety of coal. It contains about 80 to 90 per cent of carbon and is found in Jammu and Kashmir.' }));

items.push(mcq(16, '271', 'Peat variety of coal is found in:',
  ['Jammu and Kashmir', 'Bihar', 'Jharkhand', 'Maharashtra'], 1,
  { explanation: 'Peat is the lowest variety of coal and it contains 40% carbon. It is found in Bihar.' }));

items.push(mcq(17, '271', 'The demand for petrol and petroleum products are increasing because:',
  ['It is the major source of commercial energy.', 'Increased pace of industrialisation in South Asian countries.', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'Petrol and petroleum products remain a major source of commercial energy, and increasing industrialisation across South Asia (including India) drives rising demand.' }));

items.push(mcq(18, '271', 'Which region (state) is the largest producer of petroleum in India?',
  ['Mumbai High', 'Guwahati', 'Kerala', 'Gujarat'], 0,
  { explanation: 'Mumbai High (Maharashtra) is the largest producer of mineral oil. It produces more than 60% of the total production in India.' }));

items.push(mcq(19, '271', 'The oil obtained from Mumbai High is refined at:',
  ['Jamnagar', 'Trombay', 'Guwahati', 'None of these'], 1,
  { explanation: 'The oil obtained from Mumbai High is refined mainly at Trombay (BPCL Refinery) and Mumbai (HPCL Refinery).' }));

items.push(mcq(20, '271', 'The agency which explores mineral oil in India is:',
  ['Steel Authority of India Limited (SAIL)', 'National Thermal Power Corporation Limited (NTPC)', 'Oil and Natural Gas Corporation (ONGC)', 'None of the above'], 2,
  { explanation: 'ONGC is involved in exploring and exploiting mineral oil in India. ONGC was founded on 14 August 1956.' }));

items.push(mcq(21, '272', 'Which of the following oil fields is located in Assam?',
  ['Naharkatia', 'Ankleshwar', 'Kalol', 'None of these'], 0,
  { explanation: 'Major oil fields of India are as follows: Assam - Digboi and Naharkatia; Gujarat - Ankleshwar and Kalol.' }));

items.push(mcq(22, '272', 'Which is the oldest oil field of India?',
  ['Digboi', 'Ankaleshwar', 'Naharkatia', 'None of these'], 0,
  { explanation: 'Digboi and Naharkatia are two oil fields in Assam, but Digboi is the oldest oil field in India.' }));

items.push(mcq(23, '272', '______ is an offshore oil field of India.',
  ['Mumbai High', 'Bassein', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'Mumbai High: one of the prominent offshore oil fields of India, located in the Arabian Sea off the coast of Mumbai. Bassein: another offshore oil and gas field located in the Arabian Sea off the coast of Maharashtra, India.' }));

items.push(mcq(24, '272', 'The by-products derived from coal is:',
  ['Coke', 'Coal tar', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'Coal tar and coke both are by-product obtained from coal.' }));

items.push(mcq(25, '272', 'Which of the following is a coastal oil refinery?',
  ['Hindustan Petroleum Corporation Limited', 'Indian Oil Corporation Limited', 'Both (a) and (b)', 'Neither (a) nor (b)'], 3,
  { explanation: 'DISCLOSED NOTE: the source explains "Mumbai and Kochi are two coastal oil refineries while Indian Oil Corporation Limited and Hindustan Petroleum Corporation Limited are two inland oil refineries." This framing conflates refinery-operating companies with refinery locations, and is factually shaky in places: HPCL itself operates a refinery in Mumbai (a coastal city), and IOCL operates the coastal Paradip Refinery in Odisha, both complicating a blanket "HPCL/IOCL = inland" claim. Kept as printed since the item is testing recall of this book’s own simplified classification, and no clearly better-supported option exists among the four given under that same premise.' }));

items.push(mcq(26, '272', 'The variety of coal which is used for domestic purposes:',
  ['Bituminous', 'Peat', 'Lignite', 'None of these'], 0,
  { explanation: 'Anthracite and Bituminous are two different varieties of coal that are used for domestic purposes because both of these varieties contain high percentages of carbon with a high calorific value.' }));

items.push(mcq(27, '272', 'The oldest oil refinery in the public sector is located in:',
  ['Guwahati', 'Naharkatia', 'Kochi', 'Mumbai'], 0,
  { explanation: 'The oldest oil refinery in the public sector is Guwahati Refinery which is located in the state of Assam.' }));

items.push(mcq(28, '272', '______ coal is mostly used in iron and steel industries.',
  ['Bituminous', 'Peat', 'Lignite', 'Anthracite'], 0,
  { explanation: 'Metallurgical coal is high grade bituminous coal which is widely used in iron and steel industries.' }));

items.push(mcq(29, '273', 'Which of the following clean energy resources is associated with petroleum?',
  ['Biogas', 'Natural gas', 'Hydrogen gas', 'None of these'], 1,
  { explanation: 'Natural gas is a versatile, efficient energy source for electricity, heating and as a raw material in industries, favoured for its cost-effectiveness and low emissions, and is commonly found associated with petroleum deposits.' }));

items.push(mcq(30, '273', 'Mineral oil is used:',
  ['as a fuel', 'as a lubricating agent', 'as a raw material', 'all of these'], 3,
  { explanation: 'Mineral oil is a type of oil which is extracted from petroleum. It is known as base oil. It is used as a fuel. It provides the most important lubricating agents and is used as raw material for various petrochemical products.' }));

items.push(mcq(31, '273', 'In India, nearly three fourth of the coal deposits are located in:',
  ['Damodar river valley', 'Ganga river valley', 'Both (a) and (b)', 'Neither (a) nor (b)'], 0,
  { explanation: 'Nearly three-fourth of the coal deposits are located in the Damodar river valley. The places are Raniganj, Jharia, Giridih, Bokaro and Karanpura. The other river valleys associated with coal deposits are the Godavari, Mahanadi, Son and Wardha. The coal fields of Singareni in Andhra Pradesh, Talcher in Odisha and Chanda in Maharashtra are also very famous.' }));

items.push(mcq(32, '273', 'Copper is alloyed with Zinc to form:',
  ['Stainless steel', 'Brass', 'Bronze', 'Aluminium'], 1,
  { explanation: 'Copper is alloyed with Zinc to form Brass.' }));

items.push(mcq(33, '273', 'Hirakud dam is based on which of the following rivers?',
  ['River Godavari', 'River Mahanadi', 'River Krishna', 'River Narmada'], 1,
  { explanation: 'Hirakud dam is based on River Mahanadi, in Odisha.' }));

items.push(mcq(34, '273', 'Which type of coal is called an industrial coal?',
  ['Peat', 'Lignite', 'Bituminous', 'Anthracite'], 2,
  { explanation: 'Bituminous coal is known as industrial coal. It is relatively soft coal with high carbon content and is widely used as a fuel in industries for power generation and heating.' }));

items.push(mcq(35, '273', 'Bauxite is the ore of:',
  ['Aluminium', 'Copper', 'Manganese', 'Iron'], 0,
  { explanation: 'Aluminium is extracted from bauxite through a refining process known as the Bayer process, which involves extracting aluminium oxide (alumina) from bauxite and then reducing alumina to aluminium metal in an electrolytic process.' }));

items.push(mcq(36, '273', 'Identify the source of energy that leads to pollution:',
  ['Tidal energy', 'Wind energy', 'Natural gas', 'Geo-thermal energy'], 2,
  { explanation: 'Although natural gas is cleaner compared to coal and oil, it is still a fossil fuel. Burning natural gas releases carbon dioxide (CO2) and methane (CH4), both of which are greenhouse gases contributing to air pollution and climate change — unlike the other three genuinely renewable, non-conventional sources listed here.' }));

items.push(mcq(37, '274', 'Which of the following is the CORRECT set of non-conventional energy sources?',
  ['Solar energy + Natural gas + Wind energy', 'Tidal energy + Biogas + Geothermal energy', 'Wind energy + Nuclear energy + Petroleum', 'Coal + Tidal energy + Hydel power'], 1,
  { explanation: 'Non-conventional energy sources, also known as renewable energy sources, include energy sources that are replenished naturally and have a lower environmental impact. Tidal energy, biogas and geothermal energy are examples of non-conventional energy sources.' }));

items.push(mcq(38, '274', 'Parvati Valley and Puga Valley are two experimental power projects of ______ in India.',
  ['Geothermal energy', 'Wind energy', 'Tidal energy', 'Solar energy'], 0,
  { explanation: 'Parvati Valley and Puga Valley are two locations in India where experimental geothermal energy projects are being developed.' }));

items.push(mcq(39, '274', 'What is the main purpose of constructing multipurpose river valley projects in India?',
  ['Only to generate hydroelectric power', 'Only for irrigation purposes', 'For flood control, irrigation and hydroelectric power', 'Only to provide drinking water'], 2,
  { explanation: 'Multipurpose river valley projects in India are designed to serve multiple functions, including flood control, irrigation, hydroelectric power generation, and sometimes providing drinking water. These projects help in the integrated development of water resources.' }));

items.push(mcq(40, '274', 'Which of the following may be used for generating nuclear energy?',
  ['Biomass', 'Tides', 'Earth heat', 'Thorium'], 3,
  { explanation: "Thorium is a radioactive element that can be used as a fuel in nuclear reactors to generate nuclear energy (India's long-term nuclear programme includes a thorium-based stage, given the country's large thorium reserves). Biomass, tides, and Earth's heat (geothermal energy) are sources for different types of renewable energy but are not used for generating nuclear energy." }));

items.push(mcq(41, '274', 'Which one of the following is NOT an advantage of solar energy?',
  ['It is a renewable energy source.', 'It does not cause any pollution.', 'It is a relatively constant source of energy and available all the time.', 'It can be installed on a very small scale on individual basis.'], 2,
  { explanation: 'Solar energy is renewable and does not cause pollution, and it can be installed on a small scale. However, it is not a constant source of energy as it depends on sunlight, which is not available all the time (e.g., during night time or cloudy days).' }));

items.push({
  kind: 'mcq',
  sourceQuestionNumber: '42',
  sourcePage: '274',
  text: 'What is the best quality of iron ore?',
  options: ['Haematite', 'Limonite', 'Magnetite', 'Manganese'],
  correct: 2,
  diagramStatus: 'not_applicable',
  answerStatus: 'needs_review',
  answerKeyRef: 'printed Ans., p.274, item 42',
  explanation: 'CORRECTED FROM PRINTED KEY: the source prints "Ans. (a) Haematite," but its own explanation states "Magnetite is the best quality of iron ore, containing 72% pure iron" — which is option (c), not (a), a letter/text mismatch. This also matches real mineralogy: Magnetite (~72% Fe) has a marginally higher iron content than Haematite (~70% Fe), even though Haematite is India\'s more abundant, economically dominant iron ore. Corrected to (c); the printed key\'s letter choice (a) is disclosed as the defect.',
});

items.push(mcq(43, '275', 'Which mineral is used to make iron and steel?',
  ['Manganese', 'Copper', 'Iron ore', 'Coal'], 0,
  { explanation: 'Manganese is an essential mineral for making iron and steel, with nearly 9 kg required for manufacturing one tonne of steel.' }));

items.push(mcq(44, '275', 'What is the main use of copper?',
  ['Electrical machinery', 'Steel production', 'Paints and pigments', 'Agriculture'], 0,
  { explanation: 'Copper is highly ductile and has high thermal and electrical conductivity, making it widely used in electrical machinery, automobile industry, and telephones.' }));

items.push(mcq(45, '275', 'Where is the largest reserve of coal found in India?',
  ['Jharkhand', 'Chhattisgarh', 'Odisha', 'Madhya Pradesh'], 0,
  { explanation: 'Jharkhand has the largest reserves of coal (33.53%) in India, with main coalfields in Jharia, Bokaro, and Karanpura.' }));

items.push(mcq(46, '275', 'What is the source of solar energy?',
  ['Sun', 'Wind', 'Water', 'Earth'], 0,
  { explanation: "The Sun is the primary source of energy, providing enormous amounts of energy in the form of solar radiation reaching the Earth's surface." }));

items.push(mcq(47, '275', 'What is biogas used for?',
  ['Domestic fuel and lighting', 'Industrial production', 'Transportation', 'Agriculture'], 0,
  { explanation: 'Biogas (or gobar gas) is used as a domestic fuel and for lighting streets and homes, especially in rural areas.' }));

items.push(mcq(48, '275', 'What is the purpose of the Bhakra Nangal Dam?',
  ['Generation of hydroelectric power', 'Irrigation', 'Flood control', 'All of these'], 3,
  { explanation: 'The main purpose of the Bhakra Nangal Dam is generation of hydroelectric power, but it also provides other benefits like flood control, soil conservation, afforestation, and increase in food and cash crop production.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Geography',
  chapterName: 'Mineral and Energy Resources',
  chapterOrder: 8,
  label: 'ch8-9-mineral-energy-agriculture.pdf (Chapter 8 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
