import React, { useEffect, useState } from 'react';
import { ShieldAlert, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';
import { checkModelHealth } from '../../services/api';

interface NavbarProps {
  currentView: 'home' | 'calculator' | 'about';
  onNavigate: (view: 'home' | 'calculator' | 'about') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [healthStatus, setHealthStatus] = useState<
    'checking' | 'healthy' | 'unreachable'
  >('checking');

  useEffect(() => {
    let isMounted = true;
    checkModelHealth()
      .then((res) => {
        if (isMounted) {
          setHealthStatus(
            res.status === 'healthy' || res.model_loaded ? 'healthy' : 'unreachable',
          );
        }
      })
      .catch(() => {
        if (isMounted) {
          setHealthStatus('unreachable');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-stone-50/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          id="nav-brand-button"
          onClick={() => onNavigate('home')}
          className="flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 text-amber-400 shadow-sm">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <span className="block font-semibold text-stone-900 leading-tight tracking-tight">
              SBA Loan Risk Predictor
            </span>
            <span className="block text-xs text-stone-700">
              7(a) Charge-Off ML System
            </span>
          </div>
        </button>

        {/* Navigation items */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            id="nav-home-link"
            onClick={() => onNavigate('home')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              currentView === 'home'
                ? 'bg-stone-200/80 text-stone-900'
                : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            Home
          </button>
          <button
            id="nav-calculator-link"
            onClick={() => onNavigate('calculator')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              currentView === 'calculator'
                ? 'bg-stone-900 text-stone-50 shadow-sm'
                : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            Risk Calculator
          </button>
          <button
            id="nav-about-link"
            onClick={() => onNavigate('about')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              currentView === 'about'
                ? 'bg-stone-200/80 text-stone-900'
                : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            About
          </button>

          {/* Model Health Indicator Pill */}
          <div
            id="nav-health-indicator"
            title={
              healthStatus === 'healthy'
                ? 'Backend model is loaded & active'
                : healthStatus === 'checking'
                  ? 'Checking backend model status...'
                  : 'Backend service may be asleep or starting up'
            }
            className="ml-2 hidden items-center gap-1.5 rounded-full border border-stone-200 bg-white px-2.5 py-1 text-xs text-stone-700 md:flex"
          >
            {healthStatus === 'healthy' && (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                <span className="font-medium text-stone-800">Model Ready</span>
              </>
            )}
            {healthStatus === 'checking' && (
              <>
                <Activity className="h-3.5 w-3.5 animate-pulse text-amber-500" />
                <span className="font-medium text-stone-700">Connecting</span>
              </>
            )}
            {healthStatus === 'unreachable' && (
              <>
                <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                <span className="font-medium text-stone-700">Standby</span>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
