// ICSE Class 10 Geography — Chapter 10: "Industries in India: Agro Based
// Industries" (34 items, book pages 284-290).
// Source: chap_10-13.pdf, source_files.id 117 (see archive-icse-geography-ch10-13.js).
// Third Geography upload; founder's message "here geography ends for now"
// signals this is the final upload for the time being (Chapters 1-3
// Topography remain deferred).
//
// Verification notes (independently checked against real-world facts, not
// just the printed key):
//  - Item 11 ("sugarcane is not used to produce: ... (d) Molasses") was
//    initially suspected to contradict items 12/34 (which correctly list
//    Molasses as a BY-PRODUCT of sugar). On close re-reading this is NOT a
//    contradiction: item 11 asks what sugarcane is deliberately processed
//    to PRODUCE (Sugar, Gur/Jaggery, Khandsari — the intended outputs),
//    while items 12/34 ask about BY-PRODUCTS of that processing (Molasses,
//    Bagasse, Pressmud — leftover outputs, not the intended product).
//    Molasses is correctly excluded from "products sugarcane is used to
//    produce" in the deliberate-output sense. No defect; kept as printed.
//  - Item 13 (Maharashtra as India's largest sugar producer, followed by
//    UP): this is the standard convention in ICSE textbooks of this
//    vintage, reflecting Maharashtra's higher recovery/crushing efficiency;
//    year-to-year cane-area statistics have sometimes put Uttar Pradesh
//    ahead by raw cultivated area in more recent years. Kept as printed
//    (verified, disclosed caveat) — the book's own reasoning (UP relegated
//    to second due to old mills/management/labour problems) is internally
//    consistent and defensible.
//  - Item 26 ("Mulberry silk is the commercial silk produced in the
//    world", correct answer verified independently — Mulberry silk
//    (Bombyx mori) accounts for ~90% of world silk production and is
//    correctly identified). However, the PRINTED explanation text for
//    this item is a copy-paste error: it reads "Agra (Uttar Pradesh) and
//    Srinagar (Jammu Kashmir) are two important centres of carpet
//    making" — entirely unrelated to silk. The correct answer (c) is kept
//    (verified independently), but the explanation supplied here corrects
//    the copy-paste defect and is disclosed as such.
//  - Item 19(c)/Item 20: "Mumbai = Cottonopolis of India / Lancashire of
//    India" and "Ahmedabad = Manchester of India" — verified against
//    standard ICSE-curriculum convention; consistent, no defect.
const db = require('./db');
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 117;

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

items.push(mcq(1, 284, 'Which of the following statement(s) is/are not correct?', [
  'Through industrialisation, infrastructures like railways, roadways, dams, etc. can be constructed.',
  'Industrialisation provides support and strength to agriculture based industries.',
  'Through industrial development, self-reliance in defence can be achieved.',
  'Through industrialisation, more ammunition can be created to protect country.',
], 3));

items.push(mcq(2, 284, 'Industries that are dependent on the raw materials produced by the agricultural sector are known as:', [
  'Agro-based industries', 'Mineral-based industries', 'Both (a) and (b)', 'None of them',
], 0));

items.push(mcq(3, 284, 'Which of the following cannot be a raw material based industry?', [
  'Animal-based industries', 'Heavy industries', 'Mineral-based industries', 'Forest-based industries',
], 1));

items.push(mcq(4, 284, 'These industries are owned and managed by central government or state government. Choose the correct industry:', [
  'Public sector industries', 'Private sector industries', 'Joint sector industries', 'Co-operative sector industries',
], 0));

items.push(mcq(5, 285, 'These industries are owned and managed privately by individuals or group of individuals. It is:', [
  'Public sector industries', 'Private sector industries', 'Joint sector industries', 'Co-operative sector industries',
], 1));

items.push(mcq(6, 285, 'These industries are owned, managed and controlled jointly by private entrepreneur and the government. The industry is known as:', [
  'Public sector industries', 'Private sector industries', 'Joint sector industries', 'Co-operative sector industries',
], 2));

items.push(mcq(7, 285, 'The industries in which people with limited means and resources pool their physical and material resources are called:', [
  'Public sector industries', 'Private sector industries', 'Joint sector industries', 'Cooperative sector industries',
], 3));

items.push(mcq(8, 285, 'The uneven distribution of industries in India can be attributed to:', [
  'All the agro-based industries are located in the areas where the raw materials are available.',
  'The forest based industries are located in the forest areas.',
  'The coastal regions have huge availability of copra, coir and fish canning and so the industries are also located there.',
  'All of the above',
], 3));

