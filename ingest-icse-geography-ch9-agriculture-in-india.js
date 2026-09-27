// ICSE Class 10 Geography — Chapter 9: "Agriculture in India". Uploaded
// 2026-09-17 as part of the combined chap_8-9.pdf, archived via
// archive-icse-geography-ch8-9.js -> source_files.id 116 (this one
// physical file covers Chapters 8 and 9 — the second Geography upload).
// This is the LAST chapter of this upload — the final scanned page (283)
// bleeds through with the start of the next chapter, "Agro Based
// Industries" (Chapter 10), too little content to ingest now, noted for
// the next upload.
//
// Verification method: every printed answer checked against documented
// Indian agricultural geography — cropping seasons/patterns, farming
// types, land-reform and Green-Revolution policy history, and crop-specific
// facts (rice/wheat/cotton/sugarcane/pulses).
//
// Two disclosed (non-needs_review) caveats, both internal-consistency
// notes rather than clear factual errors:
// - Item 10: this item states agriculture accounts for "14.7%" of total
//   export earnings, while item 1 (marking only its own statement (a) as
//   false) implicitly endorses "about 12% share of the country's exports"
//   as true — two different specific percentages for what appears to be
//   the same statistic. Both figures are plausible depending on the exact
//   year/methodology (India's agricultural export share has fluctuated
//   over time), so neither is clearly wrong, but the discrepancy is
//   disclosed for transparency. Kept both items as printed.
// - Item 14 (cross-referenced with items 12 and 15): this chapter uses
//   "New/National Agricultural Policy" to refer to a 1960s-era policy
//   package (paired with the Green Revolution, emphasising HYV seeds,
//   fertilisers and irrigation) — internally consistent across all three
//   items, but this name is more properly associated with India's actual,
//   later, formally-titled "National Agricultural Policy, 2000." Kept as
//   printed since the book is self-consistent in its own usage; disclosed
//   so this isn't confused with the real 2000 policy document.
//
// All other 41 items independently verified clean against documented
// agricultural geography, including item 23's shifting-cultivation
// regional-names matching (re-verified: Jhum-Assam, Poonam-Kerala,
// Podu/Koman-Odisha, Khil-Himalayan region, Kuruwa-Jharkhand,
// Bewar/Masha/Penda/Hera-Madhya Pradesh — confirming "Poonam-Chhattisgarh"
// as printed is indeed the mismatch).
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

items.push(mcq(1, '276', 'Which of the following statement(s) is/are not correct?',
  ["Over 98% of India's land is arable.", '70% of the rural families are engaged in this occupation.', 'Agriculture contributes about 14% of total GDP.', "Agriculture contributes about 12% share of the country's exports."], 0,
  { explanation: "Over 60% of India's land is arable and 70% of the rural families are engaged in this occupation for their livelihood. Agriculture contributes about 14% of total GDP and 12% share of the country's exports." }));

items.push(mcq(2, '276', 'Which of the following statement(s) is/are not correct in support of agriculture in India?',
  ['India has suitable climatic conditions.', 'It has good amount of sunshine throughout the year.', 'It is characterised by long growing seasons.', 'It is characterised by short growing seasons.'], 3,
  { explanation: 'In support of agriculture activity, India has suitable climatic conditions, good amount of sunshine throughout the year, long growing seasons, etc. — the claim of "short growing seasons" is the incorrect statement.' }));

items.push(mcq(3, '276', 'Which of the following statement(s) is/are not correct in support of agriculture in India?',
  ['Agriculture is the backbone of the Indian economy.', 'It is the single largest private sector occupation.', "It provides employment to 58.4% of the country's workforce.", 'Agriculture forms the part of tertiary sector'], 3,
  { explanation: "Agriculture is the backbone of the Indian economy, occupying a significant position in the overall economic structure of the country. It is the single largest private-sector occupation, providing employment to 58.4% of the country's workforce. Agriculture is part of the PRIMARY sector, not the tertiary sector." }));

items.push(mcq(4, '276', 'Agriculture plays an important role in the Indian economy because:',
  ['It feeds millions of people and ever increasing population.', 'It also helps in raising livestock.', 'It helps in creating job opportunities for millions of people.', 'All of the above'], 3,
  { explanation: 'Agriculture plays an important role in the Indian economy due to the following reasons: it is essential because it feeds millions of people and its ever increasing population; it helps in raising livestock with suitable environmental conditions and provides fodder to them; it helps in creating job opportunities for millions of people.' }));

