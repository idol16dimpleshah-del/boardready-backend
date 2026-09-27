// ICSE Class 10 History & Civics — Chapter 20: "The United Nations (Origin
// and Purpose)". Uploaded 2026-09-17 as part of the combined
// chap_18-22.pdf, archived via archive-icse-history-ch18-22.js ->
// source_files.id 114 (this one physical file covers Chapters 18, 19, 20,
// 21 and 22 — the FINAL upload for this subject — see that script's header
// comment).
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch17-19): every printed answer checked
// against the UN Charter's actual structure and documented UN history —
// the General Assembly, Security Council, Secretariat, and International
// Court of Justice; the Charter's 1945 founding; and present-day officers
// (as of this source's writing).
//
// RESULT: a clean chapter. Every one of the 28 printed answers is
// consistent with documented UN structure/history and internally
// consistent with its own explanation. No needs_review items, no
// disclosed caveats.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 114;

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

items.push(mcq(1, '233', 'The headquarters of the United Nations is located in:',
  ['New York', 'Kuala Lumpur', 'Geneva', 'Paris'], 0,
  { explanation: 'The headquarters of the United Nations is located in New York (USA).' }));

items.push(mcq(2, '233', 'Which of the following is the working language of the United Nations?',
  ['English', 'French', 'Chinese', 'Both (a) and (b)'], 3,
  { explanation: 'The UN has six official languages, namely, Arabic, Chinese, English, French, Russian and Spanish, but among these, English and French are working languages.' }));

items.push(mcq(3, '233', '_________ is the present Secretary General of the UN.',
  ['Ban Ki-moon', 'Trygve Lie', 'Antonio Guterres', 'None of these'], 2,
  { explanation: 'Since 2017, Antonio Guterres is the current Secretary General of the UN. Prior to him, Ban Ki-moon (2007-2016) held this post.' }));

items.push(mcq(4, '233', 'The term "United Nations" was coined by:',
  ['Trygve Lie', 'Franklin D. Roosevelt', 'Jawaharlal Nehru', 'Winston Churchill'], 1,
  { explanation: 'The term "United Nations" was coined by United States President Franklin D. Roosevelt. He first used it in the Declaration by the United Nations of 1 January, 1942, during the Second World War.' }));

items.push(mcq(5, '233', 'The Charter of the United Nations was signed on:',
  ['25th June, 1946', '26th June, 1945', '24th October, 1946', '24th October, 1945'], 1,
  { explanation: 'The Charter was signed on 26th June, 1945 by the representatives of the 50 countries.' }));

items.push(mcq(6, '233', 'Which of the following countries did not sign the UN Charter on 26th June 1945?',
  ['China', 'United Kingdom', 'Poland', 'USA'], 2,
  { explanation: 'Poland was not represented at the Conference on 26th June, 1945. It signed the Charter later and became one of the original 51 member states.' }));

items.push(mcq(7, '233', 'Which one of the following countries was the 193rd member of the UN?',
  ['South Sudan', 'United Kingdom', 'India', 'Pakistan'], 0,
  { explanation: 'The General Assembly admitted the Republic of South Sudan as the 193rd member of the United Nations.' }));

items.push(mcq(8, '234', 'Every member state of the UN sends a delegation of_______members in it.',
  ['10', '5', '2', '7'], 1,
  { explanation: 'The membership of the UN is 193 states. Every member state of the UN sends a delegation of five members in it.' }));

items.push(mcq(9, '234', 'Which of the following determines the contributions to be made to the UN?',
  ['The General Assembly', 'The Committee on Contributions', 'The largest contributing country', 'None of these'], 0,
  { explanation: 'The contribution to the UN is determined by the General Assembly each year on the recommendations of its Committee on Contributions.' }));

items.push(mcq(10, '234', 'Which of the following organs of the UN is called the World Parliament?',
  ['The Security Council', 'The International Court of Justice', 'The General Assembly', 'None of these'], 2,
  { explanation: 'The General Assembly of the UN is also known as the World Parliament because it has members from every member state.' }));

items.push(mcq(11, '234', 'Which of the following is/are elected at the start of the session of the General Assembly?',
  ['The President', 'Vice-Presidents', 'Chairmen of 6 Committees', 'All of these'], 3,
  { explanation: "At the start of the session, the General Assembly elects its own President for one year, 21 Vice-Presidents and Chairmen of the Assembly's six main Committees." }));

items.push(mcq(12, '234', 'Who has the authority to call the emergency session of the General Assembly?',
  ['The Secretary General', 'The Vice-President', 'Any member of the UN', 'None of these'], 0,
  { explanation: 'An emergency session of the General Assembly can be called by the Secretary General on the recommendation of the Security Council or of a majority of the members of the UN.' }));

items.push(mcq(13, '234', 'Who elects the members of the Economic and Social Council and Trusteeship Council?',
  ['The Security Council', 'The General Assembly', 'UN Committees', 'The Secretariat'], 1,
  { explanation: 'The General Assembly has the responsibility to elect the members of the Economic and Social Council and Trusteeship Council.' }));

items.push(mcq(14, '234', 'The General Assembly promotes cooperation in areas related to:',
  ['Socio-cultural services.', 'Economic services.', 'Educational and health services.', 'All of these'], 3,
  { explanation: 'The General Assembly promotes cooperation in areas related to socio-cultural, economic, educational and health services, and makes appropriate recommendations for their development. It also draws attention of the member states to provide human rights to their citizens.' }));

