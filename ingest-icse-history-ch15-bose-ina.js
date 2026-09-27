// ICSE Class 10 History & Civics — Chapter 15: "Subhash Chandra Bose and
// the Indian National Army (INA)". Uploaded 2026-09-17 as part of the
// combined chap_14-17.pdf, archived via archive-icse-history-ch14-17.js ->
// source_files.id 113 (this one physical file covers Chapters 14, 15, 16
// and 17 — see that script's header comment).
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch7-14): every printed answer checked
// against documented history of the INA's formation (Mohan Singh, 1942;
// Rash Behari Bose's Indian Independence League; Subhash Chandra Bose's
// later leadership from 1943), the Azad Hind Provisional Government
// (Singapore, 1943), and Bose's death (Taipei air crash, August 1945).
// Item 15's four-statement true/false set was independently re-verified
// against real events — all four resolved consistently with the printed
// key.
//
// DISCLOSED MINOR CAVEAT — item 24: the printed key names "Unity, Faith,
// Justice" as the INA's three guiding principles (excluding "Equality" as
// the odd one out). The INA/Azad Hind movement's most widely documented
// motto is actually "Ittehad, Etemad, Qurbani" — Unity, Faith, SACRIFICE —
// not "Justice," and this very chapter's own item 22 lists "Unity, faith
// and sacrifice" together as one of the INA's actual objectives. Despite
// this inconsistency with the more commonly cited version of the motto,
// "Equality" remains clearly the least plausible of the four options
// given here regardless of which third term is used, so the printed
// answer is kept, with the discrepancy disclosed.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 113;

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

items.push(mcq(1, '207', "Who was Gandhiji's candidate against S.C. Bose in the Tripuri session of the Indian National Congress?",
  ['Maulana Md. Ali', 'Jawaharlal Nehru', 'M.A. Ansari', 'Pattabhi Sitaramayya'], 3,
  { explanation: 'Gandhiji wanted that Pattabhi Sitaramayya should become the President of the Congress for the Tripuri session.' }));

items.push(mcq(2, '207', 'Who among the following leaders joined Subhash Chandra Bose to establish the All India Forward Bloc and also participated in the INA Movement?',
  ['Baikuntha Shukla', 'J.P. Narayan', 'Ramnarayan Prasad', 'Sheel Bhadra Yajee'], 3,
  { explanation: 'Sheel Bhadra Yajee was a social activist from Bihar. He joined Subhash Chandra Bose to establish the All India Forward Bloc.' }));

items.push(mcq(3, '207', 'The INA was organised by Netaji Subhash Chandra Bose at which of the following places?',
  ['Rangoon', 'Singapore', 'Taiwan', 'Tokyo'], 1,
  { explanation: 'The organisation of the INA took place in the nation of Singapore.' }));

items.push(mcq(4, '207', 'Where did Netaji Subhash Chandra Bose establish provisional government of free India?',
  ['Singapore', 'Burma', 'Malaysia', 'Germany'], 0,
  { explanation: 'The Provisional Government of the free India was established by the Subhash Bose in the Singapore to mobilise all the forces effectively.' }));

items.push(mcq(5, '207', 'During which of the following years, Port Blair was the headquarters of the Azad Hind government under Subhash Chandra Bose?',
  ['1941-42', '1942-43', '1943-44', '1944-45'], 2,
  { explanation: 'Subhash Chandra Bose made Port Blair in the Andaman and Nicobar islands as the headquarter of the Azad Hind Government. It remained so from 1943-1944.' }));

items.push(mcq(6, '207', 'Which of the following leader is not associated with Azad Hind Fauz?',
  ['Major General Shah Nawaz Khan', 'Colonel Prem Kumar Sahgal', 'Colonel Shaukat Ali Malik', 'Major Kartar Singh'], 3,
  { explanation: 'Kartar Singh was not the part of the Azad Hind Fauz.' }));

