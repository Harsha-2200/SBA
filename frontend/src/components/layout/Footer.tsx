import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'calculator' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-stone-200 bg-stone-100 text-stone-600">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2 text-stone-900">
              <ShieldCheck className="h-4 w-4 text-amber-700" />
              <span className="text-sm font-semibold">SBA Loan Charge-Off Risk Predictor</span>
            </div>
            <p className="mt-1 text-xs text-stone-600 max-w-xl leading-relaxed">
              Trained on 428,361 completed US SBA 7(a) guaranteed loans (FY2010–FY2019 FOIA open dataset).
              Built for risk assessment and educational analysis using approval-time data.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-700">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-stone-900 transition-colors"
            >
              Home
            </button>
            <span className="text-stone-300">•</span>
            <button
              onClick={() => onNavigate('calculator')}
              className="hover:text-stone-900 transition-colors"
            >
              Calculator
            </button>
            <span className="text-stone-300">•</span>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-stone-900 transition-colors"
            >
              Methodology & Limitations
            </button>
            <span className="text-stone-300">•</span>
            <a
              href="https://sba-e8d3.onrender.com/docs"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-stone-900 transition-colors"
            >
              API Docs
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-stone-200/80 pt-4 text-center md:text-left text-xs text-stone-500">
          Disclaimer: This tool provides statistical risk estimates based on historical loan outcomes. It does not constitute an official credit determination, guarantee, or formal SBA underwriting decision.
        </div>
      </div>
    </footer>
  );
};
