// ICSE Class 10 History & Civics — Chapter 4: "The Union Judiciary (The
// Supreme Court)". Uploaded 2026-09-17 as chap_4.pdf, archived via
// archive-icse-history-ch4.js -> source_files.id 105. Standing instruction:
// "now on till i dont change it will be icse 10 history chapter wise i will
// be uploading, make sure you feed in the system."
//
// Verification method (same as Ch1-3): every printed answer checked against
// actual Constitution of India provisions (Articles on the Supreme Court,
// Part V Chapter IV, Arts. 124-147) rather than re-derived by computation.
// Two disclosed, non-silent exceptions found — see explanations on items 2
// and 10 below, and the corresponding PROJECT_PROGRESS.md entry.
const { ingestQuestions } = require('./ingest');

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

items.push(mcq(1, '139', 'What is the total number of judges in the Supreme Court?',
  ['8', '30', '33', '34'], 3,
  { explanation: 'At the commencement of the Constitution there were 8 judges (including the Chief Justice). The sanctioned strength was raised over time by successive amending Acts and now stands at 34, including the Chief Justice of India (33 other judges + CJI), per the Supreme Court (Number of Judges) Amendment Act, 2019.' }));

items.push(mcq(2, '139', 'Who has the power to decide the number of judges in the Supreme Court?',
  ['The Chief Justice of Supreme Court', 'The Parliament', 'The President', 'The Law Ministry'], 1,
  { explanation: 'Under Article 124(1), Parliament may by law increase or decrease the number of Supreme Court judges. NOTE (disclosed, per source): the source\'s explanation states the Supreme Court "consists of the Chief Justice of India and not more than 30 other judges" — this reflects an older statutory ceiling. The current sanctioned strength, fixed by the Supreme Court (Number of Judges) Amendment Act, 2019, is 33 other judges plus the CJI (34 total, matching item 1 above). The printed answer to this question (Parliament holds the power) is correct and unaffected by the stale figure; only the illustrative number in the explanation is out of date.' }));

items.push(mcq(3, '139', 'Which of the following is not true about the eligibility of a Supreme Court Judge?',
  ['He must be a citizen of India.', 'He must have been a judge of one or more High Courts for ten successive years.', 'He must have been an advocate of one or more High Courts for ten successive years.', 'He must be a distinguished jurist in the opinion of the President.'], 1,
  { explanation: 'Article 124(3): eligibility is (a) citizen of India, and (b) a High Court judge for at least five years, or (c) a High Court advocate for at least ten years, or (d) a distinguished jurist in the President\'s opinion. Option (b) as stated ("ten successive years" for a judge) is the one that is NOT true — the constitutional requirement for a sitting/former High Court judge is five years, not ten.' }));

items.push(mcq(4, '139', 'Up to which age, a judge of the Supreme Court remains in office?',
  ['62 years', '65 years', '60 years', '67 years'], 1,
  { explanation: 'Article 124(2): a Supreme Court judge holds office until he attains the age of 65 years.' }));

items.push(mcq(5, '139', 'Which of the following statements is correct?',
  ['The President appoints the judges of the Supreme Court.', 'For appointing the judge of the Supreme Court the President consults the Union Council of Minister and the Chief Justice of India.', 'The seniority principle is followed in the appointment of the Chief Justice by the President.', 'All of the above'], 3,
  { explanation: 'Article 124(2): the President appoints Supreme Court judges after consultation with such judges of the Supreme Court and High Courts as the President deems necessary; by convention the Chief Justice is consulted, and by convention the senior-most judge is appointed as the next Chief Justice.' }));

items.push(mcq(6, '140', 'Who administers the oath of office to the judge of the Supreme Court?',
  ['The President', 'The Prime Minister', 'The Law Minister of India', 'None of these'], 0,
  { explanation: 'The oath of office and of secrecy is administered by the President of India (Article 124(6) and the Third Schedule).' }));

