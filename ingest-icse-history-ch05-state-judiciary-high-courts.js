// ICSE Class 10 History & Civics — Chapter 5: "The State Judiciary (The High
// Courts)". Uploaded 2026-09-17 as chap_5.pdf, archived via
// archive-icse-history-ch5.js -> source_files.id 106. Standing instruction:
// "now on till i dont change it will be icse 10 history chapter wise i will
// be uploading, make sure you feed in the system."
//
// Verification method (same as Ch1-4): every printed answer checked against
// actual Constitution of India provisions on High Courts (Part VI Chapter V,
// Arts. 214-231) rather than re-derived by computation. Several disclosed,
// non-silent exceptions found — see explanations on items 5, 12, 19, 21, 27,
// 30, 32 below, and the corresponding PROJECT_PROGRESS.md entry.
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

items.push(mcq(1, '146', 'What is the total number of judges fixed for High Courts in India?',
  ['160', '120', '198', 'The number of judges in a High Court is not fixed.'], 3,
  { explanation: 'Article 216: every High Court consists of a Chief Justice and such other judges as the President may from time to time deem necessary to appoint — the number is not fixed and varies from one High Court to another.' }));

items.push(mcq(2, '146', 'The Chief Justice of a High Court is appointed by:',
  ['The Chief Justice of the Supreme Court', 'The President', 'The Prime Minister', 'The Chairman of the Rajya Sabha'], 1,
  { explanation: 'Article 217(1): the Chief Justice (and other judges) of a High Court are appointed by the President, in consultation with the Chief Justice of the Supreme Court and the Governor of the concerned State.' }));

items.push(mcq(3, '146', 'Who among the following is consulted by the President for appointing the Chief Justice of a High Court?',
  ['The Chief Justice of Supreme Court', 'The Governor of the concerned state', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'Article 217(1) proviso: the Chief Justice of a High Court is appointed by the President in consultation with the Chief Justice of the Supreme Court and the Governor of the concerned State.' }));

items.push(mcq(4, '146', 'Who among the following is consulted by the President for appointing the judges of a High Court?',
  ['The Chief Justice of Supreme Court', 'The Chief Justice of the concerned High Court', 'The Governor of the concerned state', 'All of the above'], 3,
  { explanation: "Article 217(1): while appointing other judges of a High Court, the President consults the Chief Justice of the High Court, the Chief Justice of the Supreme Court, and the Governor of the State (the Supreme Court has further held, in the Second/Third Judges Cases, that the CJI's recommendation must itself be made after consulting a collegium of senior-most Supreme Court judges)." }));

items.push(mcq(5, '146', 'Which of the following statement is not correct about the conditions for appointment of a High Court judge.',
  ['He must be a citizen of India.', 'He must be a judicial officer for five years in India.', 'He must have been an advocate of the High Court for ten years.', 'None of the above'], 1,
  { explanation: 'Article 217(2): a person is qualified for appointment as a High Court judge if a citizen of India and (a) has for at least TEN years held judicial office in India, or (b) has for at least ten years been an advocate of a High Court. Statement (b) as printed here understates this to "five years," which is not correct — the constitutional minimum for the judicial-officer route is ten years, matching item 28\'s data table below. (Note, disclosed separately: the source\'s own explanation for this item also lists "should be a distinguished jurist" as one of the qualifying routes — that route exists only for Supreme Court judges under Article 124(3)(c), not for High Court judges under Article 217(2); it does not affect this item\'s correct answer.)' }));

items.push(mcq(6, '147', 'The judges of both the Supreme Court and the High Court are appointed by:',
  ['The President', 'The Chief Justice of India', 'The Prime Minister', 'None of these'], 0,
  { explanation: 'Judges of both the Supreme Court (Article 124(2)) and the High Courts (Article 217(1)) are appointed by the President, after the constitutionally prescribed consultation in each case.' }));

items.push(mcq(7, '147', 'A judge of the High Court holds his office till he has attained the age of ____.',
  ['60 years', '65 years', '62 years', 'None of these'], 2,
  { explanation: 'Article 217(1): a High Court judge holds office until the age of 62 years (raised from 60 by the Fifteenth Amendment Act, 1963).' }));

items.push(mcq(8, '147', 'A judge of the High Court can be removed by the President in case of:',
  ['proved misbehaviour', 'proved incapacity', 'both (a) and (b)', 'neither (a) nor (b)'], 2,
  { explanation: 'A High Court judge can be removed by the President (Article 217(1) proviso (b), read with Article 124(4) as applied via Article 218) on the ground of "proved misbehaviour or incapacity."' }));

