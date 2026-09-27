// ICSE Class 10 History & Civics — Chapter 6: "The State Judiciary (The
// Subordinate Courts)" — covers Lok Adalats and the subordinate court
// hierarchy (District Judge, Sessions Judge, Civil/Family/Small-Cause
// Courts). Uploaded 2026-09-17 as chap_6.pdf, archived via
// archive-icse-history-ch6.js -> source_files.id 107. Standing instruction:
// "now on till i dont change it will be icse 10 history chapter wise i will
// be uploading, make sure you feed in the system."
//
// Verification method (same as Ch1-5): every printed answer checked against
// actual Constitution of India / CrPC / Legal Services Authorities Act
// provisions rather than re-derived by computation. One disclosed caveat
// (item 13) — see below and PROJECT_PROGRESS.md.
//
// DIAGRAM NOTE — item 28 is the first genuine source diagram encountered in
// this History & Civics subject across six chapters: a small illustration
// of two pairs of stick figures shaking hands/making up, used to visually
// cue "spirit of compromise." Marked diagramStatus: 'source_diagram_preserved'
// with a visual link to the source page, per the founder's hard visual-
// preservation requirement, even though the question is answerable from its
// own text alone.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 107;

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

items.push(mcq(1, '153', "Which of the following statement(s) is/are correct about Lok Adalat?",
  ["Lok Adalat means 'People's Court'.", 'These are set up to provide legal and quick justice.', 'Eliminates high cost and delay in imparting justice.', 'All of the above'], 3,
  { explanation: "Lok Adalat means 'People's Court'; these forums are set up to provide legal and quick justice to those who cannot afford the expense of regular litigation, and they eliminate high cost and delay in imparting justice." }));

items.push(mcq(2, '153', 'Which of the following statement(s) is/are correct in reference to Lok Adalat?',
  ['Lok Adalats were set up on the recommendation of justice P.N. Bhagwati.', 'These were set up to encourage the settlement of disputes speedily and through compromises between the parties.', 'On March 14, 1982, for the first time Lok Adalats camp were held at Junagarh in Gujarat.', 'All of the above'], 3,
  { explanation: 'Lok Adalats were set up on the recommendation of Justice P.N. Bhagwati as part of the legal-aid movement, to encourage speedy settlement of disputes through compromise between parties; the first Lok Adalat camp was held at Junagadh, Gujarat, on 14 March 1982.' }));

items.push(mcq(3, '153', 'Which of the following statement(s) is/are correct?',
  ['All decisions of the Lok Adalats shall be deemed to be decrees of a Civil Court.', 'All decisions of the Lok Adalats shall be binding on the parties to the dispute.', 'The Legal Services Authorities Act amended in 2002 required the establishment of Permanent Lok Adalats for the settlement of disputes.', 'All of the above'], 3,
  { explanation: 'Section 21 of the Legal Services Authorities Act, 1987 deems every award of a Lok Adalat to be a decree of a Civil Court, final and binding on the parties, with no appeal lying against it; the 2002 amendment added Chapter VI-A, requiring the establishment of Permanent Lok Adalats for disputes relating to public utility services.' }));

items.push(mcq(4, '154', 'Which of the following is an advantage of the Lok Adalat?',
  ['There is no court fee and even if the case is already filed in the regular court.', 'The fee paid will be refunded if the dispute is settled at the Lok Adalat.', 'One can move to Lok Adalat by an application on a plain paper or format available with Legal Services Authorities.', 'All of the above'], 3,
  { explanation: 'Under the Legal Services Authorities Act, no court fee is charged at a Lok Adalat, and if a case already filed in a regular court is settled there, the court fee already paid is refunded; a matter can be referred to a Lok Adalat by a simple plain-paper application through the Legal Services Authorities.' }));

items.push(mcq(5, '154', 'Which of the following is an advantage of the Lok Adalat?',
  ['Lok Adalats can pass Awards regarding disputes which are at "Pre-litigation stage".', 'There is no strict application of the procedural laws.', 'The parties to the disputes though represented by their advocate can interact with the Lok Adalat judge directly.', 'All of the above'], 3,
  { explanation: 'Lok Adalats can pass awards on disputes still at the pre-litigation stage, are not bound by strict procedural or Evidence Act requirements while assessing a claim\'s merits, and allow parties to interact directly with the presiding judge even while represented by an advocate.' }));

