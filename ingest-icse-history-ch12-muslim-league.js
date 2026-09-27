// ICSE Class 10 History & Civics — Chapter 12: "Formation and Objectives of
// the Muslim League". Uploaded 2026-09-17 as part of the combined
// chap_11-13.pdf, archived via archive-icse-history-ch11-13.js ->
// source_files.id 112 (this one physical file covers Chapters 11, 12 and
// 13 — see that script's header comment).
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch7-11): every printed answer checked
// against documented history of the Aligarh Movement, the founding of the
// All-India Muslim League (Dhaka, 30 Dec 1906), the Morley-Minto Reforms
// (1909), and the Lucknow Pact (1916), rather than constitutional articles.
// Two chronological/sequence items (item 12) and the four-way match (item
// 10) were independently re-verified against real event dates.
//
// DISCLOSED MINOR CAVEAT — item 10: the printed key pairs the "Mohmmedan
// Anglo-Oriental Defence Association" with 1906, but most historical
// accounts date that Association's founding to 1893 (1906 is more usually
// associated with the Muslim League's own founding). 1893 is not offered
// among the given date options, so the printed pairing is kept — disclosed
// as a likely source inaccuracy with no better option available.
//
// DISCLOSED MINOR CAVEAT — item 20: statement (i), which the key marks as
// TRUE, describes the Indian National Congress at the time of the 1916
// Lucknow Pact as "headed by Bal Gangadhar Tilak." The Congress's actual
// president at that session was Ambika Charan Majumdar (see item 14);
// Tilak led the party's nationalist/radical wing and was one of the Pact's
// chief architects, but did not hold the formal Congress presidency. This
// imprecision doesn't change which statement the key marks wrong (iii), so
// the printed answer is kept with the caveat disclosed.
//
// GENUINE DEFECT, FLAGGED needs_review — item 18: the printed options
// contain a duplicate — both option (b) and option (c) read "8 April,
// 1900" verbatim in the source (transcribed as printed below). Option (c)
// was almost certainly meant to read "18 April, 1900" — a plausible
// typesetting slip — since the actual, well-documented date of the Nagari
// Resolution (permitting Hindi/Devanagari-script petitions alongside
// Urdu/Persian) is 18 April 1900, not 8 April 1900. The printed key
// selects option (b), "8 April, 1900," which is not the correct historical
// date; kept as printed since no unambiguous corrected option exists among
// the four given, with the discrepancy disclosed here and in the item's
// own explanation.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 112;

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

items.push(mcq(1, '189', 'The All-India Muslim League was formally founded in ___.',
  ['30 December, 1906.', '24 December, 1905', '3 December, 1907', '5 December, 1906'], 0,
  { explanation: 'Nawab Salimullah proposed to form a central organisation to look exclusively after the interests of the Muslim Community. The proposal was accepted and the All-India Muslim League was formally founded on 30 December 1906.' }));

items.push(mcq(2, '189', 'In which year were the Morley-Minto reforms passed?',
  ['1908', '1909', '1911', '1919'], 1,
  { explanation: 'The Morley-Minto Reforms (Indian Councils Act) were passed in 1909, providing for separate representation of the Muslim Community.' }));

items.push(mcq(3, '189', 'The first Muslim political party of India was___.',
  ['Ghadar Party', 'All India Muslim League', 'Azad Hind Party', 'None of these'], 1,
  { explanation: 'The All India Muslim League was the first Muslim political party of India. The idea was that the Congress Party was only catering to the needs of the Hindus — an erroneous idea, since the Congress always meant to include every community of the country and had many Muslim leaders as members.' }));

items.push(mcq(4, '189', 'The First Session of the Muslim League was held in December 1908 at :',
  ['Agra', 'Delhi', 'Chandigarh', 'Amritsar'], 3,
  { explanation: 'The League was founded on 30 December 1906 at Dhaka — the Dhaka Session was presided over by Nawab Salimullah. Its first regular session, however, was held in December 1908 at Amritsar, under the Chairmanship of Syed Ali Imam.' }));

items.push(mcq(5, '189', 'The First Session of the Muslim League was held in under the Chairmanship of___',
  ['Syed Ali Imam.', 'Ahmad Khan', 'Bismillah Khan', 'Mohmmad Ali Jinnah'], 0,
  { explanation: 'The First Session, after the formal adoption of the League\'s Constitution, was held in December 1908 at Amritsar under the Chairmanship of Syed Ali Imam.' }));

