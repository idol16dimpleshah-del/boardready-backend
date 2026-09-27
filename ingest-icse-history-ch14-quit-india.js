// ICSE Class 10 History & Civics — Chapter 14: "Events Leading to the Quit
// India Movement (1935-1943)". Uploaded 2026-09-17 as part of the combined
// chap_14-17.pdf, archived via archive-icse-history-ch14-17.js ->
// source_files.id 113 (this one physical file covers Chapters 14, 15, 16
// and 17 — see that script's header comment).
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch7-13): every printed answer checked
// against documented history of the 1939 Congress ministries' resignation,
// the August Offer (1940), the Individual Satyagraha, the Cripps Mission
// (1942), and the Quit India Movement, rather than trusted from the
// printed key. The chronological-sequence item (14) was independently
// re-verified against real event dates.
//
// DISCLOSED MINOR CAVEAT — item 14: the item's own explanation dates the
// "Cripps Mission" event to "July 1942," but Cripps actually arrived in
// India and the mission concluded (failed) in March-April 1942. This does
// not affect the correct chronological ordering (event I still falls
// between event IV [March 1940] and event II [August 1942] either way).
//
// GENUINE DEFECT, FLAGGED needs_review and CORRECTED — item 17: the
// printed key selects code (a), "I – B, II – A, III – D, IV – C," pairing
// "August Offer" with "Indian National Army" and "Subhash Chandra Bose"
// with "Lord Linlithgow." Neither pairing is historically coherent — the
// August Offer (1940) was made by Viceroy Lord Linlithgow, and Subhash
// Chandra Bose founded/led the Indian National Army. The correct mapping —
// August Offer→Lord Linlithgow (C), Sir Stafford Cripps→Cripps Mission (A),
// Winston Churchill→PM of UK (D), Subhash Chandra Bose→INA (B) — is
// offered verbatim as code (b), "I – C, II – A, III – D, IV – B." Corrected
// to option (b), matching documented history; the printed key's letter
// choice is disclosed as the defect.
//
// GENUINE DEFECT, FLAGGED needs_review — item 26: the printed key answers
// "The Congress turned into a Socialist Party" as the significant outcome
// of the Quit India Movement, but this is not documented history — the
// INC did not become a socialist party as a result of Quit India (the
// separate Congress Socialist Party had already existed within the INC as
// a faction since 1934). The item's own printed explanation doesn't even
// support this answer: "People from all religious committees and even
// princely states participated in it" describes broad-based mass
// participation, not any transformation into socialism. Kept the printed
// answer per source (no better-supported option exists among the four
// given), with the mismatch between question, answer and explanation
// fully disclosed.
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

items.push(mcq(1, '202', "On being arrested for his 'Quit India' programme, where was Gandhiji detained?",
  ['Yerwada Jail', 'Byculla Prison', 'Aga Khan Palace Jail', 'Ahmedabad Prison'], 2,
  { explanation: 'The beginning of the Quit India movement resulted in the arrest of all the big leaders of the Congress. Gandhiji was put into the Aga Khan Palace jail.' }));

items.push(mcq(2, '202', 'The historic August session of the All-India Congress Committee in which the Quit India Resolution was passed, was held at Gowalia Tank Maidan in ______.',
  ['Bombay', 'Calcutta', 'Ahmedabad', 'Amritsar'], 0,
  { explanation: 'The resolution for the Quit India was passed from the Gowalia Tank in Bombay on August 8, 1942.' }));

items.push(mcq(3, '202', 'In which year did Mahatma Gandhi start the Quit India Movement?',
  ['1940', '1942', '1944', '1946.'], 1,
  { explanation: 'All India Congress Committee met at Bombay on 8 August 1942 and passed the Quit India Resolution.' }));

items.push(mcq(4, '202', "The 'Mantra' given by Gandhiji during the Quit India Movement:",
  ['An eye for eye only ends up making the whole world blind.', "'Do or Die.'", "'If you don't ask, you don't get it.'", "'Hate the sin, love the sinner.'"], 1,
  { explanation: 'During the Quit India Movement, Gandhiji gave the famous slogan of "Do or Die."' }));

items.push(mcq(5, '202', "The 'August Offer' was made by:",
  ['Viceroy Lord Linlithgow', 'Muhammad Ali Jinnah', 'Mahatma Gandhiji', 'Viceroy Lord Irwin'], 0,
  { explanation: 'The famous August Offer was made by the Viceroy Linlithgow during World War II.' }));

