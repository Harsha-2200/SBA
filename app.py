from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib

app = FastAPI(
    title="SBA Loan Charge-Off Risk API",
    description="Predicts the probability that an SBA 7(a) loan will be charged off",
    version="1.0.0"
)

model = joblib.load("final_model.pkl")
encoder = joblib.load("one_hot_encoder.pkl")
scaler = joblib.load("scaler.pkl")
lender_map = joblib.load("lender_risk_map.pkl")
baseline = joblib.load("baseline_rate.pkl")
feature_columns = joblib.load("feature_columns.pkl")
threshold = joblib.load("threshold.pkl")

class LoanInput(BaseModel):
    gross_approval: float
    term_months: int
    interest_rate: float
    processing_method: str
    business_type: str
    business_age: str
    collateral: str
    revolver: str
    rate_type: str
    naics_code: str
    borr_state: str
    jobs_supported: float
    is_franchise: bool
    lender_type: str
    bank_name: str = None
    bank_state: str = None

def preprocess(gross_approval, term_months, interest_rate, processing_method,
               business_type, business_age, collateral, revolver, rate_type,
               naics_code, borr_state, jobs_supported, is_franchise,lender_type,
               bank_name=None, bank_state=None):
    
    # 1. SBA guaranteed amount from programme rules
    if processing_method == "SBA Express Program":
        sba_guaranteed = gross_approval * 0.50
    elif processing_method == "Export Express":
        sba_guaranteed = gross_approval * 0.90
    elif gross_approval <= 150000:
        sba_guaranteed = gross_approval * 0.85
    else:
        sba_guaranteed = gross_approval * 0.75

        # 2. Build a one-row dataframe with the raw values
    row = pd.DataFrame([{
        "BorrState": borr_state,
        "GrossApproval": gross_approval,
        "SBAGuaranteedApproval": sba_guaranteed,
        "ProcessingMethod": processing_method,
        "InitialInterestRate" : interest_rate,
        "FixedorVariableInterestInd": rate_type,
        "TermInMonths": term_months,
        "NaicsCode": naics_code,
        "BusinessType": business_type,
        "BusinessAge": business_age,
        "RevolverStatus": revolver,
        "JobsSupported": jobs_supported,
        "CollateralInd": collateral
    }])

        # 3. Applying log on GrossApproval
    row["log_GrossApproval"] = np.log1p(gross_approval)


        # 4. Checking naics_sub first 3 digits.
    sub = naics_code[:3]
    row["naics_sub"] = sub if sub in encoder.categories_[2] else "Other"

        # 5. creating lender type.
    row["lender_type"] = lender_type

        # 6. Lender risk: each bank's smoothed historical charge-off rate, learned
        #    from training data. Banks not seen in training, or no bank supplied,
        #    fall back to the overall baseline rate of 0.0727. This mirrors exactly
        #    what was done during training for unseen lenders.
    if bank_name is not None and bank_name in lender_map.index:
        row["lender_risk"] = lender_map[bank_name]
    else:
        row["lender_risk"] = baseline

        # 7. Same state flag: 1 if the lender is in the borrower's state. EDA showed
        #    in-state lending charges off at 6.25% against 7.97% out of state.
        #    Defaults to 0 when no bank state is given.
    if bank_name is not None and bank_state == borr_state:
        row["same_state_flag"] = 1
    else:
        row["same_state_flag"] = 0

        # 8. Franchise flag: EDA showed franchises charge off at 8.88% against
        #    7.14% for non-franchises.
    row["FranchiseCode_Flag"] = 1 if is_franchise else 0

        # 9. BusinessAge as an ordinal number. The user picks from the four
        #    categories. Order reflects real business age: startup youngest,
        #    then under 2 years, then over 2 years. Unanswered sits outside
        #    the scale at -1.
    business_map = {
        "Startup, Loan Funds will Open Business": 0,
        "New Business or 2 years or less": 1,
        "Existing or more than 2 years old": 2,
        "Unanswered": -1
    }
    row["BusinessAge"] = business_map[business_age]

        # 10. Binary columns mapped to 0/1, same as training.
    binary_map = {"Y":1, "N": 0}
    row["CollateralInd"] = binary_map[collateral]
    row["RevolverStatus"] = binary_map[revolver]

    interest_binary_map = {"F": 1, "V": 0}
    row["FixedorVariableInterestInd"] = interest_binary_map[rate_type]

        # 11. One-hot encode the five categorical columns using the encoder fitted
        #     during training, so the same 122 columns are produced in the same order.
    ohe_cols = ["BorrState", "ProcessingMethod", "naics_sub", "BusinessType", "lender_type"]
    encoded = encoder.transform(row[ohe_cols])
    encoded_df = pd.DataFrame(
        encoded,
        columns=encoder.get_feature_names_out(ohe_cols),
        index=row.index
    )
    row = pd.concat([row.drop(columns=ohe_cols), encoded_df], axis=1)

        # 12. Scale the numeric columns using the scaler fitted on training data.
        #     transform only, never fit, so the same means and standard deviations
        #     are applied.
    num_cols = ["SBAGuaranteedApproval", "InitialInterestRate", "TermInMonths",
                "JobsSupported", "log_GrossApproval", "lender_risk"]
    row[num_cols] = scaler.transform(row[num_cols])

        # 13. Reorder to match the training column order exactly. The model has no
        #     way to know if columns were swapped, so this prevents silent errors.
    row = row[feature_columns]

    return row

@app.get("/")
def home():
    return {"message": "SBA Loan Charge-Off Risk API is running", "status": "success"}

@app.get("/health")
def health():
    if model is None:
        return {"status": "unhealthy", "model_loaded": False}
    return {"status": "healthy", "model_loaded": True}


@app.post("/predict")
def predict(data: LoanInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded")

    # Turn the fifteen user inputs into the 134 columns the model expects
    row = preprocess(
        gross_approval=data.gross_approval,
        term_months=data.term_months,
        interest_rate=data.interest_rate,
        processing_method=data.processing_method,
        business_type=data.business_type,
        business_age=data.business_age,
        collateral=data.collateral,
        revolver=data.revolver,
        rate_type=data.rate_type,
        naics_code=data.naics_code,
        borr_state=data.borr_state,
        jobs_supported=data.jobs_supported,
        is_franchise=data.is_franchise,
        lender_type=data.lender_type,
        bank_name=data.bank_name,
        bank_state=data.bank_state
    )

    probability = float(model.predict_proba(row)[0][1])

    return {
        "charge_off_probability": round(probability, 4),
        "risk_percentage": round(probability * 100, 2),
        "baseline_percentage": 7.93,
        "times_baseline": round(probability / 0.0793, 2),
        "flagged": bool(probability >= threshold),
        "threshold_used": threshold
    }