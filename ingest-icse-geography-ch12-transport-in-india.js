// ICSE Class 10 Geography — Chapter 12: "Transport in India"
// (37 items, book pages 297-303).
// Source: chap_10-13.pdf, source_files.id 117 (see archive-icse-geography-ch10-13.js).
//
// Verification notes (independently checked against real-world facts):
//  - Item 13 (centres producing diesel engines for railways: Varanasi,
//    "Uttar Pradesh", Chittaranjan, all of these): real-world railway
//    geography notes that Varanasi hosts the Diesel Locomotive Works (DLW,
//    Uttar Pradesh) while the Chittaranjan Locomotive Works (CLW, West
//    Bengal) is historically associated chiefly with ELECTRIC (and
//    formerly steam) locomotive production, not diesel — so grouping
//    Chittaranjan under "diesel engines" is imprecise. Option (b) "Uttar
//    Pradesh" is also a state name rather than a specific centre,
//    redundant with option (a) Varanasi (itself in UP). No printed
//    explanation was given for this item to check against, and no single
//    alternative option is cleanly and unambiguously better supported, so
//    the printed answer "(d) All of these" is kept with this caveat
//    disclosed rather than corrected.
//  - Item 28 ("busiest artificial port of India" = Mumbai): the printed
//    explanation states "Mumbai, also known as the Port of Mumbai or
//    Jawaharlal Nehru Port, is the busiest artificial port in India."
//    This conflates two administratively and physically DISTINCT ports —
//    the historic Mumbai (Bombay) Port and Jawaharlal Nehru Port (JNPT) at
//    Nhava Sheva are separate facilities on opposite sides of Mumbai
//    harbour; JNPT, not the old Mumbai Port, is generally cited as India's
//    busiest container port. Additionally, Mumbai's harbour is usually
//    described as one of the world's finest NATURAL harbours rather than
//    an artificial one (Chennai's port, by contrast, is the commonly-cited
//    artificial/man-made harbour in ICSE-level geography). Given the
//    ambiguity in what "busiest artificial port" is meant to test, and
//    that this Mumbai/JNPT simplification is common in secondary-level
//    textbooks, the printed answer is kept with this conflation disclosed
//    rather than corrected to a different single option.
//  - Item 29 ("Which of the following is NOT a centre for the iron and
//    steel industry? Ans. Bengaluru") is a verbatim repeat of Chapter 11's
//    item 31 (same stem, options, and answer) — a genuine repeat in the
//    source book itself. Exact-duplicate detection in this pipeline is
//    scoped per-chapter, so this ingests normally without needing any
//    special handling.
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

items.push(mcq(1, 297, 'Which of the following is/are not correct about the importance of transportation?', [
  'Transportation facilitates utilisation of natural resources lying unutilised in the hills, forests and mines.',
  'It slows down the process of industrialisation and urbanisation.',
  'Transport system helps in transporting the raw materials and other necessary machinery to the industries.',
  'Transportation links the backward areas to the urban cities and reduces regional industrial disparity.',
], 1));

items.push({
  kind: 'case',
  sourceQuestionNumber: '2',
  sourcePage: 297,
  text: 'Match the following: (I) District Roads (II) Village Roads (III) Border Roads — with (i) Built and Maintained by Zila Parishad (ii) Built and Maintained by Village Panchayats (iii) Built and Maintained by Border Road Organisation.',
  parts: [
    { text: 'Codes: (a) (I)-(i), (II)-(ii), (III)-(iii)  (b) (I)-(ii), (II)-(iii), (III)-(i)  (c) (I)-(ii), (II)-(i), (III)-(iii)  (d) (I)-(i), (II)-(iii), (III)-(ii)',
      options: ['(I)-(i), (II)-(ii), (III)-(iii)', '(I)-(ii), (II)-(iii), (III)-(i)', '(I)-(ii), (II)-(i), (III)-(iii)', '(I)-(i), (II)-(iii), (III)-(ii)'],
      correct: 0,
      marks: 1 },
  ],
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.297, item 2',
  explanation: 'District roads are built and maintained by Zila Parishad — these link the district centres with the major roads. Village roads are built and maintained by Village Panchayats — these connect villages with the neighbouring towns and cities. Border roads are built and maintained by the Border Road Organisation — these are built to strengthen the defence preparedness of border areas.',
});

