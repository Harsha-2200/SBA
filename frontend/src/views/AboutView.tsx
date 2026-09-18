import React from 'react';
import {
  Database,
  Cpu,
  BarChart,
  AlertTriangle,
  FileText,
  ExternalLink,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-12 pb-16">
      {/* Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-800">
          <FileText className="h-3.5 w-3.5" />
          Technical Documentation & Data Provenance
        </div>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          About the SBA Charge-Off Prediction Model
        </h1>
        <p className="mt-2 text-base text-stone-600 max-w-3xl leading-relaxed">
          Comprehensive details regarding the training data, machine learning architecture, validation metrics, and analytical limitations of the SBA 7(a) risk prediction system.
        </p>
      </div>

      {/* Dataset & Provenance */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-800">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">1. Data Source & Scope</h2>
            <p className="text-xs text-stone-500">US SBA 7(a) Guaranteed Loan Open Data</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-3 text-sm text-stone-700 leading-relaxed">
            <p>
              The training corpus originates from official <strong>Freedom of Information Act (FOIA)</strong> public disclosure records published by the US Small Business Administration for the <strong>7(a) loan guarantee programme</strong>.
            </p>
            <p>
              The dataset covers completed loans originated between <strong>Fiscal Year 2010 and Fiscal Year 2019</strong>, filtering for loans that reached definitive closure (either paid in full or charged off as a loss).
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-stone-50/70 p-4 text-xs space-y-2.5">
            <div className="flex justify-between border-b border-stone-200 pb-2 font-medium">
              <span className="text-stone-600">Total Completed Records:</span>
              <span className="font-bold text-stone-900 font-mono">428,361 loans</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2 font-medium">
              <span className="text-stone-600">Time Horizon:</span>
              <span className="font-bold text-stone-900">FY 2010 – FY 2019</span>
            </div>
            <div className="flex justify-between border-b border-stone-200 pb-2 font-medium">
              <span className="text-stone-600">Baseline Charge-Off Rate:</span>
              <span className="font-bold text-amber-700 font-mono">7.93%</span>
            </div>
            <div className="flex justify-between font-medium">
              <span className="text-stone-600">Legal Classification:</span>
              <span className="text-stone-900">Public Domain / US Federal Open Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Model & Evaluation */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-800">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">2. Model Architecture & Performance</h2>
            <p className="text-xs text-stone-500">XGBoost Binary Classification Engine</p>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <p className="text-sm text-stone-700 leading-relaxed max-w-3xl">
            The target variable is <code>LoanStatus</code>: <strong>1 = Charged Off</strong> (written off as a bad debt / financial loss), and <strong>0 = Paid in Full</strong>. An extreme gradient boosting classifier (<strong>XGBoost</strong>) was trained and evaluated on held-out test splits across 428,361 historical loan records.
          </p>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="text-xs font-semibold uppercase text-stone-500">Test PR-AUC</div>
              <div className="mt-1 text-3xl font-black text-stone-900">0.804</div>
              <div className="mt-1 text-[11px] text-stone-500">Precision-Recall Area Under Curve</div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="text-xs font-semibold uppercase text-stone-500">Precision</div>
              <div className="mt-1 text-3xl font-black text-stone-900">0.812</div>
              <div className="mt-1 text-[11px] text-stone-500">Positive Predictive Value</div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="text-xs font-semibold uppercase text-stone-500">Recall</div>
              <div className="mt-1 text-3xl font-black text-stone-900">0.690</div>
              <div className="mt-1 text-[11px] text-stone-500">Charge-off Detection Rate</div>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="text-xs font-semibold uppercase text-stone-500">Test F1-Score</div>
              <div className="mt-1 text-3xl font-black text-stone-900">0.746</div>
              <div className="mt-1 text-[11px] text-stone-500">Harmonic Mean of Precision/Recall</div>
            </div>
          </div>
        </div>
      </section>

      {/* 16 Approval-Time Factors Section */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-800">
            <BarChart className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">3. The 16 Approval-Time Features</h2>
            <p className="text-xs text-stone-500">Strictly using information available prior to loan disbursement</p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm text-stone-700 leading-relaxed">
          <p>
            The model was deliberately designed to operate exclusively on information available at loan approval time, avoiding post-origination bias or forward-looking survivorship artifacts.
          </p>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 pt-2">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wide">Loan Structure (7 Factors)</h3>
              <ul className="mt-2.5 space-y-1 text-xs text-stone-600">
                <li>• <code>gross_approval</code> (Total loan amount)</li>
                <li>• <code>term_months</code> (Amortization duration)</li>
                <li>• <code>interest_rate</code> (Annual percentage)</li>
                <li>• <code>rate_type</code> (Fixed vs Variable)</li>
                <li>• <code>revolver</code> (Term vs Revolving)</li>
                <li>• <code>collateral</code> (Secured with physical assets)</li>
                <li>• <code>processing_method</code> (SBA delivery programme)</li>
              </ul>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wide">Business Profile (6 Factors)</h3>
              <ul className="mt-2.5 space-y-1 text-xs text-stone-600">
                <li>• <code>naics_code</code> (Industry sector classification)</li>
                <li>• <code>borr_state</code> (Borrower state / territory)</li>
                <li>• <code>business_type</code> (Corporate entity structure)</li>
                <li>• <code>business_age</code> (Operating track record)</li>
                <li>• <code>jobs_supported</code> (Jobs created + retained)</li>
                <li>• <code>is_franchise</code> (Franchise affiliation)</li>
              </ul>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <h3 className="font-bold text-stone-900 text-xs uppercase tracking-wide">Lender Profiling (3 Factors)</h3>
              <ul className="mt-2.5 space-y-1 text-xs text-stone-600">
                <li>• <code>lender_type</code> (Bank, Credit Union, non-bank)</li>
                <li>• <code>bank_name</code> (Historical lender lookup)</li>
                <li>• <code>bank_state</code> (In-state vs out-of-state origination)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Preprocessing Architecture */}
      <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-800">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">4. Backend Feature Engineering Pipeline</h2>
            <p className="text-xs text-stone-500">Automated raw-to-feature transformations</p>
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm text-stone-700 leading-relaxed">
          <p>
            Feature preprocessing is executed entirely within the FastAPI service layer prior to running inference through the serialized XGBoost artifact:
          </p>
          <ul className="space-y-2.5 text-xs text-stone-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <span><strong>NAICS 3-Digit Mapping:</strong> The backend slices the first 3 characters of the 6-digit NAICS code to aggregate broad industry default vectors. Code <code>999000</code> is mapped to "Other".</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <span><strong>Lender Charge-Off History:</strong> When a lender name is supplied, the backend looks up that specific lender's historical charge-off rate. If empty or unrecognized, it falls back to the nationwide baseline (7.93%).</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <span><strong>In-State Lending Feature:</strong> Evaluates whether the borrower state and lender state match to capture local versus non-local underwriting performance differences.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
              <span><strong>Categorical One-Hot / Target Encodings:</strong> Converts the raw 13 programme types, 3 business structures, and 4 business ages into the exact column order required by the model.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Model Limitations & Disclaimers */}
      <section className="rounded-2xl border border-stone-200 bg-amber-50/50 p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-amber-200/80 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-stone-900">5. Known Limitations & Disclaimers</h2>
            <p className="text-xs text-stone-500">Contextual underwriting boundaries</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 text-xs text-stone-700 leading-relaxed">
          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 uppercase tracking-wide">Approval-Time Bias</h3>
            <p>
              The model evaluates only variables available when the loan was authorized. It does not account for post-disbursement management changes, macroeconomic crises (such as the COVID-19 pandemic), or local regulatory disruptions.
            </p>
            <h3 className="font-bold text-stone-900 uppercase tracking-wide">Historical Conditioning</h3>
            <p>
              Loans originating in FY2010–FY2019 reflect the economic recovery following the 2008 Great Recession. Changes in current SBA SOP guidelines or federal interest rate environments may cause real-world drift.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-stone-900 uppercase tracking-wide">Non-Deterministic Credit Decisions</h3>
            <p>
              This web application and the underlying model are informational and analytical tools. They do not represent an official SBA loan guarantee commitment, nor do they replace individual lender credit policies, character assessments, or debt-service coverage ratio (DSCR) audits.
            </p>
            <div className="rounded-lg border border-amber-300 bg-amber-100/60 p-3 text-amber-950 font-medium">
              Fair Lending Note: Model outputs should never be used as the sole determinant for adverse action notices or credit discrimination.
            </div>
          </div>
        </div>
      </section>

      {/* External Links */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-700">
        <a
          href="https://sba-e8d3.onrender.com/docs"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 hover:bg-stone-50 hover:text-stone-900 transition-colors"
        >
          FastAPI Interactive Swagger Docs
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <a
          href="https://sba-e8d3.onrender.com/openapi.json"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-4 py-2 hover:bg-stone-50 hover:text-stone-900 transition-colors"
        >
          OpenAPI Specification JSON
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
};
