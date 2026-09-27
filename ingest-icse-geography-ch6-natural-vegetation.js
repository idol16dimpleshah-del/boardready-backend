// ICSE Class 10 Geography — Chapter 6: "Natural Vegetation of India".
// Uploaded 2026-09-17 as part of the combined chap_4-7.pdf, archived via
// archive-icse-geography-ch4-7.js -> source_files.id 115 (this one
// physical file covers Chapters 4, 5, 6 and 7 — the first Geography
// upload; see that script's header comment).
//
// Verification method: every printed answer checked against documented
// Indian forest/vegetation geography (Champion & Seth-style classification
// as taught at this level) — forest types (tropical evergreen, moist/dry
// deciduous, littoral/mangrove, thorn, mountain), their characteristic
// tree species, and regional distribution.
//
// Genuine defect, needs_review and CORRECTED — item 7: a three-pair
// matching item asks which vegetation-belt/tree pairings are correctly
// matched: (1) Tropical Moist Deciduous: Sandalwood, (2) Tropical Dry
// Deciduous: Sal, (3) Tropical Thorn Forests: Shisham. The printed key
// marks "(b) 1 and 2" as correct. This directly contradicts THIS SAME
// CHAPTER's own item 2 explanation, which states plainly: "Moist
// deciduous forest vegetation includes teak, sol [sal], myrobalan,
// sandalwood, semul, mahua, shisham etc." — i.e. Sal, Sandalwood AND
// Shisham are all classified as Moist Deciduous species by this book's
// own stated definition, matching standard Indian geography curricula
// (e.g. NCERT lists sandalwood among moist deciduous species alongside
// teak and sal). By that classification, pair (1) is correctly matched
// (Sandalwood is indeed Moist Deciduous), but pair (2) is wrong (Sal is
// Moist Deciduous, not Dry Deciduous) and pair (3) is also wrong (Shisham
// is Moist Deciduous, not Thorn Forest — thorn forests are characterised
// by Babool/Acacia/cacti, not Shisham). The internally- and
// factually-consistent answer is therefore "(a) Only 1", which is offered
// verbatim among the same four options. Corrected to (a); discrepancy
// disclosed, cross-referencing item 2.
//
// All other 31 items independently verified clean against documented
// forest geography, including item 20's four-way table-matching item
// (re-checked against items 2 and 24's own species lists) and items 24-32
// covering mountain forests, deforestation/afforestation/reafforestation
// terminology, and forest conservation concepts.
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

items.push(mcq(1, '257', 'The Mangrove forests of Ganga delta are known as:',
  ['Monsoon forests', 'Sunderbans', 'Tropical forests', 'Swamp forests'], 1,
  { explanation: 'Due to the abundance of sundari trees the forested part in Ganga and Brahmaputra delta are entitled as sundarban.' }));

items.push(mcq(2, '257', 'Which of the following is not a species of tropical moist deciduous forests?',
  ['Mahogany', 'Sal', 'Shisham', 'Teak'], 0,
  { explanation: 'Moist deciduous forest vegetation includes teak, sal, myrobalan, sandalwood, semul, mahua, shisham etc. Tropical evergreen forest vegetation are Mahogany, Rosewood, Ebony, Cinchona etc. — so Mahogany belongs to tropical evergreen forest, not moist deciduous.' }));

items.push(mcq(3, '257', 'Tropical desert forests have ______ vegetation. Due to scarcity of rainfall, the trees are stunted with large patches of coarse grasses.',
  ['Alpine', 'Littoral', 'Xerophytic', 'None of these'], 2,
  { explanation: 'Mostly xerophytic types of thorny shrub, scrub, Acacia, Babul, kikas etc are found in tropical desert vegetation zone.' }));

items.push(mcq(4, '257', 'Which one of the following types of forests covers the maximum area in India?',
  ['Tropical rainforest', 'Tropical moist deciduous forest', 'Tropical dry deciduous forest', 'Tropical desert forest'], 1,
  { explanation: 'Tropical moist deciduous forest covers largest area in India, which is followed by tropical dry deciduous forest.' }));

items.push(mcq(5, '257', 'Which of the following forests is grown in waterlogged areas?',
  ['Evergreen forest', 'Deciduous forest', 'Tropical thorn forest', 'Mangrove forest'], 3,
  { explanation: 'Mangrove forest experience tidal inundation from time to time, it results into swamp or water logged condition.' }));

