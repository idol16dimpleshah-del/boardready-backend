// ICSE Class 10 History & Civics — Chapter 9: "First Phase of the Indian
// National Movement (1885-1907)". Uploaded 2026-09-17 as chap_9.pdf,
// archived via archive-icse-history-ch9.js -> source_files.id 110. Standing
// instruction: "now on till i dont change it will be icse 10 history
// chapter wise i will be uploading, make sure you feed in the system."
//
// Verification method (same as Ch7-8): every printed answer checked against
// documented history of the early ("Moderate") phase of the Indian National
// Congress — Surendranath Banerjee, Gopal Krishna Gokhale, Dadabhai Naoroji,
// the Indian Association, the Servants of India Society — rather than
// constitutional articles or arithmetic. The chronological-ordering item
// (14) was independently re-verified against each event's actual historical
// date (Age-limit reduction 1878, Indian National Conference 1883, Gokhale's
// Imperial Legislative Council membership 1902, Servants of India Society
// 1905) and matched the printed key.
//
// ONE DISCLOSED DEFECT — item 5: the printed question stem ("In the 1906
// Congress passed some special resolutions on swaraj, swadeshi, boycott and
// national education.") does not logically connect to its own printed
// answer/explanation (which is about Dadabhai Naoroji's view that "justice"
// was the real basis of political power). This reads as a genuine printing/
// typesetting defect in the source — most likely two originally separate
// questions merged during layout — rather than a factual error. Transcribed
// verbatim (stem as printed) with the printed answer kept, flagged
// needs_review and disclosed rather than silently rewritten into a
// "corrected" question the source never actually printed.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 110;

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

items.push(mcq(1, '172', 'For administrative reforms, the Congress urged the Government for wider employment of whom in the higher services?',
  ['Indians', 'Britishers', 'Professionals', 'Weavers'], 0,
  { explanation: 'The Congress felt the absence of Indians in the higher levels of administration and urged the British to give more space to Indians there.' }));

items.push(mcq(2, '172', 'What did the early Congress members request for the local municipal bodies?',
  ['Abolition of municipal bodies', 'Increase in the number of local bodies', 'Local bodies to be run by the Viceroy', 'Increase in their powers and reducing official control over them'], 3,
  { explanation: 'The Congress members supported the idea of giving greater powers to municipal bodies, decentralising power away from the federal and state governments.' }));

items.push(mcq(3, '172', 'What economic reform did the early Congress leaders demand regarding industries?',
  ['Heavy tax on export goods', 'Abolition of salt tax', 'Industrial growth through trade protection', 'Reduction in expenditure'], 2,
  { explanation: 'Industrial growth through trade protection meant imposing a heavy tax on imported goods, while the government provided loans for the development of Indian iron, coal, paper and sugar industries.' }));

items.push(mcq(4, '172', "What did Dadabhai Naoroji aim to provide the members of the British Parliament through East India Association?",
  ['Praise Government policies', "Information about India's grievances", 'Terminate British rule', 'Become the Viceroy'], 1,
  { explanation: "Dadabhai Naoroji, through the East India Association he founded in London in 1866, aimed to provide members of the British Parliament with information about India's genuine grievances." }));

items.push(mcq(5, '172', 'In the 1906 Congress passed some special resolutions on swaraj, swadeshi, boycott and national education.',
  ['Brute force', 'Boycott', 'Swadeshi', 'Justice'], 3,
  {
    explanation: "DISCLOSED DEFECT (needs_review): as printed, this question's stem does not logically connect to its own answer and explanation. The source's printed explanation for this item reads, verbatim: \"Dadabhai Naoroji was of the opinion that the real basis of political power was the justice\" — which answers a different, evidently intended question along the lines of \"According to Dadabhai Naoroji, what was the real basis of political power?\" (Answer: Justice), not the printed stem about the 1906 Congress session's resolutions on swaraj/swadeshi/boycott/education. This looks like a genuine typesetting defect (two questions merged/truncated during layout) rather than a factual error. Transcribed with the stem exactly as printed and the printed answer (d) Justice kept unchanged, since Naoroji's actual view — that justice was the real basis of political power — is itself historically accurate and independently verifiable; the mismatch is disclosed rather than silently resolved by rewriting the question the source never actually printed cleanly.",
      answerStatus: 'needs_review',
      answerKeyRef: 'printed Ans., p.172, item 5 — DEFECT: printed question stem does not match its own printed explanation, which answers a different question about Dadabhai Naoroji\'s view of the basis of political power; see explanation.',
  }));

items.push(mcq(6, '172', 'Surendranath Banerjee believed elective offices were just a means to serve:',
  ['Prison mates', 'People', 'British', 'Politicians'], 1,
  { explanation: 'Surendranath Banerjee felt that the primary duty of elective offices was to serve the people.' }));

