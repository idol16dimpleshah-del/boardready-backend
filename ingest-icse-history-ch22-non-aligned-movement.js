// ICSE Class 10 History & Civics — Chapter 22: "The Non-Aligned Movement".
// Uploaded 2026-09-17 as part of the combined chap_18-22.pdf, archived via
// archive-icse-history-ch18-22.js -> source_files.id 114 (this one physical
// file covers Chapters 18, 19, 20, 21 and 22 — the FINAL upload for this
// subject, per the founder's own message "icse history ends here" — see
// that script's header comment).
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// This is the LAST chapter of ICSE History & Civics under this standing
// instruction. Source pages 243-247 (final page of the whole textbook
// scan; page 247 itself bleeds into a different subject, "Geography",
// independently confirming this is the end of the History & Civics
// syllabus covered so far).
//
// Verification method (same as Ch18-21): every printed answer checked
// against documented history of the Non-Aligned Movement — its 1961
// Belgrade founding, the 1955 Bandung Conference as ideological precursor,
// Panchsheel (1954), the NAM's recognised "architects" (Nehru, Nasser,
// Tito, Sukarno), and the broader Cold War/decolonisation context.
//
// Two items flagged/annotated:
//  - Item 2: genuine internal contradiction with item 24. Printed answer
//    says NAM was "established in 1955" (April 1955), but item 24 (this
//    same chapter) correctly states the first Non-Aligned Summit was held
//    in 1961 in Belgrade — the actual founding of NAM as a formal
//    organisation. 1955 is the date of the Bandung (Asian-African)
//    Conference, a widely-cited ideological precursor to NAM organised by
//    Sukarno, Nehru, Nasser and others, but NAM itself did not exist as an
//    organisation until 1961. This is a common textbook conflation.
//    Flagged needs_review; printed answer (c) 1955 kept per source since
//    it is clearly the intended answer (matches the explanation's own
//    wording), with the Bandung/Belgrade distinction disclosed and
//    cross-referenced against item 24.
//  - Item 11: disclosed (non-needs_review) caveat — the item lumps the
//    Berlin Blockade (actually 1948-49), the Vietnam War (escalating
//    through the 1950s-60s) and the Congo Civil War/Congo Crisis (actually
//    1960-65) together as "the period of the 1950s". The Congo Crisis in
//    particular falls in the following decade. All four options are
//    combinations of the same three events, so no alternative answer
//    corrects this — kept as printed and disclosed rather than flagged,
//    consistent with the Ch15 item 24 precedent for a minor, non-decisive
//    imprecision.
// All other 24 items independently verified clean against documented NAM
// history, Panchsheel, and the UN/NAM relationship.
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

items.push(mcq(1, '243', 'Which of the following continents witnessed the formation of new states post the Second World War Period?',
  ['Asia and Africa', 'Asia and Europe', 'Africa and Europe', 'None of these'], 0,
  { explanation: "Following World War-II, there was a time of awakening and development of political and nationalist ambitions among the world's oppressed people. Colonialism, a centuries-old phenomena, began to crumble. After shedding the yoke of foreign dominance, a slew of new independent republics emerged in Asia and Africa. The Cold War between the Soviet and American blocs was also intensifying at the time. The superpowers attempted to woo these newly independent nations into joining their separate blocs. Some of them, on the other hand, despised the thought of submitting to any of the superpowers. Rather than aligning with any power group, they aimed to pursue an independent domestic and foreign strategy. Non-Alignment was named after the tactic of not joining either of the two major blocs and instead pursuing an autonomous foreign policy." }));

