// ICSE Class 10 History & Civics — Chapter 1: The Union Parliament.
// Source: chap_1.pdf, uploaded 2026-09-17, archived via
// archive-icse-history-ch1.js as source_files.id 102
// (ICSE-HISTCIVICS-CH01-UNIONPARL). FIRST chapter of a new subject/board
// combination for this project — the founder has said further ICSE
// History & Civics chapters will be uploaded one at a time; this script
// (and its archive sibling) is the template to repeat for each.
//
// Source book: "ICSE Chapterwise MCQs & Objective Series — History & Civics
// - X", printed pages 118-123 (a 7th scanned page, 124, is the START of the
// NEXT chapter — "The Executive and the Judiciary" — bleeding into this PDF
// export; deliberately NOT ingested here, since it belongs to a future
// upload, not this one). 40 MCQ items (39 plain MCQ + 1 Assertion-Reason,
// item 15, embedded in the same numbered sequence rather than a separate
// section), every item printed with its own explanation in the source.
//
// METHOD: this is civics/constitutional-fact content, not computable
// algebra, so "independent verification" here means checking each printed
// answer against actual Indian Constitution/Parliamentary-procedure facts
// (Articles 79-122 etc.), not re-deriving a number. All 40 printed answers
// check out factually correct on that basis, with one item-level caveat
// disclosed rather than silently ignored:
//  - Items 12 and 19 state the maximum strength of the Lok Sabha as 552
//    (530 elected + 20 Union Territory + 2 nominated Anglo-Indian members).
//    This was the correct constitutional figure for decades, but the 104th
//    Constitutional Amendment Act, 2019 (effective Jan 2020) abolished the
//    2 nominated Anglo-Indian seats, making the current maximum 550. 552
//    is transcribed as printed (it is very likely still the ICSE syllabus's
//    expected board-exam answer for this edition), with the amendment
//    noted in both items' explanations so it isn't silently presented as
//    unqualified current fact.
//  - Item 24 ("An ordinance is called a temporary law...") has more than
//    one factually-true option among its four (the printed answer (b), and
//    option (c), are both true statements about ordinances); the source's
//    chosen answer is not wrong, just one reasonable reading among two
//    defensible ones — noted in the explanation, not overridden.
//
// No diagrams/figures in this chapter — two items (12, 25, 27) present
// data as a two/three-column table, transcribed as text (same treatment
// tables have had throughout this project) — diagramStatus:
// 'not_applicable' throughout.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [102]; // archive-icse-history-ch1.js -> ch01-the-union-parliament.pdf

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
  mcq(1, '118', 'What do you understand by federal structure of government?',
    ['All the administrative powers lie with the Centre', 'A union of sovereign groups or states united for certain common purposes', 'A system of government in which all the administrative powers are divided between the Central and the State governments', 'Rule by a king or a queen'], 2,
    { explanation: 'In a federal setup, there is dual government with well-defined powers and functions. In this system, the powers are divided between Central and the State governments.' }),
  mcq(2, '118', 'Who needs to sign the Bill passed by the Parliament for it to become a law?',
    ['President', 'Prime Minister', 'Finance Minister', 'Chief Justice of India'], 0,
    { explanation: 'The bill after receiving the approval of the Lok Sabha and the Rajya Sabha has to get the assent from the President who has the power to accept, reject or withhold the bill.' }),
  mcq(3, '118', 'Who is the ex-officio Chairman of the Rajya Sabha?',
    ['Prime Minister', 'President', 'Senate', 'Vice-President'], 3,
    { explanation: 'The Vice-President of the nation serves as the ex-officio Chairman of the Rajya Sabha and presides over its meeting.' }),
  mcq(4, '118', 'Who decides the salaries and allowances of MPs, Ministers, and Judges of Supreme Court and High Courts?',
    ['Comptroller and Auditor-General of India', 'Parliament', 'Finance Minister', 'President in consultation with the Chief Justice of India'], 1,
    { explanation: 'The salaries of the MPs and Cabinet ministers, Speaker, Supreme Court and High Court judges are determined by the Parliament.' }),
  mcq(5, '118', "Why does the decision by Lok Sabha prevail during a joint session with Rajya Sabha?",
    ['Rajya Sabha has no power to vote', 'As total membership of Rajya Sabha is less than even half of the total strength of Lok Sabha', 'No-Confidence Motion can only be moved in the Lok Sabha', 'The Council of Ministers are collectively responsible to the Lok Sabha'], 1,
    { explanation: 'The total membership of the Lok Sabha is more than the Rajya Sabha, due to which its decisions prevail during the joint sitting (Lok Sabha: 545ish; Rajya Sabha: up to 245 — well under half of Lok Sabha\'s strength).' }),
  mcq(6, '119', 'In general, how many Sessions are held in a year?',
    ['Six', 'Five', 'Four', 'Three'], 3,
    { explanation: 'By convention (not a fixed constitutional number), there are three sessions of Parliament in a year: Budget Session (first), Monsoon Session (second), and the Winter Session (third).' }),
  mcq(7, '119', 'A ___ is the minimum number of members required to be present before a meeting is allowed to begin.',
    ['Zero Hour', 'Adjournment', 'Quorum', 'Term'], 2,
    { explanation: 'Quorum is the minimum number of members needed for a session of the Parliament to be conducted.' }),
  mcq(8, '119', 'To be chosen as a member of the Rajya Sabha, a person must be a citizen of India and not less than ___ years of age.',
    ['25', '30', '35', '18'], 1,
    { explanation: 'The minimum age for becoming a member of the Rajya Sabha is 30 years (Article 84) — the Lok Sabha\'s minimum is 25.' }),
  mcq(9, '119', "Control over ___ gives proof of the Lok Sabha's superiority.",
    ['Censure Motion', 'National Treasury', 'Adjournment Motion', 'The Budget'], 1,
    { explanation: 'In matters related to money, the powers of the Lok Sabha are superior — a Money Bill can only originate in, and its control over the national treasury is not shared with, the Rajya Sabha.' }),
  mcq(10, '119', 'The salaries and allowances of the President, the Speaker, the Deputy Speaker, the Chairman and the Judges of the Supreme Court and High Courts are a part of ___.',
    ['Consolidated Fund of India', 'Other expenditures of the Government', 'Supplementary Grants', 'Vote on Account'], 0,
    { explanation: 'The salaries of the people who are constitutionally appointed are charged upon the Consolidated Fund of India — this "charged expenditure" is not put to a vote in the House.' }),
  mcq(11, '119', '___ is not subject to dissolution by the President.',
    ['Lok Sabha', 'Rajya Sabha', 'Both (a) and (b)', 'None of these'], 1,
    { explanation: 'The Rajya Sabha is the permanent house and it cannot be dissolved by the President — only the Lok Sabha can be dissolved.' }),
  {
    kind: 'case', sourceQuestionNumber: '12', sourcePage: '119',
    text: 'Composition of the Lok Sabha:\nColumn I / Column II\nI. Maximum strength of the Lok Sabha provided by the Constitution / (A) 530\nII. Members representing the States / (B) 20\nIII. Members representing the Union Territories / (C) 552\nChoose the correct option:',
    parts: [
      { text: '(a) I-C, II-B, III-A', options: ['Selected'], correct: 0, marks: 0 },
    ],
    // Represented as a single-answer matching question rather than forcing
    // a generic 4-option MCQ shape onto a match-the-column item — see
    // `options` below for the four combined choices as actually printed.
  },
  mcq(13, '120', 'Who is the principal Presiding Officer of the Lok Sabha?',
    ['Deputy Speaker', 'Speaker', 'President', 'Prime Minister'], 1,
    { explanation: 'The Speaker is the presiding officer of the Lok Sabha and heads various committees of the Lok Sabha too. In the Speaker\'s absence, the deputy Speaker presides over the sittings of the Lok Sabha.' }),
  mcq(14, '120', 'How is the Speaker elected?',
    ['By the House from among its members by a simple majority of members present and voting', 'Nominated by the President of India', 'Elected by the elected members of the Legislative Assembly of each state', 'By one-tenth of the total members of the House'], 0,
    { explanation: 'The Speaker is elected among the members of the Lok Sabha by means of simple majority voting.' }),
  mcq(15, '120', 'Assertion (A): The Lok Sabha by a two-thirds majority may pass a resolution that it is necessary in the national interest to create one or more All-India Services.\nReason (R): The Parliament by law may create new All-India Services.',
    ['Both A and R are true and R is the correct explanation of A.', 'Both A and R are true but R is not the correct explanation of A.', 'A is true but R is false.', 'A is false but R is true.'], 3,
    { questionType: 'assertion_reasoning', explanation: 'Assertion is false as printed: it is the RAJYA SABHA (Article 249), not the Lok Sabha, that may pass a two-thirds-majority resolution enabling Parliament to legislate on a State-List matter/create new All-India Services (Article 312) in the national interest. Reason is true as a general statement: Parliament may by law create new All-India Services. A false, R true — matches the printed key and is factually correct on independent check.' }),
  mcq(16, '120', 'Complete the given analogy.\nRajya Sabha : Deputy Chairman :: Lok Sabha : ?',
    ['Opposition Leader', 'Deputy Speaker', 'Speaker', 'Chairman'], 1,
    { explanation: 'The Lok Sabha in the absence of the Speaker is headed by the Deputy Speaker (parallel to the Rajya Sabha\'s Chairman/Deputy Chairman relationship).' }),
  mcq(17, '120', 'Complete the given analogy.\nCentral Government : Union List :: State Government : ?',
    ['Concurrent List', 'State List', 'Residuary Subjects', 'None of these'], 1,
    { explanation: 'The Central government can legislate on the matters of the Union List and state governments can legislate on the matters of the State List.' }),
  mcq(18, '120', 'The interval between two sessions of the Parliament should not be more than ___.',
    ['two months', 'three months', 'four months', 'six months'], 3,
    { explanation: 'The maximum gap between two sessions of Parliament cannot be more than six months at a stretch (Article 85(1)).' }),
  mcq(19, '120', 'The maximum composition of the Lok Sabha is:',
    ['530', '540', '552', '556'], 2,
    { explanation: 'The strength of the house is 550 elected members (530 representing the states + 20 the Union Territories); the source\'s figure of 552 additionally counts the 2 nominated Anglo-Indian members, a provision that was constitutionally valid for decades but was abolished by the 104th Constitutional Amendment Act, 2019 (effective January 2020) — the current constitutional maximum is 550. Transcribed as printed since it is likely still this edition\'s/syllabus\'s expected answer; flagged here so the figure isn\'t taken as unqualified present-day fact.' }),
  {
    kind: 'case', sourceQuestionNumber: '20', sourcePage: '120',
    text: 'Given the table:\nLok Sabha member term: 5 years\nRajya Sabha member term: ?',
    parts: [{ text: 'What is the term of a Rajya Sabha member?', options: ['1 year', '2 years', '4 years', '6 years'], correct: 3, marks: 1 }],
    difficulty: 'Easy', subConcept: 'Terms of the two Houses of Parliament', questionType: 'case_study',
    explanation: 'The term of a member of the Rajya Sabha is one more than double the Lok Sabha\'s term, i.e. 6 years (Rajya Sabha is a permanent body with one-third of members retiring every two years); Lok Sabha\'s normal term is 5 years. Independently verified correct.',
    diagramStatus: 'not_applicable', answerStatus: 'verified',
    answerKeyRef: 'printed in-line "Ans." + "Explanation" under item 20, p.120',
  },
  mcq(21, '120', 'A house has 350 members on a given day 25 members are present. For which of the following reasons does the Speaker adjourn the session for the day?',
    ['Indiscipline in the House', 'Lack of quorum', 'Business of the day is over', 'There are no questions to admit'], 1,
    { explanation: 'The session cannot be conducted due to lack of quorum, which should be 10% of the total members. Here the minimum number required for the conduct of session should be 35 — only 25 are present. Independently verified: 350 × 0.1 = 35 > 25.' }),
  mcq(22, '120', 'An ordinance has to be approved by the Parliament within ___ weeks.',
    ['Two', 'Three', 'Six', 'Eight'], 2,
    { explanation: 'Under Article 123, an ordinance can be passed by the President when the Parliament is not in session but it needs to be approved within six weeks by the Parliament.' }),
  mcq(23, '120', 'A major natural calamity has taken place and the opposition wants the house to lay aside all other business and take up this matter of urgent importance. Which motion should the house move to allow this?',
    ['Adjournment Motion', 'No-confidence Motion', 'Confidence Motion', 'Censure Motion'], 0,
    { explanation: 'An Adjournment Motion is introduced in the Lok Sabha to draw the House\'s attention to an urgent matter of public importance, setting aside the normal business of the day.' }),
  mcq(24, '120', 'An ordinance is called a temporary law. Which of the following statements correctly describes the same?',
    ['Only the Cabinet can prepare an ordinance.', 'It is issued when the Parliament is not functioning.', 'If the Parliament does not approve it within six weeks it becomes inoperative.', 'Only the President can promulgate an ordinance.'], 1,
    { explanation: 'An ordinance is a temporary law because it is promulgated by the President only when the Parliament is not in session, and it has the same effect as an Act, but must be approved by the Parliament within six weeks after it convenes. Note: option (c) is also a factually true statement about ordinances (and arguably explains the "temporary" label more directly, since lapsing after six weeks is exactly what makes it temporary) — both (b) and (c) are defensible; the source\'s chosen answer (b) is not incorrect, just one reasonable reading among two.' }),
  {
    kind: 'case', sourceQuestionNumber: '25', sourcePage: '120-121',
    text: 'Given below are details of a few Indian citizens.\nCandidate | Age | Other details\nW | 35 | Recently declared bankrupt.\nX | 25 | A successful industrialist.\nY | 30 | Belongs to a socially and educationally backward class.\nZ | 31 | Convicted of a criminal offence and sentenced to imprisonment for two years.\nSelect the person who fulfils the eligibility criteria to become a member of the Rajya Sabha, the upper house of the Indian Parliament.',
    parts: [{ text: 'Who is eligible to become a Rajya Sabha member?', options: ['W', 'X', 'Y', 'Z'], correct: 2, marks: 1 }],
    difficulty: 'Medium', subConcept: 'Eligibility criteria for Rajya Sabha membership', questionType: 'case_study',
    explanation: 'To become a member of the Rajya Sabha, a person must: (1) be a citizen of India, (2) not be less than 30 years of age, (3) not be an undischarged bankrupt, (4) not be a proclaimed criminal. W fails (bankrupt), X fails (only 25, under the 30-year minimum), Z fails (convicted, imprisoned). Y (30, no disqualification stated) is eligible. Independently verified correct.',
    diagramStatus: 'not_applicable', answerStatus: 'verified',
    answerKeyRef: 'printed in-line "Ans." + "Explanation" under item 25, p.120-121',
  },
  mcq(26, '121', 'The opposition feels that the ruling government does not have the majority in the Lok Sabha and wants to bring down the Government. Which of these motions will the Leader of the Opposition move?',
    ['Adjournment Motion', 'No-confidence Motion', 'Motion of Thanks', 'Censure Motion'], 1,
    { explanation: 'If the opposition feels that the ruling government does not have the majority in the Lok Sabha, the Leader of the Opposition will move a No-confidence Motion to bring down the Government.' }),
  {
    kind: 'case', sourceQuestionNumber: '27', sourcePage: '121',
    text: 'Given below are details of a few Indian citizens.\nCandidate | Age | Other details\nW | 18 | Has completed his graduation.\nX | 30 | Recently declared bankrupt.\nY | 21 | Has started a business.\nZ | 25 | Is working as a party member.\nSelect the person who fulfils the eligibility criteria to become a member of the Lok Sabha, the lower house of the Indian Parliament.',
    parts: [{ text: 'Who is eligible to become a Lok Sabha member?', options: ['W', 'X', 'Y', 'Z'], correct: 3, marks: 1 }],
    difficulty: 'Medium', subConcept: 'Eligibility criteria for Lok Sabha membership', questionType: 'case_study',
    explanation: 'To become a member of the Lok Sabha, a person must be a citizen of India and at least 25 years of age (bankruptcy/criminal-conviction disqualifications apply too, as in item 25, though the age bar is the deciding factor here). W (18) and Y (21) are under 25; X is bankrupt (disqualified regardless of age); Z (25, no disqualification stated) is eligible. Independently verified correct.',
    diagramStatus: 'not_applicable', answerStatus: 'verified',
    answerKeyRef: 'printed in-line "Ans." + "Explanation" under item 27, p.121',
  },
  {
    kind: 'case', sourceQuestionNumber: '28', sourcePage: '121',
    text: 'Which individuals serving in the following offices can be removed through impeachment only?\nP: President\nQ: Member of Lok Sabha\nR: Judges of the Supreme Court\nS: Member of Rajya Sabha',
    parts: [{ text: 'Options:', options: ['P and Q', 'R and S', 'P and R', 'Q and S'], correct: 2, marks: 1 }],
    difficulty: 'Medium', subConcept: 'Impeachment vs. other forms of removal', questionType: 'case_study',
    explanation: 'Both the President (Article 61) and Judges of the Supreme Court/High Courts (Article 124(4), a similar quasi-impeachment process) can be removed through impeachment only. Members of either House are removed by other means (resignation, disqualification under the Tenth Schedule, expulsion by the House) — not "impeachment" in the constitutional sense. Independently verified correct.',
    diagramStatus: 'not_applicable', answerStatus: 'verified',
    answerKeyRef: 'printed in-line "Ans." + "Explanation" under item 28, p.121',
  },
  mcq(29, '121', "Country X has declared a state of emergency as declared under Article 352 of its Constitution. What will be its consequences?",
    ['The Central government will become all-powerful and can legislate over the State List as well.', 'The State governments will be disbanded permanently.', 'The High Courts and Supreme Courts will become ineffective.', 'Every Fundamental Right will get suspended.'], 0,
    { explanation: 'During a national emergency (Article 352), the federal structure effectively becomes unitary and the Central government can legislate on matters in the State List as well; state governments are NOT permanently disbanded, courts remain functional, and not every Fundamental Right is suspended (Articles 20 and 21 cannot be suspended even during an emergency).' }),
  mcq(30, '121', 'The salaries and allowances of the ministers are decided by the:',
    ['Parliament', 'Finance Minister', 'President', 'Prime Minister'], 0,
    { explanation: 'The salaries and allowances of the ministers are decided by Parliament, which also has the right to change them from time to time.' }),
  mcq(31, '122', 'The strength of the house is 550. On a particular day 50 members are present. The Speaker decides to adjourn the house. Identify the MOST LIKELY reason for the adjournment.',
    ['Disorder in the house', 'Lack of quorum', 'Breach of privilege', 'Contempt of the House'], 1,
    { explanation: 'For a session to be conducted, a minimum of 10% of the total members of the house must be present. In the case of a house with 550 members, at least 55 members are required — only 50 are present, so it is lack of quorum. Independently verified: 550 × 0.1 = 55 > 50.' }),
  mcq(32, '122', 'Which of the following statements about Federal Features of the Indian Constitution is Incorrect?',
    ['There is a division of legislative, administrative and financial powers between the Union (National) Government and State governments.', 'The Union Parliament is the final interpreter and guardian of the Constitution.', 'The Union Parliament can alter the boundaries of States in order to form a new state.', 'Subjects of national importance, such as defence, foreign affairs and currency are placed under the control of the Union Government.'], 1,
    { explanation: 'The judiciary, particularly the Supreme Court, holds the role of final interpreter and guardian of the Constitution, not the Union Parliament — this is the incorrect statement among the four. Independently verified correct: this is a well-established feature of Indian judicial review (Article 13, Kesavananda Bharati basic-structure doctrine, etc.).' }),
  mcq(33, '122', 'If the strength of the House is 350 Members, the quorum required to make the proceedings of the meeting valid will be:',
    ['36 Members', '40 Members', '60 Members', '35 Members'], 3,
    { explanation: 'Quorum refers to the minimum number of members of an assembly or society that must be present at any of its meetings to make the proceedings of that meeting valid. The quorum for a House with 350 members is 35, as one-tenth of the total number of members is required to complete the quorum. Independently verified: 350 × 0.1 = 35.' }),
  mcq(34, '122', 'Which of the following types of questions is NOT asked during Question Hour?',
    ['Starred Questions', 'Unstarred Questions', 'Short notice Questions', 'Hypothetical Questions'], 3,
    { explanation: 'During Question Hour in parliamentary proceedings, members typically ask Starred or Unstarred Questions, which require specific responses from ministers. Short notice Questions may be asked for immediate responses. However, Hypothetical Questions, which pose theoretical scenarios, are not typically asked during Question Hour, as it focuses on practical inquiries.' }),
  mcq(35, '122', 'What is the primary purpose of a No Confidence Motion in a parliamentary system?',
    ['To express dissatisfaction with the current government', 'To initiate a general election', 'To commend the government\'s actions', 'To propose a vote of confidence in the government'], 0,
    { explanation: 'A No Confidence Motion is brought forth to signal dissatisfaction with the ruling government\'s performance and potentially lead to its resignation or removal from power. It\'s a significant tool for the opposition to challenge the government\'s mandate.' }),
  mcq(36, '123', 'Who is ex-officio chairman of Rajya Sabha?',
    ['President', 'Vice-president', 'Prime Minister', 'Governor'], 1,
    { explanation: 'The Vice-president of India serves as the ex-officio Chairman of the Rajya Sabha. This role ensures the highest dignitary of the upper house presides over its sessions, maintaining decorum, and facilitating debates. The Vice-president\'s presence underscores the significance of the Rajya Sabha in the Indian parliamentary system.' }),
  mcq(37, '123', 'What is the primary purpose of the Anti-Defection Law in parliamentary systems?',
    ['To encourage party hopping', 'To discourage unethical political defections', 'To promote political instability', 'To facilitate coalition governments'], 1,
    { explanation: 'The Anti-Defection Law (Tenth Schedule) aims to deter elected representatives from switching parties for personal gain, thereby ensuring political stability, party discipline, and the integrity of the democratic process. It prohibits legislators from defecting to other parties after being elected under a particular party\'s symbol or manifesto.' }),
  mcq(38, '123', 'Members of the Rajya Sabha are elected by whom?',
    ['Members of the Lok Sabha', 'Members of the Vidhan Sabha', 'Members of the Vidhan Parishad', 'Citizens of India'], 1,
    { explanation: 'Members of the Rajya Sabha, which is the upper house of India\'s Parliament, are elected by the elected members of the State Legislative Assemblies (Vidhan Sabhas) in accordance with the system of proportional representation by means of the single transferable vote.' }),
  mcq(39, '123', 'Which of these is not an Exclusive power of the Lok Sabha?',
    ['Introduction of a Money Bill', 'To move a No-confidence Motion against the Council of Ministers', 'To move an Adjournment Motion', 'To move a motion to amend the Constitution'], 3,
    { explanation: 'The power to amend the Constitution is not the exclusive power of the Lok Sabha; both the Lok Sabha and Rajya Sabha can initiate constitutional amendments (a Constitution Amendment Bill may be introduced in either House).' }),
  mcq(40, '123', 'For how long can the Rajya Sabha delay a Money Bill?',
    ['14 days', '1 month', '6 months', 'Indefinitely'], 0,
    { explanation: 'The Rajya Sabha can only delay a Money Bill for 14 days (Article 109), after which it is considered passed by both Houses regardless of the Rajya Sabha\'s recommendations.' }),
];

