import { SbaPredictionRequest } from '../types/sba';

export interface DropdownOption<T = string> {
  value: T;
  label: string;
  description?: string;
}

// 13 Processing methods (exact string values)
export const PROCESSING_METHODS: DropdownOption[] = [
  { value: '7a General', label: '7a General' },
  { value: 'Certified Lenders Program', label: 'Certified Lenders Program' },
  { value: 'Community Advantage Initiative', label: 'Community Advantage Initiative' },
  { value: 'Community Express', label: 'Community Express' },
  { value: 'Export Express', label: 'Export Express' },
  { value: 'Gulf Opportunity Pilot Loan Program', label: 'Gulf Opportunity Pilot Loan Program' },
  { value: 'Other', label: 'Other' },
  { value: 'Patriot Express Loans', label: 'Patriot Express Loans' },
  { value: 'Preferred Lenders Program', label: 'Preferred Lenders Program' },
  { value: 'Rural Loan Initiative', label: 'Rural Loan Initiative' },
  { value: 'SBA Express Program', label: 'SBA Express Program' },
  { value: 'Small Loan Advantage Initiative', label: 'Small Loan Advantage Initiative' },
  { value: 'Working Capital CAPLine', label: 'Working Capital CAPLine' },
];

// 3 Business structures (exact uppercase strings)
export const BUSINESS_TYPES: DropdownOption[] = [
  { value: 'CORPORATION', label: 'Corporation' },
  { value: 'INDIVIDUAL', label: 'Individual / Sole Proprietor' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
];

// 4 Business age categories (exact strings)
export const BUSINESS_AGES: DropdownOption[] = [
  {
    value: 'Startup, Loan Funds will Open Business',
    label: 'Startup — loan will open the business',
  },
  {
    value: 'New Business or 2 years or less',
    label: 'New — 2 years or less',
  },
  {
    value: 'Existing or more than 2 years old',
    label: 'Established — more than 2 years',
  },
  {
    value: 'Unanswered',
    label: 'Prefer not to say / unknown',
  },
];

// 3 Lender types (exact strings)
export const LENDER_TYPES: DropdownOption[] = [
  { value: 'Bank', label: 'Bank' },
  { value: 'CreditUnion', label: 'Credit Union' },
  { value: 'Other', label: 'Non-bank SBA lender' },
];

// 24 Industry Categories with 6-digit NAICS codes
export const INDUSTRIES: DropdownOption[] = [
  { value: '722000', label: 'Restaurants and food service' },
  { value: '721000', label: 'Hotels and accommodation' },
  { value: '238000', label: 'Specialty trade contractors' },
  { value: '236000', label: 'Building construction' },
  { value: '541000', label: 'Professional and technical services' },
  { value: '621000', label: 'Healthcare practices' },
  { value: '624000', label: 'Social assistance and childcare' },
  { value: '812000', label: 'Personal services (salon, laundry)' },
  { value: '561000', label: 'Administrative and support services' },
  { value: '811000', label: 'Repair and maintenance services' },
  { value: '484000', label: 'Trucking and freight' },
  { value: '423000', label: 'Wholesale — durable goods' },
  { value: '424000', label: 'Wholesale — non-durable goods' },
  { value: '445000', label: 'Food and beverage stores' },
  { value: '448000', label: 'Clothing and accessories retail' },
  { value: '447000', label: 'Petrol / gas stations' },
  { value: '441000', label: 'Motor vehicle dealers and parts' },
  { value: '446000', label: 'Health and personal care stores' },
  { value: '531000', label: 'Real estate' },
  { value: '524000', label: 'Insurance and finance' },
  { value: '713000', label: 'Fitness, recreation and entertainment' },
  { value: '112000', label: 'Agriculture' },
  { value: '332000', label: 'Manufacturing — fabricated metal' },
  { value: '999000', label: 'Other industry' },
];

// Collateral: Dropdown or radio, send "Y" or "N" (display Yes / No)
export const COLLATERAL_OPTIONS: DropdownOption<'Y' | 'N'>[] = [
  { value: 'Y', label: 'Yes' },
  { value: 'N', label: 'No' },
];

// Revolver: Send "N" for a term loan, "Y" for a revolving line of credit. Display as "Term loan" / "Revolving line of credit"
export const REVOLVER_OPTIONS: DropdownOption<'Y' | 'N'>[] = [
  { value: 'N', label: 'Term loan' },
  { value: 'Y', label: 'Revolving line of credit' },
];

// Rate Type: Send "F" for fixed, "V" for variable. Display as "Fixed" / "Variable"
export const RATE_TYPE_OPTIONS: DropdownOption<'F' | 'V'>[] = [
  { value: 'F', label: 'Fixed' },
  { value: 'V', label: 'Variable' },
];

// 57 State & Territory Codes with friendly display names
export const US_STATES: DropdownOption[] = [
  { value: 'AK', label: 'AK — Alaska' },
  { value: 'AL', label: 'AL — Alabama' },
  { value: 'AR', label: 'AR — Arkansas' },
  { value: 'AZ', label: 'AZ — Arizona' },
  { value: 'CA', label: 'CA — California' },
  { value: 'CO', label: 'CO — Colorado' },
  { value: 'CT', label: 'CT — Connecticut' },
  { value: 'DC', label: 'DC — District of Columbia' },
  { value: 'DE', label: 'DE — Delaware' },
  { value: 'FL', label: 'FL — Florida' },
  { value: 'FM', label: 'FM — Federated States of Micronesia' },
  { value: 'GA', label: 'GA — Georgia' },
  { value: 'GU', label: 'GU — Guam' },
  { value: 'HI', label: 'HI — Hawaii' },
  { value: 'IA', label: 'IA — Iowa' },
  { value: 'ID', label: 'ID — Idaho' },
  { value: 'IL', label: 'IL — Illinois' },
  { value: 'IN', label: 'IN — Indiana' },
  { value: 'KS', label: 'KS — Kansas' },
  { value: 'KY', label: 'KY — Kentucky' },
  { value: 'LA', label: 'LA — Louisiana' },
  { value: 'MA', label: 'MA — Massachusetts' },
  { value: 'MD', label: 'MD — Maryland' },
  { value: 'ME', label: 'ME — Maine' },
  { value: 'MH', label: 'MH — Marshall Islands' },
  { value: 'MI', label: 'MI — Michigan' },
  { value: 'MN', label: 'MN — Minnesota' },
  { value: 'MO', label: 'MO — Missouri' },
  { value: 'MP', label: 'MP — Northern Mariana Islands' },
  { value: 'MS', label: 'MS — Mississippi' },
  { value: 'MT', label: 'MT — Montana' },
  { value: 'NC', label: 'NC — North Carolina' },
  { value: 'ND', label: 'ND — North Dakota' },
  { value: 'NE', label: 'NE — Nebraska' },
  { value: 'NH', label: 'NH — New Hampshire' },
  { value: 'NJ', label: 'NJ — New Jersey' },
  { value: 'NM', label: 'NM — New Mexico' },
  { value: 'NV', label: 'NV — Nevada' },
  { value: 'NY', label: 'NY — New York' },
  { value: 'OH', label: 'OH — Ohio' },
  { value: 'OK', label: 'OK — Oklahoma' },
  { value: 'OR', label: 'OR — Oregon' },
  { value: 'PA', label: 'PA — Pennsylvania' },
  { value: 'PR', label: 'PR — Puerto Rico' },
  { value: 'RI', label: 'RI — Rhode Island' },
  { value: 'SC', label: 'SC — South Carolina' },
  { value: 'SD', label: 'SD — South Dakota' },
  { value: 'TN', label: 'TN — Tennessee' },
  { value: 'TX', label: 'TX — Texas' },
  { value: 'UT', label: 'UT — Utah' },
  { value: 'VA', label: 'VA — Virginia' },
  { value: 'VI', label: 'VI — Virgin Islands' },
  { value: 'VT', label: 'VT — Vermont' },
  { value: 'WA', label: 'WA — Washington' },
  { value: 'WI', label: 'WI — Wisconsin' },
  { value: 'WV', label: 'WV — West Virginia' },
  { value: 'WY', label: 'WY — Wyoming' },
];

// Verified test loan 1: Low-risk example (around 0.2% default risk)
export const LOW_RISK_EXAMPLE_LOAN: SbaPredictionRequest = {
  gross_approval: 260000,
  term_months: 120,
  interest_rate: 5.0,
  processing_method: 'Small Loan Advantage Initiative',
  business_type: 'CORPORATION',
  business_age: 'New Business or 2 years or less',
  collateral: 'Y',
  revolver: 'N',
  rate_type: 'V',
  naics_code: '441000', // Motor vehicle dealers and parts
  borr_state: 'CO',
  jobs_supported: 8,
  is_franchise: false,
  lender_type: 'Bank',
  bank_name: 'BOKF, National Association',
  bank_state: 'OK',
};

// Backwards compatibility alias
export const BOKF_SAMPLE_LOAN = LOW_RISK_EXAMPLE_LOAN;
export const SAMPLE_LOAN = LOW_RISK_EXAMPLE_LOAN;

// Verified test loan 2: High-risk example (around 78.3% default risk)
export const HIGH_RISK_EXAMPLE_LOAN: SbaPredictionRequest = {
  gross_approval: 40000,
  term_months: 89,
  interest_rate: 7.5,
  processing_method: 'Community Advantage Initiative',
  business_type: 'INDIVIDUAL',
  business_age: 'Unanswered', // Prefer not to say / unknown
  collateral: 'Y',
  revolver: 'N',
  rate_type: 'V',
  naics_code: '722000', // Restaurants and food service
  borr_state: 'CA',
  jobs_supported: 5,
  is_franchise: false,
  lender_type: 'Other', // Non-bank SBA lender
  bank_name: 'Main Street Launch',
  bank_state: 'CA',
};

// Backwards compatibility alias
export const COMMUNITY_ADVANTAGE_RESTAURANT_LOAN = HIGH_RISK_EXAMPLE_LOAN;

// Default empty initial form state
export const DEFAULT_FORM_STATE: SbaPredictionRequest = {
  gross_approval: 150000,
  term_months: 84,
  interest_rate: 6.5,
  processing_method: '7a General',
  business_type: 'CORPORATION',
  business_age: 'Existing or more than 2 years old',
  collateral: 'Y',
  revolver: 'N',
  rate_type: 'V',
  naics_code: '541000',
  borr_state: 'CA',
  jobs_supported: 5,
  is_franchise: false,
  lender_type: 'Bank',
  bank_name: null,
  bank_state: null,
};
