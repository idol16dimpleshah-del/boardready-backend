// ICSE Class 10 History & Civics — Chapter 10: "Second Phase of the Indian
// National Movement (1905-1916)". Uploaded 2026-09-17 as chap_10.pdf,
// archived via archive-icse-history-ch10.js -> source_files.id 111.
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch7-9): every printed answer checked against
// documented history of the Extremist/"Assertive Nationalist" phase —
// Partition of Bengal (1905), Bal Gangadhar Tilak, Lala Lajpat Rai, Bipin
// Chandra Pal, the Muslim League's founding, the Home Rule League movement,
// the Surat Split (1907), the Lucknow Pact (1916) — rather than
// constitutional articles or arithmetic.
//
// DISCLOSED CAVEAT (items 26 & 28) — "Purna Swaraj" as a specific term and
// formal Congress resolution is most precisely associated with the 1929
// Lahore Session (under Jawaharlal Nehru, effective as "Independence Day"
// from 26 January 1930), roughly two decades AFTER the 1905-1919 Assertive
// Nationalist phase this chapter covers; Tilak's own famous slogan was
// "Swaraj is my birthright" (item 3), not "Purna Swaraj" specifically. Item
// 26 is explicitly marked a real ICSE [Board Question], and many board-level
// study materials do use "Purna Swaraj" loosely as shorthand for "complete
// self-rule" when describing the Extremists' aspiration (as opposed to the
// Moderates' dominion-status goal) — both items are transcribed with their
// printed answers kept unchanged, since this reflects the actual expected
// board answer, with the anachronism disclosed rather than silently
// smoothed over.
//
// DIAGRAM NOTE — items 17 and 19 each show an actual portrait the student
// must identify ("Study the picture carefully and answer..."); both are
// marked diagramStatus: 'source_diagram_preserved' with a visual link to
// the source page, per the Ch7 item 19 / Ch8 item 15 precedent.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 111;

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

items.push(mcq(1, '177', 'Who put into effect the partition of Bengal?',
  ['Lytton', 'Wellington', 'Hastings', 'Curzon'], 3,
  { explanation: 'The partition of Bengal was initiated by Lord Curzon in 1905 on the grounds of administration.' }));

items.push(mcq(2, '177', 'What was the perspective of Indian nationalists about partition of Bengal by the British?',
  ['To large to be administered by a single provincial government', 'Policy of Divide and Rule', 'Oriya speaking people outside the territorial limits of Orissa had to be brought under the administration of Bengal', 'To show the strength of East Bengal'], 1,
  { explanation: 'The Congress leaders understood that the partition of Bengal was part of the divide-and-rule policy of the British administration.' }));

items.push(mcq(3, '177', 'Who gave the slogan, "Swaraj is my birthright and I shall have it"?',
  ['Bal Gangadhar Tilak', 'Lala Lajpat Rai', 'Gopal Krishna Gokhale', 'Bipin Chandra Pal'], 0,
  { explanation: 'This famous slogan was given by Bal Gangadhar Tilak after the event of the partition of Bengal.' }));

items.push(mcq(4, '177', 'Which two terms became the battle cry of the assertive nationalists?',
  ['Petitions and Appeals', 'Swaraj and Resolutions', 'Boycott and Petitions', 'Swaraj and Boycott'], 3,
  { explanation: 'The assertive nationalists like Lala Lajpat Rai and Bal Gangadhar Tilak believed in the idea of swaraj and boycott of British goods for gaining independence.' }));

items.push(mcq(5, '177', 'Who wrote the weeklies – Mahratta and Kesari?',
  ['Mahatma Gandhi', 'Gopal Krishna Gokhale', 'Bal Gangadhar Tilak', 'Lala Lajpat Rai'], 2,
  { explanation: 'The famous weeklies Mahratta and Kesari were the works of Bal Gangadhar Tilak, who used them as a medium to attack the British government.' }));

items.push(mcq(6, '177', 'During which incident Lala Lajpat Rai succumbed to injuries and sacrificed his life?',
  ['Jallianwala Bagh tragedy', 'Khilafat Movement', 'Simon Commission', 'Cabinet Mission'], 2,
  { explanation: 'When the Simon Commission arrived in India, it was shown black/red flags by the Indians led by Lala Lajpat Rai; in this event, Lalaji was hit by a British official and succumbed to his injuries.' }));

items.push(mcq(7, '178', 'By what title was Lalaji popularly referred to?',
  ['Sher-e-Punjab', 'Lokmanya', 'Bagha', 'Mahatma'], 0,
  { explanation: 'Lala Lajpat Rai belonged to the state of Punjab and was a prominent freedom fighter — due to this, he was also known as Sher-e-Punjab.' }));