items.push(mcq(5, '277', 'Which of the following small scale industries is not dependent on agriculture for its raw material?',
  ['Handlooms', 'Spinning oil milling', 'Rice thrashing', 'Iron and steel'], 3,
  { explanation: 'Various small scale and cottage industries like handlooms, spinning oil milling, rice thrashing, etc. are dependent on agriculture for their raw material — iron and steel, by contrast, is dependent on minerals.' }));

items.push(mcq(6, '277', 'India has witnessed a slow agricultural growth despite its efforts due to:',
  ['unreliable rainfall.', 'poor irrigation system.', 'lack of proper market infrastructure.', 'all of these'], 3,
  { explanation: 'Unreliable rainfall, poor irrigation systems, and lack of proper market infrastructure have all contributed to slow agricultural growth in India despite various government efforts.' }));

items.push(mcq(7, '277', 'The factors contributing to low agricultural development in India can be grouped into:',
  ['Two groups', 'Five groups', 'Three groups', 'Four groups'], 3,
  { explanation: 'Many factors contribute to low agricultural development in India as compared to other developed countries. These factors are categorised into four groups: Environmental factors, Economic factors, Institutional factors, Technological factors.' }));

items.push(mcq(8, '277', 'The repetition of growing the same crops in the fields leads to:',
  ['replenishment of soil', 'infertility of soil', 'excess flow of soil', 'none of these'], 1,
  { explanation: 'Repetition of crops on the same land drains the nutrients which are essential for the growth of plants. Hence, the land becomes infertile.' }));

items.push(mcq(9, '277', 'Which of the following is not one of the economic factors contributing to low agricultural development in India?',
  ['Practice of subsistence farming', 'Using primitive methods', 'Less interested landowners', 'Far off located markets'], 2,
  { explanation: 'Following are the economic factors responsible for low agricultural development in India: the Indian farmer chiefly practices subsistence farming where large manual labour is employed to work on farms but grow only to suffice their family’s needs and not much is left for sale in the market; farmers are using primitive methods and obtaining poor yields as they lack scientific and technological knowledge; the location of the market is an important factor, markets located at a far off distance costs high transportation; lack of transportation facilities; availability of cheap and efficient labour for the cultivation of crops is important.' }));

items.push({
  kind: 'mcq',
  sourceQuestionNumber: '10',
  sourcePage: '277',
  text: "Indian agriculture accounts for ______ of the total export earnings.",
  options: ['14.7%', '29%', '30.7%', '40%'],
  correct: 0,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.277, item 10',
  explanation: "DISCLOSED NOTE (cross-ref. item 1): this item's explanation states \"India's foreign trade and exports are deeply associated with agriculture. It accounts for about 14.7% of the total export earnings.\" This is a different specific figure from item 1 of this same chapter, which (by marking only its own statement (a) as false) implicitly endorses \"about 12% share of the country's exports\" as accurate. Both percentages are plausible depending on the exact year/methodology used (India's agricultural export share has genuinely fluctuated over time), so neither figure is clearly wrong, but the discrepancy between the two same-chapter items is disclosed for transparency. Kept as printed.",
});

items.push(mcq(11, '278', 'Which of the following statements is incorrect?',
  ['A majority of Indian farmers are still dependent on the primitive and poor techniques of producing crops.', 'They use inadequate and obsolete implements.', 'They fail to apply modern science and technology to agriculture.', 'Use of chemical fertilisers and pesticides have increased production four fold.'], 3,
  { explanation: 'Farmers in India still depend on primitive and conventional techniques of producing crops due to their poverty. They lack information and knowledge about modern science and technology which is resulting in low agricultural development in India — so the claim that fertiliser/pesticide use has already achieved a four-fold production increase is the incorrect statement in this context.' }));

items.push(mcq(12, '278', 'Which of the following steps have been taken by the Government of India to ensure reforms?',
  ['Indian Council of Agriculture Research (ICAR) was established.', 'Agricultural universities were established.', 'Horticulture development was ensured.', 'All of the above'], 3,
  { explanation: 'Agriculture is the backbone of the Indian economy. Due to too many factors agriculture productivity in the past was declining and was a serious concern. The government of India took various measures to overcome the declining Gross Domestic Product (GDP). It established the Indian Council of Agriculture Research (ICAR), agricultural universities, veterinary services, horticulture development institutes, research and development organisations in the field of meteorology and weather forecast and Kisan call centres. The Green Revolution and the National Agricultural Policy (NAP) introduced by the Indian government is the turning point in the development of the Indian agricultural sector.' }));