items.push(mcq(15, '235', 'Who determines the share of each member state to the expenses of the budget?',
  ['The Security Council', 'The General Assembly', 'UN Committees', 'None of these'], 1,
  { explanation: 'The General Assembly considers and passes the annual budget of the UN. It also determines the share of each member state to the expenses of the budget.' }));

items.push(mcq(16, '235', 'Which of the following is/are correct about the Secretary General?',
  ['He brings to the attention of the Security Council any matter which in his opinion may threaten the maintenance of international peace and security.', 'He conducts the day-to-day functioning of the United Nations (UN).', 'He prepares the annual budget of the UN.', 'All of the above'], 3,
  { explanation: 'The Secretary General is empowered to bring to the attention of the Security Council any matter which in his opinion may threaten the maintenance of international peace and security. He conducts the day-to-day functioning of the United Nations (UN) and also submits an annual report to the General Assembly on its work. He prepares the annual budget of the UN.' }));

items.push(mcq(17, '235', 'Which of the following statements regarding the Security Council is/are correct?',
  ['The five permanent members of the United Nations enjoy Veto power.', 'Any of the permanent members may reject the decisions or recommendations of the Security Council.', 'By the use of Veto, a decision can be made null and void.', 'All of the above'], 3,
  { explanation: 'The five permanent members of the United Nations enjoy Veto power (negative vote), i.e., by exercising this power, any of the permanent members may reject the decisions or recommendations of the Security Council and make them null and void.' }));

items.push(mcq(18, '235', "Which of the following is known as the executive body or 'Enforcement Wing' of the United Nations?",
  ['The General Assembly', 'The Security Council', 'The UN Committees', 'None of these'], 1,
  { explanation: "The Security Council is the most important organ of the UN. It is the executive body or 'Enforcement Wing' of the United Nations." }));

items.push(mcq(19, '235', 'In which year the ICJ started its work?',
  ['1948', '1946', '1947', '1949'], 1,
  { explanation: 'The International Court of Justice began its work in 1946 when it replaced the Permanent Court of International Justice, which had been functioning since 1922.' }));

items.push(mcq(20, '236', 'Who can ask the International Court of Justice (ICJ) to give its advisory opinion on any dispute?',
  ['The General Assembly', 'The Security Council', 'Other UN organs and agencies', 'All of these'], 3,
  { explanation: 'The General Assembly, the Security Council, other UN organs and agencies may ask the International Court of Justice (ICJ) to give its advisory opinion on any dispute/legal question within the scope of their activities.' }));

items.push(mcq(21, '236', 'Which of the following statements is/are correct about the ICJ?',
  ['It may recommend the terms of settlement at any stage of settlement of a dispute.', 'Each country is obliged to comply with the decision of the ICJ.', 'It believes in the procedure of peaceful settlement of disputes.', 'All of the above'], 3,
  { explanation: 'The ICJ believes in the procedure of peaceful settlement of disputes. It may also recommend the terms of settlement at any stage of settlement of a dispute. Each country consenting to a case is legally obliged, under the UN Charter (Article 94), to comply with the decision of the ICJ.' }));

items.push(mcq(22, '236', 'The International Court of Justice has____judges. [Board Question]',
  ['5', '10', '12', '15'], 3,
  { explanation: 'The International Court of Justice is one of the parts of the United Nations and has fifteen judges belonging to different nationalities.' }));

items.push(mcq(23, '236', 'The non-permanent members of the Security Council have a term of______years.',
  ['2', '3', '5', '10'], 0,
  { explanation: 'The ten non-permanent members of the Security Council are elected by the General Assembly by a two-third majority for a term of 2 years.' }));

items.push(mcq(24, '236', 'When was the United Nations Flag adopted?',
  ['20 October 1947', '24 October 1945', '26 June 1945', '8 July 1947'], 0,
  { explanation: 'The United Nations Flag was adopted on 20 October, 1947. The flag features the UN emblem, which is a polar world map surrounded by olive branches.' }));

items.push(mcq(25, '236', 'In which colour is the UN emblem portrayed in its flag?',
  ['Red', 'Blue', 'White', 'Green'], 2,
  { explanation: 'The UN emblem portrayed in its flag in white, symbolising peace and purity.' }));

items.push(mcq(26, '236', 'Where is the European office of the UN located?',
  ['Hungary', 'Poland', 'Britain', 'Geneva'], 3,
  { explanation: 'The European office of the UN is located in Geneva, Switzerland. It serves as one of the major hubs for UN activities and diplomacy in Europe.' }));

items.push(mcq(27, '237', 'Admission of new members to the UN is made by the General Assembly on whose recommendations?',
  ['Secretariat', 'Trusteeship Council', 'Security Council', 'International Chief Justice'], 2,
  { explanation: 'The security Council evaluates the applications based on various criteria, including peace and security considerations.' }));

items.push(mcq(28, '237', 'Which among the following is not a type of function of the General Assembly?',
  ['Deliberative Functions', 'Supervisory Functions', 'Financial Functions', 'Social Functions'], 3,
  { explanation: 'General Assembly primarily focuses on deliberative, supervisory and financial functions etc., not social functions.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'The United Nations (Origin and Purpose)',
  chapterOrder: 20,
  label: 'ch18-22-dictatorships-wwii-un-nam-final.pdf (Chapter 20 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
