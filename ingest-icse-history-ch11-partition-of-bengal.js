// ICSE Class 10 History & Civics — Chapter 11: "The Partition of Bengal".
// Uploaded 2026-09-17 as part of the combined chap_11-13.pdf, archived via
// archive-icse-history-ch11-13.js -> source_files.id 112 (this one physical
// file covers Chapters 11, 12 and 13 — see that script's header comment).
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch7-10): every printed answer checked
// against documented history of the 1905 Partition of Bengal, the Swadeshi
// Movement, and the Extremist leadership (Tilak, Bipin Chandra Pal) rather
// than constitutional articles or arithmetic. The two chronological-
// ordering items (item 21, and the Column-matching item 6) were
// independently re-verified against each event's actual historical date.
//
// DISCLOSED MINOR CAVEAT — item 9: the printed answer for when Tilak
// revived the Shivaji festival is 1894; some other sources date this to
// 1895 (with the Ganapati festival dated 1893, per Ch10 item 22). Genuine
// minor variance exists across sources on this specific date; kept as
// printed since it is not clearly wrong, just not universally the date
// cited elsewhere.
//
// DIAGRAM NOTE — item 32 presents an actual map-plus-statistics-table
// graphic ("Bengal (1905-1911)": a map of the bifurcated provinces next to
// an Area/Population/Muslims data table for old Bengal vs. the new Eastern
// Bengal & Assam), which the question explicitly references as "the above
// incident." Marked diagramStatus: 'source_diagram_preserved' with a
// visual link to the source page — the map+table is content, not
// decoration, distinct from every other chapter's plain-text data tables.
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

items.push(mcq(1, '183', 'In which year The Partition of Bengal made by Lord Curzon?',
  ['1905', '1907', '1908', '1909'], 0,
  { explanation: 'The Partition of Bengal was carried out by Lord Curzon in 1905.' }));

items.push(mcq(2, '183', "The 'Swadeshi' and 'Boycott' were adopted as methods of struggle for the first time during the:",
  ['Agitation against the Partition of Bengal', 'Home Rule Movement', 'Non-Cooperation Movement', 'Visit of the Simon Commission to India'], 0,
  { explanation: 'Swadeshi and Boycott were adopted as methods of struggle for the first time during the agitation against the Partition of Bengal.' }));

items.push(mcq(3, '183', 'With reference to the Swadeshi Movement, consider the following statements:\n1. It contributed to the promotion of the indigenous artisan crafts and industries.\n2. The National Council of Education was established as a part of the Swadeshi Movement.\nWhich of the statements given above is/are correct?',
  ['Only 1', 'Only 2', 'Both 1 and 2', 'Neither 1 nor 2'], 2,
  { explanation: 'The Swadeshi Movement contributed to the promotion of indigenous artisan crafts and industries, and the National Council of Education was established in 1906 as part of the Movement — both statements are correct.' }));

items.push(mcq(4, '183', '________ was observed as a day of national mourning throughout Bengal.',
  ['16 Oct. 1905', '20 Nov. 1905', '24 Sept. 1905', '18 Oct. 1905'], 0,
  { explanation: '16 October 1905, the day the Partition of Bengal took effect, was observed as a day of national mourning throughout Bengal.' }));

