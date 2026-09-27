// ICSE Class 10 History & Civics — Chapter 21: "The United Nations (Major
// Agencies and their Functions)". Uploaded 2026-09-17 as part of the
// combined chap_18-22.pdf, archived via archive-icse-history-ch18-22.js ->
// source_files.id 114 (this one physical file covers Chapters 18, 19, 20,
// 21 and 22 — the FINAL upload for this subject — see that script's header
// comment).
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch17-20): every printed answer checked
// against documented history/mandates of UNICEF, WHO and UNESCO.
//
// GENUINE DEFECT, FLAGGED needs_review and CORRECTED — item 4: the printed
// key answers "(d) Neither (a) nor (b)" for whether UNICEF encourages
// children to make greeting cards and/or raise funds through buying cards
// — but the item's own printed explanation directly contradicts this:
// "UNICEF has encouraged youngsters to produce and sell greeting cards in
// order to collect funding for the organisation's activities. Through the
// selling of UNICEF cards, it has been able to raise $100 million." This
// describes children being encouraged to make cards (statement a) and the
// card sales raising funds (statement b) — i.e., "Both (a) and (b)," which
// is offered verbatim as option (c). This also matches UNICEF's real,
// well-documented greeting card programme (running since 1949). Corrected
// to option (c), matching both the source's own explanation and
// documented history; the printed key's letter choice (d) is disclosed as
// the defect.
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

items.push(mcq(1, '238', 'The United Nations (UN) is associated with:',
  ['Maintaining peace', 'Social progress', 'Unrestrained freedom', 'All of these'], 3,
  { explanation: 'The United Nations (UN) is primarily concerned with maintaining world peace, promoting social progress and better standard of life with unrestrained freedom. It also strives to eradicate diseases and poverty from the world.' }));

items.push(mcq(2, '238', 'UNICEF stands for:',
  ['United Nations International Educational Fund', 'United Nations International Educational Force', 'United Nations International Emergency Force', "United Nations International Children's Emergency Fund"], 3,
  { explanation: 'UNICEF stands for "United Nations International Children\'s Emergency Fund" — the name under which it was founded in 1946 (it goes by "United Nations Children\'s Fund" today, but retains the original acronym).' }));

