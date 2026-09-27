// ICSE Class 10 History & Civics — Chapter 8: "Rise of Nationalism and
// Establishment of the Indian National Congress". Uploaded 2026-09-17 as
// chap_8.pdf, archived via archive-icse-history-ch8.js -> source_files.id
// 109. Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch7): every printed answer checked against
// documented history of 19th-century social/political reform movements
// (Raja Rammohan Roy and the Brahmo Samaj, Jyotiba Phule and the Satya
// Shodhak Samaj, the Vernacular Press Act, the Ilbert Bill, the founding of
// the Indian National Congress) rather than constitutional articles or
// arithmetic. Both chronological-ordering items (13, 14) independently
// re-verified against each event's/publication's actual historical date —
// both matched the printed key. No needs_review items this chapter.
//
// DIAGRAM NOTE — item 15 shows an actual photographic portrait ("Study the
// picture and answer the following questions... Why is HE considered the
// Father of Indian National Congress?") — the pronoun "he" only resolves
// via the image (A.O. Hume), so the picture is load-bearing content, not
// decoration. Marked diagramStatus: 'source_diagram_preserved' with a
// visual link to the source page, matching the Ch7 item 19 precedent.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 109;

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

items.push(mcq(1, '166', 'How was Raja Rammohan Roy influenced by Islam?',
  ['Ethical teachings', 'Doctrines of Upanishads', 'Monotheism', 'Doctrine of nationalism'], 2,
  { explanation: 'Raja Rammohan Roy believed in the concept of unity of all religions, and found inspiration from the monotheism of Islam, the teachings of the Bible, and the doctrines propagated by the Upanishads.' }));

items.push(mcq(2, '166', "What was Rammohan Roy's belief about religion?",
  ['Each religion had set up a moral code necessary for social peace and happiness', 'Believed that women were superior to men', 'Opposed the caste system', 'Preached the power of strength and self-reliance'], 0,
  { explanation: 'Raja Rammohan Roy held that every religion has established a moral code which supports the idea of social peace and happiness.' }));

items.push(mcq(3, '166', 'Which social evil was abolished in India in 1829?',
  ['Child marriage', 'Caste system', 'Purdah system', 'Sati system'], 3,
  { explanation: 'In 1829, the British government (under Governor-General William Bentinck, with Raja Rammohan Roy\'s efforts playing a pivotal role) banned the practice of Sati in India.' }));

items.push(mcq(4, '166', 'Which Bengali weekly was started by Raja Rammohan Roy?',
  ['Sambad Kaumudi', 'Rast Goftar', 'Somprakash', 'Young India'], 0,
  { explanation: 'The Sambad Kaumudi was a Bengali weekly started by Raja Rammohan Roy.' }));

items.push(mcq(5, '166', 'Name the Persian paper started by Raja Rammohan Roy.',
  ['Rast Goftar', 'Punjab Kesari', 'Mirat-ul-Akhbar', 'Mahratta'], 2,
  { explanation: 'The famous Persian paper started by Raja Rammohan Roy was Mirat-ul-Akhbar.' }));

items.push(mcq(6, '166', 'Who apprised the Select Committee of the British Parliament about the poor economic conditions of the people in India?',
  ['Jyotiba Phule', 'Savitribai Phule', 'A.O. Hume', 'Raja Rammohan Roy'], 3,
  { explanation: 'Raja Rammohan Roy made efforts to bring the true economic conditions of the people of India before the British Parliament (testifying before its Select Committee).' }));

items.push(mcq(7, '167', 'Why did Phule say that women were superior to men?',
  ['They bore children and nursed them.', 'Women were revered as Bharat Mata.', 'He regarded women as "priceless possession".', 'If a woman is educated, the whole nation will be educated.'], 0,
  { explanation: 'Jyotiba Phule made significant contributions to the upliftment of women, and considered them superior to men because they bore children and nursed them.' }));

items.push(mcq(8, '167', 'In which year did Phule establish one of the first girls school in India?',
  ['1829', '1848', '1873', '1896'], 1,
  { explanation: 'The first girls\' school in India (in Pune) was established by Jyotiba and Savitribai Phule in the year 1848.' }));