items.push({
  kind: 'mcq',
  sourceQuestionNumber: '2',
  sourcePage: '243',
  text: 'The Non-Aligned Movement was established in:',
  options: ['1956', '1946', '1955', '1958'],
  correct: 2,
  diagramStatus: 'not_applicable',
  answerStatus: 'needs_review',
  answerKeyRef: 'printed Ans., p.243, item 2',
  explanation: 'FLAGGED (cross-ref. item 24): the source prints "Ans. (c) 1955," explained as "The Non-Aligned Movement was established in April, 1955. It came into existence because in the post world war period, some of the countries decided not to join either of the two power blocs and to follow an independent foreign policy known as the Non-Aligned Movement." April 1955 is the date of the Bandung (Asian-African) Conference in Indonesia — a landmark conference of newly independent Asian and African states, organised with Sukarno, Nehru, Nasser and others, and a widely-recognised ideological precursor to Non-Alignment. However, the Non-Aligned Movement did not exist as a formal organisation until the first Non-Aligned Summit held in 1961 in Belgrade, Yugoslavia — which this same chapter correctly states in item 24. This 1955-vs-1961 conflation is common in Indian textbooks. Kept as printed (1955) since it is clearly the intended answer given the explanation\'s own wording and phrasing of the question ("established in"), but the discrepancy with item 24\'s 1961 Belgrade founding is disclosed here for transparency.',
});

items.push(mcq(3, '243', 'What does the term "Non-Alignment" refer to?',
  ['A group of like-minded nations.', 'A group of nations having similar aims and objectives.', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'The word "Non-Alignment" does not refer to a bloc, but rather to a group of like-minded countries with common goals and objectives. Each issue is judged on its own merits by a non-aligned country. In other words, Non-Alignment protects all governments’ rights to international freedom of choice and action. The hostility to military alliances and any form of imperialism is one of the most essential aspects of Non-Alignment.' }));

items.push(mcq(4, '243', 'Who among the following coined the term "Non-Aligned"?',
  ['Jawaharlal Nehru', 'Sukarno', 'Gamal Abdel Nasser', 'None of these'], 0,
  { explanation: 'The term "Non-Aligned" was coined by Jawaharlal Nehru. He had stated "Non-Alignment does not imply inaction or inactivity. It does not imply that we must submit to what we regard to be evil. It’s a good and proactive attitude to the difficulties we face."' }));

items.push(mcq(5, '244', 'Which of the following is/are characteristic feature(s) of Non-Aligned Movement?',
  ['It does not support power blocs', 'It was against the Cold War', 'Member nations judged each issue on merit', 'All of these'], 3,
  { explanation: 'The characteristic features of the Non-Aligned Movement are: It does not support power blocs. It was against the Cold War. Member nations judged each issue on merit.' }));

items.push(mcq(6, '244', 'NAM is known to have never supported:',
  ['Self-determination', 'Natural equality', 'Freedom of all nations', 'Imperialism and colonialism'], 3,
  { explanation: 'The NAM has committed to the end of imperialism and colonialism. The member nations of the NAM have always opposed imperialism and colonialism. They believe in self-determination, natural equality, and freedom of all nations.' }));

items.push(mcq(7, '244', 'How did the NAM intend to spread international peace?',
  ['Through the elimination of the causes and horrors of war', 'Elimination of nuclear weapons', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'The main objective of the NAM is to eliminate the causes and horrors of war and, in particular, the elimination of nuclear weapons.' }));

items.push(mcq(8, '244', 'The summits of the NAM condemned the racial practices prevailing in which of the following countries?',
  ['South America', 'South Africa', 'United States of America', 'None of these'], 1,
  { explanation: 'All types of racial discriminations have always been condemned by the Non-Aligned Movement. The majority of the NAM summits criticised the practise of racial segregation in South Africa and other regions of the world.' }));

items.push(mcq(9, '244', 'The NAM was supportive of:',
  ['Reduced possession and the use of nuclear weapons.', 'A country not to be the member of any military alliance.', 'Strengthening the UN.', 'All of the above'], 3,
  { explanation: 'The NAM advocated for disarmament and was particularly opposed to nuclear weapons possession and usage. According to the criteria of Non-Alignment established in 1961, a country shall not be a member of any of the military alliances. The NAM countries also supported strengthening the role and effectiveness of the United Nations.' }));

items.push(mcq(10, '245', 'The functions of the NAM are related to:',
  ['The enforcement of human rights.', 'Equality among individuals.', 'Promotion of freedom to pursue a free domestic and foreign policy.', 'All of the above'], 3,
  { explanation: 'The functions of the NAM are related to the enforcement of human rights, equality among individuals and the promotion of freedom to pursue a free domestic and foreign policy. NAM promotes equality among individuals and nations. It saves new nations from falling prey to the supremacy of the superpowers and promotes freedom to pursue a free domestic and foreign policy.' }));