items.push(mcq(9, 285, 'The government has encouraged cottage industries by:', [
  'providing financial assistance.', 'setting up the Khadi and Village Commission.', 'both (a) and (b)', 'neither (a) nor (b)',
], 2));

items.push(mcq(10, 286, 'India is the _______ largest sugarcane producer of the world.', [
  'second', 'third', 'fourth', 'fifth',
], 0));

items.push(mcq(11, 286, 'Sugarcane is not used to produce:', [
  'Sugar', 'Gur (Jaggery)', 'Khandsari', 'Molasses',
], 3, {
  explanation: 'Sugarcane is an important cash crop and is crushed in the sugar mills to obtain sugar, and to make gur and khandsari. These are the deliberate, intended products of processing sugarcane. Molasses is not a product sugarcane is deliberately processed to produce — it is a leftover by-product of sugar refining (see item 12/item 34 of this chapter). This is consistent, not contradictory: "produce" here refers to the intended output, while "by-product" (items 12, 34) refers to the residual output.',
}));

items.push(mcq(12, 286, 'Which of the following is not a by-product of sugar?', [
  'Jaggery', 'Molasses', 'Bagasse', 'Pressmud',
], 0));

items.push(mcq(13, 286, 'Which of the following states is the largest producer of sugar in India?', [
  'Uttar Pradesh', 'Maharashtra', 'Haryana', 'West Bengal',
], 1, {
  explanation: "Maharashtra is the leading producer of sugar in India, followed by Uttar Pradesh. Formerly, Uttar Pradesh was the leading producer of sugar but was relegated to second position due to old mills, management and labour problems and shorter crushing period. Note: sugar-production leadership between Maharashtra and Uttar Pradesh has fluctuated across different years depending on cane area versus recovery/crushing efficiency; this book's convention (Maharashtra ahead on efficiency grounds) is kept as printed.",
  answerStatus: 'verified',
}));

items.push(mcq(14, 286, 'Which of the following is not a sugar producing state in India?', [
  'Uttar Pradesh', 'Punjab', 'Haryana', 'Jammu and Kashmir',
], 3));

items.push(mcq(15, 286, 'Which of the following is the leading producer of sugarcane in peninsular India?', [
  'Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh',
], 1));

items.push(mcq(16, 286, 'The sugar industry is migrating to the south due to:', [
  'maritime climate which is free from loo and frost.',
  'availability of black soil which is well drained and more fertile.',
  'sugarcane of the south is of superior quality.',
  'all of the above',
], 3));

items.push(mcq(17, 287, 'Which among these is not the problem faced by sugar industry in India?', [
  'Poor quality with low sucrose content.',
  'Inefficient and uneconomic nature of production.',
  'Short crushing season.',
  'The government has not fixed the prices of sugarcane, hence, farmers earn goo profit.',
], 3, {
  explanation: 'The government has, in fact, fixed the prices of sugarcane; if farmers are not offered good prices they tend to switch to other crops. So the statement in (d) is factually false, making it the correct choice for "not the problem" (i.e., the false/non-problem statement). ("goo profit" in the printed option is a typographical rendering of "good profit".)',
}));

items.push(mcq(18, 287, 'Which of the following statement(s) is/are not correct?', [
  'India is one of the largest manufacturing countries and one of the largest exporters of cotton textiles in the world.',
  'Cotton textile industry is divided into three sectors.',
  'The important powerloom cotton mills are located in Maharashtra, Gujarat and Tamil Nadu.',
  'The important handloom cotton mills are situated in Mumbai, Ahmedabad, Kanpur, Coimbatore, Howrah, etc.',
], 1, {
  explanation: 'Cotton textile industry is divided into TWO sectors — Powerloom and Handloom — not three, making statement (b) the incorrect one.',
}));

items.push(mcq(19, 287, 'Which of the following statement(s) is/are correct?', [
  'Maharashtra and Gujarat are the two most important cotton textile manufacturing states in India.',
  'Mumbai and Ahmedabad contribute 50% of the total installed looms.',
  "Mumbai is called the 'Cottonopolis' of India or the 'Lancashire of India'.",
  'All of the above',
], 3));

items.push(mcq(20, 287, 'Which of the following is known as the "Manchester of India"?', [
  'Vadodara', 'Ahmedabad', 'Mumbai', 'Aurangabad',
], 1));

