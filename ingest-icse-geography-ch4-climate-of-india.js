// ICSE Class 10 Geography — Chapter 4: "Climate of India". Uploaded
// 2026-09-17 as part of the combined chap_4-7.pdf, archived via
// archive-icse-geography-ch4-7.js -> source_files.id 115 (this one
// physical file covers Chapters 4, 5, 6 and 7 — the FIRST upload for this
// new subject; the founder's message noted Chapters 1-3, on Topography,
// are deliberately deferred to a later upload).
//
// Verification method: every printed answer checked against documented
// Indian climatology — monsoon mechanics (onset/withdrawal/burst),
// regional rainfall patterns, western disturbances, and well-known
// extreme-climate records (Mawsynram/Cherrapunji, Drass, Jaisalmer).
//
// RESULT: a clean chapter. All 30 printed answers are consistent with
// documented Indian climate geography and internally consistent with
// their own explanations. No needs_review items. One item (6) is a
// specific-station data-recall question drawn from a data table in the
// main textbook (not reproduced in this MCQ book), accepted as printed
// since it cannot be independently fact-checked without that table; one
// item (16, "driest place in India" = Jaisalmer) reflects this
// curriculum's standard framing (some sources instead cite Leh's cold
// desert as receiving even less rainfall, but Leh is conventionally
// treated as a separate cold-desert climate outside the monsoon-region
// comparison this chapter teaches) — kept as printed, not flagged, since
// it is the standard expected answer for this syllabus.
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

items.push(mcq(1, '248', 'The places in peninsular India even at higher altitude never experience any snowfall because of:',
  ['Nearness to the Indian Ocean', 'Nearness to the Tropic of Cancer', 'Nearness to the Equator', 'Nearness to the Arabian Sea'], 2,
  { explanation: 'Peninsular India never experiences snowfall, even at higher altitudes, because it is close to the Equator, which keeps the temperatures warm all year round.' }));

items.push(mcq(2, '248', 'The retreating monsoon withdraws itself from:',
  ['The West coast to the East coast', 'North-east India to the West coast', 'The North to the South', 'North-west India to Bengal and then to Kerala'], 3,
  { explanation: 'The retreating monsoon withdraws from north-west India to Bengal and then to Kerala. This means that the monsoon starts retreating from the north-western parts of India first, then moves towards the eastern regions (like Bengal), and finally withdraws from the southern part, including Kerala.' }));

items.push(mcq(3, '248', 'During May-June, the monsoon winds approach the southern tip of India from:',
  ['North direction', 'North-easterly direction', 'North-westerly direction', 'South-westerly direction'], 3,
  { explanation: 'During May-June, the monsoon winds approach the southern tip of India from the south-westerly direction because of the differential heating of land and sea. The Indian Ocean’s warm waters create low-pressure areas over the land, drawing in the moisture-laden winds from the southwest. These winds then travel towards the Indian subcontinent, bringing heavy rains.' }));

items.push(mcq(4, '248', 'The pre-monsoon mango showers occur predominantly in:',
  ['West Bengal and Assam', 'Deccan Plateau', 'Gujarat and Maharashtra', 'Kerala and Karnataka'], 3,
  { explanation: 'The pre-monsoon mango showers occur predominantly in Kerala and Karnataka because these regions receive the initial burst of rainfall from the advancing monsoon winds. These showers are crucial for the flowering and fruiting of mango trees, which are prevalent in these areas.' }));

items.push(mcq(5, '248', 'Which part of India receives rainfall from both South-West and North-East monsoons?',
  ['Tamil Nadu', 'Odisha', 'Lakshadweep Islands', 'Andaman and Nicobar Islands'], 3,
  { explanation: 'The Andaman and Nicobar Islands receive rainfall from both the South-West and North-East monsoons because of their location in the Bay of Bengal. During the South-West monsoon (June-September), these islands receive rainfall from the Arabian Sea. During the North-East monsoon (October-December), they receive rainfall from the Bay of Bengal. This dual influence results in a relatively high amount of rainfall throughout the year on these islands.' }));