items.push(mcq(3, 297, 'Which of the following are the two stations which are connected by the North-South Corridor?', [
  'Srinagar-Kanyakumari', 'Delhi-Kanyakumari', 'Chandigarh-Chennai', 'None of these',
], 0));

items.push(mcq(4, 297, 'Which of the following are the extreme stations which are connected by the NH1?', [
  'Delhi-Chandigarh', 'Delhi-Amritsar', 'Delhi-Chennai', 'Jammu-Kerala',
], 1));

items.push(mcq(5, 298, 'The density of roads refer to:', [
  'Length of road per 1000 sq km', 'Length of road per 100 sq km', 'Length of road per 1000 sq m', 'None of these',
], 1));

items.push(mcq(6, 298, 'The states having low density of roads are:', [
  'Bihar', 'Chhattisgarh', 'Jammu and Kashmir', 'All of these',
], 3));

items.push(mcq(7, 298, 'The policy of the government under which the private sector also builds the roads:', [
  'Build, Operate and Transfer', 'Build, Operate, Takeaway', 'Build, Open, Transfer', 'None of these',
], 0));

items.push(mcq(8, 298, 'Which of the following is not correct?', [
  'There are about 52,000 km of national highways in India.',
  'There are about 1 lakh km of state highways in India.',
  'State highways play a major role in the development of the state.',
  'The Central Government constructs and maintains the national highways.',
], 1, {
  explanation: 'India has about 3 lakh km of state highways, not 1 lakh km, making statement (b) the incorrect one — this matches the source\'s own explanation, which states "There are about 3 lakh km of state highways in India."',
}));

items.push(mcq(9, 298, 'Which of the following schemes have been launched to improve roads in rural areas?', [
  'Bharat Nirman Yojana', 'Pradhan Mantri Gramin Sadak Yojana', 'Both (a) and (b)', 'Neither (a) nor (b)',
], 2));

items.push(mcq(10, 298, 'Central Road Fund has been created for the development of:', [
  'National Highways', 'State Roads', 'Rural Roads', 'All of these',
], 3));

items.push(mcq(11, 299, 'Which of the following are the extreme stations which are connected by the East-West Corridor?', [
  'Itanagar-Porbandar', 'Silchar-Porbandar', 'Silchar-Ahmedabad', 'None of these',
], 1));

items.push(mcq(12, 299, 'When was the railway system started in India?', [
  '1853', '1856', '1857', '1859',
], 0));

items.push(mcq(13, 299, 'The centres where diesel engines for railway are produced are:', [
  'Varanasi', 'Uttar Pradesh', 'Chitranjan', 'All of these',
], 3, {
  explanation: "Printed as 'All of these' with no explanation given in the source for this item. Independent verification note: the Diesel Locomotive Works (DLW) at Varanasi is the well-documented centre for diesel-locomotive manufacture; the Chittaranjan Locomotive Works (CLW) is chiefly associated with electric (formerly steam) locomotives rather than diesel, and 'Uttar Pradesh' is a state name rather than a distinct centre (Varanasi itself is in Uttar Pradesh). This makes the option list imprecise, but no single alternative among the four options is unambiguously and clearly superior, so the printed answer is kept as-is with this caveat disclosed.",
}));

items.push(mcq(14, 299, 'Major problems with Indian railways are:', [
  'Passengers travel without ticket', 'Rail accidents', 'Old tracks', 'All of these',
], 3));

items.push(mcq(15, 299, 'The centre which produces rolling stock for Indian railways:', [
  'Varanasi', 'Kapurthala', 'Both (a) and (b)', 'Neither (a) nor (b)',
], 2));

items.push(mcq(16, 299, 'Which of the following is correct?', [
  'The gap in between the inner edges of a railway track is known as the railway gauge.',
  'Broad gauge has a width of 1.676 metres.',
  'Metre gauge has a width of 1.00 metres.',
  'All of the above',
], 3));

