// ICSE Class 10 Geography — Chapter 7: "Water Resources". Uploaded
// 2026-09-17 as part of the combined chap_4-7.pdf, archived via
// archive-icse-geography-ch4-7.js -> source_files.id 115 (this one
// physical file covers Chapters 4, 5, 6 and 7 — the first Geography
// upload; see that script's header comment). This is the LAST chapter of
// this upload — the final scanned page (268) bleeds through with the
// start of the next chapter, "Mineral Resources" (Chapter 8), too little
// content to ingest now, noted for the next upload.
//
// Verification method: every printed answer checked against documented
// Indian irrigation/water-resource geography — irrigation methods (wells,
// canals, tube wells, tank, sprinkler, drip), rainwater harvesting
// techniques, and groundwater concepts.
//
// Genuine defect, needs_review and CORRECTED — item 23: a letter/text
// mismatch (the same defect pattern seen elsewhere in this project, e.g.
// ICSE History Ch13 item 36). The item asks what the artificial
// application of water to soil for growing crops is called, with options
// (a) Rainwater harvesting (b) Eutrophication (c) Evaporation (d)
// Irrigation. The printed key reads "Ans. (b) Irrigation" — but option
// (b) is actually "Eutrophication," not "Irrigation"; "Irrigation" is
// option (d). "Irrigation" is unambiguously the correct term being asked
// for (and is exactly the printed explanation's own definition), so
// corrected to (d), with the letter/text mismatch disclosed.
//
// Disclosed (non-needs_review) caveat — item 29: the printed key and its
// own explanation both claim sprinkler irrigation involves "no loss of
// water by seepage or evaporation... as water is supplied through pipes
// and not exposed to the sun." This overstates the case: sprinkler
// systems spray water through the air as droplets before it lands, which
// is genuinely subject to evaporation loss (a well-documented drawback,
// especially in windy/hot conditions — exactly the arid/semi-arid regions
// item 5 of this same chapter cites for sprinkler use) — this is why drip
// irrigation, not sprinkler, is described in item 24 as "the most
// efficient" method for water conservation. Kept as printed since no
// better-supported option exists among the four given (the other three —
// high initial cost, wind-sensitivity, high maintenance — are clearly
// worse fits for "main advantage"), with the overstatement disclosed.
//
// All other 28 items independently verified clean against documented
// irrigation and water-resource geography.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 115;

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

items.push(mcq(1, '263', 'The oldest and the cheapest means of irrigation is:',
  ['Tube wells', 'Sprinklers', 'Unlined and lined wells', 'Drip irrigation'], 2,
  { explanation: 'Unlined wells also known as "kachha well" such a well is dug by the farmer near the field. Lined well or pucca well is one which is lined with bricks or stones.' }));

items.push(mcq(2, '263', 'Tube wells are popular in India because:',
  ['They can be dug anywhere.', 'Large area can be irrigated if cheap electricity made available.', 'They need a network of channels to irrigate the fields.', 'They saturate the soil and make it swampy.'], 1,
  { explanation: 'Tube wells are popular in India because they can irrigate large areas efficiently if cheap electricity is available to power the pumps. Tube wells can draw groundwater from significant depths, providing a reliable water source for irrigation even in areas where surface water sources are limited or inconsistent. The availability of affordable electricity makes it economically feasible to operate these wells, thereby supporting extensive agricultural activities and improving crop yields.' }));

items.push(mcq(3, '263', 'Canal irrigation is popular in the Northern Plains:',
  ['These plains have perennial rivers and the land is soft enough for canals to be constructed from rivers to the fields.', 'These plains a very rocky terrain.', 'The rivers are seasonal and flooded during monsoon.', 'There are many rapids and waterfalls.'], 0,
  { explanation: 'The Northern Plains are fed by perennial Himalayan rivers and their soft alluvial soil is easily dug for canals, which is why extensive canal-irrigation networks (Punjab, Haryana, Uttar Pradesh) developed there.' }));

items.push(mcq(4, '263', 'The most important measure the government should adopt to handle water crisis:',
  ['Watershed development project called Haryali.', 'Dig more tube wells and bore wells.', 'Start development of infrastructure projects in catchment areas.', 'Supply water to every house.'], 0,
  { explanation: 'Haryali is a watershed development Project which aim to enable rural population to conserve water for drinking, irrigation, fisheries and afforestation.' }));

