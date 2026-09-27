// ICSE Class 10 Geography — Chapter 11: "Industries in India: Mineral
// based Industries" (34 items, book pages 291-296).
// Source: chap_10-13.pdf, source_files.id 117 (see archive-icse-geography-ch10-13.js).
//
// Verification notes (independently checked against real-world facts):
//  - Item 7 (Rourkela steel plant established 1959, German collaboration
//    with Krupps and Demag): verified, matches documented history.
//  - Item 12 (first modern steel industry in India set up in 1870, at
//    Kulti, Bengal): verified against documented industrial history — the
//    Bengal Iron Works Company established the Kulti Iron Works in 1870,
//    generally cited as India's first modern iron/steel works.
//  - Item 15 (Durgapur steel plant established with British
//    collaboration): verified, consistent with documented history (Durgapur
//    was built with UK/British technical assistance, distinct from
//    Rourkela's German and Bhilai's Soviet collaboration).
//  - Item 29 ("Which of the following is NOT a centre for the iron and
//    steel industry? Ans. Bengaluru") is a verbatim repeat of this same
//    question appearing again in Chapter 12 (item 29 there). This is a
//    genuine repeat in the source book itself (same stem/options/answer),
//    not a transcription error. Since exact-duplicate detection in this
//    project's ingest pipeline is scoped per-chapter, this item ingests
//    normally in both chapters without needing any special handling —
//    documented here for the record.
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

items.push({
  kind: 'case',
  sourceQuestionNumber: '1',
  sourcePage: 291,
  text: 'Which of the following is the correct sequence for removing impurities from iron ore? Arrange the steps in the correct order.',
  parts: [
    { text: '1. The steel is cast into ingots and rolled into different sizes. 2. Through deoxidation, the impurities are removed to convert pig iron into steel. 3. The product obtained is known as pig iron which can be converted into wrought iron, steel and cast iron. 4. This slag floats on the molten iron and is collected at the base of the furnace at regular intervals. 5. During the iron-making process, a blast furnace is fed with the iron ore, coke and small quantities of fluxes such as limestone.',
      options: ['1, 2, 3, 4, 5', '1, 3, 2, 5, 4', '5, 4, 3, 2, 1', '1, 2, 5, 3, 4'],
      correct: 2,
      marks: 1 },
  ],
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.291, item 1',
  explanation: 'The correct sequence is: (5) blast furnace fed with iron ore, coke and fluxes such as limestone -> (4) slag floats on molten iron and is collected at the base of the furnace -> (3) the product obtained is pig iron, convertible into wrought iron, steel and cast iron -> (2) through deoxidation, impurities are removed to convert pig iron into steel -> (1) the steel is cast into ingots and rolled into different sizes. This matches the printed answer 5,4,3,2,1.',
});

items.push(mcq(2, 291, 'Which of the following is/are the advantage(s) of mini steel plants?', [
  'Scrap iron is used as raw material.', 'These plants can be built with less capital investment.', 'Both (a) and (b)', 'Neither (a) nor (b)',
], 2));

items.push(mcq(3, 291, 'Which of the following can be considered as the disadvantages of the iron and steel industry?', [
  'This industry is a capital intensive industry.',
  'This industry lacks behind in using advanced technological inputs.',
  'The high grade coking coal used for smelting iron ore is limited.',
  'All of the above',
], 3));

items.push(mcq(4, 292, 'Many small iron and steel plants have closed down due to:', [
  'inadequate supply of power.', 'inadequate supply of coal.', 'increasing cost of raw materials.', 'both (a) and (c)',
], 3));

items.push(mcq(5, 292, 'A piece of pure material, usually metal, that is casted into a shape suitable for further processing is known as:', [
  'Pig Iron', 'Galvanised sheets', 'Ingots', 'None of these',
], 2));

items.push(mcq(6, 292, 'Four large-scale industries dependent on iron and steel industry are:', [
  'Automobiles industry', 'Engineering goods industry', 'Shipbuilding industry', 'All of these',
], 3));

items.push(mcq(7, 292, 'In which year the Rourkela steel plant was established?', [
  '1969', '1959', '1960', '1975',
], 1));

items.push(mcq(8, 292, 'Rourkela steel plant does not receive raw material from:', [
  'Sundergarh', 'Keonjhar', 'Barajamda', 'Giridih',
], 3));

items.push(mcq(9, 292, 'Rourkela steel plant receives limestone from:', [
  'Baradwar', 'Biramitrapur', 'Jharia', 'Korba',
], 1));

items.push(mcq(10, 292, 'Which of the following statements are correct about the Rourkela steel plant?', [
  'Good transportation on the Kolkata-Nagpur rail line provides easy access to the raw material producing areas and to the markets.',
  'Labourers are employed from the states of Bihar, West Bengal, Jharkhand and Odisha.',
  'This plant produces products like hot-rolled sheets, cold-rolled sheets, galvanised sheets and electrical steel plates.',
  'All of the above',
], 3));

items.push(mcq(11, 292, 'Hindustan Machine Tools is located at:', [
  'Ajmer', 'Hyderabad', 'Bengaluru', 'Bhopal',
], 2));