items.push(mcq(9, '167', 'Identify one of the immediate objectives of the Congress as stated by W.C. Bonnerjee.',
  ['Holding of Indian Civil Service examination both in England and India', 'Appointment of a Royal Commission to enquire into the working of the Indian administration', 'To train and mobilise public opinion all over the country', 'Expansion of the Legislative Councils'], 2,
  { explanation: 'One of the earliest goals of the Indian National Congress, as articulated by its first president W.C. Bonnerjee, was to train and mobilise public opinion all over the country.' }));

items.push(mcq(10, '167', 'Raja Rammohan Roy stressed on the ............ of all religions.',
  ['Awakening', 'Validity', 'Unity', 'Division'], 2,
  { explanation: 'Raja Rammohan Roy believed that all religions are essentially equal and should be cooperative towards each other, stressing their fundamental unity.' }));

items.push(mcq(11, '167', 'Why was the Vernacular Press Act (1878) introduced?',
  ['To encourage the growing journalism in India.', 'To introduce reforms in the publishing industry', 'To forbade Vernacular paper from publishing any objectionable content against the British.', 'To forbade both English and Hindi newspapers from publishing critical opinions against the British rule.'], 2,
  { explanation: 'The Vernacular Press Act of 1878, introduced under Lord Lytton, was designed to control the Indian-language (vernacular) press and forbid it from publishing content objectionable to, or critical of, the British government — English-language papers were not covered by this Act.' }));

items.push(mcq(12, '167', 'The ............ was attended by 72 delegates from all parts of India.',
  ['First Congress Session', 'Second Congress Session', 'Third Congress Session', 'Fourth Congress Session'], 0,
  { explanation: 'The First Session of the Indian National Congress, held in December 1885, was attended by 72 delegates from all parts of India and took place in Bombay.' }));

items.push(mcq(13, '167', 'Arrange these newspapers according to their starting date from the past to the present:\nI. The Pioneer was started.\nII. The Hindu was published in Madras.\nIII. The Statesman was founded.\nIV. The Times of India was founded.\nChoose the correct option:',
  ['IV, I, III, II', 'II, III, I, IV', 'III, II, IV, I', 'I, III, IV, II'], 0,
  { explanation: 'By actual founding date: The Times of India traces to 1838 (as the Bombay Times and Journal of Commerce), The Pioneer was founded in 1865, The Statesman in 1875, and The Hindu was first published in Madras in 1878 — i.e. IV, I, III, II, independently confirmed against each paper\'s founding date, matching the printed key.' }));

items.push(mcq(14, '168', 'Arrange the following events from the past to the present:\nI. Foundation of the Brahmo Samaj\nII. Grand Delhi Durbar\nIII. Foundation of the Asiatic Society of Bengal\nIV. Ilbert Bill\nChoose the correct option:',
  ['I, IV, III, IV', 'II, IV, III, I', 'III, I, II, IV', 'IV, III, II, I'], 2,
  { explanation: 'By actual date: the Asiatic Society of Bengal was founded in 1784, the Brahmo Samaj in 1828, the Grand Delhi Durbar was held in 1877, and the Ilbert Bill was introduced in 1883 — i.e. III, I, II, IV, independently confirmed against each event\'s date, matching the printed key. (Option (a) as printed, "I, IV, III, IV", repeats "IV" twice — almost certainly a printing typo for "I, IV, III, II" — this does not affect the correct answer, which is option (c).)' }));

items.push(mcq(15, '168', 'Study the picture and answer the following question. Why is he considered the Father of Indian National Congress?',
  ['He was the first President of the Indian National Congress.', 'He was a political reformer.', 'He played a major role in the formation of the Congress', 'He was a retired civil servant.'], 2,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.168, item 15 — portrait photograph/engraving of A.O. Hume', assetType: 'source_page_full' }],
    explanation: 'The pictured figure is A.O. Hume, who was one of the first men to propose the idea of forming the Indian National Congress and is consequently regarded as its "Father" — he was not himself its first President (that was W.C. Bonnerjee, per items 9 and 28).',
  }));

