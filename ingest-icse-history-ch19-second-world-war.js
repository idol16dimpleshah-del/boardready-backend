// ICSE Class 10 History & Civics — Chapter 19: "The Second World War".
// Uploaded 2026-09-17 as part of the combined chap_18-22.pdf, archived via
// archive-icse-history-ch18-22.js -> source_files.id 114 (this one
// physical file covers Chapters 18, 19, 20, 21 and 22 — the FINAL upload
// for this subject — see that script's header comment).
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch17-18): every printed answer checked
// against well-documented world history of WWII's causes, course, and
// immediate aftermath (the Munich Agreement, the invasion of Poland,
// Pearl Harbor, the atomic bombings, and the founding of the UN).
//
// DISCLOSED MINOR CAVEAT — item 7: the printed key answers "All of these"
// (Britain, France, U.S.A.) for which countries forced Germany to sign the
// Treaty of Versailles. The USA participated in the Paris Peace Conference
// negotiations (President Wilson was a key architect of the League of
// Nations proposal) but never ratified or became a bound party to the
// Treaty of Versailles itself — the U.S. Senate rejected it, and the U.S.
// separately signed the Treaty of Berlin with Germany in 1921 (consistent
// with this same subject's Ch17 item 27, on the U.S. not joining the
// League of Nations for the identical reason). A common textbook
// simplification, kept as printed.
//
// GENUINE DEFECT, FLAGGED needs_review — item 15: option (c), "Due to
// isolation, the Germans living in East Prussia were being slaughtered by
// the Polish Jews," reproduces a Nazi-era propaganda claim rather than
// documented history. Transcribed verbatim (this project transcribes
// source text faithfully rather than silently rewriting it), but this
// specific framing is factually false and should not be read as a real
// historical cause: it echoes the fabricated/exaggerated persecution
// narratives (including staged incidents such as the Gleiwitz incident)
// that the Nazi regime used to manufacture a pretext for invading Poland,
// and its specific blaming of "Polish Jews" is an antisemitic invention,
// not a documented event. The genuinely documented sources of German-
// Polish tension over the Corridor were territorial and administrative —
// the region had been part of Germany before the Treaty of Versailles
// transferred it to Poland to grant Poland sea access, and it physically
// separated East Prussia from the rest of Germany (options a and b,
// which are historically accurate). The printed answer, "All of the
// above," is kept per source for transcription fidelity, but option (c)'s
// specific claim is disclosed here as propaganda, not fact, and should not
// be treated as a legitimate historical justification for Hitler's
// demands or the subsequent invasion.
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

items.push(mcq(1, '228', 'In which year Fascism came to an end in Italy?',
  ['1945', '1943', '1946', '1941'], 1,
  { explanation: 'Italy joined the World War II against Britain and France, and was defeated in 1943 AD. With it, Fascism (Mussolini\'s original government) also came to an end. Rome was conquered by the Allies in 1944 AD.' }));

items.push(mcq(2, '228', 'In which year, Germany surrendered in the Second World War?',
  ['1943 AD', '1944 AD', '1945 AD', '1942 AD'], 2,
  { explanation: 'Germany surrendered in 1945 AD. Hitler is said to have committed suicide, and with his death, Nazism and Nazi dictatorial regime also came to an end.' }));

items.push(mcq(3, '228', 'The Second World War started after ....................... from the First World War.',
  ['Twenty years nine months', 'Thirty years nine months', 'Twenty years two months', 'Twenty years eleven months'], 0,
  { explanation: 'The Second World War started after twenty years nine months from the First World War (the Armistice of 11 November 1918 to the invasion of Poland on 1 September 1939). It was a global military conflict which involved a majority of the world\'s nations, including all the great powers.' }));

items.push(mcq(4, '228', 'The Second World War is considered as the most widespread war in history because:',
  ['It involved the mobilisation of over 300 million military personnel.', 'It involved the mobilisation of all the world leaders.', 'It involved the mobilisation of over 500 million military personnel.', 'It involved the mobilisation of over 100 million military personnel.'], 3,
  { explanation: 'The Second World War is considered as the most widespread war in history because it involved the mobilisation of over 100 million military personnel.' }));

items.push(mcq(5, '228', 'Which of the following were Allies in the World War-II?',
  ['Britain', 'France', 'Some other 80 nations', 'All of these'], 3,
  { explanation: 'Germany, Italy and Japan were the Axis Powers in the World War-II, while Britain, France and other 80 countries were Allied Powers.' }));

items.push(mcq(6, '229', 'Some of the outcomes of the World War-II were:',
  ['Inflation', 'Epidemics', 'Food shortages', 'All of these'], 3,
  { explanation: 'After the Second World War, the Inflation pushed up prices. The world also witnessed the spread of epidemics, scarcity of food, clothing and shelter. It caused untold suffering, misery and death to a large number of people, all over the world.' }));

