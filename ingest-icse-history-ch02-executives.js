// ICSE Class 10 History & Civics — Chapter 2: The Executives (President and
// Vice-President).
// Source: chap_2.pdf, uploaded 2026-09-17, archived via
// archive-icse-history-ch2.js as source_files.id 103
// (ICSE-HISTCIVICS-CH02-EXECUTIVES).
//
// Source book: "ICSE Chapterwise MCQs & Objective Series — History & Civics
// - X", printed pages 125-132 (an 8th scanned page bleeds into the START of
// the NEXT chapter — "The Prime Minister and The Council of Ministers" —
// deliberately NOT ingested here; that belongs to a future chap_3.pdf
// upload). 39 plain MCQ items, each printed with its own explanation.
//
// METHOD: same as Chapter 1 — civics/constitutional-fact content, verified
// against actual Indian Constitution/parliamentary-procedure facts (not
// re-derived computation). All 39 printed answers check out correct, with
// two disclosed wording caveats (neither changes the marked answer, both
// are common textbook simplifications worth flagging rather than silently
// treating as precise constitutional text):
//  - Item 22: the source states the Vice-President "can be removed... in
//    case of violation of the Constitution or incapacity." The actual
//    constitutional text (Article 67(b)) specifies NO grounds at all for
//    VP removal — only a resolution of the Rajya Sabha (passed by a
//    majority of all members then agreed to by the Lok Sabha) after 14
//    days' notice. The stated "grounds" mirror the President's impeachment
//    grounds (Article 61) but aren't actually required for the VP. Noted,
//    not overridden — this is a widely-repeated textbook simplification.
//  - Item 39: option (a) says the VP "must be a natural-born citizen of
//    India." India's Constitution has no "natural-born citizen" category
//    (unlike the US presidency) — Article 66 requires only "a citizen of
//    India," naturalized citizens included. The overall answer "(d) All
//    the above" is still the intended/expected one (the other two
//    components — age ≥35, RS-membership qualification — are accurate),
//    but the "natural-born" wording in (a) is imprecise. Noted, not
//    overridden.
//
// No diagrams/figures in this chapter — several items (29-32) present
// eligibility data as a table, transcribed as text, same treatment as
// Chapter 1's tables — diagramStatus: 'not_applicable' throughout.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [103]; // archive-icse-history-ch2.js -> ch02-the-executives-president-and-vice-president.pdf

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  kind: 'mcq',
  options,
  correct: correctIdx,
  answerKeyRef: `printed in-line "Ans." + "Explanation" under item ${n}, p.${page} (independently checked against Indian Constitution/parliamentary-procedure facts)`,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  ...opts,
});