items.push(mcq(5, '263', 'Sprinkler irrigation is practiced in arid and semi-arid regions:',
  ['It is cheap and easy to install.', 'It reduces loss of water due to evaporation and seepage.', 'It can be used for all types of crops.', 'It requires simple machinery.'], 1,
  { explanation: 'Sprinkler irrigation is suitable for almost all types of soil because the doses of water, application rates and time adaptable to the needs of plants can be easily provided through this method, which also reduces water loss due to evaporation and seepage compared to conventional flood irrigation.' }));

items.push(mcq(6, '264', "Canal irrigation has enabled Punjab and Haryana to be called the 'granary of the country' because:",
  ['The land is rocky and has seasonal rivers flowing.', 'It receives heavy rainfall during monsoon season and so the canals are all inundated.', 'There is flooding of the Sutlej-Beas rivers during monsoon.', 'It has canals coming from the Bhakra Nangal Dam which provides water throughout the year.'], 3,
  { explanation: 'Canal irrigation is popular in the Northern Plains because it has canals coming from the Bhakra Nangal Dam (on the Sutlej), which provides water throughout the year, supporting Punjab and Haryana’s reputation as India’s "granary."' }));

items.push(mcq(7, '264', 'Drip irrigation is the most advanced and efficient method of irrigation:',
  ['It allows the farmer to customise an irrigation programme most beneficial to the crop.', 'It occupies large fertile area.', 'It is an expensive method of irrigation.', 'It waterlogs the fields and results in gradual build-up of excessive salts.'], 0,
  { explanation: 'Some advantages of drip irrigation are: fertiliser and nutrient losses are minimised due to localised application and also reduces the leaching process; water application efficiency is high, which allows the farmer to customise an irrigation programme; soil erosion is minimised; moisture in the root zone can be maintained.' }));

items.push(mcq(8, '264', 'The main drawback of conventional method of irrigation:',
  ['Optimum utilisation of water by irrigation.', 'Reduces seepage and evaporation.', 'Subject to cyclic changes of flooding and water stress situations resulting in poor yield.', 'Very good water management.'], 2,
  { explanation: 'Some drawback of convention irrigation system are: uneven distribution of water; subject to cyclic changes of flooding and water stress situation; water logging is another issue in uneven land.' }));

items.push(mcq(9, '264', 'Rainwater harvesting systems practiced in the Deccan Plateau:',
  ['Khatri', 'Korambu', 'Surangam', 'Bhandaras and Kere'], 3,
  { explanation: 'Bhandaras rainwater harvesting system is practiced in Maharashtra and Kere is practiced in Karnataka — both traditional systems of the Deccan Plateau region.' }));

items.push(mcq(10, '264', 'Roof top rainwater harvesting is a:',
  ['Process in which rainwater falling on a roof is diverted through drain-pipes to the storage container.', 'Process in which rainwater flowing through drains is collected in a tank or lake.', 'Process in which rainwater falling in catchment areas is collected in reservoirs.', 'Process in which rainwater is collected in pits and trenches to recharge underground water table.'], 0,
  { explanation: 'Roof top rainwater harvesting involves collecting rainwater that falls on the roof of a building and channeling it through drain-pipes into a storage container or tank. This method helps in conserving water, reducing runoff, and providing a supplementary water source for various uses. It is a practical and efficient way to capture and utilise rainwater, especially in areas facing water scarcity.' }));

items.push(mcq(11, '265', 'Which of the following is not a reason for water conservation?',
  ['71% of earth is covered by water.', 'There is an increase in demand due to increase in population, irrigation and industrialisation.', 'Loss of vegetation causes reduction in rainfall resulting in drought.', 'The water resources are polluted.'], 0,
  { explanation: 'Although 71% of the earth is covered by water, most of it is saline ocean water, unusable directly for drinking, irrigation or industry — so this fact, while true, is not itself a reason FOR water conservation (if anything, it highlights why fresh water is scarce despite that abundance). The other three options are genuine drivers of water conservation need.' }));

items.push(mcq(12, '265', '"Without irrigation, development of agriculture is difficult in India". Which of the following is not true regarding this statement?',
  ['Increase in demand of food and cash crops.', 'Use of high yielding seeds.', 'Crops like rice and sugarcane need more water.', 'India receives rainfall throughout the year.'], 3,
  { explanation: 'India receives rainfall from June to September, i.e., four months. Thus irrigation is necessary for the production of crop, etc. during the rest of the eight months — so the claim that "India receives rainfall throughout the year" is factually false, correctly identified as the untrue statement.' }));

items.push(mcq(13, '265', 'Which of the following is not a rainwater harvesting activity?',
  ['Harvesting of surface and ground water.', 'Harvesting crops with the help of water.', 'Prevention of loss of water due to evaporation and seepage.', 'Efficient utilisation of water.'], 1,
  { explanation: '"Harvesting crops with the help of water" describes ordinary irrigated agriculture, not a rainwater harvesting activity; the other three are genuine rainwater harvesting activities.' }));

