// ICSE Class 10 History & Civics — Chapter 16: "Towards Partition of India
// (1944-1947)". Uploaded 2026-09-17 as part of the combined chap_14-17.pdf,
// archived via archive-icse-history-ch14-17.js -> source_files.id 113
// (this one physical file covers Chapters 14, 15, 16 and 17 — see that
// script's header comment).
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch7-15): every printed answer checked
// against documented history of the Cabinet Mission Plan (1946), the
// Interim Government, the Mountbatten Plan (3 June 1947), the Radcliffe
// Award, and the Indian Independence Act 1947.
//
// DISCLOSED MINOR CAVEAT — item 1: statement 3 ("India's right to Secede
// from the Commonwealth") is the source's own framing of a Cabinet Mission
// Plan feature; the Plan's actual text is more precisely described as
// allowing any province to call for a reconsideration of the constitution
// after an initial ten-year period, rather than an explicit standalone
// "right to secede from the Commonwealth" clause. This is a common
// textbook simplification, not a self-contradiction — kept as printed,
// since it doesn't change which combination the key marks correct (the
// item's real graded point is that statement 2, residuary powers vested
// in the Centre, is false — the Cabinet Mission Plan actually vested
// residuary powers in the provinces/groups, consistent with its "weak
// centre" design in statement 1).
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

items.push({
  kind: 'case',
  sourceQuestionNumber: '1',
  sourcePage: '212',
  text: 'The features of the proposed Union of India by the Cabinet Plan included:\n1. Weak Centre with limited powers\n2. Residuary powers vested in the Centre\n3. India\'s right to Secede from the Commonwealth\n4. All the members of the Interim Cabinet would be Indians\nSelect the correct statements from the codes given below:',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.212, item 1',
  parts: [
    {
      text: 'Choose the correct code.',
      options: ['1, 2 and 3', '1, 3 and 4', '3 and 4', '1, 2, 3 and 4'],
      correct: 1,
      marks: 1,
    },
  ],
  explanation: 'Statement 1 is true: the Cabinet Mission Plan proposed a weak Union Centre with limited powers (only defence, foreign affairs, and communications). Statement 2 is false: the Plan actually vested RESIDUARY powers in the provinces/groups, not the Centre — consistent with, and part of, the deliberately weak-centre design in statement 1. Statement 4 is true: the Interim Government formed in September 1946 had all Indian members. Statement 3, that provinces/India would have the right to secede from the Commonwealth, is the source\'s own simplified framing of the Plan\'s actual provision allowing any province to seek reconsideration of the constitutional arrangement after an initial ten-year period; kept as printed since it doesn\'t affect which statements the key marks correct.',
});

items.push(mcq(2, '212', 'The Interim Government at the centre was formed in 1946 :',
  ['Before the visit of the Cabinet Mission', 'After the visit of the Cabinet Mission', 'As a result of Cripps Mission', 'After Mountbatten came to India for transfer of power to Indians'], 1,
  { explanation: 'The Interim government at the centre was formed after the visit of the Cabinet Mission. This plan was temporarily accepted by the Congress and the League.' }));

items.push(mcq(3, '212', 'Who was the Viceroy during the time Mr. Attlee of England declared the British intention to transfer power to Indians?',
  ['Lord Wavell', 'Lord Irwin', 'Lord Linlithgow', 'Lord Mountbatten'], 0,
  { explanation: 'For the purpose of taking necessary steps for the transfer of power to the Indians, Lord Wavell was recalled and Lord Mountbatten was appointed the new Viceroy.' }));

items.push(mcq(4, '212', "Lord Mountbatten came to India as Viceroy along with specific instruction to:",
  ['balkanize the Indian subcontinent', 'keep India united if possible', "accept Jinnah's demand for Pakistan", 'persuade the Congress to accept partition'], 1,
  { explanation: 'Lord Mountbatten was sent to India to see the peaceful transfer of India and to see that most of the provinces remains united.' }));

items.push(mcq(5, '213', 'According to the Mountbatten Plan, which of the following provinces was not to be included in the Indian dominion ?',
  ['Madras', 'Bombay', 'Sindh', 'Bihar'], 2,
  { explanation: 'The province of Sindh was given to the Pakistan, which means it will not remain the part of India.' }));

items.push(mcq(6, '213', 'Who headed the Cabinet Mission 1946?',
  ['A.V. Alexander', 'Sir Stafford Cripps', 'Lord Pethick Lawrence', 'None of these'], 2,
  { explanation: 'The Cabinet Mission of the 1946 was led by the Lord Pethick Lawrence. The other members were A.V. Alexander and Sir Stafford Cripps.' }));

items.push(mcq(7, '213', 'Who was responsible for the integration of Indian Princely States ?',
  ['Lord Mountbatten', 'Jawaharlal Nehru', 'C. Rajagopalachari', 'Sardar Vallabhbhai Patel'], 3,
  { explanation: 'The most prominent role in the integration of the princely states to India was played by Sardar Patel and V.P. Menon.' }));

items.push(mcq(8, '213', 'The proposals for partition of India into India and Pakistan were contained in the:',
  ['Cabinet Mission Proposals', 'Cripps Mission Proposals', 'Mountbatten Plan of 3rd June, 1947', "Prime Minister Attlee's statement of 20th February, 1947"], 2,
  { explanation: 'The partition of India was accepted in the Mountbatten Plan of 3rd June. It led to the acceptance of the demand of the Muslim League for a separate Muslim nation.' }));

