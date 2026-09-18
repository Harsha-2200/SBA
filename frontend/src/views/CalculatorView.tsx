import React, { useRef, useState } from 'react';
import { SbaPredictionRequest, SbaPredictionResponse } from '../types/sba';
import { DEFAULT_FORM_STATE } from '../constants/sbaData';
import { predictRisk, ApiError } from '../services/api';
import { RiskForm } from '../components/calculator/RiskForm';
import { ResultCard } from '../components/calculator/ResultCard';
import { WakeupIndicator } from '../components/calculator/WakeupIndicator';

export const CalculatorView: React.FC = () => {
  const [formData, setFormData] = useState<SbaPredictionRequest>({
    ...DEFAULT_FORM_STATE,
  });
  const [result, setResult] = useState<SbaPredictionResponse | null>(null);
  const [lastSubmittedPayload, setLastSubmittedPayload] =
    useState<SbaPredictionRequest | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const resultRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async () => {
    setIsLoading(true);
    setElapsedSeconds(0);
    setErrorMessage(null);
    setFieldErrors({});

    try {
      const response = await predictRisk(formData, (seconds) => {
        setElapsedSeconds(seconds);
      });
      setResult(response);
      setLastSubmittedPayload({ ...formData });

      // Smooth scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message);
        if (err.fieldErrors) {
          setFieldErrors(err.fieldErrors);
        }
      } else {
        setErrorMessage('An unexpected error occurred while communicating with the model.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ ...DEFAULT_FORM_STATE });
    setResult(null);
    setLastSubmittedPayload(null);
    setErrorMessage(null);
    setFieldErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleModify = () => {
    setResult(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header section */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
          SBA Loan Charge-Off Risk Calculator
        </h1>
        <p className="mt-1 text-sm text-stone-600 max-w-3xl leading-relaxed">
          Enter the loan details below to get an estimated default risk.
        </p>
      </div>

      {/* Wake-up & Loading Indicator */}
      {isLoading && <WakeupIndicator elapsedSeconds={elapsedSeconds} />}

      {/* Result Card (shown when prediction succeeds) */}
      <div ref={resultRef}>
        {result && lastSubmittedPayload && (
          <div className="mb-8">
            <ResultCard
              result={result}
              loanData={lastSubmittedPayload}
              onReset={handleReset}
              onModify={handleModify}
            />
          </div>
        )}
      </div>

      {/* Main Form */}
      <RiskForm
        formData={formData}
        onChange={setFormData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        onReset={handleReset}
        errorMessage={errorMessage}
        fieldErrors={fieldErrors}
      />
    </div>
  );
};