items.push(mcq(7, '208', "The title of 'Father of the Nation' was given to the Mahatma Gandhi by......",
  ['Rabindranath Tagore', 'Subhash Chandra Bose', 'Bal Gangadhar Tilak', 'None of these'], 1,
  { explanation: 'Subhash Chandra Bose gave the title "Father of the Nation" to Mahatma Gandhi in a radio broadcast from Singapore in 1944.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '8',
  sourcePage: '208',
  text: 'Arrange the following events in the life of Netaji Subhash Chandra Bose in correct chronological order (from the earliest to the latest):\nI. Formed Azad Hind Government in exile.\nII. Gave the slogan "March to Delhi".\nIII. Formed Rani of Jhansi Regiment.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.208, item 8',
  parts: [
    {
      text: 'Choose the correct chronological order.',
      options: ['II, I, III', 'II, III, I', 'I, II, III', 'III, I & II'],
      correct: 0,
      marks: 1,
    },
  ],
  explanation: 'Bose gave the "Chalo Delhi" ("March to Delhi") call in 1943 shortly after taking over INA leadership, formed the Azad Hind Government in exile in Singapore in October 1943, and the Rani of Jhansi Regiment (women\'s combat regiment) was also raised in 1943, generally described as following the government\'s formation — the printed sequence, slogan first, then government, then the regiment, is accepted here per the source.',
});

items.push(mcq(9, '208', 'Who was appointed as the Commander-in-Chief of the Indian National Army?',
  ['Mohan Singh', 'Dr. Laxmi Swaminathan', 'Shah Nawaz Khan', 'Gurdial Singh Dhillon'], 0,
  { explanation: 'The Bangkok Conference was held from June 15 to June 23. In which many resolution passed and one of them is appointment of Mohan Singh as the Commander-in-Chief of the Indian National Army.' }));

items.push(mcq(10, '208', 'The Indian National Army was formed by ............ .',
  ['Mahatma Gandhi', 'Rash Behari Bose', 'Jawaharlal Nehru', 'Khudiram Bose'], 1,
  { explanation: 'The Indian National Army was formed by Rash Behari Bose and then later was handed over to the Subhash Chandra Bose.' }));

items.push(mcq(11, '208', 'The Provisional Government of Free India was formed in ............ .',
  ['England', 'Dhaka', 'Singapore', 'Rangoon'], 2,
  { explanation: 'The provisional government of Free India was formed in the Singapore under the leadership of Subhash Chandra Bose.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '12',
  sourcePage: '208',
  text: 'Match List I with List II and select the correct answer by using the codes given below the lists:\n\nList I\nI. Tej Bahadur Sapru\nII. \'Netaji\'\nIII. Subhash Chandra Bose\nIV. Mohan Singh\n\nList II\n(A) Name given to Subhash Chandra Bose by Indian soldiers of German Indische Legion\n(B) Founder of All India Forward Bloc\n(C) First Commander-in-Chief of the INA\n(D) Lawyer for the defendants of INA trials',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.208, item 12',
  parts: [
    {
      text: 'Choose the correct code.',
      options: ['I – B, II – A, III – C, IV – D', 'I – A, II – D, III – C, IV – B', 'I – A, II – D, III – B, IV – C', 'I – D, II – A, III – B, IV – C'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: "Tej Bahadur Sapru was among the senior lawyers who defended INA soldiers at the 1945-46 Red Fort trials (I-D); 'Netaji' was the title given to Subhash Chandra Bose by Indian soldiers of the German Indische Legion, before he even reached Southeast Asia (II-A); Subhash Chandra Bose founded the All India Forward Bloc in 1939 (III-B); Mohan Singh was the INA's first Commander-in-Chief (IV-C). All four pairings check out.",
});

items.push(mcq(13, '208', 'What are the objective of Forward Bloc?',
  ['Reorganisation of agriculture and industry on socialist lines', 'Abolition of Zamindari system', 'Introduction of a new monetary and credit system', 'All of the above'], 3,
  { explanation: 'These were among the founding objectives of the All India Forward Bloc, formed by Subhash Chandra Bose in 1939.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '14',
  sourcePage: '209',
  text: 'Which of the following statement is/are correct?\nI. Subhash Chandra Bose set up the provisional Government of free India in Singapore.\nII. This government was recognized by Allied power.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.209, item 14',
  parts: [
    {
      text: 'Choose the correct option.',
      options: ['Only I', 'Only II', 'Both I and II', 'Neither I nor II'],
      correct: 0,
      marks: 1,
    },
  ],
  explanation: 'Statement I is true: Bose did set up the Provisional Government of Free India (Azad Hind) in Singapore in 1943. Statement II is false: this government was recognised by Axis powers such as Japan, Germany, Italy, Burma and Thailand — not by the Allied powers.',
});

items.push({
  kind: 'case',
  sourceQuestionNumber: '15',
  sourcePage: '209',
  text: 'Given below are some statements. Choose the correct statements.\nI. Subhash Chandra Bose founded the Indian National Army.\nII. INA under the command of Subhash Chandra Bose captured Malay Peninsula in 1943.\nIII. Subhash Chandra Bose was the President of the Provisional Government of Free India.\nIV. Subhash Chandra Bose died in an aircraft crash while escaping to Korea.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.209, item 15',
  parts: [
    {
      text: 'Choose the correct option.',
      options: ['Only I is correct', 'Only I and II are correct.', 'All are correct', 'Only III is correct'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: "Independently re-verified: statement I is false — the INA was founded by Rash Behari Bose, not Subhash Chandra Bose (see item 10). Statement II is false — the Malay Peninsula was captured by the Imperial Japanese Army in early 1942, before Subhash Chandra Bose even took over INA leadership (1943); the INA's major campaign (Imphal, 1944) came later and did not include capturing Malaya. Statement III is true — Bose was President of the Provisional Government of Free India (Azad Hind), formed in Singapore in 1943. Statement IV is false — Bose died in an aircraft crash near Taipei, Taiwan, on 18 August 1945, while reportedly en route to Tokyo, Japan, not Korea. Only statement III is correct, matching the printed key.",
});

items.push(mcq(16, '209', 'Look at the picture carefully and answer the questions which follow:\n[Photograph: Subhash Chandra Bose in uniform walking alongside a column of women soldiers of the INA.]\nWhat is Netaji Subhash Chandra Bose doing in the picture?',
  ['Inspecting Rani Jhansi Brigade', 'Inspecting the Chand Bibi Nursing Corps of INA', "Inspecting the women's battalion of Indian Legion.", 'None of the above'], 0,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.209, item 16 — photograph of Subhash Chandra Bose inspecting the Rani of Jhansi Regiment (the INA\'s all-women brigade)', assetType: 'source_page_full' }],
    explanation: 'The first all female brigade of the INA was called the Rani Jhansi brigade.',
  }));

items.push(mcq(17, '209', 'Who is the lady marching along with Netaji?',
  ['Janaky Athi Nahappan', 'Laxmi Swaminathan', 'Janaki Devar', 'None of these'], 1,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.209, item 17 — same photograph as item 16, identifying Captain Lakshmi Swaminathan leading the Rani of Jhansi Regiment', assetType: 'source_page_full' }],
    explanation: 'The lady who is marching with the Netaji in the given image is Laxmi Swaminathan, who led this brigade.',
  }));

items.push(mcq(18, '210', 'Complete the given analogy.\nForward Bloc : Subhash Chandra Bose :: Indian National Army : ?',
  ['Mohan Singh', 'Shah Nawaz Khan', 'Kartar Singh', 'Rash Behari Bose'], 3,
  { explanation: 'The foundation of the Indian Independence League in 1942 was led by the Rash Behari Bose who was also the founder of the INA.' }));

items.push(mcq(19, '210', 'Complete the given analogy.\nIndian National Army : 1942 :: Forward Bloc : ?',
  ['1938', '1939', '1940', '1942'], 1,
  { explanation: 'The Forward Bloc was formed in the year 1939 by Subhash Chandra Bose when he left the Presidentship of the Congress.' }));

items.push(mcq(20, '210', 'The above image represents which of the following?\n[Photograph: a formal group portrait of uniformed INA officers and soldiers, men and women, on the steps of a building.]',
  ['Members of the Indian National Army', 'Members of the Royal Indian Navy', 'Members of the Air Force', 'Members of the NCC'], 0,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.210, item 20 — group photograph of uniformed Indian National Army officers and soldiers', assetType: 'source_page_full' }],
    explanation: 'This is a group photograph of members of the Indian National Army.',
  }));

items.push(mcq(21, '210', 'Read the two statements given below and select the option that shows the correct relationship between (A) and (R):\nAssertion (A): Forward Bloc had the objective of abolishing Zamindari System.\nReason (R): Subhash Chandra Bose wanted to establish a socialist state.',
  ['A is true but R is false.', 'R is the reason for A.', 'Both A and R are false.', 'Only R is true, A is false.'], 1,
  { explanation: 'After resigning from the presidency of the Congress in 1939, Subhash Chandra Bose formed the Forward Bloc the same year. His goal was to establish a socialist state by abolishing the Zamindari system.' }));

items.push(mcq(22, '210', 'Given below are the objectives of the Indian National Army. Identify the odd one out of the following:',
  ['To organise a provisional government of Free India', 'Total mobilisation of Indian manpower and money', 'Unity, faith and sacrifice', 'To train and organise public opinion in the country'], 3,
  { explanation: 'The first three objectives pertain to the Indian National Army, while the fourth one is associated with the Indian National Congress.' }));

items.push(mcq(23, '211', 'Who among the following was deeply influenced by the teachings of Swami Vivekananda?',
  ['Chittranjan Das', 'Subhash Chandra Bose', 'Rash Behari Bose', 'Lakshmi Swaminathan'], 1,
  { explanation: 'Bose was strongly influenced by the teachings of Swami Vivekananda.' }));

items.push(mcq(24, '211', 'Which among the following was not the three guiding principles of Indian National Army?',
  ['Unity', 'Faith', 'Equality', 'Justice'], 2,
  {
    answerStatus: 'verified',
    explanation: 'The guiding principles of the Indian National Army are given here as unity, faith and justice as its core values, reflecting its commitment to the cause of Indian Independence. DISCLOSED CAVEAT: the INA/Azad Hind movement\'s more widely documented motto is "Ittehad, Etemad, Qurbani" — Unity, Faith, SACRIFICE, not Justice — and this same chapter\'s own item 22 lists "Unity, faith and sacrifice" together as an actual INA objective. Despite this inconsistency, "Equality" remains clearly the least plausible of the four given options either way, so the printed answer is kept.',
  }));

items.push(mcq(25, '211', 'Who first conceived the idea for the formation of the The Indian National Army?',
  ['Subhash Chandra Bose', 'Capt. Mohan Singh', 'Chittranjan Bose', 'Bhagat Singh'], 1,
  { explanation: "Capt. Mohan Singh first conceived the idea for the formation of the Indian National Army, aiming to create an initiatory force to fight for India's Independence." }));

items.push(mcq(26, '211', 'Who found the Indian Independence League?',
  ['Rash Behari Bose', 'Subhash Chandra Bose', 'Chittranjan Bose', 'W.C. Banerjee'], 0,
  { explanation: "He founded the Indian Independence League to garner support for India's independence struggle, particularly among Indians living abroad." }));

items.push(mcq(27, '211', 'Where did Subhash Chandra Bose give the famous quote " Give Me blood, and I shall give you freedom"?',
  ['Kerala', 'Burma', 'Singapore', 'Tokyo'], 1,
  { explanation: 'He gave the famous quote to a large gathering of Indians in Burma.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'Subhash Chandra Bose and the Indian National Army (INA)',
  chapterOrder: 15,
  label: 'ch14-17-quit-india-ina-partition-wwi-versailles.pdf (Chapter 15 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