items.push(mcq(6, '202', "What was the Muslim League's reaction to the resignation of Congress Ministries?",
  ["Celebrated the day as 'Independence Day.'", "Celebrated the day as 'Day of Deliverance.'", 'Stood by the Congress leaders against the British.', 'Started to foster Hindu-Muslim unity.'], 1,
  { explanation: "The Muslim League was jubilant over the resignation of Congress Ministers and offered its friendship to the British Government. It celebrated the day when the Congress ministries resigned as a 'day of deliverance'." }));

items.push(mcq(7, '203', "What was the British Government's reaction to the resignation of Congress Ministries?",
  ['Felt relieved as the Congress controlled eight out of the eleven provinces.', 'Rejected the resignations and reinstated the Congress leadership.', 'Requested the Muslim League to control the provinces.', 'Prisoned all the Congress Ministries.'], 0,
  { explanation: 'The British government was very relieved by the resignation of the Congress ministries as it controlled eight out of the eleven provinces.' }));

items.push(mcq(8, '203', 'Individual Satyagraha started on:',
  ['3rd July 1937.', '8th August 1942.', '1st June 1940.', '17th October 1940.'], 3,
  { explanation: 'Individual Satyagraha was started from Paunar, near Wardha on October 17, 1940.' }));

items.push(mcq(9, '203', 'The proposal of Cripps Mission regarding the Princely States:',
  ['Any province not willing to join the Union could have a separate constitution and form a separate Union.', 'Princely States give full protection to religious and racial minorities.', 'Princely States follow the Divide and Rule policy.', 'Princely States had to be a part of India or Pakistan.'], 0,
  { explanation: 'Under the Cripps Mission, the Princely States were given the freedom to choose that they want to join the Union or not or want to remain independent.' }));

items.push(mcq(10, '203', 'Sir Stafford Cripps was sent to India to:',
  ['Plan Partition of India.', 'Assure Muslim League of their role in the constitutional scheme.', 'Divide Pakistan into East and West Pakistan.', 'Break the political deadlock between Indian leaders and the British Government.'], 3,
  { explanation: 'With the Japanese army rapidly advancing towards India, it became necessary for the British to break the political deadlock between the India leaders and the British government.' }));

items.push(mcq(11, '203', 'Important proposal of Cripps Offer was:',
  ['Viceroy would be the head of the Indian Union.', 'Creation of 2 states.', 'India would be given Dominion Status after the end of the war.', 'No Constituent Assembly would be set up.'], 2,
  { explanation: 'The Cripps Mission agreed to give the dominion status to the India after the end of the World War II.' }));

items.push(mcq(12, '204', 'The Quit India Resolution was passed on:',
  ['8th August 1942 in Calcutta.', '8th August 1942 in Bombay.', 'July 1942 in Wardha.', 'June 1, 1940.'], 1,
  { explanation: 'The famous Quit India Resolution was passed from the Gowalia Tank in Bombay on 8th August 1942.' }));

