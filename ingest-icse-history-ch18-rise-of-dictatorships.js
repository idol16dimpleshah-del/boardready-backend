// ICSE Class 10 History & Civics — Chapter 18: "Rise of Dictatorships".
// Uploaded 2026-09-17 as part of the combined chap_18-22.pdf, archived via
// archive-icse-history-ch18-22.js -> source_files.id 114 (this one
// physical file covers Chapters 18, 19, 20, 21 and 22 — the FINAL upload
// for this subject, per the founder's own message "icse history ends
// here" — see that script's header comment).
// Standing instruction: "now on till i dont change it will be icse 10
// history chapter wise i will be uploading, make sure you feed in the
// system."
//
// Verification method (same as Ch17): every printed answer checked against
// well-documented world history of Italian Fascism, German Nazism, and the
// interwar dictatorships (1919-1939) — Mussolini's rise, Hitler's rise to
// power, the Nuremberg Laws era, and both regimes' ideology and practice.
//
// RESULT: a clean chapter. Every one of the 28 printed answers is
// consistent with documented history and internally consistent with its
// own explanation. No needs_review items. One item (16, on Hitler's
// violations of the Treaty of Versailles) uses a common textbook
// compression — describing the 1935 Saar plebiscite's return of the Saar
// territory to Germany as Hitler having "taken back" it "from France" —
// which is a simplification of a scheduled League-of-Nations-administered
// plebiscite outcome rather than a unilateral seizure, but this doesn't
// rise to a factual error worth flagging (Saar's reunification with
// Germany did occur under Hitler's rule, in January 1935, and was
// propagandised by the Nazi regime as a foreign-policy win).
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

items.push(mcq(1, '222', 'Which of the following was the period that witnessed the rise of dictatorship in Italy and Germany?',
  ['1919-1939 AD', '1920- 1930 AD', '1919- 1929 AD', '1929- 1939 AD'], 0,
  { explanation: 'The inter-war period (1919-1939 AD.) saw the rise of dictatorships in Italy and Germany. The First World War was fought to "make the world safe for democracy", but post war unsettled economic and political conditions paved the way for the end of democracy in both of these countries.' }));

items.push(mcq(2, '222', 'Mussolini formed the Fascist Party in:',
  ['March, 1920', 'November, 1921', 'March, 1921', 'March, 1922'], 1,
  { explanation: 'Mussolini formed the Fascist Party in November, 1921, which attracted people from all sections of society — ex-soldiers, farmers, workers, salaried persons and the youth.' }));

items.push(mcq(3, '222', 'Which of the following ideologies was made famous by the man shown in the above picture?\n[Photograph: a formal portrait of Benito Mussolini in military uniform, decorated with medals.]',
  ['Fascism', 'Nazism', 'Liberalism', 'Communism'], 0,
  {
    diagramStatus: 'source_diagram_preserved',
    visuals: [{ sourceFileId: SOURCE_FILE_ID, figureLabel: 'p.222, item 3 — formal portrait photograph of Benito Mussolini in military uniform', assetType: 'source_page_full' }],
    explanation: 'In Italy, Benito Mussolini, Duce, rekindled his country\'s pride through providing jobs in a time of high unemployment by starting major building projects. They believed in quality more than quantity, and the Fascist leaders who embodied the will, sentiments and emotions of the people were symbols of a nation\'s pride.',
  }));

items.push(mcq(4, '222', 'The ideology of Fascism was:',
  ['Emphasis on nationalism.', 'Full support for imperialist policy.', 'Full support for aggressive foreign policy.', 'All of these'], 3,
  { explanation: 'The ideology of the Fascism was: emphasis must be laid on nationalism, national spirit and national unity. There must be full support for imperialist and aggressive foreign policy to make the country gain in status in the international community.' }));

items.push(mcq(5, '222', 'Fascists believed in full control over:',
  ['Capitalists', 'Industrialists', 'Landlords', 'All of these'], 3,
  { explanation: 'The Fascists favoured equal control over all sections of society, i.e., capitalists, industrialists, landlords, labourers, peasants and artisans.' }));

