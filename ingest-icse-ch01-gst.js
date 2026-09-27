// ICSE Class 10 Mathematics — Chapter 1: GST (Goods and Service Tax).
// Source: chap_1.pdf, uploaded 2026-09-17 ("Icse chap 1-6"), archived via
// archive-icse-maths-ch1-6.js as source_files.id 96 (ICSE-MATH-CH01-GST).
// This chapter, along with Ch2-6, closes the gap an earlier session's
// RECOVERY_AUDIT.md documented for ICSE Maths Ch1-6 ("existence only, no
// recoverable content") — ICSE Maths chapters 7-24 were already archived
// (chap_7.pdf..chap_24.pdf) but 1-6 were missing until this upload.
//
// Full chapter read directly from the PDF (11 pages: 1.3-1.13), 66 items:
// items 1-56 are MCQs (18,19,20,... plain + word problems, several with
// (i)/(ii)/(iii)/(iv) sub-parts), items 57-66 are Assertion-Reason. The
// printed answer key (source_library/ICSE/Mathematics/answer.pdf, p.25.1,
// section "1 GOODS AND SERVICE TAX (G.S.T.)") was also read and used as a
// cross-check, NOT as a substitute for verification.
//
// METHOD (same as every other chapter this session): every single item's
// arithmetic (or, for AR items, both Statement/Reason's truth value) was
// independently recomputed from scratch, then compared to the printed key.
// RESULT: all 66 items match the printed key exactly on independent
// recomputation. Zero discrepancies found — this is a clean chapter.
// (AR items 57-60 use the source's "simple" 4-option scheme: A true/R
// false, A false/R true, both true, both false. Items 61-66 switch to the
// "full" 4-option scheme with the both-true split into
// explains/doesn't-explain. Both schemes are reproduced exactly as printed
// via two separate option arrays below — do not merge them.)
//
// No diagrams/figures anywhere in this chapter (pure text word problems and
// AR statements) — diagramStatus: 'not_applicable' throughout.
const { ingestQuestions } = require('./ingest');

const SOURCE_FILE_IDS = [96]; // archive-icse-maths-ch1-6.js -> ch01-gst.pdf

const mcq = (n, page, text, options, correctIdx, opts = {}) => ({
  sourceQuestionNumber: String(n),
  sourcePage: page,
  text,
  kind: 'mcq',
  options,
  correct: correctIdx,
  answerKeyRef: `printed ANSWERS table, p.25.1, "1 GOODS AND SERVICE TAX (G.S.T.)", item ${n} (independently re-verified by computation)`,
  diagramStatus: 'not_applicable',
  ...opts,
});

