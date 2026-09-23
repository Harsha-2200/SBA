# SBA Loan Charge-Off Risk Prediction

Project documentation

Live application: https://sba-loan-risk-predictor.ai.studio
Backend API: https://sba-e8d3.onrender.com (interactive docs at `/docs`)

---

## 1. Industry and Domain

**Industry:** Banking and Financial Services

**Domain:** Small Business Lending / Credit Risk

Credit risk is the risk that a borrower does not repay a loan. Along with fraud risk, it is one of the main risks a bank manages. Every lending decision involves judging how likely a borrower is to repay, and getting it wrong is costly in both directions. Lending to someone who defaults loses money, and refusing someone who would have repaid loses business.

Public data on fraud and financial crime is only published in aggregate form, because banks cannot release case-level data for privacy and security reasons. Lending data is published at individual loan level by US government agencies, which makes real row-level analysis possible.

---

## 2. Dataset

| Item | Detail |
|---|---|
| Name | SBA 7(a) FOIA Dataset, FY2010 to FY2019 |
| Publisher | U.S. Small Business Administration |
| Source | https://data.sba.gov/dataset/7a-504-foia |
| Version | As of 30 June 2026 (updated quarterly) |
| Licence | U.S. Government Works (public domain) |
| Raw size | 545,751 rows, 42 columns |

### About the SBA 7(a) programme

The SBA does not lend money itself. Ordinary banks lend to small businesses, and the SBA guarantees part of each loan. If the borrower fails to repay, the SBA covers the guaranteed share of the loss. This makes banks willing to lend to businesses they would otherwise consider too risky.

Standard 7(a) loans are guaranteed at 85% for amounts up to $150,000 and 75% above that. SBA Express loans carry a 50% guarantee and Export programmes up to 90%.

Because the programme uses public money, loan records are published under the Freedom of Information Act. Loans that are still active are withheld under FOIA Exemption 4 as confidential commercial information, so only loans that have been paid in full, charged off, cancelled or not yet disbursed have a visible status.

### Business problem

The SBA guarantee shares the risk of a loan but does not remove it. When a loan fails, the bank loses its unguaranteed portion and the government pays out public money for the rest. So the quality of the original lending decision matters to the lender, the taxpayer, and the borrower who takes on debt they may not be able to service.

---

## 3. Data Collection and Storage

The raw CSV was downloaded from the SBA open data portal and loaded into MySQL using pandas and SQLAlchemy. Two tables were created:

| Table | Rows | Contents |
|---|---|---|
| `loans_raw` | 545,751 | Data exactly as collected |
| `loans_clean` | 428,361 | Data after validation |

Row counts were checked in SQL after loading, and null handling was verified (FranchiseCode showed 392,164 NULLs in `loans_clean`, matching pandas), confirming nulls were stored as true NULL rather than empty strings or zeros.

---

## 4. Data Validation

### Data types
Pandas inferred several columns incorrectly. BankZip raised a mixed-type warning, BorrZip was read as an integer (which would drop leading zeros from northeastern ZIP codes), and NaicsCode was read as a float despite being an industry code rather than a quantity. All three were read as text. Five date columns arrived as plain text and were parsed as dates.

### Missing values
Missingness was mostly structural rather than defective:

| Column | Null % | Reason |
|---|---|---|
| BankNCUANumber | 96.76% | Only credit unions have one; most lenders are banks |
| ChargeOffDate | 93.74% | Only exists for charged-off loans |
| FranchiseCode | 91.29% | Most businesses are not franchises |
| SoldSecMrktInd | 76.55% | Only filled when a loan is sold |
| PaidInFullDate | 27.67% | Present for exactly the 394,721 paid-in-full loans |

### Label check
LoanStatus contained only the five documented values:

| Status | Count | Meaning |
|---|---|---|
| P I F | 394,721 | Paid in full |
| CANCLD | 66,744 | Cancelled |
| EXEMPT | 50,089 | Active, withheld under FOIA Exemption 4 |
| CHGOFF | 34,153 | Charged off |
| COMMIT | 44 | Undisbursed |

