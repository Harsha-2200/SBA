import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Building,
  Scale,
  Percent,
  CheckCircle2,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: 'home' | 'calculator' | 'about') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-stone-200 bg-white p-8 sm:p-12 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-800">
            <ShieldCheck className="h-3.5 w-3.5 text-stone-700" />
            SBA 7(a) Loan Risk Assessment
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl lg:text-5xl leading-tight">
            Check the default risk on an SBA loan before you approve it.
          </h1>

          <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed">
            Get an instant estimate of whether a US Small Business Administration 7(a) loan is likely to default. Compare any loan against the national average before submitting or approving an application.
          </p>

          {/* Meaningful Context: 7.93% Baseline Stat */}
          <div className="mt-8 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-900">
                  <Percent className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-amber-900 font-mono">
                      7.93%
                    </span>
                    <span className="text-sm font-semibold text-stone-900">
                      National Average Default Rate
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-0.5">
                    The historical baseline for completed SBA 7(a) loans. Your loan&apos;s estimated risk is directly compared against this benchmark.
                  </p>
                </div>
              </div>

              <div className="hidden sm:block text-right shrink-0 border-l border-amber-200/80 pl-6">
                <div className="text-xs font-semibold text-stone-700 uppercase tracking-wider">
                  Review Threshold
                </div>
                <div className="text-lg font-bold text-stone-900 mt-0.5">
                  30.0%
                </div>
                <div className="text-[11px] text-stone-500">
                  Flagged for underwriting review
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              id="hero-cta-button"
              type="button"
              onClick={() => onNavigate('calculator')}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-stone-800 transition-all cursor-pointer"
            >
              Calculate Loan Risk
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              id="hero-about-button"
              type="button"
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
            >
              How It Works & Data Source
            </button>
          </div>
        </div>
      </section>

      {/* Target Audiences: Lenders vs Borrowers in Plain Language */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-700">
            Who This Tool Is For
          </h2>
          <p className="mt-1 text-2xl font-bold tracking-tight text-stone-900">
            Built for lenders assessing loans and business owners preparing to apply
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Lenders */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-800">
                <Building className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-stone-900">For Lenders & Loan Officers</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                Screen inbound applications quickly before spending hours assembling credit packages.
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Spot higher-risk loans before sending them to the credit committee</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>See immediately if an application crosses the 30% review threshold</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Compare any loan directly to the 7.93% national average default rate</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => onNavigate('calculator')}
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 inline-flex items-center gap-1 cursor-pointer"
              >
                Assess a loan application <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Small Business Owners */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-stone-800">
                <Scale className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-stone-900">For Small Business Owners</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                Find out what lenders look at and understand your loan&apos;s risk profile before you apply.
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>See how changing your loan term or amount impacts your estimated risk</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Check how offering collateral or operating as a franchise affects your chances</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>Walk into lender conversations knowing how your loan compares to the average</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => onNavigate('calculator')}
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 inline-flex items-center gap-1 cursor-pointer"
              >
                Check your loan profile <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