items.push(mcq(5, '183', "Asertion: The leaders widely participated to propagate the message of a boycott of Manchester cloth and Liverpool salt.\nReason: On August 7, 1906, at Calcutta Town Hall, the Boycott Resolution was passed which was considered as the formal proclamation of the Swadeshi Movement.\nCode:",
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 2,
  { explanation: 'Leaders did widely propagate the boycott of Manchester cloth and Liverpool salt (A is true). However, the Boycott Resolution at Calcutta Town Hall — the formal proclamation of the Swadeshi Movement — was actually passed on August 7, 1905, not 1906 as stated in the Reason; the year given in R is incorrect, making R false.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '6',
  sourcePage: '183',
  text: 'Match the following.\n\nCOLUMN I\nI. Amar Sonar Bangla\nII. 16th October, 1905\nIII. Dadabhai Naoroji\nIV. Swadeshi Movement\n\nCOLUMN II\n(A) Mourning Day\n(B) Rabindranath Tagore\n(C) Banaras Session of 1905\n(D) Calcutta Session of 1906',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.183, item 6',
  parts: [
    {
      text: 'Choose the correct option matching Column I to Column II.',
      options: ['I – b, II – a, III – d, IV – c', 'I – c, II – a, III – b, IV – d', 'I – b, II – c, III – a, IV – d', 'I – a, II – b, III – d, IV – c'],
      correct: 0,
      marks: 1,
    },
  ],
  explanation: "'Amar Sonar Bangla' was written by Rabindranath Tagore (I-B); 16 October 1905 was observed as the Mourning Day marking the Partition's effect (II-A); Dadabhai Naoroji presided over the 1906 Calcutta Session of Congress, where he declared 'Swaraj' as its goal (III-D); the Swadeshi Movement was formally proclaimed via the Boycott Resolution associated with the 1905 Banaras/Calcutta-era agitation, here matched to the Banaras Session of 1905 (IV-C).",
});

items.push(mcq(7, '184', 'Lord Curzon was the Governor General and Viceroy of India from ____ to ____.',
  ['1899, 1905', '1900, 1905', '1900, 1906', '1899, 1906'], 0,
  { explanation: 'Lord Curzon served as Governor-General and Viceroy of India from 1899 to 1905.' }));

items.push(mcq(8, '184', 'Who among the following is not the chief architect of Swadeshi Movement?',
  ['Aurobindo Ghosh', 'Mahatma Gandhi', 'Bal Gangadhar Tilak', 'Bipin Chandra Pal'], 1,
  { explanation: 'Mahatma Gandhi was not involved in the Swadeshi Movement (1905-08) in India — he was still in South Africa at the time, returning to India only in 1915. Aurobindo Ghosh, Tilak and Bipin Chandra Pal were among its chief architects.' }));

items.push(mcq(9, '184', 'In which year Tilak revived the Shivaji festival?',
  ['1890', '1894', '1900', '1905'], 1,
  { explanation: 'Bal Gangadhar Tilak revived/organised the Shivaji festival around 1894-95 (sources vary slightly on the exact year) as a means of raising national and religious consciousness in Maharashtra, alongside his 1893-started Ganapati festival.' }));

items.push(mcq(10, '184', 'Who was the father of Indian Unrest?',
  ['Bal Gangadhar Tilak', 'Dadabhai Naoroji', 'Bipin Chandra Pal', 'Lala Lajpat Rai'], 0,
  { explanation: 'Bal Gangadhar Tilak was called the "Father of Indian Unrest" by the British (an epithet coined by the journalist Valentine Chirol) for his role in stirring assertive nationalist sentiment.' }));

items.push(mcq(11, '184', 'The Swadeshi Movement was a consequence of the announcement of the _____ by Lord Curzon.',
  ['Swaraj', 'Quit India', 'Partition of Bengal', 'None of these'], 2,
  { explanation: 'When Lord Curzon, Viceroy of India, announced the partition of Bengal in July 1905, the Indian National Congress initiated the Swadeshi movement in Bengal in response.' }));

items.push(mcq(12, '184', "________ were the believers of liberalism and moderate politics and came to be labelled as Moderates. They were also called 'Early Nationalists'.",
  ['B. R. Ambedkar, Gandhi', 'B.G. Tilak, Lala Lajpat Rai, Aurobindo Ghosh, Bipin Chandra Pal', 'M.G. Ranade, G.S. Iyer, G.K. Gokhale', 'None of the above'], 2,
  { explanation: 'M.G. Ranade, G. Subramania Iyer and G.K. Gokhale were believers in liberalism and moderate/constitutional politics, and were labelled Moderates or Early Nationalists.' }));

items.push(mcq(13, '184', "Lord Curzon's argument in favour of the partition of Bengal was ________.",
  ['Administrative necessity', 'Social Welfare', 'better amenities', 'Security'], 0,
  { explanation: 'Lord Curzon justified the partition of Bengal on the grounds of administrative necessity, given the province\'s large size.' }));

items.push(mcq(14, '184', "Who had founded the English weekly 'New India'?",
  ['Lala Lajpat Rai', 'Bal Gangadhar Tilak', 'Bipin Chandra Pal', 'Aurobindo Ghosh'], 2,
  { explanation: 'Bipin Chandra Pal founded and edited the English weekly journal New India, and preached swaraj through it.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '15',
  sourcePage: '184',
  text: 'Which one among the following statements about Partition is correct?\n1. The Bengal partition took place on October, 1905 and separated the largely Muslim Eastern areas from the largely Hindu Western areas.\n2. Bengal was the nerve centre of Indian Nationalism at that time. So, the British hoped to stop the rising tide of nationalism by partitioning Bengal.\n3. The partition was meant to foster division on the basis of language.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.184-185, item 15',
  parts: [
    {
      text: 'Which of the above statements is/are correct?',
      options: ['1 only', '2 and 3 only', 'Both 1 and 2', 'Neither 1 nor 2'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'Statements 1 and 2 are both accurate: the October 1905 partition did split largely Muslim Eastern areas from largely Hindu Western areas, and Bengal — the nerve centre of Indian nationalism — was targeted partly to check the rising nationalist tide. Statement 3, that the partition was meant to foster division on the basis of language, is not correct; it was driven by administrative and religious/communal divide-and-rule considerations, not linguistic ones.',
});

items.push(mcq(16, '185', 'The Swadeshi Movement evoked serious responses in:',
  ['Madras and Hyderabad', 'Bihar and Awadh', 'Bengal and Maharashtra', 'Delhi and Gujarat'], 2,
  { explanation: 'The Swadeshi Movement evoked serious, widespread responses particularly in Bengal and Maharashtra.' }));

items.push(mcq(17, '185', 'Outstanding leaders of "Assertive Nationalism" were ________.',
  ['Lala Hardayal, Madanlal Dhingra', 'Lal-Bal-Pal trio', 'Gokhle and Lala Lajpat Rai', 'None of these'], 1,
  { explanation: 'The outstanding leaders of Assertive Nationalism were the Lal-Bal-Pal trio — Lala Lajpat Rai, Bal Gangadhar Tilak, and Bipin Chandra Pal.' }));

items.push(mcq(18, '185', 'The partition of Bengal was an attempt to prevent ________ & ________ from getting united.',
  ['Christians, Hindus', 'Muslims, Hindus', 'Muslims, Christians', 'Christians, Hindus'], 1,
  { explanation: 'The partition of Bengal was, in substance, an attempt by the British to prevent Muslims and Hindus from uniting against colonial rule, exploiting the province\'s religious geography.' }));

items.push(mcq(19, '185', 'Who among the following led the movement against the partition of Bengal (1905)?',
  ['Ashutosh Mukherjee', 'Rabindranath Tagore', 'Surendranath Banerjee', 'C.R. Das'], 2,
  { explanation: 'Surendranath Banerjee led the movement against the partition of Bengal in 1905.' }));

items.push(mcq(20, '185', 'Vande Mataram was first adopted as a slogan for which of the following incident?',
  ['Revolt of 1857', 'Partition of Bengal in 1905', 'Non-Cooperation Movement in 1922', 'Quit India Movement in 1942'], 1,
  { explanation: "'Vande Mataram' was first adopted as a rallying slogan of struggle in connection with the agitation against the Partition of Bengal in 1905." }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '21',
  sourcePage: '185',
  text: 'With reference to Indian freedom struggle, consider the following events:\n1. Establishment of the National Council of Education\n2. The Split in the Congress\n3. Minto-Morley constitutional reforms\nWhat is the correct chronological sequence of the above events?',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.185, item 21',
  parts: [
    {
      text: 'Choose the correct option.',
      options: ['2, 1, 3', '1, 2, 3', '3, 2, 1', '2, 3, 1'],
      correct: 1,
      marks: 1,
    },
  ],
  explanation: 'By actual date: the National Council of Education was established in 1906, the Indian National Congress split at Surat in December 1907, and the Indian Councils Act (Minto-Morley Reforms) was passed in 1909 — i.e. 1, 2, 3, independently confirmed against each event\'s date, matching the printed key.',
});

items.push(mcq(22, '185', 'Who gave the nation a four-pronged program - boycott, swadeshi, swaraj and national education?',
  ['Dadabhai Naoroji', 'Bal Gangadhar Tilak', 'Mahatma Gandhi', 'Aurobindo Ghosh'], 1,
  { explanation: 'Bal Gangadhar Tilak is credited with giving the nation this four-pronged program of boycott, swadeshi, swaraj and national education.' }));

items.push(mcq(23, '185', "Who authored the book 'The New Economic Menace of India'?",
  ['Mahatma Gandhi', 'Dadabhai Naoroji', 'Bipin Chandra Pal', 'Aurobindo Ghosh'], 2,
  { explanation: "Bipin Chandra Pal authored 'The New Economic Menace of India'." }));

items.push(mcq(24, '185', "Who started the monthly magazine 'Young India'?",
  ['Mahatma Gandhi', 'Annie Besant', 'B G Tilak', 'Lajpat Rai'], 3,
  { explanation: "Lala Lajpat Rai started the monthly magazine 'Young India', which he edited during his period of exile in the United States." }));

items.push(mcq(25, '186', 'The new Province called East Bengal and Assam was constituted by combining:',
  ['Bihar, Orissa and Bengali-speaking districts of modern Assam', 'Assam and Chittagong with fifteen districts.', 'Assam and Bihar', 'Chittagong and Bihar'], 1,
  { explanation: 'The new Province of East Bengal and Assam was constituted by combining Assam and Chittagong with fifteen districts of old Bengal. Its capital was Dacca (modern Dhaka), with a subsidiary headquarters at Chittagong.' }));

items.push(mcq(26, '186', 'Assertion: (A) The Province of Bengal comprised, besides Bengal proper, Bihar, Orissa (now called Odisha), Chhotanagpur and Bengali-speaking districts of modern Assam.\nReason: (R) Lord Curzon\'s most unpopular measure was the Partition of Bengal, which was announced in 1903 and carried out in 1905.',
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 0,
  { explanation: 'The pre-partition Province of Bengal indeed comprised Bengal proper, Bihar, Orissa (Odisha), Chhotanagpur and the Bengali-speaking districts of modern Assam (A is true); Lord Curzon\'s most unpopular measure was this very Partition of Bengal, first floated around 1903 and carried out in 1905 (R is true and explains the scale/significance of what was partitioned in A).' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '27',
  sourcePage: '186',
  text: 'Consider the following statement. Find the wrong statement.\n(i) Partition of Bengal became effective from 16 October, 1905.\n(ii) Anand Mohan Bose laid the foundation of a Federation Hall, which was to be the symbol of the unity of Bengal, a meeting ground of the Eastern and Western Bengal.\n(iii) Swadeshi Movement was successful to destabilise the Government.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.186, item 27',
  parts: [
    {
      text: 'Which is the wrong statement?',
      options: ['i and ii only', 'ii and iii only', 'iii only', 'ii only'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'Statements (i) and (ii) are historically accurate — the partition took effect 16 October 1905, and Anand Mohan Bose did lay the foundation of a Federation Hall as a symbol of Bengali unity. Statement (iii) is the wrong one: the Swadeshi Movement, while raising national consciousness significantly, did not actually succeed in destabilising the British government, which remained firmly in control throughout.',
});

items.push(mcq(28, '186', 'Tilak spread the message of "Liberty & Justice" through________.',
  ['The Mahratta and Kesari', 'Swaraj', 'Young India', 'The Call to Young India'], 0,
  { explanation: 'Tilak spread the message of "Liberty and Justice" through his weeklies The Mahratta and Kesari.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '29',
  sourcePage: '186',
  text: 'Find the pair which is incorrect.\n\ni. Celebration of Ganpati & Shivaji Festivals — Bal Gangadhar Tilak\nii. The Call to Young India — Lala Lajpat Rai\niii. Vande Mataram — Bankim Chandra Chatterjee\niv. The Spirit of Indian Nationalism — Bipin Chandra Pal',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.186, item 29',
  parts: [
    {
      text: 'Which pair is incorrect?',
      options: ['i and ii', 'ii and iii', 'iii', 'iv'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: 'Pairs (i), (ii) and (iii) are correctly matched (Tilak with the Ganpati/Shivaji festivals, Lajpat Rai with The Call to Young India, and Bankim Chandra Chatterjee as composer of Vande Mataram). Pair (iv), attributing "The Spirit of Indian Nationalism" to Bipin Chandra Pal, is the incorrect pairing as printed in the source.',
});

items.push(mcq(30, '186', 'The plan of Partition of Bengal was proposed by ________.',
  ['Lord Canning', 'Lord Dalhousie', 'Lord Curzon', 'Lord Ripon'], 2,
  { explanation: 'The plan for the Partition of Bengal was formulated by the British Viceroy Lord Curzon, who felt such an action would weaken the nationalist movement in Bengal, the centre of nationalist activities in India at the time.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '31',
  sourcePage: '187',
  text: 'Read the two statements given below about the Swadeshi Movement and select the option that shows the correct relationship between (A) and (B).\n(A) The Swadeshi Movement started in Bengal.\n(B) The Swadeshi Movement was started to show opposition to the partition of Bengal.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.187, item 31',
  parts: [
    {
      text: 'Which option shows the correct relationship between (A) and (B)?',
      options: ['(B) contradicts (A).', '(B) is the reason for (A).', '(A) is true but (B) is false.', '(A) and (B) are independent of each other.'],
      correct: 1,
      marks: 1,
    },
  ],
  explanation: 'The Swadeshi Movement\'s origin specifically in Bengal (A) is explained by (B): it began there as a direct response and opposition to the partition of Bengal, which was itself a Bengal-specific measure.',
});

items.push(mcq(32, '187', 'Study the map and table titled "Bengal (1905-1911)", showing the province divided into Bengal and Eastern Bengal & Assam, with accompanying statistics:\n\n| | Bengal (1905-1911) | Eastern-Bengal & Assam (1905-1911) |\n|---|---|---|\n| Area (Km²) | 366,692 | 275,938 |\n| Population (Mn) | 54 | 31 |\n| Muslims (Mn) | 9 | 18 |\n| Muslims (%) | 16.67 | 58.06 |\n\nWhich of the following Viceroys was responsible for the above incident?',
  ['Lord Irwin', 'Lord Canning', 'Lord Curzon', 'Lord Chelmsford'], 2,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.187, item 32 — map of the 1905-1911 partition of Bengal into "Bengal" and "Eastern Bengal & Assam," with an accompanying Area/Population/Muslims statistics table for each half', assetType: 'source_page_full' }],
    explanation: 'The Viceroy responsible for the partition of Bengal depicted in this map (splitting the province into a majority-Hindu "Bengal" and a majority-Muslim "Eastern Bengal & Assam," as the table\'s Muslim percentages show — 16.67% vs. 58.06%) was Lord Curzon.',
  }));

items.push(mcq(33, '187', "Who wrote 'The Arctic Home In The Vedas' and was called 'The Maker of Modern India' by Mahatma Gandhi?",
  ['Bipin Chandra Pal', 'Bal Gangadhar Tilak', 'Lala Lajpat Rai', 'Bhagat Singh'], 1,
  { explanation: "Bal Gangadhar Tilak wrote 'The Arctic Home in the Vedas' and was called 'The Maker of Modern India' by Mahatma Gandhi." }));

items.push(mcq(34, '187', "Who was called the 'Mightiest prophet of Nationalism' by Aurobindo Ghose?",
  ['Bipin Chandra Pal', 'Subhash Chandra Bose', 'Mahatma Gandhi', 'Rash Behari Bose'], 0,
  { explanation: "Bipin Chandra Pal was called the 'Mightiest prophet of Nationalism' by Aurobindo Ghose." }));

items.push(mcq(35, '187', "Who went to America in 1914 to raise support for India and joined the 'Ghadar Party' there?",
  ['Bal Gangadhar Tilak', 'Bipin Chandra Pal', 'Lala Lajpat Rai', 'Rash Behari Bose'], 2,
  { explanation: "Lala Lajpat Rai went to America in 1914 to raise support for India and joined the 'Ghadar Party' there." }));

items.push(mcq(36, '188', 'Which among the following was not a reason for the partition of Bengal in 1905?',
  ['Revolt of 1857', 'To divide Hindus and Muslims', 'To demonstrate the strength of British Raj', 'To strike at the roots of Bengali Nationalism'], 0,
  { explanation: 'The Revolt of 1857 was not a reason for the partition of Bengal in 1905, which was aimed instead at administrative convenience and at weakening Bengali nationalism, along with dividing Hindus and Muslims.' }));

items.push(mcq(37, '188', 'Who among the following was not a part of the Assertive Nationalists?',
  ['Bipin Chandra Pal', 'Bhagat Singh', 'Dadabhai Naoroji', 'Lala Lajpat Rai'], 2,
  { explanation: 'Dadabhai Naoroji was a prominent early (Moderate) nationalist leader, not part of the Lal-Bal-Pal Assertive Nationalist/Extremist trio, despite his own famous declaration of "Swaraj" as the Congress goal at the 1906 Calcutta session.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'The Partition of Bengal',
  chapterOrder: 11,
  label: 'ch11-13-partition-bengal-muslim-league-gandhi-popular-movement.pdf (Chapter 11 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