items.push(mcq(12, 292, 'First modern steel industry in India was set up in:', [
  '1875', '1870', '1907', '1925',
], 1, {
  explanation: "The first modern steel industry in India was set up in 1870 at Kulti (Bengal) by the Bengal Iron Works Company (later reorganised as the Bengal Iron and Steel Company) — independently verified against documented industrial history as the standard-cited beginning of India's modern iron/steel industry.",
}));

items.push(mcq(13, 293, 'The Mumbai-Pune region is the most important industrial region of India because:', [
  'These are the largest centres of cotton textiles.', 'These are major centres of chemical industries also.', 'These are major centres of electronics.', 'All of the above',
], 3));

items.push(mcq(14, 293, 'Which of the following cities is not known for iron implements for agriculture?', [
  'Ajmer', 'Srinagar', 'Pinjore', 'Chandigarh',
], 3));

items.push(mcq(15, 293, 'The iron and steel plant established with British collaboration was:', [
  'Durgapur', 'Bokaro', 'Bhilai', 'Rourkela',
], 0));

items.push(mcq(16, 293, 'The period between _______ is considered as the golden period for electronics.', [
  '1990 and 1992', '1989 and 1995', '1984 and 1990', 'None of these',
], 2));

items.push(mcq(17, 293, 'Which of the following years is known for the beginning of the electronic industry in India?', [
  '1960', '1965', '1967', '1980',
], 1));

items.push(mcq(18, 293, 'Advantages of Indian electronic industry are:', [
  'Manpower', 'Market demand', 'Policy regulatory support', 'All of these',
], 3));

items.push(mcq(19, 294, 'Space technology in India was established in _______.', [
  '1970s', '1960s', '1980s', '1990s',
], 1));

items.push(mcq(20, 294, 'Which of the following institutions was not established to give impetus to space research programmes in India?', [
  'Indian Space Research Organisation (ISRO)', 'Satellite Launching Station', 'National Remote Agency', 'Bhabha Atomic Research Center',
], 3));

items.push(mcq(21, 294, 'Which of the following is not a software giant?', [
  'Infosys', 'Wipro', 'TCS', 'KPMG',
], 3));

items.push(mcq(22, 294, 'Bharat Heavy Electricals Ltd (BHEL) consists of:', [
  'six units', 'five units', 'three units', 'four units',
], 0));

items.push(mcq(23, 294, 'The fastest growing industry in India is:', [
  'Heavy industry', 'Consumer industry', 'Electronic industry', 'None of these',
], 2));

items.push(mcq(24, 294, 'The centres which provide single window service and high data communication facility to the software experts are known as:', [
  'Computer IT Park', 'Software Technology Park', 'Electronic Parks', 'None of these',
], 1));

items.push(mcq(25, 295, 'Which of the following is a software park?', [
  'Mohali', 'Hyderabad', 'Chennai', 'All of these',
], 3));

items.push(mcq(26, 295, 'The electronic industry has made an impact on both entertainment and education because it has provided us:', [
  'television', 'laptops', 'radio', 'all of these',
], 3));

items.push(mcq(27, 295, 'With the advancements in the electronic industry, which of the following has transformed the system of learning globally?', [
  'i-pads', 'smart classes', 'e-books', 'all of these',
], 3));

items.push(mcq(28, 295, 'Which of the following statements is correct:', [
  'The electronic industry has provided the modern means of communication to defence forces.',
  'It requires huge investment and research facilities.',
  'Both (a) and (b)',
  'Neither (a) nor (b)',
], 2));

items.push(mcq(29, 295, 'Which of the following is a basic / key industry?', [
  'Iron and Steel Industry', 'Silk Industry', 'Electronic Industry', 'Cotton textile Industry',
], 0));

items.push(mcq(30, 295, 'Which steel plant amongst the following was set up with the collaboration with Germany?', [
  'Bhilai', 'Tata Steel', 'Vishakhapatnam', 'Rourkela',
], 3));

items.push(mcq(31, 295, 'Which of the following is NOT a centre for the iron and steel industry?', [
  'Bhilai', 'Bengaluru', 'Rourkela', 'Vishakhapatnam',
], 1, {
  explanation: 'Bengaluru is not a center for the iron and steel industry. It is renowned as a hub for information technology (IT) and other high-tech industries. In contrast, Bhilai, Rourkela, and Vishakhapatnam are all significant centers for the iron and steel industry in India. Note: this exact question (same stem, options, and answer) is repeated verbatim later in Chapter 12 (item 29 there) — a genuine repeat in the source book itself.',
}));

items.push(mcq(32, 296, 'Which city is rightly termed as the Electronic Capital of India?', [
  'Bengaluru', 'Mumbai', 'Chennai', 'Delhi',
], 0));

items.push(mcq(33, 296, 'What is the main raw material for the petrochemical industry?', [
  'Petroleum', 'Coal', 'Natural Gas', 'All of these',
], 3));

items.push(mcq(34, 296, 'What is the product of petrochemical industry used in plastics, synthetic rubber, and synthetic fibre?', [
  'Polythene', 'Vinyl', 'PVC', 'Petroleum',
], 3));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Geography',
  chapterName: 'Industries in India: Mineral based Industries',
  chapterOrder: 11,
  sourceFileIds: [SOURCE_FILE_ID],
  label: 'ICSE Geography Ch11 Mineral based Industries (chap_10-13.pdf combined upload)',
});

console.log(JSON.stringify(result, null, 2));