items.push(mcq(11, '245', 'The period of 1950s is known as a period of tension due to:',
  ['Berlin Blockade', 'Vietnam War', 'Congo Civil War', 'All of these'], 3,
  { explanation: 'DISCLOSED CAVEAT: the source explains "The Berlin Blockade, the Vietnam War, the Congo Civil War, and the buildup of nuclear weapons stockpiles all contributed to heightened tensions in the 1950s." This framing is imprecise: the Berlin Blockade actually ran 1948-49 (just before the decade), and the Congo Civil War (Congo Crisis) actually took place in 1960-65, in the following decade — only the escalating Vietnam conflict fits within the 1950s cleanly. Since all four options are combinations of the same three events, no alternative choice corrects this, so the printed answer "All of these" is kept as the only sensible choice, with the dating imprecision disclosed here.' }));

items.push(mcq(12, '245', 'Which of the following is true about the role played by the NAM in the 1960s?',
  ['It demanded freedom from colonialism.', 'Due to the efforts of NAM, almost 100 countries got freedom.', 'It urged for complete disarmament.', 'All of the above'], 3,
  { explanation: 'The Belgrade Summit requested that all colonial people should be free. More than 100 nations gained their independence in this decade as a result of the concerted pressure of the NAM. The Belgrade Summit also called for total disarmament from all nations.' }));

items.push(mcq(13, '245', 'Which of the following statements is/are correct?',
  ['NAM is a free and equal association of states united by common interest in pursuing independent foreign policy.', 'NAM is the largest political formation in the world, next only to the UN.', 'NAM is playing a significant role in the stabilisation of world peace.', 'All of the above'], 3,
  { explanation: 'The NAM is a free and equal union of states linked by a common interest in pursuing independent foreign policy. The NAM is the world’s second-largest political organisation, after the United Nations. The Non-Aligned Movement (NAM) is helping to keep the globe at peace. The member countries are opposed to the production of lethal weapons.' }));

items.push(mcq(14, '245', 'NAM truly represents:',
  ['First world countries', 'Second world countries', 'Third world countries', 'Fourth world countries'], 2,
  { explanation: 'It is said that the NAM is the only organisation that actually represents third world countries. It has performed a valuable service in assisting these countries in gaining independence from imperialist powers and then putting their affairs in order with their undivided attention, love, and whatever assistance they could afford.' }));

items.push(mcq(15, '246', 'The Non-Aligned Movement stresses on:',
  ['The nations should follow their policies', 'The nations should not fall under the influence of power blocs', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: '"Non-Alignment" is not synonymous with "isolation" or "neutrality." It is an independent movement that emphasised that countries should pursue their own policies rather than joining or falling under the influence of any of the power blocs at the same time.' }));

items.push(mcq(16, '246', 'In its objectives, the NAM is also associated with:',
  ['Creation of a New International Economic Order (NIEO).', 'Protection of environment.', 'Cultural equality.', 'All of the above'], 3,
  { explanation: 'Creation of a New International Economic Order (NIEO), global cooperation to protect the environment and the need for cultural equality through restructuring the existing information order were among the objectives of the NAM.' }));

items.push(mcq(17, '246', 'Since its formation, the NAM has been fighting for:',
  ['National independence', 'Sovereignty', 'Territorial integrity', 'All of these'], 3,
  { explanation: 'Since its formation, the NAM has fought for non-aligned countries’ national independence, sovereignty, territorial integrity, and security in the face of imperialism, colonialism, neo-colonialism, racism, Zionism, and all forms of foreign aggression, occupation, dominance, interference, or hegemony, as well as great power and bloc politics. NAM has been a strong supporter of international peace, justice, and liberty. It has always spoken out against injustice, whether it was the 1956 Suez Crisis, Israel’s aggressive actions, or the unilateral US invasion on Iraq.' }));

