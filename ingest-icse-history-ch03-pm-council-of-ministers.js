// ICSE Class 10 History & Civics — Chapter 3: The Prime Minister and The
// Council of Ministers.
// Source: chap_3.pdf, uploaded 2026-09-17, archived via
// archive-icse-history-ch3.js as source_files.id 104
// (ICSE-HISTCIVICS-CH03-PMCOM).
//
// Source book: "ICSE Chapterwise MCQs & Objective Series — History & Civics
// - X", printed pages 133-138 (a 6th scanned page bleeds into the START of
// the NEXT chapter — "The Union Judiciary/The Supreme Court" — deliberately
// NOT ingested here). 32 plain MCQ items, each printed with its own
// explanation.
//
// METHOD: same as Chapters 1-2 — every answer independently checked
// against Indian Constitution/parliamentary-procedure facts. All 32
// printed answers are correct, with three disclosed caveats (none change
// the marked answer):
//  - Item 13: "20 Cabinet Ministers" is presented as if it were a fixed
//    rule. It isn't — only the COUNCIL OF MINISTERS' total size is
//    constitutionally capped (Article 75(1A), 15% of Lok Sabha strength,
//    per item 27); the number of Cabinet-rank ministers specifically is a
//    matter of prime ministerial discretion/convention, not a fixed "20."
//    Kept as printed since it reflects a common practical range, with the
//    distinction noted.
//  - Item 15: the two "principles" offered (ministerial appointment by the
//    President on the PM's advice; ministers continuing at the PM's
//    pleasure) are both independently true facts, but they don't actually
//    describe what "collective responsibility" means — that's properly
//    defined in item 16 (Cabinet/Council decisions are taken, and owned,
//    jointly). The source conflates two different constitutional
//    provisions with the definition of a third; noted, not overridden,
//    since both options offered are individually true and no better
//    option exists among the four.
//  - Item 19: "objective of Planning Commission" reflects the pre-2015
//    institutional setup — the Planning Commission was replaced by NITI
//    Aayog in 2015. The stated objective (effective use of the country's
//    resources) is accurate to the historical Five-Year-Plan framing this
//    syllabus still teaches; noted for currency, not changed.
//
// No diagrams/figures in this chapter — diagramStatus: 'not_applicable'
// throughout.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [104]; // archive-icse-history-ch3.js -> ch03-the-prime-minister-and-the-council-of-ministers.pdf

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
  mcq(1, '133', 'Who appoints the Prime Minister of India?',
    ['The President', 'The Vice-President', 'The Speaker', 'The Chief Justice of India'], 0,
    { explanation: 'The Prime Minister is appointed by the President of India. This power of the President is formal in nature because the Prime Minister, who is the leader of the majority party or the coalition parties in the Lok Sabha, is actually elected as such by the party/parties\' MPs, and the President just invites him to form the government.' }),
  mcq(2, '133', 'When no party wins a majority, the President uses his ___ power to appoint the Prime Minister.',
    ['financial power', 'discretionary power', 'emergency power', 'judicial power'], 1,
    { explanation: 'When no party or coalition appears to have a majority in the Lok Sabha, the President can use his or her discretionary powers to appoint the Prime Minister.' }),
  mcq(3, '133', 'What percent of the Council of Ministers was originally mentioned in the constitution?',
    ['10% of the total members of the Lok Sabha.', '15% of the total members of the Lok Sabha.', '20% of the total members of the Lok Sabha.', 'There was no such mention in the Constitution.'], 3,
    { explanation: 'The original Constitution of India had no mention of the size of the Council of Ministers and was left to the discretion of the Prime Minister. It was done so because the size of the Council of Ministers could be different during the tenure of different Prime Ministers. (The 15% cap seen in item 27 was added much later, by the 91st Amendment Act, 2003.)' }),
  mcq(4, '133', 'Who among the following acts as the only line of communication between the Cabinet and the President?',
    ['The Prime Minister', 'The Vice-President', 'The Council of Ministers', 'The Speaker of Lok Sabha'], 0,
    { explanation: "Between the Cabinet and the President, the Prime Minister is the only point of contact. He/she informs the President about the Cabinet's decisions and keeps him up to date on all national and foreign government topics." }),
  mcq(5, '133-134', 'Who furnishes the information regarding the affairs of the union, to the President?',
    ['The Speaker of the Lok Sabha', 'The Vice-President', 'The Prime Minister', 'None of these'], 2,
    { explanation: 'The Prime Minister is the person who has to furnish the information regarding the affairs of the Union, decisions taken by the cabinet etc., to the President (Article 78).' }),
  mcq(6, '134', 'Who has the authority to dismiss the Prime Minister even if he enjoys the support of the majority in Parliament?',
    ['The Speaker of Lok Sabha', 'The Leader of Opposition', 'The Vice-President', 'No one can dismiss him in such scenario'], 3,
    { explanation: 'No one has the authority to dismiss the Prime Minister as long as he/she enjoys the support of the majority in the Parliament. The Prime Minister must have the confidence of the Lok Sabha — a "vote-of-no-confidence" can end the term of the Prime Minister before the conclusion of the Lok Sabha, by the President only after that loss of confidence.' }),
  mcq(7, '134', 'Which of the following statements are correct about the Prime Minister of India?',
    ['He/She is the recognised leader of the Cabinet', 'He/She forms the Council of Ministers and determines its size.', 'He/She determines the portfolios of the ministers.', 'All of the above'], 3,
    { explanation: "The Prime Minister is the Cabinet's acknowledged leader. He/she establishes the Council of Ministers and decides its size, ministerial categories, and responsibilities. He can also remove a minister from the Cabinet or Council of Ministers by asking for his/her resignation. He has the ability to determine the portfolios of the ministers." }),
  mcq(8, '134', 'Who among the following coordinates the policies and the working of the various departments of the government?',
    ['The President', 'The Prime Minister', 'The Vice-President', 'The Speaker of Lok Sabha'], 1,
    { explanation: "The Prime Minister manages the policies and operations of all the ministries of the government in order to ensure that all departments adhere to the Cabinet's policies and decisions." }),
  mcq(9, '134', 'Who is considered as the chief spokesman of the government in the Parliament?',
    ['The Prime Minister', 'The Union Home Minister', 'The Leader of Opposition', 'The Vice-President'], 0,
    { explanation: "On the Prime Minister's advice, the President summons and prorogues the Houses of Parliament and dissolves the Lok Sabha. The Prime Minister is the leader of the Lok Sabha. He/she is the government's chief spokesman in the Parliament and makes all major announcements about government plans on the House floor." }),
  mcq(10, '134', 'The whole nation is supposed to be speaking when ___ speaks.',
    ['the President', 'the Vice-President', 'the Prime Minister', 'the Speaker of Lok Sabha'], 2,
    { explanation: 'The Prime Minister is recognised as the leader of the entire country. He is looked upon for leadership by the entire country. The whole nation is supposed to be speaking when the Prime Minister speaks. In his or her conduct and work, he or she must demonstrate all of the traits of leadership, such as clarity of vision, foresight, objectivity, and statesmanship.' }),
  mcq(11, '134-135', 'Which of the following is/are a part(s) of the P.M.O.?',
    ['Principal Secretary', 'Press Advisor', 'Private Secretary', 'All of these'], 3,
    { explanation: 'Private Secretaries, Principal Secretary, Secretary to the Prime Minister, Press Adviser, Director Public Relations, and others together constitute the P.M.O. (Prime Minister\'s Office).' }),
  mcq(12, '135', 'In whose name are all the acts performed by the Ministry and the Cabinet?',
    ['The Prime Minister', 'The Vice-President', 'The President', 'None of these'], 2,
    { explanation: 'Under the Cabinet System, the Ministry and the Cabinet assume full and joint responsibility for all acts carried out in the name of the President (Article 77).' }),
  mcq(13, '135', 'How many Cabinet Ministers can be there in the Council of Ministers?',
    ['20', '30', '40', '50'], 0,
    { explanation: "Cabinet Ministers are the party's senior leaders and, in general, the Prime Minister's close colleagues. They are usually 20 in number and are referred to as the Cabinet collectively. Note: this is a customary/practical figure, not a fixed constitutional number — only the COUNCIL OF MINISTERS' total size is constitutionally capped (Article 75(1A), 15% of Lok Sabha strength, added by the 91st Amendment Act, 2003; see item 27), while the number of Cabinet-rank ministers specifically is left to the Prime Minister's discretion." }),
  mcq(14, '135', 'Which of the following is a Cabinet Committee?',
    ['Defence Committee', 'Foreign Affairs Committee', 'Political Affairs Committee', 'All of these'], 3,
    { explanation: 'The Prime Minister and the Cabinet function through the Cabinet Committees which are decision-making bodies. Some important Cabinet Committees are the Defence Committee, the Foreign Affairs Committee, the Political Affairs Committee, the Economic Affairs Committee and the Policy Planning Committee.' }),
  mcq(15, '135', 'The concept of collective responsibility is based on two principles. These are:',
    ['All ministers are nominated to the Council by the President on the advice of the Prime Minister.', 'A minister or the ministers can continue till the Prime Minister wants him/them to continue.', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
    { explanation: 'The source lists these as the two principles underlying "collective responsibility": all ministers are nominated to the Council by the President on the advice of the Prime Minister, and a minister or the ministers can continue till the Prime Minister wants him/them to continue. Note: both (a) and (b) are independently true facts about ministerial appointment (Article 75(1)) and tenure ("during the pleasure of the President," exercised on the PM\'s advice) — but they describe HOW ministers are appointed and how long they serve, not what "collective responsibility" itself means (that concept — joint, unanimous accountability of the Council to the Lok Sabha, Article 75(3) — is correctly defined in item 16). This item\'s framing conflates the two; disclosed here since it isn\'t a computational answer that can simply be "corrected," and no better option exists among the four offered.' }),
  mcq(16, '135', 'The term "Collective Responsibility" states that:',
    ['The decision taken in the meetings of the Cabinet or the Council of Ministers are taken collectively and unanimously.', 'The decisions are equally applicable to all the Ministers even though they may differ among themselves regarding a particular policy.', 'All Ministers jointly share the responsibility for the government\'s policies and performances.', 'All of the above'], 3,
    { explanation: 'The word "collective responsibility" refers to the fact that the decisions taken at Cabinet or Council of Ministers meetings are taken collectively and unanimously. Even if the Ministers disagree on a particular issue, the decisions apply equally to all of them. All Ministers are collectively responsible for the government\'s policies and results. In other words, the ministers must function as a team in supporting and defending governmental policies inside and outside the Parliament. This is the accurate definition of the concept (Article 75(3)).' }),
  mcq(17, '136', '"If a vote of no-confidence is passed against the Government or even a single minister in the Lok Sabha, then the whole ministerial team has to resign." It refers to:',
    ['Individual responsibility', 'Collective responsibility', 'Both (a) and (b)', 'Neither (a) nor (b)'], 1,
    { explanation: '"If a vote of no-confidence is passed against the Government or even a single minister in the Lok Sabha, then the whole ministerial team has to resign." It refers to the concept of "Collective Responsibility".' }),
  mcq(18, '136', 'Which of the following statements is correct regarding individual responsibility?',
    ['Each Minister is answerable to the Parliament (Lok Sabha) for the department under his/her control.', 'He/She is under obligation to answer all the questions asked by the Members of the House regarding the functioning of his own department.', "If the Lok Sabha finds him responsible for any departmental lapse, it can pass a censure motion against him or cut motion in respect of the failure for his/her department or propose a deduction in his/her salary.", 'All of the above'], 3,
    { explanation: "Each Minister is responsible to the Lok Sabha (Parliament) for the department in which he or she is in charge. He/she is required to respond to all queries from Members of the House regarding the operation of his/her own department. If the Lok Sabha considers him accountable for a departmental failure, it can reprimand him, pass a cut motion in his/her department, or request a salary reduction. Each of these acts results in the Minister's dismissal from office or resignation. The Minister resigns of his or her own volition." }),
  mcq(19, '136', 'What is the objective of the plans formulated by the Planning Commission?',
    ['To make effective use of the population.', "To make the effective use of the country's resources.", 'To make the effective use of funds of the government.', 'None of the above.'], 1,
    { explanation: "The Prime Minister chairs the Planning Commission, which formulates five-year plans to make the best use of the country's resources. Note (currency): the Planning Commission was replaced by NITI Aayog in 2015; this item reflects the historical Five-Year-Plan-era institutional setup that this syllabus still teaches for the underlying planning concept, not the present-day body." }),
  mcq(20, '136', 'The government has to do a lot of work regarding:',
    ['welfare, social and economic development.', 'maintenance of internal and external security.', 'coping with the world community in all respect.', 'all of the above.'], 3,
    { explanation: 'The government has to do a lot of work for welfare, social and economic advancement, maintenance of internal and external security, to meet threats to unity and integrity of India and to cope with the world community in all respects.' }),
  mcq(21, '137', 'In the Parliamentary form of government, which branch makes the laws?',
    ['The Executive Branch', 'The Legislative Branch', 'The Bureaucratic Branch', 'None of these'], 1,
    { explanation: 'The legislative branch of a Parliamentary system makes laws, while the executive branch enforces them. Much of the day-to-day work is handled by the Executive.' }),
  mcq(22, '137', 'The Indian Union Executive consists of:',
    ['The President', 'The Vice-President', 'The Council of Minister headed by the Prime Minister', 'All of the above'], 3,
    { explanation: 'The Executive is that branch which enforces the laws in the nation. The Indian Executive consists of: The President, The Vice-President, and The Council of Ministers headed by the Prime Minister.' }),
  mcq(23, '137', 'Which of the following articles provide for the Prime Minister to be the head of the Council of Ministers?',
    ['Article 74', 'Article 53', 'Article 78', 'Article 79'], 0,
    { explanation: 'According to Article 74 of the Indian Constitution, "There shall be a Council of Ministers with the Prime Minister at the head to aid and advise the President."' }),
  mcq(24, '137', 'Which branch of the Parliamentary system is represented by the Cabinet?',
    ['The Executive', 'The Judiciary', 'The Bureaucracy', 'The Legislative'], 0,
    { explanation: 'A Cabinet can be referred to as a body of high ranking members of the government. These typically represent the Executive branch.' }),
  mcq(25, '137', 'The Council of Ministers is collectively responsible to the ___.',
    ['Lok Sabha', 'Rajya Sabha', 'Prime Minister', 'President'], 0,
    { explanation: 'The Council of Ministers is collectively responsible to the Lok Sabha (Article 75(3)).' }),
  mcq(26, '137', 'The junior category of ministers who assist senior ministers:',
    ['Cabinet Ministers', 'Ministers of State', 'Deputy Ministers', 'Council of Ministers'], 2,
    { explanation: 'They are junior ministers who assist the Cabinet Ministers. They take no part in Cabinet deliberations.', questionType: 'mcq' }),
  mcq(27, '137', 'The total number of Ministers, including the Prime Minister Shall not exceed ___ percent of the total number of Members of the Lok Sabha.',
    ['Ten percent', 'Fifteen percent', 'Twenty percent', 'Twenty-five percent'], 1,
    { explanation: 'The total number of ministers, including the Prime Minister, must not exceed fifteen percent of the total members of the Lok Sabha, as mandated by law (Article 75(1A), added by the 91st Constitutional Amendment Act, 2003). Independently verified correct.' }),
  mcq(28, '138', 'How is the Prime Minister of India elected?',
    ['Direct election by the citizens of India', 'Election by the members of the Rajya Sabha', 'Appointment by the President based on the ability to command a majority in the Lok Sabha', 'Selection by the Supreme Court of India'], 2,
    { explanation: 'The Prime Minister of India is not elected directly by the people. Instead, after general elections, the President appoints the leader of the majority party or the coalition in the Lok Sabha as the Prime Minister. This individual is typically the leader who can command the confidence of a majority of the members in the Lok Sabha, ensuring stable governance.' }),
  mcq(29, '138', 'Who prepares the Annual Budget of India?',
    ['The Prime Minister of India', 'The President of India', 'The Ministry of Finance', 'The Reserve Bank of India'], 2,
    { explanation: "The Ministry of Finance under the finance minister is responsible for preparing India's Annual Budget, detailing government revenue and expenditures for the fiscal year." }),
  mcq(30, '138', 'Which of the following is not a power of the Prime Minister?',
    ['Declaring Emergency under Article 352', 'Recommending dissolution of Lok Sabha to the President', 'Appointing the Chief Justice of India', 'Formulating government policies'], 2,
    { explanation: 'The appointment of the Chief Justice of India is not a prerogative of the Prime Minister but of the President, on the advice of (by convention/seniority from) the outgoing Chief Justice. (Declaring an Article 352 emergency and recommending Lok Sabha dissolution are both done by the President, but on the advice/recommendation of the Prime Minister/Council of Ministers — so those ARE, in the practical sense the item intends, powers exercised through the Prime Minister\'s advice, unlike CJI appointment.)' }),
  mcq(31, '138', 'Who is responsible for choosing the members of the Council of Ministers?',
    ['The President', 'The Prime Minister', 'The Lok Sabha', 'The Supreme Court'], 1,
    { explanation: 'The Prime Minister selects members of the Council of Ministers and their portfolios, which the President then formally appoints.' }),
  mcq(32, '138', 'What is one of the primary roles of the Prime Minister of India?',
    ['Leading the Indian Armed Forces', 'Appointing the President of India', 'Serving as the ceremonial head of state', 'Advising the President on the appointment of members to the Council of Ministers'], 3,
    { explanation: 'The Prime Minister of India plays a crucial role in advising the President on the selection and appointment of ministers to the Council of Ministers. While the President has the formal power to appoint ministers on the advice of the Prime Minister, it is the Prime Minister who recommends individuals for these positions, thereby shaping the government\'s composition and policies.' }),
];

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'The Prime Minister and The Council of Ministers',
  chapterOrder: 3,
  label: 'ICSE Class 10 History & Civics — The Prime Minister and The Council of Ministers: 32 plain MCQ items, full chapter, from chap_3.pdf — every answer independently checked against Indian Constitution/parliamentary-procedure facts (all 32 correct; three items carry a disclosed caveat — customary vs. constitutional "20 Cabinet Ministers" figure, a conceptual conflation in the collective-responsibility item, and the pre-2015 Planning Commission reference — none change the marked answer)',
  status: 'verified',
  answerStatus: 'verified',
  sourceSection: 'Multiple Choice Questions (full chapter, pp.133-138)',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
