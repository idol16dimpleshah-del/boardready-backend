// ICSE Class 10 Geography — Chapter 5: "Soil Resources". Uploaded
// 2026-09-17 as part of the combined chap_4-7.pdf, archived via
// archive-icse-geography-ch4-7.js -> source_files.id 115 (this one
// physical file covers Chapters 4, 5, 6 and 7 — the first Geography
// upload; see that script's header comment).
//
// Verification method: every printed answer checked against documented
// Indian pedology/soil geography — soil types (alluvial, black/regur,
// red, laterite), their formation conditions, crop suitability, and
// erosion/conservation concepts.
//
// RESULT: a clean chapter. All 28 printed answers are consistent with
// documented soil-science facts and internally consistent with their own
// explanations, including item 11's chronological-style true/false set
// (independently re-verified: alluvial soil is genuinely rich in potash
// but poor in phosphorus, so statement III as worded is correctly
// excluded from the key) and item 12's similar internal check (red soil's
// low water retention and low nitrogen content are correctly identified
// as the "not true" characteristics). No needs_review items. One minor
// disclosed note, item 24: the three-substance "silica + clay + chalk"
// composition given is a simplified, book-specific framing of soil's
// inorganic mineral content, not a complete description of soil
// composition (which also includes organic matter/humus, water and air)
// — doesn't affect the item's own internal consistency, since it matches
// this chapter's own stated definition.
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

items.push(mcq(1, '253', 'Which of the following crops is/are suitable for growing on black soil?',
  ['Cotton', 'Wheat', 'Gram', 'All of these'], 0,
  { explanation: 'Black soil crops are cotton cultivation, cereals, oilseeds, citrus fruits and vegetables.' }));

items.push(mcq(2, '253', 'Choose the correct statement regarding the characteristics of alluvial soil.',
  ['The soil is immature and has weak profile due to its recent origin.', 'The soil is porous.', 'This soil is constantly replenished by the recurrent floods.', 'All of the above'], 3,
  { explanation: 'Alluvial soil, as newly deposited river-borne sediment, has a weak, poorly-developed profile due to its recent geological origin, is porous, and is constantly replenished by recurrent flooding, particularly in the active floodplains (Khadar) of North India.' }));

items.push(mcq(3, '253', 'Which of the following is a characteristics of black soil?',
  ['It has less water retention capacity', 'It is not suitable for growing cotton', 'It gets very sticky in the rainy season', 'It has high percentage of phosphate and nitrogen'], 2,
  { explanation: 'Due to high clay content, black soil develops wide cracks during the dry season and becomes sticky when wet.' }));

items.push(mcq(4, '253', 'Favourable conditions for the formation of laterite soil are:',
  ['High temperature and heavy rainfall', 'Low temperature and heavy rainfall', 'Low temperature and low rainfall', 'High temperature and low rainfall'], 0,
  { explanation: 'Laterite soil is formed by intense leaching owing to high temperature and heavy tropical rains. These soils are usually found under condition of high temperature and heavy rainfall with alternate wet and dry periods.' }));

items.push(mcq(5, '253', 'The causes of desertification are:',
  ['Overgrazing', 'Over cultivation', 'Deforestation', 'All of these'], 3,
  { explanation: 'Overgrazing, over cultivation and deforestation are all recognised causes of desertification.' }));

items.push(mcq(6, '253', 'Which of the following is a primary cause of soil degradation in irrigated cultivated land in India?',
  ['Silting of land', 'Gully erosion', 'Alkalisation and salinity of soil', 'Wind erosion'], 2,
  { explanation: 'Alkalisation and salinity of soil is a condition in which accumulation of soluble salts in soil are found, and causes soil degradation in irrigated cultivated land — a well-documented issue in over-irrigated canal command areas of India such as Punjab and western Uttar Pradesh.' }));

items.push(mcq(7, '254', '______ soil has higher iron content and found in Manipur and Mizoram.',
  ['Laterite', 'Red', 'Black', 'Alluvial'], 1,
  { explanation: 'Red soil is formed due to the disintegration of granite, gneisses and metamorphic rock and has higher iron oxides content. Besides the peninsular red-soil belt, red soils also occur on crystalline rocks in parts of the north-eastern hill states, including Manipur and Mizoram.' }));

items.push(mcq(8, '254', 'Black soil is also known as ______.',
  ['Khadar soil', 'Bhangar soil', 'Regur soil', 'All of these'], 2,
  { explanation: 'Regur soil, also known as black soil, is primarily formed from the weathering of volcanic rocks, particularly basalt, found in the Deccan Plateau region of India.' }));

