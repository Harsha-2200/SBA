# Final Insights and Recommendations

SBA Loan Charge-Off Risk Prediction

Based on 428,361 completed SBA 7(a) loans approved between FY2010 and FY2019. Overall charge-off rate: **7.93%**.

---

## 1. What Drives Charge-Off

### Loan term is the strongest single signal
Loans with terms under 54 months charge off at **36.55%**. Loans with terms of 298 to 420 months charge off at **0.05%**. The same gap appears within a single approval year (2012: 29.63% vs 0.19%), so it is not a timing effect.

Long-term loans are almost all large loans backed by property. Short-term loans are small working-capital loans with little to recover. Term is really telling us what kind of loan it is.

### Whether there is a recoverable asset matters most
The same pattern runs through several findings:
- Unsecured loans charge off at **10.26%**, secured loans at **6.98%**
- Hotels charge off at **3.08%**, restaurants at **9.72%**, even though both sit in the same industry sector. A hotel owns a building; a restaurant leases premises and owns equipment worth little second-hand
- Real estate, agriculture and finance sit well below average; entertainment, retail and transport sit above

### Interest rate tracks risk steadily
Charge-off rises from **3.26%** for loans at 5% or below to **12.87%** for loans above 8.99%. The rate partly reflects the lender's own risk judgement at approval.

### Smaller loans fail more often
Loans under $15,000 charge off at **10.04%**, loans above $925,200 at **4.93%**.

### Who lends matters
Among lenders with more than 2,000 loans, charge-off ranges from **1.61%** to **37.19%**. Non-bank SBA lenders charge off at **14.56%**, banks at **7.73%**, credit unions at **6.20%**. Local lenders do better: **6.25%** when lender and borrower share a state, **7.97%** when they do not.

### Business maturity helps, but less than expected
Businesses of 5+ years charge off at **6.24%**, startups at **9.70%**. A real difference, but smaller than term, collateral or lender.

### Targeted programmes carry more risk by design
Community Express (**20.22%**), Community Advantage (**16.91%**) and Patriot Express (**13.44%**) sit well above average. These programmes exist to reach underserved borrowers and veterans, so higher risk is part of their purpose rather than a failure.

### Geography
Florida (**12.32%**) and Texas (**10.50%**) are highest among large states. Their industry mix is similar to other large states, so the difference is not explained by sector.

---

## 2. Data Quality Findings

These two findings changed how the data had to be handled. Missing either would have produced misleading results.

**SBA changed its business age classification in 2018.** The detailed age bands used until 2017 disappear by 2019, replaced by broader categories. One new category looked like the riskiest group (9.97%) only because it contained almost nothing but recent loans. Categories were remapped to a single consistent scheme.

**Recent years look riskier than they are.** Performing loans from recent years are still running and withheld under FOIA, while failed loans are already recorded. In the 84 to 105 month term band, the charge-off rate climbs from 14.31% for 2012 approvals to 51.17% for 2019. This is why a time-based split was used, and why the test period shows 9.62% against 7.27% in training.

---

## 3. Model Findings

- **XGBoost** was the best of seven algorithms and generalised well, with a small gap between training and test scores.
- After tuning: **F1 0.746, precision 0.812, recall 0.690, PR-AUC 0.804** (a random model would score about 0.096).
- At the chosen **0.3 threshold**, the model catches **78.9%** of charge-offs, and **73.1%** of loans it flags genuinely charge off.
- Decision tree and random forest memorised the training data at default settings, a clear example of overfitting.
- SVM ranked loans well (PR-AUC 0.610) but could not be trained on the full data in reasonable time.

---

## 4. Recommendations

### For lenders
- **Give short-term, small, unsecured loans a closer look.** This combination carries the highest risk in the data.
- **Treat collateral as a strong protective factor**, but remember lenders tend to ask for it when they are already less sure of a borrower.
- **Use the risk score as a cross-check, not a decision.** Loans scoring 30% or above are worth sending to review. The score does not replace underwriting.
- **Track your own portfolio against peers.** Lender identity is one of the strongest signals, which suggests underwriting practice varies widely.

### For the SBA and programme oversight
- **Keep classification schemes consistent over time**, or publish mappings between old and new categories. The 2018 change made business age hard to use across years.
- **Monitor targeted programmes on their own terms.** Higher charge-off in Community Advantage and Community Express is expected given who they serve, so they should be compared against their own targets rather than the overall average.
- **Watch non-bank lender performance.** Their charge-off rate is nearly double that of banks.

### For borrowers
- **Longer terms, collateral and a fixed rate** are all associated with lower risk.
- **A local lender** is associated with better outcomes than an out-of-state one.
- **Knowing your lender** gives a more specific estimate in the tool, since lender track record carries a lot of weight.

---

## 5. Caveats

- These are patterns in historical data, not proof of cause. A higher interest rate does not cause default; it reflects risk the lender already saw.
- Recent years are still maturing, so their true charge-off rates will fall as outstanding loans are repaid.
- The data does not include economic conditions, borrower credit scores or financial statements, all of which lenders use in practice.
