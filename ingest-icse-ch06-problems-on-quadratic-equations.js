// ICSE Class 10 Mathematics — Chapter 6: Problems on Quadratic Equations.
// Source: chap_6.pdf, uploaded 2026-09-17 ("Icse chap 1-6"), archived via
// archive-icse-maths-ch1-6.js as source_files.id 101
// (ICSE-MATH-CH06-QUADEQ-PROBLEMS). Part of the same upload that closes the
// ICSE Maths Ch1-6 gap documented by an earlier session's RECOVERY_AUDIT.md.
//
// Full chapter read directly from the PDF (13 pages: 6.2-6.14), 44 items:
// items 1-19 are plain word-problem MCQs, items 20-39 are multi-part
// case-study word problems (translate a real-world scenario into a
// quadratic equation, then solve), items 40-44 are Assertion-Reason (40-41
// use the source's "simple" 4-option scheme, 42-44 the "full" scheme). The
// printed answer key (source_library/ICSE/Mathematics/answer.pdf, p.25.4,
// section "6 PROBLEMS ON QUADRATIC EQUATIONS") was read and used as a
// cross-check, NOT a substitute for independent verification.
//
// METHOD: every item's word problem was independently translated into an
// equation and solved from scratch (forming the equation from the stated
// relationship, then discriminant/quadratic formula) BEFORE consulting the
// printed key. RESULT: 42 of 44 items match the printed key exactly on
// independent recomputation, with two disclosed exceptions:
//  - Item 26 (motorboat upstream/downstream): independent computation
//    (internally consistent with parts (i) and (v), which DO match the
//    printed key) gives (ii) C, (iii) D, (iv) A. The printed key instead
//    shows (ii) D, (iii) A, (iv) C for this item — none of which is
//    algebraically consistent with x=8 (the value implied by parts (i) and
//    (v)) or with each other. This looks like the key's three answers for
//    (ii)-(iv) are shifted one column (key(ii)=our(iii), key(iii)=our(iv),
//    key(iv)=our(ii)), rather than a genuine alternate solution. We use our
//    independently-verified values and flag the item `needs_review` rather
//    than silently forcing a match — see the item's own explanation field.
//  - Item 27(iv) (Raj & Simran's marbles): the quadratic x²-45x+324=0 has
//    two valid positive roots (36 and 9, both satisfying 0<x<40); the
//    printed key uses x=36, which we adopt without disputing since both
//    roots are mathematically legitimate and the choice is a matter of
//    which boy is "Raj" — disclosed in the explanation, not flagged.
//  Additionally item 32(ii) has two options (C and D) printed with
//  identical text "(35-x)" in the source itself (an apparent typesetting
//  duplication) — both are numerically correct; transcribed as printed.
//
// Two AR items (43, 44) are DESIGNED to contain a false Assertion (a wrong
// sign or a wrong final number) paired with a true, correctly-derived
// Reason — correctly identified as "A false, R true" by both the printed
// key and this independent check alike, not discrepancies.
//
// No diagrams/figures anywhere in this chapter (pure word-problem algebra)
// — diagramStatus: 'not_applicable' throughout.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [101]; // archive-icse-maths-ch1-6.js -> ch06-problems-on-quadratic-equations.pdf

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  kind: 'mcq',
  options,
  correct: correctIdx,
  answerKeyRef: `printed ANSWERS table, p.25.4, "6 PROBLEMS ON QUADRATIC EQUATIONS", item ${n} (independently re-verified by computation)`,
  diagramStatus: 'not_applicable',
  answerStatus: 'verified',
  ...opts,
});