items.push(mcq(6, '154', 'Which of the following is an advantage of a Lok Adalat?',
  ['The Lok Adalats work in the spirit of compromise.', 'Thus, both parties feel that they have been treated fairly.', 'The decisions passed by a Lok Adalat are final and binding on the parties.', 'All of the above'], 3,
  { explanation: 'Lok Adalats work in the spirit of compromise, so both parties feel they have been treated fairly; the decisions passed are final and binding, with no appeal lying against them.' }));

items.push(mcq(7, '154', 'Which of the following is an advantage of the Lok Adalat?',
  ['A Lok Adalat reduces the workload of other courts.', 'A Lok Adalat delivers speedy and inexpensive justice.', 'These are helpful for the weaker sections as they cannot afford the delay or the costs involved in court procedures.', 'All of the above'], 3,
  { explanation: 'Lok Adalats reduce the workload of other courts, deliver speedy and inexpensive justice, are especially helpful for weaker economic sections who cannot afford the delay or cost of regular court procedures, and promote social justice.' }));

items.push(mcq(8, '155', 'Which of the following statement(s) is/are correct about state judiciary?',
  ['The subordinate courts are the courts below the rank of the High Court in a State.', 'There are civil, criminal courts and revenue courts in a district.', 'A State is divided into districts for judicial administration.', 'All of the above'], 3,
  { explanation: 'Subordinate courts are the courts below the rank of the High Court in a State; every district has civil, criminal and revenue courts, and a State is divided into districts for judicial administration, with the organisation of subordinate courts varying slightly from state to state.' }));

items.push(mcq(9, '155', 'Which of the following statement(s) is/are not correct about subordinate courts?',
  ['The High Court judges are deputed to inspect the working of the subordinate courts.', 'Subordinate courts need not to send any reports to the High Court as these are directly observed by the High Court.', 'Appeals against their judgements can be heard by the High Courts.', 'None of the above'], 1,
  { explanation: 'High Court judges are in fact deputed to inspect the working of subordinate courts, which are ALSO required to send periodic reports to the High Court about the disposal of their cases within a set time frame — so statement (b), which claims no such reports are needed, is the one that is NOT correct. Appeals against subordinate court judgements are indeed heard by the High Courts.' }));

items.push(mcq(10, '155', 'The civil courts are the courts to hear cases related to:',
  ['land and property', 'divorce', 'money transactions', 'all of these'], 3,
  { explanation: 'Civil courts hear cases relating to land and property, marriage and divorce, money transactions, and matters of will and guardianship.' }));

items.push(mcq(11, '155', 'The Court of ________ is the highest civil court of the district.',
  ['District Judge', 'Additional District Judge', 'Tehsildar', 'None of these'], 0,
  { explanation: 'The Court of the District Judge is the highest civil court of the district; in some districts, Additional District Judges assist the District Judge.' }));

items.push(mcq(12, '155', 'When the district judge deals with civil cases he is known as ________.',
  ['District Judge', 'Additional District Judge', 'Sessions Judge', 'None of these'], 0,
  { explanation: 'When the district judge deals with civil cases he is known as District Judge, and when he deals with criminal cases, he is known as Sessions Judge — the same officer holds both titles depending on the case type.' }));

items.push(mcq(13, '156', 'In which case a District Judge exercises administrative powers?',
  ['As a District Judge', 'As an Additional District Judge', 'As a Sessions Judge', 'As a District Collector'], 3,
  { explanation: 'DISCLOSED CAVEAT: the printed answer reflects a historical/customary note that a District Judge, if additionally given charge as District Collector or Deputy Commissioner in a particular posting, would then exercise administrative powers (law and order, revenue collection) rather than judicial ones. Under India\'s modern constitutional framework, however, the judiciary and executive are functionally separated at the district level (Article 50 DPSP, implemented through the 1973 CrPC reforms): the District Judge (a judicial officer, appointed under Article 233) and the District Collector/District Magistrate (an executive/IAS officer) are distinct offices that are not combined in the same person in the current system. This textbook point appears to echo an older/colonial-era administrative arrangement rather than present-day practice; the printed answer is transcribed unchanged since it is the only option describing an administrative (non-judicial) role, and none of the other three options is any more defensible as "correct."' }));

items.push(mcq(14, '156', 'Which of the following courts work under the District Judge?',
  ['The court of subordinate Civil Judge (1st class).', 'The court of Sub-Judge (Munsif Court).', 'Courts of small causes.', 'All of the above'], 3,
  { explanation: 'The Civil Courts working under the District Judge are the courts of subordinate Civil Judge (1st class), the Court of Sub-Judge (also known as Munsif Court), and the Courts of Small Causes.' }));