items.push(mcq(13, '204', 'Quit India Resolution stated:',
  ['India is joining the British in the Second World War.', 'British Rule in India must end immediately.', 'India will be partitioned into 2 nations.', "British to leave India in God's hands."], 1,
  { explanation: 'Mahatma Gandhi felt that the British presence in India was an invitation to Japan to invade India and that their withdrawal would remove the bait. The Congress Working Committee met at Wardha in July, 1942. It adopted a resolution, known as the Quit India Resolution. The resolution stated, "British rule in India must end immediately".' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '14',
  sourcePage: '204',
  text: 'Arrange the following events during the Indian struggle for independence in correct chronological order (from the earliest to the latest):\nI. Churchill announces the Cripps Mission.\nII. Quit India Resolution was passed by the Congress.\nIII. Congress ministries in the provinces resign against the war policy of the British Govt.\nIV. Lahore session of the Muslim League passes the Pakistan Resolution.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.204, item 14',
  parts: [
    {
      text: 'Choose the correct chronological order.',
      options: ['II, I, IV, III', 'IV, III, II, I', 'I, II, III, IV', 'III, IV, I, II'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: 'Independently re-verified against real dates: the Congress ministries resigned in late 1939 (event III), the Muslim League passed the Pakistan (Lahore) Resolution in March 1940 (event IV), Churchill\'s government announced the Cripps Mission in March 1942 (event I; the mission itself concluded/failed in India by April 1942, not "July 1942" as the source\'s own explanation states — a minor dating imprecision that doesn\'t affect the ordering), and the Quit India Resolution was passed in August 1942 (event II). The correct order is therefore III, IV, I, II, matching the printed key.',
});

items.push(mcq(15, '204', 'After failure of the ................, there was a feeling of frustration among all the sections of people.',
  ['Cabinet Mission', 'Cripps Mission', 'Simon Commission', 'August Offer'], 1,
  { explanation: 'The failure of the Cripps Mission left no further meeting ground between the British Government and the congress, which led to a great deal of frustration among the India people as it revealed the true character of the British.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '16',
  sourcePage: '204',
  text: 'Match List I with List II and select the correct answer by using the codes given below the lists:\n\nList I\nI. Bombay session of INC\nII. Lahore session of INC\nIII. Karachi session of INC\nIV. Lahore session of Muslim League\n\nList II\n(A) Declaration of Independence of India\n(B) Resolution on fundamental rights\n(C) Resolution for Pakistan\n(D) Quit India Movement',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.204, item 16',
  parts: [
    {
      text: 'Choose the correct code.',
      options: ['I – B, II – A, III – C, IV – D', 'I – A, II – D, III – C, IV – B', 'I – A, II – D, III – B, IV – C', 'I – D, II – A, III – B, IV – C'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: 'Independently re-verified: the Bombay AICC session (August 1942) passed the Quit India Resolution (I-D); the Lahore session of the INC (December 1929) issued the Declaration of (Purna Swaraj) Independence (II-A); the Karachi session of the INC (1931) passed the Resolution on Fundamental Rights and National Economic Policy (III-B); the Lahore session of the Muslim League (March 1940) passed the Resolution for Pakistan (IV-C). All four pairings check out.',
});

items.push({
  kind: 'case',
  sourceQuestionNumber: '17',
  sourcePage: '205',
  text: 'Match List I with List II and select the correct answer by using the codes given below the lists:\n\nList I\nI. August Offer\nII. Sir Stafford Cripps\nIII. Winston Churchill\nIV. Subhash Chandra Bose\n\nList II\n(A) Cripps Mission\n(B) Indian National Army\n(C) Lord Linlithgow\n(D) Prime Minister of United Kingdom',
  diagramStatus: 'not_applicable',
  answerStatus: 'needs_review',
  answerKeyRef: 'printed Ans., p.205, item 17',
  parts: [
    {
      text: 'Choose the correct code.',
      options: ['I – B, II – A, III – D, IV – C', 'I – C, II – A, III – D, IV – B', 'I – D, II – A, III – C, IV – B', 'I – C, II – A, III – B, IV – D'],
      correct: 1,
      marks: 1,
    },
  ],
  explanation: 'CORRECTED FROM PRINTED KEY: the source prints "Ans. (a) I – B, II – A, III – D, IV – C," pairing the August Offer with the Indian National Army and Subhash Chandra Bose with Lord Linlithgow — neither pairing is historically coherent. The August Offer (1940) was made by Viceroy Lord Linlithgow (I-C, not I-B); Sir Stafford Cripps led the Cripps Mission (II-A, matches printed key); Winston Churchill was Prime Minister of the United Kingdom (III-D, matches printed key); Subhash Chandra Bose founded and led the Indian National Army (IV-B, not IV-C). The historically correct combination — I-C, II-A, III-D, IV-B — is offered verbatim as option (b) among the four given. Corrected to option (b); the printed key\'s letter choice (a) is disclosed as the defect.',
});

items.push(mcq(18, '205', 'Assertion (A): The Indian National Congress launched the Quit India Movement on August 8, 1942.\nReason (R): India was drawn into the Second World War without consulting Indians.',
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 1,
  { explanation: 'The famous Quit India Resolution was passed on 8 August 1942. The British Government of India had, separately, immediately joined the war without consulting the Indians back in 1939 — both A and R are true statements, but R (a longer-standing 1939 grievance) is not the specific, immediate explanation for the movement\'s 1942 launch (which followed the failure of the Cripps Mission); therefore Congress asked its Ministries to resign and later launched Quit India.' }));

items.push(mcq(19, '205', 'Study the picture given and choose the correct option:\n[Photograph: a European man in a suit standing beside Gandhiji, who is in traditional dhoti with a walking stick.]\nThe two main leaders in the picture are:',
  ['Viceroy Lord Irwin and Gandhiji.', 'Jinnah and Gandhiji.', 'Sir Stafford Cripps and Gandhiji', 'Sir Stafford Cripps and Nehru'], 2,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.205, item 19 — photograph of Sir Stafford Cripps standing with Mahatma Gandhi', assetType: 'source_page_full' }],
    explanation: 'In the given picture, Mahatma Gandhi is represented with Sir Stafford Cripps.',
  }));

items.push(mcq(20, '205', 'Complete the given analogy.\nSir Stafford Cripps : Cripps Mission :: Lord Linlithgow : ?',
  ['August Offer', 'Communal Award', 'Cabinet Mission', 'Dominion Status'], 0,
  { explanation: 'The August Offer was led by the Lord Linlithgow, but it proved to be unsuccessful.' }));

items.push(mcq(21, '206', 'Complete the given analogy.\nCivil Disobedience Movement : Lord Irwin :: Quit India Movement : ?',
  ['Lord Mountbatten', 'Lord Minto', 'Lord Chelmsford', 'Lord Linlithgow'], 3,
  { explanation: 'At the time when the Quit India Movement was launched, Lord Linlithgow was the Viceroy of India.' }));

items.push(mcq(22, '206', '_________ was one of the causes of the Quit India Movement. [Board Question]',
  ['Failure of the Second Round Table Conference', 'Rowlatt Act', 'Mountbatten Plan', 'Failure of the Cripps Mission'], 3,
  { explanation: 'The British government in the year 1942 sent Sir Stafford Cripps to draw up a plan for India to decide its constitution after the war. However, this plan was not accepted by the Congress, and soon after it started the Quit India Movement in August, 1942.' }));

items.push(mcq(23, '206', 'Who was known as the first Satyagrahi?',
  ['Brahma Datt', 'Acharya Vinobha Bhave', 'J.L. Nehru', 'Gandhi'], 1,
  { explanation: 'Acharya Vinobha Bhave was the first Satyarahi selected by Mahatma Gandhi to launch individual Satyagraha campaign.' }));

items.push(mcq(24, '206', 'What was one of the reasons for the failure of the Cripps Mission?',
  ['It had no provision to safeguard the interests of the depressed classes.', 'It would allow the British to stop the manufacture of Indian goods.', 'It asked for Indian soldiers to be sent to fight the World War.', 'It allowed for giving full weightage to the opinion of Indian political leaders.'], 0,
  { explanation: 'This lack of provision was one of the reasons for the failure of the Cripps mission.' }));

items.push(mcq(25, '206', 'Where did the Congress Working Committee meet to adopt the resolution that was popularly known as the Quit India Resolution?',
  ['Wardha', 'Lucknow', 'Poona', 'Allahabad'], 0,
  { explanation: 'The Congress Working committee meet in Wardha in 1942 to adopt the Quit India Resolution.' }));

items.push(mcq(26, '206', 'What was the one significant outcome of the Quit India Movement?',
  ['The Congress turned into a Socialist Party', 'It led to the formation of two nations', 'It led to the freedom of Bengal', "It prevented India's entry into the World War"], 0,
  {
    answerStatus: 'needs_review',
    explanation: 'DISCREPANCY: this printed answer is not supported by documented history — the INC did not become a socialist party as an outcome of the Quit India Movement (a separate Congress Socialist Party faction had already existed within the INC since 1934). The item\'s own printed explanation doesn\'t support this answer either: "People from all religious committies and even princely states participated in it" describes broad, cross-community mass participation, not any transformation into socialism. None of the other three options is well-supported either. Kept the printed answer per source, with this mismatch between question, answer, and explanation disclosed.',
  }));

items.push(mcq(27, '206', 'At which session in 1927 did the Indian National Congress decide to boycott the Simon Commission?',
  ['Bombay', 'Kolkata', 'Madras', 'Lucknow'], 2,
  { explanation: 'At its Madras session in 1927 the Indian National Congress decided to boycott the Simon Commission.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'Events Leading to the Quit India Movement (1935-1943)',
  chapterOrder: 14,
  label: 'ch14-17-quit-india-ina-partition-wwi-versailles.pdf (Chapter 14 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