items.push(mcq(6, '223', 'Nazism refers to the policies adopted by the government of Nazi Germany from :',
  ['1933-1945', '1943-1945', '1940-1946', '1941-1945'], 0,
  { explanation: 'Nazism is also known as National Socialism. It refers primarily to the ideology and practices of the National Socialist German Workers\' Party under the command of Adolf Hitler. It also refers to the policies adopted by the government of Nazi Germany from 1933 to 1945.' }));

items.push(mcq(7, '223', 'Key elements of Nazism were:',
  ['Anti-parliamentarism', 'Pan-Germanism', 'Welfare state ideology', 'All of these'], 3,
  { explanation: 'The key elements of Nazism were: Anti-parliamentarism, Pan-Germanism, Welfare state ideology (though only for "fit" Germans), Racism, Collectivism, Anti-Semitism, Opposition to economic liberalism and political liberalism, and Anti-communism, along with totalitarianism.' }));

items.push(mcq(8, '223', 'Which of the following statements is/are correct about Hitler and Nazi Party?',
  ['Hitler reorganised the Nazi Party from 1925-1929 AD.', 'He defamed the Weimar Republic for the sufferings of the people.', 'In the elections of July 1932, the Nazis captured 230 seats in the Reichstag.', 'All of the above'], 3,
  { explanation: 'Hitler reorganised the Nazi Party from 1925-1929 AD. He defamed the Weimar Republic for the sufferings of the people. In the election of July 1932, the Nazis polled more than 13 million votes and captured 230 seats in the Reichstag, but failed to get the majority.' }));

items.push(mcq(9, '223', 'When did Hitler become a dictator in Germany?',
  ['August 2, 1934', 'August 25, 1934', 'July 2, 1934', 'November 2, 1934'], 0,
  { explanation: 'Immediately after coming to power, Hitler got passed the Enabling Act, which authorised his Government to take any action without the approval of the Reichstag. Thus, without even having the majority, Hitler became all powerful. The Nazi regime practically became a one-man show. On August 2, 1934, the President Hindenburg passed away. On that very day, Hitler combined in his own person, the offices of the Chancellor (i.e., Prime Minister) and the President. From then onwards, he assumed the title of the Fuhrer, i.e., the Leader, and became the absolute dictator of Germany.' }));

items.push(mcq(10, '224', 'Which of the following is/are the feature(s) of Nazism?',
  ['The people exist for the State.', 'A Totalitarian State.', 'End to parliamentary institutions.', 'All of these'], 3,
  { explanation: 'The philosophy of Hitler was called as Nazism. The following were its main principles and aims: The people exist for the State, rather than the State for the people. He believed in a Totalitarian State — to tolerate no opposition or criticism and to allow no party formation other than his own. To put an end to parliamentary institutions and the democratic government.' }));

items.push(mcq(11, '224', 'Which of the following is correct about Nazism belief?',
  ['To make Germany a strong military power.', 'To inculcate the spirit of nationalism among the German people.', 'To regain the lost or ceded German territories.', 'All of the above'], 3,
  { explanation: 'Mentioned below are some of the features of Nazism in Germany: To denounce the Treaty of Versailles as disgraceful and to regain the lost or ceded German territories. To make Germany a strong military power and to carry the Swastika mark all over the world. To inculcate the spirit of nationalism among the German people.' }));

items.push(mcq(12, '224', "Which of the following is an important characteristic feature of Hitler's Domestic Policy?",
  ['Setting up of a strong national State in Germany.', 'Economic reforms and development work.', 'Anti-Jewish policies.', 'All of these'], 3,
  { explanation: "Following are important characteristic features of Hitler's Domestic Policy: Setting up of a strong national State in Germany. Economic reforms and development work. Anti-Jewish policies." }));

