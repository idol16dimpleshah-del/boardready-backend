// Chapter 15 (Similarity as a Size Transformation) — full source ingestion.
// Small chapter: only 3 source pages (15.2-15.4), 21 real questions total.
// Full page range read: plain MCQs (1)-(19), then a short "Assertion and
// Reasoning" section (20)-(21). No case-study passage in this chapter.
//
// Every answer cross-checked against answer.pdf's chapter 15 block (p.25.9).
// Spot-verified several of the scale-factor/area/volume word problems
// independently — all matched; no discrepancies found.
const { ingestQuestions } = require('./ingest');

function page(p) { return p; }

const items = [
  { text: 'Figures which have exactly the same shape, but not necessarily the same ______, are said to be similar.', options: ['Angle', 'Side', 'Size', 'Volume'], correct: 2, difficulty: 'Easy', subConcept: 'Similarity (concept)', sourcePage: page('15.2'), sourceQuestionNumber: '1' },
  { text: 'All regular polygons having the same number of ______ are similar.', options: ['Sides', 'Angles', 'Diagonals', 'Centric'], correct: 0, difficulty: 'Easy', subConcept: 'Similarity of regular polygons', sourcePage: page('15.2'), sourceQuestionNumber: '2' },
  { text: 'Two circles are always:', options: ['Congruent', 'Similar', 'Enlarged', 'Concentric'], correct: 1, difficulty: 'Easy', subConcept: 'Similarity (concept)', sourcePage: page('15.2'), sourceQuestionNumber: '3' },
  { text: 'In size transformation, the given figure is called an object and the resulting figure is called its:', options: ['Pre-image', 'Image', 'Post-image', 'Enlarge object'], correct: 1, difficulty: 'Easy', subConcept: 'Size transformation (concept)', sourcePage: page('15.2'), sourceQuestionNumber: '4' },
  { text: 'Let k be the scale factor of a given size transformation. Then k < 1 as the transformation is a/an:', options: ['Enlargement', 'Identity transformation', 'Reduction', 'Preserved'], correct: 2, difficulty: 'Medium', subConcept: 'Scale factor (concept)', sourcePage: page('15.2'), sourceQuestionNumber: '5' },
  { text: 'Each side of the resulting figure = ______ times the corresponding side of the given figure, where k is the scale factor.', options: ['k²', 'k', 'k³', '2k'], correct: 1, difficulty: 'Easy', subConcept: 'Scale factor (concept)', sourcePage: page('15.2'), sourceQuestionNumber: '6' },
  { text: 'The transformation is a/an ______, if k = 1, where k is the scale factor of a given size transformation.', options: ['Enlargement', 'Identity transformation', 'Reduction', 'Map'], correct: 1, difficulty: 'Easy', subConcept: 'Scale factor (concept)', sourcePage: page('15.2'), sourceQuestionNumber: '7' },
  { text: 'In case of solids, we have volume of the resulting figure = ______ × volume of the given figure, where k is the scale factor.', options: ['k', 'k²', 'k³', '3k'], correct: 2, difficulty: 'Medium', subConcept: 'Scale factor and volume', sourcePage: page('15.2'), sourceQuestionNumber: '8' },
  { text: 'If scale factor k = 1/p, then the Area of the Model = ______ × Area of the actual figure.', options: ['k²', 'k', 'k³', '1/k'], correct: 0, difficulty: 'Medium', subConcept: 'Scale factor and area', sourcePage: page('15.2'), sourceQuestionNumber: '9' },

  { text: 'Let the map of a plane figure be drawn to the scale 1 : p. Length in the Map = k × Actual Length, then the scale factor k =', options: ['p/1', '1/p', '1/k', 'k'], correct: 1, difficulty: 'Medium', subConcept: 'Scale factor (concept)', sourcePage: page('15.3'), sourceQuestionNumber: '10' },
  { text: 'A transformation is a way to map a function or shape into itself. The type enlargement or reduction is called size transformation. Which of the following is/are NOT true in a size transformation? I. The image of a triangle is a triangle II. The model of a plane figure and the actual figure are similar to one another III. The model of a solid and the actual solid are similar to one another IV. The Area of the actual figure = k × the Area of the model, where k is the scale factor.', options: ['Only I', 'II and III', 'I and IV', 'Only IV'], correct: 3, difficulty: 'Hard', subConcept: 'Size transformation (concept, true/false statements)', sourcePage: page('15.3'), sourceQuestionNumber: '11' },
  { text: 'A model of a boat is made on the scale of 1 : 40. The length of the original boat is 60 m. Then the length of the scale model is:', options: ['150 cm', '1500 km', '150 m', '15 cm'], correct: 0, difficulty: 'Medium', subConcept: 'Scale factor word problem', sourcePage: page('15.3'), sourceQuestionNumber: '12' },
  { text: 'If the scale factor is 1 : 50000, and the distance between two cities on the map is 2 cm, then the actual distance between two cities is:', options: ['100000 km', '2500 km', '1000 km', '1 km'], correct: 3, difficulty: 'Medium', subConcept: 'Scale factor word problem', sourcePage: page('15.3'), sourceQuestionNumber: '13' },
  { text: 'A model of a ship is made to a scale of 1 : 200. If the length of the model is 4 m, then the length of the ship is:', options: ['400 m', '800 m', '40000 m', '80000 m'], correct: 1, difficulty: 'Medium', subConcept: 'Scale factor word problem', sourcePage: page('15.3'), sourceQuestionNumber: '14' },
  { text: 'John an architect used a scale factor 1 : 100 to design a site plan. If the actual car parking area for one car is 12.5 m², then the car parking area depicted in the site plan for 1000 cars is:', options: ['125 m²', '0.125 m²', '0.00125 m²', '1.25 m²'], correct: 3, difficulty: 'Hard', subConcept: 'Scale factor and area word problem', sourcePage: page('15.3'), sourceQuestionNumber: '15' },
  { text: 'A square plot of land ABCD is represented on a map with a scale factor of 1 : 25000. If the area of the plot in the map is 72 cm², then the actual area of the plot of land:', options: ['2.5 km²', '4.5 km²', '7.5 km²', '9.5 km²'], correct: 1, difficulty: 'Hard', subConcept: 'Scale factor and area word problem', sourcePage: page('15.3'), sourceQuestionNumber: '16' },
  { text: 'Actual area of lake is 2 km², if the scale of the map is 1 : 25000, then the area on the map of the lake in cm² is:', options: ['32 cm²', '64 cm²', '16 cm²', '128 cm²'], correct: 0, difficulty: 'Hard', subConcept: 'Scale factor and area word problem', sourcePage: page('15.3'), sourceQuestionNumber: '17' },

  { text: 'A cuboidal tank has capacity of 30 m³. A small model of tank is made having capacity of 240 cm³. The scale factor used is:', options: ['1 : 8', '1 : 50', '1 : 125000', '1 : 2'], correct: 2, difficulty: 'Hard', subConcept: 'Scale factor and volume word problem', sourcePage: page('15.4'), sourceQuestionNumber: '18' },
  { text: 'A model of building is made to a scale of 1 : 50. The volume of the model is 20 litres. Then the volume of building is:', options: ['250 m³', '2500 m³', '2500000 m³', '25000 m³'], correct: 1, difficulty: 'Hard', subConcept: 'Scale factor and volume word problem', sourcePage: page('15.4'), sourceQuestionNumber: '19' },

  { text: 'Assertion (A): Two Circle are always similar. Reason (R): Similar shapes have same shape and size.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 0, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('15.4'), sourceQuestionNumber: '20', explanation: 'A is true (circles are always similar), but R is false as a general statement — similar shapes have the same shape but not necessarily the same size — matches the key.' },
  { text: 'Assertion (A): In a size transformation, if the scale factor k is greater than 1, then it is reduction. Reason (R): Size transformation is a process in which a given figure is reduced by a certain scale factor.', options: ['A is true, R is false', 'A is false, R is true', 'Both A and R are true', 'Both A and R are false.'], correct: 3, difficulty: 'Medium', subConcept: 'Assertion and reasoning', questionType: 'assertion_reasoning', sourcePage: page('15.4'), sourceQuestionNumber: '21', explanation: 'A is false (k > 1 is enlargement, not reduction). R is also false as a general definition — size transformation can enlarge or reduce, not only reduce — matches the key (both false).' },
];

const meta = {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'Similarity as a Size Transformation',
  chapterOrder: 15,
  label: 'chap_15.pdf (ICSE Maths workbook) — full ingestion, questions (1)-(21)',
  status: 'transcribed',
};

const result = ingestQuestions(items, meta);
console.log('item count in this batch:', items.length);
console.log(JSON.stringify(result, null, 2));