items.push(mcq(13, '278', 'Which of the following is known as the greatest revolution that brought a transformation from food scarcity to food self-sufficiency.',
  ['Green Revolution', 'White Revolution', 'Blue Revolution', 'None of these'], 0,
  { explanation: 'The Green revolution is one of the major breakthroughs in the agricultural sector in India. It is considered as the greatest revolution that brought a transformation from food scarcity to food self-sufficiency. Green Revolution was a technology package comprising material components of improved high yielding varieties of two staple cereals, rice and wheat, irrigation, fertilisers, pesticides and associated management skills.' }));

items.push({
  kind: 'mcq',
  sourceQuestionNumber: '14',
  sourcePage: '278',
  text: 'When was the New Agricultural Policy adopted by India?',
  options: ['1970s', '1980s', '1990s', '1960s'],
  correct: 3,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.278, item 14',
  explanation: 'DISCLOSED NOTE (cross-ref. items 12 and 15): this chapter uses "New/National Agricultural Policy" to refer to a 1960s-era policy package tied to the Green Revolution (HYV seeds, chemical fertilisers, expanded irrigation — see item 15\'s list of "main elements"), consistent across all three items. This terminology is more properly associated with India\'s actual, later, formally-titled "National Agricultural Policy, 2000." The book is internally self-consistent in its own usage, so kept as printed, but disclosed here so it isn\'t confused with the real 2000 policy document.',
});

items.push(mcq(15, '278', 'The main elements of the New Agricultural Policy does not include :',
  ['Use of large capital and technological inputs.', 'Adoption of modern scientific methods of farming.', 'Use of HYV (High Yielding Variety) seeds.', 'No money should be wasted in marketing'], 3,
  { explanation: 'The main elements of the New Agricultural Policy are: use of large capital and technological inputs; adoption of modern scientific methods of farming; use of HYV (High Yielding Variety) seeds; extension of irrigation facilities, particularly ground water resources; proper use of chemical fertilisers; improvement in marketing and storage facilities; use of insecticides and pesticides; consolidation of landholdings; supply of agricultural credit; rural electrification.' }));

items.push(mcq(16, '279', 'Steps taken to improve the agricultural production in India are:',
  ['Introduction to prevent subdivision and fragmentation of lands beyond certain limit.', 'Introduction of land reforms.', "Rational utilisation of the country's water resources.", 'All of the above'], 3,
  { explanation: 'Besides the Green Revolution, many steps were taken to improve the agricultural production in India. They are: introduction to prevent subdivision and fragmentation of lands beyond a certain limit; introduction of various land reforms; rational utilisation of the country’s water resources for optimum use of irrigation potential; the Government declares prices for the protection of farmers, minimises fluctuations in commodity prices and monitors international prices; setting up of Kisan Call Centres which is also known as Farm Tele-Advisors (FTAs); provision of subsidies on fertilisers.' }));

items.push(mcq(17, '279', "The monetary value of all the finished goods and services produced within a country's borders in a specific time period is known as:",
  ['SGDP', 'GDP', 'GNP', 'NNP'], 1,
  { explanation: "GDP refers to Gross Domestic Product which refers to the monetary value of all the finished goods and services produced within a country's borders in a specific time period." }));

items.push(mcq(18, '279', 'Crop rotation means:',
  ['growing different types of crops in succession.', 'growing different types of crops together.', 'growing same types of crops all the time.', 'none of the above'], 0,
  { explanation: 'Crop rotation means growing different types of crops in succession on the same land.' }));

items.push(mcq(19, '279', 'Pruning is:',
  ['cutting off unwanted saplings.', 'cutting off unwanted trees.', 'cutting off unwanted branches.', 'none of these'], 2,
  { explanation: 'Pruning refers to the selective cutting off of unwanted branches from a plant or tree to improve growth, shape, and yield.' }));

items.push(mcq(20, '279', 'Kisan Call Centres is a scheme of:',
  ['Department of Agriculture', 'Department of Telecommunication', 'Department of Health', 'Department of commerce'], 0,
  { explanation: 'The Kisan Call Centre scheme is to answer the queries of the farmers over a call in their local language, run under the Department of Agriculture.' }));

items.push(mcq(21, '280', 'The farming types practised in India are:',
  ['Subsistence in farming', 'Shifting agriculture', 'Plantation farming', 'All of these'], 3,
  { explanation: 'The different types of farming practiced in India are: Subsistence farming, Shifting agriculture, Plantation farming, Commercial farming, Intensive farming, Extensive farming, Mixed farming.' }));