items.push(mcq(7, '140', 'The salaries of the Chief Justice and other judges of the Supreme Court are charged upon:',
  ['The Consolidated Fund of India', 'The Consolidated Fund of State', 'The Contingency Fund of India', 'None of these'], 0,
  { explanation: 'Salaries, allowances and pensions of Supreme Court judges are charged on the Consolidated Fund of India and are hence non-votable (not required to be debated and voted upon by Parliament each year).' }));

items.push(mcq(8, '140', 'Which of the following places is the seat of the Supreme Court?',
  ['New Delhi', 'Mumbai', 'Chennai', 'Kolkata'], 0,
  { explanation: 'Article 130: New Delhi is the seat of the Supreme Court, though it may sit at other places with the President\'s prior approval.' }));

items.push(mcq(9, '140', 'The Original Jurisdiction of the Supreme Court means:',
  ['Supreme Court to hear a case in the first instance directly.', 'Supreme Court to hear a case on appeal.', 'Both (a) and (b)', 'Neither (a) nor (b)'], 0,
  { explanation: 'Article 131: Original Jurisdiction is the authority of the Supreme Court to hear certain categories of disputes (e.g. Centre-State or inter-State disputes) in the first instance, directly, without the case coming to it on appeal.' }));

items.push(mcq(10, '140', 'In case of appellate jurisdiction, the Supreme Court can:',
  ['change the decision.', 'reduce the sentence.', 'both (a) and (b)', 'neither (a) nor (b)'], 0,
  { explanation: 'NEEDS_REVIEW (disclosed): the printed key marks (a) "change the decision" as correct, but the source\'s own explanation for this item states the Supreme Court "can change the decision OR reduce the sentence passed by the lower courts" — i.e. the explanation describes both actions as available under appellate jurisdiction, which would make (c) "both (a) and (b)" the internally consistent answer. This item is transcribed with the printed answer (a) unchanged, per this project\'s policy of never silently altering a marked answer; the discrepancy between the printed key and the printed explanation is disclosed here and in PROJECT_PROGRESS.md rather than resolved unilaterally.',
    answerStatus: 'needs_review',
    answerKeyRef: 'printed Ans., p.140, item 10 — DISCREPANCY: key marks (a) alone, but the source\'s own explanation text describes both (a) and (b) as available, which would support (c); see explanation.' }));

items.push(mcq(11, '140', 'The Supreme Court has very vast appellate jurisdiction because:',
  ['it can hear the cases of appeal from ordinary courts.', 'it can hear the cases of appeal from industrial courts.', 'it can hear the cases of appeal from election tribunals.', 'all of the above'], 3,
  { explanation: 'The Supreme Court\'s appellate jurisdiction (Articles 132-136) extends to appeals from ordinary courts, industrial courts/tribunals, election tribunals, and other quasi-judicial bodies (via the special leave to appeal under Article 136), with the constitutional exception of courts martial.' }));

items.push(mcq(12, '141', 'An appeal in the Supreme Court can be heard if:',
  ['it arises from any judgement/final order of the High Court.', 'it arises from any judgement/final order of the District Court.', 'it arises from any judgement/final order of the Munsif Court.', 'none of the above'], 0,
  { explanation: 'An appeal to the Supreme Court under Articles 132-134A lies from a judgement or final order of a High Court, typically where the High Court certifies that the case involves a substantial question of law as to the interpretation of the Constitution (or, in criminal matters, certain specified conditions).' }));

items.push(mcq(13, '141', 'Which of the following statement(s) is/are correct?',
  ['In criminal cases, appeal lies to the Supreme Court as a matter of right without a certificate of the High Court.', 'The accuse is found guilty and awarded death sentence.', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'Article 134(1)(a)-(b): in criminal cases, appeal lies to the Supreme Court as a matter of right (without a certificate of the High Court) where the High Court has, on appeal, reversed an order of acquittal and sentenced the accused to death, or has withdrawn a case from a subordinate court and itself convicted and sentenced the accused to death.' }));