// Item 12 needs its own options array (a match-the-column question, printed
// as four combined "I-x, II-y, III-z" choices) rather than the generic mcq()
// helper shape used above — replace the placeholder pushed into `items`.
const item12Index = items.findIndex((it) => it.sourceQuestionNumber === '12');
items[item12Index] = mcq(12, '119',
  'Composition of the Lok Sabha:\nColumn I: I. Maximum strength of the Lok Sabha provided by the Constitution  II. Members representing the States  III. Members representing the Union Territories\nColumn II: (A) 530  (B) 20  (C) 552\nChoose the correct option:',
  ['I-C, II-B, III-A', 'I-B, II-C, III-B', 'I-B, II-A, III-C', 'I-C, II-A, III-B'], 3,
  { explanation: 'Maximum Lok Sabha strength = 552 (I-C), members representing the States = 530 (II-A), members representing the Union Territories = 20 (III-B) — matches option (d). Note: as in item 19, the 552 figure predates the 104th Constitutional Amendment Act, 2019 (effective Jan 2020), which abolished the 2 nominated Anglo-Indian seats; the current constitutional maximum is 550. Transcribed as printed with this caveat disclosed rather than silently corrected.' });

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'The Union Parliament',
  chapterOrder: 1,
  label: 'ICSE Class 10 History & Civics — The Union Parliament: 40 items (35 plain MCQ, 4 multi-part case-study MCQ, 1 Assertion-Reason), full chapter, from chap_1.pdf, first ICSE History & Civics chapter ingested for this project — every answer independently checked against Indian Constitution/parliamentary-procedure facts (all 40 correct; two items carry a disclosed caveat about the pre-2020 552 vs. current 550 max Lok Sabha strength, one item notes a defensible alternate reading)',
  status: 'verified',
  answerStatus: 'verified',
  sourceSection: 'Multiple Choice Questions (full chapter, pp.118-123)',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
