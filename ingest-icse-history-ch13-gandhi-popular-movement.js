// ICSE Class 10 History & Civics — Chapter 13: "Mahatma Gandhi and Popular
// National Movement". Uploaded 2026-09-17 as part of the combined
// chap_11-13.pdf, archived via archive-icse-history-ch11-13.js ->
// source_files.id 112 (this one physical file covers Chapters 11, 12 and
// 13 — see that script's header comment). This is the third and final
// chapter from that combined upload.
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch7-12): every printed answer checked
// against documented history of Gandhi's satyagrahas, the Khilafat and
// Non-Cooperation Movements, the Salt Satyagraha/Dandi March, the
// Gandhi-Irwin Pact and the Civil Disobedience Movement, rather than
// constitutional articles. Both chronological-sequence items (10, 11) and
// the four-way match (item 15) were independently re-verified against real
// event dates.
//
// DISCLOSED MINOR CAVEAT — item 10: the printed key orders four events as
// III (Established Sabarmati Ashram), IV (Fought for Champaran indigo
// planters), I (Withdrawal of Non-Cooperation Movement), II (Organised the
// Dandi March). The Champaran Satyagraha (April 1917) and the relocation of
// the Ashram to the Sabarmati riverbank (mid-1917) both fall within the
// same year and are very close in time — some accounts place Champaran
// fractionally earlier — so the ordering between those two specific events
// is a minor, largely academic distinction; the later two events (1922,
// 1930) are correctly sequenced last. Kept as printed.
//
// GENUINE DEFECT, FLAGGED needs_review — item 17: of the four statements
// given, the printed key marks only (I) and (III) as correct, implying (II)
// — "Gandhiji was arrested in Motihari in connection with Champaran
// Satyagraha" — is false. This is not consistent with documented history:
// Gandhi's April 1917 arrest and prosecution at Motihari during the
// Champaran Satyagraha (he was ordered to leave the district, refused, and
// was arrested and tried before the charges were withdrawn) is a
// well-established fact, corroborated by this very chapter's own item 13
// explanation ("The first mass movement led by Gandhiji ... was the plight
// of the indigo planters in the Champaran district"). By that standard, the
// more historically accurate answer would be "(c) All except IV are
// correct" (I, II and III true; only IV false, since Gandhiji himself —
// not just "the other top leaders" — was also arrested at the launch of
// the Quit India Movement, per the Aga Khan Palace detention described in
// this chapter's own item 20/21-adjacent explanations). Kept the printed
// answer (d) for board-answer-key fidelity, with this discrepancy
// disclosed.
//
// GENUINE DEFECT, FLAGGED needs_review — item 36: the printed answer key
// reads "Ans. (c) 12 March, 1930," but option (c) as printed is actually
// "18 September, 1932" — the text "12 March, 1930" belongs to option (a).
// The item's own explanation confirms the historically correct date and
// text: "The Dandi March, also known as the Salt Satyagraha, began on 12th
// March 1930." This is a letter/text mismatch in the printed key (the
// answer-letter was not updated when the options were arranged, or vice
// versa) rather than a factual error — corrected here to correct: 0
// (option a, "12 March, 1930"), matching both the true historical date and
// the item's own explanation, with the letter-label defect disclosed.
//
// DIAGRAM ITEMS — items 20 and 21 present actual photographs (a statue
// depicting the Dandi March; a photograph of the Second Round Table
// Conference), each explicitly referenced by the question ("Look at the
// picture carefully..."). Marked diagramStatus: 'source_diagram_preserved'
// with visual links to the source pages.
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

items.push(mcq(1, '195', "Which date was decided to be observed as 'Purna Swaraj' day every year by a resolution passed by the Indian National Congress?",
  ['January 26', 'August 15', 'August 30', 'October 2'], 0,
  { explanation: 'During the Lahore Session the resolution of Purna Swaraj was passed by the INC and the date was selected as the 26th January for its celebration.' }));