Ten charged-off loans (0.03%) had no charge-off date and a charge-off amount of zero. No non-charged-off loan carried a charge-off amount, so the label agrees with its supporting fields.

### Duplicates
1,136 rows were identical across all 42 columns, involving 2,022 rows in 886 groups. None were charge-offs. Investigation showed SBA records parallel loans to the same borrower approved the same day, distinguished only by FirstDisbursementDate (for example, five $350,000 loans to one franchise operator with different disbursement dates). Where that date is blank, separate loans collapse into identical rows. With no unique loan ID available, the 1,136 surplus rows were removed.

### Invalid values
222 loans had a term of zero months, which is not a valid loan term. No common cause was found across programme, year, revolver status or loan size, so they were removed. 13 loans had terms over 360 months and 8 had a 0% interest rate, both negligible.

### Internal consistency
SBAGuaranteedApproval divided by GrossApproval matched the published programme rules (0.50, 0.75, 0.85, 0.90) in 99.7% of records. No guarantee exceeded its loan amount.

### Leakage and privacy
PaidInFullDate, ChargeOffDate and GrossChargeOffAmount only exist after a loan's outcome is known and were removed. BorrName, BorrStreet, BorrCity and BorrZip identify real businesses and are not predictive, so they were removed.

### Result
11 columns removed. Cancelled, undisbursed and exempt loans were excluded because they have no final outcome.

**Final dataset: 428,361 rows, 31 columns, 7.93% charge-off rate (33,988 charged off, 394,373 paid in full).**

---

## 5. Exploratory Data Analysis

### Univariate findings
- **Loan amount** is heavily right-skewed (skew 3.81). Median $125,000, mean $377,101, range $1,000 to $5,000,000 (the programme maximum). A log transform reduces skew to 0.17 and reveals heavy clustering at round amounts such as $25,000, $50,000, $100,000 and $150,000, fading above roughly $500,000.
- **Term** median 84 months. **Interest rate** median 6%, mostly between 5.5% and 7.45%. **Jobs supported** is severely skewed (median 4, max 2,150) and is self-reported by lenders, not validated by SBA.
- 87% of borrowers are corporations. SBA Express (52%) and Preferred Lenders (28%) cover 80% of loans. 71% are secured by collateral, 78% carry a variable rate, 67% are term loans.

### What drives charge-off (baseline 7.93%)

| Factor | Finding |
|---|---|
| Loan term | Strongest signal. Under 54 months: 36.55%. 298 to 420 months: 0.05%. The pattern holds within a single year (2012: 29.63% vs 0.19%), so it reflects loan type rather than timing. Long-term loans are large and property-backed, so the lender can recover the asset |
| Interest rate | Rises steadily from 3.26% (5% or below) to 12.87% (above 8.99%). The rate partly reflects the bank's own risk judgement |
| Loan size | Small loans fail more: under $15,000 at 10.04%, above $925,200 at 4.93% |
| Collateral | Unsecured 10.26%, secured 6.98% |
| Rate type | Variable 8.68%, fixed 5.23% |
| Business age | 5+ years 6.24%, startups 9.70% |
| Programme | Community Express 20.22%, Community Advantage 16.91%, Patriot Express 13.44%. These target underserved borrowers |
| Industry | Hotels 3.08% vs restaurants 9.72%, both in the same sector. Clothing retail 11.02% vs petrol stations 3.98% |
| Lender | 1.61% to 37.19% among lenders with over 2,000 loans |
| State | Florida 12.32%, Texas 10.50%. Cross-checking industry mix showed this is not explained by sector composition |

Across the term, industry and collateral findings, the same pattern appears: whether there is a recoverable asset behind the loan matters more than almost anything else.

### Two data integrity findings

**1. SBA changed its business age classification in 2018.** A crosstab of BusinessAge against approval year shows the detailed age bands used from 2010 to 2017 disappear entirely by 2019, replaced by broader categories. "Existing or more than 2 years old" had only about 26 loans before 2018, then over 16,000 in each of 2018 and 2019. Its apparently high charge-off rate (9.97%) is a timing artefact, not a real business effect. The categories were remapped to one consistent scheme during feature engineering.

