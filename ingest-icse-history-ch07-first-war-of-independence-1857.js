// ICSE Class 10 History & Civics — Chapter 7: "First War of Independence:
// 1857". Uploaded 2026-09-17 as chap_7.pdf, archived via
// archive-icse-history-ch7.js -> source_files.id 108. First HISTORY (as
// opposed to Civics/polity) chapter of this subject; Chapters 1-6 covered
// Parliament/Executive/PM/Judiciary. Standing instruction: "now on till i
// dont change it will be icse 10 history chapter wise i will be uploading,
// make sure you feed in the system."
//
// Verification method shifts for this chapter: every printed answer is
// checked against actual documented history of the causes and course of
// the 1857 revolt (Subsidiary Alliance, Doctrine of Lapse, the General
// Service Enlistment Act 1856, the Enfield rifle cartridge controversy,
// key dates and figures) rather than constitutional articles or arithmetic.
// Chronological-ordering items (16, 17) were independently re-verified by
// checking each event's actual historical date, not just trusting the
// printed key.
//
// SOURCE NUMBERING QUIRK (disclosed, not a content error): the printed
// book's own question numbering skips "28" and prints "29" twice — one
// question about the General Service Enlistment Act, a separate one about
// the first martyr of the revolt. Both are transcribed with
// sourceQuestionNumber '29' (matching what is actually printed), since
// this project's policy is to transcribe source numbering as printed
// rather than silently renumbering to "fix" an apparent gap.
//
// DIAGRAM NOTE — item 19 shows an actual photographic portrait the student
// must identify ("Study the picture and answer..."); the image itself is
// the question content, so it is marked diagramStatus:
// 'source_diagram_preserved' with a visual link to the source page. Item 18
// is a plain-text COLUMN I/COLUMN II data table (no image), transcribed as
// text per this project's established table-handling convention —
// diagramStatus 'not_applicable', consistent with every other chapter.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 108;

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

items.push(mcq(1, '160', 'Identify one of the features of the Subsidiary Alliance.',
  ['The Indian rulers had to keep a British Official called \'Resident\' at capitals of their respective States.', 'A State was taken over by the British if the ruler died without a natural heir.', 'The Officials openly preached Christian doctrines in the temples and mosques.', 'The British Officials took all steps to colonise India as an agricultural nation.'], 0,
  { explanation: 'Subsidiary Alliance was introduced by Lord Wellesley. Under it, a British Resident was stationed at the capital of every state whose sovereignty was acquired/subordinated by the British, and the ruler had to accept British troops and pay for their upkeep while surrendering control of foreign affairs.' }));

items.push(mcq(2, '160', 'Which of the following States became a victim of Doctrine of Lapse?',
  ['Lucknow', 'Poona', 'Nagpur', 'Hyderabad'], 2,
  { explanation: 'Several states were annexed by the British under the Doctrine of Lapse (a ruler dying without a natural heir); these included Satara, Nagpur and Jhansi. Lucknow/Awadh was annexed separately in 1856 on grounds of alleged misgovernance (see item 24), not under the Doctrine of Lapse, and Hyderabad was not annexed in this period.' }));

items.push(mcq(3, '160', 'Which of the following Acts mentioned that all recruits to the Bengal Army had to serve everywhere within or outside India?',
  ['General Service Enlistment Act', 'Religious Disabilities Act', 'Rowlatt Act', 'Subsidiary Alliance'], 0,
  { explanation: 'The General Service Enlistment Act, 1856 (passed under Lord Canning) required that all future recruits to the Bengal Army give an undertaking to serve wherever required, whether within India or overseas.' }));

items.push(mcq(4, '160', 'What was introduced by the Bengal Government in 1829 in a Calcutta Madrasa?',
  ['Urdu classes', 'Sanskrit classes', 'English classes', 'Persian classes'], 2,
  { explanation: 'In 1829, the Bengal Government introduced English classes in the Calcutta Madrasa, a Muslim institution; English was similarly introduced at Benaras Sanskrit College around the same period.' }));

items.push(mcq(5, '160', 'Who saw Western education as an attempt to discourage Islamic and Hindu studies?',
  ['Christian missionaries', 'Brahmins', 'Muslims', 'Pandits and Maulvis'], 3,
  { explanation: 'The Pandits and the Maulvis were opposed to the spread of Western education, seeing it as an attempt to undermine and discourage traditional Islamic and Hindu learning.' }));