items.push(mcq(14, '265', 'Which of the following is incorrect about water harvesting in India?',
  ['Collecting water from rooftops and storing it in tanks built in their courtyards.', 'Collecting water from sea and storing it in tanks.', 'Harvesting rainwater runoff by capturing water from swollen streams during monsoon.', 'Harvesting water from flooded rivers.'], 1,
  { explanation: 'This statement is incorrect because water harvesting typically involves collecting and storing freshwater from sources like rainwater, rivers, and streams. Collecting seawater and storing it in tanks is not considered water harvesting because seawater is saline and requires desalination before it can be used for most purposes. Water harvesting focuses on capturing and utilising freshwater resources to ensure a sustainable supply for drinking, irrigation, and other uses.' }));

items.push(mcq(15, '265', 'Irrigation in India is important because:',
  ['India exports most of its crops.', 'The rainfall in India is uncertain and is unevenly distributed.', 'The soil found in the country is the same all over.', 'India has attained self-sufficiency in agriculture.'], 1,
  { explanation: 'Irrigation in India is important because the rainfall is uncertain and is unevenly distributed across the country. This variability in rainfall patterns necessitates irrigation to ensure a stable water supply for agriculture throughout the year. Dependence on monsoon rains alone would make Indian agriculture vulnerable to droughts and crop failures in many regions. Therefore, irrigation helps mitigate the risks associated with uncertain rainfall, ensuring consistent agricultural production.' }));

items.push(mcq(16, '266', 'The two types of canal irrigation are:',
  ['Channels and trenches.', 'Unlined and lined.', 'Inundation and perennial.', 'Elongated and wide.'], 2,
  { explanation: 'Canal irrigation is classified into two types: inundation canals (which draw water only during high-flow/flood periods) and perennial canals (fed year-round from a dam or barrage).' }));

items.push(mcq(17, '266', 'Tank irrigation is an important method of irrigation in Karnataka because:',
  ['Most of Karnataka is fed by perennial rivers.', 'Karnataka is a plain land and the rivers are fed by glaciers.', 'Karnataka being in the Deccan region, has natural depressions and hard sub surface.', 'Karnataka has large tracts of land covered in sand.'], 2,
  { explanation: 'Tank irrigation is an important method of irrigation in Karnataka because Karnataka, located in the Deccan region, has natural depressions (tanks) and a hard subsurface (laterite soil). These natural depressions can be easily converted into tanks for storing rainwater, which is essential for agriculture in areas where perennial rivers may not be available or reliable. Additionally, the hard subsurface ensures that these tanks can hold water effectively without excessive seepage, making tank irrigation a practical and efficient method of irrigation in Karnataka.' }));

items.push(mcq(18, '266', 'Which of the following is a ground water source?',
  ['Pond', 'Lake', 'Spring', 'Aquifer'], 2,
  { explanation: 'A spring is a groundwater source. Springs occur where groundwater naturally flows out of the ground and collects in pools or flows overland as a small stream. Springs are important sources of freshwater and are often used for drinking water supply and irrigation in many areas.' }));

items.push(mcq(19, '266', 'Which of the following may be used for the recharging of underground water?',
  ['Planting of shelter belt', 'Gullies and ravines', 'Percolation pit', 'Commercial farming'], 2,
  { explanation: 'Percolation pits are a method used for recharging underground water. They are designed to collect and infiltrate rainwater into the ground, replenishing the groundwater reservoir.' }));

items.push(mcq(20, '266', 'Which means of irrigation can be developed with minimum expenditure? [Board Question]',
  ['Tube well', 'Canal', 'Well', 'Drip irrigation'], 2,
  { explanation: 'Wells can be developed with minimum expenditure compared to other means of irrigation. Wells tap into groundwater sources and are relatively simple and inexpensive to construct, especially in areas where groundwater is accessible at shallow depths. They provide a cost-effective way to irrigate agricultural land without the need for extensive infrastructure or ongoing operational costs associated with technologies like tube wells, canals, or drip irrigation systems.' }));

items.push(mcq(21, '266', 'Which of the following is the primary source of fresh water in India?',
  ['Oceans', 'Rivers', 'Lakes', 'Glaciers'], 1,
  { explanation: 'Rivers are the primary source of fresh water in India. They are crucial for irrigation, drinking water, and other domestic and industrial uses.' }));