items.push(mcq(6, '189', 'Sir Syed was a ___.',
  ['Congress Supporter', 'Social Reformer', 'Ulema', 'None of these'], 1,
  { explanation: 'Sir Syed was an educationist and social reformer. He advised the Muslims not to join the Congress. Sir Syed feared that when the British withdrew, the Hindus would play a dominant role in the political, economic and social affairs of the land.' }));

items.push(mcq(7, '190', 'Who referred to the Hindus and Muslims as "the two eyes of the beautiful Bride that was India".',
  ['Sir Syed Ahmad Khan', 'Bal Gangadhar Tilak', 'Gopal Krishna Gokhle', 'Lord Minto'], 0,
  { explanation: 'Syed (1817-1898) was a progressive nationalist. He referred to the Hindus and Muslims as "the two eyes of the beautiful Bride that was India".' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '8',
  sourcePage: '190',
  text: 'Consider the following statement. Find the wrong statement.\n(i) Sir Syed founded a school at Aligarh in 1878 developed into the Mohammedan Anglo-Oriental College.\n(ii) "According to Sir Syed, the British rule in India was permanent and irremovable, and therefore, the community could only flourish if it could win the favours of the British Government."\n(iii) Morley-Minto Reforms of 1909 provided for separate representation of the Muslim Community in the Imperial Legislative Council.\nCode:',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.190, item 8',
  parts: [
    {
      text: 'Which of the above statements is/are wrong?',
      options: ['i and ii', 'ii and iii', 'i', 'ii'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'Sir Syed founded a school at Aligarh in 1875 (not 1878), which was developed into the Mohammedan Anglo-Oriental College — statement (i) is the wrong one, with the year misstated. Statements (ii) and (iii) are accurate as printed.',
});

items.push(mcq(9, '190', 'Dhaka Session was presided over by___.',
  ['Nawab Salimullah', 'Hakim Ajmal Khan', 'Bahadur Ghulam', 'Mustafa Chowdhury'], 0,
  { explanation: 'Nawab Salimullah proposed to form a central organisation to look after the interests of the Muslim Community. The proposal was accepted and the All-India Muslim League was formally founded in December 1906. Its Dhaka Session was presided over by Nawab Salimullah.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '10',
  sourcePage: '190',
  text: 'Match the following.\n\nCOLUMN I\nI. The Indian Council Act\nII. Morley-Minto Reforms\nIII. Mohmmedan Anglo-Oriental Defence Association\nIV. Death of Sir Syed Ahmed Khan\n\nCOLUMN II\n(A) 1906\n(B) 1892\n(C) 1909\n(D) 1898',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.190, item 10',
  parts: [
    {
      text: 'Choose the correct option matching Column I to Column II.',
      options: ['I – b, II – c, III – a, IV – d', 'I – a, II – c, III – b, IV – d', 'I – d, II – c, III – a, IV – d', 'I – c, II – b, III – a, IV – d'],
      correct: 0,
      marks: 1,
    },
  ],
  explanation: 'The Indian Councils Act of 1892 (I-B) preceded the Morley-Minto Reforms of 1909 (II-C); Sir Syed Ahmad Khan died in 1898 (IV-D) — all three pairings are well documented. The pairing of the Mohmmedan Anglo-Oriental Defence Association of Upper India with 1906 (III-A) is the source\'s own answer; most historical accounts date that Association\'s founding to 1893 rather than 1906 (which is more usually associated with the Muslim League\'s own founding). 1893 is not offered among the given date options, so the printed pairing is kept, with this discrepancy disclosed.',
});

items.push(mcq(11, '190', 'The theme of the Aligarh Movement 1875 was :',
  ['Weightage in Representation', 'Liberty & representation of Muslims in the Central Legislative Council', 'Separate Electorate', 'Loyalty, approval and support of the Government'], 3,
  { explanation: 'The Anglo-Oriental College at Aligarh became the centre of a movement, popularly known as the Aligarh Movement. The theme of the Movement was loyalty, approval and support of the Government.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '12',
  sourcePage: '190',
  text: 'With reference to the Muslim League, consider the following events:\n1. The partition of Bengal was annulled.\n2. Morley-Minto Reforms provided for separate representation of the Muslim Community in the Imperial Legislative Council as well as Provincial Councils.\n3. Muhammad Ali Jinnah joined the league in 1913.\nWhat is the correct chronological sequence of the above events?',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.190, item 12',
  parts: [
    {
      text: 'Choose the correct chronological sequence.',
      options: ['1-2-3', '2-1-3', '3-2-1', '2-3-1'],
      correct: 1,
      marks: 1,
    },
  ],
  explanation: 'Independently re-verified against real dates: the Morley-Minto Reforms were passed in 1909 (event 2), Lord Hardinge annulled the Partition of Bengal in December 1911 (event 1), and Muhammad Ali Jinnah joined the Muslim League in 1913 (event 3). The correct chronological order is therefore 2-1-3, matching the printed key.',
});

items.push(mcq(13, '191', 'Which of the following was/were aims and objectives of Muslim League?',
  ["To promote Indian Muslims' feeling of Loyalty towards the British", 'To protect the political and other right of Muslims', 'To prevent the rise of any feeling of hostility between Muslims and other Communities', 'All of the above'], 3,
  { explanation: "The founding objectives of the Muslim League, adopted by the All-India Muslim League led by Muhammadan youths, were to promote among Indian Muslims a feeling of loyalty to the British Government, to protect and advance the political and other rights of Muslims, and to prevent the rise of hostile feelings among Muslims towards other communities — all of the above." }));

items.push(mcq(14, '191', 'Who was the President of Lucknow Session of Indian National Congress (1916)?',
  ['Mohammad Ali Jinnah', 'Ambika Charan Majumdar', 'Madan Mohan Malaviya', 'Annie Besant'], 1,
  { explanation: 'Ambika Charan Majumdar was the President of Lucknow Session of Indian National Congress (1916).' }));

items.push(mcq(15, '191', 'The Lucknow Pact was signed between the Indian National Congress and the Muslim League in:',
  ['1912', '1914', '1916', '1918'], 2,
  { explanation: 'In the 1916 Congress session at Lucknow, two major events occurred. The divided Congress became united, and the signing of the Lucknow Pact by the Congress and the Muslim League in 1916 marked an important step in the Hindu-Muslim unity.' }));

items.push(mcq(16, '191', "'Majlis-e-Ahrar (The Society of Freemen)' was established by___.",
  ['Ambika Charan Majumdar', 'Bahadur Ghulam', 'Hakim Ajmal Khan', 'Habibur Rahman'], 3,
  { explanation: "M. Rashid Ahmad of the Deoband School urged the Muslims not to be afraid of the Hindus simply because of their overwhelming majority. Many nationalist Muslims, including Habibur Rahman, joined the Congress. Later, on the advice of Abul Kalam Azad, he founded 'Majlis-e-Ahrar (The Society of Freemen)'. The Ahrars made great sacrifices in the cause of India's freedom." }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '17',
  sourcePage: '191',
  text: 'Consider the following statement in regards to the Congress Session during freedom struggle of India:\n1. Congress got reunited for the first time after the split of 1907.\n2. Muslim League and Congress came up with common political demands before the British Indian government.\nThe events given above took place in which session of Congress:',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.191, item 17',
  parts: [
    {
      text: 'Choose the correct session.',
      options: ['1911', '1912', '1916', '1920'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'In the session of Congress in 1916 at Lucknow, both the moderate and radical wings of Congress got reunited (the split had occurred at Surat in 1907). The Muslim League and Congress also came up with common political demands before the British Indian government via the Lucknow Pact.',
});

items.push(mcq(18, '192', 'The Government gave instructions that offices and courts should entertain petitions written in Hindi Devanagari script also on ______.',
  ['11 April, 1900', '8 April, 1900', '8 April, 1900', '30 April, 1900'], 1,
  {
    answerStatus: 'needs_review',
    explanation: 'TRANSCRIPTION NOTE: the source prints options (b) and (c) with identical text, "8 April, 1900" — reproduced verbatim here. Option (c) was almost certainly intended to read "18 April, 1900," a plausible typesetting slip, since the well-documented date of the Nagari Resolution (the government order permitting Hindi/Devanagari-script petitions alongside Urdu/Persian) is 18 April 1900, not 8 April 1900. The government gave these instructions on that date; Muslims called protest meetings in different parts of the Province in response. The printed key selects option (b), "8 April, 1900" — an inexact date given the duplicate/typo — kept as printed since no unambiguous corrected option is available among the four given.',
  }));

items.push(mcq(19, '192', '_______ was appointed the first honorary president of the Muslim League, though he did not attend the Dhaka inaugural session.',
  ['Mohammed Ali Jinnah', 'Sultan Muhammad Shah (Aga Khan III)', 'Bahadur Ghulam', 'Hakim Ajmal Khan'], 1,
  { explanation: 'Sultan Muhammad Shah (Aga Khan III) was appointed the first honorary president of the Muslim League, though he did not attend the Dhaka inaugural session.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '20',
  sourcePage: '192',
  text: 'Consider the following statement. Find the wrong statement.\n(i) Lucknow Pact (December 1916) was an agreement made by the Indian National Congress headed by Bal Gangadhar Tilak and the All-India Muslim League led by Muhammad Ali Jinnah.\n(ii) It was adopted by the Congress at its Lucknow session on December 29, 1916, and by the league on Dec. 31, 1916.\n(iii) The meeting at Lucknow marked the split of the moderate and radical wings also.\nCode:',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.192, item 20',
  parts: [
    {
      text: 'Which of the above statements is wrong?',
      options: ['i, ii', 'ii, iii', 'ii', 'iii'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: "Statement (iii) is the wrong one: the 1916 Lucknow session actually REUNITED the moderate and radical/extremist wings of the Congress (which had split at Surat in 1907) — it did not mark a further split. Statements (i) and (ii) are accurate as to the Pact's parties and adoption dates. DISCLOSED CAVEAT: statement (i)'s description of the Congress as being \"headed by\" Bal Gangadhar Tilak is loose — the Congress's official president at its 1916 Lucknow session was Ambika Charan Majumdar (see item 14); Tilak led the party's nationalist/radical wing and was a chief architect of the Pact, but did not hold the formal Congress presidency at the time. This imprecision does not change which statement the key marks wrong (iii).",
});

items.push(mcq(21, '192', 'Musim Deputation principal Demands were______.',
  ['Separate Communal', 'Reservation', 'Separate representation in Government Departments', 'None of these'], 0,
  { explanation: 'A Muslim Deputation waited upon the Viceroy on 1st October, 1906. It asked for (i) Separate Communal Electorates, (ii) Weightage in representation, (iii) Separate representation in Municipal and University bodies, (iv) Adequate Representation of the Muslims in all Civil, Military and Judicial Services, and (v) Help in founding a Muslim University.' }));

items.push(mcq(22, '192', 'Identify the person with given extract.\nHe provided for separate representation of the Muslim Community in the Imperial Legislative Council as well as Provincial Councils.',
  ['Lord Curzon', 'Lord Minto', 'Bantick', 'Mountbatten'], 1,
  { explanation: 'Lord Minto provided for separate representation of the Muslim Community in the Imperial Legislative Council as well as Provincial Councils, through the Morley-Minto Reforms.' }));

items.push(mcq(23, '192', 'Direct Results of the Formation of the League was:',
  ['League leaders tried to cut off Muslim masses from the national movement', 'The British did not support the formation of the League', 'League was not successful in sowing seeds of conflict between the two communities', 'None of the above'], 0,
  { explanation: 'Formation of the League tried to cut off Muslim masses from the national movement. The British welcomed the formation of the League, because they were successful in sowing seeds of conflict between the two communities.' }));

items.push(mcq(24, '192', 'Nationalist Muslims like M. Rashid Ahmad of the Deoband School, Habibur Rahman and Abul Kalam Azad urged Muslims______.',
  ['not to be afraid of Hindus', 'Afraid from Hindus', 'Start Protesting against Hindus', 'Deprived themselves from National Movement'], 0,
  { explanation: 'Nationalist Muslims like M. Rashid Ahmad of the Deoband School urged the Muslims not to be afraid of the Hindus because of their overwhelming majority. Many nationalist Muslims, including Habibur Rahman, joined the Congress later.' }));

items.push(mcq(25, '193', 'Who had severely criticised the Government order granting equal status to Hindi and Urdu in U.P?',
  ['Nawab Salimullah.', 'Nawab Mohsin-ul-Mulk', 'Sir Syad Ahmad Khan', 'Aga Khan'], 1,
  { explanation: 'After the death of Sir Syed in 1898, Nawab Mohsin-ul-Mulk led the Aligarh Movement. When the Hindi-Urdu controversy raged, he was the Secretary of the M.A.O. College Trust. He had severely criticised the Government order granting equal status to Hindi and Urdu in U.P.' }));

items.push(mcq(26, '193', 'Factor not responsible for the Growth of Communalism in India was:',
  ['The British policy of Divide and Rule', 'Educational and Economic Backwardness of the Muslim Community', 'General economic backwardness of the country', 'Repressive Policy'], 3,
  { explanation: 'Factors responsible for the growth of Communalism in India were the British policy of Divide and Rule, Educational and Economic Backwardness of the Muslim Community, and general economic backwardness of the country. Nationalists gave their nationalism a religious tinge — Sir Syed Ahmad Khan and the Aligarh Movement.' }));

items.push(mcq(27, '193', '_______ disliked the loyalist policies pursued by Sir Syed Ahmad Khan.',
  ['Aga Khan', 'Badruddin Tyabji', 'Saffudin', 'Salilmullah'], 1,
  { explanation: 'Many Muslims like Badruddin Tyabji disliked the loyalist policies pursued by Sir Syed Ahmad Khan. Badruddin Tyabji presided over the Congress Session at Madras in 1887.' }));

items.push(mcq(28, '193', 'Formation of Congress : 1885 :: Formation of Muslim League : ______. [Board Question]',
  ['1905', '1906', '1907', '1908'], 1,
  { explanation: 'The formation of the Muslim League took place in Dacca in the year 1906. Some of its founding members were Nawab Salimullah, Aga Khan and Muhammad Ali Jauhar.' }));

items.push(mcq(29, '193', 'Identify the odd one out of the following objectives of Muslim League:',
  ['To promote among Muslims of India, support for the British government', 'To remove any misconceptions regarding the intention of the government', 'To protect and advance the political rights and interests of the Muslims', 'To abolish the zamindari system'], 3,
  { explanation: 'The first three are the objectives of the Muslim League while the fourth one is not — abolishing the zamindari system was never among the League\'s stated objectives.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '30',
  sourcePage: '193',
  text: 'Read the two statements given below about the Muslim League and select the option that shows the correct relationship between (A) and (B).\n(A) The Muslim League launched the Direct Action Day.\n(B) The Muslim League signed the Lucknow Pact with the Congress.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.193, item 30',
  parts: [
    {
      text: 'Which option shows the correct relationship between (A) and (B)?',
      options: ['(B) contradicts (A).', '(B) is the reason for (A).', '(A) is true but (B) is false.', '(A) and (B) are independent of each other.'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: "Both (A) — the Muslim League's Direct Action Day of 1946 — and (B) — the League's 1916 Lucknow Pact with the Congress — are true, separate historical facts about the Muslim League from very different periods; neither causes, contradicts, nor explains the other, so (A) and (B) are independent of each other.",
});

items.push(mcq(31, '194', 'Who led the Aligarh movement after the death of Sir Syed Ahmad Khan in 1898?',
  ['John Morley', 'Nawab Mohsin Ul Mulk', 'Nawab Salimullah', 'Aga Khan III'], 1,
  { explanation: 'Nawab Mohsin Ul Mulk led the Aligarh movement after the death of Sir Syed Ahmed Khan in 1898.' }));

items.push(mcq(32, '194', 'Where was the All India Muslim League established in 1906?',
  ['Lucknow', 'Dhaka', 'Karachi', 'Shimla'], 1,
  { explanation: 'All India Muslim League was established on 30 December 1906. A conference took place under the control of Nawab Salim Ulla Khan of Dhaka.' }));

items.push(mcq(33, '194', 'Who wrote the principles of the Muslim League?',
  ['Nawab Salimullah', 'Maulana Mohammad Ali', 'Hakim Ajmal Khan', 'Aga Khan III'], 1,
  { explanation: 'Maulana Mohammad Ali wrote the principles of Muslim League.' }));

items.push(mcq(34, '194', 'Who was the first honorary president of the All India Muslim League ?',
  ['Hakim Ajmal Khan', 'Aga Khan III', 'Syed Ahmad Khan', 'Mazhar ul Haq'], 1,
  { explanation: 'Aga Khan III was the first honorary president of the All India Muslim League, chosen for his influential position and stature with the Muslim Community.' }));

items.push(mcq(35, '194', 'Who was known as the chief architect of the Lucknow pact in 1916 ?',
  ['Muhammad Ali Jinnah', 'Sir Syed Ahmed Khan', 'Lord Minto', 'Sarojini Naidu'], 0,
  { explanation: 'Muhammad Ali Jinnah was known as the chief architect of the Lucknow pact in 1916. The pact aimed to promote Hindu-Muslim unity and address the political demands of both communities within British India.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'Formation and Objectives of the Muslim League',
  chapterOrder: 12,
  label: 'ch11-13-partition-bengal-muslim-league-gandhi-popular-movement.pdf (Chapter 12 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