items.push(mcq(16, '168', 'Assertion (A): Raja Rammohan Roy waged a legal battle against Press Regulations.\nReason (R): Rammohan Roy acknowledged the blessings of British rule in India.',
  ['Both A and R are true and R is the correct explanation of A', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 1,
  { explanation: 'Rammohan Roy did indeed contest press restrictions imposed on Indian journals in those days (A is true); he separately also acknowledged certain benefits of British rule, such as access to Western education (R is true) — but this acknowledgment is not what motivated or explains his specific legal battle against press regulations, so R is not the correct explanation of A.' }));

items.push(mcq(17, '169', 'What was the purpose of Satya Shodhak Samaj?',
  ['To educate girls', 'To give health care to the poor women', 'To shelter abandoned girls', 'To mitigate the sufferings and pain of Dalits and women.'], 3,
  { explanation: 'The Satya Shodhak Samaj, founded by Jyotiba Phule in 1873, was established to address the sufferings and pain of the Dalits and of women.' }));

items.push(mcq(18, '169', 'Complete the given analogy.\nIndian Arms Act : 1878 :: Ilbert Bill : ?',
  ['1870', '1872', '1883', '1885'], 2,
  { explanation: 'The Ilbert Bill was proposed in the year 1883 (and was passed in 1884).' }));

items.push(mcq(19, '169', 'Which of these was NOT an aim of the Indian National Congress?',
  ['To train and organise public opinion in the country', 'To promote friendly relations between nationalist political workers', 'To make the world aware of the true nature of the British', 'To formulate popular demands and present them before the government'], 2,
  { explanation: 'The Indian National Congress did not, in its early moderate phase, aim to make the world at large aware of "the true nature of the British" — its stated aims centred on training and organising domestic public opinion, promoting friendly relations among nationalist workers across India, and formulating and presenting popular demands to the government.' }));

items.push(mcq(20, '169', 'Which of these is NOT a repressive policy of Lord Lytton?',
  ['Arms Act', 'Ilbert Bill', 'Vernacular Press Act', 'Grand Delhi Durbar'], 1,
  { explanation: 'The Ilbert Bill (1883) was not a repressive measure at all — quite the opposite, it aimed to give Indian magistrates the power to try Europeans in court, and was introduced under Lord Ripon, after Lytton\'s own tenure (1876-1880) had ended. The Arms Act (1878), Vernacular Press Act (1878) and the extravagant Grand Delhi Durbar (1877, held amid a famine) were all associated with Lord Lytton\'s viceroyalty.' }));

items.push(mcq(21, '169', 'Complete the given analogy: Jyotiba Phule : Satya Shodhak Samaj :: Raja Rammohan Roy : ______.',
  ['Arya Samaj', 'Brahmo Samaj', 'Theosophical Society', 'Prarthana Samaj'], 1,
  { explanation: 'The foundation of the Brahmo Samaj was laid down by Raja Rammohan Roy in the year 1828 for the purpose of social reform, paralleling Phule\'s founding of the Satya Shodhak Samaj.' }));

items.push(mcq(22, '169', 'The central government of a country named X has decided to enforce a law similar to the Vernacular Press Act, which was enacted by the British in India in 1878 to control and regulate the vernacular press. Based on this information, who among the following is most likely to benefit from the enforcement of the law in X?',
  ['its citizens', 'the media industry', 'the opposition party', 'the ruling political party'], 3,
  { explanation: 'A law similar to the Vernacular Press Act would help the ruling political party in country X, since it would suppress press criticism of the government, sharply reducing the amount of critical coverage the ruling party would otherwise face from the mass media.' }));

items.push(mcq(23, '169', 'A college student named Roshni is doing a project on a prominent Indian leader whose core work revolved around Dalit rights. Who is Roshni MOST LIKELY writing about?',
  ['Surendranath Banerjee', 'Pherozeshah Mehta', 'Dadabhai Naoroji', 'Jyotiba Phule'], 3,
  { explanation: 'Jyotiba Phule was a prominent social reformer of the 19th century who dedicated his life to fighting against the caste system and securing social justice for the weaker sections of society (Dalits), founding the Satya Shodhak Samaj in 1873 for that purpose.' }));

items.push(mcq(24, '170', 'The ________ aimed to introduce equality between British and Indian Judges.',
  ['Vernacular Press Act', 'Gagging Act', 'Indian Arms Act: 1878', 'Ilbert Bill'], 3,
  { explanation: 'The Ilbert Bill, introduced by Sir C.P. Ilbert in 1883, placed Indian judges at par with European judges in many respects, allowing Indian judges to try European subjects — a practice previously restricted.' }));

items.push(mcq(25, '170', 'Who organised the Grand Delhi Durbar?',
  ['Lord Curzon', 'Lord Canning', 'Lord Lytton', 'Lord Dalhousie'], 2,
  { explanation: 'Lord Lytton organised the Grand Delhi Durbar in 1877 to proclaim Queen Victoria as the Empress of India.' }));

items.push(mcq(26, '170', 'Tahir is preparing to give a speech about the Sati system in India. Which of the following Indian leaders\' contribution MUST he mention in his speech?',
  ['Raja Ram Mohan Roy', 'W. C. Bonerjee', 'Bipin Chandra Pal', 'Jyotiba Phule'], 0,
  { explanation: 'Raja Ram Mohan Roy played a pivotal role in the abolition of the Sati system in India; due to his efforts, the practice was finally abolished by the Governor-General William Bentinck in 1829.' }));

items.push(mcq(27, '170', "Who was known as the Grand Old Man of India?",
  ['Surendra Nath Banerjee', 'Dadabhai Naoroji', 'Lala Lajpat Rai', 'Jyotirao Phule'], 1,
  { explanation: 'Dadabhai Naoroji was a prominent Indian nationalist and a founding member of the Indian National Congress, widely known by the epithet "the Grand Old Man of India."' }));

items.push(mcq(28, '170', 'Who was elected as the president of the first session of The Indian National Congress held in 1885?',
  ['A.O. Hume', 'Pheroze Shah Mehta', 'W.C. Banerjee', 'Surendra Nath Banerjee'], 2,
  { explanation: 'W.C. Bonnerjee (Banerjee) was elected as the president of the first session of the Indian National Congress in 1885; the session was held in Bombay (now Mumbai).' }));

items.push(mcq(29, '170', 'Who is regarded as an important figure of the Social Reform Movement in Maharashtra?',
  ['Raja Rammohan Roy', 'Jyotirao Phule', 'Dayanand Saraswati', 'Annie Besant'], 1,
  { explanation: 'Jyotirao Phule was a prominent activist, thinker, and social reformer in 19th-century Maharashtra, who worked extensively towards eradicating untouchability and the caste system and also promoted the education of women — distinguishing him from Bengal-based Rammohan Roy, the Punjab/Gujarat-associated Dayanand Saraswati, and England/Theosophical-Society-linked Annie Besant.' }));

items.push(mcq(30, '171', 'What was the objective of the East India Association that was found by Dadabhai Naoroji?',
  ['To fight for the freedom of India', "To raise India's genuine grievances before the British Parliament.", 'To unify the nation', 'To raise funds for the Independence movement'], 1,
  { explanation: 'The East India Association, founded by Dadabhai Naoroji in London in 1866, aimed to raise India\'s genuine grievances before the British Parliament.' }));

items.push(mcq(31, '171', "Who established the 'Scientific Society' in several towns and cities?",
  ['Sir Syed Ahmed Khan', 'A.O. Hume', 'Bipan Chandra', 'Raja Rammohan Roy'], 0,
  { explanation: "Sir Syed Ahmed Khan established the 'Scientific Society' (1864) in several towns and cities to promote scientific education among the Indian populace during the 19th century, as part of the wider Aligarh movement." }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'Rise of Nationalism and Establishment of the Indian National Congress',
  chapterOrder: 8,
  label: 'ch08-rise-of-nationalism-and-establishment-of-inc.pdf',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