const items = [
  mcq(1, '6.2', 'If the sum of two natural numbers is 27 and their product is 182, then the smaller number is:', ['13', '14', '16', '18'], 0,
    { explanation: 'x(27-x)=182 => x²-27x+182=0 (D=1); roots 13,14; smaller=13.' }),
  mcq(2, '6.2', 'The sum of the squares of two consecutive odd natural numbers is 74. The greater number is:', ['5', '7', '9', '11'], 1,
    { explanation: 'n²+(n+2)²=74 => n²+2n-35=0 => n=5; greater=7.' }),
  mcq(3, '6.2', 'Two natural numbers differ by 2 and the sum of their squares is 202. The sum of the numbers is:', ['14', '16', '18', '20'], 3,
    { explanation: 'n²+(n+2)²=202 => n²+2n-99=0 => n=9; numbers 9,11; sum=20.' }),
  mcq(4, '6.2', '₹40 is distributed between two friends such that the product of their shares is ₹364. The difference of their shares is:', ['₹8', '₹10', '₹12', '₹14'], 2,
    { explanation: 'x(40-x)=364 => x²-40x+364=0 => x=26,14; difference=12.' }),
  mcq(5, '6.2', 'The length of a rectangle is 4 cm more than its breadth. If the area of the rectangle is 96 cm², then the perimeter of the rectangle is:', ['36 cm', '40 cm', '44 cm', '48 cm'], 1,
    { explanation: 'b(b+4)=96 => b²+4b-96=0 => b=8; length=12; perimeter=40.' }),
  mcq(6, '6.2', 'If four times the area of a square is 484 cm², then the perimeter of the square is:', ['32 cm', '48 cm', '40 cm', '44 cm'], 3,
    { explanation: 'area=121 => side=11 => perimeter=44.' }),
  mcq(7, '6.2', 'Sum of the squares of the two consecutive positive integers is 365. The sum of the numbers is:', ['27', '31', '25', '29'], 0,
    { explanation: 'n²+(n+1)²=365 => n²+n-182=0 => n=13; numbers 13,14; sum=27.' }),
  mcq(8, '6.2', 'The altitude of a right triangle is 17 cm less than its base. If the hypotenuse is 25 cm, then the perimeter of the triangle is:', ['48 cm', '56 cm', '54 cm', '64 cm'], 1,
    { explanation: 'b²+(b-17)²=625 => b²-17b-168=0 => b=24, altitude=7; perimeter=24+7+25=56.' }),
  mcq(9, '6.2', 'The cost of an article is ₹3 more than twice the total number of articles. If the cost of all the articles is ₹189, then the number of articles is:', ['7', '9', '11', '13'], 1,
    { explanation: 'n(2n+3)=189 => 2n²+3n-189=0 => n=9.' }),
  mcq(10, '6.2', 'A natural number when increased by 12, equals 160 times its reciprocal. Then the number is:', ['3', '8', '4', '7'], 1,
    { explanation: 'x+12=160/x => x²+12x-160=0 => x=8.' }),
  mcq(11, '6.2', "5 years ago, woman's age was (x-3), 8 years hence, her age will be:", ['(x+8) yrs', '(x+5) yrs', '(x+11) yrs', '(x+10) yrs'], 3,
    { explanation: 'Present age=(x-3)+5=x+2; 8 years hence=x+2+8=x+10.' }),
  mcq(12, '6.3', 'The diagonal of a rectangular field is 60 m more than the shorter side. If the longer side is 30 m more than the shorter side, then the sides of the rectangle are:', ['60 m, 90 m', '80 m, 110 m', '90 m, 120 m', '120 m, 150 m'], 2,
    { explanation: 's²+(s+30)²=(s+60)² => s²-60s-2700=0 => s=90; longer=120.' }),
  mcq(13, '6.3', 'The product of two consecutive positive integers is 360. To find the integers, this can be represented in the form of quadratic equation as:', ['x²+x+360=0', 'x²+x-360=0', 'x²+x-360', 'x²-2x-360=0'], 1),
  mcq(14, '6.3', 'Some students planned a picnic. The total budget for food was ₹2000. 5 students failed to attend the picnic and thus the cost for food for each member increased by ₹20. Taking number of students planned a picnic as x, then amount contributed by each student for food in terms of x is:', ['2000/x', '2000/(x-5)', 'x/2000', '2000/x + 5'], 0),
  mcq(15, '6.3', 'The length of the sides forming a right-angled triangle are 5x and (3x-1), if the area of the triangle is 60 cm². The equation that represents the situation is:', ['3x²-5x-24=0', '3x²+5x-24=0', '3x²-x-24=0', '3x²+x-24=0'], 2,
    { explanation: '(1/2)(5x)(3x-1)=60 => 15x²-5x-120=0 => 3x²-x-24=0.' }),
  mcq(16, '6.3', "Johan and Jayant are very close friends. They decided to go Matheran with their families in separate cars. Johan's car travels at a speed of x km/hr while Jayant's car travels 5 km/hr faster than Johan's car. Johan took 4 hrs more than Jayant to complete the journey of 400 km. The distance covered by Jayant's car in 2 hrs is:", ['(2x+10) km', '(x-5) km', '2(x+10) km', '(2x+5) km'], 0,
    { explanation: "Jayant's speed=(x+5); distance in 2 hrs=2(x+5)=2x+10." }),
  mcq(17, '6.3', 'The distance between A and B by road is 240 km and by train it is 300 km. A car starts from station A with a speed x km/h, whereas a train starts from station B with a speed 20 km/h more than speed of the car to reach the station A, then the time taken by train to reach the station A in terms of x is:', ['240/x', '300/x', '240/(x+20)', '300/(x+20)'], 3),
  mcq(18, '6.3', 'A train travels a distance of 480 km at a uniform speed. If the speed had been 8 km/hr less, then it would have taken 3 hours more to cover the same distance. If the initial speed of the train is x km/hr, then representation of this information algebraically is:', ['x²-8x-1280=0', 'x²+8x+1280=0', 'x²-8x+1280=0', 'x²+8x-1280=0'], 0,
    { explanation: '480/(x-8) - 480/x = 3 => x²-8x-1280=0.' }),
  mcq(19, '6.4', "Neha's father is 28 years older than her. The product of their ages (in years) 4 years ago was 245. If present age of Neha is x years, then the representation of this information in the form equation is:", ['x²-20x-341=0', 'x²+20x-341=0', 'x²+20x+341=0', 'x²-20x+341=0'], 1,
    { explanation: '(x-4)(x+24)=245 => x²+20x-341=0.' }),
];

