# Data Cleaning Plan and Log

SBA Loan Charge-Off Risk Prediction

This document records every cleaning decision, the reason behind it, and its effect on the data. Cleaning happened in two stages:

1. **Validation stage** on the full dataset, removing problems in the data itself (errors, duplicates, leakage, records with no outcome).
2. **Modelling stage** after the train-test split, where anything that learns from the data was fitted on training data only.

---

## Cleaning Principles

- **Check before changing.** Every column was examined before deciding how to treat it, rather than applying a default fix.
- **Missing is not always an error.** Many columns are empty for a real reason (for example, a charge-off date only exists for charged-off loans). These were understood rather than filled.
- **Extreme is not always wrong.** A $5,000,000 loan is the programme maximum, not an outlier to remove.
- **Nothing known after approval goes into the model.** The model must work at the moment a loan is approved.
- **Learn from training data only.** Modes, category lists, thresholds, lender rates, the encoder and the scaler were all fitted on training data and then applied to test data.
- **Record the reason.** Every removal has a stated reason and a count.

---

## Stage 1: Validation (full dataset)

Starting point: **545,751 rows, 42 columns**

| Step | Issue found | Action | Reason | Effect |
|---|---|---|---|---|
| 1 | BankZip mixed types; BorrZip read as integer; NaicsCode read as float | Read all three as text | Identifiers, not quantities. Numbers drop leading zeros from ZIP codes | Types corrected |
| 2 | Five date columns stored as text | Parsed as dates | Needed for date checks and analysis | Types corrected |
| 3 | 1,136 rows identical across all 42 columns (2,022 rows in 886 groups) | Removed surplus copies | No unique loan ID exists to tell them apart. None were charge-offs, so the target is unaffected | 545,751 → 544,615 rows |
| 4 | PaidInFullDate, ChargeOffDate, GrossChargeOffAmount only exist after the outcome | Dropped | Target leakage | −3 columns |
| 5 | BorrName, BorrStreet, BorrCity, BorrZip identify real businesses | Dropped | Personal identifiers, not predictive | −4 columns |
| 6 | AsOfDate and Program have one value in every row | Dropped | Constant columns carry no information | −2 columns |
| 7 | FranchiseName and NaicsDescription repeat FranchiseCode and NaicsCode | Dropped | Redundant | −2 columns |
| 8 | CANCLD, COMMIT and EXEMPT loans have no final outcome | Excluded | Cannot learn from loans that never finished. EXEMPT loans are active and withheld under FOIA | Rows reduced to PIF and CHGOFF only |
| 9 | 222 loans with a term of 0 months | Excluded | Not a valid loan term. No common cause found across programme, year or size | −222 rows |

**Result: 428,361 rows, 31 columns, 7.93% charge-off rate** (33,988 charged off, 394,373 paid in full)

### Checked and kept

| Finding | Count | Decision |
|---|---|---|
| Charged-off loans with no charge-off date and zero amount | 10 (0.03%) | Kept. Negligible, likely not yet posted at the snapshot date |
| Loans with terms over 360 months | 13 | Kept. Negligible |
| Loans with a 0% interest rate | 5 (after filtering) | Kept. Not a valid rate, but negligible |
| High-null columns (BankNCUANumber 96.76%, FranchiseCode 91.29%, SoldSecMrktInd 76.55%) | n/a | Kept at this stage. Missingness is structural and handled in Stage 2 |
| Guarantee ratio outside the standard values | ~0.3% | Kept. 99.7% of loans match programme rules, confirming the amount columns are consistent |

### Checks that passed
- LoanStatus contained only the five values listed in the SBA data dictionary.
- No paid-in-full loan carried a charge-off amount.
- PaidInFullDate was present for exactly the number of paid-in-full loans.
- No SBA guarantee exceeded its loan amount.

---

## Stage 2: Modelling (after the split)

Split by approval year: **train FY2010 to FY2016 (307,501 rows)**, **test FY2017 to FY2019 (120,860 rows)**.

### Missing values

| Column | Missing (train) | Action | Reason |
|---|---|---|---|
| FranchiseCode | 284,295 | Converted to a 0/1 franchise flag, original dropped | Missing means "not a franchise". Franchises charge off at 8.88% vs 7.14% |
| SoldSecMrktInd | 236,188 | Dropped | Set after approval, not available at prediction time |
| BusinessAge | 404 | Filled with "Unanswered" | The column already has a category meaning unknown |
| BusinessType | 16 | Filled with training mode | Tiny count, no "unknown" category exists |
| NaicsCode | 2 | Filled with training mode | Tiny count |
| CongressionalDistrict | 25 | Column dropped | Administrative, duplicates state information |

### Outliers
None removed. Extreme loan amounts, terms and job counts are real loans within programme limits. Skew in loan amount was handled with a log transform instead.

### Further columns removed

| Column | Reason |
|---|---|
| FirstDisbursementDate | Happens after approval |
| BankStreet, BankCity, BankZip | Same value for every loan from a lender |
| LocationID, BankFDICNumber, BankNCUANumber | Replaced by the engineered `lender_type` |
| BankName | Replaced by the engineered `lender_risk` |
| ProjectState | 99.79% identical to BorrState |
| ProjectCounty | 1,855 values in train vs 1,674 in test, too granular |
| SBADistrictOffice | Assigned by location, duplicates state |
| BankState | Replaced by `same_state_flag` |
| ApprovalDate, ApprovalFY | Year encodes the FOIA maturity artefact, and new loans would have unseen years |
| GrossApproval | Replaced by `log_GrossApproval` |
| NaicsCode | Replaced by `naics_sub` |

### Category cleaning

| Column | Action | Reason |
|---|---|---|
| BusinessAge | Ten categories remapped to four consistent ones | SBA changed its classification scheme in 2018, so old and new categories were not comparable |
| naics_sub | Industry subsectors with under 1,000 training loans grouped as "Other" | Too few loans for a reliable rate. "Other" charges off at 7.55%, close to baseline |
| ProcessingMethod | Programmes with under 1,000 training loans grouped as "Other" | Same reason |

**Final modelling data: 134 features after encoding.**

---

## Summary of Changes

| Stage | Rows | Columns |
|---|---|---|
| Raw | 545,751 | 42 |
| After duplicates removed | 544,615 | 42 |
| After column drops | 544,615 | 31 |
| After row exclusions | 428,361 | 31 |
| Modelling features after encoding | 428,361 | 134 |
