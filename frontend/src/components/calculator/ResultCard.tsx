import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Sliders,
  TrendingDown,
  TrendingUp,
  Info,
} from 'lucide-react';
import { SbaPredictionRequest, SbaPredictionResponse } from '../../types/sba';

interface ResultCardProps {
  result: SbaPredictionResponse;
  loanData: SbaPredictionRequest;
  onReset: () => void;
  onModify: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  loanData,
  onReset,
  onModify,
}) => {
  const {
    risk_percentage,
    baseline_percentage,
    times_baseline,
    flagged,
    threshold_used,
    charge_off_probability,
  } = result;

  // Derive risk band:
  // under 7.93% = Low (green)
  // 7.93% to 30% = Elevated (amber)
  // 30% and above = High (red)
  const isHigh = risk_percentage >= 30.0;
  const isElevated = risk_percentage >= 7.93 && risk_percentage < 30.0;

  let bandLabel = 'Low';
  let bandRange = 'under 7.93%';
  let bandClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let badgeColor = 'bg-emerald-600 text-white';
  let BandIcon = CheckCircle;

  if (isHigh) {
    bandLabel = 'High';
    bandRange = '30% and above';
    bandClass = 'bg-red-50 text-red-900 border-red-200';
    badgeColor = 'bg-red-600 text-white';
    BandIcon = AlertOctagon;
  } else if (isElevated) {
    bandLabel = 'Elevated';
    bandRange = '7.93% to 30%';
    bandClass = 'bg-amber-50 text-amber-900 border-amber-200';
    badgeColor = 'bg-amber-600 text-white';
    BandIcon = AlertTriangle;
  }

  // Format currency
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(loanData.gross_approval);

  // Baseline comparison text
  const isBelowBaseline = times_baseline < 1;
  const thresholdDisplay = threshold_used <= 1 ? (threshold_used * 100).toFixed(0) : threshold_used.toFixed(0);

  return (
    <div
      id="prediction-result-card"
      className="overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-sm"
    >
      {/* Top Banner with Risk Band */}
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4 ${bandClass}`}>
        <div className="flex items-center gap-2.5">
          <BandIcon className="h-6 w-6 shrink-0" />
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider">Risk Band</span>
            <div className="text-lg font-bold leading-tight">
              {bandLabel} <span className="text-sm font-medium opacity-90">({bandRange})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${badgeColor}`}
          >
            {flagged ? 'FLAGGED FOR UNDERWRITING REVIEW' : 'STANDARD PROCESSING'}
          </span>
        </div>
      </div>

      {/* Main Result Metric */}
      <div className="p-6 sm:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Headline score */}
          <div className="lg:col-span-7">
            <span className="text-xs font-semibold uppercase text-stone-700 tracking-wider">
              Prediction Result
            </span>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span
                  id="result-risk-percentage"
                  className={`text-5xl sm:text-6xl font-black tracking-tight ${
                    isHigh
                      ? 'text-red-600'
                      : isElevated
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                  }`}
                >
                  {risk_percentage.toFixed(1)}%
                </span>
                <span className="text-lg sm:text-xl font-bold text-stone-900">
                  estimated charge-off risk
                </span>
              </div>
            </div>

            {/* Context vs baseline */}
            <div className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-stone-200/80 p-1.5 text-stone-700">
                  {isBelowBaseline ? (
                    <TrendingDown className="h-4 w-4 text-emerald-700" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-amber-700" />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-900">
                    {isBelowBaseline ? (
                      <span>
                        This is <strong className="text-emerald-700">lower than the average SBA loan</strong> ({times_baseline}× baseline of {baseline_percentage}%)
                      </span>
                    ) : (
                      <span>
                        This is <strong className="text-amber-700">{times_baseline}×</strong> the average SBA loan (baseline: {baseline_percentage}%)
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-stone-600 leading-relaxed">
                    The baseline charge-off rate across all 428,361 completed SBA 7(a) loans from FY2010–FY2019 is{' '}
                    <strong>{baseline_percentage}%</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Threshold & Flag Note */}
            <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-stone-200/80 bg-white p-3.5 text-xs text-stone-700">
              <Info className="h-4 w-4 shrink-0 text-stone-600 mt-0.5" />
              <div>
                Loans at or above the <strong>{thresholdDisplay}%</strong> threshold would be flagged for review. This loan{' '}
                {flagged ? (
                  <strong className="text-red-700">is flagged for review</strong>
                ) : (
                  <strong className="text-emerald-800">is not flagged for review</strong>
                )}.
              </div>
            </div>
          </div>

          {/* Loan Summary Preview */}
          <div className="rounded-xl border border-stone-200 bg-stone-50/60 p-5 lg:col-span-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
              Loan Application Snapshot
            </h4>
            <dl className="mt-3 space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <dt className="text-stone-600">Gross Approval:</dt>
                <dd className="font-semibold text-stone-900">{formattedAmount}</dd>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <dt className="text-stone-600">Term & Rate:</dt>
                <dd className="font-medium text-stone-900">
                  {loanData.term_months} mos @ {loanData.interest_rate}% ({loanData.rate_type === 'F' ? 'Fixed' : 'Variable'})
                </dd>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <dt className="text-stone-600">Programme:</dt>
                <dd className="font-medium text-stone-900 text-right truncate max-w-[180px]" title={loanData.processing_method}>
                  {loanData.processing_method}
                </dd>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <dt className="text-stone-600">Business Structure:</dt>
                <dd className="font-medium text-stone-900">{loanData.business_type}</dd>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <dt className="text-stone-600">State & Jobs:</dt>
                <dd className="font-medium text-stone-900">
                  {loanData.borr_state} • {loanData.jobs_supported} jobs
                </dd>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <dt className="text-stone-600">Collateral / Revolver:</dt>
                <dd className="font-medium text-stone-900">
                  {loanData.collateral === 'Y' ? 'Secured' : 'Unsecured'} / {loanData.revolver === 'Y' ? 'Line' : 'Term'}
                </dd>
              </div>
              {loanData.bank_name && (
                <div className="flex justify-between pt-0.5">
                  <dt className="text-stone-600">Lender:</dt>
                  <dd className="font-medium text-stone-900 truncate max-w-[180px]" title={loanData.bank_name}>
                    {loanData.bank_name} {loanData.bank_state ? `(${loanData.bank_state})` : ''}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-6">
          <button
            id="calculate-another-button"
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            Calculate another
          </button>

          <button
            id="modify-parameters-button"
            type="button"
            onClick={onModify}
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            <Sliders className="h-4 w-4" />
            Adjust Current Inputs
          </button>
        </div>
      </div>
    </div>
  );
};
