// ICSE Class 10 History & Civics — Chapter 17: "World War-I and Treaty of
// Versailles". Uploaded 2026-09-17 as part of the combined chap_14-17.pdf,
// archived via archive-icse-history-ch14-17.js -> source_files.id 113
// (this one physical file covers Chapters 14, 15, 16 and 17 — see that
// script's header comment). This is the fourth and final chapter from that
// combined upload.
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// STRUCTURAL FIRST FOR THIS SUBJECT: this chapter marks the syllabus's
// shift away from India-focused history (Chapters 1-16) into World History
// — the causes of the First World War, the Sarajevo assassination, the
// Paris Peace Conference, the Treaty of Versailles, and the League of
// Nations. Verification method: every printed answer checked against
// well-documented, largely uncontroversial world-history facts (dates,
// treaty terms, alliance memberships) rather than the printed key alone.
//
// RESULT: a clean chapter — every one of the 27 printed answers is
// consistent with documented history, and every explanation is internally
// consistent with its own question and answer. No needs_review items, no
// disclosed caveats.
//
// The final scanned page of this chapter (page 221) bleeds through with
// the faint start of the NEXT chapter, "Rise of Dictatorships" — that
// content belongs to a FUTURE upload and is not ingested here.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_ID = 113;

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

items.push(mcq(1, '216', 'Which of the following was not a cause of the First World War?',
  ['Division of Europe', 'Nationalism and Mutual Rivalry', 'Balkan Issue', 'Treaty of Versailles'], 3,
  { explanation: 'In general, the causes of the First World War can be classified as long-term causes and immediate causes. Division of Europe, Nationalism and Mutual Rivalry and the Balkan Issue were some of those causes leading to the outbreak of the First World War. The Treaty of Versailles was concluded as a RESULT of this Great War, not a cause of it.' }));

items.push(mcq(2, '216', 'Which of the following statements is/are correct regarding nationalism in the 19th century?',
  ['This was an era of narrow and militant nationalism.', 'The nationalism in this era had become competitive and aggressive.', 'The nationalism was taking the shape of chauvinism.', 'All of the above'], 3,
  { explanation: "The 19th century was an era of narrow and militant nationalism. Patriotism, love for one's own nation, meant hatred towards the other nations. Each nation thought about her own national interests. Nationalism had become competitive and aggressive, taking the shape of chauvinism." }));

items.push(mcq(3, '216', 'Which of the following was/were the reasons behind the direct clash of Germany with other colonial powers?',
  ['Germany had surpassed other European nations in industrial production and thus wanted more share in the world market.', 'Germany wanted to have more colonies in order to increase its share in the world market.', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: "By the end of the 19th century, Germany had surpassed other European nations in industrial production. Now Germany wanted a larger share in the world market, so it became necessary for Germany to have her own colonies. This brought her into a direct clash with the existing colonial powers like Britain, France and others. It led to a war-like situation." }));

items.push(mcq(4, '216', 'In which of the following regions, Russia had its expansion plans?',
  ['Italy', 'Ottoman Empire', 'Germany', 'China'], 1,
  { explanation: 'Russia had its expansion plans in the Ottoman Empire, and it clashed with the interests of Britain, Germany and Austria. Japan, an imperialist power, also had ambitions of expansion in the Far East. All these issues of rivalry over the colonies became a major cause of the World War.' }));

items.push(mcq(5, '217', 'Which of the following countries was not a part of Triple Entente?',
  ['Britain', 'France', 'Russia', 'Germany'], 3,
  { explanation: 'At the dawn of the 20th century, Europe was divided into two hostile camps. The major European nations were divided into "Blocs" such as Britain, France and Russia who had formed the Triple Entente in 1907 AD — Germany was part of the opposing Triple Alliance.' }));

items.push(mcq(6, '217', 'Which of the following countries left the Triple Alliance to fight against Germany in the First World War?',
  ['Japan', 'Netherlands', 'Italy', 'Portugal'], 2,
  { explanation: 'Italy was the country which left the Triple Alliance to join the war against Germany and Austria-Hungary in 1915.' }));

items.push(mcq(7, '217', 'When were Archduke Franz Ferdinand and his wife shot dead?',
  ['June 28, 1914', 'June 25, 1914', 'June 27, 1914', 'June 26, 1914'], 0,
  { explanation: 'In June 1914, the Archduke Franz Ferdinand, the Heir-Apparent to the throne of Austria, went on an official visit to Sarajevo, the capital of Bosnia. There, on June 28, 1914, he and his wife were shot dead. It is known as the Sarajevo Incident. The assassin, Gavrilo Princep, was a nineteen-year-old Bosnian.' }));