**2. Recent approval years over-represent charge-offs.** Charge-off by approval year forms a U-shape: 9.32% in 2010, 6.23% in 2013, 10.10% in 2018. The early rise reflects the financial crisis. The later rise is a data effect. Recent loans that are performing well are still running and withheld as EXEMPT, while loans that failed did so early and are already recorded. The 84 to 105 month term band shows this clearly, rising from 14.31% for 2012 approvals to 51.17% for 2019.

---

## 6. ML Problem Definition

| Item | Definition |
|---|---|
| Business problem | Loans that are not repaid cause losses for lenders and the SBA guarantee fund |
| ML problem | Predict the probability that a loan will be charged off, using only information available at approval |
| ML task | Binary classification |
| Target | LoanStatus: 1 = CHGOFF, 0 = P I F |
| Class balance | 7.93% positive, so evaluation uses F1, precision, recall and PR-AUC rather than accuracy |
| Users | Lenders cross-checking an application; borrowers understanding their risk before applying |

Other framings were considered (loan amount regression, interest rate regression, disbursement delay, employment impact) and are noted as possible extensions.

---

## 7. Modelling Pre-requisites

### Train-test split
A **time-based split** was used rather than a random one, because a random split would let the model learn from loans approved after the ones it is tested on.

| Set | Years | Rows | Charge-off rate |
|---|---|---|---|
| Train | FY2010 to FY2016 | 307,501 | 7.27% |
| Test | FY2017 to FY2019 | 120,860 | 9.62% |

The higher test rate is the maturity effect described above.

All transformations that learn from data (modes, category lists, frequency thresholds, lender rates, encoder, scaler) were fitted on training data only and then applied to both sets.

### Columns removed before modelling
- FirstDisbursementDate and SoldSecMrktInd: set after approval, not available at prediction time
- Bank address fields and lender ID numbers: constant per lender, replaced by engineered lender features
- ProjectState: 99.79% identical to BorrState
- ProjectCounty: 1,855 values in train vs 1,674 in test, too granular
- SBADistrictOffice and CongressionalDistrict: administrative, duplicate state information
- ApprovalDate and ApprovalFY: year encodes the maturity artefact, and a new loan would have a year the model has never seen
- GrossApproval: replaced by its log transform

### Missing values
- BusinessType and NaicsCode: filled with the training mode
- BusinessAge: filled with its existing "Unanswered" category
- Outliers were not removed, since extreme values such as the $5m maximum are legitimate loan amounts

### Feature engineering

| Feature | How it was built | Why |
|---|---|---|
| `log_GrossApproval` | log1p of loan amount | Reduces skew from 3.81 to 0.17 |
| `lender_type` | Bank (FDIC number), CreditUnion (NCUA number), Other (neither) | Banks 7.73%, credit unions 6.20%, non-bank lenders 14.56% |
| `lender_risk` | Each lender's smoothed historical charge-off rate, k = 50, from training data | Replaces 2,700 bank names with one numeric column. Small lenders are pulled toward the baseline; unseen lenders get the baseline (0.0727) |
| `same_state_flag` | 1 if lender and borrower are in the same state | In-state 6.25%, out-of-state 7.97% |
| `FranchiseCode_Flag` | 1 if a franchise code exists | Franchises 8.88%, others 7.14% |
| `naics_sub` | First 3 digits of NAICS, groups under 1,000 loans as Other | 2 digits hid real differences (hotels vs restaurants); 6 digits was too sparse |
| ProcessingMethod | Programmes under 1,000 loans grouped as Other | Several programmes were discontinued before 2017 and appear only in training |
| BusinessAge | Old categories remapped to the post-2018 scheme | Makes categories consistent across all years |

### Encoding and scaling
- **Binary:** CollateralInd, RevolverStatus, FixedorVariableInterestInd
- **Ordinal:** BusinessAge (Startup 0, 2 years or less 1, more than 2 years 2, Unanswered -1)
- **One-hot:** BorrState, ProcessingMethod, naics_sub, BusinessType, lender_type (OneHotEncoder with `handle_unknown="ignore"`, 122 columns)
- **Scaling:** StandardScaler on the six numeric columns

