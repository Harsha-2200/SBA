import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Send,
  HelpCircle,
  Building2,
  DollarSign,
  Landmark,
  AlertCircle,
} from 'lucide-react';
import { SbaPredictionRequest } from '../../types/sba';
import {
  BUSINESS_AGES,
  BUSINESS_TYPES,
  COLLATERAL_OPTIONS,
  INDUSTRIES,
  LENDER_TYPES,
  PROCESSING_METHODS,
  RATE_TYPE_OPTIONS,
  REVOLVER_OPTIONS,
  LOW_RISK_EXAMPLE_LOAN,
  HIGH_RISK_EXAMPLE_LOAN,
  US_STATES,
} from '../../constants/sbaData';

interface RiskFormProps {
  formData: SbaPredictionRequest;
  onChange: (updated: SbaPredictionRequest) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onReset: () => void;
  errorMessage?: string | null;
  fieldErrors?: Record<string, string>;
}

export const RiskForm: React.FC<RiskFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isLoading,
  onReset,
  errorMessage,
  fieldErrors = {},
}) => {
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errors: Record<string, string> = {};

    if (
      isNaN(formData.gross_approval) ||
      formData.gross_approval < 1000 ||
      formData.gross_approval > 5000000
    ) {
      errors.gross_approval =
        'Gross approval must be between $1,000 and $5,000,000 (SBA program maximum).';
    }

    if (
      isNaN(formData.term_months) ||
      formData.term_months < 1 ||
      formData.term_months > 420
    ) {
      errors.term_months = 'Term must be between 1 and 420 months (up to 35 years).';
    }

    if (
      isNaN(formData.interest_rate) ||
      formData.interest_rate < 0 ||
      formData.interest_rate > 15
    ) {
      errors.interest_rate = 'Interest rate must be between 0.0% and 15.0%.';
    }

    if (
      isNaN(formData.jobs_supported) ||
      formData.jobs_supported < 0 ||
      formData.jobs_supported > 2150
    ) {
      errors.jobs_supported = 'Jobs supported must be between 0 and 2,150.';
    }

    if (!formData.borr_state) {
      errors.borr_state = "Please select the borrower's state.";
    }

    if (!formData.processing_method) {
      errors.processing_method = 'Please select an SBA loan programme.';
    }

    if (!formData.naics_code) {
      errors.naics_code = 'Please select the primary industry.';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  const updateField = <K extends keyof SbaPredictionRequest>(
    key: K,
    value: SbaPredictionRequest[K],
  ) => {
    onChange({
      ...formData,
      [key]: value,
    });
    // Clear client error for this field
    if (clientErrors[key as string]) {
      setClientErrors((prev) => {
        const next = { ...prev };
        delete next[key as string];
        return next;
      });
    }
  };

  const loadBokfSample = () => {
    onChange({ ...LOW_RISK_EXAMPLE_LOAN });
    setClientErrors({});
  };

  const loadRestaurantSample = () => {
    onChange({ ...HIGH_RISK_EXAMPLE_LOAN });
    setClientErrors({});
  };

  const getFieldError = (fieldName: string) => {
    return clientErrors[fieldName] || fieldErrors[fieldName];
  };

  return (
    <form id="sba-risk-form" onSubmit={handleSubmit} className="space-y-8">
      {/* Top Action Bar: Sample Loan & Clear */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50/80 p-4">
        <div>
          <h3 className="text-sm font-semibold text-stone-900">Application Inputs</h3>
          <p className="text-xs text-stone-600">
            All fields reflect information known when the loan is approved.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 mr-1 hidden sm:inline">Examples:</span>
          <button
            id="load-sample-bokf-button"
            type="button"
            onClick={loadBokfSample}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-800 shadow-sm hover:bg-stone-100 disabled:opacity-50 transition-colors cursor-pointer"
            title="Load low-risk example loan (~0.2%)"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-700" />
            Try: low-risk example
          </button>
          <button
            id="load-sample-restaurant-button"
            type="button"
            onClick={loadRestaurantSample}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-2.5 py-1.5 text-xs font-medium text-stone-800 shadow-sm hover:bg-stone-100 disabled:opacity-50 transition-colors cursor-pointer"
            title="Load high-risk example loan (~78.3%)"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-700" />
            Try: high-risk example
          </button>
          <button
            id="reset-form-button"
            type="button"
            onClick={() => {
              onReset();
              setClientErrors({});
            }}
            disabled={isLoading}
            className="inline-flex items-center gap-1 rounded-lg border border-transparent px-2 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* General Error Banner */}
      {errorMessage && (
        <div
          id="form-error-banner"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-start gap-3"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
          <div>
            <div className="font-semibold text-red-900">Unable to complete risk calculation</div>
            <p className="mt-0.5 text-xs text-red-700 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* SECTION 1: LOAN DETAILS */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-stone-900">1. Loan Details</h4>
            <p className="text-xs text-stone-500">
              Loan amount, term and structure.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Gross Approval */}
          <div>
            <label
              htmlFor="field-gross-approval"
              className="block text-xs font-semibold text-stone-800"
            >
              Gross Approval <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-600 text-sm">
                $
              </div>
              <input
                id="field-gross-approval"
                type="number"
                min="1000"
                max="5000000"
                step="1000"
                value={formData.gross_approval || ''}
                onChange={(e) =>
                  updateField('gross_approval', parseFloat(e.target.value) || 0)
                }
                disabled={isLoading}
                className={`block w-full rounded-lg border pl-7 pr-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                  getFieldError('gross_approval')
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-stone-300 focus:border-stone-500 focus:ring-stone-300'
                }`}
                placeholder="260000"
                required
              />
            </div>
            <p className="mt-1 text-xs text-stone-600">
              Total loan amount in USD. Valid range 1,000 – 5,000,000 (5m is the programme maximum). Required.
            </p>
            {getFieldError('gross_approval') && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {getFieldError('gross_approval')}
              </p>
            )}
          </div>

          {/* Term Months */}
          <div>
            <label
              htmlFor="field-term-months"
              className="block text-xs font-semibold text-stone-800"
            >
              Loan Term <span className="text-red-500">*</span>
            </label>
            <input
              id="field-term-months"
              type="number"
              min="1"
              max="420"
              step="1"
              value={formData.term_months || ''}
              onChange={(e) =>
                updateField('term_months', parseInt(e.target.value, 10) || 0)
              }
              disabled={isLoading}
              className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                getFieldError('term_months')
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-stone-300 focus:border-stone-500 focus:ring-stone-300'
              }`}
              placeholder="120"
              required
            />
            <p className="mt-1 text-xs text-stone-600">
              Loan term in months. Valid range 1 – 420. Required.
            </p>
            {getFieldError('term_months') && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {getFieldError('term_months')}
              </p>
            )}
          </div>

          {/* Interest Rate */}
          <div>
            <label
              htmlFor="field-interest-rate"
              className="block text-xs font-semibold text-stone-800"
            >
              Annual Interest Rate <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5 rounded-md shadow-sm">
              <input
                id="field-interest-rate"
                type="number"
                min="0"
                max="15"
                step="0.25"
                value={formData.interest_rate}
                onChange={(e) =>
                  updateField('interest_rate', parseFloat(e.target.value) || 0)
                }
                disabled={isLoading}
                className={`block w-full rounded-lg border pl-3 pr-8 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                  getFieldError('interest_rate')
                    ? 'border-red-400 focus:ring-red-300'
                    : 'border-stone-300 focus:border-stone-500 focus:ring-stone-300'
                }`}
                placeholder="5.0"
                required
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-stone-600 text-sm">
                %
              </div>
            </div>
            <p className="mt-1 text-xs text-stone-600">
              Annual interest rate as a percentage, e.g. 7.5. Valid range 0 – 15. Required.
            </p>
            {getFieldError('interest_rate') && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {getFieldError('interest_rate')}
              </p>
            )}
          </div>

          {/* Rate Type */}
          <div>
            <label
              htmlFor="field-rate-type"
              className="block text-xs font-semibold text-stone-800"
            >
              Interest Rate Type <span className="text-red-500">*</span>
            </label>
            <select
              id="field-rate-type"
              value={formData.rate_type}
              onChange={(e) =>
                updateField('rate_type', e.target.value as 'F' | 'V')
              }
              disabled={isLoading}
              className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            >
              {RATE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Revolver / Loan Type */}
          <div>
            <label
              htmlFor="field-revolver"
              className="block text-xs font-semibold text-stone-800"
            >
              Loan Type <span className="text-red-500">*</span>
            </label>
            <select
              id="field-revolver"
              value={formData.revolver}
              onChange={(e) =>
                updateField('revolver', e.target.value as 'Y' | 'N')
              }
              disabled={isLoading}
              className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            >
              {REVOLVER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Collateral */}
          <div>
            <label
              htmlFor="field-collateral"
              className="block text-xs font-semibold text-stone-800"
            >
              Is the loan secured by collateral? <span className="text-red-500">*</span>
            </label>
            <select
              id="field-collateral"
              value={formData.collateral}
              onChange={(e) =>
                updateField('collateral', e.target.value as 'Y' | 'N')
              }
              disabled={isLoading}
              className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            >
              {COLLATERAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Processing Method / Programme */}
          <div className="md:col-span-2 lg:col-span-3">
            <label
              htmlFor="field-processing-method"
              className="block text-xs font-semibold text-stone-800"
            >
              SBA Loan Programme <span className="text-red-500">*</span>
            </label>
            <select
              id="field-processing-method"
              value={formData.processing_method}
              onChange={(e) => updateField('processing_method', e.target.value)}
              disabled={isLoading}
              className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            >
              {PROCESSING_METHODS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-stone-600">
              Select the SBA programme this loan is applied under.
            </p>
            {getFieldError('processing_method') && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {getFieldError('processing_method')}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: BUSINESS DETAILS */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-semibold text-stone-900">2. Business Details</h4>
            <p className="text-xs text-stone-500">
              Industry classification, legal structure, geography, and operating history.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Industry (NAICS) */}
          <div className="md:col-span-2 lg:col-span-2">
            <label
              htmlFor="field-naics-code"
              className="block text-xs font-semibold text-stone-800"
            >
              Industry <span className="text-red-500">*</span>
            </label>
            <select
              id="field-naics-code"
              value={formData.naics_code}
              onChange={(e) => updateField('naics_code', e.target.value)}
              disabled={isLoading}
              className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind.value} value={ind.value}>
                  {ind.label}
                </option>
              ))}
              {!INDUSTRIES.some((ind) => ind.value === formData.naics_code) && (
                <option value={formData.naics_code}>
                  Sample Industry (code {formData.naics_code})
                </option>
              )}
            </select>
            <p className="mt-1 text-xs text-stone-600">
              Select your primary business sector.
            </p>
            {getFieldError('naics_code') && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {getFieldError('naics_code')}
              </p>
            )}
          </div>

          {/* Borrower's State */}
          <div>
            <label
              htmlFor="field-borr-state"
              className="block text-xs font-semibold text-stone-800"
            >
              Borrower&apos;s State <span className="text-red-500">*</span>
            </label>
            <select
              id="field-borr-state"
              value={formData.borr_state}
              onChange={(e) => updateField('borr_state', e.target.value)}
              disabled={isLoading}
              className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            >
              {US_STATES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-stone-600">Primary location of borrower business.</p>
            {getFieldError('borr_state') && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {getFieldError('borr_state')}
              </p>
            )}
          </div>

          {/* Business Structure */}
          <div>
            <label
              htmlFor="field-business-type"
              className="block text-xs font-semibold text-stone-800"
            >
              Business Structure <span className="text-red-500">*</span>
            </label>
            <select
              id="field-business-type"
              value={formData.business_type}
              onChange={(e) => updateField('business_type', e.target.value)}
              disabled={isLoading}
              className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            >
              {BUSINESS_TYPES.map((bt) => (
                <option key={bt.value} value={bt.value}>
                  {bt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-stone-600">Legal entity structure registered with state.</p>
          </div>

          {/* Business Age */}
          <div>
            <label
              htmlFor="field-business-age"
              className="block text-xs font-semibold text-stone-800"
            >
              Business Age <span className="text-red-500">*</span>
            </label>
            <select
              id="field-business-age"
              value={formData.business_age}
              onChange={(e) => updateField('business_age', e.target.value)}
              disabled={isLoading}
              className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            >
              {BUSINESS_AGES.map((ba) => (
                <option key={ba.value} value={ba.value}>
                  {ba.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-stone-600">Operating history at time of application.</p>
          </div>

          {/* Jobs Supported */}
          <div>
            <label
              htmlFor="field-jobs-supported"
              className="block text-xs font-semibold text-stone-800"
            >
              Jobs Supported <span className="text-red-500">*</span>
            </label>
            <input
              id="field-jobs-supported"
              type="number"
              min="0"
              max="2150"
              step="1"
              value={formData.jobs_supported}
              onChange={(e) =>
                updateField('jobs_supported', parseFloat(e.target.value) || 0)
              }
              disabled={isLoading}
              className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 ${
                getFieldError('jobs_supported')
                  ? 'border-red-400 focus:ring-red-300'
                  : 'border-stone-300 focus:border-stone-500 focus:ring-stone-300'
              }`}
              placeholder="8"
              required
            />
            <p className="mt-1 text-xs text-stone-600">
              Number of jobs created plus retained. Range 0 – 2150, typically 0–25. Required.
            </p>
            {getFieldError('jobs_supported') && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {getFieldError('jobs_supported')}
              </p>
            )}
          </div>

          {/* Is Franchise Toggle */}
          <div className="md:col-span-2 lg:col-span-3 pt-2">
            <label htmlFor="field-is-franchise" className="flex items-center gap-3 cursor-pointer">
              <input
                id="field-is-franchise"
                type="checkbox"
                checked={formData.is_franchise}
                onChange={(e) => updateField('is_franchise', e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
              />
              <span className="text-sm font-medium text-stone-900">
                Is this business a franchise?
              </span>
            </label>
            <p className="ml-7 mt-0.5 text-xs text-stone-600">
              Operating under an SBA-recognized national or regional franchise agreement.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: LENDER DETAILS (RECOMMENDED) */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-700">
            <Landmark className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-stone-900">3. Lender Details</h4>
              <span className="rounded bg-stone-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-stone-700 tracking-wider">
                Recommended
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-600 leading-relaxed max-w-3xl">
              If you know the lender, entering their details gives a noticeably more accurate estimate, because the model factors in that lender&apos;s historical default record. If you leave these blank, the average across all lenders is used instead and the result will be less specific to your situation.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Lender Type */}
          <div>
            <label
              htmlFor="field-lender-type"
              className="block text-xs font-semibold text-stone-800"
            >
              Type of Lender <span className="text-red-500">*</span>
            </label>
            <select
              id="field-lender-type"
              value={formData.lender_type}
              onChange={(e) => updateField('lender_type', e.target.value)}
              disabled={isLoading}
              className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
              required
            >
              {LENDER_TYPES.map((lt) => (
                <option key={lt.value} value={lt.value}>
                  {lt.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-stone-600">Institutional category of underwriting lender.</p>
          </div>

          {/* Bank Name (Optional) */}
          <div>
            <label
              htmlFor="field-bank-name"
              className="block text-xs font-semibold text-stone-800"
            >
              Lender Name (optional)
            </label>
            <input
              id="field-bank-name"
              type="text"
              value={formData.bank_name || ''}
              onChange={(e) =>
                updateField('bank_name', e.target.value ? e.target.value : null)
              }
              disabled={isLoading}
              className="mt-1.5 block w-full rounded-lg border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
              placeholder="e.g., BOKF, National Association"
            />
            <p className="mt-1 text-xs text-stone-600">
              Leave blank if you don&apos;t know which lender yet. The overall average will be used.
            </p>
          </div>

          {/* Bank State (Optional) */}
          <div>
            <label
              htmlFor="field-bank-state"
              className="block text-xs font-semibold text-stone-800"
            >
              Lender&apos;s State (optional)
            </label>
            <select
              id="field-bank-state"
              value={formData.bank_state || ''}
              onChange={(e) =>
                updateField('bank_state', e.target.value ? e.target.value : null)
              }
              disabled={isLoading}
              className="mt-1.5 block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-300"
            >
              <option value="">— None / Not specified —</option>
              {US_STATES.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-stone-600">
              Used to check whether the lender is based in the borrower&apos;s own state.
            </p>
          </div>
        </div>
      </div>

      {/* Form Submission Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          id="predict-submit-button"
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-stone-800 disabled:opacity-60 transition-all cursor-pointer"
        >
          <Send className="h-4 w-4" />
          {isLoading ? 'Calculating Risk Probability...' : 'Calculate Charge-Off Risk'}
        </button>
      </div>
    </form>
  );
};