items.push(mcq(8, '178', "Where was the Muslim League's Constitution framed?",
  ['Lahore', 'Punjab', 'Calcutta', 'Karachi'], 3,
  { explanation: 'The Constitution of the Muslim League was framed at a session in the region of Karachi in December 1907, following the League\'s founding at Dacca in December 1906.' }));

items.push(mcq(9, '178', 'Who presided over the First Session of the Muslim League in December 1908?',
  ['Muhammad Ali Jinnah', 'Syed Ali Imam', 'Nawab Salimullah', 'Badruddin Tyabji'], 1,
  { explanation: 'The (first regular) session of the Muslim League under its newly framed constitution was presided over by Syed Ali Imam in the year 1908 (at Amritsar), distinct from the League\'s original founding meeting at Dacca in 1906 and the Karachi meeting of 1907 that adopted its constitution.' }));

items.push(mcq(10, '178', 'Lord Curzon believed that the Indian people were illiterate and could have no ............... aspirations.',
  ['Economic', 'Political', 'Social', 'Health'], 1,
  { explanation: 'Lord Curzon was a very autocratic British Viceroy and felt that Indians were illiterate and so should have no political aspirations.' }));

items.push(mcq(11, '178', 'The ultimate objective of the Assertive Nationalists was ............... .',
  ['Boycott', 'Nationalism', 'Stern measures', 'Swaraj'], 3,
  { explanation: 'The ultimate objective of the Assertive Nationalists was the attainment of Swaraj, as they felt it to be their birthright.' }));

items.push(mcq(12, '178', 'While ............... education was aimed to shape people\'s character, political education meant to carry out one\'s ............... responsibilities.',
  ['Religious, civic', 'National, moral', 'Economic, social', 'Health, moral'], 0,
  { explanation: 'The importance of religious education was to develop the character of the people, while political education was seen as the means to carry out civic responsibilities.' }));

items.push(mcq(13, '178', 'Tilak is known for organising ............... and ............... clubs in Maharashtra.',
  ['Akhara, political', 'Literary campaigns, religious', 'Akhara, lathi', 'Swadeshi, boycott'], 2,
  { explanation: 'Bal Gangadhar Tilak organised Akhara (gymnasium) and lathi clubs, which also served as venues to raise national consciousness.' }));

items.push(mcq(14, '179', '............... headed the Home Rule League in Madras.',
  ['Sarojini Naidu', 'Savitribai Phule', 'Sister Nivedita', 'Annie Besant'], 3,
  { explanation: 'The Home Rule League movement was led by two prominent leaders: Bal Gangadhar Tilak in Northern India/Maharashtra and Annie Besant from Madras.' }));

items.push(mcq(15, '179', 'Leaders like Tilak, Bipin Chandra Pal and Lala Lajpat Rai transformed the anti-partition movement into a ............... Movement.',
  ['Swaraj', 'Political', 'Extremist', 'Social'], 0,
  { explanation: 'Lal-Bal-Pal were assertive nationalists, and they led the transformation of the anti-partition movement into the Swaraj movement.' }));

items.push(mcq(16, '179', 'Arrange the following events from the past to the present:\nI. Bal Gangadhar Tilak led no-rent campaign\nII. Establishment of Home Rule League in Madras and Maharashtra\nIII. Bipin Chandra Pal joined the Congress\nIV. The Nationalist Party achieved significant electoral success\nChoose the correct option:',
  ['II, IV, III, I', 'III, I, II, IV', 'I, IV, II, III', 'IV, I, III, II'], 1,
  { explanation: 'Bipin Chandra Pal was already active in the Congress from its early years (1880s), Tilak\'s no-rent/agrarian agitation campaigns date to the 1890s, the Home Rule League in Madras and Maharashtra was established in 1916, and the Nationalist Party\'s notable electoral successes came later still — i.e. III, I, II, IV, matching the printed key.' }));

items.push(mcq(17, '179', 'Study the picture carefully and answer the following questions. Identify the personality in the picture.',
  ['Bipin Chandra Pal', 'Lala Lajpat Rai', 'Bal Gangadhar Tilak', 'Aurobindo Ghose'], 2,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.179, item 17 — portrait photograph/engraving of Bal Gangadhar Tilak', assetType: 'source_page_full' }],
    explanation: 'The personality displayed in this picture is Bal Gangadhar Tilak.',
  }));

items.push(mcq(18, '179', 'Who led the Home Rule League in Maharashtra?',
  ['Annie Besant', 'Sarojini Naidu', 'Savitribai Phule', 'Bal Gangadhar Tilak'], 3,
  { explanation: 'The Home Rule League movement was led by two prominent leaders: Bal Gangadhar Tilak in Northern India/Maharashtra and Annie Besant from Madras.' }));