items.push(mcq(14, '141', 'Which of the following Articles deal with the Advisory Jurisdiction of the Supreme Court?',
  ['Article 121', 'Article 143', 'Article 156', 'Article 160'], 1,
  { explanation: 'Article 143 empowers the President to seek the Supreme Court\'s opinion or advice on a question of law or fact of public importance (Advisory Jurisdiction).' }));

items.push(mcq(15, '141', 'The Supreme Court exercises its power of Judicial Review if:',
  ['any act or law violates any provision of the Constitution.', 'any act or law is not liked by the Chief Justice.', 'any act or law violates any provision of law made by earlier governments.', 'none of the above'], 0,
  { explanation: 'Judicial Review is the power of the courts (flowing from Articles 13, 32, 226 and 245 among others) to examine the constitutionality of legislative and executive acts and to declare them void if they violate any provision of the Constitution.' }));

items.push(mcq(16, '142', 'Which of the following writs can be issued by the Supreme Court?',
  ['Habeas Corpus', 'Mandamus', 'Prohibition', 'All of these'], 3,
  { explanation: 'Under Article 32, the Supreme Court can issue the writs of Habeas Corpus, Mandamus, Prohibition, Certiorari and Quo Warranto for the enforcement of Fundamental Rights (and, per Article 139, for other purposes as Parliament may provide).' }));

items.push(mcq(17, '142', 'A writ is issued by the Supreme Court:',
  ['to protect the Fundamental Rights or for any other purpose.', 'to any person or authority within the jurisdiction.', 'in grave cases where the subordinate tribunal acts without proper jurisdiction or in excess of it.', 'all of the above'], 3,
  { explanation: 'A writ is a legal instrument enforcing obedience to the orders of a court; the Supreme Court issues writs to protect Fundamental Rights or for other purposes, to any person or authority within its jurisdiction, and in grave cases where a subordinate tribunal has acted without jurisdiction or in excess of it — matching the printed answer of "all of the above." (The source\'s explanation additionally lists two further situations — natural-justice violations and errors of judgement — which are supplementary detail beyond the four listed options rather than a change to the correct option.)' }));

items.push(mcq(18, '142', 'Which of the following is correctly matched?',
  ['Habeas Corpus: You have the body', 'Mandamus: We Command', 'Certiorari: To be informed of what is going on', 'All of the above'], 3,
  { explanation: 'Habeas Corpus literally means "you may have the body"; Mandamus means "we command"; Certiorari (commonly rendered in textbooks as "to be certified"/"to be informed") is issued to be informed of the proceedings of a case — all three pairings are correct.' }));

items.push(mcq(19, '142', 'Which of the following is not correct about the writ of Mandamus?',
  ['Mandamus is a judicial remedy which is in the form of an order from a superior court to any lower court only.', 'It orders the public authority to perform its duties.', 'It is an order to forbear any authority from doing some specific act.', 'Mandamus means we command.'], 0,
  { explanation: 'Mandamus is not restricted to lower courts alone — it may be issued to any government, subordinate court, corporation or public authority, ordering it to perform its public duty or to forbear from doing a specific act. Statement (a), which limits it to "any lower court only," is therefore the incorrect statement.' }));

items.push(mcq(20, '143', 'Which of the following statements is not correct about the writ of Certiorari?',
  ['It means "We Command".', 'It can demand from the lower court to handover the record of a particular case to a higher Court after a decision or judgement in a lower court is made.', 'It aims at restraining the inferior courts from exceeding their jurisdiction.', 'All of the above'], 0,
  { explanation: '"We Command" is the meaning of Mandamus, not Certiorari. Certiorari means "to be informed of what is going on"; it is issued by a higher court to a lower court/tribunal to transfer the record of a case, and (along with Prohibition) restrains inferior courts/tribunals from exceeding their jurisdiction. Statement (a) is therefore the incorrect one.' }));

items.push(mcq(21, '143', 'Who settles the disputes between the union and the state regarding the division of powers?',
  ['The Parliament', 'The Supreme Court', 'The High Court', 'None of these'], 1,
  { explanation: 'Under its Original Jurisdiction (Article 131), the Supreme Court settles disputes between the Union and the States (or between States) regarding the division of powers and other matters.' }));

