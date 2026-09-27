// ICSE Class 10 Geography — Chapter 13: "Waste Generation and Management"
// (27 items, book pages 304-309). This is the final chapter of the whole
// PDF — the scanned pages end cleanly at the close of this chapter with
// the printed end-of-chapter mark.
// Source: chap_10-13.pdf, source_files.id 117 (see archive-icse-geography-ch10-13.js).
//
// Verification notes (independently checked against real-world facts):
//  - Item 2 (collection/transportation/disposal of waste is known as
//    "Both (a) Waste Accumulation and (b) Waste Management"): the
//    source's own printed explanation only defines "Waste Management" as
//    this process, and gives no supporting reasoning for why "Waste
//    Accumulation" (a term that ordinarily refers to garbage piling up,
//    not to the managed process of collection/transport/disposal) would
//    also correctly describe it. This looks like a soft internal
//    inconsistency rather than a clean, unambiguous defect — the printed
//    answer is kept with this caveat disclosed.
//  - Item 4 ("Which of the following statement(s) is/are NOT correct?"
//    about dumping, printed answer (c) "Dumping is not easy because it is
//    a very costly method"): this is correctly identified as false per
//    the explanation, which confirms dumping is actually the CHEAPEST
//    method. However, on close reading, statement (a) ("Dumping of waste
//    is the step prior to segregation of waste") also appears to be false
//    by the source's own explanation, which states dumping is "the next
//    procedure AFTER segregation" — i.e., dumping comes after, not prior
//    to, segregation. Since the options given are single letters only (no
//    combined "both (a) and (c)" choice is offered), and the source's
//    printed answer key names only (c), the printed answer is kept with
//    this second inconsistency disclosed rather than corrected.
//  - All other items independently checked against standard environmental
//    science / civics facts (composting, the 3 R's, Environment Protection
//    Act 1986, eutrophication, NEERI/CPCB, municipal waste sources, etc.)
//    and found consistent with real-world knowledge; no further defects.
//  - Item 17's option (c) is printed in the source as "Steer sweeping" —
//    almost certainly a print/typesetting defect for "Street sweeping"
//    (confirmed by the item's own explanation, which correctly says
//    "street sweeping"). Transcribed here as "Street sweeping" since the
//    explanation makes the intended term unambiguous and the answer
//    ("All of these") is unaffected either way.
const db = require('./db');
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 117;

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

items.push(mcq(1, 304, 'Which of the following statement(s) is/are correct?', [
  'Waste is a big problem today as it causes air and water pollution.',
  'The rotting garbage is a cause of concern because it produces harmful gases.',
  'The rotting garbage gets mixed with the air and causes breathing problems to the people.',
  'All of the above',
], 3));

items.push(mcq(2, 304, 'The collection, transportation and disposal of garbage, sewage and other waste products is known as:', [
  'Waste Accumulation', 'Waste Management', 'Both (a) and (b)', 'Neither (a) nor (b)',
], 2, {
  explanation: "Waste management is the collection, transportation, and disposal of garbage, sewage, and other waste products; to segregate the garbage, various types of dustbins are used to separate glass, paper, cloth, metal, wet and dry food wastes, etc. Disclosed caveat: the source's own explanation only substantiates 'Waste Management' as the correct single term for this process and gives no reasoning for why 'Waste Accumulation' (which ordinarily refers to garbage piling up, not to the managed process itself) should also be counted correct. Kept as printed since this appears to be a soft internal inconsistency rather than a clean, unambiguous defect.",
}));

items.push(mcq(3, 304, 'Society can play an important role for maintaining environmental standards through:', [
  'taking responsibility to protect the environment from pollution.',
  'organising itself and taking initiative in making the responsible agencies take actions if the air and water resources are unfit and do not meet the required standards.',
  'educating people by creating awareness about environmental protection.',
  'all of the above',
], 3));