items.push(mcq(15, '156', 'The District/Additional District Judge or Subordinate Civil Judge can hear the cases having ________.',
  ['the value not more than ₹2000', 'the value from ₹2000 to ₹10000', 'the value from ₹10000 to ₹15000', 'any value'], 3,
  { explanation: 'The District/Additional District Judge or Subordinate Civil Judge can hear cases of any value; Courts of Small Causes handle only smaller-value cases, with the exact pecuniary limit fixed by the High Court in each State (the source cites illustrative, possibly dated figures — e.g. ₹1,000 in Delhi and ₹10,000 in Mumbai — for the Small Cause Court ceiling; these limits are periodically revised by the respective High Courts and are not independently re-verified as current here, since they don\'t affect this item\'s own answer).' }));

items.push(mcq(16, '156', 'Which of the following is correct?',
  ['Appeals from the Small Cause Court lie to the court of the Sub-Judge or Munsif.', 'From there, it can be taken to the Court of Civil Judge 1st class.', 'From here, it can be taken to the court of the District Judge and then to the High Court.', 'All of the above'], 3,
  { explanation: 'The appellate chain runs from the Small Cause Court to the Sub-Judge/Munsif court, then to the Court of Civil Judge 1st class, then to the District Judge, and finally to the High Court (or the Supreme Court, as the case may be).' }));

items.push(mcq(17, '156', 'The District Judge exercises administrative control over all ________ in the District.',
  ['civil courts', 'criminal courts', 'both (a) and (b)', 'neither (a) nor (b)'], 2,
  { explanation: 'The District Judge exercises administrative control over all civil and criminal courts in the District, while the High Court in turn exercises administrative control over the District Courts across the State.' }));

items.push(mcq(18, '157', 'The District/Additional District Judges are appointed by:',
  ['The President of India', 'The Governor', 'The Supreme Court', 'None of these'], 1,
  { explanation: 'Article 233(1): appointments of District Judges are made by the Governor of the State in consultation with the High Court exercising jurisdiction over that State.' }));

items.push(mcq(19, '157', 'The officers below District/Additional District Judges are appointed by:',
  ['The President of India', 'The Governor', 'The Supreme Court', 'The Judicial Services Exam'], 3,
  { explanation: 'All judges below the rank of District/Additional District Judge are appointed through the Judicial Service competitive examination held by the State Public Service Commission, in consultation with the High Court (Article 234).' }));

items.push(mcq(20, '157', 'The qualification to be a judge of the Civil Court is:',
  ['The person should be an advocate or a pleader for seven years.', 'The person should be an officer in Judicial Service of the Union or of the State.', 'His name should be recommended by the High Court for the post.', 'All of the above'], 3,
  { explanation: "A person qualifies to be a judge of a Civil Court if they have been an advocate or pleader of seven years' standing (or are an officer in the Judicial Service of the Union or State), are a citizen of India, and are recommended by the High Court for the post." }));

items.push(mcq(21, '157', '________ is the highest criminal court of the district.',
  ['The Civil Court', 'The Sessions Court', 'Munsif Court', 'None of these'], 1,
  { explanation: 'The Sessions Court is the highest criminal court of the District. It is usually presided over by the District Judge, which is why the same court/officer is called the District and Sessions Judge\'s Court.' }));

items.push(mcq(22, '157', 'The Sessions Court deals with the:',
  ['cases of murder', 'cases of robbery', 'cases of dacoities', 'all of these'], 3,
  { explanation: 'The Sessions Court deals with the more serious criminal cases, including murder, robbery and dacoity.' }));

items.push(mcq(23, '157', 'The Sessions judge has the powers to award:',
  ['death sentence', 'life imprisonment', 'both (a) and (b)', 'neither (a) nor (b)'], 2,
  { explanation: 'The Sessions judge (or Additional Sessions judge) can award both death sentence and life imprisonment.' }));

items.push(mcq(24, '158', 'The death sentence awarded by the Sessions judge must be confirmed by:',
  ['the Supreme Court.', 'the High Court.', 'the Munsif Court.', 'none of these'], 1,
  { explanation: 'Under Section 366 CrPC, a death sentence awarded by a Sessions Court must be confirmed by the High Court before it can be executed, even if the convict does not appeal.' }));

items.push(mcq(25, '158', 'The Sessions Judge hears appeals against the judgement of:',
  ['Chief Judicial Magistrate', 'Chief Metropolitan Magistrate', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'The Sessions Judge hears appeals against the judgements of the Chief Judicial Magistrate or the Chief Metropolitan Magistrate; all persons convicted by the Sessions Court can further appeal to the High Court.' }));