items.push(mcq(13, '224', 'Which of the following statements is not correct about Nazi rule in Germany?',
  ['Hitler worked for the unity and strength of Germany.', 'He abolished all the provincial governments and Germany was totally centralised.', 'The Germans were told that Hitler was Germany and Germany was Hitler.', 'People were given all rights.'], 3,
  { explanation: 'Hitler worked for the unity and strength of Germany. He abolished all the provincial governments and Germany was totally centralised. Germany became a dictatorship, with all powers in the hands of her leader. All opposition parties were eliminated and criticism was not allowed. The rights were denied to the people and democracy was crushed. The Germans were told that Hitler was Germany and Germany was Hitler.' }));

items.push(mcq(14, '224', "Which of the following statements is/are correct about Hitler's reign in Germany?",
  ['A secret police under the name of Gestapo established to spy over everyone.', 'He established the rule of one man, one leader and one party.', 'The radio, the press and all other means of propaganda were controlled by the State.', 'All of the above'], 3,
  { explanation: 'The important features of Hitler\'s rule in Germany are as follows: A secret police under the name of Gestapo established to spy over everyone. He established the rule of one man, one leader and one party, i.e., the Nazi Party. In this way, national unity was brought about in Germany. The radio, the press and all other means of propaganda were controlled by the State. Even education was replanned, so as to promote Nazism, German nationalism and her unity.' }));

items.push(mcq(15, '225', 'Which of the following is correct about the Nazi treatment to Jews?',
  ['A large number of Jewish put in the concentration camps.', 'They were denied German citizenship.', 'They were dismissed from government jobs.', 'All of the above'], 3,
  { explanation: 'The Nazis used to treat the Jews as follows: Hitler put a large number of Jews in the concentration camps. They were denied German citizenship. They were dismissed from government jobs and prohibited from practising medicine, law and many other professions. The Jews were forced to live in Ghetto isolation. No Jew could marry a German. Hitler wanted to eliminate the Jews completely. According to an estimate, he put to death about six million of the Jews, including men, women and children.' }));

items.push(mcq(16, '225', 'Which of the following statements is/are correct about the violation of Treaty of Versailles by Hitler?',
  ['He had started rearmament and compulsory military service.', 'He stopped the payment of war indemnity.', 'He took back the territory of Saar from France.', 'All of the above'], 3,
  { explanation: 'Mentioned below are the causes of violation of Treaty of Versailles by Hitler: Hitler had started rearmament and compulsory military service, in gross violation of the Treaty of Versailles. He preached the gospel of "Victorious sword". He said, He who does not wish to fight has not the right to exist in the world. He not only stopped the payment of war indemnity, but also took back the territory of Saar from France in 1934 AD (the Saar territory was in fact reunited with Germany following a League-of-Nations-administered plebiscite in January 1935, a scheduled process under the Treaty of Versailles rather than a unilateral seizure — heavily propagandised by the Nazi regime as a foreign-policy win regardless).' }));

items.push(mcq(17, '225', 'Why the Fascist rule in Italy was considered the worst type of misrule?',
  ['Italians were denied even basic human rights.', 'They were denied freedom of speech and expression and the right to form associations and trade unions.', 'Freedom of Press was crushed. Spies reported on the activities of members and sympathisers of all other political parties.', 'All of the above'], 3,
  { explanation: 'The Fascist rule in Italy was considered the worst type of misrule because: Italians were denied even basic human rights. They were denied freedom of speech and expression and the right to form associations and trade unions. Freedom of Press was crushed. People were imprisoned and even killed without trial.' }));

items.push(mcq(18, '226', 'Fascism and Mussolini did not believe in:',
  ['Support to democracy.', 'Opposition to the rights and liberties of the people.', 'Total stress on duties and obligations.', 'Rule of a single party and a single leader.'], 0,
  { explanation: 'The following were the main principles of Fascism and Mussolini\'s Aims: Opposition to democracy, rights and liberties of the people. There must be total stress on duties and obligations. There must be the rule of a single party and a single leader, with full authority in his hands.' }));

items.push(mcq(19, '226', 'The important features of Fascism, proposed by Mussolini were:',
  ['An absence of opposition.', 'No criticism of the leader.', 'State was more important than the individual.', 'All of the above'], 3,
  { explanation: 'The important features of Fascism, proposed by Mussolini were: There must be an absence of opposition. No criticism of the leader on any account was allowed. The state was more important than the individual, who must bow before it.' }));