items.push(mcq(9, '254', 'Which of the following crops is/are suitable for growing on laterite soil?',
  ['Cashew nut', 'Wheat', 'Groundnut', 'Potato'], 0,
  { explanation: 'Laterite soil is suitable for coffee, tea, rubber, cashew nut, coconut etc.' }));

items.push(mcq(10, '254', 'Which of the following is not a cause of soil erosion?',
  ['Drainage', 'Deforestation', 'Weathering', 'Grazing'], 2,
  { explanation: 'Weathering is a natural process of disintegration of rock. This leads to the formation of soil rather than erosion.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '11',
  sourcePage: '254',
  text: 'Which of the following is/are true in respect of alluvial soil?\nI. Generally confined to river basins\nII. It has been deposited by rivers\nIII. It is rich in phosphorus and poor in potash\nIV. It is the most fertile soil',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.254, item 11',
  parts: [
    {
      text: 'Choose the correct option.',
      options: ['Only I', 'III and IV', 'I, II and IV', 'I, II and III'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'Independently re-verified: alluvial soil is genuinely confined to river basins (I, true) and deposited by rivers (II, true), and is indeed India’s most fertile soil type (IV, true) — but it is actually rich in potash and poor in phosphorus, the reverse of statement III as worded, so III is correctly excluded from the key. This matches the source’s own explanation ("Alluvial soil rich in potash but poor in phosphorus"), and the printed answer (c) I, II and IV is both internally consistent and factually correct.',
});

items.push({
  kind: 'case',
  sourceQuestionNumber: '12',
  sourcePage: '254',
  text: 'Which of the following is/are not the characteristics of red soil?\nI. It is derived from weathering of old crystalline and metamorphic rocks\nII. It contains iron oxides\nIII. It has high water retention capacity\nIV. It has high nitrogen content',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.254, item 12',
  parts: [
    {
      text: 'Choose the correct option.',
      options: ['II and III', 'Only III', 'Only IV', 'III and IV'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: 'Independently re-verified: red soil genuinely is derived from weathering of old crystalline and metamorphic rocks (I, true) and does contain iron oxides, which give it its colour (II, true) — but it actually has LOW water retention capacity (III is false as worded) and is deficient in nitrogen, phosphorus and humus (IV is false as worded). So III and IV are correctly identified as the statements that are NOT true characteristics of red soil, matching the printed answer (d) and documented soil science.',
});

items.push(mcq(13, '254', 'Which of the following soils is formed under typical monsoonal conditions?',
  ['Black soil', 'Red soil', 'Laterite soil', 'None of these'], 2,
  { explanation: 'Typical monsoonal condition means high temperature and heavy rainfall which are more suitable for the formation of laterite soil.' }));

items.push(mcq(14, '255', 'Which of the following soils has a marked capacity to retain water?',
  ['Desert soil', 'Laterite soil', 'Red soil', 'Regur soil'], 3,
  { explanation: 'Black or Regur soil can retain moisture for a long duration, therefore artificial irrigation are less required in these type of soil.' }));

items.push(mcq(15, '255', 'Soil erosion in desert area can be prevented by:',
  ['Strip ploughing', 'Using manure', 'Afforestation', 'Shifting cultivation'], 2,
  { explanation: 'Soil erosion in deserts is primarily because of wind; afforestation is the way to prevent the soil damage among the given options.' }));

items.push(mcq(16, '255', 'The red soil develops a reddish colour due to ______.',
  ['Deforestation and overgrazing', 'The presence of potash and magnesium', 'Tropical monsoon climate', 'A wide diffusion of iron in ancient crystalline and metamorphic rocks'], 3,
  { explanation: 'The red soil develops a reddish colour due to a wide diffusion of iron in ancient crystalline and metamorphic rocks.' }));

items.push(mcq(17, '255', 'The soil which is a mixture of sand, clay and silt is known as ______.',
  ['Desert soil', 'Sandy soil', 'Clayey soil', 'Loamy soil'], 3,
  { explanation: 'Loamy soil is, by definition, a mixture of sand, clay and silt.' }));

items.push(mcq(18, '255', 'Identify the erosion which depicts the uniform removal of soil in thin layers from sloppy lands due to overflow of water and beating action of raindrops.',
  ['Rill erosion', 'Gully erosion', 'Sheet erosion', 'Splash erosion'], 2,
  { explanation: 'It occurs on gentle slope and proceeds with slow removal of a thin layer of soil when vegetion is destroyed.' }));

items.push(mcq(19, '255', 'Choose the correct statement.',
  ['In Odisha, deforestation due to mining has caused severe land degradation.', 'In western Uttar Pradesh, over irrigation is responsible for land degradation due to water-logging which is leading to an increase in the salinity.', 'In Madhya Pradesh, overgrazing is responsible for land degradation.', 'All of the above'], 3,
  { explanation: 'All three statements describe genuine, documented land-degradation issues in these Indian states: mining-driven deforestation in Odisha, waterlogging/salinity from over-irrigation in western Uttar Pradesh, and overgrazing-driven degradation in Madhya Pradesh.' }));

items.push(mcq(20, '255', 'Advantages of organic manure are:',
  ['It binds the soil.', 'It improves the water-holding capacity of soil.', 'Both (a) and (b).', 'It binds the soil but decreases its water retention capacity.'], 2,
  { explanation: 'Organic manure both binds the soil and improves its water-holding capacity.' }));

items.push(mcq(21, '255', 'Which is the most widespread soil of India?',
  ['Red soil', 'Alluvial soil', 'Laterite soil', 'Black soil'], 1,
  { explanation: 'Alluvial soil is the most widespread soil of India. It covers about 40% of the total land area and is primarily found in the extensive river plains and deltas of the country, particularly in the Indo-Gangetic Plain. This soil is formed by the deposition of silt, sand, and clay brought down by rivers, making it extremely fertile and suitable for agriculture. Its widespread presence and high fertility make alluvial soil the most significant and extensive soil type in India.' }));

items.push(mcq(22, '256', 'Feel and consistency of soil is called ______ of the soil.',
  ['Profile', 'Parent rock', 'Texture', 'Nature'], 2,
  { explanation: 'The feel and consistency of soil is referred to as the texture of the soil. It describes the relative proportions of different-sized particles in the soil, such as sand, silt and clay.' }));

items.push(mcq(23, '256', 'Which of the following helps in soil conservation? [Board Question]',
  ['Afforestation', 'Overgrazing', 'Mining', 'Shifting agriculture'], 0,
  { explanation: 'Afforestation helps prevent soil erosion by stabilising the topsoil with root systems and reducing surface run-off, making it an effective soil conservation measure.' }));

items.push(mcq(24, '256', 'Which of the following is the CORRECT set of substances from which the soil is composed?',
  ['Silica + Clay + Chalk', 'Silica + Humus + Nitrogen', 'Clay + Texture + Zinc', 'Chalk + Potash + Silt'], 0,
  { explanation: 'DISCLOSED NOTE: the source states "The soil is composed of three main substances – Silica, Clay and Chalk." This is a simplified, book-specific description of soil’s inorganic mineral content; a fuller scientific description of soil composition would also include organic matter (humus), water and air. Kept as printed since it matches this chapter’s own definition and no clearly better-supported option exists among the four given (the other options mix in items — "Zinc", "Nitrogen" — that are soil nutrients/trace elements rather than bulk structural components).' }));

items.push(mcq(25, '256', 'Due to intensive leaching, ______ lacks in fertility but responds well to manuring and irrigation.',
  ['Red soil', 'Alluvial soil', 'Black soil', 'Laterite soil'], 3,
  { explanation: 'Laterite soil is characterised by intensive leaching due to heavy rainfall, which washes away nutrients leading to low natural fertility. However, it responds well to manuring and irrigation, improving its fertility for agricultural use.' }));

items.push(mcq(26, '256', 'Which of the following may be used for the conserving soil?',
  ['Planting of shelter belts', 'Deforestation', 'Shifting agriculture', 'Overgrazing'], 0,
  { explanation: 'Planting of shelter belts involves growing rows of trees or shrubs to protect soil from wind erosion and maintain the moisture level.' }));

items.push(mcq(27, '256', 'Bhangar and Khadar are the typical types of which of the following soils?',
  ['Black soil', 'Alluvial soil', 'Laterite soil', 'Red soil'], 1,
  { explanation: 'Bhangar and Khadar are two categories of alluvial soil, which is formed by the deposition of sediments carried by rivers and streams — Bhangar being the older, higher terrace deposits and Khadar the newer, flood-renewed deposits of the active floodplain.' }));

items.push(mcq(28, '256', 'What is the removal of topsoil by different agents called?',
  ['Soil conservation', 'Soil profile', 'Soil erosion', 'Soil fertility'], 2,
  { explanation: 'Soil erosion refers to the process of the removal of the top layer of soil (topsoil) by various agents such as water, wind, ice or human activity.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Geography',
  chapterName: 'Soil Resources',
  chapterOrder: 5,
  label: 'ch4-7-climate-soil-vegetation-water.pdf (Chapter 5 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