items.push(mcq(7, '229', 'Which of the following countries forced Germany to sign the Treaty of Versailles?',
  ['Britain', 'France', 'U.S.A.', 'All of these'], 3,
  { explanation: 'The victors of the First World War, i.e. Britain, France and the U.S.A., are credited here with forcing Germany to sign the unjust and humiliating Treaty of Peace, i.e. the Treaty of Versailles. DISCLOSED CAVEAT: the U.S. took part in negotiating the Treaty at the Paris Peace Conference, but the U.S. Senate later refused to ratify it, and the U.S. never became a bound party to it — it signed a separate peace treaty (the Treaty of Berlin) with Germany in 1921 instead (see this subject\'s Ch17 item 27, on the same reason the U.S. did not join the League of Nations). A common textbook simplification, kept as printed.' }));

items.push(mcq(8, '229', 'The Treaty of Versailles forced Germany:',
  ['To surrender large chunks of her territories.', 'To abstain from re-arming herself.', 'To limit army up to 1 lakh only.', 'All of the above'], 3,
  { explanation: 'The Treaty of Versailles is considered humiliating because: It imposed heavy war penalties on Germany. It made her surrender large chunks of her territories like Saar, Rhineland, Ruhr area, etc. and some parts of her foreign colonies. It also prohibited Germany from re-arming herself. The German army was disbanded beyond a limit of one lakh soldiers.' }));

items.push(mcq(9, '229', 'The heads of four nations – Germany, Italy, Britain and France met at Munich on:',
  ['September 04, 1938', 'September 29, 1939', 'September 29, 1940', 'September 29, 1938'], 3,
  { explanation: 'Britain and France did not care to enforce the terms of the Treaty of Versailles, when Hitler started to flout it openly. The heads of four nations - Germany, Italy, Britain and France met at Munich on September 29, 1938 and decided to hand over Sudetenland to Germany.' }));

items.push(mcq(10, '229', 'Which of the following was a major cause behind the outbreak of the Second World War?',
  ['Rise of Fascism in Italy', 'Rise of Nazism in Germany', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'Rise of Fascism in Italy under Mussolini and Nazism in Germany under Hitler was one of the major factors responsible for the Second World War.' }));

items.push(mcq(11, '229', 'The rise of Fascism and Nazism in Italy and Germany respectively led to the start of the Second World War because:',
  ['They were against democracy.', 'They followed aggressive nationalism.', 'They followed imperialistic policies.', 'All of these'], 3,
  { explanation: 'The rise of Fascism and Nazism in Italy and Germany respectively led to the start of the Second World War because: Both of them were against democracy. Both of them followed aggressive nationalism. Both of them followed imperialistic policies. Both believed in the principle of expansion.' }));

items.push(mcq(12, '230', 'Japan attacked China in______and annexed Manchuria.',
  ['1931', '1939', '1940', '1941'], 0,
  { explanation: 'In Asia, Japan was harbouring expansionist desires. It attacked China in 1931 and annexed Manchuria. China appealed to the League of Nations to declare sanctions against Japan. But Britain and France, leading members of the League, ignored the appeal.' }));

items.push(mcq(13, '230', 'Why did the League fail to prevent war?',
  ['It had no power to act on its own initiative to preserve peace in the world.', 'It lacked its own armed force.', 'It depended on the great powers to enforce its resolutions.', 'All of the above'], 3,
  { explanation: 'The League of Nations failed to prevent war because it had no power to act on its own initiative to preserve peace in the world. It lacked its own armed force and so depended on the great powers to enforce its resolutions. It also depended on the great powers to keep economic sanctions, or provide an army when needed.' }));

items.push(mcq(14, '230', 'Which of the following countries did not become a member of the League because its Senate did not ratify the Covenant of the League?',
  ['Japan', 'The USA', 'Italy', 'None of these'], 1,
  { explanation: 'The USA did not become the member of the League, as its Senate did not ratify the Covenant of the League of Nations. Germany was also not allowed to join the League.' }));

items.push({
  kind: 'case',
  sourceQuestionNumber: '15',
  sourcePage: '230',
  text: 'Hitler demanded the Danzig Corridor from Poland because:',
  diagramStatus: 'not_applicable',
  answerStatus: 'needs_review',
  answerKeyRef: 'printed Ans., p.230, item 15',
  parts: [
    {
      text: 'Choose the correct option.',
      options: ['It was a part of Germany before the Treaty of Versailles.', 'It had cut off East Prussia from the rest of Germany (to connect East Prussia with Germany).', 'Due to isolation, the Germans living in East Prussia were being slaughtered by the Polish Jews.', 'All of the above'],
      correct: 3,
      marks: 1,
    },
  ],
  explanation: 'IMPORTANT DISCLOSURE: option (c) reproduces a Nazi-era propaganda claim, not documented history. The Danzig Corridor genuinely was part of Germany before the Treaty of Versailles transferred it to Poland to give Poland access to the sea, and it did physically cut off East Prussia from the rest of Germany — both real, documented sources of tension (options a and b). But the specific claim that ethnic Germans in East Prussia "were being slaughtered by the Polish Jews" is not a documented historical event — it echoes the fabricated and exaggerated persecution narratives (including staged provocations such as the Gleiwitz incident) that the Nazi regime manufactured as a pretext for invading Poland, and its targeting of "Polish Jews" specifically is an antisemitic invention with no historical basis. Transcribed verbatim per this project\'s policy of faithful source transcription, and the printed key ("All of the above") is kept, but option (c)\'s framing should never be read as a legitimate historical justification — it is propaganda being described, not history being reported.',
});