**Final feature set: 134 columns.**

---

## 8. Model Training and Evaluation

Seven classifiers were trained with default parameters and compared.

| Model | Train F1 | Test F1 | Test Precision | Test Recall | Test PR-AUC | Fit |
|---|---|---|---|---|---|---|
| Logistic Regression | 0.297 | 0.415 | 0.655 | 0.303 | 0.266 | Good fit |
| KNN | 0.384 | 0.251 | 0.702 | 0.153 | 0.189 | Underfit |
| Naive Bayes | 0.157 | 0.205 | 0.116 | 0.880 | 0.114 | Underfit |
| SVM* | 0.370 | 0.410 | 0.843 | 0.271 | 0.610 | Good fit |
| Decision Tree | 1.000 | 0.629 | 0.668 | 0.595 | 0.436 | Overfit |
| Random Forest | 1.000 | 0.596 | 0.856 | 0.457 | 0.443 | Overfit |
| **XGBoost** | **0.770** | **0.722** | **0.791** | **0.664** | **0.558** | **Good fit** |

Fit verdict: overfit if the train-test F1 gap exceeds 0.20, underfit if test F1 is below 0.30.

\*SVM did not finish on the full training set after 40 minutes. It was trained on a stratified 50,000-row sample (17 minutes), so its scores are not directly comparable. The full fit was estimated at around 11 hours.

**Observations**
- XGBoost performed best overall with a small train-test gap.
- Decision tree and random forest memorised the training data at default unlimited depth.
- Naive Bayes flagged most loans as risky; its independence assumption is violated by related features such as loan amount, guarantee and term.
- KNN struggles with 134 dimensions after one-hot encoding.
- Logistic regression scored higher on test than train because the test period has more charge-offs, not because it improved.
- SVM had the highest PR-AUC (ranks risk well) but was very conservative at the default 0.5 cutoff. It was excluded from tuning because each fit took 17 minutes.

---

## 9. Hyperparameter Tuning

XGBoost was tuned with RandomizedSearchCV (10 combinations, 3-fold cross-validation, scored on F1).

| Round | Chosen parameters | Test F1 | Precision | Recall | PR-AUC |
|---|---|---|---|---|---|
| Untuned | Defaults | 0.722 | 0.791 | 0.664 | 0.558 |
| Round 1 | 100 trees, depth 10, lr 0.1, subsample 0.7, colsample 0.7 | 0.737 | 0.811 | 0.675 | 0.798 |
| Round 2 | 500 trees, depth 7, lr 0.05, subsample 1.0, colsample 0.9 | **0.746** | **0.812** | **0.690** | **0.804** |

Round 1 picked values at the edge of the search range (maximum depth, minimum trees), so a wider range was searched in round 2. Tuning stopped after round 2 because gains were shrinking, the chosen values sat inside the range, and repeatedly selecting on test scores would make the test score unreliable. Both rounds chose `scale_pos_weight = 1`.

A random model would score PR-AUC of about 0.096 on this test set (the charge-off rate). The final model is roughly eight times that.

---

## 10. Threshold Selection

The model outputs a probability. The default 0.5 cutoff catches only 69% of charge-offs, so thresholds from 0.1 to 0.8 were tested.

| Threshold | Precision | Recall | F1 | Loans flagged |
|---|---|---|---|---|
| 0.1 | 0.579 | 0.872 | 0.696 | 17,514 |
| 0.2 | 0.672 | 0.831 | 0.743 | 14,378 |
| **0.3** | **0.731** | **0.789** | **0.759** | **12,554** |
| 0.4 | 0.776 | 0.746 | 0.761 | 11,181 |
| 0.5 | 0.812 | 0.690 | 0.746 | 9,885 |
| 0.6 | 0.843 | 0.606 | 0.705 | 8,358 |

**0.3 was chosen.** In lending, missing a default usually costs more than wrongly flagging a good loan, so recall is favoured. Below 0.3, precision falls under 70% and too many viable borrowers would be rejected, which works against the purpose of an SBA programme. F1 at 0.3 is effectively tied with the peak.

---

## 11. Saved Artefacts