items.push(mcq(7, '173', "What was the Surendranath Banerjee's best known book?",
  ['Poverty and Un-British Rule in India', 'Gulamgiri', 'A Nation in Making', 'The Call to Young India'], 2,
  { explanation: 'One of the most renowned works of Surendranath Banerjee was his autobiography, "A Nation in Making".' }));

items.push(mcq(8, '173', 'What did Gokhale plead for regarding the cotton goods?',
  ['Reduction in excise duty', 'Abolition of excise duty', 'Increase in export of Indian cotton goods into Britain', 'None of the above'], 1,
  { explanation: 'In 1902, Gokhale became a member of the Imperial Legislative Council and pleaded for reduction in Salt Duty and abolition of excise duty on cotton goods.' }));

items.push(mcq(9, '173', 'Who said at the Varanasi Congress Session, "The goal of the Congress should be attainment of a form of government similar to that which existed in the self-governing colonies of the British empire"?',
  ['Pherozeshah Mehta', 'Surendranath Banerjee', 'Dadabhai Naoroji', 'Gopal Krishna Gokhale'], 3,
  { explanation: 'These famous lines were said by Gopal Krishna Gokhale during the Swadeshi Movement, at the Varanasi (Banaras) Congress Session.' }));

items.push(mcq(10, '173', 'The Congress leaders insisted on colonial form of self-government, like the administrative system found in the dominions of ............... and ............... .',
  ['Africa, Greenland', 'Norway, Belgium', 'Canada, Australia', 'Tasmania, New Zealand'], 2,
  { explanation: 'The Congress leaders demanded the colonial form of self-government which was found in the dominions of Canada and Australia.' }));

items.push(mcq(11, '173', 'The early Congress leaders demanded total abolition of ............... and the duty on sugar.',
  ['Land revenue', 'Foreign goods', 'Press regulation', 'Salt tax'], 3,
  { explanation: 'The tax on salt and duty on sugar were among the worst forms of British economic exploitation in India, and the early Congress leaders were strongly against them.' }));

items.push(mcq(12, '173', 'The early nationalists did not believe in ............... or ............... means.',
  ['Agitation, unconstitutional', 'Revolt, constitutional', 'Liberty, democratic', 'British rule, unconstitutional'], 0,
  { explanation: 'The early (Moderate) leaders of the Congress did not believe in the idea of using agitation and unconstitutional means against the British.' }));

items.push(mcq(13, '173', 'Gokhale was a man of ............... views and had immense faith in British ............... .',
  ['Moderate, liberalism', 'Radical, capitalism', 'Extremist, socialism', 'Moderate, marketing'], 0,
  { explanation: 'Gopal Krishna Gokhale had moderate views concerning British administration and also had faith in British liberalism.' }));

items.push(mcq(14, '174', 'Arrange in chronological order from the past to the present.\nI. Surendranath Banerjee took the lead in convening the Indian National Conference.\nII. Gopal Krishna Gokhale became the Member of the Imperial Legislative Council.\nIII. Gokhale established the Servants of India Society.\nIV. The age limit for the Civil Service Examination was reduced from 21 to 19 years.\nChoose the correct option:',
  ['III, IV, II, I', 'IV, II, I, III', 'IV, I, II, III', 'I, III, IV, II'], 2,
  { explanation: 'By actual date: the age limit for the Civil Service Examination was reduced from 21 to 19 in 1878, Surendranath Banerjee convened the Indian National Conference in 1883, Gokhale became a member of the Imperial Legislative Council in 1902 (per item 8), and Gokhale established the Servants of India Society in 1905 (per item 17) — i.e. IV, I, II, III, independently confirmed against each event\'s date, matching the printed key.' }));

items.push(mcq(15, '174', 'What was the aim of the Indian Association?',
  ['To create a stir for the introduction of political reforms in India', 'To unite the farmers across India', 'To create a political blockade to interrupt the working of the British officers', 'To unite the British officers and nationalist leaders to promote western education'], 0,
  { explanation: 'The Indian Association (founded 1876 by Surendranath Banerjee and Anandmohan Bose) was formed for the purpose of creating a stir and carrying out political reforms in India.' }));

items.push(mcq(16, '174', 'Against which of the following Acts did Surendranath Banerjee protest fearlessly?',
  ['Rowlatt Act', 'Vernacular Press Act', 'Arms Act', 'Both (b) and (c)'], 3,
  { explanation: "Surendranath Banerjee agitated fearlessly against the Vernacular Press Act and the Arms Act, as well as against the lowering of the age limit from 21 to 19 to appear in the ICS examination." }));

items.push(mcq(17, '174', 'Identify the organisation established by Gopal Krishna Gokhale where men were trained to devote their lives to the cause of the country.',
  ['Indian Association', 'Servants of India Society', 'Brahmo Samaj', 'Ramkrishna Mission'], 1,
  { explanation: 'The Servants of India Society was formed by Gopal Krishna Gokhale in 1905. This organisation trained men to devote their lives to the service of the country.' }));