items.push(mcq(22, '143', 'The judiciary:',
  ['checks the arbitrariness of the government.', 'provides new meaning to the Constitution to meet the new situation.', 'maintains the supremacy of the Constitution.', 'all of the above'], 3,
  { explanation: 'The judiciary checks arbitrary action by the government, interprets the Constitution to meet changing circumstances, and upholds the supremacy of the Constitution — all three functions apply.' }));

items.push(mcq(23, '143', 'Which of the following has the power to hear appeals against the High Court?',
  ['The Supreme Court', 'The Law Ministry', 'The President', 'None of these'], 0,
  { explanation: 'Appeals against decisions of District Courts lie in the High Court, and appeals against decisions of the High Court can be filed in the Supreme Court.' }));

items.push(mcq(24, '143', 'The Supreme Court can transfer cases to itself if:',
  ['these involve questions of law.', 'these involve questions of great importance.', 'these involve interest of justice.', 'all of these'], 3,
  { explanation: 'Under Article 139A, the Supreme Court may transfer to itself cases pending before one or more High Courts that involve the same or substantially the same questions of law, are of general importance, or where transfer is necessary for the interest of justice.' }));

items.push(mcq(25, '143', "When the Supreme Court reviews any judgement made by it to remove an error, it falls under __ jurisdiction. [Board Question]",
  ['Advisory', 'Revisory', 'Original', 'Appellate'], 1,
  { explanation: 'Article 137 gives the Supreme Court power to review its own judgements/orders to correct an error — this is its Revisory Jurisdiction.' }));