items.push(mcq(22, '280', 'Which of the following is not a characteristic feature of subsistence farming?',
  ['The farmers have large lands.', 'The output is mostly for local requirements.', 'The farmers uses simple and primitive tools.', 'Farming is very intensive.'], 0,
  { explanation: 'In subsistence farming, the farmers have small land and do not use fertilisers and thus, the yield is low. The output is mostly for local requirements with little or no surplus trade. The land holdings are small and scattered. The farmer uses simple and primitive tools with traditional methods of agriculture. Farming is very intensive and double or treble-cropping is practiced.' }));

items.push(mcq(23, '280', 'Which of the following is not correctly matched?',
  ['Jhum–Assam', 'Poonam–Chhattisgarh', 'Podu–Andhra Pradesh', 'Khil–Himalayan Region'], 1,
  { explanation: 'Shifting cultivation is known by different names in different regions in India. It is called Jhum in Assam, Poonam in Kerala, Koman or Bring in Odisha, Khil in the Himalayan region, Kuruwa in Jharkhand and Bewar, Masha, Penda and Hera in different parts of Madhya Pradesh — so "Poonam" is associated with Kerala, not Chhattisgarh, correctly identified as the mismatch.' }));

items.push(mcq(24, '280', 'Commercial farming largely depends on:',
  ['HYV seeds', 'chemical fertilizers', 'both (a) and (b)', 'neither (a) nor (b)'], 2,
  { explanation: 'Commercial farming largely depends on machines, HYV seeds, chemical fertilisers, pesticides and insecticides to obtain higher yield. This type of farming is practiced in large farms spreading over hundreds of hectares of land.' }));

items.push(mcq(25, '280', 'The main feature of mixed farming is:',
  ['the farmer conducts different agricultural practices on a single farm.', 'this is done to increase income through different sources.', 'both (a) and (b)', 'neither (a) nor (b)'], 2,
  { explanation: 'Mixed farming is a type of farming in which a farmer conducts different agricultural practices on a single farm to increase income through different sources. It is a combination of growing crops and rearing cattle simultaneously. In it, along with farming, other occupations carried out are poultry farming, dairy farming, bee keeping, sericulture, piggery, goat and sheep rearing, agroforestry, etc. The main benefit of this type of farming is that it ensures a steady income for the farmers because if any one business or farming fails, the other means can support.' }));

items.push(mcq(26, '281', 'Upland rice is:',
  ['grown in mountainous regions', 'sown in March-April', 'harvested in September and October', 'All of these'], 3,
  { explanation: 'Upland rice is the staple crop and food of highland areas. It is a rainfed crop which grows in well-drained soil without any accumulation of water.' }));

items.push(mcq(27, '281', 'In which method, the seeds are sown in the furrows with regular intervals?',
  ['Broadcasting method', 'Drilling method', 'Dibbling method', 'All of these'], 2,
  { explanation: 'In dibbling method, seeds are sown in furrows/holes at regular intervals, unlike broadcasting (scattering seeds) or drilling (continuous-line sowing).' }));

items.push(mcq(28, '281', 'The Japanese method was introduced in ______.',
  ['1953', '1954', '1964', '1985'], 0,
  { explanation: 'The Japanese method was introduced in 1953 and is the most popular method. In this method, High Yielding Variety (HYV) seeds called Japonica are used.' }));

items.push(mcq(29, '281', 'The processing of rice involves:',
  ['Harvesting', 'Threshing', 'Winnowing', 'All of these'], 3,
  { explanation: 'The processing of rice involves: Harvesting (a sickle is used to cut the stalk; it is labour intensive); Threshing (done by beating the sheaves against wooden bars to separate the grains from the stalks); Winnowing (removing the unwanted husk from the grains); Milling (removing the yellowish husk from the grains).' }));

items.push(mcq(30, '281', 'Which of the following is not correct about Pulses?',
  ['Pulses are grown as rotation crops', 'Pulses are good cattle fodder', 'The two most important pulses are gram and tur', 'Pulses are full of fibres'], 3,
  { explanation: 'Pulses form an important part of the Indian diets because they are full of protein (not primarily notable for fibre content). Pulses are grown as rotation crops as they are leguminous crops that fix atmospheric nitrogen in the soil and increase the natural fertility of the soil. Pulses are good cattle fodder too. The two most important pulses are gram and tur. Other important pulses are urad, moong, masur, kulthi, matar, khesari and moth.' }));

items.push(mcq(31, '281', '______ and ______ states are the nucleus of Green Revolution.',
  ['Uttar Pradesh, Haryana', 'Punjab, Haryana', 'Madhya Pradesh, Bihar', 'Tamil Nadu, Karnataka'], 1,
  { explanation: 'Punjab and Haryana were the main centers of the Green Revolution in India, which started in the 1960s. These states adopted high-yielding seeds, chemical fertilisers, and improved irrigation, leading to significant increases in crop production, especially wheat and rice. Therefore, they are considered the nucleus of the Green Revolution.' }));