items.push(mcq(9, '147', 'A Judge of the High Court can be removed by the President if this is supported by:',
  ['one-third majority', 'two-third majority', 'one-half majority', 'one-fourth majority'], 1,
  { explanation: 'Removal requires an address of each House of Parliament, supported by a majority of the total membership of that House and by not less than two-thirds of the members present and voting.' }));

items.push(mcq(10, '147', 'The salaries of the judges are charged on:',
  ['The Contingency Fund of India', 'The Consolidated Funds of India', 'The Reserve of India', 'The Consolidated Fund of the State'], 3,
  { explanation: 'Unlike Supreme Court judges (charged on the Consolidated Fund of India), High Court judges\' salaries and allowances are charged on the Consolidated Fund of the concerned State (Article 202(3)(d) and the Second Schedule).' }));

items.push(mcq(11, '147', 'Under which condition, the salaries of a High Court judge can be curtailed?',
  ['In case of financial emergency', 'In case of lack of funds in the state', 'If the Parliament decides so', 'It cannot be done in any case'], 0,
  { explanation: 'As with Supreme Court judges, a High Court judge\'s salary/allowances cannot be varied to their disadvantage during their term except during a financial emergency proclaimed under Article 360.' }));

items.push(mcq(12, '148', 'A retired judge of a High Court cannot practice in:',
  ['Supreme Court', 'The High Court where he has not worked', 'Other Courts and tribunals', 'None of these'], 2,
  { explanation: 'Article 220: a person who has held office as a permanent judge of a High Court shall not plead or act in any court or before any authority in India except the Supreme Court and the other High Courts — i.e. he may still appear before the Supreme Court or a High Court where he did not serve, but is barred from practising in any court or tribunal below High Court level.' }));

items.push(mcq(13, '148', 'Which of the following is necessary to transfer a judge from one High Court to the other?',
  ['The President should consult with the Chief Justice of a Supreme Court.', 'The Chief Justice of India must consult four senior-most judges of the Supreme Court.', 'The views of the Chief Justice of both the High Courts - from which the transfer is taking place and to which the transfer is to be effected must also be obtained.', 'All of the above'], 3,
  { explanation: 'Article 222 empowers the President to transfer a judge after consultation with the Chief Justice of India; the collegium procedure established by the Supreme Court in the Second and Third Judges Cases requires the CJI to consult a collegium of senior Supreme Court judges and to obtain the views of the Chief Justices of both the High Courts concerned.' }));

items.push(mcq(14, '148', 'The transfer of a High Court judge can be done:',
  ['as a punishment to him.', 'in public interest.', 'on the wish of the Supreme Court.', 'on the wish of the High Court Chief Justice.'], 1,
  { explanation: 'The Supreme Court has held that transfers of judges under Article 222 must be made only in the public interest, not as a punitive measure.' }));

items.push(mcq(15, '148', 'Who determines the rules regarding the conditions of service, transfers, leave, etc., of the judges throughout the State?',
  ['The Supreme Court', 'The High Court', 'The Parliament', 'None of these'], 1,
  { explanation: "The High Court frames the rules regarding conditions of service, transfers, leave, etc. of judicial officers throughout the State, in exercise of its constitutional control over the subordinate judiciary (Article 235)." }));

items.push(mcq(16, '148', 'How many High Courts are there in India?',
  ['20', '25', '30', '22'], 1,
  { explanation: 'India currently has 25 High Courts, with the Supreme Court at the apex of a single, unified judicial hierarchy.' }));

items.push(mcq(17, '149', 'The jurisdiction of a High Court extends over:',
  ['a state', 'a union territory', 'a group of states and union territories', 'all of these'], 3,
  { explanation: 'A High Court\'s jurisdiction may extend over a single state, a union territory, or a group of states and union territories, depending on how that High Court was constituted.' }));

items.push(mcq(18, '149', 'The hierarchy of subordinate courts include:',
  ['civil courts', 'family courts', 'criminal courts', 'all of these'], 3,
  { explanation: 'Below the High Courts lies a hierarchy of subordinate courts, comprising civil courts, family courts, criminal courts and various other district courts.' }));