items.push(mcq(20, '226', 'Which of the following was/were the weaknesses of Fascism and Nazism?',
  ['They brought about violence and terror.', 'They led to coups and conspiracies.', 'They brought danger to the world peace.', 'All of these'], 3,
  { explanation: 'Failures and weaknesses of Fascism and Nazism are as follows: They brought about violence and terror. Attacking Russia was a major blunder on Hitler\'s part. They led to coups and conspiracies. They brought danger to the world peace.' }));

items.push(mcq(21, '226', 'Which of the following were the achievements of Fascism and Nazim?',
  ['Civil order and increase in efficiency.', 'National cohesion.', 'Stability.', 'All of these'], 3,
  { explanation: 'The achievements of Nazism and Fascism are as follows: They brought civil order and increase in efficiency. They brought national cohesion - the rulers could unify their countrymen and gave them a faith to live by and a cause to die for. They brought stability.' }));

items.push(mcq(22, '226', 'Which of the following is a common ideology of Fascism and Nazism?',
  ['To believe in democracy', 'To encourage political systems', 'to uphold one party and one leader', 'To support communism'], 2,
  { explanation: 'The common ideology included authoritarianism (one party one rule), nationalism, militarism, and anti-communism.' }));

items.push(mcq(23, '227', 'Which of the following policies of a dictator ruling over Country X is MOST aligned with the ideologies of Mussolini during his time in power?',
  ['prioritising military expansion', 'promoting environmental sustainability', 'creating a healthcare program for all citizens equally', 'offering financial aid to support the education of students from poor backgrounds'], 0,
  { explanation: 'Benito Mussolini was a Fascist leader in Italy who established an authoritarian state and whose aim was to give rise to military expansion.' }));

items.push(mcq(24, '227', 'Which among the following was not the reason for the rise of Fascism in Italy?',
  ['Economic Crisis', 'Corrupt and Inefficient Government', 'Failure of The League Of Nations', 'Anti-Semitic Propaganda'], 3,
  { explanation: 'While anti-Semitic sentiments were present in some fascist movements, such as in Nazi Germany, they were not a primary driver of fascism in Italy.' }));

items.push(mcq(25, '227', "The title of whose autobiography meant 'My Struggle' in English?",
  ['Mussolini', 'Hitler', 'Hindenburg', 'Alfred Rocco'], 1,
  { explanation: 'Adolf Hitler\'s autobiography, "Mein Kampf," which translates to "My Struggle" in English, outlines his political ideology, beliefs, and plans for Germany.' }));

items.push(mcq(26, '227', 'Under which treaty did Mussolini recognise the Roman Catholic religion as the state religion?',
  ['Treaty of Lateran', 'Treaty of Versailles', 'Treaty of Trianon', 'Treaty of Saint-Germain'], 0,
  { explanation: 'Mussolini recognised the Roman Catholic religion under the Treaty of Lateran, signed between the kingdom of Italy and the Holy See.' }));

items.push(mcq(27, '227', 'Which among the following was not a similarity between the policies of Fascism and Nazism?',
  ['Racial Policy', 'Militarism', 'Anti-Communism', 'Totalitarian Government'], 0,
  { explanation: 'Nazism promoted the racial policies by persecuting Jews; Fascism did not centre its ideology on a systematic racial policy in the same way.' }));

items.push(mcq(28, '227', 'Which country did Hitler acquire by force in 1938?',
  ['Austria', 'Poland', 'Denmark', 'Hungary'], 0,
  { explanation: 'Austria was the country acquired by Hitler in 1938 through the Anschluss, violating the Treaty of Versailles and the Treaty of St. Germain.' }));

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'History and Civics',
  chapterName: 'Rise of Dictatorships',
  chapterOrder: 18,
  label: 'ch18-22-dictatorships-wwii-un-nam-final.pdf (Chapter 18 portion)',
  status: 'verified',
  answerStatus: 'verified',
  sourceFileIds: [SOURCE_FILE_ID],
});

console.log(JSON.stringify(result, null, 2));