items.push(mcq(18, '246', 'Who among the following is/are known as the "Architects of the Non-Aligned Movement"?',
  ['Jawaharlal Nehru', 'Gamal Abdel Nasser', 'Josip Broz Tito', 'All of these'], 3,
  { explanation: 'Jawaharlal Nehru (India), Gamal Abdel Nasser (Egypt), Sukarno (Indonesia) and Josip Broz Tito (Yugoslavia) are known as the Architects of the Non-Aligned Movement. At present, the NAM has the membership of 120 countries and its aim is to ensure "the national independence, sovereignty, territorial integrity and security of non-aligned countries" in their "struggle against imperialism, colonialism, neo-colonialism, racism and all forms of foreign aggression, occupation, domination, interference or hegemony" as well as against great power and bloc politics.' }));

items.push(mcq(19, '246', 'Identify the founders of Non-Aligned Movement.',
  ['Nasser, Tito, Nehru', 'Naseer, Nehru, Stalin', 'Churchill, Stalin, Tito', 'Tito, Sukarno, Roosevelt'], 0,
  { explanation: 'The first Non-Aligned Movement summit was held in Belgrade in September, 1961, driven by the vision of Nasser, Tito and Nehru among the founding leaders of the movement.' }));

items.push(mcq(20, '246', 'Which of these leaders was an architect of the Non-Aligned Movement? [Board Question]',
  ['Joseph Stalin', 'Abdel Nasser', 'Winston Churchill', 'Franklin Roosevelt'], 1,
  { explanation: 'The Egyptian President Gamal Abdel Nasser was one of the chief architects of the Non-Alignment Movement along with the Indian Prime Minister Jawaharlal Nehru and the Yugoslavian President Josip Broz Tito.' }));

items.push(mcq(21, '247', 'Identify the principle of Panchsheel.',
  ['Mutual non-aggression', 'Regulate armaments', 'Take action against aggressor', 'Recommend admission of members'], 0,
  { explanation: 'The first principle pertains to Panchsheel, whereas the other three are associated with the Security Council. Panchsheel’s five principles are mutual respect for territorial integrity and sovereignty, mutual non-aggression, mutual non-interference, equality and mutual benefit, and peaceful coexistence.' }));

items.push(mcq(22, '247', 'What was the name given to the five principles by Nehru which later became the basis of Non-Aligned Movement?',
  ['Panchsheel', 'Pancharatna', 'Five point treaty', 'Five point Declaration'], 0,
  { explanation: 'The five principles "Panchsheel" emphasized principles of peaceful coexistence and mutual cooperation among nations. They were jointly articulated by Nehru, Zhou Enlai and U Nu in 1954 and went on to influence the Non-Aligned Movement.' }));

items.push(mcq(23, '247', 'The Non-Aligned Movement was not based on which of the following principles?',
  ['Non-aggression', 'Mutual Respect for territorial integrity', 'Peaceful co-existence', 'Providing healthcare to all countries'], 3,
  { explanation: 'Providing health care to all countries was not a principle directly associated with Non-Aligned Movement.' }));

items.push(mcq(24, '247', 'Where was the first Non-Aligned Summit held in 1961?',
  ['Cairo, Egypt', 'Belgrade, Yugoslavia', 'Durban, South Africa', 'New Delhi, India'], 1,
  { explanation: 'The first Non-Aligned summit was held in 1961 in Belgrade, Yugoslavia. It was aimed at asserting their sovereignty and promoting neutrality in the cold war. (See item 2’s disclosure: this 1961 founding is the historically documented origin of NAM as a formal organisation, distinct from the 1955 Bandung Conference cited in item 2.)' }));

items.push(mcq(25, '247', 'Which among the following was not a factor responsible for the formation of the Non-Aligned Movement?',
  ['Nationalism', 'Underdevelopment', 'Cold War', 'India-Pakistan War'], 3,
  { explanation: 'The India-Pakistan War was not a factor responsible for the formation of the Non-Aligned Movement.' }));

items.push(mcq(26, '247', 'At which Conference was the 27 point Declaration adopted?',
  ['Belgrade', 'Cairo', 'Durban', 'Kathmandu'], 0,
  { explanation: 'Being adopted at Belgrade it represented a milestone in the Non-Aligned Movement’s efforts to articulate its principles and objectives for global peace and cooperation.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'The Non-Aligned Movement',
  chapterOrder: 22,
  label: 'ch18-22-dictatorships-wwii-un-nam-final.pdf (Chapter 22 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