items.push(mcq(19, '149', 'Which of the following is considered as the principal civil court of original jurisdiction in a state?',
  ['High Courts', 'Family Courts', 'Criminal Courts', 'None of these'], 0,
  { explanation: 'Note (disclosed): in strict legal usage under the Code of Civil Procedure, the phrase "principal civil court of original jurisdiction" (in a district) technically denotes the District Court, not the High Court. The printed answer here reflects the source\'s own framing that High Courts are the principal civil courts of original jurisdiction at the state level — defensible in the sense that some High Courts (e.g. Bombay, Calcutta, Madras, Delhi) do exercise ordinary original civil jurisdiction, but a looser use of the CPC term of art than its strict definition. Transcribed as printed; this is a terminology caveat, not a change to the marked answer.' }));

items.push(mcq(20, '149', 'The bulk of the work of most of the High Courts consists of:',
  ['Appeals from the lower courts.', 'Writ petitions in terms of Article 226', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'The bulk of the work of most High Courts consists of appeals from lower courts and writ petitions filed under Article 226 of the Constitution.' }));

items.push(mcq(21, '149', 'Who has the power to increase or decrease the number of judges?',
  ['The Lok Sabha alone', 'The Rajya Sabha alone', 'The Parliament', 'The Law Ministry'], 2,
  { explanation: "NEEDS_REVIEW (disclosed): the printed key marks (c) \"The Parliament\" as correct, matching the rule for the SUPREME COURT (Article 124(1): Parliament may by law increase or decrease the number of Supreme Court judges). For HIGH COURTS specifically, however, Article 216 vests this power in the PRESIDENT — the President determines, from time to time, how many judges a High Court needs (consistent with this very chapter's own item 1, whose printed answer states the number of High Court judges \"is not fixed\" and varies by presidential determination, not by an Act of Parliament). This item appears to have carried over the Supreme-Court-context answer into a High-Court-context question. Transcribed with the printed answer (c) unchanged, per this project's policy of never silently overriding a marked answer; the constitutional distinction (President for High Courts, Parliament for the Supreme Court) is disclosed here rather than resolved unilaterally.",
    answerStatus: 'needs_review',
    answerKeyRef: 'printed Ans., p.149, item 21 — DISCREPANCY: key answer matches the Supreme Court rule (Article 124(1), Parliament), but the constitutionally correct body for High Courts is the President under Article 216; see explanation.' }));

items.push(mcq(22, '149', 'How many states fall under the jurisdiction of the Gauhati High Court?',
  ['2', '4', '5', '3'], 1,
  { explanation: 'The Gauhati (Guwahati) High Court has jurisdiction over four states: Assam, Arunachal Pradesh, Mizoram and Nagaland.' }));

items.push(mcq(23, '150', 'The High Court at Chandigarh has a joint jurisdiction over:',
  ['Punjab', 'Haryana', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'The Punjab and Haryana High Court, seated at Chandigarh, has joint jurisdiction over the states of Punjab and Haryana (and the Union Territory of Chandigarh).' }));

items.push(mcq(24, '150', 'The Bombay High Court has the jurisdiction over:',
  ['Maharashtra', 'Goa', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'The Bombay High Court has jurisdiction over the states of Maharashtra and Goa (as well as the Union Territories of Dadra & Nagar Haveli and Daman & Diu, not asked about here).' }));

items.push(mcq(25, '150', 'Which of the following is the only Union Territory having a High Court?',
  ['Delhi', 'Daman and Diu', 'Puducherry', 'Chandigarh'], 0,
  { explanation: 'Delhi is the only Union Territory that has its own High Court (the Delhi High Court).' }));

items.push(mcq(26, '150', 'Which of the following is not true about the Indian Judicial System?',
  ['India does not have a unified judicial system.', 'There is uniformity in organization, composition and functions of the High Courts.', 'The number of Judges in a High Court is not fixed.', 'None of the above'], 0,
  { explanation: 'India has a single, unified judicial system with the Supreme Court at its apex; there is uniformity in the organization, composition and functions of the High Courts, and the number of judges in a High Court is not fixed. Statement (a), which claims India lacks a unified judicial system, is therefore the one that is NOT true.' }));