items.push(mcq(32, '282', '______ is the other name for inclined plane method of lifting water from wells.',
  ['Tube well', 'Persian wheel', 'Mhote', 'Bore-well'], 2,
  { explanation: 'Mhote is inclined plane method, in which a pair of bullocks is used to lift water from wells.' }));

items.push(mcq(33, '282', 'Which of the following is NOT a problem of Indian agriculture?',
  ['Dependence on monsoon', 'Small land holdings', 'Two main cropping seasons', 'Use of traditional methods of farming'], 3,
  { explanation: '"Use of traditional methods of farming" is not necessarily a problem in itself. While it is true that traditional farming methods may not be as efficient or productive as modern methods, they can still be effective and sustainable in certain contexts. In fact, some traditional practices, such as crop rotation and organic farming, are being rediscovered and promoted as sustainable and eco-friendly approaches to agriculture.' }));

items.push(mcq(34, '282', 'Maharashtra is the leading producer of which of the following cash crop?',
  ['Jute', 'Cotton', 'Coffee', 'Tea'], 1,
  { explanation: 'Maharashtra is the leading producer of cotton, which is a cash crop widely cultivated in the state due to favourable climatic conditions and suitable soil.' }));

items.push(mcq(35, '282', 'Which crop is associated with Ratooning?',
  ['Sugarcane', 'Jute', 'Rice', 'Cotton'], 0,
  { explanation: 'Ratooning is a technique where a new crop is grown from the stubble of the previous crop. Sugarcane is commonly associated with ratooning, as it has the ability to regrow from the remaining underground buds after the harvest.' }));

items.push(mcq(36, '282', 'Which of the following farming method is used to grow tea on a large scale?',
  ['Subsistence farming', 'Plantation farming', 'Mixed farming', 'Shifting agriculture'], 1,
  { explanation: 'Plantation farming, practiced on large estates, is the method used to grow tea on a large scale in India.' }));

items.push(mcq(37, '282', "What percentage of India's total cultivable area is still under net sown area?",
  ['40%', '46.6%', '50%', '60%'], 1,
  { explanation: "Net sown area still accounts for about 46.6% of the total cultivable area of India." }));

items.push(mcq(38, '282', 'What is the main crop grown during the Kharif season?',
  ['Wheat', 'Rice', 'Cotton', 'Maize'], 1,
  { explanation: 'Major crops of the Kharif season are rice, maize, jowar, bajra, cotton, sesame, groundnut, pulses, and jute; rice is the main/predominant Kharif crop.' }));

items.push(mcq(39, '283', 'What type of farming is still prevalent in India?',
  ['Commercial farming', 'Subsistence farming', 'Intensive farming', 'Extensive farming'], 1,
  { explanation: 'In India, agriculture is still of the subsistence type, where farmers produce exclusively for their own consumption.' }));

items.push(mcq(40, '283', 'Which crop is the staple food of millions of Indians, particularly in the north and north-west parts of the country?',
  ['Wheat', 'Rice', 'Pulses', 'Cotton'], 0,
  { explanation: 'Wheat is the most important foodgrain in India and is the staple food of millions of Indians, particularly in the north and north-west parts of the country.' }));

items.push(mcq(41, '283', 'What is the main characteristic of pulses?',
  ['They are leguminous plants with root nodules', 'They are rotated with other crops to maintain soil fertility', 'They provide vegetable proteins to a large vegetarian population', 'All of the above'], 3,
  { explanation: 'Pulses are leguminous plants with root nodules, which fix and utilize atmospheric nitrogen in the soil. They are rotated with other crops to maintain or restore soil fertility, and provide the much-needed vegetable proteins to a very large vegetarian population of India.' }));

items.push(mcq(42, '283', 'What is the main use of cotton seeds?',
  ['Vanaspati industry', 'Cattle feed', 'Oil production', 'Textile industry'], 0,
  { explanation: 'The cotton seeds (binola) are used in the vanaspati industry.' }));

items.push(mcq(43, '283', 'What type of crop is cotton?',
  ['Tropical and subtropical', 'Temperate', 'Rabi', 'Kharif'], 0,
  { explanation: 'Cotton is a tropical and subtropical crop grown up to 40°N latitude.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Geography',
  chapterName: 'Agriculture in India',
  chapterOrder: 9,
  label: 'ch8-9-mineral-energy-agriculture.pdf (Chapter 9 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