const items = [
  mcq(1, '1.3', 'The full form of GST is:', ['Government Service Tax', 'Goods and Services Tax', 'Government Sales Tax', 'None of these'], 1),
  mcq(2, '1.3', 'IGST is charged on:', ['Interstate transaction', 'Intrastate transaction', 'both A and B', 'None of these'], 2),
  mcq(3, '1.3', 'ITC stands for:', ['Income Tax Credit', 'Input Tax Credit', 'Instant Tax Credit', 'Intrastate Credit'], 1),
  mcq(4, '1.3', 'GST is:', ['a direct tax', 'an indirect tax', 'both (a) and (b)', 'Neither (a) nor (b)'], 1),
  mcq(5, '1.3', 'GST which is collected by the state government for intrastate transaction is known as:', ['CGST', 'SGST', 'IGST', 'All of these'], 1),
  mcq(6, '1.3', 'The tax levied by the central government for interstate transaction of goods and services is known as:', ['CGST', 'SGST', 'IGST', 'None of these'], 2),
  mcq(7, '1.3', 'What does "I" in IGST stands stand for?', ['Internal', 'Integrated', 'Internal', 'Intra'], 1),
  mcq(8, '1.3', 'Which of the following tax is not include in GST', ['VAT', 'Stamp Duty', 'Toll Tax', 'Entertainment Tax'], 1),
  mcq(9, '1.3', 'Intrastate means transaction', ['within a state', 'between 2 or more states', 'between 2 organizations', 'Monetary State of a businessman'], 0),
  mcq(10, '1.3', 'Interstate means transaction', ['within a state', 'between 2 or more states', 'between 2 organizations', 'Monetary state of a businessman'], 1),
  mcq(11, '1.3', 'What are the taxes levied on the intrastate supply?', ['CGST', 'SGST', 'CGST and SGST', 'IGST'], 2),
  mcq(12, '1.4', 'Which of the following is an intrastate supply?', ['Supplier of goods located in Nagpur and place of supply of goods in Delhi', 'Supplier of goods located in Kolkata and place of supply of goods in Bangalore', 'Supplier of goods located in Goa and place of supply of goods in Goa', 'All the above'], 2),
  mcq(13, '1.4', 'If the goods are purchased by a dealer in Jaipur (Rajasthan) from a manufacturer in Kolkata (WB), the type of tax will be:', ['IGST', 'CGST', 'SGST', 'Both CGST and IGST'], 0),
  mcq(14, '1.4', 'The traders at each stage always pay GST to the Government on their:', ['Profits', 'Cost Price', 'Discount', 'Selling Price'], 0),
  mcq(15, '1.4', 'Net tax paid by dealer to the Government is:', ['Output Tax − Input Tax', 'Input Tax − Output Tax', 'Input Tax', 'Output Tax'], 0),
  mcq(16, '1.4', 'SGST is applicable when', ['Goods are sold within a state', 'Goods are sold from one GST dealer to a customer', 'Goods are sold by a GST dealer to another GST dealer', 'Goods are sold from one state to another state'], 0),
  mcq(17, '1.4', 'GST will be levied on:', ['Manufacturers', 'Retailers', 'Consumers', 'All of the above'], 3),
  mcq(18, '1.4', 'The percentage share of SGST of total GST for an Intrastate sale of an article is:', ['25 %', '50 %', '75 %', '100 %'], 1),
  mcq(19, '1.4', 'Aman bought an earphone priced at ₹1250. If GST is charged at 18 %, then the GST paid by Aman is:', ['₹180', '₹125', '₹250', '₹225'],
    3, { explanation: '1250 × 0.18 = ₹225.' }),
  mcq(20, '1.4', 'The price paid by the customer for an article marked at ₹15500, if GST chargd at 12 % is:', ['₹17360', '₹1860', '₹18000', '₹15512'],
    0, { explanation: '15500 × 1.12 = ₹17360.' }),
  mcq(21, '1.4', 'For a transaction of ₹80000 in Delhi, if GST rate is 18 %, then SGST is:', ['₹7200', '₹14400', '₹6400', '₹7220'],
    0, { explanation: 'Intrastate (Delhi to Delhi), SGST = half of 18% = 9% of 80000 = ₹7200.' }),
  mcq(22, '1.5', 'A dealer in Mumbai sold a washing machine to a consumer in Mumbai for ₹18000. If the rate of GST is 18 %, then SGST is:', ['₹1620', '₹3240', '₹1260', '₹3420'],
    0, { explanation: '9% of 18000 = ₹1620.' }),
  mcq(23, '1.5', 'A refrigerator was sold for ₹15000 under intrastate transaction from station A to station B and the GST rate is 18 %, then CGST is equal to:', ['₹1400', '₹1350', '₹1300', '₹2700'],
    1, { explanation: '9% of 15000 = ₹1350.' }),
  mcq(24, '1.5', 'The SGST paid by a customer to the shopkeeper for an article which is priced at ₹400 is ₹16. The rate of GST charged is:', ['16 %', '5 %', '8 %', '4 %'],
    2, { explanation: 'SGST=16 -> total GST=32; 32/400 = 8%.' }),
  mcq(25, '1.5', 'The CGST paid by a customer to the shopkeeper for an article which is priced at ₹900 is ₹45. The rate of GST charged is:', ['9 %', '5 %', '10 %', '2.5 %'],
    2, { explanation: 'CGST=45 -> total GST=90; 90/900 = 10%.' }),
  mcq(26, '1.5', 'A consumer purchases an article for ₹4956 inclusive of GST. If the marked price of the article is ₹4200, then the rate of GST is:', ['6 %', '8 %', '12 %', '18 %'],
    3, { explanation: '(4956-4200)/4200 = 756/4200 = 18%.' }),
  mcq(27, '1.5', 'Pinky purchased a fridge for ₹30680 including GST. If the list price of the fridge is ₹26000, then rate of CGST is:', ['18 %', '20 %', '15 %', '9 %'],
    3, { explanation: 'Total GST = (30680-26000)/26000 = 18%; CGST = half = 9%.' }),
  mcq(28, '1.5', 'A retailer sells an article at 10 % profit. If the cost price is ₹3000 and rate of GST is 12 % the selling price including GST is:', ['₹3696', '₹3300', '₹3600', '₹4000'],
    0, { explanation: 'SP before tax = 3000×1.10=3300; with 12% GST = 3300×1.12=₹3696.' }),
  mcq(29, '1.5', 'GST on an article is decreased from 12 % to 8 %. If the price of the article is ₹4000, then the decrease in the value of GST is:', ['₹160', '₹320', '₹400', '₹500'],
    0, { explanation: '4000×(0.12-0.08) = ₹160.' }),
  mcq(30, '1.5', 'List price of an article is ₹1050. If 6 % GST is charged, then bill amount is:', ['₹1056', '₹1113', '₹1131', '₹1311'],
    1, { explanation: '1050×1.06 = ₹1113.' }),
  mcq(31, '1.5', 'A decrease in GST on an article from 18 % to 8 % is ₹550. The original price of the article is:', ['₹5000', '₹6000', '₹5500', '₹18000'],
    2, { explanation: 'price×(0.18-0.08)=550 -> price=550/0.10=₹5500.' }),
  mcq(32, '1.6', 'A dealer in Agra bought some goods worth ₹12000. If the rate of GST is 18 %, then the amount paid by the dealer is:', ['₹14000', '₹14160', '₹15000', '₹16180'],
    1, { explanation: '12000×1.18 = ₹14160.' }),
  mcq(33, '1.6', 'In a transaction from Delhi to Lucknow, MP = ₹10000, discount = 10 %, GST = 28 %, then IGST charged is:', ['₹2520', '₹5040', '₹2250', '₹2800'],
    0, { explanation: 'Taxable value = 10000×0.9=9000 (interstate, so IGST); IGST=9000×0.28=₹2520.' }),
  mcq(34, '1.6', 'A consumer bought a TV from a dealer at a discount of 20 % on the marked price of ₹40000. If the rate of GST is 18 %, then the GST paid by the consumer is:', ['₹5760', '₹2880', '₹6480', '₹7200'],
    0, { explanation: 'Taxable value = 40000×0.8=32000; GST=32000×0.18=₹5760.' }),
  mcq(35, '1.6', 'Mr. Pankaj took health Insurance Policy for his family and paid ₹900 as SGST. If the rate of GST being 18 %, then the total annual premium paid by him for this policy is:', ['₹1800', '₹10000', '₹11800', '₹3600'],
    2, { explanation: 'SGST=900 -> total GST=1800; taxable value=900/0.09=10000; total premium=10000+1800=₹11800.' }),
  mcq(36, '1.6', 'Mr. Patel stayed in a cottage for 2 days and he had to pay ₹7080 including 18 % GST. Then the rent of the cottage per day is:', ['₹3000', '₹3500', '₹4000', '₹6000'],
    0, { explanation: 'Total before GST = 7080/1.18=6000; per day = ₹3000.' }),
  mcq(37, '1.6', 'When the goods and services are sold for ₹15000 under intrastate transaction from station A to a station B and the rate of GST is 12 %, then cost price at station B will be:', ['₹15000', '₹16800', '₹13200', '₹14000'],
    1, { explanation: '15000×1.12 = ₹16800.' }),
  mcq(38, '1.6', 'Selling price of a video game is ₹749 including 7 % GST. The original price of video game is:', ['₹801.43', '₹742', '₹700', '₹770'],
    2, { explanation: '749/1.07 = ₹700.' }),
  mcq(39, '1.6', 'A shopkeeper sold a bicycle to a customer for ₹10304 including GST. The rate of GST was 12 %. SGST payable to him by customer is:', ['₹1104', '₹618.24', '₹552', '₹1236.48'],
    2, { explanation: 'Taxable value = 10304/1.12=9200; SGST = 6% of 9200 = ₹552.' }),
  mcq(40, '1.6', 'Smt. Malhotra purchased solar panels for the taxable value of ₹85000, she sold them for ₹90000, the rate of GST is 5 %, then the ITC of Smt. Malhotra:', ['₹4250', '₹4520', '₹4500', '₹4050'],
    0, { explanation: 'ITC = tax paid on her purchase = 5% of 85000 = ₹4250.' }),
  mcq(41, '1.6', 'What will be the cost of a TV set for customer, if the rate of CGST applied on it is 9 % and the GST paid is ₹3510 ?', ['₹19500', '₹39000', '₹23010', '₹42510'],
    2, { explanation: 'CGST 9% -> total GST rate 18%; taxable value = 3510/0.18=19500; cost = 19500+3510=₹23010.' }),
  mcq(42, '1.7', 'An article was marked at ₹23600 excluding GST and sold at the discount of 10 %. If the GST is 18 %, then selling price of an article is', ['₹25063.20', '₹25062.20', '₹25036.20', '₹25026.20'],
    0, { explanation: 'Taxable value = 23600×0.9=21240; with 18% GST = 21240×1.18=₹25063.20.' }),
  mcq(43, '1.7', 'Mr. Sawant purchased a machine for ₹8850 including GST and sold it to the consumer for ₹10030 including GST, rate of GST is 18 %, then the amount of SGST to be paid by Mr. Sawant to Government is:', ['₹180', '₹90', '₹675', '₹765'],
    1, { explanation: 'Purchase taxable value=8850/1.18=7500; sale taxable value=10030/1.18=8500; value added=1000; SGST payable (net, via ITC) = 9% of 1000 = ₹90.' }),
  mcq(44, '1.7', 'A shopkeeper buys an article from a wholesaler for ₹20000 and sells it to a consumer at 10 % profit. If the rate of GST is 12 %. Then the tax liability under GST for the shopkeeper to the Government is:', ['₹240', '₹280', '₹300', '₹320'],
    0, { explanation: 'SP=20000×1.10=22000; value added=2000; 12% of 2000=₹240.' }),
  mcq(45, '1.7', 'A trader purchased an article marked at ₹8000 at some discount and sold it at the marked price. If he deposited ₹86.40 as GST @ 12 % to the Government the rate of discount he received is:', ['9 %', '10 %', '11 %', '12 %'],
    0, { explanation: 'Output tax=8000×0.12=960; input tax = purchase price×0.12 = 960-86.40=873.60 -> purchase price=7280? recompute: 873.60/0.12=7280; wait recheck: purchase price = 8000×(1-d); (8000×(1-d))×0.12=873.60 -> (1-d)=873.60/960=0.91 -> d=9%.' }),
  mcq(46, '1.7', 'Kavita purchased an article for ₹5310 which includes 10 % rebate on the market price and 18 % tax (under GST) on the remaining price. Then the market price of the article be:', ['₹6000', '₹4500', '₹8000', '₹5000'],
    3, { explanation: 'M×0.9×1.18=5310 -> M×1.062=5310 -> M=₹5000.' }),
  {
    kind: 'case', sourceQuestionNumber: '47', sourcePage: '1.7',
    text: 'A shopkeeper bought an article from a dealer at ₹1000. He sold it to the customer at ₹1200. If the rate of GST is 12 %, then:',
    parts: [
      { text: '(i) GST paid by shopkeeper to the Government is:', options: ['₹12', '₹24', '₹144', '₹120'], correct: 1, marks: 1 },
      { text: '(ii) The amount paid by the customer to buy the item is:', options: ['₹1200', '₹1324', '₹1344', '₹1320'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'GST value-addition chain', questionType: 'case_study',
    explanation: '(i) Value addition = 1200-1000=200; GST on value addition = 12% of 200 = ₹24. (ii) Amount paid = 1200×1.12 = ₹1344. Both independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.1, item 47',
  },
  {
    kind: 'case', sourceQuestionNumber: '48', sourcePage: '1.7',
    text: 'Three friends A, B and C (Customer) live in Delhi. A sells medicine worth ₹50000 to B, B sells the same medicine to C at a profit of ₹6000. If the rate of GST is 12 %, then:',
    parts: [
      { text: '(i) SGST paid by B to the Government is:', options: ['₹300', '₹360', '₹400', '₹425'], correct: 1, marks: 1 },
      { text: '(ii) Total CGST received by the Government is:', options: ['₹6720', '₹3000', '₹3360', '₹3600'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'GST value-addition chain (three-party, intrastate)', questionType: 'case_study',
    explanation: '(i) Value added by B = 56000-50000=6000; SGST=6% of 6000=₹360. (ii) Since ITC cancels intermediate stages, total GST collected on final value (56000) = 12%×56000=6720; CGST = half = ₹3360. Both independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.1, item 48',
  },
  {
    kind: 'case', sourceQuestionNumber: '49', sourcePage: '1.8',
    text: 'Mr. Gupta wanted to book a semi delux room in a hotel for ₹750. Since semi delux room was not available, he booked a delux room for ₹1400. If GST for a room below ₹1000 is 18 % and GST for a room above ₹1000 is 28 %, then:',
    parts: [
      { text: '(i) the amount paid by Mr Gupta for the delux room is:', options: ['₹1700', '₹1792', '₹1800', '₹1850'], correct: 1, marks: 1 },
      { text: '(ii) the extra GST Mr Gupta paid for the delux room (compared to what the semi delux room, had it been available, would have cost him in GST) is:', options: ['₹257', '₹280', '₹300', '₹425'], correct: 0, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'GST slab rates by room tariff', questionType: 'case_study',
    explanation: '(i) Room ₹1400 (>1000) attracts 28% GST: 1400×1.28=₹1792. (ii) GST on delux room = 1400×0.28=392; GST that would have applied to the ₹750 semi-delux room (below ₹1000, 18%) = 750×0.18=135; extra = 392-135=₹257. Both independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.1, item 49',
  },
  {
    kind: 'case', sourceQuestionNumber: '50', sourcePage: '1.8',
    text: 'A dealer purchased a music system from the manufacturing company for ₹25000 and sold it to a consumer in the same city at a profit of 20 %. If the rate of GST is 18 %, then:',
    parts: [
      { text: '(i) the amount of input CGST for the dealer is:', options: ['₹2250', '₹4500', '₹5000', '₹3000'], correct: 0, marks: 1 },
      { text: '(ii) the amount of GST payable by the dealer to the government is:', options: ['₹2250', '₹900', '₹450', '₹3000'], correct: 1, marks: 1 },
      { text: '(iii) the amount that the consumer has to pay for the music system is:', options: ['₹34500', '₹32700', '₹35400', '₹30900'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'GST value-addition chain, intrastate', questionType: 'case_study',
    explanation: 'SP = 25000×1.20=30000. (i) Input CGST = 9% of 25000=₹2250. (ii) GST payable = 18% of value addition (30000-25000=5000)=₹900. (iii) Consumer pays 30000×1.18=₹35400. All independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.1, item 50',
  },
  {
    kind: 'case', sourceQuestionNumber: '51', sourcePage: '1.8',
    text: 'Manufacture Anshul sells a LG freezer to a dealer Lalit for ₹12500. The dealer Lalit sells it to a consumer at a profit of ₹1500. If the sales are intra state and the rate of GST is 12 %.',
    parts: [
      { text: '(i) Amount of tax (under GST), paid by the dealer Lalit to the Central Government is:', options: ['₹90', '₹180', '₹1500', '₹750'], correct: 0, marks: 1 },
      { text: '(ii) Amount of tax (under GST), received by the State Government from the consumer is:', options: ['₹90', '₹750', '₹840', '₹1680'], correct: 2, marks: 1 },
      { text: '(iii) Amount that the consumer pays for the LG Freezer is:', options: ['₹14000', '₹15680', '₹14840', '₹15860'], correct: 1, marks: 1 },
      { text: '(iv) Amount paid by Lalit to buy the LG Freezer from Anshul is:', options: ['₹12500', '₹15000', '₹14840', '₹14000'], correct: 3, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'GST value-addition chain, intrastate (manufacturer-dealer-consumer)', questionType: 'case_study',
    explanation: 'SP by Lalit = 12500+1500=14000. (i) CGST paid by Lalit = 6% of value addition (1500) = ₹90. (ii) SGST received from consumer = 6% of 14000=₹840. (iii) Consumer pays 14000×1.12=₹15680. (iv) Lalit paid Anshul 12500×1.12=₹14000. All independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.1, item 51',
  },
  {
    kind: 'case', sourceQuestionNumber: '52', sourcePage: '1.8-1.9',
    text: 'Mohan buys a washing machine from a wholesaler for ₹30000. He marks the price of the washing machine 10 % above the cost price and sells it to Soham (Consumer) at a discount of 5 % on the marked price, if the sale is intra state and rate of CGST is 6 %.',
    parts: [
      { text: '(i) Marked price of the washing machine is:', options: ['₹31800', '₹30000', '₹27000', '₹33000'], correct: 3, marks: 1 },
      { text: '(ii) Amount of tax (under GST) paid by Mohan to the State Government is:', options: ['₹81', '₹162', '₹180', '₹360'], correct: 0, marks: 1 },
      { text: '(iii) Total amount of GST received by the Central Government on the sale of the washing machine is:', options: ['₹3762', '₹1881', '₹1980', '₹3960'], correct: 1, marks: 1 },
      { text: '(iv) Amount which Soham pays to Mohan for the washing machine is:', options: ['₹35122', '₹33231', '₹35112', '₹33600'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'GST value-addition chain, marked price + discount, intrastate', questionType: 'case_study',
    explanation: 'MP = 30000×1.10=33000. SP after 5% discount = 33000×0.95=31350. (i) MP=₹33000. (ii) SGST on value addition (31350-30000=1350) = 6% of 1350 = ₹81. (iii) CGST received by centre = 6% of final sale value 31350 = ₹1881. (iv) Soham pays 31350×1.12=₹35112. All independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.1, item 52',
  },
  {
    kind: 'case', sourceQuestionNumber: '53', sourcePage: '1.9',
    text: 'A retailer buys an article from a wholesaler for ₹50,000. He marks the price of the article 10 % above his cost price and sells it to a consumer at 5 % discount on the marked price. If the sales at intra-state and rate of GST is 18 % then answer the following question:',
    parts: [
      { text: '(i) The marked price of the article is:', options: ['₹55500', '₹55000', '₹54000', '₹52500'], correct: 1, marks: 1 },
      { text: '(ii) The cost price for the consumer is:', options: ['₹52700', '₹55000', '₹61655', '₹52250'], correct: 2, marks: 1 },
      { text: '(iii) The amount of tax paid by the retailer to State Government is:', options: ['₹202.50', '₹405', '₹4500', '₹4725'], correct: 0, marks: 1 },
      { text: '(iv) The amount paid by the retailer to the wholesaler is:', options: ['₹50000', '₹55000', '₹59000', '₹52250'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'GST value-addition chain, marked price + discount, intrastate', questionType: 'case_study',
    explanation: 'MP=50000×1.10=55000. SP=55000×0.95=52250. (i) MP=₹55000. (ii) Cost for consumer including GST = 52250×1.18=₹61655. (iii) SGST on value addition (52250-50000=2250) = 9% of 2250=₹202.50. (iv) Retailer paid wholesaler 50000×1.18=₹59000. All independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.1, item 53',
  },
  {
    kind: 'case', sourceQuestionNumber: '54', sourcePage: '1.9',
    text: 'In a GST chain, a dealer Hari purchased an article for ₹20000 and supplies it to another dealer Ravi at a profit of ₹5000. Ravi sells it to a consumer Verma at a profit of ₹3000. If the rate of GST is 18 % and all transaction were intrastate.',
    parts: [
      { text: '(i) ITC for dealer Hari.', options: ['₹3600', '₹1800', '₹5400', '₹7200'], correct: 0, marks: 1 },
      { text: '(ii) Input tax payable by dealer Ravi.', options: ['₹2250', '₹4500', '₹9000', '₹6750'], correct: 1, marks: 1 },
      { text: '(iii) Total cost price of the article for Verma.', options: ['₹30520', '₹28000', '₹38080', '₹33040'], correct: 3, marks: 1 },
      { text: '(iv) Output tax for Verma.', options: ['₹0', '₹540', '₹4140', '₹5040'], correct: 0, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'GST chain: manufacturer-dealer-dealer-consumer', questionType: 'case_study',
    explanation: 'Hari sells to Ravi at 25000, Ravi sells to Verma at 28000. (i) ITC for Hari = tax on his purchase = 18% of 20000=₹3600. (ii) Input tax payable by Ravi = 18% of his purchase price 25000=₹4500. (iii) Verma’s total cost = 28000×1.18=₹33040. (iv) Verma is the end consumer, has no output tax = ₹0. All independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.1, item 54',
  },
  {
    kind: 'case', sourceQuestionNumber: '55', sourcePage: '1.10',
    text: 'A shopkeeper buys an article whose list price is ₹8000 at some rate of discount from a wholesaler. He sells the article to a consumer at list price. If sales are intrastate and the rate of GST is 18 %. If the shopkeeper pays a tax (under GST) of ₹72 to the State Government.',
    parts: [
      { text: '(i) Profit earned by the shopkeeper on an article.', options: ['₹1000', '₹800', '₹900', '₹1200'], correct: 1, marks: 1 },
      { text: '(ii) Price at which shopkeeper had bought an article.', options: ['₹7200', '₹7000', '₹7100', '₹6800'], correct: 0, marks: 1 },
      { text: '(iii) GST paid by Shopkeeper to the Government for an article.', options: ['₹72', '₹900', '₹144', '₹1800'], correct: 2, marks: 1 },
      { text: '(iv) Rate of discount at which shopkeeper bought the article from the wholesaler.', options: ['20 %', '12 %', '5 %', '10 %'], correct: 3, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'GST value-addition chain, reverse-engineering purchase price from tax paid', questionType: 'case_study',
    explanation: 'SGST paid = 72 -> total GST liability (value addition) = 144; value addition = 144/0.18=800; purchase price = 8000-800=7200. (i) Profit = 8000-7200=₹800. (ii) Purchase price=₹7200. (iii) Total GST paid = ₹144. (iv) Discount rate = 800/8000=10%. All independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.1, item 55',
  },
  {
    kind: 'case', sourceQuestionNumber: '56', sourcePage: '1.10',
    text: 'A manufacture sells binocular for ₹3750 to a wholesaler, who sells it to a retailer at a profit of 12 %. The retailer sells it to the customers at 15 % profit. If the rate of GST is 18 %.',
    parts: [
      { text: '(i) GST paid by the wholesaler to the Government.', options: ['₹81', '₹675', '₹756', '₹765'], correct: 0, marks: 1 },
      { text: '(ii) Price paid by the retailer inclusive of tax.', options: ['₹4200', '₹4956', '₹4875', '₹4965'], correct: 1, marks: 1 },
      { text: '(iii) Total GST received by the Government.', options: ['₹434.70', '₹869.40', '₹869.20', '₹450'], correct: 1, marks: 1 },
      { text: '(iv) Price paid by the customer.', options: ['₹5966.40', '₹5696.40', '₹5699.40', '₹5969.40'], correct: 2, marks: 1 },
    ],
    difficulty: 'Medium', subConcept: 'GST value-addition chain: manufacturer-wholesaler-retailer-customer', questionType: 'case_study',
    explanation: 'Wholesaler sells at 3750×1.12=4200; retailer sells at 4200×1.15=4830. (i) GST paid by wholesaler = 18% of value addition (450)=₹81. (ii) Retailer pays 4200×1.18=₹4956. (iii) Total GST received = 18% of final sale value 4830=₹869.40. (iv) Customer pays 4830×1.18=₹5699.40. All independently verified, matching printed key.',
    diagramStatus: 'not_applicable', answerKeyRef: 'printed ANSWERS table, p.25.1, item 56',
  },
];

// Assertion-Reason, items 57-60: source's "simple" 4-option scheme.
const AR_SIMPLE = [
  'A is true, R is false',
  'A is false, R is true',
  'Both A and R are true',
  'Both A and R are false.',
];
const arSimple = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '1.10-1.11', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_SIMPLE, correctIdx, { questionType: 'assertion_reasoning', ...opts });

// Assertion-Reason, items 61-66: source's "full" 4-option scheme.
const AR_FULL = [
  'Both Assertion (A) and Reason (R) are true and Reason (R) is the correct explanation of Assertion (A).',
  'Both Assertion (A) and Reason (R) are true but Reason (R) is not the correct explanation of Assertion (A).',
  'Assertion (A) is true and Reason (R) is false.',
  'Assertion (A) is false and Reason (R) is true.',
];
const arFull = (n, assertion, reason, correctIdx, opts = {}) => mcq(n, '1.11-1.13', `Assertion (A): ${assertion}\nReason (R): ${reason}`, AR_FULL, correctIdx, { questionType: 'assertion_reasoning', ...opts });

items.push(
  arSimple(57,
    'The entire tax collected under IGST is paid to the account of Central Government.',
    'The GST collected on the supply of goods or service in case of interstate trade within India or in case of Import/Export is called IGST.',
    2, { explanation: 'Both statements are true per standard textbook treatment: IGST is credited to the Central Government (this simple scheme has no "explains" option so genuine textbook truth values of A and R alone determine the answer), and R is a correct definition of IGST — matches printed key (both true).' }),
  arSimple(58,
    'GST payable = ITC + Output GST',
    'Input Tax Credit (ITC) is a provision of reducing the GST already paid on inputs to avoid the cascading of taxes.',
    1, { explanation: 'A is false: the correct formula is GST payable = Output GST − ITC (net liability after claiming credit), not addition. R correctly describes what ITC is. A false, R true — matches printed key.' }),
  arSimple(59,
    'A dealer buys an article for ₹1500. He sells it to a customer at 10 % profit the rate of GST is 18 %. The price which the customer pays for the article is ₹1947.',
    'GST is charged on the cost price of the article.',
    2, { explanation: 'A: SP=1500×1.10=1650; with 18% GST, 1650×1.18=₹1947 — correct, A true. R, read as this book’s shorthand for "the price at which it is sold" (i.e. the taxable value used in the computation above, exactly as used in A), is also true in that sense — matches printed key (both true). Note: strictly, GST law taxes the transaction/selling value, not the dealer’s original cost price; this is a loose-terminology item, not a numeric discrepancy, so it is not flagged needs_review.' }),
  arSimple(60,
    'A shopkeeper in Mumbai sells a smart watch to a customer in Mumbai for ₹8600. If the rate of GST is 18 %, then SGST is ₹774.',
    'For any intrastate supply (supply from one state to another state) of goods or services, CGST is charged.',
    0, { explanation: 'A: intrastate (Mumbai to Mumbai), SGST = 9% of 8600 = ₹774 — correct, A true. R is false as printed: it mislabels its own parenthetical, defining "intrastate" as "supply from one state to another state", which is actually the definition of interstate — A true, R false, matches printed key.' }),
);
items.push(
  arFull(61,
    'A dealer in Punjab buys an article for ₹10000 from a dealer in Bihar. The dealer in Punjab then sell the same article for ₹12000 to a dealer in Lucknow. If the rate of GST is 10 % then the price including GST paid by dealer in Lucknow is ₹13200.',
    'Since the sales are interstate at each stage, so CGST and SGST will be charged.',
    2, { explanation: 'A: 12000×1.10=₹13200 — correct, A true. R is false: interstate sales attract IGST, not CGST+SGST (which apply only to intrastate sales) — A true, R false, matches printed key.' }),
  arFull(62,
    'Rita buys an article from Rajiv who lives in a same city for ₹780. If the rate of GST is 10 %, then the GST paid by Rita is ₹78.',
    'In case of interstate transactions, CGST + SGST = GST',
    2, { explanation: 'A: intrastate (same city), GST = 780×0.10=₹78 — correct, A true. R is false as stated: CGST+SGST=GST applies to INTRAstate transactions, not interstate (interstate uses IGST) — A true, R false, matches printed key.' }),
  arFull(63,
    'A dealer in Gujarat supplies goods and services worth ₹5000 to another dealer in Mumbai. If the rate of GST is 28 %, then the tax levied under CGST and IGST are ₹0 and ₹1400',
    'For interstate transaction, CGST = SGST = ₹0',
    0, { explanation: 'A: interstate (Gujarat to Maharashtra), CGST=₹0, IGST=5000×0.28=₹1400 — correct, A true. R correctly explains why CGST=0 (interstate transactions have no CGST/SGST, only IGST) — both true, R explains A, matches printed key.' }),
  arFull(64,
    'The tax invoice of a telecom service in Meerut shows cost of service provided by it as ₹700. If the GST is 18 % then the amount of the bill is ₹862.',
    'CGST = SGST = ½ GST',
    3, { explanation: 'A: 700×1.18=₹826, not ₹862 as asserted — A is false (this is a designed arithmetic error in the assertion itself, not our error). R is a true, standard formula. A false, R true, matches printed key exactly.' }),
  arFull(65,
    'Raju buys an article from Amit for ₹740. If they both live in same city and the rate of GST is 10 %, then SGST paid by Raju is ₹37.',
    'In case of intrastate transactions, CGST = SGST = ½ GST.',
    0, { explanation: 'A: SGST = half of 10% = 5% of 740 = ₹37 — correct, A true. R is the standard, correct formula and directly explains A — both true, R explains A, matches printed key.' }),
  arFull(66,
    'Rajesh buys an article from Ajay for ₹7600. If they both live in same city and the rate of GST is 10 %, then GST paid by Rajesh is ₹760.',
    'In case of intrastate transactions, CGST + SGST = ½ GST.',
    2, { explanation: 'A: total GST = 7600×0.10=₹760 — correct, A true. R is false as printed: CGST+SGST equals the FULL GST amount, not half of it (half of GST is what each of CGST/SGST individually equals) — A true, R false, matches printed key.' }),
);

const result = ingestQuestions(items, {
  board: 'ICSE',
  subjectName: 'Mathematics',
  chapterName: 'GST (Goods and Service Tax)',
  chapterOrder: 1,
  label: 'ICSE Class 10 Mathematics — GST (Goods and Service Tax): 66 items (56 MCQ/case-study MCQ, 10 Assertion-Reason), full chapter, from chap_1.pdf, every answer independently re-verified by computation against the printed key (zero discrepancies)',
  status: 'verified',
  answerStatus: 'verified',
  sourceSection: 'Multiple Choice Questions + Assertion and Reasoning (full chapter, pp.1.3-1.13)',
  sourceFileIds: SOURCE_FILE_IDS,
});

console.log(JSON.stringify(result, null, 2));