items.push(mcq(26, '158', 'Court of District Judge: Civil Cases :: Sessions Court : ________ Cases. [Board Question]',
  ['Advisory', 'Criminal', 'Constitutional', 'Appellate'], 1,
  { explanation: 'Just as the Court of the District Judge deals with civil cases, the Sessions Court deals with criminal cases and provides resolution to them.' }));

items.push(mcq(27, '158', 'Civil Cases : Court of District Judge :: Criminal Cases : ________:',
  ['Revenue Court', 'Family Court', 'Sessions Court', "Commissioner's Court"], 2,
  { explanation: 'Civil cases are dealt with in the District Court under the authority of the District Judge, while criminal cases are heard in the Sessions Court under the authority of the Sessions Judge.' }));

items.push(mcq(28, '158', 'The picture below shows two pairs of stick figures reaching an agreement/shaking hands. The Lok Adalat has many advantages. Which of the following statements about the advantages of the Lok Adalat is best described in the picture given above?',
  ['It is inexpensive.', 'It is organised in various parts of the country.', 'It works on the spirit of compromise.', 'It reduces the burden of the higher courts.'], 2,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.158, item 28 — line illustration of two pairs of stick figures shaking hands/reaching agreement, illustrating "spirit of compromise"', assetType: 'source_page_full' }],
    explanation: "Lok Adalats mean 'People's Courts' — legal forums that encourage friendly compromise of legal disputes between contending parties. The picture (two pairs of figures shaking hands) visually depicts parties reaching a mutual compromise, matching option (c).",
  }));

items.push(mcq(29, '158', 'Tina is inspired by the methods of the Early Nationalists and wants to follow them. She notices that the road leading to her school is damaged and has many potholes. Which of the following methods is she MOST LIKELY to follow, to solve this problem?',
  ['Boycott the civic authorities', 'Gather a group of students and protest', 'Write a petition to the authorities highlighting the problem', 'Block the entrance to the road'], 2,
  { explanation: 'The Early Nationalists (Moderates) employed the method of the "three Ps" — Petitions, Prayers and (peaceful) Protests — submitting petitions and sending letters requesting the government to address grievances, rather than boycotts or direct-action methods (associated instead with the later Extremist/Gandhian phases of the freedom movement).' }));

items.push(mcq(30, '159', 'The highest Criminal Court of the district is:',
  ['Court of Sessions Judge.', 'Court of the First Class Judicial Magistrate', 'Chief Judicial Magistrate', 'None of the above'], 0,
  { explanation: 'The Court of the Sessions Judge is the highest criminal court in a district, with authority to impose the severest of sentences, including capital punishment, under the Indian legal system.' }));

items.push(mcq(31, '159', 'The following types of cases are not taken up by Lok Adalats:',
  ['Matrimonial Disputes', 'Murder and Dacoities', 'Bank Recovery Cases', 'House Tax Cases'], 1,
  { explanation: 'Lok Adalats primarily deal with settling civil disputes and some minor/compoundable criminal matters through conciliation and mediation; serious criminal offences like murder and dacoity fall outside their jurisdiction and are adjudicated by regular courts with full legal procedure.' }));

items.push(mcq(32, '159', 'What type of cases does a Family Court deal with?',
  ['Property disputes', 'Traffic violations', 'Matrimonial disputes', 'Patent disputes'], 2,
  { explanation: 'Family Courts specifically handle cases related to family matters such as divorce, child custody and other matrimonial disputes.' }));

items.push(mcq(33, '159', 'What is the role of the Chief Judicial Magistrate?',
  ['To oversee international law', 'To supervise the work of Judicial Magistrates', 'To handle cases related to the constitution', 'To issue licenses'], 1,
  { explanation: 'Under Section 15 CrPC, the Chief Judicial Magistrate has administrative control over, and supervises the work of, the Judicial Magistrates within their jurisdiction.' }));

items.push(mcq(34, '159', 'Which court handles the initial trial of civil cases?',
  ['Civil Court', 'Criminal Court', 'Consumer Court', 'National Court'], 0,
  { explanation: 'Civil Courts primarily handle the initial trial of civil cases, dealing with disputes between individuals or organizations over contracts, property and personal rights.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'The State Judiciary (The Subordinate Courts)',
  chapterOrder: 6,
  label: 'ch06-the-state-judiciary-the-subordinate-courts.pdf',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