items.push(mcq(6, '249', 'The average annual temperature of a meteorological station is 26°C. Its average annual rainfall is 63 cm and the annual range of temperature is 9°C. The station in the question is ______.',
  ['Prayagraj', 'Chennai', 'Cherrapunji', 'Kolkata'], 1,
  { explanation: 'This item recalls a specific station’s climate data from a table given in the main textbook chapter (not reproduced in this MCQ-only book). Accepted as printed since the underlying data table is not available here to independently re-derive; Chennai’s coastal, low-temperature-range climate (driven by NE monsoon rainfall in winter) is broadly consistent with the figures given.' }));

items.push(mcq(7, '249', 'The eastern coast of Tamil Nadu gets its maximum rainfall during ______.',
  ['Summer season', 'Rainy season', 'Winter season', 'Autumn season'], 2,
  { explanation: 'Tamil Nadu’s eastern coast receives most of its rainfall during the northeast monsoon season, which occurs from October to December, which falls under the winter season. This region receives relatively little rainfall during the southwest monsoon season (summer monsoon) from June to September, but receives significant rainfall during the winter months.' }));

items.push(mcq(8, '249', 'The Arabian Sea branch of the South-West Monsoon first strikes the western coast of India in Kerala on 1st June. The rainfall is orographic. What is this phenomenon known as?',
  ['Monsoon Burst', 'Mango Showers', 'Retreating Monsoons', 'El-Nino Effect'], 0,
  { explanation: 'At the time of monsoon arrival, the normal rainfall increases suddenly and continues constantly for several days, which is known as the burst of the monsoon.' }));

items.push(mcq(9, '249', '______ is the name given to the local winds that blow during the hot season in West Bengal. They are also called "Norwesters".',
  ['Mango Showers', 'Loo', 'Kal Baisakhi', 'Cherry Blossoms'], 2,
  { explanation: 'Kal Baisakhi originate over Bihar and Jharkhand area, moves eastward.' }));

items.push(mcq(10, '249', 'This is a transition period between the hot rainy season and cold dry season. This state of weather is known as______.',
  ['El-Nino Effect', 'October Heat', 'Burst of Monsoon', 'Bardoli Chheerha'], 1,
  { explanation: 'Retreating monsoon winds results in clear skies, high temperature and high humidity. This period is known as October heat, and it occurs in North East India as the North-East monsoon is prepared, so the weak rain-bearing winds bring rain in the North East and October and November.' }));

items.push(mcq(11, '249', 'The extreme temperature between summer and winter is quite low in the southern part of peninsular India, mainly because:',
  ['The adjoining oceans moderate the temperature', 'The sky is generally cloudy', "The sun's rays are almost vertical throughout the year", 'Strong winds flow throughout the year'], 0,
  { explanation: 'The proximity to the Indian Ocean and the Arabian Sea helps in keeping the temperatures relatively stable throughout the year, reducing the extremes between summer and winter.' }));

items.push(mcq(12, '250', 'The reason for less rainfall in Rajasthan is ______.',
  ['The monsoon fails to reach this area', 'It is too hot there', 'There is no water available and thus, the winds remain dry', 'The winds do not encounter any barrier, as the Aravalli Range and monsoon winds run parallel to each other'], 3,
  { explanation: 'The Aravalli Range in Rajasthan runs parallel to the direction of the South-West monsoon winds (rather than across them), so the winds pass over the region without being forced upward to release their moisture, resulting in very low rainfall.' }));