items.push({
  kind: 'case', sourceQuestionNumber: '20', sourcePage: '6.4',
  text: 'Car A travels x km for every litre of petrol, while Car B travels (x+5) km for every litre of petrol. Both the cars cover a distance of 400 km each.',
  parts: [
    { text: '(i) The amount of petrol used by Car A is:', options: ['(400/x) litres', '(x-400/x) litres', '(400/(x+5)) litres', '(400/(x-5)) litres'], correct: 0, marks: 1 },
    { text: '(ii) The difference between the amount of petrol used by both cars is:', options: ['1000/(x+5) litres', '2000/(x(x+5)) litres', '1000/(x-5) litres', '2000/(x-5) litres'], correct: 1, marks: 1 },
    { text: '(iii) If Car A uses 4 litres of petrol more than Car B in covering the distance of 400 km, then equation in terms of x is:', options: ['x²-5x+500=0', 'x²+5x-500=0', 'x²-5x-500=0', '-x²+5x-500=0'], correct: 1, marks: 1 },
    { text: '(iv) The amount of petrol used by Car B for the journey is:', options: ['25 litres', '20 litres', '16 litres', '15 litres'], correct: 2, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: fuel efficiency', questionType: 'case_study',
  explanation: 'x²+5x-500=0 => x=20 (Car A uses 400/20=20 L); Car B uses 400/25=16 L. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 20',
});
items.push({
  kind: 'case', sourceQuestionNumber: '21', sourcePage: '6.4',
  text: 'Two cars X and Y use 1 litre of diesel to travel x km and (x+3) km respectively. If both covered a distance of 72 km, then:',
  parts: [
    { text: '(i) The number of litres of diesel used by car X is:', options: ['72/(x-3) litres', '72/(x+3) litres', '72/x litres', '12/x litres'], correct: 2, marks: 1 },
    { text: '(ii) The number of litres of diesel used by car Y is:', options: ['72/(x-3) litres', '72/(x+3) litres', '72/x litres', '12/(x+3) litres'], correct: 1, marks: 1 },
    { text: '(iii) If car X used 4 litres of diesel more than car Y in the journey, then:', options: ['72/(x-3) - 12/x = 4', '72/(x+3) - 12/x = 4', '72/x - 72/(x+3) = 4', '72/(x-3) - 72/(x+3) = 4'], correct: 2, marks: 1 },
    { text: '(iv) The amount of diesel used by car X is:', options: ['6 litres', '12 litres', '18 litres', '24 litres'], correct: 1, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: fuel efficiency', questionType: 'case_study',
  explanation: 'x²+3x-54=0 => x=6; diesel used by X=72/6=12 L, by Y=72/9=8 L (12-8=4, consistent). All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 21',
});
items.push({
  kind: 'case', sourceQuestionNumber: '22', sourcePage: '6.5',
  text: "Ajay and Vijay are close friends. Both the friends decided to go to Lonavala which is 400 km away by their own cars. Ajay's car travels at a speed of x km/hr while Vijay's car travels 5 km/hr faster than Ajay's car.",
  parts: [
    { text: '(i) Time taken by Ajay to complete journey in terms of x:', options: ['400/x', '400/(x+5)', 'x/400', '400/x + 5'], correct: 0, marks: 1 },
    { text: '(ii) Time taken by Vijay to complete journey in terms of x:', options: ['400/x', '400/(x+5)', '400/x + 5', 'x/400'], correct: 1, marks: 1 },
    { text: '(iii) Ajay took 4 hours more than Vijay to complete the journey of 400 km, then the quadratic equation formed is:', options: ['x²-5x-500=0', 'x²+5x-500=0', 'x²+5x+500=0', 'x²-4x+400=0'], correct: 1, marks: 1 },
    { text: '(iv) Time taken by Ajay to reach Lonavala:', options: ['16 hours', '40 hours', '25 hours', '20 hours'], correct: 3, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: speed-distance-time', questionType: 'case_study',
  explanation: 'x²+5x-500=0 => x=20; Ajay time=400/20=20 hrs. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 22',
});
items.push({
  kind: 'case', sourceQuestionNumber: '23', sourcePage: '6.5-6.6',
  text: 'A bus travels from the station A at a certain average speed for a distance of 75 km to reach station B and then travels a distance of 90 km at an average speed of 10 km/hr more than the original speed to reach station C. If it takes 3 hours to complete the total journey, then based on information, answer the following questions:',
  parts: [
    { text: '(i) If the original speed of the bus be x km/hr, then time taken by the bus to travel from station A to station B is:', options: ['(75/x) hours', '(90/x) hours', '(90/(x+10)) hours', '(90/(x-10)) hours'], correct: 0, marks: 1 },
    { text: '(ii) The quadratic equation for the above information, if the original speed of the bus be x km/hr is:', options: ['x²+45x-250=0', 'x²-45x-250=0', 'x²-75x-450=0', 'x²-45x+250=0'], correct: 1, marks: 1 },
    { text: '(iii) The original speed of the bus is:', options: ['50 km/hr', '40 km/hr', '75 km/hr', '60 km/hr'], correct: 0, marks: 1 },
    { text: '(iv) The speed of the bus during which it travels the distance of 90 km is:', options: ['70 km/hr', '50 km/hr', '60 km/hr', '85 km/hr'], correct: 2, marks: 1 },
    { text: '(v) The time taken by the bus to travel a distance of 510 km with the new speed is:', options: ['8 hours', '8½ hours', '10⅕ hours', '12¾ hours'], correct: 1, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: two-leg journey, speed-distance-time', questionType: 'case_study',
  explanation: '75/x+90/(x+10)=3 => x²-45x-250=0 => x=50 (original speed); new speed=60; 510/60=8.5=8½ hrs. All five independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 23',
});
items.push({
  kind: 'case', sourceQuestionNumber: '24', sourcePage: '6.6',
  text: 'Rita rows a boat, the speed of a boat in still water is 9 km/hr and the speed of the stream is x km/hr.',
  parts: [
    { text: '(i) If Rita rows boat 15 km upstream, write the time taken by the boat for upstream journey, in terms of x:', options: ['15/(x+9)', '15/(x-9)', '15/(9-x)', '15/x + 9'], correct: 2, marks: 1 },
    { text: '(ii) If Rita rows boat 15 km downstream to return at the same point, then time taken by the boat for covering downstream journey, in terms of x:', options: ['15/x - 9', '15/(x-9)', '15/(9-x)', '15/(9+x)'], correct: 3, marks: 1 },
    { text: '(iii) If Rita takes 3 hours 45 minutes to complete upstream and downstream journey, write an equation in x to represent the statement:', options: ['x²-18x+81=0', 'x²-9=0', 'x²-81=0', 'x²+18x+81=0'], correct: 1, marks: 1 },
    { text: '(iv) Speed of the boat upstream is:', options: ['9 km/hr', '3 km/hr', '12 km/hr', '6 km/hr'], correct: 3, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: upstream/downstream boat speed', questionType: 'case_study',
  explanation: '15/(9-x)+15/(9+x)=15/4 => x²-9=0 => x=3; upstream speed=9-3=6 km/hr. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 24',
});
items.push({
  kind: 'case', sourceQuestionNumber: '25', sourcePage: '6.6-6.7',
  text: 'Priti bought x books for ₹1200. When the price of each book rose by ₹30, then she could buy 2 books less for ₹1200.',
  parts: [
    { text: '(i) Original cost of each book in terms of x:', options: ['1200/(x+2)', '1200/x', '1200/x + 2', 'x/1200'], correct: 1, marks: 1 },
    { text: '(ii) Cost of each book when price of each book rose by ₹30:', options: ['1200/(x-2) + 30', '1200/(x+2)', '1200/x + 30', '1200/(x+30)'], correct: 2, marks: 1 },
    { text: '(iii) The quadratic equation formed from the given condition is:', options: ['x²+30x-1200=0', 'x²-2x+80=0', 'x²-30x-1200=0', 'x²-2x-80=0'], correct: 3, marks: 1 },
    { text: '(iv) Cost paid by Priti for each book:', options: ['₹120', '₹150', '₹10', '₹40'], correct: 0, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: price and quantity', questionType: 'case_study',
  explanation: '(1200/x+30)(x-2)=1200 => x²-2x-80=0 => x=10; original price/book=1200/10=₹120 — this (not the hypothetical raised price) is what Priti actually paid, since the real transaction described is the original purchase of x books. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 25',
});
items.push({
  kind: 'case', sourceQuestionNumber: '26', sourcePage: '6.7',
  text: 'A motorboat whose speed in still water is 24 km/hr, takes 1 hour more to go 32 km upstream than to return downstream to the same spot. Based on this information answer the following questions.',
  parts: [
    { text: '(i) What is the speed of the motorboat in going upstream, if speed of the stream is x km/hr?', options: ['(x-24) km/hr', '(24-x) km/hr', '(x+24) km/hr', '32/(24-x) km/hr'], correct: 1, marks: 1 },
    { text: '(ii) The quadratic equation which represents the given information is:', options: ['x²-64x-576=0', 'x²+64x+576=0', 'x²+64x-576=0', 'x²-64x+576=0'], correct: 2, marks: 1 },
    { text: '(iii) Speed of the motorboat in going downstream is:', options: ['16 km/hr', '8 km/hr', '28 km/hr', '32 km/hr'], correct: 3, marks: 1 },
    { text: '(iv) Time taken by the motorboat to go 272 km downstream is:', options: ['8½ hours', '17 hours', '12½ hours', '6½ hours'], correct: 0, marks: 1 },
    { text: '(v) Time taken by the motorboat to go 80 km upstream and then to return back to the same spot is:', options: ['5½ hours', '6½ hours', '7½ hours', '8½ hours'], correct: 2, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: upstream/downstream motorboat speed', questionType: 'case_study',
  explanation: 'NEEDS_REVIEW: 32/(24-x) - 32/(24+x) = 1 => x²+64x-576=0 (D=6400=80²) => x=8. Downstream speed=24+8=32 km/hr; 272/32=8.5=8½ hrs; time for 80 km upstream+downstream = 80/16+80/32=5+2.5=7½ hrs. These independently-verified values for (ii) x²+64x-576=0, (iii) 32 km/hr, (iv) 8½ hours are internally consistent with each other and with parts (i) and (v) (both of which DO match the printed key exactly). The printed answer key instead lists (ii) D [x²-64x+576=0, non-perfect-square discriminant], (iii) A [16 km/hr], (iv) C [12½ hours] for this item — none of which is consistent with x=8 or with each other, and the pattern (key(ii)=our(iii), key(iii)=our(iv), key(iv)=our(ii)) suggests the printed key\'s three answers for (ii)-(iv) are shifted one column rather than reflecting a genuine alternate solution. We use the independently-verified values (ii) C, (iii) D, (iv) A and flag this item for review rather than silently forcing a match to the printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'needs_review',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 26 — DISCREPANCY: key\'s (ii)/(iii)/(iv) appear column-shifted relative to independent computation; see explanation',
});
items.push({
  kind: 'case', sourceQuestionNumber: '27', sourcePage: '6.7',
  text: 'Raj and Simran are playing with marbles. They have together 45 marbles. Both of them lost 5 marbles each and the product of the number of marbles they have now is 124.',
  parts: [
    { text: '(i) If Raj had x number of marbles, then number of marbles Simran had in terms of x:', options: ['(x-45)', '(40-x)', '(x-5)', '(45-x)'], correct: 3, marks: 1 },
    { text: '(ii) Number of marbles with Simran, when she lost 5 marbles:', options: ['(x-45)', '(40-x)', '(45-x)', '(x-40)'], correct: 1, marks: 1 },
    { text: '(iii) The quadratic equation formed from the given condition is:', options: ['x²-45x+324=0', 'x²-45x+200=0', 'x²+45x-324=0', 'x²-45x+124=0'], correct: 0, marks: 1 },
    { text: '(iv) Number of marbles left with Raj, when he lost 5 marbles:', options: ['36', '9', '31', '14'], correct: 2, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: symmetric two-person split', questionType: 'case_study',
  explanation: '(x-5)(40-x)=124 => x²-45x+324=0 (D=729=27²) => x=36 or x=9, both mathematically valid (the equation is symmetric between the two boys\' shares). Printed key takes x=36, so Raj has 36-5=31 marbles left after losing 5 — adopted as printed since either root is legitimate depending on which boy is labelled "Raj".',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 27',
});
items.push({
  kind: 'case', sourceQuestionNumber: '28', sourcePage: '6.8',
  text: 'Sumeet wishes to fit three rods together in the shape of right triangle. If the hypotenuse is 2 cm longer than the base and 4 cm longer than the shorter side.',
  parts: [
    { text: '(i) Taking length of the hypotenuse to be x, find the length of shorter side in terms of x:', options: ['(x-4)', '(x-2)', '(4-x)', '(2-x)'], correct: 0, marks: 1 },
    { text: '(ii) Using Pythagoras Theorem, quadratic equation formed from the given condition is:', options: ['x²-12x-20=0', 'x²-12x+20=0', '2x²-12x-20=0', '2x²-12x+20=0'], correct: 1, marks: 1 },
    { text: '(iii) Perimeter of right-angled triangle:', options: ['42 cm', '20 cm', '32 cm', '24 cm'], correct: 3, marks: 1 },
    { text: '(iv) Area of right-angled triangle:', options: ['32 cm²', '48 cm²', '24 cm²', '42 cm²'], correct: 2, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: Pythagoras theorem', questionType: 'case_study',
  explanation: '(x-2)²+(x-4)²=x² => x²-12x+20=0 (D=64=8²) => x=10 (hyp), base=8, shorter=6; perimeter=24; area=(1/2)(8)(6)=24. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 28',
});
items.push({
  kind: 'case', sourceQuestionNumber: '29', sourcePage: '6.8',
  text: 'In an auditorium, the number of rows was equal to the number of seats in each row. If the number of rows is double and the number of seats in each row is reduced by 5, then the total number of seats is increased by 375.',
  parts: [
    { text: '(i) Taking number of rows to be x, then total number of seats in an auditorium is:', options: ['2x', 'x²', 'x²-5', '2x²'], correct: 1, marks: 1 },
    { text: '(ii) If the number of rows is double and the number of seats in each row is reduced by 5, then total number of seats in an auditorium after rearrangement is:', options: ['2x²-10', 'x²-10x', '2x²+10x', '2x²-10x'], correct: 3, marks: 1 },
    { text: '(iii) Total number of seats is increased by 375 after rearrangement. Form the quadratic equation in x to represent the above conditions:', options: ['2x²-10x-375=0', 'x²-10x+375=0', 'x²-10x-375=0', '2x²-10x+375=0'], correct: 2, marks: 1 },
    { text: '(iv) Find number of seats in each row after rearrangement:', options: ['50', '25', '625', '20'], correct: 3, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: rows and seats rearrangement', questionType: 'case_study',
  explanation: 'x²-10x-375=0 (D=1600=40²) => x=25 (rows before); seats/row after = 25-5=20. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 29',
});
items.push({
  kind: 'case', sourceQuestionNumber: '30', sourcePage: '6.8',
  text: 'A two-digit number contains the smaller of the two digits in the unit place. Condition I: The product of the digits is 24. Condition II: The difference between the digits is 5.',
  parts: [
    { text: '(i) Taking the digit in unit place as x, then using Condition I, digit in tens place will be:', options: ['24/x', 'x/24', '24/(10x)', '10x/24'], correct: 0, marks: 1 },
    { text: '(ii) Which condition will satisfy Condition II:', options: ['(x²-24)/x = 5', '(24-x²)/x = 5', '24/x - 10x = 5', '(10x²-24)/x = 5'], correct: 1, marks: 1 },
    { text: '(iii) Which of the following represents the simplified quadratic equation?', options: ['x²+5x+24=0', 'x²-5x+24=0', 'x²+5x-24=0', 'x²-10x+48=0'], correct: 2, marks: 1 },
    { text: '(iv) Original number representing the above condition is:', options: ['72', '27', '38', '83'], correct: 3, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: two-digit number, digits', questionType: 'case_study',
  explanation: 'tens digit=24/x; since tens > units ("smaller digit in unit place"): 24/x - x = 5 i.e. (24-x²)/x=5 => x²+5x-24=0 (D=121=11²) => x=3, tens=8; number=83. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 30',
});
items.push({
  kind: 'case', sourceQuestionNumber: '31', sourcePage: '6.8-6.9',
  text: 'The length of a rectangle exceeds the breadth by 5 metres.',
  parts: [
    { text: '(i) Taking the length as x metres, find the area of the rectangle in terms of x:', options: ['(x²+5x) m²', '(x²-5x) m²', '(5x-x²) m²', '(-x²-5x) m²'], correct: 1, marks: 1 },
    { text: '(ii) If the length is decreased by 9 m and the breadth were doubled, then new area of the rectangle in terms of x:', options: ['(x²-23x-50) m²', '(2x²-28x+90) m²', '(2x²+28x-50) m²', '(x²-3x+140) m²'], correct: 1, marks: 1 },
    { text: '(iii) The area would have increased by 140 m². Write an equation in x to represent the statement:', options: ['x²-23x-50=0', '2x²-28x-50=0', '2x²+28x-50=0', 'x²-3x+140=0'], correct: 0, marks: 1 },
    { text: '(iv) The area of the rectangle is:', options: ['50 m²', '400 m²', '625 m²', '500 m²'], correct: 3, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: rectangle dimensions and area', questionType: 'case_study',
  explanation: 'length=x, breadth=(x-5), area=x²-5x. New: (x-9)·2(x-5)=2x²-28x+90. Increase of 140: x²-23x-50=0 (D=729=27²) => x=25; original area=25×20=500 m². All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 31',
});
items.push({
  kind: 'case', sourceQuestionNumber: '32', sourcePage: '6.9',
  text: 'The sum of ages of a mother and her daughter is 40 years.',
  parts: [
    { text: "(i) By taking x years as the daughter's present age, then mother's present age is:", options: ['(40-x)', '(x-40)', '(x+40)', '(35-x)'], correct: 0, marks: 1 },
    { text: '(ii) Age of mother five years ago in terms of x:', options: ['(35+x)', '(x-35)', '(35-x)', '(35-x)'], correct: 3, marks: 1 },
    { text: "(iii) Five year ago, the mother's age was square of her daughter's age. Frame the quadratic equation in x:", options: ['x²-70x+1230=0', 'x²-9x-10=0', '2x²-9x-10=0', '2x²-70x+1230=0'], correct: 1, marks: 1 },
    { text: '(iv) Age of mother, when daughter is 15 years old:', options: ['30 years', '45 years', '25 years', '35 years'], correct: 3, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: ages', questionType: 'case_study',
  explanation: 'Mother 5 yrs ago=(40-x)-5=35-x (note: options C and D for part (ii) are printed identically as "(35-x)" in the source itself — an apparent typesetting duplication; both are numerically correct, and the printed key\'s choice of D is adopted). (35-x)=(x-5)² => x²-9x-10=0 (D=121=11²) => x=10 (daughter\'s present age); mother=30. When daughter is 15 (5 yrs later), mother=35. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 32',
});
items.push({
  kind: 'case', sourceQuestionNumber: '33', sourcePage: '6.9-6.10',
  text: 'If the sum of the present ages of Aradhya and Manoj is 47 years. Manoj is elder than Aradhya. The product of their present ages in years is 550. Then:',
  parts: [
    { text: "(i) Manoj's present age is:", options: ['21 years', '23 years', '24 years', '25 years'], correct: 3, marks: 1 },
    { text: "(ii) Aradhya's present age is:", options: ['22 years', '23 years', '24 years', '25 years'], correct: 0, marks: 1 },
    { text: '(iii) Difference of their age is:', options: ['2 years', '3 years', '4 years', '5 years'], correct: 1, marks: 1 },
    { text: "(iv) On decreasing Manoj's age by 2 years, and increasing Aradhya's age by 4 years, what is the ratio of their ages?", options: ['23:26', '27:31', '31:33', '20:29'], correct: 0, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: ages, sum and product', questionType: 'case_study',
  explanation: 'm(47-m)=550 => m²-47m+550=0 (D=9) => m=25 (elder) or 22; Manoj=25, Aradhya=22; difference=3; ratio (25-2):(22+4)=23:26. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 33',
});
items.push({
  kind: 'case', sourceQuestionNumber: '34', sourcePage: '6.10',
  text: "At present Anupam's age is 2 more than the square of Anushree's age. When Anushree grows to Anupam's age, Anupam's age would be one year less than ten times the present age of Anushree.",
  parts: [
    { text: "(i) Anupam's present age is:", options: ['7 years', '17 years', '27 years', '37 years'], correct: 2, marks: 1 },
    { text: "(ii) Anushree's present age is:", options: ['5 years', '10 years', '15 years', '20 years'], correct: 0, marks: 1 },
    { text: '(iii) Difference between both the ages:', options: ['11 years', '22 years', '10 years', '30 years'], correct: 1, marks: 1 },
    { text: "(iv) Difference between twice the Anupam's age and four times the Anushree's age:", options: ['32 years', '34 years', '36 years', '38 years'], correct: 1, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: ages, future comparison', questionType: 'case_study',
  explanation: "Let Anushree's present age=y, Anupam's=y²+2. In (y²+2-y) years, Anushree reaches Anupam's present age, and at that time Anupam's age = (y²+2)+(y²+2-y) = 2y²-y+4, which equals 10y-1 => 2y²-11y+5=0 (D=81=9²) => y=5; Anupam's age=27. Difference=22. 2(27)-4(5)=54-20=34. All four independently verified, matching printed key.",
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 34',
});
items.push({
  kind: 'case', sourceQuestionNumber: '35', sourcePage: '6.10-6.11',
  text: 'A rectangular garden plot 16 m by 24 m is to be bordered by a strip of uniform width x m wide on the outside so as to double the area.',
  parts: [
    { text: '(i) The area of the rectangle plot is:', options: ['384 m²', '385 m²', '386 m²', '387 m²'], correct: 0, marks: 1 },
    { text: '(ii) The area of the new rectangular garden is:', options: ['755 m²', '768 m²', '749 m²', '745 m²'], correct: 1, marks: 1 },
    { text: '(iii) The value of x is:', options: ['1', '2', '3', '4'], correct: 3, marks: 1 },
    { text: '(iv) The perimeter of new rectangular garden is:', options: ['105 m', '110 m', '108 m', '112 m'], correct: 3, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: bordered rectangle, doubled area', questionType: 'case_study',
  explanation: '16×24=384; doubled=768; (16+2x)(24+2x)=768 => x²+20x-96=0 (D=784=28²) => x=4; new dimensions 24×32; perimeter=2(24+32)=112. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 35',
});
items.push({
  kind: 'case', sourceQuestionNumber: '36', sourcePage: '6.11',
  text: 'Shopkeeper bought some calculators for ₹4800.',
  parts: [
    { text: '(i) Taking number of calculators as x, cost price of each calculator in terms of x:', options: ['4800/(x-2)', '4800/x', '4800/x - 2', 'x/4800'], correct: 1, marks: 1 },
    { text: '(ii) Two calculators were damaged, remaining calculators were sold for ₹40 more than he had paid for each, then total selling price of remaining calculators is:', options: ['(x-2)(4800/x - 40)', '(x+40)(4800/(x-2))', '(x-2)(4800/x + 40)', '(x+2)(4800/(x+40))'], correct: 2, marks: 1 },
    { text: '(iii) He made a profit of ₹800 on the whole transaction, frame an equation in x:', options: ['x²-22x-240=0', 'x²-2x-1400=0', 'x²-2x+1400=0', 'x²-22x+240=0'], correct: 0, marks: 1 },
    { text: '(iv) Cost price of each calculator is:', options: ['₹160', '₹30', '₹70', '₹200'], correct: 0, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: profit on damaged-goods sale', questionType: 'case_study',
  explanation: '(x-2)(4800/x+40)=5600 => x²-22x-240=0 (D=1444=38²) => x=30; CP/calculator=4800/30=₹160. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 36',
});
items.push({
  kind: 'case', sourceQuestionNumber: '37', sourcePage: '6.11-6.12',
  text: 'Some students planned a picnic. The total budget for hiring a bus was ₹1440. Later on eight of them refused to go and instead paid their total share of money towards the fee of one economically weaker student of their class and thus, the cost for member who went for picnic is increased by ₹30. (The source labels the fourth sub-part below "(vi)" instead of "(iv)"; renumbered here in logical order to match content and the printed key\'s 5-part numbering.)',
  parts: [
    { text: '(i) If x students planned for the picnic, then the share for hiring the bus per student who went for the picnic was:', options: ['₹30x', '₹1440x', '₹(1440/x)', '₹(1440/(x-8))'], correct: 2, marks: 1 },
    { text: '(ii) The algebraic representation of the given information in the form of a quadratic equation is:', options: ['x²-8x-384=0', 'x²+8x-384=0', 'x²-8x-184=0', 'x²+8x-184=0'], correct: 0, marks: 1 },
    { text: '(iii) How many students went for the picnic?', options: ['24', '16', '32', '2'], correct: 1, marks: 1 },
    { text: '(iv) How much money was paid towards the fee?', options: ['₹280', '₹340', '₹420', '₹480'], correct: 3, marks: 1 },
    { text: '(v) What would be the share of each student if all the students had attended the picnic?', options: ['₹90', '₹30', '₹60', '₹80'], correct: 2, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: shared cost redistribution', questionType: 'case_study',
  explanation: '1440/(x-8) - 1440/x = 30 => x²-8x-384=0 (D=1600=40²) => x=24 (planned); attendees=24-8=16; the 8 refusers paid 8×(1440/24)=8×60=₹480 towards the weak student\'s fee; if all 24 had attended, share=1440/24=₹60. All five independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 37',
});
items.push({
  kind: 'case', sourceQuestionNumber: '38', sourcePage: '6.12',
  text: 'The denominator of a fraction is one more than twice the numerator.',
  parts: [
    { text: '(i) Taking denominator as x, then fraction formed in terms of x is:', options: ['(x-1)/2x', '(x+1)/2x', '2x/(2x+1)', '(2x-1)/2x'], correct: 0, marks: 1 },
    { text: '(ii) If the sum of the fraction and its reciprocal is 2 16/21, then the condition satisfy is:', options: ['(x+1)/2x + 2x/(x+1) = 2 16/21', '(x-1)/2x + 2x/(x-1) = 2 16/21', '(2x+1)/x + x/(2x+1) = 2 16/21', '(2x-1)/x + (2x-1)/x = 2 16/21'], correct: 1, marks: 1 },
    { text: '(iii) After simplification the quadratic equation formed is:', options: ['11x²-26x-21=0', '11x²+74x-21=0', '11x²-74x-21=0', '11x²+26x-21=0'], correct: 2, marks: 1 },
    { text: '(iv) Fraction formed is:', options: ['3/7', '7/3', '2/5', '5/2'], correct: 0, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: fraction and its reciprocal', questionType: 'case_study',
  explanation: 'denominator=x=2n+1 => numerator n=(x-1)/2; fraction=(x-1)/(2x). Sum with reciprocal=58/21 => 11x²-74x-21=0 (D=6400=80²) => x=7; fraction=6/14=3/7. All four independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 38',
});
items.push({
  kind: 'case', sourceQuestionNumber: '39', sourcePage: '6.12',
  text: 'Two water taps together fill a tank in 1 7/8 hours. The tap with larger diameter takes 2 hours less than the tap with smaller one to fill the tank completely. Based on the above information, answer the following questions. (The source numbers the sub-parts (i)-(iii), then "(vi)", then "(v)"; presented here in logical order as (i)-(v), matching content and the printed key\'s 5-part numbering.)',
  parts: [
    { text: '(i) If time taken by the tap with smaller diameter to fill the tank alone be x hours, then part of the tank filled by the tap with larger diameter alone in 2 hours is:', options: ['2(x+2)', '2(x-2)', '2/(x+2)', '2/(x-2)'], correct: 3, marks: 1 },
    { text: '(ii) The quadratic equation representing the given information is:', options: ['4x²-23x+15=0', '2x²-23x+15=0', '4x²+23x-15=0', '2x²+23x-15=0'], correct: 0, marks: 1 },
    { text: '(iii) Time taken by the larger tap to fill the tank alone is:', options: ['5 hours', '3 hours', '7 hours', '9 hours'], correct: 1, marks: 1 },
    { text: '(iv) The part of the tank which can be filled by the smaller tap in 3 hours is:', options: ['1/3', '1/5', '3/5', '3/7'], correct: 2, marks: 1 },
    { text: '(v) The part of the tank which can be filled by the larger tap in 1¼ hours is:', options: ['5/12', '3/5', '5/8', '3/8'], correct: 0, marks: 1 },
  ], difficulty: 'Medium', subConcept: 'Applied quadratic word problem: pipes and cisterns', questionType: 'case_study',
  explanation: '1/x + 1/(x-2) = 8/15 => 4x²-23x+15=0 (D=289=17²) => x=5 (smaller tap); larger tap time=x-2=3 hrs. Smaller tap fills 3/5 in 3 hrs; larger tap fills (5/4)/3=5/12 in 1¼ hrs. All five independently verified, matching printed key.',
  diagramStatus: 'not_applicable', answerStatus: 'verified',
  answerKeyRef: 'printed ANSWERS table, p.25.4, item 39',
});

// AR items 40-41: source's "simple" 4-option scheme.
const AR_SIMPLE = [
  'A is true, R is false',
  'A is false, R is true',
  'Both A and R are true',
  'Both A and R are false.',
];
const arSimple = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '6.13', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_SIMPLE, correctIdx, { questionType: 'assertion_reasoning', ...opts });
// AR items 42-44: source's "full" 4-option scheme.
const AR_FULL = [
  'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
  'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).',
  'Assertion (A) is true and Reason (R) is false.',
  'Assertion (A) is false and Reason (R) is true.',
];
const arFull = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '6.13-6.14', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_FULL, correctIdx, { questionType: 'assertion_reasoning', ...opts });

items.push(
  arSimple(40,
    '50 is divided into two parts such that the sum of their reciprocals is 1/12, then two parts are 20 and 30.',
    'We can form a quadratic equation to solve the above problem as below: x + 1/(50-x) = 1/12',
    0, { explanation: 'Assertion is true: 1/20 + 1/30 = 3/60 + 2/60 = 5/60 = 1/12. Reason is false as printed: the correct equation is 1/x + 1/(50-x) = 1/12 (reciprocal of x, not x itself) — A true, R false, matches printed key.' }),
  arSimple(41,
    'Namita is twice as old as her sister Kavita. After four years, the product of their ages (in years) will be 160. According to the above condition, quadratic equation formed is: x²+6x-72=0',
    "The concept of quadratic equation can be used to solve the problems. Namita's present age will be 12 years.",
    2, { explanation: "Let Kavita=x, Namita=2x. (x+4)(2x+4)=160 => 2x²+12x-144=0 => x²+6x-72=0, matching Assertion's equation (D=324=18²) => x=6, Namita=12, matching Reason's claim. Both true, matches printed key." }),
);
items.push(
  arFull(42,
    'The sum of the squares of two consecutive natural numbers is 313, then the equation formed from the given condition is (x+x+1)² = 313.',
    'The two numbers are 12 and 13.',
    3, { explanation: "Assertion's equation is wrong: the correct equation is x²+(x+1)²=313 (sum of squares), not (x+(x+1))²=313 (square of the sum) — Assertion is false. Reason is true: 12²+13²=144+169=313 — A false, R true, matches printed key." }),
  arFull(43,
    'A train travels 360 km at a uniform speed. If the speed had been 5 km/hr more, it would have taken 1 hour less for the same journey. If the original speed of the train is x km/hr. For the above question: According to the condition: 360/(x+5) - 360/x = 1',
    'If the time taken to travel 360 km at a speed of x km/hr is t1 and if the time taken to travel 360 km at a speed of (x+5) km/hr is t2. So t1 = 360/x hr and t2 = 360/(x+5) hr, then t1 - t2 = 1.',
    3, { explanation: "Assertion's equation has the sign reversed: since the faster speed (x+5) gives the shorter time, the correct relation is 360/x - 360/(x+5) = 1 (slower time minus faster time), not 360/(x+5) - 360/x = 1 as printed — Assertion is false. Reason correctly derives t1-t2=1 with t1=360/x, t2=360/(x+5) — Reason is true. A false, R true, matches printed key." }),
  arFull(44,
    'A natural number, when increased by 12, equals 160 times its reciprocal. The number is 20.',
    'The roots of a quadratic equation ax² + bx + c = 0 are given by the formula: x = (-b ± √(b²-4ac))/2a',
    3, { explanation: 'Solving x+12=160/x gives x²+12x-160=0 (D=784=28²), x=8 — the correct number is 8, not 20 as asserted; Assertion is false. The quadratic formula stated in the Reason is a correct, general fact — Reason is true. A false, R true, matches printed key.' }),
);

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'Problems on Quadratic Equations',
  chapterOrder: 6,
  label: 'ICSE Class 10 Mathematics — Problems on Quadratic Equations: 44 items (19 plain word-problem MCQ, 20 multi-part case-study word problems, 5 Assertion-Reason), full chapter, from chap_6.pdf, every item independently re-verified by translating the word problem into an equation and solving from scratch against the printed key (42/44 matched exactly; item 26 flagged needs_review as the printed key\'s (ii)-(iv) appear column-shifted relative to independent computation; item 27(iv) has two valid roots, printed key\'s choice adopted and disclosed)',
  status: 'verified',
  answerStatus: 'verified',
  sourceSection: 'Multiple Choice Questions + Assertion and Reasoning (full chapter, pp.6.2-6.14)',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