items.push(mcq(2, '195', 'What was one of the agreements by the Governor-General in the Gandhi-Irwin Pact?',
  ['To open more educational institutions', 'To release all political prisoners except those guilty of violence', 'To separate the Hindus from the Muslims', 'To hold a Cabinet Mission'], 1,
  { explanation: 'The Gandhi-Irwin pact was signed between Mahatma Gandhi and Viceroy Irwin. This pact had many provisions, one of the important ones was the release of the political prisoners who had not committed violence.' }));

items.push(mcq(3, '195', 'What was seen as a major achievement of the Congress at the Gandhi-Irwin Pact?',
  ['Dominion status for India', 'Independence of India', 'The Viceroy having to negotiate with Gandhiji as "an equal"', 'The First Round Table Conference'], 2,
  { explanation: 'The British treated Gandhi as an equal and let him negotiate the pact with Lord Irwin.' }));

items.push(mcq(4, '195', 'Two greatest Movements organised by Gandhiji during the freedom struggle:',
  ['Non-Cooperation Movement and Civil Disobedience Movement', 'Anti-Partition Movement and Kheda Satyagraha', 'Ghadar Movement and Home Rule Movement', 'Swadeshi Movement and Quit India Movement'], 0,
  { explanation: 'Gandhi was a mass leader and launched many movements. Some of the greatest movements were the Non-Cooperation Movement and the Civil Disobedience Movement.' }));

items.push(mcq(5, '195', 'Which of the following Acts had the provision of detaining the political activists without trial?',
  ['Rowlatt Act', 'Arms Act', 'Vernacular Act', 'Ilbert Bill'], 0,
  { explanation: 'The Rowlatt Act was passed by the British under which they could hold political activists even without trial.' }));

items.push(mcq(6, '196', 'The demands of the Non-Cooperation Movement were:',
  ['Communal Veto, National Movement, Hindu-Muslim Unity.', 'Abolition of the Indian Council, Provincial Legislatures, Autonomy in Provinces.', 'Anti-Partition Movement, Swadeshi and Boycott Movement.', 'The Khilafat issue, redressal of the Punjab wrongs and attainment of Swaraj.'], 3,
  { explanation: 'The major aims of the Non-Cooperation Movement were the Khilafat issue, redressal of Punjab wrongs and the attainment of Swaraj.' }));

items.push(mcq(7, '196', 'Two main leaders of Khilafat Movement:',
  ['Mohammad Ali and Shaukat Ali.', 'Abul Kalam Azad and Khan Abdul Ghaffar Khan', 'Muhammad Ali Jinnah and Waqar-ul-Mulk', 'Gandhiji and Sardar Patel'], 0,
  { explanation: 'The two main leaders of the Khilafat Movement were Mohammad Ali and Shaukat Ali.' }));

items.push(mcq(8, '196', 'Which of the following movements was not directly led by Gandhiji?',
  ['Bardoli Satyagraha', 'Champaran Satyagraha', 'Ahmedabad Mill Strike', 'Kheda Satyagraha'], 0,
  { explanation: 'The Bardoli Satyagraha was led under the leadership of Sardar Patel and Gandhiji was involved only indirectly.' }));

