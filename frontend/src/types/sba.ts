export interface SbaPredictionRequest {
  gross_approval: number;
  term_months: number;
  interest_rate: number;
  processing_method: string;
  business_type: string;
  business_age: string;
  collateral: 'Y' | 'N';
  revolver: 'N' | 'Y';
  rate_type: 'F' | 'V';
  naics_code: string;
  borr_state: string;
  jobs_supported: number;
  is_franchise: boolean;
  lender_type: string;
  bank_name: string | null;
  bank_state: string | null;
}

export interface SbaPredictionResponse {
  charge_off_probability: number;
  risk_percentage: number;
  baseline_percentage: number;
  times_baseline: number;
  flagged: boolean;
  threshold_used: number;
}

export interface ApiHealthResponse {
  status: string;
  model_loaded?: boolean;
}

export interface ApiRootResponse {
  message: string;
  status: string;
}

export interface FastApiValidationErrorDetail {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface FastApiValidationError {
  detail: FastApiValidationErrorDetail[];
}

export type RiskBand = 'low' | 'elevated' | 'high';