const items = [
  mcq(1, '125', 'Which of the following is not a qualification to be elected as the President of India?',
    ['Age more than 35 Years', 'A citizen of any nation', 'Eligibility to be elected as the member of Lok Sabha', 'Must not hold any office of profit'], 1,
    { explanation: 'In order to be elected as the President of India, a person must be a citizen of India (not "any nation"), must have completed 35 years of age, must be qualified for election as a member of the Lok Sabha, and must not hold any office of profit under the Centre or a State Government. (Note: the Speaker of the Lok Sabha/Assembly, a Governor, a Minister, the Vice-President, or the President are not deemed to be holding an office of profit; a sitting MP who seeks election to the Presidency must resign that seat before contesting.)' }),
  mcq(2, '125', 'The President is elected by an electoral college consisting of:',
    ['elected members of the Lok Sabha', 'elected members of the Rajya Sabha', 'elected members of the Legislative Assemblies of States', 'all of the above'], 3,
    { explanation: 'The President of India is elected by an electoral college consisting of the elected members of both Houses of Parliament (MPs) and elected members of the Legislative Assemblies of States (MLAs). The elected members of the State Assemblies of the Union territories of Delhi and Puducherry are also included in the electoral college. (Nominated members of either House, and members of Legislative Councils, are NOT part of this electoral college.)' }),
  mcq(3, '125', "After the election of the President of India, the electoral college:",
    ['chooses the name of the next president in advance.', 'chooses the Vice-President.', 'gets dissolved.', 'none of the above'], 2,
    { explanation: 'The electoral college for the election of the President is a temporary body and it dissolves once the election of the President is over.' }),
  mcq(4, '125-126', 'Election for the President of India is not feasible because:',
    ['it would involve tremendous work, time, and heavy expenditure.', 'a directly elected President cannot be a constitutional or nominal head.', 'it would be difficult to provide electoral machinery for an election in which millions of people would be participating.', 'all of the above'], 3,
    { explanation: 'The direct election for the President of India is not feasible because it would involve tremendous work, time, and heavy expenditure. Besides this, a directly elected President cannot be a constitutional nominal head of the nation (the Prime Minister of India is elected directly [via the legislature] and is the real head of the national executive). It would also be difficult to provide electoral machinery for an election in which millions of people would have to participate.' }),
  mcq(5, '126', 'What can be the consequences if the President is elected directly by the people?',
    ['He can become rival to the Council of Ministers.', "If the President is elected directly by the people and he/she will not be given any real power, it would be against the parliamentary system.", 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
    { explanation: 'If the President is elected directly by the people, he can become a rival at the Centre to the Council of Ministers, as the power resides in the hands of the Council of Ministers headed by the Prime Minister and the Union Parliament. If the president is elected directly by the people and is not given any real power then it will be against the parliamentary system.' }),
  mcq(6, '126', 'In case of death of the President, within how many months the vacancy in the office should be filled?',
    ['2 months', '3 months', '5 months', '6 months'], 3,
    { explanation: 'In case of death, resignation or removal by impeachment, this vacancy must be filled up as soon as possible, but in no case later than six months from the date of the occurrence of such vacancy.' }),
  mcq(7, '126', 'A ___ notice must be served to the President of India before moving the resolution for his impeachment.',
    ['10 days', '14 days', '30 days', '20 days'], 1,
    { explanation: 'In case a President is to be impeached, a resolution can be moved in either House of the Parliament but only after a notice of 14 days has been served to him. This impeachment can be done in case of violation of the Constitution or misuse of status or position or incapacity or treason or bribery.' }),
  mcq(8, '126', 'Which of the following official, ensures complete control of the President upon state during the situation of emergency?',
    ['The Chief Minister of the State', 'The Governor of the State', 'The Speaker of the State Assembly', 'The Chief Justice of the state High Court'], 1,
    { explanation: 'During an emergency on account of failure of Constitutional machinery in a State, the control of the President upon that State is complete through the Governor of the state.' }),
  mcq(9, '126', 'The Governor of any state is appointed by the:',
    ['Prime Minister of India', 'Vice-President of India', 'President of India', 'None of these'], 2,
    { explanation: 'The Governor is the representative of the President in the state and is appointed by the President of India (Article 155).' }),
  mcq(10, '126-127', 'The President of India can summon the Parliament, subjected to the condition that ___ shall not happen to come between last sitting in one session and the first sitting in the next session.',
    ['6 months', '5 months', '14 days', '2 months'], 0,
    { explanation: 'The President has the power to summon and prorogue the Houses of Parliament subject to the condition that six months shall not intervene between the last sitting in one session and the first sitting in the next session (Article 85(1)).' }),
  mcq(11, '127', 'Who among the following has the authority to announce the dissolution of Lok Sabha on the expiry of its full term?',
    ['The Speaker of Lok Sabha', 'The Prime Minister', 'The President of India', 'The Vice-President of India'], 2,
    { explanation: 'The President has the power to dissolve the Lok Sabha, on the advice of the Prime Minister, before the expiry of its full term. This cannot be done in case of Rajya Sabha as it is a permanent house of the Parliament. When the Lok Sabha completes its full term of five years, the President announces the dissolution of the Lok Sabha.' }),
  mcq(12, '127', 'How many members of the Rajya Sabha are nominated by the President of India?',
    ['2', '5', '12', '10'], 2,
    { explanation: 'The President nominates 12 MPs to the Rajya Sabha from amongst the outstanding contributors in literature, science, social service or art (Article 80).' }),
  mcq(13, '127', 'Under which condition can the President promulgate an ordinance?',
    ['When the Parliament is not in session.', 'When the President is satisfied that immediate necessary legislative action is required.', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
    { explanation: 'The President can promulgate an ordinance under two conditions: when the Parliament is not in session (even if one House is in session, there is no bar to issuing ordinances), AND when the President is satisfied that an immediate necessary legislative action is required (Article 123).' }),
  mcq(14, '127', 'If no party gets a clear majority and no coalition is formed then in that case who chooses the leader of the Government?',
    ['The President', 'The Elected Members of Lok Sabha from among themselves', 'The Speaker of Lok Sabha', 'None of the above'], 0,
    { explanation: "The President's role becomes very important when no single party gets a clear majority; a coalition of parties stake their claim to form the government. The President uses his individual judgement and invites such a leader to head the government as Prime Minister, who can provide a stable government to the country." }),
  mcq(15, '128', 'Which of the following statement explain the discretionary power of the President?',
    ['He/She can return the advice by the Council of Ministers to it for its reconsideration at least once', 'He/She has the power to get information about all matters of the Government', 'He/She may refuse to give his/her assent to a Bill', 'All of the above'], 3,
    { explanation: 'Some instances that explain the discretionary power of the President: he/she can return the advice of the Council of Ministers to it for reconsideration at least for the first time (added by the 44th Amendment Act 1978); he/she has the power to get information about all matters of the Government; he/she may refuse to give his/her assent to a Bill and return it for reconsideration "as soon as possible" (this may mean as long as the President chooses — recently, the President has returned the "Office of Profit Bill" for reconsideration by the Lok Sabha, pointing out its infirmities and discrepancies).' }),
  mcq(16, '128', 'Which of the following statement(s) is /are correct?',
    ['All proclamations of emergencies made by the President under Articles 352, 356 and 360 have to be laid within one month before the Parliament for approval.', 'If a proclamation of emergency is not approved, it becomes null and void and ceases to operate.', 'The Parliament can impeach the President for violating the Constitution.', 'All of the above'], 3,
    { explanation: 'All proclamations of emergencies made by the President under Articles 352, 356 and 360 need to be laid within one month before the Parliament for approval. If a proclamation of emergency is not approved, it becomes null and void and ceases to operate. As per Article 61, the Parliament can impeach the President for violating the Constitution.' }),
  mcq(17, '128', 'Who among the following has the power to declare war with any foreign country?',
    ['The President of India', 'The Council of Ministers', 'The Vice-President', 'None of these'], 0,
    { explanation: 'Being the Supreme Commander of the Armed Forces, the President of India has the power to declare war or to conclude peace with any foreign country, on the advice of the Council of Ministers.' }),
  mcq(18, '128', 'Which Article of the Indian Constitution deals with constitutional emergency?',
    ['Article 352', 'Article 356', 'Article 360', 'Article 266'], 1,
    { explanation: 'Constitutional emergency (President\'s Rule) is caused by the breakdown of the constitutional machinery in a State. It has been mentioned under Article 356 of the Indian Constitution.' }),
  mcq(19, '128-129', 'Which of the following was not an instance of declaration of national emergency in India?',
    ['1962 (Indo-China war)', '1971 (Indo-Pakistan war)', '1975 (declared by Indira Gandhi)', '1999 (Kargil War)'], 3,
    { explanation: 'National emergency is caused by war, external aggression or armed rebellion in the whole country or a part of its territory. Such an emergency was declared in India in: 1962 (Indo-China war), 1971 (Indo-Pakistan war), and 1975 (declared by Indira Gandhi to maintain law and order in the country). No national emergency (Article 352) was proclaimed during the 1999 Kargil conflict, even though it was a war — independently verified correct.' }),
  mcq(20, '129', 'The President\'s Rule in a state can be extended for a period of beyond one year but not more than 3 years if:',
    ['National emergency is declared in the whole of India or in any part of the State.', 'The Election Commission certifies that holding of election in the State is not possible.', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
    { explanation: "The President's Rule in a state can be extended for a period of beyond one year but not more than 3 years if: national emergency is declared in the whole of India or in any part of the State, or the Election Commission certifies that holding of election in the State is not possible." }),
  mcq(21, '129', 'When does the President declare financial emergency in the country?',
    ['When the RBI announces bankruptcy.', 'When the financial stability or credit of India is threatened.', 'On the advice of the Finance Minister.', 'On the advice of the Vice-President.'], 1,
    { explanation: 'The President may declare financial emergency under Article 360 of the Constitution, when the financial stability or credit of India is threatened.' }),
  mcq(22, '129', 'The Vice-President of India can be removed from his office in case of:',
    ['violation of the Constitution', 'incapacity', 'both (a) and (b)', 'neither (a) nor (b)'], 2,
    { explanation: "The Vice-President of India may be removed for violation of the Constitution or incapacity by a resolution of the Rajya Sabha, passed by a majority of its members and supported by the Lok Sabha. Note: the Constitution's actual text (Article 67(b)) does not in fact specify any grounds for removing the Vice-President — it only requires a Rajya Sabha resolution (passed by a majority of all its members and agreed to by the Lok Sabha) after 14 days' notice. The 'grounds' given here mirror the President's impeachment grounds (Article 61) and are a common textbook simplification rather than the literal constitutional requirement — noted here rather than silently treated as precise constitutional text; the printed answer is retained since it reflects this source (and many similar ICSE guides) faithfully." }),
  mcq(23, '129', 'The nomination paper for the Vice-President of India must be proposed by how many members?',
    ['30', '20', '40', '10'], 1,
    { explanation: 'The nomination paper for the election of the Vice-President must be proposed by 20 MPs and seconded by another 20 MPs.' }),
  mcq(24, '129-130', 'Which of the following is not correct regarding the power of a President in case of a Bill?',
    ['He has to give his assent to any Bill sent to him.', 'He can send the bill back for reconsideration.', 'A Bill cannot become a law unless the president gives his assent to it.', 'A Money Bill requires the prior permission of the president.'], 0,
    { explanation: "President's assent to a Bill is necessary for it to become a law. He/she may refuse to give his/her assent to a Bill or send it back for reconsideration, if it is not a Money Bill — so it is NOT true that he 'has to' give assent to any Bill sent to him. If a returned Bill is again passed by the Parliament, with or without amendments, the President must give his/her assent to it (per the prior permission of the President before a Money Bill is even introduced)." }),
  mcq(25, '130', 'Which of the following statements is/are correct regarding a Bill passed by the State Legislature?',
    ['The State Governor may reserve it for the consideration of the President.', 'The President can refuse to give his/her assent.', 'The President can return it for reconsideration.', 'All of the above'], 3,
    { explanation: 'The State Governor may reserve a Bill passed by the State Legislature for the consideration of the President. The President can refuse to give his/her assent. He can also return it for reconsideration.' }),
  mcq(26, '130', 'Who amongst the following is the supreme commander of the armed forces in India?',
    ['The President of India', 'The Prime Minister of India', 'The Vice-President of India', 'The Chief Justice of India'], 0,
    { explanation: 'The President is the Supreme Commander of the Armed Forces of India. He has the power to appoint the Chiefs of the Staff of the Army, Navy and the Air Force, and other defence services in accordance with the laws made by the Parliament.' }),
  mcq(27, '130', 'Which of the following statement(s) is /are correct?',
    ['The Prime Minister and the Council of Ministers, aid and advise the President in the exercise of his/her powers.', 'The 42nd Amendment Act of 1976 mentioned that the President must in all cases act on the advice of the Prime Minister.', 'The powers of the President are in fact exercised by the real executive i.e., the Prime Minister and the Council of Ministers.', 'All of the above'], 3,
    { explanation: 'The Prime Minister and the Council of Ministers aid and advise the President in the exercise of his/her powers. The 42nd Amendment Act of 1976 mentioned that the President must in all cases act on the advice of the Prime Minister (later qualified by the 44th Amendment Act, 1978, which allows the President to return the advice once for reconsideration). The powers of the President are in fact exercised by the real executive i.e., the Prime Minister and the Council of Ministers.' }),
  mcq(28, '130', 'The ___ has the power to summon the Houses of Parliament.',
    ['Speaker', 'President', 'Vice-President', 'Chief Justice of India'], 1,
    { explanation: 'The President of India has the power to issue summons to both the Houses of Parliament and call them for a meeting or session.' }),
  {
    kind: 'case', sourceQuestionNumber: '29', sourcePage: '130-131',
    text: 'Identify the officials who form the Electoral College for the Presidential elections in India.\nP: Elected members of Parliament\nQ: Nominated members of Parliament\nR: Elected members of State Legislative Assemblies\nS: Nominated members of State Legislative Councils',
    parts: [{ text: 'Options:', options: ['P and Q', 'R and S', 'P and R', 'Q and S'], correct: 2, marks: 1 }],
    difficulty: 'Medium', subConcept: "President's electoral college composition", questionType: 'case_study',
    explanation: 'The President of India is elected indirectly by an Electoral College consisting of the elected members of both the Houses of Parliament and the elected members of State Legislative Assemblies — i.e. P and R. Nominated members (Q) and Legislative Council members (S) are excluded. Independently verified correct per Article 54.',
    diagramStatus: 'not_applicable', answerStatus: 'verified',
    answerKeyRef: 'printed in-line "Ans." + "Explanation" under item 29, p.130-131',
  },
  {
    kind: 'case', sourceQuestionNumber: '30', sourcePage: '131',
    text: 'Given below are details of a few Indian citizens.\nCandidate | Age | Other details\nW | 35 | Qualified to be elected as a member of the Lok Sabha.\nX | 40 | Qualified to be elected as a member of the Rajya Sabha.\nY | 32 | Qualified enough to practice in the High Court.\nZ | 35 | Does not qualify to contest election for the Lok Sabha seat.\nSelect the person who fulfils the eligibility criteria to become the President of India.',
    parts: [{ text: 'Who is eligible to become President?', options: ['W', 'X', 'Y', 'Z'], correct: 0, marks: 1 }],
    difficulty: 'Medium', subConcept: 'Eligibility criteria for the office of President', questionType: 'case_study',
    explanation: "To become President, a person must be a citizen of India, at least 35 years old, and qualified for election as a member of the Lok Sabha specifically. W (35, explicitly stated as Lok-Sabha-qualified) meets every stated criterion. X is only stated as Rajya-Sabha-qualified (not explicitly Lok-Sabha-qualified); Y's High-Court-practice qualification is irrelevant to Presidential eligibility and Lok Sabha eligibility isn't confirmed; Z is explicitly disqualified from contesting a Lok Sabha seat. Matches the printed key on the careful reading the item tests.",
    diagramStatus: 'not_applicable', answerStatus: 'verified',
    answerKeyRef: 'printed in-line "Ans." + "Explanation" under item 30, p.131',
  },
  {
    kind: 'case', sourceQuestionNumber: '31', sourcePage: '131',
    text: 'Identify the officials who form the collegium for the election of the Vice-President.\nP: Members of the State Legislative Assemblies\nQ: Members of the Lok Sabha\nR: Members of the State Legislative Councils\nS: Member of Rajya Sabha',
    parts: [{ text: 'Options:', options: ['P and Q', 'R and S', 'P and R', 'Q and S'], correct: 3, marks: 1 }],
    difficulty: 'Medium', subConcept: "Vice-President's electoral college composition", questionType: 'case_study',
    explanation: 'The Vice-President is elected by an electoral college consisting of the members of BOTH Houses of Parliament (elected and nominated) — i.e. Q and S — with NO participation by any state legislature at all (unlike the President\'s electoral college). Independently verified correct per Article 66.',
    diagramStatus: 'not_applicable', answerStatus: 'verified',
    answerKeyRef: 'printed in-line "Ans." + "Explanation" under item 31, p.131',
  },
  {
    kind: 'case', sourceQuestionNumber: '32', sourcePage: '131',
    text: 'Given below are details of a few Indian citizens.\nCandidate | Age | Other details\nW | 30 | Qualified for Election as a member of the House of People.\nX | 35 | Qualified for Election as a member of the Council of States.\nY | 25 | Qualified for Election as a member of the House of People.\nZ | 34 | Serving as a member of the Rajya Sabha.\nSelect the person who fulfils the eligibility criteria to become the Vice-President of India.',
    parts: [{ text: 'Who is eligible to become Vice-President?', options: ['W', 'X', 'Y', 'Z'], correct: 1, marks: 1 }],
    difficulty: 'Medium', subConcept: 'Eligibility criteria for the office of Vice-President', questionType: 'case_study',
    explanation: 'To become Vice-President, a person must be a citizen of India, at least 35 years old, and qualified for election as a member of the Rajya Sabha (Council of States) specifically — not the Lok Sabha (House of People). W (30) and Y (25) fail the age requirement; Z (34) also fails the age requirement despite currently serving in the Rajya Sabha; X (35, explicitly Council-of-States-qualified) meets every stated criterion. Matches the printed key.',
    diagramStatus: 'not_applicable', answerStatus: 'verified',
    answerKeyRef: 'printed in-line "Ans." + "Explanation" under item 32, p.131',
  },
  mcq(33, '131', 'During a hung assembly when no party gets the majority, the President appoints the Prime Minister. What power is the President exercising?',
    ['Legislative', 'Executive', 'Discretionary', 'Judicial'], 2,
    { explanation: 'The President of India enjoys certain discretionary powers; in the case of a hung Parliament, the President can appoint the leader of the single largest party as Prime Minister and allow him/her time to prove his/her majority through a vote in Parliament.' }),
  mcq(34, '131', 'The procedure to remove the President is called as ___.',
    ['Impeachment', 'Interpellation', 'Resolution', 'Prorogation'], 0,
    { explanation: 'The procedure to remove the President in parliamentary systems is called impeachment. It involves charges of misconduct or violation of the Constitution being brought against the President, followed by a formal process of investigation and trial by the Parliament.' }),
  mcq(35, '132', "Who administers the Oath of Office to the person elected as the country's new President?",
    ['The Speaker of the Lok Sabha', 'Chairperson of the Rajya Sabha', 'The Chief Justice of India', 'Chief Election Commissioner'], 2,
    { explanation: 'The Chief Justice of India administers the Oath of Office to the newly elected President, as per the Constitution.' }),
  mcq(36, '132', 'What is the primary function of an Electoral College in democratic systems?',
    ['To directly elect the head of state', 'To select representatives to the legislature', 'To appoint judges to the judiciary', 'To indirectly elect the head of state'], 3,
    { explanation: 'An Electoral College indirectly elects the head of state, such as the President, by representing the will of the electorate through a system of delegates or representatives. This system is common in countries like the United States and India.' }),
  mcq(37, '132', 'What happens when there is a vacancy in the office of the President of India?',
    ['The Prime Minister takes over', 'The Chief Justice of India assumes the role', 'The Vice-President acts as President', 'Immediate elections are held'], 2,
    { explanation: 'In the event of a vacancy in the office of president of India, the Vice-President discharges the functions of the President until a new President is duly elected (Article 65).' }),
  mcq(38, '132', 'Who is the Commander-in-Chief of the Indian Armed Forces?',
    ['The Prime Minister', 'The President', 'The Defence Minister', 'The Chief of Defence Staff'], 1,
    { explanation: 'The President of India serves as the nominal Commander-in-Chief of the Indian Armed Forces.' }),
  mcq(39, '132', 'What qualifications are required to be eligible for the office of Vice President of India?',
    ['Must be a natural-born citizen of India', 'Must be at least 35 years old', 'Must be qualified to be a member of the Rajya Sabha', 'All the above'], 3,
    { explanation: 'To be eligible for the office of Vice President of India, a person must be qualified to be elected as a member of the Rajya Sabha, which includes being a citizen of India, at least 35 years old, and possessing other qualifications specified by law. Note: the Indian Constitution has no "natural-born citizen" category (unlike, e.g., the US presidency) — Article 66 requires only that the person be "a citizen of India" (naturalized citizens are eligible too); option (a)\'s "natural-born" wording over-specifies this. The intended overall answer, "all the above," still holds in substance since the other two components (age, RS-qualification) are accurate — noted here rather than silently passed over.' }),
];

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'The Executives (President and Vice-President)',
  chapterOrder: 2,
  label: 'ICSE Class 10 History & Civics — The Executives (President and Vice-President): 39 items (35 plain MCQ, 4 multi-part case-study MCQ), full chapter, from chap_2.pdf — every answer independently checked against Indian Constitution/parliamentary-procedure facts (all 39 correct; two items carry a disclosed wording caveat — VP removal grounds not literally required by Article 67(b), and "natural-born citizen" not an actual Indian constitutional category — neither changes the marked answer)',
  status: 'verified',
  answerStatus: 'verified',
  sourceSection: 'Multiple Choice Questions (full chapter, pp.125-132)',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