items.push(mcq(6, '160', 'Which army regiment refused to serve in Sindh in 1844 till they got an extra allowance?',
  ['Punjab regiment', 'Garhwal regiment', 'Bengal regiment', 'Sikh regiment'], 2,
  { explanation: 'In 1844, regiments of the Bengal Army raised their objection to being posted to Sindh without the extra "batta" (allowance) traditionally paid for distant/overseas service, refusing to serve until it was granted.' }));

items.push(mcq(7, '161', 'The loss in which war revealed the weakness of the British?',
  ['Anglo-Mysore war', 'First War of Independence', 'Battle of Plassey', 'First Anglo-Afghan war'], 3,
  { explanation: 'The British army suffered major reverses in the First Anglo-Afghan War (1838-42) — including the disastrous retreat from Kabul — as well as in the Punjab Wars (1845-49) and the Crimean War (1854-56), revealing to Indians that the British were not invincible.' }));

items.push(mcq(8, '161', 'What was the immediate cause of the First War of Independence?',
  ['Introduction of Brown Bess Guns', 'Introduction of Enfield Rifles', 'Racial discrimination', 'Establishment of Christian missionaries'], 1,
  { explanation: 'The immediate cause of the First War of Independence was the introduction of the new Enfield rifles, whose cartridges were rumoured to be greased with the fat of cows and pigs.' }));

items.push(mcq(9, '161', 'Why did the Indian sepoys refuse to go outside India?',
  ['Sea voyage was forbidden by their religion', 'They feared they would catch infection and diseases', 'They feared sea storms', 'They feared attack by the pirates'], 0,
  { explanation: 'According to traditional (particularly Brahminical) religious belief, crossing the seas ("kala pani") was taboo and caused loss of caste — this is precisely why the British Parliament had to pass the General Service Enlistment Act in 1856 to compel overseas service.' }));

items.push(mcq(10, '161', 'What did Nana Saheb do with the enormous wealth that he inherited from the ex-Peshwa?',
  ['He bribed the British officials to win back his territory', 'He sent emissaries to establish traditional schools', 'He sent emissaries to different parts of the country for generating awareness among the Indians about the British policies.', 'He encouraged the British officials to pay his pension by bribing them'], 2,
  { explanation: 'Nana Saheb used his inherited wealth to send emissaries across different parts of the country, gathering support and generating awareness of British policies in order to build opposition to British influence.' }));

items.push(mcq(11, '161', 'Indians were excluded from all high offices in the ................. as well as .................',
  ['Court, clubs', 'Court, administration', 'Army, administration', 'Administration, educational institutions'], 2,
  { explanation: 'The British government deliberately kept Indians away from the higher posts of the army and the administration.' }));

items.push(mcq(12, '161', 'The ............... and ............... were looked down upon as means to break social order and caste rules.',
  ['Army, court', 'Western education, lawyers', 'Pandits, maulvis', 'Railways, telegraphs'], 3,
  { explanation: 'Railways and telegraphs were seen by many Indians as instruments the British used to break down the traditional social order and caste rules of the country.' }));

items.push(mcq(13, '162', 'Shifting of emphasis from ............... to ............... was not well received by the people.',
  ['Oriental learning, Western education', 'Western education, Oriental learning', 'English, Sanskrit', 'Sanskrit, Persian'], 0,
  { explanation: 'The shift in emphasis from oriental (traditional Hindu/Islamic) learning to Western education was not well received, especially by the Pandits and Maulvis, who saw it as an attempt to discourage traditional Islamic and Hindu studies.' }));

items.push(mcq(14, '162', 'The strategic places like ............... and ............... did not have British armies.',
  ['Bengal, Madras', 'Delhi, Allahabad', 'Mysore, Poona', 'Lucknow, Mysore'], 1,
  { explanation: 'Strategically important places like Delhi and Allahabad had no British armies stationed there and were held entirely by Indian soldiers — a vulnerability the rebels of 1857 were able to exploit.' }));

items.push(mcq(15, '162', 'In January 1857 there was a rumour in the Bengal regiments cartridges used for the Enfield Rifles were greased with the fat of ............... and ............... .',
  ['Buffaloes, cows', 'Cows, pigs', 'Eggs, chickens', 'Pigs, buffaloes'], 1,
  { explanation: 'The cartridges for the new Enfield rifles were rumoured to be greased with the fat of cows (sacred to Hindus) and pigs (forbidden to Muslims), offending both religious communities among the sepoys.' }));