items.push(mcq(19, '180', 'Study the picture carefully and answer the following questions. Identify the personality in the picture.',
  ['Lala Lajpat Rai', 'Bal Gangadhar Tilak', 'Gopal Krishna Gokhale', 'Bipin Chandra Pal'], 0,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.180, item 19 — portrait photograph/engraving of Lala Lajpat Rai', assetType: 'source_page_full' }],
    explanation: 'The famous personality displayed in this picture is Lala Lajpat Rai.',
  }));

items.push(mcq(20, '180', 'Who went to England in 1905 to persuade the British leaders not to go ahead with the partition of Bengal?',
  ['Bal Gangadhar Tilak and Gopal Krishna Gokhale', 'Lala Lajpat Rai and Gopal Krishna Gokhale', 'Bipin Chandra Pal and Gopal Krishna Gokhale', 'Bal Gangadhar Tilak and Lala Lajpat Rai'], 1,
  { explanation: 'In 1905, nationalist leaders Lala Lajpat Rai and Gopal Krishna Gokhale went to England to persuade the British leaders that the partition of Bengal was unjust/illegal.' }));

items.push(mcq(21, '180', 'Assertion (A): The Assertive Nationalists had no faith in British sense of justice and fairplay.\nReason (R): They highlighted the goodwill of the British when they took over India.',
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 2,
  { explanation: 'The Assertive Nationalists favoured adopting radical means for gaining independence precisely because they had no faith in British justice or fairplay (A is true) — they highlighted the deceit and treachery, not any "goodwill," by which the British had gradually taken over India (R is false).' }));

items.push(mcq(22, '180', 'Assertion (A): In 1893, Tilak started the celebration of Thanksgiving in Maharashtra.\nReason (R): Tilak\'s aim was to instill in the masses a spirit of discipline and patriotism.',
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 3,
  { explanation: 'In 1893, Tilak actually started the public celebration of the Ganapati (Ganesh Chaturthi) festival in Maharashtra — not any "Thanksgiving" celebration, so A is false. R is independently true: Tilak\'s aim in popularising these public festivals (Ganapati, and later Shivaji Jayanti) was indeed to instill discipline and patriotism in the masses.' }));

items.push(mcq(23, '181', 'Assertion (A): The proposal was accepted and the All-India Muslim League was formally founded on 30 December, 1906.\nReason (R): Taking advantage of the delegates in Dacca for the Muslim Educational Conference, Nawab Salimullah proposed to form a central organisation to look after the interests of the Muslim community.',
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 0,
  { explanation: 'The All-India Muslim League was indeed formally founded at Dacca on 30 December 1906 (A is true), directly because Nawab Salimullah, taking advantage of the delegates already gathered there for the All-India Muhammadan Educational Conference, proposed forming a central organisation to represent Muslim interests (R is true and correctly explains A).' }));

items.push(mcq(24, '181', 'Complete the given analogy.\nBal Gangadhar Tilak : Gita Rahasya :: Lala Lajpat Rai : ?',
  ['Vande Mataram', 'National Education', 'Punjabi', 'New India'], 1,
  { explanation: 'Lala Lajpat Rai was a firm believer in imparting national education to the Indian people and played a leading role in the passing of resolutions related to it, paralleling Tilak\'s authorship of the Gita Rahasya.' }));

items.push(mcq(25, '181', 'Complete the given analogy.\nModerates (Early Nationalists) : Pherozeshah Mehta :: Radicals (Assertive Nationalists) : ?',
  ['Gopal Krishna Gokhale', 'M.A. Jinnah', 'Motilal Nehru', 'Aurobindo Ghose'], 3,
  { explanation: 'Some of the well-known Assertive Nationalists (Radicals) were Lala Lajpat Rai, Bal Gangadhar Tilak, Bipin Chandra Pal and Aurobindo Ghose, paralleling Pherozeshah Mehta as a well-known Moderate.' }));

items.push(mcq(26, '181', 'The main objective of the Assertive Nationalists was ___________. [Board Question]',
  ['Constitutional agitation', 'Peaceful protests', 'Purna Swaraj', 'Self-government under British Rule'], 2,
  { explanation: 'DISCLOSED CAVEAT: this is a real ICSE Board Question, and its printed answer/explanation state that the main objective of the Assertive Nationalists (Tilak, Lajpat Rai, Bipin Chandra Pal) was to attain "Purna Swaraj" from the British government. Historically, "Purna Swaraj" as a specific term and formal resolution is most precisely associated with the Indian National Congress\'s 1929 Lahore Session (under Jawaharlal Nehru, taking effect as "Independence Day" from 26 January 1930) — roughly two decades after this chapter\'s 1905-1919 Assertive Nationalist phase, whose own famous slogan (per item 3) was simply "Swaraj is my birthright," not "Purna Swaraj." Many ICSE-level study materials nonetheless use "Purna Swaraj" loosely as shorthand for "complete self-rule/independence" when describing the Extremists\' aspiration, as opposed to the Moderates\' dominion-status goal. Transcribed with the printed (board-tested) answer kept unchanged; the terminological anachronism is disclosed rather than silently corrected.' }));