| File | Contents |
|---|---|
| `final_model.pkl` | Tuned XGBoost model (2.3 MB) |
| `one_hot_encoder.pkl` | Fitted encoder with the 122 learned categories |
| `scaler.pkl` | Means and standard deviations from training data |
| `lender_risk_map.pkl` | Smoothed charge-off rates for 2,568 lenders |
| `baseline_rate.pkl` | 0.0727 fallback for unknown lenders |
| `feature_columns.pkl` | The 134 column names in training order |
| `threshold.pkl` | 0.3 |

---

## 12. Deployment

### Architecture
```
User (browser)
   ↓  16 plain inputs
Frontend web app (sba-loan-risk-predictor.ai.studio)
   ↓  POST JSON
FastAPI backend on Render (/predict)
   ↓  Pydantic validation
Preprocessing function (13 steps)
   ↓  134 encoded, scaled columns
XGBoost model
   ↓  probability
JSON response → result shown to user
```

### Backend
FastAPI with three endpoints: `/` (service running), `/health` (model loaded), `/predict` (risk prediction). Input is validated with a Pydantic model of 16 fields. SBAGuaranteedApproval is calculated from programme rules rather than asked of the user. Lender name and state are optional and fall back to the baseline when blank. CORS middleware was added so the browser frontend can call the API.

### Why preprocessing is a function rather than a Pipeline
The deployment guide recommends saving preprocessing and model together as a scikit-learn Pipeline. That suits standard steps such as encoding and scaling. Most of this project's preprocessing is custom (guarantee calculation, industry grouping, lender risk lookup, state comparison, business age remapping), which a standard Pipeline cannot hold without custom transformer classes. The fitted encoder, scaler and lender map were therefore saved separately and applied in the same order inside `app.py`.

### Verification
The preprocessing function was tested against four held-out test loans covering different code paths (franchise, same-state lender, SBA Express, credit union, non-bank lender, both guarantee branches). All four matched the model's original predictions to six decimal places:

| Test loan | Original | Via function |
|---|---|---|
| 307501 | 0.002083 | 0.002083 |
| 307509 | 0.01667 | 0.01667 |
| 307502 | 0.783185 | 0.783185 |
| 307504 | 0.00083 | 0.00083 |

The same results were reproduced through the deployed Render API and the live frontend.

### Frontend
Built with Google AI Studio from a written specification that fixed the exact field names, categorical values and response format, so the form cannot send values the model was not trained on. Industry is chosen from readable labels mapped to NAICS codes. The result shows the charge-off probability, a risk band, comparison against the 7.93% baseline, and whether the loan crosses the 0.3 review threshold. No login is required.

---

## 13. Limitations

- **Maturity effect.** Recent approval years over-represent charge-offs because performing loans are withheld. The test period (9.62%) is not directly comparable with training (7.27%).
- **Business age.** After 2018 the "New Business" category was barely used and much of that information moved into "Unanswered", so this feature is less reliable for recent loans.
- **Jobs supported** is self-reported and not validated by SBA.
- **Industry dropdown** covers the main subsectors; others are scored under a general "Other" category.
- **Unknown lenders** receive the average lender rate, which makes predictions less specific.
- **SVM** was compared on a sample, not the full data.
- **No economic conditions** such as interest rate environment or unemployment are included.
- **Hosting.** The free Render tier sleeps after inactivity, so the first request can take up to a minute.
- The tool gives a statistical estimate from historical patterns. It is not a credit decision.

---

## 14. Future Work

- Loss severity model on GrossChargeOffAmount, combined with this model to estimate expected loss (probability of default × loss given default)
- Disbursement delay prediction as an operational model
- SHAP explanations showing why each loan scored as it did
- Rebuild preprocessing as a full Pipeline with custom transformers
- Retrain as newer SBA releases mature the 2017 to 2019 loans

---

## 15. Repository Structure

```
├── app/          FastAPI backend, preprocessing function, saved model files
├── data/         Data files and source notes
├── docs/         Project documentation
├── frontend/     Web application source and AI Studio specification
└── notebooks/    Validation, EDA, feature engineering and model training
```