items.push(mcq(17, 299, 'The Himalayan region has a low density of railway networks due to:', [
  'Rugged terrain, hill and valley topography.', 'The population is sparse and the economy is in a backward state.', 'Both (a) and (b)', 'Neither (a) nor (b)',
], 2));

items.push(mcq(18, 300, 'The company which provides helicopter service to the oil and Natural Gas Corporation is:', [
  'Air India', 'Indigo', 'Pawan Hans Helicopters Ltd.', 'None of these',
], 2));

items.push(mcq(19, 300, 'The air transport is preferred in north-eastern states of India due to:', [
  'Hilly terrain of the region.', 'Presence of big rivers and dissected relief.', 'It is a safe mode of transportation.', 'All of the above',
], 3));

items.push(mcq(20, 300, 'The cheapest mode of transportation is:', [
  'Roadways', 'Air ways', 'Waterways', 'None of these',
], 2));

items.push({
  kind: 'case',
  sourceQuestionNumber: '21',
  sourcePage: 300,
  text: 'Match the following: (I) NW-1 (II) NW-2 (III) NW-3 — with (i) Ganga-Bhagirathi-Hooghly (ii) Brahmaputra river (iii) West Coast Canal and Champakara and Udyogmandal canals.',
  parts: [
    { text: 'Codes: (a) (I)-(i), (II)-(ii), (III)-(iii)  (b) (I)-(ii), (II)-(iii), (III)-(i)  (c) (I)-(iii), (II)-(ii), (III)-(i)  (d) (I)-(i), (II)-(iii), (III)-(ii)',
      options: ['(I)-(i), (II)-(ii), (III)-(iii)', '(I)-(ii), (II)-(iii), (III)-(i)', '(I)-(iii), (II)-(ii), (III)-(i)', '(I)-(i), (II)-(iii), (III)-(ii)'],
      correct: 0,
      marks: 1 },
  ],
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.300, item 21',
  explanation: 'National Waterway-1: Allahabad-Haldia stretch of the Ganga-Bhagirathi-Hooghly river (1620 km) declared as NW in 1986 in the states of Uttar Pradesh, Bihar, Jharkhand and West Bengal. National Waterway-2: Sadiya-Dhubri stretch of the Brahmaputra river (891 km) declared as National Waterway in 1988 in the state of Assam. National Waterway-3: Kollam-Kottapuram stretch of West Coast Canal and Champakara and Udyogmandal canals (205 km) declared as National Waterway in 1993 in the state of Kerala.',
});

items.push(mcq(22, 300, 'Which of the following is not an iron exporting port of the country?', [
  'Marmagao', 'Visakhapatnam', 'Paradip', 'Kandla',
], 3));

items.push(mcq(23, 301, 'The deepest land-locked and protected port in India is:', [
  'Marmagao', 'Visakhapatnam', 'Mumbai', 'Cochin',
], 1));

items.push(mcq(24, 301, 'IWAI stands for:', [
  'Indian Wildlife Authority of India', 'Inland Waterways Authority of India', 'Indian Waste Management Authority of India', 'None of these',
], 1));

items.push(mcq(25, 301, 'Which of the following is not correct about the importance of ports for the Indian economy?', [
  'The major ports of India handle about 15,000 cargo vessels per annum.',
  '20% of the cargo vessels are handled at these ports is for overseas trade.',
  'These ports are the main source of trade.',
  'The trade helps the economy in earning foreign exchange.',
], 1, {
  explanation: "The source's own explanation states that 70% of the cargo handled at these ports is for overseas trade, not 20% — making statement (b) the incorrect one, consistent with the printed answer.",
}));

items.push(mcq(26, 301, 'Which of the following statement(s) is/are correct?', [
  'Radio, television, e-mail, telegraph, etc., are considered as the means of communication.',
  'Railways, airways, buses, trucks, cars, etc., are considered as the means of transportation.',
  'Transportation connects one part of the country with another part.',
  'All of the above',
], 3));