items.push(mcq(18, '174', 'How did Gokhale decide to carry out constitutional agitation?',
  ['Petition, appeals to justice and passive resistance', 'Strikes and hartals', 'Boycott movement', 'Revolts'], 0,
  { explanation: 'The Moderates, including Gokhale, adopted the path of petitions, appeals to justice, and passive resistance to raise the consciousness of the British and carry forward the freedom struggle.' }));

items.push(mcq(19, '174', "Assertion (A): Early Congressmen opposed the suppression of the freedom of speech and expression.\nReason (R): The Congress believed that the suppression of a free press would not check 'sedition' or rebellion against the government, it would only encourage it to go underground.",
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 0,
  { explanation: "The Congress supported the idea of a free press and freedom of speech and expression, believing this to be essential for the nation's progress — R correctly explains why the Congress held this position (A)." }));

items.push(mcq(20, '175', "Assertion (A): The nationalist leaders only criticised the British government harshly.\nReason (R): These leaders recognised the benefits which the British had provided to the Indians, especially the English language and the modern means of communication and transport.",
  ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 3,
  { explanation: 'The Moderate nationalist leaders did NOT confine themselves to harsh criticism alone — their actual approach combined constitutional criticism with recognised cooperation with the British where deemed useful (see item 26\'s "opposition where necessary, cooperation where possible"), so A is false. R, that these leaders recognised genuine benefits of British rule such as the English language and modern transport/communication, is independently true.' }));

items.push(mcq(21, '175', 'Identify the Early Nationalist leader. [Board Question]',
  ['Gopal Krishna Gokhale', 'Bipin Chandra Pal', 'Jyotiba Phule', 'Bal Gangadhar Tilak'], 0,
  { explanation: 'G.K. Gokhale was one of the earliest (Moderate) nationalist leaders who played an important role in raising the political consciousness of the Indian people against British rule — unlike Bipin Chandra Pal and Bal Gangadhar Tilak, who belonged to the later Extremist/Radical phase, or Jyotiba Phule, primarily a social reformer.' }));

items.push(mcq(22, '175', 'Who is known as the "Father of Nationalist Movement In India"?',
  ['Dadabhai Naoroji', 'G.K. Gokhale', 'Surendranath Banerjee', 'Bipin Chandra Pal'], 2,
  { explanation: 'Surendranath Banerjee was a prominent figure in the Indian independence movement and a key leader in the early phase of political nationalism in India, earning him this epithet.' }));

items.push(mcq(23, '175', "Which time period was known as 'The Phase of Assertive Nationalists or Radicals'?",
  ['1919-1947', '1885-1905', '1920-1947', '1905-1919'], 3,
  { explanation: 'This phase, running roughly 1905-1919, is characterised by the rise of more radical/assertive approaches towards British rule in India, influenced by leaders like Bal Gangadhar Tilak, Bipin Chandra Pal, and Lala Lajpat Rai.' }));

items.push(mcq(24, '175', 'Which Nationalist wrote the book "Poverty and Un-British Rule In India"?',
  ['W.C Banerjee', 'Madan Mohan Malviya', 'Dadabhai Naoroji', 'Lala Lajpat Rai'], 2,
  { explanation: 'Dadabhai Naoroji wrote "Poverty and Un-British Rule in India" (1901) — he was a key figure in the Indian Nationalist Movement, also known as the Grand Old Man of India.' }));

items.push(mcq(25, '176', "Which Nationalist opposed Lord Curzon for dividing Bengal and was called a 'seditionist in disguise' by the British?",
  ['Gopal Krishna Gokhale', 'Bal Gangadhar Tilak', 'S.N. Banerjee', 'M.G. Ranade'], 0,
  { explanation: "Gopal Krishna Gokhale was a popular Moderate leader of the early Nationalist movement. He was fiercely criticised by Extremist Congress leaders as a 'faint-hearted moderate' and, for his opposition to the Partition of Bengal while still favouring engagement with the British Government, was branded a 'seditionist in disguise' by the British." }));

items.push(mcq(26, '176', 'Whose philosophy was "opposition where necessary, cooperation where possible"?',
  ['Lord Curzon', 'Dadabhai Naoroji', 'M.G. Ranade', 'Surendranath Banerjee'], 3,
  { explanation: "This philosophy encapsulates the Moderate strategy of selectively opposing colonial policies deemed harmful to Indian interests while also seeking cooperation with the British where it was considered beneficial — associated with Surendranath Banerjee." }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'First Phase of the Indian National Movement (1885-1907)',
  chapterOrder: 9,
  label: 'ch09-first-phase-of-the-indian-national-movement.pdf',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