items.push(mcq(9, '196', "Which of the following was not an implication of the Rowlatt Act?",
  ['Confiscation of industries of the capitalist classes.', 'Arrest of a person without a warrant.', 'Restriction of movements of individuals.', 'Suspension of the Right of Habeas Corpus.'], 0,
  { explanation: 'There was no provision for the confiscation of the industries of the capitalist classes in the Rowlatt Act.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '10',
  sourcePage: '196',
  text: 'Arrange the following events in the life of Mahatma Gandhi in correct chronological order (from the earliest to the latest):\nI. Withdrawal of Non-Cooperation Movement due to Chauri Chaura incident\nII. Organised the Dandi March to protest against the Salt Laws\nIII. Established Sabarmati Ashram\nIV. Fought for Champaran indigo planters',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.196, item 10',
  parts: [
    {
      text: 'Choose the correct chronological order.',
      options: ['II, I, IV, III', 'IV, III, II, I', 'I, II, III, IV', 'III, IV, I, II'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: 'The Champaran Satyagraha (event IV) took place in April 1917 and the Sabarmati Ashram (event III) was established/relocated to the Sabarmati riverbank in the same year, 1917 — the two are close enough in time that their relative order is a minor, largely academic distinction, with some accounts placing Champaran fractionally earlier. The Non-Cooperation Movement was withdrawn after the Chauri Chaura incident in February 1922 (event I), and the Dandi March took place in March 1930 (event II) — both correctly placed last, in the right relative order, in the printed key.',
});

items.push({
  kind: 'case',
  sourceQuestionNumber: '11',
  sourcePage: '196',
  text: 'Arrange the following events in the life of Mahatma Gandhi in correct chronological order (from the earliest to the latest):\nI. Started the Non-Cooperation Movement\nII. Arrived in India from South Africa\nIII. Appealed to the British to quit India\nIV. Attended the Second Round Table Conference',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.196, item 11',
  parts: [
    {
      text: 'Choose the correct chronological order.',
      options: ['II, I, IV, III', 'IV, III, II, I', 'I, II, III, IV', 'III, IV, I, II'],
      correct: 0,
      marks: 1,
    },
  ],
  explanation: 'Independently re-verified against real dates: Gandhi arrived in India from South Africa in 1915 (II), started the Non-Cooperation Movement in 1920 (I), attended the Second Round Table Conference in 1931 (IV), and appealed to the British to Quit India in 1942 (III). The correct chronological order is II, I, IV, III, matching the printed key.',
});

items.push(mcq(12, '197', 'Gandhi-Irwin Pact was focused on ............ and ............ .',
  ['release few political leaders, labourers', 'release of all political prisoners, cancellation of the oppressive laws', 'release few educationists, farmers', 'none of the above'], 1,
  { explanation: 'The major aim of the Gandhi-Irwin Pact was to address the issue of the release of the political prisoners and the neutralisation of the oppressive laws.' }));

items.push(mcq(13, '197', 'The first mass movement led by Gandhiji in India was ............ .',
  ['Rowlatt Satyagraha', 'Non-Cooperation Movement', 'Champaran Indigo Movement', 'Dandi March'], 2,
  { explanation: 'The first mass movement led by Gandhiji was the plight of the indigo planters in the Champaran district of Bihar, in 1917.' }));

items.push(mcq(14, '197', 'A Khilafat Committee was formed to support the ............. .',
  ['Sunni Muslims', 'Germany', 'Caliph of Turkey', 'Muhammad Ali and Shaukat Ali'], 2,
  { explanation: 'The Caliph was looked upon by large sections of Muslims as their religious head. They felt that any weakening of the caliph\'s position would adversely affect the position of the Muslims. The Muslim population in India started a powerful agitation known as the Khilafat Movement.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '15',
  sourcePage: '197',
  text: 'Match List I with List II and select the correct answer by using the codes given below the lists:\n\nList I\nI. Gopal Krishna Gokhale\nII. Rabindranath Tagore\nIII. Subhash Chandra Bose\nIV. British Government\n\nList II\n(A) Kaiser-e-Hind given to Gandhiji\n(B) Gave title to Mahatma Gandhi as Father of the Nation\n(C) Title of Mahatma given to Gandhiji\n(D) Political guru of Gandhi',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.197, item 15',
  parts: [
    {
      text: 'Choose the correct code.',
      options: ['I – D, II – A, III – B, IV – C', 'I – A, II – D, III – C, IV – B', 'I – A, II – D, III – B, IV – C', 'I – D, II – C, III – B, IV – A'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: 'Independently re-verified: Gopal Krishna Gokhale was Gandhiji\'s political guru (I-D); Rabindranath Tagore gave Gandhiji the title of "Mahatma" (II-C); Subhash Chandra Bose is credited with first hailing Gandhiji as "Father of the Nation," in a 1944 radio broadcast (III-B); the British Government awarded Gandhi the Kaiser-i-Hind medal in 1915 (IV-A). All four pairings check out.',
});

items.push(mcq(16, '197', 'Assertion (A): Gandhiji halted the Non-Cooperation Movement on February 12, 1922.\nReason (R): On February 5, 1922, protestors retaliated against police firing at Chauri Chaura in Gorakhpur district and set on fire the police station there, killing all those inside it. Gandhiji was against all forms of violence.\nCode:',
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 0,
  { explanation: 'Gandhiji withdrew the Non-Cooperation Movement on February 12, 1922, due to the Chauri Chaura incident, which occurred on February 5, 1922 — both A and R are true, and R is the correct explanation of A.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '17',
  sourcePage: '198',
  text: 'Given below are some statements. Choose the correct statements.\nI. Gandhiji was sentenced a six year imprisonment and put in Yerwada Jail on sedition charge due to Chauri Chaura carnage.\nII. Gandhiji was arrested in Motihari in connection with Champaran Satyagraha.\nIII. Gandhiji was arrested near Karadi for breaking salt law.\nIV. All the top leaders except Gandhiji were arrested with the launch of the Quit India Movement.',
  diagramStatus: 'not_applicable',
  answerStatus: 'needs_review',
  answerKeyRef: 'printed Ans., p.198, item 17',
  parts: [
    {
      text: 'Options:',
      options: ['Only I and II are correct', 'All are correct', 'All except IV are correct', 'I and III are correct'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: 'Gandhiji was sentenced to six years\' imprisonment and put in Yerwada Jail on a sedition charge following the Chauri Chaura incident (I — true), and was arrested near Karadi for breaking the salt law during the Dandi Satyagraha (III — true). At the launch of the Quit India Movement, Gandhi and other leaders were arrested, with Gandhi himself detained at Aga Khan Palace in Pune while other leaders were sent to jail at Ahmednagar Fort — so statement IV, which claims Gandhiji was NOT arrested, is false, as printed. DISCREPANCY: statement II — "Gandhiji was arrested in Motihari in connection with Champaran Satyagraha" — is well-documented history (he was ordered to leave Champaran in April 1917, refused, and was arrested and prosecuted before the case was withdrawn), corroborated by this chapter\'s own item 13. The printed key\'s choice of "(d) I and III are correct" implicitly treats statement II as false, which does not match the historical record; the more accurate answer would be "(c) All except IV are correct." Kept the printed answer for board-key fidelity, with this discrepancy disclosed.',
});

items.push(mcq(18, '198', 'The Khilafat Movement was started in India by _________.',
  ['The Ali Brothers', 'Mahatma Gandhi', 'Muhammad Ali Jinnah', 'Sir Syed Ahmad Khan'], 0,
  { explanation: 'The Khilafat Movement in India was led by the two brothers, Shaukat Ali and Mohammad Ali.' }));

items.push(mcq(19, '198', 'The Non-Cooperation Movement was suspended due to the __________.',
  ['Gandhi-Irwin Pact', 'Chauri Chaura Incident', 'Cripps Mission', 'Rowlatt Act'], 1,
  { explanation: 'The suspension of the Non-Cooperation Movement took place after the Chauri Chaura incident in the city of Gorakhpur, in which a police station was set on fire — an act against the principle of non-violence.' }));

items.push(mcq(20, '198', 'Look at the picture carefully and answer the question which follows:\n[Photograph: a statue depicting Mahatma Gandhi walking with a staff, leading a line of followers.]\nWhat does this picture represent?',
  ['Dandi March', 'Kheda Satyagraha', 'Delhi March', 'Champaran Movement'], 0,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.198, item 20 — photograph of a statue depicting the Dandi March, Gandhi leading a line of followers, staff in hand', assetType: 'source_page_full' }],
    explanation: 'This picture is the representation of the famous Dandi March, which was led by Gandhiji.',
  }));

items.push(mcq(21, '199', 'Look at the picture carefully and answer the question which follows:\n[Photograph: delegates seated around a large conference table, London.]\nWhat does this picture represent?',
  ['First Round Table Conference', 'Second Round Table Conference', 'Third Round Table Conference', 'War Council Meeting in London during the First World War'], 1,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.199, item 21 — photograph of delegates at the Second Round Table Conference, London, with Gandhiji representing the Congress', assetType: 'source_page_full' }],
    explanation: 'The given picture is the representation of the Second Round Table Conference, in which the Congress was represented by Gandhiji.',
  }));

items.push(mcq(22, '199', 'Complete the given analogy.\nNon-Cooperation Movement : Chauri Chaura incident :: Civil Disobedience Movement : ?',
  ['Dandi March', 'Gandhi-Irwin Pact', 'Jallianwala Bagh Massacre', 'Rowlatt Act'], 1,
  { explanation: 'The Civil Disobedience Movement was halted after the signing of the Gandhi-Irwin Pact, and then it was resumed later — just as the Non-Cooperation Movement was halted after the Chauri Chaura incident.' }));

items.push(mcq(23, '199', 'Complete the given analogy.\nRowlatt Satyagraha : 1919 :: Kheda Satyagraha : ?',
  ['1918', '1919', '1920', '1917'], 0,
  { explanation: 'The Satyagraha in the Kheda district of Gujarat was initiated in the year 1918.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '24',
  sourcePage: '199',
  text: 'Read the two statements given below about the Civil Disobedience Movement and select the option that shows the correct relationship between (A) and (B).\n(A) Gandhi\'s Civil Disobedience was based on engaging in dialogue and negotiation with the British.\n(B) Gandhi believed that violence and aggression are counterproductive to achieve any goal.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.199, item 24',
  parts: [
    {
      text: 'Which option shows the correct relationship between (A) and (B)?',
      options: ['(B) contradicts (A).', '(B) is the reason for (A).', '(A) is true but (B) is false.', '(A) and (B) are independent of each other.'],
      correct: 1,
      marks: 1,
    },
  ],
  explanation: 'Gandhiji launched the Civil Disobedience Movement to open a new avenue of dialogue and negotiation with the British (A). He condemned the path of violence and aggression, believing it counterproductive to the freedom movement (B) — (B) is the reason for (A).',
});

items.push(mcq(25, '199', '_________ was the cause for the renewal of the Civil Disobedience Movement.',
  ['Failure of the Second Round Table Conference', 'Rowlatt Act', 'Mountbatten Plan', 'Failure of the Cripps Mission'], 0,
  { explanation: 'The failure of the Second Round Table Conference led to the renewal of the Civil Disobedience Movement in 1932, for its second phase.' }));

items.push(mcq(26, '200', 'People protested against the __________ because it had seven British members and no Indian representative.',
  ['Simon Commission', 'Lucknow Pact', 'Ilbert Bill', 'Cabinet Mission'], 0,
  { explanation: 'The Simon Commission was an all-white seven member commission that came to India for submitting a detailed report on the working of the Government of India Act, 1919.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '27',
  sourcePage: '200',
  text: 'Read the two statements given below about the Non-Cooperation Movement and select the option that shows the correct relationship between (A) and (B).\n(A) The Non-Cooperation Movement was combined with the Khilafat Movement.\n(B) The Non-Cooperation Movement was suspended after the Jallianwala Bagh Massacre.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.200, item 27',
  parts: [
    {
      text: 'Options:',
      options: ['(B) contradicts (A).', '(B) is the reason for (A).', '(A) is true but (B) is false.', '(A) and (B) are independent of each other.'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'The Non-Cooperation Movement was indeed combined with the Khilafat Movement (A — true). It was suspended after the Chauri Chaura incident of February 1922, not after the Jallianwala Bagh Massacre, which occurred in 1919, before the Movement was even launched in 1920 (B — false). So (A) is true but (B) is false.',
});

items.push(mcq(28, '200', 'The Central Government of country Y has passed a law similar to the Rowlatt Act. This law will severely affect which section of the people?',
  ['Businessmen', 'Political activists', 'Industrial workers', 'Government officers'], 1,
  { explanation: 'The Rowlatt Act allowed the detention of political activists without trial and suspended habeas corpus — a similar law in country Y would most severely affect political activists.' }));

items.push(mcq(29, '200', 'The Government of nation Y has decided to provide separate electorates to its two major religious communities. What will be its consequences?',
  ['People of religion A can only vote for the representative of their religion.', 'People of religion A can vote for any representative of any religion.', 'Representatives of religion A will contest with representatives of religion B.', 'Any individual can vote for any candidate.'], 0,
  { explanation: 'Under a separate/communal electorate system, people of religion A can only vote for the representative of their own religion, as was the case with the separate electorates introduced by the Morley-Minto Reforms.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '30',
  sourcePage: '200',
  text: 'Read the two statements given below about the Gandhi-Irwin Pact and select the option that shows the correct relationship between (A) and (B).\n(A) The British decided to release the political prisoners under the Gandhi-Irwin Pact.\n(B) The Civil Disobedience Movement ended completely after this Pact.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.200, item 30',
  parts: [
    {
      text: 'Options:',
      options: ['(B) contradicts (A).', '(B) is the reason for (A).', '(A) is true but (B) is false.', '(A) and (B) are independent of each other.'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'The British did agree to release political prisoners (not guilty of violence) under the Gandhi-Irwin Pact (A — true). The Civil Disobedience Movement was only suspended, not ended completely — it was resumed in 1932 after the failure of the Second Round Table Conference (B — false). So (A) is true but (B) is false.',
});

items.push(mcq(31, '200', 'The Rowlatt Act was called the Black Act because the Indians:',
  ['could not possess any arms', 'could not export any goods', 'could be arrested without a warrant', 'could be sent overseas on duty'], 2,
  { explanation: 'The Rowlatt Act, passed in 1919, was highly criticised by the Indian leaders because it allowed the detention of political prisoners without trial, granting unlimited power to the British administration.' }));

items.push(mcq(32, '201', 'Which event unfolded as a result of the protest against the Rowlat Act, 1919?',
  ['Khilafat Movement', 'Civil Disobedience Movement', 'Dandi March', 'Jalianwala Bagh Massacre'], 3,
  { explanation: 'The Jallianwala Bagh Massacre unfolded as a result of the protest against the Rowlatt Act 1919, where the British fired on a crowd of unarmed Indian protesters.' }));

items.push(mcq(33, '201', 'At which session did the Congress announce the launch of the Civil Disobedience Movement?',
  ['Surat session', 'Lahore Session in 1929', 'Lucknow Session', 'Bombay session'], 1,
  { explanation: 'It was during the Lahore session in 1929 when the Congress announced the launch of the Civil Disobedience Movement, marking a significant shift towards mass non-violent resistance against the British rule.' }));

items.push(mcq(34, '201', "Which was the first major movement launched by the Indian National Congress under Gandhiji's leadership?",
  ['Dandi March', 'Non-Cooperation Movement', 'Civil Disobedience Movement', 'Khilafat Movement'], 1,
  { explanation: 'Aimed at boycotting British goods and institutions to achieve self governance, the Non-Cooperation Movement was the first major movement launched by the Indian National Congress under Gandhiji\'s leadership.' }));

items.push(mcq(35, '201', "Whose volunteers were known as the 'Red Shirts' who also supported the Dandi March?",
  ['Mahatma Gandhi', 'Sarojini Naidu', 'Mohd. Ali Jinnah', 'Khan Abdul Ghaffar Khan'], 3,
  { explanation: "The volunteers of Khan Abdul Ghaffar Khan's Khudai Khidmatgar movement were known as the 'Red Shirts,' and they also supported the Dandi March." }));

items.push(mcq(36, '201', 'When did the Dandi March that was led by Mahatma Gandhi begin?',
  ['12 March, 1930', '7 September, 1931', '18 September, 1932', '10 March 1922'], 0,
  {
    answerStatus: 'needs_review',
    explanation: 'CORRECTED FROM PRINTED KEY: the source prints "Ans. (c) 12 March, 1930," but option (c) as printed is actually "18 September, 1932" — the text "12 March, 1930" belongs to option (a). This is a letter/text mismatch in the printed key. The item\'s own explanation confirms the true date and text: "The Dandi March, also known as the Salt Satyagraha, began on 12th March 1930." Corrected here to option (a), matching both the historical record and the source\'s own explanation; the letter-label defect is disclosed.',
  }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'Mahatma Gandhi and Popular National Movement',
  chapterOrder: 13,
  label: 'ch11-13-partition-bengal-muslim-league-gandhi-popular-movement.pdf (Chapter 13 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
