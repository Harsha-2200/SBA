# SBA Loan Charge-Off Risk Prediction

Estimates the probability that a US Small Business Administration 7(a) guaranteed loan will be charged off, using only information available at the time of approval.

**Live application:** https://sba-loan-risk-predictor.ai.studio
**API:** https://sba-e8d3.onrender.com (interactive docs at `/docs`)

> The backend runs on Render's free tier and sleeps when idle. The first prediction may take up to a minute while it wakes.

---

## Overview

| | |
|---|---|
| Industry | Banking and Financial Services |
| Domain | Small Business Lending / Credit Risk |
| Data | SBA 7(a) FOIA dataset, FY2010 to FY2019, public domain |
| Records | 545,751 raw, 428,361 after validation |
| Task | Binary classification (charged off vs paid in full) |
| Baseline charge-off rate | 7.93% |
| Final model | XGBoost, tuned |

## Results

| Metric | Score |
|---|---|
| Test F1 | 0.746 |
| Precision | 0.812 |
| Recall | 0.690 |
| PR-AUC | 0.804 (random baseline 0.096) |

Decision threshold set at 0.3 on business reasoning, catching 78.9% of charge-offs at 73.1% precision.

## Key findings

- **SBA changed its business age classification in 2018**, making categories non-comparable across years. Remapped to one consistent scheme.
- **Recent approval years over-represent defaults**, because performing loans remain undisclosed under FOIA exemption. Handled with a time-based train-test split.
- **Loan term is the strongest signal.** Short-term loans charge off at 36.55%, long-term property-backed loans at 0.05%.
- **Lender identity matters.** Charge-off rates range from 1.61% to 37.19% across large lenders, captured with a smoothed lender risk feature.

## Approach

1. Loaded data into MySQL and validated it: types, nulls, duplicates, label consistency, leakage, invalid values
2. EDA on 428,361 completed loans
3. Time-based split: FY2010 to 2016 train, FY2017 to 2019 test
4. Feature engineering and encoding, fitted on training data only
5. Compared seven classifiers, tuned XGBoost with RandomizedSearchCV
6. Selected the decision threshold on cost reasoning
7. Deployed a FastAPI backend on Render and a web frontend, with preprocessing verified against held-out test records

Full details in [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md).

## Repository structure

```
├── app/          FastAPI backend, preprocessing function, saved model files
├── data/         Data files and source notes
├── docs/         Project documentation
├── frontend/     Web application source and AI Studio specification
└── notebooks/    Validation, EDA, feature engineering and model training
```

## Running the API locally

```bash
cd app
pip install -r requirements.txt
uvicorn app:app --reload
```

Then open http://127.0.0.1:8000/docs

## Data source

U.S. Small Business Administration, 7(a) & 504 FOIA data: https://data.sba.gov/dataset/7a-504-foia
Published under U.S. Government Works (public domain).

## Limitations

This tool gives a statistical estimate based on historical patterns. It is not a credit decision. See the documentation for full limitations.