items.push(mcq(16, '162', 'Arrange the following in the chronological order:\nI. The General Service Enlistment Act\nII. The First Afghan War\nIII. The Religious Disabilities Act\nIV. The Abolition of Sati\nChoose the correct option:',
  ['I, III, IV, II', 'IV, II, III, I', 'III, I, II, IV', 'II, III, I, IV'], 1,
  { explanation: 'By actual date: the Abolition of Sati (1829) came first, followed by the First Afghan War (1838-1842), then the Religious Disabilities Act (1850), and finally the General Service Enlistment Act (1856) — i.e. IV, II, III, I, independently confirmed against each event\'s historical date, matching the printed key.' }));

items.push(mcq(17, '162', 'Arrange the following in the chronological order:\nI. The Inam Commission\nII. The Battle of Plassey\nIII. The Third Anglo-Maratha War\nIV. The Widow Remarriage Act\nChoose the correct option:',
  ['IV, II, I, II', 'III, IV, I, II', 'II, III, I, IV', 'III, I, IV, II'], 2,
  { explanation: 'By actual date: the Battle of Plassey (1757) came first, followed by the Third Anglo-Maratha War (1817-18), then the Inam Commission (established 1852 to examine land grants in the Bombay Presidency), and finally the Hindu Widows\' Remarriage Act (1856) — i.e. II, III, I, IV, independently confirmed against each event\'s historical date, matching the printed key. (Option (a) as printed in the source repeats "II" twice — "IV, II, I, II" — which appears to be a printing typo for "IV, II, I, III"; this does not affect the correct answer, which is option (c).)' }));

items.push(mcq(18, '163', 'Military causes for the First War of Independence:\n\nCOLUMN I\nI. The Sepoys were required to serve in areas far away from their homes without any additional allowance.\nII. The officers treated their soldiers like menial servants though they were experienced men who had conquered several kingdoms for their masters.\nIII. This increased the self-confidence of the Indian soldiers, who felt they could challenge the British in India also.\nIV. Indian soldier could be sent overseas on duty.\n\nCOLUMN II\n(A) Ill-treatment of Indian soldiers by British Officers\n(B) Loss of Afghan War by the British\n(C) General Service Enlistment Act, 1856\n(D) Low salary\n\nChoose the correct option:',
  ['I – D, II – A, III – B, IV – C', 'I – C, II – B, III – D, IV – A', 'I – B, II – A, III – C, IV – D', 'I – C, II – D, III – A, IV – B'], 0,
  { explanation: 'I (serving far from home without extra allowance) matches D (low salary/denied extra pay); II (officers treating experienced soldiers as menial servants) matches A (ill-treatment by British officers); III (increased self-confidence to challenge the British) matches B (this followed directly from the British defeat in the Afghan War, per item 7); IV (being sent overseas on duty) matches C (the General Service Enlistment Act, 1856, per item 3) — I-D, II-A, III-B, IV-C, matching the printed key.' }));

items.push(mcq(19, '163', 'Study the picture and answer the following question. Identify the personality in the picture.',
  ['Lord Dalhousie', 'Lord Wellesley', 'Lord Curzon', 'Lord Mountbatten'], 1,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.163, item 19 — portrait photograph/engraving of Lord Wellesley', assetType: 'source_page_full' }],
    explanation: 'The given image is of the British Governor-General Lord Wellesley, who took many important political and economic decisions in India — including introducing the Subsidiary Alliance described in item 1.',
  }));

items.push(mcq(20, '163', "Assertion (A): The British officers were rude and arrogant towards the Indians.\nReason (R): The officers believed that they were superior to Indians and followed a policy of contempt towards the Indians.",
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 0,
  { explanation: 'British officers did treat Indian soldiers and civilians with rudeness and arrogance (A), stemming directly from a genuine belief in racial superiority and a policy of contempt towards Indians (R) — R correctly explains A.' }));

items.push(mcq(21, '164', "Assertion (A): In the railway compartments, people of all castes had to sit together, and there was general acceptance.\nReason (R): The railways and telegraphs were looked down upon as means to break social order and caste-rules.",
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 3,
  { explanation: 'In railway compartments, people of all castes indeed had to sit together, but this was met with resentment, not "general acceptance" — so A is false. R, that railways and telegraphs were looked down upon as instruments breaking social order and caste rules (as stated in item 12), is independently true — A is false but R is true.' }));