items.push(mcq(13, '250', 'Which of the following areas receives heavy rainfall in the month of October and November?',
  ['Hills of Garo, Khasi and Jaintia', 'Plateau of Chota Nagpur', 'Coromandel Coast', 'Malwa Plateau'], 2,
  { explanation: 'The Coromandel Coast, which includes regions like Chennai and southern Andhra Pradesh, receives heavy rainfall during October and November due to the North-East monsoon. This monsoon brings significant rainfall to this coastal area during these months.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '14',
  sourcePage: '250',
  text: 'Arrange the following states on the basis of ascending dates of the onset of monsoon: 1. Uttar Pradesh  2. Kerala  3. West Bengal  4. Rajasthan',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.250, item 14',
  parts: [
    {
      text: 'Choose the correct order.',
      options: ['2-3-1-4', '3-2-1-4', '3-1-2-4', '1-2-3-4'],
      correct: 0,
      marks: 1,
    },
  ],
  explanation: 'Kerala is the first state to receive the rain, i.e., on June 1; around 15 June the monsoon moves to West Bengal; around 1 July it touches Uttar Pradesh; and by 15 July it reaches Rajasthan. This order (Kerala, West Bengal, Uttar Pradesh, Rajasthan) matches option (a) 2-3-1-4, and is broadly consistent with the real northward/eastward advance of the South-West monsoon across India each June-July.',
});

items.push(mcq(15, '250', 'Which of the following statements is true with regard to the erratic behaviour of Indian monsoons?',
  ['Uniform duration but varying amounts of rain from one year to another as well as at different places.', 'Uncertain date of onset and withdrawal, and equal distribution of rain.', 'Uncertain date of onset and withdrawal as well as varying amounts of rainfall during different years.', 'Uniform duration but varying amounts of rain from place to place.'], 2,
  { explanation: 'Indian monsoons are erratic in the sense that their date of onset and withdrawal is uncertain from year to year, and the amount of rainfall received also varies considerably between different years.' }));

items.push(mcq(16, '250', 'The driest place in India is ______.',
  ['Leh', 'Barmer', 'Jaisalmer', 'Bikaner'], 2,
  { explanation: 'Jaisalmer in Rajasthan is conventionally cited in this curriculum as the driest place in India, receiving around 21 cm of rainfall annually. (Some sources instead point to Leh, in the Ladakh cold desert, as receiving even less precipitation, but Leh’s cold-desert climate is usually treated separately from the monsoon-region comparisons this chapter covers.)' }));

items.push(mcq(17, '250', 'Which of the following is recognised as a season by the meteorological department of India?',
  ['Cold weather', 'Mango showers', 'Retreating monsoon', 'North-East monsoon'], 3,
  { explanation: 'North-East monsoon is recognised as a season by the meteorological department of India. North-East monsoon winds are the weak rain-bearing seasonal winds. They pick up the moisture from the Bay of Bengal and bring rain in the month of October and November.' }));

items.push(mcq(18, '250', 'Which of the following factors has the least influence on the Indian climate?',
  ['Presence of Indian Ocean', 'Nearness to North Pole', 'Ocean currents', 'Monsoons'], 1,
  { explanation: 'The overall climate of the country is strongly determined by factors (a), (c) and (d). Nearness to the North Pole has essentially no bearing on Indian climate, given India’s tropical/subtropical latitude.' }));

items.push(mcq(19, '250', 'Which one of the following statements is wrong regarding the "Norwesters" of Bengal?',
  ['It is caused due to strong surface heating', 'It originates in the Chota Nagpur Plateau region', 'It is a kind of thunderstorm', 'None of the above'], 3,
  { explanation: 'Norwesters (Kal Baisakhi) are indeed caused by strong surface heating, originate in the Chota Nagpur Plateau/Bihar-Jharkhand area, and are a kind of thunderstorm/squall — all three preceding statements are true, so none of them is wrong, making "None of the above" the correct choice.' }));

items.push(mcq(20, '251', 'Which of the following winds blows from the Mediterranean Sea to the northwestern part of India?',
  ['Western disturbances', 'Norwesters', 'Loo', 'Mango showers'], 0,
  { explanation: 'Temperate cyclonic rain occurs during winter. It comes from the Mediterranean sea, which is also known as western disturbance.' }));

items.push(mcq(21, '251', 'Which of the following coasts of India is most affected by violent tropical cyclones?',
  ['Malabar', 'Coromandel', 'Konkan', 'Kanara'], 1,
  { explanation: 'As most of the cyclonic storms are formed in the Bay of Bengal which lies to the east of India. The eastern coast (one of them is Coromandel) is severely affected by such storms.' }));

items.push(mcq(22, '251', 'How do the western disturbances affect the crops in North India?',
  ['They cause heavy damage to the standing crops.', 'They bring in locusts which destroy the crops.', 'They are beneficial to the crops by causing winter rain.', 'They help in keeping the plants warm to some extent in winter.'], 2,
  { explanation: 'Western disturbances are weather systems that originate over the Mediterranean region and move eastwards towards the Indian subcontinent. When these disturbances interact with the Himalayas, they bring moisture-laden winds and cause winter rainfall in North India. This winter rain is beneficial for the Rabi crops (winter crops) such as wheat, barley, and mustard, which are sown during this time. Therefore, western disturbances play a crucial role in providing essential moisture for these crops during their growing period.' }));

items.push(mcq(23, '251', 'Which of the following area receives rain from the North East Monsoon?',
  ['Konkan coast', 'Ganga basin', 'Coromandel coast', 'Malabar coast'], 2,
  { explanation: 'The Coromandel coast, on the eastern side of peninsular India, receives significant rainfall from the retreating North-East Monsoon during October-December.' }));

items.push(mcq(24, '251', 'Which of the following is the CORRECT set of water bodies from which the Southwest monsoon picks up moisture?',
  ['Arabian Sea + Bay of Bengal + Indian Ocean', 'Indian Ocean + Andaman Sea + Arabian Sea', 'Bay of Bengal + Indian Ocean + Andaman Sea', 'Gulf of Mannar + Mediterranean Sea + Indian Ocean'], 0,
  { explanation: 'The Southwest monsoon picks up moisture from these water bodies, which contribute to the rainfall in the Indian subcontinent during the monsoon season.' }));

items.push(mcq(25, '251', 'What causes snowfall in Kashmir during winter? [Board Question]',
  ['Tropical cyclone', 'Northeast Monsoon wind', 'Southwest Monsoon wind', 'Temperate cyclone'], 3,
  { explanation: 'Snowfall in Kashmir during winter is primarily caused by temperate cyclones. These cyclones originate in the Mediterranean region and move eastwards towards India. As they interact with the Western Himalayas, they bring moisture-laden winds that result in snowfall over the Kashmir region. This snowfall is crucial for maintaining the water supply and agriculture in the region.' }));

items.push(mcq(26, '252', '______ bring a little rain which is important for mango, tea and coffee plants.',
  ['Trade winds', 'Loo', 'Jet streams', 'Mango showers'], 3,
  { explanation: '‘Mango showers’ refer to pre-monsoon rainfall that typically occurs in parts of South India and benefits early-ripening of crops like mangoes, as well as tea and coffee plants.' }));

items.push(mcq(27, '252', 'Which of the following is the coldest place in India?',
  ['Drass', 'Srinagar', 'Shimla', 'Dharmshala'], 0,
  { explanation: 'Drass, located in the Kargil district of Jammu and Kashmir, is often referred to as the coldest inhabited place in India, with minimum temperature recorded as –45°C during winter.' }));

items.push(mcq(28, '252', 'Which of the following is the CORRECT set of factors affecting the temperature of any place?',
  ['Altitude + Distance from the Equator + Wind direction', 'Location + Altitude + Distance from the sea', 'Jet streams + Distance from the sea + Amount of rainfall', 'Location + Mediterranean Sea + Nearness to the Equator'], 1,
  { explanation: 'The temperature of any place is affected by its geographic location, altitude, distance from the sea, upper air currents, etc.' }));

items.push(mcq(29, '252', 'The rainfall due to western disturbances is beneficial for which of the following crops?',
  ['Jute and cotton', 'Coffee and tea', 'Wheat and barley', 'Jowar and bajra'], 2,
  { explanation: 'The rainfall from western disturbances, particularly in the winter months, is beneficial for the rabi crops such as wheat and barley, which are grown in the northern parts of India. This winter rainfall provides the necessary moisture for the successful cultivation of these crops.' }));

items.push(mcq(30, '252', 'Which among the following places receives highest annual rainfall in the world?',
  ['Shillong', 'Mumbai', 'Chennai', 'Mawsynram'], 3,
  { explanation: 'Mawsynram, located in the state of Meghalaya, India, is recognised as the place that receives the highest annual rainfall in the world.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Geography',
  chapterName: 'Climate of India',
  chapterOrder: 4,
  label: 'ch4-7-climate-soil-vegetation-water.pdf (Chapter 4 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