items.push(mcq(16, '230', 'The Second World War started with:',
  ['American invasion ever Poland', 'Polish invasion over Germany', 'German invasion of Poland', 'British invasion over Poland'], 2,
  { explanation: 'The Second World War started on September 1, 1939 with German invasion of Poland and subsequent declarations of war on Germany by the United Kingdom, France and the British Dominions. German invasion of Poland was the immediate cause of the World War-II.' }));

items.push(mcq(17, '231', 'Which of the following countries declared war on Germany after it invaded Poland?',
  ['The UK', 'France', 'The British Dominions', 'All of these'], 3,
  { explanation: 'The United Kingdom, France and the British Dominions declared war on Germany after it invaded Poland on 01 September 1939.' }));

items.push(mcq(18, '231', 'Hitler attacked Poland because he wanted to _________.',
  ['seize the coal mines', 'militarise the Rhine valley', 'regain the Danzing port', 'control the trade'], 2,
  { explanation: 'The Danzig Corridor was a major cause of tension between Germany and Poland. It had been part of Germany until the Treaty of Versailles transferred it to Poland. Hitler aimed to reclaim this corridor, and the German invasion of Poland became the immediate cause of World War II.' }));

items.push(mcq(19, '231', 'What was the consequence of the above-depicted bombing in two Japanese cities?\n[Photograph: two side-by-side mushroom clouds from atomic bomb detonations.]',
  ['End of World War I', 'End of World War II', 'End of the Cold War', 'End of the Gulf War'], 1,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.231, item 19 — side-by-side photographs of the atomic bomb mushroom clouds over Hiroshima and Nagasaki', assetType: 'source_page_full' }],
    explanation: 'The atomic bombings of Hiroshima and Nagasaki (August 1945) led directly to Japan\'s surrender and the end of World War II.',
  }));

items.push(mcq(20, '231', 'Which of the following is NOT a consequence of the Second World War?',
  ['Austria and Hungary became separate states.', 'Defeat of the Axis powers', 'Beginning of the Cold War', 'Formation of the United Nations'], 0,
  { explanation: 'The first option is a consequence of the First World War (the break-up of Austria-Hungary), while the other three are consequences of the Second World War.' }));

items.push(mcq(21, '231', 'Which incident depicted in the above cartoon led to the beginning of the Second World War?\n[Political cartoon by Milton Rowson Halladay: a figure labelled "Hitler" holding a ball labelled "Danzig".]',
  ["Hitler's policy of Imperialism", "Hitler's attack on Poland", "Hitler's annexation of Austria", "Hitler's attack on Czechoslovakia"], 1,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.231-232, item 21 — political cartoon by Milton Rowson Halladay depicting Hitler holding a ball labelled "Danzig"', assetType: 'source_page_full' }],
    explanation: 'The Danzig Corridor was a major cause of tension between Germany and Poland. It had been part of Germany until the Treaty of Versailles transferred it to Poland. Hitler aimed to reclaim this corridor, and the German invasion of Poland became the immediate cause of World War II.',
  }));

items.push(mcq(22, '232', 'Who adopted the Policy of Appeasement from May 1937 to September 1939?',
  ['Hitler', 'Mussolini', 'Chamberlain', 'Woodrow Wilson'], 2,
  { explanation: 'Neville Chamberlain, the Prime Minister of the United Kingdom during that period, pursued a policy of appeasement towards Germany.' }));

items.push(mcq(23, '232', 'The attack by which country on the Pearl Harbour led to the entry of United States into the Second World War?',
  ['China', 'Japan', 'Germany', 'Russia'], 1,
  { explanation: "Japan's attacks on Pearl Harbour on December 7, 1941 lead to the entry of the United States into the Second World War." }));

items.push(mcq(24, '232', 'When did the Battle of Berlin begin?',
  ['1939', '1945', '1948', '1942'], 1,
  { explanation: 'The battle commenced in April 1945 and resulted in the capture of Berlin by Soviet forces.' }));

items.push(mcq(25, '232', 'Which among the following cities was bombed by the United States during the Second World War?',
  ['Nagasaki', 'Manchuria', 'Poland', 'Berlin'], 0,
  { explanation: 'The bombing of Nagasaki occurred on August 9, 1945, three days after the atomic bombing of Hiroshima.' }));

items.push(mcq(26, '232', 'The United Nations came into existence on _________.',
  ['24 October 1945', '30 October 1945', '30 Aug 1945', '7 Dec 1941'], 0,
  { explanation: 'The United Nations come into existence on 24 October 1945 with the ratification of its charter by the five permanent members of the security council and other signatories, aimed at maintaining peace and security.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'The Second World War',
  chapterOrder: 19,
  label: 'ch18-22-dictatorships-wwii-un-nam-final.pdf (Chapter 19 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