items.push(mcq(27, '181', 'The Lucknow Pact was signed between ________ . [Board Question]',
  ['The British and the Congress', 'The Congress and the Muslim League', 'The Early and the Assertive Nationalists', 'The Muslim League and the British'], 1,
  { explanation: "The famous Lucknow Pact of 1916 was signed between the Congress and the Muslim League. Under this pact, the Congress agreed to the Muslim League's demand for separate electorates in return for its support of nationalist politics." }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '28',
  sourcePage: '182',
  text: 'Read the two statements given below about the Assertive Nationalists and select the option that shows the correct relationship between (A) and (B).\n(A) Lal-Bal-Pal were the abbreviations used for three famous Assertive Nationalists.\n(B) The concept of Purna Swaraj was first given by Bal Gangadhar Tilak.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.182, item 28',
  parts: [
    {
      text: 'Which of the following shows the correct relationship between (A) and (B)?',
      options: ['(B) contradicts (A).', '(B) is the reason for (A).', '(A) is true but (B) is false.', '(A) and (B) are independent of each other'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: "DISCLOSED CAVEAT (related to item 26 above): (A) is a straightforwardly true statement — \"Lal-Bal-Pal\" is indeed the well-known abbreviation for Lala Lajpat Rai, Bal Gangadhar Tilak and Bipin Chandra Pal. (B)'s claim that Tilak specifically \"first gave\" the concept of Purna Swaraj is historically loose (see item 26's disclosed caveat on the term's stronger association with the 1929 Lahore Session) — but the printed key sidesteps evaluating (B)'s truth value altogether, choosing (d) \"(A) and (B) are independent of each other\" (i.e., the two statements simply address unrelated pieces of information — an abbreviation versus a claim of first attribution — rather than logically supporting or contradicting one another). Transcribed with the printed answer kept unchanged.",
});

items.push(mcq(29, '182', "Who composed the song 'Vande Mataram' to inspire Indians in their freedom struggle against the British?",
  ['Rabindra Nath Tagore', 'Bankimchandra Chatterji', 'Bipin Chandra Pal', 'Aurobindo Ghose'], 1,
  { explanation: "Bankimchandra Chatterji composed the song 'Vande Mataram' to inspire Indians in their freedom struggle against the British." }));

items.push(mcq(30, '182', "Which Indian Nationalist earned the epithet 'Lokmanya' and was almost worshipped as a god?",
  ['Lala Lajpat Rai', 'Bipin Chandra Pal', 'Bal Gangadhar Tilak', 'Rash Behari Ghosh'], 2,
  { explanation: 'Bal Gangadhar Tilak was given the title "Lokmanya," meaning "respected by the people as their leader," in recognition of his immense popularity and influence in the Indian independence movement.' }));

items.push(mcq(31, '182', 'At which session did the Congress get split officially in 1907?',
  ['Surat', 'Lahore', 'Kolkata', 'Bombay'], 0,
  { explanation: 'The Congress split officially in 1907 at the Surat session (the "Surat Split," between the Moderates and the Extremists).' }));

items.push(mcq(32, '182', 'Whom did Veer Savarkar depute to represent India at the International Socialist Conference in Germany in 1907?',
  ['Madanlal Dhingra', 'Madam Bhika ji Cama', 'Khudiram Bose', 'Rash Behari Bose'], 1,
  { explanation: 'Veer Savarkar deputed Madam Bhikaji Cama to represent India at the International Socialist Conference in Germany (Stuttgart) in 1907. She was an influential figure in the Indian independence movement and an advocate for India\'s cause on international platforms.' }));

items.push(mcq(33, '182', 'Which Nationalist was deported to Mandalay to serve six years of imprisonment in July, 1908?',
  ['Bipin Chandra Pal', 'Bal Gangadhar Tilak', 'Khudiram Bose', 'Vinayak Damodar Savarkar'], 1,
  { explanation: 'On July 3rd 1908, Bal Gangadhar Tilak was arrested by the British under the charge of sedition and sentenced to a period of six years\' imprisonment, from 1908 to 1914, in Mandalay, Burma.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'Second Phase of the Indian National Movement (1905-1916)',
  chapterOrder: 10,
  label: 'ch10-second-phase-of-the-indian-national-movement.pdf',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
