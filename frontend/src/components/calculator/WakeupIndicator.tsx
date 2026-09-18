import React from 'react';
import { Loader2, Server, Clock } from 'lucide-react';

interface WakeupIndicatorProps {
  elapsedSeconds: number;
}

export const WakeupIndicator: React.FC<WakeupIndicatorProps> = ({ elapsedSeconds }) => {
  return (
    <div
      id="wakeup-indicator-box"
      className="my-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
        <div className="flex-1 text-sm text-stone-800">
          <div className="flex flex-wrap items-center justify-between gap-2 font-semibold text-stone-900">
            <span>Calculating Risk Probability</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-100/90 px-2 py-0.5 text-xs font-mono text-amber-900">
              <Clock className="h-3.5 w-3.5" />
              {elapsedSeconds}s elapsed
            </span>
          </div>

          <p className="mt-1.5 text-xs leading-relaxed text-stone-700 font-medium">
            Waking up the prediction service, this can take up to a minute on the first request.
          </p>

          <p className="mt-1 text-xs text-stone-600">
            Render&apos;s free tier sleeps after periods of inactivity. Once the backend server initializes, subsequent calculations complete in milliseconds.
          </p>

          {elapsedSeconds > 25 && (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-amber-900">
              <Server className="h-4 w-4 shrink-0 text-amber-700" />
              <span>Starting up container and loading model into memory... (Timeout: 95 seconds)</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