items.push(mcq(26, '144', 'The Supreme Court of India has issued a writ of Habeas Corpus for an individual Y. What will be its effect?',
  ['Y has to be produced in the court before the judge', 'Y can be kept in preventive detention', 'Y will be handed over to the Central government', 'Nothing will change for Y'], 0,
  { explanation: 'A writ of Habeas Corpus requires the detaining authority to produce the detained person before the court, so that the legality of the detention can be examined.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '27',
  sourcePage: '144',
  text: 'Given below are details of a few Indian citizens. Select the person who fulfils the eligibility criteria to become a Judge of the Supreme Court:\n\nCandidate | Age | Other details\nW | 30 | Judge of a High Court for 3 years.\nX | 35 | Advocate of a High Court for 8 years.\nY | 40 | A distinguished jurist.\nZ | 38 | Mentally unsound.',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.144, item 27',
  parts: [
    {
      text: 'Which candidate fulfils the eligibility criteria to become a Judge of the Supreme Court?',
      options: ['W', 'X', 'Y', 'Z'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'Article 124(3): W (High Court judge for only 3 years) falls short of the 5-year requirement; X (High Court advocate for only 8 years) falls short of the 10-year requirement; Z is disqualified by unsoundness of mind. Y qualifies as a distinguished jurist in the opinion of the President, for which the Constitution prescribes no minimum-years requirement — matching the printed answer (c) Y.',
});

items.push({
  kind: 'case',
  sourceQuestionNumber: '28',
  sourcePage: '144',
  text: 'Identify the writs issued by the Supreme Court from the given options:\nP: Habeas Corpus\nQ: PIL\nR: Mandamus\nS: Lokpal',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.144, item 28',
  parts: [
    {
      text: 'Which of the following options lists only writs?',
      options: ['P and Q', 'R and S', 'P and R', 'Q and S'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'Habeas Corpus (P) and Mandamus (R) are constitutional writs under Article 32. PIL (Public Interest Litigation) is a procedural mechanism, not a writ, and Lokpal is an anti-corruption ombudsman institution, not a writ — so "P and R" is correct.',
});

items.push(mcq(29, '144', 'The Writ of Habeas Corpus:',
  ['Provides remedy to one who is unlawfully held in prison or in police custody', 'Compels an inferior Court or an individual to perform his/her duty', 'Prevents an inferior Court from exercising powers with which it is not legally vested.', 'Requires a Lower Court to hand over the record of a particular case to the higher court.'], 0,
  { explanation: 'The writ of Habeas Corpus is issued to release someone unlawfully detained, ensuring their right to freedom is protected. (Options (b), (c) and (d) describe Mandamus, Prohibition and Certiorari respectively.)' }));

items.push(mcq(30, '144', 'The power of the Supreme Court to review laws passed by Union Legislature falls under:',
  ['Revisory Jurisdiction', 'Advisory Jurisdiction', 'Original Jurisdiction', 'Judicial Review'], 3,
  { explanation: 'Judicial Review is the authority of the judiciary to examine the actions of the legislative, executive and administrative branches and to declare them unconstitutional where they violate the Constitution; this includes reviewing laws passed by the Union Legislature for conformity with the Constitution. (In its complete constitutional scope, Judicial Review also extends to State laws and executive action, not only Union legislation — this item frames one true instance of that broader power.)' }));

items.push(mcq(31, '144', 'Under what circumstances can the salaries and allowances of the Judges of the Supreme Court be reduced?',
  ['During a financial crisis', 'If the Parliament decides by a majority vote', 'During their term under normal conditions', 'During a declared financial emergency'], 3,
  { explanation: 'Article 125(2) proviso, read with Article 360: the salaries, allowances, privileges and rights of Supreme Court judges cannot be varied to their disadvantage except during a financial emergency proclaimed under Article 360, safeguarding judicial independence under normal circumstances.' }));

items.push(mcq(32, '145', "What is meant by 'Review of Judgments' by the Supreme Court?",
  ['The power to hear appeals from lower courts', 'The procedure to correct errors in its final judgments', 'The annual assessment of all lower court decisions', 'The power to change constitutional provisions'], 1,
  { explanation: "Article 137: 'Review of Judgments' refers to the Supreme Court's power to re-examine and, where a substantial error is discovered post-judgment, correct its own final judgments — its Revisory Jurisdiction." }));

items.push(mcq(33, '145', 'What legal tool does the Supreme Court use to enforce fundamental rights?',
  ['Writs', 'Public Interest Litigation', 'Ordinances', 'Government advisories'], 0,
  { explanation: 'Under Article 32, the Supreme Court enforces Fundamental Rights primarily through writs (Habeas Corpus, Mandamus, Prohibition, Certiorari and Quo Warranto).' }));

items.push(mcq(34, '145', 'How can a judge of the Supreme Court be removed?',
  ['By the President at will', 'By a majority vote in the Lok Sabha', 'Through impeachment by Parliament', 'By the Chief Justice of India'], 2,
  { explanation: 'Article 124(4): a Supreme Court judge can be removed only by an order of the President, passed after an address by each House of Parliament (a special majority) on grounds of proved misbehaviour or incapacity — commonly described as removal "through impeachment by Parliament."' }));

items.push(mcq(35, '145', 'What is the primary role of the Supreme Court of India?',
  ['To advise the President', 'To interpret and enforce the Constitution', 'To oversee elections', 'To manage state legislatures'], 1,
  { explanation: 'The Supreme Court\'s primary role is to interpret and enforce the Constitution, safeguarding Fundamental Rights and maintaining the constitutional balance of power among the organs of government.' }));

items.push(mcq(36, '145', "Under which circumstances can the Supreme Court use its 'Advisory Jurisdiction'?",
  ['When requested by the President of India', 'At the request of the Prime Minister', 'When lower courts are undecided', 'During national emergencies'], 0,
  { explanation: "Article 143: the Supreme Court exercises its Advisory Jurisdiction when the President seeks its opinion on a question of law or fact of public importance." }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'The Union Judiciary (The Supreme Court)',
  chapterOrder: 4,
  label: 'ch04-the-union-judiciary-the-supreme-court.pdf',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [105],
});

console.log(JSON.stringify(result, null, 2));