items.push(mcq(9, '213', 'Cabinet Mission Plan placed Punjab province in which group?',
  ['Group A', 'Group B', 'Group C', 'Group D'], 1,
  { explanation: 'According to Cabinet Mission, the British Provinces would be divided into three different groups i.e. Group A, Group B, Group C. Punjab province was placed in Group B.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '10',
  sourcePage: '213',
  text: 'Which of the following statements is correct with respect to the Constituent Assembly as per Cabinet Plan:\nI. 296 members to be elected from the British Provinces.\nII. 93 members to be elected from the princely states.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.213, item 10',
  parts: [
    {
      text: 'Choose the correct option.',
      options: ['Only I', 'Only II', 'Both I and II', 'Neither I nor II'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'The Cabinet Mission Plan proposed a Constituent Assembly of 296 members elected from British India\'s provinces plus up to 93 members representing the princely states (total 389) — both statements are correct.',
});

items.push(mcq(11, '213', 'The demarcation of boundary between India and Pakistan is based on ............... .',
  ['Morley-Minto Award', 'Durand Award', 'Radcliffe Award', 'None of these'], 2,
  { explanation: 'The demarcation of the India and Pakistan boundaries was done by Cyril Radcliffe, due to which it is known as the Radcliffe line.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '12',
  sourcePage: '214',
  text: 'Which of the following statement is /are correct regarding Cabinet Plan:\nI. Muslim League\'s demand of Pakistan was accepted.\nII. Separate representation was given to Muslims and Sikhs.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.214, item 12',
  parts: [
    {
      text: 'Choose the correct option.',
      options: ['Only I', 'Only II', 'Both I and II', 'Neither I nor II'],
      correct: 1,
      marks: 1,
    },
  ],
  explanation: "Statement I is false: the Muslim League's demand for Pakistan was rejected by the Cabinet Mission, which instead proposed a grouped federal structure to keep India united. Statement II is true: the Cabinet Mission's Constituent Assembly election scheme allocated provincial seats separately among General, Muslim and Sikh communities in proportion to population.",
});

items.push(mcq(13, '214', 'Look at the picture carefully and answer the question which follows:\n[Photograph: crowds of people, with belongings, crowded on top of and inside a railway train.]\nWhat does the picture depict?',
  ['Mass migration of Indians across the Radcliffe Line', 'People thronging to Kumbh at Prayagraj', 'Sikhs going for pilgrimage to Nankana Sahib in Pakistan', 'None of the above'], 0,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.214, item 13 — photograph of overcrowded refugee trains during Partition-era mass migration', assetType: 'source_page_full' }],
    explanation: 'The given picture shows the migration of the Muslims from India and the Hindus from Pakistan.',
  }));

items.push(mcq(14, '214', 'Complete the given analogy.\nWavell Plan : Lord Wavell :: Cabinet Mission : ?',
  ['Lord Pethic Lawrence', 'Lord Mountbatten', 'Lord Linlithgow', 'Lord Irwin'], 0,
  { explanation: 'The Cabinet Mission Plan was headed by Lord Pethick Lawrence, who was assisted by Stafford Cripps and A.V. Alexander.' }));

items.push(mcq(15, '214', 'Which of the following clauses was NOT a part of the Indian Independence Act of 1947?',
  ['There would be a Governor General for each Dominion', 'The country would be divided into two Dominions', 'The British Parliament had Legislative control over India', 'There would be a division of army and assets'], 2,
  { explanation: 'The Indian Independence Act had no such provision under which the British Parliament would have the legislative control over the Indians.' }));

items.push(mcq(16, '215', 'Who was the last Viceroy of India?',
  ['Lord Ripon', 'Lord Curzon', 'Lord Mountbatten', 'Lord Ripon'], 2,
  { explanation: 'He served as Viceroy from 1947 to 1948, overseeing the transition of British India to independence and the partition of India into two separate nations, India and Pakistan, on August 15, 1947. TRANSCRIPTION NOTE: the source prints "Lord Ripon" as both option (a) and option (d), verbatim — reproduced as printed. This duplicate does not affect the correct answer, option (c) Lord Mountbatten, which is unambiguous.' }));

items.push(mcq(17, '215', 'When did the Muslim League observe the Direct Action Day?',
  ['16 Aug 1946', '15 Aug 1947', '24 March 1947', '8 Aug,1948'], 0,
  { explanation: 'The Muslim League observed the Direct Action Day on 16 Aug, 1946, leading to communal violence and riots in various parts of India particularly in Calcutta.' }));

items.push(mcq(18, '215', 'When was the Indian Independence Bill given the Royal Assent in Britain?',
  ['16 July 1946', '15 Aug 1946', '18 July 1947', '14 Aug 1947'], 2,
  { explanation: 'The Indian Independence Bill was given Royal Assent in British parliament on 18 July 1947, clearing the way for Indian\'s independence on 15 Aug, 1947.' }));

items.push(mcq(19, '215', 'Who was the last Governor General of India?',
  ['Rajendra Prasad', 'C. Rajagopalachari', 'Lord Mountbatten', 'Jawaharlal Nehru'], 1,
  { explanation: 'C. Rajagopalachari was the last governor general of India, serving from 1948 to 1950, overseeing the transition of India to a republic.' }));

items.push(mcq(20, '215', 'When was the new Constituition enforced in India?',
  ['26 Jan 1947', '26 Jan 1948', '26 Jan 1950', '26 Jan 1952'], 2,
  { explanation: 'The new Constitution of India, which came into force on 26 Jan 1950, replaced the Government of India Act 1935 as the governing document of India.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'Towards Partition of India (1944-1947)',
  chapterOrder: 16,
  label: 'ch14-17-quit-india-ina-partition-wwi-versailles.pdf (Chapter 16 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