items.push(mcq(8, '217', 'Which of the following countries opposed the French claim over Morocco confirmed by the secret agreement?',
  ['Italy', 'Holland', 'Germany', 'All of these'], 2,
  { explanation: 'In 1904, Britain and France made a secret agreement which stated that Britain would have political control over Egypt and France over Morocco. But the French claim over Morocco was opposed by Germany, which declared that all the nations had equal opportunities to trade with it.' }));

items.push(mcq(9, '217', 'Austria declared a War on Serbia on:',
  ['July 18, 1914', 'July 20, 1914', 'July 28, 1914', 'July 24, 1914'], 2,
  { explanation: 'Due to Russian instigation, Serbia refused to comply with some of the conditions of Austria. It especially rejected those conditions that would have led to loss of her sovereignty. So, Austria declared a war on Serbia on July 28, 1914. Upon this, Russia warned Austria and finally mobilised her troops.' }));

items.push(mcq(10, '217', 'Which of the following statements is not correct regarding relations between France and Germany prior to the First World War?',
  ['France and Germany were old friends.', 'Germany defeated France in the Franco-Prussian War 1870-71 and seized it\'s important areas.', 'Kaiser William II was the Emperor of Germany.', 'The French dreamed of taking revenge and taking back their lost provinces.'], 0,
  { explanation: 'Germany had Kaiser William II as her new Emperor. He wanted to establish a vast German empire. France and Germany were old RIVALS, not friends. After defeating France in the Franco-Prussian War 1870-71, Germany had seized the province of Alsace and parts of Lorraine, which were rich in minerals and industrial products. The French dreamed of taking revenge and taking back their lost provinces.' }));

items.push(mcq(11, '218', 'In which of the following places, the conference was held to settle the terms for peace?',
  ['New York', 'Paris', 'London', 'Rome'], 1,
  { explanation: 'A conference of the representatives of different European countries was held in Paris to settle the terms for peace. About 27 nations represented the Peace Conference. Germany, Hungary, Turkey and Bulgaria signed separate treaties, which collectively came to be known as the Paris Peace Settlement of 1919-1923.' }));

items.push(mcq(12, '218', 'The Treaty of Versailles was the main treaty, signed on:',
  ['June 28, 1919', 'June 20, 1919', 'June 21, 1919', 'June 25, 1919'], 0,
  { explanation: 'The Treaty of Versailles was signed on June 28, 1919 in the Hall of Mirrors at Versailles in France, between the defeated Germany and the victors Britain, France and the U.S.A.' }));

items.push(mcq(13, '218', 'Which of the following was not one of the main terms of the Treaty of Versailles?',
  ['Germany was excused to pay any war compensation.', 'Germany had to evacuate herself from the areas she had captured during the war.', 'Rhine Valley area was to be demilitarised.', 'She was compelled to make no construction on both sides of the Rhine Valley.'], 0,
  { explanation: 'Main Terms of the Treaty of Versailles (June 28, 1919) were: Germany was held guilty of aggression and was to pay 33 billion dollars in compensation to the victors — she was NOT excused from paying war compensation. Germany had to evacuate herself from the areas she had captured during the war. The German area of Rhine Valley was to be demilitarised. Germany was forced not to construct any fortifications either on the right bank or the left bank; existing ones were to be demolished.' }));

items.push(mcq(14, '218', 'For how many years, the German territory to the west of the Rhine Valley was to be occupied by the Allied Troops ?',
  ['5 years', '10 years', '20 years', '15 years'], 3,
  { explanation: 'As per the terms of the Treaty of Versailles, the German territory to the west of the Rhine Valley was to be occupied by the Allied Troops for 15 years.' }));

items.push(mcq(15, '218', 'The Treaty of Versailles affirmed the complete independence of:',
  ['Belgium', 'Poland', 'Czechoslovakia', 'All of these'], 3,
  { explanation: 'The Treaty of Versailles affirmed the complete independence of Belgium, Poland, Czechoslovakia (including Silesia, Bohemia and Moravia) and Yugoslavia (included Slovenia, Bosnia, Croatia and Herzegovina — Capital at Belgrade).' }));

items.push(mcq(16, '219', 'Violation of which of the following treaties led to the outbreak of the Second World War in 1939?',
  ['The Treaty of Versailles', 'The Treaty of Sevres', 'The Treaty of St. Germain', 'None of these'], 0,
  { explanation: 'Hitler, after coming to power, violated the terms of the Treaty of Versailles, and thus, the injustice done to Germany and the national insult hurled upon her through the Treaty of Versailles led to the Second World War of 1939 AD, barely twenty years after this Treaty was signed and the Covenant of the League of Nations was enacted.' }));