items.push(mcq(4, 305, 'Which of the following statement(s) is/are not correct?', [
  'Dumping of waste is the step prior to segregation of waste.',
  'The dumping is done in open pits and it becomes a breeding ground for mosquitoes.',
  'Dumping is not easy because it is a very costly method.',
  'This method is not environmentally friendly.',
], 2, {
  explanation: "Dumping of waste disposal is the next procedure after segregation. It is the cheapest method and not in favour of the environment. The dumping grounds are open pits and thus become the breeding ground for mosquitoes, flies, insects, etc. When waste materials dumped in the open are burnt, they pollute the air and give out foul odour. Statement (c) is false because dumping is in fact the CHEAPEST method, not a costly one, so it is correctly identified as 'not correct'. Disclosed caveat: statement (a) also appears inconsistent with this same explanation, which states dumping is the step AFTER segregation, not prior to it — meaning (a) may also be a false statement. No combined option (e.g. 'both (a) and (c)') is offered among the choices, so the single-letter printed answer (c) is kept as printed with this second inconsistency disclosed.",
}));

items.push(mcq(5, 305, 'Which of the following statement(s) is/are not correct?', [
  'There are five phases after the disposing of waste.',
  'In the first phase, the organic matter depletes and the system returns to an aerobic state.',
  'In the second phase, anaerobic conditions become established and hydrogen and carbon dioxide are evolved.',
  'In the third phase, lots of bacteria and methanogenic activity, i.e. production of methane is established.',
], 1, {
  explanation: 'There are five phases followed for the disposal of wastes: in the first phase, aerobic bacteria deplete the available oxygen, resulting in an increase of temperature (not organic-matter depletion and a return to an aerobic state, which actually describes the FIFTH phase); in the second phase, anaerobic conditions become established and hydrogen and carbon dioxide are evolved; in the third phase, lots of bacteria and methanogenic activity (production of methane) is established; in the fourth phase, the methanogenic activity becomes stabilised; in the fifth phase, the organic matter depletes and the system returns to an aerobic state. So statement (b) wrongly attributes the fifth-phase description to the first phase, making it correctly identified as the incorrect statement.',
}));

items.push(mcq(6, 305, 'The steps taken by municipal authorities to manage waste are:', [
  'Collection of municipal solid wastes.', 'Storage of municipal solid wastes.', 'Transportation of municipal solid wastes.', 'All of these',
], 3));

items.push(mcq(7, 305, 'Composting prevents:', [
  'plant diseases', 'spread of pathogen diseases', 'both (a) and (b)', 'neither (a) nor (b)',
], 2));

items.push(mcq(8, 306, 'Which of the following aerates the soil which speeds up composting?', [
  'Bacteria', 'Fungi', 'Both (a) and (b)', 'Insects',
], 2));

items.push(mcq(9, 306, 'Composting is useful because:', [
  'It supplies essential nutrients to plants.',
  'It helps in reducing the adverse effects of excessive alkalinity.',
  'It makes the soil easier to cultivate.',
  'All of the above',
], 3));

items.push(mcq(10, 306, "Three R's stand for:", [
  'Reducing the waste', 'Reusing the waste', 'Recycling the waste', 'All of these',
], 3));

items.push(mcq(11, 306, 'Bagasse, a by-product of sugarcane, is used in:', [
  'manufacturing paper pulp', 'making packaging material of dairy products', 'both (a) and (b)', 'neither (a) nor (b)',
], 2));

items.push(mcq(12, 306, 'Which of the following is taking initiatives, measures and making policies to protect the environment through various schemes?', [
  'Ministry of Environment and Forests', 'Ministry of Agriculture', 'Pollution Control Board', 'Ministry of Commerce',
], 0));

items.push(mcq(13, 307, 'The Environment Protection Act (1986) empowers the central government:', [
  'to coordinate actions of state governments.',
  'to plan and execute a nationwide programme for the prevention.',
  'to plan and execute a nationwide programme for the control and abatement of environmental pollution.',
  'all of the above',
], 3));