items.push(mcq(27, 301, 'Which of the following statement(s) is/are correct?', [
  'The means of transport and communication help the industries to get raw materials.',
  'Transport network brings people of different castes, creed. colours, religions, languages and regions near to each other.',
  'The means of communication together acts like the nervous system in the human body.',
  'All of the above',
], 3));

items.push(mcq(28, 302, 'Which is the busiest artificial port of India?', [
  'Goa', 'Mumbai', 'Chennai', 'Vishakhapatnam',
], 1, {
  explanation: "Printed explanation: \"Mumbai, also known as the Port of Mumbai or Jawaharlal Nehru Port, is the busiest artificial port in India. It handles a significant volume of international trade and is a major hub for container traffic.\" Disclosed caveat: this conflates two administratively and physically distinct ports — the historic Mumbai (Bombay) Port and Jawaharlal Nehru Port (JNPT) at Nhava Sheva are separate facilities, and JNPT (not the old Mumbai Port) is generally cited as India's busiest container port. Mumbai's natural harbour is also usually described as one of the world's finest NATURAL harbours rather than an artificial one; Chennai's port is more commonly cited in ICSE-level geography as an artificial/man-made harbour. This Mumbai/JNPT simplification is common in secondary-level textbooks; the printed answer is kept as no cleanly superior single alternative is evident among the given options.",
}));

items.push(mcq(29, 302, 'Which of the following is NOT a centre for the iron and steel industry?', [
  'Bhilai', 'Bengaluru', 'Rourkela', 'Vishakhapatnam',
], 1, {
  explanation: 'Bengaluru is not a center for the iron and steel industry; it is a hub for IT and high-tech industries, while Bhilai, Rourkela, and Vishakhapatnam are all significant centres for the iron and steel industry. This exact question (same stem, options, and answer) also appears as Chapter 11 item 31 — a genuine verbatim repeat in the source book.',
}));

items.push(mcq(30, 302, 'Which of the following means of transport has best use during floods/earthquake?', [
  'Airways', 'Railways', 'Roadways', 'Waterways',
], 0));

items.push(mcq(31, 302, 'What is a major problem with Indian roads, especially in villages?', [
  'Well-maintained roads', 'Unmetalled roads and poor maintenance', 'Traffic jams due to lack of order', 'Lack of roadside amenities',
], 1));

items.push(mcq(32, 302, 'What is a challenge faced by Indian Airlines and Air India?', [
  'High demand for services', 'Lack of funds and poor maintenance', 'Efficient services and modern aircraft', 'Low fares and good quality service',
], 1));

items.push(mcq(33, 302, 'What is an advantage of waterways in India?', [
  'Fastest mode of transport', 'Most expensive mode of transport', 'Cheapest mode of transport', 'Not suitable for heavy goods',
], 2));

items.push(mcq(34, 303, 'What is a problem with Indian ports?', [
  'Well-planned and modern facilities', 'Congested and lack of facilities', 'Good connectivity with hinterland', 'Efficient cargo handling',
], 1));

items.push(mcq(35, 303, 'What is a limitation of Indian Railways?', [
  'Can be laid in any terrain', 'Provides door-to-door service', 'Electrification has reduced power consumption', 'Cannot be laid in hilly or remote areas',
], 3));

items.push(mcq(36, 303, 'What is a disadvantage of road transport in India?', [
  'Well-maintained roads and good amenities', 'Lack of roadside amenities', 'No traffic jams or congestion', 'Shortage of funds for maintenance',
], 3));

items.push(mcq(37, 303, 'What is a challenge faced by Indian Railways?', [
  'Modern trains and equipment', 'Efficient and productive workers', 'Obsolete trains, tracks, and equipment', 'Good facilities and cleanliness',
], 2));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Geography',
  chapterName: 'Transport in India',
  chapterOrder: 12,
  sourceFileIds: [SOURCE_FILE_ID],
  label: 'ICSE Geography Ch12 Transport in India (chap_10-13.pdf combined upload)',
});

console.log(JSON.stringify(result, null, 2));