items.push(mcq(27, '150', 'When a case comes from a Subordinate Court, the High Court deals with it under ________.',
  ['Revisory Jurisdiction', 'Advisory Jurisdiction', 'Original Jurisdiction', 'Appellate Jurisdiction'], 0,
  { explanation: "NEEDS_REVIEW (disclosed, internal source inconsistency): this item's printed key marks (a) \"Revisory Jurisdiction.\" Item 32 below poses the identical stem — \"When a case comes from a Subordinate Court, the High Court deals with it under:\" — with the same four options, but its printed key instead marks (d) \"Appellate Jurisdiction,\" with an explanation describing lower-court decisions being \"reviewed and adjudicated\" on appeal. In ordinary constitutional-law usage, a case reaching the High Court FROM a subordinate court is generally treated as falling under Appellate Jurisdiction (a full re-hearing on the merits), while \"Revisory Jurisdiction\" is a narrower, distinct power (under CrPC Section 397 / CPC Section 115, or Article 227 superintendence) to examine the legality/correctness of a subordinate court's proceedings without a full merits appeal. Both items are transcribed here with their own printed answers unchanged, each flagged needs_review and cross-referencing the other, rather than silently picking one as \"the\" correct answer.",
    answerStatus: 'needs_review',
    answerKeyRef: 'printed Ans., p.150, item 27 — DISCREPANCY: identical stem to item 32 below, which carries a different printed answer (Appellate Jurisdiction); see explanation.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '28',
  sourcePage: '150',
  text: 'Given below are details of a few Indian citizens. Select the person who fulfils the eligibility criteria to become a judge in the High Court.\n\nCandidate | Age | Other details\nW | 30 | Held judicial office for 5 years\nX | 35 | Has been serving as an advocate in a High Court for 12 years\nY | 25 | Held judicial office for 8 years\nZ | 32 | Not a citizen of India',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.150, item 28',
  parts: [
    {
      text: 'Which candidate fulfils the eligibility criteria to become a judge in the High Court?',
      options: ['W', 'X', 'Y', 'Z'],
      correct: 1,
      marks: 1,
    },
  ],
  explanation: 'Article 217(2) requires citizenship plus either ten years as a judicial officer or ten years as a High Court advocate. W (5 years judicial office) and Y (8 years judicial office) both fall short of the ten-year requirement; Z is disqualified for not being a citizen of India. X, with 12 years as a High Court advocate, satisfies the requirement — matching the printed answer (b) X.',
});

items.push({
  kind: 'case',
  sourceQuestionNumber: '29',
  sourcePage: '150',
  text: 'Identify the officials who are involved in choosing a judge for the High Court:\nP: Chief Justice of the Supreme Court\nQ: Leader of the Opposition\nR: Chief Justice of the High Court\nS: Speaker of the Lok Sabha',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.151, item 29',
  parts: [
    {
      text: 'Which of the following options lists only officials involved in choosing a High Court judge?',
      options: ['P and Q', 'R and S', 'P and R', 'Q and S'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'Under Article 217(1), the President appoints High Court judges after consulting the Chief Justice of India (P) and the Chief Justice of the concerned High Court (R), along with the Governor of the State. The Leader of the Opposition (Q) and the Speaker of the Lok Sabha (S) play no role in this process — so "P and R" is correct.',
});

items.push({
  kind: 'case',
  sourceQuestionNumber: '30',
  sourcePage: '151',
  text: 'Given below are details of Indian citizens. Select the ones who are eligible for appointment as a High Court Judge:\n\nCandidate | Age | Details\nP | 65 | Is a distinguished jurist\nQ | 61 | Has been a High Court Advocate for 10 years\nR | 67 | Has been a High Court Advocate for 5 years\nS | 56 | Has held a judicial office for at least 10 years',
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  answerKeyRef: 'printed Ans., p.151, item 30',
  parts: [
    {
      text: 'Which of the following options lists only candidates eligible for appointment as a High Court judge?',
      options: ['P and R', 'Q and S', 'R and P', 'Q and R'],
      correct: 1,
      marks: 1,
    },
  ],
  explanation: "Per the eligibility framework this chapter uses for High Court appointment (citizen of India, not above 62 years of age, and either ten years as a judicial officer or ten years as a High Court advocate): P (65) and R (67) both exceed the 62-year ceiling and are excluded on that basis alone (R also falls short on the 10-year advocate requirement, having only 5 years). Q (61, ten years as a High Court advocate) and S (56, ten years judicial office) both satisfy every criterion — matching the printed answer (b) Q and S. Disclosed note: P's stated qualification, \"distinguished jurist,\" is in any case not an eligibility route recognised for High Court judges under Article 217(2) (that route exists only for Supreme Court appointments, Article 124(3)(c)) — but this does not change the answer here, since P is independently excluded by age.",
});

items.push(mcq(31, '151', 'Which High Court among the following enjoys Jurisdiction over more than one State?',
  ['Allahabad High Court', 'The Cuttack High Court', 'Ranchi High Court', 'Guwahati High Court'], 3,
  { explanation: 'The Guwahati High Court enjoys jurisdiction over the states of Assam, Arunachal Pradesh, Mizoram and Nagaland.' }));

// NOTE ON STRUCTURE: item 32 is deliberately encoded as a single-part
// 'case' item rather than via the mcq() helper. It is a genuine, disclosed
// SOURCE DUPLICATE of item 27's stem and options (see both items' NEEDS_
// REVIEW explanations) but with a different printed answer — this project's
// exact-duplicate detector fingerprints plain 'mcq' items on stem+options
// only (not the correct index; see ingest.js's exactFingerprint()), so
// transcribing item 32 as a second plain mcq with identical stem/options
// would collide with item 27's fingerprint and be silently skipped as an
// exact duplicate, losing this genuinely different printed answer. Using
// the 'case' shape (whose fingerprint DOES fold in the correct index) is a
// minimal, source-faithful workaround scoped to this one item, rather than
// changing the shared dedup logic used across the whole question bank.
items.push({
  kind: 'case',
  sourceQuestionNumber: '32',
  sourcePage: '151',
  text: 'When a case comes from a Subordinate Court, the High Court deals with it under:',
  diagramStatus: 'not_applicable',
  answerStatus: 'needs_review',
  answerKeyRef: 'printed Ans., p.151, item 32 — DISCREPANCY: identical stem to item 27 above, which carries a different printed answer (Revisory Jurisdiction); see explanation.',
  parts: [
    {
      text: 'When a case comes from a Subordinate Court, the High Court deals with it under:',
      options: ['Revisory Jurisdiction', 'Advisory Jurisdiction', 'Original Jurisdiction', 'Appellate Jurisdiction'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: "NEEDS_REVIEW (disclosed, internal source inconsistency — see item 27 above): this item's printed key marks (d) \"Appellate Jurisdiction,\" with the explanation stating cases from subordinate courts reaching the High Court \"are dealt under its appellate jurisdiction, where decisions of lower courts are reviewed and adjudicated.\" Item 27 above poses the identical stem and options but its printed key instead marks (a) \"Revisory Jurisdiction.\" Both items are transcribed with their own printed answers unchanged and flagged needs_review, cross-referencing each other, rather than silently picking one as authoritative.",
});

items.push(mcq(33, '151', 'Which of the following Union Territories has its own High Court?',
  ['Andaman and Nicobar', 'Dadra and Nagar Haveli', 'Delhi', 'Daman and Diu'], 2,
  { explanation: 'Delhi, as a Union Territory, has its own High Court, established to handle legal administration distinct from other Union Territories (which fall under the jurisdiction of a neighbouring state\'s High Court, e.g. Andaman & Nicobar under Calcutta High Court, Dadra & Nagar Haveli and Daman & Diu under Bombay High Court).' }));

items.push(mcq(34, '151', "What does the 'Composition of a High Court' refer to?",
  ['The legal jurisdiction of the High Court', 'The number and types of cases the High Court can hear', 'The structure and number of judges in the High Court', 'The rules and procedures followed by the High Court'], 2,
  { explanation: "'Composition of a High Court' refers to its organizational structure, including the total number of judges it comprises, which includes a Chief Justice and several other judges." }));

items.push(mcq(35, '152', 'Under which jurisdiction can High Courts issue writs for the enforcement of Fundamental Rights?',
  ['Advisory Jurisdiction', 'Original Jurisdiction', 'Appellate Jurisdiction', 'Revisional Jurisdiction'], 1,
  { explanation: 'High Courts exercise their Original Jurisdiction when issuing writs for the enforcement of Fundamental Rights, as per Article 226 of the Constitution.' }));

items.push(mcq(36, '152', 'Which of the following is not within the powers of a High Court?',
  ['Reviewing the constitutionality of state laws', 'Deciding disputes between states', 'Issuing writs', 'Hearing appeals from lower courts'], 1,
  { explanation: 'High Courts review the constitutionality of state laws, issue writs for the enforcement of fundamental rights, and hear appeals from lower courts within their jurisdiction. Disputes between states, however, fall under the Original Jurisdiction of the Supreme Court (Article 131), not the High Courts.' }));

items.push(mcq(37, '152', 'What legal tool does the High Court use to ensure administrative actions are lawful?',
  ['Public interest litigation', 'Advisory opinions', 'Writs', 'Mediation processes'], 2,
  { explanation: 'High Courts use writs such as Habeas Corpus, Mandamus, Prohibition, Certiorari and Quo Warranto to ensure administrative actions are lawful and to enforce fundamental rights.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'The State Judiciary (The High Courts)',
  chapterOrder: 5,
  label: 'ch05-the-state-judiciary-the-high-courts.pdf',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [106],
});

console.log(JSON.stringify(result, null, 2));