items.push(mcq(17, '219', 'After the defeat, German Emperor Kaiser William fled to:',
  ['Italy', 'Britain', 'Austria', 'Holland'], 3,
  { explanation: 'When German Emperor Kaiser William lost hopes of winning the war, he fled to Holland.' }));

items.push(mcq(18, '219', 'What was the effect of the First World War on England?',
  ['England came to possess the German colonies.', 'She was also made the guardian of Palestine, Jordan and Iraq.', 'She received some military equipment.', 'All of the above'], 3,
  { explanation: 'After the First World war, England came to possess the German colonies and was also made the guardian of Palestine, Jordan and Iraq (under League of Nations mandates). She received some military equipment and cargo fleets of Germany as war compensation.' }));

items.push(mcq(19, '219', 'The outcomes of the First World War in terms of economic conditions were:',
  ['The war led to economic depression.', 'The prices of commodities shot up.', 'Both (a) and (b)', 'Neither (a) nor (b)'], 2,
  { explanation: 'Due to the heavy cost of the war in terms of money and material, there occurred an economic depression, general inflation and a high shoot up in the prices of commodities. The European nations had to depend on American loans for relief, and the European markets came under American influence.' }));

items.push(mcq(20, '219', 'The First World War came to an end on:',
  ['11th November, 1918', '17th November, 1918', '18th November, 1918', '14th November, 1918'], 0,
  { explanation: 'This First World War came to an end on 11th November, 1918, when the Germans signed the Armistice. The Armistice was based on fourteen points which President Wilson of America had formulated.' }));

items.push(mcq(21, '220', 'The immediate cause of the First World War was ________. [Board Question]',
  ['Imperialism', 'Alliance System', 'Sarajevo Crisis', 'Arms Race'], 2,
  { explanation: 'The Archduke Francis Ferdinand, the heir to the throne of Austria-Hungary, while on his visit to Bosnia was shot dead by a Serbian armed man. This incident inflicted the fire of revenge among the Austrians, who soon declared war on Serbia — this was the immediate/proximate cause, in contrast to underlying long-term causes such as imperialism, the alliance system, and the arms race.' }));

items.push(mcq(22, '220', 'Which of the following is an immediate impact of the above incident?\n[Newspaper clipping headline: "HEIR TO AUSTRIAN THRONE MURDERED — Archduke and his wife shot dead in the street."]',
  ['It led to the supremacy of America', 'It led to the First World War', 'Austria and Hungary became two independent nations.', 'Democracy replaced monarchy in many countries.'], 1,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.220, item 22 — reproduction of a period newspaper front page reporting the assassination of Archduke Franz Ferdinand at Sarajevo', assetType: 'source_page_full' }],
    explanation: 'After the assassination of the Austrian Crown Prince, Archduke Francis Ferdinand, and his wife by a Serbian nationalist, the tensions in Europe rose, which led to the First World War.',
  }));

items.push(mcq(23, '220', 'What among the following was a significant consequence of the First World War?',
  ['Creation of League of Nations', 'Second World War', 'Armament Race', 'Balkan War'], 0,
  { explanation: 'Creation of the League of Nations was a significant consequence of the First World War, aimed at promoting international cooperation and preventing future conflicts.' }));

items.push(mcq(24, '220', 'Which American president declared war on Germany in 1917 after breaking off all its diplomatic relations?',
  ['Winston Churchill', 'David Lloyd George', 'Woodrow Wilson', 'Franklin Roosevelt'], 2,
  { explanation: 'Woodrow Wilson declared war on Germany in 1917 after breaking off all its diplomatic relations, leading the United States into World War I.' }));

items.push(mcq(25, '220', 'Which among the following led to the end of war between Russia and Germany?',
  ['Treaty of Versailles', 'Treaty of Brest-Litovsk', 'League of Nations', 'Treaty of Saint Germain'], 1,
  { explanation: 'Treaty of Brest-Litovsk led to the end of war between Russia and Germany. It allowed Germany to focus its efforts on the Western front in World War I.' }));

items.push(mcq(26, '221', 'Where was The League Of Nations headquartered?',
  ['Versailles', 'Geneva', 'Austria', 'Poland'], 1,
  { explanation: 'The League of Nations, established after World War I, was based in Geneva, Switzerland. It aimed to promote international cooperation and maintain peace and security among nations.' }));

items.push(mcq(27, '221', 'Which country did not become a member of The League of Nations?',
  ['Germany', 'United States', 'France', 'Britain'], 1,
  { explanation: 'The United States did not become a member of the League of Nations, as the U.S. senate refused to ratify the Treaty of Versailles, although Woodrow Wilson wanted the U.S. to join.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'World War-I and Treaty of Versailles',
  chapterOrder: 17,
  label: 'ch14-17-quit-india-ina-partition-wwi-versailles.pdf (Chapter 17 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