items.push(mcq(22, '267', 'Which among the following is a primitive method of irrigation?',
  ['Sprinkler irrigation', 'Bamboo irrigation', 'Tank irrigation', 'Drip irrigation'], 2,
  { explanation: 'Tank irrigation is one of the oldest and most primitive methods of irrigation. It involves storing rainwater in tanks (small reservoirs) and using it for irrigation.' }));

items.push({
  kind: 'mcq',
  sourceQuestionNumber: '23',
  sourcePage: '267',
  text: 'What is the artificial application of water to the soil for growing crops called?',
  options: ['Rainwater harvesting', 'Eutrophication', 'Evaporation', 'Irrigation'],
  correct: 3,
  diagramStatus: 'not_applicable',
  answerStatus: 'needs_review',
  answerKeyRef: 'printed Ans., p.267, item 23',
  explanation: 'CORRECTED FROM PRINTED KEY: the source prints "Ans. (b) Irrigation," but option (b) is actually "Eutrophication," not "Irrigation" — a letter/text mismatch. "Irrigation" is option (d), and is unambiguously the term being defined (matching the item\'s own explanation: "Irrigation is the artificial application of water to the soil for assisting the growing of crops..."). Corrected to (d); the printed key\'s letter choice (b) is disclosed as the defect.',
});

items.push(mcq(24, '267', 'Which irrigation method is most efficient in terms of water conservation?',
  ['Flood irrigation', 'Drip irrigation', 'Sprinkler irrigation', 'Canal irrigation'], 1,
  { explanation: 'Drip irrigation is the most efficient method of irrigation in terms of water conservation. It delivers water directly to the roots of plants, minimising water loss due to evaporation and runoff and ensuring that water is used effectively.' }));

items.push(mcq(25, '267', 'What is the main advantage of using rainwater harvesting systems?',
  ['Increases groundwater depletion', 'Reduces dependency on rivers and lakes', 'Leads to soil erosion', 'Reduces rainfall'], 1,
  { explanation: 'Rainwater harvesting systems collect and store rainwater for later use, reducing dependency on traditional water sources like rivers and lakes. This practice helps to conserve water, especially in areas with limited water resources, and can also contribute to groundwater recharge.' }));

items.push(mcq(26, '267', 'What is the primary factor that affects the distribution of groundwater in India?',
  ['Topography', 'Subsurface geology', 'Climate', 'All of these'], 3,
  { explanation: 'The distribution of groundwater in India is affected by a combination of factors, including topography, subsurface geology, and climate.' }));

items.push(mcq(27, '267', 'Why is irrigation important in India?',
  ['To support industrial development', 'To support agricultural development', 'To support urbanisation', 'To support tourism'], 1,
  { explanation: "Irrigation is important in India because it supports agricultural development, which is crucial for the country's food security and economy." }));

items.push(mcq(28, '268', 'What is the main objective of rainwater harvesting?',
  ['To reduce soil erosion', 'To improve groundwater quality', 'To recharge groundwater and raise its level', 'To reduce flooding'], 2,
  { explanation: 'The main objective of rainwater harvesting is to recharge groundwater and raise its level, which helps improve water availability during dry seasons.' }));

items.push(mcq(29, '268', 'What is the main advantage of sprinkler irrigation?',
  ['High initial cost', 'Water application efficiency is not affected by wind direction', 'No loss of water by seepage or evaporation', 'High maintenance requirement'], 2,
  { explanation: 'DISCLOSED CAVEAT: the source states "Sprinkler irrigation does not involve any loss of water by seepage or evaporation, as water is supplied through pipes and not exposed to the sun." This overstates the case — sprinklers spray water through the air as droplets before it lands, which is genuinely subject to evaporation loss, especially in windy or hot conditions (a well-documented drawback, and part of why item 24 of this chapter identifies drip, not sprinkler, as the most water-efficient method). Kept as printed since it remains the best-supported option among the four given (the alternatives — high cost, wind-sensitivity, high maintenance — are clearly worse fits), with the overstatement disclosed for transparency.' }));

items.push(mcq(30, '268', 'What is the main characteristic of drip irrigation?',
  ['Water is supplied through hoses', 'Water is taken directly to the roots of the plants', 'Water is applied in the form of a spray', 'Water is supplied through canals'], 1,
  { explanation: 'In drip irrigation, water is taken directly to the roots of the plants or trees through a plastic tube with small holes, providing a steady supply of water.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Geography',
  chapterName: 'Water Resources',
  chapterOrder: 7,
  label: 'ch4-7-climate-soil-vegetation-water.pdf (Chapter 7 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