items.push(mcq(6, '257', 'Which of the following areas of India is/are covered by tropical evergreen forests?',
  ['Semi-arid areas of Gujarat', 'Eastern Ghats', 'Western Ghats', 'Madhya Pradesh'], 2,
  { explanation: 'Tropical evergreen forests are found in the western slopes of the western Ghats (parts of Maharastra, Karnataka and Kerala); the north-eastern part of India (Lushai, Khasi, Jayantia and Garo Hills, also known as Assam Hills); the lower slopes of the Himalayas (Terai region); and Andaman Nicobar Island.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '7',
  sourcePage: '258',
  text: 'With reference to the Indian forests, consider the following pairs:\n1. Tropical Moist Deciduous Forests: Sandalwood\n2. Tropical Dry Deciduous Forests: Sal\n3. Tropical Thorn Forests: Shisham',
  diagramStatus: 'not_applicable',
  answerStatus: 'needs_review',
  answerKeyRef: 'printed Ans., p.258, item 7',
  parts: [
    {
      text: 'Which of the pairs given above is/are correctly matched?',
      options: ['Only 1', '1 and 2', '2 and 3', '1, 2 and 3'],
      correct: 0,
      marks: 1,
    },
  ],
  explanation: 'CORRECTED FROM PRINTED KEY (cross-ref. item 2): the source prints "Ans. (b) 1 and 2," but this contradicts this same chapter’s own item 2 explanation, which states "Moist deciduous forest vegetation includes teak, sal, myrobalan, sandalwood, semul, mahua, shisham etc." — i.e. Sal, Sandalwood AND Shisham are ALL Moist Deciduous species by this book’s own classification (matching standard curricula, e.g. NCERT, which also lists sandalwood among moist deciduous species). By that classification: pair 1 (Moist Deciduous: Sandalwood) is correctly matched; pair 2 (Dry Deciduous: Sal) is wrong, since Sal is a Moist Deciduous indicator species, not Dry Deciduous; pair 3 (Thorn Forest: Shisham) is also wrong, since Shisham is a Moist Deciduous riverine species, not a thorn-forest species (thorn forests are characterised by Babool/Acacia/cacti). The internally- and factually-consistent answer is therefore "(a) Only 1," offered verbatim among the same four options. Corrected to (a); the printed key\'s letter choice (b) is disclosed as the defect.',
});

items.push(mcq(8, '258', 'Which of the following words is used to denote species of animals of a particular region?',
  ['Flora', 'Fauna', 'Natural vegetation', 'Vegetation'], 1,
  { explanation: 'Fauna refers to animals of a particular region or period, and flora refers to plants of a particular region or period.' }));

items.push(mcq(9, '258', 'To which one of the following types of vegetations do Sundari trees belong to?',
  ['Tundra', 'Tidal', 'Himalayan', 'Tropical evergreen'], 1,
  { explanation: 'Sundari tree belong to tidal forest and these are very strong, hard and durable wood and commonly used in building boats.' }));

items.push(mcq(10, '258', 'Which parts/regions of India have tropical evergreen forests?',
  ['Deltas of Ganga and Mahanadi', 'Northwestern part of the country', 'Western Ghats and Upper parts of Assam', 'Mountainous areas'], 2,
  { explanation: 'Tropical evergreen forests are found in the Western Ghats and Upper parts of Assam, as well as parts of the north-eastern hill states and the Andaman & Nicobar Islands.' }));

items.push(mcq(11, '258', 'A tropical deciduous tree special to the Deccan Plateau is ______.',
  ['Teak', 'Shisham', 'Sandalwood', 'Sal'], 0,
  { explanation: 'Teak is strongly associated with the deciduous forests of the Deccan Plateau and Central India, giving Madhya Pradesh its reputation as a major teak-producing state.' }));

items.push(mcq(12, '258', 'The most important commercial forests of India are ______.',
  ['Tropical evergreen', 'Mangrove', 'Tropical deciduous', 'Coniferous'], 2,
  { explanation: 'They are highly valuable for commercial purposes because they provide a variety of hardwoods such as teak, sal, sandalwood, and rosewood, which are extensively used in construction, furniture making, and other industries. The economic value of timber from tropical deciduous forests make them the most commercially significant forests in India.' }));

items.push(mcq(13, '258', '______ trees provide hard durable timber for construction purposes and boat making.',
  ['Sundari', 'Deodar', 'Sal', 'Ebony'], 0,
  { explanation: 'Sundari trees provide hard, durable timber which is highly valued for construction purposes and boat making. These trees are primarily found in the mangrove forests of the Sundarbans, located in the coastal region of the Bay of Bengal. Their timber is known for its strength and resistance to water, making it suitable for building boats and other structures that require durable and robust wood.' }));

items.push(mcq(14, '259', 'Open stunted forests with bushes and having long roots and sharp thorns or spines are commonly found in:',
  ['Eastern Odisha', 'North-eastern Tamil Nadu', 'Shivaliks and Terai regions', 'Western Andhra Pradesh'], 3,
  { explanation: 'Open stunted forests with bushes, long roots, and sharp thorns or spines are commonly found in Western Andhra Pradesh. This type of vegetation is characteristic of arid and semi-arid regions, where plants have adapted to dry conditions by developing features like long roots to reach deep water sources and thorns or spines to reduce water loss and protect against herbivores.' }));

items.push(mcq(15, '259', 'Which is the famous animal of the mangrove forests?',
  ['Royal Bengal Tiger', 'Leopard', 'Monkey', 'Lion'], 0,
  { explanation: 'The Royal Bengal Tiger, especially the Sundarbans tiger population, is the iconic animal of India’s mangrove forests.' }));

items.push(mcq(16, '259', 'In which of the following states you will find one horned rhinoceros?',
  ['Madhya Pradesh', 'Kerala', 'Gujarat', 'Assam'], 3,
  { explanation: 'Assam, particularly Kaziranga National Park, is famous for its population of the Indian one-horned rhinoceros.' }));

items.push(mcq(17, '259', 'Cinchona trees are found in the areas of rainfall more than ______.',
  ['50 cm', '100 cm', '70 cm', '150 cm'], 1,
  { explanation: 'Cinchona, grown commercially in areas like the Nilgiris and Darjeeling hills, requires substantial rainfall; this chapter’s own threshold is given as more than 100 cm.' }));

items.push(mcq(18, '259', 'Which type of forest is found mostly in the coastal areas of India?',
  ['Tropical Evergreen Forest', 'Tropical Desert Forest', 'Littoral Forest', 'Tropical Deciduous Forest'], 2,
  { explanation: 'Littoral forests, also known as coastal forests, are primarily found in the coastal areas of India. These forests grow along the coastlines and include mangrove forests, which thrive in saline coastal environments. Littoral forests are adapted to tidal influences and play a crucial role in protecting shorelines from erosion, supporting marine life, and providing timber and other resources. The Sundarbans in West Bengal and the mangroves along the eastern and western coasts of India are prime examples of littoral forests.' }));

items.push(mcq(19, '259', 'Teak and Shisham are the typical trees of which of the following natural vegetation belt?',
  ['Tropical Evergreen', 'Tropical Monsoon', 'Tropical Desert', 'Littoral forest'], 1,
  { explanation: 'Teak and Sheesham are typical trees found in the Tropical Monsoon natural vegetation belt. This vegetation belt is characterised by a distinct wet and dry season and is found in regions with a monsoon climate.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '20',
  sourcePage: '259',
  text: 'Read the table and identify the pair that is correctly matched: [Board Question]\nP: Tropical evergreen — Babool\nQ: Tropical deciduous — Teak\nR: Littoral — Ebony\nS: Mountain forest — Banyan',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.260, item 20',
  parts: [
    {
      text: 'Choose the correct option.',
      options: ['P', 'Q', 'R', 'S'],
      correct: 1,
      marks: 1,
    },
  ],
  explanation: 'Independently re-verified against this chapter’s own species lists (items 2 and 24): Q (Tropical deciduous: Teak) is correct. P is wrong — Babool/Acacia is a thorn-forest species, not tropical evergreen (evergreen forests feature Mahogany, Rosewood, Ebony, Cinchona per item 2). R is wrong — Ebony is itself a tropical evergreen species, not littoral. S is wrong — mountain forests are characterised by conifers like Spruce and Silver Fir (see item 24), not Banyan. Matches printed answer (b) Q.',
});

items.push(mcq(21, '260', 'What is the restoration of forests wherever they have been indiscriminately cut called?',
  ['Deforestation', 'Eutrophication', 'Afforestation', 'Reafforestation'], 3,
  { explanation: 'Reafforestation refers to the process of replanting trees in areas where forests have been indiscriminately cut or destroyed. This helps to restore the forest cover and contributes to environmental conservation.' }));

items.push(mcq(22, '260', 'Which of the following is the CORRECT set of industries for which the forests provide raw materials?',
  ['Paper industry + Pharmaceutical industry + Furniture industry', 'Plywood industry + Petrochemical industry + Matchbox industry', 'Cement industry + Sugar industry + Paper industry', 'Silk industry + Textile industry + Timber industry'], 0,
  { explanation: 'Forests provide raw materials such as wood and other plant products which are used in the paper industry, pharmaceutical industry, and furniture industry.' }));

items.push(mcq(23, '260', '______ is an integrated approach of using the interactive benefits of combining trees and shrubs with crops.',
  ['Social forestry', 'Afforestation', 'Agroforestry', 'Mixed farming'], 2,
  { explanation: 'Agroforestry is a land management system that combines the cultivation of trees and shrubs with crops and/or livestock on the same land.' }));

items.push(mcq(24, '260', 'Spruce and Silver Fir are the typical trees of which of the following natural vegetation belt?',
  ['Mountain forests', 'Deciduous forests', 'Thorn forests', 'Tidal forests'], 0,
  { explanation: 'Spruce and Silver Fir are typical trees found in mountain forests, which are also known as montane forests. These forests are commonly found in high-altitude areas with cool temperatures.' }));

items.push(mcq(25, '260', 'Which one of the following is NOT a characteristic feature of tropical evergreen forests?',
  ['They are found in the areas of heavy rainfall.', 'They do not shed their leaves at the same time.', 'They produce various plant species of high economic value.', "They are also known as 'monsoon forests'."], 3,
  { explanation: "Tropical evergreen forests are not known as 'monsoon forests'; this term refers to tropical deciduous forests. Tropical evergreen forests are characterised by heavy rainfall, evergreen foliage and a variety of plant species with high economic value." }));

items.push(mcq(26, '260', 'What is the characteristic of Tropical Evergreen Forests that makes them remain green throughout the year?',
  ['They shed their leaves at the same time', 'They are found in areas of low rainfall', 'They have a thick ground cover of climbers and epiphytes', 'They do not shed their leaves at the same time'], 3,
  { explanation: 'Tropical Evergreen Forests are called "evergreen" because they do not shed their leaves at the same time, unlike deciduous forests which shed their leaves seasonally. This is due to the high rainfall and humid conditions in these regions, which allow the trees to retain their leaves throughout the year.' }));

items.push(mcq(27, '261', 'What is the main characteristic of Deciduous Monsoon Forests?',
  ['They remain green throughout the year', 'They shed their leaves for 6-8 weeks during spring and early summer', 'They are found in areas of low rainfall', 'They are found in areas of high temperature'], 1,
  { explanation: 'Deciduous Monsoon Forests are characterised by shedding their leaves for a short period during spring and early summer, usually around March-April, due to insufficient moisture.' }));

items.push(mcq(28, '261', 'Which of the following trees is known for its resistance to white ants and is used for making railway sleepers and house building?',
  ['Teak', 'Sal', 'Sandalwood', 'Semul'], 1,
  { explanation: 'Sal wood is known for its hardness and resistance to white ants, making it a popular choice for construction purposes, including railway sleepers and house building.' }));

items.push(mcq(29, '261', 'What is the characteristic of Mountain Forests?',
  ['They are found in areas of high temperature and low rainfall', 'They consist of only coniferous forests', 'They consist of mixed deciduous and coniferous forests', 'They are found in areas of low altitude'], 2,
  { explanation: 'Mountain Forests are characterised by a mix of deciduous and coniferous forests, and are found in areas of cool temperature and moderate rainfall, at an altitude of 1500m to 3300m.' }));

items.push(mcq(30, '261', 'What is the term used to describe the depletion of forest cover due to indiscriminate cutting down of trees?',
  ['Deforestation', 'Reforestation', 'Afforestation', 'Forestation'], 0,
  { explanation: 'Deforestation refers to the permanent destruction of forests, usually as a result of human activities like logging, agriculture, and urbanisation, leading to the loss of biodiversity, environmental degradation, and negative impacts on the climate and ecosystem.' }));

items.push(mcq(31, '261', 'What is the purpose of declaring "Reserved forests" and "Protected forests"?',
  ['To promote wildlife tourism', 'To prevent deforestation and protect tree species', 'To increase timber production', 'To conduct forest research'], 1,
  { explanation: 'Reserved forests and Protected forests are designated to prevent deforestation, protect tree species, and conserve wildlife, as many species have become extinct or are on the verge of extinction.' }));

items.push(mcq(32, '262', 'What is the aim of Silviculture in forest conservation?',
  ['To promote uncontrolled logging', 'To grow trees for sustainable timber yield', 'To clear forests for agriculture', 'To conduct forest research'], 1,
  { explanation: 'Silviculture, or timber farming, aims to grow trees in a controlled manner, allowing for sustainable timber yield, and preventing indiscriminate cutting of trees for timber trade. This practice helps maintain ecological balance and ensures a continuous supply of timber.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Geography',
  chapterName: 'Natural Vegetation of India',
  chapterOrder: 6,
  label: 'ch4-7-climate-soil-vegetation-water.pdf (Chapter 6 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