items.push(mcq(22, '164', "Assertion (A): The peasants were discontented with the Britisher's land revenue policy and consequent loss of their land.\nReason (R): Heavy duties on Indian silk and cotton textiles in Britain — destroyed the Indian industries.",
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 1,
  { explanation: 'Both statements are independently true historical grievances — peasant discontent over land revenue policy and land loss (A), and the deindustrialization of Indian textiles due to heavy British duties (R) — but R (a trade/industrial grievance) does not causally explain A (a land-revenue grievance); they are separate causes of discontent.' }));

items.push(mcq(23, '164', '................. announced that the successors of Bahadur Shah could not use imperial titles.',
  ['Lord Canning', 'Lord Wellesley', 'Lord Dalhousie', 'Lord Ripon'], 0,
  { explanation: 'In 1856, Lord Canning announced that after the death of Bahadur Shah, his successors would not be allowed to use imperial titles and would be known merely as princes.' }));

items.push(mcq(24, '164', 'In 1856, the British East India Company justified the annexation of Awadh, a princely state in northern India, on what grounds?',
  ['acquire more land for British colonies', 'stop the rebellion against the British', 'punish the Nawab of Awadh for opposing British rule', 'due to alleged misgovernance by the Nawab of Awadh'], 3,
  { explanation: 'In 1856, Lord Dalhousie annexed Awadh to the Company\'s dominions on the pretext of alleged misrule/misgovernance by the Nawab of Awadh — not under the Doctrine of Lapse, since Awadh had an heir.' }));

items.push(mcq(25, '164', 'Which of the following states was not annexed by the British due to the Doctrine of Lapse?',
  ['Udaipur', 'Jhansi', 'Nagpur', 'Poona'], 3,
  { explanation: 'The Doctrine of Lapse, followed by the British East India Company, allowed annexation of a ruler\'s territory if he died without a legitimate natural heir; Udaipur, Jhansi and Nagpur were annexed on this basis. Poona (the former Peshwa\'s seat) had instead been annexed decades earlier, in 1818, after the Third Anglo-Maratha War — well before Lord Dalhousie introduced the Doctrine of Lapse from 1848 onward.' }));

items.push(mcq(26, '164', "Who was responsible for introducing the policy of 'The Doctrine of Lapse'?",
  ['Lord Curzon', 'Lord Canning', 'General Havelock', 'Lord Dalhousie'], 3,
  { explanation: 'The Doctrine of Lapse was a policy initiated by Lord Dalhousie, Governor-General of India from 1848 to 1856.' }));

items.push(mcq(27, '165', 'Who was the Mughal ruler during the revolt of 1857?',
  ['Wajid Ali Shah', 'Bahadur Shah Zafar', 'Siraj Ud Daula', 'Shah Alam'], 1,
  { explanation: 'Bahadur Shah Zafar, the last Mughal emperor, became an important (if largely symbolic) head for the rebels during the Indian Rebellion of 1857 against British rule.' }));

// SOURCE NUMBERING QUIRK (disclosed): the printed book skips "28" entirely
// and prints "29" twice, for two unrelated questions. Both transcribed
// below with sourceQuestionNumber '29' exactly as printed, rather than
// silently renumbered.
items.push(mcq(29, '165', 'Who passed the General Service Enlistment Act in 1856?',
  ['Lord Curzon', 'Lord Mountbatten', 'Lord Canning', 'Lord Dalhousie'], 2,
  {
    explanation: "In 1856, Lord Canning's government passed 'The General Service Enlistment Act', which decreed that all future recruits to the Bengal Army would have to give an undertaking to serve anywhere their services might be required by the Government.",
    answerKeyRef: 'printed Ans., p.165 — SOURCE NUMBERING QUIRK: the book prints this and the following item both as "29" (question "28" is missing/skipped in the original); transcribed as printed rather than silently renumbered.',
  }));

items.push(mcq(29, '165', 'Who became the first martyr of the 1857 revolt?',
  ['Tantya Tope', 'Kunwar Singh', 'Mangal Pandey', 'Nana Sahib'], 2,
  {
    explanation: 'Mangal Pandey\'s attack on British officers on March 29, 1857, and his subsequent execution, are considered the spark that ignited the widespread Indian Rebellion of 1857 — he is conventionally regarded as the revolt\'s first martyr.',
    answerKeyRef: 'printed Ans., p.165 — SOURCE NUMBERING QUIRK: the book prints this and the preceding item both as "29" (question "28" is missing/skipped in the original); transcribed as printed rather than silently renumbered.',
  }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'First War of Independence: 1857',
  chapterOrder: 7,
  label: 'ch07-first-war-of-independence-1857.pdf',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