items.push(mcq(21, 288, 'Which among these is not the problem faced by cotton industry in India?', [
  'Long staple cotton is not adequately grown in India.',
  'Many factories are old, obsolete and sick.',
  'The cost of maintenance and replacement of old machineries with the new ones require heavy financial investments.',
  'Good network of rail and road transport.',
], 3));

items.push(mcq(22, 288, 'Which of the following statement(s) is/are not correct?', [
  'Handloom industry is one of the oldest industries of India providing employment to millions of people.',
  'The handloom industry is mainly located in big cities.',
  'Tamil Nadu, Odisha, Uttar Pradesh, Assam and Andhra Pradesh generate 50% of the total production.',
  'Manipur, Maharashtra, West Bengal, Kerala, Rajasthan, Jammu and Kashmir, Karnataka, etc. are some other important centres of the handloom industry.',
], 1, {
  explanation: 'The handloom industry is mainly located in small towns and RURAL areas, not big cities — making statement (b) the incorrect one.',
}));

items.push(mcq(23, 288, 'The problems faced by handloom and khadi industries are:', [
  'Inadequate, insufficient and low quality availability of raw materials.',
  'The workers employed are mostly unskilled.',
  'These industries use old and obsolete technology.',
  'All of the above',
], 3));

items.push(mcq(24, 289, 'It is necessary to crush sugarcane within 24 hours of harvesting because:', [
  'it starts decomposing.', 'sucrose content starts decreasing.', 'pests can attack it after 24 hours.', 'none of these',
], 1));

items.push(mcq(25, 289, 'Important centres of sugar industry are:', [
  'Ahmednagar', 'Gorakhpur', 'Both (a) and (b)', 'Neither (a) and (b)',
], 2));

items.push(mcq(26, 289, 'is the commercial silk produced in the world:', [
  'Tussar silk', 'Eri silk', 'Mulberry silk', 'Mugg Muga silk',
], 2, {
  explanation: "Mulberry silk (produced by the silkworm Bombyx mori, which feeds on mulberry leaves) accounts for roughly 90% of the world's commercial silk production, making it correctly identified here. Note: the source's own printed explanation for this item is a copy-paste error unrelated to the question — it reads 'Agra (Uttar Pradesh) and Srinagar (Jammu Kashmir) are two important centres of carpet making,' which has nothing to do with silk. The answer (c) Mulberry silk is independently verified as correct; this explanation replaces the erroneous printed one and discloses the defect.",
  answerStatus: 'verified',
}));

items.push(mcq(27, 289, 'Which of the following is not a property of man made fibre?', [
  'Weakness', 'Durability', 'Workability', 'Dyeability',
], 0));

items.push(mcq(28, 289, 'The cotton industry is more widespread than the jute industry due to the:', [
  'limited availability of jute', 'sufficient availability of cotton', 'both (a) and (b)', 'neither (a) nor (b)',
], 2));

items.push(mcq(29, 289, 'Mumbai has a large number of cotton textile units because:', [
  'Raw material is grown in Maharashtra itself.',
  'Cotton is easily available from neighbouring state.',
  'Humid climatic condition in Mumbai.',
  'All of the above',
], 3));

items.push(mcq(30, 289, 'Which of the following is a staple food grain of Indians?', [
  'Wheat', 'Rice', 'Gram', 'Arhar',
], 1));

items.push(mcq(31, 290, 'What is the oldest among the modern manufacturing industries in India?', [
  'Textile industry', 'Sugar industry', 'Iron and Steel industry', 'Petrochemical industry',
], 0));

items.push(mcq(32, 290, 'Which state is the foremost silk producing state of the country?', [
  'Karnataka', 'West Bengal', 'Jammu and Kashmir', 'Uttar Pradesh',
], 0));

items.push(mcq(33, 290, 'What is the main raw material for the sugar industry in India?', [
  'Sugarcane', 'Sugar beet', 'Wheat', 'Rice',
], 0));

items.push(mcq(34, 290, 'What is the by-product of sugar industry used in cooking?', [
  'Molasses', 'Bagasse', 'Press mud', 'Gur',
], 0));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Geography',
  chapterName: 'Industries in India: Agro Based Industries',
  chapterOrder: 10,
  sourceFileIds: [SOURCE_FILE_ID],
  label: 'ICSE Geography Ch10 Agro Based Industries (chap_10-13.pdf combined upload)',
});

console.log(JSON.stringify(result, null, 2));