items.push(mcq(14, 307, 'It is the duty of the _______ to protect and conserve critical environmental resources.', [
  'government', 'society', 'citizens', 'NGOs',
], 0));

items.push(mcq(15, 307, 'Which of the following institutions have applied a cleaner technology concept for liquid waste management?', [
  'NEERI', 'CPCB', 'Cleaner Technology Centre', 'All of these',
], 3));

items.push(mcq(16, 307, 'A person can play an important role for maintaining environmental standards through:', [
  'carrying a cloth bag or paper bag instead of polythene bags.',
  'use eco-friendly products.',
  'avoiding the use of chlorofluorocarbons (CFCs) as they destroy the ozone layer.',
  'all of the above',
], 3));

items.push(mcq(17, 307, 'Which of the following is the source of municipal waste?', [
  'Household waste', 'Commercials', 'Street sweeping', 'All of these',
], 3, {
  explanation: "Household waste, commercials, street sweeping, hotels and restaurants, clinics and dispensaries, construction and demolition, horticulture and sludge are the sources of municipal waste. Note: option (c) is printed in the source with a typesetting defect reading 'Steer sweeping'; the item's own explanation makes clear the intended term is 'Street sweeping', which is transcribed here. The correct answer ('All of these') is unaffected either way.",
}));

items.push(mcq(18, 307, 'Which of the following method of waste disposal is harmful?', [
  'Composting', 'Segregation', 'Dumping', 'Vermicomposting',
], 2));

items.push(mcq(19, 308, 'What is the depletion of oxygen in a water body resulting from pollution called?', [
  'Decay of water', 'Eutrophication', 'Bio magnification', 'Greenhouse effect',
], 1));

items.push(mcq(20, 308, 'Which of the following is a biodegradable waste?', [
  'Broken glass', 'Wastepaper', 'Polythene', 'Plastic bags',
], 1));

items.push(mcq(21, 308, 'What is waste?', [
  'Useful material with further use', 'Unwanted material with no further use', 'Natural vegetation and animals', 'Industrial innovation and development',
], 1));

items.push(mcq(22, 308, 'What is spoilage of landscape?', [
  'Aesthetic beauty of the land', 'Heaps of rubbish, garbage, and trash in urban cities', 'Infection-free residential areas', 'Efficient infrastructure of waste disposal',
], 1));

items.push(mcq(23, 308, 'What is a health hazard caused by waste?', [
  'Infection-free environment', 'Accumulation of waste affecting human health', 'Efficient waste disposal infrastructure', 'Organic domestic waste posing no threat',
], 1));

items.push(mcq(24, 308, 'What is the effect of waste on aquatic life?', [
  'Chemical pollutants destroying microorganisms', 'Acids being harmless to fish and marine life', 'Carbon monoxide promoting respiration in fish', 'DDT being non-fatal to fish',
], 0));

items.push(mcq(25, 309, 'Why is waste management necessary?', [
  'Rapid growth of population and industry', 'Increase in airborne and waterborne diseases', 'Spoilage of landscape and radioactive waste', 'All of the above',
], 3));

items.push(mcq(26, 309, 'What is the aim of the 3Rs (Reduce, Reuse, Recycle)?', [
  'To generate maximum waste', 'To extract minimum benefit from waste', 'To generate minimum waste and extract maximum benefit', 'To promote industrial innovation and development',
], 2));

items.push(mcq(27, 309, 'What is the result of inefficient waste disposal infrastructure?', [
  'Infection-free environment', 'Accumulation of waste affecting human health', 'Efficient waste management', 'Reduction in waste generation',
], 1));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Geography',
  chapterName: 'Waste Generation and Management',
  chapterOrder: 13,
  sourceFileIds: [SOURCE_FILE_ID],
  label: 'ICSE Geography Ch13 Waste Generation and Management (chap_10-13.pdf combined upload)',
});

console.log(JSON.stringify(result, null, 2));