items.push(mcq(3, '238', 'The UNICEF is associated with:',
  ['Realization of the opportunity for every child.', 'Providing low community-based services.', 'Child health.', 'All of these'], 3,
  { explanation: 'The goal of UNICEF is the realisation of the opportunity for every child to enjoy the basic rights as a child by providing low cost community-based services in maternal and child health, nutrition, immunisation, etc.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '4',
  sourcePage: '238',
  text: 'The UNICEF encourages children to:',
  diagramStatus: 'not_applicable',
  answerStatus: 'needs_review',
  answerKeyRef: 'printed Ans., p.238, item 4',
  parts: [
    {
      text: 'Choose the correct option.',
      options: ['Make greeting cards.', 'Raise funds through buying cards.', 'Both (a) and (b)', 'Neither (a) nor (b)'],
      correct: 2,
      marks: 1,
    },
  ],
  explanation: 'CORRECTED FROM PRINTED KEY: the source prints "Ans. (d) Neither (a) nor (b)," but its own explanation directly contradicts this: "UNICEF has encouraged youngsters to produce and sell greeting cards in order to collect funding for the organisation\'s activities. Through the selling of UNICEF cards, it has been able to raise $100 million." This describes children being encouraged to make cards (statement a, true) and card sales raising funds (statement b, true) — i.e., "Both (a) and (b)," option (c). This also matches UNICEF\'s real, well-documented greeting card programme (running since 1949). Corrected to option (c); the printed key\'s letter choice (d) is disclosed as the defect.',
});

items.push(mcq(5, '238', 'The main functions of UNICEF include:',
  ['assisting countries in providing protective food.', 'assistant to women and pregnant mothers.', 'provide funds for training of health and sanitation workers and crèche workers.', 'all of the above'], 3,
  { explanation: 'The main functions of UNICEF include: to assist countries in providing protective food like milk, meat, fish, fats, etc. to the children and to train nutritionists. To take care of the women and pregnant mothers. To provide funds for training of health and sanitation workers and crèche workers.' }));

items.push(mcq(6, '239', 'UNICEF works to:',
  ['Provide clean drinking water in villages.', 'Provide basic education.', 'Provide instant help to children and women during a natural disaster.', 'All of the above'], 3,
  { explanation: 'Given below are some of the duties which UNICEF performs: To provide clean drinking water in villages, it supplies pumps and pipes to the countries. To provide basic education and supply paper to publish literature relating to children. To provide instant help to children and women during a natural disaster like an earthquake or an epidemic. To prevent exploitation of children and to protect them against neglect and abuse. To support AIDS education and help AIDS affected families and communities.' }));

items.push(mcq(7, '239', 'The four-point programme launched by UNICEF does not include:',
  ['Immunisation.', 'Oral rehydration.', 'Advocating breastfeeding.', 'Monitoring environmental degradation.'], 3,
  { explanation: 'UNICEF has launched a four point programme. This programme includes: immunisation, oral rehydration, advocating breastfeeding, and monitoring growth.' }));

items.push(mcq(8, '239', 'Child immunisation against preventable diseases by______was one of the leading goals of UNICEF.',
  ['1990', '2000', '2005', '1995'], 0,
  { explanation: 'Universal child immunisation against preventable diseases by 1990 was one of the leading goals of UNICEF.' }));

items.push(mcq(9, '239', 'In order to achieve the aim of "Health for all by the year 2000", the WHO adopted a global strategy which required efforts to be made in the fields of:',
  ['Primary healthcare', 'Clean drinking water', 'Nutrition', 'All of these'], 3,
  { explanation: 'In order to achieve the aim of "Health for all by the year 2000", the WHO adopted a global strategy which required efforts to be made in the fields of primary healthcare, clean drinking water, nutrition, sanitation and health education.' }));

items.push(mcq(10, '239', 'The WHO aims at:',
  ['Promoting and coordinating research in the field of health', 'Financing research projects in their priority areas', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'The WHO aims to: Promote and coordinate research in the field of health. To finance research projects in several priority areas.' }));

items.push(mcq(11, '240', 'The WHO aims to bring about improvement in standards of:',
  ['Nutrition', 'Housing', 'Sanitation', 'All of these'], 3,
  { explanation: 'The WHO aims to bring about improvement in standards of nutrition, housing, sanitation, and environmental hygiene.' }));

items.push(mcq(12, '240', 'The WHO monitors the outbreak of infectious diseases such as:',
  ['SARS', 'Malaria', 'AIDS', 'All of these'], 3,
  { explanation: 'The WHO aims to fight diseases throughout the world and tries to prevent their spread at the source. It has also launched the programme to immunise children against Measles, Diphtheria, Tetanus, Tuberculosis, Polio and Whooping Cough. It also monitors the outbreak of infectious diseases such as SARS, Malaria and AIDS.' }));

items.push(mcq(13, '240', 'Due to the efforts of WHO, which of the following has been eradicated?',
  ['AIDS', 'Malaria', 'Smallpox', 'None of these'], 2,
  { explanation: 'Due to the efforts of WHO, Smallpox has been eradicated. It has organised malaria and polio eradication programmes globally.' }));

items.push(mcq(14, '240', 'What is done by the WHO in order to inform people about the health programmes and to train the personnels in specified areas?',
  ['Organising movie shows', 'Publishing magazine and organising seminars', 'Conducting dance competitions', 'Sponsoring TV shows'], 1,
  { explanation: 'WHO publishes an illustrated magazine/journal to inform people about the state of health programmes. It organises seminars, conferences and workshops to train personnels in their areas of specialisation.' }));

items.push(mcq(15, '240', 'UNESCO declared the Year 1979 as:',
  ['The International Year of the Child', 'The International Year of the girl Child', 'The International Year of the Women', 'None of these'], 0,
  { explanation: 'The year 1979 was proclaimed as "The International Year of the Child".' }));

items.push(mcq(16, '240', 'The UNESCO contributes to peace and security in the world through:',
  ['Educational advancement.', 'Scientific development and technology.', 'Cultural interchange and preservation of cultural heritage.', 'All of the above'], 3,
  { explanation: 'UNESCO contributes to peace and security in the world through: Educational advancement. Scientific development and technology. Cultural interchange and preservation of cultural heritage.' }));

items.push(mcq(17, '240', 'Which of the following is/are the function(s) of UNESCO in the field of educational advancements?',
  ['To give advice and financial assistance for the education.', 'To work for universal primary education, distance education and open school system.', 'To give advice and expert assistance in school building construction.', 'All of the above'], 3,
  { explanation: "Main functions of UNESCO in the field of educational advancement are: To eliminate illiteracy through universal primary education, distance education, and open school systems, as well as adult education. In Rajasthan's Kaman Village, UNESCO and Lok Jumbish (an NGO) launched a scheme to assist disadvantaged children in gaining admission in neighbouring schools. To provide guidance and financial support for the education of disabled children, girls and women. To provide guidance and expert support in the construction of school buildings, the production of study courses and textbooks, and the promotion of science education through the establishment of regional training centres. To provide fellowships and study grants to instructors who wish to conduct research into teaching ideas and practises, as well as evaluation. For this reason, it has established an International Institute of Educational Planning in Paris. To hold book fairs at national and international level. To develop libraries with financial help. To promote education as an instrument for international understanding." }));

items.push(mcq(18, '241', 'The Delhi Public Library was established in:',
  ['1951', '1952', '1954', '1960'], 0,
  { explanation: 'The Delhi Public Library was established in 1951 with financial assistance from UNESCO.' }));

items.push(mcq(19, '241', 'UNESCO provides financial assistance and promote research in the field of:',
  ['Mathematics', 'Geology', 'Physics', 'All of these'], 3,
  { explanation: 'UNESCO provides financial assistance and promotes research in the field of mathematics, geology, physics, oceanography, engineering and technology in developing countries.' }));

items.push(mcq(20, '241', 'For the development of science and technology, UNESCO:',
  ['Organises seminars', 'Publishes bulletins, exhibitions and journals', 'Provides financial assistance', 'All of these'], 3,
  { explanation: 'For the development of science and technology, UNESCO: Provides financial assistance and promotes research in mathematics, geology, physics, oceanography, engineering and technology in developing countries. Organises seminars, regional and world conferences of scientists, engineers and technologists. Informs all countries about the progress in science through bulletins, exhibitions and journals. "Courier" is the official monthly magazine of UNESCO.' }));

items.push(mcq(21, '241', 'For cultural interchange and preservation of cultural heritage, UNESCO:',
  ['Helps member states to preserve their cultural heritage.', 'Encourages cultural exchange.', 'Encourages countries to buy books from other countries.', 'All of the above'], 3,
  { explanation: "For cultural interchange and preservation of cultural heritage, UNESCO: Helps member states preserve their cultural heritage, encourages translation of rare manuscripts, and also helps to protect monuments of historic or artistic interest. Encourages cultural exchange, it gives travel-grants to writers and artists under the project mutual appreciation of Eastern and Western Cultural Values. Encourages countries to buy books from other countries under its scheme of book coupons. Promotes artistic creation in literature and fine arts. Spreads and distributes knowledge about human rights. Undertakes projects in the field of mass communication like radio, television, films, news agencies etc." }));

items.push(mcq(22, '242', 'In which year was the UNICEF established?',
  ['1946', '1945', '1950', '1986'], 0,
  { explanation: 'It was established in 1946 to provide humanitarian aid and support to children and mother in post World War II Europe.' }));

items.push(mcq(23, '242', 'The WHO is made up of_________',
  ['World Health Assembly, Executive Board and The Secretariat', 'World Health Assembly, General Council and Secretariat', 'General Council, Security Council and Trusteeship Council', 'World Health Assembly, Economic Council and Social Council'], 0,
  { explanation: 'The WHO is made up of the World Health Assembly, Executive Board and the Secretariat, with the assembly serving as the supreme decision making body in matter of international Public health.' }));

items.push(mcq(24, '242', 'The WHO has its headquarter in_______',
  ['New York', 'Geneva', 'New Zealand', 'Belgium'], 1,
  { explanation: 'The WHO has its headquarters in Geneva, Switzerland, where it coordinates global efforts to address public health challenges and promote international health cooperation.' }));

items.push(mcq(25, '242', 'UNESCO came into existence on________and its headquarter is in________',
  ['4 Nov, 1946, Paris', '24 Oct,1945, New York', '7 Apr,1948,Geneva', '24 Oct, 1946, Geneva'], 0,
  { explanation: 'UNESCO came into existence on 4 November, 1946, headquartered in Paris. It leads international efforts in education, science, culture, and communication.' }));

items.push(mcq(26, '242', 'Which among the following is not a function of UNESCO?',
  ['Education', 'Science and Technology', 'Conservation of Cultural Heritage', 'Health Services'], 3,
  { explanation: 'Health services is not a function of UNESCO.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'The United Nations (Major Agencies and their Functions)',
  chapterOrder: 21,
  label: 'ch18-22-dictatorships-wwii-un-nam-final.pdf (Chapter 21 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
